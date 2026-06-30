'use client'

import { Star, MapPin, BadgeCheck, ArrowRight, Bookmark, Sparkles, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

export interface VendorCardData {
  id: string
  name: string
  slug: string
  category: string
  address?: string | null
  phone?: string | null
  website?: string | null
  logoUrl?: string | null
  coverUrl?: string | null
  priceRange?: string | null
  isFeatured: boolean
  isVerified: boolean
  isClaimed: boolean
  reviewCount?: number
  avgRating?: number
  serviceAreas?: string[]
  tags?: string[]
}

const CATEGORY_LABELS: Record<string, string> = {
  bar_club: 'Bar & Club',
  wedding_venue: 'Wedding Venue',
  bachelorette_activity: 'Bachelorette Activity',
  wedding_dj: 'Wedding DJ',
  wedding_band: 'Wedding Band',
  photo_booth: 'Photo Booth',
  transportation: 'Transportation',
  videography: 'Videography',
  wedding_planner: 'Wedding Planner',
  photography: 'Photography',
  catering: 'Catering',
  wedding_cake: 'Wedding Cake',
  florist: 'Florist',
  hair_makeup: 'Hair & Makeup',
  officiant: 'Officiant',
  dress_attire: 'Dress & Attire',
  favors_gifts: 'Favors & Gifts',
  jeweler: 'Jeweler',
  invitations_print: 'Invitations & Print',
  hotel_accommodations: 'Hotel & Accommodations',
  honeymoon_travel: 'Honeymoon & Travel',
  decor_rentals: 'Decor & Rentals',
}

const PRICE_SIGNS: Record<string, string> = {
  dollar1: '$', dollar2: '$$', dollar3: '$$$', dollar4: '$$$$',
  $: '$', $$: '$$', $$$: '$$$', $$$$: '$$$$',
}

export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] || slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function getPriceSign(priceRange?: string | null): string {
  if (!priceRange) return '$$'
  return PRICE_SIGNS[priceRange] || priceRange
}

export function VendorCard({ vendor }: { vendor: VendorCardData }) {
  const { navigateToVendor } = useAppStore()
  const priceSign = getPriceSign(vendor.priceRange)

  return (
    <Card
      className="group bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md hover:border-stone-300 transition-all duration-200 cursor-pointer"
      onClick={() => navigateToVendor(vendor.id)}
    >
      {/* Cover Image / Placeholder */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden">
        {vendor.coverUrl ? (
          <img
            src={vendor.coverUrl}
            alt={vendor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-stone-200">
              {vendor.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Badges */}
        {vendor.isVerified && (
          <Badge className="absolute top-2.5 left-2.5 bg-stone-900 text-white text-[9px] font-bold px-2 py-0.5 border-0 tracking-wider">
            ELITE
          </Badge>
        )}
        {vendor.isFeatured && (
          <Badge className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[9px] font-medium px-2 py-0.5 border-0">
            Featured
          </Badge>
        )}
        {vendor.isVerified && !vendor.isFeatured && (
          <div className="absolute top-2.5 right-2.5 bg-white rounded-full p-1 shadow-sm">
            <BadgeCheck className="size-3.5 text-orange-500" />
          </div>
        )}
        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation() }}
          className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-stone-400 hover:text-orange-500 shadow-sm transition-colors border border-white/50"
          aria-label="Save vendor"
        >
          <Bookmark size={12} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating + Price */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-3 ${
                  star <= Math.round(vendor.avgRating || 0)
                    ? 'text-orange-400 fill-orange-400'
                    : 'text-stone-200'
                }`}
              />
            ))}
            <span className="text-[11px] text-stone-500 ml-1">
              {vendor.avgRating?.toFixed(1) || '0.0'}
              {vendor.reviewCount != null && vendor.reviewCount > 0 && (
                <span className="text-stone-400"> ({vendor.reviewCount})</span>
              )}
            </span>
          </div>
          <span className="text-[10px] font-bold text-orange-500">{priceSign}</span>
        </div>

        <h3 className="font-bold text-stone-900 text-sm leading-tight group-hover:text-orange-600 transition-colors">
          {vendor.name}
        </h3>

        {vendor.address && (
          <div className="flex items-center gap-1 mt-1.5">
            <MapPin className="size-3 text-stone-400 shrink-0" />
            <span className="text-[11px] text-stone-400 truncate">{vendor.address}</span>
          </div>
        )}

        {vendor.tags && vendor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {vendor.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="bg-stone-50 text-stone-500 text-[9px] border-0 px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Explore CTA */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
          <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Vendor Profile</span>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
            Explore <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Card>
  )
}

// Featured vendor card (larger, horizontal layout) for directory view
export function FeaturedVendorCard({ vendor }: { vendor: VendorCardData }) {
  const { navigateToVendor } = useAppStore()
  const priceSign = getPriceSign(vendor.priceRange)

  return (
    <Card
      className="group bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md hover:border-stone-300 transition-all duration-200 cursor-pointer"
      onClick={() => navigateToVendor(vendor.id)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[5fr_7fr]">
        {/* Cover Image */}
        <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[200px] bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden">
          {vendor.coverUrl ? (
            <img
              src={vendor.coverUrl}
              alt={vendor.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl font-bold text-stone-200">
                {vendor.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {vendor.isFeatured && (
            <Badge className="absolute top-3 left-3 bg-orange-500 text-white text-[9px] font-bold px-2.5 py-1 border-0 uppercase tracking-wider">
              <Sparkles size={10} className="inline mr-1" />Featured
            </Badge>
          )}
          {vendor.isVerified && (
            <Badge className="absolute top-3 right-3 bg-stone-900 text-white text-[9px] font-bold px-2.5 py-1 border-0 uppercase tracking-wider">
              <ShieldCheck size={10} className="inline mr-1" />Verified
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 block mb-1">Featured Vendor</span>
            <h3 className="font-bold text-stone-900 text-xl leading-tight group-hover:text-orange-600 transition-colors">
              {vendor.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-4 ${
                      star <= Math.round(vendor.avgRating || 0)
                        ? 'text-orange-400 fill-orange-400'
                        : 'text-stone-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-stone-700">
                {vendor.avgRating?.toFixed(1) || '0.0'}
                <span className="text-stone-400 font-normal"> ({vendor.reviewCount || 0} reviews)</span>
              </span>
            </div>
            {vendor.address && (
              <div className="flex items-center gap-1.5 mt-2">
                <MapPin className="size-4 text-stone-400 shrink-0" />
                <span className="text-sm text-stone-500">{vendor.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">{priceSign}</span>
              <Badge variant="secondary" className="bg-stone-50 text-stone-500 text-[9px] border-0 px-2">
                {getCategoryLabel(vendor.category)}
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={(e) => { e.stopPropagation(); navigateToVendor(vendor.id) }}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors rounded-sm"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
