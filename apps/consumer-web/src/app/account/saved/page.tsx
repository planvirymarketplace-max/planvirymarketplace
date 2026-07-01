import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { SavedList } from './SavedList'

// ─── Types ────────────────────────────────────────────────────────────────
type MediaAsset = { url: string; is_primary: boolean | null; sort_order: number | null }
type VendorAccount = { name: string; slug: string }
type InventoryItem = {
  id: string
  title: string
  category: string | null
  slug: string | null
  base_price_cents: number | null
  currency: string | null
  vendor_accounts: VendorAccount
  media_assets: MediaAsset[]
}
export type SavedItem = {
  id: string
  user_id: string
  item_id: string
  created_at: string | null
  inventory_items: InventoryItem
}

export const metadata = {
  title: 'Saved Items — Planviry',
}

export default async function SavedPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?returnTo=/account/saved')
  }

  // Query saved_items joined with inventory_items + vendor_accounts + media_assets.
  // The `!inner` on inventory_items ensures rows whose item was deleted are
  // filtered out (rather than returning a saved_items row with null
  // inventory_items).
  const { data, error } = await supabase
    .from('saved_items')
    .select(
      `
      id, user_id, item_id, created_at,
      inventory_items!inner(
        id, title, category, slug, base_price_cents, currency,
        vendor_accounts!inner(name, slug),
        media_assets(url, is_primary, sort_order)
      )
      `,
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const items = (data ?? []) as unknown as SavedItem[]

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Link
            href="/account"
            className="text-sm text-gray-400 hover:text-black mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Account
          </Link>

          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-black text-black">Saved Items</h1>
            {items.length > 0 && (
              <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>

          {error ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-red-600">
                Could not load saved items. Please try again later.
              </p>
              <p className="text-xs text-gray-400 mt-1">{error.message}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">You have no saved items yet.</p>
              <p className="text-sm text-gray-300 mt-1">
                Tap the heart on any listing to save it for later.
              </p>
              <Link
                href="/search"
                className="inline-block mt-4 text-sm font-bold text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white"
              >
                Browse listings
              </Link>
            </div>
          ) : (
            <SavedList items={items} />
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
