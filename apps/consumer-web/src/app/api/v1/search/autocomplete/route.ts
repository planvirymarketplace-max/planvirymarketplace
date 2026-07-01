/**
 * GET /api/v1/search/autocomplete
 *
 * Lightweight prefix-match autocomplete. Returns up to 20 items grouped by
 * type (items, vendors, categories) for the search-bar dropdown.
 *
 * Query params:
 *   q (required)        — prefix (>=1 char)
 *   location_id?        — gate to a location (BR-GLOBAL-001)
 *   limit?              — max results per type (default 8, max 20)
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ok, tooMany } from "@/lib/api/envelope"
import { handleError, ValidationError } from "@/lib/api/errors"
import { getAuthContext } from "@/lib/api/auth"
import { autocompleteQuerySchema } from "@/lib/api/schemas"
import {
  buildRateLimitKey,
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/api/rate-limit"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = autocompleteQuerySchema.parse(
      Object.fromEntries(searchParams.entries()),
    )

    const supabase = await createClient()
    const ctx = await getAuthContext(supabase)

    const rlKey = buildRateLimitKey(ctx?.userId, getClientIp(request), "autocomplete")
    const rl = checkRateLimit(rlKey, RATE_LIMITS.autocomplete)
    if (!rl.allowed) return tooMany()

    const admin = createAdminClient()
    const q = parsed.q.trim().replace(/[%_]/g, (m) => "\\" + m)
    const limit = parsed.limit

    // ─── Three parallel prefix queries ───────────────────────────────────────
    const [itemsRes, vendorsRes, locationsRes] = await Promise.all([
      admin
        .from("inventory_items")
        .select("id, title, slug, category, base_price_cents, currency")
        .eq("status", "PUBLISHED")
        .ilike("title", `${q}%`)
        .order("quality_score", { ascending: false, nullsFirst: true })
        .limit(limit),
      admin
        .from("vendor_accounts")
        .select("id, name, slug")
        .eq("status", "ACTIVE")
        .ilike("name", `${q}%`)
        .order("name", { ascending: true })
        .limit(limit),
      admin
        .from("locations")
        .select("id, name, slug, region, country_code")
        .or(`name.ilike.${q}%,region.ilike.${q}%`)
        .order("name", { ascending: true })
        .limit(limit),
    ])

    if (itemsRes.error || vendorsRes.error || locationsRes.error) {
      throw new ValidationError(
        "AUTOCOMPLETE_FAILED",
        itemsRes.error?.message ?? vendorsRes.error?.message ?? locationsRes.error?.message ?? "Unknown error",
      )
    }

    return ok(
      {
        q: parsed.q,
        items: (itemsRes.data ?? []).map((i) => ({
          id: i.id,
          label: i.title,
          slug: i.slug,
          type: "item",
          category: i.category,
          price_cents: i.base_price_cents,
          currency: i.currency,
        })),
        vendors: (vendorsRes.data ?? []).map((v) => ({
          id: v.id,
          label: v.name,
          slug: v.slug,
          type: "vendor",
        })),
        locations: (locationsRes.data ?? []).map((l) => ({
          id: l.id,
          label: l.name,
          slug: l.slug,
          region: l.region,
          country_code: l.country_code,
          type: "location",
        })),
      },
      {
        total:
          (itemsRes.data?.length ?? 0) +
          (vendorsRes.data?.length ?? 0) +
          (locationsRes.data?.length ?? 0),
        rate_limit: { remaining: rl.remaining, reset_at: rl.resetAt },
      },
    )
  } catch (err) {
    return handleError(err)
  }
}
