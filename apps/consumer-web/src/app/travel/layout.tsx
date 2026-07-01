import { AppLayoutShell } from '@/components/AppLayoutShell'

/**
 * Travel segment layout.
 *
 * Wraps every `/travel/*` route in the Planviry AppLayoutShell so the
 * orchestration sidebar is always present. The `/travel/search`,
 * `/travel/[id]`, `/travel/checkout/[listingId]` and `/travel` routes
 * are redirect-only (they hop to `/lodging/*`), so this layout
 * effectively only applies to `/travel/destination/[slug]` and
 * `/travel/property/[slug]` — the SEO landing pages — but it's safer to
 * cover the whole segment in case new travel routes are added later.
 *
 * Per-page `<AppLayoutShell>` wraps on the destination/property pages
 * have been removed to avoid double-chrome.
 */
export default function TravelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayoutShell>{children}</AppLayoutShell>
}
