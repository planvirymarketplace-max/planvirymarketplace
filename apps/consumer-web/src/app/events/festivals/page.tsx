'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { FestivalsPage } from '@/components/pages/EventPages'
import { useAppNavigate } from '@/hooks/use-app-navigate'

export default function Page() {
  const navigate = useAppNavigate()
  return <AppLayoutShell><FestivalsPage navigate={navigate} /></AppLayoutShell>
}
