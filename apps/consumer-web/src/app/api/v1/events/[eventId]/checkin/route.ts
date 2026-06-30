/**
 * Part XI §11.3.8 — POST /api/v1/events/:event_id/checkin
 *
 * Validates a QR check-in token and records check-in for a ticket Reservation.
 * Auth: VENDOR_OWNER, VENDOR_MANAGER, or VENDOR_STAFF of the event's VendorAccount.
 *
 * QR Token Validation: HMAC-SHA256 verify(token, reservation_id + user_id +
 * event_id + platform_secret). Reject if signature invalid or token expired
 * (TTL: event_end_at + 30 min).
 *
 * BR-EV-004: duplicate check-in returns error with prior timestamp.
 * BR-EV-005: check-in window enforced.
 * P99 < 300ms (high-frequency; multiple scanners simultaneously).
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  zodErrors, UNAUTHORIZED, NOT_VENDOR_OWNER,
  INVALID_QR_TOKEN, ALREADY_CHECKED_IN, OUTSIDE_CHECKIN_WINDOW,
  RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { EventCheckinInput } from "@/lib/api/schemas";

type Params = { params: Promise<{ eventId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const { eventId } = await params;

  // VENDOR_OWNER, VENDOR_MANAGER, or VENDOR_STAFF
  const allowedRoles = ["VENDOR_OWNER", "VENDOR_MANAGER", "VENDOR_STAFF"];
  if (!auth.vendorId || !allowedRoles.includes(auth.vendorRole ?? "")) {
    return NOT_VENDOR_OWNER();
  }

  const rateLimited = checkRateLimit(req, RATE_LIMITS.checkin, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }

  const parsed = EventCheckinInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { qr_token, method } = parsed.data;

  try {
    // Part V/VI:
    // 1. Verify QR token: HMAC-SHA256 verify(qr_token, reservation_id + user_id
    //    + event_id + PLATFORM_SECRET). If invalid → 400 INVALID_QR_TOKEN.
    // 2. Check token not expired (TTL: event_end_at + 30 min). Else → 400 INVALID_QR_TOKEN.
    // 3. Load reservation. Check not already checked in (BR-EV-004).
    //    If already → 409 ALREADY_CHECKED_IN with checked_in_at timestamp.
    // 4. Check within check-in window (BR-EV-005). Else → 409 OUTSIDE_CHECKIN_WINDOW.
    // 5. Record check-in (checked_in_at = NOW(), method).
    return error(501, "SCHEMA_PENDING", "Event check-in pending Part V/VI.", null);
  } catch (err) {
    console.error("[events/:eventId/checkin] error:", err);
    return INTERNAL_ERROR();
  }
}
