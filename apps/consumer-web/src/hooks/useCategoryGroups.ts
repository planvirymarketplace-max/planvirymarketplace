'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CategoryGroup } from '@/types/marketplace'

interface UseCategoryGroupsResult {
  groups: CategoryGroup[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Fetches /api/categories and returns the full group tree with nested categories.
 * Used by the sidebar to render category groups as collapsible sections.
 */
export function useCategoryGroups(): UseCategoryGroupsResult {
  const [groups, setGroups] = useState<CategoryGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  const refetch = useCallback(() => {
    setFetchKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchGroups() {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/categories')

        if (cancelled) return

        if (!res.ok) {
          setError(`Failed to fetch categories: ${res.status} ${res.statusText}`)
          setGroups([])
          return
        }

        const data = await res.json()

        if (cancelled) return

        // API returns { groups: [...] } with nested categories
        setGroups(data.groups ?? [])
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch category groups')
          setGroups([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchGroups()

    return () => {
      cancelled = true
    }
  }, [fetchKey])

  return { groups, isLoading, error, refetch }
}

// Re-export CategoryGroup from types for convenience
export type { CategoryGroup }
