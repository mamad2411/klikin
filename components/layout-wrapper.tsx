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

const ROUTE_NAMES: Record<string, string> = {
  "/": "KLIKIN",
  "/contact": "KONTAK",
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
  // This is the primary fix for the "cream screen" when using back/forward from external sites.
  useEffect(() => {
    const handleNavigation = (e?: PageTransitionEvent) => {
      // 1. Check if page is restored from BFCache (persisted)
      // 2. Check if navigation type is back_forward (history navigation)
      // 3. Check legacy performance.navigation.type for broader support
      const isBFCache = e?.persisted;
      const navEntry = window.performance?.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming;
      const isBackForward = navEntry?.type === "back_forward" || (window.performance?.navigation?.type === 2);

      if (isBFCache || isBackForward) {
        // If we are restored from history, we MUST ensure the intro doesn't stay stuck.
        // A full reload is the most reliable way to reset Next.js client state.
        
        // Prevent infinite reload loops (can happen if navigation type persists after reload)
        const sessionKey = 'last_nav_reload';
        const lastReload = sessionStorage.getItem(sessionKey);
        const now = Date.now();
        
        if (!lastReload || now - parseInt(lastReload) > 1000) {
          sessionStorage.setItem(sessionKey, now.toString());
          window.location.reload();
        } else {
          // If we already reloaded recently but still detect back_forward, just hide the intro
          setShowIntro(false);
          setContentVisible(true);
        }
      }
    };

    window.addEventListener("pageshow", handleNavigation);
    
    // Also check immediately on mount for back_forward navigation that didn't trigger pageshow correctly
    handleNavigation();

    return () => window.removeEventListener("pageshow", handleNavigation);
  }, []);

  return (
    <>
      {showIntro && (
        <IntroAnimation
          key={introKey}
          onDone={onIntroDone}
          text={introText}
        />
      )}
      <div 
        className="transition-all duration-700 ease-out"
        style={{
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? 'translateY(0)' : 'translateY(10px)',
          visibility: contentVisible ? 'visible' : 'hidden',
          willChange: 'opacity, transform'
        }}
      >
        {children}
      </div>
    </>
  )
}
