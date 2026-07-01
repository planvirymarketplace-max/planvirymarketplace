import { createClient } from "@supabase/supabase-js";
const sb = createClient(
  "https://gzbtmvzidmrnbcgyonlu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YnRtdnppZG1ybmJjZ3lvbmx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU4NDcwNywiZXhwIjoyMDk4MTYwNzA3fQ.Lyux_w1TegynR20Q-uci5rNbs0ojeNWCMlzWuQDCAb4",
  { auth: { persistSession: false } }
);

const extra = ["ticket_instances", "check_in_lists", "capacity_assignments", "orders", "discounts", "waitlist_entries"];

(async () => {
  console.log("=== SERVICE_ROLE CHECK for task-spec-only tables ===\n");
  for (const table of extra) {
    const { data, error } = await sb.from(table).select("*").limit(1);
    if (error) {
      console.log(`  ✗ ${table}: ${error.message.slice(0, 100)}`);
    } else {
      console.log(`  ✓ ${table}: EXISTS, rows=${data?.length ?? 0}`);
    }
  }
})();
