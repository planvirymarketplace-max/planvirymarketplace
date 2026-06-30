'use client'

import { useState, useEffect } from "react";
import { Phone, Calendar } from "lucide-react";

export function MobileCTA({ navigate }: { navigate: (path: string) => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40 md:hidden
        transition-all duration-300 ease-out
        ${show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
      `}
    >
      {/* Top border accent */}
      <div className="h-[2px] bg-ember" />

      <div className="bg-ink/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 safe-area-bottom">
        <button
          onClick={() => navigate("/booking")}
          className="flex-1 flex items-center justify-center gap-2 bg-ember py-3 font-utility text-[10px] text-ember-foreground tracking-wider transition-all hover:bg-ember/90"
        >
          <Calendar size={14} />
          Book Your Date
        </button>
        <a
          href="tel:2627575469"
          className="flex items-center justify-center h-12 w-12 border border-white/20 text-white/70 transition-all hover:border-ember hover:text-ember shrink-0"
        >
          <Phone size={16} />
        </a>
      </div>
    </div>
  );
}
