'use client'

import { Sparkles, Search, MapPin } from 'lucide-react'
import type { VendorCategory } from '@/lib/marketplace-types'
import { DIRECTORY_CATEGORIES } from '@/lib/directory-categories'

interface HeroProps {
  onSelectCategory: (category: VendorCategory | 'all') => void
  selectedCategory: VendorCategory | 'all'
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function Hero({ onSelectCategory, selectedCategory, searchQuery, setSearchQuery }: HeroProps) {
  // Show main categories that have vendorCategory mapping, limited to a good set for hero
  const heroCategories = DIRECTORY_CATEGORIES
    .filter(c => c.vendorCategory)
    .slice(0, 12)

  return (
    <div className="relative overflow-hidden bg-[#FAF9F6] py-12 md:py-20 border-b border-stone-200/80">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(100%_100%_at_top_right,rgba(249,115,22,0.04),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_bottom_left,rgba(28,25,23,0.02),transparent_60%)]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-stone-200 bg-white px-3.5 py-1.5">
          <Sparkles size={11} className="text-[#F97316]" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-stone-500 uppercase font-sans">
            Official Directory of BestTimeMKE
          </span>
        </div>

        <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-stone-900 tracking-tight leading-[1.05] mt-2 mb-6">
          Find & Hire the Perfect <br />
          <span className="italic text-stone-800 font-normal">Milwaukee Event Vendors</span>
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-base text-stone-600 leading-relaxed font-sans font-light">
          Planviry simplifies wedding and party planning. Discover premium venues, elite wedding DJs (powered by <b className="font-semibold text-stone-800">BestTimeMKE</b>), live music, planners, and transportation. Group them into <span className="font-medium text-stone-900">one seamless event cart</span> with unified checkout and guaranteed coordination.
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <div className="relative flex items-center rounded-2xl border border-stone-200 bg-white p-2 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100 transition duration-300">
            <div className="pointer-events-none pl-3 text-stone-400"><Search className="h-4 w-4" /></div>
            <input
              type="text"
              placeholder="Search through professional Milwaukee directories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-0 bg-transparent pl-3 pr-2 text-stone-950 placeholder:text-stone-400 focus:outline-none focus:ring-0 text-xs sm:text-sm font-light"
            />
            <span className="hidden sm:inline-flex items-center space-x-1 rounded-xl bg-stone-50 px-2.5 py-1.5 text-[11px] font-semibold text-stone-600 border border-stone-200/60">
              <MapPin size={11} className="text-stone-400" />
              <span>Milwaukee, WI</span>
            </span>
          </div>
          <p className="text-[10px] text-stone-400 mt-2 text-center">Database index synced with live active directories. Owner verification in real-time.</p>
        </div>

        <div className="mt-10">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 block mb-3">Select Service Type</span>
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => onSelectCategory('all')} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${selectedCategory === 'all' ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200/60 text-stone-700'}`}>
              <span>All Categories</span>
            </button>
            {heroCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.vendorCategory) {
                    onSelectCategory(cat.vendorCategory)
                  }
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  cat.vendorCategory === selectedCategory
                    ? 'bg-[#F97316] text-white font-bold'
                    : 'bg-white border border-stone-200/60 text-stone-700'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
