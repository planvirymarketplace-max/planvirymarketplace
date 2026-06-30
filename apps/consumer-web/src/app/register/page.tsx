'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { RegisterPage } from '@/components/pages/AuthPages'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><RegisterPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
