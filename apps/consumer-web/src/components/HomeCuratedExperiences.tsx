'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

const experiences = [
  {
    slug: 'perfect-micro-wedding',
    title: 'The Perfect Micro-Wedding',
    src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    desc: 'An intimate, highly-stylized ceremony and reception perfectly scoped for under 50 guests. Focus is on quality over quantity, featuring a premium curated menu, fine art photography, and breathtaking floral installations.',
    inclusions: ['Private Estate Venue', 'Fine Dining Catering', 'Film Photographer', 'Custom Florals', 'String Quartet'],
  },
  {
    slug: 'corporate-retreat',
    title: 'Ultimate Corporate Retreat',
    src: 'https://images.unsplash.com/photo-1511795409834-432f7b1728d2?auto=format&fit=crop&q=80&w=800',
    desc: 'A full-weekend event that balances intensive strategy sessions with premium leisure. We handle complex logistics including multi-location transit, dietary preferences, and A/V staging.',
    inclusions: ['Boutique Hotel Buyout', 'Executive Transport', 'A/V Production', 'Keynote Speakers', 'Private Chef'],
  },
  {
    slug: 'milestone-birthday',
    title: 'Midnight Gala Birthday',
    src: 'https://images.unsplash.com/photo-1530103862676-de8892bc952f?auto=format&fit=crop&q=80&w=800',
    desc: 'A high-energy, sophisticated celebration featuring club-quality sound engineering, master mixologists, and dramatic lighting design for an unforgettable night.',
    inclusions: ['Rooftop Venue', 'Mixologists', 'Live DJ', 'Interactive Performers', 'Lighting & Stage'],
  },
];

export default function HomeCuratedExperiences() {
  const router = useRouter();

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-[#0a0a0a] text-white border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">

        {/* Sticky Sidebar */}
        <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit">
          <span className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 block">
            The Planviry Collection
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Curated <br />
            <span className="text-gray-500 text-2xl sm:text-3xl md:text-4xl">Events</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-10 text-sm sm:text-base">
            Book complete, pre-packaged events designed by master producers. From micro-weddings to corporate offsites, each curation automatically secures the finest vendors in a single checkout flow.
          </p>
          <Link
            href="/experiences"
            className="group flex items-center justify-between w-full max-w-sm border border-white/20 hover:border-white p-4 rounded-xl transition-all"
          >
            <span className="font-bold tracking-wide text-sm">Explore All Curations</span>
            <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
              &rarr;
            </span>
          </Link>
        </div>

        {/* Scrollable Stack */}
        <div className="lg:w-2/3 flex flex-col gap-8 sm:gap-10">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              onClick={() => router.push(`/experiences/${exp.slug}`)}
              className="group cursor-pointer rounded-2xl sm:rounded-[2rem] overflow-hidden bg-white text-black border border-transparent hover:border-gray-300 flex flex-col md:flex-row shadow-2xl transition-all duration-500"
            >
              <div className="md:w-5/12 h-56 sm:h-64 md:h-auto relative overflow-hidden shrink-0">
                <img
                  src={exp.src}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 group-hover:rotate-1 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white">
                <div>
                  <h3 className="font-bold text-xl sm:text-2xl mb-4 leading-tight">{exp.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 sm:mb-8">{exp.desc}</p>

                  <div className="space-y-3">
                    <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">
                      Secured Vendors
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {exp.inclusions.map((item, i) => (
                        <span
                          key={i}
                          className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
