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

  const message = {
    id: randomUUID(),
    event_id,
    sender_id: user.id,
    subject,
    body: messageBody,
    recipient_filter,
    recipient_count: recipients?.length ?? 0,
    status: scheduled_at ? 'SCHEDULED' : 'SENDING',
    scheduled_at: scheduled_at ?? null,
    sent_at: scheduled_at ? null : new Date().toISOString(),
  }

  // Store message in event metadata
  const { data: ev } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', event_id)
    .maybeSingle()

  const meta = (ev?.metadata as Record<string, unknown>) ?? {}
  const messages = (meta.messages as Array<Record<string, unknown>>) ?? []
  messages.push(message)

  await supabase
    .from('inventory_items')
    .update({ metadata: { ...meta, messages } })
    .eq('id', event_id)

  // Emit domain event (triggers notification-send worker)
  await supabase.from('domain_events').insert({
    event_type: 'message.queued',
    entity_type: 'inventory_item',
    entity_id: event_id,
    payload: { message_id: message.id, recipient_count: message.recipient_count, scheduled_at },
  })

  return NextResponse.json({ message }, { status: 201 })
}
