import algoliasearch, { type SearchClient, type SearchIndex } from "algoliasearch";
import { getSubcategoriesForJourney } from "@/data/overture-taxonomy";

// ---------------------------------------------------------------------------
// Environment variables
// ---------------------------------------------------------------------------
const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY ?? "";
const SEARCH_ONLY_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? "";
const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME ?? "listings";

// ---------------------------------------------------------------------------
// Types - Listings (current)
// ---------------------------------------------------------------------------

export interface AlgoliaListingHit {
  objectID: string;             // Overture GERS ID
  name: string;                 // Business name
  slug: string;                 // URL-safe slug
  category_primary: string;     // Overture categories.primary string
  Planviry_vertical: string;    // e.g. "venues-spaces", "entertainment"
  Planviry_sub_category: string; // e.g. "photographer", "dance-club"
  city: string;
  state: string;                // 2-letter abbreviation
  state_full: string;           // Full state name
  zip: string;
  lat: number;
  lng: number;
  _geoloc: { lat: number; lng: number };
  phone: string | null;
  website: string | null;
  email: string | null;
  socials: string[] | null;
  brand: string | null;
  operating_status: string | null;
  confidence: number;
  quality_score: number;
  is_claimed: boolean;
  avg_rating: number | null;
  review_count: number;
  is_promoted: boolean;
  instant_book: boolean;
  price_tier: number | null;
  profile_image_url: string | null;
  tags: string[];
  _highlightResult?: Record<string, { value: string; matchLevel: string }>;
}

export interface ListingSearchResult {
  hits: AlgoliaListingHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  facets?: Record<string, Record<string, number>>;
}

export interface ListingSearchFilters {
  vertical?: string;          // Planviry_vertical filter
  subCategory?: string;       // Planviry_sub_category filter
  category?: string;          // category_primary filter
  city?: string;
  state?: string;
  operatingStatus?: string;
  isClaimed?: boolean;
  isPromoted?: boolean;
  instantBook?: boolean;
  minQualityScore?: number;
  aroundLatLng?: { lat: number; lng: number };
  aroundRadius?: number;      // in meters
  limit?: number;
  page?: number;
}

// ---------------------------------------------------------------------------
// Types - Vendors (legacy, deprecated)
// ---------------------------------------------------------------------------

/**
 * @deprecated Use `AlgoliaListingHit` instead. Will be removed in a future release.
 */
export interface AlgoliaVendorHit {
  objectID: string;
  slug: string;
  business_name: string;
  category: string;
  sub_category: string;
  description: string;
  city: string;
  state: string;
  vertical_slug: string;
  rating: number;
  review_count: number;
  price_range: string | null;
  image_url: string | null;
  is_verified: boolean;
  _highlightResult?: Record<string, { value: string; matchLevel: string }>;
}

/**
 * @deprecated Use `ListingSearchResult` instead. Will be removed in a future release.
 */
export interface VendorSearchResult {
  hits: AlgoliaVendorHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  facets?: Record<string, Record<string, number>>;
}

// ---------------------------------------------------------------------------
// Server-side search client (uses admin key - NEVER expose to the browser)
// ---------------------------------------------------------------------------

let _searchClient: SearchClient | null = null;
let _vendorIndex: SearchIndex | null = null;
let _listingsIndex: SearchIndex | null = null;

function getSearchClient(): SearchClient {
  if (!_searchClient) {
    _searchClient = algoliasearch(APP_ID, ADMIN_KEY);
  }
  return _searchClient;
}

function getListingsIndex(): SearchIndex {
  if (!_listingsIndex) {
    _listingsIndex = getSearchClient().initIndex(INDEX_NAME);
  }
  return _listingsIndex;
}

/**
 * @deprecated Use `getListingsIndex()` instead. Will be removed in a future release.
 */
function getVendorIndex(): SearchIndex {
  if (!_vendorIndex) {
    _vendorIndex = getSearchClient().initIndex("vendors");
  }
  return _vendorIndex;
}

// ---------------------------------------------------------------------------
// Browser search config (safe to expose to the frontend)
// ---------------------------------------------------------------------------

export function getBrowserSearchConfig() {
  return {
    appId: APP_ID,
    apiKey: SEARCH_ONLY_KEY,
    indexName: INDEX_NAME,
  };
}

// ---------------------------------------------------------------------------
// Listings search (current)
// ---------------------------------------------------------------------------

/**
 * Search the `listings` index with optional faceted filters, geo search,
 * and quality-score threshold.
 */
export async function searchListings(
  query: string,
  filters?: ListingSearchFilters,
): Promise<ListingSearchResult> {
  const index = getListingsIndex();

  const facetFilters: string[] = [];

  if (filters?.vertical) {
    facetFilters.push(`Planviry_vertical:${filters.vertical}`);
  }
  if (filters?.subCategory) {
    facetFilters.push(`Planviry_sub_category:${filters.subCategory}`);
  }
  if (filters?.category) {
    facetFilters.push(`category_primary:${filters.category}`);
  }
  if (filters?.city) {
    facetFilters.push(`city:${filters.city}`);
  }
  if (filters?.state) {
    facetFilters.push(`state:${filters.state}`);
  }
  if (filters?.operatingStatus) {
    facetFilters.push(`operating_status:${filters.operatingStatus}`);
  }
  if (filters?.isClaimed !== undefined) {
    facetFilters.push(`is_claimed:${filters.isClaimed}`);
  }
  if (filters?.isPromoted !== undefined) {
    facetFilters.push(`is_promoted:${filters.isPromoted}`);
  }
  if (filters?.instantBook !== undefined) {
    facetFilters.push(`instant_book:${filters.instantBook}`);
  }

  const numericFilters: string[] = [];
  if (filters?.minQualityScore !== undefined) {
    numericFilters.push(`quality_score >= ${filters.minQualityScore}`);
  }

  const page = filters?.page ?? 0;
  const hitsPerPage = filters?.limit ?? 20;

  const searchParams: Record<string, unknown> = {
    facetFilters,
    page,
    hitsPerPage,
    facets: [
      "category_primary",
      "Planviry_vertical",
      "Planviry_sub_category",
      "city",
      "state",
      "operating_status",
      "is_claimed",
      "is_promoted",
      "instant_book",
    ],
  };

  if (numericFilters.length > 0) {
    searchParams.numericFilters = numericFilters;
  }

  if (filters?.aroundLatLng) {
    searchParams.aroundLatLng = `${filters.aroundLatLng.lat},${filters.aroundLatLng.lng}`;
  }

  if (filters?.aroundRadius !== undefined) {
    searchParams.aroundRadius = filters.aroundRadius;
  }

  const result = await index.search(query, searchParams);

  return {
    hits: result.hits as unknown as AlgoliaListingHit[],
    nbHits: result.nbHits,
    page: result.page,
    nbPages: result.nbPages,
    hitsPerPage: result.hitsPerPage,
    facets: result.facets as Record<string, Record<string, number>> | undefined,
  };
}

/**
 * Get facet values for a given attribute on the `listings` index.
 * Useful for building filter UIs (dropdowns, checkboxes, etc.).
 */
export async function getListingFacets(
  attribute: string,
): Promise<Record<string, number>> {
  const index = getListingsIndex();

  const result = await index.search("", {
    facets: [attribute],
    hitsPerPage: 0,
  });

  return result.facets?.[attribute] ?? {};
}

/**
 * Search listings by journey dimension + node.
 *
 * Looks up the subcategories associated with the given journey from the
 * Overture taxonomy, builds an Algolia filter using
 * `Planviry_sub_category`, and combines with any additional filters.
 */
export async function searchByJourney(
  dimensionSlug: string,
  nodeSlug: string,
  filters?: ListingSearchFilters,
): Promise<ListingSearchResult> {
  const subcategories = getSubcategoriesForJourney(dimensionSlug, nodeSlug);

  if (subcategories.length === 0) {
    return {
      hits: [],
      nbHits: 0,
      page: 0,
      nbPages: 0,
      hitsPerPage: filters?.limit ?? 20,
    };
  }

  // Build the subcategory OR filter from the taxonomy slugs
  const subCategoryFilter = subcategories
    .map((sc) => `Planviry_sub_category:${sc.slug}`)
    .join(" OR ");

  const index = getListingsIndex();

  const facetFilters: string[] = [];

  if (filters?.vertical) {
    facetFilters.push(`Planviry_vertical:${filters.vertical}`);
  }
  if (filters?.category) {
    facetFilters.push(`category_primary:${filters.category}`);
  }
  if (filters?.city) {
    facetFilters.push(`city:${filters.city}`);
  }
  if (filters?.state) {
    facetFilters.push(`state:${filters.state}`);
  }
  if (filters?.operatingStatus) {
    facetFilters.push(`operating_status:${filters.operatingStatus}`);
  }
  if (filters?.isClaimed !== undefined) {
    facetFilters.push(`is_claimed:${filters.isClaimed}`);
  }
  if (filters?.isPromoted !== undefined) {
    facetFilters.push(`is_promoted:${filters.isPromoted}`);
  }
  if (filters?.instantBook !== undefined) {
    facetFilters.push(`instant_book:${filters.instantBook}`);
  }

  const numericFilters: string[] = [];
  if (filters?.minQualityScore !== undefined) {
    numericFilters.push(`quality_score >= ${filters.minQualityScore}`);
  }

  const page = filters?.page ?? 0;
  const hitsPerPage = filters?.limit ?? 20;

  // Combine the journey subcategory OR filter with other facet filters.
  // Algolia facetFilters arrays are AND-combined; strings inside an array
  // element are OR-combined, so we push the subcategory group as a single
  // string so it stays as one OR expression.
  const combinedFacetFilters: (string | string[])[] = [subCategoryFilter];
  for (const ff of facetFilters) {
    combinedFacetFilters.push(ff);
  }

  const searchParams: Record<string, unknown> = {
    facetFilters: combinedFacetFilters,
    page,
    hitsPerPage,
    facets: [
      "category_primary",
      "Planviry_vertical",
      "Planviry_sub_category",
      "city",
      "state",
      "operating_status",
      "is_claimed",
      "is_promoted",
      "instant_book",
    ],
  };

  if (numericFilters.length > 0) {
    searchParams.numericFilters = numericFilters;
  }

  if (filters?.aroundLatLng) {
    searchParams.aroundLatLng = `${filters.aroundLatLng.lat},${filters.aroundLatLng.lng}`;
  }

  if (filters?.aroundRadius !== undefined) {
    searchParams.aroundRadius = filters.aroundRadius;
  }

  const result = await index.search("", searchParams);

  return {
    hits: result.hits as unknown as AlgoliaListingHit[],
    nbHits: result.nbHits,
    page: result.page,
    nbPages: result.nbPages,
    hitsPerPage: result.hitsPerPage,
    facets: result.facets as Record<string, Record<string, number>> | undefined,
  };
}

/**
 * Configure the `listings` index with proper searchable attributes,
 * faceting, and ranking.
 *
 * Call this once during setup / seed to apply index settings.
 */
export async function configureListingsIndex(): Promise<void> {
  const index = getListingsIndex();

  await index.setSettings({
    searchableAttributes: [
      "name",
      "category_primary",
      "Planviry_sub_category",
      "city",
      "state_full",
      "brand",
      "tags",
    ],
    attributesForFaceting: [
      "filterOnly(category_primary)",
      "filterOnly(Planviry_vertical)",
      "filterOnly(Planviry_sub_category)",
      "filterOnly(city)",
      "filterOnly(state)",
      "filterOnly(operating_status)",
      "filterOnly(is_claimed)",
      "filterOnly(is_promoted)",
      "filterOnly(instant_book)",
    ],
    numericAttributesForFiltering: ["quality_score"],
    ranking: [
      "typo",
      "geo",
      "words",
      "filters",
      "proximity",
      "attribute",
      "exact",
      "custom",
    ],
    customRanking: [
      "desc(quality_score)",
      "desc(confidence)",
      "desc(review_count)",
    ],
    attributesToHighlight: [
      "name",
      "category_primary",
      "Planviry_sub_category",
      "city",
      "state_full",
    ],
    highlightsPostTag: "</ais_highlight>",
    highlightsPreTag: "<ais_highlight>",
  });
}

// ---------------------------------------------------------------------------
// Vendors search (legacy, deprecated)
// ---------------------------------------------------------------------------

interface VendorSearchFilters {
  category?: string;
  city?: string;
  state?: string;
  vertical?: string;
  limit?: number;
  page?: number;
}

/**
 * @deprecated Use `searchListings()` instead. Will be removed in a future release.
 *
 * Search the `vendors` index with optional faceted filters.
 */
export async function searchVendors(
  query: string,
  filters?: VendorSearchFilters,
): Promise<VendorSearchResult> {
  const index = getVendorIndex();

  const facetFilters: string[] = [];

  if (filters?.category) {
    facetFilters.push(`category:${filters.category}`);
  }
  if (filters?.city) {
    facetFilters.push(`city:${filters.city}`);
  }
  if (filters?.state) {
    facetFilters.push(`state:${filters.state}`);
  }
  if (filters?.vertical) {
    facetFilters.push(`vertical_slug:${filters.vertical}`);
  }

  const page = filters?.page ?? 0;
  const hitsPerPage = filters?.limit ?? 20;

  const result = await index.search(query, {
    facetFilters,
    page,
    hitsPerPage,
    facets: ["category", "city", "state", "vertical_slug"],
  });

  return {
    hits: result.hits as unknown as AlgoliaVendorHit[],
    nbHits: result.nbHits,
    page: result.page,
    nbPages: result.nbPages,
    hitsPerPage: result.hitsPerPage,
    facets: result.facets as Record<string, Record<string, number>> | undefined,
  };
}

/**
 * @deprecated Use `getListingFacets()` instead. Will be removed in a future release.
 *
 * Get facet values for a given attribute on the `vendors` index.
 * Useful for building filter UIs (dropdowns, checkboxes, etc.).
 */
export async function getVendorFacets(
  attribute: string,
): Promise<Record<string, number>> {
  const index = getVendorIndex();

  const result = await index.search("", {
    facets: [attribute],
    hitsPerPage: 0,
  });

  return result.facets?.[attribute] ?? {};
}

/**
 * @deprecated Use `configureListingsIndex()` instead. Will be removed in a future release.
 *
 * Configure the `vendors` index with proper searchable attributes,
 * faceting, and ranking.
 *
 * Call this once during setup / seed to apply index settings.
 */
export async function configureVendorIndex(): Promise<void> {
  const index = getVendorIndex();

  await index.setSettings({
    searchableAttributes: [
      "business_name",
      "category",
      "sub_category",
      "description",
      "city",
      "state",
    ],
    attributesForFaceting: [
      "filterOnly(category)",
      "filterOnly(city)",
      "filterOnly(state)",
      "filterOnly(vertical_slug)",
    ],
    ranking: [
      "typo",
      "geo",
      "words",
      "filters",
      "proximity",
      "attribute",
      "exact",
      "custom",
    ],
    customRanking: ["desc(rating)", "desc(review_count)"],
    attributesToHighlight: [
      "business_name",
      "category",
      "sub_category",
      "description",
      "city",
      "state",
    ],
    highlightsPostTag: "</ais_highlight>",
    highlightsPreTag: "<ais_highlight>",
  });
}
