/**
 * DOM-015 — PaymentRecord
 *
 * Owner: Payment Module.
 *
 * Stripe PaymentIntent record; linked to one or more Reservations;
 * tracks payout splits.
 */

import { z } from "zod";
import type { PaymentRecordId } from "../ids";

export const PaymentRecordStatusSchema = z.enum([
  "PENDING",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
]);
export type PaymentRecordStatus = z.infer<typeof PaymentRecordStatusSchema>;

/**
 * A single vendor's share of a payment's payout. The sum of
 * `amountCents` across all splits equals the PaymentRecord.amountCents
 * (platform fee accounting is done by the Payment Module).
 */
export const PayoutSplitSchema = z
  .object({
    vendorAccountId: z.string(),
    amountCents: z.number().int().nonnegative(),
  })
  .strict();

export type PayoutSplit = z.infer<typeof PayoutSplitSchema>;

export const PaymentRecordSchema = z
  .object({
    id: z.string(),
    stripePaymentIntentId: z.string().min(1),
    /** One payment may settle multiple Reservations (e.g. Cart checkout). */
    reservationIds: z.array(z.string()),
    amountCents: z.number().int().nonnegative(),
    currency: z.string().min(3).max(3).default("usd"),
    status: PaymentRecordStatusSchema,
    payoutSplits: z.array(PayoutSplitSchema),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type PaymentRecord = Omit<
  z.infer<typeof PaymentRecordSchema>,
  "id"
> & { id: PaymentRecordId };

export const PaymentRecord_META = {
  id: "DOM-015",
  owner: "Payment Module",
  description:
    "Stripe PaymentIntent record; linked to one or more Reservations; tracks payout splits.",
  lifecycle: ["PENDING", "SUCCEEDED", "FAILED", "REFUNDED"],
  eventsEmitted: [
    "payment.succeeded",
    "payment.failed",
    "payment.refunded",
  ],
  eventsConsumed: [],
} as const;
