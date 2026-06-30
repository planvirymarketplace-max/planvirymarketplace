'use client'

import { useSearchParams } from 'next/navigation'
import { SurfaceShell } from './SurfaceShell'
import { IntentGate } from './IntentGate'
import { SearchResults } from './SearchResults'
import { SURFACE_DATA } from '@/lib/surface-data'

interface SurfacePageProps {
  surface: string
}

export function SurfacePage({ surface }: SurfacePageProps) {
  const searchParams = useSearchParams()
  const what = searchParams.get('what') || undefined
  const where = searchParams.get('where') || undefined
  const surfaceData = SURFACE_DATA[surface] || SURFACE_DATA['plan']

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

  // Both set — show the surface shell with real search results
  return (
    <SurfaceShell surface={surface} title={surfaceData.title} subtitle={surfaceData.subtitle} what={what} where={where}>
      <div className="max-w-container-max mx-auto">
        <SearchResults surface={surface} />
      </div>
    </SurfaceShell>
  )
}
