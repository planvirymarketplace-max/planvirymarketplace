'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { MarketplaceFeed } from '@/components/MarketplaceFeed'
import { IntentGate } from '@/components/orchestration/IntentGate'
import { useApp } from '@/context/AppContext'

interface GatedSurfacePageProps {
  surface: string
}

export function GatedSurfacePage({ surface }: GatedSurfacePageProps) {
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

  // Intent gate: if both missing, show 2-column gate
  if (!what && !where) {
    return <IntentGate surface={surface} missing="both" />
  }

  // If what set but where missing
  if (what && !where) {
    return <IntentGate surface={surface} missing="where" existingWhat={what} />
  }

  // If where set but what missing
  if (!what && where) {
    return <IntentGate surface={surface} missing="what" existingWhere={where} />
  }

  // Both set — show the marketplace feed inside the app layout
  return (
    <AppLayout>
      <MarketplaceFeed category={surface as any} />
    </AppLayout>
  )
}
