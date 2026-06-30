/**
 * DOM-016 — Report
 *
 * Owner: Moderation Module (Part XXI).
 *
 * User-submitted flag on a Listing, Review, or User for moderation
 * review.
 */

import { z } from "zod";
import type { ReportId } from "../ids";

export const ReportTargetTypeSchema = z.enum([
  "LISTING",
  "REVIEW",
  "USER",
]);
export type ReportTargetType = z.infer<typeof ReportTargetTypeSchema>;

export const ReportStatusSchema = z.enum([
  "OPEN",
  "REVIEWING",
  "RESOLVED",
  "DISMISSED",
]);
export type ReportStatus = z.infer<typeof ReportStatusSchema>;

export const ReportSchema = z
  .object({
    id: z.string(),
    /** The User who submitted the report. */
    reporterId: z.string(),
    targetType: ReportTargetTypeSchema,
    targetId: z.string(),
    reason: z.string().min(1),
    status: ReportStatusSchema,
    moderatorNote: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Report = Omit<z.infer<typeof ReportSchema>, "id"> & {
  id: ReportId;
};

export const Report_META = {
  id: "DOM-016",
  owner: "Moderation Module",
  description:
    "User-submitted flag on a Listing, Review, or User for moderation review.",
  lifecycle: ["OPEN", "REVIEWING", "RESOLVED", "DISMISSED"],
  eventsEmitted: ["report.created", "report.resolved"],
  eventsConsumed: [],
} as const;
