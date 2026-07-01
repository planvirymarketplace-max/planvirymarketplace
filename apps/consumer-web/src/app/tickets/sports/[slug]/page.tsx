import { permanentRedirect } from 'next/navigation'

/**
 * P4-5: /tickets/sports/[slug] → /tickets/whats-on?type=sports&slug=[slug]
 */
export default async function SportsSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  permanentRedirect(`/tickets/whats-on?type=sports&slug=${encodeURIComponent(slug)}`)
}
