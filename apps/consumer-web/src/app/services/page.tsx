import { GatedSurfacePage } from '@/components/GatedSurfacePage'

// P4-1: /services → inventory_items.category = SERVICE
// FIX-10: aligned to the live Supabase `inventory_category` enum
// (was VENDOR_SERVICE — rejected by Postgres).
export default function Page() {
  return <GatedSurfacePage surface="services" inventoryCategory="SERVICE" />
}
