'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Calendar as CalendarIcon, Users, DollarSign, Loader2, Plus, Minus, Clock } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { SURFACE_DATA } from '@/lib/surface-data'
import { getPrefixIndex, lookupByPrefix } from '@/data/prefix-index'
import { useLocationStore } from '@/lib/store'
import { SEO_SERVICE_PATTERNS } from '@/data/seo-pages'
import { MARKETPLACE_ITEMS } from '@/data/prototype-data'
import type { DateRange } from 'react-day-picker'

// Build What autocomplete index from 562 service patterns + marketplace titles/subcategories
const WHAT_SUGGESTIONS = [
  ...SEO_SERVICE_PATTERNS.map(p => ({ label: p.name, href: `/seo/${p.slug}` })),
  ...MARKETPLACE_ITEMS.map(item => ({ label: item.title, href: `/vendors?what=${encodeURIComponent(item.title)}` })),
  ...Array.from(new Set(MARKETPLACE_ITEMS.map(i => i.subcategory).filter(Boolean))).map(s => ({ label: s!, href: `/vendors?what=${encodeURIComponent(s!)}` })),
]

interface PlanBarProps {
  surface?: string
  initialWhat?: string
  initialWhere?: string
  /** 'hero' = transparent glass pill that sits on a colored gradient.
   *  'sticky' (default) = solid white toolbar that sticks under the header. */
  variant?: 'hero' | 'sticky'
}

export function PlanBar({ surface, initialWhat, initialWhere, variant = 'sticky' }: PlanBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { location: savedLocation, setLocation } = useLocationStore()
  const surfaceData = surface ? SURFACE_DATA[surface] : null

  // ── State ──────────────────────────────────────────────────────────────────
  // "What" is a free-text input — NOT a dropdown. Occasions aren't limited to
  // one surface's short list; the user can type anything ("birthday", "art show",
  // "wedding reception", "NBA game", etc.) and we search the codebase for it.
  const [whatQuery, setWhatQuery] = useState(searchParams.get('what') || initialWhat || '')
  const [showWhatDropdown, setShowWhatDropdown] = useState(false)

  // What autocomplete — from 562 service patterns + marketplace items
  const whatResults = useMemo(() => {
    if (!whatQuery.trim()) return []
    const q = whatQuery.toLowerCase().trim()
    return WHAT_SUGGESTIONS
      .filter(s => s.label.toLowerCase().includes(q))
      .slice(0, 8)
  }, [whatQuery])

  const [whereQuery, setWhereQuery] = useState(searchParams.get('where') || initialWhere || savedLocation || '')
  const [showWhereDropdown, setShowWhereDropdown] = useState(false)
  const [activeWhereIndex, setActiveWhereIndex] = useState(-1)
  const [prefixIndex, setPrefixIndex] = useState<any>(null)
  const [geoLoading, setGeoLoading] = useState(false)

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    searchParams.get('from') && searchParams.get('to')
      ? { from: new Date(searchParams.get('from')!), to: new Date(searchParams.get('to')!) }
      : undefined
  )
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || '')
  const [attendees, setAttendees] = useState(parseInt(searchParams.get('guests') || '0'))
  const [showPriceDropdown, setShowPriceDropdown] = useState(false)

  // Calendar state — tabs, time fields, flexible mode
  const [calendarTab, setCalendarTab] = useState<'dates' | 'flexible'>('dates')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [flexibleDays, setFlexibleDays] = useState<string[]>([])
  const [flexibleMonths, setFlexibleMonths] = useState<string[]>([])

  const toggleFlexibleDay = (day: string) => {
    setFlexibleDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }
  const toggleFlexibleMonth = (month: string) => {
    setFlexibleMonths(prev => prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month])
  }

  const TIME_SLOTS = [
    '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM',
  ]

  // Refs
  const whatRef = useRef<HTMLInputElement>(null)
  const whereRef = useRef<HTMLInputElement>(null)
  const whatContainerRef = useRef<HTMLDivElement>(null)
  const whereContainerRef = useRef<HTMLDivElement>(null)

  // ── Location autocomplete ──────────────────────────────────────────────────
  const whereResults = useMemo(() => {
    if (!whereQuery.trim() || !prefixIndex) return []
    return lookupByPrefix(prefixIndex, whereQuery.toLowerCase().trim()).slice(0, 8)
  }, [whereQuery, prefixIndex])

  useEffect(() => {
    let cancelled = false
    getPrefixIndex().then((idx) => {
      if (!cancelled) setPrefixIndex(idx)
    })
    return () => { cancelled = true }
  }, [])

  // ── Geolocation (manual — user clicks the my_location button) ──────────────
  // Do NOT auto-fill location on mount. The user sets their own location.
  // The previous auto-geolocation locked users to an IP-detected city (e.g.
  // "Milwaukee, WI") without consent.
  const handleGeolocate = useCallback(() => {
    setGeoLoading(true)
    fetch('/api/geolocation')
      .then(r => r.json())
      .then(data => {
        if (data.city) {
          const val = `${data.city}, ${data.region || data.state || ''}`
          setWhereQuery(val)
          setLocation(val)
        }
      })
      .catch(() => {})
      .finally(() => setGeoLoading(false))
  }, [setLocation])

  // ── Outside click (What + Where dropdowns) ────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (whatContainerRef.current && !whatContainerRef.current.contains(e.target as Node)) setShowWhatDropdown(false)
      if (whereContainerRef.current && !whereContainerRef.current.contains(e.target as Node)) setShowWhereDropdown(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Search ─────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const params = new URLSearchParams()
    if (whatQuery.trim()) params.set('what', whatQuery.trim())
    if (whereQuery) {
      params.set('where', whereQuery)
      setLocation(whereQuery)
    }
    if (dateRange?.from) params.set('from', dateRange.from.toISOString().split('T')[0])
    if (dateRange?.to) params.set('to', dateRange.to.toISOString().split('T')[0])
    if (priceRange) params.set('price', priceRange)
    if (attendees > 0) params.set('guests', String(attendees))

    const target = surface ? `/${surface}` : '/vendors'
    router.push(`${target}?${params.toString()}`)
  }

  // ── Keyboard nav — Enter triggers search for both free-text fields ─────────
  const handleWhatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSearch() }
  }

  const handleWhereKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveWhereIndex(p => Math.min(p + 1, whereResults.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveWhereIndex(p => Math.max(p - 1, -1)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeWhereIndex >= 0 && whereResults[activeWhereIndex]) {
        const loc = whereResults[activeWhereIndex]
        const val = `${loc.city}, ${loc.state}`
        setWhereQuery(val); setLocation(val); setShowWhereDropdown(false)
      }
      handleSearch()
    }
    else if (e.key === 'Escape') setShowWhereDropdown(false)
  }

  const priceOptions = [
    { label: 'Any Price', value: '' },
    { label: '$ Budget', value: '1' },
    { label: '$$ Moderate', value: '2' },
    { label: '$$$ Premium', value: '3' },
    { label: '$$$$ Luxury', value: '4' },
  ]

  const dateLabel = dateRange?.from
    ? `${dateRange.from.toLocaleDateString('en', { month: 'short', day: 'numeric' })}${dateRange.to ? ' - ' + dateRange.to.toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''}`
    : 'Add dates'

  const isHero = variant === 'hero'

  // Theme tokens — hero = TRANSPARENT pill (no fill color at all, just a border
  // so the pill shape is defined without imposing any color on the gradient).
  // sticky = solid white toolbar (unchanged, used on surface pages).
  const t = isHero
    ? {
        wrapper: 'relative z-20 w-full max-w-6xl mx-auto',
        innerPad: 'px-2 py-2',
        pill: 'bg-transparent backdrop-blur-sm border border-midnight-slate/25 rounded-full flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-midnight-slate/15',
        label: 'text-midnight-slate/50',
        icon: 'text-midnight-slate/40',
        input: 'w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-midnight-slate placeholder:text-midnight-slate/40 outline-none',
        value: 'text-midnight-slate',
        valueMuted: 'text-midnight-slate/40',
        hover: 'hover:bg-midnight-slate/5',
        geoBtn: 'text-midnight-slate/40 hover:text-midnight-slate',
        counterBtn: 'w-6 h-6 border border-midnight-slate/25 rounded-full flex items-center justify-center hover:bg-midnight-slate/5 active:scale-90 transition-all shrink-0 text-midnight-slate',
        searchBtn: 'bg-midnight-slate text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-champagne-gold hover:text-midnight-slate transition-all duration-300',
      }
    : {
        wrapper: 'sticky top-20 z-30 bg-white border-b border-midnight-slate/5',
        innerPad: 'max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3',
        pill: 'bg-white border border-midnight-slate/10 rounded-full shadow-sm flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-midnight-slate/5',
        label: 'text-midnight-slate/40',
        icon: 'text-midnight-slate/30',
        input: 'w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-midnight-slate placeholder:text-midnight-slate/30 outline-none',
        value: 'text-midnight-slate',
        valueMuted: 'text-midnight-slate/30',
        hover: 'hover:bg-surface-container-low/50',
        geoBtn: 'text-midnight-slate/30 hover:text-midnight-slate',
        counterBtn: 'w-6 h-6 border border-midnight-slate/20 rounded-full flex items-center justify-center hover:bg-surface-container-low active:scale-90 transition-all shrink-0 text-midnight-slate',
        searchBtn: 'bg-midnight-slate text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-champagne-gold transition-all duration-300',
      }

  return (
    <div className={t.wrapper}>
      <div className={t.innerPad}>
        <div className={t.pill}>

          {/* What — free-text input WITH autocomplete from 562 service patterns + marketplace items */}
          <div ref={whatContainerRef} className="flex-1 w-full px-6 py-2 relative">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${t.label}`}>What</p>
            <div className="flex items-center gap-2">
              <Search className={`w-4 h-4 shrink-0 ${t.icon}`} />
              <input
                ref={whatRef}
                type="text"
                placeholder={surfaceData?.whatPlaceholder || 'What are we planning?'}
                value={whatQuery}
                onChange={(e) => { setWhatQuery(e.target.value); setShowWhatDropdown(true) }}
                onFocus={() => setShowWhatDropdown(true)}
                onKeyDown={handleWhatKeyDown}
                className={t.input}
              />
            </div>
            {showWhatDropdown && whatResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-midnight-slate/10 max-h-96 overflow-y-auto z-50">
                {whatResults.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setWhatQuery(s.label); setShowWhatDropdown(false); whereRef.current?.focus() }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors text-midnight-slate"
                  >
                    <Search className="w-3.5 h-3.5 text-midnight-slate/30" />
                    <span className="font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Where */}
          <div ref={whereContainerRef} className="flex-1 w-full px-6 py-2 relative">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${t.label}`}>Location</p>
            <div className="flex items-center gap-2">
              <MapPin className={`w-4 h-4 shrink-0 ${t.icon}`} />
              <input
                ref={whereRef}
                type="text"
                placeholder="Where to?"
                value={whereQuery}
                onChange={(e) => { setWhereQuery(e.target.value); setShowWhereDropdown(true); setActiveWhereIndex(-1) }}
                onFocus={() => setShowWhereDropdown(true)}
                onKeyDown={handleWhereKeyDown}
                className={t.input}
              />
              {geoLoading ? (
                <Loader2 className={`w-4 h-4 animate-spin shrink-0 ${t.icon}`} />
              ) : (
                <button onClick={handleGeolocate} className={`shrink-0 transition-colors ${t.geoBtn}`} title="Use my location">
                  <span className="material-symbols-outlined text-sm">my_location</span>
                </button>
              )}
            </div>
            {showWhereDropdown && whereResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-midnight-slate/10 max-h-72 overflow-y-auto z-50">
                {whereResults.map((loc, i) => (
                  <button
                    key={`${loc.slug}-${i}`}
                    onClick={() => { const val = `${loc.city}, ${loc.state}`; setWhereQuery(val); setLocation(val); setShowWhereDropdown(false) }}
                    onMouseEnter={() => setActiveWhereIndex(i)}
                    className={`w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${activeWhereIndex === i ? 'bg-surface-container-low' : ''}`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-midnight-slate/30" />
                    <span className="font-medium text-midnight-slate">{loc.city}</span>
                    <span className="text-midnight-slate/40 text-xs">{loc.state}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* When — full calendar popover matching reference design:
              - "Date and time" title + purple subtitle
              - Dates / Flexible tabs
              - Dual-month calendar (Dates) OR day-of-week + month buttons (Flexible)
              - Start time / End time dropdowns
              - Clear + Apply buttons (purple Apply) */}
          <Popover>
            <PopoverTrigger asChild>
              <button className={`flex-1 w-full px-6 py-2 text-left transition-colors ${t.hover}`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${t.label}`}>When</p>
                <div className="flex items-center gap-2">
                  <CalendarIcon className={`w-4 h-4 shrink-0 ${t.icon}`} />
                  <span className={`text-sm font-semibold truncate ${dateRange?.from ? t.value : t.valueMuted}`}>{dateLabel}</span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white rounded-2xl shadow-2xl border border-midnight-slate/10 overflow-hidden flex flex-col" align="start" sideOffset={8}>
              {/* Header — title + purple subtitle */}
              <div className="flex items-start justify-between px-5 pt-5 pb-3 shrink-0">
                <div>
                  <h3 className="font-display-lg text-lg text-midnight-slate font-bold">Date and time</h3>
                  <p className="text-xs text-secondary-container mt-0.5">Search for multiple dates at once</p>
                </div>
              </div>

              {/* Tabs — Dates / Flexible */}
              <div className="flex border-b border-midnight-slate/10 shrink-0">
                <button
                  onClick={() => setCalendarTab('dates')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    calendarTab === 'dates'
                      ? 'text-midnight-slate border-b-2 border-midnight-slate bg-white'
                      : 'text-midnight-slate/40 bg-midnight-slate/5 border-b-2 border-transparent hover:text-midnight-slate/60'
                  }`}
                >
                  Dates
                </button>
                <button
                  onClick={() => setCalendarTab('flexible')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    calendarTab === 'flexible'
                      ? 'text-midnight-slate border-b-2 border-midnight-slate bg-white'
                      : 'text-midnight-slate/40 bg-midnight-slate/5 border-b-2 border-transparent hover:text-midnight-slate/60'
                  }`}
                >
                  Flexible
                </button>
              </div>

              {/* Tab content — scrollable */}
              <div className="overflow-y-auto flex-grow p-5">
                {calendarTab === 'dates' ? (
                  /* Dual-month calendar with champagne-gold selection */
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="bg-white"
                    classNames={{
                      day_selected: 'bg-secondary-container text-midnight-slate',
                      day_range_start: 'bg-secondary-container text-midnight-slate rounded-l-full',
                      day_range_end: 'bg-secondary-container text-midnight-slate rounded-r-full',
                      day_range_middle: 'bg-secondary-container/30 text-midnight-slate',
                    }}
                  />
                ) : (
                  /* Flexible mode — days of week + month buttons */
                  <div className="space-y-5 w-[600px] max-w-full">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 mb-2">Days of the week</p>
                      <div className="flex gap-2 flex-wrap">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <button
                            key={day}
                            onClick={() => toggleFlexibleDay(day)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                              flexibleDays.includes(day)
                                ? 'bg-midnight-slate border-midnight-slate text-white'
                                : 'bg-white border-midnight-slate/15 text-midnight-slate hover:border-midnight-slate/40'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 mb-2">Any day in...</p>
                      <div className="flex gap-2 flex-wrap">
                        {['January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026'].map((month) => (
                          <button
                            key={month}
                            onClick={() => toggleFlexibleMonth(month)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                              flexibleMonths.includes(month)
                                ? 'bg-midnight-slate border-midnight-slate text-white'
                                : 'bg-white border-midnight-slate/15 text-midnight-slate hover:border-midnight-slate/40'
                            }`}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Start time / End time — always visible (shrink-0) */}
              <div className="px-5 pb-4 pt-2 grid grid-cols-2 gap-4 shrink-0 border-t border-midnight-slate/10">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 block mb-1.5">Start time</label>
                  <div className="flex items-center gap-2 border border-midnight-slate/15 rounded-lg px-3 py-2.5">
                    <Clock className="w-4 h-4 text-midnight-slate/30 shrink-0" />
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-transparent border-none text-sm text-midnight-slate outline-none cursor-pointer"
                    >
                      <option value="">Start time</option>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 block mb-1.5">End time</label>
                  <div className="flex items-center gap-2 border border-midnight-slate/15 rounded-lg px-3 py-2.5">
                    <Clock className="w-4 h-4 text-midnight-slate/30 shrink-0" />
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-transparent border-none text-sm text-midnight-slate outline-none cursor-pointer"
                    >
                      <option value="">End time</option>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer — Clear + Apply (purple) — always visible */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-midnight-slate/10 bg-midnight-slate/2 shrink-0">
                <button
                  onClick={() => { setDateRange(undefined); setStartTime(''); setEndTime(''); setFlexibleDays([]); setFlexibleMonths([]); }}
                  className="text-xs font-bold uppercase tracking-wider text-midnight-slate hover:text-midnight-slate/60 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => { document.body.click(); }}
                  className="px-6 py-2.5 bg-secondary-container text-midnight-slate rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-secondary-container/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Price — dropdown */}
          <Popover open={showPriceDropdown} onOpenChange={setShowPriceDropdown}>
            <PopoverTrigger asChild>
              <button className={`flex-1 w-full px-6 py-2 text-left transition-colors ${t.hover}`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${t.label}`}>Price</p>
                <div className="flex items-center gap-2">
                  <DollarSign className={`w-4 h-4 shrink-0 ${t.icon}`} />
                  <span className={`text-sm font-semibold truncate ${t.value}`}>
                    {priceRange ? priceOptions.find(p => p.value === priceRange)?.label : 'Any Price'}
                  </span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="start">
              {priceOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setPriceRange(opt.value); setShowPriceDropdown(false) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-surface-container-low transition-colors ${priceRange === opt.value ? 'bg-secondary-container/50 font-semibold' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Guests — +/- counter */}
          <div className="flex-1 w-full px-6 py-2">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${t.label}`}>Guests</p>
            <div className="flex items-center gap-3">
              <Users className={`w-4 h-4 shrink-0 ${t.icon}`} />
              <button
                onClick={() => setAttendees(p => Math.max(0, p - 1))}
                className={t.counterBtn}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className={`text-sm font-semibold min-w-[20px] text-center ${t.value}`}>{attendees}</span>
              <button
                onClick={() => setAttendees(p => p + 1)}
                className={t.counterBtn}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Search button */}
          <div className="p-1 pl-4">
            <button
              onClick={handleSearch}
              className={t.searchBtn}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
