'use client'

import Link from 'next/link'
import {
  ArrowRight, Sparkles, Building2, Heart, Zap, Star, Users,
  Camera, Scissors, Car, Music, Wine, Cake, PartyPopper,
} from 'lucide-react'

const CATEGORIES = [
  { name: 'Event Planning', slug: 'event-planning-coordination', icon: Sparkles, color: 'from-violet-500 to-violet-600', count: 25 },
  { name: 'Venues & Spaces', slug: 'venues-event-spaces', icon: Building2, color: 'from-emerald-500 to-emerald-600', count: 92 },
  { name: 'Catering & Food', slug: 'catering-food', icon: Cake, color: 'from-orange-500 to-orange-600', count: 11 },
  { name: 'DJs & Entertainment', slug: 'djs-entertainment', icon: Music, color: 'from-purple-500 to-purple-600', count: 18 },
  { name: 'Photography & Video', slug: 'photography-video', icon: Camera, color: 'from-cyan-500 to-cyan-600', count: 5 },
  { name: 'Rentals & Equipment', slug: 'rentals-equipment', icon: Zap, color: 'from-amber-500 to-amber-600', count: 72 },
  { name: 'Wedding Services', slug: 'wedding-services', icon: Heart, color: 'from-red-500 to-red-600', count: 13 },
  { name: 'Bars & Nightlife', slug: 'bars-nightlife', icon: Star, color: 'from-stone-600 to-stone-700', count: 38 },
  { name: 'Party Supplies', slug: 'party-supplies-decorations', icon: PartyPopper, color: 'from-pink-500 to-pink-600', count: 10 },
  { name: 'Bartending', slug: 'bartending-spirits', icon: Wine, color: 'from-rose-500 to-rose-600', count: 4 },
  { name: 'Beauty & Wellness', slug: 'beauty-wellness', icon: Scissors, color: 'from-fuchsia-500 to-fuchsia-600', count: 4 },
  { name: 'Transportation', slug: 'transportation', icon: Car, color: 'from-sky-500 to-sky-600', count: 1 },
  { name: 'Restaurants', slug: 'restaurants-dining', icon: Cake, color: 'from-teal-500 to-teal-600', count: 60 },
  { name: 'Birthday & Parties', slug: 'birthday-parties', icon: PartyPopper, color: 'from-yellow-500 to-yellow-600', count: 16 },
  { name: 'Dining Events', slug: 'dining-experiences', icon: Wine, color: 'from-lime-500 to-lime-600', count: 167 },
  { name: 'Other Services', slug: 'other-services', icon: Users, color: 'from-stone-400 to-stone-500', count: 16 },
  { name: 'Bars Near Landmarks', slug: 'bars-near-landmarks', icon: Star, color: 'from-stone-500 to-stone-600', count: 10 },
]

// Popular search tags per category (top 3-4)
const CATEGORY_HIGHLIGHTS: Record<string, string[]> = {
  'event-planning-coordination': ['Event Planners', 'Wedding Planners', 'Corporate Events', 'Party Planners'],
  'venues-event-spaces': ['Party Venues', 'Event Venues', 'Small Venues', 'Wedding Venues'],
  'catering-food': ['Caterers', 'Food Trucks', 'Corporate Catering'],
  'djs-entertainment': ['DJs', 'MCs', 'Karaoke', 'Live Music'],
  'photography-video': ['Photographers', 'Videographers', 'Photo Booths'],
  'rentals-equipment': ['Party Rentals', 'Tent Rentals', 'Equipment', 'Furniture'],
  'wedding-services': ['Wedding Planners', 'Officiants', 'Florists'],
  'bars-nightlife': ['Dance Clubs', 'Lounges', 'Sports Bars', 'Rooftop Bars'],
  'party-supplies-decorations': ['Balloon Services', 'Decorations', 'Party Supplies'],
  'bartending-spirits': ['Mobile Bars', 'Bartenders', 'Cocktail Services'],
  'beauty-wellness': ['Hair Stylists', 'Makeup Artists', 'Spa Services'],
  'transportation': ['Limo Services', 'Shuttle Services'],
  'restaurants-dining': ['Private Dining', 'Brunch Spots', 'Fine Dining'],
  'birthday-parties': ['Birthday Venues', 'Kids Parties', 'Adult Birthdays'],
  'dining-experiences': ['Tasting Menus', 'Food Tours', 'Chef Events'],
  'other-services': ['Security', 'Event Staff', 'Cleaning'],
  'bars-near-landmarks': ['Downtown Bars', 'Lakefront Bars', 'Third Ward Bars'],
}

export function BrowseByCategory() {
  // Show top 8 categories prominently, rest in a compact grid
  const featured = CATEGORIES.slice(0, 8)
  const more = CATEGORIES.slice(8)

  return (
    <section className="relative w-full bg-stone-950">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-16 md:py-24">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[1px] w-8 bg-white/30" />
          <p className="font-utility text-[10px] uppercase tracking-widest text-white/40">
            500+ Pages
          </p>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
          Browse Milwaukee&apos;s Best<br />
          <span className="text-white/50">Event Vendors by Category</span>
        </h2>
        <p className="mt-4 text-sm md:text-base text-white/40 max-w-xl leading-relaxed">
          From DJs and venues to caterers and photographers - find curated providers for every type of Milwaukee event.
        </p>

        {/* Featured categories grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((cat) => {
            const Icon = cat.icon
            const highlights = CATEGORY_HIGHLIGHTS[cat.slug] || []
            return (
              <Link
                key={cat.slug}
                href={`/browse#${cat.slug}`}
                className="group relative border border-white/10 rounded-xl overflow-hidden hover:border-white/25 transition-all duration-300"
              >
                {/* Gradient top accent */}
                <div className={`h-1 bg-gradient-to-r ${cat.color}`} />

                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${cat.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-white group-hover:text-white/90">
                        {cat.name}
                      </p>
                      <p className="text-[9px] uppercase tracking-widest text-white/30">
                        {cat.count} page{cat.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Highlights */}
                  {highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {highlights.map((h) => (
                        <span
                          key={h}
                          className="text-[9px] font-semibold uppercase tracking-wider text-white/30 border border-white/10 rounded px-2 py-0.5"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-4 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/60 transition-colors">
                    <span>Browse</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* More categories compact row */}
        {more.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {more.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.slug}
                  href={`/browse#${cat.slug}`}
                  className="group inline-flex items-center gap-2 border border-white/10 rounded-lg px-4 py-2.5 hover:border-white/25 transition-all duration-200"
                >
                  <Icon className="h-4 w-4 text-white/40 group-hover:text-white/70" />
                  <span className="text-xs font-semibold text-white/50 group-hover:text-white/80">
                    {cat.name}
                  </span>
                  <span className="text-[9px] text-white/20">
                    {cat.count}
                  </span>
                </Link>
              )
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 bg-white text-stone-900 px-8 py-4 rounded-xl font-display font-bold text-sm hover:bg-stone-100 transition-colors shadow-lg"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
