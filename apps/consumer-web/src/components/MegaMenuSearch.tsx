'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Search } from 'lucide-react'

interface MegaMenuSearchProps {
  /** What type of content this search applies to */
  dimension: 'service' | 'category' | 'events' | 'activity' | 'role' | 'location' | 'tickets' | 'travel'
  /** Where to navigate on submit */
  searchPath?: string
}

/**
 * MegaMenuSearch — Reusable search bar for ALL mega menus.
 * 
 * Fields: Location, Dates (from/to), This Weekend, Search.
 * Adapts to the mega menu's purpose via the `dimension` prop.
 * 
 * Per user instruction: this search bar goes in EVERY mega menu
 * (By Service, By Category, By Event, By Activity, By Role, Tickets, Travel).
 * The header NavbarSearchBar handles text search — this is for
 * location + date filtering that carries to category pages.
 */
export function MegaMenuSearch({ dimension, searchPath }: MegaMenuSearchProps) {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [thisWeekend, setThisWeekend] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('q', location)
    if (thisWeekend) {
      params.set('weekend', 'true')
    } else {
      if (dateFrom) params.set('from', dateFrom)
      if (dateTo) params.set('to', dateTo)
    }
    params.set('dimension', dimension)
    
    const path = searchPath || `/search?${params.toString()}`
    router.push(path)
  }

  const placeholders: Record<string, string> = {
    service: 'Location (city, state, or zip)',
    category: 'Location (city, state, or zip)',
    events: 'Location (city, state, or zip)',
    activity: 'Location (city, state, or zip)',
    role: 'Location (city, state, or zip)',
    location: 'City, state, or zip',
    tickets: 'Location (city, state, or zip)',
    travel: 'Destination (city, state, or zip)',
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
      {/* Row 1: Location */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={placeholders[dimension] || 'Location'}
          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black transition-colors bg-white"
        />
      </div>

      {/* Row 2: Dates + This Weekend + Search */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
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

        <label className="flex items-center gap-1.5 cursor-pointer px-3 py-2.5 border border-gray-300 rounded-lg hover:border-black transition-colors bg-white whitespace-nowrap">
          <input
            type="checkbox"
            checked={thisWeekend}
            onChange={(e) => setThisWeekend(e.target.checked)}
            className="w-3.5 h-3.5 accent-coral"
          />
          <span className="text-xs font-bold text-black uppercase tracking-wider">This Weekend</span>
        </label>

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
