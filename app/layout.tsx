import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LayoutWrapper } from '@/components/layout-wrapper'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], display: 'swap' });
const _geistMono = Geist_Mono({ subsets: ["latin"], display: 'swap' });
const _courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"], display: 'swap' });
const _ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500", "600"], subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: 'Kasir Pintar — Aplikasi Kasir Digital Terbaik untuk UMKM',
  description: 'Kelola bisnis lebih mudah dengan aplikasi kasir pintar. POS, inventory, laporan lengkap, QRIS, dan PPOB. Coba gratis 3 bulan tanpa syarat!',
  keywords: ['aplikasi kasir', 'kasir digital', 'POS', 'point of sales', 'manajemen stok', 'QRIS', 'PPOB', 'aplikasi toko'],
  authors: [{ name: 'Kasir Pintar' }],
  openGraph: {
    title: 'Kasir Pintar — Aplikasi Kasir Digital Terbaik untuk UMKM',
    description: 'Kelola bisnis lebih mudah dengan aplikasi kasir pintar. Coba gratis 3 bulan tanpa syarat!',
    type: 'website',
    url: 'https://kasirpintar.co.id',
    siteName: 'Kasir Pintar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kasir Pintar — Aplikasi Kasir Digital Terbaik untuk UMKM',
    description: 'Kelola bisnis lebih mudah dengan aplikasi kasir pintar. Coba gratis 3 bulan tanpa syarat!',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
      </head>
      <body className={`font-sans antialiased`}>
        <style dangerouslySetInnerHTML={{__html: `
          /* Custom Black Scrollbar */
          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f5f4f0;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #111;
            border-radius: 5px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #000;
          }
          
          /* Firefox */
          * {
            scrollbar-width: thin;
            scrollbar-color: #111 #f5f4f0;
          }
        `}} />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Analytics />
      </body>
    </html>
  )
}
