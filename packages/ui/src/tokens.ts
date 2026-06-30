/**
 * Planviry design system tokens.
 *
 * Part XLVII §47.3 — Brand Color Palette (binding).
 * Part XXV  §25.x  — Design System token categories.
 *
 * These tokens are the single source of truth. Tailwind config in each app
 * maps CSS variables that resolve to these values.
 */

export const BRAND_COLORS = {
  /** Primary — logo / primary actions. Part XLVII §47.2. */
  primary: "#F47245",
  /** Accent 1 — teal emphasis text (e.g. hero "Event Vendors"). §47.3. */
  accentTeal: "#009689",
  /** Accent 2 — purple. §47.3. */
  accentPurple: "#8559EC",
  /** Accent 3 / neutral. §47.3. */
  accentNeutral: "#DBE0E0",
  /** Base light. §47.3. */
  baseLight: "#FFFFFF",
  /** Base dark. §47.3. */
  baseDark: "#010000",
} as const;

export const TYPOGRAPHY = {
  /** Display / headline — Playfair (Medium Italic). Part XLVII §47.4. */
  display: { fontFamily: "Playfair, serif", weight: 500, style: "italic" as const },
  /** Body / UI — Syne (weight 57 or nearest). Part XLVII §47.4. */
  body: { fontFamily: "Syne, sans-serif", weight: 57 },
} as const;

export const ICON_LIBRARY = "lucide" as const;
export const ICON_STYLE = "stroke" as const; // Part XLVII §47.6 — Heroicons/lucide stroke default.

export type BrandColor = keyof typeof BRAND_COLORS;
