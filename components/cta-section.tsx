"use client"

import { useState, useRef, useEffect } from "react"
import { OptimizedImage } from "./optimized-image"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setIsVisible(true); observer.disconnect() } },
      { threshold: 0.1, rootMargin: "50px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0,0,0)' : 'translate3d(0,30px,0)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
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
            Terima kasih! Kami akan segera menghubungi Anda.
          </div>
        )}
      </div>
    </section>
  )
}
