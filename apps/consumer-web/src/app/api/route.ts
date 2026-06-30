/**
 * API root — health check + endpoint directory.
 * Part XI §11.3 — lists all implemented v1 endpoints.
 */
import { ok } from "@/lib/api/envelope";

const ENDPOINTS = [
  // 11.3.1 Auth
  "POST   /api/v1/auth/register",
  "GET    /api/v1/auth/me",
  "PATCH  /api/v1/auth/me",
  // 11.3.2 Inventory
  "GET    /api/v1/inventory",
  "POST   /api/v1/inventory",
  "GET    /api/v1/inventory/:id",
  "PATCH  /api/v1/inventory/:id",
  "DELETE /api/v1/inventory/:id",
  "POST   /api/v1/inventory/:id/publish",
  "POST   /api/v1/inventory/:id/pause",
  // 11.3.3 Reservations
  "GET    /api/v1/reservations",
  "GET    /api/v1/reservations/:id",
  "POST   /api/v1/reservations/:id/cancel",
  // 11.3.4 Cart & Checkout
  "GET    /api/v1/cart",
  "POST   /api/v1/cart/items",
  "DELETE /api/v1/cart/items/:cart_line_id",
  "POST   /api/v1/cart/checkout",
  // 11.3.5 Itineraries
  "POST   /api/v1/itineraries",
  "GET    /api/v1/itineraries/:id",
  "POST   /api/v1/itineraries/:id/share",
  // 11.3.6 Search
  "GET    /api/v1/search",
  "GET    /api/v1/search/autocomplete",
  // 11.3.7 Vendor
  "POST   /api/v1/vendors/claim",
  "POST   /api/v1/vendors/claim/verify",
  "POST   /api/v1/vendors/:vendor_id/staff",
  // 11.3.8 Events
  "POST   /api/v1/events/:event_id/ticket-tiers",
  "POST   /api/v1/events/:event_id/checkin",
] as const;

export async function GET() {
  return ok({
    service: "planviry-api",
    version: "v1",
    status: "operational",
    spec: "Part XI §11.3 — 27 endpoints across 9 domain groups",
    endpoints: ENDPOINTS,
    docs: "/docs/11-apis.md",
  });
}
