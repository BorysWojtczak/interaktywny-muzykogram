import type { CSSProperties } from 'react'
import type { Theme } from '../data/types'

type Props = {
  themes: Theme[]
  onSelect: (id: string) => void
}

export function ThemePicker({ themes, onSelect }: Props) {
  return (
    <div className="picker">
      <header className="hero">
        <div className="hero-atmosphere" aria-hidden="true">
          <div className="sun" />
          <div className="hill hill-a" />
          <div className="hill hill-b" />
          <svg className="hero-ribbon" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path
              className="ribbon-path"
              d="M0 120 C 150 40, 300 180, 450 100 S 750 40, 900 120 S 1100 180, 1200 80"
              fill="none"
              stroke="rgba(240,122,90,0.55)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              className="ribbon-path ribbon-delay"
              d="M0 150 C 200 90, 350 190, 520 140 S 820 80, 1000 150 S 1150 170, 1200 130"
              fill="none"
              stroke="rgba(244,201,95,0.5)"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="hero-copy">
          <p className="brand">Muzykogram</p>
          <h1>Kolor płynie w rytm muzyki</h1>
          <p className="lede">
            Wybierz temat, weź kolorową pałeczkę i śledź szlaczek — fill idzie
            sam, w tempie utworu.
          </p>
          <a className="hero-cta" href="#tematy">
            Wybierz temat
          </a>
        </div>
      </header>

      <section className="theme-section" id="tematy" aria-labelledby="themes-heading">
        <div className="theme-section-head">
          <h2 id="themes-heading">Tematy</h2>
          <p className="section-note">
            {themes.length} tablic · szlaczki generowane pod każdy utwór · pałeczka
            to tylko iluzja
          </p>
        </div>

        <ul className="theme-grid">
          {themes.map((theme) => (
            <li key={theme.id}>
              <button
                type="button"
                className="theme-tile"
                style={
                  {
                    '--tile-accent': theme.atmosphere.accent,
                    '--tile-sky': theme.atmosphere.sky,
                  } as CSSProperties
                }
                onClick={() => onSelect(theme.id)}
              >
                <span className="tile-swatches" aria-hidden="true">
                  {theme.palette.slice(0, 4).map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </span>
                <span className="tile-index">#{theme.playlistIndex}</span>
                <span className="tile-title">{theme.title}</span>
                <span className="tile-meta">
                  {theme.composer}
                  <br />
                  {theme.piece}
                </span>
                <span className="tile-stats">
                  {theme.pathCount} szlaczków · {theme.tempoHint === 'fast'
                    ? 'szybko'
                    : theme.tempoHint === 'lively'
                      ? 'żywo'
                      : theme.tempoHint === 'calm'
                        ? 'spokojnie'
                        : 'umiarkowanie'}
                </span>
                <span className="tile-cta">Otwórz tablicę</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
