'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { MarketplaceFeed } from '@/components/MarketplaceFeed'
import { IntentGate } from '@/components/orchestration/IntentGate'
import { SurfaceLiveInventory } from '@/components/SurfaceLiveInventory'
import { useApp } from '@/context/AppContext'

interface GatedSurfacePageProps {
  surface: string
  /**
   * P4-1: the inventory_items.category filter backing this surface. When
   * supplied, GatedSurfacePage injects `?category=X` into the URL and renders
   * the live-inventory panel below the marketplace feed.
   */
  inventoryCategory?: string
  /** P4-1: alternative — multiple categories (IN-style filter). */
  inventoryCategories?: string[]
}

export function GatedSurfacePage({
  surface,
  inventoryCategory,
  inventoryCategories,
}: GatedSurfacePageProps) {
  const searchParams = useSearchParams()
  const what = searchParams.get('what') || undefined
  const where = searchParams.get('where') || undefined
  const { setSearchWhat, setSearchWhere, setActiveCategory } = useApp()

  // Sync URL params into AppContext so the sidebar carries intent forward
  useEffect(() => {
    if (what) setSearchWhat(what)
    if (where) setSearchWhere(where)
    setActiveCategory(surface as any)
  }, [what, where, surface])

  // P4-1: surface → inventory_items.category filter documentation.
  // The actual Supabase query lives in <SurfaceLiveInventory />.
  // const liveInventoryCategories = inventoryCategories ?? (inventoryCategory ? [inventoryCategory] : [])

  // Intent gate: if both missing, show 2-column gate
  if (!what && !where) {
    return (
      <>
        <IntentGate surface={surface} missing="both" />
        {/* P4-1/4-2: still surface the live inventory + subcategory pills so
            the page has real content even before the user enters intent. */}
        <SurfaceLiveInventory surface={surface} />
      </>
    )
  }

  // If what set but where missing
  if (what && !where) {
    return (
      <>
        <IntentGate surface={surface} missing="where" existingWhat={what} />
        <SurfaceLiveInventory surface={surface} />
      </>
    )
  }

  // If where set but what missing
  if (!what && where) {
    return (
      <>
        <IntentGate surface={surface} missing="what" existingWhere={where} />
        <SurfaceLiveInventory surface={surface} />
      </>
    )
  }

  // Both set — show the marketplace feed inside the app layout
  return (
    <AppLayout>
      <MarketplaceFeed category={surface as any} />
      {/* P4-1: live inventory_items filtered by category for this surface.
          P4-2: subcategory pills pulled from vendor_categories / taxonomy_nodes. */}
      <SurfaceLiveInventory surface={surface} />
    </AppLayout>
  )
}
