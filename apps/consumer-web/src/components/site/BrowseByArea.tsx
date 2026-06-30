'use client'

import { useMemo } from 'react'
import seoAreas from '@/lib/seo-areas.json'

interface AreaEntry {
  searchTag: string
  slug: string
  pageType: string
}

interface BrowseByAreaProps {
  navigate: (path: string) => void
}

export function BrowseByArea({ navigate }: BrowseByAreaProps) {
  // Group area entries by areaName and count vendors
  const areaGroups = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; count: number }>()
    for (const entry of seoAreas as AreaEntry[]) {
      const areaName = entry.searchTag
      if (!map.has(areaName)) {
        map.set(areaName, {
          name: areaName,
          slug: entry.slug,
          count: 1,
        })
      } else {
        const existing = map.get(areaName)!
        existing.count += 1
      }
    }
    return Array.from(map.values())
  }, [])

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black tracking-tight">
            Browse by Area
          </h2>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Explore Milwaukee neighborhoods and landmarks
          </p>
        </div>

        {/* Grid of area cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {areaGroups.map((area) => (
            <div
              key={area.slug}
              onClick={() => navigate(`/${area.slug}`)}
              className="bg-white border border-black/[0.08] rounded-lg p-3 md:p-4 cursor-pointer transition-shadow hover:shadow-md hover:border-black/[0.15]"
            >
              <h3 className="text-xs md:text-sm font-bold text-black leading-tight">
                {area.name}
              </h3>
              <p className="mt-1 text-[11px] md:text-xs text-muted-foreground">
                {area.count} vendor{area.count !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
