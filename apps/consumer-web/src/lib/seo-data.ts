/**
 * Server-side helpers for SEO page data.
 * Used by generateStaticParams, generateMetadata, and page Server Components.
 * NEVER import this in client components ('use client').
 *
 * Uses an untyped Supabase client because seo_pages / vendor_profiles are
 * not yet reflected in the generated Database types file.
 */
import { createClient } from '@supabase/supabase-js'

function rawAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SeoPageRow {
  id: string
  slug: string
  h1: string
  meta_title: string
  meta_description: string
  category_key: string | null
  category_id: string | null
  category_name: string | null
  neighborhood: string | null
  city: string
  state: string
  event_type: string | null
  page_type: string
  related_slugs: string[]
  footer_categories: string[]
  vendor_tags: string[]
  is_published: boolean
  is_indexed: boolean
  sitemap_priority: number
  vendor_count: number
}

export interface SeoVendorCard {
  vendor_id: string
  business_name: string
  slug: string
  category_name: string | null
  neighborhood: string | null
  logo_url: string | null
  cover_url: string | null
  avg_rating: number | null
  review_count: number | null
  price_range: string | null
  price_starting_at: number | null
  is_featured: boolean
  is_verified: boolean
  instant_booking: boolean
  tagline: string | null
  address_city: string | null
}

// ─── Page fetchers ────────────────────────────────────────────────────────────

export async function getSeoPage(slug: string): Promise<SeoPageRow | null> {
  const supabase = rawAdmin()
  const { data } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data as SeoPageRow | null
}

export async function getVendorsForSeoPage(
  page: SeoPageRow,
  { limit = 24, page: pageNum = 1 }: { limit?: number; page?: number } = {}
): Promise<{ vendors: SeoVendorCard[]; total: number }> {
  const supabase = rawAdmin()
  const offset = (pageNum - 1) * limit

  // Fast path: vendor_card_cache
  const { count: cacheCount } = await supabase
    .from('vendor_card_cache')
    .select('*', { count: 'exact', head: true })
    .limit(1)

  if ((cacheCount ?? 0) > 0 && page.category_key) {
    // Resolve filter_schema_key → category_slug
    const { data: cat } = await supabase
      .from('vendor_categories')
      .select('slug')
      .eq('filter_schema_key', page.category_key)
      .single()

    if (cat?.slug) {
      let q = supabase
        .from('vendor_card_cache')
        .select('*', { count: 'exact' })
        .eq('category_slug', cat.slug)
        .order('is_featured', { ascending: false })
        .order('avg_rating', { ascending: false, nullsFirst: false })
        .range(offset, offset + limit - 1)

      if (page.neighborhood) q = q.eq('neighborhood', page.neighborhood)

      const { data, count } = await q
      return { vendors: (data ?? []) as SeoVendorCard[], total: count ?? 0 }
    }
  }

  // Fallback: vendor_profiles direct query
  if (!page.category_id) return { vendors: [], total: 0 }

  let q = supabase
    .from('vendor_profiles')
    .select(
      'id, business_name, slug, neighborhood, address_city, logo_url, cover_url, avg_rating, review_count, price_range, price_starting_at, is_featured, is_verified, instant_booking, tagline',
      { count: 'exact' }
    )
    .eq('category_id', page.category_id)
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('avg_rating', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (page.neighborhood) q = q.eq('neighborhood', page.neighborhood)

  const { data, count } = await q
  return {
    vendors: (data ?? []).map((v) => ({
      vendor_id: v.id,
      business_name: v.business_name,
      slug: v.slug,
      category_name: page.category_name,
      neighborhood: v.neighborhood,
      address_city: v.address_city,
      logo_url: v.logo_url,
      cover_url: v.cover_url,
      avg_rating: v.avg_rating,
      review_count: v.review_count,
      price_range: v.price_range,
      price_starting_at: v.price_starting_at,
      is_featured: v.is_featured,
      is_verified: v.is_verified,
      instant_booking: v.instant_booking,
      tagline: v.tagline,
    })),
    total: count ?? 0,
  }
}

export async function getRelatedPages(
  slugs: string[]
): Promise<Pick<SeoPageRow, 'slug' | 'h1' | 'category_name'>[]> {
  if (!slugs.length) return []
  const supabase = rawAdmin()
  const { data } = await supabase
    .from('seo_pages')
    .select('slug, h1, category_name')
    .in('slug', slugs)
    .eq('is_published', true)
  return (data ?? []) as Pick<SeoPageRow, 'slug' | 'h1' | 'category_name'>[]
}

export async function getVendorProfile(slug: string) {
  const supabase = rawAdmin()
  const { data } = await supabase
    .from('vendor_profiles')
    .select(
      `id, business_name, dba, slug, tagline, bio, phone, email, website,
       address_street, address_suite, address_city, address_state, address_zip, neighborhood,
       lat, lng,
       logo_url, cover_url, price_range, price_starting_at,
       is_published, is_featured, is_verified, is_verified_partner, is_claimed, instant_booking, accepts_inquiries,
       avg_rating, review_count,
       business_hours, booking_contact, keywords, tags, vendor_since, years_in_business,
       category_id, vendor_categories(name, slug, filter_schema_key)`
    )
    .eq('slug', slug)
    .single()
  return data
}

/** Called by generateStaticParams - returns all published SEO slugs */
export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = rawAdmin()
  const { data } = await supabase
    .from('seo_pages')
    .select('slug')
    .eq('is_published', true)
    .order('sitemap_priority', { ascending: false })
  return (data ?? []).map((r) => r.slug)
}

/** Get a search term/page by slug - wrapper around getSeoPage */
export async function getSearchTermBySlug(slug: string) {
  return getSeoPage(slug)
}

/** Get related searches for a given search term */
export async function getRelatedSearches(slug: string): Promise<Pick<SeoPageRow, 'slug' | 'h1' | 'category_name'>[]> {
  const page = await getSeoPage(slug)
  if (!page?.related_slugs?.length) return []
  return getRelatedPages(page.related_slugs)
}

// ─── Static search data stubs (migrated to database) ──────────────────────
export const SEARCH_TERMS: any[] = []
export const EVENT_TYPES: any[] = []
export const SERVICE_TYPES: any[] = []
export const VENUE_TYPES: any[] = []
export const NEARBY_CITIES: any[] = []
export const MILWAUKEE_NEIGHBORHOODS: string[] = []

export interface SearchTerm {
  slug: string
  h1: string
  category_name: string | null
  city: string
  state: string
  page_type: string
}

export const POPULAR_SEARCHES: SearchTerm[] = []

export async function searchAutocomplete(_query: string): Promise<SearchTerm[]> {
  return []
}

/** Called by sitemap.xml */
export async function getAllSitemapEntries() {
  const supabase = rawAdmin()
  const { data } = await supabase
    .from('seo_pages')
    .select('slug, sitemap_priority, sitemap_changefreq, updated_at')
    .eq('is_published', true)
    .order('sitemap_priority', { ascending: false })
  return data ?? []
}
