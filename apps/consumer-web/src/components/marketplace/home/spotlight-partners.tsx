'use client'

import { useQuery } from '@tanstack/react-query'
import { Star, MapPin, BadgeCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'
import { getCategoryLabel } from '@/components/marketplace/common/vendor-card'
import type { VendorCardData } from '@/components/marketplace/common/vendor-card'

const PRICE_LABELS: Record<string, string> = {
  $: 'Budget Friendly',
  $$: 'Moderate',
  $$$: 'Premium Range',
  $$$$: 'Luxury',
  dollar1: 'Budget Friendly',
  dollar2: 'Moderate',
  dollar3: 'Premium Range',
  dollar4: 'Luxury',
}

const PRICE_SIGNS: Record<string, string> = {
  dollar1: '$',
  dollar2: '$$',
  dollar3: '$$$',
  dollar4: '$$$$',
}

export function SpotlightPartners() {
  const { navigateToVendor } = useAppStore()

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors', 'featured'],
    queryFn: async () => {
      const res = await fetch('/api/vendors?featured=true&limit=3')
      if (!res.ok) return []
      const data = await res.json()
      return (data.vendors || []) as VendorCardData[]
    },
    staleTime: 30000,
  })

  if (isLoading) {
    return (
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-[var(--font-playfair)]">
              Milwaukee Spotlight Partners
            </h2>
            <p className="mt-2 text-slate-500 text-sm">
              Premium, verified vendors handpicked for quality and reliability
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 animate-pulse">
                <div className="h-48 bg-slate-100 rounded-t-lg" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!vendors || vendors.length === 0) {
    // Show placeholder cards with mock data
    return (
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-[var(--font-playfair)]">
              Milwaukee Spotlight Partners
            </h2>
            <p className="mt-2 text-slate-500 text-sm">
              Premium, verified vendors handpicked for quality and reliability
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { cat: 'WEDDING VENUE', name: 'The Grand Milwaukee', price: '$$$', desc: 'Historic ballroom venue in the heart of downtown Milwaukee with stunning architecture and capacity for 400+ guests.', features: ['Capacity: 400+', 'Full-Service Bar', 'Bridal Suite'] },
              { cat: 'WEDDING DJ & LIGHTING', name: 'MKE Sound & Light', price: '$$', desc: 'Professional DJ and lighting services with state-of-the-art equipment and 15+ years of Milwaukee wedding experience.', features: ['15+ Years Experience', 'Custom Playlists', 'LED Uplighting'] },
              { cat: 'WEDDING PLANNER', name: 'Elegant Events MKE', price: '$$$', desc: 'Full-service wedding planning from concept to execution. Specializing in Milwaukee\'s finest venues and vendor coordination.', features: ['Day-Of Coordination', 'Full Planning', 'Vendor Management'] },
            ].map((card, i) => (
              <Card key={i} className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-slate-200 font-[var(--font-playfair)]">
                      {card.name.charAt(0)}
                    </span>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] font-bold px-2.5 py-1 border-0 tracking-wider">
                    {card.cat}
                  </Badge>
                  <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-sm">
                    <BadgeCheck className="size-4 text-blue-600" />
                  </div>
                </div>
                <div className="p-5">
                  {/* Rating + Price */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="size-3 text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">5.0 (24)</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider">{card.price} PREMIUM RANGE</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base font-[var(--font-playfair)]">{card.name}</h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{card.desc}</p>

                  <ul className="mt-3 space-y-1">
                    {card.features.map(f => (
                      <li key={f} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-blue-500 rounded-full" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs font-semibold">
                    Inquire & Reserve Date
                  </Button>
                  <p className="text-[9px] text-slate-400 text-center mt-2">Direct Booking Ready • Verified Listing</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-[var(--font-playfair)]">
            Milwaukee Spotlight Partners
          </h2>
          <p className="mt-2 text-slate-500 text-sm">
            Premium, verified vendors handpicked for quality and reliability
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => {
            const priceSign = PRICE_SIGNS[vendor.priceRange || ''] || vendor.priceRange || '$$'
            const priceLabel = PRICE_LABELS[vendor.priceRange || ''] || 'Moderate'
            return (
              <Card
                key={vendor.id}
                className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigateToVendor(vendor.id)}
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 overflow-hidden">
                  {vendor.coverUrl ? (
                    <img src={vendor.coverUrl} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-slate-200 font-[var(--font-playfair)]">
                        {vendor.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] font-bold px-2.5 py-1 border-0 tracking-wider uppercase">
                    {getCategoryLabel(vendor.category)}
                  </Badge>
                  {vendor.isVerified && (
                    <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-sm">
                      <BadgeCheck className="size-4 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`size-3 ${s <= Math.round(vendor.avgRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">{vendor.avgRating || '0.0'} ({vendor.reviewCount})</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider">{priceSign} {priceLabel.toUpperCase()}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base font-[var(--font-playfair)]">{vendor.name}</h3>
                  {vendor.address && (
                    <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="size-3" />
                      {vendor.address}
                    </p>
                  )}
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs font-semibold" onClick={(e) => { e.stopPropagation(); navigateToVendor(vendor.id) }}>
                    Inquire & Reserve Date
                  </Button>
                  <p className="text-[9px] text-slate-400 text-center mt-2">Direct Booking Ready • Verified Listing</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
