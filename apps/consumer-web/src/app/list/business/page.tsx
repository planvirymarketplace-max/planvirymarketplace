import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next'
import { UnifiedPageShell, type Breadcrumb } from '@/components/UnifiedPageShell'
import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'List Your Business | Planviry',
  description: 'List your business on Planviry.',
}

export default function ListBusinessPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'List Your Business' },
  ]

  const steps = [
    { title: 'Create your profile', text: 'Tell us about your business — name, category, service area.' },
    { title: 'Showcase your work', text: 'Upload photos, set packages and pricing, add availability.' },
    { title: 'Get booked', text: 'Receive inquiries and bookings from event planners.' },
  ]

  return <AppLayoutShell>
    <UnifiedPageShell
      eyebrow="FOR VENDORS"
      title="List Your Business"
      subtitle="Reach event planners searching for vendors like you."
      breadcrumbs={breadcrumbs}
      showSearch={false}
    >
      <div className="max-w-2xl">
        {/* Steps */}
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

        {/* CTA */}
        <Link
          href="/vendor/onboarding"
          className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors text-sm uppercase tracking-wider"
        >
          <Building2 className="w-4 h-4" />
          Start Your Listing
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Quick stats */}
        <div className="mt-8 flex gap-8">
          <div>
            <p className="text-2xl font-black text-black">449</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Categories</p>
          </div>
          <div>
            <p className="text-2xl font-black text-black">78+</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">US Cities</p>
          </div>
          <div>
            <p className="text-2xl font-black text-black">Free</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">To List</p>
          </div>
        </div>
      </div>
    </UnifiedPageShell>
  </AppLayoutShell>

}
