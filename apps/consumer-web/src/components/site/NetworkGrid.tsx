'use client'

import { Disc3, Building2, Camera, ClipboardList, ArrowUpRight } from "lucide-react";

const tiles = [
  { tag: "01", icon: Disc3, title: "DJs", copy: "Open-format, house, hip-hop, weddings, festivals. Auditioned and booked.", accent: "ember", to: "/events/nightclubs-bars" },
  { tag: "02", icon: Building2, title: "Venues", copy: "From the Pabst Mansion to underground lofts - Milwaukee's most coveted rooms.", accent: "teal", to: "/directory/venues" },
  { tag: "03", icon: Camera, title: "Photographers", copy: "Documentary, editorial, photo booth. Galleries delivered in 72 hours.", accent: "ember", to: "/directory/photography" },
  { tag: "04", icon: ClipboardList, title: "Planners", copy: "Wedding, corporate, brand activations. The professionals behind the magic.", accent: "teal", to: "/directory/event-planning" },
];

export function NetworkGrid({ navigate }: { navigate?: (path: string) => void }) {
  return (
    <section id="network" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-8 mb-16">
          <div>
            <p className="font-utility text-[11px] text-ember">02 - The Network</p>
            <h2 className="mt-5 font-display text-5xl md:text-6xl font-bold leading-[1.02]">
              Every role,<br/>
              <span className="italic font-normal text-teal">one roster.</span>
            </h2>
          </div>
          <button onClick={() => navigate?.("/directory")} className="font-utility hidden text-[11px] text-foreground hover:text-ember md:inline-flex items-center gap-2">
            View All Vendors <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.title} onClick={() => navigate?.(t.to)} className="group relative flex flex-col justify-between bg-background p-8 transition-colors hover:bg-ink hover:text-ink-foreground min-h-[320px] text-left w-full">
                <div className="flex items-start justify-between">
                  <span className="font-utility text-[10px] text-muted-foreground group-hover:text-ink-foreground/60">{t.tag}</span>
                  <Icon size={28} className={t.accent === "ember" ? "text-ember" : "text-teal"} strokeWidth={1.25} />
                </div>
                <div>
                  <h3 className="font-display text-4xl font-bold leading-none">{t.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground group-hover:text-ink-foreground/75">{t.copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-utility text-[10px] text-ember">
                    Browse <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
