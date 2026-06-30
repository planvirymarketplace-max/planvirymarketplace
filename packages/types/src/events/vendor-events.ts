/**
 * VendorAccount-domain event payloads (DOM-002).
 *
 * Emitted by the Vendor Listing Management Module.
 */

import { z } from "zod";

const base = z.object({
  timestamp: z.string().datetime(),
});

export const VendorClaimedEventSchema = base
  .extend({
    type: z.literal("vendor.claimed"),
    vendorAccountId: z.string(),
    claimedByUserId: z.string(),
  })
  .strict();
export type VendorClaimedEvent = z.infer<typeof VendorClaimedEventSchema>;

export const VendorOnboardedEventSchema = base
  .extend({
    type: z.literal("vendor.onboarded"),
    vendorAccountId: z.string(),
    stripeConnectAccountId: z.string().optional(),
  })
  .strict();
export type VendorOnboardedEvent = z.infer<typeof VendorOnboardedEventSchema>;

export const VendorSuspendedEventSchema = base
  .extend({
    type: z.literal("vendor.suspended"),
    vendorAccountId: z.string(),
    reason: z.string().optional(),
  })
  .strict();
export type VendorSuspendedEvent = z.infer<typeof VendorSuspendedEventSchema>;

export const VendorEventSchema = z.discriminatedUnion("type", [
  VendorClaimedEventSchema,
  VendorOnboardedEventSchema,
  VendorSuspendedEventSchema,
]);

export type VendorEvent = z.infer<typeof VendorEventSchema>;
