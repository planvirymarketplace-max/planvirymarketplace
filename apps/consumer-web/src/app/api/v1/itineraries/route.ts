/**
 * Part XI §11.3.5 — POST /api/v1/itineraries
 *
 * Creates a new ItinerarySession (DOM-005), optionally attaching existing
 * confirmed Reservations. Auth: required. P95 < 400ms.
 *
 * BR-IT-001: session must have ≥1 Reservation before sharing (enforced at
 * share-time, not creation).
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, RATE_LIMITED, INTERNAL_ERROR, Errors, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { ItineraryCreateInput } from "@/lib/api/schemas";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const parsed = ItineraryCreateInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { title, occasion_type, reservation_ids } = parsed.data;

  try {
    // Part VI: Create ItinerarySession row.
    // If reservation_ids provided: verify all belong to auth.userId, then attach.
    // Emit itinerary.created analytics event.
    const itineraryId = randomUUID();

    return ok({
      id: itineraryId,
      title: title ?? "Untitled Itinerary",
      status: "ACTIVE",
      reservations: [], // Part VI: attach reservation_ids
      created_at: new Date().toISOString(),
    }, 201);
  } catch (err) {
    console.error("[itineraries POST] error:", err);
    return INTERNAL_ERROR();
  }
}
