/**
 * @planviry/fn-notification-send — Supabase Edge Function (Deno).
 *
 * Triggered by the notification queue. Delivers a single notification across
 * its configured channels (in-app / email / push).
 *
 * Spec refs: Part II §2.1; Part XXVI §26.x (Notifications).
 * Pattern source: Peppermint fan-out + movinin 3-channel delivery
 * (ADR-004, Part XLII §42.3).
 */
// @ts-expect-error — Deno global.
declare const Deno: any;
// @ts-expect-error — resend via esm.sh in Deno.
import { Resend } from "https://esm.sh/resend@4.0.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const resend = new Resend(RESEND_API_KEY);

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const notif = await req.json();
  // TODO Part XXVI: dispatch by channel. Email → render template via
  // @planviry/email-templates, send via Resend. Push → FCM/APNs. In-app →
  // Supabase Realtime broadcast. Record delivery status on Notification row.
  if (notif.channel === "email") {
    await resend.emails.send({
      from: "Planviry <no-reply@planviry.com>",
      to: notif.to,
      subject: notif.subject,
      html: notif.html,
    });
  }
  return new Response(JSON.stringify({ sent: true }), {
    headers: { "content-type": "application/json" },
  });
});
