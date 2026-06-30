/**
 * Part XI §11.3.4 — GET /api/v1/cart
 *
 * Returns current cart state for authenticated user or anon session.
 * Auth: optional. No caching (real-time). P95 < 150ms.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";

export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  try {
    // Part VI: load cart by user_id or session_token. Until Part VI: empty cart.
    return ok({
      cart_id: "00000000-0000-0000-0000-000000000000", // Part VI: real cart_id
      items: [],
      subtotal_cents: 0,
      expires_at: new Date(Date.now() + 60 * 60_000).toISOString(), // 60 min idle TTL (BR-C-002)
    });
  } catch (err) {
    console.error("[cart GET] error:", err);
    return INTERNAL_ERROR();
  }
}
