'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  Heart,
  Loader2,
  MapPin,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { SavedItem } from './page'

// ─── Helpers ──────────────────────────────────────────────────────────────
function pickPrimaryImage(
  assets: { url: string; is_primary: boolean | null; sort_order: number | null }[],
): string | null {
  if (!assets || assets.length === 0) return null
  const primary = assets.find((a) => a.is_primary)
  if (primary) return primary.url
  const sorted = [...assets].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )
  return sorted[0]?.url ?? null
}

function formatPrice(cents: number | null, currency: string | null): string {
  const amount = (cents ?? 0) / 100
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ─── Card ──────────────────────────────────────────────────────────────────
function SavedCard({ item }: { item: SavedItem }) {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)
  const inv = item.inventory_items
  const vendor = inv.vendor_accounts
  const imageUrl = pickPrimaryImage(inv.media_assets)

  const handleRemove = async () => {
    if (!confirm('Remove this saved item?')) return
    setRemoving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', item.id)
        .eq('user_id', item.user_id)
      if (error) throw new Error(error.message)
      toast.success('Removed from saved items')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to remove item')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow flex gap-4">
      {/* Image / placeholder */}
      <Link
        href={inv.slug ? `/s/${inv.slug}` : `/search`}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={inv.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Heart className="w-8 h-8 text-gray-300" />
        )}
      </Link>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {inv.category && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-200">
                  {inv.category.replace(/_/g, ' ')}
                </span>
              )}
              {item.created_at && (
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Saved {formatDate(item.created_at)}
                </span>
              )}
            </div>
            <h3 className="font-bold text-black truncate">
              {inv.title}
            </h3>
            {vendor?.name && (
              <Link
                href={`/v/${vendor.slug}`}
                className="text-sm text-gray-500 hover:text-black inline-flex items-center gap-1 mt-0.5"
              >
                <MapPin className="w-3 h-3" />
                {vendor.name}
              </Link>
            )}
          </div>
          <p className="text-sm font-bold text-black shrink-0">
            {formatPrice(inv.base_price_cents, inv.currency)}
          </p>
        </div>

        <div className="mt-auto pt-3 flex items-center gap-2">
          <Link
            href={inv.slug ? `/s/${inv.slug}` : `/search`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-black border border-black px-3 py-1.5 rounded-lg hover:bg-black hover:text-white"
          >
            View
          </Link>
          <button
            onClick={handleRemove}
            disabled={removing}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 border border-red-600 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            {removing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            {removing ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── List ──────────────────────────────────────────────────────────────────
export function SavedList({ items }: { items: SavedItem[] }) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Heart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400">Nothing left in your saved items.</p>
        <Link
          href="/search"
          className="inline-block mt-4 text-sm font-bold text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white"
        >
          Browse listings
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <SavedCard key={item.id} item={item} />
      ))}
    </div>
  )
}
