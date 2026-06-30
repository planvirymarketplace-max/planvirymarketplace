export type VendorCategory =
  | 'bar_club'
  | 'wedding_venue'
  | 'bachelorette_activity'
  | 'wedding_dj'
  | 'wedding_band'
  | 'photo_booth'
  | 'transportation'
  | 'videography'
  | 'wedding_planner'
  | 'photography'
  | 'catering'
  | 'florist'
  | 'decor_rentals'
  | 'jeweler'
  | 'makeup_hair'
  | 'hair_makeup'
  | 'officiant'
  | 'bakery'
  | 'wedding_cake'
  | 'lighting_av'
  | 'rentals'
  | 'stationery'
  | 'invitations_print'
  | 'wellness'
  | 'wine_spirits'
  | 'dress_attire'
  | 'favors_gifts'
  | 'hotel_accommodations'
  | 'honeymoon_travel'

export type ClaimStatus = 'pending' | 'approved' | 'rejected'
export type PriceRange = '$' | '$$' | '$$$' | '$$$$'

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'pinterest' | 'twitter' | 'youtube' | 'linkedin' | 'yelp'
  url: string
}

export interface Package {
  id: string
  name: string
  description: string
  price: number
  duration?: string
  capacity?: string
}

export interface Review {
  id: string
  reviewerName: string
  rating: number
  body: string
  createdAt: string
  isApproved: boolean
  response?: string
}

export interface Booking {
  id: string
  vendorId: string
  vendorName: string
  packageId: string
  packageName: string
  eventDate: string
  priceSnapshot: number
  depositAmount: number
  status: 'pending' | 'confirmed' | 'cancelled'
  clientName: string
  clientEmail: string
  createdAt: string
}

export interface Lead {
  id: string
  vendorId: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  eventDate: string
  budget?: number
  message: string
  category: string
  replied: boolean
  replies?: { message: string; createdAt: string }[]
  createdAt: string
  status: 'new' | 'replied' | 'archived'
}

export interface Vendor {
  id: string
  slug: string
  name: string
  category: VendorCategory
  address?: string
  phone?: string
  website?: string
  email?: string
  bio?: string
  logoUrl?: string
  coverUrl?: string
  priceRange?: PriceRange | string
  serviceAreas?: string[]
  capacity?: string
  tags?: string[]
  backlinkUrl?: string
  isClaimed: boolean
  isPublished: boolean
  isFeatured: boolean
  isVerified: boolean
  source: 'seed' | 'signup'
  averageRating: number
  reviewCount: number
  galleryUrl?: string[]
  socials: SocialLink[]
  packages: Package[]
  reviews: Review[]
  availability: string[]
  depositPercent: number
}

export interface ClaimRequest {
  id: string
  vendorId: string
  vendorName: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  verificationNote: string
  status: ClaimStatus
  createdAt: string
}

export interface VendorSignup {
  id: string
  businessName: string
  category: VendorCategory
  contactName: string
  contactEmail: string
  phone?: string
  website?: string
  address?: string
  bio?: string
  priceRange?: PriceRange
  status: ClaimStatus
  createdAt: string
}

export interface CartItem {
  id: string
  vendorId: string
  vendorName: string
  packageId: string
  packageName: string
  eventDate: string
  priceSnapshot: number
  depositPercent: number
  depositAmount: number
  logoUrl?: string
}

export interface PlatformAnalytics {
  totalViews: number
  totalLeads: number
  totalBookings: number
  totalGMV: number
  totalRevenue: number
}

export interface VendorPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const CATEGORY_LABELS: Record<VendorCategory, string> = {
  bar_club: 'Bars & Clubs',
  wedding_venue: 'Wedding Venues',
  bachelorette_activity: 'Activities & Entertainment',
  wedding_dj: 'Wedding DJs',
  wedding_band: 'Live Bands',
  photo_booth: 'Photo Booths',
  transportation: 'Transportation',
  videography: 'Videography',
  wedding_planner: 'Event Planners',
  photography: 'Photography',
  catering: 'Catering',
  florist: 'Florists',
  decor_rentals: 'Decor & Rentals',
  jeweler: 'Jewelers',
  makeup_hair: 'Hair & Makeup',
  hair_makeup: 'Hair & Makeup',
  officiant: 'Officiants',
  bakery: 'Bakeries & Cakes',
  wedding_cake: 'Wedding Cakes',
  lighting_av: 'Lighting & AV',
  rentals: 'Event Rentals',
  stationery: 'Stationery',
  invitations_print: 'Invitations & Print',
  wellness: 'Wellness & Spa',
  wine_spirits: 'Wine & Spirits',
  dress_attire: 'Dress & Attire',
  favors_gifts: 'Favors & Gifts',
  hotel_accommodations: 'Hotels & Lodging',
  honeymoon_travel: 'Honeymoon & Travel',
}

export function getCategoryLabel(cat: string): string {
  return (CATEGORY_LABELS as Record<string, string>)[cat] || cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
