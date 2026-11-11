import { useLayoutEffect, useRef } from 'react'
import type { PathDef } from '../data/types'

type Props = {
  paths: PathDef[]
  palette: string[]
  time: number
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

export function PathBoard({ paths, palette, time }: Props) {
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map())
  const lengths = useRef<Map<string, number>>(new Map())

  useLayoutEffect(() => {
    const map = new Map<string, number>()
    for (const [id, el] of pathRefs.current) {
      try {
        map.set(id, el.getTotalLength())
      } catch {
        map.set(id, 1000)
      }
    }
    lengths.current = map
  }, [paths])

  return (
    <svg
      className="path-board"
      viewBox="0 0 1200 800"
      role="img"
      aria-label="Szlaczki muzykogramu — kolor wypełnia się automatycznie"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="softGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {paths.map((p) => {
        const len = lengths.current.get(p.id) ?? 1200
        const progress = clamp01((time - p.startAt) / p.durationSec)
        const dashOffset = len * (1 - progress)
        const color = palette[p.colorIndex % palette.length]

        return (
          <g key={p.id}>
            <path
              d={p.d}
              fill="none"
              stroke="rgba(30, 40, 35, 0.12)"
              strokeWidth={p.strokeWidth + 5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              ref={(el) => {
                if (el) pathRefs.current.set(p.id, el)
                else pathRefs.current.delete(p.id)
              }}
              d={p.d}
              fill="none"
              stroke={color}
              strokeWidth={p.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={len}
              strokeDashoffset={dashOffset}
              filter="url(#softGlow)"
              opacity={progress > 0 ? 1 : 0.15}
            />
          </g>
        )
      })}
    </svg>
  )
}
