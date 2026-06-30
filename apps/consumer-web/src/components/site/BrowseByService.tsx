'use client'

import { CATEGORY_GROUPS } from '@/lib/marketplace-categories'

interface BrowseByServiceProps {
  navigate: (path: string) => void
}

export function BrowseByService({ navigate }: BrowseByServiceProps) {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black tracking-tight">
            Browse by Service
          </h2>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Find Milwaukee&apos;s best vendors by category
          </p>
        </div>

        {/* Grid of category group cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {CATEGORY_GROUPS.map((group) => {
            // Flatten all subcategory names across categories for display (top 5-6)
            const topCategories = group.categories.slice(0, 6)

            return (
              <div
                key={group.slug}
                onClick={() => navigate(`/directory/${group.slug}`)}
                className="bg-white border border-black/[0.12] rounded-lg p-4 md:p-5 cursor-pointer transition-shadow hover:shadow-md hover:border-black/[0.2]"
              >
                {/* Group name */}
                <h3 className="text-sm md:text-base font-bold text-black mb-3">
                  {group.name}
                </h3>

                {/* Top category links */}
                <ul className="space-y-1.5 mb-3">
                  {topCategories.map((cat) => (
                    <li key={cat.slug}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/directory/${group.slug}`)
                        }}
                        className="text-xs md:text-sm text-black/70 hover:text-black hover:underline transition-colors text-left"
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* View All link */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/directory/${group.slug}`)
                  }}
                  className="text-xs md:text-sm font-semibold text-black hover:underline"
                >
                  View All →
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
