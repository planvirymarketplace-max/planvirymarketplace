/**
 * Part XI §11.3.6 — GET /api/v1/search/autocomplete
 *
 * Autocomplete suggestions for the Plan bar "What" field.
 * Auth: optional. Rate: 600/min/IP (burst 1000/5s). P99 < 80ms.
 * Results for q >= 4 chars cached at Edge for 300s.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, RATE_LIMITED, INTERNAL_ERROR, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { AutocompleteQuery } from "@/lib/api/schemas";

export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.autocomplete, auth);
  if (rateLimited) return rateLimited;

  const url = new URL(req.url);
  const params: Record<string, string | undefined> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const parsed = AutocompleteQuery.safeParse(params);
  if (!parsed.success) return zodErrors(parsed.error);

  const { q, category, location_id } = parsed.data;

  try {
    // Part XVII: query Algolia autocomplete index or Postgres pg_trgm.
    // Return suggestions typed: 'category' | 'query' | 'item'
    const cacheControl = q.length >= 4
      ? { "Cache-Control": "public, max-age=300, s-maxage=300" }
      : undefined;

    return ok({
      suggestions: [], // Part XVII: populate from search index
    }, 200, cacheControl);
  } catch (err) {
    console.error("[search/autocomplete GET] error:", err);
    return INTERNAL_ERROR();
  }
}
