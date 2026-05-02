import { useEffect, useRef, useState } from "react"

export function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return

    // Reuse observer instance
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            // Disconnect after first intersection for performance
            observerRef.current?.disconnect()
          }
        },
        { threshold, rootMargin: '50px' }
      )
    }

    observerRef.current.observe(el)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [threshold, inView])

  return { ref, inView }
}
