'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Star,
  Filter,
  X,
  ArrowUpDown,
  SlidersHorizontal,
  Home,
  Search,
  MapPin,
  Navigation,
  ChevronDown,
  ChevronUp,
  Bed,
  Bath,
  Users,
  Heart,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import {
  Wifi,
  Waves,
  Car,
  UtensilsCrossed,
  Snowflake,
  Shirt,
  Tv,
  Thermometer,
  Dumbbell,
  PawPrint,
  Umbrella,
  Flame,
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
import {
  PROPERTY_TYPES,
  AMENITIES,
  POPULAR_DESTINATIONS,
  ratingLabel,
  type TravelProperty,
} from '@/data/travel-taxonomy'

const AMENITY_ICONS: Record<string, LucideIcon> = {
  Wifi,
  Waves,
  Car,
  UtensilsCrossed,
  Snowflake,
  Shirt,
  Tv,
  Thermometer,
  Dumbbell,
  PawPrint,
  Umbrella,
  Flame,
}

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Sort by: Recommended' },
  { value: 'price_low', label: 'Price: Low - High' },
  { value: 'price_high', label: 'Price: High - Low' },
  { value: 'rating', label: 'Rating: Highest' },
  { value: 'distance', label: 'Distance: Nearest' },
] as const

type SortOption = (typeof SORT_OPTIONS)[number]['value']

interface TravelSearchResultsProps {
  searchParams: {
    destination?: string
    from?: string
    to?: string
    travelers?: string
    category?: string
    type?: string
  }
  properties: TravelProperty[]
  /** Title used in headline and search placeholder */
  title?: string
  /** Breadcrumb items - last item is the current page */
  breadcrumbs?: { label: string; href?: string }[]
  /** City slug if showing destination page */
  citySlug?: string
}

/* ────────────────────────────────────────────────────────────
   Collapsible filter section
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
        <span className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest">
          {title}
        </span>
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
   Property card (Booking.com-style)
   ──────────────────────────────────────────────────────────── */
function PropertyCard({ property }: { property: TravelProperty }) {
  const [liked, setLiked] = useState(false)
  const ratingText = ratingLabel(property.rating)

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-black hover:shadow-[0_5px_15px_rgba(0,0,0,0.06)] transition-all">
      {/* Photo / gradient placeholder */}
      <Link
        href={`/travel/property/${property.slug}`}
        className="relative w-full sm:w-72 h-52 sm:h-auto overflow-hidden shrink-0 bg-gray-100 group"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${property.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {property.is_loved_by_guests && (
          <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-sm">
            Loved by Guests
          </span>
        )}
        <button
          type="button"
          aria-label={liked ? 'Remove from saved' : 'Save property'}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setLiked(!liked)
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${liked ? 'fill-[#e87461] text-[#e87461]' : 'text-gray-700'}`}
          />
        </button>
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
          {property.type}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-base sm:text-lg text-gray-900 tracking-tight leading-tight">
              <Link
                href={`/travel/property/${property.slug}`}
                className="hover:underline decoration-[#e87461] underline-offset-2"
              >
                {property.title}
              </Link>
            </h3>
          </div>

          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>
              {property.city}, {property.stateCode}
            </span>
            {property.distance_to_center && (
              <>
                <span className="text-gray-300">|</span>
                <span>{property.distance_to_center}</span>
              </>
            )}
            {property.distance_to_beach && (
              <>
                <span className="text-gray-300">|</span>
                <span>{property.distance_to_beach}</span>
              </>
            )}
          </p>

          <div className="flex items-center gap-3 text-[11px] font-bold text-gray-600 flex-wrap">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-gray-400" />
              {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-gray-400" />
              {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              {property.max_guests} guests
            </span>
          </div>

          {/* Amenities */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {property.amenities.slice(0, 6).map((amenity) => {
              const am = AMENITIES.find((a) => a.name === amenity)
              const Icon = am ? AMENITY_ICONS[am.icon] : null
              return (
                <span
                  key={amenity}
                  title={amenity}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gray-50 border border-gray-200 text-gray-600"
                >
                  {Icon ? <Icon className="w-3.5 h-3.5" /> : null}
                </span>
              )
            })}
            {property.amenities.length > 6 && (
              <span className="text-[10px] font-bold text-gray-500 ml-1">
                +{property.amenities.length - 6} more
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {property.short_description}
          </p>
        </div>

        {/* Bottom: rating + price */}
        <div className="pt-3 mt-3 border-t border-gray-100 flex items-end justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="bg-[#003b95] text-white text-sm font-black px-2.5 py-1.5 rounded-md flex flex-col items-center leading-none">
              <span>{property.rating.toFixed(1)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-900 leading-tight">
                {ratingText}
              </span>
              <span className="text-[11px] text-gray-500 leading-tight">
                {property.review_count.toLocaleString()} reviews
              </span>
            </div>
          </div>
          <div className="text-right">
            {property.original_price_per_night && (
              <div className="text-xs text-gray-400 line-through">
                ${property.original_price_per_night}
              </div>
            )}
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-xl font-black text-black">
                ${property.price_per_night}
              </span>
              <span className="text-xs text-gray-500">/ night</span>
            </div>
            <Link
              href={`/travel/property/${property.slug}`}
              className="mt-1.5 inline-flex items-center gap-1.5 bg-[#e87461] hover:bg-[#d9634e] text-white text-xs font-black px-4 py-2 rounded-lg transition-colors uppercase tracking-widest"
            >
              View deal
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Empty state
   ──────────────────────────────────────────────────────────── */
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
      <Bed size={40} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-base font-black text-black mb-1">
        {hasFilters ? 'No properties match your filters' : 'No properties found'}
      </h3>
      <p className="text-xs text-gray-500 max-w-sm mx-auto">
        {hasFilters
          ? 'Try adjusting your filters to see more results.'
          : 'Try a different destination or check back soon.'}
      </p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Sidebar contents (shared between desktop + mobile sheet)
   ──────────────────────────────────────────────────────────── */
interface SidebarContentsProps {
  locationInput: string
  setLocationInput: (v: string) => void
  searchQuery: string
  setSearchQuery: (v: string) => void
  priceMin: string
  setPriceMin: (v: string) => void
  priceMax: string
  setPriceMax: (v: string) => void
  selectedTypes: string[]
  toggleType: (slug: string) => void
  selectedAmenities: string[]
  toggleAmenity: (slug: string) => void
  selectedRatings: string[]
  toggleRating: (v: string) => void
  selectedDistances: string[]
  toggleDistance: (v: string) => void
  clearFilters: () => void
  totalActiveCount: number
}

function SidebarContents(props: SidebarContentsProps) {
  const {
    locationInput,
    setLocationInput,
    searchQuery,
    setSearchQuery,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    selectedTypes,
    toggleType,
    selectedAmenities,
    toggleAmenity,
    selectedRatings,
    toggleRating,
    selectedDistances,
    toggleDistance,
    clearFilters,
    totalActiveCount,
  } = props

  return (
    <>
      {/* Location input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Set your city..."
          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Search bar */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search properties..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
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
          <button
            onClick={clearFilters}
            className="text-[10px] text-red-500 hover:underline font-extrabold uppercase tracking-widest"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active badges */}
      {totalActiveCount > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-2">
          {selectedTypes.map((s) => {
            const t = PROPERTY_TYPES.find((p) => p.slug === s)
            return (
              <Badge
                key={`type-${s}`}
                variant="secondary"
                className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200"
                onClick={() => toggleType(s)}
              >
                {t?.name ?? s} <X className="w-3 h-3" />
              </Badge>
            )
          })}
          {selectedAmenities.map((s) => {
            const a = AMENITIES.find((p) => p.slug === s)
            return (
              <Badge
                key={`amen-${s}`}
                variant="secondary"
                className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200"
                onClick={() => toggleAmenity(s)}
              >
                {a?.name ?? s} <X className="w-3 h-3" />
              </Badge>
            )
          })}
          {selectedRatings.map((s) => (
            <Badge
              key={`rate-${s}`}
              variant="secondary"
              className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200"
              onClick={() => toggleRating(s)}
            >
              {s}+ <X className="w-3 h-3" />
            </Badge>
          ))}
          {selectedDistances.map((s) => (
            <Badge
              key={`dist-${s}`}
              variant="secondary"
              className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200"
              onClick={() => toggleDistance(s)}
            >
              {s} mi <X className="w-3 h-3" />
            </Badge>
          ))}
          {priceMin && (
            <Badge
              variant="secondary"
              className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200"
              onClick={() => setPriceMin('')}
            >
              Min ${priceMin} <X className="w-3 h-3" />
            </Badge>
          )}
          {priceMax && (
            <Badge
              variant="secondary"
              className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200"
              onClick={() => setPriceMax('')}
            >
              Max ${priceMax} <X className="w-3 h-3" />
            </Badge>
          )}
        </div>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">
              $
            </span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black"
            />
          </div>
          <span className="text-xs text-gray-400">-</span>
          <div className="flex-1 relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">
              $
            </span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property Type">
        <div className="space-y-1.5">
          {PROPERTY_TYPES.map((type) => {
            const checked = selectedTypes.includes(type.slug)
            return (
              <label
                key={type.slug}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleType(type.slug)}
                  className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <span className="text-xs text-gray-600 group-hover:text-black transition-colors font-medium">
                  {type.name}
                </span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities" defaultOpen={false}>
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {AMENITIES.map((amenity) => {
            const checked = selectedAmenities.includes(amenity.slug)
            const Icon = AMENITY_ICONS[amenity.icon] ?? Star
            return (
              <label
                key={amenity.slug}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleAmenity(amenity.slug)}
                  className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <Icon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-600 group-hover:text-black transition-colors font-medium">
                  {amenity.name}
                </span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Star Rating */}
      <FilterSection title="Guest Rating" defaultOpen={false}>
        <div className="space-y-1.5">
          {[
            { value: '9', label: '9+ Wonderful' },
            { value: '8', label: '8+ Very Good' },
            { value: '7', label: '7+ Good' },
            { value: '6', label: '6+ Pleasant' },
          ].map((opt) => {
            const checked = selectedRatings.includes(opt.value)
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleRating(opt.value)}
                  className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <span className="text-xs text-gray-600 group-hover:text-black transition-colors font-medium">
                  {opt.label}
                </span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Distance */}
      <FilterSection title="Distance from center" defaultOpen={false}>
        <div className="space-y-1.5">
          {[
            { value: '1', label: 'Within 1 mile' },
            { value: '5', label: 'Within 5 miles' },
            { value: '10', label: 'Within 10 miles' },
            { value: '25', label: 'Within 25 miles' },
            { value: '50', label: '50+ miles' },
          ].map((opt) => {
            const checked = selectedDistances.includes(opt.value)
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleDistance(opt.value)}
                  className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <span className="text-xs text-gray-600 group-hover:text-black transition-colors font-medium">
                  {opt.label}
                </span>
              </label>
            )
          })}
        </div>
      </FilterSection>
    </>
  )
}

/* ────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────── */
export function TravelSearchResults({
  searchParams,
  properties,
  title = 'Search results',
  breadcrumbs,
  citySlug,
}: TravelSearchResultsProps) {
  // Filter state
  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationInput, setLocationInput] = useState(searchParams.destination ?? '')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.type ? [searchParams.type] : []
  )
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])
  const [selectedDistances, setSelectedDistances] = useState<string[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleType = (slug: string) => {
    setSelectedTypes((prev) =>
      prev.includes(slug) ? prev.filter((v) => v !== slug) : [...prev, slug]
    )
  }
  const toggleAmenity = (slug: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(slug) ? prev.filter((v) => v !== slug) : [...prev, slug]
    )
  }
  const toggleRating = (v: string) => {
    setSelectedRatings((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    )
  }
  const toggleDistance = (v: string) => {
    setSelectedDistances((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    )
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedAmenities([])
    setSelectedRatings([])
    setSelectedDistances([])
    setPriceMin('')
    setPriceMax('')
    setSearchQuery('')
    setLocationInput('')
  }

  const totalActiveCount =
    selectedTypes.length +
    selectedAmenities.length +
    selectedRatings.length +
    selectedDistances.length +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0)

  // Destination name lookup
  const destinationLabel = useMemo(() => {
    if (citySlug) {
      const dest = POPULAR_DESTINATIONS.find((d) => d.slug === citySlug)
      return dest ? `${dest.name}, ${dest.stateCode}` : title
    }
    if (searchParams.destination) {
      const q = searchParams.destination.toLowerCase()
      const dest = POPULAR_DESTINATIONS.find(
        (d) =>
          d.slug === q ||
          d.name.toLowerCase() === q ||
          d.state.toLowerCase() === q
      )
      return dest ? `${dest.name}, ${dest.stateCode}` : searchParams.destination
    }
    return title
  }, [citySlug, searchParams.destination, title])

  // Apply filters
  const filteredAndSorted = useMemo(() => {
    let result = [...properties]

    // Destination / location filter
    const locQuery = locationInput.trim().toLowerCase()
    if (locQuery) {
      result = result.filter(
        (p) =>
          p.city.toLowerCase().includes(locQuery) ||
          p.state.toLowerCase().includes(locQuery) ||
          p.stateCode.toLowerCase().includes(locQuery) ||
          p.title.toLowerCase().includes(locQuery)
      )
    }

    // Text search
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      )
    }

    // Price filter
    if (priceMin) {
      const min = Number(priceMin)
      if (!isNaN(min)) result = result.filter((p) => p.price_per_night >= min)
    }
    if (priceMax) {
      const max = Number(priceMax)
      if (!isNaN(max)) result = result.filter((p) => p.price_per_night <= max)
    }

    // Property type
    if (selectedTypes.length > 0) {
      result = result.filter((p) => selectedTypes.includes(p.typeSlug))
    }

    // Amenities
    if (selectedAmenities.length > 0) {
      result = result.filter((p) => {
        const propAmenitySlugs = p.amenities.map((name) => {
          const am = AMENITIES.find((a) => a.name === name)
          return am?.slug ?? ''
        })
        return selectedAmenities.every((s) => propAmenitySlugs.includes(s))
      })
    }

    // Rating
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings.map(Number))
      result = result.filter((p) => p.rating >= minRating)
    }

    // Distance (soft filter - mock parsing of "X mi to downtown")
    if (selectedDistances.length > 0) {
      const parseDist = (s: string): number | null => {
        const m = s.match(/(\d+(?:\.\d+)?)\s*mi/)
        return m ? Number(m[1]) : null
      }
      result = result.filter((p) => {
        const dStr = p.distance_to_center
        if (!dStr) return false
        if (dStr.toLowerCase().includes('in the')) return true // 0 distance
        const d = parseDist(dStr)
        if (d == null) return false
        return selectedDistances.some((sel) => {
          if (sel === '50') return d >= 50
          return d <= Number(sel)
        })
      })
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price_per_night - b.price_per_night)
        break
      case 'price_high':
        result.sort((a, b) => b.price_per_night - a.price_per_night)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'distance':
        result.sort((a, b) => {
          const parse = (s?: string) => {
            if (!s) return 999
            if (s.toLowerCase().includes('in the')) return 0
            const m = s.match(/(\d+(?:\.\d+)?)\s*mi/)
            return m ? Number(m[1]) : 999
          }
          return parse(a.distance_to_center) - parse(b.distance_to_center)
        })
        break
      default:
        // Recommended: loved-by-guests first, then rating
        result.sort((a, b) => {
          if (a.is_loved_by_guests !== b.is_loved_by_guests)
            return a.is_loved_by_guests ? -1 : 1
          return b.rating - a.rating
        })
    }

    return result
  }, [
    properties,
    locationInput,
    searchQuery,
    priceMin,
    priceMax,
    selectedTypes,
    selectedAmenities,
    selectedRatings,
    selectedDistances,
    sortBy,
  ])

  const sidebarProps: SidebarContentsProps = {
    locationInput,
    setLocationInput,
    searchQuery,
    setSearchQuery,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    selectedTypes,
    toggleType,
    selectedAmenities,
    toggleAmenity,
    selectedRatings,
    toggleRating,
    selectedDistances,
    toggleDistance,
    clearFilters,
    totalActiveCount,
  }

  // Default breadcrumbs
  const crumbs =
    breadcrumbs ?? [
      { label: 'Home', href: '/' },
      { label: 'Travel', href: '/travel' },
      { label: 'Search' },
    ]

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            {crumbs.map((item, i) => (
              <span key={`crumb-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} className="text-gray-400" />}
                {i === crumbs.length - 1 ? (
                  <span className="text-black font-medium">{item.label}</span>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-black transition-colors flex items-center gap-1"
                  >
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* SIDEBAR - desktop */}
        <aside className="w-full lg:w-72 shrink-0 space-y-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto hidden lg:block">
          <SidebarContents {...sidebarProps} />

          {/* Compare properties toggle */}
          <div className="rounded-xl bg-black text-white p-5 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Compare properties
            </p>
            <p className="text-sm font-semibold">
              Side-by-side stays to find the best fit.
            </p>
            <button
              type="button"
              className="mt-2 inline-block px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              Start comparing
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Headline */}
          <div className="mb-5">
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">
              {destinationLabel}
            </h1>
            <p className="mt-1.5 text-sm text-gray-500 max-w-2xl">
              {searchParams.from && searchParams.to
                ? `${searchParams.from} - ${searchParams.to}`
                : 'Pick your dates later - free cancellation on most stays.'}
              {searchParams.travelers ? ` - ${searchParams.travelers}` : ''}
            </p>
          </div>

          {/* Sort + count */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden gap-1.5">
                    <Filter className="w-4 h-4" />
                    Filters
                    {totalActiveCount > 0 && (
                      <Badge className="ml-1 bg-black text-white text-[10px] h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {totalActiveCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                    </SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-6 space-y-3">
                    <SidebarContents {...sidebarProps} />
                  </div>
                </SheetContent>
              </Sheet>
              <span className="text-sm text-gray-600 font-medium">
                <span className="font-black text-black">
                  {filteredAndSorted.length}
                </span>{' '}
                {filteredAndSorted.length === 1 ? 'property' : 'properties'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[220px] h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property cards */}
          {filteredAndSorted.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSorted.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <EmptyState hasFilters={totalActiveCount > 0} />
          )}
        </div>
      </div>
    </div>
  )
}
