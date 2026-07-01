import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { ItinerariesList } from './ItinerariesList'

// ─── Types ────────────────────────────────────────────────────────────────
type InventoryItem = { title: string; category: string | null }
type ItinReservation = {
  id: string
  status: string
  total_price_cents: number | null
  inventory_items: InventoryItem
}
type ItinerarySession = {
  id: string
  title: string
  status: string
  occasion_type: string | null
  created_at: string | null
  reservations: ItinReservation[]
}

export const metadata = {
  title: 'My Itineraries — Planviry',
}

export default async function ItinerariesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?returnTo=/account/itineraries')
  }

  const { data, error } = await supabase
    .from('itinerary_sessions')
    .select(
      `
        id, title, status, occasion_type, created_at,
        reservations(id, status, total_price_cents, inventory_items!inner(title, category))
      `,
    )
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const sessions = (data ?? []) as unknown as ItinerarySession[]

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Link
            href="/account"
            className="text-sm text-gray-400 hover:text-black mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Account
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-black">Itineraries</h1>
              {sessions.length > 0 && (
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                  {sessions.length}
                </span>
              )}
            </div>
            <Link
              href="/planner"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-black border border-black px-3 py-1.5 rounded-lg hover:bg-black hover:text-white"
            >
              <Plus className="w-4 h-4" /> New Itinerary
            </Link>
          </div>

          {error ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-red-600">
                Could not load itineraries. Please try again later.
              </p>
              <p className="text-xs text-gray-400 mt-1">{error.message}</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">You have no itineraries yet.</p>
              <p className="text-sm text-gray-300 mt-1">
                Plan a trip, attach reservations, and share with friends.
              </p>
              <Link
                href="/planner"
                className="inline-block mt-4 text-sm font-bold text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white"
              >
                Create your first itinerary
              </Link>
            </div>
          ) : (
            <ItinerariesList sessions={sessions} />
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
