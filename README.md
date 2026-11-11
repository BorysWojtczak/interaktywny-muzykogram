# Interaktywny Muzykogram

Aplikacja webowa, w której dzieci „prowadzą” kolor po geometrycznych szlaczkach w rytm radosnej muzyki klasycznej. Pałeczka w ręku dziecka jest częścią zabawy — magia polega na tym, że kolor i tak płynie sam, w tempie utworu.

## O projekcie

Muzykogram to interaktywna tablica wizualno-muzyczna: na ekranie pojawiają się szlaczki i układy geometryczne, a po nich wędruje kolor zsynchronizowany z klasyką. Dzieci stoją przed ekranem (tablet, komputer lub tablica interaktywna) i poruszają kolorową pałeczką tak, jakby to one nadawały przepływ. W rzeczywistości ścieżka wypełnia się automatycznie — dzięki temu każdy może się bawić bez kalibracji kamery, sensorów czy punktacji.

Projekt zakłada **ok. 20 stref tematycznych**. Każdy temat to osobna tablica z **ok. 30 ścieżkami / układami**, dobranymi do nastroju konkretnego utworu klasycznego (jasne, pozytywne, energiczne kompozycje).

## Dla kogo

- nauczyciele wczesnoszkolni i przedszkolni,
- edukacja muzyczna i rytmika,
- zajęcia ruchowe przy muzyce klasycznej,
- domowe wspólne słuchanie z dziećmi.

## Jak to działa (iluzja pałeczki)

1. Wybierasz temat / utwór.
2. Odpalasz tablicę — startuje muzyka i animacja.
3. Kolor sam wypełnia szlaczki w zaplanowanym tempie.
4. Dziecko „steruje” pałeczką w powietrzu, naśladując ruch koloru.

Nie ma śledzenia ruchu, kamery ani scoringu. Chodzi o wspólne przeżycie muzyki, koncentracji i gestu — nie o grę zręcznościową.

## Założenia produktu

| Element | Opis |
|--------|------|
| Tematy | ~20 stref tematycznych |
| Ścieżki na temat | ~30 układów geometrycznych |
| Muzyka | klasyka — radosna, pozytywna, znana |
| Sterowanie | automatyczne wypełnianie (pałeczka = iluzja) |
| Platforma | przeglądarka (responsive: tablet / tablica / desktop) |
| Język UI | polski |

## Stack (scaffold)

- Vite + React + TypeScript
- SVG / Canvas — animacja wypełniania ścieżek
- HTML5 Audio — synchronizacja z utworem
- Dane tematów jako konfiguracja (łatwe skalowanie do 20×30)

## Struktura (docelowa)

```
src/
  themes/          # definicje 20 tematów (ścieżki, timing, audio)
  board/           # silnik tablicy i animacji wypełniania
  ui/              # wybór tematu, start, branding
  audio/           # odtwarzanie i sync
docs/
  playlist-klasyczna.md
  architecture.md
```

## Roadmapa

- [x] Koncepcja produktu i model iluzji pałeczki
- [ ] Publiczny scaffold + prototyp jednej tablicy
- [ ] Kuratorska playlista ~20 utworów
- [ ] Silnik ścieżek skalowalny do ~30 układów / temat
- [ ] Pełny zestaw 20 tematów (grafika + timing + audio)
- [ ] Publiczna aplikacja do otwarcia w przeglądarce

## Licencje muzyki

Same **kompozycje** klasyczne są zazwyczaj w domenie publicznej. **Nagrania** mogą mieć osobne prawa — w aplikacji używamy wyłącznie nagrań z jasną licencją (domena publiczna / Creative Commons / własne nagrania edukacyjne). Szczegóły: `docs/playlist-klasyczna.md`.

## Uruchomienie (po scaffoldzie)

```bash
npm install
npm run dev
```

## Contributing

To wczesny etap. Issues i PR-y mile widziane — szczególnie: nowe tematy, ścieżki SVG, timing pod konkretne nagrania, dostępność (duże przyciski, kontrast, tryb tablicy).

## Autorzy

Projekt **Aplikacja Interaktywny Muzykogram** — budowany iteracyjnie w Cursor Projects.

---

*Dzieci ruszają pałeczką. Kolor i tak wie, dokąd płynąć.*
