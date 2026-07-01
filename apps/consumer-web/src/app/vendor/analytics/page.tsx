'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, TrendingUp, DollarSign, ShoppingBag, Store } from 'lucide-react'

// Canonical inventory_category enum from the live schema.
// FIX-10: aligned to the live Supabase enum — SERVICE (was VENDOR_SERVICE)
// and ACTIVITY (was EXPERIENCE).
const CATEGORY_LABELS: Record<string, string> = {
  LODGING: 'Lodging',
  VENUE_RENTAL: 'Venues',
  SERVICE: 'Services',
  DINING: 'Dining',
  ACTIVITY: 'Experiences',
  EVENT_TICKET: 'Event Tickets',
  TRANSPORT: 'Transport',
}

const CATEGORY_ORDER = [
  'LODGING',
  'EVENT_TICKET',
  'VENUE_RENTAL',
  'SERVICE',
  'DINING',
  'ACTIVITY',
  'TRANSPORT',
]

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-teal-100 text-teal-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
}

function formatPrice(cents: number | null | undefined, currency: string | null | undefined) {
  if (!cents) return 'Free'
  return (cents / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: currency || 'USD',
  })
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}

type RecentReservation = {
  id: string
  status: string | null
  total_price_cents: number | null
  currency: string | null
  created_at: string | null
  inventory_items?: { title: string | null } | { title: string | null }[] | null
}

type AnalyticsState = {
  loading: boolean
  error: string
  vendorId: string | null
  vendorName: string | null
  totals: {
    listings: number
    reservations: number
    revenue: number
    recent: RecentReservation[]
  }
  byCategory: { category: string; count: number }[]
  byStatus: { status: string; count: number }[]
}

const EMPTY_STATE: AnalyticsState = {
  loading: true,
  error: '',
  vendorId: null,
  vendorName: null,
  totals: { listings: 0, reservations: 0, revenue: 0, recent: [] },
  byCategory: [],
  byStatus: [],
}

export default function AnalyticsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [state, setState] = useState<AnalyticsState>(EMPTY_STATE)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?returnTo=/vendor/analytics'); return }
      const { data: staff } = await supabase
        .from('vendor_staff')
        .select('vendor_id, vendor_accounts!inner(name)')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .maybeSingle()
      if (!staff) { router.push('/onboarding/vendor'); return }

      const vendorId = staff.vendor_id
      const vendorName =
        (staff.vendor_accounts as { name?: string } | null)?.name ?? null

      // Each query below is wrapped so a single failure doesn't tank the
      // whole page — we surface what we can and leave the rest at 0 / empty.
      let listings = 0
      let byCategory: { category: string; count: number }[] = []
      try {
        const { data: items, error: itemsErr } = await supabase
          .from('inventory_items')
          .select('id, category')
          .eq('vendor_id', vendorId)
        if (itemsErr) throw itemsErr
        listings = items?.length ?? 0
        const catMap = new Map<string, number>()
        for (const it of items ?? []) {
          const c = (it as { category?: string | null }).category ?? 'UNKNOWN'
          catMap.set(c, (catMap.get(c) ?? 0) + 1)
        }
        byCategory = Array.from(catMap.entries()).map(([category, count]) => ({
          category,
          count,
        }))
      } catch {
        listings = 0
        byCategory = []
      }

      let reservations = 0
      let revenue = 0
      let byStatus: { status: string; count: number }[] = []
      try {
        const { data: res, error: resErr } = await supabase
          .from('reservations')
          .select('id, status, total_price_cents')
          .eq('vendor_id', vendorId)
        if (resErr) throw resErr
        reservations = res?.length ?? 0
        const statusMap = new Map<string, number>()
        let rev = 0
        for (const r of res ?? []) {
          const row = r as {
            status?: string | null
            total_price_cents?: number | null
          }
          const s = row.status ?? 'UNKNOWN'
          statusMap.set(s, (statusMap.get(s) ?? 0) + 1)
          if (s === 'CONFIRMED' && typeof row.total_price_cents === 'number') {
            rev += row.total_price_cents
          }
        }
        revenue = rev
        byStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
          status,
          count,
        }))
      } catch {
        reservations = 0
        revenue = 0
        byStatus = []
      }

      // Recent 10 reservations with their inventory title.
      let recent: RecentReservation[] = []
      try {
        const { data: rec, error: recErr } = await supabase
          .from('reservations')
          .select(`
            id, status, total_price_cents, currency, created_at,
            inventory_items(title)
          `)
          .eq('vendor_id', vendorId)
          .order('created_at', { ascending: false })
          .limit(10)
        if (recErr) throw recErr
        recent = (rec as RecentReservation[] | null) ?? []
      } catch {
        recent = []
      }

      setState({
        loading: false,
        error: '',
        vendorId,
        vendorName,
        totals: { listings, reservations, revenue, recent },
        byCategory,
        byStatus,
      })
    }
    load()
  }, [])

  if (state.loading) {
    return (
      <AppLayoutShell>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AppLayoutShell>
    )
  }

  const hasData =
    state.totals.listings > 0 ||
    state.totals.reservations > 0 ||
    state.totals.revenue > 0

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>

          <h1 className="text-2xl font-black text-black mb-1">Analytics</h1>
          <p className="text-sm text-gray-500 mb-6">
            {state.vendorName
              ? `Performance summary for ${state.vendorName}.`
              : 'Performance summary for your vendor account.'}
          </p>

          {/* Top KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-500">
                  <Store className="w-4 h-4" />
                  <CardDescription>Listings</CardDescription>
                </div>
                <CardTitle className="text-3xl">{state.totals.listings}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-500">
                  <ShoppingBag className="w-4 h-4" />
                  <CardDescription>Reservations</CardDescription>
                </div>
                <CardTitle className="text-3xl">{state.totals.reservations}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="w-4 h-4" />
                  <CardDescription>Revenue (confirmed)</CardDescription>
                </div>
                <CardTitle className="text-3xl">
                  ${(state.totals.revenue / 100).toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {!hasData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  No analytics yet
                </CardTitle>
                <CardDescription>
                  Once you publish listings and receive reservations, you&apos;ll see
                  category breakdowns, status distribution, and recent bookings here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/vendor/create-listing"
                  className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Create your first listing
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Listings by category */}
              <Card>
                <CardHeader>
                  <CardTitle>Listings by category</CardTitle>
                  <CardDescription>
                    How your {state.totals.listings} listing
                    {state.totals.listings === 1 ? '' : 's'} break down.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {state.byCategory.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">
                      Category breakdown unavailable.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Listings</TableHead>
                          <TableHead className="text-right">Share</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {CATEGORY_ORDER.filter((c) =>
                          state.byCategory.some((b) => b.category === c),
                        )
                          .concat(
                            state.byCategory
                              .filter((b) => !CATEGORY_ORDER.includes(b.category))
                              .map((b) => b.category),
                          )
                          .map((cat) => {
                            const row = state.byCategory.find((b) => b.category === cat)
                            if (!row) return null
                            const share =
                              state.totals.listings > 0
                                ? Math.round((row.count / state.totals.listings) * 100)
                                : 0
                            return (
                              <TableRow key={cat}>
                                <TableCell className="font-medium">
                                  {CATEGORY_LABELS[cat] ?? cat.replace(/_/g, ' ')}
                                </TableCell>
                                <TableCell className="text-right">{row.count}</TableCell>
                                <TableCell className="text-right text-gray-500">
                                  {share}%
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Reservations by status */}
              <Card>
                <CardHeader>
                  <CardTitle>Reservations by status</CardTitle>
                  <CardDescription>
                    Current pipeline across all {state.totals.reservations} reservation
                    {state.totals.reservations === 1 ? '' : 's'}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {state.byStatus.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">
                      Status breakdown unavailable.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Count</TableHead>
                          <TableHead className="text-right">Share</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {state.byStatus
                          .slice()
                          .sort((a, b) => b.count - a.count)
                          .map((row) => {
                            const share =
                              state.totals.reservations > 0
                                ? Math.round((row.count / state.totals.reservations) * 100)
                                : 0
                            return (
                              <TableRow key={row.status}>
                                <TableCell>
                                  <span
                                    className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                                      STATUS_STYLES[row.status] ?? 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {row.status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">{row.count}</TableCell>
                                <TableCell className="text-right text-gray-500">
                                  {share}%
                                </TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Recent reservations */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent reservations</CardTitle>
                  <CardDescription>The 10 most recent bookings.</CardDescription>
                </CardHeader>
                <CardContent>
                  {state.totals.recent.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">
                      No reservations yet.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Booked</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {state.totals.recent.map((r) => {
                          const inv = r.inventory_items
                          const title = Array.isArray(inv)
                            ? inv[0]?.title ?? 'Untitled'
                            : (inv as { title?: string } | null)?.title ?? 'Untitled'
                          return (
                            <TableRow key={r.id}>
                              <TableCell className="font-medium truncate max-w-[280px]">
                                {title}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{r.status ?? 'UNKNOWN'}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatPrice(r.total_price_cents, r.currency)}
                              </TableCell>
                              <TableCell className="text-right text-gray-500">
                                {formatDate(r.created_at)}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {state.vendorId && (
            <p className="text-xs text-gray-400 mt-6 text-center">
              Showing analytics for <span className="font-mono">vendor_id = {state.vendorId}</span>
            </p>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
