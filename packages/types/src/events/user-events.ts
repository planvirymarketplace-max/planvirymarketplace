/**
 * User-domain event payloads (DOM-001).
 *
 * Emitted by the Auth Module. Each event is a discriminated-union
 * member keyed by `type`. Producers + consumers are documented in
 * docs/03-domain.md.
 */

import { z } from "zod";

const base = z.object({
  timestamp: z.string().datetime(),
});

export const UserRegisteredEventSchema = base
  .extend({
    type: z.literal("user.registered"),
    userId: z.string(),
    email: z.string().email(),
  })
  .strict();
export type UserRegisteredEvent = z.infer<typeof UserRegisteredEventSchema>;

export const UserOnboardedEventSchema = base
  .extend({
    type: z.literal("user.onboarded"),
    userId: z.string(),
  })
  .strict();
export type UserOnboardedEvent = z.infer<typeof UserOnboardedEventSchema>;

export const UserSuspendedEventSchema = base
  .extend({
    type: z.literal("user.suspended"),
    userId: z.string(),
    reason: z.string().optional(),
  })
  .strict();
export type UserSuspendedEvent = z.infer<typeof UserSuspendedEventSchema>;

export const UserDeletedEventSchema = base
  .extend({
    type: z.literal("user.deleted"),
    userId: z.string(),
    anonymized: z.boolean(),
  })
  .strict();
export type UserDeletedEvent = z.infer<typeof UserDeletedEventSchema>;

export const UserEventSchema = z.discriminatedUnion("type", [
  UserRegisteredEventSchema,
  UserOnboardedEventSchema,
  UserSuspendedEventSchema,
  UserDeletedEventSchema,
]);

export type UserEvent = z.infer<typeof UserEventSchema>;
