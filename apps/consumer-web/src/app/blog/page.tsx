'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { BlogPage } from '@/components/pages/BlogPage'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><BlogPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
