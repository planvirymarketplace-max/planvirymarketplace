'use client'

import React, { useState } from 'react';
import {
  Share2,
  Calendar,
  MapPin,
  AlertTriangle,
  QrCode,
  Map,
  FileText,
  CheckCircle,
  Plus,
  Compass,
  Briefcase,
  Utensils,
} from 'lucide-react';
import { ItineraryEvent } from '@/lib/prototype-types';
import { IMAGES } from '@/data/prototype-data';

interface ItineraryViewProps {
  onNavigate: (screen: string) => void;
  itineraryEvents: ItineraryEvent[];
  onAddEvent: (event: ItineraryEvent) => void;
}

export default function ItineraryView({
  onNavigate,
  itineraryEvents,
}: ItineraryViewProps) {
  const [events, setEvents] = useState<ItineraryEvent[]>(itineraryEvents);
  const [isConflictResolved, setIsConflictResolved] = useState(false);

  // Simple conflict resolution mechanic
  const handleResolveConflict = () => {
    setIsConflictResolved(true);
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === 'itin-4') {
          return {
            ...evt,
            hasConflict: false,
            time: '9:00 PM',
            conflictMessage: undefined,
          };
        }
        return evt;
      })
    );
    alert("Conflict resolved! Moved 'Indigo Girls Concert' to 9:00 PM to avoid overlapping with Evening Cocktails.");
  };

  const handleShare = () => {
    alert("Group itinerary invite link copied to clipboard!\nYour friends can now view live timeline updates.");
  };

  const handleEditParty = (id: string) => {
    const size = prompt("Enter new party size:", "6");
    if (size) {
      setEvents((prev) =>
        prev.map((evt) => (evt.id === id ? { ...evt, duration: `Party of ${size}` } : evt))
      );
    }
  };

  return (
    <div id="itinerary-page" className="min-h-screen bg-background text-on-background pb-xl pl-16 md:pl-20">
      {/* 1. Header Navigation */}
      <header className="border-b border-outline-variant bg-surface-container-lowest py-sm px-sm md:px-md flex items-center justify-between">
        <div className="flex items-center gap-md">
          <span className="font-serif font-bold text-2xl tracking-tight text-primary cursor-pointer" onClick={() => onNavigate('landing')}>
            Planviry
          </span>
          <nav className="hidden md:flex items-center gap-md">
            <button onClick={() => { onNavigate('feed'); }} className="text-utility-sm text-primary border-b-2 border-primary pb-1 font-semibold">
              Plan
            </button>
            <button onClick={() => { onNavigate('feed'); }} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Services
            </button>
            <button onClick={() => onNavigate('discover')} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Things to Do
            </button>
            <button onClick={() => { onNavigate('feed'); }} className="text-utility-sm text-on-surface-variant hover:text-primary transition-colors">
              Food & Drink
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-sm">
          {/* Cart Icon */}
          <button onClick={() => onNavigate('cart')} className="relative p-2 text-on-surface-variant hover:text-primary transition-all">
            <span className="text-lg">🛒</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold cursor-pointer">
            JD
          </div>
        </div>
      </header>

      {/* 2. Page Title Block with Avatars & Share */}
      <section className="px-sm md:px-md py-sm max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-sm">
        <div>
          <h1 className="text-headline-lg text-primary">
            Weekend Gala Itinerary
          </h1>
          <div className="flex flex-wrap items-center gap-sm text-xs text-on-surface-variant mt-2 font-mono">
            <span className="flex items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-outline" />
              <span>Oct 18 - Oct 20, 2024</span>
            </span>
            <span className="flex items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-outline" />
              <span>Savannah, GA</span>
            </span>

            {/* Avatar group */}
            <div className="flex items-center gap-xs ml-2">
              <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container border border-surface-container-lowest flex items-center justify-center text-[10px] font-bold">JD</div>
                <div className="w-6 h-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed border border-surface-container-lowest flex items-center justify-center text-[10px] font-bold">SM</div>
                <div className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed border border-surface-container-lowest flex items-center justify-center text-[10px] font-bold">TL</div>
              </div>
              <span className="text-[10px] font-semibold text-outline bg-surface-container-low px-2 py-0.5 rounded-full">+2 others</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-xs px-md py-3 bg-primary hover:opacity-90 text-on-primary text-utility-sm font-semibold rounded-md transition-all shadow-md self-start md:self-auto"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Itinerary</span>
        </button>
      </section>

      {/* 3. Columns Layout */}
      <section className="px-sm md:px-md max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Side (3 cols): Small Navigation Column / Category browser */}
        <div className="lg:col-span-3 flex flex-col gap-sm bg-surface-container-lowest p-sm rounded-xl border border-outline-variant/40 shadow-sm">
          <div>
            <h4 className="text-label-caps text-secondary mb-xs">What's your plan?</h4>
            <span className="text-[10px] text-outline font-sans block mb-sm">Browse categories</span>
            <div className="flex flex-col gap-1">
              <button onClick={() => onNavigate('feed')} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-utility-sm font-semibold text-on-primary bg-primary">
                <Calendar className="w-3.5 h-3.5" />
                <span>Plan Timeline</span>
              </button>
              <button onClick={() => onNavigate('feed')} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-utility-sm font-semibold text-on-surface-variant hover:bg-surface-container-low hover:text-primary">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Services</span>
              </button>
              <button onClick={() => onNavigate('discover')} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-utility-sm font-semibold text-on-surface-variant hover:bg-surface-container-low hover:text-primary">
                <Compass className="w-3.5 h-3.5" />
                <span>Things to Do</span>
              </button>
              <button onClick={() => onNavigate('feed')} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-utility-sm font-semibold text-on-surface-variant hover:bg-surface-container-low hover:text-primary">
                <Utensils className="w-3.5 h-3.5" />
                <span>Food & Drink</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side (9 cols): Timeline display */}
        <div className="lg:col-span-9 flex flex-col gap-lg pl-sm border-l border-outline-variant/40 ml-sm relative">
          {/* Timeline Connector Graphic Block */}
          <div className="absolute top-0 bottom-0 left-[-1px] w-0.5 bg-outline-variant/30" />

          {/* SECTION A: Friday, Arrival & Check-in */}
          <div>
            <div className="flex items-center gap-xs mb-sm relative">
              <div className="absolute left-[-12px] w-3 h-3 rounded-full bg-primary border-2 border-surface-container-lowest" />
              <h2 className="text-headline-md text-primary">Arrival & Check-in</h2>
            </div>

            {/* Event List for Arrival */}
            <div className="flex flex-col gap-sm">
              {/* Event 1: Hotel Check-in */}
              {events.slice(0, 1).map((evt) => (
                <div key={evt.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-sm shadow-sm grid grid-cols-1 md:grid-cols-12 gap-sm items-center">
                  <div className="md:col-span-4 h-28 rounded-md overflow-hidden">
                    <img
                      src={evt.image || IMAGES.perryLaneHotel}
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-8 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold text-secondary">{evt.time}</span>
                        <span className="text-[10px] font-mono bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {evt.status}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-primary">{evt.title}</h3>
                      <p className="text-xs text-outline font-mono mt-1">🏢 {evt.location}</p>
                    </div>

                    <div className="flex items-center gap-xs pt-xs border-t border-outline-variant/30 mt-xs text-[11px] text-on-surface-variant font-mono font-semibold">
                      <button className="flex items-center gap-1 hover:text-primary hover:underline">
                        <Map className="w-3.5 h-3.5" />
                        <span>View Map</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary hover:underline ml-xs">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Booking Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Event 2: Dinner Reservation */}
              {events.slice(1, 2).map((evt) => (
                <div key={evt.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-sm shadow-sm flex items-center justify-between group">
                  <div className="flex items-start gap-sm">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold font-mono text-sm shrink-0">
                      🍽️
                    </div>
                    <div>
                      <span className="text-xs font-mono text-outline block">{evt.time}</span>
                      <h3 className="font-serif text-lg font-bold text-primary mt-0.5">{evt.title}</h3>
                      <p className="text-xs text-on-surface-variant font-mono mt-1">📍 {evt.location}</p>
                      <p className="text-xs font-semibold text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded inline-block mt-2 font-mono">
                        👤 {evt.duration || 'Party of 6'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEditParty(evt.id)}
                    className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container-low transition-all cursor-pointer"
                    title="Edit Party Details"
                  >
                    <span>✏️</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B: Saturday, Exploration & Entertainment */}
          <div>
            <div className="flex items-center gap-xs mb-sm relative">
              <div className="absolute left-[-16px] w-5 h-5 rounded-full bg-tertiary-fixed border-2 border-surface-container-lowest flex items-center justify-center text-[9px] font-mono font-bold text-on-tertiary-fixed">
                SAT
              </div>
              <h2 className="text-headline-md text-primary">Exploration & Entertainment</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-sm items-start">
              {/* Event 3: Historic District Tour (Left-hand column - 5 cols) */}
              {events.slice(2, 3).map((evt) => (
                <div key={evt.id} className="lg:col-span-5 bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden shadow-sm flex flex-col justify-between h-[360px] group hover:shadow-md transition-all">
                  <div className="h-44 relative overflow-hidden">
                    <img
                      src={evt.image || IMAGES.savannahTour}
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-4 left-4 text-white text-xs font-mono font-bold">
                      {evt.time}
                    </span>
                  </div>

                  <div className="p-sm flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-primary">{evt.title}</h3>
                      <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed">
                        Walking tour covering 12 historic squares and the riverfront.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-xs border-t border-outline-variant/30 mt-xs">
                      <span className="text-[10px] font-mono text-outline">{evt.duration || '2.5 Hours'}</span>
                      <span className="text-secondary flex items-center gap-1 text-[11px] font-mono font-bold">
                        <CheckCircle className="w-3.5 h-3.5 fill-secondary-container text-on-secondary-container" />
                        <span>Confirmed</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Event 4: Indigo Girls Concert (Right-hand column - 7 cols) with dynamic Conflict Resolution */}
              {events.slice(3, 4).map((evt) => (
                <div
                  key={evt.id}
                  className={`lg:col-span-7 bg-surface-container-lowest rounded-xl border overflow-hidden shadow-sm transition-all duration-500 ${
                    evt.hasConflict
                      ? 'border-error bg-error-container/10'
                      : 'border-secondary-container bg-secondary-container/5'
                  }`}
                >
                  {/* Conflict Alert Banner */}
                  {evt.hasConflict && (
                    <div className="bg-error-container border-b border-error py-3 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-xs text-xs font-semibold text-on-error-container leading-normal">
                        <AlertTriangle className="w-4 h-4 text-error shrink-0" />
                        <span>{evt.conflictMessage}</span>
                      </div>
                      <button
                        onClick={handleResolveConflict}
                        className="px-3 py-1 bg-error hover:opacity-90 text-on-error text-[10px] font-mono font-bold tracking-wider rounded uppercase shrink-0 transition-colors cursor-pointer"
                      >
                        Resolve Overlap
                      </button>
                    </div>
                  )}

                  {!evt.hasConflict && isConflictResolved && (
                    <div className="bg-secondary-container/30 border-b border-primary/20 py-3 px-4 flex items-center gap-2 text-xs font-semibold text-on-secondary-container">
                      <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                      <span>Overlap resolved! Time shifted safely.</span>
                    </div>
                  )}

                  {/* Concert body info */}
                  <div className="p-sm grid grid-cols-1 md:grid-cols-12 gap-sm items-center">
                    <div className="md:col-span-8">
                      <div className="flex items-center gap-xs mb-1">
                        <span className={`text-xs font-mono font-bold ${evt.hasConflict ? 'text-error' : 'text-secondary'}`}>
                          {evt.time}
                        </span>
                        <span className="text-[10px] font-mono text-outline bg-surface-container px-2 py-0.5 rounded uppercase">Concert</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-primary mb-1">{evt.title}</h3>
                      <p className="text-xs text-outline font-mono">📍 {evt.location}</p>

                      {/* Scanner tool */}
                      <div className="bg-surface-container border border-dashed border-outline-variant/40 rounded-xl p-3 flex items-center justify-between gap-2 mt-sm">
                        <div className="flex items-center gap-xs">
                          <QrCode className="w-8 h-8 text-primary shrink-0" />
                          <div>
                            <p className="font-semibold text-xs text-primary">Scan QR at Entry</p>
                            <p className="text-[10px] text-outline font-mono">Ticket ID: PLN-94819</p>
                          </div>
                        </div>
                        <button
                          onClick={() => alert("Simulating Apple/Google Wallet Ticket pass download...")}
                          className="px-3 py-1.5 bg-primary hover:opacity-90 text-on-primary text-[10px] font-semibold rounded transition-colors font-mono uppercase"
                        >
                          Open Ticket
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-4 h-36 rounded-md overflow-hidden relative">
                      <img
                        src={evt.image || IMAGES.indigoGirlsStage}
                        alt="Stage"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add custom event timeline item */}
          <div className="flex justify-center mt-xs">
            <button
              onClick={() => {
                const title = prompt("Enter event title (e.g. Cocktail Hour):");
                const time = prompt("Enter time (e.g. 6:00 PM):");
                if (title && time) {
                  const newEvt: ItineraryEvent = {
                    id: `itin-${Date.now()}`,
                    title,
                    time,
                    date: 'Saturday, Oct 19',
                    type: 'Custom',
                    location: 'Savannah Downtown',
                    status: 'Confirmed'
                  };
                  setEvents([...events, newEvt]);
                  alert(`Successfully added "${title}" to your Saturday plan!`);
                }
              }}
              className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low text-on-surface-variant hover:text-primary text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Event</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
