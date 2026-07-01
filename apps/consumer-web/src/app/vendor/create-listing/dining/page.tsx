'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { ArrowLeft, ArrowRight, Loader2, UtensilsCrossed } from 'lucide-react'

const CUISINE_TYPES = [
  'American',
  'Italian',
  'French',
  'Japanese',
  'Chinese',
  'Indian',
  'Mexican',
  'Mediterranean',
  'Thai',
  'Vietnamese',
  'Korean',
  'Spanish',
  'Greek',
  'Brazilian',
  'Middle Eastern',
  'Seafood',
  'Steakhouse',
  'Vegetarian / Vegan',
  'Fusion',
  'Tasting Menu',
  'Other',
] as const

export default function CreateDiningPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [vendorName, setVendorName] = useState<string>('')
  const [vendorLocationId, setVendorLocationId] = useState<string | null>(null)

  // form state
  const [title, setTitle] = useState('')
  const [cuisineType, setCuisineType] = useState<string>('Italian')
  const [pricePerPerson, setPricePerPerson] = useState<string>('')
  const [seatCapacity, setSeatCapacity] = useState<string>('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?returnTo=/vendor/create-listing/dining')
        return
      }
      const { data: staff, error: staffErr } = await supabase
        .from('vendor_staff')
        .select('vendor_id, vendor_accounts!inner(name)')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .maybeSingle()
      if (staffErr || !staff) {
        router.push('/onboarding/vendor')
        return
      }
      setVendorId(staff.vendor_id)
      setVendorName(
        (staff.vendor_accounts as { name?: string } | null)?.name ?? ''
      )
      setVendorLocationId(
        (staff.vendor_accounts as { location_id?: string | null } | null)
          ?.location_id ?? null
      )
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
      const dollars = parseFloat(pricePerPerson || '0') || 0
      if (dollars <= 0) {
        setError('Price per person must be greater than 0')
        return
      }
      const basePriceCents = Math.round(dollars * 100)
      const seats = parseInt(seatCapacity || '0', 10) || 0

      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${Math.random().toString(36).slice(2, 6)}`

      setSubmitting(true)
      const { data, error: insertErr } = await supabase
        .from('inventory_items')
        .insert({
          vendor_id: vendorId,
          location_id: vendorLocationId ?? null,
          title: title.trim(),
          slug,
          description: description.trim() || null,
          category: 'DINING',
          base_price_cents: basePriceCents,
          currency: 'USD',
          status: 'DRAFT',
          metadata: {
            cuisine_type: cuisineType,
            price_per_person_cents: basePriceCents,
            seat_capacity: seats,
          },
        })
        .select('id')
        .single()

      if (insertErr) {
        setError(insertErr.message)
        setSubmitting(false)
        return
      }

      await supabase
        .from('domain_events')
        .insert({
          event_type: 'inventory.created',
          entity_type: 'inventory_item',
          entity_id: data.id,
          payload: { vendor_id: vendorId, category: 'DINING', status: 'DRAFT' },
        })
        .then(() => undefined, () => undefined)

      setSubmitting(false)
      router.push('/vendor/listings')
    },
    [vendorId, vendorLocationId, title, cuisineType, pricePerPerson, seatCapacity, description, router, supabase]
  )

  if (loading) {
    return (
      <AppLayoutShell>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AppLayoutShell>
    )
  }

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Link
            href="/vendor/create-listing"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Choose a different category
          </Link>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-black leading-none">List a Dining Experience</h1>
              <p className="text-xs text-gray-400 mt-1">Category: DINING</p>
            </div>
          </div>
          {vendorName && (
            <p className="text-sm text-gray-500 mb-6">
              Listing will be created for{' '}
              <strong className="text-gray-700">{vendorName}</strong> with status{' '}
              <span className="font-mono text-xs bg-gray-200 px-1.5 py-0.5 rounded">DRAFT</span>.
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
          >
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
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 7-Course Tasting Menu for Two"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="cuisineType" className="text-sm font-bold text-gray-700 block mb-1">
                  Cuisine type <span className="text-red-500">*</span>
                </label>
                <select
                  id="cuisineType"
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                  required
                >
                  {CUISINE_TYPES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Stored in <span className="font-mono">metadata.cuisine_type</span>.
                </p>
              </div>
              <div>
                <label htmlFor="pricePerPerson" className="text-sm font-bold text-gray-700 block mb-1">
                  Price per person <span className="text-red-500">*</span>{' '}
                  <span className="text-gray-400 font-normal">($)</span>
                </label>
                <input
                  id="pricePerPerson"
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricePerPerson}
                  onChange={(e) => setPricePerPerson(e.target.value)}
                  placeholder="e.g. 95.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Stored as cents in <span className="font-mono">base_price_cents</span>.
                </p>
              </div>
              <div>
                <label htmlFor="seatCapacity" className="text-sm font-bold text-gray-700 block mb-1">
                  Seat capacity
                </label>
                <input
                  id="seatCapacity"
                  type="number"
                  min="0"
                  step="1"
                  value={seatCapacity}
                  onChange={(e) => setSeatCapacity(e.target.value)}
                  placeholder="e.g. 24"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Stored in <span className="font-mono">metadata.seat_capacity</span>.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-bold text-gray-700 block mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the menu, dietary options, beverage pairings, seating style, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400">
                Status will be{' '}
                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">DRAFT</span> — publish
                it from Manage Listings when ready.
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
                    Create Dining Listing <ArrowRight className="w-4 h-4" />
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
