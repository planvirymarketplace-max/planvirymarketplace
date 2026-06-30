import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Milwaukee Vendor Directory | Planviry',
  description: 'Browse Milwaukee\'s best event vendors - DJs, venues, caterers, photographers, planners, and more. Filter by neighborhood, price, rating, and category.',
  keywords: ['Milwaukee vendors', 'Milwaukee event vendors', 'Milwaukee DJs', 'Milwaukee venues', 'Milwaukee caterers', 'Milwaukee photographers', 'Milwaukee event planners', 'Planviry'],
  openGraph: {
    title: 'Milwaukee Vendor Directory | Planviry',
    description: 'Browse Milwaukee\'s best event vendors. Filter by category, neighborhood, price, and rating.',
    type: 'website',
    siteName: 'Planviry',
  },
}

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
