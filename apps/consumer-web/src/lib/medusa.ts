const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${MEDUSA_URL}${path}`
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `API Error: ${res.status}`)
  }

  return res.json()
}

// Internal API (via Next.js routes - no port needed)
async function internalFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `API Error: ${res.status}`)
  }

  return res.json()
}

// Milwaukee vendor category types
export type MilwaukeeCategory =
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
  | 'wedding_cake'
  | 'florist'
  | 'hair_makeup'
  | 'officiant'
  | 'dress_attire'
  | 'favors_gifts'
  | 'jeweler'
  | 'invitations_print'
  | 'hotel_accommodations'
  | 'honeymoon_travel'
  | 'decor_rentals'

// Vendor types
export interface Vendor {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  logo?: string
  coverImage?: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  category: MilwaukeeCategory
  serviceAreas?: string[]
  capacity?: string
  priceRange?: string
  rating: number
  reviewCount: number
  isVerified: boolean
  isFeatured: boolean
  isClaimed: boolean
  status: string
  tags: string[]
  specialties: string[]
}

export interface Product {
  id: string
  vendorId: string
  categoryId?: string
  name: string
  slug: string
  description: string
  shortDesc?: string
  price: number
  compareAtPrice?: number
  images: string[]
  type: string
  status: string
  isFeatured: boolean
  tags: string[]
  rating?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  description?: string
  color?: string
  productCount?: number
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  vendorId: string
  status: string
  total: number
  subtotal: number
  paymentStatus: string
  createdAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product?: Product
}

export interface Review {
  id: string
  userId: string
  vendorId?: string
  productId?: string
  rating: number
  title?: string
  comment?: string
  isVerified: boolean
  createdAt: string
  user?: { name: string; avatar?: string }
}

export interface Lead {
  id: string
  vendorId: string
  name: string
  email: string
  phone?: string
  message?: string
  source?: string
  status: string
  createdAt: string
}

export interface ClaimRequest {
  id: string
  vendorId: string
  userId: string
  status: string
  message?: string
  createdAt: string
  vendor?: Vendor
  user?: { name: string; email: string }
}

export interface Analytics {
  date: string
  views: number
  leads: number
  orders: number
  revenue: number
  conversionRate: number
  source?: string
}

export interface PlatformStats {
  totalVendors: number
  totalOrders: number
  totalRevenue: number
  pendingClaims: number
  vendorGrowth: number
  orderGrowth: number
  revenueGrowth: number
}

// Milwaukee category display names
export const CATEGORY_LABELS: Record<MilwaukeeCategory, string> = {
  bar_club: 'Bars & Clubs',
  wedding_venue: 'Wedding Venues',
  bachelorette_activity: 'Bachelorette Activities',
  wedding_dj: 'Wedding DJs',
  wedding_band: 'Wedding Bands',
  photo_booth: 'Photo Booths',
  transportation: 'Transportation',
  videography: 'Videography',
  wedding_planner: 'Wedding Planners',
  photography: 'Photography',
  catering: 'Catering',
  wedding_cake: 'Wedding Cakes',
  florist: 'Florists',
  hair_makeup: 'Hair & Makeup',
  officiant: 'Officiants',
  dress_attire: 'Dress & Attire',
  favors_gifts: 'Favors & Gifts',
  jeweler: 'Jewelers',
  invitations_print: 'Invitations & Print',
  hotel_accommodations: 'Hotels',
  honeymoon_travel: 'Honeymoon & Travel',
  decor_rentals: 'Décor & Rentals',
}

// API Methods - using internal Next.js API routes
export const api = {
  // Vendors
  getVendors: (params?: Record<string, string>) => {
    const search = params ? '?' + new URLSearchParams(params).toString() : ''
    return internalFetch<{ vendors: Vendor[]; total: number }>(`/api/vendors${search}`)
  },
  getVendor: (id: string) =>
    internalFetch<Vendor>(`/api/vendors/${id}`),

  // Products
  getProducts: (params?: Record<string, string>) => {
    const search = params ? '?' + new URLSearchParams(params).toString() : ''
    return internalFetch<{ products: Product[]; total: number }>(`/api/products${search}`)
  },
  getProduct: (id: string) =>
    internalFetch<Product>(`/api/products/${id}`),

  // Categories
  getCategories: () =>
    internalFetch<Category[]>('/api/categories'),

  // Orders
  getOrders: (params?: Record<string, string>) => {
    const search = params ? '?' + new URLSearchParams(params).toString() : ''
    return internalFetch<{ orders: Order[]; total: number }>(`/api/orders${search}`)
  },
  createOrder: (data: Record<string, unknown>) =>
    internalFetch<Order>('/api/orders', { method: 'POST', body: JSON.stringify(data) }),

  // Analytics
  getAnalytics: (params?: Record<string, string>) => {
    const search = params ? '?' + new URLSearchParams(params).toString() : ''
    return internalFetch<{ analytics: Analytics[]; summary: Record<string, number> }>(`/api/analytics${search}`)
  },

  // Leads
  getLeads: (params?: Record<string, string>) => {
    const search = params ? '?' + new URLSearchParams(params).toString() : ''
    return internalFetch<{ leads: Lead[]; total: number }>(`/api/leads${search}`)
  },
  createLead: (data: Record<string, unknown>) =>
    internalFetch<Lead>('/api/leads', { method: 'POST', body: JSON.stringify(data) }),

  // Claims
  getClaimRequests: (params?: Record<string, string>) => {
    const search = params ? '?' + new URLSearchParams(params).toString() : ''
    return internalFetch<{ claims: ClaimRequest[]; total: number }>(`/api/claim-requests${search}`)
  },
  createClaimRequest: (data: Record<string, unknown>) =>
    internalFetch<ClaimRequest>('/api/claim-requests', { method: 'POST', body: JSON.stringify(data) }),

  // Stats
  getStats: () =>
    internalFetch<PlatformStats>('/api/stats'),

  // Medusa.js specific (external)
  medusa: {
    getProducts: () => apiFetch<{ products: Product[] }>(`/store/products?XTransformPort=9000`),
    getProduct: (id: string) => apiFetch<{ product: Product }>(`/store/products/${id}?XTransformPort=9000`),
    createCart: (data: Record<string, unknown>) =>
      apiFetch<{ cart: unknown }>('/store/carts?XTransformPort=9000', { method: 'POST', body: JSON.stringify(data) }),
    getOrders: () => apiFetch<{ orders: Order[] }>('/admin/orders?XTransformPort=9000'),
  },
}
