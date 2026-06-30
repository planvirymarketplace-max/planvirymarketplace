'use client'

import { useState, useEffect } from 'react'
import { UnifiedCard } from '@/components/UnifiedCard'
import { UnifiedGrid } from '@/components/UnifiedGrid'
import { Loader2, MapPin } from 'lucide-react'
import Link from 'next/link'

export function TicketmasterVenueClient() {
  const [venues, setVenues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ticketmaster/venues')
      .then(res => res.json())
      .then(data => { setVenues(data.venues || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-coral" />
      </div>
    )
  }

  if (venues.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-gray-50">
        <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-600">No venues found. Venues will appear as events are imported.</p>
      </div>
    )
  }

  return (
    <UnifiedGrid>
      {venues.map((venue, i) => {
        const slug = venue.venue_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        return (
          <UnifiedCard
            key={i}
            name={venue.venue_name}
            href={`/venue/${slug}`}
            image={venue.venue_image}
            badge={venue.next_event_segment?.toUpperCase()}
            city={venue.venue_city}
            state={venue.venue_state}
            description={venue.event_count > 0 ? `${venue.event_count} upcoming events` : undefined}
            date={venue.next_event}
          />
        )
      })}
    </UnifiedGrid>
  )
}
