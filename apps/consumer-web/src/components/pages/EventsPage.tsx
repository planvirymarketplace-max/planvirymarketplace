'use client'

import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { ArrowUpRight } from "lucide-react";
import { eventData, categoryLabels, type EventCategory } from "@/data/eventData";

const categoryOrder: EventCategory[] = [
  "private-social",
  "nightlife",
  "corporate",
  "hospitality",
  "community",
];

const categoryDescriptions: Record<EventCategory, string> = {
  "private-social": "The moments that matter most. From the first dance to the last call.",
  nightlife: "Residencies, takeovers, and nights that fill the room.",
  corporate: "Sophisticated soundscapes and professional production for every brand moment.",
  hospitality: "Premium atmosphere for venues that understand the power of the right sound.",
  community: "From the cul-de-sac to the stadium. Sound systems scaled for every crowd.",
};

function getCategoryRoute(cat: EventCategory): string {
  switch (cat) {
    case "private-social": return "/events/weddings";
    case "nightlife": return "/events/nightclubs";
    case "corporate": return "/events/galas-fundraisers";
    case "hospitality": return "/events/hospitality";
    case "community": return "/events/community";
  }
}

export function EventsPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell navigate={navigate}>
      <PageHero
        navigate={navigate}
        eyebrow="Services"
        title="Every event type."
        italic="One curated team."
        description="Find your moment. Each page covers the experience we build, what's included, and how to book."
      />

      {categoryOrder.map((cat) => {
        const events = eventData.filter((e) => e.category === cat);
        const label = categoryLabels[cat];
        const description = categoryDescriptions[cat];

        return (
          <section key={cat} className="bg-background py-16 md:py-24">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10">
              {/* Category header */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                <div>
                  <p className="font-utility text-[10px] text-ember tracking-widest mb-3">
                    {label}
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.05]">
                    {label}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    {description}
                  </p>
                </div>
                <button
                  onClick={() => navigate(getCategoryRoute(cat))}
                  className="font-utility text-[9px] text-foreground hover:text-ember tracking-wider transition-colors inline-flex items-center gap-1.5 shrink-0 self-start md:self-auto"
                >
                  View All <span className="text-[10px]">→</span>
                </button>
              </div>

              {/* Event cards grid */}
              <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                {events.map((e) => {
                  // Derive route from slug
                  const route = `/events/${e.slug === "nightclubs" ? "nightclubs" : e.slug === "bars-pubs" ? "bars-pubs" : e.slug === "concert-halls" ? "concert-halls" : e.slug === "music-festivals" ? "music-festivals" : e.slug === "raves-warehouse-events" ? "raves-warehouse" : e.slug === "anniversaries-vow-renewals" ? "anniversaries" : e.slug === "birthday-parties" ? "birthday-parties" : e.slug === "cruise-ships-waterfront" ? "cruise-ships" : e.slug === "fraternity-sorority" ? "fraternity-sorority" : e.slug === "sporting-events" ? "sporting-events" : e.slug === "fitness-athletic-events" ? "fitness-events" : e.slug === "galas-fundraisers" ? "galas-fundraisers" : e.slug === "product-launches" ? "product-launches" : e.slug === "store-openings" ? "store-openings" : e.slug === "fashion-shows" ? "fashion-shows" : e.slug === "conventions-expos" ? "conventions-expos" : e.slug === "office-parties" ? "office-parties" : e.slug === "hotel-lobbies" ? "hotel-lobbies" : e.slug === "restaurants-brunch" ? "restaurants-brunch" : e.slug === "art-gallery" ? "art-gallery" : e.slug}`;

                  return (
                    <button
                      key={e.slug}
                      onClick={() => navigate(route)}
                      className="group flex flex-col justify-between bg-background p-6 md:p-8 transition-colors hover:bg-ink hover:text-ink-foreground min-h-[180px] text-left"
                    >
                      <h3 className="font-display text-xl md:text-2xl font-bold leading-tight">
                        {e.headline.split(".")[0]}.
                      </h3>
                      <div>
                        <p className="text-xs text-muted-foreground group-hover:text-ink-foreground/75 mt-2 line-clamp-2">
                          {e.subheadline}
                        </p>
                        {e.startingPrice && (
                          <span className="inline-block mt-2 font-utility text-[9px] text-ember group-hover:text-ember tracking-wider">
                            From {e.startingPrice}
                          </span>
                        )}
                        <span className="mt-3 inline-flex items-center gap-2 font-utility text-[10px] text-ember group-hover:text-ember">
                          View <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </SiteShell>
  );
}
