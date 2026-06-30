import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomUUID } from 'crypto'

// POST /api/messages/send — organizer sends message to attendees
// Adapted from Hi.Events: Message model, SendMessageHandler

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { event_id, subject, body: messageBody, recipient_filter = 'all', scheduled_at } = body

  if (!event_id || !subject || !messageBody) {
    return NextResponse.json({ error: 'event_id, subject, body are required' }, { status: 400 })
  }

  // Verify the sender is the event owner
  const { data: event } = await supabase
    .from('inventory_items')
    .select('vendor_id')
    .eq('id', event_id)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const { data: staff } = await supabase
    .from('vendor_staff')
    .select('role')
    .eq('vendor_id', event.vendor_id)
    .eq('user_id', user.id)
    .eq('status', 'ACTIVE')
    .maybeSingle()

  if (!staff) return NextResponse.json({ error: 'Not authorized to message for this event' }, { status: 403 })

  // Get recipients based on filter
  let query = supabase
    .from('reservations')
    .select('user_id, user_profiles!inner(email, display_name)')
    .eq('item_id', event_id)

  if (recipient_filter === 'confirmed') {
    query = query.in('status', ['CONFIRMED', 'COMPLETED'])
  } else if (recipient_filter === 'checked_in') {
    query = query.in('reservations.status', ['CONFIRMED', 'COMPLETED'])
    // Would need check_ins join for actual checked-in filter
  }

  const { data: recipients } = await query

  // ─── Create a notification row per recipient in the notifications table ─
  // REAL TABLE: notifications (user_id, notification_type, channel, priority,
  //   subject, body, cta_url, data_payload, status, rate_limit_category)
  // The notification-send worker (/api/notifications/process) picks these up
  // and delivers them via Resend (email), in-app, or push.

  const notificationRows = (recipients ?? []).map((r: Record<string, unknown>) => {
    const profile = Array.isArray(r.user_profiles) ? r.user_profiles[0] : r.user_profiles
    return {
      user_id: r.user_id,
      notification_type: 'organizer_message',
      channel: 'EMAIL',
      priority: 'MEDIUM',
      subject,
      body: messageBody,
      data_payload: {
        event_id,
        sender_id: user.id,
        event_title: event?.title ?? null,
        recipient_name: profile?.display_name ?? null,
      },
      status: 'QUEUED',
      rate_limit_category: 'NON_CRITICAL',
    }
  })

  let insertedNotifications: Array<Record<string, unknown>> = []
  if (notificationRows.length > 0) {
    const { data: inserted, error: notifErr } = await supabase
      .from('notifications')
      .insert(notificationRows)
      .select('id, user_id, status')
    if (notifErr) {
      console.error('[messages/send] notifications insert error:', notifErr)
    } else {
      insertedNotifications = inserted ?? []
    }
  }

  // Also emit a domain event for audit + outgoing webhook triggers
  await supabase.from('domain_events').insert({
    event_type: 'message.queued',
    entity_type: 'inventory_item',
    entity_id: event_id,
    payload: {
      subject,
      recipient_count: notificationRows.length,
      scheduled_at: scheduled_at ?? null,
      notification_ids: insertedNotifications.map((n) => n.id),
    },
  })

  return NextResponse.json({
    message: {
      event_id,
      sender_id: user.id,
      subject,
      body: messageBody,
      recipient_filter,
      recipient_count: notificationRows.length,
      status: 'QUEUED',
      scheduled_at: scheduled_at ?? null,
    },
    notifications_created: insertedNotifications.length,
    notification_ids: insertedNotifications.map((n) => n.id),
  }, { status: 201 })
}
