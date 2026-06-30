'use client';

import { Building, ClipboardList, Utensils, Music, Video, Tent, Scissors, Plane, Ticket, Compass, Sparkles, LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { categories } from '@/data/categories';

const categoryIcons: Record<string, LucideIcon> = {
  'venues-spaces': Building,
  'event-planning-services': ClipboardList,
  'catering-food': Utensils,
  'entertainment': Music,
  'production-tech': Video,
  'decor-rentals': Tent,
  'beauty-attire': Scissors,
  'travel-lodging': Plane,
  'live-events-tickets': Ticket,
  'experiences-activities': Sparkles,
};

export default function CategoryGrid() {
  const router = useRouter();

  return (
    <section className="py-20 px-6 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-black mb-10">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Building;
            return (
              <div
                key={cat.slug}
                onClick={() => router.push(`/categories/${cat.slug}`)}
                className="group cursor-pointer border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-teal-100 transition-all text-center flex flex-col items-center justify-center bg-gray-50 hover:bg-white"
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform group-hover:text-teal-500 text-black">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-black text-sm">{cat.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
