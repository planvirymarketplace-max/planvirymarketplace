/**
 * GET /api/autocomplete?q=austin&limit=8
 * Returns autocomplete suggestions from taxonomy_nodes + inventory_items.
 * RETROFITTED for new schema (Part XLVI).
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') ?? '').trim()
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') ?? '8', 10)))

  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const supabase = createAdminClient()

    // Query taxonomy_nodes for category/type suggestions
    const { data: taxResults, error: taxErr } = await supabase
      .from('taxonomy_nodes')
      .select('name, category, path')
      .ilike('name', `%${q}%`)
      .limit(limit)

    // Query inventory_items for listing suggestions
    const { data: itemResults, error: itemErr } = await supabase
      .from('inventory_items')
      .select('title, slug, category')
      .eq('status', 'PUBLISHED')
      .ilike('title', `%${q}%`)
      .limit(limit)

    // Query locations for city suggestions
    const { data: locResults, error: locErr } = await supabase
      .from('locations')
      .select('name, slug, region')
      .ilike('name', `%${q}%`)
      .limit(3)

    if (taxErr && itemErr && locErr) {
      console.error('[autocomplete] all queries failed:', { taxErr, itemErr, locErr })
      return NextResponse.json({ results: [] })
    }

    const results: Array<{ text: string; type: string; category?: string; weight?: string }> = []

    // Locations first (weight A)
    for (const loc of locResults ?? []) {
      results.push({ text: (loc as { name: string }).name, type: 'location', weight: 'A' })
    }

    // Taxonomy nodes (weight B)
    for (const tax of taxResults ?? []) {
      results.push({ text: (tax as { name: string }).name, type: 'category', category: (tax as { category: string }).category, weight: 'B' })
    }

    // Inventory items (weight C)
    for (const item of itemResults ?? []) {
      results.push({ text: (item as { title: string }).title, type: 'listing', category: (item as { category: string }).category, weight: 'C' })
    }

    return NextResponse.json({ results: results.slice(0, limit) })
  } catch (err) {
    console.error('[autocomplete] error:', err)
    return NextResponse.json({ results: [] })
  }
}
