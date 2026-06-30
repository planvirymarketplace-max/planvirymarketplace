/**
 * Part XI §11.3.3 — POST /api/v1/reservations/:id/cancel
 *
 * Two-phase cancellation for CONFIRMED:
 *   Phase 1 (no confirm_token): preview refund → returns refund_amount + confirm_token (5min TTL)
 *   Phase 2 (with confirm_token): execute cancel → FSM CONFIRMED→CANCELLED, Stripe refund, inventory release
 *
 * BR-R-006: cancellation policy evaluated at cancel time, not booking time.
 * P95 < 1000ms (includes Stripe API call for Phase 2).
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  zodErrors, UNAUTHORIZED, NOT_FOUND, INVALID_STATE,
  CONFIRM_TOKEN_EXPIRED, RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { ReservationCancelInput } from "@/lib/api/schemas";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  const { id: reservationId } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const parsed = ReservationCancelInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { confirm_token, reason } = parsed.data;

  try {
    // Part V/VI: Load reservation, verify RLS (consumer own OR vendor own inventory).
    // Check reservation is in CONFIRMED or PENDING state (else 409 INVALID_STATE).

    if (confirm_token) {
      // ── Phase 2: Confirm cancellation ────────────────────────────────────
      // Verify confirm_token (TTL 5 min) → 409 CONFIRM_TOKEN_EXPIRED if expired.
      // FSM: CONFIRMED → CANCELLED via RPC.
      // Stripe refund initiated. Inventory released. reservation.cancelled event.
      // Both parties notified.
      return error(501, "SCHEMA_PENDING", "Reservation cancel confirm pending Part V/VI.", null);
    }

    // ── Phase 1: Preview refund ────────────────────────────────────────────
    // BR-R-006: evaluate cancellation policy at current time.
    // Calculate refund_amount_cents based on policy + time-to-event.
    // Generate confirm_token (5 min TTL).
    const previewToken = randomUUID();

    return ok({
      refund_amount_cents: 0, // Part VI: calculate from cancellation policy
      refund_policy_applied: "full_refund", // Part VI: determine from policy
      confirm_token: previewToken,
    });
  } catch (err) {
    console.error("[reservations/:id/cancel] error:", err);
    return INTERNAL_ERROR();
  }
}
