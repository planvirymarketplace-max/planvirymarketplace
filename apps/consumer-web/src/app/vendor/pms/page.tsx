'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  BedDouble,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Ban,
} from 'lucide-react'

// ─── Room status model ─────────────────────────────────────────────────────
// Room status is stored inside inventory_items.metadata.room_status so we
// don't need a schema migration. Valid values:
//   CLEAN         — housekeeping finished, ready to assign
//   DIRTY         — guest checked out, needs cleaning
//   INSPECTED     — supervisor-verified clean
//   OUT_OF_ORDER  — maintenance issue, do not sell

type RoomStatus = 'CLEAN' | 'DIRTY' | 'INSPECTED' | 'OUT_OF_ORDER'

const ROOM_STATUSES: RoomStatus[] = ['CLEAN', 'DIRTY', 'INSPECTED', 'OUT_OF_ORDER']

const STATUS_META: Record<
  RoomStatus,
  { label: string; badge: string; icon: typeof Sparkles; description: string }
> = {
  CLEAN: {
    label: 'Clean',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
    description: 'Housekeeping finished — ready to assign',
  },
  DIRTY: {
    label: 'Dirty',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: AlertCircle,
    description: 'Guest checked out — needs cleaning',
  },
  INSPECTED: {
    label: 'Inspected',
    badge: 'bg-sky-100 text-sky-800 border-sky-200',
    icon: Sparkles,
    description: 'Supervisor-verified clean',
  },
  OUT_OF_ORDER: {
    label: 'Out-of-Order',
    badge: 'bg-red-100 text-red-800 border-red-200',
    icon: Ban,
    description: 'Maintenance issue — do not sell',
  },
}

interface RoomRow {
  id: string
  title: string
  slug: string | null
  status: string | null
  base_price_cents: number | null
  currency: string | null
  metadata: Record<string, unknown> | null
  location_id: string | null
}

function readRoomStatus(metadata: Record<string, unknown> | null): RoomStatus {
  const value = metadata?.room_status
  if (typeof value === 'string' && ROOM_STATUSES.includes(value as RoomStatus)) {
    return value as RoomStatus
  }
  return 'CLEAN'
}

export default function VendorPmsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [rooms, setRooms] = useState<RoomRow[]>([])
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<RoomStatus | 'ALL'>('ALL')
  const [updating, setUpdating] = useState<Record<string, boolean>>({})

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?returnTo=/vendor/pms'); return }
    const { data: staff, error: staffErr } = await supabase
      .from('vendor_staff')
      .select('vendor_id')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .maybeSingle()
    if (staffErr || !staff) { router.push('/onboarding/vendor'); return }
    setVendorId(staff.vendor_id)

    const { data: items, error: itemsErr } = await supabase
      .from('inventory_items')
      .select('id, title, slug, status, base_price_cents, currency, metadata, location_id')
      .eq('vendor_id', staff.vendor_id)
      .eq('category', 'LODGING')
      .order('title', { ascending: true })

    if (itemsErr) {
      setError(itemsErr.message)
    }
    setRooms((items as RoomRow[] | null) ?? [])
    setLoading(false)
  }, [router, supabase])

  useEffect(() => {
    load()
  }, [load])

  const handleStatusChange = async (roomId: string, next: RoomStatus) => {
    setUpdating(prev => ({ ...prev, [roomId]: true }))
    setError('')
    try {
      // Merge room_status into the existing metadata object so we don't
      // clobber any other fields the vendor has stored there.
      const target = rooms.find(r => r.id === roomId)
      const mergedMetadata = { ...(target?.metadata ?? {}), room_status: next }
      const { error: updateErr } = await supabase
        .from('inventory_items')
        .update({ metadata: mergedMetadata })
        .eq('id', roomId)

      if (updateErr) throw updateErr

      setRooms(prev =>
        prev.map(r => (r.id === roomId ? { ...r, metadata: mergedMetadata } : r)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update room status')
    } finally {
      setUpdating(prev => {
        const next = { ...prev }
        delete next[roomId]
        return next
      })
    }
  }

  // Summary counts for the board header
  const summary = useMemo(() => {
    const counts: Record<RoomStatus, number> = {
      CLEAN: 0,
      DIRTY: 0,
      INSPECTED: 0,
      OUT_OF_ORDER: 0,
    }
    for (const room of rooms) {
      counts[readRoomStatus(room.metadata)]++
    }
    return counts
  }, [rooms])

  const visibleRooms = useMemo(
    () => (filter === 'ALL' ? rooms : rooms.filter(r => readRoomStatus(r.metadata) === filter)),
    [rooms, filter],
  )

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <Link
                href="/vendor/dashboard"
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-2"
              >
                <ArrowLeft className="w-4 h-4" /> Dashboard
              </Link>
              <h1 className="text-2xl font-black text-black flex items-center gap-2">
                <BedDouble className="w-6 h-6 text-gray-500" /> PMS Room Status Board
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage housekeeping status for your lodging inventory (category&nbsp;=&nbsp;LODGING).
              </p>
            </div>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {ROOM_STATUSES.map(status => {
              const meta = STATUS_META[status]
              const Icon = meta.icon
              const isActive = filter === status
              return (
                <button
                  key={status}
                  onClick={() => setFilter(isActive ? 'ALL' : status)}
                  className={`text-left bg-white rounded-xl border p-4 transition-shadow hover:shadow-md ${
                    isActive ? 'border-black ring-1 ring-black/10' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      {meta.label}
                    </span>
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-3xl font-black text-black mt-1">{summary[status]}</p>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{meta.description}</p>
                </button>
              )
            })}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <BedDouble className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No lodging rooms found for your vendor account.</p>
              <p className="text-xs text-gray-400 mb-4">
                Add inventory items with <span className="font-mono">category = LODGING</span> to use the PMS board.
              </p>
              <Link
                href="/vendor/create-listing"
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Create a listing
              </Link>
            </div>
          ) : (
            <>
              {/* Filter pill row */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    filter === 'ALL'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  All ({rooms.length})
                </button>
                {ROOM_STATUSES.map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(filter === status ? 'ALL' : status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      filter === status
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {STATUS_META[status].label} ({summary[status]})
                  </button>
                ))}
              </div>

              {/* Room grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleRooms.map(room => {
                  const status = readRoomStatus(room.metadata)
                  const meta = STATUS_META[status]
                  const Icon = meta.icon
                  const isUpdating = updating[room.id]
                  return (
                    <div
                      key={room.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0">
                          <p className="font-bold text-black text-sm truncate">{room.title}</p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {room.slug ?? '—'}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${meta.badge}`}
                          title={meta.description}
                        >
                          <Icon className="w-3 h-3" /> {meta.label}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        <span className="font-mono text-[10px] uppercase tracking-wide text-gray-400">
                          Inventory status
                        </span>{' '}
                        <span className="font-bold text-gray-700">{room.status ?? '—'}</span>
                      </div>
                      <div className="mt-auto">
                        <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                          Housekeeping status
                        </label>
                        <div className="relative">
                          <select
                            value={status}
                            disabled={isUpdating}
                            onChange={e => handleStatusChange(room.id, e.target.value as RoomStatus)}
                            className="w-full text-sm font-semibold text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-black disabled:opacity-50"
                          >
                            {ROOM_STATUSES.map(s => (
                              <option key={s} value={s}>
                                {STATUS_META[s].label}
                              </option>
                            ))}
                          </select>
                          {isUpdating && (
                            <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {visibleRooms.length === 0 && (
                  <div className="col-span-full bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                    No rooms match this filter.
                  </div>
                )}
              </div>
            </>
          )}

          {vendorId && (
            <p className="text-xs text-gray-400 mt-6 text-center">
              Showing <span className="font-mono">inventory_items</span> where{' '}
              <span className="font-mono">vendor_id = {vendorId}</span> and{' '}
              <span className="font-mono">category = LODGING</span>. Room status stored in{' '}
              <span className="font-mono">metadata.room_status</span>.
            </p>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
