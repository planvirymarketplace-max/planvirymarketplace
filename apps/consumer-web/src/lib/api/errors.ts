/**
 * Part XI §11.2.2 — HTTP Status Code Convention + Error Code Catalog.
 *
 * Every failure has an explicit error code, user message, and recovery path
 * (Part 0 §0.3 C-08). Error codes are SCREAMING_SNAKE_CASE.
 */

import { error as errorResponse } from "./envelope";
import type { NextResponse } from "next/server";

// ─── 400 Bad Request ────────────────────────────────────────────────────────
export const LOCATION_REQUIRED = (field = "location_id") =>
  errorResponse(400, "LOCATION_REQUIRED", "A location is required to search.", field);

export const INVALID_CATEGORY = (field = "category") =>
  errorResponse(400, "INVALID_CATEGORY", "Invalid inventory category.", field);

export const INVALID_DATE_RANGE = (field = "date_range") =>
  errorResponse(400, "INVALID_DATE_RANGE", "The date range is invalid (date_from must be before date_to).", field);

export const INVALID_PRICE = (field = "price_cents") =>
  errorResponse(400, "INVALID_PRICE", "Price must be a positive integer in cents (or zero with is_free=true).", field);

export const INVALID_METADATA = (field = "metadata") =>
  errorResponse(400, "INVALID_METADATA", "Listing is missing required metadata fields for this category.", field);

export const INVALID_QUANTITY = (field = "quantity") =>
  errorResponse(400, "INVALID_QUANTITY", "Quantity must be a positive integer.", field);

export const INVALID_TIER_TYPE = (field = "type") =>
  errorResponse(400, "INVALID_TIER_TYPE", "Invalid ticket tier type.", field);

export const INVALID_SALES_WINDOW = (field = "sales_window") =>
  errorResponse(400, "INVALID_SALES_WINDOW", "Sales end must be before event start time.", field);

export const INVALID_CONTACT = (field = "contact_value") =>
  errorResponse(400, "INVALID_CONTACT", "Invalid contact value for the chosen verification method.", field);

export const INVALID_CODE = (field = "verification_code") =>
  errorResponse(400, "INVALID_CODE", "The verification code is incorrect.", field);

export const CLAIM_TOKEN_EXPIRED = () =>
  errorResponse(400, "CLAIM_TOKEN_EXPIRED", "The claim token has expired. Please restart the claim flow.", null);

export const EMPTY_CART = () =>
  errorResponse(400, "EMPTY_CART", "Cannot check out an empty cart.", null);

export const CART_EXPIRED = () =>
  errorResponse(400, "CART_EXPIRED", "Your cart has expired. Please add items again.", null);

export const QUERY_TOO_SHORT = (field = "q") =>
  errorResponse(400, "QUERY_TOO_SHORT", "Search query must be 1–200 characters.", field);

export const VALIDATION_ERROR = (message: string, field: string | null = null) =>
  errorResponse(400, "VALIDATION_ERROR", message, field);

// ─── 401 Unauthorized ───────────────────────────────────────────────────────
export const UNAUTHORIZED = () =>
  errorResponse(401, "UNAUTHORIZED", "Authentication required.", null);

// ─── 403 Forbidden ──────────────────────────────────────────────────────────
export const FORBIDDEN = (message = "You do not have permission to perform this action.") =>
  errorResponse(403, "FORBIDDEN", message, null);

export const NOT_A_VENDOR = () =>
  errorResponse(403, "NOT_A_VENDOR", "Only vendor accounts may create inventory.", null);

export const NOT_AUTHORIZED = () =>
  errorResponse(403, "NOT_AUTHORIZED", "You do not have permission to edit this listing.", null);

export const NOT_VENDOR_OWNER = () =>
  errorResponse(403, "NOT_VENDOR_OWNER", "Only the vendor owner may perform this action.", null);

export const EMAIL_NOT_VERIFIED = () =>
  errorResponse(403, "EMAIL_NOT_VERIFIED", "Please verify your email before completing your booking.", null);

// ─── 404 Not Found ──────────────────────────────────────────────────────────
export const NOT_FOUND = (resource = "Resource") =>
  errorResponse(404, "NOT_FOUND", `${resource} not found.`, null);

export const ITEM_NOT_FOUND = () =>
  errorResponse(404, "ITEM_NOT_FOUND", "Inventory item not found.", null);

export const VENDOR_NOT_FOUND = () =>
  errorResponse(404, "VENDOR_NOT_FOUND", "Vendor not found.", null);

export const USER_NOT_FOUND = () =>
  errorResponse(404, "USER_NOT_FOUND", "User not found. The invited user must have an existing platform account.", null);

// ─── 409 Conflict ───────────────────────────────────────────────────────────
export const USER_ALREADY_EXISTS = () =>
  errorResponse(409, "USER_ALREADY_EXISTS", "A profile already exists for this user.", null);

export const ALREADY_CLAIMED = () =>
  errorResponse(409, "ALREADY_CLAIMED", "This vendor listing has already been claimed.", null);

export const ALREADY_A_MEMBER = () =>
  errorResponse(409, "ALREADY_A_MEMBER", "This user is already a member of this vendor account.", null);

export const ITEM_UNAVAILABLE = (field: string | null = null) =>
  errorResponse(409, "ITEM_UNAVAILABLE", "This item is no longer available for the selected dates.", field);

export const INVENTORY_LOCK_FAILED = (field: string | null = null) =>
  errorResponse(409, "INVENTORY_LOCK_FAILED", "Failed to lock inventory for one or more items.", field);

export const HAS_ACTIVE_RESERVATIONS = () =>
  errorResponse(409, "HAS_ACTIVE_RESERVATIONS", "Cannot modify: this listing has active reservations.", null);

export const HAS_ACTIVE_CHECKOUT = () =>
  errorResponse(409, "HAS_ACTIVE_CHECKOUT", "This item is in an active checkout session. Please wait for it to expire.", null);

export const INVALID_STATE_TRANSITION = (message = "Invalid state transition for this resource.") =>
  errorResponse(409, "INVALID_STATE_TRANSITION", message, null);

export const INVALID_STATE = (message = "This resource is not in a cancellable state.") =>
  errorResponse(409, "INVALID_STATE", message, null);

export const CONFIRM_TOKEN_EXPIRED = () =>
  errorResponse(409, "CONFIRM_TOKEN_EXPIRED", "The confirmation token has expired. Please restart the cancellation.", null);

export const METADATA_INCOMPLETE = (fields: string[]) =>
  errorResponse(400, "METADATA_INCOMPLETE", `Missing required fields: ${fields.join(", ")}`, null);

export const EVENT_SOLD_OUT = () =>
  errorResponse(409, "EVENT_SOLD_OUT", "This event has reached its capacity.", null);

export const ALREADY_CHECKED_IN = (checkedInAt: string) =>
  errorResponse(409, "ALREADY_CHECKED_IN", `Attendee already checked in at ${checkedInAt}.`, null);

export const OUTSIDE_CHECKIN_WINDOW = () =>
  errorResponse(409, "OUTSIDE_CHECKIN_WINDOW", "Check-in is not available at this time.", null);

export const INVALID_QR_TOKEN = () =>
  errorResponse(400, "INVALID_QR_TOKEN", "The QR token is invalid or expired.", null);

export const NOT_A_MEMBER = () =>
  errorResponse(403, "NOT_A_MEMBER", "You are not a member of this itinerary.", null);

// ─── 429 Too Many Requests ──────────────────────────────────────────────────
export const RATE_LIMITED = () =>
  errorResponse(429, "RATE_LIMITED", "Too many requests. Please slow down.", null);

// ─── 500 / 503 ──────────────────────────────────────────────────────────────
export const INTERNAL_ERROR = () =>
  errorResponse(500, "INTERNAL_ERROR", "An unexpected error occurred. Please try again.", null);

export const SERVICE_UNAVAILABLE = (service: string) =>
  errorResponse(503, "SERVICE_UNAVAILABLE", `${service} is temporarily unavailable. Please try again.`, null);

// ─── Zod validation error helper ────────────────────────────────────────────
export function zodErrors(zodError: { issues: { path: (string | number)[]; message: string }[] }): NextResponse {
  const first = zodError.issues[0];
  const field = first?.path?.join(".") ?? null;
  const message = first?.message ?? "Invalid request.";
  return errorResponse(400, "VALIDATION_ERROR", message, field);
}

// Re-export the envelope `error` function so route handlers can import everything
// from a single module: import { UNAUTHORIZED, error } from "@/lib/api/errors"
export { error } from "./envelope";
