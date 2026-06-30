import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/self-service/resend?reservation_id= — resend confirmation email
// Also: POST /api/attendees/resend — same thing (alias for vendor/admin)
// Adapted from Hi.Events: ResendAttendeeTicketHandler, ResendOrderConfirmationPublicHandler
//
// Creates a REAL notification row in the notifications table (status=QUEUED).
// The /api/notifications/process worker picks it up and sends via Resend.

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
    .select(`
      id, user_id, status, total_price_cents, quantity,
      inventory_items!inner(title, category, metadata)
    `)
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

  const inv = Array.isArray(reservation.inventory_items) ? reservation.inventory_items[0] : reservation.inventory_items
  const eventMeta = (inv?.metadata as Record<string, unknown>) ?? {}

  // Create a REAL notification row in the notifications table
  const { data: notification, error: notifErr } = await supabase
    .from('notifications')
    .insert({
      user_id: reservation.user_id,
      notification_type: 'ticket_resend',
      channel: 'EMAIL',
      priority: 'HIGH',
      subject: `Your tickets for ${inv?.title ?? 'your event'}`,
      body: `Your reservation has been confirmed. Reservation ID: ${reservationId}. Quantity: ${reservation.quantity}. Total: $${((reservation.total_price_cents ?? 0) / 100).toFixed(2)}. Event: ${inv?.title ?? 'N/A'}.`,
      data_payload: {
        reservation_id: reservationId,
        event_title: inv?.title,
        event_date: eventMeta.starts_at ?? null,
        quantity: reservation.quantity,
        total_paid: reservation.total_price_cents,
        requested_by: user.id,
      },
      status: 'QUEUED',
      rate_limit_category: 'NON_CRITICAL',
    })
    .select('id, status')
    .single()

  if (notifErr) {
    console.error('[resend] notification insert error:', notifErr)
    return NextResponse.json({ error: 'Failed to queue resend' }, { status: 500 })
  }

  // Also emit domain event for audit
  await supabase.from('domain_events').insert({
    event_type: 'notification.email.requested',
    entity_type: 'reservation',
    entity_id: reservationId,
    payload: {
      notification_id: notification.id,
      template: 'ticket_confirmation',
      user_id: reservation.user_id,
      reservation_id: reservationId,
      event_title: inv?.title,
      requested_by: user.id,
    },
  })

  return NextResponse.json({
    sent: true,
    reservation_id: reservationId,
    notification_id: notification.id,
    notification_status: notification.status,
    message: 'Notification queued. Call POST /api/notifications/process to deliver.',
  })
}
