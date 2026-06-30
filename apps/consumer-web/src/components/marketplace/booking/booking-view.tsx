'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  CheckCircle,
  ChevronLeft,
  Store,
  Shield,
  Star,
  Minus,
  Plus,
  CreditCard,
} from 'lucide-react'
import { format, addDays, isSameDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAppStore } from '@/lib/store'
import type { VendorAvailability } from '@/lib/types'

interface VendorDetailData {
  vendor: {
    id: string
    name: string
    email: string
    phone?: string
    rating: number
    reviewCount: number
    isVerified: boolean
    availability: VendorAvailability[]
    products: Array<{
      id: string
      name: string
      price: number
      type: string
      minBookingHours?: number
      maxBookingHours?: number
      depositPercent?: number
      shortDesc?: string
    }>
  }
}

interface OrderResponse {
  order: {
    id: string
    orderNumber: string
    status: string
    total: number
    subtotal: number
    tax: number
  }
}

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number = 60): string[] {
  const slots: string[] = []
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  let currentMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  while (currentMinutes + intervalMinutes <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60)
    const minutes = currentMinutes % 60
    slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`)
    currentMinutes += intervalMinutes
  }
  return slots
}

export function BookingView() {
  const { selectedVendorId, selectedProductId, navigate } = useAppStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(selectedProductId ?? null)
  const [quantity, setQuantity] = useState(1)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [bookingComplete, setBookingComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const { data: vendorData, isLoading } = useQuery<VendorDetailData>({
    queryKey: ['booking-vendor', selectedVendorId],
    queryFn: async () => {
      const res = await fetch(`/api/vendors/${selectedVendorId}`)
      if (!res.ok) throw new Error('Failed to fetch vendor')
      return res.json()
    },
    enabled: !!selectedVendorId,
  })

  const vendor = vendorData?.vendor
  const services = vendor?.products?.filter((p) => p.type === 'service') ?? []
  const allProducts = vendor?.products ?? []
  const selectedService = allProducts.find((p) => p.id === selectedServiceId)

  // Calculate available time slots based on vendor availability
  const availableSlots = useMemo(() => {
    if (!selectedDate || !vendor?.availability) return []
    const dayOfWeek = selectedDate.getDay()
    const dayAvail = vendor.availability.filter(
      (a) => a.dayOfWeek === dayOfWeek && a.isAvailable
    )
    const slots: string[] = []
    for (const avail of dayAvail) {
      slots.push(...generateTimeSlots(avail.startTime, avail.endTime))
    }
    return slots
  }, [selectedDate, vendor])

  // Days when vendor is available
  const availableDays = useMemo(() => {
    if (!vendor?.availability) return []
    const days = new Set<number>()
    for (const avail of vendor.availability) {
      if (avail.isAvailable) days.add(avail.dayOfWeek)
    }
    return days
  }, [vendor])

  const isDateAvailable = (date: Date) => {
    return availableDays.has(date.getDay())
  }

  const totalPrice = selectedService ? selectedService.price * quantity : 0
  const tax = Math.round(totalPrice * 0.08 * 100) / 100
  const grandTotal = totalPrice + tax
  const depositAmount =
    selectedService?.depositPercent
      ? (totalPrice * selectedService.depositPercent) / 100
      : 0

  const orderMutation = useMutation({
    mutationFn: async () => {
      if (!selectedServiceId || !selectedVendorId || !selectedDate || !selectedTime) {
        throw new Error('Missing required booking details')
      }
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'guest',
          vendorId: selectedVendorId,
          items: [
            {
              productId: selectedServiceId,
              quantity,
              metadata: JSON.stringify({
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedTime,
                customerName,
                customerEmail,
                customerPhone,
              }),
            },
          ],
          notes: `Booking for ${format(selectedDate, 'PPP')} at ${selectedTime}`,
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to create booking')
      }
      return res.json() as Promise<OrderResponse>
    },
    onSuccess: (data) => {
      setOrderNumber(data.order.orderNumber)
      setBookingComplete(true)
    },
  })

  if (isLoading) return <BookingViewSkeleton />

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Vendor not found</h2>
          <p className="text-muted-foreground mb-4">Could not load vendor details for booking.</p>
          <Button onClick={() => navigate('vendors')} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
            Browse Vendors
          </Button>
        </div>
      </div>
    )
  }

  if (bookingComplete) {
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
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-2">
            Your booking with {vendor.name} has been submitted.
          </p>
          <div className="bg-emerald-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-lg font-bold text-emerald-700">{orderNumber}</p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            {selectedDate && (
              <p><Calendar className="inline h-4 w-4 mr-1" /> {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
            )}
            {selectedTime && (
              <p><Clock className="inline h-4 w-4 mr-1" /> {selectedTime}</p>
            )}
            {selectedService && (
              <p><Store className="inline h-4 w-4 mr-1" /> {selectedService.name}</p>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('vendors')} variant="outline" className="rounded-xl">
              Browse More
            </Button>
            <Button
              onClick={() => navigate('vendor-detail', { vendorId: vendor.id })}
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <BreadcrumbLink
                  onClick={() => navigate('vendor-detail', { vendorId: vendor.id })}
                  className="cursor-pointer"
                >
                  {vendor.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Book Service</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('vendor-detail', { vendorId: vendor.id })}
          className="mb-4 -ml-2 text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to {vendor.name}
        </Button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Book a Service</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Service Selection */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-card border border-border rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Store className="h-5 w-5 text-emerald-600" />
                    Select Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(services.length > 0 ? services : allProducts).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedServiceId(product.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          selectedServiceId === product.id
                            ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                            : 'border-border hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            {product.shortDesc && (
                              <p className="text-xs text-muted-foreground mt-0.5">{product.shortDesc}</p>
                            )}
                          </div>
                          <span className="text-sm font-bold text-emerald-700">${product.price.toFixed(2)}</span>
                        </div>
                        {product.minBookingHours && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock className="inline h-3 w-3 mr-1" />
                            Min {product.minBookingHours}hr{product.minBookingHours !== 1 ? 's' : ''}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Date Selection */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="bg-card border border-border rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || !isDateAvailable(date)}
                    modifiers={{ available: (date) => isDateAvailable(date) }}
                    className="rounded-xl"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Time Selection */}
            {selectedDate && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-card border border-border rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      Select Time - {format(selectedDate, 'EEEE, MMMM d')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                              selectedTime === slot
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500'
                                : 'border-border hover:border-emerald-300 text-foreground'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No available time slots for this date.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Customer Info */}
            {selectedDate && selectedTime && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-card border border-border rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-emerald-600" />
                      Your Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="booking-name">Full Name *</Label>
                      <Input
                        id="booking-name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        className="rounded-xl"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="booking-email">Email *</Label>
                      <Input
                        id="booking-email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                        className="rounded-xl"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="booking-phone">Phone</Label>
                      <Input
                        id="booking-phone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="rounded-xl"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="bg-card border border-border rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Vendor */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Store className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{vendor.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {vendor.rating.toFixed(1)}
                          {vendor.isVerified && <CheckCircle className="h-3 w-3 text-emerald-600 ml-1" />}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Service */}
                    {selectedService ? (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Service</p>
                        <p className="text-sm font-medium">{selectedService.name}</p>
                        <p className="text-sm text-emerald-700 font-semibold">${selectedService.price.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Select a service to continue</p>
                    )}

                    {/* Date & Time */}
                    {selectedDate && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date</p>
                        <p className="text-sm font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                      </div>
                    )}
                    {selectedTime && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Time</p>
                        <p className="text-sm font-medium">{selectedTime}</p>
                      </div>
                    )}

                    {/* Quantity */}
                    {selectedService && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Quantity / Duration</p>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-semibold">{quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                              onClick={() => setQuantity(quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Price Breakdown */}
                    {selectedService && (
                      <>
                        <Separator />
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              ${selectedService.price.toFixed(2)} × {quantity}
                            </span>
                            <span>${totalPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax (8%)</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold text-base">
                            <span>Total</span>
                            <span className="text-emerald-700">${grandTotal.toFixed(2)}</span>
                          </div>
                          {depositAmount > 0 && (
                            <>
                              <div className="flex justify-between text-emerald-700">
                                <span>Deposit ({selectedService.depositPercent}%)</span>
                                <span className="font-medium">${depositAmount.toFixed(2)}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Pay deposit now, remainder due at appointment
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                                Secure booking with deposit protection
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}

                    {/* Confirm Button */}
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11"
                      disabled={
                        !selectedServiceId ||
                        !selectedDate ||
                        !selectedTime ||
                        !customerName ||
                        !customerEmail ||
                        orderMutation.isPending
                      }
                      onClick={() => orderMutation.mutate()}
                    >
                      {orderMutation.isPending ? 'Confirming...' : 'Confirm Booking'}
                    </Button>

                    {orderMutation.isError && (
                      <p className="text-xs text-red-500 text-center">
                        Failed to create booking. Please try again.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BookingViewSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-5 w-48 mb-4" />
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
