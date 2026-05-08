"use client"

import { useEffect, useRef } from "react"

// Each icon is a 12×12 pixel grid animated at 60fps with RAF
// Colors are black at varying opacity to match the light theme

type IconType = "platform" | "agents" | "workflow" | "integrations" | "pricing" | "faq" | "kasir" | "promo" | "realtime" | "counter"

interface PixelIconProps {
  type: IconType
  size?: number  // rendered px size (default 40)
}

// ── Platform icon: rotating gear / node graph ────────────────────────────────
function drawPlatform(ctx: CanvasRenderingContext2D, W: number, t: number) {
  const cx = W / 2, cy = W / 2
  const r  = W * 0.36
  const ps = W / 12  // pixel size

  // Central node — pulsing
  const pulse = 0.6 + 0.4 * Math.sin(t * 0.003)
  ctx.fillStyle = `rgba(0,0,0,${pulse})`
  const cs = ps * 1.4
  ctx.fillRect(cx - cs / 2, cy - cs / 2, cs, cs)

  // 6 orbiting nodes
  const nodeCount = 6
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2 + t * 0.0015
    const nx = cx + Math.cos(angle) * r
    const ny = cy + Math.sin(angle) * r
    const opacity = 0.3 + 0.5 * ((Math.sin(angle * 2 + t * 0.002) + 1) / 2)
    ctx.fillStyle = `rgba(0,0,0,${opacity})`
    ctx.fillRect(Math.round(nx / ps) * ps - ps / 2, Math.round(ny / ps) * ps - ps / 2, ps, ps)

    // Connector line (pixelated)
    const steps = 5
    for (let s = 1; s < steps; s++) {
      const lx = cx + (nx - cx) * (s / steps)
      const ly = cy + (ny - cy) * (s / steps)
      const lo = (0.06 + 0.1 * (s / steps)) * pulse
      ctx.fillStyle = `rgba(0,0,0,${lo})`
      ctx.fillRect(Math.round(lx / ps) * ps, Math.round(ly / ps) * ps, ps * 0.7, ps * 0.7)
    }
  }
}

// ── Agents icon: humanoid pixel figure running ───────────────────────────────
// Frames as 8×8 pixel masks (row-major, 1=lit)
const AGENT_FRAMES: number[][][] = [
  // Frame 0 — stand
  [
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,0,1,0,0,1,0,0],
    [0,0,1,0,0,1,0,0],
  ],
  // Frame 1 — step left
  [
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,0],
  ],
  // Frame 2 — stand (same as 0)
  [
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,0,1,0,0,1,0,0],
    [0,0,1,0,0,1,0,0],
  ],
  // Frame 3 — step right
  [
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,0],
  ],
]

function drawAgents(ctx: CanvasRenderingContext2D, W: number, t: number) {
  const fps       = 6  // animation speed in "frames per second equivalent"
  const frameIdx  = Math.floor(t / (1000 / fps)) % AGENT_FRAMES.length
  const frame     = AGENT_FRAMES[frameIdx]
  const rows      = frame.length
  const cols      = frame[0].length
  const ps        = Math.floor(W / cols)
  const offX      = Math.floor((W - cols * ps) / 2)
  const offY      = Math.floor((W - rows * ps) / 2)

  // Subtle walk offset
  const bobY = Math.sin(t * 0.012) * ps * 0.4

  frame.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (!cell) return
      const opacity = 0.5 + 0.5 * Math.sin(t * 0.001 + r * 0.3)
      ctx.fillStyle = `rgba(0,0,0,${opacity})`
      ctx.fillRect(offX + c * ps, offY + r * ps + bobY, ps - 1, ps - 1)
    })
  })
}

// ── Workflow icon: hourglass shape — top half fills, drains to bottom ─────────
function drawWorkflow(ctx: CanvasRenderingContext2D, W: number, t: number) {
  const ps   = Math.floor(W / 12)
  const cx   = W / 2
  const cy   = W / 2

  // Hourglass pixel mask: 7 rows × 7 cols, symmetric
  const shape = [
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0],
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [1,1,1,1,1,1,1],
  ]

  const rows = shape.length
  const cols = shape[0].length
  const offX = cx - (cols * ps) / 2
  const offY = cy - (rows * ps) / 2

  // Sand fill: top half empties, bottom half fills — period 2s
  const period = 2400
  const fill   = (t % period) / period  // 0→1

  shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (!cell) return

      // Determine if this pixel is "sand"
      const isTopHalf = r < rows / 2
      const isMid     = r === Math.floor(rows / 2)
      let sandAlpha: number

      if (isTopHalf) {
        // Top: pixels disappear row by row from top
        const rowFill = 1 - Math.min(1, fill * rows * 1.4 - r)
        sandAlpha = Math.max(0, rowFill)
      } else if (isMid) {
        // Center pixel pulses
        sandAlpha = 0.5 + 0.4 * Math.sin(t * 0.008)
      } else {
        // Bottom: pixels appear row by row from center
        const rowFromCenter = r - Math.floor(rows / 2)
        const rowFill = Math.min(1, fill * rows * 1.4 - rowFromCenter)
        sandAlpha = Math.max(0, rowFill)
      }

      // Outline always visible at low opacity
      const baseAlpha = 0.12
      const alpha = Math.max(baseAlpha, sandAlpha * 0.85)
      ctx.fillStyle = `rgba(0,0,0,${alpha})`
      ctx.fillRect(offX + c * ps, offY + r * ps, ps - 1, ps - 1)
    })
  })
}

// ── Integrations icon: pixel grid of tiles that light up in sequence ──────────
function drawIntegrations(ctx: CanvasRenderingContext2D, W: number, t: number) {
  const cols = 5, rows = 4
  const ps   = Math.floor(W / (cols + 1))
  const gap  = 2
  const offX = Math.floor((W - cols * (ps + gap)) / 2)
  const offY = Math.floor((W - rows * (ps + gap)) / 2)
  const total = cols * rows

  const wave = (t * 0.0008)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx   = r * cols + c
      const phase = idx / total * Math.PI * 2
      const alpha = 0.1 + 0.65 * ((Math.sin(wave + phase) + 1) / 2)
      const x     = offX + c * (ps + gap)
      const y     = offY + r * (ps + gap)
      ctx.fillStyle = `rgba(0,0,0,${alpha})`
      ctx.fillRect(x, y, ps, ps)
    }
  }
}

// ── Pricing icon: stacked bar chart growing ───────────────────────────────────
function drawPricing(ctx: CanvasRenderingContext2D, W: number, t: number) {
  const ps    = Math.floor(W / 12)
  const bars  = 3
  const bw    = ps * 2
  const gap   = ps
  const total = bars * bw + (bars - 1) * gap
  const offX  = Math.floor((W - total) / 2)
  const maxH  = W * 0.7

  const heights = [0.45, 0.75, 0.55]
  const wave = Math.sin(t * 0.0015) * 0.12

  heights.forEach((h, i) => {
    const animated = Math.max(0.1, h + wave * (i % 2 === 0 ? 1 : -1))
    const bh = animated * maxH
    const x  = offX + i * (bw + gap)
    const y  = W - bh - ps

    // Bar body (pixelated — fill row by row)
    const rowCount = Math.floor(bh / ps)
    for (let row = 0; row < rowCount; row++) {
      const progress = 1 - row / rowCount
      const alpha    = 0.15 + progress * 0.7
      ctx.fillStyle  = `rgba(0,0,0,${alpha})`
      ctx.fillRect(x, y + row * ps, bw, ps - 1)
    }
  })
}

// ── FAQ icon: question mark pixel art that pulses and bounces ─────────────────
function drawFaq(ctx: CanvasRenderingContext2D, W: number, t: number) {
  const ps = Math.floor(W / 10)
  const cx = W / 2

  // Question mark pixel shape (8 rows x 5 cols)
  const shape = [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,1,0,0],
  ]

  const rows = shape.length
  const cols = shape[0].length
  const offX = cx - (cols * ps) / 2
  const offY = W * 0.08

  // Bounce animation
  const bounce = Math.sin(t * 0.002) * ps * 0.6

  shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (!cell) return
      const wave = Math.sin(t * 0.003 + r * 0.5 + c * 0.3)
      const alpha = 0.25 + 0.6 * ((wave + 1) / 2)
      ctx.fillStyle = `rgba(0,0,0,${alpha})`
      ctx.fillRect(offX + c * ps, offY + r * ps + bounce, ps - 1, ps - 1)
    })
  })
}

// ── Kasir icon: cash register with receipt printing ──────────────────────────
function drawKasir(ctx: CanvasRenderingContext2D, W: number, t: number) {
  const ps = Math.floor(W / 10)

  // Cash register body (7x5)
  const body = [
    [1,1,1,1,1,1,1],
    [1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
  ]

  const bodyOffX = Math.floor((W - 7 * ps) / 2)
  const bodyOffY = Math.floor(W * 0.15)

  body.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (!cell) return
      const isButton = r === 1 || r === 2
      const alpha = isButton
        ? 0.15 + 0.7 * ((Math.sin(t * 0.004 + c * 1.2) + 1) / 2)
        : 0.7
      ctx.fillStyle = `rgba(0,0,0,${alpha})`
      ctx.fillRect(bodyOffX + c * ps, bodyOffY + r * ps, ps - 1, ps - 1)
    })
  })

  // Receipt printing out from bottom - animated
  const receiptLen = Math.floor(((Math.sin(t * 0.002) + 1) / 2) * 3) + 1
  const receiptX = Math.floor(W / 2) - ps
  const receiptStartY = bodyOffY + 5 * ps + 1

  for (let i = 0; i < receiptLen; i++) {
    const alpha = 0.5 - i * 0.12
    ctx.fillStyle = `rgba(0,0,0,${Math.max(0.1, alpha)})`
    ctx.fillRect(receiptX, receiptStartY + i * ps, ps * 2, ps - 2)
  }
}

// ── Promo icon: discount tag with star burst ──────────────────────────────────
function drawPromo(ctx: CanvasRenderingContext2D, W: number, t: number) {
  const ps = Math.floor(W / 10)
  const cx = W / 2
  const cy = W / 2

  // Star burst - 8 rays rotating
  const rays = 8
  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2 + t * 0.001
    const len = 3 + Math.sin(t * 0.003 + i) * 1
    for (let d = 1; d <= len; d++) {
      const x = cx + Math.cos(angle) * d * ps
      const y = cy + Math.sin(angle) * d * ps
      const alpha = (0.6 - d * 0.15) * (0.5 + 0.5 * Math.sin(t * 0.004 + i * 0.8))
      ctx.fillStyle = `rgba(0,0,0,${Math.max(0, alpha)})`
      ctx.fillRect(Math.round(x / ps) * ps - ps / 2, Math.round(y / ps) * ps - ps / 2, ps - 1, ps - 1)
    }
  }

  // Center pulsing square
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.004)
  const cs = ps * (1.2 + pulse * 0.4)
  ctx.fillStyle = `rgba(0,0,0,${0.6 + pulse * 0.3})`
  ctx.fillRect(cx - cs / 2, cy - cs / 2, cs, cs)
}

// ── Realtime icon: pulse/signal waves radiating from center ──────────────────
function drawRealtime(ctx: CanvasRenderingContext2D, W: number, t: number) {
  const ps = Math.floor(W / 10)
  const cx = W / 2
  const cy = W / 2

  // Radiating rings - 3 rings expanding outward
  for (let ring = 0; ring < 3; ring++) {
    const phase = (t * 0.002 + ring * 0.33) % 1
    const radius = phase * W * 0.45
    const alpha = (1 - phase) * 0.7

    // Draw ring as pixel dots
    const dots = 16
    for (let d = 0; d < dots; d++) {
      const angle = (d / dots) * Math.PI * 2
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      ctx.fillStyle = `rgba(0,0,0,${alpha})`
      ctx.fillRect(Math.round(x / ps) * ps - ps / 2, Math.round(y / ps) * ps - ps / 2, ps - 1, ps - 1)
    }
  }

  // Center dot pulsing
  const pulse = 0.6 + 0.4 * Math.sin(t * 0.005)
  const cs = ps * 1.5
  ctx.fillStyle = `rgba(0,0,0,${pulse})`
  ctx.fillRect(cx - cs / 2, cy - cs / 2, cs, cs)
}

// ── Counter icon: pixel digits rapidly counting up ────────────────────────────
function drawCounter(ctx: CanvasRenderingContext2D, W: number, t: number) {
  const ps = Math.floor(W / 12)

  // 5x7 pixel font segments for digits 0-9
  const DIGITS: number[][][] = [
    [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]], // 0
    [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]], // 1
    [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]], // 2
    [[1,1,1],[0,0,1],[0,1,1],[0,0,1],[1,1,1]], // 3
    [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]], // 4
    [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]], // 5
    [[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]], // 6
    [[1,1,1],[0,0,1],[0,1,0],[0,1,0],[0,1,0]], // 7
    [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]], // 8
    [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]], // 9
  ]

  // Two digits that count rapidly
  const speed = 0.008
  const d1 = Math.floor(t * speed) % 10
  const d2 = Math.floor(t * speed * 3.7) % 10

  const digitW = 3 * ps + ps
  const totalW = digitW * 2 + ps
  const startX = Math.floor((W - totalW) / 2)
  const startY = Math.floor(W * 0.2)

  ;[d1, d2].forEach((digit, di) => {
    const grid = DIGITS[digit]
    const ox = startX + di * (digitW + ps)
    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return
        const flicker = 0.5 + 0.5 * Math.sin(t * 0.01 + di * 2.1 + r * 0.5)
        ctx.fillStyle = `rgba(0,0,0,${0.3 + flicker * 0.6})`
        ctx.fillRect(ox + c * (ps + 1), startY + r * (ps + 1), ps, ps)
      })
    })
  })

  // Small "+" indicator below
  const plusY = startY + 6 * (ps + 1)
  const plusX = startX + totalW / 2 - ps / 2
  const plusAlpha = 0.3 + 0.4 * Math.sin(t * 0.005)
  ctx.fillStyle = `rgba(0,0,0,${plusAlpha})`
  ctx.fillRect(plusX, plusY + ps, ps * 2, ps)
  ctx.fillRect(plusX + ps / 2, plusY + ps / 2, ps, ps * 2)
}

// ── Canvas wrapper ────────────────────────────────────────────────────────────
export function PixelIcon({ type, size = 40 }: PixelIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const draw = (t: number) => {
      const dpr = window.devicePixelRatio || 1
      canvas.width  = size * dpr
      canvas.height = size * dpr
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, size, size)

      // Disable anti-aliasing for crisp pixels
      ctx.imageSmoothingEnabled = false

      switch (type) {
        case "platform":      drawPlatform(ctx, size, t);      break
        case "agents":        drawAgents(ctx, size, t);        break
        case "workflow":      drawWorkflow(ctx, size, t);      break
        case "integrations":  drawIntegrations(ctx, size, t);  break
        case "pricing":       drawPricing(ctx, size, t);       break
        case "faq":           drawFaq(ctx, size, t);           break
        case "kasir":         drawKasir(ctx, size, t);         break
        case "promo":         drawPromo(ctx, size, t);         break
        case "realtime":      drawRealtime(ctx, size, t);      break
        case "counter":       drawCounter(ctx, size, t);       break
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [type, size])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        display: "block",
        flexShrink: 0,
      }}
    />
  )
}
