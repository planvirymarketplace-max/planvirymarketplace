'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  Plus,
  Star,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { PaymentMethod } from './page'

// ─── Brand badge styling ──────────────────────────────────────────────────
const BRAND_STYLES: Record<string, string> = {
  visa: 'bg-blue-50 text-blue-700 border-blue-200',
  mastercard: 'bg-orange-50 text-orange-700 border-orange-200',
  amex: 'bg-green-50 text-green-700 border-green-200',
  americanexpress: 'bg-green-50 text-green-700 border-green-200',
  discover: 'bg-amber-50 text-amber-700 border-amber-200',
  diners: 'bg-purple-50 text-purple-700 border-purple-200',
  jcb: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  unionpay: 'bg-red-50 text-red-700 border-red-200',
}

function brandClass(brand: string | null): string {
  if (!brand) return 'bg-gray-50 text-gray-700 border-gray-200'
  return BRAND_STYLES[brand.toLowerCase()] ?? 'bg-gray-50 text-gray-700 border-gray-200'
}

function brandLabel(brand: string | null): string {
  if (!brand) return 'CARD'
  return brand.toUpperCase()
}

function formatExpiry(month: number | null, year: number | null): string {
  if (!month || !year) return '—'
  const mm = String(month).padStart(2, '0')
  const yy = String(year).slice(-2)
  return `${mm}/${yy}`
}

// ─── Card ──────────────────────────────────────────────────────────────────
function PaymentMethodCard({ method }: { method: PaymentMethod }) {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)
  const [settingDefault, setSettingDefault] = useState(false)

  const handleRemove = async () => {
    if (!confirm('Remove this payment method?')) return
    setRemoving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', method.id)
        .eq('user_id', method.user_id)
      if (error) throw new Error(error.message)
      toast.success('Payment method removed')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to remove card')
    } finally {
      setRemoving(false)
    }
  }

  const handleSetDefault = async () => {
    if (method.is_default) return
    setSettingDefault(true)
    try {
      const supabase = createClient()
      // First unset all other defaults for this user, then set this one.
      const { error: unsetErr } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', method.user_id)
        .neq('id', method.id)
      if (unsetErr) throw new Error(unsetErr.message)
      const { error: setErr } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', method.id)
        .eq('user_id', method.user_id)
      if (setErr) throw new Error(setErr.message)
      toast.success('Default payment method updated')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to set default')
    } finally {
      setSettingDefault(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${brandClass(method.brand)}`}
              >
                {brandLabel(method.brand)}
              </span>
              {method.is_default && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                  <Star className="w-3 h-3 fill-current" /> Default
                </span>
              )}
              {method.nickname && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border bg-gray-50 text-gray-500 border-gray-200">
                  {method.nickname}
                </span>
              )}
            </div>
            <p className="font-bold text-black">
              •••• •••• •••• {method.last4 ?? '••••'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Expires {formatExpiry(method.exp_month, method.exp_year)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!method.is_default && (
          <button
            onClick={handleSetDefault}
            disabled={settingDefault}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-black border border-black px-3 py-1.5 rounded-lg hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {settingDefault ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            {settingDefault ? 'Setting…' : 'Set as default'}
          </button>
        )}
        <button
          onClick={handleRemove}
          disabled={removing}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 border border-red-600 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          {removing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
          {removing ? 'Removing…' : 'Remove'}
        </button>
      </div>
    </div>
  )
}

// ─── List ──────────────────────────────────────────────────────────────────
export function PaymentsList({ methods }: { methods: PaymentMethod[] }) {
  return (
    <div className="space-y-4">
      <button
        onClick={() =>
          toast.info(
            'Adding a payment method requires a Stripe SetupIntent. This will be wired up in a future phase.',
          )
        }
        className="w-full bg-white rounded-xl border border-dashed border-gray-300 p-5 hover:border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:text-black"
      >
        <Plus className="w-4 h-4" /> Add Payment Method
      </button>

      {methods.map((m) => (
        <PaymentMethodCard key={m.id} method={m} />
      ))}
    </div>
  )
}
