import { AppLayoutShell } from '@/components/AppLayoutShell'

/**
 * Hosting segment layout.
 *
 * Wraps every route under the hosting segment in the Planviry
 * AppLayoutShell so the orchestration sidebar (nav-rail + global
 * header + footer) is always present across the entire host flow:
 *
 *   - host-slash-create                  — listing menu (drafts + new)
 *   - host-slash-listings                — host's published listings table
 *   - host-slash-listings-slash-edit-slash-edit-slash-[id]
 *                                        — single-listing edit form
 *   - host-slash-reservations            — reservations across all listings
 *   - host-slash-create-slash-listing-slash-[id] wizard steps (12 of them)
 *                                        — the create-listing wizard
 *
 * Before this layout existed, all of these pages rendered as raw
 * standalone content (HostListingsHeader on the listings index is
 * just a page-level back+create button, not a full navbar; the
 * wizard step pages render only a step body fragment). The Planviry
 * nav-rail was missing, so users could not jump hotel to dinner to
 * tickets while inside the host flow — breaking the orchestration
 * promise.
 *
 * This is a server component layout. AppLayoutShell is the thin
 * client wrapper around AppLayout that lets server components opt in.
 *
 * Note on the wizard step pages: each step page is a "use client"
 * component that calls useFormContext from react-hook-form. A
 * matching FormProvider ancestor is NOT provided by this layout
 * (nor by any layout in the chain) — the wizard's form state is
 * owned by CreateListingFormProvider (under the [id] / components
 * folder), which must be rendered by a parent page or layout that
 * fetches the draft listing server-side and supplies defaultValues
 * and listingId.
 *
 * At time of writing, no such [id] page.tsx or [id] layout.tsx
 * exists in the route tree, so direct navigation to any wizard step
 * page will crash at useFormContext. Per task instructions, this
 * layout does NOT inject FormProvider — the wizard form-state flow
 * is non-trivial (it persists drafts via updateDraftListing and
 * tracks visitedSteps and currentStep inside the form values
 * themselves) and must be wired up deliberately, not patched here.
 * This layout only ensures the AppLayoutShell wraps the wizard
 * steps so the sidebar is visible regardless of how the form state
 * is (or is not) provided.
 */
export default function HostingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayoutShell>{children}</AppLayoutShell>
}
