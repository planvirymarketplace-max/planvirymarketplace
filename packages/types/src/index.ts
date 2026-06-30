/**
 * @planviry/types — placeholder barrel.
 *
 * The full Part III Domain Definition (DOM-001 … DOM-020) is implemented in
 * `src/domain/` by the domain-implementation task. This barrel re-exports
 * everything so consumers can `import { UserSchema, type InventoryItem } from
 * "@planviry/types"`.
 *
 * Part III §3.1 — Domain Object Catalog (binding source of truth for shapes).
 */

export * from "./ids";

// Domain entity schemas + types (Part III §3.1 — DOM-001 … DOM-020).
// Filled by the Part III implementation task; re-exported here.
export * from "./domain/index";

// Domain event payloads (Part III §3.1 "Events Emitted / Consumed" per entity).
export * from "./events/index";
