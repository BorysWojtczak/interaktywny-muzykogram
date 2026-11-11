export type PathDef = {
  id: string
  d: string
  order: number
  durationSec: number
  startAt: number
  colorIndex: number
  strokeWidth: number
}

export type ThemeAtmosphere = {
  sky: string
  mid: string
  ground: string
  accent: string
}

export type Theme = {
  id: string
  title: string
  subtitle: string
  mood: string
  composer: string
  piece: string
  playlistIndex: number
  /** Deterministic seed for path layout */
  seed: number
  pathCount: number
  durationSec: number
  tempoHint: 'calm' | 'medium' | 'lively' | 'fast'
  palette: string[]
  atmosphere: ThemeAtmosphere
  /** Optional bundled audio URL under /public/audio */
  audioSrc?: string
  audioNote: string
  patternBias: PatternBias
}

export type PatternBias =
  | 'waves'
  | 'arcs'
  | 'gears'
  | 'bridges'
  | 'stars'
  | 'zigzag'
  | 'dots'
  | 'sun'
  | 'meadow'
  | 'gallop'
  | 'stripes'
  | 'ribbons'
  | 'fire'
  | 'bubbles'
  | 'parade'
  | 'dawn'
  | 'buzz'
  | 'snow'
  | 'petals'
  | 'farm'
