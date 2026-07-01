import { GatedSurfacePage } from '@/components/GatedSurfacePage'

// P4-1: /food-drink → inventory_items.category = DINING
export default function Page() {
  return <GatedSurfacePage surface="food-drink" inventoryCategory="DINING" />
}
