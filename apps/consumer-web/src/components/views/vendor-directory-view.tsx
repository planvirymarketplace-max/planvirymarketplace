'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VendorCard, type VendorCardData, getCategoryLabel } from '@/components/marketplace/common/vendor-card'
import { CATEGORIES } from '@/components/marketplace/common/category-card'
import { useAppStore } from '@/lib/store'

export function VendorDirectoryView() {
  const { selectedCategory, searchQuery, selectCategory, setSearchQuery, navigateToCategory, navigateToSearch } = useAppStore()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [localCategory, setLocalCategory] = useState(selectedCategory || '')

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    setLocalCategory(selectedCategory || '')
  }, [selectedCategory])

  const { data, isLoading } = useQuery({
    queryKey: ['vendors', localCategory, localSearch],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (localCategory) params.set('category', localCategory)
      if (localSearch) params.set('search', localSearch)
      params.set('limit', '24')
      const res = await fetch(`/api/vendors?${params.toString()}`)
      if (!res.ok) return { vendors: [], pagination: { total: 0 } }
      return res.json() as Promise<{ vendors: VendorCardData[]; pagination: { total: number; page: number; totalPages: number } }>
    },
    staleTime: 15000,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigateToSearch(localSearch)
  }

  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      selectCategory(null)
      setLocalCategory('')
    } else {
      navigateToCategory(value)
      setLocalCategory(value)
    }
  }

  const clearFilters = () => {
    setLocalSearch('')
    setLocalCategory('')
    selectCategory(null)
    setSearchQuery('')
  }

  const hasFilters = localCategory || localSearch

  return (
    <div className="bg-[#F8F7F2] min-h-screen">
      {/* Directory Header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-[var(--font-playfair)]">
            {localCategory ? getCategoryLabel(localCategory) : 'All Vendors'}
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            {data?.pagination?.total != null
              ? `${data.pagination.total} vendor${data.pagination.total !== 1 ? 's' : ''} found`
              : 'Search Milwaukee\'s best event vendors'}
          </p>

          {/* Search + Filter Bar */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search by name or service..."
                  className="pl-9 h-10 bg-white border-slate-300 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                />
              </div>
            </form>

            <div className="flex gap-2">
              <Select value={localCategory || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-48 h-10 bg-white border-slate-300">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {localCategory && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
                  {getCategoryLabel(localCategory)}
                  <button onClick={() => handleCategoryChange('all')} className="ml-0.5 hover:text-blue-900">
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {localSearch && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
                  &ldquo;{localSearch}&rdquo;
                  <button onClick={() => { setLocalSearch(''); setSearchQuery('') }} className="ml-0.5 hover:text-blue-900">
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              <button
                onClick={clearFilters}
                className="text-[11px] text-slate-500 hover:text-slate-700 transition-colors font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 animate-pulse">
                <div className="h-40 bg-slate-100 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-8 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.vendors && data.vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {data.vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="size-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 font-[var(--font-playfair)]">No vendors found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              className="mt-4 border-slate-300 font-semibold"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
