'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { ClaimProfilePage } from '@/components/pages/ClaimProfilePage'
import { useAppNavigate } from '@/hooks/use-app-navigate'

export default function Page() {
  const navigate = useAppNavigate()
  return <AppLayoutShell><ClaimProfilePage navigate={navigate} /></AppLayoutShell>
}
