import { AppLayoutShell } from '@/components/AppLayoutShell'
import { TravelSearchResults } from '@/components/travel/TravelSearchResults'
import { MOCK_PROPERTIES, searchProperties } from '@/data/travel-taxonomy'

interface PageProps {
  searchParams: Promise<{
    destination?: string
    from?: string
    to?: string
    travelers?: string
    category?: string
    type?: string
    addFlight?: string
    addCar?: string
  }>
}

export const metadata = {
  title: 'Search Travel | Planviry',
  description: 'Search hotels, vacation rentals, and more on Planviry Travel.',
}

export default async function TravelSearchPage({ searchParams }: PageProps) {
  const params = await searchParams
  // Start with all properties, narrow by destination if provided
  const base = params.destination
    ? searchProperties({ destination: params.destination })
    : MOCK_PROPERTIES

  // If a property type filter is in the URL, narrow further
  const properties = params.type
    ? base.filter((p) => p.typeSlug === params.type)
    : base

  return <AppLayoutShell>
    <TravelSearchResults
      searchParams={params}
      properties={properties}
      title="Travel Search"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Travel', href: '/travel' },
        { label: 'Search' },
      ]}
    />
  </AppLayoutShell>

}
