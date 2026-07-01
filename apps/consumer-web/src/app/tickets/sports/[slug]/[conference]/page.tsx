import { permanentRedirect } from 'next/navigation'

/**
 * P4-5: /tickets/sports/[slug]/[conference] → /tickets/whats-on?type=sports&slug=[slug]&conference=[conference]
 */
export default async function SportsSlugConferenceRedirect({
  params,
}: {
  params: Promise<{ slug: string; conference: string }>
}) {
  const { slug, conference } = await params
  permanentRedirect(
    `/tickets/whats-on?type=sports&slug=${encodeURIComponent(slug)}&conference=${encodeURIComponent(conference)}`,
  )
}
