'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useCart, cartItemId } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  SlidersHorizontal,
  Star,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────
interface MediaAsset {
  url: string | null
  is_primary: boolean | null
}

interface LocationRow {
  name: string | null
  region: string | null
}

interface InventoryItemRow {
  id: string
  title: string
  slug: string | null
  category: string | null
  base_price_cents: number | null
  currency: string | null
  status: string | null
  description?: string | null
  metadata: Record<string, unknown> | null
  vendor_id?: string | null
  locations?:
    | LocationRow
    | LocationRow[]
    | null
  media_assets?: MediaAsset[] | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function formatPrice(cents: number | null, currency: string | null): string {
  if (!cents) return 'Free'
  try {
    return (cents / 100).toLocaleString(undefined, {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    })
  } catch {
    return `$${(cents / 100).toFixed(0)}`
  }
}

function locationLabel(loc: InventoryItemRow['locations']): string | null {
  if (!loc) return null
  if (Array.isArray(loc)) {
    const first = loc[0]
    if (!first) return null
    return [first.name, first.region].filter(Boolean).join(', ')
  }
  return [loc.name, loc.region].filter(Boolean).join(', ')
}

function primaryImage(item: InventoryItemRow): string | null {
  const meta = item.metadata ?? {}
  const metaImg =
    (meta.image as string | undefined) ??
    (meta.image_url as string | undefined) ??
    (meta.photo_url as string | undefined) ??
    (meta.thumbnail as string | undefined)
  if (metaImg) return metaImg
  const media = item.media_assets ?? []
  if (media.length === 0) return null
  const primary = media.find((m) => m?.is_primary && m.url)
  return primary?.url ?? media[0]?.url ?? null
}

function deriveBadge(item: InventoryItemRow): string {
  const meta = item.metadata ?? {}
  const badge =
    (meta.badge as string | undefined) ??
    (meta.tier as string | undefined) ??
    (meta.verification as string | undefined)
  if (badge) return String(badge).toUpperCase()
  const sub = String(meta.subcategory ?? meta.sub_category ?? '').toLowerCase()
  if (sub.includes('resort') || sub.includes('hotel')) return 'VERIFIED HOTEL'
  if (sub.includes('luxury') || sub.includes('estate')) return 'LUXURY STAY'
  if (sub.includes('villa') || sub.includes('rental')) return 'PREMIUM RENTAL'
  return 'VERIFIED STAY'
}

function deriveRating(item: InventoryItemRow): number | null {
  const meta = item.metadata ?? {}
  const rating =
    (meta.rating as number | undefined) ??
    (meta.star_rating as number | undefined) ??
    (meta.stars as number | undefined)
  if (typeof rating === 'number' && !Number.isNaN(rating) && rating > 0) {
    return Math.min(5, Math.max(0, rating))
  }
  return null
}

function deriveDescription(item: InventoryItemRow): string {
  const meta = item.metadata ?? {}
  const desc =
    (meta.description as string | undefined) ??
    (meta.short_description as string | undefined) ??
    (meta.summary as string | undefined)
  if (desc) return String(desc)
  if (item.description) return String(item.description)
  return 'Premium lodging hand-selected by Planviry — book direct or add to your plan.'
}

// ─── Sub-components ────────────────────────────────────────────────────────
function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[10px] font-bold uppercase tracking-widest text-midnight-slate/50 mb-1">
      {children}
    </span>
  )
}

function FilterDivider() {
  return <div className="hidden md:block h-10 w-px bg-midnight-slate/10" aria-hidden />
}

// ─── Main component ────────────────────────────────────────────────────────
export default function TravelPage() {
  const supabase = createClient()
  const { addItem } = useCart()

  const [items, setItems] = useState<InventoryItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter bar state — UI present, wiring is intentionally light per spec
  const [whatFilter, setWhatFilter] = useState('places-to-stay')
  const [whereFilter, setWhereFilter] = useState('')
  const [priceFilter, setPriceFilter] = useState('any')
  const [guestsFilter, setGuestsFilter] = useState('4')
  const [sortFilter, setSortFilter] = useState('most-exclusive')
  const [activeNav, setActiveNav] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: fetchErr } = await supabase
      .from('inventory_items')
      .select(
        `
        id, title, slug, category, base_price_cents, currency, status,
        description, metadata, vendor_id,
        locations(name, region),
        media_assets(url, is_primary)
      `,
      )
      .eq('category', 'LODGING')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(24)

    if (fetchErr) {
      setError(fetchErr.message)
    }
    setItems((data as InventoryItemRow[] | null) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    // Initial fetch — eslint-disabled because the async boundary keeps this
    // cascade-free (standard fetch-on-mount pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const handleAddToPlan = useCallback(
    (item: InventoryItemRow) => {
      const price = item.base_price_cents ?? 0
      addItem({
        id: cartItemId('lodging', item.id, 'travel'),
        type: 'lodging',
        listing_id: item.id,
        vendor_id: item.vendor_id ?? null,
        name: item.title,
        image_url: primaryImage(item),
        date: new Date().toISOString().slice(0, 10),
        amount: price,
        category: item.category,
      })
    },
    [addItem],
  )

  const navTabs = useMemo(
    () => [
      { value: 'all', label: 'All travel' },
      { value: 'places-to-stay', label: 'Places to stay' },
      { value: 'flights', label: 'Flights' },
      { value: 'cars', label: 'Cars' },
      { value: 'destinations', label: 'Destinations' },
      { value: 'group-trip', label: 'Group Trip' },
    ],
    [],
  )

  const whatOptions = [
    { value: 'places-to-stay', label: 'Places to Stay' },
    { value: 'hotels', label: 'Hotels' },
    { value: 'vacation-rentals', label: 'Vacation Rentals' },
    { value: 'resorts', label: 'Resorts' },
    { value: 'villas', label: 'Villas' },
  ]

  const priceOptions = [
    { value: 'any', label: 'Any Price' },
    { value: '0-150', label: 'Under $150' },
    { value: '150-300', label: '$150 – $300' },
    { value: '300-500', label: '$300 – $500' },
    { value: '500+', label: '$500+' },
  ]

  const guestOptions = [
    { value: '1', label: '1 Guest' },
    { value: '2', label: '2 Guests' },
    { value: '4', label: '4 Guests' },
    { value: '6', label: '6 Guests' },
    { value: '8', label: '8+ Guests' },
  ]

  const sortOptions = [
    { value: 'most-exclusive', label: 'Most Exclusive' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
  ]

  return (
    <div className="w-full bg-white">
      {/* ─── Horizontal search filter bar ─────────────────────────────────── */}
      <section className="w-full px-margin-mobile md:px-margin-desktop pt-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="bg-white rounded-2xl border border-midnight-slate/10 shadow-sm p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-2">
              {/* WHAT */}
              <div className="flex-1 min-w-0">
                <FilterLabel>What</FilterLabel>
                <Select value={whatFilter} onValueChange={setWhatFilter}>
                  <SelectTrigger className="w-full border-0 shadow-none focus:ring-0 px-1 h-9 [&_svg]:text-midnight-slate/60">
                    <Search className="w-4 h-4 mr-2 text-midnight-slate/60" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {whatOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FilterDivider />

              {/* WHERE */}
              <div className="flex-1 min-w-0">
                <FilterLabel>Where</FilterLabel>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-midnight-slate/60 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Savannah"
                    value={whereFilter}
                    onChange={(e) => setWhereFilter(e.target.value)}
                    className="pl-8 border-0 shadow-none focus-visible:ring-0 h-9"
                  />
                </div>
              </div>

              <FilterDivider />

              {/* WHEN */}
              <div className="flex-1 min-w-0">
                <FilterLabel>When</FilterLabel>
                <button
                  type="button"
                  className="flex items-center gap-2 h-9 px-2 w-full text-sm text-midnight-slate/70 hover:bg-midnight-slate/5 rounded-md transition-colors"
                >
                  <Calendar className="w-4 h-4 text-midnight-slate/60" />
                  <span>Add dates</span>
                </button>
              </div>

              <FilterDivider />

              {/* PRICE */}
              <div className="flex-1 min-w-0">
                <FilterLabel>Price</FilterLabel>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-full border-0 shadow-none focus:ring-0 px-1 h-9 [&_svg]:text-midnight-slate/60">
                    <DollarSign className="w-4 h-4 mr-2 text-midnight-slate/60" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FilterDivider />

              {/* ATTENDEES */}
              <div className="flex-1 min-w-0">
                <FilterLabel>Attendees</FilterLabel>
                <Select value={guestsFilter} onValueChange={setGuestsFilter}>
                  <SelectTrigger className="w-full border-0 shadow-none focus:ring-0 px-1 h-9 [&_svg]:text-midnight-slate/60">
                    <Users className="w-4 h-4 mr-2 text-midnight-slate/60" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {guestOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FilterDivider />

              {/* FILTERS */}
              <div className="flex-shrink-0">
                <FilterLabel>&nbsp;</FilterLabel>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 border-midnight-slate/15 text-midnight-slate/70 hover:bg-midnight-slate/5"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
              </div>

              {/* CLEAR + SEARCH (right-aligned cluster) */}
              <div className="flex items-end gap-3 flex-shrink-0 md:ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setWhatFilter('places-to-stay')
                    setWhereFilter('')
                    setPriceFilter('any')
                    setGuestsFilter('4')
                  }}
                  className="text-xs font-bold uppercase tracking-wide text-midnight-slate/50 hover:text-midnight-slate transition-colors h-9"
                >
                  Clear
                </button>
                <Button
                  type="button"
                  onClick={load}
                  className="h-9 bg-midnight-slate text-white hover:bg-midnight-slate/90 px-4"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Dark navy secondary nav bar ─────────────────────────────────── */}
      <section className="w-full px-margin-mobile md:px-margin-desktop mt-6">
        <div className="mx-auto max-w-[1400px]">
          <nav className="bg-midnight-slate rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span className="text-white font-bold text-sm tracking-wide whitespace-nowrap">
              All travel
            </span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:ml-auto">
              {navTabs.slice(1).map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveNav(tab.value)}
                  className={`text-xs font-medium tracking-wide transition-colors ${
                    activeNav === tab.value
                      ? 'text-champagne-gold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </section>

      {/* ─── Section header ──────────────────────────────────────────────── */}
      <section className="w-full px-margin-mobile md:px-margin-desktop mt-8">
        <div className="mx-auto max-w-[1400px] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-midnight-slate">
              Travel
            </h1>
            <p className="text-sm text-midnight-slate/60 mt-2 max-w-2xl">
              Hand-selected local professionals and premium spaces for a memorable
              celebration.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/50">
              Sort
            </span>
            <Select value={sortFilter} onValueChange={setSortFilter}>
              <SelectTrigger className="w-[180px] h-9 border-midnight-slate/15 text-midnight-slate/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* ─── Travel cards grid ───────────────────────────────────────────── */}
      <section className="w-full px-margin-mobile md:px-margin-desktop mt-8 pb-16">
        <div className="mx-auto max-w-[1400px]">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 mb-4 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" /> {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-midnight-slate/40" />
              <span className="ml-3 text-sm text-midnight-slate/60">
                Loading premium stays…
              </span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24 bg-midnight-slate/[0.02] rounded-xl border border-dashed border-midnight-slate/15">
              <Sparkles className="w-8 h-8 mx-auto text-midnight-slate/30 mb-3" />
              <p className="text-midnight-slate font-medium">
                No live lodging inventory yet.
              </p>
              <p className="text-midnight-slate/60 text-sm mt-1">
                Be the first to list a stay — it will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => {
                const img = primaryImage(item)
                const loc = locationLabel(item.locations)
                const badge = deriveBadge(item)
                const rating = deriveRating(item)
                const description = deriveDescription(item)
                const detailHref = `/travel/${item.slug ?? item.id}`

                return (
                  <article
                    key={item.id}
                    className="group bg-white rounded-xl border border-midnight-slate/10 overflow-hidden flex flex-col transition-all hover:shadow-lg hover:border-midnight-slate/20"
                  >
                    {/* Image with overlays */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-midnight-slate/5">
                      {img ? (
                        <img
                          src={img}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-midnight-slate/20" />
                        </div>
                      )}

                      {/* Badge */}
                      <span className="absolute top-3 left-3 bg-midnight-slate text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                        {badge}
                      </span>

                      {/* Rating */}
                      {rating !== null && (
                        <span className="absolute top-3 right-3 bg-midnight-slate/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <Star className="w-3 h-3 fill-champagne-gold text-champagne-gold" />
                          {rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/50 mb-1">
                        Travel
                      </p>
                      <h3 className="font-serif text-lg font-bold text-midnight-slate leading-snug line-clamp-1">
                        {item.title}
                      </h3>
                      {loc && (
                        <p className="text-xs text-midnight-slate/60 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="line-clamp-1">{loc}</span>
                        </p>
                      )}
                      <p className="text-xs text-midnight-slate/70 mt-2 line-clamp-2">
                        {description}
                      </p>

                      {/* Footer row */}
                      <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-lg font-bold text-midnight-slate">
                            {formatPrice(item.base_price_cents, item.currency)}
                          </span>
                          {item.base_price_cents ? (
                            <span className="text-xs text-midnight-slate/50 ml-1">
                              / night
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 border-midnight-slate/15 text-midnight-slate/70 hover:bg-midnight-slate/5"
                          >
                            <Link href={detailHref}>Details</Link>
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleAddToPlan(item)}
                            className="h-8 bg-midnight-slate text-white hover:bg-midnight-slate/90"
                          >
                            Add to Plan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
