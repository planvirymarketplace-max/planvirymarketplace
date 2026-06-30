'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface UniversalFilterValues {
  sort?: string
  price?: string
  distance?: string
  rating?: string
  availability?: string[]
  accessibility?: string[]
  paymentMethods?: string[]
  cancellationPolicy?: string[]
  depositRequired?: string[]
}

interface UniversalFiltersProps {
  values: UniversalFilterValues
  onChange: (values: UniversalFilterValues) => void
}

const SORT_OPTIONS = [
  'Recommended',
  'Price: Low to High',
  'Price: High to Low',
  'Distance: Nearest First',
  'Rating: Highest First',
  'Most Reviewed',
  'Newest',
]

const PRICE_OPTIONS = ['$', '$$', '$$$', '$$$$', 'Any Price']

const DISTANCE_OPTIONS = [
  'Within 1 mile',
  'Within 5 miles',
  'Within 10 miles',
  'Within 25 miles',
  'Within 50 miles',
  '50+ miles',
]

const RATING_OPTIONS = ['4.5+ stars', '4.0+ stars', '3.5+ stars', '3.0+ stars', 'Any rating']

const AVAILABILITY_OPTIONS = ['Open now', 'Open today', 'Available this weekend', 'Advance booking required']

const ACCESSIBILITY_OPTIONS = [
  'Wheelchair accessible',
  'Service animals allowed',
  'Hearing loop available',
  'Accessible parking',
]

const PAYMENT_OPTIONS = [
  'Credit card accepted',
  'Cash only',
  'Venmo / PayPal',
  'Cryptocurrency',
  'Payment plan available',
]

const CANCELLATION_OPTIONS = ['Free cancellation', 'Partial refund available', 'Non-refundable']

const DEPOSIT_OPTIONS = [
  'No deposit',
  'Deposit required (refundable)',
  'Deposit required (non-refundable)',
]

interface DropdownProps {
  label: string
  value: string | string[] | undefined
  options: string[]
  multi?: boolean
  onSelect: (val: string | string[]) => void
}

function FilterDropdown({ label, value, options, multi, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isActive = multi
    ? Array.isArray(value) && value.length > 0
    : !!value && value !== 'Any Price' && value !== 'Any rating'

  const displayValue = multi
    ? Array.isArray(value) && value.length > 0
      ? `${value.length} selected`
      : label
    : value || label

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
          isActive
            ? 'bg-midnight-slate text-white'
            : 'bg-white border border-midnight-slate/10 text-midnight-slate/60 hover:border-midnight-slate/30 hover:text-midnight-slate'
        }`}
      >
        <span>{displayValue}</span>
        {isActive && !multi && <span className="text-[11px] opacity-60">▼</span>}
        {isActive && multi && (
          <span className="bg-secondary-container text-midnight-slate rounded-full px-1.5 text-[11px]">
            {(value as string[]).length}
          </span>
        )}
        {!isActive && <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-midnight-slate/10 max-h-72 overflow-y-auto z-50 p-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[12px] font-bold uppercase tracking-widest text-midnight-slate/40">{label}</span>
            {isActive && (
              <button
                onClick={() => onSelect(multi ? [] : '')}
                className="text-[12px] text-midnight-slate/40 hover:text-midnight-slate"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-0.5">
            {options.map((opt) => {
              const selected = multi
                ? Array.isArray(value) && value.includes(opt)
                : value === opt
              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (multi) {
                      const arr = Array.isArray(value) ? value : []
                      const next = arr.includes(opt) ? arr.filter(v => v !== opt) : [...arr, opt]
                      onSelect(next)
                    } else {
                      onSelect(opt)
                      setOpen(false)
                    }
                  }}
                  className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
                    selected ? 'bg-secondary-container/30 text-midnight-slate font-semibold' : 'text-midnight-slate/70 hover:bg-gray-50'
                  }`}
                >
                  {multi && (
                    <span className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center ${
                      selected ? 'border-midnight-slate bg-midnight-slate' : 'border-midnight-slate/20'
                    }`}>
                      {selected && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                  )}
                  <span className="flex-1">{opt}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function UniversalFilters({ values, onChange }: UniversalFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
      <FilterDropdown
        label="Sort"
        value={values.sort}
        options={SORT_OPTIONS}
        onSelect={(v) => onChange({ ...values, sort: v as string })}
      />
      <FilterDropdown
        label="Price"
        value={values.price}
        options={PRICE_OPTIONS}
        onSelect={(v) => onChange({ ...values, price: v as string })}
      />
      <FilterDropdown
        label="Distance"
        value={values.distance}
        options={DISTANCE_OPTIONS}
        onSelect={(v) => onChange({ ...values, distance: v as string })}
      />
      <FilterDropdown
        label="Rating"
        value={values.rating}
        options={RATING_OPTIONS}
        onSelect={(v) => onChange({ ...values, rating: v as string })}
      />
      <FilterDropdown
        label="Availability"
        value={values.availability}
        options={AVAILABILITY_OPTIONS}
        multi
        onSelect={(v) => onChange({ ...values, availability: v as string[] })}
      />
      <FilterDropdown
        label="Accessibility"
        value={values.accessibility}
        options={ACCESSIBILITY_OPTIONS}
        multi
        onSelect={(v) => onChange({ ...values, accessibility: v as string[] })}
      />
      <FilterDropdown
        label="Payment"
        value={values.paymentMethods}
        options={PAYMENT_OPTIONS}
        multi
        onSelect={(v) => onChange({ ...values, paymentMethods: v as string[] })}
      />
      <FilterDropdown
        label="Cancellation"
        value={values.cancellationPolicy}
        options={CANCELLATION_OPTIONS}
        multi
        onSelect={(v) => onChange({ ...values, cancellationPolicy: v as string[] })}
      />
      <FilterDropdown
        label="Deposit"
        value={values.depositRequired}
        options={DEPOSIT_OPTIONS}
        multi
        onSelect={(v) => onChange({ ...values, depositRequired: v as string[] })}
      />
    </div>
  )
}
