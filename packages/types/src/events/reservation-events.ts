/**
 * Reservation-domain event payloads (DOM-004).
 *
 * Emitted by the Reservation Management Module.
 */

import { z } from "zod";

const base = z.object({
  timestamp: z.string().datetime(),
});

export const ReservationPendingEventSchema = base
  .extend({
    type: z.literal("reservation.pending"),
    reservationId: z.string(),
    userId: z.string(),
    inventoryItemId: z.string(),
    expiresAt: z.string().datetime(),
  })
  .strict();
export type ReservationPendingEvent = z.infer<
  typeof ReservationPendingEventSchema
>;

export const ReservationConfirmedEventSchema = base
  .extend({
    type: z.literal("reservation.confirmed"),
    reservationId: z.string(),
    userId: z.string(),
    inventoryItemId: z.string(),
    paymentRecordId: z.string(),
  })
  .strict();
export type ReservationConfirmedEvent = z.infer<
  typeof ReservationConfirmedEventSchema
>;

export const ReservationCancelledEventSchema = base
  .extend({
    type: z.literal("reservation.cancelled"),
    reservationId: z.string(),
    userId: z.string(),
    reason: z.string().optional(),
    refundAmountCents: z.number().int().nonnegative().optional(),
  })
  .strict();
export type ReservationCancelledEvent = z.infer<
  typeof ReservationCancelledEventSchema
>;

export const ReservationExpiredEventSchema = base
  .extend({
    type: z.literal("reservation.expired"),
    reservationId: z.string(),
    inventoryItemId: z.string(),
  })
  .strict();
export type ReservationExpiredEvent = z.infer<
  typeof ReservationExpiredEventSchema
>;

export const ReservationCompletedEventSchema = base
  .extend({
    type: z.literal("reservation.completed"),
    reservationId: z.string(),
    userId: z.string(),
  })
  .strict();
export type ReservationCompletedEvent = z.infer<
  typeof ReservationCompletedEventSchema
>;

export const ReservationNoShowEventSchema = base
  .extend({
    type: z.literal("reservation.no_show"),
    reservationId: z.string(),
    userId: z.string(),
  })
  .strict();
export type ReservationNoShowEvent = z.infer<
  typeof ReservationNoShowEventSchema
>;

export const ReservationEventSchema = z.discriminatedUnion("type", [
  ReservationPendingEventSchema,
  ReservationConfirmedEventSchema,
  ReservationCancelledEventSchema,
  ReservationExpiredEventSchema,
  ReservationCompletedEventSchema,
  ReservationNoShowEventSchema,
]);

export type ReservationEvent = z.infer<typeof ReservationEventSchema>;
