'use client'

import React from 'react'
import { ShoppingCart, Trash2, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react'
import type { CartItem, Booking } from '@/lib/marketplace-types'

interface CartViewProps {
  cart: CartItem[]
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onConfirmCheckout: (bookings: Omit<Booking, 'id' | 'createdAt'>[]) => void
  onBackToExplore: () => void
}

export function CartView({ cart, onRemoveItem, onClearCart, onConfirmCheckout, onBackToExplore }: CartViewProps) {
  const totalDeposits = cart.reduce((sum, item) => sum + item.depositAmount, 0)
  const totalValue = cart.reduce((sum, item) => sum + item.priceSnapshot, 0)

  const handleCheckout = () => {
    const bookings: Omit<Booking, 'id' | 'createdAt'>[] = cart.map(item => ({
      vendorId: item.vendorId,
      vendorName: item.vendorName,
      packageId: item.packageId,
      packageName: item.packageName,
      eventDate: item.eventDate,
      priceSnapshot: item.priceSnapshot,
      depositAmount: item.depositAmount,
      status: 'pending' as const,
      clientName: 'Demo Client',
      clientEmail: 'demo@planviry.com',
    }))
    onConfirmCheckout(bookings)
    onClearCart()
  }

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF9F6] py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-12">
            <ShoppingCart size={48} className="mx-auto text-stone-300 mb-6" />
            <h2 className="text-2xl font-[var(--font-display)] font-semibold text-stone-900 mb-2">Your event cart is empty</h2>
            <p className="text-sm text-stone-500 font-light mb-6">Start adding vendors to build your perfect Milwaukee event.</p>
            <button onClick={onBackToExplore} className="inline-flex items-center space-x-2 rounded-xl bg-stone-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-stone-800 shadow-md transition">
              <ArrowLeft size={14} /><span>Back to Directory</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FAF9F6] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-[var(--font-display)] font-semibold text-stone-900 tracking-tight">Unified Event Cart</h2>
          <p className="text-xs text-stone-500 font-light mt-1">{cart.length} vendor{cart.length !== 1 ? 's' : ''} selected • Single deposit checkout</p>
        </div>

        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-stone-900 truncate">{item.vendorName}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{item.packageName} • {item.eventDate}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-mono font-bold text-stone-800 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">${item.priceSnapshot}</span>
                  <span className="text-[10px] font-mono text-stone-400">{item.depositPercent}% deposit = ${item.depositAmount}</span>
                </div>
              </div>
              <button onClick={() => onRemoveItem(item.id)} className="shrink-0 text-stone-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-3xl border border-stone-200 shadow-sm p-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-stone-500 font-light">Total Value</span><span className="font-semibold text-stone-900">${totalValue.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-stone-500 font-light">Total Deposit Due</span><span className="font-bold text-stone-900 text-lg">${totalDeposits.toLocaleString()}</span></div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={handleCheckout} className="flex-1 rounded-2xl bg-stone-900 text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-stone-800 shadow-md transition flex items-center justify-center space-x-2">
              <CheckCircle size={14} /><span>Confirm Unified Checkout</span>
            </button>
            <button onClick={onClearCart} className="rounded-2xl border border-stone-200 px-4 py-3.5 text-xs font-bold text-stone-500 hover:bg-stone-50 transition">Clear</button>
          </div>
          <p className="text-[10px] text-stone-400 text-center mt-3 font-mono">Escrow-backed disbursement • Secure ACH processing</p>
        </div>
      </div>
    </div>
  )
}
