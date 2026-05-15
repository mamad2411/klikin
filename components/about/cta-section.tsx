import { ArrowUpRight, ArrowRight } from "lucide-react"
import { AnimatedRevenueChart } from "./animated-revenue-chart"

export function CTASection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[20vw] font-bold font-sans tracking-tighter leading-none text-black/[0.05] whitespace-nowrap">
          MUDAH
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-normal leading-tight max-w-4xl mx-auto mb-6 font-serif">
            Siap mendigitalkan usaha Anda?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Bergabunglah dengan puluhan ribu pedagang pasar dan UMKM yang telah mempercayakan Klikin untuk operasional bisnis mereka.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="relative flex items-center justify-center gap-0 bg-foreground text-background rounded-full pl-6 pr-1.5 py-1.5 transition-all duration-300 group overflow-hidden">
              <span className="text-sm pr-4">Mulai Sekarang</span>
              <span className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-foreground" />
              </span>
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-16">
          <AnimatedRevenueChart />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-16">
          <div className="text-center">
            <p className="text-7xl font-light text-foreground">50K+</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Mitra UMKM</p>
          </div>
          <div className="text-center">
            <p className="text-7xl font-light text-foreground">25</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Kota</p>
          </div>
          <div className="text-center">
            <p className="text-7xl font-light text-foreground">100K+</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Transaksi Harian</p>
          </div>
        </div>
      </div>
    </section>
  )
}
