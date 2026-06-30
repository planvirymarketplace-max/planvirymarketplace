import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { UnifiedPageShell, type Breadcrumb } from '@/components/UnifiedPageShell'
import Link from 'next/link'
import { CalendarPlus, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'List Your Event | Planviry',
  description: 'Publish your event on Planviry.',
}

export default function ListEventPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'List Your Event' },
  ]

  const steps = [
    { title: 'Add event details', text: 'Name, date, venue, and description.' },
    { title: 'Set ticketing', text: 'Free, paid, or donation. Set quantities and pricing.' },
    { title: 'Publish', text: 'Your event appears in search and category pages.' },
  ]

  return <AppLayoutShell>
    <UnifiedPageShell
      eyebrow="FOR EVENT ORGANIZERS"
      title="List Your Event"
      subtitle="Publish your event and sell tickets."
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
          href="/planner"
          className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors text-sm uppercase tracking-wider"
        >
          <CalendarPlus className="w-4 h-4" />
          Create Your Event
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </UnifiedPageShell>
  </AppLayoutShell>

}
