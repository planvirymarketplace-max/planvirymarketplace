import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/waitlist/[id]/accept — accept a waitlist offer (creates reservation)
// Adapted from Hi.Events: WaitlistEntry accept flow

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id: entryId } = await params
  const body = await request.json().catch(() => ({}))
  const { tier_id } = body

  if (!tier_id) return NextResponse.json({ error: 'tier_id is required' }, { status: 400 })

  const { data: tier } = await supabase
    .from('ticket_tiers')
    .select('metadata, quantity_total, quantity_reserved, price_cents, item_id')
    .eq('id', tier_id)
    .maybeSingle()

  if (!tier) return NextResponse.json({ error: 'Tier not found' }, { status: 404 })

  const meta = (tier.metadata as Record<string, unknown>) ?? {}
  const waitlist = (meta.waitlist as Array<Record<string, unknown>>) ?? []
  const entry = waitlist.find((e) => e.id === entryId)

  if (!entry) return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 })
  if (entry.status !== 'OFFERED') {
    return NextResponse.json({ error: `Entry is ${entry.status}, must be OFFERED` }, { status: 409 })
  }

  // Check offer not expired
  if (entry.offer_expires_at && new Date(entry.offer_expires_at as string) < new Date()) {
    entry.status = 'EXPIRED'
    await supabase
      .from('ticket_tiers')
      .update({ metadata: { ...meta, waitlist } })
      .eq('id', tier_id)
    return NextResponse.json({ error: 'Offer has expired' }, { status: 410 })
  }

  // Check capacity still available
  const available = tier.quantity_total - tier.quantity_reserved
  if (available < (entry.quantity as number)) {
    return NextResponse.json({ error: 'Capacity no longer available' }, { status: 409 })
  }

  // Reserve capacity
  await supabase
    .from('ticket_tiers')
    .update({ quantity_reserved: tier.quantity_reserved + (entry.quantity as number) })
    .eq('id', tier_id)

  // Create PENDING reservation
  const totalPriceCents = tier.price_cents * (entry.quantity as number)
  const { data: reservation, error: resErr } = await supabase
    .from('reservations')
    .insert({
      user_id: entry.user_id,
      item_id: tier.item_id,
      vendor_id: (tier as { vendor_id?: string }).vendor_id ?? null,
      status: 'PENDING',
      quantity: entry.quantity,
      unit_price_cents: tier.price_cents,
      total_price_cents: totalPriceCents,
      currency: 'USD',
      ttl_expires_at: new Date(Date.now() + 15 * 60_000).toISOString(),
    })
    .select('id')
    .single()

  if (resErr) {
    // Rollback capacity
    await supabase
      .from('ticket_tiers')
      .update({ quantity_reserved: tier.quantity_reserved })
      .eq('id', tier_id)
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
  }

  // Update waitlist entry
  entry.status = 'ACCEPTED'
  entry.reservation_id = reservation.id
  entry.accepted_at = new Date().toISOString()

  await supabase
    .from('ticket_tiers')
    .update({ metadata: { ...meta, waitlist } })
    .eq('id', tier_id)

  await supabase.from('domain_events').insert({
    event_type: 'waitlist.accepted',
    entity_type: 'ticket_tier',
    entity_id: tier_id,
    payload: { entry_id: entryId, reservation_id: reservation.id, user_id: entry.user_id },
  })

  return NextResponse.json({
    waitlist_entry: entry,
    reservation_id: reservation.id,
    status: 'PENDING',
    total_price_cents: totalPriceCents,
    message: 'Reservation created. Complete checkout to confirm.',
  })
}
