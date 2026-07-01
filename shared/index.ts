/**
 * @planviry/shared — cross-cutting utilities.
 *
 * Part II §2.1 — shared/ holds logger, error classes, constants, date helpers.
 * Part II §2.2 — shared/ may only import from packages/types. It is a LEAF:
 *                 imported by all, imports nothing except types.
 *
 * FIX-5 — re-exports the pricing + availability adapters so consumer-web
 * routes can `import { calculatePrice, checkAvailability } from "@planviry/shared"`.
 */

export * from "./logger";
export * from "./errors";
export * from "./constants";
export * from "./dates";
export * from "./pricing-adapter";
export * from "./availability-adapter";
