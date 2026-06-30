'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { DollarSign, Ticket, Users, TrendingUp, Calendar, Settings, CreditCard, Store, Home, Wrench, Bell } from 'lucide-react'

export default function VendorDashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [vendor, setVendor] = useState<any>(null)
  const [stats, setStats] = useState({ listings: 0, reservations: 0, revenue: 0, checkIns: 0 })

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

      const { count: listings } = await supabase.from('inventory_items').select('*', { count: 'exact', head: true }).eq('vendor_id', staff.vendor_id)
      const { count: reservations } = await supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('vendor_id', staff.vendor_id).in('status', ['CONFIRMED', 'PENDING'])
      setStats({ listings: listings ?? 0, reservations: reservations ?? 0, revenue: 0, checkIns: 0 })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  const nav = [
    { href: '/vendor/dashboard', label: 'Dashboard', icon: Home },
    { href: '/vendor/pms', label: 'PMS Grid', icon: Wrench },
    { href: '/vendor/bookings', label: 'Bookings', icon: Calendar },
    { href: '/vendor/tickets', label: 'Service Tickets', icon: Ticket },
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
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-black text-black mb-6">Dashboard</h1>
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
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <Users className="w-5 h-5 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Check-ins</p>
              <p className="text-2xl font-black text-black">{stats.checkIns}</p>
            </div>
          </div>

          {!vendor?.stripe_connect_account_id && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-orange-800 mb-2">Set up payments to receive payouts</p>
              <a href="/api/stripe-connect/onboarding" className="inline-block text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800">
                Connect Stripe
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/hosting/create" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <Store className="w-6 h-6 text-gray-400 mb-2" />
              <p className="font-bold text-black">Create Listing</p>
              <p className="text-sm text-gray-400">Add a new property, event, or service</p>
            </Link>
            <Link href="/hosting/listings" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
