// イコライザー(eq)。全体かチャンネルに掛けるエフェクト(2026-10-26)。
//
// 高さの帯を選んで、持ち上げたり削ったりする。DAW の標準の EQ(Ableton の EQ Eight、
// Logic の Channel EQ、Cubase のチャンネル EQ、FabFilter Pro-Q)と同じ形にした。
// 1 つのエフェクトの中にバンドが 4 つあり、バンドごとに種類・周波数・gain・Q を持つ。
//
// - 種類(`typeA`〜`typeD`)は 0 がローシェルフ(freq より下を gain dB)、1 がベル(freq のまわりの帯を gain dB)、
//   2 がハイシェルフ(freq より上を gain dB)。名前(lowshelf bell highshelf)でも書ける。既定は 1 番目がローシェルフ、2・3 番目がベル、4 番目がハイシェルフ
// - gain 0 のバンドは素通し。DAW のバンドごとのオンとオフの代わりにしている
// - Q はベルでは帯の幅(大きいほど狭い)、シェルフでは肩の形(0.71 で山も谷も無く、大きくすると肩に山と谷が付く)
// - 4 つで足りなければ、2 台目の eq を並べる(`#fx body = eq …` と宣言して名前を分ける)
//
// 前は低い棚・中の山・高い棚の 3 つの帯が決まった形で、値の名前も lowGain midFreq のように帯ごとだった。
// ベルを並べられず(弦の胴の山)、種類も選べなかったので、DAW の形に直した(2026-10-26)。古い名前は消した。
//
// フィルタは 2 極の SVF。Andrew Simper(Cytomic)の「SvfLinearTrapOptimised2」の式で、
// いまの lowpass などと同じ作り。出口の混ぜ方(m0・m1・m2)を変えて、ベルとシェルフにする。
// 値を動かしても壊れにくい形なので、周波数・gain・Q を鳴らしながら動かせる(`live`)。
// 係数はブロック(128 サンプル)ごとに作り、値が動いたブロックでは前のブロックの係数から
// 1 サンプルずつ寄せる。gain 0 なら係数がちょうど素通しになり、元の音がそのまま出る。
//
// DAW の EQ には drive も Dry/Wet も無いので、どちらも持たせていない。出口の音量も持たせていない
// (EQ Eight と Pro-Q は持っているが、ほかのエフェクトか #gain で足りる)

/** eq の処理器の名前 */
export const EQ_NODE = 'mmsxx-eq';

/** バンドの数 */
export const EQ_BANDS = 4;

/**
 * バンドの名前。値の名前のうしろに付ける(`freqA` `gainB`)。
 * DAW は 1〜8 の番号で呼ぶが、MML の値の名前は英字だけと決めてあり、
 * 詰めて書いた `@gain16` を名前と数に切り分けられなくなるので、英字にした
 */
export const EQ_BAND_NAMES = ['A', 'B', 'C', 'D'];

/** 種類の番号 */
export const EQ_TYPES = { lowshelf: 0, bell: 1, highshelf: 2 };

/**
 * 種類の値の名前と説明。`@typeA bell` のように名前でも書ける(2026-10-26)。
 * 名前は Web Audio の BiquadFilterNode の type(lowshelf highshelf)と同じ綴りにした
 */
const EQ_TYPE_CHOICES = [
  { value: EQ_TYPES.lowshelf, name: 'lowshelf', desc: 'Low shelf. Lifts or cuts everything below freq.' },
  { value: EQ_TYPES.bell, name: 'bell', desc: 'Bell. Lifts or cuts the band around freq.' },
  { value: EQ_TYPES.highshelf, name: 'highshelf', desc: 'High shelf. Lifts or cuts everything above freq.' },
];

/** バンドごとの既定(周波数と種類) */
const BAND_DEF = [
  { freq: 100, type: EQ_TYPES.lowshelf },
  { freq: 500, type: EQ_TYPES.bell },
  { freq: 2000, type: EQ_TYPES.bell },
  { freq: 8000, type: EQ_TYPES.highshelf },
];

const bandParams = () => {
  const out = {};
  BAND_DEF.forEach((b, i) => {
    const n = EQ_BAND_NAMES[i];
    out['freq' + n] = { live: true, unit: 'Hz', min: 20, max: 20000, default: b.freq, desc: `Frequency of band ${n}. For a bell it is the centre; for a shelf it is the middle of the slope, where the shelf has half its gain.` };
    out['gain' + n] = { live: true, unit: 'dB', min: -24, max: 24, default: 0, desc: `How far band ${n} lifts (positive) or cuts (negative), in dB. 0 leaves the sound alone, so the band is off.` };
    out['q' + n] = { live: true, min: 0.1, max: 18, default: 0.71, desc: `Q of band ${n}. For a bell, how narrow the band is: 0.71 is broad, 4 and above touch only a thin slice. For a shelf, the shape of the shoulder: 0.71 is smooth; higher values add a small bump and dip either side of the slope.` };
    out['type' + n] = { live: false, min: 0, max: 2, default: b.type, choices: EQ_TYPE_CHOICES, desc: `Shape of band ${n}: a number, rounded to a whole one, or the name of one of the choices (lowshelf, bell, highshelf).` };
  });
  out.mix = { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the equalised sound, from 0 (the dry sound alone, at the same level) to 1 (the equalised sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added.' };
  return out;
};

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const EQ_FX = {
  eq: {
    tags: ['eq', 'mixing'], dev: ['wip'], version: '0.1',
    desc: 'Equaliser with four bands, like the stock EQ of a DAW. Each band is a low shelf, a bell or a high shelf, with its own frequency, gain and Q, so several bells can sit side by side, for example the body resonances of a string instrument. A band with gain 0 does nothing. Frequency, gain and Q can move while the sound plays. For more bands, add a second eq.',
    params: bandParams(),
  },
};

/**
 * バンド 1 つの係数。Simper の SVF の [a1, a2, a3, m0, m1, m2]
 * @param {number} type 0 ローシェルフ、1 ベル、2 ハイシェルフ
 * @param {number} f 周波数(Hz)
 * @param {number} db gain(dB)
 * @param {number} q Q
 * @param {number} sr サンプリング周波数
 */
export function eqBandCoefs(type, f, db, q, sr) {
  const A = Math.pow(10, db / 40);
  let g = Math.tan(Math.PI * Math.min(f, sr * 0.49) / sr);
  let k, m0, m1, m2;
  if (type === 0) {
    g /= Math.sqrt(A); k = 1 / q;
    m0 = 1; m1 = k * (A - 1); m2 = A * A - 1;
  } else if (type === 2) {
    g *= Math.sqrt(A); k = 1 / q;
    m0 = A * A; m1 = k * (1 - A) * A; m2 = 1 - A * A;
  } else {
    k = 1 / (q * A);
    m0 = 1; m1 = k * (A * A - 1); m2 = 0;
  }
  const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
  return [a1, a2, a3, m0, m1, m2];
}

/**
 * eq の処理器。入口 1 つ、出口 1 つ。チャンネルごと、バンドごとに 2 つの状態を持つ。
 * AudioParam `freqA` `gainA` `qA` … `qD`(k-rate)。作るときの値は processorOptions にも入れる
 * (AudioParam を受けないところで回しても、その値で鳴るように)。種類は作るときに決まる。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const EQ_CODE = `
const NB = ${EQ_BANDS};
const BN = ${JSON.stringify(EQ_BAND_NAMES)};
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(EQ_FX.eq.params).map(([k, v]) => [k, v.default])))};
const RANGE = ${JSON.stringify(Object.fromEntries(Object.entries(EQ_FX.eq.params).map(([k, v]) => [k, [v.min, v.max]])))};
const eqBandCoefs = ${eqBandCoefs.toString()};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

class Eq extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    const out = [];
    for (const b of BN) {
      for (const k of ['freq', 'gain', 'q']) {
        const n = k + b;
        out.push({ name: n, defaultValue: DEF[n], minValue: RANGE[n][0], maxValue: RANGE[n][1], automationRate: 'k-rate' });
      }
    }
    return out;
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    const v = (k) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], RANGE[k][0], RANGE[k][1]);
    this.band = [];
    for (const b of BN) {
      this.band.push({
        type: Math.round(v('type' + b)),
        f0: v('freq' + b), g0: v('gain' + b), q0: v('q' + b),
        // いまの値と係数。null はまだ作っていない
        f: NaN, g: NaN, q: NaN, c: null,
        // 前のブロックの gain。0 から 0 のあいだは回さない
        pg: 0,
      });
    }
    this.st = [];
    this.tmp = new Float64Array(6);
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length;
    for (let ch = 0; ch < out.length; ch++) {
      const x = inp && (inp[ch] || inp[0]);
      if (x) out[ch].set(x); else out[ch].fill(0);
    }
    const sr = sampleRate;
    for (let b = 0; b < NB; b++) {
      const bd = this.band[b], n = BN[b];
      const read = (k, d) => (params && params[k + n] ? clamp(params[k + n][0], RANGE[k + n][0], RANGE[k + n][1]) : d);
      const f = read('freq', bd.f0), g = read('gain', bd.g0), q = read('q', bd.q0);
      const prev = bd.c;
      const moved = f !== bd.f || g !== bd.g || q !== bd.q;
      if (moved) { bd.c = eqBandCoefs(bd.type, f, g, q, sr); bd.f = f; bd.g = g; bd.q = q; }
      // gain 0 のバンドは回さない(素通しの係数なので、回しても同じ)。状態は捨てる。
      // 0 へ寄せるブロックだけは回す(前の係数から寄せないと段差が出る)
      const pg = bd.pg;
      bd.pg = g;
      if (g === 0 && pg === 0) {
        for (const s of this.st) if (s) s.fill(0, b * 2, b * 2 + 2);
        continue;
      }
      const c = bd.c;
      // 値が動いたブロックは、前の係数から 1 サンプルずつ寄せる
      const from = moved && prev ? prev : c;
      const d = this.tmp;
      for (let j = 0; j < 6; j++) d[j] = (c[j] - from[j]) / len;
      for (let ch = 0; ch < out.length; ch++) {
        const y = out[ch];
        const st = this.st[ch] || (this.st[ch] = new Float64Array(NB * 2));
        let ic1 = st[b * 2], ic2 = st[b * 2 + 1];
        let a1 = from[0], a2 = from[1], a3 = from[2], m0 = from[3], m1 = from[4], m2 = from[5];
        for (let i = 0; i < len; i++) {
          a1 += d[0]; a2 += d[1]; a3 += d[2]; m0 += d[3]; m1 += d[4]; m2 += d[5];
          const v0 = y[i];
          const v3 = v0 - ic2;
          const v1 = a1 * ic1 + a2 * v3;
          const v2 = ic2 + a2 * ic1 + a3 * v3;
          ic1 = 2 * v1 - ic1;
          ic2 = 2 * v2 - ic2;
          y[i] = m0 * v0 + m1 * v1 + m2 * v2;
        }
        st[b * 2] = ic1; st[b * 2 + 1] = ic2;
      }
    }
    return true;
  }
}
registerProcessor('${EQ_NODE}', Eq);
`;
