import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/trips/[id]/items — Get all itinerary items for a trip (Part 41)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tripId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify trip ownership
  const { data: trip } = await supabase
    .from('trips')
    .select('id, owner_id')
    .eq('id', tripId)
    .single()

  if (!trip || trip.owner_id !== user.id) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('trip_itinerary_items')
    .select('*')
    .eq('trip_id', tripId)
    .order('display_date', { ascending: true })
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: data ?? [] })
}

// POST /api/trips/[id]/items — Add item to trip itinerary
// External events go HERE, never to CartContext
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tripId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify trip ownership
  const { data: trip } = await supabase
    .from('trips')
    .select('id, owner_id')
    .eq('id', tripId)
    .single()

  if (!trip || trip.owner_id !== user.id) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  const body = await request.json()
  const {
    item_type,
    booking_id,
    ticket_id,
    experience_reservation_id,
    restaurant_reservation_id,
    external_event_id,
    display_name,
    display_time,
    display_date,
    display_location,
    display_image_url,
    display_price,
    notes,
  } = body

  if (!item_type || !display_name || !display_date) {
    return NextResponse.json({ error: 'item_type, display_name, display_date required' }, { status: 400 })
  }

  // Get current sort_order
  const { data: lastItem } = await supabase
    .from('trip_itinerary_items')
    .select('sort_order')
    .eq('trip_id', tripId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const sortOrder = (lastItem?.sort_order ?? 0) + 1

  const { data, error } = await supabase
    .from('trip_itinerary_items')
    .insert({
      trip_id: tripId,
      item_type,
      booking_id: booking_id ?? null,
      ticket_id: ticket_id ?? null,
      experience_reservation_id: experience_reservation_id ?? null,
      restaurant_reservation_id: restaurant_reservation_id ?? null,
      external_event_id: external_event_id ?? null,
      display_name,
      display_time: display_time ?? null,
      display_date,
      display_location: display_location ?? null,
      display_image_url: display_image_url ?? null,
      display_price: display_price ?? null,
      notes: notes ?? null,
      sort_order: sortOrder,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE /api/trips/[id]/items — Remove item from itinerary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tripId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get('itemId')

  if (!itemId) {
    return NextResponse.json({ error: 'itemId required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('trip_itinerary_items')
    .delete()
    .eq('id', itemId)
    .eq('trip_id', tripId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
