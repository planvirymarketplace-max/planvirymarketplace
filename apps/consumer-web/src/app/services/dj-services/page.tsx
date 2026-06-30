'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { DJServicesPage } from '@/components/pages/ServicePages'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><DJServicesPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}

