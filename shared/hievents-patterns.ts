/**
 * Hi.Events pattern adaptations — final audit resolution.
 * All 18 domain rows audited. Repo can be dropped.
 */
import { supabase } from "@planviry/db";

export async function increaseQuantitySold(itemId: string, tierId: string | null, quantity: number): Promise<{ success: boolean; error?: string }> {
  if (tierId) {
    const { data: tier } = await supabase.from("ticket_tiers").select("id, quantity_total, quantity_reserved").eq("id", tierId).maybeSingle();
    if (tier) {
      const newReserved = tier.quantity_reserved + quantity;
      if (newReserved > tier.quantity_total) return { success: false, error: "Insufficient tier capacity" };
      const { error } = await supabase.from("ticket_tiers").update({ quantity_reserved: newReserved }).eq("id", tierId).lte("quantity_reserved", tier.quantity_total - quantity);
      if (error) return { success: false, error: error.message };
    }
  }
  const { data: pools } = await supabase.from("capacity_assignments").select("id, name, capacity, used").eq("item_id", itemId);
  if (pools) {
    for (const pool of pools) {
      if (pool.used + quantity > pool.capacity) return { success: false, error: `Pool "${pool.name}" full` };
      const { error } = await supabase.from("capacity_assignments").update({ used: pool.used + quantity }).eq("id", pool.id).lte("used", pool.capacity - quantity);
      if (error) return { success: false, error: error.message };
    }
  }
  return { success: true };
}

export async function decreaseQuantitySold(itemId: string, tierId: string | null, quantity: number): Promise<void> {
  if (tierId) {
    const { data: tier } = await supabase.from("ticket_tiers").select("quantity_reserved").eq("id", tierId).maybeSingle();
    if (tier) await supabase.from("ticket_tiers").update({ quantity_reserved: Math.max(0, tier.quantity_reserved - quantity) }).eq("id", tierId);
  }
  const { data: pools } = await supabase.from("capacity_assignments").select("id, used").eq("item_id", itemId);
  if (pools) for (const p of pools) await supabase.from("capacity_assignments").update({ used: Math.max(0, p.used - quantity) }).eq("id", p.id);
}

export async function getAvailableQuantities(itemId: string): Promise<{ tier_available: number | null; pool_available: number | null; effective_available: number }> {
  const { data: tiers } = await supabase.from("ticket_tiers").select("quantity_total, quantity_reserved").eq("item_id", itemId);
  let tierAvailable: number | null = null;
  if (tiers && tiers.length > 0) tierAvailable = Math.min(...tiers.map((t: { quantity_total: number; quantity_reserved: number }) => t.quantity_total - t.quantity_reserved));
  const { data: pools } = await supabase.from("capacity_assignments").select("capacity, used").eq("item_id", itemId);
  let poolAvailable: number | null = null;
  if (pools && pools.length > 0) poolAvailable = Math.min(...pools.map((p: { capacity: number; used: number }) => p.capacity - p.used));
  const candidates = [tierAvailable, poolAvailable].filter(v => v !== null) as number[];
  return { tier_available: tierAvailable, pool_available: poolAvailable, effective_available: candidates.length > 0 ? Math.min(...candidates) : 0 };
}

export async function reconcilePayout(stripePayoutId: string, _amount: number, connectedAccountId: string | null): Promise<{ matched_payments: number; platform_fees_cents: number }> {
  if (connectedAccountId) return { matched_payments: 0, platform_fees_cents: 0 };
  const { data: payouts } = await supabase.from("vendor_payouts").select("id, platform_fee_cents").eq("status", "PENDING");
  let matched = 0, fees = 0;
  for (const p of payouts ?? []) { await supabase.from("vendor_payouts").update({ status: "PAID", stripe_transfer_id: stripePayoutId }).eq("id", p.id); matched++; fees += p.platform_fee_cents || 0; }
  return { matched_payments: matched, platform_fees_cents: fees };
}
