'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  getInventoryCategoriesForSurface,
  type SurfaceSlug,
} from '@/lib/surface-inventory-map'
import { Loader2, MapPin, Star, ArrowRight } from 'lucide-react'
import { SUB_CATEGORIES } from '@/data/prototype-data'
import { categories as TAXONOMY } from '@/data/categories'
import { useCart } from '@/lib/cart-context'

interface InventoryItemRow {
  id: string
  title: string
  slug: string | null
  category: string | null
  base_price_cents: number | null
  currency: string | null
  status: string | null
  metadata: Record<string, unknown> | null
  locations?: { name: string | null; region: string | null } | { name: string | null; region: string | null }[] | null
  media_assets?: { url: string | null } | { url: string | null }[] | null
}

interface SurfaceLiveInventoryProps {
  surface: SurfaceSlug | string
}

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
  const media = item.media_assets
  if (media) {
    if (Array.isArray(media)) {
      if (media[0]?.url) return media[0].url
    } else if (media.url) {
      return media.url
    }
  }
  const meta = (item.metadata ?? {}) as Record<string, unknown>
  const candidates = [meta.image, meta.image_url, meta.photo_url, meta.thumbnail, meta.cover_image]
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 0) return c
  }
  return null
}

function badgeFor(item: InventoryItemRow): string | null {
  const meta = (item.metadata ?? {}) as Record<string, unknown>
  if (meta.badge && typeof meta.badge === 'string') return meta.badge
  if (meta.tier && typeof meta.tier === 'string') return meta.tier.toUpperCase()
  if (meta.verified === true) return 'VERIFIED'
  return null
}

function ratingFor(item: InventoryItemRow): number | null {
  const meta = (item.metadata ?? {}) as Record<string, unknown>
  if (typeof meta.rating === 'number') return meta.rating
  if (typeof meta.star_rating === 'number') return meta.star_rating
  return null
}

function descriptionFor(item: InventoryItemRow): string {
  const meta = (item.metadata ?? {}) as Record<string, unknown>
  if (typeof meta.description === 'string') return meta.description
  if (typeof meta.short_description === 'string') return meta.short_description
  return ''
}

// Per-surface taxonomy → L2 subcategories for the pill bar
const TAXONOMY_L1_BY_SURFACE: Record<string, string> = {
  services: 'event-planning-coordination',
  'things-to-do': 'attractions',
  'food-drink': 'catering-food',
  'live-shows': 'entertainment',
  party: 'venues-event-spaces',
  spaces: 'venues-event-spaces',
  vendors: 'vendors',
  travel: 'travel-lodging',
  plan: 'event-planning-coordination',
}

function getSubcategoryPills(surface: string): string[] {
  const l1Slug = TAXONOMY_L1_BY_SURFACE[`${surface}`]
  if (l1Slug) {
    const l1 = TAXONOMY.find(c => c.slug === l1Slug)
    if (l1 && l1.level2.length > 0) {
      return l1.level2.map(l2 => l2.name)
    }
  }
  return SUB_CATEGORIES[`${surface}` as keyof typeof SUB_CATEGORIES] ?? []
}

// Human-readable label for a category enum value
const CATEGORY_LABELS: Record<string, string> = {
  LODGING: 'Travel',
  DINING: 'Dining',
  EVENT_TICKET: 'Live Shows',
  ACTIVITY: 'Things to Do',
  TRANSPORT: 'Transport',
  VENUE_RENTAL: 'Spaces',
  SERVICE: 'Services',
}

export function SurfaceLiveInventory({ surface }: SurfaceLiveInventoryProps) {
  const supabase = createClient()
  const cart = useCart()
  const inventoryCategories = useMemo(() => getInventoryCategoriesForSurface(surface), [surface])

  const [items, setItems] = useState<InventoryItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSub, setActiveSub] = useState<string>('all')

  const subcategoryPills = useMemo(() => getSubcategoryPills(surface), [surface])

  const load = useCallback(async () => {
    if (inventoryCategories.length === 0) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    let query = supabase
      .from('inventory_items')
      .select(`
        id, title, slug, category, base_price_cents, currency, status, metadata,
        locations(name, region),
        media_assets(url)
      `)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(24)

    if (inventoryCategories.length === 1) {
      query = query.eq('category', inventoryCategories[0])
    } else {
      query = query.in('category', inventoryCategories)
    }

    const { data } = await query
    setItems((data as InventoryItemRow[] | null) ?? [])
    setLoading(false)
  }, [supabase, inventoryCategories])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    if (activeSub === 'all') return items
    const needle = activeSub.toLowerCase()
    return items.filter(i => {
      const meta = i.metadata as Record<string, unknown> | null
      const sub = String(meta?.subcategory ?? meta?.sub_category ?? '').toLowerCase()
      return sub.includes(needle) || (i.title ?? '').toLowerCase().includes(needle)
    })
  }, [items, activeSub])

  if (inventoryCategories.length === 0) {
    return null
  }

  const surfaceLabel = CATEGORY_LABELS[inventoryCategories[0]] ?? surface

  return (
    <section className="w-full px-4 md:px-8 py-8">
      {/* Subcategory pills */}
      {subcategoryPills.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap py-1 mb-6">
          <button
            onClick={() => setActiveSub('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
              activeSub === 'all'
                ? 'bg-midnight-slate text-white'
                : 'bg-white border border-midnight-slate/10 text-midnight-slate/60 hover:border-midnight-slate/30'
            }`}
          >
            All
          </button>
          {subcategoryPills.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSub(sub)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                activeSub.toLowerCase() === sub.toLowerCase()
                  ? 'bg-midnight-slate text-white'
                  : 'bg-white border border-midnight-slate/10 text-midnight-slate/60 hover:border-midnight-slate/30'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Card grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-midnight-slate/40" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-midnight-slate/10">
          <p className="text-midnight-slate/50 text-sm">
            No listings yet. Be the first to add one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => {
            const loc = locationLabel(item.locations)
            const img = primaryImage(item)
            const badge = badgeFor(item)
            const rating = ratingFor(item)
            const desc = descriptionFor(item)
            const price = formatPrice(item.base_price_cents, item.currency)
            const detailHref = item.slug ? `/${surface}/${item.slug}` : `/${surface}/${item.id}`

            return (
              <div
                key={item.id}
                className="group bg-white rounded-xl border border-midnight-slate/10 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Image */}
                <a href={detailHref} className="block relative h-48 overflow-hidden bg-midnight-slate/5">
                  {img ? (
                    <img
                      src={img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-midnight-slate/30">
                        {surfaceLabel}
                      </span>
                    </div>
                  )}
                  {/* Badge */}
                  {badge && (
                    <span className="absolute top-3 left-3 bg-midnight-slate text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      {badge}
                    </span>
                  )}
                  {/* Rating */}
                  {rating && (
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-midnight-slate text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <Star className="w-3 h-3 fill-champagne-gold text-champagne-gold" />
                      {rating}
                    </span>
                  )}
                </a>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-serif text-base font-bold text-midnight-slate group-hover:text-champagne-gold transition-colors line-clamp-1">
                    <a href={detailHref}>{item.title}</a>
                  </h3>
                  {loc && (
                    <p className="text-xs text-midnight-slate/60 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {loc}
                    </p>
                  )}
                  {desc && (
                    <p className="text-xs text-midnight-slate/50 mt-2 line-clamp-2">{desc}</p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-midnight-slate/5">
                    <span className="text-sm font-bold text-midnight-slate">{price}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={detailHref}
                        className="text-xs font-semibold text-midnight-slate/60 hover:text-midnight-slate border border-midnight-slate/20 hover:border-midnight-slate px-3 py-1.5 rounded-lg transition-all"
                      >
                        Details
                      </a>
                      <button
                        onClick={() => cart?.addItem?.({
                          id: item.id,
                          type: 'service',
                          title: item.title,
                          price: item.base_price_cents ?? 0,
                          image: img,
                          slug: item.slug ?? item.id,
                        } as any)}
                        className="text-xs font-semibold text-white bg-midnight-slate hover:bg-midnight-slate/90 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                      >
                        Add to Plan <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
