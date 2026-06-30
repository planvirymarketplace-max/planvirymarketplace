'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { taxonomy } from '@/data/taxonomy';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function EventWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [level1, setLevel1] = useState<string | null>(null);
  const [level2, setLevel2] = useState<string | null>(null);
  const [level3, setLevel3] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);

  // Step 0 Data: All Level 2 events, grouped by Level 1
  const allEvents = useMemo(() => {
    return Object.entries(taxonomy).map(([l1Name, l2Obj]) => {
      return {
        level1: l1Name,
        events: Object.keys(l2Obj).map(l2Name => ({
          name: l2Name,
          stylesCount: Object.keys(l2Obj[l2Name]).length
        }))
      };
    });
  }, []);

  const [selectedLevel1Tab, setSelectedLevel1Tab] = useState<string>(allEvents[0]?.level1 || '');

  const handleSelectEvent = (l1: string, l2: string) => {
    setLevel1(l1);
    setLevel2(l2);
    setStep(1);
  };

  const handleSelectStyle = (l3: string) => {
    setLevel3(l3);
    if (level1 && level2) {
      setServices([...taxonomy[level1][level2][l3]]);
    }
    setStep(2);
  };

  const toggleService = (svc: string) => {
    setServices(prev =>
      prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]
    );
  };

  const handleBook = () => {
    if (!level1 || !level2 || !level3) return;
    const l1Slug = slugify(level1);
    const l2Slug = slugify(level2);
    const l3Slug = slugify(level3);

    // Navigate to the directory pre-filtered
    const query = new URLSearchParams();
    query.set('services', services.map(slugify).join(','));
    router.push(`/book/${l1Slug}/${l2Slug}/${l3Slug}?${query.toString()}`);
  };

  const activeGroup = allEvents.find(g => g.level1 === selectedLevel1Tab) || allEvents[0];

  return (
    <section className="py-24 px-6 bg-white w-full border-t border-gray-100" id="experience-wizard">
      <div className="max-w-7xl mx-auto">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">Plan Your Event</h2>
          <p className="text-xl text-gray-500">
            Select your event type, choose a style, and let us intelligently recommend the exact vendors you need. Book everything in minutes.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden shadow-sm">

          {/* Breadcrumbs Header */}
          <div className="bg-white px-8 py-5 border-b border-gray-200 flex flex-wrap gap-4 items-center text-sm font-semibold text-gray-400">
            <button
              onClick={() => step > 0 && setStep(0)}
              className={`transition-colors ${step >= 0 ? 'text-coral' : ''} ${step > 0 ? 'hover:text-coral cursor-pointer' : 'cursor-default'}`}
            >
              1. Event Type
            </button>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <button
              onClick={() => step > 1 && setStep(1)}
              className={`transition-colors ${step >= 1 ? 'text-coral' : ''} ${step > 1 ? 'hover:text-coral cursor-pointer' : 'cursor-default'}`}
            >
              2. Style
            </button>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className={`transition-colors ${step >= 2 ? 'text-coral' : ''}`}>
              3. Services
            </span>
          </div>

          <div className="p-8 md:p-12">

            {/* STEP 0: Select Event Type */}
            {step === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-black mb-8">What kind of event are you planning?</h3>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Sidebar Tabs */}
                  <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                    {allEvents.map((group, gIdx) => (
                      <button
                        key={gIdx}
                        onClick={() => setSelectedLevel1Tab(group.level1)}
                        className={`text-left px-5 py-3 rounded-xl font-semibold transition-all whitespace-nowrap md:whitespace-normal
                          ${selectedLevel1Tab === group.level1
                            ? 'bg-black text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-200 hover:text-black'
                          }`}
                      >
                        {group.level1}
                      </button>
                    ))}
                  </div>

                  {/* Right Content Area */}
                  <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">{activeGroup.level1} Events</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeGroup.events.map((ev, eIdx) => (
                        <div
                          key={eIdx}
                          onClick={() => handleSelectEvent(activeGroup.level1, ev.name)}
                          className="bg-gray-50 border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-coral hover:bg-coral/10 hover:shadow-md transition-all group"
                        >
                          <h5 className="font-bold text-black group-hover:text-coral transition-colors">{ev.name}</h5>
                          <p className="text-xs text-gray-500 mt-2">{ev.stylesCount} style{ev.stylesCount > 1 ? 's' : ''}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}


            {/* STEP 1: Select Style */}
            {step === 1 && level1 && level2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep(0)} className="text-sm font-bold text-gray-500 hover:text-black hover:underline">
                    &larr; Back
                  </button>
                  <h3 className="text-2xl font-bold text-black">Select a style for your {level2}</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(taxonomy[level1][level2]).map(([styleName, svcs], idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectStyle(styleName)}
                      className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-coral hover:shadow-md transition-all group"
                    >
                      <h5 className="font-bold text-black group-hover:text-coral transition-colors">{styleName}</h5>
                      <p className="text-xs text-gray-500 mt-2">{svcs.length} suggested services</p>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* STEP 2: Configure Services */}
            {step === 2 && level1 && level2 && level3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-500 hover:text-black hover:underline">
                    &larr; Back
                  </button>
                  <h3 className="text-2xl font-bold text-black">Customize you exactly what you need</h3>
                </div>
                <p className="text-gray-500 mb-8 max-w-2xl">
                  We&apos;ve pre-selected the most common services for a {level3} {level2}. You can add or remove services below before we find the best matching vendors.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                  {taxonomy[level1][level2][level3].map((svc, idx) => {
                    const isSelected = services.includes(svc);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleService(svc)}
                        className={`flex justify-between items-center border rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'bg-coral/10 border-coral shadow-sm' : 'bg-white border-gray-200 hover:border-teal-300'}`}
                      >
                        <span className={`font-semibold text-sm ${isSelected ? 'text-coral' : 'text-gray-700'}`}>{svc}</span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${isSelected ? 'bg-coral/100 border-coral' : 'border-gray-300 bg-gray-50'}`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Submit Block */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-teal-100 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                  <div>
                    <h4 className="text-lg font-bold text-black mb-1">Ready to find vendors?</h4>
                    <p className="text-sm text-gray-500">{services.length} services selected for your event.</p>
                  </div>
                  <button
                    onClick={handleBook}
                    className="w-full md:w-auto bg-black text-white font-bold px-10 py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    Match Me With Vendors <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
