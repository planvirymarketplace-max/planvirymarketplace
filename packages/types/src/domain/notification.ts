/**
 * DOM-014 — Notification
 *
 * Owner: Notification Service (Part X).
 *
 * Queued message to be delivered via in-app, email, or push; tracks
 * delivery status.
 */

import { z } from "zod";
import type { NotificationId } from "../ids";

export const NotificationChannelSchema = z.enum([
  "IN_APP",
  "EMAIL",
  "PUSH",
]);
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

export const NotificationStatusSchema = z.enum([
  "QUEUED",
  "SENT",
  "FAILED",
]);
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;

export const NotificationSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    channel: NotificationChannelSchema,
    subject: z.string().min(1),
    body: z.string(),
    status: NotificationStatusSchema,
    sentAt: z.string().datetime().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Notification = Omit<z.infer<typeof NotificationSchema>, "id"> & {
  id: NotificationId;
};

export const Notification_META = {
  id: "DOM-014",
  owner: "Notification Service",
  description:
    "Queued message to be delivered via in-app, email, or push; tracks delivery status.",
  lifecycle: ["QUEUED", "SENT", "FAILED"],
  eventsEmitted: ["notification.sent", "notification.failed"],
  eventsConsumed: [],
} as const;
