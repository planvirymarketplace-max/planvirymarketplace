'use client'

import { useState, useEffect, useCallback } from 'react'
import type { FilterDefinition } from '@/types/marketplace'

interface UseCategoryFiltersResult {
  filters: FilterDefinition[]
  inheritanceChain: string[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Fetches /api/filters?category_key=X and returns resolved filter definitions
 * with inheritance chain applied. The API handles walking up the inheritance
 * tree, merging filters, and applying exclusions.
 *
 * Filters are ordered: UNIVERSAL first, then by sort_order within each level.
 *
 * Only fetches when categoryKey is not null.
 */
export function useCategoryFilters(
  categoryKey: string | null
): UseCategoryFiltersResult {
  const [filters, setFilters] = useState<FilterDefinition[]>([])
  const [inheritanceChain, setInheritanceChain] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  const refetch = useCallback(() => {
    setFetchKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    // Don't fetch if no category key is provided
    if (!categoryKey) {
      setFilters([])
      setInheritanceChain([])
      setIsLoading(false)
      setError(null)
      return
    }

    let cancelled = false

    async function fetchFilters() {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `/api/filters?category_key=${encodeURIComponent(categoryKey)}`
        )

        if (cancelled) return

        if (!res.ok) {
          setError(
            `Failed to fetch filters: ${res.status} ${res.statusText}`
          )
          setFilters([])
          setInheritanceChain([])
          return
        }

        const data = await res.json()

        if (cancelled) return

        // API returns { category_key, inheritance_chain, filters }
        setInheritanceChain(data.inheritance_chain ?? [])
        setFilters(data.filters ?? [])
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch category filters'
          )
          setFilters([])
          setInheritanceChain([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchFilters()

    return () => {
      cancelled = true
    }
  }, [categoryKey, fetchKey])

  return { filters, inheritanceChain, isLoading, error, refetch }
}

// Re-export FilterDefinition from types for convenience
export type { FilterDefinition }
