/**
 * @planviry/analytics — type-safe analytics event catalog + emitters.
 *
 * Part II    §2.1   — packages/analytics owns the event catalog + wrappers.
 * Part XXVII §27.x  — TinyBird Analytics (naming convention, payload, destination).
 *
 * Naming convention (Part XXVII §27.2): `<object>_<action>` in snake_case.
 *   e.g. `reservation_confirmed`, `cart_item_added`, `itinerary_shared`.
 */

export type AnalyticsDestination = "tinybird" | "posthog" | "segment" | "stdout";

export interface AnalyticsEvent {
  /** snake_case object_action name. Part XXVII §27.2. */
  name: string;
  /** ISO-8601 timestamp. */
  timestamp: string;
  /** Anonymous or user ID. PII excluded per BR-GLOBAL-004. */
  actor: string;
  payload: Record<string, unknown>;
}

export const ANALYTICS_EVENT_NAMES = [
  "user_registered",
  "user_onboarded",
  "vendor_claimed",
  "inventory_published",
  "reservation_pending",
  "reservation_confirmed",
  "reservation_cancelled",
  "cart_item_added",
  "cart_item_removed",
  "cart_checkout_completed",
  "itinerary_created",
  "itinerary_shared",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];
