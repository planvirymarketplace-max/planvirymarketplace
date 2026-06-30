'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Calendar, DollarSign, Flag, TrendingUp, Check, X, Eye } from 'lucide-react'

export default function AdminDashboardPage() {
  const supabase = createClient()
  const [pendingVendors, setPendingVendors] = useState<any[]>([])
  const [stats, setStats] = useState({ totalVendors: 0, totalBookings: 0, totalDisputes: 0, totalGMV: 0 })

  useEffect(() => {
    const load = async () => {
      const { data: vendors } = await supabase
        .from('vendors')
        .select('id, business_name, status, onboarding_step, created_at, profile_published')
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false })
        .limit(10)

      setPendingVendors(vendors || [])

      const [vCount, bCount, dCount] = await Promise.all([
        supabase.from('vendors').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('disputes').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      ])

      setStats({
        totalVendors: vCount.count || 0,
        totalBookings: bCount.count || 0,
        totalDisputes: dCount.count || 0,
        totalGMV: 0,
      })
    }
    load()
  }, [])

  const approveVendor = async (id: string) => {
    await supabase.from('vendors').update({ status: 'approved' }).eq('id', id)
    setPendingVendors(prev => prev.filter(v => v.id !== id))
  }

  const rejectVendor = async (id: string) => {
    await supabase.from('vendors').update({ status: 'rejected' }).eq('id', id)
    setPendingVendors(prev => prev.filter(v => v.id !== id))
  }

  const cards = [
    { label: 'Total Vendors', value: stats.totalVendors, icon: Users, color: 'text-teal-600' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'text-blue-600' },
    { label: 'Open Disputes', value: stats.totalDisputes, icon: Flag, color: 'text-red-500' },
    { label: 'Total GMV', value: `$${stats.totalGMV.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-black tracking-tight mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

      {/* Pending vendor approvals */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-black text-black uppercase tracking-widest">Pending Vendor Approvals ({pendingVendors.length})</h2>
        </div>
        {pendingVendors.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-400">No pending approvals. All caught up.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingVendors.map(vendor => (
              <div key={vendor.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black">{vendor.business_name}</p>
                  <p className="text-xs text-gray-400">Onboarding: {vendor.onboarding_step} | Published: {vendor.profile_published ? 'Yes' : 'No'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveVendor(vendor.id)} className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => rejectVendor(vendor.id)} className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-600 transition-colors">
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
