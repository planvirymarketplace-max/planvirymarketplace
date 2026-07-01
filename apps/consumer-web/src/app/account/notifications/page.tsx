import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import { NotificationsList } from './NotificationsList'

// ─── Types ────────────────────────────────────────────────────────────────
// Schema note (FIX-8 live-DB probe): the `notifications` table has columns
//   id, user_id, notification_type, channel, priority, subject, body,
//   cta_url, data_payload, status, rate_limit_category,
//   sent_at, failed_at, created_at, updated_at
// There is NO `read_at` column on `notifications` — read state is tracked in
// the `in_app_notifications` join table (id, notification_id, read_at,
// is_read, created_at), so we join it via PostgREST's nested-select syntax.
type InAppRow = {
  read_at: string | null
  is_read: boolean | null
} | null

export type Notification = {
  id: string
  user_id: string
  notification_type: string | null
  channel: string | null
  priority: string | null
  subject: string | null
  body: string | null
  cta_url: string | null
  data_payload: Record<string, unknown> | null
  status: string | null
  rate_limit_category: string | null
  sent_at: string | null
  failed_at: string | null
  created_at: string | null
  in_app_notifications: InAppRow[] | InAppRow
}

export const metadata = {
  title: 'Notifications — Planviry',
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?returnTo=/account/notifications')
  }

  let notifications: Notification[] = []
  let loadError: string | null = null

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(
        `
        id, user_id, notification_type, channel, priority, subject, body,
        cta_url, data_payload, status, rate_limit_category,
        sent_at, failed_at, created_at,
        in_app_notifications(read_at, is_read)
        `,
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      // Most likely cause: missing table on this DB. Surface friendly error.
      loadError = error.message
    } else {
      notifications = (data ?? []) as unknown as Notification[]
    }
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Unknown error'
  }

  // Count unread: notifications that have no in_app_notifications row with
  // is_read = true.
  const unreadCount = notifications.filter((n) => {
    const inApp = Array.isArray(n.in_app_notifications)
      ? n.in_app_notifications[0]
      : n.in_app_notifications
    return !inApp?.is_read
  }).length

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

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <h1 className="text-2xl font-black text-black flex items-center gap-2">
              <Bell className="w-6 h-6 text-gray-500" />
              Notifications
            </h1>
            {notifications.length > 0 && (
              <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
            {unreadCount > 0 && (
              <span className="text-xs bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>

          {loadError ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-red-600">
                Could not load notifications. Please try again later.
              </p>
              <p className="text-xs text-gray-400 mt-1 font-mono break-all">
                {loadError}
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold">No notifications</p>
              <p className="text-sm text-gray-400 mt-1">
                When vendors send you updates or your reservations change status,
                they&apos;ll appear here.
              </p>
              <Link
                href="/account"
                className="inline-block mt-4 text-sm font-bold text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white"
              >
                Back to account
              </Link>
            </div>
          ) : (
            <NotificationsList notifications={notifications} />
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
