'use client'

import { useState } from "react";
import { Calendar as CalendarIcon, MapPin, Users, Sparkles, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const products = [
  "DJ Set", "Photo Booth", "Mobile Event Van", "Photographer", "Full Production",
];
const venues = [
  "Discovery World", "Pabst Mansion", "Grain Exchange", "Iron Horse Hotel",
  "Villa Terrace", "The Cooperage", "Turner Hall", "Anodyne Coffee",
];
const planners = [
  "Independent", "Splendor Events", "Lakeshore Weddings", "Cream City Co.",
];

function Field({
  label, icon, children,
}: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="group flex-1 px-6 py-5 transition-colors hover:bg-cream">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="font-utility text-[10px]">{label}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function NativeSelect({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent font-display text-lg text-foreground outline-none cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export function BookingFinder({ navigate }: { navigate: (path: string) => void }) {
  const [date, setDate] = useState<Date>();
  const [product, setProduct] = useState("");
  const [venue, setVenue] = useState("");
  const [planner, setPlanner] = useState("");

  const allFilled = !!date && !!product && !!venue && !!planner;

  return (
    <section id="book" className="relative bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <p className="font-utility text-[11px] text-ember">01 - Compose Your Evening</p>
            <h2 className="mt-5 font-display text-5xl md:text-6xl font-bold leading-[1.02]">
              Four choices.<br />
              <span className="italic font-normal text-teal">One unforgettable</span> night.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Tell us when and where - we'll match you with the talent and venues that fit
              your moment. Every vendor in the Best Time network is hand-vetted, insured,
              and booked through one transparent flow.
            </p>
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-sm border border-border bg-card transition-all duration-300">
          {/* Subtle gradient accent line at top */}
          <div className="h-[2px] bg-ember/60" />

          <div className="flex flex-col divide-y divide-border md:flex-row md:divide-x md:divide-y-0">
            <Field label="Date" icon={<CalendarIcon size={14} />}>
              <Popover>
                <PopoverTrigger className={cn(
                  "w-full text-left font-display text-lg outline-none",
                  !date && "text-muted-foreground/70"
                )}>
                  {date ? format(date, "EEE, MMM d, yyyy") : "Pick a date"}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </Field>

            <Field label="Product" icon={<Sparkles size={14} />}>
              <NativeSelect value={product} onChange={setProduct} options={products} placeholder="What you need" />
            </Field>

            <Field label="Venue" icon={<MapPin size={14} />}>
              <NativeSelect value={venue} onChange={setVenue} options={venues} placeholder="Where it happens" />
            </Field>

            <Field label="Planner" icon={<Users size={14} />}>
              <NativeSelect value={planner} onChange={setPlanner} options={planners} placeholder="Who's running it" />
            </Field>

            <button
              onClick={() => navigate("/booking")}
              className={cn(
                "group flex items-center justify-center gap-3 bg-ink px-10 py-6 font-utility text-[11px] text-ink-foreground transition-all md:w-auto md:px-12 hover:bg-ember",
                allFilled && "animate-[glow-pulse_2s_ease-in-out_infinite]"
              )}
            >
              Find Matches
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-utility text-[10px]">200+ Vendors</span>
          <span className="h-1 w-1 rounded-full bg-ember/60" />
          <span className="font-utility text-[10px]">Insured · Vetted · Reviewed</span>
          <span className="h-1 w-1 rounded-full bg-ember/60" />
          <span className="font-utility text-[10px]">No fees until you book</span>
          <span className="h-1 w-1 rounded-full bg-ember/60" />
          <span className="font-utility text-[10px]">Milwaukee + Greater IL</span>
        </div>
      </div>
    </section>
  );
}
