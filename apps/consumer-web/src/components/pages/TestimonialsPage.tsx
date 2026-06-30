'use client'

import { useEffect, useRef, useState, useCallback } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero, ContentSection } from "@/components/site/PageHero";

interface Testimonial {
  quote: string;
  author: string;
  eventType: string;
  venue: string;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  // Featured testimonial
  {
    quote: "They didn't just play music. They read the room and built the night. By midnight, nobody was sitting down -- and nobody wanted to leave. That's not a DJ. That's an architect of the evening.",
    author: "Sarah K.",
    eventType: "Wedding",
    venue: "Pabst Mansion",
    featured: true,
  },
  // 3 Weddings (2 additional + featured = 3)
  {
    quote: "From the ceremony acoustics to the last dance, every moment felt intentional. Our guests are still talking about the transitions between dinner and dancing.",
    author: "Emily R.",
    eventType: "Wedding",
    venue: "The Ivy House",
  },
  {
    quote: "We wanted a wedding that felt like us -- not a template. Best Time delivered something so personal, our families thought we planned every song ourselves.",
    author: "David & Priya M.",
    eventType: "Wedding",
    venue: "Bristol Garden Terrace",
  },
  // 2 Corporate
  {
    quote: "Our annual summit went from standard to unforgettable. The production quality rivaled events we've seen in much larger markets.",
    author: "James L.",
    eventType: "Corporate Gala",
    venue: "Pfister Hotel Grand Ballroom",
  },
  {
    quote: "We needed a partner who understood brand energy. Best Time translated our company culture into a room that people actually wanted to stay in.",
    author: "Rachel O.",
    eventType: "Corporate Launch",
    venue: "Harley-Davidson Museum",
  },
  // 2 Nightclub / Lounge
  {
    quote: "Friday nights went from decent to legendary. The crowd shift happened in two weeks. People now plan their weekends around our programming.",
    author: "Marcus T.",
    eventType: "Nightclub Residency",
    venue: "OASIS Lounge",
  },
  {
    quote: "Sound, lighting, vibe -- everything arrived as a complete system. We stopped hiring three separate vendors after the first month.",
    author: "Nina C.",
    eventType: "Lounge Series",
    venue: "The Velvet Room",
  },
  // 1 Festival
  {
    quote: "Main stage to after-hours, they handled every transition like a live broadcast. Zero dead air. The crowd never thinned.",
    author: "Javier S.",
    eventType: "Music Festival",
    venue: "Henry Maier Festival Park",
  },
  // 1 Private Party
  {
    quote: "The Mobile Van turned our cul-de-sac into a block party people still talk about. Neighbors we'd never met showed up with folding chairs.",
    author: "Angela W.",
    eventType: "Private Party",
    venue: "Bay View Block Party",
  },
];

function StarRating() {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="h-3 w-3 text-ember"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function FeaturedTestimonial({ t }: { t: Testimonial }) {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="relative max-w-4xl mx-auto text-center py-12 md:py-20">
        {/* Decorative opening quote mark */}
        <span
          className="absolute -top-4 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 font-display text-[120px] md:text-[180px] leading-none text-ember/20 select-none"
          aria-hidden="true"
        >
          &ldquo;
        </span>

        <blockquote className="relative z-10">
          <p className="font-display text-2xl md:text-4xl lg:text-5xl italic leading-snug md:leading-snug text-foreground max-w-3xl mx-auto">
            {t.quote}
          </p>
          <footer className="mt-8 md:mt-12">
            <span className="font-utility text-[11px] text-ember tracking-[0.18em] uppercase">
              {t.author}
            </span>
            <span className="block mt-2 font-utility text-[10px] text-muted-foreground tracking-[0.15em] uppercase">
              {t.eventType} &middot; {t.venue}
            </span>
          </footer>
        </blockquote>
      </div>
    </div>
  );
}

function TestimonialCard({
  t,
  index,
}: {
  t: Testimonial;
  index: number;
}) {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <blockquote className="border-t border-foreground/15 pt-6 pb-2">
        {/* Star rating */}
        <div className="mb-3">
          <StarRating />
        </div>
        {/* Quote */}
        <p className="font-display text-lg md:text-xl italic leading-snug text-foreground/90">
          &ldquo;{t.quote}&rdquo;
        </p>
        {/* Attribution */}
        <footer className="mt-5 flex flex-col gap-0.5">
          <span className="font-utility text-[11px] text-ember tracking-[0.18em] uppercase">
            {t.author}
          </span>
          <span className="font-utility text-[10px] text-muted-foreground tracking-[0.15em] uppercase">
            {t.eventType} &middot; {t.venue}
          </span>
        </footer>
      </blockquote>
    </div>
  );
}

export function TestimonialsPage({ navigate }: { navigate: (path: string) => void }) {
  // Separate featured from regular
  const featured = testimonials.find((t) => t.featured);
  const regular = testimonials.filter((t) => !t.featured);

  return (
    <SiteShell navigate={navigate}>
      <PageHero
        navigate={navigate}
        eyebrow="Testimonials"
        title="What Milwaukee"
        italic="is saying."
        description="Real events. Real rooms. Real reactions. Here's what happens when the night is done right."
      />

      {/* Featured Testimonial */}
      <ContentSection>
        {featured && <FeaturedTestimonial t={featured} />}
      </ContentSection>

      {/* Divider line */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="h-px bg-foreground/10" />
      </div>

      {/* Masonry-style grid of remaining testimonials */}
      <ContentSection eyebrow="More Voices" title="Every event has a story.">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-x-8 space-y-0">
          {regular.map((t, i) => (
            <div key={i} className="break-inside-avoid mb-8">
              <TestimonialCard t={t} index={i} />
            </div>
          ))}
        </div>
      </ContentSection>

      {/* CTA Section */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 text-center">
          <p className="font-utility text-[11px] text-ember tracking-[0.18em] uppercase">
            Your Turn
          </p>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-bold text-ink-foreground leading-[1.05] max-w-2xl mx-auto">
            Ready to join them?
          </h2>
          <p className="mt-4 text-ink-foreground/50 max-w-lg mx-auto">
            Every testimonial above started with a single conversation. Let's have yours.
          </p>
          <button
            onClick={() => navigate("/booking")}
            className="mt-10 font-utility inline-flex items-center bg-ember px-8 py-4 text-[11px] text-ember-foreground tracking-[0.18em] uppercase transition-all hover:bg-white hover:text-ink"
          >
            Reserve a Date
          </button>
        </div>
      </section>
    </SiteShell>
  );
}
