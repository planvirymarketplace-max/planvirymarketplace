'use client'

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

const Header = ({ color }: { color: string }) => (
  <div
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl"
    style={{ backgroundColor: color }}
  />
);

const leftItems = [
  {
    title: "Weddings",
    description: "The soundtrack to your forever",
    href: "/events/weddings",
    bg: "#111111",
    headerBg: "#1a1a1a",
    accent: "#cc6600",
  },
  {
    title: "Corporate",
    description: "Boardroom to ballroom",
    href: "/events/corporate",
    bg: "#141414",
    headerBg: "#1e1e1e",
    accent: "#00a3a3",
  },
  {
    title: "Nightclubs",
    description: "We own the night",
    href: "/events/nightclubs-bars",
    bg: "#0d0d0d",
    headerBg: "#171717",
    accent: "#cc6600",
  },
  {
    title: "Festivals",
    description: "Main stage energy",
    href: "/events/music-festivals",
    bg: "#181818",
    headerBg: "#222222",
    accent: "#00a3a3",
  },
  {
    title: "Birthdays",
    description: "Make it loud",
    href: "/events/birthday-parties",
    bg: "#111111",
    headerBg: "#1a1a1a",
    accent: "#cc6600",
  },
  {
    title: "Galas",
    description: "Black tie, bold sound",
    href: "/events/galas-fundraisers",
    bg: "#141414",
    headerBg: "#1e1e1e",
    accent: "#00a3a3",
  },
  {
    title: "",
    description: "",
    href: "",
    bg: "#0d0d0d",
    headerBg: "#171717",
    accent: "#cc6600",
    empty: true,
  },
];

const rightItems = [
  {
    title: "Private Events & Weddings",
    description: "Receptions, ceremonies, and celebrations that demand the perfect soundtrack.",
    href: "/events/weddings",
    bg: "#111111",
    headerBg: "#1a1a1a",
    accent: "#cc6600",
  },
  {
    title: "Nightlife & Social",
    description: "Clubs, lounges, and late-night sets that keep the floor moving.",
    href: "/events/nightclubs-bars",
    bg: "#141414",
    headerBg: "#1e1e1e",
    accent: "#00a3a3",
  },
  {
    title: "Concerts & Festivals",
    description: "Large-scale sound for stages, arenas, and open-air crowds.",
    href: "/events/concert-halls",
    bg: "#0d0d0d",
    headerBg: "#171717",
    accent: "#cc6600",
  },
  {
    title: "Corporate & Brand Events",
    description: "Product launches, galas, conventions, and company events with polished production.",
    href: "/events/corporate",
    bg: "#181818",
    headerBg: "#222222",
    accent: "#00a3a3",
  },
  {
    title: "Hospitality & Leisure",
    description: "Hotels, restaurants, pool parties, and brunch residencies.",
    href: "/events/hospitality",
    bg: "#111111",
    headerBg: "#1a1a1a",
    accent: "#cc6600",
  },
  {
    title: "Community & Public",
    description: "Block parties, school dances, fitness events, and neighborhood gatherings.",
    href: "/events/community",
    bg: "#141414",
    headerBg: "#1e1e1e",
    accent: "#00a3a3",
  },
  {
    title: "DJ Services & Production",
    description: "Full AV, intelligent lighting, photo booths, and mobile event vans. Everything you need under one roof.",
    href: "/services/dj-services",
    bg: "#0d0d0d",
    headerBg: "#171717",
    accent: "#cc6600",
  },
];

export function EverySettingGrid({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section
      id="capabilities-grid"
      className="relative w-full"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="px-4 md:px-6 py-8 md:py-12">
        <div className="flex gap-4 md:gap-5">
          {/* Left grid */}
          <BentoGrid className="max-w-4xl">
            {leftItems.map((item, i) => (
              <BentoGridItem
                key={`b-${i}`}
                title={
                  item.empty ? undefined : (
                    <span style={{ color: item.accent }}>{item.title}</span>
                  )
                }
                description={item.empty ? undefined : item.description}
                header={<Header color={item.headerBg} />}
                className={`${i === 3 || i === 6 ? "md:col-span-2" : ""}`}
                style={{ backgroundColor: item.bg }}
                onClick={item.empty ? undefined : () => navigate(item.href)}
              />
            ))}
          </BentoGrid>

          {/* Right grid */}
          <BentoGrid className="max-w-4xl">
            {rightItems.map((item, i) => (
              <BentoGridItem
                key={`a-${i}`}
                title={<span style={{ color: item.accent }}>{item.title}</span>}
                description={item.description}
                header={<Header color={item.headerBg} />}
                className={`${i === 3 || i === 6 ? "md:col-span-2" : ""} cursor-pointer`}
                style={{ backgroundColor: item.bg }}
                onClick={() => navigate(item.href)}
              />
            ))}
          </BentoGrid>
        </div>
      </div>
    </section>
  );
}
