import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/events/external
// Fetches cached external events (Ticketmaster/Eventbrite) from Supabase (Part 39)
// These are NEVER added to CartContext — only to TripItineraryContext
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const city = searchParams.get('city')
  const state = searchParams.get('state')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const genre = searchParams.get('genre')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  let query = supabase
    .from('external_events')
    .select('id, name, description, venue_name, venue_address, city, state, lat, lng, event_date, event_end_date, genre, subgenre, image_url, min_price, max_price, ticket_url, is_sold_out, source')
    .eq('is_sold_out', false)
    .order('event_date', { ascending: true })
    .limit(limit)

  if (city) query = query.eq('city', city)
  if (state) query = query.eq('state', state)
  if (startDate) query = query.gte('event_date', startDate)
  if (endDate) query = query.lte('event_date', endDate)
  if (genre) query = query.eq('genre', genre)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ events: data ?? [] })
}
