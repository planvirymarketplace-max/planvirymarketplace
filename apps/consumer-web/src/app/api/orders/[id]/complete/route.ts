import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/orders/[id]/complete — mark reservation as COMPLETED (post-event)
// Adapted from Hi.Events: CompleteOrderHandler, rpc_complete_reservation

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id: reservationId } = await params

  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, status, user_id, item_id')
    .eq('id', reservationId)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  if (reservation.status !== 'CONFIRMED') {
    return NextResponse.json({ error: `Must be CONFIRMED to complete; current: ${reservation.status}` }, { status: 409 })
  }

  // RLS: owner or admin
  if (reservation.user_id !== user.id && user.role !== 'ADMIN') {
    // Check if vendor staff
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
      .maybeSingle()
    if (!staff) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Call RPC
  const { error: rpcErr } = await supabase.rpc('rpc_complete_reservation', {
    p_reservation_id: reservationId,
  })

  if (rpcErr) {
    // Fallback
    await supabase
      .from('reservations')
      .update({ status: 'COMPLETED', completed_at: new Date().toISOString() })
      .eq('id', reservationId)
      .eq('status', 'CONFIRMED')
  }

  await supabase.from('domain_events').insert({
    event_type: 'reservation.completed',
    entity_type: 'reservation',
    entity_id: reservationId,
    payload: { completed_by: user.id },
  })

  return NextResponse.json({ reservation_id: reservationId, status: 'COMPLETED' })
}
