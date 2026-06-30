/**
 * DOM-002 — VendorAccount
 *
 * Owner: Vendor Listing Management Module.
 *
 * A multi-tenant account representing a vendor business on the platform.
 * May own multiple InventoryItems (listings). Distinct from User — a
 * VendorAccount can have multiple staff Users (DOM-020 VendorStaff).
 *
 * Lifecycle: Seeded (no account) → Claimed → Onboarded → [Active | Suspended | Terminated].
 *
 * Events emitted:  vendor.claimed, vendor.onboarded, vendor.suspended.
 * Events consumed: booking.confirmed (vendor notification), review.posted (vendor notification).
 *
 * Business rules:
 *  - BR-V-001: A VendorAccount must have exactly one OWNER-role User.
 *  - BR-V-002: A seeded (Overture) vendor listing has no VendorAccount until claimed.
 *  - BR-V-003: Claiming a listing requires verifying business identity (email domain or phone).
 */

import { z } from "zod";
import type { VendorAccountId } from "../ids";

export const VendorAccountSchema = z
  .object({
    id: z.string(),
    businessName: z.string().min(1),
    status: z.enum([
      "SEEDED",
      "CLAIMED",
      "ONBOARDED",
      "ACTIVE",
      "SUSPENDED",
      "TERMINATED",
    ]),
    /** Set once the vendor completes Stripe Connect onboarding (DOM-019). */
    stripeConnectAccountId: z.string().nullable().optional(),
    /**
     * True when this VendorAccount was created from an Overture seed
     * (BR-V-002: seeded listings have no live account until claimed).
     */
    isSeeded: z.boolean().default(false),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type VendorAccount = Omit<z.infer<typeof VendorAccountSchema>, "id"> & {
  id: VendorAccountId;
};

export const VendorAccount_META = {
  id: "DOM-002",
  owner: "Vendor Listing Management Module",
  description:
    "A multi-tenant account representing a vendor business on the platform. May own multiple InventoryItems (listings). Distinct from User — a VendorAccount can have multiple staff Users.",
  lifecycle: [
    "Seeded",
    "Claimed",
    "Onboarded",
    "Active",
    "Suspended",
    "Terminated",
  ],
  eventsEmitted: [
    "vendor.claimed",
    "vendor.onboarded",
    "vendor.suspended",
  ],
  eventsConsumed: ["booking.confirmed", "review.posted"],
} as const;
