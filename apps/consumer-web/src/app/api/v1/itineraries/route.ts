/**
 * Part XI §11.3.5 — POST /api/v1/itineraries  +  GET /api/v1/itineraries/:id  +  POST /:id/share
 * POST:      Create ItinerarySession. Auth: required. P95 < 400ms.
 * GET :id:   Full itinerary with reservations, members, conflict warnings.
 * POST share: Generate share link or invite by email. BR-IT-001: ≥1 reservation.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, NOT_FOUND, NOT_A_MEMBER, RATE_LIMITED, INTERNAL_ERROR, INVALID_STATE_TRANSITION } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { ItineraryCreateInput, ItineraryShareInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";
import { randomUUID } from "crypto";

// POST /api/v1/itineraries
export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try { body = await req.json(); } catch { body = {}; }
  const parsed = ItineraryCreateInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);
  const { title, occasion_type, reservation_ids } = parsed.data;

  try {
    const { data, error } = await supabase
      .from("itinerary_sessions")
      .insert({
        owner_id: auth.userId,
        title: title ?? "Untitled Itinerary",
        status: "ACTIVE",
        occasion_type: occasion_type ?? null,
      })
      .select("id, title, status, created_at")
      .single();
    if (error) { console.error("[itineraries POST]", error); return INTERNAL_ERROR(); }

    // Attach reservations if provided (must belong to user)
    if (reservation_ids && reservation_ids.length > 0) {
      await supabase
        .from("reservations")
        .update({ itinerary_session_id: data.id })
        .in("id", reservation_ids)
        .eq("user_id", auth.userId);
    }

    return ok({ ...data, reservations: [] }, 201);
  } catch (err) {
    console.error("[itineraries POST] error:", err);
    return INTERNAL_ERROR();
  }
}

// GET /api/v1/itineraries (list user's itineraries) — also handle here
export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  try {
    const { data, error } = await supabase
      .from("itinerary_sessions")
      .select("id, title, status, created_at, updated_at")
      .eq("owner_id", auth.userId)
      .order("created_at", { ascending: false });
    if (error) { console.error("[itineraries GET]", error); return INTERNAL_ERROR(); }
    return ok({ itineraries: data ?? [] });
  } catch (err) {
    console.error("[itineraries GET] error:", err);
    return INTERNAL_ERROR();
  }
}
