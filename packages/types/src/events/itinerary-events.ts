/**
 * ItinerarySession-domain event payloads (DOM-005).
 *
 * Emitted by the Travel Management Module.
 */

import { z } from "zod";

const base = z.object({
  timestamp: z.string().datetime(),
});

export const ItineraryCreatedEventSchema = base
  .extend({
    type: z.literal("itinerary.created"),
    itinerarySessionId: z.string(),
    ownerId: z.string(),
    title: z.string(),
  })
  .strict();
export type ItineraryCreatedEvent = z.infer<
  typeof ItineraryCreatedEventSchema
>;

export const ItinerarySharedEventSchema = base
  .extend({
    type: z.literal("itinerary.shared"),
    itinerarySessionId: z.string(),
    ownerId: z.string(),
    shareLink: z.string().optional(),
  })
  .strict();
export type ItinerarySharedEvent = z.infer<
  typeof ItinerarySharedEventSchema
>;

export const ItineraryMemberAddedEventSchema = base
  .extend({
    type: z.literal("itinerary.member_added"),
    itinerarySessionId: z.string(),
    memberId: z.string(),
    permission: z.enum(["VIEW", "EDIT"]),
  })
  .strict();
export type ItineraryMemberAddedEvent = z.infer<
  typeof ItineraryMemberAddedEventSchema
>;

export const ItineraryCompletedEventSchema = base
  .extend({
    type: z.literal("itinerary.completed"),
    itinerarySessionId: z.string(),
    ownerId: z.string(),
  })
  .strict();
export type ItineraryCompletedEvent = z.infer<
  typeof ItineraryCompletedEventSchema
>;

export const ItineraryEventSchema = z.discriminatedUnion("type", [
  ItineraryCreatedEventSchema,
  ItinerarySharedEventSchema,
  ItineraryMemberAddedEventSchema,
  ItineraryCompletedEventSchema,
]);

export type ItineraryEvent = z.infer<typeof ItineraryEventSchema>;
