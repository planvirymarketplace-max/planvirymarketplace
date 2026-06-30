import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

// POST /api/orders/[id]/refund — initiate refund for a confirmed reservation
// Calls Stripe refund API + updates reservation status.
// Adapted from Hi.Events: RefundOrderHandler, ChargeRefundUpdatedHandler

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id: reservationId } = await params
  const body = await request.json().catch(() => ({}))
  const { amount_cents, reason = 'requested_by_customer' } = body

  // Load reservation
  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, status, user_id, total_price_cents, stripe_payment_intent_id, item_id, quantity')
    .eq('id', reservationId)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  if (reservation.status !== 'CONFIRMED' && reservation.status !== 'COMPLETED') {
    return NextResponse.json({ error: `Cannot refund ${reservation.status} reservation` }, { status: 409 })
  }

  // RLS: user owns it or is admin
  if (reservation.user_id !== user.id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const refundAmount = amount_cents ?? reservation.total_price_cents

  // Call Stripe refund
  let stripeRefundId = null
  if (reservation.stripe_payment_intent_id) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: reservation.stripe_payment_intent_id,
        amount: refundAmount,
        reason: reason as Stripe.RefundCreateParams.Reason,
      })
      stripeRefundId = refund.id
    } catch (err) {
      console.error('[refund] Stripe error:', err)
      return NextResponse.json({ error: 'Stripe refund failed' }, { status: 502 })
    }
  }

  // Update reservation
  const { error } = await supabase
    .from('reservations')
    .update({
      status: 'CANCELLED',
      cancelled_at: new Date().toISOString(),
      cancelled_reason: `Refunded: ${reason}`,
      stripe_refund_id: stripeRefundId,
      refund_amount_cents: refundAmount,
    })
    .eq('id', reservationId)

  if (error) return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 })

  // Release ticket_tiers capacity if EVENT_TICKET
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

  // Emit domain event
  await supabase.from('domain_events').insert({
    event_type: 'reservation.refunded',
    entity_type: 'reservation',
    entity_id: reservationId,
    payload: { refund_amount_cents: refundAmount, stripe_refund_id: stripeRefundId, reason },
  })

  return NextResponse.json({
    reservation_id: reservationId,
    status: 'CANCELLED',
    refund_amount_cents: refundAmount,
    stripe_refund_id: stripeRefundId,
  })
}
