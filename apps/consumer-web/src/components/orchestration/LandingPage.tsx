'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { POPULAR_CITIES, US_STATES } from '@/lib/planviry-data';
import { PlanBar } from './PlanBar';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<string>('services');
  const [guestCount, setGuestCount] = useState<number>(0);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBeginPlanning = () => {
    window.location.href = '/plan';
  };

  const handleSearch = () => {
    alert(`Searching bespoke occasions for ${guestCount} guest(s)...`);
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Thank you for subscribing! You have been added to our exclusive weekly concierge digest.");
  };

  const sidebarItems = [
    { key: 'services', icon: 'concierge', label: 'Concierge' },
    { key: 'plan', icon: 'event_note', label: 'Plan' },
    { key: 'things-to-do', icon: 'explore', label: 'Things to Do' },
    { key: 'food-drink', icon: 'restaurant', label: 'Food & Drink' },
    { key: 'live-shows', icon: 'theater_comedy', label: 'Live Shows' },
    { key: 'travel', icon: 'flight', label: 'Travel' },
    { key: 'party', icon: 'celebration', label: 'Party' },
    { key: 'spaces', icon: 'domain', label: 'Spaces' },
    { key: 'vendors', icon: 'storefront', label: 'Vendors' }
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md selection:bg-brand-teal/30 min-h-screen">
      {/* TopNavBar */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-refined-offwhite/90 backdrop-blur-md border-b border-midnight-slate/10 h-20 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-full max-w-container-max mx-auto">
          <div className="flex items-center gap-12">
            <h1 className="font-display-lg text-2xl md:text-3xl text-primary tracking-tighter">Planviry</h1>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/services" className="font-body-md text-body-md uppercase tracking-widest text-brand-teal font-bold">Concierge</Link>
              <Link href="/vendors" className="font-body-md text-body-md uppercase tracking-widest text-midnight-slate/60 hover:text-brand-teal transition-colors duration-300">Marketplace</Link>
              <Link href="/things-to-do" className="font-body-md text-body-md uppercase tracking-widest text-midnight-slate/60 hover:text-brand-teal transition-colors duration-300">Inspiration</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button className="hidden md:block px-6 py-2 border border-midnight-slate/20 rounded-full font-label-md hover:bg-midnight-slate hover:text-white transition-all">Download App</button>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-surface-variant rounded-full transition-colors">
                <span className="material-symbols-outlined text-midnight-slate">shopping_bag</span>
              </button>
              <button className="p-2 hover:bg-surface-variant rounded-full transition-colors">
                <span className="material-symbols-outlined text-midnight-slate">person</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* SideNavBar (Docked Left Hover-Expanding) */}
      <aside className="fixed left-0 top-20 h-[calc(100vh-80px)] flex flex-col py-6 bg-surface-container-low border-r border-outline-variant/20 w-20 hover:w-64 transition-all duration-300 overflow-hidden z-40 group shadow-lg">
        <div className="px-6 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-display-lg text-headline-md text-primary uppercase tracking-wider">Lenses</h3>
          <p className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">Choose your view</p>
        </div>
        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto hide-scrollbar w-full">
          {sidebarItems.map((item) => {
            const isActive = activeCategory === item.key;
            return (
              <Link
                key={item.key}
                href={`/${item.key}`}
                className={`flex items-center w-[calc(100%-16px)] mx-2 py-3 rounded-lg shadow-sm transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-secondary-container text-primary translate-x-1 font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                }`}
              >
                <div className="w-16 flex items-center justify-center shrink-0">
                  <span 
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <span className="font-label-caps text-[12px] uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="pl-20 pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex flex-col items-center justify-center overflow-hidden bg-refined-offwhite px-margin-mobile md:px-margin-desktop">
          {/* Background Pattern — gold dot grid, matches original template */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="max-w-container-max w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-16 relative z-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="font-label-md text-brand-teal uppercase tracking-[0.2em]">Plan Every Occasion</span>
                <h1 className="font-display-lg text-6xl md:text-8xl text-midnight-slate leading-[0.9] tracking-tighter">
                  ORCHESTRATE <br /> YOUR <br /> <span className="italic font-normal serif">PERFECT</span> <br /> OCCASION
                </h1>
              </div>
              <p className="font-body-lg text-body-lg text-midnight-slate/70 max-w-lg">
                Discover the world’s most unique experiences through our seamless planning platform. From boutique hideaways to milestone celebrations, we handle every detail with precision.
              </p>
              <div className="flex items-center gap-6">
                <button 
                  onClick={handleBeginPlanning}
                  className="px-10 py-5 bg-midnight-slate text-white rounded-full font-label-md uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
                >
                  BEGIN PLANNING
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-midnight-slate/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                  </div>
                  <span className="font-label-sm text-midnight-slate/60">24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              {/* Mobile App Visualization */}
              <div className="w-[320px] h-[640px] mx-auto bg-midnight-slate rounded-[3rem] p-3 shadow-2xl relative border-[8px] border-midnight-slate">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative flex flex-col">
                  <div className="px-6 pt-12 pb-4 flex justify-between items-center">
                    <h3 className="font-headline-sm text-2xl">Occasions</h3>
                    <span className="material-symbols-outlined">more_horiz</span>
                  </div>
                  <div className="flex gap-4 px-6 border-b border-surface-variant">
                    <button className="pb-2 border-b-2 border-primary font-label-sm uppercase">Planned</button>
                    <button className="pb-2 text-on-surface-variant font-label-sm uppercase">Drafts</button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="bg-surface-container-low p-4 rounded-xl border border-primary/5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-headline-sm text-lg">Milanese Gala</h4>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Confirmed</span>
                      </div>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span> Villa Necchi Campiglio
                      </p>
                      <button className="w-full mt-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider">Manage Details</button>
                    </div>
                    <div className="bg-surface-container-highest/30 p-4 rounded-xl border border-dashed border-outline-variant text-center">
                      <span className="material-symbols-outlined text-outline">add_circle</span>
                      <p className="text-xs font-medium mt-2">New Plan</p>
                    </div>
                  </div>
                  {/* App Bottom Nav */}
                  <div className="mt-auto h-20 bg-white border-t flex justify-around items-center px-4">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                    <span className="material-symbols-outlined text-outline">calendar_month</span>
                    <span className="material-symbols-outlined text-outline">confirmation_number</span>
                    <span className="material-symbols-outlined text-outline">person</span>
                  </div>
                </div>
                {/* Decorative glow — champagne-gold, matches original template palette */}
                <div className="absolute -z-10 inset-0 bg-champagne-gold/20 blur-[100px] rounded-full scale-150"></div>
              </div>
            </div>
          </div>

          {/* Plan Bar — transparent glass pill that sits on the hero gradient */}
          <div className="w-full max-w-6xl mt-12 relative z-20">
            <PlanBar variant="hero" />
          </div>
        </section>
        <section className="section-padding bg-white px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="font-headline-md text-4xl md:text-5xl text-midnight-slate">Everything You Need, <br /> <span className="italic serif font-normal">In One Platform</span></h2>
              <p className="font-body-md text-midnight-slate/60">Our 9-lens marketplace covers every facet of your event lifecycle, from initial scouting to the final vendor payout.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
              <div onClick={() => setActiveCategory('services')} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-refined-offwhite hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-brand-teal/20 group cursor-pointer">
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">concierge</span>
                <span className="font-label-sm uppercase tracking-tight text-center">Services</span>
              </div>
              <div onClick={() => setActiveCategory('plan')} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-refined-offwhite hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-brand-teal/20 group cursor-pointer">
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">event_note</span>
                <span className="font-label-sm uppercase tracking-tight text-center">Plan</span>
              </div>
              <div onClick={() => setActiveCategory('explore')} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-refined-offwhite hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-brand-teal/20 group cursor-pointer">
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">explore</span>
                <span className="font-label-sm uppercase tracking-tight text-center">Do</span>
              </div>
              <div onClick={() => setActiveCategory('dining')} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-refined-offwhite hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-brand-teal/20 group cursor-pointer">
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">restaurant</span>
                <span className="font-label-sm uppercase tracking-tight text-center">Dining</span>
              </div>
              <div onClick={() => setActiveCategory('shows')} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-refined-offwhite hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-brand-teal/20 group cursor-pointer">
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">theater_comedy</span>
                <span className="font-label-sm uppercase tracking-tight text-center">Shows</span>
              </div>
              <div onClick={() => setActiveCategory('travel')} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-refined-offwhite hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-brand-teal/20 group cursor-pointer">
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">flight</span>
                <span className="font-label-sm uppercase tracking-tight text-center">Travel</span>
              </div>
              <div onClick={() => setActiveCategory('party')} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-refined-offwhite hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-brand-teal/20 group cursor-pointer">
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">celebration</span>
                <span className="font-label-sm uppercase tracking-tight text-center">Party</span>
              </div>
              <div onClick={() => setActiveCategory('spaces')} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-refined-offwhite hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-brand-teal/20 group cursor-pointer">
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">location_city</span>
                <span className="font-label-sm uppercase tracking-tight text-center">Spaces</span>
              </div>
              <div onClick={() => setActiveCategory('vendors')} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-refined-offwhite hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-brand-teal/20 group cursor-pointer">
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">storefront</span>
                <span className="font-label-sm uppercase tracking-tight text-center">Vendors</span>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by Category (Editorial Bento Grid) */}
        <section className="section-padding px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-container-max mx-auto space-y-12">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <span className="font-label-sm text-midnight-slate/40 uppercase tracking-widest">Collections</span>
                <h2 className="font-display-lg text-4xl md:text-5xl">Browse by Category</h2>
              </div>
              <button className="flex items-center gap-2 font-label-md uppercase tracking-wider text-midnight-slate group cursor-pointer">
                View All <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-[600px] md:h-[700px]">
              <div className="md:col-span-6 relative overflow-hidden rounded-xl group cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjb-pJOQ3uZYhNmQag3cySbwIW6Mbfwu0vbT-c30UfXrQ9dta7SSNSsJH9TG78wtMdzn0DGq4J0nrkdWBTCn8bhBQENapzB04WSUajoZ83-YtquXY3wMkTbiAV3e3OdvcEKEHhNR02-7LX0v75tb5wbnEeYqt_CXVh-gOQiEbBGl4Qyv6LtHL42l41H9z2OAmOhXQmcojKjSTjfm8gqQqdf7Na8Pg6XD82n8s-oy-jGIwhRsyDJG1UZYOPowcbQyYXK-a5_A6H9y4')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <span className="font-label-sm text-white/60 uppercase tracking-widest mb-2 block">Immersive</span>
                  <h3 className="font-headline-md text-4xl text-white">Eco-Luxury Retreats</h3>
                </div>
              </div>
              <div className="md:col-span-3 grid grid-rows-2 gap-gutter">
                <div className="relative overflow-hidden rounded-xl group cursor-pointer">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCeiYICa5W8nZtCVbCRDEDFfJu_e-LMX-IYjAHPbz5aHacJ520FzolDcLYHpORf2Ts9aPHBCjPDXoFDIDWNj3LysIbKOXhMYfmOUPsk9VMWYpYRGH2bFbrzh5pu8GOJEp2_DRBlcgOR0ck4LmJ6YUXm80vygHMd_kB63HIawLzJ11OYZ8PCHPTNns60fajOy-j286onoMVLE9WlcamnoZFlV4Gd69fcm4KRM-YkYdTloyWKRua1DdLIG5_G_zPUdv1Lrqv3EaDTNS8')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-headline-sm text-xl text-white">Gastronomy</h3>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl group cursor-pointer">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHQWu7MPuSSZ2z4mrHGCYkezMgdV7HCSmRBstzuweMtOiuMRUsfPurNy_QHiN8Pb7aLpbZQrm1Y48hOl4taWIlFlsalK0M7lrd1f3XILMyKSeB1s5hQkS9qEKi7NE_7Z9-TVJ8cM2-q9qS_8gEin6pliGItUcYY7QQlX9A4gaxH7JsSvKaXgQIYQApaSfI1iaOVCaGlaeWwlBFLOBpuTr0Y0IYbEMqiGKjNgX-JILDu6FCuhz39Ge02u6hFVqsi_d4pkSbyUIdwnM')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-headline-sm text-xl text-white">Private Travel</h3>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 relative overflow-hidden rounded-xl group cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUK9MhKm1j4xx0XtGSU5FQLzmEtiUv4qCSfxF6uUTUfc0lBsTpGHLvHnRn76Y1zezudSrMvijYBWdPqB81POjMVcVSZ7LsVV3--KBZy2tj0Qwp82P2rKmDGUa9ZlrKqVSH2-4XAK6Qxi6WvNm2glu1-d5IKNOGo4ejRRowaQlYj6wTHFn9-nSIASq92KOI2l_kzQmxs7OIgOCcRrGH36eth2dRR1Dfye3nsQ46ks0eU5iaPnbPNiGP67PuIB7Ap2d8erO_i14ZJgw')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="font-headline-md text-3xl text-white">Live Events</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended for You */}
        <section className="section-padding bg-white px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto space-y-12">
            <div className="space-y-2">
              <span className="font-label-sm text-midnight-slate/40 uppercase tracking-widest">Tailored Selection</span>
              <h2 className="font-display-lg text-4xl md:text-5xl">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Listing 1 */}
              <div className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-md">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDWjys0V6DL0AhBpNF5_YIsO0bSr1CVmdTOX8hVkG1NxOHr95JXOjIC19YpIO6bjs-PfFko_RAzc5IPniZEWgqoO4jUuDQiGwKXeHirfGwwq6bDXz5JhI6waSpu-pTZtd_LXsSBkR9DiaeEyyPxfcSt1QHOY6KL4HoC4ml8Njt4hhTksem1-RNtoLi74Hr8rjGWGxYiqlXvyxcDxQ3LIGbnzmb0dvUtBK06ZD-6AQTgosp2vXmQXgTl_1PZAHj0NXW3mjnB8PrbZvs')" }}></div>
                  <button className="absolute top-4 right-4 w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-midnight-slate">favorite</span>
                  </button>
                  <span className="absolute bottom-4 left-4 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm px-3 py-1 rounded">NEW</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline-sm text-xl mb-1">Alpine Sanctuary</h4>
                    <p className="text-sm text-midnight-slate/50">Swiss Alps, Switzerland</p>
                    <p className="mt-4 font-label-md">$450 <span className="text-midnight-slate/40 font-normal">/ night</span></p>
                  </div>
                  <button className="w-10 h-10 border border-midnight-slate/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all group/btn">
                    <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">north_east</span>
                  </button>
                </div>
              </div>

              {/* Listing 2 */}
              <div className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-md">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuByGX74w-Tf-ev2PEJFDFSCkdzUWTXlVer39ou6oHZUL3iEMdgIgWW4cE4t2rze4YCnRtlHSQr1wdZS5Firyt3tqVEHs_NsaBpnwFYNxeu2rPVe8UBtxO6hIiHFCwgNEUyzNNyIzEWwD75T6HYi9oxKFgWEIF7VrrUYSKsrNlcVeWk3C8xYpPnPrmVLdA8FQTTljivj5j7N2Wxeq8p2qTUvdkzlRbWbkWPZxXeZnIhGi4_3QAZSQNj8GEOKx4jYYCpFtV8PY2VZorE')" }}></div>
                  <button className="absolute top-4 right-4 w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-midnight-slate">favorite</span>
                  </button>
                  <span className="absolute bottom-4 left-4 bg-secondary-container text-on-secondary-container font-label-sm px-3 py-1 rounded">POPULAR</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline-sm text-xl mb-1">Desert Oasis Villa</h4>
                    <p className="text-sm text-midnight-slate/50">Joshua Tree, USA</p>
                    <p className="mt-4 font-label-md">$320 <span className="text-midnight-slate/40 font-normal">/ night</span></p>
                  </div>
                  <button className="w-10 h-10 border border-midnight-slate/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all group/btn">
                    <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">north_east</span>
                  </button>
                </div>
              </div>

              {/* Listing 3 */}
              <div className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-md">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjl4V_iM0uuay4DCM9-Kzz4m8PZUFrk0T6i8xF0EG_FzaIWVnKo7yhyVbw26mIoLxjzqIfuppzDU9GnRJzOQ7LR5B_QQ4tpED22DVkyHhwk0IM-8KPtjQy5xaFoARCJUnnGN_oU_8yD7xZIYVHESPd44TCnFz8alGCoR0GvtU4SmeL3uP-YY41VEobq7VatAWo4YJE7K2QBmfSKuPzO9ZNDDCTHakbbYGiY_Vc0dI6ar7fssW25QV3OWCJQdwy876aqHzfP3W-cbU')" }}></div>
                  <button className="absolute top-4 right-4 w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-midnight-slate">favorite</span>
                  </button>
                  <span className="absolute bottom-4 left-4 bg-primary-container text-on-primary-container font-label-sm px-3 py-1 rounded">FEATURED</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline-sm text-xl mb-1">Coastal Cave Tour</h4>
                    <p className="text-sm text-midnight-slate/50">Algarve, Portugal</p>
                    <p className="mt-4 font-label-md">$120 <span className="text-midnight-slate/40 font-normal">/ guest</span></p>
                  </div>
                  <button className="w-10 h-10 border border-midnight-slate/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all group/btn">
                    <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">north_east</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Surfaces */}
        <section className="section-padding bg-refined-offwhite px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="bg-white p-12 rounded-2xl space-y-6 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center text-white mb-8">
                <span className="material-symbols-outlined text-3xl">restaurant</span>
              </div>
              <h3 className="font-display-lg text-3xl">Food &amp; Drink</h3>
              <p className="font-body-md text-midnight-slate/60">From intimate dinners to large-scale catering, discover restaurants, private dining rooms, and culinary experiences for every occasion.</p>
              <Link href="/food-drink" className="inline-flex items-center gap-2 font-label-md uppercase tracking-widest text-primary border-b-2 border-primary/10 pb-1 group-hover:border-primary transition-all">Explore Dining <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
            </div>
            <div className="bg-white p-12 rounded-2xl space-y-6 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 rounded-2xl bg-midnight-slate flex items-center justify-center text-white mb-8">
                <span className="material-symbols-outlined text-3xl">celebration</span>
              </div>
              <h3 className="font-display-lg text-3xl">Party</h3>
              <p className="font-body-md text-midnight-slate/60">Bachelorette weekends, birthday celebrations, holiday parties — browse by occasion type and find everything you need in one place.</p>
              <Link href="/party" className="inline-flex items-center gap-2 font-label-md uppercase tracking-widest text-primary border-b-2 border-primary/10 pb-1 group-hover:border-primary transition-all">Browse Occasions <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
            </div>
            <div className="bg-white p-12 rounded-2xl space-y-6 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 rounded-2xl bg-brand-teal flex items-center justify-center text-white mb-8">
                <span className="material-symbols-outlined text-3xl">explore</span>
              </div>
              <h3 className="font-display-lg text-3xl">Things to Do</h3>
              <p className="font-body-md text-midnight-slate/60">Local activities, attractions, and experiences. Art shows, climbing walls, happy hours, boats, water activities — what's happening near you.</p>
              <Link href="/things-to-do" className="inline-flex items-center gap-2 font-label-md uppercase tracking-widest text-primary border-b-2 border-primary/10 pb-1 group-hover:border-primary transition-all">Explore Activities <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
            </div>
          </div>
        </section>

        {/* Group Collaboration Teaser */}
        <section className="section-padding bg-white overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 space-y-8">
              <span className="font-label-sm text-brand-teal uppercase tracking-[0.2em]">Group Planning</span>
              <h2 className="font-display-lg text-5xl">Collaborative <br /> <span className="italic font-normal serif">Itineraries</span></h2>
              <p className="font-body-lg text-midnight-slate/60">Stop juggling spreadsheets and group chats. Planviry allows groups to co-curate schedules, split costs transparently, and maintain a shared timeline for everyone involved.</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-midnight-slate font-label-md">
                  <span className="material-symbols-outlined text-brand-teal" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Shared Voting on Venues
                </li>
                <li className="flex items-center gap-4 text-midnight-slate font-label-md">
                  <span className="material-symbols-outlined text-brand-teal" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Automated Cost Splitting
                </li>
                <li className="flex items-center gap-4 text-midnight-slate font-label-md">
                  <span className="material-symbols-outlined text-brand-teal" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Real-time Itinerary Sync
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 relative">
              <div className="w-full aspect-square bg-gradient-to-br from-refined-offwhite to-white rounded-full flex items-center justify-center relative p-8 md:p-16">
                <div className="absolute inset-0 bg-brand-teal/5 blur-[80px] rounded-full scale-75"></div>
                <div className="w-full bg-white shadow-2xl rounded-2xl border border-surface-variant p-6 space-y-6 relative">
                  <div className="flex items-center justify-between border-b border-surface-variant pb-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined">schedule</span>
                      <span className="font-label-md">Group Timeline</span>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-3 bg-surface rounded-xl">
                      <div className="bg-white p-2 rounded-lg text-xs font-bold shadow-sm">12:00</div>
                      <div>
                        <p className="font-label-md">Private Wine Tasting</p>
                        <p className="text-[10px] text-midnight-slate/40 uppercase">Napa Valley Estates</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 bg-primary-container text-white rounded-xl shadow-lg translate-x-4">
                      <div className="bg-white/10 p-2 rounded-lg text-xs font-bold">19:30</div>
                      <div>
                        <p className="font-label-md">Rooftop Soirée</p>
                        <p className="text-[10px] text-white/50 uppercase">Intercontinental Penthouse</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 bg-surface rounded-xl">
                      <div className="bg-white p-2 rounded-lg text-xs font-bold shadow-sm">22:00</div>
                      <div>
                        <p className="font-label-md">Late Night Jazz</p>
                        <p className="text-[10px] text-midnight-slate/40 uppercase">Blue Note Session</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Grid (Bento Style) */}
        <section className="py-20 px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-container-max mx-auto space-y-12">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <span className="font-label-sm text-midnight-slate/40 uppercase tracking-widest">Discover Genres</span>
                <h2 className="font-display-lg text-4xl md:text-5xl">Live Shows</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 h-[600px]">
              <div className="md:col-span-2 lg:col-span-2 row-span-2 relative rounded-xl overflow-hidden group bg-primary-container">
                <img className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Opera house interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZEugkKp9GbZS3TqouhaAHmoKwXjZ0f1q3XnLGTKFiHJbflgxkVVc1i94TndH_1FBKrBvZV2OLsHj9JmeX_Emd8XDzh0HDghoiVyesCL0GALsRrEv4nUuFD2EC3XfzbA75u2MbjthEjQ6XWRL8dIpFfApShcl2evuz0losq0xIKFykMr9ZJYAyrqQMyyxIP65RBl6tOUX_tpsXWMSXbd2no90uCQGw_R8vFhCrTnK-7EH6A5w_7R29553uzYhgTbZYdFXi0BDPV9g" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h4 className="font-display-lg text-3xl text-white mb-2">Opera & Theatre</h4>
                  <p className="font-body-md text-white/80">Classical grandeur and stagecraft.</p>
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-3 bg-secondary-container rounded-xl p-8 flex flex-col justify-between group cursor-pointer">
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-4xl text-on-secondary-container">album</span>
                  <span className="font-label-caps text-label-caps text-on-secondary-container">24 Events Today</span>
                </div>
                <div>
                  <h4 className="font-display-lg text-3xl text-primary mb-2">Indie & Jazz</h4>
                  <button className="bg-primary text-on-primary font-utility-sm px-6 py-2 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Browse Lenses</button>
                </div>
              </div>
              <div className="lg:col-span-1 bg-tertiary-fixed rounded-xl p-6 flex flex-col items-center justify-center text-center group">
                <span className="material-symbols-outlined text-5xl mb-4 text-on-tertiary-fixed-variant group-hover:rotate-12 transition-transform">star</span>
                <h4 className="font-headline-md text-on-tertiary-fixed">VIP Access</h4>
              </div>
              <div className="md:col-span-2 lg:col-span-1 bg-[#FFD60A] rounded-xl p-6 flex flex-col justify-between">
                <span className="font-label-caps text-label-caps text-black">New</span>
                <h4 className="font-headline-md text-black">Festivals</h4>
              </div>
              <div className="md:col-span-2 lg:col-span-3 relative rounded-xl overflow-hidden group">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Music festival night" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk-vM_ZtZPoN-LTbmHAIXO8JQpi5Ibvz6sjN1Vp7aAiMpNa8SOO_2-XyRFyW8jcny8_Q5sch-Bks4qGZibKN7c7gYpWBTpns9REWQZkd6U7fc5RYllVWsSYN7sqifw6MGZL2gNY_8PeqqF7XC5c2yOUR2LG5v0wV6cG0piJ1VbHWAH7MA_5zTxR2frZfAL0N_-BOpArinuUCfHFiuTmI7TaxAg_wjm0IKk-9z72eoDp4aO47QGyq9z4a7iaEyHrUFvGxOrJnKfhNM" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h4 className="font-display-lg text-3xl text-white">Rock & Pop</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Modules Expansion */}
        <section className="py-20 px-margin-mobile md:px-margin-desktop bg-refined-offwhite space-y-20">
          <div className="max-w-container-max mx-auto space-y-20">
            {/* Travel & Lodging */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Luxury boutique hotel interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmUqoGbBbWbRtYb8M0iA3xPrRO3hKOHRFNf3ds201y1sgT8hxTeqK3bndfyMQUoVCvHUT58JvMkiJKwuTPvSOIPJtHHHJnxnZ6Pwi3NahOVfG1yhzKYx9d5T-Zv0hS__JTRc3mQuliI0jNnOL-soWh1Da-fNseJG9s1pwwWOcemv7Uxc8YJStJnqt0-mjonhHK1Akpo7WU4NRWRpzAfTVxoOw9CxGV87Z0sxnzbRJHS2RMfwYaTHTVpbrzSssY6DXSvGJMzdSnV7o" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
              </div>
              <div className="lg:pl-8 space-y-6">
                <span className="font-label-caps text-label-caps text-on-secondary-container block">Refined Journeys</span>
                <h3 className="font-display-lg text-4xl md:text-5xl text-primary leading-none">TRAVEL & LODGING</h3>
                <p className="font-body-lg text-midnight-slate/70 leading-relaxed">
                  Plan your stay with our portfolio of architectural landmarks and boutique hideaways. Planviry provides enterprise-grade logistics and white-glove concierge services for the discerning traveler.
                </p>
                <button className="font-label-caps text-label-caps border-b-2 border-primary pb-1 hover:text-on-secondary-container hover:border-on-secondary-container transition-all">Explore Destinations</button>
              </div>
            </div>

            {/* Events & Spaces */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Modern minimalist event space" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZEugkKp9GbZS3TqouhaAHmoKwXjZ0f1q3XnLGTKFiHJbflgxkVVc1i94TndH_1FBKrBvZV2OLsHj9JmeX_Emd8XDzh0HDghoiVyesCL0GALsRrEv4nUuFD2EC3XfzbA75u2MbjthEjQ6XWRL8dIpFfApShcl2evuz0losq0xIKFykMr9ZJYAyrqQMyyxIP65RBl6tOUX_tpsXWMSXbd2no90uCQGw_R8vFhCrTnK-7EH6A5w_7R29553uzYhgTbZYdFXi0BDPV9g" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent"></div>
              </div>
              <div className="lg:pr-8 text-right space-y-6">
                <span className="font-label-caps text-label-caps text-on-secondary-container block">Architectural Venues</span>
                <h3 className="font-display-lg text-4xl md:text-5xl text-primary leading-none">EVENTS & SPACES</h3>
                <p className="font-body-lg text-midnight-slate/70 leading-relaxed">
                  Access a curated collection of the world's most evocative venues. From brutalist industrial lofts to neoclassical ballrooms, find the perfect canvas for your next major production or intimate gathering.
                </p>
                <button className="font-label-caps text-label-caps border-b-2 border-primary pb-1 hover:text-on-secondary-container hover:border-on-secondary-container transition-all ml-auto">Browse Portfolio</button>
              </div>
            </div>

            {/* Bespoke Occasions */}
            <div className="bg-secondary-container rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center overflow-hidden relative">
              <div className="lg:col-span-7 z-10 space-y-6">
                <span className="font-label-caps text-label-caps text-primary block">Tailored Excellence</span>
                <h3 className="font-display-lg text-4xl md:text-5xl text-primary leading-none">BESPOKE OCCASIONS</h3>
                <p className="font-body-lg text-midnight-slate/70 leading-relaxed">
                  Let Planviry design your most significant milestones. Our team of specialist producers handles every nuance, ensuring your high-stakes events are executed with unparalleled precision and artistry.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-utility-sm uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer">Request Consultation</button>
                  <button className="border border-primary text-primary px-8 py-4 rounded-full font-utility-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all cursor-pointer">View Case Studies</button>
                </div>
              </div>
              <div className="lg:col-span-5 relative z-10 h-[400px]">
                <img className="w-full h-full object-cover rounded-2xl shadow-2xl rotate-3" alt="Luxury table setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnV7PcQ6ayQ06IzXcm86-bhybQe48sy-xln-72NxJlP4datNqg5LagkvbFOBkIf_OHM0oFzfZIbwEwAyt800V7pd2hRGpG8fp9Dnbw_Cj6fjPmCsv5ewr0VvhoBPTgYtPh2VnSIhE8ft2YoHVf2HQbzZyk89ANiS4ORi0wVW-t6AQnRoPlpeTqbXLTHU8ETatFPtkMuy9yq6aJdVN18EmOnEaS_Ilj3L5dQQL7o4pjimQOeYWGqKJM_E7SuNjND33HWkJjUqYgwKg" referrerPolicy="no-referrer" />
              </div>
              {/* Abstract Accent */}
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Active Lens Listings */}
        <section className="py-20 px-margin-mobile md:px-margin-desktop bg-white">
          <div className="max-w-container-max mx-auto space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <span className="font-label-caps text-label-caps text-on-secondary-container mb-2 block">Current Selection</span>
                <h3 className="font-display-lg text-4xl md:text-5xl text-primary">Live Shows Near You</h3>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-2 rounded-full bg-surface-container-high font-label-caps text-label-caps text-on-surface">Filter</button>
                <button className="px-6 py-2 rounded-full bg-surface-container-high font-label-caps text-label-caps text-on-surface">Sort by Date</button>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="group relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden editorial-shadow hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="aspect-[4/5] relative overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Soul singer in jazz club" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnV7PcQ6ayQ06IzXcm86-bhybQe48sy-xln-72NxJlP4datNqg5LagkvbFOBkIf_OHM0oFzfZIbwEwAyt800V7pd2hRGpG8fp9Dnbw_Cj6fjPmCsv5ewr0VvhoBPTgYtPh2VnSIhE8ft2YoHVf2HQbzZyk89ANiS4ORi0wVW-t6AQnRoPlpeTqbXLTHU8ETatFPtkMuy9yq6aJdVN18EmOnEaS_Ilj3L5dQQL7o4pjimQOeYWGqKJM_E7SuNjND33HWkJjUqYgwKg" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 glass-card rounded-full text-white font-label-caps text-[10px]">SOUL</span>
                    <span className="px-3 py-1 glass-card rounded-full text-white font-label-caps text-[10px]">SELLING FAST</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-widest text-xs">Oct 24 • 8:00 PM</p>
                        <h4 className="font-display-lg text-2xl text-primary leading-tight">Neon Nights: Maya &amp; The Loop</h4>
                      </div>
                      <span className="text-2xl font-display-lg text-primary">$85</span>
                    </div>
                    <div className="flex items-center gap-2 mb-6 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span className="font-body-md">The Velvet Room, NYC</span>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-primary text-white rounded-full font-body-md hover:bg-midnight-slate transition-colors flex justify-center items-center gap-3 cursor-pointer">
                    Add to Occasion
                    <span className="material-symbols-outlined text-lg">celebration</span>
                  </button>
                </div>
              </div>
              {/* Card 2 */}
              <div className="group relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden editorial-shadow hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="aspect-[4/5] relative overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="DJ deck and dance floor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsbE_ib8QncazSi79AEbsJwhs8LKdazRgFGnwNQXkcLl4qbjwjHFkxvRUgstlOFamBLPmU0MvrFTDYm3Cihyg6bDLXC5nBsuStuL2PhIXlisQVPek26JCDztaBDkMAd9UV_rZyQcv2TnRxvseaktabMSX6XKX86qCrihbEYy-Yo54ZqHcGKEgsNgoRxv_TwOgjhXp0VVV9JQCRv3HBk5hC-_VfltGCTg2-CXB_gm6Fo1Z0tM40XYJ4_ZTU6oMMU6ggtezA-YL1q-k" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 glass-card rounded-full text-white font-label-caps text-[10px]">ELECTRONIC</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-widest text-xs">Oct 26 • 11:00 PM</p>
                        <h4 className="font-display-lg text-2xl text-primary leading-tight">Warehouse 42: Synthesize</h4>
                      </div>
                      <span className="text-2xl font-display-lg text-primary">$45</span>
                    </div>
                    <div className="flex items-center gap-2 mb-6 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span className="font-body-md">Brooklyn Navy Yard</span>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-primary text-white rounded-full font-body-md hover:bg-midnight-slate transition-colors flex justify-center items-center gap-3 cursor-pointer">
                    Add to Occasion
                    <span className="material-symbols-outlined text-lg">celebration</span>
                  </button>
                </div>
              </div>
              {/* Card 3 */}
              <div className="group relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden editorial-shadow hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="aspect-[4/5] relative overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Symphony orchestra" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmUqoGbBbWbRtYb8M0iA3xPrRO3hKOHRFNf3ds201y1sgT8hxTeqK3bndfyMQUoVCvHUT58JvMkiJKwuTPvSOIPJtHHHJnxnZ6Pwi3NahOVfG1yhzKYx9d5T-Zv0hS__JTRc3mQuliI0jNnOL-soWh1Da-fNseJG9s1pwwWOcemv7Uxc8YJStJnqt0-mjonhHK1Akpo7WU4NRWRpzAfTVxoOw9CxGV87Z0sxnzbRJHS2RMfwYaTHTVpbrzSssY6DXSvGJMzdSnV7o" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 glass-card rounded-full text-white font-label-caps text-[10px]">CLASSICAL</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-widest text-xs">Oct 28 • 7:00 PM</p>
                        <h4 className="font-display-lg text-2xl text-primary leading-tight">London Philharmonia</h4>
                      </div>
                      <span className="text-2xl font-display-lg text-primary">$120</span>
                    </div>
                    <div className="flex items-center gap-2 mb-6 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span className="font-body-md">Royal Festival Hall</span>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-primary text-white rounded-full font-body-md hover:bg-midnight-slate transition-colors flex justify-center items-center gap-3 cursor-pointer">
                    Add to Occasion
                    <span className="material-symbols-outlined text-lg">celebration</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section (Stay Inspired) */}
        <section className="section-padding bg-refined-offwhite px-margin-mobile md:px-margin-desktop mb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-container to-midnight-slate rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#C5A059 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
            <div className="relative z-10 space-y-8">
              <h2 className="font-display-lg text-4xl md:text-6xl text-white">Stay Inspired</h2>
              <p className="font-body-lg text-white/60 max-w-xl mx-auto">Join our exclusive concierge list for weekly curated experiences and travel insights tailored for planning the perfect occasion.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center gap-4 max-w-lg mx-auto bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10">
                <input className="w-full bg-transparent border-none text-white focus:ring-0 px-6 py-4 font-body-md placeholder:text-white/30 outline-none" placeholder="Your email address" required type="email" />
                <button className="w-full md:w-auto px-10 py-4 bg-white text-midnight-slate font-label-md uppercase tracking-widest rounded-full hover:bg-brand-teal hover:text-white transition-all shadow-lg active:scale-95 cursor-pointer" type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
