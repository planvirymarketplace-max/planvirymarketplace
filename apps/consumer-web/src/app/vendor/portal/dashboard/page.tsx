'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Inbox, DollarSign, Star, Eye, TrendingUp } from 'lucide-react'

export default function VendorDashboardPage() {
  const supabase = createClient()
  const [stats, setStats] = useState({ bookings: 0, inquiries: 0, pendingPayout: 0, avgRating: 0, profileViews: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!vendor) return

      const [bookings, inquiries, payouts, reviews] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('vendor_id', vendor.id).eq('status', 'confirmed'),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('vendor_id', vendor.id).eq('status', 'open'),
        supabase.from('escrow_holds').select('holdback_amount', { count: 'exact' }).eq('vendor_id', vendor.id).eq('hold_status', 'active'),
        supabase.from('reviews').select('rating', { count: 'exact' }).eq('vendor_id', vendor.id),
      ])

      setStats({
        bookings: bookings.count || 0,
        inquiries: inquiries.count || 0,
        pendingPayout: payouts.data?.reduce((sum, h) => sum + (h.holdback_amount || 0), 0) || 0,
        avgRating: 0,
        profileViews: 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { label: 'Upcoming Bookings', value: stats.bookings, icon: Calendar, color: 'text-teal-600' },
    { label: 'Pending Inquiries', value: stats.inquiries, icon: Inbox, color: 'text-coral' },
    { label: 'Pending Payout', value: `$${stats.pendingPayout.toFixed(2)}`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Avg Rating', value: stats.avgRating || '—', icon: Star, color: 'text-amber-500' },
    { label: 'Profile Views (7d)', value: stats.profileViews, icon: Eye, color: 'text-blue-600' },
    { label: 'Profile Completeness', value: '—', icon: TrendingUp, color: 'text-purple-600' },
  ]

  if (loading) {
    return <div className="p-8"><div className="w-8 h-8 border-4 border-gray-200 border-t-coral rounded-full animate-spin" /></div>
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-black tracking-tight mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(card => {
          const Icon = card.icon
          return <AppLayoutShell>
            <div key={card.label} className="bg-white p-4 rounded-xl border border-gray-200">
              <Icon className={`w-5 h-5 ${card.color} mb-2`} />
              <div className="text-2xl font-black text-black">{card.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">{card.label}</div>
            </div>
          </AppLayoutShell>

        })}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-black text-black uppercase tracking-widest mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-400">No recent activity yet. Share your profile to get started.</p>
        </div>
      </div>
    </div>
  )
}
