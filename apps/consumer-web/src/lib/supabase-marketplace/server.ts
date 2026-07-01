import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { resolveTable } from "@/lib/db-compat"

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

export async function createClient() {
  const cookieStore = await cookies()

  return wrapWithCompat(createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
          }
        },
      },
    }
  ))
}
