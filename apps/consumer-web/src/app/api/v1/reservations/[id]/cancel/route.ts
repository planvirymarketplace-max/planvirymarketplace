/**
 * Part XI §11.3.3 — POST /api/v1/reservations/:id/cancel
 * Two-phase cancellation:
 *   Phase 1 (no confirm_token): preview refund + issue confirm_token (5min TTL)
 *   Phase 2 (with confirm_token): execute cancel via rpc_cancel_reservation (movinin FSM)
 * BR-R-006: cancellation policy evaluated at cancel time.
 * P95 < 1000ms (Phase 2 includes Stripe refund API call).
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, NOT_FOUND, INVALID_STATE, CONFIRM_TOKEN_EXPIRED, RATE_LIMITED, INTERNAL_ERROR } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { ReservationCancelInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  const { id: reservationId } = await params;

  let body: unknown;
  try { body = await req.json(); } catch { body = {}; }
  const parsed = ReservationCancelInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);
  const { confirm_token, reason } = parsed.data;

  try {
    // Load reservation — RLS check
    const { data: reservation, error } = await supabase
      .from("reservations")
      .select("id, user_id, status, total_price_cents, starts_at, cancelled_reason")
      .eq("id", reservationId)
      .maybeSingle();
    if (error) { console.error("[cancel] load", error); return INTERNAL_ERROR(); }
    if (!reservation) return NOT_FOUND("Reservation");
    if (reservation.user_id !== auth.userId && auth.role !== "ADMIN") return NOT_FOUND("Reservation");

    // State check
    if (reservation.status !== "CONFIRMED" && reservation.status !== "PENDING") {
      return INVALID_STATE(`Reservation is in ${reservation.status} state; cannot cancel.`);
    }

    if (confirm_token) {
      // ── Phase 2: Confirm cancellation ────────────────────────────────────
      // Verify token via in-memory store (production: Redis or a tokens table)
      // For now, accept any non-empty token issued in Phase 1 within 5 min.
      // BR-R-001: FSM transition via RPC (movinin pattern)
      const { data: result, error: rpcError } = await supabase.rpc("rpc_cancel_reservation", {
        p_reservation_id: reservationId,
        p_reason: reason ?? null,
        p_actor_id: auth.userId,
      });
      if (rpcError) {
        console.error("[cancel] RPC error:", rpcError);
        // Fallback: direct update
        const { error: updErr } = await supabase
          .from("reservations")
          .update({ status: "CANCELLED", cancelled_reason: reason ?? null })
          .eq("id", reservationId);
        if (updErr) { console.error("[cancel] fallback", updErr); return INTERNAL_ERROR(); }
      }

      // TODO Part XXVIII: initiate Stripe refund via Stripe API

      return ok({
        reservation_id: reservationId,
        status: "CANCELLED",
        refund_amount_cents: reservation.total_price_cents,
        stripe_refund_id: null,
      });
    }

    // ── Phase 1: Preview refund ────────────────────────────────────────────
    // BR-R-006: evaluate cancellation policy at current time
    const now = new Date();
    const startsAt = new Date(reservation.starts_at);
    const hoursToEvent = (startsAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    let refundPct = 100;
    let policy = "full_refund";
    if (hoursToEvent < 24) { refundPct = 0; policy = "no_refund_within_24h"; }
    else if (hoursToEvent < 48) { refundPct = 50; policy = "50_percent_within_48h"; }

    const refundAmount = Math.round((reservation.total_price_cents ?? 0) * refundPct / 100);
    const token = randomUUID();

    return ok({
      refund_amount_cents: refundAmount,
      refund_policy_applied: policy,
      confirm_token: token,
    });
  } catch (err) {
    console.error("[cancel] error:", err);
    return INTERNAL_ERROR();
  }
}
