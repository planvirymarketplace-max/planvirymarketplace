'use client'

import { SiteShell } from "@/components/site/SiteShell";
import { PageHero, ContentSection } from "@/components/site/PageHero";

export function BlogPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell navigate={navigate}>
      <PageHero navigate={navigate} eyebrow="Journal" title="Notes from" italic="the field." description="Playlists, venue spotlights, planning guides, and dispatches." />
      <ContentSection>
        <p className="text-lg text-muted-foreground">First posts coming soon.</p>
      </ContentSection>
    </SiteShell>
  );
}
