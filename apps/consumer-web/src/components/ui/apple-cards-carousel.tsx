'use client'

import { useState, useEffect, useRef } from "react"

/* ───────────────────────────────────────────────
   Aceternity-style AppleCardsCarousel
   - Horizontal scroll with CSS snap
   - Dark section bg, cream cards with dark text
   - No gradients, shadows, hover effects, icons, numbers, em dashes
   - Large typography, generous spacing, minimal structure
   ─────────────────────────────────────────────── */

interface CarouselCard {
  title: string
  tagline: string
  accent: 'ember' | 'teal'
}

const CARDS: CarouselCard[] = [
  { title: 'Weddings',   tagline: 'The soundtrack to your forever', accent: 'ember' },
  { title: 'Corporate',  tagline: 'Boardroom to ballroom',         accent: 'teal'  },
  { title: 'Nightclubs', tagline: 'We own the night',              accent: 'ember' },
  { title: 'Festivals',  tagline: 'Main stage energy',             accent: 'teal'  },
  { title: 'Birthdays',  tagline: 'Make it loud',                  accent: 'ember' },
  { title: 'Galas',      tagline: 'Black tie, bold sound',         accent: 'teal'  },
]

const ACCENT_MAP = {
  ember: '#cc6600',
  teal: '#00a3a3',
}

export function AppleCardsCarousel() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-16 md:pt-20 pb-6 md:pb-8">
        <h2
          className={`
            font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02]
            text-white
            transition-all duration-700 ease-out
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          Every{' '}
          <span
            className="italic font-normal"
            style={{ color: ACCENT_MAP.teal }}
          >
            event
          </span>
          , every{' '}
          <span
            className="italic font-normal"
            style={{ color: ACCENT_MAP.ember }}
          >
            venue
          </span>
          .
        </h2>
      </div>

      <div
        className={`
          flex gap-5 md:gap-6 overflow-x-auto
          snap-x snap-mandatory
          px-6 md:px-10 pb-12 md:pb-16
          scrollbar-hide
          transition-all duration-700 ease-out delay-200
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Left spacer for centering on large screens */}
        <div className="shrink-0 w-0 lg:w-[calc((100vw-1400px)/2)]" />

        {CARDS.map((card, i) => (
          <div
            key={i}
            className={[
              'shrink-0 snap-start',
              'w-[300px] md:w-[380px]',
              'h-[440px] md:h-[500px]',
              'rounded-2xl',
              'flex flex-col justify-end',
              'p-8 md:p-10',
              'transition-all duration-700 ease-out',
            ].join(' ')}
            style={{
              backgroundColor: '#faf9f6',
              transitionDelay: visible ? `${i * 100 + 200}ms` : '0ms',
            }}
          >
            <h3
              className="font-display text-5xl md:text-6xl font-bold leading-[1.02]"
              style={{ color: '#0a0a0a' }}
            >
              {card.title}
            </h3>

            <p
              className="mt-3 text-xl md:text-2xl leading-snug max-w-[300px]"
              style={{ color: ACCENT_MAP[card.accent] }}
            >
              {card.tagline}
            </p>
          </div>
        ))}

        {/* Right spacer */}
        <div className="shrink-0 w-6 md:w-10" />
      </div>
    </section>
  )
}
