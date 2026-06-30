/**
 * Rich Landing Page Content for every Ticket category & subcategory.
 *
 * Modeled after Ticketmaster category pages:
 *   - Hero with eyebrow, title, subtitle, background
 *   - Quick links row (horizontal pills)
 *   - Popular picks grid (featured cards)
 *   - Trending searches row
 *   - Rich SEO "About" section (context, history)
 *
 * Top-level categories are hand-written with rich, specific content.
 * Subcategories use a smart generator that produces meaningful, unique copy
 * from the subcategory name + parent group context.
 */

export interface PopularPick {
  name: string
  tag?: string
  subtitle?: string
  href: string
  gradient: string
}

export interface TrendingPick {
  name: string
  tag: string
  href: string
}

export interface QuickLink {
  label: string
  href: string
}

export interface RichTicketContent {
  heroGradient: string
  heroEyebrow?: string
  title: string
  subtitle?: string
  quickLinks: QuickLink[]
  popularPicks: PopularPick[]
  trending: TrendingPick[]
  aboutTitle: string
  aboutBody: string[]
}

// ── Gradients (reusable, on-brand, NO indigo/blue) ──────────────────────────
export const GRADIENTS = {
  coral: 'linear-gradient(135deg, #ff6b4a 0%, #e87461 50%, #c44536 100%)',
  sunset: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
  forest: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
  amber: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  crimson: 'linear-gradient(135deg, #cb356b 0%, #bd3f32 100%)',
  midnight: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  emerald: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  royal: 'linear-gradient(135deg, #41295a 0%, #2F0743 100%)',
  sand: 'linear-gradient(135deg, #d4a373 0%, #cc9544 100%)',
  dark: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  bronze: 'linear-gradient(135deg, #603813 0%, #b29f94 100%)',
  teal: 'linear-gradient(135deg, #0d324d 0%, #7f5a83 50%, #a188a6 100%)',
} as const

// ── CONCERTS (top-level) ─────────────────────────────────────────────────────
const CONCERTS_CONTENT: RichTicketContent = {
  heroGradient: GRADIENTS.crimson,
  heroEyebrow: 'LIVE MUSIC',
  title: 'Concert Tickets',
  subtitle: 'Find tickets for the biggest tours, festival headliners, and intimate club shows near you.',
  quickLinks: [
    { label: 'Tickets Under $100', href: '/tickets/search?maxPrice=100' },
    { label: 'This Weekend', href: '/tickets/search?weekend=true' },
    { label: 'Festival Guide', href: '/tickets/concerts/holiday' },
    { label: 'VIP Packages', href: '/tickets/search?vip=true' },
    { label: 'Last Chance', href: '/tickets/search?lastChance=true' },
  ],
  popularPicks: [
    { name: '4 Tickets for $99', tag: 'DEAL', subtitle: 'Summer of Live Music', href: '/tickets/search?deal=4pack', gradient: GRADIENTS.amber },
    { name: 'Experience the Show as a VIP', tag: 'VIP', subtitle: 'Premium seats & perks', href: '/tickets/search?vip=true', gradient: GRADIENTS.midnight },
    { name: 'Pop Headliners', tag: 'POP', subtitle: 'Chart-topping tours', href: '/tickets/concerts/pop', gradient: GRADIENTS.coral },
    { name: 'R&B Soul Nights', tag: 'R&B', subtitle: 'Smooth sounds live', href: '/tickets/concerts/rb', gradient: GRADIENTS.royal },
  ],
  trending: [
    { name: 'Hip-Hop/Rap Tours', tag: 'HIP-HOP', href: '/tickets/concerts/hip-hop-rap' },
    { name: 'Country Live', tag: 'COUNTRY', href: '/tickets/concerts/country' },
    { name: 'Latin Music', tag: 'LATIN', href: '/tickets/concerts/latin' },
    { name: 'Rock Anthems', tag: 'ROCK', href: '/tickets/concerts/rock' },
    { name: 'Dance / Electronic', tag: 'EDM', href: '/tickets/concerts/dance-electronic' },
  ],
  aboutTitle: 'About Concert Tickets',
  aboutBody: [
    'From sold-out arena tours to intimate club gigs, Planviry brings you concert tickets for every genre and venue. Browse pop, rock, hip-hop, country, Latin, R&B, jazz, classical, electronic, and dozens more — all in one place.',
    'Use the search bar above to filter by location, date range, and event type. Check "This Weekend" to find shows happening near you in the next few days, or plan ahead with specific dates. Every listing includes venue details, seating information, and instant ticket delivery.',
    'Combine your concert tickets with hotel stays, restaurant reservations, and local experiences through Planviry\'s unified itinerary — one cart, one checkout, one trip timeline.',
  ],
}

// ── SPORTS (top-level) ───────────────────────────────────────────────────────
const SPORTS_CONTENT: RichTicketContent = {
  heroGradient: GRADIENTS.forest,
  heroEyebrow: 'GAME DAY',
  title: 'Sports Tickets',
  subtitle: 'MLB, NFL, NBA, NHL, MLS and more. Find tickets for every team, every stadium, every season.',
  quickLinks: [
    { label: 'NFL Tickets', href: '/tickets/sports/nfl' },
    { label: 'NBA Tickets', href: '/tickets/sports/nba' },
    { label: 'MLB Tickets', href: '/tickets/sports/mlb' },
    { label: 'NHL Tickets', href: '/tickets/sports/nhl' },
    { label: 'MLS Tickets', href: '/tickets/sports/mls' },
    { label: 'This Weekend', href: '/tickets/search?weekend=true&type=sports' },
  ],
  popularPicks: [
    { name: 'NFL Season', tag: 'FOOTBALL', subtitle: 'Regular season & playoffs', href: '/tickets/sports/nfl', gradient: GRADIENTS.bronze },
    { name: 'NBA Courtside', tag: 'BASKETBALL', subtitle: 'Tip-off to finals', href: '/tickets/sports/nba', gradient: GRADIENTS.amber },
    { name: 'MLB Ballpark', tag: 'BASEBALL', subtitle: 'Opening day to World Series', href: '/tickets/sports/mlb', gradient: GRADIENTS.emerald },
    { name: 'NHL Hockey', tag: 'HOCKEY', subtitle: 'Puck drop to Stanley Cup', href: '/tickets/sports/nhl', gradient: GRADIENTS.teal },
  ],
  trending: [
    { name: 'Soccer / MLS', tag: 'SOCCER', href: '/tickets/sports/soccer' },
    { name: 'Boxing & MMA', tag: 'COMBAT', href: '/tickets/sports/boxing' },
    { name: 'Golf Tournaments', tag: 'GOLF', href: '/tickets/sports/golf' },
    { name: 'Motorsports', tag: 'RACING', href: '/tickets/sports/motorsports-racing' },
    { name: 'Tennis', tag: 'TENNIS', href: '/tickets/sports/tennis' },
  ],
  aboutTitle: 'About Sports Tickets',
  aboutBody: [
    'Planviry covers every major league — NFL, NBA, MLB, NHL, and MLS — plus minor leagues, college sports, combat sports, motorsports, golf, tennis, and the Olympic Games. Find tickets for your favorite team, browse full season schedules, and explore stadium seating charts.',
    'Each team page includes venue details, conference and division standings context, upcoming home and away games, and seating information. Filter by location and date to find games happening near you this weekend.',
    'Planning a road trip to see your team play? Bundle game tickets with hotel rooms, restaurant reservations, and local experiences — all in one Planviry itinerary.',
  ],
}

// ── ARTS, THEATER & COMEDY (top-level) ───────────────────────────────────────
const ARTS_CONTENT: RichTicketContent = {
  heroGradient: GRADIENTS.royal,
  heroEyebrow: 'STAGE & SCREEN',
  title: 'Arts, Theater & Comedy Tickets',
  subtitle: 'Broadway, off-Broadway, comedy tours, opera, dance, and spectacular productions.',
  quickLinks: [
    { label: 'Broadway Shows', href: '/tickets/arts-theater-comedy/broadway' },
    { label: 'Comedy Tours', href: '/tickets/arts-theater-comedy/comedy' },
    { label: 'Tickets Under $100', href: '/tickets/search?maxPrice=100&type=arts-theater-comedy' },
    { label: 'Last Chance', href: '/tickets/search?lastChance=true&type=arts-theater-comedy' },
    { label: 'Long-Running Hits', href: '/tickets/arts-theater-comedy/theater' },
    { label: 'Touring Shows', href: '/tickets/arts-theater-comedy/spectacular' },
  ],
  popularPicks: [
    { name: 'Broadway Musicals', tag: 'MUSICALS', subtitle: 'Tony winners & long-run hits', href: '/tickets/arts-theater-comedy/broadway', gradient: GRADIENTS.crimson },
    { name: 'Stand-Up Comedy', tag: 'COMEDY', subtitle: 'Top touring comedians', href: '/tickets/arts-theater-comedy/comedy', gradient: GRADIENTS.amber },
    { name: 'Opera & Classical', tag: 'OPERA', subtitle: 'World-class performances', href: '/tickets/arts-theater-comedy/opera', gradient: GRADIENTS.royal },
    { name: 'Dance & Ballet', tag: 'DANCE', subtitle: 'From ballet to contemporary', href: '/tickets/arts-theater-comedy/dance', gradient: GRADIENTS.teal },
  ],
  trending: [
    { name: 'Magic & Illusion', tag: 'MAGIC', href: '/tickets/arts-theater-comedy/magic-illusion' },
    { name: 'Circus & Specialty', tag: 'CIRCUS', href: '/tickets/arts-theater-comedy/circus-specialty-acts' },
    { name: 'Cultural Shows', tag: 'CULTURAL', href: '/tickets/arts-theater-comedy/cultural' },
    { name: 'Performance Art', tag: 'ART', href: '/tickets/arts-theater-comedy/performance-art' },
    { name: 'Puppetry', tag: 'PUPPETRY', href: '/tickets/arts-theater-comedy/puppetry' },
  ],
  aboutTitle: 'About Arts, Theater & Comedy Tickets',
  aboutBody: [
    'From the bright lights of Broadway to intimate comedy clubs, Planviry connects you to the best in live performance. Browse Broadway and off-Broadway shows, national touring productions, stand-up comedy tours, opera, ballet, modern dance, circus acts, magic shows, and more.',
    'Use the search bar to filter by location and date. Each listing includes venue information, runtime, age recommendations, and seating details. Many shows offer rush tickets, lottery entries, and last-minute deals.',
    'Make a night of it — pair your theater tickets with dinner reservations and pre-show drinks through Planviry\'s unified booking platform.',
  ],
}

// ── FAMILY (top-level) ───────────────────────────────────────────────────────
const FAMILY_CONTENT: RichTicketContent = {
  heroGradient: GRADIENTS.amber,
  heroEyebrow: 'FAMILY FUN',
  title: 'Family Tickets',
  subtitle: 'Ice shows, circus acts, children\'s theater, fairs, festivals, and magic shows for all ages.',
  quickLinks: [
    { label: 'Ice Shows', href: '/tickets/family/ice-shows' },
    { label: 'Circus & Specialty', href: '/tickets/family/circus-specialty-acts' },
    { label: 'Children\'s Theater', href: '/tickets/family/childrens-theater' },
    { label: 'This Weekend', href: '/tickets/search?weekend=true&type=family' },
    { label: 'Fairs & Festivals', href: '/tickets/family/fairs-festivals' },
  ],
  popularPicks: [
    { name: 'Disney on Ice', tag: 'ICE SHOWS', subtitle: 'Beloved characters on skates', href: '/tickets/family/ice-shows', gradient: GRADIENTS.teal },
    { name: 'Ringling Bros', tag: 'CIRCUS', subtitle: 'The Greatest Show on Earth', href: '/tickets/family/circus-specialty-acts', gradient: GRADIENTS.crimson },
    { name: 'Children\'s Theater', tag: 'THEATER', subtitle: 'Shows designed for young audiences', href: '/tickets/family/childrens-theater', gradient: GRADIENTS.amber },
    { name: 'Magic & Illusion', tag: 'MAGIC', subtitle: 'Mind-blowing family shows', href: '/tickets/family/magic-illusion', gradient: GRADIENTS.royal },
  ],
  trending: [
    { name: 'Fairs & Festivals', tag: 'FAIRS', href: '/tickets/family/fairs-festivals' },
    { name: 'Puppetry', tag: 'PUPPETRY', href: '/tickets/family/puppetry' },
    { name: 'Rodeo Family Night', tag: 'RODEO', href: '/tickets/family/rodeo' },
    { name: 'Film / Family', tag: 'FILM', href: '/tickets/family/film-family' },
  ],
  aboutTitle: 'About Family Tickets',
  aboutBody: [
    'Planviry makes it easy to find family-friendly live entertainment for all ages. From spectacular ice shows and world-famous circuses to interactive children\'s theater, puppet performances, magic shows, fairs, festivals, and rodeos — there\'s something for every family.',
    'Filter by location and date to find family events near you this weekend. Each listing includes age recommendations, runtime, and venue accessibility information. Many family shows offer group discounts and special meet-and-greet experiences.',
    'Plan the perfect family day out — combine show tickets with nearby dining, attractions, and accommodations in one seamless Planviry itinerary.',
  ],
}

// ── CITIES (top-level) ───────────────────────────────────────────────────────
const CITIES_CONTENT: RichTicketContent = {
  heroGradient: GRADIENTS.dark,
  heroEyebrow: 'EXPLORE',
  title: 'Tickets by City',
  subtitle: 'Find live events in 78 cities across the United States. Concerts, sports, theater, and more.',
  quickLinks: [
    { label: 'New York City', href: '/tickets/cities/new-york-city' },
    { label: 'Los Angeles', href: '/tickets/cities/los-angeles' },
    { label: 'Chicago', href: '/tickets/cities/chicago' },
    { label: 'Las Vegas', href: '/tickets/cities/las-vegas' },
    { label: 'Nashville', href: '/tickets/cities/nashville' },
    { label: 'This Weekend', href: '/tickets/search?weekend=true' },
  ],
  popularPicks: [
    { name: 'New York City', tag: 'NYC', subtitle: 'Broadway, MSG, and more', href: '/tickets/cities/new-york-city', gradient: GRADIENTS.midnight },
    { name: 'Las Vegas', tag: 'VEGAS', subtitle: 'Residencies & spectacles', href: '/tickets/cities/las-vegas', gradient: GRADIENTS.crimson },
    { name: 'Nashville', tag: 'MUSIC CITY', subtitle: 'Country & live music capital', href: '/tickets/cities/nashville', gradient: GRADIENTS.amber },
    { name: 'Los Angeles', tag: 'LA', subtitle: 'Hollywood & arena shows', href: '/tickets/cities/los-angeles', gradient: GRADIENTS.sunset },
  ],
  trending: [
    { name: 'Chicago', tag: 'CHI', href: '/tickets/cities/chicago' },
    { name: 'Atlanta', tag: 'ATL', href: '/tickets/cities/atlanta' },
    { name: 'Miami', tag: 'MIA', href: '/tickets/cities/miami' },
    { name: 'Seattle', tag: 'SEA', href: '/tickets/cities/seattle' },
    { name: 'Austin', tag: 'ATX', href: '/tickets/cities/austin' },
  ],
  aboutTitle: 'About Tickets by City',
  aboutBody: [
    'Browse live events in 78 major U.S. cities. Each city page aggregates concerts, sports, theater, comedy, and family events happening in that metro area, so you can discover what\'s on near you or plan entertainment for an upcoming trip.',
    'Use the search bar to filter by date range and event type. Check "This Weekend" to find last-minute shows, or plan ahead for a specific city break. Every listing includes venue information and ticket availability.',
    'Building a city getaway? Bundle event tickets with hotels, restaurants, and local experiences — one itinerary, one checkout.',
  ],
}

// ── ALL TICKETS (root landing) ───────────────────────────────────────────────
const ALL_TICKETS_CONTENT: RichTicketContent = {
  heroGradient: GRADIENTS.dark,
  heroEyebrow: 'PLANVIRY TICKETS',
  title: 'Live Event Tickets',
  subtitle: 'Concerts, sports, arts, theater, comedy, and family events — all in one place, all bookable together.',
  quickLinks: [
    { label: 'Concerts', href: '/tickets/concerts' },
    { label: 'Sports', href: '/tickets/sports' },
    { label: 'Arts & Theater', href: '/tickets/arts-theater-comedy' },
    { label: 'Family', href: '/tickets/family' },
    { label: 'By City', href: '/tickets/cities' },
    { label: 'This Weekend', href: '/tickets/search?weekend=true' },
  ],
  popularPicks: [
    { name: 'Concert Tickets', tag: 'MUSIC', subtitle: '22 genres, every venue', href: '/tickets/concerts', gradient: GRADIENTS.crimson },
    { name: 'Sports Tickets', tag: 'SPORTS', subtitle: 'NFL, NBA, MLB, NHL, MLS', href: '/tickets/sports', gradient: GRADIENTS.forest },
    { name: 'Arts & Theater', tag: 'STAGE', subtitle: 'Broadway, comedy, opera', href: '/tickets/arts-theater-comedy', gradient: GRADIENTS.royal },
    { name: 'Family Events', tag: 'FAMILY', subtitle: 'Ice shows, circus, theater', href: '/tickets/family', gradient: GRADIENTS.amber },
  ],
  trending: [
    { name: 'NFL Tickets', tag: 'NFL', href: '/tickets/sports/nfl' },
    { name: 'Pop Concerts', tag: 'POP', href: '/tickets/concerts/pop' },
    { name: 'Broadway', tag: 'BROADWAY', href: '/tickets/arts-theater-comedy/broadway' },
    { name: 'NBA Tickets', tag: 'NBA', href: '/tickets/sports/nba' },
    { name: 'Hip-Hop Tours', tag: 'HIP-HOP', href: '/tickets/concerts/hip-hop-rap' },
  ],
  aboutTitle: 'About Planviry Tickets',
  aboutBody: [
    'Planviry is your unified destination for live event tickets. Browse concerts across 22 genres, sports across 5 major leagues and 23 other sports, arts and theater from Broadway to comedy, family shows, and events in 78 U.S. cities.',
    'Every event can be bundled with hotels, restaurants, and local experiences through Planviry\'s shared cart and single-checkout itinerary. Plan a complete trip around any live event — game tickets, dinner, and a hotel room, all booked together.',
    'Use the search bar above to find events by location, date range, and type. Check "This Weekend" for last-minute shows near you.',
  ],
}

// ── League-specific content (NFL, NBA, MLB, NHL, MLS) ────────────────────────
const LEAGUE_CONTENT: Record<string, RichTicketContent> = {
  nfl: {
    heroGradient: GRADIENTS.bronze,
    heroEyebrow: 'GRIDIRON',
    title: 'NFL Tickets',
    subtitle: 'All 32 teams. Regular season, playoffs, and Super Bowl. Find your team and stadium.',
    quickLinks: [
      { label: 'AFC Teams', href: '/tickets/sports/nfl/afc' },
      { label: 'NFC Teams', href: '/tickets/sports/nfl/nfc' },
      { label: 'This Weekend', href: '/tickets/search?weekend=true&type=sports&league=nfl' },
      { label: 'Season Tickets', href: '/tickets/search?type=sports&league=nfl&season=true' },
    ],
    popularPicks: [
      { name: 'AFC Conference', tag: 'AFC', subtitle: '16 teams, 4 divisions', href: '/tickets/sports/nfl/afc', gradient: GRADIENTS.bronze },
      { name: 'NFC Conference', tag: 'NFC', subtitle: '16 teams, 4 divisions', href: '/tickets/sports/nfl/nfc', gradient: GRADIENTS.midnight },
      { name: 'Sunday Games', tag: 'WEEKEND', subtitle: 'This weekend\'s matchups', href: '/tickets/search?weekend=true&type=sports&league=nfl', gradient: GRADIENTS.forest },
      { name: 'Prime Time', tag: 'PRIMETIME', subtitle: 'Thursday, Sunday, Monday night', href: '/tickets/search?type=sports&league=nfl&primetime=true', gradient: GRADIENTS.dark },
    ],
    trending: [
      { name: 'Dallas Cowboys', tag: 'DAL', href: '/tickets/sports/team/dallas-cowboys' },
      { name: 'Kansas City Chiefs', tag: 'KC', href: '/tickets/sports/team/kansas-city-chiefs' },
      { name: 'Green Bay Packers', tag: 'GB', href: '/tickets/sports/team/green-bay-packers' },
      { name: 'San Francisco 49ers', tag: 'SF', href: '/tickets/sports/team/san-francisco-49ers' },
      { name: 'Philadelphia Eagles', tag: 'PHI', href: '/tickets/sports/team/philadelphia-eagles' },
    ],
    aboutTitle: 'About NFL Tickets',
    aboutBody: [
      'The National Football League (NFL) is America\'s most-watched sports league, featuring 32 teams split between the American Football Conference (AFC) and National Football Conference (NFC). The regular season runs from September through January, followed by the playoffs and the Super Bowl in February.',
      'Each NFL team plays 17 regular-season games over 18 weeks. Game days are events — tailgating, stadium food, and the energy of 70,000+ fans make every Sunday an experience. Use the search bar to find games near you this weekend or plan a road trip to an away game.',
      'Browse by conference (AFC or NFC) to find your team, then view their full schedule, stadium details, and seating chart. Combine game tickets with hotel stays and tailgate-ready restaurant reservations through Planviry.',
    ],
  },
  nba: {
    heroGradient: GRADIENTS.amber,
    heroEyebrow: 'HARDWOOD',
    title: 'NBA Tickets',
    subtitle: 'All 30 teams. Regular season, playoffs, and NBA Finals. Courtside and upper-level options.',
    quickLinks: [
      { label: 'Eastern Conference', href: '/tickets/sports/nba/eastern-conference' },
      { label: 'Western Conference', href: '/tickets/sports/nba/western-conference' },
      { label: 'This Weekend', href: '/tickets/search?weekend=true&type=sports&league=nba' },
      { label: 'Courtside Seats', href: '/tickets/search?type=sports&league=nba&premium=true' },
    ],
    popularPicks: [
      { name: 'Eastern Conference', tag: 'EAST', subtitle: '15 teams, 3 divisions', href: '/tickets/sports/nba/eastern-conference', gradient: GRADIENTS.crimson },
      { name: 'Western Conference', tag: 'WEST', subtitle: '15 teams, 3 divisions', href: '/tickets/sports/nba/western-conference', gradient: GRADIENTS.teal },
      { name: 'Weekend Games', tag: 'WEEKEND', subtitle: 'Friday–Sunday matchups', href: '/tickets/search?weekend=true&type=sports&league=nba', gradient: GRADIENTS.amber },
      { name: 'Courtside VIP', tag: 'VIP', subtitle: 'Front-row experiences', href: '/tickets/search?type=sports&league=nba&premium=true', gradient: GRADIENTS.dark },
    ],
    trending: [
      { name: 'Los Angeles Lakers', tag: 'LAL', href: '/tickets/sports/team/los-angeles-lakers' },
      { name: 'Boston Celtics', tag: 'BOS', href: '/tickets/sports/team/boston-celtics' },
      { name: 'Golden State Warriors', tag: 'GSW', href: '/tickets/sports/team/golden-state-warriors' },
      { name: 'Denver Nuggets', tag: 'DEN', href: '/tickets/sports/team/denver-nuggets' },
      { name: 'Milwaukee Bucks', tag: 'MIL', href: '/tickets/sports/team/milwaukee-bucks' },
    ],
    aboutTitle: 'About NBA Tickets',
    aboutBody: [
      'The National Basketball Association (NBA) features 30 teams across the Eastern and Western Conferences. The 82-game regular season runs from October through April, followed by the playoffs (April–June) and the NBA Finals.',
      'NBA games are fast-paced, high-scoring affairs in intimate arenas where even upper-level seats feel close to the action. Look for weekend games, rivalry nights, and marquee matchups featuring superstar players.',
      'Browse by conference to find your team, then explore their schedule, home arena, and seating chart. Bundle game tickets with downtown hotel stays and pre-game dinner reservations through Planviry.',
    ],
  },
  mlb: {
    heroGradient: GRADIENTS.emerald,
    heroEyebrow: 'BALLPARK',
    title: 'MLB Tickets',
    subtitle: 'All 30 teams. 162-game season, playoffs, and World Series. Every ballpark, every pitch.',
    quickLinks: [
      { label: 'American League', href: '/tickets/sports/mlb/american-league' },
      { label: 'National League', href: '/tickets/sports/mlb/national-league' },
      { label: 'This Weekend', href: '/tickets/search?weekend=true&type=sports&league=mlb' },
      { label: 'Opening Day', href: '/tickets/search?type=sports&league=mlb&opening=true' },
    ],
    popularPicks: [
      { name: 'American League', tag: 'AL', subtitle: '15 teams, 3 divisions', href: '/tickets/sports/mlb/american-league', gradient: GRADIENTS.bronze },
      { name: 'National League', tag: 'NL', subtitle: '15 teams, 3 divisions', href: '/tickets/sports/mlb/national-league', gradient: GRADIENTS.forest },
      { name: 'Weekend Series', tag: 'WEEKEND', subtitle: '3-game home stands', href: '/tickets/search?weekend=true&type=sports&league=mlb', gradient: GRADIENTS.emerald },
      { name: 'Ballpark Deals', tag: 'DEALS', subtitle: 'Affordable family outings', href: '/tickets/search?type=sports&league=mlb&deals=true', gradient: GRADIENTS.amber },
    ],
    trending: [
      { name: 'New York Yankees', tag: 'NYY', href: '/tickets/sports/team/new-york-yankees' },
      { name: 'Los Angeles Dodgers', tag: 'LAD', href: '/tickets/sports/team/los-angeles-dodgers' },
      { name: 'Chicago Cubs', tag: 'CHC', href: '/tickets/sports/team/chicago-cubs' },
      { name: 'Atlanta Braves', tag: 'ATL', href: '/tickets/sports/team/atlanta-braves' },
      { name: 'Houston Astros', tag: 'HOU', href: '/tickets/sports/team/houston-astros' },
    ],
    aboutTitle: 'About MLB Tickets',
    aboutBody: [
      'Major League Baseball (MLB) features 30 teams split between the American League (AL) and National League (NL). With 162 regular-season games per team from late March through early October, baseball offers more opportunities to see live action than any other major sport.',
      'Every ballpark has its own character — from Fenway Park\'s Green Monster to Wrigley Field\'s ivy walls. Weekend series (typically Friday–Sunday) are perfect for family outings, with day games and promotional giveaways.',
      'Browse by league to find your team, then view their schedule, stadium, and seating chart. Combine ballpark tickets with nearby dining and hotel stays for a complete baseball road trip.',
    ],
  },
  nhl: {
    heroGradient: GRADIENTS.teal,
    heroEyebrow: 'ICE HOCKEY',
    title: 'NHL Tickets',
    subtitle: 'All 32 teams. Regular season, playoffs, and Stanley Cup. Fast, physical, electric.',
    quickLinks: [
      { label: 'Eastern Conference', href: '/tickets/sports/nhl/eastern-conference' },
      { label: 'Western Conference', href: '/tickets/sports/nhl/western-conference' },
      { label: 'This Weekend', href: '/tickets/search?weekend=true&type=sports&league=nhl' },
      { label: 'Rivalry Games', href: '/tickets/search?type=sports&league=nhl&rivalry=true' },
    ],
    popularPicks: [
      { name: 'Eastern Conference', tag: 'EAST', subtitle: '16 teams, 2 divisions', href: '/tickets/sports/nhl/eastern-conference', gradient: GRADIENTS.crimson },
      { name: 'Western Conference', tag: 'WEST', subtitle: '16 teams, 2 divisions', href: '/tickets/sports/nhl/western-conference', gradient: GRADIENTS.teal },
      { name: 'Weekend Hockey', tag: 'WEEKEND', subtitle: 'Friday–Sunday games', href: '/tickets/search?weekend=true&type=sports&league=nhl', gradient: GRADIENTS.midnight },
      { name: 'Rivalry Night', tag: 'RIVALRY', subtitle: 'Classic matchups', href: '/tickets/search?type=sports&league=nhl&rivalry=true', gradient: GRADIENTS.bronze },
    ],
    trending: [
      { name: 'Toronto Maple Leafs', tag: 'TOR', href: '/tickets/sports/team/toronto-maple-leafs' },
      { name: 'Boston Bruins', tag: 'BOS', href: '/tickets/sports/team/boston-bruins' },
      { name: 'New York Rangers', tag: 'NYR', href: '/tickets/sports/team/new-york-rangers' },
      { name: 'Colorado Avalanche', tag: 'COL', href: '/tickets/sports/team/colorado-avalanche' },
      { name: 'Edmonton Oilers', tag: 'EDM', href: '/tickets/sports/team/edmonton-oilers' },
    ],
    aboutTitle: 'About NHL Tickets',
    aboutBody: [
      'The National Hockey League (NHL) features 32 teams across the Eastern and Western Conferences. The 82-game regular season runs from October through April, followed by the Stanley Cup Playoffs (April–June) — the most grueling postseason in professional sports.',
      'NHL games are fast, physical, and electric. The intimate arena setting means great sightlines from most seats, and the energy of a playoff game is unmatched in sports. Look for rivalry games and weekend matchups.',
      'Browse by conference to find your team, then explore their schedule, home arena, and seating chart. Bundle hockey tickets with downtown hotel stays and pre-game dinners through Planviry.',
    ],
  },
  mls: {
    heroGradient: GRADIENTS.forest,
    heroEyebrow: 'SOCCER',
    title: 'MLS Tickets',
    subtitle: 'All 28 clubs. Regular season, playoffs, and MLS Cup. The beautiful game, American style.',
    quickLinks: [
      { label: 'Eastern Conference', href: '/tickets/sports/mls/eastern-conference' },
      { label: 'Western Conference', href: '/tickets/sports/mls/western-conference' },
      { label: 'This Weekend', href: '/tickets/search?weekend=true&type=sports&league=mls' },
      { label: 'Rivalry Week', href: '/tickets/search?type=sports&league=mls&rivalry=true' },
    ],
    popularPicks: [
      { name: 'Eastern Conference', tag: 'EAST', subtitle: '14 clubs', href: '/tickets/sports/mls/eastern-conference', gradient: GRADIENTS.crimson },
      { name: 'Western Conference', tag: 'WEST', subtitle: '14 clubs', href: '/tickets/sports/mls/western-conference', gradient: GRADIENTS.teal },
      { name: 'Weekend Matches', tag: 'WEEKEND', subtitle: 'Saturday game days', href: '/tickets/search?weekend=true&type=sports&league=mls', gradient: GRADIENTS.forest },
      { name: 'Supporters\' Section', tag: 'SG', subtitle: 'Loud, passionate, standing', href: '/tickets/search?type=sports&league=mls&sg=true', gradient: GRADIENTS.amber },
    ],
    trending: [
      { name: 'LAFC', tag: 'LAFC', href: '/tickets/sports/team/lafc' },
      { name: 'Inter Miami CF', tag: 'MIA', href: '/tickets/sports/team/inter-miami-cf' },
      { name: 'Seattle Sounders', tag: 'SEA', href: '/tickets/sports/team/seattle-sounders-fc' },
      { name: 'Atlanta United', tag: 'ATL', href: '/tickets/sports/team/atlanta-united-fc' },
      { name: 'Portland Timbers', tag: 'POR', href: '/tickets/sports/team/portland-timbers' },
    ],
    aboutTitle: 'About MLS Tickets',
    aboutBody: [
      'Major League Soccer (MLS) features 28 clubs across the Eastern and Western Conferences, with the regular season running from late February through October, followed by the MLS Cup Playoffs. Soccer in North America has exploded in popularity, with world-class players and electric supporter cultures.',
      'MLS matchdays are community events — tailgates, supporter marches, and chants create an atmosphere unlike any other American sport. The supporters\' sections are loud, passionate, and standing-room-only for the most dedicated fans.',
      'Browse by conference to find your club, then view their schedule, stadium, and seating chart. Combine match tickets with pre-game brewery visits and hotel stays through Planviry.',
    ],
  },
}

// ── Subcategory content generator ───────────────────────────────────────────
// Produces rich, unique content for every subcategory based on its name and parent group.
const CONCERT_GENRE_BLURB: Record<string, string[]> = {
  rock: [
    'Rock music has driven live music for over 70 years, from early blues-rooted pioneers to arena-filling superstars. Today\'s rock scene spans classic rock reunions, indie rock breakouts, punk and hardcore energy, and metal\'s many subgenres.',
    'Rock concerts are about volume, sweat, and community. Whether it\'s a stadium spectacle with pyrotechnics or a 200-capacity club show, the best rock gigs leave your ears ringing and your voice hoarse. Look for festival appearances and co-headlining tours.',
  ],
  'hip-hop-rap': [
    'Hip-hop is the dominant cultural force of the 21st century, and its live shows have evolved from basement cyphers to stadium-spanning productions. Today\'s top rap tours feature elaborate staging, surprise guests, and setlists that span entire catalogs.',
    'Hip-hop concerts are part music, part theater — every artist brings their own visual language. Look for hometown shows (often the most electric), festival headlining slots, and legacy acts touring classic albums in full.',
  ],
  country: [
    'Country music is America\'s storytelling tradition, and its live shows are legendary for their fan loyalty and singalong energy. From Nashville\'s Grand Ole Opry to stadium-filling tours, country concerts are communal experiences.',
    'Country concerts mean tailgating, boots, and three-hour sets packed with hits. Look for festival packages (CMA Fest, Stagecoach), arena tours, and intimate songwriter rounds at the Bluebird Cafe.',
  ],
  latin: [
    'Latin music encompasses reggaeton, bachata, salsa, merengue, Latin pop, and regional Mexican genres — a diverse ecosystem with some of the most passionate live audiences in the world.',
    'Latin concerts are dance parties first and foremost. Expect extended sets, crowd participation, and shows that run late into the night. Look for festival appearances and arena residencies in major Hispanic markets.',
  ],
  pop: [
    'Pop music defines the mainstream, and pop concerts are where spectacle meets songcraft. Today\'s top pop tours feature choreography, costume changes, and production budgets that rival Broadway shows.',
    'Pop concerts are visual spectacles — LED walls, pyrotechnics, flying rigs, and surprise guest appearances. Look for residency shows (Las Vegas), stadium world tours, and intimate album-release gigs.',
  ],
  'rb': [
    'R&B — rhythm and blues — is the soulful backbone of American popular music. Today\'s R&B blends classic soul influences with modern production, and its live shows prioritize vocals, musicianship, and mood.',
    'R&B concerts are smoother, sexier affairs — think dim lighting, full bands, and setlists designed for slow dances and deep cuts. Look for neo-soul tours, legacy soul revues, and festival late-night sets.',
  ],
}

const DEFAULT_GENRE_BLURB = [
  'This genre has a passionate live music community, with artists touring year-round across clubs, theaters, arenas, and festivals. Use the search bar to find upcoming shows near you, filter by date, and discover new artists.',
  'Each listing includes venue details, ticket availability, and seating information. Combine your concert tickets with dining and accommodations through Planviry\'s unified booking platform for a complete night out.',
]

function generateConcertSubContent(slug: string, name: string): RichTicketContent {
  const blurb = CONCERT_GENRE_BLURB[slug] || DEFAULT_GENRE_BLURB
  return {
    heroGradient: GRADIENTS.crimson,
    heroEyebrow: 'CONCERTS',
    title: `${name} Concert Tickets`,
    subtitle: `Find and buy tickets for upcoming ${name.toLowerCase()} concerts. Browse tours, festivals, and club shows.`,
    quickLinks: [
      { label: 'This Weekend', href: `/tickets/search?weekend=true&type=concerts&genre=${slug}` },
      { label: 'Tickets Under $100', href: `/tickets/search?maxPrice=100&type=concerts&genre=${slug}` },
      { label: 'VIP Packages', href: `/tickets/search?vip=true&type=concerts&genre=${slug}` },
      { label: 'All Concerts', href: '/tickets/concerts' },
    ],
    popularPicks: [
      { name: `${name} Tours`, tag: name.toUpperCase(), subtitle: 'On tour now', href: `/tickets/search?type=concerts&genre=${slug}`, gradient: GRADIENTS.crimson },
      { name: 'This Weekend', tag: 'WEEKEND', subtitle: 'Shows near you', href: `/tickets/search?weekend=true&type=concerts&genre=${slug}`, gradient: GRADIENTS.amber },
      { name: 'Festival Sets', tag: 'FESTIVAL', subtitle: 'Catch them at festivals', href: `/tickets/search?type=concerts&genre=${slug}&festival=true`, gradient: GRADIENTS.royal },
      { name: 'Intimate Shows', tag: 'CLUB', subtitle: 'Small-venue gigs', href: `/tickets/search?type=concerts&genre=${slug}&venue=club`, gradient: GRADIENTS.midnight },
    ],
    trending: [
      { name: 'Rock', tag: 'ROCK', href: '/tickets/concerts/rock' },
      { name: 'Pop', tag: 'POP', href: '/tickets/concerts/pop' },
      { name: 'Hip-Hop', tag: 'HIP-HOP', href: '/tickets/concerts/hip-hop-rap' },
      { name: 'Country', tag: 'COUNTRY', href: '/tickets/concerts/country' },
      { name: 'Latin', tag: 'LATIN', href: '/tickets/concerts/latin' },
    ],
    aboutTitle: `About ${name} Concerts`,
    aboutBody: blurb,
  }
}

function generateArtsSubContent(slug: string, name: string): RichTicketContent {
  return {
    heroGradient: GRADIENTS.royal,
    heroEyebrow: 'ARTS & THEATER',
    title: `${name} Tickets`,
    subtitle: `Find and buy tickets for upcoming ${name.toLowerCase()} performances and productions.`,
    quickLinks: [
      { label: 'This Weekend', href: `/tickets/search?weekend=true&type=arts-theater-comedy&sub=${slug}` },
      { label: 'Tickets Under $100', href: `/tickets/search?maxPrice=100&type=arts-theater-comedy&sub=${slug}` },
      { label: 'All Arts & Theater', href: '/tickets/arts-theater-comedy' },
    ],
    popularPicks: [
      { name: `${name} Shows`, tag: name.toUpperCase(), subtitle: 'Now playing', href: `/tickets/search?type=arts-theater-comedy&sub=${slug}`, gradient: GRADIENTS.royal },
      { name: 'This Weekend', tag: 'WEEKEND', subtitle: 'Performances near you', href: `/tickets/search?weekend=true&type=arts-theater-comedy&sub=${slug}`, gradient: GRADIENTS.amber },
      { name: 'Broadway', tag: 'BROADWAY', subtitle: 'The Great White Way', href: '/tickets/arts-theater-comedy/broadway', gradient: GRADIENTS.crimson },
      { name: 'Comedy', tag: 'COMEDY', subtitle: 'Stand-up tours', href: '/tickets/arts-theater-comedy/comedy', gradient: GRADIENTS.midnight },
    ],
    trending: [
      { name: 'Broadway', tag: 'BROADWAY', href: '/tickets/arts-theater-comedy/broadway' },
      { name: 'Comedy', tag: 'COMEDY', href: '/tickets/arts-theater-comedy/comedy' },
      { name: 'Opera', tag: 'OPERA', href: '/tickets/arts-theater-comedy/opera' },
      { name: 'Dance', tag: 'DANCE', href: '/tickets/arts-theater-comedy/dance' },
      { name: 'Magic', tag: 'MAGIC', href: '/tickets/arts-theater-comedy/magic-illusion' },
    ],
    aboutTitle: `About ${name}`,
    aboutBody: [
      `${name} is a vibrant part of the live arts scene, with performances ranging from intimate productions to large-scale spectaculars. Artists and companies tour year-round, bringing their work to theaters and venues across the country.`,
      `Use the search bar to find upcoming ${name.toLowerCase()} performances near you. Filter by date range and check "This Weekend" for last-minute shows. Each listing includes venue details, runtime, and seating information.`,
      `Make it a full evening — pair your tickets with dinner reservations and pre-show drinks through Planviry's unified booking platform.`,
    ],
  }
}

function generateFamilySubContent(slug: string, name: string): RichTicketContent {
  return {
    heroGradient: GRADIENTS.amber,
    heroEyebrow: 'FAMILY',
    title: `${name} Tickets`,
    subtitle: `Find and buy tickets for upcoming ${name.toLowerCase()} events. Family-friendly shows for all ages.`,
    quickLinks: [
      { label: 'This Weekend', href: `/tickets/search?weekend=true&type=family&sub=${slug}` },
      { label: 'All Family Events', href: '/tickets/family' },
      { label: 'Group Discounts', href: `/tickets/search?type=family&sub=${slug}&group=true` },
    ],
    popularPicks: [
      { name: `${name} Shows`, tag: name.toUpperCase(), subtitle: 'Coming soon', href: `/tickets/search?type=family&sub=${slug}`, gradient: GRADIENTS.amber },
      { name: 'This Weekend', tag: 'WEEKEND', subtitle: 'Family fun near you', href: `/tickets/search?weekend=true&type=family&sub=${slug}`, gradient: GRADIENTS.teal },
      { name: 'Ice Shows', tag: 'ICE', subtitle: 'Spectacles on skates', href: '/tickets/family/ice-shows', gradient: GRADIENTS.teal },
      { name: 'Circus', tag: 'CIRCUS', subtitle: 'The Greatest Show', href: '/tickets/family/circus-specialty-acts', gradient: GRADIENTS.crimson },
    ],
    trending: [
      { name: 'Ice Shows', tag: 'ICE', href: '/tickets/family/ice-shows' },
      { name: 'Circus', tag: 'CIRCUS', href: '/tickets/family/circus-specialty-acts' },
      { name: "Children's Theater", tag: 'THEATER', href: '/tickets/family/childrens-theater' },
      { name: 'Magic', tag: 'MAGIC', href: '/tickets/family/magic-illusion' },
      { name: 'Fairs', tag: 'FAIRS', href: '/tickets/family/fairs-festivals' },
    ],
    aboutTitle: `About ${name}`,
    aboutBody: [
      `${name} is a beloved category of family entertainment, with touring productions and local shows happening year-round. These events are designed for audiences of all ages, with many offering special meet-and-greet experiences and interactive elements.`,
      `Use the search bar to find ${name.toLowerCase()} events near you. Filter by date and check "This Weekend" for upcoming shows. Each listing includes age recommendations, runtime, and venue accessibility information.`,
      `Plan a complete family day out — combine show tickets with nearby restaurants and attractions through Planviry's unified itinerary.`,
    ],
  }
}

function generateCityContent(slug: string, name: string): RichTicketContent {
  const cityGradient = GRADIENTS.dark
  return {
    heroGradient: cityGradient,
    heroEyebrow: 'CITY GUIDE',
    title: `${name} Events`,
    subtitle: `Concerts, sports, theater, and family events in ${name}. Find what's happening near you.`,
    quickLinks: [
      { label: 'Concerts', href: `/tickets/search?city=${slug}&type=concerts` },
      { label: 'Sports', href: `/tickets/search?city=${slug}&type=sports` },
      { label: 'This Weekend', href: `/tickets/search?city=${slug}&weekend=true` },
      { label: 'All Cities', href: '/tickets/cities' },
    ],
    popularPicks: [
      { name: `${name} Concerts`, tag: 'MUSIC', subtitle: 'Live music in town', href: `/tickets/search?city=${slug}&type=concerts`, gradient: GRADIENTS.crimson },
      { name: `${name} Sports`, tag: 'SPORTS', subtitle: 'Home games & events', href: `/tickets/search?city=${slug}&type=sports`, gradient: GRADIENTS.forest },
      { name: `${name} Theater`, tag: 'STAGE', subtitle: 'Broadway & comedy', href: `/tickets/search?city=${slug}&type=arts-theater-comedy`, gradient: GRADIENTS.royal },
      { name: 'This Weekend', tag: 'WEEKEND', subtitle: 'Happening soon', href: `/tickets/search?city=${slug}&weekend=true`, gradient: GRADIENTS.amber },
    ],
    trending: [
      { name: 'New York City', tag: 'NYC', href: '/tickets/cities/new-york-city' },
      { name: 'Las Vegas', tag: 'VEGAS', href: '/tickets/cities/las-vegas' },
      { name: 'Nashville', tag: 'MUSIC CITY', href: '/tickets/cities/nashville' },
      { name: 'Chicago', tag: 'CHI', href: '/tickets/cities/chicago' },
      { name: 'Los Angeles', tag: 'LA', href: '/tickets/cities/los-angeles' },
    ],
    aboutTitle: `About Events in ${name}`,
    aboutBody: [
      `${name} is home to a vibrant live events scene, with concerts, sports, theater, comedy, and family shows happening year-round. From arena spectacles to intimate club gigs, the city offers something for every taste and budget.`,
      `Use the search bar to find events in ${name} by date range and type. Check "This Weekend" for last-minute shows, or plan ahead for a specific date. Every listing includes venue details and ticket availability.`,
      `Visiting ${name}? Bundle event tickets with hotel rooms, restaurant reservations, and local experiences through Planviry's unified itinerary — one cart, one checkout.`,
    ],
  }
}

function generateOtherSportContent(slug: string, name: string): RichTicketContent {
  return {
    heroGradient: GRADIENTS.forest,
    heroEyebrow: 'SPORTS',
    title: `${name} Tickets`,
    subtitle: `Find and buy tickets for upcoming ${name.toLowerCase()} events and competitions.`,
    quickLinks: [
      { label: 'This Weekend', href: `/tickets/search?weekend=true&type=sports&sport=${slug}` },
      { label: 'All Sports', href: '/tickets/sports' },
      { label: 'Major Leagues', href: '/tickets/sports' },
    ],
    popularPicks: [
      { name: `${name} Events`, tag: name.toUpperCase(), subtitle: 'Upcoming competitions', href: `/tickets/search?type=sports&sport=${slug}`, gradient: GRADIENTS.forest },
      { name: 'This Weekend', tag: 'WEEKEND', subtitle: 'Events near you', href: `/tickets/search?weekend=true&type=sports&sport=${slug}`, gradient: GRADIENTS.amber },
      { name: 'NFL', tag: 'NFL', subtitle: 'Football season', href: '/tickets/sports/nfl', gradient: GRADIENTS.bronze },
      { name: 'NBA', tag: 'NBA', subtitle: 'Basketball season', href: '/tickets/sports/nba', gradient: GRADIENTS.amber },
    ],
    trending: [
      { name: 'NFL', tag: 'NFL', href: '/tickets/sports/nfl' },
      { name: 'NBA', tag: 'NBA', href: '/tickets/sports/nba' },
      { name: 'MLB', tag: 'MLB', href: '/tickets/sports/mlb' },
      { name: 'NHL', tag: 'NHL', href: '/tickets/sports/nhl' },
      { name: 'MLS', tag: 'MLS', href: '/tickets/sports/mls' },
    ],
    aboutTitle: `About ${name}`,
    aboutBody: [
      `${name} has a dedicated following, with events and competitions happening year-round across the country. From local tournaments to national championships, there are plenty of opportunities to catch live action.`,
      `Use the search bar to find ${name.toLowerCase()} events near you. Filter by date and check "This Weekend" for upcoming competitions. Each listing includes venue details and ticket information.`,
      `Combine your event tickets with travel, dining, and accommodations through Planviry's unified booking platform.`,
    ],
  }
}

function generateConferenceContent(leagueSlug: string, leagueName: string, confName: string, confSlug: string): RichTicketContent {
  return {
    heroGradient: GRADIENTS.midnight,
    heroEyebrow: leagueName,
    title: `${leagueName} ${confName} Tickets`,
    subtitle: `All ${confName} teams. Browse schedules, stadiums, and seating charts.`,
    quickLinks: [
      { label: 'All Teams', href: `/tickets/sports/${leagueSlug}/${confSlug}` },
      { label: 'This Weekend', href: `/tickets/search?weekend=true&type=sports&league=${leagueSlug}&conf=${confSlug}` },
      { label: `All ${leagueName}`, href: `/tickets/sports/${leagueSlug}` },
    ],
    popularPicks: [
      { name: `${confName} Teams`, tag: confName.toUpperCase(), subtitle: 'Browse all teams', href: `/tickets/sports/${leagueSlug}/${confSlug}`, gradient: GRADIENTS.midnight },
      { name: 'This Weekend', tag: 'WEEKEND', subtitle: 'Conference matchups', href: `/tickets/search?weekend=true&type=sports&league=${leagueSlug}&conf=${confSlug}`, gradient: GRADIENTS.amber },
      { name: leagueName, tag: leagueName, subtitle: 'All leagues', href: `/tickets/sports/${leagueSlug}`, gradient: GRADIENTS.forest },
      { name: 'All Sports', tag: 'SPORTS', subtitle: 'Every league', href: '/tickets/sports', gradient: GRADIENTS.crimson },
    ],
    trending: [
      { name: 'NFL', tag: 'NFL', href: '/tickets/sports/nfl' },
      { name: 'NBA', tag: 'NBA', href: '/tickets/sports/nba' },
      { name: 'MLB', tag: 'MLB', href: '/tickets/sports/mlb' },
      { name: 'NHL', tag: 'NHL', href: '/tickets/sports/nhl' },
      { name: 'MLS', tag: 'MLS', href: '/tickets/sports/mls' },
    ],
    aboutTitle: `About ${leagueName} ${confName}`,
    aboutBody: [
      `The ${confName} is one of two conferences in the ${leagueName}, featuring teams across multiple divisions. Conference games are often the most competitive, with playoff seeding and rivalry bragging rights on the line.`,
      `Browse all ${confName} teams below, or use the search bar to find games happening this weekend. Each team page includes their full schedule, home stadium, and seating chart.`,
      `Combine game tickets with hotel stays and pre-game dining through Planviry's unified booking platform.`,
    ],
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

export function getTicketsRootContent(): RichTicketContent {
  return ALL_TICKETS_CONTENT
}

export function getGroupContent(groupSlug: string): RichTicketContent {
  switch (groupSlug) {
    case 'concerts': return CONCERTS_CONTENT
    case 'sports': return SPORTS_CONTENT
    case 'arts-theater-comedy': return ARTS_CONTENT
    case 'family': return FAMILY_CONTENT
    case 'cities': return CITIES_CONTENT
    default: return ALL_TICKETS_CONTENT
  }
}

export function getSubcategoryContent(groupSlug: string, subSlug: string, subName: string): RichTicketContent {
  switch (groupSlug) {
    case 'concerts': return generateConcertSubContent(subSlug, subName)
    case 'arts-theater-comedy': return generateArtsSubContent(subSlug, subName)
    case 'family': return generateFamilySubContent(subSlug, subName)
    default: return generateConcertSubContent(subSlug, subName)
  }
}

export function getLeagueContent(leagueSlug: string): RichTicketContent {
  return LEAGUE_CONTENT[leagueSlug] || SPORTS_CONTENT
}

export function getOtherSportContent(slug: string, name: string): RichTicketContent {
  return generateOtherSportContent(slug, name)
}

export function getConferenceContent(leagueSlug: string, leagueName: string, confName: string, confSlug: string): RichTicketContent {
  return generateConferenceContent(leagueSlug, leagueName, confName, confSlug)
}

export function getCityContent(slug: string, name: string): RichTicketContent {
  return generateCityContent(slug, name)
}
