/**
 * POST /api/admin/serp-seed
 *
 * Pulls business listings from SerpAPI (Yelp engine) or event data
 * (Google Events engine) and upserts them into vendor_profiles.
 *
 * Requires: SERPAPI_API_KEY env var and ADMIN_SEED_SECRET env var.
 *
 * Body:
 * {
 *   engine:       'yelp' | 'google_events' | 'google_maps',
 *   query:        string,           // e.g. "wedding venues"
 *   location:     string,           // e.g. "Milwaukee, WI"
 *   category_id?: string,           // UUID from vendor_categories
 *   category_key?: string,          // filter_schema_key e.g. "venues_wedding"
 *   max_results?: number,           // default 20, free tier cap ~10/call
 * }
 *
 * Returns: { inserted: number, skipped: number, vendors: { slug, business_name }[] }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../lib/supabase/admin'

const SERPAPI_BASE = 'https://serpapi.com/search.json'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function mapYelpResult(item: Record<string, unknown>, categoryId?: string) {
  const name = (item.title as string) || ''
  const address = (item.address as string) || ''
  const phone = (item.phone as string) || ''
  const rating = typeof item.rating === 'number' ? item.rating : null
  const reviewCount = typeof item.reviews === 'number' ? item.reviews : null
  const slug = slugify(name) + '-milwaukee'

  // Parse city/state from address string "123 Main St, Milwaukee, WI 53202"
  const addressParts = address.split(',').map((s: string) => s.trim())
  const street = addressParts[0] || null
  const city = addressParts[1] || 'Milwaukee'
  const stateZip = (addressParts[2] || '').split(' ')
  const state = stateZip[0] || 'WI'
  const zip = stateZip[1] || null

  return {
    slug,
    business_name: name,
    address_street: street,
    address_city: city,
    address_state: state,
    address_zip: zip,
    phone: phone || null,
    avg_rating: rating,
    review_count: reviewCount,
    category_id: categoryId || null,
    is_published: false,
    listing_status: 'draft',
    source: 'serp_yelp',
  }
}

function mapGoogleEventsResult(item: Record<string, unknown>, categoryId?: string) {
  const title = (item.title as string) || ''
  const venue = (item.venue as Record<string, unknown>) || {}
  const venueName = (venue.name as string) || ''
  const address = (venue.rating as string) || ''
  const date = (item.date as Record<string, unknown>) || {}
  const when = (date.when as string) || ''
  const slug = slugify(venueName || title) + '-milwaukee'

  return {
    slug: slug || `event-${Date.now()}`,
    business_name: venueName || title,
    tagline: title,
    bio: when ? `Upcoming: ${when}` : null,
    address_city: 'Milwaukee',
    address_state: 'WI',
    category_id: categoryId || null,
    is_published: false,
    listing_status: 'draft',
    source: 'serp_google_events',
  }
}

function mapGoogleMapsResult(item: Record<string, unknown>, categoryId?: string) {
  const name = (item.title as string) || ''
  const address = (item.address as string) || ''
  const phone = (item.phone as string) || ''
  const website = (item.website as string) || ''
  const rating = typeof item.rating === 'number' ? item.rating : null
  const reviewCount = typeof item.reviews === 'number' ? item.reviews : null
  const slug = slugify(name) + '-milwaukee'

  const addressParts = address.split(',').map((s: string) => s.trim())
  const street = addressParts[0] || null
  const city = addressParts[1] || 'Milwaukee'

  return {
    slug,
    business_name: name,
    address_street: street,
    address_city: city,
    address_state: 'WI',
    phone: phone || null,
    website: website || null,
    avg_rating: rating,
    review_count: reviewCount,
    category_id: categoryId || null,
    is_published: false,
    listing_status: 'draft',
    source: 'serp_google_maps',
  }
}

export async function POST(req: NextRequest) {
  // Protect with a shared secret so only admin can call this
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SEED_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const apiKey = process.env.SERPAPI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'SERPAPI_API_KEY not configured. Add it to .env.' },
      { status: 500 }
    )
  }

  const body = await req.json().catch(() => ({}))
  const { engine = 'yelp', query, location = 'Milwaukee, WI', category_id, max_results = 20 } = body

  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Build SerpAPI URL
  const params = new URLSearchParams({
    api_key: apiKey,
    engine,
    num: String(Math.min(max_results, 20)), // Free tier: ~10 results/call
  })

  if (engine === 'yelp') {
    params.set('find_desc', query)
    params.set('find_loc', location)
  } else if (engine === 'google_events') {
    params.set('q', `${query} ${location}`)
    params.set('hl', 'en')
    params.set('gl', 'us')
  } else if (engine === 'google_maps') {
    params.set('q', `${query} ${location}`)
    params.set('hl', 'en')
    params.set('gl', 'us')
    params.set('type', 'search')
  } else {
    return NextResponse.json({ error: `Unsupported engine: ${engine}` }, { status: 400 })
  }

  const serpUrl = `${SERPAPI_BASE}?${params.toString()}`

  let serpData: Record<string, unknown>
  try {
    const serpRes = await fetch(serpUrl)
    if (!serpRes.ok) {
      const errText = await serpRes.text()
      return NextResponse.json(
        { error: `SerpAPI error ${serpRes.status}: ${errText.substring(0, 200)}` },
        { status: 502 }
      )
    }
    serpData = await serpRes.json() as Record<string, unknown>
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to call SerpAPI: ${(e as Error).message}` },
      { status: 502 }
    )
  }

  // Extract results array based on engine
  let rawResults: Record<string, unknown>[] = []
  if (engine === 'yelp') {
    rawResults = (serpData.organic_results as Record<string, unknown>[]) || []
  } else if (engine === 'google_events') {
    rawResults = (serpData.events_results as Record<string, unknown>[]) || []
  } else if (engine === 'google_maps') {
    rawResults = (serpData.local_results as Record<string, unknown>[]) || []
  }

  if (rawResults.length === 0) {
    return NextResponse.json({
      inserted: 0,
      skipped: 0,
      vendors: [],
      message: 'No results from SerpAPI. Check your query or API key.',
      serpapi_response_keys: Object.keys(serpData),
    })
  }

  // Map to vendor_profiles schema
  const mapped = rawResults.slice(0, max_results).map((item) => {
    if (engine === 'yelp') return mapYelpResult(item, category_id)
    if (engine === 'google_events') return mapGoogleEventsResult(item, category_id)
    return mapGoogleMapsResult(item, category_id)
  }).filter((v) => v.business_name && v.slug)

  // Upsert - skip if slug already exists
  let inserted = 0
  let skipped = 0
  const insertedVendors: { slug: string; business_name: string }[] = []

  for (const vendor of mapped) {
    const { error } = await supabase
      .from('vendor_profiles')
      .insert(vendor)
      .select('id')
      .single()

    if (error) {
      if (error.code === '23505') {
        // Duplicate slug - skip
        skipped++
      } else {
        // Log but continue
        console.warn(`Failed to insert ${vendor.slug}:`, error.message)
        skipped++
      }
    } else {
      inserted++
      insertedVendors.push({ slug: vendor.slug, business_name: vendor.business_name })
    }
  }

  return NextResponse.json({ inserted, skipped, vendors: insertedVendors })
}
