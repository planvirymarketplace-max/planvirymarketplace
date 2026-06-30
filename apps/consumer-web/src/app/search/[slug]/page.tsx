import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  SEARCH_TERMS,
  EVENT_TYPES,
  SERVICE_TYPES,
  VENUE_TYPES,
  NEARBY_CITIES,
  getSearchTermBySlug,
  getRelatedSearches,
} from '@/lib/seo-data'
import { SEO_LOCATIONS } from '@/data/seo-locations'
import {
  fetchVendorsBySearch,
  fetchVendorsByCategory,
  getCategoryPageSlug,
  type SEOVendor,
} from '@/lib/seo-server'
import { CATEGORY_LABELS } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Params type for Next.js 16 App Router
// ─────────────────────────────────────────────────────────────────────────────

interface SearchPageProps {
  params: Promise<{ slug: string }>
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: convert slug to readable search query
// ─────────────────────────────────────────────────────────────────────────────

function slugToReadable(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: truncate text
// ─────────────────────────────────────────────────────────────────────────────

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...'
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: star display
// ─────────────────────────────────────────────────────────────────────────────

function starString(rating: number): string {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '*'.repeat(full) + (half ? '½' : '') + '·'.repeat(empty)
}

// ─────────────────────────────────────────────────────────────────────────────
// generateMetadata - SEO metadata for the page
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { slug } = await params
  const searchTerm = getSearchTermBySlug(slug)

  if (!searchTerm) {
    const readable = slugToReadable(slug)
    return {
      title: `${readable} - Planviry`,
      description: `Find top-rated vendors for ${readable.toLowerCase()} on Planviry.`,
      openGraph: {
        title: `${readable} - Planviry`,
        description: `Find top-rated vendors for ${readable.toLowerCase()} on Planviry.`,
        type: 'website',
        siteName: 'Planviry',
      },
    }
  }

  return {
    title: `${searchTerm.h1} - Planviry`,
    description: searchTerm.metaDescription,
    openGraph: {
      title: `${searchTerm.h1} - Planviry`,
      description: searchTerm.metaDescription,
      type: 'website',
      siteName: 'Planviry',
    },
    alternates: {
      canonical: `/search/${searchTerm.slug}`,
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic rendering - search pages are server-rendered on demand
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic'

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD Structured Data
// ─────────────────────────────────────────────────────────────────────────────

function buildJsonLd(
  searchTerm: { term: string; h1: string; metaDescription: string; slug: string },
  vendors: SEOVendor[],
) {
  if (vendors.length > 0) {
    // ItemList schema when we have vendors
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: searchTerm.h1,
      description: searchTerm.metaDescription,
      numberOfItems: vendors.length,
      itemListElement: vendors.slice(0, 10).map((v, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'LocalBusiness',
          name: v.name,
          url: `https://planviry.com/vendor/${v.slug}`,
          address: v.address || undefined,
          telephone: v.phone || undefined,
          aggregateRating:
            (v.rating ?? 0) > 0
              ? {
                  '@type': 'AggregateRating',
                  ratingValue: v.rating,
                  reviewCount: v.reviewCount,
                }
              : undefined,
        },
      })),
    }
  }

  // Fallback: just LocalBusiness for the search category
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: searchTerm.h1,
    description: searchTerm.metaDescription,
    url: `https://planviry.com/search/${searchTerm.slug}`,
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Vendor Card Component (server-rendered)
// ─────────────────────────────────────────────────────────────────────────────

function VendorCard({ vendor }: { vendor: SEOVendor }) {
  const categoryLabel =
    (CATEGORY_LABELS as Record<string, string>)[vendor.category] ||
    vendor.categoryName ||
    vendor.category.replace(/_/g, ' ')

  return (
    <article className="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-400 transition-colors">
      <div className="flex flex-col gap-2">
        {/* Name + Category */}
        <div>
          <h3 className="text-lg font-bold text-stone-900 leading-tight">
            <a
              href={`/vendor/${vendor.slug}`}
              className="text-[#cc6600] hover:underline visited:text-[#994d00]"
            >
              {vendor.name}
            </a>
          </h3>
          <span className="text-sm text-stone-500">{categoryLabel}</span>
        </div>

        {/* Address */}
        {vendor.address && (
          <p className="text-sm text-stone-600">{vendor.address}</p>
        )}

        {/* Price Range */}
        {vendor.priceRange && (
          <p className="text-sm text-stone-600">
            Price range: {vendor.priceRange}
          </p>
        )}

        {/* Rating */}
        {(vendor.rating ?? 0) > 0 && (
          <p className="text-sm text-stone-600">
            Rating: {vendor.rating!.toFixed(1)}/5{' '}
            <span className="text-amber-500" aria-hidden="true">
              {starString(vendor.rating!)}
            </span>
            {(vendor.reviewCount ?? 0) > 0 && (
              <span className="text-stone-400 ml-1">
                ({vendor.reviewCount} review{vendor.reviewCount !== 1 ? 's' : ''})
              </span>
            )}
          </p>
        )}

        {/* Bio excerpt */}
        {vendor.bio && (
          <p className="text-sm text-stone-600 leading-relaxed">
            {truncate(vendor.bio, 150)}
          </p>
        )}

        {/* Tags */}
        {vendor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {vendor.tags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="inline-block text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Verified / Featured badges */}
        <div className="flex items-center gap-2 mt-1">
          {vendor.isVerified && (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Verified
            </span>
          )}
          {vendor.isFeatured && (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Featured
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────

export default async function SearchPage({ params }: SearchPageProps) {
  const { slug } = await params
  const searchTerm = getSearchTermBySlug(slug)

  // ── Determine search data ──────────────────────────────────────────────────
  let h1: string
  let metaDescription: string
  let category: string | null = null
  let searchQuery: string
  let type: string | null = null

  if (searchTerm) {
    h1 = searchTerm.h1
    metaDescription = searchTerm.metaDescription
    category = searchTerm.category
    searchQuery = searchTerm.searchQuery
    type = searchTerm.type
  } else {
    // Fallback: derive from slug
    h1 = slugToReadable(slug)
    metaDescription = `Find top-rated vendors for ${h1.toLowerCase()} on Planviry.`
    searchQuery = slug.replace(/-/g, ' ')
  }

  // ── Fetch vendors ──────────────────────────────────────────────────────────
  let vendors: SEOVendor[] = []

  try {
    if (searchTerm && searchTerm.category !== 'all') {
      // Fetch by both search query AND category, then merge/deduplicate
      const [bySearch, byCategory] = await Promise.all([
        fetchVendorsBySearch(searchTerm.searchQuery),
        fetchVendorsByCategory(searchTerm.category),
      ])

      // Deduplicate by vendor id, search results first
      const seen = new Set<string>()
      for (const v of bySearch) {
        if (!seen.has(v.id)) {
          seen.add(v.id)
          vendors.push(v)
        }
      }
      for (const v of byCategory) {
        if (!seen.has(v.id)) {
          seen.add(v.id)
          vendors.push(v)
        }
      }
    } else if (searchTerm && searchTerm.category === 'all') {
      // All-categories search: just search by query
      vendors = await fetchVendorsBySearch(searchTerm.searchQuery)
    } else {
      // Fallback slug search
      vendors = await fetchVendorsBySearch(searchQuery)
    }
  } catch (error) {
    console.error('Failed to fetch vendors for search page:', error)
    vendors = []
  }

  // If no search term found AND no vendors found, return 404
  if (!searchTerm && vendors.length === 0) {
    notFound()
  }

  // ── Related searches ──────────────────────────────────────────────────────
  let relatedSearches = getRelatedSearches(
    (category as 'all') || 'all',
  )

  // If we have a type but no category matches, also find by type
  if (relatedSearches.length < 4 && type) {
    const typeMatches = SEARCH_TERMS.filter(
      (t) => t.type === type && t.slug !== slug,
    ).slice(0, 8 - relatedSearches.length)
    const existingSlugs = new Set(relatedSearches.map((r) => r.slug))
    for (const t of typeMatches) {
      if (!existingSlugs.has(t.slug)) {
        relatedSearches.push(t)
      }
    }
    relatedSearches = relatedSearches.slice(0, 8)
  }

  // ── JSON-LD ──────────────────────────────────────────────────────────────
  const jsonLd = buildJsonLd(
    { term: searchTerm?.term || h1, h1, metaDescription, slug },
    vendors,
  )

  return <AppLayoutShell>
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Back to Marketplace */}
        <nav className="mb-6">
          <a
            href="/#/marketplace"
            className="text-sm text-[#cc6600] hover:underline"
          >
            &larr; Back to Marketplace
          </a>
        </nav>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-stone-500 flex-wrap">
            <li>
              <a href="/" className="text-[#cc6600] hover:underline">
                Home
              </a>
            </li>
            <li aria-hidden="true" className="text-stone-300">/</li>
            <li>
              <a href="/#/marketplace" className="text-[#cc6600] hover:underline">
                Search
              </a>
            </li>
            <li aria-hidden="true" className="text-stone-300">/</li>
            <li>
              <span className="text-stone-700 font-medium" aria-current="page">
                {h1}
              </span>
            </li>
          </ol>
        </nav>

        {/* H1 + Description */}
        <header className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mb-3">
            {h1}
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
            {metaDescription}
          </p>
          {vendors.length > 0 && (
            <p className="mt-3 text-sm text-stone-400">
              {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} found
            </p>
          )}
        </header>

        {/* Vendor List */}
        {vendors.length > 0 ? (
          <section aria-label="Vendors" className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-12 text-center py-12">
            <p className="text-stone-500 text-lg mb-4">
              No vendors found for this search yet.
            </p>
            <p className="text-stone-400 text-sm mb-6">
              Check back soon - new vendors are added regularly!
            </p>
            <a
              href="/#/marketplace"
              className="inline-block text-[#cc6600] hover:underline font-medium"
            >
              Browse all vendors on the Marketplace
            </a>
          </section>
        )}

        {/* Related Searches */}
        {relatedSearches.length > 0 && (
          <section aria-label="Related searches" className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-4">
              Related Searches
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {relatedSearches.map((related) => (
                <a
                  key={related.slug}
                  href={`/search/${related.slug}`}
                  className="block bg-white border border-stone-200 rounded-lg p-3 hover:border-stone-400 hover:bg-stone-50 transition-colors"
                >
                  <span className="text-sm font-medium text-[#cc6600] hover:underline">
                    {related.h1}
                  </span>
                  <span className="block text-xs text-stone-400 mt-1 capitalize">
                    {related.type}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Explore by Event Type */}
        <section aria-label="Explore by event type" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-4">
            Explore by Event Type
          </h2>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((evt) => (
              <a
                key={evt.slug}
                href={`/category/${evt.slug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:border-[#cc6600] hover:text-[#cc6600] transition-colors"
              >
                {evt.label}
              </a>
            ))}
          </div>
        </section>

        {/* Explore by Service Type */}
        <section aria-label="Explore by service type" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-4">
            Explore by Service Type
          </h2>
          <div className="flex flex-wrap gap-2">
            {SERVICE_TYPES.map((svc) => (
              <a
                key={svc.slug}
                href={`/category/${svc.slug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:border-[#cc6600] hover:text-[#cc6600] transition-colors"
              >
                {svc.label}
              </a>
            ))}
          </div>
        </section>

        {/* Explore by Venue Type */}
        <section aria-label="Explore by venue type" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-4">
            Explore by Venue Type
          </h2>
          <div className="flex flex-wrap gap-2">
            {VENUE_TYPES.map((ven) => (
              <a
                key={ven.slug}
                href={`/category/${ven.slug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:border-[#cc6600] hover:text-[#cc6600] transition-colors"
              >
                {ven.label}
              </a>
            ))}
          </div>
        </section>

        {/* Nearby Cities */}
        <section aria-label="Nearby cities" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-4">
            Nearby Cities
          </h2>
          <div className="flex flex-wrap gap-2">
            {NEARBY_CITIES.map((city) => (
              <a
                key={city.slug}
                href={`/search/${city.slug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:border-[#cc6600] hover:text-[#cc6600] transition-colors"
              >
                {city.name}, {city.state}
              </a>
            ))}
          </div>
        </section>

        {/* Popular Cities */}
        <section aria-label="Popular cities" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-4">
            Popular Cities
          </h2>
          <div className="flex flex-wrap gap-2">
            {SEO_LOCATIONS.filter((loc) => loc.primary).slice(0, 24).map((city) => (
              <a
                key={city.slug}
                href={`/explore/city/${city.slug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:border-[#cc6600] hover:text-[#cc6600] transition-colors"
              >
                {city.displayName}
              </a>
            ))}
          </div>
        </section>

        {/* Footer link back */}
        <footer className="border-t border-stone-200 pt-6 pb-10 text-center">
          <a
            href="/#/marketplace"
            className="text-sm text-[#cc6600] hover:underline font-medium"
          >
            &larr; Back to Marketplace
          </a>
          <p className="text-xs text-stone-400 mt-2">
            Planviry - The Premier Event Vendor Network
          </p>
        </footer>
      </div>
    </div>
  </AppLayoutShell>

}
