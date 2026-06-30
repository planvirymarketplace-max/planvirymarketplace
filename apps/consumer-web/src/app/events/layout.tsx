import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wedding Vendors in Milwaukee | Planviry',
  description: 'Find the best wedding vendors in Milwaukee - venues, DJs, photographers, caterers, planners, florists, and more.',
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
