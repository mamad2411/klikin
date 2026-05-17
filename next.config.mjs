/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hapus output: 'export' untuk development
  // output: 'export',
  
  // Untuk static export, trailingSlash: true membantu dengan routing
  trailingSlash: false, // false untuk development
  
  // Base path jika deploy di subdirectory (contoh: '/my-app')
  // basePath: '',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: false,
  },
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Performance optimizations
  reactStrictMode: true,
  
  // Compress output
  compress: true,
  
  // Generate ETags for better caching
  generateEtags: true,
  
  // Power by header
  poweredByHeader: false,
  
  // Production source maps (disable for smaller bundle)
  productionBrowserSourceMaps: false,
  
  // Turbopack config (empty to silence warning)
  turbopack: {},
}

export default nextConfig
