import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { DirectoryClient } from '../client'
import type { VendorSearchResult } from '@/hooks/use-search-vendors'
import { NAV_CATEGORIES } from '@/lib/directory-filter-data'

export const revalidate = 86400
export const dynamicParams = true

// Maps NAV_CATEGORIES key → vendor_category_groups.slug in DB
const NAV_KEY_TO_GROUP: Record<string, string> = {
  venues:             'venues',
  'event-planning':   'planning',
  event_planning:     'planning',
  catering:           'catering',
  bars_nightlife:     'bars',
  restaurants:        'restaurants',
  djs_entertainment:  'entertainment',
  photography:        'photography',
  floral_decor:       'floral',
  beauty:             'beauty',
  attire:             'attire',
  transportation:     'transport',
  equipment_rentals:  'rentals',
  hotels:             'lodging',
  travel:             'travel',
}

function getNavCategory(slug: string) {
  return NAV_CATEGORIES.find(
    (c) => c.key === slug || c.key.replace('_', '-') === slug
  ) ?? null
}

// generateStaticParams - reads group slugs from vendor_category_groups DB table.
// Also emits NAV_CATEGORIES keys so both slug forms (e.g. 'bars' and 'bars_nightlife') are pre-built.
export async function generateStaticParams() {
  // Fallback to NAV_CATEGORIES keys when Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NAV_CATEGORIES.map((c) => ({ category: c.key }))
  }
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: groups } = await supabase
      .from('vendor_category_groups')
      .select('slug')
    const dbSlugs = (groups ?? []).map((g) => ({ category: g.slug as string }))
    // Also include NAV_CATEGORIES keys so legacy URL shapes are pre-built
    const navKeys = NAV_CATEGORIES.map((c) => ({ category: c.key }))
    // Deduplicate
    const seen = new Set<string>()
    return [...dbSlugs, ...navKeys].filter(({ category }) => {
      if (seen.has(category)) return false
      seen.add(category)
      return true
    })
  } catch {
    return NAV_CATEGORIES.map((c) => ({ category: c.key }))
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = getNavCategory(category)
  if (!cat) return {}
  const title = `${cat.label} in Milwaukee | Planviry`
  const description = `Browse Milwaukee's best ${cat.label.toLowerCase()} - filter by price, rating, and neighborhood. Find and book local vendors on Planviry.`
  return {
    title,
    description,
    alternates: { canonical: `https://planviry.com/directory/${category}` },
    openGraph: { title, description, url: `https://planviry.com/directory/${category}`, siteName: 'Planviry', type: 'website' },
  }
}

// Reads first page of vendors for this category from vendor_card_cache - the
// pre-computed snapshot. DB is not in the browsing read path after build.
async function prefetchCategoryVendors(categoryKey: string): Promise<VendorSearchResult[]> {
  // Return empty array when Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return []
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Resolve category key → DB group_slug
  const groupSlug = NAV_KEY_TO_GROUP[categoryKey] ?? categoryKey

  let query = supabase
    .from('vendor_card_cache')
    .select(
      'vendor_id, business_name, slug, neighborhood, logo_url, cover_url, avg_rating, review_count, price_range, price_starting_at, is_featured, is_verified, instant_booking'
    )
    .order('is_featured', { ascending: false })
    .order('avg_rating', { ascending: false, nullsFirst: false })
    .limit(24)

  // Filter by group_slug if we have a known mapping; otherwise serve all
  if (groupSlug) {
    query = query.eq('group_slug', groupSlug)
  }

  const { data } = await query

  return (data ?? []).map((v) => ({
    vendor_id: v.vendor_id as string,
    business_name: v.business_name as string,
    slug: v.slug as string,
    cover_url: (v.cover_url ?? v.logo_url ?? null) as string | null,
    avg_rating: (v.avg_rating ?? null) as number | null,
    review_count: (v.review_count ?? null) as number | null,
    price_range: (v.price_range ?? null) as string | null,
    price_starting_at: (v.price_starting_at ?? null) as number | null,
    neighborhood: (v.neighborhood ?? null) as string | null,
    is_featured: (v.is_featured ?? false) as boolean,
    is_verified: (v.is_verified ?? false) as boolean,
    instant_booking: (v.instant_booking ?? false) as boolean,
    distance_miles: null as number | null,
    match_count: 0,
    bio: null as string | null,
    address: null as string | null,
    category: null as string | null,
  }))
}

export default async function CategoryDirectoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const cat = getNavCategory(category)
  if (!cat) return notFound()

  const vendors = await prefetchCategoryVendors(category)
  return <AppLayoutShell>
    <DirectoryClient
      initialVendors={vendors}
      initialCategoryKey={cat.key}
    />
  </AppLayoutShell>

}

