'use client'

import { useState, useEffect, useCallback } from 'react'

export interface FilterDefinition {
  id: string
  filter_key: string
  label: string
  ui_type: string
  options_json: Record<string, unknown> | null
  range_min: number | null
  range_max: number | null
  range_step: number | null
  range_unit: string | null
  is_universal: boolean
  is_sensitive: boolean
  category_key: string
  sort_order: number
  placeholder?: string | null
  help_text?: string | null
  requires_auth?: boolean
}

interface UseCategoryFiltersParams {
  categoryKey: string | null
}

interface UseCategoryFiltersResult {
  filters: FilterDefinition[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  categoryChain: string[]
}

/**
 * Fetches resolved filter definitions for a category from /api/filters.
 * The API route handles inheritance chain resolution server-side.
 * Uses the API route (admin client) instead of direct Supabase (broken anon key).
 */
export function useCategoryFilters(
  params: UseCategoryFiltersParams
): UseCategoryFiltersResult {
  const { categoryKey } = params

  const [filters, setFilters] = useState<FilterDefinition[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)
  const [categoryChain, setCategoryChain] = useState<string[]>([])

  const refetch = useCallback(() => {
    setFetchKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!categoryKey) {
      setFilters([])
      setCategoryChain([])
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function fetchFilters() {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/filters?category_key=${encodeURIComponent(categoryKey)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        if (cancelled) return

        setCategoryChain(data.inheritance_chain ?? [])
        setFilters(data.filters ?? [])
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch category filters')
          setFilters([])
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

  return { filters, isLoading, error, refetch, categoryChain }
}
