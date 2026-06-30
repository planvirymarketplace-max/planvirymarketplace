import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// PATCH /api/events/[eventId]/check-in-lists/[listId] — update (name, expires_at, revoke)
// DELETE /api/events/[eventId]/check-in-lists/[listId] — delete
// REAL TABLE: check_in_lists

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; listId: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { eventId, listId } = await params
  const supabase = createAdminClient()
  const body = await request.json()

  const update: Record<string, unknown> = {}
  if (body.name !== undefined) update.name = body.name
  if (body.expires_at !== undefined) update.expires_at = body.expires_at
  if (body.revoke) update.revoked_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('check_in_lists')
    .update(update)
    .eq('id', listId)
    .eq('item_id', eventId)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ check_in_list: data })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; listId: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { eventId, listId } = await params
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('check_in_lists')
    .delete()
    .eq('id', listId)
    .eq('item_id', eventId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ deleted: true, id: listId })
}
