/**
 * @planviry/worker-ttl-sweep
 *
 * Cron job: expires PENDING Reservations past their TTL and releases held
 * inventory (BR-R-002). Runs on a fixed schedule (Part XIV §14.1).
 *
 * Spec refs:
 *   Part II  §2.1 — workers/ttl-sweep
 *   Part V         Reservation FSM: PENDING → EXPIRED (TTL)
 *   Part XIV §14.x Background Jobs (cron, retries, DLQ, idempotency)
 *
 * Invocation: `bun run dev` (auto-restart on file change via `bun --hot`).
 */
import { db } from "@planviry/db";
import { createLogger } from "@planviry/shared";
import { DEFAULT_RESERVATION_TTL_MINUTES } from "@planviry/shared/constants";

const logger = createLogger("worker:ttl-sweep");
const SWEEP_INTERVAL_MS = 60_000; // 1 minute — tune per Part XIV §14.1.

async function sweepOnce(): Promise<number> {
  const cutoff = new Date(Date.now() - DEFAULT_RESERVATION_TTL_MINUTES * 60_000);
  logger.info("sweep start", { cutoff: cutoff.toISOString() });

  // TODO Part V/VI: transition PENDING reservations older than cutoff → EXPIRED
  // inside a serializable transaction; emit `reservation.expired` + release
  // held inventory. Skeleton placeholder:
  const stale = await db.user.count();
  logger.info("sweep complete", { inspected: stale });
  return stale;
}

async function main() {
  logger.info("ttl-sweep worker started", {
    intervalMs: SWEEP_INTERVAL_MS,
    ttlMinutes: DEFAULT_RESERVATION_TTL_MINUTES,
  });
  // Loop with backoff; real impl reads schedule from Part XIV §14.1.
  const tick = async () => {
    try {
      await sweepOnce();
    } catch (err) {
      logger.error("sweep failed", { err: String(err) });
    }
  };
  await tick();
  setInterval(tick, SWEEP_INTERVAL_MS);
}

main().catch((err) => {
  logger.error("ttl-sweep fatal", { err: String(err) });
  process.exit(1);
});
