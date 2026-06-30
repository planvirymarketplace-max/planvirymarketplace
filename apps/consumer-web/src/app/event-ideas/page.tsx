import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  PartyPopper,
  Heart,
  Home,
  Briefcase,
  Wand2,
  Users,
  Wine,
  Gem,
  Building2,
  Ticket,
  Trophy,
  Globe,
  Megaphone,
  Puzzle,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { eventTypes } from '@/data/taxonomy';

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'Event Ideas & Inspiration - Planviry',
  description:
    'Explore event ideas by category. From weddings and birthdays to corporate events and festivals - find inspiration and start planning your next event on Planviry.',
  openGraph: {
    title: 'Event Ideas & Inspiration - Planviry',
    description:
      'Explore event ideas by category. From weddings and birthdays to corporate events and festivals - find inspiration and start planning your next event on Planviry.',
  },
};

/* ── Map group IDs to icons ──────────────────────────────────────── */
const GROUP_ICONS: Record<string, React.ElementType> = {
  'social-casual': PartyPopper,
  'milestone-life': Heart,
  'home-seasonal': Home,
  'professional-networking': Briefcase,
  'specialty-themed': Wand2,
  'large-scale-public': Users,
  'drinks-focused': Wine,
  'weddings-milestone': Gem,
  'corporate-professional': Building2,
  'entertainment-cultural': Ticket,
  'sports-outdoor': Trophy,
  'public-events': Globe,
  'fundraising-charity': Heart,
  'travel-destination': Globe,
  'promotional': Megaphone,
  'niche': Puzzle,
};

/* ── Popular quick-links (first 6 groups) ────────────────────────── */
const POPULAR_CATEGORIES = eventTypes.slice(0, 6);

export default function EventIdeasPage() {
  return (
    <div className="bg-white">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-coral)_0%,_transparent_55%)] opacity-15" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <Badge className="mb-4 bg-coral/20 text-coral border-coral/30 hover:bg-coral/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Explore
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Event Ideas &amp; Inspiration
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Not sure where to start? Browse ideas by event type, discover vendors,
            and plan something unforgettable.
          </p>
          <Link href="/book">
            <Button
              size="lg"
              className="bg-coral text-white hover:bg-coral/90 font-bold rounded-full px-8 shadow-lg shadow-coral/25"
            >
              Start Planning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Quick Links ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground mr-2">Popular:</span>
          {POPULAR_CATEGORIES.map((group) => {
            const Icon = GROUP_ICONS[group.id] || Sparkles;
            return (
              <Link
                key={group.id}
                href={`#${group.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-coral hover:text-coral transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
                {group.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Event Type Groups Grid ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="space-y-12">
          {eventTypes.map((group) => {
            const Icon = GROUP_ICONS[group.id] || Sparkles;
            return <AppLayoutShell>
              <div key={group.id} id={group.id} className="scroll-mt-24">
                <Card className="border border-gray-200 hover:border-coral/40 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-coral" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {group.subcategories.length} event type{group.subcategories.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {group.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/book?type=${group.id}&sub=${encodeURIComponent(sub)}`}
                          className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-coral/10 hover:text-coral transition-colors"
                        >
                          {sub}
                          <ChevronRight className="w-3 h-3 opacity-40" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AppLayoutShell>

          })}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Found Your Event Type?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
            Start planning your event today. Search vendors, compare prices, and
            book everything in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book">
              <Button
                size="lg"
                className="bg-coral text-white hover:bg-coral/90 font-bold rounded-full px-8 shadow-lg shadow-coral/25"
              >
                Start Planning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/vendor/onboarding">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-black font-bold rounded-full px-8 transition-colors"
              >
                List Your Business Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
