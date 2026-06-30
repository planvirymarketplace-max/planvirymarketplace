/**
 * InventoryItem-domain event payloads (DOM-003).
 *
 * Emitted by the Cross-Vertical Inventory Module.
 */

import { z } from "zod";

const base = z.object({
  timestamp: z.string().datetime(),
});

export const InventoryPublishedEventSchema = base
  .extend({
    type: z.literal("inventory.published"),
    inventoryItemId: z.string(),
    vendorAccountId: z.string().nullable().optional(),
    category: z.string(),
  })
  .strict();
export type InventoryPublishedEvent = z.infer<
  typeof InventoryPublishedEventSchema
>;

export const InventoryUpdatedEventSchema = base
  .extend({
    type: z.literal("inventory.updated"),
    inventoryItemId: z.string(),
    fields: z.array(z.string()),
  })
  .strict();
export type InventoryUpdatedEvent = z.infer<
  typeof InventoryUpdatedEventSchema
>;

export const InventoryPausedEventSchema = base
  .extend({
    type: z.literal("inventory.paused"),
    inventoryItemId: z.string(),
  })
  .strict();
export type InventoryPausedEvent = z.infer<typeof InventoryPausedEventSchema>;

export const InventoryArchivedEventSchema = base
  .extend({
    type: z.literal("inventory.archived"),
    inventoryItemId: z.string(),
  })
  .strict();
export type InventoryArchivedEvent = z.infer<
  typeof InventoryArchivedEventSchema
>;

export const InventoryEventSchema = z.discriminatedUnion("type", [
  InventoryPublishedEventSchema,
  InventoryUpdatedEventSchema,
  InventoryPausedEventSchema,
  InventoryArchivedEventSchema,
]);

export type InventoryEvent = z.infer<typeof InventoryEventSchema>;
