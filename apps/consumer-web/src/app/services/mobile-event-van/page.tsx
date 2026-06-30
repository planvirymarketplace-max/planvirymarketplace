'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { MobileEventVanPage } from '@/components/pages/ServicePages'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><MobileEventVanPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}

