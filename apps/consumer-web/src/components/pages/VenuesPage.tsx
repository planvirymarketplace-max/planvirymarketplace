'use client'

import { SiteShell } from "@/components/site/SiteShell";
import { PageHero, ContentSection } from "@/components/site/PageHero";

const venues = ["Discovery World", "Pabst Mansion", "Grain Exchange", "Iron Horse Hotel", "Villa Terrace", "Blue Dress Barn", "The Cooperage", "Turner Hall", "Anodyne Coffee"];

export function VenuesPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell navigate={navigate}>
      <PageHero navigate={navigate} eyebrow="Venues" title="The rooms" italic="we know by heart." description="From the Pabst Mansion to underground lofts, we've worked Milwaukee's most coveted spaces." />
      <ContentSection eyebrow="Partner Network" title="Nine venues. More coming.">
        <div className="grid gap-px bg-border md:grid-cols-3">
          {venues.map((v) => (
            <div key={v} className="bg-background p-8 min-h-[180px] flex items-end">
              <h3 className="font-display text-2xl font-bold">{v}</h3>
            </div>
          ))}
        </div>
      </ContentSection>
    </SiteShell>
  );
}
