/**
 * DOM-013 — AvailabilityBlock
 *
 * Owner: Booking Engine.
 *
 * Explicit date-range block on an InventoryItem (manual close,
 * maintenance, etc.).
 */

import { z } from "zod";
import type { AvailabilityBlockId } from "../ids";

export const AvailabilityBlockReasonSchema = z.enum([
  "MANUAL_CLOSE",
  "MAINTENANCE",
  "OTHER",
]);
export type AvailabilityBlockReason = z.infer<
  typeof AvailabilityBlockReasonSchema
>;

export const AvailabilityBlockSchema = z
  .object({
    id: z.string(),
    inventoryItemId: z.string(),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    reason: AvailabilityBlockReasonSchema,
    note: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type AvailabilityBlock = Omit<
  z.infer<typeof AvailabilityBlockSchema>,
  "id"
> & { id: AvailabilityBlockId };

export const AvailabilityBlock_META = {
  id: "DOM-013",
  owner: "Booking Engine",
  description:
    "Explicit date-range block on an InventoryItem (manual close, maintenance, etc.).",
  lifecycle: [],
  eventsEmitted: [],
  eventsConsumed: [],
} as const;
