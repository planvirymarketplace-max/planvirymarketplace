import { redirect } from 'next/navigation'
import { params } from 'next/params'

// /travel/[id] → renders Staybnb listing detail (lodging module)
export default async function TravelListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/lodging/${id}`)
}
