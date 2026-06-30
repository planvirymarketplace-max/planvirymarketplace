import type { Vendor, ClaimRequest, VendorSignup, Booking, Lead, VendorCategory, PriceRange } from './marketplace-types'

export const INITIAL_VENDORS: Vendor[] = [
  // DJs (The primary focus of host besttimemke)
  {
    id: 'dj-1',
    slug: 'milwaukee-airwaves',
    name: 'Milwaukee Airwaves',
    category: 'wedding_dj',
    address: '224 W Bruce St, Milwaukee, WI 53204',
    phone: '(414) 306-8273',
    website: 'https://www.milwaukeeairwaves.com',
    email: 'info@milwaukeeairwaves.com',
    bio: "Milwaukee Airwaves is a premier DJ and production company based in Walker's Point. We coordinate amazing entertainment, top-tier sound, breathtaking event lighting, and coordinate the vibe for weddings, corporate events, and parties across Milwaukee.",
    logoUrl: 'https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=150&h=150&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=450&fit=crop&q=80',
    priceRange: '$$$',
    serviceAreas: ['Milwaukee', 'Wauwatosa', 'Bay View', 'Third Ward'],
    capacity: 'N/A',
    tags: ['DJ', 'Event Lighting', 'Weddings', 'Production', 'Walkers Point'],
    isClaimed: false,
    isPublished: true,
    isFeatured: true,
    isVerified: true,
    source: 'seed',
    averageRating: 4.9,
    reviewCount: 142,
    depositPercent: 20,
    galleryUrl: [
      'https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1481162854517-d9e353af153d?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=400&fit=crop&q=80'
    ],
    socials: [
      { platform: 'instagram', url: 'https://instagram.com/milwaukeeairwaves' },
      { platform: 'facebook', url: 'https://facebook.com/milwaukeeairwaves' }
    ],
    packages: [
      {
        id: 'pkg-dj1-1',
        name: 'The Classic Reception Package',
        description: 'Up to 6 hours of custom DJ & MC performance, professional high-end PA sound system, wireless microphone for speeches, local planning consultations, and standard dance floor strobe and color lighting wash.',
        price: 1850,
        duration: '6 Hours'
      },
      {
        id: 'pkg-dj1-2',
        name: 'The Premium Airwaves Event',
        description: 'Includes ceremony sound & microphone, cocktail hour auxiliary system, reception DJ/MC for up to 8 hours, full custom architectural room uplighting (12 lights), and premium intelligent dance floor lights.',
        price: 2750,
        duration: '8 Hours'
      }
    ],
    reviews: [
      {
        id: 'rv-dj1-1',
        reviewerName: 'Jessica & Mark S.',
        rating: 5,
        body: 'Milwaukee Airwaves absolutely crushed our wedding reception! From the cocktail jazz to keeping the dance floor completely packed with 90s throwbacks and current hits, they were professional and highly engaging.',
        createdAt: '2026-05-10',
        isApproved: true,
        response: 'Thank you Jessica and Mark! It was an absolute blast celebrating with your family. Best of luck!'
      }
    ],
    availability: ['2026-06-03', '2026-06-15', '2026-06-20', '2026-07-04']
  },
  {
    id: 'dj-2',
    slug: 'sound-by-design',
    name: 'Sound by Design',
    category: 'wedding_dj',
    address: 'N14 W24771 Tower Rd, Pewaukee, WI 53072',
    phone: '(262) 968-9586',
    website: 'https://soundbydesign.co',
    email: 'info@soundbydesign.co',
    bio: "Sound by Design is a boutique event collection offering elite DJ services, custom photo booths, videography, and professional lighting designs. We focus on curating unique and polished experiences tailored to each client's wedding style.",
    logoUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&h=150&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=1200&h=450&fit=crop&q=80',
    priceRange: '$$$$',
    serviceAreas: ['Milwaukee', 'Mequon', 'Pewaukee', 'Lake Geneva'],
    capacity: 'N/A',
    tags: ['DJ', 'Boutique', 'Photo Booth', 'Lighting', 'Premium'],
    isClaimed: false,
    isPublished: true,
    isFeatured: true,
    isVerified: true,
    source: 'seed',
    averageRating: 5.0,
    reviewCount: 310,
    depositPercent: 25,
    galleryUrl: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop&q=80'
    ],
    socials: [
      { platform: 'instagram', url: 'https://instagram.com/soundbydesign' },
      { platform: 'facebook', url: 'https://facebook.com/soundbydesign' }
    ],
    packages: [
      {
        id: 'pkg-dj2-1',
        name: 'The Signature Sound Package',
        description: 'Elite DJ and MC, unlimited hours of service, high-end L-Acoustics sound equipment, custom lit facade, 8 dynamic warm-white uplights, and customized online planning portal access.',
        price: 2400,
        duration: 'Unlimited'
      }
    ],
    reviews: [],
    availability: ['2026-06-10', '2026-06-25']
  },

  // Wedding Venues (The anchor premium items)
  {
    id: 'venue-1',
    slug: 'the-atrium',
    name: 'The Atrium',
    category: 'wedding_venue',
    address: '2107 E Capitol Dr, Shorewood, WI 53211',
    phone: '(414) 902-0065',
    website: 'https://www.theatriummke.com',
    email: 'events@theatriummke.com',
    bio: "Located in Shorewood, The Atrium is a gorgeous, industrial-meets-modern wedding and event space. Featuring stunning glass accents, exposed brick, high wood-beamed ceilings, and a breathtaking public rooftop garden, it's one of MKE's most coveted backdrops.",
    logoUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=150&h=150&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=450&fit=crop&q=80',
    priceRange: '$$$$',
    serviceAreas: ['Shorewood', 'East Side', 'Milwaukee County'],
    capacity: 'Sit Down 220 | Standing 300',
    tags: ['Rooftop Garden', 'Shorewood', 'Exposed Brick', 'Modern Industrial', 'Full Bar'],
    isClaimed: false,
    isPublished: true,
    isFeatured: true,
    isVerified: true,
    source: 'seed',
    averageRating: 4.8,
    reviewCount: 95,
    depositPercent: 15,
    galleryUrl: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=600&h=400&fit=crop&q=80'
    ],
    socials: [
      { platform: 'instagram', url: 'https://instagram.com/theatriummke' }
    ],
    packages: [
      {
        id: 'pkg-v1-1',
        name: 'Saturdays Prime Rental',
        description: 'Full exclusive access to Main Atrium and Rooftop Garden for 12 hours (12 PM to 12 AM), hand-crafted wood farm tables, crossback vineyard chairs, state-of-the-art dimmable lighting, and venue supervisor.',
        price: 6500,
        duration: '12 Hours',
        capacity: 'Up to 220 guests seated'
      },
      {
        id: 'pkg-v1-2',
        name: 'Friday & Sunday Rental',
        description: 'Complete venue rental with all amenities (Rooftop + Main Floor) for up to 10 hours. Includes built-in double bars, customizable stage platform, and full cleaning service post-event.',
        price: 5200,
        duration: '10 Hours',
        capacity: 'Up to 220 guests seated'
      }
    ],
    reviews: [
      {
        id: 'rv-v1-1',
        reviewerName: 'Eleanor Carter',
        rating: 5,
        body: 'Having our wedding at The Atrium was a literal dream. The rooftop garden at sunset is unforgettable and the staff was extremely accommodating. Our guests are still talking about the glass and masonry detailing.',
        createdAt: '2026-04-18',
        isApproved: true
      }
    ],
    availability: ['2026-06-06', '2026-06-20', '2026-07-11', '2026-09-12']
  },
  {
    id: 'venue-2',
    slug: 'the-ivy-house',
    name: 'The Ivy House',
    category: 'wedding_venue',
    address: '906 S Barclay St, Milwaukee, WI 53204',
    phone: '(414) 256-8765',
    website: 'https://www.ivyhousemke.com',
    email: 'hello@ivyhousemke.com',
    bio: "Located in Milwaukee's historic Walker's Point neighborhood, The Ivy House is a gorgeous, plant-centric urban event space. Complete with an immense custom outdoor patio space, gorgeous greenery, custom industrial structures, and massive custom concrete bars.",
    logoUrl: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=150&h=150&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=450&fit=crop&q=80',
    priceRange: '$$$$',
    serviceAreas: ['Walkers Point', 'Milwaukee County', 'Downtown MKE'],
    capacity: 'Sit Down 250 | Standing 400',
    tags: ['Outdoor Patio', 'Plant-centric', 'Walkers Point', 'Industrial Elegance', 'Greenery'],
    isClaimed: false,
    isPublished: true,
    isFeatured: true,
    isVerified: true,
    source: 'seed',
    averageRating: 4.9,
    reviewCount: 115,
    depositPercent: 15,
    galleryUrl: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop&q=80'
    ],
    socials: [
      { platform: 'instagram', url: 'https://instagram.com/ivyhousemke' }
    ],
    packages: [
      {
        id: 'pkg-v2-1',
        name: 'The Ivy Premium Saturday Rental',
        description: '14 hours of absolute venue access. Includes our huge leafy outdoor patio, indoor reception hall, modular tables, lounge furniture, luxury bridal suite, and professional surround sound system.',
        price: 7200,
        duration: '14 Hours'
      }
    ],
    reviews: [],
    availability: ['2026-06-13', '2026-06-27', '2026-07-25']
  },

  // Bachelorette & Group Activities
  {
    id: 'activity-1',
    slug: 'amped-karaoke',
    name: 'AMPED Private Suite Karaoke',
    category: 'bachelorette_activity',
    address: '910 W Juneau Ave, Milwaukee, WI 53233',
    phone: '(414) 939-8837',
    website: 'https://www.ampedmke.com',
    email: 'sing@ampedmke.com',
    bio: "AMPED is a luxury private suite karaoke experience located in downtown Milwaukee's Brewery District. Perfect for bachelorette parties, private parties, corporate groups, and birthday celebrations. Ring for drinks and snacks directly from your suite!",
    logoUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=150&h=150&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&h=450&fit=crop&q=80',
    priceRange: '$$',
    serviceAreas: ['Downtown Milwaukee', 'Brewery District'],
    capacity: 'Suites for 8 to 30 people',
    tags: ['Karaoke', 'Bachelorette Party', 'Private Suites', 'Cocktails', 'Brewery District'],
    isClaimed: false,
    isPublished: true,
    isFeatured: true,
    isVerified: true,
    source: 'seed',
    averageRating: 4.7,
    reviewCount: 88,
    depositPercent: 50,
    galleryUrl: [
      'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=80'
    ],
    socials: [
      { platform: 'instagram', url: 'https://instagram.com/ampedmke' }
    ],
    packages: [
      {
        id: 'pkg-act1-1',
        name: 'The Ultimate Bachelorette Playlist Suite',
        description: '3 Hours of private decorated bachelorette suite booking for up to 15 guests. Includes a round of complimentary house cocktails, custom neon props, and direct push-to-order tablet service.',
        price: 360,
        duration: '3 Hours'
      },
      {
        id: 'pkg-act1-2',
        name: 'Bachelorette VIP Lounge Extravaganza',
        description: 'Our largest VIP suite for 4 hours. Fits up to 25 people. Comes with gourmet snack platters, customized welcome sign, bachelorette sash and crown pack, and premium bottle service credits.',
        price: 650,
        duration: '4 Hours'
      }
    ],
    reviews: [
      {
        id: 'rv-act1-1',
        reviewerName: 'Courtney H.',
        rating: 5,
        body: "We had my sister's bachelorette at AMPED and it was literally the highlight of our weekend! Singing at the top of our lungs with personal tablets to order warm cheese curds and drinks made us feel like literal rockstars.",
        createdAt: '2026-05-02',
        isApproved: true
      }
    ],
    availability: ['2026-06-05', '2026-06-06', '2026-06-12', '2026-06-13']
  },
  {
    id: 'activity-2',
    slug: 'axe-mke',
    name: 'AXE MKE',
    category: 'bachelorette_activity',
    address: '1924 E Kenilworth Pl, Milwaukee, WI 53202',
    phone: '(414) 939-8837',
    website: 'https://www.barsandrecreation.com',
    email: 'lanes@axemke.com',
    bio: "Milwaukee's premium indoor axe-throwing bar located in the heart of the energetic Upper East Side. We pair custom throwing targets, dedicated coaching, and full premium beer & cocktail menus for an action-packed group celebration.",
    logoUrl: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=150&h=150&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&h=450&fit=crop&q=80',
    priceRange: '$$',
    serviceAreas: ['East Side', 'Downtown MKE'],
    capacity: 'Lanes for up to 80 dynamic throwers',
    tags: ['Axe Throwing', 'East Side', 'Group Activity', 'Cocktails', 'Adventuresome'],
    isClaimed: false,
    isPublished: true,
    isFeatured: false,
    isVerified: true,
    source: 'seed',
    averageRating: 4.6,
    reviewCount: 220,
    depositPercent: 30,
    galleryUrl: [
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=400&fit=crop&q=80'
    ],
    socials: [
      { platform: 'instagram', url: 'https://instagram.com/axemke' }
    ],
    packages: [
      {
        id: 'pkg-act2-1',
        name: 'The Axe Bachelorette Bracket',
        description: '2 hours of reserved throwing lanes, dedicated personal coach for instructions and tournament styling, customized prize medals, and pitcher of local MKE craft beer.',
        price: 280,
        duration: '2 Hours'
      }
    ],
    reviews: [],
    availability: []
  },

  // Transportation Services
  {
    id: 'trans-1',
    slug: 'cruise-a-palooza',
    name: 'Cruise-A-Palooza Party Bus',
    category: 'transportation',
    address: '4750 S Packard Ave, Cudahy, WI 53110',
    phone: '(414) 220-0287',
    website: 'https://www.cruiseapaloozabus.com',
    email: 'ride@cruiseapalooza.com',
    bio: "Cruise-A-Palooza offers Milwaukee's top-rated luxury party buses. Featuring state-of-the-art sensory lighting, massive bluetooth surround sound speakers, auxiliary bars, and comfortable custom seating for local transfers, bar hops, wedding guest shuttles, and airport rides.",
    logoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&h=150&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&h=450&fit=crop&q=80',
    priceRange: '$$$',
    serviceAreas: ['Milwaukee County', 'Waukesha County', 'Ozaukee County', 'Racine'],
    capacity: '14 to 36 passengers per coach',
    tags: ['Party Bus', 'Wedding Shuttle', 'Bachelorette Transfer', 'Cudahy', 'Surround Sound'],
    isClaimed: false,
    isPublished: true,
    isFeatured: true,
    isVerified: true,
    source: 'seed',
    averageRating: 4.8,
    reviewCount: 164,
    depositPercent: 20,
    galleryUrl: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&h=400&fit=crop&q=80'
    ],
    socials: [
      { platform: 'facebook', url: 'https://facebook.com/cruiseapalooza' }
    ],
    packages: [
      {
        id: 'pkg-tr1-1',
        name: 'The 4-Hour Bachelorette Bar Hop Shuttling',
        description: 'Luxury 18-passenger luxury limo coach for up to 4 sequential hours of customized stop pickups. Complete with ice cooler pack, customizable fiber-optic club lights, and heavy bass sound.',
        price: 600,
        duration: '4 Hours'
      },
      {
        id: 'pkg-tr1-2',
        name: 'Wedding Party Full Day Booking',
        description: 'Elite 26-passenger coach for up to 8 hours. Perfect to move bridal party from hotel, to church, then creative photo locations around Milwaukee, and safely drop back to venue.',
        price: 1100,
        duration: '8 Hours'
      }
    ],
    reviews: [
      {
        id: 'rv-tr1-1',
        reviewerName: 'Zachary L.',
        rating: 5,
        body: 'The party bus was extremely clean, our driver Dave was friendly and knew the perfect shortcuts downtown, and the bluetooth sound was incredible. Best party bus company in Milwaukee!',
        createdAt: '2026-05-15',
        isApproved: true
      }
    ],
    availability: ['2026-06-20', '2026-07-04']
  },

  // Wedding Planners
  {
    id: 'planner-1',
    slug: 'evenement-planning',
    name: 'evenement',
    category: 'wedding_planner',
    address: '1024 S 5th St, Milwaukee, WI 53204',
    phone: '(262) 617-8826',
    website: 'https://www.evenementplanning.org',
    email: 'jan@evenementplanning.org',
    bio: "événement is a highly lauded luxury boutique wedding planning firm located in Milwaukee. Founded by Janelle Meyer-Brown, our award-winning firm details precise design coordinate concepts, full vendor management, and flawless logistics for custom events.",
    logoUrl: 'https://images.unsplash.com/photo-1435527173128-983b87201f4d?w=150&h=150&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=450&fit=crop&q=80',
    priceRange: '$$$$',
    serviceAreas: ['Milwaukee County', 'North Shore', 'Oconomowoc', 'Door County'],
    capacity: 'N/A',
    tags: ['Luxury Planner', 'Custom Curation', 'Day-Of Coordination', "Walker's Point", 'Award Winning'],
    isClaimed: false,
    isPublished: true,
    isFeatured: true,
    isVerified: true,
    source: 'seed',
    averageRating: 4.9,
    reviewCount: 78,
    depositPercent: 20,
    galleryUrl: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop&q=80'
    ],
    socials: [
      { platform: 'instagram', url: 'https://instagram.com/evenementmke' }
    ],
    packages: [
      {
        id: 'pkg-pl1-1',
        name: 'The Month-Of Flawless Package',
        description: 'Complete day-of management starting 30 days prior. Includes vendor wrap-up confirmations, timeline synchronization, rehearsal coordination, design supervision, and full 12-hour planner on site for your big day.',
        price: 2100,
        duration: '30 Days'
      },
      {
        id: 'pkg-pl1-2',
        name: 'The Absolute Full-Service Plan',
        description: 'Comprehensive wedding planning from scratch. Budget management, site inspection, priority venue bookings, customized contracts negotiated, graphic styling, tablescapes, and full wedding day crew on site.',
        price: 5500,
        duration: '6+ Months'
      }
    ],
    reviews: [],
    availability: ['2026-06-20', '2026-09-12']
  },

  // Photo Booth
  {
    id: 'booth-1',
    slug: 'the-pixel-booth',
    name: 'The Pixel Booth',
    category: 'photo_booth',
    address: 'Milwaukee, WI 53202',
    phone: '(414) 312-1873',
    website: 'https://www.thepixelbooth.com',
    email: 'hello@thepixelbooth.com',
    bio: 'The Pixel Booth offers modern, sleek open-air digital photo booths across south-eastern Wisconsin. Featuring custom backdrop selections, immediate SMS/Email text deliveries, custom designed overlay borders, and interactive greenscreens.',
    logoUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=150&h=150&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=450&fit=crop&q=80',
    priceRange: '$$',
    serviceAreas: ['Milwaukee', 'Waukesha', 'Racine', 'Oak Creek'],
    capacity: 'Groups up to 10 in frame',
    tags: ['Photo Booth', 'Instant Sharing', 'Open Air', 'Props Kit', 'Digital Overlay'],
    isClaimed: false,
    isPublished: true,
    isFeatured: false,
    isVerified: true,
    source: 'seed',
    averageRating: 4.8,
    reviewCount: 45,
    depositPercent: 20,
    galleryUrl: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop&q=80'
    ],
    socials: [
      { platform: 'instagram', url: 'https://instagram.com/pixelboothmke' }
    ],
    packages: [
      {
        id: 'pkg-b1-1',
        name: 'The 4-Hour Digital Open-Air Package',
        description: 'Elite digital photo booth for up to 4 hours. Includes your choice of sequin/fabric background, super-fun props box, digital live filter overlay, unlimited immediate QR code sharing, and full digital gallery delivery.',
        price: 550,
        duration: '4 Hours'
      }
    ],
    reviews: [],
    availability: []
  },

  // Bars and Clubs (from directory)
  {
    id: 'bar-1',
    slug: '1840-brewing',
    name: '1840 Brewing Company',
    category: 'bar_club',
    address: '342 E Ward St, Milwaukee, Wisconsin 53207',
    phone: '(414) 201-1840',
    website: 'https://www.1840brewing.com',
    email: 'taproom@1840brewing.com',
    bio: '1840 Brewing Company is a slow-crafted craft brewery located in historic Bay View. Named for the year that commercial brewing began in Milwaukee, we craft small rustic-leaning batches, barrel-aged wild ales, hops, and beautiful stouts.',
    logoUrl: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=150&h=150&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=1200&h=450&fit=crop&q=80',
    priceRange: '$$',
    serviceAreas: ['Bay View', 'Milwaukee County'],
    capacity: 'Taproom limits: 80 seated / 120 standing',
    tags: ['Bay View', 'Brewery', 'Rustic Stout', 'Craft Beers', 'Seed List'],
    isClaimed: false,
    isPublished: true,
    isFeatured: true,
    isVerified: true,
    source: 'seed',
    averageRating: 4.8,
    reviewCount: 55,
    depositPercent: 10,
    socials: [],
    packages: [
      {
        id: 'pkg-bar1-1',
        name: 'Taproom Private Beer Tasting',
        description: 'Reserve our historic Cudahy-barrel cellar or main custom taproom for 3 hours. Includes curated flight and walkthrough for up to 25 people by our primary head brewer.',
        price: 450,
        duration: '3 Hours'
      }
    ],
    reviews: [],
    availability: []
  },
  {
    id: 'bar-2',
    slug: 'at-random-bayview',
    name: 'At Random',
    category: 'bar_club',
    address: '2501 S. Delaware Ave, Milwaukee, Wisconsin 53207',
    phone: '(414) 481-8522',
    website: 'https://www.atrandommke.com',
    email: 'drinks@atrandommke.com',
    bio: 'Step back into 1964 at At Random. Located in Bay View, At Random specializes in giant, decadent ice-cream specialty cocktails and retro ambiance. Dim vinyl booths, ambient hums, and vintage music on the record player.',
    logoUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=150&h=150&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&h=450&fit=crop&q=80',
    priceRange: '$$',
    serviceAreas: ['Bay View', 'Milwaukee County'],
    capacity: 'Indoor booths for up to 90',
    tags: ['At Random', 'Bar/Club', 'Bay View', 'Ice Cream Cocktails', 'Retro Retro'],
    isClaimed: false,
    isPublished: true,
    isFeatured: false,
    isVerified: true,
    source: 'seed',
    averageRating: 4.9,
    reviewCount: 92,
    depositPercent: 20,
    socials: [],
    packages: [
      {
        id: 'pkg-bar2-1',
        name: 'Retro Booth Booking with Ice Cream Flight',
        description: 'Guaranteed velvet circular booth booking for up to 8 guests. Includes a gourmet flight of 4 legendary alcoholic milkshakes of your choice to share.',
        price: 120,
        duration: '2 Hours'
      }
    ],
    reviews: [],
    availability: []
  }
]

export const DIRECTORY_FALLBACK: Omit<Vendor, 'reviews' | 'packages' | 'galleryUrl' | 'socials'>[] = [
  {
    id: 'dir-1',
    slug: '42-lounge',
    name: '42 Lounge',
    category: 'bar_club',
    address: '326 E. Mason St., Milwaukee, Wisconsin 53202',
    tags: ['Bar/Club', 'Downtown', 'Gaming', 'Under $12'],
    isClaimed: false,
    isPublished: true,
    isFeatured: false,
    isVerified: false,
    source: 'seed',
    averageRating: 4.3,
    reviewCount: 22,
    depositPercent: 10,
    availability: []
  },
  {
    id: 'dir-2',
    slug: '1983-arcade-bar',
    name: '1983 Arcade Bar',
    category: 'bar_club',
    address: '1110 N Old World 3rd St, Milwaukee, Wisconsin 53203',
    tags: ['Arcade', 'Deer District', 'Beer Tap', 'Downtown'],
    isClaimed: false,
    isPublished: true,
    isFeatured: false,
    isVerified: false,
    source: 'seed',
    averageRating: 4.4,
    reviewCount: 31,
    depositPercent: 10,
    availability: []
  },
  {
    id: 'dir-3',
    slug: 'burnhearts-saloon',
    name: 'Burnhearts',
    category: 'bar_club',
    address: '2599 S Logan Ave, Milwaukee, Wisconsin 53207',
    tags: ['Bay View', 'Craft Beer', 'Miltown Classic', 'Under $12'],
    isClaimed: false,
    isPublished: true,
    isFeatured: false,
    isVerified: false,
    source: 'seed',
    averageRating: 4.7,
    reviewCount: 84,
    depositPercent: 15,
    availability: []
  },
  {
    id: 'dir-4',
    slug: 'whos-on-third-venue',
    name: "Who's On Third",
    category: 'wedding_venue',
    address: '1007 N Old World 3rd St, Milwaukee, WI 53203',
    phone: '(414) 897-8373',
    website: 'https://www.whosonthirdmke.com',
    tags: ['Deer District', 'Tavern Vibe', 'Celebration', 'Indoor Up To 120'],
    isClaimed: false,
    isPublished: true,
    isFeatured: false,
    isVerified: false,
    source: 'seed',
    averageRating: 4.5,
    reviewCount: 16,
    depositPercent: 15,
    availability: []
  },
  {
    id: 'dir-5',
    slug: 'the-westin-wedding',
    name: 'The Westin - Downtown Milwaukee',
    category: 'wedding_venue',
    address: '550 N Van Buren St, Milwaukee, WI 53202',
    phone: '414-224-5224',
    tags: ['Hotel Ballroom', 'Luxury Suite', 'Downtown MKE', 'High capacity'],
    isClaimed: false,
    isPublished: true,
    isFeatured: false,
    isVerified: false,
    source: 'seed',
    averageRating: 4.6,
    reviewCount: 34,
    depositPercent: 20,
    availability: []
  },
  {
    id: 'dir-6',
    slug: 'drybar-wfb',
    name: 'Drybar Whitefish Bay',
    category: 'bachelorette_activity',
    address: '324 E Silver Spring Dr, Whitefish Bay, WI 53217',
    phone: '(414) 395-8075',
    website: 'https://www.drybarshops.com',
    tags: ['Hair styling', 'Whitefish Bay', 'Makeover Party', 'Mimosas'],
    isClaimed: false,
    isPublished: true,
    isFeatured: false,
    isVerified: false,
    source: 'seed',
    averageRating: 4.6,
    reviewCount: 18,
    depositPercent: 15,
    availability: []
  },
  {
    id: 'dir-7',
    slug: 'five-card-studs',
    name: '5 Card Studs',
    category: 'wedding_band',
    address: 'Milwaukee, WI',
    phone: '(414) 961-0137',
    website: 'http://www.fivecardstuds.com',
    tags: ['70s Retro', 'Live Band', 'Wedding Reception', 'Highly energetic'],
    isClaimed: false,
    isPublished: true,
    isFeatured: false,
    isVerified: false,
    source: 'seed',
    averageRating: 4.7,
    reviewCount: 52,
    depositPercent: 20,
    availability: []
  }
]

// LocalStorage helpers to simulate consistent Server-Like DB
export function getSavedVendors(): Vendor[] {
  if (typeof window === 'undefined') return []

  const local = localStorage.getItem('planviry_vendors')
  if (local) {
    try {
      return JSON.parse(local)
    } catch (e) {
      console.error(e)
    }
  }

  // Backfill fallback references into full Vendors if they don't exist yet
  const fullList = [...INITIAL_VENDORS]
  DIRECTORY_FALLBACK.forEach(dir => {
    if (!fullList.some(v => v.id === dir.id)) {
      fullList.push({
        ...dir,
        logoUrl: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=150&h=150&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=450&fit=crop&q=80',
        bio: `${dir.name} is a seeded business located in premium Milwaukee directory. Full description to be claimed by the official representative.`,
        priceRange: '$$',
        serviceAreas: ['Milwaukee County'],
        capacity: dir.capacity || 'Contact for capacity',
        socials: [],
        packages: [
          {
            id: `pkg-${dir.id}-1`,
            name: 'Standard Package',
            description: `Fully customizable standard pricing package for ${dir.name}. Contact vendor directly through dashboard after claiming profile to change description.`,
            price: 1500,
            duration: '4 Hours'
          }
        ],
        reviews: [],
        galleryUrl: []
      } as Vendor)
    }
  })

  saveVendors(fullList)
  return fullList
}

export function saveVendors(vendors: Vendor[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('planviry_vendors', JSON.stringify(vendors))
}

export function getSavedClaims(): ClaimRequest[] {
  if (typeof window === 'undefined') return []
  const local = localStorage.getItem('planviry_claims')
  if (local) {
    try { return JSON.parse(local) } catch { /* ignore */ }
  }
  const defaultClaims: ClaimRequest[] = []
  saveClaims(defaultClaims)
  return defaultClaims
}

export function saveClaims(claims: ClaimRequest[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('planviry_claims', JSON.stringify(claims))
}

export function getSavedSignups(): VendorSignup[] {
  if (typeof window === 'undefined') return []
  const local = localStorage.getItem('planviry_signups')
  if (local) {
    try { return JSON.parse(local) } catch { /* ignore */ }
  }
  const defaultSignups: VendorSignup[] = []
  saveSignups(defaultSignups)
  return defaultSignups
}

export function saveSignups(signups: VendorSignup[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('planviry_signups', JSON.stringify(signups))
}

export function getSavedBookings(): Booking[] {
  if (typeof window === 'undefined') return []
  const local = localStorage.getItem('planviry_bookings')
  if (local) {
    try { return JSON.parse(local) } catch { /* ignore */ }
  }
  const defaultBookings: Booking[] = [
    {
      id: 'book-seed-1',
      vendorId: 'dj-1',
      vendorName: 'Milwaukee Airwaves',
      packageId: 'pkg-dj1-1',
      packageName: 'The Classic Reception Package',
      eventDate: '2026-06-20',
      priceSnapshot: 1850,
      depositAmount: 370,
      status: 'confirmed',
      clientName: 'Sarah & James Wedding',
      clientEmail: 'sarahwedding@gmail.com',
      createdAt: '2026-05-12'
    },
    {
      id: 'book-seed-2',
      vendorId: 'venue-1',
      vendorName: 'The Atrium',
      packageId: 'pkg-v1-1',
      packageName: 'Saturdays Prime Rental',
      eventDate: '2026-06-20',
      priceSnapshot: 6500,
      depositAmount: 975,
      status: 'confirmed',
      clientName: 'Sarah & James Wedding',
      clientEmail: 'sarahwedding@gmail.com',
      createdAt: '2026-05-12'
    }
  ]
  saveBookings(defaultBookings)
  return defaultBookings
}

export function saveBookings(bookings: Booking[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('planviry_bookings', JSON.stringify(bookings))
}

export function getSavedLeads(): Lead[] {
  if (typeof window === 'undefined') return []
  const local = localStorage.getItem('planviry_leads')
  if (local) {
    try { return JSON.parse(local) } catch { /* ignore */ }
  }
  const defaultLeads: Lead[] = [
    {
      id: 'lead-1',
      vendorId: 'dj-1',
      contactName: 'Megan Fox',
      contactEmail: 'meganf@yahoo.com',
      contactPhone: '414-111-2222',
      eventDate: '2026-09-12',
      budget: 2000,
      message: 'Hey Airwaves team, we are looking for a highly interactive DJ for our upcoming September wedding. We saw you have the classic package, and we wanted to know if we can add custom uplighting!',
      category: 'wedding_dj',
      replied: false,
      createdAt: '2026-05-20',
      status: 'new'
    },
    {
      id: 'lead-2',
      vendorId: 'venue-1',
      contactName: 'Marcus Miller',
      contactEmail: 'marcus.m@google.com',
      eventDate: '2026-10-31',
      budget: 8000,
      message: 'Hello, I am interested in renting The Atrium for our fall corporate gala on Halloween night. Do you allow external caterers?',
      category: 'wedding_venue',
      replied: true,
      replies: [
        {
          message: 'Hi Marcus! Absolutely, we have a list of approved premium Milwaukee caterers, but we also allow external options with proof of insurance.',
          createdAt: '2026-05-22'
        }
      ],
      createdAt: '2026-05-21',
      status: 'replied'
    }
  ]
  saveLeads(defaultLeads)
  return defaultLeads
}

export function saveLeads(leads: Lead[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('planviry_leads', JSON.stringify(leads))
}
