# supabase/ — Planviry Supabase Project

Part II §2.1 — `supabase/` holds Supabase project config, migration files, seed SQL, and RLS policy SQL.

## Layout

```
supabase/
├─ config.toml           Supabase project config (local + preview envs)
├─ migrations/           SQL migration files — Part VI §6.5 (Migration Strategy)
└─ seed/                 Seed SQL — Part VI §6.8 (Seed Data)
    └─ seed.sql
```

> **Note:** The local-dev database during the Parts 0–3 scaffold is SQLite via
> Prisma (`packages/db/`). The Supabase/Postgres migration files here are the
> *production* schema surface, authored in Part VI (Data Layer). They are
> scaffolded empty now so the boundary exists.

## When this fills in

- **Part VI** — full schema DDL, migrations, rollback, RLS policies.
- **Part VII** — auth configuration (JWT lifecycles, OAuth providers).
- **Part XXX** — infrastructure (DNS, storage buckets, replication).
