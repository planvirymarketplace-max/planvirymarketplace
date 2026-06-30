import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { UnifiedPageShell, type Breadcrumb } from '@/components/UnifiedPageShell'
import Link from 'next/link'
import { Home as HomeIcon, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'List Your Property | Planviry',
  description: 'List your property on Planviry.',
}

export default function ListPropertyPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'List Your Property' },
  ]

  const steps = [
    { title: 'Describe your space', text: 'Location, size, capacity, amenities, and photos.' },
    { title: 'Set rates & rules', text: 'Nightly rates, event pricing, availability calendar.' },
    { title: 'Welcome guests', text: 'Receive booking requests from travelers and planners.' },
  ]

  return <AppLayoutShell>
    <UnifiedPageShell
      eyebrow="FOR PROPERTY HOSTS"
      title="List Your Property"
      subtitle="Rent your space for events and overnight stays."
      breadcrumbs={breadcrumbs}
      showSearch={false}
    >
      <div className="max-w-2xl">
        <div className="space-y-6 mb-8">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-black shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="text-base font-black text-black">{step.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/vendor/onboarding"
          className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors text-sm uppercase tracking-wider"
        >
          <HomeIcon className="w-4 h-4" />
          List Your Property
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="mt-8 flex gap-8">
          <div>
            <p className="text-2xl font-black text-black">Free</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">To List</p>
          </div>
          <div>
            <p className="text-2xl font-black text-black">$1M</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Host Protection</p>
          </div>
        </div>
      </div>
    </UnifiedPageShell>
  </AppLayoutShell>

}
