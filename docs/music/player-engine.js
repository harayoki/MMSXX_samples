// Official Pico PLAYER UI 1.0.0 extracted without changes from the prior bundled PLAYER.
// Its sound engine is provided by the official 0.41.0 MIN-split runtime.
// JavaScript source: Copyright 2026 harayoki. All rights reserved.
(() => {
  const E = window.MMSXX?.sound;
  if (E?.SOUND_VERSION !== "0.41.0" || !E.core?.["mml.js"] || !E.ChipTuneSound) {
    throw new Error("MMSXX 0.41.0 MIN-split engine must load before Pico PLAYER");
  }
  // Keep the public legacy API used by existing song-specific player.js files.
  const mml = E.core["mml.js"];
  const tones = E.core["tones.js"];
  Object.assign(E, mml, tones);
  const { ChipTuneSound, SOUND_VERSION } = E;
  const { splitVoices, compileMML, countOldStyle, WAVEFORMS, ENVELOPES } = mml;
  // tool/ui/version.js
  var PLAYER_VERSION = "1.0.0";

  // tool/core/tomml.js
  var NAMES = ["c", "c+", "d", "d+", "e", "f", "f+", "g", "g+", "a", "a+", "b"];
  var LENS = [
    [16, "1"],
    [12, "2."],
    [8, "2"],
    [6, "4."],
    [4, "4"],
    [3, "8."],
    [2, "8"],
    [1, "16"]
  ];
  var midiOf = (freq) => Math.round(69 + 12 * Math.log2(freq / 440));
  function spell(head, cells) {
    const out = [];
    let left = cells;
    while (left > 0) {
      const hit = LENS.find(([n]) => n <= left);
      if (!hit) break;
      out.push(head + hit[1]);
      left -= hit[0];
    }
    return out.join("&");
  }
  function eventsToMML(tracks, opts = {}) {
    const tempo = opts.tempo || 120;
    const from = opts.from ?? 0;
    const to = opts.to ?? Infinity;
    const unit = 60 / tempo / 4;
    const cell = (sec) => Math.round(sec / unit);
    const wave = opts.waveName || ((n) => String(n));
    const env = opts.envName || ((n) => String(n));
    const out = [];
    let head = true;
    for (const t of tracks) {
      const notes = (t.events || []).filter((e) => e.t >= from - 1e-6 && e.t < to - 1e-6).sort((a, b) => a.t - b.t);
      if (!notes.length) continue;
      const L = [];
      if (t.name) L.push(`#ch ${t.name}`);
      if (t.role) L.push(`#role ${t.role}`);
      const body = [];
      if (head) {
        body.push(`t${tempo}`);
        head = false;
      }
      let at = cell(from);
      let oct = null, vol = null, wv = null, ev = null;
      for (const e of notes) {
        const start = cell(e.t);
        if (start > at) body.push(spell("r", start - at));
        if (start < at) continue;
        if (e.wave !== wv) {
          body.push(`@{${wave(e.wave)}}`);
          wv = e.wave;
        }
        if (e.env !== ev) {
          body.push(`@e{${env(e.env)}}`);
          ev = e.env;
        }
        if (e.vol !== vol) {
          body.push(`v${e.vol}`);
          vol = e.vol;
        }
        const midi = midiOf(e.freq);
        const o = Math.floor(midi / 12) - 1;
        if (o !== oct) {
          body.push(`o${o}`);
          oct = o;
        }
        const cells = Math.max(1, cell(e.t + e.dur) - start);
        body.push(spell(NAMES[(midi % 12 + 12) % 12], cells));
        at = start + cells;
      }
      if (Number.isFinite(to) && cell(to) > at) body.push(spell("r", cell(to) - at));
      L.push(body.join(" "));
      out.push(L.join("\n"));
    }
    return out.join("\n\n");
  }

  // tool/core/wav.js
  function writeWAV(samples, rate = 44100) {
    const each = samples.length && typeof samples[0] === "object" ? samples : [samples];
    const ch = each.length;
    const n = each[0].length;
    const size = n * ch * 2;
    const out = new Uint8Array(44 + size);
    const dv = new DataView(out.buffer);
    const put = (at, s) => {
      for (let i = 0; i < s.length; i++) out[at + i] = s.charCodeAt(i);
    };
    put(0, "RIFF");
    dv.setUint32(4, 36 + size, true);
    put(8, "WAVE");
    put(12, "fmt ");
    dv.setUint32(16, 16, true);
    dv.setUint16(20, 1, true);
    dv.setUint16(22, ch, true);
    dv.setUint32(24, rate, true);
    dv.setUint32(28, rate * ch * 2, true);
    dv.setUint16(32, ch * 2, true);
    dv.setUint16(34, 16, true);
    put(36, "data");
    dv.setUint32(40, size, true);
    for (let i = 0; i < n; i++) {
      for (let c = 0; c < ch; c++) {
        const v = Math.max(-1, Math.min(1, each[c][i]));
        dv.setInt16(44 + (i * ch + c) * 2, Math.round(v * 32767), true);
      }
    }
    return out;
  }

  // tool/core/check/loudness.js
  var SHELF = { f0: 1681.974450955533, gainDb: 3.999843853973347, q: 0.7071752369554196 };
  var HIGHPASS = { f0: 38.13547087602444, q: 0.5003270373238773 };
  function shelfCoeffs(rate) {
    const k = Math.tan(Math.PI * SHELF.f0 / rate);
    const vh = Math.pow(10, SHELF.gainDb / 20);
    const vb = Math.pow(vh, 0.4996667741545416);
    const a0 = 1 + k / SHELF.q + k * k;
    return {
      b0: (vh + vb * k / SHELF.q + k * k) / a0,
      b1: 2 * (k * k - vh) / a0,
      b2: (vh - vb * k / SHELF.q + k * k) / a0,
      a1: 2 * (k * k - 1) / a0,
      a2: (1 - k / SHELF.q + k * k) / a0
    };
  }
  function highpassCoeffs(rate) {
    const k = Math.tan(Math.PI * HIGHPASS.f0 / rate);
    const a0 = 1 + k / HIGHPASS.q + k * k;
    return {
      b0: 1,
      b1: -2,
      b2: 1,
      a1: 2 * (k * k - 1) / a0,
      a2: (1 - k / HIGHPASS.q + k * k) / a0
    };
  }
  function biquad(x, c) {
    const y = new Float32Array(x.length);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < x.length; i++) {
      const v = c.b0 * x[i] + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
      x2 = x1;
      x1 = x[i];
      y2 = y1;
      y1 = v;
      y[i] = v;
    }
    return y;
  }
  var lkfs = (z) => z > 0 ? -0.691 + 10 * Math.log10(z) : -Infinity;
  var mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  function integratedLoudness(channels, rate) {
    if (!channels.length || !channels[0].length) return -Infinity;
    const shelf = shelfCoeffs(rate);
    const hp = highpassCoeffs(rate);
    const weighted = channels.map((c) => biquad(biquad(c, shelf), hp));
    const block = Math.round(rate * 0.4);
    const step = Math.round(rate * 0.1);
    const n = weighted[0].length;
    if (n < block) return -Infinity;
    const zs = [];
    for (let start = 0; start + block <= n; start += step) {
      let z = 0;
      for (const w of weighted) {
        let sum = 0;
        for (let i = start; i < start + block; i++) sum += w[i] * w[i];
        z += sum / block;
      }
      zs.push(z);
    }
    const loud = zs.filter((z) => lkfs(z) > -70);
    if (!loud.length) return -Infinity;
    const gate = lkfs(mean(loud)) - 10;
    const used = loud.filter((z) => lkfs(z) > gate);
    if (!used.length) return -Infinity;
    return lkfs(mean(used));
  }
  var OVERSAMPLE = 4;
  var HALF_TAPS = 16;
  var taps = null;
  function interpolationTaps() {
    if (taps) return taps;
    taps = [];
    for (let phase = 0; phase < OVERSAMPLE; phase++) {
      const h = new Float64Array(HALF_TAPS * 2 + 1);
      for (let k = -HALF_TAPS; k <= HALF_TAPS; k++) {
        const t = k - phase / OVERSAMPLE;
        const sinc = t === 0 ? 1 : Math.sin(Math.PI * t) / (Math.PI * t);
        const p = (k + HALF_TAPS) / (HALF_TAPS * 2);
        const win = 0.42 - 0.5 * Math.cos(2 * Math.PI * p) + 0.08 * Math.cos(4 * Math.PI * p);
        h[k + HALF_TAPS] = sinc * win;
      }
      taps.push(h);
    }
    return taps;
  }
  function truePeak(channels) {
    const h = interpolationTaps();
    let peak = 0;
    for (const x of channels) for (let i = 0; i < x.length; i++) {
      const a = Math.abs(x[i]);
      if (a > peak) peak = a;
    }
    if (peak === 0) return 0;
    const near = peak * 0.25;
    let found = peak;
    for (const x of channels) {
      for (let i = HALF_TAPS; i < x.length - HALF_TAPS; i++) {
        if (Math.abs(x[i]) < near) continue;
        for (let phase = 1; phase < OVERSAMPLE; phase++) {
          const t = h[phase];
          let v = 0;
          for (let k = -HALF_TAPS; k <= HALF_TAPS; k++) v += t[k + HALF_TAPS] * x[i + k];
          const a = Math.abs(v);
          if (a > found) found = a;
        }
      }
    }
    return found;
  }
  var toDb = (v) => v > 0 ? 20 * Math.log10(v) : -Infinity;
  function measureLoudness(channels, rate) {
    let peak = 0, clipped = 0;
    for (const c of channels) {
      for (let i = 0; i < c.length; i++) {
        const a = Math.abs(c[i]);
        if (a > peak) peak = a;
        if (a >= 1) clipped++;
      }
    }
    return {
      lufs: integratedLoudness(channels, rate),
      peakDb: toDb(peak),
      truePeakDb: toDb(truePeak(channels)),
      clipped
    };
  }

  // tool/core/check/fit.js
  var FIT_TARGET = { lufs: -14, peak: -1 };
  var SONG_TARGET = { lufs: -16, peak: -1 };
  var MAX_GAIN = 8;
  function fitGain(level, target = {}) {
    const wantLufs = target.lufs ?? FIT_TARGET.lufs;
    const wantPeak = target.peak ?? FIT_TARGET.peak;
    if (!Number.isFinite(level.lufs) || !Number.isFinite(level.truePeakDb)) {
      return { gain: 1, db: 0, by: "peak", wantDb: 0, roomDb: 0 };
    }
    const wantDb = wantLufs - level.lufs;
    const roomDb = wantPeak - level.truePeakDb;
    const db = Math.min(wantDb, roomDb);
    const by = wantDb <= roomDb ? "lufs" : "peak";
    const gain = Math.min(MAX_GAIN, Math.max(0, 10 ** (db / 20)));
    return { gain, db, by, wantDb, roomDb };
  }

  // tool/ui/player.js
  var COPYRIGHT = "2026 harayoki";
  var PLAYER_CSS = `
.mmsxx-player{ font-family:var(--mono); font-size:13px; line-height:1.55; color:var(--ink); }
.mmsxx-player [hidden]{ display:none !important; }
/* \u64CD\u4F5C\u306E\u5E2F\u3002\u62BC\u3059\u3082\u306E\u304C 1 \u304B\u6240\u306B\u307E\u3068\u307E\u3063\u3066\u3044\u306A\u3044\u3068\u3001\u62BC\u3057\u306B\u884C\u304F\u306E\u306B\u76EE\u304C\u6CF3\u3050 */
.mmsxx-player .deck{
  background:var(--panel); border:1px solid var(--line); padding:13px 14px;
}
.mmsxx-player .row{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.mmsxx-player .row + .row{ margin-top:11px; }
/* \u6B8B\u308A\u3092\u958B\u304F\u62BC\u3057\u3069\u3053\u308D\u3002\u3075\u3064\u3046\u306E\u30DC\u30BF\u30F3\u306E\u5F62\u306B\u3059\u308B\u3068\u3001\u4F55\u304B\u304C\u8D77\u304D\u308B\u3082\u306E\u306B
   \u898B\u3048\u3066\u3057\u307E\u3046\u3002\u67A0\u3092\u5916\u3057\u3066\u3001\u62BC\u3059\u3068\u5730\u304C\u53CD\u8EE2\u3059\u308B\u3060\u3051\u306B\u3059\u308B(2026-09-15) */
.mmsxx-player button.dots{
  margin-left:auto; border:0; padding:2px 8px 6px; line-height:1;
  font-size:16px; letter-spacing:.12em; color:var(--dim); border-radius:2px;
}
.mmsxx-player button.dots:hover{ color:var(--amber); border:0; }
.mmsxx-player button.dots[aria-pressed="true"]{ background:var(--sunk); color:var(--ink); }
/* \u7248\u3068\u6A29\u5229\u3092\u51FA\u3059\u3068\u3053\u308D\u3002\u3075\u3060\u3093\u306F\u8981\u3089\u306A\u3044\u306E\u3067\u3001\u5C0F\u3055\u304F\u7F6E\u3044\u3066\u7573\u3093\u3067\u304A\u304F */
.mmsxx-player button.help{
  border:0; padding:3px 6px; line-height:1;
  font-size:12px; color:var(--dim); border-radius:2px;
}
.mmsxx-player button.help:hover{ color:var(--amber); border:0; }
.mmsxx-player button.help[aria-pressed="true"]{ background:var(--sunk); color:var(--ink); }
/* ? \u306E\u5439\u304D\u51FA\u3057\u3002\u62BC\u3057\u3069\u3053\u308D\u306E\u3059\u3050\u6A2A\u306B\u51FA\u3059\u3002\u884C\u3068\u3057\u3066\u4E26\u3079\u308B\u3068\u3001
   \u3075\u3060\u3093\u8981\u3089\u306A\u3044\u3082\u306E\u304C\u5834\u6240\u3092\u53D6\u308A\u3064\u3065\u3051\u308B(2026-09-16) */
.mmsxx-player .ver-wrap{ position:relative; display:inline-flex; }
.mmsxx-player .about-ver{
  position:absolute; right:0; bottom:calc(100% + 7px); z-index:3;
  margin:0; padding:7px 10px; white-space:pre; text-align:right;
  font-size:11px; color:var(--ink); line-height:1.6;
  background:var(--panel); border:1px solid var(--line-hi); border-radius:3px;
  box-shadow:0 2px 8px rgba(0,0,0,.18);
}
/* \u5439\u304D\u51FA\u3057\u306E\u5C3B\u5C3E\u3002\u67A0\u306E\u3076\u3093\u3068\u4E2D\u8EAB\u306E\u3076\u3093\u3092 2 \u679A\u91CD\u306D\u308B */
.mmsxx-player .about-ver::before,
.mmsxx-player .about-ver::after{
  content:''; position:absolute; right:9px; top:100%;
  border:5px solid transparent; border-bottom:0;
}
.mmsxx-player .about-ver::before{ border-top-color:var(--line-hi); }
.mmsxx-player .about-ver::after{ margin-top:-1px; border-top-color:var(--panel); }
/* \u7573\u3080\u3068\u3053\u308D\u3002\u4E2D\u306E\u884C\u306E\u9593\u306F\u3001\u7573\u307E\u306A\u3044\u3068\u304D\u3068\u540C\u3058\u7A7A\u3051\u65B9\u306B\u3059\u308B */
.mmsxx-player .fold .row{ margin-top:11px; }
.mmsxx-player .time{ font-size:12px; color:var(--dim); white-space:nowrap; }
.mmsxx-player .time b{ color:var(--ink); font-weight:600; }
.mmsxx-player input[type=range]{
  width:100%; height:22px; margin:0; display:block;
  accent-color:var(--amber); background:transparent; cursor:pointer;
}
/* \u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u4E0A\u306B A \u3068 B \u306E\u7DDA\u3092\u91CD\u306D\u308B\u3002\u7DDA\u306F\u7D30\u3044\u304C\u3001\u3064\u307E\u3080\u3068\u3053\u308D\u306F\u5E83\u304F\u3068\u308B
   (\u6307\u3067\u3082\u62BC\u305B\u308B\u3088\u3046\u306B)\u3002\u7DDA\u305D\u306E\u3082\u306E\u306B\u5F53\u305F\u308A\u5224\u5B9A\u3092\u6301\u305F\u305B\u308B\u3068\u7D30\u3059\u304E\u3066\u63B4\u3081\u306A\u3044 */
.mmsxx-player .track{ position:relative; flex:1; min-width:140px; }
.mmsxx-player .ab{
  position:absolute; top:0; bottom:0; width:13px; margin-left:-6px;
  cursor:ew-resize; touch-action:none; z-index:2;
}
.mmsxx-player .ab::before{
  content:""; position:absolute; left:6px; top:1px; bottom:1px; width:1px;
  background:var(--teal);
}
.mmsxx-player .ab::after{
  content:attr(data-n); position:absolute; left:8px; top:0;
  font-size:8.5px; line-height:1; color:var(--teal);
}
.mmsxx-player .ab.off{ display:none; }
/* \u5207\u308C\u76EE\u306E\u7DDA\u3002\u62BC\u305B\u306A\u3044\u3088\u3046\u306B\u3057\u3066\u3001\u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u90AA\u9B54\u3092\u3057\u306A\u3044\u3002
   \u7B49\u9593\u9694\u3067\u5165\u308B\u7DB2\u306E\u76EE(#switch)\u306F\u8584\u304F\u3001\u624B\u3067\u5F15\u3044\u305F | \u306F\u6FC3\u304F\u3002
   \u66F2\u306E\u4F5C\u308A\u3068\u3057\u3066\u66F8\u3044\u305F\u3082\u306E\u3068\u3001\u305D\u306E\u5834\u3067\u5F15\u3044\u305F\u3082\u306E\u3092\u898B\u5206\u3051\u308B\u305F\u3081 */
.mmsxx-player .cuts{
  position:absolute; left:0; right:0; top:3px; bottom:3px;
  pointer-events:none; z-index:1;
}
.mmsxx-player .cuts i{
  position:absolute; top:0; bottom:0; width:1px; margin-left:-1px;
  background:var(--ink);
}
.mmsxx-player .cuts i.grid{ opacity:.14; }
.mmsxx-player .cuts i.bar{ opacity:.42; }
/* \u66F2\u306E\u4F5C\u308A\u306E\u7DDA\u3002\u623B\u308B\u5148(LOOP)\u3068\u5F8C\u594F\u306E\u59CB\u307E\u308A(OUTRO)\u3002\u5207\u308C\u76EE\u3068\u306F\u5225\u306E\u8272\u306B\u3057\u3066\u3001
   \u540C\u3058\u3068\u3053\u308D\u306B\u91CD\u306A\u3063\u3066\u3082\u898B\u5206\u3051\u3089\u308C\u308B\u3088\u3046\u306B\u3059\u308B */
.mmsxx-player .cuts i.loop, .mmsxx-player .cuts i.outro{
  background:var(--teal); opacity:.6; width:1px;
}
.mmsxx-player .cuts i.outro{ opacity:.45; }
/* A \u304B\u3089 B \u307E\u3067\u306E\u5E2F\u3002\u62BC\u305B\u306A\u3044\u3088\u3046\u306B\u3057\u3066\u3001\u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u90AA\u9B54\u3092\u3057\u306A\u3044 */
.mmsxx-player .abspan{
  position:absolute; top:2px; bottom:2px; background:var(--teal);
  opacity:.12; pointer-events:none; z-index:1;
}
/* \u97F3\u91CF\u3002\u30DF\u30E5\u30FC\u30C8\u3068 2 \u3064\u51FA\u3059\u3068\u304D\u306F\u67A0\u3092\u5206\u3051\u5408\u3063\u3066\u3001\u3072\u3068\u3064\u306A\u304C\u308A\u306B\u898B\u305B\u308B\u3002
   \u30B9\u30E9\u30A4\u30C0\u30FC\u306F\u77ED\u304F\u3066\u3088\u3044\u3002\u4F4D\u7F6E\u306E\u30B9\u30E9\u30A4\u30C0\u30FC\u3068\u540C\u3058\u5E45\u306B\u3059\u308B\u3068\u3001
   \u3069\u3061\u3089\u304C\u66F2\u306E\u4F4D\u7F6E\u306A\u306E\u304B\u5206\u304B\u3089\u306A\u304F\u306A\u308B */
.mmsxx-player .vol{ display:inline-flex; align-items:center; gap:7px; }
.mmsxx-player .vol input[type=range]{ width:82px; }
.mmsxx-player .vol.joined{
  gap:0; border:1px solid var(--line-hi); border-radius:2px; overflow:hidden;
}
.mmsxx-player .vol.joined button{
  border:0; border-right:1px solid var(--line-hi); border-radius:0; padding:5px 9px;
}
.mmsxx-player .vol.joined input[type=range]{ margin:0 8px 0 7px; }
.mmsxx-player .vol button[aria-pressed="true"]{
  background:var(--ink); color:var(--panel);
}
.mmsxx-player input[type=text]{
  font:inherit; font-size:11px; width:72px; text-align:center;
  color:var(--ink); background:var(--sunk);
  border:1px solid var(--line); border-radius:2px; padding:3px 4px;
}
.mmsxx-player input[type=text]:focus{ outline:none; border-color:var(--amber); }
.mmsxx-player label.sw{ display:inline-flex; align-items:center; gap:5px; font-size:11px; }
.mmsxx-player .lbl{
  font-size:10px; letter-spacing:.09em; text-transform:uppercase;
  color:var(--dim); margin-right:2px;
}
/* \u9078\u3076\u3068\u3053\u308D\u3002\u4E26\u3093\u3060\u30DC\u30BF\u30F3\u3060\u3068\u3001\u3069\u308C\u3068\u3069\u308C\u304C 1 \u3064\u306E\u7D44\u306A\u306E\u304B\u8AAD\u3081\u306A\u3044\u3002
   \u9078\u3076\u3082\u306E\u306F\u9078\u3076\u5F62\u306B\u3059\u308B(2026-09-15) */
.mmsxx-player .pick{
  display:inline-flex; align-items:center; gap:6px;
  font-size:10px; letter-spacing:.09em; text-transform:uppercase; color:var(--dim);
}
.mmsxx-player .pick select{
  font:inherit; font-size:11px; text-transform:none; letter-spacing:0;
  color:var(--ink); background:var(--sunk);
  border:1px solid var(--line-hi); border-radius:2px; padding:4px 6px;
}
.mmsxx-player .pick select:disabled{ opacity:.45; }
.mmsxx-player .chs, .mmsxx-player .marks{ display:flex; flex-wrap:wrap; gap:6px; }
/* \u9078\u629E\u80A2\u3002\u30B0\u30EB\u30FC\u30D7\u3054\u3068\u306B\u3001\u540D\u524D\u3068\u9078\u3079\u308B\u3082\u306E\u3092 1 \u304B\u305F\u307E\u308A\u306B\u3059\u308B */
.mmsxx-player .takes{ display:flex; flex-wrap:wrap; gap:6px 14px; align-items:center; }
.mmsxx-player .take{ display:inline-flex; align-items:center; gap:6px; }
.mmsxx-player .take .grp{ font-size:11px; color:var(--dim); }
/* From top \u306F\u9078\u629E\u80A2\u305C\u3093\u3076\u306B\u52B9\u304F\u3002\u30B0\u30EB\u30FC\u30D7\u306E\u4E26\u3073\u306E\u7D9A\u304D\u306B\u7F6E\u304F\u3068\u3001\u3044\u3061\u3070\u3093\u53F3\u306E
   \u30B0\u30EB\u30FC\u30D7\u3060\u3051\u306B\u639B\u304B\u308B\u3088\u3046\u306B\u898B\u3048\u308B\u306E\u3067\u3001\u884C\u306E\u7AEF\u307E\u3067\u96E2\u3059(2026-09-18) */
.mmsxx-player .row .wide{ margin-left:auto; }
.mmsxx-player .ch{ display:inline-flex; align-items:center; gap:7px; }
/* \u97F3\u91CF\u306B\u5207\u308A\u66FF\u3048\u305F\u3068\u304D\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u3002\u540D\u524D\u30FB\u30B9\u30E9\u30A4\u30C0\u30FC\u30FB\u5272\u5408\u3092 1 \u304B\u305F\u307E\u308A\u306B\u3059\u308B\u3002
   \u9CF4\u3063\u3066\u3044\u308B\u3042\u3044\u3060\u306F\u540D\u524D\u304C\u7425\u73C0\u306B\u70B9\u304F\u3002\u30DC\u30BF\u30F3\u304C\u7121\u3044\u306E\u3067\u67A0\u3092\u5149\u3089\u305B\u3089\u308C\u306A\u3044\u304C\u3001
   \u70B9\u304F\u306E\u306F\u4E00\u77AC\u30FB\u6D88\u3048\u308B\u306E\u306F\u5C11\u3057\u5F15\u304D\u305A\u308B\u3001\u3068\u3044\u3046\u70B9\u3051\u65B9\u306F\u30DC\u30BF\u30F3\u3068\u540C\u3058\u306B\u3059\u308B */
.mmsxx-player .chvol .name{ font-size:11px; transition:color .18s ease-out; }
.mmsxx-player .chvol.hot .name{ color:var(--amber); transition:none; }
.mmsxx-player .chvol input[type=range]{ width:82px; }
.mmsxx-player .chvol .pct{ min-width:3.2em; margin-right:8px; font-size:11px; color:var(--dim);
  font-variant-numeric:tabular-nums; }
.mmsxx-player .chmode{ display:inline-flex; gap:6px; margin-left:auto; }
/* \u30DF\u30E5\u30FC\u30C8\u306E\u30DC\u30BF\u30F3\u306E\u5074\u306B\u6DFB\u3048\u308B\u97F3\u91CF\u3002\u62BC\u305B\u308B\u3082\u306E\u3067\u306F\u306A\u3044\u306E\u3067\u67A0\u306F\u4ED8\u3051\u306A\u3044\u3002
   0% \u307E\u3067\u4E0B\u3052\u305F\u884C\u3060\u3051\u7425\u73C0\u306B\u3059\u308B\u3002\u9ED9\u3063\u3066\u3044\u308B\u306E\u306B\u62BC\u3057\u3066\u3042\u308B\u3088\u3046\u306B\u898B\u3048\u308B\u306E\u3092
   \u9632\u3050\u306E\u304C\u3053\u3053\u306E\u5F79\u76EE\u306A\u306E\u3067\u3001\u305D\u306E 1 \u3064\u3060\u3051\u76EE\u7ACB\u3066\u3070\u3088\u3044 */
.mmsxx-player .ch .lvl{ font-size:9.5px; color:var(--dim); letter-spacing:.04em; }
.mmsxx-player .ch .lvl.off{ color:var(--amber); }
.mmsxx-player .ch .role{ font-size:9.5px; color:var(--dim); letter-spacing:.06em; }
/* 1 \u672C\u3067\u4F55\u58F0\u4F7F\u3046\u304B\u3002\u548C\u97F3\u3092\u9CF4\u3089\u3059\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u30DC\u30BF\u30F3\u306E\u4E2D\u306B\u51FA\u3059\u3002
   \u67A0\u306F\u4ED8\u3051\u306A\u3044\u3002\u30DC\u30BF\u30F3\u306E\u4E2D\u306B\u3082\u3046 1 \u3064\u67A0\u304C\u3042\u308B\u3068\u3001\u62BC\u3057\u3069\u3053\u308D\u304C 2 \u3064\u306B\u898B\u3048\u308B */
.mmsxx-player .ch .voices{
  margin-left:5px; font-size:9.5px; color:var(--teal); letter-spacing:.04em;
}
/* \u62BC\u3057\u3066\u3042\u308B\u3042\u3044\u3060\u306F\u5730\u304C\u53CD\u8EE2\u3059\u308B\u3002\u9752\u7DD1\u306E\u307E\u307E\u3060\u3068\u3001\u660E\u308B\u3044\u5730\u306B\u660E\u308B\u3044\u5B57\u304C
   \u8F09\u3063\u3066\u8AAD\u3081\u306A\u304F\u306A\u308B(\u6697\u3044\u914D\u8272\u3067\u3068\u304F\u306B)\u3002\u5730\u3068\u9006\u306E\u8272\u3092\u7D99\u3044\u3067\u8584\u304F\u3059\u308B */
.mmsxx-player .ch button.sw[aria-pressed="true"] .voices{
  color:inherit; opacity:.75;
}
/* \u3044\u307E\u9CF4\u3063\u3066\u3044\u308B\u30C1\u30E3\u30F3\u30CD\u30EB\u3068\u5C64\u3002\u62BC\u3057\u3066\u3042\u308B\u30DC\u30BF\u30F3\u3060\u3051\u304C\u5149\u308B(\u9ED9\u3089\u305B\u305F\u3082\u306E\u306F
   \u97F3\u91CF\u304C 0 \u306A\u306E\u3067\u5149\u3089\u306A\u3044)\u3002\u7425\u73C0\u306F\u300C\u3044\u307E\u9CF4\u3063\u3066\u3044\u308B\u300D\u306E\u8272(docs/UI.md)\u3002
   \u5730\u306E\u53CD\u8EE2\u306F\u5165 / \u5207\u306B\u4F7F\u3063\u3066\u3044\u308B\u306E\u3067\u3001\u3053\u3061\u3089\u306F\u67A0\u3067\u8A00\u3046\u3002
   \u70B9\u304F\u306E\u306F\u4E00\u77AC\u306A\u306E\u3067\u3001\u6D88\u3048\u308B\u307B\u3046\u3060\u3051\u5C11\u3057\u5F15\u304D\u305A\u308B(2026-09-19) */
.mmsxx-player .ch button.sw,
.mmsxx-player .lanes button.sw{ transition:box-shadow .18s ease-out; }
.mmsxx-player .ch button.sw.hot,
.mmsxx-player .lanes button.sw.hot{
  box-shadow:0 0 0 1px var(--amber), 0 0 6px -1px var(--amber);
  transition:none;
}
/* \u4E2D\u306E\u5C64\u3092\u958B\u304F\u5370\u3002\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u30DC\u30BF\u30F3\u3068\u306F\u5225\u306B\u62BC\u305B\u308B\u5FC5\u8981\u304C\u3042\u308B\u306E\u3067\u3001
   \u30DC\u30BF\u30F3\u306E\u4E2D\u306B\u306F\u5165\u308C\u306A\u3044\u3002\u62BC\u3057\u3069\u3053\u308D\u304C 2 \u3064\u3042\u308B\u3053\u3068\u3092\u5F62\u3067\u8A00\u3046 */
.mmsxx-player .ch button.open{
  border:0; padding:4px 4px; line-height:1; font-size:9px; color:var(--dim);
  border-radius:2px; margin-left:-4px;
}
.mmsxx-player .ch button.open:hover{ color:var(--amber); border:0; }
.mmsxx-player .ch button.open[aria-pressed="true"]{ color:var(--ink); }
/* \u958B\u3044\u305F\u4E2D\u8EAB\u3002\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u4E0B\u306B\u3076\u3089\u4E0B\u3052\u308B\u3002\u884C\u3092\u5206\u3051\u306A\u3044\u3068\u3001
   \u3069\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u3092\u958B\u3044\u305F\u306E\u304B\u5206\u304B\u3089\u306A\u304F\u306A\u308B */
.mmsxx-player .lanes{
  display:flex; flex-wrap:wrap; gap:5px; align-items:center;
  width:100%; margin:-2px 0 2px; padding:0 0 0 14px;
}
.mmsxx-player .lanes .of{ font-size:9.5px; color:var(--dim); letter-spacing:.06em; }
.mmsxx-player .lanes button{ font-size:10px; padding:3px 8px; border-radius:999px; }
/* \u62BC\u3059\u3082\u306E\u306E\u5F62\u3002\u56DB\u89D2\u306F\u4F55\u304B\u304C\u8D77\u304D\u308B\u3082\u306E\u3001\u89D2\u4E38\u306F\u5165 / \u5207(docs/UI.md) */
.mmsxx-player button{
  font:inherit; font-size:11px; color:var(--ink); background:transparent;
  border:1px solid var(--dim); border-radius:2px; padding:5px 9px; cursor:pointer;
}
.mmsxx-player button:hover{ border-color:var(--amber); color:var(--amber); }
.mmsxx-player button:disabled{ opacity:.4; cursor:default; }
.mmsxx-player button:disabled:hover{ border-color:var(--dim); color:var(--ink); }
.mmsxx-player button:focus-visible{ outline:2px solid var(--amber); outline-offset:1px; }
.mmsxx-player button.sw{ border-radius:999px; padding:5px 11px; border-color:var(--line-hi); }
/* \u5408\u56F3\u306E\u30E9\u30F3\u30D7\u3002\u66F2\u306B\u7F6E\u3044\u305F\u5408\u56F3\u3092\u901A\u308B\u3068\u5149\u308B\u3002\u62BC\u3059\u3082\u306E\u3067\u306F\u306A\u3044\u306E\u3067\u3001
   \u30DC\u30BF\u30F3\u306E\u5F62\u306B\u3057\u306A\u3044\u3002\u70B9\u304F\u306E\u3082\u6D88\u3048\u308B\u306E\u3082\u4E00\u77AC\u306B\u3059\u308B\u3002\u3058\u308F\u3063\u3068\u6D88\u3059\u3068\u3001
   \u3044\u3064\u5C4A\u3044\u305F\u306E\u304B\u304C\u8AAD\u3081\u306A\u3044(2026-09-18) */
.mmsxx-player .leds{ display:flex; flex-wrap:wrap; gap:9px; align-items:center; }
/* \u66F2\u306B\u7F6E\u3044\u305F\u5B57\u3002\u30C1\u30E3\u30F3\u30CD\u30EB\u3054\u3068\u306B 1 \u3064\u51FA\u3057\u3066\u3001\u6765\u305F\u9806\u306B\u4E26\u3079\u308B\u3002

   **\u9AD8\u3055\u306F\u5B57\u304C\u51FA\u3066\u3044\u306A\u304F\u3066\u3082\u53D6\u3063\u3066\u304A\u304F\u3002**\u51FA\u5165\u308A\u306E\u305F\u3073\u306B\u4E0B\u306E\u884C\u304C\u52D5\u304F\u3068\u3001
   \u62BC\u3057\u306B\u884C\u3063\u305F\u3082\u306E\u304C\u305A\u308C\u308B\u3002\u67A0 1 \u3064\u3076\u3093(24px)\u3092\u5148\u306B\u78BA\u4FDD\u3057\u3066\u3001
   \u5B57\u306E\u6709\u7121\u3067\u884C\u306E\u9AD8\u3055\u304C\u5909\u308F\u3089\u306A\u3044\u3088\u3046\u306B\u3059\u308B(2026-10-05)\u3002

   **\u6A2A\u306B\u3082\u52D5\u304B\u3055\u306A\u3044\u3002**\u884C\u3092 1 \u5217\u306B\u8A70\u3081\u308B\u30DA\u30FC\u30B8(.row \u3092 display:contents \u306B
   \u3059\u308B\u3082\u306E)\u3067\u306F\u884C\u306E\u7BB1\u304C\u6D88\u3048\u308B\u306E\u3067\u3001\u5B57\u304C\u62BC\u3057\u3069\u3053\u308D\u3068\u540C\u3058\u5217\u306B\u5165\u308A\u3001
   \u5E45\u304C\u5909\u308F\u308B\u305F\u3073\u306B\u300C\u2026\u300D\u304C\u5DE6\u53F3\u306B\u52D5\u3044\u3066\u3044\u305F\u30021 \u3064\u306E\u7BB1(.saidwrap)\u306B\u307E\u3068\u3081\u3066\u3001
   flex-basis:100% \u3067\u5FC5\u305A\u81EA\u5206\u306E\u884C\u3092\u53D6\u3089\u305B\u308B\u3002\u7BB1\u304C 1 \u3064\u306A\u3089\u3001
   \u884C\u3092\u7573\u307E\u308C\u3066\u3082\u5217\u306E\u4E2D\u3067\u6298\u308A\u8FD4\u3059(2026-10-05) */
.mmsxx-player .saidwrap{
  display:flex; align-items:center; gap:10px; flex:0 0 100%; min-width:0;
}
.mmsxx-player .said{
  display:flex; flex-wrap:wrap; gap:7px; align-items:center; min-height:24px;
}
.mmsxx-player .said span{
  padding:2px 7px; border:1px solid var(--line); border-radius:3px;
  line-height:18px; background:var(--panel); color:var(--ink); white-space:pre;
}
.mmsxx-player .said span b{
  font-weight:400; font-size:10.5px; color:var(--dim); margin-right:5px;
}
.mmsxx-player .led{
  display:inline-flex; align-items:center; gap:5px;
  font-size:10.5px; color:var(--dim); white-space:nowrap;
}
.mmsxx-player .led::before{
  content:""; width:7px; height:7px; border-radius:50%;
  border:1px solid var(--line-hi); background:var(--panel);
}
/* \u5C4A\u3044\u305F\u3082\u306E\u306E\u63A7\u3048\u3002\u7573\u3093\u3067\u304A\u304F\u3002\u756A\u53F7\u306F\u3053\u3053\u3067\u3060\u3051\u51FA\u3059(\u30E9\u30F3\u30D7\u306F\u540D\u524D\u3060\u3051) */
.mmsxx-player .cuelog{
  width:100%; max-height:92px; overflow:auto; margin-top:2px;
  background:var(--sunk); border:1px solid var(--line);
  padding:5px 8px; font-size:10.5px; color:var(--dim); line-height:1.5;
}
.mmsxx-player .cuelog div{ white-space:pre; }
.mmsxx-player .led.on::before{
  background:var(--amber); border-color:var(--amber);
}
/* \u3044\u307E\u9CF4\u3063\u3066\u3044\u308B\u3068\u3053\u308D\u306E\u672D(\u8DF3\u3076\u5148\u306E\u4E00\u89A7)\u3002\u62BC\u3057\u3066\u3042\u308B\u304B\u3069\u3046\u304B\u3068\u306F\u5225\u306E\u8A71\u306A\u306E\u3067\u3001
   \u5730\u3092\u53CD\u8EE2\u3055\u305B\u305A\u3001\u8272\u3068\u67A0\u3060\u3051\u3067\u8A00\u3046 */
.mmsxx-player .marks button.now{ border-color:var(--amber); color:var(--amber); }
.mmsxx-player button.sw[aria-pressed="true"]{
  background:var(--ink); color:var(--panel); border-color:var(--ink);
}
/* \u984C\u3068\u89E3\u8AAC\u3002\u66F2\u304C\u540D\u4E57\u308B\u3082\u306E\u306A\u306E\u3067\u3001\u62BC\u3059\u3068\u3053\u308D\u306E\u5916\u306B\u7F6E\u304F */
.mmsxx-player .about{ margin:0 0 9px; }
.mmsxx-player .about b{ font-size:12px; font-weight:600; color:var(--ink); }
/* \u984C\u3068\u30D0\u30FC\u30B8\u30E7\u30F3\u306E\u884C\u3002\u984C\u306F\u5DE6\u3001\u30D0\u30FC\u30B8\u30E7\u30F3\u306F\u53F3\u7AEF\u3002\u540C\u3058\u66F2\u3092\u4F55\u5EA6\u3082\u76F4\u3059\u306E\u3067\u3001
   \u3044\u307E\u9CF4\u3063\u3066\u3044\u308B\u306E\u304C\u3069\u308C\u306A\u306E\u304B\u304C\u5206\u304B\u308B\u3088\u3046\u306B\u3059\u308B(#version)\u3002
   1 \u884C\u306B\u4E26\u3079\u308B\u306E\u306B\u56F2\u307F\u304C\u8981\u308B\u3002b \u3068 span \u3092\u4E26\u3079\u305F\u3060\u3051\u3060\u3068\u3001
   \u984C\u304C\u9577\u3044\u3068\u304D\u306B\u30D0\u30FC\u30B8\u30E7\u30F3\u304C\u4E0B\u3078\u6298\u308A\u8FD4\u3059(2026-09-19) */
.mmsxx-player .about .head{
  display:flex; align-items:baseline; gap:10px;
}
.mmsxx-player .about .ver{
  margin-left:auto; font-size:10px; font-weight:400; color:var(--dim);
  white-space:nowrap;
}
/* \u3044\u307E\u52B9\u3044\u3066\u3044\u308B\u6A5F\u68B0(#machine)\u3002\u984C\u306E\u96A3\u306B\u7F6E\u304F\u3002\u7248\u3092\u5207\u308A\u66FF\u3048\u308B\u3068\u5909\u308F\u308B\u306E\u3067\u3001
   \u91E3\u308A\u5408\u3044\u304C\u5909\u308F\u3063\u305F\u3053\u3068\u304C\u898B\u3048\u308B\u3088\u3046\u306B\u3059\u308B\u3002\u5730\u3092\u53CD\u8EE2\u3055\u305B\u306A\u3044\u306E\u306F\u3001
   \u62BC\u305B\u308B\u3082\u306E\u3067\u306F\u306A\u3044\u305F\u3081 */
.mmsxx-player .about .mach{
  font-size:10px; color:var(--teal); letter-spacing:.04em; white-space:nowrap;
}
/* \u7248\u3068\u7D44\u306E\u62BC\u3057\u3069\u3053\u308D\u3002\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u4E26\u3073\u3068\u540C\u3058\u5F62\u306B\u3059\u308B\u3002
   \u7248\u306F\u30E9\u30B8\u30AA(1 \u3064\u3060\u3051)\u3001\u7D44\u306F\u30C1\u30A7\u30C3\u30AF\u30DC\u30C3\u30AF\u30B9(\u91CD\u306A\u308B) */
.mmsxx-player .grp{ display:flex; flex-wrap:wrap; gap:6px 12px; align-items:center; }
.mmsxx-player .grp label{
  display:inline-flex; align-items:center; gap:5px; font-size:11px; cursor:pointer;
}
/* \u7248\u3067\u9ED9\u3063\u3066\u3044\u308B\u30C1\u30E3\u30F3\u30CD\u30EB\u3002\u884C\u306F\u6D88\u3055\u305A\u306B\u8584\u304F\u3059\u308B\u3002\u4E26\u3073\u304C\u52D5\u304F\u3068\u8AAD\u307F\u306B\u304F\u3044\u3002
   \u62BC\u305B\u308B\u307E\u307E\u306B\u3059\u308B\u3068\u3001\u81EA\u5206\u3067\u6D88\u3057\u305F\u306E\u304B\u3069\u3061\u3089\u304B\u5206\u304B\u3089\u306A\u304F\u306A\u308B */
.mmsxx-player .ch.gone{ opacity:.4; }
.mmsxx-player .ch.gone button{ cursor:default; }
.mmsxx-player .about p{
  margin:4px 0 0; font-size:11px; line-height:1.7; color:var(--dim);
  white-space:pre-line;
}
/* \u66F8\u304D\u51FA\u3057\u3066\u3044\u308B\u3042\u3044\u3060\u306E\u8986\u3044\u3002\u62BC\u3059\u3068\u3053\u308D\u3092\u6697\u304F\u3057\u3066\u3001\u9032\u307F\u5177\u5408\u3060\u3051\u898B\u305B\u308B\u3002
   \u6642\u9593\u304C\u304B\u304B\u308B\u306E\u3067\u3001\u6B62\u307E\u3063\u305F\u3088\u3046\u306B\u898B\u3048\u306A\u3044\u3088\u3046\u306B\u3059\u308B(2026-09-16) */
.mmsxx-player{ position:relative; }
.mmsxx-player.busy .deck{ opacity:.35; pointer-events:none; }
/* \u5E2F\u306F\u307B\u304B\u306E\u62BC\u3059\u3068\u3053\u308D\u3068\u4F3C\u305B\u306A\u3044\u3002\u592A\u304F\u3057\u3066\u3001\u8272\u3082\u5206\u3051\u308B \u2014
   \u7425\u73C0\u306F\u62BC\u305B\u308B\u3082\u306E\u3001\u5730\u306E\u53CD\u8EE2\u306F\u5165 / \u5207\u306B\u4F7F\u3063\u3066\u3044\u308B\u306E\u3067\u3001\u9032\u307F\u5177\u5408\u306F\u9752\u7DD1\u306B\u3059\u308B\u3002
   \u6570\u306F\u305D\u306E\u96A3\u306B\u5927\u304D\u304F\u51FA\u3059(2026-09-16) */
.mmsxx-player .veil{
  position:absolute; left:8px; right:8px; top:50%; transform:translateY(-50%);
  display:flex; align-items:center; gap:12px; z-index:3;
  padding:12px 14px; background:var(--panel); border:1px solid var(--line-hi);
  border-radius:3px; box-shadow:0 2px 10px rgba(0,0,0,.18);
}
.mmsxx-player .veil .bar{
  flex:1; height:16px; background:var(--sunk);
  border:1px solid var(--line-hi); border-radius:8px; overflow:hidden;
}
.mmsxx-player .veil .bar span{
  display:block; height:100%; width:0; background:var(--teal);
  transition:width .2s linear;
}
.mmsxx-player .veil .pct{
  font-size:15px; font-weight:600; color:var(--ink);
  min-width:52px; text-align:right; font-variant-numeric:tabular-nums;
}
/* \u713C\u3044\u305F\u3082\u306E\u3092\u7F6E\u304F\u3068\u3053\u308D\u3002\u67A0\u306E\u4E2D\u3067\u306F\u843D\u3068\u3059\u306E\u3092\u65AD\u3089\u308C\u308B\u3053\u3068\u304C\u3042\u308B\u306E\u3067\u3001
   \u97F3\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306B\u633F\u3057\u3066\u3001\u305D\u3061\u3089\u306E menu \u304B\u3089\u4FDD\u5B58\u3057\u3066\u3082\u3089\u3046(2026-09-16) */
.mmsxx-player .wavnote{ margin:9px 0 0; }
.mmsxx-player .got{ display:flex; align-items:center; gap:10px; margin:9px 0 0; }
.mmsxx-player .got audio{ flex:1; min-width:180px; height:32px; }
.mmsxx-player .got a{
  font-size:11px; color:var(--amber); text-decoration:none;
  border:1px solid var(--line-hi); border-radius:2px; padding:5px 9px; white-space:nowrap;
}
.mmsxx-player .got a:hover{ border-color:var(--amber); }
/* \u6E21\u3055\u308C\u305F MML \u3092\u8AAD\u307E\u305B\u308B\u3068\u3053\u308D\u3002\u30DA\u30FC\u30B8\u306B\u91CD\u306D\u3066\u51FA\u3059\u3002
   \u8AAD\u3080\u305F\u3081\u306E\u3082\u306E\u306A\u306E\u3067\u3001\u62BC\u3057\u3069\u3053\u308D\u3068\u540C\u3058\u5927\u304D\u3055\u3060\u3068\u5B57\u304C\u5C0F\u3055\u3059\u304E\u308B\u3002
   \u4E0B\u304C\u898B\u3048\u3066\u3044\u308B\u3068\u3001\u9CF4\u3089\u3057\u306A\u304C\u3089\u8AAD\u3081\u308B\u3088\u3046\u306B\u898B\u3048\u3066\u3001\u5B9F\u969B\u306F\u62BC\u305B\u306A\u3044 */
.mmsxx-player .srcwrap{
  position:fixed; inset:0; z-index:20; display:flex;
  align-items:center; justify-content:center; padding:20px;
  background:rgba(0,0,0,.45);
}
.mmsxx-player .srcbox{
  display:flex; flex-direction:column; gap:9px;
  width:min(900px, 100%); max-height:86vh; padding:12px 13px;
  background:var(--panel); border:1px solid var(--line-hi); border-radius:3px;
  box-shadow:0 4px 18px rgba(0,0,0,.3);
}
.mmsxx-player .srchead{ display:flex; align-items:center; gap:10px; }
.mmsxx-player .srchead button{ margin-left:auto; }
.mmsxx-player .src{
  flex:1; min-height:min(55vh, 420px); width:100%; padding:10px 11px;
  font-family:var(--mono); font-size:13px; line-height:1.7; color:var(--ink);
  background:var(--sunk); border:1px solid var(--line); border-radius:2px;
  resize:none; white-space:pre; overflow:auto;
}
/* \u5199\u3057\u305F\u5B57\u3092\u51FA\u3059\u3068\u3053\u308D\u3002\u5199\u305B\u306A\u3044\u7F6E\u304D\u65B9\u304C\u3042\u308B\u306E\u3067\u3001\u5FC5\u305A\u898B\u3048\u308B\u3088\u3046\u306B\u3059\u308B */
.mmsxx-player .out{
  display:block; width:100%; margin:9px 0 0; padding:8px 9px;
  font:inherit; font-size:11px; line-height:1.6; color:var(--ink);
  background:var(--sunk); border:1px solid var(--line); border-radius:2px;
  resize:vertical; white-space:pre; overflow:auto;
}
.mmsxx-player .note{ font-size:11px; color:var(--dim); margin:7px 0 0; }
/* \u6C17\u3092\u3064\u3051\u3066\u307B\u3057\u3044\u3053\u3068\u3002\u7425\u73C0\u3002\u9CF4\u3089\u305B\u3066\u306F\u3044\u308B */
.mmsxx-player .note.bad{ color:var(--amber); }
/* \u76F4\u3059\u3068\u3053\u308D\u304C\u3042\u3063\u3066\u3001\u9CF4\u3089\u305B\u306A\u3044\u3068\u304D\u3002\u65E2\u5B9A\u306F\u8D64\u3002
   \u7425\u73C0\u306F\u300C\u62BC\u305B\u308B\u30FB\u9CF4\u3063\u3066\u3044\u308B\u300D\u306B\u4F7F\u3063\u3066\u3044\u308B\u306E\u3067\u3001\u6B62\u307E\u3063\u3066\u3044\u308B\u3053\u3068\u3092\u540C\u3058\u8272\u3067
   \u8A00\u3046\u3068\u8AAD\u307F\u5206\u3051\u3089\u308C\u306A\u3044\u3002\u30DA\u30FC\u30B8\u304C --err \u3092\u7F6E\u3051\u3070\u3001\u305D\u3061\u3089\u304C\u52DD\u3064 */
.mmsxx-player .note.err{ color:var(--err, #c62f26); }
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]) .mmsxx-player .note.err{ color:var(--err, #ff7a6e); }
}
:root[data-theme="dark"] .mmsxx-player .note.err{ color:var(--err, #ff7a6e); }
`;
  var clock = (sec) => {
    const s = Math.max(0, Math.floor(sec));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  function mountPlayer(root, opts = {}) {
    const audio = opts.audio || new ChipTuneSound();
    const cutGap = Number.isFinite(Number(opts.cutGap)) ? Number(opts.cutGap) : 1;
    const NAME = "__player__";
    root.classList.add("mmsxx-player");
    root.textContent = "";
    root.innerHTML = `
    <div class="srcwrap" data-p="srcwrap" hidden>
      <div class="srcbox">
        <div class="srchead">
          <span class="lbl">MML</span>
          <span class="lbl" data-p="srcsize"></span>
          <button type="button" data-p="srcclose">Close</button>
        </div>
        <textarea class="src" data-p="src" readonly
                  aria-label="The MML this player was given"></textarea>
      </div>
    </div>
    <div class="about" data-p="about" hidden>
      <div class="head"><b data-p="title"></b><span class="mach" data-p="mach" hidden></span><span class="ver" data-p="songver" hidden></span></div>
      <p data-p="abouttext"></p>
    </div>
    <div class="deck">
      <div class="row">
        <button type="button" data-p="play">Play</button>
        <button type="button" data-p="stop">Stop</button>
        <span class="track" data-p="track">
          <input type="range" data-p="seek" min="0" max="1000" value="0" step="1"
                 aria-label="Position">
          <span class="cuts" data-p="cuts"></span>
          <span class="abspan" data-p="abspan" hidden></span>
          <span class="ab off" data-p="abA" data-n="A" role="slider"
                aria-label="Repeat from"></span>
          <span class="ab off" data-p="abB" data-n="B" role="slider"
                aria-label="Repeat to"></span>
        </span>
        <span class="time"><b data-p="now">0:00</b> / <span data-p="len">0:00</span></span>
        <span class="lbl" data-p="vollbl">Volume</span>
        <span class="vol" data-p="volwrap">
          <button type="button" data-p="mute" aria-pressed="false" hidden>Mute</button>
          <input type="range" data-p="vol" min="0" max="100" value="100" step="1"
                 aria-label="Volume">
        </span>
      </div>
      <div class="row" data-p="deck2">
        <button type="button" class="sw" data-p="rept" aria-pressed="true">Repeat all</button>
        <label class="pick" data-p="looplbl">Main loops
          <select data-p="loops"></select>
        </label>
        <button type="button" class="sw" data-p="stereo" aria-pressed="true"
                title="Export the WAV in stereo. Turn it off for mono.">Stereo</button>
        <button type="button" data-p="wav" title="Export WAV">&darr; WAV</button>
        <button type="button" data-p="level"
                title="Measure the loudness and suggest a #gain. It does not change the sound"
                >Level</button>
        <button type="button" data-p="mml" title="Export MML">&darr; MML</button>
        <button type="button" class="sw" data-p="showmml" aria-pressed="false"
                aria-expanded="false" title="Show the MML this player was given"
                >Show MML</button>
        <button type="button" class="dots" data-p="open" aria-pressed="false"
                aria-expanded="false" aria-label="More" title="More">&hellip;</button>
        <span class="ver-wrap">
          <button type="button" class="help" data-p="help" aria-pressed="false"
                  aria-expanded="false" aria-label="About" title="About">?</button>
          <span class="about-ver" role="status" data-p="ver" hidden></span>
        </span>
      </div>
      <div class="row" data-p="textrow" hidden>
        <span class="saidwrap">
          <span class="lbl">Text</span>
          <span class="said" data-p="said"></span>
        </span>
      </div>
      <p class="note bad wavnote" data-p="wavnote" hidden></p>
      <div class="got" data-p="got" hidden>
        <audio controls data-p="audio"></audio>
        <a data-p="save" download>Save</a>
      </div>
      <div class="fold" data-p="fold" hidden>
      <div class="row" data-p="markrow" hidden>
        <span class="lbl">Jump to</span>
        <span class="marks" data-p="marks"></span>
      </div>
      <div class="row" data-p="takerow" hidden>
        <span class="lbl">Takes</span>
        <span class="takes" data-p="takes"></span>
        <button type="button" class="sw wide" data-p="rew" aria-pressed="false"
                title="Always restart the block, whatever the tune says. Applies to every group"
                >From top</button>
      </div>
      <div class="row" data-p="fxrow" hidden>
        <span class="lbl">Effects</span>
        <span class="marks" data-p="fx"></span>
      </div>
      <div class="row" data-p="edrow" hidden>
        <span class="lbl">Edition</span>
        <span class="grp" data-p="eds"></span>
      </div>
      <div class="row" data-p="setrow" hidden>
        <span class="lbl">Sets</span>
        <span class="grp" data-p="sets"></span>
      </div>
      <div class="row" data-p="chsrow">
        <span class="lbl" data-p="chslbl">Channels</span>
        <span class="chs" data-p="chs"></span>
        <span class="chmode">
          <button type="button" class="sw" data-p="volsw" aria-pressed="false"
                  title="Set each channel's volume. It also goes into the WAV.">Volume</button>
          <button type="button" data-p="volreset" hidden
                  title="Put every channel back to 100%.">Reset</button>
        </span>
      </div>
      <div class="row" data-p="cuerow" hidden>
        <span class="lbl">Cues</span>
        <span class="leds" data-p="leds"></span>
        <button type="button" class="sw" data-p="logsw" aria-pressed="false"
                aria-expanded="false">Log</button>
      </div>
      <div class="row" data-p="logrow" hidden>
        <span class="lbl"></span>
        <div class="cuelog" data-p="cuelog"></div>
      </div>
      <div class="row" data-p="looserow">
        <label class="sw"><input type="checkbox" data-p="loose"> Ignore errors</label>
        <span class="lbl" data-p="loosenote"></span>
      </div>
      <div class="row" data-p="abrow">
        <label class="sw"><input type="checkbox" data-p="abOn"> A &ndash; B</label>
        <button type="button" data-p="setA" title="Set A to the current position">Set A</button>
        <input type="number" data-p="abFrom" aria-label="Repeat from"
               min="0" step="0.1" placeholder="0">
        <span class="lbl">&ndash;</span>
        <input type="number" data-p="abTo" aria-label="Repeat to"
               min="0" step="0.1" placeholder="0">
        <button type="button" data-p="setB" title="Set B to the current position">Set B</button>
        <span class="lbl">sec</span>
        <button type="button" data-p="copy">Copy selection as MML</button>
      </div>
      </div>
    </div>
    <div class="veil" data-p="veil" hidden>
      <div class="bar"><span data-p="barfill"></span></div>
      <span class="pct" data-p="pct">0%</span>
      <button type="button" data-p="cancel">Cancel</button>
    </div>
    <textarea class="out" data-p="out" rows="6" readonly hidden
              aria-label="MML of the selection"></textarea>
    <p class="note" data-p="note"></p>
  `;
    const $ = (k) => root.querySelector(`[data-p="${k}"]`);
    const el = {
      play: $("play"),
      stop: $("stop"),
      seek: $("seek"),
      now: $("now"),
      len: $("len"),
      rept: $("rept"),
      chs: $("chs"),
      marks: $("marks"),
      markrow: $("markrow"),
      takes: $("takes"),
      takerow: $("takerow"),
      note: $("note"),
      deck2: $("deck2"),
      chslbl: $("chslbl"),
      volsw: $("volsw"),
      volreset: $("volreset"),
      open: $("open"),
      fold: $("fold"),
      chsrow: $("chsrow"),
      cuts: $("cuts"),
      fx: $("fx"),
      fxrow: $("fxrow"),
      rew: $("rew"),
      loose: $("loose"),
      loosenote: $("loosenote"),
      looserow: $("looserow"),
      leds: $("leds"),
      cuerow: $("cuerow"),
      said: $("said"),
      textrow: $("textrow"),
      logsw: $("logsw"),
      logrow: $("logrow"),
      cuelog: $("cuelog"),
      help: $("help"),
      ver: $("ver"),
      loops: $("loops"),
      looplbl: $("looplbl"),
      abrow: $("abrow"),
      abOn: $("abOn"),
      abFrom: $("abFrom"),
      abTo: $("abTo"),
      setA: $("setA"),
      setB: $("setB"),
      copy: $("copy"),
      out: $("out"),
      wav: $("wav"),
      stereo: $("stereo"),
      mml: $("mml"),
      level: $("level"),
      showmml: $("showmml"),
      src: $("src"),
      srcwrap: $("srcwrap"),
      srcclose: $("srcclose"),
      srcsize: $("srcsize"),
      veil: $("veil"),
      barfill: $("barfill"),
      pct: $("pct"),
      cancel: $("cancel"),
      got: $("got"),
      audio: $("audio"),
      save: $("save"),
      wavnote: $("wavnote"),
      track: $("track"),
      abA: $("abA"),
      abB: $("abB"),
      abspan: $("abspan"),
      volwrap: $("volwrap"),
      vol: $("vol"),
      mute: $("mute"),
      vollbl: $("vollbl"),
      about: $("about"),
      title: $("title"),
      abouttext: $("abouttext"),
      songver: $("songver"),
      mach: $("mach"),
      edrow: $("edrow"),
      eds: $("eds"),
      setrow: $("setrow"),
      sets: $("sets")
    };
    const showChs = opts.channels !== false;
    const showRept = opts.repeat !== false;
    const showAbout = opts.about !== false;
    const copyMode = opts.copy === void 0 ? true : opts.copy;
    const srcButtons = () => {
      el.showmml.hidden = opts.showMml === false || data !== null;
      el.mml.hidden = data !== null;
      el.copy.hidden = copyMode === false || data !== null;
    };
    el.looserow.hidden = opts.ignoreErrors !== true;
    const showVol = opts.volume !== false;
    const showMute = opts.mute === true;
    el.vol.hidden = !showVol;
    el.mute.hidden = !showMute;
    if (copyMode === "show") el.copy.textContent = "Show selection as MML";
    el.vollbl.hidden = !showVol && !showMute;
    el.volwrap.hidden = !showVol && !showMute;
    el.volwrap.classList.toggle("joined", showVol && showMute);
    el.rept.hidden = !showRept;
    el.looplbl.hidden = !showRept;
    el.chsrow.hidden = !showChs;
    el.deck2.hidden = !showRept;
    let busy = false;
    let quit = false;
    let wavURL = null;
    const inFrame = (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();
    const fxOff = {};
    let restart = false;
    let loose = false;
    let open = opts.open === true;
    const fold = () => {
      el.fold.hidden = !open;
      if (open) drawFx();
      clearNote();
      if (!open) {
        el.out.hidden = true;
        dropWAV();
      }
      el.open.setAttribute("aria-pressed", String(open));
      el.open.setAttribute("aria-expanded", String(open));
    };
    if (opts.loops > 0) audio.loopTimes = opts.loops;
    audio.ignoreSongLoop = opts.repeatAll !== true;
    let marks = [];
    let cuts = { grid: [], bars: [] };
    let loopAt = null, outroAt = null;
    const TEXT_HOLD = 4;
    let played = 0;
    let cues = [];
    let texts = [];
    const said = /* @__PURE__ */ new Map();
    const leds = /* @__PURE__ */ new Map();
    let lastPos = 0;
    let takes = [];
    let dragging = false;
    let from = 0;
    let mml = opts.mml ?? "";
    let data = opts.data ?? null;
    let voices = [];
    const openLanes = /* @__PURE__ */ new Set();
    let chans = [];
    let volMode = false;
    let groups = { groups: [], group: null, sets: [], silent: [], machine: null };
    let total = 0;
    let abFrom = 0;
    let abTo = 0;
    const say = (text, kind) => {
      el.note.textContent = text || "";
      el.note.className = kind ? `note ${kind}` : "note";
    };
    const clearNote = () => {
      if (el.note.classList.contains("bad") || el.note.classList.contains("err")) return;
      say("");
    };
    function reload() {
      audio.stopBGM();
      audio.muteTracks([]);
      for (const { ch, lane } of audio.mutedLanes()) audio.muteLane(ch, lane, false);
      for (const t of chans) audio.muteCues(t.ch, false);
      openLanes.clear();
      from = 0;
      el.out.hidden = true;
      dropWAV();
      read();
      drawGroups();
      drawChannels();
      drawMarks();
      drawTakes();
      drawFx();
      drawLeds();
      clearTexts();
      drawCuts();
      draw();
      srcButtons();
    }
    function read() {
      voices = data ? [] : Array.isArray(mml) ? mml.map((v) => String(v ?? "")).filter((v) => v.trim() !== "") : splitVoices(mml);
      chans = [];
      marks = [];
      total = 0;
      if (data ? !data.length : !voices.length) {
        say("Nothing to play.", "err");
        return false;
      }
      let got = null;
      try {
        if (data) audio.defineBGMData(NAME, data);
        else audio.defineBGM(NAME, voices, loose ? { mode: "loose" } : {});
        got = audio.bgmInfo(NAME);
      } catch (e) {
        say(String(e && e.message ? e.message : e), "err");
        return false;
      }
      chans = got.tracks;
      marks = got.marks;
      cuts = got.switches || { grid: [], bars: [] };
      loopAt = got.loop ? got.loop.from : null;
      outroAt = got.outro ?? null;
      cues = got.cues ?? [];
      texts = got.texts ?? [];
      takes = got.takes ?? [];
      total = got.total;
      if (!got.active) {
        say(got.errors.map((e) => e.text).join(" / "), "err");
        return false;
      }
      groups = audio.bgmGroups(NAME) || { groups: [], group: null, sets: [], silent: [], machine: null };
      const meta = got.meta || {};
      el.title.textContent = meta.title || "";
      el.songver.textContent = meta.version ? `ver ${meta.version}` : "";
      el.songver.hidden = !meta.version;
      el.abouttext.textContent = meta.about || "";
      el.abouttext.hidden = !meta.about;
      el.about.hidden = !showAbout || !(meta.title || meta.about || meta.version || machineText());
      const old = Array.isArray(mml) ? mml.reduce((n, v) => n + countOldStyle(v), 0) : countOldStyle(mml);
      if (old) {
        console.warn(`[ChpTnSnd] MML: \u6307\u793A\u884C\u306E "// #" \u304C ${old} \u884C\u3042\u308A\u307E\u3059\u3002"#" \u3060\u3051\u3067\u66F8\u3051\u307E\u3059("// #" \u306F\u3044\u305A\u308C\u8AAD\u307E\u306A\u304F\u306A\u308A\u307E\u3059)`);
      }
      say("");
      drawLoose(got.problems || []);
      return true;
    }
    function drawLoose(list) {
      const bad2 = list.filter((x) => x.level === "error").length;
      const soft = list.length - bad2;
      if (!list.length) {
        el.loosenote.textContent = "";
        return;
      }
      const part = [];
      if (bad2) part.push(`${bad2} dropped`);
      if (soft) part.push(`${soft} warned`);
      el.loosenote.textContent = part.join(", ");
    }
    function machineText() {
      const m = groups.machine;
      return !m || m === "default" ? "" : m;
    }
    const goneCh = (ch) => (groups.silent || []).includes(ch);
    function drawGroups() {
      const list = groups.groups || [];
      const eds = list.map((g) => g.name);
      const here = list.find((g) => g.name === groups.group);
      const sets = here ? here.sets : [];
      el.edrow.hidden = eds.length < 2;
      el.setrow.hidden = sets.length < 2;
      el.eds.textContent = "";
      el.sets.textContent = "";
      for (const name of eds) {
        const lab = document.createElement("label");
        const i = document.createElement("input");
        i.type = "radio";
        i.name = "mmsxx-edition";
        i.value = name;
        i.checked = name === groups.group;
        i.addEventListener("change", () => {
          pickGroups({ group: name });
        });
        lab.append(i, document.createTextNode(name));
        el.eds.appendChild(lab);
      }
      for (const name of sets) {
        const lab = document.createElement("label");
        const i = document.createElement("input");
        i.type = "checkbox";
        i.value = name;
        i.checked = (groups.sets || []).includes(name);
        i.addEventListener("change", () => {
          const on = [...el.sets.querySelectorAll("input")].filter((x) => x.checked).map((x) => x.value);
          pickGroups({ sets: on });
        });
        lab.append(i, document.createTextNode(name));
        el.sets.appendChild(lab);
      }
    }
    function pickGroups(pick2) {
      groups = audio.selectGroups(NAME, pick2) || groups;
      drawGroups();
      drawChannels();
      draw();
    }
    function drawChannels() {
      el.chs.textContent = "";
      el.volsw.setAttribute("aria-pressed", String(volMode));
      el.volreset.hidden = !volMode;
      if (volMode) {
        drawVolumes();
        return;
      }
      for (const t of chans) {
        const wrap2 = document.createElement("span");
        wrap2.className = "ch";
        if (goneCh(t.ch)) wrap2.classList.add("gone");
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sw";
        b.dataset.ch = String(t.ch);
        b.setAttribute("aria-pressed", String(!audio.isMuted(t.ch)));
        b.textContent = t.name || `ch${t.ch + 1}`;
        b.disabled = goneCh(t.ch);
        b.addEventListener("click", () => {
          audio.muteTrack(t.ch);
          draw();
        });
        if (t.chords && t.voices > 1) {
          wrap2.classList.add("multi");
          const n = document.createElement("span");
          n.className = "voices";
          n.textContent = `\xD7${t.voices}`;
          b.title = `${t.voices} voices at once`;
          b.appendChild(n);
        }
        wrap2.appendChild(b);
        if ((t.lanes || []).length > 1) {
          const o = document.createElement("button");
          o.type = "button";
          o.className = "open";
          o.setAttribute("aria-pressed", String(openLanes.has(t.ch)));
          o.textContent = openLanes.has(t.ch) ? "\u25BE" : "\u25B8";
          o.title = openLanes.has(t.ch) ? "Hide the parts inside" : "Show the parts inside";
          o.addEventListener("click", () => {
            if (openLanes.has(t.ch)) openLanes.delete(t.ch);
            else openLanes.add(t.ch);
            drawChannels();
            draw();
          });
          wrap2.appendChild(o);
        }
        const v = audio.trackVolume(t.ch);
        if (v !== 1) {
          const n = document.createElement("span");
          n.className = "lvl" + (v > 0 ? "" : " off");
          n.textContent = `${Math.round(v * 100)}%`;
          n.title = "Set on the Volume side";
          wrap2.appendChild(n);
        }
        if (t.role) {
          const r = document.createElement("span");
          r.className = "role";
          r.textContent = t.role;
          wrap2.appendChild(r);
        }
        el.chs.appendChild(wrap2);
        if (openLanes.has(t.ch)) el.chs.appendChild(laneRow(t));
      }
    }
    function drawVolumes() {
      for (const t of chans) {
        const wrap2 = document.createElement("label");
        wrap2.className = "ch chvol";
        wrap2.dataset.ch = String(t.ch);
        const off = audio.isMuted(t.ch) || goneCh(t.ch);
        if (off) wrap2.classList.add("gone");
        const name = document.createElement("span");
        name.className = "name";
        name.textContent = t.name || `ch${t.ch + 1}`;
        const r = document.createElement("input");
        r.type = "range";
        r.min = "0";
        r.max = "200";
        r.step = "5";
        r.dataset.chvol = String(t.ch);
        r.value = String(Math.round(audio.trackVolume(t.ch) * 100));
        r.disabled = goneCh(t.ch);
        const pct = document.createElement("span");
        pct.className = "pct";
        const say2 = () => {
          pct.textContent = audio.isMuted(t.ch) ? "muted" : `${r.value}%`;
        };
        say2();
        r.addEventListener("input", () => {
          audio.setTrackVolume(t.ch, Number(r.value) / 100);
          say2();
        });
        wrap2.append(name, r, pct);
        el.chs.appendChild(wrap2);
      }
    }
    el.volsw.addEventListener("click", () => {
      volMode = !volMode;
      drawChannels();
      draw();
    });
    el.volreset.addEventListener("click", () => {
      audio.resetTrackVolumes();
      drawChannels();
    });
    function laneRow(t) {
      const row2 = document.createElement("span");
      row2.className = "lanes";
      const of = document.createElement("span");
      of.className = "of";
      of.textContent = t.name || `ch${t.ch + 1}`;
      row2.appendChild(of);
      for (const lane of t.lanes) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sw";
        b.dataset.lane = `${t.ch}/${lane.name}`;
        b.setAttribute("aria-pressed", String(!lane.muted));
        b.textContent = lane.label || lane.name;
        if (lane.label && lane.label !== lane.name) b.title = lane.name;
        b.addEventListener("click", () => {
          audio.muteLane(t.ch, lane.name);
          draw();
        });
        row2.appendChild(b);
      }
      return row2;
    }
    const LOOPS = [["1", 1], ["2", 2], ["3", 3], ["4", 4], ["8", 8], ["Endless", Infinity]];
    function drawLoops() {
      el.loops.textContent = "";
      for (const [label, n] of LOOPS) {
        const o = document.createElement("option");
        o.value = String(n);
        o.textContent = label;
        el.loops.appendChild(o);
      }
      el.loops.value = String(audio.loopTimes);
    }
    function drawCuts() {
      el.cuts.textContent = "";
      const span = audio.bgmLength() || total;
      if (span <= 0) return;
      const wide = el.track ? el.track.clientWidth : 0;
      const line = (t, cls) => {
        const i = document.createElement("i");
        i.className = cls;
        i.style.left = `${Math.max(0, Math.min(100, t / span * 100))}%`;
        el.cuts.appendChild(i);
      };
      const step = cuts.grid.length > 1 ? cuts.grid[1] - cuts.grid[0] : span;
      if (wide > 0 && step / span * wide >= cutGap) {
        for (const t of cuts.grid) line(t, "grid");
      }
      for (const t of cuts.bars) line(t, "bar");
      if (loopAt != null && loopAt > 0) line(loopAt, "loop");
      if (outroAt != null) line(outroAt, "outro");
    }
    function drawFx() {
      const live = audio.dynamic_effects || {};
      const chs = [.../* @__PURE__ */ new Set([...Object.keys(live), ...Object.keys(fxOff)])].map((n) => Number(n)).filter((n) => Number.isInteger(n)).sort((a, b) => a - b);
      el.fx.textContent = "";
      el.fxrow.hidden = chs.length === 0;
      for (const ch of chs) {
        const on = !!live[ch];
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sw";
        b.setAttribute("aria-pressed", String(on));
        const t = chans[ch];
        const kinds = Object.entries(live[ch] || fxOff[ch] || {}).filter(([, v]) => v).map(([k]) => k).join(" ");
        b.textContent = `${t && t.name ? t.name : `ch${ch + 1}`}${kinds ? ` ${kinds}` : ""}`;
        b.addEventListener("click", () => {
          if (live[ch]) {
            fxOff[ch] = live[ch];
            delete live[ch];
          } else if (fxOff[ch]) {
            live[ch] = fxOff[ch];
            delete fxOff[ch];
          }
          if (audio.bgmActive(NAME)) audio.seekBGM(audio.bgmPosition(), { cut: false });
          drawFx();
        });
        el.fx.appendChild(b);
      }
    }
    function drawLeds() {
      el.leds.textContent = "";
      el.cuelog.textContent = "";
      leds.clear();
      const names = [...new Set(cues.map((c) => c.name))];
      el.cuerow.hidden = names.length === 0;
      for (const name of names) {
        const led = document.createElement("span");
        led.className = "led";
        led.dataset.name = name;
        led.textContent = name;
        el.leds.appendChild(led);
        leds.set(name, led);
      }
    }
    function logCue(c) {
      const line = document.createElement("div");
      line.textContent = `${c.t.toFixed(2)}s  ch${c.ch + 1}  ${c.name}` + (c.arg ? ` ${c.arg}` : "");
      el.cuelog.prepend(line);
      while (el.cuelog.children.length > 16) el.cuelog.lastChild.remove();
    }
    function blink(name) {
      const led = leds.get(name);
      if (!led) return;
      led.classList.add("on");
      clearTimeout(led._off);
      led._off = setTimeout(() => led.classList.remove("on"), 120);
    }
    function passedCues(at) {
      if (!cues.length) return;
      const len = audio.bgmLength() || total;
      const hit = (from2, to) => {
        for (const c of cues) {
          if (c.t <= from2 || c.t > to) continue;
          if (audio.cuesMuted(c.ch)) continue;
          blink(c.name);
          logCue(c);
        }
      };
      if (at >= lastPos) hit(lastPos, at);
      else {
        hit(lastPos, len);
        hit(-1, at);
      }
      lastPos = at;
    }
    function showText(x) {
      if (x.text === "") {
        said.delete(x.ch);
        drawTexts();
        return;
      }
      said.set(x.ch, { text: x.text, until: played + TEXT_HOLD });
      drawTexts();
    }
    function sweepTexts() {
      let went = false;
      for (const [ch, v] of said) {
        if (played >= v.until) {
          said.delete(ch);
          went = true;
        }
      }
      if (went) drawTexts();
    }
    function drawTexts() {
      el.textrow.hidden = texts.length === 0;
      el.said.textContent = "";
      for (const ch of [...said.keys()].sort((a, b) => a - b)) {
        const span = document.createElement("span");
        const who = document.createElement("b");
        who.textContent = `ch${ch + 1}`;
        span.appendChild(who);
        span.appendChild(document.createTextNode(said.get(ch).text));
        el.said.appendChild(span);
      }
    }
    function clearTexts() {
      said.clear();
      drawTexts();
    }
    function passedTexts(from2, to, len) {
      if (!texts.length) return;
      const hit = (a, b) => {
        for (const x of texts) if (x.t > a && x.t <= b) showText(x);
      };
      if (to >= from2) hit(from2 <= 0 ? -1 : from2, to);
      else if (wrapped(from2, to, len)) {
        hit(from2, len);
        hit(-1, to);
      }
    }
    function wrapped(from2, to, len) {
      return len > 0 && from2 - to > len / 2;
    }
    function drawMarks() {
      el.marks.textContent = "";
      el.markrow.hidden = marks.length === 0;
      for (const m of marks) {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = m.name;
        b.dataset.t = String(m.t);
        b.addEventListener("click", () => {
          goTo(m.t);
        });
        el.marks.appendChild(b);
      }
    }
    function drawTakes() {
      el.takes.textContent = "";
      el.takerow.hidden = takes.length === 0;
      for (const g of takes) {
        const wrap2 = document.createElement("span");
        wrap2.className = "take";
        const lbl = document.createElement("span");
        lbl.className = "grp";
        lbl.textContent = g.group;
        wrap2.appendChild(lbl);
        for (const name of g.options) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "sw";
          b.dataset.group = g.group;
          b.dataset.take = name;
          b.textContent = name;
          b.addEventListener("click", () => {
            audio.selectTake(NAME, g.group, name, restart ? { restart: true } : {});
            draw();
          });
          wrap2.appendChild(b);
        }
        el.takes.appendChild(wrap2);
      }
    }
    function draw() {
      const s = audio.bgmState;
      const on = !!(s && s.name === NAME);
      el.play.textContent = on && !s.paused ? "Pause" : "Play";
      el.play.disabled = !audio.bgmActive(NAME);
      el.rept.setAttribute("aria-pressed", String(!audio.ignoreSongLoop));
      if (document.activeElement !== el.vol) {
        el.vol.value = String(Math.round(audio.volume * 100));
      }
      el.mute.setAttribute("aria-pressed", String(audio.muted));
      el.mute.textContent = audio.muted ? "Muted" : "Mute";
      const ab = audio.bgmRange();
      el.abOn.checked = !!ab;
      const span = audio.bgmLength() || total;
      const pct = (sec) => `${span > 0 ? Math.max(0, Math.min(100, sec / span * 100)) : 0}%`;
      el.abA.classList.toggle("off", !ab);
      el.abB.classList.toggle("off", !ab);
      el.abspan.hidden = !ab;
      if (ab) {
        el.abA.style.left = pct(ab.from);
        el.abB.style.left = pct(ab.to);
        el.abspan.style.left = pct(ab.from);
        el.abspan.style.width = `${Math.max(0, parseFloat(pct(ab.to)) - parseFloat(pct(ab.from)))}%`;
      }
      if (document.activeElement !== el.abFrom) el.abFrom.value = abFrom.toFixed(3);
      if (document.activeElement !== el.abTo) el.abTo.value = abTo.toFixed(3);
      if (document.activeElement !== el.loops) el.loops.value = String(audio.loopTimes);
      el.wav.disabled = busy || !Number.isFinite(audio.loopTimes) || total <= 0;
      el.level.disabled = el.wav.disabled;
      if (takes.length) {
        const now = audio.takesOf(NAME);
        for (const b of el.takes.querySelectorAll("button")) {
          b.setAttribute("aria-pressed", String(now[b.dataset.group] === b.dataset.take));
        }
      }
      for (const b of el.chs.querySelectorAll("button.sw")) {
        if (b.dataset.lane) {
          const at = b.dataset.lane.indexOf("/");
          const ch2 = Number(b.dataset.lane.slice(0, at));
          b.setAttribute(
            "aria-pressed",
            String(!audio.isLaneMuted(ch2, b.dataset.lane.slice(at + 1)))
          );
          continue;
        }
        const ch = Number(b.dataset.ch);
        b.setAttribute("aria-pressed", String(!audio.isMuted(ch)));
        b.disabled = goneCh(ch);
      }
      const mach = machineText();
      el.mach.textContent = mach;
      el.mach.hidden = !mach;
      const len = audio.bgmLength() || total;
      el.len.textContent = clock(len);
      if (!dragging) {
        const at = on ? audio.bgmPosition() : from;
        if (on && !s.paused) {
          played += at >= lastPos ? at - lastPos : wrapped(lastPos, at, len) ? Math.max(0, len - lastPos) + at : 0;
          passedTexts(lastPos, at, len);
          sweepTexts();
          passedCues(at);
          lastPos = at;
        } else lastPos = at;
        el.now.textContent = clock(at);
        el.seek.value = String(len > 0 ? Math.round(at / len * 1e3) : 0);
        const here = marks.reduce(
          (best, m) => m.t <= at + 1e-6 && (!best || m.t >= best.t) ? m : best,
          null
        );
        for (const b of el.marks.querySelectorAll("button")) {
          const mine = here && Math.abs(Number(b.dataset.t) - here.t) < 1e-6;
          b.classList.toggle("now", !!mine);
          if (mine) b.setAttribute("aria-current", "true");
          else b.removeAttribute("aria-current");
        }
      }
    }
    async function play() {
      dropWAV();
      await audio.unlock();
      const s = audio.bgmState;
      if (s && s.name === NAME && s.paused) {
        audio.resumeBGM();
        draw();
        return;
      }
      if (!audio.bgmActive(NAME) && !read()) return;
      audio.startBGM(NAME, { restart: true });
      if (from > 0) audio.seekBGM(from);
      draw();
    }
    function mmlOf(opts2 = {}) {
      const span = audio.bgmLength() || total;
      const ab = audio.bgmRange();
      const from2 = opts2.from ?? (ab ? ab.from : 0);
      const to = opts2.to ?? (ab ? ab.to : span);
      const text = voices.join(" ");
      const hit = /(?:^|[\s])t(\d+)/.exec(text);
      const meta = audio.bgmInfo(NAME)?.meta ?? {};
      const tempo = Number(hit ? hit[1] : meta.tempo) || 120;
      const tracks = voices.map((v, i) => ({ v, i })).filter(({ i }) => !audio.isMuted(i) && !goneCh(i)).map(({ v, i }) => ({
        name: chans[i]?.name ?? null,
        role: chans[i]?.role ?? null,
        events: compileMML(String(v).trim()).events
      }));
      return eventsToMML(tracks, {
        tempo,
        from: from2,
        to,
        waveName: (n) => WAVEFORMS[n]?.name ?? String(n),
        envName: (n) => ENVELOPES[n]?.name ?? String(n)
      });
    }
    function dropWAV() {
      if (!wavURL) return;
      el.audio.pause();
      el.audio.removeAttribute("src");
      el.audio.load();
      el.got.hidden = true;
      el.wavnote.hidden = true;
      URL.revokeObjectURL(wavURL);
      wavURL = null;
    }
    async function measureLevel(target = SONG_TARGET) {
      if (busy || !Number.isFinite(audio.loopTimes)) return null;
      busy = true;
      quit = false;
      root.classList.add("busy");
      el.veil.hidden = false;
      el.barfill.style.width = "0%";
      el.pct.textContent = "0%";
      say("Measuring\u2026");
      audio.stopBGM();
      try {
        const buf = await audio.renderBGM(NAME, {
          loops: 1,
          onProgress: (v) => {
            const pct = Math.round(v * 100);
            el.barfill.style.width = `${pct}%`;
            el.pct.textContent = `${pct}%`;
          },
          stop: () => quit
        });
        if (!buf) {
          say("Measuring cancelled.");
          return null;
        }
        const level = measureLoudness([buf.getChannelData(0)], buf.sampleRate);
        const fit = fitGain(level, target);
        const now = Number(audio.bgmInfo(NAME)?.meta?.gain ?? 1) || 1;
        const got = {
          seconds: buf.duration,
          lufs: level.lufs,
          peakDb: level.peakDb,
          truePeakDb: level.truePeakDb,
          clipped: level.clipped,
          target: { ...target },
          gainNow: now,
          gainFactor: fit.gain,
          gainWrite: Math.round(now * fit.gain * 100) / 100,
          by: fit.by
        };
        const line = `${got.lufs.toFixed(1)} LUFS / ${got.truePeakDb.toFixed(2)} dBTP \u2192 #gain ${got.gainWrite} (x${fit.gain.toFixed(2)}, ${fit.by === "lufs" ? "target" : "ceiling"})`;
        console.info("[player] " + line, got);
        say(line);
        return got;
      } catch (e) {
        say(String(e && e.message ? e.message : e), "err");
        return null;
      } finally {
        busy = false;
        root.classList.remove("busy");
        el.veil.hidden = true;
        draw();
      }
    }
    async function toWAV() {
      if (busy || !Number.isFinite(audio.loopTimes)) return;
      dropWAV();
      busy = true;
      quit = false;
      root.classList.add("busy");
      el.veil.hidden = false;
      el.barfill.style.width = "0%";
      el.pct.textContent = "0%";
      say("Rendering\u2026");
      audio.stopBGM();
      const ab = audio.bgmRange();
      try {
        const buf = await audio.renderBGM(NAME, {
          loops: ab ? 1 : audio.loopTimes,
          // 左右に分けて焼くか。定位とエフェクトの広がりは 2 本のときだけ出る
          channels: el.stereo.getAttribute("aria-pressed") === "true" ? 2 : 1,
          onProgress: (v) => {
            const pct = Math.round(v * 100);
            el.barfill.style.width = `${pct}%`;
            el.pct.textContent = `${pct}%`;
          },
          stop: () => quit
        });
        if (!buf) {
          say("Export cancelled.");
          return;
        }
        const rate = buf.sampleRate;
        let chans2 = Array.from({ length: buf.numberOfChannels }, (_, c) => buf.getChannelData(c));
        if (ab) {
          const a0 = Math.max(0, Math.floor(ab.from * rate));
          const a1 = Math.min(buf.length, Math.ceil(ab.to * rate));
          chans2 = chans2.map((d) => d.slice(a0, a1));
        }
        const data2 = chans2[0];
        const meta = audio.bgmInfo(NAME)?.meta ?? {};
        const name = String(meta.title || "mmsxx").replace(/[\\/:*?"<>|]/g, "_");
        const blob = new Blob([writeWAV(chans2, rate)], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const secs = (data2.length / rate).toFixed(1);
        if (!inFrame) {
          const a = document.createElement("a");
          a.href = url;
          a.download = `${name}.wav`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1e4);
          say(`Exported ${secs}s of WAV.`);
          return;
        }
        wavURL = url;
        el.got.hidden = false;
        el.audio.src = url;
        el.save.href = url;
        el.save.download = `${name}.wav`;
        el.wavnote.textContent = `Could not save ${secs}s of WAV. Save it from the player below.`;
        el.wavnote.hidden = false;
        say("");
      } catch (e) {
        say(String(e && e.message ? e.message : e), "err");
      } finally {
        busy = false;
        root.classList.remove("busy");
        el.veil.hidden = true;
        draw();
      }
    }
    function goTo(sec) {
      const len = audio.bgmLength() || total;
      from = Math.max(0, Math.min(sec, len));
      const s = audio.bgmState;
      if (s && s.name === NAME) audio.seekBGM(from);
      clearTexts();
      lastPos = from;
      draw();
    }
    el.play.addEventListener("click", () => {
      const s = audio.bgmState;
      if (s && s.name === NAME && !s.paused) {
        audio.pauseBGM();
        draw();
        return;
      }
      play();
    });
    el.stop.addEventListener("click", () => {
      audio.stopBGM();
      from = 0;
      clearTexts();
      lastPos = 0;
      draw();
    });
    const secOf = (text) => {
      const t = String(text ?? "").trim();
      if (!t) return null;
      const m = /^(\d+):(\d+(?:\.\d+)?)$/.exec(t);
      const n = m ? Number(m[1]) * 60 + Number(m[2]) : Number(t);
      return Number.isFinite(n) ? Math.max(0, n) : null;
    };
    function applyRange(on, toA) {
      const span = audio.bgmLength() || total;
      if (!on) {
        audio.clearRange();
        draw();
        return;
      }
      if (!(abTo > abFrom)) {
        abFrom = 0;
        abTo = span;
      }
      audio.setRange(abFrom, abTo);
      if (toA) audio.seekBGM(abFrom);
      draw();
    }
    function markAB(which) {
      const span = audio.bgmLength() || total;
      if (!(span > 0)) return;
      const st = audio.bgmState;
      const at = st && st.name === NAME ? audio.bgmPosition() : span * (Number(el.seek.value) / 1e3);
      const sec = Math.max(0, Math.min(span, Math.round(at * 10) / 10));
      if (!(abTo > abFrom)) {
        abFrom = 0;
        abTo = span;
      }
      if (which === "A") abFrom = sec;
      else abTo = sec;
      if (abFrom > abTo) {
        const t = abFrom;
        abFrom = abTo;
        abTo = t;
      }
      if (abFrom === abTo) {
        if (abTo < span) abTo = Math.min(span, abTo + 0.1);
        else abFrom = Math.max(0, abFrom - 0.1);
      }
      el.abOn.checked = true;
      applyRange(true, which === "A");
      say(`A ${abFrom.toFixed(1)}s \u2013 B ${abTo.toFixed(1)}s`);
    }
    el.setA.addEventListener("click", () => markAB("A"));
    el.setB.addEventListener("click", () => markAB("B"));
    function fixHead() {
      const ab = audio.bgmRange();
      if (!ab) return;
      const at = audio.bgmPosition();
      if (at < ab.from || at > ab.to) {
        audio.seekBGM(ab.from);
        draw();
      }
    }
    el.copy.addEventListener("click", async () => {
      const text = mmlOf();
      if (!text) {
        say("Nothing to copy.", "bad");
        return;
      }
      const show = () => {
        el.out.hidden = false;
        el.out.value = text;
        el.out.focus();
        el.out.select();
      };
      if (copyMode === "show") {
        show();
        say("Here is the MML. It is selected.");
        return;
      }
      let done = false;
      try {
        await navigator.clipboard.writeText(text);
        done = true;
      } catch {
      }
      if (!done) {
        show();
        try {
          done = document.execCommand("copy");
        } catch {
          done = false;
        }
      }
      if (done) {
        el.out.hidden = true;
        say("Copied as MML.");
        return;
      }
      say("Could not copy. Here is the MML, selected, to copy by hand.", "bad");
    });
    el.mml.addEventListener("click", () => {
      const text = srcText();
      if (!text) {
        say("Nothing to export.", "bad");
        return;
      }
      const meta = audio.bgmInfo(NAME)?.meta ?? {};
      const name = (meta.title || "song").replace(/[\\/:*?"<>|]/g, "_");
      if (!inFrame) {
        const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.mml`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1e4);
        say(`Exported ${name}.mml`);
        return;
      }
      el.out.hidden = false;
      el.out.value = text;
      el.out.focus();
      el.out.select();
      say("Could not save the file. Here is the MML, selected, to copy by hand.", "bad");
    });
    const showSrc = (on) => {
      el.srcwrap.hidden = !on;
      el.showmml.setAttribute("aria-pressed", String(on));
      el.showmml.setAttribute("aria-expanded", String(on));
    };
    const srcText = () => {
      if (!Array.isArray(mml)) return String(mml ?? "").trim();
      const has = (v) => /^[ \t]*\/\/[ \t]*#[ \t]*ch([ \t]|$)/im.test(v);
      return voices.map((v) => has(v) ? v : `#ch
${v}`).join("\n\n").trim();
    };
    el.showmml.addEventListener("click", () => {
      if (el.showmml.getAttribute("aria-pressed") === "true") {
        showSrc(false);
        return;
      }
      const text = srcText();
      if (!text) {
        say("Nothing to show.", "bad");
        return;
      }
      el.src.value = text;
      el.srcsize.textContent = `${text.split("\n").length} lines, ${text.length} chars`;
      showSrc(true);
      el.srcclose.focus();
    });
    el.srcclose.addEventListener("click", () => {
      showSrc(false);
      el.showmml.focus();
    });
    el.srcwrap.addEventListener("click", (e) => {
      if (e.target === el.srcwrap) {
        showSrc(false);
        el.showmml.focus();
      }
    });
    el.srcwrap.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        showSrc(false);
        el.showmml.focus();
      }
    });
    el.abOn.addEventListener("change", () => applyRange(el.abOn.checked, true));
    for (const [box, which] of [[el.abFrom, "from"], [el.abTo, "to"]]) {
      box.addEventListener("input", () => {
        const v = secOf(box.value);
        if (v === null) {
          draw();
          return;
        }
        if (which === "from") abFrom = v;
        else abTo = v;
        if (abTo > abFrom) applyRange(true, which === "from");
        if (which === "to") fixHead();
      });
    }
    for (const [handle, which] of [[el.abA, "from"], [el.abB, "to"]]) {
      handle.addEventListener("pointerdown", (e) => {
        handle.setPointerCapture(e.pointerId);
        e.preventDefault();
        const move = (ev) => {
          const box = el.track.getBoundingClientRect();
          const span = audio.bgmLength() || total;
          const sec = Math.max(0, Math.min(span, (ev.clientX - box.left) / box.width * span));
          if (which === "from") abFrom = sec;
          else abTo = sec;
          if (abTo > abFrom) audio.setRange(abFrom, abTo);
          draw();
        };
        const up = () => {
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", up);
          if (which === "from" && audio.bgmRange()) {
            audio.seekBGM(abFrom);
            draw();
          }
          if (which === "to") fixHead();
        };
        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", up);
      });
    }
    el.stereo.addEventListener("click", () => {
      el.stereo.setAttribute("aria-pressed", String(el.stereo.getAttribute("aria-pressed") !== "true"));
    });
    el.rept.addEventListener("click", () => {
      audio.ignoreSongLoop = !audio.ignoreSongLoop;
      draw();
    });
    el.logsw.addEventListener("click", () => {
      const on = el.logrow.hidden;
      el.logrow.hidden = !on;
      el.logsw.setAttribute("aria-pressed", String(on));
      el.logsw.setAttribute("aria-expanded", String(on));
    });
    el.loose.addEventListener("change", () => {
      loose = el.loose.checked;
      audio.stopBGM();
      from = 0;
      if (read()) draw();
    });
    el.rew.addEventListener("click", () => {
      restart = !restart;
      el.rew.setAttribute("aria-pressed", String(restart));
    });
    el.vol.addEventListener("input", () => {
      audio.volume = Number(el.vol.value) / 100;
      draw();
    });
    el.mute.addEventListener("click", () => {
      audio.mute();
      draw();
    });
    el.wav.addEventListener("click", () => {
      toWAV();
    });
    el.level.addEventListener("click", () => {
      measureLevel();
    });
    el.cancel.addEventListener("click", () => {
      quit = true;
      say("Cancelling\u2026");
    });
    el.open.addEventListener("click", () => {
      open = !open;
      fold();
    });
    el.ver.textContent = `Pico (MML Player) ${PLAYER_VERSION}
ChipTuneSound ${SOUND_VERSION}
\xA9 ${COPYRIGHT}`;
    const showVer = (on) => {
      el.ver.hidden = !on;
      el.help.setAttribute("aria-pressed", String(on));
      el.help.setAttribute("aria-expanded", String(on));
    };
    el.help.addEventListener("click", () => {
      showVer(el.ver.hidden);
    });
    const shut = (e) => {
      if (el.ver.hidden || el.help.contains(e.target) || el.ver.contains(e.target)) return;
      showVer(false);
    };
    const shutKey = (e) => {
      if (e.key === "Escape") showVer(false);
    };
    document.addEventListener("pointerdown", shut);
    document.addEventListener("keydown", shutKey);
    el.loops.addEventListener("change", () => {
      audio.loopTimes = Number(el.loops.value);
      draw();
    });
    el.seek.addEventListener("pointerdown", () => {
      dragging = true;
    });
    el.seek.addEventListener("change", () => {
      dragging = false;
      const len = audio.bgmLength() || total;
      if (len <= 0) return;
      const at = len * (Number(el.seek.value) / 1e3);
      goTo(at < len / 1e3 ? 0 : at);
    });
    el.seek.addEventListener("input", () => {
      const len = audio.bgmLength() || total;
      if (len > 0) el.now.textContent = clock(len * (Number(el.seek.value) / 1e3));
    });
    function beat() {
      const s = audio.bgmState;
      const on = !!(s && s.name === NAME && !s.paused);
      const hot = /* @__PURE__ */ new Set();
      if (on) {
        for (const n of audio.notesAt()) {
          if (!(n.level > 0)) continue;
          if (!(audio.trackVolume(n.ch) > 0)) continue;
          hot.add(String(n.ch));
          if (n.lane !== void 0) hot.add(`${n.ch}/${n.lane}`);
        }
      }
      for (const b of el.chs.querySelectorAll("button.sw, .chvol")) {
        b.classList.toggle("hot", hot.has(b.dataset.lane ?? b.dataset.ch));
      }
      frame = requestAnimationFrame(beat);
    }
    const timer = setInterval(draw, 100);
    let frame = requestAnimationFrame(beat);
    srcButtons();
    read();
    drawLoops();
    drawGroups();
    drawChannels();
    drawMarks();
    drawTakes();
    fold();
    drawFx();
    drawLeds();
    clearTexts();
    drawCuts();
    draw();
    const onSize = () => drawCuts();
    window.addEventListener("resize", onSize);
    return {
      /**
       * 下で鳴らしているエンジン(`ChipTuneSound`)。
       *
       * 鳴り方はすべてこちらにある。黙らせるのも、くり返すかどうかも、
       * ここへ言う。押すところは 0.1 秒で追いつく。
       * 押すところを消してあっても、鳴っていなくても効く
       */
      audio,
      /** 鳴らしはじめる。止めてあるだけなら続きから */
      play,
      /**
       * 曲の大きさを測って、揃える倍率を返す(音は変えない)。
       * 既定の合わせ先は −16 LUFS / −1 dBTP。コンソールにも 1 行出る
       */
      measure: (target) => measureLevel(target),
      /** その場で凍らせる。`play()` で続きから鳴る */
      pause: () => {
        audio.pauseBGM();
        draw();
      },
      /** 止めて、位置を忘れる。次は頭から */
      stop: () => {
        audio.stopBGM();
        draw();
      },
      /**
       * 曲の途中へ跳ぶ。
       *
       * @param {number} sec 頭から何秒のところか
       */
      seek: (sec) => {
        goTo(sec);
      },
      /**
       * AB リピートの範囲。
       *
       * 省いて呼ぶと、いまの範囲が返る(`{ from, to }`。無ければ null)。
       * `range(null)` で外す。読むのも書くのも同じ名前でする。
       *
       * @param {number|null} [from] 始まりの秒。`null` で範囲を外す。省くと読むだけ
       * @param {number} [to] 終わりの秒。`from` と入れ替わっていても直す
       * @returns {{from:number, to:number}|null} そのあとの範囲
       */
      range(from2, to) {
        if (from2 === void 0) return audio.bgmRange();
        if (from2 === null) {
          audio.clearRange();
        } else {
          abFrom = Math.min(from2, to);
          abTo = Math.max(from2, to);
          audio.setRange(abFrom, abTo);
        }
        draw();
        return audio.bgmRange();
      },
      /**
       * ラベルの名前で跳ぶ。見つからなければ何もしない。
       *
       * @param {string} name `#label` に書いた名前。大文字小文字は見る
       */
      jump(name) {
        const m = marks.find((x) => x.name === name);
        if (m) goTo(m.t);
      },
      /**
       * 跳ぶ先の一覧。鳴らす前から読める。
       *
       * @returns {{name:string, t:number}[]} 名前と、頭から何秒のところか
       */
      marks: () => marks.slice(),
      /**
       * 鳴らす前から読めるチャンネルの一覧。名前と役割は MML の注釈から。
       * 黙っているかどうかはエンジンに聞く。
       *
       * @returns {{ch:number, name:string|null, role:string|null,
       *            total:number, muted:boolean}[]}
       */
      tracks: () => chans.map((t) => ({ ...t, muted: audio.isMuted(t.ch) })),
      /**
       * 外から MML を差し替える。テキストボックスは持たないので、入り口はここ。
       *
       * 差し替えると鳴っているものは止まる。チャンネルもラベルも読み直す。
       *
       * @param {string|string[]} text 1 本のテキストでも、チャンネルごとの並びでもよい
       */
      setMML(text) {
        mml = Array.isArray(text) ? text : String(text ?? "");
        data = null;
        reload();
      },
      /**
       * 外から、読み終えた中間データを差し替える。`setMML()` の字を通さない版。
       *
       * @param {object[]} tracks `compileMML()` が返す形の並び。チャンネル 1 本につき 1 つ
       */
      setData(tracks) {
        data = tracks;
        mml = "";
        reload();
      },
      /**
       * いまの範囲を MML の字にして返す。黙らせたチャンネルは入らない。
       *
       * 範囲を決めていなければ曲ぜんぶ。書き直したものなので、注釈も
       * マクロも残らない。`Copy as MML` が呼んでいるのもこれ
       *
       * @param {{from?:number, to?:number}} [opts] 秒で切る範囲。省くと AB リピートの範囲
       * @returns {string} チャンネルを `#ch` で分けた 1 本のテキスト
       */
      mml: (opts2) => mmlOf(opts2),
      /** 時計を止める。ページから外すときに呼ぶ */
      destroy() {
        clearInterval(timer);
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", onSize);
        document.removeEventListener("pointerdown", shut);
        document.removeEventListener("keydown", shutKey);
        audio.stopBGM();
        dropWAV();
      }
    };
  }

  // Register the original Pico UI against the 0.41.0 audio engine.
  Object.assign(E, { mountPlayer, PLAYER_CSS, PLAYER_VERSION,
    player: { mount: mountPlayer, CSS: PLAYER_CSS, version: PLAYER_VERSION } });
})();
