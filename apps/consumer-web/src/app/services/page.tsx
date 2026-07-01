import { GatedSurfacePage } from '@/components/GatedSurfacePage'

// P4-1: /services → inventory_items.category = VENDOR_SERVICE
export default function Page() {
  return <GatedSurfacePage surface="services" inventoryCategory="VENDOR_SERVICE" />
}
