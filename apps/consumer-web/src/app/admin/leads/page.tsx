'use client'
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight, Home, Search, Filter, Send, CheckCircle2, Clock,
  Mail, Phone, MapPin, Building2, Users, TrendingUp, Loader2,
  ChevronLeft, X, MoreVertical,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Lead {
  id: string
  overture_id: string | null
  business_name: string
  category_primary: string | null
  categories_alternate: string[]
  address_freeform: string | null
  city: string | null
  state: string | null
  zip: string | null
  phone: string | null
  email: string | null
  website: string | null
  invite_status: string
  invite_sent_at: string | null
  invite_count: number
  invite_method: string | null
  invite_notes: string | null
  operating_status: string | null
  confidence: number | null
  quality_score: number
  created_at: string
}

interface LeadStats {
  total_leads: number
  new_leads: number
  queued_leads: number
  invited_leads: number
  opened_leads: number
  claimed_leads: number
  rejected_leads: number
  bounced_leads: number
  unsubscribed_leads: number
  total_invited: number
  total_converted: number
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: 'New', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Clock },
  queued: { label: 'Queued', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  invited: { label: 'Invited', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Send },
  opened: { label: 'Opened', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Mail },
  claimed: { label: 'Claimed', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200', icon: X },
  bounced: { label: 'Bounced', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: X },
  unsubscribed: { label: 'Unsubscribed', color: 'bg-gray-100 text-gray-500 border-gray-200', icon: X },
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [stateFilter, setStateFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  // Available filter options
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [inviting, setInviting] = useState(false)
  const [inviteNotes, setInviteNotes] = useState('')

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400)
    return () => clearTimeout(t)
  }, [searchQuery])

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', '50')
      if (statusFilter) params.set('status', statusFilter)
      if (stateFilter) params.set('state', stateFilter)
      if (categoryFilter) params.set('category', categoryFilter)
      if (debouncedSearch) params.set('q', debouncedSearch)

      const res = await fetch(`/api/admin/leads?${params}`)
      if (!res.ok) throw new Error('Failed to fetch leads')
      const data = await res.json()

      setLeads(data.leads || [])
      setStats(data.stats || null)
      setTotal(data.pagination?.total || 0)
      setTotalPages(data.pagination?.totalPages || 1)
      setAvailableStates(data.filters?.states || [])
      setAvailableCategories(data.filters?.categories || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, stateFilter, categoryFilter, debouncedSearch])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [statusFilter, stateFilter, categoryFilter, debouncedSearch])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)))
    }
  }

  const sendInvites = async () => {
    if (selectedIds.size === 0) return
    setInviting(true)
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite',
          leadIds: Array.from(selectedIds),
          method: 'email',
          notes: inviteNotes,
        }),
      })
      if (!res.ok) throw new Error('Failed to send invites')
      const data = await res.json()
      // Refresh
      fetchLeads()
      setSelectedIds(new Set())
      setInviteNotes('')
      alert(`Invited ${data.invited} leads`)
    } catch (e: any) {
      alert('Error: ' + e.message)
    } finally {
      setInviting(false)
    }
  }

  const clearFilters = () => {
    setStatusFilter('')
    setStateFilter('')
    setCategoryFilter('')
    setSearchQuery('')
  }

  const activeFilterCount = [statusFilter, stateFilter, categoryFilter, debouncedSearch].filter(Boolean).length

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-black flex items-center gap-1"><Home size={13} /> Home</Link>
            <ChevronRight size={13} className="text-gray-400" />
            <Link href="/admin" className="hover:text-black">Admin</Link>
            <ChevronRight size={13} className="text-gray-400" />
            <span className="text-black font-medium">Leads</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-black tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-coral" />
            Lead Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and invite vacation rental properties, hotels, and businesses to list on Planviry.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <StatCard label="Total Leads" value={stats.total_leads} icon={Users} color="text-black" />
            <StatCard label="New" value={stats.new_leads} icon={Clock} color="text-gray-600" />
            <StatCard label="Invited" value={stats.invited_leads} icon={Send} color="text-blue-600" />
            <StatCard label="Opened" value={stats.opened_leads} icon={Mail} color="text-purple-600" />
            <StatCard label="Claimed" value={stats.claimed_leads} icon={CheckCircle2} color="text-green-600" />
          </div>
        )}

        {/* Filters Bar */}
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search business name, city, state..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black bg-white"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            {/* State filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black bg-white"
            >
              <option value="">All States</option>
              {availableStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-black bg-white"
            >
              <option value="">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-xs font-bold text-red-500 hover:underline uppercase tracking-wider"
              >
                Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Selection + Invite Bar */}
        {selectedIds.size > 0 && (
          <div className="sticky top-0 z-10 mb-4 bg-black text-white rounded-xl p-4 flex items-center gap-3 flex-wrap shadow-lg">
            <span className="text-sm font-bold">
              {selectedIds.size} lead{selectedIds.size !== 1 ? 's' : ''} selected
            </span>
            <input
              type="text"
              value={inviteNotes}
              onChange={(e) => setInviteNotes(e.target.value)}
              placeholder="Optional invite note..."
              className="flex-1 min-w-[200px] px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white"
            />
            <Button
              onClick={sendInvites}
              disabled={inviting}
              className="bg-white text-black hover:bg-gray-200 font-bold text-sm"
            >
              {inviting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Sending...</>
              ) : (
                <><Send className="w-4 h-4 mr-1" /> Send Invites</>
              )}
            </Button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-white/70 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Results count + select all */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={leads.length > 0 && selectedIds.size === leads.length}
              onCheckedChange={selectAll}
            />
            <span className="text-sm font-black text-black uppercase tracking-wider">
              {total.toLocaleString()} Leads
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Leads Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-coral" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300 rounded-xl">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 font-medium">No leads found</p>
            <p className="text-xs text-gray-400 mt-1">
              Run the import script to populate leads from Algolia.
            </p>
            <div className="mt-4 bg-gray-50 rounded-lg p-3 max-w-md mx-auto text-left">
              <code className="text-xs text-gray-600">
                bun run scripts/import-leads-from-algolia.ts
              </code>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {leads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                selected={selectedIds.has(lead.id)}
                onToggle={() => toggleSelect(lead.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-30 hover:border-black transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 px-4">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-30 hover:border-black transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-2xl font-black text-black">{value.toLocaleString()}</p>
    </div>
  )
}

// ── Lead Row ──────────────────────────────────────────────────────────────────
function LeadRow({ lead, selected, onToggle }: { lead: Lead; selected: boolean; onToggle: () => void }) {
  const statusCfg = STATUS_CONFIG[lead.invite_status] || STATUS_CONFIG.new
  const StatusIcon = statusCfg.icon

  return <AppLayoutShell>
    <div
      className={`flex items-start gap-3 p-4 border rounded-xl transition-all ${
        selected ? 'border-coral bg-coral/5' : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <Checkbox checked={selected} onCheckedChange={onToggle} className="mt-1" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-black truncate">{lead.business_name}</h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {lead.category_primary && (
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                  {lead.category_primary}
                </Badge>
              )}
              <Badge className={`text-[10px] font-bold uppercase tracking-wider border ${statusCfg.color}`}>
                <StatusIcon className="w-2.5 h-2.5 mr-1" />
                {statusCfg.label}
              </Badge>
              {lead.invite_count > 0 && (
                <span className="text-[10px] text-gray-400">
                  Invited {lead.invite_count}x
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-gray-500">
          {lead.city && lead.state && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {lead.city}, {lead.state} {lead.zip}
            </span>
          )}
          {lead.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {lead.phone}
            </span>
          )}
          {lead.website && (
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-coral truncate max-w-[200px]"
              onClick={(e) => e.stopPropagation()}
            >
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>

        {lead.categories_alternate && lead.categories_alternate.length > 0 && (
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {lead.categories_alternate.slice(0, 5).map((cat, i) => (
              <span key={i} className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="text-right shrink-0">
        {lead.confidence != null && (
          <>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">
              Quality
            </div>
            <div className="text-sm font-bold text-black">
              {Math.round(lead.confidence * 100)}%
            </div>
          </>
        )}
      </div>
    </div>
  </AppLayoutShell>

}
