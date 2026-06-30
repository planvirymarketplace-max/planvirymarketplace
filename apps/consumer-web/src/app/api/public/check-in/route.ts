import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHmac } from 'crypto'

// POST /api/public/check-in?token=<public_token>
// PUBLIC endpoint — no auth required. Door staff scans QR → this endpoint validates.
// Uses check_in_lists.public_token to identify the check-in list (no JWT needed).
// Adapted from Hi.Events: CreateAttendeeCheckInPublicHandler (public, no auth)

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) return NextResponse.json({ error: 'token is required' }, { status: 400 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { qr_token } = body

  if (!qr_token) return NextResponse.json({ error: 'qr_token is required' }, { status: 400 })

  // 1. Find the check-in list by public_token
  const { data: checkInList, error: listErr } = await supabase
    .from('check_in_lists')
    .select('id, item_id, name, expires_at, revoked_at')
    .eq('public_token', token)
    .maybeSingle()

  if (listErr || !checkInList) {
    return NextResponse.json({ valid: false, error: 'Invalid check-in list token' }, { status: 404 })
  }

  // 2. Check list is active (not revoked, not expired)
  if (checkInList.revoked_at) {
    return NextResponse.json({ valid: false, error: 'Check-in list has been revoked' }, { status: 409 })
  }
  if (checkInList.expires_at && new Date(checkInList.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: 'Check-in list has expired' }, { status: 409 })
  }

  // 3. Find the ticket_instance by qr_code_secret
  const { data: ticket, error: ticketErr } = await supabase
    .from('ticket_instances')
    .select('id, reservation_id, attendee_name, attendee_email, status, checked_in_at, item_id')
    .eq('qr_code_secret', qr_token)
    .eq('item_id', checkInList.item_id)
    .maybeSingle()

  if (ticketErr || !ticket) {
    return NextResponse.json({ valid: false, error: 'Invalid ticket' }, { status: 404 })
  }

  // 4. Check not already checked in
  if (ticket.checked_in_at) {
    return NextResponse.json({
      valid: false,
      error: 'Already checked in',
      checked_in_at: ticket.checked_in_at,
      attendee_name: ticket.attendee_name,
    }, { status: 409 })
  }

  // 5. Check ticket status is ISSUED (not CANCELLED etc.)
  if (ticket.status !== 'ISSUED') {
    return NextResponse.json({ valid: false, error: `Ticket status is ${ticket.status}` }, { status: 409 })
  }

  // 6. Record check-in on ticket_instances
  const now = new Date().toISOString()
  const { error: updateErr } = await supabase
    .from('ticket_instances')
    .update({
      checked_in_at: now,
      check_in_list_id: checkInList.id,
    })
    .eq('id', ticket.id)

  if (updateErr) {
    return NextResponse.json({ error: 'Failed to record check-in' }, { status: 500 })
  }

  // 7. Also record in check_ins table
  await supabase.from('check_ins').insert({
    reservation_id: ticket.reservation_id,
    checked_in_by: null, // public check-in — no user
    checked_in_at: now,
  })

  // 8. Emit domain event
  await supabase.from('domain_events').insert({
    event_type: 'ticket.checked_in',
    entity_type: 'ticket_instance',
    entity_id: ticket.id,
    payload: {
      check_in_list_id: checkInList.id,
      check_in_list_name: checkInList.name,
      attendee_name: ticket.attendee_name,
      public_check_in: true,
    },
  })

  return NextResponse.json({
    valid: true,
    checked_in: true,
    ticket_id: ticket.id,
    attendee_name: ticket.attendee_name,
    attendee_email: ticket.attendee_email,
    check_in_list: checkInList.name,
    checked_in_at: now,
  })
}
