/**
 * Part XI §11.3.10 — Rate Limit Summary.
 *
 * In-memory sliding-window rate limiter. Production uses Upstash Redis or
 * Supabase Edge rate-limiting; this in-memory implementation is correct for
 * single-instance dev and is swapped in Part XXX (Infrastructure).
 *
 * Rate limits (per spec §11.3.10):
 *   Search:            300 req / 1 min  / per IP  (burst 500/10s)
 *   Autocomplete:      600 req / 1 min  / per IP  (burst 1000/5s)
 *   Catalog browse:    300 req / 1 min  / per IP  (no burst)
 *   Auth endpoints:     10 req / 1 hour / per IP  (no burst)
 *   Checkout:           20 req / 1 hour / per user (no burst)
 *   Inventory write:    60 req / 1 hour / per vendor (no burst)
 *   Check-in:          600 req / 1 min  / per vendor (burst scanning)
 *   All other auth:    120 req / 1 min  / per user (no burst)
 */

import type { NextRequest } from "next/server";
import { RATE_LIMITED } from "./errors";
import type { AuthContext } from "./auth";

interface RateBucket {
  timestamps: number[];
}

const buckets = new Map<string, RateBucket>();

interface RateLimitConfig {
  limit: number;
  windowMs: number;
  scope: "ip" | "user" | "vendor";
  burstLimit?: number;
  burstWindowMs?: number;
}

export const RATE_LIMITS = {
  search:           { limit: 300, windowMs: 60_000, scope: "ip" as const, burstLimit: 500, burstWindowMs: 10_000 },
  autocomplete:     { limit: 600, windowMs: 60_000, scope: "ip" as const, burstLimit: 1000, burstWindowMs: 5_000 },
  catalogBrowse:    { limit: 300, windowMs: 60_000, scope: "ip" as const },
  auth:             { limit: 10, windowMs: 3_600_000, scope: "ip" as const },
  checkout:         { limit: 20, windowMs: 3_600_000, scope: "user" as const },
  inventoryWrite:   { limit: 60, windowMs: 3_600_000, scope: "vendor" as const },
  checkin:          { limit: 600, windowMs: 60_000, scope: "vendor" as const, burstLimit: 1000, burstWindowMs: 5_000 },
  authenticated:    { limit: 120, windowMs: 60_000, scope: "user" as const },
} satisfies Record<string, RateLimitConfig>;

/**
 * Check rate limit. Returns null if OK, or a 429 error Response if exceeded.
 */
export function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig,
  auth: AuthContext,
): null | ReturnType<typeof RATE_LIMITED> {
  const key = rateLimitKey(req, config, auth);
  const now = Date.now();

  // Prune expired entries.
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }

  // Main window check.
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < config.windowMs);
  if (bucket.timestamps.length >= config.limit) {
    return RATE_LIMITED();
  }

  // Burst window check (if configured).
  if (config.burstLimit && config.burstWindowMs) {
    const burstCount = bucket.timestamps.filter((t) => now - t < config.burstWindowMs!).length;
    if (burstCount >= config.burstLimit) {
      return RATE_LIMITED();
    }
  }

  bucket.timestamps.push(now);
  return null;
}

function rateLimitKey(req: NextRequest, config: RateLimitConfig, auth: AuthContext): string {
  const ip = getClientIp(req);
  switch (config.scope) {
    case "user":
      return `${config.scope}:${auth.userId ?? ip}`;
    case "vendor":
      return `${config.scope}:${auth.vendorId ?? ip}`;
    case "ip":
    default:
      return `ip:${ip}`;
  }
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}
