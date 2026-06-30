'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronRight, ChevronDown, Star, MapPin, Filter, X,
  ArrowUpDown, Check, Shield, Clock, SlidersHorizontal, Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
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
import type { VendorSearchResult } from '@/hooks/use-search-vendors'
import {
  UNIVERSAL_FILTERS,
  NAV_CATEGORIES,
  NEIGHBORHOODS_BY_AREA,
  type FilterDef,
  type NavCategory,
} from '@/lib/directory-filter-data'

/* ────────────────────────────────────────────────────────────
   Props
   ──────────────────────────────────────────────────────────── */
interface CategoryDirectoryClientProps {
  initialVendors: VendorSearchResult[]
  initialCategoryKey: string
  initialSubKey?: string
  initialSubLabel?: string
  categoryData?: NavCategory
}

/* ────────────────────────────────────────────────────────────
   Sort types
   ──────────────────────────────────────────────────────────── */
type SortOption = 'recommended' | 'rating' | 'price_low' | 'price_high'

/* ────────────────────────────────────────────────────────────
   Filter Sidebar Section (collapsible)
   ──────────────────────────────────────────────────────────── */
function FilterGroup({
  filter,
  activeValues,
  onToggle,
}: {
  filter: FilterDef
  activeValues: string[]
  onToggle: (key: string, value: string) => void
}) {
  const [open, setOpen] = useState(true)

  if (filter.type === 'toggle') {
    const isActive = activeValues.includes(filter.key)
    return (
      <div className="flex items-center justify-between py-1.5">
        <span className="text-sm text-gray-700">{filter.label}</span>
        <button
          onClick={() => onToggle(filter.key, filter.key)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isActive ? 'bg-black' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isActive ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    )
  }

  if (filter.type === 'price_range' || filter.type === 'multi' || filter.type === 'single') {
    const options = filter.options ?? []
    return (
      <div className="py-1">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium text-gray-900">{filter.label}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div className="mt-2 space-y-1.5">
            {options.map((opt) => {
              const checked = activeValues.includes(opt.value)
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => onToggle(filter.key, opt.value)}
                    className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                    {opt.label}
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (filter.type === 'rating') {
    const options = filter.options ?? []
    return (
      <div className="py-1">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium text-gray-900">{filter.label}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div className="mt-2 space-y-1.5">
            {options.map((opt) => {
              const checked = activeValues.includes(opt.value)
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => onToggle(filter.key, opt.value)}
                    className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                    {opt.label}
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (filter.type === 'neighborhood') {
    return <NeighborhoodFilter activeValues={activeValues} onToggle={onToggle} />
  }

  // slider / range_inputs - show simple min/max inputs for now
  if (filter.type === 'slider' || filter.type === 'range_inputs') {
    return (
      <div className="py-1">
        <span className="text-sm font-medium text-gray-900">{filter.label}</span>
        <div className="mt-2 flex items-center gap-2">
          <Input
            placeholder="Min"
            type="number"
            className="h-8 text-sm w-20"
          />
          <span className="text-gray-400">–</span>
          <Input
            placeholder="Max"
            type="number"
            className="h-8 text-sm w-20"
          />
          {filter.unit && (
            <span className="text-xs text-gray-400">{filter.unit}</span>
          )}
        </div>
      </div>
    )
  }

  return null
}

/* ────────────────────────────────────────────────────────────
   Neighborhood Filter with grouped areas
   ──────────────────────────────────────────────────────────── */
function NeighborhoodFilter({
  activeValues,
  onToggle,
}: {
  activeValues: string[]
  onToggle: (key: string, value: string) => void
}) {
  const [open, setOpen] = useState(true)
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set())

  const toggleArea = (area: string) => {
    setExpandedAreas((prev) => {
      const next = new Set(prev)
      if (next.has(area)) next.delete(area)
      else next.add(area)
      return next
    })
  }

  return (
    <div className="py-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-medium text-gray-900">Neighborhood</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="mt-2 space-y-1">
          {NEIGHBORHOODS_BY_AREA.map((area) => (
            <div key={area.area}>
              <button
                onClick={() => toggleArea(area.area)}
                className="flex items-center gap-1 w-full text-left py-0.5"
              >
                <ChevronDown
                  className={`w-3 h-3 text-gray-400 transition-transform ${
                    expandedAreas.has(area.area) ? 'rotate-180' : '-rotate-90'
                  }`}
                />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {area.area}
                </span>
              </button>
              {expandedAreas.has(area.area) && (
                <div className="ml-3 space-y-1 mt-0.5">
                  {area.items.map((n) => {
                    const checked = activeValues.includes(n)
                    return (
                      <label
                        key={n}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => onToggle('neighborhood', n)}
                          className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                          {n}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Filter Sidebar Content (shared between desktop & mobile)
   ──────────────────────────────────────────────────────────── */
function FilterSidebarContent({
  categoryData,
  activeFilters,
  onToggle,
  onClear,
  totalActiveCount,
}: {
  categoryData?: NavCategory
  activeFilters: Record<string, string[]>
  onToggle: (key: string, value: string) => void
  onClear: () => void
  totalActiveCount: number
}) {
  // Merge category filters + subcategory-specific filters + universal filters
  const categoryFilters = categoryData?.filters ?? []
  const allFilters = [...categoryFilters, ...UNIVERSAL_FILTERS]

  return (
    <div className="space-y-1">
      {/* Active filter badges */}
      {totalActiveCount > 0 && (
        <div className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Active Filters
            </span>
            <button
              onClick={onClear}
              className="text-xs text-gray-500 hover:text-black underline"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(activeFilters).map(([key, values]) =>
              values.map((val) => (
                <Badge
                  key={`${key}-${val}`}
                  variant="secondary"
                  className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200"
                  onClick={() => onToggle(key, val)}
                >
                  {val}
                  <X className="w-3 h-3" />
                </Badge>
              ))
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Filter groups */}
      <div className="space-y-3 pt-2">
        {allFilters.map((filter) => (
          <FilterGroup
            key={filter.key}
            filter={filter}
            activeValues={activeFilters[filter.key] ?? []}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Vendor Card
   ──────────────────────────────────────────────────────────── */
function VendorCard({ vendor }: { vendor: VendorSearchResult }) {
  return (
    <Link
      href={`/v/${vendor.slug}`}
      className="group block border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all"
    >
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {vendor.cover_url ? (
          <img
            src={vendor.cover_url}
            alt={vendor.business_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <MapPin className="w-8 h-8" />
          </div>
        )}
        {vendor.is_featured && (
          <Badge className="absolute top-2 left-2 bg-black text-white text-[10px]">
            Featured
          </Badge>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm truncate group-hover:underline">
          {vendor.business_name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs">
            {vendor.avg_rating?.toFixed(1) ?? '-'}
          </span>
          <span className="text-xs text-gray-400">
            ({vendor.review_count ?? 0})
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {vendor.price_range ?? ''}
          </span>
          <span className="text-xs text-gray-400 truncate max-w-[120px]">
            {vendor.neighborhood ?? ''}
          </span>
        </div>
        <div className="flex gap-1 mt-2">
          {vendor.is_verified && (
            <Badge
              variant="outline"
              className="text-[10px] border-gray-300 py-0"
            >
              <Check className="w-2.5 h-2.5 mr-0.5" />
              Verified
            </Badge>
          )}
          {vendor.instant_booking && (
            <Badge
              variant="outline"
              className="text-[10px] border-gray-300 py-0"
            >
              <Clock className="w-2.5 h-2.5 mr-0.5" />
              Instant
            </Badge>
          )}
        </div>
      </div>
    </Link>
  )
}

/* ────────────────────────────────────────────────────────────
   Empty State
   ──────────────────────────────────────────────────────────── */
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">No vendors found</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-sm">
        {hasFilters
          ? 'Try adjusting your filters to see more results.'
          : 'There are no vendors in this category yet. Check back soon!'}
      </p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Main CategoryDirectoryClient Component
   ──────────────────────────────────────────────────────────── */
export function CategoryDirectoryClient({
  initialVendors,
  initialCategoryKey,
  initialSubKey,
  initialSubLabel,
  categoryData,
}: CategoryDirectoryClientProps) {
  const [vendors] = useState<VendorSearchResult[]>(initialVendors)
  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const ITEMS_PER_PAGE = 24

  // Resolve category and subcategory metadata
  const category = categoryData ?? NAV_CATEGORIES.find((c) => c.key === initialCategoryKey)
  const subcategory = category?.subcategories.find(
    (s) => s.filterSchemaKey === initialSubKey
  )
  const categoryLabel = category?.label ?? initialCategoryKey
  const subLabel = initialSubLabel ?? subcategory?.label
  const heading = subLabel ? `${subLabel}` : categoryLabel

  // Count total active filters
  const totalActiveCount = Object.values(activeFilters).reduce(
    (sum, vals) => sum + vals.length,
    0
  )

  // Toggle a filter value
  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[key] ?? []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      if (next.length === 0) {
        const { [key]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: next }
    })
    setPage(1)
  }

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({})
    setPage(1)
  }

  // Sort vendors
  const sortedVendors = useMemo(() => {
    const sorted = [...vendors]
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0))
        break
      case 'price_low':
        sorted.sort(
          (a, b) => (a.price_starting_at ?? Infinity) - (b.price_starting_at ?? Infinity)
        )
        break
      case 'price_high':
        sorted.sort(
          (a, b) => (b.price_starting_at ?? 0) - (a.price_starting_at ?? 0)
        )
        break
      case 'recommended':
      default:
        // Featured first, then by rating
        sorted.sort((a, b) => {
          if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
          return (b.avg_rating ?? 0) - (a.avg_rating ?? 0)
        })
        break
    }
    return sorted
  }, [vendors, sortBy])

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedVendors.length / ITEMS_PER_PAGE))
  const paginatedVendors = sortedVendors.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  // Page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, page - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }, [page, totalPages])

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-black transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/directory"
              className="hover:text-black transition-colors"
            >
              Directory
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/directory/${initialCategoryKey}`}
              className={`hover:text-black transition-colors ${
                initialSubKey ? '' : 'text-black font-medium'
              }`}
            >
              {categoryLabel}
            </Link>
            {initialSubKey && subLabel && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-black font-medium">{subLabel}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-black">
              {heading}
            </h1>
            <Badge variant="secondary" className="text-sm">
              {vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'}
            </Badge>
          </div>
          {/* Subcategory pills if on category page */}
          {!initialSubKey && category && category.subcategories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.filterSchemaKey}
                  href={`/directory/${initialCategoryKey}/${sub.filterSchemaKey}`}
                  className="inline-block rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-black hover:bg-black hover:text-white transition-all"
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content: sidebar + grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-900">
                  Filters
                </span>
              </div>
              <FilterSidebarContent
                categoryData={category}
                activeFilters={activeFilters}
                onToggle={toggleFilter}
                onClear={clearFilters}
                totalActiveCount={totalActiveCount}
              />
            </div>
          </aside>

          {/* Main grid area */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden gap-1.5"
                    >
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
                    <div className="px-4 pb-6">
                      <FilterSidebarContent
                        categoryData={category}
                        activeFilters={activeFilters}
                        onToggle={toggleFilter}
                        onClear={clearFilters}
                        totalActiveCount={totalActiveCount}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-gray-500">
                  {sortedVendors.length} {sortedVendors.length === 1 ? 'result' : 'results'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as SortOption)}
                >
                  <SelectTrigger className="w-[160px] h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price_low">Price: Low–High</SelectItem>
                    <SelectItem value="price_high">Price: High–Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters bar (mobile) */}
            {totalActiveCount > 0 && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(activeFilters).map(([key, values]) =>
                    values.map((val) => (
                      <Badge
                        key={`${key}-${val}`}
                        variant="secondary"
                        className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200"
                        onClick={() => toggleFilter(key, val)}
                      >
                        {val}
                        <X className="w-3 h-3" />
                      </Badge>
                    ))
                  )}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-black underline ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Vendor cards grid */}
            {paginatedVendors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedVendors.map((vendor) => (
                  <VendorCard key={vendor.vendor_id} vendor={vendor} />
                ))}
              </div>
            ) : (
              <EmptyState hasFilters={totalActiveCount > 0} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="h-8"
                >
                  Previous
                </Button>
                {pageNumbers.map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(p)}
                    className={`h-8 w-8 p-0 ${
                      p === page
                        ? 'bg-black text-white hover:bg-black/80'
                        : ''
                    }`}
                  >
                    {p}
                  </Button>
                ))}
                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    <span className="px-1 text-gray-400">…</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(totalPages)}
                      className="h-8 w-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
