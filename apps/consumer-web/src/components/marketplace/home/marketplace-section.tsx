'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Star, MapPin, BadgeCheck, Search, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { getCategoryLabel } from '@/components/marketplace/common/vendor-card'
import { CATEGORIES } from '@/components/marketplace/common/category-card'
import type { VendorCardData } from '@/components/marketplace/common/vendor-card'

const PRICE_SIGNS: Record<string, string> = {
  dollar1: '$', dollar2: '$$', dollar3: '$$$', dollar4: '$$$$',
  $: '$', $$: '$$$', $$$: '$$$', $$$$: '$$$$',
}

export function MarketplaceSection() {
  const { navigateToVendor, navigateToCategory, navigateToSearch, setView } = useAppStore()
  const [localSearch, setLocalSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['vendors', 'marketplace', activeFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (activeFilter) params.set('category', activeFilter)
      params.set('limit', '9')
      const res = await fetch(`/api/vendors?${params.toString()}`)
      if (!res.ok) return { vendors: [], pagination: { total: 0 } }
      return res.json() as Promise<{ vendors: VendorCardData[]; pagination: { total: number } }>
    },
    staleTime: 15000,
  })

  const vendors = data?.vendors || []
  const total = data?.pagination?.total || 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (localSearch.trim()) {
      navigateToSearch(localSearch.trim())
    }
  }

  const FILTER_OPTIONS = [
    { label: 'All Businesses', value: '' },
    { label: 'Bars & Clubs', value: 'bar_club' },
    { label: 'Wedding Venues', value: 'wedding_venue' },
    { label: 'DJs', value: 'wedding_dj' },
    { label: 'Event Planners', value: 'wedding_planner' },
    { label: 'Photo Booths', value: 'photo_booth' },
    { label: 'Transportation', value: 'transportation' },
  ]

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: Business listing management CTA */}
        <div className="bg-slate-900 rounded-lg p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-[var(--font-playfair)]">
              Manage your free business listing
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md">
              Get found by Milwaukee couples. Update hours, photos, pricing - all for free. Claim your profile to unlock analytics.
            </p>
            <ul className="mt-3 space-y-1">
              {['Free directory listing', 'Analytics & lead tracking', 'Direct booking integration'].map(f => (
                <li key={f} className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-orange-400 rounded-full" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              onClick={() => setView('claim')}
            >
              <Plus className="size-4 mr-1.5" />
              List Free Listing
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold"
              onClick={() => setView('claim')}
            >
              Claim Your Profile
            </Button>
          </div>
        </div>

        {/* Marketplace Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-[var(--font-playfair)]">
              Milwaukee Marketplace
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Browsing <span className="font-semibold text-slate-700">{total}</span> premium matches across all verified county providers
            </p>
          </div>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold px-3 tracking-wider">
            DIRECT BOOKING READY
          </Badge>
        </div>

        {/* Search + Filters */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Bars, restaurants, DJs, wedding venues..."
                className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm focus-visible:ring-blue-500/20"
              />
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={activeFilter === opt.value ? 'default' : 'outline'}
                size="sm"
                className={`h-7 text-[10px] font-semibold tracking-wide rounded-md ${
                  activeFilter === opt.value
                    ? 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => {
                  setActiveFilter(opt.value)
                  if (opt.value) navigateToCategory(opt.value)
                }}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Vendor Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
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
        ) : vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vendors.map((vendor) => {
              const priceSign = PRICE_SIGNS[vendor.priceRange || ''] || '$$'
              return (
                <Card
                  key={vendor.id}
                  className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigateToVendor(vendor.id)}
                >
                  <div className="relative h-40 bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 overflow-hidden">
                    {vendor.coverUrl ? (
                      <img src={vendor.coverUrl} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-slate-200">{vendor.name.charAt(0)}</span>
                      </div>
                    )}
                    {vendor.isVerified && (
                      <Badge className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 border-0 tracking-wider">
                        ELITE PARTNER
                      </Badge>
                    )}
                    {vendor.isVerified && (
                      <div className="absolute top-2.5 right-2.5 bg-white rounded-full p-1 shadow-sm">
                        <BadgeCheck className="size-3.5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`size-3 ${s <= Math.round(vendor.avgRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                      <span className="text-[11px] text-slate-500 ml-1">{vendor.avgRating?.toFixed(1) || '0.0'} ({vendor.reviewCount})</span>
                      <span className="text-[10px] font-bold text-slate-400 ml-auto">{priceSign}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{vendor.name}</h3>
                    {vendor.address && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="size-3" />
                        {vendor.address}
                      </p>
                    )}
                    {vendor.tags && vendor.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {vendor.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-slate-50 text-slate-500 text-[9px] border-0 px-1.5 py-0">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full mt-3 h-8 text-[11px] font-semibold border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                      onClick={(e) => { e.stopPropagation(); navigateToVendor(vendor.id) }}
                    >
                      Explore Services
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="size-6 text-slate-400" />
            </div>
            <h3 className="text-base font-medium text-slate-900">No vendors found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setActiveFilter('')}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}


