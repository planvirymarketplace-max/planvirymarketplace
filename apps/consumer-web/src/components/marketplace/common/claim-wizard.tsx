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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/70 p-4">
      <div className="bg-card max-w-lg w-full p-8 border border-border relative text-left">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>

        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <ShieldCheck className="h-4 w-4 text-teal" />
          <span className="font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-ember">Verified Profile Claim</span>
        </div>

        <h3 className="font-display text-2xl font-bold text-foreground mb-1">{vendor.name}</h3>
        <p className="font-body text-[11px] text-muted-foreground mb-6 leading-relaxed">Prove ownership to claim this Milwaukee business listing. Our team reviews every claim within 2-3 business days.</p>

        {submitted ? (
          <div className="p-5 bg-teal/10 border border-teal/30 text-center space-y-2">
            <CheckCircle size={20} className="mx-auto text-teal" />
            <p className="font-display font-bold text-foreground">Claim submitted securely!</p>
            <p className="font-body text-[11px] text-muted-foreground">Our verification team will review your claim and reach out within 2-3 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">Your Full Name *</label>
              <input type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="John Smith" className="w-full border border-border bg-background px-3 py-2 font-body text-xs text-foreground outline-none focus:border-ember/60 transition-colors" />
            </div>
            <div>
              <label className="block font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">Business Email *</label>
              <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="owner@business.com" className="w-full border border-border bg-background px-3 py-2 font-body text-xs text-foreground outline-none focus:border-ember/60 transition-colors" />
            </div>
            <div>
              <label className="block font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">Phone Number</label>
              <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="(414) 555-0100" className="w-full border border-border bg-background px-3 py-2 font-body text-xs text-foreground outline-none focus:border-ember/60 transition-colors" />
            </div>
            <div>
              <label className="block font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">Verification Note</label>
              <textarea rows={3} value={verificationNote} onChange={(e) => setVerificationNote(e.target.value)} placeholder="Describe how you're affiliated with this business..." className="w-full border border-border bg-background px-3 py-2 font-body text-xs text-foreground outline-none focus:border-ember/60 transition-colors" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-ember text-ember-foreground py-3 font-utility text-[12px] font-bold uppercase tracking-[0.12em] hover:opacity-90 transition-opacity">Submit Claim Request</button>
              <button type="button" onClick={onClose} className="px-5 py-3 border border-border font-utility text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground hover:border-ember/40 transition-colors">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
