// テープストップ。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 曲の切れ目の飾り。テープを止めたときのように、音の高さと速さを一緒に落として止める。
// DAW の定番のテープストップにならった。
//
// - 効かせるのは on。1 にしたところから、time 秒かけて速さを 1 から 0 までまっすぐ落とす。
//   止まりきると無音になる。曲の途中で `@fx{stop @on 1}` … `@fx{stop @on 0}` と書く
//   (AudioParam。サンプル単位で切り替わる)
// - 0 に戻すと、5ms かけて元の音へ戻る。テープを回しなおす(だんだん速くする)動きは持たない
// - 止める長さは `@l 2` のように音長でも書ける。書かなければその曲の 4 分音符
// - 速さが 0.05 を下回ると、そこから 0 までで音量も下げる(止まる瞬間にプツッと鳴らないように)
// - 速さを落とすあいだ、読む位置は書く位置から遅れていく。いちばん遅れるのは止まりきったときで、time の半分

/** tapestop の処理器の名前 */
export const TAPESTOP_NODE = 'mmsxx-tapestop';

/** 0 に戻したときに、元の音へ戻るまでの長さ(ms) */
export const TAPESTOP_BACK = 5;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const TAPESTOP_FX = {
  tapestop: {
    tags: ['rhythm', 'sfx', 'vintage'], dev: ['wip'], version: '0.1',
    desc: 'Tape stop, a fill for the end of a phrase. When on goes to 1, the sound slows down and drops in pitch together, like a tape machine being switched off, until it stops in silence. When on goes back to 0, the sound returns at once. Switch it in the middle of a tune with @fx{name @on 1} and @fx{name @on 0}. In MML the stopping time can be a note length (@l 2), and without one it is a quarter note of the tune.',
    params: {
      on: { live: true, min: 0, max: 1, default: 0, desc: 'Switch. 0 lets the sound through; 1 starts slowing it down from that moment. Back to 0, the sound returns within 5 ms.' },
      time: { live: false, unit: 's', min: 0.05, max: 4, default: 0.5, desc: 'Seconds from full speed to a standstill. In MML write a note length such as @l 2; without one it is a quarter note of the tune (0.5 at 120 BPM).' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * tapestop の処理器。入口 1 つ、出口 1 つ。チャンネルごとに遅れ線を持つ。
 * AudioParam `on`(a-rate)。作るときの値は processorOptions にも入れる。
 *
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const TAPESTOP_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(TAPESTOP_FX.tapestop.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// 速さがこれより下で、音量も下げる
const QUIET = 0.05;
class TapeStop extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'on', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'a-rate' }];
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.on0 = v('on', 0, 1);
    this.T = Math.max(1, Math.round(v('time', 0.05, 4) * sampleRate));
    this.n = Math.ceil(this.T / 2) + 8;
    this.back = Math.max(1, Math.round(${TAPESTOP_BACK} / 1000 * sampleRate));
    this.bufs = [];
    this.w = 0;          // 書いた数(通しの番号)
    this.r = 0;          // 読む位置(通しの番号、小数)
    this.t = 0;          // 効かせてからのサンプル数
    this.was = false;
    this.active = false;
    this.rel = 0;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, n = this.n, T = this.T, B = this.back;
    const on = params && params.on ? params.on : null;
    const nc = out.length;
    for (let c = 0; c < nc; c++) if (!this.bufs[c]) this.bufs[c] = new Float32Array(n);
    let { w, r, t, was, active, rel } = this;
    for (let i = 0; i < len; i++) {
      const v = on ? (on.length > 1 ? on[i] : on[0]) : this.on0;
      const up = v >= 0.5;
      if (up && !was) { active = true; t = 0; r = w; rel = 0; }
      else if (!up && was && active) { active = false; rel = B; }
      was = up;
      const busy = active || rel > 0;
      const s = Math.max(0, 1 - t / T);
      const g = s < QUIET ? s / QUIET : 1;
      const k = active ? 1 : rel / B;
      const i0 = Math.floor(r), f = r - i0;
      for (let c = 0; c < nc; c++) {
        const x = inp && (inp[c] || inp[0]);
        const xi = x ? x[i] : 0;
        const buf = this.bufs[c];
        buf[w % n] = xi;
        if (!busy) { out[c][i] = xi; continue; }
        const a = buf[i0 % n], b = buf[(i0 + 1) % n];
        const y = (i0 + 1 > w ? a : a + (b - a) * f) * g;
        out[c][i] = y * k + xi * (1 - k);
      }
      if (busy) { r += s; t++; }
      if (!active && rel > 0) rel--;
      w++;
    }
    Object.assign(this, { w, r, t, was, active, rel });
    return true;
  }
}
registerProcessor('${TAPESTOP_NODE}', TapeStop);
`;
