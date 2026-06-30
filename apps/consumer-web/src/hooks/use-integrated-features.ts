'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// ===========================================================================
// Planviry Feature Hooks — Part 12, 36.3, 43, 44
// ===========================================================================
// These hooks connect frontend components to Supabase for real-time data:
// - useTicketQueue: Realtime waitlist position (Part 12)
// - useExperienceSlots: Available slots with capacity (Part 44)
// - useDateRange: Lodging availability for date ranges (Part 36.3)
// - useRestaurantSlots: Restaurant availability (Part 43)
// ===========================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

function getSupabase() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// ── useTicketQueue ─────────────────────────────────────────────────────────
// Part 12 — Realtime subscription on ticket_queue table.
// Returns the user's position in the waitlist for a sold-out ticket tier.
export function useTicketQueue(tierId: string | null) {
  const [position, setPosition] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('idle');
  const [loading, setLoading] = useState(false);

  const joinQueue = useCallback(async (tierId: string, userId: string) => {
    const supabase = getSupabase();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ticket_queue')
        .insert({
          ticket_tier_id: tierId,
          user_id: userId,
          status: 'waiting',
        })
        .select('position, status')
        .single();

      if (error) throw error;
      setPosition(data.position);
      setStatus(data.status);
    } catch (err) {
      console.error('Failed to join queue:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!tierId) return;
    const supabase = getSupabase();

    const channel = supabase
      .channel(`ticket_queue:${tierId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ticket_queue',
          filter: `ticket_tier_id=eq.${tierId}`,
        },
        (payload) => {
          // Update position when queue changes
          if (payload.new && typeof payload.new === 'object' && 'position' in payload.new) {
            setPosition(payload.new.position as number);
            setStatus(payload.new.status as string);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tierId]);

  return { position, status, loading, joinQueue };
}

// ── useExperienceSlots ─────────────────────────────────────────────────────
// Part 44 — Fetches available experience slots with capacity state.
export function useExperienceSlots(experienceId: string | null) {
  const [slots, setSlots] = useState<Array<{
    id: string;
    slot_date: string;
    slot_time: string;
    capacity: number;
    booked_count: number;
    is_available: boolean;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async (startDate?: string, endDate?: string) => {
    if (!experienceId) return;
    const supabase = getSupabase();
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('experience_slots')
        .select('id, slot_date, slot_time, capacity, booked_count, is_available')
        .eq('experience_id', experienceId)
        .eq('is_available', true)
        .order('slot_date', { ascending: true })
        .order('slot_time', { ascending: true });

      if (startDate) query = query.gte('slot_date', startDate);
      if (endDate) query = query.lte('slot_date', endDate);

      const { data, error: fetchErr } = await query;

      if (fetchErr) throw fetchErr;
      setSlots(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch slots');
    } finally {
      setLoading(false);
    }
  }, [experienceId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return { slots, loading, error, refetch: fetchSlots };
}

// ── useDateRange ───────────────────────────────────────────────────────────
// Part 36.3 — Checks vendor_lodging_blocks for date range availability.
// Used by DateRangePicker for Travel & Lodging vendors.
export function useDateRange(vendorId: string | null) {
  const [blockedRanges, setBlockedRanges] = useState<Array<{
    start_date: string;
    end_date: string;
    block_type: string;
  }>>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlockedRanges = useCallback(async () => {
    if (!vendorId) return;
    const supabase = getSupabase();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vendor_lodging_blocks')
        .select('start_date, end_date, block_type')
        .eq('vendor_id', vendorId)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setBlockedRanges(data ?? []);
    } catch (err) {
      console.error('Failed to fetch lodging blocks:', err);
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchBlockedRanges();
  }, [fetchBlockedRanges]);

  // Check if a date range overlaps any blocked range
  const isRangeAvailable = useCallback((startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (const range of blockedRanges) {
      const blockStart = new Date(range.start_date);
      const blockEnd = new Date(range.end_date);
      // Overlap check: start < blockEnd AND end > blockStart
      if (start < blockEnd && end > blockStart) {
        return false;
      }
    }
    return true;
  }, [blockedRanges]);

  return { blockedRanges, loading, isRangeAvailable, refetch: fetchBlockedRanges };
}

// ── useRestaurantSlots ─────────────────────────────────────────────────────
// Part 43 — Fetches restaurant_availability_slots for a date + party size.
export function useRestaurantSlots(restaurantId: string | null) {
  const [slots, setSlots] = useState<Array<{
    id: string;
    slot_date: string;
    slot_time: string;
    party_size_max: number;
    is_available: boolean;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async (date: string, partySize: number) => {
    if (!restaurantId) return;
    const supabase = getSupabase();
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('restaurant_availability_slots')
        .select('id, slot_date, slot_time, party_size_max, is_available')
        .eq('restaurant_id', restaurantId)
        .eq('slot_date', date)
        .eq('is_available', true)
        .gte('party_size_max', partySize)
        .order('slot_time', { ascending: true });

      if (fetchErr) throw fetchErr;
      setSlots(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch slots');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  return { slots, loading, error, fetchSlots };
}

// ── useExternalEvents ──────────────────────────────────────────────────────
// Part 39 — Fetches external_events (Ticketmaster/Eventbrite cache) from Supabase.
export function useExternalEvents() {
  const [events, setEvents] = useState<Array<{
    id: string;
    name: string;
    venue_name: string | null;
    city: string;
    state: string;
    event_date: string;
    image_url: string | null;
    min_price: number | null;
    max_price: number | null;
    ticket_url: string;
    genre: string | null;
    is_sold_out: boolean;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (params: {
    city?: string;
    state?: string;
    startDate?: string;
    endDate?: string;
    genre?: string;
    limit?: number;
  }) => {
    const supabase = getSupabase();
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('external_events')
        .select('id, name, venue_name, city, state, event_date, image_url, min_price, max_price, ticket_url, genre, is_sold_out')
        .order('event_date', { ascending: true })
        .limit(params.limit ?? 20);

      if (params.city) query = query.eq('city', params.city);
      if (params.state) query = query.eq('state', params.state);
      if (params.startDate) query = query.gte('event_date', params.startDate);
      if (params.endDate) query = query.lte('event_date', params.endDate);
      if (params.genre) query = query.eq('genre', params.genre);

      const { data, error: fetchErr } = await query;

      if (fetchErr) throw fetchErr;
      setEvents(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  return { events, loading, error, fetchEvents };
}
