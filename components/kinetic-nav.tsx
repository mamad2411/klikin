"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
]

const RESOURCE_LINKS = [
  { label: "Kontak", href: "/contact" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Integrasi", href: "/#integrations" },
]

export function KineticNav() {
  const [open, setOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileResourceOpen, setMobileResourceOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const resourceBtnRef = useRef<HTMLButtonElement>(null)
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const mobileResourceLinksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const navbarRef = useRef<HTMLDivElement>(null)
  const navContainerRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(false)
  const pathname = usePathname()

  // Sync openRef with open state
  useEffect(() => {
    openRef.current = open
  }, [open])

  // Page transition entrance animation
  useEffect(() => {
    if (navContainerRef.current) {
      gsap.fromTo(
        navContainerRef.current,
        {
          opacity: 0,
          y: -30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
        }
      )
    }
  }, [pathname])

  // Hide on scroll (up or down), show when idle
  useEffect(() => {
    const handleScroll = () => {
      // Don't hide if menu is open
      if (openRef.current) return;

      setIsVisible(false)
      
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Set timeout to show navbar after 250ms of no scrolling
      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(true)
      }, 250)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // GSAP animations
  useEffect(() => {
    const tl = gsap.timeline()

    if (open && menuRef.current) {
      // RESET state before animation
      gsap.set(menuRef.current, { visibility: 'visible', x: '100%' })
      gsap.set(backdropRef.current, { opacity: 0, visibility: 'visible' })
      gsap.set(linksRef.current, { x: 30, opacity: 0 })
      gsap.set(resourceBtnRef.current, { x: 30, opacity: 0 })
      gsap.set(ctaRef.current, { x: 30, opacity: 0 })

      // OPEN Animation
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      })
      .to(menuRef.current, {
        x: '0%',
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.2')
      .to(linksRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out'
      }, '-=0.3')
      .to(resourceBtnRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.35')
      .to(ctaRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.2')

    } else if (!open && menuRef.current) {
      // CLOSE Animation
      tl.to(ctaRef.current, {
        x: 20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      })
      .to(resourceBtnRef.current, {
        x: 20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, '-=0.2')
      .to(linksRef.current, {
        x: 20,
        opacity: 0,
        duration: 0.3,
        stagger: -0.05,
        ease: 'power2.in'
      }, '-=0.2')
      .to(menuRef.current, {
        x: '100%',
        duration: 0.5,
        ease: 'power3.inOut'
      }, '-=0.1')
      .to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set([menuRef.current, backdropRef.current], { visibility: 'hidden' })
        }
      }, '-=0.3')
    }

    return () => {
      tl.kill()
    }
  }, [open])

  const close = () => {
    setOpen(false)
    // Small delay to allow close animation to finish before hiding dropdown
    setTimeout(() => setMobileResourceOpen(false), 500)
  }

  return (
    <>
      {/* Mobile menu - Side Drawer */}
      <div
        ref={menuRef}
        className="md:hidden fixed top-0 right-0 bottom-0 z-[100] w-[85%] max-w-[320px] shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-black/[0.03]"
        style={{
          transform: 'translateX(100%)',
          backgroundColor: '#F5F4F0',
          visibility: 'hidden',
        }}
      >
        <div className="h-full flex flex-col p-8 bg-[#F5F4F0]">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <img 
                src="/logo/logo-klikin.webp" 
                alt="Klikin" 
                className="w-5 h-5 object-contain"
              />
              <span className="font-pixel text-[10px] tracking-[0.2em] text-black/70 uppercase">KLIKIN</span>
            </div>
            <button
              onClick={close}
              className="w-9 h-9 rounded-full hover:bg-black/[0.05] flex items-center justify-center transition-colors active:scale-95"
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Navigation links - Side Drawer with Resource Submenu */}
          <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-2">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                ref={el => { linksRef.current[i] = el }}
                href={link.href}
                onClick={close}
                className="group relative px-5 py-4 text-xl font-light text-black/80 hover:text-black transition-colors duration-300 rounded-xl hover:bg-black/[0.03]"
              >
                <span className="relative z-10">{link.label}</span>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-black/80 group-hover:h-10 transition-all duration-300 rounded-r-full" />
              </a>
            ))}
            
            <div className="mt-2">
              <button 
                ref={resourceBtnRef}
                onClick={() => setMobileResourceOpen(!mobileResourceOpen)}
                className="group w-full flex items-center justify-between px-5 py-4 text-xl font-light text-black/80 hover:text-black transition-colors duration-300 rounded-xl hover:bg-black/[0.03] outline-none relative"
                style={{ opacity: 0 }}
              >
                <span className="relative z-10">Resource</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className={`transition-transform duration-500 ease-out ${mobileResourceOpen ? 'rotate-180' : 'rotate-0'} text-black/30 group-hover:text-black/60`}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-black/80 group-hover:h-10 transition-all duration-300 rounded-r-full" />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-out ${mobileResourceOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}
                style={{
                  transitionProperty: 'max-height, opacity, margin-top',
                }}
              >
                <div className="flex flex-col gap-1 ml-4 border-l border-black/[0.05] pl-2">
                  {RESOURCE_LINKS.map((link, i) => (
                    <a
                      key={link.label}
                      ref={el => { mobileResourceLinksRef.current[i] = el }}
                      href={link.href}
                      onClick={close}
                      className="group relative px-4 py-3 text-lg font-light text-black/60 hover:text-black rounded-xl hover:bg-black/[0.03] flex items-center justify-between"
                      style={{
                        transform: mobileResourceOpen ? 'translateX(0)' : 'translateX(-10px)',
                        opacity: mobileResourceOpen ? 1 : 0,
                        transition: `all 0.4s ease-out ${i * 0.1}s`,
                      }}
                    >
                      <span className="relative z-10">{link.label}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-0 group-hover:opacity-40 transition-opacity duration-300">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* CTA Button */}
          <button 
            ref={ctaRef}
            className="w-full px-6 py-4 bg-[#111] text-white text-[11px] rounded-xl hover:bg-[#333] transition-all duration-200 tracking-widest font-medium shadow-lg active:scale-98 mt-auto"
            style={{ opacity: 0 }}
          >
            COBA GRATIS
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="md:hidden fixed inset-0 bg-black/60 z-[90]"
        onClick={close}
        style={{
          opacity: 0,
          visibility: 'hidden',
        }}
      />

      {/* NAVBAR - Dipindahkan ke root level (bukan di dalam container yang membatasi) */}
      <div 
        ref={navbarRef}
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(-150%)',
          opacity: isVisible ? 1 : 0,
          pointerEvents: 'auto',
        }}
      >
        <div ref={navContainerRef} className="w-full max-w-3xl" style={{ opacity: 0 }}>
          {/* Main navbar - SOLID CREAM */}
          <nav
            className="flex items-center justify-between px-5 py-3 rounded-2xl border border-black/[0.08]"
            style={{
              backgroundColor: "#E8E6DD",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/logo/logo-klikin.webp" 
                alt="Klikin" 
                className="w-5 h-5 object-contain"
              />
              <span className="font-pixel text-[10px] tracking-[0.25em] text-black/70 uppercase">KLIKIN</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-[11px] text-black/60 hover:text-black transition-colors duration-200 tracking-wide"
                >
                  {l.label}
                </a>
              ))}
              
              {/* Resource Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button 
                  className="flex items-center gap-1 text-[11px] text-black/60 hover:text-black transition-colors duration-200 tracking-wide outline-none"
                >
                  Resource
                  <svg 
                    width="10" 
                    height="10" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#F5F4F0] border border-black/[0.08] rounded-2xl shadow-xl transition-all duration-300 ${dropdownOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}
                >
                  <div className="p-2 flex flex-col gap-1">
                    {RESOURCE_LINKS.map(link => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="px-4 py-2.5 text-[11px] text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="text-[11px] px-4 py-2 rounded-xl border border-black/20 text-black/60 hover:text-black hover:bg-black/[0.05] transition-all duration-200 tracking-wide hidden md:block">
                COBA GRATIS
              </button>

              {/* Hamburger button */}
              <button
                onClick={() => setOpen(v => !v)}
                className="md:hidden w-14 h-14 -mr-2 flex flex-col justify-center items-center gap-[5px] rounded-lg hover:bg-black/[0.08] active:bg-black/[0.12] transition-all duration-200 active:scale-90"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <span
                  className="block h-[2.5px] bg-black/70 transition-all duration-250 origin-center"
                  style={{
                    width: open ? "22px" : "20px",
                    transform: open ? "translateY(7px) rotate(45deg)" : "none",
                  }}
                />
                <span
                  className="block h-[2.5px] bg-black/70 transition-all duration-250"
                  style={{
                    width: "20px",
                    opacity: open ? 0 : 1,
                    transform: open ? "scaleX(0)" : "none",
                  }}
                />
                <span
                  className="block h-[2.5px] bg-black/70 transition-all duration-250 origin-center"
                  style={{
                    width: open ? "22px" : "20px",
                    transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
                  }}
                />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}