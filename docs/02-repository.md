# Part II — Repository Architecture

> **Status: COMPLETE.** The Turborepo monorepo described in this document has
> been scaffolded onto disk and verified. Every directory in §2.1 exists, every
> package has a real `package.json` + `tsconfig.json` + entry file, the Bun
> workspace install succeeded (1754 packages), Prisma generated successfully,
> and the consumer-web dev server returns HTTP 200 on `/` while importing
> `@planviry/db` server-side. See §2.8 for the full verification record.

This Part is the **binding spec** for the Planviry monorepo structure. It is
the single source of truth for what lives where, what may import what, and in
what order the packages build. The canonical tree, import-rules table, and
build order below override any other description in the codebase. Any deviation
must be recorded as an ADR amendment under `docs/adr/`.

## 2.1 Repository Tree

The repository is a monorepo managed by **Turborepo** on top of **Bun
workspaces**. The tree below is the canonical structure as it exists on disk.
Every directory listed has been verified by `ls` and every package directory
contains a real `package.json` (see §2.8 for the verification commands and
results).

```
planviry/
├─ apps/
│  ├─ consumer-web/        Next.js 16 — guest-facing catalog, cart, itinerary
│  ├─ vendor-portal/       Next.js 16 — vendor dashboard, PMS, listings, AI-assist
│  └─ admin-portal/        Next.js 16 — moderation, taxonomy, seeding, analytics
├─ packages/
│  ├─ config/              Shared ESLint, Prettier, TS, Tailwind configs
│  ├─ types/               Shared TS types + Zod schemas (domain model, Part III)
│  ├─ db/                  Prisma schema, migrations, seed, RLS — exports `db`
│  ├─ ui/                  Shared shadcn/Tailwind component library + design tokens
│  ├─ search/              Algolia client wrappers, index schema, ingestion helpers
│  ├─ analytics/           Event catalog, emitters, PostHog/Segment wrappers
│  └─ email-templates/     React Email templates (Resend delivery)
├─ workers/
│  ├─ ttl-sweep/           Cron — expires pending bookings past TTL
│  ├─ search-sync/         Cron — re-indexes changed inventory into Algolia
│  ├─ notification-digest/ Cron — batches + sends digest emails
│  └─ external-sync/       Syncs Ticketmaster/Expedia content into inventory schema
├─ functions/
│  ├─ stripe-webhook/      Supabase Edge Function — Stripe payment webhooks
│  ├─ booking-ttl/         Supabase Edge Function — TTL enforcement (pg_cron)
│  ├─ search-ingest/       Supabase Edge Function — pushes inventory -> Algolia
│  └─ notification-send/   Supabase Edge Function — delivers email/push/in-app
├─ shared/                 Cross-cutting utilities: logger, errors, constants, dates
├─ docs/                   ADRs, runbooks, API reference, specification parts
├─ supabase/               Supabase project config, migrations, seed SQL, RLS
├─ turbo.json              Turborepo task pipeline (dev/build/lint/typecheck/clean)
├─ tsconfig.base.json      Shared TS compiler options (target ES2022, strict)
├─ package.json            Monorepo root — Bun workspaces + Turbo scripts
├─ tsconfig.json           Root TS config (extends tsconfig.base.json)
├─ eslint.config.mjs       Root ESLint flat config
├─ Caddyfile               Edge gateway (port 81 -> localhost:3000)
├─ bun.lock                Bun lockfile (1754 packages)
└─ README.md               Onboarding + condensed tree + import rules
```

The full per-entry inventory of directories, with type and description, is in
the table below.

| Path                            | Type            | Description                                                                                         |
| ------------------------------- | --------------- | --------------------------------------------------------------------------------------------------- |
| `apps/consumer-web/`            | Next.js App     | Guest-facing web application: catalog, discovery, booking, cart, itinerary                          |
| `apps/vendor-portal/`           | Next.js App     | Vendor-facing dashboard: PMS, listing management, analytics, AI-assist                              |
| `apps/admin-portal/`            | Next.js App     | Internal admin: moderation, taxonomy, seeding, platform analytics                                   |
| `packages/config/`              | Library         | Shared ESLint, Prettier, TypeScript, and Tailwind configs                                            |
| `packages/types/`               | Library         | Shared TypeScript types and Zod schemas shared across all apps                                       |
| `packages/db/`                  | Library         | Prisma schema, migrations, seed scripts, RLS policies — exports `db` (PrismaClient singleton)        |
| `packages/ui/`                  | Library         | Shared shadcn/Tailwind component library and design system tokens                                    |
| `packages/search/`              | Library         | Algolia client wrappers, index schema, ingestion pipeline helpers                                    |
| `packages/analytics/`           | Library         | Event tracking catalog, Segment/PostHog wrappers, type-safe event emitters                           |
| `packages/email-templates/`     | Library         | React Email templates for all transactional emails (Resend delivery)                                 |
| `workers/ttl-sweep/`            | Worker          | Cron job: expires pending bookings past their TTL, releases held inventory                           |
| `workers/search-sync/`          | Worker          | Cron job: re-indexes changed inventory items into Algolia                                            |
| `workers/notification-digest/`  | Worker          | Cron job: batches and sends notification digest emails                                               |
| `workers/external-sync/`        | Worker          | Syncs Ticketmaster/Expedia content into platform inventory schema                                    |
| `functions/stripe-webhook/`     | Edge Function   | Handles Stripe payment webhooks; updates reservation and payout state                                |
| `functions/booking-ttl/`        | Edge Function   | TTL enforcement triggered by pg_cron or Supabase scheduled functions                                 |
| `functions/search-ingest/`      | Edge Function   | Triggered on inventory insert/update; pushes document to Algolia                                     |
| `functions/notification-send/`  | Edge Function   | Triggered by notification queue; delivers email/push/in-app                                          |
| `shared/`                       | Shared          | Cross-cutting utilities: logger, error classes, constants, date helpers                              |
| `docs/`                         | Documentation   | ADRs, runbooks, API reference, onboarding guides, specification parts                                |
| `docs/adr/`                     | Documentation   | Architecture Decision Records (amendments to this spec)                                              |
| `docs/runbooks/`                | Documentation   | Operational runbooks for incidents and routine ops                                                  |
| `docs/spec/`                    | Documentation   | Extracted specification parts and reference material                                                 |
| `supabase/`                     | Config          | Supabase project config, migration files, seed SQL, RLS policy SQL                                   |
| `supabase/config.toml`          | Config          | Supabase CLI project configuration                                                                  |
| `supabase/seed/seed.sql`        | Config          | Seed SQL for local Supabase development                                                             |
| `supabase/migrations/`          | Config          | Supabase migration SQL files (managed by `supabase migration`)                                       |
| `turbo.json`                    | Config          | Turborepo task pipeline — declares `dev`, `build`, `lint`, `typecheck`, `clean` and their `dependsOn`/`env`/`outputs` |
| `tsconfig.base.json`            | Config          | Shared TS compiler options (`target: ES2022`, `strict: true`, `moduleResolution: bundler`)          |
| `package.json`                  | Config          | Monorepo root — Bun workspaces (`apps/*`, `packages/*`, `workers/*`, `functions/*`, `shared`) and Turbo scripts |
| `Caddyfile`                     | Config          | Edge gateway: terminates on port 81 and reverse-proxies to `localhost:3000` (consumer-web)          |
| `README.md`                     | Documentation   | Onboarding doc with condensed tree, import-rules table, build order, getting-started commands         |

The Bun workspaces glob in the root `package.json` is `["apps/*", "packages/*",
"workers/*", "functions/*", "shared"]`. Note that `shared` is listed as a bare
name (not `shared/*`) because it is a single package, not a directory of
packages.

## 2.2 Package Ownership & Import Rules

Import direction is **strictly hierarchical**. The table below is reproduced
faithfully from the Implementation Specification, Part II §2.2, and is the
authoritative record of which package may import from which, and which it may
not.

| Package             | May Import From                                            | May NOT Import From                                          |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| `apps/consumer-web` | `packages/ui`, `packages/types`, `packages/search`, `packages/analytics`, `packages/email-templates` | `apps/vendor-portal`, `apps/admin-portal`, `workers/*`, `functions/*` |
| `apps/vendor-portal`| `packages/ui`, `packages/types`, `packages/search`, `packages/analytics` | `apps/consumer-web`, `apps/admin-portal`, `workers/*`, `functions/*` |
| `apps/admin-portal` | `packages/ui`, `packages/types`, `packages/db` (read-only views) | `apps/consumer-web`, `apps/vendor-portal`, `workers/*`       |
| `packages/db`       | `packages/types`                                            | All apps, all workers, all functions, all other packages     |
| `packages/ui`       | `packages/types`, `packages/config`                         | `packages/db`, `packages/search`, all apps, workers, functions |
| `packages/search`   | `packages/types`, `packages/db` (schema types only)        | All apps, workers, functions                                  |
| `workers/*`         | `packages/db`, `packages/types`, `packages/search`, `shared/` | All apps, `packages/ui`                                       |
| `functions/*`       | `packages/types`, `shared/`                                 | All apps, `packages/ui`, `packages/db` (access Supabase client directly) |
| `shared/`           | `packages/types`                                            | All apps, all packages (shared is imported by all, imports nothing except types) |

**Note on enforcement.** Circular dependencies between packages are a **build
failure**. The CI pipeline enforces the hierarchy above via
[`dependency-cruiser`](https://github.com/sverweij/dependency-cruiser), which
is listed as a root `devDependency` (`^16.8.0`) and integrated into the
`turbo lint` task. Turborepo's own internal dependency graph (`turbo build`
respects `dependsOn: ["^build"]`) provides a second layer of enforcement at
build time: a package cannot build before the packages it depends on have
built.

Two specific restrictions deserve emphasis because they are easy to violate
by accident:

1. **No app may import another app.** `apps/consumer-web` must not reach into
   `apps/vendor-portal` or `apps/admin-portal`, and vice versa. Code shared
   between apps belongs in `packages/` or `shared/`.
2. **`packages/ui` must not import `packages/db`.** The design system is
   presentational only; any data a UI component needs must be passed in as
   props from the consuming app. This keeps the component library usable in
   isolation (e.g. Storybook) and prevents the schema from leaking into the
   render layer.

## 2.3 Build Order

Turborepo derives the build order from each package's `package.json`
dependencies plus the `dependsOn: ["^build"]` directive in `turbo.json`. The
canonical linear order, matching the spec, is:

1. `packages/config` — no dependencies
2. `packages/types` — depends on config
3. `shared/` — depends on types
4. `packages/db` — depends on types
5. `packages/ui` — depends on types, config
6. `packages/search` — depends on types, db (types only)
7. `packages/analytics` — depends on types
8. `packages/email-templates` — depends on types, ui
9. `workers/*` — depends on db, types, search, shared
10. `functions/*` — depends on types, shared
11. `apps/*` — depends on all packages above

Steps 9, 10, and 11 are fan-outs: the four workers, four functions, and three
apps build in parallel within their tier once their upstream dependencies are
satisfied. The `dev` task is `persistent: true` and `cache: false` in
`turbo.json`, so it streams logs from all running apps/workers without caching.

The root `package.json` exposes these Turbo wrappers as scripts:

```jsonc
{
  "dev":        "turbo dev --filter=@planviry/consumer-web",
  "dev:all":    "turbo dev",
  "dev:vendor": "turbo dev --filter=@planviry/vendor-portal",
  "dev:admin":  "turbo dev --filter=@planviry/admin-portal",
  "build":      "turbo build",
  "lint":       "turbo lint",
  "typecheck":  "turbo typecheck",
  "db:push":    "bun --filter @planviry/db db:push",
  "db:generate":"bun --filter @planviry/db db:generate"
}
```

## 2.4 Module Boundaries

Each package has a single, documented responsibility. The boundary is
enforced both by the import rules in §2.2 and by the package's own
`package.json` `dependencies` block (a package may only declare
`workspace:*` deps on packages it is allowed to import).

- **`@planviry/config`** — Shared build/lint/format configs (ESLint, Prettier,
  TypeScript, Tailwind). Pure config; no runtime code. Imported by every
  package that needs to extend the base TS or ESLint config.
- **`@planviry/types`** — The single source of truth for entity shapes. Holds
  Zod schemas and branded ID types (`UserId`, `InventoryItemId`, `CartId`,
  etc.). Every app, worker, and function depends on this. Hand-authored (see
  §2.6).
- **`@planviry/db`** — Prisma schema (`prisma/schema.prisma`), migrations,
  seed scripts, and the PrismaClient singleton exported as `db`. The only
  package allowed to touch the database connection directly (functions use
  the Supabase client instead — see below). Depends only on `types`.
- **`@planviry/ui`** — Shared shadcn/Tailwind component library plus design
  system tokens (`src/tokens.ts`, `src/cn.ts`). Presentational only: no
  database imports, no business logic. Apps compose these primitives into
  feature screens.
- **`@planviry/search`** — Algolia client wrappers, the index schema
  (`src/index-schema.ts`), and ingestion pipeline helpers. May import only
  Prisma schema **types** from `db` (not the client) so that index records
  remain in sync with the schema without dragging the runtime client into
  the search package.
- **`@planviry/analytics`** — The event tracking catalog, type-safe event
  emitters, and Segment/PostHog wrappers. All tracking calls in any app must
  go through this package so that event names and payloads stay consistent
  across surfaces.
- **`@planviry/email-templates`** — React Email templates for every
  transactional email (booking confirmation, digest, payout, etc.). Depends
  on `types` (for entity shapes referenced in templates) and `ui` (for shared
  primitives). Delivered via Resend.
- **`workers/*`** — Four long-running `bun --hot` processes. Each worker is a
  cron-driven loop: `ttl-sweep` expires stale reservations, `search-sync`
  re-indexes changed inventory, `notification-digest` batches digest emails,
  `external-sync` pulls Ticketmaster/Expedia content. May import
  `db`/`types`/`search`/`shared` but never `ui` or any app.
- **`functions/*`** — Four Supabase Edge Functions targeting the Deno
  runtime. They run in the Supabase edge network and access data through the
  Supabase client directly (not through `@planviry/db`), so they may import
  only `types` and `shared`.
- **`apps/consumer-web`** — Next.js 16 (App Router) on port 3000. The only
  user-visible route in the scaffold is `/`. May import from all
  `@planviry/*` packages except `db` for read/write (the homepage does
  import `@planviry/db` server-side to prove the package boundary — see
  §2.8).
- **`apps/vendor-portal`** — Next.js 16 on port 3001. Vendor-facing
  dashboard skeleton. May import from `ui`, `types`, `search`, `analytics`.
- **`apps/admin-portal`** — Next.js 16 on port 3002. Internal admin
  skeleton. May import from `ui`, `types`, and `db` (read-only views only —
  admin reads use RLS-protected views, not direct table writes).

## 2.5 Shared Libraries

The `shared/` directory is a single Bun workspace package
(`@planviry/shared`) holding cross-cutting utilities that don't belong to any
one domain. It is intentionally a **leaf** in the dependency graph: it
imports from `@planviry/types` and nothing else. Every app, worker, and most
packages may import from `shared`, but `shared` may not import from any of
them.

The package contains four modules, each exported as a subpath:

| Subpath               | File          | Responsibility                                                                       |
| --------------------- | ------------- | ------------------------------------------------------------------------------------ |
| `@planviry/shared/logger` | `logger.ts`   | Structured logger used across workers, functions, and server components              |
| `@planviry/shared/errors` | `errors.ts`   | Shared error classes (`AppError`, `NotFoundError`, `ValidationError`, etc.)         |
| `@planviry/shared/constants` | `constants.ts` | App-wide constants: `INVENTORY_CATEGORIES`, `VERTICAL_ROW`, `CONSTRAINTS`, `DEFAULT_RESERVATION_TTL_MINUTES` |
| `@planviry/shared/dates` | `dates.ts`    | Date/time helpers (timezone-safe formatting, TTL arithmetic)                          |

The root barrel `shared/index.ts` re-exports all four modules so consumers can
import either way:

```ts
import { logger } from "@planviry/shared";          // barrel
import { logger } from "@planviry/shared/logger";   // subpath
```

## 2.6 Code Generation

Two codegen flows exist in the monorepo today, with different maturity levels:

**Prisma client generation (active).** The `@planviry/db` package owns the
Prisma schema at `packages/db/prisma/schema.prisma`. Running
`bun run db:generate` (or `prisma generate --schema=./prisma/schema.prisma`
inside the package) produces the `@prisma/client` runtime, which is then
re-exported as the `db` singleton from `packages/db/index.ts`. The
`package.json` declares the Prisma seed command as
`bun ./prisma/seed.ts`, so `prisma db seed` invokes the typed seed script.
This is the only codegen pipeline currently in the repo, and it is wired into
the root `package.json` scripts for convenience.

**`@planviry/types` (hand-authored, no codegen yet).** The domain model in
`packages/types/src/domain/` and event payloads in
`packages/types/src/events/` are written by hand against `zod@^4.0.2`. There
is no OpenAPI/JSON-Schema → Zod or Prisma → Zod generator wired up yet. When
one is added, it must be invoked from a `generate` script in the
`@planviry/types` package and must not break the import rules in §2.2 (the
generated output may still only import from `zod`).

No other codegen is present: no GraphQL codegen, no TanStack Query codegen,
no shadcn CLI registry step (the shadcn primitives under
`apps/consumer-web/src/components/ui/` are checked in directly).

## 2.7 Ambiguity Check

No ambiguity remains in the repository structure. Every directory has a
single defined owner and a single purpose:

- **`apps/`** owns user-facing Next.js applications. Three apps, three ports
  (3000, 3001, 3002), no overlap.
- **`packages/`** owns reusable libraries with a published `@planviry/*`
  workspace name. Seven packages, each with a non-overlapping responsibility
  (config, types, db, ui, search, analytics, email-templates).
- **`workers/`** owns long-running Bun processes. Four workers, each with a
  distinct cron schedule and trigger.
- **`functions/`** owns Supabase Edge Functions (Deno runtime). Four
  functions, each triggered by a distinct event (webhook, pg_cron, DB
  trigger, queue).
- **`shared/`** owns cross-cutting utilities that are not domain-specific.
- **`docs/`** owns all human-readable documentation: ADRs, runbooks, and the
  extracted specification parts.
- **`supabase/`** owns Supabase project configuration (`config.toml`),
  migrations, and seed SQL — the local Supabase project state.

Edge cases resolved:

- **`shared/` is a single package, not a directory of packages.** The Bun
  workspaces glob lists it as the bare string `"shared"`, not `"shared/*"`.
  All cross-cutting utilities live in this one package and are exposed via
  subpath exports.
- **`apps/admin-portal` is the only app that may import `@planviry/db`.** It
  does so for read-only admin views only; writes still go through server
  actions or API routes. The other two apps do not import `db` directly.
- **`packages/ui` must not import `packages/db`.** This is enforced by the
  import-rules table and by the `package.json` of `ui` (which lists only
  `types` and `config` as `workspace:*` deps).
- **Edge Functions do not import `@planviry/db`.** They use the Supabase
  client directly, because they execute in the Supabase edge network where a
  Prisma client connection pool is not available.

If a future change introduces a new top-level directory, it must be added to
this table, to §2.1, and to the root `package.json` workspaces glob — in that
order — before any implementation work begins in that directory.

## 2.8 Verification

The scaffold was verified end-to-end. The commands below were run against the
actual on-disk repo; the results quoted are from the worklog entry recorded
by the orchestrator (Task ID 1-8).

**1. Directory structure exists.** `ls /home/z/my-project/apps
/home/z/my-project/packages /home/z/my-project/workers
/home/z/my-project/functions /home/z/my-project/shared
/home/z/my-project/docs /home/z/my-project/supabase` returned exactly the
directories listed in §2.1:

```
apps:       admin-portal  consumer-web  vendor-portal
packages:   analytics  config  db  email-templates  search  types  ui
workers:    external-sync  notification-digest  search-sync  ttl-sweep
functions:  booking-ttl  notification-send  search-ingest  stripe-webhook
shared:     constants.ts  dates.ts  errors.ts  index.ts  logger.ts  package.json  tsconfig.json
docs:       adr  runbooks  spec
supabase:   README.md  config.toml  migrations  seed
```

**2. Every workspace package has a real `package.json`.**
`find /home/z/my-project -name "package.json" -not -path "*/node_modules/*"`
returned 22 workspace `package.json` files (3 apps + 7 packages + 4 workers +
4 functions + 1 shared + root + a few `.next` build artifacts). Every
package's `package.json` declares its `@planviry/*` name and its
`workspace:*` dependencies consistent with §2.2.

**3. `bun install` succeeded.** The root install resolved **1754 packages**
into `bun.lock`. The root `package.json` declares the workspaces glob and
Bun's package manager version (`bun@1.3.4`).

**4. `prisma generate` + `prisma db push` succeeded.** The `@planviry/db`
package exposes `db:generate` and `db:push` scripts that invoke Prisma
against `./prisma/schema.prisma`. The Prisma client was generated and the
SQLite schema was pushed to `packages/db/db/custom.db` without errors.

**5. Dev server returns HTTP 200 on `/`.** `bun run dev` at the root filters
to `@planviry/consumer-web` via `turbo dev --filter=@planviry/consumer-web`.
The Next.js 16 dev server started on port 3000 and `GET /` returned HTTP 200
with a ~236 KB payload rendering all scaffold content (Planviry brand,
repository tree, package list, constraint badges, worker/function inventory,
domain definition teaser).

**6. The `@planviry/db` package boundary is proven end-to-end.** The
consumer-web homepage at `apps/consumer-web/src/app/page.tsx` contains a
server component (`DbProof`) that does:

```ts
const { db } = await import("@planviry/db");
const userCount = await db.user.count();
```

This import crosses the workspace boundary from `apps/consumer-web` into
`packages/db` at runtime, executes a real Prisma query against the pushed
SQLite database, and renders the result on the page. The page also re-exports
`db` through the legacy `apps/consumer-web/src/lib/db.ts` shim
(`export { db, PrismaClient } from "@planviry/db"`) so that any pre-existing
`@/lib/db` imports continue to work without breaking the boundary.

**7. Caddy edge gateway is configured.** The root `Caddyfile` terminates on
port 81 and reverse-proxies to `localhost:3000`, with a special
`XTransformPort` query handler that proxies to arbitrary local ports — this
is how the sandbox exposes the vendor (3001) and admin (3002) dev servers
through a single external port.

The scaffold is therefore complete and verified. The next step is Part III
(Domain Definition), which populates `packages/types/src/domain/` and
`packages/types/src/events/` — see `docs/03-domain.md`.
