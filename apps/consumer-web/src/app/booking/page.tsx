'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { BookingPage } from '@/components/pages/BookingPages'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><BookingPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
