'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Users, Calendar, DollarSign, Flag, FileText, Settings, Shield, Check, X, Eye } from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'vendors', label: 'Vendors', icon: Users, href: '/admin/vendors' },
  { id: 'listings', label: 'Listings', icon: FileText, href: '/admin/listings' },
  { id: 'bookings', label: 'Bookings', icon: Calendar, href: '/admin/bookings' },
  { id: 'disputes', label: 'Disputes', icon: Flag, href: '/admin/disputes' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?next=/admin'); return }

      const { data: role } = await supabase
        .from('planviry_user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!role || role.role !== 'admin') {
        router.push('/')
        return
      }
      setAuthorized(true)
      setLoading(false)
    }
    check()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-coral rounded-full animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-black text-white shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-sm text-white/60 hover:text-white">← Planviry</Link>
          <h2 className="mt-2 text-lg font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-coral" /> Admin Portal
          </h2>
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
      <main className="flex-1 overflow-y-auto">
        <div className="lg:hidden bg-black text-white p-4 flex gap-4 overflow-x-auto">
          {TABS.map(tab => (
            <Link key={tab.id} href={tab.href} className="text-xs text-white/70 hover:text-white whitespace-nowrap">{tab.label}</Link>
          ))}
        </div>
        {children}
      </main>
    </div>
  )
}
