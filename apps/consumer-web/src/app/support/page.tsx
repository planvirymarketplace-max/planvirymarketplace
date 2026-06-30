import { AppLayoutShell } from '@/components/AppLayoutShell'
import type { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SupportContent } from './support-content';

export const metadata: Metadata = {
  title: 'Help & Support - Planviry',
  description:
    'Get help with bookings, payments, vendor listings, and account issues. Find answers to frequently asked questions or contact Planviry support.',
  openGraph: {
    title: 'Help & Support - Planviry',
    description:
      'Get help with bookings, payments, vendor listings, and account issues. Find answers to frequently asked questions or contact Planviry support.',
  },
};

export default function SupportPage() {
  return <AppLayoutShell>
    <div className="bg-white">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-coral)_0%,_transparent_55%)] opacity-15" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <Badge className="mb-4 bg-coral/20 text-coral border-coral/30 hover:bg-coral/30">
            <HelpCircle className="w-3 h-3 mr-1" />
            Support
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            How Can We Help?
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Find answers to common questions about bookings, payments, vendor
            listings, and your account.
          </p>
        </div>
      </section>

      {/* ── Client-side interactive content (search + accordion + contact + CTA) ── */}
      <SupportContent />
    </div>
  </AppLayoutShell>

}
