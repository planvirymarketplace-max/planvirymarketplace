import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

// POST /api/notifications/process
// Polls the notifications table for QUEUED notifications and delivers them.
// This is the local equivalent of the notification-send Supabase Edge Function.
// Adapted from movinin 3-channel delivery + Peppermint fan-out (ADR-004).
//
// REAL TABLE: notifications (id, user_id, notification_type, channel, priority,
//   subject, body, cta_url, data_payload, status, sent_at, failed_at,
//   rate_limit_category, created_at, updated_at)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()

  // 1. Fetch QUEUED notifications (limit 50 per batch)
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select(`
      id, user_id, notification_type, channel, priority, subject, body,
      cta_url, data_payload, status,
      user_profiles!inner(email, display_name)
    `)
    .eq('status', 'QUEUED')
    .order('priority', { ascending: false }) // CRITICAL first
    .order('created_at', { ascending: true })
    .limit(50)

  if (error) {
    console.error('[notifications/process] query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!notifications || notifications.length === 0) {
    return NextResponse.json({ processed: 0, message: 'No queued notifications' })
  }

  let sent = 0
  let failed = 0

  for (const notif of notifications as Array<Record<string, unknown>>) {
    const profile = Array.isArray(notif.user_profiles) ? notif.user_profiles[0] : notif.user_profiles
    const channel = notif.channel as string
    const toEmail = profile?.email as string

    try {
      // Mark as SENDING
      await supabase
        .from('notifications')
        .update({ status: 'SENDING' })
        .eq('id', notif.id)

      if (channel === 'EMAIL' && toEmail) {
        // Send via Resend
        const { error: sendErr } = await resend.emails.send({
          from: 'Planviry <no-reply@planviry.com>',
          to: toEmail,
          subject: (notif.subject as string) ?? 'Planviry Notification',
          html: (notif.body as string) ?? '',
        })

        if (sendErr) {
          throw new Error(sendErr.message)
        }

        // Mark as SENT
        await supabase
          .from('notifications')
          .update({ status: 'SENT', sent_at: new Date().toISOString() })
          .eq('id', notif.id)
        sent++
      } else if (channel === 'IN_APP') {
        // In-app: insert into in_app_notifications table
        await supabase.from('in_app_notifications').insert({
          notification_id: notif.id,
          user_id: notif.user_id,
        })
        await supabase
          .from('notifications')
          .update({ status: 'SENT', sent_at: new Date().toISOString() })
          .eq('id', notif.id)
        sent++
      } else if (channel === 'PUSH') {
        // Push: look up push_subscription_endpoints for this user
        const { data: endpoints } = await supabase
          .from('push_subscription_endpoints')
          .select('endpoint, p256dh, auth')
          .eq('user_id', notif.user_id)

        if (endpoints && endpoints.length > 0) {
          // TODO: send web push via VAPID (Part XXVI §26.3)
          // For now, mark as sent
          await supabase
            .from('notifications')
            .update({ status: 'SENT', sent_at: new Date().toISOString() })
            .eq('id', notif.id)
          sent++
        } else {
          // No push endpoints — mark as sent (no-op)
          await supabase
            .from('notifications')
            .update({ status: 'SENT', sent_at: new Date().toISOString() })
            .eq('id', notif.id)
          sent++
        }
      }
    } catch (err) {
      console.error(`[notifications/process] failed ${notif.id}:`, err)
      await supabase
        .from('notifications')
        .update({ status: 'FAILED', failed_at: new Date().toISOString() })
        .eq('id', notif.id)
      failed++
    }
  }

  return NextResponse.json({
    processed: notifications.length,
    sent,
    failed,
  })
}
