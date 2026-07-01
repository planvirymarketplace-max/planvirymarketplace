'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import {
  DollarSign,
  Ticket,
  Users,
  TrendingUp,
  Calendar,
  Settings,
  CreditCard,
  Store,
  Home,
  Wrench,
  Bell,
  Mail,
  CalendarDays,
  Tag,
  Building2,
  MapPin,
  Briefcase,
  UtensilsCrossed,
  Car,
  ArrowRight,
} from 'lucide-react'

type Stats = {
  listings: number
  reservations: number
  revenue: number
  checkIns: number
  checkInsSource: 'check_ins' | 'reservations' | 'none'
}

type ModuleCard = {
  href: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: string
}

// The "5 modules" the vendor portal exposes — each maps to a create-listing
// branch (or, for Lodging, the Staybnb-hosted wizard at /hosting/create).
// Listed as 6 because the spec calls out 6 categories
// (Lodging / Event Tickets / Venues / Services / Dining / Transport).
const MODULES: ModuleCard[] = [
  {
    href: '/hosting/create',
    title: 'Lodging',
    description: 'Vacation rentals, lofts, and short-stay properties.',
    icon: Building2,
    category: 'LODGING',
  },
  {
    href: '/tickets/admin/shows',
    title: 'Event Tickets',
    description: 'Shows with performances, tiers, and reserved seating.',
    icon: Ticket,
    category: 'EVENT_TICKET',
  },
  {
    href: '/vendor/create-listing/venue',
    title: 'Venues',
    description: 'Hourly-rental spaces — halls, rooftops, studios.',
    icon: MapPin,
    category: 'VENUE_RENTAL',
  },
  {
    href: '/vendor/create-listing/service',
    title: 'Services',
    description: 'Pro vendors — DJs, photographers, florists, planners.',
    icon: Briefcase,
    category: 'SERVICE',
  },
  {
    href: '/vendor/create-listing/dining',
    title: 'Dining',
    description: 'Chef tables, tasting menus, private dinners.',
    icon: UtensilsCrossed,
    category: 'DINING',
  },
  {
    href: '/vendor/create-listing/transport',
    title: 'Transport',
    description: 'Shuttles, party buses, limos, charter vans.',
    icon: Car,
    category: 'TRANSPORT',
  },
]

export default function VendorDashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [vendor, setVendor] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({
    listings: 0,
    reservations: 0,
    revenue: 0,
    checkIns: 0,
    checkInsSource: 'none',
  })
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeError, setStripeError] = useState('')

  const handleStripeConnect = async () => {
    setStripeError('')
    setStripeLoading(true)
    try {
      const res = await fetch('/api/stripe-connect/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) {
        setStripeError(data?.error?.message || data?.error || 'Failed to start Stripe onboarding')
        return
      }
      const url = data?.onboarding_url || data?.data?.onboarding_url
      if (url) {
        window.location.href = url
      } else {
        setStripeError('No onboarding URL returned from Stripe')
      }
    } catch (err) {
      setStripeError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setStripeLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?returnTo=/vendor/dashboard'); return }
      const { data: staff } = await supabase
        .from('vendor_staff')
        .select('vendor_id, role, vendor_accounts!inner(id, name, slug, status, stripe_connect_account_id)')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .maybeSingle()
      if (!staff) { router.push('/onboarding/vendor'); return }
      setVendor(staff.vendor_accounts)

      const vendorId = staff.vendor_id

      // Listings count (any status).
      const { count: listings } = await supabase
        .from('inventory_items')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId)

      // Reservations count (CONFIRMED or PENDING — the active pipeline).
      const { count: reservations } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId)
        .in('status', ['CONFIRMED', 'PENDING'])

      // Revenue = SUM(total_price_cents) for CONFIRMED reservations.
      // Supabase REST has no SUM RPC wired up, so we fetch the column and sum
      // in JS. Wrap in try/catch — a query error must never crash the dashboard.
      let revenue = 0
      try {
        const { data: revRows, error: revErr } = await supabase
          .from('reservations')
          .select('total_price_cents')
          .eq('vendor_id', vendorId)
          .eq('status', 'CONFIRMED')
        if (!revErr && Array.isArray(revRows)) {
          revenue = revRows.reduce(
            (sum, r) => sum + (typeof r.total_price_cents === 'number' ? r.total_price_cents : 0),
            0,
          )
        }
      } catch {
        revenue = 0
      }

      // Check-ins: prefer the check_ins table; fall back to COMPLETED
      // reservations if the table is missing or the query errors.
      // NOTE: check_ins has no vendor_id column (FK is via reservation_id),
      // so this query is expected to error on the live schema — the fallback
      // path is the real production source for this number.
      let checkIns = 0
      let checkInsSource: Stats['checkInsSource'] = 'none'
      try {
        const { count: ciCount, error: ciErr } = await supabase
          .from('check_ins')
          .select('id', { count: 'exact', head: true })
          .eq('vendor_id', vendorId)
        if (!ciErr && ciCount != null) {
          checkIns = ciCount
          checkInsSource = 'check_ins'
        } else {
          // Fallback: count COMPLETED reservations for this vendor.
          const { count: completedCount } = await supabase
            .from('reservations')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendorId)
            .eq('status', 'COMPLETED')
          checkIns = completedCount ?? 0
          checkInsSource = 'reservations'
        }
      } catch {
        try {
          const { count: completedCount } = await supabase
            .from('reservations')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendorId)
            .eq('status', 'COMPLETED')
          checkIns = completedCount ?? 0
          checkInsSource = 'reservations'
        } catch {
          checkIns = 0
          checkInsSource = 'none'
        }
      }

      setStats({
        listings: listings ?? 0,
        reservations: reservations ?? 0,
        revenue,
        checkIns,
        checkInsSource,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  const nav = [
    { href: '/vendor/dashboard', label: 'Dashboard', icon: Home },
    { href: '/vendor/pms', label: 'PMS Grid', icon: Wrench },
    { href: '/vendor/bookings', label: 'Bookings', icon: Calendar },
    { href: '/vendor/availability', label: 'Availability', icon: CalendarDays },
    { href: '/vendor/tickets', label: 'Service Tickets', icon: Ticket },
    { href: '/vendor/messages', label: 'Messages', icon: Mail },
    { href: '/vendor/promotions', label: 'Promotions', icon: Tag },
    { href: '/vendor/events', label: 'Events', icon: Users },
    { href: '/vendor/payouts', label: 'Payouts', icon: CreditCard },
    { href: '/vendor/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/vendor/onboarding', label: 'Onboarding', icon: Settings },
  ]

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-200 p-4 hidden md:block">
          <div className="mb-6">
            <p className="text-xs text-gray-400 uppercase font-bold">Vendor Portal</p>
            <p className="font-bold text-black text-sm">{vendor?.name}</p>
            <p className="text-xs text-gray-400">{vendor?.status}</p>
          </div>
          <nav className="space-y-1">
            {nav.map(item => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-colors">
                  <Icon className="w-4 h-4" /> {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 md:p-8">
          <h1 className="text-2xl font-black text-black mb-6">Dashboard</h1>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <Store className="w-5 h-5 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Listings</p>
              <p className="text-2xl font-black text-black">{stats.listings}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <Calendar className="w-5 h-5 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Reservations</p>
              <p className="text-2xl font-black text-black">{stats.reservations}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <DollarSign className="w-5 h-5 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="text-2xl font-black text-black">${(stats.revenue / 100).toFixed(0)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">confirmed bookings</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <Users className="w-5 h-5 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Check-ins</p>
              <p className="text-2xl font-black text-black">{stats.checkIns}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {stats.checkInsSource === 'check_ins'
                  ? 'from check_ins table'
                  : stats.checkInsSource === 'reservations'
                    ? 'via COMPLETED reservations'
                    : 'unavailable'}
              </p>
            </div>
          </div>

          {/* Modules section */}
          <section className="mb-8">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-lg font-black text-black">Your modules</h2>
              <p className="text-xs text-gray-400">
                Six listing types you can manage. Click any to create or manage.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MODULES.map((m) => {
                const Icon = m.icon
                return (
                  <Link
                    key={m.category}
                    href={m.href}
                    className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-black hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-black flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                        {m.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-black mb-1">{m.title}</h3>
                    <p className="text-sm text-gray-500 leading-snug flex-1">{m.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-gray-700 group-hover:text-black">
                      Manage
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>

          {!vendor?.stripe_connect_account_id && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-orange-800 mb-2">Set up payments to receive payouts</p>
              {stripeError && <p className="text-sm text-red-600 mb-2">{stripeError}</p>}
              <button
                onClick={handleStripeConnect}
                disabled={stripeLoading}
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {stripeLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Connecting…
                  </>
                ) : (
                  'Connect Stripe'
                )}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/vendor/create-listing" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <Store className="w-6 h-6 text-gray-400 mb-2" />
              <p className="font-bold text-black">Create Listing</p>
              <p className="text-sm text-gray-400">Add a new property, event, or service</p>
            </Link>
            <Link href="/vendor/listings" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <Home className="w-6 h-6 text-gray-400 mb-2" />
              <p className="font-bold text-black">Manage Listings</p>
              <p className="text-sm text-gray-400">Edit, pause, or archive your listings</p>
            </Link>
            <Link href="/check-in" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <Ticket className="w-6 h-6 text-gray-400 mb-2" />
              <p className="font-bold text-black">Check-in Scanner</p>
              <p className="text-sm text-gray-400">Scan QR codes at the door</p>
            </Link>
            <Link href="/vendor/analytics" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <TrendingUp className="w-6 h-6 text-gray-400 mb-2" />
              <p className="font-bold text-black">Analytics</p>
              <p className="text-sm text-gray-400">Revenue, occupancy, cancel reasons</p>
            </Link>
          </div>
        </main>
      </div>
    </AppLayoutShell>
  )
}
