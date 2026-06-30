import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { DirectoryClient } from './client'

export const metadata: Metadata = {
  title: 'Milwaukee Event Vendor Directory | Planviry',
  description:
    "Browse Milwaukee's largest directory of event vendors - venues, DJs, photographers, caterers, florists, and more. 500+ verified vendors across 10 categories.",
  alternates: { canonical: 'https://planviry.com/directory' },
  openGraph: {
    title: 'Milwaukee Event Vendor Directory | Planviry',
    description:
      "Browse Milwaukee's largest directory of event vendors. 500+ verified vendors across 10 categories.",
    url: 'https://planviry.com/directory',
    siteName: 'Planviry',
    type: 'website',
  },
  keywords: [
    'Milwaukee event vendors',
    'Milwaukee vendor directory',
    'event vendors Milwaukee WI',
    'wedding vendors Milwaukee',
    'party vendors Milwaukee',
    'DJ Milwaukee',
    'photographer Milwaukee',
    'catering Milwaukee',
    'venue Milwaukee',
    'florist Milwaukee',
  ],
}

// ISR: revalidate every 24h
export const revalidate = 86400

export default function DirectoryPage() {
  return <AppLayoutShell><DirectoryClient /></AppLayoutShell>
}
