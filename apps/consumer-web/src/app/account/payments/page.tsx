import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { PaymentsList } from './PaymentsList'

// ─── Types ────────────────────────────────────────────────────────────────
export type PaymentMethod = {
  id: string
  user_id: string
  stripe_payment_method_id: string | null
  brand: string | null
  last4: string | null
  exp_month: number | null
  exp_year: number | null
  is_default: boolean | null
  nickname: string | null
  created_at: string | null
}

export const metadata = {
  title: 'Payment Methods — Planviry',
}

export default async function PaymentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?returnTo=/account/payments')
  }

  const { data, error } = await supabase
    .from('payment_methods')
    .select(
      'id, user_id, stripe_payment_method_id, brand, last4, exp_month, exp_year, is_default, nickname, created_at',
    )
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  const methods = (data ?? []) as unknown as PaymentMethod[]

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
              <h1 className="text-2xl font-black text-black">Payment Methods</h1>
              {methods.length > 0 && (
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                  {methods.length}
                </span>
              )}
            </div>
          </div>

          {error ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-red-600">
                Could not load payment methods. Please try again later.
              </p>
              <p className="text-xs text-gray-400 mt-1">{error.message}</p>
            </div>
          ) : methods.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">You have no saved payment methods.</p>
              <p className="text-sm text-gray-300 mt-1">
                Add a card to make checkout faster.
              </p>
            </div>
          ) : (
            <PaymentsList methods={methods} />
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
