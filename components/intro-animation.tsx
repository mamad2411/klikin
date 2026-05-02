"use client"

import { useEffect, useState, memo, useRef } from "react"

// Animation timing constants
const LETTER_IN_STAGGER  = 50    // ms between each letter appearing
const LETTER_IN_DUR      = 400   // duration of each letter appear transition
const HOLD_DURATION      = 150   // hold fully visible before exit
const LETTER_OUT_STAGGER = 35    // ms between each letter disappearing
const LETTER_OUT_DUR     = 300   // duration of each letter fade out
const CURTAIN_DURATION   = 800   // curtain transition duration

// Exported constants for default "KLIKIN" text (6 letters)
const DEFAULT_LETTERS_COUNT = 6
const DEFAULT_LETTERS_IN_TOTAL = LETTER_IN_STAGGER * (DEFAULT_LETTERS_COUNT - 1) + LETTER_IN_DUR + HOLD_DURATION
const DEFAULT_CURTAIN_DELAY = DEFAULT_LETTERS_IN_TOTAL + 60

// Exported: moment the curtain finishes retracting (for default "KLIKIN")
export const INTRO_DURATION_MS = DEFAULT_CURTAIN_DELAY + CURTAIN_DURATION
// Exported: ms before curtain fully done to start hero animations
export const HERO_REVEAL_MS = DEFAULT_CURTAIN_DELAY + CURTAIN_DURATION - 150

type Phase = "idle" | "in" | "out" | "done"

interface IntroAnimationProps {
  onDone: () => void
  text?: string
}

export const IntroAnimation = memo(function IntroAnimation({ onDone, text = "KLIKIN" }: IntroAnimationProps) {
  const LETTERS = text.split("")
  
  const LETTERS_IN_TOTAL   = LETTER_IN_STAGGER * (LETTERS.length - 1) + LETTER_IN_DUR + HOLD_DURATION
  const LETTERS_OUT_TOTAL  = LETTER_OUT_STAGGER * (LETTERS.length - 1) + LETTER_OUT_DUR
  const CURTAIN_DELAY      = LETTERS_IN_TOTAL + 60
  const ANIM_TOTAL         = CURTAIN_DELAY + LETTERS_OUT_TOTAL + 1000
  const HERO_REVEAL_MS_LOCAL = CURTAIN_DELAY + CURTAIN_DURATION - 150
  
  const [phase, setPhase] = useState<Phase>("idle")
  const [curtainUp, setCurtainUp] = useState(false)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    // Schedule all phase changes
    timeoutsRef.current.push(
      setTimeout(() => setPhase("in"), 40),
      setTimeout(() => setPhase("out"), LETTERS_IN_TOTAL),
      setTimeout(() => setCurtainUp(true), CURTAIN_DELAY),
      setTimeout(() => onDone(), HERO_REVEAL_MS_LOCAL + 150),
      setTimeout(() => setPhase("done"), ANIM_TOTAL)
    )

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [onDone, LETTERS_IN_TOTAL, CURTAIN_DELAY, HERO_REVEAL_MS_LOCAL, ANIM_TOTAL])

  if (phase === "done") return null

  return (
    <div 
      className="fixed inset-0 z-[100] pointer-events-none" 
      aria-hidden="true"
      style={{
        contain: 'strict',
        contentVisibility: 'auto',
      }}
    >
      {/* Curtain - simple solid color, no gradient for performance */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          bottom: curtainUp ? "100%" : "0%",
          transition: curtainUp ? `bottom ${CURTAIN_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)` : "none",
          background: "#f5f4f1",
          willChange: curtainUp ? "bottom" : "auto",
          contain: 'strict',
        }}
      />

      {/* Dynamic text letters - CSS-only animation for better performance */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="flex" 
          style={{ 
            gap: "0.06em",
            contain: 'layout style',
          }}
        >
          {LETTERS.map((letter, i) => {
            const inDelay  = i * LETTER_IN_STAGGER
            const outDelay = i * LETTER_OUT_STAGGER

            const isIdle = phase === "idle"
            const isIn   = phase === "in"
            const isOut  = phase === "out"

            // Simplified animation - only opacity and translateY
            const opacity    = isIdle ? 0 : isIn ? 1 : 0
            const translateY = isIdle ? 24 : isIn ? 0 : -12

            const transition = isOut
              ? `opacity ${LETTER_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${outDelay}ms,
                 transform ${LETTER_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${outDelay}ms`
              : isIn
              ? `opacity ${LETTER_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${inDelay}ms,
                 transform ${LETTER_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${inDelay}ms`
              : "none"

            return (
              <span
                key={i}
                className="font-sans font-bold text-[#111] leading-none select-none"
                style={{
                  fontSize: `min(calc((100vw - 64px) / ${LETTERS.length}), 12rem)`,
                  letterSpacing: "0.05em",
                  opacity,
                  transform: `translateY(${translateY}px) translateZ(0)`,
                  transition,
                  willChange: isIdle || isIn || isOut ? "opacity, transform" : "auto",
                  backfaceVisibility: "hidden",
                  WebkitFontSmoothing: "antialiased",
                  contain: 'layout style paint',
                }}
              >
                {letter}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
})
