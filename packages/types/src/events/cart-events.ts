/**
 * Cart-domain event payloads (DOM-006).
 *
 * Emitted by the Cart Service.
 */

import { z } from "zod";

const base = z.object({
  timestamp: z.string().datetime(),
});

export const CartItemAddedEventSchema = base
  .extend({
    type: z.literal("cart.item_added"),
    cartId: z.string(),
    inventoryItemId: z.string(),
    quantity: z.number().int().positive(),
  })
  .strict();
export type CartItemAddedEvent = z.infer<typeof CartItemAddedEventSchema>;

export const CartItemRemovedEventSchema = base
  .extend({
    type: z.literal("cart.item_removed"),
    cartId: z.string(),
    inventoryItemId: z.string(),
  })
  .strict();
export type CartItemRemovedEvent = z.infer<typeof CartItemRemovedEventSchema>;

export const CartCheckoutStartedEventSchema = base
  .extend({
    type: z.literal("cart.checkout_started"),
    cartId: z.string(),
    userId: z.string().nullable().optional(),
    lineItemCount: z.number().int().nonnegative(),
  })
  .strict();
export type CartCheckoutStartedEvent = z.infer<
  typeof CartCheckoutStartedEventSchema
>;

export const CartCheckoutCompletedEventSchema = base
  .extend({
    type: z.literal("cart.checkout_completed"),
    cartId: z.string(),
    userId: z.string().nullable().optional(),
    reservationIds: z.array(z.string()),
    paymentRecordId: z.string(),
  })
  .strict();
export type CartCheckoutCompletedEvent = z.infer<
  typeof CartCheckoutCompletedEventSchema
>;

export const CartAbandonedEventSchema = base
  .extend({
    type: z.literal("cart.abandoned"),
    cartId: z.string(),
    reason: z.enum(["IDLE_TTL", "MANUAL", "CHECKOUT_FAILED"]).optional(),
  })
  .strict();
export type CartAbandonedEvent = z.infer<typeof CartAbandonedEventSchema>;

export const CartEventSchema = z.discriminatedUnion("type", [
  CartItemAddedEventSchema,
  CartItemRemovedEventSchema,
  CartCheckoutStartedEventSchema,
  CartCheckoutCompletedEventSchema,
  CartAbandonedEventSchema,
]);

export type CartEvent = z.infer<typeof CartEventSchema>;
