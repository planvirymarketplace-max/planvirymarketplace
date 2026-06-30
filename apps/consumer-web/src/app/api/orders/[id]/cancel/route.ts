import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/orders/[id]/cancel — cancel a reservation (no refund, or partial)
// Adapted from Hi.Events: CancelOrderHandler

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
  const { reason = 'Cancelled by user' } = body

  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, status, user_id, item_id, quantity')
    .eq('id', reservationId)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  if (reservation.status === 'CANCELLED') return NextResponse.json({ error: 'Already cancelled' }, { status: 409 })
  if (reservation.status === 'COMPLETED' || reservation.status === 'NO_SHOW') {
    return NextResponse.json({ error: `Cannot cancel ${reservation.status} reservation — use refund` }, { status: 409 })
  }

  // RLS
  if (reservation.user_id !== user.id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Cancel via RPC (movinin FSM pattern)
  const { error: rpcErr } = await supabase.rpc('rpc_cancel_reservation', {
    p_reservation_id: reservationId,
    p_reason,
    p_refund_amount_cents: 0,
  })

  if (rpcErr) {
    // Fallback
    await supabase
      .from('reservations')
      .update({ status: 'CANCELLED', cancelled_at: new Date().toISOString(), cancelled_reason: reason })
      .eq('id', reservationId)
  }

  // Release capacity
  const { data: item } = await supabase
    .from('inventory_items')
    .select('category')
    .eq('id', reservation.item_id)
    .maybeSingle()

  if (item?.category === 'EVENT_TICKET') {
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
  }

  return NextResponse.json({ reservation_id: reservationId, status: 'CANCELLED', reason })
}
