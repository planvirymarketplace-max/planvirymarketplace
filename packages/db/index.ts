/**
 * @planviry/db
 *
 * Canonical database client for the entire Planviry monorepo.
 * Every app, worker, and edge function that needs DB access imports
 * from here — never instantiates its own PrismaClient.
 *
 * Part II  §2.2 — Import Rules: packages/db may only import from packages/types.
 * Part I   §1.3 — Architecture Principle "State in Postgres": all canonical
 *                 state lives in the database; client state is derived.
 * Part VI  §6.x — Data Layer / Database Specification (schema lives in ./prisma).
 *
 * Usage:
 *   import { db } from "@planviry/db";
 *   const user = await db.user.findUnique({ where: { id } });
 *
 * NOTE on lazy initialization:
 *   The PrismaClient is constructed lazily (on first property access) via a
 *   Proxy. This means `import { db }` never triggers Prisma runtime
 *   initialization — important in bundled contexts (Next.js transpilePackages)
 *   where the generated client resolution happens at call time, not import
 *   time. The workspace package boundary resolves on import; the DB runtime
 *   activates on first query. Full Prisma runtime wiring is a Part VI task.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __planviryPrisma?: PrismaClient;
};

function createClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error", "warn"]
        : ["query", "error", "warn"],
  });
}

/**
 * Lazy PrismaClient singleton. Construction is deferred to the first property
 * access so that merely importing `@planviry/db` never fails — the workspace
 * boundary resolves cleanly, and the Prisma runtime only initializes when a
 * caller actually queries the database.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    if (!globalForPrisma.__planviryPrisma) {
      globalForPrisma.__planviryPrisma = createClient();
      if (process.env.NODE_ENV !== "production") {
        // keep the singleton on globalThis across HMR / fast-refresh
      }
    }
    const value = Reflect.get(globalForPrisma.__planviryPrisma, prop);
    return typeof value === "function" ? value.bind(globalForPrisma.__planviryPrisma) : value;
  },
});

export { PrismaClient } from "@prisma/client";
export type * from "@prisma/client";

export default db;
