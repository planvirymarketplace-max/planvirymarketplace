'use client'

import { useState, useCallback } from 'react'
import type { FilterInput, VendorCard } from '@/types/marketplace'

interface SearchVendorsParams {
  category_key: string
  filters?: FilterInput[]
  user_lat?: number
  user_lng?: number
  radius_miles?: number
  availability_date?: string
  limit?: number
  offset?: number
}

interface UseSearchVendorsResult {
  search: (params: SearchVendorsParams) => Promise<void>
  results: VendorCard[]
  isLoading: boolean
  error: string | null
  total: number
  refetch: () => Promise<void>
}

/**
 * Provides a search function and state for vendor search.
 *
 * `search(params)` calls POST /api/search with the given params and
 * updates results, isLoading, error, and total accordingly.
 */
export function useSearchVendors(): UseSearchVendorsResult {
  const [results, setResults] = useState<VendorCard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [lastParams, setLastParams] = useState<SearchVendorsParams | null>(null)

  const search = useCallback(async (params: SearchVendorsParams) => {
    setIsLoading(true)
    setError(null)
    setLastParams(params)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_key: params.category_key,
          filters: params.filters ?? [],
          user_lat: params.user_lat ?? null,
          user_lng: params.user_lng ?? null,
          radius_miles: params.radius_miles ?? 25,
          availability_date: params.availability_date ?? null,
          limit: params.limit ?? 12,
          offset: params.offset ?? 0,
        }),
      })

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}))
        setError(
          (errorBody as Record<string, string>).error ??
          `Search failed: ${res.status} ${res.statusText}`
        )
        setResults([])
        setTotal(0)
        return
      }

      const data = await res.json()

      // API returns { vendors: [...], total, limit, offset }
      const vendors = Array.isArray(data.vendors) ? data.vendors : []
      setResults(vendors as VendorCard[])
      setTotal(data.total ?? vendors.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search vendors')
      setResults([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    if (lastParams) {
      await search(lastParams)
    }
  }, [lastParams, search])

  return { search, results, isLoading, error, total, refetch }
}

// Re-export types for convenience
export type { FilterInput, VendorCard, SearchVendorsParams }
