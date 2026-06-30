import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomUUID } from 'crypto'

// GET /api/events/[eventId]/check-in-lists — list check-in lists for an event
// POST /api/events/[eventId]/check-in-lists — create a check-in list
// Adapted from Hi.Events: CheckInList model, CreateCheckInListHandler
// Multiple check-in lists per event (e.g. "Day 1 Door", "VIP Entrance")

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params
  const supabase = createAdminClient()

  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const lists = (meta.check_in_lists as Array<Record<string, unknown>>) ?? []

  return NextResponse.json({ check_in_lists: lists })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { eventId } = await params
  const supabase = createAdminClient()
  const body = await request.json()
  const { name, activates_at, expires_at, tier_ids } = body

  if (!name || !activates_at || !expires_at) {
    return NextResponse.json({ error: 'name, activates_at, expires_at are required' }, { status: 400 })
  }

  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  // Verify user owns the event
  const { data: staff } = await supabase
    .from('vendor_staff')
    .select('role')
    .eq('vendor_id', (event as { vendor_id?: string }).vendor_id)
    .eq('user_id', user.id)
    .maybeSingle()

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const lists = (meta.check_in_lists as Array<Record<string, unknown>>) ?? []

  const newList = {
    id: randomUUID(),
    name,
    activates_at,
    expires_at,
    tier_ids: tier_ids ?? null, // null = all tiers
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
  }

  lists.push(newList)

  await supabase
    .from('inventory_items')
    .update({ metadata: { ...meta, check_in_lists: lists } })
    .eq('id', eventId)

  return NextResponse.json({ check_in_list: newList }, { status: 201 })
}
