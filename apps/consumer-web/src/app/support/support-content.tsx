'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  XCircle,
  CreditCard,
  Store,
  KeyRound,
  Mail,
  Instagram,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

/* ── FAQ Data ────────────────────────────────────────────────────── */
const SUPPORT_FAQS = [
  {
    icon: Calendar,
    category: 'Booking',
    question: 'How do I book a vendor?',
    answer:
      'Browse vendors by category or search for a specific service. Once you find a vendor you like, click "Request Quote" or "Book Now" on their profile. Fill in your event details, and the vendor will respond with availability and pricing. You can book multiple vendors in a single checkout.',
  },
  {
    icon: XCircle,
    category: 'Booking',
    question: 'How do I cancel a booking?',
    answer:
      'Go to your dashboard, find the booking you want to cancel, and click "Cancel Booking." Cancellation policies vary by vendor - most offer full refunds if cancelled at least 14 days before the event. Check the vendor\'s cancellation policy on their profile before booking.',
  },
  {
    icon: CreditCard,
    category: 'Payments',
    question: 'How does vendor payment work?',
    answer:
      'When you book a vendor, you pay a deposit (typically 25–50%) to secure the date. The remaining balance is charged 3–5 days before the event. All payments are processed securely through Stripe. Vendors receive their payout within 2 business days after the event.',
  },
  {
    icon: Store,
    category: 'Vendors',
    question: 'How do I list my business on Planviry?',
    answer:
      'Visit our Vendor Onboarding page and click "Create Your Free Profile." Fill in your business details, upload photos, set your packages and pricing, and submit for review. Most profiles are approved within 1–2 business days. You can also get a Verified badge by submitting your business license and insurance.',
  },
  {
    icon: KeyRound,
    category: 'Account',
    question: 'I can\'t log into my account. What do I do?',
    answer:
      'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a password reset link. If you don\'t receive the email within a few minutes, check your spam folder. If you\'re still having trouble, contact us at hello@planviry.com.',
  },
  {
    icon: Mail,
    category: 'Contact',
    question: 'How do I contact Planviry support?',
    answer:
      'You can reach us by email at hello@planviry.com. We typically respond within 24 hours on business days. For urgent issues with active bookings, include your booking ID in the subject line for priority support.',
  },
];

export function SupportContent() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return SUPPORT_FAQS;
    const q = searchQuery.toLowerCase();
    return SUPPORT_FAQS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <>
      {/* ── Search ──────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base rounded-full border-gray-200 shadow-sm focus:border-coral focus:ring-coral/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      {/* ── FAQ Accordion ───────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">No results found.</p>
            <p className="text-muted-foreground text-sm">
              Try a different search term or{' '}
              <a href="mailto:hello@planviry.com" className="text-coral hover:underline">
                contact support
              </a>
              .
            </p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, i) => {
              const Icon = faq.icon;
              return (
                <AccordionItem key={i} value={`support-faq-${i}`}>
                  <AccordionTrigger className="text-left font-semibold hover:text-coral transition-colors">
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-coral shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-7">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </section>

      {/* ── Contact Section ─────────────────────────────────────────── */}
      <section className="bg-black/[0.03]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Still Need Help?
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Our team is here to help. Reach out anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <a
              href="mailto:hello@planviry.com"
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white border border-gray-200 hover:border-coral hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center group-hover:bg-coral/20 transition-colors">
                <Mail className="w-5 h-5 text-coral" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">Email Us</p>
                <p className="text-xs text-coral mt-1">hello@planviry.com</p>
              </div>
            </a>

            <a
              href="https://instagram.com/planviry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white border border-gray-200 hover:border-coral hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center group-hover:bg-coral/20 transition-colors">
                <Instagram className="w-5 h-5 text-coral" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">Instagram</p>
                <p className="text-xs text-muted-foreground mt-1">@planviry</p>
              </div>
            </a>

            <a
              href="https://tiktok.com/@planviry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white border border-gray-200 hover:border-coral hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center group-hover:bg-coral/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-coral" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">TikTok</p>
                <p className="text-xs text-muted-foreground mt-1">@planviry</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
            Find the perfect vendors for your event or list your business to start
            getting bookings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book">
              <Button
                size="lg"
                className="bg-coral text-white hover:bg-coral/90 font-bold rounded-full px-8 shadow-lg shadow-coral/25"
              >
                Browse Vendors
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/vendor/onboarding">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-black font-bold rounded-full px-8 transition-colors"
              >
                List Your Business
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
