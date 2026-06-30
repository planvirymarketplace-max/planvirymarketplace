/**
 * DOM-001 — User
 *
 * Owner: Auth Module (Part VII).
 *
 * Any human with a platform account — guest consumer, vendor operator,
 * vendor staff member, admin, or moderator. Identity source: Supabase
 * `auth.users` (canonical); the `profiles` table extends with
 * platform-specific fields (DOM-009).
 *
 * Lifecycle: Anonymous → Registered → Onboarded → [Active | Suspended | Deleted].
 *
 * Events emitted:  user.registered, user.onboarded, user.suspended, user.deleted.
 * Events consumed: booking.confirmed (first-booking welcome), vendor.claimed (role update).
 *
 * Business rules:
 *  - BR-U-001: Email must be unique across all User records.
 *  - BR-U-002: A User may hold at most one role per VendorAccount.
 *  - BR-U-003: A deleted User's bookings are anonymized, not cascade-deleted.
 *  - BR-U-004: A suspended User may not create new Reservations.
 *  - BR-U-005: Email verification required before first Reservation.
 */

import { z } from "zod";
import type { UserId } from "../ids";

/**
 * ID-typing convention (applies to every entity file in this package):
 *
 * Zod schemas validate every ID field as a plain `z.string()` for runtime
 * simplicity (no custom brand check is performed at parse time). The
 * exported TypeScript type overrides the entity's *own* primary-key field
 * with its branded type from `../ids` (e.g. `{ id: UserId }`), so the
 * compiler still rejects accidental cross-entity ID swaps at call sites.
 * Foreign-key ID fields remain plain `string` to avoid a combinatorial
 * explosion of `Omit &` overrides; consumers can cast to a branded alias
 * (e.g. `vendorAccountId as VendorAccountId`) when needed.
 */
export const UserSchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().nullable().optional(),
    /** Platform-level role. Vendor-scoped roles live on DOM-020 VendorStaff. */
    role: z.enum(["CONSUMER", "ADMIN", "MODERATOR"]),
    status: z.enum([
      "ANONYMOUS",
      "REGISTERED",
      "ONBOARDED",
      "ACTIVE",
      "SUSPENDED",
      "DELETED",
    ]),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type User = Omit<z.infer<typeof UserSchema>, "id"> & { id: UserId };

export const User_META = {
  id: "DOM-001",
  owner: "Auth Module",
  description:
    "Any human with a platform account — guest consumer, vendor operator, vendor staff member, admin, or moderator.",
  lifecycle: [
    "Anonymous",
    "Registered",
    "Onboarded",
    "Active",
    "Suspended",
    "Deleted",
  ],
  eventsEmitted: [
    "user.registered",
    "user.onboarded",
    "user.suspended",
    "user.deleted",
  ],
  eventsConsumed: ["booking.confirmed", "vendor.claimed"],
} as const;
