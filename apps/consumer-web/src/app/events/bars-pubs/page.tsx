'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { BarsPubsPage } from '@/components/pages/EventPages'
import { useAppNavigate } from '@/hooks/use-app-navigate'

export default function Page() {
  const navigate = useAppNavigate()
  return <AppLayoutShell><BarsPubsPage navigate={navigate} /></AppLayoutShell>
}
