'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { FAQPage } from '@/components/pages/FAQPage'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><FAQPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
