import { createClient } from "@supabase/supabase-js";
const sb = createClient(
  "https://gzbtmvzidmrnbcgyonlu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YnRtdnppZG1ybmJjZ3lvbmx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU4NDcwNywiZXhwIjoyMDk4MTYwNzA3fQ.Lyux_w1TegynR20Q-uci5rNbs0ojeNWCMlzWuQDCAb4",
  { auth: { persistSession: false } }
);

const dummy = "00000000-0000-0000-0000-000000000000";

// Call each RPC with the documented parameter shape.
// If the function EXISTS, we'll get a domain-level error
// ("Inventory item not found", "Reservation not found", etc.)
// If the function is MISSING, PostgREST returns PGRST202 "Could not find".
const calls: Array<[string, Record<string, unknown>]> = [
  ["rpc_create_pending_reservation", {
    p_user_id: dummy, p_item_id: dummy, p_quantity: 1,
    p_starts_at: "2025-01-01T00:00:00Z", p_ends_at: "2025-01-02T00:00:00Z",
  }],
  ["rpc_confirm_reservation", { p_reservation_id: dummy, p_stripe_payment_intent_id: "pi_test" }],
  ["rpc_cancel_reservation", { p_reservation_id: dummy, p_reason: "test", p_refund_amount_cents: 0 }],
  ["rpc_complete_reservation", { p_reservation_id: dummy }],
  ["rpc_expire_reservation", { p_reservation_id: dummy }],
  ["rpc_mark_no_show", { p_reservation_id: dummy }],
  ["rpc_transition_inventory_status", { p_item_id: dummy, p_new_status: "PUBLISHED", p_reason: null }],
  ["rpc_transition_vendor_status", { p_vendor_id: dummy, p_new_status: "ACTIVE" }],
];

(async () => {
  console.log("=== RPC CHECK (with documented params) ===\n");
  for (const [rpc, args] of calls) {
    const { data, error } = await sb.rpc(rpc, args);
    if (!error) {
      console.log(`  ✓ ${rpc}: EXECUTED without error (data=${JSON.stringify(data)?.slice(0, 60)})`);
      continue;
    }
    const msg = error.message.slice(0, 120);
    const missing = /Could not find|PGRST202|function .* does not exist/i.test(error.message);
    console.log(`  ${missing ? "✗ MISSING" : "✓ EXISTS"} ${rpc}: ${missing ? "—" : "domain error: " + msg}`);
  }
})();
