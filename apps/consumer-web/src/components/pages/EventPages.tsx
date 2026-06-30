'use client'

import { SiteShell } from "@/components/site/SiteShell";
import { EventPageTemplate } from "@/components/templates/EventPageTemplate";
import { getEventBySlug } from "@/data/eventData";

export function EventPage({ slug, navigate }: { slug: string; navigate: (path: string) => void }) {
  const data = getEventBySlug(slug);
  if (!data) {
    return (
      <SiteShell navigate={navigate}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="font-display text-5xl font-bold text-foreground">404</h1>
            <p className="mt-4 text-muted-foreground">Event type not found.</p>
            <button
              onClick={() => navigate("/events")}
              className="mt-6 font-utility inline-flex items-center bg-ember px-6 py-3 text-[11px] text-ember-foreground hover:bg-ink hover:text-background transition-colors"
            >
              View All Events
            </button>
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell navigate={navigate}>
      <EventPageTemplate data={data} navigate={navigate} />
    </SiteShell>
  );
}

// Named exports for each event page route (matching existing route config)
export function WeddingsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="weddings" navigate={navigate} />;
}

export function BirthdayPartiesPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="birthday-parties" navigate={navigate} />;
}

export function AnniversariesPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="anniversaries-vow-renewals" navigate={navigate} />;
}

export function GraduationsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="graduations" navigate={navigate} />;
}

export function HolidayPartiesPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="holiday-parties" navigate={navigate} />;
}

export function NightclubsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="nightclubs" navigate={navigate} />;
}

export function BarsPubsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="bars-pubs" navigate={navigate} />;
}

export function LoungesPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="lounges" navigate={navigate} />;
}

export function ConcertHallsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="concert-halls" navigate={navigate} />;
}

export function MusicFestivalsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="music-festivals" navigate={navigate} />;
}

export function RavesWarehousePage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="raves-warehouse-events" navigate={navigate} />;
}

export function GalasPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="galas-fundraisers" navigate={navigate} />;
}

export function ProductLaunchesPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="product-launches" navigate={navigate} />;
}

export function StoreOpeningsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="store-openings" navigate={navigate} />;
}

export function FashionShowsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="fashion-shows" navigate={navigate} />;
}

export function ConventionsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="conventions-expos" navigate={navigate} />;
}

export function OfficePartiesPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="office-parties" navigate={navigate} />;
}

export function CorporatePage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="galas-fundraisers" navigate={navigate} />;
}

export function PoolPartiesPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="pool-parties" navigate={navigate} />;
}

export function HotelLobbiesPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="hotel-lobbies" navigate={navigate} />;
}

export function RestaurantsBrunchPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="restaurants-brunch" navigate={navigate} />;
}

export function CruiseShipsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="cruise-ships-waterfront" navigate={navigate} />;
}

export function BlockPartiesPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="block-parties" navigate={navigate} />;
}

export function SchoolDancesPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="school-dances" navigate={navigate} />;
}

export function FraternitySororityPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="fraternity-sorority" navigate={navigate} />;
}

export function SportingEventsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="sporting-events" navigate={navigate} />;
}

export function FitnessEventsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="fitness-athletic-events" navigate={navigate} />;
}

export function ArtGalleryPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="art-gallery" navigate={navigate} />;
}

export function BirthdaysPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="birthday-parties" navigate={navigate} />;
}

export function FestivalsPage({ navigate }: { navigate: (path: string) => void }) {
  return <EventPage slug="music-festivals" navigate={navigate} />;
}

// Category Hub Pages
import { PageHero } from "@/components/site/PageHero";
import { ArrowUpRight } from "lucide-react";
import { eventData, categoryLabels, type EventCategory } from "@/data/eventData";

function CategoryHubPage({
  category,
  navigate,
}: {
  category: EventCategory;
  navigate: (path: string) => void;
}) {
  const events = eventData.filter((e) => e.category === category);
  const label = categoryLabels[category];

  return (
    <SiteShell navigate={navigate}>
      <PageHero
        navigate={navigate}
        eyebrow={`Events · ${label}`}
        title={label.split(" & ")[0]}
        italic={`& ${label.split(" & ")[1]}.`}
        description={`Explore all our ${label.toLowerCase()} event types. Each one gets the same premium treatment.`}
      />
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => {
              const route = `/events/${e.slug === "nightclubs" ? "nightclubs" : e.slug === "bars-pubs" ? "bars-pubs" : e.slug === "concert-halls" ? "concert-halls" : e.slug === "music-festivals" ? "music-festivals" : e.slug === "raves-warehouse-events" ? "raves-warehouse" : e.slug === "anniversaries-vow-renewals" ? "anniversaries" : e.slug === "birthday-parties" ? "birthday-parties" : e.slug === "cruise-ships-waterfront" ? "cruise-ships" : e.slug === "fraternity-sorority" ? "fraternity-sorority" : e.slug === "sporting-events" ? "sporting-events" : e.slug === "fitness-athletic-events" ? "fitness-events" : e.slug === "galas-fundraisers" ? "galas-fundraisers" : e.slug === "product-launches" ? "product-launches" : e.slug === "store-openings" ? "store-openings" : e.slug === "fashion-shows" ? "fashion-shows" : e.slug === "conventions-expos" ? "conventions-expos" : e.slug === "office-parties" ? "office-parties" : e.slug === "hotel-lobbies" ? "hotel-lobbies" : e.slug === "restaurants-brunch" ? "restaurants-brunch" : e.slug === "art-gallery" ? "art-gallery" : e.slug}`;

              return (
                <button
                  key={e.slug}
                  onClick={() => navigate(route)}
                  className="group flex flex-col justify-between bg-background p-8 transition-colors hover:bg-ink hover:text-ink-foreground min-h-[220px] text-left"
                >
                  <h3 className="font-display text-2xl font-bold leading-tight">
                    {e.headline.split(".")[0]}.
                  </h3>
                  <div>
                    <p className="text-sm text-muted-foreground group-hover:text-ink-foreground/75">
                      {e.subheadline}
                    </p>
                    {e.startingPrice && (
                      <span className="inline-block mt-2 font-utility text-[9px] text-ember group-hover:text-ember tracking-wider">
                        From {e.startingPrice}
                      </span>
                    )}
                    <span className="mt-4 inline-flex items-center gap-2 font-utility text-[10px] text-ember">
                      View <ArrowUpRight size={12} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export function HospitalityPage({ navigate }: { navigate: (path: string) => void }) {
  return <CategoryHubPage category="hospitality" navigate={navigate} />;
}

export function CommunityPage({ navigate }: { navigate: (path: string) => void }) {
  return <CategoryHubPage category="community" navigate={navigate} />;
}
