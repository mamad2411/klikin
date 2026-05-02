"use client"

import { useEffect, useState, useRef, memo } from "react"
import { 
  Coffee, 
  Package, 
  FileText, 
  Smartphone, 
  PlusCircle, 
  Cloud, 
  Truck, 
  Tag as TagIcon, 
  Utensils, 
  Banknote, 
  Printer 
} from "lucide-react"

const KASIR_NAMES = [
  "Kasir Jakarta 01", "Kasir Surabaya 02", "Kasir Bandung 01", "Kasir Medan 03",
  "Kasir Bali 01", "Kasir Jogja 02", "Kasir Makassar 01", "Kasir Semarang 04",
  "Kasir Malang 02", "Kasir Palembang 01",
]

const AKTIVITAS = [
  { task: "Transaksi Kopi Susu", icon: <Coffee size={18} className="text-black/80" /> },
  { task: "Update Stok Produk", icon: <Package size={18} className="text-black/80" /> },
  { task: "Cetak Laporan Harian", icon: <FileText size={18} className="text-black/80" /> },
  { task: "Pembayaran QRIS Berhasil", icon: <Smartphone size={18} className="text-black/80" /> },
  { task: "Input Produk Baru", icon: <PlusCircle size={18} className="text-black/80" /> },
  { task: "Sinkronisasi Cloud", icon: <Cloud size={18} className="text-black/80" /> },
  { task: "Terima Stok Gudang", icon: <Truck size={18} className="text-black/80" /> },
  { task: "Diskon Promo Applied", icon: <TagIcon size={18} className="text-black/80" /> },
  { task: "Transaksi Nasi Goreng", icon: <Utensils size={18} className="text-black/80" /> },
  { task: "Pembayaran Tunai", icon: <Banknote size={18} className="text-black/80" /> },
  { task: "Cetak Struk", icon: <Printer size={18} className="text-black/80" /> },
]

const LOKASI = ["Jakarta", "Surabaya", "Bandung", "Medan", "Bali", "Yogyakarta", "Makassar"]

const STATUSES = [
  { label: "SUKSES", color: "#22c55e", bg: "#f0fdf4" },
  { label: "PROSES", color: "#eab308", bg: "#fefce8" },
  { label: "BATAL",  color: "#ef4444", bg: "#fef2f2" },
]

type TransactionRow = {
  id: string
  name: string
  task: string
  icon: React.ReactNode
  location: string
  status: typeof STATUSES[number]
  amount: string
  time: string
  key: number
}

function generateRandomRow(key: number): TransactionRow {
  const act = AKTIVITAS[Math.floor(Math.random() * AKTIVITAS.length)]
  const status = STATUSES[Math.random() > 0.1 ? 0 : (Math.random() > 0.5 ? 1 : 2)]
  const isTransaction = act.task.includes("Transaksi") || act.task.includes("Pembayaran")
  const amount = isTransaction 
    ? `Rp ${(Math.floor(Math.random() * 150 + 15) * 1000).toLocaleString("id-ID")}`
    : "-"

  return {
    id: `TRX-${Math.floor(Math.random() * 9000 + 1000)}`,
    name: KASIR_NAMES[Math.floor(Math.random() * KASIR_NAMES.length)],
    task: act.task,
    icon: act.icon,
    location: LOKASI[Math.floor(Math.random() * LOKASI.length)],
    status: status,
    amount: amount,
    time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    key,
  }
}

const SEED_ROWS: TransactionRow[] = [
  { id: "TRX-8821", name: "Kasir Jakarta 01", task: "Transaksi Kopi Susu", icon: <Coffee size={18} className="text-black/80" />, location: "Jakarta", status: STATUSES[0], amount: "Rp 18.000", time: "14:20:01", key: 0 },
  { id: "TRX-7712", name: "Kasir Surabaya 02", task: "Pembayaran QRIS Berhasil", icon: <Smartphone size={18} className="text-black/80" />, location: "Surabaya", status: STATUSES[0], amount: "Rp 45.500", time: "14:19:58", key: 1 },
  { id: "TRX-9901", name: "Kasir Bandung 01", task: "Update Stok Produk", icon: <Package size={18} className="text-black/80" />, location: "Bandung", status: STATUSES[1], amount: "-", time: "14:19:55", key: 2 },
  { id: "TRX-1024", name: "Kasir Medan 03", task: "Cetak Struk", icon: <Printer size={18} className="text-black/80" />, location: "Medan", status: STATUSES[0], amount: "Rp 120.000", time: "14:19:52", key: 3 },
]

export const LiveAgentFeed = memo(function LiveAgentFeed() {
  const [rows, setRows] = useState<TransactionRow[]>(SEED_ROWS)
  const keyRef = useRef(100)

  useEffect(() => {
    setRows(Array.from({ length: 5 }, (_, i) => generateRandomRow(i)))
    const t = setInterval(() => {
      keyRef.current++
      setRows(prev => [generateRandomRow(keyRef.current), ...prev.slice(0, 4)])
    }, 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div
          key={row.key}
          className="bg-white rounded-2xl border border-black/[0.06] p-4 flex items-center gap-4 shadow-sm hover:border-black/[0.12] transition-all duration-300"
          style={{
            animation: i === 0 ? "slideDown 0.5s cubic-bezier(0.16,1,0.3,1) both" : "none",
          }}
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-black/[0.03] flex items-center justify-center text-xl shrink-0">
            {row.icon}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-medium text-black/80 truncate">{row.task}</h4>
              <span className="text-[10px] font-mono text-black/30 shrink-0">{row.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-black/40">{row.name}</span>
              <span className="w-1 h-1 rounded-full bg-black/10" />
              <span className="text-[11px] text-black/40">{row.location}</span>
            </div>
          </div>

          {/* Amount & Status */}
          <div className="text-right shrink-0">
            <div className="text-sm font-semibold text-black/80 mb-1">{row.amount}</div>
            <div 
              className="inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-wider"
              style={{ background: row.status.bg, color: row.status.color }}
            >
              {row.status.label}
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
})

export const LiveAgentCounter = memo(function LiveAgentCounter() {
  const [count, setCount] = useState(3847)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => {
      setCount(v => v + Math.floor(Math.random() * 3 - 1))
    }, 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="font-mono text-5xl md:text-7xl font-light text-black/85 tracking-tighter">
      {mounted ? count.toLocaleString("id-ID") : "3.847"}
    </span>
  )
})
