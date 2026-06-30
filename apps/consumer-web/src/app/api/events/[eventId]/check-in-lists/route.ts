import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomUUID } from 'crypto'

// GET /api/events/[eventId]/check-in-lists — list check-in lists from check_in_lists table
// POST /api/events/[eventId]/check-in-lists — create in check_in_lists table
// REAL TABLE: check_in_lists (id, item_id, name, public_token, expires_at, created_by, revoked_at, created_at, updated_at)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('check_in_lists')
    .select('*')
    .eq('item_id', eventId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ check_in_lists: data ?? [] })
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
  const { name, expires_at } = body

  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('check_in_lists')
    .insert({
      item_id: eventId,
      name,
      public_token: randomUUID(),
      expires_at: expires_at ?? null,
      created_by: user.id,
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ check_in_list: data }, { status: 201 })
}
