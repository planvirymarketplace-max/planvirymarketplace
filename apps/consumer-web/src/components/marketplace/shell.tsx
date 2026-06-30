'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
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
import type { NavSubcategory } from '@/lib/directory-filter-data'
import type { VendorSearchResult } from '@/hooks/use-search-vendors'

type ViewName = 'home' | 'directory' | 'cart' | 'vendor-detail' | 'login' | 'signup' | 'live-events'

interface MarketplaceShellProps {
  vendors?: Vendor[]
  totalVendors?: number
  initialView?: ViewName
  initialDirectoryVendors?: VendorSearchResult[]
  initialDirectoryCategoryKey?: string
  initialDirectorySubKey?: string
  initialDirectorySubLabel?: string
}

export function MarketplaceShell({ vendors: initialVendors = [], totalVendors = 0, initialView = 'home', initialDirectoryVendors, initialDirectoryCategoryKey, initialDirectorySubKey, initialDirectorySubLabel }: MarketplaceShellProps) {
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
  const [currentView, setCurrentView] = useState<ViewName>(initialView)
  const [selectedVendorId, setSelectedVendorId] = useState<string>('')
  const [claimTargetVendor, setClaimTargetVendor] = useState<Vendor | null>(null)
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false)
  const [directoryCategoryKey, setDirectoryCategoryKey] = useState<string | null>(initialDirectoryCategoryKey ?? null)
  const [directorySub, setDirectorySub] = useState<NavSubcategory | null>(
    initialDirectorySubKey && initialDirectorySubLabel
      ? { filterSchemaKey: initialDirectorySubKey, label: initialDirectorySubLabel }
      : null
  )
  const [directoryKey, setDirectoryKey] = useState(0)

  const setView = (view: ViewName) => {
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateToDirectory = (categoryKey: string, sub?: NavSubcategory) => {
    setDirectoryCategoryKey(categoryKey)
    setDirectorySub(sub ?? null)
    setDirectoryKey(k => k + 1)
    setView('directory')
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
    <div className="bg-background min-h-screen flex flex-col font-sans">
      <Navbar
        cart={cart}
        setView={setView}
        onOpenCart={() => setView('cart')}
        onNavigateToDirectory={handleNavigateToDirectory}
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
            key={directoryKey}
            onSelectVendor={(id) => { setSelectedVendorId(id); setView('vendor-detail') }}
            onOpenSignupModal={() => setShowSignupModal(true)}
            initialCategoryKey={directoryCategoryKey}
            initialSub={directorySub}
            initialVendors={initialDirectoryVendors}
          />
        )}

        {currentView === 'vendor-detail' && (() => {
          const detailVendor = vendors.find(v => v.id === selectedVendorId) || vendors[0]
          if (!detailVendor) return <div className="p-10 text-center text-muted-foreground">Vendor not found.</div>
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/70 p-4">
          <div className="bg-card max-w-xl w-full p-8 border border-border relative text-left">
            <button onClick={() => setShowSignupModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={16} /></button>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-ember">Register New Milwaukee Entity</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">List Your Business</h3>
            <p className="font-body text-xs text-muted-foreground mb-6 leading-relaxed">Add your services directly on Planviry.</p>
            <form onSubmit={(e) => { e.preventDefault(); setShowSignupModal(false) }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">Business Name *</label>
                  <input type="text" required placeholder="e.g. Bay View Photo Co" className="w-full border border-border bg-background px-3 py-2 font-body text-xs text-foreground outline-none focus:border-ember/60 transition-colors" />
                </div>
                <div>
                  <label className="block font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">Category *</label>
                  <select className="w-full border border-border bg-background px-3 py-2 font-body text-xs text-foreground outline-none focus:border-ember/60 transition-colors">
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
                  <label className="block font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">Your Full Name *</label>
                  <input type="text" required placeholder="Megan Fox" className="w-full border border-border bg-background px-3 py-2 font-body text-xs text-foreground outline-none focus:border-ember/60 transition-colors" />
                </div>
                <div>
                  <label className="block font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">Your Contact Email *</label>
                  <input type="email" required placeholder="contact@business.com" className="w-full border border-border bg-background px-3 py-2 font-body text-xs text-foreground outline-none focus:border-ember/60 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">Short Description of Services</label>
                <textarea rows={3} placeholder="Brief bio, capacity, equipment types..." className="w-full border border-border bg-background px-3 py-2 font-body text-xs text-foreground outline-none focus:border-ember/60 transition-colors" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-ember text-ember-foreground py-3 font-utility text-[12px] font-bold uppercase tracking-[0.12em] hover:opacity-90 transition-opacity">Submit Application</button>
                <button type="button" onClick={() => setShowSignupModal(false)} className="px-5 py-3 border border-border font-utility text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground hover:border-ember/40 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
