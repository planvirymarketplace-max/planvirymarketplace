import { permanentRedirect } from 'next/navigation'

/**
 * P4-5: /tickets/cities → /tickets/whats-on?type=cities (permanent redirect)
 *
 * Merges the legacy "tickets by city" landing into the unified whats-on
 * surface with a `type=cities` query param.
 */
export default function CitiesTicketsRedirect() {
  permanentRedirect('/tickets/whats-on?type=cities')
}
