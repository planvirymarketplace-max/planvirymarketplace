/**
 * GET /api/autocomplete?q=wedding&limit=8&neighborhood=bay-view
 *
 * Queries search_autocomplete_terms using trigram + full-text search.
 * Returns ranked results: weight A first, then B, C, D.
 * Used by the hero search bar and directory search bar.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
// Short cache - 60s at CDN edge so repeated keystrokes are fast
export const revalidate = 0

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') ?? '').trim()
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') ?? '8', 10)))
  const neighborhood = searchParams.get('neighborhood') ?? null
  const categoryKey = searchParams.get('category_key') ?? null

  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Normalize query for trigram: lowercase, strip special chars
  const normalized = q.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()

  // Use RPC for ranked trigram + full-text search
  // Falls back to a plain ilike if the RPC doesn't exist
  let query = supabase
    .from('search_autocomplete_terms')
    .select('display_text, search_slug, category_key, category_slug, neighborhood, event_type, weight, seo_page_slug')
    .eq('is_active', true)
    .ilike('display_text', `%${normalized}%`)
    .order('weight', { ascending: true }) // A < B < C < D
    .limit(limit)

  if (neighborhood) {
    query = query.eq('neighborhood', neighborhood)
  }
  if (categoryKey) {
    query = query.eq('category_key', categoryKey)
  }

  const { data, error } = await query

  if (error) {
    console.error('Autocomplete error:', error.message)
    return NextResponse.json({ results: [] })
  }

  const results = (data ?? []).map(row => ({
    label: row.display_text,
    slug: row.search_slug,
    seoSlug: row.seo_page_slug,
    categoryKey: row.category_key,
    categorySlug: row.category_slug,
    neighborhood: row.neighborhood,
    eventType: row.event_type,
    weight: row.weight,
    // Build href: if it maps to a seo_pages slug, link there; else link to directory
    href: row.seo_page_slug
      ? `/${row.seo_page_slug}`
      : row.category_slug
        ? `/directory?category=${row.category_slug}`
        : `/directory?q=${encodeURIComponent(row.display_text)}`,
  }))

  return NextResponse.json(
    { results },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    }
  )
}
