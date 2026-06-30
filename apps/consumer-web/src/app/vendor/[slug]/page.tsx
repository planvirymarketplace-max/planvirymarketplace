import { AppLayoutShell } from '@/components/AppLayoutShell'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  fetchVendorBySlug,
  fetchVendorsByCategory,
  getCategoryPageSlug,
  type SEOVendor,
} from '@/lib/seo-server'

// ─── generateMetadata ──────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const vendor = await fetchVendorBySlug(slug)

  if (!vendor) {
    return { title: 'Vendor Not Found | Planviry' }
  }

  const description =
    vendor.bio && vendor.bio.length > 160
      ? vendor.bio.slice(0, 157) + '...'
      : vendor.bio || `${vendor.name} - ${vendor.categoryName} in Milwaukee, WI on Planviry.`

  const title = `${vendor.name} | ${vendor.categoryName} in Milwaukee, WI | Planviry`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Planviry',
      images: vendor.coverUrl
        ? [{ url: vendor.coverUrl, width: 1200, height: 630, alt: vendor.name }]
        : vendor.logoUrl
          ? [{ url: vendor.logoUrl, width: 600, height: 600, alt: vendor.name }]
          : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/vendor/${vendor.slug}`,
    },
  }
}

// ─── JSON-LD Builder ───────────────────────────────────────────────────────

function buildJsonLd(vendor: SEOVendor) {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: vendor.name,
    description: vendor.bio || undefined,
    address: vendor.address || undefined,
    telephone: vendor.phone || undefined,
    url: vendor.website || undefined,
    image: vendor.logoUrl || undefined,
    priceRange: vendor.priceRange || undefined,
  }

  if ((vendor.rating ?? 0) > 0 && (vendor.reviewCount ?? 0) > 0) {
    ld.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: vendor.rating,
      reviewCount: vendor.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  if (vendor.serviceAreas.length > 0) {
    ld.areaServed = vendor.serviceAreas.map((area) => ({
      '@type': 'City',
      name: area,
    }))
  }

  // Remove undefined values
  Object.keys(ld).forEach((key) => ld[key] === undefined && delete ld[key])

  return ld
}

// ─── Price Range Display ───────────────────────────────────────────────────

function PriceRangeDisplay({ priceRange }: { priceRange: string }) {
  const dollarCount = (priceRange.match(/\$/g) || []).length
  const maxDollars = 4

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Price range: ${priceRange}`}>
      {Array.from({ length: maxDollars }).map((_, i) => (
        <span
          key={i}
          className={`text-lg font-bold ${i < dollarCount ? 'text-[#cc6600]' : 'text-stone-300'}`}
        >
          $
        </span>
      ))}
    </span>
  )
}

// ─── Related Vendor Card ───────────────────────────────────────────────────

function RelatedVendorCard({ vendor }: { vendor: SEOVendor }) {
  const categoryPageSlug = getCategoryPageSlug(vendor.category)
  return (
    <a
      href={`/vendor/${vendor.slug}`}
      className="block bg-white border border-stone-200 rounded-lg p-4 hover:border-[#cc6600] transition-colors"
    >
      <h3 className="text-stone-900 font-bold text-base mb-1">{vendor.name}</h3>
      <p className="text-stone-500 text-sm mb-2">{vendor.categoryName}</p>
      {vendor.address && (
        <p className="text-stone-400 text-sm">{vendor.address}</p>
      )}
      {vendor.rating && vendor.rating > 0 && (
        <p className="text-stone-600 text-sm mt-1">
          {vendor.rating.toFixed(1)} ({vendor.reviewCount ?? 0} review{vendor.reviewCount !== 1 ? 's' : ''})
        </p>
      )}
    </a>
  )
}

// ─── Main Page Component ───────────────────────────────────────────────────

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const vendor = await fetchVendorBySlug(slug)

  if (!vendor) {
    notFound()
  }

  // Fetch related vendors in the same category
  const relatedVendors = (await fetchVendorsByCategory(vendor.category))
    .filter((v) => v.id !== vendor.id)
    .slice(0, 4)

  const categoryPageSlug = getCategoryPageSlug(vendor.category)
  const jsonLd = buildJsonLd(vendor)

  return <AppLayoutShell>
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back to Directory Link */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <a
          href="/#/directory"
          className="text-[#cc6600] hover:underline text-sm font-medium"
        >
          &larr; Back to Directory
        </a>
      </div>

      {/* Cover Image / Hero */}
      <header className="max-w-4xl mx-auto px-4 pt-4">
        <div className="w-full h-48 sm:h-64 md:h-72 rounded-lg overflow-hidden">
          {vendor.coverUrl ? (
            <img
              src={vendor.coverUrl}
              alt={`Cover image for ${vendor.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(135deg, #cc6600 0%, #e68a00 50%, #f5a623 100%)',
              }}
            />
          )}
        </div>
      </header>

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-4xl mx-auto px-4 pt-4 pb-2"
      >
        <ol className="flex items-center gap-1.5 text-sm text-stone-500">
          <li>
            <a href="/" className="text-[#cc6600] hover:underline">
              Home
            </a>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li>
            <a
              href={`/category/${categoryPageSlug}`}
              className="text-[#cc6600] hover:underline"
            >
              {vendor.categoryName}
            </a>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li>
            <span className="text-stone-700 font-medium" aria-current="page">
              {vendor.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-16">
        {/* Vendor Header */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <a
                  href={`/category/${categoryPageSlug}`}
                  className="inline-block bg-stone-100 text-stone-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-stone-200 transition-colors"
                >
                  {vendor.categoryName}
                </a>
                {vendor.isVerified && (
                  <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                    Verified
                  </span>
                )}
                {vendor.isFeatured && (
                  <span className="inline-block bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
                    Featured
                  </span>
                )}
              </div>

              {/* H1 - Vendor Name */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-stone-900 font-bold mb-2">
                {vendor.name}
              </h1>

              {/* Rating */}
              {(vendor.rating ?? 0) > 0 && (
                <p className="text-stone-600 text-sm mb-2">
                  <span className="font-bold text-stone-900">
                    {vendor.rating!.toFixed(1)}
                  </span>{' '}
                  out of 5 &middot; {vendor.reviewCount ?? 0} review
                  {vendor.reviewCount !== 1 ? 's' : ''}
                </p>
              )}

              {/* Price Range */}
              {vendor.priceRange && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-stone-500 text-sm">Price Range:</span>
                  <PriceRangeDisplay priceRange={vendor.priceRange} />
                </div>
              )}
            </div>

            {/* Logo */}
            {vendor.logoUrl && (
              <div className="flex-shrink-0">
                <img
                  src={vendor.logoUrl}
                  alt={`${vendor.name} logo`}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg border border-stone-200"
                />
              </div>
            )}
          </div>

          {/* Contact & Details */}
          <div className="mt-6 pt-6 border-t border-stone-100 space-y-2">
            {vendor.address && (
              <p className="text-stone-600 text-sm">
                <span className="font-semibold text-stone-800">Address:</span>{' '}
                {vendor.address}
              </p>
            )}
            {vendor.phone && (
              <p className="text-stone-600 text-sm">
                <span className="font-semibold text-stone-800">Phone:</span>{' '}
                <a
                  href={`tel:${vendor.phone}`}
                  className="text-[#cc6600] hover:underline"
                >
                  {vendor.phone}
                </a>
              </p>
            )}
            {vendor.website && (
              <p className="text-stone-600 text-sm">
                <span className="font-semibold text-stone-800">Website:</span>{' '}
                <a
                  href={
                    vendor.website.startsWith('http')
                      ? vendor.website
                      : `https://${vendor.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#cc6600] hover:underline break-all"
                >
                  {vendor.website.replace(/^https?:\/\//, '')}
                </a>
              </p>
            )}
            {vendor.email && (
              <p className="text-stone-600 text-sm">
                <span className="font-semibold text-stone-800">Email:</span>{' '}
                <a
                  href={`mailto:${vendor.email}`}
                  className="text-[#cc6600] hover:underline"
                >
                  {vendor.email}
                </a>
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
            <a
              href="/#/booking"
              className="inline-flex items-center justify-center bg-[#cc6600] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#b35900] transition-colors text-sm"
            >
              Contact Vendor
            </a>
            {!vendor.isClaimed && (
              <a
                href="/#/claim"
                className="inline-flex items-center justify-center border border-[#cc6600] text-[#cc6600] font-semibold px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors text-sm"
              >
                Claim This Profile
              </a>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {vendor.bio && (
          <section className="bg-white border border-stone-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl text-stone-900 font-bold mb-3">About {vendor.name}</h2>
            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
              {vendor.bio}
            </p>
          </section>
        )}

        {/* Service Areas */}
        {vendor.serviceAreas.length > 0 && (
          <section className="bg-white border border-stone-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl text-stone-900 font-bold mb-3">Service Areas</h2>
            <div className="flex flex-wrap gap-2">
              {vendor.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="inline-block bg-stone-100 text-stone-700 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {area}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        {vendor.tags.length > 0 && (
          <section className="bg-white border border-stone-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl text-stone-900 font-bold mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {vendor.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-amber-50 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Related Vendors */}
        {relatedVendors.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl text-stone-900 font-bold mb-4">
              More {vendor.categoryName} in Milwaukee
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedVendors.map((rv) => (
                <RelatedVendorCard key={rv.id} vendor={rv} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-stone-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Planviry &middot; Milwaukee&apos;s Premier Event Vendor Directory
          </p>
        </div>
      </footer>
    </div>
  </AppLayoutShell>

}
