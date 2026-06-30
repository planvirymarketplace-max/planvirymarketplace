/**
 * Planviry - Rich Vendor Profile Types
 *
 * Extended types for the full vendor profile page with packages,
 * portfolio, reviews, team, FAQ, menu, and booking data.
 */

// ─── Portfolio ──────────────────────────────────────────────────────────────

export interface PortfolioImage {
  id: string
  url: string
  caption: string
  category: 'all' | 'ceremony' | 'reception' | 'social' | 'event' | 'venue' | 'portrait'
  mediaType?: 'image' | 'video'
}

// ─── Packages ──────────────────────────────────────────────────────────────

export interface VendorPackage {
  id: string
  tierName: string
  basePrice: number
  description: string
  features: string[]
  duration?: string
  capacity?: string
  isActive: boolean
  isPopular?: boolean
}

// ─── Add-ons ───────────────────────────────────────────────────────────────

export interface VendorAddon {
  id: string
  name: string
  price: number
  description: string
  category?: string
}

// ─── Reviews ───────────────────────────────────────────────────────────────

export interface VendorReview {
  id: string
  author: string
  rating: number
  text: string
  date: string
  photos?: string[]
  reply?: string
  helpfulCount: number
  hasLikedHelpful?: boolean
  isApproved: boolean
}

// ─── Team ──────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string
  name: string
  role: string
  avatarUrl?: string
  bio?: string
}

// ─── Business Hours ────────────────────────────────────────────────────────

export interface BusinessHour {
  day: string
  open: string
  close: string
  isClosed: boolean
}

// ─── Menu Items (for catering vendors) ─────────────────────────────────────

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  dietary?: string[]
  isPopular?: boolean
}

// ─── FAQ ───────────────────────────────────────────────────────────────────

export interface VendorFAQ {
  id: string
  question: string
  answer: string
}

// ─── Amenities ─────────────────────────────────────────────────────────────

export interface Amenity {
  id: string
  name: string
  category?: string
}

// ─── Full Hydrated Vendor Profile ──────────────────────────────────────────

export interface HydratedVendorProfile {
  // Identity
  id: string
  slug: string
  name: string
  tagline: string
  about: string
  category: string
  categoryName: string

  // Location
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  lat: number | null
  lng: number | null
  serviceRadiusMiles: number
  phone: string | null
  email: string | null
  website: string | null

  // Media
  imageUrl: string | null
  logoUrl: string | null

  // Social
  socials: { platform: string; url: string }[]

  // Status
  isClaimed: boolean
  isPublished: boolean
  isFeatured: boolean
  isVerified: boolean
  instant: boolean

  // Stats
  rating: number
  reviews: number
  completedBookings: number
  foundedYear: number
  avgResponseTimeMinutes: number

  // Rich data
  portfolio: PortfolioImage[]
  packages: VendorPackage[]
  addons: VendorAddon[]
  vendorReviews: VendorReview[]
  team: TeamMember[]
  businessHours: BusinessHour[]
  menuItems: MenuItem[]
  faq: VendorFAQ[]
  amenities: Amenity[]
  serviceAreas: string[]
  tags: string[]

  // Booking config
  depositPct: number
  priceRange: string | null
}

// ─── Minimal card data (for directory cards) ───────────────────────────────

export interface VendorCardData {
  id: string
  slug: string
  name: string
  category: string
  categoryName: string
  city: string | null
  state: string | null
  rating: number
  reviewCount: number
  priceRange: string | null
  imageUrl: string | null
  isClaimed: boolean
  isFeatured: boolean
  isVerified: boolean
  instant: boolean
  tagline?: string
}
