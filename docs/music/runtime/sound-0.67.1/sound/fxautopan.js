// オートパン。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 左右の定位を周期的に揺らす。音量を揺らすほうは tremolo(sound/fxtremolo.js)。
// DAW でも別々のエフェクトになっていることが多いので、分けた。
//
// - 速さは rate(Hz)。MML では `@l 2` のように、1 周の長さを音長でも書ける(tremolo と同じ)
// - 揺れは曲の頭に揃える(AudioParam `origin`。tremolo、gate と同じ)。
//   1 周の頭で左の端、半周で右の端へ行く
// - 形は tremolo と同じ。0 正弦、1 三角、2 矩形(左と右を行き来する)、3 のこぎり(左から右へ流れて戻る)。
//   矩形とのこぎりの角は 2ms でならす
// - 振り方は等パワー。真ん中で元の大きさ、端では片側が 3dB 大きくなり、もう片側は消える。
//   左右の音の力の和は、どこにいても変わらない
// - 左右を作るのはステレオで鳴らすときだけ(sound/audio.js が出口を 2 本に決める)。
//   モノラルで鳴らすときは、何もせずに通す。左右を 1 本にまとめると、揺れが音量の揺れとして聞こえてしまうため

import { LFO_SHAPES_CODE, TREMOLO_SMOOTH } from './fxtremolo.js';

/** autopan の処理器の名前 */
export const AUTOPAN_NODE = 'mmsxx-autopan';

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const AUTOPAN_FX = {
  autopan: {
    tags: ['modulation', 'stereo', 'rhythm'], dev: [], version: '1.00',
    desc: 'Auto-pan. The sound swings between the left and right speakers over and over. The swing lines up with the start of the tune: each cycle starts at the left and reaches the right half way through. From MML, the length of one cycle can be a note length (@l 2). It only shows when the player asks for stereo; in mono the sound passes untouched.',
    params: {
      rate: { live: false, unit: 'Hz', min: 0.05, max: 20, default: 1, desc: 'Cycles per second. Around 1 is a gentle sway; above 5 it flutters. In MML, @l 2 sets one cycle to a half note of the tune.' },
      depth: { live: false, min: 0, max: 1, default: 1, desc: 'How far the sound swings, from 0 (it stays where it is) to 1 (all the way to each speaker).' },
      shape: {
        live: false, min: 0, max: 3, default: 0,
        desc: 'Shape of the swing: a number, rounded to a whole one, or the name of one of the choices (sine, triangle, square, saw).',
        choices: [
          { value: 0, name: 'sine', desc: 'Sine. A smooth swing.' },
          { value: 1, name: 'triangle', desc: 'Triangle. Like the sine, with sharper turns at each side.' },
          { value: 2, name: 'square', desc: 'Square. It jumps between left and right, a ping-pong.' },
          { value: 3, name: 'saw', desc: 'Saw. It drifts from left to right and snaps back.' },
        ],
      },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * autopan の処理器。入口 1 つ、出口 1 つ。出口が 2 本のときだけ左右へ振る。
 * 入口が 2 本なら、左を左の量、右を右の量で絞る(バランスと同じ)。
 * AudioParam `origin` は曲の頭の時刻(AudioContext の時計の秒)。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const AUTOPAN_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(AUTOPAN_FX.autopan.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
${LFO_SHAPES_CODE}
class AutoPan extends AudioWorkletProcessor {
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
    this.pan = null;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, parameters) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, sr = sampleRate;
    if (out.length < 2) {
      // 出口が 1 本(モノラル)なら、そのまま通す
      const x = inp && inp[0];
      if (x) out[0].set(x); else out[0].fill(0);
      return true;
    }
    const origin = parameters && parameters.origin ? parameters.origin[0] : 0;
    const t0 = currentTime - origin;
    const rate = this.rate, depth = this.depth, shape = this.shape;
    const a = shape >= 2 ? this.a : 0;
    const gl = this.gl || (this.gl = new Float32Array(len));
    const gr = this.gr || (this.gr = new Float32Array(len));
    let pan = this.pan;
    for (let i = 0; i < len; i++) {
      const c = (t0 + i / sr) * rate;
      // 1 周の頭(高さ 1)で左の端(-1)
      const target = -depth * (2 * lfoAt(shape, c - Math.floor(c)) - 1);
      pan = pan === null ? target : target + (pan - target) * a;
      // 等パワー。真ん中で左右とも 1
      const q = (pan + 1) * Math.PI / 4;
      gl[i] = Math.SQRT2 * Math.cos(q);
      gr[i] = Math.SQRT2 * Math.sin(q);
    }
    this.pan = pan;
    const xl = inp && inp[0], xr = inp && (inp[1] || inp[0]);
    const yl = out[0], yr = out[1];
    for (let i = 0; i < len; i++) {
      yl[i] = xl ? xl[i] * gl[i] : 0;
      yr[i] = xr ? xr[i] * gr[i] : 0;
    }
    for (let c = 2; c < out.length; c++) out[c].fill(0);
    return true;
  }
}
registerProcessor('${AUTOPAN_NODE}', AutoPan);
`;
