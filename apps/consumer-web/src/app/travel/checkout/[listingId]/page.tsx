import { redirect } from 'next/navigation'

export default async function TravelCheckoutPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = await params
  redirect(`/lodging/checkout/${listingId}`)
}
