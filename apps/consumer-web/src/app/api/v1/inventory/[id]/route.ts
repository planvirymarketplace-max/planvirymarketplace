/**
 * Part XI §11.3.2 — GET /api/v1/inventory/:id  +  PATCH  +  DELETE
 *
 * GET:    Full detail for a single InventoryItem. Auth: optional. Rate: 600/min/IP. P95 < 150ms.
 * PATCH:  Update DRAFT or PAUSED item. Auth: owning vendor. Rate: 120/hour/vendor.
 * DELETE: Archive (soft-delete). Auth: VENDOR_OWNER only. BR-I-003: active reservations block.
 */

import type { NextRequest } from "next/server";
import { ok, noContent } from "@/lib/api/envelope";
import {
  zodErrors, NOT_FOUND, NOT_AUTHORIZED, HAS_ACTIVE_RESERVATIONS,
  RATE_LIMITED, INTERNAL_ERROR, NOT_VENDOR_OWNER, UNAUTHORIZED, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { InventoryPatchInput } from "@/lib/api/schemas";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/v1/inventory/:id ──────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, { limit: 600, windowMs: 60_000, scope: "ip" }, auth);
  if (rateLimited) return rateLimited;

  const { id } = await params;

  // Part VI: query inventory_items by id with RLS (PUBLISHED visible to anon;
  // DRAFT/PAUSED visible to owning vendor staff). Until Part VI: 404.
  try {
    return NOT_FOUND("InventoryItem");
  } catch (err) {
    console.error("[inventory/:id GET] error:", err);
    return INTERNAL_ERROR();
  }
}

// ─── PATCH /api/v1/inventory/:id ────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const { id } = await params;

  // BR-I-004: only owning vendor may update
  // Part VI: RLS enforces vendor_id scoping. Application-layer check:
  if (!auth.vendorId) return NOT_AUTHORIZED();

  const rateLimited = checkRateLimit(req, { limit: 120, windowMs: 3_600_000, scope: "vendor" }, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }

  const parsed = InventoryPatchInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  try {
    // Part VI: load item, verify auth.vendorId === item.vendor_id, update.
    // If item is PUBLISHED: re-queue Algolia index update.
    // If capacity reduction: check BR for active reservations (409 HAS_ACTIVE_RESERVATIONS).
    return error(501, "SCHEMA_PENDING", "InventoryItem schema pending Part VI.", null);
  } catch (err) {
    console.error("[inventory/:id PATCH] error:", err);
    return INTERNAL_ERROR();
  }
}

// ─── DELETE /api/v1/inventory/:id ───────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  const { id } = await params;

  // VENDOR_OWNER only
  if (auth.vendorRole !== "VENDOR_OWNER") return NOT_VENDOR_OWNER();

  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  try {
    // BR-I-003: item with active (PENDING or CONFIRMED) Reservations cannot be archived → 409
    // Part VI: check reservations count, then soft-delete (status='ARCHIVED', archived_at=NOW()).
    // Remove from Algolia.
    return error(501, "SCHEMA_PENDING", "InventoryItem schema pending Part VI.", null);
  } catch (err) {
    console.error("[inventory/:id DELETE] error:", err);
    return INTERNAL_ERROR();
  }
}
