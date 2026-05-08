"use client"

import { useState, useEffect, memo } from "react"
import { OptimizedImage } from "./optimized-image"
import { PixelIcon } from "@/components/pixel-icon"

const STEPS = [
  {
    num: "01",
    title: "Daftar Akun",
    desc: "Satu langkah untuk mulai bisnis",
    image: "/images/devex/Job Application 1.webp"
  },
  {
    num: "02",
    title: "Input Produk",
    desc: "Kelola inventaris dengan mudah",
    image: "/images/devex/Online Shopping 1.webp"
  },
  {
    num: "03",
    title: "Mulai Jualan",
    desc: "Proses transaksi kilat & akurat",
    image: "/images/devex/Content Creation Writing.webp"
  },
  {
    num: "04",
    title: "Pantau Laporan",
    desc: "Data bisnis di ujung jari",
    image: "/images/devex/STRATEGY 9.webp"
  },
]

export const DevExSection = memo(function DevExSection() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(true)

  function selectStep(i: number) {
    if (i === active) return
    setVisible(false)
    setTimeout(() => {
      setActive(i)
      setVisible(true)
    }, 150)
  }

  // Auto-advance every 4.5s
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setActive(prev => (prev + 1) % STEPS.length)
        setVisible(true)
      }, 150)
    }, 4500)
    return () => clearInterval(t)
  }, [])

  const step = STEPS[active]

  return (
    <section id="devex" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <PixelIcon type="kasir" size={40} />
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.05] border border-black/[0.06] text-[10px] tracking-widest text-black/40 uppercase">
            Pengalaman Pengguna
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            Didesain untuk kemudahan.<br />Dicintai oleh UMKM.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
          {/* Left — 4 clickable step cards */}
          <div className="flex flex-col gap-3">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                onClick={() => selectStep(i)}
                className="flex-1 text-left rounded-2xl border transition-all duration-200 p-6 group"
                style={{
                  background: active === i ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.7)",
                  borderColor: active === i ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.06)",
                  boxShadow: active === i
                    ? "0 1px 3px rgba(0,0,0,0.06)"
                    : "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <div className="flex gap-4 items-start">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-light shrink-0 transition-colors duration-200"
                    style={{
                      background: active === i ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.04)",
                      color: active === i ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.35)",
                    }}
                  >
                    {s.num}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-light transition-colors duration-200"
                      style={{ color: active === i ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)" }}
                    >
                      {s.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.28)" }}>{s.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right — Visual Panel */}
          <div
            className="lg:col-span-2 rounded-2xl border border-black/[0.06] p-8 flex flex-col overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.7)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              minHeight: "400px",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 shrink-0">
              <div
                className="text-[10px] tracking-widest uppercase transition-opacity duration-200"
                style={{
                  opacity: visible ? 1 : 0,
                  color: "rgba(0,0,0,0.3)",
                }}
              >
                KASIR PINTAR PREVIEW
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map(d => (
                  <div
                    key={d}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      background: d === active ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.08)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Visual content — optimized transitions */}
            <div className="flex-1 relative">
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "scale(1)" : "scale(0.98)",
                  transition: "opacity 300ms ease-out, transform 300ms ease-out",
                  willChange: "opacity, transform",
                }}
              >
                <OptimizedImage
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  className="w-full h-full max-w-[300px] max-h-[300px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})
