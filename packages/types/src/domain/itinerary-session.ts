/**
 * DOM-005 — ItinerarySession
 *
 * Owner: Travel Management Module.
 *
 * The parent record that groups multiple Reservations across verticals
 * into one trip or occasion. A bachelorette weekend may have one
 * ItinerarySession containing hotel Reservations, a venue Reservation,
 * vendor bookings, and event tickets. This is a NATIVE-NO-PATTERN
 * entity — no reference repo implements it.
 *
 * Lifecycle: Active → [Shared | Completed | Archived].
 *
 * Events emitted:  itinerary.created, itinerary.shared, itinerary.member_added, itinerary.completed.
 * Events consumed: reservation.confirmed (adds to timeline), reservation.cancelled (timeline update + conflict warning).
 *
 * Business rules:
 *  - BR-IT-001: An ItinerarySession must have at least one Reservation before it can be shared.
 *  - BR-IT-002: Group members may be invited with VIEW or EDIT permissions.
 *  - BR-IT-003: Cost-splitting metadata is stored on the ItinerarySession, not on individual Reservations.
 */

import { z } from "zod";
import type { ItinerarySessionId } from "../ids";

export const ItinerarySessionStatusSchema = z.enum([
  "ACTIVE",
  "SHARED",
  "COMPLETED",
  "ARCHIVED",
]);
export type ItinerarySessionStatus = z.infer<
  typeof ItinerarySessionStatusSchema
>;

export const ItinerarySessionSchema = z
  .object({
    id: z.string(),
    ownerId: z.string(),
    title: z.string().min(1),
    status: ItinerarySessionStatusSchema,
    /**
     * Cost-splitting metadata (BR-IT-003) — e.g. member share ratios,
     * payment allocations. Lives on the session, not on Reservations.
     */
    costSplitMetadata: z.record(z.string(), z.unknown()),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type ItinerarySession = Omit<
  z.infer<typeof ItinerarySessionSchema>,
  "id"
> & { id: ItinerarySessionId };

export const ItinerarySession_META = {
  id: "DOM-005",
  owner: "Travel Management Module",
  description:
    "The parent record that groups multiple Reservations across verticals into one trip or occasion. NATIVE-NO-PATTERN — no reference repo implements it.",
  lifecycle: ["Active", "Shared", "Completed", "Archived"],
  eventsEmitted: [
    "itinerary.created",
    "itinerary.shared",
    "itinerary.member_added",
    "itinerary.completed",
  ],
  eventsConsumed: ["reservation.confirmed", "reservation.cancelled"],
} as const;
