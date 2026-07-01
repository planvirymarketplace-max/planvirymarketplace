import { GatedSurfacePage } from '@/components/GatedSurfacePage'

// /travel → surface page backed by inventory_items.category = LODGING
//
// Previously this redirected to /travel/search → /lodging/search (Staybnb's
// standalone page), which broke the orchestration: the user clicked Travel
// in the sidebar and landed on a completely different layout with no gate,
// no surface cards, and no way back to the sidebar flow.
//
// Now /travel is a first-class surface — same GatedSurfacePage pattern as
// /services, /food-drink, /spaces, etc. — so the sidebar persists, the
// intent gate (WHAT/WHERE) renders, and the live LODGING inventory grid
// shows below.
export default function TravelPage() {
  return <GatedSurfacePage surface="travel" inventoryCategory="LODGING" />
}
