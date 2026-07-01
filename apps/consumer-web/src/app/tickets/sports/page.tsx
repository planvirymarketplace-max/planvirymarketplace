import { permanentRedirect } from 'next/navigation'

/**
 * P4-5: /tickets/sports → /tickets/whats-on?type=sports (permanent redirect)
 *
 * Merges the legacy Ticketmaster-style /tickets/sports path into the unified
 * EventSeats-style /tickets/whats-on surface with a `type=sports` query param.
 */
export default function SportsTicketsRedirect() {
  permanentRedirect('/tickets/whats-on?type=sports')
}
