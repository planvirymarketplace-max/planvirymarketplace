/**
 * DOM-017 — SearchDocument
 *
 * Owner: Search Service (Part X).
 *
 * Algolia document representing a searchable entity; denormalized for
 * query performance.
 */

import { z } from "zod";
import type { SearchDocumentId } from "../ids";

export const SearchDocumentSchema = z
  .object({
    id: z.string(),
    /** The Algolia objectID (typically the source entity's id). */
    objectID: z.string().min(1),
    /** Target Algolia index (e.g. "inventory_items", "events"). */
    indexName: z.string().min(1),
    /** Denormalized payload — shape varies by indexName. */
    payload: z.record(z.string(), z.unknown()),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type SearchDocument = Omit<
  z.infer<typeof SearchDocumentSchema>,
  "id"
> & { id: SearchDocumentId };

export const SearchDocument_META = {
  id: "DOM-017",
  owner: "Search Service",
  description:
    "Algolia document representing a searchable entity; denormalized for query performance.",
  lifecycle: [],
  eventsEmitted: [],
  eventsConsumed: [],
} as const;
