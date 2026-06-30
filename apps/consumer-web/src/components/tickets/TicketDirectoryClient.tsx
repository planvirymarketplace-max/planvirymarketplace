'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronRight, Home, Search as SearchIcon, X,
  SlidersHorizontal, Calendar, Ticket as TicketIcon, ArrowRight,
  Flame, PlusCircle, Building2, CalendarPlus, Home as HomeIcon,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ExternalEventCard, type ExternalEventData } from '@/components/cards/UnifiedCards'
import { TicketHeroSearch } from './TicketHeroSearch'
import type { RichTicketContent } from '@/data/ticket-landing-content'

export type TicketEvent = ExternalEventData

export interface TicketBreadcrumb {
  label: string
  href?: string
}

export interface TicketCategoryCard {
  label: string
  slug: string
  href: string
  count?: number
  description?: string
}

interface TicketDirectoryClientProps {
  title: string
  description: string
  breadcrumbs: TicketBreadcrumb[]
  events?: TicketEvent[]
  categoryCards?: TicketCategoryCard[]
  cardsTitle?: string
  showFilters?: boolean
  richContent?: RichTicketContent
  defaultEventType?: string
  defaultCity?: string
}

/** The "List Your ..." links shown on the same line as the search bar. */
const LISTING_LINKS = [
  { label: 'List Your Business', href: '/list/business', icon: Building2 },
  { label: 'List Your Event', href: '/list/event', icon: CalendarPlus },
  { label: 'List Your Property', href: '/list/property', icon: HomeIcon },
]

export function TicketDirectoryClient({
  title,
  description,
  breadcrumbs,
  events = [],
  categoryCards = [],
  cardsTitle = 'Browse Categories',
  showFilters = true,
  richContent,
  defaultEventType = 'all',
  defaultCity,
}: TicketDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [thisWeekend, setThisWeekend] = useState(false)
  const [sort, setSort] = useState<'date_soonest' | 'date_latest' | 'price_low' | 'price_high'>('date_soonest')

  const activeCount = (dateFrom ? 1 : 0) + (dateTo ? 1 : 0) + (thisWeekend ? 1 : 0)

  const clearFilters = () => {
    setDateFrom('')
    setDateTo('')
    setThisWeekend(false)
  }

  const filteredEvents = useMemo(() => {
    let result = [...events]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (e) => e.name.toLowerCase().includes(q) || e.venue_name?.toLowerCase().includes(q) || e.city.toLowerCase().includes(q)
      )
    }
    if (thisWeekend) {
      const now = new Date()
      const day = now.getDay()
      const saturday = new Date(now)
      saturday.setDate(now.getDate() + (6 - day))
      const sunday = new Date(saturday)
      sunday.setDate(saturday.getDate() + 1)
      sunday.setHours(23, 59, 59)
      result = result.filter((e) => {
        const d = new Date(e.event_date)
        return d >= saturday && d <= sunday
      })
    } else {
      if (dateFrom) {
        const from = new Date(dateFrom)
        result = result.filter((e) => new Date(e.event_date) >= from)
      }
      if (dateTo) {
        const to = new Date(dateTo)
        to.setHours(23, 59, 59)
        result = result.filter((e) => new Date(e.event_date) <= to)
      }
    }
    if (sort === 'date_soonest') {
      result.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    } else if (sort === 'date_latest') {
      result.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
    } else if (sort === 'price_low') {
      result.sort((a, b) => (a.min_price ?? 9999) - (b.min_price ?? 9999))
    } else if (sort === 'price_high') {
      result.sort((a, b) => (b.min_price ?? 0) - (a.min_price ?? 0))
    }
    return result
  }, [events, searchQuery, dateFrom, dateTo, thisWeekend, sort])

  const hasEvents = events.length > 0
  const hasRichContent = !!richContent
  const heroTitle = richContent?.title || title
  const heroSubtitle = richContent?.subtitle || description

  return (
    <div className="bg-white min-h-screen">
      {/* ── BREADCRUMB (matches global TaxonomyDirectoryClient) ─────────────── */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            {breadcrumbs.map((item, i) => (
              <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} className="text-gray-400" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-black font-medium">{item.label}</span>
                ) : item.href ? (
                  <Link href={item.href} className="hover:text-black transition-colors flex items-center gap-1">
                    {i === 0 && <Home size={13} />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="text-gray-500">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* ── HERO (white bg, no gradient — matches global theme) ─────────────── */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
          {/* Title block */}
          <div className="mb-5">
            {richContent?.heroEyebrow && (
              <p className="text-[10.5px] font-black uppercase tracking-widest text-coral mb-2">
                {richContent.heroEyebrow}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="mt-2 text-sm text-gray-500 max-w-2xl">{heroSubtitle}</p>
            )}
          </div>

          {/* Search bar */}
          <TicketHeroSearch
            defaultEventType={defaultEventType}
            defaultCity={defaultCity}
          />

          {/* List Your ... links — on the same line, below search */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            {LISTING_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:text-coral transition-colors uppercase tracking-wider"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Quick links row */}
          {hasRichContent && richContent && richContent.quickLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {richContent.quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-black transition-colors"
                >
                  {link.label}
                  <ChevronRight size={11} className="text-gray-400" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── POPULAR PICKS (white cards, coral hover — matches global) ───────── */}
      {hasRichContent && richContent && richContent.popularPicks.length > 0 && (
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
              Popular in {richContent.title.replace(' Tickets', '')}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {richContent.popularPicks.map((pick) => (
                <Link
                  key={pick.name}
                  href={pick.href}
                  className="group flex flex-col items-start p-4 bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-lg"
                >
                  {pick.tag && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-coral mb-1">
                      {pick.tag}
                    </span>
                  )}
                  <span className="text-sm font-bold text-black group-hover:text-coral transition-colors">
                    {pick.name}
                  </span>
                  {pick.subtitle && (
                    <span className="text-xs text-gray-500 mt-1">{pick.subtitle}</span>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <ChevronRight size={12} className="text-gray-300 group-hover:text-black transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MAIN LAYOUT: sidebar + content ──────────────────────────────────── */}
      <div className="mx-auto max-w-7xl w-full py-6 flex flex-col lg:flex-row gap-6 px-4 sm:px-6">
        {/* SIDEBAR — filters */}
        {showFilters && (
          <aside className="w-full lg:w-72 shrink-0 space-y-3 lg:sticky lg:top-20 lg:self-start lg:pr-0">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${title}...`}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between border-b pb-2 border-gray-200">
              <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" /> Filters
              </h3>
              {activeCount > 0 && (
                <button onClick={clearFilters} className="text-[10px] text-red-500 hover:underline font-extrabold uppercase tracking-widest">
                  Clear All
                </button>
              )}
            </div>

            {activeCount > 0 && (
              <div className="flex flex-wrap gap-1.5 pb-2">
                {dateFrom && <Badge variant="secondary" className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200" onClick={() => setDateFrom('')}>From: {dateFrom} <X className="w-3 h-3" /></Badge>}
                {dateTo && <Badge variant="secondary" className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200" onClick={() => setDateTo('')}>To: {dateTo} <X className="w-3 h-3" /></Badge>}
                {thisWeekend && <Badge variant="secondary" className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200" onClick={() => setThisWeekend(false)}>This Weekend <X className="w-3 h-3" /></Badge>}
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Date Range</p>
              <div className="space-y-2">
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    disabled={thisWeekend}
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    disabled={thisWeekend}
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <Checkbox checked={thisWeekend} onCheckedChange={(checked) => setThisWeekend(checked === true)} className="w-3.5 h-3.5" />
                  <span className="text-xs text-gray-700">This Weekend only</span>
                </label>
              </div>
            </div>

            {categoryCards.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">{cardsTitle}</p>
                <div className="space-y-1">
                  {categoryCards.map((card) => (
                    <Link
                      key={card.slug}
                      href={card.href}
                      className="block py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-black group-hover:text-coral transition-colors">{card.label}</span>
                        <ChevronRight size={12} className="text-gray-300 group-hover:text-black transition-colors" />
                      </div>
                      {card.description && (
                        <span className="text-[10px] text-gray-500">{card.description}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0 lg:pl-0">
          {/* Category cards at TOP (when no sidebar — showFilters=false) */}
          {!showFilters && categoryCards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">{cardsTitle}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {categoryCards.map((card) => (
                  <Link
                    key={card.slug}
                    href={card.href}
                    className="group flex flex-col items-start p-4 bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-lg"
                  >
                    <span className="text-sm font-bold text-black group-hover:text-coral transition-colors truncate w-full">{card.label}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {card.count !== undefined && (
                        <span className="text-xs text-gray-400">{card.count} events</span>
                      )}
                      <ChevronRight size={12} className="text-gray-300 group-hover:text-black transition-colors" />
                    </div>
                    {card.description && (
                      <span className="text-xs text-gray-500 mt-1 line-clamp-1">{card.description}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sort bar + event listings */}
          {hasEvents && (
            <>
              <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
                <span className="text-sm font-black text-black uppercase tracking-wider">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Sort:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-black bg-white text-black"
                  >
                    <option value="date_soonest">Date (soonest)</option>
                    <option value="date_latest">Date (latest)</option>
                    <option value="price_low">Price (low to high)</option>
                    <option value="price_high">Price (high to low)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <ExternalEventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          )}

          {/* Empty state when no events */}
          {!hasEvents && (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-gray-50">
              <TicketIcon className="w-10 h-10 text-coral mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-medium">Event listings are coming soon.</p>
              <p className="text-xs text-gray-400 mt-1">
                We are connecting ticket providers to bring you live inventory for {title.toLowerCase()}.
              </p>
              <Link
                href="/tickets/search"
                className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-coral hover:text-coral/80 transition-colors"
              >
                Browse all events <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── TRENDING SEARCHES (white cards, no gradient) ────────────────────── */}
      {hasRichContent && richContent && richContent.trending.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-coral" />
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Trending Searches</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {richContent.trending.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex-shrink-0 w-32 sm:w-40 rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all"
                >
                  <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
                    <span className="text-xl font-black text-gray-300 group-hover:text-coral transition-colors">
                      {item.tag}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-coral">{item.tag}</p>
                    <p className="text-xs font-bold text-black truncate mt-0.5">{item.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT / SEO CONTENT ─────────────────────────────────────────────── */}
      {hasRichContent && richContent && richContent.aboutBody.length > 0 && (
        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-black text-black tracking-tight mb-4">
                {richContent.aboutTitle}
              </h2>
              <div className="space-y-4">
                {richContent.aboutBody.map((para, i) => (
                  <p key={i} className="text-sm text-gray-600 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
