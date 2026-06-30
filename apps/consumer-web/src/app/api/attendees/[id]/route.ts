import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// PATCH /api/attendees/[id] — edit attendee (name, email, status)
// DELETE /api/attendees/[id] — cancel attendee (status → CANCELLED, release capacity)
// Adapted from Hi.Events: EditAttendeeHandler, PartialEditAttendeeHandler

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id } = await params
  const body = await request.json()

  // Load reservation
  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, user_id, item_id')
    .eq('id', id)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Attendee not found' }, { status: 404 })

  // Update attendee profile (name, email on user_profiles)
  if (body.display_name || body.email) {
    const update: Record<string, string> = {}
    if (body.display_name) update.display_name = body.display_name
    if (body.email) update.email = body.email
    await supabase.from('user_profiles').update(update).eq('id', reservation.user_id)
  }

  // Update reservation status if provided
  if (body.status) {
    await supabase.from('reservations').update({ status: body.status }).eq('id', id)
  }

  // Emit audit event
  await supabase.from('domain_events').insert({
    event_type: 'attendee.updated',
    entity_type: 'reservation',
    entity_id: id,
    payload: { updated_by: user.id, fields: Object.keys(body) },
  })

  return NextResponse.json({ id, updated: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id } = await params

  // Load reservation
  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, status, item_id, quantity')
    .eq('id', id)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Attendee not found' }, { status: 404 })
  if (reservation.status === 'CANCELLED') {
    return NextResponse.json({ error: 'Already cancelled' }, { status: 409 })
  }

  // Cancel the reservation
  const { error } = await supabase
    .from('reservations')
    .update({
      status: 'CANCELLED',
      cancelled_at: new Date().toISOString(),
      cancelled_reason: 'Cancelled by organizer',
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 })

  // Release ticket_tiers capacity
  const { data: tier } = await supabase
    .from('ticket_tiers')
    .select('id, quantity_reserved')
    .eq('item_id', reservation.item_id)
    .maybeSingle()

  if (tier) {
    await supabase
      .from('ticket_tiers')
      .update({ quantity_reserved: Math.max(0, tier.quantity_reserved - reservation.quantity) })
      .eq('id', tier.id)
  }

  return NextResponse.json({ id, status: 'CANCELLED' })
}
