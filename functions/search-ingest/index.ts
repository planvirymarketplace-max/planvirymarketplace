/**
 * @planviry/fn-search-ingest — Supabase Edge Function (Deno).
 *
 * Triggered on InventoryItem insert/update (Supabase DB webhooks). Transforms
 * the row to an Algolia document and pushes to the appropriate index.
 *
 * Spec refs: Part II §2.1; Part XVII §17.4 (Ingestion Pipeline), §17.19
 * (Reindexing). Federated ranking: Part XLII Conflict #7 (OPEN).
 */
// @ts-expect-error — Deno global.
declare const Deno: any;
// @ts-expect-error — algoliasearch via esm.sh in Deno.
import { algoliasearch } from "https://esm.sh/algoliasearch@5.20.0";

const ALGOLIA_APP_ID = Deno.env.get("ALGOLIA_APP_ID") ?? "";
const ALGOLIA_ADMIN_KEY = Deno.env.get("ALGOLIA_ADMIN_KEY") ?? "";
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const payload = await req.json();
  // TODO Part XVII: map payload.record (InventoryItem) → Algolia document,
  // route to index by category, respect Conflict #7 decision.
  const index = client.initIndex("planviry_inventory");
  await index.saveObject({ objectID: payload.record?.id, ...payload.record }).wait();

  return new Response(JSON.stringify({ ingested: true }), {
    headers: { "content-type": "application/json" },
  });
});
