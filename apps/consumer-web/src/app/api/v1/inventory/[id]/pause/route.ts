/**
 * Part XI §11.3.2 — POST /api/v1/inventory/:id/pause
 * Transitions PUBLISHED → PAUSED. Auth: VENDOR_OWNER/MANAGER or MODERATOR/ADMIN.
 * 409 HAS_ACTIVE_CHECKOUT if item in active checkout with held inventory.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { RATE_LIMITED, INTERNAL_ERROR, UNAUTHORIZED, NOT_FOUND, NOT_AUTHORIZED, HAS_ACTIVE_CHECKOUT, INVALID_STATE_TRANSITION } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { supabase } from "@planviry/db";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const { id } = await params;

  const allowedRoles = ["VENDOR_OWNER", "VENDOR_MANAGER", "MODERATOR", "ADMIN"];
  if (!allowedRoles.includes(auth.vendorRole ?? auth.role)) return NOT_AUTHORIZED();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  try {
    const { data: item } = await supabase
      .from("inventory_items")
      .select("id, vendor_id, status")
      .eq("id", id)
      .maybeSingle();
    if (!item) return NOT_FOUND("InventoryItem");
    if (item.status !== "PUBLISHED") {
      return INVALID_STATE_TRANSITION(`Item is in ${item.status} state; can only pause from PUBLISHED.`);
    }

    // Check for active checkout sessions (PENDING reservations with TTL not expired)
    const { count } = await supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("inventory_item_id", id)
      .eq("status", "PENDING")
      .gt("expires_at", new Date().toISOString());
    if ((count ?? 0) > 0) return HAS_ACTIVE_CHECKOUT();

    const { error } = await supabase
      .from("inventory_items")
      .update({ status: "PAUSED" })
      .eq("id", id);
    if (error) { console.error("[inventory/:id/pause]", error); return INTERNAL_ERROR(); }

    return ok({ id, status: "PAUSED" });
  } catch (err) {
    console.error("[inventory/:id/pause] error:", err);
    return INTERNAL_ERROR();
  }
}
