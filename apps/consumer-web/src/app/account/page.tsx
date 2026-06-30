'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, CreditCard, Bell, Heart, Ticket, Settings, LogOut, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

export default function AccountDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({ reservations: 0, itineraries: 0, saved: 0, paymentMethods: 0 })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?returnTo=/account'); return }
      setUser(user)
      const { data: p } = await supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle()
      if (!p) { router.push('/onboarding/user'); return }
      setProfile(p)

      const [resRes, itinRes, savedRes, payRes] = await Promise.all([
        supabase.from('reservations').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('itinerary_sessions').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
        supabase.from('saved_items').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('payment_methods').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ])
      setCounts({
        reservations: resRes.count ?? 0,
        itineraries: itinRes.count ?? 0,
        saved: savedRes.count ?? 0,
        paymentMethods: payRes.count ?? 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  const sections = [
    { href: '/account/profile', icon: Settings, label: 'Profile', desc: 'Edit name, email, preferences' },
    { href: '/account/reservations', icon: Calendar, label: 'Reservations', count: counts.reservations, desc: 'View all bookings' },
    { href: '/account/itineraries', icon: MapPin, label: 'Itineraries', count: counts.itineraries, desc: 'Trip plans' },
    { href: '/account/payments', icon: CreditCard, label: 'Payment Methods', count: counts.paymentMethods, desc: 'Saved cards' },
    { href: '/account/saved', icon: Heart, label: 'Saved Items', count: counts.saved, desc: 'Favorites' },
    { href: '/account/notifications', icon: Bell, label: 'Notifications', desc: 'Email & push settings' },
    { href: '/account/support', icon: Package, label: 'Support', desc: 'Help center' },
  ]

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-black">My Account</h1>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map(s => {
              const Icon = s.icon
              return (
                <Link key={s.href} href={s.href} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-black">{s.label}</p>
                      {s.count !== undefined && s.count > 0 && <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">{s.count}</span>}
                    </div>
                    <p className="text-sm text-gray-400">{s.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
            <Link href="/onboarding/vendor" className="flex items-center gap-3 text-sm text-gray-600 hover:text-black">
              <Ticket className="w-5 h-5 text-gray-400" />
              <span>Become a vendor — list your business on Planviry</span>
            </Link>
          </div>
        </div>
      </div>
    </AppLayoutShell>
  )
}
