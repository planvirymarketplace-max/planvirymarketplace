import { NextRequest, NextResponse } from 'next/server'
import { searchVendors as algoliaSearch, type AlgoliaVendorHit } from '@/lib/algolia'
import { searchVendors as supabaseSearch, type Vendor } from '@/lib/supabase'
import { trackSearch } from '@/lib/tinybird'

// NOTE: This project uses Supabase as its primary database. The original
// Prisma/SQLite fallback has been removed because @prisma/client is not a
// dependency (it was dead code in the source repo).

// ---------------------------------------------------------------------------
// Normalised vendor shape returned by every code path
// ---------------------------------------------------------------------------

interface NormalisedVendor {
  id: string
  slug: string
  name: string
  category: string
  subCategory?: string
  description?: string
  city?: string
  state?: string
  rating?: number
  reviewCount?: number
  priceRange?: string | null
  imageUrl?: string | null
  isVerified?: boolean
  isFeatured?: boolean
  address?: string | null
}

interface SearchResponse {
  vendors: NormalisedVendor[]
  total: number
  page: number
  totalPages: number
}

// ---------------------------------------------------------------------------
// Helpers – normalise results from each data source
// ---------------------------------------------------------------------------

function normaliseAlgolia(hits: AlgoliaVendorHit[]): NormalisedVendor[] {
  return hits.map((h) => ({
    id: h.objectID,
    slug: h.slug,
    name: h.business_name,
    category: h.category,
    subCategory: h.sub_category,
    description: h.description,
    city: h.city,
    state: h.state,
    rating: h.rating,
    reviewCount: h.review_count,
    priceRange: h.price_range,
    imageUrl: h.image_url,
    isVerified: h.is_verified,
  }))
}

function normaliseSupabase(vendors: Vendor[]): NormalisedVendor[] {
  return vendors.map((v) => ({
    id: v.id,
    slug: v.slug,
    name: v.business_name,
    category: v.category,
    subCategory: v.sub_category,
    description: v.description,
    city: v.city,
    state: v.state,
    rating: v.rating,
    reviewCount: v.review_count,
    priceRange: v.price_range,
    imageUrl: v.image_url,
    isVerified: v.is_verified,
  }))
}

// ---------------------------------------------------------------------------
// GET /api/vendors/search
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // --- Parse query params ---
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || undefined
  const city = searchParams.get('city') || searchParams.get('location') || undefined
  const state = searchParams.get('state') || undefined
  const vertical = searchParams.get('vertical') || undefined
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
  const page = Math.max(0, parseInt(searchParams.get('page') || '0', 10))

  // If query is too short, return empty result set
  if (!q || q.length < 2) {
    const empty: SearchResponse = { vendors: [], total: 0, page, totalPages: 0 }
    return NextResponse.json(empty)
  }

  // --- Fire-and-forget Tinybird search tracking ---
  trackSearch({
    query: q,
    filters: { category, city, state, vertical },
    resultsCount: 0, // will be correct next request; fire-and-forget means we don't wait
  }).catch(() => {
    // Silently swallow - analytics must never break the search
  })

  // --- 1. Try Algolia (fast, typo-tolerant) ---
  try {
    const result = await algoliaSearch(q, { category, city, state, vertical, limit, page })
    const response: SearchResponse = {
      vendors: normaliseAlgolia(result.hits),
      total: result.nbHits,
      page: result.page,
      totalPages: result.nbPages,
    }
    return NextResponse.json(response)
  } catch (err) {
    console.warn('[vendors/search] Algolia failed, falling back to Supabase:', err)
  }

  // --- 2. Fallback: Supabase ---
  try {
    const offset = page * limit
    const vendors = await supabaseSearch(q, { category, city, state, vertical, limit: limit + 1, offset })

    // Supabase doesn't return a total count in a single query, so we estimate
    const hasMore = vendors.length > limit
    const resultVendors = hasMore ? vendors.slice(0, limit) : vendors
    const response: SearchResponse = {
      vendors: normaliseSupabase(resultVendors),
      total: hasMore ? offset + limit + 1 : offset + resultVendors.length,
      page,
      totalPages: hasMore ? page + 2 : page + 1,
    }
    return NextResponse.json(response)
  } catch (err) {
    console.warn('[vendors/search] Supabase failed, no further fallback available:', err)
  }

  // --- 3. No further fallback (Prisma/SQLite removed - Supabase is the DB) ---
  return NextResponse.json({ error: 'Search failed' }, { status: 500 })
}
