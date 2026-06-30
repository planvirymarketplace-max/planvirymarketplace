'use client'

import React from 'react'
import { Calendar, MapPin, Ticket, ArrowRight, Clock } from 'lucide-react'

interface LiveEventsViewProps {
  setView: (view: 'home' | 'directory' | 'cart' | 'vendor-detail' | 'login' | 'signup' | 'live-events') => void
}

const EVENTS = [
  {
    id: '1',
    name: 'Milwaukee Bridal Show',
    date: 'June 15, 2026',
    time: '10:00 AM – 4:00 PM',
    venue: 'Wisconsin Center',
    address: '400 W Wisconsin Ave, Milwaukee, WI',
    description: 'Meet over 150 top wedding vendors, see live demos, and plan your dream Milwaukee wedding all under one roof.',
    type: 'Bridal Show',
    action: 'Get Tickets',
    imageHint: 'bridal show'
  },
  {
    id: '2',
    name: 'Wedding Expo MKE',
    date: 'July 20, 2026',
    time: '11:00 AM – 5:00 PM',
    venue: 'Potawatomi Hotel & Casino',
    address: '1721 W Canal St, Milwaukee, WI',
    description: 'The largest wedding expo in Southeast Wisconsin featuring runway shows, cake tastings, and exclusive vendor deals.',
    type: 'Expo',
    action: 'Get Tickets',
    imageHint: 'wedding expo'
  },
  {
    id: '3',
    name: 'Sample Sale Event',
    date: 'August 3, 2026',
    time: '9:00 AM – 3:00 PM',
    venue: 'The Pfister Hotel',
    address: '424 E Wisconsin Ave, Milwaukee, WI',
    description: 'Exclusive sample sale featuring designer gowns, decor, and accessories at up to 70% off retail pricing.',
    type: 'Sale',
    action: 'RSVP',
    imageHint: 'sample sale'
  },
  {
    id: '4',
    name: 'Tasting & Planning Night',
    date: 'August 18, 2026',
    time: '6:00 PM – 9:00 PM',
    venue: 'Discovery World',
    address: '500 N Harbor Dr, Milwaukee, WI',
    description: 'Sample menus from Milwaukee\'s top caterers, meet planners, and enjoy waterfront views while planning your event.',
    type: 'Tasting',
    action: 'RSVP',
    imageHint: 'tasting night'
  },
  {
    id: '5',
    name: 'Vendor Showcase',
    date: 'September 5, 2026',
    time: '12:00 PM – 6:00 PM',
    venue: 'Milwaukee Art Museum',
    address: '700 N Art Museum Dr, Milwaukee, WI',
    description: 'An curated showcase of premium Milwaukee event vendors in the stunning Calatrava-designed museum spaces.',
    type: 'Showcase',
    action: 'Get Tickets',
    imageHint: 'art museum'
  },
  {
    id: '6',
    name: 'Fall Wedding Festival',
    date: 'October 12, 2026',
    time: '10:00 AM – 4:00 PM',
    venue: 'Mitchell Park Domes',
    address: '524 S Layton Blvd, Milwaukee, WI',
    description: 'Celebrate the fall wedding season among tropical and desert gardens with top vendors and live demonstrations.',
    type: 'Festival',
    action: 'RSVP',
    imageHint: 'park domes'
  }
]

export function LiveEventsView({ setView }: LiveEventsViewProps) {
  return (
    <div className="bg-[#FAF9F6] py-8">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-red-50 border border-red-200 px-4 py-1.5 mb-4">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-700">Live & Upcoming</span>
          </div>
          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl font-medium text-stone-900 tracking-tight mb-3">
            Live Events in Milwaukee
          </h1>
          <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
            Discover bridal shows, tastings, and vendor showcases across the Milwaukee metro area. Meet top vendors face-to-face and plan your perfect event.
          </p>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-stone-300 transition-all duration-300 group"
            >
              {/* Image placeholder */}
              <div className="relative h-52 w-full overflow-hidden bg-stone-100">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                  <div className="text-center">
                    <Calendar size={32} className="mx-auto text-stone-400 mb-2" />
                    <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">{event.type}</span>
                  </div>
                </div>
                {/* Date badge */}
                <div className="absolute top-4 left-4 rounded-xl bg-white/95 backdrop-blur-sm border border-stone-200 px-3 py-2 text-center shadow-sm">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
                    {event.date.split(' ')[0]}
                  </div>
                  <div className="text-lg font-bold text-stone-900 leading-tight">
                    {event.date.split(' ')[1].replace(',', '')}
                  </div>
                </div>
                {/* Type badge */}
                <div className="absolute top-4 right-4 rounded-full bg-stone-900/80 backdrop-blur-sm px-3 py-1">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">{event.type}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="font-[var(--font-display)] text-xl font-medium text-stone-900 tracking-tight mb-2 group-hover:text-red-600 transition-colors">
                  {event.name}
                </h3>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center space-x-2 text-xs text-stone-500">
                    <MapPin size={13} className="text-stone-400 flex-shrink-0" />
                    <span className="font-medium text-stone-700">{event.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-500">
                    <Clock size={13} className="text-stone-400 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-stone-500">
                    <Calendar size={13} className="text-stone-400 flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-500 leading-relaxed mb-5 line-clamp-2 font-light">
                  {event.description}
                </p>

                <button
                  onClick={() => console.log(`${event.action} for ${event.name}`)}
                  className="inline-flex items-center space-x-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
                >
                  <Ticket size={14} />
                  <span>{event.action}</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-3xl bg-white border border-stone-200 shadow-sm p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-[var(--font-display)] text-2xl font-medium text-stone-900 tracking-tight mb-1">
              Want to exhibit at our events?
            </h3>
            <p className="text-sm text-stone-500 font-light">
              Showcase your services to hundreds of engaged couples and event planners.
            </p>
          </div>
          <button
            onClick={() => setView('signup')}
            className="rounded-xl bg-stone-900 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-stone-800 transition-all uppercase tracking-wider flex-shrink-0"
          >
            Apply as Vendor
          </button>
        </div>
      </div>
    </div>
  )
}
