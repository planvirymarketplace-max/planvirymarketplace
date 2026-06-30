'use client'
import { use } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

export default function ItineraryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [reservation, setItinerary] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('itinerary_sessions')
        .select('*, reservations!inner(title, category, vendor_accounts!inner(name))')
        .eq('id', id)
        .maybeSingle()
      setItinerary(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Link href="/account/itinerary_sessions" className="text-sm text-gray-400 hover:text-black mb-4 inline-block">← Itinerarys</Link>
          {reservation ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h1 className="text-xl font-black text-black mb-2">{itin.reservations?.title}</h1>
              <p className="text-sm text-gray-500 mb-4">Status: <span className="font-bold">{itin.status}</span></p>
              <div className="space-y-2 text-sm">
                <p>Vendor: {itin.reservations?.vendor_accounts?.name}</p>
                <p>Quantity: {itin.quantity}</p>
                <p>Total: \${((itin.total_price_cents ?? 0) / 100).toFixed(2)}</p>
                {itin.starts_at && <p>Start: {new Date(itin.starts_at).toLocaleString()}</p>}
                {itin.ends_at && <p>End: {new Date(itin.ends_at).toLocaleString()}</p>}
              </div>
              <div className="mt-6 flex gap-3">
                <a href={`/api/orders/${id}/invoice`} className="text-sm font-bold text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white">Download Invoice</a>
                {itin.status === 'CONFIRMED' && (
                  <button onClick={async () => { await fetch(`/api/orders/${id}/cancel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: 'Cancelled by user' }) }); router.reload() }} className="text-sm font-bold text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white">Cancel</button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Itinerary not found.</p>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
