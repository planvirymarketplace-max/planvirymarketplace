# Part 0 — Objective & Completion Definition

> **Status: COMPLETE for the foundation release.**
> This Part defines what "done" means for every subsequent Part of the
> Implementation Specification. No Part is considered complete unless every
> field, rule, and artifact enumerated here has been satisfied for that Part's
> scope. The criteria below are binding on every engineer, AI agent, and
> contractor working in the Planviry monorepo.

---

## 0.1 Objective Statement

Planviry is an **orchestrator platform** — a single timeline that holds every
component of a planned occasion (lodging, flights, ticketed events, venues,
vendors, dining) in one cart and one itinerary. The Implementation
Specification is a **deterministic build contract**: every decision about what
to build, why, in what order, and how to validate it is recorded here before
any implementation task begins. **No implementation task should require
assumptions beyond what this document specifies.**

> **NOTE:** Derived from Foundation Narrative §1. The "orchestrator" framing is
> load-bearing: every architectural decision must be evaluated against whether
> it reinforces or weakens the cross-vertical cart and itinerary as the
> platform's structural moat. (See Part I §1.1.1 for the full Vision, and
> Part I §1.3 — Principle "Moat First" — for the binding rule form of this
> statement.)

The objective of Part 0 itself is narrow: to publish the single acceptance
criterion (§0.2), the completion checklist (§0.3), and the decomposition
method (§0.4) that all subsequent Parts are measured against. Part 0 is the
yardstick, not the architecture.

---

## 0.2 Acceptance Criterion

The following Global Acceptance Criterion (GAC-001) is the single sentence
that every Part of this specification must satisfy. It is quoted verbatim from
the Implementation Specification and may not be paraphrased, weakened, or
silently extended.

> **Global Acceptance Criterion (GAC-001)**
>
> No engineer, AI agent, or contractor should need to make an undocumented
> decision to complete any task described in this specification. If a task
> requires information not present in this document, that is a specification
> gap — file it as `SPEC-GAP-XXXXX`, halt the task, and resolve the gap before
> proceeding.

### Operational consequences of GAC-001

- **Halting is mandatory.** When a task surfaces a gap, the correct action is
  to stop and file the gap — not to make a "reasonable" decision and continue.
  An undocumented decision is, by definition, a violation of GAC-001.
- **Gap identifiers are sequential.** Use the prefix `SPEC-GAP-` followed by a
  five-digit zero-padded number. The gap record must name the Part, the
  question, and the blocking downstream Parts.
- **Resolution re-opens the task.** A gap is closed by amending the relevant
  Part (with a versioned edit — see C-13) and recording the resolution in the
  gap registry. Only then may the halted task resume.
- **GAC-001 applies recursively.** A Part that depends on another Part may not
  begin implementation until the dependency satisfies C-14 (zero open
  `SPEC-GAP` items in its scope).

---

## 0.3 Completion Definition Checklist

Every Part of this specification must satisfy **all** items below before it is
considered complete and before any downstream Part that depends on it may
begin implementation. The validation methods are normative — they are the
procedure a reviewer (human or automated) follows to assert that a criterion
has been met.

| #    | Completion Criterion                       | Validation Method                                                                                                                  |
| ---- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| C-01 | Every business rule has a unique ID (`BR-XXXXXX` format) | Grep for `BR-` pattern; count matches against rule inventory                                                                      |
| C-02 | Every entity has a schema definition       | Schema Catalog (Part VI) contains an entry for every domain object in Part III                                                     |
| C-03 | Every schema has migrations                | Migration files exist; numbered and ordered per Part VI.5                                                                          |
| C-04 | Every migration has a rollback             | Each migration file has a corresponding `down()` function                                                                          |
| C-05 | Every API endpoint has a contract          | Part XI entry exists with method, route, input schema, output schema, error codes                                                  |
| C-06 | Every function has implementation details  | Part X service entries or Part XII edge function entries contain step-by-step logic                                                |
| C-07 | Every interaction has defined behavior     | Part XXIV UX flow entry exists covering trigger → validation → feedback → rollback                                                 |
| C-08 | Every failure has a recovery path          | Part XXXIII failure-mode registry contains an entry with recovery procedure                                                        |
| C-09 | Every dependency is documented             | Part XXXVII dependency graph contains node entries for all dependencies                                                            |
| C-10 | Every requirement maps to tests            | Part XXXVI traceability matrix links `REQ-` → test case IDs                                                                        |
| C-11 | Every deployment step is ordered           | Part XXXI deployment order is complete; no circular dependencies                                                                   |
| C-12 | Every monitoring rule is defined           | Part XXIX alert thresholds contain entries for every critical path                                                                 |
| C-13 | Every artifact is versioned                | All schema, API, and component artifacts carry version fields                                                                      |
| C-14 | No implementation decision is left unspecified | GAC-001 audit passes: zero open `SPEC-GAP` items in the relevant Part                                                              |

### How to read the checklist

- **C-01 through C-13 are artifact-level.** Each ties a kind of artifact
  (business rule, schema, migration, endpoint, function, UX flow, failure
  mode, dependency, requirement, deployment step, monitoring rule, version
  field) to a specific Part of the spec that owns its registry. The validation
  method is the lookup procedure — it names the place the artifact must live
  and the shape it must take.
- **C-14 is the meta-criterion.** It collapses the entire checklist back onto
  GAC-001. A Part can satisfy C-01 through C-13 individually and still fail
  C-14 if any open `SPEC-GAP` item references its scope. C-14 is therefore the
  gate that downstream Parts wait on.
- **Order is not negotiable.** A Part cannot be marked complete by partial
  credit. If C-07 fails because a UX flow is missing, the Part is incomplete —
  regardless of how thoroughly C-01 through C-06 passed.

### Cross-references to the owning Parts

| Criterion | Owning Part                     |
| --------- | ------------------------------- |
| C-01      | Business-rule registry (per-Part) |
| C-02      | Part VI — Schema Catalog        |
| C-03, C-04 | Part VI.5 — Migrations         |
| C-05      | Part XI — API Contracts         |
| C-06      | Part X — Services / Part XII — Edge Functions |
| C-07      | Part XXIV — UX Flows            |
| C-08      | Part XXXIII — Failure Modes     |
| C-09      | Part XXXVII — Dependency Graph  |
| C-10      | Part XXXVI — Traceability Matrix |
| C-11      | Part XXXI — Deployment Order    |
| C-12      | Part XXIX — Monitoring          |
| C-13      | Versioning strategy (Part I §1.3) |
| C-14      | GAC-001 (this Part, §0.2)       |

---

## 0.4 Master Decomposition Method

Every system in this specification is decomposed in the following order. **No
implementation may begin until decomposition is complete to the level of
implementation steps.** The 14 steps are sequential within a single system:
later steps consume the outputs of earlier steps.

1. **Enumerate every system.** Produce the inventory of systems that compose
   the platform. Each system gets a stable identifier.
2. **Decompose each system into components.** For each system, list the
   components (services, packages, apps, edge functions) that implement it.
3. **Decompose each component into behaviors.** For each component, list the
   behaviors it exposes (endpoints, jobs, handlers, RPCs).
4. **Decompose each behavior into state transitions.** For each behavior, list
   the state transitions it triggers, expressed against the relevant FSM
   (see Part V).
5. **Decompose each state transition into implementation steps.** For each
   transition, list the ordered, atomic steps the implementation must perform.
6. **Define every dependency** (input → output contracts). For each step,
   declare what it consumes and what it produces, with schemas.
7. **Define every artifact produced.** Migrations, schemas, RPCs, types,
   index entries, documentation — each named and versioned (C-13).
8. **Define every validation rule.** Each rule gets a `BR-` ID (C-01) and is
   attached to the behavior or transition that enforces it.
9. **Define every failure mode.** Each failure gets an entry in the Part
   XXXIII registry (C-08) with an error code.
10. **Define every recovery path.** Each failure mode from step 9 gets a
    recovery procedure — manual or automated.
11. **Define every test** (unit, integration, E2E, load, chaos). Each test
    case is linked back to a `REQ-` ID in the Part XXXVI traceability matrix
    (C-10).
12. **Define every deployment dependency.** Each artifact declares what must
    be deployed before it can run; the Part XXXI deployment order is the
    topological sort of these declarations (C-11).
13. **Define every operational procedure.** Runbooks, on-call procedures,
    backup/restore, secret rotation — each named and linked from the relevant
    component.
14. **Cross-reference everything with unique IDs** (`BR-`, `REQ-`, `SC-`,
    `API-`, `COMP-`, `TEST-`). Every artifact produced in steps 1–13 must be
    reachable by ID from at least one other artifact, and every ID must
    resolve to exactly one artifact.

### Why the order matters

Steps 1–5 walk the system down from the platform level to a single line of
business logic. Steps 6–10 then walk the implementation back up, declaring
everything the implementation will need or produce. Steps 11–13 declare the
surrounding operational envelope. Step 14 stitches the whole graph together.

Skipping ahead — for example, writing tests (step 11) before failure modes
(step 9) are defined — produces tests that cannot be linked to recovery paths,
which then fails C-08 and C-10 simultaneously. The 14-step order is the
minimum sequence that guarantees every completion criterion in §0.3 is
satisfiable.

### Decomposition and the FSM gate

Step 4 (state transitions) depends on the Reservation FSM defined in Part V.
Any system whose behaviors touch booking state must wait for Part V to be
complete before its step 4 can be performed — a direct consequence of
CONSTRAINT-005 (see Part I §1.1.6). This is one of several places where the
decomposition method enforces the Part dependency graph implicitly: the
ordering of the steps inside one system is constrained by the completeness of
other Parts.

---

## Status

| Item                  | State                                                              |
| --------------------- | ------------------------------------------------------------------ |
| Part 0 completeness   | COMPLETE for the foundation release                                |
| Open `SPEC-GAP` items | None in Part 0 scope                                               |
| Downstream gates      | Parts I–XLVI may now reference GAC-001 and C-01–C-14 as binding    |
| Next Part             | Part I — Governance (Layer 0), see `01-governance.md`              |

Part 0 is the contract every other Part signs. It is short by design: the
yardstick does not need to be long, only exact.
