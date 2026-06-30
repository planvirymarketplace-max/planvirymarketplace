'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navLinks = [
  { to: "/events", label: "Explore Events" },
  { to: "/directory", label: "Directory" },
  { to: "/event-ideas", label: "Event Ideas" },
  { to: "/support", label: "Support" },
]

export function Nav({ variant = "solid", navigate }: { variant?: "transparent" | "solid"; navigate: (path: string) => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isTransparent = variant === "transparent" && !scrolled

  return (
    <header
      className={[
        "left-0 right-0 z-50 transition-all duration-200",
        variant === "transparent" ? "absolute top-0" : "sticky top-0",
        !isTransparent ? "bg-black/95 backdrop-blur-sm" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Logo row - full width, centered, tight */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1200px] items-center justify-center px-4 py-2">
          <Link href="/" onClick={() => navigate("/")} className="block">
            <Image
              src="/Planvirylogo.png"
              alt="Planviry - event planning simplified"
              width={180}
              height={180}
              className="h-16 w-auto"
              priority
            />
          </Link>
        </div>
      </div>

      {/* Nav row - below logo, like Yelp */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-1.5">
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => navigate(l.to)}
                className="text-xs text-white/70 hover:text-white transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex ml-auto">
            <button
              onClick={() => navigate("/login")}
              className="text-xs text-white/80 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              Log In →
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-xs bg-white text-black px-4 py-1.5 rounded hover:bg-white/90 transition-colors inline-flex items-center gap-1"
            >
              Sign Up
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/95 border-b border-white/10">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => { navigate(l.to); setOpen(false) }}
                className="text-sm text-white/70 hover:text-white text-left transition-colors"
              >
                {l.label}
              </button>
            ))}
            <div className="flex gap-3 pt-2 border-t border-white/10">
              <button onClick={() => { navigate("/login"); setOpen(false) }} className="text-sm text-white/80 hover:text-white transition-colors">Log In</button>
              <button onClick={() => { navigate("/register"); setOpen(false) }} className="text-sm bg-white text-black px-4 py-1.5 rounded hover:bg-white/90 transition-colors">Sign Up</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
