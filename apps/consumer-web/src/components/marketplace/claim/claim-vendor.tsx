'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Shield,
  Store,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAppStore } from '@/lib/store'

interface VendorListItem {
  id: string
  name: string
  slug: string
  shortDescription?: string
  logo?: string
  city?: string
  state?: string
  rating: number
  reviewCount: number
  isVerified: boolean
  isFeatured: boolean
  isClaimed: boolean
  productCount: number
}

interface VendorsResponse {
  vendors: VendorListItem[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

const STEPS = [
  { number: 1, title: 'Select Vendor', icon: Store },
  { number: 2, title: 'Business Proof', icon: FileText },
  { number: 3, title: 'Contact Info', icon: User },
  { number: 4, title: 'Confirm', icon: CheckCircle },
]

export function ClaimVendor() {
  const { selectedVendorId, navigate } = useAppStore()
  const [step, setStep] = useState(1)
  const [selectedVendor, setSelectedVendor] = useState<VendorListItem | null>(null)
  const [businessProof, setBusinessProof] = useState('')
  const [claimMessage, setClaimMessage] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [claimComplete, setClaimComplete] = useState(false)

  // Fetch unclaimed vendors
  const { data: vendorsData, isLoading } = useQuery<VendorsResponse>({
    queryKey: ['unclaimed-vendors'],
    queryFn: async () => {
      const res = await fetch('/api/vendors?limit=50')
      if (!res.ok) throw new Error('Failed to fetch vendors')
      return res.json()
    },
  })

  // If we have a pre-selected vendor from navigation, find it
  const preselectedVendor = vendorsData?.vendors.find((v) => v.id === selectedVendorId)

  // Set preselected vendor when data loads
  if (preselectedVendor && !selectedVendor && preselectedVendor.isClaimed === false) {
    setSelectedVendor(preselectedVendor)
    setStep(2)
  }

  const unclaimedVendors = (vendorsData?.vendors ?? []).filter((v) => !v.isClaimed)

  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!selectedVendor) throw new Error('No vendor selected')
      const res = await fetch('/api/claim-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: selectedVendor.id,
          userId: 'guest',
          businessProof,
          message: claimMessage || `Claim request from ${contactName} (${contactEmail})`,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to submit claim')
      }
      return res.json()
    },
    onSuccess: () => {
      setClaimComplete(true)
    },
  })

  if (claimComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Claim Submitted!</h2>
          <p className="text-muted-foreground mb-2">
            Your claim request for <strong>{selectedVendor?.name}</strong> has been submitted for review.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Our team will review your claim and get back to you within 2-3 business days.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('vendors')} variant="outline" className="rounded-xl">
              Browse Vendors
            </Button>
            <Button
              onClick={() => navigate('vendor-detail', { vendorId: selectedVendor?.id ?? '' })}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
            >
              View Vendor
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('vendors')} className="cursor-pointer">Vendors</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Claim Business</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('vendors')}
          className="mb-4 -ml-2 text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Vendors
        </Button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Claim Your Business</h1>
        <p className="text-muted-foreground mb-6">
          Verify your ownership to manage your business profile and respond to customers.
        </p>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={(step / 4) * 100} className="h-2 mb-4" />
          <div className="flex justify-between">
            {STEPS.map((s) => (
              <div
                key={s.number}
                className={`flex flex-col items-center gap-1 ${
                  step >= s.number ? 'text-emerald-700' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step > s.number
                      ? 'bg-emerald-600 text-white'
                      : step === s.number
                        ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > s.number ? <CheckCircle className="h-4 w-4" /> : s.number}
                </div>
                <span className="text-[10px] sm:text-xs font-medium hidden sm:block">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-card border border-border rounded-xl">
          {/* Step 1: Select Vendor */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Store className="h-5 w-5 text-emerald-600" />
                  Select Your Business
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-xl" />
                    ))}
                  </div>
                ) : unclaimedVendors.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>No unclaimed businesses available at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {unclaimedVendors.map((vendor) => (
                      <button
                        key={vendor.id}
                        onClick={() => setSelectedVendor(vendor)}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          selectedVendor?.id === vendor.id
                            ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                            : 'border-border hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                            <Store className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate">{vendor.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {vendor.city && vendor.state ? `${vendor.city}, ${vendor.state}` : 'Location not specified'}
                              {' · '}{vendor.productCount} services
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedVendor}
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}

          {/* Step 2: Business Proof */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Provide Business Proof
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-emerald-700">
                    <strong>Claiming:</strong> {selectedVendor?.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-proof">Describe your connection to this business *</Label>
                  <Textarea
                    id="business-proof"
                    value={businessProof}
                    onChange={(e) => setBusinessProof(e.target.value)}
                    rows={4}
                    className="rounded-xl"
                    placeholder="E.g., I am the owner/founder of this business. I registered it in 2020 and can provide business license documentation upon request..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Please describe how you are connected to this business (owner, manager, authorized representative, etc.)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claim-message">Additional message (optional)</Label>
                  <Textarea
                    id="claim-message"
                    value={claimMessage}
                    onChange={(e) => setClaimMessage(e.target.value)}
                    rows={3}
                    className="rounded-xl"
                    placeholder="Any additional information you'd like to share with our review team..."
                  />
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!businessProof.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}

          {/* Step 3: Contact Info */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-600" />
                  Your Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="claim-name">Full Name *</Label>
                  <Input
                    id="claim-name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="rounded-xl"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claim-email">Email *</Label>
                  <Input
                    id="claim-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="rounded-xl"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claim-phone">Phone</Label>
                  <Input
                    id="claim-phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="rounded-xl"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    disabled={!contactName.trim() || !contactEmail.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Review & Submit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Business</p>
                    <p className="text-sm font-semibold">{selectedVendor?.name}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Your Name</p>
                    <p className="text-sm font-medium">{contactName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                    <p className="text-sm font-medium">{contactEmail}</p>
                  </div>
                  {contactPhone && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                      <p className="text-sm font-medium">{contactPhone}</p>
                    </div>
                  )}
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Business Proof</p>
                    <p className="text-sm">{businessProof}</p>
                  </div>
                  {claimMessage && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Additional Message</p>
                      <p className="text-sm">{claimMessage}</p>
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                  <AlertCircle className="h-4 w-4 inline mr-1.5" />
                  By submitting, you confirm that the information provided is accurate and you are authorized to claim this business.
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(3)} className="rounded-xl">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={() => claimMutation.mutate()}
                    disabled={claimMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {claimMutation.isPending ? 'Submitting...' : 'Submit Claim'}
                  </Button>
                </div>

                {claimMutation.isError && (
                  <p className="text-sm text-red-500 text-center mt-2">
                    {(claimMutation.error as Error)?.message || 'Failed to submit claim. Please try again.'}
                  </p>
                )}
              </CardContent>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  )
}
