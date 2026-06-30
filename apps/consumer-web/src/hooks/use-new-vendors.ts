'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase-client';

export interface NewVendor {
  vendor_id: string;
  business_name: string;
  slug: string;
  cover_url: string | null;
  neighborhood: string | null;
  price_range: string | null;
  is_verified: boolean;
  is_featured: boolean;
  avg_rating: number | null;
}

export function useNewVendors(limit = 8) {
  const [vendors, setVendors] = useState<NewVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchVendors() {
      try {
        const { data } = await supabaseClient
          .from('vendor_profiles')
          .select('id, business_name, slug, logo_url, cover_url, neighborhood, price_range, avg_rating, is_verified, is_featured')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (!cancelled && data) {
          setVendors(
            data.map((v: Record<string, unknown>) => ({
              vendor_id: v.id as string,
              business_name: v.business_name as string,
              slug: v.slug as string,
              cover_url: ((v.cover_url ?? v.logo_url) ?? null) as string | null,
              neighborhood: (v.neighborhood ?? null) as string | null,
              price_range: (v.price_range ?? null) as string | null,
              is_verified: (v.is_verified ?? false) as boolean,
              is_featured: (v.is_featured ?? false) as boolean,
              avg_rating: (v.avg_rating ?? null) as number | null,
            }))
          );
        }
      } catch {
        // keep empty on error
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchVendors();
    return () => { cancelled = true; };
  }, [limit]);

  return { vendors, isLoading };
}
