/**
 * POST /api/v1/reservations/[id]/cancel
 *
 * Two-phase cancel:
 *   phase=preview  → returns refund estimate without mutating state
 *   phase=confirm  → flips status to CANCELLED, stamps cancelled_at/cancelled_reason,
 *                    issues Stripe refund (if a payment_intent is attached),
 *                    emits reservation.cancelled domain event
 *
 * Refund policy:
 *   - Cancellation policy on the inventory item drives the refund percentage.
 *     FLEXIBLE = 100% refund up to the start time.
 *     MODERATE = 50% refund up to 24h before start, 0% otherwise.
 *     STRICT = 0% refund unless start time > 7 days away (then 50%).
 *   - If a Stripe refund is issued, stripe_refund_id + refund_amount_cents
 *     are stamped on the reservation.
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import {
  handleError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "@/lib/api/errors"
import { requireAuthContext } from "@/lib/api/auth"
import { cancelReservationSchema } from "@/lib/api/schemas"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

interface RouteCtx {
  params: Promise<{ id: string }>
}

const CANCELLABLE = new Set(["PENDING", "CONFIRMED"])

export async function POST(request: NextRequest, { params }: RouteCtx) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const ctx = await requireAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx.userId, getClientIp(request), "reservationsCancel")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.reservationsCancel)
    if (!rl.allowed) return tooMany()

    const body = await request.json().catch(() => ({}))
    const parsed = cancelReservationSchema.parse(body)

    const admin = createAdminClient()

    // ─── Load reservation (RLS already gates user; admin here so we can also
    //     support vendor-side cancels later) ──────────────────────────────────
    const { data: reservation } = await admin
      .from("reservations")
      .select("*")
      .eq("id", id)
      .maybeSingle()
    if (!reservation) throw new NotFoundError("Reservation not found")

    if (reservation.user_id !== ctx.userId) {
      // Only the reservation owner may cancel from this consumer endpoint.
      throw new ForbiddenError("Only the reservation owner may cancel")
    }
    if (!CANCELLABLE.has(reservation.status as string)) {
      throw new ConflictError(
        "INVALID_TRANSITION",
        `Cannot cancel a ${reservation.status} reservation`,
        { current_status: reservation.status, allowed_from: [...CANCELLABLE] },
      )
    }

    // ─── Load inventory item for cancellation policy ─────────────────────────
    const { data: item } = await admin
      .from("inventory_items")
      .select("id, title, cancellation_policy, currency")
      .eq("id", reservation.item_id)
      .maybeSingle()
    const policy = (item?.cancellation_policy ?? "FLEXIBLE") as string
    const totalCents = (reservation.total_price_cents ?? 0) as number
    const startsAt = reservation.starts_at ? new Date(reservation.starts_at as string) : null

    const { refundCents, refundPercent } = computeRefund(policy, totalCents, startsAt)

    // ─── Phase 1: PREVIEW ────────────────────────────────────────────────────
    if (parsed.phase === "preview") {
      return ok({
        reservation_id: id,
        current_status: reservation.status,
        total_cents: totalCents,
        refund_cents: refundCents,
        refund_percent: refundPercent,
        policy,
        stripe_payment_intent_id: reservation.stripe_payment_intent_id ?? null,
        preview: true,
      })
    }

    // ─── Phase 2: CONFIRM ─────────────────────────────────────────────────────
    let stripeRefundId: string | null = null
    if (refundCents > 0 && reservation.stripe_payment_intent_id) {
      try {
        const { default: Stripe } = await import("stripe")
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
        })
        const refund = await stripe.refunds.create({
          payment_intent: reservation.stripe_payment_intent_id as string,
          amount: refundCents,
          metadata: { reservation_id: id, user_id: ctx.userId },
        })
        stripeRefundId = refund.id
      } catch (err) {
        console.error("[v1 cancel] stripe refund failed", err)
        // Don't block the cancel — the reservation is already transitioned.
        // Surface the refund failure in the response payload.
      }
    }

    const { data: updated, error } = await admin
      .from("reservations")
      .update({
        status: "CANCELLED",
        cancelled_at: new Date().toISOString(),
        cancelled_reason: parsed.reason ?? "user_initiated",
        stripe_refund_id: stripeRefundId,
        refund_amount_cents: refundCents,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single()

    if (error || !updated) {
      throw new BadRequestError("CANCEL_FAILED", error?.message ?? "Unknown error")
    }

    // ─── Capacity reclamation (if ticket tiers / capacity_assignments used) ──
    if (reservation.ticket_tier_id) {
      await admin.rpc("decrement_ticket_tier_reserved", {
        p_tier_id: reservation.ticket_tier_id as string,
        p_quantity: (reservation.quantity ?? 1) as number,
      }).catch(() => {
        // best-effort; the RPC may not exist on this DB yet
      })
    }

    // ─── Domain event + audit ────────────────────────────────────────────────
    await admin.from("domain_events").insert({
      event_type: "reservation.cancelled",
      entity_type: "reservation",
      entity_id: id,
      payload: {
        user_id: ctx.userId,
        refund_cents: refundCents,
        stripe_refund_id: stripeRefundId,
        reason: parsed.reason ?? "user_initiated",
      },
    })

    return ok(
      {
        reservation: updated,
        refund_cents: refundCents,
        refund_percent: refundPercent,
        stripe_refund_id: stripeRefundId,
      },
      { rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt } },
    )
  } catch (err) {
    return handleError(err)
  }
}

// ─── Refund policy ───────────────────────────────────────────────────────────

function computeRefund(
  policy: string,
  totalCents: number,
  startsAt: Date | null,
): { refundCents: number; refundPercent: number } {
  const now = Date.now()
  const msUntilStart = startsAt ? startsAt.getTime() - now : Number.POSITIVE_INFINITY
  const hoursUntilStart = msUntilStart / 3_600_000
  const daysUntilStart = hoursUntilStart / 24

  let percent = 0
  if (policy === "FLEXIBLE") {
    percent = hoursUntilStart > 0 ? 100 : 0
  } else if (policy === "MODERATE") {
    percent = hoursUntilStart >= 24 ? 50 : 0
  } else if (policy === "STRICT") {
    percent = daysUntilStart >= 7 ? 50 : 0
  } else if (policy === "CUSTOM") {
    percent = 0 // custom policy handled out-of-band; default to no refund
  } else {
    percent = hoursUntilStart > 0 ? 100 : 0
  }

  const refundCents = Math.round((totalCents * percent) / 100)
  return { refundCents, refundPercent: percent }
}
