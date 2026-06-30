'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, User, Inbox, Calendar, DollarSign, Star, Settings, ChevronRight } from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/vendor/portal/dashboard' },
  { id: 'profile', label: 'Profile', icon: User, href: '/vendor/portal/profile' },
  { id: 'inbox', label: 'Inbox', icon: Inbox, href: '/vendor/portal/inbox' },
  { id: 'bookings', label: 'Bookings', icon: Calendar, href: '/vendor/portal/bookings' },
  { id: 'finance', label: 'Finance', icon: DollarSign, href: '/vendor/portal/finance' },
  { id: 'reviews', label: 'Reviews', icon: Star, href: '/vendor/portal/reviews' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/vendor/portal/settings' },
]

export default function VendorPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()
  const [vendor, setVendor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?next=/vendor/portal/dashboard'); return }

      const { data: vendorData } = await supabase
        .from('vendors')
        .select('id, business_name, onboarding_step, status, profile_published, profile_completeness_score')
        .eq('user_id', user.id)
        .single()

      if (!vendorData) {
        router.push('/vendor/onboarding')
        return
      }
      if (vendorData.onboarding_step !== 'complete') {
        router.push('/vendor/onboarding')
        return
      }
      setVendor(vendorData)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-coral rounded-full animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-sm text-white/60 hover:text-white">← Planviry</Link>
          <h2 className="mt-2 text-lg font-bold truncate">{vendor?.business_name || 'Vendor Portal'}</h2>
          <div className="mt-1 flex items-center gap-2">
            {vendor?.profile_published ? (
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">● Published</span>
            ) : (
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">● Unpublished</span>
            )}
          </div>
          {vendor?.profile_completeness_score !== undefined && (
            <div className="mt-2">
              <div className="text-[10px] text-white/40 uppercase tracking-wider">Profile Completeness</div>
              <div className="mt-1 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-coral rounded-full" style={{ width: `${vendor.profile_completeness_score}%` }} />
              </div>
              <span className="text-[10px] text-white/60">{vendor.profile_completeness_score}%</span>
            </div>
          )}
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <Link key={tab.id} href={tab.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile nav */}
        <div className="lg:hidden bg-black text-white p-4 flex items-center justify-between overflow-x-auto">
          <Link href="/" className="text-xs text-white/60">← Home</Link>
          <div className="flex gap-3">
            {TABS.map(tab => (
              <Link key={tab.id} href={tab.href} className="text-xs text-white/70 hover:text-white whitespace-nowrap">{tab.label}</Link>
            ))}
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
