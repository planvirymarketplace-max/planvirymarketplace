'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CATEGORY_GROUPS } from '@/lib/marketplace-categories'
import seoAreas from '@/lib/seo-areas.json'
import {
  SEO_BY_CATEGORY,
  SEO_CATEGORY_SLUGS,
} from '@/lib/seo-search-strings'
import { STATIC_EVENT_TYPES, EVENT_ICON_MAP } from '@/hooks/use-event-types'
import type { VendorSearchResult } from '@/hooks/use-search-vendors'
import { NAV_CATEGORIES } from '@/lib/directory-filter-data'
import { CategoryDirectoryClient } from './category-client'

/* ────────────────────────────────────────────────────────────
   Hero Section
   ──────────────────────────────────────────────────────────── */
function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/directory?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="bg-white border-b border-black/10">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
          Milwaukee Event Vendor Directory
        </h1>
        <p className="mt-4 text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
          Browse 500+ verified vendors across 10 categories
        </p>
        <form
          onSubmit={handleSearch}
          className="mt-8 flex items-center max-w-xl mx-auto border-2 border-black rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-black/20"
        >
          <div className="pl-5 text-black/40">
            <Search className="h-5 w-5" />
          </div>
          <Input
            type="text"
            placeholder="Search vendors, categories, areas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:border-0 rounded-none h-12 text-base bg-transparent text-black placeholder:text-black/40"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 h-12 text-sm font-semibold hover:bg-black/80 transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   How Unified Booking Works (3 Steps)
   ──────────────────────────────────────────────────────────── */
const STEPS = [
  {
    number: 1,
    title: 'Find Your Vendors',
    description: 'Browse by category, area, or event type',
  },
  {
    number: 2,
    title: 'Compare & Choose',
    description: 'Read reviews, view packages, check availability',
  },
  {
    number: 3,
    title: 'Book Instantly',
    description: 'Secure your date with instant booking or send an inquiry',
  },
]

function HowItWorksSection() {
  return (
    <section className="bg-white py-16 md:py-20 border-b border-black/10">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black text-center">
          How Unified Booking Works
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-black text-black font-bold text-xl">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-black">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-black/60">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   Browse by Category Grid
   ──────────────────────────────────────────────────────────── */
function BrowseByCategorySection() {
  return (
    <section className="bg-white py-16 md:py-20 border-b border-black/10">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Browse by Category
        </h2>
        <p className="mt-2 text-black/60">
          Explore all 10 vendor categories
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CATEGORY_GROUPS.map((group) => {
            const categoryCount = group.categories.length
            const topCategories = group.categories.slice(0, 4)
            return (
              <Link
                key={group.slug}
                href={`/directory/${group.slug}`}
                className="group block rounded-lg border border-black/15 bg-white p-5 hover:border-black hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-black group-hover:underline">
                  {group.name}
                </h3>
                <p className="mt-1 text-xs text-black/50">
                  {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
                </p>
                <ul className="mt-3 space-y-1">
                  {topCategories.map((cat) => (
                    <li
                      key={cat.slug}
                      className="text-sm text-black/70 truncate"
                    >
                      {cat.name}
                    </li>
                  ))}
                  {group.categories.length > 4 && (
                    <li className="text-sm text-black/40">
                      +{group.categories.length - 4} more
                    </li>
                  )}
                </ul>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   Browse by Area
   ──────────────────────────────────────────────────────────── */
function BrowseByAreaSection() {
  // Deduplicate by areaName
  const uniqueAreas = (() => {
    const seen = new Set<string>()
    return (seoAreas as { searchTag: string; slug: string; areaName?: string }[]).filter((entry) => {
      const name = entry.areaName || entry.searchTag
      if (seen.has(name)) return false
      seen.add(name)
      return true
    })
  })()

  return (
    <section className="bg-white py-16 md:py-20 border-b border-black/10">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Browse by Area
        </h2>
        <p className="mt-2 text-black/60">
          Find vendors in Milwaukee neighborhoods and landmarks
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {uniqueAreas.map((entry) => {
            const areaName = entry.areaName || entry.searchTag
            return (
              <Link
                key={entry.slug}
                href={`/${entry.slug}`}
                className="inline-block rounded-full border border-black/15 px-4 py-2 text-sm text-black hover:border-black hover:bg-black hover:text-white transition-all"
              >
                {areaName}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   Browse by Event Type
   ──────────────────────────────────────────────────────────── */
function BrowseByEventTypeSection() {
  return (
    <section className="bg-white py-16 md:py-20 border-b border-black/10">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Browse by Event Type
        </h2>
        <p className="mt-2 text-black/60">
          Get matched with vendors for your specific event
        </p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {STATIC_EVENT_TYPES.map((eventType) => {
            const icon = EVENT_ICON_MAP[eventType.icon] || '🎉'
            return (
              <Link
                key={eventType.slug}
                href={`/directory/${eventType.slug}`}
                className="group flex flex-col items-center gap-2 rounded-lg border border-black/15 bg-white p-4 text-center hover:border-black hover:shadow-md transition-all"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium text-black group-hover:underline">
                  {eventType.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   SEO Marketplace Listings - Mega SEO Section
   ──────────────────────────────────────────────────────────── */
function SeoMarketplaceSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          All Vendor Services
        </h2>
        <p className="mt-2 text-black/60">
          Browse every service category in the Milwaukee event vendor marketplace
        </p>
        <div className="mt-10 space-y-10">
          {SEO_CATEGORY_SLUGS.map((slug) => {
            const group = SEO_BY_CATEGORY[slug]
            if (!group || group.entries.length === 0) return null
            return (
              <div key={slug}>
                <h3 className="text-lg font-bold text-black border-b border-black/10 pb-2">
                  {group.name}
                </h3>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {group.entries.map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/${entry.slug}`}
                      className="text-sm text-black/70 hover:text-black hover:underline transition-colors leading-relaxed"
                    >
                      {entry.searchTag}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   Directory Client (Main Page / Category Router)
   ──────────────────────────────────────────────────────────── */
interface DirectoryClientProps {
  initialVendors?: VendorSearchResult[]
  initialCategoryKey?: string
  initialSubKey?: string
  initialSubLabel?: string
}

export function DirectoryClient({
  initialVendors,
  initialCategoryKey,
  initialSubKey,
  initialSubLabel,
}: DirectoryClientProps) {
  // If we have category data, render the category/subcategory view
  if (initialCategoryKey && initialVendors) {
    const categoryData = NAV_CATEGORIES.find(
      (c) => c.key === initialCategoryKey
    )
    return (
      <CategoryDirectoryClient
        initialVendors={initialVendors}
        initialCategoryKey={initialCategoryKey}
        initialSubKey={initialSubKey}
        initialSubLabel={initialSubLabel}
        categoryData={categoryData}
      />
    )
  }

  // Otherwise render the landing page
  return (
    <div className="bg-white min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <BrowseByCategorySection />
      <BrowseByAreaSection />
      <BrowseByEventTypeSection />
      <SeoMarketplaceSection />
    </div>
  )
}
