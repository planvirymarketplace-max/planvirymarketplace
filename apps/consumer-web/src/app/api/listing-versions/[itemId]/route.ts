import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/listing-versions/[itemId] — list version history for an item
// POST /api/listing-versions — create a version snapshot (called on inventory update)
// REAL TABLE: listing_versions (id, item_id, version_data, version_number, created_at)

export async function GET(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('listing_versions')
    .select('*')
    .eq('item_id', itemId)
    .order('version_number', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ versions: data ?? [] })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { item_id, version_data } = body
  if (!item_id || !version_data) return NextResponse.json({ error: 'item_id and version_data required' }, { status: 400 })

  // Get next version number
  const { count } = await supabase
    .from('listing_versions')
    .select('*', { count: 'exact', head: true })
    .eq('item_id', item_id)

  const { data, error } = await supabase
    .from('listing_versions')
    .insert({ item_id, version_data, version_number: (count ?? 0) + 1 })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ version: data }, { status: 201 })
}
