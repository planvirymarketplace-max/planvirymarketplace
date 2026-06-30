/**
 * @planviry/fn-booking-ttl — Supabase Edge Function (Deno).
 *
 * TTL enforcement for PENDING reservations past their TTL window. Triggered by
 * pg_cron / Supabase scheduled functions (Part XIV §14.1).
 *
 * Spec refs: Part II §2.1; Part V (PENDING → EXPIRED); Part XIV §14.x.
 *
 * IMPORTANT: This is the DB-side counterpart to workers/ttl-sweep. In
 * production, ONE of them runs (preference: pg_cron → this function), the
 * other is a fallback. The split is recorded as an ADR in Part XIV.
 */
// @ts-expect-error — Deno global.
declare const Deno: any;

Deno.serve(async (_req: Request) => {
  // TODO Part V/VI: invoke a Supabase RPC `expire_pending_reservations(cutoff)`
  // that transitions PENDING → EXPIRED in a single transaction, emits
  // `reservation.expired`, and releases held inventory. Skeleton placeholder.
  const result = { expired: 0, cutoff: new Date().toISOString() };
  return new Response(JSON.stringify(result), {
    headers: { "content-type": "application/json" },
  });
});
