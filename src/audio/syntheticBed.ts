/**
 * Lightweight cheerful Web Audio bed when no recording is bundled.
 * Not a real classical performance — classroom placeholder only.
 */

type BedHandle = {
  stop: () => void
}

const SCALE = [0, 2, 4, 5, 7, 9, 11, 12] // major

export function startSyntheticBed(
  tempoHint: 'calm' | 'medium' | 'lively' | 'fast',
  seed: number,
): BedHandle | null {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AC) return null

  const ctx = new AC()
  const master = ctx.createGain()
  master.gain.value = 0.045
  master.connect(ctx.destination)

  const bpm = { calm: 72, medium: 96, lively: 120, fast: 148 }[tempoHint]
  const beat = 60 / bpm
  let stopped = false
  let step = 0
  const base = 196 + (seed % 7) * 12 // G3-ish neighborhood

  const schedule = () => {
    if (stopped) return
    const t0 = ctx.currentTime
    for (let i = 0; i < 4; i++) {
      const deg = SCALE[(step + i * 2) % SCALE.length]
      const freq = base * Math.pow(2, deg / 12)
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = i % 2 === 0 ? 'triangle' : 'sine'
      osc.frequency.value = freq
      const start = t0 + i * beat * 0.5
      g.gain.setValueAtTime(0, start)
      g.gain.linearRampToValueAtTime(0.7, start + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, start + beat * 0.85)
      osc.connect(g)
      g.connect(master)
      osc.start(start)
      osc.stop(start + beat)
    }
    step = (step + 1) % SCALE.length
    timer = window.setTimeout(schedule, beat * 2000)
  }

  let timer = window.setTimeout(schedule, 40)
  void ctx.resume()

  return {
    stop: () => {
      stopped = true
      window.clearTimeout(timer)
      master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      window.setTimeout(() => void ctx.close(), 200)
    },
  }
}
