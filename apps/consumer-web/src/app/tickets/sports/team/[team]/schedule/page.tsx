import { permanentRedirect } from 'next/navigation'

/**
 * P4-5: /tickets/sports/team/[team]/schedule → /tickets/whats-on?type=sports&team=[team]&view=schedule
 */
export default async function SportsTeamScheduleRedirect({
  params,
}: {
  params: Promise<{ team: string }>
}) {
  const { team } = await params
  permanentRedirect(
    `/tickets/whats-on?type=sports&team=${encodeURIComponent(team)}&view=schedule`,
  )
}
