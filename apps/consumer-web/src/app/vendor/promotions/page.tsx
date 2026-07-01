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
  Tag,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

type DiscountType = 'PERCENTAGE' | 'FIXED'
type DiscountStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'ARCHIVED'

interface DiscountRow {
  id: string
  vendor_id: string | null
  code: string
  discount_type: DiscountType
  discount_value: number
  max_uses: number | null
  uses: number | null
  status: DiscountStatus
  expires_at: string | null
  created_at: string | null
  updated_at: string | null
  metadata: Record<string, unknown> | null
}

interface DiscountForm {
  code: string
  discount_type: DiscountType
  discount_value: number
  max_uses: number | null
  expires_at: string
  status: DiscountStatus
}

const DISCOUNT_TYPES: DiscountType[] = ['PERCENTAGE', 'FIXED']
const DISCOUNT_STATUSES: DiscountStatus[] = ['ACTIVE', 'PAUSED', 'EXPIRED', 'ARCHIVED']

const STATUS_BADGE: Record<DiscountStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PAUSED: 'bg-amber-100 text-amber-800 border-amber-200',
  EXPIRED: 'bg-gray-100 text-gray-700 border-gray-200',
  ARCHIVED: 'bg-red-100 text-red-800 border-red-200',
}

const EMPTY_FORM: DiscountForm = {
  code: '',
  discount_type: 'PERCENTAGE',
  discount_value: 10,
  max_uses: null,
  expires_at: '',
  status: 'ACTIVE',
}

function formatDiscount(d: DiscountRow): string {
  if (d.discount_type === 'PERCENTAGE') return `${d.discount_value}%`
  return `$${(d.discount_value / 100).toFixed(2)}`
}

function formatExpires(iso: string | null): string {
  if (!iso) return 'Never'
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return '—'
  }
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function VendorPromotionsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [discounts, setDiscounts] = useState<DiscountRow[]>([])
  const [error, setError] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<DiscountForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?returnTo=/vendor/promotions'); return }
    const { data: staffRow, error: staffErr } = await supabase
      .from('vendor_staff')
      .select('vendor_id')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .maybeSingle()
    if (staffErr || !staffRow) { router.push('/onboarding/vendor'); return }
    setVendorId(staffRow.vendor_id)

    const { data, error: discErr } = await supabase
      .from('discounts')
      .select('id, vendor_id, code, discount_type, discount_value, max_uses, uses, status, expires_at, created_at, updated_at, metadata')
      .eq('vendor_id', staffRow.vendor_id)
      .order('created_at', { ascending: false })

    if (discErr) setError(discErr.message)
    setDiscounts((data as DiscountRow[] | null) ?? [])
    setLoading(false)
  }, [router, supabase])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
    setEditorOpen(true)
  }

  const openEdit = (d: DiscountRow) => {
    setEditingId(d.id)
    setForm({
      code: d.code,
      discount_type: d.discount_type,
      discount_value: d.discount_value,
      max_uses: d.max_uses ?? null,
      expires_at: d.expires_at ? d.expires_at.slice(0, 10) : '',
      status: d.status,
    })
    setError('')
    setEditorOpen(true)
  }

  const handleSave = async () => {
    if (!vendorId) return
    if (!form.code.trim()) {
      setError('Code is required')
      return
    }
    if (form.discount_type === 'PERCENTAGE' && (form.discount_value < 0 || form.discount_value > 100)) {
      setError('Percentage must be between 0 and 100')
      return
    }
    if (form.discount_type === 'FIXED' && form.discount_value <= 0) {
      setError('Fixed discount must be greater than 0 (enter value in cents)')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload: Record<string, unknown> = {
        vendor_id: vendorId,
        code: form.code.toUpperCase().trim(),
        discount_type: form.discount_type,
        discount_value: form.discount_value,
        max_uses: form.max_uses,
        expires_at: form.expires_at ? new Date(form.expires_at + 'T23:59:59').toISOString() : null,
        status: form.status,
        updated_at: new Date().toISOString(),
      }

      if (editingId) {
        // Update existing row (don't reset uses)
        const { error: updateErr } = await supabase
          .from('discounts')
          .update(payload)
          .eq('id', editingId)
        if (updateErr) throw updateErr
      } else {
        // Insert new row
        payload.uses = 0
        payload.created_at = new Date().toISOString()
        const { error: insertErr } = await supabase.from('discounts').insert(payload)
        if (insertErr) throw insertErr
      }

      setEditorOpen(false)
      setForm(EMPTY_FORM)
      setEditingId(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save discount')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discount? This cannot be undone.')) return
    setBusyId(id)
    setError('')
    try {
      const { error: deleteErr } = await supabase.from('discounts').delete().eq('id', id)
      if (deleteErr) throw deleteErr
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete discount')
    } finally {
      setBusyId(null)
    }
  }

  const handleToggleStatus = async (d: DiscountRow) => {
    const next: DiscountStatus = d.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    setBusyId(d.id)
    setError('')
    try {
      const { error: updateErr } = await supabase
        .from('discounts')
        .update({ status: next, updated_at: new Date().toISOString() })
        .eq('id', d.id)
      if (updateErr) throw updateErr
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle status')
    } finally {
      setBusyId(null)
    }
  }

  const summary = useMemo(() => {
    const active = discounts.filter(d => d.status === 'ACTIVE').length
    const totalUses = discounts.reduce((sum, d) => sum + (d.uses ?? 0), 0)
    return { total: discounts.length, active, totalUses }
  }, [discounts])

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
                <Tag className="w-6 h-6 text-gray-500" /> Promotions &amp; Discounts
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage promo codes for your vendor account. Applied at checkout via{' '}
                <code className="font-mono text-xs bg-gray-100 px-1 rounded">/api/checkout</code>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={load}
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" /> New Discount
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total codes</p>
              <p className="text-3xl font-black text-black mt-1">{summary.total}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Active</p>
              <p className="text-3xl font-black text-emerald-700 mt-1">{summary.active}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total uses</p>
              <p className="text-3xl font-black text-black mt-1">{summary.totalUses}</p>
            </div>
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
          ) : discounts.length === 0 && !editorOpen ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No discount codes yet.</p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" /> Create your first discount
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <div className="col-span-2">Code</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-1">Value</div>
                <div className="col-span-2">Usage</div>
                <div className="col-span-2">Expires</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              <ul className="divide-y divide-gray-100">
                {discounts.map(d => {
                  const isBusy = busyId === d.id
                  const uses = d.uses ?? 0
                  const max = d.max_uses
                  return (
                    <li
                      key={d.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-gray-50/50"
                    >
                      <div className="md:col-span-2">
                        <p className="font-mono font-bold text-black text-sm">{d.code}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-xs text-gray-700">{d.discount_type}</span>
                      </div>
                      <div className="md:col-span-1">
                        <span className="text-sm font-bold text-black">{formatDiscount(d)}</span>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-700">
                          <span className="font-bold">{uses}</span>
                          {max != null ? ` / ${max}` : ' / ∞'}
                        </p>
                        <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-black"
                            style={{
                              width: max != null ? `${Math.min(100, (uses / max) * 100)}%` : '0%',
                            }}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-xs text-gray-700">{formatExpires(d.expires_at)}</span>
                      </div>
                      <div className="md:col-span-1">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${STATUS_BADGE[d.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}
                        >
                          {d.status}
                        </span>
                      </div>
                      <div className="md:col-span-2 flex items-center gap-1 md:justify-end flex-wrap">
                        <button
                          onClick={() => openEdit(d)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 border border-gray-200 px-2 py-1.5 rounded hover:bg-gray-50"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(d)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1.5 rounded hover:bg-gray-200 disabled:opacity-50"
                          title={d.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                        >
                          {isBusy ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : d.status === 'ACTIVE' ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                          {d.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-700 border border-red-200 px-2 py-1.5 rounded hover:bg-red-50 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Inline editor modal */}
          {editorOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center p-4"
              onClick={() => setEditorOpen(false)}
            >
              <div
                className="bg-white w-full max-w-lg rounded-xl shadow-2xl mt-8"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <h2 className="text-base font-bold text-black">
                    {editingId ? 'Edit discount' : 'Create discount'}
                  </h2>
                  <button
                    onClick={() => setEditorOpen(false)}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <label className="block">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                      Code
                    </span>
                    <input
                      type="text"
                      value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      placeholder="SUMMER25"
                      className="w-full font-mono text-sm text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                        Type
                      </span>
                      <select
                        value={form.discount_type}
                        onChange={e =>
                          setForm({ ...form, discount_type: e.target.value as DiscountType })
                        }
                        className="w-full text-sm font-semibold text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                      >
                        {DISCOUNT_TYPES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                        Value{' '}
                        {form.discount_type === 'PERCENTAGE' ? '(%)' : '(cents)'}
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={form.discount_value}
                        onChange={e =>
                          setForm({ ...form, discount_value: Number(e.target.value) })
                        }
                        className="w-full text-sm text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                        Max uses (blank = unlimited)
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={form.max_uses ?? ''}
                        onChange={e =>
                          setForm({
                            ...form,
                            max_uses: e.target.value === '' ? null : Number(e.target.value),
                          })
                        }
                        placeholder="∞"
                        className="w-full text-sm text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                        Expires at (blank = never)
                      </span>
                      <input
                        type="date"
                        value={form.expires_at}
                        onChange={e => setForm({ ...form, expires_at: e.target.value })}
                        className="w-full text-sm text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                      Status
                    </span>
                    <select
                      value={form.status}
                      onChange={e =>
                        setForm({ ...form, status: e.target.value as DiscountStatus })
                      }
                      className="w-full text-sm font-semibold text-black bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                    >
                      {DISCOUNT_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50">
                  <button
                    onClick={() => setEditorOpen(false)}
                    className="text-sm font-bold text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {editingId ? 'Save changes' : 'Create discount'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {vendorId && (
            <p className="text-xs text-gray-400 mt-6 text-center">
              Showing <span className="font-mono">discounts</span> where{' '}
              <span className="font-mono">vendor_id = {vendorId}</span>.
            </p>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
