'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Navbar and SiteFooter are provided by root layout - do not re-render
import { 
  Star, MapPin, Globe, Phone, Clock, BadgeCheck, Check, 
  Calendar, ShieldAlert, Award, Grid, Sparkles, MessageSquare, 
  Info, AlertCircle, Heart, Share2, Plus, Minus, ThumbsUp, ChevronLeft, 
  ChevronRight, CreditCard, HelpCircle, X, Send, Trash2
} from 'lucide-react';
import type { HydratedVendorProfile } from '@/lib/vendor-profile-types';
import { useCart, cartItemId } from '@/lib/cart-context';
import { GeoapifyMap } from '@/components/listings/GeoapifyMap';
import { Breadcrumb, type BreadcrumbItem } from '@/components/seo/Breadcrumb';

// ─── Props ─────────────────────────────────────────────────────────────────

interface VendorProfileClientProps {
  vendor: HydratedVendorProfile
  relatedVendors: {
    id: string
    slug: string
    name: string
    priceRange: string | null
    rating: number
    reviewCount: number
    categoryName: string
    imageUrl: string | null
  }[]
  categoryName?: string
  categorySlug?: string | null
  /** Breadcrumb items per build spec: Home > State > City > Category */
  breadcrumbItems?: BreadcrumbItem[]
  geoapifyApiKey?: string
}

// ─── Adapter: HydratedVendorProfile → original code shape ──────────────────
// The original code uses snake_case and certain nested structures
// that differ from HydratedVendorProfile. This adapter bridges the gap
// so the JSX below remains EXACTLY as the user wrote it.

interface AdaptedAmenity {
  label: string
  value: string
}

interface AdaptedCancellationRule {
  days: string
  refundPct: number
}

interface AdaptedCancellationPolicy {
  rules: AdaptedCancellationRule[]
}

interface AdaptedMenuSectionItem {
  name: string
  price: number
}

interface AdaptedMenuSection {
  title: string
  items: AdaptedMenuSectionItem[]
}

interface AdaptedSpecialPromo {
  discountText: string
  title: string
  description: string
  code: string
}

interface AdaptedTeamMember {
  name: string
  role: string
  bio: string
  photoUrl: string
}

interface AdaptedBusinessHour {
  day: string
  hours: string
  isClosed: boolean
}

interface AdaptedPackage {
  tier_name: string
  base_price: number
  features: string[]
}

interface AdaptedAddon {
  id: string
  name: string
  price: number
  description: string
}

interface AdaptedPortfolioImage {
  url: string
  caption: string
  category: string
}

interface AdaptedFaq {
  question: string
  answer: string
}

interface AdaptedVendor {
  id: string
  name: string
  slug: string
  is_claimed: boolean
  imageUrl: string | null
  instant: boolean
  tagline: string
  rating: number
  reviews: number
  city: string | null
  state: string | null
  location: string | null
  lat: number | null
  lng: number | null
  serviceRadiusMiles: number
  phone: string | null
  website: string | null
  about: string
  foundedYear: number
  completedBookings: number
  avgResponseTimeMinutes: number
  depositPct: number
  minBookingNoticeDays: number
  portfolio: AdaptedPortfolioImage[]
  packages: AdaptedPackage[]
  addons: AdaptedAddon[]
  amenities: AdaptedAmenity[]
  acceptedPayments: string[]
  cancellationPolicy: AdaptedCancellationPolicy
  menuSections: AdaptedMenuSection[]
  specialPromo: AdaptedSpecialPromo | null
  team: AdaptedTeamMember[]
  businessHours: AdaptedBusinessHour[]
  faqs: AdaptedFaq[]
}

function adaptVendor(v: HydratedVendorProfile): AdaptedVendor {
  return {
    id: v.id,
    name: v.name,
    slug: v.slug,
    is_claimed: v.isClaimed,
    imageUrl: v.imageUrl,
    instant: v.instant,
    tagline: v.tagline,
    rating: v.rating,
    reviews: v.reviews,
    city: v.city,
    state: v.state,
    location: v.address,
    lat: v.lat,
    lng: v.lng,
    serviceRadiusMiles: v.serviceRadiusMiles,
    phone: v.phone,
    website: v.website,
    about: v.about,
    foundedYear: v.foundedYear,
    completedBookings: v.completedBookings,
    avgResponseTimeMinutes: v.avgResponseTimeMinutes,
    depositPct: v.depositPct,
    minBookingNoticeDays: 14,
    portfolio: v.portfolio.map(p => ({
      url: p.url,
      caption: p.caption,
      category: p.category,
    })),
    packages: v.packages.map(p => ({
      tier_name: p.tierName,
      base_price: p.basePrice,
      features: p.features,
    })),
    addons: v.addons.map(a => ({
      id: a.id,
      name: a.name,
      price: a.price,
      description: a.description,
    })),
    amenities: v.amenities.map((a, i) => ({
      label: a.category || `Spec ${i + 1}`,
      value: a.name,
    })),
    acceptedPayments: ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'ACH Transfer'],
    cancellationPolicy: {
      rules: [
        { days: '30+', refundPct: 100 },
        { days: '14-29', refundPct: 50 },
        { days: '<14', refundPct: 0 },
      ],
    },
    menuSections: [
      {
        title: 'Appetizers',
        items: v.menuItems.filter(m => m.category === 'Appetizers').map(m => ({ name: m.name, price: m.price })),
      },
      {
        title: 'Entrees',
        items: v.menuItems.filter(m => m.category === 'Entrees').map(m => ({ name: m.name, price: m.price })),
      },
      {
        title: 'Desserts',
        items: v.menuItems.filter(m => m.category === 'Desserts').map(m => ({ name: m.name, price: m.price })),
      },
      {
        title: 'Beverages',
        items: v.menuItems.filter(m => m.category === 'Beverages').map(m => ({ name: m.name, price: m.price })),
      },
    ].filter(s => s.items.length > 0),
    specialPromo: v.isFeatured ? {
      discountText: '10% OFF',
      title: 'Early Bird Seasonal Discount',
      description: 'Book your event 60+ days in advance and receive an automatic seasonal discount on all premium packages.',
      code: 'PLANVIRY10',
    } : null,
    team: v.team.map(t => ({
      name: t.name,
      role: t.role,
      bio: t.bio || 'Experienced professional',
      photoUrl: t.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    })),
    businessHours: v.businessHours.map(h => ({
      day: h.day,
      hours: h.isClosed ? 'CLOSED' : `${h.open} AM - ${h.close} PM`,
      isClosed: h.isClosed,
    })),
    faqs: v.faq.map(f => ({
      question: f.question,
      answer: f.answer,
    })),
  }
}

export default function VendorProfileClient({ vendor: rawVendor, relatedVendors, categoryName, categorySlug, breadcrumbItems, geoapifyApiKey }: VendorProfileClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  
  const vendor = adaptVendor(rawVendor);
  
  // Claiming form modal states
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimBusinessName, setClaimBusinessName] = useState('');
  const [claimPhone, setClaimPhone] = useState('');
  const [claimEmail, setClaimEmail] = useState('');
  const [claimWebsite, setClaimWebsite] = useState('');
  const [claimZip, setClaimZip] = useState('');
  const [claimBio, setClaimBio] = useState('');
  const [coiUploaded, setCoiUploaded] = useState(false);

  // --- SECTIONS STATES ---
  // Favorites bookmark state (§1)
  const [isSaved, setIsSaved] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Booking config states (§2, §5)
  const [selectedPackageIdx, setSelectedPackageIdx] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [bookingDate, setBookingDate] = useState<number | null>(null);
  const [showBookSuccessModal, setShowBookSuccessModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalText, setProposalText] = useState("");

  // Rich portfolio image gallery states (§3)
  const [portfolioFilter, setPortfolioFilter] = useState<'all' | 'ceremony' | 'reception' | 'social'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('info');

  // Culinary Menu config states (§7)
  const [menuSearch, setMenuSearch] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<string>("all");
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);

  // Amenities drawer open (§8)
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Operating Hours Live Badge (§9)
  // Initialize to null to avoid hydration mismatch - server and client
  // would otherwise compute different `new Date()` values, causing
  // the isCurrentlyOpen badge to differ between SSR and client render.
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Custom Reviews stream with Guest Upload Photos (§11)
  const [customReviews, setCustomReviews] = useState<Array<{
    id: number;
    author: string;
    rating: number;
    text: string;
    date: string;
    photos?: string[];
    reply?: string;
    helpfulCount: number;
    hasLikedHelpful?: boolean;
  }>>([
    { 
      id: 1, 
      author: 'Hannah L.', 
      rating: 5, 
      text: 'Absolutely spectacular. Highly communicative from first contact to cleanup.', 
      date: '3 weeks ago',
      helpfulCount: 8,
      photos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=300'
      ],
      reply: 'Thank you Hannah! We loved coordinating your grand ballroom reception.'
    },
    { 
      id: 2, 
      author: 'Robert M.', 
      rating: 4, 
      text: 'Very professional. Set up everything exactly as we modeled on the floor plan.', 
      date: '1 - month ago',
      helpfulCount: 3,
      reply: 'Thanks Robert! Looking forward to framing future celebrations with you.'
    }
  ]);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewPhotoInput, setReviewPhotoInput] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [reviewsSort, setReviewsSort] = useState<'newest' | 'rating-desc'>('newest');

  // Meet the Team Message system (§12)
  const [messagedMember, setMessagedMember] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'team'; text: string }>>([
    { sender: 'team', text: "Hello! We are glad you're looking over our Tennessee services. Send us your custom timeline or event requirements here." }
  ]);

  // Expandable FAQS (§16)
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // similar local listings (§17)
  const [similarListings, setSimilarListings] = useState<any[]>([]);

  // Update timezone clock dynamically - set initial time on mount
  // so it only uses the client's clock (avoids hydration mismatch)
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Fetch bookmarks from localStorage safely
  useEffect(() => {
    const saved = localStorage.getItem('planviry_saved_vendors');
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      setIsSaved(parsed.includes(vendor.id));
    }
  }, [vendor.id]);

  // Seed similar listings from relatedVendors
  useEffect(() => {
    if (relatedVendors && relatedVendors.length > 0) {
      setSimilarListings(relatedVendors.map(rv => ({
        id: rv.id,
        slug: rv.slug,
        name: rv.name,
        imageUrl: rv.imageUrl,
        rating: rv.rating,
        reviews: rv.reviewCount,
        city: vendor.city,
        category: rawVendor.category,
      })));
    }
  }, [relatedVendors, vendor.city, rawVendor.category]);

  // Seed pre-claims fields
  useEffect(() => {
    setClaimBusinessName(vendor.name);
    setClaimPhone(vendor.phone || '');
    setClaimWebsite(vendor.website || '');
    setClaimZip(rawVendor.zip || '');
  }, [vendor.name, vendor.phone, vendor.website, rawVendor.zip]);

  // Toggle Save/Bookmark state
  const handleToggleSave = () => {
    const saved = localStorage.getItem('planviry_saved_vendors');
    let parsed: string[] = saved ? JSON.parse(saved) : [];
    if (parsed.includes(vendor.id)) {
      parsed = parsed.filter(id => id !== vendor.id);
      setIsSaved(false);
    } else {
      parsed.push(vendor.id);
      setIsSaved(true);
    }
    localStorage.setItem('planviry_saved_vendors', JSON.stringify(parsed));
  };

  // Coi Signed Upload
  const handleAddSensingPhoto = () => {
    if (reviewPhotoInput && !reviewPhotos.includes(reviewPhotoInput)) {
      setReviewPhotos([...reviewPhotos, reviewPhotoInput]);
      setReviewPhotoInput('');
    }
  };

  // Submit claiming form from owner view
  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claimBio.length < 50) {
      alert('The specifications state your business bio must have a minimum of 50 characters to publish.');
      return;
    }
    setShowClaimModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate standard itemized receipt sums based on addons + date shifts
  const selectedPkg = vendor.packages[selectedPackageIdx] || vendor.packages[0];
  const addonsTotal = selectedAddons.reduce((sum, currentId) => {
    const foundAddon = vendor.addons.find(a => a.id === currentId);
    return sum + (foundAddon ? foundAddon.price : 0);
  }, 0);

  const basePriceValue = selectedPkg.base_price;
  const rawSubtotal = basePriceValue + addonsTotal;
  
  // Date shift trigger (+15% Peak October-December demand surcharge)
  const isPeakSeason = bookingDate ? (bookingDate >= 10 && bookingDate <= 25) : false;
  const seasonalPremiumAmount = isPeakSeason ? Math.round(rawSubtotal * 0.15) : 0;
  
  const estimatedTotalSum = rawSubtotal + seasonalPremiumAmount;
  const requiredDepositSum = Math.round(estimatedTotalSum * (vendor.depositPct / 100));

  // Toggle active add-ons
  const handleAddonToggle = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(a => a !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  // Share profile copiers
  const handleShareClick = () => {
    const dummyUrl = window.location.href;
    navigator.clipboard.writeText(dummyUrl).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  // Interactive booking CTA trigger
  const handleInquireOrBook = () => {
    if (!bookingDate) {
      alert("Please select a valid event date on the Availability Calendar before continuing.");
      return;
    }
    if (vendor.instant) {
      addItem({
        id: cartItemId('booking', vendor.id, vendor.packages[selectedPackageIdx]?.tier_name || 'package'),
        type: 'booking',
        listing_id: vendor.id,
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        vendor_slug: vendor.slug,
        date: `2026-06-${bookingDate}`,
        package_id: vendor.packages[selectedPackageIdx]?.tier_name || 'package',
        package_name: vendor.packages[selectedPackageIdx]?.tier_name || 'Package',
        amount: estimatedTotalSum,
        deposit_amount: requiredDepositSum,
        quantity: 1,
        image_url: vendor.imageUrl,
        category: rawVendor.category,
      });
      setShowBookSuccessModal(true);
    } else {
      setShowProposalModal(true);
    }
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalText.trim()) return;
    alert(`Thank you for submitting your custom inquiry. An estimate summary has been locked under deposit clearance. Candidate response within: ${vendor.avgResponseTimeMinutes} minutes.`);
    setShowProposalModal(false);
    setProposalText("");
  };

  const handleTeamChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    const userMsg = { sender: 'user' as const, text: chatMessage };
    setChatLog(prev => [...prev, userMsg]);
    setChatMessage("");

    setTimeout(() => {
      const reply = { sender: 'team' as const, text: `Hello from the ${messagedMember}! We have received your query about dates around June ${bookingDate || 'the summer'}. Let's secure your requirements once checkout deposits clear.` };
      setChatLog(prev => [...prev, reply]);
    }, 1200);
  };

  // Filter portfolio images
  const filteredPortfolio = vendor.portfolio.filter(item => {
    if (portfolioFilter === 'all') return true;
    return item.category === portfolioFilter;
  });

  // Operating Hours dynamic timezone clearance evaluation
  // Returns false during SSR (currentTime === null) to avoid hydration mismatch
  const isCurrentlyOpen = (() => {
    if (!currentTime) return false;
    const currentDayStr = currentTime.toLocaleDateString('en-US', { weekday: 'short' });
    const currentHour = currentTime.getHours();
    
    const foundHourRule = vendor.businessHours.find(h => h.day.toLowerCase().includes(currentDayStr.toLowerCase()));
    if (!foundHourRule || foundHourRule.isClosed) return false;
    
    return currentHour >= 9 && currentHour < 18;
  })();

  // Reviews actions
  const handleLeaveReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const addedReview = {
      id: Date.now(),
      author: 'Milestone Planner',
      rating: newReviewRating,
      text: newReviewText,
      date: 'Just Now',
      photos: reviewPhotos.length > 0 ? [...reviewPhotos] : undefined,
      helpfulCount: 0
    };

    setCustomReviews([addedReview, ...customReviews]);
    setNewReviewText('');
    setReviewPhotos([]);
  };

  const handleHelpfulClick = (rId: number) => {
    setCustomReviews(customReviews.map(r => {
      if (r.id === rId) {
        if (r.hasLikedHelpful) {
          return { ...r, helpfulCount: r.helpfulCount - 1, hasLikedHelpful: false };
        } else {
          return { ...r, helpfulCount: r.helpfulCount + 1, hasLikedHelpful: true };
        }
      }
      return r;
    }));
  };

  // Sorting & Filtering Reviews stream
  const displayedReviews = customReviews
    .filter(r => {
      if (ratingFilter === 'all') return true;
      return r.rating === ratingFilter;
    })
    .sort((a, b) => {
      if (reviewsSort === 'rating-desc') return b.rating - a.rating;
      return b.id - a.id;
    });

  // Claim checking verification tool logic (§18)
  const canPublishCheck = {
    hasName: vendor.name.length > 0,
    hasBio: vendor.about.length >= 50,
    hasPhone: !!vendor.phone,
    hasHeroImage: !!vendor.imageUrl,
    hasPortfolio: vendor.portfolio.length >= 3,
    hasPackages: vendor.packages.length > 0,
    hasStripeConnected: true
  };

  const totalChecks = Object.values(canPublishCheck).filter(Boolean).length;
  const maxChecks = Object.keys(canPublishCheck).length;

  // ================= CLAIMED STATE PROFILE RENDERING =================
  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col font-sans">
      {!vendor.is_claimed && (
        <div id="unclaimed-banner" className="bg-teal-500 text-black font-semibold text-center py-3.5 px-4 text-xs md:text-sm sticky top-0 z-30 transition-all flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 border-b border-teal-600/20 shadow-sm animate-in fade-in duration-300">
          <span className="flex items-center justify-center gap-1.5 font-sans font-bold">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            Is this your business? Claim this listing for free to edit details, manage packages, and accept bookings.
          </span>
          <button 
            onClick={() => setShowClaimModal(true)}
            className="bg-black hover:bg-neutral-800 text-white active:scale-95 text-xs font-bold py-1.5 px-4 rounded-full transition-all flex items-center gap-1.5 shrink-0"
          >
            Claim This Business &rarr;
          </button>
        </div>
      )}
      
      <div className="flex-1 pb-24">
        
        {/* BREADCRUMB - per build spec: Home > State > City > Category > Vendor */}
        <Breadcrumb
          items={breadcrumbItems ?? []}
          currentPage={vendor.name}
        />

        {/* §1 HEADER / HERO BAND */}
        <section id="claimed-profile-hero" className="h-[45vh] md:h-[55vh] w-full relative bg-gray-950 overflow-hidden">
          <img 
            src={vendor.imageUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200'} 
            alt="Vendor Portfolio Hero" 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Gentle black grandient bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20"></div>
          
          <div className="absolute bottom-8 left-0 right-0 z-10 px-6 md:px-12 text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                  {vendor.is_claimed ? (
                    <>
                      <span className="inline-flex items-center gap-1 bg-black/60 border border-teal-500/40 text-teal-300 text-[10px] font-bold uppercase py-1 px-3 rounded-full shadow-md backdrop-blur-md">
                        <BadgeCheck className="w-3.5 h-3.5 text-teal-400" /> Identity Verified
                      </span>
                      <span className="inline-flex items-center gap-1 bg-black/60 border border-teal-500/40 text-teal-300 text-[10px] font-bold uppercase py-1 px-3 rounded-full shadow-md backdrop-blur-md">
                        <Check className="w-3.5 h-3.5 text-teal-400" /> Insured Partner
                      </span>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-black/65 border border-red-500/30 text-coral-400 text-[10px] font-extrabold uppercase py-1 px-3 rounded-full shadow-md backdrop-blur-md select-none">
                      <ShieldAlert className="w-3.5 h-3.5 text-coral-400 shrink-0" /> Unclaimed Directory Profile
                    </span>
                  )}
                  {vendor.instant && (
                    <span className="inline-flex items-center gap-1 bg-coral-500/90 text-white text-[10px] font-bold uppercase py-1 px-3 rounded-full shadow-md">
                      <Clock className="w-3.5 h-3.5" /> Instant Book Active
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-5xl font-black tracking-tight leading-none mb-2 font-sans text-white drop-shadow-md">
                  {vendor.name}
                </h1>
                
                <p className="text-teal-400 text-xs md:text-sm font-bold uppercase tracking-wider mb-2">
                  {vendor.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-300 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-coral-500 text-coral-500" />
                    <span className="text-white font-extrabold">{vendor.rating}</span>
                    <span>({vendor.reviews} Verified Reviews)</span>
                  </div>
                  <span>&bull;</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>{vendor.city}, {vendor.state}</span>
                  </div>
                  <span>&bull;</span>
                  <span>Est. {vendor.foundedYear} ({new Date().getFullYear() - vendor.foundedYear} Years in Business)</span>
                  <span>&bull;</span>
                  <span className="text-teal-400 font-bold">{vendor.completedBookings} Completed Bookings</span>
                </div>
              </div>

              {/* Action utilities - Heart / Share */}
              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
                <button 
                  onClick={handleToggleSave}
                  className={`p-3 rounded-xl border backdrop-blur-md transition-all flex items-center gap-2 text-xs font-bold ${
                    isSaved 
                      ? 'bg-coral-500 border-coral-500 text-white shadow-lg scale-105' 
                      : 'bg-black/40 border-white/20 text-white hover:bg-black/60 hover:border-white/40'
                  }`}
                  title={isSaved ? "Saved to Favorites" : "Add to Favorites"}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-white' : ''}`} />
                  {isSaved ? "Saved" : "Save Choice"}
                </button>

                <div className="relative">
                  <button 
                    onClick={handleShareClick}
                    className="p-3 bg-black/40 border border-white/20 hover:bg-black/60 hover:border-white/40 text-white rounded-xl backdrop-blur-md transition-all flex items-center gap-2 text-xs font-bold"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Link
                  </button>
                  {shareCopied && (
                    <div className="absolute right-0 bottom-full mb-2 bg-neutral-900 border border-teal-500/30 text-teal-400 text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap animate-bounce">
                      Copied with success!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Page Grid Layout */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT CONTENT RAILS */}
          <div className="flex-1 w-full overflow-hidden flex flex-col gap-6">
            
            {/* Nav Tabs Selector */}
            <div className="flex overflow-x-auto gap-2 pb-4 border-b border-gray-150 z-20 sticky top-[72px] bg-white/95 backdrop-blur-md">
              {[
                { id: 'info', label: 'Business Info', icon: Info },
                { id: 'services', label: 'Services', icon: Sparkles },
                { id: 'book', label: 'Book', icon: Calendar },
                { id: 'support', label: 'Support', icon: HelpCircle },
                { id: 'gallery', label: 'Gallery', icon: Grid },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 select-none ${
                      isSelected
                        ? 'bg-black text-white'
                        : 'text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100/85'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: GALLERY */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                {/* Images Showcase */}
                <div id="claimed-gallery-images" className="space-y-4 font-sans">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-100">
                    <div>
                      <h2 className="text-xl font-black text-black">Visual Portfolio Showcase</h2>
                      <p className="text-xs text-gray-400 font-bold">Real client captures & verified setup arrangements.</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-150">
                      {(['all', 'ceremony', 'reception', 'social'] as const).map(tab => (
                        <button 
                          key={tab}
                          type="button"
                          onClick={() => setPortfolioFilter(tab)}
                          className={`text-[10px] font-extrabold uppercase py-1.5 px-3 rounded-lg transition-all ${
                            portfolioFilter === tab 
                              ? 'bg-teal-500 text-black shadow-sm' 
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {filteredPortfolio.map((img, index) => (
                      <div 
                        key={index}
                        onClick={() => setLightboxIndex(vendor.portfolio.indexOf(img))}
                        className="group aspect-video md:aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in border border-gray-200 relative"
                      >
                        <img 
                          src={img.url} 
                          alt={img.caption} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-end p-2.5">
                          <span className="text-[10px] text-white font-semibold line-clamp-1">{img.caption}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Videos Showcase */}
                <div id="claimed-gallery-videos" className="pt-8 border-t border-gray-150 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-black">Commercial Event Reels & Highlights</h3>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">High-definition highlight loops of live event venues and configurations.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-100 border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative group">
                      <video 
                        className="w-full aspect-video object-cover" 
                        controls 
                        playsInline 
                        muted 
                        loop
                        src="https://assets.mixkit.co/videos/preview/mixkit-wedding-rings-on-a-table-40176-large.mp4"
                      ></video>
                      <div className="p-4 bg-white">
                        <span className="text-[9px] font-black uppercase text-teal-600 block mb-1">Aesthetic Highlight Reel</span>
                        <h4 className="font-extrabold text-xs text-gray-900">Custom Milestone Setup & Atmosphere Loops</h4>
                      </div>
                    </div>

                    <div className="bg-slate-100 border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative group">
                      <video 
                        className="w-full aspect-video object-cover" 
                        controls 
                        playsInline 
                        muted 
                        loop
                        src="https://assets.mixkit.co/videos/preview/mixkit-decorations-and-tables-at-a-banquet-kitchen-40226-large.mp4"
                      ></video>
                      <div className="p-4 bg-white">
                        <span className="text-[9px] font-black uppercase text-teal-600 block mb-1">Service & Presentation Loops</span>
                        <h4 className="font-extrabold text-xs text-gray-900">Banquet Prep & Culinary Choreography</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: BUSINESS INFO */}
            {activeTab === 'info' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                {/* Business Description */}
                <div id="claimed-about" className="space-y-4">
                  <h2 className="text-xl font-black text-black font-sans">Business Description</h2>
                  <p className="text-gray-750 leading-relaxed font-sans text-sm font-medium">
                    {vendor.about}
                  </p>
                </div>

                {/* About / Specialties */}
                <div className="bg-slate-50/70 rounded-xl p-4 border border-gray-150">
                  <span className="text-[10px] uppercase tracking-wider text-teal-600 font-extrabold block mb-2 font-sans font-extrabold">Our specialties & signature philosophy</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-650 font-bold font-sans">
                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-500 shrink-0" /> Full-cycle vendor checkouts & cart tracking</span>
                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-500 shrink-0" /> Tailored floorplan space choreography</span>
                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-500 shrink-0" /> Direct 24/7 dedicated administrative hotline</span>
                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-500 shrink-0" /> Certified local business registry clearance</span>
                  </div>
                </div>

                {/* Address / Phone / Website / Email */}
                <div className="pt-6 border-t border-gray-150 space-y-4">
                  <h3 className="text-lg font-black text-black font-sans">Contact & Location Registry</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-150 flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-teal-650 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-black uppercase block font-sans">Street Address</span>
                        <span className="text-xs font-bold text-gray-850 font-sans">{vendor.location || 'Nashville Central District, TN'}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-150 flex items-start gap-3">
                      <Phone className="w-5 h-5 text-teal-650 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-black uppercase block font-sans">Phone Directory</span>
                        <span className="text-xs font-bold text-gray-850 font-mono">{vendor.phone || '(615) 555-0199'}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-150 flex items-start gap-3">
                      <Globe className="w-5 h-5 text-teal-650 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-black uppercase block font-sans">Website Portal</span>
                        <a href={vendor.website || '#'} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-teal-600 hover:underline font-mono">{vendor.website || 'https://planviry.com'}</a>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-150 flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-teal-650 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-black uppercase block font-sans">Primary Verified Email</span>
                        <span className="text-xs font-bold text-gray-850 font-mono">{vendor.slug || 'contact'}@planviry.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Thumbnail */}
                <div className="pt-6 border-t border-gray-150 space-y-4">
                  <h3 className="text-lg font-black text-black font-sans">Interactive Regional Map Location</h3>
                  {vendor.lat != null && vendor.lng != null ? (
                    <GeoapifyMap
                      lat={vendor.lat}
                      lng={vendor.lng}
                      label={`${vendor.city || ''}${vendor.state ? `, ${vendor.state}` : ''}`}
                      radiusMiles={vendor.serviceRadiusMiles}
                      apiKey={geoapifyApiKey}
                    />
                  ) : (
                    <div className="h-[220px] bg-slate-100 rounded-2xl border border-gray-200 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <MapPin className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Location unavailable</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Team */}
                <div id="claimed-staff" className="pt-6 border-t border-gray-150 space-y-4">
                  <div className="flex justify-between items-baseline mb-4">
                    <div>
                      <h3 className="text-lg font-black text-black font-sans">Verified Key Representatives</h3>
                      <p className="text-xs text-gray-400 font-bold mt-0.5 font-sans">Meet the on-site crew and message directly for floor inspections.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {vendor.team.map((member, idx) => (
                      <div key={idx} className="flex gap-4 p-4 border border-gray-150 rounded-xl bg-slate-50">
                        <img 
                          src={member.photoUrl} 
                          alt={member.name} 
                          className="w-14 h-14 object-cover rounded-full border-2 border-white ring-2 ring-teal-500/10 shrink-0 bg-gray-100"
                        />
                        <div className="space-y-1 font-sans">
                          <span className="text-xs font-extrabold text-gray-900 block leading-none">{member.name}</span>
                          <span className="text-[9px] font-extrabold uppercase text-teal-600 tracking-widest block">{member.role}</span>
                          <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-2">{member.bio}</p>
                          
                          <button 
                            type="button"
                            onClick={() => {
                              setMessagedMember(member.name);
                              setChatLog([{ sender: 'team', text: `Hi there! I am ${member.name}, managing rep at ${vendor.name}. Ask me any specs directly about custom layouts or our June ${bookingDate ? `June ${bookingDate}` : 'dates'}.` }]);
                            }}
                            className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase text-coral-500 hover:text-coral-600 tracking-wider"
                          >
                            <MessageSquare className="w-3 h-3 text-coral-500 shrink-0" /> Message Directly &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hours of operation */}
                <div id="claimed-hours font-sans" className="pt-6 border-t border-gray-150 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-150">
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase font-sans">Operating Commercial Hours</h3>
                      <span className="text-[10px] text-gray-400 font-semibold block mt-0.5 font-sans font-extrabold">Timezone sync to Nashville TN/US</span>
                    </div>
                    
                    {isCurrentlyOpen ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase py-1 px-3 bg-teal-500 text-black rounded-full animate-pulse font-sans">
                        <Check className="w-3 h-3 shrink-0" /> Active Open Now
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase py-1 px-3 bg-coral-100 text-coral-600 rounded-full font-sans">
                        <X className="w-3 h-3 shrink-0" /> Closed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5 text-center font-sans">
                    {vendor.businessHours.map((hr, idx) => (
                      <div key={idx} className="bg-slate-50 border border-gray-150 rounded-xl p-2.5">
                        <span className="text-[10px] font-extrabold text-black block mb-1 uppercase">{hr.day}</span>
                        <span className="text-[10px] text-gray-550 font-bold leading-normal block">
                          {hr.isClosed ? <span className="text-coral-500 font-black uppercase">CLOSED</span> : hr.hours.replace(' PM', '').replace(' AM', '')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                {/* Specifications Checklist */}
                <div id="claimed-amenities" className="space-y-4">
                  <h2 className="text-xl font-black text-black">Specifications & Attributes Matrix</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vendor.amenities.slice(0, showAllAmenities ? undefined : 4).map((amen, idx) => (
                      <div key={idx} className="flex justify-between items-baseline border-b border-gray-150 pb-2.5 text-xs font-sans">
                        <span className="text-gray-400 font-bold">{amen.label}</span>
                        <span className="text-black font-extrabold text-right">{amen.value}</span>
                      </div>
                    ))}
                  </div>

                  {vendor.amenities.length > 4 && (
                    <button 
                      type="button"
                      onClick={() => setShowAllAmenities(!showAllAmenities)}
                      className="w-full mt-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold py-2 px-4 rounded-xl border border-gray-200 transition-colors font-sans"
                    >
                      {showAllAmenities ? "Show Fewer Attributes" : `View All ${vendor.amenities.length} Specifications`}
                    </button>
                  )}
                </div>

                {/* Accepted Payment Regimes */}
                <div id="claimed-payments-info" className="pt-6 border-t border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2 font-sans">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-extrabold block">Accepted Payment Regimes</span>
                    <div className="flex flex-wrap gap-2">
                      {vendor.acceptedPayments.map((pay, pIdx) => (
                        <span key={pIdx} className="bg-slate-100 py-1.5 px-3 rounded-lg text-[10px] text-slate-700 font-bold font-sans">
                          {pay}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-teal-50 border border-teal-200/20 py-2.5 px-4 rounded-xl text-center shrink-0 font-sans">
                    <span className="text-[9px] text-teal-800 uppercase font-black tracking-widest block leading-none mb-1">Vault Checkout Clear</span>
                    <span className="text-[10px] text-teal-600 block leading-tight font-black font-mono">Stripe Verified Merchant</span>
                  </div>
                </div>

                {/* Community Client Reviews */}
                <div id="claimed-reviews" className="pt-8 border-t border-gray-150 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 pb-2 border-b border-gray-150">
                    <div>
                      <h2 className="text-xl font-black text-black font-sans">Community Client Reviews</h2>
                      <p className="text-xs text-gray-400 font-bold mt-0.5 font-sans">100% verified hires with interactive review-photo galleries.</p>
                    </div>
                    
                    {/* Search & Sort controllers */}
                    <div className="flex flex-wrap gap-2 font-sans">
                      <select 
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        className="bg-slate-50 border border-gray-150 rounded-xl p-2 text-xs font-bold text-gray-650"
                      >
                        <option value="all">All Ratings</option>
                        {[5,4,3].map(st => <option key={st} value={st}>{st} Stars</option>)}
                      </select>
                      <select 
                        value={reviewsSort}
                        onChange={(e) => setReviewsSort(e.target.value as any)}
                        className="bg-slate-50 border border-gray-150 rounded-xl p-2 text-xs font-bold text-gray-650"
                      >
                        <option value="newest">Newest</option>
                        <option value="rating-desc">Highest Rated</option>
                      </select>
                    </div>
                  </div>

                  {/* Progress Bar Rating Distribution Chart */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 bg-slate-50 p-5 rounded-2xl items-center font-sans">
                    <div className="text-center sm:col-span-1 border-r border-gray-200 pr-2">
                      <span className="text-4xl font-black text-black tracking-tight leading-none block font-sans">{vendor.rating}</span>
                      <div className="flex items-center justify-center gap-0.5 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(vendor.rating) ? 'fill-coral-500 text-coral-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold block mt-2 uppercase font-sans">{vendor.reviews} Planners Rated</span>
                    </div>

                    <div className="sm:col-span-3 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const pct = stars === 5 ? 85 : (stars === 4 ? 15 : 0);
                        return (
                          <div key={stars} className="flex items-center gap-2 text-[10px] font-bold text-gray-650 font-sans">
                            <span className="w-12 text-tight">{stars} Star</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div style={{ width: `${pct}%` }} className="h-full bg-teal-500 rounded-full"></div>
                            </div>
                            <span className="w-8 text-right font-mono">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review Loops */}
                  <div className="space-y-6">
                    {displayedReviews.map(r => (
                      <div key={r.id} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0 font-sans">
                        <div className="flex justify-between items-baseline mb-1 font-sans">
                          <span className="font-extrabold text-gray-900 text-xs sm:text-sm">{r.author}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">{r.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, starI) => (
                            <Star key={starI} className={`w-3.5 h-3.5 ${starI < r.rating ? 'fill-coral-500 text-coral-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        
                        <p className="text-xs text-gray-655 leading-relaxed font-sans font-medium mb-3">{r.text}</p>
                        
                        {r.photos && r.photos.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {r.photos.map((pUrl, idx) => (
                              <div 
                                key={idx}
                                onClick={() => {
                                  setLightboxIndex(-idx - 10);
                                }}
                                className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 cursor-zoom-in group"
                              >
                                <img src={pUrl} alt="Review capture" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              </div>
                            ))}
                          </div>
                        )}

                        {r.reply && (
                          <div className="bg-teal-50/40 p-3 rounded-xl border border-teal-200/30 text-[10px] text-teal-800 leading-relaxed mt-2 pl-4 border-l-4 border-l-teal-500 font-medium font-sans">
                            <strong className="block text-teal-900 font-extrabold mb-0.5 font-sans">Response from {vendor.name}:</strong>
                            {r.reply}
                          </div>
                        )}

                        <div className="flex items-center gap-3 mt-3">
                          <button 
                            type="button"
                            onClick={() => handleHelpfulClick(r.id)}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase transition-all py-1 px-3.5 rounded-full border ${
                              r.hasLikedHelpful 
                                ? 'bg-teal-50 border-teal-500 text-teal-700 font-extrabold font-sans' 
                                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-400 font-sans'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            Helpful ({r.helpfulCount})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Standard Review Forms */}
                  <form onSubmit={handleLeaveReviewSubmit} className="pt-5 border-t border-gray-150 space-y-4 bg-slate-50/50 p-4 rounded-xl">
                    <span className="text-xs font-black text-black uppercase pl-1 block border-l-2 border-teal-500">Add Standard Plan Diligence Review</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end font-sans">
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] text-gray-400 font-extrabold uppercase mb-1">Stars Rating</label>
                        <select 
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="w-full bg-white border border-gray-350 rounded-lg p-2 text-xs font-semibold font-sans"
                        >
                          <option value="5">5 Star Standard</option>
                          <option value="4">4 Star Standard</option>
                          <option value="3">3 Star Standard</option>
                        </select>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] text-gray-400 font-extrabold uppercase mb-1">Your Event Feedback</label>
                        <input 
                          type="text"
                          placeholder="Enter details of your event experience..."
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          className="w-full bg-white border border-gray-350 rounded-lg p-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2 font-sans">
                      <label className="block text-[10px] text-gray-400 font-extrabold uppercase mb-1">Add Image URL (Optional)</label>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="Paste high-res JPEG/PNG URL..."
                          value={reviewPhotoInput}
                          onChange={(e) => setReviewPhotoInput(e.target.value)}
                          className="flex-1 bg-white border border-gray-350 rounded-lg p-2 text-xs font-semibold font-mono"
                        />
                        <button 
                          type="button" 
                          onClick={handleAddSensingPhoto}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-[10px] font-bold py-2 px-4 rounded-lg transition-colors border border-gray-300"
                        >
                          Load Photo
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-black font-extrabold text-[10px] uppercase tracking-wider py-2 px-6 rounded-lg shadow-md shrink-0 font-sans">
                        Publish Diligence Review
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB CONTENT: BOOKING, ESTIMATOR, CALENDAR & QUOTES */}
            {activeTab === 'book' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                
                {/* 1. Date Selection Calendar */}
                <div id="claimed-calendar-booking" className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-black">1. Choose Your Event Date</h3>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">Select an available date in June 2026 to lock in your live quote estimate.</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl font-sans">
                    <div className="flex justify-between text-xs font-bold text-gray-800 mb-4 px-1 border-b border-gray-200 pb-2">
                      <span>Nashville & Tennessee District Blocks</span>
                      <span className="text-teal-600 font-extrabold font-mono">June 2026</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold font-mono">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, dIdx) => (
                        <div key={dIdx} className="text-gray-400 uppercase font-black">{day}</div>
                      ))}
                      {[...Array(30)].map((_, i) => {
                        const dayNum = i + 1;
                        const isBlocked = dayNum % 7 === 0 || dayNum === 14 || dayNum === 25;
                        const isSelected = bookingDate === dayNum;

                        return (
                          <button 
                            key={i} 
                            type="button"
                            disabled={isBlocked}
                            onClick={() => setBookingDate(dayNum)}
                            className={`py-2 rounded-xl transition-all text-xs font-bold font-mono ${
                              isBlocked 
                                ? 'bg-coral-50/50 text-coral-300 opacity-60 cursor-not-allowed' 
                                : isSelected
                                  ? 'bg-black text-white font-extrabold scale-102 shadow-sm'
                                  : 'bg-white border border-gray-150 text-gray-700 hover:bg-teal-50'
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Promotional banner if any */}
                {vendor.specialPromo && (
                  <div className="bg-coral-50/40 border-l-4 border-coral-505 p-4 rounded-r-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
                    <div className="space-y-0.5">
                      <span className="inline-block bg-coral-500 text-white text-[9px] font-black uppercase py-0.5 px-2 rounded-full leading-tight">
                        {vendor.specialPromo.discountText}
                      </span>
                      <h4 className="font-extrabold text-black text-xs mt-1">{vendor.specialPromo.title}</h4>
                      <p className="text-[10px] text-gray-500 font-medium max-w-xl">{vendor.specialPromo.description}</p>
                    </div>
                    <div className="shrink-0 bg-white border border-coral-100 text-coral-600 font-mono font-bold text-xs py-1.5 px-3 rounded-lg select-all cursor-copy">
                      Code: {vendor.specialPromo.code}
                    </div>
                  </div>
                )}

                {/* 2. Choose Service Package Tier */}
                <div className="pt-6 border-t border-gray-150 space-y-4">
                  <div>
                    <h3 className="text-base font-black text-black">2. Select Package Tier</h3>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">Pick the service package that fits your event layout.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vendor.packages.map((pkg, idx) => {
                      const isSelected = selectedPackageIdx === idx;
                      return (
                        <div 
                          key={idx}
                          onClick={() => setSelectedPackageIdx(idx)}
                          className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                            isSelected 
                              ? 'bg-teal-50/40 border-teal-500/30 shadow-sm' 
                              : 'bg-gray-50/40 hover:bg-gray-55 border-gray-150'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-extrabold text-sm text-gray-900 leading-tight block">{pkg.tier_name}</h4>
                            {isSelected && (
                              <span className="bg-teal-200 text-teal-800 text-[8px] font-black uppercase py-0.5 px-2 rounded-full leading-none">
                                Selected
                              </span>
                            )}
                          </div>
                          <span className="text-lg font-black text-black block leading-none mb-3">
                            ${pkg.base_price}
                          </span>
                          <ul className="space-y-1">
                            {pkg.features.map((feat, fIdx) => (
                              <li key={fIdx} className="text-[10px] text-gray-650 flex items-center gap-1.5 font-medium leading-normal">
                                <span className="w-1 h-1 bg-coral-500 rounded-full shrink-0"></span>
                                {feat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Choose Custom Culinary Additions if applicable */}
                {vendor.menuSections && vendor.menuSections.length > 0 && (
                  <div className="pt-6 border-t border-gray-150 space-y-4">
                    <div>
                      <h3 className="text-base font-black text-black">3. Customize Culinary Selections</h3>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">Select items to add custom dining choices directly to your quote.</p>
                    </div>

                    <div className="space-y-4 bg-slate-50 p-4 rounded-2xl max-h-80 overflow-y-auto border border-gray-150">
                      {vendor.menuSections.map((sect, sIdx) => (
                        <div key={sIdx} className="space-y-2">
                          <h5 className="text-[10px] font-black text-teal-600 uppercase tracking-wider">{sect.title}</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {sect.items.map((item, idx) => {
                              const isLikedItem = selectedMenuItems.includes(item.name);
                              return (
                                <div 
                                  key={idx}
                                  onClick={() => {
                                    if (isLikedItem) {
                                      setSelectedMenuItems(selectedMenuItems.filter(m => m !== item.name));
                                    } else {
                                      setSelectedMenuItems([...selectedMenuItems, item.name]);
                                    }
                                  }}
                                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all border text-xs font-sans ${
                                    isLikedItem 
                                      ? 'bg-white border-teal-500 shadow-sm font-extrabold' 
                                      : 'bg-white/60 hover:bg-white border-gray-150 text-gray-700'
                                  }`}
                                >
                                  <span className="truncate pr-2 block">{item.name}</span>
                                  <span className="font-bold text-black shrink-0 font-mono">${item.price}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Choose Service Add-ons */}
                {vendor.addons && vendor.addons.length > 0 && (
                  <div className="pt-6 border-t border-gray-150 space-y-4">
                    <div>
                      <h3 className="text-base font-black text-black">4. Optional Service Add-ons</h3>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">Check optional attributes or supplementary coverage equipment.</p>
                    </div>

                    <div className="space-y-2 font-sans">
                      {vendor.addons.map((add) => {
                        const hasAddon = selectedAddons.includes(add.id);
                        return (
                          <div 
                            key={add.id}
                            onClick={() => handleAddonToggle(add.id)}
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                              hasAddon 
                                ? 'bg-teal-50/30 border-teal-500/20 shadow-sm' 
                                : 'bg-white/60 hover:bg-white border-gray-150 hover:border-gray-250'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <input 
                                type="checkbox" 
                                checked={hasAddon}
                                readOnly
                                className="mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 accent-teal-500 shrink-0"
                              />
                              <div>
                                <span className="text-xs font-extrabold text-gray-900 block leading-tight">{add.name}</span>
                                <span className="text-[10px] text-gray-400 font-medium leading-none block mt-1">{add.description}</span>
                              </div>
                            </div>
                            <span className="text-xs font-black text-black shrink-0 font-mono font-bold">+ ${add.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. Live Quote Summary and Deposits Board */}
                <div className="pt-6 border-t border-gray-150">
                  <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 font-sans relative overflow-hidden shadow-md">
                    <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>
                    
                    <div>
                      <h4 className="text-xs text-zinc-400 font-bold uppercase tracking-widest block font-sans">Your Event Quote Summary</h4>
                      <div className="flex justify-between items-baseline mt-1 border-b border-zinc-800 pb-2">
                        <span className="text-sm font-extrabold text-zinc-200">Scheduled Event Date</span>
                        <span className="text-xs font-black font-mono bg-zinc-800 text-teal-400 py-1 px-2.5 rounded-lg font-bold">
                          {bookingDate ? `June ${bookingDate}, 2026` : 'No date chosen (Select above)'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-300 font-medium font-sans">
                      <div className="flex justify-between">
                        <span>Base Package ({vendor.packages[selectedPackageIdx]?.tier_name})</span>
                        <span className="font-mono font-bold">${vendor.packages[selectedPackageIdx]?.base_price || 0}</span>
                      </div>

                      {selectedAddons.length > 0 && (
                        <div className="flex justify-between">
                          <span>Service Add-ons ({selectedAddons.length})</span>
                          <span className="font-mono font-bold">
                            + ${selectedAddons.reduce((sum, addId) => sum + (vendor.addons.find(ad => ad.id === addId)?.price || 0), 0)}
                          </span>
                        </div>
                      )}

                      {selectedMenuItems.length > 0 && (
                        <div className="flex justify-between">
                          <span>Custom Culinary Items ({selectedMenuItems.length})</span>
                          <span className="font-mono font-bold">
                            + ${selectedMenuItems.reduce((sum, mName) => {
                              const itemVal = vendor.menuSections?.flatMap(s => s.items).find(i => i.name === mName);
                              return sum + (itemVal?.price || 0);
                            }, 0)}
                          </span>
                        </div>
                      )}
                      
                      {/* Special promo support */}
                      {vendor.specialPromo && (
                        <div className="flex justify-between text-coral-400 font-semibold border-t border-zinc-800/40 pt-1.5">
                          <span>Promo Discount ({vendor.specialPromo.discountText})</span>
                          <span className="font-mono">- ${
                            vendor.specialPromo.discountText.includes('%') 
                              ? Math.floor((vendor.packages[selectedPackageIdx]?.base_price || 0) * 0.1)
                              : 100
                          }</span>
                        </div>
                      )}
                    </div>

                    {/* Total Quote & Deposit calculations */}
                    <div className="pt-3 border-t border-zinc-800 space-y-2.5 font-sans">
                      {(() => {
                        const basePrice = vendor.packages[selectedPackageIdx]?.base_price || 0;
                        const addonsPrice = selectedAddons.reduce((sum, addId) => sum + (vendor.addons.find(ad => ad.id === addId)?.price || 0), 0);
                        const menuPrice = selectedMenuItems.reduce((sum, mName) => {
                          const itemVal = vendor.menuSections?.flatMap(s => s.items).find(i => i.name === mName);
                          return sum + (itemVal?.price || 0);
                        }, 0);
                        const discountVal = vendor.specialPromo 
                          ? (vendor.specialPromo.discountText.includes('%') ? Math.floor(basePrice * 0.1) : 100)
                          : 0;
                        const grandTotal = Math.max(0, basePrice + addonsPrice + menuPrice - discountVal);
                        const depositPercentage = 0.20;
                        const depositDue = Math.floor(grandTotal * depositPercentage);
                        const remainingBalance = grandTotal - depositDue;

                        return (
                          <>
                            <div className="flex justify-between items-baseline font-sans">
                              <span className="text-sm font-black text-white font-sans">Estimated Grand Total</span>
                              <span className="text-xl font-black font-sans text-teal-400">${grandTotal}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800/60 font-sans text-center">
                              <div className="bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-800/40">
                                <span className="text-[9px] text-zinc-400 uppercase font-black block mb-0.5 font-sans">Deposit Amount (20%)</span>
                                <span className="text-sm font-black font-mono text-teal-300 block">${depositDue}</span>
                                <span className="text-[8px] text-zinc-500 font-extrabold uppercase mt-0.5 block font-sans">Due to Lock Date</span>
                              </div>

                              <div className="bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-800/40">
                                <span className="text-[9px] text-zinc-400 uppercase font-black block mb-0.5 font-sans">Remaining Balance</span>
                                <span className="text-sm font-black font-mono text-zinc-100 block">${remainingBalance}</span>
                                <span className="text-[8px] text-zinc-500 font-extrabold uppercase mt-0.5 block font-sans">Settled at Event</span>
                              </div>
                            </div>

                            {/* Book Now Button */}
                            <div className="pt-3 font-sans">
                              <button 
                                type="button"
                                onClick={() => {
                                  if (!bookingDate) {
                                    alert("Please choose your event date in the form's first step.");
                                    return;
                                  }
                                  alert(`Booking success! Secure checkout opened for your $${depositDue} Deposit on June ${bookingDate}, 2026.`);
                                }}
                                className="w-full bg-teal-500 hover:bg-teal-400 active:scale-98 text-black font-black text-sm uppercase py-3 px-4 rounded-xl transition-all shadow-lg font-extrabold"
                              >
                                Instant Book Now with ${depositDue} Deposit
                              </button>
                              <span className="text-[9px] text-zinc-500 font-bold block text-center mt-2 font-sans">
                                Powered by Safe Vault Stripe processing - cancellation protections apply.
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                  </div>
                </div>

                {/* coordinates map thumbnail */}
                <div className="pt-4 border-t border-gray-150">
                  {vendor.lat != null && vendor.lng != null ? (
                    <GeoapifyMap
                      lat={vendor.lat}
                      lng={vendor.lng}
                      label={`${vendor.city || ''}${vendor.state ? `, ${vendor.state}` : ''}`}
                      radiusMiles={vendor.serviceRadiusMiles}
                      style={{ height: '220px' }}
                      apiKey={geoapifyApiKey}
                    />
                  ) : (
                    <div className="h-[220px] bg-slate-100 rounded-2xl border border-gray-200 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <MapPin className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Location unavailable</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT: SUPPORT, FAQS, POLICIES */}
            {activeTab === 'support' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                {/* 1. Cancellation Policy Rules */}
                <div id="claimed-policies" className="space-y-4 font-sans font-sans">
                  <div>
                    <h2 className="text-xl font-black text-black">Refund & Cancellation Policy</h2>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">
                      Standardized partner refund guidelines clearly laid out based on notice days.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center font-sans">
                    {vendor.cancellationPolicy.rules.map((rule, idx) => (
                      <div key={idx} className="bg-slate-50 border border-gray-150 rounded-2xl p-3">
                        <span className="text-[10px] text-gray-400 uppercase font-black block mb-1 font-sans">{rule.days} Notice</span>
                        <span className="text-base font-black font-mono text-coral-500 block leading-none">
                          {rule.refundPct === 100 ? "100%" : (rule.refundPct === 0 ? "No Refund" : `${rule.refundPct}%`)}
                        </span>
                        <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-widest block mt-1 font-sans">Returned</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-[10px] text-gray-400 font-semibold leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-gray-100 font-sans">
                    * Note: Platform security deposit reserves are held for 48 hours to execute automated diligence verification before standard payouts route to partner business accounts.
                  </p>
                </div>

                {/* 2. Common Service FAQs */}
                <div id="claimed-faq-support" className="pt-6 border-t border-gray-150 space-y-4 font-sans">
                  <div>
                    <h2 className="text-xl font-black text-black">Frequently Asked Questions</h2>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">Quick answers directly from this registered business representative.</p>
                  </div>

                  <div className="space-y-3 pt-2 font-sans">
                    {vendor.faqs.map((faq, idx) => {
                      const isOpen = activeFaq === idx;
                      return (
                        <div key={idx} className="border-b border-gray-150 pb-3 last:border-b-0 font-sans">
                          <button 
                            type="button"
                            onClick={() => setActiveFaq(isOpen ? null : idx)}
                            className="w-full text-left flex justify-between items-center transition-colors py-1 focus:outline-none"
                          >
                            <span className="text-xs font-black text-gray-900 pr-5 font-sans">{faq.question}</span>
                            <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-90 text-teal-600' : ''}`} />
                          </button>

                          {isOpen && (
                            <div className="mt-2 text-xs text-slate-650 leading-relaxed font-semibold pl-1 animate-in fade-in duration-200">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Help Contact Form / Support Tickets */}
                <div id="support-contact-form" className="pt-6 border-t border-gray-150 space-y-4">
                  <div>
                    <h2 className="text-xl font-black text-black">Contact & Support Tickets</h2>
                    <p className="text-xs text-gray-400 font-bold mt-0.5 font-sans">Send a high-priority support request directly through this registry page.</p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    alert("Support ticket logged successfully! A service representative will touch base within 2 hours.");
                  }} className="bg-slate-50 p-4 rounded-xl space-y-3 font-sans">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block bg-emerald-50 border border-emerald-100 py-1.5 px-3 rounded-lg text-center font-mono">
                      ● MyRegistry Service Reps Online
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] text-gray-400 font-extrabold uppercase mb-1">Your Full Name</label>
                        <input type="text" placeholder="Jane Doe" required className="w-full bg-white border border-gray-200 p-2 text-xs rounded-lg font-semibold" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 font-extrabold uppercase mb-1">Email Coordinates</label>
                        <input type="email" placeholder="jane@example.com" required className="w-full bg-white border border-gray-200 p-2 text-xs rounded-lg font-semibold" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-400 font-extrabold uppercase mb-1">Support Request Matter</label>
                      <textarea placeholder="Tell us how we can help with your schedule, payments, or special arrangements..." required rows={3} className="w-full bg-white border border-gray-200 p-2 text-xs rounded-lg font-semibold" />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-[10px] uppercase py-2.5 px-4 rounded-lg shadow-sm transition-all font-sans">
                      Dispatch Support Request
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* BOTTOM AD BANNERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
              <div className="bg-gradient-to-r from-teal-950 to-[#080808] rounded-2xl p-6 text-white flex flex-col justify-between border border-teal-800/10 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                  <BadgeCheck className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                  <span className="text-[9px] font-black tracking-widest uppercase text-teal-400 block mb-1">PLANVIRY ASSURED CHECKOUT</span>
                  <h4 className="text-base font-black tracking-tight leading-snug max-w-xs mb-2">Stripe Integrity Secure Guarantee & Protections</h4>
                  <p className="text-[10px] text-teal-100 font-medium max-w-sm leading-relaxed leading-normal">
                    All partner bookings route through locked client escrow. Diligence checks secure deposit reserves automatically for absolute peace of mind.
                  </p>
                </div>
                <div className="mt-4 relative z-10 flex items-center gap-2">
                  <span className="text-[9px] bg-teal-500 hover:bg-teal-400 text-black font-extrabold uppercase py-1.5 px-3 rounded-lg transition-all cursor-pointer">Learn Integrity Rules</span>
                  <span className="text-[9px] text-teal-300 font-extrabold font-mono">Active Security &bull; Safe Shield</span>
                </div>
              </div>

              <div className="bg-[#0c0c0c] rounded-2xl p-6 text-white flex flex-col justify-between border border-gray-800 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                  <Award className="w-48 h-48 text-[#d4af37]" />
                </div>
                <div className="relative z-10">
                  <span className="text-[9px] font-black tracking-widest uppercase text-[#d4af37] block mb-1">PRO MEMBERS CONCIERGE</span>
                  <h4 className="text-base font-black tracking-tight leading-snug max-w-xs mb-2">Need a White-Glove Dedicated Event Advisor?</h4>
                  <p className="text-[10px] text-gray-400 font-medium max-w-sm leading-relaxed leading-normal">
                    Planviry Plus members unlock guaranteed response response times, customized payment regimes, and legal timeline mediation.
                  </p>
                </div>
                <div className="mt-4 relative z-10 flex items-center gap-2">
                  <span className="text-[9px] bg-[#d4af37] hover:bg-[#ffe066] text-black font-extrabold uppercase py-1.5 px-3 rounded-lg transition-all cursor-pointer">Upgrade to Plus</span>
                  <span className="text-[9px] text-gray-500 font-extrabold font-mono">From $29 / month</span>
                </div>
              </div>
            </div>

            {/* §17 SIMILAR VENDORS / CAROUSEL */}
            <section id="claimed-similar" className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase border-b border-gray-100 pb-2 mb-5">Similar Local Registries You May Like</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarListings.map((sim, sIdx) => {
                  const slugPath = sim.slug;
                  return (
                    <Link
                      key={sim.id}
                      href={`/v/${slugPath}`}
                      className="border border-gray-200 rounded-xl bg-white p-3 shadow-sm hover:border-teal-500 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-150 mb-3">
                          <img 
                            src={sim.imageUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400'} 
                            alt={sim.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-extrabold text-xs text-gray-950 truncate">{sim.name}</h4>
                        <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-gray-500">
                          <Star className="w-3 h-3 fill-coral-500 text-coral-500" />
                          <span>{typeof sim.rating === 'number' ? sim.rating.toFixed(1) : sim.rating} ({sim.reviews})</span>
                          <span>&bull;</span>
                          <span>{sim.city}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-teal-600 hover:underline font-extrabold uppercase mt-2.5 block text-right font-mono">Select Details &rarr;</span>
                    </Link>
                  );
                })}
              </div>
            </section>

          </div>

          {/* RIGHT RAIL - STICKY BOOKING SIDEBAR (§2) */}
          <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-24 space-y-6">
            
            {/* STICKY Booking receipt Panel */}
            <div className="space-y-5 relative">
              <h3 className="text-sm font-black text-black tracking-wider uppercase flex items-center gap-1.5 pb-2 border-b border-gray-150">
                <CreditCard className="w-4 h-4 text-teal-600" /> Staging Estimate & Inquire
              </h3>

              {/* Start package pricing */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Base Tier Price</span>
                  <span className="text-[9px] text-teal-650 bg-teal-50 px-2 py-0.5 rounded-full font-black uppercase">Active Choice</span>
                </div>
                <div className="text-3xl font-black text-black tracking-tight">
                  ${selectedPkg.base_price}
                </div>
                <p className="text-[10px] text-gray-400 font-bold block mt-1 leading-none uppercase">
                  Tier: {selectedPkg.tier_name}
                </p>
              </div>

              {/* Booking Specifications Notice */}
              <div className="space-y-1.5 text-[10px] text-gray-500 font-bold leading-normal">
                <div className="flex justify-between pb-1.5 border-b border-gray-100">
                  <span>Minimum Notice:</span>
                  <span className="text-black font-extrabold">{vendor.minBookingNoticeDays} Days</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-gray-100">
                  <span>Response Time:</span>
                  <span className="text-teal-600 font-extrabold">{vendor.avgResponseTimeMinutes} Mins</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-gray-100">
                  <span>Deposit Required:</span>
                  <span className="text-black font-extrabold">{vendor.depositPct}% Hold</span>
                </div>
              </div>

              {/* Date selection indicator */}
              <div>
                {bookingDate ? (
                  <div className="bg-teal-50/40 rounded-xl p-3 flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <span className="text-[9px] text-gray-450 uppercase font-black block leading-none">Target Hold Locked</span>
                      <span className="text-xs font-black text-teal-900 font-sans">June {bookingDate}, 2026</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-coral-50/40 rounded-xl p-3 flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-coral-500 shrink-0" />
                    <div>
                      <span className="text-[9px] text-gray-450 uppercase font-black block leading-none">Status: Tentative</span>
                      <span className="text-xs font-bold text-coral-600">Choose Date on Calendar Tab</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Customizable checkout receipt calculator */}
              <div className="space-y-2 text-xs text-gray-800 font-semibold">
                <div className="flex justify-between">
                  <span>1x {selectedPkg.tier_name.substring(0, 20)}...</span>
                  <span className="font-mono">${basePriceValue}</span>
                </div>
                
                {selectedAddons.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-gray-150 text-[10px] text-gray-550 font-bold">
                    {selectedAddons.map(addId => {
                      const ad = vendor.addons.find(a => a.id === addId);
                      if (!ad) return null;
                      return (
                        <div key={addId} className="flex justify-between">
                          <span>+ {ad.name.substring(0, 18)}...</span>
                          <span className="font-mono">${ad.price}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {isPeakSeason && (
                  <div className="flex justify-between pt-1 border-t border-gray-150 text-[10px] text-coral-500 font-extrabold">
                    <span>+ Peak Season Premium (+15%)</span>
                    <span className="font-mono">${seasonalPremiumAmount}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-gray-200 font-black text-xs text-black">
                  <span>Estimated Total Sum</span>
                  <span className="font-mono">${estimatedTotalSum}</span>
                </div>

                <div className="flex justify-between pt-1 font-bold text-[10px] text-teal-600">
                  <span>Vault Holds Deposit ({vendor.depositPct}%)</span>
                  <span className="font-mono">${requiredDepositSum}</span>
                </div>
              </div>

              {/* Book now / Request buttons */}
              <div className="space-y-2 pt-2">
                <button 
                  type="button"
                  onClick={handleInquireOrBook}
                  className="w-full bg-black hover:bg-black/85 text-white font-black py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider"
                >
                  {vendor.instant ? "Book Instantly on Cart" : "Inquire to Schedule"}
                </button>

                <button 
                  type="button"
                  onClick={handleToggleSave}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-black font-black py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider"
                >
                  {isSaved ? "Saved in Favorites list" : "Save & Bookmark Partner"}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* §18 FOOTER SUPPORT / CLAIM / VERIFY PROMPTS */}
        <section id="claimed-footer bg-white border-t" className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-10 border-t border-gray-200">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-gray-150 p-8 rounded-3xl shadow-sm items-center">
            
            {/* Publisher verification checker checklist */}
            {!vendor.is_claimed ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-coral-500" />
                  <h4 className="font-extrabold text-black text-sm uppercase tracking-wide">Are you the business owner?</h4>
                </div>
                <p className="text-xs text-gray-500 font-semibold font-sans leading-relaxed">
                  Claim this profile to take ownership of this vendor listing. Once verified, you will be able to customize descriptions, design tiers, connect Stripe for digital secure payouts, and chat directly with planners.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => setShowClaimModal(true)}
                    className="bg-black hover:bg-teal-500 hover:text-black text-white active:scale-95 font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all border border-black shadow-md"
                  >
                    Configure & Claim Free &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-500" />
                  <h4 className="font-black text-black text-sm uppercase tracking-wide">Planviry Registry Publishing Checker</h4>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed leading-snug">
                  This diagnostic check evaluates if your active local registry page qualifies under our white-glove security standards verification badge checklists.
                </p>

                {/* Checklists items */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-700 font-extrabold">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>Interactive Name: YES</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>Stripe Wallet Setup: YES</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>Phone Directory: YES</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>Hero Portfolio Size: YES</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>Standard Packages: YES</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>COI File Upload: YES</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-[11px] font-black text-black mb-1">
                    <span>Verification Grade Range:</span>
                    <span className="text-teal-600 font-mono">{totalChecks} / {maxChecks} ({Math.round((totalChecks/maxChecks)*100)}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div style={{ width: `${(totalChecks/maxChecks)*100}%` }} className="h-full bg-teal-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* General Direct support inquiry cards */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-gray-150 space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-coral-500" />
                <h4 className="font-extrabold text-gray-950 text-xs uppercase tracking-wide">Secure Representative Live Lines</h4>
              </div>
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                Connect directly with representatives before transactions. Direct messaging, timeline layouts, and contract holds are verified.
              </p>
              
              <button 
                onClick={() => {
                  setMessagedMember(vendor.team[0]?.name || "Support Team");
                  setChatLog([{ sender: 'team', text: "Hello! Reach out with your special specifications here. I will review and coordinate soon." }]);
                }}
                className="w-full bg-[#0a0a0a] hover:bg-teal-500 hover:text-black hover:border-teal-500 text-white font-extrabold text-[11px] uppercase tracking-wider py-3 rounded-xl transition-all border border-black shadow-sm"
              >
                Inquire & Chat Live Lines &rarr;
              </button>
            </div>

          </div>

        </section>

      </div>
      
      {/* ================= MODAL LIGHTBOX DIALOGS ================= */}
      
      {/* Claim Business Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setShowClaimModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-950 text-xl font-bold p-2 transition-colors"
              id="btn-close-claim-modal"
            >
              &times;
            </button>

            <div className="mb-6">
              <span className="inline-block bg-teal-50 text-teal-850 text-[10px] font-extrabold uppercase py-1 px-3 rounded-full mb-2 tracking-wider">
                White-Glove Claiming
              </span>
              <h2 className="text-2xl font-black text-black tracking-tight leading-tight">Claim: {vendor.name}</h2>
              <p className="text-gray-500 text-xs mt-1 font-semibold">Fill out your active commercial credentials to unlock live cart checkouts and messaging.</p>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Display Business Name</label>
                <input
                  type="text"
                  required
                  value={claimBusinessName}
                  onChange={(e) => setClaimBusinessName(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={claimPhone}
                    onChange={(e) => setClaimPhone(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-850 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Business Zip</label>
                  <input
                    type="text"
                    required
                    value={claimZip}
                    onChange={(e) => setClaimZip(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-850 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Primary Email</label>
                <input
                  type="email"
                  required
                  value={claimEmail}
                  onChange={(e) => setClaimEmail(e.target.value)}
                  placeholder="partner@yourdomain.com"
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-850 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Website URL</label>
                <input
                  type="url"
                  required
                  value={claimWebsite}
                  onChange={(e) => setClaimWebsite(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-850 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase">Profile Bio (Min 50 Chars)</label>
                  <span className={`text-[10px] font-bold ${claimBio.length >= 50 ? 'text-teal-600' : 'text-coral-500'}`}>
                    {claimBio.length} / 50 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={claimBio}
                  onChange={(e) => setClaimBio(e.target.value)}
                  placeholder="Describe your premium event style, experience, service areas, and historical milestones..."
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-850 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center text-center">
                <div className="text-xs font-bold text-gray-700 block mb-1">Upload Certificate of Insurance (COI)</div>
                <p className="text-[10px] text-gray-500 mb-3 leading-normal font-medium">Required for "Insured" badge verification as specified in Part 16 of registry catalog rules.</p>
                
                {coiUploaded ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-teal-700 font-bold bg-teal-50 py-1.5 px-3 rounded-full border border-teal-200">
                    <Check className="w-3.5 h-3.5" /> coi_record_signed.pdf uploaded
                  </span>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setCoiUploaded(true)}
                    className="bg-white hover:bg-gray-100 text-gray-800 text-[10px] font-bold py-2 px-4 rounded-xl transition-all border border-gray-200"
                  >
                    Attach File (PDF/JPG)
                  </button>
                )}
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-[#0a0a0a] hover:bg-teal-500 text-white hover:text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all border border-black shadow-sm"
                >
                  Submit and Publish Profile &rarr;
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      
      {/* Lightbox photo zoom (§3) */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4 md:p-8">
          <div className="flex justify-between items-center text-white">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
              Portfolio Item Image Zoom {lightboxIndex >= 0 ? `${lightboxIndex + 1} of ${vendor.portfolio.length}` : "Review Capture"}
            </span>
            <button 
              onClick={() => setLightboxIndex(null)}
              className="text-white hover:text-coral-500 text-2xl font-bold p-2 cursor-pointer transition-colors"
              id="btn-close-lightbox"
            >
              &times;
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center p-2">
            {lightboxIndex >= 0 ? (
              <>
                <button 
                  onClick={() => setLightboxIndex(lightboxIndex === 0 ? vendor.portfolio.length - 1 : lightboxIndex - 1)}
                  className="absolute left-2 md:left-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <img 
                  src={vendor.portfolio[lightboxIndex]?.url} 
                  alt={vendor.portfolio[lightboxIndex]?.caption} 
                  className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl"
                />

                <button 
                  onClick={() => setLightboxIndex(lightboxIndex === vendor.portfolio.length - 1 ? 0 : lightboxIndex + 1)}
                  className="absolute right-2 md:right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <img 
                src={
                  lightboxIndex === -10 
                    ? 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800' 
                    : 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800'
                } 
                alt="Review photograph" 
                className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
            )}
          </div>

          <div className="text-center text-gray-300 max-w-xl mx-auto pb-4">
            <p className="text-xs font-semibold leading-relaxed">
              {lightboxIndex >= 0 ? vendor.portfolio[lightboxIndex]?.caption : "Review confirmation upload photo."}
            </p>
          </div>
        </div>
      )}

      {/* Booking Instant Hold Cart Success Modal (§2) */}
      {showBookSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-200/50">
              <Check className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-black text-black leading-tight tracking-tight">Locked in Cart Success!</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed font-semibold">
              The {selectedPkg.tier_name} has been successfully configured into your local checkout path for date <strong className="text-gray-800 font-extrabold">June {bookingDate}</strong>.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button 
                onClick={() => {
                  setShowBookSuccessModal(false);
                  router.push('/cart');
                }}
                className="bg-teal-500 hover:bg-teal-600 text-black font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Go to Checkout Cart &rarr;
              </button>
              <button 
                onClick={() => setShowBookSuccessModal(false)}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold py-2 px-4 rounded-xl transition-all"
              >
                Keep Customizing Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request custom proposal modal (§2) */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowProposalModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-lg font-bold"
            >
              &times;
            </button>
            
            <span className="inline-block bg-teal-50 text-teal-800 text-[9px] font-extrabold uppercase py-0.5 px-2.5 rounded-full mb-1">
              Custom Proposal Loop
            </span>
            <h3 className="text-lg font-black text-gray-950 tracking-tight leading-none mb-1">Inquire with {vendor.name}</h3>
            <p className="text-[11px] text-gray-500 leading-normal font-semibold mb-4">
              Enter details for your custom timeline event on <strong className="text-gray-800">June {bookingDate}</strong>. We will get back to you with custom quotas within {vendor.avgResponseTimeMinutes} minutes.
            </p>

            <form onSubmit={handleSendProposal} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-extrabold uppercase mb-1">Message timeline / specs details</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="E.g., Inquiring for 120 guests plated dining from 5-9 PM. Need vegetarian alternatives..."
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-300 rounded-lg p-3 text-xs text-gray-800 Focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="bg-teal-50 border border-teal-200/40 rounded-xl p-3 text-[10px] text-teal-850 font-semibold leading-normal">
                Estimated lock quote: <strong className="text-black font-extrabold font-mono">${estimatedTotalSum}</strong> with deposit <strong className="text-black font-extrabold font-mono">${requiredDepositSum}</strong>.
              </div>

              <button 
                type="submit"
                className="w-full bg-[#0a0a0a] hover:bg-teal-500 hover:text-black text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider border border-black shadow-md"
              >
                Send Proposal Inquiry &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Staff Representative direct live chat window (§12) */}
      {messagedMember !== null && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-2xl shadow-2xl w-80 max-w-[calc(100vw-32px)] z-40 overflow-hidden flex flex-col h-[350px] animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-neutral-900 px-4 py-3 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <div>
                <span className="text-[10px] text-gray-400 block font-bold uppercase leading-none">Chat representative</span>
                <span className="text-xs font-black block leading-none">{messagedMember}</span>
              </div>
            </div>
            <button 
              onClick={() => setMessagedMember(null)}
              className="text-white hover:text-coral-500 font-bold text-lg p-1"
            >
              &times;
            </button>
          </div>

          {/* Logs */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {chatLog.map((log, lI) => (
              <div key={lI} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2.5 rounded-xl max-w-[85%] text-[10px] leading-relaxed font-semibold shadow-sm ${
                  log.sender === 'user' 
                    ? 'bg-teal-500 text-black border border-teal-600/20 rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-gray-150 rounded-tl-none'
                }`}>
                  {log.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleTeamChatSubmit} className="border-t border-gray-200 p-2 bg-white flex gap-1 items-center">
            <input 
              type="text" 
              placeholder="Ask anything directly..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 bg-slate-50 border border-gray-250 rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-teal-500 outline-none"
            />
            <button 
              type="submit"
              className="bg-teal-500 text-black hover:bg-teal-600 transition-colors p-2 rounded-lg shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
