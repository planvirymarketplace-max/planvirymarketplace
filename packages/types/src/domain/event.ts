/**
 * DOM-007 — Event (Ticketed)
 *
 * Owner: Ticketing Management Module (Hi.Events-derived, TRANSLATE).
 *
 * A ticketed occasion with a fixed capacity, date/time, and one or more
 * ticket tiers. Translated from Hi.Events' event model into the platform
 * schema. An Event is also an InventoryItem (category = EVENT_TICKET)
 * for cart compatibility.
 *
 * Lifecycle: Draft → Published → [Ongoing | Sold Out | Cancelled | Completed].
 *
 * Events emitted: event.published, event.sold_out, event.cancelled, event.completed.
 *
 * Business rules:
 *  - BR-EV-001: An Event must have at least one TicketTier before it can be published.
 *  - BR-EV-002: Total tickets sold across all tiers may not exceed Event.capacity.
 *  - BR-EV-003: A CANCELLED Event triggers automatic refund initiation for all confirmed ticket Reservations.
 *
 * Source: Hi.Events (TRANSLATE — rebuilt natively, not imported).
 */

import { z } from "zod";
import type { EventId } from "../ids";

export const EventStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ONGOING",
  "SOLD_OUT",
  "CANCELLED",
  "COMPLETED",
]);
export type EventStatus = z.infer<typeof EventStatusSchema>;

/**
 * A ticket tier for an Event (e.g. GA, VIP). At least one is required
 * before publish (BR-EV-001).
 */
export const TicketTierSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1),
    priceCents: z.number().int().nonnegative(),
    capacity: z.number().int().positive(),
    soldCount: z.number().int().nonnegative().default(0),
  })
  .strict();

export type TicketTier = z.infer<typeof TicketTierSchema>;

export const EventSchema = z
  .object({
    id: z.string(),
    /** The InventoryItem (category=EVENT_TICKET) backing this Event. */
    inventoryItemId: z.string(),
    /** Organizer = the VendorAccount that owns this event. */
    organizerId: z.string(),
    title: z.string().min(1),
    description: z.string().nullable().optional(),
    capacity: z.number().int().positive(),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    status: EventStatusSchema,
    ticketTiers: z.array(TicketTierSchema),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Event = Omit<z.infer<typeof EventSchema>, "id"> & { id: EventId };

export const Event_META = {
  id: "DOM-007",
  owner: "Ticketing Management Module",
  description:
    "A ticketed occasion with a fixed capacity, date/time, and one or more ticket tiers. Translated from Hi.Events' event model. An Event is also an InventoryItem (category=EVENT_TICKET) for cart compatibility.",
  lifecycle: [
    "Draft",
    "Published",
    "Ongoing",
    "Sold Out",
    "Cancelled",
    "Completed",
  ],
  eventsEmitted: [
    "event.published",
    "event.sold_out",
    "event.cancelled",
    "event.completed",
  ],
  eventsConsumed: [],
  source: "Hi.Events (TRANSLATE)",
} as const;
