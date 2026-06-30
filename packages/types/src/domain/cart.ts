/**
 * DOM-006 — Cart
 *
 * Owner: Cart Service (Part XLIII.5).
 *
 * The transient pre-checkout container holding InventoryItems selected
 * by a User across all verticals. Cart items are converted to
 * Reservations at checkout. The Cart is cross-vertical: a hotel night,
 * a concert ticket, and a DJ booking are all valid Cart line items
 * simultaneously.
 *
 * Lifecycle: Active → [Checking Out | Completed (→ Reservations created) | Abandoned | Cleared].
 *
 * Events emitted:  cart.item_added, cart.item_removed, cart.checkout_started,
 *                  cart.checkout_completed, cart.abandoned.
 * Events consumed: inventory.paused (removes affected items with user notification).
 *
 * Business rules:
 *  - BR-C-001: A Cart may contain items from multiple categories and multiple VendorAccounts.
 *  - BR-C-002: A Cart idle for SESSION_TTL minutes is automatically cleared.
 *  - BR-C-003: At checkout, every Cart item converts to a PENDING Reservation inside a single DB transaction.
 *  - BR-C-004: If any Cart item fails inventory lock, the entire checkout aborts — no partial checkouts.
 *  - BR-C-005: A Cart cannot be checked out if the owning User has an unverified email.
 */

import { z } from "zod";
import type { CartId } from "../ids";

/**
 * A single Cart line item — points to an InventoryItem + the quantity
 * and date params the user selected. Cross-vertical (BR-C-001).
 */
export const CartLineItemSchema = z
  .object({
    id: z.string(),
    inventoryItemId: z.string(),
    vendorAccountId: z.string().nullable().optional(),
    category: z.string(),
    quantity: z.number().int().positive(),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    /** Snapshot of the locked-in price at add-time (cents, USD). */
    unitPriceCents: z.number().int().nonnegative(),
    /** Category-specific selection params (e.g. ticket tier, room type). */
    params: z.record(z.string(), z.unknown()).optional(),
    addedAt: z.string().datetime(),
  })
  .strict();

export type CartLineItem = z.infer<typeof CartLineItemSchema>;

export const CartStatusSchema = z.enum([
  "ACTIVE",
  "CHECKING_OUT",
  "COMPLETED",
  "ABANDONED",
  "CLEARED",
]);
export type CartStatus = z.infer<typeof CartStatusSchema>;

export const CartSchema = z
  .object({
    id: z.string(),
    /** Null for anonymous carts — then `sessionToken` is the carrier. */
    userId: z.string().nullable().optional(),
    /** Required for anonymous carts; absent for authenticated carts. */
    sessionToken: z.string().nullable().optional(),
    status: CartStatusSchema,
    lineItems: z.array(CartLineItemSchema),
    /** Idle-expiry timestamp (BR-C-002). */
    expiresAt: z.string().datetime().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Cart = Omit<z.infer<typeof CartSchema>, "id"> & { id: CartId };

export const Cart_META = {
  id: "DOM-006",
  owner: "Cart Service",
  description:
    "The transient pre-checkout container holding InventoryItems selected by a User across all verticals. Cart items are converted to Reservations at checkout. Cross-vertical (BR-C-001).",
  lifecycle: [
    "Active",
    "Checking Out",
    "Completed",
    "Abandoned",
    "Cleared",
  ],
  eventsEmitted: [
    "cart.item_added",
    "cart.item_removed",
    "cart.checkout_started",
    "cart.checkout_completed",
    "cart.abandoned",
  ],
  eventsConsumed: ["inventory.paused"],
} as const;
