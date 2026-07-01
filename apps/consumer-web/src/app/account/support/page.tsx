import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, LifeBuoy } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { SupportList } from './SupportList'

// ─── Types ────────────────────────────────────────────────────────────────
// Schema note (FIX-8 live-DB probe): the `service_tickets` table has columns
//   id, vendor_id, reporter_id, reservation_id, title, description,
//   priority, status, category, assigned_to, due_at, created_at, updated_at
//
// The task spec said to query `user_id = user.id OR requested_by = user.id`,
// but `packages/types/src/domain/service-ticket.ts` lists neither — and the
// live DB has neither. The actual consumer-side FK is `reporter_id` (NOT
// NULL). So this page queries `service_tickets WHERE reporter_id = user.id`.
type VendorAccount = { id: string; name: string; slug: string }
type Reservation = { id: string; inventory_items: { title: string | null } | null }

export type ServiceTicket = {
  id: string
  vendor_id: string
  reporter_id: string
  reservation_id: string | null
  title: string
  description: string | null
  priority: string | null
  status: string
  category: string | null
  assigned_to: string | null
  due_at: string | null
  created_at: string
  updated_at: string | null
}

export const metadata = {
  title: 'Support — Planviry',
}

export default async function SupportPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?returnTo=/account/support')
  }

  let tickets: ServiceTicket[] = []
  let vendors: VendorAccount[] = []
  let reservations: Reservation[] = []
  let loadError: string | null = null

  try {
    // 1. Fetch the user's support tickets (consumer-side: reporter_id).
    const { data: ticketData, error: ticketErr } = await supabase
      .from('service_tickets')
      .select(
        'id, vendor_id, reporter_id, reservation_id, title, description, priority, status, category, assigned_to, due_at, created_at, updated_at',
      )
      .eq('reporter_id', user.id)
      .order('created_at', { ascending: false })

    if (ticketErr) {
      loadError = ticketErr.message
    } else {
      tickets = (ticketData ?? []) as unknown as ServiceTicket[]
    }

    // 2. Fetch ACTIVE vendor_accounts for the new-ticket form dropdown.
    //    (vendor_id is NOT NULL FK → must be a real vendor_id.)
    const { data: vendorData, error: vendorErr } = await supabase
      .from('vendor_accounts')
      .select('id, name, slug')
      .eq('status', 'ACTIVE')
      .order('name', { ascending: true })

    if (!vendorErr && vendorData) {
      vendors = vendorData as unknown as VendorAccount[]
    }

    // 3. Fetch the user's recent reservations (for the optional
    //    "related reservation" dropdown on the new-ticket form).
    const { data: resData, error: resErr } = await supabase
      .from('reservations')
      .select('id, inventory_items(title)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!resErr && resData) {
      reservations = resData as unknown as Reservation[]
    }
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Unknown error'
  }

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

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <h1 className="text-2xl font-black text-black flex items-center gap-2">
              <LifeBuoy className="w-6 h-6 text-gray-500" />
              Support
            </h1>
            {tickets.length > 0 && (
              <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                {tickets.length}
              </span>
            )}
          </div>

          {loadError ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-red-600">
                Could not load your support tickets. Please try again later.
              </p>
              <p className="text-xs text-gray-400 mt-1 font-mono break-all">
                {loadError}
              </p>
            </div>
          ) : (
            <SupportList
              tickets={tickets}
              vendors={vendors}
              reservations={reservations}
            />
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
