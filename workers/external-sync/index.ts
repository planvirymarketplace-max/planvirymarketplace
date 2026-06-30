/**
 * @planviry/worker-external-sync
 *
 * Syncs external provider content (Ticketmaster events, Expedia lodging) into
 * the platform's InventoryItem schema. Critical: content is NORMALIZED into our
 * schema, never rendered as live pass-through (Part I §1.2.1).
 *
 * Spec refs: Part II §2.1; Part I §1.2.1; Part XLII §42.3 (TRANSLATE mode).
 */
import { createLogger } from "@planviry/shared";

const logger = createLogger("worker:external-sync");
const SYNC_INTERVAL_MS = 30 * 60_000; // 30 minutes.

async function syncOnce(): Promise<void> {
  logger.info("external-sync start", { providers: ["ticketmaster", "expedia"] });
  // TODO: fetch from each provider, normalize to InventoryItem shape per
  // category (EVENT_TICKET / LODGING), upsert via @planviry/db. Emit
  // inventory.published events for newly-synced items.
  logger.info("external-sync complete");
}

async function main() {
  logger.info("external-sync worker started", { intervalMs: SYNC_INTERVAL_MS });
  const tick = async () => {
    try { await syncOnce(); }
    catch (err) { logger.error("sync failed", { err: String(err) }); }
  };
  await tick();
  setInterval(tick, SYNC_INTERVAL_MS);
}

main().catch((err) => {
  logger.error("external-sync fatal", { err: String(err) });
  process.exit(1);
});
