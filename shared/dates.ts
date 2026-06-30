/**
 * Date helpers — shared across apps/workers/functions.
 * Centralised so reservation/window logic is identical everywhere.
 */

export function toIsoDate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function toIsoDateTime(d: Date = new Date()): string {
  return d.toISOString();
}

/** TTL expiry for a PENDING reservation (BR-R-002). */
export function reservationTtlExpiry(createdAt: Date, ttlMinutes = 15): Date {
  return new Date(createdAt.getTime() + ttlMinutes * 60_000);
}

/** True if [start, end) overlaps [otherStart, otherEnd). Used by BR-R-005. */
export function rangesOverlap(
  start: Date,
  end: Date,
  otherStart: Date,
  otherEnd: Date,
): boolean {
  return start < otherEnd && otherStart < end;
}
