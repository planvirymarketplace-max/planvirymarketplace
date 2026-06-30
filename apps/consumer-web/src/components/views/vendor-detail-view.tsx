'use client'

import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, Star, MapPin, Phone, Globe, Mail,
  BadgeCheck, Share2, Heart, ImageIcon, Clock, DollarSign, ShieldCheck, Sparkles, ExternalLink, Send, CheckCircle
} from 'lucide-react'
import { getCategoryLabel } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { useState } from 'react'

interface VendorDetail {
  id: string
  name: string
  slug: string
  category: string
  address?: string | null
  phone?: string | null
  website?: string | null
  email?: string | null
  bio?: string | null
  logoUrl?: string | null
  coverUrl?: string | null
  priceRange?: string | null
  serviceAreas?: string[]
  tags?: string[]
  capacity?: string | null
  isFeatured?: boolean
  isVerified?: boolean
  isClaimed?: boolean
  isPublished?: boolean
  averageRating?: number
  reviewCount?: number
  gallery?: { id: string; storagePath: string; caption?: string | null }[]
  socials?: { id: string; platform: string; url: string }[]
  reviews?: { id: string; rating: number; body?: string | null; createdAt: string }[]
}

export function VendorDetailView() {
  const { selectedVendorId } = useAppStore()
  const [inquirySent, setInquirySent] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['vendor', selectedVendorId],
    queryFn: async () => {
      if (!selectedVendorId) return null
      const res = await fetch(`/api/vendors/${selectedVendorId}`)
      if (!res.ok) return null
      const json = await res.json()
      return json.vendor as VendorDetail | null
    },
    enabled: !!selectedVendorId,
    staleTime: 15000,
  })

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-stone-100 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-6 bg-stone-100 rounded w-1/3" />
              <div className="h-4 bg-stone-100 rounded w-2/3" />
              <div className="h-4 bg-stone-100 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="mx-auto size-16 text-stone-300 mb-4" />
          <h2 className="text-lg font-semibold text-stone-900">Vendor not found</h2>
          <p className="text-sm text-stone-500 mt-1">The vendor you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const avgRating = data.reviews && data.reviews.length > 0
    ? data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length
    : data.averageRating ?? 0

  return (
    <div className="bg-white min-h-screen">
      {/* ── Cover Banner ── */}
      <div className="relative h-56 sm:h-72 lg:h-80 w-full overflow-hidden bg-stone-900">
        {data.coverUrl ? (
          <img src={data.coverUrl} alt={data.name} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {data.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
              <Sparkles size={10} />
              Featured
            </span>
          )}
          {data.isVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold text-stone-900 backdrop-blur-sm">
              <BadgeCheck size={12} className="text-emerald-600" />
              Verified
            </span>
          )}
        </div>

        {/* Vendor name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest mb-3">
              {getCategoryLabel(data.category)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              {data.name}
            </h1>
            {data.address && (
              <div className="mt-2 flex items-center gap-1.5 text-white/80 text-sm">
                <MapPin size={14} />
                <span>{data.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Info Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-stone-50 rounded-2xl border border-stone-200 p-4">
              {/* Rating */}
              {avgRating > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-stone-900">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-stone-500">({data.reviewCount || 0})</span>
                </div>
              )}

              {/* Price */}
              {data.priceRange && (
                <div className="flex items-center gap-1.5 text-xs">
                  <DollarSign size={14} className="text-stone-400" />
                  <span className="font-bold text-stone-900">{data.priceRange}</span>
                </div>
              )}

              {/* Category */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="rounded-full bg-stone-900 text-white px-2.5 py-0.5 font-bold uppercase tracking-wider text-[9px]">
                  {getCategoryLabel(data.category)}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition">
                  <Share2 size={14} />
                  Share
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition">
                  <Heart size={14} />
                  Save
                </button>
              </div>
            </div>

            {/* Contact Cards - PROMINENT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.phone && (
                <a href={`tel:${data.phone}`} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 hover:border-stone-400 hover:shadow-sm transition group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 group-hover:bg-stone-200 transition">
                    <Phone size={18} className="text-stone-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Phone</p>
                    <p className="text-sm font-semibold text-stone-900">{data.phone}</p>
                  </div>
                </a>
              )}
              {data.address && (
                <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                    <MapPin size={18} className="text-stone-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Address</p>
                    <p className="text-sm font-semibold text-stone-900">{data.address}</p>
                  </div>
                </div>
              )}
              {data.website && (
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 hover:border-stone-400 hover:shadow-sm transition group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 group-hover:bg-stone-200 transition">
                    <Globe size={18} className="text-stone-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Website</p>
                    <p className="text-sm font-semibold text-stone-900 truncate">{data.website.replace(/^https?:\/\//, '')}</p>
                  </div>
                  <ExternalLink size={12} className="text-stone-400 ml-auto shrink-0" />
                </a>
              )}
              {data.email && (
                <a href={`mailto:${data.email}`} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 hover:border-stone-400 hover:shadow-sm transition group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 group-hover:bg-stone-200 transition">
                    <Mail size={18} className="text-stone-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email</p>
                    <p className="text-sm font-semibold text-stone-900 truncate">{data.email}</p>
                  </div>
                </a>
              )}
            </div>

            {/* About */}
            {data.bio && (
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">About</h2>
                <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">{data.bio}</p>
                {data.tags && data.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {data.tags.map((tag, i) => (
                      <span key={i} className="inline-flex rounded-full bg-stone-50 border border-stone-200 px-2.5 py-0.5 text-[10px] text-stone-600 font-medium">
                        #{tag.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Service Areas */}
            {data.serviceAreas && data.serviceAreas.length > 0 && (
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Service Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {data.serviceAreas.map((area) => (
                    <span key={area} className="inline-flex items-center gap-1 rounded-full bg-stone-50 border border-stone-200 px-3 py-1 text-xs font-medium text-stone-700">
                      <MapPin size={10} className="text-stone-400" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {data.reviews && data.reviews.length > 0 && (
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">Reviews</h2>
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-stone-900">{avgRating.toFixed(1)}</span>
                    <span className="text-xs text-stone-500">({data.reviews.length})</span>
                  </div>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {data.reviews.slice(0, 10).map((review) => (
                    <div key={review.id} className="border-b border-stone-100 pb-4 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-stone-400">{review.createdAt}</span>
                      </div>
                      {review.body && (
                        <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">{review.body}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* Quick Inquiry */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Send Inquiry</h3>
              <p className="text-[10px] text-stone-500 mb-4">Get a direct response from {data.name}</p>

              {inquirySent ? (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-xs font-semibold text-green-800">Inquiry sent!</span>
                </div>
              ) : (
                <button
                  onClick={() => setInquirySent(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-xs font-bold text-white hover:bg-stone-800 transition"
                >
                  <Send size={14} />
                  Contact This Vendor
                </button>
              )}
            </div>

            {/* Details */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Category</span>
                  <span className="font-semibold text-stone-900">{getCategoryLabel(data.category)}</span>
                </div>
                {data.priceRange && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Price Range</span>
                    <span className="font-semibold text-stone-900">{data.priceRange}</span>
                  </div>
                )}
                {data.capacity && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Capacity</span>
                    <span className="font-semibold text-stone-900">{data.capacity}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">Verified</span>
                  <span className="font-semibold text-stone-900">{data.isVerified ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Claimed</span>
                  <span className="font-semibold text-stone-900">{data.isClaimed ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Claim CTA */}
            {!data.isClaimed && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">Is this your business?</h3>
                <p className="text-[10px] text-amber-600 mb-3">Claim this profile to manage your listing and receive direct leads.</p>
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-700 transition">
                  <ShieldCheck size={14} />
                  Claim This Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
