'use client'

export function AboveFooterVideo({ navigate }: { navigate?: (path: string) => void }) {
  return (
    <section className="relative h-[60svh] min-h-[400px] w-full overflow-hidden bg-ink">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        src="/videos/above-footer.mp4"
        autoPlay muted loop playsInline
      />
      <div className="absolute inset-0 bg-ink/50" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-14 md:px-6 md:pb-18">
        <div className="max-w-3xl">
          <p className="font-utility text-[11px] text-ember mb-6">Ready When You Are</p>
          <h2 className="font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-bold leading-[0.98] text-background">
            Your date is <span className="italic font-normal text-teal">waiting</span>.
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate?.("/booking")}
              className="font-utility inline-flex items-center bg-ember px-7 py-4 text-[11px] text-ember-foreground hover:bg-background hover:text-ink transition-colors"
            >
              Start Booking
            </button>
            <button
              onClick={() => navigate?.("/contact")}
              className="font-utility inline-flex items-center border border-background/50 px-7 py-4 text-[11px] text-background hover:border-teal hover:text-teal transition-colors"
            >
              Talk to a Concierge
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
