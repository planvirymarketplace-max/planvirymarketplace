/**
 * Domain entity barrel — Part III §3.1 Domain Object Catalog.
 *
 * Re-exports every DOM-XXX entity schema + type. The full implementation
 * (Zod schemas + TS types for DOM-001 … DOM-020) lives in this directory,
 * authored by the Part III implementation task.
 *
 * Each entity file follows the Part III §3.1 record shape:
 *   - ID            (DOM-XXX)
 *   - Owner         (module responsible for lifecycle)
 *   - Description
 *   - Key Business Rules (BR-XXX references)
 *   - Relationships
 *   - Lifecycle (FSM states — see Part V)
 *   - Events Emitted / Consumed
 */

export * from "./user";
export * from "./vendor-account";
export * from "./inventory-item";
export * from "./reservation";
export * from "./itinerary-session";
export * from "./cart";
export * from "./event";
export * from "./service-ticket";
export * from "./profile";
export * from "./review";
export * from "./media-asset";
export * from "./pricing-rule";
export * from "./availability-block";
export * from "./notification";
export * from "./payment-record";
export * from "./report";
export * from "./search-document";
export * from "./taxonomy-tag";
export * from "./stripe-connect-account";
export * from "./vendor-staff";
