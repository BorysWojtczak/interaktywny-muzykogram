# Audio placeholders

Kompozycje klasyczne z playlisty są w domenie publicznej, ale **nagrania** mają osobne prawa.

Obecnie aplikacja używa:
- **syntetycznego zegara** (`performance.now` / RAF) do fill animacji,
- **lekkiego Web Audio bed** (proste arpeggia) jako podkładu zastępczego.

Aby dodać prawdziwe nagranie CC0/CC-BY:

1. Umieść plik tutaj, np. `poranek-ogrod.mp3`
2. Ustaw `audioSrc: '/audio/poranek-ogrod.mp3'` w `src/data/catalog.ts`
3. Zapisz źródło i licencję w `docs/audio-sources.md` (Project store / repo)

Źródła do rozważenia: Musopen, Internet Archive (PD/CC), własne nagrania edukacyjne.
