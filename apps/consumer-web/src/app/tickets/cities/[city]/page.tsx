import { permanentRedirect } from 'next/navigation'

/**
 * P4-5: /tickets/cities/[city] → /tickets/whats-on?type=cities&city=[city]
 */
export default async function CitiesCityRedirect({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  permanentRedirect(`/tickets/whats-on?type=cities&city=${encodeURIComponent(city)}`)
}
