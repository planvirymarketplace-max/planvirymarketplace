'use client'

import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  { q: "Do you require a contract?", a: "Yes. Every booking is confirmed with a signed contract and a 25% refundable deposit." },
  { q: "What is your cancellation policy?", a: "Cancellations 30+ days out receive a full deposit refund. Within 30 days, deposits are non-refundable." },
  { q: "Can I give you a do-not-play list?", a: "Always. Tell us what you love and what to avoid. We build every set list around your taste." },
  { q: "How far in advance should I book?", a: "Weddings: 9 to 12 months out. Smaller events: 4 to 8 weeks. We always do our best to accommodate last-minute requests." },
  { q: "Do you travel outside Milwaukee?", a: "Yes. We cover southeastern Wisconsin and northern Illinois. Additional travel fees may apply for venues beyond 60 miles." },
  { q: "What happens if my DJ gets sick?", a: "We maintain a deep bench. If your primary DJ can't make it, we'll have a qualified replacement confirmed within 4 hours." },
  { q: "Can I see my DJ perform before booking?", a: "Absolutely. We'll invite you to a live event (with the client's permission) or share video from recent performances." },
  { q: "Do you carry insurance?", a: "Every vendor in our network carries general liability insurance. Certificates of insurance are available on request." },
];

export function FAQPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <SiteShell navigate={navigate}>
      <PageHero navigate={navigate} eyebrow="FAQ" title="Common" italic="questions." description="Everything you need to know before, during, and after your event." />
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-utility text-[11px] text-ember">08 Questions</p>
              <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-[1.05]">
                Still have<br />
                <span className="italic font-normal text-teal">questions?</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Can't find the answer you're looking for? Reach out and we'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="font-utility mt-8 inline-flex items-center bg-ember px-6 py-3 text-[11px] text-ember-foreground hover:bg-ink hover:text-background transition-colors"
              >
                Contact Us
              </button>
            </div>
            <div className="md:col-span-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-t border-foreground">
                    <AccordionTrigger className="font-display text-xl md:text-2xl font-bold hover:no-underline hover:text-ember transition-colors py-6">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed text-base md:text-lg pb-6">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
