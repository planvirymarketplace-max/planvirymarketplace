/**
 * @planviry/config
 *
 * Shared configuration entry point for the Planviry monorepo.
 * Re-exports the base TypeScript compiler options so every workspace
 * package can extend them via `extends: "@planviry/config/tsconfig"`.
 *
 * Part II §2.1 — Repository Architecture (packages/config).
 * Part I  §1.3 — Architecture Principles (coding/naming/repository standards).
 */

export const MONOREPO_ROOT = ["apps/*", "packages/*", "workers/*", "functions/*"] as const;

export const SHARED_COMPILER_OPTIONS = {
  target: "ES2022",
  module: "esnext",
  moduleResolution: "bundler",
  strict: true,
  esModuleInterop: true,
  skipLibCheck: true,
  forceConsistentCasingInFileNames: true,
  isolatedModules: true,
  resolveJsonModule: true,
  incremental: true,
} as const;

export const NAMING_CONVENTIONS = {
  // Part I §1.3.3 — Naming Standards
  packages: "@planviry/<kebab-case-name>",
  domainIds: "DOM-XXX",
  businessRules: "BR-[MODULE]-[SEQ]",
  requirements: "REQ-XXXXX",
  apiEndpoints: "API-[MODULE]-[SEQ]",
  components: "COMP-[MODULE]-[SEQ]",
  tests: "TEST-[MODULE]-[SEQ]",
  adrs: "ADR-XXX",
  specGaps: "SPEC-GAP-XXXXX",
} as const;

export default { MONOREPO_ROOT, SHARED_COMPILER_OPTIONS, NAMING_CONVENTIONS };
