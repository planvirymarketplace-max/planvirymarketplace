'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Search, MapPin, Loader2 } from 'lucide-react'
import type { VendorCategory } from '@/lib/marketplace-types'
import { DIRECTORY_CATEGORIES } from '@/lib/directory-categories'
import { useAutocomplete } from '@/hooks/use-autocomplete'

interface HeroProps {
  onSelectCategory: (category: VendorCategory | 'all') => void
  selectedCategory: VendorCategory | 'all'
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function Hero({ onSelectCategory, selectedCategory, searchQuery, setSearchQuery }: HeroProps) {
  const heroCategories = DIRECTORY_CATEGORIES.filter(c => c.vendorCategory).slice(0, 12)
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { results, isLoading, clear } = useAutocomplete(searchQuery, { limit: 8 })

  const handleSelect = useCallback((href: string, label: string) => {
    setSearchQuery(label)
    clear()
    setOpen(false)
    router.push(href)
  }, [setSearchQuery, clear, router])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); handleSelect(results[activeIdx].href, results[activeIdx].label) }
    else if (e.key === 'Escape') { setOpen(false); setActiveIdx(-1) }
  }

  return (
    <div className="relative overflow-hidden bg-background py-16 md:py-24 border-b border-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-5 inline-flex items-center gap-2 border border-border bg-card px-4 py-2">
          <Sparkles size={11} className="text-ember" strokeWidth={1.5} />
          <span className="font-utility text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
            Official Directory of BestTimeMKE
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.0] mb-6">
          Find &amp; Hire the Perfect <br />
          <span className="italic font-normal text-teal">Milwaukee Event Vendors</span>
        </h1>

        <p className="mx-auto max-w-2xl font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
          Planviry simplifies wedding and party planning. Discover premium venues, elite wedding DJs (powered by <b className="font-semibold text-foreground">BestTimeMKE</b>), live music, planners, and transportation. Group them into <span className="font-medium text-foreground">one seamless event cart</span> with unified checkout and guaranteed coordination.
        </p>

        {/* ── Autocomplete search bar ── */}
        <div className="mx-auto mt-10 max-w-xl relative">
          <div className="relative flex items-center border border-border bg-card p-2 focus-within:border-ember/60 transition-colors">
            <div className="pointer-events-none pl-3 text-muted-foreground">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </div>
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open && results.length > 0}
              aria-activedescendant={activeIdx >= 0 ? `ac-item-${activeIdx}` : undefined}
              placeholder="Search wedding venues, DJs, photographers…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setOpen(true); setActiveIdx(-1) }}
              onKeyDown={handleKeyDown}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              className="w-full border-0 bg-transparent pl-3 pr-2 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-xs sm:text-sm"
            />
            <span className="hidden sm:inline-flex items-center gap-1.5 border border-border bg-muted px-3 py-1.5 font-utility text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
              <MapPin size={11} />
              <span>Milwaukee, WI</span>
            </span>
          </div>

          {/* Dropdown */}
          {open && results.length > 0 && (
            <ul
              role="listbox"
              className="absolute top-full left-0 right-0 mt-1 bg-card border border-border shadow-lg overflow-hidden z-50 text-left"
            >
              {results.map((r, i) => (
                <li
                  key={r.slug}
                  id={`ac-item-${i}`}
                  role="option"
                  aria-selected={i === activeIdx}
                  onMouseDown={() => handleSelect(r.href, r.label)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer font-body text-sm transition-colors ${i === activeIdx ? 'bg-muted' : 'hover:bg-muted'}`}
                >
                  <Search size={13} className="text-muted-foreground shrink-0" />
                  <span className="flex-1 text-foreground">{r.label}</span>
                  {r.weight === 'A' && (
                    <span className="font-utility text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground bg-muted px-1.5 py-0.5">
                      {r.eventType ?? 'venue'}
                    </span>
                  )}
                </li>
              ))}
              <li className="px-4 py-2 font-utility text-[10px] text-muted-foreground border-t border-border">
                {results.length} results · Enter to select · Esc to close
              </li>
            </ul>
          )}

          <p className="font-utility text-[10px] text-muted-foreground mt-2">548 Milwaukee vendor categories indexed · Live directory data</p>
        </div>

        <div className="mt-10">
          <p className="font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">Select Service Type</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            <button onClick={() => onSelectCategory('all')} className={`px-4 py-2 font-utility text-[11px] font-bold uppercase tracking-[0.12em] border transition-colors ${selectedCategory === 'all' ? 'bg-ink text-ink-foreground border-ink' : 'bg-card border-border text-muted-foreground hover:border-ember/40'}`}>
              <span>All Categories</span>
            </button>
            {heroCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { if (cat.vendorCategory) onSelectCategory(cat.vendorCategory) }}
                className={`px-4 py-2 font-utility text-[11px] font-bold uppercase tracking-[0.12em] border transition-colors ${
                  cat.vendorCategory === selectedCategory
                    ? 'bg-ember text-ember-foreground border-ember'
                    : 'bg-card border-border text-muted-foreground hover:border-ember/40'
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