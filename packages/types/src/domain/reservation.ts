/**
 * DOM-004 — Reservation
 *
 * Owner: Reservation Management Module.
 *
 * A single booking record linking a User to an InventoryItem for a
 * specific time range or slot. The Reservation Ledger (Part XLIII.3)
 * is the union of all Reservation rows across all verticals.
 *
 * Lifecycle (FSM): PENDING → CONFIRMED → [COMPLETED | CANCELLED | NO_SHOW]
 *                  | PENDING → EXPIRED (TTL). See Part V for full FSM.
 *
 * Events emitted:  reservation.pending, reservation.confirmed, reservation.cancelled,
 *                  reservation.expired, reservation.completed, reservation.no_show.
 * Events consumed: payment.succeeded (→ CONFIRMED), payment.failed (→ cancellation),
 *                  ttl.expired (→ EXPIRED).
 *
 * Business rules:
 *  - BR-R-001: Status transitions follow the FSM only — no direct status writes.
 *  - BR-R-002: A PENDING Reservation holds inventory for TTL minutes (default 15, BR-R-002).
 *  - BR-R-003: A CONFIRMED Reservation may only be cancelled via the cancellation FSM — never hard-deleted.
 *  - BR-R-004: Inventory decrement uses a serializable transaction with row-level lock on the InventoryItem.
 *  - BR-R-005: No two CONFIRMED Reservations for the same InventoryItem with overlapping date ranges (date-ranged categories).
 *  - BR-R-006: Cancellation policy evaluated at cancel time, not at booking time.
 */

import { z } from "zod";
import type { ReservationId } from "../ids";

export const ReservationStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
  "EXPIRED",
]);
export type ReservationStatus = z.infer<typeof ReservationStatusSchema>;

export const ReservationSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    inventoryItemId: z.string(),
    /** Set when the reservation belongs to an ItinerarySession (DOM-005). */
    itinerarySessionId: z.string().nullable().optional(),
    /** Set during/after checkout — the Cart this Reservation was created from. */
    cartId: z.string().nullable().optional(),
    status: ReservationStatusSchema,
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    quantity: z.number().int().positive(),
    /** Locked-in price at reservation time (cents, USD). */
    priceCents: z.number().int().nonnegative(),
    /** TTL expiry for PENDING reservations (BR-R-002). Cleared on CONFIRMED. */
    expiresAt: z.string().datetime().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Reservation = Omit<z.infer<typeof ReservationSchema>, "id"> & {
  id: ReservationId;
};

export const Reservation_META = {
  id: "DOM-004",
  owner: "Reservation Management Module",
  description:
    "A single booking record linking a User to an InventoryItem for a specific time range or slot. The Reservation Ledger (Part XLIII.3) is the union of all Reservation rows across all verticals.",
  lifecycle: [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
    "EXPIRED",
  ],
  eventsEmitted: [
    "reservation.pending",
    "reservation.confirmed",
    "reservation.cancelled",
    "reservation.expired",
    "reservation.completed",
    "reservation.no_show",
  ],
  eventsConsumed: ["payment.succeeded", "payment.failed", "ttl.expired"],
} as const;
