'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Search,
  Star,
  MapPin,
  CheckCircle,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Store,
  SlidersHorizontal,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useAppStore } from '@/lib/store'
import type { Vendor, Category } from '@/lib/types'

interface VendorListItem {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  logo?: string
  coverImage?: string
  city?: string
  state?: string
  rating: number
  reviewCount: number
  isVerified: boolean
  isFeatured: boolean
  isClaimed: boolean
  tags?: string
  specialties?: string
  productCount: number
  totalReviewCount: number
}

interface VendorsResponse {
  vendors: VendorListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface CategoriesResponse {
  categories: Category[]
}

function FilterContent({
  category,
  categories,
  minRating,
  verifiedOnly,
  featuredOnly,
  sort,
  hasActiveFilters,
  onCategoryChange,
  onMinRatingChange,
  onVerifiedChange,
  onFeaturedChange,
  onSortChange,
  onClearFilters,
}: {
  category: string
  categories: Category[]
  minRating: number
  verifiedOnly: boolean
  featuredOnly: boolean
  sort: string
  hasActiveFilters: boolean
  onCategoryChange: (value: string) => void
  onMinRatingChange: (value: number) => void
  onVerifiedChange: (checked: boolean) => void
  onFeaturedChange: (checked: boolean) => void
  onSortChange: (value: string) => void
  onClearFilters: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Category</h3>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Rating</h3>
        <div className="space-y-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => onMinRatingChange(rating)}
              className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm transition-colors ${
                minRating === rating
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'hover:bg-muted'
              }`}
            >
              {rating === 0 ? (
                'Any rating'
              ) : (
                <>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span>{rating}+</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="verified-filter" className="text-sm font-medium cursor-pointer">
            Verified Only
          </Label>
          <Switch
            id="verified-filter"
            checked={verifiedOnly}
            onCheckedChange={onVerifiedChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="featured-filter" className="text-sm font-medium cursor-pointer">
            Featured Only
          </Label>
          <Switch
            id="featured-filter"
            checked={featuredOnly}
            onCheckedChange={onFeaturedChange}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Sort By</h3>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Newest</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  )
}

export function VendorDirectory() {
  const { navigate, searchQuery, setSearchQuery } = useAppStore()
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [sort, setSort] = useState('created')
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const queryParams = useMemo(() => {
    const params = new URLSearchParams()
    if (localSearch) params.set('search', localSearch)
    if (category && category !== 'all') params.set('category', category)
    if (featuredOnly) params.set('featured', 'true')
    if (verifiedOnly) params.set('verified', 'true')
    if (sort) params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', '12')
    return params.toString()
  }, [localSearch, category, featuredOnly, verifiedOnly, sort, page])

  const { data: vendorsData, isLoading } = useQuery<VendorsResponse>({
    queryKey: ['vendors', queryParams],
    queryFn: async () => {
      const res = await fetch(`/api/vendors?${queryParams}`)
      if (!res.ok) throw new Error('Failed to fetch vendors')
      return res.json()
    },
  })

  const { data: categoriesData } = useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      return res.json()
    },
  })

  const vendors = vendorsData?.vendors ?? []
  const pagination = vendorsData?.pagination
  const categories = categoriesData?.categories ?? []

  const filteredVendors = useMemo(() => {
    let result = vendors
    if (minRating > 0) {
      result = result.filter((v) => v.rating >= minRating)
    }
    return result
  }, [vendors, minRating])

  const handleSearch = (value: string) => {
    setLocalSearch(value)
    setSearchQuery(value)
    setPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    setPage(1)
  }

  const clearFilters = () => {
    setCategory('all')
    setVerifiedOnly(false)
    setFeaturedOnly(false)
    setMinRating(0)
    setSort('created')
    setLocalSearch('')
    setSearchQuery('')
    setPage(1)
  }

  const hasActiveFilters = category !== 'all' || verifiedOnly || featuredOnly || minRating > 0 || localSearch

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Explore Vendors</h1>
          <p className="text-muted-foreground mt-1">Discover trusted local businesses and services</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors, services, locations..."
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
          </div>

          {/* Mobile filter button */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden h-11 w-11 rounded-xl">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetTitle className="text-lg font-semibold mb-6">Filters</SheetTitle>
              <FilterContent
                category={category}
                categories={categories}
                minRating={minRating}
                verifiedOnly={verifiedOnly}
                featuredOnly={featuredOnly}
                sort={sort}
                hasActiveFilters={hasActiveFilters}
                onCategoryChange={handleCategoryChange}
                onMinRatingChange={(r) => { setMinRating(r); setPage(1) }}
                onVerifiedChange={(c) => { setVerifiedOnly(c); setPage(1) }}
                onFeaturedChange={(c) => { setFeaturedOnly(c); setPage(1) }}
                onSortChange={handleSortChange}
                onClearFilters={clearFilters}
              />
            </SheetContent>
          </Sheet>
        </motion.div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card className="bg-card border border-border rounded-xl p-5 sticky top-6">
              <div className="flex items-center gap-2 mb-5">
                <Filter className="h-4 w-4 text-emerald-600" />
                <h2 className="font-semibold text-sm">Filters</h2>
              </div>
              <FilterContent
                category={category}
                categories={categories}
                minRating={minRating}
                verifiedOnly={verifiedOnly}
                featuredOnly={featuredOnly}
                sort={sort}
                hasActiveFilters={hasActiveFilters}
                onCategoryChange={handleCategoryChange}
                onMinRatingChange={(r) => { setMinRating(r); setPage(1) }}
                onVerifiedChange={(c) => { setVerifiedOnly(c); setPage(1) }}
                onFeaturedChange={(c) => { setFeaturedOnly(c); setPage(1) }}
                onSortChange={handleSortChange}
                onClearFilters={clearFilters}
              />
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  `${pagination?.total ?? 0} vendor${pagination?.total !== 1 ? 's' : ''} found`
                )}
              </p>
            </div>

            {/* Vendor Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VendorCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredVendors.length === 0 ? (
              <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredVendors.map((vendor, i) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    index={i}
                    onClick={() => navigate('vendor-detail', { vendorId: vendor.id })}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className={`rounded-lg w-9 h-9 ${
                          page === pageNum ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                        }`}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  {pagination.totalPages > 5 && <span className="px-2 text-muted-foreground">...</span>}
                  {pagination.totalPages > 5 && (
                    <Button
                      variant={page === pagination.totalPages ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pagination.totalPages)}
                      className={`rounded-lg w-9 h-9 ${
                        page === pagination.totalPages ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                      }`}
                    >
                      {pagination.totalPages}
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="rounded-lg"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function VendorCard({ vendor, index, onClick }: { vendor: VendorListItem; index: number; onClick: () => void }) {
  const tags = vendor.tags ? vendor.tags.split(',').map((t) => t.trim()).filter(Boolean) : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 group"
        onClick={onClick}
      >
        {/* Cover gradient */}
        <div className="h-28 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 relative">
          {vendor.isFeatured && (
            <Badge className="absolute top-3 right-3 bg-amber-500 text-white border-0 text-[10px] px-2 py-0.5">
              Featured
            </Badge>
          )}
          {vendor.logo ? (
            <img
              src={vendor.logo}
              alt={vendor.name}
              className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl border-2 border-white object-cover bg-white shadow-sm"
            />
          ) : (
            <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl border-2 border-white bg-white shadow-sm flex items-center justify-center">
              <Store className="h-6 w-6 text-emerald-600" />
            </div>
          )}
        </div>

        <CardContent className="pt-8 pb-4 px-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground group-hover:text-emerald-700 transition-colors line-clamp-1">
              {vendor.name}
            </h3>
            {vendor.isVerified && (
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">({vendor.totalReviewCount} reviews)</span>
            {(vendor.city || vendor.state) && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {[vendor.city, vendor.state].filter(Boolean).join(', ')}
                </div>
              </>
            )}
          </div>

          {vendor.shortDescription && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {vendor.shortDescription}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
              {vendor.productCount} service{vendor.productCount !== 1 ? 's' : ''}
            </Badge>
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function VendorCardSkeleton() {
  return (
    <Card className="bg-card border border-border rounded-xl overflow-hidden">
      <Skeleton className="h-28" />
      <CardContent className="pt-8 pb-4 px-4">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-full mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ hasFilters, onClearFilters }: { hasFilters: boolean; onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
        <Store className="h-8 w-8 text-emerald-600" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">No vendors found</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        {hasFilters
          ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
          : 'There are no vendors available at the moment. Check back soon!'}
      </p>
      {hasFilters && (
        <Button variant="outline" onClick={onClearFilters} className="rounded-xl">
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
