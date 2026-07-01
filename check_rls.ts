import { createClient } from "@supabase/supabase-js";

// Service role client (bypasses RLS) — used only to confirm table existence
const sb = createClient(
  "https://gzbtmvzidmrnbcgyonlu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YnRtdnppZG1ybmJjZ3lvbmx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU4NDcwNywiZXhwIjoyMDk4MTYwNzA3fQ.Lyux_w1TegynR20Q-uci5rNbs0ojeNWCMlzWuQDCAb4",
  { auth: { persistSession: false } }
);

// Anon client — what an unauthenticated user would see
const anon = createClient(
  "https://gzbtmvzidmrnbcgyonlu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YnRtdnppZG1ybmJjZ3lvbmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODQ3MDcsImV4cCI6MjA5ODE2MDcwN30.P_54LIQaZy2Kn4LQ3gOHis42YVi8eDN-jItxj11nq5s",
  { auth: { persistSession: false } }
);

// Tables mentioned in the task spec (some may not exist in live DB)
const tables = [
  "user_profiles", "vendor_accounts", "inventory_items", "reservations",
  "carts", "cart_line_items", "itinerary_sessions", "ticket_tiers",
  "check_ins", "ticket_instances", "check_in_lists", "capacity_assignments",
  "notifications", "orders", "discounts", "waitlist_entries", "payments",
  "reviews", "saved_items", "domain_events"
];

// Tables that the schema doc says SHOULD have RLS
const schemaRlsTables = [
  "user_profiles", "vendor_accounts", "vendor_staff", "locations",
  "inventory_items", "pricing_rules", "availability_blocks", "media_assets",
  "itinerary_sessions", "itinerary_members", "carts", "cart_line_items",
  "reservations", "payments", "ticket_tiers", "check_ins",
  "taxonomy_nodes", "taxonomy_translations", "taxonomy_aliases",
  "pending_taxonomy_tags", "domain_events", "processed_stripe_events",
  "reports", "moderation_actions", "moderation_queue_items",
  "dmca_notices", "duplicate_clusters", "notifications",
  "in_app_notifications", "notification_rate", "reviews", "review_media",
  "review_helpful_marks", "saved_items", "service_tickets",
  "auth_audit_log", "job_checkpoints", "dead_letter_queue",
  "dead_letter_jobs", "feature_flags", "search_quality_weights",
  "push_subscription_endpoints"
];

(async () => {
  console.log("=== RLS CHECK (anon key) ===");
  console.log("(If 'ACCESSIBLE to anon' → RLS is OFF or policy allows public read)\n");
  for (const table of tables) {
    const { data, error } = await anon.from(table).select("*").limit(1);
    if (error) {
      const msg = error.message.slice(0, 80);
      // PGRST205 = schemaCacheMiss / relation does not exist
      const tag = /relation .* does not exist|PGRST205|Could not find/i.test(error.message)
        ? "MISSING_TABLE"
        : "BLOCKED";
      console.log(`  ${tag === "MISSING_TABLE" ? "?" : "✓"} ${table}: ${tag} — ${msg}`);
    } else {
      console.log(`  ⚠ ${table}: ACCESSIBLE to anon (RLS OFF or permissive policy) — rows=${data?.length ?? 0}`);
    }
  }

  console.log("\n=== SCHEMA-DOC TABLES — service_role sanity check ===");
  console.log("(Confirms each schema-doc table exists in live DB)\n");
  for (const table of schemaRlsTables) {
    const { error } = await sb.from(table).select("*").limit(1);
    if (error) {
      const tag = /relation .* does not exist|PGRST205|Could not find/i.test(error.message)
        ? "MISSING"
        : "EXISTS_ERR";
      console.log(`  ${tag === "MISSING" ? "?" : "✗"} ${table}: ${tag} — ${error.message.slice(0, 60)}`);
    } else {
      console.log(`  ✓ ${table}: exists (service_role can SELECT)`);
    }
  }
})();
