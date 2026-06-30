import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

interface SearchRequest {
  category_key: string
  filters?: unknown[]
  user_lat?: number
  user_lng?: number
  radius_miles?: number
  availability_date?: string
  limit?: number
  offset?: number
}

/**
 * POST /api/search
 *
 * Queries vendor_profiles directly via vendor_category_groups → vendor_categories join.
 * The search_vendors() RPC is bypassed because it returns 0 results (broken).
 */
export async function POST(request: Request) {
  try {
    const body: SearchRequest = await request.json()

    if (!body.category_key) {
      return NextResponse.json(
        { error: 'category_key is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const limit = body.limit ?? 21
    const offset = body.offset ?? 0

    // 1. Resolve the group UUID for this category key (e.g. 'venues', 'catering')
    const { data: groupData } = await supabase
      .from('vendor_category_groups')
      .select('id')
      .eq('slug', body.category_key)
      .single()

    if (!groupData) {
      return NextResponse.json({ vendors: [], total: 0, limit, offset })
    }

    // 2. Get all category IDs belonging to this group
    const { data: catData } = await supabase
      .from('vendor_categories')
      .select('id')
      .eq('group_id', groupData.id)

    const catIds = catData?.map((c: { id: string }) => c.id) ?? []

    if (catIds.length === 0) {
      return NextResponse.json({ vendors: [], total: 0, limit, offset })
    }

    // 3. Query vendor_profiles filtered by those category IDs
    const { data, count, error } = await supabase
      .from('vendor_profiles')
      .select(
        'id, business_name, slug, neighborhood, logo_url, cover_url, avg_rating, review_count, price_range, price_starting_at, is_featured, is_verified, instant_booking',
        { count: 'exact' }
      )
      .in('category_id', catIds)
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('avg_rating', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Directory search error:', error)
      return NextResponse.json(
        { error: 'Failed to search vendors', details: error.message },
        { status: 500 }
      )
    }

    const vendors = (data ?? []).map((v) => ({
      vendor_id: v.id,
      business_name: v.business_name,
      slug: v.slug,
      cover_url: v.cover_url || v.logo_url || null,
      avg_rating: v.avg_rating ?? null,
      review_count: v.review_count ?? null,
      price_range: v.price_range ?? null,
      price_starting_at: v.price_starting_at ?? null,
      neighborhood: v.neighborhood ?? null,
      is_featured: v.is_featured ?? false,
      is_verified: v.is_verified ?? false,
      instant_booking: v.instant_booking ?? false,
      distance_miles: null,
      match_count: 0,
      _total_count: count ?? 0,
    }))

    // ─── Log search query to search_logs (P2: search quality improvement) ──
    await supabase.from('search_logs').insert({
      query: body.category_key,
      filters: { lat: body.user_lat, lng: body.user_lng, date: body.availability_date },
      results_count: count ?? 0,
    })

    return NextResponse.json({
      vendors,
      total: count ?? 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error in search:', error)
    return NextResponse.json(
      { error: 'Failed to search vendors' },
      { status: 500 }
    )
  }
}
