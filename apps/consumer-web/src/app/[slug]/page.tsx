import { AppLayoutShell } from '@/components/AppLayoutShell'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { VERTICALS, US_STATES, TOP_CITIES, getVerticalBySlug, type Vertical } from '@/lib/planviry-data'
import { getVendorsByCategory, type VendorSummary } from '@/lib/static-data'
import { getCategoryHierarchy } from '@/lib/static-data'
import { SeoLanding } from '@/components/seo/SeoLanding'
import {
  Star, MapPin, ChevronRight, Home, Search, SlidersHorizontal,
  Building2, ClipboardList, UtensilsCrossed, Music, Camera,
  Palette, Sparkles, Plane, ArrowRight,
} from 'lucide-react'

// ─── ISR Configuration ──────────────────────────────────────────────────────
export const revalidate = 3600 // 1 hour
export const dynamicParams = true

// ─── Static Params from VERTICALS + US STATES ───────────────────────────────
export async function generateStaticParams() {
  const verticalParams = VERTICALS.map(v => ({ slug: v.slug }))
  const stateParams = US_STATES.map(s => ({ slug: s.slug }))
  return [...verticalParams, ...stateParams]
}

// ─── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  // Check if vertical
  const vertical = getVerticalBySlug(slug)
  if (vertical) {
    const title = `${vertical.name} - Browse Top Vendors | Planviry`
    const description = vertical.description
    return {
      title,
      description,
      alternates: { canonical: `https://planviry.com/${slug}` },
      openGraph: { title, description, url: `https://planviry.com/${slug}`, siteName: 'Planviry', type: 'website' },
      twitter: { card: 'summary_large_image', title, description },
    }
  }

  // Check if state
  const state = US_STATES.find(s => s.slug === slug)
  if (state) {
    const title = `${state.name} Event Vendors - Find Local Services | Planviry`
    const description = `Browse top event vendors in ${state.name}. Find venues, caterers, DJs, photographers, and more across ${state.name}.`
    return {
      title,
      description,
      alternates: { canonical: `https://planviry.com/${slug}` },
      openGraph: { title, description, url: `https://planviry.com/${slug}`, siteName: 'Planviry', type: 'website' },
      twitter: { card: 'summary_large_image', title, description },
    }
  }

  return {}
}

// ─── Icon Map ───────────────────────────────────────────────────────────────
const VERTICAL_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'venues-spaces': Building2,
  'event-planning': ClipboardList,
  'catering-food': UtensilsCrossed,
  'entertainment': Music,
  'production-tech': Camera,
  'decor-rentals': Palette,
  'beauty-attire': Sparkles,
  'travel-lodging': Plane,
}

// ─── Sub-Category Card ──────────────────────────────────────────────────────
function SubCategoryCard({ name, verticalSlug }: { name: string; verticalSlug: string }) {
  const subSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return (
    <Link
      href={`/categories/${verticalSlug}/${subSlug}`}
      className="group flex items-center justify-between p-4 bg-white border border-gray-200 hover:border-black transition-colors"
    >
      <span className="text-sm font-medium text-black group-hover:text-black">{name}</span>
      <ArrowRight size={14} className="text-gray-400 group-hover:text-black transition-colors" />
    </Link>
  )
}

// ─── Vendor Card ─────────────────────────────────────────────────────────────
function VendorCard({ vendor }: { vendor: VendorSummary }) {
  const fullStars = Math.round(vendor.rating)
  return (
    <Link href={`/v/${vendor.slug}`} className="group block">
      <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg hover:border-black transition-all">
        <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {vendor.imageUrl ? (
            <img src={vendor.imageUrl} alt={vendor.businessName} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Building2 size={32} className="text-gray-300" />
            </div>
          )}
          {vendor.isVerified && (
            <span className="absolute top-2 right-2 bg-white text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-black/10">Verified</span>
          )}
        </div>
        <div className="p-4 flex flex-col gap-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 px-2 py-0.5 self-start">
            {vendor.subCategory || vendor.category}
          </span>
          <h3 className="text-sm font-bold text-black leading-snug group-hover:underline">{vendor.businessName}</h3>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className={i < fullStars ? 'fill-black text-black' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-xs font-semibold text-black">{vendor.rating.toFixed(1)}</span>
            {vendor.reviewCount > 0 && <span className="text-xs text-gray-500">({vendor.reviewCount})</span>}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={11} />
            <span>{vendor.city}, {vendor.state}</span>
          </div>
          {vendor.priceRange && (
            <span className="text-[10px] font-bold text-black border border-black px-2 py-0.5 self-start">{vendor.priceRange}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Related Verticals ──────────────────────────────────────────────────────
function RelatedVerticals({ currentSlug }: { currentSlug: string }) {
  const related = VERTICALS.filter(v => v.slug !== currentSlug)
  return (
    <div className="mt-16 pt-10 border-t border-gray-200">
      <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-5">Other Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {related.map(v => {
          const Icon = VERTICAL_ICONS[v.slug] ?? Building2
          return (
            <Link key={v.slug} href={`/${v.slug}`} className="group flex items-center gap-3 p-3 border border-gray-200 hover:border-black transition-colors">
              <div className="flex items-center justify-center w-9 h-9 bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors">
                <Icon size={18} />
              </div>
              <span className="text-sm font-medium text-black">{v.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Check if it's a vertical
  const vertical = getVerticalBySlug(slug)
  if (vertical) {
    return <VerticalPage slug={slug} vertical={vertical} />
  }

  // Check if it's a US state
  const state = US_STATES.find(s => s.slug === slug)
  if (state) {
    return <SeoLanding pageType="state" stateSlug={slug} />
  }

  // Neither vertical nor state → 404
  return notFound()
}

// ─── Vertical Page (async, with data fetching) ──────────────────────────────
async function VerticalPage({ slug, vertical }: { slug: string; vertical: Vertical }) {
  const vendors = await getVendorsByCategory(slug, 24)
  const taxonomy = getCategoryHierarchy()
  const l1Category = taxonomy.find(c => c.slug === slug)

  return <AppLayoutShell>
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
            <Home size={13} />
            <span>Home</span>
          </Link>
          <ChevronRight size={13} className="text-gray-400" />
          <span className="text-black">{vertical.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{vertical.icon}</span>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">Browse by Category</p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight">{vertical.name}</h1>
          <p className="mt-3 text-black/60 text-base max-w-2xl">{vertical.description}</p>
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <span className="text-sm font-medium text-black/70">
              <strong className="text-black">{vendors.length > 0 ? `${vendors.length}+` : 'Browse'}</strong>{' '}
              vendors in {vertical.name}
            </span>
            <Link href="/vendors" className="text-sm text-gray-500 hover:text-black underline underline-offset-4 transition-colors">
              Browse all vendors
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                  <SlidersHorizontal size={12} /> Sub-categories
                </h3>
                <div className="space-y-1">
                  {vertical.subCategories.map(sub => (
                    <SubCategoryCard key={sub} name={sub} verticalSlug={slug} />
                  ))}
                </div>
              </div>
              {l1Category && l1Category.level2.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-3">Category Details</h3>
                  <div className="space-y-1">
                    {l1Category.level2.map(l2 => (
                      <Link key={l2.slug} href={`/categories/${slug}/${l2.slug}`} className="flex items-center justify-between p-3 text-sm text-gray-700 hover:text-black hover:bg-gray-50 transition-colors">
                        <span>{l2.name}</span>
                        <ChevronRight size={12} className="text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Vendor grid */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-black">Top {vertical.name} Vendors</h2>
              <Link href={`/vendors?vertical=${slug}`} className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                <Search size={13} /> Search &amp; filter
              </Link>
            </div>
            {vendors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {vendors.map(v => (
                  <VendorCard key={v.id} vendor={v} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-gray-300 rounded-xl">
                <Building2 size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm mb-2">No vendors listed yet in {vertical.name}.</p>
                <Link href="/vendor/onboarding" className="text-sm text-black underline underline-offset-4 hover:text-gray-700">
                  List your business &rarr;
                </Link>
              </div>
            )}
            <RelatedVerticals currentSlug={slug} />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-2xl bg-black text-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-2">Own a business?</p>
            <h2 className="text-xl sm:text-2xl font-semibold">List your {vertical.name} on Planviry</h2>
            <p className="text-gray-400 text-sm mt-1">Join the largest event vendor marketplace. Free to claim your listing.</p>
          </div>
          <Link href="/vendor/onboarding" className="flex-shrink-0 px-6 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-gray-100 transition-colors">
            Get Listed Free
          </Link>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: vertical.name,
            description: vertical.description,
            url: `https://planviry.com/${slug}`,
            isPartOf: { '@type': 'WebSite', name: 'Planviry', url: 'https://planviry.com' },
            ...(vendors.length > 0 ? {
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: vendors.length,
                itemListElement: vendors.slice(0, 10).map((v, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  item: {
                    '@type': 'LocalBusiness',
                    name: v.businessName,
                    url: `https://planviry.com/v/${v.slug}`,
                    address: { '@type': 'PostalAddress', addressLocality: v.city, addressRegion: v.state },
                    ...(v.rating > 0 ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: v.rating, reviewCount: v.reviewCount } } : {}),
                  },
                })),
              },
            } : {}),
          }),
        }}
      />
    </div>
  </AppLayoutShell>

}
