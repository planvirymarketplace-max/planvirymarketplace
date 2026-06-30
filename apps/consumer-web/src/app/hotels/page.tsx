'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Home, MapPin, Search, Building2, Star, ArrowRight, Loader2 } from 'lucide-react'

export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Fetch from Algolia — type:lodging or type:ticket_event with venue
    fetch('/api/search?q=&type=lodging&limit=50')
      .then(res => res.json())
      .then(data => { setHotels(data.hits || []); setLoading(false) })
      .catch(() => {
        // Fallback: fetch from Supabase gds_accommodations
        fetch('/api/hotels')
          .then(res => res.json())
          .then(data => { setHotels(data.hotels || []); setLoading(false) })
          .catch(() => setLoading(false))
      })
  }, [])

  const filtered = search
    ? hotels.filter(h => (h.name || h.business_name || '').toLowerCase().includes(search.toLowerCase()) || (h.city || h.venue_city || '').toLowerCase().includes(search.toLowerCase()))
    : hotels

  return <AppLayoutShell>
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="hover:text-black flex items-center gap-1"><Home size={13} /> Home</Link>
            <ChevronRight size={13} className="text-gray-400" />
            <span className="text-black font-medium">Hotels</span>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-black text-black tracking-tight flex items-center gap-3 mb-1">
          <Building2 className="w-7 h-7 text-coral" /> Hotels & Lodging
        </h1>
        <p className="text-sm text-gray-500 mb-6">Find hotels, resorts, and lodging near events and destinations.</p>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search hotel name or city..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black" />
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-coral" /></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-gray-50">
            <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No hotels found. Hotels will appear here once data is seeded.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((hotel, i) => (
              <div key={i} className="bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-xl overflow-hidden">
                {hotel.image_url && <div className="aspect-video bg-gray-100 overflow-hidden"><img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" /></div>}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-black truncate">{hotel.name || hotel.business_name}</h3>
                  {(hotel.city || hotel.venue_city) && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{hotel.city || hotel.venue_city}, {hotel.state || hotel.venue_state}</p>}
                  {hotel.star_rating && <div className="flex items-center gap-0.5 mt-1">{Array.from({length: Math.floor(hotel.star_rating)}).map((_,i)=><Star key={i} className="w-3 h-3 text-coral fill-coral" />)}</div>}
                  {hotel.min_price && <p className="text-xs text-gray-400 mt-1">From ${hotel.min_price}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </AppLayoutShell>

}
