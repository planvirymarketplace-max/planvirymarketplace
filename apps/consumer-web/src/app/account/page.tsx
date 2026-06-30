'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Ticket, CreditCard, MapPin, Package, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

export default function AccountPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])
  const [itineraries, setItineraries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?next=/account'); return }
      setUser(user)

      // Fetch reservations via our API
      try {
        const resRes = await fetch('/api/v1/reservations', { headers: { Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` } })
        if (resRes.ok) {
          const data = await resRes.json()
          setReservations(data.data?.reservations ?? [])
        }
      } catch {}

      // Fetch itineraries via our API
      try {
        const itinRes = await fetch('/api/v1/itineraries', { headers: { Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` } })
        if (itinRes.ok) {
          const data = await itinRes.json()
          setItineraries(data.data?.itineraries ?? [])
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
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-black text-black mb-6">My Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/account/reservations" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <Calendar className="w-6 h-6 text-gray-400 mb-2" />
              <p className="font-bold text-black">Reservations</p>
              <p className="text-2xl font-black text-black">{reservations.length}</p>
            </Link>
            <Link href="/account/itineraries" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <MapPin className="w-6 h-6 text-gray-400 mb-2" />
              <p className="font-bold text-black">Itineraries</p>
              <p className="text-2xl font-black text-black">{itineraries.length}</p>
            </Link>
            <Link href="/account/payments" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <CreditCard className="w-6 h-6 text-gray-400 mb-2" />
              <p className="font-bold text-black">Payment Methods</p>
              <p className="text-sm text-gray-400">Manage cards</p>
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-black mb-4">Recent Reservations</h2>
            {reservations.length === 0 ? (
              <p className="text-sm text-gray-400">No reservations yet.</p>
            ) : (
              <div className="space-y-3">
                {reservations.slice(0, 5).map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div>
                      <p className="font-medium text-black text-sm">{r.inventory_item?.title || 'Reservation'}</p>
                      <p className="text-xs text-gray-400">{r.status} · {r.quantity} item(s)</p>
                    </div>
                    <p className="font-bold text-black text-sm">${((r.total_price_cents || 0) / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-bold text-black mb-4">Recent Itineraries</h2>
            {itineraries.length === 0 ? (
              <p className="text-sm text-gray-400">No itineraries yet.</p>
            ) : (
              <div className="space-y-3">
                {itineraries.slice(0, 5).map((i: any) => (
                  <Link key={i.id} href={`/itinerary/${i.id}`} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-black text-sm">{i.title || 'Untitled Trip'}</p>
                      <p className="text-xs text-gray-400">{i.status}</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(i.created_at).toLocaleDateString()}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
            className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-black"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </AppLayoutShell>
  )
}
