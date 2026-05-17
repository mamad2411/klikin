import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Halaman Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-8">
            Maaf, halaman yang Anda cari tidak ditemukan. Mungkin halaman telah dipindahkan atau dihapus.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Jika Anda yakin ini adalah kesalahan, silakan hubungi tim support.</p>
          </div>
        </div>
      </div>
    </div>
  )
}