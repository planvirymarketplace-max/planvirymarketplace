import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/waitlist/[id]/offer — offer waitlisted tickets (status WAITING → NOTIFIED)
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
  if (entry.status !== 'WAITING') {
    return NextResponse.json({ error: `Entry is ${entry.status}, must be WAITING` }, { status: 409 })
  }

  const { data: updated, error } = await supabase
    .from('waitlist_entries')
    .update({
      status: 'NOTIFIED',
      notified_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 15 * 60_000).toISOString(),
    })
    .eq('id', entryId)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('domain_events').insert({
    event_type: 'waitlist.offered',
    entity_type: 'waitlist_entry',
    entity_id: entryId,
    payload: { user_id: entry.user_id, expires_at: updated.expires_at },
  })

  return NextResponse.json({ waitlist_entry: updated })
}
