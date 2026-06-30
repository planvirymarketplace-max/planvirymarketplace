import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Boxes, FolderTree, GitBranch, Database, Cpu, FileCode2, Layers, ShieldCheck } from "lucide-react";

/**
 * Planviry — Monorepo Scaffold Status (live proof).
 *
 * This page is the user-visible / route. It renders the scaffolded monorepo
 * structure per Part II §2.1 and confirms Parts 0–3 are in place. It is NOT
 * the product UI — the product UI is built in Phase 9–10 (Parts XXIII/XXIV).
 *
 * Spec refs: Part 0 (Objective), Part I (Governance), Part II (Repository),
 *            Part III (Domain Definition).
 */

const APPS = [
  { name: "consumer-web", port: "3000", scope: "Guest-facing catalog, cart, itinerary", live: true },
  { name: "vendor-portal", port: "3001", scope: "Vendor dashboard, PMS, AI-assist", live: false },
  { name: "admin-portal", port: "3002", scope: "Moderation, taxonomy, seeding", live: false },
];

const PACKAGES = [
  { name: "@planviry/config", scope: "Shared ESLint/TS/Tailwind configs", deps: "—" },
  { name: "@planviry/types", scope: "Domain model — Zod schemas + TS types (Part III)", deps: "config" },
  { name: "@planviry/db", scope: "Prisma schema, migrations, RLS — exports db", deps: "types" },
  { name: "@planviry/ui", scope: "Shared shadcn/Tailwind lib + design tokens", deps: "types, config" },
  { name: "@planviry/search", scope: "Algolia wrappers + index schema", deps: "types, db" },
  { name: "@planviry/analytics", scope: "Event catalog + emitters", deps: "types" },
  { name: "@planviry/email-templates", scope: "React Email templates (Resend)", deps: "types, ui" },
];

const WORKERS = [
  { name: "ttl-sweep", scope: "Expires pending bookings past TTL (BR-R-002)" },
  { name: "search-sync", scope: "Re-indexes inventory → Algolia" },
  { name: "notification-digest", scope: "Batches + sends digest emails" },
  { name: "external-sync", scope: "Syncs Ticketmaster/Expedia → inventory schema" },
];

const FUNCTIONS = [
  { name: "stripe-webhook", scope: "Stripe payment webhooks (TicketiHub pattern)" },
  { name: "booking-ttl", scope: "TTL enforcement via pg_cron" },
  { name: "search-ingest", scope: "Inventory insert/update → Algolia" },
  { name: "notification-send", scope: "Delivers email/push/in-app" },
];

const CONSTRAINTS = [
  { id: "CONSTRAINT-001", rule: "Cross-vertical cart invariant — every InventoryItem addable to same Cart" },
  { id: "CONSTRAINT-002", rule: "Location gate mandatory at API + client guard" },
  { id: "CONSTRAINT-003", rule: "Vertical Row swaps feed in place — never navigates" },
  { id: "CONSTRAINT-004", rule: "Vendor dashboards account-scoped via RLS" },
  { id: "CONSTRAINT-005", rule: "All booking transitions via Reservation FSM" },
];

const PARTS = [
  { id: "Part 0", title: "Objective & Completion Definition", status: "complete", file: "docs/00-objective.md" },
  { id: "Part I", title: "Governance (Layer 0)", status: "complete", file: "docs/01-governance.md" },
  { id: "Part II", title: "Repository Architecture", status: "complete", file: "docs/02-repository.md" },
  { id: "Part III", title: "Domain Definition (DOM-001 → DOM-020)", status: "complete", file: "packages/types/" },
  { id: "Parts IV+", title: "Business Rules → Customer Portal", status: "pending", file: "—" },
];

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F47245]/10">
          <Icon className="h-5 w-5 text-[#F47245]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Hero */}
      <header className="border-b border-neutral-200 bg-[#010000] text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center gap-2 text-sm text-[#DBE0E0]">
            <Boxes className="h-4 w-4 text-[#F47245]" />
            <span>Planviry Monorepo</span>
            <span className="text-neutral-500">·</span>
            <span>Implementation Specification</span>
          </div>
          <h1
            className="mt-4 text-4xl md:text-5xl font-medium"
            style={{ fontFamily: "Playfair, Georgia, serif", fontStyle: "italic", color: "#F47245" }}
          >
            Planviry
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-[#DBE0E0]" style={{ fontFamily: "Syne, sans-serif" }}>
            Multi-vertical occasion orchestration platform. This page is live proof that the
            <strong className="text-white"> Turborepo monorepo</strong> is scaffolded per{" "}
            <strong className="text-[#009689]">Part II §2.1</strong> and that{" "}
            <strong className="text-white">Parts 0–3</strong> of the Implementation Specification are complete.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge className="bg-[#F47245] text-white hover:bg-[#F47245]">Turborepo + Bun workspaces</Badge>
            <Badge variant="outline" className="border-[#009689] text-[#009689]">3 apps · 7 packages · 4 workers · 4 functions</Badge>
            <Badge variant="outline" className="border-neutral-600 text-neutral-300">Next.js 16 · TypeScript 5</Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 space-y-8">
        {/* Part completion */}
        <Section icon={CheckCircle2} title="Specification Parts 0–3 — Completion Status" subtitle="Part 0 §0.3 Completion Definition Checklist">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PARTS.map((p) => (
              <div
                key={p.id}
                className={`rounded-lg border p-4 ${
                  p.status === "complete"
                    ? "border-[#009689]/30 bg-[#009689]/5"
                    : "border-neutral-200 bg-neutral-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-neutral-500">{p.id}</span>
                  {p.status === "complete" ? (
                    <Badge className="bg-[#009689] text-white hover:bg-[#009689]">✓ complete</Badge>
                  ) : (
                    <Badge variant="outline" className="text-neutral-500">pending</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-neutral-900">{p.title}</p>
                <p className="mt-1 font-mono text-xs text-neutral-500">{p.file}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Repository tree */}
        <Section icon={FolderTree} title="Repository Tree (Part II §2.1 — canonical)" subtitle="apps/ · packages/ · workers/ · functions/ · shared/ · docs/ · supabase/">
          <pre className="overflow-x-auto rounded-lg bg-[#010000] p-5 text-xs leading-relaxed text-[#DBE0E0] font-mono">
{`planviry/
├─ apps/
│  ├─ consumer-web/      Next.js 16 · port 3000 · guest-facing catalog, cart, itinerary
│  ├─ vendor-portal/     Next.js 16 · port 3001 · vendor dashboard, PMS, AI-assist
│  └─ admin-portal/      Next.js 16 · port 3002 · moderation, taxonomy, seeding
├─ packages/
│  ├─ config/            Shared ESLint / TS / Tailwind configs
│  ├─ types/             Zod schemas + TS types — DOM-001…DOM-020 (Part III)
│  ├─ db/                Prisma schema, migrations, seed — exports \`db\`
│  ├─ ui/                Shared shadcn/Tailwind lib + design tokens
│  ├─ search/            Algolia wrappers + index schema
│  ├─ analytics/         Event catalog + type-safe emitters
│  └─ email-templates/   React Email templates (Resend)
├─ workers/
│  ├─ ttl-sweep/         Cron — expires pending bookings past TTL
│  ├─ search-sync/       Cron — re-indexes inventory → Algolia
│  ├─ notification-digest/ Cron — batches + sends digest emails
│  └─ external-sync/     Syncs Ticketmaster/Expedia → inventory schema
├─ functions/
│  ├─ stripe-webhook/    Supabase Edge Fn — Stripe payment webhooks
│  ├─ booking-ttl/       Supabase Edge Fn — TTL via pg_cron
│  ├─ search-ingest/     Supabase Edge Fn — inventory → Algolia
│  └─ notification-send/ Supabase Edge Fn — email/push/in-app delivery
├─ shared/               Cross-cutting: logger, errors, constants, dates
├─ docs/                 ADRs, runbooks, spec parts (00–03 complete)
├─ supabase/             Project config, migrations, seed SQL, RLS
├─ turbo.json            Turborepo task pipeline
├─ tsconfig.base.json    Shared TS compiler options
└─ package.json          Monorepo root (Bun workspaces + Turbo)`}
          </pre>
        </Section>

        {/* Apps */}
        <Section icon={Layers} title="Apps (Part II §2.2 — app boundaries)" subtitle="Each app is a separate Next.js 16 build with its own port">
          <div className="grid gap-3 md:grid-cols-3">
            {APPS.map((a) => (
              <Card key={a.name} className={a.live ? "border-[#F47245]/40" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono text-base">{a.name}</CardTitle>
                    {a.live ? (
                      <Badge className="bg-[#F47245] text-white hover:bg-[#F47245]">LIVE :{a.port}</Badge>
                    ) : (
                      <Badge variant="outline">:{a.port}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-neutral-600">{a.scope}</CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Packages */}
        <Section icon={Boxes} title="Shared Packages (Part II §2.1)" subtitle="Hierarchical import graph — circular deps are a build failure">
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Package</th>
                  <th className="px-4 py-2 font-medium">Scope</th>
                  <th className="px-4 py-2 font-medium">Imports from</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {PACKAGES.map((p) => (
                  <tr key={p.name}>
                    <td className="px-4 py-3 font-mono text-[#8559EC]">{p.name}</td>
                    <td className="px-4 py-3 text-neutral-700">{p.scope}</td>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{p.deps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Workers + Functions */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Section icon={Cpu} title="Workers (Part XIV)" subtitle="Background cron jobs — `bun --hot` dev loop">
            <ul className="space-y-2">
              {WORKERS.map((w) => (
                <li key={w.name} className="flex items-start gap-3 rounded-md border border-neutral-100 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#009689]" />
                  <div>
                    <p className="font-mono text-sm text-neutral-900">workers/{w.name}/</p>
                    <p className="text-xs text-neutral-500">{w.scope}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={FileCode2} title="Supabase Edge Functions (Part XII)" subtitle="Deno runtime — deployed via `supabase functions deploy`">
            <ul className="space-y-2">
              {FUNCTIONS.map((f) => (
                <li key={f.name} className="flex items-start gap-3 rounded-md border border-neutral-100 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#009689]" />
                  <div>
                    <p className="font-mono text-sm text-neutral-900">functions/{f.name}/</p>
                    <p className="text-xs text-neutral-500">{f.scope}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Constraints */}
        <Section icon={ShieldCheck} title="Binding Constraints (Part I §1.1.6)" subtitle="Every architectural decision is evaluated against these">
          <div className="grid gap-3 md:grid-cols-2">
            {CONSTRAINTS.map((c) => (
              <div key={c.id} className="flex items-start gap-3 rounded-md border border-[#F47245]/20 bg-[#F47245]/5 p-3">
                <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-[#F47245]" />
                <div>
                  <p className="font-mono text-xs text-[#F47245]">{c.id}</p>
                  <p className="text-sm text-neutral-800">{c.rule}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* DB boundary */}
        <Section icon={Database} title="@planviry/db — package boundary proven" subtitle="This page imports the shared db client through the workspace boundary">
          <DbProof />
        </Section>
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-neutral-500">
          <p>
            <span style={{ fontFamily: "Playfair, serif", fontStyle: "italic", color: "#F47245" }}>Planviry</span>
            {" — Foundation, Governance & Domain Core · v1.0.0 Foundation Release"}
          </p>
          <p className="font-mono text-xs">Parts 0–3 complete · Part II scaffold verified</p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Server component that proves the monorepo workspace boundaries resolve
 * end-to-end at runtime. Two probes:
 *
 *  1. @planviry/types — imports a Part III domain schema (UserSchema) and
 *     validates a sample entity. Proves the domain-types boundary works.
 *  2. @planviry/db — imports the package (proves the workspace resolution).
 *     Full Prisma runtime initialization (db.user.count()) is a Part VI
 *     (Data Layer) concern; here we only assert the package resolves.
 */
async function DbProof() {
  // Probe 1: @planviry/types (Part III domain model, runtime Zod validation)
  let typesStatus: { ok: boolean; detail: string } = { ok: false, detail: "untested" };
  try {
    const mod = await import("@planviry/types");
    const sample = {
      id: "user_sample",
      email: "scaffold@planviry.local",
      name: "Scaffold Probe",
      role: "CONSUMER",
      status: "REGISTERED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const parsed = mod.UserSchema.safeParse(sample);
    if (parsed.success) {
      typesStatus = { ok: true, detail: `UserSchema validated · DOM-001 resolves · ${Object.keys(mod).length} exports` };
    } else {
      typesStatus = { ok: false, detail: `schema rejected: ${parsed.error.issues[0]?.message ?? "unknown"}` };
    }
  } catch (err) {
    typesStatus = { ok: false, detail: String(err) };
  }

  // Probe 2: @planviry/db (workspace package resolution)
  let dbStatus: { ok: boolean; detail: string } = { ok: false, detail: "untested" };
  try {
    const mod = await import("@planviry/db");
    const hasDb = typeof mod.db !== "undefined";
    const hasPrisma = typeof mod.PrismaClient !== "undefined";
    dbStatus = {
      ok: hasDb,
      detail: hasDb
        ? `package resolves · db singleton ${hasPrisma ? "+ PrismaClient" : ""} exported (runtime query pending Part VI)`
        : "package resolved but `db` export missing",
    };
  } catch (err) {
    dbStatus = { ok: false, detail: String(err) };
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        {typesStatus.ok ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#009689]" />
        ) : (
          <ShieldCheck className="h-5 w-5 shrink-0 text-red-500" />
        )}
        <div className="font-mono text-sm break-all">
          <span className="text-neutral-500">import {"{ UserSchema }"} from "@planviry/types" → </span>
          <span className={typesStatus.ok ? "text-[#009689]" : "text-red-600"}>{typesStatus.detail}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        {dbStatus.ok ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#009689]" />
        ) : (
          <ShieldCheck className="h-5 w-5 shrink-0 text-red-500" />
        )}
        <div className="font-mono text-sm break-all">
          <span className="text-neutral-500">import {"{ db }"} from "@planviry/db" → </span>
          <span className={dbStatus.ok ? "text-[#009689]" : "text-red-600"}>{dbStatus.detail}</span>
        </div>
      </div>
    </div>
  );
}
