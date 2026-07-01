'use client'

import Link from 'next/link'
import {
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Plus,
  Tag,
  Users,
} from 'lucide-react'

// ─── Types (mirror the server page) ──────────────────────────────────────
type InventoryItem = { title: string; category: string | null }
export type ItinReservation = {
  id: string
  status: string
  total_price_cents: number | null
  inventory_items: InventoryItem
}
export type ItinerarySession = {
  id: string
  title: string
  status: string
  occasion_type: string | null
  created_at: string | null
  reservations: ItinReservation[]
}

// ─── Status badge ─────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700 border-green-200',
  PLANNING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  DRAFT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  ARCHIVED: 'bg-gray-100 text-gray-600 border-gray-200',
  COMPLETED: 'bg-gray-100 text-gray-600 border-gray-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'
  const Icon =
    status === 'ACTIVE' || status === 'COMPLETED' ? CheckCircle2 : Clock
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${cls}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

function uniqueCategories(reservations: ItinReservation[]): string[] {
  const set = new Set<string>()
  for (const r of reservations) {
    const cat = r.inventory_items?.category
    if (cat) set.add(cat)
  }
  return Array.from(set)
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ─── Itinerary card ──────────────────────────────────────────────────────
function ItineraryCard({ session }: { session: ItinerarySession }) {
  const reservations = session.reservations ?? []
  const totalCents = reservations.reduce(
    (sum, r) => sum + (r.total_price_cents ?? 0),
    0,
  )
  const categories = uniqueCategories(reservations)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={session.status} />
            {session.occasion_type && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border bg-gray-50 text-gray-500 border-gray-200">
                {session.occasion_type}
              </span>
            )}
          </div>
          <h3 className="font-bold text-black truncate">
            {session.title || 'Untitled Trip'}
          </h3>
          {session.created_at && (
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Created {formatDate(session.created_at)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <Layers className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">
              Reservations
            </p>
            <p className="text-gray-700">{reservations.length}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Tag className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">
              Total Cost
            </p>
            <p className="text-gray-700 font-bold">{formatPrice(totalCents)}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-gray-400">
              Categories
            </p>
            <p className="text-gray-700 text-xs truncate">
              {categories.length > 0
                ? categories.map((c) => c.replace(/_/g, ' ')).join(', ')
                : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          href={`/account/itineraries/${session.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-black border border-black px-3 py-1.5 rounded-lg hover:bg-black hover:text-white"
        >
          <Users className="w-3.5 h-3.5" /> View Timeline
        </Link>
        <Link
          href="/planner"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 ml-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add items
        </Link>
      </div>
    </div>
  )
}

// ─── List ─────────────────────────────────────────────────────────────────
export function ItinerariesList({
  sessions,
}: {
  sessions: ItinerarySession[]
}) {
  return (
    <div className="space-y-4">
      {sessions.map((s) => (
        <ItineraryCard key={s.id} session={s} />
      ))}
    </div>
  )
}
