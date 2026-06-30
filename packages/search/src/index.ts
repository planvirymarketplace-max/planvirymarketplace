/**
 * @planviry/search — Algolia client wrappers + index schema.
 *
 * Part II  §2.1 — packages/search owns Algolia client wrappers + index schema.
 * Part II  §2.2 — may import packages/types + packages/db (schema types only).
 * Part XVII §17.x — Search (full domain model pending Part XVII build).
 *
 * NOTE: The federated ranking decision (Part XLII Conflict #7 — single index
 * with category facet vs. multiple indices merged at query time) is OPEN.
 * It must be resolved before the index schema here is finalised.
 */

export const SEARCH_INDEX_NAMES = {
  /** Primary inventory index — pending Conflict #7 resolution. */
  inventory: "planviry_inventory",
  events: "planviry_events",
  vendors: "planviry_vendors",
  autocomplete: "planviry_autocomplete",
} as const;

export type SearchIndexName = keyof typeof SEARCH_INDEX_NAMES;
