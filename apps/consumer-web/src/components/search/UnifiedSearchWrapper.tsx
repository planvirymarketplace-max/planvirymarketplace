'use client';

import { useState, useCallback, useMemo } from 'react';
import algoliasearch from 'algoliasearch';
import { createBrowserClient } from '@supabase/ssr';

// ===========================================================================
// Planviry Unified Search — Part 45 (Unified Search Architecture)
// ===========================================================================
// One search bar returns all content types: vendors (Algolia), external
// events (Supabase), ranked by date proximity and relevance.
//
// Three Algolia indices + one Supabase query, merged client-side.
// ===========================================================================

// ── Types ──────────────────────────────────────────────────────────────────
export type SearchResultType =
  | 'vendor'
  | 'lodging'
  | 'experience'
  | 'restaurant'
  | 'external_event'
  | 'native_event';

export interface SearchResult {
  type: SearchResultType;
  objectID: string;
  name: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  image_url?: string | null;
  price_tier?: number | null;
  avg_rating?: number | null;
  review_count?: number;
  planviry_vertical?: string;
  planviry_sub_category?: string;
  is_claimed?: boolean;
  instant_book?: boolean;
  // External event fields
  event_date?: string;
  venue_name?: string;
  ticket_url?: string;
  genre?: string;
  min_price?: number | null;
  max_price?: number | null;
  is_sold_out?: boolean;
  // Display fields
  displayPrice?: string;
  displayBadge?: string;
  href: string;
}

export interface SearchFilters {
  query?: string;
  city?: string;
  state?: string;
  vertical?: string;
  dateFrom?: string;
  dateTo?: string;
  priceTier?: number;
  instantBookOnly?: boolean;
  minRating?: number;
  limit?: number;
}

// ── Algolia Client ─────────────────────────────────────────────────────────
const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '';
const algoliaSearchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? '';
const listingsIndexName = process.env.NEXT_PUBLIC_ALGOLIA_LISTINGS_INDEX ?? 'listings';

const searchClient = algoliasearch(algoliaAppId, algoliaSearchKey);
const listingsIndex = searchClient.initIndex(listingsIndexName);

// ── Supabase Client ────────────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

function getSupabase() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useUnifiedSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultCounts, setResultCounts] = useState<Record<SearchResultType, number>>({
    vendor: 0,
    lodging: 0,
    experience: 0,
    restaurant: 0,
    external_event: 0,
    native_event: 0,
  });

  const search = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    try {
      // ── 1. Algolia query for listings (vendors, lodging, experiences, restaurants) ──
      const algoliaFilters: string[] = [];

      if (filters.city) algoliaFilters.push(`city:"${filters.city}"`);
      if (filters.state) algoliaFilters.push(`state:"${filters.state}"`);
      if (filters.vertical) algoliaFilters.push(`planviry_vertical:"${filters.vertical}"`);
      if (filters.priceTier) algoliaFilters.push(`price_tier=${filters.priceTier}`);
      if (filters.instantBookOnly) algoliaFilters.push('instant_book:true');

      const { hits: algoliaHits, nbHits } = await listingsIndex.search(
        filters.query ?? '',
        {
          filters: algoliaFilters.length > 0 ? algoliaFilters.join(' AND ') : undefined,
          hitsPerPage: filters.limit ?? 20,
        },
      );

      // Map Algolia hits to SearchResult
      const algoliaResults: SearchResult[] = algoliaHits.map((hit: Record<string, unknown>) => {
        const vertical = (hit.planviry_vertical as string) ?? '';
        let type: SearchResultType = 'vendor';
        if (vertical === 'Travel & Lodging') type = 'lodging';
        else if (vertical === 'Experiences & Activities') type = 'experience';

        return {
          type,
          objectID: hit.objectID as string,
          name: (hit.name as string) ?? 'Unknown',
          city: (hit.city as string) ?? '',
          state: (hit.state as string) ?? '',
          lat: hit.lat as number | undefined,
          lng: hit.lng as number | undefined,
          image_url: (hit.profile_image_url as string) ?? null,
          price_tier: (hit.price_tier as number) ?? null,
          avg_rating: (hit.avg_rating as number) ?? null,
          review_count: (hit.review_count as number) ?? 0,
          planviry_vertical: vertical,
          planviry_sub_category: (hit.planviry_sub_category as string) ?? undefined,
          is_claimed: (hit.is_claimed as boolean) ?? false,
          instant_book: (hit.instant_book as boolean) ?? false,
          displayPrice: hit.price_tier ? '$'.repeat(hit.price_tier as number) : undefined,
          displayBadge: (hit.instant_book as boolean) ? 'Instant Book' : undefined,
          href: `/v/${hit.slug ?? hit.objectID}`,
        };
      });

      // ── 2. Supabase query for external events (Ticketmaster cache) ──
      let externalEvents: SearchResult[] = [];
      if (filters.city || filters.state) {
        const supabase = getSupabase();
        let query = supabase
          .from('external_events')
          .select('id, name, venue_name, city, state, event_date, image_url, min_price, max_price, ticket_url, genre, is_sold_out, lat, lng')
          .eq('is_sold_out', false)
          .order('event_date', { ascending: true })
          .limit(10);

        if (filters.city) query = query.eq('city', filters.city);
        if (filters.state) query = query.eq('state', filters.state);
        if (filters.dateFrom) query = query.gte('event_date', filters.dateFrom);
        if (filters.dateTo) query = query.lte('event_date', filters.dateTo);

        const { data: extData } = await query;

        externalEvents = (extData ?? []).map((e) => ({
          type: 'external_event' as SearchResultType,
          objectID: e.id,
          name: e.name,
          city: e.city,
          state: e.state,
          lat: e.lat,
          lng: e.lng,
          image_url: e.image_url,
          event_date: e.event_date,
          venue_name: e.venue_name,
          ticket_url: e.ticket_url,
          genre: e.genre,
          min_price: e.min_price,
          max_price: e.max_price,
          is_sold_out: e.is_sold_out,
          displayPrice: e.min_price ? `From $${e.min_price}` : undefined,
          displayBadge: 'Live Event',
          href: e.ticket_url, // deeplink to Ticketmaster — NEVER /checkout
        }));
      }

      // ── 3. Merge results ──
      // External events sorted by date, Algolia results sorted by relevance
      const merged = [...algoliaResults, ...externalEvents];

      setResults(merged);

      // Count by type
      const counts: Record<SearchResultType, number> = {
        vendor: 0,
        lodging: 0,
        experience: 0,
        restaurant: 0,
        external_event: 0,
        native_event: 0,
      };
      for (const r of merged) {
        counts[r.type]++;
      }
      setResultCounts(counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Grouped results ──────────────────────────────────────────────────────
  const groupedResults = useMemo(() => {
    const groups: Record<SearchResultType, SearchResult[]> = {
      vendor: [],
      lodging: [],
      experience: [],
      restaurant: [],
      external_event: [],
      native_event: [],
    };
    for (const r of results) {
      groups[r.type].push(r);
    }
    return groups;
  }, [results]);

  return {
    results,
    loading,
    error,
    resultCounts,
    groupedResults,
    search,
  };
}
