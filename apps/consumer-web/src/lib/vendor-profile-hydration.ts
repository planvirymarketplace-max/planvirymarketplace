/**
 * Planviry - Vendor Profile Hydration
 *
 * Converts raw Supabase vendor data into a HydratedVendorProfile
 * for the full vendor profile page. Falls back to seeded demo data
 * when Supabase tables are empty or not configured.
 */

import type {
  HydratedVendorProfile,
  PortfolioImage,
  VendorPackage,
  VendorAddon,
  VendorReview,
  TeamMember,
  BusinessHour,
  MenuItem,
  VendorFAQ,
  Amenity,
} from './vendor-profile-types'

// ─── Deterministic seeded data helpers ──────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// ─── Seed data generators ──────────────────────────────────────────────────

const TAGLINES: Record<string, string[]> = {
  'photography': ['Capturing Moments That Last Forever', 'Your Story, Our Lens', 'Timeless Photography for Every Occasion'],
  'catering': ['Exceptional Flavors for Every Event', 'From Kitchen to Celebration', 'Catering That Leaves an Impression'],
  'wedding_venue': ['Where Dreams Come Alive', 'Your Perfect Day, Our Perfect Space', 'Elegant Spaces for Unforgettable Events'],
  'wedding_dj': ['Setting the Soundtrack to Your Celebration', 'Music That Moves You', 'Beats for Every Milestone'],
  'florist': ['Blooms That Tell Your Story', 'Artistry in Every Petal', 'Flowers as Unique as Your Event'],
  'default': ['Making Every Event Unforgettable', 'Professional Services You Can Trust', 'Elevating Events Since Day One'],
}

const DEFAULT_PORTFOLIO_IMAGES: PortfolioImage[] = [
  { id: 'p1', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800', caption: 'Grand ballroom setup', category: 'venue' },
  { id: 'p2', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800', caption: 'Elegant table arrangement', category: 'reception' },
  { id: 'p3', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', caption: 'Ceremony highlights', category: 'ceremony' },
  { id: 'p4', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800', caption: 'Event production', category: 'event' },
  { id: 'p5', url: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&q=80&w=800', caption: 'Social gathering', category: 'social' },
  { id: 'p6', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800', caption: 'Portrait session', category: 'portrait' },
]

const DEFAULT_PACKAGES: VendorPackage[] = [
  {
    id: 'pkg-basic',
    tierName: 'Essential',
    basePrice: 500,
    description: 'Core coverage for your event - reliable, professional service.',
    features: ['Up to 4 hours of service', 'Basic setup & breakdown', 'Professional staff', 'Standard equipment'],
    isActive: true,
  },
  {
    id: 'pkg-premium',
    tierName: 'Premium',
    basePrice: 1200,
    description: 'Enhanced service with premium add-ons and extended coverage.',
    features: ['Up to 8 hours of service', 'Premium setup & styling', 'Dedicated coordinator', 'Premium equipment', 'Next-day highlights'],
    isActive: true,
    isPopular: true,
  },
  {
    id: 'pkg-elite',
    tierName: 'Elite',
    basePrice: 2500,
    description: 'The full experience - white-glove service from start to finish.',
    features: ['Unlimited hours', 'Custom design consultation', 'VIP coordination', 'Concierge service', 'Complimentary add-ons', 'Priority scheduling'],
    isActive: true,
  },
]

const DEFAULT_ADDONS: VendorAddon[] = [
  { id: 'ao-1', name: 'Extended Hours', price: 150, description: 'Each additional hour beyond package', category: 'time' },
  { id: 'ao-2', name: 'Rush Delivery', price: 75, description: 'Same-week turnaround on deliverables', category: 'service' },
  { id: 'ao-3', name: 'Premium Setup', price: 200, description: 'Enhanced styling and decor arrangement', category: 'setup' },
  { id: 'ao-4', name: 'Extra Staff', price: 100, description: 'Additional team member for the event', category: 'staff' },
  { id: 'ao-5', name: 'Travel Outside Area', price: 125, description: 'Service outside standard service radius', category: 'travel' },
]

const DEFAULT_REVIEWS: VendorReview[] = [
  {
    id: 'r1',
    author: 'Hannah L.',
    rating: 5,
    text: 'Absolutely spectacular. Highly communicative from first contact to cleanup.',
    date: '3 weeks ago',
    helpfulCount: 8,
    photos: [],
    reply: 'Thank you Hannah! We loved coordinating your celebration.',
    isApproved: true,
  },
  {
    id: 'r2',
    author: 'Robert M.',
    rating: 4,
    text: 'Very professional. Set up everything exactly as we modeled on the floor plan.',
    date: '1 month ago',
    helpfulCount: 3,
    isApproved: true,
  },
  {
    id: 'r3',
    author: 'Jennifer K.',
    rating: 5,
    text: 'Exceeded all expectations. Would book again without hesitation.',
    date: '2 months ago',
    helpfulCount: 12,
    reply: 'Jennifer, your kind words mean the world to us!',
    isApproved: true,
  },
]

const DEFAULT_TEAM: TeamMember[] = [
  { id: 't1', name: 'Alex Rivera', role: 'Lead Coordinator', bio: '10+ years in event management' },
  { id: 't2', name: 'Sam Chen', role: 'Creative Director', bio: 'Specialist in themed events' },
  { id: 't3', name: 'Jordan Blake', role: 'Operations Manager', bio: 'Logistics expert' },
]

const DEFAULT_BUSINESS_HOURS: BusinessHour[] = [
  { day: 'Mon', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Tue', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Wed', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Thu', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Fri', open: '09:00', close: '20:00', isClosed: false },
  { day: 'Sat', open: '10:00', close: '16:00', isClosed: false },
  { day: 'Sun', open: '00:00', close: '00:00', isClosed: true },
]

const DEFAULT_FAQ: VendorFAQ[] = [
  { id: 'faq1', question: 'What is your cancellation policy?', answer: 'Full refund if cancelled 30+ days before the event. 50% refund for 14-29 days. No refund within 14 days.' },
  { id: 'faq2', question: 'Do you offer consultations?', answer: 'Yes! We offer a complimentary 30-minute consultation for all prospective clients.' },
  { id: 'faq3', question: 'What areas do you serve?', answer: 'We serve the greater metro area and surrounding counties. Travel fees may apply for locations over 50 miles.' },
  { id: 'faq4', question: 'How far in advance should I book?', answer: 'We recommend booking at least 3-6 months in advance for peak season (Oct-Dec) and 1-2 months for off-peak.' },
]

const DEFAULT_AMENITIES: Amenity[] = [
  { id: 'am1', name: 'On-Site Parking', category: 'Accessibility' },
  { id: 'am2', name: 'WiFi', category: 'Technology' },
  { id: 'am3', name: 'Climate Control', category: 'Comfort' },
  { id: 'am4', name: 'Wheelchair Accessible', category: 'Accessibility' },
  { id: 'am5', name: 'Bridal Suite', category: 'Premium' },
  { id: 'am6', name: 'Outdoor Space', category: 'Venue' },
  { id: 'am7', name: 'Kitchen Access', category: 'Catering' },
  { id: 'am8', name: 'Sound System', category: 'Technology' },
]

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 'mi1', name: 'Signature Platter', description: 'Chef-curated selection of seasonal appetizers', price: 35, category: 'Appetizers', isPopular: true },
  { id: 'mi2', name: 'Prime Entree', description: 'Choice of grilled chicken, salmon, or vegetarian option', price: 55, category: 'Entrees', isPopular: true },
  { id: 'mi3', name: 'Artisan Dessert Bar', description: 'Assorted mini desserts and chocolate fountain', price: 25, category: 'Desserts' },
  { id: 'mi4', name: 'Craft Cocktail Package', description: '3-hour premium open bar with mixologist', price: 45, category: 'Beverages', dietary: ['21+'] },
]

// ─── Category-specific taglines ────────────────────────────────────────────

function getTagline(category: string, name: string): string {
  const catKey = Object.keys(TAGLINES).find(k => category.toLowerCase().includes(k))
  const pool = catKey ? TAGLINES[catKey] : TAGLINES['default']
  const idx = hashString(name) % pool.length
  return pool[idx]
}

// ─── Main hydration function ───────────────────────────────────────────────

export function hydrateVendorProfile(
  raw: {
    id: string
    slug: string
    name: string
    bio?: string | null
    category?: string
    categoryName?: string
    address?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    lat?: number | null
    lng?: number | null
    serviceRadiusMiles?: number
    phone?: string | null
    email?: string | null
    website?: string | null
    imageUrl?: string | null
    coverUrl?: string | null
    logoUrl?: string | null
    isClaimed?: boolean
    isPublished?: boolean
    isFeatured?: boolean
    isVerified?: boolean
    rating?: number
    reviewCount?: number
    priceRange?: string | null
    serviceAreas?: string[]
    tags?: string[]
    socials?: { platform: string; url: string }[]
    gallery?: { id: string; storagePath: string; caption: string | null }[]
  },
  opts?: {
    packages?: VendorPackage[]
    reviews?: VendorReview[]
    portfolio?: PortfolioImage[]
  }
): HydratedVendorProfile {
  const rng = seededRandom(hashString(raw.name))
  const foundedYear = 2010 + Math.floor(rng() * 12)

  // Build portfolio from gallery if available, else use defaults
  const portfolio: PortfolioImage[] = raw.gallery && raw.gallery.length > 0
    ? raw.gallery.map((img, i) => ({
        id: img.id,
        url: img.storagePath,
        caption: img.caption || `${raw.name} portfolio image ${i + 1}`,
        category: DEFAULT_PORTFOLIO_IMAGES[i % DEFAULT_PORTFOLIO_IMAGES.length].category,
      }))
    : DEFAULT_PORTFOLIO_IMAGES.map(img => ({ ...img }))

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    tagline: getTagline(raw.category || '', raw.name),
    about: raw.bio || `${raw.name} is a professional ${raw.categoryName || 'event service'} provider serving the local community. With years of experience and a commitment to excellence, they deliver outstanding results for every event.`,
    category: raw.category || '',
    categoryName: raw.categoryName || raw.category?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Event Service',

    address: raw.address || null,
    city: raw.city || null,
    state: raw.state || null,
    zip: raw.zip || null,
    lat: raw.lat ?? null,
    lng: raw.lng ?? null,
    serviceRadiusMiles: raw.serviceRadiusMiles ?? 25,
    phone: raw.phone || null,
    email: raw.email || null,
    website: raw.website || null,

    imageUrl: raw.coverUrl || raw.imageUrl || null,
    logoUrl: raw.logoUrl || null,

    socials: raw.socials || [],

    isClaimed: raw.isClaimed ?? false,
    isPublished: raw.isPublished ?? false,
    isFeatured: raw.isFeatured ?? false,
    isVerified: raw.isVerified ?? false,
    instant: Math.floor(rng() * 3) === 0, // ~33% chance of instant book

    rating: raw.rating ?? (4 + rng()),
    reviews: raw.reviewCount ?? (5 + Math.floor(rng() * 50)),
    completedBookings: 10 + Math.floor(rng() * 150),
    foundedYear,
    avgResponseTimeMinutes: 15 + Math.floor(rng() * 120),

    portfolio,
    packages: opts?.packages || DEFAULT_PACKAGES,
    addons: DEFAULT_ADDONS,
    vendorReviews: opts?.reviews || DEFAULT_REVIEWS,
    team: DEFAULT_TEAM,
    businessHours: DEFAULT_BUSINESS_HOURS,
    menuItems: DEFAULT_MENU_ITEMS,
    faq: DEFAULT_FAQ,
    amenities: DEFAULT_AMENITIES,
    serviceAreas: raw.serviceAreas || [],
    tags: raw.tags || [],

    depositPct: 25,
    priceRange: raw.priceRange || null,
  }
}
