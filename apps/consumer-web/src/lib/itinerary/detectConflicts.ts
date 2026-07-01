/**
 * Conflict detector — adapted from obsidian-itinerary's conflict detection.
 * Finds overlapping events in the itinerary.
 *
 * Spec ref: Part XLIV §44.8 — "conflict/warning surfacing"
 */

import type { ItineraryEvent } from './extractEvents'

export interface ItineraryConflict {
  type: 'TIME_OVERLAP'
  event_ids: string[]
  event_titles: string[]
  message: string
}

export function detectConflicts(events: ItineraryEvent[]): ItineraryConflict[] {
  const conflicts: ItineraryConflict[] = []
  const sorted = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const a = sorted[i]
      const b = sorted[j]
      const aStart = new Date(a.start).getTime()
      const aEnd = new Date(a.end || a.start).getTime()
      const bStart = new Date(b.start).getTime()
      const bEnd = new Date(b.end || b.start).getTime()

      // Half-open interval overlap: aStart < bEnd && bStart < aEnd
      if (aStart < bEnd && bStart < aEnd) {
        conflicts.push({
          type: 'TIME_OVERLAP',
          event_ids: [a.id, b.id],
          event_titles: [a.title, b.title],
          message: `"${a.title}" and "${b.title}" overlap in time`,
        })
      }
    }
  }

  return conflicts
}
