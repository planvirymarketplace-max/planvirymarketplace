/**
 * DOM-009 — Profile
 *
 * Owner: Auth Module.
 *
 * User-facing profile: display name, avatar, preferences, notification
 * settings. Extends Supabase `auth.users` (DOM-001 User identity source).
 */

import { z } from "zod";
import type { ProfileId } from "../ids";

export const ProfileSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    displayName: z.string().min(1),
    avatarUrl: z.string().url().nullable().optional(),
    /** Free-form user preferences (UI state, locale, theme, etc.). */
    preferences: z.record(z.string(), z.unknown()).default({}),
    /** Per-channel notification opt-ins / digests. */
    notificationSettings: z.record(z.string(), z.unknown()).default({}),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Profile = Omit<z.infer<typeof ProfileSchema>, "id"> & {
  id: ProfileId;
};

export const Profile_META = {
  id: "DOM-009",
  owner: "Auth Module",
  description:
    "User-facing profile: display name, avatar, preferences, notification settings.",
  lifecycle: [],
  eventsEmitted: [],
  eventsConsumed: [],
} as const;
