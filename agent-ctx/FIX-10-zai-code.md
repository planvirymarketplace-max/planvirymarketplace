# FIX-10 — Align `inventory_items.category` enum values to live Supabase

**Task ID:** FIX-10
**Agent:** Z.ai Code (sub-agent — enum-alignment fix)
**Date:** 2026-06 (continuation of FIX-5/FIX-7/FIX-8 series)

## Problem

The live Supabase `inventory_category` Postgres enum only allows these 7 values:
`LODGING, DINING, EVENT_TICKET, ACTIVITY, TRANSPORT, VENUE_RENTAL, SERVICE`.

But the codebase used `VENDOR_SERVICE` (→ `SERVICE`) and `EXPERIENCE` (→ `ACTIVITY`)
in 18 source files, causing two live production bugs:

1. **4 create-listing forms INSERT `category='VENDOR_SERVICE'`** → Postgres
   rejects with `invalid input value for enum inventory_category` → vendors
   cannot create service listings (the only form that actually runs the
   broken INSERT is `/vendor/create-listing/service`; the other 3 forms
   — venue / dining / transport — already use `VENUE_RENTAL` / `DINING` /
   `TRANSPORT` and were CORRECT).
2. **Surface-map filters `category=eq.VENDOR_SERVICE` and `category=eq.EXPERIENCE`**
   return 0 rows → `/services`, `/things-to-do`, `/plan`, and the
   VENDOR_SERVICE half of `/party` show no live inventory.

## Fix

Replaced every string literal / object-key usage of `VENDOR_SERVICE` → `SERVICE`
and `EXPERIENCE` → `ACTIVITY` ONLY where the string refers to the
`inventory_items.category` enum value. Did NOT change:

- Human-readable display labels ("Vendor Services", "Experiences",
  "Experience", etc.) that ride alongside the enum values in
  `CATEGORY_LABELS` / `CATEGORY_OPTIONS` / `label:` fields.
- The plural `EXPERIENCES` const (SEO landing-page data array in
  `data/experiences.ts`) — that's a separate concept from the DB enum.
- Pre-existing TypeScript errors in `[slug]/[citySlug]/[verticalSlug]/page.tsx`
  (JSX closing-tag mismatch — pre-FIX-10).

## Files changed (18 total)

### `shared/` (3 files)

1. **`shared/pricing-adapter.ts`** — `pricingModelForCategory` switch:
   - `case 'EXPERIENCE': return 'PER_PERSON'` → `case 'ACTIVITY': return 'PER_PERSON'`
   - `case 'VENDOR_SERVICE':` → `case 'SERVICE':`
2. **`shared/availability-adapter.ts`** — `checkAvailability` switch:
   - `case 'VENDOR_SERVICE': case 'EXPERIENCE':` → `case 'SERVICE': case 'ACTIVITY':`
   - Updated 2 docstring comments that referenced the old enum names.
3. **`shared/constants.ts`** — `INVENTORY_CATEGORIES` array:
   - `"EXPERIENCE"` → `"ACTIVITY"`, `"VENDOR_SERVICE"` → `"SERVICE"`.
   - Reordered to put the 7 live enum values first (LODGING, DINING,
     EVENT_TICKET, ACTIVITY, TRANSPORT, VENUE_RENTAL, SERVICE) and the
     legacy non-enum categories (VACATION_RENTAL, FLIGHT, CAR_RENTAL,
     VENUE_SPACE, DINING_RESERVATION, CRUISE_CABIN, TRANSIT) below a
     divider with a comment noting they are NOT insertable.

### `apps/consumer-web/src/lib/` (3 files)

4. **`lib/surface-inventory-map.ts`** — the canonical surface → category map
   (this is the file that drives `SurfaceLiveInventory`'s actual
   `query.eq('category', ...)` / `query.in('category', ...)`):
   - `services: { category: 'VENDOR_SERVICE' }` → `'SERVICE'`
   - `'things-to-do': { category: 'EXPERIENCE' }` → `'ACTIVITY'`
   - `party: { categories: ['VENUE_RENTAL', 'VENDOR_SERVICE'] }` → `['VENUE_RENTAL', 'SERVICE']`
   - `plan: { category: 'VENDOR_SERVICE' }` → `'SERVICE'`
   - Updated the docstring comment block + added a FIX-10 note.
5. **`lib/itinerary/extractEvents.ts`** — `CATEGORY_COLORS` object keys:
   - `VENDOR_SERVICE:` → `SERVICE:`, `EXPERIENCE:` → `ACTIVITY:`
6. **(unchanged)** `lib/itinerary/filters.ts`, `lib/itinerary/detectConflicts.ts` —
   no enum references found; nothing to change.

### `apps/consumer-web/src/app/vendor/` (8 files)

7. **`app/vendor/create-listing/service/page.tsx`** — the INSERT that
   actually 500'd at runtime:
   - `category: 'VENDOR_SERVICE'` (in `inventory_items` INSERT) → `'SERVICE'`
   - `category: 'VENDOR_SERVICE'` (in `domain_events` INSERT payload) → `'SERVICE'`
   - UI display text `<p>Category: VENDOR_SERVICE</p>` → `Category: SERVICE`
8. **`app/vendor/create-listing/page.tsx`** — chooser card:
   - `category: 'VENDOR_SERVICE'` (on the "List a service" card) → `'SERVICE'`
9. **`app/vendor/dashboard/page.tsx`** — 6-module grid:
   - `category: 'VENDOR_SERVICE'` (on the "Services" module card) → `'SERVICE'`
10. **`app/vendor/analytics/page.tsx`** — `CATEGORY_LABELS` + `CATEGORY_ORDER`:
    - `VENDOR_SERVICE: 'Services'` → `SERVICE: 'Services'`
    - `EXPERIENCE: 'Experiences'` → `ACTIVITY: 'Experiences'`
    - `CATEGORY_ORDER` array: same 2 swaps.
11. **`app/vendor/onboarding/page.tsx`** — `CATEGORIES` select options:
    - `{ value: 'VENDOR_SERVICE', label: 'Services' }` → `{ value: 'SERVICE', label: 'Services' }`
12. **`app/vendor/listings/page.tsx`** — `CATEGORY_OPTIONS` filter dropdown
    + `CATEGORY_STYLES` color map:
    - `{ value: 'VENDOR_SERVICE', label: 'Vendor Service' }` → `{ value: 'SERVICE', label: 'Service' }`
    - `{ value: 'EXPERIENCE', label: 'Experience' }` → `{ value: 'ACTIVITY', label: 'Activity' }`
    - `CATEGORY_STYLES`: `VENDOR_SERVICE:` → `SERVICE:`, `EXPERIENCE:` → `ACTIVITY:`
13. **`app/vendor/listings/[id]/edit/page.tsx`** — `CATEGORIES` select options:
    - `'VENDOR_SERVICE'` → `'SERVICE'`, `'EXPERIENCE'` → `'ACTIVITY'`
14. **`app/vendor/bookings/page.tsx`** — `CATEGORY_STYLES` color map:
    - `VENDOR_SERVICE:` → `SERVICE:`, `EXPERIENCE:` → `ACTIVITY:`

### `apps/consumer-web/src/app/` (consumer-facing pages) (3 files)

15. **`app/services/page.tsx`** — `<GatedSurfacePage inventoryCategory="VENDOR_SERVICE" />` → `"SERVICE"`
16. **`app/things-to-do/page.tsx`** — `<GatedSurfacePage inventoryCategory="EXPERIENCE" />` → `"ACTIVITY"`
17. **`app/party/page.tsx`** — `<GatedSurfacePage inventoryCategories={['VENUE_RENTAL', 'VENDOR_SERVICE']} />` → `['VENUE_RENTAL', 'SERVICE']`

### `apps/consumer-web/src/components/` + API (2 files)

18. **`components/itinerary/ItineraryTimeline.tsx`** — `CATEGORY_LABELS` map:
    - `VENDOR_SERVICE: 'Service'` → `SERVICE: 'Service'`
    - `EXPERIENCE: 'Experience'` → `ACTIVITY: 'Activity'`
19. **`app/api/experiences/[id]/book/route.ts`** — best-effort availability
    check + `calculatePrice` call:
    - `checkAvailability(supabase, experienceId, 'EXPERIENCE', ...)` → `'ACTIVITY'`
    - `calculatePrice(supabase, { ..., category: 'EXPERIENCE' }, ...)` → `'ACTIVITY'`

## Files NOT changed (intentionally)

- **`apps/consumer-web/src/app/browse/page.tsx`** — uses only `EXPERIENCES`
  (plural SEO data array) and the `experiences` local variable; no
  string-literal enum value.
- **`apps/consumer-web/src/app/browse/[slug]/layout.tsx`** — uses only
  `EXPERIENCES` and `getExperienceBySlug` from `data/experiences`; no enum value.
- **`apps/consumer-web/src/app/experiences/[slug]/layout.tsx`** — same as above.
- **`apps/consumer-web/src/data/experiences.ts`** — defines `EXPERIENCES` (plural)
  const + `ExperiencePage` interface for SEO landing pages. NOT the DB enum.
- **`packages/types/src/domain/inventory-item.ts`** — out-of-scope: contains a
  parallel `INVENTORY_CATEGORIES` zod enum schema with the same stale values
  (EXPERIENCE, VENDOR_SERVICE, etc.). The task verification step explicitly
  limits the grep to `apps/consumer-web/src shared/`, and this file is in
  `packages/types/`. Note for a follow-up task: this schema should be
  re-aligned to the live enum (or, better, the schema should be removed
  in favour of importing from `shared/constants.ts` since the schema is
  not actually used as a runtime validator on any INSERT path — the
  create-listing/service/page.tsx form uses the raw string `'SERVICE'`).
- **`/vendor/create-listing/venue`** form (uses `category='VENUE_RENTAL'`) — CORRECT, left alone.
- **`/vendor/create-listing/dining`** form (uses `category='DINING'`) — CORRECT, left alone.
- **`/vendor/create-listing/transport`** form (uses `category='TRANSPORT'`) — CORRECT, left alone.

## Verification

1. **tsc** (`cd apps/consumer-web && npx tsc --noEmit 2>&1 | grep -E "error TS" | head -30`):
   only 3 pre-existing errors in `src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx`
   (JSX closing-tag mismatch — pre-FIX-10, also noted in FIX-5/FIX-7/FIX-8 worklog
   entries). **Zero new errors from FIX-10.** Zero errors in any of the 18
   modified files.

2. **ESLint** (`npx eslint src/lib/surface-inventory-map.ts src/app/vendor/create-listing/service/page.tsx`):
   exit 0, no warnings, no errors.

   Ran the wider set too (all 15 consumer-web files I touched):
   `npx eslint <all 15 files>` → 0 errors, 1 warning. The 1 warning is
   `ItineraryTimeline.tsx:227:1  warning  Expected an assignment or function call`
   — this is a PRE-EXISTING typo (a stray `TS` literal at the bottom of the
   file, likely a leftover from a copy-paste of a TypeScript code-fence tag).
   It is NOT from FIX-10 — confirmed by reading the file before my edit; the
   stray `TS` was already at line 227 in the original. Flagging for a
   future cleanup task but leaving untouched here.

3. **tsc on shared/** (`cd shared && npx tsc --noEmit 2>&1 | grep -E "pricing-adapter|availability-adapter|constants"`):
   no output (i.e. zero errors in any of the 3 modified shared files). Other
   pre-existing errors in `shared/` (derived-status, hievents-patterns, rbac,
   slots, logger) are NOT from FIX-10 and pre-date this task.

4. **Grep verification** (`rg "VENDOR_SERVICE|'EXPERIENCE'|\"EXPERIENCE\"" apps/consumer-web/src shared/`):
   - **Zero `VENDOR_SERVICE` category values.** All 7 remaining `VENDOR_SERVICE`
     hits are in code comments documenting the FIX-10 migration ("was
     VENDOR_SERVICE", "previous values VENDOR_SERVICE → SERVICE") — these
     are display-label/historical references, OK.
   - **Zero `'EXPERIENCE'` or `"EXPERIENCE"` string-literal category values.**
     The second `rg` invocation found 0 matches (exit 1).
   - Remaining `EXPERIENCE` substring hits in the tree are exclusively the
     `EXPERIENCES` (plural) const name + the local `experiences` variable
     in browse pages — these refer to the SEO landing-page data array, NOT
     the DB enum.

5. **dev.log** (`tail -40 /home/z/my-project/dev.log`): clean. Only the
   recurring `GET / 200` polling + pre-existing `POST /api/notifications/read-all 401`
   + `POST /api/service-tickets 401` (auth-gated endpoints hit by an unauth'd
   poller — pre-FIX-10 per FIX-8 worklog). No 500s, no compile errors, no
   new error patterns.

## Out-of-scope bugs flagged for follow-up

- **`packages/types/src/domain/inventory-item.ts`** still defines
  `INVENTORY_CATEGORIES` with the stale enum values (`EXPERIENCE`,
  `VENDOR_SERVICE`, plus `VACATION_RENTAL`/`FLIGHT`/`CAR_RENTAL`/
  `VENUE_SPACE`/`DINING_RESERVATION`/`CRUISE_CABIN`/`TRANSIT` — none
  of which are in the live enum either). The file's own comment says
  it "MUST be applied to `shared/constants.ts` as well" — so FIX-10's
  change to `shared/constants.ts` has now broken that mirror invariant.
  Recommend FIX-11 to re-align this schema (or remove it in favour of
  importing from `shared/constants.ts`). The zod schema is NOT used as
  a runtime validator on any INSERT path today (the create-listing forms
  use raw string literals), so this is a latent risk, not a live bug.
- **`ItineraryTimeline.tsx:227`** stray `TS` literal at end of file —
  pre-existing lint warning, unrelated to FIX-10. Easy 1-line delete.
