/**
 * Planviry - Static Data Fetching Layer
 *
 * Fetches categories, subcategories, and vendors from Supabase at build time.
 * Falls back to local static data when Supabase is unavailable.
 *
 * All functions are async and designed for use inside `generateStaticParams`,
 * `generateMetadata`, and page Server Components.
 */

import { createAdminClient, type Vendor } from '@/lib/supabase'
import { VERTICALS, type Vertical } from '@/lib/planviry-data'
import { categories, type CategoryLevel1, type CategoryLevel2, type CategoryLevel3 } from '@/data/categories'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CategoryData {
  name: string
  slug: string
  description: string
  subCategories: string[]
}

export interface VendorSummary {
  id: string
  slug: string
  businessName: string
  category: string
  subCategory: string
  description: string
  city: string
  state: string
  rating: number
  reviewCount: number
  priceRange: string | null
  imageUrl: string | null
  isVerified: boolean
  verticalSlug: string
}

// ─── Categories ─────────────────────────────────────────────────────────────

/**
 * Get all top-level categories (verticals).
 * Tries Supabase first, falls back to local VERTICALS data.
 */
export async function getCategories(): Promise<CategoryData[]> {
  try {
    const client = createAdminClient()
    const { data, error } = await client
      .from('categories')
      .select('name, slug, description, sub_categories')
      .order('name')

    if (error) throw error
    if (data && data.length > 0) {
      return data.map((c: Record<string, unknown>) => ({
        name: c.name as string,
        slug: c.slug as string,
        description: (c.description as string) || '',
        subCategories: Array.isArray(c.sub_categories)
          ? (c.sub_categories as string[])
          : [],
      }))
    }
  } catch (err) {
    console.warn('[static-data] Supabase categories unavailable, using local data:', err instanceof Error ? err.message : err)
  }

  // Fallback to local VERTICALS
  return VERTICALS.map((v: Vertical) => ({
    name: v.name,
    slug: v.slug,
    description: v.description,
    subCategories: v.subCategories,
  }))
}

/**
 * Get a single category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  const all = await getCategories()
  return all.find(c => c.slug === slug) ?? null
}

// ─── Full Category Hierarchy ────────────────────────────────────────────────

/**
 * Get the full category taxonomy from local data.
 * This always returns local data because the hierarchy is defined in code.
 */
export function getCategoryHierarchy(): CategoryLevel1[] {
  return categories
}

/**
 * Find a category level by a path of slugs.
 * E.g. ['venues-spaces', 'wedding-venues'] returns the L2 object.
 */
export function resolveCategoryPath(slugs: string[]): {
  l1: CategoryLevel1 | null
  l2: CategoryLevel2 | null
  l3: CategoryLevel3 | null
} {
  if (slugs.length === 0) return { l1: null, l2: null, l3: null }

  const l1 = categories.find(c => c.slug === slugs[0]) ?? null
  if (!l1 || slugs.length === 1) return { l1, l2: null, l3: null }

  const l2 = l1.level2.find(c => c.slug === slugs[1]) ?? null
  if (!l2 || slugs.length === 2) return { l1, l2, l3: null }

  const l3 = l2.level3.find(c => c.slug === slugs[2]) ?? null
  return { l1, l2, l3 }
}

// ─── Vendors ────────────────────────────────────────────────────────────────

function vendorToSummary(v: Vendor): VendorSummary {
  return {
    id: v.id,
    slug: v.slug,
    businessName: v.business_name,
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
    verticalSlug: v.vertical_slug,
  }
}

/**
 * Get vendors for a given category/vertical slug.
 * Tries Supabase first, falls back to empty array.
 */
export async function getVendorsByCategory(slug: string, limit = 50): Promise<VendorSummary[]> {
  try {
    const client = createAdminClient()
    const { data, error } = await client
      .from('vendors')
      .select('*')
      .eq('vertical_slug', slug)
      .order('rating', { ascending: false })
      .order('review_count', { ascending: false })
      .limit(limit)

    if (error) throw error
    if (data && data.length > 0) {
      return (data as Vendor[]).map(vendorToSummary)
    }
  } catch (err) {
    console.warn('[static-data] Supabase vendors unavailable for category:', slug, err instanceof Error ? err.message : err)
  }

  return []
}

/**
 * Get a single vendor by slug.
 * Tries Supabase first, falls back to null.
 */
export async function getVendorBySlug(slug: string): Promise<VendorSummary | null> {
  try {
    const client = createAdminClient()
    const { data, error } = await client
      .from('vendors')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    if (data) {
      return vendorToSummary(data as Vendor)
    }
  } catch (err) {
    console.warn('[static-data] Supabase vendor unavailable for slug:', slug, err instanceof Error ? err.message : err)
  }

  return null
}

/**
 * Get all vendor slugs for generateStaticParams.
 * Tries Supabase first, falls back to empty array (dynamicParams = true).
 */
export async function getAllVendorSlugs(): Promise<string[]> {
  try {
    const client = createAdminClient()
    const { data, error } = await client
      .from('vendors')
      .select('slug')
      .not('slug', 'is', null)

    if (error) throw error
    if (data && data.length > 0) {
      return data.map((r: { slug: string }) => r.slug).filter(Boolean)
    }
  } catch (err) {
    console.warn('[static-data] Supabase vendor slugs unavailable:', err instanceof Error ? err.message : err)
  }

  return []
}

// ─── Generate Static Params Helpers ─────────────────────────────────────────

/**
 * Returns param objects for vertical/category pages.
 */
export async function getVerticalStaticParams(): Promise<{ slug: string }[]> {
  return VERTICALS.map(v => ({ slug: v.slug }))
}

/**
 * Returns param objects for category hierarchy pages.
 * Generates all possible L1, L1/L2, and L1/L2/L3 combinations.
 */
export function getCategoryStaticParams(): { slugs: string[] }[] {
  const params: { slugs: string[] }[] = []

  for (const l1 of categories) {
    // L1 only
    params.push({ slugs: [l1.slug] })

    for (const l2 of l1.level2) {
      // L1/L2
      params.push({ slugs: [l1.slug, l2.slug] })

      for (const l3 of l2.level3) {
        // L1/L2/L3
        params.push({ slugs: [l1.slug, l2.slug, l3.slug] })
      }
    }
  }

  return params
}
