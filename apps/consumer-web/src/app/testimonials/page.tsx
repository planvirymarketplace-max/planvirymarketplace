'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { TestimonialsPage } from '@/components/pages/TestimonialsPage'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><TestimonialsPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
