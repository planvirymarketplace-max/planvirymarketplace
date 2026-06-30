'use client'

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  BarChart3,
  CheckSquare,
  FileEdit,
  UserPlus,
  Lock,
  Shield,
  CreditCard,
  CheckCircle
} from 'lucide-react';
import { ActivityLog } from '@/types';

export const PaymentPage: React.FC = () => {
  const {
    itinerary,
    collaborators,
    splitStrategy,
    setSplitStrategy,
    paymentSentStates,
    handleSendPaymentRequest,
    personalPaymentCompleted,
    setPersonalPaymentCompleted,
    setActivities,
    setShowShareModal
  } = useApp();

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 md:px-margin-desktop py-12 flex flex-col lg:flex-row gap-gutter">
      
      {/* Left: Detailed Payment Ledgers & Splits */}
      <div className="flex-1 space-y-8">
        <div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-champagne-gold uppercase">FINANCIAL ORCHESTRATION</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-primary mt-1">Weekend Gala Ledger</h1>
          <p className="text-on-surface-variant font-body-md mt-2">Manage mutual contributions, strategy splits, and secure checkout transfers.</p>
        </div>

        {/* Cost Summary Ledger Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
          <div className="md:col-span-2 bg-white border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between min-h-[180px] shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Total Estimated Cost</span>
              <div className="font-serif text-4xl md:text-5xl font-bold text-primary mt-2">
                ${itinerary.reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center mt-4 pt-4 border-t border-outline-variant/20 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span>Lodging Portion: ${itinerary.filter(e => e.category === 'travel').reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-champagne-gold" />
                <span>Other Items: ${itinerary.filter(e => e.category !== 'travel').reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary text-white rounded-xl p-6 flex flex-col justify-center items-center text-center space-y-2 shadow-sm">
            <ShieldCheck className="text-champagne-gold w-10 h-10 stroke-[1.5]" />
            <h3 className="font-serif text-lg font-bold text-champagne-gold">Secure Split</h3>
            <p className="text-xs opacity-80 leading-relaxed">Platform ledger guarantees zero fractional leak or liability risks.</p>
          </div>
        </div>

        {/* Split Strategy Choice Selector */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-midnight-slate/60">Choose Split Strategy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setSplitStrategy('equal')}
              className={`p-5 rounded-xl text-left transition-all shadow-sm flex flex-col justify-between border-2 ${splitStrategy === 'equal' ? 'border-champagne-gold bg-white' : 'border-outline-variant/30 bg-white hover:border-outline'}`}
            >
              <div className="flex justify-between items-center mb-4">
                <BarChart3 className="text-champagne-gold w-6 h-6 stroke-[1.5]" />
                <div className={`w-4 h-4 rounded-full border-4 ${splitStrategy === 'equal' ? 'border-champagne-gold bg-champagne-gold' : 'border-outline-variant'}`} />
              </div>
              <span className="font-bold text-sm block">Split Equally</span>
              <p className="text-xs text-on-surface-variant mt-1">
                ${(itinerary.reduce((acc, curr) => acc + curr.price, 0) / 4).toLocaleString()} per person
              </p>
            </button>

            <button
              onClick={() => setSplitStrategy('item')}
              className={`p-5 rounded-xl text-left transition-all shadow-sm flex flex-col justify-between border-2 ${splitStrategy === 'item' ? 'border-champagne-gold bg-white' : 'border-outline-variant/30 bg-white hover:border-outline'}`}
            >
              <div className="flex justify-between items-center mb-4">
                <CheckSquare className="text-midnight-slate/60 w-6 h-6 stroke-[1.5]" />
                <div className={`w-4 h-4 rounded-full border-4 ${splitStrategy === 'item' ? 'border-champagne-gold bg-champagne-gold' : 'border-outline-variant'}`} />
              </div>
              <span className="font-bold text-sm block">Split by Item</span>
              <p className="text-xs text-on-surface-variant mt-1">Assign custom events per member</p>
            </button>

            <button
              onClick={() => setSplitStrategy('custom')}
              className={`p-5 rounded-xl text-left transition-all shadow-sm flex flex-col justify-between border-2 ${splitStrategy === 'custom' ? 'border-champagne-gold bg-white' : 'border-outline-variant/30 bg-white hover:border-outline'}`}
            >
              <div className="flex justify-between items-center mb-4">
                <FileEdit className="text-midnight-slate/60 w-6 h-6 stroke-[1.5]" />
                <div className={`w-4 h-4 rounded-full border-4 ${splitStrategy === 'custom' ? 'border-champagne-gold bg-champagne-gold' : 'border-outline-variant'}`} />
              </div>
              <span className="font-bold text-sm block">Manual Split</span>
              <p className="text-xs text-on-surface-variant mt-1">Configure manual fractions</p>
            </button>
          </div>
        </section>

        {/* Group Contributions List */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-xs font-bold uppercase tracking-widest text-midnight-slate/60">Group Contributions Ledger</h3>
            <button onClick={() => setShowShareModal(true)} className="text-champagne-gold font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 hover:underline bg-transparent border-none cursor-pointer">
              <UserPlus className="w-4 h-4" /> Invite Member
            </button>
          </div>

          <div className="bg-white border border-outline-variant/30 rounded-xl divide-y divide-outline-variant/20 shadow-sm overflow-hidden">
            {collaborators.map((member) => {
              const isPaid = member.role === 'Orchestrator';
              const personalAmount = itinerary.reduce((acc, curr) => acc + curr.price, 0) / 4;
              const requestSent = paymentSentStates[member.id];

              return (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-refined-offwhite transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/40">
                      <img alt={member.name} className="w-full h-full object-cover" src={member.avatar} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-primary">{member.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                        isPaid 
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' 
                          : 'text-amber-700 bg-amber-50 border border-amber-100'
                      }`}>
                        {isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-6">
                    <div>
                      <p className="font-bold text-sm text-primary">${personalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      {!isPaid && member.id !== 'col-4' && (
                        <button
                          onClick={() => handleSendPaymentRequest(member.id)}
                          className={`text-[10px] font-bold uppercase tracking-widest mt-1 block hover:underline text-left bg-transparent border-none cursor-pointer ${requestSent ? 'text-emerald-600' : 'text-primary'}`}
                        >
                          {requestSent ? 'Request Sent ✓' : 'Send Reminder'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Right Side: Secure Checkout Payment processing */}
      <aside className="w-full lg:w-96 shrink-0 space-y-6">
        <div className="bg-white border border-outline-variant/30 rounded-xl p-6 shadow-premium space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20">
            <h3 className="font-serif text-xl font-bold text-primary">Your Payment</h3>
            <ShieldCheck className="text-champagne-gold w-6 h-6 stroke-[1.5]" />
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Your Equal Share (25%)</span>
              <span className="font-bold">${(itinerary.reduce((acc, curr) => acc + curr.price, 0) / 4).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Planviry Concierge Fee</span>
              <span className="font-bold">$24.99</span>
            </div>
            <div className="flex justify-between font-bold text-primary text-lg pt-4 border-t border-outline-variant/20">
              <span>Total Due</span>
              <span>${((itinerary.reduce((acc, curr) => acc + curr.price, 0) / 4) + 24.99).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {personalPaymentCompleted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm">Transfer Completed Successfully</p>
              <p className="text-xs">Your personal portion for the Weekend Gala is secured.</p>
            </div>
          ) : (
            <section className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-outline">Secure Payment Details</h4>
              <div className="space-y-2">
                <div className="border border-outline-variant/40 bg-surface rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-primary w-5 h-5 stroke-[1.5]" />
                    <span className="text-xs font-bold text-primary">Visa ending in 4242</span>
                  </div>
                  <span className="text-[10px] font-bold text-outline">PRIMARY</span>
                </div>
                
                <button
                  onClick={() => {
                    setPersonalPaymentCompleted(true);
                    const newAct: ActivityLog = {
                      id: `act-${Date.now()}`,
                      user: 'You',
                      action: 'completed personal share checkout transfer of $' + ((itinerary.reduce((acc, curr) => acc + curr.price, 0) / 4) + 24.99).toFixed(2),
                      time: 'Just now',
                      icon: 'credit_card',
                    };
                    setActivities((prev) => [newAct, ...prev]);
                  }}
                  className="w-full bg-primary hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-lg transition-transform active:scale-95 shadow-lg border-none cursor-pointer"
                >
                  Complete My Payment
                </button>
              </div>
            </section>
          )}

          <div className="flex justify-center gap-4 pt-4 border-t border-outline-variant/10 text-outline">
            <Lock className="w-4 h-4 text-outline/60" />
            <Shield className="w-4 h-4 text-outline/60" />
            <ShieldCheck className="w-4 h-4 text-outline/60" />
          </div>
        </div>
      </aside>

    </div>
  );
};
