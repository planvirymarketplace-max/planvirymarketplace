import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/orders/[id]/mark-paid — mark reservation as paid (offline payment)
// For cash/check/at-door payments. Vendor confirms payment received.
// Adapted from Hi.Events: MarkOrderAsPaidHandler

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id: reservationId } = await params
  const body = await request.json().catch(() => ({}))
  const { payment_method = 'CASH', notes } = body

  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, status, user_id, item_id, ttl_expires_at')
    .eq('id', reservationId)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  if (reservation.status !== 'PENDING') {
    return NextResponse.json({ error: `Must be PENDING; current: ${reservation.status}` }, { status: 409 })
  }

  // RLS: vendor staff only
  const { data: item } = await supabase
    .from('inventory_items')
    .select('vendor_id')
    .eq('id', reservation.item_id)
    .maybeSingle()

  const { data: staff } = await supabase
    .from('vendor_staff')
    .select('role')
    .eq('vendor_id', item?.vendor_id)
    .eq('user_id', user.id)
    .eq('status', 'ACTIVE')
    .maybeSingle()

  if (!staff) return NextResponse.json({ error: 'Only vendor staff can mark as paid' }, { status: 403 })

  // Confirm the reservation (no Stripe payment_intent since offline)
  const { error: rpcErr } = await supabase.rpc('rpc_confirm_reservation', {
    p_reservation_id: reservationId,
    p_stripe_payment_intent_id: `OFFLINE_${payment_method}_${Date.now()}`,
  })

  if (rpcErr) {
    await supabase
      .from('reservations')
      .update({
        status: 'CONFIRMED',
        confirmed_at: new Date().toISOString(),
        stripe_payment_intent_id: `OFFLINE_${payment_method}_${Date.now()}`,
      })
      .eq('id', reservationId)
      .eq('status', 'PENDING')
  }

  await supabase.from('domain_events').insert({
    event_type: 'reservation.offline_paid',
    entity_type: 'reservation',
    entity_id: reservationId,
    payload: { payment_method, notes, marked_by: user.id },
  })

  return NextResponse.json({
    reservation_id: reservationId,
    status: 'CONFIRMED',
    payment_method,
    notes,
  })
}
