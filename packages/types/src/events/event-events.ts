/**
 * Event-domain (ticketed) event payloads (DOM-007).
 *
 * Emitted by the Ticketing Management Module. Note: this file covers
 * the DOM-007 Event (ticketed occasion) — for DOM-008 ServiceTicket
 * events see `./ticket-events.ts`.
 */

import { z } from "zod";

const base = z.object({
  timestamp: z.string().datetime(),
});

export const EventPublishedEventSchema = base
  .extend({
    type: z.literal("event.published"),
    eventId: z.string(),
    organizerId: z.string(),
    capacity: z.number().int().positive(),
  })
  .strict();
export type EventPublishedEvent = z.infer<typeof EventPublishedEventSchema>;

export const EventSoldOutEventSchema = base
  .extend({
    type: z.literal("event.sold_out"),
    eventId: z.string(),
    organizerId: z.string(),
  })
  .strict();
export type EventSoldOutEvent = z.infer<typeof EventSoldOutEventSchema>;

export const EventCancelledEventSchema = base
  .extend({
    type: z.literal("event.cancelled"),
    eventId: z.string(),
    organizerId: z.string(),
    refundInitiated: z.boolean(),
  })
  .strict();
export type EventCancelledEvent = z.infer<typeof EventCancelledEventSchema>;

export const EventCompletedEventSchema = base
  .extend({
    type: z.literal("event.completed"),
    eventId: z.string(),
    organizerId: z.string(),
  })
  .strict();
export type EventCompletedEvent = z.infer<typeof EventCompletedEventSchema>;

export const EventEventSchema = z.discriminatedUnion("type", [
  EventPublishedEventSchema,
  EventSoldOutEventSchema,
  EventCancelledEventSchema,
  EventCompletedEventSchema,
]);

export type EventEvent = z.infer<typeof EventEventSchema>;
