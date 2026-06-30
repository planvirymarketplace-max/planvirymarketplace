export default function Page() {
  return (
    <main style={{ padding: "3rem", maxWidth: 720 }}>
      <h1 style={{ color: "#F47245", fontFamily: "Playfair, serif", fontStyle: "italic" }}>
        Planviry · vendor-portal
      </h1>
      <p style={{ color: "#009689" }}>Scaffolded per Part II §2.1 — Repository Architecture.</p>
      <p>This app boundary is provisioned and wired to the shared <code>@planviry/*</code> packages. Screen-level implementation is authored in a later phase (Part XLVIII / Part XXIII).</p>
      <pre style={{ background: "#111", padding: "1rem", borderRadius: 8, overflow: "auto" }}>app: @planviry/vendor-portal
port: 3001
stack: Next.js 16 + TypeScript + Tailwind
deps: @planviry/db, @planviry/types, @planviry/ui, @planviry/shared</pre>
    </main>
  );
}
