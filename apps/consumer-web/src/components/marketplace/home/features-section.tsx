'use client'

import { ShoppingCart, CreditCard, CalendarSync, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: ShoppingCart,
    number: '01',
    title: 'Unified Cart System',
    subtitle: 'Assemble Your Dream Team in One Tap',
    description: 'Add multiple vendors to a single cart - venues, DJs, caterers, photographers - and book them all together.',
  },
  {
    icon: CreditCard,
    number: '02',
    title: 'Consolidated Checkout',
    subtitle: 'Single Down Deposit',
    description: 'One payment splits automatically to all vendors. Pay a single deposit instead of juggling multiple invoices.',
  },
  {
    icon: CalendarSync,
    number: '03',
    title: 'Automatic Sync',
    subtitle: 'Calendar Match Engine',
    description: 'Real-time availability checks across all your selected vendors. No double bookings, no scheduling conflicts.',
  },
  {
    icon: ShieldCheck,
    number: '04',
    title: 'Security Guard',
    subtitle: 'No Unverified Listings, No Bad Actors',
    description: 'Every vendor is vetted and verified. Reviews are authenticated. Your event is in trusted hands.',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-[#F8F7F2] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-[var(--font-playfair)]">
            Why Planviry?
          </h2>
          <p className="mt-2 text-slate-500 text-sm">
            Built for Milwaukee couples who want it done right
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.number}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon className="size-5 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-slate-100 font-[var(--font-playfair)]">
                    {feature.number}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                  {feature.title}
                </h3>
                <p className="text-base font-semibold text-blue-600 mt-1">
                  {feature.subtitle}
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
