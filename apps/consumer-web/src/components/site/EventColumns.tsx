'use client'

import { useState } from "react";

const events = [
  {
    title: "Weddings",
    tagline: "The soundtrack to your forever.",
    description:
      "From the first walk to the last dance. Ceremony audio, cocktail hour vibes, and a reception that keeps every guest on the floor until closing.",
    accent: "ember" as const,
  },
  {
    title: "Corporate",
    tagline: "Elevate your brand.",
    description:
      "Keynote sound design, branded playlists, and flawless AV logistics for product launches, conferences, and company milestones that demand premium.",
    accent: "teal" as const,
  },
  {
    title: "Nightclub",
    tagline: "Residencies and takeovers.",
    description:
      "Resident DJ rotations, guest takeovers, and sound system optimization. We keep the room packed and the energy relentless from open to close.",
    accent: "ember" as const,
  },
  {
    title: "Festivals",
    tagline: "Stages built for the headline.",
    description:
      "Multi-stage sound design, artist coordination, and production management for outdoor festivals, street fairs, and large-scale cultural events.",
    accent: "teal" as const,
  },
];

export function EventColumns({ navigate }: { navigate: (path: string) => void }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative bg-ink w-full overflow-x-hidden">
      {/* Columns container - tall, full-width */}
      <div
        className="grid grid-cols-1 md:grid-cols-4"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {events.map((event, i) => {
          const isHovered = hoveredIndex === i;
          const accentColor = event.accent === "ember" ? "text-ember" : "text-teal";
          const accentLine = event.accent === "ember" ? "bg-ember" : "bg-teal";

          return (
            <div
              key={event.title}
              className={`
                relative flex flex-col justify-end cursor-pointer
                border-b border-white/[0.06] md:border-b-0 md:border-r md:border-white/[0.06]
                last:border-r-0
                transition-all duration-500 ease-out
                ${isHovered ? "bg-white/[0.05]" : ""}
              `}
              style={{ minHeight: "360px" }}
              onMouseEnter={() => setHoveredIndex(i)}
              onClick={() => navigate("/booking")}
            >
              {/* Inner padding */}
              <div className="p-4 md:p-6 flex flex-col justify-end h-full">
                {/* Title - large, editorial serif */}
                <h3
                  className="
                    font-display text-white font-bold leading-[1] tracking-[-0.02em]
                    text-[2.5rem] md:text-[3rem] lg:text-[3.5rem]
                    transition-all duration-500
                  "
                  style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}
                >
                  {event.title}
                </h3>

                {/* Thin accent rule */}
                <div
                  className={`mt-4 h-[1px] ${accentLine} transition-all duration-500 ${
                    isHovered ? "w-16" : "w-6"
                  }`}
                />

                {/* Tagline - colored italic */}
                <p
                  className={`mt-4 font-display text-sm italic leading-snug ${accentColor} transition-all duration-500`}
                >
                  {event.tagline}
                </p>

                {/* Description - hidden by default, slides in on hover */}
                <div
                  className={`
                    overflow-hidden transition-all duration-500 ease-out
                    ${isHovered ? "max-h-32 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}
                  `}
                >
                  <p className="text-xs leading-relaxed text-white/50">
                    {event.description}
                  </p>
                  <span
                    className={`mt-4 inline-flex items-center gap-1.5 font-utility text-[9px] ${accentColor}
                    tracking-wider transition-transform duration-300`}
                    style={{ transform: isHovered ? 'translateX(2px)' : 'translateX(0)' }}
                  >
                    Book Now <span className="text-[10px]">→</span>
                  </span>
                </div>
              </div>

              {/* Hover indicator - thin left bar on hover */}
              <div
                className={`
                  absolute left-0 top-0 bottom-0 w-[2px] ${accentLine}
                  transition-opacity duration-500
                  ${isHovered ? "opacity-100" : "opacity-0"}
                `}
              />

              {/* Bottom accent line on hover */}
              <div
                className={`
                  absolute bottom-0 left-0 right-0 h-[2px] ${accentLine}
                  transition-opacity duration-500
                  ${isHovered ? "opacity-100" : "opacity-0"}
                `}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom CTA strip */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4">
            <p className="text-xs text-white/40 text-center md:text-left">
              Every event demands its own energy. We build the sound, the space, and the moment.
            </p>
            <button
              onClick={() => navigate("/booking")}
              className="font-utility inline-flex items-center bg-ember px-6 py-3 text-[10px] text-ember-foreground tracking-wider transition-all hover:bg-white hover:text-ink"
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
