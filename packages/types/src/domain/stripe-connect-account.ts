/**
 * DOM-019 — StripeConnectAccount
 *
 * Owner: Payment Module.
 *
 * Stripe Connect account record for a VendorAccount; holds
 * account_id, charges_enabled, payouts_enabled.
 */

import { z } from "zod";
import type { StripeConnectAccountId } from "../ids";

export const StripeConnectAccountSchema = z
  .object({
    id: z.string(),
    vendorAccountId: z.string(),
    /** Stripe's `acct_*` Connect account id. */
    stripeAccountId: z.string().min(1),
    chargesEnabled: z.boolean(),
    payoutsEnabled: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type StripeConnectAccount = Omit<
  z.infer<typeof StripeConnectAccountSchema>,
  "id"
> & { id: StripeConnectAccountId };

export const StripeConnectAccount_META = {
  id: "DOM-019",
  owner: "Payment Module",
  description:
    "Stripe Connect account record for a VendorAccount; holds account_id, charges_enabled, payouts_enabled.",
  lifecycle: [],
  eventsEmitted: [],
  eventsConsumed: [],
} as const;
