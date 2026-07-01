'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import {
  calculateTicketPriority,
  type TicketCategory,
  type TicketPriority,
} from '@planviry/shared/rbac-client'
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Ticket as TicketIcon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CircleDot,
  Ban,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED'

const TICKET_STATUSES: TicketStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'BLOCKED',
  'COMPLETED',
  'CANCELLED',
]

const TICKET_CATEGORIES: TicketCategory[] = [
  'RESERVATION',
  'BILLING',
  'TECHNICAL',
  'FEEDBACK',
  'OTHER',
]

interface ServiceTicketRow {
  id: string
  vendor_id: string
  title: string
  description: string | null
  status: TicketStatus
  assigned_to: string | null
  created_at: string
  updated_at: string | null
  reservation_id: string | null
  metadata: Record<string, unknown> | null
}

interface StaffRow {
  user_id: string
  role: string
  user_profiles: { display_name: string | null } | { display_name: string | null }[] | null
}

// ─── Display helpers ────────────────────────────────────────────────────────

const PRIORITY_BADGE: Record<TicketPriority, string> = {
  URGENT: 'bg-red-100 text-red-800 border-red-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  NORMAL: 'bg-sky-100 text-sky-800 border-sky-200',
  LOW: 'bg-gray-100 text-gray-700 border-gray-200',
}

const PRIORITY_ICON: Record<TicketPriority, typeof AlertTriangle> = {
  URGENT: AlertTriangle,
  HIGH: AlertTriangle,
  NORMAL: Clock,
  LOW: CircleDot,
}

const STATUS_BADGE: Record<TicketStatus, string> = {
  OPEN: 'bg-sky-100 text-sky-800 border-sky-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-800 border-amber-200',
  BLOCKED: 'bg-red-100 text-red-800 border-red-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  CANCELLED: 'bg-gray-100 text-gray-700 border-gray-200',
}

const STATUS_ICON: Record<TicketStatus, typeof CheckCircle2> = {
  OPEN: CircleDot,
  IN_PROGRESS: Clock,
  BLOCKED: Ban,
  COMPLETED: CheckCircle2,
  CANCELLED: Ban,
}

function readCategory(metadata: Record<string, unknown> | null): TicketCategory {
  const v = metadata?.category
  if (typeof v === 'string' && TICKET_CATEGORIES.includes(v as TicketCategory)) {
    return v as TicketCategory
  }
  return 'OTHER'
}

function readIsUrgent(metadata: Record<string, unknown> | null): boolean {
  return Boolean(metadata?.is_urgent)
}

function readManualPriority(metadata: Record<string, unknown> | null): TicketPriority | null {
  const v = metadata?.manual_priority
  if (
    typeof v === 'string' &&
    ['URGENT', 'HIGH', 'NORMAL', 'LOW'].includes(v)
  ) {
    return v as TicketPriority
  }
  return null
}

function profileName(profile: StaffRow['user_profiles']): string | null {
  if (!profile) return null
  if (Array.isArray(profile)) {
    return profile[0]?.display_name ?? null
  }
  return profile.display_name ?? null
}

function formatRelative(iso: string): string {
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const hours = diffMs / (1000 * 60 * 60)
  if (hours < 1) return `${Math.max(1, Math.round(diffMs / 60000))}m ago`
  if (hours < 24) return `${Math.round(hours)}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString()
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function VendorTicketsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<ServiceTicketRow[]>([])
  const [staff, setStaff] = useState<StaffRow[]>([])
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState<Record<string, boolean>>({})
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'OPEN_ONLY' | 'ALL'>('OPEN_ONLY')
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?returnTo=/vendor/tickets'); return }
    const { data: staffRow, error: staffErr } = await supabase
      .from('vendor_staff')
      .select('vendor_id')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .maybeSingle()
    if (staffErr || !staffRow) { router.push('/onboarding/vendor'); return }
    setVendorId(staffRow.vendor_id)

    const [ticketsRes, staffRes] = await Promise.all([
      supabase
        .from('service_tickets')
        .select('id, vendor_id, title, description, status, assigned_to, created_at, updated_at, reservation_id, metadata')
        .eq('vendor_id', staffRow.vendor_id)
        .order('created_at', { ascending: false }),
      supabase
        .from('vendor_staff')
        .select('user_id, role, user_profiles(display_name)')
        .eq('vendor_id', staffRow.vendor_id)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: true }),
    ])

    if (ticketsRes.error) setError(ticketsRes.error.message)
    setTickets((ticketsRes.data as ServiceTicketRow[] | null) ?? [])
    setStaff((staffRes.data as StaffRow[] | null) ?? [])
    setLoading(false)
  }, [router, supabase])

  useEffect(() => {
    load()
  }, [load])

  // Compute priority for each ticket using the shared calculateTicketPriority
  // helper (Peppermint pattern — see shared/rbac-client.ts).
  const computed = useMemo(
    () =>
      tickets.map(t => {
        const category = readCategory(t.metadata)
        const isUrgent = readIsUrgent(t.metadata)
        const manual = readManualPriority(t.metadata)
        const calc = calculateTicketPriority(new Date(t.created_at), category, isUrgent)
        // Manual override wins when set; otherwise we use the calculated value.
        const priority = manual ?? calc.priority
        return { ticket: t, category, isUrgent, manual, calc, priority }
      }),
    [tickets],
  )

  const visible = useMemo(() => {
    return computed
      .filter(row => {
        if (statusFilter === 'ALL') return true
        if (statusFilter === 'OPEN_ONLY') {
          return row.ticket.status === 'OPEN' || row.ticket.status === 'IN_PROGRESS' || row.ticket.status === 'BLOCKED'
        }
        return row.ticket.status === statusFilter
      })
      .filter(row => priorityFilter === 'ALL' || row.priority === priorityFilter)
      .sort((a, b) => {
        // Sort by priority score (desc), then by age (desc)
        const prioOrder: Record<TicketPriority, number> = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 }
        const cmp = prioOrder[a.priority] - prioOrder[b.priority]
        if (cmp !== 0) return cmp
        return new Date(a.ticket.created_at).getTime() - new Date(b.ticket.created_at).getTime()
      })
  }, [computed, statusFilter, priorityFilter])

  const updateTicket = async (
    id: string,
    patch: Partial<ServiceTicketRow>,
    metadataPatch: Record<string, unknown>,
  ) => {
    setUpdating(prev => ({ ...prev, [id]: true }))
    setError('')
    try {
      const target = tickets.find(t => t.id === id)
      const mergedMetadata = { ...(target?.metadata ?? {}), ...metadataPatch }
      const { error: updateErr } = await supabase
        .from('service_tickets')
        .update({ ...patch, metadata: mergedMetadata, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (updateErr) throw updateErr

      setTickets(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, ...patch, metadata: mergedMetadata, updated_at: new Date().toISOString() }
            : t,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket')
    } finally {
      setUpdating(prev => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <Link
                href="/vendor/dashboard"
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-2"
              >
                <ArrowLeft className="w-4 h-4" /> Dashboard
              </Link>
              <h1 className="text-2xl font-black text-black flex items-center gap-2">
                <TicketIcon className="w-6 h-6 text-gray-500" /> Service Ticket Triage Queue
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Operational tasks for your vendor account. Priority is computed by{' '}
                <code className="font-mono text-xs bg-gray-100 px-1 rounded">calculateTicketPriority</code>{' '}
                (Peppermint pattern).
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

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
                className="text-sm font-semibold text-black bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-black"
              >
                <option value="OPEN_ONLY">Open / In Progress / Blocked</option>
                <option value="ALL">All statuses</option>
                {TICKET_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Priority</span>
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value as typeof priorityFilter)}
                className="text-sm font-semibold text-black bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-black"
              >
                <option value="ALL">All priorities</option>
                <option value="URGENT">URGENT</option>
                <option value="HIGH">HIGH</option>
                <option value="NORMAL">NORMAL</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <div className="ml-auto text-xs text-gray-500">
              {visible.length} of {tickets.length} tickets
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <TicketIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No service tickets for your vendor account.</p>
              <p className="text-xs text-gray-400 mt-2">
                New tickets appear here when guests submit support requests or inquiries.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map(({ ticket, category, isUrgent, manual, calc, priority }) => {
                const PrioIcon = PRIORITY_ICON[priority]
                const StatusIcon = STATUS_ICON[ticket.status]
                const isUpdating = updating[ticket.id]
                const assignedStaff = staff.find(s => s.user_id === ticket.assigned_to)
                return (
                  <div
                    key={ticket.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${PRIORITY_BADGE[priority]}`}
                          >
                            <PrioIcon className="w-3 h-3" /> {priority}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${STATUS_BADGE[ticket.status]}`}
                          >
                            <StatusIcon className="w-3 h-3" /> {ticket.status}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono uppercase">
                            {category}
                          </span>
                          {isUrgent && (
                            <span className="text-[10px] font-bold uppercase text-red-700">Urgent flag</span>
                          )}
                          {manual && (
                            <span className="text-[10px] font-bold uppercase text-amber-700">
                              Manual override
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-black text-sm mt-2">{ticket.title}</h3>
                        {ticket.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ticket.description}</p>
                        )}
                        <p className="text-[11px] text-gray-400 mt-2">
                          Created {formatRelative(ticket.created_at)}
                          {ticket.updated_at ? ` · updated ${formatRelative(ticket.updated_at)}` : ''}
                          {ticket.reservation_id ? ` · reservation ${ticket.reservation_id.slice(0, 8)}` : ''}
                          {' · calculated score '}
                          <span className="font-mono">{calc.score}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* Assignee */}
                      <label className="block">
                        <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                          Assigned to
                        </span>
                        <div className="relative">
                          <select
                            value={ticket.assigned_to ?? ''}
                            disabled={isUpdating}
                            onChange={e =>
                              updateTicket(
                                ticket.id,
                                { assigned_to: e.target.value || null },
                                {},
                              )
                            }
                            className="w-full text-xs font-semibold text-black bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 pr-7 focus:outline-none focus:border-black disabled:opacity-50"
                          >
                            <option value="">Unassigned</option>
                            {staff.map(s => (
                              <option key={s.user_id} value={s.user_id}>
                                {profileName(s.user_profiles) ?? s.user_id.slice(0, 8)} ({s.role})
                              </option>
                            ))}
                          </select>
                          {isUpdating && (
                            <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin text-gray-400" />
                          )}
                        </div>
                        {assignedStaff && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            {profileName(assignedStaff.user_profiles) ?? 'Unnamed'} · {assignedStaff.role}
                          </p>
                        )}
                      </label>

                      {/* Priority override */}
                      <label className="block">
                        <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                          Priority (override)
                        </span>
                        <select
                          value={manual ?? ''}
                          disabled={isUpdating}
                          onChange={e =>
                            updateTicket(
                              ticket.id,
                              {},
                              {
                                manual_priority: e.target.value || null,
                              },
                            )
                          }
                          className="w-full text-xs font-semibold text-black bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-black disabled:opacity-50"
                        >
                          <option value="">Auto ({calc.priority})</option>
                          <option value="URGENT">URGENT</option>
                          <option value="HIGH">HIGH</option>
                          <option value="NORMAL">NORMAL</option>
                          <option value="LOW">LOW</option>
                        </select>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Calculated: <span className="font-mono">{calc.priority}</span>
                        </p>
                      </label>

                      {/* Status */}
                      <label className="block">
                        <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                          Status
                        </span>
                        <select
                          value={ticket.status}
                          disabled={isUpdating}
                          onChange={e =>
                            updateTicket(
                              ticket.id,
                              { status: e.target.value as TicketStatus },
                              {},
                            )
                          }
                          className="w-full text-xs font-semibold text-black bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-black disabled:opacity-50"
                        >
                          {TICKET_STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    {/* Category / Urgent flag toggles */}
                    <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-gray-100">
                      <label className="flex items-center gap-1.5 text-[11px] text-gray-600">
                        <span className="font-bold uppercase tracking-wide text-gray-400">Category</span>
                        <select
                          value={category}
                          disabled={isUpdating}
                          onChange={e =>
                            updateTicket(ticket.id, {}, { category: e.target.value as TicketCategory })
                          }
                          className="text-xs font-semibold text-black bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-black disabled:opacity-50"
                        >
                          {TICKET_CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </label>
                      <label className="flex items-center gap-1.5 text-[11px] text-gray-600">
                        <input
                          type="checkbox"
                          checked={isUrgent}
                          disabled={isUpdating}
                          onChange={e =>
                            updateTicket(ticket.id, {}, { is_urgent: e.target.checked })
                          }
                          className="w-3.5 h-3.5"
                        />
                        <span className="font-bold uppercase tracking-wide text-gray-400">Urgent flag</span>
                      </label>
                    </div>
                  </div>
                )
              })}
              {visible.length === 0 && (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                  No tickets match the current filters.
                </div>
              )}
            </div>
          )}

          {vendorId && (
            <p className="text-xs text-gray-400 mt-6 text-center">
              Showing <span className="font-mono">service_tickets</span> where{' '}
              <span className="font-mono">vendor_id = {vendorId}</span>. Priority via{' '}
              <span className="font-mono">@planviry/shared/rbac-client → calculateTicketPriority</span>.
            </p>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
