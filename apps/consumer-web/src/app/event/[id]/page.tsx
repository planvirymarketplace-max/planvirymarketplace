import { AppLayoutShell } from '@/components/AppLayoutShell'
import { TicketPurchasePanel } from '@/components/tickets/TicketPurchasePanel'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home, MapPin, Calendar, Ticket, ArrowRight, Building2, Utensils, Plane, Car, Sparkles, Star } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Event | Planviry`,
    description: 'Event details, venue info, tickets, and nearby hotels, restaurants, and attractions.',
  }
}

export const revalidate = 3600

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params

  // Fetch event details from Ticketmaster
  const res = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${process.env.TICKETMASTER_API_KEY || 'wFwGN4aABbGR9v912xBy7WWD6M0WIBBK'}`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) notFound()
  const event = await res.json()

  const venue = event._embedded?.venues?.[0] || {}
  const classification = event.classifications?.[0] || {}
  const images = event.images || []
  const bestImage = images.find((img: any) => img.width >= 640) || images[0]
  const priceRange = event.priceRanges?.[0]

  const venueSlug = venue.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: event.name },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            {breadcrumbs.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} className="text-gray-400" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-black font-medium truncate max-w-xs">{item.label}</span>
                ) : item.href ? (
                  <Link href={item.href} className="hover:text-black flex items-center gap-1">
                    {i === 0 && <Home size={13} />}
                    {item.label}
                  </Link>
                ) : null}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {bestImage?.url && (
              <div className="w-full md:w-96 h-64 rounded-xl overflow-hidden shrink-0">
                <img src={bestImage.url} alt={event.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {classification.segment?.name && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-coral bg-coral/10 px-2 py-0.5 rounded">
                    {classification.segment.name}
                  </span>
                )}
                {classification.genre?.name && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {classification.genre.name}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">{event.name}</h1>
              
              <div className="mt-3 space-y-1.5">
                {event.dates?.start?.localDate && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(event.dates.start.localDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    {event.dates?.start?.localTime && ` at ${event.dates.start.localTime}`}
                  </p>
                )}
                {venue.name && (
                  <Link href={`/venue/${venueSlug}`} className="text-sm text-gray-600 flex items-center gap-2 hover:text-coral">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {venue.name}
                    {venue.city?.name && `, ${venue.city.name}, ${venue.state?.stateCode}`}
                  </Link>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {event.url && (
                  <a href={event.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm">
                    <Ticket className="w-4 h-4" /> Get Tickets
                  </a>
                )}
                {priceRange && (
                  <div className="inline-flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl">
                    <span className="text-xs text-gray-400">Price:</span>
                    <span className="text-sm font-bold text-black">${priceRange.min} - ${priceRange.max}</span>
                    <span className="text-xs text-gray-400">{priceRange.currency}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Event info */}
          {event.info && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 mb-2">About This Event</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{event.info}</p>
            </div>
          )}
          {event.pleaseNote && (
            <div className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-2">Please Note</h3>
              <p className="text-sm text-amber-700 leading-relaxed">{event.pleaseNote}</p>
            </div>
          )}
        </div>
      </section>

      {/* Ticket purchase panel — wired to /api/tickets/tiers + /api/tickets/purchase */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <TicketPurchasePanel eventId={id} eventTitle={event.name} />
        </div>
      </section>

      {/* Seatmap */}
      {event.seatmap?.staticUrl && (
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
            <h2 className="text-xl font-black text-black mb-4">Seating Chart</h2>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img src={event.seatmap.staticUrl} alt="Seating chart" className="w-full" />
            </div>
          </div>
        </section>
      )}

      {/* Integrated tabs — same as venue page */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {[
              { key: 'hotels', label: 'Hotels', icon: Building2 },
              { key: 'flights', label: 'Flights', icon: Plane },
              { key: 'cars', label: 'Cars', icon: Car },
              { key: 'restaurants', label: 'Restaurants', icon: Utensils },
              { key: 'plan', label: 'Plan & Event', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon
              const href = tab.key === 'plan' ? '/plan' : `/venue/${venueSlug}`
              return <AppLayoutShell>
                <Link key={tab.key} href={href} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-50 whitespace-nowrap transition-all">
                  <Icon className="w-4 h-4" />{tab.label}
                </Link>
              </AppLayoutShell>

            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <h2 className="text-xl font-black text-black mb-4">Plan Your Trip to This Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href={venueSlug ? `/venue/${venueSlug}` : '/travel'} className="p-5 bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-xl">
            <Building2 className="w-6 h-6 text-coral mb-3" />
            <h3 className="text-sm font-bold text-black">Hotels</h3>
            <p className="text-xs text-gray-500 mt-1">Find hotels near {venue.name || 'the venue'}</p>
          </Link>
          <Link href="/travel" className="p-5 bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-xl">
            <Utensils className="w-6 h-6 text-coral mb-3" />
            <h3 className="text-sm font-bold text-black">Restaurants</h3>
            <p className="text-xs text-gray-500 mt-1">Dine before or after the show</p>
          </Link>
          <Link href="/travel" className="p-5 bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-xl">
            <Car className="w-6 h-6 text-coral mb-3" />
            <h3 className="text-sm font-bold text-black">Transportation</h3>
            <p className="text-xs text-gray-500 mt-1">Car rentals and parking</p>
          </Link>
          <Link href="/plan" className="p-5 bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-xl">
            <Sparkles className="w-6 h-6 text-coral mb-3" />
            <h3 className="text-sm font-bold text-black">Add to Plan</h3>
            <p className="text-xs text-gray-500 mt-1">Bundle with hotel + dinner</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
