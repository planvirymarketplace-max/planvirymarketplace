'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/lib/store'

export function Footer() {
  const { goHome, setView, navigateToCategory } = useAppStore()

  return (
    <footer className="border-t border-slate-200 bg-[#F8F7F2] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <button onClick={goHome} className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">Planviry</span>
            </button>
            <p className="text-xs text-slate-500 mt-3 max-w-xs leading-relaxed">
              Milwaukee&apos;s premier directory for wedding and event vendors. Find the best local professionals for your special day.
            </p>
          </div>

          {/* For Couples */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">For Couples</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setView('directory')}
                  className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Browse Vendors
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('wedding_venue')}
                  className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Wedding Venues
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('photography')}
                  className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Photographers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('catering')}
                  className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Catering
                </button>
              </li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">For Vendors</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setView('claim')}
                  className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  List Your Business
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView('claim')}
                  className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Claim Your Profile
                </button>
              </li>
              <li>
                <span className="text-xs text-slate-600 font-medium">Vendor Dashboard</span>
              </li>
              <li>
                <span className="text-xs text-slate-600 font-medium">Pricing</span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">Company</h3>
            <ul className="space-y-2">
              <li><span className="text-xs text-slate-600 font-medium">About Us</span></li>
              <li><span className="text-xs text-slate-600 font-medium">Privacy Policy</span></li>
              <li><span className="text-xs text-slate-600 font-medium">Terms of Service</span></li>
              <li><span className="text-xs text-slate-600 font-medium">Contact</span></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-200" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400 tracking-wide">
            &copy; {new Date().getFullYear()} Planviry. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            Made with <Heart className="size-3 text-orange-500 fill-orange-500 mx-0.5" /> in Milwaukee
          </div>
        </div>
      </div>
    </footer>
  )
}
