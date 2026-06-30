'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { ContactPage } from '@/components/pages/ContactPage'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><ContactPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
