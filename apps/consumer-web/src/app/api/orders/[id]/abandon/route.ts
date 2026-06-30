import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/orders/[id]/abandon — abandon a PENDING reservation (user left checkout)
// Releases held capacity. Different from cancel (no refund needed — was never paid).

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
    .select('id, status, user_id, item_id, quantity')
    .eq('id', reservationId)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  if (reservation.status !== 'PENDING') {
    return NextResponse.json({ error: `Can only abandon PENDING; current: ${reservation.status}` }, { status: 409 })
  }

  if (reservation.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Expire the reservation (releases capacity)
  const { error: rpcErr } = await supabase.rpc('rpc_expire_reservation', {
    p_reservation_id: reservationId,
  })

  if (rpcErr) {
    await supabase
      .from('reservations')
      .update({ status: 'EXPIRED', expired_at: new Date().toISOString() })
      .eq('id', reservationId)

    // Release ticket capacity
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
  }

  return NextResponse.json({ reservation_id: reservationId, status: 'EXPIRED', reason: 'abandoned' })
}
