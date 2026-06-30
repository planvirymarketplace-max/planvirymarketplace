'use client';

import { useState, useEffect } from 'react';

export interface EventType {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category_group: 'life_milestone' | 'celebration' | 'professional';
  wizard_hero_text: string;
  wizard_sub_text: string;
  budget_guidance_min: number;
  budget_guidance_max: number;
  budget_guidance_note: string;
  typical_guest_min: number;
  typical_guest_max: number;
  sort_order: number;
}

// Static fallback - hydrates instantly without a DB round-trip
export const STATIC_EVENT_TYPES: EventType[] = [
  {
    id: 'wedding',
    slug: 'wedding',
    name: 'Wedding',
    description: 'Full wedding celebration including ceremony and reception.',
    icon: 'rings',
    category_group: 'life_milestone',
    wizard_hero_text: "Let's plan your perfect Milwaukee wedding.",
    wizard_sub_text: "We'll guide you through every vendor you need, in the right order, within your budget.",
    budget_guidance_min: 20000,
    budget_guidance_max: 60000,
    budget_guidance_note: 'Milwaukee-area weddings average $32,000–$42,000',
    typical_guest_min: 50,
    typical_guest_max: 200,
    sort_order: 1,
  },
  {
    id: 'birthday_party_kids',
    slug: 'birthday_party_kids',
    name: "Kids' Birthday Party",
    description: "Birthday celebration for children ages 1–12.",
    icon: 'cake',
    category_group: 'celebration',
    wizard_hero_text: "Let's plan an amazing kids' birthday party!",
    wizard_sub_text: "Tell us about the birthday kid and we'll match you with the perfect vendors.",
    budget_guidance_min: 500,
    budget_guidance_max: 3000,
    budget_guidance_note: "Kids' parties in Milwaukee average $800–$1,800",
    typical_guest_min: 10,
    typical_guest_max: 50,
    sort_order: 2,
  },
  {
    id: 'birthday_party_adult',
    slug: 'birthday_party_adult',
    name: 'Adult Birthday Party',
    description: 'Birthday celebration for adults (18+), milestone birthdays.',
    icon: 'party-popper',
    category_group: 'celebration',
    wizard_hero_text: 'Time to celebrate - let\'s plan your birthday!',
    wizard_sub_text: 'From intimate dinners to full-blown parties, we have Milwaukee covered.',
    budget_guidance_min: 1000,
    budget_guidance_max: 8000,
    budget_guidance_note: 'Adult parties in Milwaukee average $1,500–$4,000',
    typical_guest_min: 20,
    typical_guest_max: 100,
    sort_order: 3,
  },
  {
    id: 'birthday_milestone',
    slug: 'birthday_milestone',
    name: 'Milestone Birthday',
    description: 'Milestone birthday celebration with formal elements.',
    icon: 'sparkles',
    category_group: 'celebration',
    wizard_hero_text: 'A milestone birthday deserves an unforgettable celebration.',
    wizard_sub_text: "Let's build your perfect milestone event from scratch.",
    budget_guidance_min: 2000,
    budget_guidance_max: 15000,
    budget_guidance_note: 'Milestone parties in Milwaukee average $3,500–$8,000',
    typical_guest_min: 25,
    typical_guest_max: 150,
    sort_order: 4,
  },
  {
    id: 'corporate_conference',
    slug: 'corporate_conference',
    name: 'Corporate Conference',
    description: 'Professional conference, summit, or large-scale meeting.',
    icon: 'briefcase',
    category_group: 'professional',
    wizard_hero_text: 'Plan a professional, memorable corporate conference.',
    wizard_sub_text: "From AV to catering - we have Milwaukee's best corporate vendors ready.",
    budget_guidance_min: 5000,
    budget_guidance_max: 50000,
    budget_guidance_note: 'Corporate conferences vary widely by size and scope',
    typical_guest_min: 20,
    typical_guest_max: 500,
    sort_order: 5,
  },
  {
    id: 'corporate_holiday_party',
    slug: 'corporate_holiday_party',
    name: 'Corporate Holiday Party',
    description: 'Company holiday party or employee appreciation event.',
    icon: 'gift',
    category_group: 'professional',
    wizard_hero_text: 'Plan a holiday party your team will talk about all year.',
    wizard_sub_text: 'Book venues, catering, entertainment - everything in one plan.',
    budget_guidance_min: 3000,
    budget_guidance_max: 25000,
    budget_guidance_note: 'Holiday parties in Milwaukee average $5,000–$15,000',
    typical_guest_min: 30,
    typical_guest_max: 300,
    sort_order: 6,
  },
  {
    id: 'corporate_team_offsite',
    slug: 'corporate_team_offsite',
    name: 'Team Offsite / Retreat',
    description: 'Team building, leadership offsite, or company retreat.',
    icon: 'mountain',
    category_group: 'professional',
    wizard_hero_text: 'Build a better team with a great offsite.',
    wizard_sub_text: "We'll handle the logistics so you can focus on the outcomes.",
    budget_guidance_min: 2000,
    budget_guidance_max: 20000,
    budget_guidance_note: 'Team offsites in Milwaukee average $3,000–$10,000',
    typical_guest_min: 10,
    typical_guest_max: 100,
    sort_order: 7,
  },
  {
    id: 'corporate_gala',
    slug: 'corporate_gala',
    name: 'Gala / Fundraiser',
    description: 'Black-tie gala, charity fundraiser, or awards ceremony.',
    icon: 'award',
    category_group: 'professional',
    wizard_hero_text: 'Create an elegant, impactful gala.',
    wizard_sub_text: "Milwaukee's top venues, caterers, and entertainers - all in one plan.",
    budget_guidance_min: 10000,
    budget_guidance_max: 100000,
    budget_guidance_note: 'Galas in Milwaukee average $20,000–$60,000',
    typical_guest_min: 100,
    typical_guest_max: 600,
    sort_order: 8,
  },
  {
    id: 'baby_shower',
    slug: 'baby_shower',
    name: 'Baby Shower',
    description: 'Celebration for an expectant parent.',
    icon: 'baby',
    category_group: 'celebration',
    wizard_hero_text: 'Plan a beautiful baby shower.',
    wizard_sub_text: 'Find the perfect venue, catering, and décor for your celebration.',
    budget_guidance_min: 300,
    budget_guidance_max: 2500,
    budget_guidance_note: 'Baby showers in Milwaukee average $500–$1,200',
    typical_guest_min: 10,
    typical_guest_max: 50,
    sort_order: 9,
  },
  {
    id: 'bridal_shower',
    slug: 'bridal_shower',
    name: 'Bridal Shower',
    description: 'Pre-wedding celebration for the bride.',
    icon: 'heart',
    category_group: 'celebration',
    wizard_hero_text: 'Plan an unforgettable bridal shower.',
    wizard_sub_text: 'From brunch venues to balloon arches - let\'s get started.',
    budget_guidance_min: 500,
    budget_guidance_max: 3000,
    budget_guidance_note: 'Bridal showers in Milwaukee average $700–$1,500',
    typical_guest_min: 10,
    typical_guest_max: 40,
    sort_order: 10,
  },
  {
    id: 'quinceanera',
    slug: 'quinceanera',
    name: 'Quinceañera',
    description: 'Latin coming-of-age celebration for a 15-year-old.',
    icon: 'crown',
    category_group: 'life_milestone',
    wizard_hero_text: 'Plan the most beautiful Quinceañera.',
    wizard_sub_text: "From venue to gown, music to flowers - Milwaukee's best vendors are ready.",
    budget_guidance_min: 5000,
    budget_guidance_max: 30000,
    budget_guidance_note: 'Quinceañeras in Milwaukee average $8,000–$18,000',
    typical_guest_min: 50,
    typical_guest_max: 300,
    sort_order: 11,
  },
  {
    id: 'sweet_16',
    slug: 'sweet_16',
    name: 'Sweet 16',
    description: 'Coming-of-age celebration for a 16-year-old.',
    icon: 'star',
    category_group: 'celebration',
    wizard_hero_text: 'Make this Sweet 16 unforgettable.',
    wizard_sub_text: 'DJs, venues, photographers - let\'s build the perfect party.',
    budget_guidance_min: 2000,
    budget_guidance_max: 12000,
    budget_guidance_note: 'Sweet 16 parties in Milwaukee average $3,000–$7,000',
    typical_guest_min: 30,
    typical_guest_max: 150,
    sort_order: 12,
  },
];

export function useEventTypes() {
  const [eventTypes] = useState<EventType[]>(STATIC_EVENT_TYPES);
  return { eventTypes, isLoading: false };
}

// Icon emoji map for rendering without external icon library
export const EVENT_ICON_MAP: Record<string, string> = {
  rings: '💍',
  cake: '🎂',
  'party-popper': '🎉',
  sparkles: '✨',
  briefcase: '💼',
  gift: '🎁',
  mountain: '⛺',
  award: '🏆',
  baby: '🍼',
  heart: '💕',
  crown: '👑',
  star: '⭐',
};

// Color palette per category group
export const GROUP_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  life_milestone: { bg: 'bg-stone-950', border: 'border-stone-800', badge: 'bg-stone-800 text-stone-100' },
  celebration: { bg: 'bg-stone-900', border: 'border-stone-700', badge: 'bg-stone-700 text-stone-200' },
  professional: { bg: 'bg-stone-800', border: 'border-stone-600', badge: 'bg-stone-600 text-stone-100' },
};
