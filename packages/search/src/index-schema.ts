/**
 * Algolia index schema definitions (Part XVII §17.3 — Search Index Schema).
 *
 * PENDING Part XVII + Part XLII Conflict #7 resolution.
 * This file is the stub where the canonical index document shape will live.
 */
export const INVENTORY_INDEX_SCHEMA = {
  // Resolved once Conflict #7 (federated ranking) is decided.
  objectID: "string",
  category: "string", // InventoryItem.category enum facet
  title: "string",
  location: "_geoloc",
} as const;
