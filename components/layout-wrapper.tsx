"use client"

import { usePathname } from "next/navigation"
import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react"
import { IntroAnimation } from "./intro-animation"
import { KineticNav } from "./kinetic-nav"

const ROUTE_NAMES: Record<string, string> = {
  "/": "KLIKIN",
  "/contact": "KONTAK",
  "/about": "TENTANG KAMI",
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPathRef = useRef<string | null>(null)
  const isInitialMountRef = useRef(true)
  
  // Initial state: show intro on first load
  const [showIntro, setShowIntro] = useState(true)
  const [contentVisible, setContentVisible] = useState(false)
  const [introText, setIntroText] = useState(
    () => ROUTE_NAMES[pathname] || "KLIKIN"
  )
  const [introKey, setIntroKey] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Set client-side flag
  useEffect(() => {
    setIsClient(true)
    console.log('🖥️ Client-side initialized')
  }, [])

  const onIntroDone = useCallback(() => {
    console.log('✅ Intro animation done')
    setShowIntro(false)
    setContentVisible(true)
  }, [])

  // Lock scroll during intro to prevent double scrollbars
  useEffect(() => {
    const html = document.documentElement
    if (showIntro) {
      html.style.setProperty('overflow', 'hidden', 'important')
    } else {
      html.style.removeProperty('overflow')
    }
    return () => {
      html.style.removeProperty('overflow')
    }
  }, [showIntro])

  // Safety timer untuk intro
  useEffect(() => {
    if (!showIntro) return
    const t = window.setTimeout(() => {
      console.log('⏰ Safety timer triggered - hiding intro')
      setShowIntro(false)
      setContentVisible(true)
    }, 3500)
    return () => clearTimeout(t)
  }, [showIntro, introKey])

  // Ensure content is always visible when intro is not showing
  useEffect(() => {
    if (!showIntro && !contentVisible) {
      console.log('🔧 Ensuring content is visible (intro hidden but content not visible)')
      setContentVisible(true)
    }
  }, [showIntro, contentVisible])

  // SOLUSI UTAMA: Gunakan useEffect dengan dependency pathname
  // Ini akan menangkap SEMUA perubahan route, termasuk back/forward
  useEffect(() => {
    if (!isClient) return
    
    console.log('🔄 Pathname changed:', pathname)
    
    // Skip initial mount logic - handled by initial state
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      prevPathRef.current = pathname
      return
    }
    
    // Trigger intro animation on path change
    if (prevPathRef.current !== pathname) {
      console.log('🎯 Route changed from', prevPathRef.current, 'to', pathname)
      prevPathRef.current = pathname
      
      setIntroText(ROUTE_NAMES[pathname] || "KLIKIN")
      setIntroKey((k) => k + 1)
      setShowIntro(true)
      setContentVisible(false)
    }
  }, [pathname, isClient])

  // TANGKAP BFCache (pageshow)
  useEffect(() => {
    if (!isClient) return
    
    const handleBFCache = (e: PageTransitionEvent) => {
      if (e.persisted) {
        console.log('📄 BFCache restoration detected')
        window.location.reload() // Simplest way to fix BFCache issues with complex animations
      }
    }
    
    window.addEventListener('pageshow', handleBFCache)
    return () => window.removeEventListener('pageshow', handleBFCache)
  }, [isClient])

  // Debug state
  useEffect(() => {
    if (isClient) {
      console.log('📊 State - showIntro:', showIntro, 'contentVisible:', contentVisible, 'introKey:', introKey)
    }
  }, [showIntro, contentVisible, introKey, isClient])

  return (
    <>
      {/* Intro Layer - Highest Z-index to cover everything */}
      <div 
        className="fixed inset-0 bg-[#F5F4F0]"
        style={{ 
          zIndex: 9999,
          opacity: showIntro ? 1 : 0,
          visibility: showIntro ? 'visible' : 'hidden',
          pointerEvents: showIntro ? 'auto' : 'none',
          transition: showIntro ? 'none' : 'opacity 300ms ease-out',
        }}
      >
        {isClient && showIntro && (
          <IntroAnimation
            key={introKey}
            onDone={onIntroDone}
            text={introText}
          />
        )}
      </div>
      
      {/* Navbar - Always render but control visibility */}
      <div style={{
        opacity: contentVisible ? 1 : 0,
        visibility: contentVisible ? 'visible' : 'hidden',
        transition: 'opacity 300ms ease-out',
        pointerEvents: contentVisible ? 'auto' : 'none',
      }}>
        <KineticNav />
      </div>

      {/* Main Content - Forced remount on pathname change to re-trigger animations */}
      <div 
        key={pathname}
        className={`transition-all duration-700 ease-out w-full`}
        style={{
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? 'translateY(0)' : 'translateY(10px)',
          visibility: contentVisible ? 'visible' : 'hidden',
          willChange: 'opacity, transform',
          position: 'relative',
          zIndex: 1,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#F5F4F0',
          pointerEvents: contentVisible ? 'auto' : 'none',
        }}
      >
        {/* Always render children, but they might be hidden by opacity/visibility */}
        {children}
        
        {/* Fallback content jika children tidak terlihat */}
        {!contentVisible && isClient && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#F5F4F0',
            zIndex: 2,
          }} />
        )}
      </div>
    </>
  )
}