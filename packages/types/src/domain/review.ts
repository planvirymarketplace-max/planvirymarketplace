/**
 * DOM-010 — Review
 *
 * Owner: UGC Module (Part XLIX).
 *
 * Star rating + text review left by a User for an InventoryItem
 * post-stay / post-event.
 *
 * NOTE: The "verified-booking-required-to-review" policy is a pending
 * decision (Part XLIX.4). When decided, add a `verifiedBookingId:
 * z.string().nullable().optional()` field and enforce presence in the
 * UGC write path. For now, the schema permits unverified reviews.
 */

import { z } from "zod";
import type { ReviewId } from "../ids";

export const ReviewSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    inventoryItemId: z.string(),
    /** Integer star rating 1–5. */
    rating: z.number().int().min(1).max(5),
    body: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Review = Omit<z.infer<typeof ReviewSchema>, "id"> & {
  id: ReviewId;
};

export const Review_META = {
  id: "DOM-010",
  owner: "UGC Module",
  description:
    "Star rating + text review left by a User for an InventoryItem post-stay/post-event.",
  lifecycle: [],
  eventsEmitted: ["review.posted"],
  eventsConsumed: [],
} as const;
