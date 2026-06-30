'use client'

import React, { useState } from 'react'
import { X, ShieldCheck, CheckCircle } from 'lucide-react'
import type { Vendor } from '@/lib/marketplace-types'

interface ClaimWizardProps {
  vendor: Vendor
  onClaimSubmitted: (claim: { contactName: string; contactEmail: string; contactPhone: string; verificationNote: string }) => void
  onClose: () => void
}

export function ClaimWizard({ vendor, onClaimSubmitted, onClose }: ClaimWizardProps) {
  const [step, setStep] = useState(1)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [verificationNote, setVerificationNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName || !contactEmail) return
    onClaimSubmitted({ contactName, contactEmail, contactPhone, verificationNote })
    setSubmitted(true)
    setTimeout(onClose, 4000)
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 border border-stone-200 shadow-2xl relative text-left font-sans">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"><X size={18} /></button>

        <div className="flex items-center space-x-2 text-stone-700 mb-2">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-xs font-black uppercase tracking-widest font-mono">Verified Profile Claim</span>
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1 font-[var(--font-display)]">{vendor.name}</h3>
        <p className="text-[11px] text-stone-500 mb-6 leading-relaxed">Prove ownership to claim this Milwaukee business listing. Our team reviews every claim within 2-3 business days.</p>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-center font-semibold text-xs space-y-1">
            <CheckCircle size={20} className="mx-auto text-green-500" />
            <p className="font-bold">Claim submitted securely!</p>
            <p className="text-[11px] text-stone-500 font-medium">Our verification team will review your claim and reach out within 2-3 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-700">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Your Full Name *</label>
              <input type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="John Smith" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Business Email *</label>
              <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="owner@business.com" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Phone Number</label>
              <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="(414) 555-0100" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Verification Note</label>
              <textarea rows={3} value={verificationNote} onChange={(e) => setVerificationNote(e.target.value)} placeholder="Describe how you're affiliated with this business..." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500" />
            </div>
            <div className="flex space-x-2.5 pt-2">
              <button type="submit" className="flex-grow rounded-xl bg-stone-900 py-3 text-center text-xs font-bold text-white shadow-md hover:bg-stone-800 transition">Submit Claim Request</button>
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
