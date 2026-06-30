import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHmac } from 'crypto'

// POST /api/tickets/verify
// QR code check-in — validates ticket via HMAC-signed QR token.
// Adapted from Hi.Events: check-in list window enforcement + duplicate prevention.
// Uses new schema: check_ins (reservation_id, checked_in_by, checked_in_at).

const PLATFORM_SECRET = process.env.NEXTAUTH_SECRET ?? 'planviry-checkin-secret-dev'

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { qr_token, event_id } = body as { qr_token: string; event_id?: string }

  if (!qr_token) {
    return NextResponse.json({ error: 'qr_token is required' }, { status: 400 })
  }

  // ─── 1. Verify HMAC signature ──────────────────────────────────────────
  // QR token format: <reservation_id>:<user_id>:<event_id>:<hmac>
  const parts = qr_token.split(':')
  if (parts.length !== 4) {
    return NextResponse.json({ valid: false, error: 'Invalid QR token format' }, { status: 400 })
  }
  const [reservationId, tokenUserId, tokenEventId, signature] = parts

  const expectedSig = createHmac('sha256', PLATFORM_SECRET)
    .update(`${reservationId}:${tokenUserId}:${tokenEventId}`)
    .digest('hex')

  if (signature !== expectedSig) {
    return NextResponse.json({ valid: false, error: 'Invalid QR token signature' }, { status: 400 })
  }

  if (event_id && tokenEventId !== event_id) {
    return NextResponse.json({ valid: false, error: 'QR token does not match this event' }, { status: 400 })
  }

  // ─── 2. Load reservation ───────────────────────────────────────────────
  const { data: reservation, error: resErr } = await supabase
    .from('reservations')
    .select(`
      id, status, user_id, item_id, quantity,
      inventory_items!inner(id, title, category, vendor_id, status, metadata)
    `)
    .eq('id', reservationId)
    .maybeSingle()

  if (resErr || !reservation) {
    return NextResponse.json({ valid: false, error: 'Reservation not found' }, { status: 404 })
  }

  const inv = Array.isArray(reservation.inventory_items) ? reservation.inventory_items[0] : reservation.inventory_items
  if (inv.category !== 'EVENT_TICKET') {
    return NextResponse.json({ valid: false, error: 'Not an event ticket' }, { status: 400 })
  }

  // Must be CONFIRMED to check in
  if (reservation.status !== 'CONFIRMED') {
    return NextResponse.json({
      valid: false,
      error: `Reservation is ${reservation.status}, must be CONFIRMED to check in`,
    }, { status: 409 })
  }

  // ─── 3. Check-in window enforcement (Hi.Events pattern) ─────────────────
  const eventMeta = (inv.metadata as Record<string, unknown>) ?? {}
  const eventStart = eventMeta.starts_at ? new Date(eventMeta.starts_at as string) : null
  const eventEnd = eventMeta.ends_at ? new Date(eventMeta.ends_at as string) : null
  const now = new Date()

  // BR-EV-005: check-in window = event_start - 1h to event_end + 30min
  if (eventStart && now < new Date(eventStart.getTime() - 60 * 60_000)) {
    return NextResponse.json({ valid: false, error: 'Check-in is not open yet' }, { status: 409 })
  }
  if (eventEnd && now > new Date(eventEnd.getTime() + 30 * 60_000)) {
    return NextResponse.json({ valid: false, error: 'Check-in window has closed' }, { status: 409 })
  }

  // ─── 4. Duplicate check-in prevention (Hi.Events pattern) ───────────────
  const { data: existingCheckIn } = await supabase
    .from('check_ins')
    .select('id, checked_in_at')
    .eq('reservation_id', reservationId)
    .maybeSingle()

  if (existingCheckIn) {
    // BR-EV-004: return prior timestamp
    return NextResponse.json({
      valid: false,
      error: 'Already checked in',
      checked_in_at: (existingCheckIn as { checked_in_at: string }).checked_in_at,
    }, { status: 409 })
  }

  // ─── 5. Load attendee name ─────────────────────────────────────────────
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name')
    .eq('id', reservation.user_id)
    .maybeSingle()

  // ─── 6. Record check-in ────────────────────────────────────────────────
  const { data: checkIn, error: checkInErr } = await supabase
    .from('check_ins')
    .insert({
      reservation_id: reservationId,
      checked_in_by: user.id,
      checked_in_at: now.toISOString(),
    })
    .select('id, checked_in_at')
    .single()

  if (checkInErr) {
    return NextResponse.json({ error: 'Failed to record check-in' }, { status: 500 })
  }

  // Emit domain event
  await supabase.from('domain_events').insert({
    event_type: 'ticket.checked_in',
    entity_type: 'check_in',
    entity_id: checkIn.id,
    payload: { reservation_id: reservationId, event_id: tokenEventId, user_id: reservation.user_id },
  })

  return NextResponse.json({
    valid: true,
    checked_in: true,
    reservation_id: reservationId,
    attendee_name: profile?.display_name ?? 'Guest',
    event_title: inv.title,
    quantity: reservation.quantity,
    checked_in_at: checkIn.checked_in_at,
  })
}
