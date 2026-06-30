/**
 * DOM-011 — MediaAsset
 *
 * Owner: Media Service (Part X).
 *
 * Image or video attached to a Listing, Event, or User profile; stored
 * in Supabase Storage.
 */

import { z } from "zod";
import type { MediaAssetId } from "../ids";

export const MediaAssetOwnerTypeSchema = z.enum([
  "LISTING",
  "EVENT",
  "USER",
]);
export type MediaAssetOwnerType = z.infer<typeof MediaAssetOwnerTypeSchema>;

export const MediaAssetSchema = z
  .object({
    id: z.string(),
    ownerType: MediaAssetOwnerTypeSchema,
    ownerId: z.string(),
    url: z.string().url(),
    mimeType: z.string().min(1),
    sizeBytes: z.number().int().nonnegative(),
    createdAt: z.string().datetime(),
  })
  .strict();

export type MediaAsset = Omit<z.infer<typeof MediaAssetSchema>, "id"> & {
  id: MediaAssetId;
};

export const MediaAsset_META = {
  id: "DOM-011",
  owner: "Media Service",
  description:
    "Image or video attached to a Listing, Event, or User profile; stored in Supabase Storage.",
  lifecycle: [],
  eventsEmitted: [],
  eventsConsumed: [],
} as const;
