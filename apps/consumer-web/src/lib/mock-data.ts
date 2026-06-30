import type { Vendor, Product, Category, Order, Review, Lead } from './medusa'

// Milwaukee categories
export const mockCategories: Category[] = [
  { id: 'cat-wedding-venue', name: 'Wedding Venues', slug: 'wedding_venue', icon: 'Heart', color: '#2563EB', productCount: 18 },
  { id: 'cat-wedding-dj', name: 'Wedding DJs', slug: 'wedding_dj', icon: 'Music', color: '#2563EB', productCount: 12 },
  { id: 'cat-bar-club', name: 'Bars & Clubs', slug: 'bar_club', icon: 'Wine', color: '#F97316', productCount: 24 },
  { id: 'cat-bachelorette', name: 'Bachelorette Activities', slug: 'bachelorette_activity', icon: 'PartyPopper', color: '#F97316', productCount: 8 },
  { id: 'cat-photo-booth', name: 'Photo Booths', slug: 'photo_booth', icon: 'Camera', color: '#2563EB', productCount: 6 },
  { id: 'cat-transportation', name: 'Transportation', slug: 'transportation', icon: 'Bus', color: '#F97316', productCount: 5 },
  { id: 'cat-wedding-planner', name: 'Wedding Planners', slug: 'wedding_planner', icon: 'ClipboardList', color: '#2563EB', productCount: 9 },
  { id: 'cat-photography', name: 'Photography', slug: 'photography', icon: 'Aperture', color: '#2563EB', productCount: 14 },
  { id: 'cat-catering', name: 'Catering', slug: 'catering', icon: 'UtensilsCrossed', color: '#F97316', productCount: 11 },
  { id: 'cat-wedding-band', name: 'Wedding Bands', slug: 'wedding_band', icon: 'Guitar', color: '#2563EB', productCount: 7 },
  { id: 'cat-videography', name: 'Videography', slug: 'videography', icon: 'Video', color: '#2563EB', productCount: 5 },
  { id: 'cat-florist', name: 'Florists', slug: 'florist', icon: 'Flower2', color: '#F97316', productCount: 10 },
  { id: 'cat-hair-makeup', name: 'Hair & Makeup', slug: 'hair_makeup', icon: 'Sparkles', color: '#F97316', productCount: 8 },
  { id: 'cat-wedding-cake', name: 'Wedding Cakes', slug: 'wedding_cake', icon: 'Cake', color: '#F97316', productCount: 6 },
  { id: 'cat-officiant', name: 'Officiants', slug: 'officiant', icon: 'BookOpen', color: '#2563EB', productCount: 4 },
  { id: 'cat-dress-attire', name: 'Dress & Attire', slug: 'dress_attire', icon: 'Shirt', color: '#F97316', productCount: 7 },
  { id: 'cat-decor-rentals', name: 'Décor & Rentals', slug: 'decor_rentals', icon: 'Lamp', color: '#2563EB', productCount: 9 },
  { id: 'cat-jeweler', name: 'Jewelers', slug: 'jeweler', icon: 'Gem', color: '#F97316', productCount: 3 },
  { id: 'cat-favors-gifts', name: 'Favors & Gifts', slug: 'favors_gifts', icon: 'Gift', color: '#F97316', productCount: 5 },
  { id: 'cat-invitations', name: 'Invitations & Print', slug: 'invitations_print', icon: 'Mail', color: '#2563EB', productCount: 4 },
  { id: 'cat-hotel', name: 'Hotels', slug: 'hotel_accommodations', icon: 'Building2', color: '#2563EB', productCount: 8 },
  { id: 'cat-honeymoon', name: 'Honeymoon & Travel', slug: 'honeymoon_travel', icon: 'Plane', color: '#F97316', productCount: 3 },
]

// Milwaukee vendors
export const mockVendors: Vendor[] = [
  {
    id: 'v-1', name: '1840 Brewing Company', slug: '1840-brewing-company',
    description: 'A Bay View staple offering craft beers in a warm, industrial-chic setting. Perfect for rehearsal dinners, engagement parties, and casual celebrations. Our space blends Milwaukee brewing heritage with modern event hosting.',
    shortDescription: 'Craft brewery & event space in Bay View',
    email: 'events@1840brewing.com', phone: '(414) 555-1840',
    address: '342 E Ward St', city: 'Milwaukee', state: 'WI',
    category: 'bar_club', serviceAreas: ['Bay View', 'Milwaukee', 'South Side'],
    capacity: '120 guests', priceRange: '$$',
    rating: 4.8, reviewCount: 156, isVerified: true, isFeatured: true, isClaimed: true,
    status: 'active', tags: ['Craft Beer', 'Event Space', 'Rehearsal Dinner'], specialties: ['Private Events', 'Beer Pairings'],
  },
  {
    id: 'v-2', name: 'The Atrium', slug: 'the-atrium',
    description: 'An elegant, light-filled wedding venue in the heart of Shorewood. Our glass-enclosed atrium provides a stunning backdrop for ceremonies and receptions, accommodating intimate gatherings to grand celebrations.',
    shortDescription: 'Elegant glass-enclosed wedding venue in Shorewood',
    email: 'hello@theatriummke.com', phone: '(414) 555-2888',
    address: '4123 N Oakland Ave', city: 'Shorewood', state: 'WI',
    category: 'wedding_venue', serviceAreas: ['Shorewood', 'Milwaukee', 'North Shore'],
    capacity: '250 guests', priceRange: '$$$$',
    rating: 4.9, reviewCount: 98, isVerified: true, isFeatured: true, isClaimed: true,
    status: 'active', tags: ['Wedding Venue', 'Indoor Ceremony', 'Reception'], specialties: ['All-Inclusive Packages', 'Indoor Ceremonies'],
  },
  {
    id: 'v-3', name: 'AXE MKE', slug: 'axe-mke',
    description: 'Milwaukee\'s premier axe throwing venue in the Third Ward. Perfect for bachelorette parties, team building, and unique group events. Our expert coaches ensure a safe, fun experience for all skill levels.',
    shortDescription: 'Axe throwing & group events in the Third Ward',
    email: 'book@axemke.com', phone: '(414) 555-AXE1',
    address: '133 W Menomonee St', city: 'Milwaukee', state: 'WI',
    category: 'bachelorette_activity', serviceAreas: ['Third Ward', 'Downtown Milwaukee', 'Walker\'s Point'],
    capacity: '60 guests', priceRange: '$$',
    rating: 4.7, reviewCount: 214, isVerified: true, isFeatured: true, isClaimed: true,
    status: 'active', tags: ['Axe Throwing', 'Group Events', 'Bachelorette'], specialties: ['Private Lanes', 'Party Packages'],
  },
  {
    id: 'v-4', name: 'David Charles Productions', slug: 'david-charles-productions',
    description: 'Milwaukee\'s most sought-after wedding DJ and entertainment company. Over 20 years of experience creating unforgettable wedding receptions with personalized playlists and seamless event coordination.',
    shortDescription: 'Premier wedding DJ & entertainment in Milwaukee',
    email: 'david@davidcharles.com', phone: '(414) 555-DCPJ',
    address: '789 N Jefferson St', city: 'Milwaukee', state: 'WI',
    category: 'wedding_dj', serviceAreas: ['Milwaukee Metro', 'Waukesha', 'Lake Country'],
    capacity: 'Up to 500+ guests', priceRange: '$$$',
    rating: 4.9, reviewCount: 312, isVerified: true, isFeatured: true, isClaimed: true,
    status: 'active', tags: ['Wedding DJ', 'MC', 'Event Coordination'], specialties: ['Personalized Playlists', 'Bilingual MC'],
  },
  {
    id: 'v-5', name: '5 Card Studs', slug: '5-card-studs',
    description: 'Milwaukee\'s favorite wedding and event band. High-energy performances spanning Motown to modern hits. Our experienced musicians keep the dance floor packed all night long.',
    shortDescription: 'High-energy wedding & event band',
    email: 'booking@5cardstuds.com', phone: '(414) 555-STUD',
    address: '2468 S Kinnickinnic Ave', city: 'Milwaukee', state: 'WI',
    category: 'wedding_band', serviceAreas: ['Milwaukee Metro', 'Southeast Wisconsin', 'Madison'],
    capacity: 'Any size event', priceRange: '$$$$',
    rating: 4.8, reviewCount: 87, isVerified: true, isFeatured: true, isClaimed: false,
    status: 'active', tags: ['Live Band', 'Wedding Music', 'Dance Band'], specialties: ['Motown', 'Top 40', 'Jazz'],
  },
  {
    id: 'v-6', name: 'The Pixel Booth', slug: 'the-pixel-booth',
    description: 'Modern photo booth experiences for Milwaukee weddings and events. Premium open-air and enclosed booths with fun props, GIF capabilities, and instant social sharing.',
    shortDescription: 'Premium photo booth experiences for Milwaukee events',
    email: 'hello@thepixelbooth.com', phone: '(414) 555-PXLB',
    address: '5678 W Bluemound Rd', city: 'Milwaukee', state: 'WI',
    category: 'photo_booth', serviceAreas: ['Milwaukee Metro', 'Waukesha', 'Brookfield'],
    capacity: 'Unlimited guests', priceRange: '$$',
    rating: 4.6, reviewCount: 143, isVerified: true, isFeatured: false, isClaimed: true,
    status: 'active', tags: ['Photo Booth', 'GIF Booth', 'Green Screen'], specialties: ['Open-Air Booth', 'Custom Backdrops'],
  },
  {
    id: 'v-7', name: 'Cruise-A-Palooza Party Bus', slug: 'cruise-a-palooza-party-bus',
    description: 'The ultimate party on wheels! Milwaukee\'s premier party bus service for bachelorette parties, bar crawls, and wedding transportation. Premium sound systems, LED lighting, and room for the whole crew.',
    shortDescription: 'Milwaukee\'s premier party bus service',
    email: 'ride@cruiseapalooza.com', phone: '(414) 555-RIDE',
    address: '321 S 1st St', city: 'Milwaukee', state: 'WI',
    category: 'transportation', serviceAreas: ['Milwaukee Metro', 'Lake Geneva', 'Door County'],
    capacity: '30 passengers', priceRange: '$$$',
    rating: 4.5, reviewCount: 76, isVerified: true, isFeatured: true, isClaimed: false,
    status: 'active', tags: ['Party Bus', 'Wedding Transport', 'Group Travel'], specialties: ['Bachelorette Parties', 'Wedding Shuttle'],
  },
  {
    id: 'v-8', name: 'Films By Design', slug: 'films-by-design',
    description: 'Cinematic wedding videography that tells your unique love story. Based in Milwaukee, we create timeless wedding films with a documentary-meets-cinematic style that captures every emotion.',
    shortDescription: 'Cinematic wedding videography in Milwaukee',
    email: 'info@filmsbydesign.com', phone: '(414) 555-FILM',
    address: '159 N Broadway', city: 'Milwaukee', state: 'WI',
    category: 'videography', serviceAreas: ['Milwaukee Metro', 'Lake Country', 'Southeast Wisconsin'],
    capacity: 'Any size event', priceRange: '$$$',
    rating: 4.9, reviewCount: 64, isVerified: true, isFeatured: true, isClaimed: true,
    status: 'active', tags: ['Wedding Video', 'Cinematic', 'Documentary Style'], specialties: ['Same-Day Edits', 'Highlight Films'],
  },
  {
    id: 'v-9', name: 'Evenement Planning', slug: 'evenement-planning',
    description: 'Full-service wedding and event planning in Milwaukee. From intimate elopements to grand celebrations, we handle every detail so you can enjoy your special day stress-free.',
    shortDescription: 'Full-service wedding & event planning in Milwaukee',
    email: 'hello@evenementplanning.com', phone: '(414) 555-EVNT',
    address: '744 N Jackson St', city: 'Milwaukee', state: 'WI',
    category: 'wedding_planner', serviceAreas: ['Milwaukee Metro', 'Waukesha', 'Ozaukee County'],
    capacity: 'Any size event', priceRange: '$$$$',
    rating: 5.0, reviewCount: 42, isVerified: true, isFeatured: true, isClaimed: true,
    status: 'active', tags: ['Wedding Planner', 'Event Design', 'Day-Of Coordination'], specialties: ['Luxury Events', 'Cultural Weddings'],
  },
  {
    id: 'v-10', name: 'MKE Photo Studio', slug: 'mke-photo-studio',
    description: 'Award-winning wedding and portrait photography serving Milwaukee and beyond. Our natural, editorial style captures authentic moments while making you feel confident and comfortable.',
    shortDescription: 'Award-winning wedding photography in Milwaukee',
    email: 'book@mkephotostudio.com', phone: '(414) 555-SNAP',
    address: '2246 S Kinnickinnic Ave', city: 'Milwaukee', state: 'WI',
    category: 'photography', serviceAreas: ['Milwaukee Metro', 'Lake Michigan Coast', 'Door County'],
    capacity: 'Any size event', priceRange: '$$$',
    rating: 4.8, reviewCount: 119, isVerified: true, isFeatured: false, isClaimed: true,
    status: 'active', tags: ['Wedding Photography', 'Engagement Photos', 'Portraits'], specialties: ['Natural Light', 'Editorial Style'],
  },
]

// Mock products (services)
export const mockProducts: Product[] = [
  { id: 'p-1', vendorId: 'v-1', categoryId: 'cat-bar-club', name: 'Private Event Package', slug: 'private-event-package', description: 'Exclusive use of our taproom for up to 120 guests. Includes craft beer flight, dedicated bartender, and custom event coordination.', price: 2500, compareAtPrice: 3000, images: [], type: 'service', status: 'active', isFeatured: true, tags: ['Private Event', 'Beer Tasting'], rating: 4.9 },
  { id: 'p-2', vendorId: 'v-1', categoryId: 'cat-bar-club', name: 'Rehearsal Dinner Package', slug: 'rehearsal-dinner-package', description: 'Intimate rehearsal dinner in our barrel room. Farm-to-table menu with beer pairings for up to 50 guests.', price: 1800, images: [], type: 'service', status: 'active', isFeatured: false, tags: ['Rehearsal Dinner', 'Beer Pairing'], rating: 4.7 },
  { id: 'p-3', vendorId: 'v-2', categoryId: 'cat-wedding-venue', name: 'All-Inclusive Wedding Package', slug: 'all-inclusive-wedding-package', description: 'Complete wedding package including ceremony, reception, catering, and day-of coordination for up to 250 guests.', price: 15000, compareAtPrice: 18000, images: [], type: 'service', status: 'active', isFeatured: true, tags: ['All-Inclusive', 'Wedding'], rating: 5.0 },
  { id: 'p-4', vendorId: 'v-2', categoryId: 'cat-wedding-venue', name: 'Ceremony Only Package', slug: 'ceremony-only-package', description: 'Beautiful atrium ceremony with setup, seating, and day-of coordinator for up to 200 guests.', price: 4500, images: [], type: 'service', status: 'active', isFeatured: false, tags: ['Ceremony', 'Intimate'], rating: 4.8 },
  { id: 'p-5', vendorId: 'v-3', categoryId: 'cat-bachelorette', name: 'Bachelorette Party Package', slug: 'bachelorette-party-package', description: '2-hour private axe throwing session for up to 12 people. Includes coaching, competition, and champagne toast.', price: 420, compareAtPrice: 540, images: [], type: 'service', status: 'active', isFeatured: true, tags: ['Bachelorette', 'Group Event'], rating: 4.8 },
  { id: 'p-6', vendorId: 'v-4', categoryId: 'cat-wedding-dj', name: 'Premium Wedding DJ Package', slug: 'premium-wedding-dj-package', description: 'Full reception DJ and MC services. Custom playlist, ceremony music, cocktail hour, and 6-hour reception.', price: 2800, images: [], type: 'service', status: 'active', isFeatured: true, tags: ['Wedding DJ', 'MC', 'Full Reception'], rating: 5.0 },
  { id: 'p-7', vendorId: 'v-5', categoryId: 'cat-wedding-band', name: '5-Piece Live Band - Full Night', slug: '5-piece-live-band-full-night', description: '5-piece band performance for your entire reception. Three 45-minute sets with DJ breaks. All equipment included.', price: 6500, compareAtPrice: 7500, images: [], type: 'service', status: 'active', isFeatured: true, tags: ['Live Band', 'Reception'], rating: 4.9 },
  { id: 'p-8', vendorId: 'v-6', categoryId: 'cat-photo-booth', name: 'Unlimited Photo Booth - 4 Hours', slug: 'unlimited-photo-booth-4-hours', description: 'Open-air photo booth with unlimited prints, props, GIF mode, and digital gallery. Attendant included.', price: 899, compareAtPrice: 1100, images: [], type: 'service', status: 'active', isFeatured: true, tags: ['Photo Booth', 'Unlimited Prints'], rating: 4.7 },
  { id: 'p-9', vendorId: 'v-7', categoryId: 'cat-transportation', name: 'Party Bus - 4 Hour Rental', slug: 'party-bus-4-hour-rental', description: '30-passenger party bus with premium sound, LED lighting, and cooler. Perfect for bar crawls and bachelorette parties.', price: 1200, images: [], type: 'service', status: 'active', isFeatured: true, tags: ['Party Bus', 'Group Transport'], rating: 4.5 },
  { id: 'p-10', vendorId: 'v-8', categoryId: 'cat-videography', name: 'Full Wedding Film Package', slug: 'full-wedding-film-package', description: 'Two videographers, full-day coverage, 5-7 minute highlight film, and full ceremony edit. Drone footage included.', price: 4500, compareAtPrice: 5200, images: [], type: 'service', status: 'active', isFeatured: true, tags: ['Wedding Film', 'Cinematic'], rating: 4.9 },
  { id: 'p-11', vendorId: 'v-9', categoryId: 'cat-wedding-planner', name: 'Full Planning Package', slug: 'full-planning-package', description: 'Complete wedding planning from engagement to "I do." Includes vendor coordination, timeline, design, and day-of management.', price: 5500, images: [], type: 'service', status: 'active', isFeatured: true, tags: ['Full Planning', 'Coordination'], rating: 5.0 },
  { id: 'p-12', vendorId: 'v-9', categoryId: 'cat-wedding-planner', name: 'Day-Of Coordination', slug: 'day-of-coordination', description: 'Professional day-of coordination to ensure your wedding runs smoothly. Includes venue walkthrough, timeline, and vendor management.', price: 1500, images: [], type: 'service', status: 'active', isFeatured: false, tags: ['Day-Of', 'Coordination'], rating: 4.8 },
]

// Mock orders
export const mockOrders: Order[] = [
  { id: 'o-1', orderNumber: 'MKE-001', customerId: 'u-1', vendorId: 'v-2', status: 'completed', total: 15000, subtotal: 15000, paymentStatus: 'paid', createdAt: '2025-01-15T10:30:00Z', items: [{ id: 'oi-1', productId: 'p-3', quantity: 1, unitPrice: 15000, totalPrice: 15000 }] },
  { id: 'o-2', orderNumber: 'MKE-002', customerId: 'u-2', vendorId: 'v-4', status: 'in_progress', total: 2800, subtotal: 2800, paymentStatus: 'paid', createdAt: '2025-01-18T14:20:00Z', items: [{ id: 'oi-2', productId: 'p-6', quantity: 1, unitPrice: 2800, totalPrice: 2800 }] },
  { id: 'o-3', orderNumber: 'MKE-003', customerId: 'u-3', vendorId: 'v-3', status: 'pending', total: 420, subtotal: 420, paymentStatus: 'pending', createdAt: '2025-01-20T09:00:00Z', items: [{ id: 'oi-3', productId: 'p-5', quantity: 1, unitPrice: 420, totalPrice: 420 }] },
  { id: 'o-4', orderNumber: 'MKE-004', customerId: 'u-4', vendorId: 'v-5', status: 'completed', total: 6500, subtotal: 6500, paymentStatus: 'paid', createdAt: '2025-01-22T11:45:00Z', items: [{ id: 'oi-4', productId: 'p-7', quantity: 1, unitPrice: 6500, totalPrice: 6500 }] },
  { id: 'o-5', orderNumber: 'MKE-005', customerId: 'u-5', vendorId: 'v-9', status: 'confirmed', total: 5500, subtotal: 5500, paymentStatus: 'paid', createdAt: '2025-01-25T16:30:00Z', items: [{ id: 'oi-5', productId: 'p-11', quantity: 1, unitPrice: 5500, totalPrice: 5500 }] },
  { id: 'o-6', orderNumber: 'MKE-006', customerId: 'u-6', vendorId: 'v-7', status: 'cancelled', total: 1200, subtotal: 1200, paymentStatus: 'refunded', createdAt: '2025-01-27T08:15:00Z', items: [{ id: 'oi-6', productId: 'p-9', quantity: 1, unitPrice: 1200, totalPrice: 1200 }] },
]

// Mock reviews
export const mockReviews: Review[] = [
  { id: 'r-1', userId: 'u-1', vendorId: 'v-2', rating: 5, title: 'Our dream wedding venue!', comment: 'The Atrium was absolutely perfect. The natural light, the elegant space, and the incredible team made our wedding day magical.', isVerified: true, createdAt: '2025-01-20T10:00:00Z', user: { name: 'Sarah & Mike' } },
  { id: 'r-2', userId: 'u-2', vendorId: 'v-4', rating: 5, title: 'Best DJ in Milwaukee', comment: 'David Charles kept the dance floor packed ALL NIGHT. He read the room perfectly and mixed every genre seamlessly. Our guests are still talking about it!', isVerified: true, createdAt: '2025-01-22T14:00:00Z', user: { name: 'Jennifer L.' } },
  { id: 'r-3', userId: 'u-3', vendorId: 'v-3', rating: 5, title: 'Perfect bachelorette activity!', comment: 'We had the BEST time at AXE MKE for my bachelorette party. The coaches were fun and patient, and the champagne toast was a great touch.', isVerified: true, createdAt: '2025-01-24T09:30:00Z', user: { name: 'Ashley R.' } },
  { id: 'r-4', userId: 'u-4', vendorId: 'v-9', rating: 5, title: 'Stress-free wedding thanks to Evenement', comment: ' hiring Evenement Planning was the best decision we made. They handled everything with professionalism and creativity. Our wedding was flawless!', isVerified: true, createdAt: '2025-01-26T16:00:00Z', user: { name: 'David & Lisa K.' } },
  { id: 'r-5', userId: 'u-5', vendorId: 'v-1', rating: 4, title: 'Great rehearsal dinner spot', comment: '1840 Brewing was the perfect spot for our rehearsal dinner. Great beer, good food, and a relaxed atmosphere. Only wish they had more food options.', isVerified: false, createdAt: '2025-01-28T11:00:00Z', user: { name: 'Mark P.' } },
  { id: 'r-6', userId: 'u-6', vendorId: 'v-8', rating: 5, title: 'Our wedding film is breathtaking', comment: 'Films By Design captured every emotion of our wedding day. The highlight film makes us cry happy tears every time we watch it. Truly cinematic art.', isVerified: true, createdAt: '2025-01-29T09:00:00Z', user: { name: 'Rachel & Tom' } },
]

// Mock leads
export const mockLeads: Lead[] = [
  { id: 'l-1', vendorId: 'v-2', name: 'Emily Johnson', email: 'emily@email.com', phone: '(414) 555-1234', message: 'Looking for a wedding venue for September 2026, approx 150 guests', source: 'organic', status: 'new', createdAt: '2025-01-28T10:00:00Z' },
  { id: 'l-2', vendorId: 'v-4', name: 'Marcus Brown', email: 'marcus@email.com', phone: '(414) 555-5678', message: 'Need a DJ for our August wedding reception', source: 'direct', status: 'contacted', createdAt: '2025-01-27T14:30:00Z' },
  { id: 'l-3', vendorId: 'v-9', name: 'Sarah Williams', email: 'sarah@email.com', message: 'Interested in full wedding planning services', source: 'referral', status: 'qualified', createdAt: '2025-01-26T09:15:00Z' },
  { id: 'l-4', vendorId: 'v-3', name: 'Jessica Davis', email: 'jessica@email.com', phone: '(414) 555-9012', message: 'Bachelorette party for 15 people, interested in axe throwing + drinks', source: 'organic', status: 'new', createdAt: '2025-01-29T08:00:00Z' },
  { id: 'l-5', vendorId: 'v-8', name: 'Chris Lee', email: 'chris@email.com', message: 'Wedding videography quote for October 2026', source: 'social', status: 'lost', createdAt: '2025-01-25T16:45:00Z' },
]

// Chart data for analytics
export const mockRevenueData = [
  { date: 'Jan 1', revenue: 3200, orders: 8 },
  { date: 'Jan 5', revenue: 4800, orders: 12 },
  { date: 'Jan 9', revenue: 4100, orders: 10 },
  { date: 'Jan 13', revenue: 6200, orders: 15 },
  { date: 'Jan 17', revenue: 5600, orders: 14 },
  { date: 'Jan 21', revenue: 8400, orders: 20 },
  { date: 'Jan 25', revenue: 7200, orders: 18 },
  { date: 'Jan 29', revenue: 9800, orders: 22 },
]

export const mockSourceData = [
  { name: 'Organic Search', value: 42, fill: '#2563EB' },
  { name: 'Direct', value: 28, fill: '#F97316' },
  { name: 'Referral', value: 18, fill: '#0EA5E9' },
  { name: 'Social Media', value: 12, fill: '#FBBF24' },
]
