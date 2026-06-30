/**
 * Prisma → Supabase compatibility shim.
 * Staybnb uses Prisma; Planviry uses Supabase.
 * This shim provides a Prisma-like interface backed by Supabase.
 * Each model name maps to a Supabase table.
 */
import { createAdminClient } from "@/lib/supabase/admin"

const supabase = createAdminClient()

// Prisma-like interface that delegates to Supabase
export const prisma = new Proxy({} as Record<string, unknown>, {
  get(_target, model: string) {
    return {
      findMany: async (opts?: Record<string, unknown>) => {
        let query = supabase.from(model).select("*")
        // Basic where clause support
        if (opts?.where) {
          for (const [key, value] of Object.entries(opts.where as Record<string, unknown>)) {
            if (typeof value === "object" && value !== null) {
              const v = value as Record<string, unknown>
              if (v.equals !== undefined) query = query.eq(key, v.equals)
              else if (v.gte !== undefined) query = query.gte(key, v.gte)
              else if (v.lte !== undefined) query = query.lte(key, v.lte)
              else if (v.gt !== undefined) query = query.gt(key, v.gt)
              else if (v.lt !== undefined) query = query.lt(key, v.lt)
              else if (v.in !== undefined) query = query.in(key, v.in as unknown[])
            } else {
              query = query.eq(key, value)
            }
          }
        }
        if (opts?.orderBy) {
          for (const [key, dir] of Object.entries(opts.orderBy as Record<string, string>)) {
            query = query.order(key, { ascending: dir === "asc" })
          }
        }
        if (opts?.take) query = query.limit(opts.take as number)
        if (opts?.skip) query = query.range(opts.skip as number, (opts.skip as number) + (opts.take as number || 10) - 1)
        const { data, error } = await query
        if (error) throw error
        return data ?? []
      },
      findUnique: async (opts?: Record<string, unknown>) => {
        let query = supabase.from(model).select("*")
        if (opts?.where) {
          for (const [key, value] of Object.entries(opts.where as Record<string, unknown>)) {
            query = query.eq(key, value)
          }
        }
        const { data, error } = await query.maybeSingle()
        if (error) throw error
        return data
      },
      findFirst: async (opts?: Record<string, unknown>) => {
        let query = supabase.from(model).select("*")
        if (opts?.where) {
          for (const [key, value] of Object.entries(opts.where as Record<string, unknown>)) {
            query = query.eq(key, value)
          }
        }
        query = query.limit(1)
        const { data, error } = await query
        if (error) throw error
        return (data as unknown[])?.[0] ?? null
      },
      count: async (opts?: Record<string, unknown>) => {
        let query = supabase.from(model).select("*", { count: "exact", head: true })
        if (opts?.where) {
          for (const [key, value] of Object.entries(opts.where as Record<string, unknown>)) {
            query = query.eq(key, value)
          }
        }
        const { count, error } = await query
        if (error) throw error
        return count ?? 0
      },
      create: async (opts?: Record<string, unknown>) => {
        const { data, error } = await supabase.from(model).insert(opts?.data as Record<string, unknown>).select("*").single()
        if (error) throw error
        return data
      },
      update: async (opts?: Record<string, unknown>) => {
        let query = supabase.from(model).update(opts?.data as Record<string, unknown>)
        if (opts?.where) {
          for (const [key, value] of Object.entries(opts.where as Record<string, unknown>)) {
            query = query.eq(key, value)
          }
        }
        const { data, error } = await query.select("*").single()
        if (error) throw error
        return data
      },
      delete: async (opts?: Record<string, unknown>) => {
        let query = supabase.from(model).delete()
        if (opts?.where) {
          for (const [key, value] of Object.entries(opts.where as Record<string, unknown>)) {
            query = query.eq(key, value)
          }
        }
        const { error } = await query
        if (error) throw error
        return true
      },
    }
  },
})
