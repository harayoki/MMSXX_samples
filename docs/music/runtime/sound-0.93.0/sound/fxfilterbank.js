// フィルタバンク(filterbank)。全体かチャンネルかバスに掛けるエフェクト(2026-11-17)。
//
// 決まった高さのバンドパスを 12 本並べ、両端にローパスとハイパスを置いて、出口で足す。
// バンドごとに音量(0〜1)を持ち、下げると、そこが切れる。Moog の 914(Fixed Filter Bank)にならった。
//
// - 中心は 125Hz から 5600Hz まで、半オクターブおき(125 175 250 350 500 700 1000 1400 2000 2800 4000 5600)。
//   914 のパネルの写真で 11 本を読み、残りの 350 を並びから補った。同じ並びはプラグインの説明書(Turn2on の FFB914)にもある
// - 両端の `low` と `high` は、パネルでは LOW PASS と HIGH PASS と書かれている。Sound On Sound の AJH の複製のレビューは、
//   実際にはシェルフで、Moog がそう呼んだと書いている。カットオフは確かめられなかったので、
//   ここでは並びの外へ半オクターブ出したところ(88Hz と 7920Hz)に 2 極のローパスとハイパスを置いた
// - バンド 1 本は、2 極の SVF のバンドパスを 2 段重ねたもの。両側は 12dB/oct で落ちる。
//   12dB/oct は AJH の複製の値で、作った人が元の 914 に合わせたと言っている。元の機械の鋭さは確かめていない
// - Q は 1 段あたり 5。全部 1 でも平らにならず、バンドの中心に山、あいだに谷が並ぶ。山と谷の差は 9dB ほど(計算で見た値)。
//   これが「くし型」に聞こえるところ
// - 足すときは 1 本おきに向きを返す。2 段重ねたバンドパスは、隣どうしが真ん中で向きが逆になる。
//   そのまま足すと、そこで打ち消し合っていた隣が、1 本切ったときに打ち消されなくなり、切ったところが埋まる。
//   Q 3 でそのまま足したときは、1000Hz を切っても 4dB しか下がらなかった。いまの形では 21dB 下がる
// - Q と足し方は、元の機械を測ったものではなく、ここで決めた
// - 出口は MAKEUP 倍する。いまは 1(全部 1 のとき、山がもともと 0dB あたりに来る)
// - 値はどれも鳴らしながら動かせる(`live`)。ブロック(128 サンプル)のあいだに、前の値から 1 サンプルずつ寄せる。
//   0 のバンドは回さない(状態は捨てる)

/** filterbank の処理器の名前 */
export const FILTERBANK_NODE = 'mmsxx-filterbank';

/** バンドの中心(Hz)。半オクターブおき */
export const FILTERBANK_FREQS = [125, 175, 250, 350, 500, 700, 1000, 1400, 2000, 2800, 4000, 5600];

/**
 * バンドの名前。値の名前のうしろに付ける(`gainA` 〜 `gainL`)。
 * eq と同じく、MML の値の名前は英字だけと決めてあるので英字にした
 */
export const FILTERBANK_BAND_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

/** 両端のカットオフ(Hz)。並びの外へ半オクターブ */
export const FILTERBANK_LOW = 125 / Math.SQRT2;
export const FILTERBANK_HIGH = 5600 * Math.SQRT2;

/** バンドパス 1 段の Q */
export const FILTERBANK_Q = 5;

/** 出口の倍率(全部 1 のとき、山が 0dB あたりに来るように) */
export const FILTERBANK_MAKEUP = 1;

const level = (what) => ({ live: true, min: 0, max: 1, default: 1, desc: `Level of ${what}, from 0 (cut out) to 1 (full). The default is 1.` });

const params = () => {
  const out = { low: level(`the low pass section below the bands (cutoff about ${Math.round(FILTERBANK_LOW)} Hz)`) };
  FILTERBANK_BAND_NAMES.forEach((n, i) => {
    out['gain' + n] = level(`band ${n}, the band pass centred on ${FILTERBANK_FREQS[i]} Hz`);
  });
  out.high = level(`the high pass section above the bands (cutoff about ${Math.round(FILTERBANK_HIGH)} Hz)`);
  out.mix = { live: true, min: 0, max: 1, default: 1, desc: 'How much of the sound is the filtered sound, from 0 (the dry sound alone, at the same level) to 1 (the filtered sound alone). It is mixed outside the processor, so a value below 1 adds a few nodes; at 1 nothing is added. The bands shift the phase, so mixing with the dry sound adds notches of its own.' };
  return out;
};

/** 定義。EFFECTS(sound/fx.js)と同じ形 */
export const FILTERBANK_FX = {
  filterbank: {
    tags: ['eq', 'filter'], version: '0.1',
    desc: 'Fixed filter bank, modelled on the Moog 914. Twelve band pass filters at half octave steps from 125 Hz to 5.6 kHz, with a low pass below them and a high pass above, all summed. Each one has a level from 0 to 1; turn one down to cut that part of the sound out. Unlike an equaliser it is never flat: the bands are narrow, so even with every level at 1 the response is a row of peaks at the centres and dips between them, about 9 dB apart, like the teeth of a comb spaced in octaves rather than in Hz. The levels can move while the sound plays.',
    params: params(),
  },
};

/**
 * filterbank の処理器。入口 1 つ、出口 1 つ。チャンネルごとに、バンドパス 2 段 × 12 本と両端の 2 つの状態を持つ。
 * AudioParam `low` `gainA` 〜 `gainL` `high`(k-rate)。作るときの値は processorOptions にも入れる
 * (AudioParam を受けないところで回しても、その値で鳴るように)。
 * 要らなくなったら port へ { stop: true } を送る(sound/filter.js と同じ)
 */
export const FILTERBANK_CODE = `
// 小さすぎる値は 0 にする(非正規化数で重くならないように。sound/filter.js と同じ)
const fz = (x) => (x > -1e-20 && x < 1e-20 ? 0 : x);
const FREQS = ${JSON.stringify(FILTERBANK_FREQS)};
const NAMES = ['low', ...${JSON.stringify(FILTERBANK_BAND_NAMES)}.map((n) => 'gain' + n), 'high'];
const LOWF = ${FILTERBANK_LOW}, HIGHF = ${FILTERBANK_HIGH}, Q = ${FILTERBANK_Q}, MAKEUP = ${FILTERBANK_MAKEUP};
const DEF = ${JSON.stringify(Object.fromEntries(Object.entries(FILTERBANK_FX.filterbank.params).map(([k, v]) => [k, v.default])))};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// Simper の SVF の係数 [a1, a2, a3, k]
const svf = (f, q) => {
  const g = Math.tan(Math.PI * Math.min(f, sampleRate * 0.49) / sampleRate), k = 1 / q;
  const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
  return [a1, a2, a3, k];
};

class FilterBank extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return NAMES.map((name) => ({ name, defaultValue: DEF[name], minValue: 0, maxValue: 1, automationRate: 'k-rate' }));
  }
  constructor(o) {
    super();
    const p = (o && o.processorOptions) || {};
    // 0 番目が low、1〜12 番目がバンド、13 番目が high
    this.c = [svf(LOWF, Math.SQRT1_2), ...FREQS.map((f) => svf(f, Q)), svf(HIGHF, Math.SQRT1_2)];
    this.g0 = NAMES.map((k) => clamp(Number.isFinite(p[k]) ? p[k] : DEF[k], 0, 1));
    this.pg = this.g0.slice();
    this.st = [];
    this.alive = true;
    this.port.onmessage = (e) => { if (e.data && e.data.stop) this.alive = false; };
  }
  process(inputs, outputs, params) {
    if (!this.alive) return false;
    const inp = inputs[0], out = outputs[0];
    if (!out || !out.length) return true;
    const len = out[0].length, n = NAMES.length;
    const g = NAMES.map((k, j) => (params && params[k] ? clamp(params[k][0], 0, 1) : this.g0[j]));
    const pg = this.pg;
    for (let ch = 0; ch < out.length; ch++) {
      const x = inp && (inp[ch] || inp[0]);
      const y = out[ch];
      y.fill(0);
      // 状態は 1 つの SVF に 2 つ。low と high は 1 段、バンドは 2 段
      const st = this.st[ch] || (this.st[ch] = new Float64Array(n * 4));
      for (let j = 0; j < n; j++) {
        const to = g[j], from = pg[j];
        if (to === 0 && from === 0) { st.fill(0, j * 4, j * 4 + 4); continue; }
        if (!x) continue;
        const [a1, a2, a3, k] = this.c[j];
        const d = (to - from) / len;
        let lv = from;
        let s1 = st[j * 4], s2 = st[j * 4 + 1], t1 = st[j * 4 + 2], t2 = st[j * 4 + 3];
        for (let i = 0; i < len; i++) {
          lv += d;
          const v0 = x[i];
          let v3 = v0 - s2;
          let v1 = a1 * s1 + a2 * v3;
          let v2 = s2 + a2 * s1 + a3 * v3;
          s1 = 2 * v1 - s1; s2 = 2 * v2 - s2;
          let o;
          if (j === 0) o = v2;
          else if (j === n - 1) o = v0 - k * v1 - v2;
          else {
            // 1 段目の出口(山の高さ 1 に揃えたバンドパス)を 2 段目へ
            const u = k * v1;
            v3 = u - t2;
            v1 = a1 * t1 + a2 * v3;
            v2 = t2 + a2 * t1 + a3 * v3;
            t1 = 2 * v1 - t1; t2 = 2 * v2 - t2;
            // 1 本おきに向きを返す(上の説明)
            o = j % 2 ? k * v1 : -k * v1;
          }
          y[i] += lv * o;
        }
        st[j * 4] = fz(s1); st[j * 4 + 1] = fz(s2); st[j * 4 + 2] = fz(t1); st[j * 4 + 3] = fz(t2);
      }
      for (let i = 0; i < len; i++) y[i] *= MAKEUP;
    }
    for (let j = 0; j < n; j++) pg[j] = g[j];
    return true;
  }
}
registerProcessor('${FILTERBANK_NODE}', FilterBank);
`;
