import { AppLayoutShell } from '@/components/AppLayoutShell'

/**
 * Lodging segment layout.
 *
 * Wraps every `/lodging/*` route (search, [id] detail, checkout/[listingId])
 * in the Planviry AppLayoutShell so the orchestration sidebar is always
 * present. Without this, the ported Staybnb lodging pages render as raw
 * standalone content with no sidebar — breaking the hotel → dinner →
 * tickets cross-vertical jumps that are the entire point of Planviry.
 *
 * This is a server component layout. AppLayoutShell is the thin client
 * wrapper around <AppLayout> that lets server components opt in.
 */
export default function LodgingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayoutShell>{children}</AppLayoutShell>
}
