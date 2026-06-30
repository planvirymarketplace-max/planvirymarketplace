'use client'

import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

export function ContactPage({ navigate }: { navigate: (path: string) => void }) {
  const [form, setForm] = useState({ name: "", email: "", eventType: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSending(true);
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent!", { description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", eventType: "", message: "" });
      setErrors({});
    }, 1200);
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "hello@besttimemke.com" },
    { icon: Phone, label: "Phone", value: "(414) 555-0199" },
    { icon: MapPin, label: "Office", value: "Milwaukee, WI" },
    { icon: Clock, label: "Hours", value: "Mon–Sun, 24/7" },
  ];

  return (
    <SiteShell navigate={navigate} showDedicatedCTA={false}>
      <PageHero navigate={navigate} eyebrow="About & Contact" title="We build events" italic="people remember." description="Best Time DJ Services is Milwaukee's curated network for entertainment, venues, and creative talent. We work where music, light, and people meet." />

      {/* About Section */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-6 bg-ember" />
            <p className="font-utility text-[10px] text-ember tracking-widest">The Story</p>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.08] max-w-2xl">
            From one turntable to a citywide network.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-[1.8] text-muted-foreground">
            What started as a single DJ booth at a Riverwest house party has grown into Milwaukee's
            most trusted booking network for weddings, corporate events, nightclubs, and brand
            activations. Every vendor in our roster is vetted, insured, and accountable to one
            standard: the event has to feel inevitable.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-6 bg-ember" />
            <p className="font-utility text-[10px] text-ember tracking-widest">Get in Touch</p>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.08]">
            Let&apos;s talk about <span className="italic font-normal text-teal">your event.</span>
          </h2>

          <div className="mt-12 grid gap-16 md:grid-cols-12">
            {/* Contact Info Sidebar */}
            <div className="md:col-span-4">
              <p className="text-muted-foreground leading-relaxed">
                Whether you&apos;re planning a wedding, corporate event, or just want to learn more, we&apos;re a message away.
              </p>
              <div className="mt-10 space-y-6">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center border border-border bg-background">
                        <Icon size={16} className="text-ember" />
                      </div>
                      <div>
                        <p className="font-utility text-[10px] text-muted-foreground">{item.label}</p>
                        <p className="mt-1 text-foreground font-medium">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-8">
              <div className="bg-card border border-border p-8 md:p-12 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">
                <form className="grid gap-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                  <div>
                    <label className="font-utility text-[10px] text-muted-foreground mb-2 block">YOUR NAME *</label>
                    <input
                      className={`w-full border ${errors.name ? "border-destructive" : "border-border"} bg-background px-4 py-3 text-foreground focus:outline-none focus:border-ember transition-colors`}
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="font-utility text-[10px] text-muted-foreground mb-2 block">EMAIL *</label>
                    <input
                      className={`w-full border ${errors.email ? "border-destructive" : "border-border"} bg-background px-4 py-3 text-foreground focus:outline-none focus:border-ember transition-colors`}
                      placeholder="john@example.com"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="font-utility text-[10px] text-muted-foreground mb-2 block">EVENT TYPE</label>
                    <select
                      className="w-full border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:border-ember transition-colors cursor-pointer"
                      value={form.eventType}
                      onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    >
                      <option value="">Select event type</option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="school-dance">School Dance / Prom</option>
                      <option value="nightclub">Nightclub / Bar</option>
                      <option value="festival">Festival</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-utility text-[10px] text-muted-foreground mb-2 block">MESSAGE *</label>
                    <textarea
                      className={`w-full border ${errors.message ? "border-destructive" : "border-border"} bg-background px-4 py-3 text-foreground min-h-[160px] focus:outline-none focus:border-ember transition-colors resize-none`}
                      placeholder="Tell us about your event, date, venue, vibe, number of guests..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="font-utility bg-ember text-ember-foreground py-4 px-8 text-[11px] hover:bg-ink hover:text-background transition-colors w-fit disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? "SENDING..." : "SEND MESSAGE"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
