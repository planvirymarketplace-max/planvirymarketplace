'use client'

import { CATEGORY_GROUPS, type StaticCategoryGroup, type StaticCategory } from '@/lib/marketplace-categories'

// Re-export types for consumers
export type CategoryGroup = StaticCategoryGroup
export type Category = StaticCategory

interface UseCategoryGroupsResult {
  groups: CategoryGroup[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Returns category groups with nested categories from STATIC code.
 * Zero API calls. Zero loading states. The sidebar renders instantly.
 *
 * Supabase is only needed when the user CLICKS a category (search_vendors RPC)
 * or when the filter panel needs to load filter_definitions.
 */
export function useCategoryGroups(): UseCategoryGroupsResult {
  return {
    groups: CATEGORY_GROUPS,
    isLoading: false,
    error: null,
    refetch: () => {}, // no-op: static data never stale
  }
}
