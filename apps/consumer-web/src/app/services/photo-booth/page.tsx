'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { PhotoBoothPage } from '@/components/pages/ServicePages'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><PhotoBoothPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}

