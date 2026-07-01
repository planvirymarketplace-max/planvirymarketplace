'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { ItineraryTimeline } from '@/components/itinerary/ItineraryTimeline'
import { extractEventsFromReservations } from '@/lib/itinerary/extractEvents'
import { ArrowLeft, Share2, Calendar } from 'lucide-react'

export default function ItineraryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [itinerary, setItinerary] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?returnTo=/account/itineraries/' + id); return }

      // Load itinerary session
      const { data: itin } = await supabase
        .from('itinerary_sessions')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (!itin) { router.push('/account/itineraries'); return }
      setItinerary(itin)

      // Load reservations for this itinerary
      const { data: res } = await supabase
        .from('reservations')
        .select(`
          id, status, starts_at, ends_at, quantity, total_price_cents,
          inventory_items!inner(id, title, category, vendor_accounts!inner(name))
        `)
        .eq('itinerary_session_id', id)
        .order('starts_at', { ascending: true })

      setReservations(res || [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  const events = extractEventsFromReservations(reservations)
  const totalCost = reservations.reduce((s: number, r: { total_price_cents: number }) => s + (r.total_price_cents || 0), 0)

  const handleShare = async () => {
    try {
      const res = await fetch(`/api/v1/itineraries/${id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'link', permission: 'VIEW' }),
      })
      const data = await res.json()
      if (data.data?.share_url || data.share_url) {
        navigator.clipboard.writeText(data.data?.share_url || data.share_url)
        alert('Share link copied to clipboard!')
      }
    } catch {
      alert('Failed to generate share link')
    }
  }

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link href="/account/itineraries" className="text-sm text-gray-400 hover:text-black mb-4 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> All Itineraries
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-black">{itinerary?.title || 'Untitled Trip'}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <Calendar className="w-3 h-3" />
                {itinerary?.status} · {reservations.length} reservation(s) · ${totalCost / 100}
              </p>
            </div>
            <button onClick={handleShare} className="flex items-center gap-2 text-sm font-bold text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>

          {reservations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">No reservations in this itinerary yet.</p>
              <p className="text-sm text-gray-300 mt-1">Book something to start building your trip!</p>
              <Link href="/search" className="inline-block mt-4 text-sm font-bold text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white">
                Browse listings
              </Link>
            </div>
          ) : (
            <ItineraryTimeline
              events={events}
              itineraryTitle={itinerary?.title}
              totalCostCents={totalCost}
            />
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
