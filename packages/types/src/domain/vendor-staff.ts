/**
 * DOM-020 — VendorStaff
 *
 * Owner: Vendor Listing Management Module.
 *
 * Join record: User × VendorAccount with a role (OWNER, MANAGER,
 * STAFF) and permissions matrix.
 *
 * Business rules:
 *  - BR-U-002 (enforced here): A User may hold at most one role per VendorAccount.
 *  - BR-V-001 (enforced here): A VendorAccount must have exactly one OWNER-role User.
 */

import { z } from "zod";
import type { VendorStaffId } from "../ids";

export const VendorStaffRoleSchema = z.enum(["OWNER", "MANAGER", "STAFF"]);
export type VendorStaffRole = z.infer<typeof VendorStaffRoleSchema>;

export const VendorStaffSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    vendorAccountId: z.string(),
    role: VendorStaffRoleSchema,
    /** Permission strings (e.g. "inventory.write", "reports.read"). */
    permissions: z.array(z.string()),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type VendorStaff = Omit<z.infer<typeof VendorStaffSchema>, "id"> & {
  id: VendorStaffId;
};

export const VendorStaff_META = {
  id: "DOM-020",
  owner: "Vendor Listing Management",
  description:
    "Join record: User × VendorAccount with a role (OWNER, MANAGER, STAFF) and permissions matrix.",
  lifecycle: [],
  eventsEmitted: ["vendor.staff_added", "vendor.staff_removed"],
  eventsConsumed: [],
} as const;
