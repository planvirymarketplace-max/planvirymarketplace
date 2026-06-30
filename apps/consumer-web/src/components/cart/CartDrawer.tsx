'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, ShoppingCart, Trash2, Calendar, MapPin, Ticket, Home, Utensils, Compass, ExternalLink } from 'lucide-react'
import { useCart, requiresStripeCharge, type CartItemType } from '@/lib/cart-context'

const TYPE_CONFIG: Record<CartItemType, { label: string; icon: React.ElementType; color: string }> = {
  booking: { label: 'Vendor Booking', icon: Home, color: 'text-teal-600' },
  ticket: { label: 'Ticket', icon: Ticket, color: 'text-coral' },
  lodging: { label: 'Lodging', icon: Home, color: 'text-blue-600' },
  experience: { label: 'Experience', icon: Compass, color: 'text-purple-600' },
  restaurant: { label: 'Reservation', icon: Utensils, color: 'text-orange-600' },
  external_event: { label: 'External Event', icon: ExternalLink, color: 'text-amber-600' },
}

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, clearCart, totalAmount, totalDeposit, itemCount, chargeableItems, nonChargeableItems } = useCart()
  const router = useRouter()
  const [checkingOut, setCheckingOut] = useState(false)

  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_items: items }),
      })
      const data = await response.json()

      if (!response.ok) {
        console.error('Checkout failed:', data.error)
        alert(data.error || 'Checkout failed. Please try again.')
        return
      }

      // If Stripe Checkout URL is returned, redirect to Stripe (movinin pattern)
      if (data.stripe_session_url) {
        clearCart()
        window.location.href = data.stripe_session_url
        return
      }

      // If only non-chargeable items, go to success page
      if (data.non_chargeable_processed) {
        router.push(`/checkout?order=${data.order_id || 'no-charge'}&status=success`)
        onClose()
        return
      }

      // Fallback: go to checkout review page
      if (data.order_id) {
        router.push(`/checkout?order=${data.order_id}`)
      }
    } catch (err) {
      console.error('Checkout failed:', err)
      alert('Checkout failed. Please check your connection and try again.')
    } finally {
      setCheckingOut(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-black text-black tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cart ({itemCount})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-sm text-gray-400">Your cart is empty</p>
              <p className="text-xs text-gray-300 mt-1">Add vendors, tickets, or lodging to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const config = TYPE_CONFIG[item.type]
                const Icon = config.icon
                const chargeable = requiresStripeCharge(item)
                return (
                  <div key={item.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl">
                    <div className={`shrink-0 w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
                        {!chargeable && <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">No Charge</span>}
                      </div>
                      <p className="text-sm font-bold text-black truncate mt-0.5">{item.name}</p>
                      {item.type === 'lodging' ? (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> {item.start_date} to {item.end_date}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> {item.date}
                        </p>
                      )}
                      {item.type === 'restaurant' && item.party_size && (
                        <p className="text-xs text-gray-400">{item.party_size} guests at {item.reservation_time}</p>
                      )}
                      {item.type === 'ticket' && item.quantity && item.quantity > 1 && (
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      )}
                      {chargeable && item.amount > 0 && (
                        <p className="text-xs font-bold text-coral mt-1">
                          ${item.amount.toFixed(2)}
                          {item.deposit_amount ? ` (deposit: $${item.deposit_amount.toFixed(2)})` : ''}
                        </p>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="shrink-0 p-1.5 hover:bg-red-50 rounded-lg transition-colors" aria-label="Remove">
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                )
              })}
              <button onClick={clearCart} className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors py-2">
                Clear all items
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Chargeable items</span>
                <span className="font-bold text-black">{chargeableItems.length}</span>
              </div>
              {nonChargeableItems.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Non-chargeable (reservations)</span>
                  <span className="font-bold text-black">{nonChargeableItems.length}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-black text-black">${totalAmount.toFixed(2)}</span>
              </div>
              {totalDeposit > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deposit due now</span>
                  <span className="font-bold text-coral">${totalDeposit.toFixed(2)}</span>
                </div>
              )}
            </div>
            <button onClick={handleCheckout} disabled={checkingOut} className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-coral transition-colors text-sm uppercase tracking-wider disabled:opacity-50">
              {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            <p className="text-[10px] text-gray-400 text-center">You won't be charged until you confirm on the next page</p>
          </div>
        )}
      </div>
    </div>
  )
}
