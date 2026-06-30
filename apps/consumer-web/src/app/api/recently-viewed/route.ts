import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/recently-viewed?user_id= — list recently viewed items
// POST /api/recently-viewed — record a view (item_id in body)
// REAL TABLE: recently_viewed_items (id, user_id, item_id, viewed_at, view_count)

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('recently_viewed_items')
    .select('*, inventory_items!inner(id,title,slug,category,base_price_cents,media_assets(url,is_primary))')
    .eq('user_id', userId)
    .order('viewed_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { user_id, item_id } = body
  if (!user_id || !item_id) return NextResponse.json({ error: 'user_id and item_id required' }, { status: 400 })

  // Upsert: if exists, increment view_count + update viewed_at
  const { data: existing } = await supabase
    .from('recently_viewed_items')
    .select('id, view_count')
    .eq('user_id', user_id)
    .eq('item_id', item_id)
    .maybeSingle()

  if (existing) {
    const { data } = await supabase
      .from('recently_viewed_items')
      .update({ viewed_at: new Date().toISOString(), view_count: (existing.view_count ?? 0) + 1 })
      .eq('id', existing.id)
      .select('*')
      .single()
    return NextResponse.json({ item: data })
  }

  const { data, error } = await supabase
    .from('recently_viewed_items')
    .insert({ user_id, item_id, view_count: 1 })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data }, { status: 201 })
}
