/**
 * /lodging/checkout/[listingId]
 *
 * UNIFIED CHECKOUT — P1-3
 *
 * The Staybnb-era single-item checkout flow that used to live here has been
 * retired. This route now exists only to bridge the legacy "Reserve Now"
 * button (which still posts to `/lodging/checkout/<id>?startDate=…`) into
 * the unified Planviry cart checkout at `/checkout`.
 *
 * The page is a server component that:
 *   1. Gates on auth (redirects to /login if not signed in).
 *   2. Loads the listing (via the prisma shim → inventory_items).
 *   3. Validates the startDate / endDate / adults search params.
 *   4. Renders a small client component (<LodgingCheckoutRedirect />) that
 *      builds a lodging CartItem, pushes it into CartContext, and
 *      router.replace('/checkout').
 *
 * The unified `/api/checkout` route handles the actual payment + reservation
 * creation from there.
 */
import { getListingWithReservations } from "@/lib/api/server/endpoints/listings";
import { generateSEOMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LodgingCheckoutRedirect from "./components/LodgingCheckoutRedirect";

export const metadata = generateSEOMetadata({
  title: "Checkout",
  description: "Complete your reservation and secure your vacation rental.",
  noIndex: true,
});

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const listingId = resolvedParams.listingId;

  // ─── Auth gate ──────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(resolvedSearchParams).filter(
          ([, v]) => v !== undefined,
        ) as [string, string][],
      ),
    ).toString();
    const returnTo = qs
      ? `/lodging/checkout/${listingId}?${qs}`
      : `/lodging/checkout/${listingId}`;
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const parsedListingId = parseInt(listingId ?? "");
  const { startDate, endDate, adults } = resolvedSearchParams;

  let listing;
  try {
    listing = await getListingWithReservations(parsedListingId);
  } catch {
    redirect("/");
  }

  const isInvalid =
    !parsedListingId || !startDate || !endDate || !adults || !listing;

  if (isInvalid) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-black text-black tracking-tight">
            Invalid booking details
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Please check the dates, guests, and listing, then try again.
          </p>
          <a
            href="/"
            className="inline-block mt-6 text-sm font-bold text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors uppercase tracking-wider"
          >
            Go back home
          </a>
        </div>
      </div>
    );
  }

  // ─── Bridge to the unified checkout ──────────────────────────────────────
  // The client component builds a lodging CartItem from the listing +
  // searchParams, pushes it into CartContext, then router.replace('/checkout').
  return (
    <LodgingCheckoutRedirect
      listing={listing}
      searchParams={resolvedSearchParams}
    />
  );
}
