# FIX-4 — PascalCase Supabase table names in `seo-server.ts`

**Agent:** Z.ai Code (sub-agent)
**Task:** Fix `apps/consumer-web/src/lib/seo-server.ts` which queried Supabase using PascalCase table names `Vendor` (4 calls) and `VendorReview` (1 call). PostgREST tables are snake_case; these returned `relation "Vendor" does not exist` → 500 errors on every SEO page that uses them. Replace with the real snake_case names (`vendor_accounts`, `reviews`), audit select strings for PascalCase columns, and grep the rest of `apps/consumer-web/src` for any other PascalCase `.from(...)` calls.

## Files modified

Only one file: `apps/consumer-web/src/lib/seo-server.ts` (307 lines, line count unchanged).

## Changes (before → after)

### Table name fixes (5 total — the core bug)

| Line | Before | After | Function |
|------|--------|-------|----------|
| 144 | `.from('Vendor')` | `.from('vendor_accounts')` | `fetchVendorsByCategory` |
| 166 | `.from('Vendor')` | `.from('vendor_accounts')` | `fetchVendorsBySearch` |
| 189 | `.from('Vendor')` | `.from('vendor_accounts')` | `fetchVendorBySlug` |
| 221 | `.from('Vendor')` | `.from('vendor_accounts')` | `fetchAllVendorSlugs` |
| 288 | `.from('VendorReview')` | `.from('reviews')` | `fetchVendorReviews` |

### Filter / order column fixes (8 total — needed because PostgREST columns are also snake_case; leaving these camelCase would still 500)

| Line | Before | After | Reason |
|------|--------|-------|--------|
| 147 | `.eq('isPublished', true)` | `.in('status', ['ACTIVE', 'ONBOARDED', 'CLAIMED'])` | `vendor_accounts` has no `is_published` column; uses `status` enum. Convention from `/api/sitemaps/organizers/route.ts` + `/api/directory/route.ts`. |
| 148 | `.order('isFeatured', { ascending: false })` | `.order('created_at', { ascending: false })` | `vendor_accounts` has no `is_featured` column; order by recency. |
| 168 | `.eq('isPublished', true)` | `.in('status', ['ACTIVE', 'ONBOARDED', 'CLAIMED'])` | same as 147 |
| 170 | `.order('isFeatured', { ascending: false })` | `.order('created_at', { ascending: false })` | same as 148 |
| 192 | `.eq('isPublished', true)` | `.in('status', ['ACTIVE', 'ONBOARDED', 'CLAIMED'])` | same as 147 |
| 223 | `.eq('isPublished', true)` | `.in('status', ['ACTIVE', 'ONBOARDED', 'CLAIMED'])` | same as 147 |
| 290 | `.eq('vendorId', vendorId)` | `.eq('vendor_id', vendorId)` | `reviews` real column (per `/api/reviews/route.ts`) |
| 291 | `.eq('isApproved', true)` | `.eq('is_approved', true)` | `reviews` real column |
| 292 | `.order('createdAt', { ascending: false })` | `.order('created_at', { ascending: false })` | `reviews` real column |

Also added an inline comment at line 142: `// Fetch vendor details (live schema: vendor_accounts; published = status in ACTIVE/ONBOARDED/CLAIMED)`.

## Select string audit (step 4)

All select strings in `seo-server.ts` use `'*'` (wildcard) or already-snake_case columns:
- `'*'` (lines 145, 167, 189, 289)
- `'slug'` (line 222)
- `'id, name, slug'` (line 126)
- `'vendor_id'` (lines 135, 201)
- `'id, slug, name, is_top_level'` (line 243)
- `'category_id'` (line 251)
- `'vendor_categories!inner(name, slug)'` (line 200)

**No PascalCase columns in any select string. Step 4 required no select-string edits.**

## Wider grep (step 5)

`rg "\.from\(['\"]([A-Z][A-Za-z0-9_]*)['\"]\)" apps/consumer-web/src` → only the 5 calls in `seo-server.ts` (all now fixed).

**Zero other PascalCase `.from(...)` calls anywhere in `apps/consumer-web/src`.** No `Booking`, `Listing`, `User`, `Order`, `Trip`, etc. instances. The bug was fully isolated to this one file.

## Verification

### TypeScript check
```
cd /home/z/my-project/apps/consumer-web && npx tsc --noEmit 2>&1 | grep -E "seo-server|error TS" | head -20
```
Output:
```
src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx(94,11): error TS17008: JSX element 'AppLayoutShell' has no corresponding closing tag.
src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx(165,1): error TS1381: Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
src/app/[slug]/[citySlug]/[verticalSlug]/page.tsx(166,1): error TS1005: '</' expected.
```
**Zero errors in `seo-server.ts`.** The 3 errors are pre-existing in an unrelated file (`[slug]/[citySlug]/[verticalSlug]/page.tsx`) and were already flagged by FIX-3. Total tsc error count unchanged (3) — my changes introduce zero new errors.

### Dev log
`tail -20 /home/z/my-project/dev.log` → no `relation "Vendor" does not exist` errors. Only pre-existing unrelated errors:
- `Could not find the table 'public.cities' in the schema cache` (PGRST205) — different missing-table issue.
- `GET /api/geolocation 500`, `GET /api/shows 500`, `GET /api/ticketing/shows 500` — pre-existing.

### Post-fix grep
`rg "\.from\(['\"]([A-Z][A-Za-z0-9_]*)['\"]\)" apps/consumer-web/src` → **No matches found.** All PascalCase `.from(...)` calls eliminated.

## Out of scope (intentionally NOT touched)

- **`toSEOVendor` row transform (lines 79-113)** — reads camelCase JS properties (`v.isFeatured`, `v.logoUrl`, `v.coverUrl`, `v.priceRange`, `v.serviceAreas`, `v.tags`, `v.rating`, `v.reviewCount`, `v.website`, `v.bio`). These are NOT SQL identifiers — they're JS property accesses on the returned row. With `vendor_accounts` returning snake_case columns (or no column at all for these fields), they'd be `undefined`, but the function handles missing fields gracefully (returns defaults/nulls). NOT a 500 — suboptimal data only. Out of scope for this 500-fix.
- **Reviews row mapping (lines 295-301)** — reads `r.createdAt` and `r.reviewerName`. `reviews` returns `created_at` (not `createdAt`) and has no `reviewerName` column (only `reviewer_id`). Returns `undefined`/`'Anonymous'` but won't crash. NOT a 500. Out of scope.
- **Broader old-schema-column issue elsewhere** — e.g., `seo-data.ts` queries `vendor_profiles` with `business_name, logo_url, is_published` (none exist on `vendor_accounts` either); silently swallowed by try/catch. Not the PascalCase-table bug being fixed here. Recommend a separate FIX task if SEO data quality needs to be addressed.

## Stage Summary

- 1 file modified: `apps/consumer-web/src/lib/seo-server.ts` (line count unchanged at 307).
- 5 PascalCase `.from(...)` calls fixed (4× `Vendor` → `vendor_accounts`, 1× `VendorReview` → `reviews`).
- 8 camelCase filter/order column references fixed (would have caused secondary 500s if left alone).
- 0 select-string edits needed (all already snake_case or `*`).
- 0 other PascalCase `.from(...)` calls anywhere in `apps/consumer-web/src`.
- tsc error count unchanged (3 pre-existing in unrelated file).
- No unrelated files touched.
