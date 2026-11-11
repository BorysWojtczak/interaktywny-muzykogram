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

/** Age bands for classroom pacing and path density. */
export type AgeGroup = '3-4' | '4-5' | '5-6'

export type Theme = {
  id: string
  title: string
  subtitle: string
  mood: string
  composer: string
  piece: string
  playlistIndex: number
  ageGroup: AgeGroup
  ageLabel: string
  /** Deterministic seed for path layout */
  seed: number
  /** Max 3 (3–4), mid (4–5), up to 10 (5–6) */
  pathCount: number
  durationSec: number
  tempoHint: 'calm' | 'medium' | 'lively' | 'fast'
  palette: string[]
  atmosphere: ThemeAtmosphere
  /** Bundled classical recording under /public/audio */
  audioSrc: string
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
