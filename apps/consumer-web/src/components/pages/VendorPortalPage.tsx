'use client'

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Grid,
  Calendar,
  DollarSign,
  Settings
} from 'lucide-react';
import { IMAGES, VENDOR_METRICS } from '@/data/prototype-data';

export const VendorPortalPage: React.FC = () => {
  const {
    bookingRequests,
    handleUpdateBookingStatus,
    setSelectedItem
  } = useApp();

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 md:px-margin-desktop py-12 flex flex-col lg:flex-row gap-gutter">

      {/* Vendor Portal Sidebar Navigation Panel */}
      <aside className="w-full lg:w-64 bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm shrink-0 space-y-6 h-fit">
        <div className="flex items-center gap-3 pb-6 border-b border-outline-variant/20">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-outline-variant/30">
            <img alt="Elite Logo" className="w-full h-full object-cover" src={IMAGES.eliteLogo} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-primary">Elite Events Co.</h3>
            <span className="text-[9px] font-bold text-champagne-gold uppercase tracking-widest">PREMIUM VENDOR</span>
          </div>
        </div>

        <div className="space-y-1">
          <button className="w-full text-left px-4 py-3 bg-surface-container-low text-primary rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-3 bg-neutral-100 border-none cursor-pointer">
            <Grid className="w-4 h-4 stroke-[1.5]" />
            Dashboard
          </button>
          <button className="w-full text-left px-4 py-3 text-outline hover:text-primary rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-3 bg-transparent border-none cursor-pointer">
            <Calendar className="w-4 h-4 stroke-[1.5]" />
            Bookings
          </button>
          <button className="w-full text-left px-4 py-3 text-outline hover:text-primary rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-3 bg-transparent border-none cursor-pointer">
            <DollarSign className="w-4 h-4 stroke-[1.5]" />
            Disbursements
          </button>
          <button className="w-full text-left px-4 py-3 text-outline hover:text-primary rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-3 bg-transparent border-none cursor-pointer">
            <Settings className="w-4 h-4 stroke-[1.5]" />
            Portal Config
          </button>
        </div>

        <div className="pt-6 border-t border-outline-variant/20 text-center">
          <button
            onClick={() => {
              setSelectedItem({
                id: 'elite-preview-id',
                title: 'Elite Occasion Suite',
                category: 'vendors',
                price: 2400,
                location: 'Global',
                image: IMAGES.eliteLogo,
                badge: 'Featured Listing',
                rating: 4.9,
                description: 'Preview of your premium, featured agency profile. Complete our 12-point quality audit to access extra lead pipelines.'
              });
            }}
            className="w-full py-2.5 bg-primary hover:bg-neutral-800 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-colors border-none cursor-pointer"
          >
            Preview My Listing
          </button>
        </div>
      </aside>

      {/* Vendor Main Dashboard Workspace */}
      <div className="flex-1 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-champagne-gold uppercase">VENDOR CONSOLE</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-primary mt-1">Elite Events Co.</h1>
            <p className="text-on-surface-variant font-body-md mt-2">Manage upcoming bento occasion requests, active ratings, and financial metrics.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-primary text-primary text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-50 bg-transparent cursor-pointer">
              Export Ledger
            </button>
          </div>
        </div>

        {/* Vendor Sparkline Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VENDOR_METRICS.map((metric) => (
            <div key={metric.id} className="bg-white border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-outline font-bold text-xs uppercase tracking-wider">{metric.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${metric.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                  {metric.change}
                </span>
              </div>

              <div className="flex items-end justify-between mt-2">
                <p className="font-serif text-2xl font-bold text-primary">{metric.value}</p>
                {/* SVG Sparkline implementation */}
                <div className="w-16 h-8 opacity-75">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    <path
                      d={`M 0,${40 - (metric.sparkline[0] * 35 / Math.max(...metric.sparkline))}
                          L 16,${40 - (metric.sparkline[1] * 35 / Math.max(...metric.sparkline))}
                          L 32,${40 - (metric.sparkline[2] * 35 / Math.max(...metric.sparkline))}
                          L 48,${40 - (metric.sparkline[3] * 35 / Math.max(...metric.sparkline))}
                          L 64,${40 - (metric.sparkline[4] * 35 / Math.max(...metric.sparkline))}
                          L 80,${40 - (metric.sparkline[5] * 35 / Math.max(...metric.sparkline))}
                          L 100,${40 - (metric.sparkline[6] * 35 / Math.max(...metric.sparkline))}`}
                      fill="none"
                      stroke="#C5A059"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table of Recent Booking Requests */}
        <div className="bg-white border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold text-primary">Incoming Booking Requests</h2>
            <span className="text-xs text-outline font-semibold">Verification Gated</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-outline">Client</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-outline">Occasion Name</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-outline">Requested Date</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-outline text-right">Amount</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-outline text-center">Status / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-sm">
                {bookingRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-refined-offwhite transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/40">
                          <img alt={req.clientName} className="w-full h-full object-cover" src={req.clientAvatar} />
                        </div>
                        <div>
                          <p className="font-bold text-primary">{req.clientName}</p>
                          <span className="text-[10px] text-outline font-semibold">{req.clientTier}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-primary">{req.occasionName}</p>
                    </td>
                    <td className="px-6 py-4 text-outline">
                      {req.date}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary">
                      ${req.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {req.status === 'Pending' ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleUpdateBookingStatus(req.id, 'Approved')}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg uppercase tracking-wider border border-emerald-100 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(req.id, 'Declined')}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold rounded-lg uppercase tracking-wider border border-rose-100 cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disbursement Ledger */}
        <div className="bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-primary mb-4 border-b border-outline-variant/20 pb-3">Financial Disbursement Schedule</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-bold text-primary">Direct Deposit Transfer - Savannah Cycle 2</p>
                <p className="text-xs text-outline mt-0.5">Clearing bank accounts on Nov 30, 2026</p>
              </div>
              <span className="font-serif text-lg font-bold text-primary">$12,200.00</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-outline-variant/10 pt-4">
              <div>
                <p className="font-bold text-primary">Prestige Wedding Installment - Rossi Wedding</p>
                <p className="text-xs text-outline mt-0.5">Clearing bank accounts on Dec 15, 2026</p>
              </div>
              <span className="font-serif text-lg font-bold text-primary">$34,100.00</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
