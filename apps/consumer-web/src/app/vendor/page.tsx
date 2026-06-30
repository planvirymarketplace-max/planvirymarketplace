'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import React, { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard, User, List, Inbox, LogOut, CheckCircle2,
  XCircle, AlertCircle, ChevronRight, Save, Eye, EyeOff, Globe,
  Phone, Mail, MapPin, DollarSign, FileText, Image, Building2, Loader2,
  ArrowLeft, ShieldCheck, Search, CheckCircle
} from 'lucide-react'
import { supabaseClient } from '@/lib/supabase-client'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

// ─── Types ────────────────────────────────────────────────────────────────────
interface VendorProfile {
  id: string
  business_name: string
  dba?: string
  slug?: string
  category_id?: string | null
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
  is_claimed: boolean
  is_verified: boolean
  avg_rating?: number
  review_count?: number
  source_category?: string
  vendor_since?: string
}

interface CategoryOption {
  id: string
  name: string
  group_name: string
}

type TabId = 'dashboard' | 'profile' | 'listing' | 'claim' | 'create' | 'leads'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function completionScore(p: VendorProfile | null): number {
  if (!p) return 0
  const checks = [!!p.business_name, !!p.bio, !!p.phone, !!p.address_street, !!p.address_city, !!p.logo_url, !!p.cover_url, !!p.email]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return isPublished
    ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase tracking-widest bg-stone-900 text-white">Published</span>
    : <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase tracking-widest bg-stone-100 text-stone-600">Unpublished</span>
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
      <div>
        <h2 className="text-xl font-semibold text-stone-900">{profile?.business_name ?? 'Your Business'}</h2>
        {profile && <div className="mt-1"><StatusBadge isPublished={profile.is_published} /></div>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Rating', value: profile?.avg_rating?.toFixed(1) ?? '-' },
          { label: 'Reviews', value: profile?.review_count ?? '-' },
          { label: 'Leads (month)', value: '-' },
          { label: 'Status', value: <StatusBadge isPublished={profile?.is_published ?? false} /> },
        ].map((s, i) => (
          <div key={i} className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 mb-1">{s.label}</p>
            <p className="text-xl font-semibold text-stone-900">{s.value}</p>
          </div>
        ))}
      </div>

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
          <button onClick={() => onTabChange('profile')} className="mt-5 w-full py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5">
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
  const [categories, setCategories] = useState<CategoryOption[]>([])

  useEffect(() => { setForm(profile ?? {}) }, [profile])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(data => {
      const opts: CategoryOption[] = []
      for (const g of (data.groups ?? [])) {
        for (const c of (g.categories ?? [])) {
          opts.push({ id: c.id, name: c.name, group_name: g.name })
        }
      }
      setCategories(opts)
    }).catch(() => {})
  }, [])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    if (!token) return
    setSaving(true); setSaveMsg('')
    try {
      const res = await fetch('/api/vendor-portal', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
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
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 disabled:opacity-60 transition-colors">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {saveMsg && <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${saveMsg === 'Saved!' ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-red-50 border-red-200 text-red-700'}`}>{saveMsg}</div>}

      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Basic Info</h3>
        {field('Business name', 'business_name', <Building2 size={16} className="text-stone-400" />, 'text', 'Your Business Name')}
        {field('DBA / Doing Business As', 'dba', <Building2 size={16} className="text-stone-400" />, 'text', 'Optional alternate name')}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Category</label>
          <select
            value={form.category_id ?? ''}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value || null }))}
            className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white text-sm text-stone-700 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-colors"
          >
            <option value="">- Select a category -</option>
            {categories.reduce((acc: { groupName: string; items: CategoryOption[] }[], cat) => {
              const existing = acc.find(g => g.groupName === cat.group_name)
              if (existing) { existing.items.push(cat) } else { acc.push({ groupName: cat.group_name, items: [cat] }) }
              return acc
            }, []).map(group => (
              <optgroup key={group.groupName} label={group.groupName}>
                {group.items.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        {field('Tagline', 'tagline', <FileText size={16} className="text-stone-400" />, 'text', 'Short one-line description')}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">About your business</label>
          <textarea value={form.bio ?? ''} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4} placeholder="Describe your services…"
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
            <input value={form.address_city ?? ''} onChange={e => setForm(f => ({ ...f, address_city: e.target.value }))} placeholder="Milwaukee"
              className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">State</label>
            <input value={form.address_state ?? 'WI'} onChange={e => setForm(f => ({ ...f, address_state: e.target.value }))} placeholder="WI"
              className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">ZIP</label>
            <input value={form.address_zip ?? ''} onChange={e => setForm(f => ({ ...f, address_zip: e.target.value }))} placeholder="53202"
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
  const isPublished = profile?.is_published ?? false
  const canPublish = score >= 40

  const requirements = [
    { label: 'Business name', ok: !!profile?.business_name },
    { label: 'Bio / About', ok: !!profile?.bio },
    { label: 'Phone', ok: !!profile?.phone },
    { label: 'Street address', ok: !!profile?.address_street },
    { label: 'City', ok: !!profile?.address_city },
  ]

  const toggle = async () => {
    if (!token) return
    setBusy(true); setMsg('')
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
            {profile && <StatusBadge isPublished={profile.is_published} />}
          </div>
          <button onClick={toggle} disabled={busy || !canPublish}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${isPublished ? 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
            {busy ? 'Working…' : isPublished ? 'Unpublish' : 'Publish Listing'}
          </button>
        </div>
        {msg && <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${msg.includes('!') ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-red-50 border-red-200 text-red-700'}`}>{msg}</div>}
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-4">Minimum Requirements</h3>
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

// ─── Claim Tab ────────────────────────────────────────────────────────────────
interface ClaimCandidate {
  vendor_id: string
  business_name: string
  slug: string
  address_street?: string
  address_city?: string
  address_zip?: string
  phone?: string
  website?: string
  category_name?: string
  source_category?: string
  primary_photo_url?: string
  match_score: number
  match_signals: string[]
  name_similarity: number
}

function ClaimTab({ token, onClaimed }: { token: string | null; onClaimed: () => void }) {
  const [query, setQuery] = useState('')
  const [phone, setPhone] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<ClaimCandidate[]>([])
  const [searched, setSearched] = useState(false)
  const [selected, setSelected] = useState<ClaimCandidate | null>(null)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true); setSearched(false); setResults([])
    try {
      const params = new URLSearchParams({ q: query })
      if (phone) params.set('phone', phone)
      const res = await fetch(`/api/vendor/claim-search?${params}`)
      const json = await res.json()
      setResults(json.candidates ?? [])
      setSearched(true)
    } catch { setResults([]); setSearched(true) }
    finally { setSearching(false) }
  }

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !contactName || !contactEmail) return
    setSubmitting(true); setSubmitMsg('')
    try {
      const res = await fetch('/api/claim-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ vendor_id: selected.vendor_id, contact_name: contactName, email: contactEmail, note }),
      })
      const json = await res.json()
      if (!res.ok) { setSubmitMsg(json.error ?? 'Submission failed'); return }
      setSubmitted(true)
      onClaimed()
    } catch { setSubmitMsg('Network error') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">Claim Your Business Listing</h2>
        <p className="text-sm text-stone-500 mt-1">Search for your business in our directory and claim ownership to manage your profile.</p>
      </div>

      {submitted ? (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center">
          <CheckCircle size={32} className="text-stone-700 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-900 mb-1">Claim Request Submitted</h3>
          <p className="text-sm text-stone-500">Our team will review your request and reach out within 2–3 business days.</p>
        </div>
      ) : selected ? (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-200 rounded-2xl">
            <ShieldCheck size={20} className="text-stone-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-stone-900">{selected.business_name}</p>
              <p className="text-xs text-stone-500">{[selected.address_street, selected.address_city].filter(Boolean).join(', ')}</p>
            </div>
            <button onClick={() => setSelected(null)} className="ml-auto text-xs text-stone-400 hover:text-stone-700">Change</button>
          </div>
          <form onSubmit={handleClaim} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Your Contact Details</h3>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Full Name *</label>
              <input required value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Jane Smith"
                className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white text-sm focus:outline-none focus:border-stone-400 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Business Email *</label>
              <input type="email" required value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="owner@business.com"
                className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white text-sm focus:outline-none focus:border-stone-400 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Verification Note</label>
              <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Describe how you're affiliated with this business…"
                className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white text-sm focus:outline-none focus:border-stone-400 transition-colors resize-none" />
            </div>
            {submitMsg && <p className="text-sm text-red-600">{submitMsg}</p>}
            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              {submitting ? 'Submitting…' : 'Submit Claim Request'}
            </button>
          </form>
        </div>
      ) : (
        <>
          <form onSubmit={handleSearch} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Find Your Business</h3>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Business Name *</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. Milwaukee Airwaves DJ"
                  className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white text-sm focus:outline-none focus:border-stone-400 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Phone (optional - improves matching)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(414) 555-0100"
                  className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white text-sm focus:outline-none focus:border-stone-400 transition-colors" />
              </div>
            </div>
            <button type="submit" disabled={searching || !query.trim()}
              className="w-full py-3 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              {searching ? 'Searching…' : 'Search Directory'}
            </button>
          </form>

          {searched && (
            <div className="space-y-3">
              {results.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center">
                  <p className="text-stone-500 text-sm mb-1">No matching businesses found.</p>
                  <p className="text-xs text-stone-400">Try a shorter name or use the Create New tab to add your business.</p>
                </div>
              ) : (
                results.map(r => (
                  <div key={r.vendor_id} className="group bg-white border border-stone-200 rounded-xl overflow-hidden flex hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelected(r)}>
                    <div className="w-[120px] sm:w-[160px] flex-shrink-0 bg-stone-100 flex items-center justify-center">
                      {r.primary_photo_url
                        ? <img src={r.primary_photo_url} alt={r.business_name} className="h-full w-full object-cover" />
                        : <Building2 size={28} className="text-stone-300" />}
                    </div>
                    <div className="flex-1 min-w-0 p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-stone-900 text-[16px]">{r.business_name}</h3>
                        <p className="text-sm text-stone-400 mt-0.5">{r.category_name ?? r.source_category ?? ''}</p>
                        <p className="text-sm text-stone-500 mt-1">{[r.address_street, r.address_city].filter(Boolean).join(', ')}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-1.5">
                          {r.match_signals.map(s => (
                            <span key={s} className="text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                        <button className="text-sm font-semibold text-white bg-stone-900 px-4 py-2 rounded-xl hover:bg-stone-800 transition-colors">
                          Claim This Listing
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Create Tab ────────────────────────────────────────────────────────────────
type CreateStep = 1 | 2 | 3 | 4

function CreateTab({ token, onCreated }: { token: string | null; onCreated: () => void }) {
  const [step, setStep] = useState<CreateStep>(1)
  const [form, setForm] = useState({
    business_name: '', category_id: '', tagline: '', bio: '',
    phone: '', email: '', website: '',
    address_street: '', address_city: 'Milwaukee', address_state: 'WI', address_zip: '',
    price_range: '', price_starting_at: '',
  })
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<{ slug: string } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(data => {
      const opts: CategoryOption[] = []
      for (const g of (data.groups ?? [])) {
        for (const c of (g.categories ?? [])) opts.push({ id: c.id, name: c.name, group_name: g.name })
      }
      setCategories(opts)
    }).catch(() => {})
  }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!token) return
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/vendor/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price_starting_at: form.price_starting_at ? Number(form.price_starting_at) : null }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Failed to create profile'); return }
      setCreated({ slug: json.slug })
      onCreated()
    } catch { setError('Network error') }
    finally { setSubmitting(false) }
  }

  if (created) {
    return (
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center space-y-3">
        <CheckCircle size={32} className="text-stone-700 mx-auto" />
        <h3 className="text-base font-semibold text-stone-900">Profile Created!</h3>
        <p className="text-sm text-stone-500">Your listing is live. You can now edit your profile in the Profile tab.</p>
        <a href={`/vendors/${created.slug}`} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors">
          View Your Listing
        </a>
      </div>
    )
  }

  const inputCls = 'block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors'
  const labelCls = 'block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5'
  const stepLabels = [{ num: 1, label: 'Business' }, { num: 2, label: 'Contact' }, { num: 3, label: 'Location' }, { num: 4, label: 'Review' }]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">Create a New Profile</h2>
        <p className="text-sm text-stone-500 mt-1">Add your business to the Planviry directory.</p>
      </div>
      <div className="flex items-center gap-2">
        {stepLabels.map((s, i) => (
          <React.Fragment key={s.num}>
            <div className={`flex items-center gap-2 ${step === s.num ? 'text-stone-900' : step > s.num ? 'text-stone-400' : 'text-stone-300'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step === s.num ? 'bg-stone-900 text-white' : step > s.num ? 'bg-stone-200 text-stone-600' : 'bg-stone-100 text-stone-400'}`}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="text-xs font-semibold hidden sm:inline">{s.label}</span>
            </div>
            {i < stepLabels.length - 1 && <div className="flex-1 h-px bg-stone-200" />}
          </React.Fragment>
        ))}
      </div>
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
        {step === 1 && (<>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Business Details</h3>
          <div><label className={labelCls}>Business Name *</label><input required value={form.business_name} onChange={set('business_name')} placeholder="Your Business Name" className={inputCls} /></div>
          <div>
            <label className={labelCls}>Category *</label>
            <select value={form.category_id} onChange={set('category_id')} className={inputCls}>
              <option value="">- Select a category -</option>
              {categories.reduce((acc: { groupName: string; items: CategoryOption[] }[], cat) => {
                const existing = acc.find(g => g.groupName === cat.group_name)
                if (existing) existing.items.push(cat)
                else acc.push({ groupName: cat.group_name, items: [cat] })
                return acc
              }, []).map(group => (
                <optgroup key={group.groupName} label={group.groupName}>
                  {group.items.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div><label className={labelCls}>Tagline</label><input value={form.tagline} onChange={set('tagline')} placeholder="Short one-line description" className={inputCls} /></div>
          <div><label className={labelCls}>About Your Business</label><textarea value={form.bio} onChange={set('bio')} rows={4} placeholder="Describe your services…" className={`${inputCls} resize-none`} /></div>
        </>)}
        {step === 2 && (<>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Contact Info</h3>
          <div><label className={labelCls}>Phone</label><input type="tel" value={form.phone} onChange={set('phone')} placeholder="(414) 555-0100" className={inputCls} /></div>
          <div><label className={labelCls}>Email</label><input type="email" value={form.email} onChange={set('email')} placeholder="contact@business.com" className={inputCls} /></div>
          <div><label className={labelCls}>Website</label><input type="url" value={form.website} onChange={set('website')} placeholder="https://yourbusiness.com" className={inputCls} /></div>
          <div>
            <label className={labelCls}>Price Range</label>
            <div className="flex gap-2">
              {['$', '$$', '$$$', '$$$$'].map(p => (
                <button key={p} type="button" onClick={() => setForm(f => ({ ...f, price_range: f.price_range === p ? '' : p }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${form.price_range === p ? 'bg-stone-950 text-white border-stone-950' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}>{p}</button>
              ))}
            </div>
          </div>
          <div><label className={labelCls}>Starting Price ($)</label><input type="number" value={form.price_starting_at} onChange={set('price_starting_at')} placeholder="250" className={inputCls} /></div>
        </>)}
        {step === 3 && (<>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Location</h3>
          <div><label className={labelCls}>Street Address</label><input value={form.address_street} onChange={set('address_street')} placeholder="123 Main St" className={inputCls} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1"><label className={labelCls}>City</label><input value={form.address_city} onChange={set('address_city')} placeholder="Milwaukee" className={inputCls} /></div>
            <div><label className={labelCls}>State</label><input value={form.address_state} onChange={set('address_state')} placeholder="WI" className={inputCls} /></div>
            <div><label className={labelCls}>ZIP</label><input value={form.address_zip} onChange={set('address_zip')} placeholder="53202" className={inputCls} /></div>
          </div>
        </>)}
        {step === 4 && (<>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">Review & Submit</h3>
          <div className="space-y-2 text-sm">
            {([['Business Name', form.business_name], ['Phone', form.phone], ['Email', form.email], ['Website', form.website],
              ['Address', [form.address_street, form.address_city, form.address_state, form.address_zip].filter(Boolean).join(', ')]] as [string, string][]).map(([label, val]) => (
              <div key={label} className="flex gap-3 py-2 border-b border-stone-100">
                <span className="w-28 shrink-0 text-stone-400 text-xs font-mono">{label}</span>
                <span className="text-stone-800 font-medium">{val || <span className="text-stone-300 italic">not set</span>}</span>
              </div>
            ))}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </>)}
      </div>
      <div className="flex items-center justify-between">
        {step > 1
          ? <button onClick={() => setStep(s => (s - 1) as CreateStep)} className="px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors">Back</button>
          : <div />}
        {step < 4
          ? <button onClick={() => setStep(s => (s + 1) as CreateStep)} disabled={step === 1 && !form.business_name}
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 disabled:opacity-50 transition-colors">Continue</button>
          : <button onClick={handleSubmit} disabled={submitting || !form.business_name}
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center gap-2">
              {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
              {submitting ? 'Creating…' : 'Create Profile'}
            </button>}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VendorPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')

  // Auth state
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_e, s) => {
      setSession(s); setUser(s?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const token = session?.access_token ?? null

  const fetchProfile = useCallback(async () => {
    if (!token) return
    setProfileLoading(true); setProfileError('')
    try {
      const res = await fetch('/api/vendor-portal', { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      if (!res.ok) { setProfileError(json.error ?? 'Failed to load profile'); return }
      setProfile(json.profile)
    } catch { setProfileError('Network error') }
    finally { setProfileLoading(false) }
  }, [token])

  useEffect(() => { if (token) fetchProfile() }, [fetchProfile, token])

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut()
    window.location.href = '/login'
  }

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard',     icon: <LayoutDashboard size={16} /> },
    { id: 'profile',   label: 'Profile',       icon: <User size={16} /> },
    { id: 'listing',   label: 'Listing',       icon: <List size={16} /> },
    { id: 'claim',     label: 'Claim Listing', icon: <ShieldCheck size={16} /> },
    { id: 'create',    label: 'Create New',    icon: <Building2 size={16} /> },
    { id: 'leads',     label: 'Leads',         icon: <Inbox size={16} /> },
  ]

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-stone-400" />
      </div>
    )
  }

  // Auth guard - redirect to login
  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/login'
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-stone-500 text-sm">You need to be signed in to access this page.</p>
          <a href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return <AppLayoutShell>
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/directory" className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors">
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Back to Directory</span>
            </a>
            <div className="h-5 w-px bg-stone-200 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-stone-900 flex items-center justify-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <span className="text-sm font-semibold text-stone-900">Vendor Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-stone-400">Signed in as</p>
              <p className="text-sm font-medium text-stone-700 truncate max-w-[180px]">{user.email}</p>
            </div>
            <button onClick={handleSignOut} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors">
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Mobile tab bar */}
        <div className="sm:hidden mb-6">
          <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${activeTab === t.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar nav */}
          <nav className="w-52 shrink-0 hidden sm:block">
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

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {profileLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-stone-400" />
              </div>
            ) : profileError ? (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{profileError}</div>
            ) : (
              <>
                {activeTab === 'dashboard' && <DashboardTab profile={profile} onTabChange={setActiveTab} />}
                {activeTab === 'profile'   && <ProfileTab profile={profile} token={token} onRefresh={fetchProfile} />}
                {activeTab === 'listing'   && <ListingTab profile={profile} token={token} onRefresh={fetchProfile} />}
                {activeTab === 'claim'     && <ClaimTab token={token} onClaimed={fetchProfile} />}
                {activeTab === 'create'    && <CreateTab token={token} onCreated={fetchProfile} />}
                {activeTab === 'leads'     && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-stone-900">Leads</h2>
                    <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
                      <Inbox size={36} className="text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500 text-sm">Lead tracking coming soon.</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  </AppLayoutShell>

}
