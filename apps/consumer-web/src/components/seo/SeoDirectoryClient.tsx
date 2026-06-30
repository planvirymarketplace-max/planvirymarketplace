'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronRight, Star, Filter, X,
  ArrowUpDown, SlidersHorizontal,
  Building2, ArrowRight, Home, Search,
  ChevronDown, ChevronUp, MapPin, Navigation,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SeoSearchBar from '@/components/SeoSearchBar'
import { subcategoryFilters, type FilterGroup } from '@/data/taxonomy'
import type { SeoServicePattern } from '@/data/seo-pages'
import { SEO_LOCATIONS, type SeoLocation } from '@/data/seo-locations'

/* ────────────────────────────────────────────────────────────
   Vendor type (from /api/vendors)
   ──────────────────────────────────────────────────────────── */
interface VendorResult {
  vendor_id: string
  business_name: string
  slug: string
  cover_url: string | null
  avg_rating: number | null
  review_count: number | null
  price_range: string | null
  price_starting_at: number | null
  neighborhood: string | null
  is_featured: boolean
  is_verified: boolean
  instant_booking: boolean
  distance_miles: number | null
  bio: string | null
  address: string | null
  category: string | null
}

/* ────────────────────────────────────────────────────────────
   Props
   ──────────────────────────────────────────────────────────── */
interface SeoDirectoryClientProps {
  pattern: SeoServicePattern
  location: SeoLocation
  stateName: string
  canonicalVertical: string
  relatedPatterns: SeoServicePattern[]
  nearbyLocations: SeoLocation[]
  majorCities: SeoLocation[]
  initialVendors: VendorResult[]
}

type SortOption = 'recommended' | 'price_low' | 'price_high' | 'distance' | 'rating' | 'most_reviewed' | 'newest' | 'city_zip'

/* ────────────────────────────────────────────────────────────
   Get dynamic filters for this vertical
   ──────────────────────────────────────────────────────────── */
function getDynamicFilters(verticalSlug: string): FilterGroup[] {
  const filters: FilterGroup[] = []
  if (subcategoryFilters.byCategory[verticalSlug]) {
    filters.push(...subcategoryFilters.byCategory[verticalSlug])
  }
  return filters
}

/* ────────────────────────────────────────────────────────────
   Universal filter groups
   ──────────────────────────────────────────────────────────── */
const UNIVERSAL_FILTERS: FilterGroup[] = [
  {
    key: 'price_tier',
    label: 'Price Tier',
    type: 'checkbox',
    options: [
      { value: '$', label: '$' },
      { value: '$$', label: '$$' },
      { value: '$$$', label: '$$$' },
      { value: '$$$$', label: '$$$$' },
    ],
  },
  {
    key: 'distance',
    label: 'Distance',
    type: 'checkbox',
    options: [
      { value: '1', label: 'Within 1 mile' },
      { value: '5', label: 'Within 5 miles' },
      { value: '10', label: 'Within 10 miles' },
      { value: '25', label: 'Within 25 miles' },
      { value: '50', label: 'Within 50 miles' },
      { value: '50+', label: '50+ miles' },
    ],
  },
  {
    key: 'rating',
    label: 'Rating',
    type: 'checkbox',
    options: [
      { value: '4.5', label: '4.5+ stars' },
      { value: '4.0', label: '4.0+ stars' },
      { value: '3.5', label: '3.5+ stars' },
      { value: '3.0', label: '3.0+ stars' },
    ],
  },
  {
    key: 'availability',
    label: 'Availability',
    type: 'checkbox',
    options: [
      { value: 'open_now', label: 'Open now' },
      { value: 'instant_book', label: 'Instant Book only' },
    ],
  },
]

/* ────────────────────────────────────────────────────────────
   Collapsible filter section - NO scrollbar, accordion approach
   ──────────────────────────────────────────────────────────── */
function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-150 pb-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest">{title}</span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>
      {open && <div className="mt-1 space-y-1.5">{children}</div>}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Vendor Card - Yelp-style horizontal card
   ──────────────────────────────────────────────────────────── */
function VendorCard({ vendor, rank }: { vendor: VendorResult; rank: number }) {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-900 hover:shadow-[0_5px_15px_rgba(0,0,0,0.06)] transition-all">
      {/* Image */}
      <div className="w-full sm:w-56 h-48 sm:h-auto overflow-hidden relative shrink-0 bg-gray-100 border-r border-gray-100">
        {vendor.cover_url ? (
          <img src={vendor.cover_url} alt={vendor.business_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 min-h-[120px]">
            <span className="text-3xl font-black text-gray-300">{vendor.business_name.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div className="space-y-2">
          <h3 className="font-extrabold text-base text-gray-900 tracking-tight truncate leading-tight">
            <Link href={`/v/${vendor.slug}`} className="hover:underline">{rank}. {vendor.business_name}</Link>
          </h3>
          <div className="flex items-center gap-1 text-xs">
            <div className="flex text-orange-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(vendor.avg_rating ?? 0) ? 'text-orange-400 fill-orange-400' : 'text-gray-300 fill-transparent'}`} />
              ))}
            </div>
            <span className="font-black text-gray-900">{vendor.avg_rating?.toFixed(1) ?? '-'}</span>
            <span className="text-gray-400">({vendor.review_count ?? 0} reviews)</span>
          </div>
          <div className="text-[11px] font-bold text-gray-500 flex flex-wrap items-center gap-1.5">
            {vendor.category && (<><span className="text-gray-900">{vendor.category}</span><span>&middot;</span></>)}
            {vendor.address && (<><span className="text-gray-900">{vendor.address}</span><span>&middot;</span></>)}
            {vendor.neighborhood && (<span className="bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-md font-semibold text-[10.5px]">{vendor.neighborhood}</span>)}
          </div>
          {vendor.bio && (
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700 italic flex items-start gap-2.5 leading-relaxed font-semibold">
              &ldquo;{vendor.bio.length > 140 ? vendor.bio.slice(0, 140) + '...' : vendor.bio}&rdquo;
              <Link href={`/v/${vendor.slug}`} className="text-teal-600 hover:underline font-extrabold not-italic shrink-0">more</Link>
            </div>
          )}
          {vendor.is_verified && (
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="bg-gray-100 text-gray-700 text-[9.5px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">✓ Verified</span>
              {vendor.instant_booking && (<span className="bg-gray-100 text-gray-700 text-[9.5px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">✓ Instant Book</span>)}
              {vendor.is_featured && (<span className="bg-gray-100 text-gray-700 text-[9.5px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">★ Featured</span>)}
            </div>
          )}
        </div>
        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <Link href={`/v/${vendor.slug}`} className="text-xs font-black text-black hover:text-teal-600 tracking-wider uppercase flex items-center gap-1 group/link">
            View Profile <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform text-teal-600" />
          </Link>
          {vendor.instant_booking && (
            <Link href={`/v/${vendor.slug}`} className="bg-black hover:bg-teal-600 text-white text-xs font-black px-5 py-2 rounded-xl transition-all uppercase tracking-wider">Get Proposal</Link>
          )}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Empty State
   ──────────────────────────────────────────────────────────── */
function EmptyState({ hasFilters, title }: { hasFilters: boolean; title: string }) {
  return (
    <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
      <Building2 size={40} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-base font-black text-black mb-1">
        {hasFilters ? 'No vendors match your filters' : `No ${title} vendors listed yet`}
      </h3>
      <p className="text-xs text-gray-500 max-w-sm mx-auto">
        {hasFilters ? 'Try adjusting your filters to see more results.' : 'Be the first to list your business in this category.'}
      </p>
      {!hasFilters && (
        <Link href="/vendor/onboarding" className="mt-5 inline-flex items-center gap-2 text-xs bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors uppercase tracking-widest">
          Get Listed Free
        </Link>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────── */
export function SeoDirectoryClient({
  pattern,
  location,
  stateName,
  canonicalVertical,
  relatedPatterns,
  nearbyLocations,
  majorCities,
  initialVendors,
}: SeoDirectoryClientProps) {
  const [vendors, setVendors] = useState<VendorResult[]>(initialVendors)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)

  // ── Location input state ──
  const [locationInput, setLocationInput] = useState('')
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [locationDisplayName, setLocationDisplayName] = useState('')
  const locationInputRef = useRef<HTMLInputElement>(null)
  const locationSuggestionsRef = useRef<HTMLDivElement>(null)

  const dynamicFilters = useMemo(() => getDynamicFilters(canonicalVertical), [canonicalVertical])

  // Lookup map: filterKey + optionValue → human-readable option label
  const filterOptionLabels = useMemo(() => {
    const map = new Map<string, string>()
    for (const f of UNIVERSAL_FILTERS) {
      for (const opt of f.options) {
        map.set(`${f.key}:${opt.value}`, opt.label)
      }
    }
    for (const f of dynamicFilters) {
      for (const opt of f.options) {
        map.set(`${f.key}:${opt.value}`, opt.label)
      }
    }
    return map
  }, [dynamicFilters])

  const totalActiveCount = Object.values(activeFilters).reduce((sum, vals) => sum + vals.length, 0)

  // ── Location autocomplete (useMemo to avoid cascading renders) ──
  const locationSuggestions = useMemo(() => {
    if (!locationInput.trim()) return []
    const q = locationInput.toLowerCase().trim()
    return SEO_LOCATIONS.filter(
      (loc) =>
        loc.city.toLowerCase().startsWith(q) ||
        loc.displayName.toLowerCase().includes(q)
    ).slice(0, 10)
  }, [locationInput])

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        locationSuggestionsRef.current &&
        !locationSuggestionsRef.current.contains(e.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(e.target as Node)
      ) {
        setShowLocationSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectLocation = (loc: SeoLocation) => {
    setLocationDisplayName(loc.displayName)
    setLocationInput('')
    setShowLocationSuggestions(false)
    // Navigate to the same service pattern in the selected location
    window.location.href = `/seo/${pattern.slug}/${loc.slug}`
  }

  const clearLocation = () => {
    setLocationDisplayName('')
    setLocationInput('')
  }

  const handleNearMe = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        let closest = SEO_LOCATIONS[0]
        let minDist = Infinity
        for (const loc of SEO_LOCATIONS) {
          const d = Math.sqrt((loc.lat - latitude) ** 2 + (loc.lng - longitude) ** 2)
          if (d < minDist) {
            minDist = d
            closest = loc
          }
        }
        if (closest) selectLocation(closest)
      },
      () => { /* User denied geolocation - do nothing */ }
    )
  }

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[key] ?? []
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      if (next.length === 0) { const { [key]: _, ...rest } = prev; return rest }
      return { ...prev, [key]: next }
    })
  }

  const clearFilters = () => {
    setActiveFilters({})
    setPriceMin('')
    setPriceMax('')
    setVisibleCount(12)
  }

  // Re-fetch vendors when search/filters change
  useEffect(() => {
    async function fetchFiltered() {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('q', searchQuery || pattern.name)
        params.set('city', location.city)
        params.set('state', stateName)
        params.set('vertical', canonicalVertical)
        params.set('limit', '50')
        if (Object.keys(activeFilters).length > 0) {
          params.set('filters', JSON.stringify(activeFilters))
        }
        const res = await fetch(`/api/vendors?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setVendors(data.vendors ?? [])
        }
      } catch {
        // keep existing vendors
      } finally {
        setIsLoading(false)
      }
    }
    // Debounce search
    const timer = setTimeout(fetchFiltered, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, activeFilters, canonicalVertical, pattern.name, location.city, stateName])

  const filteredAndSortedVendors = useMemo(() => {
    let result = [...vendors]

    // Client-side filtering for fields we have
    if (activeFilters.instant_book?.includes('instant_book') || activeFilters.availability?.includes('instant_book')) {
      result = result.filter(v => v.instant_booking)
    }
    if (activeFilters.price_tier?.length) {
      result = result.filter(v => v.price_range ? activeFilters.price_tier!.some(tier => v.price_range!.includes(tier)) : false)
    }
    if (priceMin) {
      const min = Number(priceMin)
      if (!isNaN(min)) result = result.filter(v => (v.price_starting_at ?? 0) >= min)
    }
    if (priceMax) {
      const max = Number(priceMax)
      if (!isNaN(max)) result = result.filter(v => (v.price_starting_at ?? Infinity) <= max)
    }
    if (activeFilters.rating?.length) {
      const minRating = Math.min(...activeFilters.rating.map(Number))
      result = result.filter(v => (v.avg_rating ?? 0) >= minRating)
    }

    // Sort
    switch (sortBy) {
      case 'rating': result.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0)); break
      case 'price_low': result.sort((a, b) => (a.price_starting_at ?? Infinity) - (b.price_starting_at ?? Infinity)); break
      case 'price_high': result.sort((a, b) => (b.price_starting_at ?? 0) - (a.price_starting_at ?? 0)); break
      case 'distance': result.sort((a, b) => (a.distance_miles ?? 999) - (b.distance_miles ?? 999)); break
      case 'most_reviewed': result.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0)); break
      case 'city_zip': result.sort((a, b) => (a.neighborhood ?? '').localeCompare(b.neighborhood ?? '')); break
      default: result.sort((a, b) => { if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1; return (b.avg_rating ?? 0) - (a.avg_rating ?? 0) }); break
    }
    return result
  }, [vendors, sortBy, activeFilters, priceMin, priceMax])

  const displayedVendors = filteredAndSortedVendors.slice(0, visibleCount)
  const hasMore = filteredAndSortedVendors.length > visibleCount

  // Build page title parts
  const serviceLabel = pattern.name.replace(/\s+(In|Near|By)$/, '').trim()
  const preposition = pattern.type === 'near' ? 'near' : 'in'
  const pageTitle = `${serviceLabel} ${location.displayName}`

  /* ── Render filter sections (shared between desktop & mobile) ── */
  const renderFilterSections = () => (
    <>
      {/* Price Range */}
      <FilterSection key="price_range" title="Price Range" defaultOpen={true}>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">$</span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              className="w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black"
            />
          </div>
          <span className="text-xs text-gray-400">–</span>
          <div className="flex-1 relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">$</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              className="w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </FilterSection>

      {/* Universal Filters - start collapsed to avoid scrollbar */}
      {UNIVERSAL_FILTERS.map((filter) => (
        <FilterSection key={filter.key} title={filter.label} defaultOpen={false}>
          <div className="space-y-1.5">
            {filter.options.map((opt) => {
              const checked = (activeFilters[filter.key] ?? []).includes(opt.value)
              return (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleFilter(filter.key, opt.value)}
                    className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                  <span className="text-xs text-gray-600 group-hover:text-black transition-colors font-medium">{opt.label}</span>
                </label>
              )
            })}
          </div>
        </FilterSection>
      ))}

      {/* Dynamic Category Filters */}
      {dynamicFilters.length > 0 && (
        <div className="border-t border-gray-200 pt-2 mt-1">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
            {serviceLabel} Filters
          </h3>
          {dynamicFilters.slice(0, 5).map((filter) => (
            <FilterSection key={filter.key} title={filter.label} defaultOpen={false}>
              <div className="space-y-1.5">
                {filter.options.slice(0, 8).map((opt) => {
                  const checked = (activeFilters[filter.key] ?? []).includes(opt.value)
                  return (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleFilter(filter.key, opt.value)}
                        className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                      />
                      <span className="text-xs text-gray-600 group-hover:text-black transition-colors font-medium">{opt.label}</span>
                    </label>
                  )
                })}
              </div>
            </FilterSection>
          ))}
        </div>
      )}
    </>
  )

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
              <Home size={13} />
              <span>Home</span>
            </Link>
            <ChevronRight size={13} className="text-gray-400" />
            <Link href={`/seo/${pattern.slug}`} className="hover:text-black transition-colors truncate max-w-[200px]">
              {serviceLabel}
            </Link>
            <ChevronRight size={13} className="text-gray-400" />
            <span className="text-black font-medium">{location.displayName}</span>
          </nav>
        </div>
      </div>

      {/* Search bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <SeoSearchBar initialService={serviceLabel} initialLocation={location.displayName} />
      </div>

      {/* Main layout: sidebar + content */}
      <div className="w-full py-6 flex flex-col lg:flex-row gap-6">

        {/* ══════ SIDEBAR - sticky, NO scrollbar, accordion-based ══════ */}
        <aside className="w-full lg:w-72 shrink-0 space-y-3 lg:sticky lg:top-20 lg:self-start px-4 sm:px-6 lg:pr-0">

          {/* ── Location Input (TOP of sidebar) ── */}
          {locationDisplayName ? (
            <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl px-3 py-2.5">
              <MapPin className="w-4 h-4 shrink-0 text-teal-600" />
              <span className="text-sm font-semibold truncate flex-1">{locationDisplayName}</span>
              <button onClick={clearLocation} className="text-teal-500 hover:text-teal-800 shrink-0" aria-label="Clear location">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <input
                ref={locationInputRef}
                type="text"
                value={locationInput}
                onChange={(e) => { setLocationInput(e.target.value); setShowLocationSuggestions(true) }}
                onFocus={() => setShowLocationSuggestions(true)}
                placeholder="Change city..."
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button
                onClick={handleNearMe}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1"
                aria-label="Use my location"
                title="Near me"
              >
                <Navigation className="w-4 h-4" />
              </button>
              {/* Autocomplete dropdown */}
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div ref={locationSuggestionsRef} className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {locationSuggestions.map((loc) => (
                    <button
                      key={loc.slug}
                      onClick={() => selectLocation(loc)}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-900">{loc.city}</span>
                      <span className="text-gray-400">,</span>
                      <span className="text-gray-500">{loc.state}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search bar in sidebar */}
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${serviceLabel} ${preposition} ${location.city}...`}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Filters header */}
          <div className="flex items-center justify-between border-b pb-2 border-gray-200">
            <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" /> Filters
            </h3>
            {totalActiveCount > 0 && (
              <button onClick={clearFilters} className="text-[10px] text-red-500 hover:underline font-extrabold uppercase tracking-widest">
                Clear All
              </button>
            )}
          </div>

          {/* Active filter badges */}
          {totalActiveCount > 0 && (
            <div className="flex flex-wrap gap-1.5 pb-1">
              {Object.entries(activeFilters).map(([key, values]) =>
                values.map((val) => (
                  <Badge key={`${key}-${val}`} variant="secondary" className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200" onClick={() => toggleFilter(key, val)}>
                    {filterOptionLabels.get(`${key}:${val}`) ?? val} <X className="w-3 h-3" />
                  </Badge>
                ))
              )}
            </div>
          )}

          {renderFilterSections()}

          {/* Location context */}
          <div className="border-t border-gray-200 pt-2 mt-1">
            <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Location
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{location.city}, {location.state}</p>
              {nearbyLocations.length > 0 && (
                <div className="space-y-0.5 max-h-40 overflow-y-auto">
                  {nearbyLocations.slice(0, 6).map(loc => (
                    <Link
                      key={loc.slug}
                      href={`/seo/${pattern.slug}/${loc.slug}`}
                      className="group flex items-center justify-between px-2 py-1.5 text-xs text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-colors"
                    >
                      <span className="truncate">{loc.displayName}</span>
                      <ChevronRight size={10} className="text-gray-300 group-hover:text-black shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CTA for vendors */}
          <div className="rounded-xl bg-black text-white p-5 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Own a business?</p>
            <p className="text-sm font-semibold">List as {serviceLabel} {preposition} {location.city}</p>
            <Link href="/vendor/onboarding" className="inline-block mt-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-100 transition-colors">
              Get Listed Free
            </Link>
          </div>
        </aside>

        {/* ══════ MAIN CONTENT ══════ */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 lg:pl-0">
          {/* Headline */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">
              {pageTitle}
            </h1>
            <p className="mt-2 text-sm text-gray-500 max-w-2xl">
              Browse verified {serviceLabel.toLowerCase()} providers {preposition} {location.displayName} on Planviry. Compare ratings, prices, and availability.
            </p>
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {/* Mobile filter sheet */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden gap-1.5">
                    <Filter className="w-4 h-4" />
                    Filters
                    {totalActiveCount > 0 && (<Badge className="ml-1 bg-black text-white text-[10px] h-5 w-5 p-0 flex items-center justify-center rounded-full">{totalActiveCount}</Badge>)}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader><SheetTitle className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" />Filters</SheetTitle></SheetHeader>
                  <div className="px-4 pb-6">
                    {/* Mobile location input */}
                    {locationDisplayName ? (
                      <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl px-3 py-2.5 mb-4">
                        <MapPin className="w-4 h-4 shrink-0 text-teal-600" />
                        <span className="text-sm font-semibold truncate flex-1">{locationDisplayName}</span>
                        <button onClick={clearLocation} className="text-teal-500 hover:text-teal-800 shrink-0" aria-label="Clear location">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative mb-4">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                        <input
                          ref={locationInputRef}
                          type="text"
                          value={locationInput}
                          onChange={(e) => { setLocationInput(e.target.value); setShowLocationSuggestions(true) }}
                          onFocus={() => setShowLocationSuggestions(true)}
                          placeholder="Change city..."
                          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                        />
                        <button onClick={handleNearMe} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1" aria-label="Use my location" title="Near me">
                          <Navigation className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="mb-4">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${serviceLabel}...`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    {renderFilterSections()}
                  </div>
                </SheetContent>
              </Sheet>
              <span className="text-sm text-gray-500">
                {isLoading ? 'Searching...' : `${filteredAndSortedVendors.length} result${filteredAndSortedVendors.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[170px] h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price_low">Price: Low–High</SelectItem>
                  <SelectItem value="price_high">Price: High–Low</SelectItem>
                  <SelectItem value="distance">Distance: Nearest</SelectItem>
                  <SelectItem value="rating">Rating: Highest</SelectItem>
                  <SelectItem value="most_reviewed">Most Reviewed</SelectItem>
                  <SelectItem value="city_zip">City / Zip</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vendor cards */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col sm:flex-row bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                  <div className="w-full sm:w-56 h-48 bg-gray-200" />
                  <div className="flex-1 p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedVendors.length > 0 ? (
            <div className="space-y-5">
              {displayedVendors.map((vendor, idx) => (
                <VendorCard key={vendor.vendor_id} vendor={vendor} rank={idx + 1} />
              ))}
            </div>
          ) : (
            <EmptyState hasFilters={totalActiveCount > 0} title={serviceLabel} />
          )}

          {/* Show More */}
          {!isLoading && hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="px-8"
              >
                Show More Vendors
              </Button>
            </div>
          )}

          {/* Related Searches */}
          {relatedPatterns.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4">
                Related Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedPatterns.map(rp => (
                  <Link
                    key={rp.slug}
                    href={`/seo/${rp.slug}/${location.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 hover:border-black hover:text-black transition-colors text-sm font-medium text-gray-600"
                  >
                    {rp.name.replace(/\s+(In|Near|By)\s*$/i, '')} {location.displayName}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Other cities in same state */}
          {nearbyLocations.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4">
                {serviceLabel} - Other Cities in {stateName}
              </h2>
              <div className="flex flex-wrap gap-2">
                {nearbyLocations.map(loc => (
                  <Link
                    key={loc.slug}
                    href={`/seo/${pattern.slug}/${loc.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 hover:border-black hover:text-black transition-colors text-sm font-medium text-gray-600"
                  >
                    {loc.displayName}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Major cities nationally (for "near" type pages) */}
          {majorCities.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4">
                {serviceLabel} - Major Cities
              </h2>
              <div className="flex flex-wrap gap-2">
                {majorCities.map(loc => (
                  <Link
                    key={loc.slug}
                    href={`/seo/${pattern.slug}/${loc.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 hover:border-black hover:text-black transition-colors text-sm font-medium text-gray-600"
                  >
                    {loc.displayName}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Browse in category CTA */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-wrap gap-3">
            <Link
              href={`/${canonicalVertical}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors text-sm uppercase tracking-wider"
            >
              Browse All in Category
            </Link>
            <Link
              href={`/book?loc=${encodeURIComponent(location.displayName)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 hover:border-black hover:text-black transition-colors font-bold text-sm text-gray-600"
            >
              All Vendors in {location.displayName}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
