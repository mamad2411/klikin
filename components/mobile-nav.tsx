"use client"

import { useState } from "react"

const NAV_LINKS = [
  { label: "Fitur",     href: "#platform" },
  { label: "Bisnis",     href: "#business" },
  { label: "Aplikasi",   href: "#apps" },
  { label: "Harga",      href: "#pricing" },
]

const RESOURCE_LINKS = [
  { label: "Integrasi", href: "#integrations" },
  { label: "Kontak", href: "/contact" },
  { label: "Tentang Kami", href: "#about" },
]

const NAV_STYLE = {
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  background: "rgba(245,244,240,0.30)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
} as const

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [resourceOpen, setResourceOpen] = useState(false)

  const close = () => {
    setOpen(false)
    setResourceOpen(false)
  }

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-3xl">

        {/* Main bar */}
        <nav
          className="flex items-center justify-between px-5 py-3 rounded-2xl border border-black/[0.06]"
          style={NAV_STYLE}
        >
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/logo/logo-klikin.webp" 
                alt="Klikin" 
                className="w-5 h-5 object-contain"
              />
              <span className="font-pixel text-[10px] tracking-[0.25em] text-black/70 uppercase">KLIKIN</span>
            </a>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="text-[11px] text-black/60 hover:text-black transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </a>
            ))}
            
            {/* Resource Dropdown - Desktop */}
            <div className="relative group">
              <button className="text-[11px] text-black/60 hover:text-black transition-colors duration-200 tracking-wide flex items-center gap-1">
                Resource
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              
              {/* Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-black/[0.06] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" style={NAV_STYLE}>
                <div className="py-2">
                  {RESOURCE_LINKS.map(l => (
                    <a
                      key={l.label}
                      href={l.href}
                      className="block px-4 py-2 text-[11px] text-black/60 hover:text-black hover:bg-black/[0.03] transition-colors tracking-wide"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-[11px] px-4 py-2 rounded-xl border border-black/10 text-black/60 hover:text-black hover:border-black/20 hover:bg-black/[0.03] transition-all duration-200 tracking-wide hidden md:block" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
              COBA GRATIS
            </button>

            {/* Burger — mobile only */}
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] rounded-lg hover:bg-black/[0.04] transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span
                className="block h-px bg-black/60 transition-all duration-300 origin-center"
                style={{
                  width: "18px",
                  transform: open ? "translateY(6px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block h-px bg-black/60 transition-all duration-300"
                style={{
                  width: "18px",
                  opacity: open ? 0 : 1,
                  transform: open ? "scaleX(0)" : "none",
                }}
              />
              <span
                className="block h-px bg-black/60 transition-all duration-300 origin-center"
                style={{
                  width: "18px",
                  transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <div
          className="md:hidden mt-2 overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: open ? "450px" : "0px", opacity: open ? 1 : 0 }}
        >
          <div
            className="rounded-2xl border border-black/[0.06] px-2 py-2 flex flex-col"
            style={NAV_STYLE}
          >
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={close}
                className="px-4 py-3 text-sm text-black/60 hover:text-black hover:bg-black/[0.03] rounded-xl transition-colors tracking-wide"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {l.label}
              </a>
            ))}
            
            {/* Resource - Mobile */}
            <div>
              <button
                onClick={() => setResourceOpen(v => !v)}
                className="w-full px-4 py-3 text-sm text-black/60 hover:text-black hover:bg-black/[0.03] rounded-xl transition-colors tracking-wide flex items-center justify-between"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Resource
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{
                    transform: resourceOpen ? "rotate(180deg)" : "none",
                    transition: "transform 200ms"
                  }}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              
              {/* Sub-menu */}
              <div 
                className="overflow-hidden transition-all duration-200"
                style={{ 
                  maxHeight: resourceOpen ? "200px" : "0px",
                  opacity: resourceOpen ? 1 : 0
                }}
              >
                {RESOURCE_LINKS.map(l => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={close}
                    className="block px-8 py-2 text-sm text-black/50 hover:text-black hover:bg-black/[0.03] rounded-xl transition-colors tracking-wide"
                    style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="mt-1 px-2 pb-1">
              <button className="w-full text-[11px] px-4 py-2.5 rounded-xl border border-black/10 text-black/60 hover:text-black hover:border-black/20 hover:bg-black/[0.03] transition-all duration-200 tracking-wide" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                COBA GRATIS
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
