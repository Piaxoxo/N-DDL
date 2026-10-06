# N!DDL – Designplan: „TIME TO SMILE – BUNT & LAUT“

## Die Idee in einem Satz
**Ein knallbuntes Rock'n'Roll-Universum.** Pop-Art trifft Lederjacke, Wiener Prater trifft Nova Rock. Die Seite fühlt sich an wie Niddl selbst: laut, lebensfroh, verspielt und immer ein bissl frech.

---

## Look & Feel
**Stimmung:** Sticker-Bomb, Comic, Konfetti und Gitarren-Plektren. Eine Jeansjacke voller Pins, ein Backstage-Spiegel voller Aufkleber, der Prater bei Nacht.

**Farben (knallig auf dunklem Lila-Schwarz, dazwischen helle „Sonnen“-Abschnitte)**
| Rolle | Farbe | Hex |
|---|---|---|
| Hintergrund | Nacht-Lila | `#160A24` |
| Hauptfarbe | Hot Pink | `#FF2E88` |
| Power | Electric Blue | `#2E6BFF` |
| Lebensfreude | Sonnengelb | `#FFD400` |
| Frech | Giftgrün | `#9DFF00` |
| Hitze | Rock-Orange | `#FF6A00` |
| Text / helle Flächen | Creme | `#FFF6E5` |

**Schriften**
- Headlines: dick, rund und laut, z. B. **Bowlby One** oder **Rubik Mono One**, gern schräg gestellt und mit Outline-Schatten in zweiter Farbe
- Fließtext: **Space Grotesk**
- Sprüche & Wienerisch: Marker-Handschrift (**Permanent Marker**), als wär's auf die Setlist gekritzelt

**Grafische Elemente:** Blitze ⚡, Sterne ★, Herzen, Smileys (Time To Smile!), Gitarren-Plektren, Kritzeleien, Klebeband, Halbton-Raster wie im Comic.

**Logo:** „N!DDL“ als **aufgeblasene 3D-Ballonbuchstaben in Regenbogen-Chrom**. Das „!“ ist ein Blitz bzw. ein Mikrofon.

---

## Die Szenen

### 1 – HERO: Die Buchstaben-Party
- Beim Laden **fallen die riesigen 3D-Ballonbuchstaben N-!-D-D-L von oben** und hüpfen mit echter Physik auf den Boden
- Mit der Maus kann man sie **anschubsen und herumwerfen**, am Handy durch Antippen und Neigen
- Klick aufs „!“ startet eine **Konfetti-Explosion aus Plektren, Sternen und Stickern** (optional mit Gitarrenriff, nur wenn Ton an)
- Daneben ein freigestelltes Niddl-Foto mit Sticker-Rahmen und Kritzel-Pfeil: *„des bin i!“*
- Headline: **LAUT. BUNT. LEIWAND.**

### 2 – STORY: Das Sticker-Tagebuch
- Ein **3D-Scrapbook**, dessen Seiten sich beim Scrollen umblättern
- Jedes Kapitel ist eine bunte Collage aus ausgeschnittenen Fotos, Konzertkarten, Kritzeleien und Klebeband: Starmania → New York → NoNoBand → Schweden → Danzer → Tina → 48er → heute
- Sticker „poppen“ beim Erscheinen auf und wackeln leicht

### 3 – KONZERTE: Das Rock-Riesenrad 🎡
- Das **Wiener Riesenrad in Neonfarben**, jede Gondel ist ein Konzert
- **Beim Scrollen dreht sich das Rad**, die nächste Gondel leuchtet auf
- Klick auf eine Gondel zoomt hinein, dort warten Datum, Ort und Ticket-Button
- Die Gondeln haben die Farben der Show: **Tina = Pink, Elvis = Blau, Gospel = Gelb, Rock in Peace = Orange, Danzer = Grün**

### 4 – MUSIK: Die Mixtape-Wand 📼
- Die Releases sind **bunte Kassetten und Vinyls** in Bonbonfarben
- Klick schiebt die Kassette in einen **3D-Ghettoblaster**, die **Lautsprecher pumpen** im Takt und die Equalizer-Balken tanzen in Regenbogenfarben
- Daneben laufen Spotify bzw. YouTube

### 5 – TV: „On Air“
- **Retro-Fernseher in Pink** mit Glitch-Effekt, der auf die 48er Tandler Lounge springt
- Leuchtschild: **SONNTAGS 20:30 · W24**

### 6 – BUCHEN: Die Wunsch-Jukebox
- Eine **3D-Jukebox mit Neonröhren**. Jede Taste ist ein Format: Tina Tribute · Tina & Elvis · Gospel · Special Guest · Firmen-Event · Moderation
- Tastendruck lässt die Jukebox aufleuchten und die passende Platte fällt rein, darunter erscheint das Anfrageformular

### 7 – SOCIALS: Die Jeansjacke 🧷
- Eine **3D-Jeansjacke voller Pins und Buttons**, jeder Pin ist ein Social-Link
  - Instagram (@niddl) · Facebook (niddlmusic) · YouTube (@niddlmusic) · Spotify · Linktree
- Die Jacke dreht sich mit der Maus, und die Pins glänzen, wenn man drüberfährt

### 8 – FINALE
- Großer Smiley-Sticker, Konfetti-Regen: **„IT'S TIME TO SMILE!“** → Newsletter-Anmeldung

---

## Wow-Effekte
- [ ] Ballonbuchstaben mit Physik zum Herumwerfen
- [ ] Konfetti-Explosionen aus Plektren und Stickern
- [ ] Scrapbook, das sich in 3D umblättert
- [ ] Neon-Riesenrad, das sich beim Scrollen dreht
- [ ] Ghettoblaster mit pumpenden Boxen zur Musik
- [ ] Jukebox zum Drücken
- [ ] Jeansjacke mit glänzenden Social-Pins
- [ ] Eigener Cursor: kleines buntes Plektrum, das Funken hinterlässt
- [ ] Jede Sektion hat ihre eigene Hauptfarbe, der Hintergrund wechselt beim Scrollen fließend

---

## Technik
| Bereich | Werkzeug |
|---|---|
| Grundgerüst | Next.js |
| 3D | Three.js über React Three Fiber |
| Physik (Ballonbuchstaben) | Rapier |
| Scroll-Animation | GSAP ScrollTrigger + Lenis |
| Modelle | Blender → komprimierte GLB-Dateien |
| Bilder/Videos | Higgsfield (Sticker, Collagen, Video-Loops) + Fotos von Alex List |
| Hosting | Vercel |

**Damit's trotzdem flott ist:** Am Handy gibt es eine leichtere Version, die Startseite steht in unter 3 Sekunden, Ton kommt nur auf Klick, und alle Texte stehen als echter Text auf der Seite (für Google).

---

## Was wir von Niddl brauchen
1. Fotos in hoher Auflösung, am besten bunt und bewegt (lachen, springen, Bühne)
2. Kurze Live- oder Handyvideos
3. Hörproben der Songs (20–30 Sek.)
4. Persönliche Kleinigkeiten zum Einscannen: alte Konzertkarten, Setlists, Fotos von Starmania, Sticker. Das kommt alles ins Scrapbook!

---

# 🏆 3D- & Scroll-Effekte (Award-Niveau)

**Roter Faden: Die Seite beginnt mit einem Mikrofon, das sich öffnet, und endet mit einem Mic-Drop.**

## Die Scroll-Reise
| # | Moment | Was passiert beim Scrollen |
|---|---|---|
| 0 | **Preloader: VU-Meter** | Ein bunter Pegel-Zeiger zählt 0→100 %, knallt in den roten Bereich, dann eine Konfetti-Explosion und die Seite ist da |
| 1 | **Das Mikrofon öffnet sich** (Signature-Effekt) | Riesiges 3D-Mikro in Candy-Chrom dreht sich. Beim Scrollen **zerlegt es sich in Einzelteile** (Explosionsansicht): Gitterkorb klappt auf, Kapsel, Ringe und Schrauben schweben auseinander. Aus dem Inneren platzen die **Ballonbuchstaben N!DDL** heraus |
| 2 | **Flug ins Mikro** | Die Kamera fliegt **durch das Mikrofongitter** in einen **Tunnel aus bunten Schallwellen-Ringen**, das ist der Übergang in die Story |
| 3 | **Das Kassettenband** | Eine Kassette spult sich ab: Das **Tonband wird zur Zeitleiste**, die sich durch die ganze Story-Seite schlängelt und Kapitel für Kapitel verbindet |
| 4 | **Polaroid-Regen** | Fotos aus jedem Lebensabschnitt **fallen mit Physik** herunter, stapeln sich und lassen sich mit der Maus herumwerfen |
| 5 | **Sticker abziehen** | Sticker auf den Kapiteln **rollen sich beim Drüberfahren in 3D ab** und zeigen darunter ein Foto oder einen Fun Fact |
| 6 | **Scroll-Video** | Ein Niddl-Video (Drehung, Sprung, Lachen) läuft **Bild für Bild mit dem Scrollen** vor und zurück, wie bei Apple-Produktseiten |
| 7 | **Riesenrad** | Die Sektion bleibt stehen, Scrollen **dreht das Neon-Riesenrad**, jede Gondel ist ein Konzert |
| 8 | **Ticket abreißen** | Ein Klick auf eine Gondel lässt ein **3D-Ticket herausfallen**, das man entlang der Perforation abreißt und damit zum Ticketkauf kommt |
| 9 | **Vinyl-Scratch** | In der Musik-Sektion **dreht sich die Platte mit dem Scrollen**. Scrollt man zurück, „scratcht“ sie (mit Ton, falls an) |
| 10 | **Bass-Lautsprecher** | Die Membran **wölbt sich je nach Scroll-Tempo**. Bei jedem Sektionswechsel geht eine **Druckwelle** durchs Bild und verzerrt es kurz |
| 11 | **Verstärker „bis 11“** | Ein Amp-Drehknopf, den man aufdreht: Je weiter, desto **bunter, lauter und wilder wird die ganze Seite** (mehr Farbe, mehr Partikel, Ton an). Bei 11 gibt's Disco-Modus |
| 12 | **Jeansjacke** | Die Jacke dreht sich mit dem Scroll, die Pins blitzen nacheinander auf |
| 13 | **MIC DROP** (Finale) | Ganz unten **fällt das Mikro vom Himmel**, prallt auf, Kamerawackler, **BOOM**, Konfetti und „DANKE! ZUGABE?“ |

## Durchgehende Effekte
- **Gitarrensaiten als Trennlinien:** Zwischen den Sektionen sind Saiten gespannt. Fährt man mit der Maus drüber, **schwingen sie** (und klingen, falls Ton an)
- **Flüssiger Farbverlauf (Shader)** im Hintergrund, der beim Scrollen von Pink → Blau → Gelb → Grün → Orange morpht
- **Kinetische Typo:** Headlines zerfallen in Einzelbuchstaben und fliegen rein. Die Schrift wird **dicker, je schneller man scrollt**
- **Laufband** „LAUT • BUNT • LEIWAND • TIME TO SMILE“, das sich je nach Scroll-Tempo **verbiegt und neigt**
- **Foto-Hover:** RGB-Split / Flüssig-Verzerrung, wie ein glitchendes Musikvideo
- **Magnetische Buttons**, die sich zum Cursor ziehen
- **Plektrum-Cursor** mit bunter Funkenspur
- **Seitenwechsel:** ein bunter Farbspritzer wischt über den Bildschirm
- **Easter Egg:** Wer auf der Tastatur **„leiwand“** tippt, startet den Disco-Modus (Discokugel, Lichtpunkte, alles tanzt)

## Technik dahinter
- **React Three Fiber + Three.js** für alle 3D-Objekte, **eigene Shader** für Farbverlauf, Druckwelle und Glitch
- **GSAP ScrollTrigger** (scrub/pin) + **Lenis** für butterweiches Scrollen
- **Theatre.js** für die Kamerafahrten (wie ein Filmschnitt choreografiert)
- **Rapier** für Physik (Ballonbuchstaben, Polaroids, Mic-Drop)
- **Blender** für Mikro, Riesenrad, Kassette, Amp, Jacke (als komprimierte GLB-Dateien)
- **Handy:** gleiche Story mit vereinfachten Effekten. **„Reduzierte Bewegung“** wird respektiert. **Ton** nur auf Wunsch
