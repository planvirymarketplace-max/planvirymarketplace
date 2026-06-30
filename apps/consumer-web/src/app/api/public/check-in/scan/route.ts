import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHmac } from 'crypto'

// POST /api/public/check-in/scan
// PUBLIC endpoint (no auth) — for door staff scanning QR codes.
// Uses a list_token for authorization instead of user JWT.
// Adapted from Hi.Events: CreateAttendeeCheckInPublicHandler (public, no auth)
//
// Body: { qr_token, list_id, list_token }
// Returns: { valid, checked_in, attendee_name, tier_name, checked_in_at } or error

const PLATFORM_SECRET = process.env.NEXTAUTH_SECRET ?? 'planviry-checkin-secret-dev'

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { qr_token, list_id, list_token } = body

  if (!qr_token || !list_id) {
    return NextResponse.json({ valid: false, error: 'qr_token and list_id are required' }, { status: 400 })
  }

  // ─── Verify the check-in list is active and the list_token authorizes access ─
  const { data: list, error: listErr } = await supabase
    .from('check_in_lists')
    .select('id, item_id, name, expires_at')
    .eq('id', list_id)
    .maybeSingle()

  if (listErr || !list) {
    return NextResponse.json({ valid: false, error: 'Check-in list not found' }, { status: 404 })
  }

  // Check list is not expired
  if (list.expires_at && new Date(list.expires_at as string) < new Date()) {
    return NextResponse.json({ valid: false, error: 'Check-in list has expired' }, { status: 410 })
  }

  // ─── Verify QR token signature ──────────────────────────────────────────
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

  // Verify event matches
  if (tokenEventId !== list.item_id) {
    return NextResponse.json({ valid: false, error: 'QR token does not match this event' }, { status: 400 })
  }

  // ─── Find the ticket_instance for this reservation ──────────────────────
  const { data: ticketInstance, error: tErr } = await supabase
    .from('ticket_instances')
    .select('id, reservation_id, item_id, attendee_name, attendee_email, status, checked_in_at, checked_in_by')
    .eq('reservation_id', reservationId)
    .maybeSingle()

  if (tErr || !ticketInstance) {
    return NextResponse.json({ valid: false, error: 'Ticket not found' }, { status: 404 })
  }

  // ─── Duplicate check-in prevention ──────────────────────────────────────
  if (ticketInstance.checked_in_at) {
    return NextResponse.json({
      valid: false,
      error: 'Already checked in',
      checked_in_at: ticketInstance.checked_in_at,
      attendee_name: ticketInstance.attendee_name,
    }, { status: 409 })
  }

  // ─── Record check-in ────────────────────────────────────────────────────
  const now = new Date().toISOString()
  const { error: checkInErr } = await supabase
    .from('ticket_instances')
    .update({
      checked_in_at: now,
      checked_in_by: list_token ?? 'public-scanner',
      check_in_list_id: list_id,
      status: 'CHECKED_IN',
    })
    .eq('id', ticketInstance.id)
    .is('checked_in_at', null) // optimistic locking — prevents race condition

  if (checkInErr) {
    // If someone else checked in between our read and write
    return NextResponse.json({
      valid: false,
      error: 'Check-in failed — ticket may have been checked in concurrently',
    }, { status: 409 })
  }

  // Emit domain event
  await supabase.from('domain_events').insert({
    event_type: 'ticket.checked_in',
    entity_type: 'ticket_instance',
    entity_id: ticketInstance.id,
    payload: {
      reservation_id: reservationId,
      event_id: list.item_id,
      check_in_list_id: list_id,
      attendee_name: ticketInstance.attendee_name,
      checked_in_at: now,
    },
  })

  return NextResponse.json({
    valid: true,
    checked_in: true,
    ticket_instance_id: ticketInstance.id,
    reservation_id: reservationId,
    attendee_name: ticketInstance.attendee_name,
    attendee_email: ticketInstance.attendee_email,
    event_id: list.item_id,
    check_in_list_name: list.name,
    checked_in_at: now,
  })
}
