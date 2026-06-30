'use client'

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Briefcase,
  Calendar,
  Compass,
  Utensils,
  Music,
  Plane,
  Sparkles,
  Building,
  Store,
  ShoppingBag,
  User,
  X,
  Send,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Check,
  Clock,
  MessageSquare,
  CalendarDays,
  AlertCircle,
  ThumbsUp,
  CheckCircle,
  Instagram,
  Eye,
  Settings
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { CategoryLens, CartItem, ActivityLog } from '@/types';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { motion, AnimatePresence } from 'framer-motion';

const VENDOR_DETAILS_MAP: Record<string, {
  phone: string;
  email: string;
  website: string;
  instagram: string;
  gallery: string[];
  specs: { label: string; value: string }[];
  availability: { day: string; date: string; slots: string[]; status: 'Available' | 'Limited' | 'Booked' }[];
  reviews: { name: string; avatar: string; rating: number; date: string; comment: string; verified: boolean }[];
}> = {
  'vendor-1': {
    phone: '(912) 555-0142',
    email: 'concierge@heritagewedding.co',
    website: 'www.heritagewedding.co',
    instagram: '@heritageweddingco',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      { label: 'Primary Equipment', value: 'Sony A1, Leica SL2, Profoto lighting' },
      { label: 'Turnaround Time', value: '4 weeks (Express Sneak Peek in 48h)' },
      { label: 'Coverage Hours', value: 'Up to 10 hours of active coverage' },
      { label: 'Backup Plan', value: 'Dual-card recording & localized cloud vaulting' }
    ],
    availability: [
      { day: 'Friday', date: 'Oct 18', slots: ['09:00 AM', '02:00 PM'], status: 'Available' },
      { day: 'Saturday', date: 'Oct 19', slots: [], status: 'Booked' },
      { day: 'Sunday', date: 'Oct 20', slots: ['01:00 PM'], status: 'Limited' }
    ],
    reviews: [
      { name: 'Sarah Montgomery', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', rating: 5, date: 'Oct 24, 2025', comment: 'Heritage Wedding Co. captured our Savannah mansion gala with absolute poise. The lighting work is literal fine art. Every frame belongs in a gallery.', verified: true },
      { name: 'David Mercer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', rating: 4.8, date: 'Sep 12, 2025', comment: 'Incredible team. They worked seamlessly with our venue planner and knew the exact sunset spots around Forsyth Park.', verified: true }
    ]
  },
  'vendor-2': {
    phone: '(843) 555-0189',
    email: 'hello@bespokeflorals.com',
    website: 'www.bespokeflorals.com',
    instagram: '@bespoke_florals_charleston',
    gallery: [
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      { label: 'Sourcing', value: 'Eco-certified farms & locally grown Savannah greenery' },
      { label: 'Setup Window', value: '4 hours minimum on-site prep' },
      { label: 'Style Portfolio', value: 'Lush garden, classical European, organic modern' },
      { label: 'Vessels Included', value: 'Hand-blown glass, gold brass urns, sandstone vases' }
    ],
    availability: [
      { day: 'Friday', date: 'Oct 18', slots: ['10:00 AM', '03:00 PM'], status: 'Available' },
      { day: 'Saturday', date: 'Oct 19', slots: ['11:00 AM'], status: 'Limited' },
      { day: 'Sunday', date: 'Oct 20', slots: ['09:00 AM', '02:00 PM'], status: 'Available' }
    ],
    reviews: [
      { name: 'Charlotte Vance', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80', rating: 5, date: 'Nov 02, 2025', comment: 'Bespoke Floral created a dramatic overhanging floral installation that was the talk of the entire weekend. Absolutely breathtaking craftsmanship!', verified: true },
      { name: 'Liam Ross', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', rating: 4.6, date: 'Aug 21, 2025', comment: 'Very professional. Took our color guidelines and elevated them to something incredible. A joy to work with.', verified: true }
    ]
  },
  'vendor-3': {
    phone: '(707) 555-0921',
    email: 'booking@jeanlucgastronomy.com',
    website: 'www.jeanlucgastronomy.com',
    instagram: '@chef_jeanluc_napa',
    gallery: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      { label: 'Cuisine Focus', value: 'French-Mediterranean Fusion with California touch' },
      { label: 'Staffing Ratio', value: '1 sommelier & 1 server per 8 guests' },
      { label: 'Dietary Options', value: 'Organic vegan, gluten-free, custom allergen charts' },
      { label: 'Wine Pairing', value: 'Prestige vintages curated from private reserves' }
    ],
    availability: [
      { day: 'Friday', date: 'Oct 18', slots: [], status: 'Booked' },
      { day: 'Saturday', date: 'Oct 19', slots: ['06:00 PM'], status: 'Limited' },
      { day: 'Sunday', date: 'Oct 20', slots: ['12:00 PM', '05:00 PM'], status: 'Available' }
    ],
    reviews: [
      { name: 'Elena Vance', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', rating: 5, date: 'Oct 19, 2025', comment: 'We booked Chef Jean-Luc for our private salon dinner in Savannah. The truffle-infused wagyu paired with vintage champagne was out of this world.', verified: true },
      { name: 'Robert Sinclair', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', rating: 4.9, date: 'Oct 05, 2025', comment: 'Flawless culinary orchestration. Every plate was an absolute masterpiece of color and flavor.', verified: true }
    ]
  }
};

const getVendorDetails = (item: CartItem) => {
  const mapped = VENDOR_DETAILS_MAP[item.id];
  if (mapped) return mapped;
  
  return {
    phone: '(912) 555-0100',
    email: `concierge@${item.title.toLowerCase().replace(/[^a-z0-9]/g, '') || 'planviry'}.com`,
    website: `www.${item.title.toLowerCase().replace(/[^a-z0-9]/g, '') || 'planviry'}.com`,
    instagram: `@${item.title.toLowerCase().replace(/[^a-z0-9]/g, '') || 'planviry'}`,
    gallery: [
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      { label: 'Booking Terms', value: '50% retainer deposit, fully refundable up to 30 days before' },
      { label: 'Vibe Match', value: 'Curated elegance, high-society style' },
      { label: 'Location Scope', value: item.location },
      { label: 'Staffing & Support', value: 'Dedicated on-site host and emergency coordinator' }
    ],
    availability: [
      { day: 'Friday', date: 'Oct 18', slots: ['10:00 AM', '04:00 PM'], status: 'Available' as const },
      { day: 'Saturday', date: 'Oct 19', slots: ['02:00 PM'], status: 'Limited' as const },
      { day: 'Sunday', date: 'Oct 20', slots: ['11:00 AM', '03:00 PM'], status: 'Available' as const }
    ],
    reviews: [
      { name: 'Julian Foster', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=120&q=80', rating: 4.8, date: 'Oct 15, 2025', comment: `Absolutely spectacular experience. Booking ${item.title} through Planviry was entirely seamless.`, verified: true },
      { name: 'Sophia Sterling', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', rating: 5, date: 'Sep 29, 2025', comment: `Exceeded our highest expectations. Professional, extremely elegant presentation, and zero hassle.`, verified: true }
    ]
  };
};



export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const location = { pathname: usePathname() };
  const [railExpanded, setRailExpanded] = React.useState(false);
  const {
    activeCategory,
    setActiveCategory,
    cartItems,
    isCartOpen,
    setIsCartOpen,
    selectedItem,
    setSelectedItem,
    addToCart,
    removeFromCart,
    showShareModal,
    setShowShareModal,
    shareEmail,
    setShareEmail,
    collaborators,
    setCollaborators,
    activities,
    setActivities,
    setItinerary,
    setCartItems,
    toastMessage,
    setToastMessage,
    showToast
  } = useApp();

  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  const searchParams = useSearchParams();
  const activeTabSearch = searchParams?.get('tab') || 'categories';

  const [activeTab, setActiveTab] = React.useState<'overview' | 'availability' | 'reviews' | 'contact'>('overview');
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  
  // Booking/Availability state
  const [selectedDateIndex, setSelectedDateIndex] = React.useState<number>(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<string>('');
  const [bookingConfirmed, setBookingConfirmed] = React.useState<boolean>(false);
  
  // Custom Reviews State (stored locally inside component or linked to state)
  const [customReviews, setCustomReviews] = React.useState<Record<string, Array<{ name: string; avatar: string; rating: number; date: string; comment: string; verified: boolean }>>>({});
  const [newReviewName, setNewReviewName] = React.useState<string>('');
  const [newReviewRating, setNewReviewRating] = React.useState<number>(5);
  const [newReviewComment, setNewReviewComment] = React.useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = React.useState<boolean>(false);

  // Inquiry/Contact state
  const [inquiryName, setInquiryName] = React.useState<string>('');
  const [inquiryEmail, setInquiryEmail] = React.useState<string>('');
  const [inquiryMessage, setInquiryMessage] = React.useState<string>('');
  const [inquirySubmitted, setInquirySubmitted] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (selectedItem) {
      setActiveTab('overview');
      setSelectedGalleryImage(null);
      setSelectedDateIndex(0);
      setSelectedTimeSlot('');
      setBookingConfirmed(false);
      setReviewSubmitted(false);
      setNewReviewName('');
      setNewReviewComment('');
      setNewReviewRating(5);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
      setInquirySubmitted(false);
    }
  }, [selectedItem]);

  React.useEffect(() => {
    const shouldLock = isCartOpen || !!selectedItem;
    if (shouldLock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, selectedItem]);

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckoutCart = () => {
    if (cartItems.length === 0) return;
    // Map cart items into the itinerary events
    const newEvents = cartItems.map((item, idx) => ({
      id: `iti-new-${idx}-${Date.now()}`,
      title: item.title,
      category: item.category,
      time: item.time || 'Flexible',
      location: item.location,
      status: 'Confirmed' as const,
      price: item.price,
      date: 'Saturday',
      description: item.description || '',
      image: item.image,
    }));
    setItinerary((prev) => [...prev, ...newEvents]);
    setCartItems([]);
    setIsCartOpen(false);
    navigate('/itinerary');
  };

  const handleInviteCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;
    const name = shareEmail.split('@')[0];
    const newCol = {
      id: `col-${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: shareEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: 'Contributor' as const,
      isViewing: false,
    };
    setCollaborators((prev) => [...prev, newCol]);
    
    // Add activity log
    const newAct = {
      id: `act-${Date.now()}`,
      user: 'You',
      action: `invited ${newCol.name} to the itinerary`,
      time: 'Just now',
      icon: 'person_add',
    };
    setActivities((prev) => [newAct, ...prev]);
    setShareEmail('');
  };

  const sidebarItems: { category: CategoryLens; label: string; icon: string }[] = [
    { category: 'services', label: 'Concierge', icon: 'room_service' },
    { category: 'plan', label: 'Plan', icon: 'event_note' },
    { category: 'things-to-do', label: 'Things To Do', icon: 'explore' },
    { category: 'food-drink', label: 'Food & Drink', icon: 'restaurant' },
    { category: 'live-shows', label: 'Live Shows', icon: 'theater_comedy' },
    { category: 'travel', label: 'Travel', icon: 'flight' },
    { category: 'party', label: 'Party', icon: 'celebration' },
    { category: 'spaces', label: 'Spaces', icon: 'domain' },
    { category: 'vendors', label: 'Vendors', icon: 'storefront' },
  ];


  return (
    <div className="min-h-screen bg-refined-offwhite text-on-surface font-sans">
      
      {/* 1. SideNavBar (Docked Left Hover-Expanding) — adapted from Home/index.tsx */}
      <aside
        id="nav-rail"
        className="fixed left-0 top-0 bottom-0 flex flex-col py-6 bg-surface-container-low border-r border-outline-variant/20 w-24 hover:w-72 transition-all duration-300 overflow-hidden z-40 group shadow-lg"
        onMouseEnter={() => setRailExpanded(true)}
        onMouseLeave={() => setRailExpanded(false)}
      >
        {/* Brand Icon */}
        <div className="px-6 mb-8">
          <div
            className="w-12 h-12 rounded-full bg-[#F47245] flex items-center justify-center text-white font-serif font-bold text-2xl transition-transform duration-300 group-hover:scale-105 shadow-sm cursor-pointer"
            onClick={() => navigate('/')}
          >
            P
          </div>
        </div>

        {/* Lenses Header — shows on hover */}
        <div className={`px-6 mb-4 transition-opacity duration-300 ${railExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="font-serif text-2xl text-primary uppercase tracking-wider">Lenses</h3>
          <p className="text-base text-on-surface-variant">Choose your view</p>
        </div>

        {/* Navigation Lenses */}
        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto hide-scrollbar w-full">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === `/${item.category}`;

            return (
              <button
                key={item.category}
                id={`nav-rail-item-${item.category}`}
                onClick={() => {
                  setActiveCategory(item.category);
                  navigate(`/${item.category}`);
                }}
                className={`flex items-center w-[calc(100%-16px)] mx-2 py-3 rounded-lg shadow-sm transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-secondary-container text-primary translate-x-1 font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                }`}
                title={item.label}
              >
                <div className="w-24 flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <span className={`text-xl uppercase whitespace-nowrap transition-opacity duration-300 ${railExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 2. Global Header Nav (Offset for Navigation Rail on Left) */}
      <nav className="bg-white border-b border-midnight-slate/5 sticky top-0 w-full z-40 pl-24">
        <div className="relative flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-20 max-w-7xl mx-auto">
          <div className="flex items-center gap-stack-lg">
            <span
              className="font-serif italic font-medium text-3xl md:text-4xl text-[#010000] tracking-tighter cursor-pointer mr-6"
              onClick={() => navigate('/')}
            >
              Planviry
            </span>
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigate('/explore?tab=occasions')}
                className={`text-xs uppercase tracking-[0.2em] font-bold hover:text-champagne-gold transition-colors cursor-pointer py-3 border-b-2 ${
                  location.pathname === '/explore' && activeTabSearch === 'occasions'
                    ? 'text-champagne-gold border-champagne-gold'
                    : 'text-midnight-slate border-transparent'
                }`}
              >
                By Occasion
              </button>
              <button
                onClick={() => navigate('/explore?tab=categories')}
                className={`text-xs uppercase tracking-[0.2em] font-bold hover:text-champagne-gold transition-colors cursor-pointer py-3 border-b-2 ${
                  (location.pathname === '/explore' && activeTabSearch === 'categories') || location.pathname === '/vendors'
                    ? 'text-champagne-gold border-champagne-gold'
                    : 'text-midnight-slate border-transparent'
                }`}
              >
                By Category
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-stack-md">
            <div className="flex items-center gap-stack-sm">
              {/* Shopping Bag / Unified Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 text-midnight-slate hover:text-champagne-gold transition-colors cursor-pointer border-none bg-transparent"
              >
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-champagne-gold text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {cartItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0)}
                  </span>
                )}
              </button>
              
              {/* Account Quick Links */}
              <button
                onClick={() => navigate('/vendor-portal')}
                className="p-2 text-midnight-slate hover:text-champagne-gold transition-colors border-none bg-transparent cursor-pointer"
                title="Vendor Portal"
              >
                <User className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container Wrapper (Offset for Left Rail) */}
      <div className="pl-24 flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>

        <SiteFooter />
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL OVERLAY: SHARE OCCASION (With Live Activity Log)                 */}
      {/* ========================================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-midnight-slate/40 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-5xl h-full max-h-[720px] bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300 border border-outline-variant/30">
            {/* Main Sharing Inputs */}
            <div className="flex-1 flex flex-col h-full p-8 md:p-10 border-r border-midnight-slate/5 overflow-y-auto hide-scrollbar">
              <header className="mb-8">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-serif text-3xl font-bold text-midnight-slate">Share this Occasion</h2>
                  <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-midnight-slate/5 rounded-full transition-colors">
                    <X className="w-5 h-5 text-midnight-slate" />
                  </button>
                </div>
                <p className="text-sm text-midnight-slate/60 leading-relaxed">
                  Invite your luxury travel companions to view, discuss, co-plan, and contribute portions.
                </p>
              </header>

              <section className="mb-10">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-3">Invite Collaborators</label>
                <form onSubmit={handleInviteCollaborator} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter companion's email..."
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="flex-grow px-4 py-3 bg-white/70 border border-outline-variant focus:border-primary focus:ring-0 rounded-lg text-sm transition-all outline-none"
                  />
                  <button type="submit" className="px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
                    Send Invite <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-4 flex items-center justify-between p-4 bg-white/50 rounded-lg border border-dashed border-outline-variant">
                  <div className="flex items-center gap-2">
                    <span className="text-champagne-gold">🔗</span>
                    <span className="text-xs text-outline truncate max-w-xs md:max-w-md">planviry.com/gala/invite/savannah-weekend-gala</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://planviry.com/gala/invite/savannah-weekend-gala');
                      alert('Shareable link copied to clipboard!');
                    }}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Copy Link
                  </button>
                </div>
              </section>

              {/* Current Collaborators list */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-outline">Current Collaborators</h3>
                <div className="space-y-3">
                  {collaborators.map((col) => (
                    <div key={col.id} className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/40">
                          <img alt={col.name} className="w-full h-full object-cover" src={col.avatar} />
                        </div>
                        <div>
                          <p className="font-bold text-primary">{col.name}</p>
                          <p className="text-[10px] text-outline">{col.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-neutral-100 rounded font-bold uppercase tracking-wider">{col.role}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Live Activity side panel */}
            <div className="w-full md:w-72 bg-refined-offwhite p-8 overflow-y-auto flex flex-col gap-6 border-t md:border-t-0 border-outline-variant/20">
              <h3 className="text-xs font-bold uppercase tracking-widest text-outline">Collaborators settings</h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-primary">Allow co-planning</p>
                    <p className="text-[10px] text-outline mt-0.5">Let guests add or remove items</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-primary">Cost sharing ledger</p>
                    <p className="text-[10px] text-outline mt-0.5">Enable the pay dashboard</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" />
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Close &amp; Resume Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CART DRAWER (Polymorphic Unified Occasion Cart)                       */}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-outline-variant shadow-2xl z-50 flex flex-col h-full animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-outline-variant bg-surface flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-primary">Unified Occasion Cart</h3>
              <p className="text-xs text-outline mt-0.5">Review items across multiple categories before checking out.</p>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="text-outline hover:text-primary p-2">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-refined-offwhite rounded-xl border border-outline-variant/30">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-sm text-primary">{item.title}</h4>
                        <button onClick={() => handleRemoveFromCart(item.id)} className="text-outline hover:text-error text-xs">
                          Remove
                        </button>
                      </div>
                      <span className="text-[10px] text-champagne-gold font-bold uppercase tracking-widest">{item.category}</span>
                      <p className="text-[11px] text-outline mt-0.5">📍 {item.location}</p>
                    </div>
                    <div className="flex justify-between items-baseline mt-2">
                      <span className="text-xs text-on-surface-variant font-semibold">Qty: {item.quantity || 1}</span>
                      <span className="font-bold text-sm text-primary">${item.price * (item.quantity || 1)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <ShoppingBag className="w-10 h-10 text-outline mx-auto mb-2" />
                <p className="font-serif font-bold text-lg text-primary">Your occasion cart is empty</p>
                <p className="text-xs text-outline mt-1 max-w-xs mx-auto">Explore different category lenses in our marketplace to build your unified narrative.</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-outline-variant bg-surface space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-primary">Subtotal Estimated</span>
              <span className="font-serif text-2xl font-bold text-primary">
                ${cartItems.reduce((acc, curr) => acc + (curr.price * (curr.quantity || 1)), 0).toLocaleString()}
              </span>
            </div>
            
            <button
              onClick={handleCheckoutCart}
              disabled={cartItems.length === 0}
              className="w-full bg-primary hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all text-center shadow-lg"
            >
              Checkout &amp; Add to Itinerary
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ITEM DETAIL DRAWER (Product Detail view)                              */}
      {/* ========================================================================= */}
      {selectedItem && (() => {
        const details = getVendorDetails(selectedItem);
        const currentItemReviews = [
          ...details.reviews,
          ...(customReviews[selectedItem.id] || [])
        ];
        const mainImage = selectedGalleryImage || selectedItem.image;

        return (
          <div className="fixed inset-0 z-50 bg-midnight-slate/40 flex items-center justify-end animate-in fade-in duration-300">
            <div className="glass-panel w-full max-w-2xl h-full bg-white border-l border-outline-variant shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
              
              {/* Header */}
              <div className="p-6 border-b border-outline-variant flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-champagne-gold uppercase tracking-[0.2em]">{selectedItem.category} • {selectedItem.subcategory || 'Luxury Partner'}</span>
                  <h3 className="font-serif text-xl font-bold text-primary mt-0.5">Partner Profile</h3>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-neutral-50 rounded-full transition-colors border-none cursor-pointer bg-transparent">
                  <X className="w-5 h-5 text-midnight-slate" />
                </button>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="px-6 border-b border-outline-variant/30 flex gap-6 bg-refined-offwhite">
                {(['overview', 'availability', 'reviews', 'contact'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 relative transition-all bg-transparent border-none cursor-pointer ${
                      activeTab === tab
                        ? 'text-primary border-champagne-gold font-bold'
                        : 'text-outline hover:text-primary border-transparent'
                    }`}
                  >
                    {tab === 'overview' && 'Overview'}
                    {tab === 'availability' && 'Availability'}
                    {tab === 'reviews' && `Reviews (${currentItemReviews.length})`}
                    {tab === 'contact' && 'Contact & Inquiries'}
                  </button>
                ))}
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                
                {activeTab === 'overview' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Image Gallery Swapping Widget */}
                    <div className="space-y-3">
                      <div className="h-72 rounded-xl overflow-hidden shadow-md border border-outline-variant/20 relative group bg-neutral-100">
                        <img src={mainImage} alt={selectedItem.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute bottom-3 right-3 bg-midnight-slate/80 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                          PREVIEW PORTFOLIO
                        </span>
                      </div>
                      
                      {/* Thumbnails Row */}
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => setSelectedGalleryImage(selectedItem.image)}
                          className={`h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer p-0 bg-transparent ${
                            mainImage === selectedItem.image ? 'border-champagne-gold ring-1 ring-champagne-gold' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={selectedItem.image} alt="Original Portfolio" className="w-full h-full object-cover" />
                        </button>
                        {details.gallery.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedGalleryImage(img)}
                            className={`h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer p-0 bg-transparent ${
                              mainImage === img ? 'border-champagne-gold ring-1 ring-champagne-gold' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Basic Listing Details */}
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h2 className="font-serif text-3xl font-bold text-primary leading-tight">{selectedItem.title}</h2>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-outline font-bold uppercase block">Starting at</span>
                          <span className="font-serif text-2xl font-bold text-champagne-gold block">${selectedItem.price.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-outline mb-6">
                        <span className="flex items-center gap-1">📍 {selectedItem.location}</span>
                        <span>•</span>
                        <span className="bg-champagne-gold/10 text-champagne-gold font-bold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase">
                          {selectedItem.badge || 'Verified Partner'}
                        </span>
                      </div>

                      <div className="p-5 bg-refined-offwhite rounded-xl border border-outline-variant/30 space-y-4">
                        <h4 className="font-serif text-sm font-bold text-primary">Why We Love This Partner</h4>
                        <p className="text-midnight-slate/70 text-sm leading-relaxed">
                          {selectedItem.description || "No description provided. Planviry Preferred Partner listings guarantee strict quality metrics, premium customer support, and seamless cost splits."}
                        </p>
                      </div>
                    </div>

                    {/* Location & Interactive Route Guide Map */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-outline flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-champagne-gold" />
                        LOCATION &amp; ROUTE GUIDE
                      </h4>
                      <div className="rounded-xl overflow-hidden border border-outline-variant/30 shadow-sm bg-neutral-50 h-64 relative">
                        <iframe
                          title={`Map of ${selectedItem.title}`}
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedItem.location + ' ' + selectedItem.title)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                          className="w-full h-full border-none"
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      </div>
                      <p className="text-[10px] text-outline text-right">
                        Exact address and check-in coordinates are dispatched to all split payers upon reservation verification.
                      </p>
                    </div>

                    {/* Specification / Amenity Grid */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-outline">SERVICE SPECIFICATIONS</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {details.specs.map((spec, idx) => (
                          <div key={idx} className="p-3.5 bg-white border border-outline-variant/30 rounded-lg shadow-xs flex flex-col">
                            <span className="text-[9px] font-bold uppercase text-outline tracking-wider">{spec.label}</span>
                            <span className="text-xs font-bold text-primary mt-1">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Why Book through Planviry Info Card */}
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-emerald-800">Planviry Concierge Guarantee</h5>
                        <p className="text-[11px] text-emerald-700/90 mt-0.5 leading-relaxed">
                          Booking includes unified automated payment split among all members, dedicated mediator insurance, and direct concierge service priority coordination.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="text-center max-w-md mx-auto space-y-2">
                      <h4 className="font-serif text-lg font-bold text-primary">Savannah Weekend Co-Planning Availability</h4>
                      <p className="text-xs text-outline leading-relaxed">
                        Verify and book slots for the upcoming Gala weekend (Oct 18 - Oct 20, 2026).
                      </p>
                    </div>

                    {/* Availability Status Ribbon */}
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-center flex items-center justify-center gap-2 text-[11px] text-amber-800 font-bold uppercase tracking-wide">
                      <Clock className="w-4 h-4 text-amber-600" /> Currently Accepting Bookings for savannah Gala
                    </div>

                    {bookingConfirmed ? (
                      <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl text-center space-y-4 animate-in zoom-in-95 duration-300">
                        <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                        <div>
                          <h4 className="font-serif text-lg font-bold text-emerald-950">Appointment Secured!</h4>
                          <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                            You locked in <strong>{details.availability[selectedDateIndex].day}, {details.availability[selectedDateIndex].date} at {selectedTimeSlot}</strong>.
                          </p>
                        </div>
                        <p className="text-[10px] text-emerald-600 font-semibold bg-emerald-100/50 py-1.5 px-3 rounded-full w-fit mx-auto">
                          CALENDAR SYNCHRONIZED ✓
                        </p>
                        <button
                          onClick={() => setBookingConfirmed(false)}
                          className="text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer pt-2 block mx-auto"
                        >
                          Reschedule or Select Another Slot
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Days Grid */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">1. Select Target Date</label>
                          <div className="grid grid-cols-3 gap-3">
                            {details.availability.map((avail, idx) => {
                              const isBooked = avail.status === 'Booked';
                              const isSelected = selectedDateIndex === idx;

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  disabled={isBooked}
                                  onClick={() => {
                                    setSelectedDateIndex(idx);
                                    setSelectedTimeSlot('');
                                  }}
                                  className={`p-4 rounded-xl text-center border transition-all flex flex-col justify-between items-center h-28 cursor-pointer relative bg-white ${
                                    isBooked 
                                      ? 'bg-neutral-50/50 border-neutral-100 opacity-40 cursor-not-allowed' 
                                      : isSelected 
                                        ? 'border-champagne-gold bg-refined-offwhite ring-2 ring-champagne-gold/20' 
                                        : 'border-outline-variant/40 hover:border-outline'
                                  }`}
                                >
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-outline">{avail.day}</span>
                                  <span className="font-serif text-2xl font-bold text-primary mt-1">{avail.date}</span>
                                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mt-2 ${
                                    avail.status === 'Available' 
                                      ? 'bg-emerald-50 text-emerald-700' 
                                      : avail.status === 'Limited' 
                                        ? 'bg-amber-50 text-amber-700' 
                                        : 'bg-rose-50 text-rose-700'
                                  }`}>
                                    {avail.status}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Slots Selection */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-outline">
                            2. Choose Appointment Slot ({details.availability[selectedDateIndex].day}, {details.availability[selectedDateIndex].date})
                          </label>

                          {details.availability[selectedDateIndex].slots.length === 0 ? (
                            <div className="p-4 bg-refined-offwhite rounded-xl text-center text-xs text-outline border border-dashed">
                              ⚠️ No online booking windows remain. Contact concierge directly to arrange priority slots.
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              {details.availability[selectedDateIndex].slots.map((slot) => (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setSelectedTimeSlot(slot)}
                                  className={`py-3 px-4 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                    selectedTimeSlot === slot
                                      ? 'bg-primary border-primary text-white font-bold'
                                      : 'bg-white border-outline-variant/50 text-primary hover:border-outline'
                                  }`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Securing Block Button */}
                        <div className="pt-4">
                          <button
                            type="button"
                            disabled={!selectedTimeSlot}
                            onClick={() => {
                              setBookingConfirmed(true);
                              // Add to activities list in AppContext
                              const dayName = details.availability[selectedDateIndex].day;
                              const dateStr = details.availability[selectedDateIndex].date;
                              const newAct: ActivityLog = {
                                id: `act-${Date.now()}`,
                                user: 'You',
                                action: `secured a private planning slot with "${selectedItem.title}" on ${dayName}, ${dateStr} at ${selectedTimeSlot}`,
                                time: 'Just now',
                                icon: 'calendar_today',
                              };
                              setActivities((prev) => [newAct, ...prev]);
                            }}
                            className="w-full py-4 bg-primary hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:border-none text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-transform active:scale-95 shadow-lg border-none cursor-pointer"
                          >
                            {selectedTimeSlot ? `Secure Slot: ${selectedTimeSlot}` : 'Choose date & time slot to lock'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Aggregated Header Reviews summary */}
                    <div className="bg-refined-offwhite border border-outline-variant/30 rounded-xl p-5 flex items-center justify-between gap-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider">AGGREGATE VERIFIED SCORE</span>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-3xl font-bold text-primary">★ {selectedItem.rating || 4.9}</span>
                          <span className="text-xs text-outline">/ 5.0 Rating</span>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-wider">
                          100% Verified
                        </span>
                        <p className="text-[10px] text-outline mt-1 font-medium">All contributors checked-in</p>
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-outline">CUSTOMER TESTIMONIAL FEED ({currentItemReviews.length})</h4>
                      <div className="space-y-4 divide-y divide-outline-variant/15">
                        {currentItemReviews.map((review, idx) => (
                          <div key={idx} className={`pt-4 ${idx === 0 ? 'pt-0' : ''} space-y-2`}>
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/30">
                                  <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="font-bold text-xs text-primary">{review.name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold text-champagne-gold">★ {review.rating.toFixed(1)}</span>
                                    <span className="text-[9px] text-outline">{review.date}</span>
                                  </div>
                                </div>
                              </div>
                              {review.verified && (
                                <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">
                                  VERIFIED CLIENT
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-midnight-slate/75 leading-relaxed pl-12 italic">
                              "{review.comment}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Write a Review Section Form */}
                    <div className="border-t border-outline-variant/30 pt-6">
                      {reviewSubmitted ? (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-center text-xs font-bold uppercase tracking-wider animate-in zoom-in-95 duration-200">
                          ✓ Review Submitted! Thank you for sharing your experience.
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!newReviewName.trim() || !newReviewComment.trim()) return;

                            const userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
                            const newReview = {
                              name: newReviewName.trim(),
                              avatar: userAvatar,
                              rating: newReviewRating,
                              date: 'Just now',
                              comment: newReviewComment.trim(),
                              verified: true
                            };

                            // Save to local record
                            setCustomReviews((prev) => ({
                              ...prev,
                              [selectedItem.id]: [newReview, ...(prev[selectedItem.id] || [])]
                            }));

                            // Log in Activity
                            const newAct: ActivityLog = {
                              id: `act-${Date.now()}`,
                              user: 'You',
                              action: `published a verified review for "${selectedItem.title}" with a ${newReviewRating}-star rating`,
                              time: 'Just now',
                              icon: 'rate_review',
                            };
                            setActivities((prev) => [newAct, ...prev]);

                            setReviewSubmitted(true);
                            setNewReviewName('');
                            setNewReviewComment('');
                          }}
                          className="bg-refined-offwhite rounded-xl border border-outline-variant/20 p-5 space-y-4"
                        >
                          <h4 className="font-serif text-sm font-bold text-primary">Write a Verified Client Review</h4>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-outline">Your Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Amanda Reed"
                                value={newReviewName}
                                onChange={(e) => setNewReviewName(e.target.value)}
                                required
                                className="w-full px-3 py-2 bg-white border border-outline-variant/50 rounded text-xs outline-none focus:border-primary"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-outline">Star Score</label>
                              <select
                                value={newReviewRating}
                                onChange={(e) => setNewReviewRating(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-white border border-outline-variant/50 rounded text-xs outline-none focus:border-primary"
                              >
                                <option value={5}>★ 5.0 - Exceptional</option>
                                <option value={4}>★ 4.0 - Premium Quality</option>
                                <option value={3}>★ 3.0 - Standard Service</option>
                                <option value={2}>★ 2.0 - Below Expectations</option>
                                <option value={1}>★ 1.0 - Dissatisfied</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase text-outline">Detailed Review Details</label>
                            <textarea
                              placeholder="Describe setup quality, team communications, punctuality, and overall value delivered..."
                              value={newReviewComment}
                              onChange={(e) => setNewReviewComment(e.target.value)}
                              required
                              className="w-full px-3 py-2 bg-white border border-outline-variant/50 rounded text-xs outline-none focus:border-primary min-h-[70px]"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-primary hover:bg-neutral-800 text-white font-bold text-[10px] uppercase tracking-widest rounded transition-all border-none cursor-pointer"
                          >
                            Post Verified Review
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Direct Details Card */}
                    <div className="bg-refined-offwhite border border-outline-variant/30 rounded-xl p-5 space-y-4">
                      <span className="text-[9px] font-bold text-outline uppercase tracking-wider">DIRECT ESCROW COORDINATES</span>
                      <h4 className="font-serif text-lg font-bold text-primary">{selectedItem.title} Liaison</h4>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-champagne-gold" />
                          <div>
                            <span className="text-[9px] text-outline uppercase font-bold block">PHONE</span>
                            <span className="font-bold text-primary">{details.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Mail className="w-4 h-4 text-champagne-gold" />
                          <div>
                            <span className="text-[9px] text-outline uppercase font-bold block">EMAIL</span>
                            <span className="font-bold text-primary truncate block w-28 md:w-44">{details.email}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-champagne-gold" />
                          <div>
                            <span className="text-[9px] text-outline uppercase font-bold block">WEBSITE</span>
                            <span className="font-bold text-primary truncate block w-28 md:w-44">{details.website}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Instagram className="w-4 h-4 text-champagne-gold" />
                          <div>
                            <span className="text-[9px] text-outline uppercase font-bold block">INSTAGRAM</span>
                            <span className="font-bold text-primary">{details.instagram}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Private Consultation Inquiry Form */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-outline">REQUEST BESPOKE QUOTE / CONSULTATION</h4>
                      
                      {inquirySubmitted ? (
                        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl text-center space-y-3 animate-in zoom-in-95 duration-200">
                          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                          <div>
                            <p className="font-bold text-sm text-emerald-950">Inquiry Dispatched!</p>
                            <p className="text-xs text-emerald-700/90 mt-1 leading-relaxed">
                              Liaison team responds typically within 2 hours. Your custom quote estimate was queued.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!inquiryName.trim() || !inquiryMessage.trim()) return;

                            // Dispatch in activity
                            const newAct: ActivityLog = {
                              id: `act-${Date.now()}`,
                              user: 'You',
                              action: `dispatched a custom consultation inquiry with private memo to "${selectedItem.title}"`,
                              time: 'Just now',
                              icon: 'chat',
                            };
                            setActivities((prev) => [newAct, ...prev]);

                            setInquirySubmitted(true);
                          }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-outline">Escrow Email Contact</label>
                              <input
                                type="email"
                                value={inquiryEmail}
                                onChange={(e) => setInquiryEmail(e.target.value)}
                                placeholder="besttimemke@gmail.com"
                                className="w-full px-3.5 py-2.5 bg-white border border-outline-variant/60 rounded-lg text-xs outline-none focus:border-primary"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-outline">Your Name / Title</label>
                              <input
                                type="text"
                                value={inquiryName}
                                onChange={(e) => setInquiryName(e.target.value)}
                                placeholder="Elena Vance"
                                required
                                className="w-full px-3.5 py-2.5 bg-white border border-outline-variant/60 rounded-lg text-xs outline-none focus:border-primary"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase text-outline">Consultation Message / Project Details</label>
                            <textarea
                              value={inquiryMessage}
                              onChange={(e) => setInquiryMessage(e.target.value)}
                              placeholder={`Dear ${selectedItem.title} Coordinator, we are looking forward to orchestrating our private Savannah weekend Gala...`}
                              required
                              className="w-full px-3.5 py-2.5 bg-white border border-outline-variant/60 rounded-lg text-xs outline-none focus:border-primary min-h-[100px] leading-relaxed"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-4 bg-primary hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-all active:scale-[0.98] border-none cursor-pointer"
                          >
                            Submit Concierge Inquiry
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Actions Footer */}
              <div className="p-6 border-t border-outline-variant/20 bg-refined-offwhite flex gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-4 border border-outline-variant bg-white text-primary text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedItem);
                    setSelectedItem(null);
                    showToast(`Successfully added "${selectedItem.title}" to your Unified Occasion Cart!`);
                  }}
                  className="flex-1 py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-champagne-gold transition-colors cursor-pointer border-none"
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Elegant floating premium toast notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#010000] text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 max-w-sm">
            <Sparkles className="w-5 h-5 text-[#F47245] shrink-0 animate-pulse" />
            <div className="flex-1">
              <p className="text-[10px] font-bold tracking-widest text-[#F47245] uppercase">ADDED TO TIMELINE</p>
              <p className="text-xs font-light text-white/90 leading-relaxed">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/50 hover:text-white text-xs font-mono pl-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
