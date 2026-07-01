'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  Bell,
  CheckCheck,
  Clock,
  Loader2,
  Mail,
  Smartphone,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Notification } from './page'

// ─── Helpers ──────────────────────────────────────────────────────────────

function formatRelative(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatFull(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function ChannelIcon({ channel }: { channel: string | null }) {
  if (channel === 'EMAIL') return <Mail className="w-3.5 h-3.5" />
  if (channel === 'PUSH') return <Smartphone className="w-3.5 h-3.5" />
  if (channel === 'IN_APP') return <Bell className="w-3.5 h-3.5" />
  return <Bell className="w-3.5 h-3.5" />
}

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MEDIUM: 'bg-sky-100 text-sky-700 border-sky-200',
  LOW: 'bg-gray-100 text-gray-600 border-gray-200',
}

const STATUS_STYLES: Record<string, string> = {
  QUEUED: 'bg-gray-100 text-gray-600 border-gray-200',
  SENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  SENT: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  FAILED: 'bg-red-100 text-red-700 border-red-200',
}

// ─── Card ──────────────────────────────────────────────────────────────────

function NotificationCard({ notification }: { notification: Notification }) {
  const inApp = Array.isArray(notification.in_app_notifications)
    ? notification.in_app_notifications[0]
    : notification.in_app_notifications
  const isRead = Boolean(inApp?.is_read)
  const channel = notification.channel ?? 'IN_APP'
  const priority = notification.priority ?? 'MEDIUM'
  const status = notification.status ?? 'QUEUED'

  return (
    <Card
      className={`gap-3 py-4 hover:shadow-md transition-shadow ${
        isRead ? 'opacity-70' : 'border-l-4 border-l-black'
      }`}
    >
      <CardHeader className="gap-1.5 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.MEDIUM
              }`}
            >
              <ChannelIcon channel={channel} />
              {channel}
            </span>
            {!isRead && (
              <Badge
                variant="outline"
                className="text-[10px] uppercase bg-red-50 text-red-700 border-red-200"
              >
                Unread
              </Badge>
            )}
            {isRead && (
              <Badge
                variant="outline"
                className="text-[10px] uppercase bg-gray-50 text-gray-500 border-gray-200"
              >
                Read
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`text-[10px] uppercase ${
                STATUS_STYLES[status] ?? STATUS_STYLES.QUEUED
              }`}
            >
              {status}
            </Badge>
            {notification.notification_type && (
              <span className="text-[10px] text-gray-400 font-mono uppercase truncate">
                {notification.notification_type}
              </span>
            )}
          </div>
          <span
            className="text-[11px] text-gray-400 shrink-0"
            title={formatFull(notification.created_at)}
          >
            {formatRelative(notification.created_at)}
          </span>
        </div>
        <CardTitle className="text-sm font-bold text-black">
          {notification.subject ?? 'Notification'}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {notification.body && (
          <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4">
            {notification.body}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {notification.failed_at && (
            <span className="inline-flex items-center gap-1 text-[11px] text-red-600">
              <XCircle className="w-3 h-3" />
              Failed {formatRelative(notification.failed_at)}
            </span>
          )}
          {notification.sent_at && !notification.failed_at && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
              <Clock className="w-3 h-3" />
              Sent {formatRelative(notification.sent_at)}
            </span>
          )}
          {notification.cta_url && (
            <a
              href={notification.cta_url}
              className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-black border border-black px-3 py-1.5 rounded-lg hover:bg-black hover:text-white"
            >
              View
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── List ──────────────────────────────────────────────────────────────────

export function NotificationsList({
  notifications,
}: {
  notifications: Notification[]
}) {
  const router = useRouter()
  const [marking, setMarking] = useState(false)
  const unreadCount = notifications.filter((n) => {
    const inApp = Array.isArray(n.in_app_notifications)
      ? n.in_app_notifications[0]
      : n.in_app_notifications
    return !inApp?.is_read
  }).length

  const handleMarkAllRead = async () => {
    setMarking(true)
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || `Failed (${res.status})`)
      }
      const data = await res.json().catch(() => ({}))
      toast.success(
        data?.updated
          ? `Marked ${data.updated} notification${data.updated === 1 ? '' : 's'} as read`
          : 'All notifications marked as read',
      )
      router.refresh()
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Failed to mark notifications as read',
      )
    } finally {
      setMarking(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          Showing the {notifications.length} most recent notification
          {notifications.length === 1 ? '' : 's'}.
        </p>
        <Button
          onClick={handleMarkAllRead}
          disabled={marking || unreadCount === 0}
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          {marking ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCheck className="w-3.5 h-3.5" />
          )}
          {marking ? 'Marking…' : 'Mark all as read'}
        </Button>
      </div>

      {notifications.map((n) => (
        <NotificationCard key={n.id} notification={n} />
      ))}

      {notifications.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p>No notifications match the current view.</p>
        </div>
      )}
    </div>
  )
}
