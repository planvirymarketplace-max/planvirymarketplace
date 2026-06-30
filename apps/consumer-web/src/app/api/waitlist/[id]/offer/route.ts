import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/waitlist/[id]/offer — offer waitlisted tickets when capacity frees up
// Moves the next person on the waitlist to OFFERED status with a 15-min TTL.
// Adapted from Hi.Events: OfferWaitlistEntryHandler

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
    .select('metadata, quantity_total, quantity_reserved')
    .eq('id', tier_id)
    .maybeSingle()

  if (!tier) return NextResponse.json({ error: 'Tier not found' }, { status: 404 })

  const meta = (tier.metadata as Record<string, unknown>) ?? {}
  const waitlist = (meta.waitlist as Array<Record<string, unknown>>) ?? []

  const entry = waitlist.find((e) => e.id === entryId)
  if (!entry) return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 })
  if (entry.status !== 'WAITING') {
    return NextResponse.json({ error: `Entry is already ${entry.status}` }, { status: 409 })
  }

  // Check capacity is now available
  const available = tier.quantity_total - tier.quantity_reserved
  if (available < (entry.quantity as number)) {
    return NextResponse.json({ error: 'Insufficient capacity to offer', available, needed: entry.quantity }, { status: 409 })
  }

  // Offer the tickets — 15 min to accept
  entry.status = 'OFFERED'
  entry.offer_expires_at = new Date(Date.now() + 15 * 60_000).toISOString()

  await supabase
    .from('ticket_tiers')
    .update({ metadata: { ...meta, waitlist } })
    .eq('id', tier_id)

  // Emit domain event
  await supabase.from('domain_events').insert({
    event_type: 'waitlist.offered',
    entity_type: 'ticket_tier',
    entity_id: tier_id,
    payload: { entry_id: entryId, user_id: entry.user_id, offer_expires_at: entry.offer_expires_at },
  })

  return NextResponse.json({ waitlist_entry: entry })
}
