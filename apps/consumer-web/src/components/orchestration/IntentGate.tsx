'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SURFACE_DATA } from '@/lib/surface-data'
import { SEO_LOCATIONS } from '@/data/seo-locations'

interface IntentGateProps {
  surface: string
  missing: 'both' | 'where' | 'what'
  existingWhat?: string
  existingWhere?: string
}

export function IntentGate({ surface, missing, existingWhat, existingWhere }: IntentGateProps) {
  const router = useRouter()
  const surfaceData = SURFACE_DATA[surface] || SURFACE_DATA['plan']
  const whatLabel = surfaceData.whatLabel
  const whatNoun = whatLabel.toLowerCase()

  const [what, setWhat] = useState(existingWhat || '')
  const [where, setWhere] = useState(existingWhere || '')

  const handleContinue = () => {
    const params = new URLSearchParams()
    if (what) params.set('what', what)
    if (where) params.set('where', where)
    router.push(`/${surface}?${params.toString()}`)
  }

  const needsWhat = missing === 'both' || missing === 'what'
  const needsWhere = missing === 'both' || missing === 'where'

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column: Immersive Visual */}
      <section className="relative w-full md:w-1/2 h-[40vh] md:h-auto overflow-hidden">
        <div className="absolute inset-0 bg-midnight-slate/20 z-10"></div>
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-10000 hover:scale-110"
          style={{ backgroundImage: `url(${surfaceData.heroImage})` }}
        ></div>
        <div className="absolute bottom-12 left-margin-mobile md:left-margin-desktop z-20 max-w-md">
          <div className="mt-8 h-px w-24 bg-champagne-gold"></div>
          <p className="mt-4 text-white/80 font-body-lg text-body-lg max-w-sm">{surfaceData.heroCopy}</p>
        </div>
      </section>

      {/* Right Column: Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-white">
        <div className="w-full max-w-lg">
          <div className="mb-12">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-midnight-slate mb-4">
              {missing === 'both' && `Tell us your ${whatNoun} and where`}
              {missing === 'what' && `What ${whatNoun} are you looking for?`}
              {missing === 'where' && 'Where are you going?'}
            </h1>
            <div className="h-1 w-12 bg-champagne-gold mb-8"></div>
          </div>

          <form className="space-y-12">
            {/* Occasion Section */}
            {needsWhat && (
              <div className="group">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-champagne-gold text-2xl">{surfaceData.icon}</span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-midnight-slate">Set Your {whatLabel}</h3>
                    <p className="font-body-md text-body-md text-midnight-slate/50">Which {whatNoun}?</p>
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={what}
                    onChange={(e) => setWhat(e.target.value)}
                    className="w-full border-b border-midnight-slate/20 focus:border-midnight-slate py-4 font-body-lg text-body-lg bg-transparent outline-none transition-all duration-300 form-select-custom rounded-none cursor-pointer"
                  >
                    <option disabled value="">{surfaceData.whatPlaceholder}</option>
                    {surfaceData.whatOptions.map((opt) => (
                      <option key={opt.value} value={opt.label}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Location Section */}
            {needsWhere && (
              <div className="group">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-champagne-gold text-2xl">location_on</span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-midnight-slate">Set Your Location</h3>
                    <p className="font-body-md text-body-md text-midnight-slate/50">Where do you want to go?</p>
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    className="w-full border-b border-midnight-slate/20 focus:border-midnight-slate py-4 font-body-lg text-body-lg bg-transparent outline-none transition-all duration-300 form-select-custom rounded-none cursor-pointer"
                  >
                    <option disabled value="">Select a destination</option>
                    {SEO_LOCATIONS.slice(0, 50).map((loc) => (
                      <option key={loc.slug} value={`${loc.city}, ${loc.state}`}>
                        {loc.city}, {loc.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* CTA Action */}
            <div className="pt-8">
              <button
                type="button"
                onClick={handleContinue}
                disabled={(needsWhat && !what) || (needsWhere && !where)}
                className="w-full h-16 bg-midnight-slate text-white font-label-md text-label-md uppercase tracking-widest hover:bg-black transition-all duration-300 flex items-center justify-center gap-4 group rounded-none active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <p className="mt-6 text-center font-label-sm text-label-sm text-midnight-slate/40 tracking-wider">
                By continuing, you agree to the Planviry Terms of Service.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
