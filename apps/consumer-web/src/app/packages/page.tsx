'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { PackagesPage } from '@/components/pages/PackagesPage'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><PackagesPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
