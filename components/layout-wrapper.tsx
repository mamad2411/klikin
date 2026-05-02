"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { IntroAnimation } from "./intro-animation"

const ROUTE_NAMES: Record<string, string> = {
  "/": "KLIKIN",
  "/contact": "KONTAK",
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [introKey, setIntroKey] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [introText, setIntroText] = useState("KLIKIN")
  const lastPath = useRef("")

  const triggerIntro = useCallback((path: string) => {
    setIntroText(ROUTE_NAMES[path] || "KLIKIN")
    setIntroKey(prev => prev + 1)
    setShowIntro(true)
  }, [])

  useEffect(() => {
    // Set initial path and text
    lastPath.current = window.location.pathname
    setIntroText(ROUTE_NAMES[window.location.pathname] || "KLIKIN")

    // bfcache: when user navigates back/forward, browser may restore from cache
    // pageshow with persisted=true means restored from bfcache → force reload
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload()
      }
    }

    // Poll for URL changes (catches all navigation types)
    const interval = setInterval(() => {
      const currentPath = window.location.pathname
      if (lastPath.current !== currentPath) {
        lastPath.current = currentPath
        triggerIntro(currentPath)
      }
    }, 100)

    window.addEventListener("pageshow", handlePageShow)

    return () => {
      clearInterval(interval)
      window.removeEventListener("pageshow", handlePageShow)
    }
  }, [triggerIntro])

  return (
    <>
      {showIntro && (
        <IntroAnimation
          key={introKey}
          onDone={() => setShowIntro(false)}
          text={introText}
        />
      )}
      {children}
    </>
  )
}
