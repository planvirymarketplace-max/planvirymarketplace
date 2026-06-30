/**
 * Sports Teams Taxonomy
 *
 * Complete team data for the 5 major US leagues: NFL, NBA, MLB, NHL, MLS.
 * Each team has: name, slug, league, conference, city, state, stadium name,
 * stadium address, lat/lng (for maps), team colors, and division.
 *
 * This powers the ticketing system: League -> Conference -> Teams -> Team page
 * (stadium + schedule + seating chart).
 */

export interface Team {
  name: string
  slug: string
  league: string // nfl, nba, mlb, nhl, mls
  conference: string // afc, nfc, eastern, western, american, national
  division?: string // AFC East, NFC North, etc.
  city: string
  state: string
  stateAbbr: string
  stadium: string
  stadiumAddress: string
  lat?: number
  lng?: number
  colors: { primary: string; secondary: string }
}

// ── NFL ─────────────────────────────────────────────────────────────────────
const NFL_TEAMS: Team[] = [
  // AFC East
  { name: 'Buffalo Bills', slug: 'buffalo-bills', league: 'nfl', conference: 'afc', division: 'AFC East', city: 'Orchard Park', state: 'New York', stateAbbr: 'NY', stadium: 'Highmark Stadium', stadiumAddress: '1 Bills Dr, Orchard Park, NY 14127', lat: 42.7737, lng: -78.7869, colors: { primary: '#00338D', secondary: '#C60C30' } },
  { name: 'Miami Dolphins', slug: 'miami-dolphins', league: 'nfl', conference: 'afc', division: 'AFC East', city: 'Miami Gardens', state: 'Florida', stateAbbr: 'FL', stadium: 'Hard Rock Stadium', stadiumAddress: '347 Don Shula Dr, Miami Gardens, FL 33056', lat: 25.9580, lng: -80.2389, colors: { primary: '#008E97', secondary: '#FC4C02' } },
  { name: 'New England Patriots', slug: 'new-england-patriots', league: 'nfl', conference: 'afc', division: 'AFC East', city: 'Foxborough', state: 'Massachusetts', stateAbbr: 'MA', stadium: 'Gillette Stadium', stadiumAddress: '1 Patriot Pl, Foxborough, MA 02035', lat: 42.0909, lng: -71.2643, colors: { primary: '#002244', secondary: '#C60C30' } },
  { name: 'New York Jets', slug: 'new-york-jets', league: 'nfl', conference: 'afc', division: 'AFC East', city: 'East Rutherford', state: 'New Jersey', stateAbbr: 'NJ', stadium: 'MetLife Stadium', stadiumAddress: '1 MetLife Stadium Dr, East Rutherford, NJ 07073', lat: 40.8128, lng: -74.0742, colors: { primary: '#125740', secondary: '#000000' } },
  // AFC North
  { name: 'Baltimore Ravens', slug: 'baltimore-ravens', league: 'nfl', conference: 'afc', division: 'AFC North', city: 'Baltimore', state: 'Maryland', stateAbbr: 'MD', stadium: 'M&T Bank Stadium', stadiumAddress: '1101 Russell St, Baltimore, MD 21230', lat: 39.2780, lng: -76.6224, colors: { primary: '#241773', secondary: '#000000' } },
  { name: 'Cincinnati Bengals', slug: 'cincinnati-bengals', league: 'nfl', conference: 'afc', division: 'AFC North', city: 'Cincinnati', state: 'Ohio', stateAbbr: 'OH', stadium: 'Paycor Stadium', stadiumAddress: '1 Paul Brown Stadium Way, Cincinnati, OH 45202', lat: 39.0954, lng: -84.5160, colors: { primary: '#FB4F14', secondary: '#000000' } },
  { name: 'Cleveland Browns', slug: 'cleveland-browns', league: 'nfl', conference: 'afc', division: 'AFC North', city: 'Cleveland', state: 'Ohio', stateAbbr: 'OH', stadium: 'Cleveland Browns Stadium', stadiumAddress: '100 Alfred Lerner Way, Cleveland, OH 44114', lat: 41.5061, lng: -81.6995, colors: { primary: '#311D00', secondary: '#FF3C00' } },
  { name: 'Pittsburgh Steelers', slug: 'pittsburgh-steelers', league: 'nfl', conference: 'afc', division: 'AFC North', city: 'Pittsburgh', state: 'Pennsylvania', stateAbbr: 'PA', stadium: 'Acrisure Stadium', stadiumAddress: '100 Art Rooney Ave, Pittsburgh, PA 15212', lat: 40.4468, lng: -80.0158, colors: { primary: '#FFB612', secondary: '#101820' } },
  // AFC South
  { name: 'Houston Texans', slug: 'houston-texans', league: 'nfl', conference: 'afc', division: 'AFC South', city: 'Houston', state: 'Texas', stateAbbr: 'TX', stadium: 'NRG Stadium', stadiumAddress: 'NRG Pkwy, Houston, TX 77054', lat: 29.6847, lng: -95.4107, colors: { primary: '#03202F', secondary: '#A71930' } },
  { name: 'Indianapolis Colts', slug: 'indianapolis-colts', league: 'nfl', conference: 'afc', division: 'AFC South', city: 'Indianapolis', state: 'Indiana', stateAbbr: 'IN', stadium: 'Lucas Oil Stadium', stadiumAddress: '500 S Capitol Ave, Indianapolis, IN 46225', lat: 39.7601, lng: -86.1639, colors: { primary: '#002C5F', secondary: '#FFFFFF' } },
  { name: 'Jacksonville Jaguars', slug: 'jacksonville-jaguars', league: 'nfl', conference: 'afc', division: 'AFC South', city: 'Jacksonville', state: 'Florida', stateAbbr: 'FL', stadium: 'TIAA Bank Field', stadiumAddress: '1 TIAA Bank Field Dr, Jacksonville, FL 32202', lat: 30.3239, lng: -81.6373, colors: { primary: '#101820', secondary: '#D7A22A' } },
  { name: 'Tennessee Titans', slug: 'tennessee-titans', league: 'nfl', conference: 'afc', division: 'AFC South', city: 'Nashville', state: 'Tennessee', stateAbbr: 'TN', stadium: 'Nissan Stadium', stadiumAddress: '1 Titans Way, Nashville, TN 37213', lat: 36.1665, lng: -86.7713, colors: { primary: '#0C2340', secondary: '#4B92DB' } },
  // AFC West
  { name: 'Denver Broncos', slug: 'denver-broncos', league: 'nfl', conference: 'afc', division: 'AFC West', city: 'Denver', state: 'Colorado', stateAbbr: 'CO', stadium: 'Empower Field at Mile High', stadiumAddress: '1701 Bryant St, Denver, CO 80204', lat: 39.7439, lng: -105.0201, colors: { primary: '#FB4F14', secondary: '#002244' } },
  { name: 'Kansas City Chiefs', slug: 'kansas-city-chiefs', league: 'nfl', conference: 'afc', division: 'AFC West', city: 'Kansas City', state: 'Missouri', stateAbbr: 'MO', stadium: 'GEHA Field at Arrowhead Stadium', stadiumAddress: '1 Arrowhead Dr, Kansas City, MO 64129', lat: 39.0489, lng: -94.4840, colors: { primary: '#E31837', secondary: '#FFB81C' } },
  { name: 'Las Vegas Raiders', slug: 'las-vegas-raiders', league: 'nfl', conference: 'afc', division: 'AFC West', city: 'Paradise', state: 'Nevada', stateAbbr: 'NV', stadium: 'Allegiant Stadium', stadiumAddress: '3333 Al Davis Way, Las Vegas, NV 89118', lat: 36.0909, lng: -115.1834, colors: { primary: '#000000', secondary: '#A5ACAF' } },
  { name: 'Los Angeles Chargers', slug: 'los-angeles-chargers', league: 'nfl', conference: 'afc', division: 'AFC West', city: 'Inglewood', state: 'California', stateAbbr: 'CA', stadium: 'SoFi Stadium', stadiumAddress: '1001 Stadium Dr, Inglewood, CA 90301', lat: 33.9536, lng: -118.3390, colors: { primary: '#0080C6', secondary: '#FFC20E' } },
  // NFC East
  { name: 'Dallas Cowboys', slug: 'dallas-cowboys', league: 'nfl', conference: 'nfc', division: 'NFC East', city: 'Arlington', state: 'Texas', stateAbbr: 'TX', stadium: 'AT&T Stadium', stadiumAddress: '1 AT&T Way, Arlington, TX 76011', lat: 32.7473, lng: -97.0945, colors: { primary: '#003594', secondary: '#869397' } },
  { name: 'New York Giants', slug: 'new-york-giants', league: 'nfl', conference: 'nfc', division: 'NFC East', city: 'East Rutherford', state: 'New Jersey', stateAbbr: 'NJ', stadium: 'MetLife Stadium', stadiumAddress: '1 MetLife Stadium Dr, East Rutherford, NJ 07073', lat: 40.8128, lng: -74.0742, colors: { primary: '#0B2265', secondary: '#A71930' } },
  { name: 'Philadelphia Eagles', slug: 'philadelphia-eagles', league: 'nfl', conference: 'nfc', division: 'NFC East', city: 'Philadelphia', state: 'Pennsylvania', stateAbbr: 'PA', stadium: 'Lincoln Financial Field', stadiumAddress: '1 Lincoln Financial Field Way, Philadelphia, PA 19147', lat: 39.9008, lng: -75.1674, colors: { primary: '#004C54', secondary: '#A5ACAF' } },
  { name: 'Washington Commanders', slug: 'washington-commanders', league: 'nfl', conference: 'nfc', division: 'NFC East', city: 'Landover', state: 'Maryland', stateAbbr: 'MD', stadium: 'Northwest Stadium', stadiumAddress: '1600 Fedex Field, Landover, MD 20785', lat: 38.9076, lng: -76.8645, colors: { primary: '#5A1414', secondary: '#FFB612' } },
  // NFC North
  { name: 'Chicago Bears', slug: 'chicago-bears', league: 'nfl', conference: 'nfc', division: 'NFC North', city: 'Chicago', state: 'Illinois', stateAbbr: 'IL', stadium: 'Soldier Field', stadiumAddress: '1410 Museum Campus Dr, Chicago, IL 60605', lat: 41.8623, lng: -87.6168, colors: { primary: '#0B162A', secondary: '#C83803' } },
  { name: 'Detroit Lions', slug: 'detroit-lions', league: 'nfl', conference: 'nfc', division: 'NFC North', city: 'Detroit', state: 'Michigan', stateAbbr: 'MI', stadium: 'Ford Field', stadiumAddress: '2000 Brush St, Detroit, MI 48226', lat: 42.3400, lng: -83.0456, colors: { primary: '#0076B6', secondary: '#B0B7BC' } },
  { name: 'Green Bay Packers', slug: 'green-bay-packers', league: 'nfl', conference: 'nfc', division: 'NFC North', city: 'Green Bay', state: 'Wisconsin', stateAbbr: 'WI', stadium: 'Lambeau Field', stadiumAddress: '1265 Lombardi Ave, Green Bay, WI 54304', lat: 44.5013, lng: -88.0622, colors: { primary: '#203731', secondary: '#FFB612' } },
  { name: 'Minnesota Vikings', slug: 'minnesota-vikings', league: 'nfl', conference: 'nfc', division: 'NFC North', city: 'Minneapolis', state: 'Minnesota', stateAbbr: 'MN', stadium: 'U.S. Bank Stadium', stadiumAddress: '401 Chicago Ave, Minneapolis, MN 55415', lat: 44.9737, lng: -93.2577, colors: { primary: '#4F2683', secondary: '#FFC62F' } },
  // NFC South
  { name: 'Atlanta Falcons', slug: 'atlanta-falcons', league: 'nfl', conference: 'nfc', division: 'NFC South', city: 'Atlanta', state: 'Georgia', stateAbbr: 'GA', stadium: 'Mercedes-Benz Stadium', stadiumAddress: '1 AMB Drive NW, Atlanta, GA 30313', lat: 33.7555, lng: -84.4010, colors: { primary: '#A71930', secondary: '#000000' } },
  { name: 'Carolina Panthers', slug: 'carolina-panthers', league: 'nfl', conference: 'nfc', division: 'NFC South', city: 'Charlotte', state: 'North Carolina', stateAbbr: 'NC', stadium: 'Bank of America Stadium', stadiumAddress: '800 S Mint St, Charlotte, NC 28202', lat: 35.2258, lng: -80.8528, colors: { primary: '#0085CA', secondary: '#101820' } },
  { name: 'New Orleans Saints', slug: 'new-orleans-saints', league: 'nfl', conference: 'nfc', division: 'NFC South', city: 'New Orleans', state: 'Louisiana', stateAbbr: 'LA', stadium: 'Caesars Superdome', stadiumAddress: '1500 Sugar Bowl Dr, New Orleans, LA 70112', lat: 29.9511, lng: -90.0812, colors: { primary: '#D3BC8D', secondary: '#101820' } },
  { name: 'Tampa Bay Buccaneers', slug: 'tampa-bay-buccaneers', league: 'nfl', conference: 'nfc', division: 'NFC South', city: 'Tampa', state: 'Florida', stateAbbr: 'FL', stadium: 'Raymond James Stadium', stadiumAddress: '4202 N Dale Mabry Hwy, Tampa, FL 33607', lat: 27.9759, lng: -82.5033, colors: { primary: '#D50A0A', secondary: '#34302B' } },
  // NFC West
  { name: 'Arizona Cardinals', slug: 'arizona-cardinals', league: 'nfl', conference: 'nfc', division: 'NFC West', city: 'Glendale', state: 'Arizona', stateAbbr: 'AZ', stadium: 'State Farm Stadium', stadiumAddress: '1 Cardinals Dr, Glendale, AZ 85305', lat: 33.5276, lng: -112.2626, colors: { primary: '#97233F', secondary: '#000000' } },
  { name: 'Los Angeles Rams', slug: 'los-angeles-rams', league: 'nfl', conference: 'nfc', division: 'NFC West', city: 'Inglewood', state: 'California', stateAbbr: 'CA', stadium: 'SoFi Stadium', stadiumAddress: '1001 Stadium Dr, Inglewood, CA 90301', lat: 33.9536, lng: -118.3390, colors: { primary: '#003594', secondary: '#FFA300' } },
  { name: 'San Francisco 49ers', slug: 'san-francisco-49ers', league: 'nfl', conference: 'nfc', division: 'NFC West', city: 'Santa Clara', state: 'California', stateAbbr: 'CA', stadium: 'Levi\'s Stadium', stadiumAddress: '4900 Marie P DeBartolo Way, Santa Clara, CA 95054', lat: 37.4030, lng: -121.9696, colors: { primary: '#AA0000', secondary: '#B3995D' } },
  { name: 'Seattle Seahawks', slug: 'seattle-seahawks', league: 'nfl', conference: 'nfc', division: 'NFC West', city: 'Seattle', state: 'Washington', stateAbbr: 'WA', stadium: 'Lumen Field', stadiumAddress: '800 Occidental Ave S, Seattle, WA 98134', lat: 47.5952, lng: -122.3316, colors: { primary: '#002244', secondary: '#69BE28' } },
]

// ── NBA ─────────────────────────────────────────────────────────────────────
const NBA_TEAMS: Team[] = [
  // Eastern Conference - Atlantic
  { name: 'Boston Celtics', slug: 'boston-celtics', league: 'nba', conference: 'eastern-conference', division: 'Atlantic', city: 'Boston', state: 'Massachusetts', stateAbbr: 'MA', stadium: 'TD Garden', stadiumAddress: '100 Legends Way, Boston, MA 02114', lat: 42.3662, lng: -71.0622, colors: { primary: '#007A33', secondary: '#BA9653' } },
  { name: 'Brooklyn Nets', slug: 'brooklyn-nets', league: 'nba', conference: 'eastern-conference', division: 'Atlantic', city: 'Brooklyn', state: 'New York', stateAbbr: 'NY', stadium: 'Barclays Center', stadiumAddress: '620 Atlantic Ave, Brooklyn, NY 11217', lat: 40.6826, lng: -73.9750, colors: { primary: '#000000', secondary: '#FFFFFF' } },
  { name: 'New York Knicks', slug: 'new-york-knicks', league: 'nba', conference: 'eastern-conference', division: 'Atlantic', city: 'New York', state: 'New York', stateAbbr: 'NY', stadium: 'Madison Square Garden', stadiumAddress: '4 Pennsylvania Plaza, New York, NY 10001', lat: 40.7505, lng: -73.9934, colors: { primary: '#006BB6', secondary: '#F58426' } },
  { name: 'Philadelphia 76ers', slug: 'philadelphia-76ers', league: 'nba', conference: 'eastern-conference', division: 'Atlantic', city: 'Philadelphia', state: 'Pennsylvania', stateAbbr: 'PA', stadium: 'Wells Fargo Center', stadiumAddress: '3601 S Broad St, Philadelphia, PA 19148', lat: 39.9012, lng: -75.1719, colors: { primary: '#006BB6', secondary: '#ED174C' } },
  { name: 'Toronto Raptors', slug: 'toronto-raptors', league: 'nba', conference: 'eastern-conference', division: 'Atlantic', city: 'Toronto', state: 'Ontario', stateAbbr: 'ON', stadium: 'Scotiabank Arena', stadiumAddress: '40 Bay St, Toronto, ON M5J 2X2', lat: 43.6435, lng: -79.3791, colors: { primary: '#CE1141', secondary: '#000000' } },
  // Eastern Conference - Central
  { name: 'Chicago Bulls', slug: 'chicago-bulls', league: 'nba', conference: 'eastern-conference', division: 'Central', city: 'Chicago', state: 'Illinois', stateAbbr: 'IL', stadium: 'United Center', stadiumAddress: '1901 W Madison St, Chicago, IL 60612', lat: 41.8803, lng: -87.6741, colors: { primary: '#CE1141', secondary: '#000000' } },
  { name: 'Cleveland Cavaliers', slug: 'cleveland-cavaliers', league: 'nba', conference: 'eastern-conference', division: 'Central', city: 'Cleveland', state: 'Ohio', stateAbbr: 'OH', stadium: 'Rocket Mortgage FieldHouse', stadiumAddress: '1 Center Ct, Cleveland, OH 44115', lat: 41.4966, lng: -81.6880, colors: { primary: '#860038', secondary: '#FDBB30' } },
  { name: 'Detroit Pistons', slug: 'detroit-pistons', league: 'nba', conference: 'eastern-conference', division: 'Central', city: 'Detroit', state: 'Michigan', stateAbbr: 'MI', stadium: 'Little Caesars Arena', stadiumAddress: '2645 Woodward Ave, Detroit, MI 48201', lat: 42.3410, lng: -83.0552, colors: { primary: '#C8102E', secondary: '#1D42BA' } },
  { name: 'Indiana Pacers', slug: 'indiana-pacers', league: 'nba', conference: 'eastern-conference', division: 'Central', city: 'Indianapolis', state: 'Indiana', stateAbbr: 'IN', stadium: 'Gainbridge Fieldhouse', stadiumAddress: '125 S Pennsylvania St, Indianapolis, IN 46204', lat: 39.7639, lng: -86.1557, colors: { primary: '#002D62', secondary: '#FDBB30' } },
  { name: 'Milwaukee Bucks', slug: 'milwaukee-bucks', league: 'nba', conference: 'eastern-conference', division: 'Central', city: 'Milwaukee', state: 'Wisconsin', stateAbbr: 'WI', stadium: 'Fiserv Forum', stadiumAddress: '1111 Vel R. Phillips Ave, Milwaukee, WI 53203', lat: 43.0451, lng: -87.9173, colors: { primary: '#00471B', secondary: '#EEE1C6' } },
  // Eastern Conference - Southeast
  { name: 'Atlanta Hawks', slug: 'atlanta-hawks', league: 'nba', conference: 'eastern-conference', division: 'Southeast', city: 'Atlanta', state: 'Georgia', stateAbbr: 'GA', stadium: 'State Farm Arena', stadiumAddress: '1 State Farm Dr, Atlanta, GA 30303', lat: 33.7573, lng: -84.3963, colors: { primary: '#E03A3E', secondary: '#C1D32F' } },
  { name: 'Charlotte Hornets', slug: 'charlotte-hornets', league: 'nba', conference: 'eastern-conference', division: 'Southeast', city: 'Charlotte', state: 'North Carolina', stateAbbr: 'NC', stadium: 'Spectrum Center', stadiumAddress: '333 E Trade St, Charlotte, NC 28202', lat: 35.2250, lng: -80.8393, colors: { primary: '#1D1160', secondary: '#00788C' } },
  { name: 'Miami Heat', slug: 'miami-heat', league: 'nba', conference: 'eastern-conference', division: 'Southeast', city: 'Miami', state: 'Florida', stateAbbr: 'FL', stadium: 'Kaseya Center', stadiumAddress: '601 Biscayne Blvd, Miami, FL 33132', lat: 25.7814, lng: -80.1880, colors: { primary: '#98002E', secondary: '#F9A01B' } },
  { name: 'Orlando Magic', slug: 'orlando-magic', league: 'nba', conference: 'eastern-conference', division: 'Southeast', city: 'Orlando', state: 'Florida', stateAbbr: 'FL', stadium: 'Kia Center', stadiumAddress: '400 W Church St, Orlando, FL 32801', lat: 28.5392, lng: -81.3839, colors: { primary: '#0077C0', secondary: '#C4CED4' } },
  { name: 'Washington Wizards', slug: 'washington-wizards', league: 'nba', conference: 'eastern-conference', division: 'Southeast', city: 'Washington', state: 'District of Columbia', stateAbbr: 'DC', stadium: 'Capital One Arena', stadiumAddress: '601 F St NW, Washington, DC 20004', lat: 38.8981, lng: -77.0208, colors: { primary: '#002B5C', secondary: '#E31837' } },
  // Western Conference - Northwest
  { name: 'Denver Nuggets', slug: 'denver-nuggets', league: 'nba', conference: 'western-conference', division: 'Northwest', city: 'Denver', state: 'Colorado', stateAbbr: 'CO', stadium: 'Ball Arena', stadiumAddress: '1000 Chopper Cir, Denver, CO 80204', lat: 39.7486, lng: -105.0075, colors: { primary: '#0E2240', secondary: '#FEC524' } },
  { name: 'Minnesota Timberwolves', slug: 'minnesota-timberwolves', league: 'nba', conference: 'western-conference', division: 'Northwest', city: 'Minneapolis', state: 'Minnesota', stateAbbr: 'MN', stadium: 'Target Center', stadiumAddress: '600 First Ave N, Minneapolis, MN 55403', lat: 44.9794, lng: -93.2762, colors: { primary: '#0C2340', secondary: '#236192' } },
  { name: 'Oklahoma City Thunder', slug: 'oklahoma-city-thunder', league: 'nba', conference: 'western-conference', division: 'Northwest', city: 'Oklahoma City', state: 'Oklahoma', stateAbbr: 'OK', stadium: 'Paycom Center', stadiumAddress: '100 W Reno Ave, Oklahoma City, OK 73102', lat: 35.4634, lng: -97.5151, colors: { primary: '#007AC1', secondary: '#EF3B24' } },
  { name: 'Portland Trail Blazers', slug: 'portland-trail-blazers', league: 'nba', conference: 'western-conference', division: 'Northwest', city: 'Portland', state: 'Oregon', stateAbbr: 'OR', stadium: 'Moda Center', stadiumAddress: '1 Center Ct, Portland, OR 97227', lat: 45.5316, lng: -122.6666, colors: { primary: '#E03A3E', secondary: '#000000' } },
  { name: 'Utah Jazz', slug: 'utah-jazz', league: 'nba', conference: 'western-conference', division: 'Northwest', city: 'Salt Lake City', state: 'Utah', stateAbbr: 'UT', stadium: 'Delta Center', stadiumAddress: '301 W Temple St, Salt Lake City, UT 84101', lat: 40.7683, lng: -111.9011, colors: { primary: '#002B5C', secondary: '#00471B' } },
  // Western Conference - Pacific
  { name: 'Golden State Warriors', slug: 'golden-state-warriors', league: 'nba', conference: 'western-conference', division: 'Pacific', city: 'San Francisco', state: 'California', stateAbbr: 'CA', stadium: 'Chase Center', stadiumAddress: '1 Warriors Way, San Francisco, CA 94158', lat: 37.7680, lng: -122.3877, colors: { primary: '#1D428A', secondary: '#FFC72C' } },
  { name: 'Los Angeles Clippers', slug: 'los-angeles-clippers', league: 'nba', conference: 'western-conference', division: 'Pacific', city: 'Los Angeles', state: 'California', stateAbbr: 'CA', stadium: 'Crypto.com Arena', stadiumAddress: '1111 S Figueroa St, Los Angeles, CA 90015', lat: 34.0430, lng: -118.2670, colors: { primary: '#C8102E', secondary: '#1D428A' } },
  { name: 'Los Angeles Lakers', slug: 'los-angeles-lakers', league: 'nba', conference: 'western-conference', division: 'Pacific', city: 'Los Angeles', state: 'California', stateAbbr: 'CA', stadium: 'Crypto.com Arena', stadiumAddress: '1111 S Figueroa St, Los Angeles, CA 90015', lat: 34.0430, lng: -118.2670, colors: { primary: '#552583', secondary: '#FDB927' } },
  { name: 'Phoenix Suns', slug: 'phoenix-suns', league: 'nba', conference: 'western-conference', division: 'Pacific', city: 'Phoenix', state: 'Arizona', stateAbbr: 'AZ', stadium: 'Footprint Center', stadiumAddress: '201 E Jefferson St, Phoenix, AZ 85004', lat: 33.4458, lng: -112.0712, colors: { primary: '#1D1160', secondary: '#E56020' } },
  { name: 'Sacramento Kings', slug: 'sacramento-kings', league: 'nba', conference: 'western-conference', division: 'Pacific', city: 'Sacramento', state: 'California', stateAbbr: 'CA', stadium: 'Golden 1 Center', stadiumAddress: '500 David J Stern Walk, Sacramento, CA 95814', lat: 38.5806, lng: -121.4994, colors: { primary: '#5A2D81', secondary: '#63727A' } },
  // Western Conference - Southwest
  { name: 'Dallas Mavericks', slug: 'dallas-mavericks', league: 'nba', conference: 'western-conference', division: 'Southwest', city: 'Dallas', state: 'Texas', stateAbbr: 'TX', stadium: 'American Airlines Center', stadiumAddress: '2500 Victory Ave, Dallas, TX 75219', lat: 32.7905, lng: -96.8104, colors: { primary: '#00538C', secondary: '#002B5E' } },
  { name: 'Houston Rockets', slug: 'houston-rockets', league: 'nba', conference: 'western-conference', division: 'Southwest', city: 'Houston', state: 'Texas', stateAbbr: 'TX', stadium: 'Toyota Center', stadiumAddress: '1510 Polk St, Houston, TX 77002', lat: 29.7510, lng: -95.3622, colors: { primary: '#CE1141', secondary: '#000000' } },
  { name: 'Memphis Grizzlies', slug: 'memphis-grizzlies', league: 'nba', conference: 'western-conference', division: 'Southwest', city: 'Memphis', state: 'Tennessee', stateAbbr: 'TN', stadium: 'FedExForum', stadiumAddress: '191 Beale St, Memphis, TN 38103', lat: 35.1380, lng: -90.0505, colors: { primary: '#5D76A9', secondary: '#12173F' } },
  { name: 'New Orleans Pelicans', slug: 'new-orleans-pelicans', league: 'nba', conference: 'western-conference', division: 'Southwest', city: 'New Orleans', state: 'Louisiana', stateAbbr: 'LA', stadium: 'Smoothie King Center', stadiumAddress: '1501 Dave Dixon Dr, New Orleans, LA 70113', lat: 29.9489, lng: -90.0819, colors: { primary: '#0C2340', secondary: '#C8102E' } },
  { name: 'San Antonio Spurs', slug: 'san-antonio-spurs', league: 'nba', conference: 'western-conference', division: 'Southwest', city: 'San Antonio', state: 'Texas', stateAbbr: 'TX', stadium: 'Frost Bank Center', stadiumAddress: '1 Spurs Way, San Antonio, TX 78219', lat: 29.4270, lng: -98.4375, colors: { primary: '#C4CED4', secondary: '#000000' } },
]

// ── MLB ─────────────────────────────────────────────────────────────────────
const MLB_TEAMS: Team[] = [
  // American League East
  { name: 'Baltimore Orioles', slug: 'baltimore-orioles', league: 'mlb', conference: 'american-league', division: 'AL East', city: 'Baltimore', state: 'Maryland', stateAbbr: 'MD', stadium: 'Oriole Park at Camden Yards', stadiumAddress: '333 W Camden St, Baltimore, MD 21201', lat: 39.2841, lng: -76.6215, colors: { primary: '#DF4601', secondary: '#000000' } },
  { name: 'Boston Red Sox', slug: 'boston-red-sox', league: 'mlb', conference: 'american-league', division: 'AL East', city: 'Boston', state: 'Massachusetts', stateAbbr: 'MA', stadium: 'Fenway Park', stadiumAddress: '4 Jersey St, Boston, MA 02215', lat: 42.3467, lng: -71.0972, colors: { primary: '#BD3039', secondary: '#0C2340' } },
  { name: 'New York Yankees', slug: 'new-york-yankees', league: 'mlb', conference: 'american-league', division: 'AL East', city: 'Bronx', state: 'New York', stateAbbr: 'NY', stadium: 'Yankee Stadium', stadiumAddress: '1 E 161st St, Bronx, NY 10451', lat: 40.8296, lng: -73.9262, colors: { primary: '#003087', secondary: '#E4002C' } },
  { name: 'Tampa Bay Rays', slug: 'tampa-bay-rays', league: 'mlb', conference: 'american-league', division: 'AL East', city: 'St. Petersburg', state: 'Florida', stateAbbr: 'FL', stadium: 'Tropicana Field', stadiumAddress: '1 Tropicana Dr, St. Petersburg, FL 33705', lat: 27.7682, lng: -82.6534, colors: { primary: '#092C5C', secondary: '#8FBCE6' } },
  { name: 'Toronto Blue Jays', slug: 'toronto-blue-jays', league: 'mlb', conference: 'american-league', division: 'AL East', city: 'Toronto', state: 'Ontario', stateAbbr: 'ON', stadium: 'Rogers Centre', stadiumAddress: '1 Blue Jays Way, Toronto, ON M5V 1J1', lat: 43.6414, lng: -79.3894, colors: { primary: '#134A8E', secondary: '#1D2D5C' } },
  // American League Central
  { name: 'Chicago White Sox', slug: 'chicago-white-sox', league: 'mlb', conference: 'american-league', division: 'AL Central', city: 'Chicago', state: 'Illinois', stateAbbr: 'IL', stadium: 'Guaranteed Rate Field', stadiumAddress: '333 W 35th St, Chicago, IL 60616', lat: 41.8299, lng: -87.6338, colors: { primary: '#27251F', secondary: '#C4CED4' } },
  { name: 'Cleveland Guardians', slug: 'cleveland-guardians', league: 'mlb', conference: 'american-league', division: 'AL Central', city: 'Cleveland', state: 'Ohio', stateAbbr: 'OH', stadium: 'Progressive Field', stadiumAddress: '2401 Ontario St, Cleveland, OH 44115', lat: 41.4962, lng: -81.6850, colors: { primary: '#00385D', secondary: '#E50022' } },
  { name: 'Detroit Tigers', slug: 'detroit-tigers', league: 'mlb', conference: 'american-league', division: 'AL Central', city: 'Detroit', state: 'Michigan', stateAbbr: 'MI', stadium: 'Comerica Park', stadiumAddress: '2100 Woodward Ave, Detroit, MI 48201', lat: 42.3390, lng: -83.0485, colors: { primary: '#0C2340', secondary: '#FA4616' } },
  { name: 'Kansas City Royals', slug: 'kansas-city-royals', league: 'mlb', conference: 'american-league', division: 'AL Central', city: 'Kansas City', state: 'Missouri', stateAbbr: 'MO', stadium: 'Kauffman Stadium', stadiumAddress: '1 Royal Way, Kansas City, MO 64129', lat: 39.0517, lng: -94.4803, colors: { primary: '#004687', secondary: '#BD9B60' } },
  { name: 'Minnesota Twins', slug: 'minnesota-twins', league: 'mlb', conference: 'american-league', division: 'AL Central', city: 'Minneapolis', state: 'Minnesota', stateAbbr: 'MN', stadium: 'Target Field', stadiumAddress: '1 Twins Way, Minneapolis, MN 55403', lat: 44.9817, lng: -93.2773, colors: { primary: '#002B5C', secondary: '#D31145' } },
  // American League West
  { name: 'Houston Astros', slug: 'houston-astros', league: 'mlb', conference: 'american-league', division: 'AL West', city: 'Houston', state: 'Texas', stateAbbr: 'TX', stadium: 'Minute Maid Park', stadiumAddress: '501 Crawford St, Houston, TX 77002', lat: 29.7573, lng: -95.3555, colors: { primary: '#002D62', secondary: '#EB6E1F' } },
  { name: 'Los Angeles Angels', slug: 'los-angeles-angels', league: 'mlb', conference: 'american-league', division: 'AL West', city: 'Anaheim', state: 'California', stateAbbr: 'CA', stadium: 'Angel Stadium', stadiumAddress: '2000 E Gene Autry Way, Anaheim, CA 92806', lat: 33.8003, lng: -117.8827, colors: { primary: '#BA0021', secondary: '#003263' } },
  { name: 'Oakland Athletics', slug: 'oakland-athletics', league: 'mlb', conference: 'american-league', division: 'AL West', city: 'Oakland', state: 'California', stateAbbr: 'CA', stadium: 'Oakland Coliseum', stadiumAddress: '7000 Coliseum Way, Oakland, CA 94621', lat: 37.7516, lng: -122.2005, colors: { primary: '#003831', secondary: '#EFB21E' } },
  { name: 'Seattle Mariners', slug: 'seattle-mariners', league: 'mlb', conference: 'american-league', division: 'AL West', city: 'Seattle', state: 'Washington', stateAbbr: 'WA', stadium: 'T-Mobile Park', stadiumAddress: '1250 1st Ave S, Seattle, WA 98134', lat: 47.5914, lng: -122.3325, colors: { primary: '#0C2C56', secondary: '#005C5C' } },
  { name: 'Texas Rangers', slug: 'texas-rangers', league: 'mlb', conference: 'american-league', division: 'AL West', city: 'Arlington', state: 'Texas', stateAbbr: 'TX', stadium: 'Globe Life Field', stadiumAddress: '734 Stadium Dr, Arlington, TX 76011', lat: 32.7473, lng: -97.0835, colors: { primary: '#003278', secondary: '#C0111F' } },
  // National League East
  { name: 'Atlanta Braves', slug: 'atlanta-braves', league: 'mlb', conference: 'national-league', division: 'NL East', city: 'Cumberland', state: 'Georgia', stateAbbr: 'GA', stadium: 'Truist Park', stadiumAddress: '755 Battery Ave SE, Atlanta, GA 30339', lat: 33.8906, lng: -84.4678, colors: { primary: '#CE1141', secondary: '#13274F' } },
  { name: 'Miami Marlins', slug: 'miami-marlins', league: 'mlb', conference: 'national-league', division: 'NL East', city: 'Miami', state: 'Florida', stateAbbr: 'FL', stadium: 'loanDepot park', stadiumAddress: '501 Marlins Way, Miami, FL 33125', lat: 25.7780, lng: -80.2200, colors: { primary: '#00A3E0', secondary: '#EF3340' } },
  { name: 'New York Mets', slug: 'new-york-mets', league: 'mlb', conference: 'national-league', division: 'NL East', city: 'Queens', state: 'New York', stateAbbr: 'NY', stadium: 'Citi Field', stadiumAddress: '41 Seaver Way, Queens, NY 11368', lat: 40.7571, lng: -73.8458, colors: { primary: '#002D72', secondary: '#FF5910' } },
  { name: 'Philadelphia Phillies', slug: 'philadelphia-phillies', league: 'mlb', conference: 'national-league', division: 'NL East', city: 'Philadelphia', state: 'Pennsylvania', stateAbbr: 'PA', stadium: 'Citizens Bank Park', stadiumAddress: '1 Citizens Bank Way, Philadelphia, PA 19148', lat: 39.9056, lng: -75.1665, colors: { primary: '#E81828', secondary: '#002D72' } },
  { name: 'Washington Nationals', slug: 'washington-nationals', league: 'mlb', conference: 'national-league', division: 'NL East', city: 'Washington', state: 'District of Columbia', stateAbbr: 'DC', stadium: 'Nationals Park', stadiumAddress: '1500 S Capitol St SE, Washington, DC 20003', lat: 38.8730, lng: -77.0074, colors: { primary: '#AB0003', secondary: '#11225B' } },
  // National League Central
  { name: 'Chicago Cubs', slug: 'chicago-cubs', league: 'mlb', conference: 'national-league', division: 'NL Central', city: 'Chicago', state: 'Illinois', stateAbbr: 'IL', stadium: 'Wrigley Field', stadiumAddress: '1060 W Addison St, Chicago, IL 60613', lat: 41.9484, lng: -87.6553, colors: { primary: '#0E3386', secondary: '#CC3433' } },
  { name: 'Cincinnati Reds', slug: 'cincinnati-reds', league: 'mlb', conference: 'national-league', division: 'NL Central', city: 'Cincinnati', state: 'Ohio', stateAbbr: 'OH', stadium: 'Great American Ball Park', stadiumAddress: '100 Joe Nuxhall Way, Cincinnati, OH 45202', lat: 39.0974, lng: -84.5045, colors: { primary: '#C6011F', secondary: '#000000' } },
  { name: 'Milwaukee Brewers', slug: 'milwaukee-brewers', league: 'mlb', conference: 'national-league', division: 'NL Central', city: 'Milwaukee', state: 'Wisconsin', stateAbbr: 'WI', stadium: 'American Family Field', stadiumAddress: '1 Brewers Way, Milwaukee, WI 53214', lat: 43.0280, lng: -87.9712, colors: { primary: '#12284B', secondary: '#B6922E' } },
  { name: 'Pittsburgh Pirates', slug: 'pittsburgh-pirates', league: 'mlb', conference: 'national-league', division: 'NL Central', city: 'Pittsburgh', state: 'Pennsylvania', stateAbbr: 'PA', stadium: 'PNC Park', stadiumAddress: '115 Federal St, Pittsburgh, PA 15212', lat: 40.4468, lng: -80.0056, colors: { primary: '#FDB827', secondary: '#27251F' } },
  { name: 'St. Louis Cardinals', slug: 'st-louis-cardinals', league: 'mlb', conference: 'national-league', division: 'NL Central', city: 'St. Louis', state: 'Missouri', stateAbbr: 'MO', stadium: 'Busch Stadium', stadiumAddress: '700 Clark St, St. Louis, MO 63102', lat: 38.6220, lng: -90.1930, colors: { primary: '#C41E3A', secondary: '#0C2340' } },
  // National League West
  { name: 'Arizona Diamondbacks', slug: 'arizona-diamondbacks', league: 'mlb', conference: 'national-league', division: 'NL West', city: 'Phoenix', state: 'Arizona', stateAbbr: 'AZ', stadium: 'Chase Field', stadiumAddress: '401 E Jefferson St, Phoenix, AZ 85004', lat: 33.4455, lng: -112.0667, colors: { primary: '#A71930', secondary: '#E3D4AD' } },
  { name: 'Colorado Rockies', slug: 'colorado-rockies', league: 'mlb', conference: 'national-league', division: 'NL West', city: 'Denver', state: 'Colorado', stateAbbr: 'CO', stadium: 'Coors Field', stadiumAddress: '2001 Blake St, Denver, CO 80205', lat: 39.7559, lng: -104.9942, colors: { primary: '#333366', secondary: '#C4CED4' } },
  { name: 'Los Angeles Dodgers', slug: 'los-angeles-dodgers', league: 'mlb', conference: 'national-league', division: 'NL West', city: 'Los Angeles', state: 'California', stateAbbr: 'CA', stadium: 'Dodger Stadium', stadiumAddress: '1000 Vin Scully Ave, Los Angeles, CA 90012', lat: 34.0739, lng: -118.2400, colors: { primary: '#005A9C', secondary: '#EF3E42' } },
  { name: 'San Diego Padres', slug: 'san-diego-padres', league: 'mlb', conference: 'national-league', division: 'NL West', city: 'San Diego', state: 'California', stateAbbr: 'CA', stadium: 'Petco Park', stadiumAddress: '100 Park Blvd, San Diego, CA 92101', lat: 32.7073, lng: -117.1566, colors: { primary: '#2F241D', secondary: '#FFC425' } },
  { name: 'San Francisco Giants', slug: 'san-francisco-giants', league: 'mlb', conference: 'national-league', division: 'NL West', city: 'San Francisco', state: 'California', stateAbbr: 'CA', stadium: 'Oracle Park', stadiumAddress: '24 Willie Mays Plaza, San Francisco, CA 94107', lat: 37.7786, lng: -122.3893, colors: { primary: '#FD5A1E', secondary: '#27251F' } },
]

// ── NHL ─────────────────────────────────────────────────────────────────────
const NHL_TEAMS: Team[] = [
  // Eastern Conference - Atlantic
  { name: 'Boston Bruins', slug: 'boston-bruins', league: 'nhl', conference: 'eastern-conference', division: 'Atlantic', city: 'Boston', state: 'Massachusetts', stateAbbr: 'MA', stadium: 'TD Garden', stadiumAddress: '100 Legends Way, Boston, MA 02114', lat: 42.3662, lng: -71.0622, colors: { primary: '#FFB81C', secondary: '#000000' } },
  { name: 'Buffalo Sabres', slug: 'buffalo-sabres', league: 'nhl', conference: 'eastern-conference', division: 'Atlantic', city: 'Buffalo', state: 'New York', stateAbbr: 'NY', stadium: 'KeyBank Center', stadiumAddress: '1 Seymour H Knox III Plaza, Buffalo, NY 14203', lat: 42.8747, lng: -78.8787, colors: { primary: '#002654', secondary: '#FCB514' } },
  { name: 'Detroit Red Wings', slug: 'detroit-red-wings', league: 'nhl', conference: 'eastern-conference', division: 'Atlantic', city: 'Detroit', state: 'Michigan', stateAbbr: 'MI', stadium: 'Little Caesars Arena', stadiumAddress: '2645 Woodward Ave, Detroit, MI 48201', lat: 42.3410, lng: -83.0552, colors: { primary: '#CE1126', secondary: '#FFFFFF' } },
  { name: 'Florida Panthers', slug: 'florida-panthers', league: 'nhl', conference: 'eastern-conference', division: 'Atlantic', city: 'Sunrise', state: 'Florida', stateAbbr: 'FL', stadium: 'Amerant Bank Arena', stadiumAddress: '1 Panther Pkwy, Sunrise, FL 33323', lat: 26.1586, lng: -80.3277, colors: { primary: '#C8102E', secondary: '#041E42' } },
  { name: 'Montreal Canadiens', slug: 'montreal-canadiens', league: 'nhl', conference: 'eastern-conference', division: 'Atlantic', city: 'Montreal', state: 'Quebec', stateAbbr: 'QC', stadium: 'Bell Centre', stadiumAddress: '1909 Avenue des Canadiens-de-Montral, Montreal, QC H4B 5G0', lat: 45.4960, lng: -73.5693, colors: { primary: '#AF1E2D', secondary: '#192168' } },
  { name: 'Ottawa Senators', slug: 'ottawa-senators', league: 'nhl', conference: 'eastern-conference', division: 'Atlantic', city: 'Ottawa', state: 'Ontario', stateAbbr: 'ON', stadium: 'Canadian Tire Centre', stadiumAddress: '1000 Palladium Dr, Ottawa, ON K2V 1A5', lat: 45.2966, lng: -75.9290, colors: { primary: '#C52032', secondary: '#000000' } },
  { name: 'Tampa Bay Lightning', slug: 'tampa-bay-lightning', league: 'nhl', conference: 'eastern-conference', division: 'Atlantic', city: 'Tampa', state: 'Florida', stateAbbr: 'FL', stadium: 'Amalie Arena', stadiumAddress: '401 Channelside Dr, Tampa, FL 33602', lat: 27.9428, lng: -82.4537, colors: { primary: '#002868', secondary: '#FFFFFF' } },
  { name: 'Toronto Maple Leafs', slug: 'toronto-maple-leafs', league: 'nhl', conference: 'eastern-conference', division: 'Atlantic', city: 'Toronto', state: 'Ontario', stateAbbr: 'ON', stadium: 'Scotiabank Arena', stadiumAddress: '40 Bay St, Toronto, ON M5J 2X2', lat: 43.6435, lng: -79.3791, colors: { primary: '#00205B', secondary: '#FFFFFF' } },
  // Eastern Conference - Metropolitan
  { name: 'Carolina Hurricanes', slug: 'carolina-hurricanes', league: 'nhl', conference: 'eastern-conference', division: 'Metropolitan', city: 'Raleigh', state: 'North Carolina', stateAbbr: 'NC', stadium: 'Lenovo Center', stadiumAddress: '1400 Edwards Mill Rd, Raleigh, NC 27607', lat: 35.8033, lng: -78.7213, colors: { primary: '#CC0000', secondary: '#000000' } },
  { name: 'Columbus Blue Jackets', slug: 'columbus-blue-jackets', league: 'nhl', conference: 'eastern-conference', division: 'Metropolitan', city: 'Columbus', state: 'Ohio', stateAbbr: 'OH', stadium: 'Nationwide Arena', stadiumAddress: '200 W Nationwide Blvd, Columbus, OH 43215', lat: 39.9696, lng: -83.0059, colors: { primary: '#002654', secondary: '#CE1126' } },
  { name: 'New Jersey Devils', slug: 'new-jersey-devils', league: 'nhl', conference: 'eastern-conference', division: 'Metropolitan', city: 'Newark', state: 'New Jersey', stateAbbr: 'NJ', stadium: 'Prudential Center', stadiumAddress: '25 Lafayette St, Newark, NJ 07102', lat: 40.7336, lng: -74.1710, colors: { primary: '#CE1126', secondary: '#000000' } },
  { name: 'New York Islanders', slug: 'new-york-islanders', league: 'nhl', conference: 'eastern-conference', division: 'Metropolitan', city: 'Elmont', state: 'New York', stateAbbr: 'NY', stadium: 'UBS Arena', stadiumAddress: '2400 Hempstead Tpke, Elmont, NY 11003', lat: 40.7230, lng: -73.7175, colors: { primary: '#00539B', secondary: '#F47D30' } },
  { name: 'New York Rangers', slug: 'new-york-rangers', league: 'nhl', conference: 'eastern-conference', division: 'Metropolitan', city: 'New York', state: 'New York', stateAbbr: 'NY', stadium: 'Madison Square Garden', stadiumAddress: '4 Pennsylvania Plaza, New York, NY 10001', lat: 40.7505, lng: -73.9934, colors: { primary: '#0038A8', secondary: '#CE1126' } },
  { name: 'Philadelphia Flyers', slug: 'philadelphia-flyers', league: 'nhl', conference: 'eastern-conference', division: 'Metropolitan', city: 'Philadelphia', state: 'Pennsylvania', stateAbbr: 'PA', stadium: 'Wells Fargo Center', stadiumAddress: '3601 S Broad St, Philadelphia, PA 19148', lat: 39.9012, lng: -75.1719, colors: { primary: '#F74902', secondary: '#000000' } },
  { name: 'Pittsburgh Penguins', slug: 'pittsburgh-penguins', league: 'nhl', conference: 'eastern-conference', division: 'Metropolitan', city: 'Pittsburgh', state: 'Pennsylvania', stateAbbr: 'PA', stadium: 'PPG Paints Arena', stadiumAddress: '1001 Fifth Ave, Pittsburgh, PA 15219', lat: 40.4395, lng: -79.9892, colors: { primary: '#000000', secondary: '#FCB514' } },
  { name: 'Washington Capitals', slug: 'washington-capitals', league: 'nhl', conference: 'eastern-conference', division: 'Metropolitan', city: 'Washington', state: 'District of Columbia', stateAbbr: 'DC', stadium: 'Capital One Arena', stadiumAddress: '601 F St NW, Washington, DC 20004', lat: 38.8981, lng: -77.0208, colors: { primary: '#041E42', secondary: '#C8102E' } },
  // Western Conference - Central
  { name: 'Chicago Blackhawks', slug: 'chicago-blackhawks', league: 'nhl', conference: 'western-conference', division: 'Central', city: 'Chicago', state: 'Illinois', stateAbbr: 'IL', stadium: 'United Center', stadiumAddress: '1901 W Madison St, Chicago, IL 60612', lat: 41.8803, lng: -87.6741, colors: { primary: '#CF0A2C', secondary: '#000000' } },
  { name: 'Colorado Avalanche', slug: 'colorado-avalanche', league: 'nhl', conference: 'western-conference', division: 'Central', city: 'Denver', state: 'Colorado', stateAbbr: 'CO', stadium: 'Ball Arena', stadiumAddress: '1000 Chopper Cir, Denver, CO 80204', lat: 39.7486, lng: -105.0075, colors: { primary: '#6F263D', secondary: '#236192' } },
  { name: 'Dallas Stars', slug: 'dallas-stars', league: 'nhl', conference: 'western-conference', division: 'Central', city: 'Dallas', state: 'Texas', stateAbbr: 'TX', stadium: 'American Airlines Center', stadiumAddress: '2500 Victory Ave, Dallas, TX 75219', lat: 32.7905, lng: -96.8104, colors: { primary: '#006847', secondary: '#000000' } },
  { name: 'Minnesota Wild', slug: 'minnesota-wild', league: 'nhl', conference: 'western-conference', division: 'Central', city: 'Saint Paul', state: 'Minnesota', stateAbbr: 'MN', stadium: 'Xcel Energy Center', stadiumAddress: '199 W Kellogg Blvd, Saint Paul, MN 55102', lat: 44.9444, lng: -93.0982, colors: { primary: '#154734', secondary: '#A6192E' } },
  { name: 'Nashville Predators', slug: 'nashville-predators', league: 'nhl', conference: 'western-conference', division: 'Central', city: 'Nashville', state: 'Tennessee', stateAbbr: 'TN', stadium: 'Bridgestone Arena', stadiumAddress: '501 Broadway, Nashville, TN 37203', lat: 36.1592, lng: -86.7785, colors: { primary: '#FFB81C', secondary: '#041E42' } },
  { name: 'St. Louis Blues', slug: 'st-louis-blues', league: 'nhl', conference: 'western-conference', division: 'Central', city: 'St. Louis', state: 'Missouri', stateAbbr: 'MO', stadium: 'Enterprise Center', stadiumAddress: '1401 Clark Ave, St. Louis, MO 63103', lat: 38.6264, lng: -90.2025, colors: { primary: '#002F87', secondary: '#FCB514' } },
  { name: 'Utah Hockey Club', slug: 'utah-hockey-club', league: 'nhl', conference: 'western-conference', division: 'Central', city: 'Salt Lake City', state: 'Utah', stateAbbr: 'UT', stadium: 'Delta Center', stadiumAddress: '301 W Temple St, Salt Lake City, UT 84101', lat: 40.7683, lng: -111.9011, colors: { primary: '#71AFE5', secondary: '#000000' } },
  { name: 'Winnipeg Jets', slug: 'winnipeg-jets', league: 'nhl', conference: 'western-conference', division: 'Central', city: 'Winnipeg', state: 'Manitoba', stateAbbr: 'MB', stadium: 'Canada Life Centre', stadiumAddress: '300 Portage Ave, Winnipeg, MB R3C 5S4', lat: 49.8945, lng: -97.1380, colors: { primary: '#041E42', secondary: '#004C97' } },
  // Western Conference - Pacific
  { name: 'Anaheim Ducks', slug: 'anaheim-ducks', league: 'nhl', conference: 'western-conference', division: 'Pacific', city: 'Anaheim', state: 'California', stateAbbr: 'CA', stadium: 'Honda Center', stadiumAddress: '2695 E Katella Ave, Anaheim, CA 92806', lat: 33.8077, lng: -117.8767, colors: { primary: '#F47A38', secondary: '#000000' } },
  { name: 'Calgary Flames', slug: 'calgary-flames', league: 'nhl', conference: 'western-conference', division: 'Pacific', city: 'Calgary', state: 'Alberta', stateAbbr: 'AB', stadium: 'Scotiabank Saddledome', stadiumAddress: '555 Saddledome Rise SE, Calgary, AB T2G 2W1', lat: 51.0378, lng: -114.0518, colors: { primary: '#C8102E', secondary: '#F1BE48' } },
  { name: 'Edmonton Oilers', slug: 'edmonton-oilers', league: 'nhl', conference: 'western-conference', division: 'Pacific', city: 'Edmonton', state: 'Alberta', stateAbbr: 'AB', stadium: 'Rogers Place', stadiumAddress: '10220 104 Ave NW, Edmonton, AB T5J 0H6', lat: 53.5469, lng: -113.4976, colors: { primary: '#041E42', secondary: '#FF4C00' } },
  { name: 'Los Angeles Kings', slug: 'los-angeles-kings', league: 'nhl', conference: 'western-conference', division: 'Pacific', city: 'Los Angeles', state: 'California', stateAbbr: 'CA', stadium: 'Crypto.com Arena', stadiumAddress: '1111 S Figueroa St, Los Angeles, CA 90015', lat: 34.0430, lng: -118.2670, colors: { primary: '#111111', secondary: '#A2AAAD' } },
  { name: 'San Jose Sharks', slug: 'san-jose-sharks', league: 'nhl', conference: 'western-conference', division: 'Pacific', city: 'San Jose', state: 'California', stateAbbr: 'CA', stadium: 'SAP Center at San Jose', stadiumAddress: '525 W Santa Clara St, San Jose, CA 95113', lat: 37.3326, lng: -121.9011, colors: { primary: '#006D75', secondary: '#000000' } },
  { name: 'Seattle Kraken', slug: 'seattle-kraken', league: 'nhl', conference: 'western-conference', division: 'Pacific', city: 'Seattle', state: 'Washington', stateAbbr: 'WA', stadium: 'Climate Pledge Arena', stadiumAddress: '332 1st Ave N, Seattle, WA 98109', lat: 47.6222, lng: -122.3540, colors: { primary: '#001F5C', secondary: '#99D9D9' } },
  { name: 'Vancouver Canucks', slug: 'vancouver-canucks', league: 'nhl', conference: 'western-conference', division: 'Pacific', city: 'Vancouver', state: 'British Columbia', stateAbbr: 'BC', stadium: 'Rogers Arena', stadiumAddress: '800 Griffiths Way, Vancouver, BC V6B 6G1', lat: 49.2778, lng: -123.1090, colors: { primary: '#00205B', secondary: '#00843D' } },
  { name: 'Vegas Golden Knights', slug: 'vegas-golden-knights', league: 'nhl', conference: 'western-conference', division: 'Pacific', city: 'Las Vegas', state: 'Nevada', stateAbbr: 'NV', stadium: 'T-Mobile Arena', stadiumAddress: '3780 S Las Vegas Blvd, Las Vegas, NV 89158', lat: 36.1033, lng: -115.1740, colors: { primary: '#B4975A', secondary: '#333F42' } },
]

// ── MLS ─────────────────────────────────────────────────────────────────────
const MLS_TEAMS: Team[] = [
  // Eastern Conference
  { name: 'Atlanta United FC', slug: 'atlanta-united-fc', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Atlanta', state: 'Georgia', stateAbbr: 'GA', stadium: 'Mercedes-Benz Stadium', stadiumAddress: '1 AMB Drive NW, Atlanta, GA 30313', lat: 33.7555, lng: -84.4010, colors: { primary: '#A41E22', secondary: '#000000' } },
  { name: 'Charlotte FC', slug: 'charlotte-fc', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Charlotte', state: 'North Carolina', stateAbbr: 'NC', stadium: 'Bank of America Stadium', stadiumAddress: '800 S Mint St, Charlotte, NC 28202', lat: 35.2258, lng: -80.8528, colors: { primary: '#7FCEEB', secondary: '#000000' } },
  { name: 'Chicago Fire FC', slug: 'chicago-fire-fc', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Bridgeview', state: 'Illinois', stateAbbr: 'IL', stadium: 'SeatGeek Stadium', stadiumAddress: '7000 S Harlem Ave, Bridgeview, IL 60455', lat: 41.6940, lng: -87.8060, colors: { primary: '#102141', secondary: '#A6192E' } },
  { name: 'FC Cincinnati', slug: 'fc-cincinnati', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Cincinnati', state: 'Ohio', stateAbbr: 'OH', stadium: 'TQL Stadium', stadiumAddress: '1500 Central Pkwy, Cincinnati, OH 45214', lat: 39.1078, lng: -84.5260, colors: { primary: '#FE5000', secondary: '#003087' } },
  { name: 'Columbus Crew', slug: 'columbus-crew', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Columbus', state: 'Ohio', stateAbbr: 'OH', stadium: 'Lower.com Field', stadiumAddress: '96 N Courtright Dr, Columbus, OH 43215', lat: 39.9688, lng: -83.0090, colors: { primary: '#FEE111', secondary: '#000000' } },
  { name: 'D.C. United', slug: 'dc-united', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Washington', state: 'District of Columbia', stateAbbr: 'DC', stadium: 'Audi Field', stadiumAddress: '100 Potomac Ave SW, Washington, DC 20024', lat: 38.8760, lng: -77.0052, colors: { primary: '#000000', secondary: '#E81F2D' } },
  { name: 'Inter Miami CF', slug: 'inter-miami-cf', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Fort Lauderdale', state: 'Florida', stateAbbr: 'FL', stadium: 'Chase Stadium', stadiumAddress: '1350 NW 55th St, Fort Lauderdale, FL 33309', lat: 26.1905, lng: -80.1617, colors: { primary: '#F7B5CD', secondary: '#000000' } },
  { name: 'CF Montral', slug: 'cf-montreal', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Montreal', state: 'Quebec', stateAbbr: 'QC', stadium: 'Stade Saputo', stadiumAddress: '4750 rue Sherbrooke E, Montreal, QC H1V 0A8', lat: 45.5607, lng: -73.5532, colors: { primary: '#000000', secondary: '#0033A0' } },
  { name: 'Nashville SC', slug: 'nashville-sc', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Nashville', state: 'Tennessee', stateAbbr: 'TN', stadium: 'GEODIS Park', stadiumAddress: '501 Benton Ave, Nashville, TN 37203', lat: 36.1388, lng: -86.7842, colors: { primary: '#FEE111', secondary: '#1A1E29' } },
  { name: 'New England Revolution', slug: 'new-england-revolution', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Foxborough', state: 'Massachusetts', stateAbbr: 'MA', stadium: 'Gillette Stadium', stadiumAddress: '1 Patriot Pl, Foxborough, MA 02035', lat: 42.0909, lng: -71.2643, colors: { primary: '#0A2240', secondary: '#C8102E' } },
  { name: 'New York City FC', slug: 'new-york-city-fc', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'New York', state: 'New York', stateAbbr: 'NY', stadium: 'Yankee Stadium', stadiumAddress: '1 E 161st St, Bronx, NY 10451', lat: 40.8296, lng: -73.9262, colors: { primary: '#6CABDD', secondary: '#000000' } },
  { name: 'New York Red Bulls', slug: 'new-york-red-bulls', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Harrison', state: 'New Jersey', stateAbbr: 'NJ', stadium: 'Red Bull Arena', stadiumAddress: '600 Cape May St, Harrison, NJ 07029', lat: 40.7372, lng: -74.1507, colors: { primary: '#ED1F2C', secondary: '#001A4D' } },
  { name: 'Orlando City SC', slug: 'orlando-city-sc', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Orlando', state: 'Florida', stateAbbr: 'FL', stadium: 'Inter&Co Stadium', stadiumAddress: '655 W Church St, Orlando, FL 32805', lat: 28.5394, lng: -81.3990, colors: { primary: '#612B73', secondary: '#FCE300' } },
  { name: 'Philadelphia Union', slug: 'philadelphia-union', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Chester', state: 'Pennsylvania', stateAbbr: 'PA', stadium: 'Subaru Park', stadiumAddress: '1 Stadium Dr, Chester, PA 19013', lat: 39.8350, lng: -75.3655, colors: { primary: '#002B5C', secondary: '#B19B69' } },
  { name: 'Toronto FC', slug: 'toronto-fc', league: 'mls', conference: 'eastern-conference', division: 'Eastern', city: 'Toronto', state: 'Ontario', stateAbbr: 'ON', stadium: 'BMO Field', stadiumAddress: '170 Princes\' Blvd, Toronto, ON M6K 3C3', lat: 43.6334, lng: -79.4184, colors: { primary: '#B31138', secondary: '#000000' } },
  // Western Conference
  { name: 'Austin FC', slug: 'austin-fc', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Austin', state: 'Texas', stateAbbr: 'TX', stadium: 'Q2 Stadium', stadiumAddress: '10414 McKalla Pl, Austin, TX 78758', lat: 30.3740, lng: -97.7245, colors: { primary: '#00B140', secondary: '#000000' } },
  { name: 'Colorado Rapids', slug: 'colorado-rapids', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Commerce City', state: 'Colorado', stateAbbr: 'CO', stadium: 'Dick\'s Sporting Goods Park', stadiumAddress: '6000 Victory Way, Commerce City, CO 80022', lat: 39.8056, lng: -104.8921, colors: { primary: '#7A0019', secondary: '#862633' } },
  { name: 'FC Dallas', slug: 'fc-dallas', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Frisco', state: 'Texas', stateAbbr: 'TX', stadium: 'Toyota Stadium', stadiumAddress: '9200 World Cup Way, Frisco, TX 75034', lat: 33.1547, lng: -96.8352, colors: { primary: '#E81F2D', secondary: '#1B2D54' } },
  { name: 'Houston Dynamo FC', slug: 'houston-dynamo-fc', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Houston', state: 'Texas', stateAbbr: 'TX', stadium: 'Shell Energy Stadium', stadiumAddress: '2200 Texas St, Houston, TX 77003', lat: 29.7517, lng: -95.3555, colors: { primary: '#F36F21', secondary: '#0B1F3F' } },
  { name: 'LA Galaxy', slug: 'la-galaxy', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Carson', state: 'California', stateAbbr: 'CA', stadium: 'Dignity Health Sports Park', stadiumAddress: '18400 Avalon Blvd, Carson, CA 90746', lat: 33.8133, lng: -118.2637, colors: { primary: '#00245D', secondary: '#FECF09' } },
  { name: 'Los Angeles FC', slug: 'los-angeles-fc', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Los Angeles', state: 'California', stateAbbr: 'CA', stadium: 'BMO Stadium', stadiumAddress: '3939 S Figueroa St, Los Angeles, CA 90037', lat: 34.0128, lng: -118.2839, colors: { primary: '#000000', secondary: '#C39E6D' } },
  { name: 'Minnesota United FC', slug: 'minnesota-united-fc', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Saint Paul', state: 'Minnesota', stateAbbr: 'MN', stadium: 'Allianz Field', stadiumAddress: '400 Snelling Ave N, Saint Paul, MN 55104', lat: 44.9537, lng: -93.1700, colors: { primary: '#231F20', secondary: '#8CD2F4' } },
  { name: 'Portland Timbers', slug: 'portland-timbers', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Portland', state: 'Oregon', stateAbbr: 'OR', stadium: 'Providence Park', stadiumAddress: '1844 SW Morrison St, Portland, OR 97205', lat: 45.5215, lng: -122.6916, colors: { primary: '#004812', secondary: '#E2D6A5' } },
  { name: 'Real Salt Lake', slug: 'real-salt-lake', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Sandy', state: 'Utah', stateAbbr: 'UT', stadium: 'America First Field', stadiumAddress: '9256 S State St, Sandy, UT 84070', lat: 40.5830, lng: -111.8930, colors: { primary: '#A50531', secondary: '#013A81' } },
  { name: 'San Jose Earthquakes', slug: 'san-jose-earthquakes', league: 'mls', conference: 'western-conference', division: 'Western', city: 'San Jose', state: 'California', stateAbbr: 'CA', stadium: 'PayPal Park', stadiumAddress: '1123 Coleman Ave, San Jose, CA 95110', lat: 37.3620, lng: -121.9290, colors: { primary: '#0067B1', secondary: '#000000' } },
  { name: 'Seattle Sounders FC', slug: 'seattle-sounders-fc', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Seattle', state: 'Washington', stateAbbr: 'WA', stadium: 'Lumen Field', stadiumAddress: '800 Occidental Ave S, Seattle, WA 98134', lat: 47.5952, lng: -122.3316, colors: { primary: '#5D9741', secondary: '#005595' } },
  { name: 'Sporting Kansas City', slug: 'sporting-kansas-city', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Kansas City', state: 'Kansas', stateAbbr: 'KS', stadium: 'Children\'s Mercy Park', stadiumAddress: '1 Sporting Way, Kansas City, KS 66111', lat: 39.1080, lng: -94.8250, colors: { primary: '#002B5C', secondary: '#93CAED' } },
  { name: 'St. Louis City SC', slug: 'st-louis-city-sc', league: 'mls', conference: 'western-conference', division: 'Western', city: 'St. Louis', state: 'Missouri', stateAbbr: 'MO', stadium: 'CityPark', stadiumAddress: '2100 Market St, St. Louis, MO 63103', lat: 38.6310, lng: -90.2080, colors: { primary: '#DA4FCA', secondary: '#000000' } },
  { name: 'Vancouver Whitecaps FC', slug: 'vancouver-whitecaps-fc', league: 'mls', conference: 'western-conference', division: 'Western', city: 'Vancouver', state: 'British Columbia', stateAbbr: 'BC', stadium: 'BC Place', stadiumAddress: '777 Pacific Blvd S, Vancouver, BC V6B 4Y8', lat: 49.2763, lng: -123.1120, colors: { primary: '#00285E', secondary: '#9ED8DB' } },
]

// ── ALL TEAMS ───────────────────────────────────────────────────────────────
export const ALL_TEAMS: Team[] = [
  ...NFL_TEAMS,
  ...NBA_TEAMS,
  ...MLB_TEAMS,
  ...NHL_TEAMS,
  ...MLS_TEAMS,
]

// ── HELPER FUNCTIONS ────────────────────────────────────────────────────────

export function getTeamsByLeague(league: string): Team[] {
  return ALL_TEAMS.filter((t) => t.league === league)
}

export function getTeamsByLeagueAndConference(
  league: string,
  conference: string
): Team[] {
  return ALL_TEAMS.filter(
    (t) => t.league === league && t.conference === conference
  )
}

export function getTeamBySlug(slug: string): Team | undefined {
  return ALL_TEAMS.find((t) => t.slug === slug)
}

export function getTeamsByCity(city: string): Team[] {
  const cityLower = city.toLowerCase().trim()
  return ALL_TEAMS.filter(
    (t) =>
      t.city.toLowerCase().includes(cityLower) ||
      t.state.toLowerCase().includes(cityLower) ||
      t.stateAbbr.toLowerCase() === cityLower
  )
}

export function getTeamsByState(stateAbbr: string): Team[] {
  return ALL_TEAMS.filter((t) => t.stateAbbr.toLowerCase() === stateAbbr.toLowerCase())
}

export function getRelatedTeams(team: Team): Team[] {
  // Teams in the same league and conference, excluding the current team
  return ALL_TEAMS.filter(
    (t) =>
      t.league === team.league &&
      t.conference === team.conference &&
      t.slug !== team.slug
  )
}

export function getDivisionsInConference(
  league: string,
  conference: string
): string[] {
  const teams = getTeamsByLeagueAndConference(league, conference)
  const divisions = new Set<string>()
  teams.forEach((t) => {
    if (t.division) divisions.add(t.division)
  })
  return Array.from(divisions)
}

export function getTeamsByDivision(
  league: string,
  conference: string,
  division: string
): Team[] {
  return ALL_TEAMS.filter(
    (t) =>
      t.league === league &&
      t.conference === conference &&
      t.division === division
  )
}

// ── MOCK GAME SCHEDULE ──────────────────────────────────────────────────────
export interface Game {
  id: string
  homeTeam: string
  awayTeam: string
  date: Date
  venue: string
  venueAddress: string
  city: string
  state: string
}

export function getTeamSchedule(teamSlug: string): Game[] {
  const team = getTeamBySlug(teamSlug)
  if (!team) return []

  // Generate mock home games for the team
  const opponents = getRelatedTeams(team).slice(0, 8)
  const games: Game[] = []
  const today = new Date()

  opponents.forEach((opp, i) => {
    const gameDate = new Date(today)
    gameDate.setDate(today.getDate() + (i + 1) * 10)
    games.push({
      id: `${team.slug}-vs-${opp.slug}-${i}`,
      homeTeam: team.name,
      awayTeam: opp.name,
      date: gameDate,
      venue: team.stadium,
      venueAddress: team.stadiumAddress,
      city: team.city,
      state: team.state,
    })
  })

  return games
}

// ── SEATING CHART DATA ──────────────────────────────────────────────────────
export interface SeatingSection {
  name: string
  level: string
  priceRange: string
  capacity: string
  description: string
}

export function getSeatingSections(_teamSlug: string): SeatingSection[] {
  return [
    { name: 'Field Level / Courtside', level: '100', priceRange: '$250 - $1,500', capacity: '~2,000', description: 'Closest to the action. Premium experience with VIP amenities.' },
    { name: 'Club Level', level: '200', priceRange: '$150 - $600', capacity: '~3,500', description: 'Elevated views with climate-controlled concourses and premium food options.' },
    { name: 'Lower Level', level: '100', priceRange: '$80 - $350', capacity: '~8,000', description: 'Great sightlines from the lower bowl. Close to concessions and restrooms.' },
    { name: 'Upper Level', level: '300', priceRange: '$40 - $150', capacity: '~12,000', description: 'Affordable options with panoramic views of the entire field/court.' },
    { name: 'Suite Level', level: '400', priceRange: '$2,000 - $10,000', capacity: '12-24 guests', description: 'Private luxury suites with catering, bar, and dedicated service.' },
    { name: 'End Zone / Upper End', level: '300', priceRange: '$30 - $90', capacity: '~4,000', description: 'Budget-friendly seats behind the goalposts or baskets.' },
  ]
}
