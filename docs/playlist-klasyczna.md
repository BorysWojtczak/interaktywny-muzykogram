# Playlista klasyczna — Interaktywny Muzykogram

Kuratorska lista ~20 pogodnych, dobrze znanych utworów klasycznych pod tablice tematyczne. Energia: radosna, wznosząca, przyjazna dzieciom. Preferowane utwory z repertuaru edukacyjnego; kompozycje w domenie publicznej (autorzy zmarli ponad 70 lat temu).

## Zasada licencyjna (skrót)

| Warstwa | Status typowy |
| --- | --- |
| **Kompozycja / partytura** | Domena publiczna dla klasycznego kanonu poniżej |
| **Nagranie audio** | Osobne prawa — potrzebna własna produkcja, nagranie CC0/CC-BY, lub licencja edukacyjna (np. Musopen, Internet Archive, własne studio) |
| **Aranżacja współczesna** | Może być chroniona nawet przy starej melodii |

W aplikacji prototypowej wystarczy placeholder HTML5 audio; przed produkcją trzeba dobrać konkretne pliki nagrań i zapisać źródło licencji przy każdym temacie.

---

## Lista utworów (20)

| # | Kompozytor | Utwór | Sugerowany nastrój / temat | Licencja |
| --- | --- | --- | --- | --- |
| 1 | Antonio Vivaldi | *Le quattro stagioni* — „Wiosna”, RV 269, Allegro | Ogród / ptaki / zielony szlaczek | Kompozycja PD; nagranie osobno |
| 2 | Georg Friedrich Händel | *Water Music* — Allegro / Hornpipe (Suites in F/D) | Rzeka / fala / błękit | Kompozycja PD; nagranie osobno |
| 3 | Johann Sebastian Bach | Brandenburg Concerto No. 3, BWV 1048 — Allegro | Warsztat / koła zębate / geometryczne spirale | Kompozycja PD; nagranie osobno |
| 4 | Johann Pachelbel | Canon in D | Mosty / łuki / spokojny marsz kolorów | Kompozycja PD; nagranie osobno |
| 5 | Wolfgang Amadeus Mozart | *Eine kleine Nachtmusik*, K. 525 — Allegro | Gwiazdy / nocny spacer / złote linie | Kompozycja PD; nagranie osobno |
| 6 | Wolfgang Amadeus Mozart | Sonata A-dur, K. 331 — Rondo *Alla Turca* | Parade / bębenki / zygzaki | Kompozycja PD; nagranie osobno |
| 7 | Joseph Haydn | Symphony No. 94 „Surprise” — Allegro molto / Andante | Niespodzianka / skoki / kropki | Kompozycja PD; nagranie osobno |
| 8 | Ludwig van Beethoven | Symphony No. 9 — temat „Ody do radości” (Arr. fortepianowy / orkiestrowy) | Radość / słońce / wielkie łuki | Kompozycja PD; nagranie osobno |
| 9 | Ludwig van Beethoven | Symphony No. 6 „Pastoralna” — I Allegro ma non troppo | Łąka / wiatr / miękkie fale | Kompozycja PD; nagranie osobno |
| 10 | Gioachino Rossini | *Guillaume Tell* — Overture (finał „galop”) | Galop / konie / szybkie szlaczki | Kompozycja PD; nagranie osobno |
| 11 | Jacques Offenbach | *Orphée aux enfers* — Galop infernal („Can-Can”) | Cyrk / kabaret / skaczące paski | Kompozycja PD; nagranie osobno |
| 12 | Johann Strauss II | *An der schönen blauen Donau*, Op. 314 | Wir / walc / wstążki | Kompozycja PD; nagranie osobno |
| 13 | Johannes Brahms | Hungarian Dance No. 5 | Taniec / ognisko / ostre zakręty | Kompozycja PD; nagranie osobno |
| 14 | Camille Saint-Saëns | *Le Carnaval des animaux* — „Aquarium” | Akwarium / bańki / płynne krzywizny | Kompozycja PD; nagranie osobno |
| 15 | Camille Saint-Saëns | *Le Carnaval des animaux* — „Finale” | Zoo / parade zwierząt / kolorowe paski | Kompozycja PD; nagranie osobno |
| 16 | Edvard Grieg | *Peer Gynt* — „Morgenstemning” (Morning Mood) | Poranek / góry / wschodzące łuki | Kompozycja PD; nagranie osobno |
| 17 | Nikolai Rimsky-Korsakov | *Flight of the Bumblebee* | Pszczoła / wir / szybkie zygzaki | Kompozycja PD; nagranie osobno |
| 18 | Pyotr Ilyich Tchaikovsky | *The Nutcracker* — „Trepek” (Russian Dance) | Balet / śnieg / skoki | Kompozycja PD; nagranie osobno |
| 19 | Pyotr Ilyich Tchaikovsky | *The Nutcracker* — „Waltz of the Flowers” | Ogród kwiatów / walc / płatki | Kompozycja PD; nagranie osobno |
| 20 | Robert Schumann | *Album für die Jugend*, Op. 68 — „Fröhlicher Landmann” (The Happy Farmer) | Farma / droga do domu / proste ścieżki | Kompozycja PD; nagranie osobno |

### Rezerwa (zamienniki, gdy potrzeba krótszego / spokojniejszego tempa)

- Bach — Minuet in G major, BWV Anh. 114 (*Notebook for Anna Magdalena*) — ogród / menuet
- Tchaikovsky — *Children’s Album*, Op. 39 — „Polka” / „Kamarinskaya”
- Prokofiev — *Music for Children*, Op. 65 — „Marche” / „Tarantelle” (uwaga: status PD zależy od jurysdykcji; w UE zwykle PD od 2024)
- Mozart — Overture do *Le nozze di Figaro*
- Sousa — *The Stars and Stripes Forever* (marsz; USA PD dla kompozycji sprzed 1929 — sprawdzić lokalnie)

---

## Mapowanie na prototyp

Pierwszy demo board w aplikacji: **„Poranek w ogrodzie”** — Grieg *Morning Mood* + Vivaldi *Spring* jako kandydaci audio. W UI placeholder audio; animacja fill idzie po własnym tempie (illusion of control).

## Następne kroki audio

1. Wybrać 1 nagranie CC0/CC-BY na temat (np. Musopen / IMSLP-linked recordings / własne).
2. Znormalizować głośność i przyciąć ciszę początkową.
3. Zapisać `durationSec` + opcjonalne cue points (frazy) w metadanych tematu.
4. Nigdy nie bundlować komercyjnych nagrań bez licencji.
