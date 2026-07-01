'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Loader2,
  MapPin,
  Ticket,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Types (mirror the server page) ──────────────────────────────────────
type VendorAccount = { name: string; slug: string }
type InventoryItem = {
  id: string
  title: string
  category: string | null
  slug: string | null
  vendor_accounts: VendorAccount
}
type CheckIn = { id: string; checked_in_at: string | null }
export type Reservation = {
  id: string
  status: string
  starts_at: string | null
  ends_at: string | null
  quantity: number
  total_price_cents: number | null
  currency: string | null
  created_at: string | null
  inventory_items: InventoryItem
  check_ins: CheckIn[]
}

// ─── Status badge ─────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
  COMPLETED: 'bg-gray-100 text-gray-600 border-gray-200',
  EXPIRED: 'bg-gray-100 text-gray-500 border-gray-200',
  REFUNDED: 'bg-gray-100 text-gray-600 border-gray-200',
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'
  const Icon =
    status === 'CONFIRMED' || status === 'COMPLETED'
      ? CheckCircle2
      : status === 'CANCELLED'
        ? XCircle
        : Clock
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${cls}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  )
}

// ─── Date range formatter ─────────────────────────────────────────────────
function formatDateRange(startsAt: string | null, endsAt: string | null): string {
  if (!startsAt && !endsAt) return 'Date TBD'
  const fmt = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  if (!endsAt) return fmt(startsAt!)
  if (!startsAt) return `until ${fmt(endsAt)}`
  const s = new Date(startsAt)
  const e = new Date(endsAt)
  const sameDay = s.toDateString() === e.toDateString()
  return sameDay
    ? `${s.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })} → ${e.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : `${fmt(startsAt)} → ${fmt(endsAt)}`
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

// ─── Reservation card ────────────────────────────────────────────────────
function ReservationCard({ reservation }: { reservation: Reservation }) {
  const router = useRouter()
  const [cancelling, setCancelling] = useState(false)

  const item = reservation.inventory_items
  const vendor = item?.vendor_accounts
  const cancellable =
    reservation.status === 'PENDING' || reservation.status === 'CONFIRMED'
  const checkedIn = (reservation.check_ins ?? []).length > 0

  const handleCancel = async () => {
    if (!confirm('Cancel this reservation? This cannot be undone.')) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/orders/${reservation.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelled by user' }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || `Failed (${res.status})`)
      }
      toast.success('Reservation cancelled')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to cancel reservation')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={reservation.status} />
            {checkedIn && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                <CheckCircle2 className="w-3 h-3" /> Checked in
              </span>
            )}
          </div>
          <h3 className="font-bold text-black truncate">
            {item?.title ?? 'Untitled item'}
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
        {item?.category && (
          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-gray-50 text-gray-500 border border-gray-200 shrink-0">
            {item.category.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">When</p>
            <p className="text-gray-700">
              {formatDateRange(reservation.starts_at, reservation.ends_at)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Ticket className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Quantity</p>
            <p className="text-gray-700">{reservation.quantity}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Download className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Total</p>
            <p className="text-gray-700 font-bold">
              {formatPrice(reservation.total_price_cents, reservation.currency)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          href={`/account/reservations/${reservation.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-black border border-black px-3 py-1.5 rounded-lg hover:bg-black hover:text-white"
        >
          <Eye className="w-3.5 h-3.5" /> View Details
        </Link>
        <a
          href={`/api/orders/${reservation.id}/invoice`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <Download className="w-3.5 h-3.5" /> Invoice
        </a>
        {cancellable && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 border border-red-600 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            {cancelling ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {cancelling ? 'Cancelling…' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── List ─────────────────────────────────────────────────────────────────
export function ReservationsList({
  reservations,
}: {
  reservations: Reservation[]
}) {
  return (
    <div className="space-y-4">
      {reservations.map((r) => (
        <ReservationCard key={r.id} reservation={r} />
      ))}
    </div>
  )
}
