'use client'

import { useState } from "react";

export function DedicatedCTA({ navigate }: { navigate: (path: string) => void }) {
  const [form, setForm] = useState({ name: "", eventType: "", date: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative bg-ink w-full overflow-x-hidden">
      {/* Top white line */}
      <div className="h-[1px] bg-white/20" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-6 md:py-8">
        {/* Two-column layout with white vertical divider */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-white/20 gap-8 md:gap-0">
          {/* Left column - heading and contact info */}
          <div className="md:pr-8 lg:pr-10">
            <p className="font-utility text-[9px] text-ember tracking-widest">Get in Touch</p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold text-white leading-tight">
              Ready to build <span className="italic font-normal text-teal">your event?</span>
            </h2>

            <p className="mt-4 text-xs leading-relaxed text-white/50 max-w-xs">
              Tell us about your event. One conversation. One curated plan.
            </p>

            {/* Contact info rows */}
            <div className="mt-6 space-y-0">
              <div className="border-t border-white/20 pt-3 pb-3">
                <p className="font-utility text-[8px] text-ember tracking-widest">Phone</p>
                <p className="mt-1 text-sm text-white/80">262-757-5469</p>
              </div>
              <div className="border-t border-white/20 pt-3 pb-3">
                <p className="font-utility text-[8px] text-teal tracking-widest">For Immediate Assistance</p>
                <p className="mt-1 text-sm text-white/80">414-364-7790</p>
              </div>
              <div className="border-t border-white/20 pt-3 pb-3">
                <p className="font-utility text-[8px] text-ember tracking-widest">Service Area</p>
                <p className="mt-1 text-sm text-white/80">Milwaukee + Greater WI &amp; IL</p>
              </div>
            </div>
          </div>

          {/* Right column - form */}
          <div className="md:pl-8 lg:pl-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                <div className="h-10 w-10 rounded-full border-2 border-ember flex items-center justify-center mb-3">
                  <span className="text-ember text-lg">✓</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">Message sent.</h3>
                <p className="mt-1 text-xs text-white/50">We&apos;ll be in touch within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 font-utility text-[9px] text-ember hover:text-teal transition-colors tracking-wider"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-0">
                {/* Name */}
                <div className="border-t border-white/20 pt-3 pb-3">
                  <label className="font-utility text-[8px] text-white/50 tracking-widest block mb-1">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full border-b border-white/30 bg-transparent py-2 text-sm text-white placeholder:text-white/25 focus:border-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Event type */}
                <div className="border-t border-white/20 pt-3 pb-3">
                  <label className="font-utility text-[8px] text-white/50 tracking-widest block mb-1">Event Type</label>
                  <select
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    className="w-full border-b border-white/30 bg-transparent py-2 text-sm text-white/80 focus:border-white focus:outline-none transition-colors appearance-none"
                  >
                    <option value="" className="bg-ink">Select type</option>
                    <option value="wedding" className="bg-ink">Wedding</option>
                    <option value="corporate" className="bg-ink">Corporate</option>
                    <option value="nightclub" className="bg-ink">Nightclub / Bar</option>
                    <option value="festival" className="bg-ink">Festival</option>
                    <option value="birthday" className="bg-ink">Birthday</option>
                    <option value="gala" className="bg-ink">Gala / Fundraiser</option>
                    <option value="other" className="bg-ink">Other</option>
                  </select>
                </div>

                {/* Event date */}
                <div className="border-t border-white/20 pt-3 pb-3">
                  <label className="font-utility text-[8px] text-white/50 tracking-widest block mb-1">Event Date</label>
                  <input
                    name="date"
                    type="text"
                    value={form.date}
                    onChange={handleChange}
                    placeholder="MM/DD/YYYY"
                    onFocus={(e) => (e.target.type = "date")}
                    className="w-full border-b border-white/30 bg-transparent py-2 text-sm text-white/80 placeholder:text-white/25 focus:border-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="border-t border-white/20 pt-3 pb-3">
                  <label className="font-utility text-[8px] text-white/50 tracking-widest block mb-1">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your event..."
                    rows={2}
                    className="w-full border-b border-white/30 bg-transparent py-2 text-sm text-white placeholder:text-white/25 focus:border-white focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="border-t border-white/20 pt-4 flex items-center justify-between">
                  <p className="text-[9px] text-white/35">We respond within 24 hours.</p>
                  <button
                    type="submit"
                    className="font-utility inline-flex items-center bg-ember px-6 py-2.5 text-[9px] text-ember-foreground tracking-wider transition-all hover:bg-white hover:text-ink"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom white line */}
      <div className="h-[1px] bg-white/20" />
    </section>
  );
}
