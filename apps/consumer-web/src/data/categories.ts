// Planviry Marketplace Category Taxonomy
// Source: Planviry FILTER SPECIFICATION.docx
// DO NOT MODIFY names without updating the source document
//
// Counts: 10 L1s · 74 L2s · 1060+ L3/4s

export interface CategoryLevel4 { name: string; slug: string; }
export interface CategoryLevel3 { name: string; slug: string; level4?: CategoryLevel4[]; }
export interface CategoryLevel2 { name: string; slug: string; level3: CategoryLevel3[]; }
export interface CategoryLevel1 { name: string; slug: string; description?: string; level2: CategoryLevel2[]; }

export const categories: CategoryLevel1[] = [
  {
    name: "VENUES & SPACES",
    slug: "venues-spaces",
    description: "",
    level2: [
      {
        name: "Wedding Venues",
        slug: "wedding-venues",
        level3: [
            { name: "Indoor Wedding Venues", slug: "indoor-wedding-venues" },
            { name: "Outdoor/Garden Wedding Venues", slug: "outdoor-garden-wedding-venues" },
            { name: "Historic Wedding Venues", slug: "historic-wedding-venues" },
            { name: "Loft & Warehouse Wedding Venues", slug: "loft-and-warehouse-wedding-venues" },
            { name: "Waterfront Wedding Venues", slug: "waterfront-wedding-venues" },
            { name: "Barn & Rustic Wedding Venues", slug: "barn-and-rustic-wedding-venues" },
            { name: "Church & Religious Wedding Venues", slug: "church-and-religious-wedding-venues" },
            { name: "Hotel Wedding Venues", slug: "hotel-wedding-venues" },
            { name: "Museum & Art Gallery Wedding Venues", slug: "museum-and-art-gallery-wedding-venues" },
            { name: "Vineyard & Winery Wedding Venues", slug: "vineyard-and-winery-wedding-venues" },
            { name: "Beach & Lakeside Wedding Venues", slug: "beach-and-lakeside-wedding-venues" },
            { name: "Mountain & Scenic View Wedding Venues", slug: "mountain-and-scenic-view-wedding-venues" },
            { name: "All-Inclusive Wedding Venues", slug: "all-inclusive-wedding-venues" },
            { name: "DIY Wedding Venues (bring your own vendors)", slug: "diy-wedding-venues" },
            { name: "Micro-Wedding Venues (under 50 guests)", slug: "micro-wedding-venues" },
            { name: "Elopement Packages (ceremony only)", slug: "elopement-packages" }
          ]
      },
      {
        name: "Banquet Halls",
        slug: "banquet-halls",
        level3: [
            { name: "Large Banquet Halls (200+ guests)", slug: "large-banquet-halls" },
            { name: "Medium Banquet Halls (100-200 guests)", slug: "medium-banquet-halls" },
            { name: "Small Banquet Halls (under 100 guests)", slug: "small-banquet-halls" },
            { name: "Asian Banquet Halls (Dim sum, Chinese weddings)", slug: "asian-banquet-halls" },
            { name: "South Asian Banquet Halls (Indian, Pakistani weddings)", slug: "south-asian-banquet-halls" },
            { name: "Filipino Banquet Halls", slug: "filipino-banquet-halls" },
            { name: "Polish & Eastern European Banquet Halls", slug: "polish-and-eastern-european-banquet-halls" },
            { name: "Mexican & Latin Banquet Halls", slug: "mexican-and-latin-banquet-halls" },
            { name: "African American Banquet Halls", slug: "african-american-banquet-halls" },
            { name: "Luxury Banquet Halls (chandeliers, marble)", slug: "luxury-banquet-halls" },
            { name: "Budget Banquet Halls (affordable packages)", slug: "budget-banquet-halls" }
          ]
      },
      {
        name: "Corporate Event Venues",
        slug: "corporate-venues",
        level3: [
            { name: "Conference Centers", slug: "conference-centers" },
            { name: "Convention Centers", slug: "convention-centers" },
            { name: "Hotel Ballrooms (corporate)", slug: "hotel-ballrooms" },
            { name: "Meeting & Boardrooms (small, 10-50 people)", slug: "meeting-and-boardrooms" },
            { name: "Training Facilities", slug: "training-facilities" },
            { name: "Corporate Retreat Centers", slug: "corporate-retreat-centers" },
            { name: "Executive Conference Centers", slug: "executive-conference-centers" },
            { name: "University & College Event Spaces", slug: "university-and-college-event-spaces" },
            { name: "Nonprofit Event Spaces", slug: "nonprofit-event-spaces" },
            { name: "Trade Show & Expo Halls", slug: "trade-show-and-expo-halls" },
            { name: "Product Launch Venues", slug: "product-launch-venues" },
            { name: "Tech Conference Venues (high-speed WiFi, AV built-in)", slug: "tech-conference-venues" }
          ]
      },
      {
        name: "Party Venues",
        slug: "party-venues",
        level3: [
            { name: "Kids Birthday Party Venues (under 12)", slug: "kids-birthday-party-venues" },
            { name: "Teen Birthday Party Venues (13-17)", slug: "teen-birthday-party-venues" },
            { name: "Adult Birthday Party Venues (21+)", slug: "adult-birthday-party-venues" },
            { name: "Milestone Birthday Venues (30th, 40th, 50th, 60th+)", slug: "milestone-birthday-venues" },
            { name: "Anniversary Party Venues", slug: "anniversary-party-venues" },
            { name: "Graduation Party Venues", slug: "graduation-party-venues" },
            { name: "Retirement Party Venues", slug: "retirement-party-venues" },
            { name: "Surprise Party Venues", slug: "surprise-party-venues" },
            { name: "Divorce Party Venues", slug: "divorce-party-venues" },
            { name: "Home Party Venues (renting a house)", slug: "home-party-venues" },
            { name: "Backyard Party Venues (tent rental included)", slug: "backyard-party-venues" },
            { name: "Birthday Party Venues", slug: "birthday-party-venues" }
          ]
      },
      {
        name: "Small & Intimate Event Spaces",
        slug: "small-event-spaces",
        level3: [
            { name: "Under 20 guests", slug: "under-20-guests" },
            { name: "20-50 guests", slug: "20-50-guests" },
            { name: "50-75 guests", slug: "50-75-guests" },
            { name: "75-100 guests", slug: "75-100-guests" },
            { name: "Private Dining Rooms (restaurant-based)", slug: "private-dining-rooms" },
            { name: "Private Chef's Tables", slug: "private-chefs-tables" },
            { name: "Wine Cellar Event Spaces", slug: "wine-cellar-event-spaces" },
            { name: "Art Gallery Small Events", slug: "art-gallery-small-events" },
            { name: "Bookstore Event Spaces", slug: "bookstore-event-spaces" },
            { name: "Coffee Shop Event Spaces (after-hours rental)", slug: "coffee-shop-event-spaces" }
          ]
      },
      {
        name: "Rooftop Venues",
        slug: "rooftop-venues",
        level3: [
            { name: "Rooftop Bars (standing receptions)", slug: "rooftop-bars" },
            { name: "Rooftop Restaurants (seated dinners)", slug: "rooftop-restaurants" },
            { name: "Rooftop Gardens", slug: "rooftop-gardens" },
            { name: "Rooftop with City Skyline View", slug: "rooftop-with-city-skyline-view" },
            { name: "Rooftop with Lake Michigan View", slug: "rooftop-with-lake-michigan-view" },
            { name: "Rooftop with River View", slug: "rooftop-with-river-view" },
            { name: "Rooftop with Covered Area (rain backup)", slug: "rooftop-with-covered-area" },
            { name: "Rooftop with Heaters (winter events)", slug: "rooftop-with-heaters" },
            { name: "Rooftop with Pool", slug: "rooftop-with-pool" }
          ]
      },
      {
        name: "Outdoor Venues",
        slug: "outdoor-venues",
        level3: [
            { name: "Park Pavilions & Shelters", slug: "park-pavilions-and-shelters" },
            { name: "Forest & Woods Venues", slug: "forest-and-woods-venues" },
            { name: "Lakeside & Beach Venues", slug: "lakeside-and-beach-venues" },
            { name: "Riverfront Venues", slug: "riverfront-venues" },
            { name: "Garden Venues (botanical, Japanese, rose)", slug: "garden-venues" },
            { name: "Farm Venues (barn, field, orchard)", slug: "farm-venues" },
            { name: "Vineyard & Winery Outdoor Venues", slug: "vineyard-and-winery-outdoor-venues" },
            { name: "Brewery Beer Gardens", slug: "brewery-beer-gardens" },
            { name: "Courtyard Venues", slug: "courtyard-venues" },
            { name: "Private Estate Grounds", slug: "private-estate-grounds" },
            { name: "Public Park Permits (DIY events)", slug: "public-park-permits" }
          ]
      },
      {
        name: "Concert & Live Music Venues",
        slug: "concert-venues",
        level3: [
            { name: "Intimate Concert Venues (under 200 capacity)", slug: "intimate-concert-venues" },
            { name: "Medium Concert Venues (200-500 capacity)", slug: "medium-concert-venues" },
            { name: "Large Concert Venues (500-1500 capacity)", slug: "large-concert-venues" },
            { name: "Arena & Stadium Venues (1500+ capacity)", slug: "arena-and-stadium-venues" },
            { name: "Outdoor Amphitheaters", slug: "outdoor-amphitheaters" },
            { name: "Music Halls & Theaters", slug: "music-halls-and-theaters" },
            { name: "Jazz Clubs", slug: "jazz-clubs" },
            { name: "Blues Clubs", slug: "blues-clubs" },
            { name: "Rock Clubs", slug: "rock-clubs" },
            { name: "Country & Western Venues", slug: "country-and-western-venues" },
            { name: "Latin Music Venues (salsa, bachata, reggaeton)", slug: "latin-music-venues" },
            { name: "Hip Hop Venues", slug: "hip-hop-venues" },
            { name: "Electronic Dance Music (EDM) Venues", slug: "electronic-dance-music-venues" },
            { name: "Acoustic & Singer-Songwriter Venues", slug: "acoustic-and-singer-songwriter-venues" }
          ]
      },
      {
        name: "Nightlife Venues",
        slug: "nightlife-venues",
        level3: [
            { name: "Bars", slug: "bars" },
            { name: "Sports Bars", slug: "sports-bars" },
            { name: "Dive Bars", slug: "dive-bars" },
            { name: "Irish Pubs", slug: "irish-pubs" },
            { name: "Gastropubs", slug: "gastropubs" },
            { name: "Wine Bars", slug: "wine-bars" },
            { name: "Cocktail Bars (craft, speakeasy)", slug: "cocktail-bars" },
            { name: "Biker Bars", slug: "biker-bars" },
            { name: "Gay Bars & LGBTQ+ Bars", slug: "gay-bars-and-lgbtqplus-bars" },
            { name: "Latin Bars (salsa nights, reggaeton)", slug: "latin-bars" },
            { name: "College Bars", slug: "college-bars" },
            { name: "Rooftop Bars", slug: "rooftop-bars" },
            { name: "Hotel Bars", slug: "hotel-bars" },
            { name: "Tiki Bars", slug: "tiki-bars" },
            { name: "Breweries", slug: "breweries" },
            { name: "Microbreweries", slug: "microbreweries" },
            { name: "Brewpubs (food served)", slug: "brewpubs" },
            { name: "Production Breweries (tours available)", slug: "production-breweries" },
            { name: "Brewery Beer Gardens", slug: "brewery-beer-gardens" },
            { name: "Clubs & Dance Clubs", slug: "clubs-and-dance-clubs" },
            { name: "Nightclubs (18+, 21+)", slug: "nightclubs" },
            { name: "Latin Dance Clubs (salsa, bachata, merengue)", slug: "latin-dance-clubs" },
            { name: "Hip Hop Clubs", slug: "hip-hop-clubs" },
            { name: "EDM Clubs", slug: "edm-clubs" },
            { name: "Top 40 Clubs", slug: "top-40-clubs" },
            { name: "LGBTQ+ Dance Clubs", slug: "lgbtqplus-dance-clubs" },
            { name: "After-Hours Clubs (open until 4am+)", slug: "after-hours-clubs" },
            { name: "Karaoke Bars", slug: "karaoke-bars" },
            { name: "Public Stage Karaoke", slug: "public-stage-karaoke" },
            { name: "Private Room Karaoke", slug: "private-room-karaoke" },
            { name: "Japanese-Style Karaoke Boxes", slug: "japanese-style-karaoke-boxes" },
            { name: "Lounge & Chill Bars", slug: "lounge-and-chill-bars" }
          ]
      },
      {
        name: "Milestone Venues",
        slug: "milestone-venues",
        level3: [
            { name: "Quinceañera Venues", slug: "quinceaera-venues" },
            { name: "Ballroom Quinceañera Venues", slug: "ballroom-quinceaera-venues" },
            { name: "Banquet Hall Quinceañera Venues", slug: "banquet-hall-quinceaera-venues" },
            { name: "Church Hall Quinceañera Venues", slug: "church-hall-quinceaera-venues" },
            { name: "Outdoor Quinceañera Venues", slug: "outdoor-quinceaera-venues" },
            { name: "Luxury Quinceañera Venues", slug: "luxury-quinceaera-venues" },
            { name: "Budget Quinceañera Venues", slug: "budget-quinceaera-venues" },
            { name: "Sweet 16 Venues", slug: "sweet-16-venues" },
            { name: "Ballroom Sweet 16 Venues", slug: "ballroom-sweet-16-venues" },
            { name: "Banquet Hall Sweet 16 Venues", slug: "banquet-hall-sweet-16-venues" },
            { name: "Outdoor Sweet 16 Venues", slug: "outdoor-sweet-16-venues" },
            { name: "Pool Party Sweet 16 Venues", slug: "pool-party-sweet-16-venues" },
            { name: "Themed Sweet 16 Venues", slug: "themed-sweet-16-venues" },
            { name: "Bar/Bat Mitzvah Venues", slug: "bar-bat-mitzvah-venues" },
            { name: "Synagogue Social Halls", slug: "synagogue-social-halls" },
            { name: "Hotel Ballroom Mitzvah Venues", slug: "hotel-ballroom-mitzvah-venues" },
            { name: "Banquet Hall Mitzvah Venues", slug: "banquet-hall-mitzvah-venues" },
            { name: "Country Club Mitzvah Venues", slug: "country-club-mitzvah-venues" },
            { name: "Prom Venues", slug: "prom-venues" },
            { name: "Hotel Ballroom Prom Venues", slug: "hotel-ballroom-prom-venues" },
            { name: "Convention Center Prom Venues", slug: "convention-center-prom-venues" },
            { name: "Museum & Cultural Center Prom Venues", slug: "museum-and-cultural-center-prom-venues" },
            { name: "Cruise Ship & Boat Prom Venues", slug: "cruise-ship-and-boat-prom-venues" }
          ]
      },
      {
        name: "Community Centers",
        slug: "community-centers",
        level3: [
            { name: "City-Run Community Centers (affordable)", slug: "city-run-community-centers" },
            { name: "Nonprofit Community Centers", slug: "nonprofit-community-centers" },
            { name: "Religious Community Centers (church halls, mosque halls)", slug: "religious-community-centers" },
            { name: "School & University Community Spaces", slug: "school-and-university-community-spaces" },
            { name: "Affordable Event Spaces (under $500)", slug: "affordable-event-spaces" },
            { name: "Free Event Spaces (donation-based)", slug: "free-event-spaces" }
          ]
      },
      {
        name: "Unique Venues",
        slug: "unique-venues",
        level3: [
            { name: "Museum Event Spaces", slug: "museum-event-spaces" },
            { name: "Art Gallery Event Spaces", slug: "art-gallery-event-spaces" },
            { name: "Theater & Performing Arts Venues", slug: "theater-and-performing-arts-venues" },
            { name: "Historic Homes & Mansions", slug: "historic-homes-and-mansions" },
            { name: "Castles & Chateaus", slug: "castles-and-chateaus" },
            { name: "Boats & Cruise Ships (on-water events)", slug: "boats-and-cruise-ships" },
            { name: "Yacht Clubs", slug: "yacht-clubs" },
            { name: "Aquariums", slug: "aquariums" },
            { name: "Zoos", slug: "zoos" },
            { name: "Planetariums", slug: "planetariums" },
            { name: "Libraries (after-hours rental)", slug: "libraries" },
            { name: "Fire Stations (historic, event rental)", slug: "fire-stations" },
            { name: "Police Stations (yes, some rent)", slug: "police-stations" },
            { name: "Factory & Industrial Spaces (converted)", slug: "factory-and-industrial-spaces" },
            { name: "Warehouse Event Spaces", slug: "warehouse-event-spaces" },
            { name: "Greenhouse & Conservatory Venues", slug: "greenhouse-and-conservatory-venues" },
            { name: "Observatory Venues", slug: "observatory-venues" },
            { name: "Train Stations (historic)", slug: "train-stations" },
            { name: "Airplane Hangars", slug: "airplane-hangars" }
          ]
      }
    ]
  },
    {
    name: "EVENT PLANNING & SERVICES",
    slug: "event-planning-services",
    description: "",
    level2: [
      {
        name: "Full-Service Event Planners",
        slug: "full-service",
        level3: [
            { name: "Luxury Wedding Planners (over $50k budget)", slug: "luxury-wedding-planners" },
            { name: "Mid-Range Wedding Planners ($15k-$50k)", slug: "mid-range-wedding-planners" },
            { name: "Budget Wedding Planners (under $15k)", slug: "budget-wedding-planners" },
            { name: "Destination Wedding Planners", slug: "destination-wedding-planners" },
            { name: "Corporate Event Planners (full-service)", slug: "corporate-event-planners" },
            { name: "Nonprofit & Gala Planners", slug: "nonprofit-and-gala-planners" },
            { name: "Festival & Large-Scale Event Planners", slug: "festival-and-large-scale-event-planners" },
            { name: "Multicultural Event Planners (Indian, Latino, Asian, African weddings)", slug: "multicultural-event-planners" },
            { name: "LGBTQ+ Wedding Planners", slug: "lgbtqplus-wedding-planners" },
            { name: "Elopement Planners", slug: "elopement-planners" }
          ]
      },
      {
        name: "Wedding Planners",
        slug: "wedding-planners",
        level3: [
            { name: "Full-Service Wedding Planners (end-to-end)", slug: "full-service-wedding-planners" },
            { name: "Partial Wedding Planners (some help)", slug: "partial-wedding-planners" },
            { name: "Month-Of Wedding Planners", slug: "month-of-wedding-planners" },
            { name: "Day-Of Wedding Coordinators", slug: "day-of-wedding-coordinators" },
            { name: "Destination Wedding Planners", slug: "destination-wedding-planners" },
            { name: "Cultural Wedding Planners (specific traditions)", slug: "cultural-wedding-planners" },
            { name: "Micro-Wedding Planners (under 50 guests)", slug: "micro-wedding-planners" },
            { name: "Elopement Planners (ceremony only)", slug: "elopement-planners" },
            { name: "Wedding Designers & Stylists (visuals only)", slug: "wedding-designers-and-stylists" },
            { name: "Wedding Budget Planners (financial tracking)", slug: "wedding-budget-planners" },
            { name: "Wedding Vendor Managers (vendor coordination only)", slug: "wedding-vendor-managers" }
          ]
      },
      {
        name: "Corporate Event Planners",
        slug: "corporate-planners",
        level3: [
            { name: "Conference Planners", slug: "conference-planners" },
            { name: "Trade Show & Expo Planners", slug: "trade-show-and-expo-planners" },
            { name: "Product Launch Planners", slug: "product-launch-planners" },
            { name: "Corporate Retreat Planners", slug: "corporate-retreat-planners" },
            { name: "Team Building Event Planners", slug: "team-building-event-planners" },
            { name: "Holiday Party Planners (corporate)", slug: "holiday-party-planners" },
            { name: "Fundraising & Gala Planners (corporate/nonprofit)", slug: "fundraising-and-gala-planners" },
            { name: "Meeting & Board Retreat Planners", slug: "meeting-and-board-retreat-planners" },
            { name: "Incentive Trip Planners", slug: "incentive-trip-planners" },
            { name: "Virtual & Hybrid Event Planners", slug: "virtual-and-hybrid-event-planners" }
          ]
      },
      {
        name: "Party Planners",
        slug: "party-planners",
        level3: [
            { name: "Kids Birthday Planners (ages 1-12)", slug: "kids-birthday-planners" },
            { name: "Teen Birthday Planners (ages 13-17)", slug: "teen-birthday-planners" },
            { name: "Adult Birthday Planners (21+)", slug: "adult-birthday-planners" },
            { name: "Milestone Birthday Planners (30th, 40th, 50th, 60th+)", slug: "milestone-birthday-planners" },
            { name: "Anniversary Party Planners", slug: "anniversary-party-planners" },
            { name: "Graduation Party Planners", slug: "graduation-party-planners" },
            { name: "Retirement Party Planners", slug: "retirement-party-planners" },
            { name: "Surprise Party Planners", slug: "surprise-party-planners" },
            { name: "Bachelorette Party Planners", slug: "bachelorette-party-planners" },
            { name: "Bachelor Party Planners", slug: "bachelor-party-planners" },
            { name: "Baby Shower Planners", slug: "baby-shower-planners" },
            { name: "Bridal Shower Planners", slug: "bridal-shower-planners" },
            { name: "Divorce Party Planners", slug: "divorce-party-planners" }
          ]
      },
      {
        name: "Day-of Coordinators",
        slug: "day-of-coordinators",
        level3: [
            { name: "Wedding Day-of Coordinators", slug: "wedding-day-of-coordinators" },
            { name: "Corporate Event Day-of Coordinators", slug: "corporate-event-day-of-coordinators" },
            { name: "Party Day-of Coordinators", slug: "party-day-of-coordinators" },
            { name: "Wedding Venue Coordinators (employed by venue)", slug: "wedding-venue-coordinators" },
            { name: "Independent Day-of Coordinators", slug: "independent-day-of-coordinators" }
          ]
      },
      {
        name: "Officiants",
        slug: "officiants",
        level3: [
            { name: "Christian Officiants (Catholic, Protestant, Orthodox, Non-denominational)", slug: "christian-officiants" },
            { name: "Jewish Officiants (Rabbi, Cantor)", slug: "jewish-officiants" },
            { name: "Muslim Officiants (Imam)", slug: "muslim-officiants" },
            { name: "Hindu Officiants (Pandit)", slug: "hindu-officiants" },
            { name: "Buddhist Officiants", slug: "buddhist-officiants" },
            { name: "Sikh Officiants", slug: "sikh-officiants" },
            { name: "Interfaith Officiants (mixed religious backgrounds)", slug: "interfaith-officiants" },
            { name: "Secular Officiants (non-religious, humanist)", slug: "secular-officiants" },
            { name: "Spiritual Officiants (not religious but spiritual)", slug: "spiritual-officiants" },
            { name: "Civil Officiants (judge, justice of the peace)", slug: "civil-officiants" },
            { name: "LGBTQ+ Affirming Officiants", slug: "lgbtqplus-affirming-officiants" },
            { name: "Bilingual Officiants (Spanish/English, Polish/English, etc.)", slug: "bilingual-officiants" },
            { name: "Military Officiants", slug: "military-officiants" },
            { name: "Destination Wedding Officiants (travel)", slug: "destination-wedding-officiants" }
          ]
      },
      {
        name: "Concert & Tour Promoters",
        slug: "concert-promoters",
        level3: [
            { name: "Local Concert Promoters (Milwaukee venues)", slug: "local-concert-promoters" },
            { name: "National Tour Promoters", slug: "national-tour-promoters" },
            { name: "Festival Promoters", slug: "festival-promoters" },
            { name: "Club Night Promoters", slug: "club-night-promoters" },
            { name: "Hip Hop Concert Promoters", slug: "hip-hop-concert-promoters" },
            { name: "Rock Concert Promoters", slug: "rock-concert-promoters" },
            { name: "Latin Concert Promoters", slug: "latin-concert-promoters" },
            { name: "EDM & DJ Concert Promoters", slug: "edm-and-dj-concert-promoters" },
            { name: "Jazz & Blues Concert Promoters", slug: "jazz-and-blues-concert-promoters" },
            { name: "Country Concert Promoters", slug: "country-concert-promoters" },
            { name: "Comedy Tour Promoters", slug: "comedy-tour-promoters" }
          ]
      },
      {
        name: "Fundraising & Gala Planners",
        slug: "fundraising-planners",
        level3: [
            { name: "Nonprofit Gala Planners", slug: "nonprofit-gala-planners" },
            { name: "Charity Auction Planners", slug: "charity-auction-planners" },
            { name: "Walkathon & Run Planners", slug: "walkathon-and-run-planners" },
            { name: "Benefit Concert Planners", slug: "benefit-concert-planners" },
            { name: "Political Fundraising Event Planners", slug: "political-fundraising-event-planners" },
            { name: "School & PTA Fundraising Planners", slug: "school-and-pta-fundraising-planners" },
            { name: "Church Fundraising Event Planners", slug: "church-fundraising-event-planners" },
            { name: "Crowdfunding Event Planners", slug: "crowdfunding-event-planners" }
          ]
      },
      {
        name: "Event Stylists / Designers",
        slug: "event-stylists",
        level3: [
            { name: "Wedding Stylists (visual design only)", slug: "wedding-stylists" },
            { name: "Corporate Event Stylists", slug: "corporate-event-stylists" },
            { name: "Party Stylists", slug: "party-stylists" },
            { name: "Floral Stylists (flower-specific)", slug: "floral-stylists" },
            { name: "Lighting Designers (mood lighting)", slug: "lighting-designers" },
            { name: "Tabletop & Linens Stylists", slug: "tabletop-and-linens-stylists" },
            { name: "Signage & Stationery Stylists", slug: "signage-and-stationery-stylists" },
            { name: "Balloon Stylists", slug: "balloon-stylists" },
            { name: "Fabric & Drapery Stylists", slug: "fabric-and-drapery-stylists" },
            { name: "Vintage & Retro Stylists", slug: "vintage-and-retro-stylists" }
          ]
      }
    ]
  },
    {
    name: "CATERING & FOOD",
    slug: "catering-food",
    description: "",
    level2: [
      {
        name: "Caterers",
        slug: "caterers",
        level3: [
            { name: "Wedding Caterers", slug: "wedding-caterers",
              level4: [{ name: "Plated Dinner Caterers", slug: "plated-dinner-caterers" }, { name: "Buffet Caterers", slug: "buffet-caterers" }, { name: "Family Style Caterers", slug: "family-style-caterers" }, { name: "Food Station Caterers", slug: "food-station-caterers" }, { name: "Passed Appetizer Caterers", slug: "passed-appetizer-caterers" }, { name: "Late-Night Snack Caterers", slug: "late-night-snack-caterers" }, { name: "Rehearsal Dinner Caterers", slug: "rehearsal-dinner-caterers" }] },
            { name: "Corporate Caterers", slug: "corporate-caterers",
              level4: [{ name: "Boxed Lunch Caterers", slug: "boxed-lunch-caterers" }, { name: "Breakfast Meeting Caterers", slug: "breakfast-meeting-caterers" }, { name: "Lunch Buffet Caterers", slug: "lunch-buffet-caterers" }, { name: "Executive Dinner Caterers", slug: "executive-dinner-caterers" }, { name: "Holiday Party Caterers", slug: "holiday-party-caterers" }] },
            { name: "Party Caterers", slug: "party-caterers",
              level4: [{ name: "Birthday Party Caterers", slug: "birthday-party-caterers" }, { name: "Anniversary Party Caterers", slug: "anniversary-party-caterers" }, { name: "Graduation Party Caterers", slug: "graduation-party-caterers" }, { name: "Holiday Party Caterers (private)", slug: "holiday-party-caterers" }, { name: "Backyard BBQ Caterers", slug: "backyard-bbq-caterers" }, { name: "Pool Party Caterers", slug: "pool-party-caterers" }, { name: "Game Day Party Caterers", slug: "game-day-party-caterers" }] },
            { name: "Cultural & Ethnic Caterers", slug: "cultural-and-ethnic-caterers",
              level4: [{ name: "Italian Caterers", slug: "italian-caterers" }, { name: "Mexican & Latin Caterers", slug: "mexican-and-latin-caterers" }, { name: "Chinese & Asian Caterers", slug: "chinese-and-asian-caterers" }, { name: "Indian & South Asian Caterers", slug: "indian-and-south-asian-caterers" }, { name: "Mediterranean & Middle Eastern Caterers", slug: "mediterranean-and-middle-eastern-caterers" }, { name: "Polish & Eastern European Caterers", slug: "polish-and-eastern-european-caterers" }, { name: "German Caterers", slug: "german-caterers" }, { name: "Greek Caterers", slug: "greek-caterers" }, { name: "French Caterers", slug: "french-caterers" }, { name: "African & Soul Food Caterers", slug: "african-and-soul-food-caterers" }, { name: "Caribbean Caterers", slug: "caribbean-caterers" }, { name: "Japanese & Sushi Caterers", slug: "japanese-and-sushi-caterers" }, { name: "Thai & Vietnamese Caterers", slug: "thai-and-vietnamese-caterers" }] },
            { name: "Dietary-Specific Caterers", slug: "dietary-specific-caterers",
              level4: [{ name: "Gluten-Free Caterers", slug: "gluten-free-caterers" }, { name: "Vegan & Vegetarian Caterers", slug: "vegan-and-vegetarian-caterers" }, { name: "Kosher Caterers", slug: "kosher-caterers" }, { name: "Halal Caterers", slug: "halal-caterers" }, { name: "Dairy-Free Caterers", slug: "dairy-free-caterers" }, { name: "Nut-Free Caterers", slug: "nut-free-caterers" }, { name: "Keto & Paleo Caterers", slug: "keto-and-paleo-caterers" }] }
          ]
      },
      {
        name: "Food Trucks",
        slug: "food-trucks",
        level3: [
            { name: "Taco Food Trucks", slug: "taco-food-trucks" },
            { name: "Burger & Sandwich Food Trucks", slug: "burger-and-sandwich-food-trucks" },
            { name: "Pizza Food Trucks", slug: "pizza-food-trucks" },
            { name: "BBQ Food Trucks", slug: "bbq-food-trucks" },
            { name: "Asian Fusion Food Trucks", slug: "asian-fusion-food-trucks" },
            { name: "Mexican Food Trucks", slug: "mexican-food-trucks" },
            { name: "Latin Food Trucks", slug: "latin-food-trucks" },
            { name: "Ice Cream & Dessert Food Trucks", slug: "ice-cream-and-dessert-food-trucks" },
            { name: "Coffee & Donut Food Trucks", slug: "coffee-and-donut-food-trucks" },
            { name: "Grilled Cheese Food Trucks", slug: "grilled-cheese-food-trucks" },
            { name: "Lobster & Seafood Food Trucks", slug: "lobster-and-seafood-food-trucks" },
            { name: "Vegan & Vegetarian Food Trucks", slug: "vegan-and-vegetarian-food-trucks" },
            { name: "Gluten-Free Food Trucks", slug: "gluten-free-food-trucks" },
            { name: "Breakfast Food Trucks", slug: "breakfast-food-trucks" },
            { name: "Late-Night Food Trucks (2am-4am)", slug: "late-night-food-trucks" },
            { name: "Carnival & Fair Food Trucks (funnel cakes, corn dogs)", slug: "carnival-and-fair-food-trucks" }
          ]
      },
      {
        name: "Private Chefs",
        slug: "private-chefs",
        level3: [
            { name: "In-Home Private Chefs (cook at your house)", slug: "in-home-private-chefs" },
            { name: "Intimate Dinner Chefs (2-10 guests)", slug: "intimate-dinner-chefs" },
            { name: "Small Party Chefs (11-30 guests)", slug: "small-party-chefs" },
            { name: "Cooking Class Chefs (teach while cooking)", slug: "cooking-class-chefs" },
            { name: "Tasting Menu Chefs (multi-course)", slug: "tasting-menu-chefs" },
            { name: "Dietary-Specific Private Chefs (vegan, keto, etc.)", slug: "dietary-specific-private-chefs" },
            { name: "Cultural Cuisine Private Chefs", slug: "cultural-cuisine-private-chefs" },
            { name: "Celebrity Private Chefs (high-end)", slug: "celebrity-private-chefs" },
            { name: "Meal Prep Private Chefs (weekly service)", slug: "meal-prep-private-chefs" }
          ]
      },
      {
        name: "Bartending Services",
        slug: "bartending",
        level3: [
            { name: "Mobile Bars (portable bar setup)", slug: "mobile-bars" },
            { name: "Cocktail Bartenders (craft cocktails)", slug: "cocktail-bartenders" },
            { name: "Beer & Wine Bartenders (basic service)", slug: "beer-and-wine-bartenders" },
            { name: "Specialty Cocktail Bartenders (signature drinks)", slug: "specialty-cocktail-bartenders" },
            { name: "Mocktail Bartenders (non-alcoholic)", slug: "mocktail-bartenders" },
            { name: "Flair Bartenders (performance)", slug: "flair-bartenders" },
            { name: "Tasting Event Bartenders (wine, beer, spirits)", slug: "tasting-event-bartenders" },
            { name: "Wedding Bartenders", slug: "wedding-bartenders" },
            { name: "Corporate Event Bartenders", slug: "corporate-event-bartenders" },
            { name: "Party Bartenders (birthday, anniversary)", slug: "party-bartenders" },
            { name: "Open Bar Bartenders", slug: "open-bar-bartenders" },
            { name: "Cash Bartenders", slug: "cash-bartenders" },
            { name: "B.Y.O.B. Bartenders (you supply alcohol)", slug: "byob-bartenders" }
          ]
      },
      {
        name: "Bakeries & Desserts",
        slug: "bakeries-desserts",
        level3: [
            { name: "Custom Cakes", slug: "custom-cakes",
              level4: [{ name: "Wedding Cakes", slug: "wedding-cakes" }, { name: "Birthday Cakes", slug: "birthday-cakes" }, { name: "Baby Shower Cakes", slug: "baby-shower-cakes" }, { name: "Bridal Shower Cakes", slug: "bridal-shower-cakes" }, { name: "Graduation Cakes", slug: "graduation-cakes" }, { name: "Anniversary Cakes", slug: "anniversary-cakes" }, { name: "Quinceañera Cakes", slug: "quinceaera-cakes" }, { name: "Sweet 16 Cakes", slug: "sweet-16-cakes" }, { name: "Bar/Bat Mitzvah Cakes", slug: "bar-bat-mitzvah-cakes" }, { name: "Gender Reveal Cakes", slug: "gender-reveal-cakes" }, { name: "Retirement Cakes", slug: "retirement-cakes" }, { name: "Holiday Cakes (Christmas, Easter, etc.)", slug: "holiday-cakes" }] },
            { name: "Specialty Cakes", slug: "specialty-cakes",
              level4: [{ name: "Vegan Cakes", slug: "vegan-cakes" }, { name: "Gluten-Free Cakes", slug: "gluten-free-cakes" }, { name: "Dairy-Free Cakes", slug: "dairy-free-cakes" }, { name: "Sugar-Free Cakes", slug: "sugar-free-cakes" }, { name: "Keto Cakes", slug: "keto-cakes" }, { name: "Nut-Free Cakes", slug: "nut-free-cakes" }] },
            { name: "Other Desserts", slug: "other-desserts" },
            { name: "Cupcakes", slug: "cupcakes" },
            { name: "Cookies (custom decorated)", slug: "cookies" },
            { name: "Cake Pops", slug: "cake-pops" },
            { name: "Dessert Tables & Candy Buffets", slug: "dessert-tables-and-candy-buffets" },
            { name: "Chocolate Fountains (rental + service)", slug: "chocolate-fountains" },
            { name: "Donuts (custom, mini donuts for events)", slug: "donuts" },
            { name: "Pies (custom)", slug: "pies" },
            { name: "Pastries (croissants, danishes)", slug: "pastries" },
            { name: "Macarons (custom colors)", slug: "macarons" },
            { name: "Cake Delivery & Setup Only (no baking)", slug: "cake-delivery-and-setup-only" }
          ]
      },
      {
        name: "Restaurants with Private Dining",
        slug: "private-dining",
        level3: [
            { name: "Italian Restaurant Private Dining", slug: "italian-restaurant-private-dining" },
            { name: "Steakhouse Private Dining", slug: "steakhouse-private-dining" },
            { name: "Seafood Restaurant Private Dining", slug: "seafood-restaurant-private-dining" },
            { name: "Mexican Restaurant Private Dining", slug: "mexican-restaurant-private-dining" },
            { name: "Asian Restaurant Private Dining", slug: "asian-restaurant-private-dining" },
            { name: "French Restaurant Private Dining", slug: "french-restaurant-private-dining" },
            { name: "Mediterranean Restaurant Private Dining", slug: "mediterranean-restaurant-private-dining" },
            { name: "American Restaurant Private Dining", slug: "american-restaurant-private-dining" },
            { name: "Farm-to-Table Restaurant Private Dining", slug: "farm-to-table-restaurant-private-dining" },
            { name: "Brewery Private Dining", slug: "brewery-private-dining" },
            { name: "Wine Bar Private Dining", slug: "wine-bar-private-dining" },
            { name: "Rooftop Restaurant Private Dining", slug: "rooftop-restaurant-private-dining" },
            { name: "Waterfront Restaurant Private Dining", slug: "waterfront-restaurant-private-dining" },
            { name: "Budget Private Dining (under $30/person)", slug: "budget-private-dining" },
            { name: "Mid-Range Private Dining ($30-$75/person)", slug: "mid-range-private-dining" },
            { name: "Luxury Private Dining ($75+/person)", slug: "luxury-private-dining" }
          ]
      },
      {
        name: "Rehearsal Dinner Venues",
        slug: "rehearsal-dinner-venues",
        level3: [
            { name: "Casual Rehearsal Dinner Venues (pizza, BBQ, pub)", slug: "casual-rehearsal-dinner-venues" },
            { name: "Formal Rehearsal Dinner Venues (steakhouse, Italian)", slug: "formal-rehearsal-dinner-venues" },
            { name: "Outdoor Rehearsal Dinner Venues (patio, garden)", slug: "outdoor-rehearsal-dinner-venues" },
            { name: "Private Room Rehearsal Dinners", slug: "private-room-rehearsal-dinners" },
            { name: "Rehearsal Dinner at Wedding Venue (same location)", slug: "rehearsal-dinner-at-wedding-venue" }
          ]
      },
      {
        name: "Wine, Beer & Spirits Services",
        slug: "wine-beer-spirits",
        level3: [
            { name: "Wine Suppliers (bottles, cases, bulk)", slug: "wine-suppliers" },
            { name: "Beer Suppliers (kegs, cans, bottles)", slug: "beer-suppliers" },
            { name: "Liquor Suppliers", slug: "liquor-suppliers" },
            { name: "Wine Tasting Event Services", slug: "wine-tasting-event-services" },
            { name: "Beer Tasting Event Services", slug: "beer-tasting-event-services" },
            { name: "Spirits Tasting Event Services", slug: "spirits-tasting-event-services" },
            { name: "Sommelier Services (wine pairing, education)", slug: "sommelier-services" },
            { name: "Cicerone Services (beer expert)", slug: "cicerone-services" },
            { name: "Mixologist Services (cocktail consulting)", slug: "mixologist-services" }
          ]
      },
      {
        name: "Bottomless Brunch Services",
        slug: "bottomless-brunch",
        level3: [
            { name: "Mimosa Bars (champagne + juice)", slug: "mimosa-bars" },
            { name: "Bloody Mary Bars (build-your-own)", slug: "bloody-mary-bars" },
            { name: "Bellini Bars (peach + prosecco)", slug: "bellini-bars" },
            { name: "Margarita Brunch Bars", slug: "margarita-brunch-bars" },
            { name: "Aperol Spritz Brunch Bars", slug: "aperol-spritz-brunch-bars" },
            { name: "Mocktail Brunch Bars (non-alcoholic)", slug: "mocktail-brunch-bars" },
            { name: "Family-Friendly Brunch (no alcohol)", slug: "family-friendly-brunch" },
            { name: "Drag Brunch", slug: "drag-brunch" },
            { name: "Jazz Brunch", slug: "jazz-brunch" },
            { name: "Rooftop Brunch", slug: "rooftop-brunch" }
          ]
      }
    ]
  },
    {
    name: "ENTERTAINMENT",
    slug: "entertainment",
    description: "",
    level2: [
      {
        name: "DJs",
        slug: "djs",
        level3: [
            { name: "Wedding DJs", slug: "wedding-djs",
              level4: [{ name: "Traditional Wedding DJs (emcee, announcements)", slug: "traditional-wedding-djs" }, { name: "Latin Wedding DJs (salsa, bachata, reggaeton)", slug: "latin-wedding-djs" }, { name: "South Asian Wedding DJs (Bhangra, Bollywood)", slug: "south-asian-wedding-djs" }, { name: "Multicultural Wedding DJs", slug: "multicultural-wedding-djs" }, { name: "LGBTQ+ Wedding DJs", slug: "lgbtqplus-wedding-djs" }, { name: "Intimate Wedding DJs (under 50 guests)", slug: "intimate-wedding-djs" }, { name: "Luxury Wedding DJs (premium packages)", slug: "luxury-wedding-djs" }, { name: "Budget Wedding DJs (affordable)", slug: "budget-wedding-djs" }] },
            { name: "Party DJs", slug: "party-djs",
              level4: [{ name: "Birthday Party DJs (adult, kids, teen)", slug: "birthday-party-djs" }, { name: "Anniversary Party DJs", slug: "anniversary-party-djs" }, { name: "Graduation Party DJs", slug: "graduation-party-djs" }, { name: "Holiday Party DJs", slug: "holiday-party-djs" }, { name: "House Party DJs", slug: "house-party-djs" }, { name: "Pool Party DJs", slug: "pool-party-djs" }] },
            { name: "Latin Music DJs", slug: "latin-music-djs",
              level4: [{ name: "Salsa DJs", slug: "salsa-djs" }, { name: "Bachata DJs", slug: "bachata-djs" }, { name: "Reggaeton DJs", slug: "reggaeton-djs" }, { name: "Merengue DJs", slug: "merengue-djs" }, { name: "Cumbia DJs", slug: "cumbia-djs" }, { name: "Latin House DJs", slug: "latin-house-djs" }, { name: "Latin Hip Hop DJs", slug: "latin-hip-hop-djs" }, { name: "Bilingual Latin DJs (Spanish/English)", slug: "bilingual-latin-djs" }] },
            { name: "Prom & School Dance DJs", slug: "prom-and-school-dance-djs",
              level4: [{ name: "Prom DJs", slug: "prom-djs" }, { name: "Homecoming DJs", slug: "homecoming-djs" }, { name: "Middle School Dance DJs (clean edits)", slug: "middle-school-dance-djs" }, { name: "High School Dance DJs", slug: "high-school-dance-djs" }, { name: "School Pep Rally DJs", slug: "school-pep-rally-djs" }] },
            { name: "Karaoke DJs (KJs)", slug: "karaoke-djs",
              level4: [{ name: "Public Stage Karaoke Hosts", slug: "public-stage-karaoke-hosts" }, { name: "Private Room Karaoke Hosts", slug: "private-room-karaoke-hosts" }, { name: "Mobile Karaoke (brings equipment)", slug: "mobile-karaoke" }, { name: "Bilingual Karaoke Hosts", slug: "bilingual-karaoke-hosts" }] },
            { name: "Open Format DJs (any genre)", slug: "open-format-djs",
              level4: [{ name: "Open Format DJs (any genre)", slug: "open-format-djs" }] },
            { name: "Genre-Specific DJs", slug: "genre-specific-djs" },
            { name: "Hip Hop DJs", slug: "hip-hop-djs" },
            { name: "EDM DJs", slug: "edm-djs" },
            { name: "Top 40 DJs", slug: "top-40-djs" },
            { name: "Country DJs", slug: "country-djs" },
            { name: "Rock DJs", slug: "rock-djs" },
            { name: "80s, 90s, 2000s Throwback DJs", slug: "80s-90s-2000s-throwback-djs" },
            { name: "Silent Disco DJs (headphone parties)", slug: "silent-disco-djs" }
          ]
      },
      {
        name: "Live Bands & Musicians",
        slug: "live-bands",
        level3: [
            { name: "Wedding Bands", slug: "wedding-bands",
              level4: [{ name: "Cover Bands (wedding hits)", slug: "cover-bands" }, { name: "Top 40 Wedding Bands", slug: "top-40-wedding-bands" }, { name: "Motown & Soul Wedding Bands", slug: "motown-and-soul-wedding-bands" }, { name: "Jazz Wedding Bands", slug: "jazz-wedding-bands" }, { name: "Swing Wedding Bands", slug: "swing-wedding-bands" }, { name: "Latin Wedding Bands (salsa, bachata)", slug: "latin-wedding-bands" }, { name: "South Asian Wedding Bands (Bollywood, Bhangra)", slug: "south-asian-wedding-bands" }, { name: "String Quartets (ceremony music)", slug: "string-quartets" }, { name: "Acoustic Duos (cocktail hour)", slug: "acoustic-duos" }, { name: "Solo Musicians (guitar, piano, violin)", slug: "solo-musicians" }] },
            { name: "Corporate Event Bands", slug: "corporate-event-bands",
              level4: [{ name: "Cover Bands (corporate hits)", slug: "cover-bands" }, { name: "Jazz Bands (background music)", slug: "jazz-bands" }, { name: "Funk & Soul Bands (high energy)", slug: "funk-and-soul-bands" }, { name: "Party Bands (interactive)", slug: "party-bands" }] },
            { name: "Party Bands", slug: "party-bands",
              level4: [{ name: "Cover Bands", slug: "cover-bands" }, { name: "Tribute Bands (specific artist)", slug: "tribute-bands" }, { name: "Dance Bands", slug: "dance-bands" }] },
            { name: "Concert & Festival Bands (original music)", slug: "concert-and-festival-bands",
              level4: [{ name: "Rock Bands", slug: "rock-bands" }, { name: "Indie Bands", slug: "indie-bands" }, { name: "Alternative Bands", slug: "alternative-bands" }, { name: "Metal Bands", slug: "metal-bands" }, { name: "Punk Bands", slug: "punk-bands" }, { name: "Country Bands", slug: "country-bands" }, { name: "Folk & Americana Bands", slug: "folk-and-americana-bands" }, { name: "Bluegrass Bands", slug: "bluegrass-bands" }, { name: "Blues Bands", slug: "blues-bands" }, { name: "Jazz Bands (small ensemble, big band)", slug: "jazz-bands" }, { name: "Funk Bands", slug: "funk-bands" }, { name: "Soul & R&B Bands", slug: "soul-and-randb-bands" }, { name: "Hip Hop Bands (live instrumentation)", slug: "hip-hop-bands" }, { name: "Latin Bands (full ensemble)", slug: "latin-bands" }, { name: "Reggae Bands", slug: "reggae-bands" }, { name: "Ska Bands", slug: "ska-bands" }, { name: "World Music Bands (African, Caribbean, Celtic)", slug: "world-music-bands" }, { name: "Marching Bands (parades)", slug: "marching-bands" }, { name: "Brass Bands (New Orleans style)", slug: "brass-bands" }, { name: "Mariachi Bands", slug: "mariachi-bands" }, { name: "Polka Bands", slug: "polka-bands" }] },
            { name: "Solo Musicians & Duos", slug: "solo-musicians-and-duos",
              level4: [{ name: "Acoustic Guitar Singers", slug: "acoustic-guitar-singers" }, { name: "Pianists (classical, jazz, pop)", slug: "pianists" }, { name: "Violinists (ceremony, cocktail hour)", slug: "violinists" }, { name: "Cellists", slug: "cellists" }, { name: "Harpists", slug: "harpists" }, { name: "Saxophonists", slug: "saxophonists" }, { name: "Flamenco Guitarists", slug: "flamenco-guitarists" }, { name: "Bagpipers (Scottish, Irish)", slug: "bagpipers" }, { name: "Steel Drum Bands (Caribbean, beach)", slug: "steel-drum-bands" }] }
          ]
      },
      {
        name: "Concert Promotion Services",
        slug: "concert-promoters",
        level3: [
            { name: "Local Venue Concert Promoters", slug: "local-venue-concert-promoters" },
            { name: "Festival Promoters", slug: "festival-promoters" },
            { name: "National Tour Promoters", slug: "national-tour-promoters" },
            { name: "Hip Hop Concert Promoters", slug: "hip-hop-concert-promoters" },
            { name: "Rock Concert Promoters", slug: "rock-concert-promoters" },
            { name: "EDM Concert Promoters", slug: "edm-concert-promoters" },
            { name: "Latin Concert Promoters", slug: "latin-concert-promoters" },
            { name: "Country Concert Promoters", slug: "country-concert-promoters" },
            { name: "Jazz & Blues Concert Promoters", slug: "jazz-and-blues-concert-promoters" },
            { name: "Comedy Show Promoters", slug: "comedy-show-promoters" },
            { name: "Family Show Promoters (Disney, kids acts)", slug: "family-show-promoters" }
          ]
      },
      {
        name: "Magicians & Illusionists",
        slug: "magicians",
        level3: [
            { name: "Close-Up Magicians (strolling, table-to-table)", slug: "close-up-magicians" },
            { name: "Stage Magicians (large shows, 30-60 min)", slug: "stage-magicians" },
            { name: "Parlor Magicians (small room, seated)", slug: "parlor-magicians" },
            { name: "Mentalists (mind reading, predictions)", slug: "mentalists" },
            { name: "Comedy Magicians (jokes + tricks)", slug: "comedy-magicians" },
            { name: "Kid Magicians (balloons, fun, clean)", slug: "kid-magicians" },
            { name: "Grand Illusionists (large props, assistants)", slug: "grand-illusionists" },
            { name: "Card Magic Specialists", slug: "card-magic-specialists" },
            { name: "Escape Artists", slug: "escape-artists" },
            { name: "Kid's Birthday Magicians", slug: "kids-birthday-magicians" },
            { name: "Wedding Magicians (cocktail hour strolling)", slug: "wedding-magicians" },
            { name: "Corporate Event Magicians", slug: "corporate-event-magicians" },
            { name: "Virtual Magicians (Zoom shows)", slug: "virtual-magicians" }
          ]
      },
      {
        name: "Party Characters & Entertainers",
        slug: "party-characters",
        level3: [
            { name: "Princess Characters (Elsa, Anna, Cinderella style)", slug: "princess-characters" },
            { name: "Superhero Characters (Spider-Man, Batman, Wonder Woman)", slug: "superhero-characters" },
            { name: "Fairy Characters (wings, wand, glitter)", slug: "fairy-characters" },
            { name: "Unicorn Characters", slug: "unicorn-characters" },
            { name: "Dinosaur Characters (costume)", slug: "dinosaur-characters" },
            { name: "Animal Mascots (bunny, bear, monkey, dog)", slug: "animal-mascots" },
            { name: "Clowns (classic, modern, non-scary)", slug: "clowns" },
            { name: "Pirates", slug: "pirates" },
            { name: "Cowboys/Cowgirls", slug: "cowboys-cowgirls" },
            { name: "Mad Scientists (experiments)", slug: "mad-scientists" },
            { name: "Mermaids", slug: "mermaids" },
            { name: "Ninja Turtles", slug: "ninja-turtles" },
            { name: "Star Wars Characters (Jedi, Darth Vader)", slug: "star-wars-characters" },
            { name: "Marvel Characters", slug: "marvel-characters" },
            { name: "DC Characters", slug: "dc-characters" },
            { name: "Disney Characters (generic)", slug: "disney-characters" },
            { name: "Sesame Street Characters (generic)", slug: "sesame-street-characters" },
            { name: "Paw Patrol Characters (generic)", slug: "paw-patrol-characters" },
            { name: "Peppa Pig Characters (generic)", slug: "peppa-pig-characters" },
            { name: "Bluey Characters (generic)", slug: "bluey-characters" },
            { name: "Face Painters (can be standalone or with character)", slug: "face-painters" },
            { name: "Balloon Twisters (can be standalone or with character)", slug: "balloon-twisters" },
            { name: "Glitter Tattoo Artists", slug: "glitter-tattoo-artists" }
          ]
      },
      {
        name: "Comedians",
        slug: "comedians",
        level3: [
            { name: "Stand-Up Comedians", slug: "stand-up-comedians",
              level4: [{ name: "Clean Comedians (family-friendly, no profanity)", slug: "clean-comedians" }, { name: "Blue Comedians (adult content)", slug: "blue-comedians" }, { name: "Political Comedians", slug: "political-comedians" }, { name: "Observational Comedians", slug: "observational-comedians" }, { name: "One-Liner Comedians", slug: "one-liner-comedians" }, { name: "Storytelling Comedians", slug: "storytelling-comedians" }, { name: "Improv Comedians", slug: "improv-comedians" }, { name: "Sketch Comedians", slug: "sketch-comedians" }, { name: "Roast Comedians", slug: "roast-comedians" }, { name: "Dark Comedians", slug: "dark-comedians" }, { name: "Surreal Comedians", slug: "surreal-comedians" }] },
            { name: "Other Comedians", slug: "other-comedians" },
            { name: "Improv Troupes", slug: "improv-troupes" },
            { name: "Comedy Magicians (cross-over with magicians)", slug: "comedy-magicians" },
            { name: "Corporate Comedians (clean, professional)", slug: "corporate-comedians" },
            { name: "Wedding Comedians (roast the couple tastefully)", slug: "wedding-comedians" },
            { name: "Emcee Comedians (hosting events)", slug: "emcee-comedians" },
            { name: "Roastmasters", slug: "roastmasters" },
            { name: "Female Comedians", slug: "female-comedians" },
            { name: "Black Comedians", slug: "black-comedians" },
            { name: "Latin Comedians", slug: "latin-comedians" },
            { name: "LGBTQ+ Comedians", slug: "lgbtqplus-comedians" }
          ]
      },
      {
        name: "Karaoke Hosts (KJs)",
        slug: "karaoke-hosts",
        level3: [
            { name: "Public Stage Karaoke Hosts (bar, event)", slug: "public-stage-karaoke-hosts" },
            { name: "Private Room Karaoke Hosts (party)", slug: "private-room-karaoke-hosts" },
            { name: "Mobile Karaoke (brings equipment to your location)", slug: "mobile-karaoke" },
            { name: "Bilingual Karaoke Hosts (Spanish/English, etc.)", slug: "bilingual-karaoke-hosts" },
            { name: "Theme Karaoke Hosts (80s, Disney, Broadway)", slug: "theme-karaoke-hosts" },
            { name: "Competition Karaoke Hosts (singing contests)", slug: "competition-karaoke-hosts" },
            { name: "Kid-Friendly Karaoke Hosts (clean songs only)", slug: "kid-friendly-karaoke-hosts" }
          ]
      },
      {
        name: "Trivia Hosts",
        slug: "trivia-hosts",
        level3: [
            { name: "General Knowledge Trivia Hosts", slug: "general-knowledge-trivia-hosts" },
            { name: "Music Trivia (80s, 90s, classic rock, etc.)", slug: "music-trivia" },
            { name: "TV Show Trivia (The Office, Friends, etc.)", slug: "tv-show-trivia" },
            { name: "Movie Trivia (Marvel, Harry Potter, Star Wars)", slug: "movie-trivia" },
            { name: "Sports Trivia", slug: "sports-trivia" },
            { name: "History Trivia", slug: "history-trivia" },
            { name: "Pop Culture Trivia", slug: "pop-culture-trivia" },
            { name: "Harry Potter Trivia", slug: "harry-potter-trivia" },
            { name: "Disney Trivia", slug: "disney-trivia" },
            { name: "Marvel Trivia", slug: "marvel-trivia" },
            { name: "Star Wars Trivia", slug: "star-wars-trivia" },
            { name: "The Office Trivia", slug: "the-office-trivia" },
            { name: "Friends Trivia", slug: "friends-trivia" },
            { name: "Taylor Swift Trivia", slug: "taylor-swift-trivia" },
            { name: "Beyoncé Trivia", slug: "beyonc-trivia" },
            { name: "Music Bingo Hosts (song clips + bingo)", slug: "music-bingo-hosts" },
            { name: "Speed Trivia Hosts (fast-paced)", slug: "speed-trivia-hosts" },
            { name: "Corporate Trivia Hosts (team building)", slug: "corporate-trivia-hosts" },
            { name: "Virtual Trivia Hosts (Zoom)", slug: "virtual-trivia-hosts" }
          ]
      },
      {
        name: "Interactive Events",
        slug: "interactive",
        level3: [
            { name: "Murder Mystery Parties", slug: "murder-mystery-parties",
              level4: [{ name: "Hosted Murder Mystery (actor plays detective)", slug: "hosted-murder-mystery" }, { name: "Boxed Murder Mystery (you host yourself)", slug: "boxed-murder-mystery" }, { name: "Corporate Murder Mystery (team building)", slug: "corporate-murder-mystery" }, { name: "Wedding Murder Mystery (rehearsal dinner)", slug: "wedding-murder-mystery" }] },
            { name: "Escape Room Events", slug: "escape-room-experiences",
              level4: [{ name: "Pop-Up Escape Rooms (temporary at your event)", slug: "pop-up-escape-rooms" }, { name: "Mobile Escape Rooms (trailer/truck comes to you)", slug: "mobile-escape-rooms" }, { name: "Team Building Escape Rooms", slug: "team-building-escape-rooms" }, { name: "Birthday Party Escape Rooms", slug: "birthday-party-escape-rooms" }] },
            { name: "Other Interactive Events", slug: "other-interactive-experiences" },
            { name: "Game Truck Parties (video game theater on wheels)", slug: "game-truck-parties" },
            { name: "Axe Throwing (mobile axe throwing trailer)", slug: "axe-throwing" },
            { name: "Virtual Reality (VR) Party Trucks", slug: "virtual-reality-party-trucks" },
            { name: "Laser Tag (mobile laser tag arena)", slug: "laser-tag" },
            { name: "Bubble Soccer (inflatable bubble suits)", slug: "bubble-soccer" },
            { name: "Archery Tag (bow and arrow tag)", slug: "archery-tag" },
            { name: "Paintball (mobile paintball course)", slug: "paintball" },
            { name: "Gel Blaster Parties (low-impact)", slug: "gel-blaster-parties" },
            { name: "Ninja Warrior Courses (inflatable obstacle course)", slug: "ninja-warrior-courses" },
            { name: "Mechanical Bull Rentals", slug: "mechanical-bull-rentals" },
            { name: "Bounce House & Inflatable Rentals (also under Equipment)", slug: "bounce-house-and-inflatable-rentals" },
            { name: "Obstacle Course Rentals", slug: "obstacle-course-rentals" }
          ]
      }
    ]
  },
    {
    name: "PRODUCTION & TECH",
    slug: "production-tech",
    description: "",
    level2: [
      {
        name: "Photography",
        slug: "photography",
        level3: [
            { name: "Wedding Photographers", slug: "wedding-photographers",
              level4: [{ name: "Fine Art Wedding Photographers (editorial style)", slug: "fine-art-wedding-photographers" }, { name: "Photojournalistic Wedding Photographers (documentary)", slug: "photojournalistic-wedding-photographers" }, { name: "Traditional Wedding Photographers (posed, formal)", slug: "traditional-wedding-photographers" }, { name: "Dark & Moody Wedding Photographers", slug: "dark-and-moody-wedding-photographers" }, { name: "Bright & Airy Wedding Photographers", slug: "bright-and-airy-wedding-photographers" }, { name: "Vintage Film Wedding Photographers (35mm, medium format)", slug: "vintage-film-wedding-photographers" }, { name: "Black & White Wedding Photographers (specialist)", slug: "black-and-white-wedding-photographers" }, { name: "Elopement Photographers (small ceremonies)", slug: "elopement-photographers" }, { name: "Destination Wedding Photographers (travel)", slug: "destination-wedding-photographers" }, { name: "Luxury Wedding Photographers (premium)", slug: "luxury-wedding-photographers" }, { name: "Budget Wedding Photographers (affordable)", slug: "budget-wedding-photographers" }, { name: "LGBTQ+ Wedding Photographers", slug: "lgbtqplus-wedding-photographers" }, { name: "South Asian Wedding Photographers (Bollywood style)", slug: "south-asian-wedding-photographers" }, { name: "Latin Wedding Photographers", slug: "latin-wedding-photographers" }, { name: "African American Wedding Photographers (skin tone expertise)", slug: "african-american-wedding-photographers" }] },
            { name: "Event Photographers", slug: "event-photographers",
              level4: [{ name: "Corporate Event Photographers", slug: "corporate-event-photographers" }, { name: "Gala & Fundraiser Photographers", slug: "gala-and-fundraiser-photographers" }, { name: "Conference & Summit Photographers", slug: "conference-and-summit-photographers" }, { name: "Concert & Festival Photographers", slug: "concert-and-festival-photographers" }, { name: "Party Photographers (birthday, anniversary)", slug: "party-photographers" }, { name: "Sports Event Photographers", slug: "sports-event-photographers" }, { name: "Red Carpet Photographers", slug: "red-carpet-photographers" }] },
            { name: "Portrait Photographers", slug: "portrait-photographers",
              level4: [{ name: "Family Portrait Photographers", slug: "family-portrait-photographers" }, { name: "Maternity Photographers", slug: "maternity-photographers" }, { name: "Newborn Photographers", slug: "newborn-photographers" }, { name: "Senior Portrait Photographers (high school)", slug: "senior-portrait-photographers" }, { name: "Headshot Photographers (corporate, acting, LinkedIn)", slug: "headshot-photographers" }, { name: "Branding Photographers (small business)", slug: "branding-photographers" }, { name: "Boudoir Photographers", slug: "boudoir-photographers" }, { name: "Engagement Photographers (couples, pre-wedding)", slug: "engagement-photographers" }, { name: "Couples Photographers (anniversary, dating)", slug: "couples-photographers" }, { name: "Quinceañera Portrait Photographers", slug: "quinceaera-portrait-photographers" }, { name: "Sweet 16 Portrait Photographers", slug: "sweet-16-portrait-photographers" }] },
            { name: "Affordable Photographers (budget-friendly)", slug: "affordable-photographers",
              level4: [{ name: "Under $500", slug: "under-500" }, { name: "$500-$1000", slug: "500-1000" }, { name: "$1000-$2000", slug: "1000-2000" }, { name: "Student Photographers (emerging talent)", slug: "student-photographers" }, { name: "Amateur Photographers (building portfolio)", slug: "amateur-photographers" }, { name: "Hourly Rate Photographers (no packages)", slug: "hourly-rate-photographers" }, { name: "Digital-Only Photographers (no prints)", slug: "digital-only-photographers" }] },
            { name: "Real Estate & Venue Photographers (for vendor listings)", slug: "real-estate-and-venue-photographers" },
            { name: "Product Photographers", slug: "product-photographers" },
            { name: "Food Photographers (for caterers, restaurants)", slug: "food-photographers" }
          ]
      },
      {
        name: "Videography",
        slug: "videography",
        level3: [
            { name: "Wedding Videographers", slug: "wedding-videographers",
              level4: [{ name: "Cinematic Wedding Videographers (movie-style highlight films)", slug: "cinematic-wedding-videographers" }, { name: "Documentary Wedding Videographers (full ceremony + speeches)", slug: "documentary-wedding-videographers" }, { name: "Same-Day Edit Videographers (edit shown at reception)", slug: "same-day-edit-videographers" }, { name: "Super 8 & Vintage Film Videographers", slug: "super-8-and-vintage-film-videographers" }, { name: "Drone-Only Wedding Videographers (aerial only)", slug: "drone-only-wedding-videographers" }, { name: "Raw Footage Wedding Videographers (unedited)", slug: "raw-footage-wedding-videographers" }, { name: "Highlight Reel Only Wedding Videographers (3-5 min)", slug: "highlight-reel-only-wedding-videographers" }, { name: "Full Feature Wedding Videographers (30-60 min)", slug: "full-feature-wedding-videographers" }, { name: "LGBTQ+ Wedding Videographers", slug: "lgbtqplus-wedding-videographers" }, { name: "Cultural Wedding Videographers (Indian, Latin, etc.)", slug: "cultural-wedding-videographers" }] },
            { name: "Event Videographers", slug: "event-videographers",
              level4: [{ name: "Corporate Event Videographers", slug: "corporate-event-videographers" }, { name: "Conference & Summit Videographers", slug: "conference-and-summit-videographers" }, { name: "Concert & Festival Videographers", slug: "concert-and-festival-videographers" }, { name: "Gala & Fundraiser Videographers", slug: "gala-and-fundraiser-videographers" }, { name: "Sports Event Videographers", slug: "sports-event-videographers" }, { name: "Live Streaming Event Videographers (multi-camera)", slug: "live-streaming-event-videographers" }] },
            { name: "Commercial & Brand Videographers", slug: "commercial-and-brand-videographers" },
            { name: "Drone Videographers (aerial footage only)", slug: "drone-videographers" }
          ]
      },
      {
        name: "Photo Booths",
        slug: "photo-booths",
        level3: [
            { name: "360 Photo Booths (slow-motion video booth)", slug: "360-photo-booths" },
            { name: "GIF Photo Booths (animated looping GIFs)", slug: "gif-photo-booths" },
            { name: "Enclosed Photo Booths (privacy, classic)", slug: "enclosed-photo-booths" },
            { name: "Open-Air Photo Booths (backdrop, more space)", slug: "open-air-photo-booths" },
            { name: "Mirror Photo Booths (touchscreen mirror)", slug: "mirror-photo-booths" },
            { name: "iPad Photo Booths (DIY, budget)", slug: "ipad-photo-booths" },
            { name: "Glitter & Confetti Photo Booths", slug: "glitter-and-confetti-photo-booths" },
            { name: "Green Screen Photo Booths (virtual backgrounds)", slug: "green-screen-photo-booths" },
            { name: "Slow-Motion Video Booths (360 or flat)", slug: "slow-motion-video-booths" },
            { name: "Halo Ring Light Photo Booths (selfie style)", slug: "halo-ring-light-photo-booths" },
            { name: "Vintage Photo Booths (film strip prints)", slug: "vintage-photo-booths" },
            { name: "Themed Photo Booths (holiday, costume props)", slug: "themed-photo-booths" },
            { name: "Wedding Photo Booths", slug: "wedding-photo-booths" },
            { name: "Birthday Party Photo Booths", slug: "birthday-party-photo-booths" },
            { name: "Corporate Event Photo Booths", slug: "corporate-event-photo-booths" }
          ]
      },
      {
        name: "Lighting & Stage Production",
        slug: "lighting-stage",
        level3: [
            { name: "Uplighting (wall washing, color changing)", slug: "uplighting" },
            { name: "Pin Spotting (centerpieces, cakes, head tables)", slug: "pin-spotting" },
            { name: "Gobo & Monogram Lighting (projected logos, names)", slug: "gobo-and-monogram-lighting" },
            { name: "Dance Floor Lighting (moving heads, lasers, strobes)", slug: "dance-floor-lighting" },
            { name: "Stage Lighting (front wash, backlight, spotlights)", slug: "stage-lighting" },
            { name: "Concert Lighting (full production rig)", slug: "concert-lighting" },
            { name: "String & Bistro Lighting (ambient outdoor)", slug: "string-and-bistro-lighting" },
            { name: "Chandelier & Crystal Lighting (rental)", slug: "chandelier-and-crystal-lighting" },
            { name: "LED Dance Floors (light-up floor)", slug: "led-dance-floors" },
            { name: "Moonlighting (tent ceiling with draped fabric + lights)", slug: "moonlighting" },
            { name: "Mirror Ball & Disco Lighting", slug: "mirror-ball-and-disco-lighting" },
            { name: "Black Light / UV Lighting (glow parties)", slug: "black-light-uv-lighting" },
            { name: "Truss & Rigging (structural support for lights)", slug: "truss-and-rigging" },
            { name: "Stage Risers & Platforms", slug: "stage-risers-and-platforms" },
            { name: "Catwalks & Runways (fashion shows)", slug: "catwalks-and-runways" },
            { name: "Staging for Bands (drum risers, monitor placement)", slug: "staging-for-bands" }
          ]
      },
      {
        name: "AV & Sound Technicians",
        slug: "av-sound",
        level3: [
            { name: "PA System Rentals (speakers, mixer, mics)", slug: "pa-system-rentals" },
            { name: "Wireless Microphone Rentals (lapel, handheld)", slug: "wireless-microphone-rentals" },
            { name: "Sound System for Ceremonies (outdoor, clear vocals)", slug: "sound-system-for-ceremonies" },
            { name: "Sound System for Concerts (high volume, subwoofers)", slug: "sound-system-for-concerts" },
            { name: "Sound System for Corporate Events (speeches, presentations)", slug: "sound-system-for-corporate-events" },
            { name: "Sound System for Parties (DJ setup, background music)", slug: "sound-system-for-parties" },
            { name: "Line Array Systems (large venues, concerts)", slug: "line-array-systems" },
            { name: "Monitor Speakers (for performers on stage)", slug: "monitor-speakers" },
            { name: "AV Technicians (day-of sound engineer)", slug: "av-technicians" },
            { name: "Live Sound Mixing (board operator)", slug: "live-sound-mixing" },
            { name: "Recording Services (multi-track, podcast, video)", slug: "recording-services" },
            { name: "Video Projection & Screen Rentals", slug: "video-projection-and-screen-rentals" },
            { name: "Live Streaming Setups (multi-camera, encoder)", slug: "live-streaming-setups" },
            { name: "Teleprompter Rentals (speeches, presentations)", slug: "teleprompter-rentals" },
            { name: "Hearing Loop Systems (ADA compliance)", slug: "hearing-loop-systems" }
          ]
      },
      {
        name: "Drone Photography & Videography",
        slug: "drone",
        level3: [
            { name: "Drone Wedding Photography (aerial ceremony shots)", slug: "drone-wedding-photography" },
            { name: "Drone Wedding Videography (aerial highlight reels)", slug: "drone-wedding-videography" },
            { name: "Drone Corporate Event Coverage", slug: "drone-corporate-event-coverage" },
            { name: "Drone Real Estate Photography (for venue listings)", slug: "drone-real-estate-photography" },
            { name: "Drone Festival Coverage (large events)", slug: "drone-festival-coverage" },
            { name: "Drone Concert Coverage (outdoor venues)", slug: "drone-concert-coverage" },
            { name: "Drone Sunset Shots (golden hour)", slug: "drone-sunset-shots" },
            { name: "FAA Part 107 Certified Drone Pilots", slug: "faa-part-107-certified-drone-pilots" },
            { name: "Drone Only Packages (no ground photography)", slug: "drone-only-packages" }
          ]
      },
      {
        name: "Camera & Equipment Rental",
        slug: "camera-rental",
        level3: [
            { name: "Camera Body Rentals (Canon, Sony, Nikon, Fuji, Red)", slug: "camera-body-rentals" },
            { name: "Lens Rentals (wide, telephoto, prime, zoom, macro)", slug: "lens-rentals" },
            { name: "Lighting Equipment Rentals (strobes, LED, continuous)", slug: "lighting-equipment-rentals" },
            { name: "Audio Equipment Rentals (mics, recorders, wireless)", slug: "audio-equipment-rentals" },
            { name: "Grip & Support Rentals (tripods, gimbals, sliders)", slug: "grip-and-support-rentals" },
            { name: "Drone Rentals (with or without pilot)", slug: "drone-rentals" },
            { name: "Underwater Housing Rentals", slug: "underwater-housing-rentals" },
            { name: "Lens Filter Rentals (ND, polarizer, mist)", slug: "lens-filter-rentals" },
            { name: "Battery & Charger Rentals", slug: "battery-and-charger-rentals" },
            { name: "Memory Card Rentals", slug: "memory-card-rentals" },
            { name: "Professional Camera Backpack Rentals", slug: "professional-camera-backpack-rentals" }
          ]
      }
    ]
  },
    {
    name: "DECOR & RENTALS",
    slug: "decor-rentals",
    description: "",
    level2: [
      {
        name: "Florists & Floral Designers",
        slug: "florists",
        level3: [
            { name: "Wedding Florists", slug: "wedding-florists",
              level4: [{ name: "Bridal Bouquet Specialists", slug: "bridal-bouquet-specialists" }, { name: "Bridesmaid Bouquet Specialists", slug: "bridesmaid-bouquet-specialists" }, { name: "Boutonniere & Corsage Specialists", slug: "boutonniere-and-corsage-specialists" }, { name: "Ceremony Arch & Altar Florists", slug: "ceremony-arch-and-altar-florists" }, { name: "Reception Centerpiece Florists", slug: "reception-centerpiece-florists" }, { name: "Aisle & Pew Florists", slug: "aisle-and-pew-florists" }, { name: "Flower Wall Installations", slug: "flower-wall-installations" }, { name: "Hanging Floral Installations (ceiling)", slug: "hanging-floral-installations" }, { name: "Floral Chandeliers", slug: "floral-chandeliers" }] },
            { name: "Event Florists", slug: "event-florists",
              level4: [{ name: "Corporate Event Florists", slug: "corporate-event-florists" }, { name: "Gala & Fundraiser Florists", slug: "gala-and-fundraiser-florists" }, { name: "Birthday Party Florists", slug: "birthday-party-florists" }, { name: "Anniversary Party Florists", slug: "anniversary-party-florists" }, { name: "Baby Shower Florists", slug: "baby-shower-florists" }, { name: "Bridal Shower Florists", slug: "bridal-shower-florists" }, { name: "Holiday Florists (Christmas, Thanksgiving)", slug: "holiday-florists" }] },
            { name: "Other Florists", slug: "other-florists" },
            { name: "Everyday Florists (retail, delivery)", slug: "everyday-florists" },
            { name: "Dried & Preserved Flower Florists", slug: "dried-and-preserved-flower-florists" },
            { name: "Silk & Artificial Flower Florists", slug: "silk-and-artificial-flower-florists" },
            { name: "Eco-Friendly & Sustainable Florists (no floral foam, locally grown)", slug: "eco-friendly-and-sustainable-florists" },
            { name: "Luxury Florists (premium blooms, high-end)", slug: "luxury-florists" },
            { name: "Budget Florists (affordable arrangements)", slug: "budget-florists" },
            { name: "DIY Flower Suppliers (bulk flowers, you arrange)", slug: "diy-flower-suppliers" },
            { name: "Flower Delivery Only (no design services)", slug: "flower-delivery-only" }
          ]
      },
      {
        name: "Party Decorators",
        slug: "party-decorators",
        level3: [
            { name: "Themed Party Decorators", slug: "themed-party-decorators",
              level4: [{ name: "Birthday Party Decorators (kids, adult, milestone)", slug: "birthday-party-decorators" }, { name: "Baby Shower Decorators (gender neutral, specific themes)", slug: "baby-shower-decorators" }, { name: "Bridal Shower Decorators (bridal theme)", slug: "bridal-shower-decorators" }, { name: "Bachelorette Party Decorators (penis decor, sashes, etc.)", slug: "bachelorette-party-decorators" }, { name: "Bachelor Party Decorators", slug: "bachelor-party-decorators" }, { name: "Anniversary Party Decorators", slug: "anniversary-party-decorators" }, { name: "Graduation Party Decorators", slug: "graduation-party-decorators" }, { name: "Retirement Party Decorators", slug: "retirement-party-decorators" }, { name: "Holiday Party Decorators (Christmas, Halloween, NYE)", slug: "holiday-party-decorators" }, { name: "Quinceañera Decorators", slug: "quinceaera-decorators" }, { name: "Sweet 16 Decorators", slug: "sweet-16-decorators" }, { name: "Bar/Bat Mitzvah Decorators", slug: "bar-bat-mitzvah-decorators" }] },
            { name: "Other Party Decorators", slug: "other-party-decorators" },
            { name: "Backdrop & Photo Wall Decorators (step-and-repeat, floral walls)", slug: "backdrop-and-photo-wall-decorators" },
            { name: "Table Decorators (centerpieces, runners, place settings)", slug: "table-decorators" },
            { name: "Ceiling Decorators (draping, lanterns, hanging flowers)", slug: "ceiling-decorators" },
            { name: "Entrance & Walkway Decorators (arches, balloons, signage)", slug: "entrance-and-walkway-decorators" },
            { name: "Dessert Table & Candy Buffet Decorators", slug: "dessert-table-and-candy-buffet-decorators" },
            { name: "Gift Table & Card Box Decorators", slug: "gift-table-and-card-box-decorators" }
          ]
      },
      {
        name: "Balloon Artists & Installations",
        slug: "balloon-artists",
        level3: [
            { name: "Balloon Arches", slug: "balloon-arches" },
            { name: "Balloon Garlands", slug: "balloon-garlands" },
            { name: "Balloon Columns", slug: "balloon-columns" },
            { name: "Balloon Bouquets", slug: "balloon-bouquets" },
            { name: "Balloon Ceilings (filled ceiling)", slug: "balloon-ceilings" },
            { name: "Balloon Drops (net with balloons)", slug: "balloon-drops" },
            { name: "Confetti Balloons (filled with confetti)", slug: "confetti-balloons" },
            { name: "Light-Up LED Balloons", slug: "light-up-led-balloons" },
            { name: "Giant Number Balloons (age, anniversary year)", slug: "giant-number-balloons" },
            { name: "Letter Balloons (spelling names, LOVE, BABY)", slug: "letter-balloons" },
            { name: "Organic Balloon Arches (varying sizes, natural look)", slug: "organic-balloon-arches" },
            { name: "Standard Balloon Arches (uniform)", slug: "standard-balloon-arches" },
            { name: "Balloon Walls (flat wall of balloons)", slug: "balloon-walls" },
            { name: "Balloon Centerpieces", slug: "balloon-centerpieces" },
            { name: "Balloon Delivery Only (DIY setup)", slug: "balloon-delivery-only" }
          ]
      },
      {
        name: "Furniture & Linen Rentals",
        slug: "furniture-linens",
        level3: [
            { name: "Table Rentals", slug: "table-rentals",
              level4: [{ name: "Round Tables (48\", 60\", 72\")", slug: "round-tables" }, { name: "Rectangle Tables (6ft, 8ft)", slug: "rectangle-tables" }, { name: "Square Tables", slug: "square-tables" }, { name: "Cocktail Tables (high-top, 30\" round, 42\" tall)", slug: "cocktail-tables" }, { name: "Serpentine Tables (curved)", slug: "serpentine-tables" }, { name: "Children's Tables (low height)", slug: "childrens-tables" }] },
            { name: "Chair Rentals", slug: "chair-rentals",
              level4: [{ name: "Folding Chairs (basic, metal, plastic)", slug: "folding-chairs" }, { name: "Chiavari Chairs (wood, elegant, wedding)", slug: "chiavari-chairs" }, { name: "Cross-Back Chairs (rustic, farmhouse)", slug: "cross-back-chairs" }, { name: "Ghost Chairs (acrylic, modern)", slug: "ghost-chairs" }, { name: "Banquet Chairs (padded, upholstered)", slug: "banquet-chairs" }, { name: "King & Queen Throne Chairs (sweet 16, quince)", slug: "king-and-queen-throne-chairs" }, { name: "Bar Stools (30\")", slug: "bar-stools" }, { name: "Lounge Chairs & Sofas (for lounge areas)", slug: "lounge-chairs-and-sofas" }, { name: "Bench Rentals (backless, with back)", slug: "bench-rentals" }] },
            { name: "Lounge Furniture Rentals", slug: "lounge-furniture-rentals",
              level4: [{ name: "Sofas (2-3 seat)", slug: "sofas" }, { name: "Love Seats (2 seat)", slug: "love-seats" }, { name: "Armchairs", slug: "armchairs" }, { name: "Coffee Tables", slug: "coffee-tables" }, { name: "Side Tables", slug: "side-tables" }, { name: "Ottomans & Poufs", slug: "ottomans-and-poufs" }] },
            { name: "Linen Rentals", slug: "linen-rentals",
              level4: [{ name: "Tablecloths (round, rectangle, square)", slug: "tablecloths" }, { name: "Table Runners", slug: "table-runners" }, { name: "Napkins (dinner, cocktail, beverage)", slug: "napkins" }, { name: "Chair Covers (stretch, spandex)", slug: "chair-covers" }, { name: "Chair Sashes (ties, bands, bows)", slug: "chair-sashes" }, { name: "Backdrop Drapes (fabric for walls)", slug: "backdrop-drapes" }, { name: "Skirting (buffet tables, DJ tables)", slug: "skirting" }, { name: "Overlays (small cloth on top of tablecloth)", slug: "overlays" }] },
            { name: "Linen Colors", slug: "linen-colors" },
            { name: "White, Ivory, Champagne", slug: "white-ivory-champagne" },
            { name: "Blush, Dusty Rose, Burgundy", slug: "blush-dusty-rose-burgundy" },
            { name: "Navy, Emerald, Sage, Dusty Blue", slug: "navy-emerald-sage-dusty-blue" },
            { name: "Black, Gray, Silver, Gold, Rose Gold", slug: "black-gray-silver-gold-rose-gold" },
            { name: "Patterned (floral, stripe, checkered, plaid)", slug: "patterned" },
            { name: "Linen Fabrics", slug: "linen-fabrics" },
            { name: "Polyester (wrinkle-resistant)", slug: "polyester" },
            { name: "Cotton (breathable, wrinkles)", slug: "cotton" },
            { name: "Linen (textured, elegant)", slug: "linen" },
            { name: "Satin (shiny, formal)", slug: "satin" },
            { name: "Velvet (luxury, winter)", slug: "velvet" },
            { name: "Sequin (sparkly, glam)", slug: "sequin" },
            { name: "Lace (vintage, overlay)", slug: "lace" },
            { name: "Burlap (rustic)", slug: "burlap" },
            { name: "Spandex (stretch, chair covers)", slug: "spandex" }
          ]
      },
      {
        name: "Tent & Outdoor Rentals",
        slug: "tent-rentals",
        level3: [
            { name: "Pole Tents (classic, center poles, requires stakes)", slug: "pole-tents" },
            { name: "Frame Tents (no center poles, any surface)", slug: "frame-tents" },
            { name: "Sailcloth Tents (translucent, elegant)", slug: "sailcloth-tents" },
            { name: "Clear Top Tents (see-through roof)", slug: "clear-top-tents" },
            { name: "Stretch Tents (modern, flexible)", slug: "stretch-tents" },
            { name: "Pop-Up Canopies (10x10, 10x20, small events)", slug: "pop-up-canopies" },
            { name: "Marquee Tents (traditional, frame, sidewalls)", slug: "marquee-tents" },
            { name: "High Peak Tents (dramatic tall center)", slug: "high-peak-tents" },
            { name: "Pagoda Tents (Asian-inspired, multi-tiered)", slug: "pagoda-tents" },
            { name: "Sidewalls (clear vinyl, solid, mesh, half-wall)", slug: "sidewalls" },
            { name: "Tent Flooring (plywood, interlocking tiles)", slug: "tent-flooring" },
            { name: "Tent Heating (propane, electric)", slug: "tent-heating" },
            { name: "Tent Cooling (AC, fans, misters)", slug: "tent-cooling" },
            { name: "Tent Lighting (string lights, chandeliers, uplighting)", slug: "tent-lighting" },
            { name: "Tent Anchoring (stakes, weights, screws)", slug: "tent-anchoring" },
            { name: "Tent Permitting Assistance (for large tents over 400 sq ft)", slug: "tent-permitting-assistance" }
          ]
      },
      {
        name: "Party Supplies & Favors",
        slug: "party-supplies",
        level3: [
            { name: "Disposable Tableware", slug: "disposable-tableware",
              level4: [{ name: "Plates (paper, plastic, bamboo, compostable)", slug: "plates" }, { name: "Cups (paper, plastic, reusable)", slug: "cups" }, { name: "Cutlery (plastic, bamboo, compostable)", slug: "cutlery" }, { name: "Napkins (paper, cloth)", slug: "napkins" }] },
            { name: "Serving Supplies", slug: "serving-supplies",
              level4: [{ name: "Serving Platters & Trays (disposable, reusable)", slug: "serving-platters-and-trays" }, { name: "Serving Bowls", slug: "serving-bowls" }, { name: "Serving Utensils (spoons, tongs, ladles)", slug: "serving-utensils" }, { name: "Chafing Dishes & Fuel (buffet warmers)", slug: "chafing-dishes-and-fuel" }] },
            { name: "Party Favors", slug: "party-favors",
              level4: [{ name: "Edible Favors (candy, cookies, chocolate, popcorn, honey)", slug: "edible-favors" }, { name: "Drinkable Favors (mini liquor bottle, custom soda)", slug: "drinkable-favors" }, { name: "Practical Favors (candle, soap, lip balm, seed packet)", slug: "practical-favors" }, { name: "Keepsake Favors (ornament, photo frame, engraved item)", slug: "keepsake-favors" }, { name: "Toy Favors (bubbles, stickers, crayons, slime)", slug: "toy-favors" }, { name: "Plantable Favors (seed paper, succulent)", slug: "plantable-favors" }, { name: "Charitable Favors (donation card in guest's name)", slug: "charitable-favors" }, { name: "Custom Swag Favors (tote bag, koozie, sunglasses)", slug: "custom-swag-favors" }] },
            { name: "Favor Packaging", slug: "favor-packaging",
              level4: [{ name: "Favor Boxes", slug: "favor-boxes" }, { name: "Favor Bags (organza, paper, cellophane)", slug: "favor-bags" }, { name: "Favor Tins & Jars", slug: "favor-tins-and-jars" }, { name: "Favor Tags & Stickers", slug: "favor-tags-and-stickers" }] },
            { name: "Themed Party Supplies (by event type)", slug: "themed-party-supplies" },
            { name: "Birthday Party Supplies", slug: "birthday-party-supplies" },
            { name: "Baby Shower Supplies", slug: "baby-shower-supplies" },
            { name: "Bridal Shower Supplies", slug: "bridal-shower-supplies" },
            { name: "Wedding Supplies", slug: "wedding-supplies" },
            { name: "Bachelorette Party Supplies", slug: "bachelorette-party-supplies" },
            { name: "Bachelor Party Supplies", slug: "bachelor-party-supplies" },
            { name: "Graduation Party Supplies", slug: "graduation-party-supplies" },
            { name: "Retirement Party Supplies", slug: "retirement-party-supplies" },
            { name: "Anniversary Party Supplies", slug: "anniversary-party-supplies" },
            { name: "Holiday Party Supplies (Christmas, Halloween, etc.)", slug: "holiday-party-supplies" }
          ]
      },
      {
        name: "Stationery, Invitations & Signage",
        slug: "stationery",
        level3: [
            { name: "Invitations", slug: "invitations",
              level4: [{ name: "Wedding Invitations", slug: "wedding-invitations" }, { name: "Birthday Party Invitations", slug: "birthday-party-invitations" }, { name: "Baby Shower Invitations", slug: "baby-shower-invitations" }, { name: "Bridal Shower Invitations", slug: "bridal-shower-invitations" }, { name: "Bachelorette Party Invitations", slug: "bachelorette-party-invitations" }, { name: "Bachelor Party Invitations", slug: "bachelor-party-invitations" }, { name: "Graduation Party Invitations", slug: "graduation-party-invitations" }, { name: "Anniversary Party Invitations", slug: "anniversary-party-invitations" }, { name: "Corporate Event Invitations", slug: "corporate-event-invitations" }, { name: "Holiday Party Invitations", slug: "holiday-party-invitations" }] },
            { name: "Save the Dates", slug: "save-the-dates" },
            { name: "RSVP Cards", slug: "rsvp-cards" },
            { name: "Thank You Cards", slug: "thank-you-cards" },
            { name: "Enclosure Cards (accommodations, directions, registry)", slug: "enclosure-cards" },
            { name: "Menus (place cards, table menus)", slug: "menus" },
            { name: "Place Cards & Escort Cards", slug: "place-cards-and-escort-cards" },
            { name: "Table Numbers", slug: "table-numbers" },
            { name: "Programs (wedding ceremony, event schedule)", slug: "programs" },
            { name: "Signage", slug: "signage",
              level4: [{ name: "Welcome Signs", slug: "welcome-signs" }, { name: "Bar Signs", slug: "bar-signs" }, { name: "Seating Chart Signs", slug: "seating-chart-signs" }, { name: "Directional Signs (parking, restrooms)", slug: "directional-signs" }, { name: "Unplugged Ceremony Signs", slug: "unplugged-ceremony-signs" }, { name: "Card & Gift Box Signs", slug: "card-and-gift-box-signs" }, { name: "Guest Book Signs", slug: "guest-book-signs" }, { name: "Photo Booth Signs", slug: "photo-booth-signs" }, { name: "Dessert Table Signs", slug: "dessert-table-signs" }, { name: "Favor Table Signs", slug: "favor-table-signs" }, { name: "Memorial Table Signs", slug: "memorial-table-signs" }] },
            { name: "Sign Materials", slug: "sign-materials" },
            { name: "Acrylic Signs (clear, frosted, colored)", slug: "acrylic-signs" },
            { name: "Foam Board Signs (lightweight)", slug: "foam-board-signs" },
            { name: "Wood Signs (plywood, reclaimed)", slug: "wood-signs" },
            { name: "Chalkboard Signs", slug: "chalkboard-signs" },
            { name: "LED Neon Signs (custom)", slug: "led-neon-signs" },
            { name: "Vinyl Banner Signs (large format)", slug: "vinyl-banner-signs" },
            { name: "Printing Methods", slug: "printing-methods" },
            { name: "Digital Printing (flat, affordable)", slug: "digital-printing" },
            { name: "Letterpress (debossed, premium)", slug: "letterpress" },
            { name: "Foil Stamping (gold, silver, rose gold)", slug: "foil-stamping" },
            { name: "Thermography (raised ink)", slug: "thermography" },
            { name: "Laser Cutting (intricate cutouts)", slug: "laser-cutting" },
            { name: "Envelope Addressing (printed, calligraphy, label)", slug: "envelope-addressing" }
          ]
      },
      {
        name: "Decor & Rental Packages",
        slug: "packages",
        level3: [
            { name: "Wedding Decor Packages (venue + florals + lighting + linens)", slug: "wedding-decor-packages" },
            { name: "Birthday Party Decor Packages", slug: "birthday-party-decor-packages" },
            { name: "Baby Shower Decor Packages", slug: "baby-shower-decor-packages" },
            { name: "Bridal Shower Decor Packages", slug: "bridal-shower-decor-packages" },
            { name: "Corporate Event Decor Packages", slug: "corporate-event-decor-packages" },
            { name: "All-Inclusive Tent Packages (tent + floor + lighting + heat)", slug: "all-inclusive-tent-packages" },
            { name: "DIY Decor Kits (you set up)", slug: "diy-decor-kits" },
            { name: "Full-Service Decor Packages (we set up and tear down)", slug: "full-service-decor-packages" }
          ]
      }
    ]
  },
    {
    name: "BEAUTY & ATTIRE",
    slug: "beauty-attire",
    description: "",
    level2: [
      {
        name: "Hair & Makeup Artists",
        slug: "hair-makeup",
        level3: [
            { name: "Bridal Hair & Makeup", slug: "bridal-hair-and-makeup",
              level4: [{ name: "Bridal Hair Only", slug: "bridal-hair-only" }, { name: "Bridal Makeup Only", slug: "bridal-makeup-only" }, { name: "Bridal Hair & Makeup Combined", slug: "bridal-hair-and-makeup-combined" }, { name: "Bridal Trial Sessions (test look before wedding day)", slug: "bridal-trial-sessions" }, { name: "Bridal Party Hair & Makeup (bride + bridesmaids + mothers)", slug: "bridal-party-hair-and-makeup" }, { name: "Destination Wedding Hair & Makeup (travel to location)", slug: "destination-wedding-hair-and-makeup" }, { name: "Elopement Hair & Makeup (small ceremony)", slug: "elopement-hair-and-makeup" }, { name: "LGBTQ+ Bridal Hair & Makeup", slug: "lgbtqplus-bridal-hair-and-makeup" }, { name: "Cultural Bridal Hair & Makeup (Indian, Latin, African, etc.)", slug: "cultural-bridal-hair-and-makeup" }] },
            { name: "Makeup Artists (general)", slug: "makeup-artists",
              level4: [{ name: "Natural Makeup (no-makeup makeup)", slug: "natural-makeup" }, { name: "Glam Makeup (full coverage, bold)", slug: "glam-makeup" }, { name: "Airbrush Makeup (sprayed, long-wear)", slug: "airbrush-makeup" }, { name: "Editorial Makeup (fashion, photoshoot)", slug: "editorial-makeup" }, { name: "SFX Makeup (special effects, horror, fantasy)", slug: "sfx-makeup" }, { name: "Body Painting (full body, partial)", slug: "body-painting" }, { name: "Freckle Tattooing (drawn freckles)", slug: "freckle-tattooing" }, { name: "Flawless Makeup (acne coverage, skin tone matching)", slug: "flawless-makeup" }] },
            { name: "Hair Stylists (general)", slug: "hair-stylists",
              level4: [{ name: "Updo Specialists (formal styles)", slug: "updo-specialists" }, { name: "Blowout Specialists (sleek, voluminous)", slug: "blowout-specialists" }, { name: "Braiding Specialists (box braids, cornrows, French braids)", slug: "braiding-specialists" }, { name: "Extension Specialists (clip-in, tape-in, sew-in, fusion)", slug: "extension-specialists" }, { name: "Curly Hair Specialists (type 3A-4C)", slug: "curly-hair-specialists" }, { name: "Coily Hair Specialists (type 4A-4C)", slug: "coily-hair-specialists" }, { name: "Natural Hair Specialists (no heat, protective styles)", slug: "natural-hair-specialists" }, { name: "Men's Grooming (haircuts, beard trims)", slug: "mens-grooming" }, { name: "Kids Hair (flower girl, ring bearer, party)", slug: "kids-hair" }] },
            { name: "Skin Tone Expertise (critical filter)", slug: "skin-tone-expertise",
              level4: [{ name: "Fair Skin Specialist (Fitzpatrick I-II)", slug: "fair-skin-specialist" }, { name: "Light/Medium Skin Specialist (Fitzpatrick III)", slug: "light-medium-skin-specialist" }, { name: "Olive/Tan Skin Specialist (Fitzpatrick IV)", slug: "olive-tan-skin-specialist" }, { name: "Brown Skin Specialist (Fitzpatrick V)", slug: "brown-skin-specialist" }, { name: "Dark Skin Specialist (Fitzpatrick VI)", slug: "dark-skin-specialist" }, { name: "Deep Skin Specialist (very dark)", slug: "deep-skin-specialist" }, { name: "All Skin Tones (no specialization, but inclusive)", slug: "all-skin-tones" }, { name: "Black-Owned Makeup Artist", slug: "black-owned-makeup-artist" }, { name: "Latina Makeup Artist", slug: "latina-makeup-artist" }, { name: "Asian Makeup Artist", slug: "asian-makeup-artist" }, { name: "South Asian Makeup Artist (bridal)", slug: "south-asian-makeup-artist" }, { name: "Middle Eastern Makeup Artist (bridal)", slug: "middle-eastern-makeup-artist" }] },
            { name: "Product Brand Expertise (can list brands they use)", slug: "product-brand-expertise",
              level4: [{ name: "MAC, NARS, Fenty, Urban Decay", slug: "mac-nars-fenty-urban-decay" }, { name: "Charlotte Tilbury, Pat McGrath", slug: "charlotte-tilbury-pat-mcgrath" }, { name: "Make Up For Ever, Kryolan (SFX)", slug: "make-up-for-ever-kryolan" }, { name: "Tarte, Too Faced, Anastasia Beverly Hills", slug: "tarte-too-faced-anastasia-beverly-hills" }, { name: "Rare Beauty, Clinique, Estée Lauder", slug: "rare-beauty-clinique-este-lauder" }, { name: "Bobbi Brown, Laura Mercier, Armani Beauty", slug: "bobbi-brown-laura-mercier-armani-beauty" }, { name: "Dior, Chanel, YSL", slug: "dior-chanel-ysl" }, { name: "Vegan & Cruelty-Free Brands", slug: "vegan-and-cruelty-free-brands" }, { name: "Hypoallergenic Brands (sensitive skin)", slug: "hypoallergenic-brands" }, { name: "Non-Comedogenic Brands (acne-safe)", slug: "non-comedogenic-brands" }] },
            { name: "Makeup Styles (visual filter)", slug: "makeup-styles",
              level4: [{ name: "Natural / No-Makeup Makeup", slug: "natural-no-makeup-makeup" }, { name: "Soft Glam (everyday, wedding)", slug: "soft-glam" }, { name: "Full Glam (evening, heavy)", slug: "full-glam" }, { name: "Smokey Eye", slug: "smokey-eye" }, { name: "Cut Crease", slug: "cut-crease" }, { name: "Graphic Liner", slug: "graphic-liner" }, { name: "Bold Lip", slug: "bold-lip" }, { name: "Editorial / High Fashion", slug: "editorial-high-fashion" }, { name: "Vintage (pin-up, 20s, 60s, 70s, 80s)", slug: "vintage" }, { name: "Minimalist / Clean Girl", slug: "minimalist-clean-girl" }, { name: "Glass Skin (dewy)", slug: "glass-skin" }, { name: "Matte Finish", slug: "matte-finish" }, { name: "Airbrush Finish", slug: "airbrush-finish" }] }
          ]
      },
      {
        name: "Makeup Artists",
        slug: "makeup-artists-separate",
        level3: [
            { name: "Bridal Makeup Artists", slug: "bridal-makeup-artists" },
            { name: "Special Event Makeup", slug: "special-event-makeup" },
            { name: "Airbrush Makeup Artists", slug: "airbrush-makeup-artists" },
            { name: "Natural Makeup Artists", slug: "natural-makeup-artists" },
            { name: "Glam Makeup Artists", slug: "glam-makeup-artists" },
            { name: "SFX & Body Paint Artists", slug: "sfx-and-body-paint-artists" },
            { name: "Editorial & Fashion Makeup", slug: "editorial-and-fashion-makeup" },
            { name: "Cultural Makeup Specialists", slug: "cultural-makeup-specialists" },
            { name: "LGBTQ+ Makeup Artists", slug: "lgbtqplus-makeup-artists" },
            { name: "Destination Makeup Artists", slug: "destination-makeup-artists" },
            { name: "On-Location Makeup Artists", slug: "on-location-makeup-artists" },
            { name: "Makeup Lessons & Consultations", slug: "makeup-lessons-and-consultations" }
          ]
      },
      {
        name: "Tailors & Alterations",
        slug: "tailors-alterations",
        level3: [
            { name: "Wedding Dress Alterations", slug: "wedding-dress-alterations",
              level4: [{ name: "Hemming (shortening length)", slug: "hemming" }, { name: "Taking In (making smaller)", slug: "taking-in" }, { name: "Letting Out (making larger)", slug: "letting-out" }, { name: "Bust Adjustment", slug: "bust-adjustment" }, { name: "Waist Adjustment", slug: "waist-adjustment" }, { name: "Hip Adjustment", slug: "hip-adjustment" }, { name: "Shoulder Adjustment", slug: "shoulder-adjustment" }, { name: "Strap Shortening/Lengthening", slug: "strap-shortening-lengthening" }, { name: "Adding Bustle (train management)", slug: "adding-bustle" }, { name: "Adding Sleeves", slug: "adding-sleeves" }, { name: "Removing Sleeves", slug: "removing-sleeves" }, { name: "Corset Back Conversion (from zipper)", slug: "corset-back-conversion" }, { name: "Cup Insertion (built-in bra)", slug: "cup-insertion" }, { name: "Lace Repair & Matching", slug: "lace-repair-and-matching" }, { name: "Heirloom Wedding Dress Restoration (mother's/grandmother's dress)", slug: "heirloom-wedding-dress-restoration" }] },
            { name: "Bridesmaid Dress Alterations", slug: "bridesmaid-dress-alterations",
              level4: [{ name: "Hemming", slug: "hemming" }, { name: "Taking In / Letting Out", slug: "taking-in-letting-out" }, { name: "Strap Adjustment", slug: "strap-adjustment" }] },
            { name: "Suit & Tuxedo Alterations", slug: "suit-and-tuxedo-alterations",
              level4: [{ name: "Jacket Waist Suppression", slug: "jacket-waist-suppression" }, { name: "Jacket Sleeve Length", slug: "jacket-sleeve-length" }, { name: "Pant Hem (length)", slug: "pant-hem" }, { name: "Pant Waist", slug: "pant-waist" }, { name: "Pant Taper (narrow leg)", slug: "pant-taper" }, { name: "Vest Adjustment", slug: "vest-adjustment" }, { name: "Shirt Sleeve Length", slug: "shirt-sleeve-length" }, { name: "Shirt Torso (slim fit)", slug: "shirt-torso" }] },
            { name: "Prom Dress Alterations", slug: "prom-dress-alterations" },
            { name: "Quinceañera Dress Alterations", slug: "quinceaera-dress-alterations" },
            { name: "Formal Gown Alterations (evening wear, pageant)", slug: "formal-gown-alterations" },
            { name: "Everyday Clothing Alterations (jeans, casual wear)", slug: "everyday-clothing-alterations" },
            { name: "Leather & Suede Alterations", slug: "leather-and-suede-alterations" },
            { name: "Rush Alterations (24-hour, 48-hour, 1-week)", slug: "rush-alterations" },
            { name: "On-Site Fittings (tailor travels to you)", slug: "on-site-fittings" },
            { name: "Virtual Fitting Consultations (send measurements, video call)", slug: "virtual-fitting-consultations" }
          ]
      },
      {
        name: "Wardrobe Stylists",
        slug: "wardrobe-stylists",
        level3: [
            { name: "Personal Wardrobe Stylists (everyday fashion)", slug: "personal-wardrobe-stylists" },
            { name: "Event Wardrobe Stylists (wedding, gala, prom, photoshoot)", slug: "event-wardrobe-stylists" },
            { name: "Bridal Wardrobe Stylists (wedding dress + accessories + shoes)", slug: "bridal-wardrobe-stylists" },
            { name: "Groom & Groomsmen Wardrobe Stylists (suits, ties, shoes)", slug: "groom-and-groomsmen-wardrobe-stylists" },
            { name: "Bridal Party Wardrobe Stylists (bridesmaids, mothers)", slug: "bridal-party-wardrobe-stylists" },
            { name: "Quinceañera Wardrobe Stylists (gown + court of honor)", slug: "quinceaera-wardrobe-stylists" },
            { name: "Sweet 16 Wardrobe Stylists (birthday outfit + party dress)", slug: "sweet-16-wardrobe-stylists" },
            { name: "Prom Wardrobe Stylists (dress/suit + shoes + accessories)", slug: "prom-wardrobe-stylists" },
            { name: "Corporate Wardrobe Stylists (headshots, interviews, executive)", slug: "corporate-wardrobe-stylists" },
            { name: "Photoshoot Wardrobe Stylists (engagement, family, branding)", slug: "photoshoot-wardrobe-stylists" },
            { name: "Rental Wardrobe Services (renting outfits for events)", slug: "rental-wardrobe-services" },
            { name: "Sustainable Wardrobe Stylists (second-hand, rental, upcycled)", slug: "sustainable-wardrobe-stylists" }
          ]
      }
    ]
  },
    {
    name: "TRAVEL & LODGING",
    slug: "travel-lodging",
    description: "",
    level2: [
      {
        name: "Hotels & Resorts",
        slug: "hotels",
        level3: [
            { name: "Luxury Hotels (5-star, premium amenities)", slug: "luxury-hotels" },
            { name: "Boutique Hotels (unique design, small)", slug: "boutique-hotels" },
            { name: "Business Hotels (downtown, conference facilities)", slug: "business-hotels" },
            { name: "Airport Hotels (shuttle, overnight parking)", slug: "airport-hotels" },
            { name: "Extended Stay Hotels (kitchenette, weekly rates)", slug: "extended-stay-hotels" },
            { name: "Budget Hotels (affordable, basic)", slug: "budget-hotels" },
            { name: "Historic Hotels (landmark, vintage charm)", slug: "historic-hotels" },
            { name: "Resort Hotels (destination, all-inclusive, spa, golf)", slug: "resort-hotels" },
            { name: "Casino Hotels", slug: "casino-hotels" },
            { name: "Pet-Friendly Hotels", slug: "pet-friendly-hotels" },
            { name: "Wedding-Ready Hotels (on-site ceremony/reception spaces)", slug: "wedding-ready-hotels" },
            { name: "Hotel Wedding Packages (ceremony + reception + room block)", slug: "hotel-wedding-packages" },
            { name: "Hotel Room Blocks Only (no event space)", slug: "hotel-room-blocks-only" }
          ]
      },
      {
        name: "Group Room Blocks",
        slug: "room-blocks",
        level3: [
            { name: "Wedding Room Blocks", slug: "wedding-room-blocks" },
            { name: "Corporate Event Room Blocks", slug: "corporate-event-room-blocks" },
            { name: "Conference Room Blocks", slug: "conference-room-blocks" },
            { name: "Family Reunion Room Blocks", slug: "family-reunion-room-blocks" },
            { name: "Sports Team Room Blocks", slug: "sports-team-room-blocks" },
            { name: "Wedding Guest Room Blocks (negotiated rates)", slug: "wedding-guest-room-blocks" },
            { name: "Courtesy Room Blocks (no upfront cost, attrition applies)", slug: "courtesy-room-blocks" },
            { name: "Guaranteed Room Blocks (you pay for unfilled rooms)", slug: "guaranteed-room-blocks" }
          ]
      },
      {
        name: "Vacation Rentals",
        slug: "vacation-rentals",
        level3: [
            { name: "Entire Home Rentals (you get whole property)", slug: "entire-home-rentals" },
            { name: "Private Room Rentals (shared common areas)", slug: "private-room-rentals" },
            { name: "Luxury Villa Rentals (pool, staff, high-end)", slug: "luxury-villa-rentals" },
            { name: "Cabin & Cottage Rentals (rustic, wooded)", slug: "cabin-and-cottage-rentals" },
            { name: "Lakefront Rentals (water access)", slug: "lakefront-rentals" },
            { name: "Beach House Rentals (summer, shoreline)", slug: "beach-house-rentals" },
            { name: "Urban Loft Rentals (downtown, industrial)", slug: "urban-loft-rentals" },
            { name: "Historic Home Rentals (character, charm)", slug: "historic-home-rentals" },
            { name: "Pet-Friendly Vacation Rentals", slug: "pet-friendly-vacation-rentals" },
            { name: "Large Group Rentals (10+ bedrooms)", slug: "large-group-rentals" },
            { name: "Event-Friendly Vacation Rentals (weddings, parties allowed)", slug: "event-friendly-vacation-rentals" },
            { name: "Bachelorette Vacation Rentals", slug: "bachelorette-vacation-rentals" },
            { name: "Bachelor Vacation Rentals", slug: "bachelor-vacation-rentals" },
            { name: "Corporate Retreat Vacation Rentals", slug: "corporate-retreat-vacation-rentals" }
          ]
      },
      {
        name: "Transportation Services",
        slug: "transportation",
        level3: [
            { name: "Car Rentals", slug: "car-rentals",
              level4: [{ name: "Economy Cars", slug: "economy-cars" }, { name: "Standard Cars", slug: "standard-cars" }, { name: "Full-Size Cars", slug: "full-size-cars" }, { name: "Luxury Cars", slug: "luxury-cars" }, { name: "SUVs", slug: "suvs" }, { name: "Minivans (group travel)", slug: "minivans" }, { name: "Passenger Vans (8-15 passengers)", slug: "passenger-vans" }, { name: "Convertibles (wedding getaway)", slug: "convertibles" }, { name: "Exotic Car Rentals (Lamborghini, Ferrari, Porsche)", slug: "exotic-car-rentals" }] },
            { name: "Limousines", slug: "limousines",
              level4: [{ name: "Stretch Limousines (6-10 passengers)", slug: "stretch-limousines" }, { name: "SUV Limousines (Escalade, Navigator, 10-14 passengers)", slug: "suv-limousines" }, { name: "Luxury Sedans (town car, 3 passengers)", slug: "luxury-sedans" }, { name: "Vintage Limousines (classic cars)", slug: "vintage-limousines" }, { name: "Hummer Limousines (large groups)", slug: "hummer-limousines" }] },
            { name: "Party Buses", slug: "party-buses",
              level4: [{ name: "Small Party Buses (14-18 passengers)", slug: "small-party-buses" }, { name: "Medium Party Buses (20-25 passengers)", slug: "medium-party-buses" }, { name: "Large Party Buses (30-35 passengers)", slug: "large-party-buses" }, { name: "XL Party Buses (40-50 passengers)", slug: "xl-party-buses" }, { name: "Mega Party Buses (56+ passengers)", slug: "mega-party-buses" }, { name: "Sprinter Party Vans (luxury van, 10-14 passengers)", slug: "sprinter-party-vans" }, { name: "Disco Party Buses (dance floor, lights, poles)", slug: "disco-party-buses" }, { name: "VIP Party Buses (leather lounge, premium sound)", slug: "vip-party-buses" }, { name: "Bar Crawl Party Buses (includes bar route)", slug: "bar-crawl-party-buses" }, { name: "Wine Tour Party Buses (vineyard route)", slug: "wine-tour-party-buses" }, { name: "Prom Party Buses (teen events, no alcohol)", slug: "prom-party-buses" }, { name: "Bachelorette Party Buses", slug: "bachelorette-party-buses" }, { name: "Bachelor Party Buses", slug: "bachelor-party-buses" }] },
            { name: "Airport Shuttles", slug: "airport-shuttles",
              level4: [{ name: "Shared Ride Shuttles (multiple groups)", slug: "shared-ride-shuttles" }, { name: "Private Shuttles (your group only)", slug: "private-shuttles" }, { name: "Executive Sedan Shuttles (business travelers)", slug: "executive-sedan-shuttles" }, { name: "Sprinter Van Shuttles (8-14 passengers)", slug: "sprinter-van-shuttles" }, { name: "Minibus Shuttles (15-25 passengers)", slug: "minibus-shuttles" }, { name: "Coach Bus Shuttles (30-56 passengers)", slug: "coach-bus-shuttles" }, { name: "Meet & Greet Service (driver inside terminal with sign)", slug: "meet-and-greet-service" }, { name: "Flight Tracking (driver monitors delays)", slug: "flight-tracking" }] },
            { name: "Wedding Transportation", slug: "wedding-transportation",
              level4: [{ name: "Bridal Party Shuttles (hotel → ceremony → reception)", slug: "bridal-party-shuttles" }, { name: "Guest Shuttles (hotel → venue)", slug: "guest-shuttles" }, { name: "Getaway Car (bride & groom leave reception)", slug: "getaway-car" }, { name: "After-Party Transportation (guests to after-party location)", slug: "after-party-transportation" }, { name: "Late-Night Guest Drop-Off (alcohol safety)", slug: "late-night-guest-drop-off" }] },
            { name: "Corporate Transportation", slug: "corporate-transportation",
              level4: [{ name: "Executive Sedans", slug: "executive-sedans" }, { name: "Executive SUVs", slug: "executive-suvs" }, { name: "Executive Vans", slug: "executive-vans" }, { name: "Corporate Shuttles (hotel → office → event)", slug: "corporate-shuttles" }, { name: "Conference Transportation (attendees between venues)", slug: "conference-transportation" }] }
          ]
      }
    ]
  },
  {
    name: "LIVE EVENTS & TICKETS",
    slug: "live-events-tickets",
    description: "",
    level2: [
      {
        name: "Concerts & Music Festivals",
        slug: "concerts-music-festivals",
        level3: [
            { name: "Rock Concerts", slug: "rock-concerts" },
            { name: "Hip Hop Concerts", slug: "hip-hop-concerts" },
            { name: "Pop Concerts", slug: "pop-concerts" },
            { name: "Country Concerts", slug: "country-concerts" },
            { name: "Latin Music Concerts", slug: "latin-music-concerts" },
            { name: "EDM & Electronic Festivals", slug: "edm-and-electronic-festivals" },
            { name: "Jazz & Blues Concerts", slug: "jazz-and-blues-concerts" },
            { name: "Classical & Orchestra Concerts", slug: "classical-and-orchestra-concerts" },
            { name: "Indie & Alternative Concerts", slug: "indie-and-alternative-concerts" },
            { name: "R&B & Soul Concerts", slug: "r-and-b-and-soul-concerts" },
            { name: "Music Festivals", slug: "music-festivals" },
            { name: "Multi-Genre Festivals", slug: "multi-genre-festivals" },
            { name: "Local Music Showcases", slug: "local-music-showcases" },
            { name: "Album Release Parties", slug: "album-release-parties" },
            { name: "VIP Concert Events", slug: "vip-concert-experiences" },
            { name: "Music Cruise Events", slug: "music-cruise-events" },
            { name: "Battle of the Bands", slug: "battle-of-the-bands" },
            { name: "Acoustic & Unplugged Sessions", slug: "acoustic-and-unplugged-sessions" }
        ]
      },
      {
        name: "Comedy Shows",
        slug: "comedy-shows",
        level3: [
            { name: "Stand-Up Comedy Shows", slug: "stand-up-comedy-shows" },
            { name: "Improv Comedy Shows", slug: "improv-comedy-shows" },
            { name: "Comedy Specials", slug: "comedy-specials" },
            { name: "Open Mic Comedy Nights", slug: "open-mic-comedy-nights" },
            { name: "Comedy Festival Events", slug: "comedy-festival-events" },
            { name: "Comedy Tour Dates", slug: "comedy-tour-dates" },
            { name: "Sketch Comedy Shows", slug: "sketch-comedy-shows" },
            { name: "Roast Events", slug: "roast-events" },
            { name: "Clean Comedy Shows", slug: "clean-comedy-shows" },
            { name: "Cultural Comedy Shows", slug: "cultural-comedy-shows" },
            { name: "Comedy Brunch Shows", slug: "comedy-brunch-shows" },
            { name: "Comedy Magic Shows", slug: "comedy-magic-shows" }
        ]
      },
      {
        name: "Theater & Performances",
        slug: "theater-performances",
        level3: [
            { name: "Broadway Shows", slug: "broadway-shows" },
            { name: "Off-Broadway Shows", slug: "off-broadway-shows" },
            { name: "Musical Theater", slug: "musical-theater" },
            { name: "Play Performances", slug: "play-performances" },
            { name: "Dance Performances", slug: "dance-performances" },
            { name: "Ballet Performances", slug: "ballet-performances" },
            { name: "Opera Performances", slug: "opera-performances" },
            { name: "Cirque & Acrobatic Shows", slug: "cirque-and-acrobatic-shows" },
            { name: "Children's Theater", slug: "childrens-theater" },
            { name: "Immersive Theater Events", slug: "immersive-theater-experiences" },
            { name: "Community Theater", slug: "community-theater" },
            { name: "One-Person Shows", slug: "one-person-shows" }
        ]
      },
      {
        name: "Sports Events",
        slug: "sports-events",
        level3: [
            { name: "NFL Games", slug: "nfl-games" },
            { name: "NBA Games", slug: "nba-games" },
            { name: "MLB Games", slug: "mlb-games" },
            { name: "NHL Games", slug: "nhl-games" },
            { name: "MLS Soccer Games", slug: "mls-soccer-games" },
            { name: "College Sports Events", slug: "college-sports-events" },
            { name: "Boxing Matches", slug: "boxing-matches" },
            { name: "MMA & UFC Events", slug: "mma-and-ufc-events" },
            { name: "Wrestling Events", slug: "wrestling-events" },
            { name: "Golf Tournaments", slug: "golf-tournaments" },
            { name: "Tennis Tournaments", slug: "tennis-tournaments" },
            { name: "Marathons & Running Events", slug: "marathons-and-running-events" },
            { name: "Auto Racing Events", slug: "auto-racing-events" },
            { name: "X Games & Extreme Sports", slug: "x-games-and-extreme-sports" }
        ]
      },
      {
        name: "Cultural Festivals",
        slug: "cultural-festivals",
        level3: [
            { name: "Food & Wine Festivals", slug: "food-and-wine-festivals" },
            { name: "Art Festivals", slug: "art-festivals" },
            { name: "Film Festivals", slug: "film-festivals" },
            { name: "Cultural Heritage Festivals", slug: "cultural-heritage-festivals" },
            { name: "Pride Festivals", slug: "pride-festivals" },
            { name: "Holiday Festivals", slug: "holiday-festivals" },
            { name: "Renaissance Faires", slug: "renaissance-faires" },
            { name: "Book Festivals", slug: "book-festivals" },
            { name: "Craft Beer Festivals", slug: "craft-beer-festivals" },
            { name: "Street Fairs", slug: "street-fairs" },
            { name: "Carnival Celebrations", slug: "carnival-celebrations" },
            { name: "Diwali Festivals", slug: "diwali-festivals" },
            { name: "Lunar New Year Festivals", slug: "lunar-new-year-festivals" },
            { name: "Oktoberfest Events", slug: "oktoberfest-events" },
            { name: "Dia de los Muertos Events", slug: "dia-de-los-muertos-events" },
            { name: "Juneteenth Celebrations", slug: "juneteenth-celebrations" },
            { name: "Kwanzaa Events", slug: "kwanzaa-events" },
            { name: "Irish Festivals", slug: "irish-festivals" }
        ]
      },
      {
        name: "Ticketed Parties & Club Nights",
        slug: "ticketed-parties",
        level3: [
            { name: "NYE Ticketed Events", slug: "nye-ticketed-events" },
            { name: "Halloween Ticketed Parties", slug: "halloween-ticketed-parties" },
            { name: "Valentine's Day Events", slug: "valentines-day-events" },
            { name: "Cinco de Mayo Events", slug: "cinco-de-mayo-events" },
            { name: "Themed Club Nights", slug: "themed-club-nights" },
            { name: "Album Release Parties", slug: "ticketed-album-release-parties" },
            { name: "Celebrity Hosted Parties", slug: "celebrity-hosted-parties" },
            { name: "White Parties", slug: "white-parties" },
            { name: "Boat Parties", slug: "boat-parties" },
            { name: "Rooftop Ticketed Events", slug: "rooftop-ticketed-events" },
            { name: "Silent Discos", slug: "silent-disco-events" },
            { name: "Day Parties", slug: "day-parties" },
            { name: "Drag Shows", slug: "ticketed-drag-shows" },
            { name: "Burlesque Shows", slug: "burlesque-shows" },
            { name: "Toga Parties", slug: "toga-parties" }
        ]
      },
      {
        name: "Event Ticket Services",
        slug: "event-ticket-services",
        level3: [
            { name: "Primary Ticket Sellers", slug: "primary-ticket-sellers" },
            { name: "Resale Ticket Marketplaces", slug: "resale-ticket-marketplaces" },
            { name: "VIP Ticket Packages", slug: "vip-ticket-packages" },
            { name: "Group Ticket Sales", slug: "group-ticket-sales" },
            { name: "Season Tickets & Subscriptions", slug: "season-tickets-and-subscriptions" },
            { name: "Last-Minute Ticket Deals", slug: "last-minute-ticket-deals" },
            { name: "Corporate Box & Suite Rentals", slug: "corporate-box-and-suite-rentals" },
            { name: "Accessible Seating Services", slug: "accessible-seating-services" }
        ]
      }
    ]
  },
  {
    name: "EVENTS & ACTIVITIES",
    slug: "experiences-activities",
    description: "",
    level2: [
      {
        name: "Themed Party Packages",
        slug: "themed-party-packages",
        level3: [
            { name: "Murder Mystery Parties", slug: "murder-mystery-parties" },
            { name: "Decades Theme Parties", slug: "decades-theme-parties" },
            { name: "Great Gatsby Parties", slug: "great-gatsby-parties" },
            { name: "Casino Night Packages", slug: "casino-night-packages" },
            { name: "Luau & Tropical Parties", slug: "luau-and-tropical-parties" },
            { name: "Halloween Theme Packages", slug: "halloween-theme-packages" },
            { name: "Western & Country Parties", slug: "western-and-country-parties" },
            { name: "Masquerade Ball Packages", slug: "masquerade-ball-packages" },
            { name: "Hollywood & Red Carpet Parties", slug: "hollywood-and-red-carpet-parties" },
            { name: "Under the Sea Parties", slug: "under-the-sea-parties" },
            { name: "Winter Wonderland Packages", slug: "winter-wonderland-packages" },
            { name: "Disco & 70s Dance Parties", slug: "disco-and-70s-dance-parties" },
            { name: "80s Retro Parties", slug: "80s-retro-parties" },
            { name: "Superhero Theme Parties", slug: "superhero-theme-parties" },
            { name: "Game Show Nights", slug: "game-show-nights" },
            { name: "Escape Room Parties", slug: "escape-room-parties" },
            { name: "Karaoke Party Packages", slug: "karaoke-party-packages" },
            { name: "DIY Craft Party Packages", slug: "diy-craft-party-packages" },
            { name: "Scavenger Hunt Packages", slug: "scavenger-hunt-packages" },
            { name: "Trivia Night Packages", slug: "trivia-night-packages" },
            { name: "Pajama Party Packages", slug: "pajama-party-packages" },
            { name: "Slumber Party Packages", slug: "slumber-party-packages" }
        ]
      },
      {
        name: "Team Building Events",
        slug: "team-building",
        level3: [
            { name: "Corporate Team Building Activities", slug: "corporate-team-building-activities" },
            { name: "Outdoor Team Building", slug: "outdoor-team-building" },
            { name: "Virtual Team Building", slug: "virtual-team-building" },
            { name: "Cooking Team Building", slug: "cooking-team-building" },
            { name: "Escape Room Team Building", slug: "escape-room-team-building" },
            { name: "Scavenger Hunt Team Building", slug: "scavenger-hunt-team-building" },
            { name: "Charity Team Building", slug: "charity-team-building" },
            { name: "Sports Team Building", slug: "sports-team-building" },
            { name: "Creative Team Building", slug: "creative-team-building" },
            { name: "Adventure Team Building", slug: "adventure-team-building" },
            { name: "Problem-Solving Challenges", slug: "problem-solving-challenges" },
            { name: "Leadership Development Programs", slug: "leadership-development-programs" },
            { name: "Ice Breaker Activities", slug: "ice-breaker-activities" },
            { name: "Wellness Team Building", slug: "wellness-team-building" },
            { name: "Trivia Team Building", slug: "trivia-team-building" },
            { name: "Improv Workshop Team Building", slug: "improv-workshop-team-building" },
            { name: "Wine Tasting Team Building", slug: "wine-tasting-team-building" },
            { name: "Mixology Team Building", slug: "mixology-team-building" }
        ]
      },
      {
        name: "Wellness Retreats & Spa Days",
        slug: "wellness-retreats",
        level3: [
            { name: "Day Spa Packages", slug: "day-spa-packages" },
            { name: "Weekend Wellness Retreats", slug: "weekend-wellness-retreats" },
            { name: "Yoga Retreats", slug: "yoga-retreats" },
            { name: "Meditation Retreats", slug: "meditation-retreats" },
            { name: "Detox & Cleanse Retreats", slug: "detox-and-cleanse-retreats" },
            { name: "Couples Spa Packages", slug: "couples-spa-packages" },
            { name: "Bachelorette Spa Days", slug: "bachelorette-spa-days" },
            { name: "Bridal Party Spa Packages", slug: "bridal-party-spa-packages" },
            { name: "Corporate Wellness Days", slug: "corporate-wellness-days" },
            { name: "Sound Healing Sessions", slug: "sound-healing-sessions" },
            { name: "Breathwork Events", slug: "breathwork-experiences" },
            { name: "Mindfulness Workshops", slug: "mindfulness-workshops" },
            { name: "Float Tank Events", slug: "float-tank-experiences" },
            { name: "Hot Spring Retreats", slug: "hot-spring-retreats" },
            { name: "Ayurveda Retreats", slug: "ayurveda-retreats" },
            { name: "Silent Retreats", slug: "silent-retreats" },
            { name: "Nature Therapy Events", slug: "nature-therapy-experiences" },
            { name: "Wellness Cruises", slug: "wellness-cruises" },
            { name: "Spa Birthday Parties", slug: "spa-birthday-parties" },
            { name: "Group Wellness Activities", slug: "group-wellness-activities" },
            { name: "Pilates Retreats", slug: "pilates-retreats" },
            { name: "Tai Chi Workshops", slug: "tai-chi-workshops" },
            { name: "Aromatherapy Events", slug: "aromatherapy-experiences" },
            { name: "Crystal Healing Sessions", slug: "crystal-healing-sessions" },
            { name: "Reiki Sessions", slug: "reiki-sessions" }
        ]
      },
      {
        name: "Cooking Classes & Food Events",
        slug: "cooking-food-experiences",
        level3: [
            { name: "Group Cooking Classes", slug: "group-cooking-classes" },
            { name: "Couples Cooking Classes", slug: "couples-cooking-classes" },
            { name: "Private Cooking Classes", slug: "private-cooking-classes" },
            { name: "Italian Cooking Classes", slug: "italian-cooking-classes" },
            { name: "Sushi Making Classes", slug: "sushi-making-classes" },
            { name: "Pastry & Baking Classes", slug: "pastry-and-baking-classes" },
            { name: "BBQ & Grilling Classes", slug: "bbq-and-grilling-classes" },
            { name: "Cocktail Making Classes", slug: "cocktail-making-classes" },
            { name: "Wine Tasting Classes", slug: "wine-tasting-classes" },
            { name: "Food Tour Events", slug: "food-tour-experiences" },
            { name: "Farm-to-Table Events", slug: "farm-to-table-experiences" },
            { name: "Chef's Table Events", slug: "chefs-table-experiences" },
            { name: "Virtual Cooking Classes", slug: "virtual-cooking-classes" },
            { name: "Kids Cooking Classes", slug: "kids-cooking-classes" },
            { name: "Team Cooking Challenges", slug: "team-cooking-challenges" },
            { name: "Cultural Cuisine Events", slug: "cultural-cuisine-experiences" },
            { name: "Cheese Making Classes", slug: "cheese-making-classes" },
            { name: "Chocolate Making Classes", slug: "chocolate-making-classes" },
            { name: "Pasta Making Classes", slug: "pasta-making-classes" },
            { name: "Taco & Margarita Classes", slug: "taco-and-margarita-classes" }
        ]
      },
      {
        name: "Outdoor Adventures",
        slug: "outdoor-adventures",
        level3: [
            { name: "Hiking Adventures", slug: "hiking-adventures" },
            { name: "Kayaking & Canoeing", slug: "kayaking-and-canoeing" },
            { name: "Rock Climbing Events", slug: "rock-climbing-experiences" },
            { name: "Zip Lining", slug: "zip-lining" },
            { name: "Hot Air Balloon Rides", slug: "hot-air-balloon-rides" },
            { name: "Horseback Riding", slug: "horseback-riding" },
            { name: "ATV & Off-Roading", slug: "atv-and-off-roading" },
            { name: "White Water Rafting", slug: "white-water-rafting" },
            { name: "Sailing Events", slug: "sailing-experiences" },
            { name: "Scuba Diving", slug: "scuba-diving" },
            { name: "Snorkeling Tours", slug: "snorkeling-tours" },
            { name: "Camping Events", slug: "camping-experiences" },
            { name: "Glamping Packages", slug: "glamping-packages" },
            { name: "Ski & Snowboard Trips", slug: "ski-and-snowboard-trips" },
            { name: "Surfing Lessons", slug: "surfing-lessons" },
            { name: "Fishing Charters", slug: "fishing-charters" },
            { name: "Safari Events", slug: "safari-experiences" },
            { name: "Helicopter Tours", slug: "helicopter-tours" }
        ]
      },
      {
        name: "Pop-up Events",
        slug: "popup-experiences",
        level3: [
            { name: "Pop-Up Art Galleries", slug: "pop-up-art-galleries" },
            { name: "Pop-Up Dining Events", slug: "pop-up-dining-events" },
            { name: "Pop-Up Markets", slug: "pop-up-markets" },
            { name: "Immersive Event Pop-Ups", slug: "immersive-experience-pop-ups" },
            { name: "Photo Event Pop-Ups", slug: "photo-experience-pop-ups" },
            { name: "Limited-Time Exhibits", slug: "limited-time-exhibits" },
            { name: "Secret Supper Clubs", slug: "secret-supper-clubs" },
            { name: "Speakeasy Pop-Ups", slug: "speakeasy-pop-ups" }
        ]
      },
      {
        name: "Dance Lessons",
        slug: "dance-lessons",
        level3: [
            { name: "Salsa Dance Lessons", slug: "salsa-dance-lessons" },
            { name: "Bachata Dance Lessons", slug: "bachata-dance-lessons" },
            { name: "Swing Dance Lessons", slug: "swing-dance-lessons" },
            { name: "Ballroom Dance Lessons", slug: "ballroom-dance-lessons" },
            { name: "Wedding Dance Lessons", slug: "wedding-dance-lessons" },
            { name: "Hip Hop Dance Classes", slug: "hip-hop-dance-classes" },
            { name: "Line Dancing Lessons", slug: "line-dancing-lessons" },
            { name: "Country Dance Lessons", slug: "country-dance-lessons" },
            { name: "Tango Lessons", slug: "tango-lessons" },
            { name: "Samba Lessons", slug: "samba-lessons" },
            { name: "Merengue Lessons", slug: "merengue-lessons" },
            { name: "Kizomba Lessons", slug: "kizomba-lessons" },
            { name: "Zumba Classes", slug: "zumba-classes" },
            { name: "Pole Dance Classes", slug: "pole-dance-classes" },
            { name: "Burlesque Dance Classes", slug: "burlesque-dance-classes" }
        ]
      },
      {
        name: "DJ Lessons",
        slug: "dj-lessons",
        level3: [
            { name: "Beginner DJ Lessons", slug: "beginner-dj-lessons" },
            { name: "Advanced DJ Techniques", slug: "advanced-dj-techniques" },
            { name: "Turntablism Classes", slug: "turntablism-classes" },
            { name: "Digital DJing", slug: "digital-djing" },
            { name: "Music Production Basics", slug: "music-production-basics" },
            { name: "Beat Matching Classes", slug: "beat-matching-classes" },
            { name: "Scratch DJ Lessons", slug: "scratch-dj-lessons" },
            { name: "DJ Software Training", slug: "dj-software-training" },
            { name: "MC & Hosting Classes", slug: "mc-and-hosting-classes" },
            { name: "Sound Engineering Basics", slug: "sound-engineering-basics" },
            { name: "Live Performance Coaching", slug: "live-performance-coaching" },
            { name: "DJ Business & Marketing", slug: "dj-business-and-marketing" }
        ]
      },
      {
        name: "Paint & Sip / Art Events",
        slug: "paint-sip-art",
        level3: [
            { name: "Paint & Sip Classes", slug: "paint-and-sip-classes" },
            { name: "Pottery & Ceramics Classes", slug: "pottery-and-ceramics-classes" },
            { name: "Watercolor Painting Classes", slug: "watercolor-painting-classes" },
            { name: "Acrylic Painting Classes", slug: "acrylic-painting-classes" },
            { name: "Mosaic Art Classes", slug: "mosaic-art-classes" },
            { name: "Photography Workshops", slug: "photography-workshops" },
            { name: "Calligraphy Classes", slug: "calligraphy-classes" },
            { name: "Flower Arranging Classes", slug: "flower-arranging-classes" },
            { name: "Candle Making Classes", slug: "candle-making-classes" },
            { name: "Jewelry Making Classes", slug: "jewelry-making-classes" },
            { name: "Sculpture Classes", slug: "sculpture-classes" },
            { name: "Glass Blowing Classes", slug: "glass-blowing-classes" },
            { name: "Printmaking Workshops", slug: "printmaking-workshops" },
            { name: "Sketch & Draw Classes", slug: "sketch-and-draw-classes" },
            { name: "Textile & Weaving Classes", slug: "textile-and-weaving-classes" },
            { name: "Mixed Media Art Classes", slug: "mixed-media-art-classes" },
            { name: "Street Art & Graffiti Workshops", slug: "street-art-and-graffiti-workshops" },
            { name: "Art Therapy Sessions", slug: "art-therapy-sessions" },
            { name: "Group Mural Projects", slug: "group-mural-projects" },
            { name: "Virtual Art Classes", slug: "virtual-art-classes" }
        ]
      }
    ]
  }
];

/** Find a category node at any depth by URL path segments */
export interface CategoryPathResult {
  l1: CategoryLevel1 | null;
  l2: CategoryLevel2 | null;
  l3: CategoryLevel3 | null;
  l4: CategoryLevel4 | null;
  level: number;
}

export function findCategoryByPath(segments: string[]): CategoryPathResult {
  if (!segments.length) return { l1: null, l2: null, l3: null, l4: null, level: 0 };
  const l1 = categories.find(c => c.slug === segments[0]) ?? null;
  if (!l1 || segments.length < 2) return { l1, l2: null, l3: null, l4: null, level: l1 ? 1 : 0 };
  const l2 = l1.level2.find(c => c.slug === segments[1]) ?? null;
  if (!l2 || segments.length < 3) return { l1, l2, l3: null, l4: null, level: l2 ? 2 : 1 };
  const l3 = l2.level3.find(c => c.slug === segments[2]) ?? null;
  if (!l3 || segments.length < 4) return { l1, l2, l3, l4: null, level: l3 ? 3 : 2 };
  const l4 = l3.level4?.find(c => c.slug === segments[3]) ?? null;
  return { l1, l2, l3, l4, level: l4 ? 4 : 3 };
}

export const CATEGORY_COUNTS = {
  l1: 10,
  l2: 74,
  l3: 1060,
  l4: 0,
};
