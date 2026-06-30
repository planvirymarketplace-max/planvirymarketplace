'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Calendar,
  Sparkles,
  LayoutGrid,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import {
  BROWSE_DIMENSIONS,
  SUBCATEGORIES,
  getSubcategoryBySlug,
  type BrowseDimension,
  type DimensionNode,
  type Subcategory,
} from '@/data/overture-taxonomy'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BrowseJourneysProps {
  /** Optional callback when a subcategory is selected */
  onSelectSubcategory?: (subcategorySlug: string) => void
  /** Optional initial dimension to show (for deep linking) */
  initialDimension?: string
  /** Optional className for the outer wrapper */
  className?: string
}

// ---------------------------------------------------------------------------
// Icon Mapping
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, React.ElementType> = {
  Users,
  Calendar,
  Sparkles,
  LayoutGrid,
}

// ---------------------------------------------------------------------------
// Color System per Dimension
// ---------------------------------------------------------------------------

interface DimensionStyle {
  iconBg: string
  iconText: string
  accent: string
  accentBg: string
  badgeBg: string
  badgeText: string
  hoverBorder: string
}

const DIMENSION_STYLES: Record<string, DimensionStyle> = {
  'by-role': {
    iconBg: 'bg-teal-50',
    iconText: 'text-teal-600',
    accent: 'text-teal-600',
    accentBg: 'bg-teal-600',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    hoverBorder: 'hover:border-teal-600/30',
  },
  'by-event': {
    iconBg: 'bg-orange-50',
    iconText: 'text-orange-500',
    accent: 'text-orange-500',
    accentBg: 'bg-orange-500',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    hoverBorder: 'hover:border-orange-500/30',
  },
  'by-activity': {
    iconBg: 'bg-purple-50',
    iconText: 'text-purple-600',
    accent: 'text-purple-600',
    accentBg: 'bg-purple-600',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    hoverBorder: 'hover:border-purple-600/30',
  },
  'by-category': {
    iconBg: 'bg-sky-50',
    iconText: 'text-sky-600',
    accent: 'text-sky-600',
    accentBg: 'bg-sky-600',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    hoverBorder: 'hover:border-sky-600/30',
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCount(n: number): string {
  return n.toLocaleString('en-US')
}

function getNodeSubcategoryCount(node: DimensionNode): number {
  return node.subcategories.reduce((sum: number, slug: string) => {
    const sub = SUBCATEGORIES[slug]
    return sum + (sub ? sub.count : 0)
  }, 0)
}

function getTopSubcategoryNames(node: DimensionNode, limit: number = 3): string[] {
  const subs = node.subcategories
    .map((slug: string) => SUBCATEGORIES[slug])
    .filter((s: Subcategory | undefined): s is Subcategory => Boolean(s))
    .sort((a: Subcategory, b: Subcategory) => b.count - a.count)
  return subs.slice(0, limit).map((s: Subcategory) => s.name)
}

function getDimensionNodeLabel(dimension: BrowseDimension): string {
  const count = dimension.nodes.length
  const labels: Record<string, string> = {
    'by-role': 'role',
    'by-event': 'event',
    'by-activity': 'activity',
    'by-category': 'category',
  }
  const singular = labels[dimension.slug] ?? 'type'
  const plural: Record<string, string> = {
    'role': 'roles',
    'event': 'events',
    'activity': 'activities',
    'category': 'categories',
  }
  return count === 1 ? `1 ${singular}` : `${count} ${plural[singular] ?? singular + 's'}`
}

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15 },
  },
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Breadcrumb({
  items,
  onNavigate,
}: {
  items: { label: string; slug?: string }[]
  onNavigate: (index: number) => void
}) {
  return (
    <nav className="flex items-center gap-1 text-sm mb-6" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-stone-300" />
            )}
            {isLast ? (
              <span className="font-medium text-stone-900">{item.label}</span>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate(i)}
                className="text-stone-400 hover:text-teal-600 transition-colors"
              >
                {item.label}
              </button>
            )}
          </span>
        )
      })}
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Level 1: Dimension Selection
// ---------------------------------------------------------------------------

function DimensionGrid({
  onSelectDimension,
}: {
  onSelectDimension: (dim: BrowseDimension) => void
}) {
  const dimensions = BROWSE_DIMENSIONS

  return (
    <motion.div
      key="dimension-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
    >
      {dimensions.map((dim) => {
        const Icon = ICON_MAP[dim.icon] || LayoutGrid
        const style = DIMENSION_STYLES[dim.slug] || DIMENSION_STYLES['by-category']
        const nodeLabel = getDimensionNodeLabel(dim)

        return (
          <motion.button
            key={dim.id}
            variants={cardVariants}
            type="button"
            onClick={() => onSelectDimension(dim)}
            className={`
              group relative text-left rounded-2xl border border-black/[0.06]
              p-5 sm:p-6 bg-white
              hover:border-teal-600/30 hover:shadow-md
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.985 }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`
                  flex-shrink-0 flex items-center justify-center
                  w-12 h-12 rounded-xl
                  ${style.iconBg} ${style.iconText}
                  transition-transform duration-200 group-hover:scale-110
                `}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-bold text-stone-900 leading-snug">
                  {dim.name}
                </h3>
                <p className="mt-1 text-sm text-stone-500 leading-relaxed">
                  {dim.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-400">
                    {nodeLabel}
                  </span>
                  <span
                    className={`
                      inline-flex items-center gap-1 text-xs font-semibold
                      ${style.accent}
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-200
                    `}
                  >
                    Explore
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        )
      })}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Level 2: Node Selection
// ---------------------------------------------------------------------------

function NodeGrid({
  dimension,
  onSelectNode,
}: {
  dimension: BrowseDimension
  onSelectNode: (node: DimensionNode) => void
}) {
  const style = DIMENSION_STYLES[dimension.slug] || DIMENSION_STYLES['by-category']

  return (
    <motion.div
      key={`nodes-${dimension.slug}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      {dimension.nodes.map((node) => {
        const topNames = getTopSubcategoryNames(node, 3)
        const subcategoryCount = node.subcategories.length

        return (
          <motion.button
            key={node.slug}
            variants={cardVariants}
            type="button"
            onClick={() => onSelectNode(node)}
            className={`
              group relative text-left rounded-2xl border border-black/[0.06]
              p-5 sm:p-6 bg-white
              ${style.hoverBorder} hover:shadow-md
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40
            `}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
          >
            {/* Node name */}
            <h4 className="font-display text-base font-bold text-stone-900 leading-snug">
              {node.name}
            </h4>
            <p className="mt-1.5 text-sm text-stone-500 leading-relaxed line-clamp-2">
              {node.description}
            </p>

            {/* Count badge */}
            <div className="mt-3">
              <span
                className={`
                  inline-flex items-center rounded-full px-2.5 py-0.5
                  text-xs font-semibold
                  ${style.badgeBg} ${style.badgeText}
                `}
              >
                {subcategoryCount} vendor{subcategoryCount !== 1 ? ' types' : ' type'}
              </span>
            </div>

            {/* Top 3 preview pills */}
            {topNames.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {topNames.map((name) => (
                  <span
                    key={name}
                    className="inline-block text-[11px] font-medium text-stone-500 bg-stone-50 rounded-md px-2 py-0.5 leading-snug"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}

            {/* Hover CTA */}
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-stone-300 group-hover:text-teal-600 transition-colors duration-200">
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </motion.button>
        )
      })}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Level 3: Subcategory Grid
// ---------------------------------------------------------------------------

function SubcategoryGrid({
  dimension,
  node,
  onSelectSubcategory,
}: {
  dimension: BrowseDimension
  node: DimensionNode
  onSelectSubcategory?: (slug: string) => void
}) {
  const style = DIMENSION_STYLES[dimension.slug] || DIMENSION_STYLES['by-category']

  const subcategories = useMemo(
    () =>
      node.subcategories
        .map((slug) => getSubcategoryBySlug(slug))
        .filter((s): s is Subcategory => Boolean(s))
        .sort((a, b) => b.count - a.count),
    [node.subcategories]
  )

  return (
    <div>
      {/* Node header */}
      <div className="mb-6">
        <h3 className="font-display text-xl font-bold text-stone-900 leading-snug">
          {node.name}
        </h3>
        <p className="mt-1 text-sm text-stone-500 leading-relaxed">
          {node.description}
        </p>
      </div>

      <motion.div
        key={`subs-${node.slug}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
      >
        {subcategories.map((sub) => {
          const hasVendors = sub.count > 0

          return (
            <motion.button
              key={sub.slug}
              variants={cardVariants}
              type="button"
              onClick={() => onSelectSubcategory?.(sub.slug)}
              disabled={!onSelectSubcategory}
              className={`
                group relative text-left rounded-2xl border border-black/[0.06]
                p-4 sm:p-5 bg-white
                ${style.hoverBorder} ${hasVendors ? 'hover:shadow-md cursor-pointer' : 'opacity-60'}
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40
                disabled:cursor-default
              `}
              whileHover={hasVendors && onSelectSubcategory ? { scale: 1.025 } : {}}
              whileTap={hasVendors && onSelectSubcategory ? { scale: 0.975 } : {}}
            >
              {/* Color indicator dot */}
              <div
                className={`w-2 h-2 rounded-full ${style.accentBg} mb-3 ${
                  hasVendors ? 'opacity-100' : 'opacity-30'
                }`}
              />

              <h5 className="font-display text-sm font-bold text-stone-900 leading-snug">
                {sub.name}
              </h5>

              <p className="mt-1.5 text-xs text-stone-400 leading-snug">
                {formatCount(sub.count)} vendor{sub.count !== 1 ? 's' : ''}
              </p>

              {hasVendors && onSelectSubcategory && (
                <div className="mt-2.5 flex items-center gap-0.5 text-[11px] font-semibold text-stone-300 group-hover:text-teal-600 transition-colors duration-200">
                  <span>Browse</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              )}
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function BrowseJourneys({
  onSelectSubcategory,
  initialDimension,
  className,
}: BrowseJourneysProps) {
  // Track the navigation path as a stack of selections
  const [selectedDimension, setSelectedDimension] = useState<BrowseDimension | null>(() => {
    if (!initialDimension) return null
    return BROWSE_DIMENSIONS.find((d) => d.slug === initialDimension) ?? null
  })
  const [selectedNode, setSelectedNode] = useState<DimensionNode | null>(null)

  // Navigation callbacks
  const handleSelectDimension = useCallback((dim: BrowseDimension) => {
    setSelectedDimension(dim)
    setSelectedNode(null)
  }, [])

  const handleSelectNode = useCallback((node: DimensionNode) => {
    setSelectedNode(node)
  }, [])

  const handleBreadcrumb = useCallback(
    (index: number) => {
      // index 0 = "Browse" (root), index 1 = dimension, index 2 = node
      if (index === 0) {
        setSelectedDimension(null)
        setSelectedNode(null)
      } else if (index === 1) {
        setSelectedNode(null)
      }
    },
    []
  )

  // Build breadcrumb items
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; slug?: string }[] = [{ label: 'Browse' }]
    if (selectedDimension) {
      items.push({ label: selectedDimension.name, slug: selectedDimension.slug })
    }
    if (selectedNode) {
      items.push({ label: selectedNode.name, slug: selectedNode.slug })
    }
    return items
  }, [selectedDimension, selectedNode])

  // Determine current level
  const level = selectedNode ? 3 : selectedDimension ? 2 : 1

  return (
    <section className={className}>
      {/* Breadcrumb (shown when not at root) */}
      {level > 1 && (
        <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumb} />
      )}

      {/* Content area with animated transitions */}
      <AnimatePresence mode="wait">
        {level === 1 && (
          <DimensionGrid
            key="level-1"
            onSelectDimension={handleSelectDimension}
          />
        )}

        {level === 2 && selectedDimension && (
          <NodeGrid
            key={`level-2-${selectedDimension.slug}`}
            dimension={selectedDimension}
            onSelectNode={handleSelectNode}
          />
        )}

        {level === 3 && selectedDimension && selectedNode && (
          <SubcategoryGrid
            key={`level-3-${selectedDimension.slug}-${selectedNode.slug}`}
            dimension={selectedDimension}
            node={selectedNode}
            onSelectSubcategory={onSelectSubcategory}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
