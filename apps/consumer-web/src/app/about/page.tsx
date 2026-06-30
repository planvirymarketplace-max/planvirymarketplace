'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { AboutPage } from '@/components/pages/AboutPage'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><AboutPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
