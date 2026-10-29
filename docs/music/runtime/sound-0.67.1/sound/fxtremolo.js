// トレモロ。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 音量を周期的に揺らす。ギターアンプのトレモロにならった。
// 左右の定位を揺らすほうは autopan(sound/fxautopan.js)。DAW でも別々のエフェクトに
// なっていることが多いので、分けた。
//
// - 速さは rate(Hz)。MML では `@l 8` のように、1 周の長さを音長でも書ける
//   (秒に直すテンポは echo と同じ決め方。曲の途中でテンポが変わってもついてこない)
// - 揺れは曲の頭に揃える。曲の頭の時刻は AudioParam(`origin`)で受ける(gate と同じ。
//   書き込むのは sound/audio.js の `_fxOrigin`)。曲の頭と、そこから 1 周ごとが、いちばん大きいところになる
// - 形は shape で選ぶ。0 正弦、1 三角、2 矩形、3 のこぎり(頭で大きく、1 周かけて下がる)。
//   矩形とのこぎりの角は 2ms でならす(プツッと鳴らないように)
// - depth は谷の深さ。1 で谷が無音、0.5 で半分

/** tremolo の処理器の名前 */
export const TREMOLO_NODE = 'mmsxx-tremolo';

/** 角をならす時間(ms) */
export const TREMOLO_SMOOTH = 2;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const TREMOLO_FX = {
  tremolo: {
    tags: ['modulation', 'rhythm'], dev: [], version: '1.00',
    desc: 'Tremolo, as in the tremolo of a guitar amplifier. The level rises and falls over and over. The sway lines up with the start of the tune, loudest at the start of each cycle. From MML, the length of one cycle can be a note length (@l 8), worked out from the tempo of the tune; it does not follow tempo changes inside a tune.',
    params: {
      rate: { live: false, unit: 'Hz', min: 0.05, max: 20, default: 5, desc: 'Cycles per second. Around 5 is the amp tremolo; below 1 it is a slow swell. In MML, @l 8 sets one cycle to an eighth note of the tune.' },
      depth: { live: false, min: 0, max: 1, default: 0.5, desc: 'How far the level dips, from 0 (not at all) to 1 (down to silence at the bottom of each cycle).' },
      shape: {
        live: false, min: 0, max: 3, default: 0,
        desc: 'Shape of the sway: a number, rounded to a whole one, or the name of one of the choices (sine, triangle, square, saw).',
        choices: [
          { value: 0, name: 'sine', desc: 'Sine. A smooth sway.' },
          { value: 1, name: 'triangle', desc: 'Triangle. Like the sine, with sharper turns at the top and bottom.' },
          { value: 2, name: 'square', desc: 'Square. A hard on and off chop.' },
          { value: 3, name: 'saw', desc: 'Saw. Loud at the start of each cycle, fading to the end.' },
        ],
      },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/** 形ごとの、1 周の中の位置(0〜1)から 0〜1 の高さを出す式。1 周の頭が 1。autopan も使う */
export const LFO_SHAPES_CODE = `
const lfoAt = (shape, ph) => {
  if (shape === 1) return ph < 0.5 ? 1 - 2 * ph : 2 * ph - 1;
  if (shape === 2) return ph < 0.5 ? 1 : 0;
  if (shape === 3) return 1 - ph;
  return 0.5 + 0.5 * Math.cos(2 * Math.PI * ph);
};
`;

/**
 * tremolo の処理器。入口 1 つ、出口 1 つ。左右は同じに揺らす。
 * AudioParam `origin` は曲の頭の時刻(AudioContext の時計の秒)。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const TREMOLO_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(TREMOLO_FX.tremolo.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
${LFO_SHAPES_CODE}
class Tremolo extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'origin', defaultValue: 0, automationRate: 'k-rate' }];
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.rate = v('rate', 0.05, 20);
    this.depth = v('depth', 0, 1);
    this.shape = Math.round(v('shape', 0, 3));
    this.a = Math.exp(-1 / (${TREMOLO_SMOOTH} / 1000 * sampleRate));
    this.g = null;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, parameters) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, sr = sampleRate;
    const origin = parameters && parameters.origin ? parameters.origin[0] : 0;
    const t0 = currentTime - origin;
    const rate = this.rate, depth = this.depth, shape = this.shape;
    // 正弦と三角は角が無いので、ならさない(ならすと遅れて、曲の頭からずれる)
    const a = shape >= 2 ? this.a : 0;
    const gs = this.gs || (this.gs = new Float32Array(len));
    let g = this.g;
    for (let i = 0; i < len; i++) {
      const c = (t0 + i / sr) * rate;
      const target = 1 - depth * (1 - lfoAt(shape, c - Math.floor(c)));
      g = g === null ? target : target + (g - target) * a;
      gs[i] = g;
    }
    this.g = g;
    for (let c = 0; c < out.length; c++) {
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      if (!x) { y.fill(0); continue; }
      for (let i = 0; i < len; i++) y[i] = x[i] * gs[i];
    }
    return true;
  }
}
registerProcessor('${TREMOLO_NODE}', Tremolo);
`;
