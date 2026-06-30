import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// PATCH /api/orders/[id]/edit — edit a reservation (quantity, dates)
// Adapted from Hi.Events: EditOrderHandler

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id: reservationId } = await params
  const body = await request.json()
  const { quantity, starts_at, ends_at } = body

  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, status, user_id, item_id, quantity, unit_price_cents, total_price_cents')
    .eq('id', reservationId)
    .maybeSingle()

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })

  // RLS
  if (reservation.user_id !== user.id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Only allow edits on PENDING or CONFIRMED
  if (!['PENDING', 'CONFIRMED'].includes(reservation.status)) {
    return NextResponse.json({ error: `Cannot edit ${reservation.status} reservation` }, { status: 409 })
  }

  const update: Record<string, unknown> = {}

  if (quantity !== undefined && quantity !== reservation.quantity) {
    // If increasing quantity, check capacity
    if (quantity > reservation.quantity) {
      const { data: item } = await supabase
        .from('inventory_items')
        .select('category')
        .eq('id', reservation.item_id)
        .maybeSingle()

      if (item?.category === 'EVENT_TICKET') {
        const { data: tier } = await supabase
          .from('ticket_tiers')
          .select('id, quantity_total, quantity_reserved')
          .eq('item_id', reservation.item_id)
          .maybeSingle()

        if (tier) {
          const additionalNeeded = quantity - reservation.quantity
          const available = tier.quantity_total - tier.quantity_reserved
          if (available < additionalNeeded) {
            return NextResponse.json({ error: 'Insufficient capacity for quantity increase', available, needed: additionalNeeded }, { status: 409 })
          }
          // Reserve the additional
          await supabase
            .from('ticket_tiers')
            .update({ quantity_reserved: tier.quantity_reserved + additionalNeeded })
            .eq('id', tier.id)
        }
      }
    } else if (quantity < reservation.quantity) {
      // Decreasing — release capacity
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
          const released = reservation.quantity - quantity
          await supabase
            .from('ticket_tiers')
            .update({ quantity_reserved: Math.max(0, tier.quantity_reserved - released) })
            .eq('id', tier.id)
        }
      }
    }

    update.quantity = quantity
    update.total_price_cents = reservation.unit_price_cents * quantity
  }

  if (starts_at !== undefined) update.starts_at = starts_at
  if (ends_at !== undefined) update.ends_at = ends_at

  const { data: updated, error } = await supabase
    .from('reservations')
    .update(update)
    .eq('id', reservationId)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('domain_events').insert({
    event_type: 'reservation.edited',
    entity_type: 'reservation',
    entity_id: reservationId,
    payload: { fields: Object.keys(update), edited_by: user.id, previous_quantity: reservation.quantity },
  })

  return NextResponse.json({ reservation: updated })
}
