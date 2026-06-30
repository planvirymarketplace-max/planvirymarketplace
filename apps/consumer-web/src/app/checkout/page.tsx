import { AppLayoutShell } from '@/components/AppLayoutShell'
import { Suspense } from 'react'
import { CheckoutContent } from '@/components/checkout/CheckoutContent'

export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  return <AppLayoutShell>
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-coral rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  </AppLayoutShell>

}
