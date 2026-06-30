import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/restaurants/[id]/reserve
// Create a restaurant reservation (Part 43.3)
// If deposit_amount > 0, creates an order for Stripe checkout
// If no deposit, directly confirms the reservation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: restaurantId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { reservation_date, reservation_time, party_size, trip_id, event_id, special_requests, deposit_amount } = body

  if (!reservation_date || !reservation_time || !party_size) {
    return NextResponse.json({ error: 'reservation_date, reservation_time, party_size required' }, { status: 400 })
  }

  // Create reservation
  const { data: reservation, error } = await supabase
    .from('restaurant_reservations')
    .insert({
      restaurant_id: restaurantId,
      planner_id: user.id,
      trip_id: trip_id ?? null,
      event_id: event_id ?? null,
      reservation_date,
      reservation_time,
      party_size,
      status: deposit_amount ? 'pending' : 'confirmed',
      special_requests: special_requests ?? null,
      deposit_amount: deposit_amount ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If no deposit, add to trip itinerary directly
  if (!deposit_amount && trip_id) {
    await supabase.from('trip_itinerary_items').insert({
      trip_id,
      item_type: 'restaurant',
      restaurant_reservation_id: reservation.id,
      display_name: 'Restaurant Reservation',
      display_time: reservation_time,
      display_date: reservation_date,
    })
  }

  return NextResponse.json({
    reservation,
    requires_payment: !!deposit_amount,
    // If requires_payment: client calls /api/checkout with cart item type='restaurant'
  })
}
