'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { RavesWarehousePage } from '@/components/pages/EventPages'
import { useAppNavigate } from '@/hooks/use-app-navigate'

export default function Page() {
  const navigate = useAppNavigate()
  return <AppLayoutShell><RavesWarehousePage navigate={navigate} /></AppLayoutShell>
}
