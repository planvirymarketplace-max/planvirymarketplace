/**
 * Part XI §11.3.2 — GET /api/v1/inventory  +  POST /api/v1/inventory
 *
 * GET:  Paginated list of PUBLISHED InventoryItems. BR-GLOBAL-001: location required.
 *       Auth: optional. Rate: 300/min/IP. P95 < 200ms.
 * POST: Create InventoryItem in DRAFT. Auth: VENDOR_OWNER/MANAGER. Rate: 60/hour/vendor.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, LOCATION_REQUIRED, NOT_A_VENDOR, RATE_LIMITED, INTERNAL_ERROR, UNAUTHORIZED } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { InventoryListQuery, InventoryCreateInput } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";

// GET /api/v1/inventory
export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.catalogBrowse, auth);
  if (rateLimited) return rateLimited;

  const url = new URL(req.url);
  const params: Record<string, string | string[] | undefined> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  const parsed = InventoryListQuery.safeParse(params);
  if (!parsed.success) {
    const hasLocation = params.location_id || (params.lat && params.lng);
    if (!hasLocation) return LOCATION_REQUIRED();
    return zodErrors(parsed.error);
  }
  const { page, per_page, category, price_min_cents, price_max_cents, location_id, sort } = parsed.data;

  try {
    // Build query against live Supabase — only PUBLISHED items for public reads
    let query = supabase
      .from("inventory_items")
      .select(`
        id, title, slug, description, category, base_price_cents, currency,
        max_quantity_per_booking, quality_score, metadata, published_at,
        vendor_id, location_id,
        vendor_accounts!inner(name, slug),
        media_assets(url, alt_text, is_primary)
      `, { count: "exact" })
      .eq("status", "PUBLISHED");

    if (location_id) query = query.eq("location_id", location_id);
    if (category) query = query.eq("category", category);
    if (price_min_cents !== undefined) query = query.gte("base_price_cents", price_min_cents);
    if (price_max_cents !== undefined) query = query.lte("base_price_cents", price_max_cents);

    // Sort
    if (sort === "price_asc") query = query.order("base_price_cents", { ascending: true });
    else if (sort === "price_desc") query = query.order("base_price_cents", { ascending: false });
    else if (sort === "newest") query = query.order("created_at", { ascending: false });
    else query = query.order("quality_score", { ascending: false });

    const offset = (page - 1) * per_page;
    query = query.range(offset, offset + per_page - 1);

    const { data, count, error } = await query;
    if (error) { console.error("[inventory GET]", error); return INTERNAL_ERROR(); }

    return ok({
      items: (data ?? []).map((item: Record<string, unknown>) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        category: item.category,
        price_cents: item.base_price_cents,
        currency: item.currency,
        quality_score: Number(item.quality_score),
        vendor: Array.isArray(item.vendor_accounts) ? item.vendor_accounts[0] : item.vendor_accounts,
        media: (item.media_assets ?? []).filter((m: { is_primary: boolean }) => m.is_primary).slice(0, 1),
      })),
      total: count ?? 0,
      page,
      per_page,
      has_next: (count ?? 0) > offset + per_page,
    }, 200, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
  } catch (err) {
    console.error("[inventory GET] error:", err);
    return INTERNAL_ERROR();
  }
}

// POST /api/v1/inventory
export async function POST(req: NextRequest) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  if (!auth.vendorId || (auth.vendorRole !== "VENDOR_OWNER" && auth.vendorRole !== "VENDOR_MANAGER")) {
    return NOT_A_VENDOR();
  }
  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try { body = await req.json(); } catch {
    return zodErrors({ issues: [{ path: ["_body"], message: "Invalid JSON body." }] });
  }
  const parsed = InventoryCreateInput.safeParse(body);
  if (!parsed.success) return zodErrors(parsed.error);

  const { category, title, description, price_cents, is_free, location_id, metadata, capacity, quantity_available } = parsed.data;

  try {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 6);

    const { data, error } = await supabase
      .from("inventory_items")
      .insert({
        vendor_id: auth.vendorId,
        location_id,
        title,
        slug,
        description,
        category,
        status: "DRAFT",
        base_price_cents: is_free ? 0 : price_cents,
        metadata: { ...metadata, capacity, quantity_available },
      })
      .select("id, title, slug, category, status, base_price_cents, created_at")
      .single();

    if (error) {
      console.error("[inventory POST] DB error:", error);
      if (error.code === "23505") return zodErrors({ issues: [{ path: ["title"], message: "A listing with this title already exists." }] });
      return INTERNAL_ERROR();
    }

    return ok({ ...data, status: "DRAFT" }, 201);
  } catch (err) {
    console.error("[inventory POST] error:", err);
    return INTERNAL_ERROR();
  }
}
