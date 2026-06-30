'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { useRouter } from 'next/navigation'
import { GalleryVideosPage } from '@/components/pages/GalleryPages'

export default function Page() {
  const router = useRouter()
  return <AppLayoutShell><GalleryVideosPage navigate={(path) => router.push(path)} /></AppLayoutShell>
}
