"use client"

import { useRef, useEffect, useState } from "react"
import { PropertyBookingCard } from "./property-booking-card"
import { cn } from "@/lib/utils"

const properties = [
  {
    propertyName: "Toko Kelontong & Retail",
    location: "Seluruh Indonesia",
    duration: "Digitalisasi Stok",
    availableDate: "Siap Digunakan",
    image: "/images/target/minimarket.webp",
    pricePerNight: 0,
    propertyType: "Retail",
    features: ["Manajemen Stok", "Laporan Harian", "Scan Barcode", "Multi Cabang"],
    amenities: ["Gratis 3 Bulan", "Cloud", "Support"],
    rating: 4.9,
  },
  {
    propertyName: "Warung Makan & Cafe",
    location: "Pusat Kuliner",
    duration: "Sistem Order Meja",
    availableDate: "Siap Digunakan",
    image: "/images/target/kuliner.webp",
    pricePerNight: 0,
    propertyType: "F&B",
    features: ["Cetak Struk", "Varian Menu", "Manajemen Meja", "Laporan Profit"],
    amenities: ["Gratis 3 Bulan", "Cloud", "QRIS"],
    rating: 4.8,
  },
  {
    propertyName: "Bengkel & Jasa Servis",
    location: "Area Komersial",
    duration: "Booking Jadwal",
    availableDate: "Siap Digunakan",
    image: "/images/target/bengkel.webp",
    pricePerNight: 0,
    propertyType: "Jasa",
    features: ["Riwayat Servis", "Data Pelanggan", "Notifikasi WA", "Stok Sparepart"],
    amenities: ["Gratis 3 Bulan", "Cloud", "Mobile"],
    rating: 4.7,
  },
]

export function PricingSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const positionRef = useRef(0)
  const animationRef = useRef<number>()

  const duplicatedProperties = [...properties, ...properties, ...properties]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const speed = isHovered ? 0.3 : 1 // Slow down on hover instead of changing animation duration
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      positionRef.current += speed * (deltaTime / 16)

      const totalWidth = scrollContainer.scrollWidth / 3

      if (positionRef.current >= totalWidth) {
        positionRef.current = 0
      }

      scrollContainer.style.transform = `translateX(-${positionRef.current}px)`
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered])

  return (
    <section id="pricing" className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance font-serif">Bidang Usaha Terpopuler</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Ribuan mitra Klikin dari berbagai sektor telah berhasil mendigitalkan usahanya. Berikut adalah beberapa kategori usaha yang paling banyak menggunakan Klikin.
              </p>
      </div>

      <div className="relative w-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div ref={scrollRef} className="flex gap-6" style={{ width: "fit-content" }}>
          {duplicatedProperties.map((property, index) => (
            <div key={index} className="flex-shrink-0 w-[85vw] sm:w-[60vw] lg:w-[400px]">
              <PropertyBookingCard {...property} onBook={() => console.log(`Booking ${property.propertyName}`)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
