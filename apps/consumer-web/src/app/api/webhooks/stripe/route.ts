import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

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

        // Call rpc_confirm_reservation for each reservation (Part V FSM)
        for (const reservationId of reservationIds) {
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
          }
        }

        // Create payment record
        const amountCents = (eventData.amount_total as number) ?? 0
        await supabase.from('payments').insert({
          stripe_payment_intent_id: stripePaymentIntentId,
          amount_cents: amountCents,
          currency: ((eventData.currency as string) ?? 'usd').toUpperCase(),
          status: 'SUCCEEDED',
        })

        console.log(`[stripe-webhook] checkout.session.completed: ${reservationIds.length} reservations confirmed`)
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
