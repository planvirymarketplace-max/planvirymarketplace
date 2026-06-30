/**
 * Part XI §11.3.6 — GET /api/v1/search
 * Primary full-text + faceted search. Uses Postgres ILIKE + pg_trgm (Algolia integration in Part XVII).
 * Auth: optional. Rate: 300/min/IP. BR-GLOBAL-001: location required.
 * P95 < 150ms (Algolia); < 1500ms (DB fallback).
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, LOCATION_REQUIRED, QUERY_TOO_SHORT, RATE_LIMITED, INTERNAL_ERROR } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { SearchQuery } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.search, auth);
  if (rateLimited) return rateLimited;

  const url = new URL(req.url);
  const params: Record<string, string | string[] | undefined> = {};
  url.searchParams.forEach((v, k) => {
    const existing = params[k];
    params[k] = existing ? Array.isArray(existing) ? [...existing, v] : [existing, v] : v;
  });

  const parsed = SearchQuery.safeParse(params);
  if (!parsed.success) {
    const hasLocation = params.location_id || (params.lat && params.lng);
    if (!hasLocation) return LOCATION_REQUIRED();
    if (!params.q || params.q.length < 1) return QUERY_TOO_SHORT();
    return zodErrors(parsed.error);
  }
  const { q, page, per_page, category, price_min_cents, price_max_cents, location_id, sort } = parsed.data;

  try {
    // Postgres full-text search via ILIKE on title + description (pg_trgm fallback per Part XVII §17.21)
    let query = supabase
      .from("inventory_items")
      .select(`
        id, title, slug, category, base_price_cents, quality_score,
        vendor_accounts!inner(name, slug),
        locations!inner(name, region),
        media_assets(url, is_primary)
      `, { count: "exact" })
      .eq("status", "PUBLISHED")
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`);

    if (location_id) query = query.eq("location_id", location_id);
    if (category && category.length > 0) query = query.in("category", category);
    if (price_min_cents !== undefined) query = query.gte("base_price_cents", price_min_cents);
    if (price_max_cents !== undefined) query = query.lte("base_price_cents", price_max_cents);

    if (sort === "price_asc") query = query.order("base_price_cents", { ascending: true });
    else if (sort === "price_desc") query = query.order("base_price_cents", { ascending: false });
    else if (sort === "newest") query = query.order("created_at", { ascending: false });
    else query = query.order("quality_score", { ascending: false });

    const offset = (page - 1) * per_page;
    query = query.range(offset, offset + per_page - 1);

    const { data, count, error } = await query;
    if (error) { console.error("[search GET]", error); return INTERNAL_ERROR(); }

    // Compute facets
    const { data: allCats } = await supabase
      .from("inventory_items")
      .select("category")
      .eq("status", "PUBLISHED")
      .eq("location_id", location_id ?? "");
    const catCounts: Record<string, number> = {};
    for (const r of allCats ?? []) { catCounts[(r as { category: string }).category] = (catCounts[(r as { category: string }).category] ?? 0) + 1; }

    return ok({
      hits: (data ?? []).map((item: Record<string, unknown>) => {
        const vendor = Array.isArray(item.vendor_accounts) ? item.vendor_accounts[0] : item.vendor_accounts;
        const loc = Array.isArray(item.locations) ? item.locations[0] : item.locations;
        const media = (item.media_assets as Array<{ url: string; is_primary: boolean }> | null) ?? [];
        return {
          item_id: item.id,
          title: item.title,
          category: item.category,
          price_cents: item.base_price_cents,
          vendor_name: vendor?.name,
          location_name: loc?.name,
          score: Number(item.quality_score),
          media: media.filter((m) => m.is_primary).map((m) => m.url),
        };
      }),
      facets: { category: catCounts, price_range: { min: 0, max: 0 } },
      total_hits: count ?? 0,
      page,
      per_page,
      query_id: randomUUID(),
    });
  } catch (err) {
    console.error("[search GET] error:", err);
    return INTERNAL_ERROR();
  }
}
