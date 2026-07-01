'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  CalendarDays,
  Ban,
  Clock,
  Save,
  Plus,
} from 'lucide-react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

// ─── Types ──────────────────────────────────────────────────────────────────

interface InventoryRow {
  id: string
  title: string
  slug: string | null
  metadata: Record<string, unknown> | null
}

interface AvailabilityBlockRow {
  id: string
  item_id: string
  start_time: string
  end_time: string
  total_capacity: number | null
  reserved_capacity: number | null
  is_available: boolean
  metadata: Record<string, unknown> | null
}

interface Slot {
  start_time: string
  end_time: string
  available: boolean
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function toLocalDateInput(date: Date): string {
  // YYYY-MM-DD in the user's local timezone
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

function readBuffer(metadata: Record<string, unknown> | null, key: 'buffer_before' | 'buffer_after'): number {
  const v = metadata?.[key]
  return typeof v === 'number' ? v : 0
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function VendorAvailabilityPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [items, setItems] = useState<InventoryRow[]>([])
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [blocks, setBlocks] = useState<AvailabilityBlockRow[]>([])
  const [error, setError] = useState('')
  const [savingBuffer, setSavingBuffer] = useState(false)
  const [addingBlackout, setAddingBlackout] = useState(false)
  const [blackoutDate, setBlackoutDate] = useState<string>(toLocalDateInput(new Date()))
  const [blackoutNote, setBlackoutNote] = useState('')

  // Slot preview for a clicked day
  const [previewDate, setPreviewDate] = useState<string | null>(null)
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [slotsLoading, setSlotsLoading] = useState(false)

  // Buffer form
  const [bufferBefore, setBufferBefore] = useState(0)
  const [bufferAfter, setBufferAfter] = useState(0)

  const calendarRef = useRef<FullCalendar | null>(null)

  // ─── Initial load: vendor + inventory ───────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?returnTo=/vendor/availability'); return }
    const { data: staffRow, error: staffErr } = await supabase
      .from('vendor_staff')
      .select('vendor_id')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .maybeSingle()
    if (staffErr || !staffRow) { router.push('/onboarding/vendor'); return }
    setVendorId(staffRow.vendor_id)

    const { data: inv, error: invErr } = await supabase
      .from('inventory_items')
      .select('id, title, slug, metadata')
      .eq('vendor_id', staffRow.vendor_id)
      .order('title', { ascending: true })

    if (invErr) setError(invErr.message)
    const list = (inv as InventoryRow[] | null) ?? []
    setItems(list)
    if (list.length > 0 && !selectedItemId) {
      setSelectedItemId(list[0].id)
    }
    setLoading(false)
  }, [router, supabase, selectedItemId])

  useEffect(() => {
    load()
  }, [load])

  // ─── Load availability blocks for the selected item ────────────────────
  const loadBlocks = useCallback(async () => {
    if (!selectedItemId) {
      setBlocks([])
      return
    }
    const { data, error } = await supabase
      .from('availability_blocks')
      .select('id, item_id, start_time, end_time, total_capacity, reserved_capacity, is_available, metadata')
      .eq('item_id', selectedItemId)
      .order('start_time', { ascending: true })
    if (error) {
      setError(error.message)
    }
    setBlocks((data as AvailabilityBlockRow[] | null) ?? [])
  }, [supabase, selectedItemId])

  // ─── Load buffer values from inventory metadata when item changes ──────
  useEffect(() => {
    const item = items.find(i => i.id === selectedItemId)
    if (!item) return
    setBufferBefore(readBuffer(item.metadata, 'buffer_before'))
    setBufferAfter(readBuffer(item.metadata, 'buffer_after'))
    setPreviewDate(null)
    setSlots(null)
    loadBlocks()
  }, [selectedItemId, items, loadBlocks])

  // ─── FullCalendar event source ─────────────────────────────────────────
  const calendarEvents = useMemo(() => {
    return blocks.map(b => ({
      id: b.id,
      title: b.is_available
        ? `Available ${formatTime(b.start_time)}–${formatTime(b.end_time)}`
        : `Blackout ${formatTime(b.start_time)}–${formatTime(b.end_time)}`,
      start: b.start_time,
      end: b.end_time,
      backgroundColor: b.is_available ? '#10b981' : '#ef4444',
      borderColor: b.is_available ? '#059669' : '#b91c1c',
      textColor: '#ffffff',
      allDay: false,
      extendedProps: { blockId: b.id, isAvailable: b.is_available },
    }))
  }, [blocks])

  // ─── Save buffer minutes to inventory_items.metadata ───────────────────
  const handleSaveBuffers = async () => {
    if (!selectedItemId) return
    setSavingBuffer(true)
    setError('')
    try {
      const item = items.find(i => i.id === selectedItemId)
      const mergedMetadata = {
        ...(item?.metadata ?? {}),
        buffer_before: bufferBefore,
        buffer_after: bufferAfter,
      }
      const { error: updateErr } = await supabase
        .from('inventory_items')
        .update({ metadata: mergedMetadata })
        .eq('id', selectedItemId)
      if (updateErr) throw updateErr

      setItems(prev =>
        prev.map(i => (i.id === selectedItemId ? { ...i, metadata: mergedMetadata } : i)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save buffer settings')
    } finally {
      setSavingBuffer(false)
    }
  }

  // ─── Add a full-day blackout for the chosen date ───────────────────────
  const handleAddBlackout = async () => {
    if (!selectedItemId || !blackoutDate) return
    setAddingBlackout(true)
    setError('')
    try {
      const dayStart = startOfDay(new Date(blackoutDate + 'T00:00:00'))
      const dayEnd = endOfDay(dayStart)
      const { error: insertErr } = await supabase.from('availability_blocks').insert({
        item_id: selectedItemId,
        start_time: dayStart.toISOString(),
        end_time: dayEnd.toISOString(),
        total_capacity: 0,
        reserved_capacity: 0,
        is_available: false,
        metadata: { type: 'blackout', note: blackoutNote || 'Vendor blackout' },
      })
      if (insertErr) throw insertErr
      setBlackoutNote('')
      await loadBlocks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add blackout date')
    } finally {
      setAddingBlackout(false)
    }
  }

  const handleRemoveBlock = async (blockId: string) => {
    if (!confirm('Delete this availability block?')) return
    const { error } = await supabase.from('availability_blocks').delete().eq('id', blockId)
    if (error) {
      setError(error.message)
    } else {
      await loadBlocks()
    }
  }

  // ─── Fetch slot preview when a date is clicked ─────────────────────────
  const handleDateClick = async (info: { dateStr: string; date: Date }) => {
    if (!selectedItemId) return
    setPreviewDate(info.dateStr)
    setSlots(null)
    setSlotsLoading(true)
    try {
      const res = await fetch(
        `/api/inventory/${selectedItemId}/slots?date=${info.dateStr}&interval=60&duration=60`,
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error?.message || data?.error || 'Failed to load slots')
      }
      setSlots((data?.slots as Slot[]) ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setSlotsLoading(false)
    }
  }

  const selectedItem = items.find(i => i.id === selectedItemId) ?? null
  const availableBlocks = blocks.filter(b => b.is_available)
  const blackoutBlocks = blocks.filter(b => !b.is_available)

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
                <CalendarDays className="w-6 h-6 text-gray-500" /> Availability Calendar
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View availability blocks, add blackout dates, and set buffer times. Slot generation
                uses <code className="font-mono text-xs bg-gray-100 px-1 rounded">shared/slots.ts</code> via{' '}
                <code className="font-mono text-xs bg-gray-100 px-1 rounded">/api/inventory/[id]/slots</code>.
              </p>
            </div>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          {/* Item picker */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
              Inventory item
            </label>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : items.length === 0 ? (
              <p className="text-sm text-gray-500">No inventory items found for your vendor account.</p>
            ) : (
              <select
                value={selectedItemId ?? ''}
                onChange={e => setSelectedItemId(e.target.value)}
                className="w-full sm:max-w-md text-sm font-bold text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              >
                {items.map(i => (
                  <option key={i.id} value={i.id}>{i.title}</option>
                ))}
              </select>
            )}
          </div>

          {!selectedItem ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Select an inventory item to manage its availability.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Calendar column */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  height="auto"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: '',
                  }}
                  events={calendarEvents}
                  dateClick={handleDateClick}
                  dayMaxEvents={3}
                  eventDisplay="block"
                  displayEventTime
                />
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500" /> Available block
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-red-500" /> Blackout
                  </span>
                  <span className="ml-auto">Click a day to preview generated slots.</span>
                </div>
              </div>

              {/* Side panel */}
              <div className="space-y-4">
                {/* Slot preview */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <h2 className="text-sm font-bold text-black">
                      Slot preview
                    </h2>
                  </div>
                  {previewDate ? (
                    <>
                      <p className="text-xs text-gray-500 mb-2">
                        {previewDate} · 60-min intervals
                      </p>
                      {slotsLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      ) : slots && slots.length > 0 ? (
                        <ul className="max-h-48 overflow-y-auto divide-y divide-gray-100 text-xs">
                          {slots.map(s => (
                            <li
                              key={s.start_time}
                              className="py-1.5 flex items-center justify-between"
                            >
                              <span className="font-mono text-gray-700">
                                {formatTime(s.start_time)} – {formatTime(s.end_time)}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                  s.available
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {s.available ? 'Open' : 'Booked'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-500">
                          No slots generated for this date — add an availability block first.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Click any day on the calendar to preview the generated slots.
                    </p>
                  )}
                </div>

                {/* Blackout adder */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ban className="w-4 h-4 text-red-500" />
                    <h2 className="text-sm font-bold text-black">Add blackout date</h2>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={blackoutDate}
                      onChange={e => setBlackoutDate(e.target.value)}
                      className="w-full text-sm text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      placeholder="Note (optional)"
                      value={blackoutNote}
                      onChange={e => setBlackoutNote(e.target.value)}
                      className="w-full text-sm text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                    />
                    <button
                      onClick={handleAddBlackout}
                      disabled={addingBlackout || !blackoutDate}
                      className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {addingBlackout ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      Add blackout
                    </button>
                  </div>
                </div>

                {/* Buffer settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Save className="w-4 h-4 text-gray-500" />
                    <h2 className="text-sm font-bold text-black">Buffer times</h2>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Minimum gap (in minutes) before and after each booking. Stored in{' '}
                    <code className="font-mono text-[10px] bg-gray-100 px-1 rounded">
                      metadata.buffer_before/after
                    </code>
                    .
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <label className="block">
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                        Before
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={240}
                        value={bufferBefore}
                        onChange={e => setBufferBefore(Math.max(0, Number(e.target.value)))}
                        className="w-full text-sm text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                        After
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={240}
                        value={bufferAfter}
                        onChange={e => setBufferAfter(Math.max(0, Number(e.target.value)))}
                        className="w-full text-sm text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                      />
                    </label>
                  </div>
                  <button
                    onClick={handleSaveBuffers}
                    disabled={savingBuffer}
                    className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {savingBuffer ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save buffers
                  </button>
                </div>

                {/* Existing blocks list */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h2 className="text-sm font-bold text-black mb-2">
                    Existing blocks ({blocks.length})
                  </h2>
                  {blocks.length === 0 ? (
                    <p className="text-xs text-gray-500">No blocks yet. Add a blackout or create availability via the API.</p>
                  ) : (
                    <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100 text-xs">
                      {blocks.map(b => (
                        <li key={b.id} className="py-2 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-mono text-gray-700 truncate">
                              {new Date(b.start_time).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                              {' → '}
                              {new Date(b.end_time).toLocaleString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <p className={`text-[10px] font-bold uppercase ${
                              b.is_available ? 'text-emerald-700' : 'text-red-700'
                            }`}>
                              {b.is_available ? 'Available' : 'Blackout'}
                              {b.total_capacity != null && b.is_available
                                ? ` · ${b.total_capacity - (b.reserved_capacity ?? 0)} free`
                                : ''}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveBlock(b.id)}
                            className="text-[10px] font-bold text-red-700 hover:underline"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {vendorId && (
            <p className="text-xs text-gray-400 mt-6 text-center">
              Showing <span className="font-mono">availability_blocks</span> for{' '}
              <span className="font-mono">item_id = {selectedItemId ?? '(none)'}</span>. Slot
              preview via <span className="font-mono">/api/inventory/[id]/slots</span> (calls{' '}
              <span className="font-mono">getSlots</span> from{' '}
              <span className="font-mono">shared/slots.ts</span>).
              {availableBlocks.length > 0 && ` · ${availableBlocks.length} available, ${blackoutBlocks.length} blackout.`}
            </p>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
