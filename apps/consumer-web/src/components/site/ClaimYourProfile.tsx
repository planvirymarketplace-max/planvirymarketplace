'use client'

import { useState, useEffect, useRef } from "react";

const EMBER = "#cc6600";
const TEAL = "#00a3a3";

const benefits = [
  { label: "Manage your listings", desc: "Update your services, pricing, and availability in real time" },
  { label: "Get verified", desc: "Stand out with a verified badge that builds trust with clients" },
  { label: "Receive leads", desc: "Get booking inquiries directly through your profile" },
  { label: "Track analytics", desc: "See how many clients view and contact you each week" },
];

export function ClaimYourProfile({ navigate, inline }: { navigate: (path: string) => void; inline?: boolean }) {
  const [visible, setVisible] = useState(!!inline);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (inline) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [inline]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/claim-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // API may not exist yet
    }
    setSubmitted(true);
  };

  const innerContent = (
    <>
      <p className="font-utility text-sm tracking-wider mb-4" style={{ color: EMBER }}>
        VENDOR PORTAL
      </p>
      <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.02] text-foreground">
        Claim your <span className="italic font-normal text-ember">profile</span>.
      </h2>
      <p className="mt-4 text-base md:text-lg text-foreground/50 max-w-md">
        Are you a DJ, venue, photographer, or planner? Take control of your listing and connect with clients across Milwaukee.
      </p>

      {/* Benefits */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefits.map((b, i) => (
          <div
            key={b.label}
            className={`transition-all duration-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: visible ? `${300 + i * 100}ms` : "0ms" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-1 h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: i % 2 === 0 ? EMBER : TEAL }}
              />
              <div>
                <p className="text-sm font-bold text-foreground/80">{b.label}</p>
                <p className="text-xs text-foreground/40 mt-0.5">{b.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const formContent = submitted ? (
    <div className="text-center py-4">
      <div className="h-10 w-10 rounded-full border-2 border-teal flex items-center justify-center mx-auto mb-4">
        <span className="text-teal text-lg">&#10003;</span>
      </div>
      <h3 className="font-display text-xl font-bold text-foreground">You&apos;re on the list.</h3>
      <p className="mt-2 text-sm text-foreground/40">We&apos;ll send you a link to claim your profile.</p>
    </div>
  ) : (
    <>
      <h3 className="font-display text-2xl font-bold text-foreground">
        Get started <span className="italic font-normal text-ember">free</span>.
      </h3>
      <p className="mt-2 text-xs text-foreground/40">Enter your email to claim or create your vendor profile.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="font-utility text-[10px] text-foreground/30 tracking-widest block mb-2">EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            required
            className="w-full border-b border-foreground/15 bg-transparent py-3 text-base text-foreground placeholder:text-foreground/20 focus:border-ember focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full font-utility py-4 text-sm tracking-wider text-white transition-all bg-ember"
        >
          Claim Your Profile
        </button>

        <div className="flex items-center gap-3 pt-2">
          <div className="h-[1px] flex-1 bg-foreground/10" />
          <span className="text-[10px] text-foreground/20">OR SIGN UP WITH</span>
          <div className="h-[1px] flex-1 bg-foreground/10" />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="flex-1 font-utility py-3 text-xs tracking-wider text-foreground border border-foreground/15 transition-all hover:bg-foreground/5"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="flex-1 font-utility py-3 text-xs tracking-wider text-foreground border border-foreground/15 transition-all hover:bg-foreground/5"
          >
            Email
          </button>
        </div>
      </form>
    </>
  );

  if (inline) {
    return (
      <div>
        {innerContent}
        <div className="mt-8 border border-foreground/10 p-6 bg-background">
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-6 md:py-8 bg-[#ffffff]"
    >
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <div
          className={`flex flex-col md:flex-row gap-8 md:gap-10 items-start transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Left: Copy */}
          <div className="flex-1 min-w-0">
            {innerContent}
          </div>

          {/* Right: CTA form */}
          <div className="w-full md:w-[380px] shrink-0">
            <div className="border border-foreground/10 p-8 bg-background">
              {formContent}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
