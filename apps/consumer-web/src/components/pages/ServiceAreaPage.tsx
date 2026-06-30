'use client'

import { SiteShell } from "@/components/site/SiteShell";
import { PageHero, ContentSection } from "@/components/site/PageHero";

const cities = ["Milwaukee", "Wauwatosa", "Brookfield", "Mequon", "Cedarburg", "Waukesha", "Racine", "Kenosha", "Lake Geneva", "Chicago", "Evanston", "Rockford", "Madison"];

export function ServiceAreaPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell navigate={navigate}>
      <PageHero navigate={navigate} eyebrow="Service Area" title="Milwaukee and" italic="Greater Illinois." description="Based in Milwaukee. Covering southeastern Wisconsin and northern Illinois. Travel beyond? Just ask." />
      <ContentSection eyebrow="Cities" title="Where we work.">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cities.map((c) => (
            <div key={c} className="border-t border-foreground pt-3 font-display text-xl">{c}</div>
          ))}
        </div>
      </ContentSection>
    </SiteShell>
  );
}
