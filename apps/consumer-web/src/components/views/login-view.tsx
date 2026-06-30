'use client'

import React, { useState } from 'react'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase-client'

type ViewName = 'home' | 'directory' | 'cart' | 'vendor-detail' | 'login' | 'signup' | 'live-events'

interface LoginViewProps {
  setView: (view: ViewName) => void
}

export function LoginView({ setView }: LoginViewProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError

      // Check if this user is a vendor
      const { data: vendorUser } = await supabaseClient
        .from('vendor_users')
        .select('vendor_id')
        .eq('user_id', data.user?.id ?? '')
        .eq('is_active', true)
        .maybeSingle()

      if (vendorUser?.vendor_id) {
        window.location.href = '/vendor'
      } else {
        setView('home')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] bg-[#FAF9F6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <button
          onClick={() => setView('home')}
          className="inline-flex items-center space-x-2 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          <span>Back to home</span>
        </button>

        {/* Card */}
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

          <h1 className="font-[var(--font-display)] text-2xl sm:text-3xl font-medium text-stone-900 tracking-tight text-center mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-stone-500 text-center mb-8 font-light">
            Sign in to your Milwaukee marketplace account
          </p>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={16} className="text-stone-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={16} className="text-stone-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-12 py-3 border border-stone-200 rounded-xl bg-white placeholder-stone-400 text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button type="button" className="text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-stone-900 py-3.5 text-sm font-bold text-white shadow-md hover:bg-stone-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-stone-400 font-light">or</span>
            </div>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-stone-500 font-light">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setView('signup')}
              className="font-semibold text-stone-900 hover:text-red-600 transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
