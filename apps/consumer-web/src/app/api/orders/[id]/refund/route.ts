import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as Stripe.LatestApiVersion })

// POST /api/orders/[id]/refund — Stripe refund + create refunds table record + update reservation
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const { amount_cents, reason = 'requested_by_customer' } = body

  const { data: res } = await supabase.from('reservations').select('id,status,user_id,total_price_cents,stripe_payment_intent_id,item_id,quantity').eq('id', id).maybeSingle()
  if (!res) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (res.status !== 'CONFIRMED' && res.status !== 'COMPLETED') return NextResponse.json({ error: `Cannot refund ${res.status}` }, { status: 409 })
  if (res.user_id !== user.id && user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const refundAmount = amount_cents ?? res.total_price_cents
  let stripeRefundId = `offline_${Date.now()}`

  if (res.stripe_payment_intent_id && !res.stripe_payment_intent_id.startsWith('OFFLINE')) {
    try {
      const refund = await stripe.refunds.create({ payment_intent: res.stripe_payment_intent_id, amount: refundAmount, reason })
      stripeRefundId = refund.id
    } catch (err) {
      return NextResponse.json({ error: 'Stripe refund failed' }, { status: 502 })
    }
  }

  // Create refunds table record
  const { data: refundRow } = await supabase.from('refunds').insert({
    payment_id: res.stripe_payment_intent_id,
    stripe_refund_id: stripeRefundId,
    amount_cents: refundAmount,
    currency: 'USD',
    reason,
    status: 'COMPLETED',
    processed_at: new Date().toISOString(),
  }).select('id').single()

  // Update reservation
  await supabase.from('reservations').update({
    status: 'CANCELLED', cancelled_at: new Date().toISOString(),
    cancelled_reason: `Refunded: ${reason}`, stripe_refund_id: stripeRefundId,
    refund_amount_cents: refundAmount,
  }).eq('id', id)

  // Release capacity
  const { data: item } = await supabase.from('inventory_items').select('category').eq('id', res.item_id).maybeSingle()
  if (item?.category === 'EVENT_TICKET') {
    const { data: tier } = await supabase.from('ticket_tiers').select('id,quantity_reserved').eq('item_id', res.item_id).maybeSingle()
    if (tier) await supabase.from('ticket_tiers').update({ quantity_reserved: Math.max(0, tier.quantity_reserved - res.quantity) }).eq('id', tier.id)
  }

  // Audit log
  await supabase.from('audit_log').insert({ actor_id: user.id, action: 'CREATE', entity_type: 'refund', entity_id: refundRow?.id, changes: { reservation_id: id, amount_cents: refundAmount, stripe_refund_id: stripeRefundId } })

  return NextResponse.json({ reservation_id: id, status: 'CANCELLED', refund_id: refundRow?.id, refund_amount_cents: refundAmount, stripe_refund_id: stripeRefundId })
}
