'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { BookingPaymentPage } from '@/components/pages/BookingPages'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><BookingPaymentPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
