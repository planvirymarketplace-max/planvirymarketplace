'use client'

import { useState, useCallback } from 'react'

export interface FilterInput {
  filter_key: string
  value_text: string | null
  value_bool: boolean | null
  value_min: number | null
  value_max: number | null
}

export interface VendorSearchResult {
  vendor_id: string
  business_name: string
  slug: string
  cover_url: string | null
  avg_rating: number | null
  review_count: number | null
  price_range: string | null
  price_starting_at: number | null
  neighborhood: string | null
  is_featured: boolean
  is_verified: boolean
  instant_booking: boolean
  distance_miles: number | null
  match_count: number
  bio: string | null
  address: string | null
  category: string | null
}

interface SearchVendorsParams {
  categoryKey: string
  filters?: FilterInput[]
  lat?: number
  lng?: number
  radiusMiles?: number
  availabilityDate?: string
  limit?: number
  offset?: number
}

interface UseSearchVendorsResult {
  vendors: VendorSearchResult[]
  isLoading: boolean
  error: string | null
  totalCount: number
  refetch: () => void
  search: (params: SearchVendorsParams) => Promise<void>
}

/**
 * Searches vendors via POST /api/search which calls the search_vendors() RPC.
 * Uses the API route (admin client) instead of direct Supabase (broken anon key).
 */
export function useSearchVendors(): UseSearchVendorsResult {
  const [vendors, setVendors] = useState<VendorSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [lastSearchParams, setLastSearchParams] = useState<SearchVendorsParams | null>(null)

  const search = useCallback(async (params: SearchVendorsParams) => {
    setIsLoading(true)
    setError(null)
    setLastSearchParams(params)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_key: params.categoryKey,
          filters: params.filters ?? [],
          user_lat: params.lat ?? null,
          user_lng: params.lng ?? null,
          radius_miles: params.radiusMiles ?? null,
          availability_date: params.availabilityDate ?? null,
          limit: params.limit ?? 20,
          offset: params.offset ?? 0,
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      setVendors(data.vendors ?? [])
      setTotalCount(data.total ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search vendors')
      setVendors([])
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    if (lastSearchParams) {
      await search(lastSearchParams)
    }
  }, [lastSearchParams, search])

  return { vendors, isLoading, error, totalCount, refetch, search }
}
