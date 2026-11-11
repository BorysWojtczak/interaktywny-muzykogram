import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { PathDef, Theme } from '../data/types'
import { usePlaybackClock } from '../hooks/usePlaybackClock'
import { PathBoard } from './PathBoard'
import { RunningRooster } from './RunningRooster'

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
  const [boardScale, setBoardScale] = useState<1 | 0.5>(1)

  const sequenceEnd = useMemo(() => {
    if (!paths.length) return theme.durationSec
    const last = paths[paths.length - 1]
    return last.startAt + last.durationSec + 0.35
  }, [paths, theme.durationSec])

  const { time, reset } = usePlaybackClock({
    playing,
    durationSec: sequenceEnd,
    audioRef,
    loopAudio: true,
    onComplete: () => {
      setPlaying(false)
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    },
  })

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !soundOn
    audio.loop = true
    if (playing) {
      void audio.play().catch(() => undefined)
    } else {
      audio.pause()
    }
  }, [playing, soundOn, theme.audioSrc])

  // If audio ends early despite loop attr, restart while timeline runs
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () => {
      if (!playing) return
      audio.currentTime = 0
      void audio.play().catch(() => undefined)
    }
    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [playing])

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

  const progressPct = sequenceEnd ? Math.min(100, (time / sequenceEnd) * 100) : 0
  const filled = paths.filter((p) => time >= p.startAt + p.durationSec * 0.98).length
  const filling = playing && filled < paths.length

  return (
    <div
      className={`board-view scale-${boardScale === 1 ? 'full' : 'half'}`}
      style={
        {
          '--atm-sky': theme.atmosphere.sky,
          '--atm-mid': theme.atmosphere.mid,
          '--atm-ground': theme.atmosphere.ground,
          '--atm-accent': theme.atmosphere.accent,
          '--board-scale': String(boardScale),
        } as CSSProperties
      }
    >
      <header className="board-bar">
        <img
          className="board-logo"
          src={`${import.meta.env.BASE_URL}brand/zloty-kogucik.webp`}
          alt="Przedszkole Publiczne Złoty Kogucik"
          width={72}
          height={72}
        />
        <div className="board-brand">
          <span className="brand-mini">Muzykogram · Złoty Kogucik</span>
          <h1>{theme.title}</h1>
        </div>
        <p className="board-track">
          {theme.composer} — {theme.piece}
          <br />
          {theme.ageLabel} · {theme.pathCount} szlaczków · kolejno
        </p>
      </header>

      <div className="board-stage" ref={stageRef}>
        <PathBoard paths={paths} palette={theme.palette} time={time} />
      </div>

      <footer className="control-panel">
        <RunningRooster active={filling} />

        <div className="panel-tiles">
          <button type="button" className="panel-tile tile-primary big-tap" onClick={toggle}>
            <span className="tile-label">{playing ? 'Pauza' : 'Start'}</span>
          </button>
          <button type="button" className="panel-tile big-tap" onClick={restart}>
            <span className="tile-label">Od początku</span>
          </button>
          <button
            type="button"
            className="panel-tile big-tap"
            onClick={() => setSoundOn((s) => !s)}
            aria-pressed={soundOn}
          >
            <span className="tile-label">{soundOn ? 'Dźwięk' : 'Cicho'}</span>
          </button>
          <button
            type="button"
            className="panel-tile big-tap"
            onClick={() => setBoardScale((s) => (s === 1 ? 0.5 : 1))}
            aria-pressed={boardScale === 0.5}
          >
            <span className="tile-label">
              {boardScale === 1 ? 'Połowa ekranu' : 'Pełny ekran tablicy'}
            </span>
          </button>
          <button type="button" className="panel-tile big-tap" onClick={enterFullscreen}>
            <span className="tile-label">Pełny ekran</span>
          </button>
          <button type="button" className="panel-tile tile-back big-tap" onClick={onBack}>
            <span className="tile-label">← Tematy</span>
          </button>
        </div>

        <div className="timeline" aria-hidden="true">
          <div className="timeline-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="board-meta-row">
          <p className="hint">
            Muzyka gra do końca ostatniego szlaczka · pałeczka tylko naśladuje (
            {filled}/{paths.length}).
          </p>
          <p className="audio-note" title={theme.audioNote}>
            Muzyka klasyczna
          </p>
        </div>

        <audio
          ref={audioRef}
          src={theme.audioSrc}
          preload="auto"
          loop
          aria-label="Muzyka klasyczna"
        />
      </footer>
    </div>
  )
}
