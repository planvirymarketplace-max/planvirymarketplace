/**
 * Part XI §11.3.8 — POST /api/v1/events/:event_id/checkin
 * Validates QR token (HMAC-SHA256) and records check-in (Hi.Events pattern).
 * BR-EV-004: duplicate check-in returns prior timestamp.
 * BR-EV-005: check-in window enforced.
 * P99 < 300ms (high-frequency scanning).
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, NOT_VENDOR_OWNER, INVALID_QR_TOKEN, ALREADY_CHECKED_IN, OUTSIDE_CHECKIN_WINDOW, RATE_LIMITED, INTERNAL_ERROR, NOT_FOUND } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { EventCheckinInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";
import { createHmac } from "crypto";

type Params = { params: Promise<{ eventId: string }> };

const PLATFORM_SECRET = process.env.PLATFORM_SECRET ?? "planviry-checkin-secret-dev";

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const { eventId } = await params;
  const allowedRoles = ["VENDOR_OWNER", "VENDOR_MANAGER", "VENDOR_STAFF"];
  if (!auth.vendorId || !allowedRoles.includes(auth.vendorRole ?? "")) return NOT_VENDOR_OWNER();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.checkin, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try { body = await req.json(); } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }
  const parsed = EventCheckinInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);
  const { qr_token, method } = parsed.data;

  try {
    // QR token format: <reservation_id>:<user_id>:<event_id>:<hmac>
    // Verify HMAC
    const parts = qr_token.split(":");
    if (parts.length !== 4) return INVALID_QR_TOKEN();
    const [reservationId, userId, tokenEventId, signature] = parts;
    if (tokenEventId !== eventId) return INVALID_QR_TOKEN();

    const expectedSig = createHmac("sha256", PLATFORM_SECRET)
      .update(`${reservationId}:${userId}:${eventId}`)
      .digest("hex");
    if (signature !== expectedSig) return INVALID_QR_TOKEN();

    // Load reservation
    const { data: reservation } = await supabase
      .from("reservations")
      .select("id, status, user_id, inventory_items!inner(id, vendor_id, metadata)")
      .eq("id", reservationId)
      .maybeSingle();
    if (!reservation) return NOT_FOUND("Reservation");
    const inv = Array.isArray(reservation.inventory_items) ? reservation.inventory_items[0] : reservation.inventory_items;
    if (inv.vendor_id !== auth.vendorId) return NOT_VENDOR_OWNER();

    // BR-EV-004: already checked in?
    const { data: existing } = await supabase
      .from("check_ins")
      .select("checked_in_at")
      .eq("reservation_id", reservationId)
      .maybeSingle();
    if (existing) return ALREADY_CHECKED_IN(existing.checked_in_at);

    // BR-EV-005: check-in window (event_start - 1h to event_end + 30min)
    const eventMeta = (inv.metadata as Record<string, unknown>) ?? {};
    const eventStart = eventMeta.starts_at ? new Date(eventMeta.starts_at as string) : null;
    const eventEnd = eventMeta.ends_at ? new Date(eventMeta.ends_at as string) : null;
    const now = new Date();
    if (eventStart && now < new Date(eventStart.getTime() - 60 * 60_000)) return OUTSIDE_CHECKIN_WINDOW();
    if (eventEnd && now > new Date(eventEnd.getTime() + 30 * 60_000)) return OUTSIDE_CHECKIN_WINDOW();

    // Load attendee name from user_profiles
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("display_name")
      .eq("id", reservation.user_id)
      .maybeSingle();

    const { data, error } = await supabase
      .from("check_ins")
      .insert({
        reservation_id: reservationId,
        event_id: eventId,
        checked_in_by: auth.userId,
        method: method ?? "QR_SCAN",
        checked_in_at: now.toISOString(),
      })
      .select("reservation_id, checked_in_at")
      .single();
    if (error) { console.error("[checkin POST]", error); return INTERNAL_ERROR(); }

    return ok({
      reservation_id: reservationId,
      attendee_name: profile?.display_name ?? "Guest",
      tier_name: "General Admission",
      checked_in_at: data.checked_in_at,
    });
  } catch (err) {
    console.error("[checkin POST] error:", err);
    return INTERNAL_ERROR();
  }
}
