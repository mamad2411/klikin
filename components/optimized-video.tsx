"use client"

import { useEffect, useRef, useState, memo } from "react"

interface OptimizedVideoProps {
  src: string
  videoReady: boolean
  className?: string
  style?: React.CSSProperties
  poster?: string
}

export const OptimizedVideo = memo(function OptimizedVideo({ 
  src, 
  videoReady, 
  className = "",
  style = {},
  poster
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            setShouldLoad(true)
          } else {
            setIsInView(false)
          }
        })
      },
      {
        rootMargin: "100px", // Start loading 100px before entering viewport
        threshold: 0.1
      }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Load and play video when in view
  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoad) return

    const handleLoadedData = () => {
      setIsLoaded(true)
      if (isInView && videoReady) {
        video.play().catch(() => {
          // Autoplay failed, user interaction required
        })
      }
    }

    const handleCanPlay = () => {
      if (isInView && videoReady) {
        video.play().catch(() => {})
      }
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)

    // Start loading
    video.load()

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [shouldLoad, isInView, videoReady])

  // Pause when out of view to save resources
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isLoaded) return

    if (isInView && videoReady) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isInView, isLoaded, videoReady])

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload="none"
      poster={poster}
      className={className}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        willChange: isInView ? 'opacity' : 'auto',
        contain: 'layout style paint',
      }}
    >
      {shouldLoad && <source src={src} type="video/mp4" />}
    </video>
  )
})
