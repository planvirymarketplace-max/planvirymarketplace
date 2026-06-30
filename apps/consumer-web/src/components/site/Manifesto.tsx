'use client'

export function Manifesto() {
  return (
    <section className="relative bg-background py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12 md:items-start">
          <div className="md:col-span-3">
            <p className="font-utility text-[11px] text-ember">03 - Philosophy</p>
          </div>
          <div className="md:col-span-9">
            <p className="font-display text-3xl md:text-5xl leading-[1.15] text-foreground">
              We believe a great night isn't an accident, it's a <span className="italic text-teal">composition</span>.
              The right room. The right rhythm. The right people behind the lens and the laptop.
              Best Time exists to put those pieces in <span className="italic text-ember">your hands</span>,
              with the polish Milwaukee deserves.
            </p>

            <div className="mt-16 grid gap-12 sm:grid-cols-3">
              {[
                { k: "200+", v: "Vetted vendors across the network" },
                { k: "4.9", v: "Average client rating in 2025" },
                { k: "72hr", v: "Average response from any vendor" },
              ].map((s) => (
                <div key={s.k} className="border-t border-foreground pt-5">
                  <div className="font-display text-5xl font-bold">{s.k}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
