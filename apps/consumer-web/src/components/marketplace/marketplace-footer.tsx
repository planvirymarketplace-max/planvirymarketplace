'use client'

import { MapPin, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { CATEGORY_LABELS } from '@/lib/medusa'
import type { MilwaukeeCategory } from '@/lib/medusa'

const footerCategories: MilwaukeeCategory[] = [
  'wedding_venue', 'wedding_dj', 'photography', 'catering',
  'florist', 'hair_makeup', 'wedding_planner', 'wedding_band',
]

export function MarketplaceFooter() {
  const { setView } = useAppStore()

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-600 text-white flex size-8 items-center justify-center rounded-lg font-bold text-sm">
                MKE
              </div>
              <span className="text-blue-600 font-bold text-lg">Planviry</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Milwaukee&apos;s Premier Vendor Marketplace. Find trusted wedding & event vendors for your special day.
            </p>
            <div className="flex gap-3">
              <button className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer" aria-label="Instagram">
                <Instagram className="size-4" />
              </button>
              <button className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer" aria-label="Facebook">
                <Facebook className="size-4" />
              </button>
              <button className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer" aria-label="Twitter">
                <Twitter className="size-4" />
              </button>
            </div>
          </div>

          {/* For Couples */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-900">For Couples</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setView('vendors')} className="text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Browse Vendors
                </button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Wedding Venues
                </button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Real Weddings
                </button>
              </li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-900">For Vendors</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setView('claim-vendor')} className="text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Claim Your Listing
                </button>
              </li>
              <li>
                <button onClick={() => setView('claim-vendor')} className="text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  List Your Business
                </button>
              </li>
              <li>
                <button onClick={() => setView('login')} className="text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Vendor Login
                </button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-900">Categories</h4>
            <ul className="space-y-2.5">
              {footerCategories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => { setView('vendors') }}
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Planviry. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hover:text-blue-600 cursor-pointer">Privacy Policy</span>
            <span className="text-xs text-gray-400 hover:text-blue-600 cursor-pointer">Terms of Service</span>
            <span className="text-xs text-gray-400 hover:text-blue-600 cursor-pointer">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
