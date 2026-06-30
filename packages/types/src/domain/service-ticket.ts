/**
 * DOM-008 — ServiceTicket
 *
 * Owner: Ticketing Management Module (Peppermint-derived, PATTERN).
 *
 * An operational task record in the Peppermint sense — not a ticketed
 * event, but a task to execute (deliver flowers to Room 204 at 7pm,
 * set up AV for the corporate event). Distinct from DOM-007 (ticketed
 * event). Assigned to VendorStaff or platform operations staff.
 *
 * Lifecycle: Open → [In Progress | Blocked] → Completed | Cancelled.
 *
 * Events emitted: ticket.created, ticket.assigned, ticket.escalated, ticket.completed.
 *
 * Business rules:
 *  - BR-ST-001: A ServiceTicket must be assigned to a staff member within ASSIGNMENT_SLA of creation.
 *  - BR-ST-002: A COMPLETED ServiceTicket requires a completion note.
 *  - BR-ST-003: URGENT priority tickets trigger immediate push notification to the assigned staff member.
 *
 * Source: Peppermint (PATTERN — task queue and assignment model).
 */

import { z } from "zod";
import type { ServiceTicketId } from "../ids";

export const ServiceTicketPrioritySchema = z.enum([
  "URGENT",
  "HIGH",
  "NORMAL",
  "LOW",
]);
export type ServiceTicketPriority = z.infer<
  typeof ServiceTicketPrioritySchema
>;

export const ServiceTicketStatusSchema = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "BLOCKED",
  "COMPLETED",
  "CANCELLED",
]);
export type ServiceTicketStatus = z.infer<typeof ServiceTicketStatusSchema>;

export const ServiceTicketSchema = z
  .object({
    id: z.string(),
    vendorAccountId: z.string(),
    /** Optional — a ServiceTicket may be standalone. */
    reservationId: z.string().nullable().optional(),
    /** The VendorStaff (User) assigned to this ticket (BR-ST-001). */
    assignedStaffId: z.string().nullable().optional(),
    priority: ServiceTicketPrioritySchema,
    status: ServiceTicketStatusSchema,
    title: z.string().min(1),
    description: z.string(),
    /** Required when status=COMPLETED (BR-ST-002). */
    completionNote: z.string().nullable().optional(),
    /** When the ticket breached ASSIGNMENT_SLA without an assignment. */
    escalatedAt: z.string().datetime().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type ServiceTicket = Omit<
  z.infer<typeof ServiceTicketSchema>,
  "id"
> & { id: ServiceTicketId };

export const ServiceTicket_META = {
  id: "DOM-008",
  owner: "Ticketing Management Module",
  description:
    "An operational task record in the Peppermint sense — not a ticketed event, but a task to execute (deliver flowers to Room 204 at 7pm, set up AV). Distinct from DOM-007. Assigned to VendorStaff or platform operations staff.",
  lifecycle: [
    "Open",
    "In Progress",
    "Blocked",
    "Completed",
    "Cancelled",
  ],
  eventsEmitted: [
    "ticket.created",
    "ticket.assigned",
    "ticket.escalated",
    "ticket.completed",
  ],
  eventsConsumed: [],
  source: "Peppermint (PATTERN)",
} as const;
