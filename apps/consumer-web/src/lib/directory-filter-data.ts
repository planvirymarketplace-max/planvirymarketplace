// ─────────────────────────────────────────────────────────────────────────────
// Planviry – Hardcoded directory categories, subcategories & filter definitions
// NOT database-dependent. All filter options are inlined here from 002_filter_schemas.sql
// ─────────────────────────────────────────────────────────────────────────────

export type FilterType =
  | 'multi'
  | 'single'
  | 'toggle'
  | 'price_range'
  | 'rating'
  | 'slider'
  | 'range_inputs'
  | 'neighborhood';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDef {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface NavSubcategory {
  label: string;
  filterSchemaKey: string;
  filters?: FilterDef[];
}

export interface NavCategory {
  key: string;
  label: string;
  iconName: string;
  defaultFilterSchema: string;
  subcategories: NavSubcategory[];
  filters: FilterDef[];
}

// ── UNIVERSAL FILTERS (always shown) ──────────────────────────────────────────
export const UNIVERSAL_FILTERS: FilterDef[] = [
  {
    key: 'price_range',
    label: 'Price Range',
    type: 'price_range',
    options: [
      { value: '$', label: '$' },
      { value: '$$', label: '$$' },
      { value: '$$$', label: '$$$' },
      { value: '$$$$', label: '$$$$' },
    ],
  },
  {
    key: 'price_budget',
    label: 'Budget (Min / Max)',
    type: 'range_inputs',
  },
  {
    key: 'rating',
    label: 'Min Rating',
    type: 'rating',
    options: [
      { value: '3', label: '3★+' },
      { value: '4', label: '4★+' },
      { value: '4.5', label: '4.5★+' },
      { value: '5', label: '5★ only' },
    ],
  },
  {
    key: 'distance',
    label: 'Distance from Downtown',
    type: 'slider',
    min: 1,
    max: 50,
    step: 1,
    unit: ' mi',
  },
  {
    key: 'neighborhood',
    label: 'Neighborhood',
    type: 'neighborhood',
  },
];

// ── NEIGHBORHOODS ─────────────────────────────────────────────────────────────
export const NEIGHBORHOODS_BY_AREA: { area: string; items: string[] }[] = [
  {
    area: 'Downtown & Near North Side',
    items: [
      'Avenues West', "Brewer's Hill", 'Downtown', 'East Town', 'Westown',
      'Yankee Hill', 'Juneau Town', 'Halyard Park', 'Haymarket', 'Hillside',
      'Historic Third Ward', "Jones' Island", 'Kilbourn Town', 'King Park',
      'Lower East Side', 'Brady Street', 'Midtown', 'Park View', 'Riverwest',
      "Walker's Point",
    ],
  },
  {
    area: 'East Side & Lakefront',
    items: [
      'Downer Woods', 'Lake Park', 'Murray Hill', 'Northpoint',
      'Upper East Side', 'Cambridge Heights',
    ],
  },
  {
    area: 'South Side',
    items: [
      'Bay View', 'Clarke Square', 'Historic Mitchell Street', 'Lincoln Village',
      'Mitchell Park', 'Morgandale', 'Muskego Way', 'Polonia', 'Saveland Park',
      'Silver City', 'Tippecanoe', 'Town of Lake', 'Wilson Park',
    ],
  },
  {
    area: 'West Side',
    items: [
      'Bluemound Heights', 'Cold Spring Park', 'Concordia', 'Enderis Park',
      'Fair Park', 'Martin Drive', 'Menomonee River Hills', 'Merrill Park',
      'Miller Valley', 'Mount Mary', 'Piggsville (The Valley)', 'Story Hill',
      'Washington Heights', 'Washington Park', 'Wick Field',
    ],
  },
  {
    area: 'Northwest Side',
    items: [
      'Arlington Gardens', 'Arlington Heights', 'Cooper Park', 'Franklin Heights',
      'Garden Homes', 'Granville', 'Grantosa', 'Hampton Heights', 'Harambee',
      'Kops Park', 'Lincoln Park', 'Metcalfe Park', 'Park West', 'Roosevelt Grove',
      'Sherman Park', 'Sunset Heights', 'Uptown', 'Walnut Hill',
    ],
  },
];

export const ALL_NEIGHBORHOODS: string[] = NEIGHBORHOODS_BY_AREA.flatMap(a => a.items);

// ── PER-CATEGORY FILTER SETS ──────────────────────────────────────────────────

const EVENT_TYPE_FILTER: FilterDef = {
  key: 'event_type',
  label: 'Event Type',
  type: 'multi',
  options: [
    { value: 'wedding', label: 'Wedding' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'birthday', label: 'Birthday Party' },
    { value: 'quinceanera', label: 'Quinceañera' },
    { value: 'bar_bat_mitzvah', label: 'Bar / Bat Mitzvah' },
    { value: 'bridal_shower', label: 'Bridal Shower' },
    { value: 'baby_shower', label: 'Baby Shower' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'prom', label: 'Prom / School Dance' },
    { value: 'reunion', label: 'Reunion' },
    { value: 'fundraiser', label: 'Fundraiser / Gala' },
    { value: 'concert', label: 'Concert / Performance' },
  ],
};

const VENUE_FILTERS: FilterDef[] = [
  EVENT_TYPE_FILTER,
  {
    key: 'guest_capacity',
    label: 'Guest Capacity',
    type: 'slider',
    min: 10,
    max: 1000,
    step: 10,
    unit: ' guests',
  },
  {
    key: 'indoor_outdoor',
    label: 'Setting',
    type: 'multi',
    options: [
      { value: 'indoor', label: 'Indoor' },
      { value: 'outdoor', label: 'Outdoor' },
      { value: 'covered_outdoor', label: 'Covered Outdoor' },
    ],
  },
  {
    key: 'venue_style',
    label: 'Venue Style',
    type: 'multi',
    options: [
      { value: 'barn', label: 'Barn' },
      { value: 'rustic', label: 'Rustic' },
      { value: 'modern', label: 'Modern' },
      { value: 'historic', label: 'Historic' },
      { value: 'garden', label: 'Garden' },
      { value: 'ballroom', label: 'Ballroom' },
      { value: 'industrial', label: 'Industrial' },
      { value: 'country_club', label: 'Country Club' },
      { value: 'rooftop', label: 'Rooftop' },
    ],
  },
  {
    key: 'parking',
    label: 'Parking',
    type: 'multi',
    options: [
      { value: 'free_onsite', label: 'Free On-site' },
      { value: 'valet', label: 'Valet' },
      { value: 'paid_onsite', label: 'Paid' },
      { value: 'street', label: 'Street' },
    ],
  },
  { key: 'accessibility', label: 'ADA Accessible', type: 'toggle' },
  { key: 'dance_floor', label: 'Dance Floor', type: 'toggle' },
  { key: 'catering_allowed', label: 'Outside Catering OK', type: 'toggle' },
  { key: 'byob', label: 'BYOB / Bar Allowed', type: 'toggle' },
];

const PLANNING_FILTERS: FilterDef[] = [
  EVENT_TYPE_FILTER,
  {
    key: 'years_experience',
    label: 'Experience',
    type: 'single',
    options: [
      { value: '1', label: '1+ yrs' },
      { value: '5', label: '5+ yrs' },
      { value: '10', label: '10+ yrs' },
      { value: '15', label: '15+ yrs' },
    ],
  },
  {
    key: 'response_time',
    label: 'Response Time',
    type: 'single',
    options: [
      { value: '1hr', label: '< 1 Hour' },
      { value: '4hr', label: '< 4 Hours' },
      { value: '24hr', label: '< 24 Hours' },
      { value: '48hr', label: '< 48 Hours' },
    ],
  },
  {
    key: 'travel_radius',
    label: 'Travel Radius',
    type: 'single',
    options: [
      { value: '10', label: '10 mi' },
      { value: '25', label: '25 mi' },
      { value: '50', label: '50 mi' },
      { value: '100', label: '100+ mi' },
    ],
  },
  { key: 'portfolio_available', label: 'Portfolio', type: 'toggle' },
  { key: 'has_insurance', label: 'Insured & Bonded', type: 'toggle' },
];

const CATERING_FILTERS: FilterDef[] = [
  {
    key: 'cuisine_type',
    label: 'Cuisine',
    type: 'multi',
    options: [
      { value: 'american', label: 'American' },
      { value: 'italian', label: 'Italian' },
      { value: 'mexican', label: 'Mexican' },
      { value: 'bbq', label: 'BBQ' },
      { value: 'soul_food', label: 'Soul Food' },
      { value: 'indian', label: 'Indian' },
      { value: 'mediterranean', label: 'Mediterranean' },
      { value: 'caribbean', label: 'Caribbean' },
      { value: 'polish', label: 'Polish' },
    ],
  },
  {
    key: 'serving_style',
    label: 'Service Style',
    type: 'multi',
    options: [
      { value: 'buffet', label: 'Buffet' },
      { value: 'plated', label: 'Plated' },
      { value: 'family_style', label: 'Family Style' },
      { value: 'stations', label: 'Stations' },
      { value: 'food_bars', label: 'Food Bars' },
    ],
  },
  {
    key: 'dietary',
    label: 'Dietary',
    type: 'multi',
    options: [
      { value: 'vegan', label: 'Vegan' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'gluten_free', label: 'Gluten-Free' },
      { value: 'halal', label: 'Halal' },
      { value: 'kosher', label: 'Kosher' },
      { value: 'nut_free', label: 'Nut-Free' },
    ],
  },
  { key: 'tasting_available', label: 'Tasting Available', type: 'toggle' },
  { key: 'setup_cleanup', label: 'Setup & Cleanup', type: 'toggle' },
  { key: 'last_minute', label: 'Last-Minute', type: 'toggle' },
];

const BARS_FILTERS: FilterDef[] = [
  {
    key: 'reservations',
    label: 'Reservations',
    type: 'single',
    options: [
      { value: 'walk_in', label: 'Walk-ins Only' },
      { value: 'recommended', label: 'Recommended' },
      { value: 'required', label: 'Required' },
    ],
  },
  {
    key: 'min_age',
    label: 'Age Policy',
    type: 'single',
    options: [
      { value: 'all_ages', label: 'All Ages' },
      { value: '18', label: '18+' },
      { value: '21', label: '21+ Only' },
    ],
  },
  {
    key: 'noise_level',
    label: 'Atmosphere',
    type: 'single',
    options: [
      { value: 'quiet', label: 'Quiet' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'loud', label: 'Loud' },
      { value: 'very_loud', label: 'Very Loud' },
    ],
  },
  { key: 'outdoor_seating', label: 'Outdoor', type: 'toggle' },
  { key: 'dog_friendly', label: 'Dog Friendly', type: 'toggle' },
  { key: 'open_now', label: 'Open Now', type: 'toggle' },
];

const RESTAURANT_FILTERS: FilterDef[] = [
  {
    key: 'cuisine_type',
    label: 'Cuisine',
    type: 'multi',
    options: [
      { value: 'american', label: 'American' },
      { value: 'italian', label: 'Italian' },
      { value: 'mexican', label: 'Mexican' },
      { value: 'chinese', label: 'Chinese' },
      { value: 'indian', label: 'Indian' },
      { value: 'mediterranean', label: 'Mediterranean' },
      { value: 'french', label: 'French' },
      { value: 'japanese', label: 'Japanese' },
      { value: 'thai', label: 'Thai' },
      { value: 'seafood', label: 'Seafood' },
      { value: 'steak', label: 'Steak' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'vegetarian', label: 'Vegetarian' },
    ],
  },
  {
    key: 'reservations',
    label: 'Reservations',
    type: 'single',
    options: [
      { value: 'walk_in', label: 'Walk-ins Only' },
      { value: 'recommended', label: 'Recommended' },
      { value: 'required', label: 'Required' },
    ],
  },
  {
    key: 'parking',
    label: 'Parking',
    type: 'multi',
    options: [
      { value: 'free_onsite', label: 'Free On-site' },
      { value: 'paid_onsite', label: 'Paid' },
      { value: 'street', label: 'Street' },
      { value: 'valet', label: 'Valet' },
    ],
  },
  { key: 'outdoor_seating', label: 'Outdoor Seating', type: 'toggle' },
  { key: 'private_rooms', label: 'Private Dining', type: 'toggle' },
  { key: 'good_for_groups', label: 'Good for Groups', type: 'toggle' },
  { key: 'delivery', label: 'Delivery Available', type: 'toggle' },
];

const DJ_FILTERS: FilterDef[] = [
  {
    key: 'years_experience',
    label: 'Experience',
    type: 'single',
    options: [
      { value: '1', label: '1+ yrs' },
      { value: '5', label: '5+ yrs' },
      { value: '10', label: '10+ yrs' },
      { value: '15', label: '15+ yrs' },
    ],
  },
  {
    key: 'genre',
    label: 'Genre',
    type: 'multi',
    options: [
      { value: 'cover', label: 'Cover' },
      { value: 'jazz', label: 'Jazz' },
      { value: 'rock', label: 'Rock' },
      { value: 'funk_rnb', label: 'Funk/R&B' },
      { value: 'latin', label: 'Latin' },
      { value: 'country', label: 'Country' },
      { value: 'classical', label: 'Classical' },
    ],
  },
  {
    key: 'lighting_package',
    label: 'Lighting',
    type: 'multi',
    options: [
      { value: 'uplighting', label: 'Uplighting' },
      { value: 'dance_floor', label: 'Dance Floor' },
      { value: 'monogram', label: 'Monogram/Gobo' },
      { value: 'none', label: 'None' },
    ],
  },
  {
    key: 'travel_radius',
    label: 'Travel Radius',
    type: 'single',
    options: [
      { value: '25', label: '25 mi' },
      { value: '50', label: '50 mi' },
      { value: '100', label: '100+ mi' },
    ],
  },
  { key: 'has_insurance', label: 'Insured', type: 'toggle' },
  { key: 'emcee_included', label: 'Emcee Services', type: 'toggle' },
  { key: 'backup_dj', label: 'Backup DJ', type: 'toggle' },
  { key: 'ceremony_sound', label: 'Ceremony Sound', type: 'toggle' },
];

const PHOTO_FILTERS: FilterDef[] = [
  {
    key: 'editing_style',
    label: 'Editing Style',
    type: 'multi',
    options: [
      { value: 'bright_airy', label: 'Bright & Airy' },
      { value: 'dark_moody', label: 'Dark & Moody' },
      { value: 'true_to_life', label: 'True to Life' },
      { value: 'film', label: 'Film/Vintage' },
      { value: 'high_contrast', label: 'High Contrast' },
    ],
  },
  {
    key: 'delivery_weeks',
    label: 'Delivery Time',
    type: 'single',
    options: [
      { value: '2', label: '2 weeks' },
      { value: '4', label: '4 weeks' },
      { value: '8', label: '8 weeks' },
      { value: '12', label: '12 weeks' },
    ],
  },
  {
    key: 'travel_radius',
    label: 'Travel Radius',
    type: 'single',
    options: [
      { value: '25', label: '25 mi' },
      { value: '50', label: '50 mi' },
      { value: '100', label: '100+ mi' },
    ],
  },
  { key: 'second_shooter', label: '2nd Shooter', type: 'toggle' },
  { key: 'drone_available', label: 'Drone Photography', type: 'toggle' },
  { key: 'engagement_session', label: 'Engagement Session', type: 'toggle' },
  { key: 'same_day_edit', label: 'Same-Day Edit', type: 'toggle' },
  {
    key: 'file_format',
    label: 'Deliverables',
    type: 'multi',
    options: [
      { value: 'digital_gallery', label: 'Online Gallery' },
      { value: 'jpg', label: 'JPEG Files' },
      { value: 'raw', label: 'RAW / Unedited' },
      { value: 'tiff', label: 'TIFF Files' },
      { value: 'print_release', label: 'Print Release' },
      { value: 'usb_drive', label: 'USB Drive' },
      { value: 'album', label: 'Printed Album' },
    ],
  },
];

const FLORAL_FILTERS: FilterDef[] = [
  {
    key: 'travel_radius',
    label: 'Travel Radius',
    type: 'single',
    options: [
      { value: '10', label: '10 mi' },
      { value: '25', label: '25 mi' },
      { value: '50', label: '50 mi' },
      { value: '100', label: '100+ mi' },
    ],
  },
  { key: 'portfolio_available', label: 'Portfolio Available', type: 'toggle' },
  { key: 'last_minute', label: 'Last-Minute Available', type: 'toggle' },
  { key: 'custom_orders', label: 'Custom Orders', type: 'toggle' },
];

const BEAUTY_FILTERS: FilterDef[] = [
  {
    key: 'service_type',
    label: 'Service',
    type: 'multi',
    options: [
      { value: 'hair_only', label: 'Hair Only' },
      { value: 'makeup_only', label: 'Makeup Only' },
      { value: 'both', label: 'Hair + Makeup' },
      { value: 'airbrush', label: 'Airbrush' },
      { value: 'sfx', label: 'Special FX' },
    ],
  },
  {
    key: 'hair_textures',
    label: 'Hair Texture',
    type: 'multi',
    options: [
      { value: 'straight', label: 'Straight' },
      { value: 'wavy', label: 'Wavy' },
      { value: 'curly', label: 'Curly (3A–3C)' },
      { value: 'coily', label: 'Coily (4A–4C)' },
      { value: 'natural', label: 'Natural/Textured' },
    ],
  },
  {
    key: 'travel_radius',
    label: 'Travel Radius',
    type: 'single',
    options: [
      { value: '10', label: '10 mi' },
      { value: '25', label: '25 mi' },
      { value: '50', label: '50 mi' },
    ],
  },
  { key: 'travel_to_client', label: 'Mobile Artist', type: 'toggle' },
  { key: 'licensed', label: 'Licensed', type: 'toggle' },
  { key: 'group_booking', label: 'Group Booking', type: 'toggle' },
  { key: 'trials', label: 'Trials Available', type: 'toggle' },
  { key: 'cruelty_free', label: 'Cruelty-Free', type: 'toggle' },
];

const ATTIRE_FILTERS: FilterDef[] = [
  { key: 'alterations', label: 'Alterations', type: 'toggle' },
  { key: 'custom_orders', label: 'Custom Orders', type: 'toggle' },
  { key: 'portfolio_available', label: 'Portfolio', type: 'toggle' },
];

const TRANSPORT_FILTERS: FilterDef[] = [
  {
    key: 'vehicle_type',
    label: 'Vehicle Type',
    type: 'multi',
    options: [
      { value: 'stretch_limo', label: 'Stretch Limo' },
      { value: 'sprinter', label: 'Sprinter Van' },
      { value: 'minibus', label: 'Minibus' },
      { value: 'coach', label: 'Motor Coach' },
      { value: 'trolley', label: 'Trolley' },
      { value: 'vintage', label: 'Vintage Car' },
    ],
  },
  {
    key: 'passenger_capacity',
    label: 'Passengers',
    type: 'single',
    options: [
      { value: '10', label: '1–10' },
      { value: '20', label: '11–20' },
      { value: '40', label: '21–40' },
      { value: '60', label: '40+' },
    ],
  },
  {
    key: 'min_hours',
    label: 'Min. Hours',
    type: 'single',
    options: [
      { value: '1', label: '1 hour' },
      { value: '2', label: '2 hours' },
      { value: '3', label: '3 hours' },
      { value: '4', label: '4 hours' },
    ],
  },
  { key: 'licensed', label: 'Licensed & Insured', type: 'toggle' },
  { key: 'wheelchair', label: 'Wheelchair Accessible', type: 'toggle' },
  { key: 'wedding_decor', label: 'Wedding Decoration', type: 'toggle' },
  { key: 'airport_transfer', label: 'Airport Transfer', type: 'toggle' },
];

const RENTALS_FILTERS: FilterDef[] = [
  {
    key: 'rental_duration',
    label: 'Duration',
    type: 'single',
    options: [
      { value: '4hr', label: '4 Hours' },
      { value: '8hr', label: 'Full Day' },
      { value: '24hr', label: 'Overnight' },
      { value: '48hr', label: 'Weekend' },
      { value: 'week', label: '1 Week' },
    ],
  },
  {
    key: 'delivery_radius',
    label: 'Delivery',
    type: 'single',
    options: [
      { value: '10', label: '10 mi' },
      { value: '25', label: '25 mi' },
      { value: '50', label: '50 mi' },
    ],
  },
  { key: 'setup_included', label: 'Setup Included', type: 'toggle' },
  { key: 'takedown_included', label: 'Takedown Included', type: 'toggle' },
];

const HOTELS_FILTERS: FilterDef[] = [
  {
    key: 'cancellation',
    label: 'Cancellation',
    type: 'single',
    options: [
      { value: 'free_24', label: 'Free (24h)' },
      { value: 'free_48', label: 'Free (48h)' },
      { value: 'free_7d', label: 'Free (7 Days)' },
      { value: 'nonrefundable', label: 'Non-Refundable' },
    ],
  },
  {
    key: 'pet_policy',
    label: 'Pets',
    type: 'single',
    options: [
      { value: 'allowed', label: 'Pets Allowed' },
      { value: 'service_only', label: 'Service Animals Only' },
      { value: 'no_pets', label: 'No Pets' },
    ],
  },
  {
    key: 'star_rating',
    label: 'Star Rating',
    type: 'single',
    options: [
      { value: '3', label: '3★+' },
      { value: '4', label: '4★+' },
      { value: '5', label: '5★' },
    ],
  },
  { key: 'group_block', label: 'Wedding Room Block', type: 'toggle' },
  { key: 'pool', label: 'Pool', type: 'toggle' },
  { key: 'fitness_center', label: 'Fitness Center', type: 'toggle' },
  { key: 'restaurant', label: 'On-site Restaurant', type: 'toggle' },
  { key: 'airport_shuttle', label: 'Airport Shuttle', type: 'toggle' },
  { key: 'accessibility', label: 'ADA Accessible', type: 'toggle' },
];

const TRAVEL_FILTERS: FilterDef[] = [
  {
    key: 'travel_style',
    label: 'Travel Style',
    type: 'multi',
    options: [
      { value: 'all_inclusive', label: 'All-Inclusive' },
      { value: 'luxury', label: 'Luxury' },
      { value: 'adventure', label: 'Adventure' },
      { value: 'beach', label: 'Beach/Relaxation' },
      { value: 'cultural', label: 'Cultural' },
      { value: 'wellness', label: 'Wellness/Spa' },
      { value: 'cruise', label: 'Cruise' },
      { value: 'safari', label: 'Safari' },
    ],
  },
  {
    key: 'destination_region',
    label: 'Destination',
    type: 'multi',
    options: [
      { value: 'caribbean', label: 'Caribbean' },
      { value: 'mexico', label: 'Mexico' },
      { value: 'europe', label: 'Europe' },
      { value: 'asia', label: 'Asia' },
      { value: 'south_pacific', label: 'South Pacific' },
      { value: 'africa', label: 'Africa' },
      { value: 'hawaii', label: 'Hawaii' },
      { value: 'south_america', label: 'South America' },
    ],
  },
  { key: 'honeymoon_registry', label: 'Registry Setup', type: 'toggle' },
  { key: 'lgbtq_friendly', label: 'LGBTQ+ Friendly', type: 'toggle' },
  { key: 'flights_included', label: 'Flights Included', type: 'toggle' },
];

// ── PER-SUBCATEGORY FILTER SETS ───────────────────────────────────────────────

// VENUES subcategory-specific filters
const SUB_VENUES_WEDDING: FilterDef[] = [
  { key: 'venue_style', label: 'Venue Style', type: 'multi', options: [{ value: 'barn', label: 'Barn' }, { value: 'rustic', label: 'Rustic' }, { value: 'modern', label: 'Modern' }, { value: 'historic', label: 'Historic' }, { value: 'garden', label: 'Garden' }, { value: 'ballroom', label: 'Ballroom' }, { value: 'industrial', label: 'Industrial' }, { value: 'country_club', label: 'Country Club' }, { value: 'rooftop', label: 'Rooftop' }] },
  { key: 'ceremony_reception', label: 'Ceremony & Reception', type: 'multi', options: [{ value: 'ceremony_only', label: 'Ceremony Only' }, { value: 'reception_only', label: 'Reception Only' }, { value: 'both', label: 'Both' }] },
  { key: 'bridal_suite', label: 'Bridal Suite', type: 'toggle' },
  { key: 'catering_policy', label: 'Catering Policy', type: 'single', options: [{ value: 'in_house', label: 'In-House Only' }, { value: 'preferred_list', label: 'Preferred List' }, { value: 'bring_your_own', label: 'BYO Caterer' }] },
  { key: 'alcohol_policy', label: 'Alcohol Policy', type: 'single', options: [{ value: 'full_bar', label: 'Full Bar' }, { value: 'beer_wine', label: 'Beer & Wine' }, { value: 'byob', label: 'BYOB' }, { value: 'no_alcohol', label: 'No Alcohol' }] },
  { key: 'overnight_accommodation', label: 'Overnight Rooms', type: 'toggle' },
  { key: 'rain_backup', label: 'Rain Backup Plan', type: 'toggle' },
  { key: 'getting_ready_rooms', label: 'Getting Ready Rooms', type: 'toggle' },
];

const SUB_VENUES_BANQUET: FilterDef[] = [
  { key: 'tables_chairs_included', label: 'Tables & Chairs Included', type: 'toggle' },
  { key: 'table_shapes', label: 'Table Shapes', type: 'multi', options: [{ value: 'round', label: 'Round' }, { value: 'rectangle', label: 'Rectangle' }, { value: 'serpentine', label: 'Serpentine' }] },
  { key: 'linens_provided', label: 'Linens Provided', type: 'toggle' },
  { key: 'dance_floor', label: 'Dance Floor', type: 'toggle' },
  { key: 'dais_stage', label: 'Dais / Stage', type: 'toggle' },
  { key: 'ceiling_height', label: 'Ceiling Height', type: 'single', options: [{ value: 'standard', label: 'Standard (8–10 ft)' }, { value: 'tall', label: 'Tall (11–14 ft)' }, { value: 'grand', label: 'Grand (15 ft+)' }] },
  { key: 'columns_obstructing', label: 'Column-Free Floor', type: 'toggle' },
];

const SUB_VENUES_OUTDOOR: FilterDef[] = [
  { key: 'ground_type', label: 'Ground Type', type: 'multi', options: [{ value: 'grass', label: 'Grass' }, { value: 'paved', label: 'Paved' }, { value: 'gravel', label: 'Gravel' }, { value: 'deck', label: 'Deck' }] },
  { key: 'tent_permitted', label: 'Tent Permitted', type: 'toggle' },
  { key: 'power_access', label: 'Power Access', type: 'toggle' },
  { key: 'restroom_type', label: 'Restrooms', type: 'single', options: [{ value: 'permanent', label: 'Permanent' }, { value: 'portable', label: 'Portable' }, { value: 'none', label: 'None' }] },
  { key: 'pet_friendly', label: 'Pet Friendly', type: 'toggle' },
  { key: 'fire_pit', label: 'Fire Pit', type: 'toggle' },
];

const SUB_VENUES_CORPORATE: FilterDef[] = [
  { key: 'av_equipment', label: 'AV Equipment', type: 'toggle' },
  { key: 'wifi_speed', label: 'Wi-Fi Speed', type: 'single', options: [{ value: 'basic', label: 'Basic' }, { value: 'high', label: 'High-Speed' }, { value: 'fiber', label: 'Fiber / Enterprise' }] },
  { key: 'breakout_rooms', label: 'Breakout Rooms', type: 'toggle' },
  { key: 'stage_podium', label: 'Stage / Podium', type: 'toggle' },
  { key: 'nda_friendly', label: 'NDA / Privacy Capable', type: 'toggle' },
  { key: 'catering_style', label: 'Catering Style', type: 'single', options: [{ value: 'in_house', label: 'In-House' }, { value: 'outside_allowed', label: 'Outside Allowed' }, { value: 'self_catered', label: 'Self-Catered' }] },
];

const SUB_VENUES_PARTY: FilterDef[] = [
  { key: 'noise_restriction', label: 'Noise Restriction', type: 'single', options: [{ value: 'none', label: 'None' }, { value: 'after_10pm', label: 'After 10 PM' }, { value: 'after_midnight', label: 'After Midnight' }] },
  { key: 'dj_allowed', label: 'DJ Allowed', type: 'toggle' },
  { key: 'decorations_allowed', label: 'Decorations Allowed', type: 'toggle' },
  { key: 'cleanup_included', label: 'Cleanup Included', type: 'toggle' },
  { key: 'ice_machine', label: 'Ice Machine Onsite', type: 'toggle' },
];

const SUB_VENUES_SMALL: FilterDef[] = [
  { key: 'min_hours', label: 'Minimum Booking Hours', type: 'single', options: [{ value: '1', label: '1 hr' }, { value: '2', label: '2 hrs' }, { value: '4', label: '4 hrs' }] },
  { key: 'kitchenette', label: 'Kitchenette', type: 'toggle' },
  { key: 'ada_accessible', label: 'ADA Accessible', type: 'toggle' },
  { key: 'street_noise', label: 'Low Street Noise', type: 'toggle' },
  { key: 'parking_difficulty', label: 'Easy Parking', type: 'toggle' },
];

const SUB_VENUES_BIRTHDAY: FilterDef[] = [
  { key: 'age_group', label: 'Age Group', type: 'single', options: [{ value: 'kids', label: 'Kids' }, { value: 'teens', label: 'Teens' }, { value: 'adults', label: 'Adults' }, { value: 'mixed', label: 'Mixed' }] },
  { key: 'party_host', label: 'Party Host Provided', type: 'toggle' },
  { key: 'goody_bag', label: 'Goody Bags Available', type: 'toggle' },
  { key: 'outside_food', label: 'Outside Food OK', type: 'toggle' },
  { key: 'themed_packages', label: 'Themed Packages', type: 'toggle' },
];

const SUB_VENUES_BRIDAL_SHOWER: FilterDef[] = [
  { key: 'intimate_capacity', label: 'Capacity', type: 'single', options: [{ value: '10', label: 'Up to 10' }, { value: '20', label: '11–20' }, { value: '40', label: '21–40' }, { value: '50plus', label: '50+' }] },
  { key: 'natural_light', label: 'Natural Light', type: 'toggle' },
  { key: 'mimosa_bar', label: 'Mimosa Bar Option', type: 'toggle' },
  { key: 'gift_table', label: 'Gift Table Space', type: 'toggle' },
  { key: 'privacy', label: 'Private / Semi-Private', type: 'toggle' },
];

const SUB_VENUES_BABY_SHOWER: FilterDef[] = [
  { key: 'stroller_parking', label: 'Stroller Parking', type: 'toggle' },
  { key: 'changing_table', label: 'Changing Table', type: 'toggle' },
  { key: 'food_warmers', label: 'Food Warmers Available', type: 'toggle' },
  { key: 'non_slip', label: 'Non-Slip Flooring', type: 'toggle' },
  { key: 'quiet', label: 'Quiet / Low-Noise', type: 'toggle' },
];

const SUB_VENUES_CONCERT: FilterDef[] = [
  { key: 'stage_size', label: 'Stage Size', type: 'single', options: [{ value: 'small', label: 'Small (< 20 ft)' }, { value: 'medium', label: 'Medium (20–40 ft)' }, { value: 'large', label: 'Large (40 ft+)' }] },
  { key: 'sound_system', label: 'Sound System Included', type: 'toggle' },
  { key: 'sound_limiter', label: 'Sound Limiter', type: 'toggle' },
  { key: 'lighting_rig', label: 'Lighting Rig', type: 'toggle' },
  { key: 'green_room', label: 'Green Room', type: 'toggle' },
  { key: 'load_in', label: 'Load-In Access', type: 'toggle' },
  { key: 'bar_service', label: 'Bar Service', type: 'toggle' },
];

const SUB_VENUES_ROOFTOP: FilterDef[] = [
  { key: 'covered', label: 'Covered / Partially Covered', type: 'toggle' },
  { key: 'heated', label: 'Heated', type: 'toggle' },
  { key: 'rain_backup_indoor', label: 'Indoor Rain Backup', type: 'toggle' },
  { key: 'view_type', label: 'View Type', type: 'multi', options: [{ value: 'city', label: 'City Skyline' }, { value: 'lake', label: 'Lake' }, { value: 'garden', label: 'Garden' }] },
  { key: 'elevator_access', label: 'Elevator Access', type: 'toggle' },
  { key: 'wind_barriers', label: 'Wind Barriers', type: 'toggle' },
];

const SUB_VENUES_COMMUNITY: FilterDef[] = [
  { key: 'public_private', label: 'Type', type: 'single', options: [{ value: 'public', label: 'Public' }, { value: 'private', label: 'Private / Members' }] },
  { key: 'kitchen_grade', label: 'Kitchen Grade', type: 'single', options: [{ value: 'none', label: 'None' }, { value: 'kitchenette', label: 'Kitchenette' }, { value: 'commercial', label: 'Commercial' }] },
  { key: 'playground', label: 'Playground Onsite', type: 'toggle' },
  { key: 'alcohol_prohibited', label: 'Alcohol Prohibited', type: 'toggle' },
  { key: 'insurance_required', label: 'Event Insurance Required', type: 'toggle' },
];

const SUB_VENUES_QUINCEANERA: FilterDef[] = [
  { key: 'grand_staircase', label: 'Grand Staircase', type: 'toggle' },
  { key: 'chair_covers', label: 'Chair Covers Included', type: 'toggle' },
  { key: 'last_dance_extension', label: 'Last Dance Extension Available', type: 'toggle' },
  { key: 'court_of_honor_space', label: 'Court of Honor Space', type: 'toggle' },
  { key: 'crowning_area', label: 'Crowning Area', type: 'toggle' },
  { key: 'mass_onsite', label: 'Mass / Chapel Onsite', type: 'toggle' },
];

const SUB_VENUES_SWEET16: FilterDef[] = [
  { key: 'photo_booth_friendly', label: 'Photo Booth Ready', type: 'toggle' },
  { key: 'candy_bar', label: 'Candy Bar Setup', type: 'toggle' },
  { key: 'vip_lounge', label: 'VIP Lounge Area', type: 'toggle' },
  { key: 'social_media_wall', label: 'Social Media Wall', type: 'toggle' },
  { key: 'glow_party', label: 'Glow Party Capable', type: 'toggle' },
  { key: 'security_required', label: 'Security Provided', type: 'toggle' },
];

const SUB_VENUES_MITZVAH: FilterDef[] = [
  { key: 'kosher_catering', label: 'Kosher Catering Available', type: 'toggle' },
  { key: 'separate_seating', label: 'Separate Seating Option', type: 'toggle' },
  { key: 'torah_storage', label: 'Torah Storage', type: 'toggle' },
  { key: 'horah_space', label: 'Horah / Dance Circle Space', type: 'toggle' },
  { key: 'shabbat', label: 'Shabbat Elevator', type: 'toggle' },
  { key: 'candle_lighting', label: 'Candle Lighting Area', type: 'toggle' },
];

const SUB_VENUES_PROM: FilterDef[] = [
  { key: 'red_carpet', label: 'Red Carpet Entry', type: 'toggle' },
  { key: 'coat_check', label: 'Coat Check', type: 'toggle' },
  { key: 'chaperone_policy', label: 'Chaperone Policy', type: 'single', options: [{ value: 'not_required', label: 'Not Required' }, { value: 'required', label: 'Required' }] },
  { key: 'ventilation', label: 'Good Ventilation / AC', type: 'toggle' },
  { key: 'no_glitter_rule', label: 'No Glitter Policy', type: 'toggle' },
  { key: 'professional_security', label: 'Professional Security', type: 'toggle' },
  { key: 'photo_package', label: 'Photo Package Available', type: 'toggle' },
];

// PLANNING subcategory-specific filters
const SUB_PLANNING_EVENT: FilterDef[] = [
  { key: 'event_types', label: 'Event Types', type: 'multi', options: [{ value: 'corporate', label: 'Corporate' }, { value: 'birthday', label: 'Birthday' }, { value: 'baby_shower', label: 'Baby Shower' }, { value: 'quincea', label: 'Quinceañera' }, { value: 'wedding', label: 'Wedding' }, { value: 'fundraiser', label: 'Fundraiser' }] },
  { key: 'team_size', label: 'Team Size', type: 'single', options: [{ value: 'solo', label: 'Solo Planner' }, { value: 'small', label: 'Small Team (2–4)' }, { value: 'full', label: 'Full Agency' }] },
  { key: 'planning_timeline', label: 'Planning Timeline', type: 'single', options: [{ value: 'last_minute', label: 'Last-Minute (< 4 wks)' }, { value: 'short', label: '1–3 Months' }, { value: 'standard', label: '3–6 Months' }, { value: 'full', label: '6 + Months' }] },
  { key: 'vendor_network', label: 'Vendor Network', type: 'toggle' },
  { key: 'day_of_coordination', label: 'Day-Of Coordination', type: 'toggle' },
];

const SUB_PLANNING_WEDDING: FilterDef[] = [
  { key: 'wedding_style', label: 'Wedding Style', type: 'multi', options: [{ value: 'traditional', label: 'Traditional' }, { value: 'modern', label: 'Modern' }, { value: 'boho', label: 'Boho' }, { value: 'destination', label: 'Destination' }, { value: 'elopement', label: 'Elopement' }] },
  { key: 'service_level', label: 'Service Level', type: 'single', options: [{ value: 'day_of', label: 'Day-Of Only' }, { value: 'partial', label: 'Partial Planning' }, { value: 'full', label: 'Full-Service' }] },
  { key: 'budget_management', label: 'Budget Management', type: 'toggle' },
  { key: 'destination_capable', label: 'Destination Weddings', type: 'toggle' },
  { key: 'lgbtq_friendly', label: 'LGBTQ+ Affirming', type: 'toggle' },
];

const SUB_PLANNING_OFFICIANT: FilterDef[] = [
  { key: 'ceremony_style', label: 'Ceremony Style', type: 'multi', options: [{ value: 'religious', label: 'Religious' }, { value: 'non_religious', label: 'Non-Religious' }, { value: 'spiritual', label: 'Spiritual' }, { value: 'custom', label: 'Custom / Written' }] },
  { key: 'legally_ordained', label: 'Legally Ordained', type: 'toggle' },
  { key: 'bilingual', label: 'Bilingual', type: 'toggle' },
  { key: 'rehearsal_included', label: 'Rehearsal Included', type: 'toggle' },
];

// CATERING subcategory-specific filters
const SUB_CATERING_WEDDING: FilterDef[] = [
  { key: 'tasting_event', label: 'Private Tasting Event', type: 'toggle' },
  { key: 'cake_cutting', label: 'Cake Cutting Service', type: 'toggle' },
  { key: 'cocktail_hour', label: 'Cocktail Hour Package', type: 'toggle' },
  { key: 'late_night_snack', label: 'Late Night Snack Option', type: 'toggle' },
  { key: 'bridal_brunch', label: 'Bridal Brunch', type: 'toggle' },
];

const SUB_CATERING_PARTY: FilterDef[] = [
  { key: 'finger_foods', label: 'Finger Foods / Appetizers', type: 'toggle' },
  { key: 'themed_menus', label: 'Themed Menus', type: 'toggle' },
  { key: 'kids_menu', label: "Kids' Menu", type: 'toggle' },
  { key: 'chafing_equipment', label: 'Chafing Equipment Provided', type: 'toggle' },
];

const SUB_CATERING_BAKERY: FilterDef[] = [
  { key: 'custom_designs', label: 'Custom Cake Designs', type: 'toggle' },
  { key: 'gluten_free', label: 'Gluten-Free Available', type: 'toggle' },
  { key: 'vegan_options', label: 'Vegan Options', type: 'toggle' },
  { key: 'pickup_delivery', label: 'Delivery Available', type: 'toggle' },
  { key: 'tasting_box', label: 'Tasting Box', type: 'toggle' },
];

const SUB_CATERING_CAKES: FilterDef[] = [
  { key: 'tiers', label: 'Tiers', type: 'single', options: [{ value: '1', label: '1 Tier' }, { value: '2', label: '2 Tiers' }, { value: '3', label: '3 Tiers' }, { value: '4plus', label: '4+ Tiers' }] },
  { key: 'flavor_options', label: 'Flavor Options', type: 'multi', options: [{ value: 'vanilla', label: 'Vanilla' }, { value: 'chocolate', label: 'Chocolate' }, { value: 'red_velvet', label: 'Red Velvet' }, { value: 'lemon', label: 'Lemon' }, { value: 'custom', label: 'Custom Flavor' }] },
  { key: 'fondant_or_buttercream', label: 'Finish', type: 'single', options: [{ value: 'fondant', label: 'Fondant' }, { value: 'buttercream', label: 'Buttercream' }, { value: 'naked', label: 'Naked Cake' }] },
];

const SUB_CATERING_TRUCKS: FilterDef[] = [
  { key: 'cuisine_type', label: 'Cuisine', type: 'multi', options: [{ value: 'tacos', label: 'Tacos' }, { value: 'bbq', label: 'BBQ' }, { value: 'pizza', label: 'Pizza' }, { value: 'burgers', label: 'Burgers' }, { value: 'vegan', label: 'Vegan' }, { value: 'desserts', label: 'Desserts' }] },
  { key: 'private_event', label: 'Private Event Booking', type: 'toggle' },
  { key: 'permits', label: 'All Permits Included', type: 'toggle' },
  { key: 'generator', label: 'Self-Powered Generator', type: 'toggle' },
];

const SUB_CATERING_BAR: FilterDef[] = [
  { key: 'bartender_count', label: 'Bartenders', type: 'single', options: [{ value: '1', label: '1 Bartender' }, { value: '2', label: '2 Bartenders' }, { value: '3plus', label: '3+ Bartenders' }] },
  { key: 'mobile_bar', label: 'Mobile Bar Setup', type: 'toggle' },
  { key: 'signature_cocktails', label: 'Signature Cocktails', type: 'toggle' },
  { key: 'beer_wine_only', label: 'Beer & Wine Only Option', type: 'toggle' },
  { key: 'non_alcoholic', label: 'Non-Alcoholic Options', type: 'toggle' },
];

const SUB_CATERING_WINE: FilterDef[] = [
  { key: 'tasting_room', label: 'Tasting Room', type: 'toggle' },
  { key: 'case_discounts', label: 'Case Discounts', type: 'toggle' },
  { key: 'local_brands', label: 'Local Brands', type: 'toggle' },
  { key: 'delivery_available', label: 'Delivery Available', type: 'toggle' },
];

// BARS subcategory-specific filters
const SUB_BARS_COCKTAIL: FilterDef[] = [
  { key: 'cocktail_style', label: 'Cocktail Style', type: 'multi', options: [{ value: 'classic', label: 'Classic' }, { value: 'craft', label: 'Craft / Modern' }, { value: 'tiki', label: 'Tiki' }, { value: 'molecular', label: 'Molecular / Experimental' }] },
  { key: 'house_infusions', label: 'House Infusions', type: 'toggle' },
  { key: 'mocktail_menu', label: 'Mocktail Menu', type: 'toggle' },
  { key: 'private_events', label: 'Private Events', type: 'toggle' },
];

const SUB_BARS_WINE: FilterDef[] = [
  { key: 'wine_style', label: 'Wine Focus', type: 'multi', options: [{ value: 'old_world', label: 'Old World' }, { value: 'new_world', label: 'New World' }, { value: 'natural', label: 'Natural' }, { value: 'biodynamic', label: 'Biodynamic' }] },
  { key: 'flights', label: 'Wine Flights', type: 'toggle' },
  { key: 'cheese_board', label: 'Cheese / Charcuterie Board', type: 'toggle' },
  { key: 'bottle_service', label: 'Bottle Service', type: 'toggle' },
];

const SUB_BARS_BREWERY: FilterDef[] = [
  { key: 'beer_style', label: 'Beer Style', type: 'multi', options: [{ value: 'ipa', label: 'IPA' }, { value: 'stout', label: 'Stout' }, { value: 'lager', label: 'Lager' }, { value: 'sour', label: 'Sour' }, { value: 'wheat', label: 'Wheat' }] },
  { key: 'tours', label: 'Brewery Tours', type: 'toggle' },
  { key: 'taproom', label: 'Taproom', type: 'toggle' },
  { key: 'can_purchase', label: 'Cans / Bottles to Go', type: 'toggle' },
];

const SUB_BARS_BEER_GARDEN: FilterDef[] = [
  { key: 'heated_outdoor', label: 'Heated Outdoor Area', type: 'toggle' },
  { key: 'games', label: 'Yard Games', type: 'toggle' },
  { key: 'food_menu', label: 'Food Menu', type: 'toggle' },
  { key: 'pet_friendly', label: 'Pet Friendly', type: 'toggle' },
];

const SUB_BARS_SPEAKEASY: FilterDef[] = [
  { key: 'reservation_required', label: 'Reservation Required', type: 'toggle' },
  { key: 'password_entry', label: 'Password / Secret Entry', type: 'toggle' },
  { key: 'live_jazz', label: 'Live Jazz', type: 'toggle' },
  { key: 'dress_code', label: 'Dress Code', type: 'toggle' },
];

const SUB_BARS_DIVE: FilterDef[] = [
  { key: 'pool_table', label: 'Pool Table', type: 'toggle' },
  { key: 'jukebox', label: 'Jukebox', type: 'toggle' },
  { key: 'cash_only', label: 'Cash Only', type: 'toggle' },
  { key: 'cheap_drinks', label: 'Cheap Drinks (< $5)', type: 'toggle' },
];

const SUB_BARS_KARAOKE: FilterDef[] = [
  { key: 'private_rooms', label: 'Private Karaoke Rooms', type: 'toggle' },
  { key: 'song_library', label: 'Song Library Size', type: 'single', options: [{ value: 'small', label: 'Small (< 1k)' }, { value: 'medium', label: 'Medium (1–5k)' }, { value: 'large', label: 'Large (5k+)' }] },
  { key: 'food_service', label: 'Food Service', type: 'toggle' },
  { key: 'english_korean', label: 'Korean / Asian Selection', type: 'toggle' },
];

const SUB_BARS_GAY: FilterDef[] = [
  { key: 'drag_shows', label: 'Drag Shows', type: 'toggle' },
  { key: 'dance_floor', label: 'Dance Floor', type: 'toggle' },
  { key: 'all_genders', label: 'All Gender Restrooms', type: 'toggle' },
  { key: 'lgbtq_events', label: 'Regular LGBTQ+ Events', type: 'toggle' },
];

const SUB_BARS_HAPPY_HOUR: FilterDef[] = [
  { key: 'happy_hour_days', label: 'Happy Hour Days', type: 'multi', options: [{ value: 'weekdays', label: 'Weekdays' }, { value: 'saturday', label: 'Saturday' }, { value: 'sunday', label: 'Sunday' }] },
  { key: 'food_deals', label: 'Food Deals', type: 'toggle' },
  { key: 'draft_specials', label: 'Draft Beer Specials', type: 'toggle' },
  { key: 'shot_specials', label: 'Shot Specials', type: 'toggle' },
];

const SUB_BARS_BOTTOMLESS_BRUNCH: FilterDef[] = [
  { key: 'duration', label: 'Bottomless Duration', type: 'single', options: [{ value: '90min', label: '90 min' }, { value: '2hr', label: '2 hrs' }, { value: 'unlimited', label: 'Unlimited' }] },
  { key: 'brunch_food', label: 'Brunch Food Menu', type: 'toggle' },
  { key: 'reservations_required', label: 'Reservations Required', type: 'toggle' },
  { key: 'mimosa_bellini', label: 'Mimosas / Bellinis', type: 'toggle' },
];

const SUB_BARS_IRISH: FilterDef[] = [
  { key: 'live_irish_music', label: 'Live Irish Music', type: 'toggle' },
  { key: 'whiskey_selection', label: 'Whiskey Selection', type: 'toggle' },
  { key: 'stout_on_draft', label: 'Stout on Draft', type: 'toggle' },
  { key: 'pub_food', label: 'Pub Food', type: 'toggle' },
];

const SUB_BARS_LATE_NIGHT: FilterDef[] = [
  { key: 'last_call', label: 'Last Call Time', type: 'single', options: [{ value: '1am', label: '1 AM' }, { value: '2am', label: '2 AM' }, { value: '3am', label: '3 AM' }, { value: 'bar_time', label: 'Bar Time (legal close)' }] },
  { key: 'late_night_kitchen', label: 'Late-Night Kitchen', type: 'toggle' },
  { key: 'dj_after_midnight', label: 'DJ After Midnight', type: 'toggle' },
  { key: 'coat_check', label: 'Coat Check', type: 'toggle' },
];

// RESTAURANTS subcategory-specific filters
const SUB_RESTAURANT_FINE: FilterDef[] = [
  { key: 'dress_code', label: 'Dress Code', type: 'single', options: [{ value: 'none', label: 'None' }, { value: 'smart_casual', label: 'Smart Casual' }, { value: 'formal', label: 'Formal' }] },
  { key: 'tasting_menu', label: 'Tasting Menu', type: 'toggle' },
  { key: 'sommelier', label: 'Sommelier on Staff', type: 'toggle' },
  { key: 'prix_fixe', label: 'Prix Fixe', type: 'toggle' },
];

const SUB_RESTAURANT_ROMANTIC: FilterDef[] = [
  { key: 'candlelit', label: 'Candlelit Ambiance', type: 'toggle' },
  { key: 'live_music', label: 'Live Music', type: 'toggle' },
  { key: 'private_table', label: 'Private Table Available', type: 'toggle' },
  { key: 'tasting_menu', label: 'Tasting Menu', type: 'toggle' },
];

const SUB_RESTAURANT_STEAKHOUSE: FilterDef[] = [
  { key: 'dry_aged', label: 'Dry Aged Steaks', type: 'toggle' },
  { key: 'wagyu', label: 'Wagyu / Premium Cuts', type: 'toggle' },
  { key: 'raw_bar', label: 'Raw Bar', type: 'toggle' },
  { key: 'private_rooms', label: 'Private Dining Rooms', type: 'toggle' },
];

const SUB_RESTAURANT_PRIVATE: FilterDef[] = [
  { key: 'room_capacity', label: 'Room Capacity', type: 'single', options: [{ value: '10', label: 'Up to 10' }, { value: '25', label: 'Up to 25' }, { value: '50', label: 'Up to 50' }, { value: '100plus', label: '100+' }] },
  { key: 'av_included', label: 'AV Equipment', type: 'toggle' },
  { key: 'custom_menu', label: 'Custom Menu', type: 'toggle' },
  { key: 'minimum_spend', label: 'Minimum Spend Required', type: 'toggle' },
];

const SUB_RESTAURANT_REHEARSAL: FilterDef[] = [
  { key: 'private_room', label: 'Private Room', type: 'toggle' },
  { key: 'custom_menu', label: 'Custom Menu', type: 'toggle' },
  { key: 'group_min', label: 'Min Group Size', type: 'single', options: [{ value: '10', label: '10+' }, { value: '20', label: '20+' }, { value: '40', label: '40+' }] },
  { key: 'toast_friendly', label: 'Microphone / Toast Setup', type: 'toggle' },
];

const SUB_RESTAURANT_BRUNCH: FilterDef[] = [
  { key: 'bottomless_option', label: 'Bottomless Drinks Option', type: 'toggle' },
  { key: 'weekend_only', label: 'Weekend Only', type: 'toggle' },
  { key: 'brunch_hours', label: 'Brunch Hours', type: 'single', options: [{ value: 'early', label: 'Early (7–10 AM)' }, { value: 'mid', label: 'Mid (10 AM – Noon)' }, { value: 'late', label: 'Late (Noon – 3 PM)' }] },
  { key: 'kids_menu', label: "Kids' Menu", type: 'toggle' },
];

const SUB_RESTAURANT_OUTDOOR: FilterDef[] = [
  { key: 'heated_patio', label: 'Heated Patio', type: 'toggle' },
  { key: 'covered', label: 'Covered Outdoor', type: 'toggle' },
  { key: 'pet_friendly', label: 'Pet Friendly Patio', type: 'toggle' },
  { key: 'waterfront', label: 'Waterfront View', type: 'toggle' },
];

const SUB_RESTAURANT_GROUP: FilterDef[] = [
  { key: 'large_group_min', label: 'Accepts Groups Of', type: 'single', options: [{ value: '8', label: '8+' }, { value: '15', label: '15+' }, { value: '30', label: '30+' }, { value: '50', label: '50+' }] },
  { key: 'semi_private', label: 'Semi-Private Area', type: 'toggle' },
  { key: 'set_menu', label: 'Set Group Menu', type: 'toggle' },
  { key: 'split_checks', label: 'Split Checks OK', type: 'toggle' },
];

const SUB_RESTAURANT_FARM: FilterDef[] = [
  { key: 'local_sourcing', label: 'Locally Sourced', type: 'toggle' },
  { key: 'seasonal_menu', label: 'Seasonal Menu', type: 'toggle' },
  { key: 'organic', label: 'Organic Ingredients', type: 'toggle' },
  { key: 'butcher_in_house', label: 'In-House Butcher', type: 'toggle' },
];

const SUB_RESTAURANT_GASTROPUB: FilterDef[] = [
  { key: 'craft_beer', label: 'Craft Beer Selection', type: 'toggle' },
  { key: 'elevated_pub_food', label: 'Elevated Pub Food', type: 'toggle' },
  { key: 'sports_friendly', label: 'Sports TV Screens', type: 'toggle' },
  { key: 'patio', label: 'Patio', type: 'toggle' },
];

// Entertainment subcategory-specific filters
const SUB_ENT_DJ_WEDDING: FilterDef[] = [
  { key: 'ceremony_sound', label: 'Ceremony Sound', type: 'toggle' },
  { key: 'cocktail_hour', label: 'Cocktail Hour Set', type: 'toggle' },
  { key: 'emcee_included', label: 'Emcee Services', type: 'toggle' },
  { key: 'custom_playlist', label: 'Custom Playlist', type: 'toggle' },
  { key: 'uplighting', label: 'Uplighting', type: 'toggle' },
  { key: 'monogram', label: 'Monogram / Gobo', type: 'toggle' },
  { key: 'backup_dj', label: 'Backup DJ', type: 'toggle' },
];

const SUB_ENT_DJ_PARTY: FilterDef[] = [
  { key: 'genre', label: 'Genre', type: 'multi', options: [{ value: 'hip_hop', label: 'Hip-Hop' }, { value: 'rnb', label: 'R&B' }, { value: 'top40', label: 'Top 40' }, { value: 'edm', label: 'EDM' }, { value: 'reggae', label: 'Reggae' }, { value: 'latin', label: 'Latin' }] },
  { key: 'lighting_package', label: 'Lighting Package', type: 'toggle' },
  { key: 'fog_machine', label: 'Fog / CO2 Machine', type: 'toggle' },
  { key: 'outdoor_capable', label: 'Outdoor Capable', type: 'toggle' },
];

const SUB_ENT_DJ_LATIN: FilterDef[] = [
  { key: 'latin_genre', label: 'Latin Genre', type: 'multi', options: [{ value: 'salsa', label: 'Salsa' }, { value: 'merengue', label: 'Merengue' }, { value: 'reggaeton', label: 'Reggaeton' }, { value: 'cumbia', label: 'Cumbia' }, { value: 'bachata', label: 'Bachata' }] },
  { key: 'bilingual_mc', label: 'Bilingual MC', type: 'toggle' },
];

const SUB_ENT_DJ_PROM: FilterDef[] = [
  { key: 'school_approved', label: 'School-Approved', type: 'toggle' },
  { key: 'explicit_free', label: 'Explicit-Free Sets', type: 'toggle' },
  { key: 'lighting_show', label: 'Full Lighting Show', type: 'toggle' },
  { key: 'photo_booth_sync', label: 'Photo Booth Sync', type: 'toggle' },
];

const SUB_ENT_BAND: FilterDef[] = [
  { key: 'band_size', label: 'Band Size', type: 'single', options: [{ value: 'duo', label: 'Duo' }, { value: 'trio', label: 'Trio' }, { value: 'quartet', label: 'Quartet' }, { value: '5plus', label: '5+ Piece' }] },
  { key: 'genre', label: 'Genre', type: 'multi', options: [{ value: 'cover', label: 'Cover Band' }, { value: 'jazz', label: 'Jazz' }, { value: 'rock', label: 'Rock' }, { value: 'funk_rnb', label: 'Funk / R&B' }, { value: 'country', label: 'Country' }, { value: 'classical', label: 'Classical' }] },
  { key: 'full_pa', label: 'Full PA System', type: 'toggle' },
  { key: 'learn_first_dance', label: 'Learn First Dance Song', type: 'toggle' },
];

const SUB_ENT_PHOTOBOOTH: FilterDef[] = [
  { key: 'booth_type', label: 'Booth Type', type: 'multi', options: [{ value: 'enclosed', label: 'Enclosed' }, { value: 'open_air', label: 'Open Air' }, { value: '360', label: '360°' }, { value: 'mirror', label: 'Mirror Booth' }] },
  { key: 'unlimited_prints', label: 'Unlimited Prints', type: 'toggle' },
  { key: 'digital_copies', label: 'Digital Copies', type: 'toggle' },
  { key: 'custom_overlay', label: 'Custom Overlay', type: 'toggle' },
  { key: 'guestbook', label: 'Guestbook Add-On', type: 'toggle' },
];

// PHOTOGRAPHY subcategory-specific filters
const SUB_PHOTO_WEDDING: FilterDef[] = [
  { key: 'editing_style', label: 'Editing Style', type: 'multi', options: [{ value: 'bright_airy', label: 'Bright & Airy' }, { value: 'dark_moody', label: 'Dark & Moody' }, { value: 'true_to_life', label: 'True to Life' }, { value: 'film', label: 'Film / Vintage' }] },
  { key: 'second_shooter', label: '2nd Shooter', type: 'toggle' },
  { key: 'engagement_session', label: 'Engagement Session', type: 'toggle' },
  { key: 'same_day_edit', label: 'Same-Day Edit', type: 'toggle' },
  { key: 'drone_available', label: 'Drone Photography', type: 'toggle' },
  { key: 'album_design', label: 'Album Design', type: 'toggle' },
];

const SUB_PHOTO_VIDEO: FilterDef[] = [
  { key: 'highlight_reel', label: 'Highlight Reel', type: 'toggle' },
  { key: 'full_length_edit', label: 'Full Length Edit', type: 'toggle' },
  { key: 'drone_video', label: 'Drone Footage', type: 'toggle' },
  { key: 'same_day_reel', label: 'Same-Day Reel', type: 'toggle' },
  { key: 'live_stream', label: 'Live Stream', type: 'toggle' },
];

// FLORAL subcategory-specific filters
const SUB_FLORAL_DESIGNER: FilterDef[] = [
  { key: 'floral_style', label: 'Style', type: 'multi', options: [{ value: 'romantic', label: 'Romantic / Garden' }, { value: 'modern', label: 'Modern / Minimal' }, { value: 'boho', label: 'Boho / Wildflower' }, { value: 'tropical', label: 'Tropical' }, { value: 'classic', label: 'Classic / Formal' }] },
  { key: 'installation_capable', label: 'Large Installations', type: 'toggle' },
  { key: 'preserved_flowers', label: 'Preserved Flowers', type: 'toggle' },
  { key: 'event_consultation', label: 'Event Consultation', type: 'toggle' },
];

const SUB_FLORAL_BALLOON: FilterDef[] = [
  { key: 'balloon_type', label: 'Balloon Type', type: 'multi', options: [{ value: 'arch', label: 'Arch' }, { value: 'column', label: 'Column' }, { value: 'wall', label: 'Balloon Wall' }, { value: 'organic', label: 'Organic / Sculpture' }] },
  { key: 'helium', label: 'Helium Balloons', type: 'toggle' },
  { key: 'custom_colors', label: 'Custom Colors', type: 'toggle' },
];

const SUB_FLORAL_DECOR_RENTALS: FilterDef[] = [
  { key: 'centerpieces', label: 'Centerpieces', type: 'toggle' },
  { key: 'backdrop', label: 'Backdrop / Arch Rental', type: 'toggle' },
  { key: 'delivery_setup', label: 'Delivery & Setup', type: 'toggle' },
  { key: 'custom_design', label: 'Custom Design', type: 'toggle' },
];

const SUB_FLORAL_STATIONERY: FilterDef[] = [
  { key: 'invitation_suite', label: 'Full Invitation Suite', type: 'toggle' },
  { key: 'digital_available', label: 'Digital Option', type: 'toggle' },
  { key: 'custom_design', label: 'Custom Design', type: 'toggle' },
  { key: 'rush_orders', label: 'Rush Orders', type: 'toggle' },
];

// BEAUTY subcategory-specific filters
const SUB_BEAUTY_BRIDAL: FilterDef[] = [
  { key: 'bridal_party_booking', label: 'Full Bridal Party Booking', type: 'toggle' },
  { key: 'airbrush', label: 'Airbrush Makeup', type: 'toggle' },
  { key: 'trial_session', label: 'Trial Session', type: 'toggle' },
  { key: 'on_location', label: 'On-Location Service', type: 'toggle' },
  { key: 'early_morning', label: 'Early Morning Available', type: 'toggle' },
];

const SUB_BEAUTY_ALTERATIONS: FilterDef[] = [
  { key: 'bridal_alterations', label: 'Bridal Dress Alterations', type: 'toggle' },
  { key: 'rush_service', label: 'Rush Service Available', type: 'toggle' },
  { key: 'custom_tailoring', label: 'Custom Tailoring', type: 'toggle' },
  { key: 'mens_alterations', label: "Men's Alterations", type: 'toggle' },
];

const SUB_BEAUTY_SPA: FilterDef[] = [
  { key: 'couples_services', label: 'Couples Services', type: 'toggle' },
  { key: 'group_packages', label: 'Group / Bachelorette Packages', type: 'toggle' },
  { key: 'massage', label: 'Massage', type: 'toggle' },
  { key: 'facials', label: 'Facials', type: 'toggle' },
  { key: 'nails', label: 'Nail Services', type: 'toggle' },
];

// ATTIRE subcategory-specific filters
const SUB_ATTIRE_DRESS: FilterDef[] = [
  { key: 'style', label: 'Style', type: 'multi', options: [{ value: 'a_line', label: 'A-Line' }, { value: 'ballgown', label: 'Ball Gown' }, { value: 'mermaid', label: 'Mermaid' }, { value: 'sheath', label: 'Sheath' }, { value: 'boho', label: 'Boho' }] },
  { key: 'plus_size', label: 'Plus Size', type: 'toggle' },
  { key: 'rental_option', label: 'Rental Option', type: 'toggle' },
  { key: 'alterations_inhouse', label: 'In-House Alterations', type: 'toggle' },
];

const SUB_ATTIRE_JEWELERS: FilterDef[] = [
  { key: 'custom_design', label: 'Custom Design', type: 'toggle' },
  { key: 'engagement_rings', label: 'Engagement Rings', type: 'toggle' },
  { key: 'repair_service', label: 'Repair / Resize', type: 'toggle' },
  { key: 'lab_grown', label: 'Lab-Grown Diamonds', type: 'toggle' },
];

// TRANSPORTATION subcategory-specific filters
const SUB_TRANSPORT_GENERAL: FilterDef[] = [
  { key: 'vehicle_type', label: 'Vehicle Type', type: 'multi', options: [{ value: 'limo', label: 'Limo' }, { value: 'sprinter', label: 'Sprinter' }, { value: 'sedan', label: 'Sedan / SUV' }, { value: 'trolley', label: 'Trolley' }, { value: 'vintage', label: 'Vintage Car' }] },
  { key: 'airport_transfer', label: 'Airport Transfer', type: 'toggle' },
  { key: 'wedding_decor', label: 'Wedding Decoration', type: 'toggle' },
  { key: 'champagne', label: 'Champagne Included', type: 'toggle' },
];

const SUB_TRANSPORT_PARTY_BUS: FilterDef[] = [
  { key: 'capacity', label: 'Capacity', type: 'single', options: [{ value: '10', label: 'Up to 10' }, { value: '20', label: 'Up to 20' }, { value: '30', label: 'Up to 30' }, { value: '40plus', label: '40+' }] },
  { key: 'dance_floor', label: 'Dance Floor', type: 'toggle' },
  { key: 'led_lights', label: 'LED Lighting', type: 'toggle' },
  { key: 'sound_system', label: 'Sound System', type: 'toggle' },
  { key: 'bar_onboard', label: 'Bar Onboard', type: 'toggle' },
  { key: 'stripper_pole', label: 'Pole (Optional)', type: 'toggle' },
];

// RENTALS subcategory-specific filters
const SUB_RENTALS_PARTY: FilterDef[] = [
  { key: 'item_type', label: 'Item Type', type: 'multi', options: [{ value: 'tables', label: 'Tables' }, { value: 'chairs', label: 'Chairs' }, { value: 'tents', label: 'Tents' }, { value: 'linens', label: 'Linens' }, { value: 'lighting', label: 'Lighting' }] },
  { key: 'setup_included', label: 'Setup Included', type: 'toggle' },
  { key: 'takedown_included', label: 'Takedown Included', type: 'toggle' },
  { key: 'delivery_available', label: 'Delivery Available', type: 'toggle' },
];

const SUB_RENTALS_TENT: FilterDef[] = [
  { key: 'tent_type', label: 'Tent Type', type: 'multi', options: [{ value: 'frame', label: 'Frame Tent' }, { value: 'pole', label: 'Pole Tent' }, { value: 'clear_span', label: 'Clear Span' }, { value: 'sailcloth', label: 'Sailcloth' }] },
  { key: 'flooring', label: 'Flooring Available', type: 'toggle' },
  { key: 'sidewalls', label: 'Sidewalls', type: 'toggle' },
  { key: 'climate_control', label: 'Climate Control', type: 'toggle' },
];

const SUB_RENTALS_FURNITURE: FilterDef[] = [
  { key: 'style', label: 'Style', type: 'multi', options: [{ value: 'modern', label: 'Modern' }, { value: 'rustic', label: 'Rustic' }, { value: 'chiavari', label: 'Chiavari' }, { value: 'ghost', label: 'Ghost / Acrylic' }] },
  { key: 'lounge_furniture', label: 'Lounge Furniture', type: 'toggle' },
  { key: 'high_top_tables', label: 'High-Top Tables', type: 'toggle' },
];

const SUB_RENTALS_LINEN: FilterDef[] = [
  { key: 'linen_material', label: 'Material', type: 'multi', options: [{ value: 'polyester', label: 'Polyester' }, { value: 'satin', label: 'Satin' }, { value: 'sequin', label: 'Sequin' }, { value: 'lace', label: 'Lace' }] },
  { key: 'custom_colors', label: 'Custom Colors', type: 'toggle' },
  { key: 'napkins_included', label: 'Napkins Included', type: 'toggle' },
];

const SUB_RENTALS_DINNERWARE: FilterDef[] = [
  { key: 'plate_style', label: 'Plate Style', type: 'multi', options: [{ value: 'white_china', label: 'White China' }, { value: 'charger', label: 'Charger Plates' }, { value: 'vintage', label: 'Vintage' }, { value: 'rustic', label: 'Rustic' }] },
  { key: 'glassware', label: 'Glassware Included', type: 'toggle' },
  { key: 'flatware', label: 'Flatware Included', type: 'toggle' },
  { key: 'wash_before_return', label: 'Wash Before Return OK', type: 'toggle' },
];

const SUB_RENTALS_LIGHTING_AV: FilterDef[] = [
  { key: 'av_type', label: 'AV Type', type: 'multi', options: [{ value: 'projector', label: 'Projector' }, { value: 'screen', label: 'Screen' }, { value: 'led_wall', label: 'LED Wall' }, { value: 'microphone', label: 'Microphone / PA' }] },
  { key: 'uplighting', label: 'Uplighting', type: 'toggle' },
  { key: 'string_lights', label: 'String Lights', type: 'toggle' },
  { key: 'gobos', label: 'Gobos / Monograms', type: 'toggle' },
  { key: 'tech_support', label: 'Tech Support On-Site', type: 'toggle' },
];

const SUB_RENTALS_SOUND: FilterDef[] = [
  { key: 'speaker_power', label: 'Speaker Power', type: 'single', options: [{ value: 'small', label: 'Small (< 500W)' }, { value: 'medium', label: 'Medium (500–1500W)' }, { value: 'large', label: 'Large (1500W+)' }] },
  { key: 'wireless_mics', label: 'Wireless Mics', type: 'toggle' },
  { key: 'subwoofer', label: 'Subwoofer Included', type: 'toggle' },
  { key: 'operator_available', label: 'Operator Available', type: 'toggle' },
];

const SUB_RENTALS_STAGE: FilterDef[] = [
  { key: 'stage_height', label: 'Stage Height', type: 'single', options: [{ value: '8in', label: '8 in' }, { value: '16in', label: '16 in' }, { value: '24in', label: '24 in' }, { value: '32in', label: '32 in' }] },
  { key: 'guardrails', label: 'Guardrails', type: 'toggle' },
  { key: 'stairs_included', label: 'Stairs Included', type: 'toggle' },
  { key: 'outdoor_rated', label: 'Outdoor Rated', type: 'toggle' },
];

const SUB_RENTALS_BOUNCE: FilterDef[] = [
  { key: 'theme', label: 'Theme', type: 'multi', options: [{ value: 'princess', label: 'Princess' }, { value: 'superhero', label: 'Superhero' }, { value: 'tropical', label: 'Tropical' }, { value: 'sports', label: 'Sports' }, { value: 'generic', label: 'Generic' }] },
  { key: 'water_slide', label: 'Water Slide Option', type: 'toggle' },
  { key: 'combo_unit', label: 'Combo (Bounce + Slide)', type: 'toggle' },
  { key: 'attendant_included', label: 'Attendant Included', type: 'toggle' },
];

// HOTELS subcategory-specific filters
const SUB_HOTELS_HOTEL: FilterDef[] = [
  { key: 'wedding_block', label: 'Wedding Room Block', type: 'toggle' },
  { key: 'shuttle_to_venue', label: 'Shuttle to Venue', type: 'toggle' },
  { key: 'honeymoon_suite', label: 'Honeymoon Suite', type: 'toggle' },
  { key: 'pool', label: 'Pool', type: 'toggle' },
  { key: 'fitness_center', label: 'Fitness Center', type: 'toggle' },
  { key: 'restaurant_onsite', label: 'On-Site Restaurant', type: 'toggle' },
  { key: 'parking_included', label: 'Free Parking', type: 'toggle' },
];

const SUB_HOTELS_LODGE: FilterDef[] = [
  { key: 'fireplace', label: 'Fireplace', type: 'toggle' },
  { key: 'full_kitchen', label: 'Full Kitchen', type: 'toggle' },
  { key: 'hot_tub', label: 'Hot Tub', type: 'toggle' },
  { key: 'wooded_setting', label: 'Wooded / Nature Setting', type: 'toggle' },
  { key: 'sleeps', label: 'Sleeps', type: 'single', options: [{ value: '8', label: 'Up to 8' }, { value: '15', label: 'Up to 15' }, { value: '25', label: 'Up to 25' }, { value: '40plus', label: '40+' }] },
];

const SUB_HOTELS_RETREAT: FilterDef[] = [
  { key: 'all_inclusive', label: 'All-Inclusive', type: 'toggle' },
  { key: 'spa', label: 'Spa Onsite', type: 'toggle' },
  { key: 'group_minimum', label: 'Group Minimum Nights', type: 'single', options: [{ value: '1', label: '1 Night' }, { value: '2', label: '2 Nights' }, { value: '3plus', label: '3+ Nights' }] },
  { key: 'outdoor_ceremony', label: 'Outdoor Ceremony Site', type: 'toggle' },
];

const SUB_HOTELS_STR: FilterDef[] = [
  { key: 'entire_home', label: 'Entire Home', type: 'toggle' },
  { key: 'events_allowed', label: 'Events / Parties Allowed', type: 'toggle' },
  { key: 'downtown', label: 'Downtown Location', type: 'toggle' },
  { key: 'min_nights', label: 'Min Stay', type: 'single', options: [{ value: '1', label: '1 Night' }, { value: '2', label: '2 Nights' }, { value: '3plus', label: '3+ Nights' }] },
];

// ── MAIN CATEGORY DEFINITIONS ─────────────────────────────────────────────────
export const NAV_CATEGORIES: NavCategory[] = [
  {
    key: 'venues',
    label: 'Venues & Event Spaces',
    iconName: 'building',
    defaultFilterSchema: 'venues_base',
    subcategories: [
      { label: 'Wedding Venues', filterSchemaKey: 'venues_wedding', filters: SUB_VENUES_WEDDING },
      { label: 'Banquet Halls', filterSchemaKey: 'venues_banquet', filters: SUB_VENUES_BANQUET },
      { label: 'Outdoor Venues', filterSchemaKey: 'venues_outdoor', filters: SUB_VENUES_OUTDOOR },
      { label: 'Corporate Event Venues', filterSchemaKey: 'venues_corporate', filters: SUB_VENUES_CORPORATE },
      { label: 'Party Venues', filterSchemaKey: 'venues_party', filters: SUB_VENUES_PARTY },
      { label: 'Small Event Spaces', filterSchemaKey: 'venues_small', filters: SUB_VENUES_SMALL },
      { label: 'Birthday Party Venues', filterSchemaKey: 'venues_birthday', filters: SUB_VENUES_BIRTHDAY },
      { label: 'Bridal Shower Venues', filterSchemaKey: 'venues_bridal_shower', filters: SUB_VENUES_BRIDAL_SHOWER },
      { label: 'Baby Shower Venues', filterSchemaKey: 'venues_baby_shower', filters: SUB_VENUES_BABY_SHOWER },
      { label: 'Concert Venues', filterSchemaKey: 'venues_concert', filters: SUB_VENUES_CONCERT },
      { label: 'Rooftop Venues', filterSchemaKey: 'venues_rooftop', filters: SUB_VENUES_ROOFTOP },
      { label: 'Community Centers', filterSchemaKey: 'venues_community', filters: SUB_VENUES_COMMUNITY },
      { label: 'Quinceañera Venues', filterSchemaKey: 'venues_quinceanera', filters: SUB_VENUES_QUINCEANERA },
      { label: 'Sweet 16 Venues', filterSchemaKey: 'venues_sweet16', filters: SUB_VENUES_SWEET16 },
      { label: 'Bar/Bat Mitzvah Venues', filterSchemaKey: 'venues_mitzvah', filters: SUB_VENUES_MITZVAH },
      { label: 'Prom Venues', filterSchemaKey: 'venues_prom', filters: SUB_VENUES_PROM },
    ],
    filters: VENUE_FILTERS,
  },
  {
    key: 'event-planning',
    label: 'Event Planning',
    iconName: 'clipboard',
    defaultFilterSchema: 'planning_event',
    subcategories: [
      { label: 'Event Planners', filterSchemaKey: 'planning_event', filters: SUB_PLANNING_EVENT },
      { label: 'Wedding Planners', filterSchemaKey: 'planning_wedding', filters: SUB_PLANNING_WEDDING },
      { label: 'Party Planners', filterSchemaKey: 'planning_event', filters: SUB_PLANNING_EVENT },
      { label: 'Corporate Event Planners', filterSchemaKey: 'planning_event', filters: SUB_PLANNING_EVENT },
      { label: 'Full-Service Planning', filterSchemaKey: 'planning_wedding', filters: SUB_PLANNING_WEDDING },
      { label: 'Officiants', filterSchemaKey: 'planning_officiant', filters: SUB_PLANNING_OFFICIANT },
      { label: 'Fundraising Events', filterSchemaKey: 'planning_event', filters: SUB_PLANNING_EVENT },
    ],
    filters: PLANNING_FILTERS,
  },
  {
    key: 'catering',
    label: 'Catering & Food',
    iconName: 'chef-hat',
    defaultFilterSchema: 'food_catering',
    subcategories: [
      { label: 'Caterers', filterSchemaKey: 'food_catering' },
      { label: 'Wedding Catering', filterSchemaKey: 'food_catering_wedding', filters: SUB_CATERING_WEDDING },
      { label: 'Party Catering', filterSchemaKey: 'food_catering_party', filters: SUB_CATERING_PARTY },
      { label: 'Bakeries & Cakes', filterSchemaKey: 'food_bakery', filters: SUB_CATERING_BAKERY },
      { label: 'Custom Cakes', filterSchemaKey: 'food_cakes', filters: SUB_CATERING_CAKES },
      { label: 'Food Trucks', filterSchemaKey: 'food_trucks', filters: SUB_CATERING_TRUCKS },
      { label: 'Bartending Services', filterSchemaKey: 'food_bar', filters: SUB_CATERING_BAR },
      { label: 'Wine & Spirits', filterSchemaKey: 'food_wine', filters: SUB_CATERING_WINE },
    ],
    filters: CATERING_FILTERS,
  },
  {
    key: 'bars',
    label: 'Bars & Nightlife',
    iconName: 'wine',
    defaultFilterSchema: 'bars_general',
    subcategories: [
      { label: 'Cocktail Bars', filterSchemaKey: 'bars_cocktail', filters: SUB_BARS_COCKTAIL },
      { label: 'Wine Bars', filterSchemaKey: 'bars_wine', filters: SUB_BARS_WINE },
      { label: 'Breweries', filterSchemaKey: 'bars_brewery', filters: SUB_BARS_BREWERY },
      { label: 'Beer Gardens', filterSchemaKey: 'bars_beer_garden', filters: SUB_BARS_BEER_GARDEN },
      { label: 'Speakeasy Bars', filterSchemaKey: 'bars_speakeasy', filters: SUB_BARS_SPEAKEASY },
      { label: 'Dive Bars', filterSchemaKey: 'bars_dive', filters: SUB_BARS_DIVE },
      { label: 'Karaoke Bars', filterSchemaKey: 'bars_karaoke', filters: SUB_BARS_KARAOKE },
      { label: 'Gay Bars', filterSchemaKey: 'bars_gay', filters: SUB_BARS_GAY },
      { label: 'Happy Hour', filterSchemaKey: 'bars_happy_hour', filters: SUB_BARS_HAPPY_HOUR },
      { label: 'Bottomless Brunch', filterSchemaKey: 'bars_bottomless_brunch', filters: SUB_BARS_BOTTOMLESS_BRUNCH },
      { label: 'Irish Pubs', filterSchemaKey: 'bars_irish', filters: SUB_BARS_IRISH },
      { label: 'Late Night', filterSchemaKey: 'bars_late_night', filters: SUB_BARS_LATE_NIGHT },
    ],
    filters: BARS_FILTERS,
  },
  {
    key: 'restaurants',
    label: 'Restaurants & Dining',
    iconName: 'utensils',
    defaultFilterSchema: 'restaurant_base',
    subcategories: [
      { label: 'Fine Dining', filterSchemaKey: 'restaurant_fine', filters: SUB_RESTAURANT_FINE },
      { label: 'Romantic Dining', filterSchemaKey: 'restaurant_romantic', filters: SUB_RESTAURANT_ROMANTIC },
      { label: 'Steakhouses', filterSchemaKey: 'restaurant_steakhouse', filters: SUB_RESTAURANT_STEAKHOUSE },
      { label: 'Private Dining Rooms', filterSchemaKey: 'restaurant_private', filters: SUB_RESTAURANT_PRIVATE },
      { label: 'Rehearsal Dinner', filterSchemaKey: 'restaurant_rehearsal', filters: SUB_RESTAURANT_REHEARSAL },
      { label: 'Brunch', filterSchemaKey: 'restaurant_brunch', filters: SUB_RESTAURANT_BRUNCH },
      { label: 'Outdoor Dining', filterSchemaKey: 'restaurant_outdoor_dining', filters: SUB_RESTAURANT_OUTDOOR },
      { label: 'Group Dining', filterSchemaKey: 'restaurant_group_dining', filters: SUB_RESTAURANT_GROUP },
      { label: 'Farm to Table', filterSchemaKey: 'restaurant_farm_to_table', filters: SUB_RESTAURANT_FARM },
      { label: 'Gastropubs', filterSchemaKey: 'restaurant_gastropub', filters: SUB_RESTAURANT_GASTROPUB },
      { label: 'New American', filterSchemaKey: 'restaurant_new_american' },
      { label: 'Italian', filterSchemaKey: 'restaurant_italian' },
      { label: 'Seafood', filterSchemaKey: 'restaurant_seafood' },
      { label: 'French', filterSchemaKey: 'restaurant_french' },
      { label: 'Mediterranean', filterSchemaKey: 'restaurant_mediterranean' },
      { label: 'Indian', filterSchemaKey: 'restaurant_indian' },
      { label: 'Vegan & Vegetarian', filterSchemaKey: 'restaurant_vegan_vegetarian' },
    ],
    filters: RESTAURANT_FILTERS,
  },
  {
    key: 'djs-entertainment',
    label: 'DJs & Entertainment',
    iconName: 'music',
    defaultFilterSchema: 'entertainment_dj_party',
    subcategories: [
      { label: 'Wedding DJs', filterSchemaKey: 'entertainment_dj_wedding', filters: SUB_ENT_DJ_WEDDING },
      { label: 'Party DJs', filterSchemaKey: 'entertainment_dj_party', filters: SUB_ENT_DJ_PARTY },
      { label: 'Latin Music DJs', filterSchemaKey: 'entertainment_dj_latin', filters: SUB_ENT_DJ_LATIN },
      { label: 'Prom & School Dance DJs', filterSchemaKey: 'entertainment_dj_prom', filters: SUB_ENT_DJ_PROM },
      { label: 'Karaoke DJs', filterSchemaKey: 'entertainment_dj_party', filters: SUB_ENT_DJ_PARTY },
      { label: 'DJ Lessons', filterSchemaKey: 'entertainment_dj_party' },
      { label: 'Live Bands', filterSchemaKey: 'entertainment_band', filters: SUB_ENT_BAND },
      { label: 'Magicians', filterSchemaKey: 'entertainment_base' },
      { label: 'Party Characters', filterSchemaKey: 'entertainment_base' },
      { label: 'Comedy Clubs', filterSchemaKey: 'entertainment_base' },
      { label: 'Jazz Clubs', filterSchemaKey: 'entertainment_band', filters: SUB_ENT_BAND },
      { label: 'Trivia Night', filterSchemaKey: 'entertainment_base' },
      { label: 'Open Mic', filterSchemaKey: 'entertainment_band' },
    ],
    filters: DJ_FILTERS,
  },
  {
    key: 'photography',
    label: 'Photography & Video',
    iconName: 'camera',
    defaultFilterSchema: 'planning_photo',
    subcategories: [
      { label: 'Wedding Photographers', filterSchemaKey: 'planning_photo_wedding', filters: SUB_PHOTO_WEDDING },
      { label: 'Affordable Photographers', filterSchemaKey: 'planning_photo', filters: SUB_PHOTO_WEDDING },
      { label: 'Wedding Videographers', filterSchemaKey: 'planning_video', filters: SUB_PHOTO_VIDEO },
      { label: 'Photo Booths', filterSchemaKey: 'entertainment_photobooth', filters: SUB_ENT_PHOTOBOOTH },
      { label: 'Camera Rental', filterSchemaKey: 'planning_photo' },
    ],
    filters: PHOTO_FILTERS,
  },
  {
    key: 'floral-decor',
    label: 'Floral & Décor',
    iconName: 'flower',
    defaultFilterSchema: 'planning_floral',
    subcategories: [
      { label: 'Florists', filterSchemaKey: 'planning_floral' },
      { label: 'Floral Designers', filterSchemaKey: 'planning_floral_designer', filters: SUB_FLORAL_DESIGNER },
      { label: 'Party Decorations', filterSchemaKey: 'planning_floral', filters: SUB_FLORAL_DECOR_RENTALS },
      { label: 'Balloon Services', filterSchemaKey: 'planning_floral', filters: SUB_FLORAL_BALLOON },
      { label: 'Decor & Rentals', filterSchemaKey: 'planning_floral', filters: SUB_FLORAL_DECOR_RENTALS },
      { label: 'Party Supplies', filterSchemaKey: 'planning_floral' },
      { label: 'Party Favors', filterSchemaKey: 'planning_floral' },
      { label: 'Stationery & Invitations', filterSchemaKey: 'planning_floral', filters: SUB_FLORAL_STATIONERY },
      { label: 'Sign Company', filterSchemaKey: 'planning_floral' },
    ],
    filters: FLORAL_FILTERS,
  },
  {
    key: 'beauty',
    label: 'Beauty & Wellness',
    iconName: 'sparkles',
    defaultFilterSchema: 'beauty_hair_makeup',
    subcategories: [
      { label: 'Hair & Makeup', filterSchemaKey: 'beauty_hair_makeup' },
      { label: 'Bridal Hair & Makeup', filterSchemaKey: 'beauty_bridal', filters: SUB_BEAUTY_BRIDAL },
      { label: 'Sewing & Alterations', filterSchemaKey: 'beauty_alterations', filters: SUB_BEAUTY_ALTERATIONS },
      { label: 'Wellness & Spa', filterSchemaKey: 'beauty_spa', filters: SUB_BEAUTY_SPA },
    ],
    filters: BEAUTY_FILTERS,
  },
  {
    key: 'attire',
    label: 'Attire & Jewelry',
    iconName: 'gem',
    defaultFilterSchema: 'beauty_alterations',
    subcategories: [
      { label: 'Dress & Attire', filterSchemaKey: 'beauty_alterations', filters: SUB_ATTIRE_DRESS },
      { label: 'Jewelers', filterSchemaKey: 'beauty_alterations', filters: SUB_ATTIRE_JEWELERS },
    ],
    filters: ATTIRE_FILTERS,
  },
  {
    key: 'transportation',
    label: 'Transportation',
    iconName: 'car',
    defaultFilterSchema: 'transport_general',
    subcategories: [
      { label: 'Transportation Services', filterSchemaKey: 'transport_general', filters: SUB_TRANSPORT_GENERAL },
      { label: 'Party Bus Rentals', filterSchemaKey: 'transport_party_bus', filters: SUB_TRANSPORT_PARTY_BUS },
    ],
    filters: TRANSPORT_FILTERS,
  },
  {
    key: 'rentals',
    label: 'Equipment Rentals',
    iconName: 'package',
    defaultFilterSchema: 'rentals_party',
    subcategories: [
      { label: 'Party Equipment Rentals', filterSchemaKey: 'rentals_party', filters: SUB_RENTALS_PARTY },
      { label: 'Tent & Canopy Rental', filterSchemaKey: 'rentals_tent', filters: SUB_RENTALS_TENT },
      { label: 'Furniture Rental', filterSchemaKey: 'rentals_furniture', filters: SUB_RENTALS_FURNITURE },
      { label: 'Linen Rental', filterSchemaKey: 'rentals_linen', filters: SUB_RENTALS_LINEN },
      { label: 'Dinnerware Rental', filterSchemaKey: 'rentals_dinnerware', filters: SUB_RENTALS_DINNERWARE },
      { label: 'Chair & Table Rentals', filterSchemaKey: 'rentals_chairs', filters: SUB_RENTALS_FURNITURE },
      { label: 'Dance Floor Rental', filterSchemaKey: 'rentals_dance_floor' },
      { label: 'Lighting & AV', filterSchemaKey: 'rentals_lighting_av', filters: SUB_RENTALS_LIGHTING_AV },
      { label: 'Sound System Rental', filterSchemaKey: 'rentals_sound', filters: SUB_RENTALS_SOUND },
      { label: 'DJ Equipment Rental', filterSchemaKey: 'rentals_sound', filters: SUB_RENTALS_SOUND },
      { label: 'AV & Production Rentals', filterSchemaKey: 'rentals_lighting_av', filters: SUB_RENTALS_LIGHTING_AV },
      { label: 'Projector & Screen Rental', filterSchemaKey: 'rentals_lighting_av', filters: SUB_RENTALS_LIGHTING_AV },
      { label: 'Stage Rentals', filterSchemaKey: 'rentals_stage', filters: SUB_RENTALS_STAGE },
      { label: 'Bounce House Rentals', filterSchemaKey: 'rentals_bounce', filters: SUB_RENTALS_BOUNCE },
      { label: 'Mechanical Bull', filterSchemaKey: 'rentals_bounce', filters: SUB_RENTALS_BOUNCE },
      { label: 'Chocolate Fountain', filterSchemaKey: 'rentals_party', filters: SUB_RENTALS_PARTY },
      { label: 'Game Truck Rental', filterSchemaKey: 'rentals_party', filters: SUB_RENTALS_PARTY },
      { label: 'Pony Rides', filterSchemaKey: 'rentals_party' },
      { label: 'Face Painting', filterSchemaKey: 'rentals_party' },
      { label: 'Outdoor Movies', filterSchemaKey: 'rentals_party', filters: SUB_RENTALS_PARTY },
    ],
    filters: RENTALS_FILTERS,
  },
  {
    key: 'hotels',
    label: 'Hotels & Lodging',
    iconName: 'hotel',
    defaultFilterSchema: 'lodging_hotel',
    subcategories: [
      { label: 'Hotels', filterSchemaKey: 'lodging_hotel', filters: SUB_HOTELS_HOTEL },
      { label: 'Lodges', filterSchemaKey: 'lodging_lodge', filters: SUB_HOTELS_LODGE },
      { label: 'Retreats', filterSchemaKey: 'lodging_retreat', filters: SUB_HOTELS_RETREAT },
      { label: 'Short-Term Rentals', filterSchemaKey: 'lodging_str', filters: SUB_HOTELS_STR },
    ],
    filters: HOTELS_FILTERS,
  },
  {
    key: 'travel',
    label: 'Honeymoon & Travel',
    iconName: 'plane',
    defaultFilterSchema: 'travel_agency',
    subcategories: [
      { label: 'Travel Agencies', filterSchemaKey: 'travel_agency' },
    ],
    filters: TRAVEL_FILTERS,
  },
];
