import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home, MapPin, Users, Calendar, Ticket, ArrowRight } from 'lucide-react'
import { TicketmasterVenueClient } from '@/components/tickets/TicketmasterVenueClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ')} | Venue | Planviry`,
    description: `Venue information, upcoming events, seating charts, and nearby hotels, restaurants, and attractions.`,
  }
}

export const revalidate = 3600 // ISR — revalidate every hour

export default async function VenuePage({ params }: PageProps) {
  const { slug } = await params

  // Fetch events at this venue from Ticketmaster API
  const venueName = slug.replace(/-/g, ' ')
  const eventsRes = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY || 'wFwGN4aABbGR9v912xBy7WWD6M0WIBBK'}&size=50&countryCode=US&keyword=${encodeURIComponent(venueName)}`,
    { next: { revalidate: 3600 } }
  )

  let events: any[] = []
  let venue: any = null

  if (eventsRes.ok) {
    const data = await eventsRes.json()
    events = (data._embedded?.events || []).map((e: any) => {
      const v = e._embedded?.venues?.[0] || {}
      if (!venue && v.name) {
        venue = {
          name: v.name,
          id: v.id,
          type: v.type,
          city: v.city?.name,
          state: v.state?.stateCode,
          state_full: v.state?.name,
          address: v.address?.line1,
          postal_code: v.postalCode,
          country: v.country?.countryCode,
          lat: v.location?.latitude ? parseFloat(v.location.latitude) : null,
          lng: v.location?.longitude ? parseFloat(v.location.longitude) : null,
          url: v.url,
          image: v.images?.[0]?.url,
          parking: v.parkingDetail,
          accessible_seating: v.accessibleSeatingDetail,
          general_rule: v.generalInfo?.generalRule,
          child_rule: v.generalInfo?.childRule,
          box_office: v.boxOfficeInfo,
        }
      }
      const images = e.images || []
      const bestImage = images.find((img: any) => img.width >= 640) || images[0]
      return {
        id: e.id,
        name: e.name,
        date: e.dates?.start?.localDate,
        time: e.dates?.start?.localTime,
        segment: e.classifications?.[0]?.segment?.name,
        genre: e.classifications?.[0]?.genre?.name,
        image_url: bestImage?.url,
        url: e.url,
        min_price: e.priceRanges?.[0]?.min,
        max_price: e.priceRanges?.[0]?.max,
        seatmap: e.seatmap?.staticUrl,
        info: e.info,
      }
    })
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Venues', href: '/venues' },
    { label: venue?.name || venueName },
  ]

  return <AppLayoutShell>
    <TicketmasterVenueClient
      venue={venue}
      events={events}
      breadcrumbs={breadcrumbs}
    />
  </AppLayoutShell>

}
