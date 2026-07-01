/**
 * Prisma → Supabase compatibility shim.
 *
 * Staybnb was originally built against a Prisma + SQLite stack with tables
 * named `listings`, `draft_listings`, `profiles`, `reservations`, etc.
 * Planviry uses Supabase/Postgres with a polymorphic `inventory_items` table
 * (DOM-003) that stores every bookable thing on the platform.
 *
 * This shim exposes a Prisma-like `prisma.<model>.<method>(...)` interface and
 * transparently:
 *
 *   1. Maps Staybnb model names → Planviry Supabase table names
 *      (TABLE_MAP).  e.g. `prisma.listings` → `supabase.from('inventory_items')`.
 *
 *   2. Translates column names + value shapes on read AND write for the
 *      `listings` / `draft_listings` models, so the Staybnb hosting wizard
 *      code at `/hosting/create/listing/[id]/(steps)/*` runs unmodified.
 *      See `mapListingToInventory` / `unmapInventoryToListing` for the
 *      full column translation table.
 *
 *   3. Implements `prisma.$transaction(...)` (both array + callback forms) and
 *      `createMany` / `deleteMany` — operations the wizard uses via
 *      `completeDraftListing` in `daft-listings.ts`.
 *
 *   4. Routes `prisma.listingAmenities.createMany(...)` to a side-effect that
 *      updates the parent `inventory_items.metadata.amenities` array, since
 *      Planviry has no separate `listing_amenities` join table.
 *
 * Note: the underlying Supabase client is the `createAdminClient()` from
 * `@/lib/supabase/admin`, which already wraps `.from(table)` with the
 * `db-compat` `resolveTable` layer.  That layer only redirects old-schema
 * table NAMES; it does not do column-level translation.  The column mapping
 * therefore lives here in the Prisma shim, not in db-compat.
 */
import { createAdminClient } from "@/lib/supabase/admin"

const supabase = createAdminClient()

/* -------------------------------------------------------------------------- */
/*  TABLE MAP — Staybnb Prisma model → Planviry Supabase table                */
/* -------------------------------------------------------------------------- */

const TABLE_MAP: Record<string, string> = {
  // Inventory cluster
  listings: "inventory_items",
  draft_listings: "inventory_items",
  experience_listings: "inventory_items",
  external_events: "inventory_items",
  vendor_packages: "inventory_items",

  // Identity & vendor cluster
  profiles: "user_profiles",
  users: "user_profiles",
  vendors: "vendor_accounts",
  vendor_profiles: "vendor_accounts",

  // Booking cluster
  reservations: "reservations", // same name — listed for clarity
  favorites: "saved_items",
  saved_searches: "saved_items",
  trips: "itinerary_sessions",

  // Note: `listingAmenities` / `listing_amenities` / `amenities` do NOT map
  // to a real Planviry table.  They are intercepted by the
  // `createListingAmenitiesHandler` below and stored inside
  // `inventory_items.metadata.amenities` as a JSON array.
}

/* -------------------------------------------------------------------------- */
/*  Column-level translation helpers (listings ↔ inventory_items)             */
/* -------------------------------------------------------------------------- */

/**
 * Staybnb listing status (lowercase) → Planviry inventory_items.status (UPPER).
 * Planviry's enum is DRAFT | PUBLISHED | ACTIVE | PAUSED | ARCHIVED | DELETED.
 * Staybnb uses draft | pending | published | paused.  `pending` (awaiting
 * admin approval) is mapped to PUBLISHED — Planviry has no separate pending
 * state, and the hosting wizard's `completeDraftListing` flow expects the
 * completed listing to be visible immediately.
 */
function mapStatus(s: unknown): unknown {
  if (typeof s !== "string") return s
  const m: Record<string, string> = {
    draft: "DRAFT",
    pending: "PUBLISHED",
    published: "PUBLISHED",
    paused: "PAUSED",
    active: "ACTIVE",
    archived: "ARCHIVED",
    deleted: "DELETED",
  }
  return m[s] ?? s.toUpperCase()
}

/** Inverse of `mapStatus` — Planviry status → Staybnb status. */
function unmapStatus(s: unknown): unknown {
  if (typeof s !== "string") return s
  const m: Record<string, string> = {
    DRAFT: "draft",
    PUBLISHED: "published",
    ACTIVE: "published",
    PAUSED: "paused",
    ARCHIVED: "archived",
    DELETED: "deleted",
  }
  return m[s] ?? s.toLowerCase()
}

/** Derive Planviry inventory category from Staybnb property_type. */
function deriveCategory(propertyType: unknown): string {
  if (
    typeof propertyType === "string" &&
    ["House", "Apartment", "Cabin", "Boat"].includes(propertyType)
  ) {
    return "VACATION_RENTAL"
  }
  return "LODGING"
}

/** Slugify a title for the inventory_items.slug column. */
function slugifyTitle(title: unknown): string | undefined {
  if (typeof title !== "string" || !title) return undefined
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return slug || undefined
}

/** Staybnb min_cancel_days (int) → Planviry cancellation_policy (text). */
function cancellationPolicyFromDays(days: unknown): string | undefined {
  if (typeof days !== "number") return undefined
  if (days <= 0) return "Non-refundable"
  if (days === 1) return "Free cancellation up to 1 day before check-in"
  return `Free cancellation up to ${days} days before check-in`
}

/** Inverse — Planviry cancellation_policy → Staybnb min_cancel_days. */
function daysFromCancellationPolicy(policy: unknown): number | undefined {
  if (typeof policy !== "string") return undefined
  if (policy.toLowerCase().includes("non-refundable")) return 0
  const m = policy.match(/up to (\d+) days? before/i)
  return m ? parseInt(m[1], 10) : undefined
}

/**
 * Staybnb fields that don't have a direct column on `inventory_items` and
 * must be packed into the `metadata` JSONB.  Planviry's `metadata` field is
 * category-specific; for VACATION_RENTAL / LODGING items we use it to store
 * the Staybnb-specific structure (guest_limits, structure, promotions,
 * check-in/out times, safety_items, images, location, score, amenities,
 * draft-only fields like current_step / visited_steps).
 */
const METADATA_FIELDS = new Set([
  "images",
  "location",
  "structure",
  "guest_limits",
  "promotions",
  "safety_items",
  "check_in_time",
  "check_out_time",
  "property_type",
  "privacy_type",
  "amenities",
  "current_step",
  "visited_steps",
  "score",
  "min_cancel_days",
])

/** Fields that map 1:1 (same name) onto inventory_items columns. */
const DIRECT_FIELDS = new Set([
  "id",
  "title",
  "description",
  "created_at",
  "updated_at",
])

/**
 * Map Staybnb listing row → Planviry inventory_items row (write direction).
 *
 * Column translation:
 *   host_id          → vendor_id
 *   night_price ($s) → base_price_cents (¢, ×100)
 *   status (lower)   → status (UPPER)   [default: DRAFT for draft_listings,
 *                                         PUBLISHED for listings — Staybnb's
 *                                         Prisma schema set a column default
 *                                         of 'draft'; Planviry's status column
 *                                         is NOT NULL with no default, so the
 *                                         shim supplies one]
 *   score (JSONB)    → metadata.score + quality_score (decimal)
 *   min_cancel_days  → cancellation_policy (text) + metadata.min_cancel_days
 *   images / location / structure / guest_limits / promotions /
 *   safety_items / check_in_time / check_out_time / property_type /
 *   privacy_type / amenities / current_step / visited_steps
 *                     → metadata.<field>
 *   (derived)        → category = VACATION_RENTAL | LODGING
 *   (derived)        → slug = slugify(title)
 *   (derived)        → is_free = (night_price === 0)
 *   (derived)        → created_at / updated_at = now()
 *
 * @param model — "listings" or "draft_listings" (controls the default status
 *                when none is supplied in `data`).
 */
function mapListingToInventory(
  data: Record<string, unknown>,
  model: string,
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  const metadata: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue

    if (k === "host_id") {
      out["vendor_id"] = v
    } else if (k === "night_price") {
      // Staybnb stores dollars (float); Planviry stores cents (int).
      out["base_price_cents"] =
        typeof v === "number" ? Math.round(v * 100) : v
      if (v === 0) out["is_free"] = true
    } else if (k === "status") {
      out["status"] = mapStatus(v)
    } else if (k === "score") {
      // Preserve full score object (value + reviews[]) in metadata.
      metadata["score"] = v
      if (
        v &&
        typeof v === "object" &&
        "value" in (v as Record<string, unknown>)
      ) {
        out["quality_score"] = (v as { value: number }).value
      }
    } else if (k === "min_cancel_days") {
      metadata["min_cancel_days"] = v
      const p = cancellationPolicyFromDays(v)
      if (p) out["cancellation_policy"] = p
    } else if (METADATA_FIELDS.has(k)) {
      metadata[k] = v
    } else if (DIRECT_FIELDS.has(k)) {
      out[k] = v
    } else {
      // Unknown Staybnb field — preserve in metadata so we don't lose data.
      metadata[k] = v
    }
  }

  // Derive category from property_type (default LODGING).
  if (metadata.property_type) {
    out["category"] = deriveCategory(metadata.property_type)
  } else if (!out["category"]) {
    out["category"] = "LODGING"
  }

  // Default status — Staybnb's Prisma schema defaulted this to 'draft';
  // Planviry's `inventory_items.status` is NOT NULL with no default, so the
  // shim supplies one based on the calling model.
  if (out["status"] === undefined) {
    out["status"] = model === "draft_listings" ? "DRAFT" : "PUBLISHED"
  }

  // Derive slug from title.
  if (out["title"] && !out["slug"]) {
    const s = slugifyTitle(out["title"])
    if (s) out["slug"] = s
  }

  // Default is_free.
  if (out["is_free"] === undefined) out["is_free"] = false

  if (Object.keys(metadata).length > 0) {
    out["metadata"] = metadata
  }

  return out
}

/**
 * Map Planviry inventory_items row → Staybnb listing row (read direction).
 * Inverse of `mapListingToInventory`.  Fills in Staybnb-expected defaults
 * (empty arrays / zero score) so the wizard's parsers don't crash on missing
 * fields.
 */
function unmapInventoryToListing(
  row: Record<string, unknown> | null,
): Record<string, unknown> | null {
  if (!row) return null

  const out: Record<string, unknown> = {}
  const metadata =
    ((row.metadata as Record<string, unknown>) ?? {}) as Record<string, unknown>

  for (const [k, v] of Object.entries(row)) {
    if (k === "metadata") continue
    if (k === "vendor_id") {
      out["host_id"] = v
    } else if (k === "base_price_cents") {
      // Planviry cents → Staybnb dollars.
      out["night_price"] = typeof v === "number" ? v / 100 : v
    } else if (k === "status") {
      out["status"] = unmapStatus(v)
    } else if (
      k === "quality_score" ||
      k === "cancellation_policy" ||
      k === "category" ||
      k === "slug" ||
      k === "is_free"
    ) {
      // Planviry-only columns — skipped; reconstructed below from metadata.
    } else {
      out[k] = v
    }
  }

  // Unpack metadata back into Staybnb columns.
  for (const [k, v] of Object.entries(metadata)) {
    if (out[k] === undefined) out[k] = v
  }

  // Reconstruct score from quality_score if metadata didn't carry one.
  if (
    out["score"] === undefined &&
    row["quality_score"] !== undefined &&
    row["quality_score"] !== null
  ) {
    out["score"] = { value: row["quality_score"], reviews: [] }
  }

  // Reconstruct min_cancel_days from cancellation_policy if missing.
  if (
    out["min_cancel_days"] === undefined &&
    row["cancellation_policy"] !== undefined &&
    row["cancellation_policy"] !== null
  ) {
    const d = daysFromCancellationPolicy(row["cancellation_policy"])
    if (d !== undefined) out["min_cancel_days"] = d
  }

  // Defaults Staybnb parsers expect.
  if (out["images"] === undefined) out["images"] = []
  if (out["promotions"] === undefined) out["promotions"] = []
  if (out["safety_items"] === undefined) out["safety_items"] = []
  if (out["amenities"] === undefined) out["amenities"] = []
  if (out["score"] === undefined) out["score"] = { value: 0, reviews: [] }
  if (out["guest_limits"] === undefined) out["guest_limits"] = {}
  if (out["structure"] === undefined) out["structure"] = {}

  return out
}

/* -------------------------------------------------------------------------- */
/*  Where-clause translation                                                  */
/* -------------------------------------------------------------------------- */

/** Map a Staybnb where-clause key to the Planviry column name. */
function mapWhereKey(model: string, key: string): string {
  if (model === "listings" || model === "draft_listings") {
    if (key === "host_id") return "vendor_id"
    if (key === "night_price") return "base_price_cents"
  }
  return key
}

/**
 * Map a Staybnb where-clause value to the Planviry value (handles status
 * enum case + dollar→cent conversion + nested Prisma operators
 * `{ equals, gte, lte, gt, lt, in, ne, not }`).
 */
function mapWhereValue(
  model: string,
  key: string,
  value: unknown,
): unknown {
  if (model !== "listings" && model !== "draft_listings") return value

  if (key === "status") {
    if (typeof value === "object" && value !== null) {
      const v = value as Record<string, unknown>
      const mapped: Record<string, unknown> = {}
      for (const [op, val] of Object.entries(v)) {
        if (op === "in" && Array.isArray(val)) {
          mapped[op] = val.map(mapStatus)
        } else {
          mapped[op] = mapStatus(val)
        }
      }
      return mapped
    }
    return mapStatus(value)
  }

  if (key === "night_price") {
    const scale = (n: unknown) =>
      typeof n === "number" ? Math.round(n * 100) : n
    if (typeof value === "object" && value !== null) {
      const v = value as Record<string, unknown>
      const mapped: Record<string, unknown> = {}
      for (const [op, val] of Object.entries(v)) {
        if (op === "in" && Array.isArray(val)) {
          mapped[op] = val.map(scale)
        } else {
          mapped[op] = scale(val)
        }
      }
      return mapped
    }
    return scale(value)
  }

  if (key === "host_id") {
    // No value transformation — column name handled by mapWhereKey.
    return value
  }

  return value
}

/** Apply a Prisma-style where clause to a Supabase query builder. */
function applyWhere(
  query: any,
  model: string,
  where: Record<string, unknown> | undefined,
): any {
  if (!where) return query
  for (const [key, rawValue] of Object.entries(where)) {
    // Skip `undefined` values — the wizard sometimes passes
    // `{ id: undefined, host_id: "..." }` to mean "no id filter".
    if (rawValue === undefined) continue
    const realKey = mapWhereKey(model, key)
    const value = mapWhereValue(model, key, rawValue)
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const v = value as Record<string, unknown>
      if (v.equals !== undefined) query = query.eq(realKey, v.equals)
      else if (v.gte !== undefined) query = query.gte(realKey, v.gte)
      else if (v.lte !== undefined) query = query.lte(realKey, v.lte)
      else if (v.gt !== undefined) query = query.gt(realKey, v.gt)
      else if (v.lt !== undefined) query = query.lt(realKey, v.lt)
      else if (v.in !== undefined) query = query.in(realKey, v.in as unknown[])
      else if (v.ne !== undefined) query = query.neq(realKey, v.ne)
      else if (v.not !== undefined) query = query.neq(realKey, v.not)
      // Prisma operators like `contains`, `startsWith`, `mode` are ignored —
      // the wizard doesn't use them.  Future work: add ilike for `contains`.
    } else {
      query = query.eq(realKey, value)
    }
  }
  return query
}

/**
 * Auto-add a status filter so that:
 *   - `prisma.draft_listings.*` only ever returns/updates/deletes DRAFT rows
 *     (otherwise the wizard would see published listings masquerading as drafts).
 *   - `prisma.listings.*` only returns non-draft rows (so /hosting/listings
 *     doesn't show in-progress drafts).
 *
 * Skipped when the caller explicitly sets `where.status` (so callers like
 * `getPopularListings({ where: { status: "published" } })` still work).
 */
function applyDefaultStatusFilter(
  query: any,
  model: string,
  where: Record<string, unknown> | undefined,
): any {
  if (model !== "listings" && model !== "draft_listings") return query
  if (where && where.status !== undefined) return query
  if (model === "draft_listings") {
    return query.eq("status", "DRAFT")
  }
  return query.neq("status", "DRAFT")
}

/** Apply Prisma `orderBy` (object form: `{ col: "asc" | "desc" }`). */
function applyOrderBy(
  query: any,
  orderBy: Record<string, string> | undefined,
): any {
  if (!orderBy) return query
  for (const [key, dir] of Object.entries(orderBy)) {
    query = query.order(key, { ascending: dir === "asc" })
  }
  return query
}

/* -------------------------------------------------------------------------- */
/*  listingAmenities side-effect handler                                      */
/* -------------------------------------------------------------------------- */

/**
 * Planviry has no `listing_amenities` join table — amenity IDs are stored as
 * a JSON array inside `inventory_items.metadata.amenities`.  This handler
 * intercepts `prisma.listingAmenities.createMany` / `deleteMany` and updates
 * the parent inventory_items row's metadata accordingly.
 *
 * The wizard uses `listingAmenities.createMany` inside `completeDraftListing`
 * to attach the user-selected amenity IDs (numbers from Staybnb's amenities
 * table) to the newly-created listing.
 */
function createListingAmenitiesHandler() {
  return {
    createMany: async (opts?: Record<string, unknown>) => {
      const rows = (opts?.data ?? []) as Array<Record<string, unknown>>
      // Group by listing_id (= inventory_items.id).
      const byItem = new Map<string, unknown[]>()
      for (const row of rows) {
        const itemId = String(row.listing_id)
        if (!byItem.has(itemId)) byItem.set(itemId, [])
        byItem.get(itemId)!.push(row.amenity_id)
      }
      for (const [itemId, amenityIds] of byItem.entries()) {
        const { data: existing } = await supabase
          .from("inventory_items")
          .select("metadata")
          .eq("id", itemId)
          .maybeSingle()
        const meta =
          ((existing as any)?.metadata as Record<string, unknown>) ?? {}
        const existingAmenities = (meta.amenities as unknown[]) ?? []
        const merged = Array.from(new Set([...existingAmenities, ...amenityIds]))
        await supabase
          .from("inventory_items")
          .update({ metadata: { ...meta, amenities: merged } })
          .eq("id", itemId)
      }
      return { count: rows.length }
    },
    deleteMany: async (opts?: Record<string, unknown>) => {
      const where = (opts?.where ?? {}) as Record<string, unknown>
      const listingId = where.listing_id
      if (listingId !== undefined) {
        const itemId = String(listingId)
        const { data: existing } = await supabase
          .from("inventory_items")
          .select("metadata")
          .eq("id", itemId)
          .maybeSingle()
        const meta =
          ((existing as any)?.metadata as Record<string, unknown>) ?? {}
        await supabase
          .from("inventory_items")
          .update({ metadata: { ...meta, amenities: [] } })
          .eq("id", itemId)
      }
      return { count: 0 }
    },
    // The wizard only uses createMany / deleteMany on listingAmenities.
    // Other methods (findMany, create, update, delete) are stubbed out so
    // that an accidental call doesn't crash — they return empty / null.
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    count: async () => 0,
    create: async () => null,
    update: async () => null,
    delete: async () => true,
  }
}

/* -------------------------------------------------------------------------- */
/*  Generic model handler                                                     */
/* -------------------------------------------------------------------------- */

function createModelHandler(model: string) {
  // Special-case: listingAmenities has no backing table.
  if (model === "listingAmenities" || model === "listing_amenities") {
    return createListingAmenitiesHandler()
  }

  const realTable = TABLE_MAP[model] ?? model
  const isListingModel = model === "listings" || model === "draft_listings"

  return {
    findMany: async (opts?: Record<string, unknown>) => {
      let query = supabase.from(realTable).select("*")
      query = applyDefaultStatusFilter(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      query = applyWhere(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      query = applyOrderBy(
        query,
        opts?.orderBy as Record<string, string> | undefined,
      )
      if (opts?.take) query = query.limit(opts.take as number)
      if (opts?.skip) {
        const skip = opts.skip as number
        const take = (opts.take as number) || 10
        query = query.range(skip, skip + take - 1)
      }
      const { data, error } = await query
      if (error) throw error
      const rows = (data ?? []) as Record<string, unknown>[]
      return isListingModel ? rows.map((r) => unmapInventoryToListing(r)) : rows
    },

    findUnique: async (opts?: Record<string, unknown>) => {
      let query = supabase.from(realTable).select("*")
      query = applyDefaultStatusFilter(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      query = applyWhere(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      const { data, error } = await query.maybeSingle()
      if (error) throw error
      return isListingModel
        ? unmapInventoryToListing(data as Record<string, unknown> | null)
        : data
    },

    findFirst: async (opts?: Record<string, unknown>) => {
      let query = supabase.from(realTable).select("*")
      query = applyDefaultStatusFilter(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      query = applyWhere(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      query = query.limit(1)
      const { data, error } = await query
      if (error) throw error
      const rows = (data ?? []) as Record<string, unknown>[]
      const first = rows[0] ?? null
      return isListingModel ? unmapInventoryToListing(first) : first
    },

    count: async (opts?: Record<string, unknown>) => {
      let query = supabase
        .from(realTable)
        .select("*", { count: "exact", head: true })
      query = applyDefaultStatusFilter(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      query = applyWhere(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      const { count, error } = await query
      if (error) throw error
      return count ?? 0
    },

    create: async (opts?: Record<string, unknown>) => {
      const data = (opts?.data ?? {}) as Record<string, unknown>
      const mapped = isListingModel
        ? mapListingToInventory(data, model)
        : { ...data }
      // Auto-set timestamps (Planviry inventory_items has created_at/updated_at).
      if (mapped.created_at === undefined)
        mapped.created_at = new Date().toISOString()
      if (mapped.updated_at === undefined)
        mapped.updated_at = new Date().toISOString()
      const { data: result, error } = await supabase
        .from(realTable)
        .insert(mapped)
        .select("*")
        .single()
      if (error) throw error
      return isListingModel
        ? unmapInventoryToListing(result as Record<string, unknown>)
        : result
    },

    createMany: async (opts?: Record<string, unknown>) => {
      const data = (opts?.data ?? []) as Array<Record<string, unknown>>
      const rows = Array.isArray(data) ? data : [data]
      const mapped = isListingModel
        ? rows.map((r) => mapListingToInventory(r, model))
        : rows
      // Auto-set timestamps.
      const now = new Date().toISOString()
      for (const r of mapped) {
        if (r.created_at === undefined) r.created_at = now
        if (r.updated_at === undefined) r.updated_at = now
      }
      const { error } = await supabase.from(realTable).insert(mapped)
      if (error) throw error
      return { count: rows.length }
    },

    update: async (opts?: Record<string, unknown>) => {
      const data = (opts?.data ?? {}) as Record<string, unknown>
      const mapped = isListingModel
        ? mapListingToInventory(data, model)
        : { ...data }
      // Auto-bump updated_at.
      if (mapped.updated_at === undefined)
        mapped.updated_at = new Date().toISOString()
      let query = supabase.from(realTable).update(mapped)
      query = applyDefaultStatusFilter(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      query = applyWhere(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      // Use .maybeSingle() so that a no-op update (where clause matched
      // nothing) returns null instead of throwing PGRST116.
      const { data: result, error } = await query.select("*").maybeSingle()
      if (error) throw error
      return isListingModel
        ? unmapInventoryToListing(result as Record<string, unknown> | null)
        : result
    },

    delete: async (opts?: Record<string, unknown>) => {
      let query = supabase.from(realTable).delete()
      query = applyDefaultStatusFilter(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      query = applyWhere(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      const { error } = await query
      if (error) throw error
      return true
    },

    deleteMany: async (opts?: Record<string, unknown>) => {
      let query = supabase.from(realTable).delete()
      query = applyDefaultStatusFilter(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      query = applyWhere(
        query,
        model,
        opts?.where as Record<string, unknown> | undefined,
      )
      const { error } = await query
      if (error) throw error
      return { count: 0 }
    },

    upsert: async (opts?: Record<string, unknown>) => {
      // Minimal upsert — used by a few non-wizard callers.
      const data = (opts?.data ?? {}) as Record<string, unknown>
      const mapped = isListingModel
        ? mapListingToInventory(data, model)
        : { ...data }
      const now = new Date().toISOString()
      if (mapped.created_at === undefined) mapped.created_at = now
      if (mapped.updated_at === undefined) mapped.updated_at = now
      const { data: result, error } = await supabase
        .from(realTable)
        .upsert(mapped)
        .select("*")
        .maybeSingle()
      if (error) throw error
      return isListingModel
        ? unmapInventoryToListing(result as Record<string, unknown> | null)
        : result
    },
  }
}

/* -------------------------------------------------------------------------- */
/*  $transaction — supports both array form and callback form                 */
/* -------------------------------------------------------------------------- */

/**
 * Prisma's `$transaction` has two calling conventions:
 *
 *   1. Array form:    `prisma.$transaction([prisma.x.update(...), prisma.y.delete(...)])`
 *   2. Callback form: `prisma.$transaction(async (tx) => { await tx.x.create(...); ... })`
 *
 * Supabase JS client doesn't expose multi-statement transactions without an
 * RPC, so this shim runs the operations sequentially.  For the wizard's
 * `completeDraftListing` callback (create listing → link amenities → delete
 * draft), sequential execution is correct: if any step throws, the subsequent
 * steps are skipped, leaving a partial state — but the wizard surfaces the
 * error to the user via `toast.error("Failed to create listing.")` and the
 * orphan draft row remains visible in the user's draft list, so they can
 * retry.  A future hardening pass should add a compensating-action wrapper.
 */
function createTransactionHandler() {
  return async (
    args: unknown[] | ((tx: typeof prisma) => Promise<unknown>),
  ): Promise<unknown> => {
    if (typeof args === "function") {
      // Callback form — pass `prisma` itself as `tx` (no real BEGIN/COMMIT).
      return await (args as (tx: typeof prisma) => Promise<unknown>)(prisma)
    }
    if (Array.isArray(args)) {
      // Array form — each element is a Promise from a prisma.<model>.<method>() call.
      const results: unknown[] = []
      for (const op of args) {
        if (op instanceof Promise) {
          results.push(await op)
        } else {
          results.push(op)
        }
      }
      return results
    }
    throw new Error(
      "Unsupported $transaction argument (expected array or function)",
    )
  }
}

/* -------------------------------------------------------------------------- */
/*  Exported prisma proxy                                                     */
/* -------------------------------------------------------------------------- */

export const prisma = new Proxy({} as Record<string, unknown>, {
  get(_target, model: string) {
    if (model === "$transaction") return createTransactionHandler()
    // Prisma exposes internals like `$on`, `$use`, `$connect`, `$disconnect`
    // that the wizard doesn't call — return a no-op function for any $-prefixed
    // property to be safe.
    if (typeof model === "string" && model.startsWith("$")) {
      return async () => undefined
    }
    return createModelHandler(model)
  },
})
