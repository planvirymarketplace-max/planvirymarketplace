'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { BookingConfirmationPage } from '@/components/pages/BookingPages'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><BookingConfirmationPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
