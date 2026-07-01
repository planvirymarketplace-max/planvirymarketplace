import TravelPage from '@/components/travel/TravelPage'

// /travel — Planviry travel marketplace.
//
// Previously this rendered <GatedSurfacePage surface="travel" inventoryCategory="LODGING" />
// which produced a 2-column immersive gate (hero image left, form right) that did
// NOT match the user's original design.
//
// The user's design is a single-page horizontal layout: a search filter bar
// (WHAT/WHERE/WHEN/PRICE/ATTENDEES/FILTERS/CLEAR + Search button) at the top,
// a dark navy secondary nav bar (All travel / Places to stay / Flights / Cars /
// Destinations / Group Trip), a section header (Travel title + subtitle + SORT),
// and a 3-column premium card grid below. All rendered inside the AppLayoutShell
// that /travel/layout.tsx already provides — so this page just renders
// <TravelPage />.
export default function TravelRoute() {
  return <TravelPage />
}
