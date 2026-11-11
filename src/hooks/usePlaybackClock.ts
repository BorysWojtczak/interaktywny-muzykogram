import { useEffect, useRef, useState, type RefObject } from 'react'

type Options = {
  playing: boolean
  /** Total timeline length (usually end of last path). */
  durationSec: number
  audioRef: RefObject<HTMLAudioElement | null>
  /** When true, audio element may loop while the timeline runs. */
  loopAudio?: boolean
  onComplete?: () => void
}

/**
 * Master clock is RAF-based so path fill is independent of audio file length.
 * Audio loops underneath until the timeline finishes, then both stop.
 */
export function usePlaybackClock({
  playing,
  durationSec,
  audioRef,
  loopAudio = true,
  onComplete,
}: Options) {
  const [time, setTime] = useState(0)
  const startedAt = useRef<number | null>(null)
  const offset = useRef(0)
  const completed = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!playing) {
      offset.current = time
      startedAt.current = null
      return
    }

    completed.current = false
    let raf = 0
    const tick = (now: number) => {
      if (startedAt.current === null) startedAt.current = now
      let t = offset.current + (now - startedAt.current) / 1000

      if (durationSec > 0 && t >= durationSec) {
        t = durationSec
        setTime(t)
        if (!completed.current) {
          completed.current = true
          onCompleteRef.current?.()
        }
        return
      }

      setTime(t)

      // Keep audio looping for the whole timeline
      const audio = audioRef.current
      if (audio && audioSrcReady(audio) && loopAudio) {
        if (audio.paused) void audio.play().catch(() => undefined)
        // If natural end fired between ticks, restart
        if (audio.ended) {
          audio.currentTime = 0
          void audio.play().catch(() => undefined)
        }
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, durationSec, loopAudio, audioRef])

  const seek = (t: number) => {
    offset.current = t
    startedAt.current = null
    completed.current = false
    setTime(t)
    const audio = audioRef.current
    if (audio && audioSrcReady(audio)) {
      const dur = audio.duration
      audio.currentTime = Number.isFinite(dur) && dur > 0 ? t % dur : 0
    }
  }

  return { time, seek, reset: () => seek(0) }
}

function audioSrcReady(audio: HTMLAudioElement) {
  return Boolean(audio.getAttribute('src')) && audio.readyState >= 1
}
