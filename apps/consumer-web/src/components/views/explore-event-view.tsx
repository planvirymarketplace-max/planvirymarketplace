'use client'

import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  MapPin,
  Bookmark,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Loader2,
  Search,
  CheckCircle2,
  Circle,
  Heart,
  Briefcase,
  Cake,
  Wine,
  Award,
  GraduationCap,
  Users,
  Headphones,
  ExternalLink,
} from 'lucide-react'
import { Vendor, VendorCategory, getCategoryLabel } from '@/lib/types'
import {
  EVENT_TYPES,
  VENUE_TYPES,
  type SearchTerm,
} from '@/lib/seo-data'

// ─────────────────────────────────────────────────────────────────────────────
// Icon mapping for event types
// ─────────────────────────────────────────────────────────────────────────────

const EVENT_ICON_MAP: Record<string, React.ReactNode> = {
  Heart: <Heart className="h-5 w-5" />,
  Briefcase: <Briefcase className="h-5 w-5" />,
  Cake: <Cake className="h-5 w-5" />,
  Champagne: <Wine className="h-5 w-5" />,
  Award: <Award className="h-5 w-5" />,
  GraduationCap: <GraduationCap className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Headphones: <Headphones className="h-5 w-5" />,
}

// ─────────────────────────────────────────────────────────────────────────────
// Category checklist descriptions for event types
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_DESCRIPTIONS: Partial<Record<VendorCategory, string>> = {
  wedding_venue: 'Find the perfect setting for your event',
  wedding_dj: 'Keep the dance floor packed all night',
  photography: 'Capture every moment professionally',
  catering: 'Delicious food your guests will remember',
  florist: 'Beautiful floral arrangements and bouquets',
  makeup_hair: 'Look your absolute best on the big day',
  officiant: 'Someone to lead your ceremony with heart',
  decor_rentals: 'Transform the space with the right decor',
  transportation: 'Get everyone there safely and in style',
  wedding_planner: 'Professional coordination from start to finish',
  bakery: 'Custom cakes and sweet treats',
  photo_booth: 'Fun, interactive photo memories',
  lighting_av: 'Set the mood with professional lighting',
  videography: 'Cinematic video to relive the day',
  bachelorette_activity: 'Unique activities and entertainment',
  bar_club: 'Nightlife and bar events',
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────────────────

function VendorCardSkeleton() {
  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-stone-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-stone-100 rounded" />
        <div className="h-4 w-3/4 bg-stone-100 rounded" />
        <div className="flex gap-2">
          <div className="h-3 w-20 bg-stone-100 rounded" />
          <div className="h-3 w-10 bg-stone-100 rounded" />
        </div>
        <div className="h-3 w-full bg-stone-100 rounded" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface ExploreEventViewProps {
  eventTypeSlug: string
  onSelectVendor: (id: string) => void
  onOpenClaimModal: (vendor: Vendor) => void
  onOpenSignupModal: () => void
  onSelectCategory: (category: VendorCategory | 'all') => void
  onNavigateExplore: (slug: string) => void
  onNavigateExploreEvent: (slug: string) => void
  onNavigateExploreVenue: (slug: string) => void
  onNavigateDirectory: (category?: VendorCategory | 'all', search?: string) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Category Row Component
// ─────────────────────────────────────────────────────────────────────────────

function CategoryRow({
  category,
  vendors,
  isLoading,
  onSelectVendor,
  onViewAll,
}: {
  category: VendorCategory
  vendors: Vendor[]
  isLoading: boolean
  onSelectVendor: (id: string) => void
  onViewAll: () => void
}) {
  const label = getCategoryLabel(category)
  const description = CATEGORY_DESCRIPTIONS[category]

  return (
    <div className="py-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            {label}
          </h3>
          {description && (
            <p className="text-xs text-stone-500 mt-0.5 ml-7">{description}</p>
          )}
        </div>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition whitespace-nowrap"
        >
          View All <ArrowRight size={12} />
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <VendorCardSkeleton key={i} />
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <div className="bg-stone-50 rounded-xl border border-stone-100 p-6 text-center">
          <p className="text-xs text-stone-500">No {label.toLowerCase()} found yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vendors.slice(0, 4).map((vendor) => (
            <div
              key={vendor.id}
              onClick={() => onSelectVendor(vendor.id)}
              className="group bg-white border border-stone-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-stone-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={vendor.coverUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop&q=80'}
                  alt={vendor.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2">
                  <span className="rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm uppercase tracking-wider">
                    {getCategoryLabel(vendor.category)}
                  </span>
                </div>
                {vendor.isFeatured && (
                  <div className="absolute bottom-2 left-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                      <Sparkles size={8} />
                      Featured
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                {vendor.isVerified && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                    <ShieldCheck size={10} />
                    Verified
                  </span>
                )}
                <h4 className="font-semibold text-stone-900 text-sm leading-snug group-hover:text-red-600 transition-colors line-clamp-1 mt-0.5">
                  {vendor.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={10}
                        className={star <= Math.round(vendor.averageRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}
                      />
                    ))}
                    <span className="text-[10px] font-semibold text-stone-800 ml-0.5">{vendor.averageRating || '-'}</span>
                  </div>
                  <span className="text-[9px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">{vendor.priceRange || '$$'}</span>
                </div>
                {vendor.address && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-500">
                    <MapPin size={9} className="text-stone-400 flex-shrink-0" />
                    <span className="truncate">{vendor.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main ExploreEventView
// ─────────────────────────────────────────────────────────────────────────────

export function ExploreEventView({
  eventTypeSlug,
  onSelectVendor,
  onOpenClaimModal,
  onOpenSignupModal,
  onSelectCategory,
  onNavigateExplore,
  onNavigateExploreEvent,
  onNavigateExploreVenue,
  onNavigateDirectory,
}: ExploreEventViewProps) {
  const [categoryVendors, setCategoryVendors] = useState<Record<string, Vendor[]>>({})
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set())

  const eventType = EVENT_TYPES.find(et => et.slug === eventTypeSlug)

  // Fetch vendors for each category in this event type
  useEffect(() => {
    if (!eventType) return

    const fetchCategoryVendors = async (category: VendorCategory) => {
      setLoadingCategories(prev => new Set(prev).add(category))
      try {
        const params = new URLSearchParams({
          page: '1',
          limit: '4',
          published: 'true',
          category,
        })
        const res = await fetch(`/api/vendors?${params}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()

        const transformed: Vendor[] = (data.vendors || []).map((v: any) => ({
          id: v.id,
          slug: v.slug || v.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `vendor-${v.id}`,
          name: v.name || 'Unknown',
          category: v.category,
          address: v.address || undefined,
          phone: v.phone || undefined,
          website: v.website || undefined,
          email: v.email || undefined,
          bio: v.bio || undefined,
          logoUrl: v.logoUrl || undefined,
          coverUrl: v.coverUrl || undefined,
          priceRange: v.priceRange || '$$',
          serviceAreas: v.serviceAreas || [],
          tags: v.tags || [],
          isClaimed: v.isClaimed || false,
          isPublished: v.isPublished !== false,
          isFeatured: v.isFeatured || false,
          isVerified: v.isVerified !== false,
          source: 'seed' as const,
          averageRating: v.averageRating || 0,
          reviewCount: v.reviewCount || 0,
          galleryUrl: [],
          socials: [],
          packages: [],
          reviews: [],
          availability: [],
          depositPercent: 20,
        }))

        setCategoryVendors(prev => ({ ...prev, [category]: transformed }))
      } catch (err) {
        console.error(`Failed to fetch vendors for ${category}:`, err)
      } finally {
        setLoadingCategories(prev => {
          const next = new Set(prev)
          next.delete(category)
          return next
        })
      }
    }

    // Reset and fetch all categories
    setCategoryVendors({})
    eventType.vendorCategories.forEach(cat => {
      fetchCategoryVendors(cat)
    })
  }, [eventType])

  // Related event types (exclude current)
  const relatedEventTypes = EVENT_TYPES.filter(et => et.slug !== eventTypeSlug)

  // ── Not Found State ──────────────────────────────────────────────────────
  if (!eventType) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Search size={48} className="mx-auto text-stone-300 mb-6" />
          <h1 className="text-3xl font-semibold text-stone-900 tracking-tight mb-3">
            Event Type Not Found
          </h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto mb-8">
            We couldn&apos;t find an event type matching that page. Browse our event types below to start planning your Milwaukee event.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {EVENT_TYPES.map((et) => (
              <button
                key={et.slug}
                onClick={() => onNavigateExploreEvent(et.slug)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-700 hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900 transition-all shadow-sm"
              >
                {EVENT_ICON_MAP[et.icon] || <Sparkles size={16} />}
                {et.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigateDirectory('all', '')}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 text-white px-6 py-3 text-xs font-bold hover:bg-stone-800 transition"
          >
            <ArrowLeft size={14} />
            Back to Directory
          </button>
        </div>
      </div>
    )
  }

  // ── Main Event Explore Page ──────────────────────────────────────────────
  const totalVendors = Object.values(categoryVendors).reduce((sum, v) => sum + v.length, 0)
  const totalVerified = Object.values(categoryVendors).flat().filter(v => v.isVerified).length

  return (
    <div className="bg-white min-h-screen">
      {/* Hero / Header */}
      <div className="bg-stone-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(100%_100%_at_top_right,rgba(186,151,90,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-stone-400 text-xs mb-6">
            <button
              onClick={() => onNavigateDirectory('all', '')}
              className="hover:text-white transition"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-stone-300">Plan by Event</span>
            <span>/</span>
            <span className="text-white font-medium">{eventType.label}</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-stone-300 mb-4">
              {EVENT_ICON_MAP[eventType.icon] || <Sparkles size={12} />}
              Milwaukee Event Planning Guide
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              Plan Your Milwaukee {eventType.label}
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {eventType.description}
            </p>
          </div>

          {/* Stats bar */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold">{eventType.vendorCategories.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Vendor Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalVendors}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Vendors Listed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalVerified}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Verified</div>
            </div>
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Milwaukee Based</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Checklist */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-stone-900 tracking-tight mb-2">
            Everything You Need for a Milwaukee {eventType.label}
          </h2>
          <p className="text-sm text-stone-500">
            Your complete planning checklist - from venues to the final details. Each category features top Milwaukee vendors ready to book.
          </p>
        </div>

        {/* Checklist summary */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-sm font-semibold text-stone-900">Your Planning Checklist</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {eventType.vendorCategories.map((cat, idx) => {
              const hasVendors = (categoryVendors[cat] || []).length > 0
              return (
                <button
                  key={cat}
                  onClick={() => {
                    const el = document.getElementById(`category-${cat}`)
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    hasVendors
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-white text-stone-500 border border-stone-200'
                  }`}
                >
                  {hasVendors ? (
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  ) : (
                    <Circle size={12} className="text-stone-300" />
                  )}
                  {getCategoryLabel(cat)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Category rows with vendors */}
        <div className="divide-y divide-stone-100">
          {eventType.vendorCategories.map((cat) => (
            <div key={cat} id={`category-${cat}`}>
              <CategoryRow
                category={cat}
                vendors={categoryVendors[cat] || []}
                isLoading={loadingCategories.has(cat)}
                onSelectVendor={onSelectVendor}
                onViewAll={() => onNavigateDirectory(cat)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Browse by Venue Type */}
      <section className="border-t border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-semibold text-stone-900 mb-1">Pick Your Venue Style</h2>
          <p className="text-xs text-stone-500 mb-5">
            The right venue sets the tone. Explore Milwaukee venues by type.
          </p>
          <div className="flex flex-wrap gap-2">
            {VENUE_TYPES.map((vt) => (
              <button
                key={vt.slug}
                onClick={() => onNavigateExploreVenue(vt.slug)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-stone-200 bg-white text-xs font-medium text-stone-700 hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900 transition-all shadow-sm"
              >
                <MapPin size={12} className="text-stone-400" />
                {vt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Related Event Types */}
      <section className="border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-semibold text-stone-900 mb-1">Other Events You Might Be Planning</h2>
          <p className="text-xs text-stone-500 mb-5">
            Explore planning guides for other Milwaukee event types
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {relatedEventTypes.map((et) => (
              <button
                key={et.slug}
                onClick={() => onNavigateExploreEvent(et.slug)}
                className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm transition-all text-left group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-600 group-hover:bg-stone-900 group-hover:text-white transition-colors flex-shrink-0">
                  {EVENT_ICON_MAP[et.icon] || <Sparkles size={16} />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-stone-900 group-hover:text-red-600 transition-colors truncate">{et.label}</div>
                  <div className="text-[10px] text-stone-500">{et.vendorCategories.length} categories</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-stone-200 bg-stone-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Are You a Milwaukee {eventType.label} Vendor?
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed mb-6">
              Get your business listed on Planviry and reach thousands of people planning {eventType.label.toLowerCase()}s in Milwaukee, WI.
              Claim your free profile or register a new listing today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenSignupModal}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-stone-900 px-6 py-3 text-xs font-bold hover:bg-stone-100 transition"
              >
                <ExternalLink size={14} />
                List Your Business Free
              </button>
              <button
                onClick={() => {
                  const allVendors = Object.values(categoryVendors).flat()
                  const unclaimed = allVendors.find(v => !v.isClaimed)
                  if (unclaimed) onOpenClaimModal(unclaimed)
                  else onOpenSignupModal()
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 text-white px-6 py-3 text-xs font-bold hover:bg-white/10 transition"
              >
                <ShieldCheck size={14} />
                Claim Your Profile
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
