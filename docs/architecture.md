# Architektura — Interaktywny Muzykogram

Skalowanie do **~20 tematów × ~26–30 szlaczków** bez ręcznego rysowania każdej ścieżki.

## Warstwy

```
UI (React)
  ├─ ThemePicker — 20 kart z katalogu
  └─ BoardView — aktywna tablica
       ├─ PathBoard (SVG) — stroke-dashoffset fill
       ├─ PlaybackClock — audio.currentTime lub RAF
       ├─ syntheticBed (Web Audio) — placeholder gdy brak pliku
       └─ Pełny ekran / duże CTA (tablica interaktywna)
Dane
  catalog.ts          → 20 Theme (meta, paleta, atmosfera, tempo)
  pathGenerator.ts    → deterministyczne PathDef[] (seed)
  themes.ts           → cache ścieżek per themeId
```

## Model danych

```ts
type Theme = {
  id: string
  title: string              // PL
  composer: string
  piece: string
  seed: number
  pathCount: number          // 26–30
  durationSec: number
  tempoHint: 'calm' | 'medium' | 'lively' | 'fast'
  palette: string[]
  atmosphere: { sky; mid; ground; accent }
  audioSrc?: string          // /public/audio/...
  audioNote: string
  patternBias: PatternBias   // waves | gears | petals | …
}

type PathDef = {
  id: string
  d: string                  // SVG path, viewBox 1200×800
  startAt: number
  durationSec: number
  colorIndex: number
  strokeWidth: number
}
```

Ścieżki generowane **lazy + cache** przy otwarciu tematu — tablet nie liczy 20×30 przy starcie pickera.

## Timing i sync

1. Źródło prawdy: `audio.currentTime` gdy jest plik; inaczej syntetyczny RAF clock.
2. Progress pathu: `clamp((t - startAt) / durationSec, 0, 1)` → `stroke-dashoffset`.
3. Stagger z overlappingiem (wiele szlaczków naraz) — czytelne z daleka na tablicy.
4. **Illusion only** — brak kamery / trackingu / scoringu.
5. Opcjonalny Web Audio bed (arpeggia) gdy `audioSrc` puste; przełącznik „Cicho”.

## Audio

| Stan | Zachowanie |
| --- | --- |
| Brak pliku (obecnie wszystkie 20) | Zegar syntetyczny + Web Audio placeholder |
| Plik w `/public/audio/` + `audioSrc` | HTML5 `<audio loop>`; bed wyłączony |

Licencje: kompozycja PD ≠ nagranie. Źródła: `docs/audio-sources.md` w repo / Project store.

## UX klasy

- Duże cele (`big-tap`, min ~3.1rem)
- `touch-action: manipulation`
- Przycisk **Pełny ekran**
- Atmosfera tła per temat (CSS variables)
- Hint: „Pałeczka tylko naśladuje…” + licznik wypełnionych szlaczków

## Stan buildu

- 20 otwartych tematów z playlisty
- ~568 ścieżek łącznie (avg ~28.4 / temat)
- Generator rodzin: fale, łuki, zygzaki, pętle, spirale/płatki, wstążki, ósemki, tryby/meandry

## Następne kroki

1. Bundlowane nagrania CC0/CC-BY + cue points  
2. Ręczna kuracja „hero paths” per temat (nadpisania generatora)  
3. publish-app / hosting publiczny (bez GitHuba — wg decyzji projektu)  
4. (Opcjonalnie) gest feedback — tylko na życzenie
