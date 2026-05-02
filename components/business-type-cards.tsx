"use client"

import { memo, useMemo, useEffect, useRef, useState } from "react"
import { OptimizedImage } from "./optimized-image"

const BUSINESS_TYPES = [
  { name: "Kuliner (F&B)", image: "/images/target/kuliner.webp" },
  { name: "Online Shop", image: "/images/target/onlineshop.webp" },
  { name: "Persewaan", image: "/images/target/penyewaan.webp" },
  { name: "Counter HP", image: "/images/target/konterhp.webp" },
  { name: "Minimarket", image: "/images/target/minimarket.webp" },
  { name: "Bengkel", image: "/images/target/bengkel.webp" },
  { name: "Butik", image: "/images/target/butik.webp" },
  { name: "Barbershop", image: "/images/target/babershop.webp" },
  { name: "Laundry", image: "/images/target/laundry.webp" },
  { name: "Apotek", image: "/images/target/apotik.webp" },
  { name: "Salon", image: "/images/target/salon.webp" },
  { name: "Fotocopy", image: "/images/target/fotocopy.webp" }
]

// Memoized card component
const BusinessCard = memo(function BusinessCard({ type, index, isVisible }: { type: typeof BUSINESS_TYPES[0]; index: number; isVisible: boolean }) {
  return (
    <div
      className="group relative rounded-xl border border-black/[0.07] bg-white overflow-hidden hover:border-black/[0.15] hover:bg-[#fafaf8] transition-all duration-300 cursor-pointer flex-shrink-0"
      style={{
        width: '160px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 50}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 50}ms`,
      }}
    >
      {/* Image Background */}
      <div className="relative h-32 overflow-hidden">
        <OptimizedImage
          src={type.image}
          alt={type.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      
      {/* Text */}
      <div className="relative p-3 bg-white">
        <h3 className="text-xs font-medium text-center text-black/80">{type.name}</h3>
      </div>
    </div>
  )
})

// Desktop card component
const DesktopBusinessCard = memo(function DesktopBusinessCard({ type, index, isVisible }: { type: typeof BUSINESS_TYPES[0]; index: number; isVisible: boolean }) {
  return (
    <div
      className="group relative rounded-xl border border-black/[0.07] bg-white overflow-hidden hover:border-black/[0.15] hover:bg-[#fafaf8] transition-all duration-300 cursor-pointer"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 50}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 50}ms`,
      }}
    >
      {/* Image Background */}
      <div className="relative h-32 overflow-hidden">
        <OptimizedImage
          src={type.image}
          alt={type.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      
      {/* Text */}
      <div className="relative p-4 bg-white">
        <h3 className="text-sm font-medium text-center text-black/80">{type.name}</h3>
      </div>
    </div>
  )
})

export const BusinessTypeCards = memo(function BusinessTypeCards() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Memoize cards to prevent re-renders
  const mobileCards = useMemo(() => 
    BUSINESS_TYPES.map((type, i) => (
      <BusinessCard key={type.name} type={type} index={i} isVisible={isVisible} />
    )), [isVisible]
  )
  
  const desktopCards = useMemo(() =>
    BUSINESS_TYPES.map((type, i) => (
      <DesktopBusinessCard key={type.name} type={type} index={i} isVisible={isVisible} />
    )), [isVisible]
  )

  return (
    <div ref={ref}>
      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden">
        {/* Scroll hint */}
        <div className="flex items-center justify-end gap-2 mb-3 text-xs text-black/40">
          <span>Geser untuk lihat lebih banyak</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
        
        <div className="overflow-x-auto -mx-6 px-6 pb-4">
          <div className="flex gap-3" style={{ width: 'max-content' }}>
            {mobileCards}
          </div>
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-3">
        {desktopCards}
      </div>

      <style>{`
        /* Hide scrollbar but keep functionality */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
})
