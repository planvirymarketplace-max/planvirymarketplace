/**
 * Planviry — v1 API Envelope
 *
 * Standard response shape for every `/api/v1/*` route:
 *
 *   Success: { ok: true,  data: T, meta?: { ... } }
 *   Error:   { ok: false, error: { code: string, message: string, details?: unknown } }
 *
 * The envelope is intentionally minimal so the frontend `useApi` hook can
 * branch on `body.ok` without inspecting HTTP status first, while the HTTP
 * status still matches the semantic outcome (201 on create, 202 on accept,
 * 4xx/5xx on error).
 */

import { NextResponse } from "next/server"

export interface OkMeta {
  /** Cursor / offset pagination. */
  limit?: number
  offset?: number
  total?: number
  /** Pagination cursors (optional alternative to offset). */
  cursor?: string | null
  /** Arbitrary extra metadata (rate-limit headers, etc.). */
  [key: string]: unknown
}

export interface ApiErrorPayload {
  code: string
  message: string
  details?: unknown
}

export interface OkEnvelope<T> {
  ok: true
  data: T
  meta?: OkMeta
}

export interface ErrEnvelope {
  ok: false
  error: ApiErrorPayload
}

// ─── Success helpers ────────────────────────────────────────────────────────

export function ok<T>(data: T, meta?: OkMeta, init?: ResponseInit): NextResponse<OkEnvelope<T>> {
  return NextResponse.json({ ok: true, data, meta }, { status: 200, ...init })
}

export function created<T>(data: T, meta?: OkMeta): NextResponse<OkEnvelope<T>> {
  return NextResponse.json({ ok: true, data, meta }, { status: 201 })
}

export function accepted<T>(data: T, meta?: OkMeta): NextResponse<OkEnvelope<T>> {
  return NextResponse.json({ ok: true, data, meta }, { status: 202 })
}

// ─── Error helpers ───────────────────────────────────────────────────────────

export function error(
  status: number,
  code: string,
  message: string,
  details?: unknown,
): NextResponse<ErrEnvelope> {
  const payload: ErrEnvelope = { ok: false, error: { code, message } }
  if (details !== undefined) payload.error.details = details
  return NextResponse.json(payload, { status })
}

// ─── Common status shorthands ────────────────────────────────────────────────

export const badRequest = (code: string, message: string, details?: unknown) =>
  error(400, code, message, details)

export const unauthorized = (message = "Authentication required", details?: unknown) =>
  error(401, "UNAUTHORIZED", message, details)

export const forbidden = (message = "You do not have access to this resource", details?: unknown) =>
  error(403, "FORBIDDEN", message, details)

export const notFound = (message = "Resource not found", details?: unknown) =>
  error(404, "NOT_FOUND", message, details)

export const conflict = (code: string, message: string, details?: unknown) =>
  error(409, code, message, details)

export const unprocessable = (code: string, message: string, details?: unknown) =>
  error(422, code, message, details)

export const tooMany = (message = "Too many requests", details?: unknown) =>
  error(429, "RATE_LIMITED", message, details)

export const serverError = (message = "Internal server error", details?: unknown) =>
  error(500, "INTERNAL_ERROR", message, details)
