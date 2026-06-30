import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requiresStripeCharge, type CartItem } from '@/lib/cart-context'

// POST /api/checkout
// validateAndCreateOrder — Part 46 (Cross-Product Cart & Checkout)
// Handles all 6 item types. Separates chargeable from non-chargeable.
// External events NEVER reach this route — they go to /api/trips/[id]/items
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { cart_items, trip_id, event_id } = body as {
    cart_items: CartItem[]
    trip_id?: string
    event_id?: string
  }

  if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
    return NextResponse.json({ error: 'cart_items is required' }, { status: 400 })
  }

  // HARD RULE (Part 41.2): Filter out non-chargeable items
  // External events should never reach here, but guard anyway
  const chargeableItems = cart_items.filter(requiresStripeCharge)
  const nonChargeableItems = cart_items.filter((i) => !requiresStripeCharge(i))

  // Process non-chargeable items immediately (no Stripe dependency)
  const nonChargeableResults: Array<{ type: string; status: string }> = []

  for (const item of nonChargeableItems) {
    if (item.type === 'restaurant' && item.restaurant_id) {
      // Create restaurant reservation without deposit
      const { data: res } = await supabase
        .from('restaurant_reservations')
        .insert({
          restaurant_id: item.restaurant_id,
          planner_id: user.id,
          trip_id: trip_id ?? null,
          event_id: event_id ?? null,
          reservation_date: item.date,
          reservation_time: item.reservation_time ?? '',
          party_size: item.party_size ?? 2,
          status: 'confirmed',
        })
        .select('id')
        .single()

      if (res && trip_id) {
        await supabase.from('trip_itinerary_items').insert({
          trip_id,
          item_type: 'restaurant',
          restaurant_reservation_id: res.id,
          display_name: item.name,
          display_time: item.reservation_time ?? null,
          display_date: item.date,
        })
      }
      nonChargeableResults.push({ type: 'restaurant', status: 'confirmed' })
    }
    // external_event type should never reach here — guard catches it
  }

  // If no chargeable items, return early
  if (chargeableItems.length === 0) {
    return NextResponse.json({
      order_id: null,
      non_chargeable_processed: nonChargeableResults,
      message: 'No chargeable items — non-chargeable items processed',
    })
  }

  // Calculate total
  const totalAmount = chargeableItems.reduce((sum, i) => sum + i.amount, 0)
  const totalDeposit = chargeableItems.reduce((sum, i) => sum + (i.deposit_amount ?? 0), 0)

  // Create order (status: unpaid)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'unpaid',
      total_amount: totalAmount,
      event_id: event_id ?? null,
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }

  // Create order_items for each chargeable item
  for (const item of chargeableItems) {
    await supabase.from('order_items').insert({
      order_id: order.id,
      item_type: item.type,
      item_id: item.listing_id ?? item.vendor_id ?? item.experience_slot_id ?? item.restaurant_id ?? '',
      amount: item.amount,
      quantity: item.quantity ?? 1,
    })
  }

  return NextResponse.json({
    order_id: order.id,
    total_amount: totalAmount,
    total_deposit: totalDeposit,
    chargeable_count: chargeableItems.length,
    non_chargeable_processed: nonChargeableResults,
    // Client now creates Stripe Checkout Session with this order_id
    // Stripe session creation happens in Phase 6 when Stripe keys are added
    stripe_session_url: null,
    message: 'Order created. Stripe session creation pending (Phase 6).',
  })
}
