'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ChevronRight, Check, Building, Shield, Image, Package, CreditCard, Loader2 } from 'lucide-react'

const STEPS = [
  { id: 'business_info', label: 'Business Info', icon: Building },
  { id: 'verification', label: 'Verification', icon: Shield },
  { id: 'portfolio', label: 'Portfolio', icon: Image },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'payout', label: 'Payout Setup', icon: CreditCard },
  { id: 'complete', label: 'Complete', icon: Check },
]

export default function VendorOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState('business_info')
  const [vendor, setVendor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?next=/vendor/onboarding'); return }

      const { data: vendorData } = await supabase
        .from('vendors')
        .select('id, onboarding_step, business_name, status')
        .eq('user_id', user.id)
        .single()

      if (vendorData) {
        setVendor(vendorData)
        setCurrentStep(vendorData.onboarding_step || 'business_info')
        if (vendorData.onboarding_step === 'complete') {
          router.push('/vendor/portal/dashboard')
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const saveStep = async (step: string, data: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const nextStep = STEPS[STEPS.findIndex(s => s.id === step) + 1]?.id || 'complete'

    if (vendor) {
      await supabase
        .from('vendors')
        .update({ ...data, onboarding_step: nextStep })
        .eq('id', vendor.id)
    } else {
      const { data: newVendor } = await supabase
        .from('vendors')
        .insert({ ...data, user_id: user.id, onboarding_step: nextStep, status: 'pending_approval', profile_published: false })
        .select()
        .single()
      setVendor(newVendor)
    }

    setCurrentStep(nextStep)
    if (nextStep === 'complete') {
      router.push('/vendor/portal/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral" />
      </div>
    )
  }

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm text-white/60 hover:text-white">← Back to Planviry</Link>
          <h1 className="text-lg font-bold">Vendor Onboarding</h1>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const isDone = i < currentStepIndex
            const isCurrent = i === currentStepIndex
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`flex flex-col items-center gap-1 ${isCurrent ? 'text-coral' : isDone ? 'text-green-600' : 'text-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCurrent ? 'border-coral bg-coral/10' : isDone ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
                    {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < currentStepIndex ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-2xl mx-auto py-8 px-6">
        {currentStep === 'business_info' && <BusinessInfoStep vendor={vendor} onSave={(data) => saveStep('business_info', data)} />}
        {currentStep === 'verification' && <VerificationStep vendor={vendor} onSave={() => saveStep('verification', {})} />}
        {currentStep === 'portfolio' && <PortfolioStep vendor={vendor} onSave={() => saveStep('portfolio', {})} />}
        {currentStep === 'packages' && <PackagesStep vendor={vendor} onSave={() => saveStep('packages', {})} />}
        {currentStep === 'payout' && <PayoutStep vendor={vendor} onSave={() => saveStep('payout', {})} />}
      </div>
    </div>
  )
}

function BusinessInfoStep({ vendor, onSave }: { vendor: any; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    business_name: vendor?.business_name || '',
    bio: vendor?.bio || '',
    tagline: vendor?.tagline || '',
    contact_phone: vendor?.contact_phone || '',
    contact_email: vendor?.contact_email || '',
    website: vendor?.website || '',
    home_zip: vendor?.home_zip || '',
    service_radius_miles: vendor?.service_radius_miles || 25,
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-black tracking-tight">Business Information</h2>
      <p className="text-sm text-gray-500">Tell planners who you are and what you do.</p>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Business Name *</label>
          <input value={form.business_name} onChange={e => setForm({...form, business_name: e.target.value})} className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Tagline</label>
          <input value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} placeholder="Photographer in Memphis, TN" className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Bio *</label>
          <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={4} placeholder="Min 50 characters. Describe your services, experience, and what makes you unique." className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone *</label>
            <input value={form.contact_phone} onChange={e => setForm({...form, contact_phone: e.target.value})} className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email *</label>
            <input value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Website</label>
            <input value={form.website} onChange={e => setForm({...form, website: e.target.value})} className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Home ZIP *</label>
            <input value={form.home_zip} onChange={e => setForm({...form, home_zip: e.target.value})} className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Service Radius (miles)</label>
          <input type="number" value={form.service_radius_miles} onChange={e => setForm({...form, service_radius_miles: parseInt(e.target.value)})} className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black" />
        </div>
      </div>
      <button onClick={() => onSave(form)} disabled={!form.business_name || !form.bio || form.bio.length < 50} className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-coral transition-colors disabled:opacity-50">
        Save & Continue
      </button>
    </div>
  )
}

function VerificationStep({ vendor, onSave }: { vendor: any; onSave: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-black tracking-tight">Verification</h2>
      <p className="text-sm text-gray-500">Upload your Certificate of Insurance and business license. Admin will review asynchronously.</p>
      <div className="space-y-3">
        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
          <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-black">Certificate of Insurance (COI)</p>
          <p className="text-xs text-gray-400 mt-1">PDF upload — earns Insured badge when verified</p>
          <button className="mt-3 text-xs font-bold text-coral">Upload COI</button>
        </div>
        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
          <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-black">Business License</p>
          <p className="text-xs text-gray-400 mt-1">PDF upload — optional but recommended</p>
          <button className="mt-3 text-xs font-bold text-coral">Upload License</button>
        </div>
      </div>
      <p className="text-xs text-gray-400">You can continue without waiting for admin review. Documents are reviewed asynchronously.</p>
      <button onClick={onSave} className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-coral transition-colors">
        Continue to Portfolio
      </button>
    </div>
  )
}

function PortfolioStep({ vendor, onSave }: { vendor: any; onSave: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-black tracking-tight">Portfolio</h2>
      <p className="text-sm text-gray-500">Upload at least 1 photo to continue. 3+ photos recommended for best results.</p>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
            <Image className="w-6 h-6 text-gray-300" />
          </div>
        ))}
      </div>
      <button onClick={onSave} className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-coral transition-colors">
        Continue to Packages
      </button>
    </div>
  )
}

function PackagesStep({ vendor, onSave }: { vendor: any; onSave: () => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-black tracking-tight">Packages</h2>
      <p className="text-sm text-gray-500">Create at least 1 package with a price. This is what planners will book.</p>
      <div className="p-4 border border-gray-200 rounded-xl space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Package Name</label>
          <input placeholder="e.g. Wedding Photography - Full Day" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Base Price ($)</label>
          <input type="number" placeholder="2500" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>
      <button onClick={onSave} className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-coral transition-colors">
        Continue to Payout Setup
      </button>
    </div>
  )
}

function PayoutStep({ vendor, onSave }: { vendor: any; onSave: () => void }) {
  return <AppLayoutShell>
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-black tracking-tight">Payout Setup</h2>
      <p className="text-sm text-gray-500">Connect your Stripe account to receive payouts. Planviry uses Stripe Connect Express — we never see your bank details.</p>
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <CreditCard className="w-8 h-8 text-coral mb-3" />
        <p className="text-sm font-bold text-black">Stripe Connect Express</p>
        <p className="text-xs text-gray-500 mt-1">Click below to be redirected to Stripe's secure onboarding. You'll return here when complete.</p>
      </div>
      <p className="text-xs text-gray-400">Stripe connection is required to publish your profile and accept bookings.</p>
      <button onClick={onSave} className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-coral transition-colors">
        Connect Stripe & Complete
      </button>
    </div>
  </AppLayoutShell>

}
