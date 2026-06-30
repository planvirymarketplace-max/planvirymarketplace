import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'
import { randomUUID } from 'crypto'

// POST /api/webhooks/stripe
// Stripe webhook handler — confirms reservations on payment success.
// Adapted from TicketiHub (signature verification) + movinin (booking confirmation).
// Calls rpc_confirm_reservation to transition PENDING → CONFIRMED (Part V FSM).

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  // Verify Stripe signature (TicketiHub pattern)
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err)
    return NextResponse.json({ error: `Invalid signature: ${err}` }, { status: 400 })
  }

  const supabase = createAdminClient()
  const eventType = event.type
  const eventData = event.data.object as Record<string, unknown>

  try {
    switch (eventType) {
      // ─── checkout.session.completed → confirm all reservations ───────────
      case 'checkout.session.completed': {
        const metadata = (eventData.metadata ?? {}) as Record<string, string>
        const reservationIdsJson = metadata.reservation_ids
        const stripePaymentIntentId = (eventData.payment_intent as string) ?? null

        if (!reservationIdsJson) {
          console.error('[stripe-webhook] no reservation_ids in session metadata')
          break
        }

        const reservationIds: string[] = JSON.parse(reservationIdsJson)

        // ─── Expire-on-late-payment (Hi.Events critical pattern) ───────────
        // If a payment arrives AFTER the reservation TTL expired, we must REFUND
        // and mark EXPIRED. This prevents overselling when two users race for the
        // last ticket and the first one's TTL expires before payment confirms.
        for (const reservationId of reservationIds) {
          const { data: reservation } = await supabase
            .from('reservations')
            .select('id, status, ttl_expires_at, item_id, quantity')
            .eq('id', reservationId)
            .maybeSingle()

          if (reservation && reservation.status === 'PENDING' && reservation.ttl_expires_at) {
            const ttlExpired = new Date(reservation.ttl_expires_at) < new Date()

            if (ttlExpired) {
              // The TTL has expired — this payment is too late.
              // Refund the payment immediately and expire the reservation.
              console.warn(`[stripe-webhook] LATE PAYMENT for ${reservationId} — TTL expired at ${reservation.ttl_expires_at}. Refunding.`)

              // Refund via Stripe
              const paymentIntentId = (eventData.payment_intent as string) ?? null
              if (paymentIntentId) {
                try {
                  await stripe.refunds.create({
                    payment_intent: paymentIntentId,
                    reason: 'requested_by_customer',
                  })
                } catch (refundErr) {
                  console.error(`[stripe-webhook] refund failed for ${paymentIntentId}:`, refundErr)
                }
              }

              // Expire the reservation + release capacity
              const { error: expireErr } = await supabase.rpc('rpc_expire_reservation', {
                p_reservation_id: reservationId,
              })
              if (expireErr) {
                // Fallback: direct update
                await supabase
                  .from('reservations')
                  .update({ status: 'EXPIRED', expired_at: new Date().toISOString() })
                  .eq('id', reservationId)
                  .eq('status', 'PENDING')

                // Release ticket_tiers capacity if this is an EVENT_TICKET
                const { data: item } = await supabase
                  .from('inventory_items')
                  .select('category')
                  .eq('id', reservation.item_id)
                  .maybeSingle()

                if (item?.category === 'EVENT_TICKET') {
                  const { data: tier } = await supabase
                    .from('ticket_tiers')
                    .select('id, quantity_reserved')
                    .eq('item_id', reservation.item_id)
                    .maybeSingle()

                  if (tier) {
                    await supabase
                      .from('ticket_tiers')
                      .update({ quantity_reserved: Math.max(0, tier.quantity_reserved - reservation.quantity) })
                      .eq('id', tier.id)
                  }
                }
              }

              // Emit domain event
              await supabase.from('domain_events').insert({
                event_type: 'reservation.expired_late_payment',
                entity_type: 'reservation',
                entity_id: reservationId,
                payload: { reason: 'payment_arrived_after_ttl', stripe_payment_intent_id: paymentIntentId },
              })

              continue // skip confirmation — this reservation is expired
            }
          }

          // ─── Normal path: confirm the reservation ───────────────────────
          const { data: confirmed, error: rpcErr } = await supabase.rpc('rpc_confirm_reservation', {
            p_reservation_id: reservationId,
            p_stripe_payment_intent_id: stripePaymentIntentId ?? '',
          })

          if (rpcErr) {
            console.error(`[stripe-webhook] confirm failed for ${reservationId}:`, rpcErr.message)
            // Fallback: direct update
            await supabase
              .from('reservations')
              .update({
                status: 'CONFIRMED',
                confirmed_at: new Date().toISOString(),
                stripe_payment_intent_id: stripePaymentIntentId,
              })
              .eq('id', reservationId)
              .eq('status', 'PENDING')
          } else {
            console.log(`[stripe-webhook] confirmed reservation ${reservationId}`)

          // ─── Fan-out notifications (Peppermint pattern) ─────────────────────
          // Notify the user (reservation confirmed) + vendor staff (new booking)
          const { data: resForNotif } = await supabase
            .from('reservations')
            .select('user_id, vendor_id, inventory_items!inner(title)')
            .eq('id', reservationId)
            .maybeSingle()

          if (resForNotif) {
            const eventTitle = Array.isArray(resForNotif.inventory_items) ? resForNotif.inventory_items[0]?.title : resForNotif.inventory_items?.title

            // Notify user
            await supabase.from('notifications').insert({
              user_id: resForNotif.user_id,
              notification_type: 'reservation.confirmed',
              channel: 'EMAIL',
              priority: 'HIGH',
              subject: `Booking confirmed: ${eventTitle ?? 'Your event'}`,
              body: `Your reservation has been confirmed. Reservation ID: ${reservationId}. Event: ${eventTitle ?? 'N/A'}.`,
              data_payload: { reservation_id: reservationId, event_title: eventTitle },
              status: 'QUEUED',
              rate_limit_category: 'NON_CRITICAL',
            })

            // Notify vendor staff
            const { data: staff } = await supabase
              .from('vendor_staff')
              .select('user_id')
              .eq('vendor_id', resForNotif.vendor_id)
              .eq('status', 'ACTIVE')

            if (staff && staff.length > 0) {
              await supabase.from('notifications').insert(
                staff.map((s: { user_id: string }) => ({
                  user_id: s.user_id,
                  notification_type: 'vendor.new_booking',
                  channel: 'IN_APP',
                  priority: 'HIGH',
                  subject: `New booking: ${eventTitle ?? 'New reservation'}`,
                  body: `A new booking has been confirmed. Reservation ID: ${reservationId}.`,
                  data_payload: { reservation_id: reservationId, event_title: eventTitle },
                  status: 'QUEUED',
                  rate_limit_category: 'NON_CRITICAL',
                })),
              )
            }
          }
          }

          // ─── Create per-attendee ticket_instances (Hi.Events pattern) ──────
          // One row per ticket in the reservation. Each gets its own QR secret.
          const { data: reservation } = await supabase
            .from('reservations')
            .select('id, user_id, item_id, quantity, user_profiles!inner(display_name, email)')
            .eq('id', reservationId)
            .maybeSingle()

          if (reservation) {
            const profile = Array.isArray(reservation.user_profiles) ? reservation.user_profiles[0] : reservation.user_profiles

            // Find the ticket_tier for this item
            const { data: tier } = await supabase
              .from('ticket_tiers')
              .select('id')
              .eq('item_id', reservation.item_id)
              .order('sort_order', { ascending: true })
              .limit(1)
              .maybeSingle()

            const instances = []
            for (let i = 0; i < (reservation.quantity as number); i++) {
              instances.push({
                reservation_id: reservationId,
                item_id: reservation.item_id,
                ticket_tier_id: tier?.id ?? '00000000-0000-0000-0000-000000000000',
                attendee_name: profile?.display_name ?? 'Attendee',
                attendee_email: profile?.email ?? '',
                qr_code_secret: randomUUID(), // unique per ticket instance
                status: 'ISSUED',
              })
            }
            if (instances.length > 0) {
              const { error: insErr } = await supabase.from('ticket_instances').insert(instances)
              if (insErr) {
                console.error(`[stripe-webhook] ticket_instances insert failed for ${reservationId}:`, insErr.message)
              } else {
                console.log(`[stripe-webhook] created ${instances.length} ticket_instances for ${reservationId}`)
              }
            }
          }
        }

        // Create payment record
        const amountCents = (eventData.amount_total as number) ?? 0
        const { data: payment } = await supabase.from('payments').insert({
          stripe_payment_intent_id: stripePaymentIntentId,
          amount_cents: amountCents,
          currency: ((eventData.currency as string) ?? 'usd').toUpperCase(),
          status: 'SUCCEEDED',
        }).select('id').single()

        // Create vendor_payouts records (Stripe Connect split — platform fee + vendor payout)
        const platformFeeCents = Math.round(amountCents * 0.10) // 10% platform fee
        const vendorPayoutCents = amountCents - platformFeeCents
        for (const reservationId of reservationIds) {
          const { data: res } = await supabase
            .from('reservations')
            .select('vendor_id, total_price_cents')
            .eq('id', reservationId)
            .maybeSingle()
          if (res?.vendor_id) {
            const proportionalPayout = Math.round(vendorPayoutCents * ((res.total_price_cents as number) / amountCents))
            await supabase.from('vendor_payouts').insert({
              vendor_id: res.vendor_id,
              payment_id: payment?.id,
              gross_cents: res.total_price_cents,
              platform_fee_cents: Math.round((res.total_price_cents as number) * 0.10),
              payout_cents: proportionalPayout,
              status: 'PENDING',
            })
          }
        }

        console.log(`[stripe-webhook] checkout.session.completed: ${reservationIds.length} reservations confirmed + ticket_instances + vendor_payouts created`)
        break
      }

      // ─── payment_intent.succeeded → confirm if checkout.session.completed missed ─
      case 'payment_intent.succeeded': {
        const metadata = (eventData.metadata ?? {}) as Record<string, string>
        const reservationIdsJson = metadata.reservation_ids
        const paymentIntentId = eventData.id as string

        if (!reservationIdsJson) {
          // Try to find reservations by payment_intent_id
          const { data: existing } = await supabase
            .from('reservations')
            .select('id, status')
            .eq('stripe_payment_intent_id', paymentIntentId)
          if (existing && existing.length > 0) {
            for (const r of existing as Array<{ id: string; status: string }>) {
              if (r.status === 'PENDING') {
                const { error: rpcErr } = await supabase.rpc('rpc_confirm_reservation', {
                  p_reservation_id: r.id,
                  p_stripe_payment_intent_id: paymentIntentId,
                })
                if (rpcErr) {
                  await supabase.from('reservations')
                    .update({ status: 'CONFIRMED', confirmed_at: new Date().toISOString(), stripe_payment_intent_id: paymentIntentId })
                    .eq('id', r.id).eq('status', 'PENDING')
                }
              }
            }
          }
          break
        }

        const reservationIds: string[] = JSON.parse(reservationIdsJson)
        for (const reservationId of reservationIds) {
          // Check if already confirmed (checkout.session.completed may have handled it)
          const { data: res } = await supabase
            .from('reservations')
            .select('status')
            .eq('id', reservationId)
            .maybeSingle()

          if (res?.status === 'PENDING') {
            const { error: rpcErr } = await supabase.rpc('rpc_confirm_reservation', {
              p_reservation_id: reservationId,
              p_stripe_payment_intent_id: paymentIntentId,
            })
            if (rpcErr) {
              await supabase.from('reservations')
                .update({ status: 'CONFIRMED', confirmed_at: new Date().toISOString(), stripe_payment_intent_id: paymentIntentId })
                .eq('id', reservationId).eq('status', 'PENDING')
            }
            console.log(`[stripe-webhook] payment_intent.succeeded confirmed ${reservationId}`)
          }
        }
        break
      }

      // ─── payment_intent.payment_failed → cancel reservations ─────────────
      case 'payment_intent.payment_failed': {
        const metadata = (eventData.metadata ?? {}) as Record<string, string>
        const reservationIdsJson = metadata.reservation_ids
        if (!reservationIdsJson) break

        const reservationIds: string[] = JSON.parse(reservationIdsJson)
        for (const reservationId of reservationIds) {
          const { error: rpcErr } = await supabase.rpc('rpc_cancel_reservation', {
            p_reservation_id: reservationId,
            p_reason: 'Payment failed',
            p_refund_amount_cents: 0,
          })

          if (rpcErr) {
            // Fallback: direct update
            await supabase
              .from('reservations')
              .update({ status: 'CANCELLED', cancelled_at: new Date().toISOString(), cancelled_reason: 'Payment failed' })
              .eq('id', reservationId)
              .eq('status', 'PENDING')
          }
        }
        break
      }

      // ─── charge.refunded → mark reservation refunded ─────────────────────
      case 'charge.refunded': {
        const paymentIntentId = eventData.payment_intent as string
        if (!paymentIntentId) break

        const { data: reservations } = await supabase
          .from('reservations')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntentId)

        for (const r of reservations ?? []) {
          await supabase
            .from('reservations')
            .update({ status: 'CANCELLED', cancelled_at: new Date().toISOString(), cancelled_reason: 'Refunded', refund_amount_cents: (eventData.amount_refunded as number) ?? 0 })
            .eq('id', (r as { id: string }).id)
        }
        break
      }

      // ─── account.updated → Stripe Connect KYC sync ───────────────────────
      case 'account.updated': {
        const accountId = eventData.id as string
        const chargesEnabled = eventData.charges_enabled as boolean
        const payoutsEnabled = eventData.payouts_enabled as boolean

        if (accountId) {
          await supabase
            .from('vendor_accounts')
            .update({ stripe_connect_account_id: accountId })
            .eq('stripe_connect_account_id', accountId)
        }
        break
      }

      default:
        console.log(`[stripe-webhook] unhandled event: ${eventType}`)
    }

    return NextResponse.json({ received: true, type: eventType })
  } catch (error) {
    console.error('[stripe-webhook] handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
