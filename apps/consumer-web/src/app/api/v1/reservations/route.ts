/**
 * Part XI §11.3.3 — GET /api/v1/reservations
 *
 * Returns authenticated user's reservations (consumer) or vendor's incoming
 * reservations (scoped by RLS). Auth: required. No caching (real-time sensitive).
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, UNAUTHORIZED, RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { ReservationListQuery } from "@/lib/api/schemas";

export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  const url = new URL(req.url);
  const params: Record<string, string | string[] | undefined> = {};
  url.searchParams.forEach((value, key) => {
    const existing = params[key];
    params[key] = existing ? Array.isArray(existing) ? [...existing, value] : [existing, value] : value;
  });

  const parsed = ReservationListQuery.safeParse(params);
  if (!parsed.success) return zodErrors(parsed.error);

  const { page, per_page } = parsed.data;

  try {
    // Part VI: query reservations table with RLS:
    //   - Consumer: WHERE user_id = auth.userId
    //   - Vendor: WHERE inventory_item.vendor_id = auth.vendorId (join through inventory_items)
    // Until Part VI: return empty list.
    return ok({
      reservations: [],
      total: 0,
      page,
    });
  } catch (err) {
    console.error("[reservations GET] error:", err);
    return INTERNAL_ERROR();
  }
}
