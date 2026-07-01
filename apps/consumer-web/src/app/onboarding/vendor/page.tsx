'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { ArrowRight, Check, Store, Search, Plus } from 'lucide-react'

export default function VendorOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [existingVendor, setExistingVendor] = useState<any>(null)
  const [mode, setMode] = useState<'choose' | 'claim' | 'create'>('choose')
  const [claimSlug, setClaimSlug] = useState('')
  const [claimResult, setClaimResult] = useState<any>(null)
  const [claimError, setClaimError] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [vendorEmail, setVendorEmail] = useState('')
  const [vendorPhone, setVendorPhone] = useState('')
  const [vendorCity, setVendorCity] = useState('')
  const [locations, setLocations] = useState<Array<{ id: string; name: string; region: string | null }>>([])
  const [locationId, setLocationId] = useState<string>('')
  const [creating, setCreating] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?returnTo=/onboarding/vendor'); return }
      setUser(user)
      const { data: staff } = await supabase
        .from('vendor_staff')
        .select('vendor_id, role, vendor_accounts!inner(name, slug, status)')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .maybeSingle()
      if (staff) setExistingVendor(staff)

      // Load locations for the picker (used in 'create' mode).
      const { data: locs } = await supabase
        .from('locations')
        .select('id, name, region')
        .order('name')
      if (locs) {
        setLocations(locs)
        if (locs.length > 0) setLocationId(locs[0].id)
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleClaimSearch = async () => {
    setClaimError('')
    const { data, error } = await supabase
      .from('vendor_accounts')
      .select('id, name, slug, status, email')
      .or(`name.ilike.%${claimSlug}%,slug.ilike.%${claimSlug}%`)
      .eq('status', 'SEEDED')
      .limit(10)
    if (error) { setClaimError(error.message); return }
    setClaimResult(data)
  }

  const handleClaim = async (vendorId: string) => {
    const res = await fetch('/api/vendors/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendor_id: vendorId, verification_method: 'email', contact_value: user?.email }),
    })
    const data = await res.json()
    if (data.data?.claim_token || data.claim_token) {
      router.push(`/onboarding/vendor/verify?token=${data.data?.claim_token || data.claim_token}&vendor_id=${vendorId}`)
    } else {
      setClaimError(data.error?.message || data.error || 'Claim failed')
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    setClaimError('')
    if (!locationId) {
      setCreating(false)
      setClaimError('Please select a location')
      return
    }
    const slug = vendorName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).slice(2, 6)

    // Resolve the selected location so we can stamp it onto the vendor's address.
    const selectedLocation = locations.find(l => l.id === locationId)
    const addressLine = selectedLocation
      ? `${vendorCity ? vendorCity + ', ' : ''}${selectedLocation.name}${selectedLocation.region ? ', ' + selectedLocation.region : ''}`.trim()
      : vendorCity

    const { data, error } = await supabase
      .from('vendor_accounts')
      .insert({
        name: vendorName,
        slug,
        email: vendorEmail,
        phone: vendorPhone,
        address: addressLine || null,
        location_id: locationId,
        status: 'CLAIMED',
        claimed_at: new Date().toISOString(),
        // Store the linked location in metadata so it survives even if the FK
        // relationship changes later (BR: vendor_accounts.metadata is JSONB).
        metadata: {
          location_id: locationId,
          location_name: selectedLocation?.name ?? null,
          location_region: selectedLocation?.region ?? null,
          onboarding_source: 'self_serve_create',
        },
      })
      .select('id')
      .single()
    if (error) { setCreating(false); setClaimError(error.message); return }
    await supabase.from('vendor_staff').insert({ vendor_id: data.id, user_id: user.id, role: 'OWNER', status: 'ACTIVE', accepted_at: new Date().toISOString() })
    setCreating(false)
    setDone(true)
    setTimeout(() => router.push('/vendor/dashboard'), 1500)
  }

  if (loading) return <AppLayoutShell><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div></AppLayoutShell>

  if (existingVendor) {
    return (
      <AppLayoutShell>
        <div className="bg-gray-50 min-h-screen py-12 px-4">
          <div className="max-w-md mx-auto text-center">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-black mb-2">You're all set!</h1>
            <p className="text-gray-500 mb-4">You're linked to <strong>{existingVendor.vendor_accounts?.name || 'your vendor'}</strong></p>
            <button onClick={() => router.push('/vendor/dashboard')} className="bg-black text-white font-bold px-6 py-3 rounded-lg hover:bg-gray-800">
              Go to Vendor Dashboard
            </button>
          </div>
        </div>
      </AppLayoutShell>
    )
  }

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-black text-black mb-6">Vendor Onboarding</h1>

          {mode === 'choose' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => setMode('claim')} className="bg-white rounded-xl border-2 border-gray-200 p-6 text-left hover:border-black transition-colors">
                <Search className="w-8 h-8 text-gray-400 mb-3" />
                <h2 className="font-bold text-black mb-1">Claim existing listing</h2>
                <p className="text-sm text-gray-500">Your business may already be listed. Search and claim it.</p>
              </button>
              <button onClick={() => setMode('create')} className="bg-white rounded-xl border-2 border-gray-200 p-6 text-left hover:border-black transition-colors">
                <Plus className="w-8 h-8 text-gray-400 mb-3" />
                <h2 className="font-bold text-black mb-1">Create new listing</h2>
                <p className="text-sm text-gray-500">Start from scratch. Add your business name and details.</p>
              </button>
            </div>
          )}

          {mode === 'claim' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-black mb-4">Find your business</h2>
              <div className="flex gap-2 mb-4">
                <input type="text" value={claimSlug} onChange={e => setClaimSlug(e.target.value)} placeholder="Business name or city" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" onKeyDown={e => e.key === 'Enter' && handleClaimSearch()} />
                <button onClick={handleClaimSearch} className="px-4 py-2 bg-gray-100 font-bold text-sm rounded-lg hover:bg-gray-200">Search</button>
              </div>
              {claimError && <p className="text-sm text-red-500 mb-3">{claimError}</p>}
              {claimResult && claimResult.length === 0 && <p className="text-sm text-gray-400">No unclaimed listings found. Try creating a new one.</p>}
              {claimResult && claimResult.length > 0 && (
                <div className="space-y-2">
                  {claimResult.map((v: any) => (
                    <div key={v.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-black text-sm">{v.name}</p>
                        <p className="text-xs text-gray-400">{v.slug}</p>
                      </div>
                      <button onClick={() => handleClaim(v.id)} className="text-sm font-bold text-black px-3 py-1.5 border border-black rounded-lg hover:bg-black hover:text-white">
                        Claim
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setMode('choose')} className="mt-4 text-sm text-gray-400 hover:text-black">← Back</button>
            </div>
          )}

          {mode === 'create' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              {done ? (
                <div className="text-center py-4">
                  <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="font-bold text-green-800">Vendor account created!</p>
                  <p className="text-sm text-green-600">Redirecting to dashboard...</p>
                </div>
              ) : (
                <>
                  <h2 className="font-bold text-black">Create your vendor account</h2>
                  {claimError && <p className="text-sm text-red-500">{claimError}</p>}
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1">Business name *</label>
                    <input type="text" value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder="e.g. Austin DJ Services" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1">Business email *</label>
                    <input type="email" value={vendorEmail} onChange={e => setVendorEmail(e.target.value)} placeholder="contact@yourbusiness.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1">Phone</label>
                    <input type="tel" value={vendorPhone} onChange={e => setVendorPhone(e.target.value)} placeholder="(555) 123-4567" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1">City</label>
                    <input type="text" value={vendorCity} onChange={e => setVendorCity(e.target.value)} placeholder="Austin, TX" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={locationId}
                      onChange={e => setLocationId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                      required
                    >
                      {locations.length === 0 && <option value="">No locations available</option>}
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}{loc.region ? `, ${loc.region}` : ''}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      Links your business to a region in the <span className="font-mono">locations</span> table. Also written to your address.
                    </p>
                  </div>
                  <button onClick={handleCreate} disabled={creating || !vendorName || !vendorEmail || !locationId} className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2">
                    {creating ? 'Creating...' : <>Create & Continue <ArrowRight className="w-4 h-4" /></>}
                  </button>
                  <button onClick={() => setMode('choose')} className="w-full text-sm text-gray-400 hover:text-black">← Back</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
