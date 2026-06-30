import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/capacity-assignments — create shared capacity pool across tiers
// GET /api/capacity-assignments?event_id= — list capacity pools for an event
// Adapted from Hi.Events: CapacityAssignment model, capacity_assignments table

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')

  if (!eventId) return NextResponse.json({ error: 'event_id is required' }, { status: 400 })

  // Capacity pools stored in inventory_items.metadata.capacity_assignments
  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const pools = (meta.capacity_assignments as Array<Record<string, unknown>>) ?? []

  return NextResponse.json({ capacity_assignments: pools })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { event_id, name, capacity, tier_ids, applies_to = 'PRODUCTS' } = body

  if (!event_id || !capacity) {
    return NextResponse.json({ error: 'event_id and capacity are required' }, { status: 400 })
  }

  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', event_id)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const pools = (meta.capacity_assignments as Array<Record<string, unknown>>) ?? []

  const newPool = {
    id: crypto.randomUUID(),
    name: name ?? 'Shared Capacity',
    capacity,
    used_capacity: 0,
    applies_to, // 'EVENT' | 'PRODUCTS'
    tier_ids: tier_ids ?? [], // which ticket_tiers share this pool
    status: 'ACTIVE',
  }

  pools.push(newPool)

  await supabase
    .from('inventory_items')
    .update({ metadata: { ...meta, capacity_assignments: pools } })
    .eq('id', event_id)

  return NextResponse.json({ capacity_assignment: newPool }, { status: 201 })
}
