'use client'

import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";

export function GalleryPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell navigate={navigate}>
      <PageHero navigate={navigate} eyebrow="Gallery" title="The receipts." italic="From recent rooms." description="A look at the nights we've built. Jump into the video reel for the full energy." />
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <button onClick={() => navigate("/gallery/videos")} className="font-utility text-[11px] text-ember hover:underline">View Video Gallery →</button>
          <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-cream" />
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export function GalleryVideosPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell navigate={navigate}>
      <PageHero navigate={navigate} eyebrow="Gallery · Video" title="Press play." italic="Feel the room." />
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-video bg-ink" />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
