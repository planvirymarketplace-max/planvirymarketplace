'use client'

import { CATEGORY_GROUPS, type StaticCategory } from '@/lib/marketplace-categories'

export type Category = StaticCategory

interface UseCategoriesParams {
  groupSlug?: string
  topLevelOnly?: boolean
}

interface UseCategoriesResult {
  categories: Category[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Returns categories from STATIC code, optionally filtered by group or top-level.
 * Zero API calls. Zero loading states.
 */
export function useCategories(params: UseCategoriesParams = {}): UseCategoriesResult {
  const { groupSlug, topLevelOnly } = params

  let categories = CATEGORY_GROUPS.flatMap(g =>
    g.categories.map(c => ({ ...c, groupSlug: g.slug }))
  )

  if (groupSlug) {
    const group = CATEGORY_GROUPS.find(g => g.slug === groupSlug)
    categories = (group?.categories ?? []).map(c => ({ ...c, groupSlug }))
  }

  if (topLevelOnly) {
    categories = categories.filter(c => c.is_top_level)
  }

  return {
    categories,
    isLoading: false,
    error: null,
    refetch: () => {},
  }
}
