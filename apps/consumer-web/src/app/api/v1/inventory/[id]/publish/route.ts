/**
 * Part XI §11.3.2 — POST /api/v1/inventory/:id/publish
 *
 * Transitions InventoryItem DRAFT → PUBLISHED. Runs full metadata validation.
 * Auth: VENDOR_OWNER. Side effects: FSM RPC, Algolia push, inventory.published event.
 */

import type { NextRequest } from "next/server";
import { ok } from "@/lib/api/envelope";
import {
  RATE_LIMITED, INTERNAL_ERROR, 
  METADATA_INCOMPLETE, INVALID_STATE_TRANSITION, NOT_VENDOR_OWNER, UNAUTHORIZED, error
} from "@/lib/api/errors";
import { getAuthContext } from "@/lib/api/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthContext(req);
  if (!auth.isAuthenticated) return UNAUTHORIZED();
  if (auth.vendorRole !== "VENDOR_OWNER") return NOT_VENDOR_OWNER();

  const { id } = await params;

  const rateLimited = checkRateLimit(req, RATE_LIMITS.inventoryWrite, auth);
  if (rateLimited) return rateLimited;

  try {
    // Part VI: Call RPC rpc_publish_inventory_item(id, vendor_id) which:
    //   1. Validates item is in DRAFT or PAUSED state (else 409 INVALID_STATE_TRANSITION)
    //   2. Runs BR-I-002 metadata validation per category (else 400 METADATA_INCOMPLETE)
    //   3. For EVENT_TICKET: validates BR-EV-001 (≥1 TicketTier) and BR-EV-006 (future date)
    //   4. Transitions status → PUBLISHED, sets published_at = NOW()
    //   5. Queues Algolia document push (search-ingest Edge Function)
    //   6. Emits inventory.published event
    return error(501, "SCHEMA_PENDING", "InventoryItem publish FSM pending Part V/VI.", null);
  } catch (err) {
    console.error("[inventory/:id/publish] error:", err);
    return INTERNAL_ERROR();
  }
}
