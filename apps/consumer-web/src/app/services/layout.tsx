import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Event Services in Milwaukee | Planviry',
  description: 'DJ services, photo booth rentals, and mobile event vans in Milwaukee. Book the best for your event.',
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
