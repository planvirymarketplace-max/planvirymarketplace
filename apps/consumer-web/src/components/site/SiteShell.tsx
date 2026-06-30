'use client'

import { Nav } from "./Nav";
import { AboveFooterVideo } from "./AboveFooterVideo";
import { DedicatedCTA } from "./DedicatedCTA";
import { EventColumns } from "./EventColumns";
import { BackToTop } from "./BackToTop";
import { Footer } from "./Footer";

export function SiteShell({
  children,
  navVariant = "solid",
  showAboveFooterVideo = true,
  showGlobalFooter = true,
  showDedicatedCTA = true,
  navigate,
}: {
  children: React.ReactNode;
  navVariant?: "solid" | "transparent";
  showAboveFooterVideo?: boolean;
  showGlobalFooter?: boolean;
  showDedicatedCTA?: boolean;
  navigate: (path: string) => void;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <Nav variant={navVariant} navigate={navigate} />
      <main className="flex-1">{children}</main>
      {showGlobalFooter && <div className="h-[1px] bg-ink" />}
      {showGlobalFooter && <EventColumns navigate={navigate} />}
      {showGlobalFooter && showDedicatedCTA && <DedicatedCTA navigate={navigate} />}
      {showAboveFooterVideo && <AboveFooterVideo navigate={navigate} />}
      <Footer navigate={navigate} />
      <BackToTop />
    </div>
  );
}

