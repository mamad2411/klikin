"use client"

import { usePathname } from "next/navigation"
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react"
import { IntroAnimation, INTRO_DURATION_MS } from "./intro-animation"
import { KineticNav } from "./kinetic-nav"

const ROUTE_NAMES: Record<string, string> = {
  "/": "KLIKIN",
  "/contact": "KONTAK",
  "/about": "TENTANG KAMI",
}

/**
 * Stable subscription: any SPA navigation (Link) or browser back/forward must notify React.
 * usePathname alone can miss / reorder updates vs the real URL — useSyncExternalStore fixes that.
 */
function subscribeToLocation(onStoreChange: () => void) {
  const emit = () => onStoreChange()

  window.addEventListener("popstate", emit)

  const push = history.pushState.bind(history)
  const replace = history.replaceState.bind(history)

  history.pushState = (...args: Parameters<History["pushState"]>) => {
    const ret = push(...args)
    queueMicrotask(emit)
    return ret
  }
  history.replaceState = (...args: Parameters<History["replaceState"]>) => {
    const ret = replace(...args)
    queueMicrotask(emit)
    return ret
  }

  return () => {
    window.removeEventListener("popstate", emit)
    history.pushState = push
    history.replaceState = replace
  }
}

function readPathSnapshot() {
  return window.location.pathname
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const serverPathname = usePathname()
  const browserPathname = useSyncExternalStore(
    subscribeToLocation,
    readPathSnapshot,
    () => serverPathname
  )

  const prevPathRef = useRef<string | null>(null)
  
  // Initial state logic to prevent flash on first load
  const [showIntro, setShowIntro] = useState(true)
  const [contentVisible, setContentVisible] = useState(false)
  const [introText, setIntroText] = useState(
    () => ROUTE_NAMES[serverPathname] || "KLIKIN"
  )
  const [introKey, setIntroKey] = useState(0)

  const onIntroDone = useCallback(() => {
    setShowIntro(false)
    setContentVisible(true)
  }, [])


  // Lock scroll during intro to prevent double scrollbars
  useEffect(() => {
    const html = document.documentElement
    if (showIntro) {
      // Use overflow: hidden to lock scroll, but prevent the scrollbar from disappearing 
      // which causes layout shift. Instead, we just lock it.
      html.style.setProperty('overflow', 'hidden', 'important')
    } else {
      html.style.removeProperty('overflow')
    }
    return () => {
      html.style.removeProperty('overflow')
    }
  }, [showIntro])

  // If intro timers ever fail in the client, never leave the site stuck on a full-screen veil.
  useEffect(() => {
    if (!showIntro) return
    // Safety: hide intro after 3.5s regardless (it should take ~1.8s).
    const t = window.setTimeout(() => {
      setShowIntro(false)
      setContentVisible(true)
    }, 3500)
    return () => clearTimeout(t)
  }, [showIntro, introKey])

  // Replay intro whenever the real URL path changes (Link, back, forward, bfcache restore).
  useEffect(() => {
    if (prevPathRef.current === null) {
      prevPathRef.current = browserPathname
      return
    }
    if (prevPathRef.current === browserPathname) return
    prevPathRef.current = browserPathname
    setIntroText(ROUTE_NAMES[browserPathname] || "KLIKIN")
    setIntroKey((k) => k + 1)
    setShowIntro(true)
    setContentVisible(false)
  }, [browserPathname])

  // BFCache & History Navigation: Handle cases where the browser restores a frozen state.
  useEffect(() => {
    const handleNavigation = (e?: PageTransitionEvent) => {
      const isBFCache = e?.persisted;
      const navEntries = typeof window !== 'undefined' && window.performance?.getEntriesByType?.("navigation");
      const navEntry = navEntries && navEntries.length > 0 ? (navEntries[0] as PerformanceNavigationTiming) : null;
      const isBackForward = isBFCache || navEntry?.type === "back_forward" || (window.performance?.navigation?.type === 2);

      if (isBackForward) {
        // Force state reset if back/forward is detected
        setShowIntro(true);
        setContentVisible(false);
        setIntroKey(prev => prev + 1);
        
        // Reliability: if the page feels stuck, reload it
        const sessionKey = 'last_nav_reload';
        const lastReload = sessionStorage.getItem(sessionKey);
        const now = Date.now();
        
        if (!lastReload || now - parseInt(lastReload) > 2000) {
          sessionStorage.setItem(sessionKey, now.toString());
          window.location.reload();
        }
      }
    };

    window.addEventListener("pageshow", handleNavigation);
    
    // Also listen to popstate directly for more immediate feedback
    window.addEventListener("popstate", () => {
      // Small delay to let the URL update and React catch up
      setTimeout(() => {
        const navEntries = window.performance?.getEntriesByType?.("navigation");
        const navEntry = navEntries && navEntries.length > 0 ? (navEntries[0] as PerformanceNavigationTiming) : null;
        if (navEntry?.type === "back_forward") {
          setShowIntro(true);
          setContentVisible(false);
          setIntroKey(prev => prev + 1);
        }
      }, 10);
    });

    return () => {
      window.removeEventListener("pageshow", handleNavigation);
    };
  }, []);

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {/* Intro Layer - Highest Z-index to cover everything */}
      {isClient && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#F5F4F0] pointer-events-none transition-opacity duration-300"
          style={{ 
            opacity: showIntro ? 1 : 0,
            visibility: showIntro ? 'visible' : 'hidden'
          }}
        >
          <IntroAnimation
            key={introKey}
            onDone={onIntroDone}
            text={introText}
          />
        </div>
      )}
      
      {/* Navbar outside the transformed content div to stay fixed to viewport */}
      {contentVisible && <KineticNav />}

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