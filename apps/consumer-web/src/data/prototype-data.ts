import { CartItem, ItineraryEvent, Collaborator, ChatMessage, ActivityLog, VendorMetric, BookingRequest, Task, CategoryLens } from '@/types';

export const IMAGES = {
  // Headshots
  elena: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoQUrrbr-3gSau06470oHubiZTlswJw8tTPVoQWGey0hwkra-5slmPfcSqi0_xkCCOvcr2vrxMsgCM5xnEQi0jIw2oL7sq8pw3yghzVZ9Hc-j4wOVyNR8guJ0-hItZJEKBQ8zbp2EAoec14pzilDEdjPpdsADjz49YTrDb6hscJafddhTbJO4fiBII2qAWqyVzUUnbZcOmEOZkc59gMWaAHtr9cXJ4sw6D44sqMySMPxnIfhVgOsKcFCWOpfeegHkN924QYdL-oc',
  marcus: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEXzY5zFTxNrSbPsxqPLfJYrKJzLNAbvAA__WvbAgUQX6KapQC6uoxsnfeko-6YDEacN1P9XDblcNxhUSf18TKIXMGlDDNuXIORGet73dQkYk5lPE_lX4W7xEQU8KiSU98XqAWAKlCIIduVkckOBJYX9yFlNqIVBLpS5qhDiyJhmr5ZHTMBXqCPckg-GB8quASjjQnTWQGp7DI0QjmQXv8sqlJF_zlHynBQLOBmZJ8owCQWcfdhXXm3UV_02e6G7xB8OR85V5qSI0',
  sarah: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp6c8hSfH0DcXTPKFw8bUAtgw_etIFdKGTSM1MyFkN_T-X7RZO1uX_iRp56Gnn_U_fBE-aPPQQR9JyIhdD8JjmQfdHDTj-J32VusCnDofXrF5iZiSoJWzieUlmIHpl5rR88tfGtV8VFZuxuI5TJF3-wT-w2irB-84BPTdvQakgvV0Wy91CGFuPhOw5qkwNPYvUMM5s6OvWiplWfNEPbq9cKUu-Y68JpAEAPtFYrsSA7VFA9vC1bciX8GzgImqw0NhGhMLShKRZ_u',
  julian: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXiEDKue7WW3WNWVYZPN9gz536X1-s4ye8G1SktehCguw4JAukUpDdp2YfUTgwOBBsYfxR_HIRI6Gx4Q3_C0rHbSifav7aB-vX1b-DPiCH2EodRG6BSRWooVz-h35BUubfqew6fl0rKXq4cE5XtM50o7x9n3JHR4_FnsjLGYjK8vACUqc8k8KfG0bMc5dzgzcKsc5KTuzv4uqLXTTXq4CqKgTGPSysjPqsaOTcD2fURmIUstMASnLKi38sSYa7YENf9Q6RMCl1NxE',
  eliteLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVfXadLn6ijy14zLO7hVtxaP7Q1LAwKHcCSlFJN8Du-IK4D-dzQXbx5GN0E4eYuZw4M90_zh5vSKgOdvy2Z9z1ded9irmXS4edMaSLSqJC4xWraOhxQZ4Fz7yU5kfTC5ifLzYrq1NFZCIPlYhinrDTcYn8av9a-uHLhmLWuL60CLjF1nDKluZLglYWegg7DAWN1AAvdUkfr-f19meX9g0x9PNFfRf96tukILaIAFU5gntOqaR5OVSKhn_Ca701zcBLl0curkZTNBw',

  // Curated Experiences
  heritageWedding: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-vFqQF6MUqcEEevOGXPB3ZKYTMa5hqLL2nkz1A1EtJrs_wKg1nBBHv30XjcW63Q2tCi2XDrt6PiCQEamn16vdRTWGH8AZE_Pq1ST9iSlq63PKZKRSQx-LCOeFSLToHYNDx3iBbvYWw-9bUNX6ROQTjW5Xdv5xyFrUWvsSRs6UjqajW9gJRIBBDqRCeYyaHXLEgivbA86ZXzDQkeNcIx8hyKWDtrQBTa5s79jDFZbiMVXxHjkkzAoqFV_1kUtwTog7wxIFTxPUcZM',
  metropolitanOpera: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ1bqu8XS77Xt0tkUL7YY_YqztXxyzo0EM3Nt99hJs-BByt-hiUSHR_n7j91YDZoqLyNnJKNGLB2bdMGlOSrcBK7SFp38iD4ytQkrx6vJTnW8rpyQFxtvBLqFKv5qEfJaQ638VCGvPh6RhughZPmKx9knWS_PQKMBzKgl98FYGyPTkw97AbdstdlYP40eUx5V2O-IWjSikilRq1ivtNGR8FB5mNArlJ2aYVpUOQHXe_OAN-fdnOpqtgocpDkjoks5eFVZwLWSJHFQ',
  chateauLumiere: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkUmOPrd3siA37mrIA6fSZP2EjE1sp1BnfeBrVyQBeKRhkG8rH74Q3N6TqHaj8rn41mAWLUd6Njh3SwrDTeGbKB7NLrTH8gI_G6Vzm-SB9B5w6XL_6w6InQnoZHkrRK0xEm-zvhTULEaTtOiRkrY3P7g2d8PRZTdahOph0x-RloEWIg74mUSFwzqh0FfMsNvWFd5YuYOlGCelIGW_UMzSW8-JkeVonCzOXag23b0YbXVORJMUjEKR2eyQSQfiaOzPuYTnq1PpOT-Y',
  perryLane: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGtqtFkRqqcmccCGVlDGz1VbmTRzZ5DR-K_ccfaq69_ZbEz-ctg1MHyAPDKHF62cPjktJegIBxibuExOKT3fyr6XufmjN7I0F5ZrjhA2GP2plshqx0DZ9DBIdGR-E8J5_RpVzmZL_I_nQLXvjia6EcGXZXInM9aK6JE-9NWS3sq6Imy5K1nGtadLpifOFACVIjplTIAGRL-J36_SYMFEJ5BM2eElpLTLm2ucPhRgZyAy5xSbHbCRCd-kNB65t2o10IfHlCDooxYEU',
  savannahTour: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOZ8_-p5Nz35TttvCymnzPe1Cz-zATxUFRvVCrvsLq4cAedp_OKrB5TBXNXHRoSpY2LUj7nraMJzzds67ADgkQQxYAZ8htE3-eU1HdDCO3HLHE8Sma7NJ94iGviZ8eEJyjO2ptWWmrW0CR4MskG3B_4yvRYasGWXWkq3GCRkkPnf_ZhjkiLuvzcHloyjT4yexIlyIgufzv7BQ1IfghJ-GbK-WX7Xu96Hg21fXByHgevKrTB96pghneySxIPY2f-DR22P0_mm7pqb8',
  indigoGirls: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOx5GVk4pswX1JrBF-PKgLHJJoMspECEVrbkCzodkWqoiqaxTc042XFs-id6FBH-JP6WN263TIN7R7EuaQ04STyJBUT7DssF3_VL60f2MfNAJ8OGXz2JjNtgKwPQ9lpyqg7z1aBfBfmBvarjHDBCcWLdTFDUnBOOMpnbGRqMCKPukzK4in4WH4v6dVIKkjcDfHrv6Rnd4RNlVYc3peFsyLhEBt5Kf46FWvu31ip6ti9FXS9xo_TCVg6hfLfbtrm0XZ1A4XysqWBo',
  oldePinkHouse: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTWU2yLv95p5UQdcQqkvY2i5fpPM9b5-A6GsqvPGmOLWB0vwn_S0nThKDsmggzBKE5xvo7F6ajEVVNkKHzdMufeiLq28A_rr0PAifp5ZyHlgQi8PECl5ng-DBmWbECWPNE2ZiYeDeB_qsfwvgen9fv1jScO1eWZA37KctD3aJ9xPpRf5knNFv_L0JToztNuhYAIdbSa2Kef792eozhNdJj9GnhZOsa4J4Ua2Zj4EztBhbciHdCz5UDQg-bBMFvGt8jjCQqJcXj2Lc',
  luxuryPool: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  gastronomy: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
  yacht: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80',
  concertLarge: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
  swissAlps: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  desertOasis: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
  coastalCave: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
};

export const MARKETPLACE_ITEMS: CartItem[] = [
  // Vendors
  {
    id: 'vendor-1',
    title: 'The Heritage Wedding Co.',
    category: 'vendors',
    subcategory: 'Photographer',
    price: 4500,
    location: 'Savannah, GA',
    image: IMAGES.heritageWedding,
    badge: 'Preferred Vendor',
    rating: 4.9,
    vendorName: 'The Heritage Wedding Co.',
    description: 'Editorial-grade captures for grand estate ceremonies and world-class luxury portraits.',
  },
  {
    id: 'vendor-2',
    title: 'Bespoke Floral Designs',
    category: 'vendors',
    subcategory: 'Florist',
    price: 1800,
    location: 'Charleston, SC',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    badge: 'Artisanal',
    rating: 4.8,
    vendorName: 'Bespoke Floral',
    description: 'Signature arrangements combining native blooms with classical European composition.',
  },
  {
    id: 'vendor-3',
    title: 'Chef Jean-Luc Private Catering',
    category: 'vendors',
    subcategory: 'Caterer',
    price: 2500,
    location: 'Napa Valley, CA',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    badge: 'Michelin Starred',
    rating: 4.95,
    vendorName: 'Jean-Luc Gastronomy',
    description: 'Custom five-course dinners curated specifically for high-end celebrations and estate micro-weddings.',
  },
  {
    id: 'vendor-4',
    title: 'Soundwave Elite Sound & Lighting',
    category: 'vendors',
    subcategory: 'Sound and Lighting',
    price: 1200,
    location: 'Savannah, GA',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    badge: 'AV Certified',
    rating: 4.7,
    vendorName: 'Soundwave AV',
    description: 'Professional concert-grade audio setup and ambient uplighting tailored for mansions and galas.',
  },
  {
    id: 'vendor-5',
    title: 'Prestige Balloon & Florals',
    category: 'vendors',
    subcategory: 'Balloon Services',
    price: 850,
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    badge: 'Premium Decor',
    rating: 4.8,
    vendorName: 'Prestige Decor',
    description: 'Luxe organic balloon arches and vibrant backdrop arrangements for baby showers and milestones.',
  },

  // Live Shows
  {
    id: 'show-1',
    title: 'Metropolitan Opera Series',
    category: 'live-shows',
    subcategory: 'Theater',
    price: 280,
    location: 'Lincoln Center, NY',
    image: IMAGES.metropolitanOpera,
    isTicketmaster: true,
    rating: 4.9,
    description: 'Direct access to the world\'s most sought-after performances. Integrated booking and hospitality.',
  },
  {
    id: 'show-2',
    title: 'Indigo Girls Concert',
    category: 'live-shows',
    subcategory: 'Concerts',
    price: 95,
    location: 'Johnny Mercer Theatre, GA',
    image: IMAGES.indigoGirls,
    isTicketmaster: true,
    rating: 4.6,
    description: 'Bespoke hospitality packages with front row seating and private green room meet-and-greets.',
  },
  {
    id: 'show-3',
    title: 'NBA: Chicago Bulls Court Access',
    category: 'live-shows',
    subcategory: 'Sports',
    price: 650,
    location: 'Chicago, IL',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    isTicketmaster: true,
    rating: 4.9,
    description: 'VIP courtside seating experience with pre-game club entry and direct valet parking privileges.',
  },

  // Spaces
  {
    id: 'space-1',
    title: 'Château de Lumière',
    category: 'spaces',
    subcategory: 'Estates',
    price: 12000,
    location: 'Napa Valley, CA',
    image: IMAGES.chateauLumiere,
    badge: 'Ultra-Luxury',
    rating: 5.0,
    description: 'An architectural masterpiece offering unparalleled privacy and prestige for global gala events.',
  },
  {
    id: 'space-2',
    title: 'Aurelian Estate & Gardens',
    category: 'spaces',
    subcategory: 'Mansions',
    price: 8500,
    location: 'Lake Como, Italy',
    image: IMAGES.savannahTour,
    badge: 'Exclusive',
    rating: 4.9,
    description: 'A sanctuary of neoclassical architecture and manicured botanicals, curated for standard milestones.',
  },
  {
    id: 'space-3',
    title: 'The Skyline Loft Rooftop',
    category: 'spaces',
    subcategory: 'Rooftop',
    price: 4500,
    location: 'Chicago, IL',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
    badge: 'Top Rated',
    rating: 4.85,
    description: 'Panoramic views of the Chicago skyline. Ideal for corporate happy hours and cocktail parties.',
  },
  {
    id: 'space-4',
    title: 'Grand Waterfront Villa',
    category: 'spaces',
    subcategory: 'Waterfront Venues',
    price: 9500,
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    badge: 'Trending',
    rating: 4.9,
    description: 'Luxury estate on Lake Austin with custom wood decking, boat docks, and infinity sunset views.',
  },

  // Services
  {
    id: 'service-1',
    title: 'Elite Occasion Planning',
    category: 'services',
    subcategory: 'Wedding Planners',
    price: 3500,
    location: 'Global',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
    badge: 'Elite Concierge',
    rating: 4.95,
    description: 'Bespoke, end-to-end planning with our top coordinators matching the luxury narrative.',
  },
  {
    id: 'service-2',
    title: 'Prestige Chauffeur Service',
    category: 'services',
    subcategory: 'Travel Agents',
    price: 600,
    location: 'US Cities',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    badge: 'Reliable',
    rating: 4.9,
    description: 'Late-model luxury sedans and professional chauffeurs with 24-hour dispatch.',
  },

  // Plan
  {
    id: 'plan-1',
    title: 'Bachelorette in Texas',
    category: 'plan',
    subcategory: 'Bachelorette',
    price: 2400,
    location: 'Austin, TX',
    image: IMAGES.luxuryPool,
    badge: 'Power Shortcut',
    rating: 4.85,
    description: 'An optimized party blueprint including luxury ranch buyout, private chef, and boat tour.',
  },
  {
    id: 'plan-2',
    title: 'Birthday in Hong Kong',
    category: 'plan',
    subcategory: 'Birthday party',
    price: 3200,
    location: 'Hong Kong',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    badge: 'Elite Journey',
    rating: 4.95,
    description: 'A masterpiece birthday blueprint featuring Ritz-Carlton Ozone bar access and Victoria Harbour yacht cruise.',
  },

  // Things to Do
  {
    id: 'todo-1',
    title: 'Riva Yacht Private Cruise',
    category: 'things-to-do',
    subcategory: 'Boats & Water Activities',
    price: 950,
    location: 'Lake Como, Italy',
    image: IMAGES.yacht,
    badge: 'Signature',
    rating: 5.0,
    description: 'Private 3-hour wooden Riva run on the pristine waters of Lake Como with vintage Champagne service.',
  },
  {
    id: 'todo-2',
    title: 'Savannah Historic District Tour',
    category: 'things-to-do',
    subcategory: 'Art Show',
    price: 150,
    location: 'Savannah, GA',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    badge: 'Certified',
    rating: 4.8,
    description: 'Explore the cobblestone squares and live oaks with a certified local historian.',
  },
  {
    id: 'todo-3',
    title: 'Vineyard Balloon Sunrise Flight',
    category: 'things-to-do',
    subcategory: 'Boats & Water Activities',
    price: 450,
    location: 'Napa Valley, CA',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
    rating: 4.9,
    description: 'Float serenely above harvesting vineyard rows in a private hot air balloon followed by champagne breakfast.',
  },

  // Food & Drink
  {
    id: 'food-1',
    title: 'Dinner at The Olde Pink House',
    category: 'food-drink',
    subcategory: 'Restaurants',
    price: 120,
    location: 'Savannah, GA',
    image: IMAGES.oldePinkHouse,
    badge: 'Signature',
    rating: 4.75,
    description: 'Fine Southern dining in an authentic 18th-century mansion with candlelit salons.',
  },
  {
    id: 'food-2',
    title: 'Château Michelin Private Tasting',
    category: 'food-drink',
    subcategory: 'Dining',
    price: 850,
    location: 'Napa Valley, CA',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    badge: 'Michelin Duo',
    rating: 5.0,
    description: 'Exclusive 5-course chef experience paired with rare reserves from our historic Napa cellar.',
  },
  {
    id: 'food-3',
    title: 'Gourmet Steakhouse Experience',
    category: 'food-drink',
    subcategory: 'Restaurants',
    price: 180,
    location: 'Chicago, IL',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    badge: 'Prime Cuts',
    rating: 4.8,
    description: 'Classic dry-aged bone-in ribeye paired with vintage Bordeaux in a warm candlelit leather booth.',
  },

  // Travel
  {
    id: 'travel-1',
    title: 'Villa d\'Este Palace Stay',
    category: 'travel',
    subcategory: 'Places to stay',
    price: 1500,
    location: 'Lake Como, Italy',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    badge: '5-Star Resort',
    rating: 5.0,
    description: 'Spend two nights in a historic renaissance palace overlooking Bellagio waters with private jetty access.',
  },
  {
    id: 'travel-2',
    title: 'Elite Heliport Helicopter Run',
    category: 'travel',
    subcategory: 'Flights',
    price: 1200,
    location: 'Napa Valley, CA',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80',
    badge: 'Charter VIP',
    rating: 4.9,
    description: 'Bypass traffic completely with a direct private helicopter run from SFO airport terminal directly to Napa heliport.',
  },
  {
    id: 'travel-3',
    title: 'The Perry Lane Hotel',
    category: 'travel',
    subcategory: 'Places to stay',
    price: 450,
    location: 'Savannah, GA',
    image: IMAGES.perryLane,
    badge: 'Verified Hotel',
    rating: 4.9,
    description: 'A boutique luxury hotel in Savannah featuring high ceilings, rooftop pool, and brass accents.',
  },

  // Party
  {
    id: 'party-1',
    title: 'Elite Birthday Cocktail Bash',
    category: 'party',
    subcategory: 'Birthday',
    price: 1500,
    location: 'Savannah, GA',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    badge: 'Milestone',
    rating: 4.85,
    description: 'A complete birthday theme with signature cocktail open-bar, sound orchestration, and photobooth.',
  },
  {
    id: 'party-2',
    title: 'Bachelorette Lake Cruise Package',
    category: 'party',
    subcategory: 'Bachelorette',
    price: 2800,
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1505232458627-53744be97629?auto=format&fit=crop&w=800&q=80',
    badge: 'Weekend Party',
    rating: 4.9,
    description: 'The ultimate bachelorette package on a private luxury pontoon boat with premium catering, floaties, and custom signs.',
  }
];

export const INITIAL_ITINERARY: ItineraryEvent[] = [
  {
    id: 'iti-1',
    title: 'Hotel Check-in',
    category: 'travel',
    time: '4:00 PM',
    location: 'The Perry Lane Hotel',
    status: 'Confirmed',
    price: 450,
    date: 'Friday',
    description: 'A boutique luxury hotel in Savannah featuring high ceilings, rooftop pool, and brass accents.',
    image: IMAGES.perryLane,
  },
  {
    id: 'iti-2',
    title: 'Dinner Reservation',
    category: 'food-drink',
    time: '8:00 PM',
    location: 'The Olde Pink House',
    status: 'Confirmed',
    price: 120,
    date: 'Friday',
    description: 'Fine Southern dining in an authentic 18th-century mansion with candlelit salons.',
    image: IMAGES.oldePinkHouse,
    commentsCount: 3,
  },
  {
    id: 'iti-3',
    title: 'Historic District Tour',
    category: 'things-to-do',
    time: '10:00 AM',
    location: 'Historic Savannah Squares',
    status: 'Confirmed',
    price: 150,
    date: 'Saturday',
    description: 'Walking tour covering 12 historic squares and the riverfront led by a private historian.',
    image: IMAGES.savannahTour,
  },
  {
    id: 'iti-4',
    title: 'Indigo Girls Concert',
    category: 'live-shows',
    time: '8:00 PM',
    location: 'Johnny Mercer Theatre',
    status: 'Confirmed',
    price: 95,
    date: 'Saturday',
    description: 'Exclusive front-row tickets with back-stage passes. Please plan ahead as this overlaps with your Saturday late evening drinks.',
    image: IMAGES.indigoGirls,
    ticketDetails: 'Scan QR at Entry. Seats Row A, 11-12.',
  }
];

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: 'col-1',
    name: 'Elena Vance',
    email: 'elena.v@vancecorp.com',
    avatar: IMAGES.elena,
    role: 'Orchestrator',
    isViewing: true,
  },
  {
    id: 'col-2',
    name: 'Marcus Chen',
    email: 'm.chen@designstudio.io',
    avatar: IMAGES.marcus,
    role: 'Contributor',
    isViewing: true,
  },
  {
    id: 'col-3',
    name: 'Sarah Jenkins',
    email: 'sj@lifestyle.co',
    avatar: IMAGES.sarah,
    role: 'Viewer',
    isViewing: false,
  },
  {
    id: 'col-4',
    name: 'Sam (You)',
    email: 'sam@planviry.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'Contributor',
    isViewing: true,
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    user: 'Elena',
    avatar: IMAGES.elena,
    message: 'The Perry Lane Hotel looks stunning! Can\'t wait for check-in.',
    time: '10:45 AM',
    isSelf: false,
  },
  {
    id: 'msg-2',
    user: 'Marcus',
    avatar: IMAGES.marcus,
    message: 'Agreed. I\'ll handle the luggage if you guys want to head straight to the lobby bar.',
    time: '10:47 AM',
    isSelf: false,
  },
  {
    id: 'msg-3',
    user: 'Sarah',
    avatar: IMAGES.sarah,
    message: 'Does anyone know if the Olde Pink House has a dress code for dinner?',
    time: '10:50 AM',
    isSelf: false,
  },
  {
    id: 'msg-4',
    user: 'Sam',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    message: 'Yes, it is elegant smart-casual. Perfect opportunity to dress up nicely!',
    time: '10:52 AM',
    isSelf: true,
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    user: 'Sam',
    action: 'added Olde Pink House Dinner Reservation',
    time: '2 minutes ago',
    icon: 'restaurant',
  },
  {
    id: 'act-2',
    user: 'Marcus',
    action: 'updated travel logistics for flight LX224',
    time: '14 minutes ago',
    icon: 'flight',
  },
  {
    id: 'act-3',
    user: 'Elena',
    action: 'initiated a $450 cost split for Presidential Suite',
    time: '1 hour ago',
    icon: 'attach_money',
  },
  {
    id: 'act-4',
    user: 'Elena',
    action: 'invited Sarah Jenkins to the itinerary',
    time: 'Yesterday',
    icon: 'person_add',
  }
];

export const VENDOR_METRICS: VendorMetric[] = [
  {
    id: 'met-1',
    label: 'Total Revenue',
    value: '$142,850',
    change: '+12.5%',
    isPositive: true,
    sparkline: [35, 15, 20, 28, 18, 42, 55],
  },
  {
    id: 'met-2',
    label: 'Pending Bookings',
    value: '24',
    change: '-2.1%',
    isPositive: false,
    sparkline: [10, 18, 12, 14, 20, 15, 24],
  },
  {
    id: 'met-3',
    label: 'Average Rating',
    value: '4.9',
    change: '+0.1%',
    isPositive: true,
    sparkline: [4.7, 4.8, 4.8, 4.9, 4.8, 4.9, 4.9],
  },
  {
    id: 'met-4',
    label: 'Active Occasions',
    value: '18',
    change: '+8.3%',
    isPositive: true,
    sparkline: [8, 12, 11, 15, 14, 16, 18],
  }
];

export const INITIAL_BOOKING_REQUESTS: BookingRequest[] = [
  {
    id: 'req-1',
    clientName: 'Julianne Vought',
    clientTier: 'Gold Member',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    occasionName: 'Celestial Gala Evening',
    date: 'Nov 18, 2024',
    amount: 12400,
    status: 'Pending',
  },
  {
    id: 'req-2',
    clientName: 'Marcus Thorne',
    clientTier: 'Corporate Tier',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    occasionName: 'Executive Retreat 2024',
    date: 'Jan 12, 2025',
    amount: 8950,
    status: 'Approved',
  },
  {
    id: 'req-3',
    clientName: 'Seraphina Rossi',
    clientTier: 'Diamond Club',
    clientAvatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=100&q=80',
    occasionName: 'The Heritage Wedding',
    date: 'Dec 05, 2024',
    amount: 45000,
    status: 'Approved',
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: "Finalize guest count & seating layout for Saturday's Gala",
    assigneeId: 'col-1',
    category: 'Guest Seating Plan',
    dueDate: 'Friday, Oct 18',
    priority: 'High',
    completed: false,
    description: 'Ensure seating charts are compiled for the grand dining room, taking care of special VIP arrangements.'
  },
  {
    id: 'task-2',
    title: 'Request dietary requirements & wine preferences',
    assigneeId: 'col-2',
    category: 'Catering Liaison',
    dueDate: 'Friday, Oct 18',
    priority: 'Medium',
    completed: true,
    description: 'Collect preferences from all 4 primary guests and forward them to Olde Pink House private sommelier.'
  },
  {
    id: 'task-3',
    title: 'Verify ticket passes on Ticketmaster app for Indigo Girls',
    assigneeId: 'col-3',
    category: 'Ticketing & Passes',
    dueDate: 'Saturday, Oct 19',
    priority: 'High',
    completed: false,
    description: 'Double check the digital entry barcodes and hospitality passes are saved offline.'
  },
  {
    id: 'task-4',
    title: 'Reserve rooftop private table at Perry Lane Hotel',
    assigneeId: 'col-4',
    category: 'Catering Liaison',
    dueDate: 'Friday, Oct 18',
    priority: 'High',
    completed: false,
    description: 'Confirm the panoramic corner booth overlooking Savannah square for Friday sunset cocktails.'
  },
  {
    id: 'task-5',
    title: 'Coordinate private airport transfers and luggage logistics',
    assigneeId: 'col-2',
    category: 'Helicopter Transfer Coordination',
    dueDate: 'Thursday, Oct 17',
    priority: 'Medium',
    completed: true,
    description: 'Ensure the prestige chauffeur service is synced with arriving flights lx224.'
  }
];

export const SUB_CATEGORIES: Record<CategoryLens, string[]> = {
  services: [
    "Wedding Planners", "Corporate Occasion Planners", "Gala Occasion Planners",
    "Destination Occasion Planners", "Adult Birthday Party Planners",
    "Kids Birthday Party Planners", "Bar & Bat Mitzvah Planners",
    "Baby Shower Planners", "Travel Agents", "Vacation Rental Agents"
  ],
  plan: [
    "Photo shoot", "Workshop", "Meeting", "Wedding reception", "Birthday party",
    "Live music", "Video shoot", "Party", "Baby shower", "Music video",
    "Bridal shower", "Pop-up", "Occasion", "Gala", "Engagement party",
    "Film shoot", "Corporate occasion", "Graduation party", "Anniversary"
  ],
  'things-to-do': ["Art Show", "Climbing Wall", "Happy Hour", "Boats & Water Activities"],
  'food-drink': ["Restaurants", "Catering", "Dining"],
  'live-shows': ["Concerts", "Sports", "Theater", "Comedy"],
  travel: ["Places to stay", "Flights", "Cars", "Destinations", "Group Trip"],
  party: [
    "Karaoke Bar", "Holiday Parties", "Dinner Parties", "Bachelorette", "Bachelor",
    "Birthday", "Group Trip", "New Year's Eve Party", "Thanksgiving Party",
    "Elopement Party", "Engagement Party", "Holiday Party", "Baby shower",
    "Graduation party"
  ],
  spaces: [
    "Restaurants", "Hotels", "Museums", "Outdoor", "Resorts", "Boats",
    "Theaters", "Farms", "Banquet Hall", "Wineries", "Occasion Spaces",
    "Country Clubs", "Estates", "Mansions", "Meeting Spaces",
    "Waterfront Venues", "Rooftop", "Auditorium", "Content House", "Cottage"
  ],
  vendors: [
    "Audio Visual Equipment Rental", "Caterer", "DJ", "Entertainer",
    "Occasion Planner", "Occasion Staffing", "Florist", "Live Music",
    "Officiant", "Party Equipment Rental", "Photographer",
    "Transportation Provider", "Videographer", "Bartenders", "Wait Staff",
    "Security", "Valet Parking", "Technical/Cleaning Services", "Wedding",
    "Flowers", "Projectors", "Video Equipment", "Audio Equipment",
    "Computers", "Sound and Lighting", "Linens", "Moon-bounces",
    "Tables", "Tents", "Lighting", "Chair Covers", "Dance Floors",
    "Photo Booths", "Clowns", "Jugglers", "Magicians", "Puppeteers",
    "Balloon Artists"
  ]
};
export const SERVICE_TO_CATEGORY: Record<string, string> = {
  "Venue and Occasion Space": "spaces",
  "Holiday Rental Home / Cabin": "spaces",
  "Campground": "spaces",
  "Resort": "spaces",
  "Caterer": "food-drink",
  "Bakery": "food-drink",
  "Bartender": "food-drink",
  "Personal Chef": "food-drink",
  "DJ Service": "live-shows",
  "Party Character": "live-shows",
  "Live Music / Band": "live-shows",
  "Comedy Show": "live-shows",
  "Party Supply": "party",
  "Party Equipment Rental": "party",
  "Furniture Rental": "party",
  "Balloon Services": "party",
  "Photo Booth Rental": "party",
  "Face Painting": "party",
  "Limo Services / Party Bus Rental": "vendors",
  "Limo Services / Town Car Service": "vendors",
  "Photographer": "vendors",
  "Videographer": "vendors",
  "Flower and Gift Shop": "vendors",
  "Calligraphy / Graphic Designer": "vendors",
  "Occasion Technology Service": "plan",
  "Wedding Planning": "plan",
  "Day Spa / Spas / Nail Salon": "services",
  "Hair Stylist": "services",
  "Makeup Artist": "services"
};

export function getCategoryForService(service: string): CategoryLens {
  const parts = service.split('/').map(p => p.trim());
  for (const part of parts) {
    if (SERVICE_TO_CATEGORY[part]) {
      return SERVICE_TO_CATEGORY[part] as CategoryLens;
    }
    for (const [key, cat] of Object.entries(SERVICE_TO_CATEGORY)) {
      if (part.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(part.toLowerCase())) {
        return cat as CategoryLens;
      }
    }
  }
  const lower = service.toLowerCase();
  if (lower.includes('venue') || lower.includes('space') || lower.includes('chapel') || lower.includes('auditorium') || lower.includes('exhibition') || lower.includes('mansion') || lower.includes('estate') || lower.includes('rooftop')) {
    return 'spaces';
  }
  if (lower.includes('cater') || lower.includes('food') || lower.includes('bartender') || lower.includes('bakery') || lower.includes('chef') || lower.includes('drink') || lower.includes('wine')) {
    return 'food-drink';
  }
  if (lower.includes('music') || lower.includes('dj') || lower.includes('band') || lower.includes('comedy') || lower.includes('show') || lower.includes('live') || lower.includes('orchestra') || lower.includes('stage')) {
    return 'live-shows';
  }
  if (lower.includes('photo') || lower.includes('video') || lower.includes('limo') || lower.includes('bus') || lower.includes('car') || lower.includes('flower') || lower.includes('gift') || lower.includes('design') || lower.includes('calligraphy')) {
    return 'vendors';
  }
  if (lower.includes('plan') || lower.includes('tech') || lower.includes('coordinat') || lower.includes('budget')) {
    return 'plan';
  }
  if (lower.includes('spa') || lower.includes('hair') || lower.includes('makeup') || lower.includes('nail') || lower.includes('stylist') || lower.includes('beauty') || lower.includes('wellness')) {
    return 'services';
  }
  if (lower.includes('stay') || lower.includes('hotel') || lower.includes('villa') || lower.includes('cabin') || lower.includes('resort') || lower.includes('travel')) {
    return 'travel';
  }
  if (lower.includes('party') || lower.includes('supply') || lower.includes('rental') || lower.includes('balloon') || lower.includes('booth') || lower.includes('game') || lower.includes('arcade')) {
    return 'party';
  }
  return 'vendors';
}

export function isItemMatchingService(item: CartItem, service: string): boolean {
  const itemCat = item.category;
  const serviceCat = getCategoryForService(service);
  if (itemCat !== serviceCat) return false;

  const itemSub = (item.subcategory || '').toLowerCase();
  const servLower = service.toLowerCase();

  if (itemSub.includes(servLower) || servLower.includes(itemSub)) {
    return true;
  }

  if (servLower.includes('venue') || servLower.includes('space') || servLower.includes('mansion') || servLower.includes('estate') || servLower.includes('rooftop') || servLower.includes('chapel')) {
    if (itemSub.includes('estate') || itemSub.includes('mansion') || itemSub.includes('rooftop') || itemSub.includes('venue') || itemSub.includes('stay') || itemSub.includes('rental')) {
      return true;
    }
  }
  if (servLower.includes('cater') || servLower.includes('chef') || servLower.includes('bakery') || servLower.includes('bartender')) {
    if (itemSub.includes('cater') || itemSub.includes('dining') || itemSub.includes('restaurant') || itemSub.includes('bakery') || itemSub.includes('bartender') || itemSub.includes('chef')) {
      return true;
    }
  }
  if (servLower.includes('music') || servLower.includes('dj') || servLower.includes('band') || servLower.includes('sound') || servLower.includes('lighting')) {
    if (itemSub.includes('concert') || itemSub.includes('dj') || itemSub.includes('sound') || itemSub.includes('lighting') || itemSub.includes('band') || itemSub.includes('theater')) {
      return true;
    }
  }
  if (servLower.includes('photo') || servLower.includes('video') || servLower.includes('photographer') || servLower.includes('videographer')) {
    if (itemSub.includes('photo') || itemSub.includes('video') || itemSub.includes('photographer') || itemSub.includes('videographer')) {
      return true;
    }
  }
  if (servLower.includes('party') || servLower.includes('supply') || servLower.includes('balloon') || servLower.includes('booth') || servLower.includes('equipment') || servLower.includes('face')) {
    if (itemSub.includes('party') || itemSub.includes('balloon') || itemSub.includes('supply') || itemSub.includes('booth') || itemSub.includes('equipment') || itemSub.includes('rental') || itemSub.includes('birthday') || itemSub.includes('bachelorette')) {
      return true;
    }
  }

  return true;
}
