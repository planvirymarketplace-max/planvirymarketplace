'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { ConcertHallsPage } from '@/components/pages/EventPages'
import { useAppNavigate } from '@/hooks/use-app-navigate'

export default function Page() {
  const navigate = useAppNavigate()
  return <AppLayoutShell><ConcertHallsPage navigate={navigate} /></AppLayoutShell>
}
