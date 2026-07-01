'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

// FIX-10: aligned to the live Supabase `inventory_category` enum
// (SERVICE / ACTIVITY — was VENDOR_SERVICE / EXPERIENCE).
const CATEGORIES = [
  'LODGING',
  'VENUE_RENTAL',
  'SERVICE',
  'DINING',
  'ACTIVITY',
  'EVENT_TICKET',
  'TRANSPORT',
] as const

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const

type Location = { id: string; name: string; region: string | null }

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const itemId = params.id
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('LODGING')
  const [priceDollars, setPriceDollars] = useState<string>('')
  const [currency, setCurrency] = useState<string>('USD')
  const [locationId, setLocationId] = useState<string>('')
  const [status, setStatus] = useState<string>('DRAFT')
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push(`/login?returnTo=/vendor/listings/${itemId}/edit`); return }

      // Auth + ownership check: confirm the user is staff of the vendor that owns this item.
      const { data: staff } = await supabase
        .from('vendor_staff')
        .select('vendor_id')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .maybeSingle()
      if (!staff) { router.push('/onboarding/vendor'); return }

      // Load locations (for dropdown).
      const { data: locs } = await supabase
        .from('locations')
        .select('id, name, region')
        .order('name')
      setLocations((locs as Location[] | null) ?? [])

      // Load the item — must belong to the logged-in vendor.
      const { data: item, error: itemErr } = await supabase
        .from('inventory_items')
        .select('id, vendor_id, title, description, category, base_price_cents, currency, location_id, status')
        .eq('id', itemId)
        .maybeSingle()

      if (itemErr || !item) {
        setError(itemErr?.message ?? 'Listing not found')
        setLoading(false)
        return
      }
      if (item.vendor_id !== staff.vendor_id) {
        setError('You do not have permission to edit this listing.')
        setLoading(false)
        return
      }

      setTitle(item.title ?? '')
      setDescription(item.description ?? '')
      setCategory(item.category ?? 'LODGING')
      setPriceDollars(item.base_price_cents ? String(item.base_price_cents / 100) : '')
      setCurrency(item.currency ?? 'USD')
      setLocationId(item.location_id ?? (locs && locs.length > 0 ? locs[0].id : ''))
      setStatus(item.status ?? 'DRAFT')
      setLoading(false)
    }
    init()
  }, [itemId, router, supabase])

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const dollars = parseFloat(priceDollars || '0') || 0
    const basePriceCents = Math.round(dollars * 100)

    // Direct Supabase PATCH (RLS-scoped to the vendor via the user's auth).
    const { error: updateErr } = await supabase
      .from('inventory_items')
      .update({
        title: title.trim(),
        description: description.trim() || null,
        category,
        base_price_cents: basePriceCents,
        currency,
        location_id: locationId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)

    if (updateErr) {
      setError(updateErr.message)
      setSaving(false)
      return
    }

    // Best-effort domain event emission (non-fatal if it fails).
    await supabase.from('domain_events').insert({
      event_type: 'inventory.updated',
      entity_type: 'inventory_item',
      entity_id: itemId,
      payload: { title: title.trim(), category, base_price_cents: basePriceCents },
    }).then(() => undefined, () => undefined)

    setSaving(false)
    setSavedAt(new Date().toLocaleTimeString())
  }, [itemId, title, description, category, priceDollars, currency, locationId, supabase])

  if (loading) {
    return (
      <AppLayoutShell>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AppLayoutShell>
    )
  }

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Link href="/vendor/listings" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-4">
            <ArrowLeft className="w-4 h-4" /> Manage Listings
          </Link>
          <h1 className="text-2xl font-black text-black mb-1">Edit Listing</h1>
          <p className="text-sm text-gray-500 mb-6">
            Item ID: <span className="font-mono text-xs">{itemId}</span> · Current status:{' '}
            <span className="font-mono text-xs bg-gray-200 px-1.5 py-0.5 rounded">{status}</span>
          </p>

          <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {savedAt && !error && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                Saved at {savedAt}
              </div>
            )}

            <div>
              <label htmlFor="title" className="text-sm font-bold text-gray-700 block mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-bold text-gray-700 block mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="text-sm font-bold text-gray-700 block mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="location" className="text-sm font-bold text-gray-700 block mb-1">
                  Location
                </label>
                <select
                  id="location"
                  value={locationId}
                  onChange={e => setLocationId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                >
                  <option value="">— No location —</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}{loc.region ? `, ${loc.region}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="price" className="text-sm font-bold text-gray-700 block mb-1">
                  Base price <span className="text-gray-400 font-normal">(in dollars)</span>
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={priceDollars}
                  onChange={e => setPriceDollars(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                />
              </div>
              <div>
                <label htmlFor="currency" className="text-sm font-bold text-gray-700 block mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                >
                  {CURRENCIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <Link
                href="/vendor/listings"
                className="text-sm font-bold text-gray-500 hover:text-black"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-black text-white font-bold px-5 py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayoutShell>
  )
}
