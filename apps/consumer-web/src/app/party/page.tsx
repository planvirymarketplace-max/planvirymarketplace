import { GatedSurfacePage } from '@/components/GatedSurfacePage'

// P4-1: /party → inventory_items.category IN (VENUE_RENTAL, SERVICE)
// FIX-10: aligned to the live Supabase `inventory_category` enum
// (was VENDOR_SERVICE — rejected by Postgres).
export default function Page() {
  return (
    <GatedSurfacePage
      surface="party"
      inventoryCategories={['VENUE_RENTAL', 'SERVICE']}
    />
  )
}
