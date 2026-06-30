import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/waitlist/[id]/accept — accept offer (creates reservation, marks CONVERTED)
// Uses REAL TABLE: waitlist_entries (converted_reservation_id field)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { id: entryId } = await params

  const { data: entry } = await supabase
    .from('waitlist_entries')
    .select('*')
    .eq('id', entryId)
    .maybeSingle()

  if (!entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
  if (entry.status !== 'NOTIFIED') {
    return NextResponse.json({ error: `Entry is ${entry.status}, must be NOTIFIED` }, { status: 409 })
  }
  if (entry.expires_at && new Date(entry.expires_at) < new Date()) {
    await supabase.from('waitlist_entries').update({ status: 'EXPIRED' }).eq('id', entryId)
    return NextResponse.json({ error: 'Offer has expired' }, { status: 410 })
  }

  // Load item for vendor_id + price
  const { data: item } = await supabase
    .from('inventory_items')
    .select('id, vendor_id, base_price_cents, currency')
    .eq('id', entry.item_id)
    .maybeSingle()

  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

  // Create PENDING reservation
  const totalPriceCents = (item.base_price_cents ?? 0) * entry.quantity
  const { data: reservation, error: resErr } = await supabase
    .from('reservations')
    .insert({
      user_id: entry.user_id,
      item_id: entry.item_id,
      vendor_id: item.vendor_id,
      status: 'PENDING',
      quantity: entry.quantity,
      unit_price_cents: item.base_price_cents,
      total_price_cents: totalPriceCents,
      currency: item.currency ?? 'USD',
      ttl_expires_at: new Date(Date.now() + 15 * 60_000).toISOString(),
    })
    .select('id')
    .single()

  if (resErr) return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })

  // Mark waitlist entry as CONVERTED
  const { data: updated } = await supabase
    .from('waitlist_entries')
    .update({
      status: 'CONVERTED',
      converted_reservation_id: reservation.id,
    })
    .eq('id', entryId)
    .select('*')
    .single()

  await supabase.from('domain_events').insert({
    event_type: 'waitlist.accepted',
    entity_type: 'waitlist_entry',
    entity_id: entryId,
    payload: { reservation_id: reservation.id, user_id: entry.user_id },
  })

  return NextResponse.json({
    waitlist_entry: updated,
    reservation_id: reservation.id,
    status: 'PENDING',
    total_price_cents: totalPriceCents,
  })
}
