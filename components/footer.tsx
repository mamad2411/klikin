import Link from "next/link"

export function Footer() {
  return (
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
  )
}
