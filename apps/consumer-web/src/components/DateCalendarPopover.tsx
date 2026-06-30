'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'

const TIME_SLOTS = [
  '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM',
]

interface DateCalendarPopoverProps {
  /** The label text shown above the trigger (e.g., "When") */
  label?: string
  /** Whether this is rendered on a dark/hero background (light text) or white (dark text) */
  variant?: 'hero' | 'sticky'
  /** Called when the date range changes */
  onDateChange?: (range: DateRange | undefined) => void
  /** Called when start/end times change */
  onTimeChange?: (start: string, end: string) => void
}

/**
 * DateCalendarPopover — the universal calendar component used across the platform.
 *
 * Features:
 * - "Date and time" title + champagne-gold subtitle
 * - Dates / Flexible tabs
 * - Dual-month calendar (Dates) with champagne-gold selection
 * - Day-of-week + month buttons (Flexible)
 * - Start time / End time dropdowns
 * - Clear + Apply buttons (champagne-gold Apply)
 *
 * Used by: PlanBar (homepage hero), MarketplaceFeed (surface pages).
 */
export function DateCalendarPopover({
  label = 'When',
  variant = 'sticky',
  onDateChange,
  onTimeChange,
}: DateCalendarPopoverProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
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

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    onDateChange?.(range)
  }

  const handleTimeChange = (start: string, end: string) => {
    setStartTime(start)
    setEndTime(end)
    onTimeChange?.(start, end)
  }

  const dateLabel = dateRange?.from
    ? `${dateRange.from.toLocaleDateString('en', { month: 'short', day: 'numeric' })}${dateRange.to ? ' - ' + dateRange.to.toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''}`
    : 'Add dates'

  const isHero = variant === 'hero'
  const labelCls = isHero ? 'text-white/60' : 'text-midnight-slate/40'
  const iconCls = isHero ? 'text-white/50' : 'text-midnight-slate/30'
  const valueCls = isHero ? 'text-white' : 'text-midnight-slate'
  const valueMuted = isHero ? 'text-white/50' : 'text-midnight-slate/30'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex-1 w-full px-6 py-2 text-left hover:bg-surface-container-low/50 transition-colors">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${labelCls}`}>{label} ▼</p>
          <div className="flex items-center gap-2">
            <CalendarIcon className={`w-4 h-4 shrink-0 ${iconCls}`} />
            <span className={`text-sm font-semibold truncate ${dateRange?.from ? valueCls : valueMuted}`}>{dateLabel}</span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white rounded-2xl shadow-2xl border border-midnight-slate/10 overflow-hidden flex flex-col" align="start" sideOffset={8}>
        {/* Header — title + champagne-gold subtitle */}
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
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateSelect}
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

        {/* Start time / End time — always visible */}
        <div className="px-5 pb-4 pt-2 grid grid-cols-2 gap-4 shrink-0 border-t border-midnight-slate/10">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 block mb-1.5">Start time</label>
            <div className="flex items-center gap-2 border border-midnight-slate/15 rounded-lg px-3 py-2.5">
              <Clock className="w-4 h-4 text-midnight-slate/30 shrink-0" />
              <select
                value={startTime}
                onChange={(e) => handleTimeChange(e.target.value, endTime)}
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
                onChange={(e) => handleTimeChange(startTime, e.target.value)}
                className="w-full bg-transparent border-none text-sm text-midnight-slate outline-none cursor-pointer"
              >
                <option value="">End time</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Footer — Clear + Apply (champagne-gold) */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-midnight-slate/10 bg-midnight-slate/2 shrink-0">
          <button
            onClick={() => { handleDateSelect(undefined); handleTimeChange('', ''); setFlexibleDays([]); setFlexibleMonths([]); }}
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
  )
}
