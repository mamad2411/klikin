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
  
  // Initial state: show intro on mount
  const [showIntro, setShowIntro] = useState(true)
  const [contentVisible, setContentVisible] = useState(false)
  const [introText, setIntroText] = useState(() => ROUTE_NAMES[pathname] || "KLIKIN")
  const [introKey, setIntroKey] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const onIntroDone = useCallback(() => {
    setShowIntro(false)
    setContentVisible(true)
  }, [])

  // Handle route changes
  useEffect(() => {
    if (!isClient) return
    
    // Skip if it's the first render (initial mount already shows intro)
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname
      return
    }
    
    // Only trigger if path actually changed
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname
      setIntroText(ROUTE_NAMES[pathname] || "KLIKIN")
      setIntroKey(prev => prev + 1)
      setShowIntro(true)
      setContentVisible(false)
    }
  }, [pathname, isClient])

  // Lock scroll during intro
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

  // BRUTE FORCE POPSTATE: Force a reload on back/forward to clear BFCache state
  useEffect(() => {
    const handlePopState = () => {
      window.location.reload()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <>
      {/* Intro Layer */}
      {isClient && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#F5F4F0] pointer-events-none transition-opacity duration-300"
          style={{ 
            opacity: showIntro ? 1 : 0,
            visibility: showIntro ? 'visible' : 'hidden'
          }}
        >
          {showIntro && (
            <IntroAnimation
              key={introKey}
              onDone={onIntroDone}
              text={introText}
            />
          )}
        </div>
      )}
      
      {/* Navbar */}
      {contentVisible && <KineticNav />}

      {/* Main Content */}
      <div 
        className={`transition-all duration-700 ease-out w-full`}
        style={{
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? 'translateY(0)' : 'translateY(10px)',
          display: showIntro ? 'none' : 'block',
          visibility: contentVisible ? 'visible' : 'hidden',
          overflow: contentVisible ? '' : 'hidden',
          willChange: 'opacity, transform',
          position: 'relative',
          zIndex: 1,
          width: '100%',
        }}
      >
        {children}
      </div>
    </>
  )
}