'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  MapPin,
  Bookmark,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Building2,
  Music,
  Camera,
  Utensils,
  Flower2,
  Flame,
  Package,
  Lightbulb,
  Video,
  Heart,
  Cake,
  Bus,
  ExternalLink,
} from 'lucide-react'
import { Vendor, VendorCategory, getCategoryLabel } from '@/lib/types'
import {
  getSearchTermBySlug,
  getRelatedSearches,
  POPULAR_SEARCHES,
  CATEGORY_SEARCH_MAP,
  type SearchTerm,
} from '@/lib/seo-data'

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface ExploreViewProps {
  slug: string
  onSelectVendor: (id: string) => void
  onOpenClaimModal: (vendor: Vendor) => void
  onOpenSignupModal: () => void
  onSelectCategory: (category: VendorCategory | 'all') => void
  onNavigateExplore: (slug: string) => void
  onNavigateDirectory: (category?: VendorCategory | 'all', search?: string) => void
  onFetchVendors: (category: string, search: string, page: number) => Promise<any>
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────────────────

function VendorCardSkeleton() {
  return (
    <div className="flex bg-white border border-stone-200 rounded-xl overflow-hidden animate-pulse">
      <div className="w-[130px] sm:w-[190px] flex-shrink-0 bg-stone-100 aspect-auto min-h-[120px]" />
      <div className="flex-1 p-4 sm:p-5 space-y-3">
        <div className="h-4 w-3/4 bg-stone-100 rounded" />
        <div className="flex gap-2">
          <div className="h-3 w-16 bg-stone-100 rounded" />
          <div className="h-3 w-10 bg-stone-100 rounded" />
        </div>
        <div className="h-3 w-full bg-stone-100 rounded" />
        <div className="h-3 w-2/3 bg-stone-100 rounded" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Search Pill
// ─────────────────────────────────────────────────────────────────────────────

function SearchPill({
  term,
  onClick,
}: {
  term: SearchTerm
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 bg-white text-xs font-medium text-stone-700 hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900 transition-all duration-150 whitespace-nowrap"
    >
      {term.searchQuery || term.term}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Explore View
// ─────────────────────────────────────────────────────────────────────────────

export function ExploreView({
  slug,
  onSelectVendor,
  onOpenClaimModal,
  onOpenSignupModal,
  onSelectCategory,
  onNavigateExplore,
  onNavigateDirectory,
  onFetchVendors,
}: ExploreViewProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalVendors, setTotalVendors] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const searchTerm = getSearchTermBySlug(slug)

  // Fetch vendors when search term changes
  useEffect(() => {
    if (!searchTerm) {
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
        })
        if (searchTerm.category && searchTerm.category !== 'all') {
          params.set('category', searchTerm.category)
        }
        if (searchTerm.searchQuery) {
          params.set('search', searchTerm.searchQuery)
        }

        const res = await fetch(`/api/vendors?${params}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()

        const transformedVendors: Vendor[] = (data.vendors || []).map((v: any) => ({
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

        setVendors(transformedVendors)
        setTotalVendors(data.pagination?.total || 0)
        setCurrentPage(data.pagination?.page || 1)
        setTotalPages(data.pagination?.totalPages || 1)
      } catch (err) {
        console.error('Failed to fetch explore vendors:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendors()
  }, [searchTerm])

  // Related searches for this page
  const relatedSearches = searchTerm
    ? getRelatedSearches(searchTerm.category as VendorCategory | 'all')
    : []

  // Category searches for "Browse by Category" section
  const categorySearches = searchTerm && searchTerm.category !== 'all'
    ? (CATEGORY_SEARCH_MAP[searchTerm.category as VendorCategory] || []).slice(0, 8)
    : POPULAR_SEARCHES.slice(0, 8)

  // ── Not Found State ────────────────────────────────────────────────────────
  if (!searchTerm) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Search size={48} className="mx-auto text-stone-300 mb-6" />
          <h1 className="text-3xl font-semibold text-stone-900 tracking-tight mb-3">
            Page Not Found
          </h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto mb-8">
            The search page you&apos;re looking for doesn&apos;t exist. Browse our popular searches below to find Milwaukee vendors.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {POPULAR_SEARCHES.slice(0, 12).map((term) => (
              <SearchPill
                key={term.slug}
                term={term}
                onClick={() => onNavigateExplore(term.slug)}
              />
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

  // ── Main Explore Page ──────────────────────────────────────────────────────
  return (
    <div className="bg-white min-h-screen">
      {/* Hero / Header - WHITE for GDPR visibility */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-stone-400 text-xs mb-6">
            <button
              onClick={() => onNavigateDirectory('all', '')}
              className="hover:text-stone-700 transition"
            >
              Directory
            </button>
            <span>/</span>
            <button
              onClick={() => onSelectCategory(searchTerm.category as VendorCategory | 'all')}
              className="hover:text-stone-700 transition"
            >
              {getCategoryLabel(searchTerm.category)}
            </button>
            <span>/</span>
            <span className="text-stone-600">{searchTerm.searchQuery}</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-4 border border-stone-200">
              <MapPin size={10} />
              Milwaukee, WI
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4 text-stone-950">
              {searchTerm.h1}
            </h1>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-2xl">
              {searchTerm.metaDescription}
            </p>

            {/* Quick category filter pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {categorySearches.filter(t => t.slug !== searchTerm.slug).slice(0, 5).map((term) => (
                <SearchPill
                  key={term.slug}
                  term={term}
                  onClick={() => onNavigateExplore(term.slug)}
                />
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-8 pt-6 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-stone-900">{totalVendors}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Vendors Listed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900">{vendors.filter(v => v.isVerified).length}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Verified</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900">{vendors.filter(v => v.isFeatured).length}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Featured</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Milwaukee Based</div>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <p className="text-stone-600 text-sm leading-relaxed">
            Looking for the best {searchTerm.searchQuery.toLowerCase()} in Milwaukee? Planviry is the city&apos;s premier marketplace for
            finding and booking top-rated Milwaukee {getCategoryLabel(searchTerm.category).toLowerCase()}.
            Whether you&apos;re planning a wedding, corporate event, birthday party, or any special occasion,
            our verified vendors deliver professional service with the authentic Milwaukee touch.
            Compare ratings, read reviews, and book directly - all in one place.
          </p>
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-stone-900">
            Top {searchTerm.searchQuery} in Milwaukee
          </h2>
          <button
            onClick={() => onNavigateDirectory(
              searchTerm.category as VendorCategory | 'all',
              searchTerm.searchQuery
            )}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
          >
            View All Filters <ArrowRight size={12} />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <VendorCardSkeleton key={i} />
            ))}
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Search size={40} className="mx-auto text-stone-300" />
            <h4 className="text-base font-semibold text-stone-800">No vendors found</h4>
            <p className="text-sm text-stone-500 max-w-sm mx-auto">
              We couldn&apos;t find any {searchTerm.searchQuery.toLowerCase()} matching this search. Try browsing the full category.
            </p>
            <button
              onClick={() => onNavigateDirectory(searchTerm.category as VendorCategory | 'all', '')}
              className="rounded-lg border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              Browse All {getCategoryLabel(searchTerm.category)}
            </button>
          </div>
        ) : (
          <>
            {/* ── Product card shells - horizontal layout matching reference repo ── */}
            <div className="space-y-4">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={() => onSelectVendor(vendor.id)}
                  className={`group flex bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer ${
                    vendor.isFeatured ? 'border-stone-300 ring-1 ring-stone-900/5' : 'border-stone-200'
                  }`}
                >
                  {/* Cover image - left side */}
                  <div className="relative w-[130px] sm:w-[190px] flex-shrink-0 overflow-hidden bg-stone-100">
                    <img
                      src={vendor.coverUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop&q=80'}
                      alt={vendor.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {vendor.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-stone-950 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                          <Sparkles size={8} /> Elite
                        </span>
                      )}
                      {vendor.isVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-stone-700 uppercase tracking-wider border border-stone-200/50">
                          <ShieldCheck size={8} className="text-stone-600" /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content - right side */}
                  <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-stone-900 text-base sm:text-[17px] leading-snug">
                          {vendor.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {vendor.averageRating && vendor.averageRating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star size={12} className="fill-stone-800 text-stone-800" />
                            <span className="text-sm font-bold text-stone-800">
                              {vendor.averageRating.toFixed(1)}
                            </span>
                            {vendor.reviewCount > 0 && (
                              <span className="text-sm text-stone-400">({vendor.reviewCount})</span>
                            )}
                          </div>
                        )}
                        {vendor.priceRange && (
                          <span className="text-sm font-semibold text-stone-500">{vendor.priceRange}</span>
                        )}
                      </div>

                      {vendor.bio && (
                        <p className="mt-2 text-sm text-stone-500 line-clamp-2">{vendor.bio}</p>
                      )}

                      {vendor.address && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-stone-400">
                          <MapPin size={12} />
                          <span>{vendor.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span />
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 group-hover:text-stone-900 transition-colors">
                        View <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 pb-4">
                <button
                  onClick={() => {
                    const prevPage = Math.max(1, currentPage - 1)
                    onFetchVendors(searchTerm.category, searchTerm.searchQuery, prevPage)
                    setCurrentPage(prevPage)
                  }}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition disabled:opacity-40"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="text-xs text-stone-500">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => {
                    const nextPage = Math.min(totalPages, currentPage + 1)
                    onFetchVendors(searchTerm.category, searchTerm.searchQuery, nextPage)
                    setCurrentPage(nextPage)
                  }}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition disabled:opacity-40"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Related Searches */}
      {relatedSearches.length > 0 && (
        <section className="border-t border-stone-200 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-lg font-semibold text-stone-900 mb-1">Related Searches</h2>
            <p className="text-xs text-stone-500 mb-5">Explore similar services in Milwaukee</p>
            <div className="flex flex-wrap gap-2">
              {relatedSearches.map((term) => (
                <SearchPill
                  key={term.slug}
                  term={term}
                  onClick={() => onNavigateExplore(term.slug)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by Category */}
      <section className="border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-semibold text-stone-900 mb-1">Browse by Category</h2>
          <p className="text-xs text-stone-500 mb-5">Discover more Milwaukee vendors</p>
          <div className="flex flex-wrap gap-2">
            {categorySearches.filter(t => t.slug !== searchTerm.slug).map((term) => (
              <SearchPill
                key={term.slug}
                term={term}
                onClick={() => onNavigateExplore(term.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-stone-200 bg-stone-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Are You a {searchTerm.searchQuery} in Milwaukee?
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed mb-6">
              Get your business listed on Planviry and reach thousands of people searching for
              {searchTerm.searchQuery.toLowerCase()} in Milwaukee, WI. Claim your free profile or
              register a new listing to start receiving direct leads today.
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
