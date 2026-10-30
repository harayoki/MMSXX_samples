// ラジオ。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 電話や古いラジオから聞こえるように、帯を狭めて歪ませる。曲の始まりや間奏の飾り。
//
// - 帯は low(Hz)から high(Hz)まで。2 極のハイパスと 2 極のローパスを並べる。
//   既定は 300Hz から 3.4kHz(電話の帯)
// - 帯を通したあと、saturator と同じ形(tanh(g x) / g)で丸める。g は drive 0〜1 を 0〜24dB にしたもの。
//   丸めると大きい音が下がるので、g の平方根を掛けて半分ほど戻す。drive 0 では丸めない
// - 丸めて出た帯の外の倍音は、もう一度同じ帯に通して削る(小さいスピーカーで鳴らすのと同じ)。
//   drive 0 でも 2 回通す(drive で帯の形が変わらないように)。low と high の高さで 6dB、
//   1 オクターブ外で 25dB ほど下がる(既定の帯で、150Hz が -25dB、6.8kHz が -26dB だった)
// - いまある bandpass と saturator を並べれば近いものは作れるが、名前 1 つで掛けられるように 1 つのエフェクトにした。
//   プリセット(名前付きの並び)の仕組みは作っていない

/** radio の処理器の名前 */
export const RADIO_NODE = 'mmsxx-radio';

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const RADIO_FX = {
  radio: {
    tags: ['lofi', 'filter', 'saturation'], dev: ['wip'], version: '0.1',
    desc: 'Telephone or old radio. The sound is squeezed into a narrow band and driven into distortion, as if heard through a small, cheap speaker. A fill for an intro or a break. The defaults are the telephone band; widen high for an AM radio.',
    params: {
      drive: { live: false, min: 0, max: 1, default: 0.5, desc: 'How hard the sound is driven, as in saturator. 0 is clean (the band alone); at 1 it is harsh and crackly.' },
      low: { live: false, unit: 'Hz', min: 20, max: 2000, default: 300, desc: 'Lowest pitch let through. 300 is the telephone; lower it for a fuller radio.' },
      high: { live: false, unit: 'Hz', min: 1000, max: 12000, default: 3400, desc: 'Highest pitch let through. 3400 is the telephone; around 5000 is an AM radio.' },
      mix: { live: false, min: 0, max: 1, default: 1, desc: 'How much of the sound goes through the radio, from 0 (the dry sound alone) to 1 (the radio alone).' },
    },
  },
};

/**
 * radio の処理器。入口 1 つ、出口 1 つ。チャンネルごとに状態を持つ。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const RADIO_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(RADIO_FX.radio.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// 2 極(Butterworth)の係数。RBJ の形
const biquad = (hp, f) => {
  const w0 = 2 * Math.PI * Math.min(f, sampleRate * 0.45) / sampleRate;
  const al = Math.sin(w0) / Math.SQRT2, c = Math.cos(w0), a0 = 1 + al;
  const b = hp ? [(1 + c) / 2, -(1 + c), (1 + c) / 2] : [(1 - c) / 2, 1 - c, (1 - c) / 2];
  return { b0: b[0] / a0, b1: b[1] / a0, b2: b[2] / a0, a1: -2 * c / a0, a2: (1 - al) / a0 };
};
// 直接形 II 転置で 1 サンプル。s は [z1, z2]
const step = (k, s, x) => {
  const y = k.b0 * x + s[0];
  s[0] = k.b1 * x - k.a1 * y + s[1];
  s[1] = k.b2 * x - k.a2 * y;
  return y;
};
class Radio extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const drive = v('drive', 0, 1);
    this.g = drive > 0 ? Math.pow(10, drive * 24 / 20) : 0;
    this.up = this.g ? Math.sqrt(this.g) : 1;
    this.mix = v('mix', 0, 1);
    this.hp = biquad(true, v('low', 20, 2000));
    this.lp = biquad(false, v('high', 1000, 12000));
    this.st = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, g = this.g, up = this.up, mix = this.mix, hp = this.hp, lp = this.lp;
    for (let c = 0; c < out.length; c++) {
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      if (!x) { y.fill(0); continue; }
      if (mix === 0) { y.set(x); continue; }
      const s = this.st[c] || (this.st[c] = [[0, 0], [0, 0], [0, 0], [0, 0]]);
      for (let i = 0; i < len; i++) {
        let z = step(lp, s[1], step(hp, s[0], x[i]));
        if (g) z = Math.tanh(g * z) / g * up;
        z = step(lp, s[3], step(hp, s[2], z));
        y[i] = x[i] * (1 - mix) + z * mix;
      }
    }
    return true;
  }
}
registerProcessor('${RADIO_NODE}', Radio);
`;
