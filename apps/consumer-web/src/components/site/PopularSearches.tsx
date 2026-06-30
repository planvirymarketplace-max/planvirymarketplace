'use client'

import seoPopular from '@/lib/seo-popular.json'

interface PopularEntry {
  id: string
  searchTag: string
  slug: string
  pageType: string
}

interface PopularSearchesProps {
  navigate: (path: string) => void
}

export function PopularSearches({ navigate }: PopularSearchesProps) {
  const topSearches = seoPopular as PopularEntry[]

  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black tracking-tight">
            Popular Searches
          </h2>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Discover what Milwaukee is searching for
          </p>
        </div>

        {/* Dense grid of search links */}
        <div className="flex flex-wrap gap-x-3 gap-y-2 justify-center max-w-5xl mx-auto">
          {topSearches.map((entry) => (
            <button
              key={entry.id}
              onClick={() => navigate(`/${entry.slug}`)}
              className="text-xs md:text-sm text-black/80 hover:text-black hover:underline transition-colors leading-relaxed"
            >
              {entry.searchTag}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
