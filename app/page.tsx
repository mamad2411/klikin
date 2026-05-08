"use client"

import React, { useRef, useEffect, useState, useCallback, memo, lazy, Suspense } from "react"
import dynamic from "next/dynamic"
import { PixelIcon } from "@/components/pixel-icon"
import { LiveAgentFeed, LiveAgentCounter } from "@/components/live-agent-feed"
import { RevealText } from "@/components/reveal-text"
import { MobileNav } from "@/components/mobile-nav"
import { OptimizedVideo } from "@/components/optimized-video"
import { OptimizedImage } from "@/components/optimized-image"
import { BusinessTypeCards } from "@/components/business-type-cards"
import { FAQSection } from "@/components/faq-section"
import { Shield, Lock, Eye, CheckCircle2 } from "lucide-react"
import Link from "next/link"

// Dynamic imports for heavy components - load only when needed
const DevExSection = dynamic(() => import("@/components/devex-section").then(mod => ({ default: mod.DevExSection })), {
  loading: () => <div className="py-32" />,
  ssr: false
})

// ─── Intersection Observer hook (optimized) ──────────────────────────────────
function useInView(threshold = 0.1, margin = '100px') {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    
    // Use a larger margin on mobile for smoother reveal
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const effectiveMargin = isMobile ? '150px' : margin

    // Reuse observer instance
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        ([e]) => { 
          if (e.isIntersecting) {
            setInView(true)
            // Disconnect immediately after triggering
            observerRef.current?.disconnect()
          }
        }, 
        { threshold, rootMargin: effectiveMargin }
      )
    }
    
    observerRef.current.observe(el)
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, inView, margin])
  
  return { ref, inView }
}

// ─── Animated counter (optimized) ────────────────────────────────────────────
const Counter = memo(function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView(0.3)
  const animationRef = useRef<number | undefined>(undefined)
  
  useEffect(() => {
    if (!inView) return
    
    let start = 0
    const duration = 1800
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(easeOutQuart * end)
      
      setCount(current)
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [inView, end])
  
  return <span ref={ref}>{count.toLocaleString('id-ID')}{suffix}</span>
})

// ─── Bento card (optimized) ──────────────────────────────────────────────────
const BentoCard = memo(function BentoCard({ children, className = "", delay = 0, style = {} }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  const { ref, inView } = useInView(0.1)
  const [hasAnimated, setHasAnimated] = useState(false)
  
  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [inView, hasAnimated])
  
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border border-black/[0.07] bg-white overflow-hidden transition-all duration-500 hover:border-black/[0.15] hover:bg-[#fafaf8] ${className}`}
      style={{
        ...style,
        opacity: hasAnimated ? 1 : 0,
        transform: hasAnimated ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, border-color 0.3s ease, background-color 0.3s ease`,
        willChange: hasAnimated ? 'auto' : 'opacity, transform',
        backfaceVisibility: "hidden",
        contain: "layout style paint",
      }}
    >
      {/* Hover glow spot */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.03), transparent 60%)" }}
      />
      {children}
    </div>
  )
})

// ─── Pill tag ─────────────────────────────────────────────────────────────────
const Tag = memo(function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04]">
      {children}
    </span>
  )
})

// ─── CTA Section ──────────────────────────────────────────────────────────────
const CTASection = memo(function CTASection({ email, setEmail, submitted, setSubmitted }: { email: string; setEmail: (v: string) => void; submitted: boolean; setSubmitted: (v: boolean) => void }) {
  const { ref, inView: isVisible } = useInView(0.1, "100px")

  return (
    <section 
      ref={ref}
      className="relative py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 30px, 0)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'opacity, transform',
        contain: 'content',
      }}
    >
      <OptimizedImage
        src="/images/footer/footer.webp"
        alt=""
        loading="lazy"
        className="absolute bottom-0 left-0 w-full object-cover object-bottom pointer-events-none select-none"
        style={{ opacity: 0.85 }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: "linear-gradient(to top, transparent 0%, black 55%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgb(245,244,240) 0%, rgba(245,244,240,0.92) 18%, rgba(245,244,240,0.55) 35%, transparent 55%)",
        }}
      />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-6 text-black lg:text-white">
          Mulai bisnis bersama<br />Klikin.
        </h2>
        <p className="text-sm text-black/60 lg:text-white/80 leading-relaxed mb-10">
          Jalankan bisnis secara otomatis dengan Aplikasi Kasir Pintar dan coba gratis selama 3 bulan tanpa syarat.
        </p>
        {!submitted ? (
          <form
            onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="email@bisnis.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/25 focus:outline-none focus:border-black/25 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium"
            >
              COBA GRATIS
            </button>
          </form>
        ) : (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-600/20 bg-emerald-50 text-emerald-700 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {"Terima kasih! Kami akan segera menghubungi Anda."}
          </div>
        )}
      </div>
    </section>
  )
})

// ─── Footer Section ───────────────────────────────────────────────────────────
const FooterSection = memo(function FooterSection() {
  const { ref, inView: isVisible } = useInView(0.05, "50px")

  return (
    <footer 
      ref={ref}
      className="py-10 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
        transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'opacity, transform',
        contain: 'content',
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <img 
            src="/logo/logo-klikin.webp" 
            alt="Klikin" 
            className="w-5 h-5 object-contain"
          />
          <span className="font-pixel text-[10px] tracking-[0.25em] text-black/50">KLIKIN</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {[
            { label: "Fitur",     href: "#platform" },
            { label: "Bisnis",     href: "#business" },
            { label: "Aplikasi",   href: "#apps" },
            { label: "Integrasi",  href: "#integrations" },
            { label: "Live",       href: "#live" },
            { label: "Harga",      href: "#pricing" },
          ].map(l => (
            <a key={l.label} href={l.href} className="text-xs text-black/35 hover:text-black/70 transition-colors tracking-widest">{l.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {[
            { label: "Privacy", href: "#" },
            { label: "Terms",   href: "#" },
            { label: "Docs",    href: "#" },
            { label: "GitHub",  href: "#" },
          ].map(l => (
            <a key={l.label} href={l.href} className="text-xs text-black/25 hover:text-black/55 transition-colors tracking-widest">{l.label}</a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-black/[0.04] text-center">
        <p className="text-[10px] text-black/20 tracking-widest">© 2025 KLIKIN. All rights reserved.</p>
      </div>
    </footer>
  )
})

// ─── Promo Section with Marquee ───────────────────────────────────────────────
const PromoSection = memo(function PromoSection() {
  const { ref, inView: isVisible } = useInView(0.1, "150px")

  return (
    <div 
      ref={ref}
      className="relative w-full rounded-[40px] overflow-hidden bg-[#F2F1ED] border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 30px, 0)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'opacity, transform',
        contain: 'paint',
      }}
    >
      {/* Animated Marquee Text Background */}
      <div className="absolute inset-0 flex flex-col justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: "marqueeLeft 40s linear infinite" }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-8xl font-black mx-4">PENAWARAN TERBAIK • KASIR PINTAR • SOLUSI BISNIS • </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap mt-4" style={{ animation: "marqueeRight 50s linear infinite" }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-8xl font-black mx-4">DISKON UMKM • PROMO SPESIAL • KASIR DIGITAL • </span>
          ))}
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center p-10 lg:p-20 gap-16">
        {/* Center: Text Content */}
        <div className="max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <PixelIcon type="promo" size={40} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.06] text-[10px] tracking-widest text-black/40 uppercase">
            Promo Terbatas
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-black/90 leading-tight">
            Lihat Penawaran Terbaik<br />Produk Klikin
          </h2>
          <p className="text-base text-black/45 font-light leading-relaxed">
            Pilih produk sesuai dengan kebutuhan bisnismu dan dapatkan efisiensi maksimal mulai hari ini.
          </p>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <a href="#pricing" className="inline-block px-10 py-4 bg-[#111] hover:bg-[#333] text-white rounded-full font-semibold transition-all duration-300 shadow-lg shadow-black/10 hover:scale-105 active:scale-95 tracking-widest text-xs uppercase">
              Lihat Penawaran
            </a>
            <div className="flex -space-x-3 items-center">
              {[
                "https://i.pravatar.cc/100?u=1",
                "https://i.pravatar.cc/100?u=2",
                "https://i.pravatar.cc/100?u=3",
                "https://i.pravatar.cc/100?u=4"
              ].map((url, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#F2F1ED] bg-white overflow-hidden shadow-md">
                  <img 
                    src={url} 
                    alt={`User ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <span className="ml-5 text-[10px] font-medium text-black/30 tracking-widest uppercase italic">Diterapkan 10rb+ Bisnis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// ─── Main page ────────────────────────────────────────────────────────────────
export default function KasirPintarPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [heroReady, setHeroReady] = useState(true)
  const [videoReady, setVideoReady] = useState(true)

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    requestAnimationFrame(() => {
      el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
      el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
    })
  }, [])

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased">

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <MobileNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Video background — no zoom, just fade in */}
        <OptimizedVideo
          src="/vidio/hero-pasar-optimized.mp4"
          videoReady={videoReady}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            opacity: videoReady ? 1 : 0.95,
            transition: "opacity 2s ease-out",
          }}
        />

        {/* Progressive gradient rising from bottom - no blur for performance */}
        <div 
          className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" 
          style={{ 
            height: "65%", 
            background: "linear-gradient(to top, #F5F4F0 0%, #F5F4F0 18%, rgba(245,244,240,0.92) 35%, rgba(245,244,240,0.7) 55%, rgba(245,244,240,0.25) 75%, transparent 100%)",
            contain: "layout style paint",
          }} 
        />

        {/* Spacer so hero content doesn't sit under the fixed nav */}
        <div className="h-20" />

        {/* Title + metrics — anchored to bottom left */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col px-6 md:px-12 pb-12 max-w-3xl">
          {/* Title */}
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-light text-[#111] leading-[1.0] tracking-tight mb-10"
            style={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translate3d(0, 0, 0)" : "translate3d(0, 16px, 0)",
              transition: "opacity 1.2s cubic-bezier(0.22,1,0.36,1) 0ms, transform 1.2s cubic-bezier(0.22,1,0.36,1) 0ms",
              willChange: heroReady ? "auto" : "opacity, transform",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            Solusi kasir <br />modern untuk<br /> bisnis yang<br /> ingin naik level
          </h1>

          {/* 3 metrics — staggered after title */}
          <div className="flex gap-8 sm:gap-12">
            {[
              { value: "2 Juta+", label: "Install" },
              { value: "30 Ribu", label: "Ulasan Positif" },
              { value: "180 Juta", label: "Transaksi" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  opacity: heroReady ? 1 : 0,
                  transform: heroReady ? "translate3d(0, 0, 0)" : "translate3d(0, 12px, 0)",
                  transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${200 + i * 80}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${200 + i * 80}ms`,
                  willChange: heroReady ? "auto" : "opacity, transform",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="text-3xl sm:text-4xl text-[#111] font-light tracking-tight" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.value}</div>
                <div className="text-xs text-black/40 tracking-widest uppercase mt-1" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM OVERVIEW (bento) ──────────────────────────────────────── */}
      <section id="platform" className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>FITUR LENGKAP</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
              {"Fitur yang mengintegrasikan\nseluruh aspek bisnis Anda."}
            </RevealText>
          </div>

          <div className="grid grid-cols-12 grid-rows-auto gap-3" onMouseMove={handleMouse}>
            {/* Big left card — full width now that multi-agent is removed */}
            <BentoCard className="col-span-12 p-8 min-h-[200px] flex flex-col justify-between relative overflow-hidden" delay={0}>
              {/* Image Background */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
                <OptimizedImage
                  src="/images/pasar/pasar.webp"
                  alt="Point of Sales"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{ filter: 'blur(3px)' }}
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40" />
              </div>
              {/* Content */}
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl border border-white/20 bg-white/10 flex items-center justify-center mb-6" style={{ backdropFilter: "blur(8px)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">Point of Sales (POS)</h3>
                <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                  Proses penjualan di toko dapat dikelola dengan lebih cepat dan akurat, mengurangi kesalahan dalam transaksi penjualan.
                </p>
              </div>
            </BentoCard>

            {/* Bottom row */}
            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={120}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">Manajemen Stok Barang</h3>
              <p className="text-sm text-black/45 leading-relaxed">Atur dan monitoring pengelolaan stok barang yang tersedia di sistem dan gudang secara akurat.</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={160}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2"/><path d="M12 12v4"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">Pembayaran Digital QRIS & Crypto</h3>
              <p className="text-sm text-black/45 leading-relaxed">Lengkapi kebutuhan transaksi dengan QRIS, cryptocurrency, dan metode pembayaran lainnya hanya dengan scan barcode.</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={200}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">Laporan Usaha Lengkap</h3>
              <p className="text-sm text-black/45 leading-relaxed">Nikmati akses laporan usaha lengkap dari aplikasi kasir dimana saja dan kapan saja.</p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── COCOK UNTUK SEMUA BIDANG USAHA ───────────────────────────────────── */}
      <section id="business" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>BIDANG USAHA</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Cocok untuk semua\nbidang usaha."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 leading-relaxed max-w-xs">
              Dari kuliner hingga retail, aplikasi kasir kami dirancang untuk memenuhi kebutuhan berbagai jenis bisnis Anda.
            </p>
          </div>

          <BusinessTypeCards />
        </div>
      </section>

      {/* ── APLIKASI PENDUKUNG ──────────────────────────────────────────────────── */}
      <section id="apps" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="workflow" size={40} />
            <div className="mt-4"><Tag>APLIKASI PENDUKUNG</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"Aplikasi yang didesain\nuntuk setiap aspek usaha."}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3" onMouseMove={handleMouse}>
            {[
              { n: "01", title: "Kasir Pintar Pro",  desc: "Aplikasi kasir lengkap untuk Android dengan fitur POS, inventory, dan laporan real-time.", delay: 0,   img: "/images/landing/gambar1.webp" },
              { n: "02", title: "Laporan Bisnis Real-Time", desc: "Pantau performa toko langsung dari dashboard. Data lengkap, akses mudah.", delay: 80,  img: "/images/landing/gamabr2.webp" },
              { n: "03", title: "StaffPlus",    desc: "Manajemen karyawan lengkap dengan absensi, jadwal shift, dan perhitungan gaji otomatis.", delay: 140, img: "/images/landing/gambar3.webp" },
              { n: "04", title: "AI Assistant",  desc: "Chatbot pintar dengan panduan fitur, update harga bahan baku, dan auto-fill data dashboard.", delay: 200, img: "/images/landing/gambar4.webp" },
            ].map((step) => (
              <BentoCard key={step.n} className="relative overflow-hidden flex flex-col min-h-[320px]" delay={step.delay}>
                {/* Image at top — mask fades it out strongly before the bottom edge */}
                <div className="absolute inset-x-0 top-0 h-56 pointer-events-none">
                  <OptimizedImage
                    src={step.img}
                    alt={step.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                    style={{
                      maskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)",
                    }}
                  />
                </div>
                {/* Number top-left */}
                <div className="relative z-10 p-7">
                  <span className="font-pixel text-[11px] text-black/20 tracking-widest block">{step.n}</span>
                </div>
                {/* Text pushed further down */}
                <div className="relative z-10 px-7 pb-7 mt-auto pt-16">
                  <h3 className="text-2xl font-light mb-3">{step.title}</h3>
                  <p className="text-sm text-black/45 leading-relaxed mb-4">{step.desc}</p>
                  <a href="#pricing" className="inline-flex items-center gap-2 text-sm text-black/70 hover:text-black font-medium transition-colors">
                    Pelajari Selengkapnya
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </BentoCard>
            ))}
          </div>
          
          {/* Button Lihat Semua Fitur */}
          <div className="flex justify-center mt-8">
            <a href="#pricing" className="inline-block px-8 py-3 bg-[#111] hover:bg-[#333] text-white rounded-full font-semibold transition-all duration-300 shadow-lg shadow-black/10 hover:scale-105 active:scale-95 text-sm uppercase tracking-widest">
              Lihat Semua Fitur
            </a>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ──────────────────────────────────────────────────── */}
      <section id="integrations" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="integrations" size={40} />
              <div className="mt-4"><Tag>INTEGRATIONS</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Klikin: Bisnis Tanpa Sekat,\nJangkauan Makin Hebat."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 leading-relaxed max-w-xs">
              Hubungkan toko Anda dengan dunia luar. Dari jualan online hingga terima pembayaran digital, semua jadi satu langkah mudah bersama Klikin.
            </p>
          </div>

          {/* Full-width image block with glass cards */}
          {/* Mobile: flex-col, image + cards stacked. Desktop: image fills block, cards absolute */}
          <div className="rounded-2xl overflow-hidden border border-black/[0.07] flex flex-col md:block md:relative" onMouseMove={handleMouse}>
            {/* Image */}
            <div className="relative w-full h-[400px] md:h-[600px] shrink-0">
              <OptimizedImage
                src="/images/kasir/kasir.webp"
                alt="Aplikasi Kasir Klikin"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              
              {/* Button inside image - bottom left */}
              <div className="absolute bottom-8 left-8">
                <a href="#pricing" className="inline-block px-10 py-4 bg-[#111] hover:bg-[#333] text-white rounded-full font-semibold transition-all duration-300 shadow-2xl shadow-black/20 hover:scale-110 active:scale-95 text-sm uppercase tracking-widest backdrop-blur-sm">
                  Uji Coba Kasir
                </a>
              </div>
            </div>

            {/* Cards — flex row on mobile (equal spacing), absolute on desktop */}
            <div className="flex flex-col gap-3 p-4 md:absolute md:bottom-4 md:right-4 md:p-0 md:w-72">
              <div
                className="rounded-xl border border-white/50 p-6"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(255,255,255,0.60)",
                }}
              >
                <Tag>MULAI SEKARANG</Tag>
                <h3 className="mt-3 text-lg font-light mb-2">Gratis 3 Bulan Penuh</h3>
                <p className="text-xs text-black/45 leading-relaxed mb-4">Tanpa kartu kredit. Tanpa biaya tersembunyi. Cukup daftar dan langsung pakai semua fitur premium selama 3 bulan!</p>
                <div className="flex gap-2 flex-wrap">
                  {["Unlimited", "Full Fitur", "No CC"].map(item => (
                    <span key={item} className="px-2 py-1 rounded-md bg-emerald-500/10 text-[10px] text-emerald-700 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl border border-white/50 p-6"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(255,255,255,0.60)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                  <span className="text-xs text-black/40 tracking-widest uppercase">SIAP DALAM 5 MENIT</span>
                </div>
                <h3 className="text-lg font-light mb-2">Setup Super Cepat</h3>
                <p className="text-sm text-black/45 leading-relaxed">Daftar, input produk, langsung jualan. Tidak perlu training rumit atau instalasi lama. Bisnis Anda bisa jalan hari ini juga!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY & OBSERVABILITY ──────────────────────────────────��──── */}
      <section id="security" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag> KEAMANAN</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"Keamanan Data\nTransaksi Anda."}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left side — descriptions */}
            <div className="space-y-8">
              <p className="text-lg text-black/50 font-light leading-relaxed max-w-md">
                Setiap transaksi dicatat, setiap perubahan stok terlacak. Dibangun untuk bisnis yang membutuhkan transparansi dan keamanan data tanpa kompromi.
              </p>

              <div className="space-y-6">
                {[
                  { 
                    label: "Enkripsi End-to-End", 
                    desc: "Data transaksi aman dan terlindungi dengan standar enkripsi tinggi.",
                    icon: <Shield size={18} style={{ color: 'rgba(0,0,0,0.75)' }} />
                  },
                  { 
                    label: "Audit Trail Lengkap", 
                    desc: "Setiap aktivitas staf dan perubahan data tercatat dengan detail.",
                    icon: <Lock size={18} style={{ color: 'rgba(0,0,0,0.75)' }} />
                  },
                  { 
                    label: "Monitoring Real-time", 
                    desc: "Pantau aktivitas toko dan performa kasir dari mana saja.",
                    icon: <Eye size={18} style={{ color: 'rgba(0,0,0,0.75)' }} />
                  },
                ].map((item) => (
                  <div key={item.label} className="group flex gap-5 p-4 rounded-2xl transition-colors hover:bg-black/[0.02]">
                    <div className="w-12 h-12 rounded-xl bg-white border border-black/[0.05] shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-medium mb-1 text-black/80">{item.label}</h3>
                      <p className="text-sm text-black/40 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance badges — horizontal */}
              <div className="pt-8 flex flex-wrap gap-4">
                {["ISO 27001", "Keamanan Data", "Cloud Secure"].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-black/[0.04] shadow-sm text-[10px] font-medium text-black/40 tracking-wider uppercase">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side — live audit log visualization */}
            <div className="relative group">
              {/* Decorative background elements */}
              <div className="absolute -inset-4 bg-emerald-500/[0.03] rounded-[32px] blur-2xl group-hover:bg-emerald-500/[0.05] transition-colors duration-500" />
              
              <BentoCard className="relative p-0 border-black/[0.08] shadow-2xl" delay={0}>
                {/* Dashboard Header */}
                <div className="px-6 py-5 border-b border-black/[0.05] bg-black/[0.01] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.2em] text-black/30 uppercase">Log Audit Keamanan</span>
                  </div>
                  <div className="px-2 py-1 rounded bg-emerald-50 text-[9px] font-bold text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                    Secure
                  </div>
                </div>

                {/* Log Entries */}
                <div className="p-4 space-y-1">
                  {[
                    { time: "14:34:21", action: "transaksi_berhasil", user: "kasir-jkt-01", status: "success" },
                    { time: "14:34:18", action: "stok_diperbarui", user: "sistem", status: "success" },
                    { time: "14:34:15", action: "laporan_dicetak", user: "admin", status: "success" },
                    { time: "14:34:12", action: "login_kasir", user: "kasir-jkt-01", status: "success" },
                    { time: "14:34:09", action: "diskon_diterapkan", user: "sistem", status: "success" },
                  ].map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-black/[0.02] transition-colors group/item"
                      style={{
                        animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
                      }}
                    >
                      <span className="text-[10px] text-black/20 font-mono w-14 shrink-0">{log.time}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-black/70 font-medium truncate uppercase tracking-wide group-hover/item:text-black transition-colors">{log.action.replace(/_/g, ' ')}</div>
                        <div className="text-[9px] text-black/30 font-mono mt-0.5">user: {log.user}</div>
                      </div>
                      <CheckCircle2 size={14} className="text-emerald-500/40 group-hover/item:text-emerald-500 transition-colors" />
                    </div>
                  ))}
                </div>

                {/* Footer Status */}
                <div className="px-6 py-4 bg-black/[0.02] border-t border-black/[0.03] flex justify-between items-center">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(dot => (
                      <div key={dot} className="w-1 h-1 rounded-full bg-black/10" />
                    ))}
                  </div>
                  <span className="text-[9px] text-black/20 font-mono uppercase tracking-widest">Encrypted Connection active</span>
                </div>
              </BentoCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEVELOPER EXPERIENCE ──────────────────────────────────────────── */}
      <DevExSection />

      {/* ── MARQUEE CAPABILITIES ──────────────────────────────────────────── */}
      <section className="py-0 border-t border-black/[0.06] overflow-hidden select-none">
        <div className="flex border-b border-black/[0.06]" style={{ animation: "marqueeLeft 28s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Cetak Struk", "Scan Barcode", "Laporan Penjualan", "Manajemen Stok", "QRIS Payment", "Multi Cabang", "Diskon Produk", "Manajemen Staf", "Pajak & Biaya", "Dashboard Web"].map((cap) => (
                <div key={cap} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] shrink-0">
                  <span className="text-sm text-black/45 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex" style={{ animation: "marqueeRight 22s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Integrasi Marketplace", "Sync Cloud", "Offline Mode", "Riwayat Transaksi", "Manajemen Pelanggan", "Program Loyalitas", "Analisa Bisnis", "Print Thermal", "Export Excel", "Notifikasi Stok"].map((cap) => (
                <div key={cap} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] shrink-0">
                  <span className="text-sm text-black/30 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE AGENTS ──────────────────────────────────────────────────── */}
      <section id="live" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <PixelIcon type="counter" size={40} />
              <div className="mt-4"><Tag>TRANSAKSI REAL-TIME</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
                {"Transaksi berjalan\notomatis 24/7."}
              </RevealText>
              <p className="mt-6 text-base text-black/40 leading-relaxed max-w-sm">
                Di mana pun Anda berada, ribuan transaksi diproses secara real-time oleh bisnis di seluruh Indonesia — tanpa hambatan.
              </p>
              <div className="mt-10 flex items-end gap-2">
                <LiveAgentCounter />
                <span className="text-black/30 text-sm mb-1 tracking-wide">transaksi diproses hari ini</span>
              </div>
            </div>
            <div className="relative">
              <LiveAgentFeed />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-4xl mx-auto">
          <FAQSection />
        </div>
      </section>

      {/* ── PENAWARAN TERBAIK ────────────────────────────────────────────────── */}
      <section id="pricing" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <PromoSection />
        </div>
        <style>{`
          @keyframes marqueeLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marqueeRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden">
        {/* Glass panels image — anchored to bottom center */}
        <OptimizedImage
          src="/images/footer/footer.webp"
          alt=""
          loading="lazy"
          className="absolute bottom-0 left-0 w-full object-cover object-bottom pointer-events-none select-none"
          style={{ opacity: 0.85 }}
        />
        {/* Progressive blur from bottom — blends into site bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        />
        {/* Colour fade from bottom to site bg #f5f4f0 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgb(245,244,240) 0%, rgba(245,244,240,0.92) 18%, rgba(245,244,240,0.55) 35%, transparent 55%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-6 text-black lg:text-white">
            Mulai bisnis bersama<br />Klikin.
          </h2>
          <p className="text-sm text-black/60 lg:text-white/80 leading-relaxed mb-10">
            Jalankan bisnis secara otomatis dengan Aplikasi Kasir Pintar dan coba gratis selama 3 bulan tanpa syarat.
          </p>
          {!submitted ? (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="email@bisnis.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="flex-1 bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/25 focus:outline-none focus:border-black/25 transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium"
              >
                COBA GRATIS
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-600/20 bg-emerald-50 text-emerald-700 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {"Terima kasih! Kami akan segera menghubungi Anda."}
            </div>
          )}
        </div>
      </section>


      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/logo/logo-klikin.webp" 
              alt="Klikin" 
              className="w-5 h-5 object-contain"
            />
            <span className="font-pixel text-[10px] tracking-[0.25em] text-black/50">KLIKIN</span>
          </Link>

          {/* Nav sections */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {[
              { label: "Fitur",     href: "#platform" },
              { label: "Bisnis",     href: "#business" },
              { label: "Aplikasi",   href: "#apps" },
              { label: "Integrasi",  href: "#integrations" },
              { label: "Live",       href: "#live" },
              { label: "Harga",      href: "#pricing" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-xs text-black/35 hover:text-black/70 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy", href: "#" },
              { label: "Terms",   href: "#" },
              { label: "Docs",    href: "#" },
              { label: "GitHub",  href: "#" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-xs text-black/25 hover:text-black/55 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-black/[0.04]">
          <span className="text-xs text-black/20">© 2026 Klikin. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
