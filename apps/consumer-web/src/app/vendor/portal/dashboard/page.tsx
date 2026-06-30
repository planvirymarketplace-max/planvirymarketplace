'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DollarSign, Ticket, Users, TrendingUp, Calendar, Settings, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

export default function VendorDashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ reservations: 0, revenue: 0, checkIns: 0, events: 0 })
  const [payouts, setPayouts] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?next=/vendor/portal/dashboard'); return }

      // Fetch events from our inventory_items
      const { data: items } = await supabase
        .from('inventory_items')
        .select('id, title, status, category')
        .order('created_at', { ascending: false })
        .limit(10)

      setEvents(items ?? [])

      // Fetch vendor stats via our API
      try {
        const statsRes = await fetch(`/api/events/${items?.[0]?.id || '00000000-0000-0000-0000-000000000000'}/stats`)
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats({
            reservations: data.stats?.total_reservations ?? 0,
            revenue: data.stats?.total_revenue_cents ?? 0,
            checkIns: data.stats?.check_in_count ?? 0,
            events: items?.length ?? 0,
          })
        }
      } catch {}

      // Fetch payouts
      try {
        const payoutRes = await fetch('/api/stripe-connect/payouts')
        if (payoutRes.ok) {
          const data = await payoutRes.json()
          setPayouts(data.payouts ?? [])
        }
      } catch {}

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-black">Vendor Dashboard</h1>
            <Link href="/vendor/onboarding" className="text-sm text-gray-500 hover:text-black">Settings</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <Ticket className="w-5 h-5 text-gray-400 mb-1" />
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
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <Calendar className="w-5 h-5 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Listings</p>
              <p className="text-2xl font-black text-black">{stats.events}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-black mb-4">Your Listings</h2>
              {events.length === 0 ? (
                <p className="text-sm text-gray-400 mb-3">No listings yet.</p>
              ) : (
                <div className="space-y-2">
                  {events.map((e: any) => (
                    <Link key={e.id} href={`/vendor/portal/listing/${e.id}`} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-black text-sm">{e.title}</p>
                        <p className="text-xs text-gray-400">{e.category} · {e.status}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link href="/vendor/portal/create" className="block mt-4 text-center text-sm font-bold text-black border border-black rounded-lg py-2 hover:bg-black hover:text-white">
                + Create Listing
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-black mb-4">Payouts</h2>
              {payouts.length === 0 ? (
                <div>
                  <p className="text-sm text-gray-400 mb-3">No payouts yet. Set up Stripe Connect to receive payments.</p>
                  <a href="/api/stripe-connect/onboarding" className="block text-center text-sm font-bold text-white bg-black rounded-lg py-2 hover:bg-gray-800">
                    Set up Stripe Connect
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  {payouts.slice(0, 5).map((p: any) => (
                    <div key={p.payout_id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium text-black text-sm">${(p.amount_cents / 100).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{p.status} · {p.reservation_count} reservations</p>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(p.arrival_date * 1000).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Link href="/check-in" className="flex-1 bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md">
              <Users className="w-6 h-6 mx-auto text-gray-400 mb-1" />
              <p className="font-bold text-black text-sm">Check-in Scanner</p>
            </Link>
            <Link href="/vendor/portal/attendees" className="flex-1 bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md">
              <Ticket className="w-6 h-6 mx-auto text-gray-400 mb-1" />
              <p className="font-bold text-black text-sm">Attendees</p>
            </Link>
            <Link href="/vendor/portal/reports" className="flex-1 bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md">
              <TrendingUp className="w-6 h-6 mx-auto text-gray-400 mb-1" />
              <p className="font-bold text-black text-sm">Reports</p>
            </Link>
          </div>
        </div>
      </div>
    </AppLayoutShell>
  )
}
