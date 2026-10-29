// フランジャー。全体かチャンネルに掛けるエフェクト(2026-10-26)。
//
// とても短い遅れ(数 ms)の写しを元の音に混ぜると、櫛の歯のように山と谷が並ぶ。
// 遅れを揺らすと歯が上下に動き、ジェット機が通り過ぎるような音になる。
// 2 台のテープを指で押さえてずらした、テープのフランジングにならった。
//
// - 遅れは delay(いちばん近いところ)から delay + depth まで、正弦で行き来する
// - feedback は遅れた音を遅れ線の入口へ戻す。歯が鋭くなり、金属的に鳴る。
//   負にすると、戻りが響く山が、もとの山と山のあいだへ移る。うつろな音になる
// - mix は DAW の Dry/Wet。0 で元の音だけ、1 で遅れた音だけ。歯がいちばん深いのは 0.5。
//   1 にすると歯は消え、高さの揺れだけが残る(ビブラート)
// - 揺れは左右で共にする。遅れ線はチャンネルごと

/** flanger の処理器の名前 */
export const FLANGER_NODE = 'mmsxx-flanger';

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const FLANGER_FX = {
  flanger: {
    tags: ['modulation'], dev: ['wip'], version: '0.1',
    desc: 'Flanger, after tape flanging. A copy delayed by a few milliseconds is mixed back in, carving a comb of peaks and notches; as the delay sweeps, the comb slides up and down like a passing jet. Feedback makes it ring and sound metallic.',
    params: {
      rate: { live: false, unit: 'Hz', min: 0.02, max: 5, default: 0.25, desc: 'How fast the delay sweeps back and forth. Slow values (around 0.2) give the long jet sweep; above 2 it turns into a warble.' },
      depth: { live: false, unit: 'ms', min: 0, max: 10, default: 2, desc: 'How far the delay sweeps, in milliseconds, from delay up to delay plus depth. 0 holds the comb still.' },
      delay: { live: false, unit: 'ms', min: 0.1, max: 10, default: 0.5, desc: 'The shortest delay, in milliseconds, where the sweep turns back. Short values reach the highest, most dramatic part of the sweep; longer ones sound more like a chorus.' },
      feedback: { live: false, min: -0.95, max: 0.95, default: 0.5, desc: 'How much of the delayed sound is fed back into the delay. Higher values sharpen the comb into a ringing, metallic whoosh. Negative values move the ringing peaks to halfway between the old ones, which sounds hollow.' },
      mix: { live: false, min: 0, max: 1, default: 0.5, desc: 'How much of the sound is the delayed copy, from 0 (the dry sound alone) to 1 (the copy alone). The comb is deepest at 0.5; at 1 only a pitch wobble is left.' },
    },
  },
};

/**
 * flanger の処理器。入口 1 つ、出口 1 つ。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const FLANGER_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(FLANGER_FX.flanger.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

class Flanger extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.rate = v('rate', 0.02, 5);
    this.depth = v('depth', 0, 10) / 1000;
    this.delay = v('delay', 0.1, 10) / 1000;
    this.fb = v('feedback', -0.95, 0.95);
    this.mix = v('mix', 0, 1);
    let n = 4;
    while (n < (this.delay + this.depth) * sampleRate + 8) n *= 2;
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
    const len = out[0].length, mask = this.mask, sr = sampleRate;
    const mix = this.mix, fb = this.fb;
    // 遅れ(サンプル)は左右で同じなので、先に出す。いちばん近くて 1 サンプル
    const dl = this.dl || (this.dl = new Float32Array(len));
    let ph = this.ph;
    const dph = this.rate / sr;
    for (let i = 0; i < len; i++) {
      const sec = this.delay + this.depth * (0.5 - 0.5 * Math.cos(2 * Math.PI * ph));
      dl[i] = Math.max(1, sec * sr);
      ph += dph; if (ph >= 1) ph -= 1;
    }
    this.ph = ph;
    const w0 = this.w;
    for (let c = 0; c < out.length; c++) {
      const buf = this.bufs[c] || (this.bufs[c] = new Float32Array(this.n));
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      let w = w0;
      for (let i = 0; i < len; i++) {
        const xi = x ? x[i] : 0;
        // 端数の位置は、となりの 2 点をまっすぐつないで読む。書く前に読む(遅れ 1 でも前の値)
        const at = w - dl[i];
        const j = Math.floor(at), f = at - j;
        const d = buf[j & mask] * (1 - f) + buf[(j + 1) & mask] * f;
        const s = xi + fb * d;
        buf[w] = Math.abs(s) < 1e-20 ? 0 : s;
        y[i] = xi * (1 - mix) + d * mix;
        w = (w + 1) & mask;
      }
      if (c === out.length - 1) this.w = w;
    }
    return true;
  }
}
registerProcessor('${FLANGER_NODE}', Flanger);
`;
