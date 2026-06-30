/**
 * DOM-018 — TaxonomyTag
 *
 * Owner: Taxonomy Engine (Part XVIII).
 *
 * A canonical tag from the platform taxonomy; applied to
 * InventoryItems and Events.
 */

import { z } from "zod";
import type { TaxonomyTagId } from "../ids";

export const TaxonomyTagTypeSchema = z.enum([
  "GENRE",
  "SUBGENRE",
  "TAG",
  "FACET",
  "CATEGORY",
  "DYNAMIC_TAG",
  "STATIC_TAG",
  "USER_TAG",
  "SEARCH_TAG",
]);
export type TaxonomyTagType = z.infer<typeof TaxonomyTagTypeSchema>;

export const TaxonomyTagSchema = z
  .object({
    id: z.string(),
    /** URL-safe slug, unique within the platform. */
    slug: z.string().min(1),
    label: z.string().min(1),
    type: TaxonomyTagTypeSchema,
    /** Parent tag id (null for root tags). */
    parentId: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type TaxonomyTag = Omit<z.infer<typeof TaxonomyTagSchema>, "id"> & {
  id: TaxonomyTagId;
};

export const TaxonomyTag_META = {
  id: "DOM-018",
  owner: "Taxonomy Engine",
  description:
    "A canonical tag from the platform taxonomy; applied to InventoryItems and Events.",
  lifecycle: [],
  eventsEmitted: [],
  eventsConsumed: [],
} as const;
