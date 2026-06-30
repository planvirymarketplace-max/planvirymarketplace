'use client'

import { SiteShell } from "@/components/site/SiteShell";
import { PageHero, ContentSection } from "@/components/site/PageHero";

export function AboutPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell navigate={navigate}>
      <PageHero
        navigate={navigate}
        eyebrow="About · Est. 2019"
        title="We build nights"
        italic="people remember."
        description="Best Time DJ Services is Milwaukee's curated network for entertainment, venues, and creative talent. We work where music, light, and people meet."
      />
      <ContentSection eyebrow="The Story" title="From one turntable to a citywide network.">
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
          What started as a single DJ booth at a Riverwest house party has grown into Milwaukee's
          most trusted booking network for weddings, corporate events, nightclubs, and brand
          activations. Every vendor in our roster is vetted, insured, and accountable to one
          standard: the night has to feel inevitable.
        </p>
      </ContentSection>
    </SiteShell>
  );
}
