import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, MapPin, Info } from 'lucide-react'
import { TravelSearchResults } from '@/components/travel/TravelSearchResults'
import {
  POPULAR_DESTINATIONS,
  getDestinationBySlug,
  getPropertiesByCity,
  type Destination,
} from '@/data/travel-taxonomy'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return POPULAR_DESTINATIONS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const dest = getDestinationBySlug(slug)
  if (!dest) {
    return { title: 'Destination not found | Planviry Travel' }
  }
  return {
    title: `Stays in ${dest.name}, ${dest.stateCode} | Planviry Travel`,
    description: `Book hotels, resorts, and vacation rentals in ${dest.name}, ${dest.state}. ${dest.tagline}. Find the perfect stay for your next trip with Planviry Travel.`,
  }
}

const DESTINATION_SEO: Record<
  string,
  { intro: string; body: string; thingsToDo: string[] }
> = {
  'new-york': {
    intro:
      'New York City is the cultural and financial capital of the United States, with five boroughs each offering their own personality, skyline, and food scene. From Broadway shows in Midtown to brownstone streets in Brooklyn, the city has something for every traveler.',
    body: 'Planviry Travel features stays across Manhattan, Brooklyn, Queens, and the Bronx, from boutique hotels in SoHo to family-friendly vacation rentals near Central Park. Whether you are visiting for a concert at Madison Square Garden, a Broadway opening, or a weekend of museums and bagels, our curated properties put you steps from the action.',
    thingsToDo: [
      'Walk the High Line and explore the Chelsea Market',
      'Catch a Broadway show in the Theater District',
      'Take the ferry to the Statue of Liberty and Ellis Island',
      'Visit MoMA, the Met, and the Guggenheim',
    ],
  },
  'los-angeles': {
    intro:
      'Los Angeles blends Hollywood glamour, surf culture, and year-round sunshine across more than 80 neighborhoods. From the Santa Monica Pier to the Hollywood Sign, the city sprawls across the basin and into the canyons of the Santa Monica Mountains.',
    body: 'Browse vacation homes in the Hollywood Hills, boutique hotels in West Hollywood, and beachfront rentals in Venice and Malibu. Whether you are here for a film premiere, a concert at the Hollywood Bowl, or just to soak up the sun, Planviry Travel has stays for every itinerary and budget.',
    thingsToDo: [
      'Hike to the Hollywood Sign via Griffith Observatory',
      'Walk the Venice Beach boardwalk and skate park',
      'Tour Universal Studios and Warner Bros. Studios',
      'Catch a show at the Hollywood Bowl',
    ],
  },
  miami: {
    intro:
      'Miami is the gateway to Latin America and one of the worlds most vibrant beach cities. South Beachs Art Deco district, Wynwoods murals, and Little Havanas cafecito windows make Miami a sensory overload in the best way.',
    body: 'Stay at oceanfront resorts on South Beach, family-friendly vacation homes in Coral Gables, or modern apartments downtown near the Kaseya Center. Planviry Travel has stays for spring breakers, families, and couples alike.',
    thingsToDo: [
      'Sunbathe and people-watch on South Beach',
      'Explore the street art and galleries of Wynwood',
      'Cruise Biscayne Bay on a sunset boat tour',
      'Eat Cuban food in Little Havana along Calle Ocho',
    ],
  },
  'las-vegas': {
    intro:
      'Las Vegas is the entertainment capital of the world, with more than 150,000 hotel rooms along the Strip alone. Beyond the casinos, Vegas offers world-class dining, residencies by top musicians, and quick escapes to Red Rock Canyon and the Hoover Dam.',
    body: 'From luxury suites on the Strip to vacation rentals in Summerlin and Henderson, Planviry Travel has the right stay for every type of Vegas trip. Walking distance to the Sphere, Allegiant Stadium, and T-Mobile Arena options are all available.',
    thingsToDo: [
      'Walk the Strip and tour the themed mega-resorts',
      'Catch a residency or cirque show on the Strip',
      'Day-trip to Red Rock Canyon or Valley of Fire',
      'Dine at a Michelin-starred restaurant',
    ],
  },
  orlando: {
    intro:
      'Orlando is the theme park capital of the world, home to Walt Disney World, Universal Orlando, and SeaWorld. Beyond the parks, the city has thriving dining, golf, and lakefront neighborhoods.',
    body: 'Choose from family suites minutes from the parks, vacation homes with private pools, and downtown Orlando hotels for nightlife and concerts. Planviry Travel makes it easy to find a stay that fits your park itinerary.',
    thingsToDo: [
      'Visit Magic Kingdom, EPCOT, and Disney Hollywood Studios',
      'Explore The Wizarding World of Harry Potter at Universal',
      'Walk around Lake Eola in downtown Orlando',
      'Take an airboat ride in the nearby Everglades',
    ],
  },
  chicago: {
    intro:
      'Chicago is the Windy City, known for architecture, deep-dish pizza, and a lakefront that stretches for miles. From Millennium Park to Wrigleyville, the city blends Midwest charm with big-city culture.',
    body: 'Stay in boutique hotels in the Loop, family-friendly rentals in Lincoln Park, or modern apartments in West Loop near the restaurant scene. Planviry Travel has stays near United Center, Wrigley Field, and Millennium Park.',
    thingsToDo: [
      'Take an architecture boat tour on the Chicago River',
      'Visit the Art Institute and Millennium Park',
      'Eat deep-dish pizza and a Chicago-style hot dog',
      'Catch a Cubs game at Wrigley Field',
    ],
  },
  'san-francisco': {
    intro:
      'San Francisco is a city of hills, cable cars, and the iconic Golden Gate Bridge. From the Ferry Building to Alcatraz, the city blends Victorian charm with the tech-driven energy of Silicon Valley.',
    body: 'Browse boutique hotels in Union Square, vacation rentals in the Mission, and family-friendly options near Fishermans Wharf. Planviry Travel has stays for every San Francisco itinerary.',
    thingsToDo: [
      'Walk or bike across the Golden Gate Bridge',
      'Tour Alcatraz Island and its historic prison',
      'Ride a cable car from Union Square to Fishermans Wharf',
      'Sample food at the Ferry Building Marketplace',
    ],
  },
  seattle: {
    intro:
      'Seattle is the Emerald City, surrounded by water, mountains, and evergreen forests. From Pike Place Market to the Space Needle, the city blends coffee culture, music history, and outdoor access.',
    body: 'Stay downtown near Pike Place, in boutique hotels in Capitol Hill, or waterfront vacation rentals on Puget Sound. Planviry Travel has stays for every type of Seattle visit.',
    thingsToDo: [
      'Watch the fish throwers at Pike Place Market',
      'Ride to the top of the Space Needle',
      'Visit the Museum of Pop Culture (MoPOP)',
      'Take a ferry across Puget Sound to Bainbridge Island',
    ],
  },
  nashville: {
    intro:
      'Nashville is Music City, the capital of country music and one of the fastest-growing cities in the South. Broadway honky-tonks, the Ryman Auditorium, and the Country Music Hall of Fame anchor a city full of live music every night of the week.',
    body: 'Browse downtown lofts walking distance to Broadway, boutique hotels in Midtown, and family-friendly rentals in East Nashville. Planviry Travel has stays for every type of Nashville visit, from bachelorette parties to family vacations.',
    thingsToDo: [
      'Bar-hop the honky-tonks on Lower Broadway',
      'Tour the Ryman Auditorium and Country Music Hall of Fame',
      'Visit the Grand Ole Opry',
      'Eat hot chicken and explore the Gulch neighborhood',
    ],
  },
  'new-orleans': {
    intro:
      'New Orleans is the Big Easy, a city where jazz, Creole cuisine, and centuries-old architecture meet. From the French Quarter to the Garden District, New Orleans has more personality per square block than almost anywhere in America.',
    body: 'Stay in historic French Quarter villas, boutique hotels in the Warehouse District, or family-friendly rentals Uptown. Planviry Travel has stays for Mardi Gras, Jazz Fest, and quiet weekend getaways alike.',
    thingsToDo: [
      'Walk the French Quarter and Bourbon Street',
      'Eat beignets at Cafe du Monde',
      'Take a steamboat cruise on the Mississippi',
      'Tour the Garden District streetcar line',
    ],
  },
  denver: {
    intro:
      'Denver is the Mile High City, gateway to the Rocky Mountains and one of the fastest-growing cities in the West. From craft breweries to art museums, Denver blends urban energy with mountain access.',
    body: 'Browse downtown hotels near Union Station, vacation rentals in LoHi and RiNo, and mountain cabins a short drive into the Rockies. Planviry Travel has stays for every type of Colorado trip.',
    thingsToDo: [
      'Explore the art and breweries of the RiNo district',
      'Visit Red Rocks Amphitheatre for a concert',
      'Day-trip to Rocky Mountain National Park',
      'Walk through Denver Botanic Gardens',
    ],
  },
  austin: {
    intro:
      'Austin is the Live Music Capital of the World, home to SXSW, Austin City Limits, and a thriving food scene built around breakfast tacos and barbecue. The city sits on the Colorado River with miles of lakes and trails.',
    body: 'Browse downtown hotels near Sixth Street, vacation rentals in East Austin, and lakefront homes on Lake Travis. Planviry Travel has stays for every Austin itinerary.',
    thingsToDo: [
      'Catch live music on Sixth Street or Red River',
      'Eat brisket at Franklin Barbecue or La Barbecue',
      'Swim or paddleboard on Lady Bird Lake',
      'Visit the Texas State Capitol and South Congress shops',
    ],
  },
}

function getSeo(dest: Destination) {
  return (
    DESTINATION_SEO[dest.slug] ?? {
      intro: `${dest.name} is one of the most popular destinations in ${dest.state}.`,
      body: `Browse stays in ${dest.name} and find the right property for your trip with Planviry Travel.`,
      thingsToDo: [`Explore ${dest.name}`, `Discover local restaurants and attractions`],
    }
  )
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params
  const dest = getDestinationBySlug(slug)
  if (!dest) notFound()
  const properties = getPropertiesByCity(dest.slug)
  const seo = getSeo(dest)

  // If no properties for the city, show all properties (demo) so the page is useful
  const displayProperties = properties.length > 0 ? properties : []

  return (
    <div className="bg-white min-h-screen">
      <TravelSearchResults
        searchParams={{}}
        properties={displayProperties}
        title={`${dest.name} Stays`}
        citySlug={dest.slug}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Travel', href: '/travel' },
          { label: dest.name },
        ]}
      />

      {/* SEO content section */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h2 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-2">
                  Destination guide
                </h2>
                <h3 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                  About {dest.name}
                </h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{seo.intro}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{seo.body}</p>

              <div className="pt-3">
                <h4 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest mb-3">
                  Things to do in {dest.name}
                </h4>
                <ul className="space-y-2">
                  {seo.thingsToDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <ChevronRight className="w-4 h-4 text-[#e87461] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="p-5 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[#e87461]" />
                  <h4 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest">
                    Quick facts
                  </h4>
                </div>
                <dl className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-gray-500">State</dt>
                    <dd className="font-bold text-gray-900">{dest.state}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-gray-500">State code</dt>
                    <dd className="font-bold text-gray-900">{dest.stateCode}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-gray-500">Known for</dt>
                    <dd className="font-bold text-gray-900 text-right">{dest.tagline}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-gray-500">Properties</dt>
                    <dd className="font-bold text-gray-900">{displayProperties.length}</dd>
                  </div>
                </dl>
              </div>

              <div className="p-5 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-gray-500" />
                  <h4 className="text-[10.5px] font-black text-gray-900 uppercase tracking-widest">
                    Best time to visit
                  </h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Spring (March to May) and fall (September to November) typically offer the most
                  comfortable weather and smaller crowds. Book early for major events and holidays.
                </p>
              </div>

              <Link
                href="/travel/search"
                className="block p-5 bg-black text-white rounded-xl border border-black hover:bg-gray-900 transition-colors"
              >
                <p className="text-[10.5px] font-black uppercase tracking-widest text-gray-400">
                  Cant decide?
                </p>
                <p className="text-sm font-bold mt-1">Search all stays</p>
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )

}
