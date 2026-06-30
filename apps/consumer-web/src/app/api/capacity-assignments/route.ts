import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/capacity-assignments?event_id= — list from capacity_assignments table
// POST /api/capacity-assignments — create in capacity_assignments table
// REAL TABLE: capacity_assignments (id, item_id, name, capacity, used, created_at, updated_at)

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')

  if (!eventId) return NextResponse.json({ error: 'event_id is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('capacity_assignments')
    .select('*')
    .eq('item_id', eventId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ capacity_assignments: data ?? [] })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { event_id, name, capacity } = body

  if (!event_id || !name || capacity === undefined) {
    return NextResponse.json({ error: 'event_id, name, capacity are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('capacity_assignments')
    .insert({
      item_id: event_id,
      name,
      capacity,
      used: 0,
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ capacity_assignment: data }, { status: 201 })
}
