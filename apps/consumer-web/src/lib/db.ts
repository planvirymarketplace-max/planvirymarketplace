/**
 * apps/consumer-web/src/lib/db.ts
 *
 * Re-exports the canonical PrismaClient singleton from @planviry/db so the
 * existing `import { db } from "@/lib/db"` contract keeps working after the
 * monorepo migration (Part II §2.1 — packages/db owns the schema + client).
 *
 * Part II  §2.2 — apps may import from packages/db.
 */
export { db, PrismaClient } from "@planviry/db";
export type * from "@planviry/db";
