'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Search } from 'lucide-react'
import { EVENT_TYPE_FILTERS } from '@/data/tickets-taxonomy'

/**
 * TicketHeroSearch
 *
 * The search bar shown in the hero of every ticket landing page.
 * Fields: Location, Dates (from/to), Event Type, This Weekend, Search.
 *
 * On submit, navigates to /tickets/search with query params.
 */
export function TicketHeroSearch({
  defaultEventType = 'all',
  defaultCity,
  compact = false,
}: {
  defaultEventType?: string
  defaultCity?: string
  compact?: boolean
}) {
  const router = useRouter()
  const [location, setLocation] = useState(defaultCity || '')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [eventType, setEventType] = useState(defaultEventType)
  const [thisWeekend, setThisWeekend] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('q', location)
    if (eventType && eventType !== 'all') params.set('type', eventType)
    if (thisWeekend) {
      params.set('weekend', 'true')
    } else {
      if (dateFrom) params.set('from', dateFrom)
      if (dateTo) params.set('to', dateTo)
    }
    router.push(`/tickets/search?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl p-3 space-y-2.5"
    >
      {/* Row 1: Location + Event Type */}
      <div className={`grid gap-2 ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (city, state, or zip)"
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black transition-colors bg-white text-black placeholder:text-gray-400"
          />
        </div>

        {/* Event Type */}
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black transition-colors bg-white text-black"
        >
          {EVENT_TYPE_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Row 2: Dates + This Weekend + Search */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
        {/* Date from */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            disabled={thisWeekend}
            className="w-full pl-10 pr-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black transition-colors bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Date from"
          />
        </div>

        {/* Date to */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            disabled={thisWeekend}
            className="w-full pl-10 pr-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black transition-colors bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Date to"
          />
        </div>

        {/* This Weekend toggle */}
        <label className="flex items-center gap-1.5 cursor-pointer px-3 py-2.5 border border-gray-300 rounded-lg hover:border-black transition-colors bg-white whitespace-nowrap">
          <input
            type="checkbox"
            checked={thisWeekend}
            onChange={(e) => setThisWeekend(e.target.checked)}
            className="w-3.5 h-3.5 accent-coral"
          />
          <span className="text-xs font-bold text-black uppercase tracking-wider">
            This Weekend
          </span>
        </label>

        {/* Search button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 bg-black text-white font-bold px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  )
}
