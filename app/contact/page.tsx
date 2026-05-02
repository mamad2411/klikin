"use client"

import { useState, useCallback, useRef, useEffect, memo } from "react"
import { MobileNav } from "@/components/mobile-nav"
import { HERO_REVEAL_MS } from "@/components/intro-animation"

// ─── Intersection Observer hook ──────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        ([e]) => { 
          if (e.isIntersecting) {
            setInView(true)
            observerRef.current?.disconnect()
          }
        }, 
        { threshold, rootMargin: '50px' }
      )
    }
    
    observerRef.current.observe(el)
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, inView])
  
  return { ref, inView }
}

// ─── Promo Section ────────────────────────────────────────────────────
const PromoSection = memo(function PromoSection() {
  const { ref, inView: isVisible } = useInView(0.15)

  return (
    <div 
      ref={ref}
      className="relative w-full rounded-[40px] overflow-hidden bg-[#F2F1ED] border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
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
            <a href="/#pricing" className="inline-block px-10 py-4 bg-[#111] hover:bg-[#333] text-white rounded-full font-semibold transition-all duration-300 shadow-lg shadow-black/10 hover:scale-105 active:scale-95 tracking-widest text-xs uppercase">
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

export default function ContactPage() {
  const [introReady, setIntroReady] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "Pertanyaan Umum",
    message: ""
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "Pertanyaan Umum",
        message: ""
      })
    }, 3000)
  }

  return (
    <div className="bg-[#F5F4F0] min-h-screen font-sans antialiased">
      {/* Header */}
      <MobileNav />

      {/* Contact Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-32">
        {/* Heading */}
        <div 
          className="text-center mb-12 max-w-3xl"
          style={{
            opacity: introReady ? 1 : 0,
            transform: introReady ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-black/90 mb-4 leading-tight">
            Hubungi Kami
          </h1>
          <p className="text-base md:text-lg text-black/50 font-light">
            Ada pertanyaan? Tim kami siap membantu Anda. Isi formulir di bawah ini dan kami akan segera menghubungi Anda kembali.
          </p>
        </div>

        {/* Contact Card */}
        <div 
          className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl"
          style={{
            opacity: introReady ? 1 : 0,
            transform: introReady ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left Side - Contact Information */}
            <div className="lg:col-span-2 bg-[#111] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-light mb-3">Informasi Kontak</h2>
                <p className="text-white/60 text-sm mb-12">Katakan sesuatu untuk memulai obrolan langsung!</p>

                {/* Contact Details */}
                <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-1 flex-shrink-0">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    <span className="text-sm">+62 812 3456 7890</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-1 flex-shrink-0">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span className="text-sm">info@klikin.id</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-1 flex-shrink-0">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className="text-sm">Jl. Sudirman No. 123<br/>Jakarta Pusat 10220<br/>Indonesia</span>
                  </div>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="relative z-10">
                <p className="text-white/80 text-sm mb-4 font-light">Terhubung Bersama Kami</p>
                <div className="flex gap-6">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="#111"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#111" strokeWidth="2"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 2H3v20l18-4V2z"/>
                    <path d="M7 8h10M7 12h10M7 16h7" stroke="#111" strokeWidth="2"/>
                  </svg>
                </a>
              </div>
              </div>

              {/* Decorative Circles */}
              <div className="absolute bottom-8 right-8 w-40 h-40 rounded-full bg-white/[0.08]" />
              <div className="absolute bottom-24 right-24 w-32 h-32 rounded-full bg-white/[0.05]" />
              <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-white/[0.03]" />
            </div>

            {/* Right Side - Contact Form */}
            <div className="lg:col-span-3 bg-white p-8 lg:p-12">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-black/40 mb-2 tracking-wide">Nama Depan</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                        className="w-full border-b border-black/10 pb-2 text-sm focus:outline-none focus:border-black/30 transition-colors bg-transparent"
                        placeholder="Budi"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-black/40 mb-2 tracking-wide">Nama Belakang</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                        className="w-full border-b border-black/10 pb-2 text-sm focus:outline-none focus:border-black/30 transition-colors bg-transparent"
                        placeholder="Santoso"
                      />
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-black/40 mb-2 tracking-wide">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="w-full border-b border-black/10 pb-2 text-sm focus:outline-none focus:border-black/30 transition-colors bg-transparent"
                        placeholder="budi@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-black/40 mb-2 tracking-wide">Nomor Telepon</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        className="w-full border-b border-black/10 pb-2 text-sm focus:outline-none focus:border-black/30 transition-colors bg-transparent"
                        placeholder="+62 812 3456 7890"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm text-black/70 mb-4 font-medium">Pilih Subjek?</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["Pertanyaan Umum", "Dukungan", "Kemitraan", "Masukan"].map((subj) => (
                        <label key={subj} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="subject"
                            value={subj}
                            checked={formData.subject === subj}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            className="w-4 h-4 accent-black"
                          />
                          <span className="text-xs text-black/60">{subj}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs text-black/40 mb-2 tracking-wide">Pesan</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      rows={4}
                      className="w-full border-b border-black/10 pb-2 text-sm focus:outline-none focus:border-black/30 transition-colors bg-transparent resize-none"
                      placeholder="Tulis pesan Anda..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-10 py-3 bg-[#111] text-white text-sm rounded-lg hover:bg-black transition-colors tracking-wide"
                    >
                      Kirim Pesan
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-light mb-2">Pesan Terkirim!</h3>
                    <p className="text-sm text-black/50">Terima kasih, kami akan segera menghubungi Anda.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="px-6 md:px-12 lg:px-20 pb-20">
        <div className="max-w-6xl mx-auto">
          <PromoSection />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/logo/logo-klikin.webp" 
              alt="Klikin" 
              className="w-5 h-5 object-contain"
            />
            <span className="font-pixel text-[10px] tracking-[0.25em] text-black/50">KLIKIN</span>
          </a>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {[
              { label: "Fitur",     href: "/#platform" },
              { label: "Bisnis",     href: "/#business" },
              { label: "Aplikasi",   href: "/#apps" },
              { label: "Integrasi",  href: "/#integrations" },
              { label: "Harga",      href: "/#pricing" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-xs text-black/35 hover:text-black/70 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {[
              { label: "Privacy", href: "#" },
              { label: "Terms",   href: "#" },
              { label: "Docs",    href: "#" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-xs text-black/25 hover:text-black/55 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-black/[0.04] text-center">
          <p className="text-[10px] text-black/20 tracking-widest">© 2025 KLIKIN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
