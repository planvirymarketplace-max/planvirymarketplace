/**
 * Payment-domain event payloads (DOM-015 PaymentRecord).
 *
 * Emitted by the Payment Module. Consumed by the Reservation FSM
 * (DOM-004) to drive CONFIRMED / cancellation transitions.
 */

import { z } from "zod";

const base = z.object({
  timestamp: z.string().datetime(),
});

export const PaymentSucceededEventSchema = base
  .extend({
    type: z.literal("payment.succeeded"),
    paymentRecordId: z.string(),
    stripePaymentIntentId: z.string(),
    reservationIds: z.array(z.string()),
    amountCents: z.number().int().nonnegative(),
    currency: z.string(),
  })
  .strict();
export type PaymentSucceededEvent = z.infer<typeof PaymentSucceededEventSchema>;

export const PaymentFailedEventSchema = base
  .extend({
    type: z.literal("payment.failed"),
    paymentRecordId: z.string(),
    stripePaymentIntentId: z.string(),
    reservationIds: z.array(z.string()),
    reason: z.string().optional(),
  })
  .strict();
export type PaymentFailedEvent = z.infer<typeof PaymentFailedEventSchema>;

export const PaymentRefundedEventSchema = base
  .extend({
    type: z.literal("payment.refunded"),
    paymentRecordId: z.string(),
    stripePaymentIntentId: z.string(),
    reservationIds: z.array(z.string()),
    refundAmountCents: z.number().int().nonnegative(),
  })
  .strict();
export type PaymentRefundedEvent = z.infer<typeof PaymentRefundedEventSchema>;

export const PaymentEventSchema = z.discriminatedUnion("type", [
  PaymentSucceededEventSchema,
  PaymentFailedEventSchema,
  PaymentRefundedEventSchema,
]);

export type PaymentEvent = z.infer<typeof PaymentEventSchema>;
