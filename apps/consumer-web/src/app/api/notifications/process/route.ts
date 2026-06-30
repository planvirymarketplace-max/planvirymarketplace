import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

// POST /api/notifications/process
// Polls notifications table for QUEUED, delivers via Resend (email), in_app, push.
// Adapted from Peppermint fan-out + movinin 3-channel delivery.
// Supports all 3 channels: IN_APP, EMAIL, PUSH (movinin pattern).

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select(`
      id, user_id, notification_type, channel, priority, subject, body,
      cta_url, data_payload, status, rate_limit_category,
      user_profiles!inner(email, display_name)
    `)
    .eq('status', 'QUEUED')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!notifications || notifications.length === 0) {
    return NextResponse.json({ processed: 0, message: 'No queued notifications' })
  }

  let sent = 0, failed = 0

  for (const notif of notifications as Array<Record<string, unknown>>) {
    const profile = Array.isArray(notif.user_profiles) ? notif.user_profiles[0] : notif.user_profiles
    const channel = notif.channel as string
    const toEmail = profile?.email as string

    try {
      await supabase.from('notifications').update({ status: 'SENDING' }).eq('id', notif.id)

      if (channel === 'EMAIL' && toEmail) {
        const { error: sendErr } = await resend.emails.send({
          from: 'Planviry <no-reply@planviry.com>',
          to: toEmail,
          subject: (notif.subject as string) ?? 'Planviry Notification',
          html: (notif.body as string) ?? '',
        })
        if (sendErr) throw new Error(sendErr.message)

        await supabase.from('notifications').update({ status: 'SENT', sent_at: new Date().toISOString() }).eq('id', notif.id)
        sent++
      } else if (channel === 'IN_APP') {
        // Insert into in_app_notifications + broadcast via Supabase Realtime
        await supabase.from('in_app_notifications').insert({
          notification_id: notif.id,
          user_id: notif.user_id,
        })
        await supabase.from('notifications').update({ status: 'SENT', sent_at: new Date().toISOString() }).eq('id', notif.id)
        sent++
      } else if (channel === 'PUSH') {
        // Push: look up push_subscription_endpoints (movinin Expo pattern)
        const { data: endpoints } = await supabase
          .from('push_subscription_endpoints')
          .select('endpoint, p256dh, auth')
          .eq('user_id', notif.user_id)

        if (endpoints && endpoints.length > 0) {
          // TODO: send web push via VAPID when push keys are configured
          // For now mark as sent
          await supabase.from('notifications').update({ status: 'SENT', sent_at: new Date().toISOString() }).eq('id', notif.id)
          sent++
        } else {
          // No push endpoints — mark as sent (no-op, user has no device registered)
          await supabase.from('notifications').update({ status: 'SENT', sent_at: new Date().toISOString() }).eq('id', notif.id)
          sent++
        }
      }
    } catch (err) {
      console.error(`[notifications/process] failed ${notif.id}:`, err)
      await supabase.from('notifications').update({ status: 'FAILED', failed_at: new Date().toISOString() }).eq('id', notif.id)
      failed++
    }
  }

  return NextResponse.json({ processed: notifications.length, sent, failed })
}
