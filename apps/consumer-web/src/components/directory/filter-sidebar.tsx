'use client'

import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SlidersHorizontal } from 'lucide-react'
import {
  CATEGORY_OPTIONS,
  PRICE_OPTIONS,
  LOCATION_OPTIONS,
  RATING_OPTIONS,
  AVAILABILITY_OPTIONS,
  VENDOR_TYPE_OPTIONS,
  type DirectoryFilterParams,
  buildFilterUrl,
  toggleMultiValue,
} from '@/lib/directory-filter-utils'

interface FilterSidebarProps {
  filters: DirectoryFilterParams
  className?: string
}

export function FilterSidebar({ filters, className }: FilterSidebarProps) {
  return (
    <div className={`bg-background h-full flex flex-col ${className || ''}`}>
      {/* Sidebar header */}
      <div className="px-4 py-3 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-wide">Filters</h2>
          </div>
          <Link href="/book">
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-destructive">
              Clear all
            </Button>
          </Link>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion
            type="multiple"
            defaultValue={['category', 'price', 'location', 'rating', 'availability', 'vendor-type']}
            className="w-full"
          >
            {/* ── Category ────────────────────────────────────────────── */}
            <AccordionItem value="category">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline py-3">
                Category
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {CATEGORY_OPTIONS.map((opt) => {
                    const isChecked = filters.category?.includes(opt.slug) ?? false
                    const nextCategory = toggleMultiValue(filters.category, opt.slug)
                    const href = buildFilterUrl(filters, { category: nextCategory })

                    return (
                      <Link key={opt.slug} href={href} className="block">
                        <label className="flex items-center gap-2.5 py-1 cursor-pointer hover:bg-accent/50 rounded-md px-1.5 -mx-1.5 transition-colors">
                          <Checkbox
                            checked={isChecked}
                            // Prevent default checkbox behavior - Link handles navigation
                            onCheckedChange={() => {}}
                            onClick={(e) => e.preventDefault()}
                            className="pointer-events-none"
                          />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      </Link>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ── Price Range ─────────────────────────────────────────── */}
            <AccordionItem value="price">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline py-3">
                Price Range
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {PRICE_OPTIONS.map((opt) => {
                    const isActive = filters.price === opt.slug
                    const href = buildFilterUrl(filters, {
                      price: isActive ? undefined : opt.slug,
                    })

                    return (
                      <Link key={opt.slug} href={href} className="block">
                        <div
                          className={`flex items-center gap-2.5 py-1.5 px-2 rounded-md transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-accent/50'
                          }`}
                        >
                          <div
                            className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isActive ? 'border-primary' : 'border-muted-foreground/30'
                            }`}
                          >
                            {isActive && (
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm leading-tight">{opt.label}</span>
                            <span className="text-xs text-muted-foreground">{opt.description}</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ── Location ────────────────────────────────────────────── */}
            <AccordionItem value="location">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline py-3">
                Location
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-1.5">
                  {LOCATION_OPTIONS.map((opt) => {
                    const isChecked = filters.location?.includes(opt.slug) ?? false
                    const nextLocation = toggleMultiValue(filters.location, opt.slug)
                    const href = buildFilterUrl(filters, { location: nextLocation })

                    return (
                      <Link key={opt.slug} href={href}>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                            isChecked
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {opt.label}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ── Rating ──────────────────────────────────────────────── */}
            <AccordionItem value="rating">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline py-3">
                Rating
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {RATING_OPTIONS.map((opt) => {
                    const isActive = (filters.rating || 'any') === opt.slug
                    const href = buildFilterUrl(filters, { rating: opt.slug })

                    return (
                      <Link key={opt.slug} href={href} className="block">
                        <div
                          className={`flex items-center gap-2.5 py-1.5 px-2 rounded-md transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-accent/50'
                          }`}
                        >
                          <div
                            className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isActive ? 'border-primary' : 'border-muted-foreground/30'
                            }`}
                          >
                            {isActive && (
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="text-sm">{opt.label}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ── Availability ────────────────────────────────────────── */}
            <AccordionItem value="availability">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline py-3">
                Availability
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {AVAILABILITY_OPTIONS.map((opt) => {
                    const isChecked = filters.availability?.includes(opt.slug) ?? false
                    const nextAvailability = toggleMultiValue(filters.availability, opt.slug)
                    const href = buildFilterUrl(filters, { availability: nextAvailability })

                    return (
                      <Link key={opt.slug} href={href} className="block">
                        <label className="flex items-center gap-2.5 py-1 cursor-pointer hover:bg-accent/50 rounded-md px-1.5 -mx-1.5 transition-colors">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => {}}
                            onClick={(e) => e.preventDefault()}
                            className="pointer-events-none"
                          />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      </Link>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ── Vendor Type ─────────────────────────────────────────── */}
            <AccordionItem value="vendor-type">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline py-3">
                Vendor Type
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {VENDOR_TYPE_OPTIONS.map((opt) => {
                    const isActive = (filters.vendor || 'all') === opt.slug
                    const href = buildFilterUrl(filters, { vendor: opt.slug })

                    return (
                      <Link key={opt.slug} href={href} className="block">
                        <div
                          className={`flex items-center gap-2.5 py-1.5 px-2 rounded-md transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-accent/50'
                          }`}
                        >
                          <div
                            className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isActive ? 'border-primary' : 'border-muted-foreground/30'
                            }`}
                          >
                            {isActive && (
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="text-sm">{opt.label}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}
