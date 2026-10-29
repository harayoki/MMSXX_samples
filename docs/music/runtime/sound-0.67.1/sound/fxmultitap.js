// マルチタップディレイ。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 返りを何本か、決まった間隔で返す。Roland Space Echo のように、テープの上に再生ヘッドが
// 何個も並んでいるものにならった。echo が 1 本の返りを回し続けるのに対して、こちらは
// 1 回の音から taps 本の返りが、time 秒ごとに並んで返る。
//
// - k 本目の返りは k × time 秒あと、大きさは decay の (k - 1) 乗
// - feedback は、最後の返りを遅れ線の入口へ戻す。0 なら taps 本で終わる。上げると、並びごとくり返す
// - 遅れは `@l 8` のように音長でも書ける(time を持つので、echo と同じ)
// - mix は DAW の Dry/Wet。曲の途中で動かせる(AudioParam)。外すときは echo と同じく、返りが鳴り終わるまでかけて下げる

/** multitap の処理器の名前 */
export const MULTITAP_NODE = 'mmsxx-multitap';

/** 返りの数の上限 */
export const MULTITAP_MAX_TAPS = 8;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const MULTITAP_FX = {
  multitap: {
    tags: ['delay'], dev: ['wip'], version: '0.1',
    desc: 'Multi-tap delay, as in the Roland Space Echo with several playback heads. Each sound comes back several times at an even spacing, each repeat softer than the one before, then stops; with feedback the whole row of repeats comes round again. From MML, the spacing can be a note length (@l 8), worked out from the tempo of the tune.',
    params: {
      time: { live: false, unit: 's', min: 0.01, max: 1, default: 0.25, desc: 'Seconds between one repeat and the next. In MML, @l 8 sets it to an eighth note of the tune.' },
      taps: { live: false, min: 1, max: MULTITAP_MAX_TAPS, default: 4, desc: 'How many repeats, rounded to a whole number. The last one comes taps times time after the sound.' },
      decay: { live: false, min: 0, max: 1, default: 0.7, desc: 'Level of each repeat against the one before. 1 keeps them all at the same level; 0.5 halves each one.' },
      feedback: { live: false, min: 0, max: 0.9, default: 0, desc: 'How much of the last repeat goes back in, so the whole row comes round again. 0 stops after the last repeat.' },
      mix: { live: true, min: 0, max: 1, default: 0.3, desc: 'How much of the sound is repeats, from 0 (the dry sound alone) to 1 (the repeats alone). Set 1 when it sits on a send.' },
    },
  },
};

/**
 * multitap の処理器。入口 1 つ、出口 1 つ。チャンネルごとに遅れ線を持つ。
 * AudioParam `mix`。作るときの値は processorOptions にも入れる。
 *
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const MULTITAP_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(MULTITAP_FX.multitap.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
class MultiTap extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'mix', defaultValue: DEF.mix, minValue: 0, maxValue: 1, automationRate: 'k-rate' }];
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.len = Math.max(1, Math.round(v('time', 0.01, 1) * sampleRate));
    this.taps = Math.round(v('taps', 1, ${MULTITAP_MAX_TAPS}));
    const decay = v('decay', 0, 1);
    this.gains = Array.from({ length: this.taps }, (_, k) => Math.pow(decay, k));
    // 戻すのは、聞こえている最後の返り(大きさを掛けたあと)の feedback 倍
    this.fb = v('feedback', 0, 0.9) * this.gains[this.taps - 1];
    this.mix0 = v('mix', 0, 1);
    this.n = this.len * this.taps + 1;
    this.bufs = [];
    this.w = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, n = this.n, step = this.len, taps = this.taps, gains = this.gains;
    const mix = params && params.mix ? params.mix[0] : this.mix0;
    const fb = this.fb;
    let w = this.w;
    for (let c = 0; c < out.length; c++) {
      const buf = this.bufs[c] || (this.bufs[c] = new Float32Array(n));
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      w = this.w;
      for (let i = 0; i < len; i++) {
        const xi = x ? x[i] : 0;
        let z = 0, last = 0;
        for (let k = 0; k < taps; k++) {
          const r = buf[(w - (k + 1) * step + n) % n];
          z += r * gains[k];
          last = r;
        }
        buf[w] = xi + last * fb;
        y[i] = xi * (1 - mix) + z * mix;
        w = (w + 1) % n;
      }
    }
    this.w = w;
    return true;
  }
}
registerProcessor('${MULTITAP_NODE}', MultiTap);
`;
