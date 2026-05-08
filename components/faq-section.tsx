"use client"

import { useState, memo } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { PixelIcon } from "@/components/pixel-icon"

interface FAQItem {
  question: string
  answer: string
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Apakah ada biaya tersembunyi setelah masa trial?",
    answer: "Tidak ada biaya tersembunyi. Setelah masa trial 3 bulan berakhir, Anda dapat memilih paket berlangganan yang sesuai dengan kebutuhan bisnis Anda. Semua biaya transparan dan tertera jelas di halaman harga."
  },
  {
    question: "Apakah data transaksi saya aman?",
    answer: "Sangat aman. Kami menggunakan enkripsi tingkat bank dan backup otomatis setiap hari. Data Anda disimpan di server yang aman dan hanya dapat diakses oleh Anda. Kami juga mematuhi standar keamanan data internasional."
  },
  {
    question: "Berapa lama waktu yang dibutuhkan untuk setup?",
    answer: "Setup sangat cepat! Anda bisa mulai menggunakan aplikasi kasir dalam waktu kurang dari 5 menit. Cukup daftar, tambahkan produk, dan langsung bisa melakukan transaksi. Tim support kami juga siap membantu jika Anda membutuhkan bantuan."
  },
  {
    question: "Apakah bisa digunakan tanpa koneksi internet?",
    answer: "Ya, aplikasi kami memiliki mode offline. Anda tetap bisa melakukan transaksi tanpa internet, dan data akan otomatis tersinkronisasi ketika koneksi internet tersedia kembali."
  },
  {
    question: "Apakah ada batasan jumlah produk atau transaksi?",
    answer: "Tidak ada batasan! Anda bisa menambahkan produk sebanyak yang Anda mau dan melakukan transaksi tanpa batas. Semua paket kami memberikan akses penuh ke semua fitur."
  },
  {
    question: "Bagaimana cara migrasi data dari sistem kasir lama?",
    answer: "Kami menyediakan layanan migrasi data gratis. Tim kami akan membantu Anda memindahkan data produk, stok, dan riwayat transaksi dari sistem lama ke Klikin dengan aman dan cepat."
  },
]

const FAQAccordion = memo(function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="border-b border-black/[0.06] last:border-b-0"
      style={{
        opacity: 1,
        transform: 'translateY(0)',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 px-6 flex items-start justify-between gap-4 text-left hover:bg-black/[0.02] transition-colors group"
      >
        <span className="text-base md:text-lg font-medium text-black/80 group-hover:text-black transition-colors flex-1">
          {item.question}
        </span>
        <ChevronDown 
          className="flex-shrink-0 mt-1 transition-transform duration-300"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'rgba(0,0,0,0.4)'
          }}
          size={20}
        />
      </button>
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? '500px' : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-6 pb-6 text-sm md:text-base text-black/60 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  )
})

export const FAQSection = memo(function FAQSection() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-12 px-6">
        <PixelIcon type="faq" size={40} />
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.06] text-[10px] tracking-widest text-black/40 uppercase mb-4 mt-4">
          FAQ
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-black/90 mb-3">
          Pertanyaan yang Sering Ditanyakan
        </h2>
        <p className="text-base text-black/50 font-light max-w-2xl">
          Temukan jawaban untuk pertanyaan umum tentang aplikasi kasir Klikin
        </p>
      </div>

      {/* FAQ Items Container */}
      <div className="bg-white rounded-[40px] border border-black/[0.06] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden mb-12">
        {FAQ_DATA.map((item, index) => (
          <FAQAccordion key={index} item={item} index={index} />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="text-center px-6">
        <p className="text-sm text-black/60 mb-4">
          Masih ada pertanyaan lain?
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 bg-[#111] hover:bg-[#333] text-white rounded-full font-medium transition-all duration-300 shadow-lg shadow-black/10 hover:scale-105 active:scale-95 text-sm tracking-wide"
        >
          Hubungi Kami
        </Link>
      </div>
    </div>
  )
})
