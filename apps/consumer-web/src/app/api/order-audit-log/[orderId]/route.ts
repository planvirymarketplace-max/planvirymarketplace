import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/order-audit-log/[orderId] — full audit trail for a reservation
// Adapted from Hi.Events: OrderAuditLog model, OrderAuditLogService

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const supabase = createAdminClient()
  const { orderId } = await params

  // The domain_events table serves as the audit log
  const { data: events, error } = await supabase
    .from('domain_events')
    .select('id, event_type, entity_type, entity_id, payload, created_at')
    .eq('entity_id', orderId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Load the reservation itself
  const { data: reservation } = await supabase
    .from('reservations')
    .select(`
      id, status, quantity, unit_price_cents, total_price_cents, currency,
      created_at, confirmed_at, cancelled_at, cancelled_reason, completed_at,
      expired_at, ttl_expires_at, stripe_payment_intent_id, stripe_refund_id,
      refund_amount_cents,
      user_profiles!inner(display_name, email),
      inventory_items!inner(title)
    `)
    .eq('id', orderId)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })

  const auditLog = (events ?? []).map((e: Record<string, unknown>) => ({
    event_id: e.id,
    event_type: e.event_type,
    timestamp: e.created_at,
    details: e.payload,
  }))

  return NextResponse.json({
    reservation: {
      id: reservation.id,
      status: reservation.status,
      attendee: Array.isArray(reservation.user_profiles) ? reservation.user_profiles[0] : reservation.user_profiles,
      event_title: Array.isArray(reservation.inventory_items) ? reservation.inventory_items[0]?.title : reservation.inventory_items?.title,
      quantity: reservation.quantity,
      total_price_cents: reservation.total_price_cents,
      created_at: reservation.created_at,
      confirmed_at: reservation.confirmed_at,
      cancelled_at: reservation.cancelled_at,
      cancelled_reason: reservation.cancelled_reason,
    },
    audit_log: auditLog,
    total_events: auditLog.length,
  })
}
