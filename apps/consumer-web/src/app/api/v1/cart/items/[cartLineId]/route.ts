/**
 * Part XI §11.3.4 — DELETE /api/v1/cart/items/:cart_line_id
 * Removes a line item from the cart. P95 < 150ms.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { RATE_LIMITED, INTERNAL_ERROR, NOT_FOUND } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { supabase } from "@planviry/db";

type Params = { params: Promise<{ cartLineId: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.authenticated, auth);
  if (rateLimited) return rateLimited;

  const { cartLineId } = await params;

  try {
    const { error } = await supabase
      .from("cart_line_items")
      .delete()
      .eq("id", cartLineId);

    if (error) { console.error("[cart/items DELETE]", error); return INTERNAL_ERROR(); }

    return ok({ deleted: true, cart_line_id: cartLineId });
  } catch (err) {
    console.error("[cart/items DELETE] error:", err);
    return INTERNAL_ERROR();
  }
}
