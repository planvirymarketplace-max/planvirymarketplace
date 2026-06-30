'use client'

import { useState, useMemo, useRef } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Check, X } from 'lucide-react'

interface DynamicFilterBarProps {
  categoryKey?: string
  subcategory?: string
  activeFilters: Record<string, string[]>
  onFilterChange: (filterName: string, values: string[]) => void
}

// Load taxonomy filters at build time
import taxonomyData from '../../taxonomy_filters.json'

export function DynamicFilterBar({ categoryKey, subcategory, activeFilters, onFilterChange }: DynamicFilterBarProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const filterGroups = useMemo(() => {
    if (!categoryKey) return []
    const cat = (taxonomyData as any)[categoryKey]
    if (!cat) return []

    const groups: { name: string; options: string[]; isRange?: boolean }[] = []

    // Category-level filters
    const catFilters = cat.category_filters || {}
    for (const [name, options] of Object.entries(catFilters)) {
      const opts = options as string[]
      // Detect range-style filters (contain "Under", "Over", "+", or numeric ranges)
      const isRange = opts.some(o =>
        typeof o === 'string' && (
          o.includes('Under') || o.includes('Over') || o.includes('+') ||
          /^\d+-\d+/.test(o) || /\$\d+/.test(o)
        )
      )
      groups.push({ name, options: opts, isRange })
    }

    // Subcategory-level filters (if a subcategory is selected)
    if (subcategory) {
      const subFilters = cat.subcategories?.[subcategory]
      if (subFilters && typeof subFilters === 'object') {
        for (const [name, options] of Object.entries(subFilters)) {
          const opts = options as string[]
          if (Array.isArray(opts)) {
            const isRange = opts.some(o =>
              typeof o === 'string' && (
                o.includes('Under') || o.includes('Over') || o.includes('+') ||
                /^\d+-\d+/.test(o) || /\$\d+/.test(o)
              )
            )
            groups.push({ name, options: opts, isRange })
          }
        }
      }
    }

    return groups
  }, [categoryKey, subcategory])

  const toggleFilter = (groupName: string, value: string) => {
    const current = activeFilters[groupName] || []
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onFilterChange(groupName, next)
  }

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 200
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
    }
  }

  const activeCount = Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0)

  if (filterGroups.length === 0) return null

  return (
    <div className="bg-white border-b border-midnight-slate/10 py-3">
      <div className="w-full px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-2">
          {/* Left scroll arrow */}
          <button
            onClick={() => scroll('left')}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-midnight-slate/10 text-midnight-slate/40 hover:bg-gray-50 hover:text-midnight-slate transition-colors"
            aria-label="Scroll filters left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable filter pills */}
          <div ref={scrollRef} className="flex-1 flex items-center gap-2 overflow-x-auto hide-scrollbar scroll-smooth">
            {filterGroups.map((group) => {
              const isActive = activeFilters[group.name]?.length > 0
              const isOpen = openGroup === group.name
              return (
                <div key={group.name} className="relative shrink-0">
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : group.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-midnight-slate text-white'
                        : 'bg-white border border-midnight-slate/10 text-midnight-slate/60 hover:border-midnight-slate/30 hover:text-midnight-slate'
                    }`}
                  >
                    {group.name}
                    {group.isRange && <span className="text-[11px] opacity-50">⇅</span>}
                    {isActive && (
                      <span className="bg-secondary-container text-midnight-slate rounded-full px-1.5 text-[11px]">
                        {activeFilters[group.name].length}
                      </span>
                    )}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-midnight-slate/10 max-h-80 overflow-y-auto z-50 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-bold uppercase tracking-widest text-midnight-slate/40">
                          {group.name}
                        </span>
                        {isActive && (
                          <button
                            onClick={() => onFilterChange(group.name, [])}
                            className="text-[12px] text-midnight-slate/40 hover:text-midnight-slate"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        {group.options.map((opt) => {
                          const selected = activeFilters[group.name]?.includes(opt)
                          return (
                            <button
                              key={opt}
                              onClick={() => toggleFilter(group.name, opt)}
                              className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
                                selected ? 'bg-secondary-container/30 text-midnight-slate font-semibold' : 'text-midnight-slate/70 hover:bg-gray-50'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center ${
                                selected ? 'border-midnight-slate bg-midnight-slate' : 'border-midnight-slate/20'
                              }`}>
                                {selected && <Check className="w-2.5 h-2.5 text-white" />}
                              </span>
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Clear all */}
            {activeCount > 0 && (
              <button
                onClick={() => {
                  Object.keys(activeFilters).forEach(k => onFilterChange(k, []))
                }}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-midnight-slate/60 hover:text-midnight-slate transition-colors whitespace-nowrap"
              >
                <X className="w-3 h-3" />
                Clear all ({activeCount})
              </button>
            )}
          </div>

          {/* Right scroll arrow */}
          <button
            onClick={() => scroll('right')}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-midnight-slate/10 text-midnight-slate/40 hover:bg-gray-50 hover:text-midnight-slate transition-colors"
            aria-label="Scroll filters right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
