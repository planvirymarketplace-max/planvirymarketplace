'use client'

import { Disc3, Camera, Truck, ArrowUpRight } from "lucide-react";

const services = [
  {
    icon: Disc3,
    title: "DJ Services",
    tagline: "Reading the room. Owning the floor.",
    description: "Open-format, house, hip-hop, weddings, festivals. Every DJ in the Best Time network is auditioned, insured, and trained to read the room before they touch the deck.",
    price: "Starting at $950",
    features: ["5 hours of professional mixing", "Ceremony and cocktail hour audio", "Full intelligent lighting array", "Wireless mics and emcee coverage"],
    accent: "ember" as const,
    link: "/services/dj-services",
  },
  {
    icon: Camera,
    title: "Photo Booth",
    tagline: "Memories, immersive and instant.",
    description: "Not a box with a camera. A curated social experience your guests will line up for. Premium keepsake experience with branded prints and instant gallery.",
    price: "Starting at $600",
    features: ["4 hours of unlimited sessions", "Custom graphic overlay and prints", "Instant digital gallery for guests", "Attendant on-site for the full event"],
    accent: "teal" as const,
    link: "/services/photo-booth",
  },
  {
    icon: Truck,
    title: "Mobile Event Van",
    tagline: "Pull up. Plug in. Party on.",
    description: "A fully built-out production van for tailgates, pool parties, block parties, festivals, and brand pop-ups. Self-contained production for any location.",
    price: "Custom Quote",
    features: ["Self-contained sound and lighting", "Power generation on-board", "Weather-ready and permit-friendly", "Any location - no outlet needed"],
    accent: "ember" as const,
    link: "/services/mobile-event-van",
  },
];

export function CallToAction({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-16">
          <p className="font-utility text-[11px] text-ember">04 - Our Services</p>
          <h2 className="mt-5 font-display text-5xl md:text-6xl font-bold leading-[1.02]">
            Three signature offerings,<br />
            <span className="italic font-normal text-teal">one curated network.</span>
          </h2>
        </div>

        {/* 3 Service Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="group relative flex flex-col bg-card border border-border transition-all hover:border-ember/40"
              >
                {/* Top accent bar */}
                <div className={`h-1 w-full ${s.accent === "ember" ? "bg-ember" : "bg-teal"}`} />
                <div className="flex flex-col flex-1 p-8 md:p-10">
                  {/* Icon */}
                  <Icon size={32} className={s.accent === "ember" ? "text-ember" : "text-teal"} strokeWidth={1.25} />

                  {/* Title + Tagline */}
                  <h3 className="mt-6 font-display text-3xl font-bold leading-tight">{s.title}</h3>
                  <p className="mt-2 font-display text-base italic text-muted-foreground">{s.tagline}</p>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.description}</p>

                  {/* Features */}
                  <ul className="mt-6 space-y-2 text-sm text-foreground">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className={`mt-1 text-xs ${s.accent === "ember" ? "text-ember" : "text-teal"}`}>·</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Price + CTA */}
                  <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                    <span className="font-display text-xl font-bold">{s.price}</span>
                    <button
                      onClick={() => navigate(s.link)}
                      className="font-utility inline-flex items-center gap-2 text-[10px] text-ember transition-colors hover:text-teal"
                    >
                      Explore <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-16 pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground text-center md:text-left max-w-md">
            Milwaukee&apos;s premier event network. One call. One curated team.
            From the first note to the last dance.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/booking")}
              className="font-utility inline-flex items-center bg-ink px-6 py-3 text-[11px] text-ink-foreground transition-all hover:bg-ember hover:text-ember-foreground"
            >
              Check Availability
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="font-utility inline-flex items-center border border-foreground/25 px-6 py-3 text-[11px] text-foreground transition-all hover:border-ember hover:text-ember"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
