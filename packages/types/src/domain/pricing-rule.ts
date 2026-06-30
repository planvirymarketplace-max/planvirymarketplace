/**
 * DOM-012 — PricingRule
 *
 * Owner: Booking Engine.
 *
 * Rate override or derived rate applied to an InventoryItem for a date
 * range or condition.
 */

import { z } from "zod";
import type { PricingRuleId } from "../ids";

export const PricingRuleTypeSchema = z.enum(["OVERRIDE", "DERIVED"]);
export type PricingRuleType = z.infer<typeof PricingRuleTypeSchema>;

export const PricingRuleSchema = z
  .object({
    id: z.string(),
    inventoryItemId: z.string(),
    type: PricingRuleTypeSchema,
    /** Price in cents (USD) applied when this rule matches. */
    priceCents: z.number().int().nonnegative(),
    /** Optional date range when the rule is active. */
    startDate: z.string().datetime().nullable().optional(),
    endDate: z.string().datetime().nullable().optional(),
    /** Free-form condition payload (e.g. { weekday: "FRI" }, { minNights: 2 }). */
    condition: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type PricingRule = Omit<z.infer<typeof PricingRuleSchema>, "id"> & {
  id: PricingRuleId;
};

export const PricingRule_META = {
  id: "DOM-012",
  owner: "Booking Engine",
  description:
    "Rate override or derived rate applied to an InventoryItem for a date range or condition.",
  lifecycle: [],
  eventsEmitted: [],
  eventsConsumed: [],
} as const;
