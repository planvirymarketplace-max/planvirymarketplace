/**
 * Part XI §11.3.2 — GET /api/v1/inventory/:id  +  PATCH  +  DELETE
 * GET:    Full detail. Auth: optional. P95 < 150ms.
 * PATCH:  Update DRAFT/PAUSED. Auth: owning vendor. Rate: 120/hour/vendor.
 * DELETE: Archive (soft). Auth: VENDOR_OWNER. BR-I-003: active reservations block.
 */
import type { NextRequest } from "next/server";
import { ok, noContent } from "@/lib/api/envelope";
import { zodErrors, NOT_FOUND, NOT_AUTHORIZED, HAS_ACTIVE_RESERVATIONS, RATE_LIMITED, INTERNAL_ERROR, UNAUTHORIZED } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { InventoryPatchInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";

type Params = { params: Promise<{ id: string }> };

// GET /api/v1/inventory/:id
export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, { limit: 600, windowMs: 60_000, scope: "ip" }, auth);
  if (rateLimited) return rateLimited;

  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from("inventory_items")
      .select(`
        id, title, slug, description, category, status, base_price_cents, currency,
        max_quantity_per_booking, cancellation_policy, quality_score, metadata, published_at,
        vendor_id, location_id,
        vendor_accounts!inner(id, name, slug, stripe_connect_account_id, status),
        media_assets(id, url, alt_text, media_type, sort_order, is_primary),
        pricing_rules(id, rule_type, modifier_type, modifier_value, start_date, end_date, priority),
        availability_blocks(id, start_time, end_time, total_capacity, reserved_capacity, is_available)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) { console.error("[inventory/:id GET]", error); return INTERNAL_ERROR(); }
    if (!data) return NOT_FOUND("InventoryItem");

    // RLS: DRAFT/PAUSED visible only to owning vendor staff
    const isOwner = auth.vendorId === data.vendor_id;
    if ((data.status === "DRAFT" || data.status === "PAUSED" || data.status === "ARCHIVED") && !isOwner) {
      return NOT_FOUND("InventoryItem");
    }

    return ok(data, 200, { "Cache-Control": "public, max-age=120, stale-while-revalidate=600" });
  } catch (err) {
    console.error("[inventory/:id GET] error:", err);
    return INTERNAL_ERROR();
  }
}

// PATCH /api/v1/inventory/:id
export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  const { id } = await params;
  if (!auth.vendorId) return NOT_AUTHORIZED();

  const rateLimited = checkRateLimit(req, { limit: 120, windowMs: 3_600_000, scope: "vendor" }, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try { body = await req.json(); } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }
  const parsed = InventoryPatchInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  try {
    // BR-I-004: only owning vendor may update
    const { data: existing } = await supabase
      .from("inventory_items")
      .select("id, vendor_id, status")
      .eq("id", id)
      .maybeSingle();
    if (!existing) return NOT_FOUND("InventoryItem");
    if (existing.vendor_id !== auth.vendorId) return NOT_AUTHORIZED();

    const update: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) update.title = parsed.data.title;
    if (parsed.data.description !== undefined) update.description = parsed.data.description;
    if (parsed.data.price_cents !== undefined) update.base_price_cents = parsed.data.price_cents;
    if (parsed.data.metadata !== undefined) update.metadata = parsed.data.metadata;
    if (parsed.data.capacity !== undefined || parsed.data.quantity_available !== undefined) {
      const meta = (existing.metadata as Record<string, unknown>) ?? {};
      if (parsed.data.capacity !== undefined) meta.capacity = parsed.data.capacity;
      if (parsed.data.quantity_available !== undefined) meta.quantity_available = parsed.data.quantity_available;
      update.metadata = meta;
    }
    if (parsed.data.location_id !== undefined) update.location_id = parsed.data.location_id;

    const { data, error } = await supabase
      .from("inventory_items")
      .update(update)
      .eq("id", id)
      .select("*")
      .single();
    if (error) { console.error("[inventory/:id PATCH]", error); return INTERNAL_ERROR(); }

    return ok(data);
  } catch (err) {
    console.error("[inventory/:id PATCH] error:", err);
    return INTERNAL_ERROR();
  }
}

// DELETE /api/v1/inventory/:id
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  if (auth.vendorRole !== "VENDOR_OWNER") return NOT_AUTHORIZED();
  const { id } = await params;

  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  try {
    // BR-I-003: active (PENDING or CONFIRMED) reservations block archival
    const { count } = await supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("inventory_item_id", id)
      .in("status", ["PENDING", "CONFIRMED"]);
    if ((count ?? 0) > 0) return HAS_ACTIVE_RESERVATIONS();

    const { error } = await supabase
      .from("inventory_items")
      .update({ status: "ARCHIVED" })
      .eq("id", id)
      .eq("vendor_id", auth.vendorId!);
    if (error) { console.error("[inventory/:id DELETE]", error); return INTERNAL_ERROR(); }

    return noContent();
  } catch (err) {
    console.error("[inventory/:id DELETE] error:", err);
    return INTERNAL_ERROR();
  }
}
