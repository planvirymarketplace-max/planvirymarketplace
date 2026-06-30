'use client'

import dynamic from 'next/dynamic'

// Dynamically load the map component with SSR disabled
// maplibre-gl requires window/browser APIs and can't be server-rendered
const GeoapifyMapInner = dynamic(
  () => import('./GeoapifyMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="relative rounded-2xl border border-gray-200 overflow-hidden bg-slate-100" style={{ height: '280px' }}>
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loading Map</span>
          </div>
        </div>
      </div>
    ),
  }
)

interface GeoapifyMapProps {
  lat: number
  lng: number
  label: string
  radiusMiles?: number
  className?: string
  style?: React.CSSProperties
  apiKey?: string
}

export function GeoapifyMap(props: GeoapifyMapProps) {
  return <GeoapifyMapInner {...props} />
}
