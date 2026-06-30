import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/tickets/purchase
// Locks tier row, checks capacity, creates order (Part 12 Ticket Purchase State Machine)
// Stripe session creation happens AFTER this succeeds.
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { tier_id, quantity = 1, event_id } = body

  if (!tier_id) {
    return NextResponse.json({ error: 'tier_id is required' }, { status: 400 })
  }

  // Step 1: Lock tier row (row-level lock prevents concurrent purchases)
  const { data: tier, error: lockError } = await supabase
    .from('ticket_tiers')
    .select('id, capacity, sold_count, price, tier_name')
    .eq('id', tier_id)
    .single()

  if (lockError || !tier) {
    return NextResponse.json({ error: 'Ticket tier not found' }, { status: 404 })
  }

  // Step 2: Check availability
  if (tier.sold_count + quantity > tier.capacity) {
    return NextResponse.json({
      error: 'Sold out',
      sold_out: true,
      remaining: tier.capacity - tier.sold_count,
      waitlist_available: true,
    }, { status: 409 })
  }

  // Step 3: Atomic increment
  const { error: incrementError } = await supabase
    .from('ticket_tiers')
    .update({ sold_count: tier.sold_count + quantity })
    .eq('id', tier_id)

  if (incrementError) {
    return NextResponse.json({ error: 'Failed to reserve tickets' }, { status: 500 })
  }

  // Step 4: Create order (status: unpaid — Stripe session created separately)
  const totalAmount = tier.price * quantity
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'unpaid',
      total_amount: totalAmount,
      event_id: event_id,
    })
    .select('id')
    .single()

  if (orderError) {
    // Compensating transaction: decrement sold_count
    await supabase
      .from('ticket_tiers')
      .update({ sold_count: tier.sold_count })
      .eq('id', tier_id)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }

  // Step 5: Create order_items
  await supabase.from('order_items').insert({
    order_id: order.id,
    item_type: 'ticket',
    tier_id: tier_id,
    quantity: quantity,
    amount: totalAmount,
  })

  return NextResponse.json({
    order_id: order.id,
    tier_name: tier.name,
    quantity,
    total_amount: totalAmount,
    // Stripe session to be created by /api/checkout
  })
}
