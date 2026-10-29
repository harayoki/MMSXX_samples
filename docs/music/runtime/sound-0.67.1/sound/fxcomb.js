// コムフィルタ。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 短い遅れを戻しながら回して、決まった高さの倍音の並びに山を立てる。山と谷が櫛の歯のように並ぶので、
// 金属の管や弦が鳴っているような響きになる。DAW の定番のコムフィルタにならった。
//
// - 遅れは 1 / freq 秒。山は freq とその整数倍に立つ。遅れは小数のサンプルまで読む(1 次の補間)
// - 戻りは feedback。負にすると、山が freq の奇数倍の半分(freq / 2、3 freq / 2 …)へ移り、うつろな音になる
// - 効いた音は (1 - |feedback|) 倍にして、山の高さを元の音と同じ 0dB に揃える。谷は (1 - |fb|) / (1 + |fb|) まで下がる
// - mix は DAW の Dry/Wet。揺らさないので、flanger と違って歯は止まったまま

/** comb の処理器の名前 */
export const COMB_NODE = 'mmsxx-comb';

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const COMB_FX = {
  comb: {
    tags: ['filter', 'sfx'], dev: ['wip'], version: '0.1',
    desc: 'Comb filter. A very short delay fed back on itself raises a row of peaks at one pitch and all its multiples, like the teeth of a comb, so the sound rings like a metal tube or a plucked string. Unlike the flanger, the teeth stand still. Noise and drums take on the pitch of freq.',
    params: {
      freq: { live: false, unit: 'Hz', min: 20, max: 5000, default: 220, desc: 'Pitch of the ringing. The peaks stand at this pitch and its whole multiples; the delay is one over this many seconds.' },
      feedback: { live: false, min: -0.95, max: 0.95, default: 0.7, desc: 'How much of the delayed sound goes round again. Near 0.95 the peaks are sharp and ring on like a string; near 0 the comb is shallow. Negative values move the peaks to half way between, an octave lower and hollow, on the odd multiples only.' },
      mix: { live: false, min: 0, max: 1, default: 0.5, desc: 'How much of the sound is the combed sound, from 0 (the dry sound alone) to 1 (the combed sound alone). The peaks are scaled to the level of the dry sound.' },
    },
  },
};

/**
 * comb の処理器。入口 1 つ、出口 1 つ。チャンネルごとに遅れ線を持つ。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const COMB_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(COMB_FX.comb.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
class Comb extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.d = Math.max(1, sampleRate / v('freq', 20, 5000));
    this.fb = v('feedback', -0.95, 0.95);
    this.mix = v('mix', 0, 1);
    this.norm = 1 - Math.abs(this.fb);
    this.n = Math.ceil(this.d) + 2;
    this.bufs = [];
    this.w = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, n = this.n, d = this.d, fb = this.fb, mix = this.mix, norm = this.norm;
    const di = Math.floor(d), f = d - di;
    let w = this.w;
    for (let c = 0; c < out.length; c++) {
      const buf = this.bufs[c] || (this.bufs[c] = new Float32Array(n));
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      w = this.w;
      for (let i = 0; i < len; i++) {
        const xi = x ? x[i] : 0;
        // d サンプル前と d + 1 サンプル前のあいだを読む
        const a = buf[(w - di + n) % n], b = buf[(w - di - 1 + n) % n];
        const r = a + (b - a) * f;
        const s = xi + fb * r;
        buf[w] = s;
        y[i] = xi * (1 - mix) + s * norm * mix;
        w = (w + 1) % n;
      }
    }
    this.w = w;
    return true;
  }
}
registerProcessor('${COMB_NODE}', Comb);
`;
