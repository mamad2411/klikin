"use client"
import { useEffect, useState } from "react"
import { AnimatedText } from "./animated-text"
import { OptimizedVideo } from "../optimized-video"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [videoReady, setVideoReady] = useState(true)

  useEffect(() => {
    // Reset animation key setiap kali component mount
    setAnimationKey(prev => prev + 1)
    
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    const textTimer = setTimeout(() => {
      setTextVisible(true)
    }, 200)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(textTimer)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = 400
      setScrollProgress(Math.min(scrollY / maxScroll, 1))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="min-h-[100dvh] w-full flex items-start relative overflow-hidden select-none z-0">
      {/* Video background — true full screen background like home page */}
      <div className="absolute inset-0 w-full h-full z-0">
        <OptimizedVideo 
          src="/vidio/pasar-cinematic-optimized.mp4" 
          videoReady={videoReady}
          className="w-full h-full object-cover"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Overlay to dim the video slightly if needed, matching home page feel */}
        <div className="absolute inset-0 bg-black/10 z-[1]" />
      </div>

      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-[5] flex items-end justify-center"
        style={{
          transform: `translateY(${scrollProgress * 150}px)`,
          opacity: isVisible ? (1 - scrollProgress * 0.8) : 0,
          transition: 'opacity 1s ease-out 0.2s',
        }}
      >
        <span
          className="block text-white font-bold text-[28vw] sm:text-[25vw] md:text-[22vw] lg:text-[20vw] tracking-tighter select-none text-center leading-none"
          style={{ marginBottom: "0" }}
        >
          KLIKIN
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 pt-48 pb-12 px-6">
        <div className="text-center mb-12">
          <div
            className={`transition-all duration-1000 delay-[200ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <h1 className="font-serif text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] 2xl:text-[8.5rem] font-bold leading-[1.1] mb-6 w-full px-4 max-w-6xl mx-auto text-balance tracking-tight text-black">
              <AnimatedText key={animationKey} text="Solusi Digital untuk Masa Depan Pasar" delay={0.1} isVisible={textVisible} />
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}
