/**
 * Planviry — v1 API Error Classes
 *
 * Each domain error carries a `code` (machine-readable) and an `httpStatus`
 * (the wire status used by the envelope). Route handlers throw these freely;
 * `handleError(err)` at the top of each handler converts them to a properly
 * shaped JSON envelope.
 */

import { NextResponse } from "next/server"
import { error as envelopeError, type ErrEnvelope } from "./envelope"

export abstract class ApiError extends Error {
  abstract readonly code: string
  abstract readonly httpStatus: number
  details?: unknown

  constructor(message: string, details?: unknown) {
    super(message)
    this.name = this.constructor.name
    if (details !== undefined) this.details = details
  }

  toResponse(): NextResponse<ErrEnvelope> {
    return envelopeError(this.httpStatus, this.code, this.message, this.details)
  }
}

export class ValidationError extends ApiError {
  readonly code = "VALIDATION_ERROR"
  readonly httpStatus = 422
  constructor(message = "Request payload failed validation", details?: unknown) {
    super(message, details)
  }
}

export class BadRequestError extends ApiError {
  readonly code = "BAD_REQUEST"
  readonly httpStatus = 400
  constructor(message = "Malformed request", details?: unknown) {
    super(message, details)
  }
}

export class AuthError extends ApiError {
  readonly code = "UNAUTHORIZED"
  readonly httpStatus = 401
  constructor(message = "Authentication required", details?: unknown) {
    super(message, details)
  }
}

export class ForbiddenError extends ApiError {
  readonly code = "FORBIDDEN"
  readonly httpStatus = 403
  constructor(message = "You do not have access to this resource", details?: unknown) {
    super(message, details)
  }
}

export class NotFoundError extends ApiError {
  readonly code = "NOT_FOUND"
  readonly httpStatus = 404
  constructor(message = "Resource not found", details?: unknown) {
    super(message, details)
  }
}

export class ConflictError extends ApiError {
  readonly code = "CONFLICT"
  readonly httpStatus = 409
  constructor(message = "Request conflicts with current resource state", details?: unknown) {
    super(message, details)
  }
}

export class RateLimitError extends ApiError {
  readonly code = "RATE_LIMITED"
  readonly httpStatus = 429
  retryAfterMs: number
  constructor(message = "Too many requests", retryAfterMs = 60_000, details?: unknown) {
    super(message, details)
    this.retryAfterMs = retryAfterMs
  }

  toResponse(): NextResponse<ErrEnvelope> {
    return NextResponse.json(
      { ok: false, error: { code: this.code, message: this.message, details: this.details } },
      { status: this.httpStatus, headers: { "Retry-After": String(Math.ceil(this.retryAfterMs / 1000)) } },
    )
  }
}

export class StripeError extends ApiError {
  readonly code = "STRIPE_ERROR"
  readonly httpStatus = 502
  constructor(message = "Stripe request failed", details?: unknown) {
    super(message, details)
  }
}

/**
 * Convert any thrown value into an envelope-shaped response.
 * Unknown errors become a generic 500 with the original message redacted
 * in production (we still log it server-side).
 */
export function handleError(err: unknown): NextResponse<ErrEnvelope> {
  if (err instanceof ApiError) return err.toResponse()

  // Zod issues → 422 with structured details.
  if (err && typeof err === "object" && "issues" in err && Array.isArray((err as { issues: unknown }).issues)) {
    const zErr = err as { issues: Array<{ path: (string|number)[]; message: string }> }
    return envelopeError(
      422,
      "VALIDATION_ERROR",
      "Request payload failed validation",
      zErr.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    )
  }

  const message = err instanceof Error ? err.message : "Unknown error"
  console.error("[v1 api] unhandled error:", err)
  return envelopeError(500, "INTERNAL_ERROR", "Internal server error", process.env.NODE_ENV === "development" ? message : undefined)
}

export type { ErrEnvelope }
