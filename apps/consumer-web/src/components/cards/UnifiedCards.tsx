'use client'

import Link from 'next/link'
import { MapPin, Star, ShieldCheck, Zap, Heart, Utensils, Compass } from "lucide-react"
import { useState } from 'react'
import { useCart, cartItemId, type CartItem } from '@/lib/cart-context'

// ===========================================================================
// Unified Card Components — Part 45.3
// ===========================================================================
// Each card type has a distinct visual treatment so planners immediately
// understand what they're looking at. All cards share the same 16:9 hero
// image slot and action row, but the badge and CTA differ.
// ===========================================================================

// ── VendorCard (booking/lodging) ───────────────────────────────────────────
export interface VendorCardData {
  objectID: string
  name: string
  slug: string
  city: string
  state: string
  planviry_vertical?: string
  planviry_sub_category?: string
  profile_image_url?: string | null
  avg_rating?: number | null
  review_count?: number
  price_tier?: number | null
  is_claimed?: boolean
  instant_book?: boolean
  is_promoted?: boolean
  phone?: string | null
  website?: string | null
}

export function VendorCard({ vendor }: { vendor: VendorCardData }) {
  const { addItem } = useCart()
  const [saved, setSaved] = useState(false)

  const isUnclaimed = vendor.is_claimed === false

  const handleAddToCart = () => {
    const item: CartItem = {
      id: cartItemId('booking', vendor.objectID, 'default'),
      type: 'booking',
      listing_id: vendor.objectID,
      vendor_id: vendor.objectID,
      name: vendor.name,
      image_url: vendor.profile_image_url,
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      deposit_amount: 0,
      category: vendor.planviry_vertical,
    }
    addItem(item)
  }

  return (
    <div className={`group flex flex-col bg-white rounded-2xl border ${isUnclaimed ? 'border-dashed border-gray-300' : 'border-black/[0.08]'} hover:border-black/20 hover:shadow-lg transition-all overflow-hidden`}>
      <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {vendor.profile_image_url ? (
          <img src={vendor.profile_image_url} alt={vendor.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-300 text-sm">{vendor.planviry_vertical ?? 'Vendor'}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {vendor.is_promoted && (
            <span className="bg-amber-100 text-amber-800 text-[9.5px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">Featured</span>
          )}
          {vendor.instant_book && !isUnclaimed && (
            <span className="bg-green-100 text-green-800 text-[9.5px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">Instant Book</span>
          )}
          {isUnclaimed && (
            <span className="bg-gray-100 text-gray-600 text-[9.5px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">Unclaimed</span>
          )}
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Save"
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-coral text-coral' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-base text-black truncate group-hover:text-coral transition-colors font-display">
          {vendor.name}
        </h3>
        <p className="text-xs text-black/60 mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {vendor.city}, {vendor.state}
        </p>
        {vendor.planviry_sub_category && (
          <p className="text-xs text-black/40 mt-0.5">{vendor.planviry_sub_category}</p>
        )}
        <div className="mt-2 flex items-center gap-3">
          {vendor.avg_rating && vendor.review_count ? (
            <span className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 fill-coral text-coral" />
              <span className="font-bold text-black">{vendor.avg_rating.toFixed(1)}</span>
              <span className="text-black/40">({vendor.review_count})</span>
            </span>
          ) : (
            <span className="text-xs text-black/30">New on Planviry</span>
          )}
          {vendor.price_tier && (
            <span className="text-xs text-black/40">{'$'.repeat(vendor.price_tier)}</span>
          )}
        </div>
        <div className="mt-auto pt-4 border-t border-black/5 flex gap-2">
          {isUnclaimed ? (
            <Link
              href={`/claim-profile?listing=${vendor.objectID}`}
              className="flex-1 text-center border border-black text-black font-medium py-2 rounded-xl hover:bg-black hover:text-white transition-colors text-sm"
            >
              Claim
            </Link>
          ) : (
            <>
              <Link
                href={`/v/${vendor.slug}`}
                className="flex-1 text-center border border-black text-black font-medium py-2 rounded-xl hover:bg-black hover:text-white transition-colors text-sm"
              >
                View Profile
              </Link>
              {vendor.instant_book && (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white font-medium py-2 rounded-xl hover:bg-coral transition-colors text-sm"
                >
                  Add to Cart
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── TicketCard (Planviry-native tickets) ───────────────────────────────────
export interface TicketCardData {
  id: string
  event_name: string
  event_date: string
  venue: string
  city: string
  state: string
  image_url?: string | null
  min_price?: number | null
  max_price?: number | null
  is_sold_out?: boolean
  tier_id?: string
}

export function TicketCard({ ticket }: { ticket: TicketCardData }) {
  const { addItem } = useCart()
  const date = new Date(ticket.event_date)
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = date.getDate()

  const handleBuy = () => {
    const item: CartItem = {
      id: cartItemId('ticket', ticket.id, ticket.tier_id ?? 'default'),
      type: 'ticket',
      listing_id: ticket.id,
      vendor_id: null,
      name: ticket.event_name,
      image_url: ticket.image_url,
      date: ticket.event_date,
      amount: ticket.min_price ?? 0,
      quantity: 1,
      category: 'ticket',
    }
    addItem(item)
  }

  return (
    <div className="flex items-stretch bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-lg overflow-hidden">
      <div className="flex flex-col items-center justify-center w-16 sm:w-20 bg-gray-50 border-r border-gray-200 py-4 shrink-0">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{month}</span>
        <span className="text-2xl font-black text-black leading-none mt-0.5">{day}</span>
      </div>
      <div className="flex-1 min-w-0 p-4">
        <h3 className="text-sm font-bold text-black truncate">{ticket.event_name}</h3>
        <p className="text-xs text-gray-500 mt-1">{ticket.venue}</p>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {ticket.city}, {ticket.state}
        </p>
        {ticket.min_price && (
          <p className="text-xs font-bold text-coral mt-2">
            {ticket.is_sold_out ? 'Sold Out' : `From $${ticket.min_price}`}
          </p>
        )}
      </div>
      <div className="flex items-center pr-4 shrink-0">
        {ticket.is_sold_out ? (
          <button disabled className="text-xs font-bold text-gray-400 px-4 py-2.5 rounded-lg bg-gray-100">
            Sold Out
          </button>
        ) : (
          <button
            onClick={handleBuy}
            className="inline-flex items-center gap-1.5 bg-black hover:bg-coral text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider whitespace-nowrap"
          >
            Buy Tickets
          </button>
        )}
      </div>
    </div>
  )
}

// ── ExternalEventCard (Ticketmaster/Eventbrite — NEVER cart) ────────────────
export interface ExternalEventData {
  id: string
  name: string
  venue_name?: string | null
  city: string
  state: string
  event_date: string
  image_url?: string | null
  min_price?: number | null
  max_price?: number | null
  ticket_url: string
  genre?: string | null
  is_sold_out: boolean
}

export function ExternalEventCard({ event }: { event: ExternalEventData }) {
  const date = new Date(event.event_date)
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = date.getDate()

  return (
    <div className="flex items-stretch bg-white border border-gray-200 hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all rounded-lg overflow-hidden">
      <div className="flex flex-col items-center justify-center w-16 sm:w-20 bg-amber-50 border-r border-amber-100 py-4 shrink-0">
        <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">{month}</span>
        <span className="text-2xl font-black text-black leading-none mt-0.5">{day}</span>
      </div>
      <div className="flex-1 min-w-0 p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Live Event</span>
          {event.genre && <span className="text-[10px] text-gray-400">{event.genre}</span>}
        </div>
        <h3 className="text-sm font-bold text-black truncate">{event.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{event.venue_name}</p>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {event.city}, {event.state}
        </p>
        {event.min_price && (
          <p className="text-xs font-bold text-coral mt-2">From ${event.min_price}</p>
        )}
      </div>
      <div className="flex items-center pr-4 shrink-0">
        {event.is_sold_out ? (
          <button disabled className="text-xs font-bold text-gray-400 px-4 py-2.5 rounded-lg bg-gray-100">
            Sold Out
          </button>
        ) : (
          <a
            href={event.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors uppercase tracking-wider whitespace-nowrap"
          >
            Get Tickets
          </a>
        )}
      </div>
    </div>
  )
}

// ── LodgingCard (Travel & Lodging vertical) ────────────────────────────────
export interface LodgingCardData {
  id: string
  name: string
  slug: string
  city: string
  state: string
  profile_image_url?: string | null
  avg_rating?: number | null
  review_count?: number
  price_tier?: number | null
  is_claimed?: boolean
  instant_book?: boolean
}

export function LodgingCard({ lodging }: { lodging: LodgingCardData }) {
  const { addItem } = useCart()

  const handleBook = () => {
    const item: CartItem = {
      id: cartItemId('lodging', lodging.id, 'default'),
      type: 'lodging',
      listing_id: lodging.id,
      vendor_id: lodging.id,
      name: lodging.name,
      image_url: lodging.profile_image_url,
      date: new Date().toISOString().split('T')[0],
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      amount: 0,
      deposit_amount: 0,
      category: 'lodging',
    }
    addItem(item)
  }

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-black/[0.08] hover:border-black/20 hover:shadow-lg transition-all overflow-hidden">
      <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {lodging.profile_image_url ? (
          <img src={lodging.profile_image_url} alt={lodging.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-300 text-sm">Lodging</span>
          </div>
        )}
        {lodging.is_claimed && lodging.instant_book && (
          <span className="absolute top-3 left-3 bg-green-100 text-green-800 text-[9.5px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">Instant Book</span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-base text-black truncate group-hover:text-coral transition-colors font-display">{lodging.name}</h3>
        <p className="text-xs text-black/60 mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {lodging.city}, {lodging.state}
        </p>
        <div className="mt-2 flex items-center gap-3">
          {lodging.avg_rating && lodging.review_count ? (
            <span className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 fill-coral text-coral" />
              <span className="font-bold">{lodging.avg_rating.toFixed(1)}</span>
              <span className="text-black/40">({lodging.review_count})</span>
            </span>
          ) : null}
          {lodging.price_tier && <span className="text-xs text-black/40">{'$'.repeat(lodging.price_tier)}</span>}
        </div>
        <div className="mt-auto pt-4 border-t border-black/5 flex gap-2">
          <Link href={`/v/${lodging.slug}`} className="flex-1 text-center border border-black text-black font-medium py-2 rounded-xl hover:bg-black hover:text-white transition-colors text-sm">
            View Details
          </Link>
          {lodging.is_claimed && (
            <button onClick={handleBook} className="flex-1 bg-black text-white font-medium py-2 rounded-xl hover:bg-coral transition-colors text-sm">
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── RestaurantCard (Part 43) ────────────────────────────────────────────────
export interface RestaurantCardData {
  id: string
  name: string
  city: string
  state: string
  cuisine_type?: string[]
  price_tier?: number | null
  avg_rating?: number | null
  review_count?: number
  profile_image_url?: string | null
  accepts_native_reservations?: boolean
  opentable_url?: string | null
  resy_url?: string | null
}

export function RestaurantCard({ restaurant }: { restaurant: RestaurantCardData }) {
  const { addItem } = useCart()

  const handleReserve = () => {
    const item: CartItem = {
      id: cartItemId('restaurant', restaurant.id, 'reservation'),
      type: 'restaurant',
      listing_id: restaurant.id,
      vendor_id: restaurant.id,
      name: restaurant.name,
      image_url: restaurant.profile_image_url,
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      restaurant_id: restaurant.id,
      party_size: 2,
      reservation_time: '19:00',
      category: 'restaurant',
    }
    addItem(item)
  }

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-black/[0.08] hover:border-black/20 hover:shadow-lg transition-all overflow-hidden">
      <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {restaurant.profile_image_url ? (
          <img src={restaurant.profile_image_url} alt={restaurant.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="w-8 h-8 text-gray-300" />
          </div>
        )}
        {restaurant.accepts_native_reservations && (
          <span className="absolute top-3 left-3 bg-orange-100 text-orange-800 text-[9.5px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">Reserve</span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-base text-black truncate group-hover:text-coral transition-colors font-display">{restaurant.name}</h3>
        <p className="text-xs text-black/60 mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {restaurant.city}, {restaurant.state}
        </p>
        {restaurant.cuisine_type && restaurant.cuisine_type.length > 0 && (
          <p className="text-xs text-black/40 mt-0.5">{restaurant.cuisine_type.join(', ')}</p>
        )}
        <div className="mt-2 flex items-center gap-3">
          {restaurant.avg_rating && restaurant.review_count ? (
            <span className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 fill-coral text-coral" />
              <span className="font-bold">{restaurant.avg_rating.toFixed(1)}</span>
              <span className="text-black/40">({restaurant.review_count})</span>
            </span>
          ) : null}
          {restaurant.price_tier && <span className="text-xs text-black/40">{'$'.repeat(restaurant.price_tier)}</span>}
        </div>
        <div className="mt-auto pt-4 border-t border-black/5 flex gap-2">
          {restaurant.accepts_native_reservations ? (
            <button onClick={handleReserve} className="flex-1 bg-black text-white font-medium py-2 rounded-xl hover:bg-coral transition-colors text-sm">
              Reserve
            </button>
          ) : restaurant.opentable_url ? (
            <a href={restaurant.opentable_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center border border-black text-black font-medium py-2 rounded-xl hover:bg-black hover:text-white transition-colors text-sm">
              OpenTable
            </a>
          ) : restaurant.resy_url ? (
            <a href={restaurant.resy_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center border border-black text-black font-medium py-2 rounded-xl hover:bg-black hover:text-white transition-colors text-sm">
              Resy
            </a>
          ) : (
            <span className="flex-1 text-center text-xs text-gray-400 py-2">No online reservations</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── ExperienceCard (Part 44) ────────────────────────────────────────────────
export interface ExperienceCardData {
  id: string
  title: string
  experience_type?: string
  city: string
  state: string
  duration_minutes?: number
  base_price_per_person?: number | null
  max_capacity?: number
  profile_image_url?: string | null
  avg_rating?: number | null
  review_count?: number
}

export function ExperienceCard({ experience }: { experience: ExperienceCardData }) {
  const { addItem } = useCart()

  const handleBook = () => {
    const item: CartItem = {
      id: cartItemId('experience', experience.id, 'default'),
      type: 'experience',
      listing_id: experience.id,
      vendor_id: experience.id,
      name: experience.title,
      image_url: experience.profile_image_url,
      date: new Date().toISOString().split('T')[0],
      amount: experience.base_price_per_person ?? 0,
      experience_slot_id: experience.id,
      category: 'experience',
    }
    addItem(item)
  }

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-black/[0.08] hover:border-black/20 hover:shadow-lg transition-all overflow-hidden">
      <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {experience.profile_image_url ? (
          <img src={experience.profile_image_url} alt={experience.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Compass className="w-8 h-8 text-gray-300" />
          </div>
        )}
        {experience.experience_type && (
          <span className="absolute top-3 left-3 bg-purple-100 text-purple-800 text-[9.5px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
            {experience.experience_type.replace('_', ' ')}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-base text-black truncate group-hover:text-coral transition-colors font-display">{experience.title}</h3>
        <p className="text-xs text-black/60 mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {experience.city}, {experience.state}
        </p>
        {experience.duration_minutes && (
          <p className="text-xs text-black/40 mt-0.5">{Math.floor(experience.duration_minutes / 60)}h {experience.duration_minutes % 60}m</p>
        )}
        <div className="mt-2 flex items-center gap-3">
          {experience.avg_rating && experience.review_count ? (
            <span className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 fill-coral text-coral" />
              <span className="font-bold">{experience.avg_rating.toFixed(1)}</span>
              <span className="text-black/40">({experience.review_count})</span>
            </span>
          ) : null}
        </div>
        <div className="mt-auto pt-4 border-t border-black/5 flex items-end justify-between">
          {experience.base_price_per_person && (
            <span className="text-lg font-bold text-black">${experience.base_price_per_person}<span className="text-xs text-black/40"> /person</span></span>
          )}
          <button onClick={handleBook} className="bg-black text-white font-medium py-2 px-4 rounded-xl hover:bg-coral transition-colors text-sm">
            Book Activity
          </button>
        </div>
      </div>
    </div>
  )
}
