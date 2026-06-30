'use client'

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Music, ChevronRight, ChevronLeft } from "lucide-react";
import type { EventData } from "@/data/eventData";

interface EventPageTemplateProps {
  data: EventData;
  navigate: (path: string) => void;
}

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function PageHero({ data, navigate }: EventPageTemplateProps) {
  const { ref, visible } = useScrollReveal(0.1);
  const accentClass = data.accent === "ember" ? "text-ember" : "text-teal";
  const accentBgClass = data.accent === "ember" ? "bg-ember" : "bg-teal";

  return (
    <section ref={ref} className="relative bg-cream border-b border-border overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-32 md:pt-44 pb-20 md:pb-32">
        {/* Breadcrumb navigation */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/events")}
            className="font-utility text-[9px] text-muted-foreground hover:text-ember tracking-wider transition-colors inline-flex items-center gap-1.5"
          >
            <ChevronLeft className="h-3 w-3" />
            All Services
          </button>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <div className={`h-[1px] w-8 ${accentBgClass}`} />
          <p className="font-utility text-[10px] text-ember tracking-widest">
            Services · {data.categoryLabel}
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.02] text-foreground max-w-5xl"
        >
          {data.headline.split(" ").map((word, i, arr) => {
            const lastTwo = i >= arr.length - 2;
            return (
              <span key={i}>
                {lastTwo ? (
                  <span className="italic font-normal text-teal">{word}</span>
                ) : (
                  word
                )}
                {i < arr.length - 1 ? " " : ""}
              </span>
            );
          })}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className={`mt-6 font-display text-xl md:text-2xl italic ${accentClass} max-w-2xl`}
        >
          {data.subheadline}
        </motion.p>

        {/* Description from first body paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground"
        >
          {data.bodyCopy[0].slice(0, 180)}...
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => navigate(data.ctaRoute)}
            className={`font-utility inline-flex items-center gap-2 ${accentBgClass} px-7 py-4 text-[11px] text-white hover:bg-ink hover:text-background transition-colors`}
          >
            {data.cta}
            <ArrowRight className="h-3 w-3" />
          </button>
          {data.startingPrice && (
            <span className="font-utility text-[10px] text-muted-foreground tracking-wider">
              Starting at {data.startingPrice}
            </span>
          )}
        </motion.div>
      </div>

      {/* Decorative accent line at bottom */}
      <div className={`absolute bottom-0 left-0 w-full h-[2px] ${accentBgClass} opacity-30`} />
    </section>
  );
}

function PhilosophySection({ data, navigate }: EventPageTemplateProps) {
  const { ref, visible } = useScrollReveal();
  const accentBgClass = data.accent === "ember" ? "bg-ember" : "bg-teal";
  const accentTextClass = data.accent === "ember" ? "text-ember" : "text-teal";

  return (
    <section ref={ref} className="relative bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid gap-12 md:grid-cols-12 md:gap-16"
        >
          {/* Left: Narrative copy */}
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-[1px] w-6 ${accentBgClass}`} />
              <p className="font-utility text-[10px] text-ember tracking-widest">The Philosophy</p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.08] max-w-xl">
              {data.subheadline}
            </h2>
            <div className="mt-8 space-y-6">
              <p className="text-base leading-[1.8] text-muted-foreground max-w-xl">
                {data.bodyCopy[0]}
              </p>
            </div>
          </div>

          {/* Right: What's Included card */}
          <div className="md:col-span-4 md:col-start-9">
            <div className="bg-cream border border-border p-6 md:p-8 group hover:bg-foreground/[0.03] transition-colors duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className={`h-[1px] w-6 ${accentBgClass} transition-all duration-500 group-hover:w-10`} />
                <p className={`font-utility text-[10px] ${accentTextClass} tracking-widest`}>
                  What&apos;s Included
                </p>
              </div>
              <ul className="space-y-4">
                {data.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group/item">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${accentTextClass} transition-transform duration-300 group-hover/item:scale-110`} />
                    <span className="text-sm leading-relaxed text-foreground/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              {data.startingPrice && (
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="font-utility text-[10px] text-muted-foreground tracking-wider">Starting at</p>
                  <p className={`font-display text-3xl font-bold mt-1 ${accentTextClass}`}>
                    {data.startingPrice}
                  </p>
                </div>
              )}
              <button
                onClick={() => navigate(data.ctaRoute)}
                className={`mt-6 w-full font-utility inline-flex items-center justify-center gap-2 ${accentBgClass} px-6 py-3 text-[10px] text-white hover:bg-ink hover:text-background transition-colors`}
              >
                {data.cta}
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TechnicalSection({ data }: { data: EventData }) {
  const { ref, visible } = useScrollReveal();
  const accentBgClass = data.accent === "ember" ? "bg-ember" : "bg-teal";

  return (
    <section ref={ref} className="relative bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-[1px] w-6 ${accentBgClass}`} />
            <p className="font-utility text-[10px] text-ember tracking-widest">The Approach</p>
          </div>
          <p className="text-base leading-[1.8] text-muted-foreground">
            {data.bodyCopy[1]}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function GenreGuide({ data }: { data: EventData }) {
  const { ref, visible } = useScrollReveal();
  const accentBgClass = data.accent === "ember" ? "bg-ember" : "bg-teal";
  const accentTextClass = data.accent === "ember" ? "text-ember" : "text-teal";
  const accentBorderClass = data.accent === "ember" ? "border-ember/30" : "border-teal/30";
  const accentBgHoverClass = data.accent === "ember" ? "hover:bg-ember/10" : "hover:bg-teal/10";

  return (
    <section ref={ref} className="relative bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-[1px] w-6 ${accentBgClass}`} />
            <p className="font-utility text-[10px] text-ember tracking-widest">Genre Guide</p>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.08]">
            Genres we bring <span className="italic font-normal text-teal">to this event.</span>
          </h2>
        </motion.div>

        {/* Double-stacked grid - 2 rows, wrapping, no horizontal scroll */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {data.genres.map((genre, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 + i * 0.04 }}
              className={`
                flex items-center gap-2.5 px-5 py-3.5
                border ${accentBorderClass} ${accentBgHoverClass}
                transition-all duration-300 cursor-default group/chip
                hover:scale-[1.02]
              `}
            >
              <Music className={`h-3 w-3 ${accentTextClass} opacity-50 group-hover/chip:opacity-100 transition-opacity shrink-0`} />
              <span className="font-utility text-[10px] tracking-wider text-foreground/70 group-hover/chip:text-foreground transition-colors">
                {genre}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RateCard({ data, navigate }: EventPageTemplateProps) {
  const { ref, visible } = useScrollReveal();
  if (!data.startingPrice) return null;

  const accentBgClass = data.accent === "ember" ? "bg-ember" : "bg-teal";
  const accentTextClass = data.accent === "ember" ? "text-ember" : "text-teal";

  return (
    <section ref={ref} className="relative bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-md mx-auto text-center"
        >
          <div className="bg-ink-foreground/[0.05] border border-white/10 p-8 md:p-10 group hover:border-white/20 transition-all duration-500">
            <p className="font-utility text-[10px] text-white/40 tracking-widest mb-4">Investment</p>
            <p className={`font-display text-5xl md:text-6xl font-bold ${accentTextClass}`}>
              {data.startingPrice}
            </p>
            <p className="mt-2 font-utility text-[10px] text-white/40 tracking-wider">starting price</p>
            <div className={`mt-6 h-[1px] ${accentBgClass} opacity-30`} />
            <ul className="mt-6 space-y-3 text-left">
              {data.includes.slice(0, 4).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${accentTextClass}`} />
                  <span className="text-sm text-white/60">{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate(data.ctaRoute)}
              className={`mt-8 w-full font-utility inline-flex items-center justify-center gap-2 ${accentBgClass} px-6 py-3.5 text-[10px] text-white hover:bg-white hover:text-ink transition-colors`}
            >
              {data.cta}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection({ data, navigate }: EventPageTemplateProps) {
  const { ref, visible } = useScrollReveal();
  const accentBgClass = data.accent === "ember" ? "bg-ember" : "bg-teal";
  const accentTextClass = data.accent === "ember" ? "text-ember" : "text-teal";

  // Clean CTA headline generation
  const ctaHeadline = data.cta.startsWith("Book") || data.cta.startsWith("Secure") || data.cta.startsWith("Lock") 
    ? `Ready to ${data.cta.toLowerCase()}`
    : data.cta.startsWith("Plan") || data.cta.startsWith("Set") || data.cta.startsWith("Curate") || data.cta.startsWith("Elevate")
    ? `Ready to ${data.cta.toLowerCase()}`
    : data.cta.startsWith("Discuss") || data.cta.startsWith("Request")
    ? `Let's ${data.cta}`
    : data.cta;

  return (
    <section ref={ref} className="relative bg-ink py-20 md:py-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Decorative line */}
          <div className={`h-[1px] w-12 ${accentBgClass} mx-auto mb-8 opacity-50`} />
          
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-[1.05]">
            {ctaHeadline}
          </h2>
          <p className="mt-4 font-display text-lg italic text-white/50">
            {data.headline}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate(data.ctaRoute)}
              className={`font-utility inline-flex items-center gap-2 ${accentBgClass} px-8 py-4 text-[11px] text-white tracking-wider hover:bg-white hover:text-ink transition-colors`}
            >
              {data.cta}
              <ArrowRight className="h-3 w-3" />
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="font-utility inline-flex items-center gap-2 border border-white/20 px-8 py-4 text-[11px] text-white/70 tracking-wider hover:bg-white/10 hover:text-white transition-colors"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function EventPageTemplate({ data, navigate }: EventPageTemplateProps) {
  return (
    <div>
      <PageHero data={data} navigate={navigate} />
      <PhilosophySection data={data} navigate={navigate} />
      <TechnicalSection data={data} />
      <GenreGuide data={data} />
    </div>
  );
}
