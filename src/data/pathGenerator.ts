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
const MARGIN_X = 56
const MARGIN_Y = 36

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

/** One large horizontal wave / ribbon occupying a vertical band. */
function stackedWave(y: number, amp: number, freq: number, phase: number): string {
  const steps = 20
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const x = MARGIN_X + (i / steps) * (W - MARGIN_X * 2)
    const yy = y + Math.sin((i / steps) * Math.PI * 2 * freq + phase) * amp
    if (i === 0) pts.push(`M ${x.toFixed(1)} ${yy.toFixed(1)}`)
    else {
      const px = MARGIN_X + ((i - 1) / steps) * (W - MARGIN_X * 2)
      const mid = (px + x) / 2
      pts.push(`Q ${mid.toFixed(1)} ${yy.toFixed(1)} ${x.toFixed(1)} ${yy.toFixed(1)}`)
    }
  }
  return pts.join(' ')
}

function stackedZigzag(y: number, amp: number, teeth: number): string {
  const pts: string[] = []
  const n = teeth * 2
  for (let i = 0; i <= n; i++) {
    const x = MARGIN_X + (i / n) * (W - MARGIN_X * 2)
    const yy = y + (i % 2 === 0 ? -amp : amp)
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yy.toFixed(1)}`)
  }
  return pts.join(' ')
}

function stackedArcs(y: number, arches: number, height: number): string {
  const span = (W - MARGIN_X * 2) / arches
  let d = `M ${MARGIN_X} ${y}`
  for (let i = 0; i < arches; i++) {
    const x0 = MARGIN_X + i * span
    const x1 = x0 + span
    const cx = (x0 + x1) / 2
    d += ` Q ${cx.toFixed(1)} ${(y - height).toFixed(1)} ${x1.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

function stackedLoops(y: number, loops: number, r: number): string {
  const span = (W - MARGIN_X * 2) / loops
  let d = ''
  for (let i = 0; i < loops; i++) {
    const cx = MARGIN_X + span * (i + 0.5)
    const x0 = cx - r
    const x1 = cx + r
    const cmd = i === 0 ? 'M' : 'L'
    d += `${cmd} ${x0.toFixed(1)} ${y.toFixed(1)} C ${x0.toFixed(1)} ${(y - r * 1.35).toFixed(1)}, ${x1.toFixed(1)} ${(y - r * 1.35).toFixed(1)}, ${x1.toFixed(1)} ${y.toFixed(1)} C ${x1.toFixed(1)} ${(y + r * 1.15).toFixed(1)}, ${x0.toFixed(1)} ${(y + r * 1.15).toFixed(1)}, ${x0.toFixed(1)} ${y.toFixed(1)} `
  }
  return d.trim()
}

function biasFamily(bias: PatternBias, rnd: () => number): number {
  // 0 wave, 1 arcs, 2 zigzag, 3 loops — only large horizontal families (stacked rows)
  const weights: Record<PatternBias, number[]> = {
    waves: [5, 1, 1, 1],
    arcs: [1, 5, 1, 1],
    gears: [2, 2, 1, 3],
    bridges: [1, 5, 1, 1],
    stars: [2, 2, 1, 3],
    zigzag: [1, 1, 5, 1],
    dots: [1, 2, 1, 4],
    sun: [2, 4, 1, 1],
    meadow: [4, 2, 1, 1],
    gallop: [2, 1, 4, 1],
    stripes: [1, 1, 4, 2],
    ribbons: [4, 1, 1, 2],
    fire: [2, 1, 3, 2],
    bubbles: [1, 1, 1, 5],
    parade: [1, 2, 3, 2],
    dawn: [3, 4, 1, 1],
    buzz: [1, 1, 5, 1],
    snow: [2, 3, 1, 2],
    petals: [2, 2, 1, 3],
    farm: [2, 3, 2, 1],
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

function makeStackedPath(
  family: number,
  rnd: () => number,
  bandY: number,
  bandHalf: number,
): { d: string; strokeWidth: number } {
  const amp = clamp(bandHalf * (0.45 + rnd() * 0.35), 28, 78)
  const strokeWidth = clamp(bandHalf * 0.55 + rnd() * 8, 28, 56)

  switch (family) {
    case 1:
      return {
        d: stackedArcs(bandY, 3 + Math.floor(rnd() * 3), amp * 1.15),
        strokeWidth,
      }
    case 2:
      return {
        d: stackedZigzag(bandY, amp * 0.85, 4 + Math.floor(rnd() * 4)),
        strokeWidth: strokeWidth * 0.92,
      }
    case 3:
      return {
        d: stackedLoops(bandY, 3 + Math.floor(rnd() * 3), clamp(amp * 0.7, 24, 52)),
        strokeWidth,
      }
    default:
      return {
        d: stackedWave(bandY, amp, 1.0 + rnd() * 1.4, rnd() * Math.PI * 2),
        strokeWidth,
      }
  }
}

/**
 * Age pacing — fill is slow; paths are STRICTLY sequential
 * (next starts only after previous finishes).
 */
const agePace: Record<Theme['ageGroup'], { fill: number; gap: number; strokeBoost: number }> = {
  '3-4': { fill: 16, gap: 1.2, strokeBoost: 1.2 },
  '4-5': { fill: 13, gap: 0.9, strokeBoost: 1.1 },
  '5-6': { fill: 11, gap: 0.7, strokeBoost: 1.0 },
}

export function generatePaths(theme: Theme): PathDef[] {
  const rnd = mulberry32(theme.seed)
  const count = theme.pathCount
  const { fill, gap, strokeBoost } = agePace[theme.ageGroup]
  const paths: PathDef[] = []

  // Equal vertical bands — one szlaczek under another, large
  const usable = H - MARGIN_Y * 2
  const bandH = usable / count

  let cursor = 1.0 // start first path shortly after play begins

  for (let i = 0; i < count; i++) {
    const family = biasFamily(theme.patternBias, rnd)
    const bandY = MARGIN_Y + bandH * (i + 0.5)
    const bandHalf = bandH * 0.38
    const { d, strokeWidth } = makeStackedPath(family, rnd, bandY, bandHalf)

    const tempoNudge =
      theme.tempoHint === 'calm'
        ? 1.1
        : theme.tempoHint === 'medium'
          ? 1
          : theme.tempoHint === 'lively'
            ? 0.95
            : 0.9

    const durationSec = fill * tempoNudge
    const startAt = cursor
    paths.push({
      id: `${theme.id}-p${i}`,
      d,
      order: i,
      startAt,
      durationSec,
      colorIndex: i % theme.palette.length,
      strokeWidth: clamp(strokeWidth * strokeBoost, 26, 58),
    })
    // Next path waits until this one fully finishes
    cursor = startAt + durationSec + gap
  }

  // Do not shrink path timing to audio file length — audio loops until
  // the last szlaczek finishes (see BoardView / usePlaybackClock).
  return paths
}
