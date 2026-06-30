'use client';

import React, { createContext, useContext, useCallback, useMemo, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// ===========================================================================
// Planviry Trip Itinerary Context — Part 41 (Unified Trip Itinerary)
// ===========================================================================
// Manages trip_itinerary_items — the unified day-by-day plan table that
// holds all 6 item types: booking, ticket, lodging, experience, restaurant,
// external_event.
//
// External events go HERE, never to CartContext.
// ===========================================================================

// ── Types ──────────────────────────────────────────────────────────────────
export interface Trip {
  id: string;
  owner_id: string;
  event_id: string | null;
  title: string;
  destination_city: string;
  destination_state: string;
  start_date: string;
  end_date: string;
  group_size: number;
  trip_type: string | null;
  budget_total: number | null;
  status: string;
}

export interface TripItineraryItem {
  id: string;
  trip_id: string;
  item_type: 'booking' | 'ticket' | 'lodging' | 'experience' | 'restaurant' | 'external_event';
  booking_id: string | null;
  ticket_id: string | null;
  experience_reservation_id: string | null;
  restaurant_reservation_id: string | null;
  external_event_id: string | null;
  display_name: string;
  display_time: string | null;
  display_date: string;
  display_location: string | null;
  display_image_url: string | null;
  display_price: number | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
}

// ── Context Value ──────────────────────────────────────────────────────────
interface TripItineraryContextValue {
  trip: Trip | null;
  items: TripItineraryItem[];
  loading: boolean;
  error: string | null;

  createTrip: (data: {
    title: string;
    destination_city: string;
    destination_state: string;
    start_date: string;
    end_date: string;
    group_size: number;
    trip_type?: string;
    budget_total?: number;
  }) => Promise<Trip | null>;

  loadTrip: (tripId: string) => Promise<void>;

  addItem: (item: Omit<TripItineraryItem, 'id' | 'trip_id' | 'created_at' | 'sort_order'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  reorderItems: (orderedIds: string[]) => Promise<void>;

  itemsByDate: Record<string, TripItineraryItem[]>;
  itemsByType: Record<string, TripItineraryItem[]>;
}

const TripItineraryContext = createContext<TripItineraryContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────
export function TripItineraryProvider({ children }: { children: React.ReactNode }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [items, setItems] = useState<TripItineraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    );
  }, []);

  // ── createTrip ──────────────────────────────────────────────────────────
  const createTrip = useCallback(async (data: {
    title: string;
    destination_city: string;
    destination_state: string;
    start_date: string;
    end_date: string;
    group_size: number;
    trip_type?: string;
    budget_total?: number;
  }): Promise<Trip | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to create a trip');

      const { data: newTrip, error: tripError } = await supabase
        .from('trips')
        .insert({
          owner_id: user.id,
          title: data.title,
          destination_city: data.destination_city,
          destination_state: data.destination_state,
          start_date: data.start_date,
          end_date: data.end_date,
          group_size: data.group_size,
          trip_type: data.trip_type ?? null,
          budget_total: data.budget_total ?? null,
          status: 'planning',
        })
        .select()
        .single();

      if (tripError) throw tripError;
      setTrip(newTrip);
      setItems([]);
      return newTrip;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create trip');
      return null;
    }
  }, [supabase]);

  // ── loadTrip ────────────────────────────────────────────────────────────
  const loadTrip = useCallback(async (tripId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: tripData, error: tripErr } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (tripErr) throw tripErr;
      setTrip(tripData);

      const { data: itemsData, error: itemsErr } = await supabase
        .from('trip_itinerary_items')
        .select('*')
        .eq('trip_id', tripId)
        .order('display_date', { ascending: true })
        .order('sort_order', { ascending: true });

      if (itemsErr) throw itemsErr;
      setItems(itemsData ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trip');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // ── addItem ─────────────────────────────────────────────────────────────
  const addItem = useCallback(async (item: Omit<TripItineraryItem, 'id' | 'trip_id' | 'created_at' | 'sort_order'>) => {
    if (!trip) throw new Error('No active trip');
    try {
      const { data, error: addErr } = await supabase
        .from('trip_itinerary_items')
        .insert({
          ...item,
          trip_id: trip.id,
          sort_order: items.length,
        })
        .select()
        .single();

      if (addErr) throw addErr;
      setItems((prev) => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    }
  }, [trip, items.length, supabase]);

  // ── removeItem ──────────────────────────────────────────────────────────
  const removeItem = useCallback(async (id: string) => {
    try {
      const { error: delErr } = await supabase
        .from('trip_itinerary_items')
        .delete()
        .eq('id', id);

      if (delErr) throw delErr;
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    }
  }, [supabase]);

  // ── reorderItems ────────────────────────────────────────────────────────
  const reorderItems = useCallback(async (orderedIds: string[]) => {
    if (!trip) return;
    try {
      // Update sort_order for each item
      const updates = orderedIds.map((id, index) =>
        supabase
          .from('trip_itinerary_items')
          .update({ sort_order: index })
          .eq('id', id)
      );
      await Promise.all(updates);

      // Reorder local state
      setItems((prev) => {
        const map = new Map(prev.map((i) => [i.id, i]));
        return orderedIds.map((id) => map.get(id)).filter(Boolean) as TripItineraryItem[];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder items');
    }
  }, [trip, supabase]);

  // ── Realtime subscription ───────────────────────────────────────────────
  useEffect(() => {
    if (!trip) return;

    const channel = supabase
      .channel(`trip:${trip.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trip_itinerary_items',
          filter: `trip_id=eq.${trip.id}`,
        },
        () => {
          // Reload items on any change (co-planner edits)
          loadTrip(trip.id);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trip, supabase, loadTrip]);

  // ── Derived values ──────────────────────────────────────────────────────
  const itemsByDate = useMemo(() => {
    const map: Record<string, TripItineraryItem[]> = {};
    for (const item of items) {
      if (!map[item.display_date]) map[item.display_date] = [];
      map[item.display_date].push(item);
    }
    return map;
  }, [items]);

  const itemsByType = useMemo(() => {
    const map: Record<string, TripItineraryItem[]> = {};
    for (const item of items) {
      if (!map[item.item_type]) map[item.item_type] = [];
      map[item.item_type].push(item);
    }
    return map;
  }, [items]);

  const value = useMemo<TripItineraryContextValue>(
    () => ({
      trip,
      items,
      loading,
      error,
      createTrip,
      loadTrip,
      addItem,
      removeItem,
      reorderItems,
      itemsByDate,
      itemsByType,
    }),
    [trip, items, loading, error, createTrip, loadTrip, addItem, removeItem, reorderItems, itemsByDate, itemsByType],
  );

  return <TripItineraryContext.Provider value={value}>{children}</TripItineraryContext.Provider>;
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useTripItinerary(): TripItineraryContextValue {
  const ctx = useContext(TripItineraryContext);
  if (!ctx) {
    throw new Error('useTripItinerary must be used within a <TripItineraryProvider>');
  }
  return ctx;
}
