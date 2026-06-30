'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { ServiceAreaPage } from '@/components/pages/ServiceAreaPage'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><ServiceAreaPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
