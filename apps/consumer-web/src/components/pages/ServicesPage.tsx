'use client'

import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { Disc3, Camera, Truck, ArrowUpRight, Lightbulb, Projector, CloudFog, Mic2 } from "lucide-react";

const services = [
  {
    to: "/services/dj-services",
    title: "DJ Services",
    icon: Disc3,
    copy: "Open-format, house, hip-hop, weddings, festivals. Auditioned and booked.",
    features: [
      "Open-format specialists",
      "Ceremony to after-party",
      "Custom playlists",
      "Professional MC",
    ],
  },
  {
    to: "/services/photo-booth",
    title: "Photo Booth",
    icon: Camera,
    copy: "Premium keepsake experience. Branded prints, instant gallery, unlimited fun.",
    features: [
      "Green screen magic",
      "Instant prints & digital gallery",
      "Custom overlays & branding",
      "Props & backdrops included",
    ],
  },
  {
    to: "/services/mobile-event-van",
    title: "Mobile Event Van",
    icon: Truck,
    copy: "Roll up, plug in, party on. Self-contained production for any location.",
    features: [
      "Self-contained power & sound",
      "LED lighting package",
      "Any location, any terrain",
      "Weather-ready setup",
    ],
  },
];

const steps = [
  {
    num: "01",
    title: "Tell Us About Your Event",
    description: "Share your date, vibe, guest count, and vision. We listen first so every detail aligns.",
  },
  {
    num: "02",
    title: "We Curate Your Team",
    description: "We match you with vetted DJs, booth operators, and technicians who fit your event perfectly.",
  },
  {
    num: "03",
    title: "Build Your Set List",
    description: "Collaborate on playlists, must-plays, and do-not-plays. Your sound, your night.",
  },
  {
    num: "04",
    title: "The Night Goes Off",
    description: "Show up, celebrate, and let the production run itself. We handle everything behind the scenes.",
  },
];

const addOns = [
  { name: "Uplighting", price: "$150+", icon: Lightbulb },
  { name: "Monogram Gobo", price: "$100+", icon: Projector },
  { name: "Fog Machine", price: "$75+", icon: CloudFog },
  { name: "Karaoke Setup", price: "$200+", icon: Mic2 },
];

export function ServicesPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell navigate={navigate}>
      <PageHero
        navigate={navigate}
        eyebrow="Services"
        title="Three signature offerings."
        italic="One curated network."
        description="Everything you need to make the night unforgettable. Pick a service or build the full production."
      />

      {/* Service Cards */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-px bg-border md:grid-cols-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.to}
                  onClick={() => navigate(s.to)}
                  className="group flex flex-col justify-between bg-background p-10 transition-colors hover:bg-ink hover:text-ink-foreground min-h-[420px] text-left"
                >
                  <Icon size={32} className="text-ember" strokeWidth={1.25} />
                  <div>
                    <h3 className="font-display text-4xl font-bold leading-none">{s.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground group-hover:text-ink-foreground/75">
                      {s.copy}
                    </p>
                    <ul className="mt-5 space-y-2">
                      {s.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-ink-foreground/70"
                        >
                          <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-ember" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-6 inline-flex items-center gap-2 font-utility text-[10px] text-ember">
                      Explore <ArrowUpRight size={12} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="font-utility text-[11px] text-ember">How It Works</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-[1.05] max-w-3xl">
            From idea to unforgettable.
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-4 md:gap-0">
            {steps.map((step, i) => (
              <div key={step.num} className="relative flex md:flex-col gap-4 md:gap-0">
                {/* Connecting line on desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[40px] right-0 h-px bg-foreground/15" />
                )}

                <span className="font-display text-4xl md:text-5xl font-bold text-ember leading-none shrink-0 md:mb-5">
                  {step.num}
                </span>
                <div className="md:mt-0">
                  <h3 className="font-display text-lg md:text-xl font-bold leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Add-Ons */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="font-utility text-[11px] text-ember">Popular Add-Ons</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-[1.05] max-w-3xl">
            Level up your production.
          </h2>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {addOns.map((addon) => {
              const Icon = addon.icon;
              return (
                <div
                  key={addon.name}
                  className="group flex flex-col items-center justify-center border border-border bg-background p-6 py-8 text-center transition-all hover:bg-ink hover:text-ink-foreground hover:border-ink cursor-default"
                >
                  <Icon
                    size={24}
                    className="text-ember transition-colors"
                    strokeWidth={1.25}
                  />
                  <span className="mt-3 font-display text-base font-bold leading-tight">
                    {addon.name}
                  </span>
                  <span className="mt-1 font-utility text-[10px] text-muted-foreground group-hover:text-ink-foreground/60">
                    {addon.price}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-ink-foreground leading-[1.05]">
            Ready to build your production?
          </h2>
          <p className="mt-6 text-lg text-ink-foreground/50 max-w-xl mx-auto">
            Tell us your vision and we will make it happen. From intimate gatherings to festival-scale events.
          </p>
          <div className="mt-10">
            <button
              onClick={() => navigate("/booking")}
              className="font-utility inline-flex items-center bg-ember px-8 py-4 text-[11px] text-ember-foreground transition-all hover:bg-background hover:text-foreground"
            >
              Reserve a Date
            </button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
