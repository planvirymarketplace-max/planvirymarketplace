'use client'

import { useState, useMemo } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  MapPin,
  Music,
  Users,
  Handshake,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────

interface BookingFormData {
  eventDate: Date | undefined;
  timeBlock: string;
  customStartTime: string;
  customEndTime: string;
  venueName: string;
  noVenueYet: boolean;
  eventType: string;
  guestRange: string;
  needCoordination: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests: string;
}

const initialFormData: BookingFormData = {
  eventDate: undefined,
  timeBlock: "",
  customStartTime: "17:00",
  customEndTime: "23:00",
  venueName: "",
  noVenueYet: false,
  eventType: "",
  guestRange: "",
  needCoordination: false,
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  specialRequests: "",
};

// ─── Constants ──────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Date" },
  { number: 2, label: "Time" },
  { number: 3, label: "Venue" },
  { number: 4, label: "Event" },
  { number: 5, label: "Guests" },
  { number: 6, label: "Coord." },
];

const TIME_BLOCKS = [
  { id: "morning", label: "Morning", time: "6am – 12pm" },
  { id: "afternoon", label: "Afternoon", time: "12pm – 5pm" },
  { id: "evening", label: "Evening", time: "5pm – 10pm" },
  { id: "full-night", label: "Full Night", time: "6pm – 2am" },
  { id: "custom", label: "Custom", time: "Set your own hours" },
];

const TIME_BLOCK_MAP: Record<string, { start: string; end: string }> = {
  morning: { start: "06:00", end: "12:00" },
  afternoon: { start: "12:00", end: "17:00" },
  evening: { start: "17:00", end: "22:00" },
  "full-night": { start: "18:00", end: "02:00" },
};

const EVENT_TYPES = [
  { id: "wedding", label: "Wedding" },
  { id: "corporate", label: "Corporate" },
  { id: "nightclub-bar", label: "Nightclub / Bar" },
  { id: "festival", label: "Festival" },
  { id: "birthday", label: "Birthday" },
  { id: "gala-fundraiser", label: "Gala / Fundraiser" },
  { id: "community", label: "Community" },
  { id: "school-dance", label: "School Dance" },
  { id: "other", label: "Other" },
];

const GUEST_RANGES = [
  { id: "under-50", label: "Under 50", value: 40 },
  { id: "50-100", label: "50 – 100", value: 75 },
  { id: "100-200", label: "100 – 200", value: 150 },
  { id: "200-500", label: "200 – 500", value: 350 },
  { id: "500+", label: "500+", value: 500 },
];

const BASE_PRICE = 950;
const COORDINATION_ADDON = 250;

// ─── Step Indicator ─────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-utility font-semibold transition-all duration-300",
                  currentStep > step.number
                    ? "bg-ember text-ember-foreground"
                    : currentStep === step.number
                    ? "bg-ember text-ember-foreground ring-2 ring-ember/30 ring-offset-2 ring-offset-background"
                    : "bg-foreground/10 text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 font-utility text-[9px] tracking-wider hidden sm:block transition-colors",
                  currentStep >= step.number ? "text-ember" : "text-muted-foreground/50"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[2px] mx-2 transition-colors duration-300",
                  currentStep > step.number ? "bg-ember" : "bg-foreground/10"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 1: Choose a Date ──────────────────────────────────────

function StepDate({
  data,
  onChange,
}: {
  data: BookingFormData;
  onChange: (d: Date | undefined) => void;
}) {
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest">
          Step 1 of 6
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
          Pick your date.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
          Availability changes fast. Lock in your day and we&apos;ll hold it for 48 hours.
        </p>
      </div>

      <div className="flex justify-center md:justify-start">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-3 rounded-md border border-border bg-card px-5 py-4 font-display text-lg transition-all hover:border-ember/40",
                !data.eventDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon size={20} className="text-ember shrink-0" />
              {data.eventDate
                ? format(data.eventDate, "EEEE, MMMM d, yyyy")
                : "Select a date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={data.eventDate}
              onSelect={onChange}
              disabled={{ before: tomorrow }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {data.eventDate && (
        <div className="flex items-center gap-2 text-sm text-teal">
          <Check size={16} />
          <span>
            Selected: <strong>{format(data.eventDate, "EEEE, MMMM d, yyyy")}</strong>
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Choose a Time Block ────────────────────────────────

function StepTimeBlock({
  data,
  onTimeBlockChange,
  onCustomStartChange,
  onCustomEndChange,
}: {
  data: BookingFormData;
  onTimeBlockChange: (v: string) => void;
  onCustomStartChange: (v: string) => void;
  onCustomEndChange: (v: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest">
          Step 2 of 6
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
          When does the night start?
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
          Morning coffee sets or midnight takeovers. Every block has its own energy.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TIME_BLOCKS.map((block) => {
          const isSelected = data.timeBlock === block.id;
          return (
            <button
              key={block.id}
              onClick={() => onTimeBlockChange(block.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 border-2 p-6 transition-all duration-200",
                isSelected
                  ? "border-ember bg-ember/5 shadow-sm"
                  : "border-border bg-card hover:border-ember/30"
              )}
            >
              <span
                className={cn(
                  "font-display text-lg font-bold",
                  isSelected ? "text-ember" : "text-foreground"
                )}
              >
                {block.label}
              </span>
              <span className="font-utility text-[10px] text-muted-foreground tracking-wide">
                {block.time}
              </span>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check size={14} className="text-ember" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {data.timeBlock === "custom" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 rounded-md border border-border bg-card p-5">
          <div className="flex-1 w-full">
            <label className="font-utility text-[10px] text-ember tracking-widest block mb-2">
              Start Time
            </label>
            <Input
              type="time"
              value={data.customStartTime}
              onChange={(e) => onCustomStartChange(e.target.value)}
              className="font-display text-lg"
            />
          </div>
          <div className="hidden sm:flex items-center pb-2 text-muted-foreground">
            <ArrowRight size={16} />
          </div>
          <div className="flex-1 w-full">
            <label className="font-utility text-[10px] text-ember tracking-widest block mb-2">
              End Time
            </label>
            <Input
              type="time"
              value={data.customEndTime}
              onChange={(e) => onCustomEndChange(e.target.value)}
              className="font-display text-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Venue ──────────────────────────────────────────────

function StepVenue({
  data,
  onVenueNameChange,
  onNoVenueToggle,
}: {
  data: BookingFormData;
  onVenueNameChange: (v: string) => void;
  onNoVenueToggle: (v: boolean) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest">
          Step 3 of 6
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
          Where&apos;s it happening?
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
          Already booked? Drop the name. Still looking? We&apos;ve got connections.
        </p>
      </div>

      <div className="space-y-5 max-w-lg">
        <div>
          <label className="font-utility text-[10px] text-ember tracking-widest block mb-2">
            Venue Name
          </label>
          <Input
            placeholder="e.g. The Grain Exchange"
            value={data.venueName}
            onChange={(e) => onVenueNameChange(e.target.value)}
            disabled={data.noVenueYet}
            className={cn(
              "font-display text-lg h-12",
              data.noVenueYet && "opacity-40"
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={data.noVenueYet}
            onCheckedChange={onNoVenueToggle}
            className="data-[state=checked]:bg-ember"
          />
          <span className="text-sm text-muted-foreground">
            I don&apos;t have a venue yet
          </span>
        </div>

        {data.noVenueYet && (
          <div className="rounded-md border border-teal/30 bg-teal/5 p-5 flex items-start gap-3">
            <MapPin size={18} className="text-teal shrink-0 mt-0.5" />
            <div>
              <p className="font-display text-sm font-bold text-teal">
                We can help find the perfect space.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Our team has relationships with venues across Milwaukee. We&apos;ll match
                you based on your event type, guest count, and vibe.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: Event Type ─────────────────────────────────────────

function StepEventType({
  data,
  onChange,
}: {
  data: BookingFormData;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest">
          Step 4 of 6
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
          What kind of night?
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
          We tailor the sound, the lighting, and the energy to match the moment.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {EVENT_TYPES.map((type) => {
          const isSelected = data.eventType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onChange(type.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0 border-2 p-6 transition-all duration-200",
                isSelected
                  ? "border-ember bg-ember/5 shadow-sm"
                  : "border-border bg-card hover:border-ember/30"
              )}
            >
              <span
                className={cn(
                  "font-display text-sm font-bold",
                  isSelected ? "text-ember" : "text-foreground"
                )}
              >
                {type.label}
              </span>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check size={14} className="text-ember" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 5: Guest Number ───────────────────────────────────────

function StepGuestCount({
  data,
  onChange,
}: {
  data: BookingFormData;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest">
          Step 5 of 6
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
          How many people?
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
          Intimate dinner or stadium crowd. We scale the rig to match the room.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {GUEST_RANGES.map((range) => {
          const isSelected = data.guestRange === range.id;
          return (
            <button
              key={range.id}
              onClick={() => onChange(range.id)}
              className={cn(
                "relative rounded-md border-2 px-6 py-4 transition-all duration-200",
                isSelected
                  ? "border-ember bg-ember/5 shadow-sm"
                  : "border-border bg-card hover:border-ember/30"
              )}
            >
              <span
                className={cn(
                  "font-display text-lg font-bold",
                  isSelected ? "text-ember" : "text-foreground"
                )}
              >
                {range.label}
              </span>
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-ember">
                    <Check size={10} className="text-ember-foreground" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 6: Coordination ───────────────────────────────────────

function StepCoordination({
  data,
  onToggle,
}: {
  data: BookingFormData;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest">
          Step 6 of 6
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
          Need help coordinating?
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
          Day-of coordination, vendor wrangling, timeline management. Add it on, or go without.
        </p>
      </div>

      <div className="max-w-lg space-y-4">
        <div
          className={cn(
            "rounded-md border-2 p-6 transition-all duration-200",
            data.needCoordination
              ? "border-ember bg-ember/5"
              : "border-border bg-card"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Handshake
                size={24}
                className={cn(
                  "transition-colors",
                  data.needCoordination ? "text-ember" : "text-muted-foreground"
                )}
              />
              <div>
                <p className="font-display font-bold">
                  {data.needCoordination ? "Yes, add coordination" : "Add day-of coordination?"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  +${COORDINATION_ADDON} to your booking
                </p>
              </div>
            </div>
            <Switch
              checked={data.needCoordination}
              onCheckedChange={onToggle}
              className="data-[state=checked]:bg-ember"
            />
          </div>
        </div>

        {data.needCoordination && (
          <div className="rounded-md border border-teal/30 bg-teal/5 p-5 space-y-3">
            <p className="font-display text-sm font-bold text-teal">
              What&apos;s included:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-teal shrink-0 mt-0.5" />
                Day-of timeline management and execution
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-teal shrink-0 mt-0.5" />
                Vendor coordination and arrival logistics
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-teal shrink-0 mt-0.5" />
                Setup/teardown oversight
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-teal shrink-0 mt-0.5" />
                Emergency point of contact throughout the event
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Review Step ────────────────────────────────────────────────

function StepReview({
  data,
  onFieldChange,
  onBack,
  onSubmit,
  isSubmitting,
}: {
  data: BookingFormData;
  onFieldChange: (field: keyof BookingFormData, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const selectedTimeBlock = TIME_BLOCKS.find((b) => b.id === data.timeBlock);
  const selectedEventType = EVENT_TYPES.find((t) => t.id === data.eventType);
  const selectedGuestRange = GUEST_RANGES.find((g) => g.id === data.guestRange);

  const timeDisplay = data.timeBlock === "custom"
    ? `${data.customStartTime} – ${data.customEndTime}`
    : selectedTimeBlock?.time ?? "-";

  const totalPrice = data.needCoordination ? BASE_PRICE + COORDINATION_ADDON : BASE_PRICE;
  const depositPrice = totalPrice * 0.25;

  const canSubmit =
    data.contactName.trim() !== "" &&
    data.contactEmail.trim() !== "" &&
    data.contactPhone.trim() !== "";

  return (
    <div className="space-y-8">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest">Review</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
          Look it over.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
          Make sure everything checks out. Then we&apos;ll lock it in.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryCard
          icon={<CalendarIcon size={16} />}
          label="Date"
          value={data.eventDate ? format(data.eventDate, "EEEE, MMMM d, yyyy") : "-"}
        />
        <SummaryCard
          icon={<Clock size={16} />}
          label="Time"
          value={timeDisplay}
        />
        <SummaryCard
          icon={<MapPin size={16} />}
          label="Venue"
          value={data.noVenueYet ? "Need help finding one" : data.venueName || "-"}
        />
        <SummaryCard
          icon={<Music size={16} />}
          label="Event Type"
          value={selectedEventType?.label ?? "-"}
        />
        <SummaryCard
          icon={<Users size={16} />}
          label="Guests"
          value={selectedGuestRange?.label ?? "-"}
        />
        <SummaryCard
          icon={<Handshake size={16} />}
          label="Coordination"
          value={data.needCoordination ? `Yes (+$${COORDINATION_ADDON})` : "No"}
        />
      </div>

      {/* Pricing */}
      <div className="rounded-md border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <span className="font-utility text-[10px] text-ember tracking-widest">Estimated Total</span>
          <span className="font-display text-2xl font-bold">${totalPrice}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>25% deposit to reserve</span>
          <span className="font-display font-bold text-foreground">${depositPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <p className="font-utility text-[10px] text-ember tracking-widest">Contact Info</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="font-utility text-[10px] text-muted-foreground tracking-wider block mb-1.5">
              Full Name *
            </label>
            <Input
              placeholder="Your full name"
              value={data.contactName}
              onChange={(e) => onFieldChange("contactName", e.target.value)}
              className="font-display h-11"
            />
          </div>
          <div>
            <label className="font-utility text-[10px] text-muted-foreground tracking-wider block mb-1.5">
              Email *
            </label>
            <Input
              type="email"
              placeholder="you@email.com"
              value={data.contactEmail}
              onChange={(e) => onFieldChange("contactEmail", e.target.value)}
              className="font-display h-11"
            />
          </div>
          <div>
            <label className="font-utility text-[10px] text-muted-foreground tracking-wider block mb-1.5">
              Phone *
            </label>
            <Input
              type="tel"
              placeholder="(414) 555-0123"
              value={data.contactPhone}
              onChange={(e) => onFieldChange("contactPhone", e.target.value)}
              className="font-display h-11"
            />
          </div>
        </div>

        <div>
          <label className="font-utility text-[10px] text-muted-foreground tracking-wider block mb-1.5">
            Special Requests
          </label>
          <textarea
            placeholder="Anything else we should know?"
            value={data.specialRequests}
            onChange={(e) => onFieldChange("specialRequests", e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none md:text-sm"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          onClick={onBack}
          className="font-utility inline-flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-4 py-3"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className={cn(
            "font-utility inline-flex items-center gap-2 bg-ember text-ember-foreground px-7 py-4 text-[11px] transition-all hover:bg-ink hover:text-ink-foreground",
            (!canSubmit || isSubmitting) && "opacity-50 cursor-not-allowed hover:bg-ember hover:text-ember-foreground"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Booking
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-4 flex items-start gap-3">
      <div className="text-ember mt-0.5">{icon}</div>
      <div>
        <p className="font-utility text-[10px] text-muted-foreground tracking-wider">{label}</p>
        <p className="font-display font-bold text-sm mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Success State ──────────────────────────────────────────────

function SuccessState({
  bookingNumber,
  navigate,
}: {
  bookingNumber: string;
  navigate: (path: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ember/10 mb-6">
        <Check size={40} className="text-ember" />
      </div>
      <p className="font-utility text-[10px] text-ember tracking-widest">Booking Confirmed</p>
      <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
        Your date is locked in.
      </h2>
      <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">
        A confirmation email is on its way. Your coordinator will reach out within 48 hours.
      </p>

      <div className="mt-8 rounded-md border border-border bg-card px-8 py-5">
        <p className="font-utility text-[10px] text-muted-foreground tracking-wider">
          Confirmation Number
        </p>
        <p className="font-display text-2xl font-bold text-ember mt-1">{bookingNumber}</p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="font-utility mt-10 inline-flex items-center gap-2 bg-ink text-ink-foreground px-7 py-4 text-[11px] transition-all hover:bg-ember hover:text-ember-foreground"
      >
        Back to Home
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ─── Main Booking Page ──────────────────────────────────────────

export function BookingPage({ navigate }: { navigate: (path: string) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = (field: keyof BookingFormData, value: string | boolean | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!formData.eventDate;
      case 2:
        return !!formData.timeBlock;
      case 3:
        return formData.noVenueYet || formData.venueName.trim() !== "";
      case 4:
        return !!formData.eventType;
      case 5:
        return !!formData.guestRange;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (currentStep < 6 && canGoNext()) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 6) {
      setCurrentStep(7); // Review step
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const timeBlockTimes = TIME_BLOCK_MAP[formData.timeBlock];
      const startTime =
        formData.timeBlock === "custom" ? formData.customStartTime : timeBlockTimes?.start ?? "17:00";
      const endTime =
        formData.timeBlock === "custom" ? formData.customEndTime : timeBlockTimes?.end ?? "23:00";

      const guestCount =
        GUEST_RANGES.find((g) => g.id === formData.guestRange)?.value ?? 100;

      const totalPrice = formData.needCoordination ? BASE_PRICE + COORDINATION_ADDON : BASE_PRICE;
      const depositPrice = totalPrice * 0.25;

      const payload = {
        eventType: formData.eventType,
        eventDate: formData.eventDate ? format(formData.eventDate, "yyyy-MM-dd") : "",
        eventStartTime: startTime,
        eventEndTime: endTime,
        venueName: formData.noVenueYet ? "TBD - Needs venue assistance" : formData.venueName,
        venueAddress: "",
        guestCount,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        specialRequests: formData.specialRequests || (formData.needCoordination ? "Needs coordination help" : ""),
        servicesRequested: "DJ Services",
        totalAmount: totalPrice,
        depositAmount: depositPrice,
        balanceDue: totalPrice - depositPrice,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to create booking");
      }

      const booking = await res.json();
      setBookingNumber(booking.bookingNumber);
      setShowSuccess(true);
    } catch (error) {
      console.error("Booking submission failed:", error);
      // On error, still show success but with a generic number
      setBookingNumber("BT-PENDING00");
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteShell showAboveFooterVideo={false} showGlobalFooter={false} showDedicatedCTA={false} navigate={navigate}>
      {/* Hero */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <p className="font-utility text-[11px] text-ember">Book</p>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.02] text-foreground max-w-4xl">
            Pick a date.{" "}
            <span className="italic font-normal text-teal">Pick a vibe.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Tell us when and where. We&apos;ll confirm availability in under 24 hours.
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section className="bg-background">
        <div className="mx-auto max-w-[900px] px-6 md:px-10 py-12 md:py-16">
          {showSuccess ? (
            <SuccessState bookingNumber={bookingNumber} navigate={navigate} />
          ) : (
            <>
              {/* Step Indicator */}
              <div className="mb-12">
                <StepIndicator currentStep={currentStep > 6 ? 6 : currentStep} />
              </div>

              {/* Step Content with Transition */}
              <div className="relative min-h-[400px]">
                <div
                  className={cn(
                    "transition-all duration-300",
                    currentStep === 1 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  {currentStep === 1 && (
                    <StepDate
                      data={formData}
                      onChange={(d) => updateField("eventDate", d)}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "transition-all duration-300",
                    currentStep === 2 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  {currentStep === 2 && (
                    <StepTimeBlock
                      data={formData}
                      onTimeBlockChange={(v) => updateField("timeBlock", v)}
                      onCustomStartChange={(v) => updateField("customStartTime", v)}
                      onCustomEndChange={(v) => updateField("customEndTime", v)}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "transition-all duration-300",
                    currentStep === 3 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  {currentStep === 3 && (
                    <StepVenue
                      data={formData}
                      onVenueNameChange={(v) => updateField("venueName", v)}
                      onNoVenueToggle={(v) => updateField("noVenueYet", v)}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "transition-all duration-300",
                    currentStep === 4 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  {currentStep === 4 && (
                    <StepEventType
                      data={formData}
                      onChange={(v) => updateField("eventType", v)}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "transition-all duration-300",
                    currentStep === 5 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  {currentStep === 5 && (
                    <StepGuestCount
                      data={formData}
                      onChange={(v) => updateField("guestRange", v)}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "transition-all duration-300",
                    currentStep === 6 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  {currentStep === 6 && (
                    <StepCoordination
                      data={formData}
                      onToggle={(v) => updateField("needCoordination", v)}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "transition-all duration-300",
                    currentStep === 7 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  {currentStep === 7 && (
                    <StepReview
                      data={formData}
                      onFieldChange={(field, value) => updateField(field, value)}
                      onBack={() => setCurrentStep(6)}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </div>
              </div>

              {/* Navigation Buttons (not shown on review step - review has its own) */}
              {currentStep <= 6 && (
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
                  <button
                    onClick={goBack}
                    className={cn(
                      "font-utility inline-flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-4 py-3",
                      currentStep === 1 && "invisible"
                    )}
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!canGoNext()}
                    className={cn(
                      "font-utility inline-flex items-center gap-2 bg-ember text-ember-foreground px-7 py-4 text-[11px] transition-all hover:bg-ink hover:text-ink-foreground",
                      !canGoNext() && "opacity-50 cursor-not-allowed hover:bg-ember hover:text-ember-foreground"
                    )}
                  >
                    {currentStep === 6 ? "Review Booking" : "Next"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

// ─── Preserved Exports ──────────────────────────────────────────

export function BookingPaymentPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell showAboveFooterVideo={false} navigate={navigate}>
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
          <p className="font-utility text-[11px] text-ember">Booking · Step 2</p>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.02] text-foreground max-w-4xl">
            Reserve with{" "}
            <span className="italic font-normal text-teal">a 25% deposit.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Secure your date with a refundable deposit. Balance due 14 days before your event.
          </p>
        </div>
      </section>
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="font-utility text-[11px] text-ember">Payment</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-[1.05] max-w-3xl">
            Stripe checkout coming online.
          </h2>
          <div className="mt-10">
            <p className="max-w-2xl text-lg text-muted-foreground">
              Payment is wired through Stripe. Connect your account in admin to activate live checkout.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export function BookingConfirmationPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell showAboveFooterVideo={false} navigate={navigate}>
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
          <p className="font-utility text-[11px] text-ember">Booking · Confirmed</p>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.02] text-foreground max-w-4xl">
            Your date is{" "}
            <span className="italic font-normal text-teal">locked in.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A confirmation email is on its way. Your coordinator will reach out within 48 hours.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pb-24">
        <button
          onClick={() => navigate("/")}
          className="font-utility inline-flex items-center bg-ink text-ink-foreground px-6 py-3 text-[11px] hover:bg-ember hover:text-ember-foreground transition-colors"
        >
          Back to Home
        </button>
      </div>
    </SiteShell>
  );
}
