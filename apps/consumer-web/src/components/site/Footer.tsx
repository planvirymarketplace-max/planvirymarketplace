'use client'

import { useState } from "react";
import Image from "next/image";
import { Instagram, Music2, Mail, ArrowUpRight, ArrowUp } from "lucide-react";
import { serviceCategories } from "@/data/taxonomy";
import seoAreas from "@/lib/seo-areas.json";
import seoPopular from "@/lib/seo-popular.json";

/* ── Quick-link columns (Services / Events / Company / Partners) ─────── */
const cols: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Services",
    links: [
      { label: "DJ Services", to: "/services/dj-services" },
      { label: "Photo Booth", to: "/services/photo-booth" },
      { label: "Mobile Van", to: "/services/mobile-event-van" },
      { label: "Packages", to: "/packages" },
      { label: "Gallery", to: "/gallery" },
    ],
  },
  {
    title: "Events",
    links: [
      { label: "Social & Casual", to: "/categories/event/social-casual" },
      { label: "Weddings", to: "/categories/event/weddings-milestone" },
      { label: "Corporate", to: "/categories/event/corporate-professional" },
      { label: "Entertainment", to: "/categories/event/entertainment-cultural" },
      { label: "Milestones", to: "/categories/event/milestone-life" },
      { label: "All Events", to: "/categories/event" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Testimonials", to: "/testimonials" },
      { label: "Blog", to: "/blog" },
      { label: "FAQ", to: "/faq" },
      { label: "Service Area", to: "/service-area" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Partners",
    links: [
      { label: "Partner Portal", to: "/login" },
      { label: "Become a Vendor", to: "/register" },
    ],
  },
];

/* ── Social icons ────────────────────────────────────────────────────── */
const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Music2, label: "TikTok", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
];

/* ── Component ───────────────────────────────────────────────────────── */
export function Footer({ navigate }: { navigate: (path: string) => void }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-white">
      {/* ── 1. Top accent line ──────── */}
      <div className="h-[2px] bg-white/20" />

      <div className="mx-auto max-w-[1400px] px-4 pt-10 pb-10 md:px-6 md:pt-14 md:pb-12">

        {/* ── 2. Main Content Grid ──────────────────────────────────────── */}
        <div className="grid gap-10 md:grid-cols-4 md:gap-8">

          {/* Brand Column */}
          <div>
            <Image
              src="/planviry-logo.png"
              alt="Planviry"
              width={1200}
              height={336}
              className="h-40 w-auto"
              priority
            />
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-white/60">
              The premium marketplace for booking extraordinary events and discovering local, vetted vendors.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="group grid h-10 w-10 place-items-center border border-white/20 transition-all duration-300 hover:border-white hover:text-white hover:scale-110"
                  >
                    <Icon size={15} className="text-white/70 transition-colors group-hover:text-white" />
                  </a>
                );
              })}
            </div>

            {/* Phone numbers */}
            <div className="mt-6 space-y-1.5">
              <p className="text-xs text-white/60">262-757-5469</p>
              <p className="text-xs text-white/60">
                414-364-7790{" "}
                <span className="text-[9px] text-white/40">(immediate)</span>
              </p>
            </div>
          </div>

          {/* Categories Mega Column (2-col span) */}
          <div className="md:col-span-2">
            <h3 className="font-utility text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-5">
              Browse by Service
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
              {serviceCategories.map((group) => (
                <div key={group.slug}>
                  {/* Group heading */}
                  <button
                    onClick={() => navigate(`/categories/service/${group.slug}`)}
                    className="font-utility text-[10px] font-bold uppercase tracking-wider text-white hover:underline text-left"
                  >
                    {group.name}
                  </button>

                  {/* Category links under group */}
                  <ul className="mt-2 space-y-1">
                    {group.subcategories.slice(0, 5).map((sub) => {
                      const subSlug = sub.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      return (
                        <li key={subSlug}>
                          <button
                            onClick={() => navigate(`/categories/service/${group.slug}/${subSlug}`)}
                            className="text-[11px] text-white/60 hover:text-white hover:underline transition-colors text-left leading-snug"
                          >
                            {sub}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            {cols.map((c) => (
              <div key={c.title} className={c !== cols[0] ? "mt-6" : ""}>
                <h4 className="font-utility text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                  {c.title}
                </h4>
                <ul className="mt-2.5 space-y-2">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <button
                        onClick={() => navigate(l.to)}
                        className="group text-xs text-white/60 transition-colors hover:text-white inline-flex items-center gap-1"
                      >
                        {l.label}
                        <ArrowUpRight
                          size={10}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. SEO Area Band ──────────────────────────────────────────── */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h4 className="font-utility text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4">
            Milwaukee Areas &amp; Neighborhoods
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {(seoAreas as { searchTag: string; slug: string }[]).map((area) => (
              <button
                key={area.slug}
                onClick={() => navigate(`/explore/city/${area.slug}`)}
                className="text-[11px] text-white/50 hover:text-white hover:underline transition-colors"
              >
                {area.searchTag}
              </button>
            ))}
          </div>
        </div>

        {/* ── 4. Popular Searches Band ──────────────────────────────────── */}
        <div className="mt-8 border-t border-white/10 pt-8">
          <h4 className="font-utility text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4">
            Popular Searches
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {(seoPopular as { searchTag: string; slug: string; categorySlug?: string; pageType?: string }[]).map((entry) => (
              <button
                key={entry.slug}
                onClick={() => navigate(entry.categorySlug ? `/categories/service/${entry.categorySlug}` : `/${entry.slug}`)}
                className="text-[11px] text-white/50 hover:text-white hover:underline transition-colors"
              >
                {entry.searchTag}
              </button>
            ))}
          </div>
        </div>

        {/* ── 5. Newsletter Signup ──────────────────────────────────────── */}
        <div className="mt-10 border-t border-white/10 pt-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h4 className="font-utility text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Stay in the Loop
              </h4>
              <p className="mt-2 text-xs text-white/50 max-w-xs">
                Event tips, vendor spotlights, and early access to seasonal packages. No spam, just vibes.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full border border-white/40 flex items-center justify-center">
                  <span className="text-white text-[10px]">&#10003;</span>
                </div>
                <p className="text-xs text-white/70">You&apos;re on the list.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-0 w-full max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 border border-white/20 border-r-0 bg-transparent px-4 py-3 text-xs text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="font-utility inline-flex items-center bg-white px-5 py-3 text-[10px] text-black tracking-wider font-bold transition-all hover:bg-white/90 shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── 6. Bottom Bar ─────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-utility text-[10px] text-white/40 tracking-wider">
            &copy; {new Date().getFullYear()} Planviry &middot; Milwaukee, WI
          </p>
          <div className="flex flex-wrap gap-5 font-utility text-[10px] text-white/40 tracking-wider">
            <button
              onClick={() => navigate("/faq")}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms")}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate("/do-not-sell")}
              className="hover:text-white transition-colors"
            >
              Do Not Sell My Info
            </button>
            <button
              onClick={() => navigate("/login")}
              className="hover:text-white transition-colors"
            >
              Vendor Login
            </button>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <ArrowUp size={9} />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
