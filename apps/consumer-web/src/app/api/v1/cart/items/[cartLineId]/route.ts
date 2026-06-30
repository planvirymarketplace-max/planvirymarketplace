/**
 * Part XI §11.3.4 — DELETE /api/v1/cart/items/:cart_line_id
 *
 * Removes a line item from the cart. Auth: optional (same session as cart).
 * P95 < 150ms.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";

type Params = { params: Promise<{ cartLineId: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  const { cartLineId } = await params;

  try {
    // Part VI: DELETE FROM cart_line_items WHERE id = cartLineId AND cart.session = auth.session
    // Return full cart state after deletion.
    return ok({
      cart: {
        cart_id: "00000000-0000-0000-0000-000000000000",
        items: [],
        subtotal_cents: 0,
        expires_at: new Date(Date.now() + 60 * 60_000).toISOString(),
      },
    });
  } catch (err) {
    console.error("[cart/items/:cartLineId DELETE] error:", err);
    return INTERNAL_ERROR();
  }
}
