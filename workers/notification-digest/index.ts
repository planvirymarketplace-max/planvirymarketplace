/**
 * @planviry/worker-notification-digest
 *
 * Cron job: batches queued notifications per user preference and sends digest
 * emails via Resend. Spec refs: Part II §2.1; Part XXVI §26.5 (Digest),
 * §26.6 (Preference Rules), §26.7 (Scheduling).
 *
 * Pattern source: Peppermint fan-out (PATTERN — Part XLII §42.3).
 */
import { createLogger } from "@planviry/shared";

const logger = createLogger("worker:notification-digest");
const DIGEST_INTERVAL_MS = 15 * 60_000; // 15 minutes.

async function digestOnce(): Promise<void> {
  logger.info("digest start");
  // TODO Part XXVI: group notifications by user + digest cadence, render
  // NotificationDigestEmail from @planviry/email-templates, send via Resend.
  logger.info("digest complete");
}

async function main() {
  logger.info("notification-digest worker started", { intervalMs: DIGEST_INTERVAL_MS });
  const tick = async () => {
    try { await digestOnce(); }
    catch (err) { logger.error("digest failed", { err: String(err) }); }
  };
  await tick();
  setInterval(tick, DIGEST_INTERVAL_MS);
}

main().catch((err) => {
  logger.error("notification-digest fatal", { err: String(err) });
  process.exit(1);
});
