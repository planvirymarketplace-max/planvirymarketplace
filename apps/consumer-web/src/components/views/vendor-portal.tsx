'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard, User, List, Inbox, LogOut, CheckCircle2,
  XCircle, AlertCircle, ChevronRight, Save, Eye, EyeOff, Globe,
  Phone, Mail, MapPin, DollarSign, FileText, Image, Building2, Loader2
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

type ViewName = 'home' | 'directory' | 'cart' | 'vendor-detail' | 'login' | 'signup' | 'live-events' | 'vendor-portal'

interface VendorProfile {
  id: string
  business_name: string
  dba?: string
  slug?: string
  tagline?: string
  bio?: string
  phone?: string
  email?: string
  website?: string
  address_street?: string
  address_suite?: string
  address_city?: string
  address_state?: string
  address_zip?: string
  neighborhood?: string
  price_range?: string
  price_starting_at?: number
  logo_url?: string
  cover_url?: string
  is_published: boolean
  is_verified: boolean
  listing_status: string
  avg_rating?: number
  review_count?: number
  accepts_inquiries?: boolean
  instant_booking?: boolean
  deposit_pct?: number
  cancellation_policy?: string
  min_booking_notice_days?: number
}

type TabId = 'dashboard' | 'profile' | 'listing' | 'leads'

interface VendorPortalProps {
  setView: (view: ViewName) => void
}

function completionScore(p: VendorProfile | null): number {
  if (!p) return 0
  const checks = [
    !!p.business_name, !!p.bio, !!p.phone, !!p.address_street,
    !!p.address_city, !!p.logo_url, !!p.cover_url, !!p.email,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    published:       { label: 'Published',       cls: 'bg-stone-900 text-white' },
    draft:           { label: 'Draft',            cls: 'bg-stone-100 text-stone-600' },
    pending_review:  { label: 'Pending Review',   cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
    unpublished:     { label: 'Unpublished',      cls: 'bg-stone-100 text-stone-500' },
    suspended:       { label: 'Suspended',        cls: 'bg-red-50 text-red-700 border border-red-200' },
    archived:        { label: 'Archived',         cls: 'bg-stone-100 text-stone-400' },
  }
  const s = map[status] ?? { label: status, cls: 'bg-stone-100 text-stone-600' }
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase tracking-widest ${s.cls}`}>{s.label}</span>
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab({ profile, onTabChange }: { profile: VendorProfile | null; onTabChange: (t: TabId) => void }) {
  const score = completionScore(profile)
  const checks = [
    { label: 'Business name', ok: !!profile?.business_name },
    { label: 'About / Bio', ok: !!profile?.bio },
    { label: 'Phone number', ok: !!profile?.phone },
    { label: 'Street address', ok: !!profile?.address_street },
    { label: 'City', ok: !!profile?.address_city },
    { label: 'Logo', ok: !!profile?.logo_url },
    { label: 'Cover photo', ok: !!profile?.cover_url },
    { label: 'Email', ok: !!profile?.email },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-semibold text-stone-900">{profile?.business_name ?? 'Your Business'}</h2>
        {profile && <p className="text-sm text-stone-500 mt-0.5">Listing status: <StatusBadge status={profile.listing_status} /></p>}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Rating', value: profile?.avg_rating?.toFixed(1) ?? '-' },
          { label: 'Reviews', value: profile?.review_count ?? '-' },
          { label: 'Leads (month)', value: '-' },
          { label: 'Status', value: <StatusBadge status={profile?.listing_status ?? 'draft'} /> },
        ].map(s => (
          <div key={s.label} className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 mb-1">{s.label}</p>
            <p className="text-xl font-semibold text-stone-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Profile completion */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-stone-900">Profile Completion</h3>
          <span className="text-lg font-bold text-stone-900">{score}%</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2 mb-4">
          <div className="bg-stone-900 h-2 rounded-full transition-all" style={{ width: `${score}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          {checks.map(c => (
            <div key={c.label} className="flex items-center gap-2 text-sm">
              {c.ok ? <CheckCircle2 size={14} className="text-stone-600 shrink-0" /> : <XCircle size={14} className="text-stone-300 shrink-0" />}
              <span className={c.ok ? 'text-stone-700' : 'text-stone-400'}>{c.label}</span>
            </div>
          ))}
        </div>
        {score < 100 && (
          <button onClick={() => onTabChange('profile')}
            className="mt-5 w-full py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5">
            Complete Profile <ChevronRight size={14} />
          </button>
        )}
      </div>

      {score < 40 && (
        <div className="flex gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">Your profile needs to reach <strong>40% completion</strong> before you can publish your listing.</p>
        </div>
      )}
    </div>
  )
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────
function ProfileTab({ profile, token, onRefresh }: { profile: VendorProfile | null; token: string | null; onRefresh: () => void }) {
  const [form, setForm] = useState<Partial<VendorProfile>>(profile ?? {})
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => { setForm(profile ?? {}) }, [profile])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/vendor-portal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { setSaveMsg(json.error ?? 'Failed to save'); return }
      setSaveMsg('Saved!')
      onRefresh()
    } catch { setSaveMsg('Network error') }
    finally { setSaving(false) }
  }

  const field = (label: string, key: keyof VendorProfile, icon: React.ReactNode, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">{icon}</div>
        <input type={type} value={(form[key] as string) ?? ''} onChange={set(key)} placeholder={placeholder}
          className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-colors" />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-900">Business Profile</h2>
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 disabled:opacity-60 transition-colors">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {saveMsg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${saveMsg === 'Saved!' ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {saveMsg}
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Basic Info</h3>
        {field('Business name', 'business_name', <Building2 size={16} className="text-stone-400" />, 'text', 'Your Business Name')}
        {field('DBA / Doing Business As', 'dba', <Building2 size={16} className="text-stone-400" />, 'text', 'Optional alternate name')}
        {field('Tagline', 'tagline', <FileText size={16} className="text-stone-400" />, 'text', 'Short one-line description')}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">About your business</label>
          <textarea value={form.bio ?? ''} onChange={set('bio')} rows={4} placeholder="Describe your services, experience, and specialties…"
            className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors resize-none" />
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Contact</h3>
        {field('Phone', 'phone', <Phone size={16} className="text-stone-400" />, 'tel', '(414) 555-0100')}
        {field('Email', 'email', <Mail size={16} className="text-stone-400" />, 'email', 'contact@yourbusiness.com')}
        {field('Website', 'website', <Globe size={16} className="text-stone-400" />, 'url', 'https://yourbusiness.com')}
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Location</h3>
        {field('Street Address', 'address_street', <MapPin size={16} className="text-stone-400" />, 'text', '123 Main St')}
        {field('Suite / Unit', 'address_suite', <MapPin size={16} className="text-stone-400" />, 'text', 'Ste 200')}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">City</label>
            <input value={form.address_city ?? ''} onChange={set('address_city')} placeholder="Milwaukee"
              className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">State</label>
            <input value={form.address_state ?? 'WI'} onChange={set('address_state')} placeholder="WI"
              className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">ZIP</label>
            <input value={form.address_zip ?? ''} onChange={set('address_zip')} placeholder="53202"
              className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Pricing</h3>
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-2">Price Range</label>
          <div className="flex gap-2">
            {['$', '$$', '$$$', '$$$$'].map(p => (
              <button key={p} type="button" onClick={() => setForm(f => ({ ...f, price_range: f.price_range === p ? '' : p }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${form.price_range === p ? 'bg-stone-950 text-white border-stone-950' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        {field('Starting Price', 'price_starting_at', <DollarSign size={16} className="text-stone-400" />, 'number', '250')}
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Media</h3>
        {field('Logo URL', 'logo_url', <Image size={16} className="text-stone-400" />, 'url', 'https://...')}
        {field('Cover Photo URL', 'cover_url', <Image size={16} className="text-stone-400" />, 'url', 'https://...')}
      </div>
    </div>
  )
}

// ─── Listing Tab ──────────────────────────────────────────────────────────────
function ListingTab({ profile, token, onRefresh }: { profile: VendorProfile | null; token: string | null; onRefresh: () => void }) {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const score = completionScore(profile)

  const requirements = [
    { label: 'Business name', ok: !!profile?.business_name },
    { label: 'Bio / About', ok: !!profile?.bio },
    { label: 'Phone', ok: !!profile?.phone },
    { label: 'Street address', ok: !!profile?.address_street },
    { label: 'City', ok: !!profile?.address_city },
  ]
  const canPublish = score >= 40 && profile?.listing_status !== 'suspended'
  const isPublished = profile?.listing_status === 'published'

  const toggleListing = async () => {
    if (!token) return
    setBusy(true)
    setMsg('')
    const endpoint = isPublished ? '/api/vendor-portal/unpublish' : '/api/vendor-portal/publish'
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      if (!res.ok) { setMsg(json.error ?? 'Action failed'); return }
      setMsg(isPublished ? 'Listing unpublished.' : 'Listing published!')
      onRefresh()
    } catch { setMsg('Network error') }
    finally { setBusy(false) }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-stone-900">Listing Management</h2>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-900 mb-1">Current status</p>
            {profile && <StatusBadge status={profile.listing_status} />}
          </div>
          <button onClick={toggleListing} disabled={busy || !canPublish}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${isPublished ? 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
            {busy ? 'Working…' : isPublished ? 'Unpublish' : 'Publish Listing'}
          </button>
        </div>

        {msg && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${msg.includes('!') ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {msg}
          </div>
        )}
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-4">Minimum Requirements to Publish</h3>
        <div className="space-y-2.5">
          {requirements.map(r => (
            <div key={r.label} className="flex items-center gap-2.5 text-sm">
              {r.ok ? <CheckCircle2 size={16} className="text-stone-700 shrink-0" /> : <XCircle size={16} className="text-stone-300 shrink-0" />}
              <span className={r.ok ? 'text-stone-700' : 'text-stone-400'}>{r.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-stone-500">Profile completion</span>
            <span className="font-semibold text-stone-900">{score}%</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5">
            <div className="bg-stone-900 h-1.5 rounded-full transition-all" style={{ width: `${score}%` }} />
          </div>
          <p className="text-[11px] text-stone-400 mt-1.5 font-mono">Minimum 40% required to publish</p>
        </div>
      </div>
    </div>
  )
}

// ─── Leads Tab ────────────────────────────────────────────────────────────────
function LeadsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-stone-900">Leads</h2>
      <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
        <Inbox size={36} className="text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500 text-sm">Lead tracking is coming soon.</p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function VendorPortal({ setView }: VendorPortalProps) {
  const { user, session, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState('')

  const token = session?.access_token ?? null

  const fetchProfile = useCallback(async () => {
    if (!token) { setLoadingProfile(false); return }
    setLoadingProfile(true)
    setProfileError('')
    try {
      const res = await fetch('/api/vendor-portal', { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      if (!res.ok) { setProfileError(json.error ?? 'Failed to load profile'); return }
      setProfile(json.profile)
    } catch { setProfileError('Network error') }
    finally { setLoadingProfile(false) }
  }, [token])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const handleSignOut = async () => {
    await signOut()
    setView('home')
  }

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'profile',   label: 'Profile',   icon: <User size={16} /> },
    { id: 'listing',   label: 'Listing',   icon: <List size={16} /> },
    { id: 'leads',     label: 'Leads',     icon: <Inbox size={16} /> },
  ]

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 text-sm mb-4">You must be logged in to access the vendor portal.</p>
          <button onClick={() => setView('login')} className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors">
            Log In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 mb-0.5">Vendor Portal</p>
            <h1 className="text-2xl font-semibold text-stone-900">{profile?.business_name ?? user.email}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('directory')} className="text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors">
              ← Directory
            </button>
            <button onClick={handleSignOut} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors">
              <LogOut size={14} />Sign Out
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar nav */}
          <nav className="w-48 shrink-0 hidden sm:block">
            <ul className="space-y-1">
              {tabs.map(t => (
                <li key={t.id}>
                  <button onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
                    {t.icon}{t.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile tab bar */}
          <div className="sm:hidden w-full mb-6">
            <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${activeTab === t.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {loadingProfile ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-stone-400" />
              </div>
            ) : profileError ? (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{profileError}</div>
            ) : (
              <>
                {activeTab === 'dashboard' && <DashboardTab profile={profile} onTabChange={setActiveTab} />}
                {activeTab === 'profile'   && <ProfileTab profile={profile} token={token} onRefresh={fetchProfile} />}
                {activeTab === 'listing'   && <ListingTab profile={profile} token={token} onRefresh={fetchProfile} />}
                {activeTab === 'leads'     && <LeadsTab />}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
