/**
 * Part XI §11.2.1 — Response Envelope.
 *
 * All REST endpoints return a structured JSON envelope:
 *   Success: { "data": <payload>, "meta": { "request_id": "<uuid>" } }
 *   Error:   { "error": { "code": "<CODE>", "message": "<human>", "field": "<field|null>" }, "meta": { "request_id": "<uuid>" } }
 */

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export interface ApiMeta {
  request_id: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    field: string | null;
  };
  meta: ApiMeta;
}

export function requestId(): string {
  return randomUUID();
}

/** Build a 200/201 success envelope. */
export function ok<T>(data: T, status: 200 | 201 = 200, extraHeaders?: HeadersInit): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    { data, meta: { request_id: requestId() } },
    { status, headers: extraHeaders },
  );
}

/** Build a 204 No Content (DELETE, status-only actions). */
export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/**
 * Build an error envelope. Part XI §11.2.2 — HTTP Status Code Convention.
 */
export function error(
  status: number,
  code: string,
  message: string,
  field: string | null = null,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { error: { code, message, field }, meta: { request_id: requestId() } },
    { status },
  );
}
