'use client'

import { useQuery } from '@tanstack/react-query'

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

export interface CategoryItem {
  id: string
  slug: string
  name: string
  pluralName?: string
  description?: string
  icon?: string
  isTopLevel: boolean
  filterSchemaKey?: string
  vendorCount: number
  subcategories: CategoryItem[]
}

export interface CategoryGroup {
  id: string
  slug: string
  name: string
  icon: string
  sortOrder: number
  categories: CategoryItem[]
}

export interface FilterDefinition {
  id: string
  filterKey: string
  label: string
  uiType: string
  sortOrder: number
  isUniversal: boolean
  optionsJson: any
  rangeMin?: number | null
  rangeMax?: number | null
  rangeStep?: number | null
  rangeUnit?: string | null
  placeholder?: string | null
  helpText?: string | null
  isSensitive: boolean
  requiresAuth: boolean
}

export interface CategoryFiltersResponse {
  category_key: string
  category_name: string
  filters: FilterDefinition[]
  inheritance_chain: { parentKey: string; excludesKeys: string[] }[]
}

export interface VendorSearchParams {
  category?: string
  search?: string
  page?: number
  limit?: number
  group?: string
  priceRange?: string
  rating?: number
  featured?: boolean
  verified?: boolean
}

export interface SearchVendorsParams {
  categoryKey: string
  filters?: {
    filterKey: string
    valueText?: string
    valueBool?: boolean
    valueMin?: number
    valueMax?: number
  }[]
  userLat?: number
  userLng?: number
  radiusMiles?: number
  availabilityDate?: string
  limit?: number
  offset?: number
}

export interface SearchVendorsResult {
  vendor_id: string
  business_name: string
  slug: string
  cover_url: string | null
  avg_rating: number
  review_count: number
  price_range: string | null
  price_starting_at: number | null
  neighborhood: string | null
  is_featured: boolean
  is_verified: boolean
  instant_booking: boolean
  distance_miles: number | null
  match_count: number
}

// ---------------------------------------------------------------------------
// Helper – build a query string from a record, dropping empty values
// ---------------------------------------------------------------------------

function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    if (typeof value === 'boolean' && !value) continue
    searchParams.set(key, String(value))
  }

  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

// ---------------------------------------------------------------------------
// 1. useCategoryGroups
// ---------------------------------------------------------------------------

interface CategoriesApiResponse {
  groups: CategoryGroup[]
}

export function useCategoryGroups(withCounts?: boolean) {
  return useQuery<CategoryGroup[]>({
    queryKey: ['categories', withCounts],
    queryFn: async () => {
      const qs = withCounts ? '?with_counts=true' : ''
      const res = await fetch(`/api/categories${qs}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`)
      }
      const data: CategoriesApiResponse = await res.json()
      return data.groups
    },
  })
}

// ---------------------------------------------------------------------------
// 2. useCategoryFilters
// ---------------------------------------------------------------------------

export function useCategoryFilters(categorySlug: string | null) {
  return useQuery<CategoryFiltersResponse>({
    queryKey: ['filters', categorySlug],
    enabled: !!categorySlug,
    queryFn: async () => {
      const res = await fetch(`/api/filters?category=${encodeURIComponent(categorySlug!)}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch filters: ${res.status} ${res.statusText}`)
      }
      return res.json()
    },
  })
}

// ---------------------------------------------------------------------------
// 3. useVendors
// ---------------------------------------------------------------------------

export function useVendors(params: VendorSearchParams) {
  return useQuery({
    queryKey: ['vendors', params],
    queryFn: async () => {
      const qs = buildQueryString(params as Record<string, unknown>)
      const res = await fetch(`/api/vendors${qs}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch vendors: ${res.status} ${res.statusText}`)
      }
      return res.json()
    },
  })
}

// ---------------------------------------------------------------------------
// 4. useSearchVendors - RPC-powered vendor search via Supabase
//    Uses the search_vendors() PostgreSQL function for efficient
//    EAV-based filter matching with inheritance chain support.
// ---------------------------------------------------------------------------

export function useSearchVendors(params: SearchVendorsParams | null) {
  return useQuery<SearchVendorsResult[]>({
    queryKey: ['searchVendors', params],
    enabled: !!params?.categoryKey,
    queryFn: async () => {
      const res = await fetch('/api/vendors/search-rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) {
        throw new Error(`Failed to search vendors: ${res.status} ${res.statusText}`)
      }
      const data = await res.json()
      return data.vendors || []
    },
  })
}
