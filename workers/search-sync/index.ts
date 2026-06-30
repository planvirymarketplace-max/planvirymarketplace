/**
 * @planviry/worker-search-sync
 *
 * Cron job: re-indexes changed InventoryItems into Algolia.
 * Spec refs: Part II §2.1; Part XVII §17.4 (Search Ingestion Pipeline),
 * §17.19 (Reindexing), §17.5 (Search Synchronization).
 */
import { createLogger } from "@planviry/shared";
import { SEARCH_INDEX_NAMES } from "@planviry/search";

const logger = createLogger("worker:search-sync");
const SYNC_INTERVAL_MS = 5 * 60_000; // 5 minutes — Part XIV §14.1.

async function syncOnce(): Promise<void> {
  logger.info("sync start", { indices: SEARCH_INDEX_NAMES });
  // TODO Part XVII: read dirty inventory rows since last cursor, transform to
  // Algolia documents, push to indices. Honor Conflict #7 (federated ranking).
  logger.info("sync complete");
}

async function main() {
  logger.info("search-sync worker started", { intervalMs: SYNC_INTERVAL_MS });
  const tick = async () => {
    try { await syncOnce(); }
    catch (err) { logger.error("sync failed", { err: String(err) }); }
  };
  await tick();
  setInterval(tick, SYNC_INTERVAL_MS);
}

main().catch((err) => {
  logger.error("search-sync fatal", { err: String(err) });
  process.exit(1);
});
