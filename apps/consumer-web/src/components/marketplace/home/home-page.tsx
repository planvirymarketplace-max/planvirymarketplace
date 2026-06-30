'use client'

import { motion } from 'framer-motion'
import { Search, BarChart3, CalendarCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroSection } from './hero-section'
import { CategoryGrid } from './category-grid'
import { FeaturedVendors } from './featured-vendors'
import { StatsSection } from './stats-section'
import { useAppStore } from '@/lib/store'

const howItWorks = [
  {
    icon: Search,
    title: 'Search',
    description: 'Browse thousands of verified professionals by category, location, or service type.',
    step: '1',
  },
  {
    icon: BarChart3,
    title: 'Compare',
    description: 'Read reviews, compare ratings and prices to find the perfect match for your needs.',
    step: '2',
  },
  {
    icon: CalendarCheck,
    title: 'Book',
    description: 'Book directly online, communicate with your vendor, and get the job done right.',
    step: '3',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function HowItWorksSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          How It Works
        </h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Finding and booking a trusted professional has never been easier
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
      >
        {howItWorks.map((step, index) => (
          <motion.div key={step.step} variants={itemVariants} className="text-center">
            <div className="relative inline-flex items-center justify-center size-16 rounded-full bg-emerald-100 mb-4">
              <step.icon className="size-7 text-emerald-600" />
              <span className="absolute -top-1 -right-1 size-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                {step.step}
              </span>
            </div>
            <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              {step.description}
            </p>
            {index < howItWorks.length - 1 && (
              <ArrowRight className="size-5 text-emerald-300 mt-4 mx-auto hidden md:block" />
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

function VendorCtaSection() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to Grow Your Business?
          </h2>
          <p className="text-emerald-100 mt-3 text-lg">
            Join thousands of vendors who are reaching new customers and growing their business on MarketHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Button
              size="lg"
              className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold min-w-[180px]"
              onClick={() => navigate('claim-vendor')}
            >
              List Your Business
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 min-w-[180px]"
              onClick={() => navigate('claim-vendor')}
            >
              Claim Your Profile
            </Button>
          </div>
          <p className="text-emerald-200/70 text-sm mt-4">
            No setup fees. No monthly charges. Only pay when you get a customer.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <FeaturedVendors />
      <StatsSection />
      <HowItWorksSection />
      <VendorCtaSection />
    </div>
  )
}
