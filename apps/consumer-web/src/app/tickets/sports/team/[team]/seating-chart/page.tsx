import { permanentRedirect } from 'next/navigation'

/**
 * P4-5: /tickets/sports/team/[team]/seating-chart → /tickets/whats-on?type=sports&team=[team]&view=seating-chart
 */
export default async function SportsTeamSeatingRedirect({
  params,
}: {
  params: Promise<{ team: string }>
}) {
  const { team } = await params
  permanentRedirect(
    `/tickets/whats-on?type=sports&team=${encodeURIComponent(team)}&view=seating-chart`,
  )
}
