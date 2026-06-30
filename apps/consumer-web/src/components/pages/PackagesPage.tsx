'use client'

import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";

const packages = [
  { name: "Premier Celebration", price: "$950", tag: "Wedding flagship", features: ["5 hours reception coverage", "Ceremony audio and lapel mics", "Cocktail hour curation", "Intelligent light rig"] },
  { name: "Corporate Concierge", price: "$800", tag: "Brand and gala", features: ["Custom brand audio", "MC and announcements", "Tech check with AV team", "Discreet setup and breakdown"] },
  { name: "Prom and School Dances", price: "$700", tag: "High energy", features: ["Intelligent lighting and lasers", "Clean-edit playlists", "QR code requests", "5 hours of music"] },
  { name: "Photo Booth Premium", price: "$600", tag: "Keepsake event", features: ["4 hours unlimited sessions", "Custom graphic overlay", "Instant digital gallery", "Unlimited prints"] },
];

export function PackagesPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell navigate={navigate}>
      <PageHero
        navigate={navigate}
        eyebrow="Packages"
        title="Transparent pricing."
        italic="Premium production."
        description="Pick a starting package or build something custom. Every booking includes coordination, insurance, and concierge support."
      />
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-8 md:grid-cols-2">
            {packages.map((p) => (
              <div key={p.name} className="bg-ink text-ink-foreground p-10 border border-ember/20">
                <p className="font-utility text-[10px] text-ember">{p.tag}</p>
                <h3 className="mt-3 font-display text-3xl font-bold">{p.name}</h3>
                <div className="mt-6 font-display text-5xl font-bold">{p.price}<span className="text-base font-normal text-ink-foreground/60"> starting</span></div>
                <ul className="mt-8 space-y-3 text-ink-foreground/85">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2"><span className="text-ember">·</span> {f}</li>
                  ))}
                </ul>
                <button onClick={() => navigate("/booking")} className="font-utility mt-10 inline-flex items-center bg-ember px-6 py-3 text-[11px] text-ember-foreground hover:bg-background hover:text-ink transition-colors">
                  Book This Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
