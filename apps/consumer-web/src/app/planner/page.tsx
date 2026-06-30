'use client';
import { AppLayoutShell } from '@/components/AppLayoutShell'

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckSquare,
  Users,
  DollarSign,
  Radio,
  LayoutTemplate,
  Heart,
  Briefcase,
  Cake,
  GraduationCap,
  Gift,
  Baby,
  ArrowRight,
  Sparkles,
  Plus,
  Calendar,
  MapPin,
  Trash2,
  ExternalLink,
  Star,
  Store,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import { taxonomy, eventTypes, serviceCategories } from '@/data/taxonomy';

/* ── 6 Feature Cards ────────────────────────────────────────────── */
const PLANNER_FEATURES = [
  {
    icon: Clock,
    title: 'Smart Timeline',
    description:
      'Auto-generate a planning timeline based on your event date. Never miss a deadline.',
  },
  {
    icon: CheckSquare,
    title: 'Vendor Checklist',
    description:
      'Track every vendor from inquiry to contract. See who\'s confirmed at a glance.',
  },
  {
    icon: Users,
    title: 'Guest Management',
    description:
      'Send invites, track RSVPs, manage seating charts, and dietary needs all in one place.',
  },
  {
    icon: DollarSign,
    title: 'Budget Tracker',
    description:
      'Set budgets by category, log payments, and get alerts before you overspend.',
  },
  {
    icon: Radio,
    title: 'Day-Of Coordination',
    description:
      'A live run-of-show timeline with real-time updates for your coordination team.',
  },
  {
    icon: LayoutTemplate,
    title: 'Event Templates',
    description:
      'Start with curated templates for weddings, corporate events, birthdays, and more.',
  },
];

/* ── 6 Event Templates ──────────────────────────────────────────── */
const EVENT_TEMPLATES = [
  {
    icon: Heart,
    name: 'Wedding',
    slug: 'wedding',
    vendorCount: 14,
    description: 'Full-service wedding planning from engagement to reception.',
    defaultBudget: 30000,
    tasks: ['Book venue', 'Hire photographer', 'Find caterer', 'Order flowers', 'Book DJ/band', 'Send invitations', 'Plan ceremony', 'Schedule rehearsal', 'Book officiant', 'Arrange transportation', 'Plan reception', 'Order wedding cake', 'Book hair & makeup', 'Final walkthrough'],
    // Taxonomy mapping: occasion → eventType
    taxonomyOccasion: 'Weddings & Ceremonies',
    taxonomyEvent: 'Wedding Ceremony + Reception',
  },
  {
    icon: Briefcase,
    name: 'Corporate Event',
    slug: 'corporate',
    vendorCount: 8,
    description: 'Conferences, galas, team-building, and product launches.',
    defaultBudget: 15000,
    tasks: ['Book venue', 'Arrange A/V equipment', 'Hire caterer', 'Send invitations', 'Plan agenda', 'Book keynote speaker', 'Arrange signage', 'Coordinate day-of logistics'],
    taxonomyOccasion: 'Corporate Events',
    taxonomyEvent: 'Conference',
  },
  {
    icon: Cake,
    name: 'Birthday Party',
    slug: 'birthday',
    vendorCount: 6,
    description: 'Kids, milestone birthdays, surprise parties, and themed events.',
    defaultBudget: 3000,
    tasks: ['Book venue', 'Order cake', 'Hire entertainment', 'Send invitations', 'Plan decorations', 'Arrange food & drinks'],
    taxonomyOccasion: 'Social & Casual',
    taxonomyEvent: 'Birthday Party',
  },
  {
    icon: GraduationCap,
    name: 'Graduation',
    slug: 'graduation',
    vendorCount: 5,
    description: 'High school, college, and grad school celebrations.',
    defaultBudget: 2500,
    tasks: ['Book venue', 'Send invitations', 'Arrange catering', 'Plan decorations', 'Book photographer'],
    taxonomyOccasion: 'Milestone & Life Events',
    taxonomyEvent: 'Graduation Party',
  },
  {
    icon: Gift,
    name: 'Anniversary',
    slug: 'anniversary',
    vendorCount: 7,
    description: 'From intimate dinners to large-scale vow renewals.',
    defaultBudget: 5000,
    tasks: ['Book restaurant/venue', 'Arrange flowers', 'Book photographer', 'Plan dinner menu', 'Send invitations', 'Arrange music', 'Plan surprise elements'],
    taxonomyOccasion: 'Milestone & Life Events',
    taxonomyEvent: 'Anniversary Party',
  },
  {
    icon: Baby,
    name: 'Baby Shower',
    slug: 'baby-shower',
    vendorCount: 5,
    description: 'Traditional, co-ed, and virtual baby shower templates.',
    defaultBudget: 2000,
    tasks: ['Book venue', 'Send invitations', 'Plan games', 'Order cake', 'Arrange decorations'],
    taxonomyOccasion: 'Milestone & Life Events',
    taxonomyEvent: 'Baby Shower',
  },
];

/* ── FAQ Items ───────────────────────────────────────────────────── */
const PLANNER_FAQS = [
  {
    question: 'Is the Event Planner free to use?',
    answer:
      'Yes! The core planner features, timeline, checklist, and guest list, are completely free. Premium features like day-of coordination tools and advanced budget analytics will be available with a Pro plan.',
  },
  {
    question: 'Can I collaborate with my co-planner or partner?',
    answer:
      'Absolutely. You can invite collaborators to any event. Each person gets their own view, and changes sync in real time.',
  },
  {
    question: 'Does the planner integrate with vendor bookings?',
    answer:
      'Yes. When you book a vendor on Planviry, they automatically appear in your planner timeline and checklist. You can also add vendors manually.',
  },
  {
    question: 'Can I customize the event templates?',
    answer:
      'Every template is fully customizable. Start with a template and add, remove, or reorder tasks, vendors, and milestones to fit your exact needs.',
  },
  {
    question: 'What types of events does the planner support?',
    answer:
      'We support weddings, corporate events, birthdays, graduations, anniversaries, baby showers, and many more. If you don\'t see your event type, you can start from scratch with a blank planner.',
  },
];

/* ── Service-to-Category Mapping ─────────────────────────────────── */
// Maps taxonomy service names to category slugs for /book?cat= links
const SERVICE_CATEGORY_MAP: Record<string, string> = {};
(function buildMap() {
  for (const cat of serviceCategories) {
    for (const sub of cat.subcategories) {
      // Map the subcategory name to the category id
      SERVICE_CATEGORY_MAP[sub.toLowerCase()] = cat.id;
    }
  }
  // Also map generic/short names used in taxonomy
  const extraMappings: Record<string, string> = {
    'venue': 'venues-spaces',
    'catering': 'catering-food',
    'cake': 'catering-food',
    'dj': 'entertainment',
    'latin music dj': 'entertainment',
    'decorations': 'decor-rentals',
    'party characters': 'entertainment',
    'bounce house': 'decor-rentals',
    'bounce house rentals': 'decor-rentals',
    'photo booth': 'production-tech',
    'photo booths': 'production-tech',
    'party favors': 'decor-rentals',
    'party supplies': 'decor-rentals',
    'party supplies & favors': 'decor-rentals',
    'face painters': 'entertainment',
    'balloon artists': 'decor-rentals',
    'balloon services': 'decor-rentals',
    'balloon artists & installations': 'decor-rentals',
    'bartending': 'catering-food',
    'bartending services': 'catering-food',
    'photography': 'production-tech',
    'videography': 'production-tech',
    'florist': 'decor-rentals',
    'florists & floral designers': 'decor-rentals',
    'lighting & stage production': 'production-tech',
    'furniture & linen rentals': 'decor-rentals',
    'tent & outdoor rentals': 'decor-rentals',
    'transportation': 'travel-lodging',
    'transportation services': 'travel-lodging',
    'stationery': 'decor-rentals',
    'stationery, invitations & signage': 'decor-rentals',
    'officiant': 'event-planning',
    'officiants': 'event-planning',
    'day-of coordinator': 'event-planning',
    'hair & makeup': 'beauty-attire',
    'hair & makeup artists': 'beauty-attire',
    'makeup artists': 'beauty-attire',
    'attire': 'beauty-attire',
    'hotel room blocks': 'travel-lodging',
    'hotels & resorts': 'travel-lodging',
    'lodging': 'travel-lodging',
    'travel agency': 'travel-lodging',
    'destination wedding planners': 'event-planning',
    'wedding planners': 'event-planning',
    'event planners': 'event-planning',
    'full-service event planners': 'event-planning',
    'av & sound technicians': 'production-tech',
    'security': 'event-planning',
    'medical services': 'event-planning',
    'lawn games': 'decor-rentals',
    'game rentals': 'decor-rentals',
    'live band': 'entertainment',
    'live bands': 'entertainment',
    'live bands & musicians': 'entertainment',
    'concert promotion services': 'entertainment',
    'vow renewal officiant': 'event-planning',
    'private chef': 'catering-food',
    'private chefs': 'catering-food',
    'karaoke host': 'entertainment',
    'karaoke hosts (kjs)': 'entertainment',
    'trivia host': 'entertainment',
    'red carpet services': 'decor-rentals',
    'fire dancers': 'entertainment',
    'paint & sip': 'entertainment',
    'interactive experiences': 'entertainment',
    'auctioneer services': 'event-planning',
    'auction services': 'event-planning',
    'permitting assistance': 'event-planning',
    'ticket services': 'live-events-tickets',
    'porta-potty rentals': 'decor-rentals',
    'parking & transportation': 'travel-lodging',
    'wi-fi services': 'production-tech',
    'team building experiences': 'entertainment',
    'activity vendor': 'entertainment',
    'coat check': 'event-planning',
    'lifeguard': 'event-planning',
    'jewelry': 'beauty-attire',
    'wine, beer & spirits services': 'catering-food',
    'rehearsal dinner venues': 'venues-spaces',
    'restaurants with private dining': 'venues-spaces',
    'food trucks': 'catering-food',
    'bakeries & desserts': 'catering-food',
    'bottomless brunch services': 'catering-food',
    'magicians & illusionists': 'entertainment',
    'comedians': 'entertainment',
    'drone photography & videography': 'production-tech',
    'camera & equipment rental': 'production-tech',
    'tailors & alterations': 'beauty-attire',
    'wardrobe stylists': 'beauty-attire',
    'vacation rentals': 'travel-lodging',
    'group room blocks': 'travel-lodging',
  };
  for (const [key, val] of Object.entries(extraMappings)) {
    SERVICE_CATEGORY_MAP[key] = val;
  }
})();

function getCategorySlug(serviceName: string): string {
  return SERVICE_CATEGORY_MAP[serviceName.toLowerCase()] || 'event-planning';
}

/* ── Get subtypes for a given template ───────────────────────────── */
function getSubtypesForTemplate(templateSlug: string): { occasion: string; eventType: string; subtypes: string[] } | null {
  const template = EVENT_TEMPLATES.find(t => t.slug === templateSlug);
  if (!template) return null;
  const occasion = template.taxonomyOccasion;
  const eventType = template.taxonomyEvent;
  const occasionData = taxonomy[occasion];
  if (!occasionData) return null;
  const eventData = occasionData[eventType];
  if (!eventData) return null;
  return { occasion, eventType, subtypes: Object.keys(eventData) };
}

/* ── Get required services from taxonomy ─────────────────────────── */
interface ServiceItem {
  name: string;
  categorySlug: string;
  required: boolean;
}

function getServicesForSubtype(occasion: string, eventType: string, subtype: string): ServiceItem[] {
  const occasionData = taxonomy[occasion];
  if (!occasionData) return [];
  const eventData = occasionData[eventType];
  if (!eventData) return [];
  const services = eventData[subtype];
  if (!services) return [];
  return services.map(s => ({
    name: s,
    categorySlug: getCategorySlug(s),
    required: true,
  }));
}

/* ── Planner State ──────────────────────────────────────────────── */
interface PlannerEvent {
  id: string;
  name: string;
  templateSlug: string;
  date: string;
  location: string;
  budget: number;
  tasks: { text: string; done: boolean }[];
  services: ServiceItem[];
  // Taxonomy info
  taxonomyOccasion: string;
  taxonomyEvent: string;
  taxonomySubtype: string;
}

export default function PlannerPage() {
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventBudget, setNewEventBudget] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('wedding');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');

  const activeEvent = events.find(e => e.id === activeEventId) ?? null;

  // Get subtypes for currently selected template
  const subtypeInfo = useMemo(() => getSubtypesForTemplate(selectedTemplate), [selectedTemplate]);

  // Resolve the effective subtype: if user hasn't selected one, use the first available
  const effectiveSubtype = useMemo(() => {
    if (selectedSubtype && subtypeInfo?.subtypes.includes(selectedSubtype)) return selectedSubtype;
    return subtypeInfo?.subtypes[0] ?? '';
  }, [selectedSubtype, subtypeInfo]);

  // Get preview services for current subtype selection
  const previewServices = useMemo(() => {
    if (!effectiveSubtype || !subtypeInfo) return [];
    return getServicesForSubtype(subtypeInfo.occasion, subtypeInfo.eventType, effectiveSubtype);
  }, [effectiveSubtype, subtypeInfo]);

  // When template changes, clear subtype so effectiveSubtype resets to first
  function handleTemplateChange(slug: string) {
    setSelectedTemplate(slug);
    setSelectedSubtype(''); // Will auto-resolve to first subtype via effectiveSubtype
  }

  function createEvent() {
    const template = EVENT_TEMPLATES.find(t => t.slug === selectedTemplate) ?? EVENT_TEMPLATES[0];
    const id = `evt-${Date.now()}`;

    // Get services from taxonomy
    let services: ServiceItem[] = [];
    if (effectiveSubtype && subtypeInfo) {
      services = getServicesForSubtype(subtypeInfo.occasion, subtypeInfo.eventType, effectiveSubtype);
    }

    const newEvent: PlannerEvent = {
      id,
      name: newEventName || template.name,
      templateSlug: template.slug,
      date: newEventDate,
      location: newEventLocation,
      budget: Number(newEventBudget) || template.defaultBudget,
      tasks: template.tasks.map(t => ({ text: t, done: false })),
      services,
      taxonomyOccasion: template.taxonomyOccasion,
      taxonomyEvent: template.taxonomyEvent,
      taxonomySubtype: effectiveSubtype,
    };
    setEvents(prev => [...prev, newEvent]);
    setActiveEventId(id);
    setShowNewEvent(false);
    setNewEventName('');
    setNewEventDate('');
    setNewEventLocation('');
    setNewEventBudget('');
    toast.success(`"${newEvent.name}" created with ${services.length} required services!`);
  }

  function toggleTask(eventId: string, taskIndex: number) {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const tasks = [...e.tasks];
      tasks[taskIndex] = { ...tasks[taskIndex], done: !tasks[taskIndex].done };
      return { ...e, tasks };
    }));
  }

  function addTask(eventId: string, text: string) {
    if (!text.trim()) return;
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      return { ...e, tasks: [...e.tasks, { text, done: false }] };
    }));
  }

  function removeTask(eventId: string, taskIndex: number) {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const tasks = e.tasks.filter((_, i) => i !== taskIndex);
      return { ...e, tasks };
    }));
  }

  function addService(eventId: string, serviceName: string) {
    if (!serviceName.trim()) return;
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      // Don't add duplicates
      if (e.services.some(s => s.name.toLowerCase() === serviceName.toLowerCase())) {
        return e;
      }
      return {
        ...e,
        services: [...e.services, {
          name: serviceName,
          categorySlug: getCategorySlug(serviceName),
          required: false,
        }],
      };
    }));
    toast.success(`"${serviceName}" added to your service list`);
  }

  function removeService(eventId: string, serviceIndex: number) {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const services = e.services.filter((_, i) => i !== serviceIndex);
      return { ...e, services };
    }));
  }

  function deleteEvent(eventId: string) {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    if (activeEventId === eventId) setActiveEventId(null);
    toast.success('Event deleted.');
  }

  const completedTasks = activeEvent ? activeEvent.tasks.filter(t => t.done).length : 0;
  const totalTasks = activeEvent ? activeEvent.tasks.length : 0;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Category slug to display name mapping
  const categoryDisplayNames: Record<string, string> = {
    'venues-spaces': 'Venues & Spaces',
    'event-planning': 'Event Planning',
    'catering-food': 'Catering & Food',
    'entertainment': 'Entertainment',
    'production-tech': 'Production & Tech',
    'decor-rentals': 'Decor & Rentals',
    'beauty-attire': 'Beauty & Attire',
    'travel-lodging': 'Travel & Lodging',
    'live-events-tickets': 'Live Events & Tickets',
  };

  // Group services by category for the active event
  const servicesByCategory = useMemo(() => {
    if (!activeEvent) return {};
    const grouped: Record<string, ServiceItem[]> = {};
    for (const svc of activeEvent.services) {
      const cat = svc.categorySlug;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(svc);
    }
    return grouped;
  }, [activeEvent]);

  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-coral)_0%,_transparent_60%)] opacity-20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Event Planner
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Plan Your Event
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Your all-in-one toolkit to plan, coordinate, and execute every detail
            of your event, from timeline to budget to day-of logistics.
          </p>
          <Button
            size="lg"
            onClick={() => setShowNewEvent(true)}
            className="bg-coral text-white hover:bg-coral/90 font-bold rounded-full px-8 shadow-lg shadow-coral/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Event
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* ── New Event Form ────────────────────────────────────────── */}
      {showNewEvent && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Card className="border-2 border-coral/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create Your Event</CardTitle>
              <CardDescription>Choose a template and customize your event details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-3 block">1. Event Template</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {EVENT_TEMPLATES.map((tpl) => {
                    const Icon = tpl.icon;
                    return (
                      <button
                        key={tpl.slug}
                        onClick={() => handleTemplateChange(tpl.slug)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                          selectedTemplate === tpl.slug
                            ? 'border-coral bg-coral/5 text-coral'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-sm font-bold">{tpl.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subtype Selection */}
              {subtypeInfo && subtypeInfo.subtypes.length > 0 && (
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 block">2. Event Subtype</label>
                  <p className="text-xs text-gray-500 mb-3">
                    Select the specific type to auto-load recommended vendors from our taxonomy
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {subtypeInfo.subtypes.map((subtype) => (
                      <button
                        key={subtype}
                        onClick={() => setSelectedSubtype(subtype)}
                        className={`text-left p-3 rounded-lg border-2 transition-all ${
                          effectiveSubtype === subtype
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <span className="text-sm font-semibold">{subtype}</span>
                        {effectiveSubtype === subtype && previewServices.length > 0 && (
                          <span className="ml-2 text-[10px] font-bold text-teal-500 bg-teal-100 px-1.5 py-0.5 rounded-full">
                            {previewServices.length} services
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Preview */}
              {effectiveSubtype && previewServices.length > 0 && (
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Store className="w-4 h-4 text-coral" />
                    Required Services Preview
                  </label>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex flex-wrap gap-2">
                      {previewServices.map((svc) => (
                        <Link
                          key={svc.name}
                          href={`/book?cat=${svc.categorySlug}&q=${encodeURIComponent(svc.name)}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:border-coral hover:text-coral transition-colors"
                        >
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {svc.name}
                          <ExternalLink className="w-2.5 h-2.5 opacity-40" />
                        </Link>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      = Required service · Click any service to find vendors
                    </p>
                  </div>
                </div>
              )}

              {/* Event Details */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-3 block">
                  {effectiveSubtype ? '3' : '2'}. Event Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Event Name</label>
                    <Input
                      placeholder={EVENT_TEMPLATES.find(t => t.slug === selectedTemplate)?.name ?? 'My Event'}
                      value={newEventName}
                      onChange={(e) => setNewEventName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Event Date</label>
                    <Input
                      type="date"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Location</label>
                    <Input
                      placeholder="City, State"
                      value={newEventLocation}
                      onChange={(e) => setNewEventLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Budget ($)</label>
                    <Input
                      type="number"
                      placeholder={String(EVENT_TEMPLATES.find(t => t.slug === selectedTemplate)?.defaultBudget ?? 5000)}
                      value={newEventBudget}
                      onChange={(e) => setNewEventBudget(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={createEvent}
                  className="bg-coral text-white hover:bg-coral/90 font-bold rounded-full px-8"
                >
                  Create Event
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewEvent(false)}
                  className="rounded-full px-8"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── Event Dashboard ───────────────────────────────────────── */}
      {events.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar - Event List */}
            <div className="lg:w-72 shrink-0">
              <div className="sticky top-24 space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Your Events</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNewEvent(true)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {events.map(event => {
                  const template = EVENT_TEMPLATES.find(t => t.slug === event.templateSlug);
                  const Icon = template?.icon ?? Calendar;
                  const done = event.tasks.filter(t => t.done).length;
                  const total = event.tasks.length;
                  return (
                    <button
                      key={event.id}
                      onClick={() => setActiveEventId(event.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        activeEventId === event.id
                          ? 'border-coral bg-coral/5'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-coral shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm truncate">{event.name}</p>
                          <p className="text-xs text-gray-500">{done}/{total} tasks · {event.services.length} services</p>
                          {event.taxonomySubtype && (
                            <p className="text-[10px] text-teal-600 font-medium mt-0.5 truncate">{event.taxonomySubtype}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content - Active Event */}
            {activeEvent && (
              <div className="flex-1 space-y-8">
                {/* Event Header */}
                <div className="bg-black text-white rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">{activeEvent.name}</h2>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-white/60">
                        {activeEvent.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {activeEvent.date}
                          </span>
                        )}
                        {activeEvent.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {activeEvent.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" /> ${activeEvent.budget.toLocaleString()}
                        </span>
                      </div>
                      {activeEvent.taxonomySubtype && (
                        <div className="mt-2">
                          <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-xs">
                            {activeEvent.taxonomySubtype}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEvent(activeEvent.id)}
                      className="border-white/30 text-white/60 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white/60">Progress</span>
                      <span className="font-bold">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5">
                      <div
                        className="bg-coral h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tasks & Services Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Tasks */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-coral" />
                        Task Checklist
                        <Badge variant="outline" className="ml-auto text-xs">
                          {completedTasks}/{totalTasks}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                        {activeEvent.tasks.map((task, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              task.done ? 'bg-green-50' : 'bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={task.done}
                              onChange={() => toggleTask(activeEvent.id, i)}
                              className="accent-coral w-4 h-4 shrink-0"
                            />
                            <span className={`flex-1 text-sm ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                              {task.text}
                            </span>
                            <button
                              onClick={() => removeTask(activeEvent.id, i)}
                              className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <AddItemForm
                        placeholder="Add a task..."
                        onAdd={(text) => addTask(activeEvent.id, text)}
                      />
                    </CardContent>
                  </Card>

                  {/* Services / Vendors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Store className="w-5 h-5 text-coral" />
                        Required Services
                        <Badge variant="outline" className="ml-auto text-xs">
                          {activeEvent.services.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeEvent.services.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <Store className="w-10 h-10 mx-auto mb-3 opacity-40" />
                          <p className="text-sm">No services added yet</p>
                          <p className="text-xs text-gray-300 mt-1">Add services manually or select a subtype when creating your event</p>
                          <Link
                            href="/vendors"
                            className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-coral hover:underline"
                          >
                            Browse Vendors <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                          {Object.entries(servicesByCategory).map(([catSlug, services]) => (
                            <div key={catSlug}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                  {categoryDisplayNames[catSlug] || catSlug.replace(/-/g, ' ')}
                                </span>
                                <div className="flex-1 h-px bg-gray-100" />
                              </div>
                              <div className="space-y-1.5">
                                {services.map((svc, svcIdx) => {
                                  const globalIdx = activeEvent.services.findIndex(
                                    s => s.name === svc.name && s.categorySlug === svc.categorySlug && s.required === svc.required
                                  );
                                  return (
                                    <div
                                      key={`${svc.name}-${svcIdx}`}
                                      className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                                    >
                                      {svc.required ? (
                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                                      ) : (
                                        <Plus className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                                      )}
                                      <Link
                                        href={`/book?cat=${svc.categorySlug}&q=${encodeURIComponent(svc.name)}`}
                                        className="flex-1 text-sm text-gray-700 hover:text-coral font-medium transition-colors truncate"
                                      >
                                        {svc.name}
                                      </Link>
                                      <Link
                                        href={`/book?cat=${svc.categorySlug}&q=${encodeURIComponent(svc.name)}`}
                                        className="opacity-0 group-hover:opacity-100 text-coral transition-opacity shrink-0"
                                        title="Find vendors"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </Link>
                                      <button
                                        onClick={() => removeService(activeEvent.id, globalIdx)}
                                        className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Required
                          </span>
                          <span className="flex items-center gap-1">
                            <Plus className="w-3 h-3 text-teal-500" /> Optional / Added
                          </span>
                        </div>
                      </div>
                      <AddItemForm
                        placeholder="Add a service (e.g. Photographer)..."
                        onAdd={(text) => addService(activeEvent.id, text)}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* No active event selected */}
            {events.length > 0 && !activeEvent && (
              <div className="flex-1 flex items-center justify-center py-20">
                <div className="text-center text-gray-400">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Select an event to manage</p>
                  <p className="text-sm mt-1">Choose from the sidebar or create a new event</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Empty State ───────────────────────────────────────────── */}
      {events.length === 0 && !showNewEvent && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <Calendar className="w-20 h-20 mx-auto mb-6 text-coral/30" />
          <h2 className="text-2xl font-bold mb-3">No events yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Create your first event to start planning. Choose from our templates or start from scratch.
          </p>
          <Button
            size="lg"
            onClick={() => setShowNewEvent(true)}
            className="bg-coral text-white hover:bg-coral/90 font-bold rounded-full px-8"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Event
          </Button>
        </section>
      )}

      {/* ── Feature Cards ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Everything You Need to Plan
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Six powerful tools to keep your event on track from first idea to final toast.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANNER_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group transition-all duration-300 border border-gray-200 hover:border-coral hover:shadow-lg cursor-default"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center mb-2 group-hover:bg-coral/20 transition-colors">
                    <Icon className="w-6 h-6 text-coral" />
                  </div>
                  <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about the Planviry Event Planner.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {PLANNER_FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`planner-faq-${i}`}>
              <AccordionTrigger className="text-left font-semibold hover:text-coral transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Start Planning?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
            Create your event now and start organizing every detail: timeline, vendors, budget, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setShowNewEvent(true)}
              className="bg-coral text-white hover:bg-coral/90 font-bold rounded-full px-8 shadow-lg shadow-coral/25"
            >
              Start Planning Your Event
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
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

/* ── Helper: Add Item Form ───────────────────────────────────────── */
function AddItemForm({ placeholder, onAdd }: { placeholder: string; onAdd: (text: string) => void }) {
  const [value, setValue] = useState('');
  return <AppLayoutShell>
    <form
      onSubmit={(e) => { e.preventDefault(); onAdd(value); setValue(''); }}
      className="flex gap-2 mt-4 pt-4 border-t border-gray-100"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-sm"
      />
      <Button type="submit" size="sm" className="bg-coral text-white hover:bg-coral/90 rounded-lg px-4 shrink-0">
        <Plus className="w-4 h-4" />
      </Button>
    </form>
  </AppLayoutShell>

}
