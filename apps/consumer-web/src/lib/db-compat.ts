/**
 * Planviry — Database Compatibility Layer
 *
 * Part XLVI (Frontend Retrofit Registry) — the existing frontend was built
 * against the OLD schema (vendors, listings, bookings, categories, etc.).
 * The LIVE Supabase database uses the NEW schema (vendor_accounts,
 * inventory_items, reservations, taxonomy_nodes, etc.) per
 * Planviry_Full_Schema_TechnicalDoc_v1.0.
 *
 * This module wraps the Supabase client so that `.from('old_table')` calls
 * are transparently redirected to the new-schema table. This keeps all 75
 * existing API routes functional without rewriting each one individually.
 *
 * Column-level differences are handled per-route as needed; the table-level
 * redirect fixes the "table not found" 500s immediately.
 */

const TABLE_MAP: Record<string, string> = {
  // Identity & vendor cluster
  vendors: "vendor_accounts",
  vendor_profiles: "vendor_accounts",
  vendor_users: "vendor_staff",
  vendor_categories: "taxonomy_nodes",
  vendor_category_groups: "taxonomy_nodes",
  vendor_gallery: "media_assets",
  vendor_portfolios: "media_assets",
  vendor_packages: "inventory_items",
  vendor_socials: "vendor_accounts",
  vendor_filter_answers: "vendor_accounts",
  vendor_lodging_blocks: "availability_blocks",
  vendor_signups: "vendor_accounts",
  vendor_analytics: "domain_events",
  vendor_card_cache: "vendor_accounts", // cache table — falls back to live data

  // Inventory cluster
  listings: "inventory_items",
  categories: "taxonomy_nodes",
  filter_definitions: "taxonomy_nodes",
  filter_inheritance: "taxonomy_nodes",
  experience_listings: "inventory_items",
  experience_slots: "availability_blocks",
  restaurant_availability_slots: "availability_blocks",
  external_events: "inventory_items",

  // Booking cluster
  bookings: "reservations",
  orders: "payments",
  order_items: "payments",
  trips: "itinerary_sessions",
  trip_itinerary_items: "reservations",
  experience_reservations: "reservations",
  restaurant_reservations: "reservations",
  escrow_holds: "payments",

  // Ticketing cluster
  tickets: "ticket_tiers",
  ticket_queue: "service_tickets",

  // Taxonomy & search
  search_autocomplete_terms: "taxonomy_nodes",

  // CRM / operational
  leads: "service_tickets",
  inquiries: "service_tickets",
  quotes: "service_tickets",
  contracts: "service_tickets",
  claim_requests: "vendor_accounts",
  disputes: "service_tickets",

  // User
  users: "user_profiles",
  saved_searches: "saved_items",

  // Admin
  admin_lead_stats: "domain_events",

  // These already match the new schema — no redirect needed:
  // notifications, reviews, service_tickets, etc.
};

/**
 * Resolve an old-schema table name to the new-schema table name.
 * If no mapping exists, returns the original (may already be new-schema).
 */
export function resolveTable(table: string): string {
  return TABLE_MAP[table] ?? table;
}

/**
 * Check if a table name is a known old-schema table that needs redirecting.
 */
export function isOldTable(table: string): boolean {
  return table in TABLE_MAP;
}

export { TABLE_MAP };
