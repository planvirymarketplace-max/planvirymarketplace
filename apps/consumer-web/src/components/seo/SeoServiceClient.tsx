'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronRight, Star, Filter, X,
  ArrowUpDown, SlidersHorizontal,
  Building2, ArrowRight, Home, Search,
  ChevronDown, ChevronUp, MapPin, Navigation,
  CheckCircle2, HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SeoSearchBar from '@/components/SeoSearchBar'
import { subcategoryFilters, type FilterGroup } from '@/data/taxonomy'
import type { SeoServicePattern } from '@/data/seo-pages'
import { SEO_LOCATIONS, SEO_STATES, type SeoLocation } from '@/data/seo-locations'
import { useRouter } from 'next/navigation'
import { seoCategoryToCanonical, buildCategoryUrl, getCategoryLabel } from '@/lib/routes'

/* ────────────────────────────────────────────────────────────
   Vendor type (from /api/vendors)
   ──────────────────────────────────────────────────────────── */
interface VendorResult {
  vendor_id: string
  business_name: string
  slug: string
  cover_url: string | null
  avg_rating: number | null
  review_count: number | null
  price_range: string | null
  price_starting_at: number | null
  neighborhood: string | null
  is_featured: boolean
  is_verified: boolean
  instant_booking: boolean
  distance_miles: number | null
  bio: string | null
  address: string | null
  category: string | null
}

/* ────────────────────────────────────────────────────────────
   Props
   ──────────────────────────────────────────────────────────── */
interface SeoServiceClientProps {
  pattern: SeoServicePattern
  canonicalVertical: string
  relatedPatterns: SeoServicePattern[]
  initialVendors: VendorResult[]
}

type SortOption = 'recommended' | 'price_low' | 'price_high' | 'rating' | 'most_reviewed' | 'newest'

/* ────────────────────────────────────────────────────────────
   Get dynamic filters for this vertical
   ──────────────────────────────────────────────────────────── */
function getDynamicFilters(verticalSlug: string): FilterGroup[] {
  const filters: FilterGroup[] = []
  if (subcategoryFilters.byCategory[verticalSlug]) {
    filters.push(...subcategoryFilters.byCategory[verticalSlug])
  }
  return filters
}

/* ────────────────────────────────────────────────────────────
   Universal filter groups (same as SeoDirectoryClient)
   ──────────────────────────────────────────────────────────── */
const UNIVERSAL_FILTERS: FilterGroup[] = [
  {
    key: 'price_tier',
    label: 'Price Tier',
    type: 'checkbox',
    options: [
      { value: '$', label: '$' },
      { value: '$$', label: '$$' },
      { value: '$$$', label: '$$$' },
      { value: '$$$$', label: '$$$$' },
    ],
  },
  {
    key: 'rating',
    label: 'Rating',
    type: 'checkbox',
    options: [
      { value: '4.5', label: '4.5+ stars' },
      { value: '4.0', label: '4.0+ stars' },
      { value: '3.5', label: '3.5+ stars' },
      { value: '3.0', label: '3.0+ stars' },
    ],
  },
  {
    key: 'availability',
    label: 'Availability',
    type: 'checkbox',
    options: [
      { value: 'open_now', label: 'Open now' },
      { value: 'instant_book', label: 'Instant Book only' },
    ],
  },
]

/* ────────────────────────────────────────────────────────────
   SEO Content Map - rich content per service category slug
   ──────────────────────────────────────────────────────────── */
interface SeoContentData {
  description: string[]
  whyChoose: string[]
  whatToLookFor: string[]
  faq: { question: string; answer: string }[]
}

const SEO_CONTENT_MAP: Record<string, SeoContentData> = {
  'event-planners-in': {
    description: [
      'Event planners are professional coordinators who manage every aspect of your event, from concept development and venue selection to vendor management and day-of coordination. Whether you\'re hosting a corporate gala, a milestone birthday, or a community festival, a skilled event planner transforms your vision into a seamless, memorable experience.',
      'Professional event planners bring industry connections, negotiation expertise, and creative problem-solving that saves you time and stress. They handle logistics, timelines, budgets, and unexpected challenges so you can focus on enjoying your event.',
      'On Planviry, you\'ll find verified event planners across the United States with real reviews, transparent pricing, and instant booking options. Compare top-rated professionals in your area and find the perfect match for your next event.',
    ],
    whyChoose: [
      'Verified professionals with real client reviews and ratings',
      'Transparent pricing with instant booking availability',
      'Access to exclusive vendor networks and venue partnerships',
      'Personalized proposals tailored to your budget and style',
      'Stress-free planning with dedicated project management',
    ],
    whatToLookFor: [
      'Strong portfolio of events similar to yours in scale and style',
      'Clear communication and responsiveness during the inquiry process',
      'Transparent pricing with detailed breakdowns - no hidden fees',
      'Professional certifications (CMP, CSEP) or industry affiliations',
      'Comprehensive contract outlining scope, deliverables, and cancellation terms',
      'Established vendor relationships that can save you money',
    ],
    faq: [
      { question: 'How much does an event planner cost?', answer: 'Event planner fees vary based on experience, event type, and location. Most planners charge either a flat fee ($1,500–$10,000+), an hourly rate ($75–$300/hr), or a percentage of the total event budget (10–20%). On Planviry, you can compare transparent pricing from multiple planners in your area.' },
      { question: 'What\'s the difference between full-service and day-of coordination?', answer: 'Full-service planning covers everything from concept to execution - venue selection, vendor booking, design, and day-of management. Day-of coordination (often called "month-of") focuses on managing the event timeline and vendors on the actual day, with limited pre-event involvement. Choose based on how much hands-on help you need.' },
      { question: 'How far in advance should I hire an event planner?', answer: 'For large events (weddings, corporate galas), book 6–12 months in advance. For smaller gatherings, 2–4 months is typically sufficient. Peak season planners fill up quickly, so earlier is always better. On Planviry, you can check real-time availability for any planner.' },
    ],
  },
  'venues-in': {
    description: [
      'Finding the right venue is the foundation of any successful event. From elegant ballrooms and rustic barns to modern lofts and outdoor gardens, the venue sets the tone for your entire celebration. Whether you\'re planning an intimate dinner for 20 or a conference for 2,000, the right space transforms an ordinary gathering into an extraordinary experience.',
      'Venue selection impacts every other decision - catering options, décor possibilities, guest capacity, and overall atmosphere. Professional venue managers guide you through capacity planning, layout design, vendor coordination, and logistics to ensure everything runs smoothly.',
      'Planviry connects you with thousands of verified venues across the United States. Browse real photos, compare pricing, check availability, and book your perfect space - all in one place.',
    ],
    whyChoose: [
      'Browse thousands of venues with real photos and virtual tours',
      'Compare pricing and capacity side-by-side',
      'Check real-time availability and book instantly',
      'Read verified reviews from actual event hosts',
      'Get personalized recommendations based on your event type and budget',
    ],
    whatToLookFor: [
      'Capacity that comfortably fits your guest count with room for dining, dancing, and activities',
      'In-house catering options or flexibility to bring your own caterer',
      'Amenities included in the rental: tables, chairs, AV equipment, parking',
      'Clear policies on setup/teardown times, noise restrictions, and curfews',
      'Accessibility features for guests with mobility needs',
      'Weather contingency plans for outdoor venues',
    ],
    faq: [
      { question: 'How much does it cost to rent a venue?', answer: 'Venue rental costs range widely: community halls may start at $200–$500, while luxury ballrooms and estates can run $5,000–$25,000+. Pricing depends on location, capacity, day of the week, and season. Most venues offer packages that include basic amenities. On Planviry, you can filter by budget to find options in your range.' },
      { question: 'What\'s typically included in a venue rental?', answer: 'Inclusions vary significantly. Some venues provide just the space; others offer full packages with tables, chairs, linens, AV equipment, and even catering. Always ask for a detailed list of what\'s included and what costs extra. Planviry listings clearly outline what each venue provides.' },
      { question: 'How far in advance should I book a venue?', answer: 'Popular venues during peak season (May–October, December) often book 9–18 months ahead. Off-season dates may only need 3–6 months. For weekday events, you\'ll have more flexibility. Early booking also usually locks in better rates.' },
    ],
  },
  'caterers-in': {
    description: [
      'Great food is the centerpiece of any memorable event. Professional caterers do more than prepare meals - they design culinary experiences that delight your guests, accommodate dietary needs, and complement your event\'s theme and atmosphere. From elegant plated dinners to casual food truck rallies, the right caterer elevates your celebration.',
      'Full-service catering includes menu planning, food preparation, professional service staff, tableware, and cleanup. Many caterers also offer bar service, dessert stations, and specialty options like live cooking stations or interactive food experiences.',
      'Planviry helps you discover top-rated caterers across the country with transparent pricing, sample menus, and verified reviews. Compare options, request proposals, and book the perfect culinary team for your event.',
    ],
    whyChoose: [
      'Access to vetted caterers with verified health department ratings',
      'Compare sample menus and pricing from multiple providers',
      'Read reviews from real event hosts about food quality and service',
      'Instant booking for caterers with confirmed availability',
      'Personalized menu proposals based on your event type and dietary needs',
    ],
    whatToLookFor: [
      'Tasting sessions before you commit - reputable caterers always offer this',
      'Flexibility to accommodate dietary restrictions (vegan, gluten-free, kosher, halal)',
      'Transparent per-person pricing with clear inclusions and extras',
      'Professional service staff included in the package',
      'Proper licensing, insurance, and health department certifications',
      'A diverse portfolio of events similar to yours in size and style',
    ],
    faq: [
      { question: 'How much does catering cost per person?', answer: 'Catering costs vary widely: buffet-style ranges from $15–$40 per person, plated dinners from $40–$150+, and food trucks from $10–$25 per person. Premium ingredients, complex menus, and full bar service increase costs. On Planviry, you can filter caterers by price range to match your budget.' },
      { question: 'Do caterers provide servers and bartenders?', answer: 'Most full-service caterers include serving staff in their packages, typically at a ratio of 1 server per 10–15 guests. Bartenders may be included or available at an additional cost. Always confirm staffing details and whether gratuity is included in the quote.' },
      { question: 'Can I request a tasting before booking?', answer: 'Yes - reputable caterers almost always offer tastings, either complimentary or for a nominal fee that\'s credited toward your final bill. A tasting lets you evaluate food quality, presentation, and flavor before committing. Planviry makes it easy to request tastings from multiple caterers.' },
    ],
  },
  'djs-parties-in': {
    description: [
      'A great DJ doesn\'t just play music - they read the room, build energy, and create moments that keep your guests on the dance floor all night. Whether you\'re planning a wedding reception, corporate party, milestone birthday, or community event, the right DJ sets the tone and keeps the celebration going.',
      'Professional DJs bring top-tier sound equipment, extensive music libraries spanning every genre and era, MC skills to guide your event\'s flow, and lighting packages that transform any space. Many also offer add-ons like fog machines, LED walls, and photo booth integration.',
      'On Planviry, browse verified DJs with real reviews, listen to sample mixes, compare pricing and packages, and book the perfect entertainer for your event - all in one place.',
    ],
    whyChoose: [
      'DJs verified for equipment quality, professionalism, and reliability',
      'Listen to sample mixes and watch performance videos before booking',
      'Transparent package pricing - no surprise fees on event day',
      'Instant booking with confirmed availability',
      'Read reviews about song selection, crowd reading, and energy levels',
    ],
    whatToLookFor: [
      'A diverse music library that spans your preferred genres and eras',
      'Professional-grade sound and lighting equipment (or rental partnerships)',
      'Strong MC skills for announcements, toasts, and event flow management',
      'Willingness to honor do-not-play lists and must-play songs',
      'Backup equipment and a contingency plan for technical issues',
      'Experience with events similar to yours in size and style',
    ],
    faq: [
      { question: 'How much does a DJ cost for a party?', answer: 'DJ pricing typically ranges from $500–$2,500 for a 4–6 hour event, with premium or specialty DJs charging $3,000+. Factors include event type, location, equipment needs, and date. Wedding DJs generally cost more than party DJs. On Planviry, you can compare packages and pricing from DJs in your area.' },
      { question: 'What equipment does a DJ typically provide?', answer: 'Most professional DJs bring their own sound system (speakers, mixer, controller), a microphone for announcements, and basic lighting. Premium packages may include uplighting, moving heads, fog machines, and LED video walls. Always confirm what\'s included versus what costs extra.' },
      { question: 'Can I give the DJ a specific playlist?', answer: 'Absolutely - most DJs encourage a "must-play" and "do-not-play" list. The best DJs use your preferences as a foundation and then read the crowd to keep energy high. Share your list 2–3 weeks before the event so your DJ can prepare and source any tracks they don\'t already have.' },
    ],
  },
  'photographers-in': {
    description: [
      'A skilled photographer preserves the moments, emotions, and details of your event for a lifetime. From candid laughter and heartfelt speeches to stunning venue shots and group portraits, professional photography transforms fleeting moments into lasting memories you\'ll treasure forever.',
      'Event photographers bring technical expertise, creative vision, and professional equipment to capture your celebration at its best. They understand lighting, composition, and timing - knowing exactly when to step in for the perfect shot and when to step back for authentic candid moments.',
      'Planviry connects you with verified photographers across the United States. Browse portfolios, compare packages, check availability, and book a professional who matches your style and budget.',
    ],
    whyChoose: [
      'Vetted photographers with professional portfolios and real client reviews',
      'Compare photography styles - photojournalistic, traditional, artistic, or editorial',
      'Transparent package pricing with clear deliverables and timelines',
      'Instant booking with confirmed date availability',
      'View full galleries from real events, not just highlight reels',
    ],
    whatToLookFor: [
      'A consistent portfolio that matches your preferred style and aesthetic',
      'Experience shooting events similar to yours in type and scale',
      'Clear package details: hours of coverage, number of edited photos, delivery timeline',
      'Backup equipment and a contingency plan (second shooter, emergency replacement)',
      'A written contract covering scope, deliverables, usage rights, and cancellation terms',
      'Strong communication and responsiveness during the booking process',
    ],
    faq: [
      { question: 'How much does event photography cost?', answer: 'Event photography ranges from $150–$500/hour or $500–$5,000+ for full-day coverage. Pricing depends on the photographer\'s experience, event duration, deliverables, and location. Wedding photography packages typically start around $2,000. On Planviry, filter by budget to find photographers in your range.' },
      { question: 'How many photos will I receive?', answer: 'Most photographers deliver 50–100 edited images per hour of coverage. A 6-hour event typically yields 300–600 finished photos. The exact number depends on the event type, number of guests, and the photographer\'s shooting style. Ask about their typical delivery volume during the inquiry.' },
      { question: 'How long until I receive my photos?', answer: 'Delivery timelines vary: most photographers return edited images within 2–6 weeks. Some offer rush delivery (48–72 hours) for an additional fee. Wedding photography typically takes 4–8 weeks due to the volume of images. Always confirm the delivery timeline in your contract.' },
    ],
  },
  'party-rentals-in': {
    description: [
      'Party rental companies provide everything you need to transform any space into the perfect event venue. From tables, chairs, and linens to tents, dance floors, and specialty décor, rental companies are the backbone of event production - providing the infrastructure that makes your celebration functional and beautiful.',
      'Professional rental companies deliver, set up, and pick up equipment, saving you countless hours of logistics. They also offer expert guidance on quantities, layouts, and product selection based on your guest count, venue, and event style.',
      'On Planviry, browse verified party rental providers with transparent pricing, inventory availability, and real customer reviews. Find everything you need for your event - from basic essentials to show-stopping specialty items.',
    ],
    whyChoose: [
      'One-stop shopping for all event rental needs - furniture, linens, tents, décor',
      'Verified suppliers with quality guarantees and reliable delivery',
      'Compare pricing and availability across multiple providers',
      'Expert recommendations on quantities and layouts for your event',
      'Setup and teardown services included with most packages',
    ],
    whatToLookFor: [
      'A comprehensive inventory that covers all your rental needs in one order',
      'Delivery, setup, and pickup included (or clearly priced) in the quote',
      'Quality guarantee - clean, well-maintained items delivered in excellent condition',
      'Flexible pickup and delivery windows that work with your venue schedule',
      'Replacement or backup items available in case of damage or defects',
      'Insurance options for high-value rentals',
    ],
    faq: [
      { question: 'What items can I rent for a party?', answer: 'Common rentals include tables, chairs, linens, tableware, tents, dance floors, staging, lighting, and sound equipment. Specialty items range from photo booths and popcorn machines to lounge furniture and LED dance floors. Most rental companies offer packages that bundle essentials together at a discount.' },
      { question: 'How much do party rentals typically cost?', answer: 'Basic rentals (tables, chairs, linens) typically run $5–$25 per item. Tents range from $200 for a small pop-up to $5,000+ for large pole tents. Specialty items like dance floors or photo booths run $500–$2,000+. Most hosts spend $500–$3,000 on rentals for a 100-person event.' },
      { question: 'How far in advance should I book party rentals?', answer: 'Book 4–8 weeks in advance for standard items and 8–16 weeks for specialty items or large tent orders during peak season (May–October). Popular items like specific linen colors or tent sizes sell out quickly on weekends. Early booking often secures better pricing and availability.' },
    ],
  },
  'makeup-artists-in': {
    description: [
      'A professional makeup artist enhances your natural beauty and creates a polished, camera-ready look that lasts throughout your event. Whether it\'s your wedding day, a milestone celebration, or a professional photo shoot, a skilled MUA brings expertise in color theory, skin preparation, and long-wear techniques that everyday makeup simply can\'t match.',
      'Professional makeup artists use premium products, sanitary application techniques, and specialized skills like airbrush, contouring, and lash application. They also understand how makeup translates on camera - ensuring you look flawless in both person and photographs.',
      'Planviry connects you with verified makeup artists across the United States. Browse portfolios, compare pricing, read real reviews, and book a beauty professional who matches your style and vision.',
    ],
    whyChoose: [
      'Vetted MUAs with professional portfolios showcasing diverse styles',
      'Transparent per-session pricing with clear service inclusions',
      'Read reviews about longevity, professionalism, and artistry',
      'Trial sessions available before your event date',
      'On-site service - they come to you on the big day',
    ],
    whatToLookFor: [
      'A portfolio that demonstrates versatility and consistency across different skin tones and face shapes',
      'Experience with your specific event type (bridal, editorial, special effects)',
      'Use of professional-grade, hygienic products with sanitary application practices',
      'Trial session availability before the event date',
      'On-location service with their own lighting and setup',
      'Clear pricing structure - per person, per look, or package rates',
    ],
    faq: [
      { question: 'How much does a makeup artist cost?', answer: 'Makeup artist pricing varies: bridal makeup typically ranges from $150–$600 per person, while party or special event makeup runs $75–$300. Group rates are often available. Airbrush application and false lash application may cost extra. On Planviry, compare pricing from MUAs in your area.' },
      { question: 'Should I do a makeup trial before my event?', answer: 'Absolutely - a trial is essential for events like weddings where photos are forever. Trials let you collaborate on your look, test product reactions, and ensure the artist understands your preferences. Most MUAs offer trials for a separate fee (often 50–75% of the event-day rate). Book your trial 1–2 months before the event.' },
      { question: 'How long does professional makeup application take?', answer: 'Allow 45–75 minutes per person for a full application, including skin prep. Bridal makeup with airbrush and lash application may take 60–90 minutes. For group bookings, most MUAs bring an assistant or allot 30–45 minutes per person to keep the timeline on track.' },
    ],
  },
  'limo-service-in': {
    description: [
      'Luxury transportation sets the tone for a special occasion from the moment you step out the door. Professional limo and chauffeur services provide more than a ride - they deliver a first-class experience with immaculate vehicles, trained chauffeurs, and seamless logistics that ensure you arrive in style and on time.',
      'From classic stretch limousines and SUVs to party buses and sprinter vans, professional transportation services offer a fleet of options for any group size and occasion. Many also provide airport transfers, corporate car service, and multi-stop event coordination.',
      'Planviry helps you find verified transportation providers with real reviews, transparent pricing, and instant booking. Compare fleets, check availability, and reserve the perfect ride for your event.',
    ],
    whyChoose: [
      'Verified providers with licensed, insured, and inspected vehicles',
      'Transparent hourly rates and package pricing',
      'Read reviews about punctuality, vehicle condition, and chauffeur professionalism',
      'Instant booking with confirmed availability for your date',
      'GPS-tracked vehicles and real-time status updates on event day',
    ],
    whatToLookFor: [
      'Proper licensing, insurance, and DOT compliance for commercial passenger transport',
      'A well-maintained fleet with recent-model vehicles and clean interiors',
      'Professional chauffeurs with background checks, training, and experience',
      'Transparent pricing structure - hourly minimums, gratuity policy, fuel surcharges',
      'Backup vehicle availability in case of mechanical issues',
      'Flexible pickup/drop-off arrangements and multi-stop coordination',
    ],
    faq: [
      { question: 'How much does a limo service cost?', answer: 'Limo rental rates typically range from $75–$200/hour for a standard stretch limo (6–10 passengers), $100–$300/hour for an SUV limo, and $150–$400/hour for a party bus. Most companies require a 3–4 hour minimum. On Planviry, compare rates from multiple providers in your area.' },
      { question: 'How many people fit in a limo?', answer: 'Sedan limos seat 3–4 passengers, stretch limos accommodate 6–10, SUV limos fit 14–20, and party buses hold 20–40+ guests. For groups over 10, an SUV limo or party bus is usually more comfortable. Always confirm the actual passenger capacity - it\'s often less than the maximum rating.' },
      { question: 'Is gratuity included in the price?', answer: 'Some companies include a 15–20% gratuity in their quoted rate; others add it as a separate line item. Always ask whether gratuity is included to avoid double-tipping. It\'s also customary to tip extra for exceptional service - typically $20–$50 for the chauffeur.' },
    ],
  },
}

/* ────────────────────────────────────────────────────────────
   Collapsible filter section - accordion approach
   ──────────────────────────────────────────────────────────── */
function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-150 pb-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest">{title}</span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>
      {open && <div className="mt-1 space-y-1.5">{children}</div>}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Vendor Card - Yelp-style horizontal card (same as SeoDirectoryClient)
   ──────────────────────────────────────────────────────────── */
function VendorCard({ vendor, rank }: { vendor: VendorResult; rank: number }) {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-900 hover:shadow-[0_5px_15px_rgba(0,0,0,0.06)] transition-all">
      {/* Image */}
      <div className="w-full sm:w-56 h-48 sm:h-auto overflow-hidden relative shrink-0 bg-gray-100 border-r border-gray-100">
        {vendor.cover_url ? (
          <img src={vendor.cover_url} alt={vendor.business_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 min-h-[120px]">
            <span className="text-3xl font-black text-gray-300">{vendor.business_name.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div className="space-y-2">
          <h3 className="font-extrabold text-base text-gray-900 tracking-tight truncate leading-tight">
            <Link href={`/v/${vendor.slug}`} className="hover:underline">{rank}. {vendor.business_name}</Link>
          </h3>
          <div className="flex items-center gap-1 text-xs">
            <div className="flex text-orange-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(vendor.avg_rating ?? 0) ? 'text-orange-400 fill-orange-400' : 'text-gray-300 fill-transparent'}`} />
              ))}
            </div>
            <span className="font-black text-gray-900">{vendor.avg_rating?.toFixed(1) ?? '-'}</span>
            <span className="text-gray-400">({vendor.review_count ?? 0} reviews)</span>
          </div>
          <div className="text-[11px] font-bold text-gray-500 flex flex-wrap items-center gap-1.5">
            {vendor.category && (<><span className="text-gray-900">{vendor.category}</span><span>&middot;</span></>)}
            {vendor.address && (<><span className="text-gray-900">{vendor.address}</span><span>&middot;</span></>)}
            {vendor.neighborhood && (<span className="bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-md font-semibold text-[10.5px]">{vendor.neighborhood}</span>)}
          </div>
          {vendor.bio && (
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700 italic flex items-start gap-2.5 leading-relaxed font-semibold">
              &ldquo;{vendor.bio.length > 140 ? vendor.bio.slice(0, 140) + '...' : vendor.bio}&rdquo;
              <Link href={`/v/${vendor.slug}`} className="text-teal-600 hover:underline font-extrabold not-italic shrink-0">more</Link>
            </div>
          )}
          {vendor.is_verified && (
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="bg-gray-100 text-gray-700 text-[9.5px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">✓ Verified</span>
              {vendor.instant_booking && (<span className="bg-gray-100 text-gray-700 text-[9.5px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">✓ Instant Book</span>)}
              {vendor.is_featured && (<span className="bg-gray-100 text-gray-700 text-[9.5px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">★ Featured</span>)}
            </div>
          )}
        </div>
        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <Link href={`/v/${vendor.slug}`} className="text-xs font-black text-black hover:text-teal-600 tracking-wider uppercase flex items-center gap-1 group/link">
            View Profile <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform text-teal-600" />
          </Link>
          {vendor.instant_booking && (
            <Link href={`/v/${vendor.slug}`} className="bg-black hover:bg-teal-600 text-white text-xs font-black px-5 py-2 rounded-xl transition-all uppercase tracking-wider">Get Proposal</Link>
          )}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Empty State
   ──────────────────────────────────────────────────────────── */
function EmptyState({ hasFilters, title }: { hasFilters: boolean; title: string }) {
  return (
    <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
      <Building2 size={40} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-base font-black text-black mb-1">
        {hasFilters ? 'No vendors match your filters' : `No ${title} providers listed yet`}
      </h3>
      <p className="text-xs text-gray-500 max-w-sm mx-auto">
        {hasFilters ? 'Try adjusting your filters to see more results.' : 'Be the first to list your business in this category.'}
      </p>
      {!hasFilters && (
        <Link href="/vendor/onboarding" className="mt-5 inline-flex items-center gap-2 text-xs bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors uppercase tracking-widest">
          Get Listed Free
        </Link>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   FAQ Item
   ──────────────────────────────────────────────────────────── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="font-bold text-sm text-gray-900 group-hover:text-teal-600 transition-colors pr-4">{question}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────── */
export function SeoServiceClient({
  pattern,
  canonicalVertical,
  relatedPatterns,
  initialVendors,
}: SeoServiceClientProps) {
  const [vendors, setVendors] = useState<VendorResult[]>(initialVendors)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)

  // ── Location input state ──
  const [locationInput, setLocationInput] = useState('')
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [locationDisplayName, setLocationDisplayName] = useState('')
  const locationInputRef = useRef<HTMLInputElement>(null)
  const locationSuggestionsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const dynamicFilters = useMemo(() => getDynamicFilters(canonicalVertical), [canonicalVertical])
  const seoContent = SEO_CONTENT_MAP[pattern.slug] ?? null

  const totalActiveCount = Object.values(activeFilters).reduce((sum, vals) => sum + vals.length, 0)

  // ── Location autocomplete (useMemo to avoid cascading renders) ──
  const locationSuggestions = useMemo(() => {
    if (!locationInput.trim()) return []
    const q = locationInput.toLowerCase().trim()
    return SEO_LOCATIONS.filter(
      (loc) =>
        loc.city.toLowerCase().startsWith(q) ||
        loc.displayName.toLowerCase().includes(q)
    ).slice(0, 10)
  }, [locationInput])

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        locationSuggestionsRef.current &&
        !locationSuggestionsRef.current.contains(e.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(e.target as Node)
      ) {
        setShowLocationSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectLocation = (loc: SeoLocation) => {
    setLocationDisplayName(loc.displayName)
    setLocationInput('')
    setShowLocationSuggestions(false)
    // Navigate to this service pattern + selected location
    router.push(`/seo/${pattern.slug}/${loc.slug}`)
  }

  const clearLocation = () => {
    setLocationDisplayName('')
    setLocationInput('')
  }

  const handleNearMe = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        let closest = SEO_LOCATIONS[0]
        let minDist = Infinity
        for (const loc of SEO_LOCATIONS) {
          const d = Math.sqrt((loc.lat - latitude) ** 2 + (loc.lng - longitude) ** 2)
          if (d < minDist) {
            minDist = d
            closest = loc
          }
        }
        if (closest) selectLocation(closest)
      },
      () => { /* User denied geolocation - do nothing */ }
    )
  }

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[key] ?? []
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      if (next.length === 0) { const { [key]: _, ...rest } = prev; return rest }
      return { ...prev, [key]: next }
    })
  }

  const clearFilters = () => {
    setActiveFilters({})
    setPriceMin('')
    setPriceMax('')
    setVisibleCount(12)
  }

  // Re-fetch vendors when search/filters change
  useEffect(() => {
    async function fetchFiltered() {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('q', searchQuery || pattern.name)
        params.set('vertical', canonicalVertical)
        params.set('limit', '50')
        if (Object.keys(activeFilters).length > 0) {
          params.set('filters', JSON.stringify(activeFilters))
        }
        const res = await fetch(`/api/vendors?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setVendors(data.vendors ?? [])
        }
      } catch {
        // keep existing vendors
      } finally {
        setIsLoading(false)
      }
    }
    // Debounce search
    const timer = setTimeout(fetchFiltered, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, activeFilters, canonicalVertical, pattern.name])

  const filteredAndSortedVendors = useMemo(() => {
    let result = [...vendors]

    // Client-side filtering
    if (activeFilters.instant_book?.includes('instant_book') || activeFilters.availability?.includes('instant_book')) {
      result = result.filter(v => v.instant_booking)
    }
    if (activeFilters.price_tier?.length) {
      result = result.filter(v => v.price_range ? activeFilters.price_tier!.some(tier => v.price_range!.includes(tier)) : false)
    }
    if (priceMin) {
      const min = Number(priceMin)
      if (!isNaN(min)) result = result.filter(v => (v.price_starting_at ?? 0) >= min)
    }
    if (priceMax) {
      const max = Number(priceMax)
      if (!isNaN(max)) result = result.filter(v => (v.price_starting_at ?? Infinity) <= max)
    }
    if (activeFilters.rating?.length) {
      const minRating = Math.min(...activeFilters.rating.map(Number))
      result = result.filter(v => (v.avg_rating ?? 0) >= minRating)
    }

    // Sort
    switch (sortBy) {
      case 'rating': result.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0)); break
      case 'price_low': result.sort((a, b) => (a.price_starting_at ?? Infinity) - (b.price_starting_at ?? Infinity)); break
      case 'price_high': result.sort((a, b) => (b.price_starting_at ?? 0) - (a.price_starting_at ?? 0)); break
      case 'most_reviewed': result.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0)); break
      case 'newest': result.sort((a, b) => (b.vendor_id > a.vendor_id ? 1 : -1)); break
      default: result.sort((a, b) => { if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1; return (b.avg_rating ?? 0) - (a.avg_rating ?? 0) }); break
    }
    return result
  }, [vendors, sortBy, activeFilters, priceMin, priceMax])

  const displayedVendors = filteredAndSortedVendors.slice(0, visibleCount)
  const hasMore = filteredAndSortedVendors.length > visibleCount

  // Build page title parts
  const serviceLabel = pattern.name.replace(/\s+(In|Near|By)$/, '').trim()
  const categoryLabel = getCategoryLabel(canonicalVertical)

  // Top cities data
  const primaryCities = SEO_LOCATIONS.filter(l => l.primary)

  /* ── Render filter sections (shared between desktop & mobile) ── */
  const renderFilterSections = () => (
    <>
      {/* Price Range */}
      <FilterSection key="price_range" title="Price Range" defaultOpen={true}>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">$</span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              className="w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black"
            />
          </div>
          <span className="text-xs text-gray-400">–</span>
          <div className="flex-1 relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">$</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              className="w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </FilterSection>

      {/* Universal Filters - start collapsed */}
      {UNIVERSAL_FILTERS.map((filter) => (
        <FilterSection key={filter.key} title={filter.label} defaultOpen={false}>
          <div className="space-y-1.5">
            {filter.options.map((opt) => {
              const checked = (activeFilters[filter.key] ?? []).includes(opt.value)
              return (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleFilter(filter.key, opt.value)}
                    className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                  <span className="text-xs text-gray-600 group-hover:text-black transition-colors font-medium">{opt.label}</span>
                </label>
              )
            })}
          </div>
        </FilterSection>
      ))}

      {/* Dynamic Category Filters */}
      {dynamicFilters.length > 0 && (
        <div className="border-t border-gray-200 pt-2 mt-1">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
            {serviceLabel} Filters
          </h3>
          {dynamicFilters.slice(0, 5).map((filter) => (
            <FilterSection key={filter.key} title={filter.label} defaultOpen={false}>
              <div className="space-y-1.5">
                {filter.options.slice(0, 8).map((opt) => {
                  const checked = (activeFilters[filter.key] ?? []).includes(opt.value)
                  return (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleFilter(filter.key, opt.value)}
                        className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                      />
                      <span className="text-xs text-gray-600 group-hover:text-black transition-colors font-medium">{opt.label}</span>
                    </label>
                  )
                })}
              </div>
            </FilterSection>
          ))}
        </div>
      )}
    </>
  )

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
              <Home size={13} />
              <span>Home</span>
            </Link>
            <ChevronRight size={13} className="text-gray-400" />
            <span className="text-black font-medium">{serviceLabel}</span>
          </nav>
        </div>
      </div>

      {/* Search bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <SeoSearchBar initialService={serviceLabel} />
      </div>

      {/* Main layout: sidebar + content */}
      <div className="w-full py-6 flex flex-col lg:flex-row gap-6">

        {/* ══════ SIDEBAR - sticky, accordion-based ══════ */}
        <aside className="w-full lg:w-72 shrink-0 space-y-3 lg:sticky lg:top-20 lg:self-start px-4 sm:px-6 lg:pr-0">

          {/* ── Location Input (TOP of sidebar) ── */}
          {locationDisplayName ? (
            <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl px-3 py-2.5">
              <MapPin className="w-4 h-4 shrink-0 text-teal-600" />
              <span className="text-sm font-semibold truncate flex-1">{locationDisplayName}</span>
              <button onClick={clearLocation} className="text-teal-500 hover:text-teal-800 shrink-0" aria-label="Clear location">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <input
                ref={locationInputRef}
                type="text"
                value={locationInput}
                onChange={(e) => { setLocationInput(e.target.value); setShowLocationSuggestions(true) }}
                onFocus={() => setShowLocationSuggestions(true)}
                placeholder="Set your city..."
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button
                onClick={handleNearMe}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1"
                aria-label="Use my location"
                title="Near me"
              >
                <Navigation className="w-4 h-4" />
              </button>
              {/* Autocomplete dropdown */}
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div ref={locationSuggestionsRef} className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {locationSuggestions.map((loc) => (
                    <button
                      key={loc.slug}
                      onClick={() => selectLocation(loc)}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-900">{loc.city}</span>
                      <span className="text-gray-400">,</span>
                      <span className="text-gray-500">{loc.state}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search bar in sidebar */}
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${serviceLabel.toLowerCase()}...`}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Filters header */}
          <div className="flex items-center justify-between border-b pb-2 border-gray-200">
            <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" /> Filters
            </h3>
            {totalActiveCount > 0 && (
              <button onClick={clearFilters} className="text-[10px] text-red-500 hover:underline font-extrabold uppercase tracking-widest">
                Clear All
              </button>
            )}
          </div>

          {/* Active filter badges */}
          {totalActiveCount > 0 && (
            <div className="flex flex-wrap gap-1.5 pb-1">
              {Object.entries(activeFilters).map(([key, values]) =>
                values.map((val) => (
                  <Badge key={`${key}-${val}`} variant="secondary" className="text-xs gap-1 pr-1 cursor-pointer hover:bg-gray-200" onClick={() => toggleFilter(key, val)}>
                    {val} <X className="w-3 h-3" />
                  </Badge>
                ))
              )}
            </div>
          )}

          {renderFilterSections()}

          {/* Top Cities quick links */}
          <div className="border-t border-gray-200 pt-2 mt-1">
            <h3 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Top Cities
            </h3>
            <div className="space-y-0.5 max-h-60 overflow-y-auto">
              {primaryCities.slice(0, 20).map(loc => (
                <Link
                  key={loc.slug}
                  href={`/seo/${pattern.slug}/${loc.slug}`}
                  className="group flex items-center justify-between px-2 py-1.5 text-xs text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-colors"
                >
                  <span className="truncate">{loc.displayName}</span>
                  <ChevronRight size={10} className="text-gray-300 group-hover:text-black shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* CTA for vendors */}
          <div className="rounded-xl bg-black text-white p-5 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Own a business?</p>
            <p className="text-sm font-semibold">List as {serviceLabel}</p>
            <Link href="/vendor/onboarding" className="inline-block mt-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-100 transition-colors">
              Get Listed Free
            </Link>
          </div>
        </aside>

        {/* ══════ MAIN CONTENT ══════ */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 lg:pl-0">
          {/* Headline */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">
              {serviceLabel}
            </h1>
            <p className="mt-2 text-sm text-gray-500 max-w-2xl">
              Browse verified {serviceLabel.toLowerCase()} providers across the United States on Planviry. Compare ratings, prices, and availability.
            </p>
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {/* Mobile filter sheet */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden gap-1.5">
                    <Filter className="w-4 h-4" />
                    Filters
                    {totalActiveCount > 0 && (<Badge className="ml-1 bg-black text-white text-[10px] h-5 w-5 p-0 flex items-center justify-center rounded-full">{totalActiveCount}</Badge>)}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader><SheetTitle className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" />Filters</SheetTitle></SheetHeader>
                  <div className="px-4 pb-6">
                    {/* Mobile location input */}
                    {locationDisplayName ? (
                      <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl px-3 py-2.5 mb-4">
                        <MapPin className="w-4 h-4 shrink-0 text-teal-600" />
                        <span className="text-sm font-semibold truncate flex-1">{locationDisplayName}</span>
                        <button onClick={clearLocation} className="text-teal-500 hover:text-teal-800 shrink-0" aria-label="Clear location">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative mb-4">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                        <input
                          ref={locationInputRef}
                          type="text"
                          value={locationInput}
                          onChange={(e) => { setLocationInput(e.target.value); setShowLocationSuggestions(true) }}
                          onFocus={() => setShowLocationSuggestions(true)}
                          placeholder="Set your city..."
                          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                        />
                        <button onClick={handleNearMe} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1" aria-label="Use my location" title="Near me">
                          <Navigation className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="mb-4">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${serviceLabel}...`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    {renderFilterSections()}
                  </div>
                </SheetContent>
              </Sheet>
              <span className="text-sm text-gray-500">
                {isLoading ? 'Searching...' : `${filteredAndSortedVendors.length} result${filteredAndSortedVendors.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[170px] h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price_low">Price: Low–High</SelectItem>
                  <SelectItem value="price_high">Price: High–Low</SelectItem>
                  <SelectItem value="rating">Rating: Highest</SelectItem>
                  <SelectItem value="most_reviewed">Most Reviewed</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vendor cards */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col sm:flex-row bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                  <div className="w-full sm:w-56 h-48 bg-gray-200" />
                  <div className="flex-1 p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedVendors.length > 0 ? (
            <div className="space-y-5">
              {displayedVendors.map((vendor, idx) => (
                <VendorCard key={vendor.vendor_id} vendor={vendor} rank={idx + 1} />
              ))}
            </div>
          ) : (
            <EmptyState hasFilters={totalActiveCount > 0} title={serviceLabel} />
          )}

          {/* Show More */}
          {!isLoading && hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="px-8"
              >
                Show More Vendors
              </Button>
            </div>
          )}

          {/* ── Rich SEO Content Section ── */}
          {seoContent && (
            <div className="mt-12 pt-8 border-t border-gray-200 space-y-10">
              {/* What is {service}? */}
              <section>
                <h2 className="text-xl font-black text-black mb-4">
                  What Are {serviceLabel}?
                </h2>
                <div className="space-y-4 text-sm text-gray-600 leading-relaxed max-w-3xl">
                  {seoContent.description.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Why Choose Planviry */}
              <section>
                <h2 className="text-xl font-black text-black mb-4">
                  Why Use Planviry for {serviceLabel}
                </h2>
                <ul className="space-y-3 max-w-3xl">
                  {seoContent.whyChoose.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* What to Look For */}
              <section>
                <h2 className="text-xl font-black text-black mb-4">
                  What to Look for in a {serviceLabel} Provider
                </h2>
                <ul className="space-y-3 max-w-3xl">
                  {seoContent.whatToLookFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold text-gray-400">{idx + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {/* Top Cities for this service */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4">
              Top Cities for {serviceLabel}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {primaryCities.slice(0, 16).map(loc => (
                <Link
                  key={loc.slug}
                  href={`/seo/${pattern.slug}/${loc.slug}`}
                  className="block p-3 border border-gray-200 rounded-xl hover:border-black hover:shadow-sm transition-all group"
                >
                  <span className="font-semibold text-sm text-gray-900 group-hover:text-teal-600 transition-colors">{loc.displayName}</span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">{serviceLabel}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Browse by state */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4">
              Browse by State
            </h2>
            <div className="flex flex-wrap gap-2">
              {SEO_STATES.map(st => {
                const firstCity = SEO_LOCATIONS.find(l => l.state === st.abbr)
                return (
                  <Link
                    key={st.slug}
                    href={firstCity ? `/seo/${pattern.slug}/${firstCity.slug}` : `/seo/${pattern.slug}`}
                    className="px-3 py-1.5 rounded-full border border-gray-200 hover:border-black hover:text-black transition-colors text-xs text-gray-600"
                  >
                    {st.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Related Searches */}
          {relatedPatterns.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4">
                Related Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedPatterns.map(rp => (
                  <Link
                    key={rp.slug}
                    href={`/seo/${rp.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 hover:border-black hover:text-black transition-colors text-sm font-medium text-gray-600"
                  >
                    {rp.name.replace(/\s+(In|Near|By)\s*$/i, '')}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {seoContent && seoContent.faq.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-400" /> Frequently Asked Questions
              </h2>
              <div className="max-w-3xl">
                {seoContent.faq.map((item, idx) => (
                  <FaqItem key={idx} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          )}

          {/* Browse All + Get Listed Free CTAs */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-wrap gap-3">
            <Link
              href={buildCategoryUrl(canonicalVertical)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors text-sm uppercase tracking-wider"
            >
              Browse All {categoryLabel}
            </Link>
            <Link
              href="/vendor/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 hover:border-black hover:text-black transition-colors font-bold text-sm text-gray-600"
            >
              Get Listed Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
