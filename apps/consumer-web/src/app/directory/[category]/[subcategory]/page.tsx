import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { DirectoryClient } from '../../client'
import type { VendorSearchResult } from '@/hooks/use-search-vendors'
import { NAV_CATEGORIES } from '@/lib/directory-filter-data'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = []
  for (const cat of NAV_CATEGORIES) {
    for (const sub of cat.subcategories) {
      params.push({ category: cat.key, subcategory: sub.filterSchemaKey })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>
}): Promise<Metadata> {
  const { category, subcategory } = await params
  const cat = NAV_CATEGORIES.find((c) => c.key === category)
  const sub = cat?.subcategories.find((s) => s.filterSchemaKey === subcategory)
  if (!cat || !sub) return {}
  const title = `${sub.label} in Milwaukee | Planviry`
  const description = `Find the best ${sub.label.toLowerCase()} in Milwaukee. Browse profiles, filter by price and neighborhood, and book directly on Planviry.`
  return {
    title,
    description,
    alternates: { canonical: `https://planviry.com/directory/${category}/${subcategory}` },
    openGraph: { title, description, url: `https://planviry.com/directory/${category}/${subcategory}`, siteName: 'Planviry', type: 'website' },
  }
}

async function prefetchSubcategoryVendors(subcategoryKey: string): Promise<VendorSearchResult[]> {
  // Return empty array when Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return []
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: cats } = await supabase
    .from('vendor_categories')
    .select('id')
    .eq('filter_schema_key', subcategoryKey)

  const categoryIds = (cats ?? []).map((c: { id: string }) => c.id)

  let query = supabase
    .from('vendor_profiles')
    .select(
      'id, business_name, slug, neighborhood, logo_url, cover_url, avg_rating, review_count, price_range, price_starting_at, is_featured, is_verified, instant_booking'
    )
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('avg_rating', { ascending: false, nullsFirst: false })
    .limit(500)

  if (categoryIds.length > 0) {
    query = query.in('category_id', categoryIds)
  }

  const { data } = await query

  return (data ?? []).map((v) => ({
    vendor_id: v.id as string,
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

export default async function SubcategoryDirectoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>
}) {
  const { category, subcategory } = await params
  const cat = NAV_CATEGORIES.find((c) => c.key === category)
  const sub = cat?.subcategories.find((s) => s.filterSchemaKey === subcategory)
  if (!cat || !sub) return notFound()

  const vendors = await prefetchSubcategoryVendors(subcategory)
  return <AppLayoutShell>
    <DirectoryClient
      initialVendors={vendors}
      initialCategoryKey={cat.key}
      initialSubKey={sub.filterSchemaKey}
      initialSubLabel={sub.label}
    />
  </AppLayoutShell>

}
