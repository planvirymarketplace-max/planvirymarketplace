'use client'

import React, { useState } from 'react'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Building2, Phone, Globe, MapPin, FileText, CheckCircle } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase-client'
import { NAV_CATEGORIES } from '@/lib/directory-filter-data'

type ViewName = 'home' | 'directory' | 'cart' | 'vendor-detail' | 'login' | 'signup' | 'live-events'

interface SignupViewProps {
  setView: (view: ViewName) => void
}

export function SignupView({ setView }: SignupViewProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accountType, setAccountType] = useState<'customer' | 'vendor'>('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Vendor-specific fields (step 2)
  const [businessName, setBusinessName] = useState('')
  const [categorySlug, setCategorySlug] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('Milwaukee')
  const [zip, setZip] = useState('')
  const [bio, setBio] = useState('')
  const [priceRange, setPriceRange] = useState('')

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (accountType === 'vendor') { setStep(2); return }

    // Customer signup â€” create account and go home
    setIsLoading(true)
    try {
      const { error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, account_type: 'customer' } },
      })
      if (signUpError) throw signUpError
      setSuccess(true)
      setTimeout(() => setView('home'), 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!businessName || !categorySlug) { setError('Business name and category are required'); return }
    setIsLoading(true)
    try {
      // 1. Create auth user
      const { data: authData, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, account_type: 'vendor' } },
      })
      if (signUpError) throw signUpError

      // 2. Submit vendor signup form
      const res = await fetch('/api/vendor-portal/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: authData.user?.id,
          business_name: businessName,
          category_slug: categorySlug,
          contact_name: fullName,
          contact_email: email,
          phone,
          website,
          address,
          city,
          state: 'WI',
          zip,
          bio,
          price_range: priceRange || null,
        }),
      })
      if (!res.ok) {
        const { error: apiErr } = await res.json()
        throw new Error(apiErr || 'Failed to submit vendor application')
      }
      setSuccess(true)
      setTimeout(() => setView('home'), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] bg-[#FAF9F6] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-stone-950 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-stone-900 mb-2">
            {accountType === 'vendor' ? 'Application submitted!' : 'Account created!'}
          </h2>
          <p className="text-stone-500 text-sm">
            {accountType === 'vendor'
              ? 'Your vendor application is under review. We\'ll reach out within 2â€“3 business days.'
              : 'Check your email to confirm your account, then you can log in.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] bg-[#FAF9F6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back */}
        <button
          onClick={() => step === 2 ? setStep(1) : setView('home')}
          className="inline-flex items-center space-x-2 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          <span>{step === 2 ? 'Back to account details' : 'Back to home'}</span>
        </button>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setView('home')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 border border-stone-700 shadow-sm">
                <span className="font-[var(--font-display)] text-lg font-bold text-white tracking-widest">B</span>
              </div>
              <span className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-stone-900">Planviry</span>
            </div>
          </div>

          {step === 1 ? (
            <>
              <h1 className="font-[var(--font-display)] text-2xl sm:text-3xl font-medium text-stone-900 tracking-tight text-center mb-2">
                Create your account
              </h1>
              <p className="text-sm text-stone-500 text-center mb-8 font-light">
                Join Milwaukee&apos;s premier event marketplace
              </p>

              {error && (
                <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleStep1} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Full name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><User size={16} className="text-stone-400" /></div>
                    <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Doe"
                      className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-colors" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail size={16} className="text-stone-400" /></div>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                      className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-colors" />
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-2">Account type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setAccountType('customer')}
                      className={`flex items-center justify-center space-x-2 rounded-xl border py-3 text-sm font-semibold transition-all ${accountType === 'customer' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'}`}>
                      <User size={16} /><span>Customer</span>
                    </button>
                    <button type="button" onClick={() => setAccountType('vendor')}
                      className={`flex items-center justify-center space-x-2 rounded-xl border py-3 text-sm font-semibold transition-all ${accountType === 'vendor' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'}`}>
                      <Building2 size={16} /><span>Vendor</span>
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock size={16} className="text-stone-400" /></div>
                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters"
                      className="block w-full pl-10 pr-12 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock size={16} className="text-stone-400" /></div>
                    <input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter your password"
                      className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-colors" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full rounded-xl bg-stone-900 py-3.5 text-sm font-bold text-white shadow-md hover:bg-stone-800 transition-all disabled:opacity-60">
                  {isLoading ? 'Creating account...' : accountType === 'vendor' ? 'Continue â†’' : 'Create Account'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Step 2 of 2</span>
                </div>
                <h1 className="text-2xl font-semibold text-stone-900">Your business details</h1>
                <p className="text-sm text-stone-500 mt-1">Tell us about your business so we can create your listing.</p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">{error}</div>
              )}

              <form onSubmit={handleVendorSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Business name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Building2 size={16} className="text-stone-400" /></div>
                    <input type="text" required value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Your Business Name"
                      className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Category *</label>
                  <select required value={categorySlug} onChange={e => setCategorySlug(e.target.value)}
                    className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white text-sm text-stone-700 focus:outline-none focus:border-stone-400 transition-colors">
                    <option value="">Select a category</option>
                    {NAV_CATEGORIES.map(cat => (
                      <optgroup key={cat.key} label={cat.label}>
                        {cat.subcategories.map(sub => (
                          <option key={sub.filterSchemaKey} value={sub.filterSchemaKey}>{sub.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Phone size={16} className="text-stone-400" /></div>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(414) 555-0100"
                        className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Website</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Globe size={16} className="text-stone-400" /></div>
                      <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..."
                        className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Street Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><MapPin size={16} className="text-stone-400" /></div>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St"
                      className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">City</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Milwaukee"
                      className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">ZIP Code</label>
                    <input type="text" value={zip} onChange={e => setZip(e.target.value)} placeholder="53202"
                      className="block w-full px-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">Price Range</label>
                  <div className="flex gap-2">
                    {['$', '$$', '$$$', '$$$$'].map(p => (
                      <button key={p} type="button" onClick={() => setPriceRange(priceRange === p ? '' : p)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${priceRange === p ? 'bg-stone-950 text-white border-stone-950' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">About your business</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 pointer-events-none"><FileText size={16} className="text-stone-400" /></div>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Describe your services, experience, and what makes you unique..."
                      className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 transition-colors resize-none" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full rounded-xl bg-stone-900 py-3.5 text-sm font-bold text-white shadow-md hover:bg-stone-800 transition-all disabled:opacity-60">
                  {isLoading ? 'Submitting...' : 'Submit Vendor Application'}
                </button>
              </form>
            </>
          )}

          {step === 1 && (
            <p className="text-center text-sm text-stone-500 font-light mt-8">
              Already have an account?{' '}
              <button onClick={() => setView('login')} className="font-semibold text-stone-900 hover:text-stone-600 transition-colors">Log In</button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

