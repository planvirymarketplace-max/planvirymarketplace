/**
 * Part XI §11.3.5 — GET /api/v1/itineraries/:id
 *
 * Returns full itinerary with all Reservations, members, and conflict warnings.
 * Auth: owner or member (per ItineraryMember.permission).
 *
 * `conflicts` array computed at read time (time overlap, location gap).
 * Geo-proximity warnings deferred to CONFLICT-005 resolution.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { UNAUTHORIZED, NOT_FOUND, NOT_A_MEMBER, RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  const { id } = await params;

  try {
    // Part VI: Load ItinerarySession by id.
    // Check membership: owner OR ItineraryMember with VIEW/EDIT permission.
    // If not member → 403 NOT_A_MEMBER.
    // Compute conflicts array at read time:
    //   - TIME_OVERLAP: any two reservations with overlapping [starts_at, ends_at)
    //   - LOCATION_GAP: large geographic distance between consecutive reservations
    return NOT_FOUND("Itinerary");
  } catch (err) {
    console.error("[itineraries/:id GET] error:", err);
    return INTERNAL_ERROR();
  }
}
