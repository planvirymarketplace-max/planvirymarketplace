'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import Link from 'next/link'
import { VERTICALS } from '@/lib/planviry-data'
import { ChevronRight } from 'lucide-react'

export default function CategoriesPage() {
  return <AppLayoutShell>
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-6">
            <Link href="/" className="hover:text-white/70 transition-colors">Planviry</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/60">Categories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Browse by Category
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed">
            Explore {VERTICALS.length} verticals and hundreds of subcategories to find the perfect vendor for your event.
          </p>
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {VERTICALS.map((vertical) => (
            <Link
              key={vertical.slug}
              href={`/book?cat=${vertical.slug}`}
              className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
            >
              {/* Gradient header */}
              <div className={`bg-gradient-to-r ${vertical.gradient} text-white px-5 py-4`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{vertical.icon}</span>
                  <div>
                    <h2 className="font-bold text-sm leading-tight">{vertical.name}</h2>
                    <p className="text-[10px] text-white/70 mt-0.5">{vertical.subCategories.length} subcategories</p>
                  </div>
                </div>
              </div>

              {/* Subcategories */}
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{vertical.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {vertical.subCategories.slice(0, 5).map((sub) => (
                    <span
                      key={sub}
                      className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full group-hover:bg-coral/5 group-hover:text-coral transition-colors"
                    >
                      {sub}
                    </span>
                  ))}
                  {vertical.subCategories.length > 5 && (
                    <span className="text-[11px] font-bold text-coral px-2 py-1">
                      +{vertical.subCategories.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Browse our full vendor directory with faceted filters for category, price, location, rating, and availability.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg"
            >
              Browse Full Directory
              <ChevronRight className="h-4 w-4" />
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
    </div>
  </AppLayoutShell>

}
