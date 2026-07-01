import { permanentRedirect } from 'next/navigation'

/**
 * P4-4: /venue/[slug] → /spaces/[slug] (permanent redirect)
 *
 * Collapses the Ticketmaster-venue path into the canonical /spaces/[slug]
 * surface. /spaces is the venue-rental vertical (P4-1: VENUE_RENTAL category).
 *
 * Note: `permanentRedirect` issues HTTP 308 (the modern permanent redirect
 * that preserves method+body). Search engines treat 308 and 301 identically.
 */
export default async function VenueSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  permanentRedirect(`/spaces/${slug}`)
}
