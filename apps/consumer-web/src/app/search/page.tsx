'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { SearchPage } from '@/components/pages/SearchPage'
import { useAppNavigate } from '@/hooks/use-app-navigate'

export default function Page() {
  const navigate = useAppNavigate()
  return <AppLayoutShell><SearchPage navigate={navigate} /></AppLayoutShell>
}
