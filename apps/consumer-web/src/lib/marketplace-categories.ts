/**
 * Planviry Marketplace Categories - 10 Groups, 3 Levels Deep
 *
 * Level 1: Group (top-level navigation)
 * Level 2: Category (browseable collection)
 * Level 3: Subcategory (specific filter)
 *
 * All text and buttons must be BLACK - no orange/ember on labels.
 */

export interface SubCategory {
  slug: string;
  name: string;
  filter_schema_key: string;
}

export interface CategoryLevel2 {
  slug: string;
  name: string;
  filter_schema_key: string;
  subcategories: SubCategory[];
}

export interface CategoryGroup {
  slug: string;
  name: string;
  icon: string;
  sort_order: number;
  categories: CategoryLevel2[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  // ─── 1. VENUES & SPACES ────────────────────────────────────────────────────
  {
    slug: 'venues',
    name: 'Venues & Spaces',
    icon: 'building-2',
    sort_order: 1,
    categories: [
      {
        slug: 'wedding-venues',
        name: 'Wedding Venues',
        filter_schema_key: 'venues_wedding',
        subcategories: [
          { slug: 'barn-wedding-venues', name: 'Barn Venues', filter_schema_key: 'venues_wedding_barn' },
          { slug: 'rustic-wedding-venues', name: 'Rustic Venues', filter_schema_key: 'venues_wedding_rustic' },
          { slug: 'modern-wedding-venues', name: 'Modern Venues', filter_schema_key: 'venues_wedding_modern' },
          { slug: 'outdoor-wedding-venues', name: 'Outdoor Wedding', filter_schema_key: 'venues_wedding_outdoor' },
          { slug: 'ballroom-wedding-venues', name: 'Ballroom Venues', filter_schema_key: 'venues_wedding_ballroom' },
          { slug: 'historic-wedding-venues', name: 'Historic Venues', filter_schema_key: 'venues_wedding_historic' },
        ],
      },
      {
        slug: 'event-venues',
        name: 'Event Venues',
        filter_schema_key: 'venues_event',
        subcategories: [
          { slug: 'banquet-halls', name: 'Banquet Halls', filter_schema_key: 'venues_banquet' },
          { slug: 'corporate-event-venues', name: 'Corporate Venues', filter_schema_key: 'venues_corporate' },
          { slug: 'party-venues', name: 'Party Venues', filter_schema_key: 'venues_party' },
          { slug: 'small-event-spaces', name: 'Small Event Spaces', filter_schema_key: 'venues_small' },
          { slug: 'concert-venues', name: 'Concert Venues', filter_schema_key: 'venues_concert' },
          { slug: 'rooftop-venues', name: 'Rooftop Venues', filter_schema_key: 'venues_rooftop' },
        ],
      },
      {
        slug: 'celebration-venues',
        name: 'Celebration Venues',
        filter_schema_key: 'venues_celebration',
        subcategories: [
          { slug: 'birthday-party-venues', name: 'Birthday Party', filter_schema_key: 'venues_birthday' },
          { slug: 'quinceanera-venues', name: 'Quinceañera', filter_schema_key: 'venues_quinceanera' },
          { slug: 'sweet-16-venues', name: 'Sweet 16', filter_schema_key: 'venues_sweet16' },
          { slug: 'bar-bat-mitzvah-venues', name: 'Bar/Bat Mitzvah', filter_schema_key: 'venues_mitzvah' },
          { slug: 'prom-venues', name: 'Prom', filter_schema_key: 'venues_prom' },
          { slug: 'baby-shower-venues', name: 'Baby Shower', filter_schema_key: 'venues_baby_shower' },
          { slug: 'bridal-shower-venues', name: 'Bridal Shower', filter_schema_key: 'venues_bridal_shower' },
        ],
      },
      {
        slug: 'community-venues',
        name: 'Community Venues',
        filter_schema_key: 'venues_community',
        subcategories: [
          { slug: 'community-centers', name: 'Community Centers', filter_schema_key: 'venues_community_center' },
          { slug: 'outdoor-spaces', name: 'Outdoor Spaces', filter_schema_key: 'venues_outdoor' },
          { slug: 'holiday-party-venues', name: 'Holiday Party', filter_schema_key: 'venues_holiday' },
        ],
      },
    ],
  },

  // ─── 2. PLANNING & COORDINATION ────────────────────────────────────────────
  {
    slug: 'planning',
    name: 'Planning & Coordination',
    icon: 'clipboard-list',
    sort_order: 2,
    categories: [
      {
        slug: 'event-planners',
        name: 'Event Planners',
        filter_schema_key: 'planning_event',
        subcategories: [
          { slug: 'full-service-planning', name: 'Full-Service Planning', filter_schema_key: 'planning_full' },
          { slug: 'partial-planning', name: 'Partial Planning', filter_schema_key: 'planning_partial' },
          { slug: 'day-of-coordination', name: 'Day-Of Coordination', filter_schema_key: 'planning_day_of' },
        ],
      },
      {
        slug: 'wedding-planners',
        name: 'Wedding Planners',
        filter_schema_key: 'planning_wedding',
        subcategories: [
          { slug: 'luxury-wedding-planners', name: 'Luxury Wedding Planners', filter_schema_key: 'planning_wedding_luxury' },
          { slug: 'affordable-wedding-planners', name: 'Affordable Wedding Planners', filter_schema_key: 'planning_wedding_affordable' },
          { slug: 'destination-wedding-planners', name: 'Destination Wedding', filter_schema_key: 'planning_wedding_destination' },
        ],
      },
      {
        slug: 'officiants',
        name: 'Officiants',
        filter_schema_key: 'planning_officiant',
        subcategories: [
          { slug: 'religious-officiants', name: 'Religious Officiants', filter_schema_key: 'planning_officiant_religious' },
          { slug: 'non-religious-officiants', name: 'Non-Religious Officiants', filter_schema_key: 'planning_officiant_nonreligious' },
        ],
      },
    ],
  },

  // ─── 3. CATERING & FOOD ────────────────────────────────────────────────────
  {
    slug: 'catering',
    name: 'Catering & Food',
    icon: 'chef-hat',
    sort_order: 3,
    categories: [
      {
        slug: 'caterers',
        name: 'Caterers',
        filter_schema_key: 'food_catering',
        subcategories: [
          { slug: 'wedding-catering', name: 'Wedding Catering', filter_schema_key: 'food_catering_wedding' },
          { slug: 'party-catering', name: 'Party Catering', filter_schema_key: 'food_catering_party' },
          { slug: 'corporate-catering', name: 'Corporate Catering', filter_schema_key: 'food_catering_corporate' },
        ],
      },
      {
        slug: 'bakeries-cakes',
        name: 'Bakeries & Cakes',
        filter_schema_key: 'food_bakery',
        subcategories: [
          { slug: 'custom-cakes', name: 'Custom Cakes', filter_schema_key: 'food_cakes' },
          { slug: 'wedding-cakes', name: 'Wedding Cakes', filter_schema_key: 'food_cakes_wedding' },
          { slug: 'cupcakes-desserts', name: 'Cupcakes & Desserts', filter_schema_key: 'food_cupcakes' },
        ],
      },
      {
        slug: 'specialty-food',
        name: 'Specialty Food',
        filter_schema_key: 'food_specialty',
        subcategories: [
          { slug: 'food-trucks', name: 'Food Trucks', filter_schema_key: 'food_trucks' },
          { slug: 'bartending-services', name: 'Bartending Services', filter_schema_key: 'food_bar' },
          { slug: 'wine-spirits', name: 'Wine & Spirits', filter_schema_key: 'food_wine' },
          { slug: 'chocolate-fountain', name: 'Chocolate Fountain', filter_schema_key: 'food_chocolate' },
        ],
      },
    ],
  },

  // ─── 4. BARS & NIGHTLIFE ──────────────────────────────────────────────────
  {
    slug: 'bars',
    name: 'Bars & Nightlife',
    icon: 'wine',
    sort_order: 4,
    categories: [
      {
        slug: 'bars',
        name: 'Bars',
        filter_schema_key: 'bars_general',
        subcategories: [
          { slug: 'cocktail-bars', name: 'Cocktail Bars', filter_schema_key: 'bars_cocktail' },
          { slug: 'wine-bars', name: 'Wine Bars', filter_schema_key: 'bars_wine' },
          { slug: 'dive-bars', name: 'Dive Bars', filter_schema_key: 'bars_dive' },
          { slug: 'speakeasy-bars', name: 'Speakeasy Bars', filter_schema_key: 'bars_speakeasy' },
          { slug: 'karaoke-bars', name: 'Karaoke Bars', filter_schema_key: 'bars_karaoke' },
          { slug: 'gay-bars', name: 'Gay Bars', filter_schema_key: 'bars_gay' },
        ],
      },
      {
        slug: 'breweries-beer',
        name: 'Breweries & Beer',
        filter_schema_key: 'bars_brewery',
        subcategories: [
          { slug: 'breweries', name: 'Breweries', filter_schema_key: 'bars_brewery' },
          { slug: 'beer-gardens', name: 'Beer Gardens', filter_schema_key: 'bars_beer_garden' },
          { slug: 'craft-beer', name: 'Craft Beer', filter_schema_key: 'bars_craft' },
        ],
      },
      {
        slug: 'nightlife-experiences',
        name: 'Nightlife Events',
        filter_schema_key: 'bars_nightlife',
        subcategories: [
          { slug: 'happy-hour', name: 'Happy Hour', filter_schema_key: 'bars_happy_hour' },
          { slug: 'bottomless-brunch', name: 'Bottomless Brunch', filter_schema_key: 'bars_bottomless_brunch' },
          { slug: 'late-night', name: 'Late Night', filter_schema_key: 'bars_late_night' },
          { slug: 'irish-pubs', name: 'Irish Pubs', filter_schema_key: 'bars_irish' },
        ],
      },
    ],
  },

  // ─── 5. DINING & RESTAURANTS ──────────────────────────────────────────────
  {
    slug: 'dining',
    name: 'Dining & Restaurants',
    icon: 'utensils',
    sort_order: 5,
    categories: [
      {
        slug: 'fine-dining',
        name: 'Fine Dining',
        filter_schema_key: 'restaurant_fine',
        subcategories: [
          { slug: 'steakhouses', name: 'Steakhouses', filter_schema_key: 'restaurant_steakhouse' },
          { slug: 'romantic-dining', name: 'Romantic Dining', filter_schema_key: 'restaurant_romantic' },
          { slug: 'private-dining', name: 'Private Dining Rooms', filter_schema_key: 'restaurant_private' },
        ],
      },
      {
        slug: 'casual-dining',
        name: 'Casual Dining',
        filter_schema_key: 'restaurant_casual',
        subcategories: [
          { slug: 'gastropubs', name: 'Gastropubs', filter_schema_key: 'restaurant_gastropub' },
          { slug: 'brunch', name: 'Brunch', filter_schema_key: 'restaurant_brunch' },
          { slug: 'outdoor-dining', name: 'Outdoor Dining', filter_schema_key: 'restaurant_outdoor_dining' },
          { slug: 'group-dining', name: 'Group Dining', filter_schema_key: 'restaurant_group_dining' },
          { slug: 'farm-to-table', name: 'Farm to Table', filter_schema_key: 'restaurant_farm_to_table' },
        ],
      },
      {
        slug: 'cuisine-types',
        name: 'Cuisine',
        filter_schema_key: 'restaurant_cuisine',
        subcategories: [
          { slug: 'italian', name: 'Italian', filter_schema_key: 'restaurant_italian' },
          { slug: 'new-american', name: 'New American', filter_schema_key: 'restaurant_new_american' },
          { slug: 'seafood', name: 'Seafood', filter_schema_key: 'restaurant_seafood' },
          { slug: 'french', name: 'French', filter_schema_key: 'restaurant_french' },
          { slug: 'mediterranean', name: 'Mediterranean', filter_schema_key: 'restaurant_mediterranean' },
          { slug: 'indian', name: 'Indian', filter_schema_key: 'restaurant_indian' },
          { slug: 'vegan-vegetarian', name: 'Vegan & Vegetarian', filter_schema_key: 'restaurant_vegan_vegetarian' },
        ],
      },
    ],
  },

  // ─── 6. ENTERTAINMENT & DJS ───────────────────────────────────────────────
  {
    slug: 'entertainment',
    name: 'Entertainment & DJs',
    icon: 'music',
    sort_order: 6,
    categories: [
      {
        slug: 'djs',
        name: 'DJs',
        filter_schema_key: 'entertainment_dj',
        subcategories: [
          { slug: 'wedding-djs', name: 'Wedding DJs', filter_schema_key: 'entertainment_dj_wedding' },
          { slug: 'party-djs', name: 'Party DJs', filter_schema_key: 'entertainment_dj_party' },
          { slug: 'latin-music-djs', name: 'Latin Music DJs', filter_schema_key: 'entertainment_dj_latin' },
          { slug: 'prom-school-dance-djs', name: 'Prom & School Dance', filter_schema_key: 'entertainment_dj_prom' },
          { slug: 'karaoke-djs', name: 'Karaoke DJs', filter_schema_key: 'entertainment_dj_karaoke' },
          { slug: 'dj-lessons', name: 'DJ Lessons', filter_schema_key: 'entertainment_dj_lessons' },
        ],
      },
      {
        slug: 'live-performers',
        name: 'Live Performers',
        filter_schema_key: 'entertainment_live',
        subcategories: [
          { slug: 'live-bands', name: 'Live Bands', filter_schema_key: 'entertainment_band' },
          { slug: 'magicians', name: 'Magicians', filter_schema_key: 'entertainment_magician' },
          { slug: 'party-characters', name: 'Party Characters', filter_schema_key: 'entertainment_characters' },
          { slug: 'comedy-clubs', name: 'Comedy Clubs', filter_schema_key: 'entertainment_comedy' },
          { slug: 'jazz-clubs', name: 'Jazz Clubs', filter_schema_key: 'entertainment_jazz' },
        ],
      },
      {
        slug: 'interactive-entertainment',
        name: 'Interactive Entertainment',
        filter_schema_key: 'entertainment_interactive',
        subcategories: [
          { slug: 'trivia-night', name: 'Trivia Night', filter_schema_key: 'entertainment_trivia' },
          { slug: 'open-mic', name: 'Open Mic', filter_schema_key: 'entertainment_openmic' },
          { slug: 'karaoke', name: 'Karaoke', filter_schema_key: 'entertainment_karaoke_venue' },
        ],
      },
    ],
  },

  // ─── 7. PHOTOGRAPHY & VIDEO ───────────────────────────────────────────────
  {
    slug: 'photography',
    name: 'Photography & Video',
    icon: 'camera',
    sort_order: 7,
    categories: [
      {
        slug: 'photographers',
        name: 'Photographers',
        filter_schema_key: 'planning_photo',
        subcategories: [
          { slug: 'wedding-photographers', name: 'Wedding Photographers', filter_schema_key: 'planning_photo_wedding' },
          { slug: 'affordable-photographers', name: 'Affordable Photographers', filter_schema_key: 'planning_photo_affordable' },
          { slug: 'event-photographers', name: 'Event Photographers', filter_schema_key: 'planning_photo_event' },
        ],
      },
      {
        slug: 'videographers',
        name: 'Videographers',
        filter_schema_key: 'planning_video',
        subcategories: [
          { slug: 'wedding-videographers', name: 'Wedding Videographers', filter_schema_key: 'planning_video_wedding' },
          { slug: 'event-videographers', name: 'Event Videographers', filter_schema_key: 'planning_video_event' },
        ],
      },
      {
        slug: 'photo-booths',
        name: 'Photo Booths',
        filter_schema_key: 'entertainment_photobooth',
        subcategories: [
          { slug: 'open-air-photo-booths', name: 'Open-Air Booths', filter_schema_key: 'entertainment_photobooth_open' },
          { slug: 'enclosed-photo-booths', name: 'Enclosed Booths', filter_schema_key: 'entertainment_photobooth_enclosed' },
          { slug: '360-photo-booths', name: '360 Booths', filter_schema_key: 'entertainment_photobooth_360' },
        ],
      },
    ],
  },

  // ─── 8. DÉCOR & RENTALS ──────────────────────────────────────────────────
  {
    slug: 'decor-rentals',
    name: 'Décor & Rentals',
    icon: 'flower-2',
    sort_order: 8,
    categories: [
      {
        slug: 'floral',
        name: 'Floral & Design',
        filter_schema_key: 'planning_floral',
        subcategories: [
          { slug: 'florists', name: 'Florists', filter_schema_key: 'planning_floral' },
          { slug: 'floral-designers', name: 'Floral Designers', filter_schema_key: 'planning_floral_designer' },
          { slug: 'party-decorations', name: 'Party Decorations', filter_schema_key: 'decor_party' },
          { slug: 'balloon-services', name: 'Balloon Services', filter_schema_key: 'decor_balloons' },
        ],
      },
      {
        slug: 'party-supplies',
        name: 'Party Supplies',
        filter_schema_key: 'decor_supplies',
        subcategories: [
          { slug: 'decor-rentals', name: 'Decor & Rentals', filter_schema_key: 'decor_rentals' },
          { slug: 'party-supplies', name: 'Party Supplies', filter_schema_key: 'decor_supplies' },
          { slug: 'party-favors', name: 'Party Favors', filter_schema_key: 'decor_favors' },
          { slug: 'stationery-invitations', name: 'Stationery & Invitations', filter_schema_key: 'decor_stationery' },
          { slug: 'sign-company', name: 'Sign Company', filter_schema_key: 'decor_signs' },
        ],
      },
      {
        slug: 'equipment-rentals',
        name: 'Equipment Rentals',
        filter_schema_key: 'rentals_general',
        subcategories: [
          { slug: 'tent-canopy-rental', name: 'Tent & Canopy', filter_schema_key: 'rentals_tent' },
          { slug: 'furniture-rental', name: 'Furniture Rental', filter_schema_key: 'rentals_furniture' },
          { slug: 'linen-rental', name: 'Linen Rental', filter_schema_key: 'rentals_linen' },
          { slug: 'dinnerware-rental', name: 'Dinnerware Rental', filter_schema_key: 'rentals_dinnerware' },
          { slug: 'chair-table-rentals', name: 'Chair & Table', filter_schema_key: 'rentals_chairs' },
          { slug: 'dance-floor-rental', name: 'Dance Floor', filter_schema_key: 'rentals_dance_floor' },
          { slug: 'lighting-av', name: 'Lighting & AV', filter_schema_key: 'rentals_lighting_av' },
          { slug: 'sound-system-rental', name: 'Sound System', filter_schema_key: 'rentals_sound' },
          { slug: 'dj-equipment-rental', name: 'DJ Equipment', filter_schema_key: 'rentals_dj_equipment' },
          { slug: 'av-production-rentals', name: 'AV & Production', filter_schema_key: 'rentals_av_production' },
          { slug: 'bounce-house-rentals', name: 'Bounce Houses', filter_schema_key: 'rentals_bounce' },
          { slug: 'mechanical-bull', name: 'Mechanical Bull', filter_schema_key: 'rentals_mechanical_bull' },
          { slug: 'game-truck-rental', name: 'Game Truck', filter_schema_key: 'rentals_game_truck' },
          { slug: 'pony-rides', name: 'Pony Rides', filter_schema_key: 'rentals_pony' },
          { slug: 'face-painting', name: 'Face Painting', filter_schema_key: 'rentals_face_paint' },
          { slug: 'outdoor-movies', name: 'Outdoor Movies', filter_schema_key: 'rentals_outdoor_movies' },
        ],
      },
    ],
  },

  // ─── 9. BEAUTY & ATTIRE ───────────────────────────────────────────────────
  {
    slug: 'beauty-attire',
    name: 'Beauty & Attire',
    icon: 'sparkles',
    sort_order: 9,
    categories: [
      {
        slug: 'hair-makeup',
        name: 'Hair & Makeup',
        filter_schema_key: 'beauty_hair_makeup',
        subcategories: [
          { slug: 'bridal-hair-makeup', name: 'Bridal Hair & Makeup', filter_schema_key: 'beauty_bridal' },
          { slug: 'special-event-makeup', name: 'Special Event Makeup', filter_schema_key: 'beauty_special_event' },
          { slug: 'group-booking', name: 'Group Booking', filter_schema_key: 'beauty_group' },
        ],
      },
      {
        slug: 'wellness-spa',
        name: 'Wellness & Spa',
        filter_schema_key: 'beauty_spa',
        subcategories: [
          { slug: 'day-spas', name: 'Day Spas', filter_schema_key: 'beauty_spa_day' },
          { slug: 'massage', name: 'Massage', filter_schema_key: 'beauty_spa_massage' },
        ],
      },
      {
        slug: 'attire-jewelry',
        name: 'Attire & Jewelry',
        filter_schema_key: 'attire_general',
        subcategories: [
          { slug: 'dress-attire', name: 'Dress & Attire', filter_schema_key: 'attire_dress' },
          { slug: 'jewelers', name: 'Jewelers', filter_schema_key: 'attire_jewelry' },
          { slug: 'sewing-alterations', name: 'Sewing & Alterations', filter_schema_key: 'beauty_alterations' },
        ],
      },
    ],
  },

  // ─── 10. TRANSPORT & LODGING ──────────────────────────────────────────────
  {
    slug: 'transport-lodging',
    name: 'Transport & Lodging',
    icon: 'car',
    sort_order: 10,
    categories: [
      {
        slug: 'transportation',
        name: 'Transportation',
        filter_schema_key: 'transport_general',
        subcategories: [
          { slug: 'party-bus-rentals', name: 'Party Bus Rentals', filter_schema_key: 'transport_party_bus' },
          { slug: 'limo-services', name: 'Limo Services', filter_schema_key: 'transport_limo' },
          { slug: 'shuttle-services', name: 'Shuttle Services', filter_schema_key: 'transport_shuttle' },
        ],
      },
      {
        slug: 'hotels-lodging',
        name: 'Hotels & Lodging',
        filter_schema_key: 'lodging_hotel',
        subcategories: [
          { slug: 'hotels', name: 'Hotels', filter_schema_key: 'lodging_hotel' },
          { slug: 'lodges', name: 'Lodges', filter_schema_key: 'lodging_lodge' },
          { slug: 'short-term-rentals', name: 'Short-Term Rentals', filter_schema_key: 'lodging_str' },
          { slug: 'retreats', name: 'Retreats', filter_schema_key: 'lodging_retreat' },
        ],
      },
      {
        slug: 'travel',
        name: 'Travel',
        filter_schema_key: 'travel_agency',
        subcategories: [
          { slug: 'travel-agencies', name: 'Travel Agencies', filter_schema_key: 'travel_agency' },
          { slug: 'honeymoon-travel', name: 'Honeymoon Travel', filter_schema_key: 'travel_honeymoon' },
        ],
      },
    ],
  },
];

/** Lookup: filter_schema_key → display name */
export const FILTER_KEY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_GROUPS.flatMap(g =>
    g.categories.flatMap(c =>
      [
        [c.filter_schema_key, c.name],
        ...c.subcategories.map(s => [s.filter_schema_key, s.name] as [string, string])
      ]
    )
  ).filter(([k]) => k != null)
);

/** Lookup: filter_schema_key → { group, category, subcategory } */
export const FILTER_KEY_TO_GROUP: Record<string, {
  groupSlug: string;
  groupName: string;
  categorySlug: string;
  categoryName: string;
  subcategorySlug?: string;
  subcategoryName?: string;
}> = Object.fromEntries(
  CATEGORY_GROUPS.flatMap(g =>
    g.categories.flatMap(c =>
      [
        [c.filter_schema_key, {
          groupSlug: g.slug, groupName: g.name,
          categorySlug: c.slug, categoryName: c.name,
        }],
        ...c.subcategories.map(s => [s.filter_schema_key, {
          groupSlug: g.slug, groupName: g.name,
          categorySlug: c.slug, categoryName: c.name,
          subcategorySlug: s.slug, subcategoryName: s.name,
        }] as [string, object])
      ]
    )
  ).filter(([k]) => k != null)
);
