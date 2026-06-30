'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bed,
  Plane,
  Car,
  Package,
  Compass,
  Ship,
  MapPin,
  Calendar,
  Users,
  Search,
  type LucideIcon,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { TRAVEL_CATEGORIES } from '@/data/travel-taxonomy'

const ICON_MAP: Record<string, LucideIcon> = {
  Bed,
  Plane,
  Car,
  Package,
  Compass,
  Ship,
}

interface TravelSearchBarProps {
  /** Initial category slug (defaults to 'stays') */
  defaultCategory?: string
  /** Initial destination (e.g. from URL) */
  defaultDestination?: string
  defaultCheckIn?: string
  defaultCheckOut?: string
  defaultTravelers?: string
  /** Compact variant - removes the "add flight / add car" checkboxes */
  compact?: boolean
  /** Render style: 'boxed' (white card on dark hero) | 'plain' (no wrapper) */
  variant?: 'boxed' | 'plain'
}

export function TravelSearchBar({
  defaultCategory = 'stays',
  defaultDestination = '',
  defaultCheckIn = '',
  defaultCheckOut = '',
  defaultTravelers = '2 travelers, 1 room',
  compact = false,
  variant = 'boxed',
}: TravelSearchBarProps) {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState(defaultCategory)
  const [destination, setDestination] = useState(defaultDestination)
  const [checkIn, setCheckIn] = useState(defaultCheckIn)
  const [checkOut, setCheckOut] = useState(defaultCheckOut)
  const [travelers, setTravelers] = useState(defaultTravelers)
  const [addFlight, setAddFlight] = useState(false)
  const [addCar, setAddCar] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (destination) params.set('destination', destination)
    if (checkIn) params.set('from', checkIn)
    if (checkOut) params.set('to', checkOut)
    if (travelers) params.set('travelers', travelers)
    if (activeCategory) params.set('category', activeCategory)
    if (addFlight) params.set('addFlight', 'true')
    if (addCar) params.set('addCar', 'true')
    router.push(`/travel/search?${params.toString()}`)
  }

  const wrapperClasses =
    variant === 'boxed'
      ? 'bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-200 p-4 sm:p-5'
      : 'bg-white rounded-2xl border border-gray-200 p-4 sm:p-5'

  return (
    <div className={wrapperClasses}>
      {/* Category icon nav */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-3 mb-3 border-b border-gray-200 -mx-1 px-1">
        {TRAVEL_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] ?? Bed
          const isActive = activeCategory === cat.slug
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'text-black border-b-2 border-black -mb-[2px]'
                  : 'text-gray-500 hover:text-black border-b-2 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-400'}`} />
              <span>{cat.name}</span>
            </button>
          )
        })}
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {/* Where to? */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <label htmlFor="travel-destination" className="sr-only">
              Where to?
            </label>
            <input
              id="travel-destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to?"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-black placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Dates - check in */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <label htmlFor="travel-check-in" className="sr-only">
              Check-in date
            </label>
            <input
              id="travel-check-in"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-black focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Dates - check out */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <label htmlFor="travel-check-out" className="sr-only">
              Check-out date
            </label>
            <input
              id="travel-check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-black focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Travelers */}
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <label htmlFor="travel-travelers" className="sr-only">
              Travelers
            </label>
            <input
              id="travel-travelers"
              type="text"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              placeholder="2 travelers, 1 room"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-black placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {/* Optional add-ons + search button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {!compact ? (
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={addFlight}
                  onCheckedChange={(v) => setAddFlight(v === true)}
                  className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <span className="text-xs font-semibold text-gray-700 group-hover:text-black">
                  Add a flight
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={addCar}
                  onCheckedChange={(v) => setAddCar(v === true)}
                  className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <span className="text-xs font-semibold text-gray-700 group-hover:text-black">
                  Add a car
                </span>
              </label>
            </div>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-[#e87461] hover:bg-[#d9634e] text-white font-black px-8 py-3 rounded-xl transition-colors text-sm tracking-wider uppercase shadow-sm"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </form>
    </div>
  )
}
