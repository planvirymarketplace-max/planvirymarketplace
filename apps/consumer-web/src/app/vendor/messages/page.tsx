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
  Mail,
  Inbox,
  AlertCircle,
  Send,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface NotificationRow {
  id: string
  user_id: string
  notification_type: string
  channel: string | null
  priority: string | null
  subject: string | null
  body: string | null
  data_payload: Record<string, unknown> | null
  status: string | null
  created_at: string
  read_at: string | null
}

interface Conversation {
  key: string
  eventId: string | null
  eventTitle: string | null
  senderId: string | null
  senderName: string | null
  messages: NotificationRow[]
  lastAt: string
  unreadCount: number
}

interface InventoryRow {
  id: string
  title: string
  slug: string | null
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function readEventId(payload: Record<string, unknown> | null): string | null {
  const v = payload?.event_id
  return typeof v === 'string' ? v : null
}

function readEventTitle(payload: Record<string, unknown> | null): string | null {
  const v = payload?.event_title
  return typeof v === 'string' && v.length > 0 ? v : null
}

function readSenderId(payload: Record<string, unknown> | null): string | null {
  const v = payload?.sender_id
  return typeof v === 'string' ? v : null
}

function readRecipientName(payload: Record<string, unknown> | null): string | null {
  const v = payload?.recipient_name
  return typeof v === 'string' && v.length > 0 ? v : null
}

function formatRelative(iso: string): string {
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString()
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function VendorMessagesPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [inventory, setInventory] = useState<InventoryRow[]>([])
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [replySubject, setReplySubject] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [replyFilter, setReplyFilter] = useState<'all' | 'confirmed' | 'checked_in'>('all')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login?returnTo=/vendor/messages'); return }
    const { data: staffRow, error: staffErr } = await supabase
      .from('vendor_staff')
      .select('vendor_id')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .maybeSingle()
    if (staffErr || !staffRow) { router.push('/onboarding/vendor'); return }
    setVendorId(staffRow.vendor_id)

    // ─── Load the vendor's inbox: notifications of type organizer_message* ─
    // The messages/send endpoint writes one row per recipient with
    // notification_type = 'organizer_message' (and could be extended to
    // 'organizer_message.reply', 'organizer_message.broadcast', …).
    const [notifRes, invRes] = await Promise.all([
      supabase
        .from('notifications')
        .select('id, user_id, notification_type, channel, priority, subject, body, data_payload, status, created_at, read_at')
        .eq('user_id', user.id)
        .like('notification_type', 'organizer_message%')
        .order('created_at', { ascending: false }),
      supabase
        .from('inventory_items')
        .select('id, title, slug')
        .eq('vendor_id', staffRow.vendor_id)
        .eq('category', 'EVENT_TICKET')
        .order('title', { ascending: true }),
    ])

    if (notifRes.error) setError(notifRes.error.message)
    setNotifications((notifRes.data as NotificationRow[] | null) ?? [])
    setInventory((invRes.data as InventoryRow[] | null) ?? [])
    setLoading(false)
  }, [router, supabase])

  useEffect(() => {
    load()
  }, [load])

  // Group notifications into conversation threads. A "thread" is all
  // notifications tied to the same event_id (falling back to subject for
  // standalones without an event context).
  const conversations = useMemo<Conversation[]>(() => {
    const byKey = new Map<string, Conversation>()
    for (const n of notifications) {
      const eventId = readEventId(n.data_payload)
      const key = eventId ? `event:${eventId}` : `subject:${n.subject ?? n.id}`
      const existing = byKey.get(key)
      if (existing) {
        existing.messages.push(n)
        if (n.created_at > existing.lastAt) existing.lastAt = n.created_at
        if (!n.read_at) existing.unreadCount++
        if (!existing.eventTitle) {
          existing.eventTitle = readEventTitle(n.data_payload)
        }
      } else {
        byKey.set(key, {
          key,
          eventId,
          eventTitle: readEventTitle(n.data_payload),
          senderId: readSenderId(n.data_payload),
          senderName: readRecipientName(n.data_payload),
          messages: [n],
          lastAt: n.created_at,
          unreadCount: n.read_at ? 0 : 1,
        })
      }
    }
    return Array.from(byKey.values()).sort(
      (a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime(),
    )
  }, [notifications])

  const active = useMemo(
    () => conversations.find(c => c.key === activeKey) ?? null,
    [conversations, activeKey],
  )

  // Mark conversation as read when opened
  useEffect(() => {
    if (!active) return
    const unread = active.messages.filter(m => !m.read_at)
    if (unread.length === 0) return
    Promise.all(
      unread.map(m =>
        supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', m.id),
      ),
    ).then(() => load())
  }, [activeKey, active, supabase, load])

  const handleReply = async () => {
    if (!active || !active.eventId) {
      setError('No event associated with this thread — cannot reply.')
      return
    }
    if (!replySubject.trim() || !replyBody.trim()) {
      setError('Subject and body are required.')
      return
    }
    setSending(true)
    setError('')
    setSendResult(null)
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: active.eventId,
          subject: replySubject,
          body: replyBody,
          recipient_filter: replyFilter,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error?.message || data?.error || 'Failed to send reply')
      }
      setSendResult(`Sent to ${data?.notifications_created ?? 0} recipient(s).`)
      setReplySubject('')
      setReplyBody('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setSending(false)
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
                <Mail className="w-6 h-6 text-gray-500" /> Messages
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Conversations tied to your events. Replies are broadcast via{' '}
                <code className="font-mono text-xs bg-gray-100 px-1 rounded">/api/messages/send</code>.
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
          {sendResult && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 mb-4">
              {sendResult}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No messages yet.</p>
              <p className="text-xs text-gray-400 mt-2">
                When attendees reply to your event announcements, those messages land here as
                conversation threads.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Conversation list */}
              <aside className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {conversations.length} conversation{conversations.length === 1 ? '' : 's'}
                  </p>
                </div>
                <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {conversations.map(c => {
                    const isActive = c.key === activeKey
                    return (
                      <li key={c.key}>
                        <button
                          onClick={() => setActiveKey(c.key)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                            isActive ? 'bg-gray-100' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-black text-sm truncate">
                              {c.eventTitle ?? c.messages[0]?.subject ?? '(no subject)'}
                            </p>
                            {c.unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-black text-white text-[10px] font-bold">
                                {c.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {c.messages[0]?.subject ?? '—'}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {c.messages.length} message{c.messages.length === 1 ? '' : 's'} · {formatRelative(c.lastAt)}
                          </p>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </aside>

              {/* Active thread */}
              <section className="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col">
                {active ? (
                  <>
                    <header className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Thread
                      </p>
                      <h2 className="text-base font-bold text-black">
                        {active.eventTitle ?? active.messages[0]?.subject ?? '(no subject)'}
                      </h2>
                      {active.eventId && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Event ID: <span className="font-mono">{active.eventId}</span>
                          {active.senderName ? ` · from ${active.senderName}` : ''}
                        </p>
                      )}
                    </header>

                    <div className="flex-1 px-4 py-3 space-y-3 max-h-[400px] overflow-y-auto">
                      {active.messages
                        .slice()
                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                        .map(m => (
                          <article key={m.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-bold text-black">
                                {m.subject ?? '(no subject)'}
                              </p>
                              <span className="text-[10px] text-gray-400 font-mono uppercase">
                                {m.notification_type}
                              </span>
                            </div>
                            {m.body && (
                              <p className="text-xs text-gray-700 whitespace-pre-line">{m.body}</p>
                            )}
                            <p className="text-[10px] text-gray-400 mt-2">
                              {formatRelative(m.created_at)}
                              {m.channel ? ` · ${m.channel}` : ''}
                              {m.priority ? ` · ${m.priority}` : ''}
                            </p>
                          </article>
                        ))}
                    </div>

                    {/* Reply composer */}
                    <footer className="px-4 py-3 border-t border-gray-100 bg-gray-50 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Reply (broadcast to attendees)
                      </p>
                      <input
                        type="text"
                        placeholder="Subject"
                        value={replySubject}
                        onChange={e => setReplySubject(e.target.value)}
                        className="w-full text-sm text-black bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                      />
                      <textarea
                        placeholder="Type your reply…"
                        rows={3}
                        value={replyBody}
                        onChange={e => setReplyBody(e.target.value)}
                        className="w-full text-sm text-black bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black resize-y"
                      />
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <label className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="font-bold uppercase tracking-wide text-gray-400">Recipients</span>
                          <select
                            value={replyFilter}
                            onChange={e => setReplyFilter(e.target.value as typeof replyFilter)}
                            className="text-xs font-semibold text-black bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-black"
                          >
                            <option value="all">All attendees</option>
                            <option value="confirmed">Confirmed / completed</option>
                            <option value="checked_in">Checked-in</option>
                          </select>
                        </label>
                        <button
                          onClick={handleReply}
                          disabled={sending || !replySubject.trim() || !replyBody.trim()}
                          className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          Send reply
                        </button>
                      </div>
                      {!active.eventId && (
                        <p className="text-[11px] text-amber-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> This thread has no event context — reply is disabled.
                        </p>
                      )}
                    </footer>
                  </>
                ) : (
                  <div className="flex-1 p-8 text-center">
                    <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Select a conversation to view messages.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Inventory hint for events with no messages */}
          {!loading && conversations.length === 0 && inventory.length > 0 && (
            <p className="text-xs text-gray-400 mt-6 text-center">
              You have {inventory.length} ticketed event{inventory.length === 1 ? '' : 's'} ready
              to receive attendee replies.
            </p>
          )}

          {vendorId && (
            <p className="text-xs text-gray-400 mt-6 text-center">
              Showing <span className="font-mono">notifications</span> where{' '}
              <span className="font-mono">notification_type LIKE &lsquo;organizer_message%&rsquo;</span>{' '}
              for the current user. Replies go out via{' '}
              <span className="font-mono">/api/messages/send</span>.
            </p>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
