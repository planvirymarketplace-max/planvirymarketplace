'use client'

import { useState } from 'react'
import { ArrowLeft, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/lib/store'
import { CATEGORIES } from '@/components/marketplace/common/category-card'

export function ClaimVendorView() {
  const { setView } = useAppStore()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    address: '',
    bio: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="bg-[#F8F7F2] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="size-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-[var(--font-playfair)]">Application Submitted!</h2>
          <p className="text-sm text-slate-500 mt-2">
            Thank you for your interest. We&apos;ll review your application and get back to you within 2-3 business days.
          </p>
          <Button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={() => setView('home')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F8F7F2] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setView('home')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-[var(--font-playfair)]">
            List Your Business
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            Join Milwaukee&apos;s premier vendor directory. Get found by couples planning their perfect event.
          </p>
        </div>

        <Card className="p-6 sm:p-8 border-slate-200 bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  placeholder="Your business name"
                  required
                  className="border-slate-300 focus-visible:ring-blue-500/30 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange('category', value)}
                  required
                >
                  <SelectTrigger className="border-slate-300 h-10">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Contact Name *
                </Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  placeholder="Your full name"
                  required
                  className="border-slate-300 focus-visible:ring-blue-500/30 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email *
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="you@business.com"
                  required
                  className="border-slate-300 focus-visible:ring-blue-500/30 h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Phone
                </Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="(414) 555-0100"
                  className="border-slate-300 focus-visible:ring-blue-500/30 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Website
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://yourbusiness.com"
                  className="border-slate-300 focus-visible:ring-blue-500/30 h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Business Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 Main St, Milwaukee, WI 53202"
                className="border-slate-300 focus-visible:ring-blue-500/30 h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                About Your Business
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell couples about your services, experience, and what makes you special..."
                rows={4}
                className="border-slate-300 focus-visible:ring-blue-500/30 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-semibold"
            >
              <Send className="size-4 mr-1.5" />
              Submit Application
            </Button>

            <p className="text-[11px] text-slate-400 text-center">
              By submitting, you agree to our terms of service. We&apos;ll review your application within 2-3 business days.
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
