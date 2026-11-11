import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { PathDef, Theme } from '../data/types'
import { usePlaybackClock } from '../hooks/usePlaybackClock'
import { PathBoard } from './PathBoard'

type Props = {
  theme: Theme
  paths: PathDef[]
  onBack: () => void
}

export function BoardView({ theme, paths, onBack }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const { time, reset } = usePlaybackClock({
    playing,
    durationSec: theme.durationSec,
    audioRef,
    loop: true,
  })

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !soundOn
    if (playing) {
      void audio.play().catch(() => undefined)
    } else {
      audio.pause()
    }
  }, [playing, soundOn, theme.audioSrc])

  const toggle = () => setPlaying((p) => !p)
  const restart = () => {
    reset()
    setPlaying(true)
  }

  const enterFullscreen = async () => {
    const el = stageRef.current?.closest('.board-view') ?? document.documentElement
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.().catch(() => undefined)
    } else {
      await document.exitFullscreen?.().catch(() => undefined)
    }
  }

  const progressPct = theme.durationSec
    ? Math.min(100, (time / theme.durationSec) * 100)
    : 0

  const filled = paths.filter(
    (p) => time >= p.startAt + p.durationSec * 0.98,
  ).length

  return (
    <div
      className="board-view"
      style={
        {
          '--atm-sky': theme.atmosphere.sky,
          '--atm-mid': theme.atmosphere.mid,
          '--atm-ground': theme.atmosphere.ground,
          '--atm-accent': theme.atmosphere.accent,
        } as CSSProperties
      }
    >
      <header className="board-bar">
        <button type="button" className="ghost-btn big-tap" onClick={onBack}>
          ← Tematy
        </button>
        <div className="board-brand">
          <span className="brand-mini">Muzykogram</span>
          <h1>{theme.title}</h1>
        </div>
        <p className="board-track">
          {theme.ageLabel} · {theme.pathCount} szlaczków · oryginalna ścieżka
        </p>
      </header>

      <div className="board-stage" ref={stageRef}>
        <PathBoard paths={paths} palette={theme.palette} time={time} />
      </div>

      <footer className="board-controls">
        <div className="transport">
          <button type="button" className="primary-btn big-tap" onClick={toggle}>
            {playing ? 'Pauza' : 'Start'}
          </button>
          <button type="button" className="ghost-btn big-tap" onClick={restart}>
            Od początku
          </button>
          <button
            type="button"
            className="ghost-btn big-tap"
            onClick={() => setSoundOn((s) => !s)}
            aria-pressed={soundOn}
          >
            {soundOn ? 'Dźwięk włączony' : 'Cicho'}
          </button>
          <button type="button" className="ghost-btn big-tap" onClick={enterFullscreen}>
            Pełny ekran
          </button>
        </div>

        <div className="timeline" aria-hidden="true">
          <div className="timeline-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="board-meta-row">
          <p className="hint">
            Pałeczka tylko naśladuje — kolor płynie wolno (
            {filled}/{paths.length} szlaczków · {theme.ageLabel}).
          </p>
          <p className="audio-note" title={theme.audioNote}>
            Oryginalna ścieżka dźwiękowa
          </p>
        </div>

        <audio
          ref={audioRef}
          src={theme.audioSrc}
          preload="auto"
          loop
          aria-label="Oryginalna ścieżka dźwiękowa"
        />
      </footer>
    </div>
  )
}
