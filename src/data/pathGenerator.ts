import type { PathDef, PatternBias, Theme } from './types'

/** Mulberry32 — tiny seeded PRNG for deterministic boards. */
function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const W = 1200
const H = 800
const MARGIN = 48

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

function wavePath(
  y: number,
  amp: number,
  freq: number,
  phase: number,
  steps = 18,
): string {
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const x = MARGIN + (i / steps) * (W - MARGIN * 2)
    const yy = y + Math.sin((i / steps) * Math.PI * 2 * freq + phase) * amp
    if (i === 0) pts.push(`M ${x.toFixed(1)} ${yy.toFixed(1)}`)
    else {
      const px = MARGIN + ((i - 1) / steps) * (W - MARGIN * 2)
      const mid = (px + x) / 2
      pts.push(`Q ${mid.toFixed(1)} ${yy.toFixed(1)} ${x.toFixed(1)} ${yy.toFixed(1)}`)
    }
  }
  return pts.join(' ')
}

function zigzagPath(y: number, amp: number, teeth: number): string {
  const pts: string[] = []
  const n = teeth * 2
  for (let i = 0; i <= n; i++) {
    const x = MARGIN + (i / n) * (W - MARGIN * 2)
    const yy = y + (i % 2 === 0 ? -amp : amp)
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yy.toFixed(1)}`)
  }
  return pts.join(' ')
}

function arcRowPath(y: number, arches: number, height: number): string {
  const span = (W - MARGIN * 2) / arches
  let d = `M ${MARGIN} ${y}`
  for (let i = 0; i < arches; i++) {
    const x0 = MARGIN + i * span
    const x1 = x0 + span
    const cx = (x0 + x1) / 2
    d += ` Q ${cx.toFixed(1)} ${(y - height).toFixed(1)} ${x1.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

function loopsPath(y: number, loops: number, r: number): string {
  const span = (W - MARGIN * 2) / loops
  let d = ''
  for (let i = 0; i < loops; i++) {
    const cx = MARGIN + span * (i + 0.5)
    const x0 = cx - r
    const x1 = cx + r
    const cmd = i === 0 ? 'M' : 'L'
    d += `${cmd} ${x0.toFixed(1)} ${y.toFixed(1)} C ${x0.toFixed(1)} ${(y - r * 1.4).toFixed(1)}, ${x1.toFixed(1)} ${(y - r * 1.4).toFixed(1)}, ${x1.toFixed(1)} ${y.toFixed(1)} C ${x1.toFixed(1)} ${(y + r * 1.2).toFixed(1)}, ${x0.toFixed(1)} ${(y + r * 1.2).toFixed(1)}, ${x0.toFixed(1)} ${y.toFixed(1)} `
  }
  return d.trim()
}

function spiralPath(cx: number, cy: number, turns: number, maxR: number): string {
  const steps = Math.floor(turns * 28)
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const ang = t * turns * Math.PI * 2
    const r = 12 + t * maxR
    const x = cx + Math.cos(ang) * r
    const y = cy + Math.sin(ang) * r
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

function diagonalRibbon(y0: number, y1: number, wobble: number, steps = 14): string {
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = MARGIN + t * (W - MARGIN * 2)
    const y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI * 3) * wobble
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

function petalPath(cx: number, cy: number, r: number, petals: number): string {
  const pts: string[] = []
  const steps = petals * 12
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const rr = r * (0.55 + 0.45 * Math.abs(Math.sin(a * (petals / 2))))
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ') + ' Z'
}

function figureEight(cx: number, cy: number, rx: number, ry: number): string {
  return [
    `M ${cx} ${cy}`,
    `C ${cx + rx} ${cy - ry}, ${cx + rx} ${cy + ry}, ${cx} ${cy}`,
    `C ${cx - rx} ${cy - ry}, ${cx - rx} ${cy + ry}, ${cx} ${cy}`,
  ].join(' ')
}

function meanderVertical(x: number, amp: number, waves: number): string {
  const pts: string[] = []
  const steps = 20
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const y = MARGIN + t * (H - MARGIN * 2)
    const xx = x + Math.sin(t * Math.PI * 2 * waves) * amp
    pts.push(`${i === 0 ? 'M' : 'L'} ${xx.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

function gearRing(cx: number, cy: number, r: number, teeth: number): string {
  const pts: string[] = []
  const steps = teeth * 4
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const tooth = i % 4 < 2 ? 1.12 : 0.88
    const rr = r * tooth
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ') + ' Z'
}

function pickFamily(bias: PatternBias, rnd: () => number): number {
  // Weighted family picker by theme bias (0..7 families)
  const weights: Record<PatternBias, number[]> = {
    waves: [5, 1, 2, 1, 1, 1, 1, 1],
    arcs: [1, 5, 1, 1, 1, 1, 1, 1],
    gears: [1, 1, 1, 1, 1, 1, 1, 5],
    bridges: [1, 5, 1, 2, 1, 1, 1, 1],
    stars: [1, 1, 2, 1, 3, 2, 1, 1],
    zigzag: [1, 1, 5, 1, 1, 1, 1, 1],
    dots: [1, 3, 1, 3, 1, 1, 1, 1],
    sun: [2, 3, 1, 1, 3, 1, 1, 1],
    meadow: [4, 2, 1, 2, 1, 1, 1, 1],
    gallop: [2, 1, 4, 1, 1, 2, 1, 1],
    stripes: [1, 1, 4, 1, 1, 3, 1, 1],
    ribbons: [3, 1, 1, 1, 1, 4, 1, 1],
    fire: [2, 1, 3, 2, 1, 2, 1, 1],
    bubbles: [3, 1, 1, 4, 1, 1, 1, 1],
    parade: [1, 2, 3, 2, 1, 1, 1, 1],
    dawn: [4, 3, 1, 1, 1, 1, 1, 1],
    buzz: [1, 1, 4, 2, 2, 1, 1, 1],
    snow: [2, 3, 1, 2, 1, 1, 2, 1],
    petals: [1, 1, 1, 2, 4, 1, 1, 1],
    farm: [2, 3, 2, 1, 1, 1, 1, 1],
  }
  const w = weights[bias]
  const sum = w.reduce((a, b) => a + b, 0)
  let r = rnd() * sum
  for (let i = 0; i < w.length; i++) {
    r -= w[i]
    if (r <= 0) return i
  }
  return 0
}

function makePathD(
  family: number,
  rnd: () => number,
  index: number,
  total: number,
): { d: string; strokeWidth: number } {
  const band = MARGIN + 40 + ((index + 0.5) / total) * (H - MARGIN * 2 - 80)
  const amp = 18 + rnd() * 42
  const strokeWidth = 10 + rnd() * 12

  switch (family) {
    case 0: // waves
      return {
        d: wavePath(band, amp, 1.2 + rnd() * 2.2, rnd() * Math.PI * 2),
        strokeWidth,
      }
    case 1: // arcs
      return {
        d: arcRowPath(band, 4 + Math.floor(rnd() * 6), 28 + rnd() * 50),
        strokeWidth,
      }
    case 2: // zigzag
      return {
        d: zigzagPath(band, 16 + rnd() * 36, 5 + Math.floor(rnd() * 8)),
        strokeWidth: strokeWidth * 0.9,
      }
    case 3: // loops / bubbles
      return {
        d: loopsPath(band, 3 + Math.floor(rnd() * 5), 22 + rnd() * 28),
        strokeWidth,
      }
    case 4: // petals / stars / spirals
      if (rnd() > 0.45) {
        return {
          d: spiralPath(
            200 + rnd() * 800,
            160 + rnd() * 480,
            2.2 + rnd() * 2.5,
            40 + rnd() * 90,
          ),
          strokeWidth: strokeWidth * 0.85,
        }
      }
      return {
        d: petalPath(
          220 + rnd() * 760,
          180 + rnd() * 440,
          50 + rnd() * 70,
          5 + Math.floor(rnd() * 4),
        ),
        strokeWidth: strokeWidth * 0.75,
      }
    case 5: // ribbons / diagonals
      return {
        d: diagonalRibbon(
          MARGIN + 60 + rnd() * 200,
          H - MARGIN - 60 - rnd() * 200,
          20 + rnd() * 50,
        ),
        strokeWidth,
      }
    case 6: // figure eight / snow swirls
      return {
        d: figureEight(
          250 + rnd() * 700,
          180 + rnd() * 440,
          60 + rnd() * 90,
          40 + rnd() * 70,
        ),
        strokeWidth,
      }
    default: // gears / vertical meanders
      if (rnd() > 0.5) {
        return {
          d: gearRing(
            280 + rnd() * 640,
            200 + rnd() * 400,
            45 + rnd() * 70,
            8 + Math.floor(rnd() * 8),
          ),
          strokeWidth: strokeWidth * 0.7,
        }
      }
      return {
        d: meanderVertical(
          MARGIN + 80 + rnd() * (W - MARGIN * 2 - 160),
          30 + rnd() * 50,
          1.5 + rnd() * 2,
        ),
        strokeWidth,
      }
  }
}

/**
 * Age-aware pacing: color flow stays slow enough for a child with a stick
 * to mirror the movement. Older groups get more paths and slightly higher
 * dynamism — never arcade-fast.
 */
const agePace: Record<
  Theme['ageGroup'],
  { fill: number; stagger: number; strokeBoost: number }
> = {
  '3-4': { fill: 18, stagger: 14, strokeBoost: 1.35 }, // max 3 paths, nearly sequential
  '4-5': { fill: 13, stagger: 8, strokeBoost: 1.15 },
  '5-6': { fill: 10, stagger: 5.5, strokeBoost: 1.0 },
}

export function generatePaths(theme: Theme): PathDef[] {
  const rnd = mulberry32(theme.seed)
  const count = theme.pathCount
  const { fill, stagger, strokeBoost } = agePace[theme.ageGroup]
  const paths: PathDef[] = []

  for (let i = 0; i < count; i++) {
    const family = pickFamily(theme.patternBias, rnd)
    const { d, strokeWidth } = makePathD(family, rnd, i, count)
    // Slight tempoHint nudge within the age band (±12%)
    const tempoNudge =
      theme.tempoHint === 'calm'
        ? 1.08
        : theme.tempoHint === 'medium'
          ? 1
          : theme.tempoHint === 'lively'
            ? 0.94
            : 0.88
    const startAt = 1.2 + i * stagger * (0.9 + rnd() * 0.2)
    const durationSec = fill * tempoNudge * (0.92 + rnd() * 0.16)
    paths.push({
      id: `${theme.id}-p${i}`,
      d,
      order: i,
      startAt: clamp(startAt, 0.8, theme.durationSec - 4),
      durationSec,
      colorIndex: i % theme.palette.length,
      strokeWidth: clamp(strokeWidth * strokeBoost, 12, 28),
    })
  }

  // Fit path timeline into board duration (loop-friendly)
  const last = paths[paths.length - 1]
  if (last && last.startAt + last.durationSec > theme.durationSec - 1) {
    const overflow = last.startAt + last.durationSec - (theme.durationSec - 1)
    for (const p of paths) {
      p.startAt = clamp(
        p.startAt - overflow * (p.order / Math.max(1, count - 1 || 1)),
        0.6,
        theme.durationSec - 4,
      )
    }
  }

  return paths
}
