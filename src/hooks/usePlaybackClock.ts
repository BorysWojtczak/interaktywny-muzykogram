import { useEffect, useRef, useState, type RefObject } from 'react'

type Options = {
  playing: boolean
  durationSec: number
  audioRef: RefObject<HTMLAudioElement | null>
  loop?: boolean
}

/** Shared clock: prefers audio.currentTime, else synthetic RAF time. */
export function usePlaybackClock({
  playing,
  durationSec,
  audioRef,
  loop = true,
}: Options) {
  const [time, setTime] = useState(0)
  const startedAt = useRef<number | null>(null)
  const offset = useRef(0)

  useEffect(() => {
    if (!playing) {
      offset.current = time
      startedAt.current = null
      return
    }

    let raf = 0
    const tick = (now: number) => {
      const audio = audioRef.current
      if (audio && audioSrcReady(audio) && !audio.paused) {
        setTime(audio.currentTime)
      } else {
        if (startedAt.current === null) startedAt.current = now
        let t = offset.current + (now - startedAt.current) / 1000
        if (loop && durationSec > 0) t = t % durationSec
        setTime(t)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, durationSec, loop, audioRef])

  const seek = (t: number) => {
    offset.current = t
    startedAt.current = null
    setTime(t)
    const audio = audioRef.current
    if (audio && audioSrcReady(audio)) audio.currentTime = t
  }

  return { time, seek, reset: () => seek(0) }
}

function audioSrcReady(audio: HTMLAudioElement) {
  return Boolean(audio.getAttribute('src')) && audio.readyState >= 1
}
