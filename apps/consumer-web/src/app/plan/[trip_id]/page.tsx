'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ChevronRight, Home, MapPin, Calendar, Plus, Ticket, Home as HomeIcon, Utensils, Compass, ExternalLink } from 'lucide-react'
import { useTripItinerary } from '@/lib/trip-context'

const TYPE_ICONS: Record<string, React.ElementType> = {
  booking: HomeIcon,
  ticket: Ticket,
  lodging: HomeIcon,
  experience: Compass,
  restaurant: Utensils,
  external_event: ExternalLink,
}

const TYPE_COLORS: Record<string, string> = {
  booking: 'text-teal-600',
  ticket: 'text-coral',
  lodging: 'text-blue-600',
  experience: 'text-purple-600',
  restaurant: 'text-orange-600',
  external_event: 'text-amber-600',
}

export default function TripHubPage() {
  const router = useRouter()
  const params = useParams()
  const tripId = params.trip_id as string
  const supabase = createClient()
  const [trip, setTrip] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: tripData } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single()

      if (!tripData || tripData.owner_id !== user.id) {
        router.push('/portal')
        return
      }
      setTrip(tripData)

      const { data: itemsData } = await supabase
        .from('trip_itinerary_items')
        .select('*')
        .eq('trip_id', tripId)
        .order('display_date', { ascending: true })
        .order('sort_order', { ascending: true })

      setItems(itemsData || [])
      setLoading(false)
    }
    load()
  }, [tripId])

  // Group items by date
  const itemsByDate: Record<string, any[]> = {}
  for (const item of items) {
    if (!itemsByDate[item.display_date]) itemsByDate[item.display_date] = []
    itemsByDate[item.display_date].push(item)
  }
  const sortedDates = Object.keys(itemsByDate).sort()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-coral rounded-full animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="hover:text-black flex items-center gap-1"><Home className="w-3 h-3" /> Home</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link href="/portal" className="hover:text-black">My Trips</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-black font-medium">{trip?.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Trip header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-black tracking-tight">{trip?.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {trip?.destination_city}, {trip?.destination_state}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip?.start_date} → {trip?.end_date}</span>
            <span>{trip?.group_size} guests</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-coral">{trip?.status}</span>
          </div>
        </div>

        {/* Quick add */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link href={`/vendors?city=${trip?.destination_city}`} className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-coral transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Vendor
          </Link>
          <Link href="/travel/search" className="inline-flex items-center gap-1.5 border border-black text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Lodging
          </Link>
          <Link href="/tickets" className="inline-flex items-center gap-1.5 border border-black text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Event
          </Link>
        </div>

        {/* Itinerary timeline */}
        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No items in your itinerary yet.</p>
            <p className="text-xs text-gray-300 mt-1">Add vendors, lodging, events, and experiences to build your trip.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date}>
                <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-3">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                <div className="space-y-2">
                  {itemsByDate[date].map(item => {
                    const Icon = TYPE_ICONS[item.item_type] || Ticket
                    const color = TYPE_COLORS[item.item_type] || 'text-gray-500'
                    return <AppLayoutShell>
                      <div key={item.id} className="flex items-center gap-3 bg-white p-4 border border-gray-200 rounded-xl">
                        <div className={`shrink-0 w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${color}`}>{item.item_type.replace('_', ' ')}</span>
                          <p className="text-sm font-bold text-black truncate">{item.display_name}</p>
                          {item.display_time && <p className="text-xs text-gray-400">{item.display_time}</p>}
                          {item.display_location && <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.display_location}</p>}
                        </div>
                        {item.display_price && <span className="text-sm font-bold text-coral">${item.display_price}</span>}
                      </div>
                    </AppLayoutShell>

                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
