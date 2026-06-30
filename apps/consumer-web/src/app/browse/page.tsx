import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import Link from 'next/link'
import { EXPERIENCES } from '@/data/experiences'
import {
  ArrowRight, Sparkles, Building2, Heart, Zap, Star, Users,
  Camera, Scissors, Car, Music, Wine, Cake, PartyPopper,
  ChevronRight, Search, MapPin,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Browse Event Vendors by Category | Planviry',
  description: 'Browse 500+ dedicated category pages for event vendors. From DJs and venues to caterers and photographers - find the perfect provider for your event.',
  keywords: ['event vendors', 'event planning', 'dj', 'venue', 'caterer', 'planviry'],
}

// ─── Group experiences by category ────────────────────────────
function groupByCategory(experiences: typeof EXPERIENCES) {
  const groups: Record<string, { slug: string; experiences: typeof EXPERIENCES }> = {}
  for (const exp of experiences) {
    if (!groups[exp.category]) {
      groups[exp.category] = { slug: exp.categorySlug, experiences: [] }
    }
    groups[exp.category].experiences.push(exp)
  }
  return groups
}

const CAT_ICONS: Record<string, React.ReactNode> = {
  'event-planning-coordination': <Sparkles className="h-6 w-6" />,
  'venues-event-spaces': <Building2 className="h-6 w-6" />,
  'catering-food': <Cake className="h-6 w-6" />,
  'rentals-equipment': <Zap className="h-6 w-6" />,
  'party-supplies-decorations': <PartyPopper className="h-6 w-6" />,
  'bartending-spirits': <Wine className="h-6 w-6" />,
  'djs-entertainment': <Music className="h-6 w-6" />,
  'photography-video': <Camera className="h-6 w-6" />,
  'beauty-wellness': <Scissors className="h-6 w-6" />,
  'wedding-services': <Heart className="h-6 w-6" />,
  'bars-nightlife': <Star className="h-6 w-6" />,
  'restaurants-dining': <Cake className="h-6 w-6" />,
  'bars-near-landmarks': <Star className="h-6 w-6" />,
  'dining-experiences': <Wine className="h-6 w-6" />,
  'birthday-parties': <PartyPopper className="h-6 w-6" />,
  'other-services': <Users className="h-6 w-6" />,
  'transportation': <Car className="h-6 w-6" />,
}

const CAT_COLORS: Record<string, string> = {
  'event-planning-coordination': 'from-violet-500 to-violet-600',
  'venues-event-spaces': 'from-emerald-500 to-emerald-600',
  'catering-food': 'from-orange-500 to-orange-600',
  'rentals-equipment': 'from-amber-500 to-amber-600',
  'party-supplies-decorations': 'from-pink-500 to-pink-600',
  'bartending-spirits': 'from-rose-500 to-rose-600',
  'djs-entertainment': 'from-purple-500 to-purple-600',
  'photography-video': 'from-cyan-500 to-cyan-600',
  'beauty-wellness': 'from-fuchsia-500 to-fuchsia-600',
  'wedding-services': 'from-red-500 to-red-600',
  'bars-nightlife': 'from-stone-600 to-stone-700',
  'restaurants-dining': 'from-teal-500 to-teal-600',
  'bars-near-landmarks': 'from-stone-500 to-stone-600',
  'dining-experiences': 'from-lime-500 to-lime-600',
  'birthday-parties': 'from-yellow-500 to-yellow-600',
  'other-services': 'from-stone-400 to-stone-500',
  'transportation': 'from-sky-500 to-sky-600',
}

export default function BrowseIndexPage() {
  const groups = groupByCategory(EXPERIENCES)
  const sortedCategories = Object.entries(groups).sort(
    (a, b) => b[1].experiences.length - a[1].experiences.length
  )
  const totalPages = EXPERIENCES.length

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ─── HERO ──────────────────────────────────────── */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
                             radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-8">
            <Link href="/" className="hover:text-white/70 transition-colors">Planviry</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/60">Browse</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-4xl">
            Browse Event Vendors,<br />
            <span className="text-white/60">By Category.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl">
            {totalPages} dedicated pages connecting you with the best event vendors - DJs, venues, caterers, photographers, and more. Browse by category to find your perfect provider.
          </p>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-8">
            <div>
              <p className="text-3xl font-bold font-display">{totalPages}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Category Pages</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-display">{sortedCategories.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-display">100%</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Nationwide Coverage</p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-widest text-white/40">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>SEO Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Real Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Verified Vendors</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY CARDS GRID ───────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-[1px] w-8 bg-stone-900" />
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Browse by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCategories.map(([categoryName, data]) => {
            const icon = CAT_ICONS[data.slug] || <Star className="h-6 w-6" />
            const gradient = CAT_COLORS[data.slug] || 'from-stone-500 to-stone-600'
            const topEntries = data.experiences.slice(0, 6)

            return (
              <div
                key={data.slug}
                className="group border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-stone-300 transition-all duration-300"
              >
                {/* Category header */}
                <div className={`bg-gradient-to-r ${gradient} text-white p-5`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      {icon}
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold">{categoryName}</p>
                      <p className="text-[10px] text-white/70">{data.experiences.length} pages</p>
                    </div>
                  </div>
                </div>

                {/* Top entries */}
                <div className="p-4">
                  <div className="space-y-1">
                    {topEntries.map((exp) => (
                      <Link
                        key={exp.slug}
                        href={`/browse/${exp.slug}`}
                        className="flex items-center gap-2 py-2 px-2 rounded-lg text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors group/link"
                      >
                        <ChevronRight className="h-3 w-3 text-stone-300 group-hover/link:text-stone-500" />
                        <span className="line-clamp-1">{exp.searchTag}</span>
                      </Link>
                    ))}
                  </div>
                  {data.experiences.length > 6 && (
                    <Link
                      href={`#${data.slug}`}
                      className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-700 transition-colors px-2"
                    >
                      <span>View all {data.experiences.length}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── ALL PAGES BY CATEGORY ─────────────────────── */}
      {sortedCategories.map(([categoryName, data]) => {
        const icon = CAT_ICONS[data.slug] || <Star className="h-5 w-5" />

        return <AppLayoutShell>
          <section key={data.slug} id={data.slug} className="border-t border-stone-100 scroll-mt-24">
            <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                  {icon}
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
                  {categoryName}
                </h2>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-8 ml-11">
                {data.experiences.length} dedicated pages
              </p>

              {/* Pages grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {data.experiences.map((exp) => (
                  <Link
                    key={exp.slug}
                    href={`/browse/${exp.slug}`}
                    className="group bg-white border border-stone-200 rounded-lg p-4 hover:shadow-md hover:border-stone-300 transition-all duration-200"
                  >
                    <h3 className="font-display text-sm font-semibold text-stone-900 group-hover:text-stone-700 leading-tight line-clamp-2">
                      {exp.searchTag}
                    </h3>
                    <p className="mt-2 text-xs text-stone-500 line-clamp-1">
                      {exp.heroHeadline}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-stone-400 group-hover:text-stone-700 uppercase tracking-widest">
                      <span>Browse</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </AppLayoutShell>

      })}

      {/* ─── CTA SECTION ──────────────────────────────── */}
      <section className="bg-stone-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Browse our full vendor directory with faceted filters for category, price, location, rating, and availability.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 bg-white text-stone-900 px-8 py-4 rounded-xl font-display font-bold text-sm hover:bg-stone-100 transition-colors shadow-lg"
            >
              Browse Full Directory
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold transition-colors"
            >
              Back to Home
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────── */}
      <footer className="bg-stone-900 text-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
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
  )
}
