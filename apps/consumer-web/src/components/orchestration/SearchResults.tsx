'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Star, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { SURFACE_DATA } from '@/lib/surface-data'

interface Vendor {
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

export function SearchResults({ surface }: { surface?: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const what = searchParams.get('what') || ''
  const where = searchParams.get('where') || ''
  const from = searchParams.get('from') || ''
  const to = searchParams.get('to') || ''
  const price = searchParams.get('price') || ''
  const guests = searchParams.get('guests') || ''

  const surfaceData = surface ? SURFACE_DATA[surface] : null

  useEffect(() => {
    setLoading(true)
    setError('')

    const params = new URLSearchParams()
    if (what) params.set('q', what)
    if (where) {
      const parts = where.split(',').map(s => s.trim())
      if (parts[0]) params.set('city', parts[0])
      if (parts[1]) params.set('state', parts[1])
    }
    if (surface) {
      const surfaceToVertical: Record<string, string> = {
        'services': 'planning',
        'plan': 'planning',
        'things-to-do': 'activities',
        'food-drink': 'catering',
        'live-shows': 'tickets',
        'travel': 'lodging',
        'party': 'venues',
        'spaces': 'venues',
        'vendors': '',
      }
      const vertical = surfaceToVertical[surface] || ''
      if (vertical) params.set('vertical', vertical)
    }
    params.set('limit', '24')

    fetch(`/api/vendors?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        let results = data.vendors || []
        if (price && results.length > 0) {
          results = results.filter((v: Vendor) => {
            const tier = parseInt(v.price_range || '0')
            return tier === parseInt(price)
          })
        }
        setVendors(results)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load results. Please try again.')
        setLoading(false)
      })
  }, [what, where, surface, price])

  const handleOrchestrate = (vendor: Vendor) => {
    addItem({
      id: `booking-${vendor.vendor_id}-${Date.now()}`,
      type: 'booking',
      listing_id: null,
      vendor_id: vendor.vendor_id,
      name: vendor.business_name,
      image_url: vendor.cover_url,
      date: from || '',
      vendor_name: vendor.business_name,
      vendor_slug: vendor.slug,
      amount: vendor.price_starting_at || 0,
      category: vendor.category,
    })
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-midnight-slate/5 animate-pulse">
            <div className="h-56 bg-surface-container-low"></div>
            <div className="p-6 space-y-3">
              <div className="h-3 bg-surface-container-low rounded w-1/4"></div>
              <div className="h-5 bg-surface-container-low rounded w-3/4"></div>
              <div className="h-3 bg-surface-container-low rounded w-1/2"></div>
              <div className="h-4 bg-surface-container-low rounded w-full"></div>
              <div className="flex justify-between pt-4 border-t border-midnight-slate/5">
                <div className="h-8 bg-surface-container-low rounded w-20"></div>
                <div className="h-8 bg-surface-container-low rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-midnight-slate/60 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-midnight-slate text-white rounded-full font-label-md uppercase tracking-widest hover:bg-champagne-gold transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (vendors.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-6xl text-midnight-slate/20 mb-4">search_off</span>
        <h3 className="font-headline-sm text-headline-sm text-midnight-slate mb-2">No results found</h3>
        <p className="text-midnight-slate/50 mb-6">
          {what ? `No matches for "${what}"` : 'Try adjusting your search'}{where ? ` in ${where}` : ''}
        </p>
        <Link
          href={surface ? `/${surface}` : '/'}
          className="px-6 py-3 border border-midnight-slate/20 rounded-full font-label-md uppercase tracking-widest text-midnight-slate hover:bg-midnight-slate hover:text-white transition-all"
        >
          Clear Search
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Results count */}
      <div className="flex justify-between items-baseline mb-6">
        <div>
          <h2 className="font-display-lg text-2xl text-midnight-slate">
            {what || 'All Results'}
          </h2>
          <p className="text-midnight-slate/50 text-sm mt-1">
            {vendors.length} {vendors.length === 1 ? 'result' : 'results'}
            {where ? ` in ${where}` : ''}
          </p>
        </div>
      </div>

      {/* Vendor grid — matches the target card design:
          image + badges (top), content panel (middle), price + buttons (bottom) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {vendors.map((vendor) => {
          // Build "City, State" location text — not street address
          const locationText = where || [vendor.neighborhood, vendor.address].filter(Boolean).join(', ')
          // Surface label for the gold category (e.g., "FOOD DRINK", "TRAVEL")
          const surfaceLabel = surfaceData?.title?.toUpperCase().replace(/&/g, '').replace(/\s+/g, ' ').trim() || 'RESULTS'
          return (
            <div
              key={vendor.vendor_id}
              className="group bg-surface-container-low rounded-2xl overflow-hidden border border-midnight-slate/5 hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              {/* TOP: Image with badge (left) + rating circle (right).
                  Image container has rounded-t-2xl so its top corners match the
                  card's rounded-2xl — no sharp corners sticking out. */}
              <div className="relative h-56 overflow-hidden rounded-t-2xl">
                {vendor.cover_url ? (
                  <img src={vendor.cover_url} alt={vendor.business_name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-midnight-slate/10">image</span>
                  </div>
                )}
                {/* Badge top-left */}
                {vendor.is_featured && (
                  <div className="absolute top-4 left-4 bg-midnight-slate text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Featured
                  </div>
                )}
                {/* Rating circle top-right */}
                {vendor.avg_rating && (
                  <div className="absolute top-4 right-4 bg-white text-midnight-slate text-sm font-bold w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-md">
                    <Star className="w-3 h-3 text-champagne-gold fill-champagne-gold" />
                    <span className="text-[10px] leading-none mt-0.5">{vendor.avg_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* MIDDLE: Content panel — gold label, SERIF title, location, description */}
              <div className="p-6 flex-grow flex flex-col">
                <p className="text-xs font-bold text-champagne-gold uppercase tracking-[0.2em] mb-2">
                  {surfaceLabel}
                </p>
                <h3 className="font-display-lg text-xl text-midnight-slate mb-2 leading-tight">
                  {vendor.business_name}
                </h3>
                {locationText && (
                  <p className="flex items-center gap-1 text-midnight-slate/50 text-xs mb-3">
                    <MapPin className="w-3 h-3 text-champagne-gold" />
                    {locationText}
                  </p>
                )}
                {vendor.bio && (
                  <p className="text-midnight-slate/60 text-sm line-clamp-2 mb-4 flex-grow">{vendor.bio}</p>
                )}
              </div>

              {/* BOTTOM: Price + Details + Orchestrate buttons */}
              <div className="px-6 pb-6 pt-2 border-t border-midnight-slate/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 mb-0.5">Price</p>
                    <p className="text-lg font-bold text-midnight-slate">
                      {vendor.price_starting_at ? `$${vendor.price_starting_at}` : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/v/${vendor.slug || vendor.vendor_id}`}
                      className="px-4 py-2.5 border border-midnight-slate/15 rounded-xl text-xs font-bold uppercase tracking-wider text-midnight-slate hover:bg-white transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleOrchestrate(vendor)}
                      className="px-4 py-2.5 bg-midnight-slate text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-champagne-gold hover:text-midnight-slate transition-colors flex items-center gap-1.5"
                    >
                      Orchestrate
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
