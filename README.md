# Planviry — Multi-Vertical Occasion Orchestration Platform

> **Implementation Specification — Parts 0–3 (Foundation, Governance, Repository, Domain Core)**
>
> This repository is the canonical monorepo for Planviry, scaffolded per
> **Part II — Repository Architecture** of the Implementation Specification.
> The directory tree, package boundaries, and import rules below are binding;
> any deviation must be recorded as an ADR amendment (see `docs/adr/`).

## What This Is

Planviry is an orchestrator — a single timeline that holds every piece of a
planned occasion (lodging, dining, tickets, venue, vendor) in one cart, one
itinerary, one platform. The structural moat is that the cart and itinerary
are the only components in this market aware of every vertical at once.

This monorepo holds **three apps**, **seven shared packages**, **four
background workers**, **four Supabase edge functions**, and cross-cutting
`shared/` utilities — all sharing one database schema and one TypeScript type
surface.

## Repository Tree (Part II §2.1 — canonical)

```
planviry/
├─ apps/
│  ├─ consumer-web/      Next.js 16 — guest-facing catalog, cart, itinerary
│  ├─ vendor-portal/     Next.js 16 — vendor dashboard, PMS, listings, AI-assist
│  └─ admin-portal/      Next.js 16 — moderation, taxonomy, seeding, analytics
├─ packages/
│  ├─ config/            Shared ESLint, Prettier, TS, Tailwind configs
│  ├─ types/             Shared TS types + Zod schemas (domain model, Part III)
│  ├─ db/                Prisma schema, migrations, seed, RLS — exports `db`
│  ├─ ui/                Shared shadcn/Tailwind component library + design tokens
│  ├─ search/            Algolia client wrappers, index schema, ingestion helpers
│  ├─ analytics/         Event catalog, emitters, PostHog/Segment wrappers
│  └─ email-templates/   React Email templates (Resend delivery)
├─ workers/
│  ├─ ttl-sweep/         Cron — expires pending bookings past TTL
│  ├─ search-sync/       Cron — re-indexes changed inventory into Algolia
│  ├─ notification-digest/ Cron — batches + sends digest emails
│  └─ external-sync/     Syncs Ticketmaster/Expedia content into inventory schema
├─ functions/
│  ├─ stripe-webhook/    Supabase Edge Function — Stripe payment webhooks
│  ├─ booking-ttl/       Supabase Edge Function — TTL enforcement (pg_cron)
│  ├─ search-ingest/     Supabase Edge Function — pushes inventory → Algolia
│  └─ notification-send/ Supabase Edge Function — delivers email/push/in-app
├─ shared/               Cross-cutting utilities: logger, error classes, constants
├─ docs/                 ADRs, runbooks, API reference, specification parts
├─ supabase/             Supabase project config, migrations, seed SQL, RLS
├─ turbo.json            Turborepo task pipeline
├─ tsconfig.base.json    Shared TS compiler options
├─ package.json          Monorepo root (Bun workspaces + Turbo)
└─ Caddyfile             Edge gateway (port 81 → 3000)
```

## Import Rules (Part II §2.2 — strictly hierarchical)

| Package             | May Import From                                       | May NOT Import From                                   |
| ------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| `apps/consumer-web` | `packages/{ui,types,search,analytics,email-templates}`| `apps/{vendor-portal,admin-portal}`, `workers/*`, `functions/*` |
| `apps/vendor-portal`| `packages/{ui,types,search,analytics}`               | `apps/{consumer-web,admin-portal}`, `workers/*`, `functions/*` |
| `apps/admin-portal` | `packages/{ui,types,db(read-only)}`                  | other apps, `workers/*`                               |
| `packages/db`       | `packages/types`                                      | all apps, workers, functions, other packages          |
| `packages/ui`       | `packages/types`, `packages/config`                   | `packages/db`, `packages/search`, all apps            |
| `packages/search`   | `packages/types`, `packages/db` (schema types only)   | all apps, workers, functions                          |
| `workers/*`         | `packages/{db,types,search}`, `shared/`               | all apps, `packages/ui`                               |
| `functions/*`       | `packages/types`, `shared/`                           | all apps, `packages/ui` (uses Supabase client direct) |
| `shared/`           | `packages/types`                                      | all apps, all packages (shared is a leaf)             |

Circular dependencies between packages are a **build failure**. CI enforces
this via `dependency-cruiser` (`bun run lint:deps`).

## Build Order (Part II §2.3)

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

## Getting Started

```bash
# install all workspace dependencies
bun install

# run the consumer web app on port 3000 (the only user-visible route: /)
bun run dev

# push the database schema
bun run db:push

# lint + typecheck the whole monorepo
bun run lint
bun run typecheck
```

## Specification Status

| Part | Title                          | Status      | Location                  |
| ---- | ------------------------------ | ----------- | ------------------------- |
| 0    | Objective & Completion Def.    | ✅ Complete | `docs/00-objective.md`    |
| I    | Governance (Layer 0)           | ✅ Complete | `docs/01-governance.md`   |
| II   | Repository Architecture        | ✅ Complete | `docs/02-repository.md`   |
| III  | Domain Definition              | ✅ Complete | `packages/types/` + `docs/03-domain.md` |
| IV+  | Business Rules → Customer Portal | ⏳ Pending | —                         |

## Constraints (Part I §1.1.6 — binding)

- **CONSTRAINT-001**: Every `InventoryItem` must be addable to the same `Cart`
  regardless of category (cross-vertical cart invariant).
- **CONSTRAINT-002**: No category page may render without a location — enforced
  at API + client guard.
- **CONSTRAINT-003**: The Vertical Row swaps feed content in place — never
  triggers full-page navigation.
- **CONSTRAINT-004**: Vendor dashboards are account-scoped at the RLS layer.
- **CONSTRAINT-005**: All booking state transitions go through the Reservation
  FSM (Part V) — no direct status writes.
