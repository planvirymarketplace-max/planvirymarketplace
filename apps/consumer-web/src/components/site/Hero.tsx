'use client'

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full bg-black overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&h=1080&fit=crop&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 py-20 sm:py-28 md:py-36 lg:py-44">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/50 mb-6 inline-flex items-center gap-3">
            <span className="inline-block h-[1px] w-6 bg-white/30" />
            Milwaukee, Wisconsin
          </p>
          <h1 className="text-[clamp(2.25rem,6vw,5rem)] font-bold leading-[1.05] text-white">
            Milwaukee&apos;s Premier<br />
            Event Marketplace
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Book top-rated DJs, venues, photographers, caterers, and planners - all in one place.
            Compare prices, read reviews, and reserve instantly.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/directory"
              className="inline-flex items-center bg-white text-black px-8 py-4 text-sm font-bold tracking-wider transition-all hover:bg-gray-100"
            >
              Browse Vendors
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center border border-white/30 px-8 py-4 text-sm font-bold text-white tracking-wider transition-all hover:border-white hover:bg-white/10"
            >
              Book an Event
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-12 flex items-center gap-8 sm:gap-12">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">500+</p>
              <p className="text-xs text-white/50 uppercase tracking-wider mt-1">Vendors</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">10</p>
              <p className="text-xs text-white/50 uppercase tracking-wider mt-1">Categories</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">582</p>
              <p className="text-xs text-white/50 uppercase tracking-wider mt-1">Search Pages</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
