// レコード。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// レコード盤で聞いているような音にする。パチパチという針の音、盤の面のかすかな雑音、
// 盤の反りや中心のずれで 1 回転ごとに揺れる音の高さ、少し下がった高音。
//
// - 揺れは tape(sound/fxtape.js)の作りを流用した。決まった遅れのまわりで遅れ線を揺らし、
//   4 点のエルミート補間で読む。乱数と揺れの強さの移り変わり(TAPE_WOBBLE_CODE)も同じものを使う。
//   tape と違い、揺れの速さは盤の回転に合わせる(33 回転なら 1 秒に約 0.56 回)
// - パチパチは、ところどころに置いたとがった音。いつ鳴るかは乱数で決め、1 秒あたりの数の
//   平均が density になる。大きさも乱数で決め、小さいものが多く、ときどき大きいものが混ざる
//   (一様乱数の 4 乗)。1kHz の 1 次のハイパスを通して、低いボツッという音にはしない
// - 雑音は左右で別のもの。パチパチは左右で同じもの(1 本の溝を 1 本の針が読むので)
// - 最後に、全体を 2 極のローパス(highcut)に通す。元の音も雑音も、高い帯が少し下がる
// - 雑音とパチパチは、音が鳴っていなくても出る。tape の hiss と同じく、並びを止めたとき
//   (曲を止めたとき)に止まる。書き出しの後ろの余白は延ばさない
// - 乱数は種を決めてある。鳴らすときと書き出すときで、同じところでパチッと鳴る
// - 音は VINYL_LATENCY だけ遅れる(tape と同じく、ほかのチャンネルとの遅れはそろえない)

import { TAPE_WOBBLE_CODE } from './fxtape.js';

/** vinyl の処理器の名前 */
export const VINYL_NODE = 'mmsxx-vinyl';

/**
 * 遅れ線の決まった遅れ(秒)。tape と同じ長さにした。
 * 揺れの上限(下の WOW_DEPTH、33 回転で約 2.9ms)より長い
 */
export const VINYL_LATENCY = 0.01;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const VINYL_FX = {
  vinyl: {
    tags: ['noise', 'vintage', 'modulation'], dev: ['wip'], version: '0.1',
    desc: 'Vinyl record. Sounds as if the tune is playing from an old record: crackle and pops from the stylus, a soft surface hiss, a slow pitch wobble once per turn of a slightly warped disc, and softened highs. The crackle and hiss go on even when the tune is silent, as on a real record, until the tune is stopped. The sound comes out 10 ms late.',
    params: {
      crackle: { live: false, min: 0, max: 1, default: 0.3, desc: 'How loud the crackle and pops are. 0 turns them off. Most clicks are small, with now and then a louder pop; at 1 the loudest pops reach about a quarter of full scale.' },
      density: { live: false, unit: '/s', min: 0, max: 50, default: 6, desc: 'How many clicks a second, on average. Around 2 is a well kept record; 20 and more is a dusty, worn one.' },
      hiss: { live: false, min: 0, max: 1, default: 0.2, desc: 'Surface noise: a soft, steady hiss. Left and right get different noise. 1 is about 37 dB below full scale with the default highcut, a very noisy record; the default is faint.' },
      wow: { live: false, min: 0, max: 1, default: 0.2, desc: 'How far the pitch wobbles once per turn, like a warped disc or a hole that is off centre. At 1 the pitch swings by about 17 cents, clearly seasick; 0.2 is a faint drift.' },
      rpm: { live: false, unit: 'rpm', min: 33, max: 78, default: 33.3, desc: 'Turns per minute, which sets how fast the wobble goes. 33.3 is an LP, 45 a single, 78 an old shellac disc.' },
      highcut: { live: false, unit: 'Hz', min: 2000, max: 20000, default: 12000, desc: 'Cutoff of a gentle low-pass over everything, the music, the hiss and the clicks. Lower values sound older and duller.' },
          mix: { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the processed sound, from 0 (the dry sound alone, at the same level) to 1 (the processed sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' },
    },
  },
};

/**
 * 揺らす量の上限。速さの比のずれで持つ(0.01 は 1%、約 17 セント)。tape の FLUTTER_DEPTH と同じ値。
 * 盤の反りでどれくらい揺れるのかは確かめていない。効果として聞いて分かる大きさに取った
 */
const WOW_DEPTH = 0.01;

/**
 * vinyl の処理器。入口 1 つ、出口 1 つ。チャンネルごとに遅れ線とフィルタを持つ。
 * 揺れとパチパチは左右で共にし、雑音だけを左右で別にする。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const VINYL_CODE = `
const LATENCY = ${VINYL_LATENCY};
const WOW_DEPTH = ${WOW_DEPTH};
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(VINYL_FX.vinyl.params).map(([k, v]) => [k, v.default])))};
// パチパチの大きさの上限(crackle 1 のとき)と、パチパチに掛けるハイパスの角
const CRACKLE_PEAK = 0.25;
const CLICK_HP = 1000;
// 雑音。hiss 1 で実効値 0.02(約 -34dB)。tape と同じく hiss の 2 乗で効かせる。
// highcut の既定(12kHz)のローパスを通ると、約 -37dB になる
const HISS_RMS = 0.02;
// 揺れの強さが移る間隔(秒)。tape のワウと同じ
const DRIFT_SEC = 2;
const SEED = 0x3a1b;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
${TAPE_WOBBLE_CODE}
class Vinyl extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const sr = sampleRate;
    const crackle = v('crackle', 0, 1), hiss = v('hiss', 0, 1);
    this.clickAmp = crackle * CRACKLE_PEAK;
    this.clickP = v('density', 0, 50) / sr;
    this.hissAmp = hiss * hiss * HISS_RMS * Math.sqrt(3);   // 一様乱数の実効値は 1/√3
    this.hp = Math.exp(-2 * Math.PI * CLICK_HP / sr);
    this.hx = 0; this.hy = 0;
    // 遅れ線。決まった遅れ base のまわりを、回転の速さで揺らす。遅れ D sin(2π f t) で、高さは 2π f D ずれる
    const f = v('rpm', 33, 78) / 60;
    this.base = Math.max(1, Math.round(LATENCY * sr));
    let n = 4;
    while (n < this.base * 2 + 4) n *= 2;
    this.size = n; this.mask = n - 1; this.w = 0;
    this.depth = v('wow', 0, 1) * WOW_DEPTH / (2 * Math.PI * f) * sr;
    const w = 2 * Math.PI * f / sr;
    this.osc = [1, 0, Math.cos(w), Math.sin(w)];
    this.rand = rng(SEED);
    this.drift = new Drift(this.rand, Math.max(1, Math.round(DRIFT_SEC * sr)));
    // 全体に掛ける 2 極のローパス(バターワース、双一次変換)
    const t = Math.tan(Math.PI * Math.min(v('highcut', 2000, 20000), sr * 0.45) / sr), q = Math.SQRT2;
    const n0 = 1 / (1 + q * t + t * t);
    this.b0 = t * t * n0; this.b1 = 2 * this.b0; this.a1 = 2 * (t * t - 1) * n0; this.a2 = (1 - q * t + t * t) * n0;
    this.mod = new Float32Array(128);
    this.click = new Float32Array(128);
    this.chans = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  chan(c) {
    return this.chans[c] || (this.chans[c] = {
      buf: new Float32Array(this.size), z1: 0, z2: 0, rand: rng(SEED + 0x9e37 * (c + 1)),
    });
  }
  // このブロックの遅れとパチパチを、左右で共にするぶんとして先に作る
  shared(len) {
    if (this.mod.length < len) { this.mod = new Float32Array(len); this.click = new Float32Array(len); }
    const m = this.mod, k = this.click, o = this.osc, rand = this.rand;
    for (let i = 0; i < len; i++) {
      const c = o[0], s = o[1];
      o[0] = c * o[2] - s * o[3];
      o[1] = s * o[2] + c * o[3];
      m[i] = this.base + this.depth * o[1] * (0.6 + 0.4 * this.drift.next());
      let x = 0;
      if (this.clickP > 0 && rand() * 0.5 + 0.5 < this.clickP) {
        const u = rand() * 0.5 + 0.5;
        x = (rand() < 0 ? -1 : 1) * this.clickAmp * u * u * u * u;
      }
      // パチパチだけに掛ける 1 次のハイパス
      this.hy = this.hp * (this.hy + x - this.hx);
      this.hx = x;
      if (Math.abs(this.hy) < 1e-20) this.hy = 0;
      k[i] = this.hy;
    }
    const r = 1.5 - 0.5 * (o[0] * o[0] + o[1] * o[1]); o[0] *= r; o[1] *= r;
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length;
    this.shared(len);
    const m = this.mod, k = this.click, mask = this.mask, size = this.size, hissAmp = this.hissAmp;
    const b0 = this.b0, b1 = this.b1, a1 = this.a1, a2 = this.a2;
    const w0 = this.w;
    for (let c = 0; c < out.length; c++) {
      const s = this.chan(c);
      const x = inp && (inp[c] || inp[0]);
      const y = out[c];
      const buf = s.buf;
      let z1 = s.z1, z2 = s.z2, w = w0;
      for (let i = 0; i < len; i++) {
        buf[w] = x ? x[i] : 0;
        // 4 点のエルミート補間で、端数の位置を読む(tape と同じ)
        const d = m[i];
        const di = Math.floor(d), f = d - di;
        const j = w - di + size;
        const y1 = buf[(j + 1) & mask], ya = buf[j & mask], ym1 = buf[(j - 1) & mask], ym2 = buf[(j - 2) & mask];
        const c1 = 0.5 * (ym1 - y1);
        const c2 = y1 - 2.5 * ya + 2 * ym1 - 0.5 * ym2;
        const c3 = 0.5 * (ym2 - y1) + 1.5 * (ya - ym1);
        let u = ((c3 * f + c2) * f + c1) * f + ya + k[i];
        if (hissAmp > 0) u += s.rand() * hissAmp;
        // ローパス(直接形 II の転置)
        const o = b0 * u + z1;
        z1 = b1 * u - a1 * o + z2;
        z2 = b0 * u - a2 * o;
        y[i] = o;
        w = (w + 1) & mask;
      }
      s.z1 = Math.abs(z1) < 1e-20 ? 0 : z1; s.z2 = Math.abs(z2) < 1e-20 ? 0 : z2;
      if (c === out.length - 1) this.w = w;
    }
    return true;
  }
}
registerProcessor('${VINYL_NODE}', Vinyl);
`;
