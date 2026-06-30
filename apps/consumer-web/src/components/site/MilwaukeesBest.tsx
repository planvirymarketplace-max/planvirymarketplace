'use client'

import { useState } from "react";
import { ArrowUpRight, MapPin, Users, Star } from "lucide-react";

const categories = ["All Places", "Wedding Spaces", "Clubs & Lounges", "Hotels & Lodging", "Event Halls"];

const venues = [
  {
    name: "Discovery World",
    category: "Wedding Spaces",
    address: "500 N Harbor Dr, Milwaukee",
    tagline: "Stunning lakefront science & technology center",
    description: "Breathtaking 360-degree views of Lake Michigan and the downtown Milwaukee skyline.",
    capacity: "Up to 450 guests",
    features: ["Panoramic Lake Views", "Glass Atrium Floor", "Outdoor Patio"],
    rating: 4.9,
    isPartner: true,
  },
  {
    name: "Pabst Mansion",
    category: "Wedding Spaces",
    address: "2008 E Wisconsin Ave, Milwaukee",
    tagline: "Gilded Age historic elegance",
    description: "The elegant home of Milwaukee beer magnate Captain Frederick Pabst - Flemish Renaissance Revival style.",
    capacity: "Up to 150 guests",
    features: ["Gilded Age Architecture", "Manicured Gardens", "Wooden Parlors"],
    rating: 4.8,
    isPartner: true,
  },
  {
    name: "Grain Exchange",
    category: "Wedding Spaces",
    address: "325 E Michigan St, Milwaukee",
    tagline: "Three-story cathedral of commerce",
    description: "Historic Mackie Building with hand-carved details, stunning frescoes, and a magnificent key chandelier.",
    capacity: "Up to 350 guests",
    features: ["75-Foot Ceiling", "Marble Columns", "Granite Details"],
    rating: 4.9,
    isPartner: true,
  },
  {
    name: "Iron Horse Hotel",
    category: "Hotels & Lodging",
    address: "500 W Florida St, Milwaukee",
    tagline: "Industrial chic meets luxury",
    description: "Milwaukee's premier boutique hotel. Exposed brick, custom leather, moody atmosphere.",
    capacity: "Up to 200 guests",
    features: ["Industrial Chic", "On-Site Catering", "Bridal Suite"],
    rating: 4.7,
    isPartner: true,
  },
  {
    name: "Villa Terrace",
    category: "Wedding Spaces",
    address: "2220 N Terrace Ave, Milwaukee",
    tagline: "Italian Renaissance on the lake",
    description: "Decorative arts museum overlooking Lake Michigan with Italian Renaissance architecture and formal gardens.",
    capacity: "Up to 120 guests",
    features: ["Lake Michigan Views", "Italian Gardens", "Courtyard"],
    rating: 4.8,
    isPartner: false,
  },
  {
    name: "Turner Hall",
    category: "Event Halls",
    address: "1034 N 4th St, Milwaukee",
    tagline: "Historic German ballroom grandeur",
    description: "A Milwaukee landmark since 1882 - ornate German Renaissance architecture with a grand ballroom and original frescoes.",
    capacity: "Up to 300 guests",
    features: ["Historic Ballroom", "Original Frescoes", "Downtown"],
    rating: 4.6,
    isPartner: false,
  },
];

export function MilwaukeesBest({ navigate }: { navigate: (path: string) => void }) {
  const [activeCategory, setActiveCategory] = useState("All Places");

  const filtered = activeCategory === "All Places"
    ? venues
    : venues.filter((v) => v.category === activeCategory);

  return (
    <section id="network" className="relative bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <p className="font-utility text-[10px] text-ember tracking-widest">02 - The Network</p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold leading-tight">
              The city after
              <br /><span className="italic font-normal text-teal">dark</span>, curated
              <br />for you.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              We partner with Milwaukee&apos;s elite venues &amp; luxury event planners to guarantee
              flawless spatial logistics, custom acoustics, and spectacular design.
            </p>
            <button
              onClick={() => navigate("/venues")}
              className="mt-4 font-utility inline-flex items-center gap-1.5 text-[9px] text-foreground hover:text-ember transition-colors tracking-wider"
            >
              View Match Utility <ArrowUpRight size={12} />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mt-10 flex flex-wrap gap-6 border-b border-foreground/15 pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-utility text-[10px] tracking-wider transition-colors ${
                activeCategory === cat
                  ? "text-foreground underline underline-offset-4 decoration-ember"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Venue Cards Grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <div
              key={v.name}
              className={`group relative flex flex-col bg-background border transition-all duration-300 ${
                v.isPartner ? "border-ember/30" : "border-border"
              }`}
            >
              {/* Image placeholder */}
              <div className="relative aspect-[16/9] bg-cream/60 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                  <MapPin size={36} strokeWidth={0.75} />
                </div>
                <span className="absolute top-3 left-3 font-utility text-[9px] bg-ember text-ember-foreground px-2 py-0.5 tracking-wider">
                  {v.category.toUpperCase()}
                </span>
                {v.isPartner && (
                  <span className="absolute top-3 right-3 font-utility text-[8px] bg-teal text-teal-foreground px-2 py-0.5 tracking-wider">
                    PARTNER
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="flex flex-1 flex-col p-5">
                <p className="font-utility text-[9px] text-muted-foreground tracking-wider">{v.address.toUpperCase()}</p>
                <h4 className="mt-1.5 font-display text-lg font-bold leading-tight">{v.name}</h4>
                <p className="mt-1 font-display text-xs italic text-muted-foreground">{v.tagline}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">{v.description}</p>

                {/* Capacity */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-foreground">
                  <Users size={12} className="text-muted-foreground" />
                  <span>{v.capacity}</span>
                </div>

                {/* Feature Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {v.features.map((f) => (
                    <span key={f} className="font-utility text-[8px] border border-border px-1.5 py-0.5 text-muted-foreground tracking-wider">
                      {f.toUpperCase()}
                    </span>
                  ))}
                </div>

                {/* Rating + CTA */}
                <div className="mt-auto pt-3 mt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-ember fill-ember" />
                    <span className="text-xs font-medium">{v.rating}</span>
                  </div>
                  <button
                    onClick={() => navigate("/booking")}
                    className="font-utility inline-flex items-center gap-1 text-[8px] bg-teal text-teal-foreground px-3 py-1.5 transition-colors hover:bg-ink hover:text-background tracking-wider"
                  >
                    SELECT HOST
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="font-utility text-[9px] tracking-wider">200+ Vendors</span>
          <span className="font-utility text-[9px] tracking-wider">Insured · Vetted · Reviewed</span>
          <span className="font-utility text-[9px] tracking-wider">No fees until you book</span>
          <span className="font-utility text-[9px] tracking-wider">Milwaukee + Greater IL</span>
        </div>
      </div>
    </section>
  );
}
