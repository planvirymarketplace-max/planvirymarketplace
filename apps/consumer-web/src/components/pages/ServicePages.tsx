'use client'

import { SiteShell } from "@/components/site/SiteShell";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { getServiceBySlug } from "@/data/serviceData";

function ServicePage({ slug, navigate }: { slug: string; navigate: (path: string) => void }) {
  const data = getServiceBySlug(slug);
  if (!data) {
    return (
      <SiteShell navigate={navigate}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="font-display text-5xl font-bold text-foreground">404</h1>
            <p className="mt-4 text-muted-foreground">Service not found.</p>
            <button
              onClick={() => navigate("/services")}
              className="mt-6 font-utility inline-flex items-center bg-ember px-6 py-3 text-[11px] text-ember-foreground hover:bg-ink hover:text-background transition-colors"
            >
              View All Services
            </button>
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell navigate={navigate}>
      <ServicePageTemplate data={data} navigate={navigate} />
    </SiteShell>
  );
}

export function DJServicesPage({ navigate }: { navigate: (path: string) => void }) {
  return <ServicePage slug="dj-services" navigate={navigate} />;
}

export function PhotoBoothPage({ navigate }: { navigate: (path: string) => void }) {
  return <ServicePage slug="photo-booth" navigate={navigate} />;
}

export function MobileEventVanPage({ navigate }: { navigate: (path: string) => void }) {
  return <ServicePage slug="mobile-event-van" navigate={navigate} />;
}
