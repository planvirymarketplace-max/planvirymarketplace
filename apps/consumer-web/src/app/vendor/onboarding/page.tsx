'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Store,
  AlertCircle,
} from 'lucide-react'

// Vendor primary business categories — same set as the inventory picker on
// /vendor/create-listing so vendors can filter their primary listing type.
// FIX-10: aligned to the live Supabase `inventory_category` enum
// (SERVICE / ACTIVITY — was VENDOR_SERVICE / EXPERIENCE).
const CATEGORIES = [
  { value: 'LODGING', label: 'Lodging' },
  { value: 'EVENT_TICKET', label: 'Event Tickets' },
  { value: 'VENUE_RENTAL', label: 'Venues' },
  { value: 'SERVICE', label: 'Services' },
  { value: 'DINING', label: 'Dining' },
  { value: 'TRANSPORT', label: 'Transport' },
] as const

function deriveSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (!base) return ''
  // Append a short random suffix to avoid slug collisions on
  // vendor_accounts.slug (UNIQUE constraint).
  return `${base}-${Math.random().toString(36).slice(2, 6)}`
}

type Step = 'form' | 'creating' | 'done' | 'exists'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [existingVendor, setExistingVendor] = useState<{
    name?: string | null
    slug?: string | null
  } | null>(null)

  const [businessName, setBusinessName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [category, setCategory] = useState<string>('')
  const [description, setDescription] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [step, setStep] = useState<Step>('form')

  // Auto-derive the slug from the business name until the user manually edits
  // the slug field. After that, leave their edits alone. We do this in the
  // onChange handler (not in a useEffect) to avoid cascading renders.
  const handleBusinessNameChange = useCallback(
    (value: string) => {
      setBusinessName(value)
      if (!slugTouched) {
        setSlug(deriveSlug(value))
      }
    },
    [slugTouched],
  )

  const handleSlugChange = useCallback((value: string) => {
    setSlugTouched(true)
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, ''),
    )
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?returnTo=/vendor/onboarding'); return }
      // NOTE: Unlike /vendor/dashboard, we do NOT redirect unstaffed users
      // to /onboarding/vendor — this page IS the onboarding flow. If they
      // already have a vendor account, we'll show the "already onboarded"
      // state instead.
      const { data: staff } = await supabase
        .from('vendor_staff')
        .select('vendor_id, vendor_accounts!inner(name, slug)')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .maybeSingle()
      if (staff) {
        setExistingVendor(
          staff.vendor_accounts as { name?: string | null; slug?: string | null },
        )
        setStep('exists')
      }
      setLoading(false)
    }
    init()
  }, [])

  const canSubmit = useMemo(() => {
    return (
      businessName.trim().length > 0 &&
      slug.trim().length > 0 &&
      category.length > 0
    )
  }, [businessName, slug, category])

  const handleSubmit = async () => {
    setSubmitError('')
    if (!canSubmit) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login?returnTo=/vendor/onboarding')
      return
    }
    setStep('creating')
    try {
      // 1. Create the vendor_accounts row. status='ACTIVE' so the vendor can
      //    immediately start using the portal (the canonical /onboarding/vendor
      //    flow uses 'CLAIMED'; we use 'ACTIVE' because this is a self-serve
      //    fresh-create, not a claim of a seeded listing).
      //    The vendor_accounts schema has no `category` column — store it in
      //    the JSONB `metadata` field, mirroring the pattern in
      //    /onboarding/vendor.
      const { data: newVendor, error: vendorErr } = await supabase
        .from('vendor_accounts')
        .insert({
          name: businessName.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          status: 'ACTIVE',
          claimed_at: new Date().toISOString(),
          onboarded_at: new Date().toISOString(),
          metadata: {
            primary_category: category,
            onboarding_source: 'self_serve_vendor_portal',
          },
        })
        .select('id')
        .single()

      if (vendorErr || !newVendor?.id) {
        setStep('form')
        setSubmitError(vendorErr?.message || 'Failed to create vendor account')
        return
      }

      // 2. Link the current user as OWNER of the new vendor account.
      const { error: staffErr } = await supabase.from('vendor_staff').insert({
        vendor_id: newVendor.id,
        user_id: user.id,
        role: 'OWNER',
        status: 'ACTIVE',
        accepted_at: new Date().toISOString(),
      })

      if (staffErr) {
        // Best-effort cleanup: delete the orphan vendor account so the user
        // can retry without a slug collision.
        await supabase.from('vendor_accounts').delete().eq('id', newVendor.id)
        setStep('form')
        setSubmitError(staffErr.message)
        return
      }

      setStep('done')
      // Give the user a moment to see the success state, then redirect.
      setTimeout(() => router.push('/vendor/dashboard'), 1200)
    } catch (err) {
      setStep('form')
      setSubmitError(err instanceof Error ? err.message : 'Unexpected error during onboarding')
    }
  }

  if (loading) {
    return (
      <AppLayoutShell>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AppLayoutShell>
    )
  }

  // Already-onboarded state — show a "you're all set" CTA to the dashboard.
  if (step === 'exists' && existingVendor) {
    return (
      <AppLayoutShell>
        <div className="bg-gray-50 min-h-screen py-12 px-4">
          <div className="max-w-md mx-auto text-center">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-black mb-2">You&apos;re all set!</h1>
            <p className="text-gray-500 mb-6">
              You&apos;re linked to{' '}
              <strong>{existingVendor.name ?? 'your vendor account'}</strong>.
              Manage your listings, bookings, and analytics from the dashboard.
            </p>
            <Button onClick={() => router.push('/vendor/dashboard')}>
              Go to Vendor Dashboard
            </Button>
          </div>
        </div>
      </AppLayoutShell>
    )
  }

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>

          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-gray-500" />
            <h1 className="text-2xl font-black text-black">Vendor Onboarding</h1>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Create your vendor account to start listing across all six modules —
            lodging, event tickets, venues, services, dining, and transport.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Business details</CardTitle>
              <CardDescription>
                This creates your vendor account and links it to your user
                profile as the OWNER.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'done' ? (
                <div className="text-center py-6">
                  <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="font-bold text-green-800">Vendor account created!</p>
                  <p className="text-sm text-green-600">
                    Redirecting to dashboard…
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submitError && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="businessName">
                      Business name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="businessName"
                      value={businessName}
                      onChange={(e) => handleBusinessNameChange(e.target.value)}
                      placeholder="e.g. Austin DJ Services"
                      autoComplete="organization"
                      disabled={step === 'creating'}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="slug">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="auto-derived from name"
                      className="font-mono"
                      disabled={step === 'creating'}
                    />
                    <p className="text-xs text-gray-400">
                      Used in your public URL. Auto-derived from the business
                      name with a random suffix to keep it unique — edit if
                      you&apos;d like.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="category">
                      Primary category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={category}
                      onValueChange={(v) => setCategory(v)}
                      disabled={step === 'creating'}
                    >
                      <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="Pick your main business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400">
                      You can list inventory in any of the six modules later —
                      this just sets your default.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell customers what you do in a sentence or two."
                      rows={3}
                      disabled={step === 'creating'}
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || step === 'creating'}
                    className="w-full"
                    size="lg"
                  >
                    {step === 'creating' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      <>
                        Create vendor account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-400 text-center pt-2">
                    Prefer to claim an existing listing?{' '}
                    <Link
                      href="/onboarding/vendor"
                      className="underline hover:text-gray-700"
                    >
                      Use the claim flow
                    </Link>
                    .
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayoutShell>
  )
}
