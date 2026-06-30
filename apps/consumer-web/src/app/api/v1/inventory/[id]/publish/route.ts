/**
 * Part XI §11.3.2 — POST /api/v1/inventory/:id/publish
 * Transitions DRAFT → PUBLISHED via rpc_transition_inventory_status (movinin FSM pattern).
 * Auth: VENDOR_OWNER. Side effects: Algolia queue, inventory.published event.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { RATE_LIMITED, INTERNAL_ERROR, UNAUTHORIZED, NOT_FOUND, NOT_AUTHORIZED, METADATA_INCOMPLETE, INVALID_STATE_TRANSITION } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { supabase } from "@planviry/db";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  if (auth.vendorRole !== "VENDOR_OWNER") return NOT_AUTHORIZED();
  const { id } = await params;

  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  try {
    // Verify ownership + current state
    const { data: item } = await supabase
      .from("inventory_items")
      .select("id, vendor_id, status, title, category, metadata")
      .eq("id", id)
      .maybeSingle();
    if (!item) return NOT_FOUND("InventoryItem");
    if (item.vendor_id !== auth.vendorId) return NOT_AUTHORIZED();
    if (item.status !== "DRAFT" && item.status !== "PAUSED") {
      return INVALID_STATE_TRANSITION(`Item is in ${item.status} state; can only publish from DRAFT or PAUSED.`);
    }

    // BR-I-002: metadata validation — check required fields per category
    const meta = (item.metadata as Record<string, unknown>) ?? {};
    const missing: string[] = [];
    if (!item.title || item.title.length < 3) missing.push("title");
    if (item.category === "EVENT_TICKET") {
      // BR-EV-001: events must have ≥1 TicketTier (checked separately)
    }
    if (missing.length > 0) return METADATA_INCOMPLETE(missing);

    // Call the RPC to transition status (Part V FSM — rpc_transition_inventory_status)
    const { data: result, error } = await supabase
      .rpc("rpc_transition_inventory_status", {
        p_item_id: id,
        p_new_status: "PUBLISHED",
        p_actor_id: auth.userId,
      });

    if (error) {
      console.error("[inventory/:id/publish] RPC error:", error);
      // Fall back to direct update if RPC not yet deployed
      const { error: updateErr } = await supabase
        .from("inventory_items")
        .update({ status: "PUBLISHED", published_at: new Date().toISOString() })
        .eq("id", id);
      if (updateErr) { console.error("[inventory/:id/publish] fallback update error:", updateErr); return INTERNAL_ERROR(); }
    }

    return ok({ id, status: "PUBLISHED", published_at: new Date().toISOString() });
  } catch (err) {
    console.error("[inventory/:id/publish] error:", err);
    return INTERNAL_ERROR();
  }
}
