'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { LoginPage } from '@/components/pages/AuthPages'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><LoginPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
