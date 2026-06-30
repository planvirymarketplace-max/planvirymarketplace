/**
 * Domain events barrel — Part III §3.1 "Events Emitted / Consumed" per entity.
 *
 * Each event payload is a discriminated union member keyed by `type`.
 * Producers + consumers are documented in docs/03-domain.md.
 */

export * from "./user-events";
export * from "./vendor-events";
export * from "./inventory-events";
export * from "./reservation-events";
export * from "./itinerary-events";
export * from "./cart-events";
export * from "./event-events";
export * from "./ticket-events";
export * from "./payment-events";
