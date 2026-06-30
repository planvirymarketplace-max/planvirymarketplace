'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ArrowLeft, Shield, Clock } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { items, chargeableItems, nonChargeableItems, totalAmount, totalDeposit, clearCart } = useCart()
  const orderId = searchParams.get('order')
  const sessionId = searchParams.get('session_id')
  const successParam = searchParams.get('status')
  const [status, setStatus] = useState<'review' | 'processing' | 'success' | 'failed'>('review')
  const [reservationIds, setReservationIds] = useState<string[]>([])

  // If returning from Stripe Checkout (session_id in URL), verify payment status
  useEffect(() => {
    if (sessionId) {
      setStatus('processing')
      // Poll the backend to verify the Stripe webhook confirmed the reservations
      // The webhook calls rpc_confirm_reservation on checkout.session.completed
      const verifyInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`)
          if (res.ok) {
            const data = await res.json()
            if (data.status === 'CONFIRMED') {
              setStatus('success')
              setReservationIds(data.reservation_ids || [])
              clearCart()
              clearInterval(verifyInterval)
            } else if (data.status === 'FAILED') {
              setStatus('failed')
              clearInterval(verifyInterval)
            }
          }
        } catch (err) {
          console.error('Verification poll failed:', err)
        }
      }, 3000) // poll every 3s

      // Timeout after 60s
      setTimeout(() => clearInterval(verifyInterval), 60000)
      return () => clearInterval(verifyInterval)
    }

    // If returning with status=success (non-chargeable items only)
    if (successParam === 'success') {
      setStatus('success')
      clearCart()
    }
  }, [sessionId, successParam, clearCart])

  // Trigger checkout — calls /api/checkout which creates PENDING reservations
  // and returns a Stripe Checkout URL
  const handleConfirm = async () => {
    setStatus('processing')
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_items: items }),
      })
      const data = await response.json()

      if (!response.ok) {
        console.error('Checkout failed:', data.error)
        setStatus('failed')
        return
      }

      // Redirect to Stripe Checkout (movinin pattern)
      if (data.stripe_session_url) {
        clearCart()
        window.location.href = data.stripe_session_url
        return
      }

      // Non-chargeable only — success
      if (data.non_chargeable_processed) {
        setStatus('success')
        clearCart()
      }
    } catch (err) {
      console.error('Checkout failed:', err)
      setStatus('failed')
    }
  }

  if (status === 'failed') {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-3xl">✕</span>
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight font-display">Payment Failed</h1>
          <p className="mt-3 text-sm text-gray-500">Your payment could not be processed. No charges were made.</p>
          <div className="mt-8 space-y-3">
            <button onClick={() => setStatus('review')} className="block w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-coral transition-colors text-sm uppercase tracking-wider">Try Again</button>
            <Link href="/cart" className="block w-full border border-black text-black font-bold py-3.5 rounded-xl hover:bg-black hover:text-white transition-colors text-sm uppercase tracking-wider">Back to Cart</Link>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-black tracking-tight font-display">Reservations Confirmed!</h1>
          <p className="mt-3 text-sm text-gray-500">Your payment was processed and your reservations are confirmed. You will receive a confirmation email shortly.</p>
          {orderId && <p className="mt-2 text-xs text-gray-400">Order ID: {orderId}</p>}
          {reservationIds.length > 0 && (
            <p className="mt-1 text-xs text-gray-400">Reservations: {reservationIds.length} item(s)</p>
          )}
          <div className="mt-8 space-y-3">
            <Link href="/portal" className="block w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-coral transition-colors text-sm uppercase tracking-wider">Go to Dashboard</Link>
            <Link href="/" className="block w-full border border-black text-black font-bold py-3.5 rounded-xl hover:bg-black hover:text-white transition-colors text-sm uppercase tracking-wider">Continue Browsing</Link>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'processing') {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-coral rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-black text-black tracking-tight font-display">Processing Payment...</h1>
          <p className="mt-3 text-sm text-gray-500">Please do not close this window.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <h1 className="text-3xl font-black text-black tracking-tight font-display mb-2">Checkout</h1>
        <p className="text-sm text-gray-500 mb-8">Review your order and confirm to proceed with payment.</p>

        <div className="space-y-4 mb-8">
          {chargeableItems.length > 0 && (
            <div>
              <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-3">Chargeable Items ({chargeableItems.length})</h2>
              <div className="space-y-2">
                {chargeableItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-black">{item.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{item.type.replace('_', ' ')}</p>
                    </div>
                    <p className="text-sm font-bold text-black">${item.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {nonChargeableItems.length > 0 && (
            <div>
              <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-3">Reservations (No Charge) ({nonChargeableItems.length})</h2>
              <div className="space-y-2">
                {nonChargeableItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-black">{item.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{item.type.replace('_', ' ')}</p>
                    </div>
                    <p className="text-xs text-gray-400">Confirmed</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold text-black">${totalAmount.toFixed(2)}</span>
            </div>
            {totalDeposit > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Deposit due now</span>
                <span className="font-bold text-coral">${totalDeposit.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Remaining balance</span>
              <span className="font-bold text-black">${(totalAmount - totalDeposit).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-black text-black">Total</span>
                <span className="font-black text-black">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-8 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Secure Payment</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Instant Confirmation</span>
        </div>

        <button onClick={handleConfirm} className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-coral transition-colors text-base uppercase tracking-wider">
          {totalDeposit > 0 ? `Pay Deposit $${totalDeposit.toFixed(2)}` : `Pay $${totalAmount.toFixed(2)}`}
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-3">By clicking confirm, you agree to Planviry's Terms of Service and Cancellation Policy. Stripe payment processing will be enabled in Phase 6.</p>
      </div>
    </div>
  )
}
