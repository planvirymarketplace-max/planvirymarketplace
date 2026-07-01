import { redirect } from 'next/navigation'

// /travel/search → renders Staybnb search (lodging module)
// Mounted per Part 53: Staybnb pages under /travel/*
export default function TravelSearchPage() {
  redirect('/lodging/search')
}
