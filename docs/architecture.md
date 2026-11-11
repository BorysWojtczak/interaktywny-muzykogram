# Architektura — Interaktywny Muzykogram

20 plansz w **3 grupach wiekowych** z wolnym przepływem koloru i oryginalną ścieżką audio.

## Warstwy

```
UI (React)
  ├─ ThemePicker — grupy 3–4 / 4–5 / 5–6
  └─ BoardView — aktywna tablica
       ├─ PathBoard (SVG) — stroke-dashoffset fill
       ├─ PlaybackClock — audio.currentTime (HTML5 Audio)
       └─ Pełny ekran / duże CTA
Dane
  catalog.ts          → Theme (wiek, pathCount, audioSrc, atmosfera)
  pathGenerator.ts    → PathDef[] z pacingiem wiekowym
  themes.ts           → cache ścieżek per themeId
Audio
  public/audio/*.ogg  → oryginalne ścieżki (CC BY) — bez syntheticBed
```

## Grupy wiekowe

| Grupa | Plansze | Szlaczki | Przepływ koloru |
| --- | --- | --- | --- |
| 3–4 lata | 1–5 | max **3** | najwolniejszy (~18 s / szlaczek, prawie sekwencyjnie) |
| 4–5 lat | 6–10 | 5–6 | wolny (~13 s) |
| 5–6 lat | 11–20 | 7–**10** | wyższa dynamika, nadal wolna (~10 s) |

Cel: dziecko z pałeczką zdąży odzwierciedlić ruch koloru.

## Model danych

```ts
type Theme = {
  id, title, subtitle, mood, inspiration
  ageGroup: '3-4' | '4-5' | '5-6'
  pathCount: number          // 2–3 / 5–6 / 7–10
  durationSec: number        // ~90 (pętla ze ścieżką)
  audioSrc: string           // /audio/<id>.ogg — zawsze obecne
  tempoHint, palette, atmosphere, patternBias, seed
}
```

## Timing i sync

1. Źródło prawdy: `audio.currentTime` z bundlowanego OGG.
2. Progress pathu: `clamp((t - startAt) / durationSec, 0, 1)`.
3. **Illusion only** — brak kamery / trackingu / scoringu.

## UX klasy

- Duże cele (`big-tap`), pełny ekran, hint o pałeczce
- Karty pogrupowane według wieku
