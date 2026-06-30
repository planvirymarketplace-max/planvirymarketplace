'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Star, ChevronDown, ChevronUp, Search, HelpCircle, X } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { FilterDefinition } from '@/hooks/use-supabase'

// ---------------------------------------------------------------------------
// Filter value types - what the consumer reads / writes
// ---------------------------------------------------------------------------

export type FilterValue =
  | { type: 'double_slider'; min: number; max: number }
  | { type: 'single_slider'; value: number }
  | { type: 'star_select'; value: number }
  | { type: 'multi_select'; selected: string[] }
  | { type: 'single_select'; selected: string | null }
  | { type: 'toggle'; enabled: boolean }
  | { type: 'toggle_with_fee'; enabled: boolean }
  | { type: 'visual_grid'; selected: string[] }
  | { type: 'searchable_multi'; selected: string[] }
  | { type: 'checkbox_group'; selected: string[] }
  | { type: 'radio_group'; selected: string | null }
  | { type: 'text_input'; value: string }
  | { type: 'number_input'; value: number | null }
  | { type: 'tag_input'; tags: string[] }
  | { type: 'location_select'; selected: string[] }
  | { type: 'color_picker'; selected: string | null }
  | { type: 'icon_select'; selected: string | null }
  | { type: 'date_picker'; value: string | null }
  | { type: 'time_picker'; value: string | null }
  | { type: 'autocomplete_zip'; zip: string; radius: number }
  | { type: 'range_tiers'; selected: string[] }
  | { type: 'date_range'; startDate: string | null; endDate: string | null }
  | { type: 'time_range'; startTime: string | null; endTime: string | null }
  | { type: 'percentage_slider'; value: number }

export type FilterValuesMap = Record<string, FilterValue>

// ---------------------------------------------------------------------------
// Utility: get default value for a filter
// ---------------------------------------------------------------------------

export function getDefaultFilterValue(filter: FilterDefinition): FilterValue {
  switch (filter.uiType) {
    case 'double_slider':
      return { type: 'double_slider', min: filter.rangeMin ?? 0, max: filter.rangeMax ?? 100 }
    case 'single_slider':
      return { type: 'single_slider', value: filter.rangeMin ?? 0 }
    case 'percentage_slider':
      return { type: 'percentage_slider', value: filter.rangeMin ?? 0 }
    case 'star_select':
      return { type: 'star_select', value: 0 }
    case 'multi_select':
      return { type: 'multi_select', selected: [] }
    case 'single_select':
      return { type: 'single_select', selected: null }
    case 'toggle':
      return { type: 'toggle', enabled: false }
    case 'toggle_with_fee':
    case 'toggle_with_cost':
      return { type: 'toggle_with_fee', enabled: false }
    case 'visual_grid':
      return { type: 'visual_grid', selected: [] }
    case 'searchable_multi':
      return { type: 'searchable_multi', selected: [] }
    case 'checkbox_group':
      return { type: 'checkbox_group', selected: [] }
    case 'radio_group':
      return { type: 'radio_group', selected: null }
    case 'text_input':
      return { type: 'text_input', value: '' }
    case 'number_input':
      return { type: 'number_input', value: null }
    case 'tag_input':
      return { type: 'tag_input', tags: [] }
    case 'location_select':
      return { type: 'location_select', selected: [] }
    case 'color_picker':
      return { type: 'color_picker', selected: null }
    case 'icon_select':
      return { type: 'icon_select', selected: null }
    case 'date_picker':
      return { type: 'date_picker', value: null }
    case 'date_range':
      return { type: 'date_range', startDate: null, endDate: null }
    case 'time_picker':
      return { type: 'time_picker', value: null }
    case 'time_range':
      return { type: 'time_range', startTime: null, endTime: null }
    case 'autocomplete_zip':
      return { type: 'autocomplete_zip', zip: '', radius: 25 }
    case 'range_tiers':
      return { type: 'range_tiers', selected: [] }
    default:
      return { type: 'multi_select', selected: [] }
  }
}

// ---------------------------------------------------------------------------
// Check if a filter value is "active" (non-default)
// ---------------------------------------------------------------------------

export function isFilterActive(value: FilterValue, filter: FilterDefinition): boolean {
  switch (value.type) {
    case 'double_slider':
      return value.min !== (filter.rangeMin ?? 0) || value.max !== (filter.rangeMax ?? 100)
    case 'single_slider':
      return value.value !== (filter.rangeMin ?? 0)
    case 'percentage_slider':
      return value.value !== (filter.rangeMin ?? 0)
    case 'star_select':
      return value.value > 0
    case 'multi_select':
    case 'visual_grid':
    case 'searchable_multi':
    case 'checkbox_group':
    case 'location_select':
    case 'range_tiers':
      return (value as { selected: string[] }).selected.length > 0
    case 'tag_input':
      return (value as { tags: string[] }).tags.length > 0
    case 'single_select':
    case 'radio_group':
    case 'color_picker':
    case 'icon_select':
      return (value as { selected: string | null }).selected !== null
    case 'toggle':
    case 'toggle_with_fee':
      return value.enabled
    case 'text_input':
      return value.value !== ''
    case 'number_input':
      return value.value !== null
    case 'date_picker':
    case 'time_picker':
      return value.value !== null
    case 'date_range':
      return value.startDate !== null || value.endDate !== null
    case 'time_range':
      return value.startTime !== null || value.endTime !== null
    case 'autocomplete_zip':
      return value.zip !== ''
    default:
      return false
  }
}

// ---------------------------------------------------------------------------
// Options from optionsJson
// ---------------------------------------------------------------------------

interface FilterOption {
  value: string
  label: string
  icon?: string
  color?: string
  description?: string
}

function parseOptions(optionsJson: unknown): FilterOption[] {
  if (!optionsJson) return []
  if (Array.isArray(optionsJson)) {
    return optionsJson.map(opt => {
      if (typeof opt === 'string') return { value: opt, label: opt }
      const obj = opt as Record<string, unknown>
      return {
        value: (obj.value || obj.key || obj.slug || String(opt)) as string,
        label: (obj.label || obj.name || obj.value || String(opt)) as string,
        icon: obj.icon as string | undefined,
        color: obj.color as string | undefined,
        description: obj.description as string | undefined,
      }
    })
  }
  return []
}

// ---------------------------------------------------------------------------
// Individual filter renderers
// ---------------------------------------------------------------------------

function DoubleSliderFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'double_slider' }>; onChange: (v: FilterValue) => void }) {
  const min = filter.rangeMin ?? 0
  const max = filter.rangeMax ?? 100
  const step = filter.rangeStep ?? 1
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-stone-600 font-medium">{value.min}{filter.rangeUnit ? ` ${filter.rangeUnit}` : ''}</span>
        <span className="text-stone-600 font-medium">{value.max}{filter.rangeUnit ? ` ${filter.rangeUnit}` : ''}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value.min, value.max]}
        onValueChange={([newMin, newMax]) => onChange({ type: 'double_slider', min: newMin, max: newMax })}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-stone-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

function SingleSliderFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'single_slider' }>; onChange: (v: FilterValue) => void }) {
  const min = filter.rangeMin ?? 0
  const max = filter.rangeMax ?? 100
  const step = filter.rangeStep ?? 1
  return (
    <div className="space-y-2">
      <div className="text-[11px] text-stone-600 font-medium text-center">
        {value.value}{filter.rangeUnit ? ` ${filter.rangeUnit}` : ''}
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value.value]}
        onValueChange={([v]) => onChange({ type: 'single_slider', value: v })}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-stone-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

function StarSelectFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'star_select' }>; onChange: (v: FilterValue) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange({ type: 'star_select', value: value.value === star ? 0 : star })}
          className="transition-colors"
        >
          <Star
            size={18}
            className={star <= value.value ? 'text-amber-400 fill-amber-400' : 'text-stone-200 hover:text-amber-200'}
          />
        </button>
      ))}
      {value.value > 0 && (
        <span className="text-[11px] text-stone-500 ml-1">{value.value}+ stars</span>
      )}
    </div>
  )
}

function MultiSelectFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'multi_select' }>; onChange: (v: FilterValue) => void }) {
  const options = parseOptions(filter.optionsJson)
  if (options.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isSelected = value.selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            onClick={() => {
              const newSelected = isSelected
                ? value.selected.filter(s => s !== opt.value)
                : [...value.selected, opt.value]
              onChange({ type: 'multi_select', selected: newSelected })
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              isSelected
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function SingleSelectFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'single_select' }>; onChange: (v: FilterValue) => void }) {
  const options = parseOptions(filter.optionsJson)
  if (options.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isSelected = value.selected === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange({ type: 'single_select', selected: isSelected ? null : opt.value })}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              isSelected
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function ToggleFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'toggle' }>; onChange: (v: FilterValue) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-[11px] text-stone-600 font-medium cursor-pointer" htmlFor={filter.filterKey}>
        {filter.placeholder || 'Enable'}
      </Label>
      <Switch
        id={filter.filterKey}
        checked={value.enabled}
        onCheckedChange={(checked) => onChange({ type: 'toggle', enabled: checked })}
      />
    </div>
  )
}

function VisualGridFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'visual_grid' }>; onChange: (v: FilterValue) => void }) {
  const options = parseOptions(filter.optionsJson)
  if (options.length === 0) return null

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {options.map((opt) => {
        const isSelected = value.selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            onClick={() => {
              const newSelected = isSelected
                ? value.selected.filter(s => s !== opt.value)
                : [...value.selected, opt.value]
              onChange({ type: 'visual_grid', selected: newSelected })
            }}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-colors border ${
              isSelected
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-50 text-stone-600 border-stone-100 hover:border-stone-300'
            }`}
          >
            {opt.icon && <span className="text-base">{opt.icon}</span>}
            <span className="truncate w-full text-center">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function SearchableMultiFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'searchable_multi' }>; onChange: (v: FilterValue) => void }) {
  const [search, setSearch] = useState('')
  const options = parseOptions(filter.optionsJson)

  const filteredOptions = useMemo(() => {
    if (!search) return options
    const lower = search.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(lower))
  }, [options, search])

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={filter.placeholder || 'Search...'}
          className="w-full pl-7 pr-3 py-1.5 text-[11px] border border-stone-200 rounded-md bg-white placeholder-stone-400 focus:outline-none focus:border-stone-400"
        />
      </div>
      {value.selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.selected.map(s => {
            const opt = options.find(o => o.value === s)
            return (
              <Badge key={s} variant="secondary" className="text-[10px] gap-1 h-5">
                {opt?.label || s}
                <button onClick={() => onChange({ type: 'searchable_multi', selected: value.selected.filter(v => v !== s) })}>
                  <X size={10} />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
      <div className="max-h-32 overflow-y-auto space-y-0.5">
        {filteredOptions.map((opt) => {
          const isSelected = value.selected.includes(opt.value)
          return (
            <label key={opt.value} className="flex items-center gap-2 px-1 py-1 hover:bg-stone-50 rounded cursor-pointer">
              <Checkbox checked={isSelected} onCheckedChange={() => {
                const newSelected = isSelected
                  ? value.selected.filter(s => s !== opt.value)
                  : [...value.selected, opt.value]
                onChange({ type: 'searchable_multi', selected: newSelected })
              }} className="h-3.5 w-3.5" />
              <span className="text-[11px] text-stone-600">{opt.label}</span>
            </label>
          )
        })}
        {filteredOptions.length === 0 && (
          <p className="text-[11px] text-stone-400 px-1">No matches</p>
        )}
      </div>
    </div>
  )
}

function CheckboxGroupFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'checkbox_group' }>; onChange: (v: FilterValue) => void }) {
  const options = parseOptions(filter.optionsJson)
  if (options.length === 0) return null

  return (
    <div className="space-y-0.5">
      {options.map((opt) => {
        const isSelected = value.selected.includes(opt.value)
        return (
          <label key={opt.value} className="flex items-center gap-2 px-1 py-1 hover:bg-stone-50 rounded cursor-pointer group">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => {
                const newSelected = isSelected
                  ? value.selected.filter(s => s !== opt.value)
                  : [...value.selected, opt.value]
                onChange({ type: 'checkbox_group', selected: newSelected })
              }}
              className="h-3.5 w-3.5"
            />
            <span className="text-[11px] text-stone-600 group-hover:text-stone-800 transition-colors">{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}

function RadioGroupFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'radio_group' }>; onChange: (v: FilterValue) => void }) {
  const options = parseOptions(filter.optionsJson)
  if (options.length === 0) return null

  return (
    <div className="space-y-0.5">
      {options.map((opt) => {
        const isSelected = value.selected === opt.value
        return (
          <label key={opt.value} className="flex items-center gap-2 px-1 py-1 hover:bg-stone-50 rounded cursor-pointer">
            <div className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${
              isSelected ? 'border-stone-900' : 'border-stone-300'
            }`}>
              {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-stone-900" />}
            </div>
            <span className="text-[11px] text-stone-600">{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}

function TextInputFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'text_input' }>; onChange: (v: FilterValue) => void }) {
  return (
    <Input
      value={value.value}
      onChange={(e) => onChange({ type: 'text_input', value: e.target.value })}
      placeholder={filter.placeholder || 'Type...'}
      className="text-[11px] h-8"
    />
  )
}

function NumberInputFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'number_input' }>; onChange: (v: FilterValue) => void }) {
  return (
    <Input
      type="number"
      value={value.value ?? ''}
      onChange={(e) => onChange({ type: 'number_input', value: e.target.value ? Number(e.target.value) : null })}
      placeholder={filter.placeholder || 'Enter number'}
      min={filter.rangeMin ?? undefined}
      max={filter.rangeMax ?? undefined}
      step={filter.rangeStep ?? 1}
      className="text-[11px] h-8"
    />
  )
}

function TagInputFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'tag_input' }>; onChange: (v: FilterValue) => void }) {
  const [input, setInput] = useState('')
  const addTag = () => {
    const tag = input.trim()
    if (tag && !value.tags.includes(tag)) {
      onChange({ type: 'tag_input', tags: [...value.tags, tag] })
    }
    setInput('')
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
          placeholder={filter.placeholder || 'Add tag...'}
          className="text-[11px] h-7 flex-1"
        />
        <button onClick={addTag} className="px-2 h-7 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium hover:bg-stone-200 transition-colors">
          Add
        </button>
      </div>
      {value.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-[10px] gap-1 h-5">
              {tag}
              <button onClick={() => onChange({ type: 'tag_input', tags: value.tags.filter(t => t !== tag) })}>
                <X size={10} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function LocationSelectFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'location_select' }>; onChange: (v: FilterValue) => void }) {
  const [search, setSearch] = useState('')
  const options = parseOptions(filter.optionsJson)

  const filtered = useMemo(() => {
    if (!search) return options.slice(0, 20)
    const lower = search.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(lower)).slice(0, 20)
  }, [options, search])

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search locations..."
          className="w-full pl-7 pr-3 py-1.5 text-[11px] border border-stone-200 rounded-md bg-white placeholder-stone-400 focus:outline-none focus:border-stone-400"
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {filtered.map((opt) => {
          const isSelected = value.selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => {
                const newSelected = isSelected
                  ? value.selected.filter(s => s !== opt.value)
                  : [...value.selected, opt.value]
                onChange({ type: 'location_select', selected: newSelected })
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                isSelected ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ColorPickerFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'color_picker' }>; onChange: (v: FilterValue) => void }) {
  const options = parseOptions(filter.optionsJson)
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isSelected = value.selected === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange({ type: 'color_picker', selected: isSelected ? null : opt.value })}
            className={`h-7 w-7 rounded-full border-2 transition-all ${
              isSelected ? 'border-stone-900 ring-2 ring-stone-300 scale-110' : 'border-stone-200 hover:border-stone-400'
            }`}
            style={{ backgroundColor: opt.color || opt.value }}
            title={opt.label}
          />
        )
      })}
    </div>
  )
}

function IconSelectFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'icon_select' }>; onChange: (v: FilterValue) => void }) {
  const options = parseOptions(filter.optionsJson)
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isSelected = value.selected === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange({ type: 'icon_select', selected: isSelected ? null : opt.value })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              isSelected
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {opt.icon && <span>{opt.icon}</span>}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function DatePickerFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'date_picker' }>; onChange: (v: FilterValue) => void }) {
  return (
    <Input
      type="date"
      value={value.value || ''}
      onChange={(e) => onChange({ type: 'date_picker', value: e.target.value || null })}
      className="text-[11px] h-8"
    />
  )
}

function TimePickerFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'time_picker' }>; onChange: (v: FilterValue) => void }) {
  return (
    <Input
      type="time"
      value={value.value || ''}
      onChange={(e) => onChange({ type: 'time_picker', value: e.target.value || null })}
      className="text-[11px] h-8"
    />
  )
}

function AutocompleteZipFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'autocomplete_zip' }>; onChange: (v: FilterValue) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          value={value.zip}
          onChange={(e) => onChange({ type: 'autocomplete_zip', zip: e.target.value, radius: value.radius })}
          placeholder={filter.placeholder || 'Zip code'}
          className="text-[11px] h-8 w-28"
          maxLength={10}
        />
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-[10px] text-stone-400 whitespace-nowrap">within</span>
          <select
            value={value.radius}
            onChange={(e) => onChange({ type: 'autocomplete_zip', zip: value.zip, radius: Number(e.target.value) })}
            className="text-[11px] h-8 bg-white border border-stone-200 rounded-md px-2"
          >
            <option value={5}>5 mi</option>
            <option value={10}>10 mi</option>
            <option value={25}>25 mi</option>
            <option value={50}>50 mi</option>
            <option value={100}>100 mi</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function RangeTiersFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'range_tiers' }>; onChange: (v: FilterValue) => void }) {
  const options = parseOptions(filter.optionsJson)
  if (options.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isSelected = value.selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            onClick={() => {
              const newSelected = isSelected
                ? value.selected.filter(s => s !== opt.value)
                : [...value.selected, opt.value]
              onChange({ type: 'range_tiers', selected: newSelected })
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              isSelected
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function ToggleWithFeeFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'toggle_with_fee' }>; onChange: (v: FilterValue) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Label className="text-[11px] text-stone-600 font-medium cursor-pointer" htmlFor={filter.filterKey}>
          {filter.placeholder || 'Enable'}
        </Label>
        <span className="text-[9px] text-stone-400 font-medium uppercase tracking-wider">fee may apply</span>
      </div>
      <Switch
        id={filter.filterKey}
        checked={value.enabled}
        onCheckedChange={(checked) => onChange({ type: 'toggle_with_fee', enabled: checked })}
      />
    </div>
  )
}

function DateRangeFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'date_range' }>; onChange: (v: FilterValue) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={value.startDate || ''}
        onChange={(e) => onChange({ type: 'date_range', startDate: e.target.value || null, endDate: value.endDate })}
        placeholder="Start"
        className="text-[11px] h-8 flex-1"
      />
      <span className="text-[10px] text-stone-400">→</span>
      <Input
        type="date"
        value={value.endDate || ''}
        onChange={(e) => onChange({ type: 'date_range', startDate: value.startDate, endDate: e.target.value || null })}
        placeholder="End"
        className="text-[11px] h-8 flex-1"
      />
    </div>
  )
}

function TimeRangeFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'time_range' }>; onChange: (v: FilterValue) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="time"
        value={value.startTime || ''}
        onChange={(e) => onChange({ type: 'time_range', startTime: e.target.value || null, endTime: value.endTime })}
        className="text-[11px] h-8 flex-1"
      />
      <span className="text-[10px] text-stone-400">→</span>
      <Input
        type="time"
        value={value.endTime || ''}
        onChange={(e) => onChange({ type: 'time_range', startTime: value.startTime, endTime: e.target.value || null })}
        className="text-[11px] h-8 flex-1"
      />
    </div>
  )
}

function PercentageSliderFilter({
  filter, value, onChange
}: { filter: FilterDefinition; value: Extract<FilterValue, { type: 'percentage_slider' }>; onChange: (v: FilterValue) => void }) {
  const min = filter.rangeMin ?? 0
  const max = filter.rangeMax ?? 100
  const step = filter.rangeStep ?? 1
  return (
    <div className="space-y-2">
      <div className="text-[11px] text-stone-600 font-medium text-center">
        {value.value}%
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value.value]}
        onValueChange={([v]) => onChange({ type: 'percentage_slider', value: v })}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-stone-400">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Single filter wrapper - label + collapsible + renderer
// ---------------------------------------------------------------------------

function FilterItem({
  filter,
  value,
  onChange,
  defaultCollapsed = false,
}: {
  filter: FilterDefinition
  value: FilterValue
  onChange: (v: FilterValue) => void
  defaultCollapsed?: boolean
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const active = isFilterActive(value, filter)

  return (
    <div className="border-t border-stone-100 pt-3 mt-3">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-1 mb-2 group"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{filter.label}</span>
          {active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
          {filter.helpText && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle size={10} className="text-stone-300" />
                </TooltipTrigger>
                <TooltipContent side="right" className="text-[11px] max-w-[200px]">
                  {filter.helpText}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {collapsed ? (
          <ChevronUp size={12} className="text-stone-300" />
        ) : (
          <ChevronDown size={12} className="text-stone-300" />
        )}
      </button>
      {!collapsed && (
        <div className="px-1">
          {filter.uiType === 'double_slider' && value.type === 'double_slider' && (
            <DoubleSliderFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'single_slider' && value.type === 'single_slider' && (
            <SingleSliderFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'star_select' && value.type === 'star_select' && (
            <StarSelectFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'multi_select' && value.type === 'multi_select' && (
            <MultiSelectFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'single_select' && value.type === 'single_select' && (
            <SingleSelectFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'toggle' && value.type === 'toggle' && (
            <ToggleFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'visual_grid' && value.type === 'visual_grid' && (
            <VisualGridFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'searchable_multi' && value.type === 'searchable_multi' && (
            <SearchableMultiFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'checkbox_group' && value.type === 'checkbox_group' && (
            <CheckboxGroupFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'radio_group' && value.type === 'radio_group' && (
            <RadioGroupFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'text_input' && value.type === 'text_input' && (
            <TextInputFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'number_input' && value.type === 'number_input' && (
            <NumberInputFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'tag_input' && value.type === 'tag_input' && (
            <TagInputFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'location_select' && value.type === 'location_select' && (
            <LocationSelectFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'color_picker' && value.type === 'color_picker' && (
            <ColorPickerFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'icon_select' && value.type === 'icon_select' && (
            <IconSelectFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'date_picker' && value.type === 'date_picker' && (
            <DatePickerFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'time_picker' && value.type === 'time_picker' && (
            <TimePickerFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'autocomplete_zip' && value.type === 'autocomplete_zip' && (
            <AutocompleteZipFilter filter={filter} value={value} onChange={onChange} />
          )}
          {(filter.uiType === 'toggle_with_fee' || filter.uiType === 'toggle_with_cost') && value.type === 'toggle_with_fee' && (
            <ToggleWithFeeFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'range_tiers' && value.type === 'range_tiers' && (
            <RangeTiersFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'date_range' && value.type === 'date_range' && (
            <DateRangeFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'time_range' && value.type === 'time_range' && (
            <TimeRangeFilter filter={filter} value={value} onChange={onChange} />
          )}
          {filter.uiType === 'percentage_slider' && value.type === 'percentage_slider' && (
            <PercentageSliderFilter filter={filter} value={value} onChange={onChange} />
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main DynamicFilterPanel
// ---------------------------------------------------------------------------

interface DynamicFilterPanelProps {
  filters: FilterDefinition[]
  values: FilterValuesMap
  onValuesChange: (values: FilterValuesMap) => void
  className?: string
}

export function DynamicFilterPanel({ filters, values, onValuesChange, className }: DynamicFilterPanelProps) {
  const handleFilterChange = useCallback((filterKey: string, newValue: FilterValue) => {
    onValuesChange({ ...values, [filterKey]: newValue })
  }, [values, onValuesChange])

  if (filters.length === 0) {
    return (
      <div className={`px-3 py-4 text-center ${className || ''}`}>
        <p className="text-[11px] text-stone-400">Select a category to see available filters</p>
      </div>
    )
  }

  // Separate universal filters from category-specific ones
  const universalFilters = filters.filter(f => f.isUniversal)
  const categoryFilters = filters.filter(f => !f.isUniversal)

  return (
    <div className={className}>
      {/* Category-specific filters */}
      {categoryFilters.length > 0 && (
        <div>
          {categoryFilters.map((filter) => (
            <FilterItem
              key={filter.id}
              filter={filter}
              value={values[filter.filterKey] || getDefaultFilterValue(filter)}
              onChange={(v) => handleFilterChange(filter.filterKey, v)}
              defaultCollapsed={filter.sortOrder > 5}
            />
          ))}
        </div>
      )}

      {/* Universal filters */}
      {universalFilters.length > 0 && (
        <div>
          {categoryFilters.length > 0 && (
            <div className="border-t border-stone-200 mt-3 pt-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-300 px-1">General</span>
            </div>
          )}
          {universalFilters.map((filter) => (
            <FilterItem
              key={filter.id}
              filter={filter}
              value={values[filter.filterKey] || getDefaultFilterValue(filter)}
              onChange={(v) => handleFilterChange(filter.filterKey, v)}
              defaultCollapsed={true}
            />
          ))}
        </div>
      )}

      {/* Bottom spacer */}
      <div className="h-6" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Serialize filter values to API params
// ---------------------------------------------------------------------------

export function filterValuesToApiParams(values: FilterValuesMap): Record<string, string> {
  const params: Record<string, string> = {}

  for (const [key, value] of Object.entries(values)) {
    switch (value.type) {
      case 'double_slider':
        params[`${key}_min`] = String(value.min)
        params[`${key}_max`] = String(value.max)
        break
      case 'single_slider':
        params[key] = String(value.value)
        break
      case 'percentage_slider':
        params[key] = String(value.value)
        break
      case 'star_select':
        if (value.value > 0) params[key] = String(value.value)
        break
      case 'multi_select':
      case 'visual_grid':
      case 'searchable_multi':
      case 'checkbox_group':
      case 'location_select':
      case 'range_tiers':
        if (value.selected.length > 0) params[key] = value.selected.join(',')
        break
      case 'tag_input':
        if (value.tags.length > 0) params[key] = value.tags.join(',')
        break
      case 'single_select':
      case 'radio_group':
      case 'color_picker':
      case 'icon_select':
        if (value.selected) params[key] = value.selected
        break
      case 'toggle':
      case 'toggle_with_fee':
        if (value.enabled) params[key] = 'true'
        break
      case 'text_input':
        if (value.value) params[key] = value.value
        break
      case 'number_input':
        if (value.value !== null) params[key] = String(value.value)
        break
      case 'date_picker':
      case 'time_picker':
        if (value.value) params[key] = value.value
        break
      case 'date_range':
        if (value.startDate) params[`${key}_start`] = value.startDate
        if (value.endDate) params[`${key}_end`] = value.endDate
        break
      case 'time_range':
        if (value.startTime) params[`${key}_start`] = value.startTime
        if (value.endTime) params[`${key}_end`] = value.endTime
        break
      case 'autocomplete_zip':
        if (value.zip) {
          params[`${key}_zip`] = value.zip
          params[`${key}_radius`] = String(value.radius)
        }
        break
    }
  }

  return params
}
