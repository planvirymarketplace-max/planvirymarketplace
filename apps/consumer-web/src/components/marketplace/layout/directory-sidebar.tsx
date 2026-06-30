'use client'

import React, { useState } from 'react'
import {
  Building2, Sparkles, Utensils, Wine, UtensilsCrossed, Music,
  Camera, Flower2, Scissors, Gem, Bus, Package, Hotel,
  ChevronDown, ChevronRight, Search, MapPin, X, SlidersHorizontal,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { CATEGORY_HIERARCHY, LOCATION_FILTERS, AMENITY_FILTERS, type CategoryGroup } from '@/lib/category-hierarchy'
import type { VendorCategory } from '@/lib/types'

const ICON_MAP: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-3.5 w-3.5" />,
  Sparkles: <Sparkles className="h-3.5 w-3.5" />,
  Utensils: <Utensils className="h-3.5 w-3.5" />,
  Wine: <Wine className="h-3.5 w-3.5" />,
  UtensilsCrossed: <UtensilsCrossed className="h-3.5 w-3.5" />,
  Music: <Music className="h-3.5 w-3.5" />,
  Camera: <Camera className="h-3.5 w-3.5" />,
  Flower2: <Flower2 className="h-3.5 w-3.5" />,
  Scissors: <Scissors className="h-3.5 w-3.5" />,
  Gem: <Gem className="h-3.5 w-3.5" />,
  Bus: <Bus className="h-3.5 w-3.5" />,
  Package: <Package className="h-3.5 w-3.5" />,
  Hotel: <Hotel className="h-3.5 w-3.5" />,
}

export interface SidebarFilters {
  selectedCategory: VendorCategory | 'all'
  selectedSubcategory: string | null
  searchQuery: string
  selectedLocations: string[]
  selectedEventTypes: string[]
  selectedAmenities: string[]
  priceRange: string | null
}

interface DirectorySidebarProps {
  filters: SidebarFilters
  onFiltersChange: (filters: SidebarFilters) => void
  vendorCounts: Record<string, number>
  totalVendors: number
  className?: string
}

export function DirectorySidebar({ filters, onFiltersChange, vendorCounts, totalVendors, className }: DirectorySidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set([filters.selectedCategory !== 'all' ? filters.selectedCategory : CATEGORY_HIERARCHY[0]?.slug || '']))
  const [locationSearch, setLocationSearch] = useState('')
  const [showAllLocations, setShowAllLocations] = useState(false)

  const toggleGroup = (slug: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const updateFilter = <K extends keyof SidebarFilters>(key: K, value: SidebarFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleLocation = (location: string) => {
    const current = filters.selectedLocations
    updateFilter(
      'selectedLocations',
      current.includes(location) ? current.filter(l => l !== location) : [...current, location]
    )
  }

  const toggleEventType = (type: string) => {
    const current = filters.selectedEventTypes
    updateFilter(
      'selectedEventTypes',
      current.includes(type) ? current.filter(t => t !== type) : [...current, type]
    )
  }

  const toggleAmenity = (amenity: string) => {
    const current = filters.selectedAmenities
    updateFilter(
      'selectedAmenities',
      current.includes(amenity) ? current.filter(a => a !== amenity) : [...current, amenity]
    )
  }

  const clearAllFilters = () => {
    onFiltersChange({
      selectedCategory: 'all',
      selectedSubcategory: null,
      searchQuery: '',
      selectedLocations: [],
      selectedEventTypes: [],
      selectedAmenities: [],
      priceRange: null,
    })
  }

  const hasActiveFilters = filters.selectedCategory !== 'all' ||
    filters.selectedSubcategory !== null ||
    filters.selectedLocations.length > 0 ||
    filters.selectedEventTypes.length > 0 ||
    filters.selectedAmenities.length > 0 ||
    filters.priceRange !== null

  const filteredLocations = LOCATION_FILTERS.nearbyCities.filter(c =>
    !locationSearch || c.toLowerCase().includes(locationSearch.toLowerCase())
  )

  const displayedLocations = showAllLocations ? filteredLocations : filteredLocations.slice(0, 8)

  const getCategoryCount = (vendorCategory: string): number => {
    return vendorCounts[vendorCategory] || 0
  }

  return (
    <div className={`bg-white h-full flex flex-col ${className || ''}`}>
      {/* Sidebar header */}
      <div className="px-4 py-3 border-b border-stone-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-stone-500" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="text-[10px] font-semibold text-red-600 hover:text-red-700 transition-colors">
              Clear all
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-3 space-y-1">
          {/* CATEGORIES SECTION */}
          <div className="mb-2">
            <div className="px-1 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Categories</span>
            </div>

            {/* All categories button */}
            <button
              onClick={() => updateFilter('selectedCategory', 'all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                filters.selectedCategory === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>All Categories</span>
              <span className={`text-[10px] tabular-nums ${filters.selectedCategory === 'all' ? 'text-white/60' : 'text-stone-400'}`}>
                {totalVendors}
              </span>
            </button>

            {/* Category groups with expandable subcategories */}
            {CATEGORY_HIERARCHY.map((group) => {
              const isExpanded = expandedGroups.has(group.slug)
              const isActive = filters.selectedCategory === group.vendorCategory
              const count = getCategoryCount(group.vendorCategory)

              return (
                <div key={group.slug} className="mt-0.5">
                  <button
                    onClick={() => {
                      updateFilter('selectedCategory', group.vendorCategory as VendorCategory)
                      updateFilter('selectedSubcategory', null)
                      toggleGroup(group.slug)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-stone-100 text-stone-900 font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 font-medium'
                    }`}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] flex-shrink-0 ${
                      isActive ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {ICON_MAP[group.icon] || <Package className="h-3 w-3" />}
                    </span>
                    <span className="truncate flex-1 text-left">{group.label}</span>
                    <span className={`text-[10px] tabular-nums flex-shrink-0 ${isActive ? 'text-stone-500' : 'text-stone-400'}`}>
                      {count}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''} ${isActive ? 'text-stone-400' : 'text-stone-300'}`}
                    />
                  </button>

                  {/* Subcategories */}
                  {isExpanded && (
                    <div className="ml-4 pl-3 border-l border-stone-100 mt-0.5 mb-1">
                      {group.subcategories.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => {
                            updateFilter('selectedCategory', group.vendorCategory as VendorCategory)
                            updateFilter('selectedSubcategory', sub.slug)
                          }}
                          className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-[11px] transition-colors text-left ${
                            filters.selectedSubcategory === sub.slug
                              ? 'text-stone-900 font-semibold bg-stone-50'
                              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <ChevronRight size={10} className="flex-shrink-0 text-stone-300" />
                          <span className="truncate">{sub.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* PRICE RANGE */}
          <div className="border-t border-stone-100 pt-3 mt-3">
            <div className="px-1 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Price Range</span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-1">
              {[
                { value: '$', label: '$' },
                { value: '$$', label: '$$' },
                { value: '$$$', label: '$$$' },
                { value: '$$$$', label: '$$$$' },
              ].map((price) => (
                <button
                  key={price.value}
                  onClick={() => updateFilter('priceRange', filters.priceRange === price.value ? null : price.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filters.priceRange === price.value
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {price.label}
                </button>
              ))}
            </div>
          </div>

          {/* EVENT TYPES */}
          <div className="border-t border-stone-100 pt-3 mt-3">
            <div className="px-1 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Event Type</span>
            </div>
            <div className="space-y-1 px-1">
              {AMENITY_FILTERS.eventTypes.map((type) => (
                <label key={type} className="flex items-center gap-2 px-1 py-1 hover:bg-stone-50 rounded cursor-pointer group">
                  <Checkbox
                    checked={filters.selectedEventTypes.includes(type)}
                    onCheckedChange={() => toggleEventType(type)}
                    className="h-3.5 w-3.5"
                  />
                  <span className="text-[11px] text-stone-600 group-hover:text-stone-800 transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* LOCATIONS */}
          <div className="border-t border-stone-100 pt-3 mt-3">
            <div className="px-1 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Location</span>
            </div>

            {/* Location search */}
            <div className="relative px-1 mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-stone-400" />
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search cities..."
                className="w-full pl-8 pr-3 py-1.5 text-[11px] border border-stone-200 rounded-md bg-white placeholder-stone-400 focus:outline-none focus:border-stone-400"
              />
            </div>

            {/* Neighborhoods */}
            <div className="px-1 mb-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Milwaukee Neighborhoods</span>
              <div className="flex flex-wrap gap-1">
                {LOCATION_FILTERS.neighborhoods.map((n) => (
                  <button
                    key={n}
                    onClick={() => toggleLocation(n)}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                      filters.selectedLocations.includes(n)
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Nearby cities */}
            <div className="px-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Nearby Cities</span>
              <div className="flex flex-wrap gap-1">
                {displayedLocations.map((city) => (
                  <button
                    key={city}
                    onClick={() => toggleLocation(city)}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                      filters.selectedLocations.includes(city)
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {city.replace(', WI', '').replace(', IL', '')}
                  </button>
                ))}
              </div>
              {filteredLocations.length > 8 && (
                <button
                  onClick={() => setShowAllLocations(!showAllLocations)}
                  className="mt-1.5 text-[10px] text-stone-500 font-semibold hover:text-stone-700 transition-colors"
                >
                  {showAllLocations ? 'Show less' : `+${filteredLocations.length - 8} more cities`}
                </button>
              )}
            </div>
          </div>

          {/* AMENITIES */}
          <div className="border-t border-stone-100 pt-3 mt-3">
            <div className="px-1 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Features & Amenities</span>
            </div>
            <div className="space-y-0.5 px-1">
              {AMENITY_FILTERS.features.map((feature) => (
                <label key={feature} className="flex items-center gap-2 px-1 py-1 hover:bg-stone-50 rounded cursor-pointer group">
                  <Checkbox
                    checked={filters.selectedAmenities.includes(feature)}
                    onCheckedChange={() => toggleAmenity(feature)}
                    className="h-3.5 w-3.5"
                  />
                  <span className="text-[11px] text-stone-600 group-hover:text-stone-800 transition-colors">{feature}</span>
                </label>
              ))}
            </div>

            {/* Booking options */}
            <div className="mt-3 px-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Booking</span>
              <div className="space-y-0.5">
                {AMENITY_FILTERS.bookingOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 px-1 py-1 hover:bg-stone-50 rounded cursor-pointer group">
                    <Checkbox
                      checked={filters.selectedAmenities.includes(opt)}
                      onCheckedChange={() => toggleAmenity(opt)}
                      className="h-3.5 w-3.5"
                    />
                    <span className="text-[11px] text-stone-600 group-hover:text-stone-800 transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Parking */}
            <div className="mt-3 px-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Parking</span>
              <div className="space-y-0.5">
                {AMENITY_FILTERS.amenities.filter(a => a.includes('Parking')).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 px-1 py-1 hover:bg-stone-50 rounded cursor-pointer group">
                    <Checkbox
                      checked={filters.selectedAmenities.includes(opt)}
                      onCheckedChange={() => toggleAmenity(opt)}
                      className="h-3.5 w-3.5"
                    />
                    <span className="text-[11px] text-stone-600 group-hover:text-stone-800 transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Music */}
            <div className="mt-3 px-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Music</span>
              <div className="space-y-0.5">
                {AMENITY_FILTERS.musicTypes.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 px-1 py-1 hover:bg-stone-50 rounded cursor-pointer group">
                    <Checkbox
                      checked={filters.selectedAmenities.includes(opt)}
                      onCheckedChange={() => toggleAmenity(opt)}
                      className="h-3.5 w-3.5"
                    />
                    <span className="text-[11px] text-stone-600 group-hover:text-stone-800 transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom spacer */}
          <div className="h-8" />
        </div>
      </ScrollArea>
    </div>
  )
}
