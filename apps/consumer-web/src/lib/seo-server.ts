/**
 * Planviry - Server-side data fetching for SEO pages
 *
 * This module provides server-side data access for Next.js server components.
 * It queries Supabase (PostgreSQL) to get vendor data for server-rendered SEO pages.
 * Uses the new enterprise category taxonomy (vendor_categories, vendor_category_assignments).
 */

import { createAdminClient } from '@/lib/supabase/admin'

// ─── Category slug mapping (old flat categories → new taxonomy slugs) ────────

export const CATEGORY_SLUG_MAP: Record<string, string> = {
  'wedding_venue': 'wedding-venues',
  'wedding_dj': 'wedding-djs',
  'photography': 'photographers',
  'videography': 'videographers',
  'catering': 'caterers',
  'florist': 'florists',
  'decor_rentals': 'decor-rentals',
  'photo_booth': 'photo-booths',
  'transportation': 'transportation',
  'wedding_planner': 'event-planners',
  'bar_club': 'bars-clubs',
  'bakery': 'bakeries',
  'lighting_av': 'lighting-av',
  'rentals': 'party-rentals',
  'makeup_hair': 'hair-makeup',
  'hair_makeup': 'hair-makeup',
  'officiant': 'officiants',
  'bachelorette_activity': 'party-venues',
  'wedding_band': 'live-bands',
  'jeweler': 'jewelers',
  'dress_attire': 'dress-attire',
  'hotel_accommodations': 'hotels',
  'fine_dining': 'fine-dining',
  'restaurant_food': 'restaurants',
  'stationery': 'stationery',
  'invitations_print': 'stationery',
  'wellness': 'wellness-spa',
  'wine_spirits': 'wine-spirits',
  'favors_gifts': 'party-favors',
  'honeymoon_travel': 'travel-agencies',
  'wedding_cake': 'custom-cakes',
}

export function getCategoryPageSlug(vendorCategory: string): string {
  return CATEGORY_SLUG_MAP[vendorCategory] || vendorCategory.replace(/_/g, '-')
}

// ─── SEOVendor Interface ────────────────────────────────────────────────────

export interface SEOVendor {
  id: string
  slug: string
  name: string
  category: string
  categoryName: string
  categorySlug: string
  address: string | null
  phone: string | null
  website: string | null
  email: string | null
  bio: string | null
  priceRange: string | null
  serviceAreas: string[]
  tags: string[]
  isFeatured: boolean
  isVerified: boolean
  isClaimed: boolean
  logoUrl: string | null
  coverUrl: string | null
  rating?: number
  reviewCount?: number
}

// ─── Helper: transform Supabase Vendor row to SEOVendor ─────────────────────

function toSEOVendor(v: any, catInfo?: { name: string; slug: string }): SEOVendor {
  let serviceAreas: string[] = []
  try {
    serviceAreas = v.serviceAreas ? JSON.parse(v.serviceAreas) : []
  } catch { serviceAreas = [] }

  let tags: string[] = []
  try {
    tags = v.tags ? JSON.parse(v.tags) : []
  } catch { tags = [] }

  return {
    id: v.id,
    slug: v.slug || v.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
    name: v.name || 'Unknown',
    category: v.category || '',
    categoryName: catInfo?.name || v.category?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || '',
    categorySlug: catInfo?.slug || CATEGORY_SLUG_MAP[v.category] || v.category?.replace(/_/g, '-') || '',
    address: v.address || null,
    phone: v.phone || null,
    website: v.website || null,
    email: v.email || null,
    bio: v.description || v.bio || null,
    priceRange: v.priceRange || null,
    serviceAreas,
    tags,
    isFeatured: v.isFeatured || false,
    isVerified: v.isVerified !== false,
    isClaimed: v.isClaimed || false,
    logoUrl: v.logoUrl || null,
    coverUrl: v.coverUrl || null,
    rating: v.rating ?? undefined,
    reviewCount: v.reviewCount ?? undefined,
  }
}

// ─── Fetch Vendors by Category (using new taxonomy) ─────────────────────────

export async function fetchVendorsByCategory(
  categorySlug: string,
): Promise<SEOVendor[]> {
  try {
    const supabase = createAdminClient()

    // Look up category by slug
    const { data: category } = await supabase
      .from('vendor_categories')
      .select('id, name, slug')
      .eq('slug', categorySlug)
      .single()

    if (!category) return []

    // Get vendor IDs via category assignments
    const { data: assignments } = await supabase
      .from('vendor_category_assignments')
      .select('vendor_id')
      .eq('category_id', category.id)

    if (!assignments || assignments.length === 0) return []

    const vendorIds = assignments.map((a: any) => a.vendor_id)

    // Fetch vendor details
    const { data: vendors } = await supabase
      .from('Vendor')
      .select('*')
      .in('id', vendorIds)
      .eq('isPublished', true)
      .order('isFeatured', { ascending: false })

    return (vendors || []).map((v: any) => toSEOVendor(v, { name: category.name, slug: category.slug }))
  } catch (error) {
    console.error('Error fetching vendors by category:', error)
    return []
  }
}

// ─── Fetch Vendors by Search Query ──────────────────────────────────────────

export async function fetchVendorsBySearch(
  searchQuery: string,
): Promise<SEOVendor[]> {
  try {
    const supabase = createAdminClient()

    const { data: vendors } = await supabase
      .from('Vendor')
      .select('*')
      .eq('isPublished', true)
      .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`)
      .order('isFeatured', { ascending: false })
      .limit(100)

    return (vendors || []).map((v: any) => toSEOVendor(v))
  } catch (error) {
    console.error('Error fetching vendors by search:', error)
    return []
  }
}

// ─── Fetch Single Vendor by Slug ────────────────────────────────────────────

export async function fetchVendorBySlug(
  slug: string,
): Promise<SEOVendor | null> {
  try {
    const supabase = createAdminClient()

    const { data: vendor } = await supabase
      .from('Vendor')
      .select('*')
      .eq('slug', slug)
      .eq('isPublished', true)
      .single()

    if (!vendor) return null

    // Get primary category info
    const { data: assignment } = await supabase
      .from('vendor_category_assignments')
      .select('vendor_categories!inner(name, slug)')
      .eq('vendor_id', vendor.id)
      .eq('is_primary', true)
      .single()

    const catInfo = assignment?.vendor_categories as any

    return toSEOVendor(vendor, catInfo ? { name: catInfo.name, slug: catInfo.slug } : undefined)
  } catch (error) {
    console.error('Error fetching vendor by slug:', error)
    return null
  }
}

// ─── Fetch All Published Vendor Slugs ───────────────────────────────────────

export async function fetchAllVendorSlugs(): Promise<string[]> {
  try {
    const supabase = createAdminClient()

    const { data: vendors } = await supabase
      .from('Vendor')
      .select('slug')
      .eq('isPublished', true)

    return (vendors || []).map((v: any) => v.slug).filter(Boolean)
  } catch (error) {
    console.error('Error fetching vendor slugs:', error)
    return []
  }
}

// ─── Fetch All Categories (from new taxonomy) ───────────────────────────────

export async function fetchAllCategories(): Promise<
  { id: string; slug: string; name: string; vendorCount: number }[]
> {
  try {
    const supabase = createAdminClient()

    // Get all categories
    const { data: categories } = await supabase
      .from('vendor_categories')
      .select('id, slug, name, is_top_level')
      .eq('is_published', true)

    if (!categories || categories.length === 0) return []

    // Get vendor counts per category
    const { data: assignments } = await supabase
      .from('vendor_category_assignments')
      .select('category_id')
      .eq('is_primary', true)

    const countMap: Record<string, number> = {}
    ;(assignments || []).forEach((a: any) => {
      countMap[a.category_id] = (countMap[a.category_id] || 0) + 1
    })

    return categories.map((c: any) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      vendorCount: countMap[c.id] || 0,
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// ─── Fetch Vendor Reviews ───────────────────────────────────────────────────

export async function fetchVendorReviews(
  vendorId: string,
): Promise<
  {
    id: string
    rating: number
    body: string
    createdAt: string
    reviewerName: string
  }[]
> {
  try {
    const supabase = createAdminClient()

    const { data: reviews } = await supabase
      .from('VendorReview')
      .select('*')
      .eq('vendorId', vendorId)
      .eq('isApproved', true)
      .order('createdAt', { ascending: false })
      .limit(10)

    return (reviews || []).map((r: any) => ({
      id: r.id,
      rating: r.rating,
      body: r.body || '',
      createdAt: r.createdAt,
      reviewerName: r.reviewerName || 'Anonymous',
    }))
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}
