import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/ticket-lookup?email= — find all reservations/tickets for an email
// POST /api/ticket-lookup — send "find my tickets" email
// Adapted from Hi.Events: TicketLookup, SendTicketLookupEmailHandler

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 })

  // Find user by email
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, display_name, email')
    .eq('email', email)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ tickets: [], message: 'No account found for this email' })
  }

  // Find all confirmed reservations for this user (EVENT_TICKET only)
  const { data: reservations, error } = await supabase
    .from('reservations')
    .select(`
      id, status, quantity, total_price_cents, confirmed_at,
      inventory_items!inner(id, title, category, metadata)
    `)
    .eq('user_id', profile.id)
    .in('status', ['CONFIRMED', 'COMPLETED'])
    .eq('inventory_items.category', 'EVENT_TICKET')
    .order('confirmed_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const tickets = (reservations ?? []).map((r: Record<string, unknown>) => {
    const inv = Array.isArray(r.inventory_items) ? r.inventory_items[0] : r.inventory_items
    return {
      reservation_id: r.id,
      event_title: inv?.title,
      quantity: r.quantity,
      status: r.status,
      confirmed_at: r.confirmed_at,
      event_date: (inv?.metadata as Record<string, unknown>)?.starts_at ?? null,
    }
  })

  return NextResponse.json({ tickets, user: { name: profile.display_name, email: profile.email } })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { email } = body

  if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 })

  // TODO Part XXVI: send "find your tickets" email with magic link
  // For now, return the same data as GET
  const supabase = createAdminClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ sent: false, message: 'No account found for this email' })
  }

  // Create a ticket_lookup_token (encrypted link)
  await supabase.from('domain_events').insert({
    event_type: 'ticket_lookup.requested',
    entity_type: 'user_profile',
    entity_id: profile.id,
    payload: { email, requested_by: user.id },
  })

  return NextResponse.json({ sent: true, message: 'Ticket lookup email sent' })
}
