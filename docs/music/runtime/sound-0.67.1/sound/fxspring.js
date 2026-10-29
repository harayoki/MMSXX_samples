// スプリングリバーブ。全体かチャンネルかバスに掛けるエフェクト(2026-10-26)。
//
// ギターアンプやオルガンに入っている、ばねの響き。片方の端でばねを揺らし、
// もう片方の端で拾う。ばねの中を行き来する音は、高さによって届く速さが違うので、
// 弾いたあとに「ビヨン」と鳴る。部屋の響き(reverb)や plate とは、そこで色が違う。
//
// ---- 作り ----
//
// ばねを 2 本持つ。1 本ごとに、遅れ線の輪の中に、引き伸ばしたオールパスを何段も並べる。
// 引き伸ばしたオールパスは、1 サンプルの遅れの代わりに K サンプルの遅れを使う 1 次のオールパスで、
// 高さによって遅れが変わる。係数が正なので、遅れは高いほど長い(低い音が先に、高い音があとに届く)。
// 輪を 1 周するたびに、その遅れの差が積み重なる。
// Välimäki らの論文(2010 年ごろの、ばねのリバーブをパラメータで作るもの)として覚えている、
// 引き伸ばしたオールパスを並べる形にならった。段の数や係数は聞かずに決めたもので、
// 論文と突き合わせてはいない。実物のばねで、遅れが高さでどちら向きに変わるのかも確かめていない。
//
// - K は、遅れが変わる帯の上の端が 4.4kHz ほどになるように、サンプリング周波数から決める。
//   その上では遅れの変わり方がくり返すので、輪の中のローパス(highcut)で削る
// - 入口には 1 次のハイパス(120Hz)を置く。ばねの響きは低音が薄い
// - 2 本は輪の長さが違う(42ms と 53ms)。左右があるときは 1 本目を左、2 本目を右に出す

/** spring の処理器の名前 */
export const SPRING_NODE = 'mmsxx-spring';

/** ばね 1 本の、引き伸ばしたオールパスの段の数 */
export const SPRING_STAGES = 40;

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const SPRING_FX = {
  spring: {
    tags: ['space', 'vintage'], dev: ['wip'], version: '0.1',
    desc: 'Spring reverb, as built into guitar amps and organs. The sound shakes a pair of springs and is picked up at their far ends. Waves of different pitch travel along a spring at different speeds, so the ring has the springy "boing" and drip of surf guitars and dub. Darker and more twangy than reverb or plate. With a stereo player each spring goes to one side.',
    params: {
      decay: { live: false, unit: 's', min: 0.2, max: 6, default: 2, desc: 'Seconds for the ring to fade by 60 dB, roughly. Amp springs are usually around 2 to 3.' },
      highcut: { live: false, unit: 'Hz', min: 1000, max: 8000, default: 4000, desc: 'Cutoff of a low-pass inside the ring of each spring. Real springs pass little above about 4 or 5 kHz; higher values add a bright, splashy edge, lower values a dull, distant one.' },
      predelay: { live: false, unit: 'ms', min: 0, max: 200, default: 0, desc: 'Milliseconds of silence before the ring starts.' },
      mix: { live: false, min: 0, max: 1, default: 0.3, desc: 'How much of the sound is ring, from 0 (the dry sound alone) to 1 (the ring alone). Surf guitar often goes past 0.5.' },
    },
  },
};

/**
 * spring の処理器。入口 1 つ、出口 1 つ。入口は左右を合わせて 1 本にしてばねへ入れる。
 * 出口が 2 本なら 1 本目のばねを左、2 本目を右に、1 本なら 2 本を合わせて √2 で割ったものを出す。
 * ステレオで鳴らすときは、出口を 2 本に決める(`COLOR_WORKLETS` の `stereo`)。
 *
 * 減衰の倍率は、輪の長さ(遅れ線と、オールパスのいちばん低いところの遅れ)のぶんで 60dB 下がるように出す。
 * 大きさは plate と同じく、ノイズを通したときに元の音と同じくらいになるように揃える(SPRING_GAIN)。
 *
 * 値は作るときに渡す(processorOptions、範囲に収めて埋めたもの)。変えるときは作り直す。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const SPRING_CODE = `
const STAGES = ${SPRING_STAGES};
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(SPRING_FX.spring.params).map(([k, v]) => [k, v.default])))};
// オールパスの係数。正なので、遅れは高いほど長い
const A = 0.6;
// 遅れが変わる帯の上の端(Hz)。K = サンプリング周波数 / (2 × これ)
const TOP = 4400;
// 2 本のばねの輪の長さ(秒)
const LOOPS = [0.042, 0.053];
const HPF = 120;
const SPRING_GAIN = 1.85, SPRING_GAIN_POW = 0.28;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

class Spring extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k, lo, hi) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], lo, hi);
    const sr = sampleRate;
    const decay = v('decay', 0.2, 6), highcut = v('highcut', 1000, 8000);
    this.mix = v('mix', 0, 1);
    this.K = Math.max(1, Math.round(sr / (2 * TOP)));
    // オールパス 1 段の遅れ(サンプル)。いちばん低いところで K(1-A)/(1+A)、帯の上の端で K(1+A)/(1-A)。
    // 減衰を出すときは、低いところの遅れを使う。響きの力の多くは低い帯にあり、
    // 真ん中の遅れで出すと、響きが decay の 8 割ほどで消えた
    const low = this.K * (1 - A) / (1 + A);
    this.springs = LOOPS.map((sec) => {
      const n = Math.max(1, Math.round(sec * sr));
      let m = 4; while (m < n + 4) m *= 2;
      const loop = (n + STAGES * low) / sr;
      return {
        d: new Float64Array(m), mask: m - 1, w: 0, n,
        // 段ごとの K サンプルの控え。全部の段が同じ位置を使う
        ap: new Float64Array(STAGES * this.K),
        g: Math.pow(10, -3 * loop / decay),
        l1: 0, l2: 0, out: 0,
      };
    });
    this.apw = 0;
    // 輪の中の 2 極のローパス(バターワース、双一次変換)
    const t = Math.tan(Math.PI * Math.min(highcut, sr * 0.45) / sr), q = Math.SQRT2;
    const n0 = 1 / (1 + q * t + t * t);
    this.lb0 = t * t * n0; this.lb1 = 2 * this.lb0; this.la1 = 2 * (t * t - 1) * n0; this.la2 = (1 - q * t + t * t) * n0;
    this.hp = Math.exp(-2 * Math.PI * HPF / sr);
    this.hx = 0; this.hy = 0;
    this.gain = SPRING_GAIN * Math.pow(decay, -SPRING_GAIN_POW);
    const pre = Math.max(0, Math.round(v('predelay', 0, 200) / 1000 * sr));
    let pm = 4; while (pm < pre + 4) pm *= 2;
    this.pre = new Float64Array(pm); this.pmask = pm - 1; this.pw = 0; this.pn = pre;
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  // ばね 1 本を 1 サンプル進める。返すのはオールパスを通ったあと(拾う端)
  spring(s, x, apw) {
    let u = s.d[(s.w - s.n) & s.mask];
    // 引き伸ばしたオールパス(格子の形)。w = u − A·z、y = z + A·w。z は K サンプル前の w。
    // 伝え方は (A + z^-K) / (1 + A z^-K)
    const ap = s.ap, K = this.K;
    for (let j = 0, o = apw; j < STAGES; j++, o += K) {
      const z = ap[o];
      const w = u - A * z;
      ap[o] = w;
      u = z + A * w;
    }
    // 輪の中のローパス(直接形 II の転置)
    const y = this.lb0 * u + s.l1;
    s.l1 = this.lb1 * u - this.la1 * y + s.l2;
    s.l2 = this.lb0 * u - this.la2 * y;
    if (Math.abs(s.l1) < 1e-20) s.l1 = 0;
    if (Math.abs(s.l2) < 1e-20) s.l2 = 0;
    s.d[s.w] = x + y * s.g;
    s.w = (s.w + 1) & s.mask;
    return y;
  }
  process(inputs, outputs) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, mix = this.mix, gain = this.gain;
    const xl = inp && inp[0], xr = inp && (inp[1] || inp[0]);
    const two = inp && inp.length > 1;
    const yl = out[0], yr = out[1];
    const [s1, s2] = this.springs, K = this.K;
    for (let i = 0; i < len; i++) {
      const a = xl ? xl[i] : 0, b = xr ? xr[i] : 0;
      const m = two ? (a + b) * 0.5 : a;
      // 入口の 1 次のハイパス
      this.hy = this.hp * (this.hy + m - this.hx);
      this.hx = m;
      if (Math.abs(this.hy) < 1e-20) this.hy = 0;
      this.pre[this.pw] = this.hy;
      const x = this.pre[(this.pw - this.pn) & this.pmask];
      this.pw = (this.pw + 1) & this.pmask;
      const apw = this.apw;
      const l = this.spring(s1, x, apw) * gain, r = this.spring(s2, x, apw) * gain;
      this.apw = apw + 1 >= K ? 0 : apw + 1;
      if (yr) {
        yl[i] = a * (1 - mix) + l * mix;
        yr[i] = b * (1 - mix) + r * mix;
      } else {
        yl[i] = a * (1 - mix) + (l + r) * Math.SQRT1_2 * mix;
      }
    }
    return true;
  }
}
registerProcessor('${SPRING_NODE}', Spring);
`;
