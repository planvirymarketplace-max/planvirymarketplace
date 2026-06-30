/**
 * DOM-003 — InventoryItem
 *
 * Owner: Cross-Vertical Inventory Module (Part XLIII).
 *
 * The polymorphic base entity for every bookable item on the platform.
 * A hotel room, a concert ticket, a venue rental, a vendor service
 * package, a flight segment — all are InventoryItems with a category
 * enum and category-specific metadata JSONB.
 *
 * Lifecycle: Draft → Published → [Active | Paused | Archived | Deleted].
 *
 * Events emitted:  inventory.published, inventory.updated, inventory.paused, inventory.archived.
 * Events consumed: booking.confirmed (decrements available quantity or blocks date range).
 *
 * Business rules:
 *  - BR-I-001: An InventoryItem must have a valid category.
 *  - BR-I-002: The metadata JSONB must pass category-specific validation before publish.
 *  - BR-I-003: An InventoryItem with active Reservations may not be deleted — only archived.
 *  - BR-I-004: Only the owning VendorAccount may update an InventoryItem.
 *  - BR-I-005: A PAUSED InventoryItem may not accept new Reservations.
 *  - BR-I-006: Price must be a positive integer in cents (USD); zero is only valid for free items with is_free=true.
 *
 * NOTE: The `INVENTORY_CATEGORIES` enum below is mirrored verbatim from
 * `shared/constants.ts` because `@planviry/types` is a leaf package that
 * may only depend on `@planviry/config`. Any change here MUST be applied
 * to `shared/constants.ts` as well.
 */

import { z } from "zod";
import type { InventoryItemId } from "../ids";

/**
 * DOM-003 InventoryItem.category enum (Part III §3.1, binding).
 * Mirror of `INVENTORY_CATEGORIES` in `shared/constants.ts`.
 */
export const INVENTORY_CATEGORIES = [
  "LODGING",
  "VACATION_RENTAL",
  "FLIGHT",
  "CAR_RENTAL",
  "EXPERIENCE",
  "EVENT_TICKET",
  "VENUE_SPACE",
  "VENDOR_SERVICE",
  "DINING_RESERVATION",
  "CRUISE_CABIN",
  "TRANSIT",
] as const;

export const InventoryCategorySchema = z.enum(INVENTORY_CATEGORIES);
export type InventoryCategory = z.infer<typeof InventoryCategorySchema>;

export const InventoryItemSchema = z
  .object({
    id: z.string(),
    /** Nullable for platform-owned / Overture-seeded items (BR-V-002). */
    vendorAccountId: z.string().nullable().optional(),
    category: InventoryCategorySchema,
    title: z.string().min(1),
    description: z.string().nullable().optional(),
    /** Positive integer cents; BR-I-006 — zero only valid when isFree=true. */
    basePriceCents: z.number().int().nonnegative(),
    /** When true, basePriceCents may be 0 (BR-I-006). */
    isFree: z.boolean().default(false),
    /**
     * Category-specific JSONB payload; structure validated by
     * category-specific validators before publish (BR-I-002).
     */
    metadata: z.record(z.string(), z.unknown()),
    status: z.enum([
      "DRAFT",
      "PUBLISHED",
      "ACTIVE",
      "PAUSED",
      "ARCHIVED",
      "DELETED",
    ]),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type InventoryItem = Omit<
  z.infer<typeof InventoryItemSchema>,
  "id"
> & { id: InventoryItemId };

export const InventoryItem_META = {
  id: "DOM-003",
  owner: "Cross-Vertical Inventory Module",
  description:
    "The polymorphic base entity for every bookable item on the platform. A hotel room, a concert ticket, a venue rental, a vendor service package, a flight segment — all are InventoryItems with a category enum and category-specific metadata JSONB.",
  lifecycle: [
    "Draft",
    "Published",
    "Active",
    "Paused",
    "Archived",
    "Deleted",
  ],
  eventsEmitted: [
    "inventory.published",
    "inventory.updated",
    "inventory.paused",
    "inventory.archived",
  ],
  eventsConsumed: ["booking.confirmed"],
} as const;
