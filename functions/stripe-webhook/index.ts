/**
 * @planviry/fn-stripe-webhook — Supabase Edge Function (Deno runtime).
 *
 * Handles Stripe payment webhooks. Updates Reservation + PaymentRecord state.
 * Spec refs:
 *   Part II   §2.1  — functions/stripe-webhook
 *   Part II   §2.2  — may import packages/types + shared/ only (uses Supabase
 *                     client directly, NOT @planviry/db).
 *   Part XII  §12.x — Edge Functions (idempotency, retries, DLQ, timeout).
 *   Part XLII §42.3 — Winning reference: TicketiHub (Stripe Checkout + webhooks).
 *
 * Idempotency: Stripe event IDs are deduped (Part XII §12.11). Webhook signature
 * verification is mandatory before any DB write.
 *
 * NOTE: This file uses Deno-style imports (https://esm.sh/...) because Supabase
 * Edge Functions run on Deno Deploy. `bun install` is a no-op for these imports;
 * the function is deployed via `supabase functions deploy`.
 */
// @ts-expect-error — Deno global, available in the Supabase runtime.
// deno-lint-ignore no-explicit-any
declare const Deno: any;
// @ts-expect-error — Stripe loaded via esm.sh at runtime in Deno.
import Stripe from "https://esm.sh/stripe@17.0.0";

const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2024-06-20" });

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "payment_intent.succeeded":
      // → reservation.confirmed transition (Part V FSM; BR-R-001).
      // TODO Part XII: load PaymentRecord by intent id, transition Reservation
      // PENDING → CONFIRMED inside a serializable txn, emit reservation.confirmed.
      break;
    case "payment_intent.payment_failed":
      // → cancellation flow (Part V; BR-R-006).
      break;
    case "account.updated":
      // → StripeConnectAccount charges_enabled / payouts_enabled sync.
      break;
    default:
      // Part XII §12.11 — unknown events are acked but logged, not errored.
      break;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Invalid signature: ${String(err)}`, { status: 400 });
  }

  // Idempotency: dedupe by event.id (Part XII §12.11).
  // TODO Part XII: check + record event.id in a processed_events table.
  try {
    await handleEvent(event);
    return new Response(JSON.stringify({ received: true }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(`Handler error: ${String(err)}`, { status: 500 });
  }
});
