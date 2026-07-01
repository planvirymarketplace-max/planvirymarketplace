/**
 * Planviry — v1 API Rate Limiting
 *
 * In-memory fixed-window rate limiter. Each `key` (typically
 * `${userId|ip}:${action}`) is allowed `max` calls per `windowMs`. When the
 * window elapses the counter resets.
 *
 * This is intentionally NOT Redis-backed — Part 0 spec calls out "Local
 * memory caching, no additional middleware". In a multi-instance deploy the
 * limits become per-instance (effectively `max * instance_count`); acceptable
 * for now and clearly documented for the Phase 16 performance pass.
 *
 * Limits are conservative defaults — tune via env if needed.
 */

export interface RateLimitConfig {
  windowMs: number
  max: number
}

export const RATE_LIMITS = {
  // Auth — strict to prevent credential stuffing
  authRegister: { windowMs: 60_000, max: 5 },
  authMe: { windowMs: 60_000, max: 60 },
  authPatch: { windowMs: 60_000, max: 20 },

  // Inventory — vendors create/edit listings; reasonable headroom
  inventoryList: { windowMs: 60_000, max: 120 },
  inventoryCreate: { windowMs: 60_000, max: 30 },
  inventoryGet: { windowMs: 60_000, max: 120 },
  inventoryUpdate: { windowMs: 60_000, max: 60 },
  inventoryDelete: { windowMs: 60_000, max: 20 },
  inventoryTransition: { windowMs: 60_000, max: 30 },

  // Reservations — read-heavy
  reservationsList: { windowMs: 60_000, max: 60 },
  reservationsGet: { windowMs: 60_000, max: 60 },
  reservationsCancel: { windowMs: 60_000, max: 20 },

  // Cart
  cartGet: { windowMs: 60_000, max: 120 },
  cartAdd: { windowMs: 60_000, max: 60 },
  cartRemove: { windowMs: 60_000, max: 60 },
  cartCheckout: { windowMs: 60_000, max: 10 },

  // Itineraries
  itinerariesCreate: { windowMs: 60_000, max: 30 },
  itinerariesGet: { windowMs: 60_000, max: 60 },
  itinerariesShare: { windowMs: 60_000, max: 30 },

  // Search — highest traffic
  search: { windowMs: 60_000, max: 120 },
  autocomplete: { windowMs: 60_000, max: 240 },
} as const satisfies Record<string, RateLimitConfig>

export type RateLimitKey = keyof typeof RATE_LIMITS

// ─── Internal store ─────────────────────────────────────────────────────────

interface Bucket {
  count: number
  resetAt: number
}

// Lazy per-process Map. Use a global to survive HMR in dev.
const store: Map<string, Bucket> =
  (globalThis as unknown as { __planviryRLStore?: Map<string, Bucket> }).__planviryRLStore ??
  new Map<string, Bucket>()
;(globalThis as unknown as { __planviryRLStore?: Map<string, Bucket> }).__planviryRLStore = store

// Periodic GC so the map doesn't grow unbounded. Sweep on every check.
function sweep(now: number) {
  if (store.size < 4096) return
  for (const [k, b] of store) {
    if (b.resetAt <= now) store.delete(k)
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfterMs: number
}

/**
 * Check the rate limit for a key/config. Mutates the in-memory bucket.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig | RateLimitKey,
): RateLimitResult {
  const cfg: RateLimitConfig =
    typeof config === "string" ? RATE_LIMITS[config] : config

  const now = Date.now()
  sweep(now)

  const bucket = store.get(key)
  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + cfg.windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: cfg.max - 1, resetAt, retryAfterMs: 0 }
  }

  bucket.count += 1
  const remaining = Math.max(0, cfg.max - bucket.count)
  const allowed = bucket.count <= cfg.max
  return {
    allowed,
    remaining,
    resetAt: bucket.resetAt,
    retryAfterMs: allowed ? 0 : bucket.resetAt - now,
  }
}

/**
 * Build a rate-limit key from the request and an action label.
 * Prefers `user.id` when authenticated, falls back to client IP.
 */
export function buildRateLimitKey(
  userId: string | null | undefined,
  ip: string | null | undefined,
  action: string,
): string {
  return `${userId ?? ip ?? "anonymous"}:${action}`
}

/**
 * Extract the client IP from a NextRequest. Falls back to "unknown" so the
 * key is still well-formed (rate-limit becomes global for unknown-origin).
 */
export function getClientIp(request: Request): string | null {
  const headers = request.headers
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    null
  )
}
