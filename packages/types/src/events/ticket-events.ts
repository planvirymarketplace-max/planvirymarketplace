/**
 * ServiceTicket-domain event payloads (DOM-008).
 *
 * Emitted by the Ticketing Management Module. Note: this file covers
 * DOM-008 ServiceTicket (Peppermint-pattern operational task) — for
 * DOM-007 Event (ticketed occasion) events see `./event-events.ts`.
 */

import { z } from "zod";

const base = z.object({
  timestamp: z.string().datetime(),
});

export const TicketCreatedEventSchema = base
  .extend({
    type: z.literal("ticket.created"),
    serviceTicketId: z.string(),
    vendorAccountId: z.string(),
    priority: z.enum(["URGENT", "HIGH", "NORMAL", "LOW"]),
  })
  .strict();
export type TicketCreatedEvent = z.infer<typeof TicketCreatedEventSchema>;

export const TicketAssignedEventSchema = base
  .extend({
    type: z.literal("ticket.assigned"),
    serviceTicketId: z.string(),
    assignedStaffId: z.string(),
  })
  .strict();
export type TicketAssignedEvent = z.infer<typeof TicketAssignedEventSchema>;

export const TicketEscalatedEventSchema = base
  .extend({
    type: z.literal("ticket.escalated"),
    serviceTicketId: z.string(),
    reason: z.string(),
  })
  .strict();
export type TicketEscalatedEvent = z.infer<typeof TicketEscalatedEventSchema>;

export const TicketCompletedEventSchema = base
  .extend({
    type: z.literal("ticket.completed"),
    serviceTicketId: z.string(),
    completionNote: z.string(),
  })
  .strict();
export type TicketCompletedEvent = z.infer<typeof TicketCompletedEventSchema>;

export const TicketEventSchema = z.discriminatedUnion("type", [
  TicketCreatedEventSchema,
  TicketAssignedEventSchema,
  TicketEscalatedEventSchema,
  TicketCompletedEventSchema,
]);

export type TicketEvent = z.infer<typeof TicketEventSchema>;
