import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/self-service/attendee?reservation_id= — attendee views own ticket info
// PATCH /api/self-service/attendee?reservation_id= — attendee edits own info (name, email)
// Adapted from Hi.Events: SelfServiceEditAttendeeService, EditAttendeePublicHandler

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const reservationId = searchParams.get('reservation_id')

  if (!reservationId) return NextResponse.json({ error: 'reservation_id is required' }, { status: 400 })

  const { data: reservation } = await supabase
    .from('reservations')
    .select(`
      id, status, quantity, total_price_cents, confirmed_at, created_at,
      inventory_items!inner(id, title, category, metadata),
      user_profiles!inner(display_name, email),
      check_ins(id, checked_in_at)
    `)
    .eq('id', reservationId)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  if (reservation.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const inv = Array.isArray(reservation.inventory_items) ? reservation.inventory_items[0] : reservation.inventory_items
  const profile = Array.isArray(reservation.user_profiles) ? reservation.user_profiles[0] : reservation.user_profiles
  const checkIns = (reservation.check_ins as Array<Record<string, unknown>>) ?? []
  const eventMeta = (inv?.metadata as Record<string, unknown>) ?? {}

  return NextResponse.json({
    reservation: {
      id: reservation.id,
      status: reservation.status,
      quantity: reservation.quantity,
      total_price_cents: reservation.total_price_cents,
      confirmed_at: reservation.confirmed_at,
      created_at: reservation.created_at,
      event: {
        id: inv?.id,
        title: inv?.title,
        starts_at: eventMeta.starts_at ?? null,
        ends_at: eventMeta.ends_at ?? null,
        location: eventMeta.location ?? null,
      },
      attendee: {
        display_name: profile?.display_name,
        email: profile?.email,
      },
      checked_in: checkIns.length > 0,
      checked_in_at: checkIns[0]?.checked_in_at ?? null,
    },
  })
}

export async function PATCH(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const reservationId = searchParams.get('reservation_id')

  if (!reservationId) return NextResponse.json({ error: 'reservation_id is required' }, { status: 400 })

  const body = await request.json()
  const { display_name, email } = body

  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, user_id')
    .eq('id', reservationId)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  if (reservation.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const update: Record<string, string> = {}
  if (display_name !== undefined) update.display_name = display_name
  if (email !== undefined) update.email = email

  await supabase.from('user_profiles').update(update).eq('id', user.id)

  await supabase.from('domain_events').insert({
    event_type: 'attendee.self_edited',
    entity_type: 'reservation',
    entity_id: reservationId,
    payload: { fields: Object.keys(update), edited_by: user.id },
  })

  return NextResponse.json({ updated: true, fields: Object.keys(update) })
}
