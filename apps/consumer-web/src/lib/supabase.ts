/**
 * Planviry - Supabase Client Library
 *
 * Centralises all Supabase client creation and vendor data helpers.
 * - Browser client  → SSR-aware client for React components
 * - Server client   → Cookie-aware client for Next.js App Router server code
 * - Admin client    → Service-role client that bypasses RLS
 * - Vendor type     → Matches the `vendors` table in Supabase
 * - Helper functions → Search / fetch vendors from Supabase
 */

import { createBrowserClient as ssrCreateBrowserClient } from '@supabase/ssr'
import { createServerClient as ssrCreateServerClient } from '@supabase/ssr'
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js'
import { resolveTable } from './db-compat'

/**
 * Wrap a Supabase client so `.from('old_table')` is redirected to the
 * new-schema table name. This is the Part XLVI compatibility layer.
 */
function wrapWithCompat<T extends { from: (table: string) => unknown }>(client: T): T {
  return new Proxy(client as object, {
    get(target: T, prop: string | symbol, receiver: unknown) {
      if (prop === 'from') {
        return (table: string) => (target as { from: (t: string) => unknown }).from(resolveTable(table))
      }
      return Reflect.get(target, prop, receiver)
    },
  }) as T
}

// ─── Environment Variables ──────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

// ─── 1. Browser Client ─────────────────────────────────────────────────────

/**
 * Create a Supabase client for use in browser / client components.
 * Uses `@supabase/ssr` so that auth cookies are automatically handled
 * by the SSR middleware pipeline.
 */
export function createBrowserClient() {
  return ssrCreateBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// ─── 2. Server Client ──────────────────────────────────────────────────────

/**
 * Create a Supabase client for use in Next.js App Router server components
 * and route handlers. Pass the result of `await cookies()` from `next/headers`.
 *
 * ```ts
 * import { cookies } from 'next/headers'
 * const cookieStore = await cookies()
 * const supabase = createServerClient(cookieStore)
 * ```
 */
export function createServerClient(cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>) {
  return ssrCreateServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // `setAll` was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  })
}

// ─── 3. Admin Client ───────────────────────────────────────────────────────

/**
 * Create a Supabase client with the service-role key.
 * **Bypasses Row Level Security** - only use in trusted server-side code.
 *
 * Wraps the client with a table-name compatibility layer (Part XLVI) that
 * redirects old-schema table names (vendors, listings, bookings, etc.) to
 * the live new-schema tables (vendor_accounts, inventory_items, reservations).
 */
export function createAdminClient() {
  return wrapWithCompat(createSupabaseJsClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY))
}

// ─── Backward-Compatible Singleton Exports ──────────────────────────────────
// Existing code imports `supabase` / `supabaseAdmin` directly.
// These lazily create clients only when accessed, so missing env vars
// won't crash the module at import time.

function lazyClient(getKey: () => string, getSecret: () => string) {
  return new Proxy({} as ReturnType<typeof createSupabaseJsClient>, {
    get(_target, prop, receiver) {
      const url = getKey()
      const key = getSecret()
      if (!url || !key) {
        console.warn(`[Supabase] Cannot access .${String(prop)} - env vars not configured`)
        return undefined
      }
      const client = wrapWithCompat(createSupabaseJsClient(url, key))
      return Reflect.get(client, prop, receiver)
    },
  })
}

/** @deprecated Prefer `createBrowserClient()` or `createServerClient()` */
export const supabase = lazyClient(
  () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
)

/** @deprecated Prefer `createAdminClient()` */
export const supabaseAdmin = lazyClient(
  () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
)

// ─── 4. Vendor Interface ───────────────────────────────────────────────────

export interface Vendor {
  id: string
  slug: string
  business_name: string
  category: string
  sub_category: string
  description: string
  city: string
  state: string
  zip: string
  lat: number | null
  lng: number | null
  phone: string | null
  email: string | null
  website: string | null
  image_url: string | null
  gallery_urls: string[]
  rating: number
  review_count: number
  price_range: string | null
  is_verified: boolean
  is_claimed: boolean
  vertical_slug: string
  created_at: string
  updated_at: string
}

// ─── 5. Helper Functions ───────────────────────────────────────────────────

interface SearchFilters {
  category?: string
  city?: string
  state?: string
  vertical?: string
  limit?: number
  offset?: number
}

/**
 * Search vendors from the `vendors` table using text search on
 * `business_name` and `description`, with optional filters.
 */
export async function searchVendors(
  query: string,
  filters?: SearchFilters,
): Promise<Vendor[]> {
  const client = createAdminClient()

  let qb = client
    .from('vendors')
    .select('*')

  // Text search on business_name and description
  if (query) {
    qb = qb.or(
      `business_name.ilike.%${query}%,description.ilike.%${query}%`,
    )
  }

  // Category filter
  if (filters?.category) {
    qb = qb.eq('category', filters.category)
  }

  // City filter
  if (filters?.city) {
    qb = qb.ilike('city', `%${filters.city}%`)
  }

  // State filter
  if (filters?.state) {
    qb = qb.eq('state', filters.state)
  }

  // Vertical filter
  if (filters?.vertical) {
    qb = qb.eq('vertical_slug', filters.vertical)
  }

  // Pagination
  const limit = filters?.limit ?? 50
  const offset = filters?.offset ?? 0
  qb = qb.range(offset, offset + limit - 1)

  // Sort by rating descending, then review_count
  qb = qb.order('rating', { ascending: false })
  qb = qb.order('review_count', { ascending: false })

  const { data, error } = await qb

  if (error) {
    console.error('searchVendors error:', error.message)
    return []
  }

  return (data ?? []) as Vendor[]
}

/**
 * Get a single vendor by its slug.
 */
export async function getVendorBySlug(
  slug: string,
): Promise<Vendor | null> {
  const client = createAdminClient()

  const { data, error } = await client
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('getVendorBySlug error:', error.message)
    return null
  }

  return data as Vendor | null
}

/**
 * Get vendors belonging to a specific vertical.
 */
export async function getVendorsByVertical(
  verticalSlug: string,
  limit: number = 50,
): Promise<Vendor[]> {
  const client = createAdminClient()

  const { data, error } = await client
    .from('vendors')
    .select('*')
    .eq('vertical_slug', verticalSlug)
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getVendorsByVertical error:', error.message)
    return []
  }

  return (data ?? []) as Vendor[]
}

/**
 * Get vendors in a specific city and state.
 */
export async function getVendorsByCity(
  city: string,
  state: string,
  limit: number = 50,
): Promise<Vendor[]> {
  const client = createAdminClient()

  const { data, error } = await client
    .from('vendors')
    .select('*')
    .ilike('city', `%${city}%`)
    .eq('state', state)
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getVendorsByCity error:', error.message)
    return []
  }

  return (data ?? []) as Vendor[]
}
