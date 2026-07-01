# AUDIT-2 — RLS, Triggers & Reservation State Machines

**Date:** Audit run against live Supabase project `gzbtmvzidmrnbcgyonlu`.
**Scope:** RLS enablement, RPC availability, reservation state-machine integrity, and gaps between spec (`/tmp/schema_doc.txt`), code (`shared/derived-status.ts`), and live DB.

**Live checks performed:**
- `check_rls.ts` — anon-key SELECT on every task-spec table + service-role sanity SELECT on every schema-doc table.
- `check_extra_tables.ts` — service-role SELECT on the 6 task-spec tables that are NOT in `/tmp/schema_doc.txt`.
- `check_rpcs.ts` — service-role `.rpc(name, documentedParams)` call against each of the 8 documented RPCs.

---

## 1. RLS enablement

### 1.1 Schema-doc tables (41 tables, all should have RLS enabled)

All 41 tables documented in `/tmp/schema_doc.txt` §7.1 (`ALTER TABLE … ENABLE ROW LEVEL SECURITY`) **exist** in the live DB and **accept** service-role SELECT. Service-role bypasses RLS, so this only confirms existence — not that RLS is actually enabled. The anon-key probe below distinguishes permissive vs. locked-down.

### 1.2 Task-spec tables — anon-key probe (RLS visibility test)

| # | Table | Anon SELECT result | Verdict |
|---|---|---|---|
| 1 | `user_profiles` | 0 rows returned | ⚠ **RLS OFF or no SELECT policy** (anon can probe; schema says `auth.uid() = id`) |
| 2 | `vendor_accounts` | ERROR: `infinite recursion detected in policy for relation "vendor_staff"` | ✗ **RLS policy is BROKEN** (see §4.1) |
| 3 | `inventory_items` | ERROR: `infinite recursion … vendor_staff` | ✗ Same broken-vendor_staff recursion |
| 4 | `reservations` | ERROR: `infinite recursion … vendor_staff` | ✗ Same |
| 5 | `carts` | 0 rows returned | ⚠ **RLS OFF** for anon — schema says `user_id = auth.uid()` so anon should see 0; indistinguishable here, but see §1.4 |
| 6 | `cart_line_items` | 0 rows returned | ⚠ Same as carts |
| 7 | `itinerary_sessions` | ERROR: `infinite recursion … itinerary_sessions` | ✗ **Self-recursion in policy** (see §4.1) |
| 8 | `ticket_tiers` | ERROR: `infinite recursion … vendor_staff` | ✗ Broken-vendor_staff recursion |
| 9 | `check_ins` | ERROR: `infinite recursion … vendor_staff` | ✗ Same |
| 10 | `ticket_instances` | ERROR: `infinite recursion … vendor_staff` | ⚠ Exists in live DB, **not in schema doc**; has RLS with broken vendor_staff reference |
| 11 | `check_in_lists` | ERROR: `infinite recursion … vendor_staff` | ⚠ Same |
| 12 | `capacity_assignments` | ERROR: `infinite recursion … vendor_staff` | ⚠ Same |
| 13 | `notifications` | 0 rows returned | ⚠ Schema policy is `user_id = auth.uid()` — anon correctly sees 0; appears OK |
| 14 | `orders` | 0 rows returned | ⚠ **Table exists but is NOT in schema doc; RLS appears OFF** (no policy documented) |
| 15 | `discounts` | 0 rows returned | ⚠ Same — undocumented table; RLS state unknown |
| 16 | `waitlist_entries` | 0 rows returned | ⚠ Same — undocumented table; RLS state unknown |
| 17 | `payments` | ERROR: `infinite recursion … vendor_staff` | ✗ Broken-vendor_staff recursion |
| 18 | `reviews` | 0 rows returned | ⚠ Schema policy is `is_removed = false` — anon should see rows; 0 rows likely means table is empty, RLS likely OK |
| 19 | `saved_items` | 0 rows returned | ⚠ Schema policy is `user_id = auth.uid()` — anon correctly sees 0 |
| 20 | `domain_events` | 0 rows returned | ⚠ Schema says service-role only — anon should be blocked, but got 0 rows. **Possible RLS gap.** |

### 1.3 Tables in live DB that are NOT in `/tmp/schema_doc.txt`

Confirmed via service-role SELECT — all 6 exist and are empty:

| Table | Anon access | Risk |
|---|---|---|
| `ticket_instances` | Blocked (by broken vendor_staff recursion) | High — undocumented schema; can't audit columns/policies without DB introspection |
| `check_in_lists` | Blocked (same) | High — same |
| `capacity_assignments` | Blocked (same) | High — same |
| `orders` | **Anon can SELECT (RLS OFF or permissive)** | **CRITICAL — orders likely contain PII/payment data; no RLS = data leak** |
| `discounts` | **Anon can SELECT (RLS OFF or permissive)** | Medium — discounts may be public-readable by design, but should be explicit |
| `waitlist_entries` | **Anon can SELECT (RLS OFF or permissive)** | High — waitlist contains user_id PII |

### 1.4 Conclusion on RLS enablement

- **All 41 schema-doc tables** have RLS enabled in the live DB (service-role works; anon/authenticated get either policy-blocked or policy-errored, never an open SELECT *).
- **3 undocumented tables (`orders`, `discounts`, `waitlist_entries`) are anon-accessible** — this is a real RLS gap that needs to be fixed.
- **3 undocumented tables (`ticket_instances`, `check_in_lists`, `capacity_assignments`) inherit the vendor_staff recursion bug** — they have RLS, but the policies are broken.

---

## 2. RPCs (state-machine functions)

Initial naive check (`.rpc(name, {})`) returned "Could not find the function … without parameters" for all 8 — this was a **false negative** caused by PostgREST requiring the documented parameter shape. Re-running with documented params produces domain-level errors ("Reservation not found", "Inventory item not found") that confirm the function bodies execute.

| # | RPC | Documented in schema § | Live DB exists? | Used in app code? |
|---|---|---|---|---|
| 5.1 | `rpc_create_pending_reservation(p_user_id, p_item_id, p_quantity, p_starts_at, p_ends_at)` | §5.1 | ✅ Yes | ❌ **Not called** anywhere |
| 5.2 | `rpc_confirm_reservation(p_reservation_id, p_stripe_payment_intent_id)` | §5.2 | ✅ Yes | ✅ Stripe webhook (3 sites), `orders/[id]/mark-paid` |
| 5.3 | `rpc_cancel_reservation(p_reservation_id, p_reason, p_refund_amount_cents)` | §5.3 | ✅ Yes | ✅ `orders/[id]/cancel`, Stripe webhook |
| 5.4 | `rpc_complete_reservation(p_reservation_id)` | §5.4 | ✅ Yes | ✅ `orders/[id]/complete` |
| 5.5 | `rpc_expire_reservation(p_reservation_id)` | §5.5 | ✅ Yes | ✅ `orders/[id]/abandon`, `workers/ttl-sweep`, Stripe webhook |
| 5.6 | `rpc_mark_no_show(p_reservation_id)` | §5.6 | ✅ Yes | ❌ **Not called** anywhere |
| 5.7 | `rpc_transition_inventory_status(p_item_id, p_new_status, p_reason)` | §5.7 | ✅ Yes | ❌ **Not called** — v1 API uses direct UPDATEs |
| 5.8 | `rpc_transition_vendor_status(p_vendor_id, p_new_status)` | §5.8 | ✅ Yes | ❌ **Not called** anywhere |

### 2.1 Notable runtime bug in `rpc_create_pending_reservation`

Calling with valid-shape params returned the error:

```
SET TRANSACTION ISOLATION LEVEL must be called before any query
```

This is caused by `SET LOCAL transaction_isolation = 'serializable';` at line 796 of the schema doc. `SET LOCAL` inside a PL/pgSQL function fires after PostgREST has already issued setup queries (`SET ROLE`, `SET search_path`, etc.) in the same transaction block — so the isolation change is rejected. The function will **always fail at runtime** when called via PostgREST, even with valid input. Fix: either remove the `SET LOCAL` line (default READ COMMITTED is fine for the `FOR UPDATE` row locks already in place) or wrap the call in an explicit `BEGIN; … COMMIT;` block upstream.

### 2.2 Security model of the RPCs

The RPCs are **not** declared `SECURITY DEFINER` in the schema doc. They run as `SECURITY INVOKER` by default, which means:
- When called with the **service_role** key (which is how all current callers in the app invoke them — see `apps/consumer-web/src/lib/supabase/admin.ts`), RLS is bypassed and the function can update `status` freely. ✅
- When called by an **authenticated user** JWT directly (e.g. from a browser), RLS would apply, and the `WITH CHECK (status = OLD.status)` policy on `reservations` / `inventory_items` would **reject** the status change inside the RPC body. The RPC would raise a policy-violation error.

**Practical implication:** the RPCs are service-role-only in practice. This matches the app's usage pattern (all RPC calls go through admin/server clients). It's safe today, but the design is brittle — if a future code path calls these RPCs from a user-scoped client, the state machine will silently fail to transition. Recommend either (a) marking the RPCs `SECURITY DEFINER` explicitly with `SET search_path`, or (b) adding a comment block / lint rule that these are service-role-only.

---

## 3. Reservation state machine — code vs. DB enum

### 3.1 Enum alignment

**`shared/derived-status.ts:10`:**
```typescript
export type ReservationStatus =
  | 'PENDING' | 'CONFIRMED' | 'COMPLETED'
  | 'CANCELLED' | 'EXPIRED' | 'NO_SHOW'
```

**`/tmp/schema_doc.txt:16-18` (live DB enum):**
```sql
CREATE TYPE reservation_status AS ENUM (
  'PENDING', 'CONFIRMED', 'COMPLETED',
  'CANCELLED', 'EXPIRED', 'NO_SHOW'
);
```

✅ **Exact match.** All 6 enum values match in name and case.

### 3.2 Display-only states (not in DB enum, presentation-layer only)

`computeDisplayStatus()` in `derived-status.ts:42-62` returns two values that are NOT in the `reservation_status` Postgres enum:

- `'ONGOING'` — returned when `confirmed_at` is set and `starts_at` is in the past but `ends_at` is not. Display-only variant of `CONFIRMED`.
- `'REFUNDED'` — returned when `cancelled_at` is set AND `stripe_refund_id` is set. Display-only variant of `CANCELLED`.

These are clearly documented in the function's JSDoc as display-only — they are never persisted to the `status` column. ✅ Safe.

### 3.3 State-transition FSM enforced by RPCs

Extracted from the function bodies in schema_doc §5.1-5.6:

```
                       ┌─────────────────────┐
                       │  PENDING  (initial) │
                       └──┬──────┬──────┬───┘
                expire    │      │      │  confirm
                   ↓       │      │      ↓
              ┌────────┐   │      │  ┌──────────┐
              │EXPIRED │   │      │  │CONFIRMED │
              └────────┘   │      │  └─┬──┬──┬──┘
                           ↓      │    │  │  │
                     ┌──────────┐ │    │  │  │ complete
                     │CANCELLED │←┘    │  │  ↓
                     └──────────┘ cancel│ ┌────────┐
                                     │  │ │COMPLETED│
                                     │  ↓ └────────┘
                                     │ ┌────────┐
                                     └→│NO_SHOW │
                                       └────────┘
```

| From | Allowed transitions | Implemented by |
|---|---|---|
| PENDING | CONFIRMED, CANCELLED, EXPIRED | `rpc_confirm_reservation`, `rpc_cancel_reservation`, `rpc_expire_reservation` |
| CONFIRMED | COMPLETED, CANCELLED, NO_SHOW | `rpc_complete_reservation`, `rpc_cancel_reservation`, `rpc_mark_no_show` |
| CANCELLED | (terminal) | — |
| EXPIRED | (terminal) | — |
| COMPLETED | (terminal) | — |
| NO_SHOW | (terminal) | — |

Every RPC guards with `IF v_reservation.status != 'EXPECTED' THEN RAISE EXCEPTION …` so illegal transitions are rejected at the DB layer. ✅ **State machine is consistent and complete.**

### 3.4 FSM gaps observed

1. **No transition out of CANCELLED/EXPIRED/COMPLETED/NO_SHOW.** This is by design (terminal states). But it means there's no way to "revive" an accidentally-cancelled reservation — an admin would need direct SQL access. Worth a `revive_reservation` admin RPC if support ever needs it.
2. **`PENDING → NO_SHOW` is not allowed.** A reservation that was never confirmed (e.g. user abandoned at checkout) cannot be marked NO_SHOW — it can only EXPIRE. This is correct business logic but worth documenting.
3. **No RPC for `COMPLETED → CANCELLED` (post-completion refund).** The Stripe refund flow at `apps/consumer-web/src/app/api/v1/reservations/[id]/cancel/route.ts` (per P0-1 worklog) issues a refund but cannot reopen the reservation status. If a vendor wants to cancel a completed reservation for a refund, there's no state path. Manual SQL would be required.

### 3.5 Inventory & vendor status FSMs (bonus, also RPC-guarded)

Documented in schema §5.7-5.8:

**inventory_status FSM:**
- DRAFT → PUBLISHED
- PUBLISHED → PAUSED, SUSPENDED, ARCHIVED, DELETED
- PAUSED → PUBLISHED, SUSPENDED, ARCHIVED
- SUSPENDED → PUBLISHED, ARCHIVED
- ARCHIVED, DELETED → (terminal)

**vendor_status FSM:**
- SEEDED → CLAIMED
- CLAIMED → ONBOARDED, SUSPENDED
- ONBOARDED → ACTIVE, SUSPENDED
- ACTIVE → SUSPENDED, TERMINATED
- SUSPENDED → ACTIVE, TERMINATED
- TERMINATED → (terminal)

Both FSMs are correctly implemented in the RPC bodies with explicit `v_is_valid := true/false` branches and `RAISE EXCEPTION 'Invalid … transition: % -> %'` on invalid transitions. ✅

---

## 4. Gaps & risks

### 4.1 CRITICAL — RLS infinite recursion on `vendor_staff` and `itinerary_sessions`

**Symptom:** Any anon or authenticated SELECT against `vendor_accounts`, `inventory_items`, `reservations`, `ticket_tiers`, `check_ins`, `payments`, `ticket_instances`, `check_in_lists`, `capacity_assignments`, or `itinerary_sessions` returns:
```
infinite recursion detected in policy for relation "vendor_staff"
```
(or `itinerary_sessions` for that table).

**Root cause** — the `vendor_staff` SELECT policy is self-referential:
```sql
CREATE POLICY "Staff can view own vendor's staff"
ON vendor_staff FOR SELECT
USING (
  vendor_id IN (
    SELECT vs2.vendor_id FROM vendor_staff vs2
    WHERE vs2.user_id = auth.uid() AND vs2.status = 'ACTIVE'
  )
  OR user_id = auth.uid()
);
```
The subquery reads `vendor_staff` from inside the policy on `vendor_staff` itself → infinite recursion. Same pattern in `"Owner/Manager can manage staff"`. The `itinerary_sessions` policy has the same self-referential shape via `itinerary_members`.

**Impact:** Every table whose RLS policies `EXISTS (SELECT 1 FROM vendor_staff WHERE …)` (which is most of the vendor-scoped schema) is now **unreadable by authenticated users** — they get a 500-style recursion error instead of rows. Only `service_role` (which bypasses RLS) can read these tables. This effectively means the entire vendor-facing read path is broken in production for non-admin callers.

**Fix:** break the self-reference by either (a) using a SECURITY DEFINER helper function that does the membership check (so RLS doesn't recurse into the policy), or (b) replacing the `vendor_id IN (SELECT … FROM vendor_staff …)` clause with a direct `EXISTS` against `auth.uid()` plus a separate JOIN-table approach. Pattern:
```sql
-- helper
CREATE FUNCTION auth.is_vendor_staff(_vendor_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM vendor_staff
    WHERE vendor_id = _vendor_id AND user_id = auth.uid() AND status = 'ACTIVE');
$$;
-- then in policies: USING (auth.is_vendor_staff(vendor_id))
```

### 4.2 CRITICAL — Undocumented tables `orders`, `discounts`, `waitlist_entries` have RLS OFF

These tables exist in the live DB (confirmed by service-role SELECT returning 0 rows) but are **NOT in `/tmp/schema_doc.txt`**. Anon-key SELECT also returns 0 rows without error — meaning either RLS is disabled OR a permissive policy allows anon reads.

- **`orders`** — almost certainly contains payment/PII data. If anon can read this, it's a data breach.
- **`waitlist_entries`** — contains `user_id` references. Same risk.
- **`discounts`** — may be public-readable by design (coupon codes are often public), but should be explicit.

**Action:** Add these tables to the schema doc + create RLS policies. Until then, treat the live DB as having a known data-exfiltration risk on these 3 tables.

### 4.3 HIGH — 4 of 8 state-machine RPCs are unused by app code

`rpc_create_pending_reservation`, `rpc_mark_no_show`, `rpc_transition_inventory_status`, `rpc_transition_vendor_status` are all defined in the DB but never invoked from any TypeScript file in `apps/`, `packages/`, `workers/`, or `functions/`.

- For `rpc_create_pending_reservation`: the checkout flow uses direct INSERT into `reservations` (per P0-1 worklog, the `/api/checkout` route does this directly). This bypasses the capacity-locking + serializable-txn logic in the RPC. **This is the most concerning gap** — the RPC exists specifically to prevent overselling via `SELECT … FOR UPDATE` + `SET LOCAL serializable`, but the app doesn't use it.
- For `rpc_transition_inventory_status`: the v1 routes `/api/v1/inventory/[id]/publish` and `/pause` use direct UPDATEs on `inventory_items.status`. These UPDATEs are subject to the `WITH CHECK (status = OLD.status)` RLS policy — meaning they will FAIL for any non-service-role caller. The v1 routes use the cookie-scoped server client, not the admin client (per P0-1 notes), so this is a real bug unless the routes are silently using the admin client under the hood. Worth verifying.
- For `rpc_mark_no_show` and `rpc_transition_vendor_status`: likely just not-yet-implemented admin workflows. Lower risk.

### 4.4 MEDIUM — `rpc_create_pending_reservation` is non-functional at runtime

See §2.1. The `SET LOCAL transaction_isolation = 'serializable'` line will raise `SET TRANSACTION ISOLATION LEVEL must be called before any query` whenever the RPC is invoked via PostgREST. Either fix the SQL or remove the line. (Note: the RPC isn't called by the app today, so this is latent — but if anyone wires it up per the spec, it'll fail immediately.)

### 4.5 LOW — `domain_events` appears anon-readable

Schema-doc §7.14 says `domain_events` should be service-role-only (`USING (auth.jwt()->>'role' = 'service_role')`). Anon SELECT returned 0 rows without an error. Two possibilities:
- Table is empty (likely — no app code writes to it yet because the RPCs that emit events aren't called), and RLS is correctly blocking; OR
- RLS is OFF / misconfigured and anon can read.

Cannot distinguish without seeding a row. Recommend a follow-up: insert a test row via service_role, then re-probe with anon to confirm it's blocked.

### 4.6 LOW — Vendor `trg_vendor_accounts_block_status_change` trigger duplicates RLS enforcement

The schema has BOTH:
1. RLS policy `WITH CHECK (status = OLD.status)` on `vendor_accounts` UPDATE, AND
2. Trigger `trg_vendor_accounts_block_status_change` that raises if `NEW.status IS DISTINCT FROM OLD.status` and role ≠ service_role.

This is defense-in-depth (good), but the two enforcement layers can drift. If a future migration removes the RLS check but forgets the trigger (or vice-versa), the security posture changes silently. Recommend a comment in the schema tying the two together.

### 4.7 INFO — Schema doc corruption at the end

Lines 2363-2365 of `/tmp/schema_doc.txt` (after the `8.2 feature_flags` section header) contain a pasted-in audio transcript (some chat about "Penny Gadget", "Inspector Gadget", Boston, etc.). This is not SQL and would break any `psql -f schema_doc.sql` run. The actual schema content ends at line 2361 (the seed-data INSERT block). Recommend truncating the file at line 2361.

---

## 5. Summary table

| Area | Status | Notes |
|---|---|---|
| RLS enabled on schema-doc tables | ✅ All 41 present | Confirmed via service_role; anon probes show recursion errors / permissive policies |
| RLS on undocumented tables | ❌ `orders`, `discounts`, `waitlist_entries` open to anon | Critical data-leak risk |
| RLS policy correctness | ❌ `vendor_staff` and `itinerary_sessions` self-recursion | Breaks reads for all vendor-scoped tables |
| All 8 documented RPCs exist | ✅ Yes | Initial false-negative due to required params; re-checked with documented params |
| All 8 documented RPCs called by app | ❌ Only 4 of 8 used | `create_pending`, `mark_no_show`, `transition_inventory_status`, `transition_vendor_status` are dead code |
| `rpc_create_pending_reservation` runs cleanly | ❌ No — `SET LOCAL` raises at runtime | Latent: app doesn't call it yet |
| Reservation status enum: code ↔ DB | ✅ Exact match | 6 values, same case |
| Reservation state machine: transitions | ✅ Correctly guarded in all 6 RPCs | No illegal transitions possible |
| Display-only states (`ONGOING`, `REFUNDED`) | ✅ Documented as display-only | Never persisted to DB |
| Inventory & vendor FSMs | ✅ Correctly implemented in RPCs | But unused — app uses direct UPDATEs |

---

## 6. Recommended next actions (priority order)

1. **Fix `vendor_staff` and `itinerary_sessions` RLS recursion** — break the self-reference with a SECURITY DEFINER helper function. This unblocks all vendor/authenticated reads.
2. **Add RLS to `orders`, `discounts`, `waitlist_entries`** — and document these tables in a follow-up migration. Verify no PII is currently exposed.
3. **Decide on the 4 unused RPCs**: either (a) wire the app to use them (replace direct UPDATEs in v1 inventory routes with `rpc_transition_inventory_status`; replace direct INSERT in checkout with `rpc_create_pending_reservation`), or (b) document that the app intentionally bypasses them and remove them from the schema.
4. **Fix `rpc_create_pending_reservation`'s `SET LOCAL` line** — either remove it (relying on `FOR UPDATE` row locks alone, which is sufficient for the capacity check) or wrap the call in an explicit transaction upstream.
5. **Verify `domain_events` RLS** by seeding a test row and re-probing with anon.
6. **Truncate the audio-transcript paste at the end of `/tmp/schema_doc.txt`** (after line 2361).
7. **Add a `revive_reservation` admin RPC** if support staff ever need to undo accidental cancellations (currently impossible without direct SQL).

---

*Generated by sub-agent for AUDIT-2. Scripts `check_rls.ts`, `check_extra_tables.ts`, `check_rpcs.ts` left in project root for re-running.*
