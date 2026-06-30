import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/waitlist/[id]/decline — decline a waitlist offer
// Moves to next person in waitlist if capacity is still available.

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
    .select('metadata')
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

  entry.status = 'DECLINED'
  entry.declined_at = new Date().toISOString()

  await supabase
    .from('ticket_tiers')
    .update({ metadata: { ...meta, waitlist } })
    .eq('id', tier_id)

  // Check if we can offer to the next person
  const available = (tier.quantity_total as number) - (tier.quantity_reserved as number)
  const nextWaiting = waitlist
    .filter((e) => e.status === 'WAITING')
    .sort((a, b) => (a.position as number) - (b.position as number))[0]

  let nextOffer = null
  if (nextWaiting && available >= (nextWaiting.quantity as number)) {
    nextWaiting.status = 'OFFERED'
    nextWaiting.offer_expires_at = new Date(Date.now() + 15 * 60_000).toISOString()

    await supabase
      .from('ticket_tiers')
      .update({ metadata: { ...meta, waitlist } })
      .eq('id', tier_id)

    nextOffer = {
      entry_id: nextWaiting.id,
      user_id: nextWaiting.user_id,
      offer_expires_at: nextWaiting.offer_expires_at,
    }

    await supabase.from('domain_events').insert({
      event_type: 'waitlist.offered',
      entity_type: 'ticket_tier',
      entity_id: tier_id,
      payload: nextOffer,
    })
  }

  return NextResponse.json({
    declined: true,
    entry_id: entryId,
    next_offer: nextOffer,
  })
}
