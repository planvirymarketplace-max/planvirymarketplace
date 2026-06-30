/**
 * Cal.com getSlots adaptation — slot generation for availability_blocks.
 * Generates available time slots for a given inventory item + date range.
 * Adapted from Cal.com's buildSlotsWithDateRanges (slots.ts).
 *
 * Spec ref: Part XLII §42.3 — Scheduling / slot generation: Winning Reference: Cal.com (getSlots)
 */

import { supabase } from "@planviry/db";

interface Slot {
  start_time: string;
  end_time: string;
  available: boolean;
}

/**
 * Generate available slots for an inventory item on a given date.
 * Reads availability_blocks for the item, filters out reserved time,
 * and generates slots at the specified interval.
 */
export async function getSlots(
  itemId: string,
  date: Date,
  intervalMinutes: number = 60,
  eventLengthMinutes: number = 60,
): Promise<Slot[]> {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  // Load availability blocks for this item on this date
  const { data: blocks, error } = await supabase
    .from("availability_blocks")
    .select("id, start_time, end_time, total_capacity, reserved_capacity, is_available")
    .eq("item_id", itemId)
    .eq("is_available", true)
    .lte("start_time", dayEnd.toISOString())
    .gte("end_time", dayStart.toISOString())
    .order("start_time", { ascending: true });

  if (error || !blocks || blocks.length === 0) return [];

  // Load existing reservations for this item on this date to exclude booked slots
  const { data: reservations } = await supabase
    .from("reservations")
    .select("starts_at, ends_at")
    .eq("item_id", itemId)
    .in("status", ["PENDING", "CONFIRMED"])
    .gte("starts_at", dayStart.toISOString())
    .lte("ends_at", dayEnd.toISOString());

  const bookedRanges = (reservations ?? []).map((r: { starts_at: string; ends_at: string }) => ({
    start: new Date(r.starts_at),
    end: new Date(r.ends_at),
  }));

  const slots: Slot[] = [];
  const now = new Date();
  const minimumBookingNotice = 30 * 60 * 1000; // 30 min ahead

  for (const block of blocks) {
    const blockStart = new Date(block.start_time);
    const blockEnd = new Date(block.end_time);
    const available = block.total_capacity - block.reserved_capacity;

    if (available <= 0) continue;

    // Generate slots at the specified interval
    // Adapted from Cal.com: start at the top of the hour, step by interval
    let slotStart = new Date(blockStart);
    slotStart.setMinutes(0, 0, 0);

    // If block starts mid-hour, align to next interval
    const startMinute = blockStart.getMinutes();
    if (startMinute > 0) {
      slotStart.setMinutes(Math.ceil(startMinute / intervalMinutes) * intervalMinutes);
    }

    while (slotStart < blockEnd) {
      const slotEnd = new Date(slotStart.getTime() + eventLengthMinutes * 60 * 1000);

      if (slotEnd > blockEnd) break;

      // Skip past slots (minimum booking notice)
      if (slotStart.getTime() < now.getTime() + minimumBookingNotice) {
        slotStart = new Date(slotStart.getTime() + intervalMinutes * 60 * 1000);
        continue;
      }

      // Check if this slot overlaps with any booked reservation
      const isBooked = bookedRanges.some(
        (br) => slotStart < br.end && br.start < slotEnd,
      );

      slots.push({
        start_time: slotStart.toISOString(),
        end_time: slotEnd.toISOString(),
        available: !isBooked && available > 0,
      });

      slotStart = new Date(slotStart.getTime() + intervalMinutes * 60 * 1000);
    }
  }

  return slots;
}

/**
 * Round-robin assignment (Cal.com getLuckyUser pattern).
 * Assigns a slot to the least-loaded vendor staff member.
 */
export async function getLuckyUser(vendorId: string): Promise<string | null> {
  const { data: staff } = await supabase
    .from("vendor_staff")
    .select("user_id")
    .eq("vendor_id", vendorId)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: true });

  if (!staff || staff.length === 0) return null;

  // Count active reservations per staff member, pick the one with fewest
  const counts = await Promise.all(
    staff.map(async (s: { user_id: string }) => {
      const { count } = await supabase
        .from("reservations")
        .select("id", { count: "exact", head: true })
        .eq("vendor_id", vendorId)
        .in("status", ["PENDING", "CONFIRMED"]);
      return { user_id: s.user_id, count: count ?? 0 };
    }),
  );

  counts.sort((a, b) => a.count - b.count);
  return counts[0]?.user_id ?? staff[0]?.user_id ?? null;
}
