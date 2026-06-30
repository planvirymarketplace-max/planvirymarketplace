'use client'

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  MapPin,
  MessageSquare,
  AlertTriangle,
  X,
  Send
} from 'lucide-react';

export const ItineraryPage: React.FC = () => {
  const {
    itinerary,
    setItinerary,
    collaborators,
    isChatOpen,
    setIsCartChatOpen,
    chatMessages,
    chatInput,
    setChatInput,
    handleSendChatMessage,
    activities,
    setShowShareModal,
    setActiveCategory
  } = useApp();

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 md:px-margin-desktop py-12 flex flex-col lg:flex-row gap-gutter relative">
      
      {/* Main Itinerary Timeline Area */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-champagne-gold uppercase">CONCIERGE ORCHESTRATION</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-midnight-slate mt-1">Weekend Gala Itinerary</h1>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="flex items-center gap-1.5 text-on-surface-variant text-body-sm bg-white border border-outline-variant/40 px-4 py-1.5 rounded-full">
                <Calendar className="w-4 h-4 text-outline" />
                Oct 18 - Oct 20, 2026
              </span>
              <span className="flex items-center gap-1 text-on-surface-variant text-body-sm bg-white border border-outline-variant/40 px-4 py-1 rounded-full">
                <MapPin className="w-4 h-4 text-outline" />
                Savannah, GA
              </span>
            </div>
          </div>

          {/* Sharing and Active Viewing Counter */}
          <div className="flex flex-col gap-3 items-start md:items-end">
            <div className="flex -space-x-3 overflow-hidden items-center">
              {collaborators.slice(0, 3).map((col) => (
                <div key={col.id} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden" title={col.name}>
                  <img alt={col.name} className="w-full h-full object-cover" src={col.avatar} />
                </div>
              ))}
              {collaborators.length > 3 && (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant">
                  +{collaborators.length - 3}
                </div>
              )}
              <div className="flex items-center ml-4 gap-1.5">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-on-surface-variant">2 others actively editing</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="bg-primary text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-neutral-800 transition-transform active:scale-95 text-xs uppercase tracking-widest shadow-md"
              >
                Collaborate
              </button>
              <button
                onClick={() => setIsCartChatOpen(!isChatOpen)}
                className="bg-white border border-primary text-primary font-bold px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-neutral-50 transition-transform active:scale-95 text-xs uppercase tracking-widest"
              >
                <MessageSquare className="w-4 h-4" />
                {isChatOpen ? "Hide Chat" : "Discussion"}
              </button>
            </div>
          </div>
        </div>

        {/* Bento Grid Timeline */}
        <div className="space-y-12 relative pl-4 md:pl-10">
          {/* Timeline Axis Line */}
          <div className="absolute left-[19px] md:left-[35px] top-6 bottom-6 w-1 bg-midnight-slate/10 rounded-full" />

          {/* Day 1: Friday */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center z-10 border-4 border-refined-offwhite shadow-sm font-bold text-xs">
                FRI
              </div>
              <h3 className="font-serif text-2xl text-primary font-bold">Arrival &amp; Grand Welcomes</h3>
            </div>

            {/* Friday Itinerary Events */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter pl-4">
              {itinerary.filter(e => e.date === 'Friday').map((event) => (
                <div key={event.id} className="md:col-span-6 lg:col-span-6 group bg-white rounded-xl overflow-hidden border border-outline-variant/30 hover:shadow-lg transition-all duration-300">
                  <div className="h-44 relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-white font-mono text-xs font-bold tracking-widest">{event.time}</span>
                    <span className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100">
                      {event.status}
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-bold text-champagne-gold uppercase tracking-widest">{event.category.toUpperCase()}</span>
                    <h4 className="font-serif text-xl font-bold mt-1 text-primary">{event.title}</h4>
                    <p className="text-on-surface-variant text-xs mt-1">📍 {event.location}</p>
                    <p className="text-midnight-slate/60 text-xs mt-3 leading-relaxed">{event.description}</p>
                    <div className="mt-4 pt-4 border-t border-outline-variant/20 flex justify-between items-center text-xs">
                      <span className="font-semibold text-primary">Budget portion: ${event.price}</span>
                      <button
                        onClick={() => {
                          setItinerary((prev) => prev.filter((e) => e.id !== event.id));
                        }}
                        className="text-red-500 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Day 2: Saturday */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center z-10 border-4 border-refined-offwhite shadow-sm font-bold text-xs">
                SAT
              </div>
              <h3 className="font-serif text-2xl text-primary font-bold">Exploration &amp; Elite Performances</h3>
            </div>

            {/* Conflict Warning Banner Simulation */}
            <div className="bg-orange-50 text-orange-800 px-4 py-3 rounded-xl border border-orange-200 flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Conflict Warning: Overlaps Detected</h4>
                <p className="text-xs opacity-90 mt-0.5">Your Saturday night Indigo Girls Concert (8:00 PM) overlaps with your potential Savannah Late Cocktail Drinks.</p>
              </div>
            </div>

            {/* Saturday Itinerary Events */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter pl-4">
              {itinerary.filter(e => e.date === 'Saturday').map((event) => (
                <div key={event.id} className="md:col-span-6 lg:col-span-6 group bg-white rounded-xl overflow-hidden border border-outline-variant/30 hover:shadow-lg transition-all duration-300">
                  <div className="h-44 relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-white font-mono text-xs font-bold tracking-widest">{event.time}</span>
                    <span className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100">
                      {event.status}
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-bold text-champagne-gold uppercase tracking-widest">{event.category.toUpperCase()}</span>
                    <h4 className="font-serif text-xl font-bold mt-1 text-primary">{event.title}</h4>
                    <p className="text-on-surface-variant text-xs mt-1">📍 {event.location}</p>
                    <p className="text-midnight-slate/60 text-xs mt-3 leading-relaxed">{event.description}</p>
                    
                    {event.ticketDetails && (
                      <div className="mt-4 p-3 bg-surface-container-low rounded-lg border border-dashed border-outline-variant/50">
                        <p className="text-[10px] font-bold text-primary uppercase">Tickets &amp; Passes</p>
                        <p className="text-xs text-on-surface-variant mt-1 font-semibold">{event.ticketDetails}</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-outline-variant/20 flex justify-between items-center text-xs">
                      <span className="font-semibold text-primary">Budget portion: ${event.price}</span>
                      <button
                        onClick={() => {
                          setItinerary((prev) => prev.filter((e) => e.id !== event.id));
                        }}
                        className="text-red-500 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Quick Add Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => { setActiveCategory('vendors'); }}
            className="px-8 py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-champagne-gold transition-all duration-300"
          >
            + Add More Experiences
          </button>
        </div>
      </div>

      {/* Right Column: Dynamic Chat and Live Activity Logs */}
      {isChatOpen && (
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
          {/* 1. Group Discussion Chat Panel */}
          <div className="bg-white border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px]">
            <div className="p-4 border-b border-outline-variant bg-surface flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-primary">Group Discussion</h3>
                <p className="text-[10px] text-on-surface-variant font-semibold">Active: 4 collaborators online</p>
              </div>
              <button onClick={() => setIsCartChatOpen(false)} className="text-outline hover:text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col gap-1 ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 mb-0.5 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-outline-variant/30">
                      <img alt={msg.user} className="w-full h-full object-cover" src={msg.avatar} />
                    </div>
                    <span className="text-xs font-bold text-primary">{msg.user}</span>
                    <span className="text-[9px] text-outline font-mono">{msg.time}</span>
                  </div>
                  <div className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] shadow-sm ${msg.isSelf ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-container-low text-midnight-slate rounded-tl-none'}`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-surface border-t border-outline-variant/30 flex items-center gap-2">
              <input
                type="text"
                placeholder="Message the group..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                className="flex-grow bg-white border border-outline-variant/40 rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
              <button
                onClick={handleSendChatMessage}
                className="bg-primary text-white p-2 rounded-full hover:bg-champagne-gold transition-transform active:scale-90"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Live Activity Feed */}
          <div className="bg-white border border-outline-variant/40 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-midnight-slate/60 mb-4">Live Activity Log</h3>
            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs leading-relaxed">
                  <div className="w-8 h-8 rounded-full bg-surface-container-low flex-shrink-0 flex items-center justify-center text-primary shadow-sm font-semibold">
                    {act.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-midnight-slate">
                      <span className="font-bold">{act.user}</span> {act.action}
                    </p>
                    <span className="text-[9px] text-outline block mt-0.5 uppercase tracking-tighter">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
