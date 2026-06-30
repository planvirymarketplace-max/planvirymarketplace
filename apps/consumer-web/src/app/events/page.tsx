'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { EventsPage } from '@/components/pages/EventsPage'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><EventsPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}

