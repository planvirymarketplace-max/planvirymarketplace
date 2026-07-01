'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

// Inventory categories supported by the vendor create-listing form.
// Values match the live `inventory_items.category` enum in Supabase.
const CATEGORIES = [
  { value: 'LODGING', label: 'Lodging' },
  { value: 'VENUE_RENTAL', label: 'Venue Rental' },
  { value: 'VENDOR_SERVICE', label: 'Vendor Service' },
  { value: 'DINING', label: 'Dining' },
  { value: 'EXPERIENCE', label: 'Experience' },
  { value: 'EVENT_TICKET', label: 'Event Ticket' },
  { value: 'TRANSPORT', label: 'Transport' },
] as const

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const

type Location = { id: string; name: string; region: string | null }

export default function CreateListingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [vendorName, setVendorName] = useState<string>('')
  const [vendorLocationId, setVendorLocationId] = useState<string | null>(null)
  const [locations, setLocations] = useState<Location[]>([])

  // form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('LODGING')
  const [priceDollars, setPriceDollars] = useState<string>('') // user types dollars; converted to cents
  const [currency, setCurrency] = useState<string>('USD')
  const [locationId, setLocationId] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?returnTo=/vendor/create-listing')
        return
      }
      // Resolve the logged-in user's vendor_id from vendor_staff.
      const { data: staff, error: staffErr } = await supabase
        .from('vendor_staff')
        .select('vendor_id, role, vendor_accounts!inner(id, name, location_id)')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .maybeSingle()

      if (staffErr || !staff) {
        router.push('/onboarding/vendor')
        return
      }
      setVendorId(staff.vendor_id)
      setVendorName(staff.vendor_accounts?.name ?? '')
      setVendorLocationId(staff.vendor_accounts?.location_id ?? null)

      // Load locations for the dropdown.
      const { data: locs, error: locErr } = await supabase
        .from('locations')
        .select('id, name, region')
        .order('name')
      if (locErr) {
        setError(locErr.message)
      }
      setLocations((locs as Location[] | null) ?? [])
      // Default the location to the vendor's own location, if set.
      if (staff.vendor_accounts?.location_id) {
        setLocationId(staff.vendor_accounts.location_id)
      } else if (locs && locs.length > 0) {
        setLocationId(locs[0].id)
      }
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!vendorId) {
      setError('No vendor account linked to your user. Complete onboarding first.')
      return
    }
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!locationId) {
      setError('Please select a location')
      return
    }

    const dollars = parseFloat(priceDollars || '0') || 0
    const basePriceCents = Math.round(dollars * 100)

    setSubmitting(true)
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${Math.random().toString(36).slice(2, 6)}`

    const { data, error: insertErr } = await supabase
      .from('inventory_items')
      .insert({
        vendor_id: vendorId,
        location_id: locationId,
        title: title.trim(),
        slug,
        description: description.trim() || null,
        category,
        base_price_cents: basePriceCents,
        currency,
        status: 'DRAFT',
      })
      .select('id')
      .single()

    if (insertErr) {
      setError(insertErr.message)
      setSubmitting(false)
      return
    }

    // Best-effort domain event emission (non-fatal if it fails).
    await supabase.from('domain_events').insert({
      event_type: 'inventory.created',
      entity_type: 'inventory_item',
      entity_id: data.id,
      payload: { vendor_id: vendorId, category, status: 'DRAFT' },
    }).then(() => undefined, () => undefined)

    setSubmitting(false)
    router.push('/vendor/dashboard')
  }, [vendorId, locationId, title, description, category, priceDollars, currency, router, supabase])

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
          <Link href="/vendor/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-4">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <h1 className="text-2xl font-black text-black mb-1">Create Listing</h1>
          {vendorName && (
            <p className="text-sm text-gray-500 mb-6">
              Listing will be created for <strong className="text-gray-700">{vendorName}</strong> with status <span className="font-mono text-xs bg-gray-200 px-1.5 py-0.5 rounded">DRAFT</span>.
            </p>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
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
                placeholder="e.g. Sunset Loft – 2BR"
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
                placeholder="Describe what guests get, what's included, capacity, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="text-sm font-bold text-gray-700 block mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="text-sm font-bold text-gray-700 block mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  id="location"
                  value={locationId}
                  onChange={e => setLocationId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                  required
                >
                  {locations.length === 0 && <option value="">No locations available</option>}
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}{loc.region ? `, ${loc.region}` : ''}
                    </option>
                  ))}
                </select>
                {vendorLocationId && vendorLocationId === locationId && (
                  <p className="text-xs text-gray-400 mt-1">Using your vendor's primary location.</p>
                )}
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
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Stored as cents: <span className="font-mono">{Math.round((parseFloat(priceDollars || '0') || 0) * 100)}</span>
                </p>
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
              <p className="text-xs text-gray-400">
                Status will be <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">DRAFT</span> — publish it from Manage Listings when ready.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-black text-white font-bold px-5 py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating…
                  </>
                ) : (
                  <>
                    Create Listing <ArrowRight className="w-4 h-4" />
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
