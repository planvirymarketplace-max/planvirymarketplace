'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ChevronDown, Check, Search } from 'lucide-react'
import { UniversalFilterValues } from '@/components/UniversalFilters'

// Universal filter definitions (from Filtering Taxonomy doc)
const UNIVERSAL_SECTIONS = [
  {
    name: 'Sort',
    type: 'single' as const,
    options: ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Distance: Nearest First', 'Rating: Highest First', 'Most Reviewed', 'Newest'],
    key: 'sort' as keyof UniversalFilterValues,
  },
  {
    name: 'Price',
    type: 'single' as const,
    options: ['$', '$$', '$$$', '$$$$', 'Any Price'],
    key: 'price' as keyof UniversalFilterValues,
  },
  {
    name: 'Distance',
    type: 'single' as const,
    options: ['Within 1 mile', 'Within 5 miles', 'Within 10 miles', 'Within 25 miles', 'Within 50 miles', '50+ miles'],
    key: 'distance' as keyof UniversalFilterValues,
  },
  {
    name: 'Rating',
    type: 'single' as const,
    options: ['4.5+ stars', '4.0+ stars', '3.5+ stars', '3.0+ stars', 'Any rating'],
    key: 'rating' as keyof UniversalFilterValues,
  },
  {
    name: 'Availability',
    type: 'multi' as const,
    options: ['Open now', 'Open today', 'Available this weekend', 'Advance booking required'],
    key: 'availability' as keyof UniversalFilterValues,
  },
  {
    name: 'Accessibility',
    type: 'multi' as const,
    options: ['Wheelchair accessible', 'Service animals allowed', 'Hearing loop available', 'Accessible parking'],
    key: 'accessibility' as keyof UniversalFilterValues,
  },
  {
    name: 'Payment Methods',
    type: 'multi' as const,
    options: ['Credit card accepted', 'Cash only', 'Venmo / PayPal', 'Cryptocurrency', 'Payment plan available'],
    key: 'paymentMethods' as keyof UniversalFilterValues,
  },
  {
    name: 'Cancellation Policy',
    type: 'multi' as const,
    options: ['Free cancellation', 'Partial refund available', 'Non-refundable'],
    key: 'cancellationPolicy' as keyof UniversalFilterValues,
  },
  {
    name: 'Deposit Required',
    type: 'multi' as const,
    options: ['No deposit', 'Deposit required (refundable)', 'Deposit required (non-refundable)'],
    key: 'depositRequired' as keyof UniversalFilterValues,
  },
]

interface FilterMegaMenuProps {
  categoryKey?: string
  subcategory?: string
  universalValues: UniversalFilterValues
  onUniversalChange: (values: UniversalFilterValues) => void
  dynamicFilters: Record<string, string[]>
  onDynamicChange: (filterName: string, values: string[]) => void
  resultCount: number
}

import taxonomyData from '../../taxonomy_filters.json'

export function FilterMegaMenu({
  categoryKey,
  subcategory,
  universalValues,
  onUniversalChange,
  dynamicFilters,
  onDynamicChange,
  resultCount,
}: FilterMegaMenuProps) {
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [expandedCatSection, setExpandedCatSection] = useState<string | null>(null)

  // Get category-specific filter groups
  const categoryGroups = (() => {
    if (!categoryKey) return []
    const cat = (taxonomyData as any)[categoryKey]
    if (!cat) return []
    const groups: { name: string; options: string[] }[] = []
    const catFilters = cat.category_filters || {}
    for (const [name, options] of Object.entries(catFilters)) {
      groups.push({ name, options: options as string[] })
    }
    if (subcategory) {
      const subFilters = cat.subcategories?.[subcategory]
      if (subFilters && typeof subFilters === 'object') {
        for (const [name, options] of Object.entries(subFilters)) {
          if (Array.isArray(options)) {
            groups.push({ name, options: options as string[] })
          }
        }
      }
    }
    return groups
  })()

  const activeUniversalCount = Object.values(universalValues).filter(v =>
    Array.isArray(v) ? v.length > 0 : !!v
  ).length
  const activeDynamicCount = Object.values(dynamicFilters).reduce((sum, arr) => sum + arr.length, 0)
  const totalActive = activeUniversalCount + activeDynamicCount

  const toggleUniversal = (section: typeof UNIVERSAL_SECTIONS[0], opt: string) => {
    if (section.type === 'single') {
      onUniversalChange({ ...universalValues, [section.key]: opt })
    } else {
      const arr = (universalValues[section.key] as string[]) || []
      const next = arr.includes(opt) ? arr.filter(v => v !== opt) : [...arr, opt]
      onUniversalChange({ ...universalValues, [section.key]: next })
    }
  }

  const toggleDynamic = (groupName: string, opt: string) => {
    const current = dynamicFilters[groupName] || []
    const next = current.includes(opt) ? current.filter(v => v !== opt) : [...current, opt]
    onDynamicChange(groupName, next)
  }

  const clearAll = () => {
    onUniversalChange({})
    Object.keys(dynamicFilters).forEach(k => onDynamicChange(k, []))
    setKeyword('')
  }

  return (
    <>
      {/* Filter trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold bg-white border border-midnight-slate/10 text-midnight-slate hover:border-midnight-slate/30 transition-all"
      >
        Filters
        {totalActive > 0 && (
          <span className="bg-secondary-container text-midnight-slate rounded-full px-1.5 text-[11px] font-bold">
            {totalActive}
          </span>
        )}
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {/* Mega menu modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30" onClick={() => setOpen(false)}>
          <div
            className="bg-white w-full max-w-3xl mt-8 mx-4 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-midnight-slate/10">
              <h2 className="text-lg font-bold text-midnight-slate">Filters</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-midnight-slate/60 hover:text-midnight-slate"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Keyword search */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-midnight-slate mb-2">Filter by keyword</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-slate/30" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Find listings with specific keywords"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-midnight-slate/15 text-sm text-midnight-slate placeholder:text-midnight-slate/30 focus:border-midnight-slate/30 focus:outline-none"
                  />
                </div>
              </div>

              {/* Universal filters — collapsible sections */}
              <div className="space-y-1 mb-6">
                <h3 className="text-sm font-bold text-midnight-slate mb-3">Universal Filters</h3>
                {UNIVERSAL_SECTIONS.map((section) => {
                  const isExpanded = expandedSection === section.name
                  const activeValue = universalValues[section.key]
                  const hasActive = Array.isArray(activeValue) ? activeValue.length > 0 : !!activeValue
                  return (
                    <div key={section.name} className="border-b border-midnight-slate/5">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : section.name)}
                        className="w-full flex items-center justify-between py-3 text-left"
                      >
                        <span className="text-sm font-semibold text-midnight-slate flex items-center gap-2">
                          {section.name}
                          {hasActive && (
                            <span className="bg-secondary-container text-midnight-slate rounded-full px-1.5 text-[11px] font-bold">
                              {Array.isArray(activeValue) ? activeValue.length : 1}
                            </span>
                          )}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-midnight-slate/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="pb-3 grid grid-cols-2 gap-2">
                          {section.options.map((opt) => {
                            const selected = Array.isArray(activeValue)
                              ? activeValue.includes(opt)
                              : activeValue === opt
                            return (
                              <button
                                key={opt}
                                onClick={() => toggleUniversal(section, opt)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
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
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Category-specific filters — collapsible sections */}
              {categoryGroups.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-midnight-slate mb-3">Category Filters</h3>
                  {categoryGroups.map((group) => {
                    const isExpanded = expandedCatSection === group.name
                    const activeValue = dynamicFilters[group.name] || []
                    const hasActive = activeValue.length > 0
                    return (
                      <div key={group.name} className="border-b border-midnight-slate/5">
                        <button
                          onClick={() => setExpandedCatSection(isExpanded ? null : group.name)}
                          className="w-full flex items-center justify-between py-3 text-left"
                        >
                          <span className="text-sm font-semibold text-midnight-slate flex items-center gap-2">
                            {group.name}
                            {hasActive && (
                              <span className="bg-secondary-container text-midnight-slate rounded-full px-1.5 text-[11px] font-bold">
                                {activeValue.length}
                              </span>
                            )}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-midnight-slate/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="pb-3 grid grid-cols-2 gap-2">
                            {group.options.map((opt) => {
                              const selected = activeValue.includes(opt)
                              return (
                                <button
                                  key={opt}
                                  onClick={() => toggleDynamic(group.name, opt)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
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
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-midnight-slate/10 bg-gray-50/50">
              <button
                onClick={clearAll}
                className="text-sm font-semibold text-midnight-slate/60 hover:text-midnight-slate"
              >
                Clear all
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-midnight-slate text-white text-sm font-bold hover:bg-champagne-gold hover:text-black transition-colors"
              >
                View {resultCount} {resultCount === 1 ? 'result' : 'results'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
