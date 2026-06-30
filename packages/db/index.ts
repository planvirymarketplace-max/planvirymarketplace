/**
 * @planviry/db — Supabase client (canonical database access for the entire monorepo).
 *
 * Part I  §1.1.5 — Supabase (PostgreSQL 15+) is the SOLE database tier.
 * Part I  §1.2.1 — Database layer: Supabase / PostgreSQL. No Prisma. No SQLite.
 * Part II §2.2  — apps/workers/functions import from here, never instantiate their own client.
 *
 * The database is LIVE at https://gzbtmvzidmrnbcgyonlu.supabase.co with the full
 * 43-table schema from Planviry_Full_Schema_TechnicalDoc_v1.0 already applied.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://gzbtmvzidmrnbcgyonlu.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required. Check apps/consumer-web/.env");
}

/**
 * Server-side Supabase client using the service_role key.
 * Bypasses RLS — for use in API routes, workers, and edge functions ONLY.
 * NEVER expose this client to the browser.
 */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "x-application-name": "planviry-api",
    },
  },
});

/**
 * Create a user-scoped Supabase client that respects RLS by forwarding the
 * caller's JWT. Use this for endpoints where RLS must enforce row-level isolation
 * (Part I §1.3 "RLS as Last Defense").
 */
export function createUserClient(userJwt: string): SupabaseClient {
  return createClient(SUPABASE_URL, userJwt, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "public" },
  });
}

export { createClient };
export type { SupabaseClient };
export type Database = {
  public: {
    Tables: {
      [table: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
};

export default supabase;
