'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Filter,
  Calendar,
  User,
  Hash,
  DollarSign,
} from 'lucide-react'

type Reservation = {
  id: string
  status: string | null
  quantity: number | null
  unit_price_cents: number | null
  total_price_cents: number | null
  currency: string | null
  starts_at: string | null
  ends_at: string | null
  created_at: string | null
  inventory_items?: {
    title: string
    category: string | null
  } | null
  user_profiles?: {
    display_name: string | null
    email: string
  } | null
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'NO_SHOW', label: 'No-show' },
]

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
  NO_SHOW: 'bg-orange-100 text-orange-700',
}

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

function formatPrice(cents: number | null, currency: string | null): string {
  if (!cents) return 'Free'
  return (cents / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: currency || 'USD',
  })
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function VendorBookingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login?returnTo=/vendor/bookings')
      return
    }
    const { data: staff, error: staffErr } = await supabase
      .from('vendor_staff')
      .select('vendor_id')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .maybeSingle()
    if (staffErr || !staff) {
      router.push('/onboarding/vendor')
      return
    }
    setVendorId(staff.vendor_id)

    const { data: rows, error: rowsErr } = await supabase
      .from('reservations')
      .select(
        `
        id, status, quantity, unit_price_cents, total_price_cents, currency,
        starts_at, ends_at, created_at,
        inventory_items!inner(title, category),
        user_profiles!inner(display_name, email)
      `
      )
      .eq('vendor_id', staff.vendor_id)
      .order('created_at', { ascending: false })

    if (rowsErr) {
      setError(rowsErr.message)
    }
    setReservations((rows as Reservation[] | null) ?? [])
    setLoading(false)
  }, [router, supabase])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        await load()
      } finally {
        if (!cancelled) {
          // load() already manages its own loading/error state.
        }
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [load])

  const filtered =
    statusFilter === 'ALL'
      ? reservations
      : reservations.filter((r) => r.status === statusFilter)

  // Compute simple summary metrics for the filtered set.
  const totalCents = filtered.reduce(
    (sum, r) => sum + (r.total_price_cents ?? 0),
    0
  )
  const currency = filtered[0]?.currency ?? 'USD'

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <Link
                href="/vendor/dashboard"
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-2"
              >
                <ArrowLeft className="w-4 h-4" /> Dashboard
              </Link>
              <h1 className="text-2xl font-black text-black">Bookings</h1>
              <p className="text-sm text-gray-500 mt-1">
                All reservations against your vendor account — across every
                category you list.
              </p>
            </div>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Summary tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <Hash className="w-4 h-4 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Total reservations</p>
              <p className="text-xl font-black text-black">{reservations.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <Filter className="w-4 h-4 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Matching filter</p>
              <p className="text-xl font-black text-black">{filtered.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <DollarSign className="w-4 h-4 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Filtered total</p>
              <p className="text-xl font-black text-black">
                {formatPrice(totalCents, currency)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <Calendar className="w-4 h-4 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Confirmed</p>
              <p className="text-xl font-black text-black">
                {reservations.filter((r) => r.status === 'CONFIRMED').length}
              </p>
            </div>
          </div>

          {/* Status filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex items-center gap-2 flex-wrap">
            <label
              htmlFor="statusFilter"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide"
            >
              <Filter className="w-3.5 h-3.5" /> Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-400 ml-auto">
              Showing {filtered.length} of {reservations.length}
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
          ) : reservations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">
                No reservations yet. Once customers book your listings, they&apos;ll appear here.
              </p>
              <Link
                href="/vendor/listings"
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Go to Manage Listings
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">
                No reservations match the selected status.
              </p>
              <button
                onClick={() => setStatusFilter('ALL')}
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <div className="col-span-4">Item</div>
                <div className="col-span-2">Customer</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-1 text-right">Qty</div>
              </div>
              <ul className="divide-y divide-gray-100">
                {filtered.map((r) => {
                  const itemTitle = r.inventory_items?.title ?? 'Untitled item'
                  const category = r.inventory_items?.category ?? null
                  const customerName =
                    r.user_profiles?.display_name || r.user_profiles?.email || 'Guest'
                  return (
                    <li
                      key={r.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-gray-50/50"
                    >
                      <div className="md:col-span-4">
                        <p className="font-bold text-black text-sm truncate">
                          {itemTitle}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${CATEGORY_STYLES[category ?? ''] ?? 'bg-gray-100 text-gray-700'}`}
                          >
                            {formatCategory(category)}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400 truncate">
                            {r.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-xs text-gray-600 md:hidden font-bold">
                          Customer:{' '}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm text-gray-700 truncate">
                          <User className="w-3 h-3 text-gray-400" />
                          {customerName}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-xs text-gray-600 md:hidden font-bold">
                          Date:{' '}
                        </span>
                        <p className="text-sm text-gray-700">
                          {formatDate(r.starts_at)}
                        </p>
                        {r.ends_at && (
                          <p className="text-xs text-gray-400">
                            until {formatDate(r.ends_at)}
                          </p>
                        )}
                        {!r.starts_at && r.created_at && (
                          <p className="text-xs text-gray-400">
                            booked {formatDateTime(r.created_at)}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-1">
                        <span
                          className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${STATUS_STYLES[r.status ?? 'PENDING'] ?? 'bg-gray-100 text-gray-700'}`}
                        >
                          {r.status ?? 'PENDING'}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-xs text-gray-600 md:hidden font-bold">
                          Price:{' '}
                        </span>
                        <p className="text-sm font-bold text-gray-900">
                          {formatPrice(r.total_price_cents, r.currency)}
                        </p>
                        {r.unit_price_cents && r.quantity && r.quantity > 1 && (
                          <p className="text-xs text-gray-400">
                            {formatPrice(r.unit_price_cents, r.currency)} ×{' '}
                            {r.quantity}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-1 md:text-right">
                        <span className="text-sm font-bold text-gray-700">
                          {r.quantity ?? 1}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {vendorId && (
            <p className="text-xs text-gray-400 mt-6 text-center">
              Showing reservations where{' '}
              <span className="font-mono">vendor_id = {vendorId}</span>
            </p>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
