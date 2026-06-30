'use client'

import { useState, useEffect, useRef } from "react";

const timeline = [
  {
    year: "2019",
    title: "The First Set",
    tagline: "Where it all began.",
    description:
      "It started with a single turntable and a middle school dance. The philosophy was simple, treat every event like it matters, because it does. One clean set turned into a reputation, and the reputation turned into a network.",
    accent: "ember" as const,
  },
  {
    year: "2021",
    title: "The Network",
    tagline: "Curated. Vetted. Connected.",
    description:
      "What began as one DJ became a curated collective. Venues started calling. Photographers wanted in. The model shifted from solo operator to Milwaukee's premier event network, vetted, insured, and built on referrals.",
    accent: "teal" as const,
  },
  {
    year: "2024",
    title: "Full Production",
    tagline: "Sound, space, and moment.",
    description:
      "Photo booths. Mobile event vans. Intelligent lighting. Full AV logistics. We stopped being just DJs and became the team that could build an entire event from the ground up, sound, space, and moment.",
    accent: "ember" as const,
  },
  {
    year: "2026",
    title: "The Platform",
    tagline: "The city, curated for you.",
    description:
      "Best Time becomes a platform. Partner vendors log in, set their rates, and get matched with clients. Milwaukee gets a curated marketplace for every kind of event. The city after dark, curated for you.",
    accent: "teal" as const,
  },
];

export function ServicesCards({ navigate }: { navigate: (path: string) => void }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ink w-full overflow-x-hidden">
      <div
        className="grid grid-cols-1 md:grid-cols-4"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {timeline.map((item, i) => {
          const isHovered = hoveredIndex === i;
          const accentColor = item.accent === "ember" ? "text-ember" : "text-teal";
          const accentLine = item.accent === "ember" ? "bg-ember" : "bg-teal";

          return (
            <div
              key={item.year}
              className={`
                relative flex flex-col cursor-pointer
                border-b border-white/[0.06] md:border-b-0 md:border-r md:border-white/[0.06]
                last:border-r-0
                transition-all duration-500 ease-out
                ${isHovered ? "bg-white/[0.03] scale-[1.02]" : ""}
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
              style={{
                minHeight: "320px",
                transitionDelay: visible ? `${i * 120}ms` : "0ms",
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onClick={() => navigate("/about")}
            >
              {/* Top accent line that sweeps on hover */}
              <div
                className={`
                  absolute top-0 left-0 right-0 h-[2px] ${accentLine}
                  transition-all duration-500
                  ${isHovered ? "opacity-100" : "opacity-0"}
                `}
                style={{ transformOrigin: 'left' }}
              />

              <div className="p-4 md:p-6 flex flex-col h-full overflow-hidden">
                {/* Year - large, vertical on desktop */}
                <div className="flex items-start">
                  <span
                    className={`
                      font-display font-bold leading-none tracking-[-0.02em]
                      text-white/[0.12] text-[4rem] md:text-[5rem] lg:text-[6rem]
                      md:[writing-mode:vertical-rl] md:rotate-180
                      select-none
                      transition-all duration-500
                      ${isHovered ? "text-white/[0.2]" : ""}
                    `}
                  >
                    {item.year}
                  </span>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Title + description at bottom */}
                <div className="mt-auto">
                  <h3
                    className={`
                      font-display text-2xl md:text-4xl font-bold text-white leading-tight
                      transition-all duration-500
                    `}
                  >
                    {item.title}
                  </h3>

                  {/* Thin accent rule */}
                  <div
                    className={`mt-3 h-[2px] ${accentLine} transition-all duration-500 ${
                      isHovered ? "w-16" : "w-8"
                    }`}
                  />

                  {/* Tagline - accent color */}
                  <p
                    className={`mt-3 font-display text-base md:text-lg italic leading-snug ${accentColor} transition-opacity duration-500`}
                  >
                    {item.tagline}
                  </p>

                  {/* Description - appears on hover */}
                  <div
                    className={`
                      overflow-hidden transition-all duration-500 ease-out
                      ${isHovered ? "max-h-48 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}
                    `}
                  >
                    <p className="text-sm md:text-base leading-relaxed text-white/50">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hover indicator - left accent bar */}
              <div
                className={`
                  absolute left-0 top-0 bottom-0 w-[2px] ${accentLine}
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
            <p className="text-sm text-white/40 text-center md:text-left">
              Built from the ground up. Milwaukee's premier event network, from the first note to the last dance.
            </p>
            <button
              onClick={() => navigate("/booking")}
              className="font-utility inline-flex items-center bg-ember px-8 py-4 text-sm text-ember-foreground tracking-wider transition-all hover:bg-white hover:text-ink hover:animate-none"
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
