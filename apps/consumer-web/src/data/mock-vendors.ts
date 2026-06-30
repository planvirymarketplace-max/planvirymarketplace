// =============================================================================
// Planviry - Dynamic Mock Vendor Data Generator
// =============================================================================
// Generates realistic vendor data for ANY category/subcategory so that
// vendor cards display on marketplace pages before Overture Maps data is live.
// Deterministic seeding ensures the same category always shows the same vendors.
// =============================================================================

export interface MockVendor {
  vendor_id: string
  business_name: string
  slug: string
  cover_url: string | null
  avg_rating: number | null
  review_count: number | null
  price_range: string | null
  price_starting_at: number | null
  neighborhood: string | null
  is_featured: boolean
  is_verified: boolean
  instant_booking: boolean
  distance_miles: number | null
  bio: string | null
  address: string | null
  category: string | null
}

// ── Deterministic PRNG (mulberry32) ────────────────────────────────────────

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    hash = ((hash << 5) - hash + ch) | 0
  }
  return Math.abs(hash)
}

function createRNG(seed: number) {
  // mulberry32
  let state = seed | 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ── Name Generation Data ──────────────────────────────────────────────────

// Category-keyword → name-building blocks for realistic business names
const CATEGORY_NAME_MAP: Record<string, { prefixes: string[]; nouns: string[]; suffixes: string[] }> = {
  // Venues & Event Spaces
  'venue': { prefixes: ['The Grand', 'Elegant', 'Rustic', 'Heritage', 'Sunset', 'Luxe', 'Premier', 'Sterling', 'Majestic', 'Chateau'], nouns: ['Ballroom', 'Estate', 'Hall', 'Manor', 'Gardens', 'Pavilion', 'Terrace', 'Loft', 'Clubhouse', 'Chapel'], suffixes: ['& Events', 'Venue', 'Event Space', 'Reception Hall', 'Gathering Place'] },
  'wedding venue': { prefixes: ['The Grand', 'EverAfter', 'Bella', 'Enchanted', 'Ivory', 'Celestial', 'Rosewood', 'Crystal', 'Whispering', 'Lavender'], nouns: ['Ballroom', 'Estate', 'Gardens', 'Chapel', 'Manor', 'Vineyard', 'Inn', 'Terrace', 'Pavilion', 'Oaks'], suffixes: ['& Wedding', 'Weddings', 'Wedding Venue', 'Ceremony Space', 'Reception Hall'] },
  'ballroom': { prefixes: ['The Grand', 'Crystal', 'Imperial', 'Royal', 'Opulent', 'Grand', 'Diamond', 'Sterling', 'Golden', 'Crown'], nouns: ['Ballroom', 'Ballroom', 'Grand Hall', 'Grand Ballroom', 'Ballroom & Events', 'Ballroom & Banquet'], suffixes: ['& Events', 'Venue', 'Reception', '', '', ''] },
  'banquet hall': { prefixes: ['Sterling', 'Premier', 'Heritage', 'Ambassador', 'Continental', 'Regal', 'Sovereign', 'Grand', 'Elegant', 'Classic'], nouns: ['Banquet Hall', 'Banquets', 'Catering Hall', 'Grand Hall', 'Conference Center', 'Event Center'], suffixes: ['& Events', '& Catering', 'Venue', '', '', ''] },

  // Event Planning
  'planning': { prefixes: ['Celebrate', 'EverAfter', 'The Event', 'Blueprint', 'Momentous', 'Stellar', 'Bliss', 'Dazzle', 'Premier', 'Curated'], nouns: ['Events', 'Planning', 'Productions', 'Occasions', 'Co.', 'Designs', 'Studios', 'Affairs', 'Group', 'Collective'], suffixes: ['& Co.', '& Events', 'Planning', 'LLC', '', '', ''] },
  'event planning': { prefixes: ['Celebrate', 'EverAfter', 'The Event', 'Blueprint', 'Momentous', 'Stellar', 'Bliss', 'Dazzle', 'Premier', 'Curated'], nouns: ['Events', 'Planning Co.', 'Productions', 'Occasions', 'Studio', 'Designs', 'Affairs', 'Group', 'Collective', 'Coordination'], suffixes: ['& Co.', '& Events', 'Planning', 'LLC', '', '', ''] },
  'party': { prefixes: ['Celebrate', 'Fiesta', 'Confetti', 'PopUp', 'Sparkle', 'Party', 'Festive', 'Jubilee', 'Carnival', 'Bash'], nouns: ['Events', 'Party Co.', 'Planning', 'Productions', 'Occasions', 'Studio', 'Rentals', 'Crew', 'Factory', 'Central'], suffixes: ['& Events', '& Co.', 'Party Planning', '', '', ''] },
  'coordinator': { prefixes: ['Seamless', 'Day-Of', 'Perfect', 'The Coordination', 'Grace', 'Harmony', 'Together', 'Aligned', 'Swift', 'Guiding'], nouns: ['Coordination', 'Coordinators', 'Events', 'Planning', 'Day-Of Co.', 'Details', 'Management', 'Logistics', 'Guided', 'Touch'], suffixes: ['& Co.', '& Events', 'LLC', '', '', ''] },

  // Catering & Food
  'catering': { prefixes: ['Artisan', 'Savory', 'Gourmet', 'Epicurean', 'Flame', 'Harvest', 'Silver', 'Palate', 'Culinary', 'Feast'], nouns: ['Catering', 'Kitchen', 'Catering Co.', 'Bites', 'Provisions', 'Cuisine', 'Table', 'Feast Co.', 'Catering & Events', 'Menus'], suffixes: ['& Events', '& Bar', 'Catering', '', '', ''] },
  'food': { prefixes: ['Artisan', 'Savory', 'Fresh', 'Golden', 'Urban', 'Craft', 'Farmhouse', 'Heritage', 'Seasonal', 'Rustic'], nouns: ['Kitchen', 'Bites', 'Eats', 'Provisions', 'Cuisine', 'Table', 'Cookhouse', 'Food Co.', 'Delights', 'Culinary'], suffixes: ['& Co.', '& Catering', '', '', ''] },
  'bakery': { prefixes: ['Sweet', 'Golden', 'Rise', 'Crumb', 'Buttercream', 'Flour', 'Sugar', 'Whisk', 'Frosted', 'Layered'], nouns: ['Bakery', 'Bakeshop', 'Cakes', 'Pastries', 'Sweets', 'Cake Co.', 'Confections', 'Bakehouse', 'Desserts', 'Treats'], suffixes: ['& Cakes', '& Co.', 'Bakery', '', '', ''] },
  'bbq': { prefixes: ['Smoke', 'Fire', 'Ember', 'Hickory', 'Pit', 'Oak', 'Slow', 'Mesquite', 'Blaze', 'Char'], nouns: ['BBQ', 'Barbecue', 'BBQ Co.', 'Smokehouse', 'Grill', 'Pit BBQ', 'BBQ & Catering', 'Fire BBQ', 'Smoke Pit', 'BBQ Joint'], suffixes: ['& Catering', '& Grill', 'BBQ', '', '', ''] },
  'bar': { prefixes: ['Craft', 'Golden', 'Urban', 'The', 'Velvet', 'Copper', 'Iron', 'Oak', 'Stone', 'Noble'], nouns: ['Bar', 'Taproom', 'Lounge', 'Brewing', 'Speakeasy', 'Pub', 'Bar & Kitchen', 'Social', 'House', 'Saloon'], suffixes: ['& Grill', '& Events', '', '', ''] },
  'dessert': { prefixes: ['Sweet', 'Sugar', 'Decadent', 'Heavenly', 'Divine', 'Blissful', 'Caramel', 'Velvet', 'Frosted', 'Choco'], nouns: ['Desserts', 'Sweets', 'Confections', 'Treats', 'Dessert Bar', 'Patisserie', 'Sweets Co.', 'Dessert Studio', 'Creations', 'Indulgence'], suffixes: ['& Cakes', '& Co.', '', '', ''] },

  // Beauty
  'beauty': { prefixes: ['Glow', 'Radiant', 'Luxe', 'Polished', 'Flawless', 'Dewy', 'Pristine', 'Divine', 'Bella', 'Luminous'], nouns: ['Beauty', 'Beauty Studio', 'Glam', 'Beauty Bar', 'Beauty Co.', 'Aesthetics', 'Glam Studio', 'Beauty Lounge', 'Glam Squad', 'Artistry'], suffixes: ['& Co.', 'Studio', '', '', ''] },
  'makeup': { prefixes: ['Glow', 'Flawless', 'Luxe', 'Polished', 'Bella', 'Canvas', 'Airbrush', 'Bridal', 'Radiant', 'Dewy'], nouns: ['Makeup', 'Makeup Artistry', 'Beauty', 'Glam', 'Makeup Studio', 'Face', 'Cosmetics', 'Makeup Co.', 'Artistry', 'Looks'], suffixes: ['& Beauty', 'Studio', '& Co.', '', '', ''] },
  'hair': { prefixes: ['Luxe', 'Tress', 'Crown', 'Silk', 'The Style', 'Mane', 'Gloss', 'Velvet', 'Shear', 'Rapunzel'], nouns: ['Hair Studio', 'Salon', 'Hair Design', 'Hair Co.', 'Hair Lounge', 'Styling', 'Hair Artistry', 'Hair Bar', 'Stylists', 'Hair Group'], suffixes: ['& Beauty', 'Salon', '& Co.', '', '', ''] },
  'eyebrow': { prefixes: ['Brow', 'Perfect', 'Arch', 'Sculpted', 'Frame', 'Precise', 'Brow &', 'Chiselled', 'Defined', 'The Brow'], nouns: ['Beauty Studio', 'Arch Studio', 'Brow Lounge', 'Brow Bar', 'Studio', 'Lash & Brow', 'Brow Co.', 'Brow Studio', 'Brow Boutique', 'Grooming'], suffixes: ['& Beauty', 'Studio', '& Co.', '', '', ''] },
  'nail': { prefixes: ['Luxe', 'Gloss', 'Polished', 'Nail', 'Tip', 'Mani', 'Shell', 'Lacquer', 'Gel', 'Crystal'], nouns: ['Nails', 'Nail Studio', 'Nail Bar', 'Nail Lounge', 'Nail Spa', 'Nail Boutique', 'Manicure', 'Nail Co.', 'Nail Art', 'Nail Salon'], suffixes: ['& Spa', 'Studio', '& Beauty', '', '', ''] },
  'spa': { prefixes: ['Serenity', 'Oasis', 'Tranquil', 'Zen', 'Harmony', 'Bliss', 'Aura', 'Sanctuary', 'Revive', 'Pure'], nouns: ['Spa', 'Day Spa', 'Spa & Wellness', 'Spa Lounge', 'Wellness Center', 'Retreat', 'Spa Studio', 'Spa & Body', 'Sanctuary', 'Therapy'], suffixes: ['& Wellness', 'Spa', '& Beauty', '', '', ''] },
  'barber': { prefixes: ['Classic', 'Sharp', 'Crown', 'Gentleman\'s', 'Blade', 'The', 'Prime', 'Dapper', 'Craft', 'Vintage'], nouns: ['Barber', 'Barbershop', 'Barber Co.', 'Cuts', 'Grooming', 'Barber Lounge', 'Barber Studio', 'Clipper', 'Barbers', 'Shave & Cut'], suffixes: ['& Co.', 'Barbershop', '', '', ''] },

  // Photography & Video
  'photography': { prefixes: ['Luminous', 'Golden', 'Framed', 'Captured', 'Shutter', 'Aperture', 'Lens', 'Focus', 'Illuminated', 'Pixel'], nouns: ['Photography', 'Photo Studio', 'Photo Co.', 'Studios', 'Creative', 'Portraits', 'Photography & Video', 'Images', 'Visuals', 'Photo Group'], suffixes: ['& Video', 'Photography', 'Studio', '', '', ''] },
  'videography': { prefixes: ['Flash', 'Frame', 'Cinema', 'Motion', 'Reel', 'Cut', 'Director\'s', 'Picture', 'Focus', 'Luminous'], nouns: ['Video', 'Videography', 'Films', 'Video Co.', 'Productions', 'Cinema', 'Video Studio', 'Studios', 'Visuals', 'Media'], suffixes: ['& Photo', 'Productions', 'Video', '', '', ''] },
  'photo booth': { prefixes: ['Booth', 'Snap', 'Flash', 'Pixel', 'Smile', 'Say', 'Click', 'Frame', 'SnapShot', 'Pic'], nouns: ['Photo Booth', 'Booth Co.', 'Booths', 'Booth Rentals', 'Booth & Co.', 'Booth Studio', 'Booth Experience', 'Booths & More', 'Photo Experience', 'Snap Bar'], suffixes: ['& Rentals', 'Photo Booth', '', '', ''] },

  // Entertainment
  'dj': { prefixes: ['Elevated', 'Beat', 'Mix', 'Sound', 'Groove', 'Vibe', 'Premier', 'Elite', 'Electric', 'Rhythm'], nouns: ['Beats', 'Entertainment', 'DJ & MC', 'Sound Co.', 'Music', 'DJ Service', 'Mix Masters', 'Entertainment Co.', 'DJ Group', 'Sounds'], suffixes: ['& Entertainment', 'DJ Service', '& MC', '', '', ''] },
  'band': { prefixes: ['The Soul', 'Velvet', 'Electric', 'Groove', 'Brass', 'Midnight', 'Sterling', 'Silver', 'Neon', 'Rhythm'], nouns: ['Collective', 'Band', 'Ensemble', 'Orchestra', 'Players', 'Sound', 'Music Co.', 'Groove', 'Music', 'Band & Co.'], suffixes: ['Band', 'Live Music', '& Entertainment', '', '', ''] },
  'magician': { prefixes: ['Magic', 'Mystery', 'Enigma', 'Illusion', 'Wonder', 'Presto', 'Mystic', 'Arcane', 'Spellbound', 'Marvel'], nouns: ['Shows', 'Magic Co.', 'Illusions', 'Entertainment', 'Magic Studio', 'Performances', 'Magic & Mystery', 'Tricks', 'Magic Experience', 'Wonder'], suffixes: ['& Entertainment', 'Magic', 'Shows', '', '', ''] },

  // Florals & Decor
  'floral': { prefixes: ['Petal', 'Bloom', 'Blossom', 'Garden', 'Wildflower', 'Rose', 'Lily', 'Ivy', 'Peony', 'Dahlia'], nouns: ['& Bloom', 'Florals', 'Flowers', 'Floral Design', 'Floral Co.', 'Florist', 'Floral Studio', 'Blooms', 'Floral Artistry', 'Botanicals'], suffixes: ['& Events', 'Florals', '& Design', '', '', ''] },
  'florist': { prefixes: ['Petal', 'Bloom', 'Blossom', 'Garden', 'Wildflower', 'Rose', 'Lily', 'Ivy', 'Peony', 'Dahlia'], nouns: ['Florist', 'Flowers', 'Floral', 'Floral Studio', 'Flower Co.', 'Florist Shop', 'Blooms', 'Flower Shop', 'Floral Design', 'Botanicals'], suffixes: ['& Events', 'Florist', '& Gifts', '', '', ''] },
  'decor': { prefixes: ['Velvet', 'Luxe', 'Ambiance', 'Curated', 'Gilded', 'Opulent', 'Dream', 'Design', 'Aesthetic', 'Mood'], nouns: ['Decor', 'Design Co.', 'Styling', 'Rentals', 'Decor & Design', 'Decor Studio', 'Event Styling', 'Decor & Rentals', 'Aesthetics', 'Event Design'], suffixes: ['& Rentals', '& Design', 'Decor', '', '', ''] },
  'balloon': { prefixes: ['Party', 'Pop', 'Float', 'Balloon', 'Air', 'Bounce', 'Up', 'Whimsy', 'Color', 'Cloud'], nouns: ['Balloons', 'Balloon Co.', 'Balloon Bar', 'Balloon Art', 'Balloon Studio', 'Balloon Decor', 'Balloons & More', 'Balloon Creations', 'Pop Balloons', 'Balloon Designs'], suffixes: ['& Decor', 'Balloons', '& Events', '', '', ''] },
  'tent': { prefixes: ['Velvet', 'Canvas', 'Grand', 'Summit', 'Premier', 'All-Season', 'Heritage', 'Elegant', 'Classic', 'Shelter'], nouns: ['Tent & Draping', 'Tent Rentals', 'Tent & Events', 'Tents', 'Tent Co.', 'Event Tents', 'Canopy', 'Tent & Canopy', 'Tent & Party', 'Tent Solutions'], suffixes: ['& Rentals', '& Decor', 'Rentals', '', '', ''] },

  // Attire & Fashion
  'dress': { prefixes: ['Bella', 'Ivory', 'Enchanted', 'Bridal', 'Lace', 'Silk', 'Satin', 'Vow', 'Bespoke', 'Couture'], nouns: ['Bridal', 'Boutique', 'Gowns', 'Bridal Studio', 'Wedding Attire', 'Dress Shop', 'Bridal Couture', 'Wedding Dresses', 'Bridal Collection', 'Atelier'], suffixes: ['& Formal', 'Boutique', '& Bridal', '', '', ''] },
  'attire': { prefixes: ['Bella', 'Ivory', 'Enchanted', 'Bespoke', 'Couture', 'Tailored', 'Vow', 'Suited', 'Dapper', 'Silk'], nouns: ['Boutique', 'Formal Wear', 'Attire Co.', 'Style Studio', 'Tailoring', 'Fashion', 'Wedding Attire', 'Suit & Gown', 'Attire & Accessories', 'Wardrobe'], suffixes: ['& Bridal', 'Boutique', '& Formal', '', '', ''] },
  'jewelry': { prefixes: ['Gem', 'Diamond', 'Brilliant', 'Carat', 'Luxe', 'Crystal', 'Aurum', 'Platinum', 'Radiant', 'Golden'], nouns: ['Jewelers', 'Jewelry', 'Jewelry Co.', 'Fine Jewelry', 'Jewels', 'Gem Studio', 'Diamond Co.', 'Jewelry Boutique', 'Jewelry Design', 'Custom Jewelry'], suffixes: ['& Gems', 'Jewelers', '& Design', '', '', ''] },

  // Transportation & Travel
  'transportation': { prefixes: ['Luxe', 'Grand', 'Premier', 'Elite', 'Classic', 'Royal', 'Prestige', 'A1', 'Crown', 'Star'], nouns: ['Shuttle', 'Transportation', 'Limo', 'Car Service', 'Transport Co.', 'Travel', 'Transit', 'Chauffeur', 'Fleet', 'Ride Co.'], suffixes: ['& Limo', '& Travel', 'Transport', '', '', ''] },
  'hotel': { prefixes: ['Grand', 'Luxe', 'Sterling', 'Royal', 'Heritage', 'Premier', 'Ambassador', 'Harbor', 'Lakeside', 'Metro'], nouns: ['Hotel', 'Hotel & Suites', 'Inn', 'Lodge', 'Resort', 'Grand Hotel', 'Boutique Hotel', 'Hotel & Spa', 'Suites', 'Inn & Suites'], suffixes: ['& Suites', 'Hotel', '& Conference', '', '', ''] },
  'travel': { prefixes: ['Wanderlust', 'Globe', 'Voyage', 'Journey', 'Escape', 'Horizon', 'Adventure', 'Discover', 'Destinations', 'Pacific'], nouns: ['Travel', 'Travel Co.', 'Adventures', 'Getaways', 'Travel Group', 'Honeymoons', 'Journeys', 'Travel Studio', 'Voyages', 'Escapes'], suffixes: ['& Honeymoons', 'Travel', '& Tours', '', '', ''] },

  // Live Events & Entertainment
  'entertainment': { prefixes: ['Elevated', 'Premier', 'Stellar', 'Spotlight', 'Center Stage', 'Encore', 'Bravo', 'Ovation', 'Applause', 'Showtime'], nouns: ['Entertainment', 'Productions', 'Shows', 'Entertainment Co.', 'Events', 'Live', 'Performance', 'Talent', 'Creative', 'Studios'], suffixes: ['& Events', 'Entertainment', 'Productions', '', '', ''] },
  'comedy': { prefixes: ['Laugh', 'Ha', 'Giggle', 'Stand-Up', 'Joke', 'Funny', 'Punchline', 'Chuckle', 'Snort', 'Wit'], nouns: ['Comedy', 'Comedy Club', 'Comedy Co.', 'Laughs', 'Stand-Up', 'Comedy Show', 'Humor', 'Comedy Night', 'Improv', 'Comedy Lounge'], suffixes: ['& Shows', 'Comedy', 'Club', '', '', ''] },
  'concert': { prefixes: ['Live', 'Sound', 'Echo', 'Amplified', 'Harmony', 'Resonance', 'Tempo', 'Beat', 'Melody', 'Rhythm'], nouns: ['Music', 'Concerts', 'Live Music', 'Sound Co.', 'Music Venue', 'Concert Hall', 'Music Hall', 'Performing Arts', 'Music Experience', 'Events'], suffixes: ['& Events', 'Music', 'Venue', '', '', ''] },

  // Fitness & Wellness
  'fitness': { prefixes: ['Iron', 'Peak', 'Flex', 'Power', 'Core', 'Endurance', 'Vitality', 'Beast', 'Titan', 'Apex'], nouns: ['Fitness', 'Gym', 'Training', 'Fit Co.', 'Workout', 'Fitness Studio', 'Strength', 'Performance', 'Athletics', 'Fit Lab'], suffixes: ['& Wellness', 'Fitness', 'Studio', '', '', ''] },
  'yoga': { prefixes: ['Namaste', 'Zen', 'Lotus', 'Breathe', 'Serenity', 'Balance', 'Inner', 'Sacred', 'Flow', 'Still'], nouns: ['Yoga', 'Yoga Studio', 'Yoga & Wellness', 'Yoga Co.', 'Practice', 'Yoga Lounge', 'Yoga Space', 'Yoga Collective', 'Mindfulness', 'Flow Studio'], suffixes: ['& Wellness', 'Yoga', 'Studio', '', '', ''] },
  'wellness': { prefixes: ['Holistic', 'Revive', 'Pure', 'Balance', 'Vitality', 'Nourish', 'Renew', 'Thrive', 'Align', 'Harmony'], nouns: ['Wellness', 'Wellness Center', 'Wellness Studio', 'Health', 'Wellness Co.', 'Wellness Collective', 'Holistic', 'Wellness Hub', 'Care', 'Wellness Lab'], suffixes: ['& Spa', 'Wellness', 'Center', '', '', ''] },

  // Home Services
  'cleaning': { prefixes: ['Sparkle', 'Pristine', 'Fresh', 'Crystal', 'Spotless', 'Shine', 'Bright', 'Pure', 'Clean', 'Immaculate'], nouns: ['Cleaning', 'Cleaning Co.', 'Cleaners', 'Janitorial', 'Cleaning Service', 'Cleaning Pros', 'Maid Service', 'Cleaning Group', 'Clean Team', 'Solutions'], suffixes: ['& More', 'Cleaning', 'Service', '', '', ''] },
  'plumbing': { prefixes: ['Flow', 'Drain', 'Pipe', 'Aqua', 'Water', 'Leak', 'Stream', 'Valve', 'Tap', 'Faucet'], nouns: ['Plumbing', 'Plumbing Co.', 'Plumbing & Heating', 'Plumbers', 'Plumbing Service', 'Drain Co.', 'Pipe Solutions', 'Plumbing Pros', 'Rooter', 'Plumbing Group'], suffixes: ['& Heating', 'Plumbing', 'Service', '', '', ''] },
  'electrician': { prefixes: ['Bright', 'Volt', 'Spark', 'Current', 'Wire', 'Power', 'Circuit', 'Amp', 'Shock', 'Lumen'], nouns: ['Electric', 'Electrical', 'Electric Co.', 'Electrical Service', 'Wiring', 'Electric Pros', 'Power Solutions', 'Circuit Co.', 'Electric Group', 'Lighting'], suffixes: ['& Lighting', 'Electric', 'Service', '', '', ''] },

  // Automotive
  'auto': { prefixes: ['Turbo', 'Motor', 'Drive', 'Speed', 'Gear', 'Rev', 'Dash', 'Piston', 'Axle', 'Cruiser'], nouns: ['Auto', 'Auto Shop', 'Motors', 'Auto Co.', 'Car Care', 'Auto Service', 'Automotive', 'Auto Pros', 'Auto Group', 'Garage'], suffixes: ['& Repair', 'Auto', 'Service', '', '', ''] },
  'car wash': { prefixes: ['Splash', 'Shine', 'Bubble', 'Aqua', 'Crystal', 'Sparkle', 'Supreme', 'Express', 'Diamond', 'Pristine'], nouns: ['Car Wash', 'Auto Spa', 'Wash', 'Car Wash & Detail', 'Wash Co.', 'Detail Shop', 'Car Wash Express', 'Auto Wash', 'Wash Center', 'Wash Studio'], suffixes: ['& Detail', 'Car Wash', 'Express', '', '', ''] },
  'mechanic': { prefixes: ['Fix', 'Wrench', 'Pro', 'Master', 'Certified', 'Reliable', 'Quick', 'Trusted', 'Ace', 'Precision'], nouns: ['Auto Repair', 'Mechanic', 'Garage', 'Auto Service', 'Repair Shop', 'Motors', 'Auto Care', 'Service Center', 'Repair Co.', 'Tech'], suffixes: ['& Repair', 'Auto', 'Service', '', '', ''] },

  // Pets
  'pet': { prefixes: ['Happy', 'Paws', 'Furry', 'Wagging', 'Buddy', 'Furever', 'Pet', 'Loving', 'Best', 'Companion'], nouns: ['Pet Care', 'Paws', 'Pet Services', 'Pet Co.', 'Pets', 'Pet Sitting', 'Pet Spa', 'Critter Care', 'Pet World', 'Animal Care'], suffixes: ['& Grooming', 'Pet Care', '& More', '', '', ''] },
  'dog': { prefixes: ['Happy', 'Wag', 'Bark', 'Paws', 'Fetch', 'Good', 'Top', 'Alpha', 'Loyal', 'Buddy'], nouns: ['Dog Training', 'Dogs', 'K9', 'Dog Co.', 'Pup Pros', 'Dog Services', 'Doggy Daycare', 'Dog Studio', 'Canine', 'Dog Lounge'], suffixes: ['& Walking', 'Dog Care', '& Training', '', '', ''] },
  'grooming': { prefixes: ['Fluffy', 'Pampered', 'Posh', 'Royal', 'Dapper', 'Fancy', 'Prime', 'Premier', 'Bubbly', 'Sudsy'], nouns: ['Grooming', 'Pet Spa', 'Grooming Salon', 'Grooming Studio', 'Pet Styling', 'Grooming Co.', 'Pet Salon', 'Grooming Lounge', 'Coat Care', 'Spa & Groom'], suffixes: ['& Spa', 'Grooming', 'Salon', '', '', ''] },

  // Education & Classes
  'class': { prefixes: ['Master', 'Skill', 'Learn', 'Academy', 'Institute', 'Excel', 'Discover', 'Creative', 'Artisan', 'Craft'], nouns: ['Academy', 'Studio', 'Classes', 'Workshops', 'Learning Center', 'School', 'Institute', 'Education', 'Coaching', 'Training'], suffixes: ['& Workshops', 'Academy', 'School', '', '', ''] },
  'dance': { prefixes: ['Rhythm', 'Grace', 'Step', 'Movement', 'Twirl', 'Flow', 'Harmony', 'Motion', 'Tempo', 'Elevate'], nouns: ['Dance Studio', 'Dance Academy', 'Dance', 'Dance Co.', 'Dance Center', 'Ballroom', 'Dance School', 'Choreography', 'Dance Works', 'Performing Arts'], suffixes: ['& Performing Arts', 'Dance', 'Studio', '', '', ''] },
  'music': { prefixes: ['Harmony', 'Melody', 'Note', 'Rhythm', 'Sound', 'Tempo', 'Clef', 'Scale', 'Chord', 'Keys'], nouns: ['Music Studio', 'Music Academy', 'Music School', 'Music Co.', 'Lessons', 'Music Center', 'Conservatory', 'Music Works', 'Music Lab', 'Academy of Music'], suffixes: ['& Lessons', 'Music', 'Academy', '', '', ''] },

  // Health & Medical
  'medical': { prefixes: ['Premier', 'Advanced', 'Family', 'Community', 'Trusted', 'Comprehensive', 'Heritage', 'Unity', 'First', 'Caring'], nouns: ['Medical', 'Health Center', 'Clinic', 'Medical Group', 'Healthcare', 'Health', 'Medical Center', 'Care', 'Practice', 'Health Co.'], suffixes: ['& Wellness', 'Medical', 'Clinic', '', '', ''] },
  'dental': { prefixes: ['Bright', 'Smile', 'Perfect', 'Pearl', 'Confident', 'Sparkle', 'Premier', 'Gentle', 'Family', 'Advanced'], nouns: ['Dental', 'Dentistry', 'Dental Care', 'Dental Group', 'Dental Studio', 'Smile Co.', 'Dental Center', 'Oral Care', 'Dental Practice', 'Orthodontics'], suffixes: ['& Orthodontics', 'Dental', 'Care', '', '', ''] },
  'chiropractic': { prefixes: ['Align', 'Balanced', 'Core', 'Spine', 'Vital', 'Adjust', 'Natural', 'Harmony', 'Relief', 'Active'], nouns: ['Chiropractic', 'Chiropractic Center', 'Wellness', 'Spine Care', 'Chiropractic Co.', 'Health & Wellness', 'Chiropractic Studio', 'Alignment', 'Care Center', 'Holistic'], suffixes: ['& Wellness', 'Chiropractic', 'Center', '', '', ''] },
  'massage': { prefixes: ['Zen', 'Serenity', 'Healing', 'Touch', 'Calm', 'Restore', 'Soothe', 'Tranquil', 'Revive', 'Balance'], nouns: ['Massage', 'Massage Studio', 'Bodywork', 'Massage & Wellness', 'Therapeutic', 'Massage Co.', 'Spa & Massage', 'Healing Arts', 'Massage Therapy', 'Wellness'], suffixes: ['& Spa', 'Massage', 'Therapy', '', '', ''] },
  'therapy': { prefixes: ['Mindful', 'Clear', 'Bright', 'Hope', 'Renew', 'Centered', 'Insight', 'Compass', 'Bridge', 'Harmony'], nouns: ['Therapy', 'Therapy Group', 'Counseling', 'Wellness Center', 'Therapy Co.', 'Mental Health', 'Therapy & Counseling', 'Counseling Center', 'Practice', 'Therapy Studio'], suffixes: ['& Counseling', 'Therapy', 'Center', '', '', ''] },
  'counseling': { prefixes: ['Mindful', 'Clear', 'Bright', 'Hope', 'Renew', 'Centered', 'Insight', 'Compass', 'Bridge', 'Harmony'], nouns: ['Counseling', 'Counseling Center', 'Therapy', 'Wellness', 'Counseling Co.', 'Guidance', 'Support', 'Counseling Practice', 'Services', 'Associates'], suffixes: ['& Therapy', 'Counseling', 'Center', '', '', ''] },

  // Real Estate
  'real estate': { prefixes: ['Premier', 'Summit', 'Keystone', 'Heritage', 'Sterling', 'Landmark', 'Horizon', 'Apex', 'Pinnacle', 'Cornerstone'], nouns: ['Realty', 'Real Estate', 'Properties', 'Realty Group', 'Real Estate Co.', 'Property Group', 'Realty Partners', 'Real Estate Group', 'Estates', 'Realty Services'], suffixes: ['& Co.', 'Realty', 'Properties', '', '', ''] },

  // Legal & Financial
  'legal': { prefixes: ['Justice', 'Summit', 'Advocacy', 'Liberty', 'Covenant', 'Integrity', 'Meridian', 'Pinnacle', 'Apex', 'Keystone'], nouns: ['Law', 'Law Group', 'Legal', 'Law Office', 'Attorneys', 'Legal Services', 'Law Firm', 'Legal Co.', 'Counsel', 'Associates'], suffixes: ['& Associates', 'Law', 'Legal', '', '', ''] },
  'accounting': { prefixes: ['Precision', 'Summit', 'Ledger', 'Apex', 'Clear', 'Summit', 'Accurate', 'Vanguard', 'Premier', 'Strategic'], nouns: ['Accounting', 'Accounting Co.', 'CPA', 'Financial', 'Tax & Accounting', 'Bookkeeping', 'Accounting Group', 'Financial Services', 'Advisory', 'Tax Service'], suffixes: ['& Tax', 'Accounting', 'Services', '', '', ''] },
  'insurance': { prefixes: ['Secure', 'Guardian', 'Shield', 'Safe', 'Premier', 'Reliance', 'Trust', 'Heritage', 'Pinnacle', 'Assure'], nouns: ['Insurance', 'Insurance Group', 'Insurance Co.', 'Coverage', 'Insurance Services', 'Protection', 'Risk Management', 'Insurance Agency', 'Assurance', 'Financial'], suffixes: ['& Financial', 'Insurance', 'Agency', '', '', ''] },

  // IT & Tech
  'it': { prefixes: ['Tech', 'Digital', 'Cyber', 'Smart', 'Cloud', 'Data', 'Net', 'Code', 'Logic', 'Binary'], nouns: ['Solutions', 'IT Services', 'Tech Co.', 'Systems', 'IT Group', 'Technology', 'Digital Services', 'IT Pros', 'Computing', 'Support'], suffixes: ['& Consulting', 'IT', 'Solutions', '', '', ''] },
  'web': { prefixes: ['Pixel', 'Code', 'Digital', 'Creative', 'Spark', 'Build', 'Frame', 'Craft', 'Launch', 'Design'], nouns: ['Web Design', 'Digital Agency', 'Web Studio', 'Web Co.', 'Creative', 'Web Development', 'Design Studio', 'Agency', 'Web Group', 'Interactive'], suffixes: ['& Marketing', 'Studio', 'Agency', '', '', ''] },

  // Marketing
  'marketing': { prefixes: ['Spark', 'Amplify', 'Elevate', 'Launch', 'Catalyst', 'Momentum', 'Ignite', 'Prism', 'Beacon', 'Signal'], nouns: ['Marketing', 'Marketing Co.', 'Creative', 'Agency', 'Marketing Group', 'Digital Marketing', 'Media', 'Communications', 'Brand Co.', 'Strategy'], suffixes: ['& Brand', 'Marketing', 'Agency', '', '', ''] },

  // Printing & Signage
  'printing': { prefixes: ['Press', 'Ink', 'Print', 'Type', 'Letter', 'Presswork', 'Signal', 'Vivid', 'Bold', 'Clear'], nouns: ['Printing', 'Print Co.', 'Print Shop', 'Press', 'Printing & Signs', 'Print Studio', 'Graphics', 'Print Solutions', 'Printing Services', 'Press Co.'], suffixes: ['& Signs', 'Printing', 'Services', '', '', ''] },

  // Officiant
  'officiant': { prefixes: ['Joyful', 'Heartfelt', 'Sacred', 'United', 'Blessed', 'Harmony', 'Vow', 'Eternal', 'Cherished', 'Beloved'], nouns: ['Officiant', 'Ceremonies', 'Ministry', 'Officiant Services', 'Wedding Officiant', 'Vows', 'Ceremony Co.', 'Celebrations', 'Minister', 'Chaplain'], suffixes: ['& Ceremonies', 'Officiant', 'Services', '', '', ''] },

  // Invitations
  'invitation': { prefixes: ['Paper', ' scripted', 'Velvet', 'Artisan', 'Letterpress', 'Ink', 'Elegant', 'Bespoke', 'Cherished', 'Classic'], nouns: ['Invitations', 'Paper Co.', 'Stationery', 'Print Studio', 'Paper Studio', 'Invitation Co.', 'Design Studio', 'Press', 'Invitation Suite', 'Paper & Ink'], suffixes: ['& Stationery', 'Invitations', '& Print', '', '', ''] },

  // Favors & Gifts
  'gift': { prefixes: ['Thoughtful', 'Keepsake', 'Treasured', 'Bespoke', 'Cherish', 'Artisan', 'Velvet', 'Gilded', 'Whimsy', 'Wrapped'], nouns: ['Gifts', 'Gift Co.', 'Favors', 'Gift Studio', 'Gifts & Favors', 'Keepsakes', 'Boutique', 'Gift Shop', 'Creations', 'Gifts & More'], suffixes: ['& Favors', 'Gifts', 'Boutique', '', '', ''] },
  'favor': { prefixes: ['Thoughtful', 'Keepsake', 'Treasured', 'Bespoke', 'Cherish', 'Artisan', 'Sweet', 'Gilded', 'Whimsy', 'Wrapped'], nouns: ['Favors', 'Favor Co.', 'Favors & Gifts', 'Keepsakes', 'Creations', 'Favor Studio', 'Boutique', 'Party Favors', 'Favors & More', 'Co.'], suffixes: ['& Gifts', 'Favors', 'Boutique', '', '', ''] },
}

// Fallback for categories not in the map
const GENERIC_NAME_PARTS = { prefixes: ['Premier', 'Elite', 'Classic', 'Sterling', 'Pro', 'Advanced', 'Quality', 'Royal', 'Summit', 'Apex', 'Prime', 'Heritage', 'Pinnacle', 'Vanguard', 'Cornerstone', 'Unity', 'Keystone', 'Metro', 'Capital', 'Innovative'], nouns: ['Services', 'Studio', 'Co.', 'Group', 'Solutions', 'Associates', 'Professionals', 'Experts', 'Works', 'Collective', 'Pros', 'Hub', 'Center', 'Specialists', 'Craft', 'Partners', 'Team', 'Craftsmen', 'Masters', 'Crew'], suffixes: ['& Co.', '& Associates', '& More', 'LLC', '', '', '', ''] }

// ── Neighborhoods & Cities ────────────────────────────────────────────────

const NEIGHBORHOODS = [
  'Downtown', 'East Town', 'Historic Third Ward', 'Brady Street', 'Bay View',
  "Walker's Point", 'Riverwest', 'Wauwatosa', 'Shorewood', 'Brookfield',
  'Whitefish Bay', 'Waukesha', 'Mequon', 'Cedarburg', 'Grafton',
  'West Allis', 'Greenfield', 'Franklin', 'Oak Creek', 'South Milwaukee',
  'Lower East Side', 'Humboldt Park', 'Washington Heights', 'Story Hill',
  'Brewers\' Hill', 'Juneau Town', 'Yankee Hill', 'North Point', 'UWM Area',
  'Prospect Avenue', 'Grand Avenue', 'Bronzeville', 'Avenues West',
]

// ── Price data by category type ────────────────────────────────────────────

const PRICE_TIERS = ['$', '$$', '$$$', '$$$$'] as const

const CATEGORY_PRICES: Record<string, { range: number; startingAt: number }> = {
  'venue': { range: 3, startingAt: 1500 },
  'wedding venue': { range: 4, startingAt: 2000 },
  'ballroom': { range: 4, startingAt: 2500 },
  'catering': { range: 2, startingAt: 25 },
  'food': { range: 2, startingAt: 15 },
  'bakery': { range: 2, startingAt: 50 },
  'bbq': { range: 2, startingAt: 20 },
  'photography': { range: 3, startingAt: 800 },
  'videography': { range: 3, startingAt: 1200 },
  'photo booth': { range: 2, startingAt: 300 },
  'dj': { range: 2, startingAt: 500 },
  'band': { range: 3, startingAt: 1500 },
  'floral': { range: 2, startingAt: 200 },
  'florist': { range: 2, startingAt: 200 },
  'decor': { range: 2, startingAt: 150 },
  'beauty': { range: 2, startingAt: 80 },
  'makeup': { range: 2, startingAt: 100 },
  'hair': { range: 2, startingAt: 75 },
  'nail': { range: 1, startingAt: 30 },
  'spa': { range: 3, startingAt: 80 },
  'barber': { range: 1, startingAt: 25 },
  'dress': { range: 3, startingAt: 500 },
  'attire': { range: 2, startingAt: 150 },
  'jewelry': { range: 3, startingAt: 200 },
  'transportation': { range: 2, startingAt: 200 },
  'hotel': { range: 3, startingAt: 120 },
  'planning': { range: 3, startingAt: 500 },
  'event planning': { range: 3, startingAt: 500 },
  'party': { range: 2, startingAt: 200 },
  'entertainment': { range: 2, startingAt: 200 },
  'cleaning': { range: 1, startingAt: 80 },
  'plumbing': { range: 2, startingAt: 100 },
  'electrician': { range: 2, startingAt: 100 },
  'auto': { range: 2, startingAt: 50 },
  'fitness': { range: 2, startingAt: 30 },
  'yoga': { range: 1, startingAt: 15 },
  'massage': { range: 2, startingAt: 60 },
  'medical': { range: 2, startingAt: 75 },
  'dental': { range: 2, startingAt: 80 },
  'real estate': { range: 3, startingAt: 500 },
  'legal': { range: 3, startingAt: 150 },
  'officiant': { range: 1, startingAt: 150 },
  'invitation': { range: 2, startingAt: 100 },
  'gift': { range: 1, startingAt: 15 },
  'favor': { range: 1, startingAt: 5 },
  'tent': { range: 2, startingAt: 300 },
  'balloon': { range: 1, startingAt: 50 },
  'comedy': { range: 1, startingAt: 15 },
  'concert': { range: 2, startingAt: 25 },
  'pet': { range: 1, startingAt: 25 },
  'dog': { range: 1, startingAt: 20 },
  'grooming': { range: 1, startingAt: 30 },
  'class': { range: 1, startingAt: 25 },
  'dance': { range: 1, startingAt: 15 },
  'music': { range: 1, startingAt: 25 },
}

const DEFAULT_PRICE = { range: 2, startingAt: 100 }

// ── Bio templates ──────────────────────────────────────────────────────────

const BIO_TEMPLATES = [
  'Premier {category} provider serving the greater metro area. Known for exceptional quality and attention to detail.',
  'Trusted {category} professionals with years of experience making every event special. Five-star service guaranteed.',
  'Specializing in {category} with a passion for excellence. Our dedicated team ensures every detail is perfect.',
  'Award-winning {category} serving the community since 2010. We bring creativity and professionalism to every project.',
  'Your go-to {category} experts. We combine modern techniques with personalized service to exceed your expectations.',
  'Top-rated {category} known for reliability and quality. Let us help make your vision a reality.',
  'Experienced {category} team committed to delivering outstanding results. Fully licensed and insured for your peace of mind.',
  'Creative {category} solutions tailored to your needs. Our clients love our flexibility and can-do attitude.',
  'Full-service {category} with a reputation for going above and beyond. Read our reviews and see the difference.',
  'Locally owned {category} business proud to serve our community. Competitive pricing with no compromise on quality.',
  'Boutique {category} studio offering personalized experiences. Every client receives our undivided attention and care.',
  'Professional {category} with a modern approach. We use the latest techniques and equipment to deliver superior results.',
]

// ── Cover image URLs (category-themed placeholders) ────────────────────────

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511795409834-432f7b1728d2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1522771731478-44fb10e99340?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1555243896-c709bfa0b564?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
]

// ── Helper: find best matching name parts ──────────────────────────────────

function findNameParts(category: string, subcategory?: string): { prefixes: string[]; nouns: string[]; suffixes: string[] } {
  // Try subcategory first (more specific)
  if (subcategory) {
    const subLower = subcategory.toLowerCase()
    for (const key of Object.keys(CATEGORY_NAME_MAP)) {
      if (subLower.includes(key) || key.includes(subLower)) {
        return CATEGORY_NAME_MAP[key]
      }
    }
  }

  // Try category
  const catLower = category.toLowerCase()
  for (const key of Object.keys(CATEGORY_NAME_MAP)) {
    if (catLower.includes(key) || key.includes(catLower)) {
      return CATEGORY_NAME_MAP[key]
    }
  }

  // Extract keywords from the category name and try partial matches
  const words = catLower.split(/[\s&\/\-]+/).filter(w => w.length > 2)
  for (const word of words) {
    for (const key of Object.keys(CATEGORY_NAME_MAP)) {
      if (key.includes(word) || word.includes(key)) {
        return CATEGORY_NAME_MAP[key]
      }
    }
  }

  return GENERIC_NAME_PARTS
}

// ── Main Generator ────────────────────────────────────────────────────────

/**
 * Generate realistic mock vendors for any category/subcategory.
 * Uses deterministic seeding so the same inputs always produce the same vendors.
 *
 * @param category    - The category name (e.g. "Party & Event Planning", "Eyebrow Service")
 * @param subcategory - Optional subcategory for more specific name generation
 * @param count       - Number of vendors to generate (default: 24)
 */
export function getMockVendors(
  category: string,
  subcategory?: string,
  count: number = 24,
): MockVendor[] {
  const seedKey = `${category}::${subcategory ?? ''}`
  const rng = createRNG(hashString(seedKey))

  const nameParts = findNameParts(category, subcategory)
  const priceData = (() => {
    const subLower = subcategory?.toLowerCase() ?? ''
    const catLower = category.toLowerCase()
    // Try subcategory first
    if (subcategory) {
      for (const [key, val] of Object.entries(CATEGORY_PRICES)) {
        if (subLower.includes(key) || key.includes(subLower)) return val
      }
    }
    for (const [key, val] of Object.entries(CATEGORY_PRICES)) {
      if (catLower.includes(key) || key.includes(catLower)) return val
    }
    return DEFAULT_PRICE
  })()

  const displayName = subcategory || category
  const vendors: MockVendor[] = []

  // Track used names to avoid duplicates
  const usedNames = new Set<string>()

  for (let i = 0; i < count; i++) {
    // Generate a unique business name
    let businessName = ''
    let attempts = 0
    do {
      const prefix = nameParts.prefixes[Math.floor(rng() * nameParts.prefixes.length)]
      const noun = nameParts.nouns[Math.floor(rng() * nameParts.nouns.length)]
      const suffix = nameParts.suffixes[Math.floor(rng() * nameParts.suffixes.length)]
      businessName = suffix ? `${prefix} ${noun} ${suffix}`.trim() : `${prefix} ${noun}`.trim()
      // Remove double spaces
      businessName = businessName.replace(/\s+/g, ' ')
      attempts++
      if (attempts > 50) {
        // Fallback: add a number to make unique
        businessName = `${prefix} ${noun} ${i + 1}`
        break
      }
    } while (usedNames.has(businessName))
    usedNames.add(businessName)

    // Slug from business name
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Rating: weighted toward 4.0–4.8
    const ratingRaw = rng()
    let avgRating: number
    if (ratingRaw < 0.05) {
      avgRating = 3.5 + rng() * 0.4 // 3.5–3.9 (5%)
    } else if (ratingRaw < 0.85) {
      avgRating = 4.0 + rng() * 0.8 // 4.0–4.8 (80%)
    } else {
      avgRating = 4.8 + rng() * 0.2 // 4.8–5.0 (15%)
    }
    avgRating = Math.round(avgRating * 10) / 10

    // Review count: 5–500, weighted toward lower numbers
    const reviewBase = rng()
    let reviewCount: number
    if (reviewBase < 0.3) {
      reviewCount = 5 + Math.floor(rng() * 45)   // 5–50 (30%)
    } else if (reviewBase < 0.7) {
      reviewCount = 50 + Math.floor(rng() * 100)  // 50–150 (40%)
    } else if (reviewBase < 0.9) {
      reviewCount = 150 + Math.floor(rng() * 200) // 150–350 (20%)
    } else {
      reviewCount = 350 + Math.floor(rng() * 150) // 350–500 (10%)
    }

    // Price tier
    const tierIdx = Math.min(priceData.range, Math.floor(rng() * (priceData.range + 1)))
    const priceRange = PRICE_TIERS[tierIdx]

    // Price starting at - varies around the base price
    const priceMultiplier = 0.5 + rng() * 2.0
    const priceStartingAt = Math.round(priceData.startingAt * priceMultiplier / 10) * 10 || priceData.startingAt

    // Neighborhood
    const neighborhood = NEIGHBORHOODS[Math.floor(rng() * NEIGHBORHOODS.length)]

    // Address
    const streetNum = 100 + Math.floor(rng() * 9900)
    const streets = ['Main St', 'Oak Ave', 'Broadway', 'Market St', 'Park Ave', 'Lake Dr', 'Grand Ave', 'Prospect Ave', 'Jefferson St', 'Cedar St', 'Elm St', 'Maple Ave', '1st St', '2nd St', '3rd St', 'Spring St']
    const street = streets[Math.floor(rng() * streets.length)]
    const address = `${streetNum} ${street}`

    // Boolean flags
    const isFeatured = i < 3 || rng() < 0.15  // First 3 are always featured, plus ~15% chance
    const isVerified = rng() < 0.6             // 60% verified
    const instantBooking = rng() < 0.35         // 35% instant booking

    // Distance: 0.5–25 miles, weighted toward closer
    const distRaw = rng()
    const distanceMiles = Math.round((0.5 + distRaw * distRaw * 24.5) * 10) / 10

    // Bio
    const bioTemplate = BIO_TEMPLATES[Math.floor(rng() * BIO_TEMPLATES.length)]
    const bio = bioTemplate.replace('{category}', displayName.toLowerCase())

    // Cover image - deterministic based on index
    const coverUrl = COVER_IMAGES[i % COVER_IMAGES.length]

    vendors.push({
      vendor_id: `mock-${seedKey}-${i}`,
      business_name: businessName,
      slug: slug,
      cover_url: coverUrl,
      avg_rating: avgRating,
      review_count: reviewCount,
      price_range: priceRange,
      price_starting_at: priceStartingAt,
      neighborhood: neighborhood,
      is_featured: isFeatured,
      is_verified: isVerified,
      instant_booking: instantBooking,
      distance_miles: distanceMiles,
      bio: bio,
      address: `${address}, ${neighborhood}`,
      category: displayName,
    })
  }

  return vendors
}

// ── Common category keywords used to search for vendors by slug ─────────────

const SEARCH_CATEGORIES = [
  'Photography', 'Catering', 'Venues', 'DJ', 'Florist', 'Hair & Makeup',
  'Wedding Planning', 'Event Planning', 'Videography', 'Photo Booth',
  'Limousine', 'Transportation', 'Bakery', 'Cake', 'Band', 'Musician',
  'Officiant', 'Invitations', 'Rentals', 'Decor', 'Lighting', 'Catering',
  'Bar Service', 'Bartender', 'Tent', 'Furniture', 'Linen', 'Stationery',
  'Calligraphy', 'Jewelry', 'Dress', 'Tuxedo', 'Alterations', 'Favors',
  'Gifts', 'Valet', 'Security', 'Childcare', 'Live Music', 'Magician',
  'Comedian', 'Fireworks', 'Drone', 'Balloon', 'Caterer', 'Venue',
  'Photographer', 'Videographer', 'Floristry', 'Makeup Artist', 'Hair Stylist',
  'Event Coordinator', 'Wedding Coordinator', 'Party Rental', 'Tent Rental',
  'Photo Booth Rental', 'Limousine Service', 'Wedding Band', 'DJ Service',
  'Catering Service', 'Bartending Service', 'Cakes and Desserts',
  'Wedding Cakes', 'Balloon Artist', 'Caricature Artist', 'Face Painting',
  'Clown', 'Juggler', 'Acrobat', 'Dancer', 'Singer', 'Emcee', 'Host',
]

/**
 * Find a single mock vendor by its slug.
 * Searches across common categories until a match is found.
 * Returns the vendor data plus the category used to generate it.
 */
export function findMockVendorBySlug(slug: string): (MockVendor & { categoryName: string }) | null {
  for (const category of SEARCH_CATEGORIES) {
    const vendors = getMockVendors(category, undefined, 24)
    const match = vendors.find(v => v.slug === slug)
    if (match) {
      return { ...match, categoryName: category }
    }
  }
  return null
}

/**
 * Generate a vendor profile from a slug when no mock match is found.
 * Parses the slug into a display name and infers category.
 */
export function generateVendorFromSlug(slug: string): MockVendor & { categoryName: string } {
  // Parse slug to display name: "elegant-lens-photography" → "Elegant Lens Photography"
  const name = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Infer category from slug keywords
  const slugLower = slug.toLowerCase()
  let category = 'Event Services'
  if (slugLower.includes('photo')) category = 'Photography'
  else if (slugLower.includes('cater') || slugLower.includes('food') || slugLower.includes('chef')) category = 'Catering'
  else if (slugLower.includes('venue') || slugLower.includes('ballroom') || slugLower.includes('hall') || slugLower.includes('barn')) category = 'Venues'
  else if (slugLower.includes('dj') || slugLower.includes('music') || slugLower.includes('sound') || slugLower.includes('band')) category = 'DJ'
  else if (slugLower.includes('flor') || slugLower.includes('bloom') || slugLower.includes('petal') || slugLower.includes('garden')) category = 'Florist'
  else if (slugLower.includes('hair') || slugLower.includes('makeup') || slugLower.includes('beauty') || slugLower.includes('glam') || slugLower.includes('style')) category = 'Hair & Makeup'
  else if (slugLower.includes('plan') || slugLower.includes('coord') || slugLower.includes('organize')) category = 'Wedding Planning'
  else if (slugLower.includes('video') || slugLower.includes('film') || slugLower.includes('cinema')) category = 'Videography'
  else if (slugLower.includes('cake') || slugLower.includes('bake') || slugLower.includes('dessert') || slugLower.includes('sweet')) category = 'Bakery'
  else if (slugLower.includes('limo') || slugLower.includes('transport') || slugLower.includes('car') || slugLower.includes('shuttle')) category = 'Transportation'
  else if (slugLower.includes('rent') || slugLower.includes('tent') || slugLower.includes('chair') || slugLower.includes('table')) category = 'Rentals'
  else if (slugLower.includes('deco') || slugLower.includes('light') || slugLower.includes('design') || slugLower.includes('balloon')) category = 'Decor'
  else if (slugLower.includes('booth')) category = 'Photo Booth'
  else if (slugLower.includes('officiant') || slugLower.includes('minister') || slugLower.includes('pastor') || slugLower.includes('rabbi')) category = 'Officiant'
  else if (slugLower.includes('bar') || slugLower.includes('bartend') || slugLower.includes('cocktail') || slugLower.includes('drink')) category = 'Bar Service'

  // Generate deterministic values from slug
  const hash = hashString(slug)
  const rng = createRNG(hash)

  const avgRating = Math.round((4.0 + rng() * 0.9) * 10) / 10
  const reviewCount = 5 + Math.floor(rng() * 200)
  const priceTiers = ['$', '$$', '$$$', '$$$$']
  const priceRange = priceTiers[Math.floor(rng() * priceTiers.length)]
  const priceStartingAt = Math.round((200 + rng() * 2000) / 50) * 50
  const neighborhoods = NEIGHBORHOODS
  const neighborhood = neighborhoods[Math.floor(rng() * neighborhoods.length)]
  const coverUrl = COVER_IMAGES[Math.floor(rng() * COVER_IMAGES.length)]
  const isFeatured = rng() < 0.2
  const isVerified = rng() < 0.6
  const instantBooking = rng() < 0.35
  const distanceMiles = Math.round((0.5 + rng() * 20) * 10) / 10
  const bioTemplates = BIO_TEMPLATES
  const bio = bioTemplates[Math.floor(rng() * bioTemplates.length)].replace('{category}', category.toLowerCase())

  return {
    vendor_id: `gen-${slug}`,
    business_name: name,
    slug,
    cover_url: coverUrl,
    avg_rating: avgRating,
    review_count: reviewCount,
    price_range: priceRange,
    price_starting_at: priceStartingAt,
    neighborhood,
    is_featured: isFeatured,
    is_verified: isVerified,
    instant_booking: instantBooking,
    distance_miles: distanceMiles,
    bio,
    address: `${100 + Math.floor(rng() * 9900)} Main St, ${neighborhood}`,
    category,
    categoryName: category,
  }
}
