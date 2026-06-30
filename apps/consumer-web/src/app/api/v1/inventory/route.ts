/**
 * Part XI §11.3.2 — GET /api/v1/inventory  +  POST /api/v1/inventory
 *
 * GET:  Paginated list of published InventoryItems. Auth: optional. Rate: 300/min/IP.
 *       BR-GLOBAL-001: location param required → 400 LOCATION_REQUIRED if missing.
 * POST: Create new InventoryItem in DRAFT state. Auth: VENDOR_OWNER/MANAGER. Rate: 60/hour/vendor.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  zodErrors, LOCATION_REQUIRED, INVALID_CATEGORY, NOT_A_VENDOR,
  RATE_LIMITED, INTERNAL_ERROR, UNAUTHORIZED, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { InventoryListQuery, InventoryCreateInput } from "@/lib/api/schemas";

// ─── GET /api/v1/inventory ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.catalogBrowse, auth);
  if (rateLimited) return rateLimited;

  // Parse query params
  const url = new URL(req.url);
  const params: Record<string, string | string[] | undefined> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const parsed = InventoryListQuery.safeParse(params);
  if (!parsed.success) {
    // Check specifically for location requirement (BR-GLOBAL-001)
    const hasLocation = params.location_id || (params.lat && params.lng);
    if (!hasLocation) return LOCATION_REQUIRED();
    return zodErrors(parsed.error);
  }

  const { page, per_page, category } = parsed.data;

  // BR-GLOBAL-001: No results without location (already enforced by schema refine)
  // Part VI: query InventoryItem table via @planviry/db with RLS-scoped filters.
  // Until Part VI, return empty result set with proper pagination envelope.
  try {
    return ok({
      items: [], // Part VI: populate from inventory_items table
      total: 0,
      page,
      per_page,
      has_next: false,
    }, 200, {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    });
  } catch (err) {
    console.error("[inventory GET] error:", err);
    return INTERNAL_ERROR();
  }
}

// ─── POST /api/v1/inventory ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();

  // BR-I-001: must be a vendor (VENDOR_OWNER or VENDOR_MANAGER)
  if (!auth.vendorId || (auth.vendorRole !== "VENDOR_OWNER" && auth.vendorRole !== "VENDOR_MANAGER")) {
    return NOT_A_VENDOR();
  }

  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }

  const parsed = InventoryCreateInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  // BR-I-001: valid category (enforced by Zod enum)
  // BR-I-006: price validation (enforced by Zod)
  // BR-I-002: metadata validation per category (Part VI implements per-category validators)

  try {
    // Part VI: Insert into inventory_items table with status='DRAFT', vendor_id=auth.vendorId
    // Until Part VI schema is built, return 501 with contract-validated message.
    return error(
      501,
      "SCHEMA_PENDING",
      "InventoryItem schema is pending Part VI (Data Layer). API contract validated; DB write pending.",
      null,
    );
  } catch (err) {
    console.error("[inventory POST] error:", err);
    return INTERNAL_ERROR();
  }
}
