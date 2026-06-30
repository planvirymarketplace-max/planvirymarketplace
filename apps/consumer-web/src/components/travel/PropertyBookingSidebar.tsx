'use client'

import { useState, useMemo } from 'react'
import { Calendar, Users, Shield, Star, Info } from 'lucide-react'
import type { TravelProperty } from '@/data/travel-taxonomy'

interface PropertyBookingSidebarProps {
  property: TravelProperty
}

export function PropertyBookingSidebar({ property }: PropertyBookingSidebarProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [travelers, setTravelers] = useState('2 travelers, 1 room')

  // Determine nights from dates (default 3 nights if not selected)
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 3
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 1
  }, [checkIn, checkOut])

  const cleaningFee = useMemo(() => {
    const fees: Record<string, number> = {
      hotel: 0,
      resort: 35,
      'vacation-home': 75,
      villa: 90,
      cabin: 50,
      cottage: 45,
      apartment: 40,
      'bed-and-breakfast': 0,
    }
    return fees[property.typeSlug] ?? 50
  }, [property.typeSlug])

  const serviceFee = 18
  const taxes = Math.round(property.price_per_night * nights * 0.12)
  const subtotal = property.price_per_night * nights
  const total = subtotal + cleaningFee + serviceFee + taxes

  return (
    <div className="border border-gray-200 rounded-2xl bg-white p-5 shadow-sm">
      {/* Price header */}
      <div className="flex items-baseline justify-between gap-2 mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-black">${property.price_per_night}</span>
          <span className="text-xs text-gray-500">/ night</span>
        </div>
        {property.original_price_per_night && (
          <span className="text-xs text-gray-400 line-through">
            ${property.original_price_per_night}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4 text-xs text-gray-600">
        <Star className="w-3.5 h-3.5 fill-[#e87461] text-[#e87461]" />
        <span className="font-black text-gray-900">{property.rating.toFixed(1)}</span>
        <span className="text-gray-400">|</span>
        <span>{property.review_count.toLocaleString()} reviews</span>
      </div>

      {/* Date selection */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="relative">
          <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <label htmlFor="sidebar-checkin" className="block text-[9px] font-black text-gray-500 uppercase tracking-widest pl-8 pt-1.5">
            Check-in
          </label>
          <input
            id="sidebar-checkin"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full pl-8 pr-2 pb-1.5 border-0 text-xs font-bold text-gray-900 focus:outline-none"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <label htmlFor="sidebar-checkout" className="block text-[9px] font-black text-gray-500 uppercase tracking-widest pl-8 pt-1.5">
            Check-out
          </label>
          <input
            id="sidebar-checkout"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full pl-8 pr-2 pb-1.5 border-0 text-xs font-bold text-gray-900 focus:outline-none"
          />
        </div>
      </div>
      <div className="border border-gray-300 rounded-lg mb-4 flex items-center">
        <Users className="w-3.5 h-3.5 text-gray-400 ml-3" />
        <input
          type="text"
          value={travelers}
          onChange={(e) => setTravelers(e.target.value)}
          className="w-full px-2 py-2 text-xs font-bold text-gray-900 focus:outline-none"
          aria-label="Travelers"
        />
      </div>

      {/* Book button */}
      <button
        type="button"
        className="w-full bg-[#e87461] hover:bg-[#d9634e] text-white font-black py-3 rounded-xl transition-colors text-sm uppercase tracking-widest"
      >
        Book now
      </button>
      <p className="mt-2 text-center text-xs text-gray-500">
        You will not be charged yet
      </p>

      {/* Price breakdown */}
      <div className="mt-5 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 underline decoration-gray-300">
            ${property.price_per_night} x {nights} night{nights !== 1 ? 's' : ''}
          </span>
          <span className="font-bold text-gray-900">${subtotal}</span>
        </div>
        {cleaningFee > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 underline decoration-gray-300">Cleaning fee</span>
            <span className="font-bold text-gray-900">${cleaningFee}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 underline decoration-gray-300">Service fee</span>
          <span className="font-bold text-gray-900">${serviceFee}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 underline decoration-gray-300">Taxes & fees</span>
          <span className="font-bold text-gray-900">${taxes}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm font-black text-black">Total</span>
        <span className="text-lg font-black text-black">${total}</span>
      </div>

      {/* Trust signals */}
      <div className="mt-5 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <Shield className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
          <span>
            <span className="font-black text-gray-900">Free cancellation</span> up to 48 hours
            before check-in.
          </span>
        </div>
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
          <span>
            <span className="font-black text-gray-900">No prepayment</span> - pay at the property
            or online after booking confirmation.
          </span>
        </div>
      </div>
    </div>
  )
}
