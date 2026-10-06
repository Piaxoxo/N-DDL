# N!DDL Website – Webdesign-Plan & Stand

**Motto:** Laut. Bunt. Leiwand.
**Qualitätsstandard:** Jede Sektion hat ihr eigenes 3D-Erlebnis auf dem Niveau des Mikro-Intros. Gesteuert wird alles übers Scrollen. Inhalte bleiben echter Text (für Google und Barrierefreiheit), und am Handy läuft eine flüssige, vereinfachte Version.

---

## 1. Seitenaufbau (One-Pager + Impressum)

| # | Sektion | 3D-Erlebnis | Inhalt (HTML) | Status |
|---|---|---|---|---|
| 1 | **Intro** `#top` | Mikro öffnet sich, spuckt N!DDL-Ballonbuchstaben + 5 Polaroids aus, Konfetti | „DREH AUF!“ → „LAUT. BUNT. LEIWAND.“ | ✅ gebaut |
| 2 | **Story** `#story` | Zeitreise-Tunnel: 9 Polaroid-Karten fliegen durch bunte Schallwellen-Ringe | 9 Kapitel von Starmania bis heute | ✅ gebaut |
| 3 | **Konzerte** `#konzerte` | Neon-Riesenrad, dreht sich beim Scrollen, jede Gondel = ein Termin (Farbe je Show) | Ticket-Karte + komplette Terminliste mit Gitarrenpedal-Filtern | ✅ gebaut |
| 4 | **Musik** `#musik` | Kassetten-Karussell mit drehenden Spulen + Regenbogen-Equalizer | „Jetzt im Tapedeck“ + alle 11 Releases | ✅ gebaut |
| 5 | **TV** `#tv` | Pinker Retro-Fernseher: Rauschen → „48er Tandler Lounge, ON AIR“ | Sendung, Sendezeit, Links zu W24 | ✅ gebaut |
| 6 | **Buchen** `#buchen` | Neon-Jukebox: Format wählen → Platte fällt ein, Taste leuchtet | 6 Formate + Anfrageformular | ✅ gebaut |
| 7 | **Zugabe** `#kontakt` | MIC DROP: Mikro fällt, prallt auf, Druckwelle, Kamerawackler, Konfetti | Socials als Buttons, Kontakt, Autogramme, Newsletter | ✅ gebaut |
| 2b | **Fotos** `#fotos` | 3D-Fotowand: alle 13 Fotos auf einem Ring, Scroll dreht, Klick öffnet Großansicht | Fotostreifen + Lightbox mit Credits | ✅ gebaut |
| – | **Impressum/Datenschutz** | – | Rechtstexte (Platzhalter markiert) | ⚠️ ausfüllen |

**Navigation:** großer **MENÜ**-Knopf (immer sichtbar) öffnet die „Setlist“ mit bunten Kacheln inkl. nächstem Konzert. Am Desktop zusätzlich Schnelllinks oben und Abschnitts-Punkte rechts, am Handy eine **Leiste unten** (Termine · Musik · Fotos · Buchen).

**Ton:** Ton-Knopf oben + „Mit Ton erleben“ im Intro. Im Intro läuft dann das **YouTube-Video „I loss mi ned vabiagn“ mit Ton** (wird beim Weiterscrollen leiser). Dazu Sound-Effekte: Mikro-Whoosh, Buchstaben-Pops, Kapitel-Swish, Riesenrad-Klick, Kassetten-Akkord, TV-Rauschen, Jukebox, Mic-Drop-Bass.

**Header-Video:** YouTube-Video läuft stumm in Endlosschleife hinter dem Mikro (bunt eingefärbt), ID in `data.js` → `headerVideo`.

**Durchgehend:** Plektrum-Cursor, magnetische Buttons, Buchstaben fliegen in Headlines ein, Laufbänder, die sich beim Scrollen verbiegen, Regenbogen-Fortschrittsbalken oben, Hintergrundfarbe wechselt fließend, optionaler Sound (Bass-Knall und Akkord), Easter Egg: **„leiwand“ tippen startet den Disco-Modus** 🪩

---

## 2. Design-System
- **Farben:** Nacht-Lila `#160A24` · Hot Pink `#FF2E88` · Electric Blue `#2E6BFF` · Sonnengelb `#FFD400` · Giftgrün `#9DFF00` · Rock-Orange `#FF6A00` · Creme `#FFF6E5`
- **Schriften:** Bowlby One (Headlines, mit Pink/Blau-Versatzschatten) · Rubik (Text) · Permanent Marker (Sprüche, Polaroid-Beschriftung)
- **Farbcode der Shows:** Tina = Pink · Tina & Elvis = Blau · Gospel = Gelb · Rock in Peace = Orange · Danzermania = Grün · Specials = Creme
- **Sprache:** Ich-Form, Wiener Schmäh, frech. Im Booking-Bereich „Sie“ (Veranstalter)

---

## 3. Technik
- Reines HTML/CSS/JS, **kein Build nötig**: `index.html`, `styles.css`, `app.js`, `data.js`, `assets/`
- 3D: **Three.js r128** (eine WebGL-Bühne, 7 Szenen, nur sichtbare werden gerechnet)
- 3D-Objekte docken an unsichtbare Platzhalter im Layout an, deshalb passen sie automatisch auf jede Bildschirmgröße
- **Termine, Songs, Booking-Texte** stehen in `data.js`. Neue Termine dort eintragen, vergangene verschwinden automatisch
- `preview.html` = alles in einer Datei, zum Anschauen/Verschicken (`python3 build-preview.py`)
- Barrierefreiheit: Tastatur-Fokus, Skip-Link, „Reduzierte Bewegung“ wird respektiert, alle Inhalte als Text

---

## 4. Bis zum Launch: To-dos
**Inhalt (Niddl)**
- [ ] **Ticket-Links** je Termin in `data.js` eintragen (aktuell Platzhalter auf niddl.com)
- [ ] **Song-Links** (Spotify/YouTube je Song) – aktuell YouTube-Suche
- [ ] **Foto-Freigaben + Credits:** SK Presseagentur / Christian Kaiser, Chaluk, Dieserstürmi, Alex List
- [ ] Impressum: vollständiger Name, Hoster
- [ ] Optional: Starmania-Foto, NYC-/Schweden-Fotos für die Story-Karten (jetzt grafische Karten)
- [ ] Optional: kurze Live-Videos → Video-Loops im Intro und in der Story

- [ ] **Header-Video:** am besten eine eigene MP4-Datei (10–20 Sek. Live-Ausschnitt) statt YouTube → lädt schneller, kein YouTube-Logo, datenschutzfreundlicher
- [ ] Optional: Hörproben (MP3, 20–30 Sek.) der Songs → spielen dann im Kassetten-Karussell

**Technik (ich)**
- [ ] YouTube nur nach Einwilligung laden (Cookie-Hinweis) – oder durch eigenes MP4 ersetzen
- [ ] Schriften lokal einbinden (DSGVO, dann kein Google Fonts)
- [ ] Three.js lokal statt CDN, Bilder zusätzlich als WebP
- [ ] Newsletter an echten Dienst anbinden (z. B. Brevo/Mailchimp), Booking-Formular optional an Formular-Dienst statt Mailprogramm
- [ ] Social-Vorschaubild (1200×630) gestalten
- [ ] Test auf echten Geräten: iPhone Safari, Android Chrome, ältere Laptops
- [ ] Hosting: Netlify/Vercel/Cloudflare Pages (statisch, kostenlos möglich) → Domain **niddl.com** umstellen (DNS bei aktuellem Anbieter)
- [ ] Weiterleitungen der alten Seiten (z. B. `/es_war_einmal/` → `/#story`)

**Ausbaustufe 2 (Ideen)**
- Verstärker-Drehknopf „bis 11“ (macht die Seite immer wilder)
- Gitarrensaiten als Trennlinien, die beim Drüberfahren schwingen
- Scroll-gesteuertes Video (Niddl dreht sich Bild für Bild)
- Jeansjacke mit 3D-Pins für die Socials
- Mini-CMS, damit Termine ohne Code gepflegt werden können
