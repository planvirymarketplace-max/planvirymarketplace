'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { GalleryPage } from '@/components/pages/GalleryPages'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><GalleryPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
