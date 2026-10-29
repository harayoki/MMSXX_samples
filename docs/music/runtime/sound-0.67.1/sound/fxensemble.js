// アンサンブル。全体かチャンネルに掛けるエフェクト(2026-10-26)。
//
// chorus(sound/fxchorus.js)を 3 本重ねたもの。ストリングマシン(Solina など)の
// アンサンブルにならった。1 本の音が、弦の群れのように広がって聞こえる。
//
// 遅れを 3 本取り、それぞれを別の速さで揺らす。速さは rate の 1 倍、1.13 倍、1.27 倍で、
// 揺れの始まりも 3 分の 1 周ずつずらす。速さが揃っていないので、3 本の重なり方が
// いつまでも同じにならない。Solina にならって、速い小さな揺れ(rate の 9 倍、幅は 6 分の 1)も重ねる。
//
// 左右があるときは、1 本目を左へ、3 本目を右へ寄せ、2 本目を真ん中に置く(width)。
// mix は chorus と同じく DAW の Dry/Wet。0 で元の音だけ、1 で揺らした音だけ

/** ensemble の処理器の名前 */
export const ENSEMBLE_NODE = 'mmsxx-ensemble';

/** 揺らす遅れの手前に置く、決まった遅れ(秒)。chorus と同じ */
export const ENSEMBLE_BASE = 0.012;

/** 3 本の揺れの速さ(rate に掛ける倍率)と、始まりの位置(1 周を 1 とする) */
export const ENSEMBLE_VOICES = [
  { rate: 1, phase: 0 },
  { rate: 1.13, phase: 1 / 3 },
  { rate: 1.27, phase: 2 / 3 },
];

/** 速い揺れ。rate に掛ける倍率と、幅(depth に掛ける倍率) */
export const ENSEMBLE_FAST = { rate: 9, depth: 1 / 6 };

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const ENSEMBLE_FX = {
  ensemble: {
    tags: ['modulation', 'stereo'], dev: ['wip'], version: '0.1',
    desc: 'Ensemble, as in the string machines of the 1970s (Solina and its kin). Three chorus voices, each swaying at a slightly different speed, are layered, so one voice spreads into a section of strings. With a stereo player the first voice leans left, the third right and the second stays in the middle. Use it on pads and held chords.',
    params: {
      rate: { live: false, unit: 'Hz', min: 0.05, max: 4, default: 0.6, desc: 'How fast the slowest voice sways. The other two sway 1.13 and 1.27 times as fast, so the voices never line up. Around 0.6 is the classic string machine; above 2 it turns into a seasick warble.' },
      depth: { live: false, unit: 'ms', min: 0.5, max: 10, default: 2.5, desc: 'How far each delay sways, in milliseconds. More depth means a wider, more detuned section; less keeps it close to the dry sound.' },
      mix: { live: false, min: 0, max: 1, default: 0.6, desc: 'How much of the sound is the three swaying voices, from 0 (the dry sound alone) to 1 (the voices alone). String machines were usually played fully wet.' },
      width: { live: false, min: 0, max: 1, default: 1, desc: 'How far the first and third voices are spread to the left and right. 0 keeps all three in the middle. It only shows when the player asks for stereo.' },
    },
  },
};

/**
 * ensemble の処理器。入口 1 つ、出口 1 つ。チャンネルごとに遅れ線を持つ。
 * 揺れは左右で共にする。モノラルのときは 3 本を同じだけ混ぜる。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const ENSEMBLE_CODE = `
const BASE = ${ENSEMBLE_BASE};
const VOICES = ${JSON.stringify(ENSEMBLE_VOICES)};
const FAST = ${JSON.stringify(ENSEMBLE_FAST)};
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(ENSEMBLE_FX.ensemble.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const TAU = 2 * Math.PI;

class Ensemble extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.rate = v('rate', 0.05, 4);
    this.half = v('depth', 0.5, 10) / 2000;
    this.mix = v('mix', 0, 1);
    this.width = v('width', 0, 1);
    // 遅れ線は、いちばん長い遅れより少し長く取る(速い揺れのぶんも入れる)
    const most = BASE + this.half * (2 + FAST.depth);
    let n = 4;
    while (n < most * sampleRate + 8) n *= 2;
    this.n = n; this.mask = n - 1;
    this.bufs = [];
    this.w = 0;
    // 3 本の揺れの位置と、速い揺れの位置(1 周を 1 とする)
    this.ph = VOICES.map((x) => x.phase);
    this.fast = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, n = this.n, mask = this.mask, sr = sampleRate;
    const half = this.half, mix = this.mix, width = this.width;
    const fastHalf = half * FAST.depth;
    const d0 = this.rate * VOICES[0].rate / sr, d1 = this.rate * VOICES[1].rate / sr;
    const d2 = this.rate * VOICES[2].rate / sr, df = this.rate * FAST.rate / sr;
    // 遅れ(サンプル)は左右で同じなので、先に 1 回だけ出す
    const dl = this.dl || (this.dl = [new Float32Array(len), new Float32Array(len), new Float32Array(len)]);
    let p0 = this.ph[0], p1 = this.ph[1], p2 = this.ph[2], pf = this.fast;
    for (let i = 0; i < len; i++) {
      // 速い揺れは 3 本で位置をずらして共にする
      const f0 = Math.sin(TAU * pf), f1 = Math.sin(TAU * (pf + 1 / 3)), f2 = Math.sin(TAU * (pf + 2 / 3));
      dl[0][i] = (BASE + half + fastHalf + Math.sin(TAU * p0) * half + f0 * fastHalf) * sr;
      dl[1][i] = (BASE + half + fastHalf + Math.sin(TAU * p1) * half + f1 * fastHalf) * sr;
      dl[2][i] = (BASE + half + fastHalf + Math.sin(TAU * p2) * half + f2 * fastHalf) * sr;
      p0 += d0; if (p0 >= 1) p0 -= 1;
      p1 += d1; if (p1 >= 1) p1 -= 1;
      p2 += d2; if (p2 >= 1) p2 -= 1;
      pf += df; if (pf >= 1) pf -= 1;
    }
    this.ph[0] = p0; this.ph[1] = p1; this.ph[2] = p2; this.fast = pf;
    const w0 = this.w;
    for (let c = 0; c < out.length; c++) {
      const buf = this.bufs[c] || (this.bufs[c] = new Float32Array(n));
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      // 左は 1 本目、右は 3 本目へ寄せる。モノラルは 3 本を同じだけ
      const side = out.length < 2 ? 0 : c === 0 ? 1 : -1;
      const g0 = (1 + side * width) / 3, g1 = 1 / 3, g2 = (1 - side * width) / 3;
      let w = w0;
      for (let i = 0; i < len; i++) {
        const xi = x ? x[i] : 0;
        buf[w] = xi;
        // 端数の位置は、となりの 2 点をまっすぐつないで読む
        let at = w - dl[0][i], j = Math.floor(at), f = at - j;
        const a = buf[j & mask] * (1 - f) + buf[(j + 1) & mask] * f;
        at = w - dl[1][i]; j = Math.floor(at); f = at - j;
        const b = buf[j & mask] * (1 - f) + buf[(j + 1) & mask] * f;
        at = w - dl[2][i]; j = Math.floor(at); f = at - j;
        const d = buf[j & mask] * (1 - f) + buf[(j + 1) & mask] * f;
        y[i] = xi * (1 - mix) + (a * g0 + b * g1 + d * g2) * mix;
        w = (w + 1) & mask;
      }
      if (c === out.length - 1) this.w = w;
    }
    return true;
  }
}
registerProcessor('${ENSEMBLE_NODE}', Ensemble);
`;
