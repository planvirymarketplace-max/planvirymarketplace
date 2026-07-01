'use client'

import { useState, useMemo, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { AlertTriangle, Calendar, MapPin, DollarSign, Users, Filter } from 'lucide-react'
import type { ItineraryEvent } from '@/lib/itinerary/extractEvents'
import { detectConflicts, type ItineraryConflict } from '@/lib/itinerary/detectConflicts'
import { filterEvents, groupByDay, type ItineraryFilter } from '@/lib/itinerary/filters'

interface ItineraryTimelineProps {
  events: ItineraryEvent[]
  itineraryTitle?: string
  totalCostCents?: number
}

const CATEGORY_LABELS: Record<string, string> = {
  LODGING: 'Lodging',
  VACATION_RENTAL: 'Vacation Rental',
  EVENT_TICKET: 'Event Ticket',
  DINING: 'Dining',
  VENUE_RENTAL: 'Venue',
  VENDOR_SERVICE: 'Service',
  EXPERIENCE: 'Experience',
  TRANSPORT: 'Transport',
  CAR_RENTAL: 'Car Rental',
  CRUISE_CABIN: 'Cruise',
}

export function ItineraryTimeline({ events, itineraryTitle, totalCostCents }: ItineraryTimelineProps) {
  const [filter, setFilter] = useState<ItineraryFilter>({})
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ItineraryEvent | null>(null)
  const calendarRef = useRef<FullCalendar>(null)

  const filteredEvents = useMemo(() => filterEvents(events, filter), [events, filter])
  const conflicts = useMemo(() => detectConflicts(filteredEvents), [filteredEvents])
  const conflictEventIds = useMemo(() => new Set(conflicts.flatMap(c => c.event_ids)), [conflicts])
  const groupedByDay = useMemo(() => groupByDay(filteredEvents), [filteredEvents])

  const calendarEvents = filteredEvents.map(e => ({
    ...e,
    borderColor: conflictEventIds.has(e.id) ? '#dc2626' : e.borderColor,
  }))

  const allCategories = [...new Set(events.map(e => e.extendedProps.category))]

  const handleEventClick = (info: { event: { extendedProps: ItineraryEvent['extendedProps']; id: string; title: string; start: string; end: string; backgroundColor: string } }) => {
    const e = events.find(ev => ev.id === info.event.id)
    if (e) setSelectedEvent(e)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-black flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {itineraryTitle || 'Itinerary Timeline'}
          </h2>
          {totalCostCents !== undefined && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <DollarSign className="w-3 h-3" />
              Total: ${(totalCostCents / 100).toFixed(2)} · {events.length} items · {groupedByDay.size} day(s)
            </p>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Conflict warnings */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="font-bold text-red-800 text-sm">{conflicts.length} scheduling conflict{conflicts.length > 1 ? 's' : ''} detected</p>
          </div>
          <ul className="space-y-1">
            {conflicts.map((c, i) => (
              <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                {c.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    const cats = filter.categories || []
                    setFilter({
                      ...filter,
                      categories: cats.includes(cat) ? cats.filter(c => c !== cat) : [...cats, cat],
                    })
                  }}
                  className={`text-xs px-3 py-1 rounded-full border ${
                    (filter.categories || []).includes(cat)
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>
          </div>
          {(filter.categories?.length ?? 0) > 0 && (
            <button onClick={() => setFilter({ ...filter, categories: [] })} className="text-xs text-gray-400 hover:text-black">
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* FullCalendar */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="timeGridDay"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek',
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          height="auto"
          slotMinTime="06:00:00"
          slotMaxTime="23:00:00"
          nowIndicator
          dayHeaderFormat={{ weekday: 'short', month: 'short', day: 'numeric' }}
          eventTimeFormat={{ hour: 'numeric', minute: '2-digit' }}
          expandRows
        />
      </div>

      {/* Day-by-day list view */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase">Day by Day</h3>
        {Array.from(groupedByDay.entries()).map(([day, dayEvents]) => (
          <div key={day} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <p className="font-bold text-black text-sm">
                {new Date(day + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {dayEvents.map(e => (
                <div
                  key={e.id}
                  onClick={() => setSelectedEvent(e)}
                  className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 ${
                    conflictEventIds.has(e.id) ? 'border-l-4 border-l-red-500' : ''
                  }`}
                >
                  <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: e.backgroundColor }} />
                  <div className="flex-1">
                    <p className="font-medium text-black text-sm">{e.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>{new Date(e.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      {e.end && e.end !== e.start && (
                        <span>→ {new Date(e.end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      )}
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {e.extendedProps.quantity}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${(e.extendedProps.total_price_cents / 100).toFixed(0)}</span>
                      {e.extendedProps.vendor_name && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.extendedProps.vendor_name}</span>}
                    </div>
                    <span className={`inline-block mt-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${e.extendedProps.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {e.extendedProps.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: selectedEvent.backgroundColor }} />
            <h3 className="text-lg font-black text-black mb-2">{selectedEvent.title}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><Calendar className="w-4 h-4 inline mr-2" /> {new Date(selectedEvent.start).toLocaleString()}</p>
              {selectedEvent.end && selectedEvent.end !== selectedEvent.start && (
                <p><Calendar className="w-4 h-4 inline mr-2" /> Ends: {new Date(selectedEvent.end).toLocaleString()}</p>
              )}
              <p><MapPin className="w-4 h-4 inline mr-2" /> {selectedEvent.extendedProps.vendor_name || 'N/A'}</p>
              <p><Users className="w-4 h-4 inline mr-2" /> {selectedEvent.extendedProps.quantity} attendee(s)</p>
              <p><DollarSign className="w-4 h-4 inline mr-2" /> ${(selectedEvent.extendedProps.total_price_cents / 100).toFixed(2)}</p>
              <p className="text-xs">Category: {CATEGORY_LABELS[selectedEvent.extendedProps.category] || selectedEvent.extendedProps.category}</p>
              <p className="text-xs">Status: <span className="font-bold">{selectedEvent.extendedProps.status}</span></p>
              {conflictEventIds.has(selectedEvent.id) && (
                <p className="text-red-600 text-xs flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> This item has a scheduling conflict</p>
              )}
            </div>
            <button onClick={() => setSelectedEvent(null)} className="mt-4 w-full bg-black text-white font-bold py-2 rounded-lg text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
TS
