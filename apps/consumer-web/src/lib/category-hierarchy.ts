/**
 * Planviry - Full Category Hierarchy
 * Derived from "Search seed & Vendor onboarding categories" document
 * 
 * Structure: Top-level groups → Sub-categories → Search tags
 * Used by: Mega menu, Directory sidebar, Search autocomplete, Vendor onboarding
 */

export interface CategorySub {
  slug: string
  label: string
  searchTags?: string[]
}

export interface CategoryGroup {
  slug: string
  label: string
  icon: string // lucide icon name
  vendorCategory: string // maps to VendorCategory type
  subcategories: CategorySub[]
}

export const CATEGORY_HIERARCHY: CategoryGroup[] = [
  {
    slug: 'venues',
    label: 'Venues & Event Spaces',
    icon: 'Building2',
    vendorCategory: 'wedding_venue',
    subcategories: [
      { slug: 'wedding-venues', label: 'Wedding Venues', searchTags: ['Affordable Wedding Venues', 'Small Wedding Venues', 'Wedding Reception Venues', 'Wedding Chapels'] },
      { slug: 'banquet-halls', label: 'Banquet Halls', searchTags: ['Banquet Halls for Rent', 'Cheap Banquet Halls'] },
      { slug: 'outdoor-venues', label: 'Outdoor Venues', searchTags: ['Outdoor Event Space', 'Outdoor Venues & Event Spaces'] },
      { slug: 'corporate-venues', label: 'Corporate Event Venues', searchTags: ['Corporate Event Venues'] },
      { slug: 'party-venues', label: 'Party Venues', searchTags: ['Party Venues', 'Private Party Venues', 'Small Private Party Venues'] },
      { slug: 'small-event-spaces', label: 'Small Event Spaces', searchTags: ['Small Venues & Event Spaces', 'Cheap Venues & Event Spaces'] },
      { slug: 'birthday-venues', label: 'Birthday Party Venues', searchTags: ['Birthday Party Venues', 'Kids Birthday Places', 'Kids Birthday Party'] },
      { slug: 'bridal-shower-venues', label: 'Bridal Shower Venues', searchTags: ['Bridal Shower Venues', 'Bridal Shower'] },
      { slug: 'baby-shower-venues', label: 'Baby Shower Venues', searchTags: ['Baby Shower Venues', 'Baby Shower Decorations'] },
      { slug: 'concert-venues', label: 'Concert Venues', searchTags: ['Concert Venues'] },
      { slug: 'rooftop-venues', label: 'Rooftop Venues', searchTags: ['Rooftop Venue', 'Rooftop Restaurant'] },
      { slug: 'community-centers', label: 'Community Centers', searchTags: ['Community Centers'] },
      { slug: 'quinceanera-venues', label: 'Quinceañera Venues', searchTags: ['Quinceanera Venue'] },
      { slug: 'sweet-16-venues', label: 'Sweet 16 Venues', searchTags: ['Sweet 16 Party Venues'] },
      { slug: 'bar-mitzvah-venues', label: 'Bar/Bat Mitzvah Venues', searchTags: ['Bar Mitzvah Venues'] },
      { slug: 'prom-venues', label: 'Prom Venues', searchTags: ['Prom Venues'] },
    ],
  },
  {
    slug: 'planning',
    label: 'Event Planning',
    icon: 'Sparkles',
    vendorCategory: 'wedding_planner',
    subcategories: [
      { slug: 'event-planners', label: 'Event Planners', searchTags: ['Event Planners', 'Event Planning Companies'] },
      { slug: 'wedding-planners', label: 'Wedding Planners', searchTags: ['Wedding Planner', 'Wedding Planning'] },
      { slug: 'party-planners', label: 'Party Planners', searchTags: ['Party Planner', 'Birthday Party Planner'] },
      { slug: 'corporate-planners', label: 'Corporate Event Planners', searchTags: ['Corporate Events'] },
      { slug: 'full-service-planning', label: 'Full-Service Planning', searchTags: ['Full-service event planning and execution'] },
      { slug: 'officiants', label: 'Officiants', searchTags: ['Officiants', 'Wedding Chapels'] },
      { slug: 'fundraising-events', label: 'Fundraising Events', searchTags: ['Fundraising Events'] },
    ],
  },
  {
    slug: 'catering',
    label: 'Catering & Food',
    icon: 'Utensils',
    vendorCategory: 'catering',
    subcategories: [
      { slug: 'caterers', label: 'Caterers', searchTags: ['Caterers', 'Catering Services'] },
      { slug: 'wedding-catering', label: 'Wedding Catering', searchTags: ['Wedding Catering'] },
      { slug: 'party-catering', label: 'Party Catering', searchTags: ['Party Catering', 'Small Party Catering'] },
      { slug: 'bakeries', label: 'Bakeries & Cakes', searchTags: ['Bakeries & Cakes', 'Wedding Cakes', 'Custom Cookies'] },
      { slug: 'custom-cakes', label: 'Custom Cakes', searchTags: ['Custom Cakes', 'Wedding Cakes'] },
      { slug: 'food-trucks', label: 'Food Trucks', searchTags: ['Food Trucks', 'Pizza Food Truck'] },
      { slug: 'bartending', label: 'Bartending Services', searchTags: ['Bartenders', 'Bartender Services'] },
      { slug: 'wine-spirits', label: 'Wine & Spirits', searchTags: ['Wine & Spirits', 'Wine Bars'] },
    ],
  },
  {
    slug: 'bars-nightlife',
    label: 'Bars & Nightlife',
    icon: 'Wine',
    vendorCategory: 'bar_club',
    subcategories: [
      { slug: 'cocktail-bars', label: 'Cocktail Bars', searchTags: ['Cocktail Bars', 'Craft Cocktails', 'Speakeasy Bars'] },
      { slug: 'wine-bars', label: 'Wine Bars', searchTags: ['Wine Bars'] },
      { slug: 'breweries', label: 'Breweries', searchTags: ['Breweries', 'Brewery Tour', 'Craft Beer', 'Beer Gardens'] },
      { slug: 'beer-gardens', label: 'Beer Gardens', searchTags: ['Beer Gardens'] },
      { slug: 'speakeasy', label: 'Speakeasy Bars', searchTags: ['Speakeasy Bars', 'Speakeasy'] },
      { slug: 'dive-bars', label: 'Dive Bars', searchTags: ['Dive Bars'] },
      { slug: 'karaoke-bars', label: 'Karaoke Bars', searchTags: ['Karaoke Bars', 'Karaoke'] },
      { slug: 'gay-bars', label: 'Gay Bars', searchTags: ['Gay Bars'] },
      { slug: 'happy-hour', label: 'Happy Hour', searchTags: ['Happy Hour', 'Happy Hour Specials', 'Weekend Happy Hour'] },
      { slug: 'bottomless-brunch', label: 'Bottomless Brunch', searchTags: ['Bottomless Mimosas', 'Bottomless Mimosa Brunch', 'Bottomless Brunch'] },
      { slug: 'irish-pubs', label: 'Irish Pubs', searchTags: ['Irish Pub', 'Pubs', 'Pubs and Bars With Food'] },
      { slug: 'late-night', label: 'Late Night', searchTags: ['Late Night Food', 'Open Late'] },
    ],
  },
  {
    slug: 'restaurants',
    label: 'Restaurants & Dining',
    icon: 'UtensilsCrossed',
    vendorCategory: 'catering',
    subcategories: [
      { slug: 'fine-dining', label: 'Fine Dining', searchTags: ['Fine Dining', 'High End Dining', 'Upscale Restaurants'] },
      { slug: 'romantic-dining', label: 'Romantic Dining', searchTags: ['Romantic Restaurant', 'Romantic Dinner', 'Romantic Anniversary Dinner'] },
      { slug: 'steakhouses', label: 'Steakhouses', searchTags: ['Steakhouses', 'Steak House', 'Steak and Seafood'] },
      { slug: 'private-dining', label: 'Private Dining Rooms', searchTags: ['Restaurants With Private Rooms', 'Private Dining Room', 'Private Room Dining'] },
      { slug: 'rehearsal-dinner', label: 'Rehearsal Dinner', searchTags: ['Rehearsal Dinner', 'Wedding Rehearsal Dinner'] },
      { slug: 'brunch', label: 'Brunch', searchTags: ['Brunch', 'Sunday Brunch', 'Brunch Buffet'] },
      { slug: 'outdoor-dining', label: 'Outdoor Dining', searchTags: ['Outdoor Dining', 'Patio Dining', 'Rooftop Restaurant'] },
      { slug: 'group-dining', label: 'Group Dining', searchTags: ['Group Dining', 'Restaurants for Large Groups', 'Large Group Dining'] },
      { slug: 'farm-to-table', label: 'Farm to Table', searchTags: ['Farm to Table Restaurants'] },
      { slug: 'gastropubs', label: 'Gastropubs', searchTags: ['Gastropubs'] },
      { slug: 'new-american', label: 'New American', searchTags: ['New American Restaurant', 'American Bistro'] },
      { slug: 'italian', label: 'Italian', searchTags: ['Italian', 'Pasta'] },
      { slug: 'seafood', label: 'Seafood', searchTags: ['Seafood', 'Oysters', 'Steamed Crabs'] },
      { slug: 'french', label: 'French', searchTags: ['French Restaurant'] },
      { slug: 'mediterranean', label: 'Mediterranean', searchTags: ['Mediterranean Food'] },
      { slug: 'indian', label: 'Indian', searchTags: ['Indian Food'] },
      { slug: 'vegan-vegetarian', label: 'Vegan & Vegetarian', searchTags: ['Vegan Restaurants', 'Vegetarian Food', 'Gluten Free Restaurants'] },
    ],
  },
  {
    slug: 'djs-entertainment',
    label: 'DJs & Entertainment',
    icon: 'Music',
    vendorCategory: 'wedding_dj',
    subcategories: [
      { slug: 'wedding-djs', label: 'Wedding DJs', searchTags: ['Wedding DJ', 'Wedding Dj and Mc'] },
      { slug: 'party-djs', label: 'Party DJs', searchTags: ['DJs Parties', 'Party Entertainers'] },
      { slug: 'latin-djs', label: 'Latin Music DJs', searchTags: ['DJs Latin Music'] },
      { slug: 'prom-djs', label: 'Prom & School Dance DJs', searchTags: ['DJs Prom & School Dances'] },
      { slug: 'karaoke-djs', label: 'Karaoke DJs', searchTags: ['Karaoke Dj', 'Karaoke Rental'] },
      { slug: 'dj-lessons', label: 'DJ Lessons', searchTags: ['Dj Lessons'] },
      { slug: 'live-bands', label: 'Live Bands', searchTags: ['Wedding Band', 'Musicians'] },
      { slug: 'magicians', label: 'Magicians', searchTags: ['Magicians'] },
      { slug: 'party-characters', label: 'Party Characters', searchTags: ['Party Characters'] },
      { slug: 'comedyclubs', label: 'Comedy Clubs', searchTags: ['Comedy Clubs'] },
      { slug: 'jazz-clubs', label: 'Jazz Clubs', searchTags: ['Jazz Club'] },
      { slug: 'trivia-night', label: 'Trivia Night', searchTags: ['Trivia Night'] },
      { slug: 'open-mic', label: 'Open Mic', searchTags: ['Open Mic'] },
    ],
  },
  {
    slug: 'photography-video',
    label: 'Photography & Video',
    icon: 'Camera',
    vendorCategory: 'photography',
    subcategories: [
      { slug: 'wedding-photographers', label: 'Wedding Photographers', searchTags: ['Wedding Photographer', 'Affordable Wedding Photographer'] },
      { slug: 'affordable-photographers', label: 'Affordable Photographers', searchTags: ['Affordable Photographers'] },
      { slug: 'wedding-videographers', label: 'Wedding Videographers', searchTags: ['Wedding Videographer', 'Affordable Wedding Videographer'] },
      { slug: 'photo-booths', label: 'Photo Booths', searchTags: ['Photo Booth Rentals'] },
      { slug: 'camera-rental', label: 'Camera Rental', searchTags: ['Camera Rental'] },
    ],
  },
  {
    slug: 'floral-decor',
    label: 'Floral & Decor',
    icon: 'Flower2',
    vendorCategory: 'florist',
    subcategories: [
      { slug: 'florists', label: 'Florists', searchTags: ['Florists', 'Flower Delivery'] },
      { slug: 'floral-designers', label: 'Floral Designers', searchTags: ['Floral Designers'] },
      { slug: 'party-decorations', label: 'Party Decorations', searchTags: ['Party Decorations'] },
      { slug: 'balloon-services', label: 'Balloon Services', searchTags: ['Balloon Arch', 'Balloon Artist', 'Balloons'] },
      { slug: 'decor-rentals', label: 'Decor & Rentals', searchTags: ['Decor & Rentals', 'Props'] },
      { slug: 'party-supplies', label: 'Party Supplies', searchTags: ['Party Supplies', 'Party Favors'] },
      { slug: 'party-favors', label: 'Party Favors', searchTags: ['Party Favors'] },
      { slug: 'stationery', label: 'Stationery & Invitations', searchTags: ['Stationery', 'Invitations & Print'] },
      { slug: 'sign-company', label: 'Sign Company', searchTags: ['Sign Company'] },
    ],
  },
  {
    slug: 'beauty-wellness',
    label: 'Beauty & Wellness',
    icon: 'Scissors',
    vendorCategory: 'makeup_hair',
    subcategories: [
      { slug: 'hair-makeup', label: 'Hair & Makeup', searchTags: ['Hair & Makeup', 'Makeup Artists'] },
      { slug: 'bridal-hair-makeup', label: 'Bridal Hair & Makeup', searchTags: ['Makeup Artists'] },
      { slug: 'sewing-alterations', label: 'Sewing & Alterations', searchTags: ['Sewing & Alterations'] },
      { slug: 'wellness-spa', label: 'Wellness & Spa', searchTags: ['Wellness & Spa'] },
    ],
  },
  {
    slug: 'attire-jewelry',
    label: 'Attire & Jewelry',
    icon: 'Gem',
    vendorCategory: 'dress_attire',
    subcategories: [
      { slug: 'dress-attire', label: 'Dress & Attire', searchTags: ['Dress & Attire'] },
      { slug: 'jewelers', label: 'Jewelers', searchTags: ['Jewelers'] },
    ],
  },
  {
    slug: 'transportation',
    label: 'Transportation',
    icon: 'Bus',
    vendorCategory: 'transportation',
    subcategories: [
      { slug: 'transportation-services', label: 'Transportation Services', searchTags: ['Transportation Services'] },
      { slug: 'party-bus', label: 'Party Bus Rentals', searchTags: ['Party Bus Rentals'] },
    ],
  },
  {
    slug: 'equipment-rentals',
    label: 'Equipment & Rentals',
    icon: 'Package',
    vendorCategory: 'rentals',
    subcategories: [
      { slug: 'party-equipment', label: 'Party Equipment Rentals', searchTags: ['Party Equipment Rentals'] },
      { slug: 'tent-canopy', label: 'Tent & Canopy Rental', searchTags: ['Canopy & Tent Rental'] },
      { slug: 'furniture-rental', label: 'Furniture Rental', searchTags: ['Furniture Rental'] },
      { slug: 'linen-rental', label: 'Linen Rental', searchTags: ['Linen Rental'] },
      { slug: 'dinnerware-rental', label: 'Dinnerware Rental', searchTags: ['Dinnerware Rental'] },
      { slug: 'chair-table-rental', label: 'Chair & Table Rentals', searchTags: ['Chair and Table Rentals', 'Chair Rentals', 'Table and Chair Rentals'] },
      { slug: 'dance-floor', label: 'Dance Floor Rental', searchTags: ['Dance Floor Rental'] },
      { slug: 'lighting-av', label: 'Lighting & AV', searchTags: ['Lighting & AV', 'Lighting Rental', 'Audio Visual'] },
      { slug: 'sound-system', label: 'Sound System Rental', searchTags: ['Sound System Rental', 'Sound System', 'Speaker Rental'] },
      { slug: 'dj-equipment', label: 'DJ Equipment Rental', searchTags: ['Dj Equipment Rental', 'Dj Equipment'] },
      { slug: 'av-production', label: 'AV & Production Rentals', searchTags: ['Audio Video Installation', 'Production Rentals', 'High Fidelity Audio Equipment'] },
      { slug: 'projector', label: 'Projector & Screen Rental', searchTags: ['Projector Repair'] },
      { slug: 'stage-rental', label: 'Stage Rentals', searchTags: ['Stage Rentals'] },
      { slug: 'bounce-house', label: 'Bounce House Rentals', searchTags: ['Bounce House Rental', 'Bounce House Rentals'] },
      { slug: 'mechanical-bull', label: 'Mechanical Bull', searchTags: ['Mechanical Bull'] },
      { slug: 'chocolate-fountain', label: 'Chocolate Fountain', searchTags: ['Chocolate Fountain'] },
      { slug: 'game-truck', label: 'Game Truck Rental', searchTags: ['Game Truck Rental'] },
      { slug: 'pony-rides', label: 'Pony Rides', searchTags: ['Pony Rides'] },
      { slug: 'face-painting', label: 'Face Painting', searchTags: ['Face Painting'] },
      { slug: 'outdoor-movies', label: 'Outdoor Movies', searchTags: ['Outdoor Movies'] },
    ],
  },
  {
    slug: 'hotels-lodging',
    label: 'Hotels & Lodging',
    icon: 'Hotel',
    vendorCategory: 'hotel_accommodations',
    subcategories: [
      { slug: 'hotels', label: 'Hotels', searchTags: ['Hotels & Lodging', 'Hotels'] },
      { slug: 'honeymoon-travel', label: 'Honeymoon & Travel', searchTags: ['Honeymoon & Travel'] },
    ],
  },
]

/** Location filters from the seed document */
export const LOCATION_FILTERS = {
  nearbyCities: [
    'Appleton, WI', 'Arlington Heights, IL', 'Brookfield, WI', 'Elgin, IL',
    'Evanston, IL', 'Fond Du Lac, WI', 'Green Bay, WI', 'Janesville, WI',
    'Kenosha, WI', 'Lake County, IL', 'Northbrook, IL', 'Oshkosh, WI',
    'Outagamie County, WI', 'Racine, WI', 'Schaumburg, IL', 'Sheboygan, WI',
    'Waukesha, WI', 'Wausau, WI', 'West Bend, WI', 'West Milwaukee, WI',
  ],
  neighborhoods: [
    'Avenues West', 'Brewer\'s Hill', 'Downtown', 'Historic Third Ward',
    'Jones Island', 'Lower East Side', 'Midtown', 'Mitchell Park',
    'Sherman Park', 'Walker\'s Point',
  ],
  nearLandmarks: [
    'Holler Park', 'South Shore Park', 'Basilica of St. Josaphat',
    'Kosciuszko Park', 'Grant Market', 'Milwaukee Brewing Company',
    'Harley-Davidson Museum', 'Historic Third Ward',
    'Henry Maier Festival Park', 'Milwaukee Public Market',
  ],
}

/** Amenity / feature filters from the seed document */
export const AMENITY_FILTERS = {
  eventTypes: [
    'Wedding', 'Party', 'Class Reunion', 'Fundraiser', 'Prom / School Dance', 'Silent Disco',
  ],
  features: [
    'Outdoor Seating', 'Good for Lunch', 'Good for Kids', 'Good for Groups',
    'Dogs Allowed', 'Full Bar', 'Good for Brunch', 'Takes Reservations',
    'Good for Breakfast', 'Good for Happy Hour', 'Good for Dessert', 'Good for Late Night',
  ],
  amenities: [
    'Accepts Credit Cards', 'Accepts Apple Pay', 'Wheelchair Accessible',
    'Free Wi-Fi', 'Has TV', 'Coat Check', 'Gender Neutral Restrooms',
    'Street Parking', 'Garage Parking', 'Valet Parking', 'Private Lot Parking', 'Validated Parking',
  ],
  bookingOptions: [
    'Online Booking', 'Accepts Online Appointments', 'Request a Quote',
    'Service Booking Enabled', 'By Appointment Only',
  ],
  musicTypes: [
    'Music: DJ', 'Music: Live', 'Music: Karaoke', 'Music: Jukebox',
  ],
  other: [
    'Open 24 Hours', 'Hot and New', 'Offers Military Discount',
    'Smoking: No', 'Smoking: Outdoor Area Only',
  ],
}

/** Get all search tags flattened for autocomplete */
export function getAllSearchTags(): string[] {
  const tags = new Set<string>()
  CATEGORY_HIERARCHY.forEach(group => {
    group.subcategories.forEach(sub => {
      sub.searchTags?.forEach(tag => tags.add(tag))
    })
  })
  return Array.from(tags).sort()
}

/** Find which category group a vendor category belongs to */
export function findCategoryGroup(vendorCategory: string): CategoryGroup | undefined {
  return CATEGORY_HIERARCHY.find(g => g.vendorCategory === vendorCategory)
}

/** Get subcategory count for a group */
export function getSubcategoryCount(groupSlug: string): number {
  const group = CATEGORY_HIERARCHY.find(g => g.slug === groupSlug)
  return group?.subcategories.length || 0
}
