import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/waitlist/[id]/decline — decline offer (status → DECLINED, offer next person)
// Uses REAL TABLE: waitlist_entries

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

  // Decline
  await supabase
    .from('waitlist_entries')
    .update({ status: 'DECLINED' })
    .eq('id', entryId)

  // Offer to next WAITING person
  const { data: nextWaiting } = await supabase
    .from('waitlist_entries')
    .select('id, user_id, quantity')
    .eq('item_id', entry.item_id)
    .eq('status', 'WAITING')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  let nextOffer = null
  if (nextWaiting) {
    const { data: notified } = await supabase
      .from('waitlist_entries')
      .update({
        status: 'NOTIFIED',
        notified_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 15 * 60_000).toISOString(),
      })
      .eq('id', nextWaiting.id)
      .select('*')
      .single()

    nextOffer = notified

    await supabase.from('domain_events').insert({
      event_type: 'waitlist.offered',
      entity_type: 'waitlist_entry',
      entity_id: nextWaiting.id,
      payload: { user_id: nextWaiting.user_id, expires_at: notified?.expires_at },
    })
  }

  return NextResponse.json({ declined: true, entry_id: entryId, next_offer: nextOffer })
}
