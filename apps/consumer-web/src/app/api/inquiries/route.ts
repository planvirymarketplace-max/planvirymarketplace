import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/inquiries
// Planner submits an inquiry to a vendor (Part 12 Booking State Machine)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { vendor_id, listing_id, event_id, event_date, message } = body

  if (!vendor_id || !event_date) {
    return NextResponse.json({ error: 'vendor_id and event_date are required' }, { status: 400 })
  }

  // Create inquiry — expires_at is set by DB trigger (72h, Part 12)
  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      vendor_id,
      planner_id: user.id,
      listing_id: listing_id ?? null,
      event_id: event_id ?? null,
      event_date,
      message: message ?? '',
      status: 'open',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Create notification for vendor
  await supabase.from('notifications').insert({
    user_id: vendor_id,
    category: 'booking',
    title: 'New inquiry received',
    body: `New inquiry for ${event_date}`,
    link: `/vendor/portal/inbox`,
  })

  return NextResponse.json(data)
}

// GET /api/inquiries
// List inquiries for the current user (vendor sees their inquiries, planner sees theirs)
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') ?? 'planner'

  let query = supabase
    .from('inquiries')
    .select(`
      id, vendor_id, planner_id, event_id, listing_id, event_date, message, status, created_at, expires_at,
      vendors!inner(business_name, slug),
      listings(name, city, state)
    `)
    .order('created_at', { ascending: false })

  if (role === 'vendor') {
    // Vendor sees inquiries sent to them
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!vendor) {
      return NextResponse.json({ inquiries: [] })
    }
    query = query.eq('vendor_id', vendor.id)
  } else {
    // Planner sees inquiries they sent
    query = query.eq('planner_id', user.id)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ inquiries: data ?? [] })
}
