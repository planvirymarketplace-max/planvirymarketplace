/**
 * Planviry - Category-Specific Filter Definitions
 * Every category has 5 universal filters + category-specific filters
 * Subcategories can add additional filters on top
 */

export type FilterUIType =
  | 'multi_select'    // checkbox list or tag buttons
  | 'toggle'          // single on/off switch
  | 'slider'          // range slider with min/max
  | 'button_select'   // single-select buttons
  | 'star_rating'     // star picker (1-5)

export interface FilterDefinition {
  id: string
  label: string
  uiType: FilterUIType
  options?: string[]
  min?: number
  max?: number
  step?: number
}

export interface CategoryFilterMap {
  categoryId: string
  specificFilters: FilterDefinition[]
  subcategoryFilters?: Record<string, FilterDefinition[]>
}

// ─── 5 Universal Filters (shown for ALL categories) ──────────

export const UNIVERSAL_FILTERS: FilterDefinition[] = [
  { id: 'price_range', label: 'Price Range', uiType: 'button_select', options: ['$', '$$', '$$$', '$$$$'] },
  { id: 'min_rating', label: 'Minimum Rating', uiType: 'star_rating' },
  { id: 'verified_only', label: 'Verified Only', uiType: 'toggle' },
  { id: 'instant_booking', label: 'Instant Booking', uiType: 'toggle' },
]

// Neighborhood filter is rendered separately (has area grouping + search)

// ─── Category-Specific Filter Maps ───────────────────────────

export const CATEGORY_FILTER_MAP: CategoryFilterMap[] = [
  // 1. Venues & Event Spaces
  {
    categoryId: 'wedding_venue',
    specificFilters: [
      { id: 'capacity', label: 'Guest Capacity', uiType: 'slider', min: 0, max: 1000, step: 25 },
      { id: 'event_type', label: 'Event Type', uiType: 'multi_select', options: ['Wedding', 'Corporate', 'Birthday', 'Gala', 'Fundraiser', 'Prom', 'Quinceañera', 'Bar/Bat Mitzvah', 'Holiday Party', 'Reunion'] },
      { id: 'indoor_outdoor', label: 'Indoor / Outdoor', uiType: 'multi_select', options: ['Indoor', 'Outdoor', 'Both'] },
      { id: 'on_site_catering', label: 'On-Site Catering', uiType: 'toggle' },
      { id: 'bar_service', label: 'Bar Service', uiType: 'toggle' },
      { id: 'parking_type', label: 'Parking', uiType: 'multi_select', options: ['Free Parking', 'Valet', 'Street Parking', 'Private Lot', 'Validated Parking'] },
      { id: 'setup_cleanup', label: 'Setup & Cleanup Included', uiType: 'toggle' },
      { id: 'av_equipment', label: 'A/V Equipment', uiType: 'toggle' },
      { id: 'wheelchair_accessible', label: 'Wheelchair Accessible', uiType: 'toggle' },
    ],
    subcategoryFilters: {
      'wedding-venues': [
        { id: 'ceremony_space', label: 'Ceremony Space', uiType: 'toggle' },
        { id: 'reception_space', label: 'Reception Space', uiType: 'toggle' },
        { id: 'bridal_suite', label: 'Bridal Suite', uiType: 'toggle' },
        { id: 'getting_ready_rooms', label: 'Getting Ready Rooms', uiType: 'toggle' },
      ],
      'banquet-halls': [
        { id: 'dance_floor', label: 'Dance Floor', uiType: 'toggle' },
        { id: 'stage', label: 'Stage', uiType: 'toggle' },
        { id: 'coat_check', label: 'Coat Check', uiType: 'toggle' },
      ],
      'outdoor-venues': [
        { id: 'weather_backup', label: 'Weather Backup (Indoor)', uiType: 'toggle' },
        { id: 'tent_available', label: 'Tent Available', uiType: 'toggle' },
        { id: 'garden', label: 'Garden / Courtyard', uiType: 'toggle' },
        { id: 'waterfront', label: 'Waterfront', uiType: 'toggle' },
      ],
      'corporate-venues': [
        { id: 'wifi', label: 'High-Speed WiFi', uiType: 'toggle' },
        { id: 'projector_screen', label: 'Projector & Screen', uiType: 'toggle' },
        { id: 'breakout_rooms', label: 'Breakout Rooms', uiType: 'toggle' },
        { id: 'whiteboard_flipchart', label: 'Whiteboard / Flipchart', uiType: 'toggle' },
      ],
      'party-venues': [
        { id: 'byob_allowed', label: 'BYOB Allowed', uiType: 'toggle' },
        { id: 'late_night', label: 'Late Night (Past 11pm)', uiType: 'toggle' },
        { id: 'age_restriction', label: 'Age Restriction', uiType: 'multi_select', options: ['All Ages', '18+', '21+'] },
      ],
      'rooftop-venues': [
        { id: 'heated', label: 'Heated / Covered', uiType: 'toggle' },
        { id: 'indoor_backup', label: 'Indoor Backup', uiType: 'toggle' },
      ],
      'birthday-venues': [
        { id: 'kids_welcome', label: 'Kids Welcome', uiType: 'toggle' },
        { id: 'party_packages', label: 'Party Packages', uiType: 'toggle' },
      ],
      'bridal-shower-venues': [
        { id: 'brunch_menu', label: 'Brunch Menu Available', uiType: 'toggle' },
        { id: 'private_room', label: 'Private Room', uiType: 'toggle' },
      ],
      'baby-shower-venues': [
        { id: 'kids_welcome', label: 'Kids Welcome', uiType: 'toggle' },
        { id: 'private_room', label: 'Private Room', uiType: 'toggle' },
      ],
      'concert-venues': [
        { id: 'standing_room', label: 'Standing Room', uiType: 'toggle' },
        { id: 'seated', label: 'Reserved Seating', uiType: 'toggle' },
        { id: 'vip_area', label: 'VIP Area', uiType: 'toggle' },
      ],
      'community-centers': [
        { id: 'kitchen_facilities', label: 'Kitchen Facilities', uiType: 'toggle' },
        { id: 'gymnasium', label: 'Gymnasium', uiType: 'toggle' },
      ],
      'quinceanera-venues': [
        { id: 'dance_floor', label: 'Dance Floor', uiType: 'toggle' },
        { id: 'stage', label: 'Stage for Court', uiType: 'toggle' },
      ],
    },
  },

  // 2. Event Planning
  {
    categoryId: 'wedding_planner',
    specificFilters: [
      { id: 'service_type', label: 'Service Type', uiType: 'multi_select', options: ['Full-Service Planning', 'Day-Of Coordination', 'Partial Planning', 'Consulting Only', 'Month-Of Coordination'] },
      { id: 'event_type', label: 'Event Type', uiType: 'multi_select', options: ['Wedding', 'Corporate', 'Social', 'Non-Profit', 'Milestone'] },
      { id: 'budget_range', label: 'Budget Range', uiType: 'button_select', options: ['Under $5K', '$5K-$15K', '$15K-$30K', '$30K-$50K', '$50K+'] },
      { id: 'years_experience', label: 'Years of Experience', uiType: 'slider', min: 0, max: 30, step: 1 },
      { id: 'certified', label: 'Certified Planner', uiType: 'toggle' },
      { id: 'destination_planning', label: 'Destination Planning', uiType: 'toggle' },
      { id: 'vendor_connections', label: 'Vendor Network Included', uiType: 'toggle' },
    ],
    subcategoryFilters: {
      'wedding-planners': [
        { id: 'ceremony_coordination', label: 'Ceremony Coordination', uiType: 'toggle' },
        { id: 'reception_management', label: 'Reception Management', uiType: 'toggle' },
      ],
      'corporate-planners': [
        { id: 'team_building', label: 'Team Building Activities', uiType: 'toggle' },
        { id: 'av_coordination', label: 'A/V Coordination', uiType: 'toggle' },
      ],
      'officiants': [
        { id: 'denomination', label: 'Denomination', uiType: 'multi_select', options: ['Non-Denominational', 'Christian', 'Catholic', 'Jewish', 'Interfaith', 'Civil'] },
        { id: 'custom_ceremony', label: 'Custom Ceremony', uiType: 'toggle' },
        { id: 'premarital_counseling', label: 'Premarital Counseling', uiType: 'toggle' },
      ],
    },
  },

  // 3. Catering & Food
  {
    categoryId: 'catering',
    specificFilters: [
      { id: 'cuisine_type', label: 'Cuisine Type', uiType: 'multi_select', options: ['American', 'Italian', 'Mexican', 'BBQ', 'Vegan/Vegetarian', 'Mediterranean', 'Asian', 'Soul Food', 'Seafood', 'French', 'Indian', 'Southern', 'German'] },
      { id: 'service_style', label: 'Service Style', uiType: 'multi_select', options: ['Buffet', 'Plated Dinner', 'Food Stations', 'Family Style', 'Hors d\'oeuvres', 'Cocktail Reception', 'Family-Style'] },
      { id: 'dietary', label: 'Dietary Accommodations', uiType: 'multi_select', options: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 'Kosher', 'Nut-Free', 'Dairy-Free', 'Organic'] },
      { id: 'min_guests', label: 'Minimum Guest Count', uiType: 'slider', min: 0, max: 500, step: 10 },
      { id: 'tasting_available', label: 'Tasting Available', uiType: 'toggle' },
      { id: 'full_bar', label: 'Full Bar Service', uiType: 'toggle' },
      { id: 'servers_included', label: 'Servers Included', uiType: 'toggle' },
    ],
    subcategoryFilters: {
      'wedding-catering': [
        { id: 'wedding_cake', label: 'Wedding Cake Included', uiType: 'toggle' },
        { id: 'late_night_snack', label: 'Late Night Snack', uiType: 'toggle' },
      ],
      'food-trucks': [
        { id: 'multiple_trucks', label: 'Multiple Trucks Available', uiType: 'toggle' },
        { id: 'minimum_order', label: 'Minimum Order', uiType: 'toggle' },
      ],
      'bartending': [
        { id: 'liquor_license', label: 'Licensed & Insured', uiType: 'toggle' },
        { id: 'signature_cocktails', label: 'Signature Cocktails', uiType: 'toggle' },
        { id: 'mocktails', label: 'Mocktail Options', uiType: 'toggle' },
      ],
      'bakeries': [
        { id: 'custom_design', label: 'Custom Design', uiType: 'toggle' },
        { id: 'cake_tasting', label: 'Cake Tasting', uiType: 'toggle' },
        { id: 'delivery_setup', label: 'Delivery & Setup', uiType: 'toggle' },
      ],
    },
  },

  // 4. Bars & Nightlife
  {
    categoryId: 'bar_club',
    specificFilters: [
      { id: 'bar_type', label: 'Bar Type', uiType: 'multi_select', options: ['Cocktail Bar', 'Wine Bar', 'Brewery', 'Dive Bar', 'Speakeasy', 'Sports Bar', 'Irish Pub', 'Rooftop Bar', 'Hotel Bar'] },
      { id: 'atmosphere', label: 'Atmosphere', uiType: 'multi_select', options: ['Romantic', 'Lively', 'Chill', 'Upscale', 'Casual', 'Trendy', 'Divey'] },
      { id: 'music', label: 'Music', uiType: 'multi_select', options: ['Live Music', 'DJ', 'Jukebox', 'Karaoke', 'Jazz', 'Open Mic'] },
      { id: 'happy_hour', label: 'Happy Hour', uiType: 'toggle' },
      { id: 'outdoor_seating', label: 'Outdoor Seating', uiType: 'toggle' },
      { id: 'late_night', label: 'Late Night', uiType: 'toggle' },
      { id: 'age_21_plus', label: '21+ Only', uiType: 'toggle' },
      { id: 'private_events', label: 'Private Events', uiType: 'toggle' },
      { id: 'food_served', label: 'Food Served', uiType: 'toggle' },
      { id: 'pool_table', label: 'Pool Table / Games', uiType: 'toggle' },
    ],
    subcategoryFilters: {
      'cocktail-bars': [
        { id: 'craft_cocktails', label: 'Craft Cocktails', uiType: 'toggle' },
        { id: 'mixologist', label: 'Resident Mixologist', uiType: 'toggle' },
      ],
      'breweries': [
        { id: 'brewery_tour', label: 'Brewery Tour', uiType: 'toggle' },
        { id: 'outdoor_beer_garden', label: 'Beer Garden', uiType: 'toggle' },
        { id: 'food_truck', label: 'Food Truck On-Site', uiType: 'toggle' },
      ],
      'speakeasy': [
        { id: 'reservations', label: 'Reservations Required', uiType: 'toggle' },
        { id: 'dress_code', label: 'Dress Code', uiType: 'toggle' },
      ],
      'karaoke-bars': [
        { id: 'private_rooms', label: 'Private Karaoke Rooms', uiType: 'toggle' },
        { id: 'song_selection', label: 'Large Song Selection', uiType: 'toggle' },
      ],
      'bottomless-brunch': [
        { id: 'bottomless_mimosas', label: 'Bottomless Mimosas', uiType: 'toggle' },
        { id: 'reservations', label: 'Takes Reservations', uiType: 'toggle' },
      ],
    },
  },

  // 5. Restaurants & Dining (covers restaurant, restaurant_food, fine_dining)
  {
    categoryId: 'restaurant',
    specificFilters: [
      { id: 'cuisine', label: 'Cuisine', uiType: 'multi_select', options: ['American', 'Italian', 'French', 'Mediterranean', 'Indian', 'Seafood', 'Steakhouse', 'Japanese', 'Mexican', 'Thai', 'Chinese', 'German', 'Korean', 'Spanish'] },
      { id: 'dining_style', label: 'Dining Style', uiType: 'multi_select', options: ['Fine Dining', 'Casual', 'Gastropub', 'Farm-to-Table', 'Bistro', 'Tasting Menu'] },
      { id: 'good_for', label: 'Good For', uiType: 'multi_select', options: ['Date Night', 'Groups', 'Kids', 'Brunch', 'Late Night', 'Happy Hour', 'Business Lunch', 'Special Occasion'] },
      { id: 'private_dining', label: 'Private Dining Room', uiType: 'toggle' },
      { id: 'outdoor_dining', label: 'Outdoor Dining', uiType: 'toggle' },
      { id: 'takes_reservations', label: 'Takes Reservations', uiType: 'toggle' },
      { id: 'prix_fixe', label: 'Prix Fixe Menu', uiType: 'toggle' },
      { id: 'byob', label: 'BYOB', uiType: 'toggle' },
      { id: 'dogs_allowed', label: 'Dog Friendly', uiType: 'toggle' },
    ],
    subcategoryFilters: {
      'fine-dining': [
        { id: 'chefs_table', label: 'Chef\'s Table', uiType: 'toggle' },
        { id: 'tasting_menu', label: 'Tasting Menu', uiType: 'toggle' },
        { id: 'wine_list', label: 'Extensive Wine List', uiType: 'toggle' },
      ],
      'private-dining': [
        { id: 'private_room_capacity', label: 'Private Room Capacity', uiType: 'slider', min: 0, max: 100, step: 5 },
        { id: 'av_equipment', label: 'A/V Equipment', uiType: 'toggle' },
      ],
      'romantic-dining': [
        { id: 'candlelit', label: 'Intimate Atmosphere', uiType: 'toggle' },
        { id: 'water_view', label: 'Water View', uiType: 'toggle' },
      ],
      'rehearsal-dinner': [
        { id: 'group_menu', label: 'Group Menu Available', uiType: 'toggle' },
        { id: 'bar_package', label: 'Bar Package', uiType: 'toggle' },
      ],
    },
  },

  // 6. DJs & Entertainment
  {
    categoryId: 'wedding_dj',
    specificFilters: [
      { id: 'music_genre', label: 'Music Genre', uiType: 'multi_select', options: ['Top 40', 'Hip Hop', 'Latin', 'EDM', 'Country', 'Jazz', 'Oldies', 'R&B', 'Reggae', 'Rock', 'Pop', 'Motown', 'House', '80s/90s'] },
      { id: 'equipment_included', label: 'Equipment Included', uiType: 'toggle' },
      { id: 'mc_services', label: 'MC Services', uiType: 'toggle' },
      { id: 'lighting_included', label: 'Lighting Included', uiType: 'toggle' },
      { id: 'karaoke', label: 'Karaoke', uiType: 'toggle' },
      { id: 'glow_package', label: 'Glow / Club Package', uiType: 'toggle' },
      { id: 'experience_level', label: 'Experience Level', uiType: 'multi_select', options: ['Emerging', 'Professional', 'Premium', 'Celebrity'] },
      { id: 'event_type', label: 'Event Type', uiType: 'multi_select', options: ['Wedding', 'Corporate', 'Birthday', 'Prom', 'Club Night', 'Festival', 'Private Party'] },
      { id: 'online_music_request', label: 'Online Music Requests', uiType: 'toggle' },
      { id: 'bilingual', label: 'Bilingual DJ', uiType: 'toggle' },
    ],
    subcategoryFilters: {
      'wedding-djs': [
        { id: 'ceremony_music', label: 'Ceremony Music', uiType: 'toggle' },
        { id: 'reception_music', label: 'Reception Music', uiType: 'toggle' },
        { id: 'first_dance', label: 'First Dance Planning', uiType: 'toggle' },
      ],
      'party-djs': [
        { id: 'club_atmosphere', label: 'Club Atmosphere', uiType: 'toggle' },
        { id: 'fog_machine', label: 'Fog Machine', uiType: 'toggle' },
      ],
      'latin-djs': [
        { id: 'salsa_bachata', label: 'Salsa & Bachata', uiType: 'toggle' },
        { id: 'reggaeton', label: 'Reggaeton', uiType: 'toggle' },
      ],
      'prom-djs': [
        { id: 'school_appropriate', label: 'School-Appropriate', uiType: 'toggle' },
        { id: 'photo_booth_addon', label: 'Photo Booth Add-On', uiType: 'toggle' },
      ],
    },
  },

  // 7. Photography & Video
  {
    categoryId: 'photography',
    specificFilters: [
      { id: 'style', label: 'Photography Style', uiType: 'multi_select', options: ['Photojournalistic', 'Traditional', 'Fine Art', 'Dramatic', 'Natural Light', 'Editorial', 'Documentary'] },
      { id: 'service_type', label: 'Service Type', uiType: 'multi_select', options: ['Engagement Shoot', 'Wedding Day', 'Portrait', 'Event', 'Commercial', 'Boudoir', 'Family'] },
      { id: 'deliverables', label: 'Deliverables', uiType: 'multi_select', options: ['Digital Files', 'Prints', 'Album', 'Canvas', 'USB Drive', 'Online Gallery', 'Framed Prints'] },
      { id: 'second_shooter', label: 'Second Shooter', uiType: 'toggle' },
      { id: 'drone', label: 'Drone Photography', uiType: 'toggle' },
      { id: 'editing_style', label: 'Editing Style', uiType: 'multi_select', options: ['Light & Airy', 'Dark & Moody', 'True to Color', 'Film Look', 'Vibrant'] },
      { id: 'engagement_shoot', label: 'Engagement Shoot Included', uiType: 'toggle' },
    ],
    subcategoryFilters: {
      'wedding-photographers': [
        { id: 'full_day_coverage', label: 'Full Day Coverage', uiType: 'toggle' },
        { id: 'getting_ready', label: 'Getting Ready Shots', uiType: 'toggle' },
      ],
      'affordable-photographers': [
        { id: 'mini_sessions', label: 'Mini Sessions Available', uiType: 'toggle' },
        { id: 'hourly_rate', label: 'Hourly Rate Available', uiType: 'toggle' },
      ],
      'photo-booths': [
        { id: 'booth_type', label: 'Booth Type', uiType: 'multi_select', options: ['Enclosed', 'Open Air', '360 Booth', 'GIF Booth', 'Green Screen', 'Mirror Booth'] },
        { id: 'props_included', label: 'Props Included', uiType: 'toggle' },
        { id: 'unlimited_prints', label: 'Unlimited Prints', uiType: 'toggle' },
        { id: 'digital_copies', label: 'Digital Copies', uiType: 'toggle' },
      ],
    },
  },

  // 8. Videography
  {
    categoryId: 'videography',
    specificFilters: [
      { id: 'style', label: 'Video Style', uiType: 'multi_select', options: ['Cinematic', 'Documentary', 'Short Form', 'Storytelling', 'Editorial'] },
      { id: 'deliverables', label: 'Deliverables', uiType: 'multi_select', options: ['Highlight Reel', 'Full Ceremony', 'Full Reception', 'Social Media Clips', 'Raw Footage', 'Same-Day Edit'] },
      { id: 'drone', label: 'Drone Videography', uiType: 'toggle' },
      { id: 'same_day_edit', label: 'Same-Day Edit', uiType: 'toggle' },
      { id: 'second_videographer', label: 'Second Videographer', uiType: 'toggle' },
      { id: 'live_stream', label: 'Live Streaming', uiType: 'toggle' },
    ],
  },

  // 9. Floral & Decor
  {
    categoryId: 'florist',
    specificFilters: [
      { id: 'service_type', label: 'Service Type', uiType: 'multi_select', options: ['Floral Design', 'Event Decor', 'Balloon Art', 'Party Supplies', 'Custom Signs', 'Event Design'] },
      { id: 'style', label: 'Style', uiType: 'multi_select', options: ['Rustic', 'Modern', 'Romantic', 'Bohemian', 'Classic', 'Tropical', 'Minimalist', 'Vintage'] },
      { id: 'delivery_setup', label: 'Delivery & Setup', uiType: 'toggle' },
      { id: 'custom_design', label: 'Custom Design', uiType: 'toggle' },
      { id: 'rental_items', label: 'Rental Items', uiType: 'multi_select', options: ['Arch/Chuppah', 'Centerpieces', 'Linens', 'Candles', 'Draping', 'Backdrop', 'Aisle Runner', 'Lanterns'] },
    ],
    subcategoryFilters: {
      'florists': [
        { id: 'flower_delivery', label: 'Flower Delivery', uiType: 'toggle' },
        { id: 'bridal_bouquet', label: 'Bridal Bouquets', uiType: 'toggle' },
      ],
      'balloon-services': [
        { id: 'balloon_arch', label: 'Balloon Arch', uiType: 'toggle' },
        { id: 'balloon_garland', label: 'Balloon Garland', uiType: 'toggle' },
        { id: 'custom_shapes', label: 'Custom Shapes', uiType: 'toggle' },
      ],
      'decor-rentals': [
        { id: 'setup_breakdown', label: 'Setup & Breakdown', uiType: 'toggle' },
        { id: 'theme_consultation', label: 'Theme Consultation', uiType: 'toggle' },
      ],
    },
  },

  // 10. Decor & Rentals (separate from florist)
  {
    categoryId: 'decor_rentals',
    specificFilters: [
      { id: 'rental_type', label: 'Rental Type', uiType: 'multi_select', options: ['Chair Covers', 'Table Linens', 'Centerpieces', 'Draping', 'Backdrop', 'Lighting', 'Dance Floor', 'Stage', 'Tent'] },
      { id: 'delivery_setup', label: 'Delivery & Setup', uiType: 'toggle' },
      { id: 'custom_design', label: 'Custom Design', uiType: 'toggle' },
      { id: 'style', label: 'Style', uiType: 'multi_select', options: ['Rustic', 'Modern', 'Romantic', 'Bohemian', 'Classic', 'Glamorous'] },
    ],
  },

  // 11. Beauty & Wellness
  {
    categoryId: 'makeup_hair',
    specificFilters: [
      { id: 'service_type', label: 'Service Type', uiType: 'multi_select', options: ['Bridal Hair', 'Bridal Makeup', 'Party Styling', 'Spa Services', 'Massage', 'Facial', 'Nails'] },
      { id: 'trial_available', label: 'Trial Available', uiType: 'toggle' },
      { id: 'on_location', label: 'On-Location Service', uiType: 'toggle' },
      { id: 'airbrush', label: 'Airbrush Makeup', uiType: 'toggle' },
      { id: 'lash_extensions', label: 'Lash Extensions', uiType: 'toggle' },
      { id: 'group_services', label: 'Group / Party Services', uiType: 'toggle' },
      { id: 'skincare', label: 'Skincare Consultation', uiType: 'toggle' },
    ],
  },

  // 12. Attire & Jewelry
  {
    categoryId: 'dress_attire',
    specificFilters: [
      { id: 'service_type', label: 'Service Type', uiType: 'multi_select', options: ['Wedding Dresses', 'Tuxedos', 'Bridesmaid Dresses', 'Custom Jewelry', 'Alterations', 'Mother of Bride', 'Flower Girl'] },
      { id: 'custom_design', label: 'Custom Design', uiType: 'toggle' },
      { id: 'plus_sizes', label: 'Plus Sizes Available', uiType: 'toggle' },
      { id: 'rush_orders', label: 'Rush Orders', uiType: 'toggle' },
      { id: 'alterations_on_site', label: 'Alterations On-Site', uiType: 'toggle' },
      { id: 'rentals', label: 'Rental Options', uiType: 'toggle' },
    ],
  },

  // 13. Transportation
  {
    categoryId: 'transportation',
    specificFilters: [
      { id: 'vehicle_type', label: 'Vehicle Type', uiType: 'multi_select', options: ['Party Bus', 'Limousine', 'Vintage Car', 'Trolley', 'Sprinter Van', 'Shuttle Bus', 'Luxury Sedan', 'SUV'] },
      { id: 'capacity', label: 'Passenger Capacity', uiType: 'slider', min: 1, max: 50, step: 1 },
      { id: 'amenities', label: 'Amenities', uiType: 'multi_select', options: ['Bar', 'Sound System', 'LED Lights', 'WiFi', 'AC/Heat', 'Dance Floor', 'Pole', 'TV/Monitor'] },
      { id: 'multiple_stops', label: 'Multiple Stops', uiType: 'toggle' },
      { id: 'decorated_vehicle', label: 'Decorated Vehicle', uiType: 'toggle' },
      { id: 'red_carpet', label: 'Red Carpet Service', uiType: 'toggle' },
    ],
  },

  // 14. Equipment & Rentals
  {
    categoryId: 'rentals',
    specificFilters: [
      { id: 'equipment_type', label: 'Equipment Type', uiType: 'multi_select', options: ['Tent', 'Tables', 'Chairs', 'Linens', 'Dance Floor', 'Lighting', 'Sound System', 'AV/Projector', 'Bounce House', 'Games', 'Stage', 'Generators'] },
      { id: 'delivery_setup', label: 'Delivery & Setup', uiType: 'toggle' },
      { id: 'pickup_available', label: 'Pickup Available', uiType: 'toggle' },
      { id: 'weekend_packages', label: 'Weekend Packages', uiType: 'toggle' },
      { id: 'damage_waiver', label: 'Damage Waiver Available', uiType: 'toggle' },
    ],
    subcategoryFilters: {
      'tent-canopy': [
        { id: 'tent_size', label: 'Tent Size', uiType: 'multi_select', options: ['10x10', '20x20', '20x30', '20x40', '30x60', '40x60', '40x100'] },
        { id: 'sidewalls', label: 'Sidewalls Available', uiType: 'toggle' },
        { id: 'flooring', label: 'Flooring Available', uiType: 'toggle' },
      ],
      'bounce-house': [
        { id: 'age_range', label: 'Age Range', uiType: 'multi_select', options: ['Toddlers', 'Kids', 'Teens', 'Adults'] },
        { id: 'themes', label: 'Theme Options', uiType: 'toggle' },
        { id: 'supervision', label: 'Supervision Provided', uiType: 'toggle' },
      ],
      'lighting-av': [
        { id: 'technician', label: 'Technician Included', uiType: 'toggle' },
        { id: 'consultation', label: 'Free Consultation', uiType: 'toggle' },
      ],
    },
  },

  // 15. Hotels & Lodging
  {
    categoryId: 'hotel_accommodations',
    specificFilters: [
      { id: 'property_type', label: 'Property Type', uiType: 'multi_select', options: ['Hotel', 'Boutique Hotel', 'Bed & Breakfast', 'Resort', 'Vacation Rental'] },
      { id: 'amenities', label: 'Amenities', uiType: 'multi_select', options: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi', 'Parking', 'Airport Shuttle', 'Concierge'] },
      { id: 'room_blocks', label: 'Room Blocks Available', uiType: 'toggle' },
      { id: 'event_space', label: 'Event Space', uiType: 'toggle' },
      { id: 'shuttle_service', label: 'Shuttle Service', uiType: 'toggle' },
      { id: 'pet_friendly', label: 'Pet Friendly', uiType: 'toggle' },
    ],
  },

  // 16. Live Bands
  {
    categoryId: 'wedding_band',
    specificFilters: [
      { id: 'genre', label: 'Music Genre', uiType: 'multi_select', options: ['Pop', 'Rock', 'R&B', 'Jazz', 'Country', 'Latin', 'Classical', 'Motown', 'Blues', 'Funk', 'Reggae', 'Folk'] },
      { id: 'band_size', label: 'Band Size', uiType: 'multi_select', options: ['Solo', 'Duo', 'Trio', '4-6 Piece', '7-10 Piece', '10+ Piece'] },
      { id: 'event_type', label: 'Event Type', uiType: 'multi_select', options: ['Wedding', 'Corporate', 'Private Party', 'Festival', 'Club'] },
      { id: 'emcee', label: 'Emcee / MC Services', uiType: 'toggle' },
      { id: 'learning_songs', label: 'Will Learn New Songs', uiType: 'toggle' },
      { id: 'dj_break_music', label: 'DJ Break Music', uiType: 'toggle' },
    ],
  },

  // 17. Photo Booths
  {
    categoryId: 'photo_booth',
    specificFilters: [
      { id: 'booth_type', label: 'Booth Type', uiType: 'multi_select', options: ['Enclosed', 'Open Air', '360 Booth', 'GIF Booth', 'Green Screen', 'Mirror Booth', 'Slow Motion'] },
      { id: 'props_included', label: 'Props Included', uiType: 'toggle' },
      { id: 'unlimited_prints', label: 'Unlimited Prints', uiType: 'toggle' },
      { id: 'digital_copies', label: 'Digital Copies', uiType: 'toggle' },
      { id: 'custom_template', label: 'Custom Photo Template', uiType: 'toggle' },
      { id: 'attendant', label: 'Attendant Included', uiType: 'toggle' },
      { id: 'scrapbook', label: 'Scrapbook Package', uiType: 'toggle' },
    ],
  },

  // 18. Officiants
  {
    categoryId: 'officiant',
    specificFilters: [
      { id: 'denomination', label: 'Denomination', uiType: 'multi_select', options: ['Non-Denominational', 'Christian', 'Catholic', 'Jewish', 'Interfaith', 'Civil', 'Humanist', 'Unitarian'] },
      { id: 'custom_ceremony', label: 'Custom Ceremony', uiType: 'toggle' },
      { id: 'premarital_counseling', label: 'Premarital Counseling', uiType: 'toggle' },
      { id: 'bilingual', label: 'Bilingual', uiType: 'toggle' },
      { id: 'vow_renewal', label: 'Vow Renewal', uiType: 'toggle' },
    ],
  },

  // 19. Bakeries & Cakes
  {
    categoryId: 'bakery',
    specificFilters: [
      { id: 'specialty', label: 'Specialty', uiType: 'multi_select', options: ['Wedding Cakes', 'Custom Cakes', 'Cupcakes', 'Dessert Bars', 'Cookies', 'Pastries', 'Gluten-Free'] },
      { id: 'cake_tasting', label: 'Cake Tasting', uiType: 'toggle' },
      { id: 'custom_design', label: 'Custom Design', uiType: 'toggle' },
      { id: 'delivery_setup', label: 'Delivery & Setup', uiType: 'toggle' },
      { id: 'dietary', label: 'Dietary Options', uiType: 'multi_select', options: ['Gluten-Free', 'Vegan', 'Nut-Free', 'Sugar-Free', 'Organic'] },
    ],
  },

  // 20. Lighting & AV
  {
    categoryId: 'lighting_av',
    specificFilters: [
      { id: 'service_type', label: 'Service Type', uiType: 'multi_select', options: ['Event Lighting', 'Sound System', 'AV Production', 'Projector/Screen', 'DJ Equipment', 'Stage Lighting', 'Uplighting', 'Monogram'] },
      { id: 'technician_included', label: 'Technician Included', uiType: 'toggle' },
      { id: 'consultation', label: 'Free Consultation', uiType: 'toggle' },
      { id: 'delivery_setup', label: 'Delivery & Setup', uiType: 'toggle' },
    ],
  },

  // 21. Stationery & Invitations
  {
    categoryId: 'stationery',
    specificFilters: [
      { id: 'product_type', label: 'Product Type', uiType: 'multi_select', options: ['Save the Dates', 'Invitations', 'Day-Of Stationery', 'Programs', 'Menus', 'Place Cards', 'Thank You Cards'] },
      { id: 'printing_method', label: 'Printing Method', uiType: 'multi_select', options: ['Digital', 'Letterpress', 'Foil Stamp', 'Thermography', 'Engraving', 'Flat Print'] },
      { id: 'custom_design', label: 'Custom Design', uiType: 'toggle' },
      { id: 'calligraphy', label: 'Calligraphy Available', uiType: 'toggle' },
      { id: 'addressing_service', label: 'Addressing Service', uiType: 'toggle' },
    ],
  },

  // 22. Wellness & Spa
  {
    categoryId: 'wellness',
    specificFilters: [
      { id: 'service_type', label: 'Service Type', uiType: 'multi_select', options: ['Spa Services', 'Couples Massage', 'Bridal Party Spa', 'Wellness Retreat', 'Yoga', 'Meditation'] },
      { id: 'on_location', label: 'On-Location Service', uiType: 'toggle' },
      { id: 'group_packages', label: 'Group Packages', uiType: 'toggle' },
      { id: 'couples_services', label: 'Couples Services', uiType: 'toggle' },
    ],
  },

  // 23. Wine & Spirits
  {
    categoryId: 'wine_spirits',
    specificFilters: [
      { id: 'experience_type', label: 'Experience Type', uiType: 'multi_select', options: ['Wine Tasting', 'Brewery Tour', 'Distillery Tour', 'Cocktail Class', 'Private Event'] },
      { id: 'private_events', label: 'Private Events', uiType: 'toggle' },
      { id: 'group_tours', label: 'Group Tours Available', uiType: 'toggle' },
      { id: 'food_pairing', label: 'Food Pairing Available', uiType: 'toggle' },
    ],
  },

  // 24. Favors & Gifts
  {
    categoryId: 'favors_gifts',
    specificFilters: [
      { id: 'product_type', label: 'Product Type', uiType: 'multi_select', options: ['Wedding Favors', 'Custom Gifts', 'Gift Baskets', 'Party Favors', 'Personalized Items', 'Edible Favors'] },
      { id: 'custom_branding', label: 'Custom Branding/Labels', uiType: 'toggle' },
      { id: 'bulk_pricing', label: 'Bulk Pricing Available', uiType: 'toggle' },
      { id: 'assembly_included', label: 'Assembly Included', uiType: 'toggle' },
    ],
  },

  // 25. Honeymoon & Travel
  {
    categoryId: 'honeymoon_travel',
    specificFilters: [
      { id: 'destination_type', label: 'Destination Type', uiType: 'multi_select', options: ['Beach', 'Mountain', 'City', 'Tropical', 'European', 'All-Inclusive', 'Cruise', 'Adventure'] },
      { id: 'travel_agent', label: 'Dedicated Travel Agent', uiType: 'toggle' },
      { id: 'payment_plans', label: 'Payment Plans Available', uiType: 'toggle' },
      { id: 'group_rates', label: 'Group Rates', uiType: 'toggle' },
    ],
  },

  // 26. Activities & Entertainment
  {
    categoryId: 'bachelorette_activity',
    specificFilters: [
      { id: 'activity_type', label: 'Activity Type', uiType: 'multi_select', options: ['Magician', 'Comedy Club', 'Trivia Night', 'Open Mic', 'Karaoke', 'Jazz Club', 'Team Building', 'Workshop'] },
      { id: 'group_friendly', label: 'Group Friendly', uiType: 'toggle' },
      { id: 'private_events', label: 'Private Events', uiType: 'toggle' },
      { id: 'age_restriction', label: 'Age Restriction', uiType: 'multi_select', options: ['All Ages', '18+', '21+'] },
    ],
  },

  // 27. Live Events (Ticketmaster category)
  {
    categoryId: 'live_events',
    specificFilters: [
      { id: 'event_type', label: 'Event Type', uiType: 'multi_select', options: ['Concert', 'Festival', 'Comedy Show', 'Sports', 'Theater', 'Club Night', 'DJ Set', 'Performance Art'] },
      { id: 'genre', label: 'Genre', uiType: 'multi_select', options: ['Rock', 'Hip Hop', 'Pop', 'Country', 'EDM', 'Jazz', 'R&B', 'Latin', 'Classical', 'Metal', 'Indie', 'Comedy'] },
      { id: 'venue_type', label: 'Venue Type', uiType: 'multi_select', options: ['Arena', 'Theater', 'Club', 'Outdoor', 'Stadium', 'Bar', 'Festival Grounds'] },
      { id: 'age_restriction', label: 'Age Restriction', uiType: 'multi_select', options: ['All Ages', '18+', '21+'] },
      { id: 'date_range', label: 'Date', uiType: 'button_select', options: ['Today', 'This Week', 'This Weekend', 'This Month', 'Next Month'] },
    ],
  },

  // 28. Jeweler
  {
    categoryId: 'jeweler',
    specificFilters: [
      { id: 'product_type', label: 'Product Type', uiType: 'multi_select', options: ['Engagement Rings', 'Wedding Bands', 'Custom Jewelry', 'Jewelry Repair', 'Appraisal', 'Earrings', 'Necklaces'] },
      { id: 'custom_design', label: 'Custom Design', uiType: 'toggle' },
      { id: 'financing', label: 'Financing Available', uiType: 'toggle' },
      { id: 'appraisal', label: 'Appraisal Services', uiType: 'toggle' },
    ],
  },

  // 29. Entertainment
  {
    categoryId: 'entertainment',
    specificFilters: [
      { id: 'act_type', label: 'Act Type', uiType: 'multi_select', options: ['Magician', 'Hypnotist', 'Comedian', 'Impersonator', 'Dancers', 'Acrobats', 'Fire Performer', 'Caricature Artist', 'Face Painting', 'Clown'] },
      { id: 'audience_type', label: 'Audience', uiType: 'multi_select', options: ['Kids', 'Teens', 'Adults', 'All Ages'] },
      { id: 'private_events', label: 'Private Events', uiType: 'toggle' },
      { id: 'interactive', label: 'Interactive Show', uiType: 'toggle' },
    ],
  },
]

// ─── Helpers ─────────────────────────────────────────────────

/** Get category-specific + subcategory-specific filters (NOT including universal) */
export function getSpecificFilters(categoryId: string, subcategorySlug?: string | null): FilterDefinition[] {
  const map = CATEGORY_FILTER_MAP.find(m => m.categoryId === categoryId)
  if (!map) return []
  const filters = [...map.specificFilters]
  if (subcategorySlug && map.subcategoryFilters?.[subcategorySlug]) {
    filters.push(...map.subcategoryFilters[subcategorySlug])
  }
  return filters
}

/** Get ALL filters for a category (universal + specific + subcategory) */
export function getAllFilters(categoryId: string, subcategorySlug?: string | null): FilterDefinition[] {
  return [...UNIVERSAL_FILTERS, ...getSpecificFilters(categoryId, subcategorySlug)]
}

/** Map of category IDs that should use the same filter set as restaurant */
export const RESTAURANT_CATEGORY_IDS = ['restaurant', 'restaurant_food', 'fine_dining']

/** Resolve a category ID to its filter map ID (handles aliases) */
export function resolveFilterCategoryId(categoryId: string): string {
  if (RESTAURANT_CATEGORY_IDS.includes(categoryId)) return 'restaurant'
  if (categoryId === 'hair_makeup') return 'makeup_hair'
  if (categoryId === 'wedding_cake') return 'bakery'
  if (categoryId === 'invitations_print') return 'stationery'
  if (categoryId === 'event_planner') return 'wedding_planner'
  return categoryId
}
