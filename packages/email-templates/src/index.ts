/**
 * @planviry/email-templates — React Email templates (Resend delivery).
 *
 * Part II   §2.1  — packages/email-templates owns transactional email templates.
 * Part II   §2.2  — may import packages/types + packages/ui.
 * Part XXVI §26.x — Notifications (email channel).
 *
 * Each template is a React Email component exported from this package and
 * rendered to HTML by the notification-send edge function (functions/).
 */

export const EMAIL_TEMPLATE_CATALOG = {
  welcome: "WelcomeEmail",
  bookingConfirmed: "BookingConfirmedEmail",
  bookingCancelled: "BookingCancelledEmail",
  itineraryShared: "ItinerarySharedEmail",
  notificationDigest: "NotificationDigestEmail",
  vendorClaimApproved: "VendorClaimApprovedEmail",
  passwordReset: "PasswordResetEmail",
} as const;

export type EmailTemplateName = keyof typeof EMAIL_TEMPLATE_CATALOG;
