import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/waitlist?item_id=&tier_id= — list from waitlist_entries table
// POST /api/waitlist — join waitlist (creates row in waitlist_entries)
// REAL TABLE: waitlist_entries (id, item_id, ticket_tier_id, user_id, quantity,
//   status, notified_at, converted_reservation_id, expires_at, created_at, updated_at)

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get('item_id')
  const tierId = searchParams.get('tier_id')

  let query = supabase.from('waitlist_entries').select('*')
  if (itemId) query = query.eq('item_id', itemId)
  if (tierId) query = query.eq('ticket_tier_id', tierId)

  const { data, error } = await query.order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ waitlist: data ?? [], total: data?.length ?? 0 })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { item_id, ticket_tier_id, quantity = 1 } = body

  if (!item_id) return NextResponse.json({ error: 'item_id is required' }, { status: 400 })

  // Check not already on waitlist
  const { data: existing } = await supabase
    .from('waitlist_entries')
    .select('id, status')
    .eq('item_id', item_id)
    .eq('user_id', user.id)
    .in('status', ['WAITING', 'NOTIFIED'])
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Already on waitlist', entry: existing }, { status: 409 })
  }

  const { data: entry, error } = await supabase
    .from('waitlist_entries')
    .insert({
      item_id,
      ticket_tier_id: ticket_tier_id ?? null,
      user_id: user.id,
      quantity,
      status: 'WAITING',
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ waitlist_entry: entry }, { status: 201 })
}
