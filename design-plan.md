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
