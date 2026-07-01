import { redirect } from 'next/navigation'

// /travel → redirects to lodging search (Staybnb module)
// The travel vertical is the lodging layer: hotels, vacation rentals, homes
export default function TravelPage() {
  redirect('/travel/search')
}
