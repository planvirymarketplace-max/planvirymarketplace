// Tinybird Analytics Client for Planviry
// Uses TINYBIRD_TOKEN and TINYBIRD_API_URL env vars for server-side API calls.
// Browser code should use trackEvent() which POSTs to /api/analytics/events.

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const TINYBIRD_API_URL = process.env.TINYBIRD_API_URL ?? 'https://api.tinybird.co';
const TINYBIRD_TOKEN = process.env.TINYBIRD_TOKEN ?? '';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Post an event to a Tinybird datasource via the Events API. */
export async function pushEvent(datasource: string, data: Record<string, unknown>): Promise<Response> {
  const url = `${TINYBIRD_API_URL}/v0/events?name=${datasource}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TINYBIRD_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res;
}

/** Run a SQL query against Tinybird and return the parsed JSON. */
async function query<T = Record<string, unknown>[]>(sql: string): Promise<T> {
  const url = `${TINYBIRD_API_URL}/v0/sql?q=${encodeURIComponent(sql)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TINYBIRD_TOKEN}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[Tinybird] query error:', res.status, text);
    throw new Error(`Tinybird query failed: ${res.status}`);
  }

  const json = await res.json();
  return (json?.data ?? []) as T;
}

// ---------------------------------------------------------------------------
// Event tracking functions (server-side)
// ---------------------------------------------------------------------------

export interface PageViewData {
  path: string;
  referrer?: string;
  userAgent?: string;
  userId?: string;
}

export interface SearchData {
  query: string;
  filters?: Record<string, string>;
  resultsCount: number;
  userId?: string;
}

export interface VendorViewData {
  vendorSlug: string;
  vendorId: string;
  source: string;
  userId?: string;
}

export interface BookingEventData {
  vendorSlug: string;
  vendorId: string;
  eventType: string;
  value?: number;
  userId?: string;
}

export interface CTAClickData {
  ctaName: string;
  ctaLocation: string;
  destinationUrl: string;
  userId?: string;
}

/**
 * Track a page view event.
 */
export async function trackPageView(data: PageViewData): Promise<Response> {
  return pushEvent('page_views', {
    path: data.path,
    referrer: data.referrer ?? '',
    user_agent: data.userAgent ?? '',
    user_id: data.userId ?? '',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track a search event.
 */
export async function trackSearch(data: SearchData): Promise<Response> {
  return pushEvent('search_events', {
    query: data.query,
    filters: data.filters ? JSON.stringify(data.filters) : '',
    results_count: data.resultsCount,
    user_id: data.userId ?? '',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track a vendor profile view.
 */
export async function trackVendorView(data: VendorViewData): Promise<Response> {
  return pushEvent('vendor_views', {
    vendor_slug: data.vendorSlug,
    vendor_id: data.vendorId,
    source: data.source,
    user_id: data.userId ?? '',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track a booking event (inquiry, quote request, booking, etc.).
 */
export async function trackBookingEvent(data: BookingEventData): Promise<Response> {
  return pushEvent('booking_events', {
    vendor_slug: data.vendorSlug,
    vendor_id: data.vendorId,
    event_type: data.eventType,
    value: data.value ?? 0,
    user_id: data.userId ?? '',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track a CTA button click.
 */
export async function trackCTAClick(data: CTAClickData): Promise<Response> {
  return pushEvent('cta_clicks', {
    cta_name: data.ctaName,
    cta_location: data.ctaLocation,
    destination_url: data.destinationUrl,
    user_id: data.userId ?? '',
    timestamp: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// Analytics query functions (server-side)
// ---------------------------------------------------------------------------

export interface TopSearchResult {
  query: string;
  count: number;
}

export interface TopViewedVendorResult {
  vendor_slug: string;
  vendor_id: string;
  view_count: number;
}

export interface SearchTrendResult {
  date: string;
  count: number;
}

/**
 * Get the top searched queries, ordered by frequency.
 */
export async function getTopSearched(limit: number = 10): Promise<TopSearchResult[]> {
  const sql = `
    SELECT query, count() AS count
    FROM search_events
    GROUP BY query
    ORDER BY count DESC
    LIMIT ${limit}
  `;
  return query<TopSearchResult[]>(sql);
}

/**
 * Get the most viewed vendor profiles.
 */
export async function getTopViewedVendors(limit: number = 10): Promise<TopViewedVendorResult[]> {
  const sql = `
    SELECT vendor_slug, vendor_id, count() AS view_count
    FROM vendor_views
    GROUP BY vendor_slug, vendor_id
    ORDER BY view_count DESC
    LIMIT ${limit}
  `;
  return query<TopViewedVendorResult[]>(sql);
}

/**
 * Get search trends over the last N days (daily count).
 */
export async function getSearchTrends(days: number = 30): Promise<SearchTrendResult[]> {
  const sql = `
    SELECT toDate(timestamp) AS date, count() AS count
    FROM search_events
    WHERE timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY date
    ORDER BY date ASC
  `;
  return query<SearchTrendResult[]>(sql);
}

// ---------------------------------------------------------------------------
// Browser-side tracking helper
// ---------------------------------------------------------------------------

/**
 * Fire-and-forget event tracking from client components.
 * Posts to /api/analytics/events which proxies to Tinybird on the server.
 *
 * @example
 * ```tsx
 * 'use client'
 * import { trackEvent } from '@/lib/tinybird'
 *
 * function MyComponent() {
 *   return <button onClick={() => trackEvent('cta_click', { ctaName: 'signup', ctaLocation: 'hero' })}>Sign Up</button>
 * }
 * ```
 */
export function trackEvent(event: string, data: Record<string, unknown>): void {
  // Fire-and-forget - don't block UI
  fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, ...data, timestamp: new Date().toISOString() }),
  }).catch((err) => {
    // Silently swallow errors - analytics should never break the UX
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Tinybird] trackEvent failed:', err);
    }
  });
}
