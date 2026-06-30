'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { NightclubsPage } from '@/components/pages/EventPages'
import { useAppNavigate } from '@/hooks/use-app-navigate'

export default function Page() {
  const navigate = useAppNavigate()
  return <AppLayoutShell><NightclubsPage navigate={navigate} /></AppLayoutShell>
}
