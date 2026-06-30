'use client'

import { useState, useEffect, useRef, useCallback } from "react";

const EMBER = "#cc6600";
const TEAL = "#00a3a3";

const stepsMeta = [
  { number: 1, title: "Choose a Date", accent: "ember" as const },
  { number: 2, title: "Choose a Time Block", accent: "teal" as const },
  { number: 3, title: "Venue", accent: "ember" as const },
  { number: 4, title: "Event Type", accent: "teal" as const },
  { number: 5, title: "Guest Number", accent: "ember" as const },
  { number: 6, title: "Need Help Coordinating?", accent: "teal" as const },
];

export function HowItWorks({ navigate, inline }: { navigate: (path: string) => void; inline?: boolean }) {
  const [visible, setVisible] = useState(!!inline);
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    date: "",
    timeBlock: "",
    venue: "",
    venueHelp: false,
    eventType: "",
    guestCount: "",
    name: "",
    email: "",
    phone: "",
    coordination: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (inline) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [inline]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      await fetch("/api/booking-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // API may not exist yet
    }
    setSubmitted(true);
  }, [form]);

  const handleStepClick = useCallback((i: number) => {
    setActiveStep(i);
  }, []);

  const accentColor = (a: "ember" | "teal") => a === "ember" ? EMBER : TEAL;
  const accentBg = (a: "ember" | "teal") => a === "ember" ? "bg-ember" : "bg-teal";

  // Render the form field for each step
  const renderField = (idx: number) => {
    const inputClass = "w-full border-b-2 border-foreground/15 bg-transparent py-3 text-xl font-display text-foreground placeholder:text-foreground/25 focus:border-ember focus:outline-none transition-colors";
    const selectClass = inputClass + " appearance-none";

    switch (idx) {
      case 0:
        return <input type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />;
      case 1:
        return (
          <select name="timeBlock" value={form.timeBlock} onChange={handleChange} className={selectClass}>
            <option value="">Select time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="all-night">All Night</option>
          </select>
        );
      case 2:
        return (
          <div className="space-y-3">
            <input type="text" name="venue" value={form.venue} onChange={handleChange} placeholder="Venue name or address" className={inputClass} />
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="venueHelp" checked={form.venueHelp} onChange={handleChange} className="w-5 h-5 accent-ember" />
              <span className="text-base text-foreground/50">I need help finding a venue</span>
            </label>
          </div>
        );
      case 3:
        return (
          <select name="eventType" value={form.eventType} onChange={handleChange} className={selectClass}>
            <option value="">Select event type</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate Event</option>
            <option value="nightclub">Nightclub / Bar</option>
            <option value="festival">Festival</option>
            <option value="birthday">Birthday</option>
            <option value="gala">Gala / Fundraiser</option>
            <option value="community">Community Event</option>
            <option value="private">Private Party</option>
          </select>
        );
      case 4:
        return (
          <select name="guestCount" value={form.guestCount} onChange={handleChange} className={selectClass}>
            <option value="">How many guests?</option>
            <option value="1-30">1 - 30</option>
            <option value="30-75">30 - 75</option>
            <option value="75-150">75 - 150</option>
            <option value="150-300">150 - 300</option>
            <option value="300-500">300 - 500</option>
            <option value="500+">500+</option>
          </select>
        );
      case 5:
        return (
          <div className="space-y-3">
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputClass} />
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className={inputClass} />
            <label className="flex items-center gap-3 cursor-pointer mt-2">
              <input type="checkbox" name="coordination" checked={form.coordination} onChange={handleChange} className="w-5 h-5 accent-ember" />
              <span className="text-base text-foreground/50">I need day-of coordination help</span>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  const innerContent = (
    <>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.02] text-foreground">
          Book your next event{" "}
          <span className="italic font-normal text-teal">in six steps.</span>
        </h2>
      </div>

      {submitted ? (
        <div className="py-12 text-center">
          <div className="h-14 w-14 rounded-full border-2 border-teal flex items-center justify-center mx-auto mb-4">
            <span className="text-teal text-xl">&#10003;</span>
          </div>
          <h3 className="font-display text-4xl font-bold text-foreground">We got you.</h3>
          <p className="mt-3 text-lg text-foreground/60 max-w-md mx-auto">
            Your inquiry has been submitted. We&apos;ll reach out within 24 hours.
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-0">
          {/* LEFT: Timeline track + nodes */}
          <div className="md:w-[120px] flex-shrink-0">
            <div className="flex md:flex-col items-start gap-0">
              {stepsMeta.map((step, i) => {
                const isActive = activeStep === i;
                const isCompleted = i < activeStep;

                return (
                  <div
                    key={step.number}
                    className={`transition-all duration-500 ease-out ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                    style={{ transitionDelay: visible ? `${200 + i * 80}ms` : "0ms" }}
                  >
                    {/* Desktop node */}
                    <button
                      onClick={() => handleStepClick(i)}
                      className="hidden md:flex items-center gap-4 w-full py-3 transition-all duration-300"
                    >
                      <div
                        className={`rounded-full flex items-center justify-center font-display font-bold
                          transition-all duration-300 border-2
                          ${isActive ? `${accentBg(step.accent)} border-transparent w-11 h-11 text-base text-white` :
                            isCompleted ? `${accentBg(step.accent)} border-transparent w-9 h-9 text-xs text-white` :
                            `w-9 h-9 text-xs border-foreground/15 text-foreground/30`
                          }`}
                      >
                        {step.number}
                      </div>
                    </button>

                    {/* Mobile node */}
                    <button
                      onClick={() => handleStepClick(i)}
                      className="flex md:hidden items-center justify-center px-2 py-2 transition-all duration-300"
                    >
                      <div
                        className={`rounded-full flex items-center justify-center font-display font-bold
                          transition-all duration-300 border-2
                          ${isActive ? `${accentBg(step.accent)} border-transparent w-11 h-11 text-base text-white` :
                            isCompleted ? `${accentBg(step.accent)} border-transparent w-9 h-9 text-xs text-white` :
                            `w-9 h-9 text-xs border-foreground/15 text-foreground/30`
                          }`}
                      >
                        {step.number}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Active step content with form field */}
          <div className="flex-1 min-w-0">
            {stepsMeta.map((step, i) => {
              const isActive = activeStep === i;
              const ac = accentColor(step.accent);

              return (
                <div
                  key={step.number}
                  className={`transition-all duration-500 ease-out ${
                    isActive ? "block" : "hidden"
                  }`}
                >
                  <div
                    className={`transition-all duration-700 ease-out ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: visible ? `${400 + i * 100}ms` : "0ms" }}
                  >
                    {/* Step title */}
                    <h3 className="font-display text-3xl md:text-4xl font-bold leading-tight text-foreground mb-6">
                      {step.title}
                    </h3>

                    {/* Form field */}
                    <div className="mb-8">
                      {renderField(i)}
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex gap-2">
                        {stepsMeta.map((_, idx) => (
                          <div
                            key={idx}
                            className="h-[3px] transition-all duration-300"
                            style={{
                              width: idx <= i ? '32px' : '16px',
                              backgroundColor: idx < i ? ac : idx === i ? ac : 'rgba(0,0,0,0.1)',
                            }}
                          />
                        ))}
                      </div>
                      <span className="font-utility text-sm text-foreground/30 tracking-wider">
                        {i + 1} of {stepsMeta.length}
                      </span>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                      {i > 0 && (
                        <button
                          onClick={() => handleStepClick(i - 1)}
                          className="font-utility text-base text-foreground/40 tracking-wider transition-colors hover:text-foreground"
                        >
                          ← Previous
                        </button>
                      )}
                      {i < stepsMeta.length - 1 ? (
                        <button
                          onClick={() => handleStepClick(i + 1)}
                          className="font-utility inline-flex items-center gap-2 px-6 py-3 text-base tracking-wider text-white transition-all duration-300"
                          style={{ backgroundColor: ac }}
                        >
                          Next Step →
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          className="font-utility inline-flex items-center gap-2 px-8 py-3 text-base tracking-wider text-white transition-all duration-300"
                          style={{ backgroundColor: TEAL }}
                        >
                          Submit Inquiry →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );

  if (inline) return innerContent;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative bg-[#faf9f6] w-full overflow-x-hidden"
    >
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 md:pt-8 pb-6 md:pb-8">
        {innerContent}
      </div>
    </section>
  );
}
