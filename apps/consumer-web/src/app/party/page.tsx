import { GatedSurfacePage } from '@/components/GatedSurfacePage'

// P4-1: /party → inventory_items.category IN (VENUE_RENTAL, VENDOR_SERVICE)
export default function Page() {
  return (
    <GatedSurfacePage
      surface="party"
      inventoryCategories={['VENUE_RENTAL', 'VENDOR_SERVICE']}
    />
  )
}
