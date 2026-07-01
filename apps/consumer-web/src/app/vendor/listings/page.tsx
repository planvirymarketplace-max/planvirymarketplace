'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { ArrowLeft, Loader2, Pencil, Trash2, Eye, EyeOff, Plus, RefreshCw, Filter } from 'lucide-react'

type Listing = {
  id: string
  title: string
  slug: string | null
  category: string | null
  status: string | null
  base_price_cents: number | null
  currency: string | null
  location_id: string | null
  created_at: string | null
  published_at: string | null
  locations?: { name: string; region: string | null } | { name: string; region: string | null }[] | null
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-amber-100 text-amber-700',
  ARCHIVED: 'bg-red-100 text-red-700',
  DELETED: 'bg-red-100 text-red-700',
}

// Inventory categories supported by the canonical schema (inventory_category enum).
// Used to populate the category filter dropdown.
// FIX-10: aligned to the live Supabase enum — SERVICE (was VENDOR_SERVICE)
// and ACTIVITY (was EXPERIENCE).
const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'ALL', label: 'All categories' },
  { value: 'LODGING', label: 'Lodging' },
  { value: 'VENUE_RENTAL', label: 'Venue Rental' },
  { value: 'SERVICE', label: 'Service' },
  { value: 'DINING', label: 'Dining' },
  { value: 'ACTIVITY', label: 'Activity' },
  { value: 'EVENT_TICKET', label: 'Event Ticket' },
  { value: 'TRANSPORT', label: 'Transport' },
]

const CATEGORY_STYLES: Record<string, string> = {
  LODGING: 'bg-purple-100 text-purple-700',
  VENUE_RENTAL: 'bg-rose-100 text-rose-700',
  SERVICE: 'bg-amber-100 text-amber-700',
  DINING: 'bg-orange-100 text-orange-700',
  ACTIVITY: 'bg-teal-100 text-teal-700',
  EVENT_TICKET: 'bg-cyan-100 text-cyan-700',
  TRANSPORT: 'bg-lime-100 text-lime-700',
}

function formatCategory(c: string | null): string {
  if (!c) return '—'
  return c.replace(/_/g, ' ')
}

function formatPrice(cents: number | null, currency: string | null) {
  if (!cents) return 'Free'
  const dollars = (cents / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: currency || 'USD',
  })
  return dollars
}

function getLocationName(loc: Listing['locations']): string | null {
  if (!loc) return null
  if (Array.isArray(loc)) {
    const first = loc[0]
    return first ? `${first.name}${first.region ? ', ' + first.region : ''}` : null
  }
  return `${loc.name}${loc.region ? ', ' + loc.region : ''}`
}

export default function VendorListingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<Listing[]>([])
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [actionInFlight, setActionInFlight] = useState<Record<string, 'publish' | 'unpublish' | 'delete' | undefined>>({})
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?returnTo=/vendor/listings'); return }
    const { data: staff, error: staffErr } = await supabase
      .from('vendor_staff')
      .select('vendor_id')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .maybeSingle()
    if (staffErr || !staff) { router.push('/onboarding/vendor'); return }
    setVendorId(staff.vendor_id)

    const { data: items, error: itemsErr } = await supabase
      .from('inventory_items')
      .select(`
        id, title, slug, category, status, base_price_cents, currency,
        location_id, created_at, published_at,
        locations(name, region)
      `)
      .eq('vendor_id', staff.vendor_id)
      .order('created_at', { ascending: false })

    if (itemsErr) {
      setError(itemsErr.message)
    }
    setListings((items as Listing[] | null) ?? [])
    setLoading(false)
  }, [router, supabase])

  useEffect(() => {
    load()
  }, [load])

  const setAction = (id: string, action: 'publish' | 'unpublish' | 'delete' | undefined) => {
    setActionInFlight(prev => ({ ...prev, [id]: action }))
  }

  const handlePublish = async (id: string) => {
    setAction(id, 'publish')
    try {
      const res = await fetch(`/api/v1/inventory/${id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error?.message || data?.error || 'Failed to publish')
      }
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setAction(id, undefined)
    }
  }

  const handleUnpublish = async (id: string) => {
    setAction(id, 'unpublish')
    try {
      const res = await fetch(`/api/v1/inventory/${id}/unpublish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error?.message || data?.error || 'Failed to unpublish')
      }
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setAction(id, undefined)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this listing? It will be hidden from search and the marketplace. You can re-publish it later.')) {
      return
    }
    setAction(id, 'delete')
    try {
      const res = await fetch(`/api/v1/inventory/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error?.message || data?.error || 'Failed to archive')
      }
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setAction(id, undefined)
    }
  }

  const filtered = categoryFilter === 'ALL'
    ? listings
    : listings.filter((l) => l.category === categoryFilter)

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <Link href="/vendor/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-2">
                <ArrowLeft className="w-4 h-4" /> Dashboard
              </Link>
              <h1 className="text-2xl font-black text-black">Manage Listings</h1>
              <p className="text-sm text-gray-500 mt-1">
                {listings.length} {listings.length === 1 ? 'listing' : 'listings'} for your vendor account.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={load}
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <Link
                href="/vendor/create-listing"
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" /> New Listing
              </Link>
            </div>
          </div>

          {/* Category filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex items-center gap-2 flex-wrap">
            <label htmlFor="categoryFilter" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
              <Filter className="w-3.5 h-3.5" /> Filter
            </label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <span className="text-xs text-gray-400 ml-auto">
              Showing {filtered.length} of {listings.length}
            </span>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">You don&apos;t have any listings yet.</p>
              <Link
                href="/vendor/create-listing"
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" /> Create your first listing
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">No listings match the selected category.</p>
              <button
                onClick={() => setCategoryFilter('ALL')}
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <div className="col-span-5">Listing</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              <ul className="divide-y divide-gray-100">
                {filtered.map(item => {
                  const isPublished = item.status === 'PUBLISHED' || item.status === 'ACTIVE'
                  const isArchived = item.status === 'ARCHIVED' || item.status === 'DELETED'
                  const inFlight = actionInFlight[item.id]
                  return (
                    <li key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-gray-50/50">
                      <div className="md:col-span-5">
                        <p className="font-bold text-black text-sm truncate">{item.title}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {item.slug ? `${item.slug} · ` : ''}{getLocationName(item.locations) ?? 'No location'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-xs text-gray-600 md:hidden font-bold">Category: </span>
                        <span
                          className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${CATEGORY_STYLES[item.category ?? ''] ?? 'bg-gray-100 text-gray-700'}`}
                        >
                          {formatCategory(item.category)}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <span
                          className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${STATUS_STYLES[item.status ?? 'DRAFT'] ?? 'bg-gray-100 text-gray-700'}`}
                        >
                          {item.status ?? 'DRAFT'}
                        </span>
                      </div>
                      <div className="md:col-span-1">
                        <span className="text-sm font-bold text-gray-700">{formatPrice(item.base_price_cents, item.currency)}</span>
                      </div>
                      <div className="md:col-span-2 flex items-center gap-1 md:justify-end flex-wrap">
                        <Link
                          href={`/vendor/listings/${item.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 border border-gray-200 px-2 py-1.5 rounded hover:bg-gray-50"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </Link>
                        {!isPublished && !isArchived && (
                          <button
                            onClick={() => handlePublish(item.id)}
                            disabled={!!inFlight}
                            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-green-600 px-2 py-1.5 rounded hover:bg-green-700 disabled:opacity-50"
                            title="Publish"
                          >
                            {inFlight === 'publish' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />} Publish
                          </button>
                        )}
                        {isPublished && (
                          <button
                            onClick={() => handleUnpublish(item.id)}
                            disabled={!!inFlight}
                            className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 bg-amber-100 px-2 py-1.5 rounded hover:bg-amber-200 disabled:opacity-50"
                            title="Unpublish"
                          >
                            {inFlight === 'unpublish' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <EyeOff className="w-3.5 h-3.5" />} Unpublish
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={!!inFlight}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-700 border border-red-200 px-2 py-1.5 rounded hover:bg-red-50 disabled:opacity-50"
                          title="Archive"
                        >
                          {inFlight === 'delete' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {vendorId && (
            <p className="text-xs text-gray-400 mt-6 text-center">
              Showing inventory_items where <span className="font-mono">vendor_id = {vendorId}</span>
            </p>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
