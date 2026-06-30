'use client';

import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react';
import { getFiltersForCategory } from '@/data/filterSchemas';
import type { FilterDefinition, FilterUiType } from '@/data/filterSchemas';

interface CategoryFilterSidebarProps {
  l1Slug: string;
  l2Slug?: string;
  l3Slug?: string;
  l4Slug?: string;
}

export default function CategoryFilterSidebar({ l1Slug, l2Slug, l3Slug, l4Slug }: CategoryFilterSidebarProps) {
  const filters = getFiltersForCategory(l1Slug, l2Slug, l3Slug, l4Slug);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => new Set(filters.slice(0, 5).map(f => f.slug)));
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  if (filters.length === 0) return null;

  const toggleSection = (slug: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleOption = (filterSlug: string, option: string) => {
    setActiveFilters(prev => {
      const current = prev[filterSlug] ?? [];
      const next = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];
      return { ...prev, [filterSlug]: next };
    });
  };

  const toggleBoolean = (filterSlug: string) => {
    setActiveFilters(prev => {
      const current = prev[filterSlug] ?? [];
      const next = current.length > 0 ? [] : ['yes'];
      return { ...prev, [filterSlug]: next };
    });
  };

  const clearAll = () => setActiveFilters({});

  const activeCount = Object.values(activeFilters).filter(a => a.length > 0).length;

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="sticky top-24 space-y-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </h3>
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-xs text-teal-600 font-semibold hover:underline">
              Clear all ({activeCount})
            </button>
          )}
        </div>

        {/* Filter Sections */}
        <div className="space-y-0 max-h-[70vh] overflow-y-auto pr-1">
          {filters.map((filter) => (
            <FilterSection
              key={filter.slug}
              filter={filter}
              isExpanded={expandedSections.has(filter.slug)}
              onToggle={() => toggleSection(filter.slug)}
              activeOptions={activeFilters[filter.slug] ?? []}
              onToggleOption={(opt) => toggleOption(filter.slug, opt)}
              onToggleBoolean={() => toggleBoolean(filter.slug)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

function FilterSection({
  filter,
  isExpanded,
  onToggle,
  activeOptions,
  onToggleOption,
  onToggleBoolean,
}: {
  filter: FilterDefinition;
  isExpanded: boolean;
  onToggle: () => void;
  activeOptions: string[];
  onToggleOption: (opt: string) => void;
  onToggleBoolean: () => void;
}) {
  const isActive = activeOptions.length > 0;

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className={`text-sm font-medium transition-colors ${isActive ? 'text-teal-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
          {filter.name}
        </span>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="bg-teal-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {activeOptions.length}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="pb-3">
          <FilterControl
            filter={filter}
            activeOptions={activeOptions}
            onToggleOption={onToggleOption}
            onToggleBoolean={onToggleBoolean}
          />
        </div>
      )}
    </div>
  );
}

function FilterControl({
  filter,
  activeOptions,
  onToggleOption,
  onToggleBoolean,
}: {
  filter: FilterDefinition;
  activeOptions: string[];
  onToggleOption: (opt: string) => void;
  onToggleBoolean: () => void;
}) {
  switch (filter.uiType) {
    case 'toggle':
    case 'toggle-fee':
    case 'toggle-amount':
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-teal-500 rounded"
            checked={activeOptions.length > 0}
            onChange={onToggleBoolean}
          />
          <span className="text-xs text-gray-600">Yes</span>
        </label>
      );

    case 'multi-select':
      return (
        <div className="flex flex-wrap gap-1.5">
          {filter.options.map((opt) => (
            <button
              key={opt}
              onClick={() => onToggleOption(opt)}
              className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
                activeOptions.includes(opt)
                  ? 'border-teal-500 bg-teal-50 text-teal-700 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:border-teal-400 hover:text-gray-900'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );

    case 'slider-dollar':
    case 'slider-presets':
    case 'slider-zip':
    case 'slider-numeric':
    case 'numeric-presets':
      return (
        <div className="flex flex-wrap gap-1.5">
          {filter.options.map((opt) => (
            <button
              key={opt}
              onClick={() => onToggleOption(opt)}
              className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
                activeOptions.includes(opt)
                  ? 'border-teal-500 bg-teal-50 text-teal-700 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:border-teal-400 hover:text-gray-900'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );

    case 'star-select':
      return (
        <div className="flex gap-1">
          {filter.options.map((opt) => (
            <button
              key={opt}
              onClick={() => onToggleOption(opt)}
              className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
                activeOptions.includes(opt)
                  ? 'border-teal-500 bg-teal-50 text-teal-700 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:border-teal-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );

    case 'dropdown':
      return (
        <select
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none focus:border-teal-400"
          value={activeOptions[0] ?? ''}
          onChange={(e) => {
            if (e.target.value) onToggleOption(e.target.value);
          }}
        >
          <option value="">Select...</option>
          {filter.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );

    case 'date-picker':
      return (
        <input
          type="date"
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none focus:border-teal-400"
        />
      );

    case 'radius-zip':
      return (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter ZIP code"
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none focus:border-teal-400 placeholder-gray-400"
          />
          <div className="flex flex-wrap gap-1.5">
            {filter.options.map((opt) => (
              <button
                key={opt}
                onClick={() => onToggleOption(opt)}
                className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
                  activeOptions.includes(opt)
                    ? 'border-teal-500 bg-teal-50 text-teal-700 font-semibold'
                    : 'border-gray-200 text-gray-600 hover:border-teal-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );

    case 'numeric':
      return (
        <input
          type="number"
          placeholder={`Enter ${filter.name.toLowerCase()}`}
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none focus:border-teal-400 placeholder-gray-400"
        />
      );

    default:
      return null;
  }
}
