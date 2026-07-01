"use client";

/**
 * LodgingCheckoutRedirect — P1-3 bridge component.
 *
 * Receives a fully-loaded Staybnb `ListingWithReservations` (loaded by the
 * server page) plus the raw search params (startDate, endDate, adults…).
 *
 * On mount, it:
 *   1. Builds a lodging CartItem (price = nights * nightPrice, promo-aware).
 *   2. Pushes it into CartContext via addItem().
 *   3. router.replace('/checkout') — hands off to the unified checkout page.
 *
 * The redirect runs exactly once per mount (guarded by `addedRef`).
 */
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart, cartItemId, type CartItem } from "@/lib/cart-context";
import {
  calculateNights,
  getListingPromotion,
  normalizeDate,
} from "@/lib/utils";
import type { ListingWithReservations } from "@/lib/types/listing";

interface Props {
  listing: ListingWithReservations;
  searchParams: Record<string, string | undefined>;
}

export default function LodgingCheckoutRedirect({
  listing,
  searchParams,
}: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const addedRef = useRef(false);

  useEffect(() => {
    if (addedRef.current) return;
    addedRef.current = true;

    const startDateRaw = searchParams.startDate
      ? new Date(searchParams.startDate)
      : new Date();
    const endDateRaw = searchParams.endDate
      ? new Date(searchParams.endDate)
      : new Date(Date.now() + 86_400_000);

    const startDate = normalizeDate(startDateRaw);
    const endDate = normalizeDate(endDateRaw);
    const nights = calculateNights(startDate, endDate);

    const promo = getListingPromotion(listing, nights);
    const discountPercentage = promo?.discountPercentage ?? 0;
    const nightly = listing.nightPrice ?? 0;
    const totalAmount = nightly * nights * (1 - discountPercentage / 100);

    const item: CartItem = {
      id: cartItemId("lodging", String(listing.id), "default"),
      type: "lodging",
      listing_id: String(listing.id),
      vendor_id: String(listing.id),
      name: listing.title,
      image_url: listing.images?.[0] ?? null,
      date: startDate.toISOString().split("T")[0],
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      amount: Math.max(0, totalAmount),
      deposit_amount: 0,
      quantity: nights,
      category: "lodging",
    };
    addItem(item);
    router.replace("/checkout");
  }, [listing, searchParams, addItem, router]);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-6" />
        <h1 className="text-xl font-black text-black tracking-tight">
          Preparing checkout…
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Adding {listing.title} to your cart.
        </p>
      </div>
    </div>
  );
}
