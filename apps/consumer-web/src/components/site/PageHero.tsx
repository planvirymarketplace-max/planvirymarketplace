'use client'

export function PageHero({
  eyebrow,
  title,
  italic,
  description,
  ctaLabel = "Reserve a Date",
  ctaTo = "/booking",
  navigate,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
  navigate: (path: string) => void;
}) {
  return (
    <section className="relative bg-cream border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
        <p className="font-utility text-[11px] text-ember">{eyebrow}</p>
        <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.02] text-foreground max-w-4xl">
          {title}
          {italic && (
            <>
              {" "}
              <span className="italic font-normal text-teal">{italic}</span>
            </>
          )}
        </h1>
        {description && (
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        <div className="mt-10">
          <button
            onClick={() => navigate(ctaTo)}
            className="font-utility inline-flex items-center bg-ember px-7 py-4 text-[11px] text-ember-foreground transition-all hover:bg-ink hover:text-background"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

export function ContentSection({
  eyebrow,
  title,
  children,
  bg = "background",
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  bg?: "background" | "cream" | "ink";
}) {
  const bgClass =
    bg === "ink" ? "bg-ink text-ink-foreground" : bg === "cream" ? "bg-cream" : "bg-background";
  return (
    <section className={`relative ${bgClass} py-20 md:py-28`}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {eyebrow && <p className="font-utility text-[11px] text-ember">{eyebrow}</p>}
        {title && (
          <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-[1.05] max-w-3xl">
            {title}
          </h2>
        )}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
