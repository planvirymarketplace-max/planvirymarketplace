import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * Maps top-level NAV_CATEGORIES keys to the DB filter_schema_key prefix.
 * DB uses e.g. "bars_cocktail", "bars_brewery" - prefix is "bars".
 */
const CATEGORY_PREFIX_MAP: Record<string, string> = {
  venues: 'venues',
  event_planning: 'planning',
  catering: 'food',
  bars_nightlife: 'bars',
  restaurants: 'restaurant',
  djs_entertainment: 'entertainment',
  photography: 'planning',
  floral_decor: 'decor',
  beauty: 'beauty',
  attire: 'attire',
  transportation: 'transport',
  equipment_rentals: 'rentals',
  hotels: 'lodging',
  travel: 'travel',
}

/**
 * GET /api/directory?categoryKey=venues&page=1&limit=500
 * categoryKey = NAV_CATEGORIES key (e.g. "venues", "bars_nightlife")
 * Falls back to returning all vendors if no category match.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryKey = searchParams.get('categoryKey') // NAV_CATEGORIES key
    const subKey = searchParams.get('subKey')            // filter_schema_key of sub-category
    const category = searchParams.get('category')       // legacy: vendor_categories.slug exact
    const group = searchParams.get('group')              // legacy: group slug
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)))
    const priceRange = searchParams.get('price_range')
    const neighborhood = searchParams.get('neighborhood')
    const isFeatured = searchParams.get('is_featured')
    const isVerified = searchParams.get('is_verified')
    const sort = searchParams.get('sort') || 'featured'

    const supabase = createAdminClient()

    // Check if vendor_card_cache has data
    const { count: cacheCount } = await supabase
      .from('vendor_card_cache')
      .select('*', { count: 'exact', head: true })

    // Use vendor_card_cache only for uncategorized listing - cache has null category_slug,
    // so category-filtered requests must fall through to the direct vendor_profiles query.
    if ((cacheCount ?? 0) > 0 && !categoryKey) {
      let query = supabase
        .from('vendor_card_cache')
        .select('vendor_id, business_name, slug, primary_photo_url, logo_url, avg_rating, review_count, price_range, price_starting_at, neighborhood, badge_featured, badge_verified, badge_instant_booking, is_published', { count: 'exact' })
        .eq('is_published', true)
      if (priceRange) query = query.eq('price_range', priceRange)
      if (neighborhood) query = query.eq('neighborhood', neighborhood)
      if (isFeatured === 'true') query = query.eq('badge_featured', true)
      if (isVerified === 'true') query = query.eq('badge_verified', true)

      switch (sort) {
        case 'rating': query = query.order('avg_rating', { ascending: false, nullsFirst: false }); break
        case 'reviews': query = query.order('review_count', { ascending: false, nullsFirst: false }); break
        case 'name': query = query.order('business_name', { ascending: true }); break
        default: query = query.order('badge_featured', { ascending: false }).order('avg_rating', { ascending: false, nullsFirst: false })
      }

      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)

      const { data: vendors, error, count } = await query
      if (error) {
        console.error('Cache error:', error)
        return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
      }

      // Normalise cache field names to match VendorSearchResult shape expected by the client
      const normalised = (vendors ?? []).map((v) => ({
        ...v,
        cover_url: v.primary_photo_url || v.logo_url || null,
        is_featured: v.badge_featured ?? false,
        is_verified: v.badge_verified ?? false,
        instant_booking: v.badge_instant_booking ?? false,
      }))

      return NextResponse.json({ vendors: normalised, total: count ?? 0, page, limit })
    }

    // Resolve category IDs if needed
    let categoryIds: string[] | null = null

    // subKey takes priority: filter by exact filter_schema_key on vendor_categories
    if (subKey) {
      const { data: cats } = await supabase
        .from('vendor_categories')
        .select('id')
        .ilike('filter_schema_key', `${subKey}%`)
      if (cats && cats.length > 0) {
        categoryIds = cats.map((c: { id: string }) => c.id)
      } else {
        // sub-category exists in nav but has no DB match - return empty gracefully
        return NextResponse.json({ vendors: [], total: 0, page, limit })
      }
    } else if (categoryKey) {
      // New: categoryKey param - NAV_CATEGORIES key with prefix map
      const prefix = CATEGORY_PREFIX_MAP[categoryKey] ?? categoryKey
      const { data: cats } = await supabase
        .from('vendor_categories')
        .select('id')
        .ilike('filter_schema_key', `${prefix}%`)
      if (cats && cats.length > 0) {
        categoryIds = cats.map((c: { id: string }) => c.id)
      }
    }

    // Legacy: category by slug
    if (!categoryKey && (category || group)) {
      let catQuery = supabase.from('vendor_categories').select('id, slug, name, vendor_category_groups(slug, name)')
      
      if (category) {
        catQuery = catQuery.eq('slug', category)
      }
      if (group) {
        const { data: grp } = await supabase
          .from('vendor_category_groups')
          .select('id')
          .eq('slug', group)
          .single()
        if (grp) {
          catQuery = supabase.from('vendor_categories').select('id, slug, name, vendor_category_groups(slug, name)').eq('group_id', grp.id)
        }
      }
      
      const { data: cats } = await catQuery
      if (cats && cats.length > 0) {
        categoryIds = cats.map(c => c.id)
      }
    }

    // Query vendor_profiles
    let query = supabase
      .from('vendor_profiles')
      .select('id, business_name, slug, tagline, bio, logo_url, cover_url, neighborhood, address, address_city, price_range, price_starting_at, avg_rating, review_count, is_featured, is_verified, instant_booking, is_premium, category_id', { count: 'exact' })
      .eq('is_published', true)

    if (categoryIds && categoryIds.length > 0) {
      query = query.in('category_id', categoryIds)
    }
    if (priceRange) query = query.eq('price_range', priceRange)
    if (neighborhood) query = query.eq('neighborhood', neighborhood)
    if (isFeatured === 'true') query = query.eq('is_featured', true)
    if (isVerified === 'true') query = query.eq('is_verified', true)

    switch (sort) {
      case 'rating': query = query.order('avg_rating', { ascending: false, nullsFirst: false }); break
      case 'reviews': query = query.order('review_count', { ascending: false, nullsFirst: false }); break
      case 'name': query = query.order('business_name', { ascending: true }); break
      default: query = query.order('is_featured', { ascending: false }).order('avg_rating', { ascending: false, nullsFirst: false })
    }

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: vendors, error, count } = await query

    if (error) {
      console.error('Profiles error:', error)
      return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
    }

    // Get category info for the returned vendors
    const vendorCategoryIds = [...new Set((vendors || []).map((v: any) => v.category_id).filter(Boolean))]
    
    let categoryMap: Record<string, any> = {}
    if (vendorCategoryIds.length > 0) {
      const { data: cats } = await supabase
        .from('vendor_categories')
        .select('id, slug, name, group_id, vendor_category_groups(slug, name)')
        .in('id', vendorCategoryIds)
      
      if (cats) {
        for (const c of cats) {
          categoryMap[c.id] = c
        }
      }
    }

    // Transform to card format
    const cards = (vendors || []).map((v: any) => {
      const cat = categoryMap[v.category_id] as any
      return {
        vendor_id: v.id,
        business_name: v.business_name,
        slug: v.slug,
        category_slug: cat?.slug || null,
        category_name: cat?.name || null,
        group_slug: cat?.vendor_category_groups?.slug || null,
        group_name: cat?.vendor_category_groups?.name || null,
        tagline: v.tagline,
        bio: v.bio || v.tagline || null,
        logo_url: v.logo_url,
        cover_url: v.cover_url,
        neighborhood: v.neighborhood,
        address: v.address || v.address_city || null,
        address_city: v.address_city,
        price_range: v.price_range,
        price_starting_at: v.price_starting_at,
        avg_rating: v.avg_rating,
        review_count: v.review_count,
        is_featured: v.is_featured,
        is_verified: v.is_verified,
        instant_booking: v.instant_booking,
        is_premium: v.is_premium,
        photo_count: 0,
        starting_price_cents: null,
        completion_score: 0,
        badge_keys: [],
      }
    })

    return NextResponse.json({
      vendors: cards,
      total: count ?? 0,
      page,
      limit,
    })
  } catch (error) {
    console.error('Error fetching directory:', error)
    return NextResponse.json({ error: 'Failed to fetch directory' }, { status: 500 })
  }
}
