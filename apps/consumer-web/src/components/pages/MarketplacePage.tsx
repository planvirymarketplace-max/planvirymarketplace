'use client'

import { useState, useCallback } from 'react'
import { MarketplaceShell } from '@/components/marketplace/shell'
import { getSavedVendors } from '@/lib/planviry-vendor-seed'
import type { Vendor } from '@/lib/marketplace-types'

// Module-level cache so reference stays stable across renders
let _cachedVendors: Vendor[] | null = null

function getVendorsOnce(): Vendor[] {
  if (!_cachedVendors) {
    _cachedVendors = getSavedVendors()
  }
  return _cachedVendors
}

export function MarketplacePage({ navigate }: { navigate: (path: string) => void }) {
  const [vendors] = useState<Vendor[]>(getVendorsOnce)

  if (!vendors || vendors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-stone-900">Planviry</div>
          <div className="mt-2 text-sm text-stone-500">Loading directory...</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Back to Best Time */}
      <div className="bg-[#0a0a0a] px-4 py-2">
        <button
          onClick={() => navigate('/')}
          className="text-xs text-white/60 hover:text-ember transition-colors font-utility"
        >
          ← Back to Best Time
        </button>
      </div>
      <MarketplaceShell vendors={vendors} totalVendors={vendors.length} />
    </div>
  )
}
