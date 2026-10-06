# N!DDL – Designplan: 3D-Website „DIE BÜHNE“

## Die Idee in einem Satz
**Die Website ist ein Konzert.** Du betrittst eine dunkle Bühne, die Scheinwerfer gehen an, und beim Scrollen fliegt die Kamera durch die Show: Intro, Story, Setlist, Platten, Backstage.

---

## Look & Feel
**Stimmung:** Rock'n'Roll trifft Wiener Schmäh. Dunkel, laut, glamourös. Mehr Tina-Turner-Stadion als Austropop-Wohnzimmer.

**Farben**
| Rolle | Farbe | Hex |
|---|---|---|
| Bühne / Hintergrund | Bühnenschwarz | `#0A0A0B` |
| Hauptakzent | Rock-Rot (Scheinwerfer, Buttons) | `#E10600` |
| Glamour | Tina-Gold (Glanz, Highlights) | `#F2B705` |
| Metall | Chrom (3D-Logo, Mikro) | Verlauf `#D9D9D9 → #6B6B6B` |
| Text | Off-White | `#F4F1EA` |

**Schriften**
- Headlines: breit, fett, schmal geschnitten, z. B. **Anton** oder **Bebas Neue**, in GROSSBUCHSTABEN wie auf einem Tourplakat
- Fließtext: **Inter** oder **Space Grotesk**
- Wiener Zitate: handschriftlich, z. B. **Permanent Marker**, wie mit Edding auf die Setlist gekritzelt

**Logo:** „N!DDL“ als **3D-Chrom-Schriftzug**. Das **„!“ ist ein Mikrofon** und das Markenzeichen, das überall wiederkommt: Cursor, Favicon, Ladeanimation.

---

## Die Szenen (Scroll-Reise)

### 0 – Intro / Ladebildschirm
Schwarzer Screen, Publikum rauscht leise. Ein Herzschlag-Bass baut sich auf, dann **BAM**: Scheinwerfer an, Nebel wabert, das Chrom-Logo dreht sich ins Licht.
*Optional mit Ton-Schalter (🔊 „Mit Sound rocken?“), standardmäßig stumm.*

### 1 – HERO: Die Bühne
- Echte 3D-Bühne mit Nebel, Lichtstrahlen und Partikeln (Funken / Konfetti)
- **Die Scheinwerfer folgen der Maus**, am Handy dem Neigen des Geräts
- Zentral: Niddl als **Video-Loop** (Live-Performance, freigestellt) oder großes Live-Foto mit Tiefeneffekt
- Headline knallt rein: **LAUT. LEIWAND. N!DDL.**
- Buttons: `Tickets` · `N!DDL buchen`

### 2 – STORY: „Der Weg zur leiwanden Oiden“
- Die Kamera fliegt durch eine **Wand aus Tourplakaten** (2003 → heute)
- Jedes Kapitel ist ein Plakat, das sich beim Scrollen nach vorne dreht: Starmania, New York, NoNoBand, Schweden, Danzer, Tina, 48er
- Das Danzer-Zitat erscheint in **Edding-Handschrift**, Buchstabe für Buchstabe

### 3 – KONZERTE: „Die Setlist“
- Termine als **3D-Backstage-Pässe / Konzerttickets**, die von der Decke baumeln
- Hover lässt den Pass umdrehen, hinten stehen Infos und der Ticket-Button
- Filter als **Gitarrenpedale** zum Drauftreten: Tina · Elvis · Gospel · Rock in Peace · Danzer

### 4 – MUSIK: „Die Plattenkiste“
- Releases als **Vinyl-Platten in einer Kiste**, durchblättern wie im Plattenladen
- Klick zieht die Platte raus, sie legt sich auf einen **3D-Plattenspieler** und dreht sich, dazu läuft eine Hörprobe (Spotify/YouTube-Embed)
- Partikel im Hintergrund **pulsieren zur Musik** (Audio-reaktiv)

### 5 – TV: „On Air“
- Ein **alter Röhrenfernseher** mit Rauschen. Beim Scrollen springt das Bild auf die 48er Tandler Lounge
- „ON AIR“-Leuchtschild: **Sonntags 20:30 · W24**

### 6 – BUCHEN: „Backstage“
- Die Kamera geht **durch eine Backstage-Tür** mit Stern: ★ N!DDL
- Formate als **Gig-Cases** (Flightcases), die beim Hover aufklappen: Tina Tribute · Tina & Elvis · Gospel · Special Guest · Firmen-Event · Moderation
- Anfrageformular im Look eines **Technik-Riders**

### 7 – SOCIALS & KONTAKT: „Die Zugabe“
- Social-Icons als **Bodentreter / Stompboxen** auf dem Bühnenboden. Drauftreten heißt draufklicken
  - Instagram → instagram.com/niddl
  - Facebook → facebook.com/niddlmusic
  - YouTube → youtube.com/@niddlmusic
  - Spotify → Künstlerprofil
  - Linktree → linktr.ee/niddl
- Großes Finale: Konfetti-Explosion, Logo leuchtet: **„DANKE, WIEN! ZUGABE?“** → Newsletter

---

## Wow-Effekte (Checkliste)
- [ ] Scheinwerfer, die der Maus folgen (volumetrisches Licht)
- [ ] Nebel und Funken-Partikel mit Bloom-Glow
- [ ] Chrom-Logo mit Spiegelungen, dreht sich mit
- [ ] Kamerafahrt beim Scrollen (wie ein Musikvideo-Schnitt)
- [ ] Audio-reaktive Partikel bei Hörproben
- [ ] Ticket-Pässe zum Umdrehen
- [ ] Plattenspieler mit sich drehender Vinyl
- [ ] Eigener Cursor: kleines Mikro, das bei Klick „funkt“
- [ ] Konfetti-Finale

---

## Technik
| Bereich | Werkzeug |
|---|---|
| Grundgerüst | **Next.js** (oder Astro) |
| 3D | **Three.js** über **React Three Fiber** + drei |
| Licht/Glow | postprocessing (Bloom, Chromatic Aberration, Film Grain) |
| Scroll-Kamerafahrt | **GSAP ScrollTrigger** + **Lenis** (butterweiches Scrollen) |
| 3D-Modelle | Blender → GLB (komprimiert mit Draco/KTX2) |
| Video & Bilder | Higgsfield (Video-Loops, Plakate, Texturen) + Pressefotos von Alex List |
| Hosting | Vercel |
| Termine | eigene Datenquelle (CMS oder JSON), damit Niddl sie selbst pflegen kann |

**Wichtig, damit der Wow-Effekt nicht nervt**
- **Handy:** leichtere Version mit weniger Partikeln, Video statt Echtzeit-3D wo nötig. Muss flüssig laufen.
- **Ladezeit:** Startseite in unter 3 Sekunden sichtbar, die schweren 3D-Teile laden im Hintergrund nach
- **Barrierefreiheit:** „Reduzierte Bewegung“ im Betriebssystem respektieren, alles auch ohne 3D bedienbar
- **Ton:** niemals automatisch, nur auf Klick
- **Google:** alle Texte als echter Text im Code, nicht nur im 3D-Bild

---

## Was wir von Niddl brauchen
1. **Live-Videos** (Handy reicht), am besten Tina-Show, Bewegung, Energie
2. **Hochaufgelöste Fotos**, frei oder vor dunklem Hintergrund
3. **Audio-Snippets** der Songs, je 20–30 Sek.
4. Logo-Dateien (falls vorhanden)
5. Freigabe Pressefotos (Alex List)

---

## Ablauf
1. **Moodboard + Klick-Prototyp** der Hero-Bühne → Feedback
2. Design aller Szenen
3. Bau: Hero → Konzerte → Musik → Story → Buchen → Socials
4. Testen auf Handy / Tablet / Desktop
5. Launch 🚀
