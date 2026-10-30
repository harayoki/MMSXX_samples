// ゲートリバーブ。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 長く密な響きを、途中でばっさり切る。80 年代のスネアやタムの、大きく広がって
// すぐに消える響き。響きの後ろに、入口の音の大きさで開くゲートを置く。
//
// - 響きは plate と同じ輪(sound/fxplate.js の PLATE_TANK_CODE)。長さは decay で、
//   切るのが前提なので、既定は長めの 3 秒にした。高音を削るローパスは 9kHz に決めてある
// - ゲートは元の音を聞いて開く。元の音の大きさ(左右の大きいほう。立ち上がりはすぐに、
//   下がりは 10ms で追う)が threshold を超えると開く。下回ってから hold ms はそのまま開いておき、
//   そのあと release ms でまっすぐ 0 まで閉じる。開くときは 1ms でならす
// - ゲートは響きにだけ掛ける。元の音はそのまま通る
// - mix は DAW の Dry/Wet

import { PLATE_TANK_CODE } from './fxplate.js';

/** gatedreverb の処理器の名前 */
export const GATEDREVERB_NODE = 'mmsxx-gatedreverb';

/** 響きの中のローパス(Hz)。plate の highcut の既定と同じ */
export const GATEDREVERB_TONE = 9000;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const GATEDREVERB_FX = {
  gatedreverb: {
    tags: ['space', 'dynamics'], dev: ['wip'], version: '0.1',
    desc: 'Gated reverb, the big snare of the 1980s. A long, dense ring is cut off sharply soon after each hit, so the drum sounds huge but leaves the beat clear. The gate opens while the dry sound is above the threshold, stays open for hold, then shuts over release. Only the ring is gated; the dry sound passes as it is.',
    params: {
      threshold: { live: false, unit: 'dB', min: -60, max: 0, default: -30, desc: 'How loud the dry sound must be to open the gate, in dB below full scale. Lower values let quieter hits open it too.' },
      hold: { live: false, unit: 'ms', min: 10, max: 1000, default: 250, desc: 'Milliseconds the gate stays open after the dry sound falls below the threshold. This sets how long the ring lasts; around 200 to 350 is the classic snare.' },
      release: { live: false, unit: 'ms', min: 1, max: 500, default: 40, desc: 'Milliseconds the gate takes to shut once hold is over. Short values cut the ring off abruptly, the classic sound; longer ones fade it out.' },
      decay: { live: false, unit: 's', min: 0.5, max: 10, default: 3, desc: 'Seconds the ring would take to fade by 60 dB if the gate never shut. Long values keep the ring loud and dense right up to the cut.' },
      mix: { live: false, min: 0, max: 1, default: 0.5, desc: 'How much of the sound is ring, from 0 (the dry sound alone) to 1 (the ring alone).' },
    },
  },
};

/**
 * gatedreverb の処理器。入口 1 つ、出口 1 つ。入口は左右を合わせて 1 本にして輪へ入れる。
 * 出口が 2 本なら左右に別の響きを、1 本なら左右を合わせて √2 で割ったものを出す(plate と同じ)。
 * ステレオで鳴らすときは、出口を 2 本に決める(`COLOR_WORKLETS` の `stereo`)。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const GATEDREVERB_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(GATEDREVERB_FX.gatedreverb.params).map(([k, v]) => [k, v.default])))};
const TONE = ${GATEDREVERB_TONE};
// 元の音の大きさを追う速さ(下がるとき、秒)と、開くときにならす秒
const FOLLOW = 0.01, OPEN = 0.001;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
${PLATE_TANK_CODE}
class GatedReverb extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const sr = sampleRate;
    this.tank = new PlateTank(sr, v('decay', 0.5, 10), TONE);
    this.mix = v('mix', 0, 1);
    this.thr = Math.pow(10, v('threshold', -60, 0) / 20);
    this.hold = Math.round(v('hold', 10, 1000) / 1000 * sr);
    this.down = 1 / Math.max(1, v('release', 1, 500) / 1000 * sr);
    this.up = 1 / Math.max(1, OPEN * sr);
    this.fall = Math.exp(-1 / (FOLLOW * sr));
    this.env = 0;
    this.left = 0;   // 開いたままにしておく残りのサンプル数
    this.g = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, mix = this.mix, t = this.tank;
    const xl = inp && inp[0], xr = inp && (inp[1] || inp[0]);
    const two = inp && inp.length > 1;
    const yl = out[0], yr = out[1];
    let env = this.env, left = this.left, g = this.g;
    for (let i = 0; i < len; i++) {
      const a = xl ? xl[i] : 0, b = xr ? xr[i] : 0;
      const pk = Math.max(Math.abs(a), Math.abs(b));
      env = pk > env ? pk : env * this.fall;
      if (env > this.thr) left = this.hold;
      else if (left > 0) left--;
      g = left > 0 ? Math.min(1, g + this.up) : Math.max(0, g - this.down);
      t.step(two ? (a + b) * 0.5 : a);
      const w = mix * g;
      if (yr) {
        yl[i] = a * (1 - mix) + t.l * w;
        yr[i] = b * (1 - mix) + t.r * w;
      } else {
        yl[i] = a * (1 - mix) + (t.l + t.r) * Math.SQRT1_2 * w;
      }
    }
    this.env = env < 1e-20 ? 0 : env; this.left = left; this.g = g;
    return true;
  }
}
registerProcessor('${GATEDREVERB_NODE}', GatedReverb);
`;
