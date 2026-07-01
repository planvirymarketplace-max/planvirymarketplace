# SIDEBAR-3 — Hosting segment layout (AppLayoutShell wrap)

**Agent:** zai-code
**Task:** SIDEBAR-3 — wrap all `/hosting/*` routes in `<AppLayoutShell>` via a
segment-level `layout.tsx` so the ported Staybnb hosting pages stop rendering
as standalone content with no Planviry sidebar. Investigate (but do NOT
blindly patch) the wizard step `useFormContext()` crash risk.

## Inputs read

- `worklog.md` SIDEBAR-1 audit entry — established that root `app/layout.tsx`
  does NOT auto-wrap in AppLayoutShell; every subtree must opt in. The
  `/hosting/*` subtree was flagged STANDALONE (4 host pages + 12 wizard step
  pages = 16 pages with no sidebar, no parent layout).
- `worklog.md` ORCHESTRATOR-FINAL — sidebar IS the orchestration; every page
  must render inside AppLayoutShell so users can jump hotel → dinner →
  tickets without leaving the app.
- `apps/consumer-web/src/app/lodging/layout.tsx` and
  `apps/consumer-web/src/app/travel/layout.tsx` — SIDEBAR-2 already created
  these as the canonical pattern (`<AppLayoutShell>{children}</AppLayoutShell>`
  in a server-component layout.tsx). Mirrored the same pattern.

## Files read for context

- `apps/consumer-web/src/components/AppLayoutShell.tsx` — confirms signature
  `AppLayoutShell({ children }: { children: React.ReactNode })`, thin client
  wrapper around `<AppLayout>`. Server-component-safe.
- `apps/consumer-web/src/app/hosting/create/page.tsx` — async server
  component rendering `<CreateListingsMenu>`. NO shell import.
- `apps/consumer-web/src/app/hosting/listings/page.tsx` — async server
  component rendering `<HostListingsHeader>` + cards + status. NO shell
  import. `HostListingsHeader` is just a page-level back+create button
  (confirmed by reading
  `hosting/listings/components/HostListingsHeader.tsx`) — NOT a full navbar,
  so no double-chrome risk.
- `apps/consumer-web/src/app/hosting/listings/edit/edit/[id]/page.tsx` —
  async server component rendering `<EditListingForm>`. NO shell import.
- `apps/consumer-web/src/app/hosting/reservations/page.tsx` — async server
  component rendering `<HostReservationsContainer>`. NO shell import.
- `apps/consumer-web/src/app/hosting/create/listing/page.tsx` — redirect
  only, calls `redirect(/hosting/create/listing/${hostingSteps[0]})`. NO
  shell import.
- `apps/consumer-web/src/app/hosting/create/listing/[id]/(steps)/title/page.tsx`
  — `"use client"` page, calls `useFormContext<CreateListingForm>()`. NO
  local FormProvider. NO shell import.
- `apps/consumer-web/src/app/hosting/create/listing/[id]/(steps)/location/page.tsx`
  — same shape: `"use client"`, `useFormContext`, `useWatch`, `Controller`
  from react-hook-form. NO local FormProvider. NO shell import.
- `apps/consumer-web/src/app/hosting/create/listing/[id]/(steps)/images/page.tsx`
  — same shape. Imports `UploadPhotos` from
  `@/app/(hosting)/hosting/create/components/UploadPhotos` (broken import
  path — there is no `(hosting)` route group — pre-existing bug, NOT in
  scope for SIDEBAR-3).
- `apps/consumer-web/src/app/hosting/create/listing/[id]/components/CreateListingFormProvider.tsx`
  — the actual FormProvider owner. Uses `useForm<CreateListingForm>` +
  `FormProvider {...methods}`. Takes `defaultValues: Partial<CreateListingForm>`
  and `listingId: number` props. Also renders `<ProgressBar>` +
  `<NavigationButtons>` around `children`. Persists drafts via
  `updateDraftListing(listingId, ...)`. Tracks `visitedSteps` and
  `currentStep` inside the form values themselves. Needs a server-component
  parent to fetch the draft listing and pass `defaultValues`.
- `apps/consumer-web/src/lib/useListingForm.ts` — Zustand store with persist
  middleware. UNRELATED to the wizard — the wizard uses react-hook-form's
  `useFormContext`, not this Zustand store. (The naming collision is
  misleading; they are independent.)

## Critical route-tree finding

There is NO `apps/consumer-web/src/app/hosting/create/listing/[id]/page.tsx`
and NO `apps/consumer-web/src/app/hosting/create/listing/[id]/layout.tsx`.
The only files at the `[id]` segment are:

- `[id]/components/{NavigationButtons,ProgressBar,CreateListingFormProvider}.tsx`
- `[id]/(steps)/*/page.tsx` (12 step pages)

So `CreateListingFormProvider` is **never rendered anywhere in the route
tree**. Direct navigation to any wizard step page will throw at
`useFormContext()` (returns `undefined`, then destructuring `watch`,
`register`, `formState` etc. throws). This is a pre-existing structural bug
in the port — not introduced by SIDEBAR-3, and per task instructions NOT
patched here.

## Grep results (double-chrome check)

- `grep -n "AppLayout|AppLayoutShell|SiteShell|SiteFooter|<Navbar|<Header|<SiteHeader|<SiteNav" apps/consumer-web/src/app/hosting` →
  **No matches.** No hosting page renders any of these shells directly.
- `grep -n "import.*Navbar|import.*Header|import.*SiteNav|import.*SiteShell" apps/consumer-web/src/app/hosting` →
  2 matches, both safe:
  - `hosting/listings/page.tsx` imports `HostListingsHeader` (page-level
    header component, not a full Navbar — safe to keep).
  - `hosting/listings/edit/edit/[id]/components/AmenitiesSection.tsx`
    imports `SelectAmenities` from `@/components/Navbar/SelectAmenities`
    (path namespace `Navbar/`, a sub-component, not the layout Navbar —
    safe, and it's a sub-component not a page).

**Conclusion: no per-page shell imports to remove.** The hosting subtree was
purely STANDALONE (no chrome at all), not DOUBLE-CHROME. SIDEBAR-3 only
needs to ADD the layout, not subtract anything.

## Files created

1. `apps/consumer-web/src/app/hosting/layout.tsx` (NEW, 56 lines)

   Server-component segment layout. Wraps every `/hosting/*` route in
   `<AppLayoutShell>{children}</AppLayoutShell>`. Mirrors the
   `lodging/layout.tsx` and `travel/layout.tsx` pattern established by
   SIDEBAR-2.

   JSDoc explicitly documents:
   - Which routes are covered (create menu, listings index, listings edit,
     reservations, 12 wizard steps).
   - That the wizard step pages still crash on direct navigation because no
     `[id]/page.tsx` or `[id]/layout.tsx` renders `CreateListingFormProvider`,
     and that this layout deliberately does NOT inject `<FormProvider>` per
     task instructions (the wizard form-state flow is non-trivial and must
     be wired up deliberately, not patched here).

## Files modified

None. No hosting page imports AppLayoutShell/AppLayout, so there were no
per-page wraps to strip. (This contrasts with SIDEBAR-2's travel work,
where per-page AppLayoutShell wraps on destination/property pages had to be
removed to avoid double-chrome.)

## Verification

### `npx tsc --noEmit` (hosting scope)

```
$ cd apps/consumer-web && npx tsc --noEmit 2>&1 | grep -E "hosting|error TS" | head -15
src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx(94,11): error TS17008: JSX element 'AppLayoutShell' has no corresponding closing tag.
src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx(165,1): error TS1381: Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx(166,1): error TS1005: '</' expected.
```

**Zero errors mentioning `hosting`.** The 3 remaining errors are all in the
pre-existing unrelated file
`src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx` (an SEO catch-all page
with a broken JSX structure that predates SIDEBAR-3 — not in scope).

(Initial draft of `hosting/layout.tsx` used backtick-quoted route paths in
the JSDoc body, and the literal `*/` sequence inside `(steps)/*/page.tsx`
prematurely terminated the comment block, producing 8 spurious
"Module declaration names may only use ' or \" quoted strings" +
"Unterminated template literal" errors. Fixed by rephrasing the comment to
avoid backticks and the `*/` substring. Final file passes tsc cleanly.)

### `npx eslint src/app/hosting/layout.tsx`

No output (clean — 0 errors, 0 warnings).

### `tail -15 /home/z/my-project/dev.log`

Server is up and serving 200s. Most recent entries show `/lodging/search`
and `/account/reservations` rendering fine (those routes already have their
SIDEBAR-2 layouts). No compilation errors. No `/hosting/*` requests in the
visible window yet, but the layout file compiled without errors when the
dev server hot-reloaded.

## Open issues deferred (per task instructions)

1. **Wizard FormProvider gap.** Direct navigation to any of the 12
   `/hosting/create/listing/[id]/(steps)/*/page.tsx` routes will crash at
   `useFormContext()` because no ancestor renders `<FormProvider>` /
   `CreateListingFormProvider`. The proper fix requires a server-component
   parent (likely `hosting/create/listing/[id]/layout.tsx` or
   `hosting/create/listing/[id]/page.tsx`) that:
   - Reads the `id` param.
   - Calls `getDraftListing()` (already exists in
     `lib/api/server/endpoints/daft-listings`).
   - Renders `<CreateListingFormProvider defaultValues={...} listingId={id}>`
     wrapping the step page children.
   This was explicitly deferred per SIDEBAR-3 task instructions:
   "DO NOT add FormProvider unless you're certain it's safe — the wizard
   may rely on a specific form state flow." The wizard's form state is
   entangled with `updateDraftListing` persistence and `visitedSteps` /
   `currentStep` tracking inside the form values, so wiring up the provider
   should be a deliberate, separate task (candidate: SIDEBAR-4 or a
   wizard-specific fix ticket). SIDEBAR-3 only ensures the AppLayoutShell
   wraps the wizard steps so the sidebar is visible regardless.

2. **Broken `(hosting)` route-group imports.** Five files under
   `/hosting/*` import from `@/app/(hosting)/hosting/...` but no
   `(hosting)` route group exists:
   - `hosting/listings/edit/edit/[id]/components/ImagesSection.tsx`
   - `hosting/listings/edit/edit/[id]/components/LocationSection.tsx`
   - `hosting/create/listing/[id]/(steps)/location/page.tsx`
   - `hosting/create/listing/[id]/(steps)/nightPrice/page.tsx`
   - `hosting/create/listing/[id]/(steps)/images/page.tsx`
   These are pre-existing broken imports (likely from the Staybnb port —
   the original repo had a `(hosting)` route group). NOT in scope for
   SIDEBAR-3. Flagging for a future port-cleanup ticket.

## Stage Summary

**One file created, zero files modified.**

`apps/consumer-web/src/app/hosting/layout.tsx` wraps every `/hosting/*` route
(create menu, listings index, listings edit, reservations, and all 12 wizard
step pages) in `<AppLayoutShell>`. This brings the entire Staybnb-ported
hosting flow into the Planviry orchestration chrome — the nav-rail sidebar +
global header + footer now persist across the whole host experience, so
users can jump hotel → dinner → tickets without leaving the app.

No per-page shell imports needed stripping (the hosting subtree was purely
STANDALONE, not DOUBLE-CHROME — unlike `/travel/*` which SIDEBAR-2 had to
dedupe).

The wizard FormProvider gap (direct navigation to step pages crashes at
`useFormContext()` because no ancestor renders `CreateListingFormProvider`)
is documented in the layout's JSDoc and in this work record, but NOT
patched — per task instructions, the wizard form-state flow is non-trivial
(draft persistence + `visitedSteps`/`currentStep` tracking inside form
values) and must be wired up deliberately in a separate ticket.

`tsc --noEmit` reports zero `hosting`-related errors. ESLint passes clean.
Dev server is healthy.
