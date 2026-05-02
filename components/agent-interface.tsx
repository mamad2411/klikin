"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ShoppingCart, Package, FileText, CheckCircle2, Clock, AlertCircle, TrendingUp, BarChart3, Users, LayoutDashboard } from "lucide-react"

// ── Data ─────────────────────────────────────────────────────────────────────

const ALL_TRANSACTIONS = [
  { id: 1024, title: "Transaksi Kopi Susu (2x)",      cashier: "kasir-jkt-01",    status: "sukses",  total: "Rp 36.000", time: "Just now" },
  { id: 1023, title: "Update Stok: Roti Bakar",      cashier: "sistem",          status: "proses",  total: "-",         time: "1m ago" },
  { id: 1022, title: "Pembayaran QRIS Berhasil",     cashier: "kasir-sby-02",    status: "sukses",  total: "Rp 45.500", time: "1m ago" },
  { id: 1021, title: "Input Produk: Teh Tarik",      cashier: "admin",           status: "sukses",  total: "-",         time: "2m ago" },
  { id: 1020, title: "Cetak Laporan Harian",         cashier: "admin",           status: "sukses",  total: "-",         time: "8m ago" },
  { id: 1019, title: "Batal Transaksi #1019",        cashier: "kasir-bdg-01",    status: "batal",   total: "Rp 15.000", time: "22m ago" },
]

const INVENTORY_LEVELS = [
  { item: "Kopi Bubuk (kg)",    pct: 72 },
  { item: "Gula Aren (L)",      pct: 45 },
  { item: "Susu UHT (Box)",     pct: 88 },
  { item: "Roti Tawar",         pct: 31 },
  { item: "Paper Cup",          pct: 60 },
]

const SYSTEM_LOGS: { type: "info"|"warning"|"error"|"success"; text: string; user?: string }[] = [
  { type: "success", text: "Printer Thermal Terhubung", user: "kasir-jkt-01" },
  { type: "info",    text: "Sinkronisasi Cloud Selesai", user: "sistem" },
  { type: "warning", text: "Stok Roti Tawar Menipis!", user: "sistem" },
  { type: "success", text: "Pembayaran QRIS Terverifikasi", user: "kasir-sby-02" },
  { type: "error",   text: "Koneksi Internet Terputus", user: "sistem" },
  { type: "info",    text: "Admin Login dari Jakarta", user: "admin" },
]

const ACTIVITY_SEED = Array.from({ length: 35 }, () => ({
  level: Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0,
}))

// ── Sub-components ────────────────────────────────────────────────────────────

const Tag = ({ children, color = "rgba(0,0,0,0.35)" }: { children: React.ReactNode, color?: string }) => (
  <span style={{ 
    fontSize: 7.5, 
    letterSpacing: "0.08em", 
    textTransform: "uppercase", 
    padding: "2px 5px", 
    borderRadius: 4, 
    background: "rgba(0,0,0,0.04)", 
    color,
    fontFamily: "monospace" 
  }}>
    {children}
  </span>
)

function LogLine({ item, delay }: { item: typeof SYSTEM_LOGS[0]; delay: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }, [delay])

  if (!visible) return null

  const iconCfg = {
    success: { icon: <CheckCircle2 style={{ width: 9, height: 9, color: "#22c55e", flexShrink: 0 }} />, color: "#22c55e" },
    error:   { icon: <AlertCircle  style={{ width: 9, height: 9, color: "#ef4444", flexShrink: 0 }} />, color: "#ef4444" },
    warning: { icon: <AlertCircle  style={{ width: 9, height: 9, color: "#f59e0b", flexShrink: 0 }} />, color: "#f59e0b" },
    info:    { icon: <Clock        style={{ width: 9, height: 9, color: "rgba(0,0,0,0.35)", flexShrink: 0 }} />, color: "rgba(0,0,0,0.5)" },
  }[item.type]

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-start", padding: "4px 0", animation: "logIn 0.2s ease forwards", opacity: 0 }}>
      {iconCfg.icon}
      <div>
        <span style={{ fontSize: 9, color: iconCfg.color, fontFamily: "monospace" }}>{item.text}</span>
        {item.user && <span style={{ fontSize: 8, color: "rgba(0,0,0,0.3)", marginLeft: 5, fontFamily: "monospace" }}>— {item.user}</span>}
      </div>
    </div>
  )
}

export function AgentInterface() {
  const [mounted, setMounted] = useState(false)
  const [activeTx, setActiveTx] = useState(0)
  const [inventoryPcts, setInventoryPcts] = useState(INVENTORY_LEVELS.map(f => f.pct))
  const [logIdx, setLogIdx] = useState(3)
  const [activity, setActivity] = useState(ACTIVITY_SEED)

  useEffect(() => setMounted(true), [])

  // Simulate inventory changes
  useEffect(() => {
    if (!mounted) return
    const t = setInterval(() => {
      setInventoryPcts(p => p.map((v, i) => {
        const delta = Math.random() * 2 - 1.2 // slight downward trend (sales)
        return Math.max(5, Math.min(100, v + delta))
      }))
    }, 1500)
    return () => clearInterval(t)
  }, [mounted])

  // Cycle logs
  useEffect(() => {
    if (!mounted) return
    const t = setInterval(() => {
      setLogIdx(p => (p >= SYSTEM_LOGS.length ? 1 : p + 1))
    }, 4000)
    return () => clearInterval(t)
  }, [mounted])

  const anim = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(10px)",
    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  })

  const panel = {
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(10px)",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.06)",
    padding: "12px",
  }

  return (
    <div style={{ width: "100%", height: 380, padding: 20, display: "flex", flexDirection: "column", gap: 15, overflow: "hidden" }}>
      
      {/* Top Stats Bar */}
      <div style={{ display: "flex", gap: 15, ...anim(0) }}>
        {[
          { icon: <TrendingUp size={14} />, label: "Omzet Hari Ini", val: "Rp 2.450.000" },
          { icon: <Users size={14} />, label: "Pelanggan Baru", val: "+12" },
          { icon: <BarChart3 size={14} />, label: "Target Bulanan", val: "85%" },
        ].map((s, i) => (
          <div key={i} style={{ ...panel, flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ color: "rgba(0,0,0,0.3)" }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 8, color: "rgba(0,0,0,0.35)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.8)" }}>{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr", gap: 15, flex: 1, overflow: "hidden" }}>
        
        {/* Col 1 — Transactions List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, overflow: "hidden", ...anim(100) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 2 }}>
            <ShoppingCart size={12} color="rgba(0,0,0,0.4)" />
            <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(0,0,0,0.4)", textTransform: "uppercase" }}>Transaksi Terbaru</span>
          </div>
          <div style={{ ...panel, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: 6 }}>
            {ALL_TRANSACTIONS.map((tx, i) => (
              <div key={tx.id} style={{ 
                padding: "8px 10px", 
                borderRadius: 8, 
                background: i === activeTx ? "rgba(0,0,0,0.03)" : "transparent",
                border: i === activeTx ? "1px solid rgba(0,0,0,0.05)" : "1px solid transparent",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>{tx.title}</div>
                  <div style={{ fontSize: 8, color: "rgba(0,0,0,0.3)" }}>{tx.cashier} • {tx.time}</div>
                </div>
                <Tag color={tx.status === "sukses" ? "#22c55e" : tx.status === "batal" ? "#ef4444" : "#eab308"}>
                  {tx.status}
                </Tag>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2 — Inventory Monitoring */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, overflow: "hidden", ...anim(200) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 2 }}>
            <Package size={12} color="rgba(0,0,0,0.4)" />
            <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(0,0,0,0.4)", textTransform: "uppercase" }}>Stok Inventaris</span>
          </div>
          <div style={{ ...panel, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            {INVENTORY_LEVELS.map((inv, i) => (
              <div key={inv.item} style={{ spaceY: 4 }}>
                <div style={{ display: "flex", justify: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 9, color: "rgba(0,0,0,0.6)" }}>{inv.item}</span>
                  <span style={{ fontSize: 9, fontWeight: 600, color: inventoryPcts[i] < 40 ? "#ef4444" : "rgba(0,0,0,0.4)" }}>
                    {Math.round(inventoryPcts[i])}%
                  </span>
                </div>
                <div style={{ height: 4, width: "100%", background: "rgba(0,0,0,0.05)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ 
                    height: "100%", 
                    width: `${inventoryPcts[i]}%`, 
                    background: inventoryPcts[i] < 40 ? "#ef4444" : "rgba(0,0,0,0.6)",
                    transition: "width 0.3s ease",
                    borderRadius: 2
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3 — System Logs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, overflow: "hidden", ...anim(300) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 2 }}>
            <FileText size={12} color="rgba(0,0,0,0.4)" />
            <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(0,0,0,0.4)", textTransform: "uppercase" }}>Log Sistem</span>
          </div>
          <div style={{ ...panel, flex: 1, display: "flex", flexDirection: "column", gap: 4, overflow: "hidden" }}>
            {SYSTEM_LOGS.slice(0, logIdx).map((log, i) => (
              <LogLine key={i} item={log} delay={i * 100} />
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes logIn {
          from { opacity: 0; transform: translateX(-5px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
