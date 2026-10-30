// コーラス。全体かチャンネルに掛けるエフェクト(2026-10-26)。
//
// 少し遅らせて、遅れを揺らした音を重ねる。高さがわずかに揺れた音が重なるので、
// 1 本の音が何本かで鳴っているように厚く聞こえる。細いチップの音を太くするのに使う。
//
// 作りは analog の音色の中のコーラス(sound/analog.js)と同じ。遅れを 2 本取り、
// 片方は伸ばし、片方は縮めるように逆向きに揺らす。左右があるときは、
// 2 本の差を左右へ振り分けて広げる(width)。
//
// mix は元の音と揺らした音の割合。0 で元の音だけ、1 で揺らした音だけ。
// reverb・echo・フィルタと同じく、DAW の Dry/Wet と同じ意味にした。
// 0.5 が、元の音と揺らした音が半分ずつの、よくあるコーラス

/** chorus の処理器の名前 */
export const CHORUS_NODE = 'mmsxx-chorus';

/** 揺らす遅れの真ん中より手前に置く、決まった遅れ(秒)。analog の音色の中のものと同じ */
export const CHORUS_BASE = 0.012;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const CHORUS_FX = {
  chorus: {
    tags: ['modulation', 'stereo'], dev: ['wip'], version: '0.1',
    desc: 'Chorus. A copy of the sound, delayed by a few milliseconds that sway slowly, is mixed back in, so one voice sounds like several playing together. It thickens thin chip voices, strings and pads. Two delays sway in opposite directions; with a stereo player their difference is spread to the left and right.',
    params: {
      rate: { live: false, unit: 'Hz', min: 0.05, max: 8, default: 0.5, desc: 'How fast the delays sway. Around 0.5 is a gentle shimmer; above 4 the pitch warbles like a vibrato.' },
      depth: { live: false, unit: 'ms', min: 0.5, max: 20, default: 3, desc: 'How far the delays sway, in milliseconds. More depth means more pitch wobble and a thicker, more seasick sound.' },
      mix: { live: false, min: 0, max: 1, default: 0.5, desc: 'How much of the sound is the swaying copy, from 0 (the dry sound alone) to 1 (the copy alone). 0.5 is half and half, the usual chorus.' },
      width: { live: false, min: 0, max: 1, default: 1, desc: 'How far the sway spreads to the left and right. 1 swings between the speakers; 0 keeps it in the middle. It only shows when the player asks for stereo.' },
    },
  },
};

/**
 * chorus の処理器。入口 1 つ、出口 1 つ。チャンネルごとに遅れ線を持つ。
 * 揺れは左右で 1 つを共にする。左は 1 本目を、右は 2 本目を強く聞かせる。
 * モノラルのときは 2 本を半分ずつ混ぜる。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const CHORUS_CODE = `
const BASE = ${CHORUS_BASE};
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(CHORUS_FX.chorus.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

class Chorus extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.rate = v('rate', 0.05, 8);
    this.half = v('depth', 0.5, 20) / 2000;
    this.mix = v('mix', 0, 1);
    this.width = v('width', 0, 1);
    // 遅れ線は、いちばん長い遅れより少し長く取る
    let n = 4;
    while (n < (BASE + this.half * 2) * sampleRate + 8) n *= 2;
    this.n = n; this.mask = n - 1;
    this.bufs = [];
    this.w = 0;
    this.ph = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, n = this.n, mask = this.mask, sr = sampleRate;
    const half = this.half, mix = this.mix, width = this.width;
    const dph = this.rate / sr;
    let w0 = this.w;
    for (let c = 0; c < out.length; c++) {
      const buf = this.bufs[c] || (this.bufs[c] = new Float32Array(n));
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      // 左は 1 本目、右は 2 本目へ寄せる。モノラルは真ん中
      const side = out.length < 2 ? 0 : c === 0 ? 1 : -1;
      let w = w0, ph = this.ph;
      for (let i = 0; i < len; i++) {
        const xi = x ? x[i] : 0;
        buf[w] = xi;
        const sw = Math.sin(2 * Math.PI * ph) * half;
        ph += dph; if (ph >= 1) ph -= 1;
        // 端数の位置は、となりの 2 点をまっすぐつないで読む
        const read = (sec) => {
          const at = w - sec * sr;
          const j = Math.floor(at), f = at - j;
          return buf[j & mask] * (1 - f) + buf[(j + 1) & mask] * f;
        };
        const a = read(BASE + half + sw), b = read(BASE + half - sw);
        const wet = (a + b) * 0.5 + side * (a - b) * 0.5 * width;
        y[i] = xi * (1 - mix) + wet * mix;
        w = (w + 1) & mask;
      }
      if (c === out.length - 1) { this.w = w; this.ph = ph; }
    }
    return true;
  }
}
registerProcessor('${CHORUS_NODE}', Chorus);
`;
