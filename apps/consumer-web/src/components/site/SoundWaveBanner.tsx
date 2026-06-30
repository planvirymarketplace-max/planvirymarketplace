'use client'

import { useState, useEffect, useRef } from "react";

export function SoundWaveBanner() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const mainHeights = [8, 14, 20, 28, 36, 24, 16, 10, 6, 12, 22, 34, 40, 30, 18, 12, 8, 16, 26, 38, 32, 20, 10, 6];
  const reflectionHeights = [4, 6, 8, 10, 12, 10, 8, 6, 4, 6, 8, 10, 14, 16, 14, 10, 8, 6, 8, 12, 14, 12, 10, 8, 6, 4, 6, 8, 10, 8, 6, 4];
  const reflectionOpacities = [0.08, 0.06, 0.10, 0.08, 0.12, 0.08, 0.06, 0.10, 0.08, 0.06, 0.08, 0.10, 0.14, 0.12, 0.10, 0.08, 0.06, 0.10, 0.08, 0.12, 0.14, 0.10, 0.08, 0.06, 0.08, 0.10, 0.06, 0.08, 0.10, 0.08, 0.06, 0.04];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        src="/videos/sound.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content - minimal bottom padding to connect seamlessly with bento grid */}
      <div
        className={`
          relative z-10 mx-auto max-w-[1400px] px-4 md:px-6
          flex flex-col items-center justify-center text-center
          pt-8 md:pt-10 pb-4 md:pb-6
          transition-all duration-1000 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        {/* Accent line */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] w-8 bg-ember/60" />
          <div className="h-1 w-1 rounded-full bg-ember" />
          <div className="h-[1px] w-8 bg-ember/60" />
        </div>

        <h2
          className="font-display text-[clamp(2.5rem,6vw,6rem)] font-bold leading-[1] text-white/90"
        >
          Sound moves <span className="italic font-normal text-teal">everything</span>.
        </h2>

        <p className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-white/40 font-body">
          From the first note to the last call, our sound systems set the frequency for unforgettable nights.
        </p>

        {/* Sound wave visualization */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <div className="h-[1px] w-full max-w-[120px] bg-white/10" />

          <div className="flex items-end gap-[3px]">
            {Array.from({ length: 24 }).map((_, i) => {
              const height = mainHeights[i] || 10;
              const isCenter = i >= 10 && i <= 14;
              const duration = 0.8 + (i * 0.058);
              const delay = i * 0.08;
              const centerDuration = isCenter ? duration * 1.3 : duration;

              return (
                <div
                  key={i}
                  className={`
                    w-[2px] rounded-full
                    transition-all duration-700 ease-out
                    ${isCenter ? "bg-ember" : "bg-white/20"}
                  `}
                  style={{
                    height: visible ? `${height}px` : "2px",
                    transitionDelay: visible ? `${i * 40}ms` : "0ms",
                    transformOrigin: 'bottom',
                    animation: visible
                      ? `sound-pulse ${centerDuration}s ease-in-out ${delay}s infinite`
                      : 'none',
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-end gap-[2px]">
            {Array.from({ length: 32 }).map((_, i) => {
              const height = reflectionHeights[i] || 6;
              const duration = 0.6 + (i * 0.028);
              const delay = i * 0.05;
              const opacity = reflectionOpacities[i] || 0.08;

              return (
                <div
                  key={i}
                  className="w-[1px] rounded-full"
                  style={{
                    height: visible ? `${height}px` : "1px",
                    transitionDelay: visible ? `${i * 25}ms` : "0ms",
                    transformOrigin: 'bottom',
                    transition: `height 500ms ease-out ${visible ? i * 25 : 0}ms`,
                    backgroundColor: `rgba(255,255,255,${opacity})`,
                    animation: visible
                      ? `sound-pulse ${duration}s ease-in-out ${delay}s infinite`
                      : 'none',
                  }}
                />
              );
            })}
          </div>

          <div className="h-[1px] w-full max-w-[120px] bg-white/10" />
        </div>
      </div>
    </section>
  );
}
