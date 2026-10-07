/* N!DDL – Website-Motor: UI-Interaktionen + eine WebGL-Bühne mit sieben Szenen. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) doc.classList.add("reduce");
  var DATA = window.NIDDL_DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function seg(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function back(t) { var c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  function asset(p) { return (window.NIDDL_ASSETS && window.NIDDL_ASSETS[p]) || p; }
  var T = window.T || function (x) { return x; }, EN = window.NIDDL_LANG === "en";
  var MONTHS = window.NIDDL_MONTHS || ["JÄN", "FEB", "MÄR", "APR", "MAI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"];

  /* ================= UI ================= */
  // split headlines into letters for the fly-in
  $$("[data-split]").forEach(function (el) {
    var html = el.innerHTML.split(/(<br\s*\/?>)/i).map(function (part) {
      if (/^<br/i.test(part)) return part;
      var n = 0;
      return part.split(" ").map(function (w) {
        return '<span class="w">' + w.split("").map(function (c) {
          return '<span class="ch" style="transition-delay:' + (n++ * 0.03).toFixed(2) + 's">' + c + "</span>";
        }).join("") + "</span>";
      }).join(" ");
    }).join("");
    el.setAttribute("aria-label", el.textContent);
    el.innerHTML = html;
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.3 });
  $$("[data-split]").forEach(function (el) { io.observe(el); });

  // nav
  var nav = $("#nav"), burger = $("#burger"), menu = $("#menu");
  function setMenu(o) {
    burger.setAttribute("aria-expanded", o); document.body.classList.toggle("menu-open", o);
    if (o) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add("open"); }); var f = $(".tiles a", menu); f && f.focus({ preventScroll: true }); whoosh(0.5); }
    else { menu.classList.remove("open"); setTimeout(function () { if (!menu.classList.contains("open")) menu.hidden = true; }, 250); }
  }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  addEventListener("keydown", function (e) { if (e.key === "Escape") { if (!menu.hidden) setMenu(false); if (!lb.hidden) closeLb(); } });

  // Farbspritzer-Übergang für Sprünge innerhalb der Seite
  var wipe = $("#wipe"), wiping = false;
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || reduce || wiping) return;
    var id = a.getAttribute("href"); if (id.length < 2) return;
    var target = document.querySelector(id); if (!target) return;
    e.preventDefault(); wiping = true;
    wipe.style.setProperty("--wx", e.clientX + "px"); wipe.style.setProperty("--wy", e.clientY + "px");
    wipe.classList.remove("out"); wipe.classList.add("on");
    setTimeout(function () {
      var top = id === "#top" ? 0 : target.getBoundingClientRect().top + scrollY - (parseInt(getComputedStyle(doc).scrollPaddingTop) || 0);
      doc.style.scrollBehavior = "auto"; scrollTo(0, top); doc.style.scrollBehavior = "";
      history.replaceState(null, "", id);
      wipe.style.setProperty("--ox", (innerWidth - e.clientX) + "px"); wipe.style.setProperty("--oy", (innerHeight - e.clientY) + "px");
      wipe.classList.add("out"); wipe.classList.remove("on");
      setTimeout(function () { wipe.classList.remove("out"); wiping = false; }, 700);
    }, 620);
  });

  // Website-Credit
  (function () {
    var cr = DATA.credit || {}; if (!cr.name) return;
    $$(".bandita-link").forEach(function (a) { if (cr.url) a.href = cr.url; else a.removeAttribute("href"); $("b", a).textContent = cr.name; });
    if (cr.url) {
      var ld = document.createElement("script"); ld.type = "application/ld+json";
      ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", "name": "N!DDL", "url": "https://www.niddl.com", "inLanguage": ["de", "en"], "creator": { "@type": "Organization", "name": cr.name, "url": cr.url } });
      document.head.appendChild(ld);
    }
  })();

  // magnetic buttons
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    $$(".magnet").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  // story chapters
  var chapters = $$("#chapters li"), dots = $("#storyDots");
  var chColors = ["var(--pink)", "var(--blue)", "var(--orange)", "var(--lime)", "var(--sun)", "var(--pink)", "var(--orange)", "var(--lime)", "var(--sun)"];
  chapters.forEach(function (li, i) { li.style.setProperty("--c", chColors[i % chColors.length]); dots.appendChild(document.createElement("i")); });
  var dotEls = $$("i", dots), curChapter = -1;
  function setChapter(i) {
    if (i === curChapter) return; if (curChapter >= 0) whoosh(0.45, true); curChapter = i;
    chapters.forEach(function (li, k) { li.classList.toggle("on", k === i); });
    dotEls.forEach(function (d, k) { d.classList.toggle("on", k === i); });
  }
  setChapter(0);

  // gigs
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var gigs = DATA.gigs.filter(function (g) { return new Date(g.date + "T23:59:00") >= today; });
  if (!gigs.length) gigs = DATA.gigs.slice(-1);
  function fmtDate(d) { var x = new Date(d + "T12:00:00"), dd = ("0" + x.getDate()).slice(-2); return { day: dd, mon: MONTHS[x.getMonth()], full: EN ? dd + " " + MONTHS[x.getMonth()].charAt(0) + MONTHS[x.getMonth()].slice(1).toLowerCase() + " " + x.getFullYear() : dd + "." + ("0" + (x.getMonth() + 1)).slice(-2) + "." + x.getFullYear() }; }
  (function () { var g = gigs[0], d = fmtDate(g.date); $("#menuNext").textContent = T("Als Nächstes") + ": " + d.full + " · " + T(g.title).replace(/^N!DDL\s*[–@-]?\s*/, "") + " · " + T(g.place); })();
  var gigList = $("#gigList");
  function renderGigs(f) {
    gigList.innerHTML = gigs.filter(function (g) { return f === "all" || g.type === f; }).map(function (g) {
      var d = fmtDate(g.date), t = DATA.types[g.type];
      return '<li style="--c:' + t.color + '"><time datetime="' + g.date + '">' + d.full + '</time><div><div class="t">' + T(g.title) + '</div><div class="p">' + T(g.place) + (g.time ? " · " + T(g.time) : "") + "</div></div>" +
        (g.soldout ? '<span class="sold">' + T("Ausverkauft") + '</span>' : g.ticket ? '<a class="btn small" href="' + g.ticket + '" target="_blank" rel="noopener">' + T(g.ticketLabel || "Tickets") + "</a>" : '<span class="soon">' + T("Infos folgen") + '</span>') + "</li>";
    }).join("") || "<li>" + T("Grad nix in der Kategorie. Bald wieder!") + "</li>";
  }
  renderGigs("all");
  $$("#filters .pedal").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("#filters .pedal").forEach(function (x) { x.classList.toggle("on", x === b); });
      renderGigs(b.dataset.f);
    });
  });
  var gigCard = $("#gigCard"), curGig = -1;
  function setGig(i) {
    if (i === curGig) return; if (curGig >= 0) { tick(1); pop(1.5); } curGig = i;
    var g = gigs[i], d = fmtDate(g.date), t = DATA.types[g.type];
    $("#gigDay").textContent = d.day; $("#gigMonth").textContent = d.mon + " " + g.date.slice(2, 4);
    $("#gigTag").textContent = T(t.label); $("#gigTitle").textContent = T(g.title);
    $("#gigPlace").textContent = T(g.place) + (g.time ? " · " + T(g.time) : "");
    var l = $("#gigLink"); if (g.ticket && !g.soldout) { l.hidden = false; l.href = g.ticket; l.textContent = T(g.ticketLabel || "Tickets"); } else { l.hidden = true; }
    $("#gigSold").hidden = !g.soldout;
    gigCard.style.setProperty("--gc", t.color);
    gigCard.classList.remove("flash"); void gigCard.offsetWidth; gigCard.classList.add("flash");
  }
  setGig(0);

  // releases
  var tapeCols = ["#FF2E88", "#2E6BFF", "#FFD400", "#9DFF00", "#FF6A00"];
  $("#releases").innerHTML = DATA.releases.map(function (r, i) {
    var q = encodeURIComponent("Niddl " + r.title);
    return '<li style="--c:' + tapeCols[i % 5] + '"><span class="dot" aria-hidden="true"></span><span class="info"><b>' + r.title + "</b><small>" + T(r.sub) + '</small></span><a class="yt" href="https://www.youtube.com/results?search_query=' + q + '" target="_blank" rel="noopener" aria-label="' + T(r.title + " auf YouTube") + '">YouTube ↗</a></li>';
  }).join("");
  var curTape = -1;
  function setTape(i) {
    if (i === curTape) return; if (curTape >= 0) { tick(0.8); chord(196 * Math.pow(2, (i % 7) / 12)); } curTape = i;
    $("#tapeTitle").textContent = DATA.releases[i].title; $("#tapeSub").textContent = T(DATA.releases[i].sub);
    $(".now-playing").style.setProperty("--tc", tapeCols[i % 5]);
  }
  setTape(0);

  // photos: thumbnails + lightbox
  var PH = DATA.photos, lb = $("#lightbox"), lbIdx = 0, lastFocus = null;
  var phCols = ["var(--pink)", "var(--blue)", "var(--sun)", "var(--lime)", "var(--orange)"];
  function showLb(i) {
    lbIdx = (i + PH.length) % PH.length; var p = PH[lbIdx];
    $("#lbImg").src = asset("assets/img/full/" + p.file + ".jpg"); $("#lbImg").alt = T(p.cap); $("#lbCap").textContent = T(p.cap); $("#lbCredit").textContent = p.credit || "";
  }
  function openLb(i) { lastFocus = document.activeElement; showLb(i); lb.hidden = false; document.body.classList.add("menu-open"); $("#lbClose").focus(); pop(1.4); whoosh(0.4, true); }
  function closeLb() { lb.hidden = true; document.body.classList.remove("menu-open"); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", function () { showLb(lbIdx - 1); tick(); });
  $("#lbNext").addEventListener("click", function () { showLb(lbIdx + 1); tick(); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  addEventListener("keydown", function (e) { if (lb.hidden) return; if (e.key === "ArrowLeft") showLb(lbIdx - 1); if (e.key === "ArrowRight") showLb(lbIdx + 1); });

  // booking formats + forms
  var fmtIdx = 0, fmtChanged = 0;
  $$("#formats .fmt").forEach(function (b) {
    b.addEventListener("click", function () {
      fmtIdx = +b.dataset.i; fmtChanged = performance.now();
      $$("#formats .fmt").forEach(function (x) { var on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-checked", on); });
      $("#fmtDesc").textContent = T(DATA.formats[fmtIdx]);
      click();
    });
  });
  $("#bookForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var fmt = $$("#formats .fmt")[fmtIdx].textContent.replace(/^\w\d\s*/, "");
    var body = EN ? "Hi N!DDL,\n\nI'd like to make a booking request:\n\nFormat: " + fmt + "\nDate: " + ($("#fDate").value || "-") + "\nLocation: " + ($("#fPlace").value || "-") +
      "\n\n" + ($("#fMsg").value || "") + "\n\nBest regards\n" + $("#fName").value + "\n" + $("#fMail").value
      : "Hallo N!DDL,\n\nich möchte gern anfragen:\n\nFormat: " + fmt + "\nDatum: " + ($("#fDate").value || "-") + "\nOrt: " + ($("#fPlace").value || "-") +
      "\n\n" + ($("#fMsg").value || "") + "\n\nViele Grüße\n" + $("#fName").value + "\n" + $("#fMail").value;
    location.href = "mailto:office@niddl.com?subject=" + encodeURIComponent((EN ? "Booking request: " : "Booking-Anfrage: ") + fmt) + "&body=" + encodeURIComponent(body);
    $("#formNote").textContent = T("Danke! Falls sich kein Mailprogramm öffnet: einfach an office@niddl.com schreiben.");
  });
  $("#newsForm").addEventListener("submit", function (e) {
    e.preventDefault();
    location.href = "mailto:office@niddl.com?subject=" + encodeURIComponent(EN ? "Newsletter sign-up" : "Newsletter-Anmeldung") + "&body=" + encodeURIComponent((EN ? "Please add me to the newsletter: " : "Bitte nehmt mich in den Newsletter auf: ") + $("#nMail").value);
    $("#newsNote").textContent = T("Leiwand! Bitte die vorbereitete Mail noch abschicken.");
  });

  // sound
  var soundOn = false, actx = null, master = null, noiseBuf = null;
  function ac() {
    try {
      if (!actx) { actx = new (window.AudioContext || window.webkitAudioContext)(); master = actx.createGain(); master.gain.value = 0.8; master.connect(actx.destination);
        noiseBuf = actx.createBuffer(1, actx.sampleRate, actx.sampleRate); var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    } catch (e) { } return actx;
  }
  var soundBtn = $("#sound"), heroBtn = $("#soundHero");
  var langBtn = $("#langBtn");
  if (langBtn) { langBtn.textContent = EN ? "DE" : "EN"; langBtn.setAttribute("lang", EN ? "de" : "en"); langBtn.addEventListener("click", function () { window.setLang && window.setLang(EN ? "de" : "en"); }); }
  function setSound(on) {
    soundOn = on; soundBtn.setAttribute("aria-pressed", on); $(".lbl", soundBtn).textContent = on ? (DATA.soundtrack ? "♪ I loss mi ned vabiagn" : T("Soundtrack an")) : T("Ton aus");
    heroBtn.textContent = on ? T("🔇 Ton aus") : T("🔊 Mit Ton erleben");
    if (on && ac()) { actx.resume(); pop(1.2); if (window.NiddlSoundtrack) NiddlSoundtrack.start(actx, master, DATA.soundtrack ? asset(DATA.soundtrack) : ""); }
    if (!on && window.NiddlSoundtrack) NiddlSoundtrack.stop();
  }
  soundBtn.addEventListener("click", function () { setSound(!soundOn); });
  heroBtn.addEventListener("click", function () { setSound(!soundOn); });
  function out() { return master || actx.destination; }
  function env(g, t, a, peak, dec) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); }
  function whoosh(len, up) {
    if (!soundOn || !ac()) return; len = len || 0.6;
    var t = actx.currentTime, src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    src.buffer = noiseBuf; f.type = "bandpass"; f.Q.value = 1.2;
    f.frequency.setValueAtTime(up ? 300 : 2400, t); f.frequency.exponentialRampToValueAtTime(up ? 3200 : 260, t + len);
    env(g, t, len * 0.4, 0.35, len * 0.6); src.connect(f).connect(g).connect(out()); src.start(t); src.stop(t + len + 0.05);
  }
  function pop(pitch) {
    if (!soundOn || !ac()) return; pitch = pitch || 1;
    var t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain(); o.type = "triangle";
    o.frequency.setValueAtTime(420 * pitch, t); o.frequency.exponentialRampToValueAtTime(900 * pitch, t + 0.08);
    env(g, t, 0.005, 0.25, 0.15); o.connect(g).connect(out()); o.start(t); o.stop(t + 0.2);
  }
  function tick(pitch) {
    if (!soundOn || !ac()) return;
    var t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain(); o.type = "square"; o.frequency.value = 1400 * (pitch || 1);
    env(g, t, 0.002, 0.07, 0.05); o.connect(g).connect(out()); o.start(t); o.stop(t + 0.08);
  }
  function chord(root) {
    if (!soundOn || !ac()) return; var t = actx.currentTime;
    [1, 1.26, 1.5, 2].forEach(function (m, i) { var o = actx.createOscillator(), g = actx.createGain(), f = actx.createBiquadFilter(); o.type = "sawtooth"; o.frequency.value = root * m; f.type = "lowpass"; f.frequency.value = 1800;
      env(g, t + i * 0.03, 0.02, 0.05, 0.9); o.connect(f).connect(g).connect(out()); o.start(t + i * 0.03); o.stop(t + 1.1); });
  }
  var staticSrc = null, staticGain = null;
  function staticLevel(v) {
    if (!soundOn || !ac()) { if (staticGain) staticGain.gain.value = 0; return; }
    if (!staticSrc) { staticSrc = actx.createBufferSource(); staticSrc.buffer = noiseBuf; staticSrc.loop = true; var f = actx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 1500; staticGain = actx.createGain(); staticGain.gain.value = 0; staticSrc.connect(f).connect(staticGain).connect(out()); staticSrc.start(); }
    staticGain.gain.setTargetAtTime(v * 0.12, actx.currentTime, 0.05);
  }

  var heroVideo = $("#heroVideo");
  function boom() {
    if (!soundOn || !ac()) return;
    var t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.35);
    g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5); o.connect(g).connect(out()); o.start(t); o.stop(t + 0.5);
    [329.6, 415.3, 493.9, 659.3].forEach(function (f, i) {
      var oo = actx.createOscillator(), gg = actx.createGain(); oo.type = "sawtooth"; oo.frequency.value = f;
      gg.gain.setValueAtTime(0, t + 0.04 * i); gg.gain.linearRampToValueAtTime(0.05, t + 0.04 * i + 0.02); gg.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      oo.connect(gg).connect(out()); oo.start(t + 0.04 * i); oo.stop(t + 1.3);
    });
  }
  function click() { tick(0.6); pop(0.8); }

  // easter egg: type "leiwand"
  var keys = "", disco = false;
  addEventListener("keydown", function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    keys = (keys + (e.key || "")).slice(-7).toLowerCase();
    if (keys === "leiwand") { disco = !disco; doc.classList.toggle("disco", disco); keys = ""; if (disco) { burst && burst(null); boom(); } }
  });

  /* ================= 3D ================= */
  var burst = null;
  var sections = {
    hero: $("#top"), story: $("#story"), photos: $("#fotos"), wheel: $("#konzerte"), tapes: $("#musik"), tv: $("#tv"), juke: $("#buchen"), finale: $("#kontakt")
  };
  var musicOutro = false;
  var glowEl = $("#glow"), marquees = $$(".marquee"), lastY = scrollY, vel = 0, lastSec = "";
  var dotLinks = $$("#dots a").concat($$(".dock a"));
  var hues = [[255, 46, 136], [46, 107, 255], [255, 212, 0], [157, 255, 0], [255, 106, 0], [255, 46, 136]];
  function chrome2d() {
    var max = doc.scrollHeight - innerHeight, gp = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
    doc.style.setProperty("--p", gp.toFixed(4));
    var dy = scrollY - lastY; lastY = scrollY; vel += (dy - vel) * 0.2;
    var sk = clamp(-vel * 0.25, -12, 12).toFixed(2) + "deg";
    marquees.forEach(function (m) { m.style.setProperty("--skew", sk); });
    nav.classList.toggle("solid", scrollY > 40);
    var mid = innerHeight * 0.45, curSec = "top";
    $$("main > section[id]").forEach(function (el) { if (el.getBoundingClientRect().top <= mid) curSec = el.id; });
    if (curSec !== lastSec) { lastSec = curSec; dotLinks.forEach(function (a) { var on = a.getAttribute("href") === "#" + curSec || (curSec === "top" && a.dataset.s === "top"); a.classList.toggle("on", on); }); }
    var hs = secState(sections.hero), hp = hs.p, hv = clamp(hs.r.bottom / innerHeight, 0, 1);
    heroVideo.style.setProperty("--hv", ((1 - seg(hp, 0.04, 0.42) * 0.8) * hv).toFixed(3));
    if (soundOn && window.NiddlSoundtrack) {
      var mus = curSec === "top" ? (hp < 0.12 ? "intro" : "top") : curSec;
      if (curSec === "kontakt" && musicOutro) mus = "outro";
      NiddlSoundtrack.section(mus);
    }
    var hi = gp * (hues.length - 1), a = hues[Math.floor(hi)], b = hues[Math.min(hues.length - 1, Math.floor(hi) + 1)], f = hi - Math.floor(hi);
    var cc = a.map(function (v, i) { return Math.round(v + (b[i] - v) * f); }).join(",");
    glowEl.style.background = "radial-gradient(60% 50% at 60% 42%, rgba(" + cc + ",0.30), rgba(22,10,36,0) 70%), radial-gradient(45% 45% at 10% 95%, rgba(46,107,255,0.16), rgba(22,10,36,0) 70%)";
    return gp;
  }
  function secState(el) {
    var r = el.getBoundingClientRect(), H = innerHeight, span = r.height - H;
    return { r: r, p: span > 0 ? clamp(-r.top / span, 0, 1) : clamp((H - r.top) / (H + r.height), 0, 1), vis: clamp((Math.min(r.bottom, H) - Math.max(r.top, 0)) / H, 0, 1) };
  }

  if (!window.THREE) { // no WebGL library: plain but complete page
    (function loop() { chrome2d(); var st = secState(sections.story); setChapter(Math.round(st.p * (chapters.length - 1)));
      setGig(Math.round(secState(sections.wheel).p * (gigs.length - 1))); setTape(Math.round(secState(sections.tapes).p * (DATA.releases.length - 1))); requestAnimationFrame(loop); })();
    return;
  }

  var C = { pink: 0xFF2E88, blue: 0x2E6BFF, sun: 0xFFD400, lime: 0x9DFF00, orange: 0xFF6A00, cream: 0xFFF6E5, night: 0x160A24 };
  var PAL = [C.pink, C.blue, C.sun, C.lime, C.orange];
  var canvas = $("#stage");
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" }); }
  catch (e) { canvas.remove(); return; }
  var mobile = Math.min(innerWidth, innerHeight) < 700;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.setClearColor(0, 0);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);
  var composer = null, bloom = null, finalPass = null;
  /* Leuchtendes addiert nur Farbe, schreibt aber keine Deckkraft – so bleibt die Seite dahinter (Foto-Show, Farbverlauf) sichtbar */
  function glowBlend(m) {
    if (!m) return m;
    m.blending = THREE.CustomBlending; m.blendEquation = THREE.AddEquation;
    m.blendSrc = THREE.SrcAlphaFactor; m.blendDst = THREE.OneFactor;
    m.blendSrcAlpha = THREE.ZeroFactor; m.blendDstAlpha = THREE.OneFactor; m.transparent = true; m.depthWrite = false;
    return m;
  }
  var FinalShader = {
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uTrans: { value: 0 }, uCA: { value: 0.0022 }, uGrain: { value: 0.035 }, uRes: { value: new THREE.Vector2(1, 1) } },
    vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader: [
      "uniform sampler2D tDiffuse;uniform float uTime;uniform float uTrans;uniform float uCA;uniform float uGrain;uniform vec2 uRes;varying vec2 vUv;",
      "void main(){vec2 uv=vUv;",
      " float wv=sin(uv.y*16.0+uTime*3.1)*0.5+sin(uv.x*9.0-uTime*2.3)*0.5+sin((uv.x+uv.y)*23.0+uTime*4.0)*0.25;",
      " uv+=vec2(wv,-wv)*0.028*uTrans;",
      " vec2 c=uv-0.5;float d=length(c);float ca=uCA*(0.5+d*1.8)+uTrans*0.014;",
      " vec4 col=texture2D(tDiffuse,uv);col.r=texture2D(tDiffuse,uv+c*ca).r;col.b=texture2D(tDiffuse,uv-c*ca).b;",
      " col.rgb=pow(max(col.rgb,0.0),vec3(1.0/2.2));",
      " float gr=fract(sin(dot(floor(vUv*uRes)+fract(uTime)*91.7,vec2(12.9898,78.233)))*43758.5453);",
      " col.rgb+=(gr-0.5)*uGrain*col.a;",
      " gl_FragColor=col;}"].join("\n")
  };
  var lowEnd = mobile && (navigator.hardwareConcurrency || 4) <= 4;
  if (THREE.EffectComposer && THREE.UnrealBloomPass) {
    try {
      var gl2 = renderer.capabilities.isWebGL2;
      var rt = new THREE.WebGLRenderTarget(innerWidth, innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, type: gl2 ? THREE.HalfFloatType : THREE.UnsignedByteType });
      composer = new THREE.EffectComposer(renderer, rt);
      composer.addPass(new THREE.RenderPass(scene, camera));
      bloom = new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.8, 0.5, 0.93);
      if (!lowEnd) composer.addPass(bloom);
      glowBlend(bloom.materialCopy);
      finalPass = new THREE.ShaderPass(FinalShader); composer.addPass(finalPass);
    } catch (e) { composer = null; }
  }
  if (composer) renderer.outputEncoding = THREE.LinearEncoding; // Gamma macht der Final-Pass
  var glowFixed = false;
  function fixGlowMaterials() { scene.traverse(function (o) { var ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; ms.forEach(function (m) { if (m.blending === THREE.AdditiveBlending) glowBlend(m); }); }); glowFixed = true; }
  var loader = new THREE.TextureLoader();
  function tex(src) { var t = loader.load(asset(src)); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t; }

  (function env() {
    var e = new THREE.Scene(), g = new THREE.PlaneGeometry(6, 6), cols = PAL.concat([0xffffff]);
    for (var i = 0; i < 12; i++) {
      var m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: cols[i % cols.length], side: THREE.DoubleSide }));
      var a = i / 12 * Math.PI * 2; m.position.set(Math.cos(a) * 10, (i % 3 - 1) * 5, Math.sin(a) * 10); m.lookAt(0, 0, 0); e.add(m);
    }
    var top = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    top.position.y = 10; top.rotation.x = Math.PI / 2; e.add(top);
    e.background = new THREE.Color(0x2a1240);
    var pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(e, 0.03).texture; pm.dispose();
  })();
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  var key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(3, 6, 8); scene.add(key);
  var spotA = new THREE.SpotLight(C.pink, 2.2, 40, 0.55, 0.6, 1); spotA.position.set(-7, 9, 7); scene.add(spotA, spotA.target);
  var spotB = new THREE.SpotLight(C.blue, 2.2, 40, 0.55, 0.6, 1); spotB.position.set(7, 9, 7); scene.add(spotB, spotB.target);

  /* gemeinsame Werte für Shader: Zeit, Beat, Übergang */
  var U = { time: { value: 0 }, beat: { value: 0 }, bass: { value: 0 } };
  /* Holo-Chrom + Glitzer: Regenbogen-Schimmer am Rand, funkelnde Glitzerpunkte (pulsieren mit dem Beat) */
  function holo(m, strength, sparkle) {
    m.onBeforeCompile = function (sh) {
      sh.uniforms.uTime = U.time; sh.uniforms.uBeat = U.beat; sh.uniforms.uHolo = { value: strength }; sh.uniforms.uSpark = { value: sparkle || 0 };
      sh.fragmentShader = "uniform float uTime;uniform float uBeat;uniform float uHolo;uniform float uSpark;\n" + sh.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
        "float frn = pow(1.0 - abs(dot(normalize(vViewPosition), normal)), 2.0);" +
        "vec3 rbw = 0.5 + 0.5 * cos(6.2831 * (frn * 1.6 + uTime * 0.07 + vec3(0.0, 0.33, 0.67)));" +
        "outgoingLight += rbw * frn * uHolo * (1.0 + uBeat * 0.9);" +
        "vec3 gsp = floor(vViewPosition * 85.0);" +
        "float gh = fract(sin(dot(gsp, vec3(12.9898, 78.233, 37.719))) * 43758.5453);" +
        "outgoingLight += vec3(1.0) * step(0.986, gh) * uSpark * (0.55 + 0.45 * sin(uTime * 7.0 + gh * 60.0)) * (2.2 + uBeat * 2.0);" +
        "gl_FragColor = vec4( outgoingLight, diffuseColor.a );");
    };
    m.customProgramCacheKey = function () { return "holo" + strength + "_" + (sparkle || 0); };
    return m;
  }
  /* Bühnennebel + Staub im Licht – bleibt über die ganze Seite und gibt Tiefe */
  var envG = new THREE.Group(); scene.add(envG);
  var smokeTex = (function () { var c = document.createElement("canvas"); c.width = c.height = 256; var x = c.getContext("2d");
    for (var i = 0; i < 40; i++) { var px = 128 + (Math.random() - 0.5) * 120, py = 128 + (Math.random() - 0.5) * 120, r = 30 + Math.random() * 60; var gr = x.createRadialGradient(px, py, 0, px, py, r); gr.addColorStop(0, "rgba(255,255,255,0.10)"); gr.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = gr; x.fillRect(0, 0, 256, 256); }
    var t = new THREE.CanvasTexture(c); return t; })();
  var hazes = [];
  for (var hz = 0; hz < (mobile ? 6 : 10); hz++) {
    var sm = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.0, color: [0xFF2E88, 0x2E6BFF, 0xffffff][hz % 3] }));
    var sz = 9 + Math.random() * 8; sm.scale.set(sz, sz * 0.6, 1);
    sm.userData = { x: (Math.random() - 0.5) * 16, y: (Math.random() - 0.5) * 8, z: -4 - Math.random() * 6, sp: 0.05 + Math.random() * 0.1, ph: Math.random() * 6 };
    envG.add(sm); hazes.push(sm);
  }
  var dustN = mobile ? 260 : 600, dustPos = new Float32Array(dustN * 3);
  for (var di = 0; di < dustN; di++) { dustPos[di * 3] = (Math.random() - 0.5) * 22; dustPos[di * 3 + 1] = (Math.random() - 0.5) * 14; dustPos[di * 3 + 2] = -1 - Math.random() * 9; }
  var dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  var dustTex = (function () { var c = document.createElement("canvas"); c.width = c.height = 32; var x = c.getContext("2d"); var gr = x.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = gr; x.fillRect(0, 0, 32, 32); return new THREE.CanvasTexture(c); })();
  var dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.07, map: dustTex, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xFFE9C4 }));
  envG.add(dust);
  function updateEnv(t, dt, scrollN, beat, sec) {
    envG.position.y = (scrollN * 0.6) % 14; // Parallax: der Nebel zieht langsamer als die Seite
    hazes.forEach(function (h, i) { var u = h.userData; h.position.set(u.x + Math.sin(t * u.sp + u.ph) * 2, u.y - envG.position.y + Math.cos(t * u.sp * 0.7 + u.ph), u.z); h.material.opacity = 0.05 + beat * 0.04; h.material.rotation = t * 0.02 * (i % 2 ? 1 : -1); });
    dust.rotation.y = Math.sin(t * 0.05) * 0.2; dust.position.y = -((scrollN * 1.4) % 7) + Math.sin(t * 0.1) * 0.3;
    dust.material.size = 0.07 + beat * 0.03;
  }
  function glossy(c, o) { var m = new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.15, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.45 }); if (o) Object.assign(m, o); return m; }
  var chrome = holo(new THREE.MeshPhysicalMaterial({ color: 0xe8e8f0, metalness: 1, roughness: 0.2, clearcoat: 1 }), 0.35, 0.6);
  function canvasTex(w, h, draw) { var c = document.createElement("canvas"); c.width = w; c.height = h; var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; var api = { c: c, x: c.getContext("2d"), t: t, draw: function () { draw(api.x, w, h); t.needsUpdate = true; } }; api.draw(); return api; }
  function glowSprite(color, size) {
    var g = canvasTex(128, 128, function (x) { var r = x.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.25, color); r.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = r; x.fillRect(0, 0, 128, 128); });
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: g.t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })); s.scale.set(size, size, 1); return s;
  }
  var markerFont = '"Permanent Marker", cursive', displayFont = '"Bowlby One", "Arial Black", sans-serif';
  var redraws = [];
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { redraws.forEach(function (f) { f(); }); });

  // world <-> screen helpers (camera stays at z=10, looking at origin)
  var CAMZ = 10, view = { h: 1, w: 1 };
  function anchorBox(el) {
    var r = el.getBoundingClientRect(), H = innerHeight, W = innerWidth;
    return { x: ((r.left + r.width / 2) / W - 0.5) * view.w, y: (0.5 - (r.top + r.height / 2) / H) * view.h, w: r.width / W * view.w, h: r.height / H * view.h, r: r };
  }
  function fit(box, w, h) { return Math.min(box.w / w, box.h / h); }

  /* ---------- confetti (shared) ---------- */
  var pick = new THREE.Shape(); pick.moveTo(0, 0.13); pick.bezierCurveTo(0.12, 0.13, 0.14, 0.02, 0, -0.13); pick.bezierCurveTo(-0.14, 0.02, -0.12, 0.13, 0, 0.13);
  var NC = reduce ? 0 : (mobile ? 180 : 320);
  var confetti = new THREE.InstancedMesh(new THREE.ShapeGeometry(pick, 6), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, metalness: 0.3, roughness: 0.4 }), Math.max(NC, 1));
  confetti.frustumCulled = false; confetti.visible = false; scene.add(confetti);
  var cp = [], cv = [], cr = [], cw = [], dummy = new THREE.Object3D(), col = new THREE.Color(), confLife = 0;
  for (var q = 0; q < NC; q++) { cp.push(new THREE.Vector3()); cv.push(new THREE.Vector3()); cr.push(new THREE.Euler()); cw.push(new THREE.Vector3()); confetti.setColorAt(q, col.setHex(PAL.concat([C.cream])[q % 6])); }
  if (NC) confetti.instanceColor.needsUpdate = true;
  burst = function (origin) {
    if (!NC) return; origin = origin || new THREE.Vector3(0, 1, 0); confLife = 4; confetti.visible = true;
    for (var q = 0; q < NC; q++) {
      cp[q].copy(origin); var a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 7;
      cv[q].set(Math.cos(a) * sp * 0.7, 6 + Math.random() * 7, Math.sin(a) * sp * 0.5 + 2);
      cr[q].set(Math.random() * 6, Math.random() * 6, Math.random() * 6); cw[q].set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
    }
    boom();
  };
  function updateConfetti(dt) {
    if (!NC || confLife <= 0) { confetti.visible = false; return; }
    confLife -= dt;
    for (var q = 0; q < NC; q++) {
      cv[q].y -= 9.5 * dt; cv[q].multiplyScalar(1 - dt * 0.9); cp[q].addScaledVector(cv[q], dt);
      cr[q].x += cw[q].x * dt; cr[q].y += cw[q].y * dt; cr[q].z += cw[q].z * dt;
      dummy.position.copy(cp[q]); dummy.rotation.copy(cr[q]); dummy.scale.setScalar(1.3); dummy.updateMatrix(); confetti.setMatrixAt(q, dummy.matrix);
    }
    confetti.instanceMatrix.needsUpdate = true;
  }

  /* ---------- microphone factory ---------- */
  function holesTex() {
    var c = document.createElement("canvas"); c.width = 1024; c.height = 256; var x = c.getContext("2d");
    x.fillStyle = "#fff"; x.fillRect(0, 0, 1024, 256); x.fillStyle = "#000";
    for (var r = 0; r < 16; r++) for (var k = 0; k < 64; k++) { x.beginPath(); x.arc(k * 16 + 8 + (r % 2) * 8, r * 16 + 8, 5.2, 0, 7); x.fill(); }
    var t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; return t;
  }
  var grilleMat = new THREE.MeshPhysicalMaterial({ color: 0xf2f2ff, metalness: 1, roughness: 0.22, envMapIntensity: 0.8, alphaMap: holesTex(), alphaTest: 0.5, side: THREE.DoubleSide, clearcoat: 1 });
  var foamMat = new THREE.MeshStandardMaterial({ color: 0x2b1245, roughness: 1, side: THREE.DoubleSide });
  function makeMic(noCable) {
    var m = { g: new THREE.Group() };
    m.lidPivot = new THREE.Group(); m.lidPivot.position.set(0, 0, -1); m.g.add(m.lidPivot);
    m.lid = new THREE.Group(); m.lid.position.set(0, 0, 1); m.lidPivot.add(m.lid);
    m.lid.add(new THREE.Mesh(new THREE.SphereGeometry(1, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2), grilleMat));
    m.lid.add(new THREE.Mesh(new THREE.SphereGeometry(0.93, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2), foamMat));
    var rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 12, 64), chrome); rim.rotation.x = Math.PI / 2; m.lid.add(rim);
    m.cup = new THREE.Group(); m.g.add(m.cup);
    m.cup.add(new THREE.Mesh(new THREE.SphereGeometry(1, 64, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), grilleMat));
    m.cup.add(new THREE.Mesh(new THREE.SphereGeometry(0.93, 48, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), foamMat));
    m.cup.add(rim.clone());
    m.capsule = new THREE.Group(); m.g.add(m.capsule);
    var cb = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.42, 48), new THREE.MeshPhysicalMaterial({ color: C.sun, metalness: 0.9, roughness: 0.25, clearcoat: 1 })); cb.position.y = 0.12; m.capsule.add(cb);
    m.diaMat = new THREE.MeshStandardMaterial({ color: C.pink, emissive: C.pink, emissiveIntensity: 0.2, metalness: 0.3, roughness: 0.3 });
    m.dia = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.04, 48), m.diaMat); m.dia.position.y = 0.35; m.capsule.add(m.dia);
    m.light = new THREE.PointLight(C.pink, 0, 6, 2); m.light.position.y = 0.6; m.capsule.add(m.light);
    m.glow = glowSprite("rgba(255,46,136,0.8)", 3.4); m.glow.position.y = 0.5; m.capsule.add(m.glow);
    m.ring = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.66, 0.3, 48), holo(glossy(C.pink, { metalness: 0.5 }), 0.35, 0.7)); m.ring.position.y = -0.98; m.g.add(m.ring);
    m.body = new THREE.Group(); m.body.position.y = -2.35; m.g.add(m.body);
    m.body.add(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.4, 2.5, 64), holo(glossy(C.blue, { metalness: 0.4, roughness: 0.22 }), 0.4, 1.0)));
    [0.7, 0.45, -0.95].forEach(function (y, i) { var s = new THREE.Mesh(new THREE.TorusGeometry(0.6 - (0.7 - y) * 0.085, 0.035, 10, 48), glossy([C.sun, C.lime, C.orange][i])); s.rotation.x = Math.PI / 2; s.position.y = y; m.body.add(s); });
    var sw = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.34, 0.12), glossy(C.sun)); sw.position.set(0, 0.05, 0.56); sw.rotation.x = -0.08; m.body.add(sw);
    var butt = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.32, 0.22, 40), chrome); butt.position.y = -1.36; m.body.add(butt);
    var cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, -1.45, 0), new THREE.Vector3(0, -2.2, 0.2), new THREE.Vector3(0.6, -3.1, 0.6), new THREE.Vector3(1.8, -3.8, 0.2), new THREE.Vector3(3.6, -4.6, -0.6)]), 60, 0.07, 10, false), glossy(0x1a0f26, { roughness: 0.35, metalness: 0.1 }));
    if (!noCable) m.body.add(cable);
    var badge = canvasTex(512, 64, function (x) { x.fillStyle = "#FF2E88"; x.fillRect(0, 0, 512, 64); x.fillStyle = "#FFF6E5"; x.font = "38px " + displayFont; x.textAlign = "center"; for (var q = 0; q < 4; q++) x.fillText("N!DDL", 64 + q * 128, 48); });
    redraws.push(badge.draw); badge.t.wrapS = THREE.RepeatWrapping;
    var band = new THREE.Mesh(new THREE.CylinderGeometry(0.735, 0.675, 0.16, 64, 1, true), new THREE.MeshStandardMaterial({ map: badge.t, metalness: 0.3, roughness: 0.4 })); m.ring.add(band);
    m.screws = [];
    for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2, s = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 12), chrome); s.position.set(Math.cos(a) * 0.7, -0.98, Math.sin(a) * 0.7); s.userData.a = a; m.g.add(s); m.screws.push(s); }
    return m;
  }

  /* ---------- polaroid factory ---------- */
  var frameGeo = new THREE.BoxGeometry(2.4, 2.95, 0.05), creamMat = new THREE.MeshStandardMaterial({ color: 0xE9DFCB, roughness: 0.8 });
  var backMats = PAL.map(function (c) { return new THREE.MeshStandardMaterial({ color: c, roughness: 0.5 }); });
  var picGeo = new THREE.PlaneGeometry(2.12, 2.12), capGeo = new THREE.PlaneGeometry(2.12, 0.5), tapeGeo = new THREE.PlaneGeometry(0.9, 0.3);
  /* 2.5D-Fotos: Tiefenkarte (Kopf + Körper treten nach vorn), Wasser-Welle beim Drüberfahren */
  var FOCUS = { "pinker-anzug": [0.5, 0.2], "tanzen-lila": [0.5, 0.2], "ballkleid": [0.42, 0.3], "lachen-blau": [0.56, 0.36], "mit-dennis": [0.5, 0.3], "weihnachten": [0.5, 0.3],
    "buehne-blau": [0.45, 0.3], "psst-strand": [0.5, 0.32], "backstage-schmollen": [0.62, 0.26], "singen-schwarz": [0.56, 0.3], "studio": [0.5, 0.42], "backstage-nase": [0.42, 0.32], "see": [0.5, 0.4] };
  var depthCache = {}, picMats = [], picMeshes = [];
  function depthTex(key) {
    if (depthCache[key]) return depthCache[key];
    var f = FOCUS[key] || [0.5, 0.32], c = document.createElement("canvas"); c.width = c.height = 128; var x = c.getContext("2d");
    x.fillStyle = "#000"; x.fillRect(0, 0, 128, 128);
    function blob(cx, cy, rx, ry, v) { x.save(); x.translate(cx * 128, cy * 128); x.scale(rx, ry); var g = x.createRadialGradient(0, 0, 0, 0, 0, 128); g.addColorStop(0, "rgba(255,255,255," + v + ")"); g.addColorStop(1, "rgba(255,255,255,0)"); x.globalCompositeOperation = "lighter"; x.fillStyle = g; x.fillRect(-128, -128, 256, 256); x.restore(); }
    blob(f[0], f[1] + 0.45, 0.42, 0.62, 0.55); blob(f[0], f[1], 0.2, 0.24, 0.9);
    var t = new THREE.CanvasTexture(c); depthCache[key] = t; return t;
  }
  var picGeoHi = new THREE.PlaneGeometry(2.12, 2.12, 40, 40);
  function depthMat(map, key, transparent) {
    var m = new THREE.ShaderMaterial({
      transparent: !!transparent,
      uniforms: { map: { value: map }, dMap: { value: depthTex(key) }, uDepth: { value: 0.42 }, uOpacity: { value: 1 }, uHover: { value: 0 }, uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uTime: U.time, uLin: { value: composer ? 1 : 0 } },
      vertexShader: "uniform sampler2D dMap;uniform float uDepth;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z+=texture2D(dMap,uv).r*uDepth;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}",
      fragmentShader: "uniform sampler2D map;uniform float uOpacity;uniform float uHover;uniform vec2 uMouse;uniform float uTime;uniform float uLin;varying vec2 vUv;" +
        "void main(){vec2 uv=vUv;float dd=distance(uv,uMouse);uv+=normalize(uv-uMouse+1e-4)*sin(dd*38.0-uTime*7.0)*0.009*uHover*smoothstep(0.5,0.0,dd);" +
        "vec4 c=texture2D(map,uv);if(uLin>0.5)c.rgb=pow(c.rgb,vec3(2.2));gl_FragColor=vec4(c.rgb,c.a*uOpacity);}"
    });
    m.userData.depth = true; picMats.push(m); return m;
  }
  function makePolaroid(map, caption, i, transparent, key) {
    var g = new THREE.Group(), mats = [];
    var fm = transparent ? [creamMat.clone(), backMats[i % 5].clone()] : [creamMat, backMats[i % 5]];
    var frame = new THREE.Mesh(frameGeo, [fm[0], fm[0], fm[0], fm[0], fm[0], fm[1]]); g.add(frame); g.userData.fmats = fm;
    var pm = key ? depthMat(map, key, transparent) : new THREE.MeshBasicMaterial({ map: map, toneMapped: false, transparent: !!transparent }); mats.push(pm);
    var pic = new THREE.Mesh(key ? picGeoHi : picGeo, pm); pic.position.set(0, 0.27, 0.03); g.add(pic);
    if (key) { pic.userData.pic = true; picMeshes.push(pic); }
    var ct = canvasTex(768, 180, function (x) { x.fillStyle = "#FFF6E5"; x.fillRect(0, 0, 768, 180); x.fillStyle = "#160A24"; x.font = "66px " + markerFont; x.textAlign = "center"; x.fillText(T(caption), 384, 116); });
    redraws.push(ct.draw);
    var cm = new THREE.MeshBasicMaterial({ map: ct.t, toneMapped: false, transparent: !!transparent }); mats.push(cm);
    var cap = new THREE.Mesh(capGeo, cm); cap.position.set(0, -1.08, 0.03); g.add(cap);
    var tm = new THREE.MeshBasicMaterial({ color: PAL[i % 5], transparent: true, opacity: 0.85 }); mats.push(tm);
    var tp = new THREE.Mesh(tapeGeo, tm); tp.position.set(0, 1.45, 0.05); tp.rotation.z = 0.12 * (i % 2 ? -1 : 1); g.add(tp);
    g.userData.mats = mats; g.userData.frame = frame;
    return g;
  }

  /* ================= SCENE 1: HERO ================= */
  var hero = new THREE.Group(); scene.add(hero);
  var beams = [];
  [[-5.5, C.pink], [5.5, C.blue], [0, C.sun]].forEach(function (b, i) {
    var geo = new THREE.CylinderGeometry(0.08, 1.9, 16, 32, 1, true); geo.translate(0, -8, 0);
    var mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { c: { value: new THREE.Color(b[1]) }, o: { value: 0.2 } },
      vertexShader: "varying float vY;void main(){vY=uv.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
      fragmentShader: "uniform vec3 c;uniform float o;varying float vY;void main(){gl_FragColor=vec4(c,pow(vY,1.6)*o);}" });
    var m = new THREE.Mesh(geo, mat); m.position.set(b[0], 8.5, -3); m.userData.i = i; scene.add(m); beams.push(m);
  });
  var mic = makeMic(); hero.add(mic.g);
  var font = new THREE.Font(window.NIDDL_FONT);
  var word = [["N", C.pink], ["!", C.sun], ["D", C.blue], ["D", C.lime], ["L", C.orange]], letters = [], rowW = 0;
  word.forEach(function (w) {
    var g = new THREE.TextGeometry(w[0], { font: font, size: 1.0, height: 0.42, curveSegments: 10, bevelEnabled: true, bevelThickness: 0.17, bevelSize: 0.085, bevelSegments: 8 });
    g.computeBoundingBox(); var wd = g.boundingBox.max.x - g.boundingBox.min.x; g.center();
    var m = new THREE.Mesh(g, holo(glossy(w[1], { metalness: 0.05, roughness: 0.3, clearcoat: 0.7, envMapIntensity: 0.35 }), 0.28, 0.9));
    m.userData = { w: wd, ch: w[0], jump: 0 }; m.scale.setScalar(0.001); hero.add(m); letters.push(m); rowW += wd;
  });
  rowW += 0.22 * 4; var acc = -rowW / 2; letters.forEach(function (m) { m.userData.tx = acc + m.userData.w / 2; acc += m.userData.w + 0.22; });
  var shots = [
    { src: "assets/img/pinker-anzug.jpg", cap: "N!DDL ★ des bin i!", x: 0, y: -0.2, z: 1.6, r: -0.06, s: 1, d: 0.44 },
    { src: "assets/img/ballkleid.jpg", cap: "Rock im Ballkleid", x: -3.3, y: 0.15, z: -0.4, r: 0.14, s: 0.72, d: 0.50 },
    { src: "assets/img/tanzen-lila.jpg", cap: "Kein Halbgas. Nie.", x: 3.3, y: 0.1, z: -0.4, r: -0.12, s: 0.72, d: 0.53 },
    { src: "assets/img/weihnachten.jpg", cap: "Schmäh ohne Ende", x: -2.3, y: -2.0, z: 0.2, r: -0.18, s: 0.6, d: 0.56 },
    { src: "assets/img/psst-strand.jpg", cap: "Psst … leiwand!", x: 2.4, y: -2.0, z: 0.2, r: 0.16, s: 0.6, d: 0.59 }
  ];
  var pols = shots.map(function (sh, i) { var g = makePolaroid(tex(sh.src), sh.cap, i, false, sh.src.replace(/^.*\/|\.jpg$/g, "")); g.userData.sh = sh; g.scale.setScalar(0.001); hero.add(g); return g; });
  var heroBursted = false, capWorld = new THREE.Vector3();
  var fan = [[0, 0, 0, -0.06], [-1.55, 0.35, -0.7, 0.22], [1.55, 0.35, -0.7, -0.2], [-0.9, -0.9, -1.1, -0.3], [0.95, -0.9, -1.1, 0.28]];
  var heroCam = { z: 10, y: 0 }, sfx = {};
  function updateHero(st, t, dt, aspect) {
    var p = st.p, narrow = aspect < 0.8;
    var leave = 1 - clamp(st.r.bottom / innerHeight, 0, 1);
    hero.visible = st.vis > 0.001;
    hero.position.y = leave * view.h * 1.1;
    var open = ease(seg(p, 0.07, 0.30)), away = ease(seg(p, 0.66, 0.86)), sway = reduce ? 0 : Math.sin(t * 0.5) * 0.35;
    mic.g.position.y = 0.9 - open * 0.4 - away * 8.5 - (narrow ? 2.4 * (1 - open) : 0);
    mic.g.position.x = narrow ? 0 : 1.9 * (1 - open);
    mic.g.rotation.set(0.12 + pointer.y * 0.12, (sway + pointer.x * 0.4) * (1 - open * 0.7), 0);
    mic.lidPivot.rotation.x = -open * 1.75; mic.lid.position.y = open * 0.25; mic.cup.position.y = -open * 0.15;
    mic.ring.position.y = -0.98 - open * 0.9; mic.body.position.y = -2.35 - open * 1.8; mic.body.rotation.z = open * 0.12;
    mic.screws.forEach(function (s, i) { var a = s.userData.a, r = 0.7 + open * (1.6 + (i % 3) * 0.4); s.position.set(Math.cos(a) * r, -0.98 - open * 0.9 + Math.sin(i * 2.1) * open * 0.6, Math.sin(a) * r); s.rotation.set(open * 4 + i, open * 6 + i, 0); });
    if (open > 0.5 && !sfx.open) { sfx.open = true; whoosh(0.9, true); } if (open < 0.3) sfx.open = false;
    var live = seg(p, 0.12, 0.62) * (1 - away);
    mic.capsule.position.y = open * 0.25;
    mic.diaMat.emissiveIntensity = 0.2 + live * 2.2 + (reduce ? 0 : Math.sin(t * 28) * 0.25 * live);
    mic.dia.position.y = 0.35 + (reduce ? 0 : Math.sin(t * 40) * 0.012 * live);
    mic.light.intensity = live * (6 + beat * 6); mic.glow.material.opacity = live * (0.85 + beat * 0.15); mic.glow.scale.setScalar(3.4 * (1 + beat * 0.35));
    mic.capsule.getWorldPosition(capWorld); hero.worldToLocal(capWorld); capWorld.y += 0.4;
    var ly = narrow ? 2.7 : 2.05, rowScale = Math.min(1, view.w * 0.86 / rowW);
    letters.forEach(function (m, i) {
      var u = m.userData, e = seg(p, 0.27 + i * 0.045, 0.47 + i * 0.045), k = ease(e);
      if (e > 0.5 && !u.popped) { u.popped = true; pop(1 + i * 0.18); } if (e < 0.2) u.popped = false;
      var tx = u.tx * rowScale, ty = ly + Math.sin(t * 1.6 + i) * (reduce ? 0 : 0.06), tz = 0.6;
      m.position.set(capWorld.x + (tx - capWorld.x) * k, capWorld.y + (ty - capWorld.y) * k + Math.sin(Math.PI * k) * 2.2, capWorld.z + (tz - capWorld.z) * k + Math.sin(Math.PI * k) * 2);
      u.jump = Math.max(0, u.jump - dt * 1.6); m.position.y += Math.sin(u.jump * Math.PI) * 0.9;
      m.rotation.set(pointer.y * -0.2, (1 - k) * Math.PI * 4 + pointer.x * 0.35 + (reduce ? 0 : Math.sin(t + i) * 0.12) + Math.sin(u.jump * Math.PI) * Math.PI + (disco ? t * 3 : 0), (1 - k) * (i % 2 ? 1 : -1) * 1.2);
      m.scale.setScalar(Math.max(0.001, back(e) * rowScale * (1 + beat * 0.09 * (i % 2 ? 1 : 0.7))));
    });
    var cx = narrow ? 0 : 2.7, cy = narrow ? 0.55 : -0.1;
    pols.forEach(function (g, i) {
      var sh = g.userData.sh, e = seg(p, sh.d, sh.d + 0.16), k = ease(e);
      if (e > 0.4 && !g.userData.sw) { g.userData.sw = true; whoosh(0.35); } if (e < 0.1) g.userData.sw = false;
      var tx = narrow ? sh.x * 0.42 : sh.x, ty = narrow ? (i === 0 ? -0.1 : sh.y * 1.25 + (i < 3 ? 2.3 : -0.9)) : sh.y, tz = narrow && i > 0 ? sh.z - 1.5 : sh.z, tr = sh.r;
      var sc = narrow ? (i === 0 ? 0.95 : 0.55) : sh.s, f = fan[i], fs = narrow ? 0.62 : 0.78;
      tx += (cx + f[0] * fs - tx) * away; ty += (cy + f[1] * fs - ty) * away; tz += (1.2 + f[2] - tz) * away; tr += (f[3] - tr) * away;
      sc *= 1 + ((i === 0 ? (narrow ? 0.62 : 0.78) : (narrow ? 0.5 : 0.62)) / sc - 1) * away;
      sc *= back(e);
      g.position.set(capWorld.x + (tx - capWorld.x) * k, capWorld.y + (ty - capWorld.y) * k + Math.sin(Math.PI * k) * (1.6 + i * 0.3), capWorld.z + (tz - capWorld.z) * k + Math.sin(Math.PI * k) * 1.2);
      g.rotation.set(pointer.y * -0.15, (1 - k) * Math.PI * (5 + i) + pointer.x * 0.3 * (i === 0 ? 1 : 0.6) + (reduce ? 0 : Math.sin(t * 0.8 + i) * 0.05), tr * k + (1 - k) * (i % 2 ? -0.8 : 0.8));
      g.scale.setScalar(Math.max(0.001, sc));
    });
    if (p > 0.68 && !heroBursted && st.vis > 0.5) { heroBursted = true; var o = new THREE.Vector3(0, ly, 0.5); hero.localToWorld(o); burst(o); }
    if (p < 0.6) heroBursted = false;
    var pe = seg(p, 0.44, 0.62);
    heroCam.z = 10 - open * 2.6 + away * 0.8 + pe * 2.2 * (1 - away) + (narrow ? 3.5 : 0);
    heroCam.y = -0.6 + open * 0.9 + away * 0.6;
  }

  /* ================= SCENE 2: STORY – Zeitreise-Tunnel ================= */
  var story = new THREE.Group(); scene.add(story);
  var storyCards = [
    { g: ["STARMANIA", "2003"], c: "#FF2E88" }, { g: ["NEW YORK", "GREASE"], c: "#2E6BFF" }, { src: "assets/img/buehne-blau.jpg", cap: "Rock Chick" },
    { g: ["KNOCK", "ME OUT"], c: "#9DFF00" }, { src: "assets/img/studio.jpg", cap: "Mich siehst du nie mehr" }, { src: "assets/img/backstage-schmollen.jpg", cap: "Gudbai Änglisch" },
    { src: "assets/img/tanzen-lila.jpg", cap: "Tina!" }, { src: "assets/img/mit-dennis.jpg", cap: "mit Dennis Jale" }, { src: "assets/img/pinker-anzug.jpg", cap: "Gspannt wie a Schirm" }
  ];
  var tunnel = new THREE.Group(); story.add(tunnel);
  var sCards = storyCards.map(function (c, i) {
    var map;
    if (c.src) map = tex(c.src);
    else { var ct = canvasTex(640, 640, function (x) { x.fillStyle = c.c; x.fillRect(0, 0, 640, 640); x.fillStyle = "rgba(22,10,36,.18)"; for (var a = 0; a < 32; a++) for (var b = 0; b < 32; b++) { x.beginPath(); x.arc(a * 20 + 10, b * 20 + 10, 3 + ((a + b) % 4), 0, 7); x.fill(); } x.save(); x.translate(320, 320); x.rotate(-0.08); x.fillStyle = "#160A24"; x.textAlign = "center"; x.font = "92px " + displayFont; x.fillText(c.g[0], 0, -20); x.fillStyle = "#FFF6E5"; x.font = "120px " + displayFont; x.fillText(c.g[1], 0, 110); x.restore(); }); redraws.push(ct.draw); map = ct.t; }
    var g = makePolaroid(map, c.cap || c.g.join(" "), i, true, c.src ? c.src.replace(/^.*\/|\.jpg$/g, "") : null); tunnel.add(g); return g;
  });
  var rings = [];
  for (var ri = 0; ri < 14; ri++) {
    var rm = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.04, 8, 80), new THREE.MeshBasicMaterial({ color: PAL[ri % 5], transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
    tunnel.add(rm); rings.push(rm);
  }
  var SP = 5.5;
  function updateStory(st, t, dt, aspect) {
    story.visible = st.vis > 0.001; if (!story.visible) return;
    var b = anchorBox($("#aStory")), s = fit(b, 3.8, 5.2);
    story.position.set(b.x, b.y, 0); story.scale.setScalar(s);
    var n = sCards.length, cur = st.p * (n - 1);
    setChapter(clamp(Math.round(cur), 0, n - 1));
    sCards.forEach(function (g, i) {
      var off = i - cur, z = -off * SP;
      var passed = clamp(-off, 0, 1);
      g.position.set(Math.sin(off * 0.9) * 0.9 * clamp(Math.abs(off), 0, 1.5), Math.cos(off * 1.3) * 0.25 * clamp(Math.abs(off), 0, 1) + passed * 2.5, z + passed * 2);
      g.rotation.set(pointer.y * -0.1, off * 0.35 + pointer.x * 0.25 + passed * 1.2, (i % 2 ? 1 : -1) * 0.06 + off * 0.1);
      var op = clamp(1 - passed * 1.3, 0, 1) * clamp(1 - (off - 2.5) * 0.6, 0, 1);
      g.visible = op > 0.01;
      g.userData.mats.forEach(function (m) { if (m.uniforms && m.uniforms.uOpacity) m.uniforms.uOpacity.value = op; else m.opacity = op * (m.color && m.map == null ? 0.85 : 1); });
      g.userData.fmats.forEach(function (m) { m.transparent = true; m.opacity = op; });
      g.scale.setScalar(0.95 + clamp(1 - Math.abs(off), 0, 1) * 0.1);
    });
    rings.forEach(function (r, i) {
      var z = (((i * SP * 0.66 - (-cur * SP)) % (rings.length * SP * 0.66)) + rings.length * SP * 0.66) % (rings.length * SP * 0.66);
      r.position.set(0, 0, -z + 3); r.rotation.z = t * 0.2 + i; r.material.opacity = 0.55 * clamp(1 - z / 40, 0, 1) * clamp((3 - (-z + 3)) / 3 + 0.2, 0, 1);
      r.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.03);
    });
  }

  /* ================= SCENE 2b: FOTOWAND ================= */
  var photoG = new THREE.Group(); scene.add(photoG);
  var ringG = new THREE.Group(); photoG.add(ringG);
  var NP = DATA.photos.length, PR = 5.4;
  var photoCards = DATA.photos.map(function (p, i) {
    var g = makePolaroid(tex("assets/img/" + p.file + ".jpg"), p.cap, i, false, p.file); g.userData.i = i;
    g.traverse(function (o) { o.userData.photo = i; }); ringG.add(g); return g;
  });
  var photoGlow = glowSprite("rgba(255,212,0,0.6)", 5); photoGlow.position.set(0, 0, -1); photoG.add(photoGlow);
  var curPhoto = -1, photoDrag = 0, photoDragV = 0;
  function updatePhotos(st, t, dt, aspect) {
    photoG.visible = st.vis > 0.001; if (!photoG.visible) return;
    var b = anchorBox($("#aPhotos")), s = fit(b, aspect < 0.8 ? 5.2 : 9, 4.6);
    photoG.position.set(b.x, b.y, 0); photoG.scale.setScalar(s);
    photoDrag += photoDragV; photoDragV *= 0.9;
    var cur = st.p * (NP - 1) + photoDrag, step = Math.PI * 2 / NP;
    ringG.position.z = -PR; ringG.rotation.y = -cur * step + pointer.x * 0.15; ringG.rotation.x = pointer.y * 0.06;
    var front = ((Math.round(cur) % NP) + NP) % NP;
    if (front !== curPhoto) { if (curPhoto >= 0) tick(1.3); curPhoto = front; $("#photoCap").textContent = T(DATA.photos[front].cap); }
    photoCards.forEach(function (g, i) {
      var a = i * step; g.position.set(Math.sin(a) * PR, Math.sin(t * 0.9 + i) * 0.12 + (i % 2 ? 0.25 : -0.25), Math.cos(a) * PR); g.rotation.set(0, a, (i % 2 ? 1 : -1) * 0.05);
      var d = Math.abs((((i - cur) % NP) + NP + NP / 2) % NP - NP / 2), f = clamp(1 - d, 0, 1);
      g.scale.setScalar(1 + f * 0.35);
    });
    photoGlow.material.opacity = 0.5;
  }

  /* ================= SCENE 3: KONZERTE – Neon-Riesenrad ================= */
  var wheelG = new THREE.Group(); scene.add(wheelG);
  var wheel = new THREE.Group(); wheel.position.y = 0.5; wheelG.add(wheel);
  var R = 2.6, G = 12;
  var neonMat = function (c) { return new THREE.MeshBasicMaterial({ color: c, toneMapped: false }); };
  [-0.3, 0.3].forEach(function (z, i) {
    var t1 = new THREE.Mesh(new THREE.TorusGeometry(R, 0.06, 10, 120), neonMat(i ? C.blue : C.pink)); t1.position.z = z; wheel.add(t1);
    var t2 = new THREE.Mesh(new THREE.TorusGeometry(R * 0.55, 0.04, 8, 80), neonMat(C.sun)); t2.position.z = z; wheel.add(t2);
  });
  for (var si = 0; si < G; si++) {
    var a = si / G * Math.PI * 2, sp = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, R, 6), chrome);
    sp.position.set(Math.cos(a) * R / 2, Math.sin(a) * R / 2, 0); sp.rotation.z = a - Math.PI / 2; wheel.add(sp);
  }
  wheel.add(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.9, 24), glossy(C.pink)).rotateX(Math.PI / 2));
  var bulbGeo = new THREE.BufferGeometry(), bulbPos = [], bulbCol = [];
  for (var bi = 0; bi < 72; bi++) { var ba = bi / 72 * Math.PI * 2; bulbPos.push(Math.cos(ba) * R, Math.sin(ba) * R, 0.32); var bc = new THREE.Color(PAL[bi % 5]); bulbCol.push(bc.r, bc.g, bc.b); }
  bulbGeo.setAttribute("position", new THREE.Float32BufferAttribute(bulbPos, 3)); bulbGeo.setAttribute("color", new THREE.Float32BufferAttribute(bulbCol, 3));
  var bulbs = new THREE.Points(bulbGeo, new THREE.PointsMaterial({ size: 0.16, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  wheel.add(bulbs);
  [-1, 1].forEach(function (sx) {
    [-0.55, 0.55].forEach(function (z) {
      var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.7, 10), glossy(C.blue)); leg.position.set(sx * 0.95, 0.5 - 1.75, z); leg.rotation.z = sx * 0.27; wheelG.add(leg);
    });
  });
  var base = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.18, 1.6), glossy(0x341852)); base.position.y = -3.15; wheelG.add(base);
  var gondolas = [];
  var gGeo = new THREE.BoxGeometry(0.62, 0.5, 0.55), roofGeo = new THREE.ConeGeometry(0.46, 0.26, 4);
  /* Wiener Riesenrad: rote Waggons mit Fensterreihe, Show-Farbe als Neonstreifen */
  var wagonGeo = new THREE.BoxGeometry(0.72, 0.46, 0.46), wagonRoofGeo = new THREE.BoxGeometry(0.8, 0.08, 0.52), wagonWinGeo = new THREE.PlaneGeometry(0.6, 0.18);
  var wagonRed = holo(glossy(0xD7263D, { metalness: 0.3, roughness: 0.3 }), 0.15, 0.3), wagonRoof = glossy(0xF2EAD8, { metalness: 0.2 });
  var wagonWin = new THREE.MeshBasicMaterial({ map: (function () { var c = document.createElement("canvas"); c.width = 256; c.height = 64; var x = c.getContext("2d"); x.fillStyle = "#3a0d16"; x.fillRect(0, 0, 256, 64); for (var k = 0; k < 6; k++) { x.fillStyle = "#FFE9B0"; x.fillRect(8 + k * 41, 8, 32, 48); } var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t; })(), toneMapped: false });
  /* Fachwerk: Querstreben zwischen den Felgen + Speichen auf beiden Seiten */
  (function () {
    var spk = [], NS = 36;
    for (var k = 0; k < NS; k++) { var a = k / NS * Math.PI * 2; [-0.3, 0.3].forEach(function (z) { spk.push(0, 0, z * 0.4, Math.cos(a) * R, Math.sin(a) * R, z); }); spk.push(Math.cos(a) * R, Math.sin(a) * R, -0.3, Math.cos(a) * R, Math.sin(a) * R, 0.3);
      var a2 = (k + 0.5) / NS * Math.PI * 2; spk.push(Math.cos(a) * R, Math.sin(a) * R, -0.3, Math.cos(a2) * R * 0.94, Math.sin(a2) * R * 0.94, 0.3); }
    var sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.Float32BufferAttribute(spk, 3));
    wheel.add(new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: 0xFFF6E5, transparent: true, opacity: 0.55 })));
  })();
  for (var gi = 0; gi < G; gi++) {
    var gp = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ color: C.pink, toneMapped: false });
    var box = new THREE.Mesh(wagonGeo, wagonRed); box.position.y = -0.4; gp.add(box);
    var roofW = new THREE.Mesh(wagonRoofGeo, wagonRoof); roofW.position.y = -0.08; gp.add(roofW);
    var stripe = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.05, 0.5), mat); stripe.position.y = -0.14; gp.add(stripe);
    [-1, 1].forEach(function (sd) { var w = new THREE.Mesh(wagonWinGeo, wagonWin); w.position.set(0, -0.38, sd * 0.236); if (sd < 0) w.rotation.y = Math.PI; gp.add(w); });
    var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 6), chrome); rod.position.y = 0.06; gp.add(rod);
    gp.userData = { mat: mat, idx: -1 }; wheel.add(gp); gondolas.push(gp);
  }
  var gLight = new THREE.PointLight(C.sun, 0, 4, 2); wheelG.add(gLight);
  var wheelGlow = glowSprite("rgba(255,212,0,0.7)", 2.4); wheelG.add(wheelGlow);
  function updateWheel(st, t, dt, aspect) {
    wheelG.visible = st.vis > 0.001; if (!wheelG.visible) return;
    var b = anchorBox($("#aWheel")), s = fit(b, 6.4, 7.2);
    wheelG.position.set(b.x, b.y, 0); wheelG.scale.setScalar(s);
    wheelG.rotation.y = pointer.x * 0.35 - 0.15; wheelG.rotation.x = pointer.y * 0.1;
    var cur = st.p * (gigs.length - 1);
    setGig(clamp(Math.round(cur), 0, gigs.length - 1));
    var rot = -Math.PI / 2 - cur * (Math.PI * 2 / G);
    wheel.rotation.z = rot;
    var active = Math.round(cur);
    gondolas.forEach(function (gp, j) {
      var a = j / G * Math.PI * 2; gp.position.set(Math.cos(a) * R, Math.sin(a) * R, 0); gp.rotation.z = -rot + Math.sin(t * 1.5 + j) * 0.05 * (reduce ? 0 : 1);
      var k = Math.round((cur - j) / G), idx = clamp(j + k * G, 0, gigs.length - 1);
      if (gp.userData.idx !== idx) { gp.userData.idx = idx; gp.userData.mat.color.set(DATA.types[gigs[idx].type].color); }
      var on = idx === active && j + k * G === idx;
      gp.userData.mat.color.set(DATA.types[gigs[idx].type].color).multiplyScalar(on ? 2.2 + Math.sin(t * 6) * 0.4 + beat : 0.7);
      var sc = on ? 1.35 : 1; gp.scale.x += (sc - gp.scale.x) * 0.15; gp.scale.y = gp.scale.z = gp.scale.x;
    });
    var cA = bulbGeo.attributes.color;
    for (var i = 0; i < 72; i++) { var c = new THREE.Color(PAL[(i + Math.floor(t * 6)) % 5]); var f = (0.5 + 0.5 * Math.sin(t * 8 + i)) * (1 + beat * 1.2); cA.setXYZ(i, c.r * f, c.g * f, c.b * f); }
    cA.needsUpdate = true;
    gLight.position.set(0, 0.5 - R - 0.4, 0.8); gLight.intensity = 3; wheelGlow.position.set(0, 0.5 - R - 0.4, 0.4); wheelGlow.material.opacity = 0.7;
  }

  /* ================= SCENE 4: MUSIK – Kassetten-Karussell ================= */
  var tapesG = new THREE.Group(); scene.add(tapesG);
  var carousel = new THREE.Group(); tapesG.add(carousel);
  var NT = DATA.releases.length, TR = 3.2;
  var reelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 6), hubGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.04, 32);
  var tapes = DATA.releases.map(function (r, i) {
    var g = new THREE.Group(), colr = PAL[i % 5];
    g.add(new THREE.Mesh(new THREE.BoxGeometry(2, 1.28, 0.26), glossy(colr)));
    var lt = canvasTex(512, 220, function (x) { x.fillStyle = "#FFF6E5"; x.fillRect(0, 0, 512, 220); x.fillStyle = ["#FF2E88", "#2E6BFF", "#FFD400", "#9DFF00", "#FF6A00"][i % 5]; x.fillRect(0, 0, 512, 30); x.fillStyle = "#160A24"; x.font = "44px " + markerFont; x.textAlign = "center"; var tt = r.title.length > 20 ? r.title.slice(0, 19) + "…" : r.title; x.fillText(tt, 256, 92); x.fillStyle = "#160A24"; x.fillRect(110, 125, 292, 80); x.fillStyle = "#FFF6E5"; x.beginPath(); x.arc(180, 165, 26, 0, 7); x.arc(332, 165, 26, 0, 7); x.fill(); });
    redraws.push(lt.draw);
    var label = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.73), new THREE.MeshBasicMaterial({ map: lt.t, toneMapped: false })); label.position.set(0, 0.12, 0.135); g.add(label);
    var reels = [];
    [-0.47, 0.47].forEach(function (x) { var rr = new THREE.Mesh(reelGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })); rr.rotation.x = Math.PI / 2; rr.position.set(x * 0.63, -0.075, 0.15); g.add(rr); reels.push(rr); });
    var trap = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.26, 0.05), glossy(0x2b1245)); trap.position.set(0, -0.5, 0.14); g.add(trap);
    g.userData = { reels: reels }; carousel.add(g); return g;
  });
  var eq = [];
  for (var ei = 0; ei < 14; ei++) { var bar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1, 0.22), new THREE.MeshBasicMaterial({ color: PAL[ei % 5], toneMapped: false })); bar.position.set((ei - 6.5) * 0.32, -2.1, 1.5); tapesG.add(bar); eq.push(bar); }
  function updateTapes(st, t, dt, aspect) {
    tapesG.visible = st.vis > 0.001; if (!tapesG.visible) return;
    var b = anchorBox($("#aTapes")), s = fit(b, 6, 5.2);
    tapesG.position.set(b.x, b.y, 0); tapesG.scale.setScalar(s);
    var cur = st.p * (NT - 1); setTape(clamp(Math.round(cur), 0, NT - 1));
    carousel.rotation.y = -cur * Math.PI * 2 / NT + pointer.x * 0.2; carousel.rotation.x = 0.12 + pointer.y * 0.08; carousel.position.z = -TR + 1.2;
    tapes.forEach(function (g, i) {
      var a = i / NT * Math.PI * 2; g.position.set(Math.sin(a) * TR, Math.sin(t * 1.2 + i) * 0.08, Math.cos(a) * TR); g.rotation.y = a;
      var front = clamp(1 - Math.abs(((i - cur) % NT + NT + NT / 2) % NT - NT / 2), 0, 1);
      g.scale.setScalar(1 + front * 0.25); g.position.y += front * 0.25;
      var sp = 0.6 + front * 6;
      g.userData.reels.forEach(function (r) { r.rotation.y -= dt * sp; });
    });
    eq.forEach(function (bar, i) {
      var h = specData ? 0.15 + Math.pow(specData[2 + Math.floor(Math.pow(i / 14, 1.6) * 120)] / 255, 1.5) * 2.2 : (reduce ? 0.5 : 0.25 + Math.abs(Math.sin(t * (3 + i * 0.37) + i) * Math.cos(t * 1.7 + i * 0.5)) * 1.4);
      bar.scale.y += (h - bar.scale.y) * 0.5; bar.position.y = -2.1 + bar.scale.y / 2; });
  }

  /* ================= SCENE 5: TV ================= */
  var tvG = new THREE.Group(); scene.add(tvG);
  var tvBody = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.6, 1.9), glossy(C.pink)); tvG.add(tvBody);
  var bezel = new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.95, 0.1), glossy(0x24103A)); bezel.position.set(-0.35, 0.05, 0.96); tvG.add(bezel);
  var screenAPI = canvasTex(320, 240, function () { });
  var screen = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1.76), new THREE.MeshBasicMaterial({ map: screenAPI.t, toneMapped: false })); screen.position.set(-0.35, 0.05, 1.02); tvG.add(screen);
  [0.45, -0.15].forEach(function (y, i) { var k = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.14, 24), glossy(i ? C.lime : C.sun)); k.rotation.x = Math.PI / 2; k.position.set(1.35, y, 0.97); tvG.add(k); });
  for (var gl = 0; gl < 4; gl++) { var sl = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.02), glossy(0x24103A)); sl.position.set(1.35, -0.55 - gl * 0.12, 0.96); tvG.add(sl); }
  [-1, 1].forEach(function (sx) {
    var ant = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 8), chrome); ant.position.set(sx * 0.45, 1.95, 0); ant.rotation.z = -sx * 0.5; tvG.add(ant);
    var tip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), glossy(C.sun)); tip.position.set(sx * 0.82, 2.65, 0); tvG.add(tip);
    var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.5, 8), glossy(C.blue)); leg.position.set(sx * 1.3, -1.5, 0.5); leg.rotation.z = sx * 0.2; tvG.add(leg);
  });
  var tvOn = 0;
  function drawScreen(t, on) {
    var x = screenAPI.x, W = 320, H = 240;
    if (on < 1) {
      var id = x.createImageData(W, H), d = id.data;
      for (var i = 0; i < d.length; i += 4) { var v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
      x.putImageData(id, 0, 0);
    }
    if (on > 0) {
      x.globalAlpha = on;
      var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#2E6BFF"); g.addColorStop(1, "#FF2E88"); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = "rgba(22,10,36,.25)"; for (var yy = 0; yy < H; yy += 4) x.fillRect(0, yy, W, 2);
      var gx = Math.random() < 0.08 ? (Math.random() - 0.5) * 16 : 0;
      x.textAlign = "center"; x.fillStyle = "#FFD400"; x.font = "22px " + displayFont; x.fillText("48er TANDLER", W / 2 + gx, 78); x.fillText("LOUNGE", W / 2 - gx, 106);
      x.fillStyle = "#FFF6E5"; x.font = "17px " + markerFont; x.fillText("mit N!DDL & Dennis Jale", W / 2, 140);
      x.fillStyle = "#160A24"; x.fillRect(W / 2 - 92, 160, 184, 40); x.fillStyle = "#FF2E88"; x.font = "18px " + displayFont; x.fillText("SO · 20:30 · W24", W / 2, 188);
      if (Math.sin(t * 6) > 0) { x.fillStyle = "#FF2E88"; x.beginPath(); x.arc(26, 24, 7, 0, 7); x.fill(); x.fillStyle = "#FFF6E5"; x.font = "13px " + displayFont; x.textAlign = "left"; x.fillText("ON AIR", 38, 29); }
      x.globalAlpha = 1;
    }
    screenAPI.t.needsUpdate = true;
  }
  var tvFrame = 0;
  function updateTv(st, t, dt, aspect) {
    tvG.visible = st.vis > 0.001; if (!tvG.visible) { staticLevel(0); return; }
    var b = anchorBox($("#aTv")), s = fit(b, 4, 4.4);
    tvG.position.set(b.x, b.y, 0); tvG.scale.setScalar(s);
    var inn = clamp(st.vis * 1.6 - 0.2, 0, 1);
    tvG.rotation.set(0.1 + pointer.y * 0.1, -0.5 + inn * 0.25 + pointer.x * 0.3, (1 - inn) * 0.2);
    tvOn += ((inn > 0.75 ? 1 : 0) - tvOn) * Math.min(1, dt * 2);
    if ((tvFrame++ % 2) === 0) drawScreen(t, tvOn);
    staticLevel((1 - tvOn) * clamp(st.vis * 2, 0, 1));
  }

  /* ================= SCENE 6: JUKEBOX ================= */
  var jukeG = new THREE.Group(); scene.add(jukeG);
  var archShape = new THREE.Shape(); archShape.moveTo(-1.3, -2); archShape.lineTo(1.3, -2); archShape.lineTo(1.3, 0.6); archShape.absarc(0, 0.6, 1.3, 0, Math.PI, false); archShape.lineTo(-1.3, -2);
  var juke = new THREE.Mesh(new THREE.ExtrudeGeometry(archShape, { depth: 1.1, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 4, curveSegments: 40 }), glossy(0x5a1f8a)); juke.position.z = -0.55; jukeG.add(juke);
  var archPts = []; for (var ap = 0; ap <= 60; ap++) { var aa = ap / 60 * Math.PI; archPts.push(new THREE.Vector3(Math.cos(aa) * 1.12, 0.6 + Math.sin(aa) * 1.12, 0.66)); }
  archPts.unshift(new THREE.Vector3(1.12, -1.6, 0.66)); archPts.push(new THREE.Vector3(-1.12, -1.6, 0.66));
  var neonTubes = [0, 1, 2].map(function (k) {
    var pts = archPts.map(function (p) { return new THREE.Vector3(p.x * (1 - k * 0.09), 0.6 + (p.y - 0.6) * (1 - k * 0.09) - (p.y < 0 ? 0 : 0), p.z + k * 0.01); });
    var m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 140, 0.045, 8, false), new THREE.MeshBasicMaterial({ color: PAL[k], toneMapped: false })); jukeG.add(m); return m;
  });
  var winMesh = new THREE.Mesh(new THREE.CircleGeometry(0.78, 48), new THREE.MeshBasicMaterial({ color: 0x160A24 })); winMesh.position.set(0, 0.55, 0.62); jukeG.add(winMesh);
  var record = new THREE.Group(); record.position.set(0, 0.55, 0.64); jukeG.add(record);
  var vinylMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.35, metalness: 0.2 });
  var vinyl = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.03, 64), vinylMat); vinyl.rotation.x = Math.PI / 2; record.add(vinyl);
  var labelMat = new THREE.MeshBasicMaterial({ color: C.pink, toneMapped: false });
  var lab = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.035, 32), labelMat); lab.rotation.x = Math.PI / 2; record.add(lab);
  var grooves = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.64, 64, 6), new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.25 })); grooves.position.z = 0.02; record.add(grooves);
  var fmtCols = [C.pink, C.blue, C.sun, C.lime, C.orange, C.cream];
  var jButtons = fmtCols.map(function (c, i) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.16), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.1, roughness: 0.3 }));
    m.position.set(-0.85 + (i % 3) * 0.85, -0.75 - Math.floor(i / 3) * 0.36, 0.62); jukeG.add(m); return m;
  });
  var grille = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.5), new THREE.MeshStandardMaterial({ color: 0xFFD400, metalness: 0.8, roughness: 0.3, alphaMap: grilleMat.alphaMap, alphaTest: 0.5 })); grille.position.set(0, -1.6, 0.62); jukeG.add(grille);
  var lastFmt = -1;
  function updateJuke(st, t, dt, aspect) {
    jukeG.visible = st.vis > 0.001; if (!jukeG.visible) return;
    var b = anchorBox($("#aJuke")), s = fit(b, 3.2, 4.6);
    jukeG.position.set(b.x, b.y, 0); jukeG.scale.setScalar(s);
    var inn = clamp(st.vis * 1.6 - 0.2, 0, 1);
    jukeG.rotation.set(pointer.y * 0.1, 0.45 - inn * 0.25 + pointer.x * 0.3, 0);
    neonTubes.forEach(function (m, k) { m.material.color.setHex(PAL[(k + Math.floor(t * 2)) % 5]); });
    if (lastFmt !== fmtIdx) { lastFmt = fmtIdx; labelMat.color.setHex(fmtCols[fmtIdx]); }
    var since = (performance.now() - fmtChanged) / 1000, drop = fmtChanged ? clamp(since / 0.6, 0, 1) : 1;
    record.position.y = 0.55 + (1 - back(drop)) * 1.6;
    record.rotation.z -= dt * (reduce ? 0.5 : 4);
    jButtons.forEach(function (m, i) { var on = i === fmtIdx; m.position.z += ((on ? 0.56 : 0.62) - m.position.z) * 0.2; m.material.emissiveIntensity = on ? 0.9 + Math.sin(t * 6) * 0.2 : 0.1; });
  }

  /* ================= SCENE 7: FINALE – Mic-Drop ================= */
  var dropG = new THREE.Group(); scene.add(dropG);
  var dmic = makeMic(true); dmic.g.scale.setScalar(0.8); dropG.add(dmic.g);
  dmic.glow.material.opacity = 0;
  var floor = new THREE.Mesh(new THREE.CircleGeometry(3, 64), new THREE.MeshBasicMaterial({ color: C.pink, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }));
  floor.rotation.x = -Math.PI / 2; dropG.add(floor);
  var shock = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 64), new THREE.MeshBasicMaterial({ color: C.sun, transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false })); shock.rotation.x = -Math.PI / 2; dropG.add(shock);
  var drop = { state: 0, y: 8, v: 0, rz: 0, shake: 0, shock: 0 };
  function updateDrop(st, t, dt, aspect) {
    dropG.visible = st.vis > 0.001; if (!dropG.visible) { drop.state = 0; return; }
    var b = anchorBox($("#aDrop")), s = Math.min(1, fit(b, 5, 5));
    var floorY = (0.5 - (b.r.bottom - b.r.height * 0.15) / innerHeight) * view.h;
    dropG.position.set(b.x + (aspect > 0.9 ? view.w * 0.18 : 0), floorY, 0); dropG.scale.setScalar(s);
    var trigger = b.r.bottom < innerHeight * 1.02;
    if (trigger && drop.state === 0) { drop.state = 1; drop.y = 9; drop.v = 0; drop.rz = 0; }
    if (b.r.top > innerHeight) { drop.state = 0; musicOutro = false; }
    if (drop.state === 0) { dmic.g.visible = false; shock.material.opacity = 0; return; }
    dmic.g.visible = true;
    if (drop.state === 1) {
      drop.v -= 26 * dt; drop.y += drop.v * dt;
      var rest = 1.75 * 0.8 * 0 + 0.0;
      if (drop.y <= 0.35) {
        drop.y = 0.35;
        if (Math.abs(drop.v) > 3) { if (drop.v < -8) { var o = new THREE.Vector3(0, 0.5, 0); dropG.localToWorld(o); burst(o); drop.shake = 0.6; drop.shock = 1; musicOutro = true; if (window.NiddlSoundtrack) NiddlSoundtrack.crash(); } drop.v = -drop.v * 0.38; }
        else { drop.v = 0; drop.state = 2; }
      }
      drop.rz += (1.35 - drop.rz) * Math.min(1, dt * (drop.y < 1.2 ? 9 : 1.5));
    }
    dmic.g.position.set(0, drop.y, 0); dmic.g.rotation.set(0, t * 0.2, drop.rz);
    drop.shock = Math.max(0, drop.shock - dt * 1.4); shock.material.opacity = drop.shock; shock.scale.setScalar(1 + (1 - drop.shock) * 3.5);
    dmic.diaMat.emissiveIntensity = 0.8; dmic.light.intensity = 2;
  }

  /* ================= loop ================= */
  var pointer = new THREE.Vector2(), pTarget = new THREE.Vector2(), ray = new THREE.Raycaster();
  addEventListener("pointermove", function (e) { pTarget.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); }, { passive: true });
  addEventListener("pointerdown", function (e) {
    if (e.target.closest("a,button,input,textarea,label,form,.gig-card,.chapters,.menu,.lightbox,.dock")) return;
    var v = new THREE.Vector2(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(v, camera);
    var hit = hero.visible && ray.intersectObjects(letters, false)[0];
    if (hit) { hit.object.userData.jump = 1; if (hit.object.userData.ch === "!") { var o = hit.object.position.clone(); hero.localToWorld(o); burst(o); } click(); return; }
    var ph = photoG.visible && ray.intersectObjects(photoCards, true)[0];
    if (ph) { openLb(ph.object.userData.photo); return; }
    var bh = jukeG.visible && ray.intersectObjects(jButtons, false)[0];
    if (bh) { var i = jButtons.indexOf(bh.object); $$("#formats .fmt")[i].click(); }
  });
  /* Handy neigen = Licht & Kamera bewegen */
  var tiltOn = false;
  function onTilt(e) { if (e.gamma == null) return; tiltOn = true; pTarget.set(clamp(e.gamma / 25, -1, 1), clamp((45 - e.beta) / 25, -1, 1)); }
  if ("DeviceOrientationEvent" in window) {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      addEventListener("touchend", function ask() { removeEventListener("touchend", ask); DeviceOrientationEvent.requestPermission().then(function (r) { if (r === "granted") addEventListener("deviceorientation", onTilt); }).catch(function () { }); }, { once: true });
    } else addEventListener("deviceorientation", onTilt);
  }
  var aspect = 1;
  function resize() {
    var w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); aspect = w / h;
    if (composer) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(w, h); finalPass.uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio()); }
    view.h = 2 * CAMZ * Math.tan(THREE.MathUtils.degToRad(19)); view.w = view.h * aspect;
  }
  addEventListener("resize", resize); resize();
  var clock = new THREE.Clock(), smooth = {}, look = new THREE.Vector3();
  function smoothState(name, st, dt) {
    var s = smooth[name] || (smooth[name] = st.p);
    s += (st.p - s) * (reduce ? 1 : Math.min(1, dt * 7)); smooth[name] = s; st.p = s; return st;
  }
  var specData = null;
  var beat = 0, bassAvg = 0.2, lastBeat = 0, energy = 0, lastParty = 0, swoop = 0, swoopSec = "", camRoll = 0;
  var secCols = { top: [C.pink, C.blue, C.sun], story: [C.orange, C.pink, C.sun], fotos: [C.lime, C.blue, C.pink], konzerte: [C.pink, C.sun, C.blue], musik: [C.blue, C.lime, C.pink], tv: [C.pink, C.blue, C.orange], buchen: [C.sun, C.pink, C.orange], kontakt: [C.pink, C.lime, C.blue] };
  var bc = new THREE.Color();
  function frame() {
    var dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    chrome2d();
    /* Musik-Analyse: Bass, Beat, Energie */
    var lv = window.NiddlSoundtrack && NiddlSoundtrack.levels ? NiddlSoundtrack.levels() : null; specData = lv ? lv.spec : null;
    var bass = lv ? lv.bass : 0, mid = lv ? lv.mid : 0, high = lv ? lv.high : 0;
    bassAvg += (bass - bassAvg) * Math.min(1, dt * 1.5);
    if (lv && bass > bassAvg * 1.18 && bass > 0.32 && t - lastBeat > 0.28) { beat = 1; lastBeat = t; }
    beat = Math.max(0, beat - dt * 3.2);
    energy += ((bass + mid) * 0.5 - energy) * Math.min(1, dt * 0.8);
    if (lv && !reduce && energy > 0.5 && t - lastParty > 14) { lastParty = t; burst(new THREE.Vector3((Math.random() - 0.5) * view.w * 0.5, view.h * 0.35, 0)); }
    U.time.value = t; U.beat.value = beat; U.bass.value = bass;
    doc.style.setProperty("--beat", beat.toFixed(3));
    /* Abschnittswechsel: Kamera-Schwung + flüssiger Übergang */
    if (lastSec !== swoopSec) { if (swoopSec) swoop = 1; swoopSec = lastSec; }
    swoop = Math.max(0, swoop - dt * 1.4);
    pointer.lerp(pTarget, Math.min(1, dt * 4));
    var sh = smoothState("hero", secState(sections.hero), dt);
    updateHero(sh, t, dt, aspect);
    updateStory(smoothState("story", secState(sections.story), dt), t, dt, aspect);
    updatePhotos(smoothState("photos", secState(sections.photos), dt), t, dt, aspect);
    updateWheel(smoothState("wheel", secState(sections.wheel), dt), t, dt, aspect);
    updateTapes(smoothState("tapes", secState(sections.tapes), dt), t, dt, aspect);
    updateTv(secState(sections.tv), t, dt, aspect);
    updateJuke(secState(sections.juke), t, dt, aspect);
    updateDrop(secState(sections.finale), t, dt, aspect);
    updateConfetti(dt);
    updateEnv(t, dt, scrollY / innerHeight, beat, lastSec);
    var hw = clamp(sh.r.bottom / innerHeight, 0, 1);
    var cols = secCols[lastSec] || secCols.top;
    beams.forEach(function (b) {
      var i = b.userData.i; b.rotation.z = (reduce ? 0 : Math.sin(t * 0.6 + i * 2 + bass)) * 0.35 + (i === 0 ? -0.25 : i === 1 ? 0.25 : 0);
      b.material.uniforms.o.value = 0.1 + hw * 0.08 + beat * 0.16 + (disco ? 0.2 : 0);
      if (disco) b.material.uniforms.c.value.setHSL((t * 0.5 + i / 3) % 1, 1, 0.55); else b.material.uniforms.c.value.lerp(bc.setHex(cols[i]), Math.min(1, dt * 2));
      b.scale.x = b.scale.z = 1 + beat * 0.25;
    });
    if (bloom) bloom.strength = 0.75 + beat * 0.5 + high * 0.3 + swoop * 0.25;
    if (finalPass) { finalPass.uniforms.uTime.value = t; finalPass.uniforms.uTrans.value = reduce ? 0 : Math.sin(swoop * Math.PI) * 0.9; finalPass.uniforms.uCA.value = 0.0022 + beat * 0.0025; }
    spotA.intensity = 2.2 + beat * 2.5; spotB.intensity = 2.2 + beat * 2.5;
    spotA.target.position.set(Math.sin(t * 0.7) * 2, 0, 0); spotB.target.position.set(Math.cos(t * 0.6) * 2, 0, 0);
    if (disco) { spotA.color.setHSL((t * 0.7) % 1, 1, 0.5); spotB.color.setHSL((t * 0.7 + 0.5) % 1, 1, 0.5); if (Math.random() < dt * 0.6) burst(new THREE.Vector3((Math.random() - 0.5) * view.w * 0.6, view.h * 0.3, 0)); }
    else { spotA.color.setHex(C.pink); spotB.color.setHex(C.blue); }
    var cz = CAMZ + (heroCam.z - CAMZ) * hw, cy = heroCam.y * hw;
    drop.shake = Math.max(0, drop.shake - dt * 1.5);
    var shx = drop.shake * (Math.random() - 0.5) * 0.4, shy = drop.shake * (Math.random() - 0.5) * 0.4;
    var pw = tiltOn ? 1 : hw;
    camera.position.set(pointer.x * 0.5 * pw + shx, 0.4 * hw + pointer.y * 0.3 * pw + cy * 0.4 + shy, cz - beat * 0.15);
    look.set(0, cy, 0); camera.lookAt(look);
    camRoll += ((reduce ? 0 : Math.sin(swoop * Math.PI) * 0.06 * (swoopSec.length % 2 ? 1 : -1)) - camRoll) * Math.min(1, dt * 6);
    camera.rotateZ(camRoll);
    var fov = 38 + (reduce ? 0 : Math.sin(swoop * Math.PI) * 5);
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    /* Foto unter der Maus bekommt die Wasser-Welle */
    if (!mobile) {
      ray.setFromCamera(pointer.clone().set(pTarget.x, pTarget.y), camera);
      var vis = picMeshes.filter(function (m) { var p = m.parent; while (p) { if (!p.visible) return false; p = p.parent; } return true; });
      var hp2 = vis.length ? ray.intersectObjects(vis, false)[0] : null;
      picMats.forEach(function (m) { var on = hp2 && hp2.object.material === m; if (on && hp2.uv) m.uniforms.uMouse.value.lerp(hp2.uv, 0.3); m.uniforms.uHover.value += ((on ? 1 : 0) - m.uniforms.uHover.value) * Math.min(1, dt * 5); });
    }
    if (!glowFixed) fixGlowMaterials();
    if (composer) composer.render(dt); else renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
