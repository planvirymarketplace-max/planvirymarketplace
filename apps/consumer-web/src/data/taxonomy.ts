/**
 * Planviry - Complete Taxonomy Data File
 * Single source of truth for ALL browse dimensions in the Planviry vendor discovery platform.
 *
 * Dimensions:
 *   1. By Service   - serviceCategories (9 groups)
 *   2. By Category  - categoryByOverture (16 flat categories, Overture-mapped)
 *   3. By Event     - eventCategories  (16 groups)
 *   4. By Activity  - activityCategories (5 groups)
 *   5. By Role      - roleCategories (9 groups)
 *   6. By Location  - re-exports from @/lib/planviry-data
 *
 * Also includes:
 *   - Deep taxonomy map (Category → Event → Sub-event → Services)
 *   - By Category (Overture-mapped) - categoryByOverture (16 categories)
 *   - Category-specific filters - subcategoryFilters
 *   - Helper functions
 */

import { AIRPORT_CITIES, US_STATES } from '@/lib/planviry-data';

// ── Type Definitions ────────────────────────────────────────────────────────

export interface TaxonomyCategory {
  id: string;
  name: string;
  slug: string;
  subcategories: string[];
}

export interface ActivityGroup {
  id: string;
  name: string;
  slug: string;
  activities: ActivitySubgroup[];
}

export interface ActivitySubgroup {
  name: string;
  slug: string;
  items: string[];
}

export interface RoleGroup {
  id: string;
  name: string;
  slug: string;
  roles: RoleItem[];
}

export interface RoleItem {
  name: string;
  slug: string;
  description: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range';
  options: FilterOption[];
}

export interface CategoryFilters {
  universal: FilterGroup[];
  byCategory: Record<string, FilterGroup[]>;
  bySubcategory: Record<string, FilterGroup[]>;
}

export interface OvertureSubcategory {
  name: string;
  slug: string;
  count: number;
}

export interface OvertureSubGroup {
  label: string;
  slug: string;
  items: OvertureSubcategory[];
}

export interface OvertureCategory {
  id: string;
  name: string;
  slug: string;
  subGroups: OvertureSubGroup[];
}

// ── 1. By Service Dimension ────────────────────────────────────────────────

export const serviceCategories: TaxonomyCategory[] = [
  {
    id: 'beauty-styling-wellness-services',
    name: 'Beauty, Styling & Wellness Services',
    slug: 'beauty-styling-wellness-services',
    subcategories: [
      'Hair Salon',
      'Tattoo & Piercing',
      'Nail Salon',
      'Tanning',
      'Skin Care',
      'Makeup Artist',
      'Day Spa',
      'Hair Stylist',
      'Waxing',
      'Eyelash Service',
      'Spray Tanning',
      'Sugaring',
      'Eyebrow Service',
      'Blow Dry / Blow Out Service',
      'Spas'
    ]
  },
  {
    id: 'entertainment-event-performers',
    name: 'Entertainment & Event Performers',
    slug: 'entertainment-event-performers',
    subcategories: [
      'DJ Service',
      'Choir',
      'Musician',
      'Magician',
      'Henna Artist',
      'Musical Band Orchestras and Symphonies',
      'Face Painting',
      'Clown',
      'Party Character',
      'Caricature',
      'Trivia Host'
    ]
  },
  {
    id: 'planning-coordination-services',
    name: 'Planning & Coordination Services',
    slug: 'planning-coordination-services',
    subcategories: [
      'Wedding Planning',
      'Party and Event Planning',
      'Officiating Services',
      'Mohel',
      'Bachelorette / Bachelor Party Services'
    ]
  },
  {
    id: 'catering-food-beverage-services',
    name: 'Catering, Food & Beverage Services',
    slug: 'catering-food-beverage-services',
    subcategories: [
      'Caterer',
      'Food Truck',
      'Bartender',
      'Food and Beverage Consultant',
      'Personal Chef',
      'Sommelier Service'
    ]
  },
  {
    id: 'photography-video-creative-services',
    name: 'Photography, Video & Creative Services',
    slug: 'photography-video-creative-services',
    subcategories: [
      'Photographer',
      'Graphic Designer',
      'Sewing & Alterations',
      'Sign Making',
      'Film Production',
      'Videographer',
      'Image Consultant',
      'Commissioned Artist',
      'Corporate Gift Supplier',
      'Calligraphy'
    ]
  },
  {
    id: 'event-technology-transport-logistics-services',
    name: 'Event Technology, Transport & Logistics Services',
    slug: 'event-technology-transport-logistics-services',
    subcategories: [
      'Travel Services',
      'Passport and Visa Services',
      'Limo Services',
      'Bus Rental',
      'Event Technology Service',
      'Valet Service',
      'Coach Bus',
      'Town Car Service',
      'Private Jet Charters'
    ]
  },
  {
    id: 'equipment-event-rental-services',
    name: 'Equipment & Event Rental Services',
    slug: 'equipment-event-rental-services',
    subcategories: [
      'Beach Equipment Rentals',
      'Party Equipment Rental',
      'Scooter Rental',
      'Photo Booth Rental',
      'Bike Rentals',
      'Furniture Rental',
      'Balloon Services',
      'Party Bus Rental',
      'Ice Supplier',
      'Sport Equipment Rentals',
      'Golf Cart Rental',
      'Game Truck Rental',
      'Party Bike Rental'
    ]
  },
  {
    id: 'retail-stores-specialized-shops',
    name: 'Retail Stores & Specialized Shops',
    slug: 'retail-stores-specialized-shops',
    subcategories: [
      'Flower and Gift Shop',
      'Bakery',
      'Jewelry Store',
      'Bridal Shop',
      'Party Supply',
      'Photography Store',
      'Gemstones'
    ]
  },
  {
    id: 'lodging-accommodations',
    name: 'Lodging & Accommodations (Places to Stay)',
    slug: 'lodging-accommodations',
    subcategories: [
      'Holiday Rental Home',
      'Bed and Breakfast',
      'Resort',
      'Campground',
      'Hostel',
      'Lodge',
      'Cabin',
      'Cottage',
      'Guest House',
      'Health Retreats',
      'Mountain Huts'
    ]
  }
];

// ── 2. By Event Dimension ──────────────────────────────────────────────────

export const eventCategories: TaxonomyCategory[] = [
  {
    id: 'social-casual',
    name: 'Social & Casual Parties',
    slug: 'social-casual',
    subcategories: ['Birthday Party', 'House Party', 'Dinner Party', 'Cocktail Party', 'BBQ / Cookout', 'Pool Party', 'Game Night', 'Movie Night', 'Potluck', 'Wine Tasting / Cheese & Wine Party', 'Tea Party', 'Pajama Party / Slumber Party', 'Dance Party', 'Karaoke Party', 'Theme Party']
  },
  {
    id: 'milestone-life',
    name: 'Milestone & Life Event Parties',
    slug: 'milestone-life',
    subcategories: ['Baby Shower', 'Bridal Shower', 'Bachelorette / Bachelor Party', 'Engagement Party', 'Wedding Reception', 'Anniversary Party', 'Graduation Party', 'Retirement Party', 'Gender Reveal Party', 'Quinceañera', 'Sweet 16', 'Bar / Bat Mitzvah', 'Funeral / Memorial Reception']
  },
  {
    id: 'home-seasonal',
    name: 'Home & Seasonal Parties',
    slug: 'home-seasonal',
    subcategories: ['Holiday Party', 'Super Bowl Party', 'Block Party', 'Backyard Party', 'Garden Party', 'Rooftop Party', 'Beach Party', 'Camping Party / Glamping']
  },
  {
    id: 'professional-networking',
    name: 'Professional & Networking Parties',
    slug: 'professional-networking',
    subcategories: ['Corporate Party / Office Party', 'Networking Mixer', 'Launch Party', 'Holiday Office Party', 'Industry Gala', 'Fundraiser / Charity Gala', 'Award Ceremony After-Party']
  },
  {
    id: 'specialty-themed',
    name: 'Specialty & Themed Parties',
    slug: 'specialty-themed',
    subcategories: ['Costume Party / Masquerade', 'Murder Mystery Party', 'Escape Room Party', 'Toga Party', 'Blacklight / Glow Party', 'Foam Party', 'Paint Party (Sip & Paint)', 'Trivia Night', 'Tiki Party / Luau', 'Casino Night', 'Prom / Homecoming After-Party', 'Divorce Party', 'Pet Party']
  },
  {
    id: 'large-scale-public',
    name: 'Large-Scale & Public Parties',
    slug: 'large-scale-public',
    subcategories: ['Rave / Electronic Dance Party', 'Festival', 'Club Party', 'Fraternity / Sorority Party', 'Tailgate Party', 'Political Rally / Victory Party', 'Flash Mob Party']
  },
  {
    id: 'drinks-focused',
    name: 'Drinks-Focused Parties',
    slug: 'drinks-focused',
    subcategories: ['Open Bar Party', 'Beer Tasting / Brew Fest', 'Champagne Brunch', 'Whiskey / Spirits Tasting', 'Mocktail Party']
  },
  {
    id: 'weddings-milestone',
    name: 'Weddings & Milestone Events',
    slug: 'weddings-milestone',
    subcategories: ['Wedding Ceremony + Reception', 'Elopement', 'Vow Renewal', 'Baby Naming / Christening']
  },
  {
    id: 'corporate-professional',
    name: 'Corporate & Professional Events',
    slug: 'corporate-professional',
    subcategories: ['Conference', 'Seminar / Workshop', 'Trade Show / Expo', 'Product Launch', 'Corporate Retreat', 'Team Building Event', 'Board Meeting / Strategy Session', 'Sales Kickoff', 'Investor Pitch / Demo Day', 'Company Picnic / Family Day']
  },
  {
    id: 'entertainment-cultural',
    name: 'Entertainment & Cultural Events',
    slug: 'entertainment-cultural',
    subcategories: ['Music Concert / Festival', 'Comedy Show', 'Theater / Play / Musical', 'Movie Premiere', 'Art Exhibition / Gallery Opening', 'Fashion Show', 'Book Launch / Signing', 'Cultural Festival', 'Food Festival', 'Film Festival', 'Dance Performance']
  },
  {
    id: 'sports-outdoor',
    name: 'Sports & Outdoor Events',
    slug: 'sports-outdoor',
    subcategories: ['Sporting Match / Game', 'Marathon / Race', 'Tournament / Championship', 'Outdoor Adventure', 'Fitness Challenge / Bootcamp', 'Golf Tournament', 'eSports Tournament']
  },
  {
    id: 'public-events',
    name: 'Public Events',
    slug: 'public-events',
    subcategories: ['Festival', 'Fair / Carnival', 'Parade', 'Street Festival', 'New Year\'s Eve Celebration', 'Fireworks Show']
  },
  {
    id: 'fundraising-charity',
    name: 'Fundraising & Charity Events',
    slug: 'fundraising-charity',
    subcategories: ['Charity Auction', 'Walkathon / Run for a Cause', 'Benefit Concert', 'Silent Auction', 'Fundraising Dinner']
  },
  {
    id: 'travel-destination',
    name: 'Travel & Destination Events',
    slug: 'travel-destination',
    subcategories: ['Destination Wedding', 'Group Vacation / Tour', 'Cruise Event', 'Retreat', 'Incentive Trip']
  },
  {
    id: 'promotional',
    name: 'Promotional Events',
    slug: 'promotional',
    subcategories: ['Pop-up Shop', 'Grand Opening / Ribbon Cutting', 'Sample Sale', 'Trunk Show', 'Influencer Event', 'Brand Experience / Activation']
  },
  {
    id: 'niche',
    name: 'Niche Events',
    slug: 'niche',
    subcategories: ['Speed Dating / Singles Event', 'Pet Adoption Day', 'Car Show', 'Boat Show', 'Renaissance Faire', 'Comic-Con / Fan Convention', 'Burning Man-style Festival', 'Paint & Sip Night', 'Kids\' Parties', 'Pop-up Parties', 'Surprise Parties']
  }
];

/** Backward compatibility alias */
export { eventCategories as eventTypes };

// ── User-Published Event Categories (Eventbrite Layer) ─────────────────────
export interface UserEventCategory {
  id: string
  name: string
  slug: string
  description: string
  subcategories: string[]
}

export const userEventCategories: UserEventCategory[] = [
  { id: 'music', name: 'Music', slug: 'music', description: 'Concerts, festivals, live music, DJ nights, and music performances.', subcategories: ['Concert', 'Music Festival', 'Live Band', 'DJ Night', 'Open Mic', 'Karaoke', 'Classical Performance', 'Jazz Night', 'Hip-Hop Show', 'Country Show', 'Electronic/Dance', 'Indie/Alternative', 'Cover Band', 'Acoustic Set'] },
  { id: 'food-and-drink', name: 'Food and Drink', slug: 'food-and-drink', description: 'Food festivals, tastings, dinners, cooking classes, and drink events.', subcategories: ['Food Festival', 'Wine Tasting', 'Beer Festival', 'Cocktail Event', 'Pop-up Dinner', 'Cooking Class', 'Food Tour', 'Brunch Event', 'Tasting Menu', 'Farm-to-Table Dinner', 'Spirit Tasting', 'Food Truck Rally'] },
  { id: 'community-and-culture', name: 'Community and Culture', slug: 'community-and-culture', description: 'Cultural celebrations, community gatherings, heritage events, and festivals.', subcategories: ['Cultural Festival', 'Heritage Celebration', 'Community Gathering', 'Art Walk', 'Street Fair', 'Cultural Performance', 'Language Exchange', 'Community Workshop', 'Neighborhood Event', 'Cultural Parade'] },
  { id: 'business', name: 'Business', slug: 'business', description: 'Networking, conferences, workshops, seminars, and professional events.', subcategories: ['Networking Event', 'Conference', 'Workshop', 'Seminar', 'Trade Show', 'Business Mixer', 'Pitch Event', 'Panel Discussion', 'Product Launch', 'Job Fair', 'Startup Event', 'Masterclass'] },
  { id: 'performing-and-visual-art', name: 'Performing and Visual Art', slug: 'performing-and-visual-art', description: 'Theater, dance, gallery openings, art exhibitions, and performances.', subcategories: ['Theater Production', 'Dance Performance', 'Gallery Opening', 'Art Exhibition', 'Comedy Show', 'Improv Night', 'Spoken Word', 'Poetry Reading', 'Opera', 'Ballet', 'Art Workshop', 'Sculpture Show'] },
  { id: 'seasonal', name: 'Seasonal', slug: 'seasonal', description: 'Holiday events, seasonal festivals, and time-specific celebrations.', subcategories: ['Holiday Market', 'Christmas Event', 'Halloween Party', 'New Year Event', 'Thanksgiving Event', "Valentine Event", "St. Patrick's Day", 'Fourth of July', 'Summer Festival', 'Fall Festival', 'Spring Celebration', 'Winter Festival'] },
  { id: 'sports-and-fitness', name: 'Sports and Fitness', slug: 'sports-and-fitness', description: 'Fitness classes, sports events, runs, and athletic activities.', subcategories: ['Fitness Class', 'Yoga Session', 'Marathon/Run', 'Cycling Event', 'Tournament', 'Sports Clinic', 'Martial Arts Event', 'CrossFit Competition', 'Pilates Class', 'Hiking Event', 'Swimming Event', 'Climbing Event'] },
  { id: 'health-and-wellness', name: 'Health and Wellness', slug: 'health-and-wellness', description: 'Wellness workshops, meditation, mental health, and holistic events.', subcategories: ['Meditation Session', 'Wellness Workshop', 'Mental Health Event', 'Nutrition Class', 'Sound Bath', 'Breathwork', 'Wellness Retreat', 'Holistic Health', 'Self-Care Workshop', 'Massage Event', 'Acupuncture Clinic'] },
  { id: 'science-and-technology', name: 'Science and Technology', slug: 'science-and-technology', description: 'Tech meetups, science talks, hackathons, and innovation events.', subcategories: ['Tech Meetup', 'Hackathon', 'Science Talk', 'Innovation Summit', 'Coding Workshop', 'AI/ML Event', 'Startup Tech', 'Robotics Event', 'Science Fair', 'Tech Conference', 'Product Demo'] },
  { id: 'charity-and-causes', name: 'Charity and Causes', slug: 'charity-and-causes', description: 'Fundraisers, benefit events, volunteer opportunities, and cause-driven gatherings.', subcategories: ['Fundraiser', 'Benefit Concert', 'Charity Gala', 'Volunteer Event', 'Auction', 'Walkathon', 'Awareness Event', 'Donation Drive', 'Community Service', 'Nonprofit Event'] },
  { id: 'travel-and-outdoor', name: 'Travel and Outdoor', slug: 'travel-and-outdoor', description: 'Outdoor adventures, travel meetups, camping, and nature events.', subcategories: ['Camping Trip', 'Hiking Adventure', 'Travel Meetup', 'Outdoor Festival', 'Nature Walk', 'Kayaking/Canoeing', 'Fishing Event', 'Ski Trip', 'Beach Event', 'Park Gathering', 'RV Meetup'] },
  { id: 'religion-and-spirituality', name: 'Religion and Spirituality', slug: 'religion-and-spirituality', description: 'Religious services, spiritual gatherings, faith events, and study groups.', subcategories: ['Religious Service', 'Spiritual Gathering', 'Faith Study', 'Prayer Group', 'Meditation Retreat', 'Religious Festival', 'Faith Conference', 'Spiritual Workshop', 'Retreat', 'Pilgrimage'] },
  { id: 'family-and-education', name: 'Family and Education', slug: 'family-and-education', description: 'Family-friendly events, educational workshops, kids activities, and learning.', subcategories: ['Kids Workshop', 'Family Festival', 'Educational Class', 'Storytime', 'Kids Camp', 'Parent Meetup', 'Family Movie Night', 'Science for Kids', 'Art for Kids', 'Music for Kids', 'Tutoring Event'] },
  { id: 'film-media-and-entertainment', name: 'Film, Media and Entertainment', slug: 'film-media-and-entertainment', description: 'Film screenings, premieres, media events, and entertainment gatherings.', subcategories: ['Film Screening', 'Movie Premiere', 'Film Festival', 'Documentary Night', 'Q&A Panel', 'Media Event', 'Awards Watch Party', 'Trivia Night', 'Game Tournament', 'Esports Event'] },
  { id: 'government-and-politics', name: 'Government and Politics', slug: 'government-and-politics', description: 'Town halls, political rallies, civic events, and government gatherings.', subcategories: ['Town Hall', 'Political Rally', 'Civic Meeting', 'Campaign Event', 'Voter Registration', 'Public Forum', 'Government Meeting', 'Advocacy Event', 'Community Board', 'Public Hearing'] },
  { id: 'fashion-and-beauty', name: 'Fashion and Beauty', slug: 'fashion-and-beauty', description: 'Fashion shows, beauty workshops, styling events, and industry meetups.', subcategories: ['Fashion Show', 'Beauty Workshop', 'Styling Event', 'Pop-up Shop', 'Fashion Market', 'Makeup Class', 'Skincare Event', 'Hair Show', 'Fashion Networking', 'Boutique Opening'] },
  { id: 'home-and-lifestyle', name: 'Home and Lifestyle', slug: 'home-and-lifestyle', description: 'Home improvement, gardening, interior design, and lifestyle workshops.', subcategories: ['Home Workshop', 'Gardening Class', 'Interior Design Event', 'DIY Workshop', 'Plant Swap', 'Home Tour', 'Lifestyle Class', 'Organization Workshop', 'Craft Night', 'Knitting/Crochet'] },
  { id: 'school-activities', name: 'School Activities', slug: 'school-activities', description: 'School events, dances, fundraisers, and educational community activities.', subcategories: ['School Dance', 'School Fundraiser', 'Science Fair', 'Book Fair', 'Sports Event', 'School Play', 'Graduation Event', 'Parent-Teacher Event', 'School Auction', 'Reunion'] },
  { id: 'other', name: 'Other', slug: 'other', description: "Events that don't fit into other categories.", subcategories: ['Miscellaneous', 'Unique Event', 'Experimental', 'Multi-category'] },
]

export function getUserEventCategoryBySlug(slug: string): UserEventCategory | undefined {
  return userEventCategories.find((c) => c.slug === slug)
}

// ── 3. By Activity Dimension ───────────────────────────────────────────────

export const activityCategories: ActivityGroup[] = [
  {
    id: 'adult-activities',
    name: 'Adult Activities',
    slug: 'adult-activities',
    activities: [
      {
        name: 'Nightlife & Social',
        slug: 'nightlife-social',
        items: ['Clubbing & Dancing', 'Live Music Outing', 'Karaoke Lounge Night', 'Bar Crawl & Tasting', 'Mobile Mixology Party', 'Late-Night Comedy', 'Silent Disco Gathering', 'Interactive Pub Trivia']
      },
      {
        name: 'Outdoor & Adventure',
        slug: 'outdoor-adventure',
        items: ['Stargazing Expedition', 'Panoramic Scenic Tours', 'Scenic Hiking & Backpacking', 'Sunset Balloon Ride', 'Geological Cave Exploration', 'Hot Springs Wellness Dip']
      },
      {
        name: 'Sports & Rec',
        slug: 'sports-rec',
        items: ['Target Sports', 'Axe Throwing Tournament', 'Motorsport Track Day', 'ATV/Off-Road Trail Tour', 'Billiards Tournament', 'Adult League Games', 'Extreme Skydiving', 'Deep Sea Scuba Diving']
      },
      {
        name: 'Date / Couples',
        slug: 'date-couples',
        items: ['Private Chef Dinner', 'Private Wine & Spirits Tasting', 'Couples Day Spa', 'Guided Sunset Horseback Ride', 'Botanical Garden Stroll', 'Private Yacht Charter']
      },
      {
        name: 'Creative / Body Art',
        slug: 'creative-body-art',
        items: ['Group Ink & Piercing Session', 'Calligraphy/Creative Writing Workshop', 'Custom Art Commission']
      }
    ]
  },
  {
    id: 'children-activities',
    name: 'Children Activities',
    slug: 'children-activities',
    activities: [
      {
        name: 'Arts & Crafts',
        slug: 'arts-crafts',
        items: ['Face Painting Workshop', 'Creative Sketching Class', 'Balloon Sculpting Lesson']
      },
      {
        name: 'Outdoor Play',
        slug: 'outdoor-play',
        items: ['Beach & Lake Playdays', 'Petting Zoo Farm Outing', 'Fruit Harvesting Outing', 'Nature Trail Scavenger Hunt', 'Scenic Bike Ride']
      },
      {
        name: 'Sports',
        slug: 'sports',
        items: ['Youth Batting Practice', 'Court Games (Tennis/Basketball)', 'Bubble Soccer Tournament']
      },
      {
        name: 'STEM',
        slug: 'stem',
        items: ['Cosmic Planetarium Tour', 'Scenic Astronomy Night', 'Ecosystem Discovery Tour']
      },
      {
        name: 'Music & Performing Arts',
        slug: 'music-performing-arts',
        items: ['Kids\' Choir & Singalong', 'Puppet Show & Acting', 'Meet a Mascot']
      },
      {
        name: 'Indoor Recreation & Games',
        slug: 'indoor-recreation-games',
        items: ['Bumper Bowling Tournament', 'Mini-Golf Tournament', 'High-Flying Trampoline Park', 'Laser Tag Tournament', 'Mobile Gaming Party']
      },
      {
        name: 'Water Activities',
        slug: 'water-activities',
        items: ['Water Park Excursion', 'Lazy River Tubing', 'Shallow Water Snorkeling']
      },
      {
        name: 'Social',
        slug: 'social',
        items: ['Custom Character Playdate', 'Youth Fun & Games Event']
      },
      {
        name: 'Seasonal',
        slug: 'seasonal',
        items: ['Haunted House Tour', 'Pumpkin Patch & Hayride', 'Winter Ice Skating']
      }
    ]
  },
  {
    id: 'family-friendly-activities',
    name: 'Family-Friendly Activities',
    slug: 'family-friendly-activities',
    activities: [
      {
        name: 'Outdoor',
        slug: 'outdoor',
        items: ['Family Beach & Picnic Day', 'Waterfall Sightseeing Hike', 'Outdoor Sand Boarding']
      },
      {
        name: 'Sports & Recreation',
        slug: 'sports-recreation',
        items: ['Family Mini-Golf Clash', 'Recreational Ice Skating', 'Disc Golf Tournament']
      },
      {
        name: 'Entertainment',
        slug: 'entertainment',
        items: ['Drive-In Cinema Night', 'Live Magic Show', 'Theater Outing']
      },
      {
        name: 'Educational',
        slug: 'educational',
        items: ['Deep Sea Marine Tour', 'Historical Landmarks Tour', 'High Altitude Sightseeing']
      },
      {
        name: 'Creative',
        slug: 'creative',
        items: ['Family Art Class', 'Holiday Family Photo Session']
      },
      {
        name: 'Games',
        slug: 'games',
        items: ['Family Escape Room Challenge', 'High-Tech Gaming Outing']
      },
      {
        name: 'Adventure',
        slug: 'adventure',
        items: ['Theme Park Day', 'Family Canopy Zipline', 'Forest Ropes & Challenge Course']
      },
      {
        name: 'Community',
        slug: 'community',
        items: ['Community Fair & Rides', 'Acrobatic Circus Performance']
      },
      {
        name: 'Food Events',
        slug: 'food-experiences',
        items: ['Food Truck Fest Picnic', 'Farm-to-Table Dinner']
      }
    ]
  },
  {
    id: 'team-building',
    name: 'Team Building',
    slug: 'team-building',
    activities: [
      {
        name: 'Virtual',
        slug: 'virtual',
        items: ['Interactive Virtual Trivia', 'Remote Graphic Design Workshop']
      },
      {
        name: 'Professional Development',
        slug: 'professional-development',
        items: ['Company Summit Presentation', 'Corporate Planning Retreat']
      },
      {
        name: 'Social Events',
        slug: 'social-events',
        items: ['Private Comedy Show', 'Team Tasting Tour', 'Expert Mixology Class']
      },
      {
        name: 'Adventure Event',
        slug: 'adventure-experience',
        items: ['Off-Road Trail Adventure', 'Team Water Sports', 'Guided Canopy Zip Tour']
      },
      {
        name: 'Strategy & Competition',
        slug: 'strategy-competition',
        items: ['Escape Room Challenge', 'High-Tech Laser Tag Tournament', 'Friendly Kart Racing Grand Prix']
      },
      {
        name: 'Wellness',
        slug: 'wellness',
        items: ['Corporate Rest & Spa Day', 'Health & Meditation Retreat']
      },
      {
        name: 'Volunteer',
        slug: 'volunteer',
        items: ['Beach Restoration Day', 'Trail Maintenance Project']
      },
      {
        name: 'Communication',
        slug: 'communication',
        items: ['Structured Collaborative Facilitation']
      },
      {
        name: 'Creative Challenges',
        slug: 'creative-challenges',
        items: ['Private Cooking Workshop', 'Collaborative Team Mural']
      },
      {
        name: 'Problem-Solving',
        slug: 'problem-solving',
        items: ['High Ropes Team Navigation']
      },
      {
        name: 'Icebreakers',
        slug: 'icebreakers',
        items: ['Mobile Arcade & Social Lounge']
      }
    ]
  },
  {
    id: 'planning-a-trip',
    name: 'Planning A Trip',
    slug: 'planning-a-trip',
    activities: [
      {
        name: 'Research & Planning',
        slug: 'research-planning',
        items: ['Itinerary Design']
      },
      {
        name: 'Booking',
        slug: 'booking',
        items: ['Vacation Accommodation Search']
      },
      {
        name: 'Documentation',
        slug: 'documentation',
        items: ['International Visa Expediting']
      },
      {
        name: 'Packing',
        slug: 'packing',
        items: ['Gear & Equipment Preparation']
      },
      {
        name: 'Transportation',
        slug: 'transportation',
        items: ['VIP Group Ground Transit', 'Charter Flights', 'Island Hopping Charters']
      },
      {
        name: 'Accommodations',
        slug: 'accommodations',
        items: ['Secluded Wilderness Lodge', 'Seaside Resort Stay', 'Outdoors Campground Stay']
      },
      {
        name: 'Activities',
        slug: 'activities',
        items: ['Guided Regional Tours', 'Private Diving Excursion']
      },
      {
        name: 'Adventure',
        slug: 'adventure',
        items: ['Wilderness Trail Riding', 'High Altitude Rock Climbing']
      },
      {
        name: 'Family-Friendly',
        slug: 'family-friendly',
        items: ['Marine Life Exploration', 'Water Park Fun']
      },
      {
        name: 'Food & Dining',
        slug: 'food-dining',
        items: ['Expert Wine Pairing Dinner', 'Local Culinary Tour']
      },
      {
        name: 'Safety & Logistics',
        slug: 'safety-logistics',
        items: ['Luggage & Travel Security']
      },
      {
        name: 'After the Trip',
        slug: 'after-the-trip',
        items: ['Memory & Photo Album Curation']
      }
    ]
  }
];

// ── 4. By Role Dimension ───────────────────────────────────────────────────

export const roleCategories: RoleGroup[] = [
  {
    id: 'hospitality-tourism',
    name: 'Hospitality & Tourism',
    slug: 'hospitality-tourism',
    roles: [
      { name: 'Destination Wedding Planner', slug: 'destination-wedding-planner', description: 'Plans and coordinates weddings at resort and destination locations' },
      { name: 'Resort Activities Coordinator', slug: 'resort-activities-coordinator', description: 'Organizes activities and entertainment for resort guests' },
      { name: 'Cruise Director', slug: 'cruise-director', description: 'Manages onboard entertainment, activities, and guest events' },
      { name: 'Tour Operator', slug: 'tour-operator', description: 'Designs and operates guided tours and travel events' }
    ]
  },
  {
    id: 'corporate-business',
    name: 'Corporate & Business',
    slug: 'corporate-business',
    roles: [
      { name: 'Trade Show Organizer', slug: 'trade-show-organizer', description: 'Plans and executes trade shows and industry exhibitions' },
      { name: 'Incentive Travel Planner', slug: 'incentive-travel-planner', description: 'Designs reward-based travel events for corporate teams' },
      { name: 'Conference/Sponsorship Coordinator', slug: 'conference-sponsorship-coordinator', description: 'Coordinates conferences and manages sponsor relationships' },
      { name: 'Retreat Facilitator', slug: 'retreat-facilitator', description: 'Leads corporate retreats with team building and strategic planning' },
      { name: 'Corporate Events Planner', slug: 'corporate-events-planner', description: 'Plans and manages corporate events from meetings to celebrations' }
    ]
  },
  {
    id: 'entertainment-music',
    name: 'Entertainment & Music',
    slug: 'entertainment-music',
    roles: [
      { name: 'Music Festival Producer', slug: 'music-festival-producer', description: 'Produces and manages large-scale music festivals and concerts' },
      { name: 'Tour Manager', slug: 'tour-manager', description: 'Manages logistics and operations for touring artists and acts' },
      { name: 'Talent Booker', slug: 'talent-booker', description: 'Books and schedules talent for venues, events, and festivals' },
      { name: 'Venue Programming Manager', slug: 'venue-programming-manager', description: 'Curates and schedules events and performances at venues' },
      { name: 'Entertainment Director', slug: 'entertainment-director', description: 'Oversees entertainment programming and creative direction' }
    ]
  },
  {
    id: 'sports-athletics',
    name: 'Sports & Athletics',
    slug: 'sports-athletics',
    roles: [
      { name: 'Tournament Director', slug: 'tournament-director', description: 'Organizes and manages competitive sports tournaments' },
      { name: 'Race Director', slug: 'race-director', description: 'Plans and executes running, cycling, and motorsport races' },
      { name: 'Game Day Operations Manager', slug: 'game-day-operations-manager', description: 'Manages logistics and operations for sporting events' }
    ]
  },
  {
    id: 'nonprofit-education',
    name: 'Non-Profit & Education',
    slug: 'nonprofit-education',
    roles: [
      { name: 'Fundraising Gala Organizer', slug: 'fundraising-gala-organizer', description: 'Plans and executes fundraising galas and charity events' },
      { name: 'Academic Conference Planner', slug: 'academic-conference-planner', description: 'Organizes academic and educational conferences' },
      { name: 'Alumni Relations Coordinator', slug: 'alumni-relations-coordinator', description: 'Coordinates alumni events and engagement programs' }
    ]
  },
  {
    id: 'niche-special-interest',
    name: 'Niche & Special Interest',
    slug: 'niche-special-interest',
    roles: [
      { name: 'Experiential Marketing Planner', slug: 'experiential-marketing-planner', description: 'Designs immersive brand events and marketing events' },
      { name: 'Political Campaign Event Planner', slug: 'political-campaign-event-planner', description: 'Plans events for political campaigns and civic engagement' }
    ]
  },
  {
    id: 'hospitality-social-events',
    name: 'Hospitality & Social Events',
    slug: 'hospitality-social-events',
    roles: [
      { name: 'Wedding Planner', slug: 'wedding-planner', description: 'Plans and coordinates all aspects of weddings' },
      { name: 'Event Planner', slug: 'event-planner', description: 'Plans and manages social events, parties, and celebrations' }
    ]
  },
  {
    id: 'entertainment-nightlife',
    name: 'Entertainment & Nightlife',
    slug: 'entertainment-nightlife',
    roles: [
      { name: 'Party Promoter', slug: 'party-promoter', description: 'Promotes and organizes nightlife events and parties' },
      { name: 'Events Promoter', slug: 'events-promoter', description: 'Markets and promotes entertainment events' }
    ]
  },
  {
    id: 'public-sector-civic',
    name: 'Public Sector & Civic',
    slug: 'public-sector-civic',
    roles: [
      { name: 'Community Planner', slug: 'community-planner', description: 'Plans community events, festivals, and civic gatherings' }
    ]
  }
];

// ── 5. By Location Dimension ───────────────────────────────────────────────

export { AIRPORT_CITIES, US_STATES };

/** Get popular cities grouped by region */
export function getCitiesByRegion(): Record<string, { name: string; slug: string; state: string; stateAbbr: string }[]> {
  const regions: Record<string, { name: string; slug: string; state: string; stateAbbr: string }[]> = {
    'Northeast': [],
    'Southeast': [],
    'Midwest': [],
    'Southwest': [],
    'West': [],
    'Pacific': [],
  };

  const stateRegionMap: Record<string, string> = {
    'CT': 'Northeast', 'ME': 'Northeast', 'MA': 'Northeast', 'NH': 'Northeast',
    'RI': 'Northeast', 'VT': 'Northeast', 'NJ': 'Northeast', 'NY': 'Northeast',
    'PA': 'Northeast',
    'AL': 'Southeast', 'AR': 'Southeast', 'DE': 'Southeast', 'FL': 'Southeast',
    'GA': 'Southeast', 'KY': 'Southeast', 'LA': 'Southeast', 'MD': 'Southeast',
    'MS': 'Southeast', 'NC': 'Southeast', 'SC': 'Southeast', 'TN': 'Southeast',
    'VA': 'Southeast', 'WV': 'Southeast', 'DC': 'Southeast',
    'IL': 'Midwest', 'IN': 'Midwest', 'IA': 'Midwest', 'KS': 'Midwest',
    'MI': 'Midwest', 'MN': 'Midwest', 'MO': 'Midwest', 'NE': 'Midwest',
    'ND': 'Midwest', 'OH': 'Midwest', 'SD': 'Midwest', 'WI': 'Midwest',
    'AZ': 'Southwest', 'NM': 'Southwest', 'OK': 'Southwest', 'TX': 'Southwest',
    'CO': 'West', 'ID': 'West', 'MT': 'West', 'NV': 'West', 'UT': 'West', 'WY': 'West',
    'AK': 'Pacific', 'CA': 'Pacific', 'HI': 'Pacific', 'OR': 'Pacific', 'WA': 'Pacific',
  };

  for (const stateAirports of AIRPORT_CITIES) {
    const region = stateRegionMap[stateAirports.abbr];
    if (!region) continue;
    for (const airport of stateAirports.airports) {
      const cityName = airport.name.replace(/\s*(International|Regional|Municipal|Airport|Field|Field Airpark|Air Terminal|Metropolitan|Intercontinental|Executive)\s*/gi, '').trim();
      if (cityName) {
        regions[region].push({
          name: cityName,
          slug: airport.slug,
          state: airport.state,
          stateAbbr: airport.stateAbbr,
        });
      }
    }
  }

  // Sort each region alphabetically by city name
  for (const region of Object.keys(regions)) {
    regions[region].sort((a, b) => a.name.localeCompare(b.name));
  }

  return regions;
}

// ── 6. Deep Taxonomy Map ───────────────────────────────────────────────────

export const taxonomy: Record<string, Record<string, Record<string, string[]>>> = {
  "Social & Casual":{
    "Birthday Party":{"Kids Birthday (1-12)":["Venue","Catering","Cake","DJ","Decorations","Party Characters","Bounce House","Photo Booth","Party Favors","Face Painters","Balloon Artists"],"Teen Birthday (13-17)":["Venue","Catering","Cake","DJ","Decorations","Photo Booth","Party Favors","Lighting & Stage Production"],"Adult Birthday (21+)":["Venue","Catering","Cake","DJ","Bartending","Decorations","Photo Booth","Party Favors","Transportation"],"Milestone Birthday (30/40/50/60+)":["Venue","Catering","Cake","DJ","Bartending","Decorations","Photography","Photo Booth","Party Favors","Transportation","Florist"]},
    "House Party":{"Casual Gathering":["Venue","Catering","Bartending","Decorations","Party Supplies"],"Themed House Party":["Venue","Decorations","Catering","Bartending","DJ","Photo Booth"],"Game Night":["Venue","Catering","Bartending","Game Rentals","Party Supplies"]},
    "Dinner Party":{"Casual Dinner":["Venue","Catering","Bartending","Florist","Stationery"],"Formal Dinner":["Venue","Private Chef","Bartending","Florist","Stationery","Decorations","Furniture & Linen Rentals"],"Themed Dinner":["Venue","Catering","Decorations","Bartending","Florist","Stationery"]},
    "Cocktail Party":{"Networking Cocktail Hour":["Venue","Bartending","Catering","DJ","Decorations","Furniture & Linen Rentals"],"Birthday Cocktail Party":["Venue","Bartending","Catering","DJ","Decorations","Photography","Photo Booth"],"Holiday Cocktail Party":["Venue","Bartending","Catering","DJ","Decorations","Florist","Photography"]},
    "BBQ / Cookout":{"Backyard BBQ":["Venue","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","Bartending","Lawn Games","Party Supplies","DJ"],"Pool Party BBQ":["Venue","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","Bartending","Party Supplies","DJ"],"Corporate BBQ":["Venue","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","Bartending","Lawn Games","DJ","Photography"]},
    "Pool Party":{"Kids Pool Party":["Venue","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","Bartending","Party Supplies","DJ","Lifeguard","Bounce House"],"Adult Pool Party":["Venue","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","Bartending","DJ","Party Supplies","Photography"],"Birthday Pool Party":["Venue","Cake","Tent & Outdoor Rentals","Furniture & Linen Rentals","Bartending","DJ","Party Supplies","Photography"]},
    "Dance Party":{"Birthday Dance Party":["Venue","DJ","Lighting & Stage Production","Bartending","Catering","Photo Booth","Cake"],"Private Dance Party":["Venue","DJ","Lighting & Stage Production","Bartending","Catering"],"Themed Dance Party":["Venue","DJ","Lighting & Stage Production","Decorations","Bartending","Catering","Photo Booth"]},
    "Karaoke Party":{"Birthday Karaoke":["Venue","Karaoke Host","Bartending","Catering","Cake","Decorations","Party Favors"],"Corporate Karaoke":["Venue","Karaoke Host","Bartending","Catering","Photography"],"Private Karaoke":["Venue","Karaoke Host","Bartending","Catering","Decorations","Party Favors"]},
    "Theme Party":{"80s Party":["Venue","Decorations","DJ","Catering","Bartending","Photo Booth","Party Favors"],"Hollywood Red Carpet":["Venue","Decorations","DJ","Catering","Bartending","Photo Booth","Red Carpet Services","Photography"],"Neon Glow Party":["Venue","Lighting & Stage Production","DJ","Decorations","Bartending","Catering","Party Favors","Face Painters"],"Masquerade":["Venue","Decorations","DJ","Catering","Bartending","Photo Booth","Party Favors","Florist"],"Luau":["Venue","Decorations","DJ","Catering","Bartending","Photo Booth","Party Favors","Fire Dancers"]}
  },
  "Milestone & Life Events":{
    "Baby Shower":{"Traditional":["Venue","Catering","Cake","Decorations","Balloon Services","Party Favors","Florist","Stationery","Photography"],"Co-ed":["Venue","Catering","Cake","Bartending","Decorations","Balloon Services","Party Favors","Florist","Stationery","Photography"],"Virtual":["AV & Sound Technicians","Stationery","Party Favors"]},
    "Bridal Shower":{"Traditional":["Venue","Catering","Cake","Decorations","Balloon Services","Party Favors","Florist","Stationery","Photography","Bartending"],"Brunch":["Venue","Catering","Cake","Bartending","Decorations","Balloon Services","Party Favors","Florist","Stationery","Photography"],"Destination":["Venue","Catering","Cake","Bartending","Decorations","Party Favors","Florist","Stationery","Photography","Transportation","Travel Agency"]},
    "Bachelorette / Bachelor":{"Bachelorette Weekend":["Venue","Transportation","Bartending","Catering","DJ","Decorations","Party Favors","Photo Booth","Activity Vendor"],"Bachelor Bar Crawl":["Venue","Transportation","Bartending","Catering","Decorations","Party Favors"],"Co-ed Party":["Venue","Transportation","Bartending","Catering","DJ","Decorations","Party Favors","Photo Booth"]},
    "Engagement Party":{"Casual":["Venue","Catering","Bartending","Decorations","Photography","Stationery"],"Formal Dinner":["Venue","Catering","Bartending","Florist","Decorations","Photography","Stationery","Cake"],"Backyard":["Venue","Catering","Bartending","Tent & Outdoor Rentals","Decorations","Photography","Stationery"]},
    "Wedding Reception":{"Traditional":["Venue","Catering","DJ","Photography","Videography","Florist","Cake","Bartending","Decorations","Furniture & Linen Rentals","Lighting & Stage Production","Photo Booth","Transportation","Day-of Coordinator","Stationery","Hair & Makeup","Attire","Hotel Room Blocks"],"Micro-Wedding":["Venue","Catering","DJ","Photography","Videography","Florist","Cake","Bartending","Decorations","Stationery","Hair & Makeup","Attire"],"Destination Wedding":["Venue","Travel Agency","Lodging","Transportation","Destination Wedding Planners","Catering","DJ","Photography","Officiant","Florist","Cake","Bartending","Hair & Makeup","Stationery","Attire"],"Elopement":["Venue","Officiant","Photography","Videography","Florist","Attire","Hair & Makeup","Cake","Catering","Transportation"]},
    "Graduation Party":{"High School":["Venue","Catering","Cake","Decorations","Balloon Services","Party Favors","Photography","DJ","Photo Booth","Stationery","Bartending"],"College":["Venue","Catering","Cake","Decorations","Balloon Services","Party Favors","Photography","DJ","Photo Booth","Stationery","Bartending"],"Graduate School":["Venue","Catering","Cake","Decorations","Party Favors","Photography","Stationery","Bartending"]},
    "Retirement Party":{"Office Retirement":["Venue","Catering","Cake","Decorations","Photography","DJ","Photo Booth","Stationery","Bartending","Party Favors"],"Family Celebration":["Venue","Catering","Cake","Decorations","Photography","DJ","Photo Booth","Stationery","Bartending","Party Favors","Florist"],"Surprise Retirement":["Venue","Catering","Cake","Decorations","Photography","Videography","DJ","Photo Booth","Stationery","Bartending","Party Favors","Florist"]},
    "Sweet 16":{"Traditional":["Venue","Catering","DJ","Photography","Cake","Decorations","Photo Booth","Lighting & Stage Production","Attire","Hair & Makeup","Florist","Videography","Transportation","Party Favors"],"Themed":["Venue","Catering","DJ","Photography","Cake","Decorations","Photo Booth","Lighting & Stage Production","Attire","Hair & Makeup","Party Favors","Transportation"],"DJ/Dance":["Venue","DJ","Lighting & Stage Production","Catering","Cake","Photo Booth","Decorations","Attire","Hair & Makeup","Transportation"]},
    "Quinceañera":{"Traditional":["Venue","Catering","Latin Music DJ","Photography","Videography","Florist","Cake","Decorations","Attire","Hair & Makeup","Furniture & Linen Rentals","Photo Booth","Lighting & Stage Production","Transportation"],"Modern":["Venue","Catering","DJ","Photography","Videography","Florist","Cake","Decorations","Attire","Hair & Makeup","Photo Booth","Lighting & Stage Production","Transportation"],"Religious":["Venue","Catering","Latin Music DJ","Photography","Videography","Florist","Cake","Decorations","Attire","Hair & Makeup","Furniture & Linen Rentals","Photo Booth","Lighting & Stage Production","Transportation","Officiant"]},
    "Bar / Bat Mitzvah":{"Traditional":["Venue","Catering","DJ","Photography","Videography","Cake","Decorations","Florist","Photo Booth","Lighting & Stage Production","Party Favors","Stationery","Furniture & Linen Rentals","Day-of Coordinator"],"Modern":["Venue","Catering","DJ","Photography","Videography","Cake","Decorations","Florist","Photo Booth","Lighting & Stage Production","Party Favors","Stationery","Day-of Coordinator"],"Reform/Celebration":["Venue","Catering","DJ","Photography","Cake","Decorations","Florist","Photo Booth","Party Favors","Stationery"]},
    "Anniversary Party":{"1st Anniversary":["Venue","Catering","Cake","DJ","Photography","Florist","Decorations","Bartending","Stationery"],"10th Anniversary":["Venue","Catering","Cake","DJ","Photography","Florist","Decorations","Bartending","Photo Booth","Stationery"],"25th Anniversary":["Venue","Catering","Cake","DJ","Photography","Videography","Florist","Decorations","Bartending","Photo Booth","Stationery","Vow Renewal Officiant"],"50th Anniversary":["Venue","Catering","Cake","DJ","Photography","Videography","Florist","Decorations","Bartending","Photo Booth","Stationery","Vow Renewal Officiant","Transportation"]},
    "Gender Reveal":{"Intimate":["Venue","Catering","Cake","Decorations","Balloon Services","Photography","Videography","Stationery"],"Large Party":["Venue","Catering","Cake","Decorations","Balloon Services","Photography","Videography","Stationery","Party Favors","Bartending","DJ"],"Co-ed Reveal":["Venue","Catering","Cake","Bartending","Decorations","Balloon Services","Photography","Videography","Stationery","Party Favors"]}
  },
  "Home & Seasonal":{
    "Holiday Party":{"Christmas":["Venue","Catering","Bartending","DJ","Decorations","Florist","Cake","Photo Booth","Photography","Party Favors"],"Halloween":["Venue","Catering","Bartending","DJ","Decorations","Photo Booth","Party Favors","Lighting & Stage Production"],"Thanksgiving Dinner":["Venue","Catering","Bartending","Decorations","Florist","Furniture & Linen Rentals"],"New Year's Eve":["Venue","Catering","Bartending","DJ","Decorations","Photo Booth","Photography","Lighting & Stage Production","Party Favors","Ticket Services","Security","Coat Check"]},
    "Backyard Party":{"Casual":["Venue","Tent & Outdoor Rentals","Furniture & Linen Rentals","Catering","Bartending","DJ","Lawn Games","Party Supplies"],"BBQ":["Venue","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","Bartending","Lawn Games","Party Supplies","DJ"],"Birthday":["Venue","Catering","Cake","Tent & Outdoor Rentals","Furniture & Linen Rentals","Bartending","DJ","Bounce House Rentals","Party Supplies","Photo Booth"]},
    "Garden Party":{"Afternoon":["Venue","Tent & Outdoor Rentals","Florist","Catering","Bartending","Furniture & Linen Rentals","DJ","Photography","Stationery"],"Bridal":["Venue","Tent & Outdoor Rentals","Florist","Catering","Bartending","Furniture & Linen Rentals","DJ","Photography","Stationery","Cake"],"Birthday":["Venue","Tent & Outdoor Rentals","Florist","Catering","Cake","Bartending","Furniture & Linen Rentals","DJ","Photography","Stationery"]},
    "Block Party":{"Neighborhood":["Venue","Permitting Assistance","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","DJ","Bounce House Rentals","Lawn Games","Bartending","Party Supplies","Security"],"Street Festival":["Venue","Permitting Assistance","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","DJ","Bartending","Party Supplies","Security","Live Bands"],"Community Gathering":["Venue","Permitting Assistance","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","DJ","Lawn Games","Party Supplies"]},
    "Rooftop Party":{"Birthday":["Venue","Catering","Bartending","DJ","Lighting & Stage Production","Furniture & Linen Rentals","Photography","Photo Booth","Cake"],"Corporate Mixer":["Venue","Catering","Bartending","DJ","Lighting & Stage Production","Furniture & Linen Rentals","Photography"],"Wedding After-Party":["Venue","Catering","Bartending","DJ","Lighting & Stage Production","Furniture & Linen Rentals","Photography","Photo Booth"]},
    "Beach Party":{"Summer":["Venue","Permitting Assistance","Tent & Outdoor Rentals","Furniture & Linen Rentals","Catering","Bartending","DJ","Lawn Games","Party Supplies","Photography"],"Birthday":["Venue","Permitting Assistance","Tent & Outdoor Rentals","Furniture & Linen Rentals","Catering","Cake","Bartending","DJ","Lawn Games","Party Supplies","Photography","Photo Booth"],"Corporate":["Venue","Permitting Assistance","Tent & Outdoor Rentals","Furniture & Linen Rentals","Catering","Bartending","DJ","Lawn Games","Party Supplies","Photography","Team Building Events"]}
  },
  "Professional & Networking":{
    "Corporate Party":{"Annual Office Party":["Venue","Catering","Bartending","DJ","Photography","Decorations","Photo Booth","Party Favors"],"Summer Company Picnic":["Venue","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","Bartending","DJ","Lawn Games","Bounce House Rentals","Photography","Party Favors"],"Department Celebration":["Venue","Catering","Bartending","Decorations","Photography","Cake"]},
    "Networking Mixer":{"Industry Mixer":["Venue","Catering","Bartending","AV & Sound Technicians","Photography","Stationery"],"Young Professionals":["Venue","Catering","Bartending","DJ","Photography","Stationery"],"Corporate Happy Hour":["Venue","Catering","Bartending","DJ","Photography"]},
    "Launch Party":{"Product Launch":["Venue","Catering","Bartending","DJ","AV & Sound Technicians","Photography","Videography","Decorations","Lighting & Stage Production","Photo Booth","Stationery"],"App Launch":["Venue","Catering","Bartending","DJ","AV & Sound Technicians","Photography","Videography","Decorations","Lighting & Stage Production","Photo Booth","Stationery"],"Book Launch":["Venue","Catering","Bartending","AV & Sound Technicians","Photography","Decorations","Stationery"]},
    "Holiday Office Party":{"Company Holiday Party":["Venue","Catering","Bartending","DJ","Decorations","Photography","Photo Booth","Party Favors","Florist"],"Department Holiday Lunch":["Venue","Catering","Decorations","Photography"],"Virtual Holiday Party":["AV & Sound Technicians","Catering","Party Favors"]},
    "Industry Gala":{"Annual Gala":["Venue","Catering","Bartending","Live Band","Photography","Videography","Florist","Lighting & Stage Production","AV & Sound Technicians","Stationery","Decorations","Red Carpet Services","Transportation"],"Awards Ceremony":["Venue","Catering","Bartending","Live Band","Photography","Videography","Florist","Lighting & Stage Production","AV & Sound Technicians","Stationery","Decorations","Red Carpet Services"],"Hall of Fame Induction":["Venue","Catering","Bartending","Live Band","Photography","Videography","Florist","Lighting & Stage Production","AV & Sound Technicians","Stationery","Decorations"]},
    "Fundraiser / Charity Gala":{"Annual Charity Gala":["Venue","Catering","Bartending","Live Band","Photography","Videography","Florist","Lighting & Stage Production","AV & Sound Technicians","Auctioneer Services","Stationery","Photo Booth","Transportation"],"Benefit Dinner":["Venue","Catering","Bartending","Photography","Videography","Florist","AV & Sound Technicians","Auctioneer Services","Stationery"],"Fundraising Auction":["Venue","Catering","Bartending","Photography","Florist","AV & Sound Technicians","Auctioneer Services","Stationery"]}
  },
  "Specialty & Themed":{
    "Costume / Masquerade":{"Halloween Costume Party":["Venue","Decorations","DJ","Catering","Bartending","Photo Booth","Lighting & Stage Production","Party Favors"],"Masquerade Ball":["Venue","Decorations","DJ","Catering","Bartending","Photo Booth","Lighting & Stage Production","Party Favors","Florist"],"Themed Costume Party":["Venue","Decorations","DJ","Catering","Bartending","Photo Booth","Party Favors"]},
    "Murder Mystery":{"Dinner Murder Mystery":["Venue","Interactive Events","Catering","Bartending","Decorations","Photography","Stationery"],"Corporate":["Venue","Interactive Events","Catering","Bartending","Decorations","Photography"],"Birthday":["Venue","Interactive Events","Catering","Cake","Bartending","Decorations","Photography","Stationery"]},
    "Casino Night":{"Casino Fundraiser":["Venue","Interactive Events","Catering","Bartending","DJ","Decorations","Photo Booth","Party Favors","Lighting & Stage Production"],"Birthday Casino Night":["Venue","Interactive Events","Catering","Cake","Bartending","DJ","Decorations","Photo Booth","Party Favors"],"Corporate Casino":["Venue","Interactive Events","Catering","Bartending","DJ","Decorations","Photo Booth","Photography","Party Favors"]},
    "Paint & Sip":{"Bachelorette":["Venue","Paint & Sip","Catering","Bartending","Party Favors","Photography"],"Birthday":["Venue","Paint & Sip","Catering","Cake","Bartending","Party Favors","Photography"],"Team Building":["Venue","Paint & Sip","Catering","Bartending","Photography"]},
    "Trivia Night":{"Pub Trivia":["Venue","Trivia Host","Catering","Bartending","Party Favors"],"Corporate Trivia":["Venue","Trivia Host","Catering","Bartending","Photography","Party Favors"],"Birthday Trivia":["Venue","Trivia Host","Catering","Cake","Bartending","Party Favors","Photography"]},
    "Kids Parties":{"Princess Party":["Venue","Party Characters","Catering","Cake","Decorations","Party Favors","Photography","Face Painters","Balloon Artists"],"Superhero Party":["Venue","Party Characters","Catering","Cake","Decorations","Party Favors","Photography","Face Painters","Balloon Artists"],"Dinosaur Birthday":["Venue","Party Characters","Bounce House Rentals","Catering","Cake","Decorations","Party Favors","Photography","Face Painters"],"Bounce House Party":["Venue","Bounce House Rentals","Catering","Cake","Decorations","Party Favors","Photography","Party Characters"]},
    "Divorce Party":{"Uncoupling Celebration":["Venue","Catering","Bartending","Cake","Decorations","DJ","Photo Booth","Party Favors","Photography"],"Freedom Party":["Venue","Catering","Bartending","Cake","Decorations","DJ","Photo Booth","Party Favors"],"New Chapter Party":["Venue","Catering","Bartending","Cake","Decorations","DJ","Photo Booth","Party Favors"]}
  },
  "Large-Scale & Public":{
    "Rave / EDM":{"EDM Rave":["Venue","DJ","Lighting & Stage Production","AV & Sound Technicians","Security","Bartending","Photography","Videography","Medical Services"],"Warehouse Rave":["Venue","DJ","Lighting & Stage Production","AV & Sound Technicians","Security","Bartending","Photography","Medical Services"],"Festival Rave":["Venue","Concert Promotion Services","DJ","Lighting & Stage Production","AV & Sound Technicians","Security","Bartending","Catering","Photography","Videography","Medical Services","Porta-Potty Rentals"]},
    "Music Festival":{"Rock Concert":["Venue","Live Bands","Concert Promotion Services","AV & Sound Technicians","Lighting & Stage Production","Security","Catering","Bartending","Photography","Ticket Services"],"Jazz Festival":["Venue","Live Bands","Concert Promotion Services","AV & Sound Technicians","Lighting & Stage Production","Security","Catering","Bartending","Photography","Ticket Services","Porta-Potty Rentals"],"Hip Hop Show":["Venue","Live Bands","Concert Promotion Services","AV & Sound Technicians","Lighting & Stage Production","Security","Catering","Bartending","Photography","Ticket Services"]},
    "Festival":{"Summerfest":["Venue","Permitting Assistance","Security","Medical Services","Tent & Outdoor Rentals","Furniture & Linen Rentals","AV & Sound Technicians","Lighting & Stage Production","Catering","Bartending","Porta-Potty Rentals","Parking & Transportation","Ticket Services","Photography","Videography"],"Harvest Festival":["Venue","Permitting Assistance","Security","Medical Services","Tent & Outdoor Rentals","Catering","Bartending","Porta-Potty Rentals","Parking & Transportation","Ticket Services","Photography"],"Arts Festival":["Venue","Permitting Assistance","Security","Medical Services","Tent & Outdoor Rentals","Catering","Bartending","Porta-Potty Rentals","Parking & Transportation","Ticket Services","Photography"]},
    "Tailgate":{"Football Tailgate":["Venue","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","DJ","Lawn Games","Bartending","Party Supplies","AV & Sound Technicians"],"Soccer Tailgate":["Venue","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","DJ","Lawn Games","Bartending","Party Supplies"],"Concert Tailgate":["Venue","Catering","Tent & Outdoor Rentals","Furniture & Linen Rentals","DJ","Bartending","Party Supplies"]}
  },
  "Weddings & Ceremonies":{
    "Wedding Ceremony + Reception":{"Traditional":["Venue","Officiant","Catering","DJ","Photography","Videography","Florist","Cake","Bartending","Decorations","Attire","Hair & Makeup","Jewelry","Stationery","Transportation","Photo Booth","Lighting & Stage Production","Furniture & Linen Rentals","Day-of Coordinator","Hotel Room Blocks"],"Micro-Wedding":["Venue","Officiant","Catering","DJ","Photography","Florist","Cake","Bartending","Decorations","Attire","Hair & Makeup","Stationery"],"Destination":["Venue","Travel Agency","Lodging","Transportation","Destination Wedding Planners","Officiant","Catering","DJ","Photography","Videography","Florist","Cake","Bartending","Hair & Makeup","Stationery","Attire"],"Elopement":["Venue","Officiant","Photography","Videography","Florist","Attire","Hair & Makeup","Cake","Catering","Transportation"]},
    "Vow Renewal":{"Anniversary":["Venue","Officiant","Photography","Videography","Florist","Cake","Catering","Attire","Hair & Makeup","DJ","Stationery"],"Destination":["Venue","Travel Agency","Officiant","Photography","Videography","Florist","Cake","Catering","Attire","Hair & Makeup","Transportation"],"Intimate":["Venue","Officiant","Photography","Florist","Cake","Attire","Hair & Makeup"]},
    "Baby Naming / Christening":{"Christening":["Venue","Officiant","Catering","Cake","Decorations","Photography","Stationery","Party Favors"],"Baby Naming Celebration":["Venue","Officiant","Catering","Cake","Decorations","Photography","Stationery","Party Favors"],"Baptism Reception":["Venue","Catering","Cake","Decorations","Photography","Stationery","Party Favors"]}
  },
  "Corporate Events":{
    "Conference":{"Industry Conference":["Venue","AV & Sound Technicians","Catering","Photography","Videography","Lighting & Stage Production","Furniture & Linen Rentals","Stationery","Event Planners","Parking & Transportation","Security","Wi-Fi Services"],"Annual Summit":["Venue","AV & Sound Technicians","Catering","Photography","Videography","Lighting & Stage Production","Furniture & Linen Rentals","Stationery","Event Planners","Parking & Transportation"],"Leadership Conference":["Venue","AV & Sound Technicians","Catering","Photography","Videography","Lighting & Stage Production","Furniture & Linen Rentals","Stationery","Event Planners"]},
    "Corporate Retreat":{"Leadership Retreat":["Venue","Catering","Team Building Events","AV & Sound Technicians","Photography","Transportation","Lodging","Event Planners"],"Team Offsite":["Venue","Catering","Team Building Events","AV & Sound Technicians","Photography","Transportation","Event Planners"],"Company Retreat":["Venue","Catering","Team Building Events","Photography","Transportation","Lodging","Event Planners"]},
    "Team Building":{"Escape Room":["Venue","Interactive Events","Catering","Photography","Event Planners"],"Cooking Class":["Venue","Catering","Team Building Events","Photography","Event Planners"],"Outdoor Challenge":["Venue","Team Building Events","Catering","Photography","Transportation","Event Planners"]},
    "Trade Show / Expo":{"Industry Trade Show":["Venue","Furniture & Linen Rentals","Lighting & Stage Production","AV & Sound Technicians","Catering","Security","Photography","Parking & Transportation","Event Planners","Wi-Fi Services","Ticket Services"],"Consumer Expo":["Venue","Furniture & Linen Rentals","Lighting & Stage Production","AV & Sound Technicians","Catering","Security","Photography","Parking & Transportation","Event Planners","Ticket Services"],"Vendor Fair":["Venue","Furniture & Linen Rentals","Catering","Security","Photography","Event Planners"]},
    "Sales Kickoff":{"Annual Sales Kickoff":["Venue","AV & Sound Technicians","Catering","Lighting & Stage Production","Photography","Videography","Decorations","Event Planners","Stationery","Furniture & Linen Rentals"],"Quarterly Meeting":["Venue","AV & Sound Technicians","Catering","Photography","Event Planners","Stationery"],"Sales Rally":["Venue","AV & Sound Technicians","Catering","Lighting & Stage Production","Photography","Decorations","Event Planners"]}
  },
  "Fundraising & Charity":{
    "Charity Auction":{"Live Auction Gala":["Venue","Catering","Bartending","Auctioneer Services","Photography","Videography","Florist","Lighting & Stage Production","AV & Sound Technicians","Stationery","Event Planners"],"Silent Auction":["Venue","Catering","Bartending","Auction Services","Photography","Stationery","Decorations","Event Planners"],"Charity Auction Dinner":["Venue","Catering","Bartending","Auctioneer Services","Photography","Florist","AV & Sound Technicians","Stationery","Event Planners"]},
    "Benefit Concert":{"Charity Rock Show":["Venue","Live Bands","Concert Promotion Services","AV & Sound Technicians","Lighting & Stage Production","Security","Catering","Bartending","Photography","Ticket Services","Event Planners"],"Benefit Music Festival":["Venue","Live Bands","Concert Promotion Services","AV & Sound Technicians","Lighting & Stage Production","Security","Catering","Bartending","Photography","Ticket Services","Porta-Potty Rentals","Event Planners"],"Disaster Relief Concert":["Venue","Live Bands","Concert Promotion Services","AV & Sound Technicians","Lighting & Stage Production","Security","Catering","Bartending","Photography","Ticket Services","Event Planners"]},
    "Fundraising Dinner":{"Annual Dinner":["Venue","Catering","Bartending","Photography","Videography","Florist","AV & Sound Technicians","Event Planners"],"Scholarship Dinner":["Venue","Catering","Bartending","Photography","Florist","AV & Sound Technicians","Event Planners"],"Benefit Reception":["Venue","Catering","Bartending","Photography","Florist","AV & Sound Technicians","Event Planners"]},
    "Walkathon / Run":{"Charity 5K":["Venue","Permitting Assistance","Security","Medical Services","Catering","Tent & Outdoor Rentals","AV & Sound Technicians","Photography","Timing Services","Porta-Potty Rentals","Event Planners"],"Awareness Walk":["Venue","Permitting Assistance","Security","Medical Services","Catering","Tent & Outdoor Rentals","AV & Sound Technicians","Photography","Timing Services","Porta-Potty Rentals","Event Planners"],"Breast Cancer Walk":["Venue","Permitting Assistance","Security","Medical Services","Catering","Tent & Outdoor Rentals","AV & Sound Technicians","Photography","Timing Services","Porta-Potty Rentals","Event Planners"]}
  }
};

// ── 7. By Category Dimension (Overture-Mapped) ────────────────────────────

export const categoryByOverture: OvertureCategory[] = [
  {
    id: 'planning-coordination',
    name: 'Planning, Coordination & Event Services',
    slug: 'planning-coordination',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Party and Event Planning', slug: 'party-and-event-planning', count: 8316 },
          { name: 'Wedding Planning', slug: 'wedding-planning', count: 44441 },
          { name: 'Officiating Services', slug: 'officiating-services', count: 259 },
          { name: 'Team Building Activity', slug: 'team-building-activity', count: 173 }
        ]
      }
    ]
  },
  {
    id: 'venues-event-spaces',
    name: 'Venues & Event Spaces',
    slug: 'venues-event-spaces',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Venue and Event Space', slug: 'venue-and-event-space', count: 14301 },
          { name: 'Wedding Chapel', slug: 'wedding-chapel', count: 79 },
          { name: 'Exhibition and Trade Center', slug: 'exhibition-and-trade-center', count: 193 }
        ]
      },
      {
        label: 'Proposal Venues',
        slug: 'proposal-venues',
        items: [
          { name: 'Attraction Farm', slug: 'attraction-farm', count: 145 },
          { name: 'Orchard', slug: 'orchard', count: 87 },
          { name: 'Distillery', slug: 'distillery', count: 6960 },
          { name: 'Art Museum', slug: 'art-museum', count: 15740 }
        ]
      },
      {
        label: 'Performance Venues',
        slug: 'performance-venues',
        items: [
          { name: 'Auditorium', slug: 'auditorium', count: 19042 },
          { name: 'Theaters and Performance Venues', slug: 'theaters-and-performance-venues', count: 75617 },
          { name: 'Music Venue', slug: 'music-venue', count: 54581 }
        ]
      },
      {
        label: 'Bachelor/Bachelorette Venues',
        slug: 'bachelor-bachelorette-venues',
        items: [
          { name: 'Cigar Bar', slug: 'cigar-bar', count: 65 },
          { name: 'Cocktail Bar', slug: 'cocktail-bar', count: 46365 },
          { name: 'Sports Bar', slug: 'sports-bar', count: 8615 },
          { name: 'Sake Bar', slug: 'sake-bar', count: 12820 }
        ]
      }
    ]
  },
  {
    id: 'annual-seasonal-festival',
    name: 'Annual, Seasonal & Festival Events',
    slug: 'annual-seasonal-festival',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Festival', slug: 'festival', count: 11949 },
          { name: 'Fair', slug: 'fair', count: 10622 },
          { name: 'General Festivals', slug: 'general-festivals', count: 611 },
          { name: 'Film Festivals and Organizations', slug: 'film-festivals-and-organizations', count: 87 },
          { name: 'Music Festivals and Organizations', slug: 'music-festivals-and-organizations', count: 69 },
          { name: 'Circus', slug: 'circus', count: 3343 }
        ]
      }
    ]
  },
  {
    id: 'catering-food-beverage',
    name: 'Catering, Food & Beverage',
    slug: 'catering-food-beverage',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Caterer', slug: 'caterer', count: 67345 },
          { name: 'Personal Chef', slug: 'personal-chef', count: 1120 },
          { name: 'Bartender', slug: 'bartender', count: 3535 },
          { name: 'Bakery', slug: 'bakery', count: 431989 },
          { name: 'Food Truck', slug: 'food-truck', count: 37597 },
          { name: 'Sommelier Service', slug: 'sommelier-service', count: 2 },
          { name: 'Food and Beverage Consultant', slug: 'food-and-beverage-consultant', count: 2796 }
        ]
      }
    ]
  },
  {
    id: 'entertainment-musicians-performers',
    name: 'Entertainment, Musicians & Performers',
    slug: 'entertainment-musicians-performers',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'DJ Service', slug: 'dj-service', count: 3284 },
          { name: 'Musician', slug: 'musician', count: 1527 },
          { name: 'Choir', slug: 'choir', count: 2165 },
          { name: 'Musical Band Orchestras and Symphonies', slug: 'musical-band-orchestras-and-symphonies', count: 49 },
          { name: 'Magician', slug: 'magician', count: 468 },
          { name: 'Clown', slug: 'clown', count: 34 },
          { name: 'Party Character', slug: 'party-character', count: 18 },
          { name: 'Caricature', slug: 'caricature', count: 18 },
          { name: 'Face Painting', slug: 'face-painting', count: 44 },
          { name: 'Henna Artist', slug: 'henna-artist', count: 61 }
        ]
      },
      {
        label: 'Venues',
        slug: 'venues',
        items: [
          { name: 'Comedy Club', slug: 'comedy-club', count: 9261 },
          { name: 'Dance Club', slug: 'dance-club', count: 102365 },
          { name: 'Karaoke', slug: 'karaoke', count: 25739 },
          { name: 'Jazz and Blues', slug: 'jazz-and-blues', count: 2597 }
        ]
      }
    ]
  },
  {
    id: 'attractions-amusement-family',
    name: 'Attractions, Amusement & Family Activities',
    slug: 'attractions-amusement-family',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Amusement Park', slug: 'amusement-park', count: 36789 },
          { name: 'Water Park', slug: 'water-park', count: 13387 },
          { name: 'Aquarium', slug: 'aquarium', count: 7501 },
          { name: 'Haunted House', slug: 'haunted-house', count: 1746 },
          { name: 'Escape Rooms', slug: 'escape-rooms', count: 8502 },
          { name: 'Laser Tag', slug: 'laser-tag', count: 1936 },
          { name: 'Planetarium', slug: 'planetarium', count: 1248 },
          { name: 'Drive-In Theater', slug: 'drive-in-theater', count: 5204 },
          { name: 'Zipline Center', slug: 'zipline-center', count: 29 },
          { name: 'Challenge Courses Center', slug: 'challenge-courses-center', count: 34 },
          { name: 'Axe Throwing', slug: 'axe-throwing', count: 20 },
          { name: 'Kids Recreation & Party', slug: 'kids-recreation-party', count: 8443 }
        ]
      }
    ]
  },
  {
    id: 'outdoor-nature-adventure',
    name: 'Outdoor, Nature & Adventure Recreation',
    slug: 'outdoor-nature-adventure',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Beach', slug: 'beach', count: 182785 },
          { name: 'Lake', slug: 'lake', count: 182636 },
          { name: 'Waterfall', slug: 'waterfall', count: 6241 },
          { name: 'Cave', slug: 'cave', count: 3551 },
          { name: 'Canyon', slug: 'canyon', count: 11 },
          { name: 'Crater', slug: 'crater', count: 37974 },
          { name: 'Sand Dune', slug: 'sand-dune', count: 11 },
          { name: 'Trail', slug: 'trail', count: 39531 },
          { name: 'Lookout', slug: 'lookout', count: 26 },
          { name: 'Skyline', slug: 'skyline', count: 1 },
          { name: 'Backpacking Area', slug: 'backpacking-area', count: 5 },
          { name: 'Hot Springs', slug: 'hot-springs', count: 28 },
          { name: 'Cliff Jumping Center', slug: 'cliff-jumping-center', count: 104 },
          { name: 'Stargazing Area', slug: 'stargazing-area', count: 1 },
          { name: 'Observatory Decks', slug: 'observatory-decks', count: 2380 }
        ]
      }
    ]
  },
  {
    id: 'sports-active-recreation',
    name: 'Sports & Active Recreation',
    slug: 'sports-active-recreation',
    subGroups: [
      {
        label: 'Leisure Sports',
        slug: 'leisure-sports',
        items: [
          { name: 'Bowling Alley', slug: 'bowling-alley', count: 16244 },
          { name: 'Miniature Golf Course', slug: 'miniature-golf-course', count: 4017 },
          { name: 'Disc Golf Course', slug: 'disc-golf-course', count: 1867 },
          { name: 'Skate Park', slug: 'skate-park', count: 13873 },
          { name: 'Skating Rink', slug: 'skating-rink', count: 6831 },
          { name: 'Pool Billiards', slug: 'pool-billiards', count: 16129 },
          { name: 'Bubble Soccer Field', slug: 'bubble-soccer-field', count: 1 },
          { name: 'Bicycle Path', slug: 'bicycle-path', count: 11 }
        ]
      },
      {
        label: 'Court & Field Sports',
        slug: 'court-field-sports',
        items: [
          { name: 'Tennis Court', slug: 'tennis-court', count: 22794 },
          { name: 'Baseball Field', slug: 'baseball-field', count: 8059 },
          { name: 'Basketball Court', slug: 'basketball-court', count: 7184 },
          { name: 'Badminton Court', slug: 'badminton-court', count: 2959 },
          { name: 'Batting Cage', slug: 'batting-cage', count: 2211 },
          { name: 'Volleyball Court', slug: 'volleyball-court', count: 1573 },
          { name: 'Hockey Field', slug: 'hockey-field', count: 775 },
          { name: 'Squash Court', slug: 'squash-court', count: 744 },
          { name: 'Rugby Pitch', slug: 'rugby-pitch', count: 416 },
          { name: 'Racquetball Court', slug: 'racquetball-court', count: 312 },
          { name: 'Beach Volleyball Court', slug: 'beach-volleyball-court', count: 25 },
          { name: 'Bocce Ball Court', slug: 'bocce-ball-court', count: 3 },
          { name: 'Handball Court', slug: 'handball-court', count: 1 },
          { name: 'American Football Field', slug: 'american-football-field', count: 2 }
        ]
      },
      {
        label: 'Land & Motor Sports',
        slug: 'land-motor-sports',
        items: [
          { name: 'Race Track', slug: 'race-track', count: 18626 },
          { name: 'Go Kart Track', slug: 'go-kart-track', count: 124 },
          { name: 'ATV Recreation Park', slug: 'atv-recreation-park', count: 936 },
          { name: 'ATV Rentals and Tours', slug: 'atv-rentals-and-tours', count: 2038 },
          { name: 'Horse Riding', slug: 'horse-riding', count: 23916 },
          { name: 'Horseback Riding Service', slug: 'horseback-riding-service', count: 10316 },
          { name: 'Archery Range', slug: 'archery-range', count: 2395 },
          { name: 'Shooting Range', slug: 'shooting-range', count: 11524 },
          { name: 'Wildlife Hunting Range', slug: 'wildlife-hunting-range', count: 238 }
        ]
      },
      {
        label: 'Water Sports',
        slug: 'water-sports',
        items: [
          { name: 'Diving Center', slug: 'diving-center', count: 12565 },
          { name: 'Surfing', slug: 'surfing', count: 5951 },
          { name: 'Rafting/Kayaking Area', slug: 'rafting-kayaking-area', count: 437 },
          { name: 'Snorkeling', slug: 'snorkeling', count: 336 },
          { name: 'Sailing Area', slug: 'sailing-area', count: 162 },
          { name: 'Kiteboarding Instruction', slug: 'kiteboarding-instruction', count: 3 },
          { name: 'Paddleboard Rental', slug: 'paddleboard-rental', count: 102 },
          { name: 'Snorkeling Equipment Rental', slug: 'snorkeling-equipment-rental', count: 6 },
          { name: 'Jet Skis Rental', slug: 'jet-skis-rental', count: 735 }
        ]
      },
      {
        label: 'Adventure & Extreme Sports',
        slug: 'adventure-extreme-sports',
        items: [
          { name: 'Rock Climbing Spot', slug: 'rock-climbing-spot', count: 5350 },
          { name: 'Rock Climbing Gym', slug: 'rock-climbing-gym', count: 102 },
          { name: 'Skydiving', slug: 'skydiving', count: 1678 },
          { name: 'Adventure Sports Center', slug: 'adventure-sports-center', count: 641 },
          { name: 'Kiteboarding', slug: 'kiteboarding', count: 736 },
          { name: 'Paddleboarding Center', slug: 'paddleboarding-center', count: 585 },
          { name: 'Trampoline Park', slug: 'trampoline-park', count: 71 },
          { name: 'Airsoft Fields', slug: 'airsoft-fields', count: 48 },
          { name: 'Hang Gliding Center', slug: 'hang-gliding-center', count: 68 },
          { name: 'Climbing Service', slug: 'climbing-service', count: 104 },
          { name: 'Tubing Provider', slug: 'tubing-provider', count: 13 },
          { name: 'High Gliding Center', slug: 'high-gliding-center', count: 6 },
          { name: 'Flyboarding Rental', slug: 'flyboarding-rental', count: 3 },
          { name: 'Bungee Jumping Center', slug: 'bungee-jumping-center', count: 2 },
          { name: 'Parasailing Ride Service', slug: 'parasailing-ride-service', count: 13 }
        ]
      }
    ]
  },
  {
    id: 'transport-logistics-tours',
    name: 'Transport, Logistics & Tours',
    slug: 'transport-logistics-tours',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Tours', slug: 'tours', count: 150078 },
          { name: 'Aerial Tours', slug: 'aerial-tours', count: 72 },
          { name: 'Hot Air Balloons Tour', slug: 'hot-air-balloons-tour', count: 814 },
          { name: 'Boat Charter', slug: 'boat-charter', count: 829 },
          { name: 'Boat Hire Service', slug: 'boat-hire-service', count: 7078 },
          { name: 'Fishing Charter', slug: 'fishing-charter', count: 10980 },
          { name: 'Limo Services', slug: 'limo-services', count: 9175 },
          { name: 'Coach Bus', slug: 'coach-bus', count: 338 },
          { name: 'Town Car Service', slug: 'town-car-service', count: 322 },
          { name: 'Private Jet Charters', slug: 'private-jet-charters', count: 133 },
          { name: 'Valet Service', slug: 'valet-service', count: 433 },
          { name: 'Bus Rental', slug: 'bus-rental', count: 1287 },
          { name: 'Travel Services', slug: 'travel-services', count: 308427 },
          { name: 'Passport and Visa Services', slug: 'passport-and-visa-services', count: 12178 }
        ]
      }
    ]
  },
  {
    id: 'equipment-event-rentals',
    name: 'Equipment & Event Rentals',
    slug: 'equipment-event-rentals',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Party Equipment Rental', slug: 'party-equipment-rental', count: 8832 },
          { name: 'Balloon Services', slug: 'balloon-services', count: 416 },
          { name: 'Game Truck Rental', slug: 'game-truck-rental', count: 16 },
          { name: 'Golf Cart Rental', slug: 'golf-cart-rental', count: 76 },
          { name: 'Party Bike Rental', slug: 'party-bike-rental', count: 6 },
          { name: 'Party Bus Rental', slug: 'party-bus-rental', count: 297 },
          { name: 'Beach Equipment Rentals', slug: 'beach-equipment-rentals', count: 13010 },
          { name: 'Bike Rentals', slug: 'bike-rentals', count: 975 },
          { name: 'Scooter Rental', slug: 'scooter-rental', count: 4478 },
          { name: 'Sport Equipment Rentals', slug: 'sport-equipment-rentals', count: 127 },
          { name: 'Furniture Rental', slug: 'furniture-rental', count: 565 },
          { name: 'Ice Supplier', slug: 'ice-supplier', count: 231 }
        ]
      }
    ]
  },
  {
    id: 'accommodations-lodging',
    name: 'Accommodations & Lodging',
    slug: 'accommodations-lodging',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Holiday Rental Home', slug: 'holiday-rental-home', count: 153407 },
          { name: 'Bed and Breakfast', slug: 'bed-and-breakfast', count: 97579 },
          { name: 'Resort', slug: 'resort', count: 97155 },
          { name: 'Campground', slug: 'campground', count: 96493 },
          { name: 'Hostel', slug: 'hostel', count: 48334 },
          { name: 'Lodge', slug: 'lodge', count: 46756 },
          { name: 'Cabin', slug: 'cabin', count: 24523 },
          { name: 'Cottage', slug: 'cottage', count: 19968 },
          { name: 'Guest House', slug: 'guest-house', count: 4883 },
          { name: 'Health Retreats', slug: 'health-retreats', count: 111 },
          { name: 'Mountain Huts', slug: 'mountain-huts', count: 60 }
        ]
      }
    ]
  },
  {
    id: 'beauty-styling-wellness',
    name: 'Beauty, Styling & Wellness',
    slug: 'beauty-styling-wellness',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Spas', slug: 'spas', count: 291737 },
          { name: 'Hair Salon', slug: 'hair-salon', count: 185327 },
          { name: 'Nail Salon', slug: 'nail-salon', count: 97805 },
          { name: 'Tanning', slug: 'tanning', count: 34950 },
          { name: 'Skin Care', slug: 'skin-care', count: 23896 },
          { name: 'Makeup Artist', slug: 'makeup-artist', count: 18854 },
          { name: 'Day Spa', slug: 'day-spa', count: 11975 },
          { name: 'Hair Stylist', slug: 'hair-stylist', count: 9881 },
          { name: 'Waxing', slug: 'waxing', count: 5045 },
          { name: 'Eyelash Service', slug: 'eyelash-service', count: 1202 },
          { name: 'Spray Tanning', slug: 'spray-tanning', count: 728 },
          { name: 'Sugaring', slug: 'sugaring', count: 662 },
          { name: 'Eyebrow Service', slug: 'eyebrow-service', count: 454 },
          { name: 'Blow Dry / Blow Out Service', slug: 'blow-dry-blow-out-service', count: 212 },
          { name: 'Tattoo & Piercing', slug: 'tattoo-and-piercing', count: 165374 }
        ]
      }
    ]
  },
  {
    id: 'photography-video-scenic',
    name: 'Photography, Video & Scenic Locations',
    slug: 'photography-video-scenic',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Photographer', slug: 'photographer', count: 74340 },
          { name: 'Videographer', slug: 'videographer', count: 3096 },
          { name: 'Photo Booth Rental', slug: 'photo-booth-rental', count: 2686 }
        ]
      },
      {
        label: 'Photo Locations',
        slug: 'photo-locations',
        items: [
          { name: 'Botanical Garden', slug: 'botanical-garden', count: 8834 },
          { name: 'Castle', slug: 'castle', count: 8490 },
          { name: 'Palace', slug: 'palace', count: 4497 },
          { name: 'Landmarks & Historic Monument', slug: 'landmarks-and-historic-monument', count: 945233 }
        ]
      }
    ]
  },
  {
    id: 'creative-art-design',
    name: 'Creative, Art & Design Support',
    slug: 'creative-art-design',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Image Consultant', slug: 'image-consultant', count: 2361 },
          { name: 'Corporate Gift Supplier', slug: 'corporate-gift-supplier', count: 77 },
          { name: 'Calligraphy', slug: 'calligraphy', count: 26 },
          { name: 'Commissioned Artist', slug: 'commissioned-artist', count: 686 },
          { name: 'Graphic Designer', slug: 'graphic-designer', count: 59635 }
        ]
      }
    ]
  },
  {
    id: 'retail-craft-support',
    name: 'Retail & Craft Support',
    slug: 'retail-craft-support',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Bridal Shop', slug: 'bridal-shop', count: 47256 },
          { name: 'Flower and Gift Shop', slug: 'flower-and-gift-shop', count: 436157 },
          { name: 'Party Supply', slug: 'party-supply', count: 32326 },
          { name: 'Jewelry Store', slug: 'jewelry-store', count: 237906 },
          { name: 'Photography Store', slug: 'photography-store', count: 19802 },
          { name: 'Gemstones', slug: 'gemstones', count: 264 },
          { name: 'Sewing & Alterations', slug: 'sewing-and-alterations', count: 41263 },
          { name: 'Sign Making', slug: 'sign-making', count: 25804 },
          { name: 'Film Production', slug: 'film-production', count: 3775 }
        ]
      }
    ]
  },
  {
    id: 'tech-specialized-services',
    name: 'Tech & Specialized Services',
    slug: 'tech-specialized-services',
    subGroups: [
      {
        label: 'Main',
        slug: 'main',
        items: [
          { name: 'Event Technology Service', slug: 'event-technology-service', count: 631 },
          { name: 'Silent Disco', slug: 'silent-disco', count: 3 },
          { name: 'Trivia Host', slug: 'trivia-host', count: 3 }
        ]
      }
    ]
  }
];

// ── 8. Category-Specific Filters ───────────────────────────────────────────

export const subcategoryFilters: CategoryFilters = {
  universal: [
    {
      key: 'price_range',
      label: 'Price Range',
      type: 'range',
      options: [
        { label: 'Min', value: 'min' },
        { label: 'Max', value: 'max' },
      ],
    },
    {
      key: 'price_tier',
      label: 'Price Tier',
      type: 'checkbox',
      options: [
        { label: '$', value: '$' },
        { label: '$$', value: '$$' },
        { label: '$$$', value: '$$$' },
        { label: '$$$$', value: '$$$$' },
      ],
    },
    {
      key: 'distance',
      label: 'Distance',
      type: 'checkbox',
      options: [
        { label: 'Within 1 mile', value: '1' },
        { label: 'Within 5 miles', value: '5' },
        { label: 'Within 10 miles', value: '10' },
        { label: 'Within 25 miles', value: '25' },
        { label: 'Within 50 miles', value: '50' },
        { label: '50+ miles', value: '50+' },
      ],
    },
    {
      key: 'rating',
      label: 'Rating',
      type: 'checkbox',
      options: [
        { label: '4.5+ stars', value: '4.5' },
        { label: '4.0+ stars', value: '4.0' },
        { label: '3.5+ stars', value: '3.5' },
        { label: '3.0+ stars', value: '3.0' },
        { label: 'Any rating', value: 'any' },
      ],
    },
    {
      key: 'availability',
      label: 'Availability',
      type: 'checkbox',
      options: [
        { label: 'Open now', value: 'open_now' },
        { label: 'Open today', value: 'open_today' },
        { label: 'Available this weekend', value: 'this_weekend' },
        { label: 'Advance booking required', value: 'advance_booking' },
        { label: 'Closest Available on date', value: 'closest_date' },
      ],
    },
    {
      key: 'instant_book',
      label: 'Instant Book',
      type: 'checkbox',
      options: [
        { label: 'Instant Book only', value: 'instant_book' },
      ],
    },
    {
      key: 'accessibility',
      label: 'Accessibility',
      type: 'checkbox',
      options: [
        { label: 'Wheelchair accessible', value: 'wheelchair' },
        { label: 'Service animals allowed', value: 'service_animals' },
        { label: 'Hearing loop available', value: 'hearing_loop' },
        { label: 'Accessible parking', value: 'accessible_parking' },
      ],
    },
    {
      key: 'cancellation',
      label: 'Cancellation Policy',
      type: 'checkbox',
      options: [
        { label: 'Free cancellation', value: 'free' },
        { label: 'Partial refund available', value: 'partial' },
        { label: 'Non-refundable', value: 'non_refundable' },
      ],
    },
    {
      key: 'deposit',
      label: 'Deposit Required',
      type: 'checkbox',
      options: [
        { label: 'No deposit', value: 'no_deposit' },
        { label: 'Deposit required (refundable)', value: 'refundable' },
        { label: 'Deposit required (non-refundable)', value: 'non_refundable' },
      ],
    },
  ],
  byCategory: {
    'planning-coordination': [
      {
        key: 'service_type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'Full-service planning', value: 'full-service-planning' }, { label: 'Day-of coordination', value: 'day-of-coordination' }, { label: 'Partial planning', value: 'partial-planning' }, { label: 'Month-of coordination', value: 'month-of-coordination' }, { label: 'A la carte services', value: 'a-la-carte-services' }],
      },
      {
        key: 'event_type',
        label: 'Event Type',
        type: 'checkbox',
        options: [{ label: 'Wedding', value: 'wedding' }, { label: 'Birthday party', value: 'birthday-party' }, { label: 'Corporate event', value: 'corporate-event' }, { label: 'Fundraiser / Gala', value: 'fundraiser-gala' }, { label: 'Baby shower', value: 'baby-shower' }, { label: 'Bridal shower', value: 'bridal-shower' }, { label: 'Anniversary', value: 'anniversary' }, { label: 'Holiday party', value: 'holiday-party' }, { label: 'Reunion', value: 'reunion' }],
      },
      {
        key: 'client_size',
        label: 'Client Size',
        type: 'checkbox',
        options: [{ label: 'Intimate (under 50 guests)', value: 'intimate-under-50-guests' }, { label: 'Small (50-100)', value: 'small-50-100' }, { label: 'Medium (100-250)', value: 'medium-100-250' }, { label: 'Large (250-500)', value: 'large-250-500' }, { label: 'Massive (500+)', value: 'massive-500' }],
      },
      {
        key: 'years_experience',
        label: 'Years of Experience',
        type: 'checkbox',
        options: [{ label: 'Less than 1 year', value: 'less-than-1-year' }, { label: '1-3 years', value: '1-3-years' }, { label: '3-5 years', value: '3-5-years' }, { label: '5-10 years', value: '5-10-years' }, { label: '10+ years', value: '10-years' }],
      },
      {
        key: 'portfolio_available',
        label: 'Portfolio Available',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'insurance_coverage',
        label: 'Insurance Coverage',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'virtual_consultations',
        label: 'Virtual Consultations',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'in_person_consultations',
        label: 'In-Person Consultations',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'languages_spoken',
        label: 'Languages Spoken',
        type: 'checkbox',
        options: [{ label: 'English', value: 'english' }, { label: 'Spanish', value: 'spanish' }, { label: 'French', value: 'french' }, { label: 'Mandarin', value: 'mandarin' }, { label: 'Arabic', value: 'arabic' }, { label: 'Other', value: 'other' }],
      }
    ],
    'venues-event-spaces': [
      {
        key: 'venue-capacity',
        label: 'Venue Capacity',
        type: 'checkbox',
        options: [{ label: 'Under 25', value: 'under-25' }, { label: '25-50', value: '25-50' }, { label: '51-100', value: '51-100' }, { label: '101-250', value: '101-250' }, { label: '251-500', value: '251-500' }, { label: '501-1000', value: '501-1000' }, { label: '1000+', value: '1000' }],
      },
      {
        key: 'venue-type',
        label: 'Venue Type',
        type: 'checkbox',
        options: [{ label: 'Indoor only', value: 'indoor-only' }, { label: 'Outdoor only', value: 'outdoor-only' }, { label: 'Covered outdoor', value: 'covered-outdoor' }, { label: 'Both indoor & outdoor', value: 'both-indoor-outdoor' }],
      },
      {
        key: 'event-types-allowed',
        label: 'Event Types Allowed',
        type: 'checkbox',
        options: [{ label: 'Weddings', value: 'weddings' }, { label: 'Corporate events', value: 'corporate-events' }, { label: 'Birthday parties', value: 'birthday-parties' }, { label: 'Concerts / performances', value: 'concerts-performances' }, { label: 'Trade shows / expos', value: 'trade-shows-expos' }, { label: 'Fundraisers / galas', value: 'fundraisers-galas' }, { label: 'Holiday parties', value: 'holiday-parties' }, { label: 'Baby / bridal showers', value: 'baby-bridal-showers' }, { label: 'Reunions', value: 'reunions' }, { label: 'Private dinners', value: 'private-dinners' }],
      },
      {
        key: 'amenities',
        label: 'Amenities',
        type: 'checkbox',
        options: [{ label: 'On-site parking', value: 'on-site-parking' }, { label: 'Valet parking', value: 'valet-parking' }, { label: 'Coat check', value: 'coat-check' }, { label: 'Restrooms (standard)', value: 'restrooms-standard' }, { label: 'Restrooms (luxury / ADA)', value: 'restrooms-luxury-ada' }, { label: 'Bridal suite / green room', value: 'bridal-suite-green-room' }, { label: 'Groom\'s suite', value: 'groom-s-suite' }, { label: 'Loading dock', value: 'loading-dock' }, { label: 'Elevator', value: 'elevator' }, { label: 'Stage / raised platform', value: 'stage-raised-platform' }, { label: 'Dance floor', value: 'dance-floor' }, { label: 'Built-in bar', value: 'built-in-bar' }, { label: 'Catering kitchen', value: 'catering-kitchen' }, { label: 'WiFi included', value: 'wifi-included' }, { label: 'AV equipment included', value: 'av-equipment-included' }, { label: 'Projector / screen', value: 'projector-screen' }, { label: 'Microphone / speakers', value: 'microphone-speakers' }, { label: 'Piano', value: 'piano' }, { label: 'Outdoor string lights', value: 'outdoor-string-lights' }, { label: 'Fire pit', value: 'fire-pit' }, { label: 'Photo booth area', value: 'photo-booth-area' }],
      },
      {
        key: 'catering-options',
        label: 'Catering Options',
        type: 'checkbox',
        options: [{ label: 'In-house catering only', value: 'in-house-catering-only' }, { label: 'Preferred vendor list required', value: 'preferred-vendor-list-required' }, { label: 'Any outside caterer allowed', value: 'any-outside-caterer-allowed' }, { label: 'No catering (self-catering allowed)', value: 'no-catering-self-catering-allowed' }],
      },
      {
        key: 'bar-options',
        label: 'Bar Options',
        type: 'checkbox',
        options: [{ label: 'No alcohol allowed', value: 'no-alcohol-allowed' }, { label: 'Bring your own (BYOB)', value: 'bring-your-own-byob' }, { label: 'In-house bar (cash)', value: 'in-house-bar-cash' }, { label: 'In-house bar (open)', value: 'in-house-bar-open' }, { label: 'Outside bartender allowed', value: 'outside-bartender-allowed' }],
      },
      {
        key: 'rental-hours',
        label: 'Rental Hours',
        type: 'checkbox',
        options: [{ label: 'Hourly rental', value: 'hourly-rental' }, { label: 'Half day (4-6 hours)', value: 'half-day-4-6-hours' }, { label: 'Full day (8-10 hours)', value: 'full-day-8-10-hours' }, { label: 'Weekend packages', value: 'weekend-packages' }, { label: 'Multi-day events', value: 'multi-day-events' }],
      },
      {
        key: 'overtime-policy',
        label: 'Overtime Policy',
        type: 'checkbox',
        options: [{ label: 'Allowed (hourly rate)', value: 'allowed-hourly-rate' }, { label: 'Not allowed', value: 'not-allowed' }, { label: 'Case by case', value: 'case-by-case' }],
      },
      {
        key: 'setup-cleanup-time',
        label: 'Setup & Cleanup Time',
        type: 'checkbox',
        options: [{ label: 'Included in rental', value: 'included-in-rental' }, { label: 'Extra fee', value: 'extra-fee' }, { label: 'Not included', value: 'not-included' }],
      },
      {
        key: 'insurance-required',
        label: 'Insurance Required',
        type: 'checkbox',
        options: [{ label: 'Yes (venue provides)', value: 'yes-venue-provides' }, { label: 'Yes (renter provides)', value: 'yes-renter-provides' }, { label: 'Not required', value: 'not-required' }],
      },
      {
        key: 'liability-waiver',
        label: 'Liability Waiver',
        type: 'checkbox',
        options: [{ label: 'Required', value: 'required' }, { label: 'Not required', value: 'not-required' }],
      },
      {
        key: 'venue-rules',
        label: 'Venue Rules',
        type: 'checkbox',
        options: [{ label: 'No glitter / confetti', value: 'no-glitter-confetti' }, { label: 'No candles (open flame)', value: 'no-candles-open-flame' }, { label: 'No rice / birdseed / petals', value: 'no-rice-birdseed-petals' }, { label: 'No sparklers', value: 'no-sparklers' }, { label: 'No smoking indoors', value: 'no-smoking-indoors' }, { label: 'No pets', value: 'no-pets' }, { label: 'Quiet hours enforced', value: 'quiet-hours-enforced' }],
      }
    ],
    'annual-seasonal-festival-events': [
      {
        key: 'event-date',
        label: 'Event Date',
        type: 'checkbox',
        options: [{ label: 'Specific date picker', value: 'specific-date-picker' }, { label: 'This weekend', value: 'this-weekend' }, { label: 'This month', value: 'this-month' }, { label: 'This season', value: 'this-season' }, { label: 'Upcoming (all)', value: 'upcoming-all' }],
      },
      {
        key: 'ticket-price',
        label: 'Ticket Price',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: 'Under $10', value: 'under-10' }, { label: '$10-25', value: '10-25' }, { label: '$25-50', value: '25-50' }, { label: '$50-100', value: '50-100' }, { label: '$100+', value: '100' }],
      },
      {
        key: 'ticket-availability',
        label: 'Ticket Availability',
        type: 'checkbox',
        options: [{ label: 'Available now', value: 'available-now' }, { label: 'Selling fast', value: 'selling-fast' }, { label: 'Sold out (waitlist)', value: 'sold-out-waitlist' }, { label: 'At door only', value: 'at-door-only' }],
      },
      {
        key: 'age-restrictions',
        label: 'Age Restrictions',
        type: 'checkbox',
        options: [{ label: 'All ages', value: 'all-ages' }, { label: '12+', value: '12' }, { label: '16+', value: '16' }, { label: '18+', value: '18' }, { label: '21+', value: '21' }],
      },
      {
        key: 'family-friendly',
        label: 'Family Friendly',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'pet-friendly',
        label: 'Pet Friendly',
        type: 'checkbox',
        options: [{ label: 'Yes (leashed)', value: 'yes-leashed' }, { label: 'Yes (service only)', value: 'yes-service-only' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Free on-site', value: 'free-on-site' }, { label: 'Paid on-site', value: 'paid-on-site' }, { label: 'Street parking only', value: 'street-parking-only' }, { label: 'Shuttle from remote lot', value: 'shuttle-from-remote-lot' }, { label: 'Public transit nearby', value: 'public-transit-nearby' }],
      },
      {
        key: 'restrooms',
        label: 'Restrooms',
        type: 'checkbox',
        options: [{ label: 'Portable toilets', value: 'portable-toilets' }, { label: 'Flush toilets (permanent)', value: 'flush-toilets-permanent' }, { label: 'VIP restrooms available', value: 'vip-restrooms-available' }, { label: 'ADA accessible', value: 'ada-accessible' }],
      },
      {
        key: 'food-drink',
        label: 'Food & Drink',
        type: 'checkbox',
        options: [{ label: 'Food vendors on-site', value: 'food-vendors-on-site' }, { label: 'BYO food allowed', value: 'byo-food-allowed' }, { label: 'Alcohol available', value: 'alcohol-available' }, { label: 'BYO alcohol allowed', value: 'byo-alcohol-allowed' }, { label: 'Water stations available', value: 'water-stations-available' }],
      },
      {
        key: 'weather-contingency',
        label: 'Weather Contingency',
        type: 'checkbox',
        options: [{ label: 'Rain or shine', value: 'rain-or-shine' }, { label: 'Rain date scheduled', value: 'rain-date-scheduled' }, { label: 'Indoor backup location', value: 'indoor-backup-location' }, { label: 'Refunds for weather cancellation', value: 'refunds-for-weather-cancellation' }],
      }
    ],
    'catering-food-beverage-services': [
      {
        key: 'minimum-order',
        label: 'Minimum Order',
        type: 'checkbox',
        options: [{ label: 'No minimum', value: 'no-minimum' }, { label: 'Under $100', value: 'under-100' }, { label: '$100-250', value: '100-250' }, { label: '$250-500', value: '250-500' }, { label: '$500-1,000', value: '500-1-000' }, { label: '$1,000+', value: '1-000' }],
      },
      {
        key: 'per-person-pricing',
        label: 'Per Person Pricing',
        type: 'checkbox',
        options: [{ label: 'Under $10', value: 'under-10' }, { label: '$10-20', value: '10-20' }, { label: '$20-35', value: '20-35' }, { label: '$35-50', value: '35-50' }, { label: '$50-75', value: '50-75' }, { label: '$75-100', value: '75-100' }, { label: '$100+', value: '100' }],
      },
      {
        key: 'service-area',
        label: 'Service Area',
        type: 'checkbox',
        options: [{ label: 'Local (under 10 miles)', value: 'local-under-10-miles' }, { label: 'Regional (10-30 miles)', value: 'regional-10-30-miles' }, { label: 'Wide (30-50 miles)', value: 'wide-30-50-miles' }, { label: 'Travel available (call for quote)', value: 'travel-available-call-for-quote' }],
      },
      {
        key: 'delivery-fee',
        label: 'Delivery Fee',
        type: 'checkbox',
        options: [{ label: 'Free delivery', value: 'free-delivery' }, { label: 'Flat fee ($___)', value: 'flat-fee' }, { label: 'Percentage based (%)', value: 'percentage-based' }, { label: 'Distance based', value: 'distance-based' }, { label: 'No delivery (pickup only)', value: 'no-delivery-pickup-only' }],
      },
      {
        key: 'setup-included',
        label: 'Setup Included',
        type: 'checkbox',
        options: [{ label: 'Yes (included)', value: 'yes-included' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'cleanup-included',
        label: 'Cleanup Included',
        type: 'checkbox',
        options: [{ label: 'Yes (included)', value: 'yes-included' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'staff-included',
        label: 'Staff Included',
        type: 'checkbox',
        options: [{ label: 'Servers', value: 'servers' }, { label: 'Bartenders', value: 'bartenders' }, { label: 'Chef on-site', value: 'chef-on-site' }, { label: 'Carvers / station attendants', value: 'carvers-station-attendants' }, { label: 'None (drop-off only)', value: 'none-drop-off-only' }],
      },
      {
        key: 'gratuity',
        label: 'Gratuity',
        type: 'checkbox',
        options: [{ label: 'Included (percentage: ___)', value: 'included-percentage' }, { label: 'Not included (suggested: ___)', value: 'not-included-suggested' }, { label: 'Optional', value: 'optional' }],
      },
      {
        key: 'tasting-available',
        label: 'Tasting Available',
        type: 'checkbox',
        options: [{ label: 'Free (in person)', value: 'free-in-person' }, { label: 'Paid (credited to order)', value: 'paid-credited-to-order' }, { label: 'Virtual tasting', value: 'virtual-tasting' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'deposit-required',
        label: 'Deposit Required',
        type: 'checkbox',
        options: [{ label: 'No deposit', value: 'no-deposit' }, { label: '25% deposit', value: '25-deposit' }, { label: '50% deposit', value: '50-deposit' }, { label: 'Full payment upfront', value: 'full-payment-upfront' }],
      },
      {
        key: 'final-headcount-deadline',
        label: 'Final Headcount Deadline',
        type: 'checkbox',
        options: [{ label: '3 days before', value: '3-days-before' }, { label: '5 days before', value: '5-days-before' }, { label: '7 days before', value: '7-days-before' }, { label: '14 days before', value: '14-days-before' }],
      },
      {
        key: 'dietary-accommodations',
        label: 'Dietary Accommodations',
        type: 'checkbox',
        options: [{ label: 'Vegetarian options', value: 'vegetarian-options' }, { label: 'Vegan options', value: 'vegan-options' }, { label: 'Gluten-free options', value: 'gluten-free-options' }, { label: 'Dairy-free options', value: 'dairy-free-options' }, { label: 'Nut-free options', value: 'nut-free-options' }, { label: 'Kosher options', value: 'kosher-options' }, { label: 'Halal options', value: 'halal-options' }, { label: 'Allergen-specific menus', value: 'allergen-specific-menus' }],
      },
      {
        key: 'cuisine-types',
        label: 'Cuisine Types',
        type: 'checkbox',
        options: [{ label: 'American', value: 'american' }, { label: 'Italian', value: 'italian' }, { label: 'Mexican / Latin', value: 'mexican-latin' }, { label: 'Chinese', value: 'chinese' }, { label: 'Japanese', value: 'japanese' }, { label: 'Thai', value: 'thai' }, { label: 'Indian', value: 'indian' }, { label: 'Mediterranean', value: 'mediterranean' }, { label: 'Middle Eastern', value: 'middle-eastern' }, { label: 'French', value: 'french' }, { label: 'BBQ / Southern', value: 'bbq-southern' }, { label: 'Seafood', value: 'seafood' }, { label: 'Soul food', value: 'soul-food' }, { label: 'Fusion', value: 'fusion' }, { label: 'Healthy / bowls / salads', value: 'healthy-bowls-salads' }],
      }
    ],
    'entertainment-musicians-performers': [
      {
        key: 'performance-duration',
        label: 'Performance Duration',
        type: 'checkbox',
        options: [{ label: '30 minutes', value: '30-minutes' }, { label: '45 minutes', value: '45-minutes' }, { label: '1 hour', value: '1-hour' }, { label: '1.5 hours', value: '1-5-hours' }, { label: '2 hours', value: '2-hours' }, { label: '2+ hours', value: '2-hours' }, { label: 'Full day / multi-hour', value: 'full-day-multi-hour' }],
      },
      {
        key: 'booking-type',
        label: 'Booking Type',
        type: 'checkbox',
        options: [{ label: 'Private event (birthday, wedding)', value: 'private-event-birthday-wedding' }, { label: 'Corporate event', value: 'corporate-event' }, { label: 'Public performance', value: 'public-performance' }, { label: 'Virtual event', value: 'virtual-event' }, { label: 'Festival / fair', value: 'festival-fair' }, { label: 'Club / venue booking', value: 'club-venue-booking' }],
      },
      {
        key: 'travel-radius',
        label: 'Travel Radius',
        type: 'checkbox',
        options: [{ label: 'Local only (under 30 miles)', value: 'local-only-under-30-miles' }, { label: 'Regional (30-100 miles)', value: 'regional-30-100-miles' }, { label: 'National (travel required)', value: 'national-travel-required' }, { label: 'International', value: 'international' }],
      },
      {
        key: 'travel-expenses',
        label: 'Travel Expenses',
        type: 'checkbox',
        options: [{ label: 'Included in rate', value: 'included-in-rate' }, { label: 'Extra (actual cost)', value: 'extra-actual-cost' }, { label: 'Flat travel fee: $___', value: 'flat-travel-fee' }, { label: 'Client provides accommodations', value: 'client-provides-accommodations' }],
      },
      {
        key: 'setup-time-needed',
        label: 'Setup Time Needed',
        type: 'checkbox',
        options: [{ label: '15 minutes', value: '15-minutes' }, { label: '30 minutes', value: '30-minutes' }, { label: '1 hour', value: '1-hour' }, { label: '1-2 hours', value: '1-2-hours' }, { label: '2+ hours', value: '2-hours' }],
      },
      {
        key: 'sound-equipment-provided',
        label: 'Sound Equipment Provided',
        type: 'checkbox',
        options: [{ label: 'Full PA system', value: 'full-pa-system' }, { label: 'Basic speakers', value: 'basic-speakers' }, { label: 'No equipment (venue must provide)', value: 'no-equipment-venue-must-provide' }, { label: 'Can use house system', value: 'can-use-house-system' }],
      },
      {
        key: 'backline-provided',
        label: 'Backline Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (specify)', value: 'yes-specify' }, { label: 'No (venue must provide)', value: 'no-venue-must-provide' }],
      },
      {
        key: 'staging-requirements',
        label: 'Staging Requirements',
        type: 'checkbox',
        options: [{ label: 'Small stage (6x6 ft)', value: 'small-stage-6x6-ft' }, { label: 'Medium stage (10x10 ft)', value: 'medium-stage-10x10-ft' }, { label: 'Large stage (20x20 ft)', value: 'large-stage-20x20-ft' }, { label: 'Floor level only (no stage)', value: 'floor-level-only-no-stage' }],
      },
      {
        key: 'performance-rights-licensing',
        label: 'Performance Rights / Licensing',
        type: 'checkbox',
        options: [{ label: 'Performer handles licensing (ASCAP/BMI)', value: 'performer-handles-licensing-ascap-bmi' }, { label: 'Venue handles licensing', value: 'venue-handles-licensing' }, { label: 'Original music only (no covers)', value: 'original-music-only-no-covers' }],
      },
      {
        key: 'contract-requirements',
        label: 'Contract Requirements',
        type: 'checkbox',
        options: [{ label: 'Standard performer contract', value: 'standard-performer-contract' }, { label: 'Venue contract accepted', value: 'venue-contract-accepted' }, { label: 'Handshake / informal ok', value: 'handshake-informal-ok' }],
      },
      {
        key: 'deposit-required',
        label: 'Deposit Required',
        type: 'checkbox',
        options: [{ label: 'No deposit', value: 'no-deposit' }, { label: '25%', value: '25' }, { label: '50%', value: '50' }, { label: 'Full payment upfront', value: 'full-payment-upfront' }],
      },
      {
        key: 'rider-requirements',
        label: 'Rider Requirements',
        type: 'checkbox',
        options: [{ label: 'Food & drink rider', value: 'food-drink-rider' }, { label: 'Hospitality rider', value: 'hospitality-rider' }, { label: 'Technical rider', value: 'technical-rider' }, { label: 'No rider needed', value: 'no-rider-needed' }],
      }
    ],
    'attractions-amusement-family-activities': [
      {
        key: 'admission-type',
        label: 'Admission Type',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: 'Pay per ride / activity', value: 'pay-per-ride-activity' }, { label: 'Single admission (all-inclusive)', value: 'single-admission-all-inclusive' }, { label: 'Day pass', value: 'day-pass' }, { label: 'Season pass / membership', value: 'season-pass-membership' }, { label: 'Group rates available', value: 'group-rates-available' }],
      },
      {
        key: 'age-appropriateness',
        label: 'Age Appropriateness',
        type: 'checkbox',
        options: [{ label: 'Toddlers (1-3)', value: 'toddlers-1-3' }, { label: 'Preschool (4-5)', value: 'preschool-4-5' }, { label: 'Kids (6-12)', value: 'kids-6-12' }, { label: 'Teens (13-17)', value: 'teens-13-17' }, { label: 'Adults (18+)', value: 'adults-18' }, { label: 'All ages', value: 'all-ages' }],
      },
      {
        key: 'height-requirements',
        label: 'Height Requirements',
        type: 'checkbox',
        options: [{ label: 'None', value: 'none' }, { label: 'Under 36" (limited rides)', value: 'under-36-limited-rides' }, { label: 'Under 48" (some restrictions)', value: 'under-48-some-restrictions' }, { label: 'Under 54" (some rides)', value: 'under-54-some-rides' }, { label: 'Must be 48"+ for most attractions', value: 'must-be-48-for-most-attractions' }],
      },
      {
        key: 'supervision-required',
        label: 'Supervision Required',
        type: 'checkbox',
        options: [{ label: 'Parent/guardian must accompany under ___ age', value: 'parent-guardian-must-accompany-under-age' }, { label: 'Drop-off allowed (signed waiver)', value: 'drop-off-allowed-signed-waiver' }, { label: 'Staff supervised (day camp style)', value: 'staff-supervised-day-camp-style' }],
      },
      {
        key: 'wait-times',
        label: 'Wait Times',
        type: 'checkbox',
        options: [{ label: 'No wait (walk-on)', value: 'no-wait-walk-on' }, { label: 'Under 15 minutes', value: 'under-15-minutes' }, { label: '15-30 minutes', value: '15-30-minutes' }, { label: '30-60 minutes', value: '30-60-minutes' }, { label: '60+ minutes (plan ahead)', value: '60-minutes-plan-ahead' }],
      },
      {
        key: 'peak-vs-off-peak-pricing',
        label: 'Peak vs Off-Peak Pricing',
        type: 'checkbox',
        options: [{ label: 'Yes (weekends/holidays higher)', value: 'yes-weekends-holidays-higher' }, { label: 'No (same price always)', value: 'no-same-price-always' }],
      },
      {
        key: 'seasonal-operation',
        label: 'Seasonal Operation',
        type: 'checkbox',
        options: [{ label: 'Year-round', value: 'year-round' }, { label: 'Summer only', value: 'summer-only' }, { label: 'Winter only', value: 'winter-only' }, { label: 'Holiday season only', value: 'holiday-season-only' }, { label: 'Weekends only (off-season)', value: 'weekends-only-off-season' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: 'Paid ($___) on-site', value: 'paid-on-site' }, { label: 'Street parking only', value: 'street-parking-only' }, { label: 'Shuttle from remote lot', value: 'shuttle-from-remote-lot' }],
      },
      {
        key: 'lockers-available',
        label: 'Lockers Available',
        type: 'checkbox',
        options: [{ label: 'Yes (free)', value: 'yes-free' }, { label: 'Yes (rental)', value: 'yes-rental' }, { label: 'No (carry with you)', value: 'no-carry-with-you' }],
      },
      {
        key: 'stroller-wheelchair-rental',
        label: 'Stroller / Wheelchair Rental',
        type: 'checkbox',
        options: [{ label: 'Yes (free)', value: 'yes-free' }, { label: 'Yes (rental fee)', value: 'yes-rental-fee' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'food-allowed-inside',
        label: 'Food Allowed Inside',
        type: 'checkbox',
        options: [{ label: 'Yes (picnic areas)', value: 'yes-picnic-areas' }, { label: 'No outside food (concessions only)', value: 'no-outside-food-concessions-only' }, { label: 'Medical exceptions allowed', value: 'medical-exceptions-allowed' }],
      },
      {
        key: 're-entry-allowed',
        label: 'Re-entry Allowed',
        type: 'checkbox',
        options: [{ label: 'Yes (hand stamp)', value: 'yes-hand-stamp' }, { label: 'Yes (ticket scanned)', value: 'yes-ticket-scanned' }, { label: 'No', value: 'no' }],
      }
    ],
    'outdoor-nature-adventure-recreation': [
      {
        key: 'activity-level',
        label: 'Activity Level',
        type: 'checkbox',
        options: [{ label: 'Easy (paved paths, little elevation)', value: 'easy-paved-paths-little-elevation' }, { label: 'Moderate (uneven terrain, some hills)', value: 'moderate-uneven-terrain-some-hills' }, { label: 'Challenging (steep, long distance)', value: 'challenging-steep-long-distance' }, { label: 'Strenuous (all day, gear required)', value: 'strenuous-all-day-gear-required' }, { label: 'Expert (technical skills needed)', value: 'expert-technical-skills-needed' }],
      },
      {
        key: 'time-needed',
        label: 'Time Needed',
        type: 'checkbox',
        options: [{ label: 'Under 1 hour', value: 'under-1-hour' }, { label: '1-2 hours', value: '1-2-hours' }, { label: '2-4 hours', value: '2-4-hours' }, { label: 'Half day (4-6 hours)', value: 'half-day-4-6-hours' }, { label: 'Full day (6-10 hours)', value: 'full-day-6-10-hours' }, { label: 'Overnight / multi-day', value: 'overnight-multi-day' }],
      },
      {
        key: 'best-season',
        label: 'Best Season',
        type: 'checkbox',
        options: [{ label: 'Spring', value: 'spring' }, { label: 'Summer', value: 'summer' }, { label: 'Fall', value: 'fall' }, { label: 'Winter', value: 'winter' }, { label: 'Year-round', value: 'year-round' }],
      },
      {
        key: 'crowd-level',
        label: 'Crowd Level',
        type: 'checkbox',
        options: [{ label: 'Secluded (few people)', value: 'secluded-few-people' }, { label: 'Moderate (some crowds on weekends)', value: 'moderate-some-crowds-on-weekends' }, { label: 'Popular (often busy)', value: 'popular-often-busy' }, { label: 'Tourist hotspot (always crowded)', value: 'tourist-hotspot-always-crowded' }],
      },
      {
        key: 'entrance-fee',
        label: 'Entrance Fee',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: '$5-10', value: '5-10' }, { label: '$10-20', value: '10-20' }, { label: '$20+ per vehicle', value: '20-per-vehicle' }, { label: 'Annual pass available', value: 'annual-pass-available' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Free lot', value: 'free-lot' }, { label: 'Paid lot ($__)', value: 'paid-lot' }, { label: 'Street parking', value: 'street-parking' }, { label: 'Shuttle required (remote lot)', value: 'shuttle-required-remote-lot' }],
      },
      {
        key: 'restrooms',
        label: 'Restrooms',
        type: 'checkbox',
        options: [{ label: 'Flush toilets', value: 'flush-toilets' }, { label: 'Vault / pit toilets', value: 'vault-pit-toilets' }, { label: 'Portable toilets (seasonal)', value: 'portable-toilets-seasonal' }, { label: 'None (backcountry)', value: 'none-backcountry' }],
      },
      {
        key: 'water-availability',
        label: 'Water Availability',
        type: 'checkbox',
        options: [{ label: 'Drinking fountains', value: 'drinking-fountains' }, { label: 'Bottled water for sale', value: 'bottled-water-for-sale' }, { label: 'Natural sources (treat before drinking)', value: 'natural-sources-treat-before-drinking' }, { label: 'Bring your own (no water on site)', value: 'bring-your-own-no-water-on-site' }],
      },
      {
        key: 'cell-service',
        label: 'Cell Service',
        type: 'checkbox',
        options: [{ label: 'Full coverage', value: 'full-coverage' }, { label: 'Spotty', value: 'spotty' }, { label: 'None (dead zone)', value: 'none-dead-zone' }],
      },
      {
        key: 'pet-friendly',
        label: 'Pet Friendly',
        type: 'checkbox',
        options: [{ label: 'Yes (leashed)', value: 'yes-leashed' }, { label: 'Yes (off-leash allowed in areas)', value: 'yes-off-leash-allowed-in-areas' }, { label: 'Service animals only', value: 'service-animals-only' }, { label: 'No pets', value: 'no-pets' }],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        type: 'checkbox',
        options: [{ label: 'Wheelchair accessible (paved)', value: 'wheelchair-accessible-paved' }, { label: 'Stroller friendly', value: 'stroller-friendly' }, { label: 'ADA trail', value: 'ada-trail' }, { label: 'Not accessible', value: 'not-accessible' }],
      },
      {
        key: 'reservation-required',
        label: 'Reservation Required',
        type: 'checkbox',
        options: [{ label: 'Yes (permit system)', value: 'yes-permit-system' }, { label: 'Yes (parking reservation)', value: 'yes-parking-reservation' }, { label: 'First come, first served', value: 'first-come-first-served' }],
      },
      {
        key: 'guided-tours-available',
        label: 'Guided Tours Available',
        type: 'checkbox',
        options: [{ label: 'Yes (fee)', value: 'yes-fee' }, { label: 'Yes (free with admission)', value: 'yes-free-with-admission' }, { label: 'No (self-guided only)', value: 'no-self-guided-only' }],
      }
    ],
    'sports-active-recreation': [
      {
        key: 'skill-level',
        label: 'Skill Level',
        type: 'checkbox',
        options: [{ label: 'Beginner', value: 'beginner' }, { label: 'Intermediate', value: 'intermediate' }, { label: 'Advanced', value: 'advanced' }, { label: 'Professional', value: 'professional' }, { label: 'All levels welcome', value: 'all-levels-welcome' }],
      },
      {
        key: 'equipment-provided',
        label: 'Equipment Provided',
        type: 'checkbox',
        options: [{ label: 'Full gear included', value: 'full-gear-included' }, { label: 'Partial gear (bring some)', value: 'partial-gear-bring-some' }, { label: 'Bring your own (no rentals)', value: 'bring-your-own-no-rentals' }],
      },
      {
        key: 'instruction-included',
        label: 'Instruction Included',
        type: 'checkbox',
        options: [{ label: 'Yes (group lesson)', value: 'yes-group-lesson' }, { label: 'Yes (private lesson extra)', value: 'yes-private-lesson-extra' }, { label: 'No instruction (rental only)', value: 'no-instruction-rental-only' }],
      },
      {
        key: 'league-play-available',
        label: 'League Play Available',
        type: 'checkbox',
        options: [{ label: 'Yes (competitive)', value: 'yes-competitive' }, { label: 'Yes (recreational)', value: 'yes-recreational' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'drop-in-available',
        label: 'Drop-In Available',
        type: 'checkbox',
        options: [{ label: 'Yes (pay per session)', value: 'yes-pay-per-session' }, { label: 'Yes (membership required)', value: 'yes-membership-required' }, { label: 'No (reservation only)', value: 'no-reservation-only' }],
      },
      {
        key: 'age-division',
        label: 'Age Division',
        type: 'checkbox',
        options: [{ label: 'Youth (under 18)', value: 'youth-under-18' }, { label: 'Adult (18+)', value: 'adult-18' }, { label: 'Senior (55+)', value: 'senior-55' }, { label: 'All ages mixed', value: 'all-ages-mixed' }],
      },
      {
        key: 'gender-division',
        label: 'Gender Division',
        type: 'checkbox',
        options: [{ label: 'Co-ed', value: 'co-ed' }, { label: 'Men\'s league', value: 'men-s-league' }, { label: 'Women\'s league', value: 'women-s-league' }, { label: 'Open (any gender)', value: 'open-any-gender' }],
      },
      {
        key: 'seasonal-availability',
        label: 'Seasonal Availability',
        type: 'checkbox',
        options: [{ label: 'Year-round (indoor)', value: 'year-round-indoor' }, { label: 'Outdoor (warm months only)', value: 'outdoor-warm-months-only' }, { label: 'Winter only (ice sports)', value: 'winter-only-ice-sports' }],
      }
    ],
    'transport-logistics-tours': [
      {
        key: 'duration',
        label: 'Duration',
        type: 'checkbox',
        options: [{ label: 'Under 1 hour', value: 'under-1-hour' }, { label: '1-2 hours', value: '1-2-hours' }, { label: '2-4 hours', value: '2-4-hours' }, { label: 'Half day (4-6 hours)', value: 'half-day-4-6-hours' }, { label: 'Full day (6-10 hours)', value: 'full-day-6-10-hours' }, { label: 'Multiple days', value: 'multiple-days' }],
      },
      {
        key: 'group-size',
        label: 'Group Size',
        type: 'checkbox',
        options: [{ label: 'Solo / private (1)', value: 'solo-private-1' }, { label: 'Small (2-4)', value: 'small-2-4' }, { label: 'Medium (5-10)', value: 'medium-5-10' }, { label: 'Large (11-20)', value: 'large-11-20' }, { label: 'Extra large (21-50)', value: 'extra-large-21-50' }, { label: 'Charter (50+)', value: 'charter-50' }],
      },
      {
        key: 'private-vs-shared',
        label: 'Private vs Shared',
        type: 'checkbox',
        options: [{ label: 'Private (your group only)', value: 'private-your-group-only' }, { label: 'Shared (with others)', value: 'shared-with-others' }, { label: 'Both options', value: 'both-options' }],
      },
      {
        key: 'guide-included',
        label: 'Guide Included',
        type: 'checkbox',
        options: [{ label: 'Yes (live guide)', value: 'yes-live-guide' }, { label: 'Yes (audio guide)', value: 'yes-audio-guide' }, { label: 'No (self-guided)', value: 'no-self-guided' }],
      },
      {
        key: 'language-options',
        label: 'Language Options',
        type: 'checkbox',
        options: [{ label: 'English', value: 'english' }, { label: 'Spanish', value: 'spanish' }, { label: 'French', value: 'french' }, { label: 'German', value: 'german' }, { label: 'Mandarin', value: 'mandarin' }, { label: 'Japanese', value: 'japanese' }, { label: 'Other (list)', value: 'other-list' }],
      },
      {
        key: 'pickup-drop-off',
        label: 'Pickup / Drop-Off',
        type: 'checkbox',
        options: [{ label: 'Hotel pickup included', value: 'hotel-pickup-included' }, { label: 'Central meeting point', value: 'central-meeting-point' }, { label: 'Airport transfer available', value: 'airport-transfer-available' }, { label: 'Cruise port pickup', value: 'cruise-port-pickup' }],
      },
      {
        key: 'cancellation-policy',
        label: 'Cancellation Policy',
        type: 'checkbox',
        options: [{ label: 'Free up to 24 hours', value: 'free-up-to-24-hours' }, { label: 'Free up to 48 hours', value: 'free-up-to-48-hours' }, { label: 'Free up to 7 days', value: 'free-up-to-7-days' }, { label: 'Non-refundable', value: 'non-refundable' }],
      },
      {
        key: 'instant-confirmation',
        label: 'Instant Confirmation',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (manual approval)', value: 'no-manual-approval' }],
      },
      {
        key: 'mobile-ticket-accepted',
        label: 'Mobile Ticket Accepted',
        type: 'checkbox',
        options: [{ label: 'Yes (digital)', value: 'yes-digital' }, { label: 'Print required', value: 'print-required' }],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        type: 'checkbox',
        options: [{ label: 'Wheelchair accessible vehicle', value: 'wheelchair-accessible-vehicle' }, { label: 'Wheelchair accessible tour', value: 'wheelchair-accessible-tour' }, { label: 'Not accessible', value: 'not-accessible' }],
      },
      {
        key: 'child-seat-available',
        label: 'Child Seat Available',
        type: 'checkbox',
        options: [{ label: 'Yes (upon request)', value: 'yes-upon-request' }, { label: 'No (must bring own)', value: 'no-must-bring-own' }, { label: 'Not applicable', value: 'not-applicable' }],
      },
      {
        key: 'pet-friendly',
        label: 'Pet Friendly',
        type: 'checkbox',
        options: [{ label: 'Yes (service animals only)', value: 'yes-service-animals-only' }, { label: 'Yes (small pets in carrier)', value: 'yes-small-pets-in-carrier' }, { label: 'No', value: 'no' }],
      }
    ],
    'equipment-event-rentals': [
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: 'Hourly', value: 'hourly' }, { label: 'Half day (4 hours)', value: 'half-day-4-hours' }, { label: 'Full day (8 hours)', value: 'full-day-8-hours' }, { label: 'Overnight', value: 'overnight' }, { label: '2-3 days', value: '2-3-days' }, { label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }],
      },
      {
        key: 'delivery-available',
        label: 'Delivery Available',
        type: 'checkbox',
        options: [{ label: 'Yes (fee based on distance)', value: 'yes-fee-based-on-distance' }, { label: 'Pickup only', value: 'pickup-only' }, { label: 'Both', value: 'both' }],
      },
      {
        key: 'delivery-area',
        label: 'Delivery Area',
        type: 'checkbox',
        options: [{ label: 'Local (under 10 miles)', value: 'local-under-10-miles' }, { label: 'Regional (10-30 miles)', value: 'regional-10-30-miles' }, { label: 'Wide (30-60 miles)', value: 'wide-30-60-miles' }, { label: 'Nationwide (shipping)', value: 'nationwide-shipping' }],
      },
      {
        key: 'setup-included',
        label: 'Setup Included',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No (self-setup)', value: 'no-self-setup' }],
      },
      {
        key: 'pickup-return',
        label: 'Pickup / Return',
        type: 'checkbox',
        options: [{ label: 'Client returns to store', value: 'client-returns-to-store' }, { label: 'Staff picks up (fee)', value: 'staff-picks-up-fee' }, { label: 'Drop box available', value: 'drop-box-available' }],
      },
      {
        key: 'damage-waiver',
        label: 'Damage Waiver',
        type: 'checkbox',
        options: [{ label: 'Included in rental price', value: 'included-in-rental-price' }, { label: 'Optional (extra per day)', value: 'optional-extra-per-day' }, { label: 'Not offered (client liable)', value: 'not-offered-client-liable' }],
      },
      {
        key: 'security-deposit',
        label: 'Security Deposit',
        type: 'checkbox',
        options: [{ label: '$___ (refundable)', value: 'refundable' }, { label: 'Credit card hold', value: 'credit-card-hold' }, { label: 'No deposit', value: 'no-deposit' }],
      },
      {
        key: 'late-fee',
        label: 'Late Fee',
        type: 'checkbox',
        options: [{ label: '$___ per hour', value: 'per-hour' }, { label: '$___ per day', value: 'per-day' }, { label: 'Double rate after 24 hours', value: 'double-rate-after-24-hours' }],
      },
      {
        key: 'cleaning-fee',
        label: 'Cleaning Fee',
        type: 'checkbox',
        options: [{ label: 'Included (client cleans)', value: 'included-client-cleans' }, { label: 'Extra if not returned clean', value: 'extra-if-not-returned-clean' }, { label: 'Flat cleaning fee ($___)', value: 'flat-cleaning-fee' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: 'Free up to 48 hours', value: 'free-up-to-48-hours' }, { label: '50% within 48 hours', value: '50-within-48-hours' }, { label: 'No refund within 24 hours', value: 'no-refund-within-24-hours' }],
      },
      {
        key: 'reservation-lead-time',
        label: 'Reservation Lead Time',
        type: 'checkbox',
        options: [{ label: 'Same day (call for availability)', value: 'same-day-call-for-availability' }, { label: '1-3 days', value: '1-3-days' }, { label: '1 week', value: '1-week' }, { label: '2+ weeks (peak season)', value: '2-weeks-peak-season' }],
      },
      {
        key: 'minimum-rental-period',
        label: 'Minimum Rental Period',
        type: 'checkbox',
        options: [{ label: '1 hour', value: '1-hour' }, { label: '4 hours', value: '4-hours' }, { label: '1 day', value: '1-day' }, { label: '2 days', value: '2-days' }],
      }
    ],
    'accommodations-lodging': [
      {
        key: 'price-per-night',
        label: 'Price Per Night',
        type: 'checkbox',
        options: [{ label: 'Under $50', value: 'under-50' }, { label: '$50-100', value: '50-100' }, { label: '$100-150', value: '100-150' }, { label: '$150-250', value: '150-250' }, { label: '$250-400', value: '250-400' }, { label: '$400-600', value: '400-600' }, { label: '$600+', value: '600' }],
      },
      {
        key: 'bedrooms',
        label: 'Bedrooms',
        type: 'checkbox',
        options: [{ label: 'Studio (0 bedrooms)', value: 'studio-0-bedrooms' }, { label: '1 bedroom', value: '1-bedroom' }, { label: '2 bedrooms', value: '2-bedrooms' }, { label: '3 bedrooms', value: '3-bedrooms' }, { label: '4+ bedrooms', value: '4-bedrooms' }],
      },
      {
        key: 'bathrooms',
        label: 'Bathrooms',
        type: 'checkbox',
        options: [{ label: '0 (shared)', value: '0-shared' }, { label: '1', value: '1' }, { label: '1.5', value: '1-5' }, { label: '2', value: '2' }, { label: '2.5', value: '2-5' }, { label: '3+', value: '3' }],
      },
      {
        key: 'sleeps-capacity',
        label: 'Sleeps Capacity',
        type: 'checkbox',
        options: [{ label: '1-2', value: '1-2' }, { label: '3-4', value: '3-4' }, { label: '5-6', value: '5-6' }, { label: '7-8', value: '7-8' }, { label: '9-10', value: '9-10' }, { label: '10-12', value: '10-12' }, { label: '12-16', value: '12-16' }, { label: '16+', value: '16' }],
      },
      {
        key: 'property-type',
        label: 'Property Type',
        type: 'checkbox',
        options: [{ label: 'Entire place (private)', value: 'entire-place-private' }, { label: 'Private room (shared common areas)', value: 'private-room-shared-common-areas' }, { label: 'Shared room (hostel style)', value: 'shared-room-hostel-style' }, { label: 'Hotel room', value: 'hotel-room' }, { label: 'Resort (on-site amenities)', value: 'resort-on-site-amenities' }],
      },
      {
        key: 'check-in-time',
        label: 'Check-in Time',
        type: 'checkbox',
        options: [{ label: 'Flexible', value: 'flexible' }, { label: '12pm-2pm', value: '12pm-2pm' }, { label: '2pm-4pm', value: '2pm-4pm' }, { label: '4pm-6pm', value: '4pm-6pm' }, { label: '6pm+ (late check-in available)', value: '6pm-late-check-in-available' }],
      },
      {
        key: 'check-out-time',
        label: 'Check-out Time',
        type: 'checkbox',
        options: [{ label: 'Before 10am', value: 'before-10am' }, { label: '10am-11am', value: '10am-11am' }, { label: '11am-12pm', value: '11am-12pm' }, { label: '12pm+', value: '12pm' }, { label: 'Late check-out available (fee)', value: 'late-check-out-available-fee' }],
      },
      {
        key: 'minimum-stay',
        label: 'Minimum Stay',
        type: 'checkbox',
        options: [{ label: '1 night', value: '1-night' }, { label: '2 nights', value: '2-nights' }, { label: '3 nights', value: '3-nights' }, { label: '5 nights', value: '5-nights' }, { label: '7 nights', value: '7-nights' }, { label: '30+ nights (long-term)', value: '30-nights-long-term' }],
      },
      {
        key: 'cancellation-policy',
        label: 'Cancellation Policy',
        type: 'checkbox',
        options: [{ label: 'Free (up to 48 hours)', value: 'free-up-to-48-hours' }, { label: 'Free (up to 7 days)', value: 'free-up-to-7-days' }, { label: '50% refund (up to 14 days)', value: '50-refund-up-to-14-days' }, { label: 'Non-refundable (book at own risk)', value: 'non-refundable-book-at-own-risk' }, { label: 'Flexible (full refund up to 24 hours)', value: 'flexible-full-refund-up-to-24-hours' }],
      },
      {
        key: 'deposit-required',
        label: 'Deposit Required',
        type: 'checkbox',
        options: [{ label: 'No deposit', value: 'no-deposit' }, { label: '1 night deposit', value: '1-night-deposit' }, { label: '50% deposit', value: '50-deposit' }, { label: '100% upfront', value: '100-upfront' }],
      },
      {
        key: 'cleaning-fee',
        label: 'Cleaning Fee',
        type: 'checkbox',
        options: [{ label: 'None', value: 'none' }, { label: '$25-50', value: '25-50' }, { label: '$50-100', value: '50-100' }, { label: '$100-150', value: '100-150' }, { label: '$150+', value: '150' }],
      },
      {
        key: 'pet-policy',
        label: 'Pet Policy',
        type: 'checkbox',
        options: [{ label: 'Pets allowed (fee)', value: 'pets-allowed-fee' }, { label: 'Pets allowed (no fee)', value: 'pets-allowed-no-fee' }, { label: 'Service animals only', value: 'service-animals-only' }, { label: 'No pets', value: 'no-pets' }],
      },
      {
        key: 'smoking-policy',
        label: 'Smoking Policy',
        type: 'checkbox',
        options: [{ label: 'No smoking (anywhere)', value: 'no-smoking-anywhere' }, { label: 'Smoking allowed outdoors', value: 'smoking-allowed-outdoors' }, { label: 'Smoking allowed (designated rooms)', value: 'smoking-allowed-designated-rooms' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Free on-site', value: 'free-on-site' }, { label: 'Free street parking', value: 'free-street-parking' }, { label: 'Paid on-site ($___/night)', value: 'paid-on-site-night' }, { label: 'Paid parking nearby', value: 'paid-parking-nearby' }, { label: 'No parking available', value: 'no-parking-available' }],
      },
      {
        key: 'wifi',
        label: 'WiFi',
        type: 'checkbox',
        options: [{ label: 'Free (good speed)', value: 'free-good-speed' }, { label: 'Free (basic)', value: 'free-basic' }, { label: 'Paid WiFi', value: 'paid-wifi' }, { label: 'No WiFi', value: 'no-wifi' }],
      },
      {
        key: 'kitchen',
        label: 'Kitchen',
        type: 'checkbox',
        options: [{ label: 'Full kitchen', value: 'full-kitchen' }, { label: 'Kitchenette (mini fridge, microwave)', value: 'kitchenette-mini-fridge-microwave' }, { label: 'No kitchen (coffee maker only)', value: 'no-kitchen-coffee-maker-only' }],
      },
      {
        key: 'laundry',
        label: 'Laundry',
        type: 'checkbox',
        options: [{ label: 'In-unit washer/dryer', value: 'in-unit-washer-dryer' }, { label: 'Shared laundry (coin or card)', value: 'shared-laundry-coin-or-card' }, { label: 'No laundry on-site', value: 'no-laundry-on-site' }],
      },
      {
        key: 'air-conditioning',
        label: 'Air Conditioning',
        type: 'checkbox',
        options: [{ label: 'Yes (central)', value: 'yes-central' }, { label: 'Yes (window unit)', value: 'yes-window-unit' }, { label: 'No (fans provided)', value: 'no-fans-provided' }],
      },
      {
        key: 'heating',
        label: 'Heating',
        type: 'checkbox',
        options: [{ label: 'Yes (central)', value: 'yes-central' }, { label: 'Yes (space heater)', value: 'yes-space-heater' }, { label: 'No (rare)', value: 'no-rare' }],
      },
      {
        key: 'tv',
        label: 'TV',
        type: 'checkbox',
        options: [{ label: 'Smart TV (streaming apps)', value: 'smart-tv-streaming-apps' }, { label: 'Cable TV', value: 'cable-tv' }, { label: 'No TV', value: 'no-tv' }],
      },
      {
        key: 'pool',
        label: 'Pool',
        type: 'checkbox',
        options: [{ label: 'Private pool', value: 'private-pool' }, { label: 'Shared pool (community)', value: 'shared-pool-community' }, { label: 'No pool', value: 'no-pool' }],
      },
      {
        key: 'hot-tub-jacuzzi',
        label: 'Hot Tub / Jacuzzi',
        type: 'checkbox',
        options: [{ label: 'Private', value: 'private' }, { label: 'Shared', value: 'shared' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'fireplace',
        label: 'Fireplace',
        type: 'checkbox',
        options: [{ label: 'Yes (wood burning)', value: 'yes-wood-burning' }, { label: 'Yes (gas)', value: 'yes-gas' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'bbq-grill',
        label: 'BBQ Grill',
        type: 'checkbox',
        options: [{ label: 'Yes (private)', value: 'yes-private' }, { label: 'Yes (shared)', value: 'yes-shared' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'balcony-patio',
        label: 'Balcony / Patio',
        type: 'checkbox',
        options: [{ label: 'Yes (private)', value: 'yes-private' }, { label: 'Yes (shared)', value: 'yes-shared' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'view',
        label: 'View',
        type: 'checkbox',
        options: [{ label: 'Oceanfront / water view', value: 'oceanfront-water-view' }, { label: 'Mountain view', value: 'mountain-view' }, { label: 'City view', value: 'city-view' }, { label: 'Garden view', value: 'garden-view' }, { label: 'No view', value: 'no-view' }],
      },
      {
        key: 'elevator',
        label: 'Elevator',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (stairs only, note floor level)', value: 'no-stairs-only-note-floor-level' }],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        type: 'checkbox',
        options: [{ label: 'Ground floor (no stairs)', value: 'ground-floor-no-stairs' }, { label: 'Step-free entrance', value: 'step-free-entrance' }, { label: 'Wide doorways', value: 'wide-doorways' }, { label: 'Grab bars in shower', value: 'grab-bars-in-shower' }, { label: 'Roll-in shower', value: 'roll-in-shower' }, { label: 'Not accessible', value: 'not-accessible' }],
      },
      {
        key: 'family-friendly',
        label: 'Family Friendly',
        type: 'checkbox',
        options: [{ label: 'Yes (kids allowed)', value: 'yes-kids-allowed' }, { label: 'Yes (pack n play, high chair available)', value: 'yes-pack-n-play-high-chair-available' }, { label: 'No (adults only)', value: 'no-adults-only' }],
      },
      {
        key: 'infant-toddler-amenities',
        label: 'Infant / Toddler Amenities',
        type: 'checkbox',
        options: [{ label: 'Crib available', value: 'crib-available' }, { label: 'High chair', value: 'high-chair' }, { label: 'Baby gate', value: 'baby-gate' }, { label: 'Toys / books', value: 'toys-books' }],
      },
      {
        key: 'long-term-stay-28-nights',
        label: 'Long-Term Stay (28+ nights)',
        type: 'checkbox',
        options: [{ label: 'Monthly discount', value: 'monthly-discount' }, { label: 'Utilities included', value: 'utilities-included' }, { label: 'Cleaning service available', value: 'cleaning-service-available' }],
      },
      {
        key: 'quiet-hours',
        label: 'Quiet Hours',
        type: 'checkbox',
        options: [{ label: 'Enforced (10pm - 8am)', value: 'enforced-10pm-8am' }, { label: 'Recommended', value: 'recommended' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'security',
        label: 'Security',
        type: 'checkbox',
        options: [{ label: 'Security cameras (common areas)', value: 'security-cameras-common-areas' }, { label: 'Safe in room', value: 'safe-in-room' }, { label: '24-hour front desk', value: '24-hour-front-desk' }, { label: 'Lockbox / smart lock', value: 'lockbox-smart-lock' }],
      },
      {
        key: 'languages-spoken-by-host',
        label: 'Languages Spoken by Host',
        type: 'checkbox',
        options: [{ label: 'English', value: 'english' }, { label: 'Spanish', value: 'spanish' }, { label: 'French', value: 'french' }, { label: 'Other (list)', value: 'other-list' }],
      },
      {
        key: 'instant-book',
        label: 'Instant Book',
        type: 'checkbox',
        options: [{ label: 'Yes (no host approval)', value: 'yes-no-host-approval' }, { label: 'No (request to book)', value: 'no-request-to-book' }],
      },
      {
        key: 'superhost-highly-rated',
        label: 'Superhost / Highly Rated',
        type: 'checkbox',
        options: [{ label: '4.8+ stars', value: '4-8-stars' }, { label: '4.5+ stars', value: '4-5-stars' }, { label: 'No filter', value: 'no-filter' }],
      }
    ],
    'beauty-styling-wellness': [
      {
        key: 'service-type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'On-location (they come to you)', value: 'on-location-they-come-to-you' }, { label: 'Salon / studio (you go to them)', value: 'salon-studio-you-go-to-them' }, { label: 'Mobile (pop-up at event)', value: 'mobile-pop-up-at-event' }, { label: 'Virtual consultation', value: 'virtual-consultation' }],
      },
      {
        key: 'appointment-lead-time',
        label: 'Appointment Lead Time',
        type: 'checkbox',
        options: [{ label: 'Walk-ins welcome', value: 'walk-ins-welcome' }, { label: 'Same day (call ahead)', value: 'same-day-call-ahead' }, { label: '1-3 days', value: '1-3-days' }, { label: '1 week', value: '1-week' }, { label: '2+ weeks (bridal)', value: '2-weeks-bridal' }],
      },
      {
        key: 'booking-deposit',
        label: 'Booking Deposit',
        type: 'checkbox',
        options: [{ label: 'No deposit', value: 'no-deposit' }, { label: '10-20%', value: '10-20' }, { label: '50% (bridal)', value: '50-bridal' }, { label: 'Full prepayment', value: 'full-prepayment' }],
      },
      {
        key: 'cancellation-policy',
        label: 'Cancellation Policy',
        type: 'checkbox',
        options: [{ label: 'Free up to 24 hours', value: 'free-up-to-24-hours' }, { label: '50% within 24 hours', value: '50-within-24-hours' }, { label: 'No refund within 24 hours (full charge)', value: 'no-refund-within-24-hours-full-charge' }],
      },
      {
        key: 'gift-certificates-available',
        label: 'Gift Certificates Available',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'loyalty-program',
        label: 'Loyalty Program',
        type: 'checkbox',
        options: [{ label: 'Yes (points)', value: 'yes-points' }, { label: 'Punch card (free after ___)', value: 'punch-card-free-after' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'languages-spoken',
        label: 'Languages Spoken',
        type: 'checkbox',
        options: [{ label: 'English', value: 'english' }, { label: 'Spanish', value: 'spanish' }, { label: 'Other (list)', value: 'other-list' }],
      },
      {
        key: 'gender-services',
        label: 'Gender Services',
        type: 'checkbox',
        options: [{ label: 'Women only', value: 'women-only' }, { label: 'Men only', value: 'men-only' }, { label: 'All genders', value: 'all-genders' }],
      },
      {
        key: 'child-services',
        label: 'Child Services',
        type: 'checkbox',
        options: [{ label: 'Yes (kids cuts)', value: 'yes-kids-cuts' }, { label: 'Yes (teen)', value: 'yes-teen' }, { label: 'No (adults only)', value: 'no-adults-only' }],
      },
      {
        key: 'senior-discount',
        label: 'Senior Discount',
        type: 'checkbox',
        options: [{ label: 'Yes (65+)', value: 'yes-65' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'military-discount',
        label: 'Military Discount',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'first-responder-discount',
        label: 'First Responder Discount',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'late-night-hours-after-7pm',
        label: 'Late Night Hours (after 7pm)',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'sunday-hours',
        label: 'Sunday Hours',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        type: 'checkbox',
        options: [{ label: 'Wheelchair accessible', value: 'wheelchair-accessible' }, { label: 'Ground floor', value: 'ground-floor' }, { label: 'Stairs required', value: 'stairs-required' }, { label: 'Not accessible', value: 'not-accessible' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Free lot', value: 'free-lot' }, { label: 'Street parking', value: 'street-parking' }, { label: 'Paid garage', value: 'paid-garage' }, { label: 'No parking', value: 'no-parking' }],
      }
    ],
    'photography-video-scenic-locations': [
      {
        key: 'shoot-type',
        label: 'Shoot Type',
        type: 'checkbox',
        options: [{ label: 'Wedding', value: 'wedding' }, { label: 'Engagement', value: 'engagement' }, { label: 'Maternity', value: 'maternity' }, { label: 'Newborn', value: 'newborn' }, { label: 'Family', value: 'family' }, { label: 'Senior portraits', value: 'senior-portraits' }, { label: 'Headshots (corporate, acting)', value: 'headshots-corporate-acting' }, { label: 'Boudoir', value: 'boudoir' }, { label: 'Branding / commercial', value: 'branding-commercial' }, { label: 'Real estate', value: 'real-estate' }, { label: 'Event (party, concert)', value: 'event-party-concert' }, { label: 'Sports', value: 'sports' }, { label: 'Pet photography', value: 'pet-photography' }],
      },
      {
        key: 'photography-style',
        label: 'Photography Style',
        type: 'checkbox',
        options: [{ label: 'Traditional / posed', value: 'traditional-posed' }, { label: 'Candid / documentary', value: 'candid-documentary' }, { label: 'Fine art', value: 'fine-art' }, { label: 'Editorial', value: 'editorial' }, { label: 'Lifestyle', value: 'lifestyle' }, { label: 'Moody / dark', value: 'moody-dark' }, { label: 'Light & airy', value: 'light-airy' }, { label: 'Vintage / film look', value: 'vintage-film-look' }],
      },
      {
        key: 'hours-of-coverage',
        label: 'Hours of Coverage',
        type: 'checkbox',
        options: [{ label: '1 hour', value: '1-hour' }, { label: '2 hours', value: '2-hours' }, { label: '3 hours', value: '3-hours' }, { label: '4 hours (half day)', value: '4-hours-half-day' }, { label: '6 hours', value: '6-hours' }, { label: '8 hours (full day)', value: '8-hours-full-day' }, { label: '10+ hours', value: '10-hours' }],
      },
      {
        key: 'price-range-wedding',
        label: 'Price Range (Wedding)',
        type: 'checkbox',
        options: [{ label: '$1,000-2,000', value: '1-000-2-000' }, { label: '$2,000-3,000', value: '2-000-3-000' }, { label: '$3,000-4,000', value: '3-000-4-000' }, { label: '$4,000-5,000', value: '4-000-5-000' }, { label: '$5,000-7,000', value: '5-000-7-000' }, { label: '$7,000-10,000', value: '7-000-10-000' }, { label: '$10,000+', value: '10-000' }],
      },
      {
        key: 'price-range-portrait-session',
        label: 'Price Range (Portrait Session)',
        type: 'checkbox',
        options: [{ label: '$150-250', value: '150-250' }, { label: '$250-400', value: '250-400' }, { label: '$400-600', value: '400-600' }, { label: '$600-800', value: '600-800' }, { label: '$800+', value: '800' }],
      },
      {
        key: 'second-shooter-included',
        label: 'Second Shooter Included',
        type: 'checkbox',
        options: [{ label: 'Yes (wedding)', value: 'yes-wedding' }, { label: 'Optional (add $___)', value: 'optional-add' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'engagement-session-included',
        label: 'Engagement Session Included',
        type: 'checkbox',
        options: [{ label: 'Yes (with wedding package)', value: 'yes-with-wedding-package' }, { label: 'Optional (add $___)', value: 'optional-add' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'print-release',
        label: 'Print Release',
        type: 'checkbox',
        options: [{ label: 'Included (client can print)', value: 'included-client-can-print' }, { label: 'No (must order through photographer)', value: 'no-must-order-through-photographer' }],
      },
      {
        key: 'digital-files',
        label: 'Digital Files',
        type: 'checkbox',
        options: [{ label: 'All edited (high resolution)', value: 'all-edited-high-resolution' }, { label: 'Selected best only', value: 'selected-best-only' }, { label: 'Watermarked proofs (then purchase)', value: 'watermarked-proofs-then-purchase' }, { label: 'Unlimited download', value: 'unlimited-download' }],
      },
      {
        key: 'number-of-edited-photos',
        label: 'Number of Edited Photos',
        type: 'checkbox',
        options: [{ label: '50-100 (per hour estimate)', value: '50-100-per-hour-estimate' }, { label: '300-500 (wedding)', value: '300-500-wedding' }, { label: '500-800', value: '500-800' }, { label: '800+', value: '800' }],
      },
      {
        key: 'turnaround-time',
        label: 'Turnaround Time',
        type: 'checkbox',
        options: [{ label: '1-2 weeks (portrait)', value: '1-2-weeks-portrait' }, { label: '2-4 weeks (events)', value: '2-4-weeks-events' }, { label: '4-6 weeks (wedding)', value: '4-6-weeks-wedding' }, { label: '6-8 weeks', value: '6-8-weeks' }, { label: '8-12 weeks (busy season)', value: '8-12-weeks-busy-season' }],
      },
      {
        key: 'sneak-peek',
        label: 'Sneak Peek',
        type: 'checkbox',
        options: [{ label: 'Within 48 hours (few photos)', value: 'within-48-hours-few-photos' }, { label: 'Within 1 week', value: 'within-1-week' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'album-print-products',
        label: 'Album / Print Products',
        type: 'checkbox',
        options: [{ label: 'Wedding album (included or add-on)', value: 'wedding-album-included-or-add-on' }, { label: 'Parent albums', value: 'parent-albums' }, { label: 'Canvas prints', value: 'canvas-prints' }, { label: 'Metal prints', value: 'metal-prints' }, { label: 'Holiday cards', value: 'holiday-cards' }],
      },
      {
        key: 'video-services',
        label: 'Video Services',
        type: 'checkbox',
        options: [{ label: 'Highlight reel (3-5 min)', value: 'highlight-reel-3-5-min' }, { label: 'Full ceremony edit', value: 'full-ceremony-edit' }, { label: 'Full reception edit', value: 'full-reception-edit' }, { label: 'Documentary (long form)', value: 'documentary-long-form' }, { label: 'Same day edit (for event)', value: 'same-day-edit-for-event' }],
      },
      {
        key: 'videography-price',
        label: 'Videography Price',
        type: 'checkbox',
        options: [{ label: '$1,000-2,000 (highlight)', value: '1-000-2-000-highlight' }, { label: '$2,000-3,500 (full day)', value: '2-000-3-500-full-day' }, { label: '$3,500-5,000 (multi-cam)', value: '3-500-5-000-multi-cam' }, { label: '$5,000-10,000+ (cinematic)', value: '5-000-10-000-cinematic' }],
      },
      {
        key: 'drone-footage',
        label: 'Drone Footage',
        type: 'checkbox',
        options: [{ label: 'Included (where legal)', value: 'included-where-legal' }, { label: 'Add-on ($___)', value: 'add-on' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'lighting-equipment',
        label: 'Lighting Equipment',
        type: 'checkbox',
        options: [{ label: 'Natural light only', value: 'natural-light-only' }, { label: 'Off-camera flash', value: 'off-camera-flash' }, { label: 'Studio lighting (on location)', value: 'studio-lighting-on-location' }, { label: 'Video lighting (LED panels)', value: 'video-lighting-led-panels' }],
      },
      {
        key: 'backup-equipment',
        label: 'Backup Equipment',
        type: 'checkbox',
        options: [{ label: 'Yes (dual cameras)', value: 'yes-dual-cameras' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'insurance',
        label: 'Insurance',
        type: 'checkbox',
        options: [{ label: 'Liability insurance (COI available)', value: 'liability-insurance-coi-available' }, { label: 'Gear insurance (so no lost photos)', value: 'gear-insurance-so-no-lost-photos' }, { label: 'Not insured', value: 'not-insured' }],
      },
      {
        key: 'contract-required',
        label: 'Contract Required',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (handshake, not recommended)', value: 'no-handshake-not-recommended' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: '25%', value: '25' }, { label: '50%', value: '50' }, { label: 'Non-refundable', value: 'non-refundable' }],
      },
      {
        key: 'cancellation-policy',
        label: 'Cancellation Policy',
        type: 'checkbox',
        options: [{ label: '30 days (refund minus deposit)', value: '30-days-refund-minus-deposit' }, { label: '14 days (50% of total)', value: '14-days-50-of-total' }, { label: '7 days (no refund)', value: '7-days-no-refund' }],
      },
      {
        key: 'travel-fee',
        label: 'Travel Fee',
        type: 'checkbox',
        options: [{ label: 'Within 30 miles (free)', value: 'within-30-miles-free' }, { label: '30-60 miles ($___)', value: '30-60-miles' }, { label: '60+ miles (travel + lodging)', value: '60-miles-travel-lodging' }],
      },
      {
        key: 'second-photographer-gender-request',
        label: 'Second Photographer Gender Request',
        type: 'checkbox',
        options: [{ label: 'Can request', value: 'can-request' }, { label: 'No guarantee', value: 'no-guarantee' }],
      },
      {
        key: 'assistant-included',
        label: 'Assistant Included',
        type: 'checkbox',
        options: [{ label: 'Yes (carry gear, lighting)', value: 'yes-carry-gear-lighting' }, { label: 'No (solo photographer)', value: 'no-solo-photographer' }],
      },
      {
        key: 'client-closet-dresses-wardrobe',
        label: 'Client Closet (dresses/wardrobe)',
        type: 'checkbox',
        options: [{ label: 'Yes (portrait clients)', value: 'yes-portrait-clients' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'payment-plans',
        label: 'Payment Plans',
        type: 'checkbox',
        options: [{ label: 'Yes (3-6 months)', value: 'yes-3-6-months' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'references-available',
        label: 'References Available',
        type: 'checkbox',
        options: [{ label: 'Yes (past clients)', value: 'yes-past-clients' }, { label: 'No', value: 'no' }],
      }
    ],
    'creative-art-design-support': [
      {
        key: 'project-type',
        label: 'Project Type',
        type: 'checkbox',
        options: [{ label: 'One-time project', value: 'one-time-project' }, { label: 'Ongoing / retainer', value: 'ongoing-retainer' }, { label: 'Hourly consulting', value: 'hourly-consulting' }, { label: 'Fixed bid', value: 'fixed-bid' }],
      },
      {
        key: 'delivery-method',
        label: 'Delivery Method',
        type: 'checkbox',
        options: [{ label: 'Digital files only', value: 'digital-files-only' }, { label: 'Physical product (shipped)', value: 'physical-product-shipped' }, { label: 'In-person meeting', value: 'in-person-meeting' }, { label: 'Remote / virtual', value: 'remote-virtual' }],
      },
      {
        key: 'turnaround-time',
        label: 'Turnaround Time',
        type: 'checkbox',
        options: [{ label: '24 hours', value: '24-hours' }, { label: '3 days', value: '3-days' }, { label: '1 week', value: '1-week' }, { label: '2 weeks', value: '2-weeks' }, { label: '1 month', value: '1-month' }, { label: '2+ months', value: '2-months' }],
      },
      {
        key: 'revisions-included',
        label: 'Revisions Included',
        type: 'checkbox',
        options: [{ label: '1 round', value: '1-round' }, { label: '2 rounds', value: '2-rounds' }, { label: '3 rounds', value: '3-rounds' }, { label: 'Unlimited (until approval)', value: 'unlimited-until-approval' }, { label: 'No revisions (as-is)', value: 'no-revisions-as-is' }],
      },
      {
        key: 'portfolio-available',
        label: 'Portfolio Available',
        type: 'checkbox',
        options: [{ label: 'Yes (online)', value: 'yes-online' }, { label: 'Yes (upon request)', value: 'yes-upon-request' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'contract-required',
        label: 'Contract Required',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (small projects)', value: 'no-small-projects' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: '25%', value: '25' }, { label: '50%', value: '50' }, { label: 'No deposit', value: 'no-deposit' }],
      },
      {
        key: 'rush-fee',
        label: 'Rush Fee',
        type: 'checkbox',
        options: [{ label: 'Yes (___% extra)', value: 'yes-extra' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'commercial-use-rights',
        label: 'Commercial Use Rights',
        type: 'checkbox',
        options: [{ label: 'Included (client owns final)', value: 'included-client-owns-final' }, { label: 'Extra fee (for commercial)', value: 'extra-fee-for-commercial' }, { label: 'Personal use only', value: 'personal-use-only' }],
      }
    ],
    'retail-craft-support': [
      {
        key: 'retail-type',
        label: 'Retail Type',
        type: 'checkbox',
        options: [{ label: 'Physical store (brick and mortar)', value: 'physical-store-brick-and-mortar' }, { label: 'Online store (e-commerce)', value: 'online-store-e-commerce' }, { label: 'Both (omni-channel)', value: 'both-omni-channel' }],
      },
      {
        key: 'in-store-services',
        label: 'In-Store Services',
        type: 'checkbox',
        options: [{ label: 'Custom orders', value: 'custom-orders' }, { label: 'Personal shopping', value: 'personal-shopping' }, { label: 'Gift wrapping', value: 'gift-wrapping' }, { label: 'Alterations (see Sewing)', value: 'alterations-see-sewing' }, { label: 'Engraving / personalization', value: 'engraving-personalization' }],
      },
      {
        key: 'online-services',
        label: 'Online Services',
        type: 'checkbox',
        options: [{ label: 'Shipping (domestic)', value: 'shipping-domestic' }, { label: 'Shipping (international)', value: 'shipping-international' }, { label: 'Curbside pickup', value: 'curbside-pickup' }, { label: 'Buy online, pick up in-store', value: 'buy-online-pick-up-in-store' }],
      },
      {
        key: 'price-range',
        label: 'Price Range',
        type: 'checkbox',
        options: [{ label: 'Budget', value: 'budget' }, { label: 'Mid-range', value: 'mid-range' }, { label: 'Premium', value: 'premium' }, { label: 'Luxury', value: 'luxury' }],
      },
      {
        key: 'return-policy',
        label: 'Return Policy',
        type: 'checkbox',
        options: [{ label: '14 days', value: '14-days' }, { label: '30 days', value: '30-days' }, { label: '60 days', value: '60-days' }, { label: '90 days', value: '90-days' }, { label: 'Final sale (no returns)', value: 'final-sale-no-returns' }],
      },
      {
        key: 'payment-methods',
        label: 'Payment Methods',
        type: 'checkbox',
        options: [{ label: 'Cash', value: 'cash' }, { label: 'Credit card (Visa, MC, Amex, Discover)', value: 'credit-card-visa-mc-amex-discover' }, { label: 'Apple / Google Pay', value: 'apple-google-pay' }, { label: 'Afterpay / Klarna (installments)', value: 'afterpay-klarna-installments' }, { label: 'PayPal', value: 'paypal' }, { label: 'Cryptocurrency (rare)', value: 'cryptocurrency-rare' }],
      },
      {
        key: 'loyalty-program',
        label: 'Loyalty Program',
        type: 'checkbox',
        options: [{ label: 'Points per dollar', value: 'points-per-dollar' }, { label: 'Birthday discount', value: 'birthday-discount' }, { label: 'Exclusive sales', value: 'exclusive-sales' }, { label: 'No program', value: 'no-program' }],
      },
      {
        key: 'gift-cards',
        label: 'Gift Cards',
        type: 'checkbox',
        options: [{ label: 'Yes (physical)', value: 'yes-physical' }, { label: 'Yes (e-gift)', value: 'yes-e-gift' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'price-matching',
        label: 'Price Matching',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'special-orders',
        label: 'Special Orders',
        type: 'checkbox',
        options: [{ label: 'Yes (non-returnable)', value: 'yes-non-returnable' }, { label: 'No (only in-stock)', value: 'no-only-in-stock' }],
      },
      {
        key: 'size-range-apparel',
        label: 'Size Range (apparel)',
        type: 'checkbox',
        options: [{ label: 'XS-XXL', value: 'xs-xxl' }, { label: 'Plus size (1X-4X)', value: 'plus-size-1x-4x' }, { label: 'Petite', value: 'petite' }, { label: 'Tall', value: 'tall' }, { label: 'Limited (S-L only)', value: 'limited-s-l-only' }],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        type: 'checkbox',
        options: [{ label: 'Wheelchair accessible (store)', value: 'wheelchair-accessible-store' }, { label: 'Curb delivery (online)', value: 'curb-delivery-online' }, { label: 'Not accessible', value: 'not-accessible' }],
      },
      {
        key: 'parking-physical-store',
        label: 'Parking (physical store)',
        type: 'checkbox',
        options: [{ label: 'Free lot', value: 'free-lot' }, { label: 'Street parking', value: 'street-parking' }, { label: 'Paid garage', value: 'paid-garage' }, { label: 'No parking', value: 'no-parking' }],
      },
      {
        key: 'store-hours-physical',
        label: 'Store Hours (physical)',
        type: 'checkbox',
        options: [{ label: 'Weekdays 10-6', value: 'weekdays-10-6' }, { label: 'Weekdays 10-8', value: 'weekdays-10-8' }, { label: 'Weekends', value: 'weekends' }, { label: 'By appointment only', value: 'by-appointment-only' }],
      }
    ],
    'tech-specialized-services': [
      {
        key: 'service-type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'On-site (they come to you)', value: 'on-site-they-come-to-you' }, { label: 'Remote (online only)', value: 'remote-online-only' }, { label: 'Both (hybrid)', value: 'both-hybrid' }],
      },
      {
        key: 'response-time',
        label: 'Response Time',
        type: 'checkbox',
        options: [{ label: 'Immediate (24/7)', value: 'immediate-24-7' }, { label: 'Within 1 hour', value: 'within-1-hour' }, { label: 'Within 4 hours', value: 'within-4-hours' }, { label: 'Within 24 hours', value: 'within-24-hours' }, { label: 'Scheduled appointment', value: 'scheduled-appointment' }],
      },
      {
        key: 'contract-required',
        label: 'Contract Required',
        type: 'checkbox',
        options: [{ label: 'Yes (monthly or annual)', value: 'yes-monthly-or-annual' }, { label: 'No (one-time)', value: 'no-one-time' }],
      },
      {
        key: 'service-hours',
        label: 'Service Hours',
        type: 'checkbox',
        options: [{ label: '9am-5pm (business hours)', value: '9am-5pm-business-hours' }, { label: '24/7 emergency', value: '24-7-emergency' }, { label: 'Evenings/weekends (extra fee)', value: 'evenings-weekends-extra-fee' }],
      },
      {
        key: 'minimum-billing',
        label: 'Minimum Billing',
        type: 'checkbox',
        options: [{ label: '15 minutes', value: '15-minutes' }, { label: '30 minutes', value: '30-minutes' }, { label: '1 hour', value: '1-hour' }, { label: 'No minimum', value: 'no-minimum' }],
      }
    ],
  },
  bySubcategory: {
    'party-and-event-planning': [
      {
        key: 'specialization',
        label: 'Specialization',
        type: 'checkbox',
        options: [{ label: 'Birthday parties', value: 'birthday-parties' }, { label: 'Corporate events', value: 'corporate-events' }, { label: 'Holiday parties', value: 'holiday-parties' }, { label: 'Anniversary parties', value: 'anniversary-parties' }, { label: 'Retirement parties', value: 'retirement-parties' }, { label: 'Graduation parties', value: 'graduation-parties' }, { label: 'Surprise parties', value: 'surprise-parties' }],
      },
      {
        key: 'theme_expertise',
        label: 'Theme Expertise',
        type: 'checkbox',
        options: [{ label: 'Formal / Black tie', value: 'formal-black-tie' }, { label: 'Casual', value: 'casual' }, { label: 'Themed (disco, casino, masquerade, etc.)', value: 'themed-disco-casino-masquerade-etc' }, { label: 'Seasonal', value: 'seasonal' }, { label: 'Cultural / Traditional', value: 'cultural-traditional' }],
      },
      {
        key: 'budget_management',
        label: 'Budget Management',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'vendor_coordination',
        label: 'Vendor Coordination',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'timeline_creation',
        label: 'Timeline Creation',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'wedding-planning': [
      {
        key: 'wedding_size',
        label: 'Wedding Size',
        type: 'checkbox',
        options: [{ label: 'Elopement (under 20 guests)', value: 'elopement-under-20-guests' }, { label: 'Micro wedding (20-50)', value: 'micro-wedding-20-50' }, { label: 'Small wedding (50-100)', value: 'small-wedding-50-100' }, { label: 'Standard wedding (100-200)', value: 'standard-wedding-100-200' }, { label: 'Large wedding (200+)', value: 'large-wedding-200' }],
      },
      {
        key: 'wedding_type',
        label: 'Wedding Type',
        type: 'checkbox',
        options: [{ label: 'Traditional religious', value: 'traditional-religious' }, { label: 'Non-religious / secular', value: 'non-religious-secular' }, { label: 'Destination wedding', value: 'destination-wedding' }, { label: 'Backyard wedding', value: 'backyard-wedding' }, { label: 'Intimate / micro wedding', value: 'intimate-micro-wedding' }, { label: 'LGBTQ+ weddings', value: 'lgbtq-weddings' }, { label: 'Vow renewal', value: 'vow-renewal' }, { label: 'Second marriage', value: 'second-marriage' }],
      },
      {
        key: 'wedding_services_offered',
        label: 'Services Offered',
        type: 'checkbox',
        options: [{ label: 'Budget planning', value: 'budget-planning' }, { label: 'Venue selection', value: 'venue-selection' }, { label: 'Vendor booking', value: 'vendor-booking' }, { label: 'Timeline management', value: 'timeline-management' }, { label: 'Rehearsal dinner coordination', value: 'rehearsal-dinner-coordination' }, { label: 'Day-of emergency kit', value: 'day-of-emergency-kit' }, { label: 'Guest accommodations', value: 'guest-accommodations' }, { label: 'RSVP tracking', value: 'rsvp-tracking' }],
      },
      {
        key: 'cultural_religious_specialties',
        label: 'Cultural / Religious Specialties',
        type: 'checkbox',
        options: [{ label: 'Christian', value: 'christian' }, { label: 'Jewish', value: 'jewish' }, { label: 'Muslim', value: 'muslim' }, { label: 'Hindu', value: 'hindu' }, { label: 'Sikh', value: 'sikh' }, { label: 'Buddhist', value: 'buddhist' }, { label: 'Interfaith', value: 'interfaith' }, { label: 'Non-denominational', value: 'non-denominational' }],
      },
      {
        key: 'month_of_support',
        label: 'Month-of Support',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'venue_walkthrough_included',
        label: 'Venue Walkthrough Included',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'officiating-services': [
      {
        key: 'officiant_type',
        label: 'Officiant Type',
        type: 'checkbox',
        options: [{ label: 'Religious leader', value: 'religious-leader' }, { label: 'Judge / Justice of the peace', value: 'judge-justice-of-the-peace' }, { label: 'Notary public', value: 'notary-public' }, { label: 'Humanist celebrant', value: 'humanist-celebrant' }, { label: 'Non-denominational minister', value: 'non-denominational-minister' }, { label: 'Friend / family member (assistance only)', value: 'friend-family-member-assistance-only' }],
      },
      {
        key: 'religious_affiliation',
        label: 'Religious Affiliation',
        type: 'checkbox',
        options: [{ label: 'Catholic', value: 'catholic' }, { label: 'Protestant', value: 'protestant' }, { label: 'Jewish', value: 'jewish' }, { label: 'Muslim', value: 'muslim' }, { label: 'Hindu', value: 'hindu' }, { label: 'Buddhist', value: 'buddhist' }, { label: 'Pagan / Wiccan', value: 'pagan-wiccan' }, { label: 'Other', value: 'other' }],
      },
      {
        key: 'ceremony_length',
        label: 'Ceremony Length Options',
        type: 'checkbox',
        options: [{ label: '10-15 minutes', value: '10-15-minutes' }, { label: '15-30 minutes', value: '15-30-minutes' }, { label: '30-45 minutes', value: '30-45-minutes' }, { label: 'Custom length', value: 'custom-length' }],
      },
      {
        key: 'premarital_counseling',
        label: 'Pre-marital Counseling Included',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'license_filing_assistance',
        label: 'License Filing Assistance',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'rehearsal_attendance',
        label: 'Rehearsal Attendance',
        type: 'checkbox',
        options: [{ label: 'Included', value: 'included' }, { label: 'Extra fee', value: 'extra-fee' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'custom_vows_assistance',
        label: 'Custom Vows Assistance',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'team-building-activity': [
      {
        key: 'group_size',
        label: 'Group Size',
        type: 'checkbox',
        options: [{ label: 'Small (2-10)', value: 'small-2-10' }, { label: 'Medium (11-25)', value: 'medium-11-25' }, { label: 'Large (26-50)', value: 'large-26-50' }, { label: 'Extra large (51-100)', value: 'extra-large-51-100' }, { label: 'Enterprise (100+)', value: 'enterprise-100' }],
      },
      {
        key: 'activity_duration',
        label: 'Activity Duration',
        type: 'checkbox',
        options: [{ label: '1 hour', value: '1-hour' }, { label: '2-3 hours', value: '2-3-hours' }, { label: 'Half day (4 hours)', value: 'half-day-4-hours' }, { label: 'Full day (8 hours)', value: 'full-day-8-hours' }, { label: 'Multi-day', value: 'multi-day' }],
      },
      {
        key: 'activity_type',
        label: 'Activity Type',
        type: 'checkbox',
        options: [{ label: 'Problem solving', value: 'problem-solving' }, { label: 'Communication focus', value: 'communication-focus' }, { label: 'Trust building', value: 'trust-building' }, { label: 'Creative / artistic', value: 'creative-artistic' }, { label: 'Physical / active', value: 'physical-active' }, { label: 'Volunteer / charity', value: 'volunteer-charity' }, { label: 'Cooking / food based', value: 'cooking-food-based' }, { label: 'Escape room style', value: 'escape-room-style' }, { label: 'Trivia / quiz based', value: 'trivia-quiz-based' }],
      },
      {
        key: 'location_type',
        label: 'Location',
        type: 'checkbox',
        options: [{ label: 'On-site (they come to you)', value: 'on-site-they-come-to-you' }, { label: 'Off-site (you go to them)', value: 'off-site-you-go-to-them' }, { label: 'Virtual', value: 'virtual' }, { label: 'Hybrid', value: 'hybrid' }],
      },
      {
        key: 'indoor_outdoor',
        label: 'Indoor / Outdoor',
        type: 'checkbox',
        options: [{ label: 'Indoor only', value: 'indoor-only' }, { label: 'Outdoor only', value: 'outdoor-only' }, { label: 'Either', value: 'either' }],
      },
      {
        key: 'corporate_experience',
        label: 'Corporate Experience Level',
        type: 'checkbox',
        options: [{ label: 'Works with Fortune 500', value: 'works-with-fortune-500' }, { label: 'Works with startups', value: 'works-with-startups' }, { label: 'Works with non-profits', value: 'works-with-non-profits' }, { label: 'Works with remote teams', value: 'works-with-remote-teams' }],
      },
      {
        key: 'customization_available',
        label: 'Customization Available',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'post_activity_debrief',
        label: 'Post-Activity Debrief Included',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'venue-event-space': [
      {
        key: 'space-style',
        label: 'Space Style',
        type: 'checkbox',
        options: [{ label: 'Modern', value: 'modern' }, { label: 'Rustic / barn', value: 'rustic-barn' }, { label: 'Industrial / warehouse', value: 'industrial-warehouse' }, { label: 'Ballroom / elegant', value: 'ballroom-elegant' }, { label: 'Garden / outdoor', value: 'garden-outdoor' }, { label: 'Historic / vintage', value: 'historic-vintage' }, { label: 'Minimalist / gallery', value: 'minimalist-gallery' }, { label: 'Rooftop', value: 'rooftop' }, { label: 'Waterfront', value: 'waterfront' }, { label: 'Urban / loft', value: 'urban-loft' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Natural light abundant', value: 'natural-light-abundant' }, { label: 'Dimmer switches', value: 'dimmer-switches' }, { label: 'Chandeliers', value: 'chandeliers' }, { label: 'String lights', value: 'string-lights' }, { label: 'Blackout options', value: 'blackout-options' }, { label: 'Stage lighting available', value: 'stage-lighting-available' }],
      },
      {
        key: 'furniture-included',
        label: 'Furniture Included',
        type: 'checkbox',
        options: [{ label: 'Tables (round, rectangular)', value: 'tables-round-rectangular' }, { label: 'Chairs (folding, banquet, chiavari)', value: 'chairs-folding-banquet-chiavari' }, { label: 'Bar stools', value: 'bar-stools' }, { label: 'Lounge seating', value: 'lounge-seating' }, { label: 'Nothing (empty space)', value: 'nothing-empty-space' }],
      },
      {
        key: 'load-in-access',
        label: 'Load-in Access',
        type: 'checkbox',
        options: [{ label: 'Street level', value: 'street-level' }, { label: 'Freight elevator', value: 'freight-elevator' }, { label: 'Stairs only', value: 'stairs-only' }, { label: 'Ramp available', value: 'ramp-available' }],
      }
    ],
    'wedding-chapel': [
      {
        key: 'chapel-style',
        label: 'Chapel Style',
        type: 'checkbox',
        options: [{ label: 'Traditional church', value: 'traditional-church' }, { label: 'Non-denominational chapel', value: 'non-denominational-chapel' }, { label: 'Historic chapel', value: 'historic-chapel' }, { label: 'Garden chapel', value: 'garden-chapel' }, { label: 'Beach chapel', value: 'beach-chapel' }, { label: 'Drive-thru chapel', value: 'drive-thru-chapel' }, { label: 'Las Vegas style', value: 'las-vegas-style' }],
      },
      {
        key: 'religious-affiliation',
        label: 'Religious Affiliation',
        type: 'checkbox',
        options: [{ label: 'Catholic', value: 'catholic' }, { label: 'Protestant', value: 'protestant' }, { label: 'Non-denominational', value: 'non-denominational' }, { label: 'Interfaith', value: 'interfaith' }, { label: 'Secular', value: 'secular' }],
      },
      {
        key: 'maximum-seating',
        label: 'Maximum Seating',
        type: 'checkbox',
        options: [{ label: 'Under 50', value: 'under-50' }, { label: '50-100', value: '50-100' }, { label: '100-200', value: '100-200' }, { label: '200+', value: '200' }],
      },
      {
        key: 'photography-rules',
        label: 'Photography Rules',
        type: 'checkbox',
        options: [{ label: 'No restrictions', value: 'no-restrictions' }, { label: 'No flash photography', value: 'no-flash-photography' }, { label: 'No photography during ceremony', value: 'no-photography-during-ceremony' }, { label: 'Professional photographers only', value: 'professional-photographers-only' }],
      },
      {
        key: 'music-options',
        label: 'Music Options',
        type: 'checkbox',
        options: [{ label: 'Organ / piano available', value: 'organ-piano-available' }, { label: 'Sound system included', value: 'sound-system-included' }, { label: 'Live musicians allowed', value: 'live-musicians-allowed' }, { label: 'DJ allowed', value: 'dj-allowed' }, { label: 'Recorded music only', value: 'recorded-music-only' }],
      },
      {
        key: 'marriage-license',
        label: 'Marriage License',
        type: 'checkbox',
        options: [{ label: 'Available on-site', value: 'available-on-site' }, { label: 'Nearby courthouse', value: 'nearby-courthouse' }, { label: 'Must bring your own', value: 'must-bring-your-own' }],
      },
      {
        key: 'witnesses-provided',
        label: 'Witnesses Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (included)', value: 'yes-included' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      }
    ],
    'exhibition-trade-center': [
      {
        key: 'total-square-footage',
        label: 'Total Square Footage',
        type: 'checkbox',
        options: [{ label: 'Under 10,000 sq ft', value: 'under-10-000-sq-ft' }, { label: '10,000-50,000 sq ft', value: '10-000-50-000-sq-ft' }, { label: '50,000-100,000 sq ft', value: '50-000-100-000-sq-ft' }, { label: '100,000-250,000 sq ft', value: '100-000-250-000-sq-ft' }, { label: '250,000+ sq ft', value: '250-000-sq-ft' }],
      },
      {
        key: 'booth-types-supported',
        label: 'Booth Types Supported',
        type: 'checkbox',
        options: [{ label: 'Standard (10x10)', value: 'standard-10x10' }, { label: 'Inline', value: 'inline' }, { label: 'Corner', value: 'corner' }, { label: 'Island', value: 'island' }, { label: 'Custom build space', value: 'custom-build-space' }],
      },
      {
        key: 'floor-load-capacity',
        label: 'Floor Load Capacity',
        type: 'checkbox',
        options: [{ label: 'Standard (under 500 lbs/sq ft)', value: 'standard-under-500-lbs-sq-ft' }, { label: 'Heavy (500-1,500 lbs/sq ft)', value: 'heavy-500-1-500-lbs-sq-ft' }, { label: 'Super heavy (1,500+ lbs/sq ft)', value: 'super-heavy-1-500-lbs-sq-ft' }],
      },
      {
        key: 'ceiling-height',
        label: 'Ceiling Height',
        type: 'checkbox',
        options: [{ label: 'Under 15 ft', value: 'under-15-ft' }, { label: '15-25 ft', value: '15-25-ft' }, { label: '25-35 ft', value: '25-35-ft' }, { label: '35+ ft', value: '35-ft' }],
      },
      {
        key: 'loading-docks',
        label: 'Loading Docks',
        type: 'checkbox',
        options: [{ label: 'Number of docks: ___', value: 'number-of-docks' }, { label: 'Drive-in access', value: 'drive-in-access' }, { label: 'Freight elevator', value: 'freight-elevator' }],
      },
      {
        key: 'power-available',
        label: 'Power Available',
        type: 'checkbox',
        options: [{ label: 'Standard 110v', value: 'standard-110v' }, { label: '220v', value: '220v' }, { label: '3-phase', value: '3-phase' }, { label: 'Generator available', value: 'generator-available' }],
      },
      {
        key: 'booth-amenities',
        label: 'Booth Amenities',
        type: 'checkbox',
        options: [{ label: 'Pipe and drape included', value: 'pipe-and-drape-included' }, { label: 'Carpet included', value: 'carpet-included' }, { label: 'Signage included', value: 'signage-included' }, { label: 'Table and chairs', value: 'table-and-chairs' }, { label: 'Wastebasket', value: 'wastebasket' }],
      },
      {
        key: 'security',
        label: 'Security',
        type: 'checkbox',
        options: [{ label: 'Overnight security included', value: 'overnight-security-included' }, { label: 'Security deposit required', value: 'security-deposit-required' }, { label: 'CCTV on premises', value: 'cctv-on-premises' }],
      },
      {
        key: 'parking-for-exhibitors',
        label: 'Parking for Exhibitors',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: 'Paid', value: 'paid' }, { label: 'Not available', value: 'not-available' }],
      }
    ],
    'proposal-venue': [
      {
        key: 'venue-vibe',
        label: 'Venue Vibe',
        type: 'checkbox',
        options: [{ label: 'Romantic / intimate', value: 'romantic-intimate' }, { label: 'Scenic / view', value: 'scenic-view' }, { label: 'Adventurous', value: 'adventurous' }, { label: 'Luxurious / upscale', value: 'luxurious-upscale' }, { label: 'Casual / low key', value: 'casual-low-key' }, { label: 'Nostalgic / meaningful', value: 'nostalgic-meaningful' }],
      },
      {
        key: 'privacy-level',
        label: 'Privacy Level',
        type: 'checkbox',
        options: [{ label: 'Completely private', value: 'completely-private' }, { label: 'Semi-private (reserved area)', value: 'semi-private-reserved-area' }, { label: 'Public (no reservation)', value: 'public-no-reservation' }, { label: 'Hidden / secret spot', value: 'hidden-secret-spot' }],
      },
      {
        key: 'photography-package-available',
        label: 'Photography Package Available',
        type: 'checkbox',
        options: [{ label: 'Yes (included)', value: 'yes-included' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No (self-photo only)', value: 'no-self-photo-only' }],
      },
      {
        key: 'setup-included',
        label: 'Setup Included',
        type: 'checkbox',
        options: [{ label: 'Roses / petals', value: 'roses-petals' }, { label: 'Candles', value: 'candles' }, { label: 'Signage', value: 'signage' }, { label: 'Champagne / toast', value: 'champagne-toast' }, { label: 'Music / speaker', value: 'music-speaker' }, { label: 'Lighting', value: 'lighting' }],
      },
      {
        key: 'surprise-assistance',
        label: 'Surprise Assistance',
        type: 'checkbox',
        options: [{ label: 'Venue staff can help hide ring', value: 'venue-staff-can-help-hide-ring' }, { label: 'Decoy plan available', value: 'decoy-plan-available' }, { label: 'Distraction provided', value: 'distraction-provided' }],
      },
      {
        key: 'rain-plan-available',
        label: 'Rain Plan Available',
        type: 'checkbox',
        options: [{ label: 'Yes (indoor backup)', value: 'yes-indoor-backup' }, { label: 'Yes (reschedule)', value: 'yes-reschedule' }, { label: 'No (outdoor only)', value: 'no-outdoor-only' }],
      }
    ],
    'attraction-farm': [
      {
        key: 'farm-activities',
        label: 'Farm Activities',
        type: 'checkbox',
        options: [{ label: 'Hayrides', value: 'hayrides' }, { label: 'Corn maze', value: 'corn-maze' }, { label: 'Pumpkin patch', value: 'pumpkin-patch' }, { label: 'Apple picking', value: 'apple-picking' }, { label: 'Berry picking', value: 'berry-picking' }, { label: 'Petting zoo', value: 'petting-zoo' }, { label: 'Tractor rides', value: 'tractor-rides' }, { label: 'Cider pressing', value: 'cider-pressing' }, { label: 'Farm animals', value: 'farm-animals' }, { label: 'Pony rides', value: 'pony-rides' }],
      },
      {
        key: 'seasonal-availability',
        label: 'Seasonal Availability',
        type: 'checkbox',
        options: [{ label: 'Spring (March-May)', value: 'spring-march-may' }, { label: 'Summer (June-August)', value: 'summer-june-august' }, { label: 'Fall (September-November)', value: 'fall-september-november' }, { label: 'Winter (December-February)', value: 'winter-december-february' }],
      },
      {
        key: 'admission-model',
        label: 'Admission Model',
        type: 'checkbox',
        options: [{ label: 'Per person', value: 'per-person' }, { label: 'Per activity', value: 'per-activity' }, { label: 'All-inclusive wristband', value: 'all-inclusive-wristband' }, { label: 'Free (pay for activities)', value: 'free-pay-for-activities' }],
      },
      {
        key: 'group-rates',
        label: 'Group Rates',
        type: 'checkbox',
        options: [{ label: 'Yes (10+ people)', value: 'yes-10-people' }, { label: 'Yes (20+ people)', value: 'yes-20-people' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'birthday-party-packages',
        label: 'Birthday Party Packages',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'school-field-trip-friendly',
        label: 'School / Field Trip Friendly',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      }
    ],
    'orchard': [
      {
        key: 'fruit-types',
        label: 'Fruit Types',
        type: 'checkbox',
        options: [{ label: 'Apples', value: 'apples' }, { label: 'Cherries', value: 'cherries' }, { label: 'Peaches', value: 'peaches' }, { label: 'Pears', value: 'pears' }, { label: 'Plums', value: 'plums' }, { label: 'Berries', value: 'berries' }, { label: 'Citrus', value: 'citrus' }, { label: 'Mixed orchard', value: 'mixed-orchard' }],
      },
      {
        key: 'picking-style',
        label: 'Picking Style',
        type: 'checkbox',
        options: [{ label: 'U-pick (you pick)', value: 'u-pick-you-pick' }, { label: 'Pre-picked available', value: 'pre-picked-available' }, { label: 'Both', value: 'both' }],
      },
      {
        key: 'seasonal-schedule',
        label: 'Seasonal Schedule',
        type: 'checkbox',
        options: [{ label: 'Opening date: ___', value: 'opening-date' }, { label: 'Closing date: ___', value: 'closing-date' }, { label: 'Peak season: ___', value: 'peak-season' }],
      },
      {
        key: 'payment-model',
        label: 'Payment Model',
        type: 'checkbox',
        options: [{ label: 'Pay per pound', value: 'pay-per-pound' }, { label: 'Pay per bag/basket', value: 'pay-per-bag-basket' }, { label: 'Pay per person (includes X lbs)', value: 'pay-per-person-includes-x-lbs' }, { label: 'Entry fee + per pound', value: 'entry-fee-per-pound' }],
      },
      {
        key: 'wagon-transport',
        label: 'Wagon Transport',
        type: 'checkbox',
        options: [{ label: 'Included', value: 'included' }, { label: 'Available (fee)', value: 'available-fee' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'restaurant-cider-mill-on-site',
        label: 'Restaurant / Cider Mill On-Site',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'hard-cider-wine-tasting',
        label: 'Hard Cider / Wine Tasting',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      }
    ],
    'distillery': [
      {
        key: 'spirit-types-produced',
        label: 'Spirit Types Produced',
        type: 'checkbox',
        options: [{ label: 'Whiskey / Bourbon', value: 'whiskey-bourbon' }, { label: 'Vodka', value: 'vodka' }, { label: 'Gin', value: 'gin' }, { label: 'Rum', value: 'rum' }, { label: 'Tequila / Mezcal', value: 'tequila-mezcal' }, { label: 'Liqueurs', value: 'liqueurs' }, { label: 'Moonshine', value: 'moonshine' }],
      },
      {
        key: 'tasting-options',
        label: 'Tasting Options',
        type: 'checkbox',
        options: [{ label: 'Free tasting', value: 'free-tasting' }, { label: 'Paid flight ($5-15)', value: 'paid-flight-5-15' }, { label: 'Paid flight ($15-25)', value: 'paid-flight-15-25' }, { label: 'Paid flight ($25+)', value: 'paid-flight-25' }, { label: 'No tasting available', value: 'no-tasting-available' }],
      },
      {
        key: 'tour-available',
        label: 'Tour Available',
        type: 'checkbox',
        options: [{ label: 'Self-guided', value: 'self-guided' }, { label: 'Guided (free)', value: 'guided-free' }, { label: 'Guided (paid)', value: 'guided-paid' }, { label: 'Behind-the-scenes / production area', value: 'behind-the-scenes-production-area' }],
      },
      {
        key: 'bottle-sales',
        label: 'Bottle Sales',
        type: 'checkbox',
        options: [{ label: 'Purchase on-site', value: 'purchase-on-site' }, { label: 'Pre-order only', value: 'pre-order-only' }, { label: 'Shipping available', value: 'shipping-available' }, { label: 'No direct sales', value: 'no-direct-sales' }],
      },
      {
        key: 'cocktail-bar-on-site',
        label: 'Cocktail Bar On-Site',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'private-event-space',
        label: 'Private Event Space',
        type: 'checkbox',
        options: [{ label: 'Yes (rentable)', value: 'yes-rentable' }, { label: 'Yes (min. spend)', value: 'yes-min-spend' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'food-available',
        label: 'Food Available',
        type: 'checkbox',
        options: [{ label: 'Full kitchen', value: 'full-kitchen' }, { label: 'Snacks only', value: 'snacks-only' }, { label: 'Food trucks on certain days', value: 'food-trucks-on-certain-days' }, { label: 'No food (BYO or outside allowed)', value: 'no-food-byo-or-outside-allowed' }],
      }
    ],
    'art-museum': [
      {
        key: 'art-type',
        label: 'Art Type',
        type: 'checkbox',
        options: [{ label: 'Contemporary', value: 'contemporary' }, { label: 'Modern', value: 'modern' }, { label: 'Classical / Old Masters', value: 'classical-old-masters' }, { label: 'Renaissance', value: 'renaissance' }, { label: 'Impressionist', value: 'impressionist' }, { label: 'Abstract', value: 'abstract' }, { label: 'Sculpture', value: 'sculpture' }, { label: 'Photography', value: 'photography' }, { label: 'Digital / New media', value: 'digital-new-media' }, { label: 'Decorative arts', value: 'decorative-arts' }],
      },
      {
        key: 'permanent-collection-size',
        label: 'Permanent Collection Size',
        type: 'checkbox',
        options: [{ label: 'Small (under 500 works)', value: 'small-under-500-works' }, { label: 'Medium (500-2,000)', value: 'medium-500-2-000' }, { label: 'Large (2,000-10,000)', value: 'large-2-000-10-000' }, { label: 'Very large (10,000+)', value: 'very-large-10-000' }],
      },
      {
        key: 'special-exhibitions',
        label: 'Special Exhibitions',
        type: 'checkbox',
        options: [{ label: 'Currently on view', value: 'currently-on-view' }, { label: 'Upcoming', value: 'upcoming' }, { label: 'Past (archive)', value: 'past-archive' }],
      },
      {
        key: 'admission',
        label: 'Admission',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: 'Suggested donation', value: 'suggested-donation' }, { label: 'Paid (under $10)', value: 'paid-under-10' }, { label: 'Paid ($10-20)', value: 'paid-10-20' }, { label: 'Paid ($20+)', value: 'paid-20' }, { label: 'Members only (some areas)', value: 'members-only-some-areas' }],
      },
      {
        key: 'audio-guide',
        label: 'Audio Guide',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: 'Paid ($)', value: 'paid' }, { label: 'App-based', value: 'app-based' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'guided-tours',
        label: 'Guided Tours',
        type: 'checkbox',
        options: [{ label: 'Included with admission', value: 'included-with-admission' }, { label: 'Extra fee', value: 'extra-fee' }, { label: 'Private tour available', value: 'private-tour-available' }, { label: 'Self-guided brochure', value: 'self-guided-brochure' }],
      },
      {
        key: 'photography-policy',
        label: 'Photography Policy',
        type: 'checkbox',
        options: [{ label: 'Allowed (no flash)', value: 'allowed-no-flash' }, { label: 'Allowed with permit', value: 'allowed-with-permit' }, { label: 'Not allowed in special exhibitions', value: 'not-allowed-in-special-exhibitions' }, { label: 'No photography at all', value: 'no-photography-at-all' }],
      },
      {
        key: 'event-rental-available',
        label: 'Event Rental Available',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'cafe-restaurant-on-site',
        label: 'Cafe / Restaurant On-Site',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'gift-shop',
        label: 'Gift Shop',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      }
    ],
    'auditorium': [
      {
        key: 'seating-capacity',
        label: 'Seating Capacity',
        type: 'checkbox',
        options: [{ label: 'Under 100', value: 'under-100' }, { label: '100-250', value: '100-250' }, { label: '251-500', value: '251-500' }, { label: '501-1,000', value: '501-1-000' }, { label: '1,001-2,000', value: '1-001-2-000' }, { label: '2,000+', value: '2-000' }],
      },
      {
        key: 'seating-type',
        label: 'Seating Type',
        type: 'checkbox',
        options: [{ label: 'Fixed theater seats', value: 'fixed-theater-seats' }, { label: 'Retractable / removable', value: 'retractable-removable' }, { label: 'Bleachers', value: 'bleachers' }, { label: 'General admission (standing room)', value: 'general-admission-standing-room' }],
      },
      {
        key: 'sightlines',
        label: 'Sightlines',
        type: 'checkbox',
        options: [{ label: 'Good from all seats', value: 'good-from-all-seats' }, { label: 'Pillars / obstructions', value: 'pillars-obstructions' }, { label: 'Balcony available', value: 'balcony-available' }, { label: 'Box seats available', value: 'box-seats-available' }],
      },
      {
        key: 'stage-size',
        label: 'Stage Size',
        type: 'checkbox',
        options: [{ label: 'Small (under 20ft wide)', value: 'small-under-20ft-wide' }, { label: 'Medium (20-40ft)', value: 'medium-20-40ft' }, { label: 'Large (40-60ft)', value: 'large-40-60ft' }, { label: 'Extra large (60ft+)', value: 'extra-large-60ft' }],
      },
      {
        key: 'fly-system',
        label: 'Fly System',
        type: 'checkbox',
        options: [{ label: 'Yes (manual)', value: 'yes-manual' }, { label: 'Yes (motorized)', value: 'yes-motorized' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'orchestra-pit',
        label: 'Orchestra Pit',
        type: 'checkbox',
        options: [{ label: 'Yes (usable)', value: 'yes-usable' }, { label: 'Yes (covered)', value: 'yes-covered' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'green-rooms',
        label: 'Green Rooms',
        type: 'checkbox',
        options: [{ label: 'Number of green rooms: ___', value: 'number-of-green-rooms' }, { label: 'No green rooms', value: 'no-green-rooms' }],
      },
      {
        key: 'production-booth',
        label: 'Production Booth',
        type: 'checkbox',
        options: [{ label: 'Yes (venue staff required)', value: 'yes-venue-staff-required' }, { label: 'Yes (self-operated)', value: 'yes-self-operated' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'sound-system',
        label: 'Sound System',
        type: 'checkbox',
        options: [{ label: 'Basic (speakers + mic)', value: 'basic-speakers-mic' }, { label: 'Professional line array', value: 'professional-line-array' }, { label: 'Hearing loop / assistive listening', value: 'hearing-loop-assistive-listening' }, { label: 'No sound system (bring your own)', value: 'no-sound-system-bring-your-own' }],
      },
      {
        key: 'lighting-system',
        label: 'Lighting System',
        type: 'checkbox',
        options: [{ label: 'Basic house lights', value: 'basic-house-lights' }, { label: 'Full theatrical lighting', value: 'full-theatrical-lighting' }, { label: 'Intelligent / moving lights', value: 'intelligent-moving-lights' }, { label: 'No lighting (bring your own)', value: 'no-lighting-bring-your-own' }],
      },
      {
        key: 'projection',
        label: 'Projection',
        type: 'checkbox',
        options: [{ label: 'Built-in projector & screen', value: 'built-in-projector-screen' }, { label: 'Projector only', value: 'projector-only' }, { label: 'Screen only', value: 'screen-only' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'backstage-access',
        label: 'Backstage Access',
        type: 'checkbox',
        options: [{ label: 'Limited', value: 'limited' }, { label: 'Full', value: 'full' }, { label: 'None', value: 'none' }],
      }
    ],
    'theaters-performance-venues': [
      {
        key: 'theater-type',
        label: 'Theater Type',
        type: 'checkbox',
        options: [{ label: 'Broadway / large scale', value: 'broadway-large-scale' }, { label: 'Off-Broadway', value: 'off-broadway' }, { label: 'Community theater', value: 'community-theater' }, { label: 'Dinner theater', value: 'dinner-theater' }, { label: 'Improv / comedy club', value: 'improv-comedy-club' }, { label: 'Black box theater', value: 'black-box-theater' }, { label: 'Outdoor amphitheater', value: 'outdoor-amphitheater' }, { label: 'Drive-in theater (performance)', value: 'drive-in-theater-performance' }, { label: 'Puppet theater', value: 'puppet-theater' }, { label: 'Children\'s theater', value: 'children-s-theater' }],
      },
      {
        key: 'performance-types-hosted',
        label: 'Performance Types Hosted',
        type: 'checkbox',
        options: [{ label: 'Plays / drama', value: 'plays-drama' }, { label: 'Musicals', value: 'musicals' }, { label: 'Comedy', value: 'comedy' }, { label: 'Dance / ballet', value: 'dance-ballet' }, { label: 'Opera', value: 'opera' }, { label: 'Symphony / orchestra', value: 'symphony-orchestra' }, { label: 'Children\'s shows', value: 'children-s-shows' }, { label: 'Spoken word / poetry', value: 'spoken-word-poetry' }, { label: 'Burlesque / cabaret', value: 'burlesque-cabaret' }],
      },
      {
        key: 'bar-concessions',
        label: 'Bar / Concessions',
        type: 'checkbox',
        options: [{ label: 'Full bar', value: 'full-bar' }, { label: 'Beer & wine only', value: 'beer-wine-only' }, { label: 'Snacks only', value: 'snacks-only' }, { label: 'No concessions', value: 'no-concessions' }],
      },
      {
        key: 'ticket-pricing-range',
        label: 'Ticket Pricing Range',
        type: 'checkbox',
        options: [{ label: 'Under $10', value: 'under-10' }, { label: '$10-25', value: '10-25' }, { label: '$25-50', value: '25-50' }, { label: '$50-100', value: '50-100' }, { label: '$100+', value: '100' }],
      },
      {
        key: 'subscription-season-passes-available',
        label: 'Subscription / Season Passes Available',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'late-seating-policy',
        label: 'Late Seating Policy',
        type: 'checkbox',
        options: [{ label: 'Allowed until first intermission', value: 'allowed-until-first-intermission' }, { label: 'Not allowed', value: 'not-allowed' }, { label: 'Designated late seating area', value: 'designated-late-seating-area' }],
      },
      {
        key: 'age-restrictions',
        label: 'Age Restrictions',
        type: 'checkbox',
        options: [{ label: 'All ages', value: 'all-ages' }, { label: '12+', value: '12' }, { label: '16+', value: '16' }, { label: '18+', value: '18' }, { label: '21+', value: '21' }],
      }
    ],
    'music-venue': [
      {
        key: 'venue-size',
        label: 'Venue Size',
        type: 'checkbox',
        options: [{ label: 'Small club (under 200 cap)', value: 'small-club-under-200-cap' }, { label: 'Medium club (200-500)', value: 'medium-club-200-500' }, { label: 'Large club (500-1,000)', value: 'large-club-500-1-000' }, { label: 'Theater size (1,000-2,500)', value: 'theater-size-1-000-2-500' }, { label: 'Arena size (2,500-10,000)', value: 'arena-size-2-500-10-000' }, { label: 'Stadium (10,000+)', value: 'stadium-10-000' }],
      },
      {
        key: 'music-genres-hosted',
        label: 'Music Genres Hosted',
        type: 'checkbox',
        options: [{ label: 'Rock', value: 'rock' }, { label: 'Indie / alternative', value: 'indie-alternative' }, { label: 'Pop', value: 'pop' }, { label: 'Hip hop / rap', value: 'hip-hop-rap' }, { label: 'Electronic / EDM', value: 'electronic-edm' }, { label: 'Country', value: 'country' }, { label: 'Jazz', value: 'jazz' }, { label: 'Blues', value: 'blues' }, { label: 'Reggae', value: 'reggae' }, { label: 'Latin', value: 'latin' }, { label: 'Metal / hardcore', value: 'metal-hardcore' }, { label: 'Punk', value: 'punk' }, { label: 'Folk / acoustic', value: 'folk-acoustic' }, { label: 'Classical', value: 'classical' }],
      },
      {
        key: 'standing-vs-seated',
        label: 'Standing vs Seated',
        type: 'checkbox',
        options: [{ label: 'General admission (standing)', value: 'general-admission-standing' }, { label: 'Fully seated', value: 'fully-seated' }, { label: 'Mixed (GA floor + seated balcony)', value: 'mixed-ga-floor-seated-balcony' }],
      },
      {
        key: 'age-policy',
        label: 'Age Policy',
        type: 'checkbox',
        options: [{ label: 'All ages', value: 'all-ages' }, { label: '18+', value: '18' }, { label: '21+', value: '21' }, { label: 'Depends on show', value: 'depends-on-show' }],
      },
      {
        key: 'box-office',
        label: 'Box Office',
        type: 'checkbox',
        options: [{ label: 'Online only', value: 'online-only' }, { label: 'On-site (day of show)', value: 'on-site-day-of-show' }, { label: 'On-site (advance sales)', value: 'on-site-advance-sales' }],
      },
      {
        key: 're-entry-policy',
        label: 'Re-entry Policy',
        type: 'checkbox',
        options: [{ label: 'Allowed', value: 'allowed' }, { label: 'Not allowed', value: 'not-allowed' }],
      },
      {
        key: 'coat-check',
        label: 'Coat Check',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'earplugs-available',
        label: 'Earplugs Available',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: 'For sale', value: 'for-sale' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'ada-accommodations',
        label: 'ADA Accommodations',
        type: 'checkbox',
        options: [{ label: 'Viewing platform', value: 'viewing-platform' }, { label: 'Accessible restrooms', value: 'accessible-restrooms' }, { label: 'Sign language interpretation (select shows)', value: 'sign-language-interpretation-select-shows' }, { label: 'Assisted listening devices', value: 'assisted-listening-devices' }],
      },
      {
        key: 'merchandise',
        label: 'Merchandise',
        type: 'checkbox',
        options: [{ label: 'On-site merch booth', value: 'on-site-merch-booth' }, { label: 'Artist merch only', value: 'artist-merch-only' }, { label: 'Venue merch available', value: 'venue-merch-available' }],
      }
    ],
    'bachelor-bachelorette': [
      {
        key: 'event-type',
        label: 'Event Type',
        type: 'checkbox',
        options: [{ label: 'Bachelor party', value: 'bachelor-party' }, { label: 'Bachelorette party', value: 'bachelorette-party' }, { label: 'Co-ed / joint party', value: 'co-ed-joint-party' }],
      },
      {
        key: 'activity-focus',
        label: 'Activity Focus',
        type: 'checkbox',
        options: [{ label: 'Nightlife / bar crawl', value: 'nightlife-bar-crawl' }, { label: 'Spa / relaxation', value: 'spa-relaxation' }, { label: 'Adventure / outdoor', value: 'adventure-outdoor' }, { label: 'Pool / beach day', value: 'pool-beach-day' }, { label: 'Private chef / dinner', value: 'private-chef-dinner' }, { label: 'Cabaret / drag show', value: 'cabaret-drag-show' }, { label: 'Male revue / strippers', value: 'male-revue-strippers' }, { label: 'Female revue / strippers', value: 'female-revue-strippers' }, { label: 'Pole dancing class', value: 'pole-dancing-class' }, { label: 'Cocktail making class', value: 'cocktail-making-class' }, { label: 'Painting / craft class', value: 'painting-craft-class' }, { label: 'Boating / yacht party', value: 'boating-yacht-party' }, { label: 'Camping / glamping', value: 'camping-glamping' }],
      },
      {
        key: 'group-size',
        label: 'Group Size',
        type: 'checkbox',
        options: [{ label: 'Small (4-6)', value: 'small-4-6' }, { label: 'Medium (7-10)', value: 'medium-7-10' }, { label: 'Large (11-15)', value: 'large-11-15' }, { label: 'Extra large (16-20)', value: 'extra-large-16-20' }, { label: 'Massive (20+)', value: 'massive-20' }],
      },
      {
        key: 'accommodations-included',
        label: 'Accommodations Included',
        type: 'checkbox',
        options: [{ label: 'Yes (hotel block)', value: 'yes-hotel-block' }, { label: 'Yes (rental house)', value: 'yes-rental-house' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'transportation-included',
        label: 'Transportation Included',
        type: 'checkbox',
        options: [{ label: 'Party bus', value: 'party-bus' }, { label: 'Limo', value: 'limo' }, { label: 'Sprinter van', value: 'sprinter-van' }, { label: 'Boat / yacht', value: 'boat-yacht' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'custom-sashes-apparel-available',
        label: 'Custom Sashes / Apparel Available',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'photographer-videographer-available',
        label: 'Photographer / Videographer Available',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      }
    ],
    'cigar-bar': [
      {
        key: 'cigar-selection',
        label: 'Cigar Selection',
        type: 'checkbox',
        options: [{ label: 'Small (under 50 types)', value: 'small-under-50-types' }, { label: 'Medium (50-150)', value: 'medium-50-150' }, { label: 'Large (150-300)', value: 'large-150-300' }, { label: 'Extensive (300+)', value: 'extensive-300' }],
      },
      {
        key: 'bring-your-own-cigar',
        label: 'Bring Your Own Cigar',
        type: 'checkbox',
        options: [{ label: 'Allowed (cutting fee)', value: 'allowed-cutting-fee' }, { label: 'Allowed (no fee)', value: 'allowed-no-fee' }, { label: 'Not allowed', value: 'not-allowed' }],
      },
      {
        key: 'humidor-access',
        label: 'Humidor Access',
        type: 'checkbox',
        options: [{ label: 'Walk-in humidor', value: 'walk-in-humidor' }, { label: 'Cabinet humidor', value: 'cabinet-humidor' }, { label: 'Display only', value: 'display-only' }],
      },
      {
        key: 'lounge-seating',
        label: 'Lounge Seating',
        type: 'checkbox',
        options: [{ label: 'First come, first served', value: 'first-come-first-served' }, { label: 'Reservation required (groups)', value: 'reservation-required-groups' }, { label: 'VIP section available', value: 'vip-section-available' }],
      },
      {
        key: 'ventilation-system',
        label: 'Ventilation System',
        type: 'checkbox',
        options: [{ label: 'Excellent (no smoke smell on clothes)', value: 'excellent-no-smoke-smell-on-clothes' }, { label: 'Good', value: 'good' }, { label: 'Fair (smoky)', value: 'fair-smoky' }, { label: 'Outdoor only', value: 'outdoor-only' }],
      },
      {
        key: 'bar-service',
        label: 'Bar Service',
        type: 'checkbox',
        options: [{ label: 'Full bar', value: 'full-bar' }, { label: 'Beer & wine only', value: 'beer-wine-only' }, { label: 'No alcohol (BYOB allowed)', value: 'no-alcohol-byob-allowed' }, { label: 'No alcohol (not allowed)', value: 'no-alcohol-not-allowed' }],
      },
      {
        key: 'food-available',
        label: 'Food Available',
        type: 'checkbox',
        options: [{ label: 'Full kitchen', value: 'full-kitchen' }, { label: 'Bar snacks', value: 'bar-snacks' }, { label: 'Outside food allowed', value: 'outside-food-allowed' }, { label: 'No food', value: 'no-food' }],
      },
      {
        key: 'membership-required',
        label: 'Membership Required',
        type: 'checkbox',
        options: [{ label: 'Yes (annual)', value: 'yes-annual' }, { label: 'Yes (daily pass)', value: 'yes-daily-pass' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'lockers-available-for-members',
        label: 'Lockers Available for Members',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      }
    ],
    'cocktail-bar': [
      {
        key: 'bar-vibe',
        label: 'Bar Vibe',
        type: 'checkbox',
        options: [{ label: 'Speakeasy / hidden', value: 'speakeasy-hidden' }, { label: 'Rooftop', value: 'rooftop' }, { label: 'Dive bar (but craft)', value: 'dive-bar-but-craft' }, { label: 'Tiki bar', value: 'tiki-bar' }, { label: 'Hotel bar', value: 'hotel-bar' }, { label: 'Neighborhood bar', value: 'neighborhood-bar' }, { label: 'Lounge', value: 'lounge' }, { label: 'Wine bar (also cocktails)', value: 'wine-bar-also-cocktails' }],
      },
      {
        key: 'cocktail-style',
        label: 'Cocktail Style',
        type: 'checkbox',
        options: [{ label: 'Classic / traditional', value: 'classic-traditional' }, { label: 'Modern / avant-garde', value: 'modern-avant-garde' }, { label: 'Tiki / tropical', value: 'tiki-tropical' }, { label: 'Low ABV / session', value: 'low-abv-session' }, { label: 'Spirit-forward', value: 'spirit-forward' }, { label: 'Seasonal / rotating menu', value: 'seasonal-rotating-menu' }],
      },
      {
        key: 'menu-size',
        label: 'Menu Size',
        type: 'checkbox',
        options: [{ label: 'Small (5-10 signature)', value: 'small-5-10-signature' }, { label: 'Medium (10-20)', value: 'medium-10-20' }, { label: 'Large (20-40)', value: 'large-20-40' }, { label: 'Extensive (40+)', value: 'extensive-40' }],
      },
      {
        key: 'bartender-expertise',
        label: 'Bartender Expertise',
        type: 'checkbox',
        options: [{ label: 'Standard', value: 'standard' }, { label: 'Advanced (house syrups, infusions)', value: 'advanced-house-syrups-infusions' }, { label: 'World class (award winning)', value: 'world-class-award-winning' }],
      },
      {
        key: 'reservations',
        label: 'Reservations',
        type: 'checkbox',
        options: [{ label: 'Walk-ins only', value: 'walk-ins-only' }, { label: 'Reservations recommended', value: 'reservations-recommended' }, { label: 'Reservations required', value: 'reservations-required' }, { label: 'Limited walk-in availability', value: 'limited-walk-in-availability' }],
      },
      {
        key: 'dress-code',
        label: 'Dress Code',
        type: 'checkbox',
        options: [{ label: 'Casual', value: 'casual' }, { label: 'Smart casual', value: 'smart-casual' }, { label: 'Business casual', value: 'business-casual' }, { label: 'Formal', value: 'formal' }, { label: 'No athletic wear', value: 'no-athletic-wear' }, { label: 'No hats', value: 'no-hats' }],
      },
      {
        key: 'happy-hour',
        label: 'Happy Hour',
        type: 'checkbox',
        options: [{ label: 'Yes (daily)', value: 'yes-daily' }, { label: 'Yes (weekdays only)', value: 'yes-weekdays-only' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'live-music-dj',
        label: 'Live Music / DJ',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'private-event-space',
        label: 'Private Event Space',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      }
    ],
    'sports-bar': [
      {
        key: 'game-viewing',
        label: 'Game Viewing',
        type: 'checkbox',
        options: [{ label: 'Number of TVs: ___', value: 'number-of-tvs' }, { label: 'Giant projector screen', value: 'giant-projector-screen' }, { label: 'Multiple viewing areas', value: 'multiple-viewing-areas' }, { label: 'Outdoor TV viewing', value: 'outdoor-tv-viewing' }],
      },
      {
        key: 'sports-packages',
        label: 'Sports Packages',
        type: 'checkbox',
        options: [{ label: 'NFL Sunday Ticket', value: 'nfl-sunday-ticket' }, { label: 'NBA League Pass', value: 'nba-league-pass' }, { label: 'MLB Extra Innings', value: 'mlb-extra-innings' }, { label: 'NHL Center Ice', value: 'nhl-center-ice' }, { label: 'Soccer (various leagues)', value: 'soccer-various-leagues' }, { label: 'UFC / PPV events', value: 'ufc-ppv-events' }, { label: 'College sports', value: 'college-sports' }],
      },
      {
        key: 'audio',
        label: 'Audio',
        type: 'checkbox',
        options: [{ label: 'Game audio on main screens', value: 'game-audio-on-main-screens' }, { label: 'Personal speakers at tables', value: 'personal-speakers-at-tables' }, { label: 'Quiet during commercials', value: 'quiet-during-commercials' }, { label: 'Music only (no game audio)', value: 'music-only-no-game-audio' }],
      },
      {
        key: 'bar-food-type',
        label: 'Bar Food Type',
        type: 'checkbox',
        options: [{ label: 'Standard (wings, burgers, fries)', value: 'standard-wings-burgers-fries' }, { label: 'Elevated gastropub', value: 'elevated-gastropub' }, { label: 'Pizza focus', value: 'pizza-focus' }, { label: 'BBQ focus', value: 'bbq-focus' }, { label: 'Nachos / Mexican focus', value: 'nachos-mexican-focus' }],
      },
      {
        key: 'game-day-specials',
        label: 'Game Day Specials',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'pool-tables',
        label: 'Pool Tables',
        type: 'checkbox',
        options: [{ label: 'Yes (number: ___) / No', value: 'yes-number-no' }],
      },
      {
        key: 'darts',
        label: 'Darts',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'arcade-games',
        label: 'Arcade Games',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'outdoor-seating',
        label: 'Outdoor Seating',
        type: 'checkbox',
        options: [{ label: 'Yes (with TVs)', value: 'yes-with-tvs' }, { label: 'Yes (no TVs)', value: 'yes-no-tvs' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'reserved-tables-for-games',
        label: 'Reserved Tables for Games',
        type: 'checkbox',
        options: [{ label: 'Available (no fee)', value: 'available-no-fee' }, { label: 'Available (fee / min spend)', value: 'available-fee-min-spend' }, { label: 'First come, first served', value: 'first-come-first-served' }],
      }
    ],
    'sake-bar': [
      {
        key: 'sake-selection',
        label: 'Sake Selection',
        type: 'checkbox',
        options: [{ label: 'Small (under 20)', value: 'small-under-20' }, { label: 'Medium (20-50)', value: 'medium-20-50' }, { label: 'Large (50-100)', value: 'large-50-100' }, { label: 'Extensive (100+)', value: 'extensive-100' }],
      },
      {
        key: 'sake-types',
        label: 'Sake Types',
        type: 'checkbox',
        options: [{ label: 'Junmai', value: 'junmai' }, { label: 'Junmai Ginjo', value: 'junmai-ginjo' }, { label: 'Junmai Daiginjo', value: 'junmai-daiginjo' }, { label: 'Honjozo', value: 'honjozo' }, { label: 'Nigori (unfiltered)', value: 'nigori-unfiltered' }, { label: 'Sparkling sake', value: 'sparkling-sake' }, { label: 'Aged / Koshu', value: 'aged-koshu' }, { label: 'Namazake (unpasteurized)', value: 'namazake-unpasteurized' }],
      },
      {
        key: 'temperature-options',
        label: 'Temperature Options',
        type: 'checkbox',
        options: [{ label: 'Cold (reishu)', value: 'cold-reishu' }, { label: 'Room temp (joon)', value: 'room-temp-joon' }, { label: 'Warm (kan)', value: 'warm-kan' }, { label: 'Hot (atsukan)', value: 'hot-atsukan' }],
      },
      {
        key: 'tasting-flights-available',
        label: 'Tasting Flights Available',
        type: 'checkbox',
        options: [{ label: 'Yes (3 pour)', value: 'yes-3-pour' }, { label: 'Yes (5 pour)', value: 'yes-5-pour' }, { label: 'Yes (premium)', value: 'yes-premium' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'food-pairing',
        label: 'Food Pairing',
        type: 'checkbox',
        options: [{ label: 'Japanese small plates', value: 'japanese-small-plates' }, { label: 'Sushi / sashimi', value: 'sushi-sashimi' }, { label: 'Izakaya style', value: 'izakaya-style' }, { label: 'Cheese pairings', value: 'cheese-pairings' }, { label: 'Chocolate pairings', value: 'chocolate-pairings' }, { label: 'No food', value: 'no-food' }],
      },
      {
        key: 'sake-education',
        label: 'Sake Education',
        type: 'checkbox',
        options: [{ label: 'Staff training level: basic / advanced / sommelier', value: 'staff-training-level-basic-advanced-sommelier' }, { label: 'Tasting notes provided', value: 'tasting-notes-provided' }, { label: 'Brewery information available', value: 'brewery-information-available' }, { label: 'Sake tasting classes available', value: 'sake-tasting-classes-available' }],
      },
      {
        key: 'bottle-keep',
        label: 'Bottle Keep',
        type: 'checkbox',
        options: [{ label: 'Yes (store your bottle)', value: 'yes-store-your-bottle' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'membership-sake-club',
        label: 'Membership / Sake Club',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      }
    ],
    'festival': [
      {
        key: 'festival-type',
        label: 'Festival Type',
        type: 'checkbox',
        options: [{ label: 'Music festival', value: 'music-festival' }, { label: 'Food festival', value: 'food-festival' }, { label: 'Art festival', value: 'art-festival' }, { label: 'Cultural festival', value: 'cultural-festival' }, { label: 'Film festival', value: 'film-festival' }, { label: 'Beer / wine festival', value: 'beer-wine-festival' }, { label: 'Renaissance / medieval', value: 'renaissance-medieval' }, { label: 'Holiday festival', value: 'holiday-festival' }, { label: 'Harvest festival', value: 'harvest-festival' }, { label: 'Flower festival', value: 'flower-festival' }],
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'checkbox',
        options: [{ label: 'Single day', value: 'single-day' }, { label: '2 days', value: '2-days' }, { label: '3 days', value: '3-days' }, { label: '4-7 days', value: '4-7-days' }, { label: '1-2 weeks', value: '1-2-weeks' }, { label: 'Month-long', value: 'month-long' }],
      },
      {
        key: 'camping-available',
        label: 'Camping Available',
        type: 'checkbox',
        options: [{ label: 'No camping', value: 'no-camping' }, { label: 'Tent camping', value: 'tent-camping' }, { label: 'RV camping', value: 'rv-camping' }, { label: 'Glamping', value: 'glamping' }, { label: 'On-site only', value: 'on-site-only' }, { label: 'Nearby campground', value: 'nearby-campground' }],
      },
      {
        key: 'headliners-announced',
        label: 'Headliners Announced',
        type: 'checkbox',
        options: [{ label: 'Yes (see lineup)', value: 'yes-see-lineup' }, { label: 'Partial lineup', value: 'partial-lineup' }, { label: 'TBA', value: 'tba' }],
      },
      {
        key: 're-entry-policy',
        label: 'Re-entry Policy',
        type: 'checkbox',
        options: [{ label: 'Allowed', value: 'allowed' }, { label: 'Not allowed', value: 'not-allowed' }, { label: 'Re-entry with hand stamp / wristband', value: 're-entry-with-hand-stamp-wristband' }],
      },
      {
        key: 'lockers-available',
        label: 'Lockers Available',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'atm-on-site',
        label: 'ATM on Site',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }, { label: 'Card only (no cash)', value: 'card-only-no-cash' }],
      }
    ],
    'fair': [
      {
        key: 'fair-type',
        label: 'Fair Type',
        type: 'checkbox',
        options: [{ label: 'County fair', value: 'county-fair' }, { label: 'State fair', value: 'state-fair' }, { label: 'Agricultural fair', value: 'agricultural-fair' }, { label: 'Carnival / midway only', value: 'carnival-midway-only' }, { label: 'Street fair', value: 'street-fair' }, { label: 'Craft fair', value: 'craft-fair' }, { label: 'Science fair', value: 'science-fair' }, { label: 'Job fair', value: 'job-fair' }],
      },
      {
        key: 'rides',
        label: 'Rides',
        type: 'checkbox',
        options: [{ label: 'None', value: 'none' }, { label: 'Kiddie rides only', value: 'kiddie-rides-only' }, { label: 'Full midway', value: 'full-midway' }, { label: 'Wristband available', value: 'wristband-available' }, { label: 'Pay per ride', value: 'pay-per-ride' }],
      },
      {
        key: 'games',
        label: 'Games',
        type: 'checkbox',
        options: [{ label: 'Yes (prize games)', value: 'yes-prize-games' }, { label: 'Yes (skill games)', value: 'yes-skill-games' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'livestock-exhibits',
        label: 'Livestock Exhibits',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'demo-derby',
        label: 'Demo Derby',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'rodeo',
        label: 'Rodeo',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'concerts-included-with-admission',
        label: 'Concerts Included with Admission',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Yes (separate ticket)', value: 'yes-separate-ticket' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'discount-days',
        label: 'Discount Days',
        type: 'checkbox',
        options: [{ label: 'Kids day', value: 'kids-day' }, { label: 'Senior day', value: 'senior-day' }, { label: 'Military discount', value: 'military-discount' }, { label: 'Early bird pricing', value: 'early-bird-pricing' }],
      },
      {
        key: 'ride-tickets',
        label: 'Ride Tickets',
        type: 'checkbox',
        options: [{ label: 'Sold individually', value: 'sold-individually' }, { label: 'Book of tickets', value: 'book-of-tickets' }, { label: 'Unlimited wristband', value: 'unlimited-wristband' }, { label: 'Ride pass + admission bundle', value: 'ride-pass-admission-bundle' }],
      }
    ],
    'general-festivals': [
      {
        key: 'purpose',
        label: 'Purpose',
        type: 'checkbox',
        options: [{ label: 'Community celebration', value: 'community-celebration' }, { label: 'City anniversary', value: 'city-anniversary' }, { label: 'Cultural heritage', value: 'cultural-heritage' }, { label: 'Religious holiday', value: 'religious-holiday' }, { label: 'Seasonal change', value: 'seasonal-change' }, { label: 'Fundraiser / charity', value: 'fundraiser-charity' }],
      },
      {
        key: 'parade-included',
        label: 'Parade Included',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'fireworks',
        label: 'Fireworks',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'vendor-market',
        label: 'Vendor Market',
        type: 'checkbox',
        options: [{ label: 'Yes (local)', value: 'yes-local' }, { label: 'Yes (regional)', value: 'yes-regional' }, { label: 'Yes (juried)', value: 'yes-juried' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'kids-zone',
        label: 'Kids Zone',
        type: 'checkbox',
        options: [{ label: 'Yes (inflatables, games)', value: 'yes-inflatables-games' }, { label: 'Yes (crafts, activities)', value: 'yes-crafts-activities' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'live-entertainment-stage',
        label: 'Live Entertainment Stage',
        type: 'checkbox',
        options: [{ label: 'Yes (local)', value: 'yes-local' }, { label: 'Yes (professional)', value: 'yes-professional' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'free-admission',
        label: 'Free Admission',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Suggested donation', value: 'suggested-donation' }, { label: 'Paid', value: 'paid' }],
      }
    ],
    'film-festivals-organizations': [
      {
        key: 'festival-type',
        label: 'Festival Type',
        type: 'checkbox',
        options: [{ label: 'International', value: 'international' }, { label: 'National', value: 'national' }, { label: 'Regional / local', value: 'regional-local' }, { label: 'Genre specific', value: 'genre-specific' }, { label: 'Student films', value: 'student-films' }, { label: 'Short films only', value: 'short-films-only' }, { label: 'Documentary focus', value: 'documentary-focus' }, { label: 'Animated films', value: 'animated-films' }, { label: 'Horror', value: 'horror' }, { label: 'LGBTQ+', value: 'lgbtq' }, { label: 'Women in film', value: 'women-in-film' }, { label: 'Environmental', value: 'environmental' }],
      },
      {
        key: 'submission-status',
        label: 'Submission Status',
        type: 'checkbox',
        options: [{ label: 'Open for submissions', value: 'open-for-submissions' }, { label: 'Submission deadline: ___', value: 'submission-deadline' }, { label: 'Closed (festival upcoming)', value: 'closed-festival-upcoming' }, { label: 'Festival completed (past)', value: 'festival-completed-past' }],
      },
      {
        key: 'screening-venues',
        label: 'Screening Venues',
        type: 'checkbox',
        options: [{ label: 'Single venue', value: 'single-venue' }, { label: 'Multiple venues (same city)', value: 'multiple-venues-same-city' }, { label: 'Virtual only', value: 'virtual-only' }, { label: 'Hybrid (in-person + virtual)', value: 'hybrid-in-person-virtual' }],
      },
      {
        key: 'awards-presented',
        label: 'Awards Presented',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'q-a-sessions-with-filmmakers',
        label: 'Q&A Sessions with Filmmakers',
        type: 'checkbox',
        options: [{ label: 'Yes (in person)', value: 'yes-in-person' }, { label: 'Yes (virtual)', value: 'yes-virtual' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'panels-workshops',
        label: 'Panels / Workshops',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'industry-pass-available',
        label: 'Industry Pass Available',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'film-market-networking',
        label: 'Film Market / Networking',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      }
    ],
    'music-festivals-organizations': [
      {
        key: 'genre-focus',
        label: 'Genre Focus',
        type: 'checkbox',
        options: [{ label: 'Rock / alternative', value: 'rock-alternative' }, { label: 'EDM / electronic', value: 'edm-electronic' }, { label: 'Hip hop', value: 'hip-hop' }, { label: 'Country', value: 'country' }, { label: 'Indie / folk', value: 'indie-folk' }, { label: 'Jazz', value: 'jazz' }, { label: 'Blues', value: 'blues' }, { label: 'Classical', value: 'classical' }, { label: 'Metal', value: 'metal' }, { label: 'Multi-genre', value: 'multi-genre' }],
      },
      {
        key: 'festival-size',
        label: 'Festival Size',
        type: 'checkbox',
        options: [{ label: 'Small (under 5,000)', value: 'small-under-5-000' }, { label: 'Medium (5,000-20,000)', value: 'medium-5-000-20-000' }, { label: 'Large (20,000-50,000)', value: 'large-20-000-50-000' }, { label: 'Major (50,000+)', value: 'major-50-000' }],
      },
      {
        key: 'camping',
        label: 'Camping',
        type: 'checkbox',
        options: [{ label: 'No camping', value: 'no-camping' }, { label: 'Tent camping included', value: 'tent-camping-included' }, { label: 'RV camping (extra fee)', value: 'rv-camping-extra-fee' }, { label: 'Glamping (extra fee)', value: 'glamping-extra-fee' }, { label: 'On-site only', value: 'on-site-only' }],
      },
      {
        key: 'payment-plans-available',
        label: 'Payment Plans Available',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'single-day-tickets-available',
        label: 'Single Day Tickets Available',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'vip-premium-packages',
        label: 'VIP / Premium Packages',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'after-parties',
        label: 'After Parties',
        type: 'checkbox',
        options: [{ label: 'Included with wristband', value: 'included-with-wristband' }, { label: 'Separate ticket required', value: 'separate-ticket-required' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'app-available',
        label: 'App Available',
        type: 'checkbox',
        options: [{ label: 'Yes (schedule, maps)', value: 'yes-schedule-maps' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'water-refill-stations',
        label: 'Water Refill Stations',
        type: 'checkbox',
        options: [{ label: 'Yes (free)', value: 'yes-free' }, { label: 'Yes (for sale)', value: 'yes-for-sale' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'medical-tent',
        label: 'Medical Tent',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'lost-found',
        label: 'Lost & Found',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      }
    ],
    'circus': [
      {
        key: 'circus-type',
        label: 'Circus Type',
        type: 'checkbox',
        options: [{ label: 'Traditional (animals)', value: 'traditional-animals' }, { label: 'Animal-free / humane', value: 'animal-free-humane' }, { label: 'Contemporary / Cirque style', value: 'contemporary-cirque-style' }, { label: 'Children\'s circus', value: 'children-s-circus' }, { label: 'One-ring', value: 'one-ring' }, { label: 'Three-ring', value: 'three-ring' }],
      },
      {
        key: 'acts-included',
        label: 'Acts Included',
        type: 'checkbox',
        options: [{ label: 'Aerial silks / lyra', value: 'aerial-silks-lyra' }, { label: 'Trapeze', value: 'trapeze' }, { label: 'Tightrope / high wire', value: 'tightrope-high-wire' }, { label: 'Juggling', value: 'juggling' }, { label: 'Acrobatics / tumbling', value: 'acrobatics-tumbling' }, { label: 'Clowns', value: 'clowns' }, { label: 'Contortion', value: 'contortion' }, { label: 'Fire breather', value: 'fire-breather' }, { label: 'Knife throwing', value: 'knife-throwing' }, { label: 'Animal acts (specify)', value: 'animal-acts-specify' }],
      },
      {
        key: 'show-length',
        label: 'Show Length',
        type: 'checkbox',
        options: [{ label: 'Under 60 min', value: 'under-60-min' }, { label: '60-90 min', value: '60-90-min' }, { label: '90-120 min', value: '90-120-min' }, { label: '2+ hours with intermission', value: '2-hours-with-intermission' }],
      },
      {
        key: 'intermission',
        label: 'Intermission',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'audience-participation',
        label: 'Audience Participation',
        type: 'checkbox',
        options: [{ label: 'Yes (clown interaction)', value: 'yes-clown-interaction' }, { label: 'Yes (volunteers on stage)', value: 'yes-volunteers-on-stage' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'tent-or-building',
        label: 'Tent or Building',
        type: 'checkbox',
        options: [{ label: 'Traditional big top tent', value: 'traditional-big-top-tent' }, { label: 'Indoor arena / theater', value: 'indoor-arena-theater' }, { label: 'Outdoor (no tent)', value: 'outdoor-no-tent' }, { label: 'Climate controlled', value: 'climate-controlled' }],
      },
      {
        key: 'pre-show-activities',
        label: 'Pre-Show Activities',
        type: 'checkbox',
        options: [{ label: 'Face painting', value: 'face-painting' }, { label: 'Merchandise', value: 'merchandise' }, { label: 'Meet the performers', value: 'meet-the-performers' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'under-2-admission',
        label: 'Under 2 Admission',
        type: 'checkbox',
        options: [{ label: 'Free on lap', value: 'free-on-lap' }, { label: 'Paid ticket required', value: 'paid-ticket-required' }, { label: 'Not recommended', value: 'not-recommended' }],
      }
    ],
    'caterer': [
      {
        key: 'event-types-specialized',
        label: 'Event Types Specialized',
        type: 'checkbox',
        options: [{ label: 'Weddings', value: 'weddings' }, { label: 'Corporate lunches', value: 'corporate-lunches' }, { label: 'Galas / fundraisers', value: 'galas-fundraisers' }, { label: 'Birthday parties', value: 'birthday-parties' }, { label: 'Holiday parties', value: 'holiday-parties' }, { label: 'Baby / bridal showers', value: 'baby-bridal-showers' }, { label: 'Funerals / memorials', value: 'funerals-memorials' }, { label: 'Buffet style', value: 'buffet-style' }, { label: 'Plated dinners', value: 'plated-dinners' }, { label: 'Family style', value: 'family-style' }, { label: 'Food stations', value: 'food-stations' }, { label: 'Cocktail reception / hors d\'oeuvres', value: 'cocktail-reception-hors-d-oeuvres' }],
      },
      {
        key: 'staff-attire',
        label: 'Staff Attire',
        type: 'checkbox',
        options: [{ label: 'Black tie / formal', value: 'black-tie-formal' }, { label: 'Business casual', value: 'business-casual' }, { label: 'Uniform (branded)', value: 'uniform-branded' }, { label: 'Casual (t-shirt / jeans)', value: 'casual-t-shirt-jeans' }],
      },
      {
        key: 'rentals-included',
        label: 'Rentals Included',
        type: 'checkbox',
        options: [{ label: 'Tables', value: 'tables' }, { label: 'Chairs', value: 'chairs' }, { label: 'Linens', value: 'linens' }, { label: 'Dinnerware (plates, silverware)', value: 'dinnerware-plates-silverware' }, { label: 'Glassware', value: 'glassware' }, { label: 'Chafing dishes / warmers', value: 'chafing-dishes-warmers' }, { label: 'Serving utensils', value: 'serving-utensils' }, { label: 'None (rent separately)', value: 'none-rent-separately' }],
      },
      {
        key: 'on-site-cooking',
        label: 'On-Site Cooking',
        type: 'checkbox',
        options: [{ label: 'Full kitchen on-site', value: 'full-kitchen-on-site' }, { label: 'Outdoor grilling / BBQ', value: 'outdoor-grilling-bbq' }, { label: 'Food truck style', value: 'food-truck-style' }, { label: 'Prep only (no cooking on-site)', value: 'prep-only-no-cooking-on-site' }, { label: 'Reheat only', value: 'reheat-only' }],
      },
      {
        key: 'leftovers',
        label: 'Leftovers',
        type: 'checkbox',
        options: [{ label: 'Client keeps', value: 'client-keeps' }, { label: 'Staff packs for client', value: 'staff-packs-for-client' }, { label: 'Donated (arranged)', value: 'donated-arranged' }, { label: 'Discarded', value: 'discarded' }],
      },
      {
        key: 'beverage-service',
        label: 'Beverage Service',
        type: 'checkbox',
        options: [{ label: 'Water / lemonade / tea only', value: 'water-lemonade-tea-only' }, { label: 'Coffee service available', value: 'coffee-service-available' }, { label: 'Soft drinks available', value: 'soft-drinks-available' }, { label: 'Bartending available (extra)', value: 'bartending-available-extra' }, { label: 'Bring your own (no service)', value: 'bring-your-own-no-service' }],
      },
      {
        key: 'license-insurance',
        label: 'License & Insurance',
        type: 'checkbox',
        options: [{ label: 'Fully licensed', value: 'fully-licensed' }, { label: 'Liability insurance on file', value: 'liability-insurance-on-file' }, { label: 'Health department certified', value: 'health-department-certified' }],
      }
    ],
    'personal-chef': [
      {
        key: 'service-type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'Daily / weekly meal prep (off-site)', value: 'daily-weekly-meal-prep-off-site' }, { label: 'In-home private dinner', value: 'in-home-private-dinner' }, { label: 'In-home dinner party (small group)', value: 'in-home-dinner-party-small-group' }, { label: 'In-home dinner party (large group)', value: 'in-home-dinner-party-large-group' }, { label: 'Cooking class + dinner', value: 'cooking-class-dinner' }, { label: 'Multi-day event (vacation rental)', value: 'multi-day-event-vacation-rental' }],
      },
      {
        key: 'meals-per-week',
        label: 'Meals Per Week',
        type: 'checkbox',
        options: [{ label: '1-2 meals', value: '1-2-meals' }, { label: '3-4 meals', value: '3-4-meals' }, { label: '5-6 meals', value: '5-6-meals' }, { label: '7+ meals', value: '7-meals' }],
      },
      {
        key: 'dietary-focus',
        label: 'Dietary Focus',
        type: 'checkbox',
        options: [{ label: 'Weight loss / portion control', value: 'weight-loss-portion-control' }, { label: 'Athletic performance', value: 'athletic-performance' }, { label: 'Keto / low carb', value: 'keto-low-carb' }, { label: 'Paleo / whole30', value: 'paleo-whole30' }, { label: 'Plant-based / vegan', value: 'plant-based-vegan' }, { label: 'Family-friendly / picky eaters', value: 'family-friendly-picky-eaters' }, { label: 'Allergy-friendly kitchen', value: 'allergy-friendly-kitchen' }],
      },
      {
        key: 'grocery-shopping',
        label: 'Grocery Shopping',
        type: 'checkbox',
        options: [{ label: 'Chef shops (added fee)', value: 'chef-shops-added-fee' }, { label: 'Client provides groceries', value: 'client-provides-groceries' }, { label: 'Grocery delivery arranged', value: 'grocery-delivery-arranged' }],
      },
      {
        key: 'kitchen-requirements',
        label: 'Kitchen Requirements',
        type: 'checkbox',
        options: [{ label: 'Standard home kitchen (stove, oven, fridge)', value: 'standard-home-kitchen-stove-oven-fridge' }, { label: 'Outdoor grill only', value: 'outdoor-grill-only' }, { label: 'Minimal cooking (no oven required)', value: 'minimal-cooking-no-oven-required' }, { label: 'Client must have specific equipment', value: 'client-must-have-specific-equipment' }],
      },
      {
        key: 'plating-presentation',
        label: 'Plating / Presentation',
        type: 'checkbox',
        options: [{ label: 'Basic (family style)', value: 'basic-family-style' }, { label: 'Elevated (plated individually)', value: 'elevated-plated-individually' }, { label: 'Fine dining presentation', value: 'fine-dining-presentation' }],
      },
      {
        key: 'cleanup',
        label: 'Cleanup',
        type: 'checkbox',
        options: [{ label: 'Full kitchen cleanup', value: 'full-kitchen-cleanup' }, { label: 'Basic wipe-down', value: 'basic-wipe-down' }, { label: 'No cleanup (client handles)', value: 'no-cleanup-client-handles' }],
      },
      {
        key: 'recipe-cards-provided',
        label: 'Recipe Cards Provided',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'overnight-leftovers-storage',
        label: 'Overnight Leftovers Storage',
        type: 'checkbox',
        options: [{ label: 'Yes (chef portions)', value: 'yes-chef-portions' }, { label: 'Yes (chef leaves instructions)', value: 'yes-chef-leaves-instructions' }, { label: 'No', value: 'no' }],
      }
    ],
    'bartender': [
      {
        key: 'service-type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'Event bartending only', value: 'event-bartending-only' }, { label: 'Mobile bar (equipment included)', value: 'mobile-bar-equipment-included' }, { label: 'Mobile bar + barback', value: 'mobile-bar-barback' }, { label: 'Consultation only (client provides bar)', value: 'consultation-only-client-provides-bar' }],
      },
      {
        key: 'alcohol-service',
        label: 'Alcohol Service',
        type: 'checkbox',
        options: [{ label: 'Full bar (liquor, beer, wine)', value: 'full-bar-liquor-beer-wine' }, { label: 'Beer & wine only', value: 'beer-wine-only' }, { label: 'Signature cocktails only', value: 'signature-cocktails-only' }, { label: 'Non-alcoholic only (mocktails)', value: 'non-alcoholic-only-mocktails' }],
      },
      {
        key: 'alcohol-provided-by',
        label: 'Alcohol Provided By',
        type: 'checkbox',
        options: [{ label: 'Bartender provides (client pays)', value: 'bartender-provides-client-pays' }, { label: 'Client provides (bartender serves)', value: 'client-provides-bartender-serves' }, { label: 'Split (some provided, some client)', value: 'split-some-provided-some-client' }],
      },
      {
        key: 'licenses-held',
        label: 'Licenses Held',
        type: 'checkbox',
        options: [{ label: 'TIPS certified', value: 'tips-certified' }, { label: 'ServSafe alcohol certified', value: 'servsafe-alcohol-certified' }, { label: 'State bartending license', value: 'state-bartending-license' }, { label: 'Liability insurance', value: 'liability-insurance' }],
      },
      {
        key: 'number-of-bartenders',
        label: 'Number of Bartenders',
        type: 'checkbox',
        options: [{ label: '1 bartender (up to 75 guests)', value: '1-bartender-up-to-75-guests' }, { label: '2 bartenders (75-150 guests)', value: '2-bartenders-75-150-guests' }, { label: '3+ bartenders (150+ guests)', value: '3-bartenders-150-guests' }, { label: 'Client chooses number', value: 'client-chooses-number' }],
      },
      {
        key: 'bar-equipment-provided',
        label: 'Bar Equipment Provided',
        type: 'checkbox',
        options: [{ label: 'Portable bar table', value: 'portable-bar-table' }, { label: 'Ice chests / coolers', value: 'ice-chests-coolers' }, { label: 'Shakers, strainers, jiggers', value: 'shakers-strainers-jiggers' }, { label: 'Glassware (assorted)', value: 'glassware-assorted' }, { label: 'Garnish trays', value: 'garnish-trays' }, { label: 'Ice included', value: 'ice-included' }, { label: 'Napkins / straws', value: 'napkins-straws' }],
      },
      {
        key: 'cash-bar-vs-open-bar',
        label: 'Cash Bar vs Open Bar',
        type: 'checkbox',
        options: [{ label: 'Open bar (host pays)', value: 'open-bar-host-pays' }, { label: 'Cash bar (guests pay)', value: 'cash-bar-guests-pay' }, { label: 'Ticket bar (host provides drink tickets)', value: 'ticket-bar-host-provides-drink-tickets' }, { label: 'Hybrid (open beer/wine, cash liquor)', value: 'hybrid-open-beer-wine-cash-liquor' }],
      },
      {
        key: 'last-call-service',
        label: 'Last Call Service',
        type: 'checkbox',
        options: [{ label: 'Yes (announced)', value: 'yes-announced' }, { label: 'Yes (silent)', value: 'yes-silent' }, { label: 'No (serving until end time)', value: 'no-serving-until-end-time' }],
      }
    ],
    'bakery': [
      {
        key: 'bakery-type',
        label: 'Bakery Type',
        type: 'checkbox',
        options: [{ label: 'Retail bakery (walk-in)', value: 'retail-bakery-walk-in' }, { label: 'Wholesale bakery (B2B)', value: 'wholesale-bakery-b2b' }, { label: 'Custom cake studio', value: 'custom-cake-studio' }, { label: 'Cottage bakery (home-based)', value: 'cottage-bakery-home-based' }, { label: 'Vegan / allergen-free bakery', value: 'vegan-allergen-free-bakery' }, { label: 'Gluten-free dedicated', value: 'gluten-free-dedicated' }, { label: 'Kosher bakery', value: 'kosher-bakery' }, { label: 'French / patisserie', value: 'french-patisserie' }],
      },
      {
        key: 'products-offered',
        label: 'Products Offered',
        type: 'checkbox',
        options: [{ label: 'Wedding cakes', value: 'wedding-cakes' }, { label: 'Birthday cakes', value: 'birthday-cakes' }, { label: 'Cupcakes', value: 'cupcakes' }, { label: 'Cookies', value: 'cookies' }, { label: 'Brownies / bars', value: 'brownies-bars' }, { label: 'Pies / tarts', value: 'pies-tarts' }, { label: 'Pastries / croissants', value: 'pastries-croissants' }, { label: 'Breads / baguettes', value: 'breads-baguettes' }, { label: 'Doughnuts', value: 'doughnuts' }, { label: 'Muffins / scones', value: 'muffins-scones' }, { label: 'Macarons', value: 'macarons' }, { label: 'Cake pops', value: 'cake-pops' }, { label: 'Dessert tables / grazing', value: 'dessert-tables-grazing' }],
      },
      {
        key: 'custom-cake-lead-time',
        label: 'Custom Cake Lead Time',
        type: 'checkbox',
        options: [{ label: '1 week', value: '1-week' }, { label: '2 weeks', value: '2-weeks' }, { label: '1 month', value: '1-month' }, { label: '2+ months (wedding cakes)', value: '2-months-wedding-cakes' }, { label: 'Rush orders available (fee)', value: 'rush-orders-available-fee' }],
      },
      {
        key: 'tasting-box-available',
        label: 'Tasting Box Available',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: 'Paid ($___)', value: 'paid' }, { label: 'Available for wedding couples', value: 'available-for-wedding-couples' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'dietary-options',
        label: 'Dietary Options',
        type: 'checkbox',
        options: [{ label: 'Vegan', value: 'vegan' }, { label: 'Gluten-free (dedicated facility)', value: 'gluten-free-dedicated-facility' }, { label: 'Gluten-free (shared facility)', value: 'gluten-free-shared-facility' }, { label: 'Dairy-free', value: 'dairy-free' }, { label: 'Nut-free (dedicated facility)', value: 'nut-free-dedicated-facility' }, { label: 'Nut-free (shared facility)', value: 'nut-free-shared-facility' }, { label: 'Sugar-free / low sugar', value: 'sugar-free-low-sugar' }, { label: 'Keto friendly', value: 'keto-friendly' }],
      },
      {
        key: 'delivery',
        label: 'Delivery',
        type: 'checkbox',
        options: [{ label: 'Local delivery available (fee)', value: 'local-delivery-available-fee' }, { label: 'Pickup only', value: 'pickup-only' }, { label: 'Shipping available (nationwide)', value: 'shipping-available-nationwide' }, { label: 'Shipping (regional only)', value: 'shipping-regional-only' }],
      },
      {
        key: 'minimum-order',
        label: 'Minimum Order',
        type: 'checkbox',
        options: [{ label: 'No minimum', value: 'no-minimum' }, { label: '$25 minimum', value: '25-minimum' }, { label: '$50 minimum', value: '50-minimum' }, { label: '$100 minimum (custom cakes)', value: '100-minimum-custom-cakes' }],
      },
      {
        key: 'allergen-protocols',
        label: 'Allergen Protocols',
        type: 'checkbox',
        options: [{ label: 'Dedicated equipment', value: 'dedicated-equipment' }, { label: 'Cross-contamination possible', value: 'cross-contamination-possible' }, { label: 'Labeled allergens only', value: 'labeled-allergens-only' }, { label: 'Consult for severe allergies', value: 'consult-for-severe-allergies' }],
      },
      {
        key: 'custom-decorating',
        label: 'Custom Decorating',
        type: 'checkbox',
        options: [{ label: 'Buttercream', value: 'buttercream' }, { label: 'Fondant', value: 'fondant' }, { label: 'Semi-naked / rustic', value: 'semi-naked-rustic' }, { label: 'Fresh flowers (client provides)', value: 'fresh-flowers-client-provides' }, { label: 'Sugar flowers', value: 'sugar-flowers' }, { label: 'Painted / watercolor', value: 'painted-watercolor' }, { label: 'Metallic / gold leaf', value: 'metallic-gold-leaf' }, { label: 'Character / themed', value: 'character-themed' }, { label: 'Photo / edible image', value: 'photo-edible-image' }],
      },
      {
        key: 'tiered-cake-experience',
        label: 'Tiered Cake Experience',
        type: 'checkbox',
        options: [{ label: 'Beginner (1-2 tiers)', value: 'beginner-1-2-tiers' }, { label: 'Intermediate (3-4 tiers)', value: 'intermediate-3-4-tiers' }, { label: 'Expert (5+ tiers)', value: 'expert-5-tiers' }, { label: 'Structural specialist', value: 'structural-specialist' }],
      }
    ],
    'food-truck': [
      {
        key: 'cuisine-focus',
        label: 'Cuisine Focus',
        type: 'checkbox',
        options: [{ label: 'Burgers / sandwiches', value: 'burgers-sandwiches' }, { label: 'Tacos / Mexican', value: 'tacos-mexican' }, { label: 'Pizza', value: 'pizza' }, { label: 'BBQ / smoked meats', value: 'bbq-smoked-meats' }, { label: 'Asian fusion', value: 'asian-fusion' }, { label: 'Seafood', value: 'seafood' }, { label: 'Grilled cheese', value: 'grilled-cheese' }, { label: 'Lobster rolls', value: 'lobster-rolls' }, { label: 'Ice cream / desserts', value: 'ice-cream-desserts' }, { label: 'Coffee / breakfast', value: 'coffee-breakfast' }, { label: 'Vegan / plant-based', value: 'vegan-plant-based' }, { label: 'Mediterranean', value: 'mediterranean' }, { label: 'Philly cheesesteaks', value: 'philly-cheesesteaks' }, { label: 'Hot dogs / sausages', value: 'hot-dogs-sausages' }, { label: 'Arepas / empanadas', value: 'arepas-empanadas' }, { label: 'Noodles / ramen', value: 'noodles-ramen' }, { label: 'Fried chicken', value: 'fried-chicken' }],
      },
      {
        key: 'booking-types',
        label: 'Booking Types',
        type: 'checkbox',
        options: [{ label: 'Private events (weddings, parties)', value: 'private-events-weddings-parties' }, { label: 'Corporate catering', value: 'corporate-catering' }, { label: 'Film / production sets', value: 'film-production-sets' }, { label: 'Brewery / bar partnerships', value: 'brewery-bar-partnerships' }, { label: 'Lunch service (office parks)', value: 'lunch-service-office-parks' }, { label: 'Farmers markets', value: 'farmers-markets' }, { label: 'Festival / fair bookings', value: 'festival-fair-bookings' }],
      },
      {
        key: 'minimum-spend',
        label: 'Minimum Spend',
        type: 'checkbox',
        options: [{ label: 'No minimum', value: 'no-minimum' }, { label: '$250-500', value: '250-500' }, { label: '$500-1,000', value: '500-1-000' }, { label: '$1,000-2,000', value: '1-000-2-000' }, { label: '$2,000+', value: '2-000' }],
      },
      {
        key: 'per-person-pricing',
        label: 'Per Person Pricing',
        type: 'checkbox',
        options: [{ label: 'Under $10', value: 'under-10' }, { label: '$10-15', value: '10-15' }, { label: '$15-20', value: '15-20' }, { label: '$20+', value: '20' }],
      },
      {
        key: 'guests-served-per-hour',
        label: 'Guests Served Per Hour',
        type: 'checkbox',
        options: [{ label: 'Under 50', value: 'under-50' }, { label: '50-100', value: '50-100' }, { label: '100-150', value: '100-150' }, { label: '150-200', value: '150-200' }, { label: '200+', value: '200' }],
      },
      {
        key: 'power-requirements',
        label: 'Power Requirements',
        type: 'checkbox',
        options: [{ label: 'Self-powered (generator)', value: 'self-powered-generator' }, { label: 'Needs electrical hookup', value: 'needs-electrical-hookup' }, { label: 'Can run on batteries only', value: 'can-run-on-batteries-only' }],
      },
      {
        key: 'space-requirements',
        label: 'Space Requirements',
        type: 'checkbox',
        options: [{ label: 'Under 20 ft length', value: 'under-20-ft-length' }, { label: '20-30 ft length', value: '20-30-ft-length' }, { label: '30+ ft length', value: '30-ft-length' }, { label: 'Needs additional space for seating / line', value: 'needs-additional-space-for-seating-line' }],
      },
      {
        key: 'setup-time',
        label: 'Setup Time',
        type: 'checkbox',
        options: [{ label: '15 minutes or less', value: '15-minutes-or-less' }, { label: '30 minutes', value: '30-minutes' }, { label: '1 hour', value: '1-hour' }, { label: '1+ hours', value: '1-hours' }],
      },
      {
        key: 'breakdown-time',
        label: 'Breakdown Time',
        type: 'checkbox',
        options: [{ label: '15 minutes or less', value: '15-minutes-or-less' }, { label: '30 minutes', value: '30-minutes' }, { label: '1 hour', value: '1-hour' }],
      },
      {
        key: 'weather-dependent',
        label: 'Weather Dependent',
        type: 'checkbox',
        options: [{ label: 'Yes (rain cancels)', value: 'yes-rain-cancels' }, { label: 'Partial (light rain ok)', value: 'partial-light-rain-ok' }, { label: 'No (fully enclosed service window)', value: 'no-fully-enclosed-service-window' }],
      },
      {
        key: 'staff-included',
        label: 'Staff Included',
        type: 'checkbox',
        options: [{ label: '2 people', value: '2-people' }, { label: '3 people', value: '3-people' }, { label: '4+ people', value: '4-people' }, { label: 'Additional staff available (fee)', value: 'additional-staff-available-fee' }],
      }
    ],
    'sommelier-service': [
      {
        key: 'service-type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'Event sommelier (wine pairing dinner)', value: 'event-sommelier-wine-pairing-dinner' }, { label: 'Private consultation (cellar assessment)', value: 'private-consultation-cellar-assessment' }, { label: 'Wine list creation (for restaurant/venue)', value: 'wine-list-creation-for-restaurant-venue' }, { label: 'Staff training', value: 'staff-training' }, { label: 'Wine tasting party host', value: 'wine-tasting-party-host' }, { label: 'Virtual sommelier (zoom consultation)', value: 'virtual-sommelier-zoom-consultation' }],
      },
      {
        key: 'certification-level',
        label: 'Certification Level',
        type: 'checkbox',
        options: [{ label: 'Certified Sommelier (Court of Master Sommeliers)', value: 'certified-sommelier-court-of-master-sommeliers' }, { label: 'Advanced Sommelier', value: 'advanced-sommelier' }, { label: 'Master Sommelier', value: 'master-sommelier' }, { label: 'WSET Level 2', value: 'wset-level-2' }, { label: 'WSET Level 3', value: 'wset-level-3' }, { label: 'WSET Level 4 / Diploma', value: 'wset-level-4-diploma' }, { label: 'Certified Wine Educator', value: 'certified-wine-educator' }],
      },
      {
        key: 'number-of-wines',
        label: 'Number of Wines',
        type: 'checkbox',
        options: [{ label: '2 wines (small event)', value: '2-wines-small-event' }, { label: '3-5 wines (standard tasting)', value: '3-5-wines-standard-tasting' }, { label: '6-8 wines (premium)', value: '6-8-wines-premium' }, { label: '8+ wines (grand tasting)', value: '8-wines-grand-tasting' }],
      },
      {
        key: 'food-pairing',
        label: 'Food Pairing',
        type: 'checkbox',
        options: [{ label: 'Yes (sommelier recommends)', value: 'yes-sommelier-recommends' }, { label: 'Yes (sommelier provides small bites)', value: 'yes-sommelier-provides-small-bites' }, { label: 'No (wine only)', value: 'no-wine-only' }],
      },
      {
        key: 'bottle-procurement',
        label: 'Bottle Procurement',
        type: 'checkbox',
        options: [{ label: 'Client provides wines', value: 'client-provides-wines' }, { label: 'Sommelier sources wines (client pays)', value: 'sommelier-sources-wines-client-pays' }, { label: 'Sommelier provides wines (all-inclusive)', value: 'sommelier-provides-wines-all-inclusive' }],
      },
      {
        key: 'glassware',
        label: 'Glassware',
        type: 'checkbox',
        options: [{ label: 'Client provides', value: 'client-provides' }, { label: 'Sommelier brings (rental fee)', value: 'sommelier-brings-rental-fee' }, { label: 'Disposable glassware (not recommended)', value: 'disposable-glassware-not-recommended' }],
      },
      {
        key: 'educational-component',
        label: 'Educational Component',
        type: 'checkbox',
        options: [{ label: 'Brief introduction', value: 'brief-introduction' }, { label: 'Full tasting notes for each wine', value: 'full-tasting-notes-for-each-wine' }, { label: 'Q&A session', value: 'q-a-session' }, { label: 'Printed materials', value: 'printed-materials' }],
      }
    ],
    'food-beverage-consultant': [
      {
        key: 'consultant-type',
        label: 'Consultant Type',
        type: 'checkbox',
        options: [{ label: 'Restaurant opening consultant', value: 'restaurant-opening-consultant' }, { label: 'Menu development', value: 'menu-development' }, { label: 'Cost control / profitability', value: 'cost-control-profitability' }, { label: 'Supply chain / vendor negotiation', value: 'supply-chain-vendor-negotiation' }, { label: 'Health department compliance', value: 'health-department-compliance' }, { label: 'Concept creation', value: 'concept-creation' }, { label: 'Brand development', value: 'brand-development' }, { label: 'Food safety systems', value: 'food-safety-systems' }, { label: 'Kitchen design / flow', value: 'kitchen-design-flow' }, { label: 'Staff training programs', value: 'staff-training-programs' }],
      },
      {
        key: 'industry-experience',
        label: 'Industry Experience',
        type: 'checkbox',
        options: [{ label: 'Quick service / fast casual', value: 'quick-service-fast-casual' }, { label: 'Full service restaurant', value: 'full-service-restaurant' }, { label: 'Fine dining', value: 'fine-dining' }, { label: 'Catering company', value: 'catering-company' }, { label: 'Food truck / mobile', value: 'food-truck-mobile' }, { label: 'Hotel / resort F&B', value: 'hotel-resort-f-b' }, { label: 'Corporate dining', value: 'corporate-dining' }, { label: 'Institutional (schools, hospitals)', value: 'institutional-schools-hospitals' }],
      },
      {
        key: 'services-offered',
        label: 'Services Offered',
        type: 'checkbox',
        options: [{ label: 'One-time audit (2-4 hours)', value: 'one-time-audit-2-4-hours' }, { label: 'Half-day consultation', value: 'half-day-consultation' }, { label: 'Full day on-site', value: 'full-day-on-site' }, { label: 'Week-long intensive', value: 'week-long-intensive' }, { label: 'Monthly retainer', value: 'monthly-retainer' }, { label: 'Project-based (e.g., full opening)', value: 'project-based-e-g-full-opening' }],
      },
      {
        key: 'deliverables',
        label: 'Deliverables',
        type: 'checkbox',
        options: [{ label: 'Written report only', value: 'written-report-only' }, { label: 'Written report + presentation', value: 'written-report-presentation' }, { label: 'Action plan + follow-up call', value: 'action-plan-follow-up-call' }, { label: 'Full implementation support', value: 'full-implementation-support' }, { label: 'Staff training session(s)', value: 'staff-training-session-s' }],
      },
      {
        key: 'confidentiality-agreement',
        label: 'Confidentiality Agreement',
        type: 'checkbox',
        options: [{ label: 'Required', value: 'required' }, { label: 'Available upon request', value: 'available-upon-request' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'virtual-consultation-available',
        label: 'Virtual Consultation Available',
        type: 'checkbox',
        options: [{ label: 'Yes / No', value: 'yes-no' }],
      },
      {
        key: 'on-site-visit-required',
        label: 'On-Site Visit Required',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Preferred but not required', value: 'preferred-but-not-required' }, { label: 'No (virtual only)', value: 'no-virtual-only' }],
      }
    ],
    'dj-service': [
      {
        key: 'dj-type',
        label: 'DJ Type',
        type: 'checkbox',
        options: [{ label: 'Wedding DJ', value: 'wedding-dj' }, { label: 'Club DJ', value: 'club-dj' }, { label: 'Mobile event DJ', value: 'mobile-event-dj' }, { label: 'Karaoke DJ', value: 'karaoke-dj' }, { label: 'Radio DJ (appearance)', value: 'radio-dj-appearance' }, { label: 'Turntablist (scratching focus)', value: 'turntablist-scratching-focus' }, { label: 'Open format DJ', value: 'open-format-dj' }, { label: 'Genre specialist', value: 'genre-specialist' }],
      },
      {
        key: 'music-genres',
        label: 'Music Genres',
        type: 'checkbox',
        options: [{ label: 'Top 40 / pop', value: 'top-40-pop' }, { label: 'Hip hop / R&B', value: 'hip-hop-r-b' }, { label: 'Electronic / house', value: 'electronic-house' }, { label: 'Rock / alternative', value: 'rock-alternative' }, { label: 'Country', value: 'country' }, { label: 'Latin / reggaeton', value: 'latin-reggaeton' }, { label: 'Oldies / motown', value: 'oldies-motown' }, { label: '80s / 90s / 2000s', value: '80s-90s-2000s' }, { label: 'Jazz / lounge', value: 'jazz-lounge' }, { label: 'Classical (string instrument + DJ fusion)', value: 'classical-string-instrument-dj-fusion' }],
      },
      {
        key: 'equipment-provided',
        label: 'Equipment Provided',
        type: 'checkbox',
        options: [{ label: 'DJ controller / turntables', value: 'dj-controller-turntables' }, { label: 'Speakers (small event)', value: 'speakers-small-event' }, { label: 'Speakers (large event)', value: 'speakers-large-event' }, { label: 'Subwoofers', value: 'subwoofers' }, { label: 'Microphone(s) for announcements', value: 'microphone-s-for-announcements' }, { label: 'Wireless mic', value: 'wireless-mic' }, { label: 'Lighting (basic)', value: 'lighting-basic' }, { label: 'Lighting (DMX / dance floor)', value: 'lighting-dmx-dance-floor' }, { label: 'Facade / table cover', value: 'facade-table-cover' }, { label: 'Backup equipment', value: 'backup-equipment' }],
      },
      {
        key: 'mc-announcements',
        label: 'MC / Announcements',
        type: 'checkbox',
        options: [{ label: 'Yes (DJ acts as MC)', value: 'yes-dj-acts-as-mc' }, { label: 'Yes (separate MC available)', value: 'yes-separate-mc-available' }, { label: 'No (client or venue handles)', value: 'no-client-or-venue-handles' }],
      },
      {
        key: 'music-library-access',
        label: 'Music Library Access',
        type: 'checkbox',
        options: [{ label: 'Client can request songs in advance', value: 'client-can-request-songs-in-advance' }, { label: 'Client can provide playlist', value: 'client-can-provide-playlist' }, { label: 'Client can veto certain songs', value: 'client-can-veto-certain-songs' }, { label: 'DJ takes requests night-of', value: 'dj-takes-requests-night-of' }, { label: 'No requests (curated set only)', value: 'no-requests-curated-set-only' }],
      },
      {
        key: 'song-request-system',
        label: 'Song Request System',
        type: 'checkbox',
        options: [{ label: 'Text-to-request', value: 'text-to-request' }, { label: 'App-based requests', value: 'app-based-requests' }, { label: 'Paper list', value: 'paper-list' }, { label: 'No requests', value: 'no-requests' }],
      },
      {
        key: 'meeting-before-event',
        label: 'Meeting Before Event',
        type: 'checkbox',
        options: [{ label: 'In person (included)', value: 'in-person-included' }, { label: 'In person (extra fee)', value: 'in-person-extra-fee' }, { label: 'Phone / video call', value: 'phone-video-call' }, { label: 'Email only', value: 'email-only' }, { label: 'No meeting required', value: 'no-meeting-required' }],
      },
      {
        key: 'setup-time-included-in-booking',
        label: 'Setup Time Included in Booking',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (extra charge for early setup)', value: 'no-extra-charge-for-early-setup' }],
      },
      {
        key: 'backup-dj-provided',
        label: 'Backup DJ Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (in case of emergency)', value: 'yes-in-case-of-emergency' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'insurance',
        label: 'Insurance',
        type: 'checkbox',
        options: [{ label: 'Liability insurance carried', value: 'liability-insurance-carried' }, { label: 'Can provide COI upon request', value: 'can-provide-coi-upon-request' }],
      }
    ],
    'musician': [
      {
        key: 'instrument',
        label: 'Instrument',
        type: 'checkbox',
        options: [{ label: 'Piano', value: 'piano' }, { label: 'Guitar (acoustic)', value: 'guitar-acoustic' }, { label: 'Guitar (electric)', value: 'guitar-electric' }, { label: 'Violin', value: 'violin' }, { label: 'Cello', value: 'cello' }, { label: 'Flute', value: 'flute' }, { label: 'Saxophone', value: 'saxophone' }, { label: 'Trumpet', value: 'trumpet' }, { label: 'Harp', value: 'harp' }, { label: 'Drums / percussion', value: 'drums-percussion' }, { label: 'Bass (upright)', value: 'bass-upright' }, { label: 'Bass (electric)', value: 'bass-electric' }, { label: 'Ukulele', value: 'ukulele' }, { label: 'Mandolin', value: 'mandolin' }, { label: 'Bagpipes', value: 'bagpipes' }, { label: 'Steel drum', value: 'steel-drum' }, { label: 'Marimba / vibraphone', value: 'marimba-vibraphone' }],
      },
      {
        key: 'music-style',
        label: 'Music Style',
        type: 'checkbox',
        options: [{ label: 'Classical', value: 'classical' }, { label: 'Jazz', value: 'jazz' }, { label: 'Pop covers', value: 'pop-covers' }, { label: 'Folk / acoustic', value: 'folk-acoustic' }, { label: 'Blues', value: 'blues' }, { label: 'Flamenco', value: 'flamenco' }, { label: 'Celtic / Irish', value: 'celtic-irish' }, { label: 'Latin / bossa nova', value: 'latin-bossa-nova' }, { label: 'Rock', value: 'rock' }, { label: 'Ambient / background', value: 'ambient-background' }],
      },
      {
        key: 'solo-or-group',
        label: 'Solo or Group',
        type: 'checkbox',
        options: [{ label: 'Solo', value: 'solo' }, { label: 'Duo', value: 'duo' }, { label: 'Trio', value: 'trio' }, { label: 'Quartet', value: 'quartet' }, { label: 'Larger ensemble available', value: 'larger-ensemble-available' }],
      },
      {
        key: 'background-vs-performance',
        label: 'Background vs Performance',
        type: 'checkbox',
        options: [{ label: 'Background (ambient, dinner music)', value: 'background-ambient-dinner-music' }, { label: 'Featured performance (set with attention)', value: 'featured-performance-set-with-attention' }, { label: 'Both (background + featured set)', value: 'both-background-featured-set' }],
      },
      {
        key: 'vocalist-included',
        label: 'Vocalist Included',
        type: 'checkbox',
        options: [{ label: 'Yes (musician sings)', value: 'yes-musician-sings' }, { label: 'Yes (separate vocalist available)', value: 'yes-separate-vocalist-available' }, { label: 'Instrumental only', value: 'instrumental-only' }],
      },
      {
        key: 'sheet-music-provided',
        label: 'Sheet Music Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (upon request)', value: 'yes-upon-request' }, { label: 'No (plays by ear / memory)', value: 'no-plays-by-ear-memory' }],
      },
      {
        key: 'can-learn-specific-songs',
        label: 'Can Learn Specific Songs',
        type: 'checkbox',
        options: [{ label: 'Yes (lead time required)', value: 'yes-lead-time-required' }, { label: 'Limited to certain genres', value: 'limited-to-certain-genres' }, { label: 'No (repertoire only)', value: 'no-repertoire-only' }],
      },
      {
        key: 'repertoire-list-available',
        label: 'Repertoire List Available',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Upon request', value: 'upon-request' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'sight-reading-ability',
        label: 'Sight Reading Ability',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Partial', value: 'partial' }, { label: 'No', value: 'no' }],
      }
    ],
    'choir': [
      {
        key: 'choir-type',
        label: 'Choir Type',
        type: 'checkbox',
        options: [{ label: 'Gospel choir', value: 'gospel-choir' }, { label: 'Classical / concert choir', value: 'classical-concert-choir' }, { label: 'Pop / contemporary choir', value: 'pop-contemporary-choir' }, { label: 'Children\'s choir', value: 'children-s-choir' }, { label: 'Barbershop quartet', value: 'barbershop-quartet' }, { label: 'A cappella group', value: 'a-cappella-group' }, { label: 'Church / sacred choir', value: 'church-sacred-choir' }, { label: 'Community choir', value: 'community-choir' }],
      },
      {
        key: 'group-size',
        label: 'Group Size',
        type: 'checkbox',
        options: [{ label: 'Small (4-8 voices)', value: 'small-4-8-voices' }, { label: 'Medium (9-16 voices)', value: 'medium-9-16-voices' }, { label: 'Large (17-30 voices)', value: 'large-17-30-voices' }, { label: 'Very large (30+ voices)', value: 'very-large-30-voices' }],
      },
      {
        key: 'voices-included',
        label: 'Voices Included',
        type: 'checkbox',
        options: [{ label: 'Soprano', value: 'soprano' }, { label: 'Alto', value: 'alto' }, { label: 'Tenor', value: 'tenor' }, { label: 'Bass', value: 'bass' }, { label: 'Mixed (SATB)', value: 'mixed-satb' }, { label: 'All female', value: 'all-female' }, { label: 'All male', value: 'all-male' }],
      },
      {
        key: 'accompaniment',
        label: 'Accompaniment',
        type: 'checkbox',
        options: [{ label: 'A cappella only', value: 'a-cappella-only' }, { label: 'Piano accompaniment available', value: 'piano-accompaniment-available' }, { label: 'Track backing available', value: 'track-backing-available' }, { label: 'Full band available (extra)', value: 'full-band-available-extra' }],
      },
      {
        key: 'religious-sacred-repertoire',
        label: 'Religious / Sacred Repertoire',
        type: 'checkbox',
        options: [{ label: 'Yes (Christian)', value: 'yes-christian' }, { label: 'Yes (Jewish)', value: 'yes-jewish' }, { label: 'Yes (Hindu / Bhajan)', value: 'yes-hindu-bhajan' }, { label: 'Secular only', value: 'secular-only' }],
      },
      {
        key: 'custom-arrangements',
        label: 'Custom Arrangements',
        type: 'checkbox',
        options: [{ label: 'Yes (commission)', value: 'yes-commission' }, { label: 'Yes (existing arrangements)', value: 'yes-existing-arrangements' }, { label: 'No (learn by ear/standard parts)', value: 'no-learn-by-ear-standard-parts' }],
      },
      {
        key: 'processional-recessional',
        label: 'Processional / Recessional',
        type: 'checkbox',
        options: [{ label: 'Can sing while walking', value: 'can-sing-while-walking' }, { label: 'Stationary only', value: 'stationary-only' }, { label: 'Depends on piece', value: 'depends-on-piece' }],
      },
      {
        key: 'robes-uniforms',
        label: 'Robes / Uniforms',
        type: 'checkbox',
        options: [{ label: 'Provided by choir', value: 'provided-by-choir' }, { label: 'Provided by client (specific color)', value: 'provided-by-client-specific-color' }, { label: 'Casual / all black', value: 'casual-all-black' }, { label: 'Varies by event', value: 'varies-by-event' }],
      },
      {
        key: 'rehearsal-included',
        label: 'Rehearsal Included',
        type: 'checkbox',
        options: [{ label: '1 rehearsal included', value: '1-rehearsal-included' }, { label: 'Multiple rehearsals (extra)', value: 'multiple-rehearsals-extra' }, { label: 'No rehearsal (performance ready)', value: 'no-rehearsal-performance-ready' }],
      }
    ],
    'musical-band-orchestras-symphonies': [
      {
        key: 'ensemble-type',
        label: 'Ensemble Type',
        type: 'checkbox',
        options: [{ label: 'String quartet', value: 'string-quartet' }, { label: 'String trio', value: 'string-trio' }, { label: 'String duo', value: 'string-duo' }, { label: 'Jazz band', value: 'jazz-band' }, { label: 'Marching band', value: 'marching-band' }, { label: 'Brass band', value: 'brass-band' }, { label: 'Big band / swing', value: 'big-band-swing' }, { label: 'Dance band / party band', value: 'dance-band-party-band' }, { label: 'Cover band (tribute)', value: 'cover-band-tribute' }, { label: 'Original music band', value: 'original-music-band' }, { label: 'Wedding band', value: 'wedding-band' }, { label: 'Pit orchestra (for musicals)', value: 'pit-orchestra-for-musicals' }, { label: 'Symphony orchestra (full)', value: 'symphony-orchestra-full' }, { label: 'Chamber orchestra', value: 'chamber-orchestra' }],
      },
      {
        key: 'ensemble-size',
        label: 'Ensemble Size',
        type: 'checkbox',
        options: [{ label: '2-4 musicians', value: '2-4-musicians' }, { label: '5-8 musicians', value: '5-8-musicians' }, { label: '9-12 musicians', value: '9-12-musicians' }, { label: '13-20 musicians', value: '13-20-musicians' }, { label: '20+ musicians', value: '20-musicians' }],
      },
      {
        key: 'music-genre-specialty',
        label: 'Music Genre Specialty',
        type: 'checkbox',
        options: [{ label: 'Classical', value: 'classical' }, { label: 'Jazz / swing', value: 'jazz-swing' }, { label: 'Motown / soul', value: 'motown-soul' }, { label: 'Rock / pop covers', value: 'rock-pop-covers' }, { label: 'Country / bluegrass', value: 'country-bluegrass' }, { label: 'Latin / salsa', value: 'latin-salsa' }, { label: 'Funk / disco', value: 'funk-disco' }, { label: 'Top 40 / dance', value: 'top-40-dance' }, { label: 'Wedding standards', value: 'wedding-standards' }],
      },
      {
        key: 'custom-arrangements-available',
        label: 'Custom Arrangements Available',
        type: 'checkbox',
        options: [{ label: 'Yes (lead time required)', value: 'yes-lead-time-required' }, { label: 'Yes (existing arrangements only)', value: 'yes-existing-arrangements-only' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'sheet-music-provided',
        label: 'Sheet Music Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (copies for musicians)', value: 'yes-copies-for-musicians' }, { label: 'Yes (digital)', value: 'yes-digital' }, { label: 'No (musicians bring own)', value: 'no-musicians-bring-own' }],
      },
      {
        key: 'conductor-bandleader-included',
        label: 'Conductor / Bandleader Included',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No (self-conducted)', value: 'no-self-conducted' }],
      },
      {
        key: 'first-dance-special-song',
        label: 'First Dance / Special Song',
        type: 'checkbox',
        options: [{ label: 'Can learn (fee applies)', value: 'can-learn-fee-applies' }, { label: 'Can learn (included if standard)', value: 'can-learn-included-if-standard' }, { label: 'Plays from existing repertoire only', value: 'plays-from-existing-repertoire-only' }],
      },
      {
        key: 'set-length',
        label: 'Set Length',
        type: 'checkbox',
        options: [{ label: '45 min set', value: '45-min-set' }, { label: '60 min set', value: '60-min-set' }, { label: '90 min set', value: '90-min-set' }, { label: '2+ hour set', value: '2-hour-set' }, { label: 'Continuous with breaks', value: 'continuous-with-breaks' }],
      },
      {
        key: 'breaks',
        label: 'Breaks',
        type: 'checkbox',
        options: [{ label: 'Background music provided during break', value: 'background-music-provided-during-break' }, { label: 'DJ provides during break', value: 'dj-provides-during-break' }, { label: 'Venue provides', value: 'venue-provides' }, { label: 'Silent break', value: 'silent-break' }],
      },
      {
        key: 'sound-check-required',
        label: 'Sound Check Required',
        type: 'checkbox',
        options: [{ label: '15 minutes', value: '15-minutes' }, { label: '30 minutes', value: '30-minutes' }, { label: '1 hour', value: '1-hour' }, { label: 'No sound check (line check only)', value: 'no-sound-check-line-check-only' }],
      }
    ],
    'magician': [
      {
        key: 'performance-type',
        label: 'Performance Type',
        type: 'checkbox',
        options: [{ label: 'Close-up / strolling magic', value: 'close-up-strolling-magic' }, { label: 'Stage magic show', value: 'stage-magic-show' }, { label: 'Parlor magic (small group)', value: 'parlor-magic-small-group' }, { label: 'Kid\'s birthday magic', value: 'kid-s-birthday-magic' }, { label: 'Corporate / cocktail magic', value: 'corporate-cocktail-magic' }, { label: 'Virtual magic show', value: 'virtual-magic-show' }, { label: 'Mentalism', value: 'mentalism' }, { label: 'Comedy magic', value: 'comedy-magic' }],
      },
      {
        key: 'show-length',
        label: 'Show Length',
        type: 'checkbox',
        options: [{ label: '15-20 minutes (strolling, per group)', value: '15-20-minutes-strolling-per-group' }, { label: '30 minutes', value: '30-minutes' }, { label: '45 minutes', value: '45-minutes' }, { label: '60 minutes', value: '60-minutes' }, { label: '90 minutes (headliner)', value: '90-minutes-headliner' }],
      },
      {
        key: 'audience-size',
        label: 'Audience Size',
        type: 'checkbox',
        options: [{ label: 'Intimate (under 30)', value: 'intimate-under-30' }, { label: 'Small (30-75)', value: 'small-30-75' }, { label: 'Medium (75-150)', value: 'medium-75-150' }, { label: 'Large (150-300)', value: 'large-150-300' }, { label: 'Theater (300+)', value: 'theater-300' }],
      },
      {
        key: 'audience-participation',
        label: 'Audience Participation',
        type: 'checkbox',
        options: [{ label: 'Minimal', value: 'minimal' }, { label: 'Some volunteers', value: 'some-volunteers' }, { label: 'Heavy participation', value: 'heavy-participation' }, { label: 'Entire audience involved (mentalism)', value: 'entire-audience-involved-mentalism' }],
      },
      {
        key: 'props-provided',
        label: 'Props Provided',
        type: 'checkbox',
        options: [{ label: 'All props provided', value: 'all-props-provided' }, { label: 'Requires table / small space', value: 'requires-table-small-space' }, { label: 'Requires stage / lighting', value: 'requires-stage-lighting' }],
      },
      {
        key: 'kid-friendly',
        label: 'Kid Friendly',
        type: 'checkbox',
        options: [{ label: 'Yes (G-rated)', value: 'yes-g-rated' }, { label: 'Yes (PG, mild scares)', value: 'yes-pg-mild-scares' }, { label: 'Adult-oriented only', value: 'adult-oriented-only' }],
      },
      {
        key: 'custom-material',
        label: 'Custom Material',
        type: 'checkbox',
        options: [{ label: 'Can incorporate inside jokes', value: 'can-incorporate-inside-jokes' }, { label: 'Can incorporate company/product', value: 'can-incorporate-company-product' }, { label: 'Can incorporate specific theme', value: 'can-incorporate-specific-theme' }, { label: 'No (set routine)', value: 'no-set-routine' }],
      },
      {
        key: 'learning-new-tricks-for-event',
        label: 'Learning New Tricks for Event',
        type: 'checkbox',
        options: [{ label: 'No (existing repertoire only)', value: 'no-existing-repertoire-only' }],
      }
    ],
    'clown': [
      {
        key: 'clown-style',
        label: 'Clown Style',
        type: 'checkbox',
        options: [{ label: 'Classic circus clown', value: 'classic-circus-clown' }, { label: 'Silly / slapstick', value: 'silly-slapstick' }, { label: 'Gentle / children\'s hospital style', value: 'gentle-children-s-hospital-style' }, { label: 'Scary / horror clown (adult events)', value: 'scary-horror-clown-adult-events' }, { label: 'Mime', value: 'mime' }, { label: 'Balloon clown', value: 'balloon-clown' }, { label: 'Character clown (specific persona)', value: 'character-clown-specific-persona' }],
      },
      {
        key: 'services-offered',
        label: 'Services Offered',
        type: 'checkbox',
        options: [{ label: 'Balloon animals', value: 'balloon-animals' }, { label: 'Face painting', value: 'face-painting' }, { label: 'Magic tricks', value: 'magic-tricks' }, { label: 'Juggling', value: 'juggling' }, { label: 'Unicycle riding', value: 'unicycle-riding' }, { label: 'Mini shows (10-15 min)', value: 'mini-shows-10-15-min' }, { label: 'Walk-around / mingling', value: 'walk-around-mingling' }, { label: 'Parades / processions', value: 'parades-processions' }],
      },
      {
        key: 'age-appropriateness',
        label: 'Age Appropriateness',
        type: 'checkbox',
        options: [{ label: 'Toddlers (1-3)', value: 'toddlers-1-3' }, { label: 'Young children (4-8)', value: 'young-children-4-8' }, { label: 'Older children (9-12)', value: 'older-children-9-12' }, { label: 'Teens (ironic / retro)', value: 'teens-ironic-retro' }, { label: 'Adults only', value: 'adults-only' }],
      },
      {
        key: 'makeup-costume',
        label: 'Makeup / Costume',
        type: 'checkbox',
        options: [{ label: 'Full clown makeup & costume', value: 'full-clown-makeup-costume' }, { label: 'Minimal makeup / character', value: 'minimal-makeup-character' }, { label: 'Client provides costume', value: 'client-provides-costume' }],
      },
      {
        key: 'shoe-size-specialty-shoes',
        label: 'Shoe Size / Specialty Shoes',
        type: 'checkbox',
        options: [{ label: 'Standard clown shoes (up to size 12)', value: 'standard-clown-shoes-up-to-size-12' }, { label: 'Custom clown shoes (extra)', value: 'custom-clown-shoes-extra' }],
      },
      {
        key: 'balloon-animal-complexity',
        label: 'Balloon Animal Complexity',
        type: 'checkbox',
        options: [{ label: 'Basic (dogs, swords)', value: 'basic-dogs-swords' }, { label: 'Intermediate (hats, flowers)', value: 'intermediate-hats-flowers' }, { label: 'Advanced (life-size, characters)', value: 'advanced-life-size-characters' }],
      },
      {
        key: 'fear-of-clowns-coulrophobia',
        label: 'Fear of Clowns (Coulrophobia)',
        type: 'checkbox',
        options: [{ label: 'Can adjust approach (gentle)', value: 'can-adjust-approach-gentle' }, { label: 'Can remove makeup (character only)', value: 'can-remove-makeup-character-only' }, { label: 'Best to choose different entertainer', value: 'best-to-choose-different-entertainer' }],
      }
    ],
    'party-character': [
      {
        key: 'character-type',
        label: 'Character Type',
        type: 'checkbox',
        options: [{ label: 'Princess', value: 'princess' }, { label: 'Superhero', value: 'superhero' }, { label: 'Fairy', value: 'fairy' }, { label: 'Pirate', value: 'pirate' }, { label: 'Cowboy / cowgirl', value: 'cowboy-cowgirl' }, { label: 'Unicorn', value: 'unicorn' }, { label: 'Dinosaur', value: 'dinosaur' }, { label: 'Animal mascot (generic)', value: 'animal-mascot-generic' }, { label: 'Licensed character lookalike (non-trademark)', value: 'licensed-character-lookalike-non-trademark' }, { label: 'Movie / TV inspired', value: 'movie-tv-inspired' }],
      },
      {
        key: 'services-offered',
        label: 'Services Offered',
        type: 'checkbox',
        options: [{ label: 'Arrival announcement', value: 'arrival-announcement' }, { label: 'Pose for photos', value: 'pose-for-photos' }, { label: 'Lead games / activities', value: 'lead-games-activities' }, { label: 'Read a story', value: 'read-a-story' }, { label: 'Sing happy birthday', value: 'sing-happy-birthday' }, { label: 'Lead a parade', value: 'lead-a-parade' }, { label: 'Dance party', value: 'dance-party' }, { label: 'Tattoos / stamps', value: 'tattoos-stamps' }, { label: 'Coloring / craft time', value: 'coloring-craft-time' }],
      },
      {
        key: 'character-voice',
        label: 'Character Voice',
        type: 'checkbox',
        options: [{ label: 'Uses character voice', value: 'uses-character-voice' }, { label: 'Narrates (normal voice)', value: 'narrates-normal-voice' }, { label: 'Silent / pantomime', value: 'silent-pantomime' }],
      },
      {
        key: 'outfit-quality',
        label: 'Outfit Quality',
        type: 'checkbox',
        options: [{ label: 'Professional / theatrical grade', value: 'professional-theatrical-grade' }, { label: 'Standard costume', value: 'standard-costume' }, { label: 'Simple / budget', value: 'simple-budget' }],
      },
      {
        key: 'purity-safety',
        label: 'Purity / Safety',
        type: 'checkbox',
        options: [{ label: 'Background check available', value: 'background-check-available' }, { label: 'Chaperone preferred', value: 'chaperone-preferred' }, { label: 'Agency-supervised', value: 'agency-supervised' }],
      },
      {
        key: 'male-female-character',
        label: 'Male / Female Character',
        type: 'checkbox',
        options: [{ label: 'Female-presenting', value: 'female-presenting' }, { label: 'Male-presenting', value: 'male-presenting' }, { label: 'Gender-neutral', value: 'gender-neutral' }],
      }
    ],
    'caricature': [
      {
        key: 'artist-type',
        label: 'Artist Type',
        type: 'checkbox',
        options: [{ label: 'Traditional (pen & paper)', value: 'traditional-pen-paper' }, { label: 'Digital (iPad / tablet)', value: 'digital-ipad-tablet' }, { label: 'Live painting (watercolor)', value: 'live-painting-watercolor' }, { label: 'Group caricatures (multiple people)', value: 'group-caricatures-multiple-people' }],
      },
      {
        key: 'drawing-speed',
        label: 'Drawing Speed',
        type: 'checkbox',
        options: [{ label: 'Fast (3-5 minutes per face)', value: 'fast-3-5-minutes-per-face' }, { label: 'Standard (5-8 minutes)', value: 'standard-5-8-minutes' }, { label: 'Detailed (8-12 minutes)', value: 'detailed-8-12-minutes' }, { label: 'Master (12+ minutes)', value: 'master-12-minutes' }],
      },
      {
        key: 'color-vs-black-white',
        label: 'Color vs Black & White',
        type: 'checkbox',
        options: [{ label: 'Black and white only', value: 'black-and-white-only' }, { label: 'Color (marker/watercolor)', value: 'color-marker-watercolor' }, { label: 'Digital color', value: 'digital-color' }, { label: 'Client chooses', value: 'client-chooses' }],
      },
      {
        key: 'paper-size',
        label: 'Paper Size',
        type: 'checkbox',
        options: [{ label: 'Small (5x7)', value: 'small-5x7' }, { label: 'Standard (8.5x11)', value: 'standard-8-5x11' }, { label: 'Large (11x14)', value: 'large-11x14' }, { label: 'Jumbo (14x17)', value: 'jumbo-14x17' }],
      },
      {
        key: 'copy-provided',
        label: 'Copy Provided',
        type: 'checkbox',
        options: [{ label: 'Original given to guest', value: 'original-given-to-guest' }, { label: 'Digital scan provided to host', value: 'digital-scan-provided-to-host' }, { label: 'Extra copies available', value: 'extra-copies-available' }],
      },
      {
        key: 'props-theming',
        label: 'Props / Theming',
        type: 'checkbox',
        options: [{ label: 'Can add event-specific props', value: 'can-add-event-specific-props' }, { label: 'Can use company colors', value: 'can-use-company-colors' }, { label: 'Can draw in themed style', value: 'can-draw-in-themed-style' }],
      },
      {
        key: 'group-couple-caricatures',
        label: 'Group / Couple Caricatures',
        type: 'checkbox',
        options: [{ label: 'Yes (requires more time)', value: 'yes-requires-more-time' }, { label: 'Yes (special rate)', value: 'yes-special-rate' }, { label: 'No (singles only)', value: 'no-singles-only' }],
      },
      {
        key: 'hired-for',
        label: 'Hired For',
        type: 'checkbox',
        options: [{ label: '1 hour', value: '1-hour' }, { label: '2 hours', value: '2-hours' }, { label: '3+ hours', value: '3-hours' }, { label: 'Full event', value: 'full-event' }],
      }
    ],
    'face-painting': [
      {
        key: 'painting-style',
        label: 'Painting Style',
        type: 'checkbox',
        options: [{ label: 'Quick designs (cheek art)', value: 'quick-designs-cheek-art' }, { label: 'Half face', value: 'half-face' }, { label: 'Full face', value: 'full-face' }, { label: 'Full face + neck/arms', value: 'full-face-neck-arms' }, { label: 'Glitter tattoos (no paint)', value: 'glitter-tattoos-no-paint' }],
      },
      {
        key: 'design-complexity',
        label: 'Design Complexity',
        type: 'checkbox',
        options: [{ label: 'Simple (heart, star, spider)', value: 'simple-heart-star-spider' }, { label: 'Standard (butterfly, tiger, mask)', value: 'standard-butterfly-tiger-mask' }, { label: 'Advanced (character, detailed)', value: 'advanced-character-detailed' }, { label: 'Master (3D effects, airbrush)', value: 'master-3d-effects-airbrush' }],
      },
      {
        key: 'paint-type',
        label: 'Paint Type',
        type: 'checkbox',
        options: [{ label: 'Water-based (FDA compliant)', value: 'water-based-fda-compliant' }, { label: 'Hypoallergenic available', value: 'hypoallergenic-available' }, { label: 'Glitter (cosmetic grade)', value: 'glitter-cosmetic-grade' }, { label: 'Neon / UV reactive', value: 'neon-uv-reactive' }],
      },
      {
        key: 'removal',
        label: 'Removal',
        type: 'checkbox',
        options: [{ label: 'Artist removes (end of event)', value: 'artist-removes-end-of-event' }, { label: 'Wipes provided for parents', value: 'wipes-provided-for-parents' }, { label: 'Soap and water (client removes)', value: 'soap-and-water-client-removes' }],
      },
      {
        key: 'age-recommendations',
        label: 'Age Recommendations',
        type: 'checkbox',
        options: [{ label: 'Toddlers (2-4) – simple only', value: 'toddlers-2-4-simple-only' }, { label: 'Children (5-12)', value: 'children-5-12' }, { label: 'Teens / adults (full face)', value: 'teens-adults-full-face' }],
      },
      {
        key: 'line-management',
        label: 'Line Management',
        type: 'checkbox',
        options: [{ label: 'Artist manages line', value: 'artist-manages-line' }, { label: 'Host manages line', value: 'host-manages-line' }, { label: 'Ticket system (draw numbers)', value: 'ticket-system-draw-numbers' }],
      },
      {
        key: 'speed',
        label: 'Speed',
        type: 'checkbox',
        options: [{ label: '2 minutes per child (simple)', value: '2-minutes-per-child-simple' }, { label: '5 minutes (standard)', value: '5-minutes-standard' }, { label: '10+ minutes (detailed)', value: '10-minutes-detailed' }],
      },
      {
        key: 'design-book-menu',
        label: 'Design Book / Menu',
        type: 'checkbox',
        options: [{ label: 'Yes (guests choose)', value: 'yes-guests-choose' }, { label: 'Free choice (any design)', value: 'free-choice-any-design' }, { label: 'Themed menu only', value: 'themed-menu-only' }],
      },
      {
        key: 'allergy-policy',
        label: 'Allergy Policy',
        type: 'checkbox',
        options: [{ label: 'Parent must sign waiver', value: 'parent-must-sign-waiver' }, { label: 'Patch test available (not realistic)', value: 'patch-test-available-not-realistic' }, { label: 'No nuts/ latex in products', value: 'no-nuts-latex-in-products' }],
      }
    ],
    'henna-artist': [
      {
        key: 'henna-type',
        label: 'Henna Type',
        type: 'checkbox',
        options: [{ label: 'Natural brown henna', value: 'natural-brown-henna' }, { label: 'Black henna (contains PPD – caution)', value: 'black-henna-contains-ppd-caution' }, { label: 'White henna (body paint)', value: 'white-henna-body-paint' }, { label: 'Glitter henna', value: 'glitter-henna' }],
      },
      {
        key: 'design-style',
        label: 'Design Style',
        type: 'checkbox',
        options: [{ label: 'Traditional Indian (paisley, peacocks)', value: 'traditional-indian-paisley-peacocks' }, { label: 'Arabic (floral, vines)', value: 'arabic-floral-vines' }, { label: 'Moroccan (geometric)', value: 'moroccan-geometric' }, { label: 'Modern / minimalist', value: 'modern-minimalist' }, { label: 'Custom / freehand', value: 'custom-freehand' }],
      },
      {
        key: 'application-time',
        label: 'Application Time',
        type: 'checkbox',
        options: [{ label: 'Small design (5-10 min)', value: 'small-design-5-10-min' }, { label: 'Medium design (10-20 min)', value: 'medium-design-10-20-min' }, { label: 'Large design (20-40 min)', value: 'large-design-20-40-min' }, { label: 'Full hand & forearm (40-60 min)', value: 'full-hand-forearm-40-60-min' }],
      },
      {
        key: 'drying-time',
        label: 'Drying Time',
        type: 'checkbox',
        options: [{ label: '15-30 minutes (dry to touch)', value: '15-30-minutes-dry-to-touch' }, { label: '30-60 minutes (fully dry)', value: '30-60-minutes-fully-dry' }, { label: 'Artist can speed with lemon/sugar', value: 'artist-can-speed-with-lemon-sugar' }],
      },
      {
        key: 'aftercare-instructions',
        label: 'Aftercare Instructions',
        type: 'checkbox',
        options: [{ label: 'Yes (provided verbally)', value: 'yes-provided-verbally' }, { label: 'Yes (printed card)', value: 'yes-printed-card' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'stain-development',
        label: 'Stain Development',
        type: 'checkbox',
        options: [{ label: 'Orange initially', value: 'orange-initially' }, { label: 'Darkens over 24-48 hours', value: 'darkens-over-24-48-hours' }, { label: 'Lasts 1-3 weeks', value: 'lasts-1-3-weeks' }],
      },
      {
        key: 'removal',
        label: 'Removal',
        type: 'checkbox',
        options: [{ label: 'Exfoliation / oil', value: 'exfoliation-oil' }, { label: 'Fades naturally', value: 'fades-naturally' }, { label: 'Artist does not remove', value: 'artist-does-not-remove' }],
      },
      {
        key: 'allergy-test-available',
        label: 'Allergy Test Available',
        type: 'checkbox',
        options: [{ label: 'Yes (24 hours prior)', value: 'yes-24-hours-prior' }, { label: 'No (patch not practical)', value: 'no-patch-not-practical' }, { label: 'Use natural henna only (safe)', value: 'use-natural-henna-only-safe' }],
      },
      {
        key: 'group-events',
        label: 'Group Events',
        type: 'checkbox',
        options: [{ label: 'Per person pricing', value: 'per-person-pricing' }, { label: 'Hourly rate (unlimited simple designs)', value: 'hourly-rate-unlimited-simple-designs' }, { label: 'Wristband system for larger events', value: 'wristband-system-for-larger-events' }],
      }
    ],
    'comedy-club': [
      {
        key: 'club-type',
        label: 'Club Type',
        type: 'checkbox',
        options: [{ label: 'Stand-up comedy club', value: 'stand-up-comedy-club' }, { label: 'Improv comedy club', value: 'improv-comedy-club' }, { label: 'Sketch comedy theater', value: 'sketch-comedy-theater' }, { label: 'Open mic venue (amateur)', value: 'open-mic-venue-amateur' }, { label: 'Dinner & comedy', value: 'dinner-comedy' }, { label: 'LGBTQ+ focused', value: 'lgbtq-focused' }, { label: 'Clean comedy (no swears / adult topics)', value: 'clean-comedy-no-swears-adult-topics' }, { label: 'Alternative / experimental', value: 'alternative-experimental' }],
      },
      {
        key: 'ticket-price-range',
        label: 'Ticket Price Range',
        type: 'checkbox',
        options: [{ label: 'Free (donation suggested)', value: 'free-donation-suggested' }, { label: '$5-10', value: '5-10' }, { label: '$10-20', value: '10-20' }, { label: '$20-35', value: '20-35' }, { label: '$35-50', value: '35-50' }, { label: '$50+ (headliners)', value: '50-headliners' }],
      },
      {
        key: 'two-drink-minimum',
        label: 'Two Drink Minimum',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }, { label: 'One item minimum (food/drink)', value: 'one-item-minimum-food-drink' }],
      },
      {
        key: 'age-restriction',
        label: 'Age Restriction',
        type: 'checkbox',
        options: [{ label: 'All ages (clean comedy)', value: 'all-ages-clean-comedy' }, { label: '16+', value: '16' }, { label: '18+', value: '18' }, { label: '21+ (alcohol service)', value: '21-alcohol-service' }],
      },
      {
        key: 'headliner-status',
        label: 'Headliner Status',
        type: 'checkbox',
        options: [{ label: 'Local talent', value: 'local-talent' }, { label: 'Regional headliner', value: 'regional-headliner' }, { label: 'National touring headliner', value: 'national-touring-headliner' }, { label: 'Celebrity (TV/film)', value: 'celebrity-tv-film' }],
      },
      {
        key: 'open-mic-night',
        label: 'Open Mic Night',
        type: 'checkbox',
        options: [{ label: 'Yes (signup available)', value: 'yes-signup-available' }, { label: 'Yes (lottery)', value: 'yes-lottery' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'reservations',
        label: 'Reservations',
        type: 'checkbox',
        options: [{ label: 'Required (weekends)', value: 'required-weekends' }, { label: 'Recommended', value: 'recommended' }, { label: 'Walk-ins welcome', value: 'walk-ins-welcome' }],
      },
      {
        key: 'table-seating',
        label: 'Table Seating',
        type: 'checkbox',
        options: [{ label: 'Cabanas / booths', value: 'cabanas-booths' }, { label: 'Cabaret tables (4-top)', value: 'cabaret-tables-4-top' }, { label: 'Theater style (fixed seats)', value: 'theater-style-fixed-seats' }, { label: 'General admission (first come)', value: 'general-admission-first-come' }],
      },
      {
        key: 'food-quality',
        label: 'Food Quality',
        type: 'checkbox',
        options: [{ label: 'Full restaurant menu', value: 'full-restaurant-menu' }, { label: 'Bar snacks only', value: 'bar-snacks-only' }, { label: 'No food (drinks only)', value: 'no-food-drinks-only' }],
      },
      {
        key: 'late-show',
        label: 'Late Show',
        type: 'checkbox',
        options: [{ label: 'Yes (10pm or later)', value: 'yes-10pm-or-later' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'amateur-night-competitions',
        label: 'Amateur Night / Competitions',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'recorded-for-streaming-album',
        label: 'Recorded for Streaming / Album',
        type: 'checkbox',
        options: [{ label: 'Yes (audience consent)', value: 'yes-audience-consent' }, { label: 'No', value: 'no' }],
      }
    ],
    'dance-club': [
      {
        key: 'club-type',
        label: 'Club Type',
        type: 'checkbox',
        options: [{ label: 'Nightclub (EDM / top 40)', value: 'nightclub-edm-top-40' }, { label: 'Latin club (salsa, bachata, reggaeton)', value: 'latin-club-salsa-bachata-reggaeton' }, { label: 'Hip hop club', value: 'hip-hop-club' }, { label: 'LGBTQ+ dance club', value: 'lgbtq-dance-club' }, { label: '18+ club (no alcohol)', value: '18-club-no-alcohol' }, { label: 'After-hours club (2am – 6am)', value: 'after-hours-club-2am-6am' }, { label: 'Swing / ballroom dance hall', value: 'swing-ballroom-dance-hall' }, { label: 'Country / line dance bar', value: 'country-line-dance-bar' }],
      },
      {
        key: 'music-style',
        label: 'Music Style',
        type: 'checkbox',
        options: [{ label: 'EDM / house / techno', value: 'edm-house-techno' }, { label: 'Top 40 / pop', value: 'top-40-pop' }, { label: 'Hip hop / R&B', value: 'hip-hop-r-b' }, { label: 'Latin / reggaeton / dembow', value: 'latin-reggaeton-dembow' }, { label: 'Throwbacks (80s/90s/00s)', value: 'throwbacks-80s-90s-00s' }, { label: 'Variety (multiple rooms)', value: 'variety-multiple-rooms' }],
      },
      {
        key: 'cover-charge',
        label: 'Cover Charge',
        type: 'checkbox',
        options: [{ label: 'Free (before ___ time)', value: 'free-before-time' }, { label: '$5-10', value: '5-10' }, { label: '$10-20', value: '10-20' }, { label: '$20+', value: '20' }, { label: 'Guest list (free before ___)', value: 'guest-list-free-before' }],
      },
      {
        key: 'dress-code',
        label: 'Dress Code',
        type: 'checkbox',
        options: [{ label: 'Casual', value: 'casual' }, { label: 'Upscale casual (no sneakers)', value: 'upscale-casual-no-sneakers' }, { label: 'Dress to impress', value: 'dress-to-impress' }, { label: 'Themed (specify)', value: 'themed-specify' }, { label: 'No dress code', value: 'no-dress-code' }],
      },
      {
        key: 'bottle-service',
        label: 'Bottle Service',
        type: 'checkbox',
        options: [{ label: 'Available (table minimum $___)', value: 'available-table-minimum' }, { label: 'Required for seating on weekends', value: 'required-for-seating-on-weekends' }, { label: 'No bottle service', value: 'no-bottle-service' }],
      },
      {
        key: 'vip-area',
        label: 'VIP Area',
        type: 'checkbox',
        options: [{ label: 'Yes (rope access)', value: 'yes-rope-access' }, { label: 'Yes (elevated / balcony)', value: 'yes-elevated-balcony' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Standard club lighting', value: 'standard-club-lighting' }, { label: 'Laser show', value: 'laser-show' }, { label: 'LED wall / video mapping', value: 'led-wall-video-mapping' }, { label: 'Dark / moody', value: 'dark-moody' }],
      },
      {
        key: 'smoking-policy',
        label: 'Smoking Policy',
        type: 'checkbox',
        options: [{ label: 'No smoking indoors', value: 'no-smoking-indoors' }, { label: 'Smoking patio available', value: 'smoking-patio-available' }, { label: 'Smoking allowed (ventilated)', value: 'smoking-allowed-ventilated' }],
      },
      {
        key: 'security',
        label: 'Security',
        type: 'checkbox',
        options: [{ label: 'Pat-down / bag check', value: 'pat-down-bag-check' }, { label: 'Metal detector', value: 'metal-detector' }, { label: 'ID scanner', value: 'id-scanner' }, { label: 'Visible security staff', value: 'visible-security-staff' }],
      },
      {
        key: 'age-verification',
        label: 'Age Verification',
        type: 'checkbox',
        options: [{ label: 'Strict (scannable ID required)', value: 'strict-scannable-id-required' }, { label: 'Visual check only', value: 'visual-check-only' }, { label: 'Accepts passport / military ID', value: 'accepts-passport-military-id' }],
      },
      {
        key: 'dance-floor-size',
        label: 'Dance Floor Size',
        type: 'checkbox',
        options: [{ label: 'Small (under 200 sq ft)', value: 'small-under-200-sq-ft' }, { label: 'Medium (200-500 sq ft)', value: 'medium-200-500-sq-ft' }, { label: 'Large (500-1,000 sq ft)', value: 'large-500-1-000-sq-ft' }, { label: 'Multi-level / multiple floors', value: 'multi-level-multiple-floors' }],
      },
      {
        key: 'dance-lessons-offered',
        label: 'Dance Lessons Offered',
        type: 'checkbox',
        options: [{ label: 'Yes (before club hours)', value: 'yes-before-club-hours' }, { label: 'Yes (during slow nights)', value: 'yes-during-slow-nights' }, { label: 'No', value: 'no' }],
      }
    ],
    'karaoke': [
      {
        key: 'karaoke-type',
        label: 'Karaoke Type',
        type: 'checkbox',
        options: [{ label: 'Private room karaoke (karaoke box)', value: 'private-room-karaoke-karaoke-box' }, { label: 'Public / stage karaoke (bar setting)', value: 'public-stage-karaoke-bar-setting' }, { label: 'Mobile karaoke (rent for private event)', value: 'mobile-karaoke-rent-for-private-event' }, { label: 'Virtual karaoke (Zoom / streaming)', value: 'virtual-karaoke-zoom-streaming' }],
      },
      {
        key: 'song-library-size',
        label: 'Song Library Size',
        type: 'checkbox',
        options: [{ label: 'Small (under 5,000 songs)', value: 'small-under-5-000-songs' }, { label: 'Medium (5,000-20,000)', value: 'medium-5-000-20-000' }, { label: 'Large (20,000-50,000)', value: 'large-20-000-50-000' }, { label: 'Extensive (50,000+)', value: 'extensive-50-000' }],
      },
      {
        key: 'languages-available',
        label: 'Languages Available',
        type: 'checkbox',
        options: [{ label: 'English only', value: 'english-only' }, { label: 'English + Spanish', value: 'english-spanish' }, { label: 'English + Chinese / Cantonese', value: 'english-chinese-cantonese' }, { label: 'English + Korean (K-pop)', value: 'english-korean-k-pop' }, { label: 'English + Japanese (J-pop)', value: 'english-japanese-j-pop' }, { label: 'English + Tagalog', value: 'english-tagalog' }, { label: 'Multi-language (10+)', value: 'multi-language-10' }],
      },
      {
        key: 'song-updates',
        label: 'Song Updates',
        type: 'checkbox',
        options: [{ label: 'Monthly new songs', value: 'monthly-new-songs' }, { label: 'Quarterly updates', value: 'quarterly-updates' }, { label: 'No updates (legacy library)', value: 'no-updates-legacy-library' }],
      },
      {
        key: 'video-screen',
        label: 'Video Screen',
        type: 'checkbox',
        options: [{ label: 'TV monitor (private room)', value: 'tv-monitor-private-room' }, { label: 'Large projection (stage)', value: 'large-projection-stage' }, { label: 'Individual tablets (self-select)', value: 'individual-tablets-self-select' }, { label: 'No video (lyrics only on screen)', value: 'no-video-lyrics-only-on-screen' }],
      },
      {
        key: 'rating-system',
        label: 'Rating System',
        type: 'checkbox',
        options: [{ label: 'Audience applause meter', value: 'audience-applause-meter' }, { label: 'Scoring (1-100) displayed', value: 'scoring-1-100-displayed' }, { label: 'No scoring (casual)', value: 'no-scoring-casual' }],
      },
      {
        key: 'host-kj-karaoke-jockey',
        label: 'Host / KJ (Karaoke Jockey)',
        type: 'checkbox',
        options: [{ label: 'Professional KJ (announces, manages rotation)', value: 'professional-kj-announces-manages-rotation' }, { label: 'Self-serve (tablet ordering)', value: 'self-serve-tablet-ordering' }, { label: 'Automated (app-based)', value: 'automated-app-based' }],
      },
      {
        key: 'rotation-management',
        label: 'Rotation Management',
        type: 'checkbox',
        options: [{ label: 'Fair rotation (everyone sings once)', value: 'fair-rotation-everyone-sings-once' }, { label: 'Priority for birthdays / first-timers', value: 'priority-for-birthdays-first-timers' }, { label: 'Pay to skip line', value: 'pay-to-skip-line' }],
      },
      {
        key: 'private-room-amenities',
        label: 'Private Room Amenities',
        type: 'checkbox',
        options: [{ label: 'Couch / booth seating', value: 'couch-booth-seating' }, { label: 'Call button for service', value: 'call-button-for-service' }, { label: 'Food & drink ordering from room', value: 'food-drink-ordering-from-room' }, { label: 'Tambourines / props', value: 'tambourines-props' }],
      },
      {
        key: 'hourly-vs-per-song',
        label: 'Hourly vs Per Song',
        type: 'checkbox',
        options: [{ label: 'Hourly room rental', value: 'hourly-room-rental' }, { label: 'Per song (public karaoke)', value: 'per-song-public-karaoke' }, { label: 'All-you-can-sing (cover charge)', value: 'all-you-can-sing-cover-charge' }],
      },
      {
        key: 'background-vocals-included',
        label: 'Background Vocals Included',
        type: 'checkbox',
        options: [{ label: 'Yes (guide vocals on/off)', value: 'yes-guide-vocals-on-off' }, { label: 'No (instrumental only)', value: 'no-instrumental-only' }],
      },
      {
        key: 'key-change-available',
        label: 'Key Change Available',
        type: 'checkbox',
        options: [{ label: 'Yes (remote or KJ)', value: 'yes-remote-or-kj' }, { label: 'Yes (manual only)', value: 'yes-manual-only' }, { label: 'No', value: 'no' }],
      }
    ],
    'jazz-blues': [
      {
        key: 'venue-performer-type',
        label: 'Venue / Performer Type',
        type: 'checkbox',
        options: [{ label: 'Jazz club', value: 'jazz-club' }, { label: 'Blues bar', value: 'blues-bar' }, { label: 'Jazz lounge (dinner & music)', value: 'jazz-lounge-dinner-music' }, { label: 'Blues jam night', value: 'blues-jam-night' }, { label: 'Dixieland / trad jazz', value: 'dixieland-trad-jazz' }, { label: 'Smooth jazz', value: 'smooth-jazz' }, { label: 'Delta blues', value: 'delta-blues' }, { label: 'Chicago blues', value: 'chicago-blues' }, { label: 'Jazz fusion', value: 'jazz-fusion' }],
      },
      {
        key: 'live-music-schedule',
        label: 'Live Music Schedule',
        type: 'checkbox',
        options: [{ label: 'Nightly', value: 'nightly' }, { label: 'Weekends only', value: 'weekends-only' }, { label: 'Monthly (special events)', value: 'monthly-special-events' }, { label: 'By reservation only', value: 'by-reservation-only' }],
      },
      {
        key: 'cover-charge',
        label: 'Cover Charge',
        type: 'checkbox',
        options: [{ label: 'No cover', value: 'no-cover' }, { label: '$5-10', value: '5-10' }, { label: '$10-20', value: '10-20' }, { label: '$20+ (special guest)', value: '20-special-guest' }],
      },
      {
        key: 'jam-session',
        label: 'Jam Session',
        type: 'checkbox',
        options: [{ label: 'Yes (musicians bring instruments)', value: 'yes-musicians-bring-instruments' }, { label: 'Yes (house band + open mic)', value: 'yes-house-band-open-mic' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'artist-level',
        label: 'Artist Level',
        type: 'checkbox',
        options: [{ label: 'Local musicians', value: 'local-musicians' }, { label: 'Regional touring', value: 'regional-touring' }, { label: 'Nationally recognized', value: 'nationally-recognized' }, { label: 'Grammy winner / nominee', value: 'grammy-winner-nominee' }],
      },
      {
        key: 'reservations-for-tables',
        label: 'Reservations for Tables',
        type: 'checkbox',
        options: [{ label: 'Recommended (weekends)', value: 'recommended-weekends' }, { label: 'Required (for dinner seating)', value: 'required-for-dinner-seating' }, { label: 'Walk-ins (bar only)', value: 'walk-ins-bar-only' }],
      },
      {
        key: 'listening-room',
        label: 'Listening Room',
        type: 'checkbox',
        options: [{ label: 'Yes (quiet audience, no talking)', value: 'yes-quiet-audience-no-talking' }, { label: 'Moderate noise (talking allowed)', value: 'moderate-noise-talking-allowed' }, { label: 'Bar atmosphere (loud)', value: 'bar-atmosphere-loud' }],
      },
      {
        key: 'late-night-sets',
        label: 'Late Night Sets',
        type: 'checkbox',
        options: [{ label: '10pm set', value: '10pm-set' }, { label: 'Midnight set', value: 'midnight-set' }, { label: 'After-hours jam (1am+)', value: 'after-hours-jam-1am' }],
      },
      {
        key: 'dance-floor',
        label: 'Dance Floor',
        type: 'checkbox',
        options: [{ label: 'Yes (swing / blues dancing)', value: 'yes-swing-blues-dancing' }, { label: 'No (seated listening only)', value: 'no-seated-listening-only' }, { label: 'Sometimes (depends on night)', value: 'sometimes-depends-on-night' }],
      },
      {
        key: 'brunch-with-jazz',
        label: 'Brunch with Jazz',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'amusement-park': [
      {
        key: 'park-size',
        label: 'Park Size',
        type: 'checkbox',
        options: [{ label: 'Small (local / family owned)', value: 'small-local-family-owned' }, { label: 'Medium (regional park)', value: 'medium-regional-park' }, { label: 'Large (major destination)', value: 'large-major-destination' }, { label: 'Mega-park (multiple days needed)', value: 'mega-park-multiple-days-needed' }],
      },
      {
        key: 'thrill-level',
        label: 'Thrill Level',
        type: 'checkbox',
        options: [{ label: 'Kiddie rides only', value: 'kiddie-rides-only' }, { label: 'Family rides (moderate)', value: 'family-rides-moderate' }, { label: 'Thrill rides (high intensity)', value: 'thrill-rides-high-intensity' }, { label: 'Extreme coasters (inversions, launches)', value: 'extreme-coasters-inversions-launches' }, { label: 'Mix of all levels', value: 'mix-of-all-levels' }],
      },
      {
        key: 'number-of-roller-coasters',
        label: 'Number of Roller Coasters',
        type: 'checkbox',
        options: [{ label: '0', value: '0' }, { label: '1-3', value: '1-3' }, { label: '4-7', value: '4-7' }, { label: '8-12', value: '8-12' }, { label: '13+', value: '13' }],
      },
      {
        key: 'water-rides',
        label: 'Water Rides',
        type: 'checkbox',
        options: [{ label: 'None', value: 'none' }, { label: 'Log flume only', value: 'log-flume-only' }, { label: 'Water coaster', value: 'water-coaster' }, { label: 'Raft rides', value: 'raft-rides' }, { label: 'Splash pad area', value: 'splash-pad-area' }],
      },
      {
        key: 'live-entertainment',
        label: 'Live Entertainment',
        type: 'checkbox',
        options: [{ label: 'Shows (staged)', value: 'shows-staged' }, { label: 'Street performers', value: 'street-performers' }, { label: 'Character meet & greets', value: 'character-meet-greets' }, { label: 'Parade', value: 'parade' }, { label: 'Fireworks', value: 'fireworks' }],
      },
      {
        key: 'season-pass-benefits',
        label: 'Season Pass Benefits',
        type: 'checkbox',
        options: [{ label: 'Free parking', value: 'free-parking' }, { label: 'Discount on food/merch', value: 'discount-on-food-merch' }, { label: 'Exclusive ride times', value: 'exclusive-ride-times' }, { label: 'Bring a friend free days', value: 'bring-a-friend-free-days' }],
      },
      {
        key: 'fast-pass-skip-the-line',
        label: 'Fast Pass / Skip the Line',
        type: 'checkbox',
        options: [{ label: 'Free (virtual queue)', value: 'free-virtual-queue' }, { label: 'Paid (per ride)', value: 'paid-per-ride' }, { label: 'Paid (all day)', value: 'paid-all-day' }, { label: 'VIP tour guide available', value: 'vip-tour-guide-available' }],
      },
      {
        key: 'single-rider-line',
        label: 'Single Rider Line',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'parent-swap-ride-swapping-for-parents-with-kids',
        label: 'Parent Swap (ride swapping for parents with kids)',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'child-care-kids-club',
        label: 'Child Care / Kids Club',
        type: 'checkbox',
        options: [{ label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'height-check-station',
        label: 'Height Check Station',
        type: 'checkbox',
        options: [{ label: 'At entrance', value: 'at-entrance' }, { label: 'At each ride', value: 'at-each-ride' }, { label: 'App with height guide', value: 'app-with-height-guide' }],
      },
      {
        key: 'lost-child-protocol',
        label: 'Lost Child Protocol',
        type: 'checkbox',
        options: [{ label: 'Wristbands with parent phone number', value: 'wristbands-with-parent-phone-number' }, { label: 'Designated meeting point', value: 'designated-meeting-point' }, { label: 'Staff training (visible)', value: 'staff-training-visible' }],
      }
    ],
    'water-park': [
      {
        key: 'park-type',
        label: 'Park Type',
        type: 'checkbox',
        options: [{ label: 'Outdoor water park (seasonal)', value: 'outdoor-water-park-seasonal' }, { label: 'Indoor water park (year-round)', value: 'indoor-water-park-year-round' }, { label: 'Hotel attached', value: 'hotel-attached' }, { label: 'Standalone', value: 'standalone' }, { label: 'Part of larger amusement park', value: 'part-of-larger-amusement-park' }],
      },
      {
        key: 'attractions',
        label: 'Attractions',
        type: 'checkbox',
        options: [{ label: 'Lazy river', value: 'lazy-river' }, { label: 'Wave pool', value: 'wave-pool' }, { label: 'Kiddie splash zone', value: 'kiddie-splash-zone' }, { label: 'Body slides', value: 'body-slides' }, { label: 'Tube slides', value: 'tube-slides' }, { label: 'Bowl slides', value: 'bowl-slides' }, { label: 'Drop slides', value: 'drop-slides' }, { label: 'Raft slides (4-6 person)', value: 'raft-slides-4-6-person' }, { label: 'Mat racers', value: 'mat-racers' }, { label: 'Flow rider (surf simulator)', value: 'flow-rider-surf-simulator' }],
      },
      {
        key: 'water-temperature',
        label: 'Water Temperature',
        type: 'checkbox',
        options: [{ label: 'Heated', value: 'heated' }, { label: 'Unheated (ambient)', value: 'unheated-ambient' }, { label: 'Indoor (climate controlled)', value: 'indoor-climate-controlled' }],
      },
      {
        key: 'life-jackets-provided',
        label: 'Life Jackets Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (free)', value: 'yes-free' }, { label: 'Yes (rental)', value: 'yes-rental' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }, { label: 'Required for non-swimmers', value: 'required-for-non-swimmers' }],
      },
      {
        key: 'lifeguard-coverage',
        label: 'Lifeguard Coverage',
        type: 'checkbox',
        options: [{ label: 'Yes (all attractions)', value: 'yes-all-attractions' }, { label: 'Yes (main pools only)', value: 'yes-main-pools-only' }, { label: 'No (swim at own risk)', value: 'no-swim-at-own-risk' }],
      },
      {
        key: 'depth-markings',
        label: 'Depth Markings',
        type: 'checkbox',
        options: [{ label: 'Clearly posted', value: 'clearly-posted' }, { label: 'Graduated entry (beach style)', value: 'graduated-entry-beach-style' }, { label: 'Lap lanes (deep)', value: 'lap-lanes-deep' }],
      },
      {
        key: 'tube-rental',
        label: 'Tube Rental',
        type: 'checkbox',
        options: [{ label: 'Included with admission', value: 'included-with-admission' }, { label: 'Extra fee ($___)', value: 'extra-fee' }, { label: 'Bring your own (single/double)', value: 'bring-your-own-single-double' }],
      },
      {
        key: 'cabana-rental',
        label: 'Cabana Rental',
        type: 'checkbox',
        options: [{ label: 'Available (half day/full day)', value: 'available-half-day-full-day' }, { label: 'Waitlist only', value: 'waitlist-only' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'food-drink',
        label: 'Food & Drink',
        type: 'checkbox',
        options: [{ label: 'Concessions (fast food)', value: 'concessions-fast-food' }, { label: 'Sit-down restaurant', value: 'sit-down-restaurant' }, { label: 'Bar for adults (21+ area)', value: 'bar-for-adults-21-area' }, { label: 'Outside food not allowed (except medical)', value: 'outside-food-not-allowed-except-medical' }],
      },
      {
        key: 'changing-rooms',
        label: 'Changing Rooms',
        type: 'checkbox',
        options: [{ label: 'Standard', value: 'standard' }, { label: 'Family changing rooms', value: 'family-changing-rooms' }, { label: 'Private stalls available', value: 'private-stalls-available' }],
      },
      {
        key: 'locker-rental',
        label: 'Locker Rental',
        type: 'checkbox',
        options: [{ label: 'Small ($___)', value: 'small' }, { label: 'Large ($___)', value: 'large' }, { label: 'All day or hourly', value: 'all-day-or-hourly' }],
      },
      {
        key: 'footwear-policy',
        label: 'Footwear Policy',
        type: 'checkbox',
        options: [{ label: 'Barefoot only (pools)', value: 'barefoot-only-pools' }, { label: 'Water shoes allowed', value: 'water-shoes-allowed' }, { label: 'Sandals in concession areas', value: 'sandals-in-concession-areas' }],
      }
    ],
    'aquarium': [
      {
        key: 'aquarium-size',
        label: 'Aquarium Size',
        type: 'checkbox',
        options: [{ label: 'Small (local / boutique)', value: 'small-local-boutique' }, { label: 'Medium (regional)', value: 'medium-regional' }, { label: 'Large (major city)', value: 'large-major-city' }, { label: 'Mega (world class)', value: 'mega-world-class' }],
      },
      {
        key: 'notable-exhibits',
        label: 'Notable Exhibits',
        type: 'checkbox',
        options: [{ label: 'Tunnel walkthrough', value: 'tunnel-walkthrough' }, { label: 'Touch tank (stingrays, starfish, etc.)', value: 'touch-tank-stingrays-starfish-etc' }, { label: 'Jellyfish gallery', value: 'jellyfish-gallery' }, { label: 'Shark tank', value: 'shark-tank' }, { label: 'Coral reef display', value: 'coral-reef-display' }, { label: 'Amazon / river exhibit', value: 'amazon-river-exhibit' }, { label: 'Penguin habitat', value: 'penguin-habitat' }, { label: 'Otter exhibit', value: 'otter-exhibit' }, { label: 'Seals / sea lions', value: 'seals-sea-lions' }, { label: 'Manatees', value: 'manatees' }, { label: 'Deep sea / bioluminescence', value: 'deep-sea-bioluminescence' }],
      },
      {
        key: 'animal-encounters',
        label: 'Animal Encounters',
        type: 'checkbox',
        options: [{ label: 'Behind the scenes tour', value: 'behind-the-scenes-tour' }, { label: 'Animal feeding (extra fee)', value: 'animal-feeding-extra-fee' }, { label: 'Penguin encounter', value: 'penguin-encounter' }, { label: 'Seal / sea lion encounter', value: 'seal-sea-lion-encounter' }, { label: 'Shark dive (certified)', value: 'shark-dive-certified' }, { label: 'Snorkel with rays', value: 'snorkel-with-rays' }],
      },
      {
        key: 'shows-presentations',
        label: 'Shows / Presentations',
        type: 'checkbox',
        options: [{ label: 'Dive show (feeding)', value: 'dive-show-feeding' }, { label: 'Trainer talk', value: 'trainer-talk' }, { label: 'Film / 4D theater', value: 'film-4d-theater' }, { label: 'Story time (children)', value: 'story-time-children' }],
      },
      {
        key: 'sleepovers',
        label: 'Sleepovers',
        type: 'checkbox',
        options: [{ label: 'Yes (scouts / groups)', value: 'yes-scouts-groups' }, { label: 'Yes (family sleepovers)', value: 'yes-family-sleepovers' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'stroller-access',
        label: 'Stroller Access',
        type: 'checkbox',
        options: [{ label: 'Fully accessible', value: 'fully-accessible' }, { label: 'Limited (some narrow areas)', value: 'limited-some-narrow-areas' }, { label: 'Stroller parking at certain exhibits', value: 'stroller-parking-at-certain-exhibits' }],
      },
      {
        key: 'nursing-room',
        label: 'Nursing Room',
        type: 'checkbox',
        options: [{ label: 'Yes (private)', value: 'yes-private' }, { label: 'Yes (couch / chair)', value: 'yes-couch-chair' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'sensory-friendly-hours',
        label: 'Sensory Friendly Hours',
        type: 'checkbox',
        options: [{ label: 'Yes (lower lights, quieter)', value: 'yes-lower-lights-quieter' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'membership',
        label: 'Membership',
        type: 'checkbox',
        options: [{ label: 'Yes (free admission for 1 year)', value: 'yes-free-admission-for-1-year' }, { label: 'Yes (plus guest passes)', value: 'yes-plus-guest-passes' }, { label: 'No', value: 'no' }],
      }
    ],
    'haunted-house': [
      {
        key: 'haunted-house-type',
        label: 'Haunted House Type',
        type: 'checkbox',
        options: [{ label: 'Traditional walkthrough', value: 'traditional-walkthrough' }, { label: 'Hayride haunted', value: 'hayride-haunted' }, { label: 'Trail / outdoor haunt', value: 'trail-outdoor-haunt' }, { label: 'Asylum / hospital theme', value: 'asylum-hospital-theme' }, { label: 'Clown / circus theme', value: 'clown-circus-theme' }, { label: 'Pirate / ship theme', value: 'pirate-ship-theme' }, { label: 'Zombie / apocalypse', value: 'zombie-apocalypse' }, { label: 'Historical / ghost (real history)', value: 'historical-ghost-real-history' }, { label: 'Interactive (actors touch you)', value: 'interactive-actors-touch-you' }, { label: 'Non-contact (actors cannot touch)', value: 'non-contact-actors-cannot-touch' }],
      },
      {
        key: 'fear-level',
        label: 'Fear Level',
        type: 'checkbox',
        options: [{ label: 'Mild (family friendly)', value: 'mild-family-friendly' }, { label: 'Moderate (jump scares)', value: 'moderate-jump-scares' }, { label: 'Intense (pursuit, gore)', value: 'intense-pursuit-gore' }, { label: 'Extreme (physical contact, restraints)', value: 'extreme-physical-contact-restraints' }, { label: 'Choose your own level (different nights)', value: 'choose-your-own-level-different-nights' }],
      },
      {
        key: 'age-recommendation',
        label: 'Age Recommendation',
        type: 'checkbox',
        options: [{ label: 'All ages (daytime)', value: 'all-ages-daytime' }, { label: '8+ (with adult)', value: '8-with-adult' }, { label: '12+', value: '12' }, { label: '16+', value: '16' }, { label: '18+', value: '18' }, { label: 'Adult only nights', value: 'adult-only-nights' }],
      },
      {
        key: 'light-level',
        label: 'Light Level',
        type: 'checkbox',
        options: [{ label: 'Fully lit (family friendly)', value: 'fully-lit-family-friendly' }, { label: 'Dim / moody', value: 'dim-moody' }, { label: 'Dark (pitch black sections)', value: 'dark-pitch-black-sections' }, { label: 'Glow stick / flashlight needed', value: 'glow-stick-flashlight-needed' }],
      },
      {
        key: 'special-effects',
        label: 'Special Effects',
        type: 'checkbox',
        options: [{ label: 'Fog machines', value: 'fog-machines' }, { label: 'Strobe lights', value: 'strobe-lights' }, { label: 'Animatronics', value: 'animatronics' }, { label: 'Air blasts', value: 'air-blasts' }, { label: 'Water spray', value: 'water-spray' }, { label: 'Sound effects (loud)', value: 'sound-effects-loud' }, { label: 'Smell effects', value: 'smell-effects' }, { label: 'Virtual reality elements', value: 'virtual-reality-elements' }],
      },
      {
        key: 'waiting-area-entertainment',
        label: 'Waiting Area Entertainment',
        type: 'checkbox',
        options: [{ label: 'Fire pits', value: 'fire-pits' }, { label: 'Live music', value: 'live-music' }, { label: 'Food trucks', value: 'food-trucks' }, { label: 'Scary movie screening', value: 'scary-movie-screening' }, { label: 'Photo ops', value: 'photo-ops' }],
      },
      {
        key: 'fast-pass-skip-the-line',
        label: 'Fast Pass / Skip the Line',
        type: 'checkbox',
        options: [{ label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'Yes (free with season pass)', value: 'yes-free-with-season-pass' }, { label: 'No (everyone waits)', value: 'no-everyone-waits' }],
      },
      {
        key: 'group-size',
        label: 'Group Size',
        type: 'checkbox',
        options: [{ label: 'Small group (2-4)', value: 'small-group-2-4' }, { label: 'Large group (5-10)', value: 'large-group-5-10' }, { label: 'Private walkthrough (extra)', value: 'private-walkthrough-extra' }],
      },
      {
        key: 'run-time',
        label: 'Run Time',
        type: 'checkbox',
        options: [{ label: 'Under 10 minutes', value: 'under-10-minutes' }, { label: '10-20 minutes', value: '10-20-minutes' }, { label: '20-30 minutes', value: '20-30-minutes' }, { label: '30+ minutes', value: '30-minutes' }],
      },
      {
        key: 'emergency-exit',
        label: 'Emergency Exit',
        type: 'checkbox',
        options: [{ label: 'Clearly marked', value: 'clearly-marked' }, { label: 'Staff can escort out', value: 'staff-can-escort-out' }, { label: 'Panic buttons available', value: 'panic-buttons-available' }],
      },
      {
        key: 'warning-signs-posted',
        label: 'Warning Signs Posted',
        type: 'checkbox',
        options: [{ label: 'Yes (before entrance)', value: 'yes-before-entrance' }, { label: 'Yes (ticket disclaimer)', value: 'yes-ticket-disclaimer' }, { label: 'No (surprise element)', value: 'no-surprise-element' }],
      }
    ],
    'escape-rooms': [
      {
        key: 'room-theme',
        label: 'Room Theme',
        type: 'checkbox',
        options: [{ label: 'Mystery / detective', value: 'mystery-detective' }, { label: 'Horror / thriller', value: 'horror-thriller' }, { label: 'Sci-fi / space', value: 'sci-fi-space' }, { label: 'Fantasy / medieval', value: 'fantasy-medieval' }, { label: 'Prison break', value: 'prison-break' }, { label: 'Heist / bank robbery', value: 'heist-bank-robbery' }, { label: 'Lab / experiment', value: 'lab-experiment' }, { label: 'Adventure / jungle', value: 'adventure-jungle' }, { label: 'Historical', value: 'historical' }, { label: 'Holiday themed (seasonal)', value: 'holiday-themed-seasonal' }],
      },
      {
        key: 'difficulty-level',
        label: 'Difficulty Level',
        type: 'checkbox',
        options: [{ label: 'Beginner (70%+ success rate)', value: 'beginner-70-success-rate' }, { label: 'Intermediate (40-70% success)', value: 'intermediate-40-70-success' }, { label: 'Advanced (under 40% success)', value: 'advanced-under-40-success' }, { label: 'Expert (under 10% success)', value: 'expert-under-10-success' }],
      },
      {
        key: 'number-of-rooms',
        label: 'Number of Rooms',
        type: 'checkbox',
        options: [{ label: 'Single room', value: 'single-room' }, { label: '2 rooms (connected)', value: '2-rooms-connected' }, { label: '3+ rooms (multi-stage)', value: '3-rooms-multi-stage' }, { label: 'Entire facility (1 hour+)', value: 'entire-facility-1-hour' }],
      },
      {
        key: 'team-size',
        label: 'Team Size',
        type: 'checkbox',
        options: [{ label: '2-4 players', value: '2-4-players' }, { label: '4-6 players', value: '4-6-players' }, { label: '6-8 players', value: '6-8-players' }, { label: '8-10 players', value: '8-10-players' }, { label: '10+ players (multiple rooms, competitive)', value: '10-players-multiple-rooms-competitive' }],
      },
      {
        key: 'time-limit',
        label: 'Time Limit',
        type: 'checkbox',
        options: [{ label: '30 minutes (mini room)', value: '30-minutes-mini-room' }, { label: '45 minutes', value: '45-minutes' }, { label: '60 minutes (standard)', value: '60-minutes-standard' }, { label: '75 minutes', value: '75-minutes' }, { label: '90+ minutes', value: '90-minutes' }],
      },
      {
        key: 'clue-system',
        label: 'Clue System',
        type: 'checkbox',
        options: [{ label: 'Unlimited clues (monitor)', value: 'unlimited-clues-monitor' }, { label: 'Limited clues (3-5 hints)', value: 'limited-clues-3-5-hints' }, { label: 'No clues (true challenge)', value: 'no-clues-true-challenge' }, { label: 'Actor in room can give clues', value: 'actor-in-room-can-give-clues' }],
      },
      {
        key: 'game-master-interaction',
        label: 'Game Master Interaction',
        type: 'checkbox',
        options: [{ label: 'Live actor in room', value: 'live-actor-in-room' }, { label: 'Voice over intercom', value: 'voice-over-intercom' }, { label: 'Text / screen only', value: 'text-screen-only' }, { label: 'No interaction', value: 'no-interaction' }],
      },
      {
        key: 'physical-requirements',
        label: 'Physical Requirements',
        type: 'checkbox',
        options: [{ label: 'Seated only', value: 'seated-only' }, { label: 'Moderate (walking, reaching)', value: 'moderate-walking-reaching' }, { label: 'Active (crawling, climbing)', value: 'active-crawling-climbing' }, { label: 'Intense (running, lifting)', value: 'intense-running-lifting' }],
      },
      {
        key: 'lock-types',
        label: 'Lock Types',
        type: 'checkbox',
        options: [{ label: 'Combination locks', value: 'combination-locks' }, { label: 'Key locks', value: 'key-locks' }, { label: 'Magnetic locks', value: 'magnetic-locks' }, { label: 'RFID / electronic', value: 'rfid-electronic' }, { label: 'Puzzle-based (no locks)', value: 'puzzle-based-no-locks' }],
      },
      {
        key: 'private-booking',
        label: 'Private Booking',
        type: 'checkbox',
        options: [{ label: 'Yes (your group only)', value: 'yes-your-group-only' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No (may be paired with strangers)', value: 'no-may-be-paired-with-strangers' }],
      },
      {
        key: 'scare-factor',
        label: 'Scare Factor',
        type: 'checkbox',
        options: [{ label: 'No scares (puzzle only)', value: 'no-scares-puzzle-only' }, { label: 'Mild (spooky atmosphere)', value: 'mild-spooky-atmosphere' }, { label: 'Moderate (jump scares)', value: 'moderate-jump-scares' }, { label: 'High (actors, chase, dark)', value: 'high-actors-chase-dark' }],
      },
      {
        key: 'age-requirements',
        label: 'Age Requirements',
        type: 'checkbox',
        options: [{ label: 'Under 12 with adult', value: 'under-12-with-adult' }, { label: '12+ alone', value: '12-alone' }, { label: '14+', value: '14' }, { label: '16+', value: '16' }, { label: '18+', value: '18' }],
      },
      {
        key: 'spectator-area',
        label: 'Spectator Area',
        type: 'checkbox',
        options: [{ label: 'Yes (viewing screen)', value: 'yes-viewing-screen' }, { label: 'Yes (glass window)', value: 'yes-glass-window' }, { label: 'No (waiting room only)', value: 'no-waiting-room-only' }],
      },
      {
        key: 'corporate-team-building',
        label: 'Corporate / Team Building',
        type: 'checkbox',
        options: [{ label: 'Yes (custom scenarios)', value: 'yes-custom-scenarios' }, { label: 'Yes (standard rooms only)', value: 'yes-standard-rooms-only' }, { label: 'No', value: 'no' }],
      }
    ],
    'laser-tag': [
      {
        key: 'arena-type',
        label: 'Arena Type',
        type: 'checkbox',
        options: [{ label: 'Indoor blacklight arena', value: 'indoor-blacklight-arena' }, { label: 'Outdoor field', value: 'outdoor-field' }, { label: 'Multi-level (stairs, ramps)', value: 'multi-level-stairs-ramps' }, { label: 'Maze / corridors', value: 'maze-corridors' }, { label: 'Open layout', value: 'open-layout' }, { label: 'Themed (space, jungle, etc.)', value: 'themed-space-jungle-etc' }],
      },
      {
        key: 'gear-type',
        label: 'Gear Type',
        type: 'checkbox',
        options: [{ label: 'Vest + phaser (chest sensors)', value: 'vest-phaser-chest-sensors' }, { label: 'Helmet + gun', value: 'helmet-gun' }, { label: 'Gun only (tactical)', value: 'gun-only-tactical' }, { label: 'Phaser only (Star Trek style)', value: 'phaser-only-star-trek-style' }],
      },
      {
        key: 'sensor-locations',
        label: 'Sensor Locations',
        type: 'checkbox',
        options: [{ label: 'Chest only', value: 'chest-only' }, { label: 'Chest + back', value: 'chest-back' }, { label: 'Chest + back + gun', value: 'chest-back-gun' }, { label: 'Head + chest', value: 'head-chest' }, { label: 'Full body (arms, legs)', value: 'full-body-arms-legs' }],
      },
      {
        key: 'team-play-options',
        label: 'Team Play Options',
        type: 'checkbox',
        options: [{ label: 'Free-for-all', value: 'free-for-all' }, { label: 'Red vs Blue', value: 'red-vs-blue' }, { label: 'Multiple teams (colors)', value: 'multiple-teams-colors' }, { label: 'VIP / protect the president', value: 'vip-protect-the-president' }, { label: 'Capture the flag', value: 'capture-the-flag' }],
      },
      {
        key: 'game-length',
        label: 'Game Length',
        type: 'checkbox',
        options: [{ label: '10 minutes', value: '10-minutes' }, { label: '15 minutes', value: '15-minutes' }, { label: '20 minutes', value: '20-minutes' }, { label: '30 minutes', value: '30-minutes' }],
      },
      {
        key: 'age-restrictions',
        label: 'Age Restrictions',
        type: 'checkbox',
        options: [{ label: 'Under 6 with adult', value: 'under-6-with-adult' }, { label: '6+ alone', value: '6-alone' }, { label: '8+', value: '8' }, { label: '12+', value: '12' }, { label: 'Adults only (18+ nights)', value: 'adults-only-18-nights' }],
      },
      {
        key: 'blacklight-effects',
        label: 'Blacklight Effects',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Glow party style', value: 'glow-party-style' }, { label: 'No (regular lights)', value: 'no-regular-lights' }],
      },
      {
        key: 'fog-haze',
        label: 'Fog / Haze',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (asthma/allergy concerns)', value: 'no-asthma-allergy-concerns' }],
      },
      {
        key: 'electronic-scoring',
        label: 'Electronic Scoring',
        type: 'checkbox',
        options: [{ label: 'Real-time display', value: 'real-time-display' }, { label: 'End-of-game printout', value: 'end-of-game-printout' }, { label: 'Mobile app tracking', value: 'mobile-app-tracking' }, { label: 'No scoring (just fun)', value: 'no-scoring-just-fun' }],
      },
      {
        key: 'party-packages',
        label: 'Party Packages',
        type: 'checkbox',
        options: [{ label: 'Includes pizza, drinks', value: 'includes-pizza-drinks' }, { label: 'Private arena rental', value: 'private-arena-rental' }, { label: 'Party host provided', value: 'party-host-provided' }, { label: 'Goody bags available', value: 'goody-bags-available' }],
      },
      {
        key: 'reservations-required',
        label: 'Reservations Required',
        type: 'checkbox',
        options: [{ label: 'For groups (10+)', value: 'for-groups-10' }, { label: 'For weekends', value: 'for-weekends' }, { label: 'Walk-ins welcome', value: 'walk-ins-welcome' }],
      }
    ],
    'planetarium': [
      {
        key: 'dome-size',
        label: 'Dome Size',
        type: 'checkbox',
        options: [{ label: 'Small (under 30 ft)', value: 'small-under-30-ft' }, { label: 'Medium (30-50 ft)', value: 'medium-30-50-ft' }, { label: 'Large (50-70 ft)', value: 'large-50-70-ft' }, { label: 'Giant (70+ ft)', value: 'giant-70-ft' }],
      },
      {
        key: 'seating-capacity',
        label: 'Seating Capacity',
        type: 'checkbox',
        options: [{ label: 'Under 50', value: 'under-50' }, { label: '50-100', value: '50-100' }, { label: '100-200', value: '100-200' }, { label: '200-300', value: '200-300' }, { label: '300+', value: '300' }],
      },
      {
        key: 'projection-system',
        label: 'Projection System',
        type: 'checkbox',
        options: [{ label: 'Traditional optical (stars)', value: 'traditional-optical-stars' }, { label: 'Digital fulldome (video)', value: 'digital-fulldome-video' }, { label: 'Hybrid (both)', value: 'hybrid-both' }, { label: 'Laser projection', value: 'laser-projection' }],
      },
      {
        key: 'live-presenter',
        label: 'Live Presenter',
        type: 'checkbox',
        options: [{ label: 'Yes (astronomer-led)', value: 'yes-astronomer-led' }, { label: 'Yes (automated with narrator)', value: 'yes-automated-with-narrator' }, { label: 'Pre-recorded show only', value: 'pre-recorded-show-only' }],
      },
      {
        key: 'show-types',
        label: 'Show Types',
        type: 'checkbox',
        options: [{ label: 'Night sky (current season)', value: 'night-sky-current-season' }, { label: 'Deep space (galaxies, nebulae)', value: 'deep-space-galaxies-nebulae' }, { label: 'Solar system tour', value: 'solar-system-tour' }, { label: 'Black holes / physics', value: 'black-holes-physics' }, { label: 'Aurora / space weather', value: 'aurora-space-weather' }, { label: 'NASA / astronomy news update', value: 'nasa-astronomy-news-update' }, { label: 'Laser light show (music)', value: 'laser-light-show-music' }, { label: 'Children\'s shows (characters)', value: 'children-s-shows-characters' }, { label: 'Foreign language shows (Spanish, etc.)', value: 'foreign-language-shows-spanish-etc' }],
      },
      {
        key: 'telescope-viewing',
        label: 'Telescope Viewing',
        type: 'checkbox',
        options: [{ label: 'After show (weather permitting)', value: 'after-show-weather-permitting' }, { label: 'Separate ticketed event', value: 'separate-ticketed-event' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'workshops-classes',
        label: 'Workshops / Classes',
        type: 'checkbox',
        options: [{ label: 'Yes (kids)', value: 'yes-kids' }, { label: 'Yes (adults)', value: 'yes-adults' }, { label: 'School group bookings', value: 'school-group-bookings' }],
      },
      {
        key: 'sensory-friendly-shows',
        label: 'Sensory Friendly Shows',
        type: 'checkbox',
        options: [{ label: 'Lower volume, lights up', value: 'lower-volume-lights-up' }, { label: 'Yes (specific times)', value: 'yes-specific-times' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'reclining-seats',
        label: 'Reclining Seats',
        type: 'checkbox',
        options: [{ label: 'Yes (all seats)', value: 'yes-all-seats' }, { label: 'Yes (some sections)', value: 'yes-some-sections' }, { label: 'No (standard theater seats)', value: 'no-standard-theater-seats' }],
      },
      {
        key: 'birthday-parties',
        label: 'Birthday Parties',
        type: 'checkbox',
        options: [{ label: 'Private show available', value: 'private-show-available' }, { label: 'Party room rental', value: 'party-room-rental' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'gift-shop',
        label: 'Gift Shop',
        type: 'checkbox',
        options: [{ label: 'Astronomy themed', value: 'astronomy-themed' }, { label: 'General science', value: 'general-science' }, { label: 'No', value: 'no' }],
      }
    ],
    'drive-in-theater': [
      {
        key: 'screen-size',
        label: 'Screen Size',
        type: 'checkbox',
        options: [{ label: 'Small (under 40 ft)', value: 'small-under-40-ft' }, { label: 'Medium (40-60 ft)', value: 'medium-40-60-ft' }, { label: 'Large (60-80 ft)', value: 'large-60-80-ft' }, { label: 'Double screen (two movies)', value: 'double-screen-two-movies' }],
      },
      {
        key: 'audio-method',
        label: 'Audio Method',
        type: 'checkbox',
        options: [{ label: 'FM radio (tune in)', value: 'fm-radio-tune-in' }, { label: 'External speakers (post-mounted)', value: 'external-speakers-post-mounted' }, { label: 'App-based (Bluetooth)', value: 'app-based-bluetooth' }, { label: 'Portable radio rental available', value: 'portable-radio-rental-available' }],
      },
      {
        key: 'car-capacity',
        label: 'Car Capacity',
        type: 'checkbox',
        options: [{ label: 'Under 50 cars', value: 'under-50-cars' }, { label: '50-150 cars', value: '50-150-cars' }, { label: '150-300 cars', value: '150-300-cars' }, { label: '300+ cars', value: '300-cars' }],
      },
      {
        key: 'movie-types',
        label: 'Movie Types',
        type: 'checkbox',
        options: [{ label: 'First-run movies', value: 'first-run-movies' }, { label: 'Second-run (cheaper)', value: 'second-run-cheaper' }, { label: 'Classic films', value: 'classic-films' }, { label: 'Double feature (two movies)', value: 'double-feature-two-movies' }, { label: 'Triple feature', value: 'triple-feature' }, { label: 'Seasonal / holiday specials', value: 'seasonal-holiday-specials' }],
      },
      {
        key: 'sound-quality',
        label: 'Sound Quality',
        type: 'checkbox',
        options: [{ label: 'Good (strong FM signal)', value: 'good-strong-fm-signal' }, { label: 'Fair (interference possible)', value: 'fair-interference-possible' }, { label: 'Poor (bring portable speaker)', value: 'poor-bring-portable-speaker' }],
      },
      {
        key: 'opening-times',
        label: 'Opening Times',
        type: 'checkbox',
        options: [{ label: 'Seasonal (summer only)', value: 'seasonal-summer-only' }, { label: 'Year-round', value: 'year-round' }, { label: 'Weekends only', value: 'weekends-only' }],
      },
      {
        key: 'weather-policy',
        label: 'Weather Policy',
        type: 'checkbox',
        options: [{ label: 'Rain or shine (car audio ok)', value: 'rain-or-shine-car-audio-ok' }, { label: 'Cancels for heavy rain/thunder', value: 'cancels-for-heavy-rain-thunder' }, { label: 'Reschedules announced day-of', value: 'reschedules-announced-day-of' }],
      },
      {
        key: 'concessions',
        label: 'Concessions',
        type: 'checkbox',
        options: [{ label: 'Classic (popcorn, candy, soda)', value: 'classic-popcorn-candy-soda' }, { label: 'Full snack bar (burgers, hot dogs)', value: 'full-snack-bar-burgers-hot-dogs' }, { label: 'Pizza delivery accepted', value: 'pizza-delivery-accepted' }, { label: 'Outside food allowed', value: 'outside-food-allowed' }],
      },
      {
        key: 'payment',
        label: 'Payment',
        type: 'checkbox',
        options: [{ label: 'Per car (flat rate)', value: 'per-car-flat-rate' }, { label: 'Per person', value: 'per-person' }, { label: 'Online ticket required', value: 'online-ticket-required' }, { label: 'Cash only at gate', value: 'cash-only-at-gate' }],
      },
      {
        key: 'arrival-time',
        label: 'Arrival Time',
        type: 'checkbox',
        options: [{ label: 'Gates open 1 hour before', value: 'gates-open-1-hour-before' }, { label: 'First come, first parked', value: 'first-come-first-parked' }, { label: 'Reserved spots (extra fee)', value: 'reserved-spots-extra-fee' }],
      },
      {
        key: 'car-exit-policy',
        label: 'Car Exit Policy',
        type: 'checkbox',
        options: [{ label: 'Can leave anytime (headlights off)', value: 'can-leave-anytime-headlights-off' }, { label: 'Must stay until end', value: 'must-stay-until-end' }, { label: 'Exit only between movies', value: 'exit-only-between-movies' }],
      },
      {
        key: 'battery-jump-service',
        label: 'Battery Jump Service',
        type: 'checkbox',
        options: [{ label: 'Yes (free)', value: 'yes-free' }, { label: 'Yes (fee)', value: 'yes-fee' }, { label: 'No (call roadside)', value: 'no-call-roadside' }],
      },
      {
        key: 'radio-transmitter-range',
        label: 'Radio Transmitter Range',
        type: 'checkbox',
        options: [{ label: 'Strong (entire lot)', value: 'strong-entire-lot' }, { label: 'Medium (park near screen)', value: 'medium-park-near-screen' }, { label: 'Weak (bring booster)', value: 'weak-bring-booster' }],
      }
    ],
    'zipline-center': [
      {
        key: 'course-type',
        label: 'Course Type',
        type: 'checkbox',
        options: [{ label: 'Single zipline (one ride)', value: 'single-zipline-one-ride' }, { label: 'Multiple ziplines (2-5)', value: 'multiple-ziplines-2-5' }, { label: 'Canopy tour (6-10)', value: 'canopy-tour-6-10' }, { label: 'Mega zipline (3,000+ ft)', value: 'mega-zipline-3-000-ft' }],
      },
      {
        key: 'height-level',
        label: 'Height Level',
        type: 'checkbox',
        options: [{ label: 'Low (under 30 ft)', value: 'low-under-30-ft' }, { label: 'Medium (30-60 ft)', value: 'medium-30-60-ft' }, { label: 'High (60-100 ft)', value: 'high-60-100-ft' }, { label: 'Extreme (100+ ft)', value: 'extreme-100-ft' }],
      },
      {
        key: 'speed',
        label: 'Speed',
        type: 'checkbox',
        options: [{ label: 'Slow (scenic)', value: 'slow-scenic' }, { label: 'Moderate (standard)', value: 'moderate-standard' }, { label: 'Fast (thrill)', value: 'fast-thrill' }, { label: 'Racing ziplines (side by side)', value: 'racing-ziplines-side-by-side' }],
      },
      {
        key: 'weight-requirements',
        label: 'Weight Requirements',
        type: 'checkbox',
        options: [{ label: 'Under 250 lbs', value: 'under-250-lbs' }, { label: 'Under 300 lbs', value: 'under-300-lbs' }, { label: 'Under 350 lbs', value: 'under-350-lbs' }, { label: 'No maximum (heavy-duty)', value: 'no-maximum-heavy-duty' }, { label: 'Minimum weight: ___ lbs', value: 'minimum-weight-lbs' }],
      },
      {
        key: 'age-requirements',
        label: 'Age Requirements',
        type: 'checkbox',
        options: [{ label: 'Under 6 not allowed', value: 'under-6-not-allowed' }, { label: '6+ with adult', value: '6-with-adult' }, { label: '10+ alone', value: '10-alone' }, { label: '16+ alone', value: '16-alone' }],
      },
      {
        key: 'physical-requirements',
        label: 'Physical Requirements',
        type: 'checkbox',
        options: [{ label: 'Minimal (harness only)', value: 'minimal-harness-only' }, { label: 'Moderate (climbing stairs)', value: 'moderate-climbing-stairs' }, { label: 'Active (ladder / rock climb to start)', value: 'active-ladder-rock-climb-to-start' }],
      },
      {
        key: 'braking-system',
        label: 'Braking System',
        type: 'checkbox',
        options: [{ label: 'Automatic (magnetic / spring)', value: 'automatic-magnetic-spring' }, { label: 'Manual (glove braking)', value: 'manual-glove-braking' }, { label: 'Guide catches you', value: 'guide-catches-you' }, { label: 'Self-braking (learn first)', value: 'self-braking-learn-first' }],
      },
      {
        key: 'harness-type',
        label: 'Harness Type',
        type: 'checkbox',
        options: [{ label: 'Seat harness (comfortable)', value: 'seat-harness-comfortable' }, { label: 'Chest harness (safety for small kids)', value: 'chest-harness-safety-for-small-kids' }, { label: 'Pants harness (tight around legs)', value: 'pants-harness-tight-around-legs' }],
      },
      {
        key: 'training-included',
        label: 'Training Included',
        type: 'checkbox',
        options: [{ label: 'Yes (mandatory)', value: 'yes-mandatory' }, { label: 'Yes (briefing only)', value: 'yes-briefing-only' }, { label: 'No (must have prior experience)', value: 'no-must-have-prior-experience' }],
      },
      {
        key: 'photo-video-package',
        label: 'Photo / Video Package',
        type: 'checkbox',
        options: [{ label: 'GoPro rental available', value: 'gopro-rental-available' }, { label: 'Professional photo taken', value: 'professional-photo-taken' }, { label: 'Friend can film from ground', value: 'friend-can-film-from-ground' }],
      },
      {
        key: 'scenic-value',
        label: 'Scenic Value',
        type: 'checkbox',
        options: [{ label: 'Forest / trees', value: 'forest-trees' }, { label: 'Mountain / canyon', value: 'mountain-canyon' }, { label: 'Water (over lake or river)', value: 'water-over-lake-or-river' }, { label: 'Urban / man-made', value: 'urban-man-made' }, { label: 'Night zipline (lights)', value: 'night-zipline-lights' }],
      },
      {
        key: 'reservations',
        label: 'Reservations',
        type: 'checkbox',
        options: [{ label: 'Required (weekends)', value: 'required-weekends' }, { label: 'Recommended', value: 'recommended' }, { label: 'Walk-ins limited', value: 'walk-ins-limited' }],
      }
    ],
    'challenge-courses-center': [
      {
        key: 'course-type',
        label: 'Course Type',
        type: 'checkbox',
        options: [{ label: 'Ropes course (low)', value: 'ropes-course-low' }, { label: 'Ropes course (high)', value: 'ropes-course-high' }, { label: 'Climbing wall', value: 'climbing-wall' }, { label: 'Obstacle course (military style)', value: 'obstacle-course-military-style' }, { label: 'Ninja warrior style', value: 'ninja-warrior-style' }, { label: 'Team building course', value: 'team-building-course' }, { label: 'Aerial adventure park (multiple elements)', value: 'aerial-adventure-park-multiple-elements' }],
      },
      {
        key: 'high-ropes-elements',
        label: 'High Ropes Elements',
        type: 'checkbox',
        options: [{ label: 'Balance beams', value: 'balance-beams' }, { label: 'Cargo nets', value: 'cargo-nets' }, { label: 'Log steps', value: 'log-steps' }, { label: 'Swinging logs', value: 'swinging-logs' }, { label: 'Tightrope', value: 'tightrope' }, { label: 'Zip line (end of course)', value: 'zip-line-end-of-course' }, { label: 'Tarzan swing', value: 'tarzan-swing' }, { label: 'Leap of faith', value: 'leap-of-faith' }],
      },
      {
        key: 'safety-system',
        label: 'Safety System',
        type: 'checkbox',
        options: [{ label: 'Continuous belay (never unhook)', value: 'continuous-belay-never-unhook' }, { label: 'Double lanyard (clip/unclip)', value: 'double-lanyard-clip-unclip' }, { label: 'Staff belay (climbing wall)', value: 'staff-belay-climbing-wall' }, { label: 'Auto-belay', value: 'auto-belay' }],
      },
      {
        key: 'height-of-high-ropes',
        label: 'Height of High Ropes',
        type: 'checkbox',
        options: [{ label: '10-20 ft', value: '10-20-ft' }, { label: '20-30 ft', value: '20-30-ft' }, { label: '30-40 ft', value: '30-40-ft' }, { label: '40+ ft', value: '40-ft' }],
      },
      {
        key: 'harness-provided',
        label: 'Harness Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (fitted by staff)', value: 'yes-fitted-by-staff' }, { label: 'Yes (self-fit with check)', value: 'yes-self-fit-with-check' }, { label: 'Bring your own (inspected)', value: 'bring-your-own-inspected' }],
      },
      {
        key: 'time-limit',
        label: 'Time Limit',
        type: 'checkbox',
        options: [{ label: '1 hour session', value: '1-hour-session' }, { label: '2 hours', value: '2-hours' }, { label: '3 hours', value: '3-hours' }, { label: 'All day (open to close)', value: 'all-day-open-to-close' }],
      },
      {
        key: 'age-grade-requirements',
        label: 'Age / Grade Requirements',
        type: 'checkbox',
        options: [{ label: 'Must reach ___ height (hand test)', value: 'must-reach-height-hand-test' }, { label: 'Kindergarten (low ropes only)', value: 'kindergarten-low-ropes-only' }, { label: 'Elementary (with adult)', value: 'elementary-with-adult' }, { label: 'Middle school +', value: 'middle-school' }, { label: 'Adult only nights', value: 'adult-only-nights' }],
      },
      {
        key: 'waiver-required',
        label: 'Waiver Required',
        type: 'checkbox',
        options: [{ label: 'Yes (online in advance)', value: 'yes-online-in-advance' }, { label: 'Yes (paper on-site)', value: 'yes-paper-on-site' }, { label: 'Parent must sign for minors', value: 'parent-must-sign-for-minors' }],
      },
      {
        key: 'spectator-area',
        label: 'Spectator Area',
        type: 'checkbox',
        options: [{ label: 'Benches / seating', value: 'benches-seating' }, { label: 'Covered viewing', value: 'covered-viewing' }, { label: 'Food / drinks available', value: 'food-drinks-available' }],
      },
      {
        key: 'group-packages',
        label: 'Group Packages',
        type: 'checkbox',
        options: [{ label: 'Youth groups', value: 'youth-groups' }, { label: 'Corporate team building', value: 'corporate-team-building' }, { label: 'Birthday parties', value: 'birthday-parties' }],
      },
      {
        key: 'certified-instructors',
        label: 'Certified Instructors',
        type: 'checkbox',
        options: [{ label: 'Yes (ACCT certified)', value: 'yes-acct-certified' }, { label: 'Yes (in-house training)', value: 'yes-in-house-training' }, { label: 'No (self-guided)', value: 'no-self-guided' }],
      },
      {
        key: 'rain-policy',
        label: 'Rain Policy',
        type: 'checkbox',
        options: [{ label: 'Low ropes (rain ok)', value: 'low-ropes-rain-ok' }, { label: 'High ropes (light rain only)', value: 'high-ropes-light-rain-only' }, { label: 'Cancels for lightning', value: 'cancels-for-lightning' }, { label: 'Credits/refunds for weather', value: 'credits-refunds-for-weather' }],
      }
    ],
    'axe-throwing': [
      {
        key: 'venue-type',
        label: 'Venue Type',
        type: 'checkbox',
        options: [{ label: 'Dedicated axe throwing facility', value: 'dedicated-axe-throwing-facility' }, { label: 'Mobile axe throwing (rent for events)', value: 'mobile-axe-throwing-rent-for-events' }, { label: 'Bar + axe throwing', value: 'bar-axe-throwing' }, { label: 'Outdoor axe throwing', value: 'outdoor-axe-throwing' }],
      },
      {
        key: 'lane-size',
        label: 'Lane Size',
        type: 'checkbox',
        options: [{ label: 'Single lane (1-2 throwers)', value: 'single-lane-1-2-throwers' }, { label: 'Double lane (2-4)', value: 'double-lane-2-4' }, { label: 'Group lane (up to 8)', value: 'group-lane-up-to-8' }, { label: 'Party pit (10+)', value: 'party-pit-10' }],
      },
      {
        key: 'weapon-types',
        label: 'Weapon Types',
        type: 'checkbox',
        options: [{ label: 'Standard hatchet (1.25 lbs)', value: 'standard-hatchet-1-25-lbs' }, { label: 'Heavy axe (2+ lbs)', value: 'heavy-axe-2-lbs' }, { label: 'Tomahawk', value: 'tomahawk' }, { label: 'Throwing knives (where legal)', value: 'throwing-knives-where-legal' }, { label: 'Ninja stars (special events)', value: 'ninja-stars-special-events' }],
      },
      {
        key: 'target-type',
        label: 'Target Type',
        type: 'checkbox',
        options: [{ label: 'Wooden bullseye (traditional)', value: 'wooden-bullseye-traditional' }, { label: 'Electronic scoring targets', value: 'electronic-scoring-targets' }, { label: 'Light-up targets', value: 'light-up-targets' }, { label: 'Moving targets', value: 'moving-targets' }],
      },
      {
        key: 'coaching-included',
        label: 'Coaching Included',
        type: 'checkbox',
        options: [{ label: 'Yes (mandatory safety briefing)', value: 'yes-mandatory-safety-briefing' }, { label: 'Yes (ongoing coaching)', value: 'yes-ongoing-coaching' }, { label: 'Self-serve after brief', value: 'self-serve-after-brief' }],
      },
      {
        key: 'league-play',
        label: 'League Play',
        type: 'checkbox',
        options: [{ label: 'Yes (weekly)', value: 'yes-weekly' }, { label: 'Yes (seasonal)', value: 'yes-seasonal' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'walk-in-availability',
        label: 'Walk-in Availability',
        type: 'checkbox',
        options: [{ label: 'Yes (off-peak)', value: 'yes-off-peak' }, { label: 'Weekends (reservation recommended)', value: 'weekends-reservation-recommended' }, { label: 'Reservation required', value: 'reservation-required' }],
      },
      {
        key: 'age-requirement',
        label: 'Age Requirement',
        type: 'checkbox',
        options: [{ label: 'Under 16 with adult', value: 'under-16-with-adult' }, { label: '16+ alone', value: '16-alone' }, { label: '18+', value: '18' }, { label: '21+ (if alcohol served)', value: '21-if-alcohol-served' }],
      },
      {
        key: 'alcohol-service',
        label: 'Alcohol Service',
        type: 'checkbox',
        options: [{ label: 'Full bar on-site', value: 'full-bar-on-site' }, { label: 'Beer & wine only', value: 'beer-wine-only' }, { label: 'No alcohol (BYOB sometimes)', value: 'no-alcohol-byob-sometimes' }, { label: 'Alcohol not allowed before throwing', value: 'alcohol-not-allowed-before-throwing' }],
      },
      {
        key: 'private-event-space',
        label: 'Private Event Space',
        type: 'checkbox',
        options: [{ label: 'Yes (rent entire venue)', value: 'yes-rent-entire-venue' }, { label: 'Yes (sectioned off)', value: 'yes-sectioned-off' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'competitions-tournaments',
        label: 'Competitions / Tournaments',
        type: 'checkbox',
        options: [{ label: 'Yes (cash prizes)', value: 'yes-cash-prizes' }, { label: 'Yes (bragging rights)', value: 'yes-bragging-rights' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'grip-assistance',
        label: 'Grip Assistance',
        type: 'checkbox',
        options: [{ label: 'Chalk provided', value: 'chalk-provided' }, { label: 'Gloves available', value: 'gloves-available' }, { label: 'Tape available', value: 'tape-available' }],
      },
      {
        key: 'left-handed-friendly',
        label: 'Left-Handed Friendly',
        type: 'checkbox',
        options: [{ label: 'Yes (lanes set up for both)', value: 'yes-lanes-set-up-for-both' }, { label: 'Limited left-handed axes', value: 'limited-left-handed-axes' }, { label: 'No (right-handed only)', value: 'no-right-handed-only' }],
      }
    ],
    'kids-recreation-party': [
      {
        key: 'facility-type',
        label: 'Facility Type',
        type: 'checkbox',
        options: [{ label: 'Indoor playground', value: 'indoor-playground' }, { label: 'Bounce house / inflatable park', value: 'bounce-house-inflatable-park' }, { label: 'Soft play (toddler focused)', value: 'soft-play-toddler-focused' }, { label: 'Trampoline park (kids hours)', value: 'trampoline-park-kids-hours' }, { label: 'Obstacle course (kids)', value: 'obstacle-course-kids' }, { label: 'Ball pit zone', value: 'ball-pit-zone' }, { label: 'Climbing structure (multi-level)', value: 'climbing-structure-multi-level' }, { label: 'Dress-up / pretend play village', value: 'dress-up-pretend-play-village' }],
      },
      {
        key: 'age-range-focus',
        label: 'Age Range Focus',
        type: 'checkbox',
        options: [{ label: 'Babies / crawlers (under 1)', value: 'babies-crawlers-under-1' }, { label: 'Toddlers (1-3)', value: 'toddlers-1-3' }, { label: 'Preschool (4-5)', value: 'preschool-4-5' }, { label: 'Early elementary (6-8)', value: 'early-elementary-6-8' }, { label: 'Tweens (9-12)', value: 'tweens-9-12' }],
      },
      {
        key: 'parent-supervision',
        label: 'Parent Supervision',
        type: 'checkbox',
        options: [{ label: 'Required at all times', value: 'required-at-all-times' }, { label: 'Drop-off available (extra fee)', value: 'drop-off-available-extra-fee' }, { label: 'Staff supervised (day camp)', value: 'staff-supervised-day-camp' }],
      },
      {
        key: 'party-packages',
        label: 'Party Packages',
        type: 'checkbox',
        options: [{ label: 'Party host included', value: 'party-host-included' }, { label: 'Private room', value: 'private-room' }, { label: 'Food included (pizza, cake)', value: 'food-included-pizza-cake' }, { label: 'Goody bags provided', value: 'goody-bags-provided' }, { label: 'Invitations designed', value: 'invitations-designed' }, { label: 'Party favors included', value: 'party-favors-included' }],
      },
      {
        key: 'add-on-activities',
        label: 'Add-on Activities',
        type: 'checkbox',
        options: [{ label: 'Face painting', value: 'face-painting' }, { label: 'Balloon animals', value: 'balloon-animals' }, { label: 'Glitter tattoos', value: 'glitter-tattoos' }, { label: 'Character appearance', value: 'character-appearance' }, { label: 'Cotton candy machine', value: 'cotton-candy-machine' }, { label: 'Bubble machine', value: 'bubble-machine' }],
      },
      {
        key: 'safety-features',
        label: 'Safety Features',
        type: 'checkbox',
        options: [{ label: 'Padded floors', value: 'padded-floors' }, { label: 'Netting (for climbers)', value: 'netting-for-climbers' }, { label: 'Sanitized hourly', value: 'sanitized-hourly' }, { label: 'Hand sanitizer stations', value: 'hand-sanitizer-stations' }, { label: 'Socks required (trampoline)', value: 'socks-required-trampoline' }],
      },
      {
        key: 'sibling-discount',
        label: 'Sibling Discount',
        type: 'checkbox',
        options: [{ label: 'Yes (multi-child)', value: 'yes-multi-child' }, { label: 'Under 1 free', value: 'under-1-free' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'membership',
        label: 'Membership',
        type: 'checkbox',
        options: [{ label: 'Monthly unlimited', value: 'monthly-unlimited' }, { label: 'Punch card (10 visits)', value: 'punch-card-10-visits' }, { label: 'Annual pass', value: 'annual-pass' }],
      },
      {
        key: 'food-allowed',
        label: 'Food Allowed',
        type: 'checkbox',
        options: [{ label: 'Outside cake allowed (fee)', value: 'outside-cake-allowed-fee' }, { label: 'Outside food allowed (party only)', value: 'outside-food-allowed-party-only' }, { label: 'Snacks for sale', value: 'snacks-for-sale' }, { label: 'Full cafe on-site', value: 'full-cafe-on-site' }],
      },
      {
        key: 'coat-shoe-storage',
        label: 'Coat / Shoe Storage',
        type: 'checkbox',
        options: [{ label: 'Lockers (free)', value: 'lockers-free' }, { label: 'Cubby area', value: 'cubby-area' }, { label: 'Bring bag on floor', value: 'bring-bag-on-floor' }],
      },
      {
        key: 'socks-required',
        label: 'Socks Required',
        type: 'checkbox',
        options: [{ label: 'Yes (grip socks)', value: 'yes-grip-socks' }, { label: 'Yes (any socks)', value: 'yes-any-socks' }, { label: 'Barefoot allowed', value: 'barefoot-allowed' }],
      },
      {
        key: 'stroller-parking',
        label: 'Stroller Parking',
        type: 'checkbox',
        options: [{ label: 'Yes (designated area)', value: 'yes-designated-area' }, { label: 'Yes (folded only)', value: 'yes-folded-only' }, { label: 'No (outside)', value: 'no-outside' }],
      },
      {
        key: 'sensory-friendly-hours',
        label: 'Sensory Friendly Hours',
        type: 'checkbox',
        options: [{ label: 'Lower music, fewer kids', value: 'lower-music-fewer-kids' }, { label: 'Designated times', value: 'designated-times' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'cleanliness-rating',
        label: 'Cleanliness Rating',
        type: 'checkbox',
        options: [{ label: 'Regularly inspected', value: 'regularly-inspected' }, { label: 'Shoes-off policy helps', value: 'shoes-off-policy-helps' }, { label: 'Visible cleaning staff', value: 'visible-cleaning-staff' }],
      }
    ],
    'beach': [
      {
        key: 'beach-type',
        label: 'Beach Type',
        type: 'checkbox',
        options: [{ label: 'Ocean beach', value: 'ocean-beach' }, { label: 'Lake beach', value: 'lake-beach' }, { label: 'River beach', value: 'river-beach' }, { label: 'Bay / cove', value: 'bay-cove' }],
      },
      {
        key: 'sand-type',
        label: 'Sand Type',
        type: 'checkbox',
        options: [{ label: 'Fine white sand', value: 'fine-white-sand' }, { label: 'Coarse sand', value: 'coarse-sand' }, { label: 'Pebble / rocky', value: 'pebble-rocky' }, { label: 'Shell-covered', value: 'shell-covered' }],
      },
      {
        key: 'water-conditions',
        label: 'Water Conditions',
        type: 'checkbox',
        options: [{ label: 'Calm (swimming safe)', value: 'calm-swimming-safe' }, { label: 'Moderate waves (caution)', value: 'moderate-waves-caution' }, { label: 'Strong waves (swim at risk)', value: 'strong-waves-swim-at-risk' }, { label: 'Dangerous currents (no swimming)', value: 'dangerous-currents-no-swimming' }],
      },
      {
        key: 'lifeguards',
        label: 'Lifeguards',
        type: 'checkbox',
        options: [{ label: 'Yes (seasonal)', value: 'yes-seasonal' }, { label: 'Yes (year-round)', value: 'yes-year-round' }, { label: 'No (swim at own risk)', value: 'no-swim-at-own-risk' }],
      },
      {
        key: 'amenities',
        label: 'Amenities',
        type: 'checkbox',
        options: [{ label: 'Showers (outdoor)', value: 'showers-outdoor' }, { label: 'Changing rooms', value: 'changing-rooms' }, { label: 'Restrooms', value: 'restrooms' }, { label: 'Boardwalk', value: 'boardwalk' }, { label: 'Picnic tables', value: 'picnic-tables' }, { label: 'Grills (charcoal)', value: 'grills-charcoal' }, { label: 'Shade structures / umbrellas for rent', value: 'shade-structures-umbrellas-for-rent' }, { label: 'Beach chair rental', value: 'beach-chair-rental' }, { label: 'Umbrella rental', value: 'umbrella-rental' }],
      },
      {
        key: 'activities',
        label: 'Activities',
        type: 'checkbox',
        options: [{ label: 'Swimming', value: 'swimming' }, { label: 'Sunbathing', value: 'sunbathing' }, { label: 'Surfing', value: 'surfing' }, { label: 'Paddleboarding', value: 'paddleboarding' }, { label: 'Kayaking', value: 'kayaking' }, { label: 'Beach volleyball', value: 'beach-volleyball' }, { label: 'Sandcastle building', value: 'sandcastle-building' }, { label: 'Fishing', value: 'fishing' }, { label: 'Shelling', value: 'shelling' }],
      },
      {
        key: 'dogs-allowed',
        label: 'Dogs Allowed',
        type: 'checkbox',
        options: [{ label: 'Yes (leashed)', value: 'yes-leashed' }, { label: 'Yes (off-leash before 9am)', value: 'yes-off-leash-before-9am' }, { label: 'Seasonal restrictions', value: 'seasonal-restrictions' }, { label: 'No dogs', value: 'no-dogs' }],
      },
      {
        key: 'bonfire-permits',
        label: 'Bonfire Permits',
        type: 'checkbox',
        options: [{ label: 'Yes (required)', value: 'yes-required' }, { label: 'Yes (designated pits)', value: 'yes-designated-pits' }, { label: 'No fires allowed', value: 'no-fires-allowed' }],
      },
      {
        key: 'alcohol-policy',
        label: 'Alcohol Policy',
        type: 'checkbox',
        options: [{ label: 'Allowed', value: 'allowed' }, { label: 'Allowed in designated areas', value: 'allowed-in-designated-areas' }, { label: 'Not allowed', value: 'not-allowed' }],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        type: 'checkbox',
        options: [{ label: 'Beach wheelchair available', value: 'beach-wheelchair-available' }, { label: 'Roll-out mat (mobility)', value: 'roll-out-mat-mobility' }, { label: 'No accessibility features', value: 'no-accessibility-features' }],
      },
      {
        key: 'tide-pools',
        label: 'Tide Pools',
        type: 'checkbox',
        options: [{ label: 'Yes (check tide schedule)', value: 'yes-check-tide-schedule' }, { label: 'No', value: 'no' }],
      }
    ],
    'lake': [
      {
        key: 'lake-type',
        label: 'Lake Type',
        type: 'checkbox',
        options: [{ label: 'Natural lake', value: 'natural-lake' }, { label: 'Man-made reservoir', value: 'man-made-reservoir' }, { label: 'Glacial lake', value: 'glacial-lake' }, { label: 'Alpine lake (high elevation)', value: 'alpine-lake-high-elevation' }],
      },
      {
        key: 'water-activities',
        label: 'Water Activities',
        type: 'checkbox',
        options: [{ label: 'Swimming', value: 'swimming' }, { label: 'Boating (motor)', value: 'boating-motor' }, { label: 'Boating (non-motor / canoe, kayak)', value: 'boating-non-motor-canoe-kayak' }, { label: 'Fishing', value: 'fishing' }, { label: 'Paddleboarding', value: 'paddleboarding' }, { label: 'Water skiing / wakeboarding', value: 'water-skiing-wakeboarding' }, { label: 'Tubing', value: 'tubing' }, { label: 'Sailing', value: 'sailing' }],
      },
      {
        key: 'boat-launch',
        label: 'Boat Launch',
        type: 'checkbox',
        options: [{ label: 'Free ramp', value: 'free-ramp' }, { label: 'Paid ramp', value: 'paid-ramp' }, { label: 'Carry-in only (no trailer)', value: 'carry-in-only-no-trailer' }, { label: 'No private boats (rentals only)', value: 'no-private-boats-rentals-only' }],
      },
      {
        key: 'boat-rentals',
        label: 'Boat Rentals',
        type: 'checkbox',
        options: [{ label: 'Kayak', value: 'kayak' }, { label: 'Canoe', value: 'canoe' }, { label: 'Paddleboard', value: 'paddleboard' }, { label: 'Pedal boat', value: 'pedal-boat' }, { label: 'Motorboat (HP limit)', value: 'motorboat-hp-limit' }, { label: 'Pontoon boat', value: 'pontoon-boat' }, { label: 'Jet skis', value: 'jet-skis' }],
      },
      {
        key: 'swimming-area',
        label: 'Swimming Area',
        type: 'checkbox',
        options: [{ label: 'Designated swim beach', value: 'designated-swim-beach' }, { label: 'Roped-off area', value: 'roped-off-area' }, { label: 'Open swim (anywhere)', value: 'open-swim-anywhere' }, { label: 'No swimming allowed', value: 'no-swimming-allowed' }],
      },
      {
        key: 'water-quality',
        label: 'Water Quality',
        type: 'checkbox',
        options: [{ label: 'Clear / clean', value: 'clear-clean' }, { label: 'Murky (low visibility)', value: 'murky-low-visibility' }, { label: 'Algae blooms (seasonal)', value: 'algae-blooms-seasonal' }, { label: 'Swim advisory (check reports)', value: 'swim-advisory-check-reports' }],
      },
      {
        key: 'fish-species',
        label: 'Fish Species',
        type: 'checkbox',
        options: [{ label: 'Bass', value: 'bass' }, { label: 'Trout', value: 'trout' }, { label: 'Catfish', value: 'catfish' }, { label: 'Panfish (bluegill, crappie)', value: 'panfish-bluegill-crappie' }, { label: 'Pike / muskie', value: 'pike-muskie' }, { label: 'Walleye', value: 'walleye' }, { label: 'Salmon', value: 'salmon' }],
      },
      {
        key: 'fishing-license-required',
        label: 'Fishing License Required',
        type: 'checkbox',
        options: [{ label: 'Yes (state license)', value: 'yes-state-license' }, { label: 'Yes (daily pass available)', value: 'yes-daily-pass-available' }, { label: 'No (free fishing)', value: 'no-free-fishing' }],
      },
      {
        key: 'camping',
        label: 'Camping',
        type: 'checkbox',
        options: [{ label: 'On-site campground', value: 'on-site-campground' }, { label: 'Nearby campground', value: 'nearby-campground' }, { label: 'No camping', value: 'no-camping' }],
      },
      {
        key: 'ice-fishing-winter',
        label: 'Ice Fishing (winter)',
        type: 'checkbox',
        options: [{ label: 'Yes (when safe)', value: 'yes-when-safe' }, { label: 'No (unsafe ice or not allowed)', value: 'no-unsafe-ice-or-not-allowed' }],
      }
    ],
    'waterfall': [
      {
        key: 'waterfall-type',
        label: 'Waterfall Type',
        type: 'checkbox',
        options: [{ label: 'Plunge (vertical drop)', value: 'plunge-vertical-drop' }, { label: 'Cascade (stepped)', value: 'cascade-stepped' }, { label: 'Horsetail (narrow, touches rock)', value: 'horsetail-narrow-touches-rock' }, { label: 'Multi-tier', value: 'multi-tier' }, { label: 'Seasonal (only after rain/snowmelt)', value: 'seasonal-only-after-rain-snowmelt' }],
      },
      {
        key: 'height',
        label: 'Height',
        type: 'checkbox',
        options: [{ label: 'Under 20 ft', value: 'under-20-ft' }, { label: '20-50 ft', value: '20-50-ft' }, { label: '50-100 ft', value: '50-100-ft' }, { label: '100-200 ft', value: '100-200-ft' }, { label: '200+ ft', value: '200-ft' }],
      },
      {
        key: 'hike-distance-to-view',
        label: 'Hike Distance to View',
        type: 'checkbox',
        options: [{ label: 'Visible from road / parking', value: 'visible-from-road-parking' }, { label: 'Under 0.5 miles', value: 'under-0-5-miles' }, { label: '0.5-1 mile', value: '0-5-1-mile' }, { label: '1-2 miles', value: '1-2-miles' }, { label: '2-5 miles', value: '2-5-miles' }, { label: '5+ miles', value: '5-miles' }],
      },
      {
        key: 'swimming-allowed',
        label: 'Swimming Allowed',
        type: 'checkbox',
        options: [{ label: 'Yes (pool at base)', value: 'yes-pool-at-base' }, { label: 'Yes (designated area)', value: 'yes-designated-area' }, { label: 'No (dangerous currents)', value: 'no-dangerous-currents' }, { label: 'No (protected area)', value: 'no-protected-area' }],
      },
      {
        key: 'best-viewing-season',
        label: 'Best Viewing Season',
        type: 'checkbox',
        options: [{ label: 'Spring (snowmelt)', value: 'spring-snowmelt' }, { label: 'Summer (steady flow)', value: 'summer-steady-flow' }, { label: 'Fall (low flow, foliage)', value: 'fall-low-flow-foliage' }, { label: 'Winter (frozen)', value: 'winter-frozen' }],
      },
      {
        key: 'photography',
        label: 'Photography',
        type: 'checkbox',
        options: [{ label: 'Easy access for tripod', value: 'easy-access-for-tripod' }, { label: 'Requires hike with gear', value: 'requires-hike-with-gear' }, { label: 'No photography restrictions', value: 'no-photography-restrictions' }, { label: 'Drone allowed (check local rules)', value: 'drone-allowed-check-local-rules' }],
      },
      {
        key: 'boardwalk-viewing-platform',
        label: 'Boardwalk / Viewing Platform',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Limited', value: 'limited' }, { label: 'No (natural rock only)', value: 'no-natural-rock-only' }],
      },
      {
        key: 'crowds',
        label: 'Crowds',
        type: 'checkbox',
        options: [{ label: 'Very busy (popular Instagram spot)', value: 'very-busy-popular-instagram-spot' }, { label: 'Moderate', value: 'moderate' }, { label: 'Secluded', value: 'secluded' }],
      }
    ],
    'cave': [
      {
        key: 'cave-type',
        label: 'Cave Type',
        type: 'checkbox',
        options: [{ label: 'Show cave (guided tour, lights)', value: 'show-cave-guided-tour-lights' }, { label: 'Wild cave (unimproved, self-guided)', value: 'wild-cave-unimproved-self-guided' }, { label: 'Lava tube', value: 'lava-tube' }, { label: 'Sea cave', value: 'sea-cave' }, { label: 'Ice cave', value: 'ice-cave' }],
      },
      {
        key: 'tour-length',
        label: 'Tour Length',
        type: 'checkbox',
        options: [{ label: '30 minutes', value: '30-minutes' }, { label: '45 minutes', value: '45-minutes' }, { label: '1 hour', value: '1-hour' }, { label: '1.5 hours', value: '1-5-hours' }, { label: '2+ hours', value: '2-hours' }],
      },
      {
        key: 'difficulty',
        label: 'Difficulty',
        type: 'checkbox',
        options: [{ label: 'Easy (paved paths)', value: 'easy-paved-paths' }, { label: 'Moderate (uneven, stairs)', value: 'moderate-uneven-stairs' }, { label: 'Challenging (crawling, tight spaces)', value: 'challenging-crawling-tight-spaces' }, { label: 'Technical (vertical ropes, gear)', value: 'technical-vertical-ropes-gear' }],
      },
      {
        key: 'temperature-inside',
        label: 'Temperature Inside',
        type: 'checkbox',
        options: [{ label: 'Cool (50-60°F)', value: 'cool-50-60-f' }, { label: 'Cold (40-50°F)', value: 'cold-40-50-f' }, { label: 'Very cold (below 40°F)', value: 'very-cold-below-40-f' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Electric lights (show cave)', value: 'electric-lights-show-cave' }, { label: 'Bring your own headlamp (wild cave)', value: 'bring-your-own-headlamp-wild-cave' }, { label: 'No lighting required (well-lit)', value: 'no-lighting-required-well-lit' }],
      },
      {
        key: 'formations',
        label: '** formations**',
        type: 'checkbox',
        options: [{ label: 'Stalactites', value: 'stalactites' }, { label: 'Stalagmites', value: 'stalagmites' }, { label: 'Columns', value: 'columns' }, { label: 'Flowstone', value: 'flowstone' }, { label: 'Helictites', value: 'helictites' }, { label: 'Soda straws', value: 'soda-straws' }, { label: 'Cave pearls', value: 'cave-pearls' }],
      },
      {
        key: 'water-features',
        label: 'Water features',
        type: 'checkbox',
        options: [{ label: 'Underground stream', value: 'underground-stream' }, { label: 'Cave pool', value: 'cave-pool' }, { label: 'Waterfall inside', value: 'waterfall-inside' }, { label: 'No water features', value: 'no-water-features' }],
      },
      {
        key: 'claustrophobic-friendly',
        label: 'Claustrophobic Friendly',
        type: 'checkbox',
        options: [{ label: 'Wide passages (fine)', value: 'wide-passages-fine' }, { label: 'Some tight spots (warning given)', value: 'some-tight-spots-warning-given' }, { label: 'Extremely tight (not recommended)', value: 'extremely-tight-not-recommended' }, { label: 'Alternate route available', value: 'alternate-route-available' }],
      },
      {
        key: 'age-restrictions',
        label: 'Age Restrictions',
        type: 'checkbox',
        options: [{ label: 'All ages (show cave)', value: 'all-ages-show-cave' }, { label: 'Under 12 with adult', value: 'under-12-with-adult' }, { label: '16+ for wild cave', value: '16-for-wild-cave' }, { label: 'No infants (carried not allowed)', value: 'no-infants-carried-not-allowed' }],
      },
      {
        key: 'gear-rental',
        label: 'Gear Rental',
        type: 'checkbox',
        options: [{ label: 'Helmet', value: 'helmet' }, { label: 'Headlamp', value: 'headlamp' }, { label: 'Knee pads', value: 'knee-pads' }, { label: 'Gloves', value: 'gloves' }, { label: 'Coveralls', value: 'coveralls' }],
      }
    ],
    'canyon': [
      {
        key: 'canyon-type',
        label: 'Canyon Type',
        type: 'checkbox',
        options: [{ label: 'River canyon', value: 'river-canyon' }, { label: 'Slot canyon (narrow, high walls)', value: 'slot-canyon-narrow-high-walls' }, { label: 'Desert canyon', value: 'desert-canyon' }, { label: 'Submarine canyon (underwater)', value: 'submarine-canyon-underwater' }],
      },
      {
        key: 'depth',
        label: 'Depth',
        type: 'checkbox',
        options: [{ label: 'Shallow (under 100 ft)', value: 'shallow-under-100-ft' }, { label: 'Moderate (100-500 ft)', value: 'moderate-100-500-ft' }, { label: 'Deep (500-1,000 ft)', value: 'deep-500-1-000-ft' }, { label: 'Very deep (1,000+ ft)', value: 'very-deep-1-000-ft' }],
      },
      {
        key: 'viewing-access',
        label: 'Viewing Access',
        type: 'checkbox',
        options: [{ label: 'Drive-up viewpoint', value: 'drive-up-viewpoint' }, { label: 'Short walk from parking', value: 'short-walk-from-parking' }, { label: 'Moderate hike', value: 'moderate-hike' }, { label: 'Challenging hike', value: 'challenging-hike' }, { label: '4x4 vehicle required', value: '4x4-vehicle-required' }],
      },
      {
        key: 'hiking-inside-canyon',
        label: 'Hiking Inside Canyon',
        type: 'checkbox',
        options: [{ label: 'Yes (trails along bottom)', value: 'yes-trails-along-bottom' }, { label: 'Yes (requires wading)', value: 'yes-requires-wading' }, { label: 'Yes (requires climbing)', value: 'yes-requires-climbing' }, { label: 'No (restricted access)', value: 'no-restricted-access' }],
      },
      {
        key: 'slot-canyon-restrictions',
        label: 'Slot Canyon Restrictions',
        type: 'checkbox',
        options: [{ label: 'Flash flood risk (check weather)', value: 'flash-flood-risk-check-weather' }, { label: 'Permit required', value: 'permit-required' }, { label: 'Guide required', value: 'guide-required' }, { label: 'No solo travel', value: 'no-solo-travel' }],
      },
      {
        key: 'best-light-for-photos',
        label: 'Best Light for Photos',
        type: 'checkbox',
        options: [{ label: 'Midday (light reaches bottom)', value: 'midday-light-reaches-bottom' }, { label: 'Golden hour (rim lights up)', value: 'golden-hour-rim-lights-up' }, { label: 'Specific season (sun aligns)', value: 'specific-season-sun-aligns' }],
      },
      {
        key: 'overnight-trips',
        label: 'Overnight Trips',
        type: 'checkbox',
        options: [{ label: 'Permitted (backcountry)', value: 'permitted-backcountry' }, { label: 'No camping', value: 'no-camping' }],
      },
      {
        key: 'helicopter-air-tours',
        label: 'Helicopter / Air Tours',
        type: 'checkbox',
        options: [{ label: 'Yes (available nearby)', value: 'yes-available-nearby' }, { label: 'No', value: 'no' }],
      }
    ],
    'crater': [
      {
        key: 'crater-type',
        label: 'Crater Type',
        type: 'checkbox',
        options: [{ label: 'Volcanic crater', value: 'volcanic-crater' }, { label: 'Meteorite impact crater', value: 'meteorite-impact-crater' }, { label: 'Caldera (collapsed volcano)', value: 'caldera-collapsed-volcano' }, { label: 'Maar crater (explosion crater)', value: 'maar-crater-explosion-crater' }],
      },
      {
        key: 'activity-status',
        label: 'Activity Status',
        type: 'checkbox',
        options: [{ label: 'Dormant', value: 'dormant' }, { label: 'Extinct', value: 'extinct' }, { label: 'Active (steam / vents visible)', value: 'active-steam-vents-visible' }],
      },
      {
        key: 'access',
        label: 'Access',
        type: 'checkbox',
        options: [{ label: 'Drive to rim', value: 'drive-to-rim' }, { label: 'Hike to rim', value: 'hike-to-rim' }, { label: 'Hike into crater', value: 'hike-into-crater' }, { label: 'Helicopter only', value: 'helicopter-only' }, { label: 'View from distance only', value: 'view-from-distance-only' }],
      },
      {
        key: 'crater-lake',
        label: 'Crater Lake',
        type: 'checkbox',
        options: [{ label: 'Yes (water-filled)', value: 'yes-water-filled' }, { label: 'Yes (seasonal)', value: 'yes-seasonal' }, { label: 'No (dry)', value: 'no-dry' }],
      },
      {
        key: 'hiking-into-crater',
        label: 'Hiking Into Crater',
        type: 'checkbox',
        options: [{ label: 'Permitted', value: 'permitted' }, { label: 'Permitted with guide', value: 'permitted-with-guide' }, { label: 'Not allowed (dangerous)', value: 'not-allowed-dangerous' }, { label: 'Not allowed (protected)', value: 'not-allowed-protected' }],
      },
      {
        key: 'volcanic-features',
        label: 'Volcanic Features',
        type: 'checkbox',
        options: [{ label: 'Fumaroles (steam vents)', value: 'fumaroles-steam-vents' }, { label: 'Sulfur deposits', value: 'sulfur-deposits' }, { label: 'Lava tubes', value: 'lava-tubes' }, { label: 'Lava bombs', value: 'lava-bombs' }, { label: 'Obsidian', value: 'obsidian' }],
      },
      {
        key: 'elevation',
        label: 'Elevation',
        type: 'checkbox',
        options: [{ label: 'Under 5,000 ft', value: 'under-5-000-ft' }, { label: '5,000-8,000 ft', value: '5-000-8-000-ft' }, { label: '8,000-10,000 ft', value: '8-000-10-000-ft' }, { label: '10,000+ ft', value: '10-000-ft' }],
      },
      {
        key: 'temperature-warning',
        label: 'Temperature Warning',
        type: 'checkbox',
        options: [{ label: 'Extreme heat (geothermal)', value: 'extreme-heat-geothermal' }, { label: 'Extreme cold (high elevation)', value: 'extreme-cold-high-elevation' }, { label: 'Moderate', value: 'moderate' }],
      }
    ],
    'sand-dune': [
      {
        key: 'dune-type',
        label: 'Dune Type',
        type: 'checkbox',
        options: [{ label: 'Coastal dunes', value: 'coastal-dunes' }, { label: 'Desert dunes', value: 'desert-dunes' }, { label: 'Inland (non-coastal)', value: 'inland-non-coastal' }],
      },
      {
        key: 'dune-height',
        label: 'Dune Height',
        type: 'checkbox',
        options: [{ label: 'Under 50 ft', value: 'under-50-ft' }, { label: '50-100 ft', value: '50-100-ft' }, { label: '100-200 ft', value: '100-200-ft' }, { label: '200+ ft', value: '200-ft' }],
      },
      {
        key: 'activities',
        label: 'Activities',
        type: 'checkbox',
        options: [{ label: 'Sandboarding', value: 'sandboarding' }, { label: 'Sand sledding', value: 'sand-sledding' }, { label: 'Hiking', value: 'hiking' }, { label: 'Photography', value: 'photography' }, { label: 'Stargazing', value: 'stargazing' }, { label: 'Off-roading (OHV)', value: 'off-roading-ohv' }, { label: 'Camping', value: 'camping' }],
      },
      {
        key: 'sandboarding-rentals',
        label: 'Sandboarding Rentals',
        type: 'checkbox',
        options: [{ label: 'Available on-site', value: 'available-on-site' }, { label: 'Available nearby', value: 'available-nearby' }, { label: 'Bring your own', value: 'bring-your-own' }, { label: 'Not allowed', value: 'not-allowed' }],
      },
      {
        key: 'off-road-vehicle-access',
        label: 'Off-Road Vehicle Access',
        type: 'checkbox',
        options: [{ label: 'Designated OHV area', value: 'designated-ohv-area' }, { label: 'Permit required', value: 'permit-required' }, { label: 'No vehicles allowed', value: 'no-vehicles-allowed' }],
      },
      {
        key: 'sand-color',
        label: 'Sand Color',
        type: 'checkbox',
        options: [{ label: 'White (gypsum)', value: 'white-gypsum' }, { label: 'Gold / tan', value: 'gold-tan' }, { label: 'Red / orange (iron oxide)', value: 'red-orange-iron-oxide' }, { label: 'Black (volcanic)', value: 'black-volcanic' }],
      },
      {
        key: 'wind-conditions',
        label: 'Wind Conditions',
        type: 'checkbox',
        options: [{ label: 'Calm (best for boarding)', value: 'calm-best-for-boarding' }, { label: 'Moderate (sand gets in eyes)', value: 'moderate-sand-gets-in-eyes' }, { label: 'High wind (unpleasant / dangerous)', value: 'high-wind-unpleasant-dangerous' }],
      },
      {
        key: 'sun-exposure',
        label: 'Sun Exposure',
        type: 'checkbox',
        options: [{ label: 'No shade (bring umbrella/tent)', value: 'no-shade-bring-umbrella-tent' }, { label: 'Limited shade at visitor center', value: 'limited-shade-at-visitor-center' }, { label: 'Some dunes have vegetation', value: 'some-dunes-have-vegetation' }],
      },
      {
        key: 'drinking-water',
        label: 'Drinking Water',
        type: 'checkbox',
        options: [{ label: 'Available at trailhead', value: 'available-at-trailhead' }, { label: 'None (bring your own)', value: 'none-bring-your-own' }],
      },
      {
        key: 'quicksand-risk',
        label: 'Quicksand Risk',
        type: 'checkbox',
        options: [{ label: 'None', value: 'none' }, { label: 'Minimal (avoid wet areas)', value: 'minimal-avoid-wet-areas' }, { label: 'Present (stay on marked trails)', value: 'present-stay-on-marked-trails' }],
      }
    ],
    'trail': [
      {
        key: 'trail-type',
        label: 'Trail Type',
        type: 'checkbox',
        options: [{ label: 'Hiking trail', value: 'hiking-trail' }, { label: 'Biking trail (mountain bike)', value: 'biking-trail-mountain-bike' }, { label: 'Multi-use (hike, bike, horse)', value: 'multi-use-hike-bike-horse' }, { label: 'Interpretive / nature trail', value: 'interpretive-nature-trail' }, { label: 'Backpacking trail', value: 'backpacking-trail' }, { label: 'Rail trail (converted railroad)', value: 'rail-trail-converted-railroad' }, { label: 'Boardwalk trail', value: 'boardwalk-trail' }],
      },
      {
        key: 'distance',
        label: 'Distance',
        type: 'checkbox',
        options: [{ label: 'Under 1 mile', value: 'under-1-mile' }, { label: '1-3 miles', value: '1-3-miles' }, { label: '3-6 miles', value: '3-6-miles' }, { label: '6-10 miles', value: '6-10-miles' }, { label: '10-15 miles', value: '10-15-miles' }, { label: '15-25 miles', value: '15-25-miles' }, { label: '25+ miles', value: '25-miles' }],
      },
      {
        key: 'elevation-gain',
        label: 'Elevation Gain',
        type: 'checkbox',
        options: [{ label: 'Flat (under 100 ft)', value: 'flat-under-100-ft' }, { label: 'Gentle (100-500 ft)', value: 'gentle-100-500-ft' }, { label: 'Moderate (500-1,500 ft)', value: 'moderate-500-1-500-ft' }, { label: 'Strenuous (1,500-3,000 ft)', value: 'strenuous-1-500-3-000-ft' }, { label: 'Extreme (3,000+ ft)', value: 'extreme-3-000-ft' }],
      },
      {
        key: 'terrain',
        label: 'Terrain',
        type: 'checkbox',
        options: [{ label: 'Paved', value: 'paved' }, { label: 'Gravel / crushed stone', value: 'gravel-crushed-stone' }, { label: 'Dirt', value: 'dirt' }, { label: 'Sand', value: 'sand' }, { label: 'Rock / scree', value: 'rock-scree' }, { label: 'Boardwalk', value: 'boardwalk' }, { label: 'Snow / ice (winter)', value: 'snow-ice-winter' }],
      },
      {
        key: 'loop-vs-out-back',
        label: 'Loop vs Out & Back',
        type: 'checkbox',
        options: [{ label: 'Loop', value: 'loop' }, { label: 'Out & back', value: 'out-back' }, { label: 'Point to point (need shuttle)', value: 'point-to-point-need-shuttle' }, { label: 'Lollipop (loop with stem)', value: 'lollipop-loop-with-stem' }],
      },
      {
        key: 'water-sources-on-trail',
        label: 'Water Sources on Trail',
        type: 'checkbox',
        options: [{ label: 'Streams (treat before drinking)', value: 'streams-treat-before-drinking' }, { label: 'Lakes', value: 'lakes' }, { label: 'No water (carry all)', value: 'no-water-carry-all' }],
      },
      {
        key: 'cell-reception',
        label: 'Cell Reception',
        type: 'checkbox',
        options: [{ label: 'Full coverage', value: 'full-coverage' }, { label: 'Spotty (bring offline map)', value: 'spotty-bring-offline-map' }, { label: 'None (GPS still works)', value: 'none-gps-still-works' }],
      },
      {
        key: 'trail-markings',
        label: 'Trail Markings',
        type: 'checkbox',
        options: [{ label: 'Well marked (blazes, signs)', value: 'well-marked-blazes-signs' }, { label: 'Moderately marked', value: 'moderately-marked' }, { label: 'Poorly marked (map required)', value: 'poorly-marked-map-required' }, { label: 'Unmarked (navigational skills needed)', value: 'unmarked-navigational-skills-needed' }],
      },
      {
        key: 'poi-along-trail',
        label: 'POI Along Trail',
        type: 'checkbox',
        options: [{ label: 'Waterfall', value: 'waterfall' }, { label: 'Overlook / viewpoint', value: 'overlook-viewpoint' }, { label: 'Historic structure', value: 'historic-structure' }, { label: 'Cave', value: 'cave' }, { label: 'Swimming hole', value: 'swimming-hole' }, { label: 'Camping area', value: 'camping-area' }],
      },
      {
        key: 'bathrooms-at-trailhead',
        label: 'Bathrooms at Trailhead',
        type: 'checkbox',
        options: [{ label: 'Yes (flush)', value: 'yes-flush' }, { label: 'Yes (vault toilet)', value: 'yes-vault-toilet' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'dogs',
        label: 'Dogs',
        type: 'checkbox',
        options: [{ label: 'Leashed required', value: 'leashed-required' }, { label: 'Off-leash allowed', value: 'off-leash-allowed' }, { label: 'No dogs', value: 'no-dogs' }],
      },
      {
        key: 'horseback-riding-allowed',
        label: 'Horseback Riding Allowed',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'winter-access',
        label: 'Winter Access',
        type: 'checkbox',
        options: [{ label: 'Open (may be icy)', value: 'open-may-be-icy' }, { label: 'Snowshoe / cross-country ski only', value: 'snowshoe-cross-country-ski-only' }, { label: 'Closed', value: 'closed' }],
      },
      {
        key: 'permit-required',
        label: 'Permit Required',
        type: 'checkbox',
        options: [{ label: 'No', value: 'no' }, { label: 'Day-use permit', value: 'day-use-permit' }, { label: 'Overnight permit', value: 'overnight-permit' }, { label: 'Lottery system', value: 'lottery-system' }],
      }
    ],
    'lookout': [
      {
        key: 'lookout-type',
        label: 'Lookout Type',
        type: 'checkbox',
        options: [{ label: 'Fire lookout tower', value: 'fire-lookout-tower' }, { label: 'Natural viewpoint (cliff, rock)', value: 'natural-viewpoint-cliff-rock' }, { label: 'Observation deck', value: 'observation-deck' }, { label: 'Scenic pullout', value: 'scenic-pullout' }, { label: 'Mountain peak', value: 'mountain-peak' }],
      },
      {
        key: 'height-above-ground',
        label: 'Height Above Ground',
        type: 'checkbox',
        options: [{ label: 'Ground level (viewpoint)', value: 'ground-level-viewpoint' }, { label: '20-50 ft (small tower)', value: '20-50-ft-small-tower' }, { label: '50-100 ft', value: '50-100-ft' }, { label: '100+ ft', value: '100-ft' }],
      },
      {
        key: 'access-method',
        label: 'Access Method',
        type: 'checkbox',
        options: [{ label: 'Drive to parking (short walk)', value: 'drive-to-parking-short-walk' }, { label: 'Hike (under 1 mile)', value: 'hike-under-1-mile' }, { label: 'Hike (1-3 miles)', value: 'hike-1-3-miles' }, { label: 'Hike (3+ miles)', value: 'hike-3-miles' }, { label: 'Climb (ladder / stairs required)', value: 'climb-ladder-stairs-required' }],
      },
      {
        key: 'tower-rental-for-overnight',
        label: 'Tower Rental for Overnight',
        type: 'checkbox',
        options: [{ label: 'Yes (USFS fire lookout)', value: 'yes-usfs-fire-lookout' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'enclosed-vs-open',
        label: 'Enclosed vs Open',
        type: 'checkbox',
        options: [{ label: 'Enclosed (windows, protected)', value: 'enclosed-windows-protected' }, { label: 'Open (exposed to elements)', value: 'open-exposed-to-elements' }, { label: 'Partially enclosed', value: 'partially-enclosed' }],
      },
      {
        key: '360-view',
        label: '360° View',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Partial (obstructed in some directions)', value: 'partial-obstructed-in-some-directions' }],
      },
      {
        key: 'best-time-of-day',
        label: 'Best Time of Day',
        type: 'checkbox',
        options: [{ label: 'Sunrise', value: 'sunrise' }, { label: 'Sunset', value: 'sunset' }, { label: 'Midday (hazy)', value: 'midday-hazy' }, { label: 'Night (stargazing)', value: 'night-stargazing' }],
      },
      {
        key: 'safety',
        label: 'Safety',
        type: 'checkbox',
        options: [{ label: 'Railings present', value: 'railings-present' }, { label: 'Unprotected edge (caution)', value: 'unprotected-edge-caution' }, { label: 'Recent structural inspection', value: 'recent-structural-inspection' }],
      },
      {
        key: 'crowd-level',
        label: 'Crowd Level',
        type: 'checkbox',
        options: [{ label: 'Often crowded at sunset', value: 'often-crowded-at-sunset' }, { label: 'Moderate', value: 'moderate' }, { label: 'Secluded (requires effort to reach)', value: 'secluded-requires-effort-to-reach' }],
      }
    ],
    'skyline': [
      {
        key: 'skyline-type',
        label: 'Skyline Type',
        type: 'checkbox',
        options: [{ label: 'City skyline view', value: 'city-skyline-view' }, { label: 'Mountain skyline', value: 'mountain-skyline' }, { label: 'Urban rooftop', value: 'urban-rooftop' }],
      },
      {
        key: 'best-viewing-spot',
        label: 'Best Viewing Spot',
        type: 'checkbox',
        options: [{ label: 'Dedicated observation deck', value: 'dedicated-observation-deck' }, { label: 'Public park', value: 'public-park' }, { label: 'Bridge', value: 'bridge' }, { label: 'Rooftop bar (restricted access)', value: 'rooftop-bar-restricted-access' }, { label: 'Street level', value: 'street-level' }],
      },
      {
        key: 'observation-deck-fee',
        label: 'Observation Deck Fee',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: '$5-15', value: '5-15' }, { label: '$15-30', value: '15-30' }, { label: '$30+ (tourist attraction)', value: '30-tourist-attraction' }],
      },
      {
        key: 'time-restriction',
        label: 'Time Restriction',
        type: 'checkbox',
        options: [{ label: '24/7 access', value: '24-7-access' }, { label: 'Dawn to dusk', value: 'dawn-to-dusk' }, { label: 'Specific hours only', value: 'specific-hours-only' }],
      },
      {
        key: 'photography',
        label: 'Photography',
        type: 'checkbox',
        options: [{ label: 'Tripod allowed', value: 'tripod-allowed' }, { label: 'Tripod not allowed (busy area)', value: 'tripod-not-allowed-busy-area' }, { label: 'Permit required for professional', value: 'permit-required-for-professional' }],
      },
      {
        key: 'night-view',
        label: 'Night View',
        type: 'checkbox',
        options: [{ label: 'Lit skyline', value: 'lit-skyline' }, { label: 'Dark sky (no light pollution)', value: 'dark-sky-no-light-pollution' }],
      },
      {
        key: 'crowds',
        label: 'Crowds',
        type: 'checkbox',
        options: [{ label: 'Sunrise/sunset crowded', value: 'sunrise-sunset-crowded' }, { label: 'Middle of day less crowded', value: 'middle-of-day-less-crowded' }],
      },
      {
        key: 'parking-nearby',
        label: 'Parking Nearby',
        type: 'checkbox',
        options: [{ label: 'Paid lots', value: 'paid-lots' }, { label: 'Street parking (limited)', value: 'street-parking-limited' }, { label: 'Public transit recommended', value: 'public-transit-recommended' }],
      }
    ],
    'backpacking-area': [
      {
        key: 'backpacking-type',
        label: 'Backpacking Type',
        type: 'checkbox',
        options: [{ label: 'Wilderness area (no facilities)', value: 'wilderness-area-no-facilities' }, { label: 'Designated backpacking campgrounds', value: 'designated-backpacking-campgrounds' }, { label: 'Hut-to-hut system', value: 'hut-to-hut-system' }, { label: 'Cross-country (no trails)', value: 'cross-country-no-trails' }],
      },
      {
        key: 'minimum-trip-length',
        label: 'Minimum Trip Length',
        type: 'checkbox',
        options: [{ label: 'Overnight (1 night)', value: 'overnight-1-night' }, { label: 'Weekend (2 nights)', value: 'weekend-2-nights' }, { label: 'Extended (3-5 nights)', value: 'extended-3-5-nights' }, { label: 'Week+ (6+ nights)', value: 'week-6-nights' }],
      },
      {
        key: 'permit-required',
        label: 'Permit Required',
        type: 'checkbox',
        options: [{ label: 'Self-issued (free)', value: 'self-issued-free' }, { label: 'Advanced reservation (fee)', value: 'advanced-reservation-fee' }, { label: 'Lottery / quota system', value: 'lottery-quota-system' }, { label: 'No permit', value: 'no-permit' }],
      },
      {
        key: 'campfire-allowed',
        label: 'Campfire Allowed',
        type: 'checkbox',
        options: [{ label: 'Yes (designated rings)', value: 'yes-designated-rings' }, { label: 'Yes (leave no trace)', value: 'yes-leave-no-trace' }, { label: 'Seasonal bans (fire danger)', value: 'seasonal-bans-fire-danger' }, { label: 'No campfires', value: 'no-campfires' }],
      },
      {
        key: 'water-sources',
        label: 'Water Sources',
        type: 'checkbox',
        options: [{ label: 'Reliable streams', value: 'reliable-streams' }, { label: 'Seasonal streams', value: 'seasonal-streams' }, { label: 'Lakes', value: 'lakes' }, { label: 'None (pack all water)', value: 'none-pack-all-water' }],
      },
      {
        key: 'bear-safety',
        label: 'Bear Safety',
        type: 'checkbox',
        options: [{ label: 'Bear canister required', value: 'bear-canister-required' }, { label: 'Bear box provided', value: 'bear-box-provided' }, { label: 'Bear bag hanging allowed', value: 'bear-bag-hanging-allowed' }, { label: 'No bear concerns', value: 'no-bear-concerns' }],
      },
      {
        key: 'resupply-points',
        label: 'Resupply Points',
        type: 'checkbox',
        options: [{ label: 'Yes (mid-route)', value: 'yes-mid-route' }, { label: 'No (carry all food)', value: 'no-carry-all-food' }],
      },
      {
        key: 'elevation-profile',
        label: 'Elevation Profile',
        type: 'checkbox',
        options: [{ label: 'Gradual climbs', value: 'gradual-climbs' }, { label: 'Steep sections', value: 'steep-sections' }, { label: 'High altitude (above 8,000 ft)', value: 'high-altitude-above-8-000-ft' }],
      },
      {
        key: 'cell-service',
        label: 'Cell Service',
        type: 'checkbox',
        options: [{ label: 'None (satellite device recommended)', value: 'none-satellite-device-recommended' }],
      },
      {
        key: 'permitted-group-size',
        label: 'Permitted Group Size',
        type: 'checkbox',
        options: [{ label: 'Under 6', value: 'under-6' }, { label: 'Under 12', value: 'under-12' }, { label: 'Under 15', value: 'under-15' }, { label: 'No limit', value: 'no-limit' }],
      },
      {
        key: 'dog-friendly',
        label: 'Dog Friendly',
        type: 'checkbox',
        options: [{ label: 'Leashed only', value: 'leashed-only' }, { label: 'No dogs (wilderness area)', value: 'no-dogs-wilderness-area' }, { label: 'Off-leash allowed (voice control)', value: 'off-leash-allowed-voice-control' }],
      },
      {
        key: 'leave-no-trace-required',
        label: 'Leave No Trace Required',
        type: 'checkbox',
        options: [{ label: 'Yes (pack it in, pack it out)', value: 'yes-pack-it-in-pack-it-out' }, { label: 'Enforced by rangers', value: 'enforced-by-rangers' }],
      }
    ],
    'hot-springs': [
      {
        key: 'spring-type',
        label: 'Spring Type',
        type: 'checkbox',
        options: [{ label: 'Developed (pool, changing rooms)', value: 'developed-pool-changing-rooms' }, { label: 'Semi-developed (rock pools)', value: 'semi-developed-rock-pools' }, { label: 'Wild / primitive (natural)', value: 'wild-primitive-natural' }, { label: 'Resort / spa (commercial)', value: 'resort-spa-commercial' }],
      },
      {
        key: 'water-temperature',
        label: 'Water Temperature',
        type: 'checkbox',
        options: [{ label: 'Warm (80-95°F)', value: 'warm-80-95-f' }, { label: 'Hot (95-105°F)', value: 'hot-95-105-f' }, { label: 'Very hot (105-110°F)', value: 'very-hot-105-110-f' }, { label: 'Scalding (110°F+ - mix with cold)', value: 'scalding-110-f-mix-with-cold' }],
      },
      {
        key: 'odor-sulfur',
        label: 'Odor (Sulfur)',
        type: 'checkbox',
        options: [{ label: 'None', value: 'none' }, { label: 'Mild (slight egg smell)', value: 'mild-slight-egg-smell' }, { label: 'Strong (sulfur smell)', value: 'strong-sulfur-smell' }],
      },
      {
        key: 'mineral-content',
        label: 'Mineral Content',
        type: 'checkbox',
        options: [{ label: 'Clear', value: 'clear' }, { label: 'Milky / cloudy', value: 'milky-cloudy' }, { label: 'Blue (copper)', value: 'blue-copper' }, { label: 'Iron (red/orange tint)', value: 'iron-red-orange-tint' }],
      },
      {
        key: 'clothing-policy',
        label: 'Clothing Policy',
        type: 'checkbox',
        options: [{ label: 'Clothing optional', value: 'clothing-optional' }, { label: 'Swimwear required', value: 'swimwear-required' }, { label: 'Nude only (segregated areas)', value: 'nude-only-segregated-areas' }],
      },
      {
        key: 'access',
        label: 'Access',
        type: 'checkbox',
        options: [{ label: 'Short walk from parking', value: 'short-walk-from-parking' }, { label: 'Hike required (0.5-2 miles)', value: 'hike-required-0-5-2-miles' }, { label: 'Long hike (2+ miles)', value: 'long-hike-2-miles' }, { label: '4x4 vehicle required', value: '4x4-vehicle-required' }],
      },
      {
        key: 'crowds',
        label: 'Crowds',
        type: 'checkbox',
        options: [{ label: 'Popular (busy weekends)', value: 'popular-busy-weekends' }, { label: 'Secluded (hard to reach)', value: 'secluded-hard-to-reach' }, { label: 'Secret (locals know)', value: 'secret-locals-know' }],
      },
      {
        key: 'camping-nearby',
        label: 'Camping Nearby',
        type: 'checkbox',
        options: [{ label: 'Yes (on-site)', value: 'yes-on-site' }, { label: 'Yes (nearby campground)', value: 'yes-nearby-campground' }, { label: 'No (day use only)', value: 'no-day-use-only' }],
      },
      {
        key: 'best-season',
        label: 'Best Season',
        type: 'checkbox',
        options: [{ label: 'Winter (hot water feels amazing)', value: 'winter-hot-water-feels-amazing' }, { label: 'Spring / Fall', value: 'spring-fall' }, { label: 'Summer (can be too hot)', value: 'summer-can-be-too-hot' }],
      },
      {
        key: 'rules',
        label: 'Rules',
        type: 'checkbox',
        options: [{ label: 'No glass', value: 'no-glass' }, { label: 'No soap in water', value: 'no-soap-in-water' }, { label: 'Quiet hours', value: 'quiet-hours' }, { label: 'No alcohol', value: 'no-alcohol' }],
      },
      {
        key: 'water-testing',
        label: 'Water Testing',
        type: 'checkbox',
        options: [{ label: 'Regularly tested (developed)', value: 'regularly-tested-developed' }, { label: 'Untested (wild springs)', value: 'untested-wild-springs' }],
      },
      {
        key: 'leeches-reported',
        label: 'Leeches Reported',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'cliff-jumping-center': [
      {
        key: 'jump-height-options',
        label: 'Jump Height Options',
        type: 'checkbox',
        options: [{ label: 'Low (5-10 ft)', value: 'low-5-10-ft' }, { label: 'Medium (10-20 ft)', value: 'medium-10-20-ft' }, { label: 'High (20-30 ft)', value: 'high-20-30-ft' }, { label: 'Extreme (30-50 ft)', value: 'extreme-30-50-ft' }, { label: 'Expert (50+ ft)', value: 'expert-50-ft' }],
      },
      {
        key: 'water-depth-below',
        label: 'Water Depth Below',
        type: 'checkbox',
        options: [{ label: 'Deep (10+ ft)', value: 'deep-10-ft' }, { label: 'Very deep (20+ ft)', value: 'very-deep-20-ft' }, { label: 'Verified safe (marked)', value: 'verified-safe-marked' }],
      },
      {
        key: 'water-type',
        label: 'Water Type',
        type: 'checkbox',
        options: [{ label: 'Freshwater (lake)', value: 'freshwater-lake' }, { label: 'Freshwater (river)', value: 'freshwater-river' }, { label: 'Saltwater (ocean)', value: 'saltwater-ocean' }, { label: 'Quarry', value: 'quarry' }],
      },
      {
        key: 'lifeguard-on-duty',
        label: 'Lifeguard On Duty',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (jump at own risk)', value: 'no-jump-at-own-risk' }],
      },
      {
        key: 'rock-surface',
        label: 'Rock Surface',
        type: 'checkbox',
        options: [{ label: 'Smooth (no cuts)', value: 'smooth-no-cuts' }, { label: 'Rough (water shoes recommended)', value: 'rough-water-shoes-recommended' }, { label: 'Slippery (caution when wet)', value: 'slippery-caution-when-wet' }],
      },
      {
        key: 'entry-method',
        label: 'Entry Method',
        type: 'checkbox',
        options: [{ label: 'Jump only', value: 'jump-only' }, { label: 'Dive allowed (advanced)', value: 'dive-allowed-advanced' }, { label: 'No diving (feet first only)', value: 'no-diving-feet-first-only' }],
      },
      {
        key: 'seasonal-operation',
        label: 'Seasonal Operation',
        type: 'checkbox',
        options: [{ label: 'Summer only', value: 'summer-only' }, { label: 'Year-round (wetsuit recommended)', value: 'year-round-wetsuit-recommended' }],
      },
      {
        key: 'waiver-required',
        label: 'Waiver Required',
        type: 'checkbox',
        options: [{ label: 'Yes (before jumping)', value: 'yes-before-jumping' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'age-restriction',
        label: 'Age Restriction',
        type: 'checkbox',
        options: [{ label: 'Under 18 with parent signature', value: 'under-18-with-parent-signature' }, { label: '18+ alone', value: '18-alone' }, { label: 'No unsupervised minors', value: 'no-unsupervised-minors' }],
      },
      {
        key: 'alcohol-policy',
        label: 'Alcohol Policy',
        type: 'checkbox',
        options: [{ label: 'No alcohol allowed', value: 'no-alcohol-allowed' }, { label: 'Alcohol may impair judgment (strongly discouraged)', value: 'alcohol-may-impair-judgment-strongly-discouraged' }],
      },
      {
        key: 'emergency-response',
        label: 'Emergency Response',
        type: 'checkbox',
        options: [{ label: 'On-site first aid', value: 'on-site-first-aid' }, { label: 'Nearby (10+ minutes)', value: 'nearby-10-minutes' }, { label: 'Remote (cell service spotty)', value: 'remote-cell-service-spotty' }],
      },
      {
        key: 'local-rules',
        label: 'Local Rules',
        type: 'checkbox',
        options: [{ label: 'No jumping during high winds', value: 'no-jumping-during-high-winds' }, { label: 'No jumping after dark', value: 'no-jumping-after-dark' }, { label: 'No pushing / horseplay', value: 'no-pushing-horseplay' }],
      }
    ],
    'stargazing-area': [
      {
        key: 'dark-sky-certification',
        label: 'Dark Sky Certification',
        type: 'checkbox',
        options: [{ label: 'Yes (International Dark Sky Place)', value: 'yes-international-dark-sky-place' }, { label: 'No (still good viewing)', value: 'no-still-good-viewing' }, { label: 'Light polluted (suburban)', value: 'light-polluted-suburban' }],
      },
      {
        key: 'bortle-scale-light-pollution',
        label: 'Bortle Scale (Light Pollution)',
        type: 'checkbox',
        options: [{ label: 'Class 1 (excellent, truly dark)', value: 'class-1-excellent-truly-dark' }, { label: 'Class 2 (typical truly dark)', value: 'class-2-typical-truly-dark' }, { label: 'Class 3 (rural sky)', value: 'class-3-rural-sky' }, { label: 'Class 4 (rural/suburban transition)', value: 'class-4-rural-suburban-transition' }, { label: 'Class 5 (suburban)', value: 'class-5-suburban' }],
      },
      {
        key: 'telescope-available',
        label: 'Telescope Available',
        type: 'checkbox',
        options: [{ label: 'Yes (public viewing nights)', value: 'yes-public-viewing-nights' }, { label: 'Yes (rental)', value: 'yes-rental' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'astronomy-programs',
        label: 'Astronomy Programs',
        type: 'checkbox',
        options: [{ label: 'Ranger-led stargazing', value: 'ranger-led-stargazing' }, { label: 'Local astronomy club events', value: 'local-astronomy-club-events' }, { label: 'No organized programs', value: 'no-organized-programs' }],
      },
      {
        key: 'best-season',
        label: 'Best Season',
        type: 'checkbox',
        options: [{ label: 'Winter (long nights, clear air)', value: 'winter-long-nights-clear-air' }, { label: 'Summer (Milky Way visible)', value: 'summer-milky-way-visible' }, { label: 'Spring / Fall (good)', value: 'spring-fall-good' }],
      },
      {
        key: 'moon-phase-consideration',
        label: 'Moon Phase Consideration',
        type: 'checkbox',
        options: [{ label: 'New moon (best)', value: 'new-moon-best' }, { label: 'First / last quarter (good)', value: 'first-last-quarter-good' }, { label: 'Full moon (poor for deep sky)', value: 'full-moon-poor-for-deep-sky' }],
      },
      {
        key: 'elevation',
        label: 'Elevation',
        type: 'checkbox',
        options: [{ label: 'Low (under 3,000 ft)', value: 'low-under-3-000-ft' }, { label: 'Medium (3,000-6,000 ft)', value: 'medium-3-000-6-000-ft' }, { label: 'High (6,000+ ft, clearer skies)', value: 'high-6-000-ft-clearer-skies' }],
      },
      {
        key: 'camping-allowed-overnight',
        label: 'Camping Allowed Overnight',
        type: 'checkbox',
        options: [{ label: 'Yes (stay for late night)', value: 'yes-stay-for-late-night' }, { label: 'No (closes at dusk)', value: 'no-closes-at-dusk' }],
      },
      {
        key: 'red-light-policy',
        label: 'Red Light Policy',
        type: 'checkbox',
        options: [{ label: 'Red flashlights required', value: 'red-flashlights-required' }, { label: 'Recommended', value: 'recommended' }, { label: 'No policy (be courteous)', value: 'no-policy-be-courteous' }],
      },
      {
        key: 'parking-after-dark',
        label: 'Parking After Dark',
        type: 'checkbox',
        options: [{ label: 'Allowed', value: 'allowed' }, { label: 'Gates locked at sunset', value: 'gates-locked-at-sunset' }],
      },
      {
        key: 'weather-dependency',
        label: 'Weather Dependency',
        type: 'checkbox',
        options: [{ label: 'Clear skies needed', value: 'clear-skies-needed' }, { label: 'Check forecast before driving', value: 'check-forecast-before-driving' }],
      }
    ],
    'observatory-decks': [
      {
        key: 'deck-type',
        label: 'Deck Type',
        type: 'checkbox',
        options: [{ label: 'Indoor observation (glass enclosed)', value: 'indoor-observation-glass-enclosed' }, { label: 'Outdoor deck (open air)', value: 'outdoor-deck-open-air' }, { label: 'Rooftop (building top)', value: 'rooftop-building-top' }, { label: 'Skyscraper (floor-to-ceiling windows)', value: 'skyscraper-floor-to-ceiling-windows' }, { label: 'Cantilever (glass floor / extend out)', value: 'cantilever-glass-floor-extend-out' }],
      },
      {
        key: 'height',
        label: 'Height',
        type: 'checkbox',
        options: [{ label: 'Under 200 ft', value: 'under-200-ft' }, { label: '200-500 ft', value: '200-500-ft' }, { label: '500-1,000 ft', value: '500-1-000-ft' }, { label: '1,000-1,500 ft', value: '1-000-1-500-ft' }, { label: '1,500+ ft', value: '1-500-ft' }],
      },
      {
        key: 'ticket-price',
        label: 'Ticket Price',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: '$10-25', value: '10-25' }, { label: '$25-40', value: '25-40' }, { label: '$40-60', value: '40-60' }, { label: '$60+ (with fast pass)', value: '60-with-fast-pass' }],
      },
      {
        key: 'fast-pass-skip-line',
        label: 'Fast Pass / Skip Line',
        type: 'checkbox',
        options: [{ label: 'Available (extra fee)', value: 'available-extra-fee' }, { label: 'Included with premium ticket', value: 'included-with-premium-ticket' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'time-limit',
        label: 'Time Limit',
        type: 'checkbox',
        options: [{ label: 'No time limit', value: 'no-time-limit' }, { label: '30 minutes (peak hours)', value: '30-minutes-peak-hours' }, { label: '1 hour', value: '1-hour' }],
      },
      {
        key: 'dining-on-site',
        label: 'Dining On-Site',
        type: 'checkbox',
        options: [{ label: 'Cafe / snack bar', value: 'cafe-snack-bar' }, { label: 'Full restaurant', value: 'full-restaurant' }, { label: 'Cocktail bar', value: 'cocktail-bar' }, { label: 'No food', value: 'no-food' }],
      },
      {
        key: 'glass-floor-skywalk',
        label: 'Glass Floor / Skywalk',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'binoculars-telescopes',
        label: 'Binoculars / Telescopes',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: 'Coin-operated', value: 'coin-operated' }, { label: 'Bring your own', value: 'bring-your-own' }],
      },
      {
        key: 'sunset-ticket-premium',
        label: 'Sunset Ticket Premium',
        type: 'checkbox',
        options: [{ label: 'Higher price for sunset time slot', value: 'higher-price-for-sunset-time-slot' }, { label: 'Same price (first come for sunset)', value: 'same-price-first-come-for-sunset' }],
      },
      {
        key: 'night-vs-day',
        label: 'Night vs Day',
        type: 'checkbox',
        options: [{ label: 'Day (better for distant views)', value: 'day-better-for-distant-views' }, { label: 'Sunset (most popular)', value: 'sunset-most-popular' }, { label: 'Night (city lights)', value: 'night-city-lights' }],
      },
      {
        key: '360-views',
        label: '360° Views',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Partial (less than full circle)', value: 'partial-less-than-full-circle' }],
      },
      {
        key: 'educational-displays',
        label: 'Educational Displays',
        type: 'checkbox',
        options: [{ label: 'History of city / building', value: 'history-of-city-building' }, { label: 'Geology / geography info', value: 'geology-geography-info' }, { label: 'Interactive screens', value: 'interactive-screens' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'all-weather-access',
        label: 'All-Weather Access',
        type: 'checkbox',
        options: [{ label: 'Indoor deck (any weather)', value: 'indoor-deck-any-weather' }, { label: 'Outdoor deck (weather dependent)', value: 'outdoor-deck-weather-dependent' }],
      }
    ],
    'bowling-alley': [
      {
        key: 'lane-count',
        label: 'Lane Count',
        type: 'checkbox',
        options: [{ label: 'Small (under 10 lanes)', value: 'small-under-10-lanes' }, { label: 'Medium (10-20 lanes)', value: 'medium-10-20-lanes' }, { label: 'Large (20-40 lanes)', value: 'large-20-40-lanes' }, { label: 'Mega (40+ lanes)', value: 'mega-40-lanes' }],
      },
      {
        key: 'bowling-type',
        label: 'Bowling Type',
        type: 'checkbox',
        options: [{ label: 'Ten-pin (standard)', value: 'ten-pin-standard' }, { label: 'Candlepin (small ball)', value: 'candlepin-small-ball' }, { label: 'Duckpin (short pins)', value: 'duckpin-short-pins' }, { label: 'Bumper bowling (kids)', value: 'bumper-bowling-kids' }],
      },
      {
        key: 'shoe-rental',
        label: 'Shoe Rental',
        type: 'checkbox',
        options: [{ label: 'Included with lane rental', value: 'included-with-lane-rental' }, { label: 'Extra fee ($___)', value: 'extra-fee' }, { label: 'Bring your own', value: 'bring-your-own' }],
      },
      {
        key: 'ball-selection',
        label: 'Ball Selection',
        type: 'checkbox',
        options: [{ label: 'House balls (standard)', value: 'house-balls-standard' }, { label: 'House balls (including kids sizes)', value: 'house-balls-including-kids-sizes' }, { label: 'Bring your own ball', value: 'bring-your-own-ball' }],
      },
      {
        key: 'automatic-scoring',
        label: 'Automatic Scoring',
        type: 'checkbox',
        options: [{ label: 'Yes (with animations)', value: 'yes-with-animations' }, { label: 'Yes (basic scoring)', value: 'yes-basic-scoring' }, { label: 'Manual scoring (paper/pencil)', value: 'manual-scoring-paper-pencil' }],
      },
      {
        key: 'glow-bowling-cosmic-bowling',
        label: 'Glow Bowling / Cosmic Bowling',
        type: 'checkbox',
        options: [{ label: 'Yes (specific nights/times)', value: 'yes-specific-nights-times' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'food-drink',
        label: 'Food & Drink',
        type: 'checkbox',
        options: [{ label: 'Full kitchen / restaurant', value: 'full-kitchen-restaurant' }, { label: 'Snack bar', value: 'snack-bar' }, { label: 'Bar (beer & wine)', value: 'bar-beer-wine' }, { label: 'Full bar', value: 'full-bar' }, { label: 'Outside food allowed', value: 'outside-food-allowed' }],
      },
      {
        key: 'party-packages',
        label: 'Party Packages',
        type: 'checkbox',
        options: [{ label: 'Birthday parties', value: 'birthday-parties' }, { label: 'Corporate events', value: 'corporate-events' }, { label: 'Lane rental + food', value: 'lane-rental-food' }],
      },
      {
        key: 'vip-private-lanes',
        label: 'VIP / Private Lanes',
        type: 'checkbox',
        options: [{ label: 'Yes (roped off)', value: 'yes-roped-off' }, { label: 'Yes (private room)', value: 'yes-private-room' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'league-play',
        label: 'League Play',
        type: 'checkbox',
        options: [{ label: 'Yes (competitive)', value: 'yes-competitive' }, { label: 'Yes (social / beer league)', value: 'yes-social-beer-league' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'reservations',
        label: 'Reservations',
        type: 'checkbox',
        options: [{ label: 'Recommended (weekends)', value: 'recommended-weekends' }, { label: 'Walk-ins welcome (off-peak)', value: 'walk-ins-welcome-off-peak' }, { label: 'Lane reservation fee', value: 'lane-reservation-fee' }],
      }
    ],
    'miniature-golf-course': [
      {
        key: 'course-type',
        label: 'Course Type',
        type: 'checkbox',
        options: [{ label: 'Traditional (windmills, castles)', value: 'traditional-windmills-castles' }, { label: 'Glow-in-the-dark (indoor)', value: 'glow-in-the-dark-indoor' }, { label: 'Themed (pirate, jungle, space)', value: 'themed-pirate-jungle-space' }, { label: 'Natural / landscape (no obstacles)', value: 'natural-landscape-no-obstacles' }],
      },
      {
        key: 'number-of-holes',
        label: 'Number of Holes',
        type: 'checkbox',
        options: [{ label: '9 holes', value: '9-holes' }, { label: '18 holes', value: '18-holes' }, { label: '27 holes', value: '27-holes' }, { label: '36 holes (two courses)', value: '36-holes-two-courses' }],
      },
      {
        key: 'difficulty',
        label: 'Difficulty',
        type: 'checkbox',
        options: [{ label: 'Family friendly (easy)', value: 'family-friendly-easy' }, { label: 'Moderate (some challenging shots)', value: 'moderate-some-challenging-shots' }, { label: 'Advanced (angled surfaces, obstacles)', value: 'advanced-angled-surfaces-obstacles' }],
      },
      {
        key: 'obstacles',
        label: 'Obstacles',
        type: 'checkbox',
        options: [{ label: 'Windmills', value: 'windmills' }, { label: 'Loops', value: 'loops' }, { label: 'Tunnels', value: 'tunnels' }, { label: 'Ramps', value: 'ramps' }, { label: 'Water hazards', value: 'water-hazards' }, { label: 'Moving obstacles', value: 'moving-obstacles' }, { label: 'Elevation changes', value: 'elevation-changes' }],
      },
      {
        key: 'indoor-outdoor',
        label: 'Indoor / Outdoor',
        type: 'checkbox',
        options: [{ label: 'Outdoor (seasonal)', value: 'outdoor-seasonal' }, { label: 'Indoor (year-round)', value: 'indoor-year-round' }, { label: 'Covered / shaded', value: 'covered-shaded' }],
      },
      {
        key: 'glow-course',
        label: 'Glow Course',
        type: 'checkbox',
        options: [{ label: 'UV lighting', value: 'uv-lighting' }, { label: 'Blacklight reactive balls/obstacles', value: 'blacklight-reactive-balls-obstacles' }, { label: 'Not applicable', value: 'not-applicable' }],
      },
      {
        key: 'club-ball-included',
        label: 'Club / Ball Included',
        type: 'checkbox',
        options: [{ label: 'Putter and ball included', value: 'putter-and-ball-included' }, { label: 'Specialty putters for kids', value: 'specialty-putters-for-kids' }, { label: 'Bring your own (allowed)', value: 'bring-your-own-allowed' }],
      },
      {
        key: 'scorecard-pencil',
        label: 'Scorecard / Pencil',
        type: 'checkbox',
        options: [{ label: 'Provided', value: 'provided' }, { label: 'Digital scoring (app)', value: 'digital-scoring-app' }],
      },
      {
        key: 'course-record-board',
        label: 'Course Record Board',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'group-events',
        label: 'Group Events',
        type: 'checkbox',
        options: [{ label: 'Birthday parties', value: 'birthday-parties' }, { label: 'Mini golf tournaments', value: 'mini-golf-tournaments' }, { label: 'Company outings', value: 'company-outings' }],
      },
      {
        key: 'lighting-for-night-play',
        label: 'Lighting for Night Play',
        type: 'checkbox',
        options: [{ label: 'Yes (outdoor lit)', value: 'yes-outdoor-lit' }, { label: 'Yes (indoor always lit)', value: 'yes-indoor-always-lit' }, { label: 'No (daylight only)', value: 'no-daylight-only' }],
      },
      {
        key: 'water-features',
        label: 'Water Features',
        type: 'checkbox',
        options: [{ label: 'Ponds / streams (decorative)', value: 'ponds-streams-decorative' }, { label: 'Balls can go in water (retrieve or replace)', value: 'balls-can-go-in-water-retrieve-or-replace' }, { label: 'No water hazards', value: 'no-water-hazards' }],
      }
    ],
    'disc-golf-course': [
      {
        key: 'course-type',
        label: 'Course Type',
        type: 'checkbox',
        options: [{ label: 'Wooded / technical', value: 'wooded-technical' }, { label: 'Open / park style', value: 'open-park-style' }, { label: 'Mixed terrain', value: 'mixed-terrain' }, { label: 'Pay-to-play (private)', value: 'pay-to-play-private' }, { label: 'Free public course', value: 'free-public-course' }],
      },
      {
        key: 'number-of-holes',
        label: 'Number of Holes',
        type: 'checkbox',
        options: [{ label: '9 holes', value: '9-holes' }, { label: '18 holes', value: '18-holes' }, { label: '21+ holes', value: '21-holes' }, { label: 'Dual tees/pins (multiple layouts)', value: 'dual-tees-pins-multiple-layouts' }],
      },
      {
        key: 'course-length',
        label: 'Course Length',
        type: 'checkbox',
        options: [{ label: 'Short (under 3,000 ft total)', value: 'short-under-3-000-ft-total' }, { label: 'Medium (3,000-5,000 ft)', value: 'medium-3-000-5-000-ft' }, { label: 'Long (5,000-7,000 ft)', value: 'long-5-000-7-000-ft' }, { label: 'Pro length (7,000+ ft)', value: 'pro-length-7-000-ft' }],
      },
      {
        key: 'terrain',
        label: 'Terrain',
        type: 'checkbox',
        options: [{ label: 'Flat', value: 'flat' }, { label: 'Rolling hills', value: 'rolling-hills' }, { label: 'Steep elevation changes', value: 'steep-elevation-changes' }, { label: 'Water hazards (ponds, creeks)', value: 'water-hazards-ponds-creeks' }],
      },
      {
        key: 'par-difficulty',
        label: 'Par Difficulty',
        type: 'checkbox',
        options: [{ label: 'Under par (easy)', value: 'under-par-easy' }, { label: 'Par (average)', value: 'par-average' }, { label: 'Over par (challenging)', value: 'over-par-challenging' }, { label: 'Very challenging (pro level)', value: 'very-challenging-pro-level' }],
      },
      {
        key: 'teepad-type',
        label: 'Teepad Type',
        type: 'checkbox',
        options: [{ label: 'Concrete', value: 'concrete' }, { label: 'Rubber mat', value: 'rubber-mat' }, { label: 'Grass / natural', value: 'grass-natural' }, { label: 'Gravel', value: 'gravel' }],
      },
      {
        key: 'baskets',
        label: 'Baskets',
        type: 'checkbox',
        options: [{ label: 'Chainstar / standard', value: 'chainstar-standard' }, { label: 'Older models (catch issues)', value: 'older-models-catch-issues' }, { label: 'Temporary baskets', value: 'temporary-baskets' }],
      },
      {
        key: 'benches-shelters',
        label: 'Benches / Shelters',
        type: 'checkbox',
        options: [{ label: 'Multiple benches', value: 'multiple-benches' }, { label: 'Some benches', value: 'some-benches' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'restrooms',
        label: 'Restrooms',
        type: 'checkbox',
        options: [{ label: 'On-site', value: 'on-site' }, { label: 'Porta-potty', value: 'porta-potty' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'lost-disc-recovery',
        label: 'Lost Disc Recovery',
        type: 'checkbox',
        options: [{ label: 'Lost and found box', value: 'lost-and-found-box' }, { label: 'Returns via social media', value: 'returns-via-social-media' }, { label: 'No system', value: 'no-system' }],
      },
      {
        key: 'tournaments-hosted',
        label: 'Tournaments Hosted',
        type: 'checkbox',
        options: [{ label: 'Weekly leagues', value: 'weekly-leagues' }, { label: 'Monthly events', value: 'monthly-events' }, { label: 'PDGA sanctioned', value: 'pdga-sanctioned' }, { label: 'No organized play', value: 'no-organized-play' }],
      },
      {
        key: 'disc-rentals-sales',
        label: 'Disc Rentals / Sales',
        type: 'checkbox',
        options: [{ label: 'Sold at course (honor box)', value: 'sold-at-course-honor-box' }, { label: 'Sold nearby (shop)', value: 'sold-nearby-shop' }, { label: 'No rentals', value: 'no-rentals' }],
      },
      {
        key: 'beginner-friendly',
        label: 'Beginner Friendly',
        type: 'checkbox',
        options: [{ label: 'Short tees', value: 'short-tees' }, { label: 'Wide fairways', value: 'wide-fairways' }, { label: 'Minimal water/bushes', value: 'minimal-water-bushes' }],
      }
    ],
    'skate-park': [
      {
        key: 'park-type',
        label: 'Park Type',
        type: 'checkbox',
        options: [{ label: 'Street course (rails, stairs, ledges)', value: 'street-course-rails-stairs-ledges' }, { label: 'Bowl / pool (transition)', value: 'bowl-pool-transition' }, { label: 'Combo (street + bowl)', value: 'combo-street-bowl' }, { label: 'Pump track', value: 'pump-track' }, { label: 'Indoor (year-round)', value: 'indoor-year-round' }, { label: 'Outdoor (seasonal)', value: 'outdoor-seasonal' }],
      },
      {
        key: 'skill-level-areas',
        label: 'Skill Level Areas',
        type: 'checkbox',
        options: [{ label: 'Beginner section', value: 'beginner-section' }, { label: 'Intermediate', value: 'intermediate' }, { label: 'Advanced', value: 'advanced' }, { label: 'Mixed (all levels same areas)', value: 'mixed-all-levels-same-areas' }],
      },
      {
        key: 'surface',
        label: 'Surface',
        type: 'checkbox',
        options: [{ label: 'Concrete', value: 'concrete' }, { label: 'Wood (indoor)', value: 'wood-indoor' }, { label: 'Metal ramps (modular)', value: 'metal-ramps-modular' }, { label: 'Asphalt', value: 'asphalt' }],
      },
      {
        key: 'obstacles',
        label: 'Obstacles',
        type: 'checkbox',
        options: [{ label: 'Quarter pipes', value: 'quarter-pipes' }, { label: 'Half pipes', value: 'half-pipes' }, { label: 'Handrails', value: 'handrails' }, { label: 'Stair sets', value: 'stair-sets' }, { label: 'Ledges', value: 'ledges' }, { label: 'Fun boxes', value: 'fun-boxes' }, { label: 'Pyramid', value: 'pyramid' }, { label: 'Bank ramps', value: 'bank-ramps' }, { label: 'Spine transfer', value: 'spine-transfer' }],
      },
      {
        key: 'helmet-required',
        label: 'Helmet Required',
        type: 'checkbox',
        options: [{ label: 'Yes (all ages)', value: 'yes-all-ages' }, { label: 'Yes (under 18)', value: 'yes-under-18' }, { label: 'Recommended only', value: 'recommended-only' }, { label: 'Not required', value: 'not-required' }],
      },
      {
        key: 'pads-required',
        label: 'Pads Required',
        type: 'checkbox',
        options: [{ label: 'Knee pads', value: 'knee-pads' }, { label: 'Elbow pads', value: 'elbow-pads' }, { label: 'Wrist guards', value: 'wrist-guards' }, { label: 'No pad requirement', value: 'no-pad-requirement' }],
      },
      {
        key: 'rollerblade-bmx-friendly',
        label: 'Rollerblade / BMX Friendly',
        type: 'checkbox',
        options: [{ label: 'Skateboard only', value: 'skateboard-only' }, { label: 'Rollerblades allowed', value: 'rollerblades-allowed' }, { label: 'BMX bikes allowed (specific days)', value: 'bmx-bikes-allowed-specific-days' }, { label: 'Scooters allowed', value: 'scooters-allowed' }],
      },
      {
        key: 'lighting-for-night',
        label: 'Lighting for Night',
        type: 'checkbox',
        options: [{ label: 'Yes (lights on timer)', value: 'yes-lights-on-timer' }, { label: 'Yes (lights on until ___pm)', value: 'yes-lights-on-until-pm' }, { label: 'No (daylight only)', value: 'no-daylight-only' }],
      },
      {
        key: 'spectator-seating',
        label: 'Spectator Seating',
        type: 'checkbox',
        options: [{ label: 'Benches', value: 'benches' }, { label: 'Concrete ledges', value: 'concrete-ledges' }, { label: 'Grass area', value: 'grass-area' }, { label: 'No seating', value: 'no-seating' }],
      },
      {
        key: 'pro-shop-rentals',
        label: 'Pro Shop / Rentals',
        type: 'checkbox',
        options: [{ label: 'On-site shop', value: 'on-site-shop' }, { label: 'Rental gear available', value: 'rental-gear-available' }, { label: 'No rentals', value: 'no-rentals' }],
      },
      {
        key: 'events-contests',
        label: 'Events / Contests',
        type: 'checkbox',
        options: [{ label: 'Local contests', value: 'local-contests' }, { label: 'Demo days', value: 'demo-days' }, { label: 'No organized events', value: 'no-organized-events' }],
      },
      {
        key: 'supervision',
        label: 'Supervision',
        type: 'checkbox',
        options: [{ label: 'Staff on duty (indoor)', value: 'staff-on-duty-indoor' }, { label: 'Unsupervised (outdoor)', value: 'unsupervised-outdoor' }, { label: 'Patrols by parks dept', value: 'patrols-by-parks-dept' }],
      }
    ],
    'skating-rink': [
      {
        key: 'rink-type',
        label: 'Rink Type',
        type: 'checkbox',
        options: [{ label: 'Ice skating rink', value: 'ice-skating-rink' }, { label: 'Roller skating rink (quad skates)', value: 'roller-skating-rink-quad-skates' }, { label: 'Inline skating rink', value: 'inline-skating-rink' }],
      },
      {
        key: 'surface',
        label: 'Surface',
        type: 'checkbox',
        options: [{ label: 'Real ice (frozen)', value: 'real-ice-frozen' }, { label: 'Synthetic ice (plastic)', value: 'synthetic-ice-plastic' }, { label: 'Wood (roller)', value: 'wood-roller' }, { label: 'Concrete (roller / inline)', value: 'concrete-roller-inline' }],
      },
      {
        key: 'public-skate-sessions',
        label: 'Public Skate Sessions',
        type: 'checkbox',
        options: [{ label: 'Daily (check schedule)', value: 'daily-check-schedule' }, { label: 'Weekends only', value: 'weekends-only' }, { label: 'Seasonal (winter only)', value: 'seasonal-winter-only' }],
      },
      {
        key: 'session-length',
        label: 'Session Length',
        type: 'checkbox',
        options: [{ label: '1 hour', value: '1-hour' }, { label: '1.5 hours', value: '1-5-hours' }, { label: '2 hours', value: '2-hours' }, { label: '3+ hours (all day pass)', value: '3-hours-all-day-pass' }],
      },
      {
        key: 'skate-rental',
        label: 'Skate Rental',
        type: 'checkbox',
        options: [{ label: 'Included with admission', value: 'included-with-admission' }, { label: 'Extra fee ($___)', value: 'extra-fee' }, { label: 'Bring your own', value: 'bring-your-own' }],
      },
      {
        key: 'skate-types-available',
        label: 'Skate Types Available',
        type: 'checkbox',
        options: [{ label: 'Figure skates', value: 'figure-skates' }, { label: 'Hockey skates', value: 'hockey-skates' }, { label: 'Roller skates (quad)', value: 'roller-skates-quad' }, { label: 'Inline skates', value: 'inline-skates' }, { label: 'Double-runner (toddler/training)', value: 'double-runner-toddler-training' }],
      },
      {
        key: 'walkers-aids-for-beginners',
        label: 'Walkers / Aids for Beginners',
        type: 'checkbox',
        options: [{ label: 'Skate trainers (penguins, chairs)', value: 'skate-trainers-penguins-chairs' }, { label: 'Rental fee', value: 'rental-fee' }, { label: 'Free (limited supply)', value: 'free-limited-supply' }],
      },
      {
        key: 'hockey-availability',
        label: 'Hockey Availability',
        type: 'checkbox',
        options: [{ label: 'Stick and puck time', value: 'stick-and-puck-time' }, { label: 'Drop-in hockey', value: 'drop-in-hockey' }, { label: 'Adult league', value: 'adult-league' }, { label: 'Youth league', value: 'youth-league' }],
      },
      {
        key: 'figure-skating',
        label: 'Figure Skating',
        type: 'checkbox',
        options: [{ label: 'Freestyle sessions', value: 'freestyle-sessions' }, { label: 'Learn to skate classes', value: 'learn-to-skate-classes' }, { label: 'Private lessons available', value: 'private-lessons-available' }],
      },
      {
        key: 'birthday-parties',
        label: 'Birthday Parties',
        type: 'checkbox',
        options: [{ label: 'Party room rental', value: 'party-room-rental' }, { label: 'Skate rental included', value: 'skate-rental-included' }, { label: 'Food packages', value: 'food-packages' }],
      },
      {
        key: 'snack-bar',
        label: 'Snack Bar',
        type: 'checkbox',
        options: [{ label: 'Yes (hot food)', value: 'yes-hot-food' }, { label: 'Yes (snacks, drinks)', value: 'yes-snacks-drinks' }, { label: 'Vending machines only', value: 'vending-machines-only' }, { label: 'No food', value: 'no-food' }],
      },
      {
        key: 'spectator-area',
        label: 'Spectator Area',
        type: 'checkbox',
        options: [{ label: 'Benches / bleachers', value: 'benches-bleachers' }, { label: 'Heated viewing area (ice rink)', value: 'heated-viewing-area-ice-rink' }, { label: 'Cafe seating', value: 'cafe-seating' }],
      },
      {
        key: 'pro-shop',
        label: 'Pro Shop',
        type: 'checkbox',
        options: [{ label: 'Skate sharpening', value: 'skate-sharpening' }, { label: 'Gear sales', value: 'gear-sales' }, { label: 'No pro shop', value: 'no-pro-shop' }],
      },
      {
        key: 'temperature-ice-rink',
        label: 'Temperature (Ice Rink)',
        type: 'checkbox',
        options: [{ label: 'Cold (bring jacket)', value: 'cold-bring-jacket' }, { label: 'Very cold (gloves recommended)', value: 'very-cold-gloves-recommended' }, { label: 'Indoor climate controlled', value: 'indoor-climate-controlled' }],
      }
    ],
    'pool-billiards': [
      {
        key: 'hall-type',
        label: 'Hall Type',
        type: 'checkbox',
        options: [{ label: 'Dedicated pool hall', value: 'dedicated-pool-hall' }, { label: 'Bar with pool tables', value: 'bar-with-pool-tables' }, { label: 'Bowling alley / arcade with pool', value: 'bowling-alley-arcade-with-pool' }, { label: 'Private club', value: 'private-club' }],
      },
      {
        key: 'table-count',
        label: 'Table Count',
        type: 'checkbox',
        options: [{ label: '1-3 tables', value: '1-3-tables' }, { label: '4-8 tables', value: '4-8-tables' }, { label: '9-15 tables', value: '9-15-tables' }, { label: '15+ tables', value: '15-tables' }],
      },
      {
        key: 'table-size',
        label: 'Table Size',
        type: 'checkbox',
        options: [{ label: '7 ft (bar box)', value: '7-ft-bar-box' }, { label: '8 ft (home / recreational)', value: '8-ft-home-recreational' }, { label: '9 ft (professional)', value: '9-ft-professional' }],
      },
      {
        key: 'table-type',
        label: 'Table Type',
        type: 'checkbox',
        options: [{ label: 'Coin-operated', value: 'coin-operated' }, { label: 'Hourly rental', value: 'hourly-rental' }, { label: 'Free play (with drink purchase)', value: 'free-play-with-drink-purchase' }],
      },
      {
        key: 'game-types',
        label: 'Game Types',
        type: 'checkbox',
        options: [{ label: '8-ball', value: '8-ball' }, { label: '9-ball', value: '9-ball' }, { label: '10-ball', value: '10-ball' }, { label: 'One pocket', value: 'one-pocket' }, { label: 'Straight pool (14.1)', value: 'straight-pool-14-1' }, { label: 'Snooker (separate table)', value: 'snooker-separate-table' }],
      },
      {
        key: 'cue-quality',
        label: 'Cue Quality',
        type: 'checkbox',
        options: [{ label: 'House cues (standard)', value: 'house-cues-standard' }, { label: 'House cues (decent)', value: 'house-cues-decent' }, { label: 'High-end house cues', value: 'high-end-house-cues' }, { label: 'Bring your own cue', value: 'bring-your-own-cue' }],
      },
      {
        key: 'chalk-provided',
        label: 'Chalk Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (free)', value: 'yes-free' }, { label: 'Yes (for sale)', value: 'yes-for-sale' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'table-maintenance',
        label: 'Table Maintenance',
        type: 'checkbox',
        options: [{ label: 'Well maintained (level, clean)', value: 'well-maintained-level-clean' }, { label: 'Average (some wear)', value: 'average-some-wear' }, { label: 'Poor (ripped felt, unlevel)', value: 'poor-ripped-felt-unlevel' }],
      },
      {
        key: 'league-play',
        label: 'League Play',
        type: 'checkbox',
        options: [{ label: 'APA (American Poolplayers Association)', value: 'apa-american-poolplayers-association' }, { label: 'BCA (Billiard Congress of America)', value: 'bca-billiard-congress-of-america' }, { label: 'Local leagues', value: 'local-leagues' }, { label: 'No leagues', value: 'no-leagues' }],
      },
      {
        key: 'tournaments',
        label: 'Tournaments',
        type: 'checkbox',
        options: [{ label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }, { label: 'Quarterly', value: 'quarterly' }, { label: 'No tournaments', value: 'no-tournaments' }],
      },
      {
        key: 'smoking-policy',
        label: 'Smoking Policy',
        type: 'checkbox',
        options: [{ label: 'No smoking indoors', value: 'no-smoking-indoors' }, { label: 'Smoking allowed in designated area', value: 'smoking-allowed-in-designated-area' }, { label: 'Smoking allowed (ventilated)', value: 'smoking-allowed-ventilated' }],
      },
      {
        key: 'food-drink',
        label: 'Food & Drink',
        type: 'checkbox',
        options: [{ label: 'Full bar', value: 'full-bar' }, { label: 'Bar snacks only', value: 'bar-snacks-only' }, { label: 'Full kitchen', value: 'full-kitchen' }, { label: 'Outside food allowed', value: 'outside-food-allowed' }],
      },
      {
        key: 'age-restriction',
        label: 'Age Restriction',
        type: 'checkbox',
        options: [{ label: 'All ages (before ___pm)', value: 'all-ages-before-pm' }, { label: '18+ after ___pm', value: '18-after-pm' }, { label: '21+ only', value: '21-only' }],
      },
      {
        key: 'hourly-rate',
        label: 'Hourly Rate',
        type: 'checkbox',
        options: [{ label: 'Under $5/hour', value: 'under-5-hour' }, { label: '$5-10/hour', value: '5-10-hour' }, { label: '$10-15/hour', value: '10-15-hour' }, { label: '$15+/hour', value: '15-hour' }],
      },
      {
        key: 'private-rooms',
        label: 'Private Rooms',
        type: 'checkbox',
        options: [{ label: 'Yes (VIP table area)', value: 'yes-vip-table-area' }, { label: 'Yes (closed room)', value: 'yes-closed-room' }, { label: 'No', value: 'no' }],
      }
    ],
    'bubble-soccer-field': [
      {
        key: 'field-type',
        label: 'Field Type',
        type: 'checkbox',
        options: [{ label: 'Indoor turf', value: 'indoor-turf' }, { label: 'Outdoor grass', value: 'outdoor-grass' }, { label: 'Outdoor artificial turf', value: 'outdoor-artificial-turf' }, { label: 'Indoor gym floor (low bounce)', value: 'indoor-gym-floor-low-bounce' }],
      },
      {
        key: 'bubble-quality',
        label: 'Bubble Quality',
        type: 'checkbox',
        options: [{ label: 'Commercial grade (durable)', value: 'commercial-grade-durable' }, { label: 'Recreational grade', value: 'recreational-grade' }, { label: 'Inspected regularly', value: 'inspected-regularly' }],
      },
      {
        key: 'sizes-available',
        label: 'Sizes Available',
        type: 'checkbox',
        options: [{ label: 'Adult (5\'6" and up)', value: 'adult-5-6-and-up' }, { label: 'Youth (under 5\'6")', value: 'youth-under-5-6' }, { label: 'Kids (under 4\'6")', value: 'kids-under-4-6' }],
      },
      {
        key: 'field-size',
        label: 'Field Size',
        type: 'checkbox',
        options: [{ label: 'Small (under 30x20 yd)', value: 'small-under-30x20-yd' }, { label: 'Standard (30x20 yd)', value: 'standard-30x20-yd' }, { label: 'Large (40x25 yd)', value: 'large-40x25-yd' }],
      },
      {
        key: 'game-duration',
        label: 'Game Duration',
        type: 'checkbox',
        options: [{ label: '5 minute games', value: '5-minute-games' }, { label: '10 minute games', value: '10-minute-games' }, { label: '15 minute games', value: '15-minute-games' }, { label: '30+ minute rental', value: '30-minute-rental' }],
      },
      {
        key: 'number-of-players',
        label: 'Number of Players',
        type: 'checkbox',
        options: [{ label: '3v3', value: '3v3' }, { label: '4v4', value: '4v4' }, { label: '5v5', value: '5v5' }, { label: 'Custom teams', value: 'custom-teams' }],
      },
      {
        key: 'rules',
        label: 'Rules',
        type: 'checkbox',
        options: [{ label: 'No intentional headshots', value: 'no-intentional-headshots' }, { label: 'No kicking bubbles', value: 'no-kicking-bubbles' }, { label: 'No bubble popping (disqualify)', value: 'no-bubble-popping-disqualify' }, { label: 'Standard bubble soccer rules', value: 'standard-bubble-soccer-rules' }],
      },
      {
        key: 'bubble-sanitization',
        label: 'Bubble Sanitization',
        type: 'checkbox',
        options: [{ label: 'Cleaned between uses', value: 'cleaned-between-uses' }, { label: 'Cleaned daily', value: 'cleaned-daily' }, { label: 'Not visibly sanitized', value: 'not-visibly-sanitized' }],
      },
      {
        key: 'safety-briefing-included',
        label: 'Safety Briefing Included',
        type: 'checkbox',
        options: [{ label: 'Yes (mandatory)', value: 'yes-mandatory' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'wavier-required',
        label: 'Wavier Required',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'group-packages',
        label: 'Group Packages',
        type: 'checkbox',
        options: [{ label: 'Birthday parties', value: 'birthday-parties' }, { label: 'Bachelor / bachelorette', value: 'bachelor-bachelorette' }, { label: 'Corporate team building', value: 'corporate-team-building' }],
      }
    ],
    'bicycle-path': [
      {
        key: 'path-type',
        label: 'Path Type',
        type: 'checkbox',
        options: [{ label: 'Dedicated bike trail (paved)', value: 'dedicated-bike-trail-paved' }, { label: 'Multi-use path (bike, walk, run)', value: 'multi-use-path-bike-walk-run' }, { label: 'Mountain bike trail (dirt)', value: 'mountain-bike-trail-dirt' }, { label: 'Rail trail (converted railway)', value: 'rail-trail-converted-railway' }, { label: 'Bike lane (on road)', value: 'bike-lane-on-road' }],
      },
      {
        key: 'surface',
        label: 'Surface',
        type: 'checkbox',
        options: [{ label: 'Paved (asphalt / concrete)', value: 'paved-asphalt-concrete' }, { label: 'Crushed gravel', value: 'crushed-gravel' }, { label: 'Dirt / singletrack', value: 'dirt-singletrack' }, { label: 'Boardwalk', value: 'boardwalk' }],
      },
      {
        key: 'distance',
        label: 'Distance',
        type: 'checkbox',
        options: [{ label: 'Under 5 miles', value: 'under-5-miles' }, { label: '5-10 miles', value: '5-10-miles' }, { label: '10-25 miles', value: '10-25-miles' }, { label: '25-50 miles', value: '25-50-miles' }, { label: '50+ miles (multi-day)', value: '50-miles-multi-day' }],
      },
      {
        key: 'elevation-gain',
        label: 'Elevation Gain',
        type: 'checkbox',
        options: [{ label: 'Flat (under 100 ft per 10 miles)', value: 'flat-under-100-ft-per-10-miles' }, { label: 'Rolling hills (100-500 ft)', value: 'rolling-hills-100-500-ft' }, { label: 'Hilly (500-1,500 ft)', value: 'hilly-500-1-500-ft' }, { label: 'Mountainous (1,500+ ft)', value: 'mountainous-1-500-ft' }],
      },
      {
        key: 'scenic-value',
        label: 'Scenic Value',
        type: 'checkbox',
        options: [{ label: 'Urban / city', value: 'urban-city' }, { label: 'Suburban / residential', value: 'suburban-residential' }, { label: 'Park / greenway', value: 'park-greenway' }, { label: 'Waterfront / river', value: 'waterfront-river' }, { label: 'Forest / nature', value: 'forest-nature' }, { label: 'Mountain views', value: 'mountain-views' }],
      },
      {
        key: 'rest-stops',
        label: 'Rest Stops',
        type: 'checkbox',
        options: [{ label: 'Multiple (with water)', value: 'multiple-with-water' }, { label: 'Some (benches only)', value: 'some-benches-only' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'bike-rentals-nearby',
        label: 'Bike Rentals Nearby',
        type: 'checkbox',
        options: [{ label: 'Yes (at trailhead)', value: 'yes-at-trailhead' }, { label: 'Yes (nearby shop)', value: 'yes-nearby-shop' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'bike-repair-station',
        label: 'Bike Repair Station',
        type: 'checkbox',
        options: [{ label: 'Yes (air pump, tools)', value: 'yes-air-pump-tools' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'trailhead-amenities',
        label: 'Trailhead Amenities',
        type: 'checkbox',
        options: [{ label: 'Parking', value: 'parking' }, { label: 'Restrooms', value: 'restrooms' }, { label: 'Water fountain', value: 'water-fountain' }, { label: 'Picnic tables', value: 'picnic-tables' }],
      },
      {
        key: 'motorized-vehicles',
        label: 'Motorized Vehicles',
        type: 'checkbox',
        options: [{ label: 'No motorized vehicles', value: 'no-motorized-vehicles' }, { label: 'E-bikes allowed', value: 'e-bikes-allowed' }, { label: 'Electric scooters allowed', value: 'electric-scooters-allowed' }, { label: 'Motorcycles not allowed', value: 'motorcycles-not-allowed' }],
      },
      {
        key: 'dog-friendly',
        label: 'Dog Friendly',
        type: 'checkbox',
        options: [{ label: 'Leashed allowed', value: 'leashed-allowed' }, { label: 'Off-leash sections', value: 'off-leash-sections' }, { label: 'No dogs', value: 'no-dogs' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Fully lit (night riding)', value: 'fully-lit-night-riding' }, { label: 'Partial lighting', value: 'partial-lighting' }, { label: 'Unlit (daylight only)', value: 'unlit-daylight-only' }],
      },
      {
        key: 'toll-fee',
        label: 'Toll / Fee',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: 'Fee for parking', value: 'fee-for-parking' }, { label: 'Fee for trail use (annual pass)', value: 'fee-for-trail-use-annual-pass' }],
      },
      {
        key: 'trail-condition-report',
        label: 'Trail Condition Report',
        type: 'checkbox',
        options: [{ label: 'Available online', value: 'available-online' }, { label: 'Posted at trailhead', value: 'posted-at-trailhead' }, { label: 'Not provided', value: 'not-provided' }],
      }
    ],
    'tennis-court': [
      {
        key: 'court-surface',
        label: 'Court Surface',
        type: 'checkbox',
        options: [{ label: 'Hard (asphalt / acrylic)', value: 'hard-asphalt-acrylic' }, { label: 'Clay (red or green)', value: 'clay-red-or-green' }, { label: 'Grass (traditional)', value: 'grass-traditional' }, { label: 'Carpet (indoor)', value: 'carpet-indoor' }, { label: 'Artificial grass', value: 'artificial-grass' }],
      },
      {
        key: 'indoor-outdoor',
        label: 'Indoor / Outdoor',
        type: 'checkbox',
        options: [{ label: 'Outdoor (seasonal)', value: 'outdoor-seasonal' }, { label: 'Indoor (climate controlled)', value: 'indoor-climate-controlled' }, { label: 'Covered (open sides)', value: 'covered-open-sides' }],
      },
      {
        key: 'number-of-courts',
        label: 'Number of Courts',
        type: 'checkbox',
        options: [{ label: '1-2 courts', value: '1-2-courts' }, { label: '3-5 courts', value: '3-5-courts' }, { label: '6-10 courts', value: '6-10-courts' }, { label: '10+ courts', value: '10-courts' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Lights available (night play)', value: 'lights-available-night-play' }, { label: 'Daylight only', value: 'daylight-only' }],
      },
      {
        key: 'reservation-required',
        label: 'Reservation Required',
        type: 'checkbox',
        options: [{ label: 'Yes (online/phone)', value: 'yes-online-phone' }, { label: 'First come, first served', value: 'first-come-first-served' }, { label: 'Membership required', value: 'membership-required' }],
      },
      {
        key: 'court-fee',
        label: 'Court Fee',
        type: 'checkbox',
        options: [{ label: 'Free (public courts)', value: 'free-public-courts' }, { label: '$5-10/hour', value: '5-10-hour' }, { label: '$10-20/hour', value: '10-20-hour' }, { label: '$20+/hour', value: '20-hour' }],
      },
      {
        key: 'ball-machine-rental',
        label: 'Ball Machine Rental',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'lessons-available',
        label: 'Lessons Available',
        type: 'checkbox',
        options: [{ label: 'Private lessons', value: 'private-lessons' }, { label: 'Group clinics', value: 'group-clinics' }, { label: 'No instruction', value: 'no-instruction' }],
      },
      {
        key: 'stringing-service',
        label: 'Stringing Service',
        type: 'checkbox',
        options: [{ label: 'On-site', value: 'on-site' }, { label: 'Nearby', value: 'nearby' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'pro-shop',
        label: 'Pro Shop',
        type: 'checkbox',
        options: [{ label: 'Yes (racquets, balls, gear)', value: 'yes-racquets-balls-gear' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'bathrooms-locker-room',
        label: 'Bathrooms / Locker Room',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (porta-potty only)', value: 'no-porta-potty-only' }],
      },
      {
        key: 'water-access',
        label: 'Water Access',
        type: 'checkbox',
        options: [{ label: 'Water fountain', value: 'water-fountain' }, { label: 'Bring your own', value: 'bring-your-own' }],
      },
      {
        key: 'spectator-seating',
        label: 'Spectator Seating',
        type: 'checkbox',
        options: [{ label: 'Bleachers', value: 'bleachers' }, { label: 'Benches', value: 'benches' }, { label: 'Standing only', value: 'standing-only' }],
      },
      {
        key: 'doubles-play-allowed',
        label: 'Doubles Play Allowed',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (singles only)', value: 'no-singles-only' }],
      },
      {
        key: 'practice-wall',
        label: 'Practice Wall',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'usta-league-matches',
        label: 'USTA League Matches',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'court-condition',
        label: 'Court Condition',
        type: 'checkbox',
        options: [{ label: 'Well maintained', value: 'well-maintained' }, { label: 'Cracks / wear (playable)', value: 'cracks-wear-playable' }, { label: 'Poor condition (net issues)', value: 'poor-condition-net-issues' }],
      }
    ],
    'baseball-field': [
      {
        key: 'field-type',
        label: 'Field Type',
        type: 'checkbox',
        options: [{ label: 'Little League (youth)', value: 'little-league-youth' }, { label: 'High school', value: 'high-school' }, { label: 'College', value: 'college' }, { label: 'Minor league (professional)', value: 'minor-league-professional' }, { label: 'Adult recreational', value: 'adult-recreational' }],
      },
      {
        key: 'base-path-distance',
        label: 'Base Path Distance',
        type: 'checkbox',
        options: [{ label: '60 ft (Little League)', value: '60-ft-little-league' }, { label: '70 ft (intermediate)', value: '70-ft-intermediate' }, { label: '90 ft (standard / adult)', value: '90-ft-standard-adult' }],
      },
      {
        key: 'outfield-fence-distance',
        label: 'Outfield Fence Distance',
        type: 'checkbox',
        options: [{ label: 'Under 200 ft (youth)', value: 'under-200-ft-youth' }, { label: '200-300 ft', value: '200-300-ft' }, { label: '300-350 ft', value: '300-350-ft' }, { label: '350-400 ft', value: '350-400-ft' }],
      },
      {
        key: 'surface',
        label: 'Surface',
        type: 'checkbox',
        options: [{ label: 'Natural grass infield + outfield', value: 'natural-grass-infield-outfield' }, { label: 'Grass infield (no dirt)', value: 'grass-infield-no-dirt' }, { label: 'Artificial turf (full field)', value: 'artificial-turf-full-field' }, { label: 'Artificial turf (infield only)', value: 'artificial-turf-infield-only' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Yes (night games)', value: 'yes-night-games' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'bleachers-seating',
        label: 'Bleachers / Seating',
        type: 'checkbox',
        options: [{ label: 'None (practice field)', value: 'none-practice-field' }, { label: 'Small bleachers (under 100 seats)', value: 'small-bleachers-under-100-seats' }, { label: 'Permanent grandstand (100-500)', value: 'permanent-grandstand-100-500' }, { label: 'Stadium (500+)', value: 'stadium-500' }],
      },
      {
        key: 'batting-cages',
        label: 'Batting Cages',
        type: 'checkbox',
        options: [{ label: 'On-site (available)', value: 'on-site-available' }, { label: 'On-site (team only)', value: 'on-site-team-only' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'bullpens',
        label: 'Bullpens',
        type: 'checkbox',
        options: [{ label: 'Yes (enclosed)', value: 'yes-enclosed' }, { label: 'Yes (open)', value: 'yes-open' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'scoreboard',
        label: 'Scoreboard',
        type: 'checkbox',
        options: [{ label: 'Manual', value: 'manual' }, { label: 'Electronic', value: 'electronic' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'locker-rooms',
        label: 'Locker Rooms',
        type: 'checkbox',
        options: [{ label: 'Yes (home & visitor)', value: 'yes-home-visitor' }, { label: 'Yes (one team only)', value: 'yes-one-team-only' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'concessions',
        label: 'Concessions',
        type: 'checkbox',
        options: [{ label: 'Full service', value: 'full-service' }, { label: 'Snack bar', value: 'snack-bar' }, { label: 'Vending machines', value: 'vending-machines' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Free lot', value: 'free-lot' }, { label: 'Paid lot (event days)', value: 'paid-lot-event-days' }, { label: 'Street parking', value: 'street-parking' }],
      },
      {
        key: 'field-rental-available',
        label: 'Field Rental Available',
        type: 'checkbox',
        options: [{ label: 'Yes (hourly)', value: 'yes-hourly' }, { label: 'Yes (daily)', value: 'yes-daily' }, { label: 'No (league use only)', value: 'no-league-use-only' }],
      },
      {
        key: 'pitching-mound-height',
        label: 'Pitching Mound Height',
        type: 'checkbox',
        options: [{ label: 'Regulation (10 inches for adult)', value: 'regulation-10-inches-for-adult' }, { label: 'Youth (6-8 inches)', value: 'youth-6-8-inches' }, { label: 'Portable mound (adjustable)', value: 'portable-mound-adjustable' }],
      },
      {
        key: 'home-run-fence-padding',
        label: 'Home Run Fence Padding',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'warm-up-area',
        label: 'Warm-Up Area',
        type: 'checkbox',
        options: [{ label: 'Yes (behind dugout)', value: 'yes-behind-dugout' }, { label: 'No', value: 'no' }],
      }
    ],
    'basketball-court': [
      {
        key: 'court-type',
        label: 'Court Type',
        type: 'checkbox',
        options: [{ label: 'Full court', value: 'full-court' }, { label: 'Half court', value: 'half-court' }, { label: 'Outdoor (asphalt)', value: 'outdoor-asphalt' }, { label: 'Indoor (wood)', value: 'indoor-wood' }, { label: 'Multipurpose (volleyball lines)', value: 'multipurpose-volleyball-lines' }],
      },
      {
        key: 'rim-height',
        label: 'Rim Height',
        type: 'checkbox',
        options: [{ label: 'Regulation (10 ft)', value: 'regulation-10-ft' }, { label: 'Adjustable (8-10 ft)', value: 'adjustable-8-10-ft' }, { label: 'Youth (8 ft fixed)', value: 'youth-8-ft-fixed' }],
      },
      {
        key: 'surface',
        label: 'Surface',
        type: 'checkbox',
        options: [{ label: 'Hardwood (indoor)', value: 'hardwood-indoor' }, { label: 'Asphalt (outdoor)', value: 'asphalt-outdoor' }, { label: 'Concrete', value: 'concrete' }, { label: 'Sport tile (modular)', value: 'sport-tile-modular' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Indoor (always lit)', value: 'indoor-always-lit' }, { label: 'Outdoor (lights available)', value: 'outdoor-lights-available' }, { label: 'Outdoor (daylight only)', value: 'outdoor-daylight-only' }],
      },
      {
        key: 'number-of-hoops',
        label: 'Number of Hoops',
        type: 'checkbox',
        options: [{ label: 'Single hoop (half court)', value: 'single-hoop-half-court' }, { label: '2 hoops (full court)', value: '2-hoops-full-court' }, { label: '4 hoops (two cross courts)', value: '4-hoops-two-cross-courts' }, { label: '6+ hoops (multiple courts)', value: '6-hoops-multiple-courts' }],
      },
      {
        key: 'backboard-type',
        label: 'Backboard Type',
        type: 'checkbox',
        options: [{ label: 'Glass (professional)', value: 'glass-professional' }, { label: 'Polycarbonate (durable)', value: 'polycarbonate-durable' }, { label: 'Wood / metal (old style)', value: 'wood-metal-old-style' }],
      },
      {
        key: 'net-condition',
        label: 'Net Condition',
        type: 'checkbox',
        options: [{ label: 'Chain net', value: 'chain-net' }, { label: 'Nylon net', value: 'nylon-net' }, { label: 'No net', value: 'no-net' }],
      },
      {
        key: '3-point-line',
        label: '3-Point Line',
        type: 'checkbox',
        options: [{ label: 'Yes (marked)', value: 'yes-marked' }, { label: 'No (casual)', value: 'no-casual' }],
      },
      {
        key: 'free-throw-line',
        label: 'Free Throw Line',
        type: 'checkbox',
        options: [{ label: 'Yes (marked)', value: 'yes-marked' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'court-markings',
        label: 'Court Markings',
        type: 'checkbox',
        options: [{ label: 'Clear and painted', value: 'clear-and-painted' }, { label: 'Faded (still visible)', value: 'faded-still-visible' }, { label: 'No markings', value: 'no-markings' }],
      },
      {
        key: 'reservation-required',
        label: 'Reservation Required',
        type: 'checkbox',
        options: [{ label: 'No (public)', value: 'no-public' }, { label: 'Yes (indoor facility)', value: 'yes-indoor-facility' }, { label: 'Membership required', value: 'membership-required' }],
      },
      {
        key: 'pickup-games',
        label: 'Pickup Games',
        type: 'checkbox',
        options: [{ label: 'Regular runs (check schedule)', value: 'regular-runs-check-schedule' }, { label: 'First come, first served', value: 'first-come-first-served' }, { label: 'Organized open gym', value: 'organized-open-gym' }],
      },
      {
        key: 'water-fountains',
        label: 'Water Fountains',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'courtside-seating',
        label: 'Courtside Seating',
        type: 'checkbox',
        options: [{ label: 'Bleachers', value: 'bleachers' }, { label: 'Benches', value: 'benches' }, { label: 'Ground only', value: 'ground-only' }],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        type: 'checkbox',
        options: [{ label: 'Gate open (public)', value: 'gate-open-public' }, { label: 'Fenced (key required)', value: 'fenced-key-required' }, { label: 'Indoor (during hours)', value: 'indoor-during-hours' }],
      }
    ],
    'badminton-court': [
      {
        key: 'court-type',
        label: 'Court Type',
        type: 'checkbox',
        options: [{ label: 'Dedicated badminton court', value: 'dedicated-badminton-court' }, { label: 'Multipurpose gym (lines painted)', value: 'multipurpose-gym-lines-painted' }, { label: 'Outdoor (grass / sand)', value: 'outdoor-grass-sand' }],
      },
      {
        key: 'surface',
        label: 'Surface',
        type: 'checkbox',
        options: [{ label: 'Wood (gym floor)', value: 'wood-gym-floor' }, { label: 'Sport vinyl', value: 'sport-vinyl' }, { label: 'Concrete (outdoor)', value: 'concrete-outdoor' }, { label: 'Grass (casual)', value: 'grass-casual' }],
      },
      {
        key: 'net-provided',
        label: 'Net Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (portable)', value: 'yes-portable' }, { label: 'Yes (permanent)', value: 'yes-permanent' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'net-height',
        label: 'Net Height',
        type: 'checkbox',
        options: [{ label: 'Regulation (5\'1" center)', value: 'regulation-5-1-center' }, { label: 'Adjustable', value: 'adjustable' }, { label: 'Casual (not regulation)', value: 'casual-not-regulation' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Indoor (fluorescent / LED)', value: 'indoor-fluorescent-led' }, { label: 'Outdoor (daylight only)', value: 'outdoor-daylight-only' }],
      },
      {
        key: 'shuttlecock-type',
        label: 'Shuttlecock Type',
        type: 'checkbox',
        options: [{ label: 'Feather (pro)', value: 'feather-pro' }, { label: 'Nylon (recreational)', value: 'nylon-recreational' }, { label: 'Bring your own', value: 'bring-your-own' }],
      },
      {
        key: 'racquets-available',
        label: 'Racquets Available',
        type: 'checkbox',
        options: [{ label: 'Yes (rental)', value: 'yes-rental' }, { label: 'Yes (free to borrow)', value: 'yes-free-to-borrow' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'court-lines',
        label: 'Court Lines',
        type: 'checkbox',
        options: [{ label: 'Painted (clear)', value: 'painted-clear' }, { label: 'Taped (temporary)', value: 'taped-temporary' }, { label: 'Faded / missing', value: 'faded-missing' }],
      },
      {
        key: 'doubles-play-allowed',
        label: 'Doubles Play Allowed',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (singles only)', value: 'no-singles-only' }],
      },
      {
        key: 'ceiling-height',
        label: 'Ceiling Height',
        type: 'checkbox',
        options: [{ label: 'Regulation (30+ ft)', value: 'regulation-30-ft' }, { label: 'Low (under 20 ft - lobs limited)', value: 'low-under-20-ft-lobs-limited' }, { label: 'Standard gym (20-30 ft)', value: 'standard-gym-20-30-ft' }],
      },
      {
        key: 'air-conditioning',
        label: 'Air Conditioning',
        type: 'checkbox',
        options: [{ label: 'Yes (climate controlled)', value: 'yes-climate-controlled' }, { label: 'No (hot indoors)', value: 'no-hot-indoors' }],
      },
      {
        key: 'floor-grip',
        label: 'Floor Grip',
        type: 'checkbox',
        options: [{ label: 'Good (non-slip)', value: 'good-non-slip' }, { label: 'Slippery (dusty)', value: 'slippery-dusty' }],
      },
      {
        key: 'drop-in-play',
        label: 'Drop-In Play',
        type: 'checkbox',
        options: [{ label: 'Yes (scheduled times)', value: 'yes-scheduled-times' }, { label: 'No (reserved only)', value: 'no-reserved-only' }],
      },
      {
        key: 'tournament-hosting',
        label: 'Tournament Hosting',
        type: 'checkbox',
        options: [{ label: 'Local club tournaments', value: 'local-club-tournaments' }, { label: 'School matches', value: 'school-matches' }, { label: 'No tournaments', value: 'no-tournaments' }],
      }
    ],
    'batting-cage': [
      {
        key: 'cage-type',
        label: 'Cage Type',
        type: 'checkbox',
        options: [{ label: 'Baseball', value: 'baseball' }, { label: 'Softball (fastpitch)', value: 'softball-fastpitch' }, { label: 'Slow pitch softball', value: 'slow-pitch-softball' }, { label: 'Both (convertible)', value: 'both-convertible' }],
      },
      {
        key: 'pitching-speed',
        label: 'Pitching Speed',
        type: 'checkbox',
        options: [{ label: 'Under 40 mph (youth)', value: 'under-40-mph-youth' }, { label: '40-50 mph', value: '40-50-mph' }, { label: '50-60 mph', value: '50-60-mph' }, { label: '60-70 mph', value: '60-70-mph' }, { label: '70+ mph (advanced)', value: '70-mph-advanced' }, { label: 'Adjustable speed', value: 'adjustable-speed' }],
      },
      {
        key: 'machine-type',
        label: 'Machine Type',
        type: 'checkbox',
        options: [{ label: 'Iron mike (wheel)', value: 'iron-mike-wheel' }, { label: 'Jugs (wheel)', value: 'jugs-wheel' }, { label: 'Air cannon', value: 'air-cannon' }, { label: 'Manual toss', value: 'manual-toss' }],
      },
      {
        key: 'ball-type',
        label: 'Ball Type',
        type: 'checkbox',
        options: [{ label: 'Real baseballs', value: 'real-baseballs' }, { label: 'Dimple balls (no seams)', value: 'dimple-balls-no-seams' }, { label: 'Softballs (various sizes)', value: 'softballs-various-sizes' }],
      },
      {
        key: 'token-payment',
        label: 'Token / Payment',
        type: 'checkbox',
        options: [{ label: 'Per token (15-20 pitches)', value: 'per-token-15-20-pitches' }, { label: 'Per minute (timed)', value: 'per-minute-timed' }, { label: 'Monthly membership', value: 'monthly-membership' }, { label: 'Pre-paid card', value: 'pre-paid-card' }],
      },
      {
        key: 'lights',
        label: 'Lights',
        type: 'checkbox',
        options: [{ label: 'Indoor (always lit)', value: 'indoor-always-lit' }, { label: 'Outdoor (lit at night)', value: 'outdoor-lit-at-night' }, { label: 'Outdoor (daylight only)', value: 'outdoor-daylight-only' }],
      },
      {
        key: 'bat-rental',
        label: 'Bat Rental',
        type: 'checkbox',
        options: [{ label: 'Yes (included)', value: 'yes-included' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'helmet-provided',
        label: 'Helmet Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (mandatory)', value: 'yes-mandatory' }, { label: 'Yes (optional)', value: 'yes-optional' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'private-lessons-available',
        label: 'Private Lessons Available',
        type: 'checkbox',
        options: [{ label: 'Yes (instructor on staff)', value: 'yes-instructor-on-staff' }, { label: 'Yes (bring your own instructor)', value: 'yes-bring-your-own-instructor' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'turf-surface',
        label: 'Turf / Surface',
        type: 'checkbox',
        options: [{ label: 'Artificial turf', value: 'artificial-turf' }, { label: 'Concrete', value: 'concrete' }, { label: 'Dirt', value: 'dirt' }],
      },
      {
        key: 'pitching-distance',
        label: 'Pitching Distance',
        type: 'checkbox',
        options: [{ label: 'Youth (40-46 ft)', value: 'youth-40-46-ft' }, { label: 'Adult (60 ft 6 in baseball)', value: 'adult-60-ft-6-in-baseball' }, { label: 'Adult (43 ft softball)', value: 'adult-43-ft-softball' }],
      },
      {
        key: 'left-handed-friendly',
        label: 'Left-Handed Friendly',
        type: 'checkbox',
        options: [{ label: 'Yes (machine adjusts)', value: 'yes-machine-adjusts' }, { label: 'Yes (dedicated lefty cage)', value: 'yes-dedicated-lefty-cage' }, { label: 'No (righty only)', value: 'no-righty-only' }],
      },
      {
        key: 'group-rental',
        label: 'Group Rental',
        type: 'checkbox',
        options: [{ label: 'Birthday parties', value: 'birthday-parties' }, { label: 'Team practices', value: 'team-practices' }, { label: 'Corporate events', value: 'corporate-events' }],
      },
      {
        key: 'ball-return',
        label: 'Ball Return',
        type: 'checkbox',
        options: [{ label: 'Automatic (feeds back to machine)', value: 'automatic-feeds-back-to-machine' }, { label: 'Manual (go pick up)', value: 'manual-go-pick-up' }],
      }
    ],
    'volleyball-court': [
      {
        key: 'court-type',
        label: 'Court Type',
        type: 'checkbox',
        options: [{ label: 'Indoor (hardwood)', value: 'indoor-hardwood' }, { label: 'Beach / sand', value: 'beach-sand' }, { label: 'Grass (backyard style)', value: 'grass-backyard-style' }, { label: 'Asphalt (outdoor)', value: 'asphalt-outdoor' }],
      },
      {
        key: 'net-height',
        label: 'Net Height',
        type: 'checkbox',
        options: [{ label: 'Men\'s (7\'11 5/8")', value: 'men-s-7-11-5-8' }, { label: 'Women\'s (7\'4 1/8")', value: 'women-s-7-4-1-8' }, { label: 'Co-ed (same as women\'s)', value: 'co-ed-same-as-women-s' }, { label: 'Adjustable', value: 'adjustable' }],
      },
      {
        key: 'surface-quality',
        label: 'Surface Quality',
        type: 'checkbox',
        options: [{ label: 'Sand (fine, groomed)', value: 'sand-fine-groomed' }, { label: 'Sand (compact, needs raking)', value: 'sand-compact-needs-raking' }, { label: 'Wood (clean, taped lines)', value: 'wood-clean-taped-lines' }, { label: 'Wood (shared court, multi-sport)', value: 'wood-shared-court-multi-sport' }],
      },
      {
        key: 'number-of-courts',
        label: 'Number of Courts',
        type: 'checkbox',
        options: [{ label: '1 court', value: '1-court' }, { label: '2 courts', value: '2-courts' }, { label: '3+ courts (tournament setup)', value: '3-courts-tournament-setup' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Indoor (standard)', value: 'indoor-standard' }, { label: 'Outdoor (lights for night)', value: 'outdoor-lights-for-night' }, { label: 'Daylight only', value: 'daylight-only' }],
      },
      {
        key: 'nets-provided',
        label: 'Nets Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (permanent)', value: 'yes-permanent' }, { label: 'Yes (portable, set up)', value: 'yes-portable-set-up' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'boundary-lines',
        label: 'Boundary Lines',
        type: 'checkbox',
        options: [{ label: 'Painted (indoor)', value: 'painted-indoor' }, { label: 'Ropes / tape (sand)', value: 'ropes-tape-sand' }, { label: 'None (casual)', value: 'none-casual' }],
      },
      {
        key: 'antennae-boundary-for-hits',
        label: 'Antennae (boundary for hits)',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'volleyballs-available',
        label: 'Volleyballs Available',
        type: 'checkbox',
        options: [{ label: 'Yes (rental)', value: 'yes-rental' }, { label: 'Yes (free to use)', value: 'yes-free-to-use' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'libero-rotation-rules',
        label: 'Libero / Rotation Rules',
        type: 'checkbox',
        options: [{ label: 'Enforced (competitive)', value: 'enforced-competitive' }, { label: 'Casual (anyone plays anywhere)', value: 'casual-anyone-plays-anywhere' }],
      },
      {
        key: 'sand-court-maintenance',
        label: 'Sand Court Maintenance',
        type: 'checkbox',
        options: [{ label: 'Raked daily', value: 'raked-daily' }, { label: 'Raked weekly', value: 'raked-weekly' }, { label: 'Not maintained', value: 'not-maintained' }],
      },
      {
        key: 'showers-sand-courts',
        label: 'Showers (sand courts)',
        type: 'checkbox',
        options: [{ label: 'Outdoor rinse station', value: 'outdoor-rinse-station' }, { label: 'Indoor locker room', value: 'indoor-locker-room' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'league-play',
        label: 'League Play',
        type: 'checkbox',
        options: [{ label: 'Competitive', value: 'competitive' }, { label: 'Recreational', value: 'recreational' }, { label: 'Co-ed', value: 'co-ed' }, { label: 'No leagues', value: 'no-leagues' }],
      },
      {
        key: 'tournament-hosting',
        label: 'Tournament Hosting',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'hockey-field': [
      {
        key: 'field-type',
        label: 'Field Type',
        type: 'checkbox',
        options: [{ label: 'Field hockey (turf)', value: 'field-hockey-turf' }, { label: 'Ice hockey (rink) - see Skating Rink', value: 'ice-hockey-rink-see-skating-rink' }, { label: 'Street hockey (asphalt)', value: 'street-hockey-asphalt' }],
      },
      {
        key: 'surface',
        label: 'Surface',
        type: 'checkbox',
        options: [{ label: 'Water-based turf (fast)', value: 'water-based-turf-fast' }, { label: 'Sand-based turf (slower)', value: 'sand-based-turf-slower' }, { label: 'Natural grass (rare)', value: 'natural-grass-rare' }, { label: 'Asphalt (street hockey)', value: 'asphalt-street-hockey' }],
      },
      {
        key: 'dimensions',
        label: 'Dimensions',
        type: 'checkbox',
        options: [{ label: 'International (100 x 60 yd)', value: 'international-100-x-60-yd' }, { label: 'Standard (91 x 55 m)', value: 'standard-91-x-55-m' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Yes (night play)', value: 'yes-night-play' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'boards-barriers',
        label: 'Boards / Barriers',
        type: 'checkbox',
        options: [{ label: 'Yes (ice/street hockey)', value: 'yes-ice-street-hockey' }, { label: 'No (field hockey open)', value: 'no-field-hockey-open' }],
      },
      {
        key: 'goal-cages-provided',
        label: 'Goal Cages Provided',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'goalie-gear-available',
        label: 'Goalie Gear Available',
        type: 'checkbox',
        options: [{ label: 'Yes (rental)', value: 'yes-rental' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'sticks-available',
        label: 'Sticks Available',
        type: 'checkbox',
        options: [{ label: 'Yes (rental)', value: 'yes-rental' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'balls-vs-pucks',
        label: 'Balls vs Pucks',
        type: 'checkbox',
        options: [{ label: 'Field hockey ball (hard)', value: 'field-hockey-ball-hard' }, { label: 'Ice hockey puck', value: 'ice-hockey-puck' }, { label: 'Street hockey ball', value: 'street-hockey-ball' }],
      },
      {
        key: 'shin-guards-required',
        label: 'Shin Guards Required',
        type: 'checkbox',
        options: [{ label: 'Recommended', value: 'recommended' }, { label: 'Not required', value: 'not-required' }],
      },
      {
        key: 'mouthguard-required',
        label: 'Mouthguard Required',
        type: 'checkbox',
        options: [{ label: 'Yes (some leagues)', value: 'yes-some-leagues' }, { label: 'Recommended', value: 'recommended' }, { label: 'Not required', value: 'not-required' }],
      },
      {
        key: 'water-spray-system-turf',
        label: 'Water Spray System (turf)',
        type: 'checkbox',
        options: [{ label: 'Yes (before games)', value: 'yes-before-games' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'bleachers',
        label: 'Bleachers',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'scoreboard',
        label: 'Scoreboard',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'penalty-box',
        label: 'Penalty Box',
        type: 'checkbox',
        options: [{ label: 'Yes (ice/street)', value: 'yes-ice-street' }, { label: 'No (field hockey)', value: 'no-field-hockey' }],
      }
    ],
    'squash-court': [
      {
        key: 'court-type',
        label: 'Court Type',
        type: 'checkbox',
        options: [{ label: 'International (hardball)', value: 'international-hardball' }, { label: 'North American (softball)', value: 'north-american-softball' }, { label: 'Doubles (wider)', value: 'doubles-wider' }],
      },
      {
        key: 'wall-material',
        label: 'Wall Material',
        type: 'checkbox',
        options: [{ label: 'Painted plaster (regulation)', value: 'painted-plaster-regulation' }, { label: 'Glass back wall (show court)', value: 'glass-back-wall-show-court' }, { label: 'Concrete (older courts)', value: 'concrete-older-courts' }],
      },
      {
        key: 'floor',
        label: 'Floor',
        type: 'checkbox',
        options: [{ label: 'Maple (wood)', value: 'maple-wood' }, { label: 'Composite (sport tiles)', value: 'composite-sport-tiles' }, { label: 'Concrete', value: 'concrete' }],
      },
      {
        key: 'line-markings',
        label: 'Line Markings',
        type: 'checkbox',
        options: [{ label: 'Clear and bright', value: 'clear-and-bright' }, { label: 'Faded (playable)', value: 'faded-playable' }, { label: 'Needs repainting', value: 'needs-repainting' }],
      },
      {
        key: 'tin-height-front-wall',
        label: 'Tin Height (front wall)',
        type: 'checkbox',
        options: [{ label: 'Standard (19 inches)', value: 'standard-19-inches' }],
      },
      {
        key: 'out-of-court-above-tin',
        label: 'Out of Court (above tin)',
        type: 'checkbox',
        options: [{ label: 'Hitting above tin is out', value: 'hitting-above-tin-is-out' }, { label: 'Standard rule', value: 'standard-rule' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Side wall lights', value: 'side-wall-lights' }, { label: 'Ceiling lights (no glare)', value: 'ceiling-lights-no-glare' }, { label: 'Dim / inadequate', value: 'dim-inadequate' }],
      },
      {
        key: 'ball-type',
        label: 'Ball Type',
        type: 'checkbox',
        options: [{ label: 'Double yellow dot (pro)', value: 'double-yellow-dot-pro' }, { label: 'Single yellow dot', value: 'single-yellow-dot' }, { label: 'Red dot (beginner)', value: 'red-dot-beginner' }, { label: 'Blue dot (junior)', value: 'blue-dot-junior' }, { label: 'Provided or bring your own', value: 'provided-or-bring-your-own' }],
      },
      {
        key: 'racquet-rental',
        label: 'Racquet Rental',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'goggles-required',
        label: 'Goggles Required',
        type: 'checkbox',
        options: [{ label: 'Recommended', value: 'recommended' }, { label: 'Required (some clubs)', value: 'required-some-clubs' }, { label: 'Not required', value: 'not-required' }],
      },
      {
        key: 'spectator-area',
        label: 'Spectator Area',
        type: 'checkbox',
        options: [{ label: 'Glass back wall (viewing)', value: 'glass-back-wall-viewing' }, { label: 'Bench inside court door', value: 'bench-inside-court-door' }, { label: 'No seating', value: 'no-seating' }],
      },
      {
        key: 'court-booking',
        label: 'Court Booking',
        type: 'checkbox',
        options: [{ label: 'Hourly rental', value: 'hourly-rental' }, { label: 'Member only', value: 'member-only' }, { label: 'Pay per play', value: 'pay-per-play' }],
      },
      {
        key: 'lesson-availability',
        label: 'Lesson Availability',
        type: 'checkbox',
        options: [{ label: 'Pro on staff', value: 'pro-on-staff' }, { label: 'Clinics offered', value: 'clinics-offered' }, { label: 'No instruction', value: 'no-instruction' }],
      },
      {
        key: 'conditioning-warm-up-area',
        label: 'Conditioning / Warm-Up Area',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'rugby-pitch': [
      {
        key: 'pitch-type',
        label: 'Pitch Type',
        type: 'checkbox',
        options: [{ label: 'Grass (natural)', value: 'grass-natural' }, { label: 'Artificial turf (rugby specific)', value: 'artificial-turf-rugby-specific' }, { label: 'Multipurpose sports field (lined)', value: 'multipurpose-sports-field-lined' }],
      },
      {
        key: 'dimensions',
        label: 'Dimensions',
        type: 'checkbox',
        options: [{ label: 'Full size (100m x 70m)', value: 'full-size-100m-x-70m' }, { label: 'Reduced (smaller club level)', value: 'reduced-smaller-club-level' }, { label: 'Youth size', value: 'youth-size' }],
      },
      {
        key: 'goal-posts',
        label: 'Goal Posts',
        type: 'checkbox',
        options: [{ label: 'Yes (H-shaped, padded)', value: 'yes-h-shaped-padded' }, { label: 'Yes (H-shaped, unpadded)', value: 'yes-h-shaped-unpadded' }, { label: 'Portable posts (not permanent)', value: 'portable-posts-not-permanent' }],
      },
      {
        key: 'line-markings',
        label: 'Line Markings',
        type: 'checkbox',
        options: [{ label: 'Rugby lines (solid, dashed)', value: 'rugby-lines-solid-dashed' }, { label: 'Soccer lines only (confusing)', value: 'soccer-lines-only-confusing' }, { label: 'No markings (use cones)', value: 'no-markings-use-cones' }],
      },
      {
        key: 'changing-rooms',
        label: 'Changing Rooms',
        type: 'checkbox',
        options: [{ label: 'Yes (home)', value: 'yes-home' }, { label: 'Yes (visitor)', value: 'yes-visitor' }, { label: 'No (portable changing)', value: 'no-portable-changing' }],
      },
      {
        key: 'referee-available-for-hire',
        label: 'Referee Available for Hire',
        type: 'checkbox',
        options: [{ label: 'Yes (certified)', value: 'yes-certified' }, { label: 'Yes (club member)', value: 'yes-club-member' }, { label: 'No (self-officiate)', value: 'no-self-officiate' }],
      },
      {
        key: 'first-aid',
        label: 'First Aid',
        type: 'checkbox',
        options: [{ label: 'On-site for matches', value: 'on-site-for-matches' }, { label: 'AED available', value: 'aed-available' }, { label: 'First aid kit only', value: 'first-aid-kit-only' }],
      },
      {
        key: 'clubhouse-bar',
        label: 'Clubhouse / Bar',
        type: 'checkbox',
        options: [{ label: 'Yes (social club)', value: 'yes-social-club' }, { label: 'Yes (basic shelter)', value: 'yes-basic-shelter' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Yes (night matches)', value: 'yes-night-matches' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'bleachers',
        label: 'Bleachers',
        type: 'checkbox',
        options: [{ label: 'Permanent', value: 'permanent' }, { label: 'Temporary for matches', value: 'temporary-for-matches' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'On-site lot', value: 'on-site-lot' }, { label: 'Street parking', value: 'street-parking' }, { label: 'Limited', value: 'limited' }],
      },
      {
        key: 'youth-minis-rugby',
        label: 'Youth / Minis Rugby',
        type: 'checkbox',
        options: [{ label: 'Pitch available', value: 'pitch-available' }, { label: 'Modified rules area', value: 'modified-rules-area' }, { label: 'No youth programming', value: 'no-youth-programming' }],
      },
      {
        key: 'water-station',
        label: 'Water Station',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'racquetball-court': [
      {
        key: 'court-type',
        label: 'Court Type',
        type: 'checkbox',
        options: [{ label: 'Singles', value: 'singles' }, { label: 'Doubles (wider)', value: 'doubles-wider' }],
      },
      {
        key: 'wall-material',
        label: 'Wall Material',
        type: 'checkbox',
        options: [{ label: 'Concrete (standard)', value: 'concrete-standard' }, { label: 'Glass back wall', value: 'glass-back-wall' }, { label: 'Painted drywall (less bounce)', value: 'painted-drywall-less-bounce' }],
      },
      {
        key: 'floor',
        label: 'Floor',
        type: 'checkbox',
        options: [{ label: 'Maple wood', value: 'maple-wood' }, { label: 'Composite tiles', value: 'composite-tiles' }, { label: 'Concrete (hard on knees)', value: 'concrete-hard-on-knees' }],
      },
      {
        key: 'ceiling-height',
        label: 'Ceiling Height',
        type: 'checkbox',
        options: [{ label: 'Regulation (20 ft minimum)', value: 'regulation-20-ft-minimum' }, { label: 'Low (under 20 ft)', value: 'low-under-20-ft' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Fluorescent (no shadows)', value: 'fluorescent-no-shadows' }, { label: 'LED', value: 'led' }, { label: 'Poor (dark corners)', value: 'poor-dark-corners' }],
      },
      {
        key: 'ball-type',
        label: 'Ball Type',
        type: 'checkbox',
        options: [{ label: 'Black (standard)', value: 'black-standard' }, { label: 'Blue (beginner / cold weather)', value: 'blue-beginner-cold-weather' }, { label: 'Red (slow / high altitude)', value: 'red-slow-high-altitude' }, { label: 'Provided or bring your own', value: 'provided-or-bring-your-own' }],
      },
      {
        key: 'eyeguards-required',
        label: 'Eyeguards Required',
        type: 'checkbox',
        options: [{ label: 'Yes (club rule)', value: 'yes-club-rule' }, { label: 'Recommended', value: 'recommended' }, { label: 'Not required', value: 'not-required' }],
      },
      {
        key: 'glove-rental',
        label: 'Glove Rental',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'court-booking',
        label: 'Court Booking',
        type: 'checkbox',
        options: [{ label: 'Hourly', value: 'hourly' }, { label: 'Member only', value: 'member-only' }, { label: 'Pay per play', value: 'pay-per-play' }],
      },
      {
        key: 'lesson-availability',
        label: 'Lesson Availability',
        type: 'checkbox',
        options: [{ label: 'Pro on staff', value: 'pro-on-staff' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'warm-up-area',
        label: 'Warm-Up Area',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'beach-volleyball-court': [
      {
        key: 'court-type',
        label: 'Court Type',
        type: 'checkbox',
        options: [{ label: 'Dedicated sand court', value: 'dedicated-sand-court' }, { label: 'Converted (volleyball lines on beach)', value: 'converted-volleyball-lines-on-beach' }, { label: 'Portable net area', value: 'portable-net-area' }],
      },
      {
        key: 'sand-quality',
        label: 'Sand Quality',
        type: 'checkbox',
        options: [{ label: 'Fine, groomed', value: 'fine-groomed' }, { label: 'Compact, shell pieces', value: 'compact-shell-pieces' }, { label: 'Deep soft sand (hard to move)', value: 'deep-soft-sand-hard-to-move' }],
      },
      {
        key: 'net-height',
        label: 'Net Height',
        type: 'checkbox',
        options: [{ label: 'Men\'s (7\'11 5/8")', value: 'men-s-7-11-5-8' }, { label: 'Women\'s (7\'4 1/8")', value: 'women-s-7-4-1-8' }, { label: 'Recreational (lower)', value: 'recreational-lower' }],
      },
      {
        key: 'number-of-courts',
        label: 'Number of Courts',
        type: 'checkbox',
        options: [{ label: '1 court', value: '1-court' }, { label: '2-4 courts', value: '2-4-courts' }, { label: '5+ courts (tournaments)', value: '5-courts-tournaments' }],
      },
      {
        key: 'net-provided',
        label: 'Net Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (permanent)', value: 'yes-permanent' }, { label: 'Yes (portable, set up)', value: 'yes-portable-set-up' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'boundary-lines',
        label: 'Boundary Lines',
        type: 'checkbox',
        options: [{ label: 'Ropes in sand', value: 'ropes-in-sand' }, { label: 'Tape', value: 'tape' }, { label: 'None (use natural features)', value: 'none-use-natural-features' }],
      },
      {
        key: 'showers',
        label: 'Showers',
        type: 'checkbox',
        options: [{ label: 'Outdoor rinse', value: 'outdoor-rinse' }, { label: 'None (bring towel)', value: 'none-bring-towel' }],
      },
      {
        key: 'volleyballs-available',
        label: 'Volleyballs Available',
        type: 'checkbox',
        options: [{ label: 'Yes (rental)', value: 'yes-rental' }, { label: 'Yes (free)', value: 'yes-free' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'lights-for-night-play',
        label: 'Lights for Night Play',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'tournament-hosting',
        label: 'Tournament Hosting',
        type: 'checkbox',
        options: [{ label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }, { label: 'Major events', value: 'major-events' }],
      },
      {
        key: 'league-play',
        label: 'League Play',
        type: 'checkbox',
        options: [{ label: 'Competitive', value: 'competitive' }, { label: 'Recreational', value: 'recreational' }, { label: 'No leagues', value: 'no-leagues' }],
      },
      {
        key: 'seating-shade',
        label: 'Seating / Shade',
        type: 'checkbox',
        options: [{ label: 'Benches', value: 'benches' }, { label: 'Umbrellas nearby', value: 'umbrellas-nearby' }, { label: 'No amenities', value: 'no-amenities' }],
      }
    ],
    'bocce-ball-court': [
      {
        key: 'court-surface',
        label: 'Court Surface',
        type: 'checkbox',
        options: [{ label: 'Crushed stone / oyster shell (traditional)', value: 'crushed-stone-oyster-shell-traditional' }, { label: 'Synthetic turf (low maintenance)', value: 'synthetic-turf-low-maintenance' }, { label: 'Grass (casual)', value: 'grass-casual' }, { label: 'Sand (beach bocce)', value: 'sand-beach-bocce' }],
      },
      {
        key: 'court-dimensions',
        label: 'Court Dimensions',
        type: 'checkbox',
        options: [{ label: 'Standard (13 x 91 ft)', value: 'standard-13-x-91-ft' }, { label: 'Small (backyard size)', value: 'small-backyard-size' }, { label: 'Recreational (any size)', value: 'recreational-any-size' }],
      },
      {
        key: 'backboards',
        label: 'Backboards',
        type: 'checkbox',
        options: [{ label: 'Yes (wooden)', value: 'yes-wooden' }, { label: 'No (open ends)', value: 'no-open-ends' }],
      },
      {
        key: 'bocce-balls-provided',
        label: 'Bocce Balls Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (various weights/colors)', value: 'yes-various-weights-colors' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'pallino-small-target-ball',
        label: 'Pallino (small target ball)',
        type: 'checkbox',
        options: [{ label: 'Provided (yes)', value: 'provided-yes' }],
      },
      {
        key: 'court-markings',
        label: 'Court Markings',
        type: 'checkbox',
        options: [{ label: 'Foul line', value: 'foul-line' }, { label: 'Center line', value: 'center-line' }, { label: 'Painted lines', value: 'painted-lines' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Yes (night play)', value: 'yes-night-play' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'covered-shaded',
        label: 'Covered / Shaded',
        type: 'checkbox',
        options: [{ label: 'Covered court', value: 'covered-court' }, { label: 'Shade structure nearby', value: 'shade-structure-nearby' }, { label: 'No cover (sun exposure)', value: 'no-cover-sun-exposure' }],
      },
      {
        key: 'league-play',
        label: 'League Play',
        type: 'checkbox',
        options: [{ label: 'Yes (organized)', value: 'yes-organized' }, { label: 'Yes (informal)', value: 'yes-informal' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'instruction-available',
        label: 'Instruction Available',
        type: 'checkbox',
        options: [{ label: 'Yes (pro / club member)', value: 'yes-pro-club-member' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'scoreboard',
        label: 'Scoreboard',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (track mentally)', value: 'no-track-mentally' }],
      },
      {
        key: 'seating',
        label: 'Seating',
        type: 'checkbox',
        options: [{ label: 'Benches at ends', value: 'benches-at-ends' }, { label: 'Standing only', value: 'standing-only' }],
      },
      {
        key: 'bar-food-nearby',
        label: 'Bar / Food Nearby',
        type: 'checkbox',
        options: [{ label: 'On-site', value: 'on-site' }, { label: 'Walking distance', value: 'walking-distance' }, { label: 'None', value: 'none' }],
      }
    ],
    'handball-court-us-handball-small-wall-ball': [
      {
        key: 'court-type',
        label: 'Court Type',
        type: 'checkbox',
        options: [{ label: 'One-wall (outdoor common)', value: 'one-wall-outdoor-common' }, { label: 'Four-wall (indoor)', value: 'four-wall-indoor' }],
      },
      {
        key: 'surface',
        label: 'Surface',
        type: 'checkbox',
        options: [{ label: 'Concrete (outdoor)', value: 'concrete-outdoor' }, { label: 'Hardwood (indoor)', value: 'hardwood-indoor' }, { label: 'Plaster / cement (four-wall)', value: 'plaster-cement-four-wall' }],
      },
      {
        key: 'front-wall-height',
        label: 'Front Wall Height',
        type: 'checkbox',
        options: [{ label: '16 ft (one-wall)', value: '16-ft-one-wall' }, { label: '20 ft (four-wall)', value: '20-ft-four-wall' }],
      },
      {
        key: 'floor-markings',
        label: 'Floor Markings',
        type: 'checkbox',
        options: [{ label: 'Service line', value: 'service-line' }, { label: 'Short line', value: 'short-line' }, { label: 'Out lines', value: 'out-lines' }],
      },
      {
        key: 'handballs-provided',
        label: 'Handballs Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (rental)', value: 'yes-rental' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'gloves-recommended',
        label: 'Gloves Recommended',
        type: 'checkbox',
        options: [{ label: 'Yes (for palm protection)', value: 'yes-for-palm-protection' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'eyeguards',
        label: 'Eyeguards',
        type: 'checkbox',
        options: [{ label: 'Recommended', value: 'recommended' }, { label: 'Not required', value: 'not-required' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Outdoor (daylight only)', value: 'outdoor-daylight-only' }, { label: 'Indoor (adequate)', value: 'indoor-adequate' }, { label: 'Poor (dark spots)', value: 'poor-dark-spots' }],
      },
      {
        key: 'court-booking',
        label: 'Court Booking',
        type: 'checkbox',
        options: [{ label: 'First come, first served', value: 'first-come-first-served' }, { label: 'Reservation required', value: 'reservation-required' }],
      },
      {
        key: 'tournaments',
        label: 'Tournaments',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'american-football-field': [
      {
        key: 'field-type',
        label: 'Field Type',
        type: 'checkbox',
        options: [{ label: 'Natural grass', value: 'natural-grass' }, { label: 'Artificial turf', value: 'artificial-turf' }, { label: 'Multipurpose (lined for soccer/football)', value: 'multipurpose-lined-for-soccer-football' }],
      },
      {
        key: 'field-markings',
        label: 'Field Markings',
        type: 'checkbox',
        options: [{ label: 'Full NFL/college markings', value: 'full-nfl-college-markings' }, { label: 'High school markings', value: 'high-school-markings' }, { label: 'Practice field (limited lines)', value: 'practice-field-limited-lines' }, { label: 'No markings (use cones)', value: 'no-markings-use-cones' }],
      },
      {
        key: 'goal-posts',
        label: 'Goal Posts',
        type: 'checkbox',
        options: [{ label: 'Yes (permanent)', value: 'yes-permanent' }, { label: 'Yes (removable)', value: 'yes-removable' }, { label: 'No (bring portable)', value: 'no-bring-portable' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'scoreboard',
        label: 'Scoreboard',
        type: 'checkbox',
        options: [{ label: 'Electronic', value: 'electronic' }, { label: 'Manual', value: 'manual' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'bleachers',
        label: 'Bleachers',
        type: 'checkbox',
        options: [{ label: 'Large (500+ seats)', value: 'large-500-seats' }, { label: 'Small (under 500)', value: 'small-under-500' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'locker-rooms',
        label: 'Locker Rooms',
        type: 'checkbox',
        options: [{ label: 'Yes (home/visitor)', value: 'yes-home-visitor' }, { label: 'Yes (shared)', value: 'yes-shared' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'press-box',
        label: 'Press Box',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'field-turf-condition',
        label: 'Field Turf Condition',
        type: 'checkbox',
        options: [{ label: 'Excellent', value: 'excellent' }, { label: 'Worn (some bare spots)', value: 'worn-some-bare-spots' }, { label: 'Poor (unsafe cleats)', value: 'poor-unsafe-cleats' }],
      },
      {
        key: 'hash-marks',
        label: 'Hash Marks',
        type: 'checkbox',
        options: [{ label: 'College (40 ft apart)', value: 'college-40-ft-apart' }, { label: 'NFL (18.5 ft)', value: 'nfl-18-5-ft' }, { label: 'High school (53 ft)', value: 'high-school-53-ft' }],
      },
      {
        key: 'rental-available',
        label: 'Rental Available',
        type: 'checkbox',
        options: [{ label: 'Yes (hourly)', value: 'yes-hourly' }, { label: 'Yes (half/full day)', value: 'yes-half-full-day' }, { label: 'No (league only)', value: 'no-league-only' }],
      },
      {
        key: 'concessions',
        label: 'Concessions',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'On-site', value: 'on-site' }, { label: 'Street', value: 'street' }, { label: 'Limited', value: 'limited' }],
      }
    ],
    'tours': [
      {
        key: 'tour-type',
        label: 'Tour Type',
        type: 'checkbox',
        options: [{ label: 'Walking tour', value: 'walking-tour' }, { label: 'Bus tour', value: 'bus-tour' }, { label: 'Boat tour', value: 'boat-tour' }, { label: 'Bike tour', value: 'bike-tour' }, { label: 'Segway tour', value: 'segway-tour' }, { label: 'Scooter tour', value: 'scooter-tour' }, { label: 'Helicopter tour', value: 'helicopter-tour' }, { label: 'Food tour', value: 'food-tour' }, { label: 'Historical tour', value: 'historical-tour' }, { label: 'Ghost tour', value: 'ghost-tour' }, { label: 'Pub crawl', value: 'pub-crawl' }, { label: 'Street art tour', value: 'street-art-tour' }, { label: 'Architectural tour', value: 'architectural-tour' }, { label: 'Nature / wildlife tour', value: 'nature-wildlife-tour' }],
      },
      {
        key: 'tour-length',
        label: 'Tour Length',
        type: 'checkbox',
        options: [{ label: '1 hour', value: '1-hour' }, { label: '1.5 hours', value: '1-5-hours' }, { label: '2 hours', value: '2-hours' }, { label: '3 hours', value: '3-hours' }, { label: '4+ hours', value: '4-hours' }],
      },
      {
        key: 'meeting-point',
        label: 'Meeting Point',
        type: 'checkbox',
        options: [{ label: 'Central location (specified)', value: 'central-location-specified' }, { label: 'Hotel pickup (within zone)', value: 'hotel-pickup-within-zone' }, { label: 'Flexible (call ahead)', value: 'flexible-call-ahead' }],
      },
      {
        key: 'guide-certification',
        label: 'Guide Certification',
        type: 'checkbox',
        options: [{ label: 'Licensed guide', value: 'licensed-guide' }, { label: 'Local expert (not licensed)', value: 'local-expert-not-licensed' }, { label: 'Self-guided (app)', value: 'self-guided-app' }],
      },
      {
        key: 'audio-equipment',
        label: 'Audio Equipment',
        type: 'checkbox',
        options: [{ label: 'Headsets provided (large groups)', value: 'headsets-provided-large-groups' }, { label: 'No equipment (small group)', value: 'no-equipment-small-group' }],
      },
      {
        key: 'wheelchair-accessible-route',
        label: 'Wheelchair Accessible Route',
        type: 'checkbox',
        options: [{ label: 'Yes (fully accessible)', value: 'yes-fully-accessible' }, { label: 'Partial (some stairs)', value: 'partial-some-stairs' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'restroom-on-tour',
        label: 'Restroom on Tour',
        type: 'checkbox',
        options: [{ label: 'Yes (bus/boat)', value: 'yes-bus-boat' }, { label: 'At stops only', value: 'at-stops-only' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'snacks-water-included',
        label: 'Snacks / Water Included',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'photo-stops',
        label: 'Photo Stops',
        type: 'checkbox',
        options: [{ label: 'Multiple (planned)', value: 'multiple-planned' }, { label: 'On-request only', value: 'on-request-only' }, { label: 'None (continuous movement)', value: 'none-continuous-movement' }],
      },
      {
        key: 'rain-plan',
        label: 'Rain Plan',
        type: 'checkbox',
        options: [{ label: 'Indoor alternative', value: 'indoor-alternative' }, { label: 'Umbrellas provided', value: 'umbrellas-provided' }, { label: 'Rain or shine (no change)', value: 'rain-or-shine-no-change' }],
      }
    ],
    'aerial-tours': [
      {
        key: 'aircraft-type',
        label: 'Aircraft Type',
        type: 'checkbox',
        options: [{ label: 'Helicopter', value: 'helicopter' }, { label: 'Small plane (Cessna)', value: 'small-plane-cessna' }, { label: 'Seaplane', value: 'seaplane' }, { label: 'Gyrocopter', value: 'gyrocopter' }, { label: 'Ultralight', value: 'ultralight' }],
      },
      {
        key: 'tour-duration',
        label: 'Tour Duration',
        type: 'checkbox',
        options: [{ label: '15 minutes (quick scenic)', value: '15-minutes-quick-scenic' }, { label: '30 minutes', value: '30-minutes' }, { label: '45 minutes', value: '45-minutes' }, { label: '60 minutes', value: '60-minutes' }, { label: '90+ minutes', value: '90-minutes' }],
      },
      {
        key: 'route-sights',
        label: 'Route / Sights',
        type: 'checkbox',
        options: [{ label: 'City skyline', value: 'city-skyline' }, { label: 'Coastline / beaches', value: 'coastline-beaches' }, { label: 'Mountains', value: 'mountains' }, { label: 'Volcano', value: 'volcano' }, { label: 'Canyon', value: 'canyon' }, { label: 'Waterfalls', value: 'waterfalls' }, { label: 'National park', value: 'national-park' }, { label: 'Custom route available', value: 'custom-route-available' }],
      },
      {
        key: 'doors',
        label: 'Doors',
        type: 'checkbox',
        options: [{ label: 'Doors on', value: 'doors-on' }, { label: 'Doors off (photography)', value: 'doors-off-photography' }, { label: 'Both options', value: 'both-options' }],
      },
      {
        key: 'weight-limit',
        label: 'Weight Limit',
        type: 'checkbox',
        options: [{ label: 'Under 250 lbs per passenger', value: 'under-250-lbs-per-passenger' }, { label: 'Under 300 lbs', value: 'under-300-lbs' }, { label: 'Combined weight limit', value: 'combined-weight-limit' }],
      },
      {
        key: 'passenger-count',
        label: 'Passenger Count',
        type: 'checkbox',
        options: [{ label: 'Pilot + 1 passenger', value: 'pilot-1-passenger' }, { label: 'Pilot + 2 passengers', value: 'pilot-2-passengers' }, { label: 'Pilot + 3 passengers', value: 'pilot-3-passengers' }, { label: 'Pilot + 4+ (small plane)', value: 'pilot-4-small-plane' }],
      },
      {
        key: 'noise-cancellation-headsets',
        label: 'Noise Cancellation Headsets',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'video-photo-package',
        label: 'Video / Photo Package',
        type: 'checkbox',
        options: [{ label: 'GoPro rental', value: 'gopro-rental' }, { label: 'Professional video available', value: 'professional-video-available' }, { label: 'No recording (safety)', value: 'no-recording-safety' }],
      },
      {
        key: 'motion-sickness',
        label: 'Motion Sickness',
        type: 'checkbox',
        options: [{ label: 'Low risk (smooth)', value: 'low-risk-smooth' }, { label: 'Moderate risk (small plane)', value: 'moderate-risk-small-plane' }, { label: 'High risk (acrobatic)', value: 'high-risk-acrobatic' }],
      },
      {
        key: 'minimum-age',
        label: 'Minimum Age',
        type: 'checkbox',
        options: [{ label: 'None (lap child free)', value: 'none-lap-child-free' }, { label: '2+', value: '2' }, { label: '5+', value: '5' }, { label: '12+', value: '12' }],
      },
      {
        key: 'weather-cancellation',
        label: 'Weather Cancellation',
        type: 'checkbox',
        options: [{ label: 'Full refund', value: 'full-refund' }, { label: 'Reschedule only', value: 'reschedule-only' }, { label: 'Partial refund (if airborne)', value: 'partial-refund-if-airborne' }],
      }
    ],
    'hot-air-balloons-tour': [
      {
        key: 'tour-duration',
        label: 'Tour Duration',
        type: 'checkbox',
        options: [{ label: '1 hour (flight time)', value: '1-hour-flight-time' }, { label: '1 hour flight + 1 hour ground (setup/breakdown)', value: '1-hour-flight-1-hour-ground-setup-breakdown' }, { label: '3 hours total (including champagne)', value: '3-hours-total-including-champagne' }],
      },
      {
        key: 'passenger-capacity-per-basket',
        label: 'Passenger Capacity per Basket',
        type: 'checkbox',
        options: [{ label: '2-4 people (small)', value: '2-4-people-small' }, { label: '4-8 people (medium)', value: '4-8-people-medium' }, { label: '8-12 people (large)', value: '8-12-people-large' }, { label: '12+ people (commercial)', value: '12-people-commercial' }],
      },
      {
        key: 'basket-type',
        label: 'Basket Type',
        type: 'checkbox',
        options: [{ label: 'Divided compartments', value: 'divided-compartments' }, { label: 'Open (shared space)', value: 'open-shared-space' }, { label: 'Private basket (extra fee)', value: 'private-basket-extra-fee' }],
      },
      {
        key: 'flight-time-of-day',
        label: 'Flight Time of Day',
        type: 'checkbox',
        options: [{ label: 'Sunrise (most common)', value: 'sunrise-most-common' }, { label: 'Sunset', value: 'sunset' }, { label: 'Not available midday (thermals)', value: 'not-available-midday-thermals' }],
      },
      {
        key: 'altitude',
        label: 'Altitude',
        type: 'checkbox',
        options: [{ label: 'Low (under 500 ft)', value: 'low-under-500-ft' }, { label: 'Medium (500-1,500 ft)', value: 'medium-500-1-500-ft' }, { label: 'High (1,500-3,000 ft)', value: 'high-1-500-3-000-ft' }, { label: 'Varies by wind/conditions', value: 'varies-by-wind-conditions' }],
      },
      {
        key: 'champagne-toast',
        label: 'Champagne Toast',
        type: 'checkbox',
        options: [{ label: 'Included (post-flight tradition)', value: 'included-post-flight-tradition' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'certificate-of-flight',
        label: 'Certificate of Flight',
        type: 'checkbox',
        options: [{ label: 'Included', value: 'included' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'pickup-drop-off',
        label: 'Pickup / Drop-off',
        type: 'checkbox',
        options: [{ label: 'From launch site only', value: 'from-launch-site-only' }, { label: 'Chase vehicle returns to meeting point', value: 'chase-vehicle-returns-to-meeting-point' }],
      },
      {
        key: 'physical-requirements',
        label: 'Physical Requirements',
        type: 'checkbox',
        options: [{ label: 'Must stand for duration', value: 'must-stand-for-duration' }, { label: 'Climb into basket (step stool)', value: 'climb-into-basket-step-stool' }, { label: 'No running start needed', value: 'no-running-start-needed' }],
      },
      {
        key: 'pregnant-passengers',
        label: 'Pregnant Passengers',
        type: 'checkbox',
        options: [{ label: 'Not allowed', value: 'not-allowed' }, { label: 'Allowed (doctor\'s note)', value: 'allowed-doctor-s-note' }],
      },
      {
        key: 'weight-surcharge',
        label: 'Weight Surcharge',
        type: 'checkbox',
        options: [{ label: 'Over 250 lbs (extra fee)', value: 'over-250-lbs-extra-fee' }, { label: 'Over 300 lbs (may need 2 tickets)', value: 'over-300-lbs-may-need-2-tickets' }, { label: 'No surcharge', value: 'no-surcharge' }],
      },
      {
        key: 'weather-dependency',
        label: 'Weather Dependency',
        type: 'checkbox',
        options: [{ label: 'Highly dependent (wind, rain, fog)', value: 'highly-dependent-wind-rain-fog' }, { label: 'Call morning of flight', value: 'call-morning-of-flight' }],
      },
      {
        key: 'what-to-wear',
        label: 'What to Wear',
        type: 'checkbox',
        options: [{ label: 'Closed-toe shoes', value: 'closed-toe-shoes' }, { label: 'Layers (it\'s cold aloft)', value: 'layers-it-s-cold-aloft' }, { label: 'Hat (heat from burners)', value: 'hat-heat-from-burners' }],
      }
    ],
    'boat-charter': [
      {
        key: 'boat-type',
        label: 'Boat Type',
        type: 'checkbox',
        options: [{ label: 'Motor yacht', value: 'motor-yacht' }, { label: 'Sailboat', value: 'sailboat' }, { label: 'Catamaran', value: 'catamaran' }, { label: 'Pontoon boat', value: 'pontoon-boat' }, { label: 'Speed boat', value: 'speed-boat' }, { label: 'Trawler', value: 'trawler' }, { label: 'Houseboat (overnight)', value: 'houseboat-overnight' }],
      },
      {
        key: 'charter-type',
        label: 'Charter Type',
        type: 'checkbox',
        options: [{ label: 'Captained (professional skipper)', value: 'captained-professional-skipper' }, { label: 'Bareboat (you drive, license required)', value: 'bareboat-you-drive-license-required' }, { label: 'Crewed (captain + crew)', value: 'crewed-captain-crew' }],
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'checkbox',
        options: [{ label: '2 hours', value: '2-hours' }, { label: '4 hours (half day)', value: '4-hours-half-day' }, { label: '8 hours (full day)', value: '8-hours-full-day' }, { label: 'Overnight (1-3 nights)', value: 'overnight-1-3-nights' }, { label: 'Week long', value: 'week-long' }],
      },
      {
        key: 'capacity-passengers',
        label: 'Capacity (passengers)',
        type: 'checkbox',
        options: [{ label: 'Under 6', value: 'under-6' }, { label: '6-12', value: '6-12' }, { label: '12-25', value: '12-25' }, { label: '25-50', value: '25-50' }, { label: '50-100', value: '50-100' }, { label: '100+', value: '100' }],
      },
      {
        key: 'amenities',
        label: 'Amenities',
        type: 'checkbox',
        options: [{ label: 'Restroom (head)', value: 'restroom-head' }, { label: 'Cabin / sleeping berths', value: 'cabin-sleeping-berths' }, { label: 'Galley (kitchen)', value: 'galley-kitchen' }, { label: 'BBQ grill', value: 'bbq-grill' }, { label: 'Sound system (Bluetooth)', value: 'sound-system-bluetooth' }, { label: 'Swim platform', value: 'swim-platform' }, { label: 'Slide (from boat)', value: 'slide-from-boat' }, { label: 'Hot tub', value: 'hot-tub' }, { label: 'Flybridge', value: 'flybridge' }],
      },
      {
        key: 'water-toys-included',
        label: 'Water Toys Included',
        type: 'checkbox',
        options: [{ label: 'Paddleboard', value: 'paddleboard' }, { label: 'Kayak', value: 'kayak' }, { label: 'Snorkel gear', value: 'snorkel-gear' }, { label: 'Floating mat', value: 'floating-mat' }, { label: 'Water trampoline', value: 'water-trampoline' }, { label: 'Jetski (extra)', value: 'jetski-extra' }, { label: 'Tube for towing', value: 'tube-for-towing' }],
      },
      {
        key: 'alcohol-policy',
        label: 'Alcohol Policy',
        type: 'checkbox',
        options: [{ label: 'BYOB allowed', value: 'byob-allowed' }, { label: 'BYOB (corkage fee)', value: 'byob-corkage-fee' }, { label: 'Catered bar (extra)', value: 'catered-bar-extra' }, { label: 'No alcohol', value: 'no-alcohol' }],
      },
      {
        key: 'food-options',
        label: 'Food Options',
        type: 'checkbox',
        options: [{ label: 'Bring your own', value: 'bring-your-own' }, { label: 'Catered (snacks)', value: 'catered-snacks' }, { label: 'Catered (full meal)', value: 'catered-full-meal' }, { label: 'Chef on-board (extra)', value: 'chef-on-board-extra' }],
      },
      {
        key: 'fuel-surcharge',
        label: 'Fuel Surcharge',
        type: 'checkbox',
        options: [{ label: 'Included in charter price', value: 'included-in-charter-price' }, { label: 'Extra (actual usage)', value: 'extra-actual-usage' }, { label: 'Flat fee', value: 'flat-fee' }],
      },
      {
        key: 'captain-s-tip',
        label: 'Captain\'s Tip',
        type: 'checkbox',
        options: [{ label: 'Not included (suggested 15-20%)', value: 'not-included-suggested-15-20' }, { label: 'Included in price', value: 'included-in-price' }],
      },
      {
        key: 'swimming-allowed',
        label: 'Swimming Allowed',
        type: 'checkbox',
        options: [{ label: 'Yes (when anchored)', value: 'yes-when-anchored' }, { label: 'Yes (floating)', value: 'yes-floating' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'sunset-cruise',
        label: 'Sunset Cruise',
        type: 'checkbox',
        options: [{ label: 'Yes (specific time)', value: 'yes-specific-time' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'fishing-gear',
        label: 'Fishing Gear',
        type: 'checkbox',
        options: [{ label: 'Included', value: 'included' }, { label: 'Available (rental)', value: 'available-rental' }, { label: 'No', value: 'no' }],
      }
    ],
    'fishing-charter': [
      {
        key: 'fishing-type',
        label: 'Fishing Type',
        type: 'checkbox',
        options: [{ label: 'Deep sea / offshore', value: 'deep-sea-offshore' }, { label: 'Inshore / bay', value: 'inshore-bay' }, { label: 'Freshwater (lake)', value: 'freshwater-lake' }, { label: 'River fishing', value: 'river-fishing' }, { label: 'Fly fishing', value: 'fly-fishing' }, { label: 'Ice fishing (winter)', value: 'ice-fishing-winter' }],
      },
      {
        key: 'target-species',
        label: 'Target Species',
        type: 'checkbox',
        options: [{ label: 'Marlin / sailfish', value: 'marlin-sailfish' }, { label: 'Tuna', value: 'tuna' }, { label: 'Mahi-mahi / dorado', value: 'mahi-mahi-dorado' }, { label: 'Snapper / grouper', value: 'snapper-grouper' }, { label: 'Tarpon', value: 'tarpon' }, { label: 'Redfish / speckled trout', value: 'redfish-speckled-trout' }, { label: 'Salmon', value: 'salmon' }, { label: 'Trout', value: 'trout' }, { label: 'Bass (large/smallmouth)', value: 'bass-large-smallmouth' }, { label: 'Walleye', value: 'walleye' }, { label: 'Catfish', value: 'catfish' }],
      },
      {
        key: 'charter-duration',
        label: 'Charter Duration',
        type: 'checkbox',
        options: [{ label: '4 hours (half day)', value: '4-hours-half-day' }, { label: '6 hours (3/4 day)', value: '6-hours-3-4-day' }, { label: '8 hours (full day)', value: '8-hours-full-day' }, { label: '12+ hours (overnight)', value: '12-hours-overnight' }],
      },
      {
        key: 'catch-release-vs-keep',
        label: 'Catch & Release vs Keep',
        type: 'checkbox',
        options: [{ label: 'Catch & release only', value: 'catch-release-only' }, { label: 'Keep allowed (limit per species)', value: 'keep-allowed-limit-per-species' }, { label: 'Keep allowed (no size limit)', value: 'keep-allowed-no-size-limit' }],
      },
      {
        key: 'fish-cleaning',
        label: 'Fish Cleaning',
        type: 'checkbox',
        options: [{ label: 'Included (fileted)', value: 'included-fileted' }, { label: 'Extra fee', value: 'extra-fee' }, { label: 'No (you clean)', value: 'no-you-clean' }],
      },
      {
        key: 'license-included',
        label: 'License Included',
        type: 'checkbox',
        options: [{ label: 'Yes (boat license covers passengers)', value: 'yes-boat-license-covers-passengers' }, { label: 'Yes (daily license included)', value: 'yes-daily-license-included' }, { label: 'No (buy your own)', value: 'no-buy-your-own' }],
      },
      {
        key: 'gear-provided',
        label: 'Gear Provided',
        type: 'checkbox',
        options: [{ label: 'Rods, reels, tackle included', value: 'rods-reels-tackle-included' }, { label: 'Bait included (live/frozen)', value: 'bait-included-live-frozen' }, { label: 'Bring your own gear (allowed)', value: 'bring-your-own-gear-allowed' }],
      },
      {
        key: 'first-mate-guide',
        label: 'First Mate / Guide',
        type: 'checkbox',
        options: [{ label: 'Included (tip expected)', value: 'included-tip-expected' }, { label: 'No guide (bareboat fishing not typical)', value: 'no-guide-bareboat-fishing-not-typical' }],
      },
      {
        key: 'cooler-for-catch',
        label: 'Cooler for Catch',
        type: 'checkbox',
        options: [{ label: 'Provided (bring bags/ice for travel)', value: 'provided-bring-bags-ice-for-travel' }, { label: 'No cooler provided', value: 'no-cooler-provided' }],
      },
      {
        key: 'kids-allowed',
        label: 'Kids Allowed',
        type: 'checkbox',
        options: [{ label: 'Yes (life vests provided)', value: 'yes-life-vests-provided' }, { label: 'Age restriction (under ___ years)', value: 'age-restriction-under-years' }, { label: 'No (adults only)', value: 'no-adults-only' }],
      },
      {
        key: 'seasickness',
        label: 'Seasickness',
        type: 'checkbox',
        options: [{ label: 'Common (offshore)', value: 'common-offshore' }, { label: 'Motion sickness meds recommended', value: 'motion-sickness-meds-recommended' }, { label: 'Calm waters (inshore)', value: 'calm-waters-inshore' }],
      },
      {
        key: 'toilet-on-board',
        label: 'Toilet on Board',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (inshore small boats)', value: 'no-inshore-small-boats' }],
      },
      {
        key: 'fish-finder-electronics',
        label: 'Fish Finder / Electronics',
        type: 'checkbox',
        options: [{ label: 'Yes (professional grade)', value: 'yes-professional-grade' }, { label: 'Basic only', value: 'basic-only' }],
      }
    ],
    'limo-services': [
      {
        key: 'vehicle-type',
        label: 'Vehicle Type',
        type: 'checkbox',
        options: [{ label: 'Stretch limousine (6-10 passengers)', value: 'stretch-limousine-6-10-passengers' }, { label: 'SUV limo (10-14 passengers)', value: 'suv-limo-10-14-passengers' }, { label: 'Hummer limo (14-20 passengers)', value: 'hummer-limo-14-20-passengers' }, { label: 'Party bus (20-40 passengers)', value: 'party-bus-20-40-passengers' }, { label: 'Luxury sedan (3 passengers)', value: 'luxury-sedan-3-passengers' }, { label: 'Luxury SUV (6 passengers)', value: 'luxury-suv-6-passengers' }, { label: 'Sprinter van (8-14 passengers)', value: 'sprinter-van-8-14-passengers' }],
      },
      {
        key: 'hourly-rate',
        label: 'Hourly Rate',
        type: 'checkbox',
        options: [{ label: 'Under $100/hour', value: 'under-100-hour' }, { label: '$100-150/hour', value: '100-150-hour' }, { label: '$150-200/hour', value: '150-200-hour' }, { label: '$200-300/hour', value: '200-300-hour' }, { label: '$300+/hour', value: '300-hour' }],
      },
      {
        key: 'minimum-hours',
        label: 'Minimum Hours',
        type: 'checkbox',
        options: [{ label: '1 hour (rare)', value: '1-hour-rare' }, { label: '2 hours (standard)', value: '2-hours-standard' }, { label: '3 hours (weekends)', value: '3-hours-weekends' }, { label: '4+ hours (special events)', value: '4-hours-special-events' }],
      },
      {
        key: 'included-amenities',
        label: 'Included Amenities',
        type: 'checkbox',
        options: [{ label: 'Champagne / water', value: 'champagne-water' }, { label: 'Ice bucket / glassware', value: 'ice-bucket-glassware' }, { label: 'Fiber optic lighting', value: 'fiber-optic-lighting' }, { label: 'Sound system (Bluetooth)', value: 'sound-system-bluetooth' }, { label: 'TV screens (DVD/streaming)', value: 'tv-screens-dvd-streaming' }, { label: 'Privacy partition', value: 'privacy-partition' }, { label: 'Bar area', value: 'bar-area' }, { label: 'Stripper pole (some)', value: 'stripper-pole-some' }, { label: 'Dance floor (party bus)', value: 'dance-floor-party-bus' }],
      },
      {
        key: 'gratuity',
        label: 'Gratuity',
        type: 'checkbox',
        options: [{ label: 'Included (18-20%)', value: 'included-18-20' }, { label: 'Not included (add your own)', value: 'not-included-add-your-own' }],
      },
      {
        key: 'fuel-surcharge',
        label: 'Fuel Surcharge',
        type: 'checkbox',
        options: [{ label: 'Included', value: 'included' }, { label: 'Extra (variable)', value: 'extra-variable' }],
      },
      {
        key: 'cleaning-fee',
        label: 'Cleaning Fee',
        type: 'checkbox',
        options: [{ label: 'Included', value: 'included' }, { label: 'Extra ($___ for spills/vomit)', value: 'extra-for-spills-vomit' }],
      },
      {
        key: 'event-types',
        label: 'Event Types',
        type: 'checkbox',
        options: [{ label: 'Wedding (decorations available)', value: 'wedding-decorations-available' }, { label: 'Prom / homecoming', value: 'prom-homecoming' }, { label: 'Bachelor / bachelorette', value: 'bachelor-bachelorette' }, { label: 'Airport transfer', value: 'airport-transfer' }, { label: 'Wine tour', value: 'wine-tour' }, { label: 'Concert / event transportation', value: 'concert-event-transportation' }, { label: 'Night out / bar crawl', value: 'night-out-bar-crawl' }],
      },
      {
        key: 'red-carpet-service',
        label: 'Red Carpet Service',
        type: 'checkbox',
        options: [{ label: 'Yes (upon request)', value: 'yes-upon-request' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'signage-available',
        label: 'Signage Available',
        type: 'checkbox',
        options: [{ label: 'Yes (name on sign)', value: 'yes-name-on-sign' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'child-seat-available',
        label: 'Child Seat Available',
        type: 'checkbox',
        options: [{ label: 'Upon request (extra fee)', value: 'upon-request-extra-fee' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'smoking-policy',
        label: 'Smoking Policy',
        type: 'checkbox',
        options: [{ label: 'No smoking (cleaning fee)', value: 'no-smoking-cleaning-fee' }, { label: 'Smoking allowed (designated vehicles)', value: 'smoking-allowed-designated-vehicles' }, { label: 'Vaping allowed', value: 'vaping-allowed' }],
      }
    ],
    'coach-bus': [
      {
        key: 'bus-type',
        label: 'Bus Type',
        type: 'checkbox',
        options: [{ label: 'Standard coach (47-56 passengers)', value: 'standard-coach-47-56-passengers' }, { label: 'Mini coach (20-30 passengers)', value: 'mini-coach-20-30-passengers' }, { label: 'School bus (30-48 passengers)', value: 'school-bus-30-48-passengers' }, { label: 'Double decker (70-80 passengers)', value: 'double-decker-70-80-passengers' }, { label: 'Luxury coach (leather, WiFi)', value: 'luxury-coach-leather-wifi' }],
      },
      {
        key: 'capacity',
        label: 'Capacity',
        type: 'checkbox',
        options: [{ label: 'Under 20', value: 'under-20' }, { label: '20-35', value: '20-35' }, { label: '35-50', value: '35-50' }, { label: '50-70', value: '50-70' }, { label: '70+', value: '70' }],
      },
      {
        key: 'amenities',
        label: 'Amenities',
        type: 'checkbox',
        options: [{ label: 'Restroom (on-board)', value: 'restroom-on-board' }, { label: 'WiFi', value: 'wifi' }, { label: 'Power outlets (110v)', value: 'power-outlets-110v' }, { label: 'USB chargers', value: 'usb-chargers' }, { label: 'Reclining seats', value: 'reclining-seats' }, { label: 'Overhead storage', value: 'overhead-storage' }, { label: 'Under-bus luggage storage', value: 'under-bus-luggage-storage' }, { label: 'TV monitors', value: 'tv-monitors' }, { label: 'DVD / media player', value: 'dvd-media-player' }, { label: 'PA system / microphone', value: 'pa-system-microphone' }, { label: 'Climate control (AC/heat)', value: 'climate-control-ac-heat' }],
      },
      {
        key: 'wheelchair-lift-ramp',
        label: 'Wheelchair Lift / Ramp',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'charter-type',
        label: 'Charter Type',
        type: 'checkbox',
        options: [{ label: 'Point to point (one way)', value: 'point-to-point-one-way' }, { label: 'Hourly (multi-stop)', value: 'hourly-multi-stop' }, { label: 'Multi-day tour', value: 'multi-day-tour' }],
      },
      {
        key: 'driver-accommodations',
        label: 'Driver Accommodations',
        type: 'checkbox',
        options: [{ label: 'Hotel for overnight trips (client pays)', value: 'hotel-for-overnight-trips-client-pays' }, { label: 'Meal per diem (client pays)', value: 'meal-per-diem-client-pays' }, { label: 'Overtime after 10-12 hours', value: 'overtime-after-10-12-hours' }],
      },
      {
        key: 'parking-for-bus',
        label: 'Parking for Bus',
        type: 'checkbox',
        options: [{ label: 'Required at destination (client arranges)', value: 'required-at-destination-client-arranges' }],
      },
      {
        key: 'cancellation-policy',
        label: 'Cancellation Policy',
        type: 'checkbox',
        options: [{ label: 'Free up to 7 days', value: 'free-up-to-7-days' }, { label: '50% up to 48 hours', value: '50-up-to-48-hours' }, { label: 'No refund within 48 hours', value: 'no-refund-within-48-hours' }],
      },
      {
        key: 'insurance',
        label: 'Insurance',
        type: 'checkbox',
        options: [{ label: 'Commercial liability (provided)', value: 'commercial-liability-provided' }, { label: 'Certificate of Insurance (COI) available', value: 'certificate-of-insurance-coi-available' }],
      },
      {
        key: 'cleanliness',
        label: 'Cleanliness',
        type: 'checkbox',
        options: [{ label: 'Daily cleaning', value: 'daily-cleaning' }, { label: 'Post-trip detail available (extra)', value: 'post-trip-detail-available-extra' }],
      }
    ],
    'town-car-service': [
      {
        key: 'vehicle-type',
        label: 'Vehicle Type',
        type: 'checkbox',
        options: [{ label: 'Lincoln Town Car', value: 'lincoln-town-car' }, { label: 'Cadillac XTS / CT6', value: 'cadillac-xts-ct6' }, { label: 'Mercedes S-Class', value: 'mercedes-s-class' }, { label: 'BMW 7 Series', value: 'bmw-7-series' }, { label: 'Tesla Model S', value: 'tesla-model-s' }],
      },
      {
        key: 'capacity',
        label: 'Capacity',
        type: 'checkbox',
        options: [{ label: '3 passengers (plus driver)', value: '3-passengers-plus-driver' }, { label: 'Luggage capacity: 2-3 suitcases', value: 'luggage-capacity-2-3-suitcases' }],
      },
      {
        key: 'service-types',
        label: 'Service Types',
        type: 'checkbox',
        options: [{ label: 'Airport transfer', value: 'airport-transfer' }, { label: 'Hourly as-directed', value: 'hourly-as-directed' }, { label: 'Point to point', value: 'point-to-point' }, { label: 'Meet & greet (driver holds sign)', value: 'meet-greet-driver-holds-sign' }],
      },
      {
        key: 'flight-tracking',
        label: 'Flight Tracking',
        type: 'checkbox',
        options: [{ label: 'Yes (adjusts for delays)', value: 'yes-adjusts-for-delays' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'waiting-time',
        label: 'Waiting Time',
        type: 'checkbox',
        options: [{ label: '30 minutes included (domestic)', value: '30-minutes-included-domestic' }, { label: '60 minutes included (international)', value: '60-minutes-included-international' }, { label: 'Extra fee after ($___/hour)', value: 'extra-fee-after-hour' }],
      },
      {
        key: 'child-seat',
        label: 'Child Seat',
        type: 'checkbox',
        options: [{ label: 'Available (request in advance)', value: 'available-request-in-advance' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'payment-options',
        label: 'Payment Options',
        type: 'checkbox',
        options: [{ label: 'Credit card (pre-auth)', value: 'credit-card-pre-auth' }, { label: 'Cash (not typical)', value: 'cash-not-typical' }, { label: 'Corporate account', value: 'corporate-account' }],
      },
      {
        key: 'receipt-invoice',
        label: 'Receipt / Invoice',
        type: 'checkbox',
        options: [{ label: 'Provided (itemized)', value: 'provided-itemized' }],
      },
      {
        key: 'luggage-assistance',
        label: 'Luggage Assistance',
        type: 'checkbox',
        options: [{ label: 'Yes (driver loads/unloads)', value: 'yes-driver-loads-unloads' }],
      },
      {
        key: 'bottled-water',
        label: 'Bottled Water',
        type: 'checkbox',
        options: [{ label: 'Included', value: 'included' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'phone-charger',
        label: 'Phone Charger',
        type: 'checkbox',
        options: [{ label: 'Available (upon request)', value: 'available-upon-request' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'gps-tracking',
        label: 'GPS Tracking',
        type: 'checkbox',
        options: [{ label: 'Yes (client can view)', value: 'yes-client-can-view' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: 'Free up to 2 hours', value: 'free-up-to-2-hours' }, { label: 'Full charge within 2 hours', value: 'full-charge-within-2-hours' }],
      }
    ],
    'private-jet-charters': [
      {
        key: 'aircraft-type',
        label: 'Aircraft Type',
        type: 'checkbox',
        options: [{ label: 'Very Light Jet (VLJ) - 4-6 pax', value: 'very-light-jet-vlj-4-6-pax' }, { label: 'Light Jet - 6-8 pax', value: 'light-jet-6-8-pax' }, { label: 'Midsize Jet - 8-10 pax', value: 'midsize-jet-8-10-pax' }, { label: 'Super Midsize - 10-12 pax', value: 'super-midsize-10-12-pax' }, { label: 'Heavy Jet - 12-18 pax', value: 'heavy-jet-12-18-pax' }, { label: 'VIP Airliner - 19-50 pax', value: 'vip-airliner-19-50-pax' }],
      },
      {
        key: 'range-non-stop',
        label: 'Range (non-stop)',
        type: 'checkbox',
        options: [{ label: 'Under 1,000 miles (VLJ)', value: 'under-1-000-miles-vlj' }, { label: '1,000-2,000 miles (light jet)', value: '1-000-2-000-miles-light-jet' }, { label: '2,000-3,000 miles (midsize)', value: '2-000-3-000-miles-midsize' }, { label: '3,000-4,000 miles (heavy)', value: '3-000-4-000-miles-heavy' }, { label: '4,000+ miles (global)', value: '4-000-miles-global' }],
      },
      {
        key: 'hourly-rate',
        label: 'Hourly Rate',
        type: 'checkbox',
        options: [{ label: 'Under $3,000 (VLJ)', value: 'under-3-000-vlj' }, { label: '$3,000-5,000 (light jet)', value: '3-000-5-000-light-jet' }, { label: '$5,000-8,000 (midsize)', value: '5-000-8-000-midsize' }, { label: '$8,000-12,000 (heavy)', value: '8-000-12-000-heavy' }, { label: '$12,000+ (VIP)', value: '12-000-vip' }],
      },
      {
        key: 'empty-leg-one-way-discount',
        label: 'Empty Leg (one-way discount)',
        type: 'checkbox',
        options: [{ label: 'Yes (up to 75% off)', value: 'yes-up-to-75-off' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'catering',
        label: 'Catering',
        type: 'checkbox',
        options: [{ label: 'Custom menu (extra)', value: 'custom-menu-extra' }, { label: 'Standard snacks/drinks', value: 'standard-snacks-drinks' }, { label: 'BYO food (allowed)', value: 'byo-food-allowed' }],
      },
      {
        key: 'pet-policy',
        label: 'Pet Policy',
        type: 'checkbox',
        options: [{ label: 'Small pets (carrier) allowed', value: 'small-pets-carrier-allowed' }, { label: 'Large pets (must purchase seat)', value: 'large-pets-must-purchase-seat' }, { label: 'No pets', value: 'no-pets' }],
      },
      {
        key: 'luggage-limit',
        label: 'Luggage Limit',
        type: 'checkbox',
        options: [{ label: 'Under 500 lbs (VLJ)', value: 'under-500-lbs-vlj' }, { label: '500-1,000 lbs (midsize)', value: '500-1-000-lbs-midsize' }, { label: '1,000+ lbs (heavy)', value: '1-000-lbs-heavy' }, { label: 'Specific dimensions (call)', value: 'specific-dimensions-call' }],
      },
      {
        key: 'wifi',
        label: 'WiFi',
        type: 'checkbox',
        options: [{ label: 'Yes (standard)', value: 'yes-standard' }, { label: 'Yes (high-speed extra)', value: 'yes-high-speed-extra' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'crew',
        label: 'Crew',
        type: 'checkbox',
        options: [{ label: '2 pilots (minimum)', value: '2-pilots-minimum' }, { label: 'Flight attendant (heavy jets)', value: 'flight-attendant-heavy-jets' }],
      },
      {
        key: 'booking-lead-time',
        label: 'Booking Lead Time',
        type: 'checkbox',
        options: [{ label: 'On-demand (24 hours)', value: 'on-demand-24-hours' }, { label: '3-7 days (peak seasons)', value: '3-7-days-peak-seasons' }, { label: 'Membership program (instant)', value: 'membership-program-instant' }],
      },
      {
        key: 'security-screening',
        label: 'Security Screening',
        type: 'checkbox',
        options: [{ label: 'Private terminal (no TSA)', value: 'private-terminal-no-tsa' }, { label: 'Standard TSA (commercial terminals)', value: 'standard-tsa-commercial-terminals' }, { label: 'CBP for international', value: 'cbp-for-international' }],
      },
      {
        key: 'membership-programs',
        label: 'Membership Programs',
        type: 'checkbox',
        options: [{ label: 'Jet card (pre-paid hours)', value: 'jet-card-pre-paid-hours' }, { label: 'Fractional ownership', value: 'fractional-ownership' }, { label: 'On-demand charter only', value: 'on-demand-charter-only' }],
      },
      {
        key: 'cancellation-policy',
        label: 'Cancellation Policy',
        type: 'checkbox',
        options: [{ label: '72+ hours (refund minus fee)', value: '72-hours-refund-minus-fee' }, { label: 'Within 72 hours (full charge)', value: 'within-72-hours-full-charge' }],
      }
    ],
    'valet-service': [
      {
        key: 'service-type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'Event valet (weddings, parties)', value: 'event-valet-weddings-parties' }, { label: 'Hotel / restaurant valet (daily)', value: 'hotel-restaurant-valet-daily' }, { label: 'Hospital / medical valet', value: 'hospital-medical-valet' }, { label: 'Airport valet (park and fly)', value: 'airport-valet-park-and-fly' }],
      },
      {
        key: 'pricing-model',
        label: 'Pricing Model',
        type: 'checkbox',
        options: [{ label: 'Per vehicle (flat rate)', value: 'per-vehicle-flat-rate' }, { label: 'Per hour (event)', value: 'per-hour-event' }, { label: 'Included in venue fee', value: 'included-in-venue-fee' }, { label: 'Tip only (complimentary)', value: 'tip-only-complimentary' }],
      },
      {
        key: 'staff-uniform',
        label: 'Staff Uniform',
        type: 'checkbox',
        options: [{ label: 'Professional attire', value: 'professional-attire' }, { label: 'Branded polo / vest', value: 'branded-polo-vest' }, { label: 'Casual (event specific)', value: 'casual-event-specific' }],
      },
      {
        key: 'number-of-attendants',
        label: 'Number of Attendants',
        type: 'checkbox',
        options: [{ label: '1 attendant (under 50 cars)', value: '1-attendant-under-50-cars' }, { label: '2 attendants (50-100 cars)', value: '2-attendants-50-100-cars' }, { label: '3+ attendants (100+ cars)', value: '3-attendants-100-cars' }],
      },
      {
        key: 'valet-area-size',
        label: 'Valet Area Size',
        type: 'checkbox',
        options: [{ label: 'Small (under 10 cars at once)', value: 'small-under-10-cars-at-once' }, { label: 'Medium (10-20 cars)', value: 'medium-10-20-cars' }, { label: 'Large (20+ cars)', value: 'large-20-cars' }],
      },
      {
        key: 'lighting-for-night-events',
        label: 'Lighting for Night Events',
        type: 'checkbox',
        options: [{ label: 'Portable lights provided', value: 'portable-lights-provided' }, { label: 'Rely on venue lighting', value: 'rely-on-venue-lighting' }, { label: 'Not needed (daytime only)', value: 'not-needed-daytime-only' }],
      },
      {
        key: 'key-security',
        label: 'Key Security',
        type: 'checkbox',
        options: [{ label: 'Locked key box', value: 'locked-key-box' }, { label: 'Attendant keeps keys (tag system)', value: 'attendant-keeps-keys-tag-system' }, { label: 'Digital key tracking', value: 'digital-key-tracking' }],
      },
      {
        key: 'damage-insurance',
        label: 'Damage / Insurance',
        type: 'checkbox',
        options: [{ label: 'Liability insurance provided', value: 'liability-insurance-provided' }, { label: 'Certificate of insurance available', value: 'certificate-of-insurance-available' }, { label: 'Valet assumes responsibility', value: 'valet-assumes-responsibility' }],
      },
      {
        key: 'stick-shift-manual-drivers',
        label: 'Stick Shift / Manual Drivers',
        type: 'checkbox',
        options: [{ label: 'Attendants must be trained', value: 'attendants-must-be-trained' }, { label: 'Not all attendants drive manual', value: 'not-all-attendants-drive-manual' }, { label: 'Ask in advance', value: 'ask-in-advance' }],
      },
      {
        key: 'luxury-exotic-car-training',
        label: 'Luxury / Exotic Car Training',
        type: 'checkbox',
        options: [{ label: 'Yes (special training)', value: 'yes-special-training' }, { label: 'No (standard only)', value: 'no-standard-only' }],
      },
      {
        key: 'drop-off-pick-up-flow',
        label: 'Drop-off / Pick-up Flow',
        type: 'checkbox',
        options: [{ label: 'Drive-up lane', value: 'drive-up-lane' }, { label: 'Two-way traffic', value: 'two-way-traffic' }, { label: 'Circular driveway', value: 'circular-driveway' }],
      },
      {
        key: 'rain-plan',
        label: 'Rain Plan',
        type: 'checkbox',
        options: [{ label: 'Umbrellas for guests', value: 'umbrellas-for-guests' }, { label: 'Covered walkway', value: 'covered-walkway' }, { label: 'None (guests walk in rain)', value: 'none-guests-walk-in-rain' }],
      },
      {
        key: 'ticket-system',
        label: 'Ticket System',
        type: 'checkbox',
        options: [{ label: 'Paper tickets (numbered)', value: 'paper-tickets-numbered' }, { label: 'Digital (text to retrieve)', value: 'digital-text-to-retrieve' }, { label: 'No ticket (remember car location)', value: 'no-ticket-remember-car-location' }],
      }
    ],
    'bus-rental': [
      {
        key: 'bus-type',
        label: 'Bus Type',
        type: 'checkbox',
        options: [{ label: 'School bus (yellow)', value: 'school-bus-yellow' }, { label: 'Mini bus (15-25 pax)', value: 'mini-bus-15-25-pax' }, { label: 'Shuttle bus (airport style)', value: 'shuttle-bus-airport-style' }, { label: 'Coach bus (see above)', value: 'coach-bus-see-above' }, { label: 'Party bus (see Limo Services)', value: 'party-bus-see-limo-services' }],
      },
      {
        key: 'capacity',
        label: 'Capacity',
        type: 'checkbox',
        options: [{ label: 'Under 15', value: 'under-15' }, { label: '15-25', value: '15-25' }, { label: '25-35', value: '25-35' }, { label: '35-50', value: '35-50' }, { label: '50+', value: '50' }],
      },
      {
        key: 'use-case',
        label: 'Use Case',
        type: 'checkbox',
        options: [{ label: 'Corporate shuttle', value: 'corporate-shuttle' }, { label: 'Wedding guest transport', value: 'wedding-guest-transport' }, { label: 'Church / group outing', value: 'church-group-outing' }, { label: 'Airport group transfer', value: 'airport-group-transfer' }, { label: 'Sport team travel', value: 'sport-team-travel' }, { label: 'Field trip', value: 'field-trip' }, { label: 'Construction crew transport', value: 'construction-crew-transport' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: 'Hourly', value: 'hourly' }, { label: 'Half day (4-5 hours)', value: 'half-day-4-5-hours' }, { label: 'Full day (8-10 hours)', value: 'full-day-8-10-hours' }, { label: 'Multi-day', value: 'multi-day' }, { label: 'Monthly contract', value: 'monthly-contract' }],
      },
      {
        key: 'driver-included',
        label: 'Driver Included',
        type: 'checkbox',
        options: [{ label: 'Yes (CDL required)', value: 'yes-cdl-required' }, { label: 'No (you provide driver, rare)', value: 'no-you-provide-driver-rare' }],
      },
      {
        key: 'overtime-policy',
        label: 'Overtime Policy',
        type: 'checkbox',
        options: [{ label: 'Prorated hourly', value: 'prorated-hourly' }, { label: '1.5x standard rate', value: '1-5x-standard-rate' }, { label: 'Driver approval required', value: 'driver-approval-required' }],
      },
      {
        key: 'alcohol-policy',
        label: 'Alcohol Policy',
        type: 'checkbox',
        options: [{ label: 'No alcohol (school/church)', value: 'no-alcohol-school-church' }, { label: 'Alcohol allowed (21+ events)', value: 'alcohol-allowed-21-events' }, { label: 'Alcohol prohibited (contract)', value: 'alcohol-prohibited-contract' }],
      },
      {
        key: 'restroom-on-bus',
        label: 'Restroom on Bus',
        type: 'checkbox',
        options: [{ label: 'Yes (coach buses)', value: 'yes-coach-buses' }, { label: 'No (school/mini buses)', value: 'no-school-mini-buses' }],
      },
      {
        key: 'luggage-storage',
        label: 'Luggage Storage',
        type: 'checkbox',
        options: [{ label: 'Under bus (coach)', value: 'under-bus-coach' }, { label: 'Inside (school bus)', value: 'inside-school-bus' }, { label: 'Limited (mini bus)', value: 'limited-mini-bus' }],
      },
      {
        key: 'wheelchair-lift',
        label: 'Wheelchair Lift',
        type: 'checkbox',
        options: [{ label: 'Yes (ADA accessible)', value: 'yes-ada-accessible' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'tv-dvd',
        label: 'TV / DVD',
        type: 'checkbox',
        options: [{ label: 'Yes (some buses)', value: 'yes-some-buses' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'pa-system',
        label: 'PA System',
        type: 'checkbox',
        options: [{ label: 'Yes (coach)', value: 'yes-coach' }, { label: 'No (school bus)', value: 'no-school-bus' }],
      },
      {
        key: 'air-conditioning',
        label: 'Air Conditioning',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (older school buses)', value: 'no-older-school-buses' }],
      }
    ],
    'travel-services': [
      {
        key: 'service-type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'Full-service travel agency', value: 'full-service-travel-agency' }, { label: 'Online booking (self-service)', value: 'online-booking-self-service' }, { label: 'Corporate travel manager', value: 'corporate-travel-manager' }, { label: 'Luxury travel consultant', value: 'luxury-travel-consultant' }, { label: 'Adventure travel specialist', value: 'adventure-travel-specialist' }, { label: 'Cruise specialist', value: 'cruise-specialist' }, { label: 'Disney specialist', value: 'disney-specialist' }, { label: 'Honeymoon / destination wedding planner', value: 'honeymoon-destination-wedding-planner' }],
      },
      {
        key: 'services-offered',
        label: 'Services Offered',
        type: 'checkbox',
        options: [{ label: 'Flight booking', value: 'flight-booking' }, { label: 'Hotel booking', value: 'hotel-booking' }, { label: 'Car rental', value: 'car-rental' }, { label: 'Cruise booking', value: 'cruise-booking' }, { label: 'Tour packages', value: 'tour-packages' }, { label: 'Travel insurance', value: 'travel-insurance' }, { label: 'Visa / passport assistance', value: 'visa-passport-assistance' }, { label: 'Itinerary planning', value: 'itinerary-planning' }, { label: 'Group travel coordination', value: 'group-travel-coordination' }],
      },
      {
        key: 'fees',
        label: 'Fees',
        type: 'checkbox',
        options: [{ label: 'No fee (commission from vendors)', value: 'no-fee-commission-from-vendors' }, { label: 'Flat planning fee ($___)', value: 'flat-planning-fee' }, { label: 'Hourly consultation ($___)', value: 'hourly-consultation' }, { label: 'Percentage of trip cost (___%)', value: 'percentage-of-trip-cost' }],
      },
      {
        key: 'specializations',
        label: 'Specializations',
        type: 'checkbox',
        options: [{ label: 'Family travel', value: 'family-travel' }, { label: 'Solo travel', value: 'solo-travel' }, { label: 'Senior travel', value: 'senior-travel' }, { label: 'Accessible travel', value: 'accessible-travel' }, { label: 'LGBTQ+ travel', value: 'lgbtq-travel' }, { label: 'Group tours', value: 'group-tours' }, { label: 'Bucket list / luxury', value: 'bucket-list-luxury' }, { label: 'Budget / backpacker', value: 'budget-backpacker' }],
      },
      {
        key: '24-7-support-while-traveling',
        label: '24/7 Support While Traveling',
        type: 'checkbox',
        options: [{ label: 'Yes (emergency line)', value: 'yes-emergency-line' }, { label: 'No (business hours only)', value: 'no-business-hours-only' }],
      },
      {
        key: 'price-matching',
        label: 'Price Matching',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'cancellation-assistance',
        label: 'Cancellation Assistance',
        type: 'checkbox',
        options: [{ label: 'Yes (handles with vendors)', value: 'yes-handles-with-vendors' }, { label: 'No (client handles)', value: 'no-client-handles' }],
      },
      {
        key: 'travel-insurance-offered',
        label: 'Travel Insurance Offered',
        type: 'checkbox',
        options: [{ label: 'Yes (multiple plans)', value: 'yes-multiple-plans' }, { label: 'Yes (recommended only)', value: 'yes-recommended-only' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'rewards-loyalty-integration',
        label: 'Rewards / Loyalty Integration',
        type: 'checkbox',
        options: [{ label: 'Client keeps points', value: 'client-keeps-points' }, { label: 'Agency keeps points (discount passed)', value: 'agency-keeps-points-discount-passed' }, { label: 'Not applicable', value: 'not-applicable' }],
      },
      {
        key: 'preferred-vendor-relationships',
        label: 'Preferred Vendor Relationships',
        type: 'checkbox',
        options: [{ label: 'Yes (exclusive rates)', value: 'yes-exclusive-rates' }, { label: 'No (public rates only)', value: 'no-public-rates-only' }],
      }
    ],
    'passport-and-visa-services': [
      {
        key: 'service-type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'Passport renewal (US)', value: 'passport-renewal-us' }, { label: 'New passport (first time)', value: 'new-passport-first-time' }, { label: 'Child passport', value: 'child-passport' }, { label: 'Lost/stolen replacement', value: 'lost-stolen-replacement' }, { label: 'Visa expediting', value: 'visa-expediting' }, { label: 'Passport photos', value: 'passport-photos' }, { label: 'Foreign visa consultation', value: 'foreign-visa-consultation' }],
      },
      {
        key: 'processing-speed-passport',
        label: 'Processing Speed (Passport)',
        type: 'checkbox',
        options: [{ label: 'Standard (8-11 weeks)', value: 'standard-8-11-weeks' }, { label: 'Expedited (5-7 weeks)', value: 'expedited-5-7-weeks' }, { label: 'Rush (2-3 weeks)', value: 'rush-2-3-weeks' }, { label: 'Emergency (24-72 hours, extra fee)', value: 'emergency-24-72-hours-extra-fee' }],
      },
      {
        key: 'visa-types-handled',
        label: 'Visa Types Handled',
        type: 'checkbox',
        options: [{ label: 'Tourist visa', value: 'tourist-visa' }, { label: 'Business visa', value: 'business-visa' }, { label: 'Work visa', value: 'work-visa' }, { label: 'Student visa', value: 'student-visa' }, { label: 'Transit visa', value: 'transit-visa' }, { label: 'eVisa assistance', value: 'evisa-assistance' }],
      },
      {
        key: 'countries-specialized-in',
        label: 'Countries Specialized In',
        type: 'checkbox',
        options: [{ label: 'All countries', value: 'all-countries' }, { label: 'Specific regions (e.g., Asia, Schengen)', value: 'specific-regions-e-g-asia-schengen' }, { label: 'Popular only (Mexico, Canada, UK)', value: 'popular-only-mexico-canada-uk' }],
      },
      {
        key: 'in-person-appointment-required',
        label: 'In-Person Appointment Required',
        type: 'checkbox',
        options: [{ label: 'Yes (for first-time)', value: 'yes-for-first-time' }, { label: 'No (mail-in for renewals)', value: 'no-mail-in-for-renewals' }],
      },
      {
        key: 'passport-photo-on-site',
        label: 'Passport Photo On-Site',
        type: 'checkbox',
        options: [{ label: 'Yes (included)', value: 'yes-included' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No (must bring your own)', value: 'no-must-bring-your-own' }],
      },
      {
        key: 'form-assistance',
        label: 'Form Assistance',
        type: 'checkbox',
        options: [{ label: 'Forms provided', value: 'forms-provided' }, { label: 'Forms reviewed', value: 'forms-reviewed' }, { label: 'Forms filled out (extra)', value: 'forms-filled-out-extra' }],
      },
      {
        key: 'application-tracking',
        label: 'Application Tracking',
        type: 'checkbox',
        options: [{ label: 'Yes (online portal)', value: 'yes-online-portal' }, { label: 'Yes (email updates)', value: 'yes-email-updates' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'guarantee',
        label: 'Guarantee',
        type: 'checkbox',
        options: [{ label: 'On-time guarantee (refund if late)', value: 'on-time-guarantee-refund-if-late' }, { label: 'No guarantee (estimates only)', value: 'no-guarantee-estimates-only' }],
      },
      {
        key: 'refund-policy',
        label: 'Refund Policy',
        type: 'checkbox',
        options: [{ label: 'Full refund if not processed', value: 'full-refund-if-not-processed' }, { label: 'No refund (expediting fees)', value: 'no-refund-expediting-fees' }],
      },
      {
        key: 'government-fees',
        label: 'Government Fees',
        type: 'checkbox',
        options: [{ label: 'Paid separately (client pays direct)', value: 'paid-separately-client-pays-direct' }, { label: 'Included in service fee (marked up)', value: 'included-in-service-fee-marked-up' }],
      },
      {
        key: 'courier-service',
        label: 'Courier Service',
        type: 'checkbox',
        options: [{ label: 'Included (to/from agency)', value: 'included-to-from-agency' }, { label: 'Extra fee', value: 'extra-fee' }, { label: 'Client mails own', value: 'client-mails-own' }],
      },
      {
        key: 'emergency-travel-within-14-days',
        label: 'Emergency Travel (within 14 days)',
        type: 'checkbox',
        options: [{ label: 'Yes (appointment required)', value: 'yes-appointment-required' }, { label: 'Limited availability', value: 'limited-availability' }, { label: 'Not available', value: 'not-available' }],
      }
    ],
    'party-equipment-rental': [
      {
        key: 'equipment-types',
        label: 'Equipment Types',
        type: 'checkbox',
        options: [{ label: 'Tables (round, rectangular)', value: 'tables-round-rectangular' }, { label: 'Chairs (folding, chiavari, banquet)', value: 'chairs-folding-chiavari-banquet' }, { label: 'Linens (tablecloths, napkins)', value: 'linens-tablecloths-napkins' }, { label: 'Dinnerware (plates, cups, silverware)', value: 'dinnerware-plates-cups-silverware' }, { label: 'Glassware (wine, pint, champagne)', value: 'glassware-wine-pint-champagne' }, { label: 'Serving platters / utensils', value: 'serving-platters-utensils' }, { label: 'Chafing dishes / food warmers', value: 'chafing-dishes-food-warmers' }, { label: 'Coffee urns', value: 'coffee-urns' }, { label: 'Coolers / ice chests', value: 'coolers-ice-chests' }, { label: 'Dance floor (portable)', value: 'dance-floor-portable' }, { label: 'Stages / risers', value: 'stages-risers' }, { label: 'Tents (pop-up, frame, pole)', value: 'tents-pop-up-frame-pole' }, { label: 'Tent sidewalls', value: 'tent-sidewalls' }, { label: 'Tent lighting (string lights, lanterns)', value: 'tent-lighting-string-lights-lanterns' }, { label: 'Heaters (propane, electric)', value: 'heaters-propane-electric' }, { label: 'Fans (industrial)', value: 'fans-industrial' }, { label: 'Generators', value: 'generators' }],
      },
      {
        key: 'color-options',
        label: 'Color Options',
        type: 'checkbox',
        options: [{ label: 'White (standard)', value: 'white-standard' }, { label: 'Black', value: 'black' }, { label: 'Ivory', value: 'ivory' }, { label: 'Assorted colors (list)', value: 'assorted-colors-list' }, { label: 'Custom color (extra fee)', value: 'custom-color-extra-fee' }],
      },
      {
        key: 'table-size',
        label: 'Table Size',
        type: 'checkbox',
        options: [{ label: '30" round (cocktail)', value: '30-round-cocktail' }, { label: '48" round (4-6 seats)', value: '48-round-4-6-seats' }, { label: '60" round (6-8 seats)', value: '60-round-6-8-seats' }, { label: '72" round (8-10 seats)', value: '72-round-8-10-seats' }, { label: '8 ft rectangle (8-10 seats)', value: '8-ft-rectangle-8-10-seats' }, { label: '6 ft rectangle (6-8 seats)', value: '6-ft-rectangle-6-8-seats' }],
      },
      {
        key: 'chair-style',
        label: 'Chair Style',
        type: 'checkbox',
        options: [{ label: 'Folding (basic)', value: 'folding-basic' }, { label: 'Padded folding (comfort)', value: 'padded-folding-comfort' }, { label: 'Chiavari (wedding)', value: 'chiavari-wedding' }, { label: 'Resin (outdoor)', value: 'resin-outdoor' }, { label: 'Bar stool (height)', value: 'bar-stool-height' }],
      },
      {
        key: 'linen-fabric',
        label: 'Linen Fabric',
        type: 'checkbox',
        options: [{ label: 'Polyester (standard)', value: 'polyester-standard' }, { label: 'Spandex (fitted)', value: 'spandex-fitted' }, { label: 'Cotton (premium)', value: 'cotton-premium' }, { label: 'Lace overlay', value: 'lace-overlay' }, { label: 'Sequined', value: 'sequined' }],
      },
      {
        key: 'tent-size',
        label: 'Tent Size',
        type: 'checkbox',
        options: [{ label: '10x10', value: '10x10' }, { label: '10x20', value: '10x20' }, { label: '20x20', value: '20x20' }, { label: '20x30', value: '20x30' }, { label: '20x40', value: '20x40' }, { label: '30x30', value: '30x30' }, { label: '30x60', value: '30x60' }, { label: 'Custom size', value: 'custom-size' }],
      },
      {
        key: 'tent-installation-time',
        label: 'Tent Installation Time',
        type: 'checkbox',
        options: [{ label: '1-2 hours (small)', value: '1-2-hours-small' }, { label: '2-4 hours (medium)', value: '2-4-hours-medium' }, { label: '4-8 hours (large)', value: '4-8-hours-large' }, { label: 'Day before (for big events)', value: 'day-before-for-big-events' }],
      },
      {
        key: 'permit-required-for-tent',
        label: 'Permit Required for Tent',
        type: 'checkbox',
        options: [{ label: 'Yes (client responsible)', value: 'yes-client-responsible' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'flooring-under-tent',
        label: 'Flooring Under Tent',
        type: 'checkbox',
        options: [{ label: 'Grass (stakes allowed)', value: 'grass-stakes-allowed' }, { label: 'Concrete (weights required)', value: 'concrete-weights-required' }, { label: 'Asphalt (weights required)', value: 'asphalt-weights-required' }, { label: 'Indoor (not needed)', value: 'indoor-not-needed' }],
      },
      {
        key: 'delivery-truck-access',
        label: 'Delivery Truck Access',
        type: 'checkbox',
        options: [{ label: 'Semi-truck (full size)', value: 'semi-truck-full-size' }, { label: 'Box truck (26 ft)', value: 'box-truck-26-ft' }, { label: 'Cargo van (no lift gate)', value: 'cargo-van-no-lift-gate' }, { label: 'Will call (client picks up)', value: 'will-call-client-picks-up' }],
      },
      {
        key: 'equipment-condition',
        label: 'Equipment Condition',
        type: 'checkbox',
        options: [{ label: 'Like new', value: 'like-new' }, { label: 'Good (minor wear)', value: 'good-minor-wear' }, { label: 'Fair (functional, cosmetic wear)', value: 'fair-functional-cosmetic-wear' }],
      },
      {
        key: 'inventory-check-available',
        label: 'Inventory Check Available',
        type: 'checkbox',
        options: [{ label: 'Yes (online)', value: 'yes-online' }, { label: 'Yes (call ahead)', value: 'yes-call-ahead' }, { label: 'No (first come)', value: 'no-first-come' }],
      }
    ],
    'balloon-services': [
      {
        key: 'balloon-type',
        label: 'Balloon Type',
        type: 'checkbox',
        options: [{ label: 'Latex', value: 'latex' }, { label: 'Mylar / foil', value: 'mylar-foil' }, { label: 'Bubble balloons (clear with confetti)', value: 'bubble-balloons-clear-with-confetti' }, { label: 'Jumbo latex (36")', value: 'jumbo-latex-36' }, { label: 'Mini latex (5")', value: 'mini-latex-5' }],
      },
      {
        key: 'service-type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'Balloon arches', value: 'balloon-arches' }, { label: 'Balloon columns', value: 'balloon-columns' }, { label: 'Balloon bouquets (table centerpieces)', value: 'balloon-bouquets-table-centerpieces' }, { label: 'Balloon garlands', value: 'balloon-garlands' }, { label: 'Balloon backdrops', value: 'balloon-backdrops' }, { label: 'Balloon drop (net with balloons)', value: 'balloon-drop-net-with-balloons' }, { label: 'Balloon release (environmental policy)', value: 'balloon-release-environmental-policy' }, { label: 'Inflatable sculptures', value: 'inflatable-sculptures' }],
      },
      {
        key: 'color-customization',
        label: 'Color / Customization',
        type: 'checkbox',
        options: [{ label: 'Solid colors', value: 'solid-colors' }, { label: 'Metallic / pearl', value: 'metallic-pearl' }, { label: 'Printed logos (custom)', value: 'printed-logos-custom' }, { label: 'Number balloons (age)', value: 'number-balloons-age' }, { label: 'Letter balloons (name)', value: 'letter-balloons-name' }],
      },
      {
        key: 'helium-vs-air',
        label: 'Helium vs Air',
        type: 'checkbox',
        options: [{ label: 'Helium (floats)', value: 'helium-floats' }, { label: 'Air (does not float, for arches/garlands)', value: 'air-does-not-float-for-arches-garlands' }],
      },
      {
        key: 'setup-included',
        label: 'Setup Included',
        type: 'checkbox',
        options: [{ label: 'Yes (delivery & install)', value: 'yes-delivery-install' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No (self-pickup)', value: 'no-self-pickup' }],
      },
      {
        key: 'delivery-area',
        label: 'Delivery Area',
        type: 'checkbox',
        options: [{ label: 'Local delivery (fee)', value: 'local-delivery-fee' }, { label: 'Will call (pickup)', value: 'will-call-pickup' }],
      },
      {
        key: 'lead-time',
        label: 'Lead Time',
        type: 'checkbox',
        options: [{ label: '24 hours (basic)', value: '24-hours-basic' }, { label: '1 week (custom)', value: '1-week-custom' }, { label: '2+ weeks (large installs)', value: '2-weeks-large-installs' }],
      },
      {
        key: 'balloon-life',
        label: 'Balloon Life',
        type: 'checkbox',
        options: [{ label: 'Helium latex: 8-12 hours', value: 'helium-latex-8-12-hours' }, { label: 'Helium mylar: 3-7 days', value: 'helium-mylar-3-7-days' }, { label: 'Air-filled: indefinite', value: 'air-filled-indefinite' }],
      },
      {
        key: 'outdoor-considerations',
        label: 'Outdoor Considerations',
        type: 'checkbox',
        options: [{ label: 'Heat (pop)', value: 'heat-pop' }, { label: 'Cold (shrinks)', value: 'cold-shrinks' }, { label: 'Wind (movement)', value: 'wind-movement' }, { label: 'Rain (mylar ok, latex not)', value: 'rain-mylar-ok-latex-not' }],
      },
      {
        key: 'disposal-deflation',
        label: 'Disposal / Deflation',
        type: 'checkbox',
        options: [{ label: 'Client disposes', value: 'client-disposes' }, { label: 'Staff returns (fee)', value: 'staff-returns-fee' }, { label: 'Biodegradable latex option', value: 'biodegradable-latex-option' }],
      },
      {
        key: 'eco-friendly-options',
        label: 'Eco-Friendly Options',
        type: 'checkbox',
        options: [{ label: 'Biodegradable latex', value: 'biodegradable-latex' }, { label: 'No balloon releases', value: 'no-balloon-releases' }, { label: 'Weighted (not released)', value: 'weighted-not-released' }],
      },
      {
        key: 'minimum-order',
        label: 'Minimum Order',
        type: 'checkbox',
        options: [{ label: 'No minimum', value: 'no-minimum' }, { label: '$25', value: '25' }, { label: '$50', value: '50' }, { label: '$100', value: '100' }],
      }
    ],
    'game-truck-rental': [
      {
        key: 'truck-type',
        label: 'Truck Type',
        type: 'checkbox',
        options: [{ label: 'Video game truck (indoor theater)', value: 'video-game-truck-indoor-theater' }, { label: 'Trailer (parked)', value: 'trailer-parked' }, { label: 'Mobile gaming bus', value: 'mobile-gaming-bus' }],
      },
      {
        key: 'capacity',
        label: 'Capacity',
        type: 'checkbox',
        options: [{ label: 'Under 10 players', value: 'under-10-players' }, { label: '10-16 players', value: '10-16-players' }, { label: '16-24 players', value: '16-24-players' }, { label: '24-32 players', value: '24-32-players' }],
      },
      {
        key: 'gaming-systems',
        label: 'Gaming Systems',
        type: 'checkbox',
        options: [{ label: 'Xbox Series X/S', value: 'xbox-series-x-s' }, { label: 'PlayStation 5', value: 'playstation-5' }, { label: 'Nintendo Switch', value: 'nintendo-switch' }, { label: 'PC gaming (rare)', value: 'pc-gaming-rare' }, { label: 'Retro (NES, SNES, N64)', value: 'retro-nes-snes-n64' }],
      },
      {
        key: 'number-of-screens',
        label: 'Number of Screens',
        type: 'checkbox',
        options: [{ label: '1 large screen (projector)', value: '1-large-screen-projector' }, { label: '2-4 screens', value: '2-4-screens' }, { label: '4-6 screens', value: '4-6-screens' }, { label: '6+ (personal stations)', value: '6-personal-stations' }],
      },
      {
        key: 'games-included',
        label: 'Games Included',
        type: 'checkbox',
        options: [{ label: 'Fortnite', value: 'fortnite' }, { label: 'Call of Duty', value: 'call-of-duty' }, { label: 'Minecraft', value: 'minecraft' }, { label: 'Madden NFL', value: 'madden-nfl' }, { label: 'FIFA', value: 'fifa' }, { label: 'NBA 2K', value: 'nba-2k' }, { label: 'Rocket League', value: 'rocket-league' }, { label: 'Super Smash Bros', value: 'super-smash-bros' }, { label: 'Mario Kart', value: 'mario-kart' }, { label: 'Among Us', value: 'among-us' }, { label: 'List available online', value: 'list-available-online' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: '2 hours (minimum)', value: '2-hours-minimum' }, { label: '3 hours', value: '3-hours' }, { label: '4 hours', value: '4-hours' }, { label: '5+ hours', value: '5-hours' }],
      },
      {
        key: 'setup-time',
        label: 'Setup Time',
        type: 'checkbox',
        options: [{ label: '30 minutes (included)', value: '30-minutes-included' }, { label: '1 hour (large setup)', value: '1-hour-large-setup' }, { label: 'Overnight available (extra)', value: 'overnight-available-extra' }],
      },
      {
        key: 'party-host-included',
        label: 'Party Host Included',
        type: 'checkbox',
        options: [{ label: 'Yes (supervises, runs tournaments)', value: 'yes-supervises-runs-tournaments' }, { label: 'No (parents supervise)', value: 'no-parents-supervise' }],
      },
      {
        key: 'age-appropriateness',
        label: 'Age Appropriateness',
        type: 'checkbox',
        options: [{ label: 'All ages (parental filters on)', value: 'all-ages-parental-filters-on' }, { label: 'Teen (13+)', value: 'teen-13' }, { label: 'Mature (17+ upon request)', value: 'mature-17-upon-request' }],
      },
      {
        key: 'outdoor-requirements',
        label: 'Outdoor Requirements',
        type: 'checkbox',
        options: [{ label: 'Flat parking (driveway, street)', value: 'flat-parking-driveway-street' }, { label: '40 ft clearance (length)', value: '40-ft-clearance-length' }, { label: '12 ft clearance (height)', value: '12-ft-clearance-height' }, { label: 'Level ground (truck leveling jacks)', value: 'level-ground-truck-leveling-jacks' }],
      },
      {
        key: 'power-source',
        label: 'Power Source',
        type: 'checkbox',
        options: [{ label: 'Onboard generator (included)', value: 'onboard-generator-included' }, { label: 'Requires 120v outlet (rare)', value: 'requires-120v-outlet-rare' }],
      },
      {
        key: 'weather-policy',
        label: 'Weather Policy',
        type: 'checkbox',
        options: [{ label: 'Rain/heat (AC works fine)', value: 'rain-heat-ac-works-fine' }, { label: 'Lightning (gameplay continues)', value: 'lightning-gameplay-continues' }, { label: 'Extreme heat (generator may struggle)', value: 'extreme-heat-generator-may-struggle' }],
      },
      {
        key: 'food-drink-inside-truck',
        label: 'Food / Drink Inside Truck',
        type: 'checkbox',
        options: [{ label: 'No (spills risk)', value: 'no-spills-risk' }, { label: 'Yes (covered drinks only)', value: 'yes-covered-drinks-only' }, { label: 'Yes (with cleaning fee)', value: 'yes-with-cleaning-fee' }],
      },
      {
        key: 'waiver-required',
        label: 'Waiver Required',
        type: 'checkbox',
        options: [{ label: 'Yes (parent signs for minors)', value: 'yes-parent-signs-for-minors' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'travel-fee',
        label: 'Travel Fee',
        type: 'checkbox',
        options: [{ label: 'Within 10 miles (free)', value: 'within-10-miles-free' }, { label: '10-20 miles ($___)', value: '10-20-miles' }, { label: '20+ miles ($___ per mile)', value: '20-miles-per-mile' }],
      }
    ],
    'golf-cart-rental': [
      {
        key: 'cart-type',
        label: 'Cart Type',
        type: 'checkbox',
        options: [{ label: '2-seater (golf only)', value: '2-seater-golf-only' }, { label: '4-seater (standard)', value: '4-seater-standard' }, { label: '6-seater (stretch)', value: '6-seater-stretch' }, { label: '8-seater (limo cart)', value: '8-seater-limo-cart' }, { label: 'Utility cart (with bed)', value: 'utility-cart-with-bed' }],
      },
      {
        key: 'use-case',
        label: 'Use Case',
        type: 'checkbox',
        options: [{ label: 'Golf course', value: 'golf-course' }, { label: 'Resort / hotel', value: 'resort-hotel' }, { label: 'Event transportation', value: 'event-transportation' }, { label: 'Festival grounds', value: 'festival-grounds' }, { label: 'Wedding (bridal party)', value: 'wedding-bridal-party' }, { label: 'Tailgating', value: 'tailgating' }, { label: 'Neighborhood / RV park', value: 'neighborhood-rv-park' }],
      },
      {
        key: 'battery-type',
        label: 'Battery Type',
        type: 'checkbox',
        options: [{ label: 'Electric (quiet, slower)', value: 'electric-quiet-slower' }, { label: 'Gas (louder, faster)', value: 'gas-louder-faster' }, { label: 'Lithium (longer life)', value: 'lithium-longer-life' }],
      },
      {
        key: 'speed-limit',
        label: 'Speed Limit',
        type: 'checkbox',
        options: [{ label: '12-15 mph (golf course)', value: '12-15-mph-golf-course' }, { label: '15-20 mph (private)', value: '15-20-mph-private' }, { label: '20-25 mph (street legal)', value: '20-25-mph-street-legal' }],
      },
      {
        key: 'street-legal',
        label: 'Street Legal',
        type: 'checkbox',
        options: [{ label: 'Yes (lights, signals, mirrors)', value: 'yes-lights-signals-mirrors' }, { label: 'No (off-road only)', value: 'no-off-road-only' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: 'Hourly', value: 'hourly' }, { label: '4 hours', value: '4-hours' }, { label: 'Full day', value: 'full-day' }, { label: 'Weekend', value: 'weekend' }, { label: 'Weekly', value: 'weekly' }],
      },
      {
        key: 'delivery',
        label: 'Delivery',
        type: 'checkbox',
        options: [{ label: 'Pickup only', value: 'pickup-only' }, { label: 'Delivery (fee)', value: 'delivery-fee' }, { label: 'Delivery and pickup (fee)', value: 'delivery-and-pickup-fee' }],
      },
      {
        key: 'charging-fuel',
        label: 'Charging / Fuel',
        type: 'checkbox',
        options: [{ label: 'Cart delivered charged/full', value: 'cart-delivered-charged-full' }, { label: 'Charger included (if outlet available)', value: 'charger-included-if-outlet-available' }, { label: 'Refuel required (gas cart, client pays)', value: 'refuel-required-gas-cart-client-pays' }],
      },
      {
        key: 'age-to-drive',
        label: 'Age to Drive',
        type: 'checkbox',
        options: [{ label: '16+ (no license needed off-road)', value: '16-no-license-needed-off-road' }, { label: '18+ with valid license (street legal)', value: '18-with-valid-license-street-legal' }],
      },
      {
        key: 'seatbelts',
        label: 'Seatbelts',
        type: 'checkbox',
        options: [{ label: 'Yes (street legal)', value: 'yes-street-legal' }, { label: 'No (off-road)', value: 'no-off-road' }],
      },
      {
        key: 'canopy-roof',
        label: 'Canopy / Roof',
        type: 'checkbox',
        options: [{ label: 'Standard (included)', value: 'standard-included' }, { label: 'No roof (some course carts)', value: 'no-roof-some-course-carts' }, { label: 'Enclosed (cold weather)', value: 'enclosed-cold-weather' }],
      },
      {
        key: 'windshield',
        label: 'Windshield',
        type: 'checkbox',
        options: [{ label: 'Yes (flip-up)', value: 'yes-flip-up' }, { label: 'Yes (fixed)', value: 'yes-fixed' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'cooler-included',
        label: 'Cooler Included',
        type: 'checkbox',
        options: [{ label: 'Yes (built-in)', value: 'yes-built-in' }, { label: 'Yes (portable cooler)', value: 'yes-portable-cooler' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'light-package-for-night',
        label: 'Light Package for Night',
        type: 'checkbox',
        options: [{ label: 'Headlights / taillights', value: 'headlights-taillights' }, { label: 'No lights (daylight only)', value: 'no-lights-daylight-only' }],
      },
      {
        key: 'speed-governor',
        label: 'Speed Governor',
        type: 'checkbox',
        options: [{ label: 'Fixed (cannot modify)', value: 'fixed-cannot-modify' }, { label: 'Removable (extra fee for full speed)', value: 'removable-extra-fee-for-full-speed' }],
      },
      {
        key: 'insurance',
        label: 'Insurance',
        type: 'checkbox',
        options: [{ label: 'Liability included', value: 'liability-included' }, { label: 'Damage waiver available ($___ per day)', value: 'damage-waiver-available-per-day' }],
      }
    ],
    'party-bike-rental': [
      {
        key: 'bike-type',
        label: 'Bike Type',
        type: 'checkbox',
        options: [{ label: '10-seater', value: '10-seater' }, { label: '12-seater', value: '12-seater' }, { label: '14-seater', value: '14-seater' }, { label: '16-seater', value: '16-seater' }],
      },
      {
        key: 'seat-configuration',
        label: 'Seat Configuration',
        type: 'checkbox',
        options: [{ label: 'Pedal stations (each person pedals)', value: 'pedal-stations-each-person-pedals' }, { label: 'Captain seats (non-pedaling)', value: 'captain-seats-non-pedaling' }, { label: 'Mixed (some pedal, some sit)', value: 'mixed-some-pedal-some-sit' }],
      },
      {
        key: 'electric-assist',
        label: 'Electric Assist',
        type: 'checkbox',
        options: [{ label: 'Yes (motor helps on hills)', value: 'yes-motor-helps-on-hills' }, { label: 'No (all human power)', value: 'no-all-human-power' }],
      },
      {
        key: 'design',
        label: 'Design',
        type: 'checkbox',
        options: [{ label: 'Pub style (center bar)', value: 'pub-style-center-bar' }, { label: 'Open air', value: 'open-air' }, { label: 'Canopy (sun/rain protection)', value: 'canopy-sun-rain-protection' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: '1 hour (minimum)', value: '1-hour-minimum' }, { label: '1.5 hours', value: '1-5-hours' }, { label: '2 hours', value: '2-hours' }, { label: '3+ hours', value: '3-hours' }],
      },
      {
        key: 'group-size',
        label: 'Group Size',
        type: 'checkbox',
        options: [{ label: 'Private tour (your group only)', value: 'private-tour-your-group-only' }, { label: 'Shared (you may be paired)', value: 'shared-you-may-be-paired' }],
      },
      {
        key: 'route-area',
        label: 'Route / Area',
        type: 'checkbox',
        options: [{ label: 'Downtown loop', value: 'downtown-loop' }, { label: 'Brewery / bar crawl route', value: 'brewery-bar-crawl-route' }, { label: 'Park / scenic', value: 'park-scenic' }, { label: 'Custom route (approved in advance)', value: 'custom-route-approved-in-advance' }],
      },
      {
        key: 'stops-allowed',
        label: 'Stops Allowed',
        type: 'checkbox',
        options: [{ label: 'Pre-planned stops only', value: 'pre-planned-stops-only' }, { label: 'Flexible stops (call ahead)', value: 'flexible-stops-call-ahead' }, { label: 'No stops (continuous loop)', value: 'no-stops-continuous-loop' }],
      },
      {
        key: 'alcohol-policy',
        label: 'Alcohol Policy',
        type: 'checkbox',
        options: [{ label: 'BYOB allowed (cans only, no glass)', value: 'byob-allowed-cans-only-no-glass' }, { label: 'Alcohol not allowed', value: 'alcohol-not-allowed' }, { label: 'Bar provided (cooler on board)', value: 'bar-provided-cooler-on-board' }],
      },
      {
        key: 'driver-guide-included',
        label: 'Driver / Guide Included',
        type: 'checkbox',
        options: [{ label: 'Yes (steers the bike)', value: 'yes-steers-the-bike' }, { label: 'Yes (guide provides narration)', value: 'yes-guide-provides-narration' }, { label: 'No (you drive, not typical)', value: 'no-you-drive-not-typical' }],
      },
      {
        key: 'music',
        label: 'Music',
        type: 'checkbox',
        options: [{ label: 'Bluetooth speaker (provided)', value: 'bluetooth-speaker-provided' }, { label: 'No speaker (quiet)', value: 'no-speaker-quiet' }],
      },
      {
        key: 'age-requirement',
        label: 'Age Requirement',
        type: 'checkbox',
        options: [{ label: '21+ (alcohol allowed)', value: '21-alcohol-allowed' }, { label: '18+ (no alcohol)', value: '18-no-alcohol' }, { label: 'Under 18 with adult (non-pedaling)', value: 'under-18-with-adult-non-pedaling' }],
      },
      {
        key: 'pedaling-requirement',
        label: 'Pedaling Requirement',
        type: 'checkbox',
        options: [{ label: 'Everyone must pedal', value: 'everyone-must-pedal' }, { label: 'Non-pedalers pay extra', value: 'non-pedalers-pay-extra' }, { label: 'Electric assist (minimal pedaling)', value: 'electric-assist-minimal-pedaling' }],
      },
      {
        key: 'physical-requirements',
        label: 'Physical Requirements',
        type: 'checkbox',
        options: [{ label: 'Must be able to pedal', value: 'must-be-able-to-pedal' }, { label: 'No major mobility issues', value: 'no-major-mobility-issues' }, { label: 'Bike stops if people stop pedaling', value: 'bike-stops-if-people-stop-pedaling' }],
      },
      {
        key: 'weather-policy',
        label: 'Weather Policy',
        type: 'checkbox',
        options: [{ label: 'Light rain (ponchos provided)', value: 'light-rain-ponchos-provided' }, { label: 'Heavy rain (reschedule)', value: 'heavy-rain-reschedule' }, { label: 'Extreme heat (bottled water provided)', value: 'extreme-heat-bottled-water-provided' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: 'Free up to 48 hours', value: 'free-up-to-48-hours' }, { label: '50% within 48 hours', value: '50-within-48-hours' }, { label: 'No refund within 24 hours', value: 'no-refund-within-24-hours' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: 'Required ($___)', value: 'required' }, { label: 'No deposit (credit card hold)', value: 'no-deposit-credit-card-hold' }],
      }
    ],
    'party-bus-rental': [
      {
        key: 'bus-type',
        label: 'Bus Type',
        type: 'checkbox',
        options: [{ label: 'Standard party bus (20-30 pax)', value: 'standard-party-bus-20-30-pax' }, { label: 'Large party bus (30-40 pax)', value: 'large-party-bus-30-40-pax' }, { label: 'Mega party bus (40-50 pax)', value: 'mega-party-bus-40-50-pax' }, { label: 'Luxury sprinter (10-14 pax)', value: 'luxury-sprinter-10-14-pax' }],
      },
      {
        key: 'amenities',
        label: 'Amenities',
        type: 'checkbox',
        options: [{ label: 'Leather seating', value: 'leather-seating' }, { label: 'Dance floor (center aisle)', value: 'dance-floor-center-aisle' }, { label: 'LED lighting (color changing)', value: 'led-lighting-color-changing' }, { label: 'Sound system (club quality)', value: 'sound-system-club-quality' }, { label: 'TV screens (multiple)', value: 'tv-screens-multiple' }, { label: 'DVD / streaming capability', value: 'dvd-streaming-capability' }, { label: 'Karaoke machine', value: 'karaoke-machine' }, { label: 'Stripper pole(s)', value: 'stripper-pole-s' }, { label: 'Restroom (on board)', value: 'restroom-on-board' }, { label: 'Mini fridge', value: 'mini-fridge' }, { label: 'Ice cooler', value: 'ice-cooler' }, { label: 'Bottled water included', value: 'bottled-water-included' }, { label: 'Champagne glasses (plastic)', value: 'champagne-glasses-plastic' }, { label: 'Privacy windows (tinted)', value: 'privacy-windows-tinted' }, { label: 'Sunroof (open air)', value: 'sunroof-open-air' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: '2 hours (minimum)', value: '2-hours-minimum' }, { label: '3 hours (standard)', value: '3-hours-standard' }, { label: '4+ hours (event package)', value: '4-hours-event-package' }, { label: 'Overnight (rare)', value: 'overnight-rare' }],
      },
      {
        key: 'hourly-rate',
        label: 'Hourly Rate',
        type: 'checkbox',
        options: [{ label: '$100-150/hour (sprinter)', value: '100-150-hour-sprinter' }, { label: '$150-250/hour (standard)', value: '150-250-hour-standard' }, { label: '$250-400/hour (mega)', value: '250-400-hour-mega' }],
      },
      {
        key: 'gratuity',
        label: 'Gratuity',
        type: 'checkbox',
        options: [{ label: 'Not included (15-20% suggested)', value: 'not-included-15-20-suggested' }, { label: 'Included (some packages)', value: 'included-some-packages' }],
      },
      {
        key: 'fuel-surcharge',
        label: 'Fuel Surcharge',
        type: 'checkbox',
        options: [{ label: 'Included up to ___ miles', value: 'included-up-to-miles' }, { label: 'Extra beyond', value: 'extra-beyond' }],
      },
      {
        key: 'cleaning-fee',
        label: 'Cleaning Fee',
        type: 'checkbox',
        options: [{ label: 'Included (standard)', value: 'included-standard' }, { label: 'Extra ($___ for spills/vomit)', value: 'extra-for-spills-vomit' }],
      },
      {
        key: 'alcohol-policy',
        label: 'Alcohol Policy',
        type: 'checkbox',
        options: [{ label: 'BYOB (cans/plastic only)', value: 'byob-cans-plastic-only' }, { label: 'No glass bottles', value: 'no-glass-bottles' }, { label: 'Alcohol provided (extra)', value: 'alcohol-provided-extra' }],
      },
      {
        key: 'smoking-policy',
        label: 'Smoking Policy',
        type: 'checkbox',
        options: [{ label: 'No smoking (fire risk)', value: 'no-smoking-fire-risk' }, { label: 'Vaping allowed (some)', value: 'vaping-allowed-some' }],
      },
      {
        key: 'stops-itinerary',
        label: 'Stops / Itinerary',
        type: 'checkbox',
        options: [{ label: 'Pickup and drop-off only', value: 'pickup-and-drop-off-only' }, { label: 'Multiple stops (pre-planned)', value: 'multiple-stops-pre-planned' }, { label: 'Flexible (with approval)', value: 'flexible-with-approval' }],
      },
      {
        key: 'drop-off-locations',
        label: 'Drop-off Locations',
        type: 'checkbox',
        options: [{ label: 'Bar / club', value: 'bar-club' }, { label: 'Hotel', value: 'hotel' }, { label: 'Residence', value: 'residence' }, { label: 'Airport', value: 'airport' }],
      },
      {
        key: 'parking-at-stops',
        label: 'Parking at Stops',
        type: 'checkbox',
        options: [{ label: 'Client arranges', value: 'client-arranges' }, { label: 'Bus drops and circles', value: 'bus-drops-and-circles' }, { label: 'Bus parks nearby (fee may apply)', value: 'bus-parks-nearby-fee-may-apply' }],
      },
      {
        key: 'overtime',
        label: 'Overtime',
        type: 'checkbox',
        options: [{ label: 'Prorated hourly (1.5x after midnight)', value: 'prorated-hourly-1-5x-after-midnight' }, { label: 'Not allowed (bus booked back to back)', value: 'not-allowed-bus-booked-back-to-back' }],
      },
      {
        key: 'age-restrictions',
        label: 'Age Restrictions',
        type: 'checkbox',
        options: [{ label: '18+ (no alcohol)', value: '18-no-alcohol' }, { label: '21+ (alcohol allowed)', value: '21-alcohol-allowed' }, { label: 'Under 18 with parent', value: 'under-18-with-parent' }],
      },
      {
        key: 'security',
        label: 'Security',
        type: 'checkbox',
        options: [{ label: 'On-board security for large groups', value: 'on-board-security-for-large-groups' }, { label: 'No security (chaperone recommended)', value: 'no-security-chaperone-recommended' }],
      }
    ],
    'beach-equipment-rentals': [
      {
        key: 'rental-items',
        label: 'Rental Items',
        type: 'checkbox',
        options: [{ label: 'Beach chairs', value: 'beach-chairs' }, { label: 'Beach umbrellas', value: 'beach-umbrellas' }, { label: 'Sun canopy / tent', value: 'sun-canopy-tent' }, { label: 'Beach blanket / mat', value: 'beach-blanket-mat' }, { label: 'Cooler (wheeled)', value: 'cooler-wheeled' }, { label: 'Beach cart (to carry gear)', value: 'beach-cart-to-carry-gear' }, { label: 'Boogie boards', value: 'boogie-boards' }, { label: 'Surfboards', value: 'surfboards' }, { label: 'Paddleboards', value: 'paddleboards' }, { label: 'Kayaks', value: 'kayaks' }, { label: 'Sand toys (buckets, shovels)', value: 'sand-toys-buckets-shovels' }, { label: 'Floating mats', value: 'floating-mats' }, { label: 'Life jackets (kids & adults)', value: 'life-jackets-kids-adults' }, { label: 'Snorkel sets', value: 'snorkel-sets' }, { label: 'Beach wheelchair (mobility)', value: 'beach-wheelchair-mobility' }, { label: 'Wagon (for kids/gear)', value: 'wagon-for-kids-gear' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: 'Hourly', value: 'hourly' }, { label: 'Half day (4 hours)', value: 'half-day-4-hours' }, { label: 'Full day (sunrise to sunset)', value: 'full-day-sunrise-to-sunset' }, { label: 'Weekly', value: 'weekly' }],
      },
      {
        key: 'delivery-to-beach',
        label: 'Delivery to Beach',
        type: 'checkbox',
        options: [{ label: 'Yes (set up for you)', value: 'yes-set-up-for-you' }, { label: 'Yes (drop off, you carry)', value: 'yes-drop-off-you-carry' }, { label: 'No (pickup from shop)', value: 'no-pickup-from-shop' }],
      },
      {
        key: 'setup-service',
        label: 'Setup Service',
        type: 'checkbox',
        options: [{ label: 'Included (delivery with setup)', value: 'included-delivery-with-setup' }, { label: 'Extra fee ($___)', value: 'extra-fee' }, { label: 'Self-setup', value: 'self-setup' }],
      },
      {
        key: 'location-on-beach',
        label: 'Location on Beach',
        type: 'checkbox',
        options: [{ label: 'Marked umbrella spot', value: 'marked-umbrella-spot' }, { label: 'First come, first served', value: 'first-come-first-served' }, { label: 'Reserved area (extra)', value: 'reserved-area-extra' }],
      },
      {
        key: 'identification-deposit',
        label: 'Identification / Deposit',
        type: 'checkbox',
        options: [{ label: 'Driver\'s license on file', value: 'driver-s-license-on-file' }, { label: 'Credit card hold', value: 'credit-card-hold' }, { label: 'Cash deposit', value: 'cash-deposit' }],
      },
      {
        key: 'lost-damaged-items',
        label: 'Lost / Damaged Items',
        type: 'checkbox',
        options: [{ label: 'Full replacement cost', value: 'full-replacement-cost' }, { label: 'Damage waiver available', value: 'damage-waiver-available' }],
      },
      {
        key: 'seasonal-availability',
        label: 'Seasonal Availability',
        type: 'checkbox',
        options: [{ label: 'Summer only', value: 'summer-only' }, { label: 'Spring through fall', value: 'spring-through-fall' }, { label: 'Year-round (warm climate)', value: 'year-round-warm-climate' }],
      },
      {
        key: 'beach-access-points',
        label: 'Beach Access Points',
        type: 'checkbox',
        options: [{ label: 'Public beach (no permit)', value: 'public-beach-no-permit' }, { label: 'Private beach (hotel guests only)', value: 'private-beach-hotel-guests-only' }, { label: 'Permit required (some towns)', value: 'permit-required-some-towns' }],
      },
      {
        key: 'included-items',
        label: 'Included Items',
        type: 'checkbox',
        options: [{ label: 'Chairs + umbrella combo', value: 'chairs-umbrella-combo' }, { label: 'Chair only', value: 'chair-only' }, { label: 'Umbrella only', value: 'umbrella-only' }],
      },
      {
        key: 'number-of-chairs-in-package',
        label: 'Number of Chairs in Package',
        type: 'checkbox',
        options: [{ label: '2 chairs + umbrella', value: '2-chairs-umbrella' }, { label: '4 chairs + umbrella', value: '4-chairs-umbrella' }, { label: 'Custom quantity', value: 'custom-quantity' }],
      },
      {
        key: 'umbrella-size',
        label: 'Umbrella Size',
        type: 'checkbox',
        options: [{ label: '6 ft (2 people)', value: '6-ft-2-people' }, { label: '7 ft (3-4 people)', value: '7-ft-3-4-people' }, { label: '8 ft (4-5 people)', value: '8-ft-4-5-people' }],
      },
      {
        key: 'chair-type',
        label: 'Chair Type',
        type: 'checkbox',
        options: [{ label: 'Low sling (standard)', value: 'low-sling-standard' }, { label: 'High back (more support)', value: 'high-back-more-support' }, { label: 'Reclining (adjustable)', value: 'reclining-adjustable' }, { label: 'Zero gravity (premium)', value: 'zero-gravity-premium' }],
      },
      {
        key: 'anchor-system',
        label: 'Anchor System',
        type: 'checkbox',
        options: [{ label: 'Sand screw (included)', value: 'sand-screw-included' }, { label: 'Weight bags (included)', value: 'weight-bags-included' }, { label: 'No anchor (windy days problematic)', value: 'no-anchor-windy-days-problematic' }],
      }
    ],
    'bike-rentals': [
      {
        key: 'bike-type',
        label: 'Bike Type',
        type: 'checkbox',
        options: [{ label: 'City / cruiser (comfortable)', value: 'city-cruiser-comfortable' }, { label: 'Road bike (drop bars, fast)', value: 'road-bike-drop-bars-fast' }, { label: 'Mountain bike (off-road)', value: 'mountain-bike-off-road' }, { label: 'Hybrid (mix of road/mtn)', value: 'hybrid-mix-of-road-mtn' }, { label: 'Tandem (2-person)', value: 'tandem-2-person' }, { label: 'Electric bike (e-bike)', value: 'electric-bike-e-bike' }, { label: 'Kids bike (various sizes)', value: 'kids-bike-various-sizes' }, { label: 'Trailer bike (attached to adult)', value: 'trailer-bike-attached-to-adult' }, { label: 'Tag-along (half bike)', value: 'tag-along-half-bike' }, { label: 'Cargo bike (haul stuff)', value: 'cargo-bike-haul-stuff' }, { label: 'Recumbent (laid back)', value: 'recumbent-laid-back' }, { label: 'Tricycle (adult trike)', value: 'tricycle-adult-trike' }],
      },
      {
        key: 'frame-size',
        label: 'Frame Size',
        type: 'checkbox',
        options: [{ label: 'XS (under 5\'0")', value: 'xs-under-5-0' }, { label: 'S (5\'0" - 5\'4")', value: 's-5-0-5-4' }, { label: 'M (5\'4" - 5\'8")', value: 'm-5-4-5-8' }, { label: 'L (5\'8" - 6\'0")', value: 'l-5-8-6-0' }, { label: 'XL (6\'0" - 6\'4")', value: 'xl-6-0-6-4' }, { label: 'XXL (6\'4"+)', value: 'xxl-6-4' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: '1 hour', value: '1-hour' }, { label: '2 hours', value: '2-hours' }, { label: '4 hours (half day)', value: '4-hours-half-day' }, { label: '8 hours (full day)', value: '8-hours-full-day' }, { label: '24 hours (overnight)', value: '24-hours-overnight' }, { label: 'Weekly', value: 'weekly' }],
      },
      {
        key: 'helmet-included',
        label: 'Helmet Included',
        type: 'checkbox',
        options: [{ label: 'Yes (free)', value: 'yes-free' }, { label: 'Yes (extra $)', value: 'yes-extra' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'lock-included',
        label: 'Lock Included',
        type: 'checkbox',
        options: [{ label: 'Yes (cable or U-lock)', value: 'yes-cable-or-u-lock' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'bike-lights',
        label: 'Bike Lights',
        type: 'checkbox',
        options: [{ label: 'Included (for night riding)', value: 'included-for-night-riding' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'basket-rack',
        label: 'Basket / Rack',
        type: 'checkbox',
        options: [{ label: 'Front basket (included)', value: 'front-basket-included' }, { label: 'Rear rack (with bungee)', value: 'rear-rack-with-bungee' }, { label: 'Neither', value: 'neither' }],
      },
      {
        key: 'water-bottle-cage',
        label: 'Water Bottle Cage',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'repair-kit-pump',
        label: 'Repair Kit / Pump',
        type: 'checkbox',
        options: [{ label: 'Yes (basic)', value: 'yes-basic' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'flat-tire-policy',
        label: 'Flat Tire Policy',
        type: 'checkbox',
        options: [{ label: 'Client responsible', value: 'client-responsible' }, { label: 'Rental shop replaces (fee)', value: 'rental-shop-replaces-fee' }],
      },
      {
        key: 'pickup-drop-off',
        label: 'Pickup / Drop-off',
        type: 'checkbox',
        options: [{ label: 'Same location', value: 'same-location' }, { label: 'Different location (one-way rental)', value: 'different-location-one-way-rental' }, { label: 'Delivery available (fee)', value: 'delivery-available-fee' }],
      },
      {
        key: 'age-requirement',
        label: 'Age Requirement',
        type: 'checkbox',
        options: [{ label: 'Under 18 with parent', value: 'under-18-with-parent' }, { label: '18+ without parent', value: '18-without-parent' }, { label: 'Adult signature required', value: 'adult-signature-required' }],
      },
      {
        key: 'child-bike-seat',
        label: 'Child Bike Seat',
        type: 'checkbox',
        options: [{ label: 'Rear-mounted (infant/toddler)', value: 'rear-mounted-infant-toddler' }, { label: 'Front-mounted', value: 'front-mounted' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'trailer-rental-pull-behind-child',
        label: 'Trailer Rental (pull behind child)',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'credit-card-required',
        label: 'Credit Card Required',
        type: 'checkbox',
        options: [{ label: 'Yes (deposit hold)', value: 'yes-deposit-hold' }, { label: 'No (cash deposit)', value: 'no-cash-deposit' }],
      },
      {
        key: 'late-fee',
        label: 'Late Fee',
        type: 'checkbox',
        options: [{ label: '$___ per hour', value: 'per-hour' }, { label: '$___ per day after first', value: 'per-day-after-first' }],
      },
      {
        key: 'maps-routes-provided',
        label: 'Maps / Routes Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (paper map)', value: 'yes-paper-map' }, { label: 'Yes (digital GPX)', value: 'yes-digital-gpx' }, { label: 'No', value: 'no' }],
      }
    ],
    'scooter-rental': [
      {
        key: 'scooter-type',
        label: 'Scooter Type',
        type: 'checkbox',
        options: [{ label: 'Electric kick scooter (stand-up)', value: 'electric-kick-scooter-stand-up' }, { label: 'Gas moped (50cc)', value: 'gas-moped-50cc' }, { label: 'Gas scooter (125-150cc)', value: 'gas-scooter-125-150cc' }, { label: 'Electric scooter (Vespa style)', value: 'electric-scooter-vespa-style' }, { label: 'Mobility scooter (disabled)', value: 'mobility-scooter-disabled' }],
      },
      {
        key: 'speed',
        label: 'Speed',
        type: 'checkbox',
        options: [{ label: '15 mph (kick scooter)', value: '15-mph-kick-scooter' }, { label: '30 mph (50cc moped)', value: '30-mph-50cc-moped' }, { label: '50+ mph (125cc+)', value: '50-mph-125cc' }],
      },
      {
        key: 'license-required',
        label: 'License Required',
        type: 'checkbox',
        options: [{ label: 'No license (e-kick scooter, some cities)', value: 'no-license-e-kick-scooter-some-cities' }, { label: 'Driver\'s license (moped under 50cc)', value: 'driver-s-license-moped-under-50cc' }, { label: 'Motorcycle license (50cc+)', value: 'motorcycle-license-50cc' }],
      },
      {
        key: 'insurance',
        label: 'Insurance',
        type: 'checkbox',
        options: [{ label: 'Included in rental', value: 'included-in-rental' }, { label: 'Not included (renter responsible)', value: 'not-included-renter-responsible' }, { label: 'Damage waiver available', value: 'damage-waiver-available' }],
      },
      {
        key: 'helmet-included',
        label: 'Helmet Included',
        type: 'checkbox',
        options: [{ label: 'Yes (free)', value: 'yes-free' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No (legally required, bring own)', value: 'no-legally-required-bring-own' }],
      },
      {
        key: 'scooter-condition',
        label: 'Scooter Condition',
        type: 'checkbox',
        options: [{ label: 'New fleet', value: 'new-fleet' }, { label: 'Well maintained', value: 'well-maintained' }, { label: 'Older but safe', value: 'older-but-safe' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: '15 minutes (app-based)', value: '15-minutes-app-based' }, { label: '1 hour', value: '1-hour' }, { label: 'Half day', value: 'half-day' }, { label: 'Full day', value: 'full-day' }, { label: 'Weekly', value: 'weekly' }],
      },
      {
        key: 'pickup-drop-off',
        label: 'Pickup / Drop-off',
        type: 'checkbox',
        options: [{ label: 'Station-based (return to same spot)', value: 'station-based-return-to-same-spot' }, { label: 'App-based (park anywhere in zone)', value: 'app-based-park-anywhere-in-zone' }, { label: 'Delivery (to hotel)', value: 'delivery-to-hotel' }],
      },
      {
        key: 'range-e-scooter',
        label: 'Range (e-scooter)',
        type: 'checkbox',
        options: [{ label: '10-15 miles', value: '10-15-miles' }, { label: '15-25 miles', value: '15-25-miles' }, { label: '25-40 miles', value: '25-40-miles' }],
      },
      {
        key: 'gas-scooter-fuel',
        label: 'Gas Scooter Fuel',
        type: 'checkbox',
        options: [{ label: 'Full tank (return full)', value: 'full-tank-return-full' }, { label: 'Bring back empty (pay for fuel)', value: 'bring-back-empty-pay-for-fuel' }, { label: 'Fuel included (no charge)', value: 'fuel-included-no-charge' }],
      },
      {
        key: 'locking-security',
        label: 'Locking / Security',
        type: 'checkbox',
        options: [{ label: 'Lock provided', value: 'lock-provided' }, { label: 'App lock (e-scooter)', value: 'app-lock-e-scooter' }, { label: 'No lock (don\'t leave unattended)', value: 'no-lock-don-t-leave-unattended' }],
      },
      {
        key: 'phone-mount',
        label: 'Phone Mount',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'storage-under-seat',
        label: 'Storage (under seat)',
        type: 'checkbox',
        options: [{ label: 'Yes (helmet fits)', value: 'yes-helmet-fits' }, { label: 'No (carry with you)', value: 'no-carry-with-you' }],
      },
      {
        key: 'age-requirement',
        label: 'Age Requirement',
        type: 'checkbox',
        options: [{ label: '16+ (e-scooter)', value: '16-e-scooter' }, { label: '18+ (gas scooter)', value: '18-gas-scooter' }, { label: '21+ (125cc+)', value: '21-125cc' }],
      },
      {
        key: 'training-provided',
        label: 'Training Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (briefing)', value: 'yes-briefing' }, { label: 'Yes (short test ride)', value: 'yes-short-test-ride' }, { label: 'No (assume you know)', value: 'no-assume-you-know' }],
      },
      {
        key: 'safety-gear',
        label: 'Safety Gear',
        type: 'checkbox',
        options: [{ label: 'Helmet only', value: 'helmet-only' }, { label: 'Helmet + elbow/knee pads', value: 'helmet-elbow-knee-pads' }, { label: 'No gear provided', value: 'no-gear-provided' }],
      },
      {
        key: 'night-riding',
        label: 'Night Riding',
        type: 'checkbox',
        options: [{ label: 'Headlight & taillight (legal)', value: 'headlight-taillight-legal' }, { label: 'No lights (daylight only)', value: 'no-lights-daylight-only' }],
      },
      {
        key: 'weather-policy',
        label: 'Weather Policy',
        type: 'checkbox',
        options: [{ label: 'No rain (slippery)', value: 'no-rain-slippery' }, { label: 'Light rain ok', value: 'light-rain-ok' }, { label: 'All weather (with rain gear)', value: 'all-weather-with-rain-gear' }],
      }
    ],
    'sport-equipment-rentals': [
      {
        key: 'sport-types',
        label: 'Sport Types',
        type: 'checkbox',
        options: [{ label: 'Ski / snowboard', value: 'ski-snowboard' }, { label: 'Snowshoes', value: 'snowshoes' }, { label: 'Cross-country skis', value: 'cross-country-skis' }, { label: 'Ice skates', value: 'ice-skates' }, { label: 'Rollerblades / inline skates', value: 'rollerblades-inline-skates' }, { label: 'Skateboard / longboard', value: 'skateboard-longboard' }, { label: 'Surfboard', value: 'surfboard' }, { label: 'Paddleboard (SUP)', value: 'paddleboard-sup' }, { label: 'Kayak (single/double)', value: 'kayak-single-double' }, { label: 'Canoe', value: 'canoe' }, { label: 'Raft (whitewater)', value: 'raft-whitewater' }, { label: 'Scuba gear (full set)', value: 'scuba-gear-full-set' }, { label: 'Snorkel gear', value: 'snorkel-gear' }, { label: 'Fishing rod & reel', value: 'fishing-rod-reel' }, { label: 'Climbing gear (harness, rope, draws)', value: 'climbing-gear-harness-rope-draws' }, { label: 'Camping gear (tent, sleeping bag, stove)', value: 'camping-gear-tent-sleeping-bag-stove' }, { label: 'Hockey equipment', value: 'hockey-equipment' }, { label: 'Lacrosse gear', value: 'lacrosse-gear' }, { label: 'Baseball / softball gear (bat, glove)', value: 'baseball-softball-gear-bat-glove' }, { label: 'Golf clubs', value: 'golf-clubs' }, { label: 'Tennis racquet', value: 'tennis-racquet' }, { label: 'Pickleball paddles', value: 'pickleball-paddles' }],
      },
      {
        key: 'skill-level',
        label: 'Skill Level',
        type: 'checkbox',
        options: [{ label: 'Beginner', value: 'beginner' }, { label: 'Intermediate', value: 'intermediate' }, { label: 'Advanced / pro', value: 'advanced-pro' }],
      },
      {
        key: 'sizing-available',
        label: 'Sizing Available',
        type: 'checkbox',
        options: [{ label: 'Youth XS - Adult XXL', value: 'youth-xs-adult-xxl' }, { label: 'Specific size chart available', value: 'specific-size-chart-available' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: 'Hourly', value: 'hourly' }, { label: 'Half day', value: 'half-day' }, { label: 'Full day', value: 'full-day' }, { label: 'Weekend', value: 'weekend' }, { label: 'Weekly', value: 'weekly' }, { label: 'Season pass (ski/snowboard)', value: 'season-pass-ski-snowboard' }],
      },
      {
        key: 'damage-loss-policy',
        label: 'Damage / Loss Policy',
        type: 'checkbox',
        options: [{ label: 'Full replacement cost', value: 'full-replacement-cost' }, { label: 'Damage waiver (extra $ per day)', value: 'damage-waiver-extra-per-day' }, { label: 'Credit card hold', value: 'credit-card-hold' }],
      },
      {
        key: 'demo-try-before-you-buy',
        label: 'Demo / Try Before You Buy',
        type: 'checkbox',
        options: [{ label: 'Yes (apply rental to purchase)', value: 'yes-apply-rental-to-purchase' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'tuning-waxing-skis-snowboard',
        label: 'Tuning / Waxing (skis/snowboard)',
        type: 'checkbox',
        options: [{ label: 'Included', value: 'included' }, { label: 'Available (extra fee)', value: 'available-extra-fee' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'boot-fitting-ski-snowboard',
        label: 'Boot Fitting (ski/snowboard)',
        type: 'checkbox',
        options: [{ label: 'Professional fitting included', value: 'professional-fitting-included' }, { label: 'Self-serve', value: 'self-serve' }],
      },
      {
        key: 'floatation-device-kayak-sup',
        label: 'Floatation Device (kayak/SUP)',
        type: 'checkbox',
        options: [{ label: 'PFD included', value: 'pfd-included' }, { label: 'Available (extra)', value: 'available-extra' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'dry-bag-included-water-sports',
        label: 'Dry Bag Included (water sports)',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'instruction-available',
        label: 'Instruction Available',
        type: 'checkbox',
        options: [{ label: 'Yes (lesson package)', value: 'yes-lesson-package' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'group-discount',
        label: 'Group Discount',
        type: 'checkbox',
        options: [{ label: '4+ rentals (10% off)', value: '4-rentals-10-off' }, { label: '10+ rentals (20% off)', value: '10-rentals-20-off' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'delivery-to-trail-lake',
        label: 'Delivery to Trail / Lake',
        type: 'checkbox',
        options: [{ label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'Pickup only', value: 'pickup-only' }],
      }
    ],
    'furniture-rental': [
      {
        key: 'furniture-type',
        label: 'Furniture Type',
        type: 'checkbox',
        options: [{ label: 'Sofa / couch', value: 'sofa-couch' }, { label: 'Loveseat', value: 'loveseat' }, { label: 'Armchair', value: 'armchair' }, { label: 'Sectional', value: 'sectional' }, { label: 'Coffee table', value: 'coffee-table' }, { label: 'End table', value: 'end-table' }, { label: 'Dining table', value: 'dining-table' }, { label: 'Dining chairs', value: 'dining-chairs' }, { label: 'Bed frame', value: 'bed-frame' }, { label: 'Mattress', value: 'mattress' }, { label: 'Dresser', value: 'dresser' }, { label: 'Nightstand', value: 'nightstand' }, { label: 'Desk', value: 'desk' }, { label: 'Office chair', value: 'office-chair' }, { label: 'Bookshelf', value: 'bookshelf' }, { label: 'TV stand', value: 'tv-stand' }, { label: 'Patio furniture set', value: 'patio-furniture-set' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: 'Monthly (minimum 3 months)', value: 'monthly-minimum-3-months' }, { label: 'Weekly (event rental)', value: 'weekly-event-rental' }, { label: 'Daily (photo shoots, staging)', value: 'daily-photo-shoots-staging' }],
      },
      {
        key: 'room-event-staging',
        label: 'Room / Event Staging',
        type: 'checkbox',
        options: [{ label: 'Home staging (real estate)', value: 'home-staging-real-estate' }, { label: 'Event lounge (seating area)', value: 'event-lounge-seating-area' }, { label: 'Photo / film production', value: 'photo-film-production' }, { label: 'Temporary housing (insurance claim)', value: 'temporary-housing-insurance-claim' }],
      },
      {
        key: 'delivery-setup',
        label: 'Delivery & Setup',
        type: 'checkbox',
        options: [{ label: 'Included (within zone)', value: 'included-within-zone' }, { label: 'Extra (outside zone)', value: 'extra-outside-zone' }, { label: 'Self-pickup not typical (furniture is large)', value: 'self-pickup-not-typical-furniture-is-large' }],
      },
      {
        key: 'furniture-style',
        label: 'Furniture Style',
        type: 'checkbox',
        options: [{ label: 'Modern', value: 'modern' }, { label: 'Mid-century', value: 'mid-century' }, { label: 'Traditional', value: 'traditional' }, { label: 'Industrial', value: 'industrial' }, { label: 'Bohemian', value: 'bohemian' }, { label: 'Luxury / designer', value: 'luxury-designer' }],
      },
      {
        key: 'condition',
        label: 'Condition',
        type: 'checkbox',
        options: [{ label: 'Like new', value: 'like-new' }, { label: 'Good (minor wear)', value: 'good-minor-wear' }, { label: 'Acceptable (rental grade)', value: 'acceptable-rental-grade' }],
      },
      {
        key: 'cleaning-fee',
        label: 'Cleaning Fee',
        type: 'checkbox',
        options: [{ label: 'Standard cleaning included', value: 'standard-cleaning-included' }, { label: 'Extra for pet hair / stains', value: 'extra-for-pet-hair-stains' }],
      },
      {
        key: 'damage-protection',
        label: 'Damage Protection',
        type: 'checkbox',
        options: [{ label: 'Monthly fee (covers minor damage)', value: 'monthly-fee-covers-minor-damage' }, { label: 'Security deposit (refundable)', value: 'security-deposit-refundable' }, { label: 'No protection (pay for repairs)', value: 'no-protection-pay-for-repairs' }],
      },
      {
        key: 'substitution-policy',
        label: 'Substitution Policy',
        type: 'checkbox',
        options: [{ label: 'Similar item if unavailable', value: 'similar-item-if-unavailable' }, { label: 'Discount if lesser item', value: 'discount-if-lesser-item' }],
      },
      {
        key: 'early-return',
        label: 'Early Return',
        type: 'checkbox',
        options: [{ label: 'No refund for unused time', value: 'no-refund-for-unused-time' }, { label: 'Prorated refund (some companies)', value: 'prorated-refund-some-companies' }],
      },
      {
        key: 'late-return',
        label: 'Late Return',
        type: 'checkbox',
        options: [{ label: 'Daily rate (1.5x rental)', value: 'daily-rate-1-5x-rental' }, { label: 'Charged to card on file', value: 'charged-to-card-on-file' }],
      },
      {
        key: 'fabric-options',
        label: 'Fabric Options',
        type: 'checkbox',
        options: [{ label: 'As shown (no choice)', value: 'as-shown-no-choice' }, { label: 'Multiple colors available', value: 'multiple-colors-available' }, { label: 'Custom fabric (event rental)', value: 'custom-fabric-event-rental' }],
      },
      {
        key: 'pillows-decor-included',
        label: 'Pillows / Decor Included',
        type: 'checkbox',
        options: [{ label: 'Throw pillows (some packages)', value: 'throw-pillows-some-packages' }, { label: 'Decorative items (extra)', value: 'decorative-items-extra' }],
      }
    ],
    'ice-supplier': [
      {
        key: 'ice-type',
        label: 'Ice Type',
        type: 'checkbox',
        options: [{ label: 'Bagged ice (cubes)', value: 'bagged-ice-cubes' }, { label: 'Block ice (large blocks)', value: 'block-ice-large-blocks' }, { label: 'Crushed ice', value: 'crushed-ice' }, { label: 'Nugget ice (Sonic style)', value: 'nugget-ice-sonic-style' }, { label: 'Dry ice', value: 'dry-ice' }, { label: 'Carved ice (sculptures, logos)', value: 'carved-ice-sculptures-logos' }],
      },
      {
        key: 'bag-size',
        label: 'Bag Size',
        type: 'checkbox',
        options: [{ label: '5 lb bag', value: '5-lb-bag' }, { label: '7 lb bag', value: '7-lb-bag' }, { label: '10 lb bag', value: '10-lb-bag' }, { label: '20 lb bag', value: '20-lb-bag' }],
      },
      {
        key: 'block-ice-size',
        label: 'Block Ice Size',
        type: 'checkbox',
        options: [{ label: '10 lb block', value: '10-lb-block' }, { label: '20 lb block', value: '20-lb-block' }, { label: '50 lb block', value: '50-lb-block' }],
      },
      {
        key: 'delivery-available',
        label: 'Delivery Available',
        type: 'checkbox',
        options: [{ label: 'Yes (minimum order)', value: 'yes-minimum-order' }, { label: 'Pickup only', value: 'pickup-only' }],
      },
      {
        key: 'delivery-area',
        label: 'Delivery Area',
        type: 'checkbox',
        options: [{ label: 'Local (within 10 miles)', value: 'local-within-10-miles' }, { label: 'Extended (10-25 miles, fee)', value: 'extended-10-25-miles-fee' }, { label: 'No delivery beyond', value: 'no-delivery-beyond' }],
      },
      {
        key: 'minimum-order-for-delivery',
        label: 'Minimum Order for Delivery',
        type: 'checkbox',
        options: [{ label: '$25', value: '25' }, { label: '$50', value: '50' }, { label: '$100', value: '100' }],
      },
      {
        key: 'lead-time',
        label: 'Lead Time',
        type: 'checkbox',
        options: [{ label: 'Same day (call by ___am)', value: 'same-day-call-by-am' }, { label: '24 hours', value: '24-hours' }, { label: '48 hours (custom carving)', value: '48-hours-custom-carving' }],
      },
      {
        key: 'bulk-discount',
        label: 'Bulk Discount',
        type: 'checkbox',
        options: [{ label: '10+ bags (___% off)', value: '10-bags-off' }, { label: '50+ bags (___% off)', value: '50-bags-off' }, { label: 'Pallet pricing available', value: 'pallet-pricing-available' }],
      },
      {
        key: 'dry-ice-availability',
        label: 'Dry Ice Availability',
        type: 'checkbox',
        options: [{ label: 'Yes (pellets or blocks)', value: 'yes-pellets-or-blocks' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'ice-carving',
        label: 'Ice Carving',
        type: 'checkbox',
        options: [{ label: 'Custom sculpture', value: 'custom-sculpture' }, { label: 'Logo ice cubes', value: 'logo-ice-cubes' }, { label: 'Ice luges (for shots)', value: 'ice-luges-for-shots' }, { label: 'Lead time: 1-2 weeks', value: 'lead-time-1-2-weeks' }],
      },
      {
        key: 'storage-advice',
        label: 'Storage Advice',
        type: 'checkbox',
        options: [{ label: 'Coolers recommended', value: 'coolers-recommended' }, { label: 'Freezer not required (use within 24-48 hrs)', value: 'freezer-not-required-use-within-24-48-hrs' }],
      },
      {
        key: 'payment-methods',
        label: 'Payment Methods',
        type: 'checkbox',
        options: [{ label: 'Cash', value: 'cash' }, { label: 'Credit card', value: 'credit-card' }, { label: 'Account (corporate billing)', value: 'account-corporate-billing' }],
      },
      {
        key: 'seasonal-demand',
        label: 'Seasonal Demand',
        type: 'checkbox',
        options: [{ label: 'Summer (order early)', value: 'summer-order-early' }, { label: 'Events (weekends book up)', value: 'events-weekends-book-up' }],
      },
      {
        key: 'self-service-ice-kiosk',
        label: 'Self-Service Ice Kiosk',
        type: 'checkbox',
        options: [{ label: 'Yes (24/7)', value: 'yes-24-7' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'ice-quality',
        label: 'Ice Quality',
        type: 'checkbox',
        options: [{ label: 'Clear (restaurant grade)', value: 'clear-restaurant-grade' }, { label: 'Cloudy (standard)', value: 'cloudy-standard' }, { label: 'Filtered / purified', value: 'filtered-purified' }],
      }
    ],
    'holiday-rental-home': [
      {
        key: 'home-type',
        label: 'Home Type',
        type: 'checkbox',
        options: [{ label: 'Entire house', value: 'entire-house' }, { label: 'Condo / apartment', value: 'condo-apartment' }, { label: 'Townhouse', value: 'townhouse' }, { label: 'Villa', value: 'villa' }, { label: 'Cabin (see Cabin subcategory)', value: 'cabin-see-cabin-subcategory' }, { label: 'Cottage (see Cottage)', value: 'cottage-see-cottage' }, { label: 'Villa (luxury)', value: 'villa-luxury' }, { label: 'Farmhouse', value: 'farmhouse' }, { label: 'Loft', value: 'loft' }, { label: 'Duplex', value: 'duplex' }, { label: 'Guest house (see Guest House)', value: 'guest-house-see-guest-house' }],
      },
      {
        key: 'neighborhood-area-type',
        label: 'Neighborhood / Area Type',
        type: 'checkbox',
        options: [{ label: 'Residential (quiet)', value: 'residential-quiet' }, { label: 'Tourist district (walk to attractions)', value: 'tourist-district-walk-to-attractions' }, { label: 'Beachfront / lakefront', value: 'beachfront-lakefront' }, { label: 'Mountain / ski resort', value: 'mountain-ski-resort' }, { label: 'Rural / countryside', value: 'rural-countryside' }, { label: 'Suburban', value: 'suburban' }],
      },
      {
        key: 'amenities',
        label: 'Amenities',
        type: 'checkbox',
        options: [{ label: 'Private pool', value: 'private-pool' }, { label: 'Hot tub', value: 'hot-tub' }, { label: 'Game room (pool table, arcade)', value: 'game-room-pool-table-arcade' }, { label: 'Home theater', value: 'home-theater' }, { label: 'Gym / fitness equipment', value: 'gym-fitness-equipment' }, { label: 'Outdoor fire pit', value: 'outdoor-fire-pit' }, { label: 'Hammock', value: 'hammock' }, { label: 'Cornhole / yard games', value: 'cornhole-yard-games' }, { label: 'Bicycles provided', value: 'bicycles-provided' }, { label: 'Kayaks / paddleboards', value: 'kayaks-paddleboards' }, { label: 'Beach chairs / umbrella', value: 'beach-chairs-umbrella' }, { label: 'Ski storage / boot dryer', value: 'ski-storage-boot-dryer' }, { label: 'EV charger (electric vehicle)', value: 'ev-charger-electric-vehicle' }, { label: 'Backup generator', value: 'backup-generator' }],
      },
      {
        key: 'bedding-configuration',
        label: 'Bedding Configuration',
        type: 'checkbox',
        options: [{ label: 'King beds', value: 'king-beds' }, { label: 'Queen beds', value: 'queen-beds' }, { label: 'Double / full beds', value: 'double-full-beds' }, { label: 'Twin / single beds', value: 'twin-single-beds' }, { label: 'Bunk beds', value: 'bunk-beds' }, { label: 'Sofa beds', value: 'sofa-beds' }, { label: 'Air mattresses', value: 'air-mattresses' }],
      },
      {
        key: 'number-of-floors',
        label: 'Number of Floors',
        type: 'checkbox',
        options: [{ label: '1 floor (ranch / no stairs)', value: '1-floor-ranch-no-stairs' }, { label: '2 floors', value: '2-floors' }, { label: '3+ floors', value: '3-floors' }],
      },
      {
        key: 'fenced-yard',
        label: 'Fenced Yard',
        type: 'checkbox',
        options: [{ label: 'Yes (private)', value: 'yes-private' }, { label: 'Yes (shared)', value: 'yes-shared' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'grill-type',
        label: 'Grill Type',
        type: 'checkbox',
        options: [{ label: 'Gas grill', value: 'gas-grill' }, { label: 'Charcoal grill', value: 'charcoal-grill' }, { label: 'No grill', value: 'no-grill' }],
      },
      {
        key: 'coffee-maker-type',
        label: 'Coffee Maker Type',
        type: 'checkbox',
        options: [{ label: 'Drip', value: 'drip' }, { label: 'Keurig / pod', value: 'keurig-pod' }, { label: 'Espresso machine', value: 'espresso-machine' }, { label: 'French press', value: 'french-press' }],
      },
      {
        key: 'dishwasher',
        label: 'Dishwasher',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'washer-dryer',
        label: 'Washer / Dryer',
        type: 'checkbox',
        options: [{ label: 'In-unit', value: 'in-unit' }, { label: 'Shared', value: 'shared' }, { label: 'None (laundromat nearby)', value: 'none-laundromat-nearby' }],
      },
      {
        key: 'linens-towels-provided',
        label: 'Linens / Towels Provided',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'starter-supplies',
        label: 'Starter Supplies',
        type: 'checkbox',
        options: [{ label: 'Toilet paper (1-2 rolls)', value: 'toilet-paper-1-2-rolls' }, { label: 'Paper towels', value: 'paper-towels' }, { label: 'Dish soap', value: 'dish-soap' }, { label: 'Laundry detergent (small)', value: 'laundry-detergent-small' }, { label: 'Coffee / filters', value: 'coffee-filters' }, { label: 'Basic spices (salt, pepper, oil)', value: 'basic-spices-salt-pepper-oil' }],
      },
      {
        key: 'garbage-recycling',
        label: 'Garbage / Recycling',
        type: 'checkbox',
        options: [{ label: 'Cans provided', value: 'cans-provided' }, { label: 'Pickup schedule posted', value: 'pickup-schedule-posted' }, { label: 'Must take to dump (rural)', value: 'must-take-to-dump-rural' }],
      },
      {
        key: 'noise-monitoring',
        label: 'Noise Monitoring',
        type: 'checkbox',
        options: [{ label: 'Decibel sensor (respect quiet hours)', value: 'decibel-sensor-respect-quiet-hours' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'exterior-cameras',
        label: 'Exterior Cameras',
        type: 'checkbox',
        options: [{ label: 'Ring doorbell', value: 'ring-doorbell' }, { label: 'Driveway camera', value: 'driveway-camera' }, { label: 'Backyard camera (disclosed)', value: 'backyard-camera-disclosed' }],
      },
      {
        key: 'max-occupancy-strictly-enforced',
        label: 'Max Occupancy Strictly Enforced',
        type: 'checkbox',
        options: [{ label: 'Yes (extra guests fee)', value: 'yes-extra-guests-fee' }, { label: 'Yes (eviction if exceeded)', value: 'yes-eviction-if-exceeded' }, { label: 'Honor system', value: 'honor-system' }],
      },
      {
        key: 'age-requirement-to-book',
        label: 'Age Requirement to Book',
        type: 'checkbox',
        options: [{ label: '18+', value: '18' }, { label: '21+', value: '21' }, { label: '25+ (common)', value: '25-common' }, { label: '30+ (some high-end)', value: '30-some-high-end' }],
      },
      {
        key: 'security-deposit',
        label: 'Security Deposit',
        type: 'checkbox',
        options: [{ label: 'None (Airbnb/VRBO covers)', value: 'none-airbnb-vrbo-covers' }, { label: '$250-500', value: '250-500' }, { label: '$500-1,000', value: '500-1-000' }, { label: '$1,000+', value: '1-000' }],
      },
      {
        key: 'rental-agreement-required',
        label: 'Rental Agreement Required',
        type: 'checkbox',
        options: [{ label: 'Yes (sign separately)', value: 'yes-sign-separately' }, { label: 'No (platform terms only)', value: 'no-platform-terms-only' }],
      },
      {
        key: 'check-in-method',
        label: 'Check-in Method',
        type: 'checkbox',
        options: [{ label: 'Smart lock (code provided day of)', value: 'smart-lock-code-provided-day-of' }, { label: 'Lockbox', value: 'lockbox' }, { label: 'Meet host', value: 'meet-host' }, { label: 'Front desk (condo building)', value: 'front-desk-condo-building' }],
      }
    ],
    'bed-and-breakfast': [
      {
        key: 'b-b-type',
        label: 'B&B Type',
        type: 'checkbox',
        options: [{ label: 'Historic home', value: 'historic-home' }, { label: 'Farmhouse B&B', value: 'farmhouse-b-b' }, { label: 'Boutique B&B (small, upscale)', value: 'boutique-b-b-small-upscale' }, { label: 'Urban B&B (city townhouse)', value: 'urban-b-b-city-townhouse' }, { label: 'Rural / countryside', value: 'rural-countryside' }, { label: 'Coastal / beach B&B', value: 'coastal-beach-b-b' }],
      },
      {
        key: 'number-of-guest-rooms',
        label: 'Number of Guest Rooms',
        type: 'checkbox',
        options: [{ label: '1-3 rooms (very small)', value: '1-3-rooms-very-small' }, { label: '4-6 rooms', value: '4-6-rooms' }, { label: '7-10 rooms', value: '7-10-rooms' }, { label: '10+ rooms', value: '10-rooms' }],
      },
      {
        key: 'breakfast-included',
        label: 'Breakfast Included',
        type: 'checkbox',
        options: [{ label: 'Yes (full hot breakfast)', value: 'yes-full-hot-breakfast' }, { label: 'Yes (continental)', value: 'yes-continental' }, { label: 'Yes (gourmet / chef prepared)', value: 'yes-gourmet-chef-prepared' }, { label: 'No (breakfast extra)', value: 'no-breakfast-extra' }],
      },
      {
        key: 'breakfast-time',
        label: 'Breakfast Time',
        type: 'checkbox',
        options: [{ label: 'Fixed time (e.g., 8:00-9:30am)', value: 'fixed-time-e-g-8-00-9-30am' }, { label: 'Flexible (within window)', value: 'flexible-within-window' }, { label: 'Served in dining room', value: 'served-in-dining-room' }, { label: 'Served in room (extra)', value: 'served-in-room-extra' }],
      },
      {
        key: 'dietary-accommodations',
        label: 'Dietary Accommodations',
        type: 'checkbox',
        options: [{ label: 'Vegetarian', value: 'vegetarian' }, { label: 'Vegan', value: 'vegan' }, { label: 'Gluten-free', value: 'gluten-free' }, { label: 'Dairy-free', value: 'dairy-free' }, { label: 'Nut allergies', value: 'nut-allergies' }, { label: 'Kosher (must request)', value: 'kosher-must-request' }, { label: 'Halal (must request)', value: 'halal-must-request' }],
      },
      {
        key: 'common-areas',
        label: 'Common Areas',
        type: 'checkbox',
        options: [{ label: 'Living room / parlor', value: 'living-room-parlor' }, { label: 'Library / reading room', value: 'library-reading-room' }, { label: 'Garden / courtyard', value: 'garden-courtyard' }, { label: 'Sun porch', value: 'sun-porch' }, { label: 'Fireplace lounge', value: 'fireplace-lounge' }, { label: 'Game room', value: 'game-room' }],
      },
      {
        key: 'on-site-host',
        label: 'On-Site Host',
        type: 'checkbox',
        options: [{ label: 'Host lives on property', value: 'host-lives-on-property' }, { label: 'Host available during breakfast', value: 'host-available-during-breakfast' }, { label: 'Host available by phone', value: 'host-available-by-phone' }, { label: 'Innkeeper (off-site but nearby)', value: 'innkeeper-off-site-but-nearby' }],
      },
      {
        key: 'privacy-level',
        label: 'Privacy Level',
        type: 'checkbox',
        options: [{ label: 'Private bath (en suite)', value: 'private-bath-en-suite' }, { label: 'Private bath (across hall)', value: 'private-bath-across-hall' }, { label: 'Shared bath (with other guests)', value: 'shared-bath-with-other-guests' }, { label: 'Half-bath (shared)', value: 'half-bath-shared' }],
      },
      {
        key: 'room-amenities',
        label: 'Room Amenities',
        type: 'checkbox',
        options: [{ label: 'TV (in room)', value: 'tv-in-room' }, { label: 'WiFi (free)', value: 'wifi-free' }, { label: 'Air conditioning', value: 'air-conditioning' }, { label: 'Ceiling fan', value: 'ceiling-fan' }, { label: 'Fireplace (in room)', value: 'fireplace-in-room' }, { label: 'Jetted tub', value: 'jetted-tub' }, { label: 'Work desk', value: 'work-desk' }, { label: 'Mini fridge', value: 'mini-fridge' }, { label: 'Coffee maker', value: 'coffee-maker' }],
      },
      {
        key: 'household-pets',
        label: 'Household Pets',
        type: 'checkbox',
        options: [{ label: 'Resident pet (dog/cat)', value: 'resident-pet-dog-cat' }, { label: 'No resident pets (hypoallergenic)', value: 'no-resident-pets-hypoallergenic' }, { label: 'Pet-friendly rooms available', value: 'pet-friendly-rooms-available' }],
      },
      {
        key: 'child-policy',
        label: 'Child Policy',
        type: 'checkbox',
        options: [{ label: 'Children welcome (all ages)', value: 'children-welcome-all-ages' }, { label: 'Children 12+ only', value: 'children-12-only' }, { label: 'Adults only (no children)', value: 'adults-only-no-children' }],
      },
      {
        key: 'alcohol-policy',
        label: 'Alcohol Policy',
        type: 'checkbox',
        options: [{ label: 'BYOB (glasses provided)', value: 'byob-glasses-provided' }, { label: 'Complimentary wine/beer hour', value: 'complimentary-wine-beer-hour' }, { label: 'Cash bar on-site', value: 'cash-bar-on-site' }, { label: 'No alcohol (dry B&B)', value: 'no-alcohol-dry-b-b' }],
      },
      {
        key: 'evening-social-hour',
        label: 'Evening Social Hour',
        type: 'checkbox',
        options: [{ label: 'Yes (free)', value: 'yes-free' }, { label: 'Yes (nominal fee)', value: 'yes-nominal-fee' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'snacks-beverages',
        label: 'Snacks / Beverages',
        type: 'checkbox',
        options: [{ label: 'Complimentary (24/7)', value: 'complimentary-24-7' }, { label: 'For purchase (honor bar)', value: 'for-purchase-honor-bar' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'minimum-stay',
        label: 'Minimum Stay',
        type: 'checkbox',
        options: [{ label: '1 night', value: '1-night' }, { label: '2 nights (weekends)', value: '2-nights-weekends' }, { label: '3 nights (holidays)', value: '3-nights-holidays' }],
      },
      {
        key: 'cancellation-policy',
        label: 'Cancellation Policy',
        type: 'checkbox',
        options: [{ label: 'Flexible (48 hours)', value: 'flexible-48-hours' }, { label: 'Moderate (7 days)', value: 'moderate-7-days' }, { label: 'Strict (14 days)', value: 'strict-14-days' }, { label: 'Super strict (30 days, peak season)', value: 'super-strict-30-days-peak-season' }],
      },
      {
        key: 'gift-certificates-available',
        label: 'Gift Certificates Available',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'weddings-events-on-site',
        label: 'Weddings / Events On-Site',
        type: 'checkbox',
        options: [{ label: 'Yes (elopements)', value: 'yes-elopements' }, { label: 'Yes (small weddings under 30)', value: 'yes-small-weddings-under-30' }, { label: 'No', value: 'no' }],
      }
    ],
    'resort': [
      {
        key: 'resort-type',
        label: 'Resort Type',
        type: 'checkbox',
        options: [{ label: 'All-inclusive', value: 'all-inclusive' }, { label: 'Beach resort', value: 'beach-resort' }, { label: 'Ski resort', value: 'ski-resort' }, { label: 'Golf resort', value: 'golf-resort' }, { label: 'Spa resort', value: 'spa-resort' }, { label: 'Family resort', value: 'family-resort' }, { label: 'Adults-only resort', value: 'adults-only-resort' }, { label: 'Eco-resort / wellness', value: 'eco-resort-wellness' }, { label: 'Casino resort', value: 'casino-resort' }, { label: 'Dude ranch (horseback focus)', value: 'dude-ranch-horseback-focus' }],
      },
      {
        key: 'all-inclusive-details',
        label: 'All-Inclusive Details',
        type: 'checkbox',
        options: [{ label: 'Meals (breakfast, lunch, dinner)', value: 'meals-breakfast-lunch-dinner' }, { label: 'Snacks (all day)', value: 'snacks-all-day' }, { label: 'Alcoholic drinks (premium upcharge)', value: 'alcoholic-drinks-premium-upcharge' }, { label: 'Non-alcoholic drinks', value: 'non-alcoholic-drinks' }, { label: 'Activities (included)', value: 'activities-included' }, { label: 'Water sports (non-motorized)', value: 'water-sports-non-motorized' }, { label: 'Tips / gratuities (some include)', value: 'tips-gratuities-some-include' }, { label: 'Taxes (some include)', value: 'taxes-some-include' }, { label: 'Not all-inclusive (pay as you go)', value: 'not-all-inclusive-pay-as-you-go' }],
      },
      {
        key: 'meal-plan-options',
        label: 'Meal Plan Options',
        type: 'checkbox',
        options: [{ label: 'No meal plan', value: 'no-meal-plan' }, { label: 'Breakfast only (European plan)', value: 'breakfast-only-european-plan' }, { label: 'Breakfast + dinner (half board)', value: 'breakfast-dinner-half-board' }, { label: 'All meals (full board)', value: 'all-meals-full-board' }, { label: 'All-inclusive (everything)', value: 'all-inclusive-everything' }],
      },
      {
        key: 'number-of-restaurants',
        label: 'Number of Restaurants',
        type: 'checkbox',
        options: [{ label: '1-2', value: '1-2' }, { label: '3-5', value: '3-5' }, { label: '6-10', value: '6-10' }, { label: '10+ (buffet + a la carte)', value: '10-buffet-a-la-carte' }],
      },
      {
        key: 'dining-reservations-required',
        label: 'Dining Reservations Required',
        type: 'checkbox',
        options: [{ label: 'Yes (for a la carte)', value: 'yes-for-a-la-carte' }, { label: 'No (buffet only)', value: 'no-buffet-only' }, { label: 'Mixed', value: 'mixed' }],
      },
      {
        key: 'swimming-pools',
        label: 'Swimming Pools',
        type: 'checkbox',
        options: [{ label: '1 pool', value: '1-pool' }, { label: '2-3 pools', value: '2-3-pools' }, { label: '4+ pools', value: '4-pools' }, { label: 'Adults-only pool', value: 'adults-only-pool' }, { label: 'Kids pool / splash pad', value: 'kids-pool-splash-pad' }, { label: 'Indoor pool', value: 'indoor-pool' }, { label: 'Infinity pool', value: 'infinity-pool' }],
      },
      {
        key: 'pool-amenities',
        label: 'Pool Amenities',
        type: 'checkbox',
        options: [{ label: 'Towel service', value: 'towel-service' }, { label: 'Swim-up bar', value: 'swim-up-bar' }, { label: 'Poolside food service', value: 'poolside-food-service' }, { label: 'Cabanas (rental)', value: 'cabanas-rental' }, { label: 'Lounge chairs (first come)', value: 'lounge-chairs-first-come' }, { label: 'Shade structures', value: 'shade-structures' }],
      },
      {
        key: 'beach-access',
        label: 'Beach Access',
        type: 'checkbox',
        options: [{ label: 'Private beach (resort guests only)', value: 'private-beach-resort-guests-only' }, { label: 'Public beach (nearby)', value: 'public-beach-nearby' }, { label: 'No beach (pool only)', value: 'no-beach-pool-only' }],
      },
      {
        key: 'resort-fee',
        label: 'Resort Fee',
        type: 'checkbox',
        options: [{ label: 'None', value: 'none' }, { label: '$20-40/night', value: '20-40-night' }, { label: '$40-60/night', value: '40-60-night' }, { label: '$60+/night (includes certain amenities)', value: '60-night-includes-certain-amenities' }],
      },
      {
        key: 'included-in-resort-fee',
        label: 'Included in Resort Fee',
        type: 'checkbox',
        options: [{ label: 'WiFi', value: 'wifi' }, { label: 'Fitness center', value: 'fitness-center' }, { label: 'Pool access', value: 'pool-access' }, { label: 'Beach chairs/umbrellas', value: 'beach-chairs-umbrellas' }, { label: 'Local calls', value: 'local-calls' }, { label: 'Parking (sometimes)', value: 'parking-sometimes' }],
      },
      {
        key: 'children-s-club-kids-camp',
        label: 'Children\'s Club / Kids Camp',
        type: 'checkbox',
        options: [{ label: 'Included (ages 4-12)', value: 'included-ages-4-12' }, { label: 'Extra fee (per day)', value: 'extra-fee-per-day' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'babysitting-nanny-service',
        label: 'Babysitting / Nanny Service',
        type: 'checkbox',
        options: [{ label: 'Yes (advance notice)', value: 'yes-advance-notice' }, { label: 'Yes (on-demand, extra fee)', value: 'yes-on-demand-extra-fee' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'teen-activities',
        label: 'Teen Activities',
        type: 'checkbox',
        options: [{ label: 'Dedicated teen center', value: 'dedicated-teen-center' }, { label: 'Teen excursions', value: 'teen-excursions' }, { label: 'No teen programming', value: 'no-teen-programming' }],
      },
      {
        key: 'adult-activities',
        label: 'Adult Activities',
        type: 'checkbox',
        options: [{ label: 'Pool parties', value: 'pool-parties' }, { label: 'Nightclub / disco', value: 'nightclub-disco' }, { label: 'Live entertainment', value: 'live-entertainment' }, { label: 'Cooking classes', value: 'cooking-classes' }, { label: 'Wine / tequila tastings', value: 'wine-tequila-tastings' }, { label: 'Yoga / fitness classes', value: 'yoga-fitness-classes' }],
      },
      {
        key: 'spa-on-site',
        label: 'Spa On-Site',
        type: 'checkbox',
        options: [{ label: 'Yes (full service)', value: 'yes-full-service' }, { label: 'Yes (basic massage only)', value: 'yes-basic-massage-only' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'golf-course-on-site',
        label: 'Golf Course On-Site',
        type: 'checkbox',
        options: [{ label: 'Yes (18 holes)', value: 'yes-18-holes' }, { label: 'Yes (9 holes)', value: 'yes-9-holes' }, { label: 'Nearby (shuttle)', value: 'nearby-shuttle' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'ski-in-ski-out',
        label: 'Ski-In / Ski-Out',
        type: 'checkbox',
        options: [{ label: 'Yes (ski resort)', value: 'yes-ski-resort' }, { label: 'Shuttle to lifts', value: 'shuttle-to-lifts' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'water-sports-motorized',
        label: 'Water Sports (motorized)',
        type: 'checkbox',
        options: [{ label: 'Jetskis (extra)', value: 'jetskis-extra' }, { label: 'Parasailing (extra)', value: 'parasailing-extra' }, { label: 'Banana boat (extra)', value: 'banana-boat-extra' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'water-sports-non-motorized',
        label: 'Water Sports (non-motorized)',
        type: 'checkbox',
        options: [{ label: 'Kayaks (included)', value: 'kayaks-included' }, { label: 'Paddleboards (included)', value: 'paddleboards-included' }, { label: 'Snorkel gear (included)', value: 'snorkel-gear-included' }, { label: 'Hobie cats (included or extra)', value: 'hobie-cats-included-or-extra' }],
      },
      {
        key: 'fitness-center',
        label: 'Fitness Center',
        type: 'checkbox',
        options: [{ label: 'Basic (treadmill, weights)', value: 'basic-treadmill-weights' }, { label: 'Full gym (classes available)', value: 'full-gym-classes-available' }, { label: 'Personal trainer available', value: 'personal-trainer-available' }],
      },
      {
        key: 'nightly-entertainment',
        label: 'Nightly Entertainment',
        type: 'checkbox',
        options: [{ label: 'Live music', value: 'live-music' }, { label: 'Shows (stage)', value: 'shows-stage' }, { label: 'Fireworks (weekly)', value: 'fireworks-weekly' }, { label: 'DJ / dancing', value: 'dj-dancing' }],
      },
      {
        key: 'room-types',
        label: 'Room Types',
        type: 'checkbox',
        options: [{ label: 'Standard room', value: 'standard-room' }, { label: 'Suite (separate living area)', value: 'suite-separate-living-area' }, { label: 'Swim-up room (direct pool access)', value: 'swim-up-room-direct-pool-access' }, { label: 'Overwater bungalow', value: 'overwater-bungalow' }, { label: 'Villa (private pool)', value: 'villa-private-pool' }, { label: 'Penthouse', value: 'penthouse' }],
      },
      {
        key: 'club-level-concierge-level',
        label: 'Club Level / Concierge Level',
        type: 'checkbox',
        options: [{ label: 'Yes (upgrade)', value: 'yes-upgrade' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'butler-service',
        label: 'Butler Service',
        type: 'checkbox',
        options: [{ label: 'Included (certain room types)', value: 'included-certain-room-types' }, { label: 'Available (extra)', value: 'available-extra' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'all-inclusive-brand',
        label: 'All-Inclusive Brand',
        type: 'checkbox',
        options: [{ label: 'Sandals / Beaches', value: 'sandals-beaches' }, { label: 'Club Med', value: 'club-med' }, { label: 'Iberostar', value: 'iberostar' }, { label: 'Riu', value: 'riu' }, { label: 'Excellence', value: 'excellence' }, { label: 'Secrets', value: 'secrets' }, { label: 'Dreams', value: 'dreams' }, { label: 'Independent', value: 'independent' }],
      },
      {
        key: 'membership-timeshare-presentation',
        label: 'Membership / Timeshare Presentation',
        type: 'checkbox',
        options: [{ label: 'No pressure', value: 'no-pressure' }, { label: 'Required for discount rate', value: 'required-for-discount-rate' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'green-eco-certification',
        label: 'Green / Eco Certification',
        type: 'checkbox',
        options: [{ label: 'Yes (certified)', value: 'yes-certified' }, { label: 'Practices (but no cert)', value: 'practices-but-no-cert' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'airport-transfer',
        label: 'Airport Transfer',
        type: 'checkbox',
        options: [{ label: 'Included (all-inclusive)', value: 'included-all-inclusive' }, { label: 'Available (extra fee)', value: 'available-extra-fee' }, { label: 'Not provided', value: 'not-provided' }],
      }
    ],
    'campground': [
      {
        key: 'campground-type',
        label: 'Campground Type',
        type: 'checkbox',
        options: [{ label: 'Private campground', value: 'private-campground' }, { label: 'State park campground', value: 'state-park-campground' }, { label: 'National park campground', value: 'national-park-campground' }, { label: 'National forest (dispersed camping)', value: 'national-forest-dispersed-camping' }, { label: 'KOA (Kampgrounds of America)', value: 'koa-kampgrounds-of-america' }, { label: 'RV park', value: 'rv-park' }, { label: 'Glamping resort', value: 'glamping-resort' }, { label: 'Tent-only campground', value: 'tent-only-campground' }, { label: 'Group campground', value: 'group-campground' }],
      },
      {
        key: 'site-type',
        label: 'Site Type',
        type: 'checkbox',
        options: [{ label: 'Tent site (no hookups)', value: 'tent-site-no-hookups' }, { label: 'Tent site with water', value: 'tent-site-with-water' }, { label: 'RV site (electric only)', value: 'rv-site-electric-only' }, { label: 'RV site (electric + water)', value: 'rv-site-electric-water' }, { label: 'Full hookup (electric, water, sewer)', value: 'full-hookup-electric-water-sewer' }, { label: 'Pull-through RV site', value: 'pull-through-rv-site' }, { label: 'Back-in RV site', value: 'back-in-rv-site' }, { label: 'Cabins (basic)', value: 'cabins-basic' }, { label: 'Yurts', value: 'yurts' }, { label: 'Glamping tents (furnished)', value: 'glamping-tents-furnished' }, { label: 'Group site (multiple tents)', value: 'group-site-multiple-tents' }],
      },
      {
        key: 'hookups-available',
        label: 'Hookups Available',
        type: 'checkbox',
        options: [{ label: 'None (primitive)', value: 'none-primitive' }, { label: 'Water only', value: 'water-only' }, { label: 'Electric (15/30/50 amp)', value: 'electric-15-30-50-amp' }, { label: 'Electric + water', value: 'electric-water' }, { label: 'Full hookup (includes sewer)', value: 'full-hookup-includes-sewer' }],
      },
      {
        key: 'maximum-rv-length',
        label: 'Maximum RV Length',
        type: 'checkbox',
        options: [{ label: 'Under 20 ft', value: 'under-20-ft' }, { label: '20-30 ft', value: '20-30-ft' }, { label: '30-40 ft', value: '30-40-ft' }, { label: '40+ ft', value: '40-ft' }, { label: 'No RVs (tent only)', value: 'no-rvs-tent-only' }],
      },
      {
        key: 'cost-per-night',
        label: 'Cost Per Night',
        type: 'checkbox',
        options: [{ label: 'Free (dispersed camping)', value: 'free-dispersed-camping' }, { label: 'Under $15', value: 'under-15' }, { label: '$15-30', value: '15-30' }, { label: '$30-50', value: '30-50' }, { label: '$50-75', value: '50-75' }, { label: '$75+ (glamping)', value: '75-glamping' }],
      },
      {
        key: 'reservations',
        label: 'Reservations',
        type: 'checkbox',
        options: [{ label: 'Required (peak season)', value: 'required-peak-season' }, { label: 'Recommended (weekends)', value: 'recommended-weekends' }, { label: 'First come, first served', value: 'first-come-first-served' }, { label: 'Walk-up only', value: 'walk-up-only' }],
      },
      {
        key: 'check-in-check-out',
        label: 'Check-in / Check-out',
        type: 'checkbox',
        options: [{ label: '2pm / 12pm (typical)', value: '2pm-12pm-typical' }, { label: 'Flexible', value: 'flexible' }, { label: 'After hours allowed (self-registration)', value: 'after-hours-allowed-self-registration' }],
      },
      {
        key: 'bathrooms',
        label: 'Bathrooms',
        type: 'checkbox',
        options: [{ label: 'Flush toilets', value: 'flush-toilets' }, { label: 'Vault / pit toilets', value: 'vault-pit-toilets' }, { label: 'Portable toilets', value: 'portable-toilets' }, { label: 'None (bring your own)', value: 'none-bring-your-own' }],
      },
      {
        key: 'showers',
        label: 'Showers',
        type: 'checkbox',
        options: [{ label: 'Free (hot)', value: 'free-hot' }, { label: 'Coin-operated ($___)', value: 'coin-operated' }, { label: 'Cold only', value: 'cold-only' }, { label: 'No showers', value: 'no-showers' }],
      },
      {
        key: 'dump-station',
        label: 'Dump Station',
        type: 'checkbox',
        options: [{ label: 'Yes (free for guests)', value: 'yes-free-for-guests' }, { label: 'Yes (fee for non-guests)', value: 'yes-fee-for-non-guests' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'fire-pit',
        label: 'Fire Pit',
        type: 'checkbox',
        options: [{ label: 'At each site (shared)', value: 'at-each-site-shared' }, { label: 'At each site (private)', value: 'at-each-site-private' }, { label: 'Community fire pit', value: 'community-fire-pit' }, { label: 'Not allowed (fire ban)', value: 'not-allowed-fire-ban' }],
      },
      {
        key: 'firewood-sold',
        label: 'Firewood Sold',
        type: 'checkbox',
        options: [{ label: 'Yes (on-site)', value: 'yes-on-site' }, { label: 'Yes (nearby)', value: 'yes-nearby' }, { label: 'No (bring your own, local only)', value: 'no-bring-your-own-local-only' }],
      },
      {
        key: 'picnic-table',
        label: 'Picnic Table',
        type: 'checkbox',
        options: [{ label: 'At each site', value: 'at-each-site' }, { label: 'Some sites', value: 'some-sites' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'trash-recycling',
        label: 'Trash / Recycling',
        type: 'checkbox',
        options: [{ label: 'Dumpsters on-site', value: 'dumpsters-on-site' }, { label: 'Pack it in, pack it out', value: 'pack-it-in-pack-it-out' }, { label: 'Trash pickup at site (daily)', value: 'trash-pickup-at-site-daily' }],
      },
      {
        key: 'camp-store',
        label: 'Camp Store',
        type: 'checkbox',
        options: [{ label: 'Full (food, ice, gear)', value: 'full-food-ice-gear' }, { label: 'Limited (snacks, firewood)', value: 'limited-snacks-firewood' }, { label: 'No store', value: 'no-store' }],
      },
      {
        key: 'laundry',
        label: 'Laundry',
        type: 'checkbox',
        options: [{ label: 'Yes (coin)', value: 'yes-coin' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'wifi',
        label: 'WiFi',
        type: 'checkbox',
        options: [{ label: 'Free (at office / common area)', value: 'free-at-office-common-area' }, { label: 'Paid (campsite)', value: 'paid-campsite' }, { label: 'No WiFi (good cell signal)', value: 'no-wifi-good-cell-signal' }],
      },
      {
        key: 'cell-service',
        label: 'Cell Service',
        type: 'checkbox',
        options: [{ label: 'Excellent', value: 'excellent' }, { label: 'Spotty', value: 'spotty' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'pool',
        label: 'Pool',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'playground',
        label: 'Playground',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'dog-friendly',
        label: 'Dog Friendly',
        type: 'checkbox',
        options: [{ label: 'Leashed allowed', value: 'leashed-allowed' }, { label: 'Off-leash area', value: 'off-leash-area' }, { label: 'No dogs', value: 'no-dogs' }],
      },
      {
        key: 'quiet-hours',
        label: 'Quiet Hours',
        type: 'checkbox',
        options: [{ label: 'Enforced (10pm - 7am)', value: 'enforced-10pm-7am' }, { label: 'Recommended', value: 'recommended' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'generator-hours',
        label: 'Generator Hours',
        type: 'checkbox',
        options: [{ label: 'Allowed (specific times)', value: 'allowed-specific-times' }, { label: 'Not allowed', value: 'not-allowed' }, { label: 'Quiet generators only', value: 'quiet-generators-only' }],
      },
      {
        key: 'nearby-hiking-trails',
        label: 'Nearby Hiking Trails',
        type: 'checkbox',
        options: [{ label: 'Access from campground', value: 'access-from-campground' }, { label: 'Short drive', value: 'short-drive' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'nearby-water-access',
        label: 'Nearby Water Access',
        type: 'checkbox',
        options: [{ label: 'Lake', value: 'lake' }, { label: 'River', value: 'river' }, { label: 'Ocean/beach', value: 'ocean-beach' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'senior-military-discount',
        label: 'Senior / Military Discount',
        type: 'checkbox',
        options: [{ label: 'Yes (state/federal parks)', value: 'yes-state-federal-parks' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'maximum-stay',
        label: 'Maximum Stay',
        type: 'checkbox',
        options: [{ label: '14 days', value: '14-days' }, { label: '21 days', value: '21-days' }, { label: '30 days', value: '30-days' }, { label: 'No limit (long-term RV)', value: 'no-limit-long-term-rv' }],
      }
    ],
    'hostel': [
      {
        key: 'hostel-type',
        label: 'Hostel Type',
        type: 'checkbox',
        options: [{ label: 'Backpacker hostel (social)', value: 'backpacker-hostel-social' }, { label: 'Boutique hostel (stylish)', value: 'boutique-hostel-stylish' }, { label: 'Party hostel (bar on-site)', value: 'party-hostel-bar-on-site' }, { label: 'Quiet / study hostel', value: 'quiet-study-hostel' }, { label: 'Eco-hostel', value: 'eco-hostel' }, { label: 'Budget hostel (no frills)', value: 'budget-hostel-no-frills' }, { label: 'Female-only hostel', value: 'female-only-hostel' }, { label: 'LGBTQ+ friendly hostel', value: 'lgbtq-friendly-hostel' }],
      },
      {
        key: 'dormitory-size',
        label: 'Dormitory Size',
        type: 'checkbox',
        options: [{ label: '4-bed dorm', value: '4-bed-dorm' }, { label: '6-bed dorm', value: '6-bed-dorm' }, { label: '8-bed dorm', value: '8-bed-dorm' }, { label: '10-bed dorm', value: '10-bed-dorm' }, { label: '12+ bed dorm', value: '12-bed-dorm' }, { label: 'Female-only dorm (available)', value: 'female-only-dorm-available' }],
      },
      {
        key: 'private-rooms-available',
        label: 'Private Rooms Available',
        type: 'checkbox',
        options: [{ label: 'Yes (en suite bathroom)', value: 'yes-en-suite-bathroom' }, { label: 'Yes (shared bathroom)', value: 'yes-shared-bathroom' }, { label: 'No (dorms only)', value: 'no-dorms-only' }],
      },
      {
        key: 'bunk-bed-type',
        label: 'Bunk Bed Type',
        type: 'checkbox',
        options: [{ label: 'Basic metal frame', value: 'basic-metal-frame' }, { label: 'Pod / capsule style', value: 'pod-capsule-style' }, { label: 'Curtained for privacy', value: 'curtained-for-privacy' }, { label: 'Built-in reading light', value: 'built-in-reading-light' }, { label: 'Built-in outlet / USB', value: 'built-in-outlet-usb' }, { label: 'Locker included', value: 'locker-included' }],
      },
      {
        key: 'linen-included',
        label: 'Linen Included',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (rent for $___)', value: 'no-rent-for' }, { label: 'Sleeping bag not allowed', value: 'sleeping-bag-not-allowed' }],
      },
      {
        key: 'towel-included',
        label: 'Towel Included',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'Rental ($___)', value: 'rental' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'lockers',
        label: 'Lockers',
        type: 'checkbox',
        options: [{ label: 'In-room (bring lock)', value: 'in-room-bring-lock' }, { label: 'In-room (lock provided)', value: 'in-room-lock-provided' }, { label: 'Front desk storage', value: 'front-desk-storage' }, { label: 'No lockers', value: 'no-lockers' }],
      },
      {
        key: 'common-areas',
        label: 'Common Areas',
        type: 'checkbox',
        options: [{ label: 'Lounge / TV room', value: 'lounge-tv-room' }, { label: 'Kitchen (guest use)', value: 'kitchen-guest-use' }, { label: 'Dining area', value: 'dining-area' }, { label: 'Outdoor patio / garden', value: 'outdoor-patio-garden' }, { label: 'Rooftop terrace', value: 'rooftop-terrace' }, { label: 'Game room (pool table, foosball)', value: 'game-room-pool-table-foosball' }, { label: 'Movie room', value: 'movie-room' }],
      },
      {
        key: 'guest-kitchen',
        label: 'Guest Kitchen',
        type: 'checkbox',
        options: [{ label: 'Full kitchen (stove, oven, fridge)', value: 'full-kitchen-stove-oven-fridge' }, { label: 'Basic (microwave, toaster, kettle)', value: 'basic-microwave-toaster-kettle' }, { label: 'No kitchen', value: 'no-kitchen' }],
      },
      {
        key: 'free-breakfast',
        label: 'Free Breakfast',
        type: 'checkbox',
        options: [{ label: 'Yes (continental)', value: 'yes-continental' }, { label: 'Yes (pancakes, eggs)', value: 'yes-pancakes-eggs' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'free-coffee-tea',
        label: 'Free Coffee / Tea',
        type: 'checkbox',
        options: [{ label: 'Yes (all day)', value: 'yes-all-day' }, { label: 'Limited hours', value: 'limited-hours' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'bar-on-site',
        label: 'Bar On-Site',
        type: 'checkbox',
        options: [{ label: 'Yes (hostel bar)', value: 'yes-hostel-bar' }, { label: 'No (nearby bars)', value: 'no-nearby-bars' }],
      },
      {
        key: 'organized-activities',
        label: 'Organized Activities',
        type: 'checkbox',
        options: [{ label: 'Pub crawl', value: 'pub-crawl' }, { label: 'Walking tour (free or tip-based)', value: 'walking-tour-free-or-tip-based' }, { label: 'Family dinner (community meal)', value: 'family-dinner-community-meal' }, { label: 'Movie night', value: 'movie-night' }, { label: 'Game night', value: 'game-night' }, { label: 'Yoga class', value: 'yoga-class' }, { label: 'No activities', value: 'no-activities' }],
      },
      {
        key: 'bike-rental',
        label: 'Bike Rental',
        type: 'checkbox',
        options: [{ label: 'Yes (free or cheap)', value: 'yes-free-or-cheap' }, { label: 'Yes (rental)', value: 'yes-rental' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'luggage-storage-before-check-in-after-check-out',
        label: 'Luggage Storage (before check-in / after check-out)',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: 'Fee ($___)', value: 'fee' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'laundry',
        label: 'Laundry',
        type: 'checkbox',
        options: [{ label: 'Self-serve (coin)', value: 'self-serve-coin' }, { label: 'Service wash (drop off)', value: 'service-wash-drop-off' }, { label: 'No laundry', value: 'no-laundry' }],
      },
      {
        key: 'curfew',
        label: 'Curfew',
        type: 'checkbox',
        options: [{ label: 'No curfew (24-hour access)', value: 'no-curfew-24-hour-access' }, { label: 'Curfew (midnight, doors locked)', value: 'curfew-midnight-doors-locked' }],
      },
      {
        key: 'age-restrictions',
        label: 'Age Restrictions',
        type: 'checkbox',
        options: [{ label: 'Under 18 with parent', value: 'under-18-with-parent' }, { label: '18-35 only (youth hostel)', value: '18-35-only-youth-hostel' }, { label: 'All ages welcome', value: 'all-ages-welcome' }],
      },
      {
        key: 'max-stay',
        label: 'Max Stay',
        type: 'checkbox',
        options: [{ label: '7 nights', value: '7-nights' }, { label: '14 nights', value: '14-nights' }, { label: 'No limit (but higher rate)', value: 'no-limit-but-higher-rate' }],
      },
      {
        key: 'work-exchange-volunteer-for-stay',
        label: 'Work Exchange (volunteer for stay)',
        type: 'checkbox',
        options: [{ label: 'Yes (apply)', value: 'yes-apply' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'remote-work-friendly',
        label: 'Remote Work Friendly',
        type: 'checkbox',
        options: [{ label: 'Dedicated workspace', value: 'dedicated-workspace' }, { label: 'Good WiFi', value: 'good-wifi' }, { label: 'Co-working vibe', value: 'co-working-vibe' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'booking-deposit',
        label: 'Booking Deposit',
        type: 'checkbox',
        options: [{ label: '10-20% deposit', value: '10-20-deposit' }, { label: 'First night charge', value: 'first-night-charge' }, { label: 'Full payment upfront', value: 'full-payment-upfront' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: '24 hours (free)', value: '24-hours-free' }, { label: '48 hours', value: '48-hours' }, { label: '7 days (peak season)', value: '7-days-peak-season' }, { label: 'Non-refundable (discount rate)', value: 'non-refundable-discount-rate' }],
      },
      {
        key: 'membership-discount',
        label: 'Membership Discount',
        type: 'checkbox',
        options: [{ label: 'Hostelling International (HI)', value: 'hostelling-international-hi' }, { label: 'No membership required', value: 'no-membership-required' }],
      },
      {
        key: 'lockout-midday-closed-for-cleaning',
        label: 'Lockout (midday closed for cleaning)',
        type: 'checkbox',
        options: [{ label: 'Yes (10am - 2pm)', value: 'yes-10am-2pm' }, { label: 'No', value: 'no' }],
      }
    ],
    'lodge': [
      {
        key: 'lodge-type',
        label: 'Lodge Type',
        type: 'checkbox',
        options: [{ label: 'Mountain lodge (ski / hiking)', value: 'mountain-lodge-ski-hiking' }, { label: 'Hunting lodge', value: 'hunting-lodge' }, { label: 'Fishing lodge', value: 'fishing-lodge' }, { label: 'Safari lodge', value: 'safari-lodge' }, { label: 'Forest lodge (rustic)', value: 'forest-lodge-rustic' }, { label: 'Luxury wilderness lodge', value: 'luxury-wilderness-lodge' }, { label: 'National park lodge (historic)', value: 'national-park-lodge-historic' }],
      },
      {
        key: 'setting',
        label: 'Setting',
        type: 'checkbox',
        options: [{ label: 'Remote (last mile access)', value: 'remote-last-mile-access' }, { label: 'Semi-remote (near town)', value: 'semi-remote-near-town' }, { label: 'Accessible by car', value: 'accessible-by-car' }, { label: 'Accessible by boat / plane only', value: 'accessible-by-boat-plane-only' }],
      },
      {
        key: 'lodge-size',
        label: 'Lodge Size',
        type: 'checkbox',
        options: [{ label: 'Small (under 10 rooms)', value: 'small-under-10-rooms' }, { label: 'Medium (10-25 rooms)', value: 'medium-10-25-rooms' }, { label: 'Large (25-50 rooms)', value: 'large-25-50-rooms' }, { label: 'Historic grand lodge (50+)', value: 'historic-grand-lodge-50' }],
      },
      {
        key: 'lobby-great-room',
        label: 'Lobby / Great Room',
        type: 'checkbox',
        options: [{ label: 'Stone fireplace', value: 'stone-fireplace' }, { label: 'High ceilings (wood beams)', value: 'high-ceilings-wood-beams' }, { label: 'Trophy mounts (decorative)', value: 'trophy-mounts-decorative' }, { label: 'Large seating area', value: 'large-seating-area' }, { label: 'Piano / live music', value: 'piano-live-music' }],
      },
      {
        key: 'on-site-dining',
        label: 'On-Site Dining',
        type: 'checkbox',
        options: [{ label: 'Full restaurant (breakfast, dinner)', value: 'full-restaurant-breakfast-dinner' }, { label: 'Breakfast only (lodge style)', value: 'breakfast-only-lodge-style' }, { label: 'No restaurant (nearby town)', value: 'no-restaurant-nearby-town' }],
      },
      {
        key: 'meal-plan',
        label: 'Meal Plan',
        type: 'checkbox',
        options: [{ label: 'No meals (room only)', value: 'no-meals-room-only' }, { label: 'Breakfast included', value: 'breakfast-included' }, { label: 'Half board (breakfast + dinner)', value: 'half-board-breakfast-dinner' }, { label: 'Full board (all meals)', value: 'full-board-all-meals' }, { label: 'Packed lunch available (extra)', value: 'packed-lunch-available-extra' }],
      },
      {
        key: 'bar-lounge',
        label: 'Bar / Lounge',
        type: 'checkbox',
        options: [{ label: 'Full bar', value: 'full-bar' }, { label: 'Beer & wine only', value: 'beer-wine-only' }, { label: 'No alcohol (dry lodge)', value: 'no-alcohol-dry-lodge' }],
      },
      {
        key: 'activities-included',
        label: 'Activities Included',
        type: 'checkbox',
        options: [{ label: 'Hiking (trails from lodge)', value: 'hiking-trails-from-lodge' }, { label: 'Fishing (gear rental available)', value: 'fishing-gear-rental-available' }, { label: 'Canoe / kayak (lake access)', value: 'canoe-kayak-lake-access' }, { label: 'Wildlife viewing', value: 'wildlife-viewing' }, { label: 'Star gazing', value: 'star-gazing' }, { label: 'Photography blinds', value: 'photography-blinds' }, { label: 'Not included (guided tours extra)', value: 'not-included-guided-tours-extra' }],
      },
      {
        key: 'guided-tours-extra-fee',
        label: 'Guided Tours (extra fee)',
        type: 'checkbox',
        options: [{ label: 'Wildlife safari', value: 'wildlife-safari' }, { label: 'Fly fishing guide', value: 'fly-fishing-guide' }, { label: 'Backcountry hiking guide', value: 'backcountry-hiking-guide' }, { label: 'Snowmobile tours', value: 'snowmobile-tours' }, { label: 'Dog sledding', value: 'dog-sledding' }, { label: 'Aurora viewing (winter)', value: 'aurora-viewing-winter' }],
      },
      {
        key: 'ski-access',
        label: 'Ski Access',
        type: 'checkbox',
        options: [{ label: 'Ski-in / ski-out', value: 'ski-in-ski-out' }, { label: 'Shuttle to lifts', value: 'shuttle-to-lifts' }, { label: 'Walk to lifts (5-10 min)', value: 'walk-to-lifts-5-10-min' }, { label: 'Drive to resort', value: 'drive-to-resort' }],
      },
      {
        key: 'snowshoe-cross-country-ski',
        label: 'Snowshoe / Cross-Country Ski',
        type: 'checkbox',
        options: [{ label: 'Trails from lodge', value: 'trails-from-lodge' }, { label: 'Rental available', value: 'rental-available' }, { label: 'No winter activities', value: 'no-winter-activities' }],
      },
      {
        key: 'fireplace-in-room',
        label: 'Fireplace in Room',
        type: 'checkbox',
        options: [{ label: 'Yes (wood)', value: 'yes-wood' }, { label: 'Yes (gas)', value: 'yes-gas' }, { label: 'No (common area only)', value: 'no-common-area-only' }],
      },
      {
        key: 'bathroom-type',
        label: 'Bathroom Type',
        type: 'checkbox',
        options: [{ label: 'Private en suite', value: 'private-en-suite' }, { label: 'Private (across hall)', value: 'private-across-hall' }, { label: 'Shared (bathhouse)', value: 'shared-bathhouse' }],
      },
      {
        key: 'heat-source',
        label: 'Heat Source',
        type: 'checkbox',
        options: [{ label: 'Central heat', value: 'central-heat' }, { label: 'Wood stove (in room)', value: 'wood-stove-in-room' }, { label: 'Propane heater', value: 'propane-heater' }, { label: 'Electric blanket', value: 'electric-blanket' }],
      },
      {
        key: 'no-cell-service',
        label: 'No Cell Service',
        type: 'checkbox',
        options: [{ label: 'Yes (satellite phone at lodge)', value: 'yes-satellite-phone-at-lodge' }, { label: 'No (good coverage)', value: 'no-good-coverage' }],
      },
      {
        key: 'electricity',
        label: 'Electricity',
        type: 'checkbox',
        options: [{ label: 'Full electric (grid)', value: 'full-electric-grid' }, { label: 'Generator (limited hours)', value: 'generator-limited-hours' }, { label: 'Solar (limited)', value: 'solar-limited' }, { label: 'No electricity (candlelight)', value: 'no-electricity-candlelight' }],
      },
      {
        key: 'wifi',
        label: 'WiFi',
        type: 'checkbox',
        options: [{ label: 'Yes (common area only)', value: 'yes-common-area-only' }, { label: 'Yes (in rooms)', value: 'yes-in-rooms' }, { label: 'No WiFi (disconnect)', value: 'no-wifi-disconnect' }],
      },
      {
        key: 'pets-allowed',
        label: 'Pets Allowed',
        type: 'checkbox',
        options: [{ label: 'Yes (certain rooms)', value: 'yes-certain-rooms' }, { label: 'No (wildlife area)', value: 'no-wildlife-area' }],
      },
      {
        key: 'helipad',
        label: 'Helipad',
        type: 'checkbox',
        options: [{ label: 'Yes (for fly-in guests)', value: 'yes-for-fly-in-guests' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'remote-location-warning',
        label: 'Remote Location Warning',
        type: 'checkbox',
        options: [{ label: 'Last gas station ___ miles away', value: 'last-gas-station-miles-away' }, { label: 'Groceries available at lodge', value: 'groceries-available-at-lodge' }, { label: 'Bring everything you need', value: 'bring-everything-you-need' }],
      }
    ],
    'cabin': [
      {
        key: 'cabin-type',
        label: 'Cabin Type',
        type: 'checkbox',
        options: [{ label: 'Log cabin (traditional)', value: 'log-cabin-traditional' }, { label: 'Modern cabin (contemporary)', value: 'modern-cabin-contemporary' }, { label: 'A-frame cabin', value: 'a-frame-cabin' }, { label: 'Tiny cabin (under 400 sq ft)', value: 'tiny-cabin-under-400-sq-ft' }, { label: 'Prefab cabin', value: 'prefab-cabin' }, { label: 'Off-grid cabin (no utilities)', value: 'off-grid-cabin-no-utilities' }, { label: 'Lakeside cabin', value: 'lakeside-cabin' }, { label: 'Mountain cabin', value: 'mountain-cabin' }, { label: 'Woods cabin (secluded)', value: 'woods-cabin-secluded' }],
      },
      {
        key: 'size',
        label: 'Size',
        type: 'checkbox',
        options: [{ label: 'Small (1 bedroom)', value: 'small-1-bedroom' }, { label: 'Medium (2 bedrooms)', value: 'medium-2-bedrooms' }, { label: 'Large (3+ bedrooms)', value: 'large-3-bedrooms' }],
      },
      {
        key: 'off-grid-features',
        label: 'Off-Grid Features',
        type: 'checkbox',
        options: [{ label: 'Solar power', value: 'solar-power' }, { label: 'Propane appliances', value: 'propane-appliances' }, { label: 'Composting toilet', value: 'composting-toilet' }, { label: 'Well water (drinkable)', value: 'well-water-drinkable' }, { label: 'Rain catchment', value: 'rain-catchment' }, { label: 'No running water (bring your own)', value: 'no-running-water-bring-your-own' }],
      },
      {
        key: 'grid-connected-features',
        label: 'Grid-Connected Features',
        type: 'checkbox',
        options: [{ label: 'Electric (grid)', value: 'electric-grid' }, { label: 'Running water', value: 'running-water' }, { label: 'Flush toilet', value: 'flush-toilet' }, { label: 'Hot water heater', value: 'hot-water-heater' }, { label: 'Standard appliances', value: 'standard-appliances' }],
      },
      {
        key: 'heat-source',
        label: 'Heat Source',
        type: 'checkbox',
        options: [{ label: 'Wood stove (firewood provided)', value: 'wood-stove-firewood-provided' }, { label: 'Propane heater', value: 'propane-heater' }, { label: 'Electric baseboard', value: 'electric-baseboard' }, { label: 'Mini-split (heat pump)', value: 'mini-split-heat-pump' }, { label: 'Radiant floor', value: 'radiant-floor' }],
      },
      {
        key: 'cooling',
        label: 'Cooling',
        type: 'checkbox',
        options: [{ label: 'Air conditioning (window or mini-split)', value: 'air-conditioning-window-or-mini-split' }, { label: 'Ceiling fans only', value: 'ceiling-fans-only' }, { label: 'Natural breeze (no AC)', value: 'natural-breeze-no-ac' }],
      },
      {
        key: 'water-source',
        label: 'Water Source',
        type: 'checkbox',
        options: [{ label: 'Well (drinkable, tested)', value: 'well-drinkable-tested' }, { label: 'Spring (filter recommended)', value: 'spring-filter-recommended' }, { label: 'Lake/river (not drinkable, bring water)', value: 'lake-river-not-drinkable-bring-water' }, { label: 'Haul water (5 gallon jugs provided)', value: 'haul-water-5-gallon-jugs-provided' }],
      },
      {
        key: 'septic-toilet',
        label: 'Septic / Toilet',
        type: 'checkbox',
        options: [{ label: 'Septic (flush toilet)', value: 'septic-flush-toilet' }, { label: 'Composting toilet (eco)', value: 'composting-toilet-eco' }, { label: 'Outhouse (rustic)', value: 'outhouse-rustic' }],
      },
      {
        key: 'outdoor-space',
        label: 'Outdoor Space',
        type: 'checkbox',
        options: [{ label: 'Porch (screened)', value: 'porch-screened' }, { label: 'Deck (open)', value: 'deck-open' }, { label: 'Patio', value: 'patio' }, { label: 'Fire pit (outdoor)', value: 'fire-pit-outdoor' }, { label: 'Grill (charcoal or propane)', value: 'grill-charcoal-or-propane' }, { label: 'Hammock', value: 'hammock' }, { label: 'Hot tub (private)', value: 'hot-tub-private' }],
      },
      {
        key: 'wildlife-precautions',
        label: 'Wildlife Precautions',
        type: 'checkbox',
        options: [{ label: 'Bear box (food storage)', value: 'bear-box-food-storage' }, { label: 'Bear spray recommended', value: 'bear-spray-recommended' }, { label: 'No open food outside', value: 'no-open-food-outside' }, { label: 'Not required', value: 'not-required' }],
      },
      {
        key: 'noise-level',
        label: 'Noise Level',
        type: 'checkbox',
        options: [{ label: 'Quiet (no neighbors)', value: 'quiet-no-neighbors' }, { label: 'Secluded (some distance)', value: 'secluded-some-distance' }, { label: 'Near other cabins (some noise)', value: 'near-other-cabins-some-noise' }],
      },
      {
        key: 'privacy',
        label: 'Privacy',
        type: 'checkbox',
        options: [{ label: 'Very private (no visible neighbors)', value: 'very-private-no-visible-neighbors' }, { label: 'Moderate (cabins spaced out)', value: 'moderate-cabins-spaced-out' }, { label: 'Close (neighbors within shouting)', value: 'close-neighbors-within-shouting' }],
      },
      {
        key: 'road-access',
        label: 'Road Access',
        type: 'checkbox',
        options: [{ label: 'Paved road', value: 'paved-road' }, { label: 'Gravel road (well maintained)', value: 'gravel-road-well-maintained' }, { label: 'Dirt road (4x4 recommended)', value: 'dirt-road-4x4-recommended' }, { label: 'Winter access (4x4 required)', value: 'winter-access-4x4-required' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Driveway (gravel)', value: 'driveway-gravel' }, { label: 'Carport', value: 'carport' }, { label: 'Garage', value: 'garage' }, { label: 'Street (rural)', value: 'street-rural' }],
      },
      {
        key: 'cell-signal',
        label: 'Cell Signal',
        type: 'checkbox',
        options: [{ label: 'Strong', value: 'strong' }, { label: 'Weak (text only)', value: 'weak-text-only' }, { label: 'None (satellite phone available)', value: 'none-satellite-phone-available' }],
      },
      {
        key: 'satellite-internet-starlink',
        label: 'Satellite Internet / Starlink',
        type: 'checkbox',
        options: [{ label: 'Yes (Starlink)', value: 'yes-starlink' }, { label: 'Yes (slow satellite)', value: 'yes-slow-satellite' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'tv-dvd',
        label: 'TV / DVD',
        type: 'checkbox',
        options: [{ label: 'Smart TV (streaming with Starlink)', value: 'smart-tv-streaming-with-starlink' }, { label: 'DVD player + DVDs provided', value: 'dvd-player-dvds-provided' }, { label: 'No TV (unplug)', value: 'no-tv-unplug' }],
      },
      {
        key: 'books-games',
        label: 'Books / Games',
        type: 'checkbox',
        options: [{ label: 'Board games provided', value: 'board-games-provided' }, { label: 'Books (various)', value: 'books-various' }, { label: 'Puzzles', value: 'puzzles' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'firewood-provided',
        label: 'Firewood Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (unlimited)', value: 'yes-unlimited' }, { label: 'Yes (one bundle per day)', value: 'yes-one-bundle-per-day' }, { label: 'No (buy nearby or gather)', value: 'no-buy-nearby-or-gather' }],
      },
      {
        key: 'atv-snowmobile-trail-access',
        label: 'ATV / Snowmobile Trail Access',
        type: 'checkbox',
        options: [{ label: 'Direct access', value: 'direct-access' }, { label: 'Nearby (short drive)', value: 'nearby-short-drive' }, { label: 'No', value: 'no' }],
      }
    ],
    'cottage': [
      {
        key: 'cottage-type',
        label: 'Cottage Type',
        type: 'checkbox',
        options: [{ label: 'Beach cottage (coastal)', value: 'beach-cottage-coastal' }, { label: 'Lake cottage', value: 'lake-cottage' }, { label: 'Garden cottage (on estate)', value: 'garden-cottage-on-estate' }, { label: 'English cottage (historic)', value: 'english-cottage-historic' }, { label: 'Coastal cottage (Cape Cod style)', value: 'coastal-cottage-cape-cod-style' }, { label: 'Country cottage (rural)', value: 'country-cottage-rural' }],
      },
      {
        key: 'style',
        label: 'Style',
        type: 'checkbox',
        options: [{ label: 'Quaint / cozy', value: 'quaint-cozy' }, { label: 'Rustic', value: 'rustic' }, { label: 'Modernized (updated interior)', value: 'modernized-updated-interior' }, { label: 'Historic (original charm)', value: 'historic-original-charm' }, { label: 'Minimalist', value: 'minimalist' }],
      },
      {
        key: 'size',
        label: 'Size',
        type: 'checkbox',
        options: [{ label: 'Small (studio or 1 bed)', value: 'small-studio-or-1-bed' }, { label: 'Medium (2 beds)', value: 'medium-2-beds' }, { label: 'Large (3 beds, rare for cottage)', value: 'large-3-beds-rare-for-cottage' }],
      },
      {
        key: 'outdoor-space',
        label: 'Outdoor Space',
        type: 'checkbox',
        options: [{ label: 'Garden (flowers, landscaping)', value: 'garden-flowers-landscaping' }, { label: 'Patio with seating', value: 'patio-with-seating' }, { label: 'BBQ grill', value: 'bbq-grill' }, { label: 'Outdoor shower (beach cottage)', value: 'outdoor-shower-beach-cottage' }, { label: 'Porch (screened)', value: 'porch-screened' }, { label: 'Chiminea (outdoor fireplace)', value: 'chiminea-outdoor-fireplace' }],
      },
      {
        key: 'distance-to-water',
        label: 'Distance to Water',
        type: 'checkbox',
        options: [{ label: 'Waterfront (on lake/ocean)', value: 'waterfront-on-lake-ocean' }, { label: 'Water view (across street)', value: 'water-view-across-street' }, { label: 'Short walk (under 5 min)', value: 'short-walk-under-5-min' }, { label: 'Drive to water (5+ min)', value: 'drive-to-water-5-min' }],
      },
      {
        key: 'private-beach-access',
        label: 'Private Beach Access',
        type: 'checkbox',
        options: [{ label: 'Yes (deeded access)', value: 'yes-deeded-access' }, { label: 'Shared (neighborhood beach)', value: 'shared-neighborhood-beach' }, { label: 'No beach access', value: 'no-beach-access' }],
      },
      {
        key: 'dock',
        label: 'Dock',
        type: 'checkbox',
        options: [{ label: 'Private dock', value: 'private-dock' }, { label: 'Shared dock', value: 'shared-dock' }, { label: 'No dock', value: 'no-dock' }],
      },
      {
        key: 'boat-slip',
        label: 'Boat Slip',
        type: 'checkbox',
        options: [{ label: 'Available (included)', value: 'available-included' }, { label: 'Available (extra fee)', value: 'available-extra-fee' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'swimming',
        label: 'Swimming',
        type: 'checkbox',
        options: [{ label: 'Off dock (lake)', value: 'off-dock-lake' }, { label: 'Beach swimming', value: 'beach-swimming' }, { label: 'No swimming (water not safe)', value: 'no-swimming-water-not-safe' }],
      },
      {
        key: 'heating-cooling',
        label: 'Heating / Cooling',
        type: 'checkbox',
        options: [{ label: 'Window AC (bedroom)', value: 'window-ac-bedroom' }, { label: 'Portable fan', value: 'portable-fan' }, { label: 'Space heater (winter)', value: 'space-heater-winter' }, { label: 'Baseboard heat', value: 'baseboard-heat' }, { label: 'No AC (coastal breeze)', value: 'no-ac-coastal-breeze' }],
      },
      {
        key: 'laundry',
        label: 'Laundry',
        type: 'checkbox',
        options: [{ label: 'Washer/dryer (in unit)', value: 'washer-dryer-in-unit' }, { label: 'No laundry (line dry)', value: 'no-laundry-line-dry' }],
      },
      {
        key: 'historic-features',
        label: 'Historic Features',
        type: 'checkbox',
        options: [{ label: 'Original hardwood floors', value: 'original-hardwood-floors' }, { label: 'Fireplace (original)', value: 'fireplace-original' }, { label: 'Beamed ceiling', value: 'beamed-ceiling' }, { label: 'Built-in cabinetry', value: 'built-in-cabinetry' }, { label: 'Antique furniture', value: 'antique-furniture' }],
      },
      {
        key: 'ghost-haunted-reputation',
        label: 'Ghost / Haunted Reputation',
        type: 'checkbox',
        options: [{ label: 'Yes (reported)', value: 'yes-reported' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'minimum-stay',
        label: 'Minimum Stay',
        type: 'checkbox',
        options: [{ label: '3 nights (peak season)', value: '3-nights-peak-season' }, { label: '5-7 nights (beach towns)', value: '5-7-nights-beach-towns' }, { label: '1 night (off-season)', value: '1-night-off-season' }],
      },
      {
        key: 'seasonal-availability',
        label: 'Seasonal Availability',
        type: 'checkbox',
        options: [{ label: 'Summer only (beach/lake)', value: 'summer-only-beach-lake' }, { label: 'Year-round (coastal)', value: 'year-round-coastal' }, { label: 'Spring to fall (mild climate)', value: 'spring-to-fall-mild-climate' }],
      },
      {
        key: 'cottage-community',
        label: 'Cottage Community',
        type: 'checkbox',
        options: [{ label: 'Part of cottage association', value: 'part-of-cottage-association' }, { label: 'Standalone (private owner)', value: 'standalone-private-owner' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: '1 car (designated spot)', value: '1-car-designated-spot' }, { label: '2 cars', value: '2-cars' }, { label: 'Street parking (free)', value: 'street-parking-free' }],
      },
      {
        key: 'linens-towels',
        label: 'Linens / Towels',
        type: 'checkbox',
        options: [{ label: 'Provided', value: 'provided' }, { label: 'Available (rental)', value: 'available-rental' }, { label: 'Bring your own', value: 'bring-your-own' }],
      },
      {
        key: 'kitchen-amenities',
        label: 'Kitchen Amenities',
        type: 'checkbox',
        options: [{ label: 'Full kitchen', value: 'full-kitchen' }, { label: 'Basic (mini fridge, microwave, toaster)', value: 'basic-mini-fridge-microwave-toaster' }, { label: 'Cookware provided (pots, pans)', value: 'cookware-provided-pots-pans' }, { label: 'Dishware (plates, cups, utensils)', value: 'dishware-plates-cups-utensils' }],
      },
      {
        key: 'coffee-maker',
        label: 'Coffee Maker',
        type: 'checkbox',
        options: [{ label: 'Drip', value: 'drip' }, { label: 'Keurig', value: 'keurig' }, { label: 'French press', value: 'french-press' }, { label: 'No coffee maker (bring your own)', value: 'no-coffee-maker-bring-your-own' }],
      },
      {
        key: 'pet-policy',
        label: 'Pet Policy',
        type: 'checkbox',
        options: [{ label: 'Dog friendly (fee)', value: 'dog-friendly-fee' }, { label: 'Cats allowed (rare)', value: 'cats-allowed-rare' }, { label: 'No pets', value: 'no-pets' }],
      },
      {
        key: 'family-heirlooms-breakables',
        label: 'Family Heirlooms / Breakables',
        type: 'checkbox',
        options: [{ label: 'Yes (decorative)', value: 'yes-decorative' }, { label: 'No (family/kid friendly)', value: 'no-family-kid-friendly' }],
      },
      {
        key: 'nearby-town',
        label: 'Nearby Town',
        type: 'checkbox',
        options: [{ label: 'Walking distance (under 1 mile)', value: 'walking-distance-under-1-mile' }, { label: 'Short drive (5-10 min)', value: 'short-drive-5-10-min' }, { label: 'Remote (20+ min)', value: 'remote-20-min' }],
      },
      {
        key: 'grocery-access',
        label: 'Grocery Access',
        type: 'checkbox',
        options: [{ label: 'Nearby (under 5 miles)', value: 'nearby-under-5-miles' }, { label: 'Stock up before arrival', value: 'stock-up-before-arrival' }],
      }
    ],
    'guest-house': [
      {
        key: 'guest-house-type',
        label: 'Guest House Type',
        type: 'checkbox',
        options: [{ label: 'Backyard guest house (ADU)', value: 'backyard-guest-house-adu' }, { label: 'Carriage house (above garage)', value: 'carriage-house-above-garage' }, { label: 'Pool house (attached to pool)', value: 'pool-house-attached-to-pool' }, { label: 'Garden cottage (separate from main house)', value: 'garden-cottage-separate-from-main-house' }, { label: 'In-law suite (attached, private entrance)', value: 'in-law-suite-attached-private-entrance' }],
      },
      {
        key: 'relationship-to-main-house',
        label: 'Relationship to Main House',
        type: 'checkbox',
        options: [{ label: 'Detached (separate building)', value: 'detached-separate-building' }, { label: 'Attached (shared wall, separate entrance)', value: 'attached-shared-wall-separate-entrance' }, { label: 'Above garage (stairs required)', value: 'above-garage-stairs-required' }],
      },
      {
        key: 'privacy-level',
        label: 'Privacy Level',
        type: 'checkbox',
        options: [{ label: 'Fully private (own entrance, no shared spaces)', value: 'fully-private-own-entrance-no-shared-spaces' }, { label: 'Private entrance, shared yard', value: 'private-entrance-shared-yard' }, { label: 'Host lives on property (main house)', value: 'host-lives-on-property-main-house' }],
      },
      {
        key: 'size',
        label: 'Size',
        type: 'checkbox',
        options: [{ label: 'Studio (efficiency)', value: 'studio-efficiency' }, { label: '1 bedroom', value: '1-bedroom' }, { label: '2 bedrooms (rare for guest house)', value: '2-bedrooms-rare-for-guest-house' }],
      },
      {
        key: 'kitchen-type',
        label: 'Kitchen Type',
        type: 'checkbox',
        options: [{ label: 'Full kitchen', value: 'full-kitchen' }, { label: 'Kitchenette (microwave, mini fridge, sink)', value: 'kitchenette-microwave-mini-fridge-sink' }, { label: 'No kitchen (coffee maker only)', value: 'no-kitchen-coffee-maker-only' }],
      },
      {
        key: 'bathroom',
        label: 'Bathroom',
        type: 'checkbox',
        options: [{ label: 'En suite (private)', value: 'en-suite-private' }, { label: 'Private (across hall)', value: 'private-across-hall' }, { label: 'Shared with host (rare)', value: 'shared-with-host-rare' }],
      },
      {
        key: 'laundry',
        label: 'Laundry',
        type: 'checkbox',
        options: [{ label: 'In-unit (washer/dryer)', value: 'in-unit-washer-dryer' }, { label: 'Shared with host (arrange)', value: 'shared-with-host-arrange' }, { label: 'No laundry', value: 'no-laundry' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Driveway spot (dedicated)', value: 'driveway-spot-dedicated' }, { label: 'Street parking (free)', value: 'street-parking-free' }, { label: 'Garage (if carriage house)', value: 'garage-if-carriage-house' }],
      },
      {
        key: 'separate-entrance',
        label: 'Separate Entrance',
        type: 'checkbox',
        options: [{ label: 'Yes (private)', value: 'yes-private' }, { label: 'No (through main house)', value: 'no-through-main-house' }],
      },
      {
        key: 'host-interaction',
        label: 'Host Interaction',
        type: 'checkbox',
        options: [{ label: 'Minimal (key code, text only)', value: 'minimal-key-code-text-only' }, { label: 'Moderate (host nearby, available)', value: 'moderate-host-nearby-available' }, { label: 'Frequent (shared yard, chatty host)', value: 'frequent-shared-yard-chatty-host' }],
      },
      {
        key: 'work-from-home-friendly',
        label: 'Work from Home Friendly',
        type: 'checkbox',
        options: [{ label: 'Desk / workspace', value: 'desk-workspace' }, { label: 'Good WiFi', value: 'good-wifi' }, { label: 'Quiet neighborhood', value: 'quiet-neighborhood' }],
      },
      {
        key: 'length-of-stay',
        label: 'Length of Stay',
        type: 'checkbox',
        options: [{ label: '1-3 nights (short term)', value: '1-3-nights-short-term' }, { label: 'Weekly', value: 'weekly' }, { label: 'Monthly (furnished rental)', value: 'monthly-furnished-rental' }],
      },
      {
        key: 'utilities-included',
        label: 'Utilities Included',
        type: 'checkbox',
        options: [{ label: 'Yes (electric, water, WiFi)', value: 'yes-electric-water-wifi' }, { label: 'No (separate meter, tenant pays)', value: 'no-separate-meter-tenant-pays' }],
      },
      {
        key: 'furnished',
        label: 'Furnished',
        type: 'checkbox',
        options: [{ label: 'Yes (turnkey)', value: 'yes-turnkey' }, { label: 'Partial (bring your own linens)', value: 'partial-bring-your-own-linens' }, { label: 'Unfurnished (long-term only)', value: 'unfurnished-long-term-only' }],
      },
      {
        key: 'pet-policy',
        label: 'Pet Policy',
        type: 'checkbox',
        options: [{ label: 'Small dogs allowed (fee)', value: 'small-dogs-allowed-fee' }, { label: 'No pets (host has pets)', value: 'no-pets-host-has-pets' }],
      },
      {
        key: 'host-pets-on-site',
        label: 'Host Pets On-Site',
        type: 'checkbox',
        options: [{ label: 'Dog (friendly)', value: 'dog-friendly' }, { label: 'Cat (outdoor)', value: 'cat-outdoor' }, { label: 'No host pets', value: 'no-host-pets' }],
      },
      {
        key: 'smoking-policy',
        label: 'Smoking Policy',
        type: 'checkbox',
        options: [{ label: 'No smoking (inside or yard)', value: 'no-smoking-inside-or-yard' }, { label: 'Outside only (away from house)', value: 'outside-only-away-from-house' }],
      },
      {
        key: 'minimum-age-to-book',
        label: 'Minimum Age to Book',
        type: 'checkbox',
        options: [{ label: '21+', value: '21' }, { label: '25+', value: '25' }, { label: '18+ (with parent)', value: '18-with-parent' }],
      },
      {
        key: 'security-deposit',
        label: 'Security Deposit',
        type: 'checkbox',
        options: [{ label: '$250 (refundable)', value: '250-refundable' }, { label: 'None (Airbnb covers)', value: 'none-airbnb-covers' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: 'Flexible', value: 'flexible' }, { label: 'Moderate', value: 'moderate' }, { label: 'Strict (discount rate)', value: 'strict-discount-rate' }],
      },
      {
        key: 'cleaning-fee',
        label: 'Cleaning Fee',
        type: 'checkbox',
        options: [{ label: '$25-50', value: '25-50' }, { label: '$50-75', value: '50-75' }, { label: 'None (clean yourself)', value: 'none-clean-yourself' }],
      },
      {
        key: 'long-term-discount-28-nights',
        label: 'Long-Term Discount (28+ nights)',
        type: 'checkbox',
        options: [{ label: '10-20% off monthly', value: '10-20-off-monthly' }, { label: 'No discount', value: 'no-discount' }],
      }
    ],
    'health-retreats': [
      {
        key: 'retreat-type',
        label: 'Retreat Type',
        type: 'checkbox',
        options: [{ label: 'Wellness retreat', value: 'wellness-retreat' }, { label: 'Weight loss retreat', value: 'weight-loss-retreat' }, { label: 'Detox / juice cleanse', value: 'detox-juice-cleanse' }, { label: 'Yoga retreat', value: 'yoga-retreat' }, { label: 'Meditation retreat', value: 'meditation-retreat' }, { label: 'Stress management', value: 'stress-management' }, { label: 'Spiritual retreat', value: 'spiritual-retreat' }, { label: 'Fitness bootcamp', value: 'fitness-bootcamp' }, { label: 'Holistic health', value: 'holistic-health' }, { label: 'Medical wellness (doctor supervised)', value: 'medical-wellness-doctor-supervised' }],
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'checkbox',
        options: [{ label: 'Weekend (2-3 nights)', value: 'weekend-2-3-nights' }, { label: '5 days', value: '5-days' }, { label: '7 days (week long)', value: '7-days-week-long' }, { label: '10 days', value: '10-days' }, { label: '14 days', value: '14-days' }, { label: '21+ days', value: '21-days' }],
      },
      {
        key: 'accommodation-style',
        label: 'Accommodation Style',
        type: 'checkbox',
        options: [{ label: 'Private room (en suite)', value: 'private-room-en-suite' }, { label: 'Private room (shared bath)', value: 'private-room-shared-bath' }, { label: 'Shared room (2-4 people)', value: 'shared-room-2-4-people' }, { label: 'Dormitory style (5+)', value: 'dormitory-style-5' }],
      },
      {
        key: 'meal-plan',
        label: 'Meal Plan',
        type: 'checkbox',
        options: [{ label: 'All meals included', value: 'all-meals-included' }, { label: 'Juice fast only', value: 'juice-fast-only' }, { label: 'Vegan / plant-based', value: 'vegan-plant-based' }, { label: 'Raw food', value: 'raw-food' }, { label: 'Keto / paleo', value: 'keto-paleo' }, { label: 'Custom diet (allergies)', value: 'custom-diet-allergies' }],
      },
      {
        key: 'daily-schedule',
        label: 'Daily Schedule',
        type: 'checkbox',
        options: [{ label: 'Structured (hour by hour)', value: 'structured-hour-by-hour' }, { label: 'Semi-structured (some free time)', value: 'semi-structured-some-free-time' }, { label: 'Flexible (choose activities)', value: 'flexible-choose-activities' }],
      },
      {
        key: 'included-activities',
        label: 'Included Activities',
        type: 'checkbox',
        options: [{ label: 'Yoga (daily)', value: 'yoga-daily' }, { label: 'Meditation', value: 'meditation' }, { label: 'Fitness classes', value: 'fitness-classes' }, { label: 'Hiking', value: 'hiking' }, { label: 'Nutrition workshops', value: 'nutrition-workshops' }, { label: 'Cooking classes', value: 'cooking-classes' }, { label: 'Massage (1 included)', value: 'massage-1-included' }, { label: 'Health coaching sessions', value: 'health-coaching-sessions' }],
      },
      {
        key: 'paid-add-ons',
        label: 'Paid Add-Ons',
        type: 'checkbox',
        options: [{ label: 'Private coaching', value: 'private-coaching' }, { label: 'Additional spa treatments', value: 'additional-spa-treatments' }, { label: 'Personal training', value: 'personal-training' }, { label: 'Private yoga', value: 'private-yoga' }, { label: 'Lab work / health testing', value: 'lab-work-health-testing' }],
      },
      {
        key: 'medical-staff-on-site',
        label: 'Medical Staff On-Site',
        type: 'checkbox',
        options: [{ label: 'Doctor', value: 'doctor' }, { label: 'Nurse', value: 'nurse' }, { label: 'Nutritionist', value: 'nutritionist' }, { label: 'Therapist (mental health)', value: 'therapist-mental-health' }, { label: 'No medical staff', value: 'no-medical-staff' }],
      },
      {
        key: 'digital-detox',
        label: 'Digital Detox',
        type: 'checkbox',
        options: [{ label: 'No phones (collected)', value: 'no-phones-collected' }, { label: 'Phones allowed (limited hours)', value: 'phones-allowed-limited-hours' }, { label: 'WiFi available', value: 'wifi-available' }],
      },
      {
        key: 'silence-policy',
        label: 'Silence Policy',
        type: 'checkbox',
        options: [{ label: 'Full silence (meditation retreat)', value: 'full-silence-meditation-retreat' }, { label: 'Silence during meals', value: 'silence-during-meals' }, { label: 'No silence (social)', value: 'no-silence-social' }],
      },
      {
        key: 'gender-specific',
        label: 'Gender Specific',
        type: 'checkbox',
        options: [{ label: 'Women only', value: 'women-only' }, { label: 'Men only', value: 'men-only' }, { label: 'Co-ed', value: 'co-ed' }],
      },
      {
        key: 'age-range',
        label: 'Age Range',
        type: 'checkbox',
        options: [{ label: 'Adult (25-55)', value: 'adult-25-55' }, { label: 'Senior (55+)', value: 'senior-55' }, { label: 'All adults (18+)', value: 'all-adults-18' }],
      },
      {
        key: 'fitness-level-required',
        label: 'Fitness Level Required',
        type: 'checkbox',
        options: [{ label: 'Beginner friendly', value: 'beginner-friendly' }, { label: 'Intermediate', value: 'intermediate' }, { label: 'Advanced', value: 'advanced' }, { label: 'All levels', value: 'all-levels' }],
      },
      {
        key: 'pre-program-health-screening',
        label: 'Pre-Program Health Screening',
        type: 'checkbox',
        options: [{ label: 'Questionnaire only', value: 'questionnaire-only' }, { label: 'Phone consult', value: 'phone-consult' }, { label: 'Doctor approval required', value: 'doctor-approval-required' }],
      },
      {
        key: 'post-retreat-support',
        label: 'Post-Retreat Support',
        type: 'checkbox',
        options: [{ label: 'Follow-up calls', value: 'follow-up-calls' }, { label: 'Online community', value: 'online-community' }, { label: 'Meal plan to take home', value: 'meal-plan-to-take-home' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'refund-cancellation',
        label: 'Refund / Cancellation',
        type: 'checkbox',
        options: [{ label: 'Free up to 30 days', value: 'free-up-to-30-days' }, { label: '50% up to 14 days', value: '50-up-to-14-days' }, { label: 'No refund within 14 days', value: 'no-refund-within-14-days' }],
      },
      {
        key: 'travel-insurance-recommended',
        label: 'Travel Insurance Recommended',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'airport-transfer',
        label: 'Airport Transfer',
        type: 'checkbox',
        options: [{ label: 'Included (group shuttle)', value: 'included-group-shuttle' }, { label: 'Available (extra fee)', value: 'available-extra-fee' }, { label: 'Not provided', value: 'not-provided' }],
      },
      {
        key: 'what-to-bring',
        label: 'What to Bring',
        type: 'checkbox',
        options: [{ label: 'Yoga mat (provided or bring)', value: 'yoga-mat-provided-or-bring' }, { label: 'Comfortable clothes', value: 'comfortable-clothes' }, { label: 'Hiking shoes', value: 'hiking-shoes' }, { label: 'Swimsuit (pool/hot tub)', value: 'swimsuit-pool-hot-tub' }, { label: 'Journal', value: 'journal' }, { label: 'Water bottle', value: 'water-bottle' }],
      }
    ],
    'mountain-huts': [
      {
        key: 'hut-type',
        label: 'Hut Type',
        type: 'checkbox',
        options: [{ label: 'Alpine hut (high elevation)', value: 'alpine-hut-high-elevation' }, { label: 'Backcountry hut (wilderness)', value: 'backcountry-hut-wilderness' }, { label: 'Ski hut (winter access)', value: 'ski-hut-winter-access' }, { label: 'Hiking hut (summer only)', value: 'hiking-hut-summer-only' }, { label: 'Refugio (European style)', value: 'refugio-european-style' }, { label: 'Yurt (round, canvas)', value: 'yurt-round-canvas' }, { label: 'Lean-to (3-sided, primitive)', value: 'lean-to-3-sided-primitive' }],
      },
      {
        key: 'location',
        label: 'Location',
        type: 'checkbox',
        options: [{ label: 'Above tree line', value: 'above-tree-line' }, { label: 'Tree line (sheltered)', value: 'tree-line-sheltered' }, { label: 'Forest clearing', value: 'forest-clearing' }, { label: 'Remote valley', value: 'remote-valley' }],
      },
      {
        key: 'access',
        label: 'Access',
        type: 'checkbox',
        options: [{ label: 'Hike-in (2-5 miles)', value: 'hike-in-2-5-miles' }, { label: 'Hike-in (5-10 miles)', value: 'hike-in-5-10-miles' }, { label: 'Ski-in (backcountry)', value: 'ski-in-backcountry' }, { label: 'Snowmobile access (winter)', value: 'snowmobile-access-winter' }, { label: '4x4 road (summer)', value: '4x4-road-summer' }],
      },
      {
        key: 'difficulty-to-reach',
        label: 'Difficulty to Reach',
        type: 'checkbox',
        options: [{ label: 'Easy (moderate hike)', value: 'easy-moderate-hike' }, { label: 'Moderate (elevation gain)', value: 'moderate-elevation-gain' }, { label: 'Strenuous (long, steep)', value: 'strenuous-long-steep' }, { label: 'Expert (technical route)', value: 'expert-technical-route' }],
      },
      {
        key: 'elevation',
        label: 'Elevation',
        type: 'checkbox',
        options: [{ label: '5,000-8,000 ft', value: '5-000-8-000-ft' }, { label: '8,000-10,000 ft', value: '8-000-10-000-ft' }, { label: '10,000-12,000 ft', value: '10-000-12-000-ft' }, { label: '12,000+ ft', value: '12-000-ft' }],
      },
      {
        key: 'altitude-sickness-risk',
        label: 'Altitude Sickness Risk',
        type: 'checkbox',
        options: [{ label: 'Low (under 8k ft)', value: 'low-under-8k-ft' }, { label: 'Moderate (8k-10k ft)', value: 'moderate-8k-10k-ft' }, { label: 'High (10k-12k ft)', value: 'high-10k-12k-ft' }, { label: 'Very high (12k+ ft)', value: 'very-high-12k-ft' }],
      },
      {
        key: 'sleeping-capacity',
        label: 'Sleeping Capacity',
        type: 'checkbox',
        options: [{ label: '4-6 people', value: '4-6-people' }, { label: '6-10 people', value: '6-10-people' }, { label: '10-15 people', value: '10-15-people' }, { label: '15-20 people', value: '15-20-people' }, { label: '20+ (large hut)', value: '20-large-hut' }],
      },
      {
        key: 'sleeping-arrangement',
        label: 'Sleeping Arrangement',
        type: 'checkbox',
        options: [{ label: 'Bunks (mattress provided)', value: 'bunks-mattress-provided' }, { label: 'Loft (shared space)', value: 'loft-shared-space' }, { label: 'Floor mats (bring sleeping pad)', value: 'floor-mats-bring-sleeping-pad' }, { label: 'Shared platform (mattress provided)', value: 'shared-platform-mattress-provided' }],
      },
      {
        key: 'bedding-linens',
        label: 'Bedding / Linens',
        type: 'checkbox',
        options: [{ label: 'Blankets provided', value: 'blankets-provided' }, { label: 'Sleeping bag required', value: 'sleeping-bag-required' }, { label: 'Sleeping bag liner only', value: 'sleeping-bag-liner-only' }],
      },
      {
        key: 'reservations-required',
        label: 'Reservations Required',
        type: 'checkbox',
        options: [{ label: 'Yes (peak season)', value: 'yes-peak-season' }, { label: 'Yes (always, limited space)', value: 'yes-always-limited-space' }, { label: 'First come, first served (first-come)', value: 'first-come-first-served-first-come' }],
      },
      {
        key: 'booking-window',
        label: 'Booking Window',
        type: 'checkbox',
        options: [{ label: '6 months in advance', value: '6-months-in-advance' }, { label: '1 year in advance (popular)', value: '1-year-in-advance-popular' }, { label: 'Walk-up (rare)', value: 'walk-up-rare' }],
      },
      {
        key: 'caretaker-hut-master',
        label: 'Caretaker / Hut Master',
        type: 'checkbox',
        options: [{ label: 'Yes (lives on-site)', value: 'yes-lives-on-site' }, { label: 'Seasonal caretaker', value: 'seasonal-caretaker' }, { label: 'No caretaker (self-service)', value: 'no-caretaker-self-service' }],
      },
      {
        key: 'food-provided',
        label: 'Food Provided',
        type: 'checkbox',
        options: [{ label: 'Dinner + breakfast (included)', value: 'dinner-breakfast-included' }, { label: 'Snacks only (buy)', value: 'snacks-only-buy' }, { label: 'No food (bring your own)', value: 'no-food-bring-your-own' }],
      },
      {
        key: 'cooking-facilities',
        label: 'Cooking Facilities',
        type: 'checkbox',
        options: [{ label: 'Full kitchen (gas stove, pots)', value: 'full-kitchen-gas-stove-pots' }, { label: 'Wood stove (bring cookware)', value: 'wood-stove-bring-cookware' }, { label: 'No kitchen (cold food only)', value: 'no-kitchen-cold-food-only' }],
      },
      {
        key: 'water-source',
        label: 'Water Source',
        type: 'checkbox',
        options: [{ label: 'Stream (boil or filter)', value: 'stream-boil-or-filter' }, { label: 'Rain catchment (boil)', value: 'rain-catchment-boil' }, { label: 'Snow melt (boil)', value: 'snow-melt-boil' }, { label: 'Bring your own (no water at hut)', value: 'bring-your-own-no-water-at-hut' }],
      },
      {
        key: 'toilet',
        label: 'Toilet',
        type: 'checkbox',
        options: [{ label: 'Composting toilet', value: 'composting-toilet' }, { label: 'Outhouse (pit toilet)', value: 'outhouse-pit-toilet' }, { label: 'None (cat hole, pack out waste)', value: 'none-cat-hole-pack-out-waste' }],
      },
      {
        key: 'heat-source',
        label: 'Heat Source',
        type: 'checkbox',
        options: [{ label: 'Wood stove (firewood provided)', value: 'wood-stove-firewood-provided' }, { label: 'Propane heater', value: 'propane-heater' }, { label: 'No heat (dress warm)', value: 'no-heat-dress-warm' }],
      },
      {
        key: 'lighting',
        label: 'Lighting',
        type: 'checkbox',
        options: [{ label: 'Solar lights (dim)', value: 'solar-lights-dim' }, { label: 'Propane lanterns', value: 'propane-lanterns' }, { label: 'Headlamp required (no lights)', value: 'headlamp-required-no-lights' }],
      },
      {
        key: 'winter-conditions',
        label: 'Winter Conditions',
        type: 'checkbox',
        options: [{ label: 'Snow-covered (avalanche training recommended)', value: 'snow-covered-avalanche-training-recommended' }, { label: 'Extreme cold (-20°F possible)', value: 'extreme-cold-20-f-possible' }, { label: 'Ski/snowshoe only access', value: 'ski-snowshoe-only-access' }],
      },
      {
        key: 'summer-conditions',
        label: 'Summer Conditions',
        type: 'checkbox',
        options: [{ label: 'Wildflowers (gorgeous)', value: 'wildflowers-gorgeous' }, { label: 'Bugs (mosquitoes possible)', value: 'bugs-mosquitoes-possible' }, { label: 'Thunderstorms (afternoon)', value: 'thunderstorms-afternoon' }],
      },
      {
        key: 'cell-service',
        label: 'Cell Service',
        type: 'checkbox',
        options: [{ label: 'None (satellite communicator recommended)', value: 'none-satellite-communicator-recommended' }],
      },
      {
        key: 'emergency-communication',
        label: 'Emergency Communication',
        type: 'checkbox',
        options: [{ label: 'Satellite phone (for emergencies)', value: 'satellite-phone-for-emergencies' }, { label: 'VHF radio (contact ranger)', value: 'vhf-radio-contact-ranger' }, { label: 'No communication', value: 'no-communication' }],
      },
      {
        key: 'leave-no-trace',
        label: 'Leave No Trace',
        type: 'checkbox',
        options: [{ label: 'Pack it in, pack it out (trash)', value: 'pack-it-in-pack-it-out-trash' }, { label: 'Food storage (bear canister required)', value: 'food-storage-bear-canister-required' }],
      },
      {
        key: 'cost-per-night',
        label: 'Cost Per Night',
        type: 'checkbox',
        options: [{ label: '$30-50', value: '30-50' }, { label: '$50-75', value: '50-75' }, { label: '$75-100', value: '75-100' }, { label: '$100+ (popular huts)', value: '100-popular-huts' }],
      },
      {
        key: 'membership-required',
        label: 'Membership Required',
        type: 'checkbox',
        options: [{ label: 'Yes (hut association)', value: 'yes-hut-association' }, { label: 'No (public)', value: 'no-public' }],
      },
      {
        key: 'group-discount',
        label: 'Group Discount',
        type: 'checkbox',
        options: [{ label: 'Yes (10+ people)', value: 'yes-10-people' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'cancellation-policy',
        label: 'Cancellation Policy',
        type: 'checkbox',
        options: [{ label: 'Free up to 60 days', value: 'free-up-to-60-days' }, { label: '50% up to 30 days', value: '50-up-to-30-days' }, { label: 'No refund within 30 days', value: 'no-refund-within-30-days' }],
      },
      {
        key: 'what-to-bring',
        label: 'What to Bring',
        type: 'checkbox',
        options: [{ label: 'Sleeping bag (unless provided)', value: 'sleeping-bag-unless-provided' }, { label: 'Sleeping pad', value: 'sleeping-pad' }, { label: 'Headlamp', value: 'headlamp' }, { label: 'Food (unless provided)', value: 'food-unless-provided' }, { label: 'Water bottle / filter', value: 'water-bottle-filter' }, { label: 'Toilet paper', value: 'toilet-paper' }, { label: 'Earplugs (snorers)', value: 'earplugs-snorers' }, { label: 'Hut shoes (crocs, slippers)', value: 'hut-shoes-crocs-slippers' }],
      }
    ],
    'spas': [
      {
        key: 'spa-type',
        label: 'Spa Type',
        type: 'checkbox',
        options: [{ label: 'Day spa (no overnight)', value: 'day-spa-no-overnight' }, { label: 'Medical spa (clinical)', value: 'medical-spa-clinical' }, { label: 'Resort spa (hotel guests priority)', value: 'resort-spa-hotel-guests-priority' }, { label: 'Destination spa (multiple days)', value: 'destination-spa-multiple-days' }, { label: 'Holistic / wellness spa', value: 'holistic-wellness-spa' }, { label: 'Float spa (sensory deprivation)', value: 'float-spa-sensory-deprivation' }, { label: 'Salt cave / halotherapy', value: 'salt-cave-halotherapy' }, { label: 'Hammam (Turkish bath)', value: 'hammam-turkish-bath' }, { label: 'Onsen (Japanese hot spring)', value: 'onsen-japanese-hot-spring' }],
      },
      {
        key: 'services-offered',
        label: 'Services Offered',
        type: 'checkbox',
        options: [{ label: 'Massage (various types)', value: 'massage-various-types' }, { label: 'Facials', value: 'facials' }, { label: 'Body wraps', value: 'body-wraps' }, { label: 'Body scrubs', value: 'body-scrubs' }, { label: 'Hydrotherapy', value: 'hydrotherapy' }, { label: 'Sauna', value: 'sauna' }, { label: 'Steam room', value: 'steam-room' }, { label: 'Hot tub / jacuzzi', value: 'hot-tub-jacuzzi' }, { label: 'Cold plunge', value: 'cold-plunge' }, { label: 'Vichy shower', value: 'vichy-shower' }, { label: 'Couples suite (side-by-side)', value: 'couples-suite-side-by-side' }],
      },
      {
        key: 'massage-types',
        label: 'Massage Types',
        type: 'checkbox',
        options: [{ label: 'Swedish (relaxation)', value: 'swedish-relaxation' }, { label: 'Deep tissue', value: 'deep-tissue' }, { label: 'Sports massage', value: 'sports-massage' }, { label: 'Hot stone', value: 'hot-stone' }, { label: 'Prenatal', value: 'prenatal' }, { label: 'Couples massage', value: 'couples-massage' }, { label: 'Thai massage', value: 'thai-massage' }, { label: 'Shiatsu', value: 'shiatsu' }, { label: 'Reflexology (feet)', value: 'reflexology-feet' }, { label: 'Lymphatic drainage', value: 'lymphatic-drainage' }, { label: 'Trigger point', value: 'trigger-point' }, { label: 'Ashiatsu (walking on back)', value: 'ashiatsu-walking-on-back' }],
      },
      {
        key: 'facials-types',
        label: 'Facials Types',
        type: 'checkbox',
        options: [{ label: 'Classic (cleanse, exfoliate, mask)', value: 'classic-cleanse-exfoliate-mask' }, { label: 'Anti-aging', value: 'anti-aging' }, { label: 'Acne / clarifying', value: 'acne-clarifying' }, { label: 'Hydrating', value: 'hydrating' }, { label: 'Brightening', value: 'brightening' }, { label: 'Microdermabrasion', value: 'microdermabrasion' }, { label: 'Chemical peel (light)', value: 'chemical-peel-light' }, { label: 'LED light therapy', value: 'led-light-therapy' }, { label: 'Oxygen facial', value: 'oxygen-facial' }, { label: 'Hydrafacial (branded)', value: 'hydrafacial-branded' }],
      },
      {
        key: 'body-treatments',
        label: 'Body Treatments',
        type: 'checkbox',
        options: [{ label: 'Seaweed wrap', value: 'seaweed-wrap' }, { label: 'Mud wrap', value: 'mud-wrap' }, { label: 'Herbal wrap', value: 'herbal-wrap' }, { label: 'Sugar scrub', value: 'sugar-scrub' }, { label: 'Salt glow', value: 'salt-glow' }, { label: 'Coffee scrub', value: 'coffee-scrub' }, { label: 'Detox wrap', value: 'detox-wrap' }],
      },
      {
        key: 'spa-packages',
        label: 'Spa Packages',
        type: 'checkbox',
        options: [{ label: 'Half day (2-3 services)', value: 'half-day-2-3-services' }, { label: 'Full day (3-5 services + lunch)', value: 'full-day-3-5-services-lunch' }, { label: 'Bridal package', value: 'bridal-package' }, { label: 'Couples retreat', value: 'couples-retreat' }, { label: 'Girls\' day out', value: 'girls-day-out' }],
      },
      {
        key: 'price-range-per-service',
        label: 'Price Range per Service',
        type: 'checkbox',
        options: [{ label: 'Under $50 (express services)', value: 'under-50-express-services' }, { label: '$50-100', value: '50-100' }, { label: '$100-150', value: '100-150' }, { label: '$150-200', value: '150-200' }, { label: '$200-300', value: '200-300' }, { label: '$300+', value: '300' }],
      },
      {
        key: 'membership-monthly-subscription',
        label: 'Membership / Monthly Subscription',
        type: 'checkbox',
        options: [{ label: 'Yes (discounted services)', value: 'yes-discounted-services' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'gratuity',
        label: 'Gratuity',
        type: 'checkbox',
        options: [{ label: 'Not included (15-20% expected)', value: 'not-included-15-20-expected' }, { label: 'Included (service price + tip)', value: 'included-service-price-tip' }],
      },
      {
        key: 'spa-etiquette',
        label: 'Spa Etiquette',
        type: 'checkbox',
        options: [{ label: 'Robe and slippers provided', value: 'robe-and-slippers-provided' }, { label: 'Silence requested', value: 'silence-requested' }, { label: 'No phones (quiet zone)', value: 'no-phones-quiet-zone' }, { label: 'Arrive 15 min early', value: 'arrive-15-min-early' }],
      },
      {
        key: 'age-restriction',
        label: 'Age Restriction',
        type: 'checkbox',
        options: [{ label: '16+ (some services)', value: '16-some-services' }, { label: '18+ (massage)', value: '18-massage' }, { label: 'Family friendly (kids\' services)', value: 'family-friendly-kids-services' }],
      },
      {
        key: 'same-sex-therapists-available',
        label: 'Same-Sex Therapists Available',
        type: 'checkbox',
        options: [{ label: 'Request upon booking', value: 'request-upon-booking' }, { label: 'Guaranteed', value: 'guaranteed' }, { label: 'Not applicable (no preference)', value: 'not-applicable-no-preference' }],
      },
      {
        key: 'men-s-services',
        label: 'Men\'s Services',
        type: 'checkbox',
        options: [{ label: 'Men\'s facial', value: 'men-s-facial' }, { label: 'Men\'s massage', value: 'men-s-massage' }, { label: 'Not specifically (unisex)', value: 'not-specifically-unisex' }],
      },
      {
        key: 'group-bookings',
        label: 'Group Bookings',
        type: 'checkbox',
        options: [{ label: 'Bachelorette parties', value: 'bachelorette-parties' }, { label: 'Birthday groups', value: 'birthday-groups' }, { label: 'Corporate events', value: 'corporate-events' }, { label: 'Minimum group size: ___', value: 'minimum-group-size' }],
      },
      {
        key: 'private-rooms-for-groups',
        label: 'Private Rooms for Groups',
        type: 'checkbox',
        options: [{ label: 'Yes (reserved)', value: 'yes-reserved' }, { label: 'No (individual rooms)', value: 'no-individual-rooms' }],
      },
      {
        key: 'food-drink',
        label: 'Food / Drink',
        type: 'checkbox',
        options: [{ label: 'Light snacks (fruit, nuts)', value: 'light-snacks-fruit-nuts' }, { label: 'Champagne / mimosas (extra)', value: 'champagne-mimosas-extra' }, { label: 'Full lunch available', value: 'full-lunch-available' }, { label: 'No food (water only)', value: 'no-food-water-only' }],
      },
      {
        key: 'spa-products-for-sale',
        label: 'Spa Products for Sale',
        type: 'checkbox',
        options: [{ label: 'Skincare line', value: 'skincare-line' }, { label: 'Candles', value: 'candles' }, { label: 'Bath salts', value: 'bath-salts' }, { label: 'No retail', value: 'no-retail' }],
      },
      {
        key: 'online-booking',
        label: 'Online Booking',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (call only)', value: 'no-call-only' }],
      },
      {
        key: 'cancellation-no-show',
        label: 'Cancellation / No-Show',
        type: 'checkbox',
        options: [{ label: '24 hours (no charge)', value: '24-hours-no-charge' }, { label: '12 hours (50% charge)', value: '12-hours-50-charge' }, { label: 'No-show (100% charge)', value: 'no-show-100-charge' }],
      },
      {
        key: 'membership-required',
        label: 'Membership Required',
        type: 'checkbox',
        options: [{ label: 'No (public)', value: 'no-public' }, { label: 'Yes (private spa)', value: 'yes-private-spa' }],
      }
    ],
    'hair-salon': [
      {
        key: 'salon-type',
        label: 'Salon Type',
        type: 'checkbox',
        options: [{ label: 'Full-service salon (cut, color, style)', value: 'full-service-salon-cut-color-style' }, { label: 'Barber shop (men\'s cuts, straight razor)', value: 'barber-shop-men-s-cuts-straight-razor' }, { label: 'Blow-dry bar (styles only, no cuts)', value: 'blow-dry-bar-styles-only-no-cuts' }, { label: 'Walk-in salon (no appointment needed)', value: 'walk-in-salon-no-appointment-needed' }, { label: 'Ethnic hair specialist (curly, coily)', value: 'ethnic-hair-specialist-curly-coily' }, { label: 'Eco-friendly / organic salon', value: 'eco-friendly-organic-salon' }, { label: 'High-end / luxury salon', value: 'high-end-luxury-salon' }],
      },
      {
        key: 'hair-services',
        label: 'Hair Services',
        type: 'checkbox',
        options: [{ label: 'Haircut (women\'s)', value: 'haircut-women-s' }, { label: 'Haircut (men\'s)', value: 'haircut-men-s' }, { label: 'Kids haircut', value: 'kids-haircut' }, { label: 'Color (all over)', value: 'color-all-over' }, { label: 'Highlights', value: 'highlights' }, { label: 'Balayage', value: 'balayage' }, { label: 'Ombre', value: 'ombre' }, { label: 'Color correction (complex)', value: 'color-correction-complex' }, { label: 'Perm', value: 'perm' }, { label: 'Relaxer', value: 'relaxer' }, { label: 'Keratin treatment', value: 'keratin-treatment' }, { label: 'Brazilian blowout', value: 'brazilian-blowout' }, { label: 'Extensions (tape-in, sew-in, fusion)', value: 'extensions-tape-in-sew-in-fusion' }, { label: 'Wig styling / installation', value: 'wig-styling-installation' }, { label: 'Updo (formal)', value: 'updo-formal' }, { label: 'Blowout (style only)', value: 'blowout-style-only' }],
      },
      {
        key: 'price-range-women-s-cut',
        label: 'Price Range - Women\'s Cut',
        type: 'checkbox',
        options: [{ label: 'Under $30', value: 'under-30' }, { label: '$30-50', value: '30-50' }, { label: '$50-75', value: '50-75' }, { label: '$75-100', value: '75-100' }, { label: '$100-150', value: '100-150' }, { label: '$150+', value: '150' }],
      },
      {
        key: 'price-range-men-s-cut',
        label: 'Price Range - Men\'s Cut',
        type: 'checkbox',
        options: [{ label: 'Under $20', value: 'under-20' }, { label: '$20-35', value: '20-35' }, { label: '$35-50', value: '35-50' }, { label: '$50-75', value: '50-75' }, { label: '$75+', value: '75' }],
      },
      {
        key: 'price-range-color-full',
        label: 'Price Range - Color (Full)',
        type: 'checkbox',
        options: [{ label: 'Under $75', value: 'under-75' }, { label: '$75-125', value: '75-125' }, { label: '$125-175', value: '125-175' }, { label: '$175-250', value: '175-250' }, { label: '$250-350', value: '250-350' }, { label: '$350+', value: '350' }],
      },
      {
        key: 'price-range-balayage',
        label: 'Price Range - Balayage',
        type: 'checkbox',
        options: [{ label: '$100-150', value: '100-150' }, { label: '$150-200', value: '150-200' }, { label: '$200-300', value: '200-300' }, { label: '$300-400', value: '300-400' }, { label: '$400+', value: '400' }],
      },
      {
        key: 'stylist-experience-level',
        label: 'Stylist Experience Level',
        type: 'checkbox',
        options: [{ label: 'Junior / apprentice (lower rate)', value: 'junior-apprentice-lower-rate' }, { label: 'Senior stylist', value: 'senior-stylist' }, { label: 'Master stylist', value: 'master-stylist' }, { label: 'Creative director (highest rate)', value: 'creative-director-highest-rate' }, { label: 'Owner / educator', value: 'owner-educator' }],
      },
      {
        key: 'consultation-included',
        label: 'Consultation Included',
        type: 'checkbox',
        options: [{ label: 'Yes (free, 10-15 min)', value: 'yes-free-10-15-min' }, { label: 'Yes (fee applies)', value: 'yes-fee-applies' }, { label: 'Not offered (just do it)', value: 'not-offered-just-do-it' }],
      },
      {
        key: 'patch-test-required-color',
        label: 'Patch Test Required (color)',
        type: 'checkbox',
        options: [{ label: 'Yes (48 hours prior)', value: 'yes-48-hours-prior' }, { label: 'No (waiver signed)', value: 'no-waiver-signed' }],
      },
      {
        key: 'product-line-used',
        label: 'Product Line Used',
        type: 'checkbox',
        options: [{ label: 'Redken', value: 'redken' }, { label: 'Aveda', value: 'aveda' }, { label: 'Pureology', value: 'pureology' }, { label: 'Kevin Murphy', value: 'kevin-murphy' }, { label: 'Olaplex (bond repair)', value: 'olaplex-bond-repair' }, { label: 'Oribe', value: 'oribe' }, { label: 'Davines', value: 'davines' }, { label: 'Innersense (clean beauty)', value: 'innersense-clean-beauty' }, { label: 'Brand not disclosed', value: 'brand-not-disclosed' }],
      },
      {
        key: 'walk-ins',
        label: 'Walk-ins',
        type: 'checkbox',
        options: [{ label: 'Welcome', value: 'welcome' }, { label: 'Limited (call ahead)', value: 'limited-call-ahead' }, { label: 'Not accepted (appointment only)', value: 'not-accepted-appointment-only' }],
      },
      {
        key: 'wait-time-for-appointment',
        label: 'Wait Time for Appointment',
        type: 'checkbox',
        options: [{ label: 'Same day (call early)', value: 'same-day-call-early' }, { label: '1-3 days', value: '1-3-days' }, { label: '1 week', value: '1-week' }, { label: '2-3 weeks', value: '2-3-weeks' }, { label: '1+ month (popular stylist)', value: '1-month-popular-stylist' }],
      },
      {
        key: 'online-check-in',
        label: 'Online Check-In',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'text-reminders',
        label: 'Text Reminders',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'children-s-haircuts',
        label: 'Children\'s Haircuts',
        type: 'checkbox',
        options: [{ label: 'Yes (under 12)', value: 'yes-under-12' }, { label: 'No (adults only)', value: 'no-adults-only' }],
      },
      {
        key: 'sensory-friendly-hours',
        label: 'Sensory Friendly Hours',
        type: 'checkbox',
        options: [{ label: 'Lower noise, no blow-dryers', value: 'lower-noise-no-blow-dryers' }, { label: 'Specific appointment times', value: 'specific-appointment-times' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'mobility-accommodations',
        label: 'Mobility Accommodations',
        type: 'checkbox',
        options: [{ label: 'Chair lifts available', value: 'chair-lifts-available' }, { label: 'Ground floor access', value: 'ground-floor-access' }, { label: 'No stairs', value: 'no-stairs' }],
      },
      {
        key: 'dry-cutting-available',
        label: 'Dry Cutting Available',
        type: 'checkbox',
        options: [{ label: 'Yes (curl specialist)', value: 'yes-curl-specialist' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'eco-sustainability',
        label: 'Eco / Sustainability',
        type: 'checkbox',
        options: [{ label: 'Recycling (foils, color tubes)', value: 'recycling-foils-color-tubes' }, { label: 'Renewable energy', value: 'renewable-energy' }, { label: 'Low-flow water', value: 'low-flow-water' }, { label: 'Not a focus', value: 'not-a-focus' }],
      },
      {
        key: 'wheelchair-access',
        label: 'Wheelchair Access',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (steps)', value: 'no-steps' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Free lot', value: 'free-lot' }, { label: 'Street (metered)', value: 'street-metered' }, { label: 'Validation for garage', value: 'validation-for-garage' }],
      },
      {
        key: 'late-cancellation-fee',
        label: 'Late Cancellation Fee',
        type: 'checkbox',
        options: [{ label: '24 hours (free)', value: '24-hours-free' }, { label: 'Less than 24 hours (50% of service)', value: 'less-than-24-hours-50-of-service' }, { label: 'No-show (100%)', value: 'no-show-100' }],
      },
      {
        key: 'tipping',
        label: 'Tipping',
        type: 'checkbox',
        options: [{ label: 'Cash preferred', value: 'cash-preferred' }, { label: 'Added to card', value: 'added-to-card' }, { label: '15-20% standard', value: '15-20-standard' }],
      }
    ],
    'nail-salon': [
      {
        key: 'salon-type',
        label: 'Salon Type',
        type: 'checkbox',
        options: [{ label: 'Standard nail salon (walk-in friendly)', value: 'standard-nail-salon-walk-in-friendly' }, { label: 'High-end nail studio (appointment only)', value: 'high-end-nail-studio-appointment-only' }, { label: 'Organic / non-toxic salon (5-free, 10-free)', value: 'organic-non-toxic-salon-5-free-10-free' }, { label: 'Nail bar (express, limited services)', value: 'nail-bar-express-limited-services' }, { label: 'Mobile nail service (at home/event)', value: 'mobile-nail-service-at-home-event' }],
      },
      {
        key: 'services',
        label: 'Services',
        type: 'checkbox',
        options: [{ label: 'Manicure (basic)', value: 'manicure-basic' }, { label: 'Pedicure (basic)', value: 'pedicure-basic' }, { label: 'Gel manicure (UV cured)', value: 'gel-manicure-uv-cured' }, { label: 'Dip powder (SNS)', value: 'dip-powder-sns' }, { label: 'Acrylic full set', value: 'acrylic-full-set' }, { label: 'Acrylic fill', value: 'acrylic-fill' }, { label: 'Hard gel (builder gel)', value: 'hard-gel-builder-gel' }, { label: 'Polygel', value: 'polygel' }, { label: 'Nail art (hand painted)', value: 'nail-art-hand-painted' }, { label: 'Nail art (stickers/stamping)', value: 'nail-art-stickers-stamping' }, { label: 'Paraffin wax treatment', value: 'paraffin-wax-treatment' }, { label: 'Nail repair (broken nail)', value: 'nail-repair-broken-nail' }, { label: 'Removal (acrylic/gel)', value: 'removal-acrylic-gel' }],
      },
      {
        key: 'manicure-price',
        label: 'Manicure Price',
        type: 'checkbox',
        options: [{ label: 'Under $15', value: 'under-15' }, { label: '$15-25', value: '15-25' }, { label: '$25-35', value: '25-35' }, { label: '$35-50', value: '35-50' }, { label: '$50+ (spa manicure)', value: '50-spa-manicure' }],
      },
      {
        key: 'pedicure-price',
        label: 'Pedicure Price',
        type: 'checkbox',
        options: [{ label: 'Under $25', value: 'under-25' }, { label: '$25-40', value: '25-40' }, { label: '$40-60', value: '40-60' }, { label: '$60-80', value: '60-80' }, { label: '$80+ (luxury pedicure)', value: '80-luxury-pedicure' }],
      },
      {
        key: 'gel-dip-price',
        label: 'Gel / Dip Price',
        type: 'checkbox',
        options: [{ label: '$30-40', value: '30-40' }, { label: '$40-55', value: '40-55' }, { label: '$55-70', value: '55-70' }, { label: '$70+', value: '70' }],
      },
      {
        key: 'acrylic-full-set',
        label: 'Acrylic Full Set',
        type: 'checkbox',
        options: [{ label: '$30-45', value: '30-45' }, { label: '$45-60', value: '45-60' }, { label: '$60-80', value: '60-80' }, { label: '$80+', value: '80' }],
      },
      {
        key: 'nail-art-per-nail',
        label: 'Nail Art (per nail)',
        type: 'checkbox',
        options: [{ label: '$1-3 (simple)', value: '1-3-simple' }, { label: '$3-5 (detailed)', value: '3-5-detailed' }, { label: '$5-10 (3D, charms)', value: '5-10-3d-charms' }, { label: '$10+ (hand painted portrait)', value: '10-hand-painted-portrait' }],
      },
      {
        key: 'express-service-available',
        label: 'Express Service Available',
        type: 'checkbox',
        options: [{ label: 'Yes (15 min manicure)', value: 'yes-15-min-manicure' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'spa-pedicure-features',
        label: 'Spa Pedicure Features',
        type: 'checkbox',
        options: [{ label: 'Massage chair', value: 'massage-chair' }, { label: 'Hot stones', value: 'hot-stones' }, { label: 'Sugar scrub', value: 'sugar-scrub' }, { label: 'Mask', value: 'mask' }, { label: 'Paraffin dip', value: 'paraffin-dip' }, { label: 'Longer massage', value: 'longer-massage' }],
      },
      {
        key: 'polish-brands',
        label: 'Polish Brands',
        type: 'checkbox',
        options: [{ label: 'OPI', value: 'opi' }, { label: 'Essie', value: 'essie' }, { label: 'CND Shellac', value: 'cnd-shellac' }, { label: 'Dior', value: 'dior' }, { label: 'Chanel', value: 'chanel' }, { label: 'Zoya (non-toxic)', value: 'zoya-non-toxic' }, { label: 'Butter London', value: 'butter-london' }, { label: 'Non-branded', value: 'non-branded' }],
      },
      {
        key: 'cleanliness-sanitation',
        label: 'Cleanliness / Sanitation',
        type: 'checkbox',
        options: [{ label: 'Autoclave (sterilized metal tools)', value: 'autoclave-sterilized-metal-tools' }, { label: 'Disposable files/buffers', value: 'disposable-files-buffers' }, { label: 'Foot basins cleaned between clients', value: 'foot-basins-cleaned-between-clients' }, { label: 'Visible sanitation station', value: 'visible-sanitation-station' }],
      },
      {
        key: 'walk-ins',
        label: 'Walk-ins',
        type: 'checkbox',
        options: [{ label: 'Welcome', value: 'welcome' }, { label: 'Limited (weekends)', value: 'limited-weekends' }, { label: 'Appointment only', value: 'appointment-only' }],
      },
      {
        key: 'group-bookings',
        label: 'Group Bookings',
        type: 'checkbox',
        options: [{ label: 'Bachelorette parties', value: 'bachelorette-parties' }, { label: 'Birthday parties (young teens)', value: 'birthday-parties-young-teens' }, { label: 'Minimum 4 people', value: 'minimum-4-people' }],
      },
      {
        key: 'private-room-for-groups',
        label: 'Private Room for Groups',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'under-18-policy',
        label: 'Under 18 Policy',
        type: 'checkbox',
        options: [{ label: 'Parent must sign', value: 'parent-must-sign' }, { label: 'Parent must be present', value: 'parent-must-be-present' }, { label: 'No age restriction', value: 'no-age-restriction' }],
      },
      {
        key: 'men-s-services',
        label: 'Men\'s Services',
        type: 'checkbox',
        options: [{ label: 'Manicure (men\'s cuticle trim)', value: 'manicure-men-s-cuticle-trim' }, { label: 'Pedicure (men\'s)', value: 'pedicure-men-s' }, { label: 'Not offered (unisex)', value: 'not-offered-unisex' }],
      },
      {
        key: 'nail-repair-for-broken-nail',
        label: 'Nail Repair for Broken Nail',
        type: 'checkbox',
        options: [{ label: 'Yes (walk-in)', value: 'yes-walk-in' }, { label: 'Yes (by appointment)', value: 'yes-by-appointment' }, { label: 'Not offered (replacement only)', value: 'not-offered-replacement-only' }],
      },
      {
        key: 'toe-nail-fungus-treatment',
        label: 'Toe Nail Fungus Treatment',
        type: 'checkbox',
        options: [{ label: 'Not offered (medical issue)', value: 'not-offered-medical-issue' }, { label: 'Referral to podiatrist', value: 'referral-to-podiatrist' }],
      },
      {
        key: 'membership-monthly-plan',
        label: 'Membership / Monthly Plan',
        type: 'checkbox',
        options: [{ label: 'Yes (1 service per month)', value: 'yes-1-service-per-month' }, { label: 'Punch card (buy 5 get 1 free)', value: 'punch-card-buy-5-get-1-free' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'online-booking',
        label: 'Online Booking',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (call or walk-in)', value: 'no-call-or-walk-in' }],
      },
      {
        key: 'tipping',
        label: 'Tipping',
        type: 'checkbox',
        options: [{ label: '15-20% standard', value: '15-20-standard' }, { label: 'Cash preferred', value: 'cash-preferred' }, { label: 'Can add to card', value: 'can-add-to-card' }],
      },
      {
        key: 'language-if-non-english',
        label: 'Language (if non-English)',
        type: 'checkbox',
        options: [{ label: 'Vietnamese (common in US)', value: 'vietnamese-common-in-us' }, { label: 'Chinese', value: 'chinese' }, { label: 'Korean', value: 'korean' }, { label: 'English fluent', value: 'english-fluent' }],
      },
      {
        key: 'late-policy',
        label: 'Late Policy',
        type: 'checkbox',
        options: [{ label: '10+ min late (may reschedule)', value: '10-min-late-may-reschedule' }, { label: '15+ min (considered no-show)', value: '15-min-considered-no-show' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: '24 hours (free)', value: '24-hours-free' }, { label: '12 hours (50%)', value: '12-hours-50' }, { label: 'No-show (100%)', value: 'no-show-100' }],
      }
    ],
    'tanning': [
      {
        key: 'tanning-type',
        label: 'Tanning Type',
        type: 'checkbox',
        options: [{ label: 'UV tanning bed', value: 'uv-tanning-bed' }, { label: 'Spray tan (airbrush)', value: 'spray-tan-airbrush' }, { label: 'Self-tanning booth (automated)', value: 'self-tanning-booth-automated' }, { label: 'Sunless mist (walk-in booth)', value: 'sunless-mist-walk-in-booth' }, { label: 'Tanning lotion (retail only)', value: 'tanning-lotion-retail-only' }],
      },
      {
        key: 'uv-bed-levels',
        label: 'UV Bed Levels',
        type: 'checkbox',
        options: [{ label: 'Level 1 (low pressure, base tan)', value: 'level-1-low-pressure-base-tan' }, { label: 'Level 2 (medium pressure)', value: 'level-2-medium-pressure' }, { label: 'Level 3 (high pressure, faster)', value: 'level-3-high-pressure-faster' }, { label: 'Level 4 (premium, less UVB)', value: 'level-4-premium-less-uvb' }, { label: 'Stand-up booth (no lying down)', value: 'stand-up-booth-no-lying-down' }],
      },
      {
        key: 'spray-tan-solution-types',
        label: 'Spray Tan Solution Types',
        type: 'checkbox',
        options: [{ label: 'Clear (no guide color)', value: 'clear-no-guide-color' }, { label: 'Bronzer (immediate color, washes off)', value: 'bronzer-immediate-color-washes-off' }, { label: 'Organic / DHA-derived', value: 'organic-dha-derived' }, { label: 'Vegan', value: 'vegan' }, { label: 'Hypoallergenic', value: 'hypoallergenic' }, { label: 'Custom blend', value: 'custom-blend' }],
      },
      {
        key: 'spray-tan-result-shade',
        label: 'Spray Tan Result Shade',
        type: 'checkbox',
        options: [{ label: 'Light (natural glow)', value: 'light-natural-glow' }, { label: 'Medium (beach tan)', value: 'medium-beach-tan' }, { label: 'Dark (vacation look)', value: 'dark-vacation-look' }, { label: 'Ultra dark (competition tan)', value: 'ultra-dark-competition-tan' }],
      },
      {
        key: 'session-duration',
        label: 'Session Duration',
        type: 'checkbox',
        options: [{ label: '5-7 minutes (UV level 1-2)', value: '5-7-minutes-uv-level-1-2' }, { label: '7-10 minutes (UV level 3)', value: '7-10-minutes-uv-level-3' }, { label: '10-12 minutes (UV level 4)', value: '10-12-minutes-uv-level-4' }, { label: 'Spray tan (10-15 minutes total)', value: 'spray-tan-10-15-minutes-total' }],
      },
      {
        key: 'package-pricing',
        label: 'Package Pricing',
        type: 'checkbox',
        options: [{ label: 'Single session', value: 'single-session' }, { label: '5 session pack', value: '5-session-pack' }, { label: '10 session pack', value: '10-session-pack' }, { label: 'Monthly unlimited (UV)', value: 'monthly-unlimited-uv' }, { label: 'Monthly membership (auto-renew)', value: 'monthly-membership-auto-renew' }],
      },
      {
        key: 'price-per-uv-session',
        label: 'Price per UV Session',
        type: 'checkbox',
        options: [{ label: 'Under $5', value: 'under-5' }, { label: '$5-10', value: '5-10' }, { label: '$10-15', value: '10-15' }, { label: '$15-20', value: '15-20' }, { label: '$20+', value: '20' }],
      },
      {
        key: 'price-per-spray-tan',
        label: 'Price per Spray Tan',
        type: 'checkbox',
        options: [{ label: 'Under $20', value: 'under-20' }, { label: '$20-30', value: '20-30' }, { label: '$30-40', value: '30-40' }, { label: '$40-50', value: '40-50' }, { label: '$50+', value: '50' }],
      },
      {
        key: 'eye-protection',
        label: 'Eye Protection',
        type: 'checkbox',
        options: [{ label: 'Provided (free)', value: 'provided-free' }, { label: 'Required (no exceptions)', value: 'required-no-exceptions' }, { label: 'Buy for $___', value: 'buy-for' }],
      },
      {
        key: 'lotion-required-uv-tanning',
        label: 'Lotion Required (UV tanning)',
        type: 'checkbox',
        options: [{ label: 'Recommended (accelerator)', value: 'recommended-accelerator' }, { label: 'Required (no dry skin)', value: 'required-no-dry-skin' }, { label: 'Not mentioned', value: 'not-mentioned' }],
      },
      {
        key: 'lotion-for-sale',
        label: 'Lotion for Sale',
        type: 'checkbox',
        options: [{ label: 'Yes (brands: Australian Gold, Swedish Beauty, Designer Skin)', value: 'yes-brands-australian-gold-swedish-beauty-designer-skin' }],
      },
      {
        key: 'age-restriction',
        label: 'Age Restriction',
        type: 'checkbox',
        options: [{ label: 'Under 18 prohibited (some states)', value: 'under-18-prohibited-some-states' }, { label: '16+ with parent (where legal)', value: '16-with-parent-where-legal' }, { label: '18+ without parent', value: '18-without-parent' }],
      },
      {
        key: 'warning-signage-cancer-risk',
        label: 'Warning Signage (cancer risk)',
        type: 'checkbox',
        options: [{ label: 'Posted (by law)', value: 'posted-by-law' }, { label: 'Verbally explained', value: 'verbally-explained' }, { label: 'Waiver signed', value: 'waiver-signed' }],
      },
      {
        key: 'fda-compliance',
        label: 'FDA Compliance',
        type: 'checkbox',
        options: [{ label: 'Timer on bed', value: 'timer-on-bed' }, { label: 'Maximum session time enforced', value: 'maximum-session-time-enforced' }, { label: 'Emergency shut-off', value: 'emergency-shut-off' }],
      },
      {
        key: 'cleanliness',
        label: 'Cleanliness',
        type: 'checkbox',
        options: [{ label: 'Beds cleaned after each use', value: 'beds-cleaned-after-each-use' }, { label: 'Towels provided', value: 'towels-provided' }, { label: 'Disposable face covers', value: 'disposable-face-covers' }],
      },
      {
        key: 'private-room',
        label: 'Private Room',
        type: 'checkbox',
        options: [{ label: 'Yes (lockable)', value: 'yes-lockable' }, { label: 'No (curtain only)', value: 'no-curtain-only' }],
      },
      {
        key: 'airbrush-technician',
        label: 'Airbrush Technician',
        type: 'checkbox',
        options: [{ label: 'Professional spray (handheld)', value: 'professional-spray-handheld' }, { label: 'No (automated booth only)', value: 'no-automated-booth-only' }],
      },
      {
        key: 'custom-contour-spray',
        label: 'Custom Contour Spray',
        type: 'checkbox',
        options: [{ label: 'Yes (muscle definition)', value: 'yes-muscle-definition' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'mobile-spray-tan-they-come-to-you',
        label: 'Mobile Spray Tan (they come to you)',
        type: 'checkbox',
        options: [{ label: 'Yes (fee for travel)', value: 'yes-fee-for-travel' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'wedding-event-packages',
        label: 'Wedding / Event Packages',
        type: 'checkbox',
        options: [{ label: 'Bridal party group rates', value: 'bridal-party-group-rates' }, { label: 'Pre-event tan (recommended 2 days prior)', value: 'pre-event-tan-recommended-2-days-prior' }],
      },
      {
        key: 'patch-test',
        label: 'Patch Test',
        type: 'checkbox',
        options: [{ label: 'Available (spray tan)', value: 'available-spray-tan' }, { label: 'Not needed (UV)', value: 'not-needed-uv' }],
      },
      {
        key: 'cancellation-policy-spray-tan',
        label: 'Cancellation Policy (spray tan)',
        type: 'checkbox',
        options: [{ label: '24 hours (free)', value: '24-hours-free' }, { label: '4 hours (50%)', value: '4-hours-50' }, { label: 'No-show (100%)', value: 'no-show-100' }],
      },
      {
        key: 'pre-tan-instructions-provided',
        label: 'Pre-Tan Instructions Provided',
        type: 'checkbox',
        options: [{ label: 'Exfoliate night before', value: 'exfoliate-night-before' }, { label: 'No lotion / deodorant day of', value: 'no-lotion-deodorant-day-of' }, { label: 'Lose clothing afterward', value: 'lose-clothing-afterward' }],
      }
    ],
    'skin-care': [
      {
        key: 'clinic-type',
        label: 'Clinic Type',
        type: 'checkbox',
        options: [{ label: 'Medical dermatology (acne, rosacea, etc.)', value: 'medical-dermatology-acne-rosacea-etc' }, { label: 'Cosmetic dermatology (Botox, filler)', value: 'cosmetic-dermatology-botox-filler' }, { label: 'Medispa (esthetician-led)', value: 'medispa-esthetician-led' }, { label: 'Holistic / natural skin care', value: 'holistic-natural-skin-care' }, { label: 'Acne specialty clinic', value: 'acne-specialty-clinic' }, { label: 'Anti-aging clinic', value: 'anti-aging-clinic' }],
      },
      {
        key: 'services',
        label: 'Services',
        type: 'checkbox',
        options: [{ label: 'Facials (custom)', value: 'facials-custom' }, { label: 'Chemical peel (light to deep)', value: 'chemical-peel-light-to-deep' }, { label: 'Microdermabrasion', value: 'microdermabrasion' }, { label: 'Microneedling', value: 'microneedling' }, { label: 'PRP (vampire facial)', value: 'prp-vampire-facial' }, { label: 'Laser resurfacing (ablative/non)', value: 'laser-resurfacing-ablative-non' }, { label: 'IPL (photofacial)', value: 'ipl-photofacial' }, { label: 'RF microneedling (Morpheus)', value: 'rf-microneedling-morpheus' }, { label: 'LED light therapy', value: 'led-light-therapy' }, { label: 'High-frequency treatment', value: 'high-frequency-treatment' }, { label: 'Extractions (deep pore cleaning)', value: 'extractions-deep-pore-cleaning' }, { label: 'Hydrafacial (branded)', value: 'hydrafacial-branded' }],
      },
      {
        key: 'prescription-services',
        label: 'Prescription Services',
        type: 'checkbox',
        options: [{ label: 'Retin-A / tretinoin', value: 'retin-a-tretinoin' }, { label: 'Topical antibiotics', value: 'topical-antibiotics' }, { label: 'Spironolactone (hormonal acne)', value: 'spironolactone-hormonal-acne' }, { label: 'Accutane (isotretinoin - requires bloodwork)', value: 'accutane-isotretinoin-requires-bloodwork' }],
      },
      {
        key: 'injectables-if-offered',
        label: 'Injectables (if offered)',
        type: 'checkbox',
        options: [{ label: 'Botox / Dysport / Xeomin', value: 'botox-dysport-xeomin' }, { label: 'Juvederm (filler)', value: 'juvederm-filler' }, { label: 'Restylane', value: 'restylane' }, { label: 'Sculptra (collagen stimulator)', value: 'sculptra-collagen-stimulator' }, { label: 'Kybella (chin fat)', value: 'kybella-chin-fat' }],
      },
      {
        key: 'price-custom-facial',
        label: 'Price - Custom Facial',
        type: 'checkbox',
        options: [{ label: 'Under $75', value: 'under-75' }, { label: '$75-125', value: '75-125' }, { label: '$125-175', value: '125-175' }, { label: '$175-250', value: '175-250' }, { label: '$250+', value: '250' }],
      },
      {
        key: 'price-chemical-peel',
        label: 'Price - Chemical Peel',
        type: 'checkbox',
        options: [{ label: 'Light ($100-200)', value: 'light-100-200' }, { label: 'Medium ($200-400)', value: 'medium-200-400' }, { label: 'Deep ($400-800+)', value: 'deep-400-800' }],
      },
      {
        key: 'price-microneedling',
        label: 'Price - Microneedling',
        type: 'checkbox',
        options: [{ label: '$200-400', value: '200-400' }, { label: '$400-600', value: '400-600' }, { label: '$600-800', value: '600-800' }, { label: '$800+ (with PRP)', value: '800-with-prp' }],
      },
      {
        key: 'price-botox-per-unit',
        label: 'Price - Botox (per unit)',
        type: 'checkbox',
        options: [{ label: '$8-10', value: '8-10' }, { label: '$10-12', value: '10-12' }, { label: '$12-15', value: '12-15' }, { label: '$15+', value: '15' }],
      },
      {
        key: 'price-filler-per-syringe',
        label: 'Price - Filler (per syringe)',
        type: 'checkbox',
        options: [{ label: '$400-500', value: '400-500' }, { label: '$500-600', value: '500-600' }, { label: '$600-700', value: '600-700' }, { label: '$700+', value: '700' }],
      },
      {
        key: 'consultation-fee',
        label: 'Consultation Fee',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: '$50-100 (applied to treatment)', value: '50-100-applied-to-treatment' }, { label: '$100-150 (no treatment)', value: '100-150-no-treatment' }],
      },
      {
        key: 'provider-type',
        label: 'Provider Type',
        type: 'checkbox',
        options: [{ label: 'Dermatologist (MD)', value: 'dermatologist-md' }, { label: 'Nurse practitioner (NP)', value: 'nurse-practitioner-np' }, { label: 'Physician assistant (PA)', value: 'physician-assistant-pa' }, { label: 'Licensed esthetician', value: 'licensed-esthetician' }, { label: 'Nurse injector', value: 'nurse-injector' }],
      },
      {
        key: 'years-of-experience',
        label: 'Years of Experience',
        type: 'checkbox',
        options: [{ label: 'Under 2 years', value: 'under-2-years' }, { label: '3-5 years', value: '3-5-years' }, { label: '5-10 years', value: '5-10-years' }, { label: '10-20 years', value: '10-20-years' }, { label: '20+ years', value: '20-years' }],
      },
      {
        key: 'before-after-photos-available',
        label: 'Before / After Photos Available',
        type: 'checkbox',
        options: [{ label: 'Yes (portfolio)', value: 'yes-portfolio' }, { label: 'No (privacy)', value: 'no-privacy' }],
      },
      {
        key: 'medical-grade-skincare-products-for-sale',
        label: 'Medical Grade Skincare Products for Sale',
        type: 'checkbox',
        options: [{ label: 'SkinMedica', value: 'skinmedica' }, { label: 'SkinCeuticals', value: 'skinceuticals' }, { label: 'ZO Skin Health', value: 'zo-skin-health' }, { label: 'Obagi', value: 'obagi' }, { label: 'EltaMD (sunscreen)', value: 'eltamd-sunscreen' }, { label: 'La Roche-Posay', value: 'la-roche-posay' }, { label: 'CeraVe (basic)', value: 'cerave-basic' }],
      },
      {
        key: 'insurance-accepted-medical-dermatology',
        label: 'Insurance Accepted (medical dermatology)',
        type: 'checkbox',
        options: [{ label: 'Yes (acne, rosacea, eczema)', value: 'yes-acne-rosacea-eczema' }, { label: 'No (cosmetic only)', value: 'no-cosmetic-only' }],
      },
      {
        key: 'payment-plans-financing',
        label: 'Payment Plans / Financing',
        type: 'checkbox',
        options: [{ label: 'CareCredit', value: 'carecredit' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'online-store',
        label: 'Online Store',
        type: 'checkbox',
        options: [{ label: 'Yes (products shipped)', value: 'yes-products-shipped' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'virtual-consultation',
        label: 'Virtual Consultation',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'patch-test-for-peels-products',
        label: 'Patch Test for Peels / Products',
        type: 'checkbox',
        options: [{ label: 'Yes (48 hours prior)', value: 'yes-48-hours-prior' }, { label: 'No (visual assessment only)', value: 'no-visual-assessment-only' }],
      },
      {
        key: 'downtime-after-treatment',
        label: 'Downtime After Treatment',
        type: 'checkbox',
        options: [{ label: 'None (hydrafacial, light peel)', value: 'none-hydrafacial-light-peel' }, { label: '1-3 days (medium peel, microneedling)', value: '1-3-days-medium-peel-microneedling' }, { label: '5-7 days (deep peel, laser)', value: '5-7-days-deep-peel-laser' }, { label: '1-2 weeks (ablative laser)', value: '1-2-weeks-ablative-laser' }],
      },
      {
        key: 'sun-protection-advice',
        label: 'Sun Protection Advice',
        type: 'checkbox',
        options: [{ label: 'SPF 30+ daily', value: 'spf-30-daily' }, { label: 'Avoid sun for ___ days after treatment', value: 'avoid-sun-for-days-after-treatment' }],
      },
      {
        key: 'cancellation-no-show',
        label: 'Cancellation / No-Show',
        type: 'checkbox',
        options: [{ label: '24 hours (free)', value: '24-hours-free' }, { label: '12 hours (50%)', value: '12-hours-50' }, { label: 'No-show (100% of service)', value: 'no-show-100-of-service' }],
      },
      {
        key: 'membership-subscription',
        label: 'Membership / Subscription',
        type: 'checkbox',
        options: [{ label: 'Monthly facial plan', value: 'monthly-facial-plan' }, { label: 'Discount on products', value: 'discount-on-products' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'private-treatment-room',
        label: 'Private Treatment Room',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (open concept)', value: 'no-open-concept' }],
      },
      {
        key: 'gender-preference-for-provider',
        label: 'Gender Preference for Provider',
        type: 'checkbox',
        options: [{ label: 'Can request', value: 'can-request' }, { label: 'Not available', value: 'not-available' }],
      }
    ],
    'makeup-artist': [
      {
        key: 'artist-type',
        label: 'Artist Type',
        type: 'checkbox',
        options: [{ label: 'Bridal makeup specialist', value: 'bridal-makeup-specialist' }, { label: 'Event makeup (parties, photos)', value: 'event-makeup-parties-photos' }, { label: 'Editorial / fashion makeup', value: 'editorial-fashion-makeup' }, { label: 'Special effects (SFX) makeup', value: 'special-effects-sfx-makeup' }, { label: 'Airbrush makeup specialist', value: 'airbrush-makeup-specialist' }, { label: 'HD / film makeup', value: 'hd-film-makeup' }, { label: 'Natural / no-makeup makeup', value: 'natural-no-makeup-makeup' }, { label: 'Glam / full coverage', value: 'glam-full-coverage' }],
      },
      {
        key: 'services',
        label: 'Services',
        type: 'checkbox',
        options: [{ label: 'On-location makeup (your home/venue)', value: 'on-location-makeup-your-home-venue' }, { label: 'In-studio makeup (artist\'s studio)', value: 'in-studio-makeup-artist-s-studio' }, { label: 'Makeup lesson (1-on-1)', value: 'makeup-lesson-1-on-1' }, { label: 'Group lesson (2-6 people)', value: 'group-lesson-2-6-people' }, { label: 'Wedding party (bride + bridesmaids)', value: 'wedding-party-bride-bridesmaids' }, { label: 'Prom / homecoming', value: 'prom-homecoming' }, { label: 'Photo shoot (hourly rate)', value: 'photo-shoot-hourly-rate' }],
      },
      {
        key: 'price-bridal-makeup-bride-only',
        label: 'Price - Bridal Makeup (bride only)',
        type: 'checkbox',
        options: [{ label: 'Under $75', value: 'under-75' }, { label: '$75-125', value: '75-125' }, { label: '$125-175', value: '125-175' }, { label: '$175-250', value: '175-250' }, { label: '$250-350', value: '250-350' }, { label: '$350-500+ (celebrity)', value: '350-500-celebrity' }],
      },
      {
        key: 'price-bridesmaid-guest',
        label: 'Price - Bridesmaid / Guest',
        type: 'checkbox',
        options: [{ label: '$50-75', value: '50-75' }, { label: '$75-100', value: '75-100' }, { label: '$100-150', value: '100-150' }, { label: '$150-200', value: '150-200' }],
      },
      {
        key: 'price-event-prom',
        label: 'Price - Event / Prom',
        type: 'checkbox',
        options: [{ label: '$50-75', value: '50-75' }, { label: '$75-100', value: '75-100' }, { label: '$100-150', value: '100-150' }],
      },
      {
        key: 'price-makeup-lesson',
        label: 'Price - Makeup Lesson',
        type: 'checkbox',
        options: [{ label: '$50-75 (30 min)', value: '50-75-30-min' }, { label: '$75-125 (1 hour)', value: '75-125-1-hour' }, { label: '$125-200 (1.5 hours)', value: '125-200-1-5-hours' }],
      },
      {
        key: 'trial-run-bridal',
        label: 'Trial Run (bridal)',
        type: 'checkbox',
        options: [{ label: 'Required (separate fee)', value: 'required-separate-fee' }, { label: 'Recommended (discount if book)', value: 'recommended-discount-if-book' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'travel-fee',
        label: 'Travel Fee',
        type: 'checkbox',
        options: [{ label: 'Within 10 miles (free)', value: 'within-10-miles-free' }, { label: '10-25 miles ($___)', value: '10-25-miles' }, { label: '25+ miles ($___ + accommodations)', value: '25-miles-accommodations' }],
      },
      {
        key: 'minimum-booking-for-travel',
        label: 'Minimum Booking for Travel',
        type: 'checkbox',
        options: [{ label: '2+ services (bridal party)', value: '2-services-bridal-party' }, { label: 'No minimum (single service fine)', value: 'no-minimum-single-service-fine' }],
      },
      {
        key: 'products-used',
        label: 'Products Used',
        type: 'checkbox',
        options: [{ label: 'MAC', value: 'mac' }, { label: 'Make Up For Ever', value: 'make-up-for-ever' }, { label: 'NARS', value: 'nars' }, { label: 'Charlotte Tilbury', value: 'charlotte-tilbury' }, { label: 'Fenty Beauty', value: 'fenty-beauty' }, { label: 'Pat McGrath', value: 'pat-mcgrath' }, { label: 'Kryolan (SFX)', value: 'kryolan-sfx' }, { label: 'Airbrush (brand: Temptu, Dinair)', value: 'airbrush-brand-temptu-dinair' }],
      },
      {
        key: 'airbrush-available',
        label: 'Airbrush Available',
        type: 'checkbox',
        options: [{ label: 'Yes (included)', value: 'yes-included' }, { label: 'Yes (extra fee)', value: 'yes-extra-fee' }, { label: 'No (traditional only)', value: 'no-traditional-only' }],
      },
      {
        key: 'lashes-included',
        label: 'Lashes Included',
        type: 'checkbox',
        options: [{ label: 'Strip lashes (included)', value: 'strip-lashes-included' }, { label: 'Individual lashes (extra)', value: 'individual-lashes-extra' }, { label: 'No lashes (bring your own)', value: 'no-lashes-bring-your-own' }],
      },
      {
        key: 'lip-color-take-home',
        label: 'Lip Color (take-home)',
        type: 'checkbox',
        options: [{ label: 'Sample provided', value: 'sample-provided' }, { label: 'Purchase full size', value: 'purchase-full-size' }, { label: 'No (use artist\'s)', value: 'no-use-artist-s' }],
      },
      {
        key: 'skin-prep',
        label: 'Skin Prep',
        type: 'checkbox',
        options: [{ label: 'Cleanser + moisturizer (included)', value: 'cleanser-moisturizer-included' }, { label: 'Primer (included)', value: 'primer-included' }, { label: 'Client must arrive with clean face', value: 'client-must-arrive-with-clean-face' }],
      },
      {
        key: 'allergy-sensitivity',
        label: 'Allergy / Sensitivity',
        type: 'checkbox',
        options: [{ label: 'Patch test available (request)', value: 'patch-test-available-request' }, { label: 'Hypoallergenic options', value: 'hypoallergenic-options' }, { label: 'No (standard products)', value: 'no-standard-products' }],
      },
      {
        key: 'time-per-person',
        label: 'Time per Person',
        type: 'checkbox',
        options: [{ label: '30-45 minutes (basic)', value: '30-45-minutes-basic' }, { label: '45-60 minutes (standard)', value: '45-60-minutes-standard' }, { label: '60-90 minutes (bridal, detailed)', value: '60-90-minutes-bridal-detailed' }, { label: '90+ minutes (SFX)', value: '90-minutes-sfx' }],
      },
      {
        key: 'group-booking-wedding-party',
        label: 'Group Booking (wedding party)',
        type: 'checkbox',
        options: [{ label: '2+ artists available for large groups', value: '2-artists-available-for-large-groups' }, { label: 'Staggered start times', value: 'staggered-start-times' }],
      },
      {
        key: 'portfolio-instagram',
        label: 'Portfolio / Instagram',
        type: 'checkbox',
        options: [{ label: 'Yes (available upon request)', value: 'yes-available-upon-request' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'contract-required',
        label: 'Contract Required',
        type: 'checkbox',
        options: [{ label: 'Yes (for weddings)', value: 'yes-for-weddings' }, { label: 'No (small events)', value: 'no-small-events' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: '25% (holding date)', value: '25-holding-date' }, { label: '50% (bridal)', value: '50-bridal' }, { label: 'Non-refundable', value: 'non-refundable' }],
      },
      {
        key: 'cancellation-policy',
        label: 'Cancellation Policy',
        type: 'checkbox',
        options: [{ label: '30 days (full refund of deposit)', value: '30-days-full-refund-of-deposit' }, { label: '14 days (50% of deposit)', value: '14-days-50-of-deposit' }, { label: '7 days (no refund)', value: '7-days-no-refund' }],
      },
      {
        key: 'touch-up-kit-provided',
        label: 'Touch-Up Kit Provided',
        type: 'checkbox',
        options: [{ label: 'Lipstick, powder (small)', value: 'lipstick-powder-small' }, { label: 'No (client must bring own)', value: 'no-client-must-bring-own' }],
      },
      {
        key: 'tipping',
        label: 'Tipping',
        type: 'checkbox',
        options: [{ label: '15-20% standard', value: '15-20-standard' }, { label: 'Not required but appreciated', value: 'not-required-but-appreciated' }],
      },
      {
        key: 'languages',
        label: 'Languages',
        type: 'checkbox',
        options: [{ label: 'English', value: 'english' }, { label: 'Other (list)', value: 'other-list' }],
      },
      {
        key: 'male-makeup-clients',
        label: 'Male Makeup Clients',
        type: 'checkbox',
        options: [{ label: 'Yes (groom, event)', value: 'yes-groom-event' }, { label: 'Specialized (no)', value: 'specialized-no' }],
      }
    ],
    'waxing': [
      {
        key: 'salon-type',
        label: 'Salon Type',
        type: 'checkbox',
        options: [{ label: 'Dedicated waxing studio (European Wax Center)', value: 'dedicated-waxing-studio-european-wax-center' }, { label: 'Full-service salon (waxing offered)', value: 'full-service-salon-waxing-offered' }, { label: 'Medical spa (laser + waxing)', value: 'medical-spa-laser-waxing' }],
      },
      {
        key: 'wax-type',
        label: 'Wax Type',
        type: 'checkbox',
        options: [{ label: 'Hard wax (stripless, gentle)', value: 'hard-wax-stripless-gentle' }, { label: 'Soft wax (with strips)', value: 'soft-wax-with-strips' }, { label: 'Sugaring (all-natural, low temp)', value: 'sugaring-all-natural-low-temp' }],
      },
      {
        key: 'body-areas',
        label: 'Body Areas',
        type: 'checkbox',
        options: [{ label: 'Eyebrow', value: 'eyebrow' }, { label: 'Upper lip', value: 'upper-lip' }, { label: 'Chin', value: 'chin' }, { label: 'Sideburns', value: 'sideburns' }, { label: 'Full face', value: 'full-face' }, { label: 'Underarm', value: 'underarm' }, { label: 'Arms (half/full)', value: 'arms-half-full' }, { label: 'Legs (half/full)', value: 'legs-half-full' }, { label: 'Bikini (basic)', value: 'bikini-basic' }, { label: 'Bikini (Brazilian)', value: 'bikini-brazilian' }, { label: 'Bikini (extended / Hollywood)', value: 'bikini-extended-hollywood' }, { label: 'Back (men)', value: 'back-men' }, { label: 'Chest (men)', value: 'chest-men' }, { label: 'Stomach', value: 'stomach' }, { label: 'Buttocks', value: 'buttocks' }],
      },
      {
        key: 'price-eyebrow',
        label: 'Price - Eyebrow',
        type: 'checkbox',
        options: [{ label: '$10-15', value: '10-15' }, { label: '$15-20', value: '15-20' }, { label: '$20-25', value: '20-25' }, { label: '$25+', value: '25' }],
      },
      {
        key: 'price-brazilian-women',
        label: 'Price - Brazilian (women)',
        type: 'checkbox',
        options: [{ label: '$40-50', value: '40-50' }, { label: '$50-60', value: '50-60' }, { label: '$60-75', value: '60-75' }, { label: '$75-90', value: '75-90' }, { label: '$90+', value: '90' }],
      },
      {
        key: 'price-brazilian-men',
        label: 'Price - Brazilian (men)',
        type: 'checkbox',
        options: [{ label: '$50-70', value: '50-70' }, { label: '$70-90', value: '70-90' }, { label: '$90-110', value: '90-110' }],
      },
      {
        key: 'price-underarm',
        label: 'Price - Underarm',
        type: 'checkbox',
        options: [{ label: '$10-15', value: '10-15' }, { label: '$15-20', value: '15-20' }, { label: '$20-25', value: '20-25' }],
      },
      {
        key: 'price-half-leg',
        label: 'Price - Half Leg',
        type: 'checkbox',
        options: [{ label: '$25-35', value: '25-35' }, { label: '$35-45', value: '35-45' }, { label: '$45-55', value: '45-55' }],
      },
      {
        key: 'price-full-leg',
        label: 'Price - Full Leg',
        type: 'checkbox',
        options: [{ label: '$50-65', value: '50-65' }, { label: '$65-80', value: '65-80' }, { label: '$80-100', value: '80-100' }],
      },
      {
        key: 'package-pricing',
        label: 'Package Pricing',
        type: 'checkbox',
        options: [{ label: 'Buy 3 get 1 free', value: 'buy-3-get-1-free' }, { label: 'Monthly membership (fixed price per area)', value: 'monthly-membership-fixed-price-per-area' }, { label: 'Pre-paid wax pass', value: 'pre-paid-wax-pass' }],
      },
      {
        key: 'hair-length-requirement',
        label: 'Hair Length Requirement',
        type: 'checkbox',
        options: [{ label: '1/4 inch (approx. 2 weeks growth)', value: '1-4-inch-approx-2-weeks-growth' }, { label: 'Exceptions for first-time', value: 'exceptions-for-first-time' }],
      },
      {
        key: 'pain-management',
        label: 'Pain Management',
        type: 'checkbox',
        options: [{ label: 'Numbing cream (extra fee)', value: 'numbing-cream-extra-fee' }, { label: 'Deep breathing / distraction', value: 'deep-breathing-distraction' }, { label: 'No (tough it out)', value: 'no-tough-it-out' }],
      },
      {
        key: 'ingrown-hair-treatment',
        label: 'Ingrown Hair Treatment',
        type: 'checkbox',
        options: [{ label: 'Products for sale (serum, exfoliant)', value: 'products-for-sale-serum-exfoliant' }, { label: 'Extractions (separate service)', value: 'extractions-separate-service' }],
      },
      {
        key: 'skin-prep-before-appointment',
        label: 'Skin Prep Before Appointment',
        type: 'checkbox',
        options: [{ label: 'Exfoliate 24-48 hours prior', value: 'exfoliate-24-48-hours-prior' }, { label: 'No lotion day of', value: 'no-lotion-day-of' }, { label: 'No sunburn (reschedule)', value: 'no-sunburn-reschedule' }],
      },
      {
        key: 'age-restriction',
        label: 'Age Restriction',
        type: 'checkbox',
        options: [{ label: 'Under 18 with parent consent', value: 'under-18-with-parent-consent' }, { label: '16+ for Brazilian (parent present)', value: '16-for-brazilian-parent-present' }, { label: '18+ without parent', value: '18-without-parent' }],
      },
      {
        key: 'gender-of-technician',
        label: 'Gender of Technician',
        type: 'checkbox',
        options: [{ label: 'Can request female', value: 'can-request-female' }, { label: 'Can request male (rare)', value: 'can-request-male-rare' }, { label: 'No preference', value: 'no-preference' }],
      },
      {
        key: 'hygiene-sanitation',
        label: 'Hygiene / Sanitation',
        type: 'checkbox',
        options: [{ label: 'New spatula for each dip (no double-dip)', value: 'new-spatula-for-each-dip-no-double-dip' }, { label: 'Gloves worn', value: 'gloves-worn' }, { label: 'Disposable bed covers', value: 'disposable-bed-covers' }],
      },
      {
        key: 'laser-hair-removal-also-offered',
        label: 'Laser Hair Removal Also Offered',
        type: 'checkbox',
        options: [{ label: 'Yes (competitor)', value: 'yes-competitor' }, { label: 'No (wax only)', value: 'no-wax-only' }],
      },
      {
        key: 'cancellation-policy',
        label: 'Cancellation Policy',
        type: 'checkbox',
        options: [{ label: '24 hours (free)', value: '24-hours-free' }, { label: '4 hours (50%)', value: '4-hours-50' }, { label: 'No-show (100%)', value: 'no-show-100' }],
      },
      {
        key: 'late-policy',
        label: 'Late Policy',
        type: 'checkbox',
        options: [{ label: '10 minutes (may shorten service)', value: '10-minutes-may-shorten-service' }, { label: '15+ minutes (reschedule)', value: '15-minutes-reschedule' }],
      },
      {
        key: 'skin-reactions-redness-bumps',
        label: 'Skin Reactions (redness, bumps)',
        type: 'checkbox',
        options: [{ label: 'Normal for 24-48 hours', value: 'normal-for-24-48-hours' }, { label: 'Avoid sun, heat, tight clothing', value: 'avoid-sun-heat-tight-clothing' }],
      },
      {
        key: 'first-time-client-discount',
        label: 'First Time Client Discount',
        type: 'checkbox',
        options: [{ label: 'Yes (___% off)', value: 'yes-off' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'membership-wax-pass',
        label: 'Membership / Wax Pass',
        type: 'checkbox',
        options: [{ label: 'Yes (monthly)', value: 'yes-monthly' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'private-room',
        label: 'Private Room',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (curtained area)', value: 'no-curtained-area' }],
      },
      {
        key: 'online-booking',
        label: 'Online Booking',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'walk-ins',
        label: 'Walk-ins',
        type: 'checkbox',
        options: [{ label: 'Limited', value: 'limited' }, { label: 'Not accepted (appointment only)', value: 'not-accepted-appointment-only' }],
      }
    ],
    'eyelash-service': [
      {
        key: 'lash-type',
        label: 'Lash Type',
        type: 'checkbox',
        options: [{ label: 'Classic extensions (1 lash per natural lash)', value: 'classic-extensions-1-lash-per-natural-lash' }, { label: 'Volume fans (2-6 lashes per fan)', value: 'volume-fans-2-6-lashes-per-fan' }, { label: 'Mega volume (6-10+ lashes per fan)', value: 'mega-volume-6-10-lashes-per-fan' }, { label: 'Hybrid (mix classic + volume)', value: 'hybrid-mix-classic-volume' }, { label: 'Lash lift (perm, no extensions)', value: 'lash-lift-perm-no-extensions' }, { label: 'Lash tint (dye only)', value: 'lash-tint-dye-only' }, { label: 'Strip lashes (application only)', value: 'strip-lashes-application-only' }],
      },
      {
        key: 'lash-curl',
        label: 'Lash Curl',
        type: 'checkbox',
        options: [{ label: 'J curl (subtle)', value: 'j-curl-subtle' }, { label: 'C curl (natural)', value: 'c-curl-natural' }, { label: 'CC curl (medium)', value: 'cc-curl-medium' }, { label: 'D curl (dramatic)', value: 'd-curl-dramatic' }, { label: 'L curl (for straight lashes)', value: 'l-curl-for-straight-lashes' }],
      },
      {
        key: 'lash-length',
        label: 'Lash Length',
        type: 'checkbox',
        options: [{ label: '6 mm (inner corner)', value: '6-mm-inner-corner' }, { label: '8 mm (natural)', value: '8-mm-natural' }, { label: '10 mm (standard)', value: '10-mm-standard' }, { label: '12 mm (long)', value: '12-mm-long' }, { label: '14 mm (dramatic)', value: '14-mm-dramatic' }, { label: '15+ mm (extra long)', value: '15-mm-extra-long' }],
      },
      {
        key: 'lash-thickness',
        label: 'Lash Thickness',
        type: 'checkbox',
        options: [{ label: '0.03 mm (thin, volume)', value: '0-03-mm-thin-volume' }, { label: '0.05 mm (standard volume)', value: '0-05-mm-standard-volume' }, { label: '0.07 mm (classic volume)', value: '0-07-mm-classic-volume' }, { label: '0.10 mm (standard classic)', value: '0-10-mm-standard-classic' }, { label: '0.15 mm (thick classic)', value: '0-15-mm-thick-classic' }, { label: '0.20 mm (dramatic classic)', value: '0-20-mm-dramatic-classic' }],
      },
      {
        key: 'application-time',
        label: 'Application Time',
        type: 'checkbox',
        options: [{ label: '1 hour (classic fill)', value: '1-hour-classic-fill' }, { label: '1.5 hours (classic full set)', value: '1-5-hours-classic-full-set' }, { label: '2 hours (volume full set)', value: '2-hours-volume-full-set' }, { label: '2.5-3 hours (mega volume)', value: '2-5-3-hours-mega-volume' }, { label: '45 minutes (lash lift + tint)', value: '45-minutes-lash-lift-tint' }],
      },
      {
        key: 'price-classic-full-set',
        label: 'Price - Classic Full Set',
        type: 'checkbox',
        options: [{ label: '$100-150', value: '100-150' }, { label: '$150-200', value: '150-200' }, { label: '$200-250', value: '200-250' }, { label: '$250-300', value: '250-300' }, { label: '$300+', value: '300' }],
      },
      {
        key: 'price-volume-full-set',
        label: 'Price - Volume Full Set',
        type: 'checkbox',
        options: [{ label: '$150-200', value: '150-200' }, { label: '$200-250', value: '200-250' }, { label: '$250-300', value: '250-300' }, { label: '$300-400', value: '300-400' }],
      },
      {
        key: 'price-mega-volume',
        label: 'Price - Mega Volume',
        type: 'checkbox',
        options: [{ label: '$250-300', value: '250-300' }, { label: '$300-400', value: '300-400' }, { label: '$400-500+', value: '400-500' }],
      },
      {
        key: 'price-lash-lift-tint',
        label: 'Price - Lash Lift + Tint',
        type: 'checkbox',
        options: [{ label: '$75-100', value: '75-100' }, { label: '$100-125', value: '100-125' }, { label: '$125-150', value: '125-150' }],
      },
      {
        key: 'price-fill-2-3-weeks',
        label: 'Price - Fill (2-3 weeks)',
        type: 'checkbox',
        options: [{ label: '$50-65 (classic)', value: '50-65-classic' }, { label: '$65-80 (volume)', value: '65-80-volume' }, { label: '$80-100 (mega)', value: '80-100-mega' }],
      },
      {
        key: 'fill-schedule',
        label: 'Fill Schedule',
        type: 'checkbox',
        options: [{ label: 'Every 2 weeks (recommended)', value: 'every-2-weeks-recommended' }, { label: 'Every 3 weeks', value: 'every-3-weeks' }, { label: 'Every 4 weeks (may need full set)', value: 'every-4-weeks-may-need-full-set' }],
      },
      {
        key: 'lash-shampoo-aftercare-products-for-sale',
        label: 'Lash Shampoo / Aftercare Products for Sale',
        type: 'checkbox',
        options: [{ label: 'Cleansing foam', value: 'cleansing-foam' }, { label: 'Brush / spoolie', value: 'brush-spoolie' }, { label: 'Sealant', value: 'sealant' }],
      },
      {
        key: 'patch-test-allergies',
        label: 'Patch Test (allergies)',
        type: 'checkbox',
        options: [{ label: 'Required 48 hours prior', value: 'required-48-hours-prior' }, { label: 'Not required (but recommended)', value: 'not-required-but-recommended' }],
      },
      {
        key: 'eye-shape-natural-lash-assessment',
        label: 'Eye Shape / Natural Lash Assessment',
        type: 'checkbox',
        options: [{ label: 'Consultation included', value: 'consultation-included' }, { label: 'Not included (just apply)', value: 'not-included-just-apply' }],
      },
      {
        key: 'infection-control',
        label: 'Infection Control',
        type: 'checkbox',
        options: [{ label: 'Disposable micro-brushes', value: 'disposable-micro-brushes' }, { label: 'Sterilized tweezers', value: 'sterilized-tweezers' }, { label: 'Gel pad (under eyes) not cotton', value: 'gel-pad-under-eyes-not-cotton' }],
      },
      {
        key: 'comfort',
        label: 'Comfort',
        type: 'checkbox',
        options: [{ label: 'Eyes closed entire time', value: 'eyes-closed-entire-time' }, { label: 'Napping allowed', value: 'napping-allowed' }, { label: 'Music / podcast available', value: 'music-podcast-available' }],
      },
      {
        key: 'removal-service',
        label: 'Removal Service',
        type: 'checkbox',
        options: [{ label: 'Yes ($20-40)', value: 'yes-20-40' }, { label: 'Included with new full set', value: 'included-with-new-full-set' }],
      },
      {
        key: 'no-glue-fumes-option',
        label: 'No Glue Fumes Option',
        type: 'checkbox',
        options: [{ label: 'Low-fum adhesive', value: 'low-fum-adhesive' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'aftercare-instructions-provided',
        label: 'Aftercare Instructions Provided',
        type: 'checkbox',
        options: [{ label: 'No wetting for 24 hours', value: 'no-wetting-for-24-hours' }, { label: 'No oil-based products', value: 'no-oil-based-products' }, { label: 'No mascara (except water-based)', value: 'no-mascara-except-water-based' }, { label: 'Brush daily', value: 'brush-daily' }],
      },
      {
        key: 'cancellation-policy',
        label: 'Cancellation Policy',
        type: 'checkbox',
        options: [{ label: '24 hours (free)', value: '24-hours-free' }, { label: '12 hours (50% of service)', value: '12-hours-50-of-service' }, { label: 'No-show (100% + may not rebook)', value: 'no-show-100-may-not-rebook' }],
      },
      {
        key: 'membership-lash-plan',
        label: 'Membership / Lash Plan',
        type: 'checkbox',
        options: [{ label: 'Monthly fill included', value: 'monthly-fill-included' }, { label: 'Discount on full sets', value: 'discount-on-full-sets' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'private-room',
        label: 'Private Room',
        type: 'checkbox',
        options: [{ label: 'Yes (reclining chair)', value: 'yes-reclining-chair' }, { label: 'No (open studio)', value: 'no-open-studio' }],
      },
      {
        key: 'eye-health-restrictions',
        label: 'Eye Health Restrictions',
        type: 'checkbox',
        options: [{ label: 'Pink eye (reschedule)', value: 'pink-eye-reschedule' }, { label: 'Stye (reschedule)', value: 'stye-reschedule' }, { label: 'Recent eye surgery (doctor approval)', value: 'recent-eye-surgery-doctor-approval' }],
      },
      {
        key: 'makeup-before-appointment',
        label: 'Makeup Before Appointment',
        type: 'checkbox',
        options: [{ label: 'No eye makeup', value: 'no-eye-makeup' }, { label: 'Clean lashes required', value: 'clean-lashes-required' }],
      }
    ],
    'eyebrow-service': [
      {
        key: 'service-type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'Eyebrow waxing', value: 'eyebrow-waxing' }, { label: 'Eyebrow threading', value: 'eyebrow-threading' }, { label: 'Eyebrow tweezing (only)', value: 'eyebrow-tweezing-only' }, { label: 'Eyebrow tinting', value: 'eyebrow-tinting' }, { label: 'Eyebrow lamination (perm)', value: 'eyebrow-lamination-perm' }, { label: 'Microblading (semi-permanent tattoo)', value: 'microblading-semi-permanent-tattoo' }, { label: 'Powder brows (ombre tattoo)', value: 'powder-brows-ombre-tattoo' }, { label: 'Combination brows (microblade + powder)', value: 'combination-brows-microblade-powder' }, { label: 'Nano brows (machine hair strokes)', value: 'nano-brows-machine-hair-strokes' }],
      },
      {
        key: 'price-wax-thread',
        label: 'Price - Wax / Thread',
        type: 'checkbox',
        options: [{ label: '$10-15', value: '10-15' }, { label: '$15-20', value: '15-20' }, { label: '$20-25', value: '20-25' }],
      },
      {
        key: 'price-tint',
        label: 'Price - Tint',
        type: 'checkbox',
        options: [{ label: '$15-20', value: '15-20' }, { label: '$20-25', value: '20-25' }, { label: '$25-30', value: '25-30' }],
      },
      {
        key: 'price-lamination',
        label: 'Price - Lamination',
        type: 'checkbox',
        options: [{ label: '$50-75', value: '50-75' }, { label: '$75-100', value: '75-100' }, { label: '$100-125', value: '100-125' }],
      },
      {
        key: 'price-microblading-initial',
        label: 'Price - Microblading (initial)',
        type: 'checkbox',
        options: [{ label: '$300-400', value: '300-400' }, { label: '$400-500', value: '400-500' }, { label: '$500-600', value: '500-600' }, { label: '$600-800', value: '600-800' }, { label: '$800+ (master artist)', value: '800-master-artist' }],
      },
      {
        key: 'price-microblading-touch-up-6-8-weeks',
        label: 'Price - Microblading Touch-up (6-8 weeks)',
        type: 'checkbox',
        options: [{ label: '$100-150', value: '100-150' }, { label: '$150-200', value: '150-200' }, { label: '$200-300 (included in some initial prices)', value: '200-300-included-in-some-initial-prices' }],
      },
      {
        key: 'price-powder-ombre-brows',
        label: 'Price - Powder / Ombre Brows',
        type: 'checkbox',
        options: [{ label: '$400-500', value: '400-500' }, { label: '$500-600', value: '500-600' }, { label: '$600-800', value: '600-800' }],
      },
      {
        key: 'brow-shape-styles',
        label: 'Brow Shape Styles',
        type: 'checkbox',
        options: [{ label: 'Natural (follows natural arch)', value: 'natural-follows-natural-arch' }, { label: 'Arched (dramatic lift)', value: 'arched-dramatic-lift' }, { label: 'Straight (Korean style)', value: 'straight-korean-style' }, { label: 'S-shaped (soft curve)', value: 's-shaped-soft-curve' }, { label: 'Custom (client preference)', value: 'custom-client-preference' }],
      },
      {
        key: 'consultation-microblading',
        label: 'Consultation (microblading)',
        type: 'checkbox',
        options: [{ label: 'Included (design shape, color)', value: 'included-design-shape-color' }, { label: 'Separate fee (applied to service)', value: 'separate-fee-applied-to-service' }, { label: 'Not offered (just do it)', value: 'not-offered-just-do-it' }],
      },
      {
        key: 'numbing-cream',
        label: 'Numbing Cream',
        type: 'checkbox',
        options: [{ label: 'Included (topical)', value: 'included-topical' }, { label: 'Extra fee ($___)', value: 'extra-fee' }, { label: 'Not needed', value: 'not-needed' }],
      },
      {
        key: 'healing-time-microblading',
        label: 'Healing Time (microblading)',
        type: 'checkbox',
        options: [{ label: '7-10 days (scabbing)', value: '7-10-days-scabbing' }, { label: '4-6 weeks (true color settles)', value: '4-6-weeks-true-color-settles' }, { label: 'Touch-up at 6-8 weeks', value: 'touch-up-at-6-8-weeks' }],
      },
      {
        key: 'longevity-microblading',
        label: 'Longevity (microblading)',
        type: 'checkbox',
        options: [{ label: '12-18 months', value: '12-18-months' }, { label: '18-24 months', value: '18-24-months' }, { label: '2-3 years (touch-ups extend)', value: '2-3-years-touch-ups-extend' }],
      },
      {
        key: 'patch-test-pigment-allergy',
        label: 'Patch Test (pigment allergy)',
        type: 'checkbox',
        options: [{ label: 'Required (48 hours)', value: 'required-48-hours' }, { label: 'Not required', value: 'not-required' }],
      },
      {
        key: 'skin-type-restrictions',
        label: 'Skin Type Restrictions',
        type: 'checkbox',
        options: [{ label: 'Oily skin (fades faster)', value: 'oily-skin-fades-faster' }, { label: 'Mature skin (may blur)', value: 'mature-skin-may-blur' }, { label: 'No restrictions', value: 'no-restrictions' }],
      },
      {
        key: 'blood-thinners-microblading',
        label: 'Blood Thinners (microblading)',
        type: 'checkbox',
        options: [{ label: 'Must stop 48 hours prior', value: 'must-stop-48-hours-prior' }, { label: 'Consult doctor', value: 'consult-doctor' }],
      },
      {
        key: 'pregnancy-nursing',
        label: 'Pregnancy / Nursing',
        type: 'checkbox',
        options: [{ label: 'Not recommended (hormones affect retention)', value: 'not-recommended-hormones-affect-retention' }, { label: 'Allowed (no numbing)', value: 'allowed-no-numbing' }],
      },
      {
        key: 'licensing-certification',
        label: 'Licensing / Certification',
        type: 'checkbox',
        options: [{ label: 'State licensed (cosmetology/esthetics)', value: 'state-licensed-cosmetology-esthetics' }, { label: 'Bloodborne pathogen certified', value: 'bloodborne-pathogen-certified' }, { label: 'Microblading certification (PhiBrows, etc.)', value: 'microblading-certification-phibrows-etc' }],
      },
      {
        key: 'portfolio-required',
        label: 'Portfolio Required',
        type: 'checkbox',
        options: [{ label: 'Yes (before/after photos)', value: 'yes-before-after-photos' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'deposit-microblading',
        label: 'Deposit (microblading)',
        type: 'checkbox',
        options: [{ label: '$50-100 (non-refundable)', value: '50-100-non-refundable' }, { label: 'No deposit', value: 'no-deposit' }],
      },
      {
        key: 'cancellation-microblading',
        label: 'Cancellation (microblading)',
        type: 'checkbox',
        options: [{ label: '48 hours (reschedule)', value: '48-hours-reschedule' }, { label: 'No-show (forfeit deposit)', value: 'no-show-forfeit-deposit' }],
      },
      {
        key: 'healing-aftercare-products-provided',
        label: 'Healing Aftercare Products Provided',
        type: 'checkbox',
        options: [{ label: 'Healing balm', value: 'healing-balm' }, { label: 'Cleansing foam', value: 'cleansing-foam' }, { label: 'Instructions card', value: 'instructions-card' }],
      },
      {
        key: 'touch-up-frequency-wax-thread',
        label: 'Touch-up Frequency (wax/thread)',
        type: 'checkbox',
        options: [{ label: '2-3 weeks', value: '2-3-weeks' }, { label: '4 weeks', value: '4-weeks' }, { label: '6 weeks', value: '6-weeks' }],
      }
    ],
    'blow-dry-blow-out-service': [
      {
        key: 'salon-type',
        label: 'Salon Type',
        type: 'checkbox',
        options: [{ label: 'Blow-dry bar (dedicated)', value: 'blow-dry-bar-dedicated' }, { label: 'Hair salon (add-on service)', value: 'hair-salon-add-on-service' }, { label: 'Mobile blowout (at home/hotel)', value: 'mobile-blowout-at-home-hotel' }],
      },
      {
        key: 'services',
        label: 'Services',
        type: 'checkbox',
        options: [{ label: 'Blowout (wash + blow-dry + style)', value: 'blowout-wash-blow-dry-style' }, { label: 'Updo (formal style)', value: 'updo-formal-style' }, { label: 'Braids (french, dutch, fishtail)', value: 'braids-french-dutch-fishtail' }, { label: 'Curling iron (curls/waves)', value: 'curling-iron-curls-waves' }, { label: 'Flat iron (sleek straight)', value: 'flat-iron-sleek-straight' }, { label: 'Volume blowout (big, bouncy)', value: 'volume-blowout-big-bouncy' }, { label: 'Smooth blowout (sleek, shiny)', value: 'smooth-blowout-sleek-shiny' }, { label: 'Textured blowout (beachy waves)', value: 'textured-blowout-beachy-waves' }],
      },
      {
        key: 'price-blowout',
        label: 'Price - Blowout',
        type: 'checkbox',
        options: [{ label: '$30-40', value: '30-40' }, { label: '$40-50', value: '40-50' }, { label: '$50-65', value: '50-65' }, { label: '$65-80 (long/thick hair extra)', value: '65-80-long-thick-hair-extra' }],
      },
      {
        key: 'price-updo',
        label: 'Price - Updo',
        type: 'checkbox',
        options: [{ label: '$50-75', value: '50-75' }, { label: '$75-100', value: '75-100' }, { label: '$100-150', value: '100-150' }, { label: '$150-200 (bridal)', value: '150-200-bridal' }],
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'checkbox',
        options: [{ label: '30-45 minutes (blowout)', value: '30-45-minutes-blowout' }, { label: '45-60 minutes (long hair)', value: '45-60-minutes-long-hair' }, { label: '45-60 minutes (updo)', value: '45-60-minutes-updo' }],
      },
      {
        key: 'add-ons',
        label: 'Add-Ons',
        type: 'checkbox',
        options: [{ label: 'Deep conditioning treatment ($___)', value: 'deep-conditioning-treatment' }, { label: 'Scalp massage ($___)', value: 'scalp-massage' }, { label: 'Hair mask ($___)', value: 'hair-mask' }, { label: 'Shine spray (included)', value: 'shine-spray-included' }],
      },
      {
        key: 'products-used',
        label: 'Products Used',
        type: 'checkbox',
        options: [{ label: 'Professional brands', value: 'professional-brands' }, { label: 'Heat protectant (always)', value: 'heat-protectant-always' }, { label: 'Volumizing products', value: 'volumizing-products' }],
      },
      {
        key: 'hair-length-surcharge',
        label: 'Hair Length Surcharge',
        type: 'checkbox',
        options: [{ label: 'Past shoulders (extra $___)', value: 'past-shoulders-extra' }, { label: 'Past bra strap (extra $___)', value: 'past-bra-strap-extra' }, { label: 'Past waist (extra $___)', value: 'past-waist-extra' }, { label: 'No surcharge (all one price)', value: 'no-surcharge-all-one-price' }],
      },
      {
        key: 'hair-texture',
        label: 'Hair Texture',
        type: 'checkbox',
        options: [{ label: 'Straight (easy)', value: 'straight-easy' }, { label: 'Wavy', value: 'wavy' }, { label: 'Curly (requires skill)', value: 'curly-requires-skill' }, { label: 'Coily / natural (specialist needed)', value: 'coily-natural-specialist-needed' }],
      },
      {
        key: 'extentions',
        label: 'Extentions',
        type: 'checkbox',
        options: [{ label: 'Yes (blowout around them)', value: 'yes-blowout-around-them' }, { label: 'No (extensions not compatible)', value: 'no-extensions-not-compatible' }],
      },
      {
        key: 'bridal-special-event',
        label: 'Bridal / Special Event',
        type: 'checkbox',
        options: [{ label: 'Trial run available ($___)', value: 'trial-run-available' }, { label: 'On-location available (travel fee)', value: 'on-location-available-travel-fee' }],
      },
      {
        key: 'kids-blowout',
        label: 'Kids Blowout',
        type: 'checkbox',
        options: [{ label: 'Yes (ages 8+)', value: 'yes-ages-8' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'men-s-blowout',
        label: 'Men\'s Blowout',
        type: 'checkbox',
        options: [{ label: 'Yes (short hair)', value: 'yes-short-hair' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'membership-subscription',
        label: 'Membership / Subscription',
        type: 'checkbox',
        options: [{ label: 'Monthly blowout plan (1-2 per month)', value: 'monthly-blowout-plan-1-2-per-month' }, { label: 'Pre-paid package (5 pack, 10 pack)', value: 'pre-paid-package-5-pack-10-pack' }],
      },
      {
        key: 'walk-ins',
        label: 'Walk-ins',
        type: 'checkbox',
        options: [{ label: 'Yes (subject to availability)', value: 'yes-subject-to-availability' }, { label: 'Appointment recommended', value: 'appointment-recommended' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: '12 hours (free)', value: '12-hours-free' }, { label: '4 hours (50%)', value: '4-hours-50' }, { label: 'No-show (100%)', value: 'no-show-100' }],
      },
      {
        key: 'style-hold',
        label: 'Style Hold',
        type: 'checkbox',
        options: [{ label: '2-3 days (with proper care)', value: '2-3-days-with-proper-care' }, { label: '1 day (humid weather)', value: '1-day-humid-weather' }, { label: 'Overnight preservation tips given', value: 'overnight-preservation-tips-given' }],
      },
      {
        key: 'products-for-sale',
        label: 'Products for Sale',
        type: 'checkbox',
        options: [{ label: 'Dry shampoo', value: 'dry-shampoo' }, { label: 'Volumizing powder', value: 'volumizing-powder' }, { label: 'Hairspray', value: 'hairspray' }, { label: 'Heat protectant', value: 'heat-protectant' }],
      },
      {
        key: 'gratuity',
        label: 'Gratuity',
        type: 'checkbox',
        options: [{ label: '15-20% standard', value: '15-20-standard' }, { label: 'Added to card or cash', value: 'added-to-card-or-cash' }],
      }
    ],
    'tattoo-piercing': [
      {
        key: 'studio-type',
        label: 'Studio Type',
        type: 'checkbox',
        options: [{ label: 'Tattoo studio (custom)', value: 'tattoo-studio-custom' }, { label: 'Piercing studio (dedicated)', value: 'piercing-studio-dedicated' }, { label: 'Combo (tattoo + piercing)', value: 'combo-tattoo-piercing' }, { label: 'Walk-in shop (flash available)', value: 'walk-in-shop-flash-available' }, { label: 'Appointment only (custom)', value: 'appointment-only-custom' }],
      },
      {
        key: 'tattoo-styles',
        label: 'Tattoo Styles',
        type: 'checkbox',
        options: [{ label: 'American traditional', value: 'american-traditional' }, { label: 'Black and grey realism', value: 'black-and-grey-realism' }, { label: 'Color realism', value: 'color-realism' }, { label: 'Neo-traditional', value: 'neo-traditional' }, { label: 'Japanese (irezumi)', value: 'japanese-irezumi' }, { label: 'Tribal', value: 'tribal' }, { label: 'Geometric / mandala', value: 'geometric-mandala' }, { label: 'Watercolor', value: 'watercolor' }, { label: 'Fine line / minimalist', value: 'fine-line-minimalist' }, { label: 'Script / lettering', value: 'script-lettering' }, { label: 'Portrait', value: 'portrait' }, { label: 'Biomechanical', value: 'biomechanical' }, { label: 'Trash polka', value: 'trash-polka' }, { label: 'New school / cartoon', value: 'new-school-cartoon' }, { label: 'Cover-up specialist', value: 'cover-up-specialist' }, { label: 'Scar cover-up', value: 'scar-cover-up' }],
      },
      {
        key: 'tattoo-pricing-models',
        label: 'Tattoo Pricing Models',
        type: 'checkbox',
        options: [{ label: 'Hourly rate ($150-200, $200-300, $300-500+)', value: 'hourly-rate-150-200-200-300-300-500' }, { label: 'Half day (4 hours flat rate)', value: 'half-day-4-hours-flat-rate' }, { label: 'Full day (8 hours flat rate)', value: 'full-day-8-hours-flat-rate' }, { label: 'Per piece (flash)', value: 'per-piece-flash' }, { label: 'Minimum shop fee ($50-100)', value: 'minimum-shop-fee-50-100' }],
      },
      {
        key: 'shop-minimum',
        label: 'Shop Minimum',
        type: 'checkbox',
        options: [{ label: '$50-80', value: '50-80' }, { label: '$80-100', value: '80-100' }, { label: '$100-150', value: '100-150' }, { label: '$150+', value: '150' }],
      },
      {
        key: 'hourly-rate-range',
        label: 'Hourly Rate Range',
        type: 'checkbox',
        options: [{ label: '$100-150 (apprentice)', value: '100-150-apprentice' }, { label: '$150-200 (junior artist)', value: '150-200-junior-artist' }, { label: '$200-300 (experienced)', value: '200-300-experienced' }, { label: '$300-400 (high demand)', value: '300-400-high-demand' }, { label: '$400-600+ (celebrity artist)', value: '400-600-celebrity-artist' }],
      },
      {
        key: 'deposit-required',
        label: 'Deposit Required',
        type: 'checkbox',
        options: [{ label: '$50-100 (applied to final price)', value: '50-100-applied-to-final-price' }, { label: '$100-200 (large pieces)', value: '100-200-large-pieces' }, { label: 'Non-refundable if no-show', value: 'non-refundable-if-no-show' }],
      },
      {
        key: 'consultation',
        label: 'Consultation',
        type: 'checkbox',
        options: [{ label: 'Included (free, 15 min)', value: 'included-free-15-min' }, { label: 'Paid (applied to tattoo)', value: 'paid-applied-to-tattoo' }, { label: 'No consultation (bring design)', value: 'no-consultation-bring-design' }],
      },
      {
        key: 'custom-design',
        label: 'Custom Design',
        type: 'checkbox',
        options: [{ label: 'Artist creates original', value: 'artist-creates-original' }, { label: 'Client provides design (artist may adjust)', value: 'client-provides-design-artist-may-adjust' }, { label: 'Flash (pre-drawn, ready to go)', value: 'flash-pre-drawn-ready-to-go' }],
      },
      {
        key: 'design-changes',
        label: 'Design Changes',
        type: 'checkbox',
        options: [{ label: 'Minor changes (free)', value: 'minor-changes-free' }, { label: 'Major changes (new design fee)', value: 'major-changes-new-design-fee' }],
      },
      {
        key: 'pain-management',
        label: 'Pain Management',
        type: 'checkbox',
        options: [{ label: 'Numbing cream allowed (check with artist)', value: 'numbing-cream-allowed-check-with-artist' }, { label: 'Not allowed (affects skin)', value: 'not-allowed-affects-skin' }, { label: 'Take breaks as needed', value: 'take-breaks-as-needed' }],
      },
      {
        key: 'healing-time',
        label: 'Healing Time',
        type: 'checkbox',
        options: [{ label: '2-3 weeks (surface)', value: '2-3-weeks-surface' }, { label: '1-2 months (fully healed)', value: '1-2-months-fully-healed' }, { label: 'Aftercare instructions provided', value: 'aftercare-instructions-provided' }],
      },
      {
        key: 'touch-up-policy',
        label: 'Touch-up Policy',
        type: 'checkbox',
        options: [{ label: 'Free within 1 year (minor)', value: 'free-within-1-year-minor' }, { label: 'Free within 30 days', value: 'free-within-30-days' }, { label: 'Paid touch-up ($___)', value: 'paid-touch-up' }],
      },
      {
        key: 'age-requirement',
        label: 'Age Requirement',
        type: 'checkbox',
        options: [{ label: '18+ (legal, no exceptions)', value: '18-legal-no-exceptions' }, { label: '16-17 with parent (notarized consent, varies by state)', value: '16-17-with-parent-notarized-consent-varies-by-state' }, { label: 'No minors (ID required)', value: 'no-minors-id-required' }],
      },
      {
        key: 'id-required',
        label: 'ID Required',
        type: 'checkbox',
        options: [{ label: 'Government-issued photo ID', value: 'government-issued-photo-id' }, { label: 'No copies or photos', value: 'no-copies-or-photos' }],
      },
      {
        key: 'piercing-services',
        label: 'Piercing Services',
        type: 'checkbox',
        options: [{ label: 'Earlobe', value: 'earlobe' }, { label: 'Cartilage (helix, rook, daith, tragus, conch)', value: 'cartilage-helix-rook-daith-tragus-conch' }, { label: 'Nose (nostril, septum)', value: 'nose-nostril-septum' }, { label: 'Lip (labret, monroe, snake bites)', value: 'lip-labret-monroe-snake-bites' }, { label: 'Eyebrow', value: 'eyebrow' }, { label: 'Tongue', value: 'tongue' }, { label: 'Navel (belly button)', value: 'navel-belly-button' }, { label: 'Nipple', value: 'nipple' }, { label: 'Genital (by request, specialist)', value: 'genital-by-request-specialist' }],
      },
      {
        key: 'piercing-pricing',
        label: 'Piercing Pricing',
        type: 'checkbox',
        options: [{ label: '$20-30 (lobe)', value: '20-30-lobe' }, { label: '$30-40 (cartilage)', value: '30-40-cartilage' }, { label: '$40-50 (nose)', value: '40-50-nose' }, { label: '$50-75 (nipple)', value: '50-75-nipple' }, { label: '$75-100 (genital)', value: '75-100-genital' }, { label: 'Jewelry included (basic) or separate', value: 'jewelry-included-basic-or-separate' }],
      },
      {
        key: 'piercing-jewelry-types',
        label: 'Piercing Jewelry Types',
        type: 'checkbox',
        options: [{ label: 'Implant grade titanium (best)', value: 'implant-grade-titanium-best' }, { label: 'Surgical steel', value: 'surgical-steel' }, { label: '14k gold', value: '14k-gold' }, { label: 'Niobium (hypoallergenic)', value: 'niobium-hypoallergenic' }, { label: 'Bioplast (flexible)', value: 'bioplast-flexible' }, { label: 'No acrylic / cheap metals', value: 'no-acrylic-cheap-metals' }],
      },
      {
        key: 'piercing-needle-vs-gun',
        label: 'Piercing Needle vs Gun',
        type: 'checkbox',
        options: [{ label: 'Needle only (sterile, single use)', value: 'needle-only-sterile-single-use' }, { label: 'No gun (traumatic to tissue)', value: 'no-gun-traumatic-to-tissue' }],
      },
      {
        key: 'aftercare-products-for-sale',
        label: 'Aftercare Products for Sale',
        type: 'checkbox',
        options: [{ label: 'Saline spray', value: 'saline-spray' }, { label: 'Antibacterial soap', value: 'antibacterial-soap' }, { label: 'Healing balm', value: 'healing-balm' }],
      },
      {
        key: 'infection-control',
        label: 'Infection Control',
        type: 'checkbox',
        options: [{ label: 'Autoclave (sterilization)', value: 'autoclave-sterilization' }, { label: 'Single-use needles (opened in front of you)', value: 'single-use-needles-opened-in-front-of-you' }, { label: 'Disposable grip covers', value: 'disposable-grip-covers' }, { label: 'Visible cleanliness', value: 'visible-cleanliness' }],
      },
      {
        key: 'bloodborne-pathogen-certification',
        label: 'Bloodborne Pathogen Certification',
        type: 'checkbox',
        options: [{ label: 'Posted in shop', value: 'posted-in-shop' }, { label: 'Available upon request', value: 'available-upon-request' }],
      },
      {
        key: 'portfolio-instagram',
        label: 'Portfolio / Instagram',
        type: 'checkbox',
        options: [{ label: 'Available (healed photos too)', value: 'available-healed-photos-too' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'music-vibe',
        label: 'Music / Vibe',
        type: 'checkbox',
        options: [{ label: 'Loud music (metal, punk)', value: 'loud-music-metal-punk' }, { label: 'Relaxing / quiet', value: 'relaxing-quiet' }, { label: 'Private room available', value: 'private-room-available' }],
      },
      {
        key: 'walk-ins-welcome',
        label: 'Walk-ins Welcome',
        type: 'checkbox',
        options: [{ label: 'Yes (flash available)', value: 'yes-flash-available' }, { label: 'Appointment only (custom)', value: 'appointment-only-custom' }],
      },
      {
        key: 'shop-minimum-for-walk-ins',
        label: 'Shop Minimum for Walk-ins',
        type: 'checkbox',
        options: [{ label: '$50-100', value: '50-100' }, { label: 'No minimum (price per piece)', value: 'no-minimum-price-per-piece' }],
      },
      {
        key: 'gift-certificates',
        label: 'Gift Certificates',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'deposit-cancellation',
        label: 'Deposit / Cancellation',
        type: 'checkbox',
        options: [{ label: '48 hours notice (reschedule)', value: '48-hours-notice-reschedule' }, { label: 'No-show (forfeit deposit)', value: 'no-show-forfeit-deposit' }, { label: 'Can\'t transfer deposit', value: 'can-t-transfer-deposit' }],
      },
      {
        key: 'tipping',
        label: 'Tipping',
        type: 'checkbox',
        options: [{ label: '15-20% standard', value: '15-20-standard' }, { label: '20-30% for excellent work', value: '20-30-for-excellent-work' }, { label: 'Cash preferred', value: 'cash-preferred' }],
      },
      {
        key: 'hpv-hep-b-vaccine-recommendation',
        label: 'HPV / Hep B Vaccine Recommendation',
        type: 'checkbox',
        options: [{ label: 'Mentioned', value: 'mentioned' }, { label: 'Not discussed', value: 'not-discussed' }],
      },
      {
        key: 'aftercare-instructions',
        label: 'Aftercare Instructions',
        type: 'checkbox',
        options: [{ label: 'Printed copy provided', value: 'printed-copy-provided' }, { label: 'Explained verbally', value: 'explained-verbally' }, { label: 'Follow-up text / email', value: 'follow-up-text-email' }],
      }
    ],
    'photo-booth-rental': [
      {
        key: 'booth-type',
        label: 'Booth Type',
        type: 'checkbox',
        options: [{ label: 'Enclosed booth (traditional)', value: 'enclosed-booth-traditional' }, { label: 'Open air / standing booth', value: 'open-air-standing-booth' }, { label: 'Mirror booth (interactive, mirror screen)', value: 'mirror-booth-interactive-mirror-screen' }, { label: 'GIF booth (looping video)', value: 'gif-booth-looping-video' }, { label: '360 video booth (rotating platform)', value: '360-video-booth-rotating-platform' }, { label: 'Slow-motion booth', value: 'slow-motion-booth' }, { label: 'Green screen booth (custom backgrounds)', value: 'green-screen-booth-custom-backgrounds' }],
      },
      {
        key: 'capacity-per-photo',
        label: 'Capacity per Photo',
        type: 'checkbox',
        options: [{ label: '1-2 people', value: '1-2-people' }, { label: '3-4 people', value: '3-4-people' }, { label: '5-6 people', value: '5-6-people' }, { label: '6-10 people (open air)', value: '6-10-people-open-air' }],
      },
      {
        key: 'print-quality',
        label: 'Print Quality',
        type: 'checkbox',
        options: [{ label: 'Instant print (dye sublimation)', value: 'instant-print-dye-sublimation' }, { label: '2" x 6" strip (traditional)', value: '2-x-6-strip-traditional' }, { label: '4" x 6" (single photo)', value: '4-x-6-single-photo' }, { label: '4" x 4" (square)', value: '4-x-4-square' }, { label: '4" x 10" (wide strip)', value: '4-x-10-wide-strip' }],
      },
      {
        key: 'print-quantity-per-session',
        label: 'Print Quantity per Session',
        type: 'checkbox',
        options: [{ label: '1 print per session (duplicate for couple)', value: '1-print-per-session-duplicate-for-couple' }, { label: '2 prints per session (one for scrapbook)', value: '2-prints-per-session-one-for-scrapbook' }, { label: 'Unlimited (digital only)', value: 'unlimited-digital-only' }],
      },
      {
        key: 'digital-copies',
        label: 'Digital Copies',
        type: 'checkbox',
        options: [{ label: 'SMS texted to guest', value: 'sms-texted-to-guest' }, { label: 'Emailed', value: 'emailed' }, { label: 'QR code download', value: 'qr-code-download' }, { label: 'Gallery online after event', value: 'gallery-online-after-event' }],
      },
      {
        key: 'props-provided',
        label: 'Props Provided',
        type: 'checkbox',
        options: [{ label: 'Standard (masks, signs, glasses, hats)', value: 'standard-masks-signs-glasses-hats' }, { label: 'Themed (wedding, holiday, birthday)', value: 'themed-wedding-holiday-birthday' }, { label: 'Custom (client-specific signs)', value: 'custom-client-specific-signs' }, { label: 'No props (formal only)', value: 'no-props-formal-only' }],
      },
      {
        key: 'backdrop-options',
        label: 'Backdrop Options',
        type: 'checkbox',
        options: [{ label: 'Solid color (black, white, sequin)', value: 'solid-color-black-white-sequin' }, { label: 'Patterned (confetti, marble)', value: 'patterned-confetti-marble' }, { label: 'Custom printed (logo, monogram)', value: 'custom-printed-logo-monogram' }, { label: 'Green screen (virtual backgrounds)', value: 'green-screen-virtual-backgrounds' }],
      },
      {
        key: 'scrapbook-guest-book',
        label: 'Scrapbook / Guest Book',
        type: 'checkbox',
        options: [{ label: 'Duplicate print + guest message book', value: 'duplicate-print-guest-message-book' }, { label: 'Included', value: 'included' }, { label: 'Add-on ($___)', value: 'add-on' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'attendant-included',
        label: 'Attendant Included',
        type: 'checkbox',
        options: [{ label: 'Yes (setup, assist, breakdown)', value: 'yes-setup-assist-breakdown' }, { label: 'No (self-service)', value: 'no-self-service' }],
      },
      {
        key: 'setup-time',
        label: 'Setup Time',
        type: 'checkbox',
        options: [{ label: '30 minutes', value: '30-minutes' }, { label: '60 minutes (elaborate setup)', value: '60-minutes-elaborate-setup' }],
      },
      {
        key: 'space-requirements',
        label: 'Space Requirements',
        type: 'checkbox',
        options: [{ label: '5x5 ft (enclosed)', value: '5x5-ft-enclosed' }, { label: '8x8 ft (open air)', value: '8x8-ft-open-air' }, { label: '10x10 ft (360 booth)', value: '10x10-ft-360-booth' }, { label: 'Outdoor (level ground, weather cover)', value: 'outdoor-level-ground-weather-cover' }],
      },
      {
        key: 'power-requirements',
        label: 'Power Requirements',
        type: 'checkbox',
        options: [{ label: 'Standard 110v outlet', value: 'standard-110v-outlet' }, { label: 'Generator available (extra $___)', value: 'generator-available-extra' }],
      },
      {
        key: 'weather-for-outdoor',
        label: 'Weather for Outdoor',
        type: 'checkbox',
        options: [{ label: 'Tent/canopy included', value: 'tent-canopy-included' }, { label: 'No protection (clear weather only)', value: 'no-protection-clear-weather-only' }],
      },
      {
        key: 'branding-customization',
        label: 'Branding / Customization',
        type: 'checkbox',
        options: [{ label: 'Logo on prints', value: 'logo-on-prints' }, { label: 'Custom start/end screen', value: 'custom-start-end-screen' }, { label: 'Text overlay (names, date, hashtag)', value: 'text-overlay-names-date-hashtag' }],
      },
      {
        key: 'social-media-integration',
        label: 'Social Media Integration',
        type: 'checkbox',
        options: [{ label: 'Direct upload to Instagram', value: 'direct-upload-to-instagram' }, { label: 'Hashtag printing', value: 'hashtag-printing' }, { label: 'No integration', value: 'no-integration' }],
      },
      {
        key: 'video-booth-option',
        label: 'Video Booth Option',
        type: 'checkbox',
        options: [{ label: '15-second message recording', value: '15-second-message-recording' }, { label: 'Compilation video after event', value: 'compilation-video-after-event' }, { label: 'Included or add-on', value: 'included-or-add-on' }],
      },
      {
        key: 'price-2-3-hours',
        label: 'Price (2-3 hours)',
        type: 'checkbox',
        options: [{ label: '$300-400', value: '300-400' }, { label: '$400-500', value: '400-500' }, { label: '$500-700', value: '500-700' }, { label: '$700-900', value: '700-900' }, { label: '$900-1,200', value: '900-1-200' }],
      },
      {
        key: 'overtime',
        label: 'Overtime',
        type: 'checkbox',
        options: [{ label: '$50-100 per 30 minutes', value: '50-100-per-30-minutes' }, { label: '$100-150 per hour', value: '100-150-per-hour' }],
      },
      {
        key: 'travel-fee',
        label: 'Travel Fee',
        type: 'checkbox',
        options: [{ label: 'Within 15 miles (free)', value: 'within-15-miles-free' }, { label: '15-30 miles ($___)', value: '15-30-miles' }, { label: '30+ miles ($___)', value: '30-miles' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: '25% (non-refundable)', value: '25-non-refundable' }, { label: 'No deposit (less common)', value: 'no-deposit-less-common' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: '30 days (refund minus deposit)', value: '30-days-refund-minus-deposit' }, { label: '14 days (50%)', value: '14-days-50' }, { label: '7 days (no refund)', value: '7-days-no-refund' }],
      },
      {
        key: 'props-sanitization',
        label: 'Props Sanitization',
        type: 'checkbox',
        options: [{ label: 'Cleaned between events', value: 'cleaned-between-events' }, { label: 'Not visibly sanitized', value: 'not-visibly-sanitized' }],
      },
      {
        key: 'guest-photo-gallery',
        label: 'Guest Photo Gallery',
        type: 'checkbox',
        options: [{ label: 'Host receives all digital files post-event', value: 'host-receives-all-digital-files-post-event' }, { label: 'Included', value: 'included' }, { label: 'Not included (must purchase)', value: 'not-included-must-purchase' }],
      },
      {
        key: 'online-gallery-lifespan',
        label: 'Online Gallery Lifespan',
        type: 'checkbox',
        options: [{ label: '1 month', value: '1-month' }, { label: '3 months', value: '3-months' }, { label: '1 year', value: '1-year' }, { label: 'Forever', value: 'forever' }],
      }
    ],
    'botanical-garden': [
      {
        key: 'garden-type',
        label: 'Garden Type',
        type: 'checkbox',
        options: [{ label: 'Public botanical garden', value: 'public-botanical-garden' }, { label: 'Arboretum (trees focus)', value: 'arboretum-trees-focus' }, { label: 'Conservatory (indoor, tropical)', value: 'conservatory-indoor-tropical' }, { label: 'Japanese garden', value: 'japanese-garden' }, { label: 'Rose garden', value: 'rose-garden' }, { label: 'Desert garden (cacti, succulents)', value: 'desert-garden-cacti-succulents' }, { label: 'Native plant garden', value: 'native-plant-garden' }],
      },
      {
        key: 'size',
        label: 'Size',
        type: 'checkbox',
        options: [{ label: 'Small (under 5 acres)', value: 'small-under-5-acres' }, { label: 'Medium (5-25 acres)', value: 'medium-5-25-acres' }, { label: 'Large (25-100 acres)', value: 'large-25-100-acres' }, { label: 'Extensive (100+ acres)', value: 'extensive-100-acres' }],
      },
      {
        key: 'seasonal-highlights',
        label: 'Seasonal Highlights',
        type: 'checkbox',
        options: [{ label: 'Spring (tulips, cherry blossoms)', value: 'spring-tulips-cherry-blossoms' }, { label: 'Summer (roses, hydrangeas)', value: 'summer-roses-hydrangeas' }, { label: 'Fall (chrysanthemums, foliage)', value: 'fall-chrysanthemums-foliage' }, { label: 'Winter (poinsettias, camellias)', value: 'winter-poinsettias-camellias' }, { label: 'Year-round (tropical conservatory)', value: 'year-round-tropical-conservatory' }],
      },
      {
        key: 'admission',
        label: 'Admission',
        type: 'checkbox',
        options: [{ label: 'Free', value: 'free' }, { label: '$5-10', value: '5-10' }, { label: '$10-15', value: '10-15' }, { label: '$15-25', value: '15-25' }, { label: '$25+ (special exhibits)', value: '25-special-exhibits' }],
      },
      {
        key: 'membership',
        label: 'Membership',
        type: 'checkbox',
        options: [{ label: 'Individual ($___/year)', value: 'individual-year' }, { label: 'Family ($___/year)', value: 'family-year' }, { label: 'Reciprocal (admission to other gardens)', value: 'reciprocal-admission-to-other-gardens' }],
      },
      {
        key: 'photography-policy',
        label: 'Photography Policy',
        type: 'checkbox',
        options: [{ label: 'Personal (free)', value: 'personal-free' }, { label: 'Engagement / portrait (fee, $___)', value: 'engagement-portrait-fee' }, { label: 'Wedding (fee + permit)', value: 'wedding-fee-permit' }, { label: 'Commercial (day rate + permit)', value: 'commercial-day-rate-permit' }, { label: 'No tripods (handheld only)', value: 'no-tripods-handheld-only' }, { label: 'No drones', value: 'no-drones' }],
      },
      {
        key: 'event-rental',
        label: 'Event Rental',
        type: 'checkbox',
        options: [{ label: 'Wedding ceremonies', value: 'wedding-ceremonies' }, { label: 'Wedding receptions', value: 'wedding-receptions' }, { label: 'Corporate events', value: 'corporate-events' }, { label: 'Private parties', value: 'private-parties' }],
      },
      {
        key: 'hours',
        label: 'Hours',
        type: 'checkbox',
        options: [{ label: 'Sunrise to sunset (outdoor)', value: 'sunrise-to-sunset-outdoor' }, { label: 'Specific hours (conservatory)', value: 'specific-hours-conservatory' }, { label: 'Closed certain holidays', value: 'closed-certain-holidays' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Free lot', value: 'free-lot' }, { label: 'Paid lot ($___)', value: 'paid-lot' }, { label: 'Street parking', value: 'street-parking' }, { label: 'No parking (public transit)', value: 'no-parking-public-transit' }],
      },
      {
        key: 'cafe-restaurant',
        label: 'Cafe / Restaurant',
        type: 'checkbox',
        options: [{ label: 'Yes (full menu)', value: 'yes-full-menu' }, { label: 'Yes (snacks, coffee)', value: 'yes-snacks-coffee' }, { label: 'No (vending only)', value: 'no-vending-only' }],
      },
      {
        key: 'gift-shop',
        label: 'Gift Shop',
        type: 'checkbox',
        options: [{ label: 'Yes (plants, books, souvenirs)', value: 'yes-plants-books-souvenirs' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        type: 'checkbox',
        options: [{ label: 'Paved paths (wheelchair)', value: 'paved-paths-wheelchair' }, { label: 'Some gravel (difficult)', value: 'some-gravel-difficult' }, { label: 'ADA accessible (entire garden)', value: 'ada-accessible-entire-garden' }],
      },
      {
        key: 'restrooms',
        label: 'Restrooms',
        type: 'checkbox',
        options: [{ label: 'Multiple locations', value: 'multiple-locations' }, { label: 'Limited (at entrance only)', value: 'limited-at-entrance-only' }, { label: 'Porta-potties (seasonal)', value: 'porta-potties-seasonal' }],
      },
      {
        key: 'dogs',
        label: 'Dogs',
        type: 'checkbox',
        options: [{ label: 'Leashed allowed', value: 'leashed-allowed' }, { label: 'Service animals only', value: 'service-animals-only' }, { label: 'No pets', value: 'no-pets' }],
      },
      {
        key: 'picnicking',
        label: 'Picnicking',
        type: 'checkbox',
        options: [{ label: 'Allowed (designated areas)', value: 'allowed-designated-areas' }, { label: 'Not allowed', value: 'not-allowed' }],
      },
      {
        key: 'special-events',
        label: 'Special Events',
        type: 'checkbox',
        options: [{ label: 'Concert series', value: 'concert-series' }, { label: 'Plant sales', value: 'plant-sales' }, { label: 'Classes / workshops', value: 'classes-workshops' }, { label: 'Holiday light show', value: 'holiday-light-show' }],
      },
      {
        key: 'map-brochure',
        label: 'Map / Brochure',
        type: 'checkbox',
        options: [{ label: 'Available (paper)', value: 'available-paper' }, { label: 'App (digital)', value: 'app-digital' }, { label: 'No (follow signs)', value: 'no-follow-signs' }],
      }
    ],
    'castle': [
      {
        key: 'castle-type',
        label: 'Castle Type',
        type: 'checkbox',
        options: [{ label: 'Medieval castle (historic)', value: 'medieval-castle-historic' }, { label: 'Victorian castle (19th century)', value: 'victorian-castle-19th-century' }, { label: 'Replica / modern castle', value: 'replica-modern-castle' }, { label: 'Ruins (unrestored)', value: 'ruins-unrestored' }, { label: 'Restored (tours available)', value: 'restored-tours-available' }, { label: 'Castle hotel (lodging)', value: 'castle-hotel-lodging' }, { label: 'Castle wedding venue', value: 'castle-wedding-venue' }],
      },
      {
        key: 'era',
        label: 'Era',
        type: 'checkbox',
        options: [{ label: '1000-1200 AD', value: '1000-1200-ad' }, { label: '1200-1400 AD', value: '1200-1400-ad' }, { label: '1400-1600 AD', value: '1400-1600-ad' }, { label: '1600-1800 AD', value: '1600-1800-ad' }, { label: '1800-1900 AD', value: '1800-1900-ad' }, { label: 'Modern (1900+)', value: 'modern-1900' }],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        type: 'checkbox',
        options: [{ label: 'Tours available (guided)', value: 'tours-available-guided' }, { label: 'Self-guided (audio)', value: 'self-guided-audio' }, { label: 'Exterior only (interior closed)', value: 'exterior-only-interior-closed' }, { label: 'Ruins (enter at own risk)', value: 'ruins-enter-at-own-risk' }],
      },
      {
        key: 'admission',
        label: 'Admission',
        type: 'checkbox',
        options: [{ label: 'Free (exterior only)', value: 'free-exterior-only' }, { label: '$5-10', value: '5-10' }, { label: '$10-15', value: '10-15' }, { label: '$15-25', value: '15-25' }, { label: '$25+ (special tours)', value: '25-special-tours' }],
      },
      {
        key: 'weddings-on-site',
        label: 'Weddings On-Site',
        type: 'checkbox',
        options: [{ label: 'Yes (ceremony)', value: 'yes-ceremony' }, { label: 'Yes (reception)', value: 'yes-reception' }, { label: 'Yes (elopement package)', value: 'yes-elopement-package' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'overnight-stays',
        label: 'Overnight Stays',
        type: 'checkbox',
        options: [{ label: 'Castle hotel (book room)', value: 'castle-hotel-book-room' }, { label: 'Castle rental (entire property)', value: 'castle-rental-entire-property' }, { label: 'No lodging', value: 'no-lodging' }],
      },
      {
        key: 'photo-permit',
        label: 'Photo Permit',
        type: 'checkbox',
        options: [{ label: 'Personal (free or included)', value: 'personal-free-or-included' }, { label: 'Professional / engagement ($___)', value: 'professional-engagement' }, { label: 'Wedding ($___)', value: 'wedding' }],
      },
      {
        key: 'ghost-haunted-reputation',
        label: 'Ghost / Haunted Reputation',
        type: 'checkbox',
        options: [{ label: 'Yes (reported hauntings)', value: 'yes-reported-hauntings' }, { label: 'Not known', value: 'not-known' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Free lot', value: 'free-lot' }, { label: 'Paid lot', value: 'paid-lot' }, { label: 'Street (limited)', value: 'street-limited' }],
      },
      {
        key: 'restaurant-tea-room',
        label: 'Restaurant / Tea Room',
        type: 'checkbox',
        options: [{ label: 'Yes (on-site)', value: 'yes-on-site' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'gift-shop',
        label: 'Gift Shop',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'dress-code-if-touring',
        label: 'Dress Code (if touring)',
        type: 'checkbox',
        options: [{ label: 'Casual', value: 'casual' }, { label: 'No costumes (except events)', value: 'no-costumes-except-events' }],
      },
      {
        key: 'restoration-status',
        label: 'Restoration Status',
        type: 'checkbox',
        options: [{ label: 'Original condition', value: 'original-condition' }, { label: 'Partially restored', value: 'partially-restored' }, { label: 'Fully restored', value: 'fully-restored' }, { label: 'Stabilized ruins', value: 'stabilized-ruins' }],
      },
      {
        key: 'moats-drawbridges',
        label: 'Moats / Drawbridges',
        type: 'checkbox',
        options: [{ label: 'Yes (original)', value: 'yes-original' }, { label: 'Yes (reconstructed)', value: 'yes-reconstructed' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'tours-available-in-languages',
        label: 'Tours Available in Languages',
        type: 'checkbox',
        options: [{ label: 'English', value: 'english' }, { label: 'Spanish', value: 'spanish' }, { label: 'French', value: 'french' }, { label: 'German', value: 'german' }, { label: 'Japanese', value: 'japanese' }, { label: 'Audio guide (multiple)', value: 'audio-guide-multiple' }],
      },
      {
        key: 'group-tours',
        label: 'Group Tours',
        type: 'checkbox',
        options: [{ label: 'Yes (advance booking)', value: 'yes-advance-booking' }, { label: 'Walk-up (limited)', value: 'walk-up-limited' }],
      },
      {
        key: 'special-events',
        label: 'Special Events',
        type: 'checkbox',
        options: [{ label: 'Renaissance fair', value: 'renaissance-fair' }, { label: 'Jousting tournaments', value: 'jousting-tournaments' }, { label: 'Candlelight tours', value: 'candlelight-tours' }, { label: 'Christmas market', value: 'christmas-market' }],
      }
    ],
    'palace': [
      {
        key: 'palace-type',
        label: 'Palace Type',
        type: 'checkbox',
        options: [{ label: 'Royal palace (former residence)', value: 'royal-palace-former-residence' }, { label: 'Government palace (official use)', value: 'government-palace-official-use' }, { label: 'Historic palace (museum)', value: 'historic-palace-museum' }, { label: 'Bishop\'s palace (religious)', value: 'bishop-s-palace-religious' }, { label: 'Summer palace (seasonal)', value: 'summer-palace-seasonal' }],
      },
      {
        key: 'architectural-style',
        label: 'Architectural Style',
        type: 'checkbox',
        options: [{ label: 'Baroque', value: 'baroque' }, { label: 'Renaissance', value: 'renaissance' }, { label: 'Neoclassical', value: 'neoclassical' }, { label: 'Rococo', value: 'rococo' }, { label: 'Gothic', value: 'gothic' }, { label: 'Moorish', value: 'moorish' }, { label: 'Russian Imperial', value: 'russian-imperial' }, { label: 'Asian (Forbidden City style)', value: 'asian-forbidden-city-style' }],
      },
      {
        key: 'rooms-areas-accessible',
        label: 'Rooms / Areas Accessible',
        type: 'checkbox',
        options: [{ label: 'Throne room', value: 'throne-room' }, { label: 'Ballroom', value: 'ballroom' }, { label: 'State apartments', value: 'state-apartments' }, { label: 'Royal bedrooms', value: 'royal-bedrooms' }, { label: 'Gardens / grounds', value: 'gardens-grounds' }, { label: 'Chapel', value: 'chapel' }, { label: 'Kitchens (some)', value: 'kitchens-some' }, { label: 'Stables (carriage museum)', value: 'stables-carriage-museum' }],
      },
      {
        key: 'tours',
        label: 'Tours',
        type: 'checkbox',
        options: [{ label: 'Guided (included)', value: 'guided-included' }, { label: 'Self-guided (audio)', value: 'self-guided-audio' }, { label: 'Virtual tour (online)', value: 'virtual-tour-online' }, { label: 'Behind the scenes (extra fee)', value: 'behind-the-scenes-extra-fee' }],
      },
      {
        key: 'admission',
        label: 'Admission',
        type: 'checkbox',
        options: [{ label: '$5-10', value: '5-10' }, { label: '$10-15', value: '10-15' }, { label: '$15-25', value: '15-25' }, { label: '$25-40', value: '25-40' }, { label: '$40+ (skip the line)', value: '40-skip-the-line' }],
      },
      {
        key: 'audio-guide-included',
        label: 'Audio Guide Included',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No (extra $___)', value: 'no-extra' }],
      },
      {
        key: 'gardens-only-admission',
        label: 'Gardens Only Admission',
        type: 'checkbox',
        options: [{ label: 'Yes (cheaper)', value: 'yes-cheaper' }, { label: 'No (one ticket)', value: 'no-one-ticket' }],
      },
      {
        key: 'photography',
        label: 'Photography',
        type: 'checkbox',
        options: [{ label: 'Allowed (no flash)', value: 'allowed-no-flash' }, { label: 'No photography (interior)', value: 'no-photography-interior' }, { label: 'No tripods', value: 'no-tripods' }],
      },
      {
        key: 'event-rental',
        label: 'Event Rental',
        type: 'checkbox',
        options: [{ label: 'Yes (gala, wedding, corporate)', value: 'yes-gala-wedding-corporate' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'cafe-restaurant',
        label: 'Cafe / Restaurant',
        type: 'checkbox',
        options: [{ label: 'Yes (cafe)', value: 'yes-cafe' }, { label: 'Yes (fine dining)', value: 'yes-fine-dining' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'gift-shop',
        label: 'Gift Shop',
        type: 'checkbox',
        options: [{ label: 'Yes (luxury goods, books)', value: 'yes-luxury-goods-books' }, { label: 'Yes (standard souvenirs)', value: 'yes-standard-souvenirs' }],
      },
      {
        key: 'crowd-level',
        label: 'Crowd Level',
        type: 'checkbox',
        options: [{ label: 'Very busy (peak season)', value: 'very-busy-peak-season' }, { label: 'Moderate', value: 'moderate' }, { label: 'Quiet (off-season)', value: 'quiet-off-season' }],
      },
      {
        key: 'skip-the-line-ticket',
        label: 'Skip the Line Ticket',
        type: 'checkbox',
        options: [{ label: 'Yes (extra)', value: 'yes-extra' }, { label: 'No (everyone waits)', value: 'no-everyone-waits' }],
      },
      {
        key: 'combination-ticket-with-other-sites',
        label: 'Combination Ticket with Other Sites',
        type: 'checkbox',
        options: [{ label: 'Yes (multiple palaces/museums)', value: 'yes-multiple-palaces-museums' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'bag-check-lockers',
        label: 'Bag Check / Lockers',
        type: 'checkbox',
        options: [{ label: 'Required (large bags)', value: 'required-large-bags' }, { label: 'Available (free or fee)', value: 'available-free-or-fee' }],
      },
      {
        key: 'dress-code',
        label: 'Dress Code',
        type: 'checkbox',
        options: [{ label: 'Casual (tours)', value: 'casual-tours' }, { label: 'Formal (special events)', value: 'formal-special-events' }],
      },
      {
        key: 'royal-family-still-in-residence',
        label: 'Royal Family Still in Residence',
        type: 'checkbox',
        options: [{ label: 'Yes (partial access)', value: 'yes-partial-access' }, { label: 'No (full access)', value: 'no-full-access' }],
      },
      {
        key: 'changing-of-the-guard',
        label: 'Changing of the Guard',
        type: 'checkbox',
        options: [{ label: 'Yes (daily or select days)', value: 'yes-daily-or-select-days' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'audio-video-guides',
        label: 'Audio / Video Guides',
        type: 'checkbox',
        options: [{ label: 'Handheld device', value: 'handheld-device' }, { label: 'Smartphone app', value: 'smartphone-app' }, { label: 'QR code (your phone)', value: 'qr-code-your-phone' }],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        type: 'checkbox',
        options: [{ label: 'Wheelchair accessible (main floors)', value: 'wheelchair-accessible-main-floors' }, { label: 'Limited (stairs to upper floors)', value: 'limited-stairs-to-upper-floors' }, { label: 'Elevator available', value: 'elevator-available' }],
      }
    ],
    'landmarks-historic-monument': [
      {
        key: 'monument-type',
        label: 'Monument Type',
        type: 'checkbox',
        options: [{ label: 'National monument', value: 'national-monument' }, { label: 'Statue / memorial', value: 'statue-memorial' }, { label: 'Historic building', value: 'historic-building' }, { label: 'Battleship / military', value: 'battleship-military' }, { label: 'Lighthouse', value: 'lighthouse' }, { label: 'Bridge', value: 'bridge' }, { label: 'Archaeological site', value: 'archaeological-site' }, { label: 'UNESCO World Heritage site', value: 'unesco-world-heritage-site' }],
      },
      {
        key: 'significance',
        label: 'Significance',
        type: 'checkbox',
        options: [{ label: 'Historical event', value: 'historical-event' }, { label: 'Famous person', value: 'famous-person' }, { label: 'Architectural achievement', value: 'architectural-achievement' }, { label: 'Cultural symbol', value: 'cultural-symbol' }, { label: 'Natural landmark', value: 'natural-landmark' }],
      },
      {
        key: 'admission',
        label: 'Admission',
        type: 'checkbox',
        options: [{ label: 'Free (exterior)', value: 'free-exterior' }, { label: 'Free (all)', value: 'free-all' }, { label: '$5-10', value: '5-10' }, { label: '$10-15', value: '10-15' }, { label: '$15-20', value: '15-20' }, { label: '$20-30', value: '20-30' }, { label: '$30+ (with tour)', value: '30-with-tour' }],
      },
      {
        key: 'national-park-monument-pass-accepted',
        label: 'National Park / Monument Pass Accepted',
        type: 'checkbox',
        options: [{ label: 'Yes (America the Beautiful)', value: 'yes-america-the-beautiful' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'tours-available',
        label: 'Tours Available',
        type: 'checkbox',
        options: [{ label: 'Self-guided', value: 'self-guided' }, { label: 'Guided (included)', value: 'guided-included' }, { label: 'Guided (extra fee)', value: 'guided-extra-fee' }, { label: 'Audio tour (app or device)', value: 'audio-tour-app-or-device' }, { label: 'Ranger-led (seasonal)', value: 'ranger-led-seasonal' }],
      },
      {
        key: 'tour-duration',
        label: 'Tour Duration',
        type: 'checkbox',
        options: [{ label: '15 minutes (quick stop)', value: '15-minutes-quick-stop' }, { label: '30 minutes', value: '30-minutes' }, { label: '45-60 minutes', value: '45-60-minutes' }, { label: '90+ minutes', value: '90-minutes' }],
      },
      {
        key: 'hours',
        label: 'Hours',
        type: 'checkbox',
        options: [{ label: '24/7 (exterior)', value: '24-7-exterior' }, { label: 'Specific hours (interior)', value: 'specific-hours-interior' }, { label: 'Seasonal hours', value: 'seasonal-hours' }, { label: 'Closed certain holidays', value: 'closed-certain-holidays' }],
      },
      {
        key: 'best-time-to-visit',
        label: 'Best Time to Visit',
        type: 'checkbox',
        options: [{ label: 'Early morning (fewer crowds)', value: 'early-morning-fewer-crowds' }, { label: 'Sunset (best photos)', value: 'sunset-best-photos' }, { label: 'Weekday (less busy)', value: 'weekday-less-busy' }],
      },
      {
        key: 'photography',
        label: 'Photography',
        type: 'checkbox',
        options: [{ label: 'Allowed (personal)', value: 'allowed-personal' }, { label: 'Permit required (professional)', value: 'permit-required-professional' }, { label: 'No tripods', value: 'no-tripods' }, { label: 'No drones (airspace restrictions)', value: 'no-drones-airspace-restrictions' }],
      },
      {
        key: 'crowds',
        label: 'Crowds',
        type: 'checkbox',
        options: [{ label: 'Very busy (peak hours)', value: 'very-busy-peak-hours' }, { label: 'Moderate', value: 'moderate' }, { label: 'Quiet (off-season)', value: 'quiet-off-season' }],
      },
      {
        key: 'parking',
        label: 'Parking',
        type: 'checkbox',
        options: [{ label: 'Free lot', value: 'free-lot' }, { label: 'Paid lot ($___)', value: 'paid-lot' }, { label: 'Street (metered)', value: 'street-metered' }, { label: 'No parking (public transit)', value: 'no-parking-public-transit' }],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        type: 'checkbox',
        options: [{ label: 'Wheelchair accessible (main area)', value: 'wheelchair-accessible-main-area' }, { label: 'Limited (stairs, uneven ground)', value: 'limited-stairs-uneven-ground' }, { label: 'Not accessible', value: 'not-accessible' }],
      },
      {
        key: 'restrooms',
        label: 'Restrooms',
        type: 'checkbox',
        options: [{ label: 'On-site', value: 'on-site' }, { label: 'Nearby (walking distance)', value: 'nearby-walking-distance' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'gift-shop',
        label: 'Gift Shop',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'food-drink',
        label: 'Food / Drink',
        type: 'checkbox',
        options: [{ label: 'Vending machines', value: 'vending-machines' }, { label: 'Cafe nearby', value: 'cafe-nearby' }, { label: 'No (bring your own)', value: 'no-bring-your-own' }],
      },
      {
        key: 'dogs',
        label: 'Dogs',
        type: 'checkbox',
        options: [{ label: 'Leashed (exterior)', value: 'leashed-exterior' }, { label: 'Service animals only (interior)', value: 'service-animals-only-interior' }, { label: 'No pets', value: 'no-pets' }],
      },
      {
        key: 'night-illumination',
        label: 'Night Illumination',
        type: 'checkbox',
        options: [{ label: 'Yes (lights on after dark)', value: 'yes-lights-on-after-dark' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'commemorative-plaque-marker',
        label: 'Commemorative Plaque / Marker',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'interactive-audio-video-displays',
        label: 'Interactive / Audio / Video Displays',
        type: 'checkbox',
        options: [{ label: 'Yes (museum style)', value: 'yes-museum-style' }, { label: 'Minimal (signage only)', value: 'minimal-signage-only' }, { label: 'None', value: 'none' }],
      },
      {
        key: 'reservation-required',
        label: 'Reservation Required',
        type: 'checkbox',
        options: [{ label: 'Yes (limited entry)', value: 'yes-limited-entry' }, { label: 'No (walk-up)', value: 'no-walk-up' }],
      },
      {
        key: 'name-inscription',
        label: 'Name / Inscription',
        type: 'checkbox',
        options: [{ label: 'Visible and legible', value: 'visible-and-legible' }, { label: 'Worn but readable', value: 'worn-but-readable' }, { label: 'Damaged (under restoration)', value: 'damaged-under-restoration' }],
      }
    ],
    'image-consultant': [
      {
        key: 'consultant-type',
        label: 'Consultant Type',
        type: 'checkbox',
        options: [{ label: 'Personal stylist (wardrobe)', value: 'personal-stylist-wardrobe' }, { label: 'Color analysis', value: 'color-analysis' }, { label: 'Body shape analysis', value: 'body-shape-analysis' }, { label: 'Professional branding', value: 'professional-branding' }, { label: 'Executive presence', value: 'executive-presence' }, { label: 'Dating / social image', value: 'dating-social-image' }, { label: 'Closet audit / organization', value: 'closet-audit-organization' }, { label: 'Personal shopping', value: 'personal-shopping' }],
      },
      {
        key: 'services',
        label: 'Services',
        type: 'checkbox',
        options: [{ label: 'In-person consultation', value: 'in-person-consultation' }, { label: 'Virtual consultation', value: 'virtual-consultation' }, { label: 'Half day (4 hours)', value: 'half-day-4-hours' }, { label: 'Full day (8 hours)', value: 'full-day-8-hours' }, { label: 'Multi-day package', value: 'multi-day-package' }],
      },
      {
        key: 'price-consultation-1-2-hours',
        label: 'Price - Consultation (1-2 hours)',
        type: 'checkbox',
        options: [{ label: '$100-150', value: '100-150' }, { label: '$150-250', value: '150-250' }, { label: '$250-350', value: '250-350' }, { label: '$350-500', value: '350-500' }],
      },
      {
        key: 'price-full-day-package',
        label: 'Price - Full Day Package',
        type: 'checkbox',
        options: [{ label: '$500-800', value: '500-800' }, { label: '$800-1,200', value: '800-1-200' }, { label: '$1,200-2,000', value: '1-200-2-000' }],
      },
      {
        key: 'color-analysis',
        label: 'Color Analysis',
        type: 'checkbox',
        options: [{ label: 'Seasonal (spring, summer, autumn, winter)', value: 'seasonal-spring-summer-autumn-winter' }, { label: 'Custom fan deck provided', value: 'custom-fan-deck-provided' }, { label: 'Included or add-on', value: 'included-or-add-on' }],
      },
      {
        key: 'wardrobe-audit',
        label: 'Wardrobe Audit',
        type: 'checkbox',
        options: [{ label: 'In-home (photograph items)', value: 'in-home-photograph-items' }, { label: 'Virtual (client sends photos)', value: 'virtual-client-sends-photos' }, { label: 'Follow-up shopping list', value: 'follow-up-shopping-list' }],
      },
      {
        key: 'personal-shopping',
        label: 'Personal Shopping',
        type: 'checkbox',
        options: [{ label: 'Hourly rate ($___/hour)', value: 'hourly-rate-hour' }, { label: 'Flat fee per trip', value: 'flat-fee-per-trip' }, { label: 'Client pays for clothing', value: 'client-pays-for-clothing' }],
      },
      {
        key: 'gender-specialty',
        label: 'Gender Specialty',
        type: 'checkbox',
        options: [{ label: 'Women only', value: 'women-only' }, { label: 'Men only', value: 'men-only' }, { label: 'All genders', value: 'all-genders' }],
      },
      {
        key: 'age-specialty',
        label: 'Age Specialty',
        type: 'checkbox',
        options: [{ label: 'Young adult (20s-30s)', value: 'young-adult-20s-30s' }, { label: 'Mid-career (30s-50s)', value: 'mid-career-30s-50s' }, { label: 'Senior (50+)', value: 'senior-50' }, { label: 'All ages', value: 'all-ages' }],
      },
      {
        key: 'body-type-expertise',
        label: 'Body Type Expertise',
        type: 'checkbox',
        options: [{ label: 'Petite', value: 'petite' }, { label: 'Plus size', value: 'plus-size' }, { label: 'Tall', value: 'tall' }, { label: 'Athletic', value: 'athletic' }, { label: 'Maternity', value: 'maternity' }, { label: 'Post-partum', value: 'post-partum' }, { label: 'All body types', value: 'all-body-types' }],
      },
      {
        key: 'digital-deliverables',
        label: 'Digital Deliverables',
        type: 'checkbox',
        options: [{ label: 'Look book (PDF)', value: 'look-book-pdf' }, { label: 'Shopping list with links', value: 'shopping-list-with-links' }, { label: 'Outfit collage', value: 'outfit-collage' }, { label: 'Packing guide (travel)', value: 'packing-guide-travel' }],
      },
      {
        key: 'follow-up-support',
        label: 'Follow-up Support',
        type: 'checkbox',
        options: [{ label: 'Email for ___ days', value: 'email-for-days' }, { label: '1 follow-up call', value: '1-follow-up-call' }, { label: 'No follow-up', value: 'no-follow-up' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: '48 hours (free)', value: '48-hours-free' }, { label: '24 hours (50%)', value: '24-hours-50' }, { label: 'No-show (100%)', value: 'no-show-100' }],
      },
      {
        key: 'gift-certificates',
        label: 'Gift Certificates',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'corporate-gift-supplier': [
      {
        key: 'gift-types',
        label: 'Gift Types',
        type: 'checkbox',
        options: [{ label: 'Custom branded gifts', value: 'custom-branded-gifts' }, { label: 'Holiday gifts for employees', value: 'holiday-gifts-for-employees' }, { label: 'Client appreciation gifts', value: 'client-appreciation-gifts' }, { label: 'Swag bags (conferences)', value: 'swag-bags-conferences' }, { label: 'Welcome kits (new hires)', value: 'welcome-kits-new-hires' }, { label: 'Retirement gifts', value: 'retirement-gifts' }, { label: 'Milestone anniversary gifts', value: 'milestone-anniversary-gifts' }],
      },
      {
        key: 'product-categories',
        label: 'Product Categories',
        type: 'checkbox',
        options: [{ label: 'Drinkware (mugs, tumblers, water bottles)', value: 'drinkware-mugs-tumblers-water-bottles' }, { label: 'Apparel (shirts, jackets, hats)', value: 'apparel-shirts-jackets-hats' }, { label: 'Tech (power banks, USB drives, headphones)', value: 'tech-power-banks-usb-drives-headphones' }, { label: 'Desk accessories (pens, notebooks, mouse pads)', value: 'desk-accessories-pens-notebooks-mouse-pads' }, { label: 'Food & drink (gourmet snacks, wine, chocolate)', value: 'food-drink-gourmet-snacks-wine-chocolate' }, { label: 'Outdoor (blankets, coolers, camping gear)', value: 'outdoor-blankets-coolers-camping-gear' }, { label: 'Wellness (fitness trackers, yoga mats)', value: 'wellness-fitness-trackers-yoga-mats' }, { label: 'Bags (backpacks, totes, duffels)', value: 'bags-backpacks-totes-duffels' }],
      },
      {
        key: 'budget-per-gift',
        label: 'Budget per Gift',
        type: 'checkbox',
        options: [{ label: 'Under $10', value: 'under-10' }, { label: '$10-25', value: '10-25' }, { label: '$25-50', value: '25-50' }, { label: '$50-100', value: '50-100' }, { label: '$100-250', value: '100-250' }, { label: '$250-500', value: '250-500' }, { label: '$500+', value: '500' }],
      },
      {
        key: 'quantity',
        label: 'Quantity',
        type: 'checkbox',
        options: [{ label: 'Small (10-50)', value: 'small-10-50' }, { label: 'Medium (51-250)', value: 'medium-51-250' }, { label: 'Large (251-1,000)', value: 'large-251-1-000' }, { label: 'Bulk (1,000-5,000)', value: 'bulk-1-000-5-000' }, { label: 'Enterprise (5,000+)', value: 'enterprise-5-000' }],
      },
      {
        key: 'branding-methods',
        label: 'Branding Methods',
        type: 'checkbox',
        options: [{ label: 'Screen print', value: 'screen-print' }, { label: 'Embroidery', value: 'embroidery' }, { label: 'Laser engraving', value: 'laser-engraving' }, { label: 'Debossing', value: 'debossing' }, { label: 'Pad print', value: 'pad-print' }, { label: 'Full color digital', value: 'full-color-digital' }],
      },
      {
        key: 'logo-setup-fee',
        label: 'Logo Setup Fee',
        type: 'checkbox',
        options: [{ label: '$0 (waived for large orders)', value: '0-waived-for-large-orders' }, { label: '$25-50', value: '25-50' }, { label: '$50-100', value: '50-100' }],
      },
      {
        key: 'artwork-requirements',
        label: 'Artwork Requirements',
        type: 'checkbox',
        options: [{ label: 'Vector file (AI, EPS)', value: 'vector-file-ai-eps' }, { label: 'High res PNG / JPG', value: 'high-res-png-jpg' }, { label: 'Design assistance available', value: 'design-assistance-available' }],
      },
      {
        key: 'samples-available',
        label: 'Samples Available',
        type: 'checkbox',
        options: [{ label: 'Yes (fee, refundable with order)', value: 'yes-fee-refundable-with-order' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'production-time',
        label: 'Production Time',
        type: 'checkbox',
        options: [{ label: '5-7 business days', value: '5-7-business-days' }, { label: '10-14 business days', value: '10-14-business-days' }, { label: '3-4 weeks', value: '3-4-weeks' }, { label: '5-6 weeks (custom)', value: '5-6-weeks-custom' }],
      },
      {
        key: 'rush-production',
        label: 'Rush Production',
        type: 'checkbox',
        options: [{ label: 'Yes (2-3 days, fee)', value: 'yes-2-3-days-fee' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'shipping',
        label: 'Shipping',
        type: 'checkbox',
        options: [{ label: 'Ground (3-5 days)', value: 'ground-3-5-days' }, { label: 'Expedited (2 days)', value: 'expedited-2-days' }, { label: 'Overnight', value: 'overnight' }, { label: 'Drop ship to multiple addresses', value: 'drop-ship-to-multiple-addresses' }],
      },
      {
        key: 'custom-packaging',
        label: 'Custom Packaging',
        type: 'checkbox',
        options: [{ label: 'Gift box included', value: 'gift-box-included' }, { label: 'Custom tissue / ribbon (extra)', value: 'custom-tissue-ribbon-extra' }, { label: 'Branded box (extra)', value: 'branded-box-extra' }, { label: 'None (poly bag)', value: 'none-poly-bag' }],
      },
      {
        key: 'personalization-names',
        label: 'Personalization (names)',
        type: 'checkbox',
        options: [{ label: 'Yes (each item individual name)', value: 'yes-each-item-individual-name' }, { label: 'Minimum 25 pieces', value: 'minimum-25-pieces' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'eco-friendly-options',
        label: 'Eco-Friendly Options',
        type: 'checkbox',
        options: [{ label: 'Recycled materials', value: 'recycled-materials' }, { label: 'Plastic-free packaging', value: 'plastic-free-packaging' }, { label: 'Donation to charity instead of gift', value: 'donation-to-charity-instead-of-gift' }],
      },
      {
        key: 'gift-wrapping-assembly',
        label: 'Gift Wrapping / Assembly',
        type: 'checkbox',
        options: [{ label: 'Included (basic)', value: 'included-basic' }, { label: 'White glove assembly (extra)', value: 'white-glove-assembly-extra' }],
      },
      {
        key: 'corporate-account-net-terms',
        label: 'Corporate Account / Net Terms',
        type: 'checkbox',
        options: [{ label: 'Yes (net 30 for qualified)', value: 'yes-net-30-for-qualified' }, { label: 'No (prepay)', value: 'no-prepay' }],
      },
      {
        key: 'tax-exempt',
        label: 'Tax Exempt',
        type: 'checkbox',
        options: [{ label: 'Provide certificate', value: 'provide-certificate' }, { label: 'Not applicable', value: 'not-applicable' }],
      }
    ],
    'calligraphy': [
      {
        key: 'artist-type',
        label: 'Artist Type',
        type: 'checkbox',
        options: [{ label: 'Traditional calligraphy (dip pen)', value: 'traditional-calligraphy-dip-pen' }, { label: 'Modern calligraphy (brush pen)', value: 'modern-calligraphy-brush-pen' }, { label: 'Digital calligraphy (iPad Pro)', value: 'digital-calligraphy-ipad-pro' }, { label: 'Engraving (glass, metal)', value: 'engraving-glass-metal' }, { label: 'Chalkboard / signage', value: 'chalkboard-signage' }],
      },
      {
        key: 'services',
        label: 'Services',
        type: 'checkbox',
        options: [{ label: 'Envelope addressing (wedding, event)', value: 'envelope-addressing-wedding-event' }, { label: 'Place cards (wedding, dinner)', value: 'place-cards-wedding-dinner' }, { label: 'Escort cards / seating chart', value: 'escort-cards-seating-chart' }, { label: 'Menus', value: 'menus' }, { label: 'Signs (welcome, bar, directional)', value: 'signs-welcome-bar-directional' }, { label: 'Certificates / awards', value: 'certificates-awards' }, { label: 'Custom art prints (quote, poem)', value: 'custom-art-prints-quote-poem' }, { label: 'Logo / wordmark', value: 'logo-wordmark' }, { label: 'Tattoo design', value: 'tattoo-design' }],
      },
      {
        key: 'pricing-models',
        label: 'Pricing Models',
        type: 'checkbox',
        options: [{ label: 'Per envelope ($___ each)', value: 'per-envelope-each' }, { label: 'Per place card ($___ each)', value: 'per-place-card-each' }, { label: 'Per sign (size + complexity)', value: 'per-sign-size-complexity' }, { label: 'Hourly rate ($___/hour)', value: 'hourly-rate-hour' }, { label: 'Flat project fee', value: 'flat-project-fee' }],
      },
      {
        key: 'envelope-addressing-price',
        label: 'Envelope Addressing Price',
        type: 'checkbox',
        options: [{ label: '$2-3 per envelope', value: '2-3-per-envelope' }, { label: '$3-4', value: '3-4' }, { label: '$4-5', value: '4-5' }, { label: '$5-7 (calligraphy + return address)', value: '5-7-calligraphy-return-address' }],
      },
      {
        key: 'place-cards-price',
        label: 'Place Cards Price',
        type: 'checkbox',
        options: [{ label: '$1-1.50', value: '1-1-50' }, { label: '$1.50-2', value: '1-50-2' }, { label: '$2-3', value: '2-3' }],
      },
      {
        key: 'turnaround-time',
        label: 'Turnaround Time',
        type: 'checkbox',
        options: [{ label: '1 week (small order)', value: '1-week-small-order' }, { label: '2-3 weeks (wedding, 100+ pieces)', value: '2-3-weeks-wedding-100-pieces' }, { label: '4-6 weeks (peak season)', value: '4-6-weeks-peak-season' }, { label: 'Rush available (fee)', value: 'rush-available-fee' }],
      },
      {
        key: 'digital-vs-physical',
        label: 'Digital vs Physical',
        type: 'checkbox',
        options: [{ label: 'Physical (mailed to client)', value: 'physical-mailed-to-client' }, { label: 'Digital (PDF, print yourself)', value: 'digital-pdf-print-yourself' }],
      },
      {
        key: 'ink-colors',
        label: 'Ink Colors',
        type: 'checkbox',
        options: [{ label: 'Black (standard)', value: 'black-standard' }, { label: 'Custom colors (extra)', value: 'custom-colors-extra' }, { label: 'Metallic (gold, silver, copper)', value: 'metallic-gold-silver-copper' }],
      },
      {
        key: 'paper-types',
        label: 'Paper Types',
        type: 'checkbox',
        options: [{ label: 'White / cream (standard)', value: 'white-cream-standard' }, { label: 'Colored (extra)', value: 'colored-extra' }, { label: 'Textured (extra)', value: 'textured-extra' }, { label: 'Client provides paper', value: 'client-provides-paper' }],
      },
      {
        key: 'client-provides-envelopes',
        label: 'Client Provides Envelopes',
        type: 'checkbox',
        options: [{ label: 'Yes (price lower)', value: 'yes-price-lower' }, { label: 'No (artist sources, mark up)', value: 'no-artist-sources-mark-up' }],
      },
      {
        key: 'return-address-printing',
        label: 'Return Address Printing',
        type: 'checkbox',
        options: [{ label: 'Included (with envelope order)', value: 'included-with-envelope-order' }, { label: 'Extra fee ($___)', value: 'extra-fee' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'sealing-wax-optional',
        label: 'Sealing Wax (optional)',
        type: 'checkbox',
        options: [{ label: 'Yes (per envelope)', value: 'yes-per-envelope' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'proof-sample',
        label: 'Proof / Sample',
        type: 'checkbox',
        options: [{ label: 'Photo proof before full order', value: 'photo-proof-before-full-order' }, { label: 'In-person sample (local)', value: 'in-person-sample-local' }, { label: 'No proof (trust)', value: 'no-proof-trust' }],
      },
      {
        key: 'rush-fee',
        label: 'Rush Fee',
        type: 'checkbox',
        options: [{ label: '1 week (25% extra)', value: '1-week-25-extra' }, { label: '3 days (50% extra)', value: '3-days-50-extra' }, { label: 'Overnight (100% extra)', value: 'overnight-100-extra' }],
      },
      {
        key: 'shipping',
        label: 'Shipping',
        type: 'checkbox',
        options: [{ label: 'Flat rate (USPS Priority)', value: 'flat-rate-usps-priority' }, { label: 'Overnight available (extra)', value: 'overnight-available-extra' }],
      },
      {
        key: 'minimum-order',
        label: 'Minimum Order',
        type: 'checkbox',
        options: [{ label: 'No minimum', value: 'no-minimum' }, { label: '25 pieces', value: '25-pieces' }, { label: '50 pieces', value: '50-pieces' }, { label: '100 pieces', value: '100-pieces' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: '50% (non-refundable)', value: '50-non-refundable' }, { label: 'No deposit (small orders)', value: 'no-deposit-small-orders' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: 'Before start (full refund minus deposit)', value: 'before-start-full-refund-minus-deposit' }, { label: 'After start (pro-rated for completed work)', value: 'after-start-pro-rated-for-completed-work' }],
      },
      {
        key: 'portfolio',
        label: 'Portfolio',
        type: 'checkbox',
        options: [{ label: 'Instagram / website', value: 'instagram-website' }, { label: 'Available upon request', value: 'available-upon-request' }],
      }
    ],
    'commissioned-artist': [
      {
        key: 'artist-type',
        label: 'Artist Type',
        type: 'checkbox',
        options: [{ label: 'Painter (oil, acrylic, watercolor)', value: 'painter-oil-acrylic-watercolor' }, { label: 'Digital illustrator', value: 'digital-illustrator' }, { label: 'Sculptor', value: 'sculptor' }, { label: 'Muralist', value: 'muralist' }, { label: 'Woodworker', value: 'woodworker' }, { label: 'Ceramic artist', value: 'ceramic-artist' }, { label: 'Fiber artist (weaving, tapestry)', value: 'fiber-artist-weaving-tapestry' }, { label: 'Stained glass', value: 'stained-glass' }, { label: 'Mosaic', value: 'mosaic' }],
      },
      {
        key: 'art-style',
        label: 'Art Style',
        type: 'checkbox',
        options: [{ label: 'Realism', value: 'realism' }, { label: 'Portrait', value: 'portrait' }, { label: 'Abstract', value: 'abstract' }, { label: 'Impressionism', value: 'impressionism' }, { label: 'Cartoon / illustration', value: 'cartoon-illustration' }, { label: 'Surrealism', value: 'surrealism' }, { label: 'Minimalist', value: 'minimalist' }, { label: 'Landscape', value: 'landscape' }, { label: 'Pet portrait', value: 'pet-portrait' }, { label: 'Fantasy', value: 'fantasy' }, { label: 'Pop art', value: 'pop-art' }],
      },
      {
        key: 'medium',
        label: 'Medium',
        type: 'checkbox',
        options: [{ label: 'Canvas (stretched)', value: 'canvas-stretched' }, { label: 'Paper', value: 'paper' }, { label: 'Wood panel', value: 'wood-panel' }, { label: 'Digital file (print yourself)', value: 'digital-file-print-yourself' }, { label: 'Metal', value: 'metal' }, { label: 'Clay / ceramic', value: 'clay-ceramic' }, { label: 'Stone', value: 'stone' }, { label: 'Glass', value: 'glass' }, { label: 'Textile', value: 'textile' }],
      },
      {
        key: 'subject-matter',
        label: 'Subject Matter',
        type: 'checkbox',
        options: [{ label: 'Portrait (person)', value: 'portrait-person' }, { label: 'Pet portrait', value: 'pet-portrait' }, { label: 'Family / group portrait', value: 'family-group-portrait' }, { label: 'Wedding / event painting (live)', value: 'wedding-event-painting-live' }, { label: 'Home / building (architectural)', value: 'home-building-architectural' }, { label: 'Landscape (client\'s favorite place)', value: 'landscape-client-s-favorite-place' }, { label: 'Abstract (color / emotion)', value: 'abstract-color-emotion' }, { label: 'Custom design (client concept)', value: 'custom-design-client-concept' }],
      },
      {
        key: 'size',
        label: 'Size',
        type: 'checkbox',
        options: [{ label: 'Small (8x10 or under)', value: 'small-8x10-or-under' }, { label: 'Medium (11x14 to 16x20)', value: 'medium-11x14-to-16x20' }, { label: 'Large (18x24 to 24x36)', value: 'large-18x24-to-24x36' }, { label: 'Extra large (30x40+)', value: 'extra-large-30x40' }, { label: 'Mural (wall size, sq ft)', value: 'mural-wall-size-sq-ft' }],
      },
      {
        key: 'price-range-portrait-11x14',
        label: 'Price Range (Portrait, 11x14)',
        type: 'checkbox',
        options: [{ label: '$100-200', value: '100-200' }, { label: '$200-400', value: '200-400' }, { label: '$400-600', value: '400-600' }, { label: '$600-1,000', value: '600-1-000' }, { label: '$1,000-2,000', value: '1-000-2-000' }, { label: '$2,000+ (highly detailed)', value: '2-000-highly-detailed' }],
      },
      {
        key: 'price-range-pet-portrait',
        label: 'Price Range (Pet Portrait)',
        type: 'checkbox',
        options: [{ label: '$50-100 (small)', value: '50-100-small' }, { label: '$100-200 (medium)', value: '100-200-medium' }, { label: '$200-350', value: '200-350' }, { label: '$350-500', value: '350-500' }, { label: '$500+', value: '500' }],
      },
      {
        key: 'turnaround-time',
        label: 'Turnaround Time',
        type: 'checkbox',
        options: [{ label: '1-2 weeks', value: '1-2-weeks' }, { label: '2-4 weeks', value: '2-4-weeks' }, { label: '1-2 months', value: '1-2-months' }, { label: '2-3 months (large, detailed)', value: '2-3-months-large-detailed' }],
      },
      {
        key: 'process',
        label: 'Process',
        type: 'checkbox',
        options: [{ label: 'Consultation (concept, size, medium)', value: 'consultation-concept-size-medium' }, { label: 'Reference photos provided by client', value: 'reference-photos-provided-by-client' }, { label: 'Sketch / draft approval', value: 'sketch-draft-approval' }, { label: 'Payment schedule', value: 'payment-schedule' }, { label: 'Final delivery', value: 'final-delivery' }],
      },
      {
        key: 'revisions',
        label: 'Revisions',
        type: 'checkbox',
        options: [{ label: '1 round (sketch phase)', value: '1-round-sketch-phase' }, { label: '2 rounds', value: '2-rounds' }, { label: 'Unlimited (until approval)', value: 'unlimited-until-approval' }, { label: 'No revisions (as-is)', value: 'no-revisions-as-is' }],
      },
      {
        key: 'reference-photo-requirements',
        label: 'Reference Photo Requirements',
        type: 'checkbox',
        options: [{ label: 'High resolution', value: 'high-resolution' }, { label: 'Good lighting', value: 'good-lighting' }, { label: 'Multiple angles', value: 'multiple-angles' }, { label: 'Artist may request specific pose', value: 'artist-may-request-specific-pose' }],
      },
      {
        key: 'live-event-painting-wedding',
        label: 'Live Event Painting (wedding)',
        type: 'checkbox',
        options: [{ label: 'Artist paints ceremony / reception', value: 'artist-paints-ceremony-reception' }, { label: '4-6 hours on-site', value: '4-6-hours-on-site' }, { label: 'Finished painting delivered weeks later', value: 'finished-painting-delivered-weeks-later' }, { label: 'Price: $1,500-3,000+', value: 'price-1-500-3-000' }],
      },
      {
        key: 'shipping',
        label: 'Shipping',
        type: 'checkbox',
        options: [{ label: 'Rolled in tube (canvas, unframed)', value: 'rolled-in-tube-canvas-unframed' }, { label: 'Stretched and boxed (extra)', value: 'stretched-and-boxed-extra' }, { label: 'Framed (extra, fragile)', value: 'framed-extra-fragile' }, { label: 'Local pickup available', value: 'local-pickup-available' }],
      },
      {
        key: 'framing',
        label: 'Framing',
        type: 'checkbox',
        options: [{ label: 'Not included (client frames)', value: 'not-included-client-frames' }, { label: 'Available (add $___)', value: 'available-add' }],
      },
      {
        key: 'copyright-reproduction-rights',
        label: 'Copyright / Reproduction Rights',
        type: 'checkbox',
        options: [{ label: 'Artist retains copyright (standard)', value: 'artist-retains-copyright-standard' }, { label: 'Client buys full rights (extra fee)', value: 'client-buys-full-rights-extra-fee' }, { label: 'No commercial use without permission', value: 'no-commercial-use-without-permission' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: '50% (non-refundable)', value: '50-non-refundable' }, { label: '25% for sketch, 75% upon approval', value: '25-for-sketch-75-upon-approval' }],
      },
      {
        key: 'payment-schedule',
        label: 'Payment Schedule',
        type: 'checkbox',
        options: [{ label: 'Deposit + final upon completion', value: 'deposit-final-upon-completion' }, { label: 'Deposit + progress payment + final', value: 'deposit-progress-payment-final' }],
      },
      {
        key: 'commission-agreement-contract',
        label: 'Commission Agreement / Contract',
        type: 'checkbox',
        options: [{ label: 'Yes (written)', value: 'yes-written' }, { label: 'Verbal (not recommended)', value: 'verbal-not-recommended' }],
      },
      {
        key: 'portfolio-past-commissions',
        label: 'Portfolio / Past Commissions',
        type: 'checkbox',
        options: [{ label: 'Yes (website, social media)', value: 'yes-website-social-media' }, { label: 'References available', value: 'references-available' }],
      }
    ],
    'graphic-designer': [
      {
        key: 'designer-type',
        label: 'Designer Type',
        type: 'checkbox',
        options: [{ label: 'Branding / logo specialist', value: 'branding-logo-specialist' }, { label: 'Print designer (brochures, business cards)', value: 'print-designer-brochures-business-cards' }, { label: 'Web designer (UI/UX)', value: 'web-designer-ui-ux' }, { label: 'Packaging designer', value: 'packaging-designer' }, { label: 'Social media graphics', value: 'social-media-graphics' }, { label: 'Presentation designer (PowerPoint, Keynote)', value: 'presentation-designer-powerpoint-keynote' }, { label: 'Infographic designer', value: 'infographic-designer' }, { label: 'Book / ebook layout', value: 'book-ebook-layout' }, { label: 'T-shirt / merch designer', value: 't-shirt-merch-designer' }, { label: 'Signage / environmental graphics', value: 'signage-environmental-graphics' }],
      },
      {
        key: 'pricing-models',
        label: 'Pricing Models',
        type: 'checkbox',
        options: [{ label: 'Hourly ($___/hour)', value: 'hourly-hour' }, { label: 'Flat project fee', value: 'flat-project-fee' }, { label: 'Per deliverable (logo, business card, etc.)', value: 'per-deliverable-logo-business-card-etc' }, { label: 'Monthly retainer', value: 'monthly-retainer' }],
      },
      {
        key: 'hourly-rate-range',
        label: 'Hourly Rate Range',
        type: 'checkbox',
        options: [{ label: '$25-50 (junior)', value: '25-50-junior' }, { label: '$50-75 (mid-level)', value: '50-75-mid-level' }, { label: '$75-100', value: '75-100' }, { label: '$100-150 (senior)', value: '100-150-senior' }, { label: '$150-250 (agency or expert)', value: '150-250-agency-or-expert' }],
      },
      {
        key: 'logo-design-price',
        label: 'Logo Design Price',
        type: 'checkbox',
        options: [{ label: '$100-250', value: '100-250' }, { label: '$250-500', value: '250-500' }, { label: '$500-1,000', value: '500-1-000' }, { label: '$1,000-2,500', value: '1-000-2-500' }, { label: '$2,500-5,000 (brand identity package)', value: '2-500-5-000-brand-identity-package' }],
      },
      {
        key: 'brand-identity-package',
        label: 'Brand Identity Package',
        type: 'checkbox',
        options: [{ label: 'Logo (primary, secondary, submark)', value: 'logo-primary-secondary-submark' }, { label: 'Color palette', value: 'color-palette' }, { label: 'Typography (font selection)', value: 'typography-font-selection' }, { label: 'Brand guidelines (PDF)', value: 'brand-guidelines-pdf' }, { label: 'Business card, letterhead, envelope', value: 'business-card-letterhead-envelope' }],
      },
      {
        key: 'turnaround',
        label: 'Turnaround',
        type: 'checkbox',
        options: [{ label: '3-5 days (simple)', value: '3-5-days-simple' }, { label: '1-2 weeks (logo)', value: '1-2-weeks-logo' }, { label: '3-4 weeks (full identity)', value: '3-4-weeks-full-identity' }, { label: '6-8 weeks (website)', value: '6-8-weeks-website' }],
      },
      {
        key: 'revisions-included',
        label: 'Revisions Included',
        type: 'checkbox',
        options: [{ label: '2 rounds', value: '2-rounds' }, { label: '3 rounds', value: '3-rounds' }, { label: 'Unlimited', value: 'unlimited' }, { label: 'No revisions (final as-is)', value: 'no-revisions-final-as-is' }],
      },
      {
        key: 'source-files-provided',
        label: 'Source Files Provided',
        type: 'checkbox',
        options: [{ label: 'Yes (AI, EPS, SVG)', value: 'yes-ai-eps-svg' }, { label: 'No (raster only, JPG/PNG)', value: 'no-raster-only-jpg-png' }],
      },
      {
        key: 'print-ready-files',
        label: 'Print Ready Files',
        type: 'checkbox',
        options: [{ label: 'Yes (CMYK, bleed, crop marks)', value: 'yes-cmyk-bleed-crop-marks' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'stock-assets',
        label: 'Stock Assets',
        type: 'checkbox',
        options: [{ label: 'Stock photos (extra fee)', value: 'stock-photos-extra-fee' }, { label: 'Stock icons (included)', value: 'stock-icons-included' }, { label: 'No stock assets (all original)', value: 'no-stock-assets-all-original' }],
      },
      {
        key: 'research-discovery',
        label: 'Research / Discovery',
        type: 'checkbox',
        options: [{ label: 'Questionnaire only', value: 'questionnaire-only' }, { label: 'Mood board + concept board', value: 'mood-board-concept-board' }, { label: 'Competitive analysis (extra)', value: 'competitive-analysis-extra' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: '25%', value: '25' }, { label: '50%', value: '50' }, { label: 'No deposit (net 15/30 for corporate)', value: 'no-deposit-net-15-30-for-corporate' }],
      },
      {
        key: 'contract-required',
        label: 'Contract Required',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'portfolio',
        label: 'Portfolio',
        type: 'checkbox',
        options: [{ label: 'Yes (Behance, Dribbble, website)', value: 'yes-behance-dribbble-website' }, { label: 'Available upon request', value: 'available-upon-request' }],
      },
      {
        key: 'client-testimonials',
        label: 'Client Testimonials',
        type: 'checkbox',
        options: [{ label: 'Available', value: 'available' }, { label: 'Not available', value: 'not-available' }],
      },
      {
        key: 'nda-non-disclosure',
        label: 'NDA (Non-Disclosure)',
        type: 'checkbox',
        options: [{ label: 'Available upon request', value: 'available-upon-request' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'rush-fee',
        label: 'Rush Fee',
        type: 'checkbox',
        options: [{ label: '50% extra', value: '50-extra' }, { label: '100% extra (24-hour turnaround)', value: '100-extra-24-hour-turnaround' }],
      },
      {
        key: 'revisions-after-final-delivery',
        label: 'Revisions After Final Delivery',
        type: 'checkbox',
        options: [{ label: 'Hourly rate', value: 'hourly-rate' }, { label: 'Small changes (free within 30 days)', value: 'small-changes-free-within-30-days' }],
      },
      {
        key: 'file-handoff',
        label: 'File Handoff',
        type: 'checkbox',
        options: [{ label: 'Google Drive / Dropbox', value: 'google-drive-dropbox' }, { label: 'WeTransfer', value: 'wetransfer' }, { label: 'Physical USB (shipping fee)', value: 'physical-usb-shipping-fee' }],
      }
    ],
    'bridal-shop': [
      {
        key: 'shop-type',
        label: 'Shop Type',
        type: 'checkbox',
        options: [{ label: 'Designer bridal boutique', value: 'designer-bridal-boutique' }, { label: 'Discount bridal (off-the-rack)', value: 'discount-bridal-off-the-rack' }, { label: 'Plus size bridal', value: 'plus-size-bridal' }, { label: 'Sample sale (consignment)', value: 'sample-sale-consignment' }, { label: 'Custom / made-to-measure', value: 'custom-made-to-measure' }, { label: 'Second-hand / pre-owned', value: 'second-hand-pre-owned' }],
      },
      {
        key: 'dress-styles',
        label: 'Dress Styles',
        type: 'checkbox',
        options: [{ label: 'Ball gown', value: 'ball-gown' }, { label: 'A-line', value: 'a-line' }, { label: 'Mermaid / trumpet', value: 'mermaid-trumpet' }, { label: 'Sheath / column', value: 'sheath-column' }, { label: 'Fit and flare', value: 'fit-and-flare' }, { label: 'Tea length', value: 'tea-length' }, { label: 'High-low', value: 'high-low' }, { label: 'Jumpsuit / pantsuit', value: 'jumpsuit-pantsuit' }, { label: 'Boho', value: 'boho' }, { label: 'Modern minimalist', value: 'modern-minimalist' }, { label: 'Vintage', value: 'vintage' }, { label: 'Romantic lace', value: 'romantic-lace' }],
      },
      {
        key: 'price-range-new-dresses',
        label: 'Price Range (new dresses)',
        type: 'checkbox',
        options: [{ label: 'Under $500', value: 'under-500' }, { label: '$500-1,000', value: '500-1-000' }, { label: '$1,000-1,500', value: '1-000-1-500' }, { label: '$1,500-2,000', value: '1-500-2-000' }, { label: '$2,000-3,000', value: '2-000-3-000' }, { label: '$3,000-4,000', value: '3-000-4-000' }, { label: '$4,000-5,000', value: '4-000-5-000' }, { label: '$5,000-7,000', value: '5-000-7-000' }, { label: '$7,000-10,000', value: '7-000-10-000' }, { label: '$10,000+', value: '10-000' }],
      },
      {
        key: 'sample-off-the-rack-discount',
        label: 'Sample / Off-the-Rack Discount',
        type: 'checkbox',
        options: [{ label: '20-40% off', value: '20-40-off' }, { label: '40-60% off', value: '40-60-off' }, { label: '60-80% off', value: '60-80-off' }],
      },
      {
        key: 'size-range',
        label: 'Size Range',
        type: 'checkbox',
        options: [{ label: '0-14 (straight)', value: '0-14-straight' }, { label: '0-26 (extended)', value: '0-26-extended' }, { label: '14W-32W (plus)', value: '14w-32w-plus' }, { label: 'Custom (made to your measurements)', value: 'custom-made-to-your-measurements' }],
      },
      {
        key: 'designer-brands-carried',
        label: 'Designer Brands Carried',
        type: 'checkbox',
        options: [{ label: 'Maggie Sottero', value: 'maggie-sottero' }, { label: 'Essense of Australia', value: 'essense-of-australia' }, { label: 'Stella York', value: 'stella-york' }, { label: 'Allure', value: 'allure' }, { label: 'Watters', value: 'watters' }, { label: 'BHLDN (Anthropologie)', value: 'bhldn-anthropologie' }, { label: 'Vera Wang', value: 'vera-wang' }, { label: 'Pronovias', value: 'pronovias' }, { label: 'Martina Liana', value: 'martina-liana' }, { label: 'Local / private label', value: 'local-private-label' }],
      },
      {
        key: 'alterations-on-site',
        label: 'Alterations On-Site',
        type: 'checkbox',
        options: [{ label: 'Yes (in-house seamstress)', value: 'yes-in-house-seamstress' }, { label: 'Yes (partnered with tailor)', value: 'yes-partnered-with-tailor' }, { label: 'No (client arranges)', value: 'no-client-arranges' }],
      },
      {
        key: 'alterations-price-range',
        label: 'Alterations Price Range',
        type: 'checkbox',
        options: [{ label: '$200-400 (hem, bustle)', value: '200-400-hem-bustle' }, { label: '$400-600 (sides taken in)', value: '400-600-sides-taken-in' }, { label: '$600-800 (major restructuring)', value: '600-800-major-restructuring' }],
      },
      {
        key: 'appointment-required',
        label: 'Appointment Required',
        type: 'checkbox',
        options: [{ label: 'Yes (always)', value: 'yes-always' }, { label: 'Recommended', value: 'recommended' }, { label: 'Walk-ins welcome (limited)', value: 'walk-ins-welcome-limited' }],
      },
      {
        key: 'appointment-duration',
        label: 'Appointment Duration',
        type: 'checkbox',
        options: [{ label: '60 minutes (standard)', value: '60-minutes-standard' }, { label: '90 minutes (plus size, custom)', value: '90-minutes-plus-size-custom' }, { label: '2 hours (group appointment)', value: '2-hours-group-appointment' }],
      },
      {
        key: 'number-of-guests-allowed',
        label: 'Number of Guests Allowed',
        type: 'checkbox',
        options: [{ label: '2-3', value: '2-3' }, { label: '3-4', value: '3-4' }, { label: '4-6', value: '4-6' }, { label: 'No limit', value: 'no-limit' }],
      },
      {
        key: 'bridesmaid-dresses',
        label: 'Bridesmaid Dresses',
        type: 'checkbox',
        options: [{ label: 'Yes (carried in-store)', value: 'yes-carried-in-store' }, { label: 'Yes (online ordering)', value: 'yes-online-ordering' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'plus-size-samples-in-store',
        label: 'Plus Size Samples in Store',
        type: 'checkbox',
        options: [{ label: 'Yes (size 18-24 samples)', value: 'yes-size-18-24-samples' }, { label: 'Limited (few options)', value: 'limited-few-options' }, { label: 'No (standard sizes only)', value: 'no-standard-sizes-only' }],
      },
      {
        key: 'trunk-shows',
        label: 'Trunk Shows',
        type: 'checkbox',
        options: [{ label: 'Yes (designer events, discounts)', value: 'yes-designer-events-discounts' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'sample-sale-events',
        label: 'Sample Sale Events',
        type: 'checkbox',
        options: [{ label: 'Annual', value: 'annual' }, { label: 'Bi-annual', value: 'bi-annual' }, { label: 'Ongoing (clearance rack)', value: 'ongoing-clearance-rack' }],
      },
      {
        key: 'consignment-pre-owned',
        label: 'Consignment / Pre-Owned',
        type: 'checkbox',
        options: [{ label: 'Sell your dress (commission)', value: 'sell-your-dress-commission' }, { label: 'Buy pre-owned (discount)', value: 'buy-pre-owned-discount' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'layaway-payment-plans',
        label: 'Layaway / Payment Plans',
        type: 'checkbox',
        options: [{ label: 'Yes (no interest)', value: 'yes-no-interest' }, { label: 'Yes (interest-free)', value: 'yes-interest-free' }, { label: 'No (full payment)', value: 'no-full-payment' }],
      },
      {
        key: 'rush-order-if-needed-in-under-4-months',
        label: 'Rush Order (if needed in under 4 months)',
        type: 'checkbox',
        options: [{ label: 'Yes (rush fee)', value: 'yes-rush-fee' }, { label: 'Yes (sample sale recommended)', value: 'yes-sample-sale-recommended' }, { label: 'No (minimum 6 months)', value: 'no-minimum-6-months' }],
      },
      {
        key: 'shipping',
        label: 'Shipping',
        type: 'checkbox',
        options: [{ label: 'To store (free pickup)', value: 'to-store-free-pickup' }, { label: 'To home (fee)', value: 'to-home-fee' }, { label: 'International shipping available', value: 'international-shipping-available' }],
      },
      {
        key: 'return-exchange-policy',
        label: 'Return / Exchange Policy',
        type: 'checkbox',
        options: [{ label: 'No returns (special order)', value: 'no-returns-special-order' }, { label: 'Exchange only (sample)', value: 'exchange-only-sample' }, { label: 'Store credit (within 30 days)', value: 'store-credit-within-30-days' }],
      },
      {
        key: 'online-virtual-appointment',
        label: 'Online Virtual Appointment',
        type: 'checkbox',
        options: [{ label: 'Yes (video call, show dresses)', value: 'yes-video-call-show-dresses' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'dress-preservation-cleaning',
        label: 'Dress Preservation / Cleaning',
        type: 'checkbox',
        options: [{ label: 'Yes (partner service)', value: 'yes-partner-service' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'alterations-timeline',
        label: 'Alterations Timeline',
        type: 'checkbox',
        options: [{ label: '1-2 months (standard)', value: '1-2-months-standard' }, { label: '2-4 weeks (rush fee)', value: '2-4-weeks-rush-fee' }],
      },
      {
        key: 'first-appointment-tips',
        label: 'First Appointment Tips',
        type: 'checkbox',
        options: [{ label: 'Bring nude undergarments', value: 'bring-nude-undergarments' }, { label: 'Wear nude thong', value: 'wear-nude-thong' }, { label: 'Hair pulled back (for neckline)', value: 'hair-pulled-back-for-neckline' }, { label: 'No spray tan (can rub off)', value: 'no-spray-tan-can-rub-off' }],
      },
      {
        key: 'cancellation-no-show-appointment',
        label: 'Cancellation / No-Show (appointment)',
        type: 'checkbox',
        options: [{ label: '24 hours notice', value: '24-hours-notice' }, { label: '$___ fee for no-show', value: 'fee-for-no-show' }],
      }
    ],
    'flower-and-gift-shop': [
      {
        key: 'shop-type',
        label: 'Shop Type',
        type: 'checkbox',
        options: [{ label: 'Florist (fresh flowers)', value: 'florist-fresh-flowers' }, { label: 'Gift shop (books, home decor, candles)', value: 'gift-shop-books-home-decor-candles' }, { label: 'Plant shop (live indoor plants)', value: 'plant-shop-live-indoor-plants' }, { label: 'Gourmet gift baskets', value: 'gourmet-gift-baskets' }, { label: 'Seasonal / holiday pop-up', value: 'seasonal-holiday-pop-up' }],
      },
      {
        key: 'flower-services',
        label: 'Flower Services',
        type: 'checkbox',
        options: [{ label: 'Daily bouquets (walk-in)', value: 'daily-bouquets-walk-in' }, { label: 'Custom arrangements (order ahead)', value: 'custom-arrangements-order-ahead' }, { label: 'Wedding flowers (consultation)', value: 'wedding-flowers-consultation' }, { label: 'Funeral / sympathy', value: 'funeral-sympathy' }, { label: 'Birthday / anniversary', value: 'birthday-anniversary' }, { label: 'Corporate weekly delivery', value: 'corporate-weekly-delivery' }, { label: 'Event flowers (centerpieces, installations)', value: 'event-flowers-centerpieces-installations' }],
      },
      {
        key: 'gift-services',
        label: 'Gift Services',
        type: 'checkbox',
        options: [{ label: 'Gift wrapping (free or fee)', value: 'gift-wrapping-free-or-fee' }, { label: 'Gift basket assembly', value: 'gift-basket-assembly' }, { label: 'Customized gifts (engraving, printing)', value: 'customized-gifts-engraving-printing' }, { label: 'Same-day delivery (local)', value: 'same-day-delivery-local' }],
      },
      {
        key: 'price-small-bouquet',
        label: 'Price - Small Bouquet',
        type: 'checkbox',
        options: [{ label: '$25-35', value: '25-35' }, { label: '$35-50', value: '35-50' }, { label: '$50-75', value: '50-75' }, { label: '$75+', value: '75' }],
      },
      {
        key: 'price-medium-arrangement',
        label: 'Price - Medium Arrangement',
        type: 'checkbox',
        options: [{ label: '$50-75', value: '50-75' }, { label: '$75-100', value: '75-100' }, { label: '$100-150', value: '100-150' }, { label: '$150-200', value: '150-200' }],
      },
      {
        key: 'price-large-wedding-centerpiece',
        label: 'Price - Large (wedding centerpiece)',
        type: 'checkbox',
        options: [{ label: '$75-100', value: '75-100' }, { label: '$100-150', value: '100-150' }, { label: '$150-250', value: '150-250' }, { label: '$250+', value: '250' }],
      },
      {
        key: 'wedding-minimum',
        label: 'Wedding Minimum',
        type: 'checkbox',
        options: [{ label: '$500', value: '500' }, { label: '$1,000', value: '1-000' }, { label: '$1,500', value: '1-500' }, { label: '$2,000+', value: '2-000' }, { label: 'No minimum', value: 'no-minimum' }],
      },
      {
        key: 'delivery-area',
        label: 'Delivery Area',
        type: 'checkbox',
        options: [{ label: 'Local (within 5 miles free)', value: 'local-within-5-miles-free' }, { label: 'Extended (5-15 miles, fee)', value: 'extended-5-15-miles-fee' }, { label: 'Nationwide (via FTD / Teleflora partner)', value: 'nationwide-via-ftd-teleflora-partner' }],
      },
      {
        key: 'delivery-fee',
        label: 'Delivery Fee',
        type: 'checkbox',
        options: [{ label: '$5-10', value: '5-10' }, { label: '$10-15', value: '10-15' }, { label: '$15-20', value: '15-20' }, { label: 'Free (orders over $___)', value: 'free-orders-over' }],
      },
      {
        key: 'same-day-delivery',
        label: 'Same-Day Delivery',
        type: 'checkbox',
        options: [{ label: 'Yes (order by ___pm)', value: 'yes-order-by-pm' }, { label: 'No (next day)', value: 'no-next-day' }],
      },
      {
        key: 'fresh-flower-guarantee',
        label: 'Fresh Flower Guarantee',
        type: 'checkbox',
        options: [{ label: '3-5 days (with care)', value: '3-5-days-with-care' }, { label: '5-7 days', value: '5-7-days' }, { label: 'Replacement if damaged', value: 'replacement-if-damaged' }],
      },
      {
        key: 'plant-care-instructions',
        label: 'Plant Care Instructions',
        type: 'checkbox',
        options: [{ label: 'Provided (printed card)', value: 'provided-printed-card' }, { label: 'Verbally (in-store)', value: 'verbally-in-store' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'houseplants-for-sale',
        label: 'Houseplants for Sale',
        type: 'checkbox',
        options: [{ label: 'Small (4" pot)', value: 'small-4-pot' }, { label: 'Medium (6" pot)', value: 'medium-6-pot' }, { label: 'Large (8-10" pot)', value: 'large-8-10-pot' }, { label: 'Floor plants (trees, fiddle leaf fig)', value: 'floor-plants-trees-fiddle-leaf-fig' }],
      },
      {
        key: 'seasonal-items',
        label: 'Seasonal Items',
        type: 'checkbox',
        options: [{ label: 'Christmas wreaths, trees', value: 'christmas-wreaths-trees' }, { label: 'Valentine\'s Day roses (pre-order)', value: 'valentine-s-day-roses-pre-order' }, { label: 'Mother\'s Day specials', value: 'mother-s-day-specials' }, { label: 'Halloween (mums, pumpkins)', value: 'halloween-mums-pumpkins' }],
      },
      {
        key: 'subscription-flower-club',
        label: 'Subscription / Flower Club',
        type: 'checkbox',
        options: [{ label: 'Weekly delivery', value: 'weekly-delivery' }, { label: 'Bi-weekly', value: 'bi-weekly' }, { label: 'Monthly', value: 'monthly' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'diy-wedding-flowers-buckets',
        label: 'DIY Wedding Flowers (buckets)',
        type: 'checkbox',
        options: [{ label: 'Yes (wholesale to public)', value: 'yes-wholesale-to-public' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'corporate-accounts',
        label: 'Corporate Accounts',
        type: 'checkbox',
        options: [{ label: 'Yes (net 30 billing)', value: 'yes-net-30-billing' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'gift-registry',
        label: 'Gift Registry',
        type: 'checkbox',
        options: [{ label: 'Yes (wedding, baby)', value: 'yes-wedding-baby' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'return-policy-non-floral-gifts',
        label: 'Return Policy (non-floral gifts)',
        type: 'checkbox',
        options: [{ label: '30 days with receipt', value: '30-days-with-receipt' }, { label: 'Exchange only', value: 'exchange-only' }, { label: 'Final sale', value: 'final-sale' }],
      },
      {
        key: 'loyalty-program',
        label: 'Loyalty Program',
        type: 'checkbox',
        options: [{ label: 'Points per purchase', value: 'points-per-purchase' }, { label: 'Birthday discount', value: 'birthday-discount' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'online-ordering',
        label: 'Online Ordering',
        type: 'checkbox',
        options: [{ label: 'Yes (website)', value: 'yes-website' }, { label: 'No (call or in-store)', value: 'no-call-or-in-store' }],
      }
    ],
    'party-supply': [
      {
        key: 'store-type',
        label: 'Store Type',
        type: 'checkbox',
        options: [{ label: 'Physical party store (seasonal)', value: 'physical-party-store-seasonal' }, { label: 'Online party supply (large selection)', value: 'online-party-supply-large-selection' }, { label: 'Wholesale (bulk for events)', value: 'wholesale-bulk-for-events' }, { label: 'Balloon specialty (see Balloon Services)', value: 'balloon-specialty-see-balloon-services' }],
      },
      {
        key: 'product-categories',
        label: 'Product Categories',
        type: 'checkbox',
        options: [{ label: 'Balloons (latex, mylar, numbers)', value: 'balloons-latex-mylar-numbers' }, { label: 'Tableware (plates, cups, napkins)', value: 'tableware-plates-cups-napkins' }, { label: 'Decorations (banners, garlands, centerpieces)', value: 'decorations-banners-garlands-centerpieces' }, { label: 'Party favors (goody bags, toys)', value: 'party-favors-goody-bags-toys' }, { label: 'Pinatas', value: 'pinatas' }, { label: 'Costume accessories (hats, glasses)', value: 'costume-accessories-hats-glasses' }, { label: 'Invitations (paper or digital)', value: 'invitations-paper-or-digital' }, { label: 'Baking supplies (cake toppers, candles)', value: 'baking-supplies-cake-toppers-candles' }, { label: 'Backdrop / photo booth props', value: 'backdrop-photo-booth-props' }],
      },
      {
        key: 'themes-available',
        label: 'Themes Available',
        type: 'checkbox',
        options: [{ label: 'Birthday (age specific)', value: 'birthday-age-specific' }, { label: 'Baby shower', value: 'baby-shower' }, { label: 'Bridal shower', value: 'bridal-shower' }, { label: 'Gender reveal', value: 'gender-reveal' }, { label: 'Holiday (Christmas, Halloween, Easter)', value: 'holiday-christmas-halloween-easter' }, { label: 'Sports (football, soccer, baseball)', value: 'sports-football-soccer-baseball' }, { label: 'Princess / superhero', value: 'princess-superhero' }, { label: 'Unicorn / mermaid', value: 'unicorn-mermaid' }, { label: 'Space / galaxy', value: 'space-galaxy' }, { label: 'Tropical / luau', value: 'tropical-luau' }, { label: 'Western / rodeo', value: 'western-rodeo' }, { label: '80s / 90s retro', value: '80s-90s-retro' }, { label: 'Custom / DIY (mix and match)', value: 'custom-diy-mix-and-match' }],
      },
      {
        key: 'color-coordination',
        label: 'Color Coordination',
        type: 'checkbox',
        options: [{ label: 'Single color (all one color)', value: 'single-color-all-one-color' }, { label: 'Rainbow', value: 'rainbow' }, { label: 'Pastel', value: 'pastel' }, { label: 'Metallics (gold, silver, rose gold)', value: 'metallics-gold-silver-rose-gold' }, { label: 'Custom (client\'s colors)', value: 'custom-client-s-colors' }],
      },
      {
        key: 'balloon-inflation',
        label: 'Balloon Inflation',
        type: 'checkbox',
        options: [{ label: 'Air (free)', value: 'air-free' }, { label: 'Helium (fee)', value: 'helium-fee' }, { label: 'Balloon arch / garland (labor fee)', value: 'balloon-arch-garland-labor-fee' }],
      },
      {
        key: 'price-range-basic-table-setting-per-person',
        label: 'Price Range (basic table setting per person)',
        type: 'checkbox',
        options: [{ label: 'Under $2', value: 'under-2' }, { label: '$2-4', value: '2-4' }, { label: '$4-6', value: '4-6' }, { label: '$6-10', value: '6-10' }],
      },
      {
        key: 'party-favors-per-bag',
        label: 'Party Favors (per bag)',
        type: 'checkbox',
        options: [{ label: '$1-2', value: '1-2' }, { label: '$2-3', value: '2-3' }, { label: '$3-5', value: '3-5' }, { label: '$5-10', value: '5-10' }, { label: 'DIY (customer assembles)', value: 'diy-customer-assembles' }],
      },
      {
        key: 'bulk-discount',
        label: 'Bulk Discount',
        type: 'checkbox',
        options: [{ label: '5% off $100+', value: '5-off-100' }, { label: '10% off $250+', value: '10-off-250' }, { label: '15% off $500+', value: '15-off-500' }],
      },
      {
        key: 'custom-printing',
        label: 'Custom Printing',
        type: 'checkbox',
        options: [{ label: 'Personalized napkins', value: 'personalized-napkins' }, { label: 'Personalized cups', value: 'personalized-cups' }, { label: 'Banner with name / age', value: 'banner-with-name-age' }, { label: 'Invitations (design + print)', value: 'invitations-design-print' }],
      },
      {
        key: 'rush-order',
        label: 'Rush Order',
        type: 'checkbox',
        options: [{ label: 'Same day (fee)', value: 'same-day-fee' }, { label: '24 hours (free)', value: '24-hours-free' }, { label: '1 week (standard)', value: '1-week-standard' }],
      },
      {
        key: 'online-shopping',
        label: 'Online Shopping',
        type: 'checkbox',
        options: [{ label: 'Yes (ship nationwide)', value: 'yes-ship-nationwide' }, { label: 'In-store pickup (free)', value: 'in-store-pickup-free' }],
      },
      {
        key: 'return-policy',
        label: 'Return Policy',
        type: 'checkbox',
        options: [{ label: '30 days (unopened)', value: '30-days-unopened' }, { label: 'No returns on balloons (inflated)', value: 'no-returns-on-balloons-inflated' }, { label: 'Seasonal items (final sale)', value: 'seasonal-items-final-sale' }],
      },
      {
        key: 'party-planning-help',
        label: 'Party Planning Help',
        type: 'checkbox',
        options: [{ label: 'Free (staff assistance)', value: 'free-staff-assistance' }, { label: 'Paid consultation (event planner)', value: 'paid-consultation-event-planner' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'rental-items-tables-chairs-linens',
        label: 'Rental Items (tables, chairs, linens)',
        type: 'checkbox',
        options: [{ label: 'Yes (see Equipment Rental)', value: 'yes-see-equipment-rental' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'delivery',
        label: 'Delivery',
        type: 'checkbox',
        options: [{ label: 'Local (fee)', value: 'local-fee' }, { label: 'No delivery (pickup only)', value: 'no-delivery-pickup-only' }],
      }
    ],
    'jewelry-store': [
      {
        key: 'store-type',
        label: 'Store Type',
        type: 'checkbox',
        options: [{ label: 'Fine jewelry (diamonds, gold, platinum)', value: 'fine-jewelry-diamonds-gold-platinum' }, { label: 'Bridal / engagement ring specialist', value: 'bridal-engagement-ring-specialist' }, { label: 'Custom jewelry design', value: 'custom-jewelry-design' }, { label: 'Vintage / estate jewelry', value: 'vintage-estate-jewelry' }, { label: 'Costume / fashion jewelry', value: 'costume-fashion-jewelry' }, { label: 'Watch specialist', value: 'watch-specialist' }, { label: 'Repair shop', value: 'repair-shop' }],
      },
      {
        key: 'products',
        label: 'Products',
        type: 'checkbox',
        options: [{ label: 'Engagement rings', value: 'engagement-rings' }, { label: 'Wedding bands', value: 'wedding-bands' }, { label: 'Earrings', value: 'earrings' }, { label: 'Necklaces', value: 'necklaces' }, { label: 'Bracelets', value: 'bracelets' }, { label: 'Pendants', value: 'pendants' }, { label: 'Anniversary rings', value: 'anniversary-rings' }, { label: 'Promise rings', value: 'promise-rings' }, { label: 'Men\'s rings / bands', value: 'men-s-rings-bands' }, { label: 'Watches (luxury or everyday)', value: 'watches-luxury-or-everyday' }, { label: 'Gems / loose stones', value: 'gems-loose-stones' }],
      },
      {
        key: 'metal-types',
        label: 'Metal Types',
        type: 'checkbox',
        options: [{ label: '14k gold (yellow, white, rose)', value: '14k-gold-yellow-white-rose' }, { label: '18k gold', value: '18k-gold' }, { label: 'Platinum', value: 'platinum' }, { label: 'Silver (sterling)', value: 'silver-sterling' }, { label: 'Gold-filled / vermeil', value: 'gold-filled-vermeil' }, { label: 'Stainless steel', value: 'stainless-steel' }, { label: 'Titanium', value: 'titanium' }, { label: 'Tungsten', value: 'tungsten' }],
      },
      {
        key: 'gemstones',
        label: 'Gemstones',
        type: 'checkbox',
        options: [{ label: 'Diamond (natural)', value: 'diamond-natural' }, { label: 'Diamond (lab-created)', value: 'diamond-lab-created' }, { label: 'Moissanite', value: 'moissanite' }, { label: 'Sapphire', value: 'sapphire' }, { label: 'Ruby', value: 'ruby' }, { label: 'Emerald', value: 'emerald' }, { label: 'Morganite', value: 'morganite' }, { label: 'Aquamarine', value: 'aquamarine' }, { label: 'Tanzanite', value: 'tanzanite' }, { label: 'Opal', value: 'opal' }, { label: 'Cubic zirconia (CZ, costume)', value: 'cubic-zirconia-cz-costume' }],
      },
      {
        key: 'diamond-certification',
        label: 'Diamond Certification',
        type: 'checkbox',
        options: [{ label: 'GIA (most reputable)', value: 'gia-most-reputable' }, { label: 'IGI', value: 'igi' }, { label: 'EGL', value: 'egl' }, { label: 'No certification (in-house)', value: 'no-certification-in-house' }],
      },
      {
        key: 'engagement-ring-price',
        label: 'Engagement Ring Price',
        type: 'checkbox',
        options: [{ label: 'Under $1,000', value: 'under-1-000' }, { label: '$1,000-2,000', value: '1-000-2-000' }, { label: '$2,000-3,000', value: '2-000-3-000' }, { label: '$3,000-5,000', value: '3-000-5-000' }, { label: '$5,000-7,000', value: '5-000-7-000' }, { label: '$7,000-10,000', value: '7-000-10-000' }, { label: '$10,000-15,000', value: '10-000-15-000' }, { label: '$15,000-25,000', value: '15-000-25-000' }, { label: '$25,000-50,000', value: '25-000-50-000' }, { label: '$50,000+', value: '50-000' }],
      },
      {
        key: 'wedding-band-price',
        label: 'Wedding Band Price',
        type: 'checkbox',
        options: [{ label: 'Under $500', value: 'under-500' }, { label: '$500-1,000', value: '500-1-000' }, { label: '$1,000-1,500', value: '1-000-1-500' }, { label: '$1,500-2,500', value: '1-500-2-500' }, { label: '$2,500-5,000', value: '2-500-5-000' }, { label: '$5,000+', value: '5-000' }],
      },
      {
        key: 'custom-design',
        label: 'Custom Design',
        type: 'checkbox',
        options: [{ label: 'Yes (CAD render, wax model)', value: 'yes-cad-render-wax-model' }, { label: 'Yes (hand-sketched)', value: 'yes-hand-sketched' }, { label: 'No (only in-stock)', value: 'no-only-in-stock' }],
      },
      {
        key: 'custom-design-fee',
        label: 'Custom Design Fee',
        type: 'checkbox',
        options: [{ label: '$0 (waived with purchase)', value: '0-waived-with-purchase' }, { label: '$100-250', value: '100-250' }, { label: '$250-500', value: '250-500' }, { label: '$500+ (complex)', value: '500-complex' }],
      },
      {
        key: 'resizing',
        label: 'Resizing',
        type: 'checkbox',
        options: [{ label: 'Free (within 30 days)', value: 'free-within-30-days' }, { label: '$20-50 (basic)', value: '20-50-basic' }, { label: '$50-100 (complex, pavé)', value: '50-100-complex-pav' }],
      },
      {
        key: 'engraving',
        label: 'Engraving',
        type: 'checkbox',
        options: [{ label: 'Free (short text)', value: 'free-short-text' }, { label: 'Per character ($___)', value: 'per-character' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'financing',
        label: 'Financing',
        type: 'checkbox',
        options: [{ label: 'In-house (no interest, ___ months)', value: 'in-house-no-interest-months' }, { label: 'Third-party (Affirm, Klarna)', value: 'third-party-affirm-klarna' }, { label: 'No (full payment)', value: 'no-full-payment' }],
      },
      {
        key: 'layaway',
        label: 'Layaway',
        type: 'checkbox',
        options: [{ label: 'Yes (no interest, ___ months)', value: 'yes-no-interest-months' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'trade-in-upgrade',
        label: 'Trade-In / Upgrade',
        type: 'checkbox',
        options: [{ label: 'Yes (credit toward larger)', value: 'yes-credit-toward-larger' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'appraisal-included',
        label: 'Appraisal Included',
        type: 'checkbox',
        options: [{ label: 'Yes (free with purchase)', value: 'yes-free-with-purchase' }, { label: 'Yes (fee $___)', value: 'yes-fee' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'lifetime-warranty',
        label: 'Lifetime Warranty',
        type: 'checkbox',
        options: [{ label: 'Yes (cleaning, inspection, prong tightening)', value: 'yes-cleaning-inspection-prong-tightening' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'cleaning-inspection',
        label: 'Cleaning / Inspection',
        type: 'checkbox',
        options: [{ label: 'Free (any time)', value: 'free-any-time' }, { label: 'Paid service ($___)', value: 'paid-service' }],
      },
      {
        key: 'gift-wrapping',
        label: 'Gift Wrapping',
        type: 'checkbox',
        options: [{ label: 'Yes (free)', value: 'yes-free' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'return-policy',
        label: 'Return Policy',
        type: 'checkbox',
        options: [{ label: '14 days (unworn)', value: '14-days-unworn' }, { label: '30 days (store credit)', value: '30-days-store-credit' }, { label: 'No returns (custom)', value: 'no-returns-custom' }],
      },
      {
        key: 'lab-vs-natural-diamond-policy',
        label: 'Lab vs Natural Diamond Policy',
        type: 'checkbox',
        options: [{ label: 'Both offered (labeled clearly)', value: 'both-offered-labeled-clearly' }, { label: 'Natural only', value: 'natural-only' }, { label: 'Lab only', value: 'lab-only' }],
      },
      {
        key: 'conflict-free-diamonds',
        label: 'Conflict-Free Diamonds',
        type: 'checkbox',
        options: [{ label: 'Yes (Kimberley Process)', value: 'yes-kimberley-process' }, { label: 'Stated (not certified)', value: 'stated-not-certified' }, { label: 'Not disclosed', value: 'not-disclosed' }],
      },
      {
        key: 'insured-shipping-online-orders',
        label: 'Insured Shipping (online orders)',
        type: 'checkbox',
        options: [{ label: 'Yes (signature required)', value: 'yes-signature-required' }, { label: 'No (pickup in-store)', value: 'no-pickup-in-store' }],
      },
      {
        key: 'appointment-required-for-custom-high-value',
        label: 'Appointment Required (for custom / high value)',
        type: 'checkbox',
        options: [{ label: 'Recommended', value: 'recommended' }, { label: 'Walk-ins welcome', value: 'walk-ins-welcome' }],
      },
      {
        key: 'private-viewing-room',
        label: 'Private Viewing Room',
        type: 'checkbox',
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      }
    ],
    'photography-store': [
      {
        key: 'store-type',
        label: 'Store Type',
        type: 'checkbox',
        options: [{ label: 'Camera retailer (new gear)', value: 'camera-retailer-new-gear' }, { label: 'Used camera gear', value: 'used-camera-gear' }, { label: 'Rental house (cameras, lenses)', value: 'rental-house-cameras-lenses' }, { label: 'Print lab (photo printing)', value: 'print-lab-photo-printing' }, { label: 'Camera repair', value: 'camera-repair' }, { label: 'Film processing (analog)', value: 'film-processing-analog' }],
      },
      {
        key: 'products-for-sale',
        label: 'Products for Sale',
        type: 'checkbox',
        options: [{ label: 'Digital cameras (DSLR, mirrorless)', value: 'digital-cameras-dslr-mirrorless' }, { label: 'Lenses (prime, zoom)', value: 'lenses-prime-zoom' }, { label: 'Tripods / monopods', value: 'tripods-monopods' }, { label: 'Lighting (strobes, LED panels)', value: 'lighting-strobes-led-panels' }, { label: 'Memory cards', value: 'memory-cards' }, { label: 'Camera bags', value: 'camera-bags' }, { label: 'Filters (ND, polarizer)', value: 'filters-nd-polarizer' }, { label: 'Batteries and chargers', value: 'batteries-and-chargers' }, { label: 'Cleaning supplies', value: 'cleaning-supplies' }, { label: 'Film (35mm, 120, instant)', value: 'film-35mm-120-instant' }, { label: 'Photo paper / ink', value: 'photo-paper-ink' }],
      },
      {
        key: 'brands-carried',
        label: 'Brands Carried',
        type: 'checkbox',
        options: [{ label: 'Canon', value: 'canon' }, { label: 'Nikon', value: 'nikon' }, { label: 'Sony', value: 'sony' }, { label: 'Fujifilm', value: 'fujifilm' }, { label: 'Panasonic', value: 'panasonic' }, { label: 'Leica', value: 'leica' }, { label: 'Sigma', value: 'sigma' }, { label: 'Tamron', value: 'tamron' }, { label: 'Godox', value: 'godox' }, { label: 'Profoto', value: 'profoto' }],
      },
      {
        key: 'camera-rentals',
        label: 'Camera Rentals',
        type: 'checkbox',
        options: [{ label: 'Daily rate', value: 'daily-rate' }, { label: 'Weekly rate', value: 'weekly-rate' }, { label: 'Deposit required', value: 'deposit-required' }, { label: 'Rental applies to purchase (some)', value: 'rental-applies-to-purchase-some' }],
      },
      {
        key: 'rental-price-body-only-per-day',
        label: 'Rental Price (body only, per day)',
        type: 'checkbox',
        options: [{ label: '$20-40 (entry)', value: '20-40-entry' }, { label: '$40-60 (mid-range)', value: '40-60-mid-range' }, { label: '$60-100 (professional)', value: '60-100-professional' }, { label: '$100-150 (flagship)', value: '100-150-flagship' }],
      },
      {
        key: 'rental-price-lenses-per-day',
        label: 'Rental Price (lenses, per day)',
        type: 'checkbox',
        options: [{ label: '$10-20 (kit)', value: '10-20-kit' }, { label: '$20-40 (standard zoom)', value: '20-40-standard-zoom' }, { label: '$40-60 (wide, telephoto)', value: '40-60-wide-telephoto' }, { label: '$60-100 (L series, GM, etc.)', value: '60-100-l-series-gm-etc' }],
      },
      {
        key: 'print-services',
        label: 'Print Services',
        type: 'checkbox',
        options: [{ label: 'Standard photo prints (4x6, 5x7, 8x10)', value: 'standard-photo-prints-4x6-5x7-8x10' }, { label: 'Enlargements (11x14, 16x20, 20x30)', value: 'enlargements-11x14-16x20-20x30' }, { label: 'Canvas wraps', value: 'canvas-wraps' }, { label: 'Metal prints', value: 'metal-prints' }, { label: 'Acrylic prints', value: 'acrylic-prints' }, { label: 'Photo books', value: 'photo-books' }, { label: 'Passport photos', value: 'passport-photos' }],
      },
      {
        key: 'print-turnaround',
        label: 'Print Turnaround',
        type: 'checkbox',
        options: [{ label: '1 hour (basic)', value: '1-hour-basic' }, { label: '24 hours', value: '24-hours' }, { label: '2-3 days', value: '2-3-days' }, { label: '5-7 days (canvas, metal)', value: '5-7-days-canvas-metal' }],
      },
      {
        key: 'passport-photos',
        label: 'Passport Photos',
        type: 'checkbox',
        options: [{ label: 'Yes ($10-15)', value: 'yes-10-15' }, { label: 'Yes (guaranteed compliant)', value: 'yes-guaranteed-compliant' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'film-processing',
        label: 'Film Processing',
        type: 'checkbox',
        options: [{ label: 'C-41 (color negative)', value: 'c-41-color-negative' }, { label: 'B&W (black & white)', value: 'b-w-black-white' }, { label: 'E-6 (slide)', value: 'e-6-slide' }, { label: 'Scans included (low res)', value: 'scans-included-low-res' }, { label: 'High res scans (extra)', value: 'high-res-scans-extra' }],
      },
      {
        key: 'sensor-cleaning-service',
        label: 'Sensor Cleaning Service',
        type: 'checkbox',
        options: [{ label: 'Yes ($___)', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'repair-services',
        label: 'Repair Services',
        type: 'checkbox',
        options: [{ label: 'In-house (basic)', value: 'in-house-basic' }, { label: 'Sent to manufacturer (ship)', value: 'sent-to-manufacturer-ship' }, { label: 'No repairs (referral)', value: 'no-repairs-referral' }],
      },
      {
        key: 'trade-in',
        label: 'Trade-In',
        type: 'checkbox',
        options: [{ label: 'Yes (credit toward purchase)', value: 'yes-credit-toward-purchase' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'used-gear-guarantee',
        label: 'Used Gear Guarantee',
        type: 'checkbox',
        options: [{ label: '30-day warranty', value: '30-day-warranty' }, { label: '90-day warranty', value: '90-day-warranty' }, { label: 'No returns (as-is)', value: 'no-returns-as-is' }],
      },
      {
        key: 'camera-classes-workshops',
        label: 'Camera Classes / Workshops',
        type: 'checkbox',
        options: [{ label: 'Yes (basic, advanced)', value: 'yes-basic-advanced' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'loyalty-program',
        label: 'Loyalty Program',
        type: 'checkbox',
        options: [{ label: 'Points per purchase', value: 'points-per-purchase' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'price-matching',
        label: 'Price Matching',
        type: 'checkbox',
        options: [{ label: 'Yes (authorized dealers)', value: 'yes-authorized-dealers' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'rental-insurance',
        label: 'Rental Insurance',
        type: 'checkbox',
        options: [{ label: 'Available (per rental)', value: 'available-per-rental' }, { label: 'No (credit card deposit)', value: 'no-credit-card-deposit' }],
      },
      {
        key: 'online-store',
        label: 'Online Store',
        type: 'checkbox',
        options: [{ label: 'Yes (ship nationwide)', value: 'yes-ship-nationwide' }, { label: 'No (in-store only)', value: 'no-in-store-only' }],
      }
    ],
    'gemstones': [
      {
        key: 'business-type',
        label: 'Business Type',
        type: 'checkbox',
        options: [{ label: 'Wholesale gem dealer', value: 'wholesale-gem-dealer' }, { label: 'Retail loose gemstones', value: 'retail-loose-gemstones' }, { label: 'Mineral / crystal shop (specimens)', value: 'mineral-crystal-shop-specimens' }, { label: 'Beads and cabochons (jewelry making)', value: 'beads-and-cabochons-jewelry-making' }, { label: 'Online only (Etsy, eBay)', value: 'online-only-etsy-ebay' }],
      },
      {
        key: 'gem-types',
        label: 'Gem Types',
        type: 'checkbox',
        options: [{ label: 'Diamond (see Jewelry)', value: 'diamond-see-jewelry' }, { label: 'Ruby', value: 'ruby' }, { label: 'Sapphire (blue, pink, yellow)', value: 'sapphire-blue-pink-yellow' }, { label: 'Emerald', value: 'emerald' }, { label: 'Morganite', value: 'morganite' }, { label: 'Aquamarine', value: 'aquamarine' }, { label: 'Tanzanite', value: 'tanzanite' }, { label: 'Tourmaline', value: 'tourmaline' }, { label: 'Garnet', value: 'garnet' }, { label: 'Amethyst', value: 'amethyst' }, { label: 'Citrine', value: 'citrine' }, { label: 'Peridot', value: 'peridot' }, { label: 'Topaz', value: 'topaz' }, { label: 'Opal', value: 'opal' }, { label: 'Moonstone', value: 'moonstone' }, { label: 'Labradorite', value: 'labradorite' }, { label: 'Malachite', value: 'malachite' }, { label: 'Turquoise', value: 'turquoise' }, { label: 'Lapis lazuli', value: 'lapis-lazuli' }],
      },
      {
        key: 'form',
        label: 'Form',
        type: 'checkbox',
        options: [{ label: 'Faceted (cut for jewelry)', value: 'faceted-cut-for-jewelry' }, { label: 'Cabochon (smooth dome)', value: 'cabochon-smooth-dome' }, { label: 'Rough (uncut, natural)', value: 'rough-uncut-natural' }, { label: 'Beads (strung or loose)', value: 'beads-strung-or-loose' }, { label: 'Carved (intaglio, cameo)', value: 'carved-intaglio-cameo' }, { label: 'Crystal points (healing)', value: 'crystal-points-healing' }],
      },
      {
        key: 'source-mining-origin',
        label: 'Source / Mining Origin',
        type: 'checkbox',
        options: [{ label: 'Brazil', value: 'brazil' }, { label: 'Colombia (emeralds)', value: 'colombia-emeralds' }, { label: 'Sri Lanka (sapphires)', value: 'sri-lanka-sapphires' }, { label: 'Myanmar (rubies)', value: 'myanmar-rubies' }, { label: 'Australia (opals)', value: 'australia-opals' }, { label: 'Zambia (emeralds)', value: 'zambia-emeralds' }, { label: 'Tanzania (tanzanite)', value: 'tanzania-tanzanite' }, { label: 'USA (tourmaline, garnet)', value: 'usa-tourmaline-garnet' }, { label: 'Madagascar', value: 'madagascar' }, { label: 'Russia', value: 'russia' }, { label: 'Not disclosed', value: 'not-disclosed' }],
      },
      {
        key: 'treatment-disclosure',
        label: 'Treatment Disclosure',
        type: 'checkbox',
        options: [{ label: 'Heat treated (standard for sapphire, ruby)', value: 'heat-treated-standard-for-sapphire-ruby' }, { label: 'Oiled (emeralds)', value: 'oiled-emeralds' }, { label: 'Irradiated (blue topaz)', value: 'irradiated-blue-topaz' }, { label: 'No treatment (natural)', value: 'no-treatment-natural' }, { label: 'Not disclosed (unethical)', value: 'not-disclosed-unethical' }],
      },
      {
        key: 'certification-lab-report',
        label: 'Certification / Lab Report',
        type: 'checkbox',
        options: [{ label: 'GIA (premium)', value: 'gia-premium' }, { label: 'IGI', value: 'igi' }, { label: 'AGS', value: 'ags' }, { label: 'No report (in-house opinion)', value: 'no-report-in-house-opinion' }],
      },
      {
        key: 'price-small-faceted-1-carat-commercial',
        label: 'Price - Small faceted (1 carat, commercial)',
        type: 'checkbox',
        options: [{ label: 'Under $50', value: 'under-50' }, { label: '$50-100', value: '50-100' }, { label: '$100-200', value: '100-200' }, { label: '$200-400', value: '200-400' }],
      },
      {
        key: 'price-fine-gem-1-carat-high-quality',
        label: 'Price - Fine gem (1 carat, high quality)',
        type: 'checkbox',
        options: [{ label: '$400-600', value: '400-600' }, { label: '$600-1,000', value: '600-1-000' }, { label: '$1,000-2,000', value: '1-000-2-000' }, { label: '$2,000-5,000', value: '2-000-5-000' }, { label: '$5,000-10,000', value: '5-000-10-000' }, { label: '$10,000+', value: '10-000' }],
      },
      {
        key: 'wholesale-to-public',
        label: 'Wholesale to Public',
        type: 'checkbox',
        options: [{ label: 'No (license required)', value: 'no-license-required' }, { label: 'Yes (with minimum)', value: 'yes-with-minimum' }],
      },
      {
        key: 'custom-cutting',
        label: 'Custom Cutting',
        type: 'checkbox',
        options: [{ label: 'Yes (lapidary services)', value: 'yes-lapidary-services' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'jewelry-setting-services',
        label: 'Jewelry Setting Services',
        type: 'checkbox',
        options: [{ label: 'In-house (set your stone)', value: 'in-house-set-your-stone' }, { label: 'Partnered bench jeweler', value: 'partnered-bench-jeweler' }, { label: 'No (stone only)', value: 'no-stone-only' }],
      },
      {
        key: 'return-policy',
        label: 'Return Policy',
        type: 'checkbox',
        options: [{ label: '14 days (unset)', value: '14-days-unset' }, { label: '30 days', value: '30-days' }, { label: 'No returns (wholesale)', value: 'no-returns-wholesale' }],
      },
      {
        key: 'education-consultation',
        label: 'Education / Consultation',
        type: 'checkbox',
        options: [{ label: 'Free (over phone)', value: 'free-over-phone' }, { label: 'Paid consultation ($___)', value: 'paid-consultation' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'ethical-conflict-free',
        label: 'Ethical / Conflict-Free',
        type: 'checkbox',
        options: [{ label: 'Stated (documented source)', value: 'stated-documented-source' }, { label: 'Not stated', value: 'not-stated' }],
      },
      {
        key: 'lab-created-synthetic',
        label: 'Lab-Created / Synthetic',
        type: 'checkbox',
        options: [{ label: 'Yes (labeled)', value: 'yes-labeled' }, { label: 'No (natural only)', value: 'no-natural-only' }],
      },
      {
        key: 'appraisal-included',
        label: 'Appraisal Included',
        type: 'checkbox',
        options: [{ label: 'Yes (free, for insurance)', value: 'yes-free-for-insurance' }, { label: 'No', value: 'no' }],
      }
    ],
    'sewing-alterations': [
      {
        key: 'alteration-type',
        label: 'Alteration Type',
        type: 'checkbox',
        options: [{ label: 'Hemming (pants, dresses, sleeves)', value: 'hemming-pants-dresses-sleeves' }, { label: 'Taking in / letting out (waist, sides)', value: 'taking-in-letting-out-waist-sides' }, { label: 'Shorten straps', value: 'shorten-straps' }, { label: 'Replace zipper', value: 'replace-zipper' }, { label: 'Replace buttons', value: 'replace-buttons' }, { label: 'Patch holes (jeans, jackets)', value: 'patch-holes-jeans-jackets' }, { label: 'Bridal alterations (hem, bustle, take in)', value: 'bridal-alterations-hem-bustle-take-in' }, { label: 'Suit alterations (jacket, pants)', value: 'suit-alterations-jacket-pants' }, { label: 'Leather / suede (specialist)', value: 'leather-suede-specialist' }, { label: 'Custom clothing (from scratch)', value: 'custom-clothing-from-scratch' }],
      },
      {
        key: 'turnaround-time',
        label: 'Turnaround Time',
        type: 'checkbox',
        options: [{ label: '3-5 days (simple)', value: '3-5-days-simple' }, { label: '1 week (standard)', value: '1-week-standard' }, { label: '2 weeks (wedding, complex)', value: '2-weeks-wedding-complex' }, { label: 'Rush available (24-48 hours, fee)', value: 'rush-available-24-48-hours-fee' }],
      },
      {
        key: 'price-hem-pants',
        label: 'Price - Hem Pants',
        type: 'checkbox',
        options: [{ label: '$10-15', value: '10-15' }, { label: '$15-20', value: '15-20' }, { label: '$20-25', value: '20-25' }],
      },
      {
        key: 'price-take-in-dress-sides',
        label: 'Price - Take in Dress (sides)',
        type: 'checkbox',
        options: [{ label: '$25-35', value: '25-35' }, { label: '$35-50', value: '35-50' }, { label: '$50-75', value: '50-75' }],
      },
      {
        key: 'price-replace-zipper',
        label: 'Price - Replace Zipper',
        type: 'checkbox',
        options: [{ label: '$20-25 (pants)', value: '20-25-pants' }, { label: '$25-35 (dress)', value: '25-35-dress' }, { label: '$35-50 (jacket)', value: '35-50-jacket' }],
      },
      {
        key: 'price-bridal-bustle',
        label: 'Price - Bridal Bustle',
        type: 'checkbox',
        options: [{ label: '$50-75', value: '50-75' }, { label: '$75-100', value: '75-100' }, { label: '$100-150 (multiple points)', value: '100-150-multiple-points' }],
      },
      {
        key: 'price-bridal-hem-multiple-layers',
        label: 'Price - Bridal Hem (multiple layers)',
        type: 'checkbox',
        options: [{ label: '$100-150', value: '100-150' }, { label: '$150-200', value: '150-200' }, { label: '$200-300 (lace, beaded)', value: '200-300-lace-beaded' }],
      },
      {
        key: 'price-suit-jacket-sleeves',
        label: 'Price - Suit Jacket Sleeves',
        type: 'checkbox',
        options: [{ label: '$25-35', value: '25-35' }, { label: '$35-50', value: '35-50' }, { label: '$50-75 (functional buttons)', value: '50-75-functional-buttons' }],
      },
      {
        key: 'first-fitting-bridal',
        label: 'First Fitting (bridal)',
        type: 'checkbox',
        options: [{ label: 'Included', value: 'included' }, { label: 'Extra fee ($___)', value: 'extra-fee' }],
      },
      {
        key: 'second-fitting-bridal',
        label: 'Second Fitting (bridal)',
        type: 'checkbox',
        options: [{ label: 'Included', value: 'included' }, { label: 'Extra fee ($___)', value: 'extra-fee' }],
      },
      {
        key: 'consultation-quote',
        label: 'Consultation / Quote',
        type: 'checkbox',
        options: [{ label: 'Free (in-person)', value: 'free-in-person' }, { label: 'Free (send photos)', value: 'free-send-photos' }, { label: 'Fee (applied to service)', value: 'fee-applied-to-service' }],
      },
      {
        key: 'minimum-charge',
        label: 'Minimum Charge',
        type: 'checkbox',
        options: [{ label: '$10', value: '10' }, { label: '$15', value: '15' }, { label: '$20', value: '20' }, { label: 'No minimum', value: 'no-minimum' }],
      },
      {
        key: 'rush-fee',
        label: 'Rush Fee',
        type: 'checkbox',
        options: [{ label: '24 hours (50% extra)', value: '24-hours-50-extra' }, { label: '48 hours (25% extra)', value: '48-hours-25-extra' }, { label: 'None (just faster turnaround)', value: 'none-just-faster-turnaround' }],
      },
      {
        key: 'garment-preparation',
        label: 'Garment Preparation',
        type: 'checkbox',
        options: [{ label: 'Clean (no stains)', value: 'clean-no-stains' }, { label: 'No perfume (avoid damage)', value: 'no-perfume-avoid-damage' }, { label: 'Bring shoes for hem (for length)', value: 'bring-shoes-for-hem-for-length' }],
      },
      {
        key: 'pickup-delivery',
        label: 'Pickup / Delivery',
        type: 'checkbox',
        options: [{ label: 'In-store pickup', value: 'in-store-pickup' }, { label: 'Delivery (local, fee)', value: 'delivery-local-fee' }, { label: 'Mail-in (client ships)', value: 'mail-in-client-ships' }],
      },
      {
        key: 'custom-garments',
        label: 'Custom Garments',
        type: 'checkbox',
        options: [{ label: 'Dress from pattern', value: 'dress-from-pattern' }, { label: 'Shirt / blouse', value: 'shirt-blouse' }, { label: 'Pants', value: 'pants' }, { label: 'Costume / cosplay', value: 'costume-cosplay' }],
      },
      {
        key: 'custom-price-range',
        label: 'Custom Price Range',
        type: 'checkbox',
        options: [{ label: '$50-100 (simple top)', value: '50-100-simple-top' }, { label: '$100-200 (dress)', value: '100-200-dress' }, { label: '$200-400 (suit jacket)', value: '200-400-suit-jacket' }, { label: '$400+ (wedding dress from scratch)', value: '400-wedding-dress-from-scratch' }],
      },
      {
        key: 'leather-suede-specialist',
        label: 'Leather / Suede Specialist',
        type: 'checkbox',
        options: [{ label: 'Yes (different equipment)', value: 'yes-different-equipment' }, { label: 'No (referral)', value: 'no-referral' }],
      },
      {
        key: 'household-items',
        label: 'Household Items',
        type: 'checkbox',
        options: [{ label: 'Curtains', value: 'curtains' }, { label: 'Throw pillows', value: 'throw-pillows' }, { label: 'Upholstery repair', value: 'upholstery-repair' }, { label: 'No', value: 'no' }],
      },
      {
        key: 'payment',
        label: 'Payment',
        type: 'checkbox',
        options: [{ label: 'Cash discount', value: 'cash-discount' }, { label: 'Credit card', value: 'credit-card' }, { label: 'Venmo / PayPal', value: 'venmo-paypal' }],
      },
      {
        key: 'cancellation-no-show-appointment',
        label: 'Cancellation / No-Show (appointment)',
        type: 'checkbox',
        options: [{ label: '24 hours (free)', value: '24-hours-free' }, { label: 'No-show (fee)', value: 'no-show-fee' }],
      }
    ],
    'sign-making': [
      {
        key: 'sign-type',
        label: 'Sign Type',
        type: 'checkbox',
        options: [{ label: 'Vinyl decals / stickers', value: 'vinyl-decals-stickers' }, { label: 'Banners (vinyl, mesh)', value: 'banners-vinyl-mesh' }, { label: 'Yard signs (corrugated plastic)', value: 'yard-signs-corrugated-plastic' }, { label: 'A-frame sidewalk signs', value: 'a-frame-sidewalk-signs' }, { label: 'Vehicle wraps (full or partial)', value: 'vehicle-wraps-full-or-partial' }, { label: 'Window graphics (perforated, etched)', value: 'window-graphics-perforated-etched' }, { label: 'Magnetic signs (car doors)', value: 'magnetic-signs-car-doors' }, { label: 'Acrylic / aluminum signs (indoor)', value: 'acrylic-aluminum-signs-indoor' }, { label: 'Illuminated signs (LED, neon)', value: 'illuminated-signs-led-neon' }, { label: 'Dimensional letters (metal, foam)', value: 'dimensional-letters-metal-foam' }, { label: 'Trade show displays (pop-up, retractable)', value: 'trade-show-displays-pop-up-retractable' }, { label: 'Engraved signs (wood, brass, plastic)', value: 'engraved-signs-wood-brass-plastic' }],
      },
      {
        key: 'material',
        label: 'Material',
        type: 'checkbox',
        options: [{ label: 'Vinyl (adhesive)', value: 'vinyl-adhesive' }, { label: 'Coroplast (corrugated plastic)', value: 'coroplast-corrugated-plastic' }, { label: 'Aluminum (metal, durable)', value: 'aluminum-metal-durable' }, { label: 'PVC / Sintra (rigid plastic)', value: 'pvc-sintra-rigid-plastic' }, { label: 'Acrylic (plexiglass)', value: 'acrylic-plexiglass' }, { label: 'Wood (painted or engraved)', value: 'wood-painted-or-engraved' }, { label: 'Foam core (lightweight indoor)', value: 'foam-core-lightweight-indoor' }, { label: 'Magnetic sheeting', value: 'magnetic-sheeting' }],
      },
      {
        key: 'size-dimensions',
        label: 'Size / Dimensions',
        type: 'checkbox',
        options: [{ label: 'Small (under 12x12)', value: 'small-under-12x12' }, { label: 'Medium (24x36)', value: 'medium-24x36' }, { label: 'Large (4x8 ft)', value: 'large-4x8-ft' }, { label: 'Extra large (8x8+ ft)', value: 'extra-large-8x8-ft' }, { label: 'Custom dimensions', value: 'custom-dimensions' }],
      },
      {
        key: 'price-vinyl-decal-small',
        label: 'Price - Vinyl Decal (small)',
        type: 'checkbox',
        options: [{ label: '$5-10', value: '5-10' }, { label: '$10-15', value: '10-15' }, { label: '$15-25', value: '15-25' }],
      },
      {
        key: 'price-banner-2x4-ft',
        label: 'Price - Banner (2x4 ft)',
        type: 'checkbox',
        options: [{ label: '$20-30', value: '20-30' }, { label: '$30-40', value: '30-40' }, { label: '$40-60', value: '40-60' }],
      },
      {
        key: 'price-yard-sign-single-color',
        label: 'Price - Yard Sign (single color)',
        type: 'checkbox',
        options: [{ label: '$10-15', value: '10-15' }, { label: '$15-20', value: '15-20' }, { label: '$20-30', value: '20-30' }],
      },
      {
        key: 'price-vehicle-wrap-per-door',
        label: 'Price - Vehicle Wrap (per door)',
        type: 'checkbox',
        options: [{ label: '$150-250', value: '150-250' }, { label: '$250-400', value: '250-400' }, { label: '$400-600', value: '400-600' }],
      },
      {
        key: 'full-vehicle-wrap',
        label: 'Full Vehicle Wrap',
        type: 'checkbox',
        options: [{ label: '$1,500-2,500 (small car)', value: '1-500-2-500-small-car' }, { label: '$2,500-4,000 (sedan)', value: '2-500-4-000-sedan' }, { label: '$4,000-6,000 (van/truck)', value: '4-000-6-000-van-truck' }],
      },
      {
        key: 'color',
        label: 'Color',
        type: 'checkbox',
        options: [{ label: 'Single color', value: 'single-color' }, { label: 'Spot color (2-3)', value: 'spot-color-2-3' }, { label: 'Full color (CMYK)', value: 'full-color-cmyk' }, { label: 'Custom Pantone match (fee)', value: 'custom-pantone-match-fee' }],
      },
      {
        key: 'artwork-setup',
        label: 'Artwork Setup',
        type: 'checkbox',
        options: [{ label: 'Template provided', value: 'template-provided' }, { label: 'Design assistance (fee)', value: 'design-assistance-fee' }, { label: 'Client provides print-ready file', value: 'client-provides-print-ready-file' }],
      },
      {
        key: 'file-types-accepted',
        label: 'File Types Accepted',
        type: 'checkbox',
        options: [{ label: 'AI (Adobe Illustrator)', value: 'ai-adobe-illustrator' }, { label: 'EPS', value: 'eps' }, { label: 'PDF (high res)', value: 'pdf-high-res' }, { label: 'PSD (with layers)', value: 'psd-with-layers' }, { label: 'JPG / PNG (not preferred)', value: 'jpg-png-not-preferred' }],
      },
      {
        key: 'proof-provided',
        label: 'Proof Provided',
        type: 'checkbox',
        options: [{ label: 'Digital proof (free)', value: 'digital-proof-free' }, { label: 'Physical proof (fee)', value: 'physical-proof-fee' }, { label: 'No proof (proceed with file)', value: 'no-proof-proceed-with-file' }],
      },
      {
        key: 'turnaround',
        label: 'Turnaround',
        type: 'checkbox',
        options: [{ label: '24 hours (small decals)', value: '24-hours-small-decals' }, { label: '2-3 days (banners)', value: '2-3-days-banners' }, { label: '3-5 days (vehicle wrap)', value: '3-5-days-vehicle-wrap' }, { label: '5-7 days (illuminated)', value: '5-7-days-illuminated' }],
      },
      {
        key: 'rush-fee',
        label: 'Rush Fee',
        type: 'checkbox',
        options: [{ label: '50% extra (same day)', value: '50-extra-same-day' }, { label: '25% extra (next day)', value: '25-extra-next-day' }],
      },
      {
        key: 'installation',
        label: 'Installation',
        type: 'checkbox',
        options: [{ label: 'Self-install (instructions provided)', value: 'self-install-instructions-provided' }, { label: 'Installation service (fee)', value: 'installation-service-fee' }, { label: 'Not offered', value: 'not-offered' }],
      },
      {
        key: 'installation-fee-vehicle-wrap',
        label: 'Installation Fee (vehicle wrap)',
        type: 'checkbox',
        options: [{ label: '$100-200 (partial)', value: '100-200-partial' }, { label: '$200-500 (full wrap)', value: '200-500-full-wrap' }],
      },
      {
        key: 'permit-assistance-if-required',
        label: 'Permit Assistance (if required)',
        type: 'checkbox',
        options: [{ label: 'No', value: 'no' }, { label: 'Yes (advice only)', value: 'yes-advice-only' }],
      },
      {
        key: 'warranty',
        label: 'Warranty',
        type: 'checkbox',
        options: [{ label: '1 year (outdoor, vinyl)', value: '1-year-outdoor-vinyl' }, { label: '3 years (vehicle wrap)', value: '3-years-vehicle-wrap' }, { label: 'No warranty (fading normal)', value: 'no-warranty-fading-normal' }],
      },
      {
        key: 'bulk-discount',
        label: 'Bulk Discount',
        type: 'checkbox',
        options: [{ label: '10% off 10+', value: '10-off-10' }, { label: '20% off 50+', value: '20-off-50' }, { label: 'Quote for 100+', value: 'quote-for-100' }],
      },
      {
        key: 'shipping',
        label: 'Shipping',
        type: 'checkbox',
        options: [{ label: 'Rolled (banner, vinyl)', value: 'rolled-banner-vinyl' }, { label: 'Flat box (rigid signs)', value: 'flat-box-rigid-signs' }, { label: 'Local pickup (free)', value: 'local-pickup-free' }],
      }
    ],
    'film-production': [
      {
        key: 'company-type',
        label: 'Company Type',
        type: 'checkbox',
        options: [{ label: 'Full-service production company', value: 'full-service-production-company' }, { label: 'Video agency (commercial, corporate)', value: 'video-agency-commercial-corporate' }, { label: 'Documentary production', value: 'documentary-production' }, { label: 'Music video production', value: 'music-video-production' }, { label: 'Event videography (see Videographer)', value: 'event-videography-see-videographer' }, { label: 'Animation / motion graphics', value: 'animation-motion-graphics' }, { label: 'Post-production house (editing, color, VFX)', value: 'post-production-house-editing-color-vfx' }],
      },
      {
        key: 'services',
        label: 'Services',
        type: 'checkbox',
        options: [{ label: 'Pre-production (script, storyboard, casting)', value: 'pre-production-script-storyboard-casting' }, { label: 'Production (shooting, lighting, sound)', value: 'production-shooting-lighting-sound' }, { label: 'Post-production (editing, color grading, sound mix)', value: 'post-production-editing-color-grading-sound-mix' }, { label: 'Drone cinematography', value: 'drone-cinematography' }, { label: 'Studio rental (green screen, cyclorama)', value: 'studio-rental-green-screen-cyclorama' }, { label: 'Equipment rental (cameras, lights, grip)', value: 'equipment-rental-cameras-lights-grip' }],
      },
      {
        key: 'project-types',
        label: 'Project Types',
        type: 'checkbox',
        options: [{ label: 'TV commercial (30s, 60s)', value: 'tv-commercial-30s-60s' }, { label: 'Digital ad (social media, YouTube)', value: 'digital-ad-social-media-youtube' }, { label: 'Corporate video (brand story, recruitment)', value: 'corporate-video-brand-story-recruitment' }, { label: 'Event highlight video', value: 'event-highlight-video' }, { label: 'Documentary short / feature', value: 'documentary-short-feature' }, { label: 'Music video', value: 'music-video' }, { label: 'Training / instructional video', value: 'training-instructional-video' }, { label: 'Explainer video (animated)', value: 'explainer-video-animated' }, { label: 'Product demo', value: 'product-demo' }, { label: 'Real estate (high-end, drone)', value: 'real-estate-high-end-drone' }],
      },
      {
        key: 'price-models',
        label: 'Price Models',
        type: 'checkbox',
        options: [{ label: 'Day rate (production crew)', value: 'day-rate-production-crew' }, { label: 'Project bid (fixed price)', value: 'project-bid-fixed-price' }, { label: 'Production package (pre-defined)', value: 'production-package-pre-defined' }, { label: 'Hourly (post-production, editing)', value: 'hourly-post-production-editing' }],
      },
      {
        key: 'crew-day-rates',
        label: 'Crew Day Rates',
        type: 'checkbox',
        options: [{ label: 'Producer: $500-1,000/day', value: 'producer-500-1-000-day' }, { label: 'Director: $1,000-3,000/day', value: 'director-1-000-3-000-day' }, { label: 'DP (Director of Photography): $800-2,000/day', value: 'dp-director-of-photography-800-2-000-day' }, { label: 'Camera operator: $500-1,000/day', value: 'camera-operator-500-1-000-day' }, { label: 'Gaffer (lighting): $500-800/day', value: 'gaffer-lighting-500-800-day' }, { label: 'Sound mixer: $400-700/day', value: 'sound-mixer-400-700-day' }, { label: 'Production assistant: $200-350/day', value: 'production-assistant-200-350-day' }],
      },
      {
        key: 'equipment-rental-per-day',
        label: 'Equipment Rental (per day)',
        type: 'checkbox',
        options: [{ label: 'Camera package (Sony FX6/FX9): $500-800', value: 'camera-package-sony-fx6-fx9-500-800' }, { label: 'Cinema camera (RED, ARRI): $1,000-2,000', value: 'cinema-camera-red-arri-1-000-2-000' }, { label: 'Lens kit: $200-500', value: 'lens-kit-200-500' }, { label: 'Lighting kit: $200-500', value: 'lighting-kit-200-500' }, { label: 'Grip package: $150-300', value: 'grip-package-150-300' }],
      },
      {
        key: 'editing-post-rates',
        label: 'Editing / Post Rates',
        type: 'checkbox',
        options: [{ label: 'Editor: $400-800/day', value: 'editor-400-800-day' }, { label: 'Colorist: $500-1,000/day', value: 'colorist-500-1-000-day' }, { label: 'Sound designer/mixer: $400-700/day', value: 'sound-designer-mixer-400-700-day' }, { label: 'Motion graphics (per second): $20-50', value: 'motion-graphics-per-second-20-50' }],
      },
      {
        key: '30-second-commercial-basic',
        label: '30-Second Commercial (basic)',
        type: 'checkbox',
        options: [{ label: '$3,000-5,000', value: '3-000-5-000' }, { label: '$5,000-10,000', value: '5-000-10-000' }, { label: '$10,000-25,000', value: '10-000-25-000' }, { label: '$25,000-50,000 (agency quality)', value: '25-000-50-000-agency-quality' }, { label: '$50,000-100,000+ (broadcast, celebrity)', value: '50-000-100-000-broadcast-celebrity' }],
      },
      {
        key: 'corporate-video-3-5-minutes',
        label: 'Corporate Video (3-5 minutes)',
        type: 'checkbox',
        options: [{ label: '$2,000-4,000', value: '2-000-4-000' }, { label: '$4,000-7,000', value: '4-000-7-000' }, { label: '$7,000-10,000', value: '7-000-10-000' }, { label: '$10,000-15,000', value: '10-000-15-000' }],
      },
      {
        key: 'music-video',
        label: 'Music Video',
        type: 'checkbox',
        options: [{ label: '$1,500-3,000 (simple)', value: '1-500-3-000-simple' }, { label: '$3,000-6,000 (multi-location)', value: '3-000-6-000-multi-location' }, { label: '$6,000-10,000 (concept, effects)', value: '6-000-10-000-concept-effects' }, { label: '$10,000-20,000 (narrative)', value: '10-000-20-000-narrative' }],
      },
      {
        key: 'turnaround-post-production',
        label: 'Turnaround (post-production)',
        type: 'checkbox',
        options: [{ label: '1-2 weeks (short, simple)', value: '1-2-weeks-short-simple' }, { label: '3-4 weeks (standard)', value: '3-4-weeks-standard' }, { label: '6-8 weeks (complex, effects)', value: '6-8-weeks-complex-effects' }, { label: 'Rush (50% extra)', value: 'rush-50-extra' }],
      },
      {
        key: 'revisions-included',
        label: 'Revisions Included',
        type: 'checkbox',
        options: [{ label: '2 rounds', value: '2-rounds' }, { label: '3 rounds', value: '3-rounds' }, { label: 'Unlimited (with cap)', value: 'unlimited-with-cap' }],
      },
      {
        key: 'music-licensing',
        label: 'Music Licensing',
        type: 'checkbox',
        options: [{ label: 'Royalty-free (included)', value: 'royalty-free-included' }, { label: 'Custom composition (extra)', value: 'custom-composition-extra' }, { label: 'Artist licensing (client arranges)', value: 'artist-licensing-client-arranges' }],
      },
      {
        key: 'talent-casting',
        label: 'Talent / Casting',
        type: 'checkbox',
        options: [{ label: 'Real people (clients)', value: 'real-people-clients' }, { label: 'Professional actors (extra)', value: 'professional-actors-extra' }, { label: 'Voiceover (extra)', value: 'voiceover-extra' }],
      },
      {
        key: 'insurance',
        label: 'Insurance',
        type: 'checkbox',
        options: [{ label: 'Production insurance (COI available)', value: 'production-insurance-coi-available' }, { label: 'Client must provide COI (some)', value: 'client-must-provide-coi-some' }],
      },
      {
        key: 'location-permits',
        label: 'Location Permits',
        type: 'checkbox',
        options: [{ label: 'Client responsible', value: 'client-responsible' }, { label: 'Production company handles (fee)', value: 'production-company-handles-fee' }],
      },
      {
        key: 'meals-craft-services',
        label: 'Meals / Craft Services',
        type: 'checkbox',
        options: [{ label: 'Provided (on full day shoots)', value: 'provided-on-full-day-shoots' }, { label: 'Client pays extra', value: 'client-pays-extra' }],
      },
      {
        key: 'travel-lodging',
        label: 'Travel / Lodging',
        type: 'checkbox',
        options: [{ label: 'Client pays (if outside area)', value: 'client-pays-if-outside-area' }, { label: 'Included in bid (local only)', value: 'included-in-bid-local-only' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: '25-50% (to book)', value: '25-50-to-book' }, { label: 'Remainder upon delivery', value: 'remainder-upon-delivery' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: '14 days (refund minus deposit)', value: '14-days-refund-minus-deposit' }, { label: '7 days (50% of bid)', value: '7-days-50-of-bid' }, { label: '48 hours (no refund)', value: '48-hours-no-refund' }],
      },
      {
        key: 'rights-usage',
        label: 'Rights / Usage',
        type: 'checkbox',
        options: [{ label: 'Full buyout (client owns everything)', value: 'full-buyout-client-owns-everything' }, { label: 'Limited usage (specify term, region, medium)', value: 'limited-usage-specify-term-region-medium' }, { label: 'Additional fee for broadcast / extended use', value: 'additional-fee-for-broadcast-extended-use' }],
      },
      {
        key: 'portfolio-reel',
        label: 'Portfolio / Reel',
        type: 'checkbox',
        options: [{ label: 'Yes (request link)', value: 'yes-request-link' }, { label: 'Available upon request', value: 'available-upon-request' }],
      },
      {
        key: 'nda-non-disclosure',
        label: 'NDA (Non-Disclosure)',
        type: 'checkbox',
        options: [{ label: 'Signed before discussing project', value: 'signed-before-discussing-project' }, { label: 'Not required', value: 'not-required' }],
      }
    ],
    'event-technology-service': [
      {
        key: 'services',
        label: 'Services',
        type: 'checkbox',
        options: [{ label: 'AV equipment rental', value: 'av-equipment-rental' }, { label: 'Sound system (PA, speakers, mics)', value: 'sound-system-pa-speakers-mics' }, { label: 'Lighting (stage, dance floor, uplighting)', value: 'lighting-stage-dance-floor-uplighting' }, { label: 'LED screens / video walls', value: 'led-screens-video-walls' }, { label: 'Projectors and screens', value: 'projectors-and-screens' }, { label: 'Staging (truss, risers)', value: 'staging-truss-risers' }, { label: 'Live streaming setup', value: 'live-streaming-setup' }, { label: 'Hybrid event support (in-person + remote)', value: 'hybrid-event-support-in-person-remote' }, { label: 'Event app development', value: 'event-app-development' }, { label: 'RFID check-in / badging', value: 'rfid-check-in-badging' }, { label: 'WiFi hotspot rental', value: 'wifi-hotspot-rental' }, { label: 'Charging stations (phone, laptop)', value: 'charging-stations-phone-laptop' }],
      },
      {
        key: 'av-package-for-small-event-50-people',
        label: 'AV Package for Small Event (50 people)',
        type: 'checkbox',
        options: [{ label: '$500-800', value: '500-800' }, { label: '$800-1,200', value: '800-1-200' }, { label: '$1,200-1,800', value: '1-200-1-800' }],
      },
      {
        key: 'av-for-wedding-100-150-people',
        label: 'AV for Wedding (100-150 people)',
        type: 'checkbox',
        options: [{ label: '$800-1,200 (basic)', value: '800-1-200-basic' }, { label: '$1,200-2,000 (standard)', value: '1-200-2-000-standard' }, { label: '$2,000-3,500 (premium)', value: '2-000-3-500-premium' }],
      },
      {
        key: 'av-for-corporate-conference-200-people',
        label: 'AV for Corporate Conference (200+ people)',
        type: 'checkbox',
        options: [{ label: '$3,000-5,000', value: '3-000-5-000' }, { label: '$5,000-10,000', value: '5-000-10-000' }, { label: '$10,000-20,000', value: '10-000-20-000' }, { label: '$20,000-50,000', value: '20-000-50-000' }],
      },
      {
        key: 'live-streaming-single-camera',
        label: 'Live Streaming (single camera)',
        type: 'checkbox',
        options: [{ label: '$1,000-1,500', value: '1-000-1-500' }, { label: '$1,500-2,500', value: '1-500-2-500' }, { label: '$2,500-4,000', value: '2-500-4-000' }],
      },
      {
        key: 'live-streaming-multi-camera',
        label: 'Live Streaming (multi-camera)',
        type: 'checkbox',
        options: [{ label: '$3,000-5,000', value: '3-000-5-000' }, { label: '$5,000-8,000', value: '5-000-8-000' }, { label: '$8,000-15,000', value: '8-000-15-000' }],
      },
      {
        key: 'uplighting-per-fixture',
        label: 'Uplighting (per fixture)',
        type: 'checkbox',
        options: [{ label: '$25-35', value: '25-35' }, { label: '$35-50', value: '35-50' }, { label: '$50-75 (wireless, color mixing)', value: '50-75-wireless-color-mixing' }],
      },
      {
        key: 'led-wall-per-square-foot',
        label: 'LED Wall (per square foot)',
        type: 'checkbox',
        options: [{ label: '$15-25', value: '15-25' }, { label: '$25-40', value: '25-40' }, { label: '$40-60', value: '40-60' }],
      },
      {
        key: 'on-site-technician',
        label: 'On-Site Technician',
        type: 'checkbox',
        options: [{ label: 'Included (with rental)', value: 'included-with-rental' }, { label: '$400-600 (half day)', value: '400-600-half-day' }, { label: '$600-1,000 (full day)', value: '600-1-000-full-day' }],
      },
      {
        key: 'setup-strike-time',
        label: 'Setup / Strike Time',
        type: 'checkbox',
        options: [{ label: 'Billed separately (time + travel)', value: 'billed-separately-time-travel' }, { label: 'Included in package', value: 'included-in-package' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: '1 day (pickup day before, return next day)', value: '1-day-pickup-day-before-return-next-day' }, { label: '3 days (weekend event)', value: '3-days-weekend-event' }, { label: 'Weekly', value: 'weekly' }],
      },
      {
        key: 'delivery-setup',
        label: 'Delivery / Setup',
        type: 'checkbox',
        options: [{ label: 'Delivery fee ($___)', value: 'delivery-fee' }, { label: 'Setup included (minimum purchase)', value: 'setup-included-minimum-purchase' }, { label: 'Self pickup (no delivery)', value: 'self-pickup-no-delivery' }],
      },
      {
        key: 'tech-rehearsal-included',
        label: 'Tech Rehearsal Included',
        type: 'checkbox',
        options: [{ label: 'Yes (1-2 hours)', value: 'yes-1-2-hours' }, { label: 'No (extra fee)', value: 'no-extra-fee' }],
      },
      {
        key: 'backup-equipment-on-site',
        label: 'Backup Equipment On-Site',
        type: 'checkbox',
        options: [{ label: 'Yes (critical items)', value: 'yes-critical-items' }, { label: 'No (bring backups yourself)', value: 'no-bring-backups-yourself' }],
      },
      {
        key: 'power-requirements',
        label: 'Power Requirements',
        type: 'checkbox',
        options: [{ label: 'Standard wall outlets', value: 'standard-wall-outlets' }, { label: 'Genuine power distribution (extra)', value: 'genuine-power-distribution-extra' }, { label: 'Generator available (extra)', value: 'generator-available-extra' }],
      },
      {
        key: 'weather-considerations-outdoor',
        label: 'Weather Considerations (outdoor)',
        type: 'checkbox',
        options: [{ label: 'Water-resistant gear (extra)', value: 'water-resistant-gear-extra' }, { label: 'No exposure (indoor only)', value: 'no-exposure-indoor-only' }],
      },
      {
        key: 'client-provides',
        label: 'Client Provides',
        type: 'checkbox',
        options: [{ label: 'Event schedule', value: 'event-schedule' }, { label: 'Run of show', value: 'run-of-show' }, { label: 'Contact person on-site', value: 'contact-person-on-site' }],
      },
      {
        key: 'insurance',
        label: 'Insurance',
        type: 'checkbox',
        options: [{ label: 'Company carries liability', value: 'company-carries-liability' }, { label: 'COI provided upon request', value: 'coi-provided-upon-request' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: '25%', value: '25' }, { label: '50%', value: '50' }, { label: 'No deposit', value: 'no-deposit' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: '30 days (full refund minus deposit)', value: '30-days-full-refund-minus-deposit' }, { label: '14 days (50% of total)', value: '14-days-50-of-total' }, { label: '7 days (no refund)', value: '7-days-no-refund' }],
      }
    ],
    'silent-disco': [
      {
        key: 'service-type',
        label: 'Service Type',
        type: 'checkbox',
        options: [{ label: 'Headphone rental (for event)', value: 'headphone-rental-for-event' }, { label: 'DJ + headphones package', value: 'dj-headphones-package' }, { label: 'Multiple channel silent disco (2-3 channels)', value: 'multiple-channel-silent-disco-2-3-channels' }, { label: 'Add-on for existing DJ', value: 'add-on-for-existing-dj' }],
      },
      {
        key: 'capacity',
        label: 'Capacity',
        type: 'checkbox',
        options: [{ label: '25-50 headphones', value: '25-50-headphones' }, { label: '50-100', value: '50-100' }, { label: '100-200', value: '100-200' }, { label: '200-500', value: '200-500' }, { label: '500+', value: '500' }],
      },
      {
        key: 'number-of-channels',
        label: 'Number of Channels',
        type: 'checkbox',
        options: [{ label: '1 channel (everyone hears same)', value: '1-channel-everyone-hears-same' }, { label: '2 channels (choose A or B)', value: '2-channels-choose-a-or-b' }, { label: '3 channels (A, B, C)', value: '3-channels-a-b-c' }],
      },
      {
        key: 'headphone-features',
        label: 'Headphone Features',
        type: 'checkbox',
        options: [{ label: 'Over-ear (comfortable)', value: 'over-ear-comfortable' }, { label: 'LED color (matches channel)', value: 'led-color-matches-channel' }, { label: 'Volume control', value: 'volume-control' }, { label: 'Rechargeable battery', value: 'rechargeable-battery' }, { label: 'Range: 500-1,000 ft', value: 'range-500-1-000-ft' }],
      },
      {
        key: 'rental-duration',
        label: 'Rental Duration',
        type: 'checkbox',
        options: [{ label: '4 hours (minimum)', value: '4-hours-minimum' }, { label: '8 hours (full event)', value: '8-hours-full-event' }, { label: '24 hours (overnight)', value: '24-hours-overnight' }, { label: 'Weekend', value: 'weekend' }],
      },
      {
        key: 'price-per-headphone-event',
        label: 'Price (per headphone, event)',
        type: 'checkbox',
        options: [{ label: '$5-8', value: '5-8' }, { label: '$8-10', value: '8-10' }, { label: '$10-12', value: '10-12' }],
      },
      {
        key: 'price-package-with-dj',
        label: 'Price (package with DJ)',
        type: 'checkbox',
        options: [{ label: '$1,000-1,500 (50 headphones)', value: '1-000-1-500-50-headphones' }, { label: '$1,500-2,500 (100)', value: '1-500-2-500-100' }, { label: '$2,500-4,000 (200)', value: '2-500-4-000-200' }, { label: '$4,000-6,000 (500)', value: '4-000-6-000-500' }],
      },
      {
        key: 'dj-included',
        label: 'DJ Included',
        type: 'checkbox',
        options: [{ label: 'Yes (one DJ for all channels)', value: 'yes-one-dj-for-all-channels' }, { label: 'Yes (two DJs for two channels)', value: 'yes-two-djs-for-two-channels' }, { label: 'No (client provides DJs)', value: 'no-client-provides-djs' }],
      },
      {
        key: 'dj-equipment',
        label: 'DJ Equipment',
        type: 'checkbox',
        options: [{ label: 'Mixer (multi-channel)', value: 'mixer-multi-channel' }, { label: 'Transmitter (wireless)', value: 'transmitter-wireless' }, { label: 'Included', value: 'included' }],
      },
      {
        key: 'setup-time',
        label: 'Setup Time',
        type: 'checkbox',
        options: [{ label: '30-60 minutes', value: '30-60-minutes' }, { label: 'Included in rental', value: 'included-in-rental' }],
      },
      {
        key: 'cleaning-sanitization',
        label: 'Cleaning / Sanitization',
        type: 'checkbox',
        options: [{ label: 'Headphones cleaned between uses', value: 'headphones-cleaned-between-uses' }, { label: 'Disposable ear covers (extra)', value: 'disposable-ear-covers-extra' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: '$500-1,000 (refundable)', value: '500-1-000-refundable' }, { label: 'Credit card hold', value: 'credit-card-hold' }],
      },
      {
        key: 'damage-loss-fee',
        label: 'Damage / Loss Fee',
        type: 'checkbox',
        options: [{ label: '$50-75 per headphone', value: '50-75-per-headphone' }, { label: '$200-300 per transmitter', value: '200-300-per-transmitter' }],
      },
      {
        key: 'delivery-pickup',
        label: 'Delivery / Pickup',
        type: 'checkbox',
        options: [{ label: 'Local delivery (fee)', value: 'local-delivery-fee' }, { label: 'Will call (client picks up)', value: 'will-call-client-picks-up' }],
      },
      {
        key: 'staffing',
        label: 'Staffing',
        type: 'checkbox',
        options: [{ label: 'On-site technician included', value: 'on-site-technician-included' }, { label: 'No staff (self-service)', value: 'no-staff-self-service' }],
      },
      {
        key: 'battery-life',
        label: 'Battery Life',
        type: 'checkbox',
        options: [{ label: '6-8 hours (fully charged)', value: '6-8-hours-fully-charged' }, { label: 'Backup batteries available (extra)', value: 'backup-batteries-available-extra' }],
      },
      {
        key: 'outdoor-use',
        label: 'Outdoor Use',
        type: 'checkbox',
        options: [{ label: 'Yes (weather permitting)', value: 'yes-weather-permitting' }, { label: 'No (indoor only)', value: 'no-indoor-only' }],
      },
      {
        key: 'themes-color-coding',
        label: 'Themes / Color Coding',
        type: 'checkbox',
        options: [{ label: 'Channel A (red LED)', value: 'channel-a-red-led' }, { label: 'Channel B (blue LED)', value: 'channel-b-blue-led' }, { label: 'Channel C (green LED)', value: 'channel-c-green-led' }, { label: 'Custom LED colors (extra)', value: 'custom-led-colors-extra' }],
      },
      {
        key: 'silent-disco-parties',
        label: 'Silent Disco Parties',
        type: 'checkbox',
        options: [{ label: 'Dance party (no loud music complaints)', value: 'dance-party-no-loud-music-complaints' }, { label: 'Wedding after-party', value: 'wedding-after-party' }, { label: 'Corporate team building', value: 'corporate-team-building' }, { label: 'Library / quiet venue parties', value: 'library-quiet-venue-parties' }],
      }
    ],
    'trivia-host': [
      {
        key: 'host-type',
        label: 'Host Type',
        type: 'checkbox',
        options: [{ label: 'Live trivia host (in-person)', value: 'live-trivia-host-in-person' }, { label: 'Virtual trivia host (Zoom)', value: 'virtual-trivia-host-zoom' }, { label: 'Bar / pub trivia (weekly recurring)', value: 'bar-pub-trivia-weekly-recurring' }, { label: 'Private event trivia (birthday, corporate)', value: 'private-event-trivia-birthday-corporate' }, { label: 'Themed trivia (Harry Potter, Marvel, etc.)', value: 'themed-trivia-harry-potter-marvel-etc' }],
      },
      {
        key: 'number-of-rounds',
        label: 'Number of Rounds',
        type: 'checkbox',
        options: [{ label: '3 rounds', value: '3-rounds' }, { label: '4 rounds', value: '4-rounds' }, { label: '5 rounds', value: '5-rounds' }, { label: '6+ rounds', value: '6-rounds' }],
      },
      {
        key: 'round-types',
        label: 'Round Types',
        type: 'checkbox',
        options: [{ label: 'General knowledge', value: 'general-knowledge' }, { label: 'Music (song clips)', value: 'music-song-clips' }, { label: 'Picture round', value: 'picture-round' }, { label: 'Video round', value: 'video-round' }, { label: 'Speed round', value: 'speed-round' }, { label: 'True / false', value: 'true-false' }, { label: 'Multiple choice', value: 'multiple-choice' }, { label: 'Fill in the blank', value: 'fill-in-the-blank' }],
      },
      {
        key: 'team-size',
        label: 'Team Size',
        type: 'checkbox',
        options: [{ label: '1-2 players', value: '1-2-players' }, { label: '3-4', value: '3-4' }, { label: '5-6', value: '5-6' }, { label: 'No limit (teams of any size)', value: 'no-limit-teams-of-any-size' }],
      },
      {
        key: 'event-duration',
        label: 'Event Duration',
        type: 'checkbox',
        options: [{ label: '1 hour (short)', value: '1-hour-short' }, { label: '1.5 hours (standard)', value: '1-5-hours-standard' }, { label: '2 hours (with breaks)', value: '2-hours-with-breaks' }, { label: '2.5-3 hours (dinner + trivia)', value: '2-5-3-hours-dinner-trivia' }],
      },
      {
        key: 'price-private-event-1-5-hours',
        label: 'Price (private event, 1.5 hours)',
        type: 'checkbox',
        options: [{ label: '$150-250', value: '150-250' }, { label: '$250-350', value: '250-350' }, { label: '$350-500', value: '350-500' }, { label: '$500+', value: '500' }],
      },
      {
        key: 'price-bar-night-per-night-recurring',
        label: 'Price (bar night, per night recurring)',
        type: 'checkbox',
        options: [{ label: '$150-200 (2 hours)', value: '150-200-2-hours' }, { label: '$200-300 (3 hours)', value: '200-300-3-hours' }, { label: '$300-400 (plus drink tickets)', value: '300-400-plus-drink-tickets' }],
      },
      {
        key: 'virtual-trivia-price',
        label: 'Virtual Trivia Price',
        type: 'checkbox',
        options: [{ label: '$100-150 (small group under 20)', value: '100-150-small-group-under-20' }, { label: '$150-250 (up to 50 players)', value: '150-250-up-to-50-players' }, { label: '$250-350 (50-100)', value: '250-350-50-100' }, { label: '$350-500 (100+)', value: '350-500-100' }],
      },
      {
        key: 'theme-customization',
        label: 'Theme Customization',
        type: 'checkbox',
        options: [{ label: 'Included (client chooses theme)', value: 'included-client-chooses-theme' }, { label: 'Extra fee ($___)', value: 'extra-fee' }, { label: 'No (general trivia only)', value: 'no-general-trivia-only' }],
      },
      {
        key: 'questions-written-for-event',
        label: 'Questions Written for Event',
        type: 'checkbox',
        options: [{ label: 'Yes (custom, 2 weeks lead time)', value: 'yes-custom-2-weeks-lead-time' }, { label: 'Yes (from existing bank)', value: 'yes-from-existing-bank' }, { label: 'No (host uses own)', value: 'no-host-uses-own' }],
      },
      {
        key: 'prize-support',
        label: 'Prize Support',
        type: 'checkbox',
        options: [{ label: 'Host brings prizes (small)', value: 'host-brings-prizes-small' }, { label: 'Client provides prizes (host distributes)', value: 'client-provides-prizes-host-distributes' }, { label: 'No prizes (just bragging rights)', value: 'no-prizes-just-bragging-rights' }],
      },
      {
        key: 'audio-visual-equipment',
        label: 'Audio / Visual Equipment',
        type: 'checkbox',
        options: [{ label: 'Host brings (speaker, mic)', value: 'host-brings-speaker-mic' }, { label: 'Venue provides (PA system)', value: 'venue-provides-pa-system' }, { label: 'Virtual (host uses Zoom features)', value: 'virtual-host-uses-zoom-features' }],
      },
      {
        key: 'sound-system-included',
        label: 'Sound System Included',
        type: 'checkbox',
        options: [{ label: 'Yes (portable speaker)', value: 'yes-portable-speaker' }, { label: 'No (must have house PA)', value: 'no-must-have-house-pa' }],
      },
      {
        key: 'microphone',
        label: 'Microphone',
        type: 'checkbox',
        options: [{ label: 'Wireless mic (included)', value: 'wireless-mic-included' }, { label: 'No mic (host projects)', value: 'no-mic-host-projects' }],
      },
      {
        key: 'scorekeeping',
        label: 'Scorekeeping',
        type: 'checkbox',
        options: [{ label: 'Teams self-score (honor system)', value: 'teams-self-score-honor-system' }, { label: 'Host collects and scores (slower)', value: 'host-collects-and-scores-slower' }, { label: 'App-based scoring', value: 'app-based-scoring' }],
      },
      {
        key: 'materials-provided',
        label: 'Materials Provided',
        type: 'checkbox',
        options: [{ label: 'Answer sheets', value: 'answer-sheets' }, { label: 'Pens', value: 'pens' }, { label: 'Scorecards', value: 'scorecards' }, { label: 'Digital (QR code for phones)', value: 'digital-qr-code-for-phones' }],
      },
      {
        key: 'number-of-questions',
        label: 'Number of Questions',
        type: 'checkbox',
        options: [{ label: '30-40 (1.5 hours)', value: '30-40-1-5-hours' }, { label: '40-50 (2 hours)', value: '40-50-2-hours' }, { label: '50-60 (2.5 hours)', value: '50-60-2-5-hours' }],
      },
      {
        key: 'difficulty-level',
        label: 'Difficulty Level',
        type: 'checkbox',
        options: [{ label: 'Easy (family friendly)', value: 'easy-family-friendly' }, { label: 'Medium (general bar trivia)', value: 'medium-general-bar-trivia' }, { label: 'Hard (enthusiast)', value: 'hard-enthusiast' }, { label: 'Mixed (easy to hard)', value: 'mixed-easy-to-hard' }],
      },
      {
        key: 'pop-culture-focus',
        label: 'Pop Culture Focus',
        type: 'checkbox',
        options: [{ label: 'Yes (last 10 years)', value: 'yes-last-10-years' }, { label: 'No (classic general knowledge)', value: 'no-classic-general-knowledge' }],
      },
      {
        key: 'age-appropriateness',
        label: 'Age Appropriateness',
        type: 'checkbox',
        options: [{ label: 'All ages', value: 'all-ages' }, { label: 'Adult (18+)', value: 'adult-18' }, { label: '21+ (bar setting)', value: '21-bar-setting' }],
      },
      {
        key: 'maximum-players',
        label: 'Maximum Players',
        type: 'checkbox',
        options: [{ label: '20 (intimate)', value: '20-intimate' }, { label: '50 (standard)', value: '50-standard' }, { label: '100 (requires AV support)', value: '100-requires-av-support' }, { label: '200+ (multiple hosts)', value: '200-multiple-hosts' }],
      },
      {
        key: 'travel-fee',
        label: 'Travel Fee',
        type: 'checkbox',
        options: [{ label: 'Within 10 miles (free)', value: 'within-10-miles-free' }, { label: '10-25 miles ($___)', value: '10-25-miles' }, { label: '25+ miles (travel + lodging)', value: '25-miles-travel-lodging' }],
      },
      {
        key: 'deposit',
        label: 'Deposit',
        type: 'checkbox',
        options: [{ label: '$50-100 (refundable)', value: '50-100-refundable' }, { label: 'No deposit', value: 'no-deposit' }],
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        type: 'checkbox',
        options: [{ label: '7 days (full refund)', value: '7-days-full-refund' }, { label: '48 hours (50%)', value: '48-hours-50' }, { label: 'Day of (no refund)', value: 'day-of-no-refund' }],
      },
      {
        key: 'references',
        label: 'References',
        type: 'checkbox',
        options: [{ label: 'Available upon request', value: 'available-upon-request' }, { label: 'Not provided', value: 'not-provided' }],
      },
      {
        key: 'states-a-to-d',
        label: 'States A to D',
        type: 'checkbox',
        options: [{ label: 'Alabama: ~460', value: 'alabama-460' }, { label: 'Alaska: ~150', value: 'alaska-150' }, { label: 'Arizona: ~90', value: 'arizona-90' }, { label: 'Arkansas: ~500', value: 'arkansas-500' }, { label: 'California: ~480', value: 'california-480' }, { label: 'Colorado: ~270', value: 'colorado-270' }, { label: 'Connecticut: ~30 (Uses a town/township system; only 30 are officially "cities")', value: 'connecticut-30-uses-a-town-township-system-only-30-are-officially-cities' }, { label: 'Delaware: ~55', value: 'delaware-55' }],
      },
      {
        key: 'states-f-to-l',
        label: 'States F to L',
        type: 'checkbox',
        options: [{ label: 'Florida: ~410', value: 'florida-410' }, { label: 'Georgia: ~530', value: 'georgia-530' }, { label: 'Hawaii: 0 (Only has counties; Honolulu is a consolidated city-county)', value: 'hawaii-0-only-has-counties-honolulu-is-a-consolidated-city-county' }, { label: 'Idaho: ~200', value: 'idaho-200' }, { label: 'Illinois: ~1,300', value: 'illinois-1-300' }, { label: 'Indiana: ~560', value: 'indiana-560' }, { label: 'Iowa: ~940', value: 'iowa-940' }, { label: 'Kansas: ~620', value: 'kansas-620' }, { label: 'Kentucky: ~420', value: 'kentucky-420' }, { label: 'Louisiana: ~300 [1, 2, 3, 4]', value: 'louisiana-300-1-2-3-4' }],
      },
      {
        key: 'states-m-to-n',
        label: 'States M to N',
        type: 'checkbox',
        options: [{ label: 'Maine: ~20 (Uses a town system; very few official cities)', value: 'maine-20-uses-a-town-system-very-few-official-cities' }, { label: 'Maryland: ~150', value: 'maryland-150' }, { label: 'Massachusetts: ~50 (Mostly organized into towns rather than cities)', value: 'massachusetts-50-mostly-organized-into-towns-rather-than-cities' }, { label: 'Michigan: ~530', value: 'michigan-530' }, { label: 'Minnesota: ~850', value: 'minnesota-850' }, { label: 'Mississippi: ~300', value: 'mississippi-300' }, { label: 'Missouri: ~950', value: 'missouri-950' }, { label: 'Montana: ~130', value: 'montana-130' }, { label: 'Nebraska: ~530', value: 'nebraska-530' }, { label: 'Nevada: ~20', value: 'nevada-20' }, { label: 'New Hampshire: ~13 (Relies almost entirely on the town system)', value: 'new-hampshire-13-relies-almost-entirely-on-the-town-system' }, { label: 'New Jersey: ~560', value: 'new-jersey-560' }, { label: 'New Mexico: ~100', value: 'new-mexico-100' }, { label: 'New York: ~620', value: 'new-york-620' }, { label: 'North Carolina: ~550', value: 'north-carolina-550' }, { label: 'North Dakota: ~350', value: 'north-dakota-350' }],
      },
      {
        key: 'states-o-to-w',
        label: 'States O to W',
        type: 'checkbox',
        options: [{ label: 'Ohio: ~930', value: 'ohio-930' }, { label: 'Oklahoma: ~590', value: 'oklahoma-590' }, { label: 'Oregon: ~240', value: 'oregon-240' }, { label: 'Pennsylvania: ~1,000', value: 'pennsylvania-1-000' }, { label: 'Rhode Island: ~8 (Only 8 cities; the rest of the state is 31 towns)', value: 'rhode-island-8-only-8-cities-the-rest-of-the-state-is-31-towns' }, { label: 'South Carolina: ~270', value: 'south-carolina-270' }, { label: 'South Dakota: ~310', value: 'south-dakota-310' }, { label: 'Tennessee: ~340', value: 'tennessee-340' }, { label: 'Texas: ~1,200', value: 'texas-1-200' }, { label: 'Utah: ~250', value: 'utah-250' }, { label: 'Vermont: ~10 (Relies heavily on towns)', value: 'vermont-10-relies-heavily-on-towns' }, { label: 'Virginia: ~230', value: 'virginia-230' }, { label: 'Washington: ~280', value: 'washington-280' }, { label: 'West Virginia: ~230', value: 'west-virginia-230' }, { label: 'Wisconsin: ~600', value: 'wisconsin-600' }, { label: 'Wyoming: ~100', value: 'wyoming-100' }],
      }
    ],
  },
};

// ── 9. Helper Functions ────────────────────────────────────────────────────

/** Convert any text to a URL-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Look up a service category by slug */
export function getCategoryBySlug(slug: string): TaxonomyCategory | undefined {
  return serviceCategories.find(c => c.slug === slug);
}

/** Look up an event category by slug */
export function getEventCategoryBySlug(slug: string): TaxonomyCategory | undefined {
  return eventCategories.find(c => c.slug === slug);
}

/** Get flat list of all unique subcategories across service categories */
export function getAllSubcategories(): string[] {
  const all = new Set<string>();
  for (const cat of serviceCategories) {
    for (const sub of cat.subcategories) {
      all.add(sub);
    }
  }
  return Array.from(all).sort();
}
