import { GatedSurfacePage } from '@/components/GatedSurfacePage'

// P4-1: /things-to-do → inventory_items.category = ACTIVITY
// FIX-10: aligned to the live Supabase `inventory_category` enum
// (was EXPERIENCE — rejected by Postgres).
export default function Page() {
  return <GatedSurfacePage surface="things-to-do" inventoryCategory="ACTIVITY" />
}
