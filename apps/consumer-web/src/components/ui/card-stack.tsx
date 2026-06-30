'use client'

import { useState, useEffect, useRef, useCallback } from "react"

/* ───────────────────────────────────────────────
   Aceternity-style CardStack
   - Stacked cards auto-rotate every 4s
   - Cream section bg, dark ink cards with white text
   - Ember + teal accents in description text only
   - No gradients / shadows / hover / icons / numbers / em dashes
   - Oversized type, generous padding, maximum breathing room
   ─────────────────────────────────────────────── */

interface CardStackItem {
  title: string
  description: string
  accent: 'ember' | 'teal'
}

const CARDS: CardStackItem[] = [
  {
    title: 'DJ Services',
    description: 'From weddings to nightclubs, our DJs read the room and set the tone.',
    accent: 'ember',
  },
  {
    title: 'Photo Booth',
    description: 'Strip, digital, or GIF. Branded backdrops. Instant memories.',
    accent: 'teal',
  },
  {
    title: 'Mobile Event Van',
    description: 'A full rig on wheels. Sound, lights, and energy delivered to your door.',
    accent: 'ember',
  },
  {
    title: 'Sound Systems',
    description: 'Concert-grade rigs scaled to any room. Crisp highs, chest-rattling lows.',
    accent: 'teal',
  },
]

const ACCENT_MAP = {
  ember: '#cc6600',
  teal: '#00a3a3',
}

export function CardStack() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const [paused, setPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* IntersectionObserver for entrance animation */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  /* Auto-rotate timer */
  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % CARDS.length)
    }, 4000)
  }, [])

  useEffect(() => {
    if (paused || !visible) return
    startTimer()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused, visible, startTimer])

  const handleDotClick = (index: number) => {
    setActive(index)
    setPaused(true)
    /* Resume auto-rotate after 6s of inactivity */
    setTimeout(() => setPaused(false), 6000)
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#faf9f6' }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 md:py-14">
        {/* Stack container */}
        <div
          className={`
            relative w-full
            transition-all duration-700 ease-out
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
          style={{ height: '480px' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {CARDS.map((card, i) => {
            const offset = ((i - active + CARDS.length) % CARDS.length)
            const isActive = offset === 0

            /* Visual position in the stack */
            let translateY = 0
            let scale = 1
            let opacity = 1
            let zIndex = CARDS.length - offset

            if (offset === 0) {
              translateY = 0
              scale = 1
              opacity = 1
            } else if (offset === 1) {
              translateY = 14
              scale = 0.965
              opacity = 0.55
            } else if (offset === 2) {
              translateY = 28
              scale = 0.93
              opacity = 0.25
            } else {
              translateY = 42
              scale = 0.895
              opacity = 0.08
            }

            return (
              <div
                key={i}
                className={[
                  'absolute inset-0',
                  'rounded-2xl',
                  'flex flex-col justify-end',
                  'p-8 md:p-10',
                  'transition-all duration-500 ease-out',
                  isActive ? 'cursor-default' : 'cursor-pointer',
                ].join(' ')}
                style={{
                  backgroundColor: '#0a0a0a',
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
                onClick={() => {
                  if (!isActive) {
                    setActive(i)
                    setPaused(true)
                    setTimeout(() => setPaused(false), 6000)
                  }
                }}
              >
                <h3
                  className="font-display text-6xl md:text-7xl font-bold leading-[1.02] text-white tracking-tight"
                >
                  {card.title}
                </h3>

                <p
                  className="mt-4 text-xl md:text-2xl leading-snug max-w-2xl"
                  style={{ color: ACCENT_MAP[card.accent] }}
                >
                  {card.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Dot navigation */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={[
                'rounded-full transition-all duration-300',
                i === active
                  ? 'w-10 h-2'
                  : 'w-2 h-2 bg-[#0a0a0a]/20',
              ].join(' ')}
              style={
                i === active
                  ? { backgroundColor: ACCENT_MAP[CARDS[i].accent] }
                  : undefined
              }
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
