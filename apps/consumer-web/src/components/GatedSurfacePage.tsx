'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { MarketplaceFeed } from '@/components/MarketplaceFeed'
import { SurfaceLiveInventory } from '@/components/SurfaceLiveInventory'
import { useApp } from '@/context/AppContext'

/**
 * GatedSurfacePage — renders a surface page (one of the 9 sidebar lenses).
 *
 * ARCHITECTURE (per user spec):
 * - The sidebar is always present (AppLayout provides it).
 * - Clicking a sidebar lens goes DIRECTLY to the surface page. NO gate.
 * - The user can browse cards freely without setting what/where.
 * - The search filter bar is present but optional — if the user fills it in,
 *   the results filter. If not, all cards show.
 * - Auth gate only triggers when the user clicks "Add to Plan" (cart) or
 *   "Checkout" — NOT on page view.
 *
 * Previously this component rendered an IntentGate that blocked the page
 * unless what+where were set. That was wrong — it blocked browsing.
 */
interface GatedSurfacePageProps {
  surface: string
  inventoryCategory?: string
  inventoryCategories?: string[]
}

export function GatedSurfacePage({
  surface,
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
  }, [what, where, surface, setSearchWhat, setSearchWhere, setActiveCategory])

  // No gate. Show the marketplace feed + live inventory directly.
  // The user can browse freely. Auth only prompts on Add to Plan / Checkout.
  return (
    <AppLayout>
      <MarketplaceFeed category={surface as any} />
      <SurfaceLiveInventory surface={surface} />
    </AppLayout>
  )
}
