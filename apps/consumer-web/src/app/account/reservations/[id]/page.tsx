'use client'
import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

export default function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [reservation, setReservation] = useState<any>(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('reservations')
        .select('*, inventory_items!inner(title, category, vendor_accounts!inner(name))')
        .eq('id', id)
        .maybeSingle()
      setReservation(data)
      setLoading(false)
    }
    load()
  }, [id])

  // Cancel the reservation via POST /api/orders/[id]/cancel.
  // Contract (apps/consumer-web/src/app/api/orders/[id]/cancel/route.ts):
  //   method: POST, body: { reason?: string } (defaults to 'Cancelled by user'),
  //   Content-Type: application/json.
  //   200 → { reservation_id, status: 'CANCELLED', reason }
  //   4xx → { error: string }
  async function handleCancel() {
    if (cancelling) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/orders/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelled by user' }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Cancel failed (${res.status})`)
      }
      toast.success('Reservation cancelled.')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel reservation. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Link href="/account/reservations" className="text-sm text-gray-400 hover:text-black mb-4 inline-block">← Reservations</Link>
          {reservation ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h1 className="text-xl font-black text-black mb-2">{reservation.inventory_items?.title}</h1>
              <p className="text-sm text-gray-500 mb-4">Status: <span className="font-bold">{reservation.status}</span></p>
              <div className="space-y-2 text-sm">
                <p>Vendor: {reservation.inventory_items?.vendor_accounts?.name}</p>
                <p>Quantity: {reservation.quantity}</p>
                <p>Total: ${((reservation.total_price_cents ?? 0) / 100).toFixed(2)}</p>
                {reservation.starts_at && <p>Start: {new Date(reservation.starts_at).toLocaleString()}</p>}
                {reservation.ends_at && <p>End: {new Date(reservation.ends_at).toLocaleString()}</p>}
              </div>
              <div className="mt-6 flex gap-3">
                <a href={`/api/orders/${id}/invoice`} className="text-sm font-bold text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white">Download Invoice</a>
                {reservation.status === 'CONFIRMED' && (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="inline-flex items-center gap-2 text-sm font-bold text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {cancelling && (
                      <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    )}
                    {cancelling ? 'Cancelling…' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Reservation not found.</p>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
