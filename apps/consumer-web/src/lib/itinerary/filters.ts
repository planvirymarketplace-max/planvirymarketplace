/**
 * Filter expressions — adapted from obsidian-itinerary's filter system.
 * Allows filtering itinerary events by category, date range, status.
 *
 * Spec ref: Part XLIV §44.8
 */

import type { ItineraryEvent } from './extractEvents'

export interface ItineraryFilter {
  categories?: string[]
  dateFrom?: string
  dateTo?: string
  statuses?: string[]
}

export function filterEvents(events: ItineraryEvent[], filter: ItineraryFilter): ItineraryEvent[] {
  return events.filter(e => {
    if (filter.categories && filter.categories.length > 0) {
      if (!filter.categories.includes(e.extendedProps.category)) return false
    }
    if (filter.dateFrom && new Date(e.start) < new Date(filter.dateFrom)) return false
    if (filter.dateTo && new Date(e.end || e.start) > new Date(filter.dateTo)) return false
    if (filter.statuses && filter.statuses.length > 0) {
      if (!filter.statuses.includes(e.extendedProps.status)) return false
    }
    return true
  })
}

export function groupByDay(events: ItineraryEvent[]): Map<string, ItineraryEvent[]> {
  const grouped = new Map<string, ItineraryEvent[]>()
  for (const e of events) {
    const day = e.start.slice(0, 10)
    if (!grouped.has(day)) grouped.set(day, [])
    grouped.get(day)!.push(e)
  }
  // Sort events within each day by start time
  for (const [, dayEvents] of grouped) {
    dayEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  }
  return grouped
}
