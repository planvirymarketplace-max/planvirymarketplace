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
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  Building2,
  Sun,
  Wine,
  Factory,
  Church,
  Crown,
  TreePine,
} from 'lucide-react'
import { Vendor, VendorCategory, getCategoryLabel } from '@/lib/types'
import {
  VENUE_TYPES,
  EVENT_TYPES,
} from '@/lib/seo-data'

// ─────────────────────────────────────────────────────────────────────────────
// Venue type considerations
// ─────────────────────────────────────────────────────────────────────────────

const VENUE_CONSIDERATIONS: Record<string, { label: string; description: string }[]> = {
  'ballrooms-banquet-halls': [
    { label: 'Capacity planning', description: 'Confirm guest count before booking - ballrooms often have minimums' },
    { label: 'Catering requirements', description: 'Many ballrooms require in-house catering or have preferred vendor lists' },
    { label: 'Parking access', description: 'Verify parking availability for large guest counts' },
    { label: 'Setup/teardown windows', description: 'Ballrooms often have tight turnaround windows between events' },
    { label: 'AV capabilities', description: 'Check built-in sound systems and lighting rigs' },
  ],
  'rooftops-outdoor': [
    { label: 'Weather backup plan', description: 'Always have an indoor alternative or tent ready in Milwaukee weather' },
    { label: 'Seasonal availability', description: 'Milwaukee rooftop season runs May–October primarily' },
    { label: 'Wind considerations', description: 'High floors can get windy - secure decor and table settings' },
    { label: 'Noise ordinances', description: 'Outdoor venues may have earlier music cutoffs' },
    { label: 'Lighting at sunset', description: 'Plan for transition from natural to artificial lighting' },
  ],
  'bars-clubs': [
    { label: 'Minimum spend requirements', description: 'Most bars require a minimum food/beverage spend' },
    { label: 'Age restrictions', description: 'Confirm if all guests can attend (21+ venues)' },
    { label: 'Sound limitations', description: 'Downtown venues may have noise restrictions' },
    { label: 'Exclusive vs shared', description: 'Determine if you get the whole venue or a section' },
    { label: 'Late-night options', description: 'Milwaukee bars can stay open late - plan your timeline' },
  ],
  'breweries-industrial': [
    { label: 'Brewery scheduling', description: 'Breweries often close for private events on specific days' },
    { label: 'Temperature control', description: 'Industrial spaces can be drafty - plan heating/cooling' },
    { label: 'Rustic decor needs', description: 'Industrial spaces often need more decor to feel event-ready' },
    { label: 'Sound acoustics', description: 'Concrete and metal surfaces create echo - consider sound absorption' },
    { label: 'Loading access', description: 'Verify dock access for caterers and rental deliveries' },
  ],
  'churches-chapels': [
    { label: 'Religious requirements', description: 'Some churches require premarital counseling or membership' },
    { label: 'Decoration restrictions', description: 'Many churches limit decor - no tape, nails, or candles' },
    { label: 'Reception proximity', description: 'Plan transportation from ceremony to reception venue' },
    { label: 'Music guidelines', description: 'Some churches restrict secular music during ceremonies' },
    { label: 'Photography rules', description: 'Flash photography may be restricted during ceremonies' },
  ],
  'private-estates': [
    { label: 'Insurance requirements', description: 'Private estates often require event liability insurance' },
    { label: 'Vendor restrictions', description: 'Some estates have approved vendor lists' },
    { label: 'Noise and curfew', description: 'Residential areas have strict noise ordinances' },
    { label: 'Parking logistics', description: 'Off-site parking with shuttles may be required' },
    { label: 'Restroom capacity', description: 'Ensure facilities can handle your guest count' },
  ],
  'parks-pavilions': [
    { label: 'Permit requirements', description: 'Milwaukee County parks require event permits' },
    { label: 'Weather contingency', description: 'Always have a tent or indoor backup plan' },
    { label: 'Bathroom facilities', description: 'Check if restrooms are available and maintained' },
    { label: 'Power access', description: 'Parks may have limited electrical - plan for generators' },
    { label: 'Cleanup responsibilities', description: 'You may be responsible for full cleanup after the event' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Venue icon mapping
// ─────────────────────────────────────────────────────────────────────────────

const VENUE_ICON_MAP: Record<string, React.ReactNode> = {
  'ballrooms-banquet-halls': <Building2 className="h-5 w-5" />,
  'rooftops-outdoor': <Sun className="h-5 w-5" />,
  'bars-clubs': <Wine className="h-5 w-5" />,
  'breweries-industrial': <Factory className="h-5 w-5" />,
  'churches-chapels': <Church className="h-5 w-5" />,
  'private-estates': <Crown className="h-5 w-5" />,
  'parks-pavilions': <TreePine className="h-5 w-5" />,
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
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface ExploreVenueViewProps {
  venueTypeSlug: string
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
// Main ExploreVenueView
// ─────────────────────────────────────────────────────────────────────────────

export function ExploreVenueView({
  venueTypeSlug,
  onSelectVendor,
  onOpenClaimModal,
  onOpenSignupModal,
  onSelectCategory,
  onNavigateExplore,
  onNavigateExploreEvent,
  onNavigateExploreVenue,
  onNavigateDirectory,
}: ExploreVenueViewProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalVendors, setTotalVendors] = useState(0)

  const venueType = VENUE_TYPES.find(vt => vt.slug === venueTypeSlug)
  const considerations = venueType ? (VENUE_CONSIDERATIONS[venueType.slug] || []) : []

  // Fetch vendors for this venue type's category
  useEffect(() => {
    if (!venueType) {
      setIsLoading(false)
      return
    }

    const fetchVendors = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: '1',
          limit: '24',
          published: 'true',
          category: venueType.vendorCategory,
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

        setVendors(transformed)
        setTotalVendors(data.pagination?.total || 0)
      } catch (err) {
        console.error('Failed to fetch venue vendors:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendors()
  }, [venueType])

  // Related venue types (exclude current)
  const relatedVenueTypes = VENUE_TYPES.filter(vt => vt.slug !== venueTypeSlug)

  // ── Not Found State ──────────────────────────────────────────────────────
  if (!venueType) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <MapPin size={48} className="mx-auto text-stone-300 mb-6" />
          <h1 className="text-3xl font-semibold text-stone-900 tracking-tight mb-3">
            Venue Type Not Found
          </h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto mb-8">
            We couldn&apos;t find a venue type matching that page. Browse Milwaukee venue types below.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {VENUE_TYPES.map((vt) => (
              <button
                key={vt.slug}
                onClick={() => onNavigateExploreVenue(vt.slug)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-700 hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900 transition-all shadow-sm"
              >
                {VENUE_ICON_MAP[vt.slug] || <MapPin size={16} />}
                {vt.label}
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

  // ── Main Venue Explore Page ──────────────────────────────────────────────
  const verifiedCount = vendors.filter(v => v.isVerified).length

  // Filter tags to display
  const filterTags = venueType.filters.map(f => f.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))

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
            <span className="text-stone-300">Browse by Venue</span>
            <span>/</span>
            <span className="text-white font-medium">{venueType.label}</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-stone-300 mb-4">
              {VENUE_ICON_MAP[venueType.slug] || <MapPin size={12} />}
              Milwaukee Venue Guide
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              Milwaukee {venueType.label}
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {venueType.description}
            </p>

            {/* Filter tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {filterTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-semibold uppercase tracking-wider text-stone-300"
                >
                  <CheckCircle2 size={10} />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold">{totalVendors}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Venues Listed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{verifiedCount}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Verified</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{vendors.filter(v => v.isFeatured).length}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Featured</div>
            </div>
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Milwaukee Based</div>
            </div>
          </div>
        </div>
      </div>

      {/* Venue listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              {venueType.label} in Milwaukee
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Browse {totalVendors} Milwaukee {getCategoryLabel(venueType.vendorCategory).toLowerCase()} that match this venue style
            </p>
          </div>
          <button
            onClick={() => onNavigateDirectory(venueType.vendorCategory)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition whitespace-nowrap"
          >
            View All Filters <ArrowRight size={12} />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <VendorCardSkeleton key={i} />
            ))}
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <MapPin size={40} className="mx-auto text-stone-300" />
            <h4 className="text-base font-semibold text-stone-800">No venues found</h4>
            <p className="text-sm text-stone-500 max-w-sm mx-auto">
              We couldn&apos;t find any {venueType.label.toLowerCase()} matching this category. Try browsing all venues.
            </p>
            <button
              onClick={() => onNavigateDirectory(venueType.vendorCategory)}
              className="rounded-lg border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              Browse All {getCategoryLabel(venueType.vendorCategory)}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => onSelectVendor(vendor.id)}
                className={`group bg-white border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-stone-300 ${vendor.isFeatured ? 'border-stone-300 shadow-md' : 'border-stone-200 shadow-sm'}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={vendor.coverUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop&q=80'}
                    alt={vendor.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm uppercase tracking-wider">
                      {getCategoryLabel(vendor.category)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation() }}
                    className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-stone-400 hover:text-red-500 shadow-sm transition-colors border border-white/50"
                    aria-label="Save venue"
                  >
                    <Bookmark size={12} />
                  </button>
                  {vendor.isFeatured && (
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                        <Sparkles size={8} />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    {vendor.isVerified && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                        <ShieldCheck size={10} />
                        Verified
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm leading-snug group-hover:text-red-600 transition-colors line-clamp-1">
                    {vendor.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={11}
                          className={star <= Math.round(vendor.averageRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}
                        />
                      ))}
                      <span className="text-[11px] font-semibold text-stone-800 ml-0.5">{vendor.averageRating || '-'}</span>
                      <span className="text-[10px] text-stone-400">({vendor.reviewCount || 0})</span>
                    </div>
                    <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">{vendor.priceRange || '$$'}</span>
                  </div>
                  {vendor.address && (
                    <div className="flex items-center gap-1 mt-1.5 text-[11px] text-stone-500">
                      <MapPin size={10} className="text-stone-400 flex-shrink-0" />
                      <span className="truncate">{vendor.address}</span>
                    </div>
                  )}
                  <p className="mt-1.5 text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {vendor.bio || 'Premium Milwaukee venue available for direct booking.'}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100">
                    <div className="flex gap-1 min-w-0">
                      {vendor.tags && vendor.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="inline-flex rounded bg-stone-50 border border-stone-100 px-1.5 py-0.5 text-[9px] text-stone-500 font-medium truncate">#{tag.replace(/\s+/g, '')}</span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 whitespace-nowrap">
                      View <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Considerations Section */}
      {considerations.length > 0 && (
        <section className="border-t border-stone-200 bg-amber-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={18} className="text-amber-600" />
              <h2 className="text-lg font-semibold text-stone-900">What to Consider for {venueType.label}</h2>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              Plan smarter with these Milwaukee-specific tips for {venueType.label.toLowerCase()}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {considerations.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-xl p-4 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">{item.label}</h4>
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by Event Type */}
      <section className="border-t border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-semibold text-stone-900 mb-1">Planning an Event at This Venue?</h2>
          <p className="text-xs text-stone-500 mb-5">
            See everything you need for your event type at a {venueType.label.toLowerCase().split(' ')[0]} venue
          </p>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.slice(0, 6).map((et) => (
              <button
                key={et.slug}
                onClick={() => onNavigateExploreEvent(et.slug)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-stone-200 bg-white text-xs font-medium text-stone-700 hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900 transition-all shadow-sm"
              >
                {et.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Related Venue Types */}
      <section className="border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-semibold text-stone-900 mb-1">Other Venue Styles in Milwaukee</h2>
          <p className="text-xs text-stone-500 mb-5">
            Explore different venue vibes for your Milwaukee event
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {relatedVenueTypes.map((vt) => (
              <button
                key={vt.slug}
                onClick={() => onNavigateExploreVenue(vt.slug)}
                className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm transition-all text-left group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-600 group-hover:bg-stone-900 group-hover:text-white transition-colors flex-shrink-0">
                  {VENUE_ICON_MAP[vt.slug] || <MapPin size={16} />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-stone-900 group-hover:text-red-600 transition-colors truncate">{vt.label}</div>
                  <div className="text-[10px] text-stone-500">{vt.filters.length} filters</div>
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
              Own a {venueType.label.split(' ')[0]} Venue in Milwaukee?
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed mb-6">
              Get your venue listed on Planviry and reach thousands of event planners searching for
              {venueType.label.toLowerCase()} in Milwaukee, WI. Claim your free profile today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenSignupModal}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-stone-900 px-6 py-3 text-xs font-bold hover:bg-stone-100 transition"
              >
                <ExternalLink size={14} />
                List Your Venue Free
              </button>
              <button
                onClick={() => {
                  const unclaimed = vendors.find(v => !v.isClaimed)
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
