/**
 * Part XI §11.3.2 — POST /api/v1/inventory/:id/pause
 *
 * Transitions PUBLISHED → PAUSED. Item removed from search; no new Reservations.
 * Auth: VENDOR_OWNER/MANAGER or MODERATOR/ADMIN.
 * Side effects: Algolia delete; Cart items flagged ITEM_UNAVAILABLE; users notified.
 * Error: 409 HAS_ACTIVE_CHECKOUT if item in active checkout with held inventory.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  RATE_LIMITED, INTERNAL_ERROR, NOT_VENDOR_OWNER, UNAUTHORIZED, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const { id } = await params;

  // VENDOR_OWNER, VENDOR_MANAGER, MODERATOR, or ADMIN
  const allowedRoles = ["VENDOR_OWNER", "VENDOR_MANAGER", "MODERATOR", "ADMIN"];
  if (!allowedRoles.includes(auth.vendorRole ?? auth.role)) {
    return NOT_VENDOR_OWNER();
  }

  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  try {
    // Part VI: Call RPC rpc_pause_inventory_item(id, vendor_id):
    //   1. Check no active checkout sessions holding this item (else 409 HAS_ACTIVE_CHECKOUT)
    //   2. Transition PUBLISHED → PAUSED
    //   3. Delete from Algolia
    //   4. Flag Cart items containing this item as ITEM_UNAVAILABLE
    //   5. Notify users with pending Cart items
    return error(501, "SCHEMA_PENDING", "InventoryItem pause FSM pending Part V/VI.", null);
  } catch (err) {
    console.error("[inventory/:id/pause] error:", err);
    return INTERNAL_ERROR();
  }
}
