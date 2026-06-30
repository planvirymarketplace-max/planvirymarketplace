/**
 * Part XI §11.3.6 — GET /api/v1/search
 *
 * Primary full-text + faceted search across all published InventoryItems.
 * Auth: optional. Rate: 300/min/IP (burst 500/10s).
 *
 * ⚠ BLOCKED: CONFLICT-007 (federated search ranking) must be resolved before
 * Algolia index schema is finalized. Endpoint contract is stable; backing
 * implementation detail depends on that resolution.
 *
 * Fallback: if Algolia unavailable, fall back to Postgres pg_trgm; response
 * includes meta.degraded_mode: true.
 */

import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { ok } from "@/lib/api/envelope";
import { zodErrors, LOCATION_REQUIRED, QUERY_TOO_SHORT, RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { SearchQuery } from "@/lib/api/schemas";

export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.search, auth);
  if (rateLimited) return rateLimited;

  const url = new URL(req.url);
  const params: Record<string, string | string[] | undefined> = {};
  url.searchParams.forEach((value, key) => {
    const existing = params[key];
    params[key] = existing ? Array.isArray(existing) ? [...existing, value] : [existing, value] : value;
  });

  const parsed = SearchQuery.safeParse(params);
  if (!parsed.success) {
    const hasLocation = params.location_id || (params.lat && params.lng);
    if (!hasLocation) return LOCATION_REQUIRED();
    if (!params.q || params.q.length < 1) return QUERY_TOO_SHORT();
    return zodErrors(parsed.error);
  }

  const { q, page, per_page, sort } = parsed.data;

  try {
    // Part XVII: query Algolia (or Postgres pg_trgm fallback).
    // CONFLICT-007: single index with category facet vs. multi-index merge — UNRESOLVED.
    // Until Part XVII: return empty result set with proper envelope.
    return ok({
      hits: [],
      facets: {
        category: {},
        price_range: { min: 0, max: 0 },
      },
      total_hits: 0,
      page,
      per_page,
      query_id: randomUUID(),
    });
  } catch (err) {
    console.error("[search GET] error:", err);
    return INTERNAL_ERROR();
  }
}

