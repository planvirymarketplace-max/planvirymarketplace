/**
 * hotel-back-office adaptation — derived runtime status computation.
 * Computes a reservation's display status from sub-entity states.
 * Adapted from hotel-back-office Domain/Aggregates/Booking/Booking.cs.
 *
 * Spec ref: Part XLII §42.3 — Derived runtime status computation: Winning Reference: hotel-back-office
 * ADR-002: store canonical_status column AND compute display_status via this function.
 */

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED' | 'NO_SHOW'

interface ReservationForStatus {
  status: ReservationStatus
  confirmed_at: string | null
  cancelled_at: string | null
  completed_at: string | null
  expired_at: string | null
  ttl_expires_at: string | null
  starts_at: string | null
  ends_at: string | null
  stripe_payment_intent_id: string | null
  stripe_refund_id: string | null
  refund_amount_cents: number
}

/**
 * Compute the derived display status of a reservation.
 * The canonical status column is for indexing/filtering;
 * this function is the source of truth for what to DISPLAY.
 *
 * Rules (adapted from hotel-back-office Booking aggregate):
 * - If cancelled_at is set → CANCELLED (regardless of canonical)
 * - If expired_at is set → EXPIRED
 * - If completed_at is set → COMPLETED
 * - If confirmed_at is set AND ends_at is in the past → COMPLETED (auto-complete)
 * - If confirmed_at is set AND starts_at is in the past → ONGOING (display only)
 * - If confirmed_at is set → CONFIRMED
 * - If ttl_expires_at is in the past AND status is PENDING → EXPIRED
 * - If stripe_refund_id is set → REFUNDED (display variant of CANCELLED)
 * - Otherwise → PENDING
 */
export function computeDisplayStatus(r: ReservationForStatus): string {
  const now = new Date()

  if (r.cancelled_at) {
    return r.stripe_refund_id ? 'REFUNDED' : 'CANCELLED'
  }

  if (r.expired_at) return 'EXPIRED'

  if (r.completed_at) return 'COMPLETED'

  if (r.confirmed_at) {
    if (r.ends_at && new Date(r.ends_at) < now) return 'COMPLETED'
    if (r.starts_at && new Date(r.starts_at) < now) return 'ONGOING'
    return 'CONFIRMED'
  }

  if (r.ttl_expires_at && new Date(r.ttl_expires_at) < now) return 'EXPIRED'

  return 'PENDING'
}

/**
 * Soft delete strategy (hotel-back-office pattern).
 * Instead of hard-deleting, set a deleted_at timestamp and anonymize PII.
 * BR-U-003: A deleted user's bookings must be anonymized, not cascade-deleted.
 */
export function softDeleteFields(userId?: string): Record<string, unknown> {
  return {
    deleted_at: new Date().toISOString(),
    display_name: 'Deleted User',
    email: `deleted-${userId ?? 'unknown'}@planviry.local`,
    phone: null,
    avatar_url: null,
  }
}

/**
 * Calculate total price (movinin calculateTotalPrice pattern).
 * Supports daily, weekly, monthly, yearly rental terms.
 */
export function calculateTotalPrice(
  basePriceCents: number,
  rentalTerm: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
  startDate: Date,
  endDate: Date,
  cancellationFeeCents: number = 0,
  includeCancellation: boolean = false,
): number {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  if (days <= 0) return basePriceCents

  let price = 0

  switch (rentalTerm) {
    case 'DAILY':
      price = basePriceCents * days
      break
    case 'WEEKLY':
      price = (basePriceCents * days) / 7
      break
    case 'MONTHLY': {
      const now = new Date()
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      price = (basePriceCents * days) / daysInMonth
      break
    }
    case 'YEARLY': {
      const year = new Date().getFullYear()
      const daysInYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365
      price = (basePriceCents * days) / daysInYear
      break
    }
  }

  if (includeCancellation && cancellationFeeCents > 0) {
    price += cancellationFeeCents
  }

  return Math.round(price)
}

/**
 * Date-range overlap check (movinin pattern).
 * Returns true if [startA, endA) overlaps [startB, endB).
 * Used by BR-R-005 (no overlapping confirmed reservations for date-ranged categories).
 */
export function rangesOverlap(
  startA: Date, endA: Date,
  startB: Date, endB: Date,
): boolean {
  return startA < endB && startB < endA
}

// ─── movinin extension: cancellation fee + 3-channel notification dispatch ─

/**
 * Calculate cancellation fee (movinin pattern).
 * Based on rental term + days until start.
 */
export function calculateCancellationFee(
  totalPriceCents: number,
  startDate: Date,
  cancellationPolicy: string | null,
  now: Date = new Date(),
): { fee_cents: number; refund_cents: number; policy_applied: string } {
  const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  // No fee if cancelling well in advance
  if (daysUntilStart > 7) {
    return { fee_cents: 0, refund_cents: totalPriceCents, policy_applied: 'full_refund' }
  }

  // 50% refund if 3-7 days before
  if (daysUntilStart > 2) {
    const refund = Math.round(totalPriceCents * 0.5)
    return { fee_cents: totalPriceCents - refund, refund_cents: refund, policy_applied: '50_percent_refund' }
  }

  // No refund if less than 2 days (unless policy says otherwise)
  if (cancellationPolicy && cancellationPolicy.toLowerCase().includes('flexible')) {
    const refund = Math.round(totalPriceCents * 0.25)
    return { fee_cents: totalPriceCents - refund, refund_cents: refund, policy_applied: 'flexible_25_percent' }
  }

  return { fee_cents: totalPriceCents, refund_cents: 0, policy_applied: 'no_refund_within_48h' }
}

/**
 * 3-channel notification dispatch (movinin pattern).
 * Creates notification rows for ALL 3 channels: IN_APP, EMAIL, PUSH.
 * The /api/notifications/process worker picks these up and delivers them.
 */
export async function dispatch3ChannelNotification(
  userId: string,
  notificationType: string,
  subject: string,
  body: string,
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM',
): Promise<{ in_app: boolean; email: boolean; push: boolean }> {
  const { supabase } = await import("@planviry/db")

  const channels = [
    { channel: 'IN_APP' as const },
    { channel: 'EMAIL' as const },
    { channel: 'PUSH' as const },
  ]

  const rows = channels.map(c => ({
    user_id: userId,
    notification_type: notificationType,
    channel: c.channel,
    priority,
    subject,
    body,
    data_payload: {},
    status: 'QUEUED',
    rate_limit_category: priority === 'CRITICAL' ? 'CRITICAL' : 'NON_CRITICAL',
  }))

  const { error } = await supabase.from('notifications').insert(rows)

  return {
    in_app: !error,
    email: !error,
    push: !error,
  }
}
