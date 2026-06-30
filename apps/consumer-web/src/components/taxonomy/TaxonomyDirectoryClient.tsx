'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronRight, Star, Filter, X,
  ArrowUpDown, SlidersHorizontal,
  Building2, ArrowRight, Home, Search,
  ChevronDown, ChevronUp, MapPin, Navigation,
} from 'lucide-react'
import { SEO_LOCATIONS, type SeoLocation } from '@/data/seo-locations'
import { useLocationStore } from '@/lib/store'
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
import type { ResolvedTaxonomyPage } from '@/lib/taxonomy-resolver'
import { subcategoryFilters, type FilterGroup } from '@/data/taxonomy'

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
interface TaxonomyDirectoryClientProps {
  page: ResolvedTaxonomyPage
  slugs: string[]
}

/* ────────────────────────────────────────────────────────────
   Sort types
   ──────────────────────────────────────────────────────────── */
type SortOption = 'recommended' | 'price_low' | 'price_high' | 'distance' | 'rating' | 'most_reviewed' | 'newest' | 'city_zip' | 'closest_date'

/* ────────────────────────────────────────────────────────────
   Get dynamic filters for current page (universal + category + subcategory)
   ──────────────────────────────────────────────────────────── */
function getDynamicFilters(page: ResolvedTaxonomyPage): FilterGroup[] {
  const filters: FilterGroup[] = []
  // Add category-specific filters
  if (page.parentCategorySlug && subcategoryFilters.byCategory[page.parentCategorySlug]) {
    filters.push(...subcategoryFilters.byCategory[page.parentCategorySlug])
  }
  // Add subcategory-specific filters
  if (page.currentSubSlug && subcategoryFilters.bySubcategory[page.currentSubSlug]) {
    filters.push(...subcategoryFilters.bySubcategory[page.currentSubSlug])
  }
  return filters
}

/* ────────────────────────────────────────────────────────────
   Universal filter groups (from Planviry Taxonomy doc)
   ──────────────────────────────────────────────────────────── */
const UNIVERSAL_FILTERS = [
  {
    key: 'price_tier',
    label: 'Price Tier',
    type: 'checkbox' as const,
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
    type: 'checkbox' as const,
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
    type: 'checkbox' as const,
    options: [
      { value: '4.5', label: '4.5+ stars' },
      { value: '4.0', label: '4.0+ stars' },
      { value: '3.5', label: '3.5+ stars' },
      { value: '3.0', label: '3.0+ stars' },
      { value: 'any', label: 'Any rating' },
    ],
  },
  {
    key: 'availability',
    label: 'Availability',
    type: 'checkbox' as const,
    options: [
      { value: 'open_now', label: 'Open now' },
      { value: 'open_today', label: 'Open today' },
      { value: 'this_weekend', label: 'Available this weekend' },
      { value: 'advance_booking', label: 'Advance booking required' },
      { value: 'closest_date', label: 'Closest Available on date' },
    ],
  },
  {
    key: 'instant_book',
    label: 'Instant Book',
    type: 'checkbox' as const,
    options: [
      { value: 'instant_book', label: 'Instant Book only' },
    ],
  },
  {
    key: 'accessibility',
    label: 'Accessibility',
    type: 'checkbox' as const,
    options: [
      { value: 'wheelchair', label: 'Wheelchair accessible' },
      { value: 'service_animals', label: 'Service animals allowed' },
      { value: 'hearing_loop', label: 'Hearing loop available' },
      { value: 'accessible_parking', label: 'Accessible parking' },
    ],
  },
  {
    key: 'cancellation',
    label: 'Cancellation Policy',
    type: 'checkbox' as const,
    options: [
      { value: 'free', label: 'Free cancellation' },
      { value: 'partial', label: 'Partial refund available' },
      { value: 'non_refundable', label: 'Non-refundable' },
    ],
  },
  {
    key: 'deposit',
    label: 'Deposit Required',
    type: 'checkbox' as const,
    options: [
      { value: 'no_deposit', label: 'No deposit' },
      { value: 'refundable', label: 'Deposit required (refundable)' },
      { value: 'non_refundable', label: 'Deposit required (non-refundable)' },
    ],
  },
]

/* ────────────────────────────────────────────────────────────
   Collapsible filter section (supports controlled + uncontrolled)
   ──────────────────────────────────────────────────────────── */
function FilterSection({
  title,
  children,
  defaultOpen = true,
  isOpen,
  onToggle,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  isOpen?: boolean
  onToggle?: () => void
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = isOpen !== undefined ? isOpen : internalOpen
  const toggle = onToggle ?? (() => setInternalOpen(!internalOpen))
  return (
    <div className="border-b border-gray-150 pb-3">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full py-1.5 text-left"
      >
        <span className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest">{title}</span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>
      {open && <div className="mt-1.5 space-y-1.5">{children}</div>}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Vendor Card (Yelp-style horizontal card)
   ──────────────────────────────────────────────────────────── */
function VendorCard({ vendor, rank }: { vendor: VendorResult; rank: number }) {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-900 hover:shadow-[0_5px_15px_rgba(0,0,0,0.06)] transition-all">
      {/* Image - NO badges on photos. Badges come from vendor portal only */}
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
          {/* Badges only appear when assigned from vendor portal - under description, never on photo */}
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
          <Link href={`/v/${vendor.slug}`} className="bg-black hover:bg-teal-600 text-white text-xs font-black px-5 py-2 rounded-xl transition-all uppercase tracking-wider">
            {vendor.instant_booking ? 'Instant Book' : 'Get Proposal'}
          </Link>
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
   Children Grid (subcategory navigation cards)
   ──────────────────────────────────────────────────────────── */
function ChildrenGrid({
  items,
  title,
}: {
  items: { label: string; slug: string; href: string; count?: number; description?: string }[]
  title?: string
}) {
  if (items.length === 0) return null
  return (
    <div className="mb-6">
      {title && (
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="group flex flex-col items-start p-4 bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-lg"
          >
            <span className="text-sm font-bold text-black group-hover:text-[#e87461] transition-colors truncate w-full">{item.label}</span>
            <div className="flex items-center gap-2 mt-1">
              {item.count !== undefined && (
                <span className="text-xs text-gray-400">{item.count.toLocaleString()} listings</span>
              )}
              <ArrowRight size={12} className="text-gray-300 group-hover:text-black transition-colors" />
            </div>
            {item.description && (
              <span className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Dimension Badge
   ──────────────────────────────────────────────────────────── */
function DimensionBadge({ dimension }: { dimension: string }) {
  const colors: Record<string, string> = {
    service: 'bg-amber-50 text-amber-700 border-amber-200',
    category: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    event: 'bg-violet-50 text-violet-700 border-violet-200',
    activity: 'bg-sky-50 text-sky-700 border-sky-200',
    role: 'bg-rose-50 text-rose-700 border-rose-200',
    hierarchy: 'bg-gray-50 text-gray-700 border-gray-200',
  }
  const labels: Record<string, string> = {
    service: 'By Service', category: 'By Category', event: 'By Event',
    activity: 'By Activity', role: 'By Role', hierarchy: 'Category',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${colors[dimension] || colors.hierarchy}`}>
      {labels[dimension] || dimension}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────── */
export function TaxonomyDirectoryClient({ page, slugs }: TaxonomyDirectoryClientProps) {
  const [vendors, setVendors] = useState<VendorResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  // ── Location state ──
  const [locationCity, setLocationCity] = useState('')
  const [locationState, setLocationState] = useState('')
  const [locationDisplayName, setLocationDisplayName] = useState('')
  const [locationInput, setLocationInput] = useState('')
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const locationSuggestionsRef = useRef<HTMLDivElement>(null)

  // ── Sync with global location store (set by navbar) ──
  const { location: globalLocation, lat: globalLat, lng: globalLng } = useLocationStore()
  useEffect(() => {
    if (globalLocation && !locationCity) {
      // Parse "City, ST" format from global store
      const parts = globalLocation.split(',')
      if (parts.length >= 2) {
        setLocationCity(parts[0].trim())
        setLocationState(parts[1].trim())
        setLocationDisplayName(globalLocation)
      } else {
        setLocationCity(globalLocation)
        setLocationDisplayName(globalLocation)
      }
    }
  }, [globalLocation, locationCity])

  // Dynamic filters for this page (category + subcategory specific)
  const dynamicFilters = useMemo(() => getDynamicFilters(page), [page])

  // All filter groups in sidebar order: price_range, then universal, then dynamic
  const allFilterGroups = useMemo(() => {
    const groups: { key: string; label: string }[] = [
      { key: 'price_range', label: 'Price Range' },
    ]
    for (const f of UNIVERSAL_FILTERS) {
      groups.push({ key: f.key, label: f.label })
    }
    for (const f of dynamicFilters) {
      groups.push({ key: f.key, label: f.label })
    }
    return groups
  }, [dynamicFilters])

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

  // Collapsed groups state - first 4 groups expanded by default, rest collapsed
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const collapsed = new Set<string>()
    for (let i = 4; i < allFilterGroups.length; i++) {
      collapsed.add(allFilterGroups[i].key)
    }
    return collapsed
  })

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // Progressive reveal: show 12 initially, 21 after scroll
  const [visibleCount, setVisibleCount] = useState(12)
  const ITEMS_INITIAL = 12
  const ITEMS_EXPANDED = 21

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
    setLocationCity(loc.city)
    setLocationState(loc.state)
    setLocationDisplayName(loc.displayName)
    setLocationInput('')
    setShowLocationSuggestions(false)
  }

  const clearLocation = () => {
    setLocationCity('')
    setLocationState('')
    setLocationDisplayName('')
    setLocationInput('')
  }

  const handleNearMe = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        // Find closest location from SEO_LOCATIONS
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

  // Fetch vendors on mount (with optional location filter)
  useEffect(() => {
    async function fetchVendors() {
      setIsLoading(true)
      try {
        const searchQ = searchQuery || page.title
        let url = `/api/vendors?q=${encodeURIComponent(searchQ)}&limit=50`
        if (locationCity) url += `&city=${encodeURIComponent(locationCity)}`
        if (locationState) url += `&state=${encodeURIComponent(locationState)}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setVendors(data.vendors ?? [])
        } else {
          setVendors([])
        }
      } catch {
        setVendors([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchVendors()
  }, [page.title, searchQuery, locationCity, locationState])

  // Reset pagination on filter/sort change
  useEffect(() => {
    setCurrentPage(1)
    setVisibleCount(ITEMS_INITIAL)
  }, [activeFilters, sortBy])

  const totalActiveCount = Object.values(activeFilters).reduce((sum, vals) => sum + vals.length, 0)

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[key] ?? []
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      if (next.length === 0) { const { [key]: _, ...rest } = prev; return rest }
      return { ...prev, [key]: next }
    })
  }

  const clearFilters = () => { setActiveFilters({}); setCurrentPage(1); setVisibleCount(ITEMS_INITIAL); setPriceMin(''); setPriceMax('') }

  const filteredAndSortedVendors = useMemo(() => {
    let result = [...vendors]

    // ── Hard-coded filters (exact property match) ──
    // Instant Book filter
    if (activeFilters.instant_book?.includes('instant_book')) result = result.filter(v => v.instant_booking)
    // Price tier
    if (activeFilters.price_tier?.length) {
      result = result.filter(v => v.price_range ? activeFilters.price_tier!.some(tier => v.price_range!.includes(tier)) : false)
    }
    // Price Min/Max
    if (priceMin) {
      const min = Number(priceMin)
      if (!isNaN(min)) result = result.filter(v => (v.price_starting_at ?? 0) >= min)
    }
    if (priceMax) {
      const max = Number(priceMax)
      if (!isNaN(max)) result = result.filter(v => (v.price_starting_at ?? Infinity) <= max)
    }
    // Rating
    if (activeFilters.rating?.length) {
      const minRating = Math.min(...activeFilters.rating.map(Number))
      result = result.filter(v => (v.avg_rating ?? 0) >= minRating)
    }
    // Distance
    if (activeFilters.distance?.length) {
      result = result.filter(v => {
        if (v.distance_miles == null) return true // soft filter: include if no data
        return activeFilters.distance!.some(d => {
          if (d === '50+') return v.distance_miles! > 50
          const miles = Number(d)
          return !isNaN(miles) && v.distance_miles! <= miles
        })
      })
    }

    // ── Dynamic / generic filters (soft filter approach) ──
    // Keys that are already handled above
    const handledKeys = new Set(['instant_book', 'price_tier', 'rating', 'distance', 'price_range'])

    // Helper: get all searchable text from a vendor
    const getVendorText = (v: VendorResult): string => {
      return [
        v.business_name,
        v.category,
        v.bio,
        v.address,
        v.neighborhood,
        v.price_range,
      ].filter(Boolean).join(' ').toLowerCase()
    }

    // Helper: normalize a filter value for matching (replace hyphens with spaces)
    const normalizeFilterVal = (val: string): string => {
      return val.replace(/-/g, ' ').toLowerCase()
    }

    // Process all remaining active filter groups
    for (const [filterKey, selectedValues] of Object.entries(activeFilters)) {
      if (handledKeys.has(filterKey) || !selectedValues?.length) continue

      result = result.filter(vendor => {
        const vendorText = getVendorText(vendor)

        // Soft filter: if the vendor has no searchable text at all, include them
        if (!vendorText.trim()) return true

        // Check if any selected value matches the vendor
        return selectedValues.some(filterVal => {
          const normalizedVal = normalizeFilterVal(filterVal)

          // 1. Exact substring match in any vendor text field
          if (vendorText.includes(normalizedVal)) return true

          // 2. For compound filter values, check if individual words match
          //    e.g., "full-service-planning" → check "full service planning"
          const words = normalizedVal.split(/\s+/)
          if (words.length > 1 && words.every(w => w.length > 2 && vendorText.includes(w))) return true

          // 3. Check category field specifically for category-related filters
          if (vendor.category?.toLowerCase().includes(normalizedVal)) return true

          // 4. Check bio field specifically (richer text, more likely to contain filter terms)
          if (vendor.bio?.toLowerCase().includes(normalizedVal)) return true

          return false
        })
      })
    }

    // ── Sort ──
    switch (sortBy) {
      case 'rating': result.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0)); break
      case 'price_low': result.sort((a, b) => (a.price_starting_at ?? Infinity) - (b.price_starting_at ?? Infinity)); break
      case 'price_high': result.sort((a, b) => (b.price_starting_at ?? 0) - (a.price_starting_at ?? 0)); break
      case 'distance': result.sort((a, b) => (a.distance_miles ?? 999) - (b.distance_miles ?? 999)); break
      case 'most_reviewed': result.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0)); break
      case 'newest': break // No date field to sort on, keep order
      case 'city_zip': result.sort((a, b) => (a.neighborhood ?? '').localeCompare(b.neighborhood ?? '')); break
      case 'closest_date': break // Requires availability data, keep current order
      default: result.sort((a, b) => { if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1; return (b.avg_rating ?? 0) - (a.avg_rating ?? 0) }); break
    }
    return result
  }, [vendors, sortBy, activeFilters, priceMin, priceMax])

  // Items to show based on progressive reveal + pagination
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedVendors.length / ITEMS_EXPANDED))
  const pageVendors = filteredAndSortedVendors.slice((currentPage - 1) * ITEMS_EXPANDED, currentPage * ITEMS_EXPANDED)
  const displayedVendors = pageVendors.slice(0, visibleCount)
  const hasMore = pageVendors.length > visibleCount

  // Determine grid items: on subcategory pages, use siblings; on main pages, use children
  const gridItems = page.isLeaf ? page.siblings : page.children

  // Handle search form submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already reactive via searchQuery state
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            {page.breadcrumbs.map((item, i) => (
              <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} className="text-gray-400" />}
                {i === page.breadcrumbs.length - 1 ? (
                  <span className="text-black font-medium">{item.label}</span>
                ) : item.href ? (
                  <Link href={item.href} className="hover:text-black transition-colors flex items-center gap-1">
                    {i === 0 && <Home size={13} />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="text-gray-500">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* Main layout: sidebar + content */}
      <div className="w-full py-6 flex flex-col lg:flex-row gap-6">

        {/* ══════ SIDEBAR ══════ */}
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
                placeholder="Set your city..."
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

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${page.title}...`}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Universal Filters - show on ALL category pages */}
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
            <div className="flex flex-wrap gap-1.5 pb-2">
              {Object.entries(activeFilters).map(([key, values]) =>
                values.map((val) => (
                  <Badge key={`${key}-${val}`} variant="secondary" className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200" onClick={() => toggleFilter(key, val)}>
                    {filterOptionLabels.get(`${key}:${val}`) ?? val} <X className="w-3 h-3" />
                  </Badge>
                ))
              )}
            </div>
          )}

          {/* Price Min/Max */}
          <FilterSection key='price_range' title='Price Range' isOpen={!collapsedGroups.has('price_range')} onToggle={() => toggleGroup('price_range')}>
            <div className='flex items-center gap-2'>
              <div className='flex-1 relative'>
                <span className='absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold'>$</span>
                <input
                  type='number'
                  min='0'
                  placeholder='Min'
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  className='w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black'
                />
              </div>
              <span className='text-xs text-gray-400'>–</span>
              <div className='flex-1 relative'>
                <span className='absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold'>$</span>
                <input
                  type='number'
                  min='0'
                  placeholder='Max'
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  className='w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black'
                />
              </div>
            </div>
          </FilterSection>

          {UNIVERSAL_FILTERS.map((filter) => (
            <FilterSection key={filter.key} title={filter.label} isOpen={!collapsedGroups.has(filter.key)} onToggle={() => toggleGroup(filter.key)}>
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

          {/* Dynamic Category + Subcategory Filters */}
          {dynamicFilters.length > 0 && (
            <div className="border-t border-gray-200 pt-3 mt-2">
              <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-2">
                {page.isLeaf ? page.title : page.title + ' Filters'}
              </h3>
              {dynamicFilters.map((filter) => (
                <FilterSection key={filter.key} title={filter.label} isOpen={!collapsedGroups.has(filter.key)} onToggle={() => toggleGroup(filter.key)}>
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
            </div>
          )}

          {/* CTA for vendors */}
          <div className="rounded-xl bg-black text-white p-5 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Own a business?</p>
            <p className="text-sm font-semibold">List in {page.title}</p>
            <Link href="/vendor/onboarding" className="inline-block mt-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-100 transition-colors">
              Get Listed Free
            </Link>
          </div>
        </aside>

        {/* ══════ MAIN CONTENT ══════ */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 lg:pl-0">
          {/* Headline - BIG and bold, no badge, no pills */}
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <DimensionBadge dimension={page.dimension} />
              <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">{page.title}</h1>
            </div>
            <p className="mt-2 text-sm text-gray-500 max-w-2xl">{page.description}</p>
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
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
                    {/* Mobile: Location input */}
                    <div className="mb-4">
                      {locationDisplayName ? (
                        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg px-3 py-2">
                          <MapPin className="w-4 h-4 shrink-0 text-teal-600" />
                          <span className="text-sm font-semibold truncate flex-1">{locationDisplayName}</span>
                          <button onClick={clearLocation} className="text-teal-500 hover:text-teal-800 shrink-0" aria-label="Clear location">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={locationInput}
                              onChange={(e) => { setLocationInput(e.target.value); setShowLocationSuggestions(true) }}
                              onFocus={() => setShowLocationSuggestions(true)}
                              placeholder="Set your city..."
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                            />
                          </div>
                          <button
                            onClick={handleNearMe}
                            className="p-2 text-gray-400 hover:text-black border border-gray-300 rounded-lg"
                            aria-label="Near me"
                            title="Near me"
                          >
                            <Navigation className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {showLocationSuggestions && locationSuggestions.length > 0 && (
                        <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {locationSuggestions.map((loc) => (
                            <button
                              key={loc.slug}
                              onClick={() => selectLocation(loc)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
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
                    {/* Mobile: Quick search */}
                    <div className="mb-4">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${page.title}...`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    {/* Mobile: Price Min/Max */}
                    <div className="mb-3">
                      <span className="text-xs font-bold text-gray-700 block mb-1.5">Price Range</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">$</span>
                          <input
                            type='number'
                            min='0'
                            placeholder='Min'
                            value={priceMin}
                            onChange={e => setPriceMin(e.target.value)}
                            className='w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black'
                          />
                        </div>
                        <span className='text-xs text-gray-400'>–</span>
                        <div className="flex-1 relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">$</span>
                          <input
                            type='number'
                            min='0'
                            placeholder='Max'
                            value={priceMax}
                            onChange={e => setPriceMax(e.target.value)}
                            className='w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black'
                          />
                        </div>
                      </div>
                    </div>
                    {/* Mobile: Universal Filters */}
                    {UNIVERSAL_FILTERS.map((filter) => (
                      <div key={filter.key} className="mb-3">
                        <span className="text-xs font-bold text-gray-700 block mb-1.5">{filter.label}</span>
                        <div className="space-y-1">
                          {filter.options.map((opt) => {
                            const checked = (activeFilters[filter.key] ?? []).includes(opt.value)
                            return (
                              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                                <Checkbox checked={checked} onCheckedChange={() => toggleFilter(filter.key, opt.value)} className="data-[state=checked]:bg-black data-[state=checked]:border-black" />
                                <span className="text-xs text-gray-600">{opt.label}</span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                    {/* Mobile: Dynamic Category + Subcategory Filters */}
                    {dynamicFilters.length > 0 && (
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">
                          {page.isLeaf ? page.title : page.title + ' Filters'}
                        </span>
                        {dynamicFilters.map((filter) => (
                          <div key={filter.key} className="mb-3">
                            <span className="text-xs font-bold text-gray-700 block mb-1.5">{filter.label}</span>
                            <div className="space-y-1">
                              {filter.options.map((opt) => {
                                const checked = (activeFilters[filter.key] ?? []).includes(opt.value)
                                return (
                                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox checked={checked} onCheckedChange={() => toggleFilter(filter.key, opt.value)} className="data-[state=checked]:bg-black data-[state=checked]:border-black" />
                                    <span className="text-xs text-gray-600">{opt.label}</span>
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                <SelectTrigger className="w-[190px] h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price_low">Price: Low–High</SelectItem>
                  <SelectItem value="price_high">Price: High–Low</SelectItem>
                  <SelectItem value="distance">Distance: Nearest</SelectItem>
                  <SelectItem value="rating">Rating: Highest</SelectItem>
                  <SelectItem value="most_reviewed">Most Reviewed</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="city_zip">City / Zip</SelectItem>
                  <SelectItem value="closest_date">Closest Available</SelectItem>
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
                <VendorCard key={vendor.vendor_id} vendor={vendor} rank={(currentPage - 1) * ITEMS_EXPANDED + idx + 1} />
              ))}
            </div>
          ) : (
            <EmptyState hasFilters={totalActiveCount > 0} title={page.title} />
          )}

          {/* Progressive reveal: "Show More" button */}
          {!isLoading && hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setVisibleCount(ITEMS_EXPANDED)}
                className="px-8"
              >
                Show More Vendors
              </Button>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-8">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => { setCurrentPage(currentPage - 1); setVisibleCount(ITEMS_INITIAL) }} className="h-8">Previous</Button>
              <span className="text-sm text-gray-500 px-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => { setCurrentPage(currentPage + 1); setVisibleCount(ITEMS_INITIAL) }} className="h-8">Next</Button>
            </div>
          )}

          {/* Browse Related / Subcategories — at the BOTTOM */}
          {gridItems.length > 0 && (
            <ChildrenGrid
              items={gridItems}
              title={page.isLeaf ? 'Browse Related' : 'Browse Subcategories'}
            />
          )}
        </div>
      </div>
    </div>
  )
}
