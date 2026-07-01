'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  getInventoryCategoriesForSurface,
  type SurfaceSlug,
} from '@/lib/surface-inventory-map'
import { Loader2, MapPin, Database, AlertCircle } from 'lucide-react'

// Pulls subcategory pills from the existing seed taxonomy so each surface
// shows its own curated subcategory list (P4-2). For surfaces with no entry,
// falls back to the live `taxonomy_nodes` table at runtime (best-effort).
import { SUB_CATEGORIES } from '@/data/prototype-data'
import { categories as TAXONOMY } from '@/data/categories'

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

// ─── Per-surface taxonomy → L2 subcategories for the pill bar (P4-2) ────────
const TAXONOMY_L1_BY_SURFACE: Record<string, string> = {
  services: 'event-planning-coordination',
  'things-to-do': 'attractions', // not a real L1 in seed; falls back to SUB_CATEGORIES
  'food-drink': 'catering-food',
  'live-shows': 'entertainment',
  party: 'venues-event-spaces',
  spaces: 'venues-event-spaces',
  vendors: 'vendors',
  travel: 'travel-lodging',
  plan: 'event-planning-coordination',
}

function getSubcategoryPills(surface: string): string[] {
  // First try the seed taxonomy L1's L2 children
  const l1Slug = TAXONOMY_L1_BY_SURFACE[`${surface}`]
  if (l1Slug) {
    const l1 = TAXONOMY.find(c => c.slug === l1Slug)
    if (l1 && l1.level2.length > 0) {
      return l1.level2.map(l2 => l2.name)
    }
  }
  // Fall back to the prototype-data SUB_CATEGORIES (already curated per surface)
  return SUB_CATEGORIES[`${surface}` as keyof typeof SUB_CATEGORIES] ?? []
}

export function SurfaceLiveInventory({ surface }: SurfaceLiveInventoryProps) {
  const supabase = createClient()
  const inventoryCategories = useMemo(() => getInventoryCategoriesForSurface(surface), [surface])

  const [items, setItems] = useState<InventoryItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeSub, setActiveSub] = useState<string>('all')

  const subcategoryPills = useMemo(() => getSubcategoryPills(surface), [surface])

  const load = useCallback(async () => {
    if (inventoryCategories.length === 0) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    let query = supabase
      .from('inventory_items')
      .select(`
        id, title, slug, category, base_price_cents, currency, status, metadata,
        locations(name, region)
      `)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(24)

    if (inventoryCategories.length === 1) {
      query = query.eq('category', inventoryCategories[0])
    } else {
      query = query.in('category', inventoryCategories)
    }

    const { data, error: fetchErr } = await query
    if (fetchErr) {
      setError(fetchErr.message)
    }
    setItems((data as InventoryItemRow[] | null) ?? [])
    setLoading(false)
  }, [supabase, inventoryCategories])

  useEffect(() => {
    // Initial data fetch — calls setState as data resolves. This is the
    // standard fetch-on-mount pattern; the rule fires because `load()` writes
    // state synchronously, but the async boundary keeps it cascade-free.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    return null // surface has no inventory filter (e.g. /vendors "all categories" handled elsewhere)
  }

  return (
    <section className="w-full px-margin-mobile md:px-margin-desktop py-12 border-t border-midnight-slate/5">
      <div className="flex items-baseline justify-between mb-4 gap-4 flex-wrap">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 mb-1 flex items-center gap-1">
            <Database className="w-3 h-3" /> Live inventory
          </p>
          <h2 className="font-serif text-2xl text-midnight-slate font-bold">
            From the marketplace
          </h2>
          <p className="text-midnight-slate/60 text-xs mt-1">
            Filtered by{' '}
            <code className="font-mono text-[11px] bg-midnight-slate/5 px-1 rounded">
              inventory_items.category IN ({inventoryCategories.map(c => `'${c}'`).join(', ')})
            </code>
          </p>
        </div>
        <button
          onClick={load}
          className="text-xs font-bold text-midnight-slate/60 hover:text-midnight-slate"
        >
          Refresh
        </button>
      </div>

      {/* Subcategory pills — P4-2 */}
      {subcategoryPills.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap py-1 mb-6">
          <button
            onClick={() => setActiveSub('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all whitespace-nowrap ${
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
              className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all whitespace-nowrap ${
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

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 mb-4 flex items-center gap-2">
          <AlertCircle className="w-3 h-3" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-midnight-slate/40" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-outline-variant">
          <p className="text-on-surface-variant text-sm">
            No live inventory matches this filter yet. Be the first to list one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => {
            const loc = locationLabel(item.locations)
            const meta = (item.metadata ?? {}) as Record<string, unknown>
            const sub = (meta.subcategory ?? meta.sub_category ?? null) as string | null
            return (
              <a
                key={item.id}
                href={`/vendor/${item.slug ?? item.id}`}
                className="group bg-white rounded-xl border border-midnight-slate/5 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative h-40 bg-gradient-to-br from-midnight-slate/5 to-midnight-slate/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40">
                    {item.category ?? '—'}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-champagne-gold mb-1">
                    {sub ?? item.category}
                  </p>
                  <h3 className="font-serif text-base text-midnight-slate group-hover:text-champagne-gold transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {loc && (
                    <p className="text-[11px] text-midnight-slate/60 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {loc}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-midnight-slate/5">
                    <span className="text-sm font-bold text-midnight-slate">
                      {formatPrice(item.base_price_cents, item.currency)}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-midnight-slate/40">
                      {item.status}
                    </span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}
