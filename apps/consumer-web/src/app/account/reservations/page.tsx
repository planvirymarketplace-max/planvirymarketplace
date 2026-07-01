import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { ReservationsList } from './ReservationsList'

// ─── Types ────────────────────────────────────────────────────────────────
type VendorAccount = { name: string; slug: string }
type InventoryItem = {
  id: string
  title: string
  category: string | null
  slug: string | null
  vendor_accounts: VendorAccount
}
type CheckIn = { id: string; checked_in_at: string | null }
type Reservation = {
  id: string
  status: string
  starts_at: string | null
  ends_at: string | null
  quantity: number
  total_price_cents: number | null
  currency: string | null
  created_at: string | null
  inventory_items: InventoryItem
  check_ins: CheckIn[]
}

export const metadata = {
  title: 'My Reservations — Planviry',
}

export default async function ReservationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?returnTo=/account/reservations')
  }

  const { data, error } = await supabase
    .from('reservations')
    .select(
      `
        id, status, starts_at, ends_at, quantity, total_price_cents, currency, created_at,
        inventory_items!inner(id, title, category, slug, vendor_accounts!inner(name, slug)),
        check_ins(id, checked_in_at)
      `,
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const reservations = (data ?? []) as unknown as Reservation[]

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
            <h1 className="text-2xl font-black text-black">Reservations</h1>
            {reservations.length > 0 && (
              <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                {reservations.length}
              </span>
            )}
          </div>

          {error ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-red-600">
                Could not load reservations. Please try again later.
              </p>
              <p className="text-xs text-gray-400 mt-1">{error.message}</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400">You have no reservations yet.</p>
              <Link
                href="/search"
                className="inline-block mt-4 text-sm font-bold text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white"
              >
                Browse listings
              </Link>
            </div>
          ) : (
            <ReservationsList reservations={reservations} />
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
