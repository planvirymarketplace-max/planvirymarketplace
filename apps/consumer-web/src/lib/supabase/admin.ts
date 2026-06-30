import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./types"
import { resolveTable } from "../db-compat"

function wrapWithCompat<T extends { from: (table: string) => unknown }>(client: T): T {
  return new Proxy(client as object, {
    get(target: T, prop: string | symbol, receiver: unknown) {
      if (prop === "from") {
        return (table: string) => (target as { from: (t: string) => unknown }).from(resolveTable(table))
      }
      return Reflect.get(target, prop, receiver)
    },
  }) as T
}

export function createAdminClient() {
  return wrapWithCompat(
    createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  )
}
