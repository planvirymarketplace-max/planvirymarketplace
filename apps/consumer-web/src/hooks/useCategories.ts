'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Category, CategoryGroup } from '@/types/marketplace'

interface UseCategoriesResult {
  categories: Category[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Fetches /api/categories and returns a flattened list of categories.
 * Optionally filters by group slug - when provided, only categories
 * belonging to that group are returned.
 *
 * Each category includes its parent group info (group_id, group_slug, group_name).
 */
export function useCategories(groupSlug?: string): UseCategoriesResult {
  const [groups, setGroups] = useState<CategoryGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  const refetch = useCallback(() => {
    setFetchKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchCategories() {
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

        setGroups(data.groups ?? [])
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch categories')
          setGroups([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchCategories()

    return () => {
      cancelled = true
    }
  }, [fetchKey])

  // Flatten categories from all groups, attaching group info to each
  const categories = useMemo(() => {
    const result: Category[] = []

    for (const group of groups) {
      // If a groupSlug filter is provided, skip groups that don't match
      if (groupSlug && group.slug !== groupSlug) continue

      for (const cat of group.categories) {
        result.push({
          ...cat,
          group_id: group.id,
          group_slug: group.slug,
          group_name: group.name,
        })
      }
    }

    return result
  }, [groups, groupSlug])

  return { categories, isLoading, error, refetch }
}

// Re-export Category from types for convenience
export type { Category }
