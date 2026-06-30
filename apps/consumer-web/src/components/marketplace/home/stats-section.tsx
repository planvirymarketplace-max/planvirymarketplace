'use client'

import { Store, LayoutGrid, Award } from 'lucide-react'

const stats = [
  {
    icon: Store,
    value: '500+',
    label: 'Verified Vendors',
  },
  {
    icon: LayoutGrid,
    value: '22',
    label: 'Categories',
  },
  {
    icon: Award,
    value: '#1',
    label: "Milwaukee Directory",
  },
]

export function StatsSection() {
  return (
    <section className="bg-white py-12 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 mb-2">
                <stat.icon className="size-5 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
