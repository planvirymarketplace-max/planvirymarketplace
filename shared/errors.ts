/**
 * Error class taxonomy — Part I §1.3 "Fail Loudly" principle.
 * Part XXVIII §28.x Security + Part XXXIII §33.16 Named Failure Modes.
 *
 * Every operational failure has an explicit error code, user message, and
 * recovery path (Part 0 §0.3 C-08).
 */

export interface PlanviryErrorOptions {
  code: string;
  /** User-safe message (no internals). */
  message: string;
  /** HTTP status for API translation. */
  statusCode?: number;
  /** Internal context (PII redacted by logger). */
  cause?: unknown;
  /** Whether this error is safe to retry. */
  retryable?: boolean;
}

export class PlanviryError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly retryable: boolean;
  readonly cause?: unknown;

  constructor(opts: PlanviryErrorOptions) {
    super(opts.message);
    this.name = "PlanviryError";
    this.code = opts.code;
    this.statusCode = opts.statusCode ?? 500;
    this.retryable = opts.retryable ?? false;
    this.cause = opts.cause;
  }
}

export class ValidationError extends PlanviryError {
  constructor(message: string, cause?: unknown) {
    super({ code: "VALIDATION_ERROR", message, statusCode: 422, cause, retryable: false });
    this.name = "ValidationError";
  }
}

export class AuthError extends PlanviryError {
  constructor(message = "Unauthorized", cause?: unknown) {
    super({ code: "AUTH_ERROR", message, statusCode: 401, cause, retryable: false });
    this.name = "AuthError";
  }
}

export class ForbiddenError extends PlanviryError {
  constructor(message = "Forbidden", cause?: unknown) {
    super({ code: "FORBIDDEN", message, statusCode: 403, cause, retryable: false });
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends PlanviryError {
  constructor(resource: string, cause?: unknown) {
    super({ code: "NOT_FOUND", message: `${resource} not found`, statusCode: 404, cause, retryable: false });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends PlanviryError {
  constructor(message: string, cause?: unknown) {
    super({ code: "CONFLICT", message, statusCode: 409, cause, retryable: false });
    this.name = "ConflictError";
  }
}

export class RateLimitError extends PlanviryError {
  constructor(message = "Too many requests", cause?: unknown) {
    super({ code: "RATE_LIMIT", message, statusCode: 429, cause, retryable: true });
    this.name = "RateLimitError";
  }
}

export class LocationGateError extends PlanviryError {
  constructor(message = "Please select a location to search.", cause?: unknown) {
    super({ code: "LOCATION_GATE", message, statusCode: 400, cause, retryable: false });
    this.name = "LocationGateError";
  }
}
