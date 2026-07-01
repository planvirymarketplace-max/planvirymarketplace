import { GatedSurfacePage } from '@/components/GatedSurfacePage'

// P4-1: /live-shows → inventory_items.category = EVENT_TICKET
export default function Page() {
  return <GatedSurfacePage surface="live-shows" inventoryCategory="EVENT_TICKET" />
}
