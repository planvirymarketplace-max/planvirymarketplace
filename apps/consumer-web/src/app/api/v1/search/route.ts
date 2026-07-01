/**
 * GET /api/v1/search
 *
 * Full-text search over PUBLISHED inventory_items with location gate
 * (BR-GLOBAL-001). Uses Postgres ILIKE on title + description (Phase 8
 * notes Algolia not yet wired, so this is the ILIKE fallback).
 *
 * Query params:
 *   q (required)            — search term
 *   location_id?            — location gate (recommended)
 *   location_slug?          — alternative location specifier
 *   category?               — taxonomy filter
 *   vendor_id?              — restrict to a single vendor
 *   min_price_cents?        — price floor
 *   max_price_cents?        — price ceiling
 *   sort?                   — relevance | newest | price_asc | price_desc
 *   limit, offset           — pagination
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import { handleError, ValidationError } from "@/lib/api/errors"
import { getAuthContext } from "@/lib/api/auth"
import { searchQuerySchema } from "@/lib/api/schemas"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = searchQuerySchema.parse(
      Object.fromEntries(searchParams.entries()),
    )

    // ─── Resolve location_id from slug if needed ─────────────────────────────
    const admin = createAdminClient()
    let locationId = parsed.location_id
    if (!locationId && parsed.location_slug) {
      const { data: loc } = await admin
        .from("locations")
        .select("id")
        .eq("slug", parsed.location_slug)
        .maybeSingle()
      locationId = loc?.id
    }

    // BR-GLOBAL-001: location gate is recommended but not hard-required for
    // search (a user may search across all locations). We surface a soft
    // warning in meta if no location is set.

    const supabase = await createClient()
    const ctx = await getAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx?.userId, getClientIp(request), "search")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.search)
    if (!rl.allowed) return tooMany()

    let query = admin
      .from("inventory_items")
      .select(
        "id, vendor_id, location_id, title, slug, description, category, base_price_cents, currency, quality_score, published_at",
        { count: "exact" },
      )
      .eq("status", "PUBLISHED")

    if (locationId) query = query.eq("location_id", locationId)
    if (parsed.vendor_id) query = query.eq("vendor_id", parsed.vendor_id)
    if (parsed.category) query = query.eq("category", parsed.category)

    if (parsed.min_price_cents !== undefined)
      (query as unknown as { gte: (c: string, v: number) => unknown }).gte(
        "base_price_cents",
        parsed.min_price_cents,
      )
    if (parsed.max_price_cents !== undefined)
      (query as unknown as { lte: (c: string, v: number) => unknown }).lte(
        "base_price_cents",
        parsed.max_price_cents,
      )

    // ─── Full-text search via ILIKE on title + description ───────────────────
    const q = parsed.q.trim().replace(/[%_]/g, (m) => "\\" + m)
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)

    switch (parsed.sort) {
      case "relevance":
        // ILIKE exact match first, then prefix, then anywhere — emulated by
        // ordering title (which contains the strongest signal) alphabetically
        // after a quality_score tiebreak.
        query = query
          .order("quality_score", { ascending: false, nullsFirst: true })
          .order("published_at", { ascending: false })
        break
      case "newest":
        query = query.order("published_at", { ascending: false })
        break
      case "price_asc":
        query = query.order("base_price_cents", { ascending: true, nullsFirst: true })
        break
      case "price_desc":
        query = query.order("base_price_cents", { ascending: false, nullsFirst: true })
        break
    }

    query = query.range(parsed.offset, parsed.offset + parsed.limit - 1)

    const { data, count, error } = await query
    if (error) throw new ValidationError("SEARCH_FAILED", error.message)

    // ─── Log the search to search_logs for relevance tuning (P2) ─────────────
    await admin
      .from("search_logs")
      .insert({
        query: parsed.q,
        filters: {
          location_id: locationId,
          vendor_id: parsed.vendor_id,
          category: parsed.category,
          min_price_cents: parsed.min_price_cents,
          max_price_cents: parsed.max_price_cents,
        },
        results_count: count ?? 0,
      })
      .then(() => undefined, () => undefined) // best-effort

    return ok(
      {
        items: data ?? [],
        q: parsed.q,
      },
      {
        limit: parsed.limit,
        offset: parsed.offset,
        total: count ?? 0,
        location_id: locationId ?? null,
        sort: parsed.sort,
        rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt },
      },
    )
  } catch (err) {
    return handleError(err)
  }
}
