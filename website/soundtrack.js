/* N!DDL Website-Soundtrack: eine eigene, live im Browser gespielte Rocknummer (118 BPM, E – B – C#m – A).
   Je nach Abschnitt der Seite kommen Instrumente dazu oder gehen raus.
   Liegt in data.js eine eigene MP3 unter "soundtrack", wird stattdessen diese abgespielt. */
(function () {
  "use strict";
  var BPM = 118, STEP = 60 / BPM / 4, LOOK = 0.15;
  var ROOTS = [82.41, 61.74, 69.30, 55.0];               // E2, B1, C#2, A1
  var TRIADS = [[329.6, 415.3, 493.9], [246.9, 311.1, 370.0], [277.2, 329.6, 415.3], [220.0, 277.2, 329.6]];
  var ARP = [[659.3, 830.6, 987.8, 830.6], [740.0, 987.8, 1244.5, 987.8], [830.6, 1108.7, 1318.5, 1108.7], [880.0, 1108.7, 1318.5, 1108.7]];
  // Mischung je Abschnitt: Drums, Bass, Gitarre, Pad, Arpeggio, Filter (Hz)
  var MIX = {
    intro:    { d: 0.0, b: 0.0, g: 0.0, p: 1.0, a: 0.25, f: 1400 },
    top:      { d: 1.0, b: 1.0, g: 0.9, p: 0.4, a: 0.3, f: 18000 },
    story:    { d: 0.45, b: 0.6, g: 0.0, p: 1.0, a: 0.45, f: 5000 },
    fotos:    { d: 0.8, b: 0.85, g: 0.45, p: 0.5, a: 0.6, f: 12000 },
    konzerte: { d: 1.0, b: 1.0, g: 1.0, p: 0.3, a: 0.3, f: 18000 },
    musik:    { d: 1.0, b: 1.0, g: 0.6, p: 0.3, a: 1.0, f: 18000 },
    tv:       { d: 0.6, b: 0.7, g: 0.2, p: 0.6, a: 0.3, f: 1100 },
    buchen:   { d: 1.0, b: 1.0, g: 1.0, p: 0.3, a: 0.5, f: 18000 },
    kontakt:  { d: 0.7, b: 0.7, g: 0.5, p: 0.8, a: 0.5, f: 9000 },
    outro:    { d: 0.0, b: 0.4, g: 0.0, p: 1.0, a: 0.4, f: 3000 }
  };
  var analyser = null, fbuf = null;
  function tapAnalyser(c, node) { if (!analyser) { analyser = c.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.6; fbuf = new Uint8Array(analyser.frequencyBinCount); } node.connect(analyser); }
  var ctx, out, bus, filt, layers = {}, noise, dist, timer = null, step = 0, nextT = 0, cur = "intro", playing = false, audioEl = null, mp3Gain = null;

  function curve(k) { var n = 1024, c = new Float32Array(n); for (var i = 0; i < n; i++) { var x = i * 2 / n - 1; c[i] = (1 + k) * x / (1 + k * Math.abs(x)); } return c; }
  function g(v) { var x = ctx.createGain(); x.gain.value = v; return x; }
  function env(node, t, a, peak, d) { node.gain.setValueAtTime(0.0001, t); node.gain.exponentialRampToValueAtTime(peak, t + a); node.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }

  function setup(c, dest) {
    ctx = c;
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
    out = g(0); filt = ctx.createBiquadFilter(); filt.type = "lowpass"; filt.frequency.value = 18000; filt.Q.value = 0.7;
    bus = g(1.0); bus.connect(filt).connect(comp).connect(out).connect(dest); tapAnalyser(ctx, out);
    ["d", "b", "g", "p", "a"].forEach(function (k) { layers[k] = g(0); layers[k].connect(bus); });
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); var nd = noise.getChannelData(0); for (var i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    dist = ctx.createWaveShaper(); dist.curve = curve(60); dist.oversample = "2x";
    var gf = ctx.createBiquadFilter(); gf.type = "lowpass"; gf.frequency.value = 2600; dist.connect(gf).connect(layers.g);
  }

  function kick(t, v) { var o = ctx.createOscillator(), e = g(0); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12); env(e, t, 0.003, 0.9 * v, 0.25); o.connect(e).connect(layers.d); o.start(t); o.stop(t + 0.32); }
  function noiseHit(t, type, freq, peak, dec) { var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), e = g(0); s.buffer = noise; f.type = type; f.frequency.value = freq; env(e, t, 0.002, peak, dec); s.connect(f).connect(e).connect(layers.d); s.start(t); s.stop(t + dec + 0.05); }
  function snare(t, v) { noiseHit(t, "bandpass", 1800, 0.5 * v, 0.18); var o = ctx.createOscillator(), e = g(0); o.type = "triangle"; o.frequency.value = 190; env(e, t, 0.002, 0.25 * v, 0.1); o.connect(e).connect(layers.d); o.start(t); o.stop(t + 0.15); }
  function hat(t, v, open) { noiseHit(t, "highpass", 8000, 0.16 * v, open ? 0.28 : 0.045); }
  function bass(t, f, len) { var o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), e = g(0); o.type = "sawtooth"; o.frequency.value = f; lp.type = "lowpass"; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(220, t + len); env(e, t, 0.005, 0.5, len); o.connect(lp).connect(e).connect(layers.b); o.start(t); o.stop(t + len + 0.05); }
  function gtr(t, f, len, mute) { var e = g(0); env(e, t, 0.004, mute ? 0.22 : 0.18, len); e.connect(dist); [1, 1.5, 2].forEach(function (m, i) { var o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f * 2 * m; o.detune.value = (i - 1) * 6; o.connect(e); o.start(t); o.stop(t + len + 0.05); }); }
  function pad(t, tri, len) { tri.forEach(function (f, i) { var o = ctx.createOscillator(), e = g(0); o.type = i ? "triangle" : "sine"; o.frequency.value = f / 2; o.detune.value = (i - 1) * 7; e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(0.09, t + len * 0.35); e.gain.exponentialRampToValueAtTime(0.0001, t + len); o.connect(e).connect(layers.p); o.start(t); o.stop(t + len + 0.05); }); }
  function arp(t, f) { var o = ctx.createOscillator(), e = g(0); o.type = "square"; o.frequency.value = f; env(e, t, 0.004, 0.05, 0.12); var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200; o.connect(lp).connect(e).connect(layers.a); o.start(t); o.stop(t + 0.18); }
  function crash(t) { if (!ctx) return; t = t || ctx.currentTime; var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), e = g(0); s.buffer = noise; s.loop = true; f.type = "highpass"; f.frequency.value = 5000; env(e, t, 0.003, 0.35, 1.6); s.connect(f).connect(e).connect(bus); s.start(t); s.stop(t + 1.8); }

  function play(s, t) {
    var bar = Math.floor(s / 16) % 4, i = s % 16, ch = bar, full = MIX[cur].g > 0.7;
    if (i === 0 || i === 8 || (full && (i === 6 || i === 10))) kick(t, 1);
    if (i === 4 || i === 12) snare(t, 1);
    if (full && bar === 3 && i >= 13) snare(t, 0.6);
    if (i % 2 === 0) hat(t, i % 4 === 2 ? 1 : 0.6, full && i === 14);
    if (i % 2 === 0) bass(t, ROOTS[ch] * (i % 4 === 2 ? 2 : 1), STEP * 1.8);
    if (full) { if (i % 2 === 0) gtr(t, ROOTS[ch], i === 0 ? STEP * 3 : STEP * 1.2, i !== 0); }
    else if (i === 0) gtr(t, ROOTS[ch], STEP * 15, false);
    if (i === 0) pad(t, TRIADS[ch], STEP * 16);
    arp(t, ARP[ch][i % 4] * (i >= 8 ? 1 : 0.5) * (s % 64 >= 32 ? 1 : 1));
  }
  function tick() {
    while (nextT < ctx.currentTime + LOOK) { play(step, nextT); step++; nextT += STEP; }
  }
  function applyMix(name, now) {
    var m = MIX[name] || MIX.top; now = now || ctx.currentTime;
    ["d", "b", "g", "p", "a"].forEach(function (k) { layers[k].gain.setTargetAtTime(m[k], now, 0.35); });
    filt.frequency.setTargetAtTime(m.f, now, 0.4);
  }

  window.NiddlSoundtrack = {
    start: function (c, dest, mp3) {
      if (mp3) {
        if (!audioEl) { audioEl = new Audio(mp3); audioEl.loop = true; audioEl.crossOrigin = "anonymous"; var src = c.createMediaElementSource(audioEl); mp3Gain = c.createGain(); mp3Gain.gain.value = 0.9; src.connect(mp3Gain).connect(dest); ctx = c; tapAnalyser(c, mp3Gain); }
        audioEl.play().catch(function () { }); playing = true; return;
      }
      if (!ctx) setup(c, dest);
      if (playing) return; playing = true;
      step = 0; nextT = ctx.currentTime + 0.08;
      out.gain.cancelScheduledValues(ctx.currentTime); out.gain.setTargetAtTime(1, ctx.currentTime, 0.4);
      applyMix(cur); timer = setInterval(tick, 25); tick();
    },
    stop: function () {
      if (audioEl) { audioEl.pause(); playing = false; return; }
      if (!ctx || !playing) return; playing = false;
      out.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      var tm = timer; setTimeout(function () { if (!playing) clearInterval(tm); }, 900);
    },
    section: function (name) {
      if (name === cur) return; var prev = cur; cur = name;
      if (audioEl && mp3Gain) { var lvl = { intro: 0.7, story: 0.55, tv: 0.4, outro: 0.5 }[name] || 0.9; mp3Gain.gain.setTargetAtTime(lvl, ctx.currentTime, 0.4); return; }
      if (!ctx || !playing) return;
      applyMix(name);
      if (prev === "intro" && name === "top") crash();
      else if ((MIX[name] || {}).g > 0.7 && (MIX[prev] || {}).g <= 0.7) crash();
    },
    crash: function () { if (playing && ctx && !audioEl) crash(); },
    get playing() { return playing; },
    /* Pegel für die Visuals: bass/mid/high 0..1 und das Spektrum */
    levels: function () {
      if (!analyser || !playing) return null;
      analyser.getByteFrequencyData(fbuf);
      function avg(a, b) { var s = 0; for (var i = a; i < b; i++) s += fbuf[i]; return s / (b - a) / 255; }
      return { bass: avg(1, 7), mid: avg(7, 40), high: avg(40, 160), spec: fbuf };
    },
    get name() { return audioEl ? "Eigener Soundtrack" : "N!DDL Website-Soundtrack"; }
  };
})();
