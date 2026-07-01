import { permanentRedirect } from 'next/navigation'

/**
 * P4-5: /tickets/sports/team/[team] → /tickets/whats-on?type=sports&team=[team]
 */
export default async function SportsTeamRedirect({
  params,
}: {
  params: Promise<{ team: string }>
}) {
  const { team } = await params
  permanentRedirect(`/tickets/whats-on?type=sports&team=${encodeURIComponent(team)}`)
}
