/**
 * GET /api/directory?categoryKey=venues&page=1&limit=24
 *
 * RETROFITTED for new schema (Part XLVI): queries vendor_accounts + inventory_items
 * + media_assets + locations instead of old vendor_profiles / vendor_card_cache.
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryKey = searchParams.get('categoryKey')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)))
    const offset = (page - 1) * limit

    const supabase = createAdminClient()

    // Query vendor_accounts — only ACTIVE/CLAIMED/ONBOARDED vendors
    let query = supabase
      .from('vendor_accounts')
      .select(`
        id, name, slug, description, address, latitude, longitude,
        phone, email, website_url, status,
        locations!inner(name, region),
        inventory_items!inner(id, title, category, base_price_cents, status, quality_score, metadata),
        media_assets!inventory_items(url, alt_text, is_primary, media_type)
      `, { count: 'exact' })
      .in('status', ['ACTIVE', 'CLAIMED', 'ONBOARDED'])

    // Category filter: map old category keys to new inventory_category enum values
    if (categoryKey) {
      const catMap: Record<string, string[]> = {
        venues: ['VENUE_RENTAL'],
        catering: ['DINING'],
        restaurants: ['DINING'],
        bars_nightlife: ['DINING'],
        djs_entertainment: ['SERVICE', 'EVENT_TICKET'],
        photography: ['SERVICE'],
        floral_decor: ['SERVICE'],
        beauty: ['SERVICE'],
        attire: ['SERVICE'],
        transportation: ['TRANSPORT'],
        equipment_rentals: ['SERVICE'],
        hotels: ['LODGING'],
        travel: ['LODGING', 'TRANSPORT'],
        event_planning: ['SERVICE'],
        experiences: ['ACTIVITY'],
      }
      const cats = catMap[categoryKey] ?? ['SERVICE']
      query = query.in('inventory_items.category', cats)
    }

    query = query.range(offset, offset + limit - 1).order('name', { ascending: true })

    const { data: vendors, count, error } = await query

    if (error) {
      console.error('[directory] DB error:', error)
      // Fallback: return vendor_accounts without joins
      const { data: fallback, error: fbErr } = await supabase
        .from('vendor_accounts')
        .select('id, name, slug, description, status, email, phone, website_url')
        .in('status', ['ACTIVE', 'CLAIMED', 'ONBOARDED'])
        .range(offset, offset + limit - 1)
      if (fbErr) return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
      return NextResponse.json({
        vendors: (fallback ?? []).map((v: Record<string, unknown>) => ({
          vendor_id: v.id,
          business_name: v.name,
          slug: v.slug,
          description: v.description,
          primary_photo_url: null,
          avg_rating: 0,
          review_count: 0,
          price_range: null,
          neighborhood: null,
          is_published: v.status === 'ACTIVE',
        })),
        total: fallback?.length ?? 0,
        page,
        limit,
      })
    }

    // Transform to the shape the frontend expects
    const vendors_out = (vendors ?? []).map((v: Record<string, unknown>) => {
      const items = (v.inventory_items as Array<Record<string, unknown>>) ?? []
      const media = (v.media_assets as Array<Record<string, unknown>>) ?? []
      const loc = Array.isArray(v.locations) ? v.locations[0] : v.locations
      const primaryPhoto = media.find((m) => m.is_primary)?.url ?? media[0]?.url ?? null
      const avgPrice = items.length > 0
        ? items.reduce((s: number, i: { base_price_cents: number }) => s + (i.base_price_cents ?? 0), 0) / items.length
        : 0

      return {
        vendor_id: v.id,
        business_name: v.name,
        slug: v.slug,
        description: v.description,
        primary_photo_url: primaryPhoto,
        logo_url: null,
        avg_rating: Number(v.quality_score ?? 0),
        review_count: 0,
        price_range: avgPrice > 30000 ? '$$$$' : avgPrice > 15000 ? '$$$' : avgPrice > 5000 ? '$$' : '$',
        price_starting_at: items.length > 0 ? Math.min(...items.map((i: { base_price_cents: number }) => i.base_price_cents ?? 0)) : 0,
        neighborhood: loc?.name ?? null,
        city: loc?.name ?? null,
        state: loc?.region ?? null,
        badge_featured: false,
        badge_verified: v.status === 'ACTIVE',
        badge_instant_booking: false,
        is_published: v.status === 'ACTIVE',
        categories: [...new Set(items.map((i: { category: string }) => i.category))],
      }
    })

    return NextResponse.json({
      vendors: vendors_out,
      total: count ?? vendors_out.length,
      page,
      limit,
    })
  } catch (err) {
    console.error('[directory] error:', err)
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
  }
}
