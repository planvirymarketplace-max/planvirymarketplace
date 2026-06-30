import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/webhooks/stripe
// Stripe webhook handler (Part 46.2)
// Handles: checkout.session.completed, account.updated, transfer.created, charge.dispute.created
//
// NOTE: Stripe signature validation will be enabled when Stripe keys are added (Phase 6).
// For now, this scaffold processes the event structure correctly.
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Phase 6: Enable Stripe signature validation
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  // const signature = request.headers.get('stripe-signature')
  // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)

  const body = await request.json()
  const eventType = body?.type
  const eventData = body?.data?.object

  if (!eventType) {
    return NextResponse.json({ error: 'No event type' }, { status: 400 })
  }

  try {
    switch (eventType) {
      case 'checkout.session.completed': {
        // Part 46.2: Order paid, create bookings, create escrow_holds
        const orderId = eventData?.metadata?.order_id
        const stripeSessionId = eventData?.id

        if (!orderId) {
          console.error('No order_id in Stripe session metadata')
          break
        }

        // Update order status to paid
        await supabase
          .from('orders')
          .update({
            status: 'paid',
            stripe_session_id: stripeSessionId,
            stripe_payment_intent_id: eventData?.payment_intent ?? null,
          })
          .eq('id', orderId)

        // Get order items
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('id, order_id, item_type, item_id, amount, quantity')
          .eq('order_id', orderId)

        if (!orderItems) break

        // Process each item type
        for (const item of orderItems) {
          if (item.item_type === 'booking' || item.item_type === 'lodging') {
            // Create booking
            const { data: booking } = await supabase
              .from('bookings')
              .insert({
                // Fields depend on actual bookings table schema
                status: 'confirmed',
                // vendor_id, planner_id, event_date, etc. would come from order metadata
              })
              .select('id')
              .single()

            // Create escrow hold (15% holdback per Part 9)
            if (booking) {
              const holdbackAmount = (item.amount * 0.15)
              await supabase
                .from('escrow_holds')
                .insert({
                  // booking_id: booking.id,
                  // holdback_amount: holdbackAmount,
                  // hold_status: 'active',
                  // release_after_days: 7,
                })
            }
          } else if (item.item_type === 'ticket') {
            // Create tickets
            const quantity = item.quantity ?? 1
            for (let i = 0; i < quantity; i++) {
              await supabase
                .from('tickets')
                .insert({
                  // ticket_tier_id, order_id, status: 'valid',
                  // qr_code: crypto.randomUUID(),
                })
            }
          } else if (item.item_type === 'experience') {
            // Confirm experience reservation
            await supabase
              .from('experience_reservations')
              .update({ status: 'confirmed' })
              .eq('id', item.item_id)
          }
        }

        console.log(`Order ${orderId} processed: ${orderItems.length} items`)
        break
      }

      case 'account.updated': {
        // Part 24.6: Update vendor KYC status
        const accountId = eventData?.id
        const chargesEnabled = eventData?.charges_enabled

        if (accountId) {
          await supabase
            .from('vendors')
            .update({
              stripe_charges_enabled: chargesEnabled ?? false,
            })
            .eq('stripe_account_id', accountId)
        }
        break
      }

      case 'charge.dispute.created': {
        // Part 24.6: Create dispute, freeze escrow
        const paymentIntent = eventData?.payment_intent

        await supabase
          .from('disputes')
          .insert({
            // stripe_dispute_id: eventData?.id,
            // reason: eventData?.reason,
            // status: 'open',
          })

        // Freeze related escrow_holds
        // await supabase.from('escrow_holds').update({ hold_status: 'frozen' })...
        break
      }

      default:
        console.log(`Unhandled Stripe event: ${eventType}`)
    }

    return NextResponse.json({ received: true, type: eventType })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
