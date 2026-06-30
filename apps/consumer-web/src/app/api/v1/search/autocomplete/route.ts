/**
 * Part XI §11.3.6 — GET /api/v1/search/autocomplete
 * Autocomplete for Plan bar "What" field. Rate: 600/min/IP. P99 < 80ms.
 * Cached at Edge for 300s when q >= 4 chars.
 */
import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import { zodErrors, RATE_LIMITED, INTERNAL_ERROR } from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { AutocompleteQuery } from "@/lib/api/schemas";
import { supabase } from "@planviry/db";

export async function GET(req: NextRequest) {
  const auth = getAuthContext(req);
  const rateLimited = checkRateLimit(req, RATE_LIMITS.autocomplete, auth);
  if (rateLimited) return rateLimited;

  const url = new URL(req.url);
  const params: Record<string, string | undefined> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  const parsed = AutocompleteQuery.safeParse(params);
  if (!parsed.success) return zodErrors(parsed.error);
  const { q, category } = parsed.data;

  try {
    // Query inventory items + taxonomy nodes for suggestions
    let itemQuery = supabase
      .from("inventory_items")
      .select("title, category")
      .eq("status", "PUBLISHED")
      .ilike("title", `%${q}%`)
      .limit(5);
    if (category) itemQuery = itemQuery.eq("category", category);
    const { data: items } = await itemQuery;

    // Query taxonomy nodes for category suggestions
    const { data: taxNodes } = await supabase
      .from("taxonomy_nodes")
      .select("name, node_type")
      .ilike("name", `%${q}%`)
      .limit(3);

    const suggestions: Array<{ text: string; type: "category" | "query" | "item"; category?: string }> = [];
    for (const t of taxNodes ?? []) {
      suggestions.push({ text: (t as { name: string }).name, type: "category" });
    }
    for (const i of items ?? []) {
      suggestions.push({ text: (i as { title: string; category: string }).title, type: "item", category: (i as { category: string }).category });
    }

    const cacheControl = q.length >= 4 ? { "Cache-Control": "public, max-age=300, s-maxage=300" } : undefined;
    return ok({ suggestions }, 200, cacheControl);
  } catch (err) {
    console.error("[autocomplete GET] error:", err);
    return INTERNAL_ERROR();
  }
}
