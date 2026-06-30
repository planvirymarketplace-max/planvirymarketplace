/**
 * @planviry/ui — shared component library barrel.
 *
 * Part II  §2.1 — packages/ui owns the shared shadcn/Tailwind library.
 * Part II  §2.2 — packages/ui may import from packages/types + packages/config only.
 * Part XXV §25.x — Design System tokens (typography, spacing, color, motion).
 * Part XLVII     — Brand & Visual Identity (logo #F47245, Playfair + Syne).
 *
 * NOTE: The existing shadcn component set currently lives in
 * `apps/consumer-web/src/components/ui/`. Per Part XLVI (Frontend Retrofit
 * Registry), the shared components will be promoted into this package during
 * the Phase 9 (Frontend Framework) build. This package is scaffolded now so
 * the boundary exists; consumers import from `@planviry/ui` once promoted.
 */

export { cn } from "./cn";
export * from "./tokens";
