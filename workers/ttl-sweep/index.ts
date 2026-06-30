/**
 * @planviry/worker-ttl-sweep
 *
 * Cron job: expires PENDING Reservations past their TTL and releases held
 * inventory (BR-R-002). Calls rpc_expire_reservation for each.
 *
 * Adapted from movinin's TTL sweep pattern (Mongo expireAt index → Postgres
 * ttl_expires_at column + this worker polling).
 *
 * Spec refs:
 *   Part II  §2.1 — workers/ttl-sweep
 *   Part V         Reservation FSM: PENDING → EXPIRED (TTL)
 *   Part XIV §14.x Background Jobs
 */
import { createClient } from "@supabase/supabase-js";
import { createLogger } from "@planviry/shared";

const logger = createLogger("worker:ttl-sweep");
const SWEEP_INTERVAL_MS = 60_000; // 1 minute

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://gzbtmvzidmrnbcgyonlu.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

async function sweepOnce(): Promise<number> {
  const now = new Date().toISOString();
  logger.info("sweep start", { cutoff: now });

  // Find all PENDING reservations past their TTL
  const { data: expired, error } = await supabase
    .from("reservations")
    .select("id, item_id, quantity, ttl_expires_at")
    .eq("status", "PENDING")
    .lt("ttl_expires_at", now)
    .limit(100);

  if (error) {
    logger.error("sweep query failed", { err: error.message });
    return 0;
  }

  if (!expired || expired.length === 0) {
    logger.info("sweep complete — no expired reservations");
    return 0;
  }

  let expiredCount = 0;
  for (const r of expired as Array<{ id: string; item_id: string; quantity: number }>) {
    // Call rpc_expire_reservation — releases capacity + emits domain event
    const { error: rpcErr } = await supabase.rpc("rpc_expire_reservation", {
      p_reservation_id: r.id,
    });

    if (rpcErr) {
      logger.error("rpc_expire failed, fallback to direct update", { reservation_id: r.id, err: rpcErr.message });
      // Fallback: direct update + manual capacity release
      await supabase
        .from("reservations")
        .update({ status: "EXPIRED", expired_at: now })
        .eq("id", r.id)
        .eq("status", "PENDING");

      // Release reserved capacity
      await supabase.rpc("release_reservation_capacity", { p_reservation_id: r.id }).catch(() => {});
    } else {
      expiredCount++;
    }
  }

  logger.info("sweep complete", { expired: expiredCount, inspected: expired.length });
  return expiredCount;
}

async function main() {
  logger.info("ttl-sweep worker started", { intervalMs: SWEEP_INTERVAL_MS });
  const tick = async () => {
    try { await sweepOnce(); }
    catch (err) { logger.error("sweep failed", { err: String(err) }); }
  };
  await tick();
  setInterval(tick, SWEEP_INTERVAL_MS);
}

main().catch((err) => {
  logger.error("ttl-sweep fatal", { err: String(err) });
  process.exit(1);
});
