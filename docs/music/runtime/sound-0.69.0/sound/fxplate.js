// プレートリバーブ。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// 大きな鉄板を揺らして、その響きを拾う。EMT 140 のような機材の響きにならった。
// 部屋の響き(reverb)より明るく、立ち上がりからすぐに密になる。スネアや声によく使われる。
//
// ---- 作り ----
//
// reverb は、ノイズを少しずつ小さくした響きの波形を畳み込む(ConvolverNode)。
// こちらは畳み込まず、遅れ線とオールパスを組んだ輪を回す(アルゴリズムのリバーブ)。
// 響きの長さを変えても重さが変わらず、AudioWorklet 1 つで済む。
//
// 形は Jon Dattorro の「Effect Design Part 1」(1997)のプレートの図にならった。
// 4 本のオールパスで入口の音を散らし、2 つの半分からなる輪に入れる。半分ごとに、
// 揺らしたオールパス、遅れ、高音を削るローパス、減衰、もう 1 本のオールパス、遅れを通り、
// 反対の半分へ渡る。左右の出口は、輪のあちこちから 7 か所ずつ取り出して合わせる。
// 遅れの長さと取り出す位置は、図の 29761Hz の値として覚えているものを、
// サンプリング周波数に合わせて伸び縮みさせた。論文と突き合わせてはいない。
//
// 輪の中の処理(PLATE_TANK_CODE)は gatedreverb(sound/fxgatedreverb.js)も使う。

/** plate の処理器の名前 */
export const PLATE_NODE = 'mmsxx-plate';

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const PLATE_FX = {
  plate: {
    tags: ['space', 'vintage'], dev: ['wip'], version: '0.1',
    desc: 'Plate reverb, after the studio plates of the 1960s and 70s such as the EMT 140. A large steel sheet is set ringing by the sound. Compared with reverb, the ring is brighter and turns dense straight away, without the separate early echoes of a room. A classic on snares and vocals. With a stereo player the ring spreads to both sides.',
    params: {
      decay: { live: false, unit: 's', min: 0.2, max: 10, default: 2, desc: 'Seconds for the ring to fade by 60 dB, roughly. Plates were often set between 1.5 and 4.' },
      highcut: { live: false, unit: 'Hz', min: 1000, max: 20000, default: 9000, desc: 'Cutoff of a gentle low-pass inside the ring. Every pass round it softens the highs again, so lower values make the ring grow darker as it fades. High values keep the bright shimmer of a plate.' },
      predelay: { live: false, unit: 'ms', min: 0, max: 200, default: 10, desc: 'Milliseconds of silence before the ring starts. A little predelay keeps the attack of the dry sound clear of the ring.' },
      mix: { live: false, min: 0, max: 1, default: 0.25, desc: 'How much of the sound is ring, from 0 (the dry sound alone) to 1 (the ring alone). Set 1 when the plate sits on a send, where the dry sound reaches the tune by its own path.' },
    },
  },
};

/**
 * 輪の中の処理。`PlateTank` を 1 つ作り、1 サンプルずつ `step(x)` を呼ぶと、左右の響きを
 * `l` と `r` に置く。入口はモノラル 1 本(左右を合わせたもの)。
 *
 * 響きの長さ(decay)から、1 か所の減衰の倍率を出す。輪を 1 周すると減衰を 4 回通るので、
 * 輪の長さ(遅れとオールパスの長さの和)のぶんで 60dB 下がるように 4 乗根を取る。
 * オールパスの中に溜まるぶんは数えていないので、聞こえる長さはこれより少し長くなる。
 *
 * 大きさは、響きの長さによらず、ノイズを通したときに元の音と同じくらいになるように揃える
 * (reverb の reverbImpulse と同じ考え方)。decay の 0.15 乗で割る。係数(PLATE_GAIN と PLATE_GAIN_POW)は、
 * Node でノイズを通して測った値に合わせた(0.5 秒、2 秒、6 秒で、左右とも ±1dB に入るように)
 */
export const PLATE_TANK_CODE = `
// Dattorro の図の長さ(29761Hz のサンプル数)
const DT_SR = 29761;
const DT_IN = [[142, 0.75], [107, 0.75], [379, 0.625], [277, 0.625]];
const DT_A = { ap1: 672, d1: 4453, ap2: 1800, d2: 3720 };
const DT_B = { ap1: 908, d1: 4217, ap2: 2656, d2: 3163 };
// 揺らしたオールパスの、揺れの幅(サンプル)と速さ(Hz)
const DT_EXC = 16, DT_MOD = [1.0, 0.83];
// 取り出す位置。[どこから, 位置, 符号]。どこから = 0 A の d1, 1 A の ap2, 2 A の d2, 3 B の d1, 4 B の ap2, 5 B の d2
const DT_TAP_L = [[3, 266, 1], [3, 2974, 1], [4, 1913, -1], [5, 1996, 1], [0, 1990, -1], [1, 187, -1], [2, 1066, -1]];
const DT_TAP_R = [[0, 353, 1], [0, 3627, 1], [1, 1228, -1], [2, 2673, 1], [3, 2111, -1], [4, 335, -1], [5, 121, -1]];
const PLATE_GAIN = 0.62, PLATE_GAIN_POW = 0.15;

/** 遅れ線。長さは 2 のべき乗に切り上げ、書く位置を 1 つ持つ */
class DLine {
  constructor(n) { let m = 4; while (m < n + 4) m *= 2; this.b = new Float64Array(m); this.mask = m - 1; this.w = 0; this.n = n; }
  at(d) { return this.b[(this.w - d) & this.mask]; }
  push(v) { this.b[this.w] = v; this.w = (this.w + 1) & this.mask; }
}

class PlateTank {
  constructor(sr, time, highcut) {
    const s = (n) => Math.max(1, Math.round(n * sr / DT_SR));
    this.ins = DT_IN.map(([n]) => new DLine(s(n)));
    this.insG = DT_IN.map(([, g]) => g);
    const half = (h) => ({
      ap1: new DLine(s(h.ap1) + s(DT_EXC) + 2), ap1n: s(h.ap1),
      d1: new DLine(s(h.d1)), ap2: new DLine(s(h.ap2)), d2: new DLine(s(h.d2)), lp: 0,
    });
    this.A = half(DT_A); this.B = half(DT_B);
    this.exc = DT_EXC * sr / DT_SR;
    this.lines = [this.A.d1, this.A.ap2, this.A.d2, this.B.d1, this.B.ap2, this.B.d2];
    this.tapL = DT_TAP_L.map(([k, n, g]) => [k, s(n), g]);
    this.tapR = DT_TAP_R.map(([k, n, g]) => [k, s(n), g]);
    const loop = [DT_A, DT_B].reduce((t, h) => t + h.ap1 + h.d1 + h.ap2 + h.d2, 0) / DT_SR;
    this.decay = Math.pow(10, -3 * loop / (4 * time));
    // 2 本目のオールパスの係数。Dattorro の図では、減衰に 0.15 を加えて 0.25〜0.5 に収めたもの
    this.dd2 = Math.min(0.5, Math.max(0.25, this.decay + 0.15));
    this.damp = Math.exp(-2 * Math.PI * highcut / sr);
    this.gain = PLATE_GAIN * Math.pow(time, -PLATE_GAIN_POW);
    // 揺れは回転で進める(毎サンプル sin を呼ばない)。[cos, sin, 1 サンプルの cos, sin]
    this.osc = DT_MOD.map((f, k) => {
      const w = 2 * Math.PI * f / sr, p0 = k * Math.PI / 2;
      return [Math.cos(p0), Math.sin(p0), Math.cos(w), Math.sin(w)];
    });
    this.n = 0;
    this.fbA = 0; this.fbB = 0;
    this.l = 0; this.r = 0;
  }
  // オールパス(格子の形)。w = x + g·z、y = z − g·w。z は D サンプル前の w
  static ap(line, g, x) {
    const z = line.b[(line.w - line.n) & line.mask];
    const w = x + g * z;
    line.b[line.w] = w; line.w = (line.w + 1) & line.mask;
    return z - g * w;
  }
  half(h, x, q) {
    // 揺らしたオールパス。遅れの端数は、となりの 2 点をまっすぐつないで読む
    const d = h.ap1n + this.exc * q[1] - 1;
    const i = Math.floor(d), f = d - i;
    const z = h.ap1.at(i) * (1 - f) + h.ap1.at(i + 1) * f;
    const w = x - 0.7 * z;
    h.ap1.push(w);
    h.d1.push(z + 0.7 * w);
    const v = h.d1.at(h.d1.n);
    h.lp = v * (1 - this.damp) + h.lp * this.damp;
    if (Math.abs(h.lp) < 1e-20) h.lp = 0;
    h.d2.push(PlateTank.ap(h.ap2, this.dd2, h.lp * this.decay));
    return h.d2.at(h.d2.n) * this.decay;
  }
  step(x) {
    const ins = this.ins, g = this.insG;
    x = PlateTank.ap(ins[0], g[0], x);
    x = PlateTank.ap(ins[1], g[1], x);
    x = PlateTank.ap(ins[2], g[2], x);
    x = PlateTank.ap(ins[3], g[3], x);
    const o = this.osc;
    for (let k = 0; k < 2; k++) {
      const q = o[k], c = q[0], sn = q[1];
      q[0] = c * q[2] - sn * q[3];
      q[1] = sn * q[2] + c * q[3];
    }
    // 回転を続けると丸めで半径がずれていくので、ときどき 1 へ戻す
    if (++this.n >= 128) {
      this.n = 0;
      for (const q of o) { const r = 1.5 - 0.5 * (q[0] * q[0] + q[1] * q[1]); q[0] *= r; q[1] *= r; }
    }
    const a = this.half(this.A, x + this.fbB, o[0]);
    const b = this.half(this.B, x + this.fbA, o[1]);
    this.fbA = a; this.fbB = b;
    const L = this.lines, tl = this.tapL, tr = this.tapR;
    let l = 0, r = 0;
    for (let k = 0; k < 7; k++) {
      const p = tl[k], u = tr[k];
      l += p[2] * L[p[0]].at(p[1]);
      r += u[2] * L[u[0]].at(u[1]);
    }
    this.l = l * this.gain; this.r = r * this.gain;
  }
}
`;

/**
 * plate の処理器。入口 1 つ、出口 1 つ。入口は左右を合わせて 1 本にして輪へ入れ、
 * 出口が 2 本なら左右に別の響きを、1 本なら左右を合わせて √2 で割ったものを出す
 * (左右の響きは似ていないので、合わせると力が倍になる。√2 で割ると 1 本ぶんの大きさに戻る)。
 * ステレオで鳴らすときは、出口を 2 本に決める(`COLOR_WORKLETS` の `stereo`)。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const PLATE_CODE = `
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(PLATE_FX.plate.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
${PLATE_TANK_CODE}
class Plate extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    this.tank = new PlateTank(sampleRate, v('decay', 0.2, 10), v('highcut', 1000, 20000));
    this.mix = v('mix', 0, 1);
    this.pre = new DLine(Math.max(1, Math.round(v('predelay', 0, 200) / 1000 * sampleRate)));
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, mix = this.mix, t = this.tank, pre = this.pre;
    const xl = inp && inp[0], xr = inp && (inp[1] || inp[0]);
    const yl = out[0], yr = out[1];
    const both = inp && inp.length > 1 ? 0.5 : 1;
    for (let i = 0; i < len; i++) {
      const a = xl ? xl[i] : 0, b = xr ? xr[i] : 0;
      pre.push(inp && inp.length > 1 ? (a + b) * both : a);
      t.step(pre.at(pre.n));
      if (yr) {
        yl[i] = a * (1 - mix) + t.l * mix;
        yr[i] = b * (1 - mix) + t.r * mix;
      } else {
        yl[i] = a * (1 - mix) + (t.l + t.r) * Math.SQRT1_2 * mix;
      }
    }
    return true;
  }
}
registerProcessor('${PLATE_NODE}', Plate);
`;
