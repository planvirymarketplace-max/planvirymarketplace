/**
 * Part XI §11.3.3 — GET /api/v1/reservations/:id
 *
 * Full detail of a single Reservation: payment status, cancellation policy
 * snapshot, itinerary context. Auth: required (RLS: consumer sees own, vendor
 * sees bookings on own inventory). P95 < 200ms.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { UNAUTHORIZED, NOT_FOUND, RATE_LIMITED, INTERNAL_ERROR, error
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
    // Part VI: query reservation by id with RLS (user_id = auth.userId OR
    // inventory_item.vendor_id = auth.vendorId). Include payment + itinerary joins.
    return NOT_FOUND("Reservation");
  } catch (err) {
    console.error("[reservations/:id GET] error:", err);
    return INTERNAL_ERROR();
  }
}
