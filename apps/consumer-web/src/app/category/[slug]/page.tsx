import { AppLayoutShell } from '@/components/AppLayoutShell'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  fetchAllCategories,
  fetchVendorsByCategory,
  CATEGORY_SLUG_MAP,
  type SEOVendor,
} from '@/lib/seo-server'
import { CATEGORY_HIERARCHY, type CategoryGroup } from '@/lib/category-hierarchy'

// ─── Types ──────────────────────────────────────────────────────────────────────

interface ResolvedCategory {
  name: string
  slug: string
  vendorCategory: string
  description: string
  group: CategoryGroup | null
  vendorCount: number
}

// ─── Category Resolution ────────────────────────────────────────────────────────

async function resolveCategory(slug: string): Promise<ResolvedCategory | null> {
  const allCategories = await fetchAllCategories()

  // 1. Match by CATEGORY_HIERARCHY group slug (e.g., "venues", "planning", "bars-nightlife")
  const hierarchyGroup = CATEGORY_HIERARCHY.find((g) => g.slug === slug)
  if (hierarchyGroup) {
    // Find the DB category that matches this group's vendorCategory
    const vendorCatSlug = hierarchyGroup.vendorCategory
    const dbCat = allCategories.find(
      (c) =>
        c.slug === vendorCatSlug ||
        c.slug === vendorCatSlug.replace(/_/g, '-') ||
        c.slug === (CATEGORY_SLUG_MAP[vendorCatSlug] || '')
    )
    return {
      name: hierarchyGroup.label,
      slug: hierarchyGroup.slug,
      vendorCategory: hierarchyGroup.vendorCategory,
      description: `Discover the best ${hierarchyGroup.label.toLowerCase()}. Browse verified vendors, read reviews, and book with confidence on Planviry.`,
      group: hierarchyGroup,
      vendorCount: dbCat?.vendorCount ?? 0,
    }
  }

  // 2. Match by CATEGORY_SLUG_MAP value (e.g., "wedding-venues", "wedding-djs")
  const mapEntry = Object.entries(CATEGORY_SLUG_MAP).find(
    ([, pageSlug]) => pageSlug === slug
  )
  if (mapEntry) {
    const [vendorCat] = mapEntry
    const group = CATEGORY_HIERARCHY.find((g) => g.vendorCategory === vendorCat) ?? null
    const dbCat = allCategories.find(
      (c) =>
        c.slug === vendorCat ||
        c.slug === vendorCat.replace(/_/g, '-') ||
        c.slug === slug
    )
    const label = group?.label ?? dbCat?.name ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    return {
      name: label,
      slug: slug,
      vendorCategory: vendorCat,
      description: `Find the best ${label.toLowerCase()}. Browse verified vendors, read reviews, and book with confidence on Planviry.`,
      group,
      vendorCount: dbCat?.vendorCount ?? 0,
    }
  }

  // 3. Match by DB category slug (e.g., "wedding-venue", "photography")
  const dbCategory = allCategories.find(
    (c) => c.slug === slug || c.slug.replace(/_/g, '-') === slug
  )
  if (dbCategory) {
    const vendorCat = dbCategory.slug.includes('-')
      ? dbCategory.slug.replace(/-/g, '_')
      : dbCategory.slug
    const group =
      CATEGORY_HIERARCHY.find((g) => g.vendorCategory === vendorCat) ?? null
    const label = group?.label ?? dbCategory.name
    return {
      name: label,
      slug: slug,
      vendorCategory: vendorCat,
      description: `Find the best ${label.toLowerCase()}. Browse verified vendors, read reviews, and book with confidence on Planviry.`,
      group,
      vendorCount: dbCategory.vendorCount,
    }
  }

  return null
}

// ─── Params Type ────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>
}

// ─── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await resolveCategory(slug)

  if (!category) {
    return { title: 'Category Not Found | Planviry' }
  }

  const title = `${category.name} | Planviry`
  const description = `Find the best ${category.name.toLowerCase()}. Browse ${category.vendorCount} top-rated vendors on Planviry.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Planviry',
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  }
}

// ─── JSON-LD Structured Data ────────────────────────────────────────────────────

function buildItemListJsonLd(
  categoryName: string,
  slug: string,
  vendors: SEOVendor[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryName} | Planviry`,
    description: `Top-rated ${categoryName.toLowerCase()}`,
    numberOfItems: vendors.length,
    itemListElement: vendors.slice(0, 20).map((vendor, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: vendor.name,
        url: `/vendor/${vendor.slug}`,
        address: vendor.address
          ? { '@type': 'PostalAddress', streetAddress: vendor.address }
          : undefined,
        telephone: vendor.phone || undefined,
        aggregateRating:
          (vendor.rating ?? 0) > 0
            ? {
                '@type': 'AggregateRating',
                ratingValue: vendor.rating,
                reviewCount: vendor.reviewCount,
              }
            : undefined,
      },
    })),
  }
}

// ─── Star Rating Helper ─────────────────────────────────────────────────────────

function renderStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}

// ─── Price Range Display ────────────────────────────────────────────────────────

function renderPriceRange(range: string): string {
  if (!range) return ''
  const map: Record<string, string> = {
    $: 'Budget-Friendly',
    $$: 'Moderate',
    $$$: 'Upscale',
    $$$$: 'Premium',
  }
  return map[range] ?? range
}

// ─── Page Component ─────────────────────────────────────────────────────────────

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await resolveCategory(slug)

  if (!category) {
    notFound()
  }

  const vendors = await fetchVendorsByCategory(category.vendorCategory)

  const subcategories = category.group?.subcategories ?? []

  // Related categories: other groups from CATEGORY_HIERARCHY (max 6, excluding current)
  const relatedCategories = CATEGORY_HIERARCHY.filter(
    (g) => g.slug !== category.group?.slug
  ).slice(0, 6)

  const jsonLd = buildItemListJsonLd(category.name, slug, vendors)

  return <AppLayoutShell>
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Marketplace */}
        <a
          href="/#/marketplace"
          className="inline-block text-sm text-[#cc6600] hover:underline mb-6"
        >
          &larr; Back to Marketplace
        </a>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-stone-500">
            <li>
              <a href="/" className="text-[#cc6600] hover:underline">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/#/marketplace" className="text-[#cc6600] hover:underline">
                Categories
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-stone-900 font-medium" aria-current="page">
              {category.name}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            {category.name}
          </h1>
          <p className="text-lg text-stone-600 max-w-3xl">
            {category.description}
          </p>
          {vendors.length > 0 && (
            <p className="mt-2 text-sm text-stone-500">
              {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} found
            </p>
          )}
        </header>

        {/* Sub-categories */}
        {subcategories.length > 0 && (
          <section className="mb-10" aria-labelledby="subcategories-heading">
            <h2 id="subcategories-heading" className="text-xl font-bold text-stone-900 mb-4">
              Browse {category.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <a
                  key={sub.slug}
                  href={`/categories/${slug}/${sub.slug}`}
                  className="inline-block rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 hover:border-stone-400 hover:text-[#cc6600] transition-colors"
                >
                  {sub.label}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Vendor List */}
        <section aria-labelledby="vendors-heading" className="mb-12">
          <h2 id="vendors-heading" className="text-xl font-bold text-stone-900 mb-6">
            Top-Rated {category.name}
          </h2>

          {vendors.length === 0 ? (
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-8 text-center">
              <p className="text-stone-600 mb-2">
                No vendors found in this category yet.
              </p>
              <p className="text-sm text-stone-500">
                Check back soon or browse other categories.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vendors.map((vendor) => (
                <article
                  key={vendor.id}
                  className="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-400 transition-colors flex flex-col"
                >
                  {/* Vendor Name */}
                  <h3 className="text-lg font-bold text-stone-900 mb-1">
                    <a
                      href={`/vendor/${vendor.slug}`}
                      className="hover:text-[#cc6600] transition-colors"
                    >
                      {vendor.name}
                    </a>
                  </h3>

                  {/* Category Label */}
                  <p className="text-xs text-stone-500 mb-2 uppercase tracking-wide">
                    {vendor.categoryName}
                  </p>

                  {/* Address */}
                  {vendor.address && (
                    <p className="text-sm text-stone-600 mb-1">
                      {vendor.address}
                    </p>
                  )}

                  {/* Price Range */}
                  {vendor.priceRange && (
                    <p className="text-sm text-stone-600 mb-1">
                      {renderPriceRange(vendor.priceRange)}{' '}
                      <span className="text-stone-400">({vendor.priceRange})</span>
                    </p>
                  )}

                  {/* Rating */}
                  {(vendor.rating ?? 0) > 0 && (
                    <p className="text-sm mb-1">
                      <span className="text-amber-500" aria-label={`${vendor.rating} out of 5 stars`}>
                        {renderStars(vendor.rating!)}
                      </span>
                      <span className="text-stone-500 ml-1">
                        ({vendor.reviewCount ?? 0} review{vendor.reviewCount !== 1 ? 's' : ''})
                      </span>
                    </p>
                  )}

                  {/* Bio Excerpt */}
                  {vendor.bio && (
                    <p className="text-sm text-stone-600 mt-2 mb-3 line-clamp-3">
                      {vendor.bio.length > 150
                        ? `${vendor.bio.substring(0, 150)}…`
                        : vendor.bio}
                    </p>
                  )}

                  {/* Tags */}
                  {vendor.tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1 pt-2">
                      {vendor.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
                        >
                          {tag}
                        </span>
                      ))}
                      {vendor.tags.length > 5 && (
                        <span className="inline-block rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-400">
                          +{vendor.tags.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Verified / Featured Badges */}
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-100">
                    {vendor.isVerified && (
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded px-2 py-0.5">
                        Verified
                      </span>
                    )}
                    {vendor.isFeatured && (
                      <span className="text-xs font-medium text-amber-700 bg-amber-50 rounded px-2 py-0.5">
                        Featured
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <section aria-labelledby="related-heading" className="mb-12">
            <h2 id="related-heading" className="text-xl font-bold text-stone-900 mb-4">
              Related Categories
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCategories.map((group) => (
                <a
                  key={group.slug}
                  href={`/category/${group.slug}`}
                  className="block rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
                >
                  <h3 className="text-base font-bold text-stone-900 mb-1">
                    {group.label}
                  </h3>
                  <p className="text-sm text-stone-600">
                    {group.subcategories.length} sub-categories
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </AppLayoutShell>

}
