/**
 * @file overture-taxonomy.ts
 * @description 4-Dimension Taxonomy for Planviry Vendor Discovery
 *
 * This is the MAPPING LAYER between Overture's `categories.primary` field
 * and Planviry's browse dimensions. Every subcategory has:
 *   - A plain-language name (user-facing)
 *   - An Overture category string (what to filter on in Algolia)
 *   - A slug (URL-safe)
 *   - A real count from Overture data
 *   - Membership in one or more journeys across the 4 dimensions
 *
 * Dimensions:
 *   1. BY ROLE     - Who is planning? (7 roles)
 *   2. BY EVENT    - What kind of event? (4 types)
 *   3. BY ACTIVITY - What's the vibe? (8 activities)
 *   4. BY CATEGORY - What service? (15 verticals)
 *
 * Consumed by: Python ETL script, Next.js frontend, Algolia filter builder
 */

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

export interface Subcategory {
  name: string;
  overtureCategory: string;
  slug: string;
  count: number;
}

export interface DimensionNode {
  name: string;
  slug: string;
  description: string;
  subcategories: string[]; // array of subcategory slugs
}

export interface BrowseDimension {
  id: string;
  name: string;
  slug: string;
  label: string; // short label for nav
  description: string;
  icon: string; // lucide icon name
  nodes: DimensionNode[];
}

export interface JourneyStep {
  dimension: string; // dimension slug
  node: string; // node slug
  label: string; // display label
  subcategories: string[]; // subcategory slugs to show
}

// ---------------------------------------------------------------------------
// Subcategory Master List
// ---------------------------------------------------------------------------

export const SUBCATEGORIES: Record<string, Subcategory> = {
  "venue-and-event-space": {
    name: "Venue and Event Space",
    overtureCategory: "event_venue",
    slug: "venue-and-event-space",
    count: 14301,
  },
  "exhibition-and-trade-center": {
    name: "Exhibition and Trade Center",
    overtureCategory: "exhibition_and_trade_center",
    slug: "exhibition-and-trade-center",
    count: 193,
  },
  caterer: {
    name: "Caterer",
    overtureCategory: "caterer",
    slug: "caterer",
    count: 67345,
  },
  bartender: {
    name: "Bartender",
    overtureCategory: "bartender",
    slug: "bartender",
    count: 3535,
  },
  "personal-chef": {
    name: "Personal Chef",
    overtureCategory: "personal_chef",
    slug: "personal-chef",
    count: 1120,
  },
  "food-and-beverage-consultant": {
    name: "Food and Beverage Consultant",
    overtureCategory: "food_and_beverage_consultant",
    slug: "food-and-beverage-consultant",
    count: 0,
  },
  "event-technology-service": {
    name: "Event Technology Service",
    overtureCategory: "event_technology_service",
    slug: "event-technology-service",
    count: 631,
  },
  "party-and-event-planning": {
    name: "Party and Event Planning",
    overtureCategory: "party_and_event_planning",
    slug: "party-and-event-planning",
    count: 8316,
  },
  photographer: {
    name: "Photographer",
    overtureCategory: "photographer",
    slug: "photographer",
    count: 74340,
  },
  videographer: {
    name: "Videographer",
    overtureCategory: "videographer",
    slug: "videographer",
    count: 3096,
  },
  "limo-services": {
    name: "Limo Services",
    overtureCategory: "limousine_service",
    slug: "limo-services",
    count: 9175,
  },
  "coach-bus": {
    name: "Coach Bus",
    overtureCategory: "coach_bus",
    slug: "coach-bus",
    count: 338,
  },
  "town-car-service": {
    name: "Town Car Service",
    overtureCategory: "town_car_service",
    slug: "town-car-service",
    count: 322,
  },
  "private-jet-charters": {
    name: "Private Jet Charters",
    overtureCategory: "private_jet_charter",
    slug: "private-jet-charters",
    count: 133,
  },
  "team-building-activity": {
    name: "Team Building Activity",
    overtureCategory: "team_building_activity",
    slug: "team-building-activity",
    count: 173,
  },
  "image-consultant": {
    name: "Image Consultant",
    overtureCategory: "image_consultant",
    slug: "image-consultant",
    count: 2361,
  },
  "corporate-gift-supplier": {
    name: "Corporate Gift Supplier",
    overtureCategory: "corporate_gift_supplier",
    slug: "corporate-gift-supplier",
    count: 77,
  },
  "attraction-farm": {
    name: "Attraction Farm",
    overtureCategory: "attraction_farm",
    slug: "attraction-farm",
    count: 145,
  },
  "food-truck": {
    name: "Food Truck",
    overtureCategory: "food_truck",
    slug: "food-truck",
    count: 37597,
  },
  "dj-service": {
    name: "DJ Service",
    overtureCategory: "dj_service",
    slug: "dj-service",
    count: 3284,
  },
  musician: {
    name: "Musician",
    overtureCategory: "musician",
    slug: "musician",
    count: 1527,
  },
  "musical-band-orchestras-and-symphonies": {
    name: "Musical Band Orchestras and Symphonies",
    overtureCategory: "orchestra",
    slug: "musical-band-orchestras-and-symphonies",
    count: 49,
  },
  choir: {
    name: "Choir",
    overtureCategory: "choir",
    slug: "choir",
    count: 2165,
  },
  "party-equipment-rental": {
    name: "Party Equipment Rental",
    overtureCategory: "party_equipment_rental",
    slug: "party-equipment-rental",
    count: 8832,
  },
  "balloon-services": {
    name: "Balloon Services",
    overtureCategory: "balloon_service",
    slug: "balloon-services",
    count: 416,
  },
  "face-painting": {
    name: "Face Painting",
    overtureCategory: "face_painting",
    slug: "face-painting",
    count: 44,
  },
  tours: {
    name: "Tours",
    overtureCategory: "tour_operator",
    slug: "tours",
    count: 150078,
  },
  "boat-charter": {
    name: "Boat Charter",
    overtureCategory: "boat_charter",
    slug: "boat-charter",
    count: 829,
  },
  "comedy-club": {
    name: "Comedy Club",
    overtureCategory: "comedy_club",
    slug: "comedy-club",
    count: 9261,
  },
  "dance-club": {
    name: "Dance Club",
    overtureCategory: "nightclub",
    slug: "dance-club",
    count: 102365,
  },
  karaoke: {
    name: "Karaoke",
    overtureCategory: "karaoke",
    slug: "karaoke",
    count: 25739,
  },
  "jazz-and-blues": {
    name: "Jazz and Blues",
    overtureCategory: "jazz_and_blues_club",
    slug: "jazz-and-blues",
    count: 2597,
  },
  "party-bus-rental": {
    name: "Party Bus Rental",
    overtureCategory: "party_bus_rental",
    slug: "party-bus-rental",
    count: 297,
  },
  "party-bike-rental": {
    name: "Party Bike Rental",
    overtureCategory: "party_bike_rental",
    slug: "party-bike-rental",
    count: 6,
  },
  "bowling-alley": {
    name: "Bowling Alley",
    overtureCategory: "bowling_alley",
    slug: "bowling-alley",
    count: 16244,
  },
  "miniature-golf-course": {
    name: "Miniature Golf Course",
    overtureCategory: "miniature_golf_course",
    slug: "miniature-golf-course",
    count: 4017,
  },
  "disc-golf-course": {
    name: "Disc Golf Course",
    overtureCategory: "disc_golf_course",
    slug: "disc-golf-course",
    count: 1867,
  },
  "hot-air-balloons-tour": {
    name: "Hot Air Balloons Tour",
    overtureCategory: "hot_air_balloon_ride",
    slug: "hot-air-balloons-tour",
    count: 814,
  },
  "aerial-tours": {
    name: "Aerial Tours",
    overtureCategory: "aerial_tour",
    slug: "aerial-tours",
    count: 72,
  },
  "stargazing-area": {
    name: "Stargazing Area",
    overtureCategory: "stargazing_area",
    slug: "stargazing-area",
    count: 1,
  },
  "observatory-decks": {
    name: "Observatory Decks",
    overtureCategory: "observation_deck",
    slug: "observatory-decks",
    count: 2380,
  },
  "fishing-charter": {
    name: "Fishing Charter",
    overtureCategory: "fishing_charter",
    slug: "fishing-charter",
    count: 0,
  },
  "tattoo-and-piercing": {
    name: "Tattoo and Piercing",
    overtureCategory: "tattoo_shop",
    slug: "tattoo-and-piercing",
    count: 165374,
  },
  "kids-recreation-and-party": {
    name: "Kids Recreation and Party",
    overtureCategory: "childrens_party_service",
    slug: "kids-recreation-and-party",
    count: 8443,
  },
  "holiday-rental-home": {
    name: "Holiday Rental Home",
    overtureCategory: "vacation_rental",
    slug: "holiday-rental-home",
    count: 153407,
  },
  resort: {
    name: "Resort",
    overtureCategory: "resort",
    slug: "resort",
    count: 97155,
  },
  cabin: {
    name: "Cabin",
    overtureCategory: "cabin",
    slug: "cabin",
    count: 24523,
  },
  lodge: {
    name: "Lodge",
    overtureCategory: "lodge",
    slug: "lodge",
    count: 46756,
  },
  "bed-and-breakfast": {
    name: "Bed and Breakfast",
    overtureCategory: "bed_and_breakfast",
    slug: "bed-and-breakfast",
    count: 97579,
  },
  cottage: {
    name: "Cottage",
    overtureCategory: "cottage",
    slug: "cottage",
    count: 19968,
  },
  campgrounds: {
    name: "Campgrounds",
    overtureCategory: "campground",
    slug: "campgrounds",
    count: 0,
  },
  "health-retreats": {
    name: "Health Retreats",
    overtureCategory: "health_retreat",
    slug: "health-retreats",
    count: 111,
  },
  "travel-services": {
    name: "Travel Services",
    overtureCategory: "travel_agency",
    slug: "travel-services",
    count: 308427,
  },
  "passport-and-visa-services": {
    name: "Passport and Visa Services",
    overtureCategory: "passport_and_visa_service",
    slug: "passport-and-visa-services",
    count: 12178,
  },
  "nail-salon": {
    name: "Nail Salon",
    overtureCategory: "nail_salon",
    slug: "nail-salon",
    count: 97805,
  },
  "day-spa": {
    name: "Day Spa",
    overtureCategory: "day_spa",
    slug: "day-spa",
    count: 11975,
  },
  spas: {
    name: "Spas",
    overtureCategory: "spa",
    slug: "spas",
    count: 291737,
  },
  "bridal-shop": {
    name: "Bridal Shop",
    overtureCategory: "bridal_shop",
    slug: "bridal-shop",
    count: 0,
  },
  "flower-and-gift-shop": {
    name: "Flower and Gift Shop",
    overtureCategory: "florist",
    slug: "flower-and-gift-shop",
    count: 0,
  },
  "jewelry-store": {
    name: "Jewelry Store",
    overtureCategory: "jewelry_store",
    slug: "jewelry-store",
    count: 0,
  },
  gemstones: {
    name: "Gemstones",
    overtureCategory: "gemstone_dealer",
    slug: "gemstones",
    count: 0,
  },
  "photography-store": {
    name: "Photography Store",
    overtureCategory: "photography_store",
    slug: "photography-store",
    count: 0,
  },
  "party-supply": {
    name: "Party Supply",
    overtureCategory: "party_supply_store",
    slug: "party-supply",
    count: 0,
  },
  "wedding-planning": {
    name: "Wedding Planning",
    overtureCategory: "wedding_planner",
    slug: "wedding-planning",
    count: 44441,
  },
  "wedding-chapel": {
    name: "Wedding Chapel",
    overtureCategory: "wedding_chapel",
    slug: "wedding-chapel",
    count: 79,
  },
  "officiating-services": {
    name: "Officiating Services",
    overtureCategory: "wedding_officiant",
    slug: "officiating-services",
    count: 259,
  },
  bakery: {
    name: "Bakery",
    overtureCategory: "bakery",
    slug: "bakery",
    count: 431989,
  },
  "photo-booth-rental": {
    name: "Photo Booth Rental",
    overtureCategory: "photo_booth_rental",
    slug: "photo-booth-rental",
    count: 2686,
  },
  "makeup-artist": {
    name: "Makeup Artist",
    overtureCategory: "makeup_artist",
    slug: "makeup-artist",
    count: 18854,
  },
  "hair-stylist": {
    name: "Hair Stylist",
    overtureCategory: "hair_stylist",
    slug: "hair-stylist",
    count: 9881,
  },
  "hair-salon": {
    name: "Hair Salon",
    overtureCategory: "hair_salon",
    slug: "hair-salon",
    count: 185327,
  },
  "spray-tanning": {
    name: "Spray Tanning",
    overtureCategory: "spray_tanning",
    slug: "spray-tanning",
    count: 728,
  },
  "eyelash-service": {
    name: "Eyelash Service",
    overtureCategory: "eyelash_service",
    slug: "eyelash-service",
    count: 1202,
  },
  "rehearsal-dinners": {
    name: "Rehearsal Dinners",
    overtureCategory: "rehearsal_dinner_venue",
    slug: "rehearsal-dinners",
    count: 0,
  },
  "bachelorette-and-bachelor": {
    name: "Bachelorette and Bachelor",
    overtureCategory: "bachelor_bachelorette_party_service",
    slug: "bachelorette-and-bachelor",
    count: 0,
  },
  "furniture-rental": {
    name: "Furniture Rental",
    overtureCategory: "furniture_rental_store",
    slug: "furniture-rental",
    count: 0,
  },
  "bus-rental": {
    name: "Bus Rental",
    overtureCategory: "bus_rental",
    slug: "bus-rental",
    count: 0,
  },
  "valet-service": {
    name: "Valet Service",
    overtureCategory: "valet_service",
    slug: "valet-service",
    count: 433,
  },
  "ice-supplier": {
    name: "Ice Supplier",
    overtureCategory: "ice_supplier",
    slug: "ice-supplier",
    count: 0,
  },
  distillery: {
    name: "Distillery",
    overtureCategory: "distillery",
    slug: "distillery",
    count: 0,
  },
  "party-character": {
    name: "Party Character",
    overtureCategory: "party_character",
    slug: "party-character",
    count: 18,
  },
  magician: {
    name: "Magician",
    overtureCategory: "magician",
    slug: "magician",
    count: 468,
  },
  clown: {
    name: "Clown",
    overtureCategory: "clown",
    slug: "clown",
    count: 34,
  },
  "game-truck-rental": {
    name: "Game Truck Rental",
    overtureCategory: "game_truck_rental",
    slug: "game-truck-rental",
    count: 16,
  },
  "trivia-host": {
    name: "Trivia Host",
    overtureCategory: "trivia_host",
    slug: "trivia-host",
    count: 3,
  },
  "silent-disco": {
    name: "Silent Disco",
    overtureCategory: "silent_disco",
    slug: "silent-disco",
    count: 3,
  },
};

// ---------------------------------------------------------------------------
// All Subcategories List (sorted by count descending)
// ---------------------------------------------------------------------------

export const ALL_SUBCATEGORIES_LIST: Subcategory[] = Object.values(
  SUBCATEGORIES
).sort((a, b) => b.count - a.count);

// ---------------------------------------------------------------------------
// All Subcategory Slugs (for the Event Planner wildcard role)
// ---------------------------------------------------------------------------

const ALL_SLUGS: string[] = Object.keys(SUBCATEGORIES);

// ---------------------------------------------------------------------------
// Browse Dimensions
// ---------------------------------------------------------------------------

export const BROWSE_DIMENSIONS: BrowseDimension[] = [
  // ─── DIMENSION 1: BY ROLE ───────────────────────────────────────────────
  {
    id: "by-role",
    name: "By Role",
    slug: "by-role",
    label: "Role",
    description:
      "Who is planning this event? Your role determines which vendors you need.",
    icon: "Users",
    nodes: [
      {
        name: "Corporate Planner",
        slug: "corporate-planner",
        description:
          "Planning company events, conferences, and corporate functions",
        subcategories: [
          "venue-and-event-space",
          "exhibition-and-trade-center",
          "caterer",
          "bartender",
          "personal-chef",
          "food-and-beverage-consultant",
          "event-technology-service",
          "party-and-event-planning",
          "photographer",
          "videographer",
          "limo-services",
          "coach-bus",
          "town-car-service",
          "private-jet-charters",
          "team-building-activity",
          "image-consultant",
          "corporate-gift-supplier",
        ],
      },
      {
        name: "Community Planner",
        slug: "community-planner",
        description:
          "Organizing community gatherings, festivals, and public events",
        subcategories: [
          "venue-and-event-space",
          "attraction-farm",
          "caterer",
          "food-truck",
          "dj-service",
          "musician",
          "musical-band-orchestras-and-symphonies",
          "choir",
          "party-and-event-planning",
          "party-equipment-rental",
          "balloon-services",
          "face-painting",
          "tours",
          "boat-charter",
        ],
      },
      {
        name: "Event Planner",
        slug: "event-planner",
        description:
          "Professional event planners who need access to every vendor category",
        subcategories: ALL_SLUGS,
      },
      {
        name: "Promoter",
        slug: "promoter",
        description:
          "Promoting nightlife, concerts, and entertainment experiences",
        subcategories: [
          "venue-and-event-space",
          "comedy-club",
          "dance-club",
          "karaoke",
          "jazz-and-blues",
          "dj-service",
          "musician",
          "musical-band-orchestras-and-symphonies",
          "event-technology-service",
          "party-and-event-planning",
          "limo-services",
          "party-bus-rental",
          "boat-charter",
          "party-bike-rental",
        ],
      },
      {
        name: "General Public",
        slug: "general-public",
        description:
          "Personal celebrations, getaways, and leisure activities for individuals and families",
        subcategories: [
          "bowling-alley",
          "miniature-golf-course",
          "disc-golf-course",
          "hot-air-balloons-tour",
          "aerial-tours",
          "stargazing-area",
          "observatory-decks",
          "tours",
          "fishing-charter",
          "tattoo-and-piercing",
          "kids-recreation-and-party",
          "holiday-rental-home",
          "resort",
          "cabin",
          "lodge",
          "bed-and-breakfast",
          "cottage",
          "campgrounds",
          "health-retreats",
          "travel-services",
          "passport-and-visa-services",
          "nail-salon",
          "day-spa",
          "spas",
        ],
      },
      {
        name: "3rd Party / Gifter",
        slug: "third-party-gifter",
        description:
          "Gift buyers, bridal party members, and anyone contributing to someone else's event",
        subcategories: [
          "bridal-shop",
          "flower-and-gift-shop",
          "jewelry-store",
          "gemstones",
          "photography-store",
          "party-supply",
          "corporate-gift-supplier",
        ],
      },
      {
        name: "Organizer",
        slug: "organizer",
        description:
          "Logistics-focused organizers handling rentals, transport, and operations",
        subcategories: [
          "party-and-event-planning",
          "wedding-planning",
          "party-equipment-rental",
          "furniture-rental",
          "limo-services",
          "coach-bus",
          "bus-rental",
          "boat-charter",
          "valet-service",
          "ice-supplier",
        ],
      },
    ],
  },

  // ─── DIMENSION 2: BY EVENT ──────────────────────────────────────────────
  {
    id: "by-event",
    name: "By Event",
    slug: "by-event",
    label: "Event",
    description:
      "What kind of event are you planning? Each type has its own vendor ecosystem.",
    icon: "Calendar",
    nodes: [
      {
        name: "Weddings and Milestone",
        slug: "weddings-milestone",
        description:
          "Weddings, anniversaries, and once-in-a-lifetime celebrations",
        subcategories: [
          "venue-and-event-space",
          "wedding-chapel",
          "wedding-planning",
          "officiating-services",
          "caterer",
          "bakery",
          "bartender",
          "photographer",
          "videographer",
          "photo-booth-rental",
          "dj-service",
          "musician",
          "choir",
          "makeup-artist",
          "hair-stylist",
          "hair-salon",
          "nail-salon",
          "day-spa",
          "spray-tanning",
          "eyelash-service",
          "party-equipment-rental",
          "balloon-services",
          "limo-services",
          "party-bus-rental",
          "bridal-shop",
          "flower-and-gift-shop",
          "jewelry-store",
          "rehearsal-dinners",
          "bachelorette-and-bachelor",
        ],
      },
      {
        name: "Corporate and Professional",
        slug: "corporate-professional",
        description:
          "Conferences, trade shows, team retreats, and business events",
        subcategories: [
          "venue-and-event-space",
          "exhibition-and-trade-center",
          "caterer",
          "bartender",
          "event-technology-service",
          "team-building-activity",
          "photographer",
          "videographer",
          "party-and-event-planning",
          "corporate-gift-supplier",
          "image-consultant",
          "limo-services",
          "coach-bus",
        ],
      },
      {
        name: "Social and Casual",
        slug: "social-casual",
        description:
          "Parties, gatherings, and casual get-togethers with friends and family",
        subcategories: [
          "venue-and-event-space",
          "caterer",
          "food-truck",
          "dj-service",
          "bartender",
          "photo-booth-rental",
          "party-equipment-rental",
          "balloon-services",
          "party-and-event-planning",
          "distillery",
        ],
      },
      {
        name: "Entertainment and Cultural",
        slug: "entertainment-cultural",
        description:
          "Nightlife, concerts, performances, and cultural experiences",
        subcategories: [
          "venue-and-event-space",
          "comedy-club",
          "dance-club",
          "karaoke",
          "jazz-and-blues",
          "dj-service",
          "musician",
          "musical-band-orchestras-and-symphonies",
          "event-technology-service",
        ],
      },
    ],
  },

  // ─── DIMENSION 3: BY ACTIVITY ───────────────────────────────────────────
  {
    id: "by-activity",
    name: "By Activity",
    slug: "by-activity",
    label: "Activity",
    description:
      "What's the vibe? Browse by the kind of experience you want to create.",
    icon: "Sparkles",
    nodes: [
      {
        name: "Adult Activities - Nightlife and Social",
        slug: "adult-nightlife",
        description:
          "Clubs, comedy shows, karaoke, and live jazz for a great night out",
        subcategories: [
          "comedy-club",
          "dance-club",
          "karaoke",
          "jazz-and-blues",
        ],
      },
      {
        name: "Adult Activities - Outdoor and Adventure",
        slug: "adult-outdoor",
        description:
          "Hot air balloons, aerial tours, stargazing, and fishing charters",
        subcategories: [
          "hot-air-balloons-tour",
          "aerial-tours",
          "stargazing-area",
          "fishing-charter",
        ],
      },
      {
        name: "Adult Activities - Sports and Rec",
        slug: "adult-sports",
        description: "Bowling, mini golf, disc golf, and recreational sports",
        subcategories: [
          "bowling-alley",
          "miniature-golf-course",
          "disc-golf-course",
        ],
      },
      {
        name: "Adult Activities - Date and Couples",
        slug: "adult-couples",
        description:
          "Distillery tours, bachelor/bachelorette parties, and rehearsal dinners",
        subcategories: ["distillery", "bachelorette-and-bachelor", "rehearsal-dinners"],
      },
      {
        name: "Adult Activities - Creative and Body Art",
        slug: "adult-creative",
        description: "Tattoo shops, piercing studios, and body art services",
        subcategories: ["tattoo-and-piercing"],
      },
      {
        name: "Children Activities",
        slug: "children-activities",
        description:
          "Kids parties, face painting, magicians, clowns, and game trucks",
        subcategories: [
          "kids-recreation-and-party",
          "face-painting",
          "party-character",
          "magician",
          "clown",
          "game-truck-rental",
        ],
      },
      {
        name: "Team Building",
        slug: "team-building",
        description:
          "Team building activities, trivia, silent disco, and tech-enabled experiences",
        subcategories: [
          "team-building-activity",
          "event-technology-service",
          "trivia-host",
          "silent-disco",
          "party-equipment-rental",
        ],
      },
      {
        name: "Trip Planning",
        slug: "trip-planning",
        description:
          "Vacation rentals, resorts, tours, travel services, and transportation",
        subcategories: [
          "holiday-rental-home",
          "resort",
          "cabin",
          "lodge",
          "bed-and-breakfast",
          "cottage",
          "campgrounds",
          "travel-services",
          "passport-and-visa-services",
          "tours",
          "boat-charter",
          "limo-services",
        ],
      },
    ],
  },

  // ─── DIMENSION 4: BY CATEGORY ───────────────────────────────────────────
  {
    id: "by-category",
    name: "By Category",
    slug: "by-category",
    label: "Category",
    description:
      "Browse by service type - the traditional vertical view of event vendors.",
    icon: "LayoutGrid",
    nodes: [
      {
        name: "Venues and Spaces",
        slug: "venues-spaces",
        description:
          "Event venues, exhibition centers, and wedding chapels",
        subcategories: [
          "venue-and-event-space",
          "exhibition-and-trade-center",
          "wedding-chapel",
        ],
      },
      {
        name: "Event Planning",
        slug: "event-planning",
        description:
          "Event planners, wedding planners, and technology services",
        subcategories: [
          "party-and-event-planning",
          "wedding-planning",
          "event-technology-service",
        ],
      },
      {
        name: "Catering and Food",
        slug: "catering-food",
        description:
          "Caterers, personal chefs, food consultants, food trucks, and bakeries",
        subcategories: [
          "caterer",
          "personal-chef",
          "food-and-beverage-consultant",
          "food-truck",
          "bakery",
        ],
      },
      {
        name: "Entertainment",
        slug: "entertainment",
        description:
          "Comedy, dance, karaoke, jazz, DJs, musicians, orchestras, and choirs",
        subcategories: [
          "comedy-club",
          "dance-club",
          "karaoke",
          "jazz-and-blues",
          "dj-service",
          "musician",
          "musical-band-orchestras-and-symphonies",
          "choir",
        ],
      },
      {
        name: "Production and Tech",
        slug: "production-tech",
        description:
          "Photographers, videographers, and photo booth rentals",
        subcategories: [
          "photographer",
          "videographer",
          "photo-booth-rental",
        ],
      },
      {
        name: "Decor and Rentals",
        slug: "decor-rentals",
        description:
          "Party equipment, balloons, party supplies, and furniture rentals",
        subcategories: [
          "party-equipment-rental",
          "balloon-services",
          "party-supply",
          "furniture-rental",
        ],
      },
      {
        name: "Beauty and Attire",
        slug: "beauty-attire",
        description:
          "Makeup, hair, nails, spas, tanning, lashes, image consulting, and bridal shops",
        subcategories: [
          "makeup-artist",
          "hair-stylist",
          "hair-salon",
          "nail-salon",
          "day-spa",
          "spas",
          "spray-tanning",
          "eyelash-service",
          "image-consultant",
          "bridal-shop",
        ],
      },
      {
        name: "Travel and Lodging",
        slug: "travel-lodging",
        description:
          "Vacation rentals, resorts, cabins, lodges, B&Bs, campgrounds, and travel services",
        subcategories: [
          "holiday-rental-home",
          "resort",
          "cabin",
          "lodge",
          "bed-and-breakfast",
          "cottage",
          "campgrounds",
          "health-retreats",
          "travel-services",
          "passport-and-visa-services",
        ],
      },
      {
        name: "Transportation",
        slug: "transportation",
        description:
          "Limos, coach buses, town cars, jets, party buses, boats, and valet",
        subcategories: [
          "limo-services",
          "coach-bus",
          "town-car-service",
          "private-jet-charters",
          "party-bus-rental",
          "party-bike-rental",
          "boat-charter",
          "bus-rental",
          "valet-service",
        ],
      },
      {
        name: "Kids and Family",
        slug: "kids-family",
        description:
          "Kids parties, face painting, party characters, magicians, clowns, and game trucks",
        subcategories: [
          "kids-recreation-and-party",
          "face-painting",
          "party-character",
          "magician",
          "clown",
          "game-truck-rental",
        ],
      },
      {
        name: "Adult Activities",
        slug: "adult-activities",
        description:
          "Bowling, golf, hot air balloons, stargazing, fishing, and tattoo shops",
        subcategories: [
          "bowling-alley",
          "miniature-golf-course",
          "disc-golf-course",
          "hot-air-balloons-tour",
          "aerial-tours",
          "stargazing-area",
          "observatory-decks",
          "fishing-charter",
          "tattoo-and-piercing",
        ],
      },
      {
        name: "Tours and Events",
        slug: "tours-experiences",
        description:
          "Guided tours, team building, trivia hosts, and silent disco",
        subcategories: [
          "tours",
          "team-building-activity",
          "trivia-host",
          "silent-disco",
        ],
      },
      {
        name: "Food and Drink",
        slug: "food-drink",
        description: "Distilleries, ice suppliers, and bartenders",
        subcategories: ["distillery", "ice-supplier", "bartender"],
      },
      {
        name: "Officiating and Ceremony",
        slug: "officiating-ceremony",
        description:
          "Wedding officiants, rehearsal dinners, and bachelor/bachelorette services",
        subcategories: [
          "officiating-services",
          "rehearsal-dinners",
          "bachelorette-and-bachelor",
        ],
      },
      {
        name: "Gifts and Specialty",
        slug: "gifts-specialty",
        description:
          "Florists, jewelry, gemstones, photography stores, and corporate gifts",
        subcategories: [
          "flower-and-gift-shop",
          "jewelry-store",
          "gemstones",
          "photography-store",
          "corporate-gift-supplier",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Journey Map - keyed by composite key "dimension:node"
// ---------------------------------------------------------------------------

export const JOURNEY_MAP: Record<string, JourneyStep[]> = (() => {
  const map: Record<string, JourneyStep[]> = {};

  for (const dimension of BROWSE_DIMENSIONS) {
    for (const node of dimension.nodes) {
      const key = `${dimension.slug}:${node.slug}`;
      map[key] = [
        {
          dimension: dimension.slug,
          node: node.slug,
          label: node.name,
          subcategories: node.subcategories,
        },
      ];
    }
  }

  return map;
})();

// ---------------------------------------------------------------------------
// Overture Category → Subcategory Slug Map (for ETL lookup)
// ---------------------------------------------------------------------------

export const OVERTURE_CATEGORY_MAP: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const sub of Object.values(SUBCATEGORIES)) {
    map[sub.overtureCategory] = sub.slug;
  }
  return map;
})();

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Look up a subcategory by its slug.
 */
export function getSubcategoryBySlug(slug: string): Subcategory | undefined {
  return SUBCATEGORIES[slug];
}

/**
 * Get all subcategories that belong to a specific journey
 * (a dimension + node combination).
 */
export function getSubcategoriesForJourney(
  dimensionSlug: string,
  nodeSlug: string
): Subcategory[] {
  const key = getJourneyKey(dimensionSlug, nodeSlug);
  const steps = JOURNEY_MAP[key];
  if (!steps || steps.length === 0) return [];

  return steps[0].subcategories
    .map((slug) => SUBCATEGORIES[slug])
    .filter(Boolean);
}

/**
 * Build the composite journey key from a dimension slug and node slug.
 */
export function getJourneyKey(dimension: string, node: string): string {
  return `${dimension}:${node}`;
}
