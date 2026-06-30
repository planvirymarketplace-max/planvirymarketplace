'use client'

import { AppLayout } from '@/components/AppLayout'

/**
 * AppLayoutShell — client wrapper that lets server components (async page.tsx files)
 * use the AppLayout shell. Server components can't render client components that
 * use hooks directly in some cases, so this wrapper handles the boundary.
 *
 * Usage in a server component:
 *   import { AppLayoutShell } from '@/components/AppLayoutShell'
 *   return <AppLayoutShell>{children}</AppLayoutShell>
 */
export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}
