import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// /api/travel/reservations — lodging module API (Staybnb adaptation)
// Mounted per Part 53: Staybnb API routes under /api/travel/*

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)

  let query = supabase.from('inventory_items').select('*', { count: 'exact' }).eq('category', 'LODGING').eq('status', 'PUBLISHED')

  const city = searchParams.get('city')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const guests = searchParams.get('guests')
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = parseInt(searchParams.get('limit') ?? '20', 10)

  if (city) query = query.ilike('title', '%'+city+'%')
  if (minPrice) query = query.gte('base_price_cents', parseFloat(minPrice) * 100)
  if (maxPrice) query = query.lte('base_price_cents', parseFloat(maxPrice) * 100)

  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1).order('quality_score', { ascending: false })

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ listings: data ?? [], total: count ?? 0, page, limit })
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const body = await request.json()

  // Create lodging reservation (date-range booking — Staybnb pattern)
  const { item_id, user_id, start_date, end_date, guests, total_price } = body

  // Check for conflicting reservations (date-range overlap — BR-R-005)
  const { data: conflicts } = await supabase
    .from('reservations')
    .select('id')
    .eq('item_id', item_id)
    .in('status', ['PENDING', 'CONFIRMED'])
    .lte('starts_at', end_date)
    .gte('ends_at', start_date)

  if (conflicts && conflicts.length > 0) {
    return NextResponse.json({ error: 'Selected dates are not available' }, { status: 409 })
  }

  // Create reservation
  const { data, error } = await supabase
    .from('reservations')
    .insert({
      user_id,
      item_id,
      status: 'PENDING',
      quantity: guests || 1,
      unit_price_cents: total_price,
      total_price_cents: total_price,
      currency: 'USD',
      starts_at: start_date,
      ends_at: end_date,
      ttl_expires_at: new Date(Date.now() + 15 * 60_000).toISOString(),
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ reservation: data }, { status: 201 })
}
