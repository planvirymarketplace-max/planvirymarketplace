'use client'

import Link from 'next/link'
import {
  ChevronRight, Home, Check, ArrowRight, Sparkles,
  TrendingUp, Shield, DollarSign, Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const BENEFIT_ICONS: Record<string, LucideIcon> = {
  trending: TrendingUp,
  shield: Shield,
  dollar: DollarSign,
  users: Users,
}

export interface ListYourBreadcrumb {
  label: string
  href?: string
}

export interface ListStep {
  title: string
  description: string
}

export interface ListBenefit {
  icon: 'trending' | 'shield' | 'dollar' | 'users'
  title: string
  description: string
}

export interface ListYourPageData {
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  steps: ListStep[]
  benefits: ListBenefit[]
  stats: { label: string; value: string }[]
  faqs: { q: string; a: string }[]
}

interface ListYourPageProps {
  data: ListYourPageData
  breadcrumbs: ListYourBreadcrumb[]
}

export function ListYourPage({ data, breadcrumbs }: ListYourPageProps) {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            {breadcrumbs.map((item, i) => (
              <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} className="text-gray-400" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-black font-medium">{item.label}</span>
                ) : item.href ? (
                  <Link href={item.href} className="hover:text-black transition-colors flex items-center gap-1">
                    {i === 0 && <Home size={13} />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="text-gray-500">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-[10.5px] font-black uppercase tracking-widest text-coral mb-3">
              {data.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight">
              {data.title}
            </h1>
            <p className="mt-4 text-base text-gray-500 leading-relaxed">
              {data.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={data.ctaHref}
                className="inline-flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm uppercase tracking-wider"
              >
                {data.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
              {data.secondaryCtaLabel && data.secondaryCtaHref && (
                <Link
                  href={data.secondaryCtaHref}
                  className="inline-flex items-center gap-2 bg-white text-black border border-gray-300 font-bold px-6 py-3 rounded-xl hover:border-black transition-colors text-sm uppercase tracking-wider"
                >
                  {data.secondaryCtaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-black">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-black text-black tracking-tight mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.steps.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-black">
                    {i + 1}
                  </span>
                  <h3 className="text-base font-black text-black">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pl-11">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-black text-black tracking-tight mb-8 text-center">
            Why List With Planviry
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.benefits.map((benefit) => {
              const Icon = BENEFIT_ICONS[benefit.icon] || TrendingUp
              return (
                <div
                  key={benefit.title}
                  className="p-5 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-[4px_4px_0px_#e87461] transition-all"
                >
                  <Icon className="w-6 h-6 text-coral mb-3" />
                  <h3 className="text-sm font-black text-black mb-1">{benefit.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-black text-black tracking-tight mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {data.faqs.map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-black text-black mb-2 flex items-start gap-2">
                  <span className="text-coral shrink-0">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 text-center">
          <Sparkles className="w-8 h-8 text-coral mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
            Ready to get started?
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-xl mx-auto">
            Join thousands of vendors, event organizers, and property hosts on Planviry.
          </p>
          <Link
            href={data.ctaHref}
            className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm uppercase tracking-wider"
          >
            {data.ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
