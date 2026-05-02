"use client"

import { useState, memo, CSSProperties, useEffect, useRef } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  loading?: "lazy" | "eager"
  priority?: boolean
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className = "",
  style = {},
  loading = "lazy",
  priority = false
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setIsMounted(true)
    
    // Check if image is already cached
    if (imgRef.current?.complete) {
      setIsLoaded(true)
    }
  }, [])

  // Don't apply opacity transition until mounted to avoid hydration mismatch
  const imageStyle = isMounted
    ? {
        ...style,
        opacity: isLoaded ? 1 : 0.5,
        transition: 'opacity 0.3s ease-in-out',
      }
    : {
        ...style,
        opacity: 1,
      }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      style={imageStyle}
      loading={priority ? "eager" : loading}
      decoding="async"
      onLoad={() => setIsLoaded(true)}
      onError={() => setIsLoaded(true)}
      suppressHydrationWarning
    />
  )
})
