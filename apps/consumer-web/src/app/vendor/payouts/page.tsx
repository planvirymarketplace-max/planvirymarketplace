'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  AlertTriangle,
} from 'lucide-react'

type VendorAccount = {
  id: string
  name: string
  stripe_connect_account_id: string | null
}

type Payout = {
  id: string
  gross_cents: number | null
  platform_fee_cents: number | null
  payout_cents: number | null
  status: string | null
  currency: string | null
  created_at: string | null
  payments?: {
    amount_cents: number | null
    currency: string | null
    stripe_payment_intent_id: string | null
  } | null
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-green-100 text-green-700',
  IN_TRANSIT: 'bg-cyan-100 text-cyan-700',
  CANCELLED: 'bg-red-100 text-red-700',
  FAILED: 'bg-red-100 text-red-700',
}

function formatPrice(cents: number | null, currency: string | null): string {
  if (cents == null) return '—'
  if (!cents) return 'Free'
  return (cents / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: currency || 'USD',
  })
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function VendorPayoutsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [vendor, setVendor] = useState<VendorAccount | null>(null)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [error, setError] = useState('')
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeError, setStripeError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login?returnTo=/vendor/payouts')
      return
    }
    const { data: staff, error: staffErr } = await supabase
      .from('vendor_staff')
      .select('vendor_id, vendor_accounts!inner(id, name, stripe_connect_account_id)')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .maybeSingle()
    if (staffErr || !staff) {
      router.push('/onboarding/vendor')
      return
    }
    const vendorAccount = staff.vendor_accounts as VendorAccount | null
    setVendor(vendorAccount)

    // Always try to load any vendor_payouts rows for this vendor, regardless
    // of Stripe Connect state. (Rows can exist from webhook writes even if
    // the Connect account id is later removed.)
    const { data: rows, error: rowsErr } = await supabase
      .from('vendor_payouts')
      .select(
        `
        id, gross_cents, platform_fee_cents, payout_cents, status, currency,
        created_at,
        payments:left_payment_id(amount_cents, currency, stripe_payment_intent_id)
      `
      )
      .eq('vendor_id', staff.vendor_id)
      .order('created_at', { ascending: false })

    if (rowsErr) {
      // vendor_payouts may have a different FK column name. Fall back to a
      // plain SELECT without the join so the page still renders.
      const { data: rows2, error: rowsErr2 } = await supabase
        .from('vendor_payouts')
        .select('id, gross_cents, platform_fee_cents, payout_cents, status, currency, created_at')
        .eq('vendor_id', staff.vendor_id)
        .order('created_at', { ascending: false })
      if (rowsErr2) {
        setError(rowsErr2.message)
      }
      setPayouts((rows2 as Payout[] | null) ?? [])
    } else {
      setPayouts((rows as Payout[] | null) ?? [])
    }
    setLoading(false)
  }, [router, supabase])

  useEffect(() => {
    load()
  }, [load])

  // Reflect Stripe Connect onboarding result query params (?onboarding=complete | refresh=true).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('onboarding') === 'complete') {
      setStripeError('')
      // Force a re-load so the freshly-saved stripe_connect_account_id shows up.
      load()
    }
  }, [load])

  const handleStripeConnect = async () => {
    setStripeError('')
    setStripeLoading(true)
    try {
      const res = await fetch('/api/stripe-connect/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) {
        setStripeError(
          data?.error?.message || data?.error || 'Failed to start Stripe onboarding'
        )
        return
      }
      const url = data?.onboarding_url || data?.data?.onboarding_url
      if (url) {
        window.location.href = url
      } else {
        setStripeError('No onboarding URL returned from Stripe')
      }
    } catch (err) {
      setStripeError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setStripeLoading(false)
    }
  }

  // Summary metrics (computed from the loaded payouts).
  const totalGross = payouts.reduce((s, p) => s + (p.gross_cents ?? 0), 0)
  const totalFees = payouts.reduce((s, p) => s + (p.platform_fee_cents ?? 0), 0)
  const totalNet = payouts.reduce((s, p) => s + (p.payout_cents ?? 0), 0)
  const summaryCurrency = payouts[0]?.currency ?? 'USD'

  const hasStripeAccount = !!vendor?.stripe_connect_account_id

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <Link
                href="/vendor/dashboard"
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-2"
              >
                <ArrowLeft className="w-4 h-4" /> Dashboard
              </Link>
              <h1 className="text-2xl font-black text-black">Payouts</h1>
              <p className="text-sm text-gray-500 mt-1">
                Money owed to you from each reservation, less the platform fee.
              </p>
            </div>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Stripe Connect status / onboarding CTA */}
          {vendor && !hasStripeAccount && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-orange-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-orange-900">
                    Set up Stripe Connect to receive payouts
                  </p>
                  <p className="text-xs text-orange-700 mt-1 mb-3">
                    You&apos;ll be redirected to Stripe to verify your identity and
                    link a bank account. Payout rows below will start moving to{' '}
                    <span className="font-mono">PAID</span> once onboarding is
                    complete.
                  </p>
                  {stripeError && (
                    <p className="text-xs text-red-600 mb-2">{stripeError}</p>
                  )}
                  <button
                    onClick={handleStripeConnect}
                    disabled={stripeLoading}
                    className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {stripeLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Connecting…
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" /> Set up Stripe Connect
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {vendor && hasStripeAccount && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-green-900">
                  Stripe Connect active
                </p>
                <p className="text-xs text-green-700 font-mono">
                  {vendor.stripe_connect_account_id}
                </p>
              </div>
              <button
                onClick={handleStripeConnect}
                disabled={stripeLoading}
                className="text-xs font-bold text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 disabled:opacity-50"
              >
                {stripeLoading ? 'Loading…' : 'Re-run onboarding'}
              </button>
            </div>
          )}

          {/* Summary tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <DollarSign className="w-5 h-5 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Gross volume</p>
              <p className="text-2xl font-black text-black">
                {formatPrice(totalGross, summaryCurrency)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Across {payouts.length} {payouts.length === 1 ? 'payout' : 'payouts'}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <Receipt className="w-5 h-5 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Platform fees</p>
              <p className="text-2xl font-black text-black">
                {formatPrice(totalFees, summaryCurrency)}
              </p>
              <p className="text-xs text-gray-400 mt-1">10% per transaction</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <TrendingUp className="w-5 h-5 text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Net payout</p>
              <p className="text-2xl font-black text-black">
                {formatPrice(totalNet, summaryCurrency)}
              </p>
              <p className="text-xs text-gray-400 mt-1">After platform fee</p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : payouts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-2">No payouts yet.</p>
              <p className="text-sm text-gray-400">
                Payout rows are created automatically when a customer&apos;s
                checkout completes. They move from{' '}
                <span className="font-mono">PENDING</span> to{' '}
                <span className="font-mono">PAID</span> once Stripe Connect
                transfers the funds.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <div className="col-span-2">Date</div>
                <div className="col-span-3">Payout amount</div>
                <div className="col-span-3">Platform fee</div>
                <div className="col-span-2">Net payout</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              <ul className="divide-y divide-gray-100">
                {payouts.map((p) => {
                  const currency = p.currency ?? summaryCurrency
                  return (
                    <li
                      key={p.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-gray-50/50"
                    >
                      <div className="md:col-span-2">
                        <span className="text-xs text-gray-600 md:hidden font-bold">
                          Date:{' '}
                        </span>
                        <p className="text-sm text-gray-700">
                          {formatDate(p.created_at)}
                        </p>
                        <p className="text-[10px] font-mono text-gray-400 truncate">
                          {p.id.slice(0, 8)}
                        </p>
                      </div>
                      <div className="md:col-span-3">
                        <span className="text-xs text-gray-600 md:hidden font-bold">
                          Payout amount:{' '}
                        </span>
                        <p className="text-sm font-bold text-gray-900">
                          {formatPrice(p.gross_cents, currency)}
                        </p>
                      </div>
                      <div className="md:col-span-3">
                        <span className="text-xs text-gray-600 md:hidden font-bold">
                          Platform fee:{' '}
                        </span>
                        <p className="text-sm text-red-700">
                          −{formatPrice(p.platform_fee_cents, currency)}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-xs text-gray-600 md:hidden font-bold">
                          Net payout:{' '}
                        </span>
                        <p className="text-sm font-bold text-green-700">
                          {formatPrice(p.payout_cents, currency)}
                        </p>
                      </div>
                      <div className="md:col-span-2 md:text-right">
                        <span
                          className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${STATUS_STYLES[p.status ?? 'PENDING'] ?? 'bg-gray-100 text-gray-700'}`}
                        >
                          {p.status ?? 'PENDING'}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-6 text-center">
            Payout rows come from <span className="font-mono">vendor_payouts</span>{' '}
            (created by the Stripe webhook on{' '}
            <span className="font-mono">checkout.session.completed</span>).
          </p>
        </div>
      </div>
    </AppLayoutShell>
  )
}
