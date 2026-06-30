'use client'

import { useState } from 'react'
import { Navbar } from '@/components/marketplace/layout/navbar'
import { Hero } from '@/components/marketplace/home/hero'
import { LandingSections, ComprehensiveFooter } from '@/components/marketplace/home/landing-sections'
import { DirectoryView } from '@/components/views/directory-view'
import { VendorDetail } from '@/components/views/vendor-detail'
import { CartView } from '@/components/views/cart-view'
import { LoginView } from '@/components/views/login-view'
import { SignupView } from '@/components/views/signup-view'
import { LiveEventsView } from '@/components/views/live-events-view'
import { ClaimWizard } from '@/components/marketplace/common/claim-wizard'
import type { Vendor, ClaimRequest, VendorSignup, CartItem, Booking, Lead, VendorCategory } from '@/lib/marketplace-types'

type ViewName = 'home' | 'directory' | 'cart' | 'vendor-detail' | 'login' | 'signup' | 'live-events'

interface MarketplaceShellProps {
  vendors: Vendor[]
  totalVendors: number
}

export function MarketplaceShell({ vendors: initialVendors, totalVendors }: MarketplaceShellProps) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors)
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const cached = sessionStorage.getItem('planviry_cart')
      return cached ? JSON.parse(cached) : []
    } catch { return [] }
  })
  const [claims, setClaims] = useState<ClaimRequest[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])

  const [selectedCategory, setSelectedCategory] = useState<VendorCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentView, setCurrentView] = useState<ViewName>('home')
  const [selectedVendorId, setSelectedVendorId] = useState<string>('')
  const [claimTargetVendor, setClaimTargetVendor] = useState<Vendor | null>(null)
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false)

  const setView = (view: ViewName) => {
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateCartAndSync = (newCart: CartItem[]) => {
    setCart(newCart)
    sessionStorage.setItem('planviry_cart', JSON.stringify(newCart))
  }

  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    const id = `cart-row-${Date.now()}`
    updateCartAndSync([...cart, { id, ...item }])
  }

  const handleRemoveCartItem = (id: string) => {
    updateCartAndSync(cart.filter(i => i.id !== id))
  }

  const handleClearCart = () => updateCartAndSync([])

  const handleConfirmCheckout = (bookingsToCreate: Omit<Booking, 'id' | 'createdAt'>[]) => {
    const targetBookings = [...bookings]
    bookingsToCreate.forEach((payload) => {
      const bId = `book-receipt-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      targetBookings.push({ id: bId, createdAt: new Date().toLocaleDateString(), ...payload })
    })
    setBookings(targetBookings)
  }

  const handleAddReview = (vendorId: string, rating: number, body: string, reviewerName: string) => {
    const updated = vendors.map(v => {
      if (v.id === vendorId) {
        const newReviews = [{ id: `rv-${Date.now()}`, reviewerName, rating, body, createdAt: new Date().toISOString().split('T')[0], isApproved: true }, ...v.reviews]
        const avg = parseFloat((newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length).toFixed(1))
        return { ...v, reviews: newReviews, reviewCount: newReviews.length, averageRating: avg }
      }
      return v
    })
    setVendors(updated)
  }

  const handleSendLead = (vendorId: string, contactName: string, contactEmail: string, contactPhone: string, eventDate: string, budget: number, message: string) => {
    const matchedVendor = vendors.find(v => v.id === vendorId)
    const newLead: Lead = {
      id: `lead-${Date.now()}`, vendorId, contactName, contactEmail, contactPhone, eventDate, budget, message,
      category: matchedVendor?.category || 'wedding_dj', replied: false, createdAt: new Date().toLocaleDateString(), status: 'new'
    }
    setLeads([...leads, newLead])
  }

  const handleOpenClaimModal = (vendor: Vendor) => setClaimTargetVendor(vendor)

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col font-sans selection:bg-[#BA975A] selection:text-white">
      <Navbar
        cart={cart}
        setView={setView}
        onOpenCart={() => setView('cart')}
      />

      <div className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero
              onSelectCategory={(cat) => { setSelectedCategory(cat); setView('directory') }}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={(q) => { setSearchQuery(q); if (q) setView('directory') }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
              <LandingSections
                vendors={vendors}
                onSelectVendor={(id) => { setSelectedVendorId(id); setView('vendor-detail') }}
                onOpenSignupModal={() => setShowSignupModal(true)}
                onOpenClaimModal={handleOpenClaimModal}
                onSelectCategory={(cat) => { setSelectedCategory(cat as VendorCategory); setView('directory') }}
              />
            </div>
          </>
        )}

        {currentView === 'directory' && (
          <DirectoryView
            vendors={vendors.filter(v => v.isPublished)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectVendor={(id) => { setSelectedVendorId(id); setView('vendor-detail') }}
            onOpenClaimModal={handleOpenClaimModal}
            onOpenSignupModal={() => setShowSignupModal(true)}
            isLoading={false}
            totalVendors={totalVendors}
          />
        )}

        {currentView === 'vendor-detail' && (() => {
          const detailVendor = vendors.find(v => v.id === selectedVendorId) || vendors[0]
          if (!detailVendor) return <div className="p-10 text-center text-stone-500">Vendor not found.</div>
          return (
            <VendorDetail
              vendor={detailVendor}
              allVendors={vendors}
              onBack={() => setView('directory')}
              onAddToCart={handleAddToCart}
              onAddReview={handleAddReview}
              onSendLead={handleSendLead}
              onSelectVendor={(id) => setSelectedVendorId(id)}
            />
          )
        })()}

        {currentView === 'cart' && (
          <CartView
            cart={cart}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onConfirmCheckout={handleConfirmCheckout}
            onBackToExplore={() => setView('directory')}
          />
        )}

        {currentView === 'login' && (
          <LoginView setView={setView} />
        )}

        {currentView === 'signup' && (
          <SignupView setView={setView} />
        )}

        {currentView === 'live-events' && (
          <LiveEventsView setView={setView} />
        )}
      </div>

      <ComprehensiveFooter onViewChange={(v: string) => setView(v as ViewName)} />

      {claimTargetVendor && (
        <ClaimWizard
          vendor={claimTargetVendor}
          onClaimSubmitted={(submittedClaim) => {
            const newClaim: ClaimRequest = {
              id: `claim-${Date.now()}`, createdAt: new Date().toLocaleDateString(),
              vendorId: claimTargetVendor.id, vendorName: claimTargetVendor.name,
              ...submittedClaim, status: 'pending'
            }
            setClaims([newClaim, ...claims])
          }}
          onClose={() => setClaimTargetVendor(null)}
        />
      )}

      {showSignupModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 border border-stone-200 shadow-2xl relative text-left font-sans">
            <button onClick={() => setShowSignupModal(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">✕</button>
            <div className="flex items-center space-x-2 text-blue-600 mb-2">
              <span className="text-xs font-black uppercase tracking-widest font-mono">Register New Milwaukee Entity</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2 font-[var(--font-display)]">List Your Business</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Add your services directly on Planviry.</p>
            <form onSubmit={(e) => { e.preventDefault(); setShowSignupModal(false) }} className="space-y-4 text-xs font-medium text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Business Name *</label>
                  <input type="text" required placeholder="e.g. Bay View Photo Co" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Category *</label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 font-bold">
                    <option value="wedding_dj">Wedding DJ</option>
                    <option value="wedding_venue">Wedding Venue</option>
                    <option value="bachelorette_activity">Bachelorette Activity</option>
                    <option value="wedding_band">Wedding Band</option>
                    <option value="wedding_planner">Wedding Planner</option>
                    <option value="photo_booth">Photo Booth</option>
                    <option value="transportation">Transportation</option>
                    <option value="photography">Photography</option>
                    <option value="catering">Catering</option>
                    <option value="florist">Florist</option>
                    <option value="decor_rentals">Decor & Rentals</option>
                    <option value="bar_club">Bar & Club</option>
                    <option value="makeup_hair">Hair & Makeup</option>
                    <option value="jeweler">Jeweler</option>
                    <option value="officiant">Officiant</option>
                    <option value="bakery">Bakery</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Your Full Name *</label>
                  <input type="text" required placeholder="Megan Fox" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Your Contact Email *</label>
                  <input type="email" required placeholder="contact@business.com" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Short Description of Services</label>
                <textarea rows={3} placeholder="Brief bio, capacity, equipment types..." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500" />
              </div>
              <div className="flex space-x-2.5 pt-2">
                <button type="submit" className="flex-grow rounded-xl bg-stone-900 py-3 text-center text-xs font-bold text-white shadow-md hover:bg-stone-800 transition">Submit Application</button>
                <button type="button" onClick={() => setShowSignupModal(false)} className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
