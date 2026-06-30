/**
 * Planviry - SEO Landing Page Category Data
 *
 * Powers the SEO landing page system for Milwaukee event vendor marketplace.
 * Each category maps to one or more DB vendor categories and includes
 * Milwaukee-specific SEO content, FAQ schema data, and location targeting.
 */

// ─────────────────────────────────────────────────────────────────────────────
// SHARED LOCATION DATA
// ─────────────────────────────────────────────────────────────────────────────

const NEARBY_CITIES = [
  'Appleton WI',
  'Arlington Heights IL',
  'Brookfield WI',
  'Elgin IL',
  'Evanston IL',
  'Fond Du Lac WI',
  'Green Bay WI',
  'Janesville WI',
  'Kenosha WI',
  'Lake County IL',
  'Northbrook IL',
  'Oshkosh WI',
  'Outagamie County WI',
  'Racine WI',
  'Schaumburg IL',
  'Sheboygan WI',
  'Waukesha WI',
  'Wausau WI',
  'West Bend WI',
  'West Milwaukee WI',
]

const NEIGHBORHOODS = [
  'Avenues West',
  "Brewer's Hill",
  'Downtown',
  'Historic Third Ward',
  'Jones Island',
  'Lower East Side',
  'Midtown',
  'Mitchell Park',
  'Sherman Park',
  "Walker's Point",
]

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export interface SeoCategory {
  slug: string
  dbCategories: string[]
  title: string
  metaTitle: string
  metaDescription: string
  headline: string
  subheadline: string
  searchTerms: string[]
  contentSections: {
    heading: string
    body: string
  }[]
  faq: {
    question: string
    answer: string
  }[]
  nearbyCities: string[]
  neighborhoods: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

export const SEO_CATEGORIES: SeoCategory[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. CORE SERVICE CATEGORIES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: 'milwaukee-djs',
    dbCategories: ['wedding_dj'],
    title: 'DJs in Milwaukee, WI',
    metaTitle: 'DJs in Milwaukee, WI | Planviry',
    metaDescription:
      'Find the best DJs in Milwaukee, WI for weddings, parties, and corporate events. Compare top-rated wedding DJs, Latin music DJs, and karaoke DJs on Planviry.',
    headline: 'Milwaukee DJs That Keep the Party Moving',
    subheadline:
      'From Summerfest-caliber energy to intimate Third Ward receptions, find a Milwaukee DJ who knows how to read the room and keep your dance floor packed.',
    searchTerms: [
      'Wedding DJ',
      'Party DJs',
      'Latin Music DJs',
      'Karaoke DJs',
      'DJ Lessons',
      'DJ Milwaukee',
      'Milwaukee DJ services',
      'wedding DJ Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Milwaukee DJs for Every Occasion',
        body: "Milwaukee's DJ scene runs deep - from the legendary sets at Summerfest's BMO Pavilion to the salsa nights pulsing through Walker's Point. Whether you need a wedding DJ who can seamlessly transition from your first dance to a polka set for the grandparents, or a high-energy party DJ who knows every bachelorette anthem, Milwaukee's DJs bring Brew City soul to every event. Many of our local DJs got their start spinning at Milwaukee Brewing Company events and Third Ward gallery nights.",
      },
      {
        heading: 'What to Look for in a Milwaukee DJ',
        body: "The best Milwaukee DJs do more than press play - they're MCs, crowd-readers, and event architects. Look for DJs who know the difference between a corporate gala at the Pfister Hotel and a quinceañera on the South Side. Top Milwaukee DJs offer customizable playlists, professional sound equipment, and bilingual MC services. Ask about their experience at venues like the Wisconsin Club, Cooperage, and the Harley-Davidson Museum.",
      },
      {
        heading: 'Latin Music DJs in Milwaukee',
        body: "Milwaukee's Latin music scene is vibrant and growing, especially in the Walkers Point and South Side neighborhoods. From salsa and bachata to reggaeton and cumbia, our Latin Music DJs bring authentic rhythms that get everyone on the dance floor. Many specialize in quinceañeras, boda celebrations, and Latin fusion weddings that blend Milwaukee's diverse cultures.",
      },
    ],
    faq: [
      {
        question: 'How much does a DJ cost in Milwaukee, WI?',
        answer:
          'Milwaukee DJ prices typically range from $500 to $2,500 depending on the event type, duration, and equipment needed. Wedding DJs in Milwaukee average $1,000-$1,800 for 4-6 hours. Party DJs and karaoke DJs often start around $400-$800. Latin music specialists may charge a premium for their curated music libraries.',
      },
      {
        question: 'Do Milwaukee DJs provide their own sound equipment?',
        answer:
          "Most professional Milwaukee DJs include sound equipment in their packages - speakers, microphones, and mixing boards. Some also offer add-ons like uplighting, fog machines, and karaoke setups. If your event is at a large venue like the Wisconsin Center, confirm whether the DJ's system can fill the space or if additional AV support is needed.",
      },
      {
        question: 'Can I find a bilingual DJ in Milwaukee?',
        answer:
          'Yes! Milwaukee has a strong selection of bilingual DJs (English/Spanish) who are popular for quinceañeras, Latin weddings, and multicultural events. Many are based in the South Side and Walkers Point neighborhoods and specialize in seamlessly blending English and Spanish music throughout the night.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-wedding-venues',
    dbCategories: ['wedding_venue'],
    title: 'Wedding Venues in Milwaukee, WI',
    metaTitle: 'Wedding Venues in Milwaukee, WI | Planviry',
    metaDescription:
      'Discover stunning wedding venues in Milwaukee, WI. From lakefront estates to industrial-chic lofts in the Third Ward. Browse 100+ venues on Planviry.',
    headline: 'Say "I Do" in Brew City',
    subheadline:
      "From the Calatrava's shadow on Lake Michigan to the exposed brick of Walker's Point lofts, Milwaukee wedding venues blend Great Lakes beauty with Cream City charm.",
    searchTerms: [
      'Wedding Venues',
      'Banquet Halls',
      'Outdoor Event Spaces',
      'Cheap Wedding Venues',
      'wedding venues Milwaukee',
      'Milwaukee wedding venues WI',
    ],
    contentSections: [
      {
        heading: 'Milwaukee Wedding Venues with Lake Michigan Views',
        body: "Few cities can match Milwaukee's lakefront wedding venue options. Venues along the Lake Michigan shoreline - from the elegant Villa Terrace Decorative Arts Museum to the modern Discovery World - offer breathtaking water views as your ceremony backdrop. The Milwaukee Community Sailing Center and lakeside parks in Shorewood and Whitefish Bay provide outdoor ceremony options that capture that signature Great Lakes magic.",
      },
      {
        heading: 'Affordable Wedding Venues in Milwaukee',
        body: "Milwaukee is one of the Midwest's most affordable wedding destination cities. Historic church basements in Bay View, the Mitchell Park Domes pavilion, and community halls throughout Waukesha County offer beautiful spaces at budget-friendly prices. Many Milwaukee banquet halls include catering and bar packages, which can save couples $3,000-$5,000 compared to à la carte venues. The best deals book 12-18 months in advance.",
      },
    ],
    faq: [
      {
        question: 'What is the average cost of a wedding venue in Milwaukee?',
        answer:
          'Milwaukee wedding venue costs range from $1,500 for community halls and church basements to $15,000+ for premium lakefront estates. The average Milwaukee couple spends $4,000-$8,000 on their venue. All-inclusive venues like Cooperage and The Ivy House bundle catering and bar service, often providing better value.',
      },
      {
        question: 'What are the best outdoor wedding venues in Milwaukee?',
        answer:
          "Top outdoor wedding venues in Milwaukee include the Villa Terrace courtyard, Boerner Botanical Gardens in Hales Corners, Lake Park pavilions, and the Milwaukee County Parks system venues. For lakefront ceremonies, check out the Discovery World promenade and South Shore Park. Most outdoor venues in Milwaukee have backup indoor options - essential for Wisconsin's unpredictable weather.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-photographers',
    dbCategories: ['photography'],
    title: 'Photographers in Milwaukee, WI',
    metaTitle: 'Photographers in Milwaukee, WI | Planviry',
    metaDescription:
      'Browse top-rated photographers in Milwaukee, WI for weddings, portraits, and events. Affordable wedding photographers and portrait specialists on Planviry.',
    headline: 'Milwaukee Photographers Who Capture Every Moment',
    subheadline:
      "From golden-hour portraits along the Riverwalk to candid reception moments at the Pfister, Milwaukee's photographers know how to frame the Cream City's unique light.",
    searchTerms: [
      'Photographers',
      'Wedding Photographers',
      'Affordable Photographers',
      'Milwaukee photographer',
      'affordable wedding photographer Milwaukee',
    ],
    contentSections: [
      {
        heading: 'Wedding Photographers in Milwaukee',
        body: "Milwaukee wedding photographers bring a unique blend of Midwestern warmth and artistic vision. Whether you want the editorial look of a Historic Third Ward loft wedding or the natural beauty of a Lake Michigan sunset ceremony, our local photographers know every Instagram-worthy spot in the city. Many offer engagement sessions at iconic Milwaukee locations like the Milwaukee Art Museum wings, the Riverwalk, or the Mitchell Park Domes.",
      },
      {
        heading: 'Affordable Photographers in Milwaukee',
        body: "You don't need a massive budget for great photography in Milwaukee. Emerging photographers from MIAD (Milwaukee Institute of Art & Design) and UW-Milwaukee's photography programs offer professional-quality work at student-friendly rates. Many established Milwaukee studios also offer off-season discounts (January-March) and mini-session packages starting at $200-$400.",
      },
    ],
    faq: [
      {
        question: 'How much does a wedding photographer cost in Milwaukee?',
        answer:
          'Milwaukee wedding photographers range from $800 for half-day coverage to $5,000+ for full-day luxury packages. The average Milwaukee couple spends $1,500-$3,000 on wedding photography. Many photographers offer tiered packages - basic coverage (6 hours, 1 photographer) starts around $1,200, while premium packages include engagement sessions, second shooters, and albums.',
      },
      {
        question: 'Where are the best photo spots in Milwaukee for engagement photos?',
        answer:
          "Popular Milwaukee engagement photo locations include the Milwaukee Art Museum and Calatrava wing, the Historic Third Ward streets and Riverwalk, Lake Park, Villa Terrace, Bradford Beach at sunset, the Mitchell Park Domes, and the Harley-Davidson Museum plaza. Your photographer will have secret spots too - ask about their favorite hidden gems.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-videographers',
    dbCategories: ['videography'],
    title: 'Videographers in Milwaukee, WI',
    metaTitle: 'Videographers in Milwaukee, WI | Planviry',
    metaDescription:
      'Find professional videographers in Milwaukee, WI for weddings and events. Affordable wedding videographers and cinematic film specialists on Planviry.',
    headline: 'Milwaukee Videographers Who Tell Your Story',
    subheadline:
      "From cinematic wedding films featuring Milwaukee's skyline to corporate event coverage at the Wisconsin Center, our videographers turn your moments into movies.",
    searchTerms: [
      'Videographers',
      'Wedding Videographers',
      'Affordable Wedding Videographer',
      'Milwaukee videographer',
      'wedding video Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Wedding Videography in Milwaukee',
        body: "Milwaukee's wedding videographers have elevated their craft to cinematic levels. Using drone footage over Lake Michigan, same-day edits that debut at your reception, and documentary-style storytelling, our local videographers create films that capture the emotion of your day. Many shoot at iconic Milwaukee venues - from the stained glass of the Basilica of St. Josaphat to the industrial elegance of the Pritzlaff Building.",
      },
      {
        heading: 'Affordable Wedding Videographers in Milwaukee',
        body: "Great wedding videography in Milwaukee doesn't require a Hollywood budget. Many local videographers offer highlight reel packages starting at $1,000-$1,500 that capture the essential moments of your day in a 3-5 minute film. For couples on a tight budget, some Milwaukee videographers partner with photographers to offer combined photo-and-video packages at significant savings.",
      },
    ],
    faq: [
      {
        question: 'How much does wedding videography cost in Milwaukee?',
        answer:
          'Milwaukee wedding videography ranges from $800 for basic highlight reels to $5,000+ for full cinematic packages with drone footage and same-day edits. The average Milwaukee couple spends $1,500-$3,000. Many videographers offer three tiers: highlight only (3-5 min), feature film (15-20 min), and documentary-style full edit.',
      },
      {
        question: 'Do Milwaukee videographers offer drone footage?',
        answer:
          'Yes, many Milwaukee videographers are FAA-certified drone operators. Drone footage is especially stunning at Milwaukee lakefront venues, the Harley-Davidson Museum grounds, and outdoor venues in Waukesha County. Expect to add $200-$500 for drone coverage to your video package.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-caterers',
    dbCategories: ['catering'],
    title: 'Caterers in Milwaukee, WI',
    metaTitle: 'Caterers in Milwaukee, WI | Planviry',
    metaDescription:
      'Find top caterers in Milwaukee, WI for weddings, parties, and corporate events. Wedding catering, party catering, and small party catering on Planviry.',
    headline: 'Milwaukee Catering That Feeds the Soul',
    subheadline:
      "From classic Wisconsin supper club fare to globally-inspired menus, Milwaukee's caterers bring Cream City flavor to every event - cheese curds optional (but recommended).",
    searchTerms: [
      'Catering Services',
      'Wedding Catering',
      'Party Catering',
      'Small Party Catering',
      'Caterers Milwaukee WI',
      'catering Milwaukee',
    ],
    contentSections: [
      {
        heading: 'Milwaukee Catering for Weddings and Events',
        body: "Milwaukee's catering scene has evolved far beyond bratwurst and cheese curds (though we love those too). Today's Milwaukee caterers offer everything from farm-to-table menus featuring Wisconsin artisan cheeses to globally-inspired stations with flavors from the city's rich German, Polish, and Mexican heritage. Whether you're hosting 300 guests at the Wisconsin Club or an intimate dinner for 30 in a Bay View backyard, Milwaukee caterers deliver.",
      },
      {
        heading: 'Small Party Catering in Milwaukee',
        body: "Not every event needs a full-service catered dinner. Milwaukee's small party caterers specialize in intimate gatherings - think artisanal appetizer spreads for your Third Ward loft party, family-style dinners for a birthday in Wauwatosa, or taco bars that bring South Side flavor to your backyard bash. Many offer drop-off catering starting at $15-$25 per person.",
      },
    ],
    faq: [
      {
        question: 'How much does catering cost in Milwaukee, WI?',
        answer:
          'Milwaukee catering costs range from $15-$25 per person for drop-off appetizers and buffet options to $75-$150+ per person for plated dinner service. The average Milwaukee wedding spends $45-$85 per person on catering. Many Milwaukee caterers include Wisconsin staples like cheese curds, bratwurst, and custard in their packages.',
      },
      {
        question: 'Do Milwaukee caterers provide bartending services?',
        answer:
          'Many Milwaukee caterers offer full bar service as an add-on, including licensed bartenders, glassware, and mixers. Some venues like the Cooperage and Ivy House require you to use their in-house bar service. If your caterer doesn\'t provide bartending, Planviry lists standalone bartending services that pair well with any caterer.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-florists',
    dbCategories: ['florist'],
    title: 'Florists in Milwaukee, WI',
    metaTitle: 'Florists in Milwaukee, WI | Planviry',
    metaDescription:
      'Discover the best florists in Milwaukee, WI for weddings, events, and flower delivery. Floral designers and local flower shops on Planviry.',
    headline: 'Milwaukee Florists Who Bring Blooms to Life',
    subheadline:
      "From lush bridal bouquets inspired by Boerner Botanical Gardens to avant-garde installations in Third Ward galleries, Milwaukee's floral designers are true artists.",
    searchTerms: [
      'Florists',
      'Floral Designers',
      'Flower Delivery',
      'Milwaukee florist',
      'wedding flowers Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Wedding Florists in Milwaukee',
        body: "Milwaukee's wedding florists draw inspiration from the city's stunning seasonal changes - spring blooms at Boerner Botanical Gardens, summer wildflowers along the Lake Michigan shoreline, and the rich amber tones of a Wisconsin autumn. Local florists specialize in everything from classic white wedding arrangements to bohemian dried-flower installations popular in Third Ward loft venues. Many source from Wisconsin flower farms for truly local arrangements.",
      },
      {
        heading: 'Flower Delivery in Milwaukee',
        body: "Need same-day flower delivery in Milwaukee? Our local florists deliver throughout the metro area - from Downtown high-rises to Shorewood bungalows and Wauwatosa Tudors. Many offer subscription services for weekly fresh arrangements, perfect for Milwaukee's many corporate offices and restaurants in the Historic Third Ward.",
      },
    ],
    faq: [
      {
        question: 'How much do wedding flowers cost in Milwaukee?',
        answer:
          'Milwaukee wedding florals typically range from $1,000 for basic ceremony and bridal party flowers to $5,000+ for full venue installations. The average Milwaukee couple spends $1,500-$3,000 on wedding flowers. Popular seasonal choices like peonies in June and dahlias in September can affect pricing.',
      },
      {
        question: 'Do Milwaukee florists offer event setup and breakdown?',
        answer:
          'Most Milwaukee florists include delivery and basic setup in their wedding packages. Full venue installation (ceremony arches, reception centerpieces, overhead installations) typically adds $200-$500. Some florists also handle breakdown at the end of the night, which is especially helpful at venues with strict cleanup windows.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-event-planners',
    dbCategories: ['wedding_planner'],
    title: 'Event Planners in Milwaukee, WI',
    metaTitle: 'Event Planners in Milwaukee, WI | Planviry',
    metaDescription:
      'Hire the best event planners in Milwaukee, WI for weddings, corporate events, and private parties. Wedding planners and party planners on Planviry.',
    headline: 'Milwaukee Event Planners Who Handle Every Detail',
    subheadline:
      "From full-service wedding planning to day-of coordination, Milwaukee's event planners turn your vision into reality - so you can actually enjoy your own party.",
    searchTerms: [
      'Event Planners',
      'Wedding Planner',
      'Party Planner',
      'Birthday Party Planner',
      'event planner Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Milwaukee Event Planners for Every Budget',
        body: "Milwaukee's event planning scene has something for every budget and style. Full-service wedding planners handle everything from venue selection at the Wisconsin Club to coordinating your final dance at The Cooperage. Day-of coordinators - popular with Milwaukee couples who want to plan their own wedding but need a pro at the helm on the big day - typically start around $800-$1,200. Corporate event planners in Milwaukee specialize in everything from Summerfest-adjacent activations to polished galas at the Pfister.",
      },
      {
        heading: 'Party Planners in Milwaukee',
        body: "Milwaukee's party planners specialize in making every celebration unforgettable - from kids' birthday bashes with bounce houses in Wauwatosa to milestone 50th birthday galas at the Milwaukee Yacht Club. They know which venues welcome late-night dancing, which caterers make the best cheese curds, and which photo booth companies have the funniest props. A great Milwaukee party planner is worth their weight in Spotted Cow.",
      },
    ],
    faq: [
      {
        question: 'How much does an event planner cost in Milwaukee?',
        answer:
          'Milwaukee event planner costs vary widely: day-of coordination starts at $800-$1,500, partial planning runs $2,000-$4,000, and full-service wedding planning ranges from $3,500-$10,000+. Corporate event planners typically charge 15-20% of the total event budget. Many Milwaukee planners offer free initial consultations.',
      },
      {
        question: 'Do I need an event planner for a Milwaukee wedding?',
        answer:
          'While not required, a Milwaukee event planner can save you time, money, and stress. They have established relationships with Milwaukee venues and vendors, know which dates book up fast (Summerfest weekends are tough), and can navigate Wisconsin-specific requirements like liquor licensing and outdoor event permits. Even day-of coordination can be a game-changer.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-photo-booth-rentals',
    dbCategories: ['photo_booth'],
    title: 'Photo Booth Rentals in Milwaukee, WI',
    metaTitle: 'Photo Booth Rentals in Milwaukee, WI | Planviry',
    metaDescription:
      'Book photo booth rentals in Milwaukee, WI for weddings, parties, and events. Open-air booths, 360 booths, and karaoke rentals on Planviry.',
    headline: 'Photo Booth Rentals in Milwaukee',
    subheadline:
      "From classic enclosed booths to viral 360 spin cameras, Milwaukee's photo booth companies bring the fun - and the props - to every celebration.",
    searchTerms: [
      'Photo Booth Rentals',
      'Karaoke Rental',
      'photo booth Milwaukee',
      '360 photo booth Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Milwaukee Photo Booth Options',
        body: "Milwaukee's photo booth companies have upped their game with options that go way beyond the mall booths of yesteryear. Open-air photo booths with custom Milwaukee-themed backdrops (think Fiserv Forum, the Calatrava, or a retro cream city brick wall) are wedding staples. The 360-degree spinning video booths are the hottest trend at Milwaukee bachelorette parties and Sweet 16s. Many companies also offer green screen technology so your guests can pose in front of any backdrop imaginable.",
      },
      {
        heading: 'Photo Booth Pricing in Milwaukee',
        body: "Milwaukee photo booth rentals typically run $400-$900 for 3-4 hours, with most companies including unlimited prints, a props box, and a digital gallery. Premium add-ons like custom logos on photo strips, scrapbooking stations, and 360 video booths can push the total to $1,000-$1,500. Many Milwaukee photo booth companies offer discounts for weekday and off-season events (January-March).",
      },
    ],
    faq: [
      {
        question: 'How much does a photo booth rental cost in Milwaukee?',
        answer:
          'Photo booth rentals in Milwaukee range from $350 for basic 2-hour packages to $1,200+ for premium 360 video booths. The average Milwaukee event spends $500-$700 for a 4-hour photo booth rental with unlimited prints and props. Most companies include setup, breakdown, and an on-site attendant.',
      },
      {
        question: 'What types of photo booths are available in Milwaukee?',
        answer:
          'Milwaukee photo booth companies offer enclosed traditional booths, open-air photo stations, 360-degree spinning video booths, GIF booths, green screen booths, and mirror photo booths. The 360 video booth has become extremely popular for Milwaukee bachelorette parties, proms, and corporate events. Many companies also offer karaoke rental as a bundled add-on.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-bartenders',
    dbCategories: ['bar_club'],
    title: 'Bartenders in Milwaukee, WI',
    metaTitle: 'Bartenders in Milwaukee, WI | Planviry',
    metaDescription:
      'Hire professional bartenders in Milwaukee, WI for weddings, parties, and corporate events. Mobile bartender services and mixologists on Planviry.',
    headline: 'Milwaukee Bartenders Who Mix It Up Right',
    subheadline:
      "From classic Old Fashioneds to craft cocktail bars, Milwaukee's mobile bartenders bring Brew City's legendary drinking culture to your event.",
    searchTerms: [
      'Bartenders',
      'Bartender Services',
      'mobile bartender Milwaukee',
      'bartender for hire Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Milwaukee Bartender Services for Events',
        body: "Milwaukee takes its drinks seriously - this is Brew City, after all. Professional bartender services in Milwaukee range from certified mixologists who craft custom cocktail menus to experienced event bartenders who can pour 200 Old Fashioneds an hour. Many Milwaukee bartending services include bar setup, glassware rental, ice management, and even signature cocktail creation featuring local spirits from Great Lakes Distillery and Central Waters.",
      },
      {
        heading: 'What Milwaukee Bartenders Bring to Your Event',
        body: "Hiring a Milwaukee bartender means more than just someone to pour drinks. The best services bring their own portable bars (perfect for outdoor events at Lake Park or Boerner Botanical Gardens), handle TIPS-certified responsible service, and manage the legal requirements for serving alcohol at Wisconsin events. Some even offer themed bar setups - a Milwaukee beer garden station, a Prohibition-era speakeasy cart, or a tropical tiki bar for summer parties.",
      },
    ],
    faq: [
      {
        question: 'How much do bartenders cost in Milwaukee, WI?',
        answer:
          'Milwaukee bartender services typically charge $25-$50 per hour per bartender, with most events requiring 1 bartender per 50-75 guests. Many companies have a 4-hour minimum. Full-service mobile bar packages (including bartenders, portable bar, glassware, and ice) range from $500-$1,500 depending on guest count.',
      },
      {
        question: 'Do I need a liquor license for my Milwaukee event?',
        answer:
          'If you\'re serving alcohol at a private event on private property in Milwaukee, you generally don\'t need a special license - but the rules change for public venues and events where alcohol is sold. Your bartender service can advise on Milwaukee\'s specific requirements. Many Milwaukee bartending companies carry their own liability insurance and handle permit requirements.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-party-rentals',
    dbCategories: ['decor_rentals'],
    title: 'Party Rentals in Milwaukee, WI',
    metaTitle: 'Party Rentals in Milwaukee, WI | Planviry',
    metaDescription:
      'Find party equipment rentals in Milwaukee, WI - tables, chairs, tents, dance floors, linens, and dinnerware. Full-service party rental companies on Planviry.',
    headline: 'Milwaukee Party Rentals for Every Event',
    subheadline:
      "From elegant chiavari chairs at a Third Ward wedding to bounce houses at a Wauwatosa birthday bash, Milwaukee's party rental companies have you covered.",
    searchTerms: [
      'Party Equipment Rentals',
      'Chair and Table Rentals',
      'Tent Rental',
      'Dinnerware Rental',
      'Dance Floor Rental',
      'Linen Rental',
      'Furniture Rental',
      'party rentals Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Complete Party Rental Solutions in Milwaukee',
        body: "Milwaukee's party rental companies are the backbone of every great event in Brew City. Whether you need 300 chiavari chairs for a wedding at The Cooperage, a 60-foot tent for a backyard graduation party in Brookfield, or a portable dance floor for your corporate holiday party at the Wisconsin Center, local rental companies deliver - literally. Many offer same-day delivery and setup throughout Milwaukee County and the surrounding suburbs.",
      },
      {
        heading: 'Tent and Canopy Rentals for Milwaukee Events',
        body: "Wisconsin weather is famously unpredictable - that's why tent rentals are essential for any Milwaukee outdoor event from May through October. Local rental companies offer everything from 10x10 pop-up canopies for craft fairs to pole tents seating 500 guests for festival-style weddings. Frame tents with sidewalls and heating extend the outdoor season well into Milwaukee's crisp autumn months.",
      },
    ],
    faq: [
      {
        question: 'How much do party rentals cost in Milwaukee?',
        answer:
          'Milwaukee party rental pricing varies by item: tables run $8-$15 each, chairs $3-$10 each (chiavari chairs are higher), linen sets $12-$25 per table, and tent rentals range from $200 for small pop-ups to $3,000+ for large event tents. Most Milwaukee rental companies offer package discounts for multi-item orders and deliver throughout the metro area.',
      },
      {
        question: 'Do Milwaukee party rental companies provide setup and breakdown?',
        answer:
          'Most Milwaukee party rental companies include delivery and pickup in their pricing, but setup and breakdown services vary. Table and chair setup typically adds $1-$3 per item. Tent installation is almost always included in the tent rental price and must be done by professionals. Dance floor and staging setup is also typically included.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-balloon-services',
    dbCategories: ['favors_gifts'],
    title: 'Balloon Services in Milwaukee, WI',
    metaTitle: 'Balloon Services in Milwaukee, WI | Planviry',
    metaDescription:
      'Find balloon services in Milwaukee, WI - balloon arches, balloon artists, party decorations, and custom balloon installations on Planviry.',
    headline: 'Milwaukee Balloon Services That Pop',
    subheadline:
      "From jaw-dropping balloon arches at the Wisconsin Center to whimsical balloon artists at kids' parties, Milwaukee's balloon pros make every event colorful.",
    searchTerms: [
      'Balloon Services',
      'Balloon Arch',
      'Balloon Artist',
      'Balloons',
      'Party Decorations',
      'balloon delivery Milwaukee',
    ],
    contentSections: [
      {
        heading: 'Balloon Arch Services in Milwaukee',
        body: "Balloon arches have become the must-have decoration for Milwaukee events - from the grand entrance at quinceañeras on the South Side to the photo backdrop at corporate galas in the Third Ward. Milwaukee balloon artists create stunning organic garlands, classic spiral arches, and custom balloon walls featuring brand colors or wedding palettes. Popular setups include the balloon arch over the dance floor at The Cooperage and organic garlands framing the Milwaukee skyline at rooftop venues.",
      },
      {
        heading: 'Balloon Artists for Milwaukee Kids Parties',
        body: "Milwaukee's balloon artists bring joy to birthday parties, school events, and festivals throughout the city. From simple sword-and-dog creations to elaborate superhero and princess sculptures, these entertainers keep kids mesmerized. Many Milwaukee balloon artists also offer face painting, magic shows, and party character packages for a complete entertainment experience at your Wauwatosa, Shorewood, or Bay View celebration.",
      },
    ],
    faq: [
      {
        question: 'How much does a balloon arch cost in Milwaukee?',
        answer:
          'Milwaukee balloon arch prices range from $150 for a standard 6-foot arch to $500+ for large organic installations. Custom balloon walls and ceiling installations can run $800-$2,000+. Most Milwaukee balloon artists include delivery, setup, and breakdown in their pricing. Prices increase for outdoor installations and same-day requests.',
      },
      {
        question: 'Do Milwaukee balloon services offer delivery?',
        answer:
          'Yes, most Milwaukee balloon services include delivery and setup within the metro area. Some charge a delivery fee for locations beyond Milwaukee County (like Waukesha or Racine). Balloon arches and large installations are almost always delivered and professionally set up to ensure they look perfect for your event.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-officiants',
    dbCategories: ['officiant'],
    title: 'Officiants in Milwaukee, WI',
    metaTitle: 'Officiants in Milwaukee, WI | Planviry',
    metaDescription:
      'Find wedding officiants and chapels in Milwaukee, WI. Non-denominational, interfaith, and civil celebrants for your Milwaukee ceremony on Planviry.',
    headline: 'Milwaukee Officiants for Your Perfect Ceremony',
    subheadline:
      "From traditional church ceremonies at the Basilica of St. Josaphat to lakeside vows on the Lake Michigan shore, Milwaukee officiants help you say it your way.",
    searchTerms: [
      'Officiants',
      'Wedding Chapels',
      'wedding officiant Milwaukee',
      'Milwaukee officiant WI',
    ],
    contentSections: [
      {
        heading: 'Wedding Officiants in Milwaukee',
        body: "Milwaukee offers a diverse range of wedding officiants to match every couple's style and beliefs. Non-denominational ministers, interfaith celebrants, and civil officiants serve the metro area with personalized ceremonies that reflect your unique love story. Many Milwaukee officiants incorporate local touches - readings from Wisconsin poets, references to where you met in the city, or even a blessing in one of Milwaukee's many heritage languages.",
      },
      {
        heading: 'Milwaukee Wedding Chapels',
        body: "From the stunning Basilica of St. Josaphat on the South Side to intimate chapel spaces at the Villa Terrace and the我校 Milwaukee County Historical Society, Milwaukee's wedding chapels offer settings from grand to cozy. Some couples choose Milwaukee's historic churches for their architectural beauty, while others prefer the simplicity of a justice of the peace ceremony at the Milwaukee County Courthouse.",
      },
    ],
    faq: [
      {
        question: 'How much does a wedding officiant cost in Milwaukee?',
        answer:
          'Milwaukee wedding officiants typically charge $150-$500, with most falling in the $200-$350 range. This usually includes a pre-wedding meeting, ceremony customization, and the ceremony itself. Some officiants charge travel fees for venues outside Milwaukee County. Religious officiants may request a donation to their congregation instead of a fee.',
      },
      {
        question: 'Can a friend or family member officiate a wedding in Milwaukee?',
        answer:
          "Yes! Wisconsin allows one-time officiant authorization through organizations like the Universal Life Church or American Marriage Ministries. Your friend or family member can get ordained online in minutes. Milwaukee County requires the officiant to sign the marriage license after the ceremony. It's a popular option for couples who want a deeply personal ceremony.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-musicians',
    dbCategories: ['wedding_band'],
    title: 'Musicians in Milwaukee, WI',
    metaTitle: 'Musicians in Milwaukee, WI | Planviry',
    metaDescription:
      'Find musicians, wedding bands, and live music in Milwaukee, WI. From jazz ensembles to cover bands, book live entertainment on Planviry.',
    headline: 'Live Music in Milwaukee - Beyond Summerfest',
    subheadline:
      "From jazz trios at Third Ward cocktail hours to 10-piece cover bands that pack the Pritzlaff Building, Milwaukee's musicians bring world-class live entertainment to your event.",
    searchTerms: [
      'Musicians',
      'Wedding Band',
      'Live Music',
      'Milwaukee wedding band',
      'live music Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Wedding Bands in Milwaukee',
        body: "Milwaukee's live music scene extends far beyond Summerfest - though many of our best wedding band musicians have graced those iconic stages. From elegant string quartets for your ceremony at the Basilica of St. Josaphat to high-energy 10-piece cover bands that keep the dance floor packed at The Cooperage, Milwaukee has world-class talent. Local bands specialize in everything from Motown and R&B to country, Top 40, and the polka sets that no Wisconsin wedding should be without.",
      },
      {
        heading: 'Live Music Options for Milwaukee Events',
        body: "Milwaukee events deserve live music - it's what sets Brew City apart. Jazz ensembles for cocktail hours at the Pfister Hotel, acoustic duos for lakeside ceremonies, mariachi bands for quinceañeras, and brass bands for second-line processionals through the Third Ward. Many Milwaukee musicians offer ceremony-to-reception packages that seamlessly transition from your walk-down-aisle music to the party soundtrack.",
      },
    ],
    faq: [
      {
        question: 'How much does a wedding band cost in Milwaukee?',
        answer:
          'Milwaukee wedding bands range from $1,500 for a 3-piece acoustic ensemble to $8,000+ for a 10-piece premium cover band. The average Milwaukee couple spends $3,000-$5,000 on live music. Most bands offer 3-4 hour packages with breaks. Solo musicians and duos start around $500-$1,200 for ceremony or cocktail hour coverage.',
      },
      {
        question: 'What kind of live music is popular at Milwaukee weddings?',
        answer:
          'Milwaukee couples love a mix of genres - jazz or string ensembles for ceremonies, acoustic covers for cocktail hours, and high-energy dance bands for receptions. Many Milwaukee wedding bands include polka sets (it\'s Wisconsin, after all) and Motown classics. Latin bands featuring salsa, cumbia, and bachata are also in high demand for Milwaukee\'s multicultural celebrations.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-hair-makeup',
    dbCategories: ['hair_makeup'],
    title: 'Hair & Makeup in Milwaukee, WI',
    metaTitle: 'Hair & Makeup in Milwaukee, WI | Planviry',
    metaDescription:
      'Find hair and makeup artists in Milwaukee, WI for weddings and events. Bridal hair stylists and professional makeup artists on Planviry.',
    headline: 'Milwaukee Hair & Makeup Artists for Your Big Day',
    subheadline:
      "From bridal glam at the Pfister Hotel to editorial-style beauty for Third Ward photo shoots, Milwaukee's hair and makeup artists make you look and feel stunning.",
    searchTerms: [
      'Hair & Makeup',
      'Makeup Artists',
      'bridal hair Milwaukee',
      'makeup artist Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Bridal Hair & Makeup in Milwaukee',
        body: "Milwaukee's bridal hair and makeup artists specialize in looks that last through Wisconsin weather - from humid lakefront ceremonies in July to crisp outdoor autumn weddings in Waukesha County. Whether you want a classic updo for your ceremony at the Basilica of St. Josaphat or bohemian waves for a Lake Michigan beach wedding, our local beauty pros have the skills and the staying power. Many offer on-location services so you can get ready at your venue or hotel.",
      },
      {
        heading: 'What Milwaukee Makeup Artists Offer',
        body: "Professional makeup artists in Milwaukee go beyond basic beauty - they offer airbrush application for flawless, long-lasting coverage, lash application, and even special effects makeup for Halloween events and themed parties. Many Milwaukee MUAs specialize in diverse skin tones and offer bilingual consultations. Trial runs are standard for weddings, typically scheduled 1-2 months before the big day.",
      },
    ],
    faq: [
      {
        question: 'How much does bridal hair and makeup cost in Milwaukee?',
        answer:
          'Milwaukee bridal hair and makeup packages range from $200-$500 for the bride, with additional bridal party members at $100-$200 each. Most artists require a trial run ($75-$150) before the wedding. Full bridal party packages (bride + 4-6 attendants) typically run $800-$1,800. On-location service fees in Milwaukee are usually included within the metro area.',
      },
      {
        question: 'Do Milwaukee hair and makeup artists travel to my venue?',
        answer:
          'Yes, most Milwaukee hair and makeup artists offer on-location services. They\'ll come to your hotel (the Pfister and Saint Kate are popular getting-ready spots), your home, or your venue. Some charge a travel fee for locations outside Milwaukee County. Many bring their own lighting, chairs, and full kits - you just provide the space and the mimosas.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-transportation',
    dbCategories: ['transportation'],
    title: 'Transportation in Milwaukee, WI',
    metaTitle: 'Transportation in Milwaukee, WI | Planviry',
    metaDescription:
      'Book transportation services in Milwaukee, WI - party bus rentals, limo services, and wedding shuttles. Get your crew there in style on Planviry.',
    headline: 'Milwaukee Transportation - Arrive in Style',
    subheadline:
      "From party buses rolling through Downtown to vintage trolleys along the Lake Michigan shore, Milwaukee's transportation services get your crew there safely and stylishly.",
    searchTerms: [
      'Transportation Services',
      'Party Bus Rentals',
      'limo service Milwaukee',
      'party bus Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Party Bus Rentals in Milwaukee',
        body: "Milwaukee's party bus scene is legendary - from bachelorette parties cruising down Water Street to wedding parties shuttling between the Basilica of St. Josaphat and Third Ward reception venues. Modern party buses feature LED lighting, premium sound systems, dance poles, and even onboard bars (BYOB, of course). Most Milwaukee party bus companies offer 2-hour minimum rentals with options for multiple stops throughout the city.",
      },
      {
        heading: 'Wedding Transportation in Milwaukee',
        body: "Coordinating transportation for your Milwaukee wedding doesn't have to be stressful. Local companies offer vintage car rentals for the bride and groom, shuttle buses for guests between hotels and venues, and trolley rentals that add Milwaukee charm to your celebration. Popular routes include the scenic Lake Shore Drive between venues and the charming streets of the Third Ward and Downtown.",
      },
    ],
    faq: [
      {
        question: 'How much does a party bus cost in Milwaukee?',
        answer:
          'Milwaukee party bus rentals range from $150-$300 per hour depending on the bus size (12-40 passengers) and amenities. Most companies require a 3-4 hour minimum. A typical 4-hour bachelorette party bus rental runs $600-$1,200. Wedding shuttle services start around $500 for round-trip guest transport.',
      },
      {
        question: 'Can I drink on a party bus in Milwaukee?',
        answer:
          "Yes! Wisconsin law allows open containers on chartered vehicles like party buses and limos - as long as the driver is properly licensed and the vehicle is commercially registered. Most Milwaukee party bus companies allow BYOB and provide coolers and ice. Some premium packages include a stocked bar with mixers and glassware.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-custom-cakes',
    dbCategories: ['wedding_cake'],
    title: 'Custom Cakes in Milwaukee, WI',
    metaTitle: 'Custom Cakes in Milwaukee, WI | Planviry',
    metaDescription:
      'Order custom cakes in Milwaukee, WI - wedding cakes, birthday cakes, and custom cookies from top Milwaukee bakers. Find your perfect cake on Planviry.',
    headline: 'Milwaukee Custom Cakes Worth the Calories',
    subheadline:
      "From elegant multi-tier wedding cakes to whimsical custom cookies, Milwaukee's bakers create edible art that tastes as incredible as it looks.",
    searchTerms: [
      'Custom Cakes',
      'Wedding Cakes',
      'Custom Cookies',
      'custom cake Milwaukee',
      'wedding cake Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Wedding Cakes in Milwaukee',
        body: "Milwaukee's wedding cake designers have earned national recognition for their artistry and flavor. From classic buttercream tiers adorned with sugar flowers inspired by Boerner Botanical Gardens to modern semi-naked cakes that complement industrial Third Ward venues, our local bakers do it all. Popular Milwaukee wedding cake flavors include traditional vanilla bean, dark chocolate with cherry filling (a nod to Wisconsin's Door County cherries), and the ever-popular carrot cake with cream cheese frosting.",
      },
      {
        heading: 'Custom Cookies and Dessert Bars',
        body: "Custom decorated cookies have become a Milwaukee event staple - from wedding favor cookies featuring the Milwaukee skyline to elaborate birthday cookie sets with every theme imaginable. Many Milwaukee bakers also offer dessert bar setups that include a mix of mini cupcakes, cake pops, macarons, and custom cookies, giving your guests variety and your Instagram feed plenty of material.",
      },
    ],
    faq: [
      {
        question: 'How much does a wedding cake cost in Milwaukee?',
        answer:
          'Milwaukee wedding cakes typically cost $4-$12 per slice, with the average 3-tier cake for 150 guests running $500-$1,200. Custom sugar flower work, metallic accents, and complex designs increase the price. Many Milwaukee bakers include a complimentary tasting consultation when you book. Cupcake towers and dessert bars are popular budget-friendly alternatives starting at $3-$6 per serving.',
      },
      {
        question: 'How far in advance should I order a custom cake in Milwaukee?',
        answer:
          "For wedding cakes, Milwaukee bakers recommend booking 4-6 months in advance, especially for peak summer wedding season (June-September). Custom birthday cakes and event cakes typically need 2-4 weeks' notice. Custom cookie orders with detailed designs should be placed 3-4 weeks ahead. Holiday seasons and Summerfest weekends book up early.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-decor-rentals',
    dbCategories: ['decor_rentals'],
    title: 'Decor Rentals in Milwaukee, WI',
    metaTitle: 'Decor Rentals in Milwaukee, WI | Planviry',
    metaDescription:
      'Find decor rentals in Milwaukee, WI - lighting, props, canopy and tent rentals, and event design. Transform your venue on Planviry.',
    headline: 'Milwaukee Decor Rentals That Transform Any Space',
    subheadline:
      "From dramatic uplighting at the Pritzlaff Building to vintage props for a Third Ward loft wedding, Milwaukee's decor rental companies turn ordinary spaces into extraordinary events.",
    searchTerms: [
      'Decor Rentals',
      'Lighting Rental',
      'Props',
      'Canopy & Tent Rental',
      'decor rental Milwaukee WI',
      'event decor Milwaukee',
    ],
    contentSections: [
      {
        heading: 'Event Decor Rentals in Milwaukee',
        body: "Milwaukee's decor rental companies can transform any space - from a blank-canvas warehouse in Walker's Point to a traditional banquet hall in Waukesha. Popular decor rental items include vintage furniture groupings for lounge areas, custom signage, ceremony arches, draping and ceiling treatments, and themed props for corporate events and brand activations. Many Milwaukee decor companies also offer full event design services, creating cohesive looks from concept to installation.",
      },
      {
        heading: 'Lighting Rentals in Milwaukee',
        body: "Lighting can make or break your Milwaukee event's ambiance. Local rental companies offer everything from romantic string light canopies for outdoor garden parties to dramatic uplighting that transforms the Pritzlaff Building's exposed brick walls into a colorful backdrop. Pin-spot lighting for centerpieces, monogram projections on dance floors, and Edison bulb installations for that trendy industrial look are all popular choices at Milwaukee venues.",
      },
    ],
    faq: [
      {
        question: 'How much does event decor rental cost in Milwaukee?',
        answer:
          'Milwaukee decor rental costs vary widely depending on scope. Basic packages (centerpieces, signage, table decor) start at $500-$1,500. Full venue transformations with draping, lighting, and custom installations run $2,500-$10,000+. Lighting-only packages start around $500 for basic uplighting and go up to $3,000+ for comprehensive lighting design with pin spots and gobos.',
      },
      {
        question: 'Do Milwaukee decor rental companies handle installation?',
        answer:
          'Yes, most Milwaukee decor rental companies include professional installation and breakdown. Complex installations like ceiling draping, chandelier hanging, and elaborate lighting rigs require professional installation and are always included. Some companies also offer design consultations to help you plan your decor scheme before you commit to rentals.',
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-venues',
    dbCategories: ['wedding_venue'],
    title: 'Venues & Event Spaces in Milwaukee, WI',
    metaTitle: 'Venues & Event Spaces in Milwaukee, WI | Planviry',
    metaDescription:
      'Find the best venues and event spaces in Milwaukee, WI - corporate venues, birthday party venues, banquet halls, rooftops, and concert venues on Planviry.',
    headline: 'Milwaukee Venues for Every Event Imaginable',
    subheadline:
      "From intimate galleries in the Third Ward to grand ballrooms overlooking Lake Michigan, Milwaukee's venue scene has a space for every vision and budget.",
    searchTerms: [
      'Venues & Event Spaces',
      'Corporate Event Venues',
      'Birthday Party Venues',
      'Private Party Venues',
      'Outdoor Venues',
      'Event Space',
      'Halls for Rent',
      'Banquet Halls for Rent',
      'Small Venues',
      'Cheap Venues',
      'Concert Venues',
      'Rooftop Venue',
      'venues Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Milwaukee Venues & Event Spaces',
        body: "Milwaukee's venue landscape is as diverse as the city itself. The Historic Third Ward offers converted warehouse lofts with cream city brick walls and soaring ceilings - think the Pritzlaff Building and The Warehouse. Downtown Milwaukee features everything from the grand ballrooms of the Pfister Hotel to the modern event spaces at Saint Kate - The Arts Hotel. Along the lakefront, venues like Discovery World and the Milwaukee Community Sailing Center offer stunning Lake Michigan backdrops.",
      },
      {
        heading: 'Small Venues and Cheap Event Spaces in Milwaukee',
        body: "You don't need a massive budget for a great Milwaukee venue. Community centers throughout the city offer affordable event spaces, and Milwaukee County Parks pavilions provide beautiful settings starting at just a few hundred dollars. Small private rooms at restaurants in Bay View, Wauwatosa, and the East Side work perfectly for intimate gatherings. Many churches in Milwaukee's historic neighborhoods also rent their fellowship halls for events at very reasonable rates.",
      },
      {
        heading: 'Rooftop and Outdoor Venues in Milwaukee',
        body: "Milwaukee's rooftop and outdoor venue scene has exploded in recent years. From the skyline views at Downtown rooftop bars to the garden settings at Boerner Botanical Gardens, outdoor venues capture the best of Wisconsin's brief but beautiful warm season. Popular outdoor venues include the Villa Terrace courtyard, Lake Park pavilions, and the beer garden at Hubbard Park. Most offer indoor backup options for Milwaukee's unpredictable weather.",
      },
    ],
    faq: [
      {
        question: 'What are the best affordable venues in Milwaukee?',
        answer:
          "Milwaukee's most affordable venues include Milwaukee County Parks pavilions ($200-$800), community centers and church halls ($300-$1,000), and restaurant private dining rooms (often just a food/drink minimum). The Urban Ecology Center, Mitchell Park Domes pavilion, and various Bay View and Riverwest community spaces offer great value. Weekday and off-season bookings (January-March) can save 20-40%.",
      },
      {
        question: 'What are the most popular event venues in Milwaukee?',
        answer:
          "Milwaukee's most popular event venues include The Cooperage, The Ivy House, the Pritzlaff Building, Discovery World, the Wisconsin Club, the Pfister Hotel ballroom, and the Milwaukee Public Museum. For outdoor events, Boerner Botanical Gardens, Villa Terrace, and Lake Park are top picks. Newer venues like Saint Kate's and the Komatsu Mining Corp rooftop are gaining popularity.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-equipment-rental',
    dbCategories: ['decor_rentals'],
    title: 'Equipment Rental in Milwaukee, WI',
    metaTitle: 'Equipment Rental in Milwaukee, WI | Planviry',
    metaDescription:
      'Find equipment rentals in Milwaukee, WI - sound systems, DJ equipment, AV gear, speakers, cameras, stages, and projectors on Planviry.',
    headline: 'Milwaukee Equipment Rental for Pro-Level Events',
    subheadline:
      "From concert-grade sound systems to presentation projectors, Milwaukee's equipment rental companies give your event professional production quality.",
    searchTerms: [
      'Equipment Rental',
      'Sound System Rental',
      'DJ Equipment Rental',
      'Audio/Visual Equipment Rental',
      'Speaker Rental',
      'Camera Rental',
      'Stage Rentals',
      'Projector Repair',
      'High Fidelity Audio Equipment',
      'AV rental Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Sound System Rental in Milwaukee',
        body: "Every great Milwaukee event needs great sound - whether it's a corporate keynote at the Wisconsin Center or an outdoor concert at Henry Maier Festival Park. Milwaukee's equipment rental companies offer everything from compact PA systems for small meetings to line arrays that can fill the Fiserv Forum plaza. Many include delivery, setup, and even an audio technician to ensure everything sounds perfect.",
      },
      {
        heading: 'AV and DJ Equipment Rental in Milwaukee',
        body: "Milwaukee's AV rental companies stock everything you need for a professional event - projectors and screens for presentations, wireless microphone systems for speeches and ceremonies, DJ controllers and turntables for aspiring DJs, and full lighting rigs with intelligent fixtures. High-fidelity audio equipment rentals are popular with audiophiles who want concert-quality sound for private events. Many Milwaukee rental shops also offer camera and video equipment for content creators.",
      },
    ],
    faq: [
      {
        question: 'How much does sound system rental cost in Milwaukee?',
        answer:
          'Milwaukee sound system rentals range from $150 for a basic PA system (2 speakers, mixer, 2 wireless mics) to $2,000+ for concert-grade line arrays with subwoofers and monitoring. Most rentals include delivery and pickup within Milwaukee County. Adding an audio technician runs $200-$500 per event. Multi-day and weekend rates are often discounted.',
      },
      {
        question: 'Do Milwaukee equipment rental companies deliver and set up?',
        answer:
          "Yes, most Milwaukee equipment rental companies include delivery, setup, and pickup - especially for larger items like sound systems, staging, and lighting rigs. Basic equipment like projectors and small PA systems may be available for customer pickup. Technical setup and operation by a professional adds cost but ensures everything works perfectly.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-wedding-planning',
    dbCategories: ['wedding_planner'],
    title: 'Wedding Planning in Milwaukee, WI',
    metaTitle: 'Wedding Planning in Milwaukee, WI | Planviry',
    metaDescription:
      'Plan your Milwaukee wedding with the best local planners. All-inclusive packages, affordable venues, bridal showers, and reception venues on Planviry.',
    headline: 'Your Milwaukee Wedding, Perfectly Planned',
    subheadline:
      "From intimate elopements at the Milwaukee County Courthouse to grand celebrations at The Cooperage, Milwaukee wedding planners make your dream day effortless.",
    searchTerms: [
      'Wedding Planning',
      'All Inclusive Wedding Packages',
      'Affordable Wedding Venues',
      'Bridal Shower',
      'Wedding Reception Venues',
      'Milwaukee wedding planning',
    ],
    contentSections: [
      {
        heading: 'All-Inclusive Wedding Packages in Milwaukee',
        body: "Milwaukee is becoming a hotspot for all-inclusive wedding packages that bundle venue, catering, bar service, decor, and coordination into one price. Venues like The Cooperage, The Ivy House, and the Wisconsin Club offer comprehensive packages that can save Milwaukee couples significant time and money compared to booking each vendor separately. These packages typically range from $8,000-$25,000 depending on guest count and inclusions.",
      },
      {
        heading: 'Bridal Showers and Pre-Wedding Events in Milwaukee',
        body: "Milwaukee offers fantastic settings for bridal showers and pre-wedding celebrations. Popular spots include bottomless mimosa brunches in the Third Ward, spa days at the Pfister, and wine tastings at local vineyards in nearby Waukesha County. Many Milwaukee restaurants offer private dining rooms perfect for bridal showers, and local caterers can create custom menus for at-home celebrations.",
      },
    ],
    faq: [
      {
        question: 'What is the average cost of a wedding in Milwaukee?',
        answer:
          "The average Milwaukee wedding costs $25,000-$40,000 for 100-150 guests. However, Milwaukee is significantly more affordable than Chicago or Minneapolis - many couples host beautiful weddings for $15,000-$25,000. All-inclusive venue packages in Milwaukee start around $8,000-$12,000. The biggest cost variables are venue, catering, and photography.",
      },
      {
        question: 'What are the best months for a Milwaukee wedding?',
        answer:
          "Peak wedding season in Milwaukee runs June through October, with September being the most popular month for its comfortable temperatures and fall colors. June weddings offer the longest daylight hours along Lake Michigan. Winter weddings (December-February) at indoor venues like the Pfister Hotel or Wisconsin Club are beautiful and often 20-30% less expensive. Avoid Summerfest weekends (late June-early July) when hotel availability is tight.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-dress-attire',
    dbCategories: ['dress_attire'],
    title: 'Dress & Attire in Milwaukee, WI',
    metaTitle: 'Dress & Attire in Milwaukee, WI | Planviry',
    metaDescription:
      'Find bridal gowns, wedding dresses, and formal attire in Milwaukee, WI. Top bridal boutiques and tuxedo rental shops on Planviry.',
    headline: 'Milwaukee Bridal Boutiques & Formal Attire',
    subheadline:
      "From designer bridal gowns in Brookfield to custom suits in the Third Ward, Milwaukee's attire specialists make sure you look picture-perfect.",
    searchTerms: [
      'Dress & Attire',
      'Bridal Gowns',
      'Wedding Dresses',
      'bridal shop Milwaukee',
      'wedding dress Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Bridal Boutiques in Milwaukee',
        body: "Milwaukee's bridal boutique scene has grown tremendously, with shops ranging from affordable sample sales to luxury designer boutiques. Brookfield and the North Shore offer clusters of bridal shops where you can try on dozens of gowns in one trip. Many Milwaukee boutiques carry Wisconsin exclusives and offer plus-size selections. Popular shopping areas include the Third Ward for boutique experiences and Capitol Drive for bridal row convenience.",
      },
      {
        heading: 'Wedding Dress Shopping Tips for Milwaukee Brides',
        body: "Start your Milwaukee wedding dress search 8-10 months before your wedding - popular boutiques like those in Brookfield book appointments weeks in advance during peak season. Consider scheduling weekday appointments for more attentive service. Many Milwaukee bridal shops participate in annual sample sales (typically January and July) where you can score designer gowns at 40-70% off. Don't forget to budget for alterations, which typically run $200-$600 at Milwaukee seamstresses.",
      },
    ],
    faq: [
      {
        question: 'How much does a wedding dress cost in Milwaukee?',
        answer:
          'Milwaukee wedding dresses range from $500 for sample sale finds to $5,000+ for designer gowns. The average Milwaukee bride spends $1,200-$2,500 on her wedding dress. Sample sales at Milwaukee boutiques offer significant discounts on designer gowns. Off-the-rack options and pre-owned dresses from Milwaukee consignment shops can bring the price under $500.',
      },
      {
        question: 'Where are the best bridal shops in Milwaukee?',
        answer:
          "Milwaukee's best bridal shopping areas include the Third Ward for boutique experiences, Capitol Drive (Shorewood/Whitefish Bay) for concentrated bridal row shopping, and Brookfield for large bridal superstores with extensive selections. Popular Milwaukee boutiques include Bella Bridesmaid, La Belle Vie, and various independent shops throughout the metro area.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-hotels',
    dbCategories: ['hotel_accommodations'],
    title: 'Hotels in Milwaukee, WI',
    metaTitle: 'Hotels in Milwaukee, WI | Planviry',
    metaDescription:
      'Find hotels and accommodations in Milwaukee, WI for weddings and events. Group room blocks, boutique hotels, and wedding party lodging on Planviry.',
    headline: 'Milwaukee Hotels for Your Wedding & Event Guests',
    subheadline:
      "From the historic Pfister Hotel to modern Downtown high-rises, Milwaukee's hotel scene has the perfect home base for your event guests.",
    searchTerms: [
      'Hotels',
      'Hotel Accommodations',
      'hotels Milwaukee WI',
      'wedding hotel blocks Milwaukee',
    ],
    contentSections: [
      {
        heading: 'Wedding Hotel Blocks in Milwaukee',
        body: "Securing hotel room blocks for your Milwaukee wedding guests is essential, especially during Summerfest and other festival seasons when rooms fill fast. The Pfister Hotel, Saint Kate - The Arts Hotel, and the Kimpton Journeyman in the Third Ward are popular choices for wedding parties. For budget-conscious guests, Milwaukee offers excellent options in Brookfield, near the airport, and along I-94 in Wauwatosa - all within 15-20 minutes of Downtown venues.",
      },
      {
        heading: 'Boutique Hotels and Unique Stays in Milwaukee',
        body: "Milwaukee's boutique hotel scene has exploded, offering unique stays that double as event venues. The Brewhouse Inn & Suites in the Third Ward occupies a former brewery building with cream city brick walls. Saint Kate - The Arts Hotel features rotating art installations and event spaces. The Iron Horse Hotel in Walker's Point blends industrial chic with Milwaukee motorcycle heritage - perfect for rehearsal dinners and welcome parties.",
      },
    ],
    faq: [
      {
        question: 'How do I book hotel room blocks for a Milwaukee wedding?',
        answer:
          "Contact Milwaukee hotels 6-8 months before your wedding to reserve room blocks. Most hotels require a 10-room minimum for group rates and hold rooms without payment until 2-4 weeks before the event. The Pfister, Saint Kate, and Kimpton Journeyman are popular for wedding blocks. Hotels near Mitchell Airport offer budget-friendly options for out-of-town guests.",
      },
      {
        question: 'What are the best hotels for Milwaukee wedding guests?',
        answer:
          "Top Milwaukee hotels for wedding guests include the Pfister Hotel (luxury, Downtown), Saint Kate - The Arts Hotel (boutique, Downtown), the Kimpton Journeyman (Third Ward), the Iron Horse Hotel (Walker's Point), and the Hilton Milwaukee City Center (budget-friendly, Downtown). For guests flying in, hotels near Mitchell International Airport offer convenience and value.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-jewelers',
    dbCategories: ['jeweler'],
    title: 'Jewelers in Milwaukee, WI',
    metaTitle: 'Jewelers in Milwaukee, WI | Planviry',
    metaDescription:
      'Find the best jewelers in Milwaukee, WI - engagement rings, wedding bands, and custom jewelry. Local jewelers and ring specialists on Planviry.',
    headline: 'Milwaukee Jewelers for Rings That Shine Forever',
    subheadline:
      "From custom engagement rings crafted in the Third Ward to heirloom wedding bands, Milwaukee's jewelers create pieces as unique as your love story.",
    searchTerms: [
      'Jewelers',
      'Engagement Rings',
      'Wedding Rings',
      'jeweler Milwaukee WI',
      'engagement ring Milwaukee',
    ],
    contentSections: [
      {
        heading: 'Engagement Rings in Milwaukee',
        body: "Milwaukee's jewelers offer everything from classic solitaires to custom-designed settings that incorporate your unique style. Local jewelers in the Third Ward and Brookfield specialize in ethically sourced diamonds and Wisconsin-mined gemstones. Many offer custom design services where you can create a one-of-a-kind ring from scratch - popular choices include rose gold settings with Milwaukee's signature cream-toned aesthetics and vintage-inspired designs that echo the city's architectural heritage.",
      },
      {
        heading: 'Wedding Bands and Custom Jewelry in Milwaukee',
        body: "Milwaukee's wedding band selection ranges from simple platinum bands to elaborate custom designs featuring engraved Milwaukee skyline silhouettes or hidden birthstones. Local jewelers also create custom wedding party gifts, bridesmaid earrings, and groomsmen cufflinks. Many Milwaukee jewelers offer complimentary ring cleaning and inspection services - perfect for keeping your rings sparkling through those Wisconsin winters.",
      },
    ],
    faq: [
      {
        question: 'How much does an engagement ring cost in Milwaukee?',
        answer:
          'Milwaukee engagement rings range from $1,000 for simple settings to $15,000+ for large diamond solitaires. The average Milwaukee couple spends $3,000-$6,000 on an engagement ring. Local Milwaukee jewelers often offer better value than national chains, and custom designs can be surprisingly affordable. Many Milwaukee jewelers offer financing options.',
      },
      {
        question: 'Can I get a custom engagement ring made in Milwaukee?',
        answer:
          "Absolutely! Milwaukee has several talented custom jewelers who can design and create a unique engagement ring from your concept. The process typically takes 4-8 weeks and involves CAD design, wax model review, and final casting. Custom rings in Milwaukee start around $2,000 and can go up significantly depending on materials. It's a popular choice for couples who want something truly one-of-a-kind.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-invitations',
    dbCategories: ['invitations_print'],
    title: 'Invitations in Milwaukee, WI',
    metaTitle: 'Invitations in Milwaukee, WI | Planviry',
    metaDescription:
      'Find wedding invitations and print services in Milwaukee, WI. Custom invitation designers, letterpress, and calligraphy on Planviry.',
    headline: 'Milwaukee Invitation Designers & Print Services',
    subheadline:
      "From letterpress wedding invitations to modern digital designs, Milwaukee's stationers and print shops create invitations that set the tone for your event.",
    searchTerms: [
      'Invitations',
      'Print Services',
      'Wedding Invitations',
      'invitation printing Milwaukee',
      'wedding invitations Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Wedding Invitations in Milwaukee',
        body: "Milwaukee's invitation designers offer everything from classic letterpress wedding invitations (some printed on vintage presses in the Third Ward) to modern digital designs with custom illustrations of Milwaukee landmarks. Local stationers can incorporate Cream City brick motifs, Calatrava wing silhouettes, or Lake Michigan waves into your wedding suite. Many Milwaukee invitation designers also offer matching day-of stationery - programs, menus, place cards, and signage.",
      },
      {
        heading: 'Print Services for Milwaukee Events',
        body: "Milwaukee's print shops handle everything from small-run custom invitations to large-format event signage and banners. Local printers offer specialty services like foil stamping, embossing, and die cutting that make your invitations stand out. Many Milwaukee print companies also produce event materials - step-and-repeat banners for corporate galas, directional signage for wedding venues, and branded materials for conferences at the Wisconsin Center.",
      },
    ],
    faq: [
      {
        question: 'How much do wedding invitations cost in Milwaukee?',
        answer:
          'Milwaukee wedding invitation prices range from $1-$3 per invitation for basic digital printing to $8-$15+ per invitation for letterpress or foil-stamped designs. The average Milwaukee couple spends $400-$800 on their invitation suite (invite, RSVP card, details card, and envelopes). Custom illustration and calligraphy add to the cost but create truly unique pieces.',
      },
      {
        question: 'When should I order wedding invitations in Milwaukee?',
        answer:
          "Order Milwaukee wedding invitations 4-6 months before your wedding. This allows time for design, proofs, printing (2-4 weeks for standard, 6-8 weeks for letterpress), addressing, and mailing. Save-the-dates should go out 6-8 months before the wedding. Milwaukee printers recommend ordering early for summer weddings, as the busy season (May-October) can extend production times.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-favors',
    dbCategories: ['favors_gifts'],
    title: 'Party Favors in Milwaukee, WI',
    metaTitle: 'Party Favors in Milwaukee, WI | Planviry',
    metaDescription:
      'Find party favors and wedding favors in Milwaukee, WI. Custom gifts, favor ideas, and local Milwaukee favor vendors on Planviry.',
    headline: 'Milwaukee Party Favors Your Guests Will Actually Keep',
    subheadline:
      "From mini bottles of Wisconsin maple syrup to custom cookies featuring the Milwaukee skyline, local favor vendors help you send guests home with a taste of Brew City.",
    searchTerms: [
      'Party Favors',
      'Wedding Favors',
      'Gifts',
      'wedding favors Milwaukee',
      'party favors Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Wedding Favors with Milwaukee Flavor',
        body: "The best Milwaukee wedding favors are ones that give your guests a taste of the city. Mini bottles of Wisconsin maple syrup, artisan cheese curd gift boxes, locally roasted coffee from Colectivo or Stone Creek, custom beer koozies featuring Milwaukee landmarks, and honey from Milwaukee-area beekeepers are all popular choices. Many Milwaukee favor companies can create custom packaging that matches your wedding colors and theme.",
      },
      {
        heading: 'Party Favors for Every Milwaukee Event',
        body: "Milwaukee party favors go beyond weddings - custom koozies for your summer bash at the beer garden, branded merchandise for your corporate event at Fiserv Forum, or themed goodie bags for kids' birthday parties in Wauwatosa. Local Milwaukee vendors specialize in small-batch custom items that add a personal touch to any celebration, from custom candles to personalized candy bars featuring the guest of honor.",
      },
    ],
    faq: [
      {
        question: 'What are popular wedding favors in Milwaukee?',
        answer:
          "Popular Milwaukee wedding favors include mini Wisconsin maple syrup bottles ($2-4 each), artisan cheese or sausage samplers ($3-7), locally roasted coffee bags ($4-8), custom Milwaukee-themed koozies ($1-3), honey from local beekeepers ($3-6), and custom cookies shaped like the Milwaukee skyline or Calatrava ($2-5). The average Milwaukee couple spends $3-$8 per guest on favors.",
      },
      {
        question: 'Where can I buy bulk party favors in Milwaukee?',
        answer:
          "Milwaukee has several options for bulk party favors. Local vendors on Planviry offer custom-made favors with Milwaukee flair. For larger quantities, Milwaukee party supply stores and wholesale vendors offer competitive pricing. The Milwaukee Public Market is a great source for locally-made food favors, and several Wisconsin-based online companies specialize in custom wedding and event favors with state-themed options.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. EVENT TYPE CATEGORIES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: 'milwaukee-weddings',
    dbCategories: [
      'wedding_venue',
      'wedding_dj',
      'photography',
      'videography',
      'catering',
      'florist',
      'wedding_planner',
      'officiant',
    ],
    title: 'Milwaukee Weddings',
    metaTitle: 'Milwaukee Weddings | Planviry',
    metaDescription:
      'Plan your Milwaukee wedding with the best local vendors. Venues, DJs, photographers, caterers, florists, and planners - all on Planviry.',
    headline: 'Your Milwaukee Wedding Starts Here',
    subheadline:
      "From Lake Michigan ceremonies to Third Ward receptions, Milwaukee is the Midwest's hidden gem for unforgettable weddings - and we have every vendor you need.",
    searchTerms: [
      'Weddings',
      'Wedding Planning',
      'All Inclusive Wedding Packages',
      'Milwaukee wedding',
      'wedding Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Why Get Married in Milwaukee',
        body: "Milwaukee is the Midwest's best-kept wedding secret. With stunning Lake Michigan views, world-class venues at a fraction of Chicago prices, and a vendor community that delivers personal attention you won't find in bigger cities, Milwaukee weddings offer incredible value. From the soaring wings of the Calatrava to the exposed brick of Third Ward lofts, from the elegance of the Pfister Hotel to the charm of Bay View bungalows, Milwaukee has a wedding venue for every style and budget.",
      },
      {
        heading: 'Milwaukee Wedding Planning Resources',
        body: "Planning a Milwaukee wedding is easier than you think. Planviry connects you with every vendor you need - venues, DJs, photographers, caterers, florists, planners, and more. Our Milwaukee wedding vendors know the city inside and out, from which venues have the best sunset views over Lake Michigan to which caterers make the best Wisconsin-themed late-night snacks. Many offer all-inclusive packages that simplify planning and save you money.",
      },
    ],
    faq: [
      {
        question: 'What is the average cost of a Milwaukee wedding?',
        answer:
          "The average Milwaukee wedding costs $25,000-$40,000 for 100-150 guests, making it significantly more affordable than Chicago ($45,000+) or Minneapolis ($35,000+). Milwaukee couples can host beautiful weddings for $15,000-$25,000 by choosing affordable venues, off-season dates, and all-inclusive packages. The biggest savings come from Milwaukee's lower venue and catering costs.",
      },
      {
        question: 'What are the best Milwaukee wedding venues?',
        answer:
          "Top Milwaukee wedding venues include The Cooperage, The Ivy House, the Pritzlaff Building, Discovery World, the Pfister Hotel, Villa Terrace, the Wisconsin Club, and Boerner Botanical Gardens. For industrial-chic weddings, the Third Ward and Walker's Point offer converted warehouse venues. Lake Michigan venues provide stunning water views, and Waukesha County offers beautiful countryside and garden settings.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-birthdays',
    dbCategories: ['wedding_dj', 'photo_booth', 'decor_rentals', 'catering'],
    title: 'Birthday Parties in Milwaukee, WI',
    metaTitle: 'Birthday Parties in Milwaukee, WI | Planviry',
    metaDescription:
      'Plan the perfect birthday party in Milwaukee, WI. Find venues, DJs, photo booths, catering, and party planners for kids and adults on Planviry.',
    headline: 'Milwaukee Birthday Parties That Go All Out',
    subheadline:
      "From kids' bounce house parties in Wauwatosa to milestone birthday bashes at Downtown rooftop bars, Milwaukee knows how to celebrate another trip around the sun.",
    searchTerms: [
      'Birthday Party',
      'Birthday Party Venues',
      'Kids Birthday Party',
      'Birthday Party Planner',
      'birthday party Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Birthday Party Venues in Milwaukee',
        body: "Milwaukee offers an amazing variety of birthday party venues for all ages. Kids' birthday hotspots include the Milwaukee Public Museum, the Discovery World science center, bounce house facilities throughout the suburbs, and the Milwaukee County Zoo. For adults, Milwaukee's brewery event rooms, rooftop bars, and private dining spaces in the Third Ward create the perfect celebration atmosphere. Many Milwaukee venues offer all-inclusive birthday party packages that include food, drinks, and entertainment.",
      },
      {
        heading: 'Milwaukee Birthday Party Planning',
        body: "Throwing a memorable Milwaukee birthday party is easy when you have the right vendors. Planviry connects you with DJs who know every birthday anthem, photo booth companies with hilarious props, caterers who make the best party food (cheese curds are always a hit), and balloon artists who create stunning decorations. Whether you're planning a Sweet 16 in Brookfield or a surprise 40th in Bay View, our Milwaukee party vendors make it happen.",
      },
    ],
    faq: [
      {
        question: 'What are the best birthday party venues in Milwaukee?',
        answer:
          "Top Milwaukee birthday party venues include Discovery World and the Milwaukee Public Museum for kids, Koz's Mini Bowl and Bay View Bowl for casual adult parties, Third Ward restaurants with private rooms for upscale celebrations, and rooftop bars Downtown for milestone birthdays. The Milwaukee County Zoo, Betty Brinn Children's Museum, and local bounce house facilities are popular for kids' parties.",
      },
      {
        question: 'How much does a birthday party cost in Milwaukee?',
        answer:
          "Milwaukee birthday party costs vary widely. Kids' parties at venues like bounce house facilities run $200-$500. Adult dinner parties at Milwaukee restaurants range from $30-$75 per person. Full-scale milestone birthday parties with DJ, catering, photo booth, and decor run $2,000-$5,000+. Milwaukee is very affordable compared to Chicago for birthday celebrations.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-corporate-events',
    dbCategories: ['wedding_venue', 'wedding_dj', 'catering', 'decor_rentals'],
    title: 'Corporate Events in Milwaukee, WI',
    metaTitle: 'Corporate Events in Milwaukee, WI | Planviry',
    metaDescription:
      'Plan corporate events in Milwaukee, WI - venues, catering, AV, and team building. Corporate event venues and planners on Planviry.',
    headline: 'Milwaukee Corporate Events That Mean Business',
    subheadline:
      "From the Wisconsin Center to Fiserv Forum's premium spaces, Milwaukee delivers corporate events that impress - with world-class venues and top-tier vendors.",
    searchTerms: [
      'Corporate Events',
      'Corporate Event Venues',
      'Team Building Activities',
      'Office Parties',
      'corporate event Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Corporate Event Venues in Milwaukee',
        body: "Milwaukee's corporate event venues rival any city in the Midwest - at a fraction of the cost. The Wisconsin Center offers 188,000 square feet of flexible meeting and event space. Fiserv Forum provides premium hospitality areas with Bucks-caliber service. The Pfister Hotel's ballroom is perfect for executive galas, while Harley-Davidson Museum event spaces add Milwaukee grit and personality to product launches and team events. For intimate board meetings, the Wisconsin Club delivers old-world elegance.",
      },
      {
        heading: 'Team Building Activities in Milwaukee',
        body: "Milwaukee offers unique team building experiences you can't find anywhere else. Private brewery tours through the Third Ward and Walker's Point, group sailing lessons on Lake Michigan, cooking classes featuring Wisconsin artisan cheeses, scavenger hunts through the Milwaukee Public Market, and even group Harley-Davidson riding experiences. In winter, team curling lessons at the Milwaukee Curling Club and indoor rock climbing at Adventure Rock keep the momentum going.",
      },
    ],
    faq: [
      {
        question: 'What are the best corporate event venues in Milwaukee?',
        answer:
          "Top Milwaukee corporate event venues include the Wisconsin Center (large conferences), Fiserv Forum (premium events), the Pfister Hotel (galas and dinners), Harley-Davidson Museum (unique product launches), Discovery World (innovative tech events), and the Wisconsin Club (executive meetings). Milwaukee's Third Ward loft venues are popular for creative industry events and startup celebrations.",
      },
      {
        question: 'How much does a corporate event cost in Milwaukee?',
        answer:
          "Milwaukee corporate event costs range from $500 for small meeting room rentals to $50,000+ for large-scale conferences. A typical corporate dinner for 100 people at a Milwaukee venue runs $5,000-$15,000. Milwaukee is 30-40% more affordable than Chicago for corporate events, making it an excellent choice for regional meetings, product launches, and company celebrations.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-proms',
    dbCategories: ['wedding_dj', 'photo_booth', 'decor_rentals'],
    title: 'Proms & School Dances in Milwaukee, WI',
    metaTitle: 'Proms & School Dances in Milwaukee, WI | Planviry',
    metaDescription:
      'Plan proms and school dances in Milwaukee, WI. Find DJs, photo booths, venues, and decorations for prom, Sweet 16, and school events on Planviry.',
    headline: 'Milwaukee Proms & School Dances to Remember',
    subheadline:
      "From prom at the Wisconsin Center to Sweet 16 celebrations in the Third Ward, Milwaukee vendors create magical nights for students and their families.",
    searchTerms: [
      'Prom',
      'School Dances',
      'Sweet 16 Party Venues',
      'prom Milwaukee WI',
      'school dance DJ Milwaukee',
    ],
    contentSections: [
      {
        heading: 'Prom Venues in Milwaukee',
        body: "Milwaukee offers stunning prom venues that make students feel like VIPs. The Wisconsin Center's grand spaces, Discovery World's lakefront setting, and the Potawatomi Hotel & Casino's ballroom are popular prom destinations. Many Milwaukee high schools also host proms at Downtown hotels like the Pfister and the Hilton. Sweet 16 parties often take over Third Ward event spaces, rooftop venues, and even party buses cruising along the lakefront.",
      },
      {
        heading: 'DJs for Proms and School Dances in Milwaukee',
        body: "Milwaukee's school dance DJs know exactly what gets students on the dance floor - and what keeps administrators happy. The best Milwaukee prom DJs offer clean-edit music libraries, professional sound systems that fill large venues, and exciting lighting packages including LED walls and fog machines. Many also coordinate with student committees to create custom playlists and take requests throughout the night.",
      },
    ],
    faq: [
      {
        question: 'How much does a prom DJ cost in Milwaukee?',
        answer:
          "Milwaukee prom DJ packages range from $500-$1,500 depending on the event duration, sound system requirements, and lighting add-ons. Most proms book 4-5 hour DJ packages with premium sound and lighting for $800-$1,200. Sweet 16 DJ packages are similar. Many Milwaukee DJs offer all-inclusive prom packages that include sound, lighting, and photo booth rental.",
      },
      {
        question: 'What are popular prom venues in Milwaukee?',
        answer:
          "Popular Milwaukee prom venues include the Wisconsin Center, Discovery World, the Potawatomi Hotel & Casino ballroom, the Pfister Hotel, and the Hilton Milwaukee City Center. For Sweet 16 parties, popular choices include The Cooperage, Third Ward event spaces, and restaurant private rooms. Schools in the Milwaukee suburbs often use local community centers and hotel ballrooms.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },

  {
    slug: 'milwaukee-fundraisers',
    dbCategories: ['wedding_venue', 'catering', 'wedding_dj'],
    title: 'Fundraisers & Galas in Milwaukee, WI',
    metaTitle: 'Fundraisers & Galas in Milwaukee, WI | Planviry',
    metaDescription:
      'Plan fundraisers and galas in Milwaukee, WI. Find elegant venues, catering, entertainment, and auction support for your nonprofit event on Planviry.',
    headline: 'Milwaukee Fundraisers That Raise the Bar',
    subheadline:
      "From black-tie galas at the Pfister to community fundraisers in Bay View, Milwaukee's vendor community helps your cause shine - and your donors give generously.",
    searchTerms: [
      'Fundraiser',
      'Galas',
      'Fundraising Events',
      'charity gala Milwaukee',
      'fundraiser Milwaukee WI',
    ],
    contentSections: [
      {
        heading: 'Milwaukee Gala and Fundraiser Venues',
        body: "Milwaukee's gala venues provide the perfect backdrop for fundraising events that inspire generosity. The Pfister Hotel's grand ballroom sets a tone of elegance for black-tie galas. The Milwaukee Public Museum's dinosaur exhibits create unforgettable auction settings. Discovery World's lakefront location provides stunning views for donor appreciation events. For community-scale fundraisers, the Wisconsin Center's flexible spaces and the Potawatomi Hotel's event rooms offer excellent value and capacity.",
      },
      {
        heading: 'Planning a Successful Milwaukee Fundraiser',
        body: "Milwaukee's nonprofit community is legendary - from the United Way campaigns to local arts organizations and neighborhood associations. Planviry connects you with vendors who understand fundraising events: caterers who offer nonprofit pricing, DJs who know how to keep the energy up during live auctions, and venues that offer discounted rates for charitable organizations. Many Milwaukee vendors donate a portion of their services to nonprofit events.",
      },
    ],
    faq: [
      {
        question: 'How much does it cost to host a fundraiser in Milwaukee?',
        answer:
          "Milwaukee fundraiser costs range from $2,000 for small community events to $50,000+ for large-scale galas. A typical Milwaukee gala for 200 guests costs $10,000-$25,000 including venue, catering, entertainment, and decor. Many Milwaukee venues offer nonprofit discounts of 10-25%, and some local vendors provide reduced rates or donated services for charitable events.",
      },
      {
        question: 'What are the best venues for a Milwaukee fundraiser?',
        answer:
          "Top Milwaukee fundraiser venues include the Pfister Hotel (elegant galas), Milwaukee Public Museum (unique themed events), Discovery World (lakefront events), the Wisconsin Center (large-scale galas), and the Harley-Davidson Museum (memorable corporate fundraisers). The Wisconsin Club and University Club are popular for intimate high-donor events. Community centers and church halls throughout Milwaukee offer budget-friendly options for smaller fundraisers.",
      },
    ],
    nearbyCities: NEARBY_CITIES,
    neighborhoods: NEIGHBORHOODS,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP MAP
// ─────────────────────────────────────────────────────────────────────────────

export const SEO_CATEGORY_MAP: Record<string, SeoCategory> = Object.fromEntries(
  SEO_CATEGORIES.map((cat) => [cat.slug, cat]),
)

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Get a single SEO category by its URL slug */
export function getSeoCategory(slug: string): SeoCategory | undefined {
  return SEO_CATEGORY_MAP[slug]
}

/** Get all SEO categories that include a given DB vendor category */
export function getSeoCategoriesByDbCategory(dbCategory: string): SeoCategory[] {
  return SEO_CATEGORIES.filter((cat) => cat.dbCategories.includes(dbCategory))
}

/** Get all SEO category slugs (useful for static path generation) */
export function getAllSeoCategorySlugs(): string[] {
  return SEO_CATEGORIES.map((cat) => cat.slug)
}

/** Get SEO categories filtered by event type (multi-category categories) */
export function getEventTypeCategories(): SeoCategory[] {
  return SEO_CATEGORIES.filter((cat) => cat.dbCategories.length > 1)
}

/** Get SEO categories that map to a single DB category (core service categories) */
export function getCoreServiceCategories(): SeoCategory[] {
  return SEO_CATEGORIES.filter((cat) => cat.dbCategories.length === 1)
}

// ─────────────────────────────────────────────────────────────────────────────
// ALTERNATE SLUG MAPPING
// Maps task-specified SEO-friendly slugs to existing category slugs.
// e.g. "wedding-venues-milwaukee" → "milwaukee-wedding-venues"
// ─────────────────────────────────────────────────────────────────────────────

export const ALT_SLUG_MAP: Record<string, string> = {
  'wedding-venues-milwaukee': 'milwaukee-wedding-venues',
  'wedding-djs-milwaukee': 'milwaukee-djs',
  'photographers-milwaukee': 'milwaukee-photographers',
  'videographers-milwaukee': 'milwaukee-videographers',
  'caterers-milwaukee': 'milwaukee-caterers',
  'florists-milwaukee': 'milwaukee-florists',
  'wedding-cakes-milwaukee': 'milwaukee-wedding-cakes',
  'hair-makeup-milwaukee': 'milwaukee-hair-makeup',
  'photo-booths-milwaukee': 'milwaukee-photo-booth-rentals',
  'transportation-milwaukee': 'milwaukee-transportation',
  'wedding-planners-milwaukee': 'milwaukee-event-planners',
  'wedding-bands-milwaukee': 'milwaukee-musicians',
  'officiants-milwaukee': 'milwaukee-officiants',
  'dress-attire-milwaukee': 'milwaukee-dress-attire',
  'decor-rentals-milwaukee': 'milwaukee-party-rentals',
  'party-favors-milwaukee': 'milwaukee-balloon-services',
  'bars-clubs-milwaukee': 'milwaukee-bartenders',
  'restaurants-milwaukee': 'milwaukee-restaurants',
  'hotels-milwaukee': 'milwaukee-hotels',
  'event-planners-milwaukee': 'milwaukee-event-planners',
  'entertainment-milwaukee': 'milwaukee-entertainment',
  'lighting-av-milwaukee': 'milwaukee-lighting-av',
}

/** Resolve a slug (primary or alternate) to an SeoCategory */
export function resolveSeoCategory(slug: string): SeoCategory | undefined {
  // Direct match first
  const direct = SEO_CATEGORY_MAP[slug]
  if (direct) return direct
  // Check alternate slug map
  const altTarget = ALT_SLUG_MAP[slug]
  if (altTarget) return SEO_CATEGORY_MAP[altTarget]
  return undefined
}

/** Get all slugs including alternate slugs (for generateStaticParams) */
export function getAllSeoSlugsIncludingAlt(): string[] {
  return [...SEO_CATEGORIES.map((cat) => cat.slug), ...Object.keys(ALT_SLUG_MAP)]
}

/** Get related categories for internal linking */
export function getRelatedCategories(slug: string, limit = 6): SeoCategory[] {
  const cat = resolveSeoCategory(slug)
  if (!cat) return []
  // Find categories that share at least one dbCategory
  const related = SEO_CATEGORIES.filter(
    (c) =>
      c.slug !== cat.slug &&
      c.slug !== (ALT_SLUG_MAP[slug] ?? '') &&
      c.dbCategories.some((db) => cat.dbCategories.includes(db)),
  )
  // If not enough, add random other categories
  if (related.length < limit) {
    const remaining = SEO_CATEGORIES.filter(
      (c) => c.slug !== cat.slug && !related.includes(c),
    )
    related.push(...remaining.slice(0, limit - related.length))
  }
  return related.slice(0, limit)
}
