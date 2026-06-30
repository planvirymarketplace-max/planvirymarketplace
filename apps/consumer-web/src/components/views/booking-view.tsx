'use client'

import { useState } from 'react'
import { ArrowLeft, Calendar, Clock, CreditCard, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { mockProducts, mockVendors } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

export function BookingView() {
  const { selectedProductId, selectedVendorId, setView } = useAppStore()
  const product = mockProducts.find((p) => p.id === selectedProductId) || mockProducts[0]
  const vendor = mockVendors.find((v) => v.id === (selectedVendorId || product.vendorId)) || mockVendors[0]
  const [step, setStep] = useState(1)
  const [bookingComplete, setBookingComplete] = useState(false)

  const handleBooking = () => {
    setBookingComplete(true)
  }

  if (bookingComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="size-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="size-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-6">
            Your booking with {vendor.name} has been confirmed. You&apos;ll receive a confirmation email shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setView('home')} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">Go Home</Button>
            <Button variant="outline" onClick={() => setView('vendors')} className="border-gray-200 cursor-pointer">Browse More</Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => setView('product-detail')} className="mb-4 cursor-pointer text-gray-500 hover:text-blue-600">
        <ArrowLeft className="size-4 mr-1" /> Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Steps */}
          <div className="flex gap-2 mb-6">
            {[
              { num: 1, label: 'Date & Time' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Payment' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  step >= s.num ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-400'
                }`}
              >
                <div className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {s.num}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Calendar className="size-5" /> Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <Button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">Continue</Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(414) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Requests or Notes</Label>
                  <Textarea id="notes" placeholder="Any special requirements..." rows={3} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="border-gray-200 cursor-pointer">Back</Button>
                  <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">Continue to Payment</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <CreditCard className="size-5" /> Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card">Card Number</Label>
                  <Input id="card" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="border-gray-200 cursor-pointer">Back</Button>
                  <Button onClick={handleBooking} className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer">
                    Pay ${product.price.toLocaleString()}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20 border-gray-200">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 text-gray-900">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Vendor</span>
                  <span className="text-gray-900">{vendor.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">${product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service fee</span>
                  <span className="text-gray-900">${(product.price * 0.05).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">${(product.price * 1.05).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
