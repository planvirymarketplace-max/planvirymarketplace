import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { randomUUID } from 'crypto'

// GET /api/product-categories?event_id= — list product categories for an event
// POST /api/product-categories — create a product category (group ticket tiers)
// Adapted from Hi.Events: ProductCategory model, CreateProductCategoryHandler

export async function GET(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')

  if (!eventId) return NextResponse.json({ error: 'event_id is required' }, { status: 400 })

  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const categories = (meta.product_categories as Array<Record<string, unknown>>) ?? []

  return NextResponse.json({ product_categories: categories })
}

export async function POST(request: NextRequest) {
  const serverClient = await createServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await request.json()
  const { event_id, name, description, sort_order, is_collapsed } = body

  if (!event_id || !name) {
    return NextResponse.json({ error: 'event_id and name are required' }, { status: 400 })
  }

  const { data: event } = await supabase
    .from('inventory_items')
    .select('metadata')
    .eq('id', event_id)
    .maybeSingle()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const meta = (event.metadata as Record<string, unknown>) ?? {}
  const categories = (meta.product_categories as Array<Record<string, unknown>>) ?? []

  const newCategory = {
    id: randomUUID(),
    name,
    description: description ?? null,
    sort_order: sort_order ?? categories.length,
    is_collapsed: is_collapsed ?? false,
    tier_ids: [] as string[],
    created_at: new Date().toISOString(),
  }

  categories.push(newCategory)
  categories.sort((a, b) => (a.sort_order as number) - (b.sort_order as number))

  await supabase
    .from('inventory_items')
    .update({ metadata: { ...meta, product_categories: categories } })
    .eq('id', event_id)

  return NextResponse.json({ product_category: newCategory }, { status: 201 })
}
