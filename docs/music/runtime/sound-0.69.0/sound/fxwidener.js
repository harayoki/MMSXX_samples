// ワイドナー。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 左右の広がりを増やす。DAW の定番のステレオワイドナーにならった。
// 音を真ん中(左右の和)と脇(左右の差)に分けて、脇を大きくする。
//
// - 左右が違う音なら、もとの脇を (1 + width) 倍にする
// - 左右が同じ音(モノラルの音)には脇が無いので、真ん中を delay ms 遅らせたものを脇に加える。
//   遅らせたものは 150Hz の 1 次のハイパスに通す。低音は真ん中に残す
// - 加えるのは脇だけなので、左右を足すと元の音に戻る(モノラルに畳んでも、音色も大きさも変わらない)
// - 左右を作るのはステレオで鳴らすときだけ(sound/audio.js が出口を 2 本に決める)。
//   モノラルでは何もせずに通す

/** widener の処理器の名前 */
export const WIDENER_NODE = 'mmsxx-widener';

/** 脇に加える音のハイパス(Hz)。これより低い音は真ん中に残す */
export const WIDENER_LOW = 150;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const WIDENER_FX = {
  widener: {
    tags: ['stereo'], dev: [], version: '1.00',
    desc: 'Stereo widener. Makes the sound wider between the speakers by raising the difference between left and right. A mono sound has no difference, so a slightly delayed copy is added as one, with the bass kept in the middle. Summed back to mono, the sound is exactly what came in. It only shows when the player asks for stereo; in mono the sound passes untouched.',
    params: {
      width: { live: false, min: 0, max: 1, default: 0.5, desc: 'How much wider, from 0 (as it is) to 1. At 1 the existing difference between left and right is doubled, and a mono sound gets a delayed copy as loud as itself in the difference.' },
      delay: { live: false, unit: 'ms', min: 1, max: 30, default: 12, desc: 'Delay of the copy added to a mono sound, in milliseconds. Short delays sound like a wide source; longer ones begin to sound like a second sound to one side.' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * widener の処理器。入口 1 つ、出口 1 つ。出口が 2 本のときだけ広げる。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const WIDENER_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(WIDENER_FX.widener.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const LOW = ${WIDENER_LOW};
class Widener extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.width = v('width', 0, 1);
    this.d = Math.max(1, Math.round(v('delay', 1, 30) / 1000 * sampleRate));
    this.n = this.d + 1;
    this.buf = new Float32Array(this.n);
    this.w = 0;
    // 1 次のハイパス
    this.hk = Math.exp(-2 * Math.PI * LOW / sampleRate);
    this.hx = 0; this.hy = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length;
    if (out.length < 2) {
      const x = inp && inp[0];
      if (x) out[0].set(x); else out[0].fill(0);
      return true;
    }
    const xl = inp && inp[0], xr = inp && (inp[1] || inp[0]);
    const yl = out[0], yr = out[1];
    const width = this.width, n = this.n, buf = this.buf, hk = this.hk;
    let w = this.w, hx = this.hx, hy = this.hy;
    for (let i = 0; i < len; i++) {
      const l = xl ? xl[i] : 0, r = xr ? xr[i] : 0;
      const m = (l + r) * 0.5, s = (l - r) * 0.5;
      buf[w] = m;
      const dm = buf[(w + 1) % n];
      // 1 次のハイパス(y = k (y + x - x前))
      hy = hk * (hy + dm - hx);
      hx = dm;
      const side = s * (1 + width) + hy * width;
      yl[i] = m + side;
      yr[i] = m - side;
      w = (w + 1) % n;
    }
    for (let c = 2; c < out.length; c++) out[c].fill(0);
    this.w = w; this.hx = hx; this.hy = hy;
    return true;
  }
}
registerProcessor('${WIDENER_NODE}', Widener);
`;
