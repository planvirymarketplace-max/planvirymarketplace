'use client'

import Link from 'next/link'
import { Star, MapPin, Phone, ShoppingCart, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MockVendor } from '@/lib/directory-filter-utils'

interface DirectoryVendorCardProps {
  vendor: MockVendor
}

export function DirectoryVendorCard({ vendor }: DirectoryVendorCardProps) {
  return (
    <Card className="group overflow-hidden border hover:shadow-lg transition-all duration-300">
      {/* Cover image placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-4xl font-bold text-stone-300 select-none">
            {vendor.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {vendor.vendorType === 'premium' && (
            <Badge className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 border-0">
              ⭐ Premium
            </Badge>
          )}
          {vendor.isInstantBooking && (
            <Badge className="bg-emerald-600 text-white text-[10px] font-medium px-2 py-0.5 border-0">
              Instant Book
            </Badge>
          )}
        </div>

        {/* Price indicator */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-stone-700 text-xs font-bold border-0 shadow-sm">
            {vendor.priceRange}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Category badge */}
        <Badge variant="secondary" className="text-[10px] font-medium mb-2">
          {vendor.categoryLabel}
        </Badge>

        {/* Business name */}
        <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {vendor.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= Math.round(vendor.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-stone-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({vendor.reviewCount} reviews)</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
          {vendor.description}
        </p>

        {/* Address */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground truncate">{vendor.address}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-1.5 mt-1">
          <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground">{vendor.phone}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            asChild
            size="sm"
            className="flex-1 h-9 text-xs font-semibold"
          >
            <Link href={`/v/${vendor.slug}`}>
              View Profile
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 text-xs font-semibold"
          >
            <Link href={`/v/${vendor.slug}`}>
              {vendor.isInstantBooking ? 'Instant Book' : 'Get Proposal'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
