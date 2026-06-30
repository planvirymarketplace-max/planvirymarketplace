'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Calendar, MapPin, Plus, ChevronRight, Users, DollarSign } from 'lucide-react'

export default function PlannerPortalPage() {
  const router = useRouter()
  const supabase = createClient()
  const [trips, setTrips] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?next=/portal'); return }

      const [tripsRes, eventsRes] = await Promise.all([
        supabase.from('trips').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
        supabase.from('events').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }).limit(5),
      ])

      setTrips(tripsRes.data || [])
      setEvents(eventsRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-coral rounded-full animate-spin" /></div>
  }

  return <AppLayoutShell>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm text-white/60 hover:text-white">← Planviry</Link>
          <h1 className="text-lg font-bold">My Events & Trips</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/planner" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-black hover:shadow-lg transition-all group">
            <Calendar className="w-8 h-8 text-coral mb-3" />
            <h3 className="font-bold text-black group-hover:text-coral transition-colors">Plan an Event</h3>
            <p className="text-xs text-gray-400 mt-1">Weddings, birthdays, corporate events</p>
          </Link>
          <Link href="/plan" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-black hover:shadow-lg transition-all group">
            <MapPin className="w-8 h-8 text-coral mb-3" />
            <h3 className="font-bold text-black group-hover:text-coral transition-colors">Plan a Trip</h3>
            <p className="text-xs text-gray-400 mt-1">Destination weekends, getaways</p>
          </Link>
          <Link href="/vendors" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-black hover:shadow-lg transition-all group">
            <Users className="w-8 h-8 text-coral mb-3" />
            <h3 className="font-bold text-black group-hover:text-coral transition-colors">Browse Vendors</h3>
            <p className="text-xs text-gray-400 mt-1">Search photographers, venues, DJs</p>
          </Link>
        </div>

        {/* Trips */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-black uppercase tracking-widest">My Trips</h2>
            <Link href="/plan" className="text-xs font-bold text-coral flex items-center gap-1">
              <Plus className="w-3 h-3" /> New Trip
            </Link>
          </div>
          {trips.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No trips yet. Start planning a destination getaway.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map(trip => (
                <Link key={trip.id} href={`/plan/${trip.id}`} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-black hover:shadow-lg transition-all group">
                  <h3 className="font-bold text-black group-hover:text-coral transition-colors">{trip.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {trip.destination_city}, {trip.destination_state}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{trip.start_date} → {trip.end_date}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">{trip.status}</span>
                    <span className="text-[10px] text-gray-300">{trip.group_size} guests</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Events */}
        <div>
          <h2 className="text-sm font-black text-black uppercase tracking-widest mb-4">My Events</h2>
          {events.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No events yet. Start planning an event.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {events.map(event => (
                <Link key={event.id} href={`/portal/events/${event.id}`} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-black">{event.name || 'Untitled Event'}</p>
                    <p className="text-xs text-gray-400">{event.event_date} | {event.city || 'No city set'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </AppLayoutShell>

}
