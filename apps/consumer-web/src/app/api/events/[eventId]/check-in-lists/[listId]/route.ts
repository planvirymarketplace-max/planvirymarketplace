import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// PATCH /api/events/[eventId]/check-in-lists/[listId] — update check-in list
// DELETE /api/events/[eventId]/check-in-lists/[listId] — delete check-in list
// Adapted from Hi.Events: UpdateCheckInListHandler, DeleteCheckInListHandler

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

  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const lists = (meta.check_in_lists as Array<Record<string, unknown>>) ?? []
  const list = lists.find((l) => l.id === listId)

  if (!list) return NextResponse.json({ error: 'Check-in list not found' }, { status: 404 })

  if (body.name !== undefined) list.name = body.name
  if (body.activates_at !== undefined) list.activates_at = body.activates_at
  if (body.expires_at !== undefined) list.expires_at = body.expires_at
  if (body.tier_ids !== undefined) list.tier_ids = body.tier_ids
  if (body.status !== undefined) list.status = body.status

  await supabase
    .from('inventory_items')
    .update({ metadata: { ...meta, check_in_lists: lists } })
    .eq('id', eventId)

  return NextResponse.json({ check_in_list: list })
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

  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const lists = (meta.check_in_lists as Array<Record<string, unknown>>) ?? []
  const filtered = lists.filter((l) => l.id !== listId)

  if (lists.length === filtered.length) {
    return NextResponse.json({ error: 'Check-in list not found' }, { status: 404 })
  }

  await supabase
    .from('inventory_items')
    .update({ metadata: { ...meta, check_in_lists: filtered } })
    .eq('id', eventId)

  return NextResponse.json({ deleted: true, id: listId })
}
