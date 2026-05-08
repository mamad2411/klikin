"use client"

import { useEffect, useState, useRef } from "react"

const LETTER_IN_STAGGER  = 50
const LETTER_IN_DUR      = 400
const HOLD_DURATION      = 150
const LETTER_OUT_STAGGER = 35
const LETTER_OUT_DUR     = 300
const CURTAIN_DURATION   = 800

const DEFAULT_LETTERS_COUNT = 6
const DEFAULT_LETTERS_IN_TOTAL = LETTER_IN_STAGGER * (DEFAULT_LETTERS_COUNT - 1) + LETTER_IN_DUR + HOLD_DURATION
const DEFAULT_CURTAIN_DELAY = DEFAULT_LETTERS_IN_TOTAL + 60

export const INTRO_DURATION_MS = DEFAULT_CURTAIN_DELAY + CURTAIN_DURATION
export const HERO_REVEAL_MS = DEFAULT_CURTAIN_DELAY + CURTAIN_DURATION - 150

type Phase = "idle" | "in" | "out" | "done"

interface IntroAnimationProps {
  onDone: () => void
  text?: string
}

export function IntroAnimation({ onDone, text = "KLIKIN" }: IntroAnimationProps) {
  const LETTERS = text.length > 0 ? text.split("") : ["K"]
  const letterCount = Math.max(LETTERS.length, 1)
  const LETTERS_IN_TOTAL = LETTER_IN_STAGGER * (LETTERS.length - 1) + LETTER_IN_DUR + HOLD_DURATION
  const CURTAIN_DELAY    = LETTERS_IN_TOTAL + 60
  const ANIM_TOTAL       = CURTAIN_DELAY + LETTER_OUT_STAGGER * (LETTERS.length - 1) + LETTER_OUT_DUR + 1000
  const DONE_MS          = CURTAIN_DELAY + CURTAIN_DURATION

  const [phase, setPhase] = useState<Phase>("idle")
  const [curtainUp, setCurtainUp] = useState(false)
  const doneCalledRef = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    doneCalledRef.current = false
    const clearAll = () => {
      for (const t of timersRef.current) clearTimeout(t)
      timersRef.current = []
    }

    const finish = () => {
      if (!doneCalledRef.current) {
        doneCalledRef.current = true
        onDoneRef.current()
      }
    }

    // Defer scheduling to ensure we are in a rendering frame and to handle React Strict Mode.
    // Using requestAnimationFrame + setTimeout(0) for maximum compatibility with history restoration.
    const rafId = requestAnimationFrame(() => {
      const outer = setTimeout(() => {
        const push = (fn: () => void, ms: number) => {
          const id = setTimeout(fn, ms)
          timersRef.current.push(id)
        }
        push(() => setPhase("in"), 40)
        push(() => setPhase("out"), LETTERS_IN_TOTAL)
        push(() => setCurtainUp(true), CURTAIN_DELAY)
        push(finish, DONE_MS)
        push(() => setPhase("done"), ANIM_TOTAL)
      }, 0)
      timersRef.current.push(outer)
    })

    const safety = setTimeout(finish, DONE_MS + 2000)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(safety)
      clearAll()
    }
    // Timings are fixed for this mount; use ref for onDone so parent re-renders
    // cannot retrigger this effect and starve the setTimeout(0) chain.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === "done") return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" aria-hidden="true">
      {/* Curtain */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          bottom: curtainUp ? "100%" : "0%",
          transition: curtainUp ? `bottom ${CURTAIN_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)` : "none",
          background: "#f5f4f1",
        }}
      />

      {/* Letters */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex" style={{ gap: "0.06em" }}>
          {LETTERS.map((letter, i) => {
            const isIdle = phase === "idle"
            const isIn   = phase === "in"
            const isOut  = phase === "out"
            const opacity    = isIdle ? 0 : isIn ? 1 : 0
            const translateY = isIdle ? 24 : isIn ? 0 : -12
            const transition = isOut
              ? `opacity ${LETTER_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${i * LETTER_OUT_STAGGER}ms, transform ${LETTER_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${i * LETTER_OUT_STAGGER}ms`
              : isIn
              ? `opacity ${LETTER_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${i * LETTER_IN_STAGGER}ms, transform ${LETTER_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${i * LETTER_IN_STAGGER}ms`
              : "none"

            return (
              <span
                key={i}
                className="font-sans font-bold text-[#111] leading-none select-none"
                style={{
                  fontSize: `min(calc((100vw - 64px) / ${letterCount}), 12rem)`,
                  letterSpacing: "0.05em",
                  opacity,
                  transform: `translateY(${translateY}px) translateZ(0)`,
                  transition,
                  backfaceVisibility: "hidden",
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
}
