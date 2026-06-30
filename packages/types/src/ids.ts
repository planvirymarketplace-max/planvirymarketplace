/**
 * Branded ID types for the Planviry domain model.
 *
 * Part III §3.1 — every entity has a unique ID (DOM-XXX). To prevent
 * accidentally passing a `UserId` where a `VendorAccountId` is expected,
 * all entity IDs are branded nominal types.
 *
 * Part I §1.3.3 — Naming Standards.
 */

declare const brand: unique symbol;

export type Brand<T, B extends string> = T & { readonly [brand]: B };

export type UserId = Brand<string, "UserId">;
export type VendorAccountId = Brand<string, "VendorAccountId">;
export type VendorStaffId = Brand<string, "VendorStaffId">;
export type InventoryItemId = Brand<string, "InventoryItemId">;
export type ReservationId = Brand<string, "ReservationId">;
export type ItinerarySessionId = Brand<string, "ItinerarySessionId">;
export type CartId = Brand<string, "CartId">;
export type EventId = Brand<string, "EventId">;
export type ServiceTicketId = Brand<string, "ServiceTicketId">;
export type ProfileId = Brand<string, "ProfileId">;
export type ReviewId = Brand<string, "ReviewId">;
export type MediaAssetId = Brand<string, "MediaAssetId">;
export type PricingRuleId = Brand<string, "PricingRuleId">;
export type AvailabilityBlockId = Brand<string, "AvailabilityBlockId">;
export type NotificationId = Brand<string, "NotificationId">;
export type PaymentRecordId = Brand<string, "PaymentRecordId">;
export type ReportId = Brand<string, "ReportId">;
export type SearchDocumentId = Brand<string, "SearchDocumentId">;
export type TaxonomyTagId = Brand<string, "TaxonomyTagId">;
export type StripeConnectAccountId = Brand<string, "StripeConnectAccountId">;

/**
 * The 20 catalogued domain entity IDs from Part III §3.1, keyed by their
 * DOM-XXX identifier. Used by the traceability matrix (Part XXXVI).
 */
export type DomainEntityId =
  | "DOM-001" | "DOM-002" | "DOM-003" | "DOM-004" | "DOM-005"
  | "DOM-006" | "DOM-007" | "DOM-008" | "DOM-009" | "DOM-010"
  | "DOM-011" | "DOM-012" | "DOM-013" | "DOM-014" | "DOM-015"
  | "DOM-016" | "DOM-017" | "DOM-018" | "DOM-019" | "DOM-020";
