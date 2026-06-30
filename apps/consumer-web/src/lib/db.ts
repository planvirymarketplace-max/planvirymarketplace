/**
 * apps/consumer-web/src/lib/db.ts — re-exports the canonical Supabase client.
 *
 * Part I §1.1.5 — Supabase is the SOLE database tier. No Prisma. No SQLite.
 * Existing `import { db } from "@/lib/db"` now returns the Supabase client.
 */
export { supabase as db, createUserClient, type SupabaseClient } from "@planviry/db";
export { default } from "@planviry/db";
