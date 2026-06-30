'use client';

import { useState, useEffect } from 'react';

export interface RecentActivityItem {
  id: string;
  type: 'new_vendor' | 'new_review' | 'booking' | 'claim';
  vendor_name: string;
  vendor_id: string;
  vendor_slug?: string;
  description: string;
  time_ago: string;
  badge?: string;
}

export function useRecentActivity() {
  const [items, setItems] = useState<RecentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const res = await window.fetch('/api/recent-activity');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setItems(data.items ?? []);
        }
      } catch {
        // keep empty on error
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, []);

  return { items, isLoading };
}
