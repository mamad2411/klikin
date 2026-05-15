"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface AnimatedTextProps {
  text: string
  delay?: number
  isVisible?: boolean
}

export function AnimatedText({ text, delay = 0, isVisible: isVisibleProp }: AnimatedTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const shouldAnimate = isVisibleProp !== undefined ? isVisibleProp : isInView
  const words = text.split(" ")
  let charIndex = 0

  return (
    <span ref={ref} className="inline-block" style={{ perspective: 1000 }}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap", overflow: "visible" }}>
          {word.split("").map((char, index) => {
            const currentIndex = charIndex++
            return (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.8 }}
                transition={{
                  duration: 0.5,
                  delay: delay + currentIndex * 0.03,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                style={{
                  display: "inline-block",
                }}
              >
                {char}
              </motion.span>
            )
          })}
          {wordIndex < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  )
}
