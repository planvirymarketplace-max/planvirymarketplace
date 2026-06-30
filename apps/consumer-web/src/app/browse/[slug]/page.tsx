import { AppLayoutShell } from '@/components/AppLayoutShell'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EXPERIENCES, getExperienceBySlug } from '@/data/experiences'
import {
  ArrowRight,
  Star,
  MapPin,
  Shield,
  Zap,
  ChevronRight,
  Sparkles,
  Building2,
  Heart,
  Music,
  Camera,
  Cake,
  Wine,
  Car,
  PartyPopper,
  Scissors,
  Users,
} from 'lucide-react'

// ─── Category → DB vendor category mapping ──────────────────────
const CATEGORY_TO_DB_MAP: Record<string, string[]> = {
  'event-planning-coordination': ['event_planner', 'event_planning', 'planner'],
  'venues-event-spaces': ['venue', 'event_space', 'banquet_hall', 'wedding_venue'],
  'catering-food': ['caterer', 'catering', 'food_service'],
  'rentals-equipment': ['rental', 'equipment_rental', 'party_rental'],
  'party-supplies-decorations': ['party_supplies', 'decorations', 'balloon_service', 'florist'],
  'bartending-spirits': ['bartender', 'bartending', 'mobile_bar'],
  'djs-entertainment': ['dj', 'entertainer', 'musician', 'emcee'],
  'photography-video': ['photographer', 'videographer', 'photo_booth'],
  'beauty-wellness': ['beauty', 'hair_stylist', 'makeup_artist'],
  'wedding-services': ['wedding_planner', 'wedding_venue', 'officiant', 'florist'],
  'bars-nightlife': ['bar', 'nightclub', 'lounge'],
  'restaurants-dining': ['restaurant', 'dining'],
  'bars-near-landmarks': ['bar', 'nightclub'],
  'dining-experiences': ['restaurant', 'dining', 'caterer'],
  'birthday-parties': ['party_planner', 'venue', 'entertainer', 'dj'],
  'other-services': ['other'],
  'transportation': ['transportation', 'limo', 'shuttle'],
}

// ─── Category icons ─────────────────────────────────────────────
const CAT_ICONS: Record<string, React.ReactNode> = {
  'event-planning-coordination': <Sparkles className="h-5 w-5" />,
  'venues-event-spaces': <Building2 className="h-5 w-5" />,
  'catering-food': <Cake className="h-5 w-5" />,
  'rentals-equipment': <Zap className="h-5 w-5" />,
  'party-supplies-decorations': <PartyPopper className="h-5 w-5" />,
  'bartending-spirits': <Wine className="h-5 w-5" />,
  'djs-entertainment': <Music className="h-5 w-5" />,
  'photography-video': <Camera className="h-5 w-5" />,
  'beauty-wellness': <Scissors className="h-5 w-5" />,
  'wedding-services': <Heart className="h-5 w-5" />,
  'bars-nightlife': <Star className="h-5 w-5" />,
  'restaurants-dining': <Cake className="h-5 w-5" />,
  'bars-near-landmarks': <Star className="h-5 w-5" />,
  'dining-experiences': <Wine className="h-5 w-5" />,
  'birthday-parties': <PartyPopper className="h-5 w-5" />,
  'other-services': <Users className="h-5 w-5" />,
  'transportation': <Car className="h-5 w-5" />,
}

const CAT_COLORS: Record<string, string> = {
  'event-planning-coordination': 'bg-violet-50 text-violet-700 border-violet-200',
  'venues-event-spaces': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'catering-food': 'bg-orange-50 text-orange-700 border-orange-200',
  'rentals-equipment': 'bg-amber-50 text-amber-700 border-amber-200',
  'party-supplies-decorations': 'bg-pink-50 text-pink-700 border-pink-200',
  'bartending-spirits': 'bg-rose-50 text-rose-700 border-rose-200',
  'djs-entertainment': 'bg-purple-50 text-purple-700 border-purple-200',
  'photography-video': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'beauty-wellness': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  'wedding-services': 'bg-red-50 text-red-700 border-red-200',
  'bars-nightlife': 'bg-stone-50 text-stone-700 border-stone-200',
  'restaurants-dining': 'bg-teal-50 text-teal-700 border-teal-200',
  'bars-near-landmarks': 'bg-stone-50 text-stone-700 border-stone-200',
  'dining-experiences': 'bg-lime-50 text-lime-700 border-lime-200',
  'birthday-parties': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'other-services': 'bg-stone-50 text-stone-700 border-stone-200',
  'transportation': 'bg-sky-50 text-sky-700 border-sky-200',
}

// ─── Helpers ─────────────────────────────────────────────────────
function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen).replace(/\s+\S*$/, '') + '…'
}

function renderStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}

// ─── Page Component ──────────────────────────────────────────────
export default async function BrowseSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = getExperienceBySlug(slug)

  if (!page) {
    notFound()
  }

  // Fetch vendors from DB matching this category
  // TODO: migrate this lookup to Supabase (vendor_profiles joined to
  // categories + reviews). Previously this used the Prisma stub which
  // returned an empty array, so the page rendered with no vendors.
  const rawVendors: Array<{
    name: string
    slug: string
    address?: string | null
    phone?: string | null
    reviews: Array<{ rating: number }>
  }> = []

  const vendors = rawVendors.map((v) => {
    const reviewCount = v.reviews.length
    const averageRating = reviewCount > 0
      ? v.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : null
    return { ...v, reviewCount, averageRating }
  })

  // Related pages
  const related = page.relatedSlugs
    .map((s) => EXPERIENCES.find((e) => e.slug === s))
    .filter(Boolean) as typeof EXPERIENCES

  const catIcon = CAT_ICONS[page.categorySlug] || <Star className="h-5 w-5" />
  const catColor = CAT_COLORS[page.categorySlug] || 'bg-stone-50 text-stone-700 border-stone-200'

  // JSON-LD
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: page.searchTag,
    description: page.metaDescription,
    numberOfItems: vendors.length,
    itemListElement: vendors.slice(0, 10).map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: v.name,
        url: `https://planviry.com/v/${v.slug}`,
        address: v.address ? { '@type': 'PostalAddress', streetAddress: v.address } : undefined,
        telephone: v.phone || undefined,
        aggregateRating:
          v.averageRating && v.reviewCount > 0
            ? {
                '@type': 'AggregateRating',
                ratingValue: v.averageRating.toFixed(1),
                reviewCount: v.reviewCount,
              }
            : undefined,
      },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://planviry.com' },
      { '@type': 'ListItem', position: 2, name: 'Browse', item: 'https://planviry.com/browse' },
      { '@type': 'ListItem', position: 3, name: page.category, item: `https://planviry.com/browse/${page.slug}` },
    ],
  }

  return <AppLayoutShell>
    <div className="min-h-screen bg-white flex flex-col">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── HERO ──────────────────────────────────────── */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
                             radial-gradient(circle at 75% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-24">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-6">
            <Link href="/" className="hover:text-white/70 transition-colors">Planviry</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/browse" className="hover:text-white/70 transition-colors">Browse</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/60">{page.category}</span>
          </div>

          {/* Category badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="text-white/70">{catIcon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{page.category}</span>
          </div>

          {/* H1 */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-4xl">
            {page.heroHeadline}
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl">
            {page.heroSubtext}
          </p>

          {/* Vendor count + CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 bg-white text-stone-900 px-8 py-4 rounded-xl font-display font-bold text-sm hover:bg-stone-100 transition-colors shadow-lg"
            >
              {page.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {vendors.length > 0 && (
              <div className="flex items-center gap-2 text-white/50">
                <span className="font-display text-2xl font-bold text-white">{vendors.length}</span>
                <span className="text-[10px] uppercase tracking-widest">Provider{vendors.length !== 1 ? 's' : ''} Listed</span>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-widest text-white/40">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Verified Vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Real Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Nationwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BODY CONTENT ──────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl">
          {page.bodyContent.map((paragraph, i) => (
            <p key={i} className="text-stone-600 leading-relaxed text-sm sm:text-base mb-6 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* ─── CURATED PROVIDERS ──────────────────────────── */}
      {vendors.length > 0 ? (
        <section className="bg-stone-50 border-y border-stone-100">
          <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-8 bg-stone-900" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Top {page.category} Providers
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendors.map((v) => (
                <Link
                  key={v.id}
                  href={`/v/${v.slug}`}
                  className="group bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg hover:border-stone-300 transition-all duration-200"
                >
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    {v.isFeatured && (
                      <span className="text-[8px] font-bold uppercase tracking-widest text-amber-600 border border-amber-200 bg-amber-50 rounded px-2 py-0.5">
                        Featured
                      </span>
                    )}
                    {v.isVerified && (
                      <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600 border border-emerald-200 bg-emerald-50 rounded px-2 py-0.5">
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-base font-bold text-stone-900 group-hover:text-stone-700 leading-tight">
                    {v.name}
                  </h3>

                  {/* Category */}
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-stone-400">
                    {v.category.replace(/_/g, ' ')}
                  </p>

                  {/* Address */}
                  {v.address && (
                    <p className="mt-2 text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {v.address}
                    </p>
                  )}

                  {/* Bio */}
                  {v.bio && (
                    <p className="mt-3 text-sm text-stone-500 line-clamp-2 leading-relaxed">
                      {truncate(v.bio, 120)}
                    </p>
                  )}

                  {/* Bottom: Price + Rating */}
                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
                    {v.priceRange && (
                      <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                        {v.priceRange}
                      </span>
                    )}
                    {v.averageRating !== null && v.reviewCount > 0 && (
                      <span className="text-sm text-amber-500">
                        {renderStars(v.averageRating)}
                        <span className="ml-1 text-[9px] text-stone-400">({v.reviewCount})</span>
                      </span>
                    )}
                    {!v.averageRating && !v.priceRange && <span />}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-stone-50 border-y border-stone-100">
          <div className="max-w-5xl mx-auto px-4 py-16 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 text-stone-400 mb-4">
              {catIcon}
            </div>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              Curating the Best {page.category}
            </h2>
            <p className="mt-4 text-stone-500 max-w-md mx-auto">
              We&apos;re building our network of top-rated {page.category.toLowerCase()}. Check back soon or browse our full directory.
            </p>
            <Link
              href="/directory"
              className="mt-6 inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-display font-bold text-sm hover:bg-stone-800 transition-colors"
            >
              Browse Full Directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ─── CTA SECTION ──────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
          Ready to find your {page.category.toLowerCase()}?
        </h2>
        <p className="mt-4 text-stone-500 max-w-xl mx-auto">
          Browse verified vendors, compare pricing, and book the perfect provider for your event - all on Planviry.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-xl font-display font-bold text-sm hover:bg-stone-800 transition-colors shadow-lg"
          >
            Browse All Providers
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 text-sm font-semibold transition-colors"
          >
            Contact us
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* ─── RELATED CATEGORIES ──────────────────────── */}
      {related.length > 0 && (
        <section className="bg-stone-50 border-t border-stone-100">
          <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-8 bg-stone-900" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Related Categories
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((rel) => rel && (
                <Link
                  key={rel.slug}
                  href={`/browse/${rel.slug}`}
                  className="group bg-white border border-stone-200 rounded-xl p-5 hover:shadow-md hover:border-stone-300 transition-all duration-200"
                >
                  <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2">{rel.category}</p>
                  <h3 className="font-display text-sm font-bold text-stone-900 group-hover:text-stone-700 leading-tight line-clamp-2">
                    {rel.heroHeadline}
                  </h3>
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-stone-500 group-hover:text-stone-700">
                    <span>Browse</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FOOTER ───────────────────────────────────── */}
      <footer className="bg-stone-900 text-white mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-white/40 tracking-wider">
            Planviry - The Premier Event Vendor Marketplace
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[10px] text-white/50 hover:text-white tracking-wider transition-colors">Home</Link>
            <Link href="/browse" className="text-[10px] text-white/50 hover:text-white tracking-wider transition-colors">Browse</Link>
            <Link href="/directory" className="text-[10px] text-white/50 hover:text-white tracking-wider transition-colors">Directory</Link>
          </div>
        </div>
      </footer>
    </div>
  </AppLayoutShell>

}
