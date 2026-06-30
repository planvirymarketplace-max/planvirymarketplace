import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/self-service/resend?reservation_id= — resend confirmation email
// Also: POST /api/attendees/resend — same thing (alias for vendor/admin)
// Adapted from Hi.Events: ResendAttendeeTicketHandler, ResendOrderConfirmationPublicHandler

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const reservationId = searchParams.get('reservation_id')

  if (!reservationId) return NextResponse.json({ error: 'reservation_id is required' }, { status: 400 })

  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, user_id, status, inventory_items!inner(title)')
    .eq('id', reservationId)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })

  // RLS: owner or vendor staff
  const isOwner = reservation.user_id === user.id
  if (!isOwner) {
    const { data: staff } = await supabase
      .from('vendor_staff')
      .select('role')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .maybeSingle()
    if (!staff) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Queue the email via domain_events (notification-send worker picks it up)
  await supabase.from('domain_events').insert({
    event_type: 'notification.email.requested',
    entity_type: 'reservation',
    entity_id: reservationId,
    payload: {
      template: 'ticket_confirmation',
      user_id: reservation.user_id,
      reservation_id: reservationId,
      event_title: Array.isArray(reservation.inventory_items) ? reservation.inventory_items[0]?.title : reservation.inventory_items?.title,
      requested_by: user.id,
      requested_at: new Date().toISOString(),
    },
  })

  return NextResponse.json({ sent: true, reservation_id: reservationId })
}
